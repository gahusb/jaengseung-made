
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createSajuPrompt } from '@/lib/saju-ai-prompt';
import { performFullAnalysis } from '@/lib/ai-interpretation';
import { config as loadDotenv } from 'dotenv';
import { resolve } from 'path';

export const runtime = 'nodejs';
// Vercel 최대 타임아웃 (Pro plan 300s, Hobby 60s)
export const maxDuration = 60;

// Next.js가 env 로드를 놓치는 경우 대비해 직접 로드 (Windows 환경 대응)
loadDotenv({ path: resolve(process.cwd(), '.env.local'), override: true });

const MOCK_INTERPRETATION = `
## 1. 일간 분석과 타고난 기질
(GEMINI_API_KEY 환경변수를 설정하고 서버를 재시작하면 실제 AI 해석을 받을 수 있습니다.)
귀하는 **갑목(甲木)** 일간으로 태어나, 마치 곧게 뻗은 소나무와 같은 기상을 지니고 있다. 리더십이 강하고 추진력이 뛰어나며, 한번 마음먹은 일은 끝까지 해내는 뚝심이 있다.

## 2. 오행 균형과 용신 기반 개운법
사주에서 **화(火)** 기운이 부족하여 표현력이 다소 약할 수 있다.

## 3. 지지 상호작용 해석
지지 간의 상호작용을 살펴보면, 특별한 합충형이 발견된다.

## 4. 신살이 삶에 미치는 영향
역마살이 사주에 자리하고 있어 이동과 변동이 많은 삶을 살게 된다.

## 5. 재물운과 금전 흐름
재물창고인 **진토(辰土)**를 깔고 있어 기본적으로 재복은 타고났다.

## 6. 직업 적성과 진로
교육, 출판, 건축, 디자인 등 창조적이고 독립적인 분야에서 두각을 나타낼 수 있다.

## 7. 애정운과 결혼
자존심이 강해 상대방에게 굽히지 않으려는 성향이 있다.

## 8. 건강운
간, 담낭, 신경계 통증에 유의해야 한다.

## 9. 현재 대운의 흐름과 기회/위기
현재 대운은 인생의 전환점이다.

## 10. 올해의 세운 분석
올해는 귀인의 도움을 받을 수 있는 해이다.

## 11. 인생의 황금기 예측
40대 중반부터 50대 초반까지 인생의 가장 화려한 시기를 맞이할 것으로 보인다.

## 12. 종합 조언
"서두르지 않아도 봄은 온다." 조급해하지 말고 때를 기다리는 지혜가 필요하다.
`;

// 모델 우선순위 — 강력한 순서 (이 API 키로 접근 가능한 모델만)
// gemini-2.5-pro:   최고 품질, 가장 강력한 추론력
// gemini-2.5-flash: 빠르고 강력한 2순위
// gemini-2.0-flash: 안정적인 폴백
const MODELS = [
  { id: 'gemini-2.5-pro',   maxTokens: 8192 },
  { id: 'gemini-2.5-flash', maxTokens: 8192 },
  { id: 'gemini-2.0-flash', maxTokens: 8192 },
] as const;

export async function POST(request: Request) {
  try {
    // ── 결제 사용자 인증 (Gemini API 무단 호출 방지) ──────────
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // 로그인된 경우: saju_detail 결제 여부 확인
      const { data: paidOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', 'saju_detail')
        .eq('status', 'paid')
        .maybeSingle();

      if (!paidOrder) {
        return NextResponse.json({ error: '사주 리포트를 구매한 사용자만 이용할 수 있습니다' }, { status: 403 });
      }
    } else {
      // 비로그인 사용자는 AI 호출 불가
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    // ── 입력 길이 검증 (DoS / 프롬프트 인젝션 기초 방어) ──────
    const raw = await request.json();
    if (JSON.stringify(raw).length > 50_000) {
      return NextResponse.json({ error: '요청 데이터가 너무 큽니다' }, { status: 400 });
    }
    const { saju, daeun, daeunList, gender, engineData } = raw;

    // gender 값 제한
    if (gender !== 'male' && gender !== 'female') {
      return NextResponse.json({ error: '잘못된 성별 값' }, { status: 400 });
    }

    // 종합 분석 수행
    let analysis;
    try {
      analysis = performFullAnalysis(saju);
    } catch (analysisError: any) {
      console.error('[사주] 분석 계산 오류');
      return NextResponse.json(
        { error: '사주 분석 중 오류가 발생했습니다' },
        { status: 500 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[사주] GEMINI_API_KEY 미설정 — 예시 데이터 반환');
      return NextResponse.json({ interpretation: MOCK_INTERPRETATION, analysis });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // createSajuPrompt 반환값 = 시스템 지시문 (데이터 + 출력 요구사항 포함)
    const systemInstruction = createSajuPrompt(saju, daeun, gender, analysis, daeunList || [], engineData);

    // 유저 트리거 메시지 (Gemini는 systemInstruction + user 메시지 구조 필요)
    const userMessage = '위 사주 데이터를 바탕으로 12개 항목의 상세 해석을 작성해주세요. 각 항목은 ## 1. ~ ## 12. 형식으로 작성하세요.';

    let interpretation: string | null = null;

    for (const { id: modelId, maxTokens } of MODELS) {
      try {
        console.log(`[사주] ${modelId} 로 해석 생성 중...`);

        const model = genAI.getGenerativeModel({
          model: modelId,
          systemInstruction,           // ← 시스템 프롬프트 분리 (핵심 수정)
          generationConfig: {
            temperature: 0.8,
            topP: 0.95,
            maxOutputTokens: maxTokens,
          },
        });

        const result = await model.generateContent(userMessage);
        const text = result.response.text();

        if (!text || text.trim().length < 100) {
          throw new Error('응답이 너무 짧거나 비어있습니다');
        }

        interpretation = text;
        console.log(`[사주] ${modelId} 성공 — ${text.length}자 생성됨`);
        break;

      } catch (modelError: any) {
        const msg = modelError.message ?? String(modelError);
        console.error(`[사주] ${modelId} 실패:`, msg);

        // API 키 / 권한 오류 → 즉시 mock 반환
        if (
          msg.includes('API_KEY') ||
          msg.includes('PERMISSION_DENIED') ||
          msg.includes('API key') ||
          modelError.status === 401 ||
          modelError.status === 403
        ) {
          console.warn('[사주] API 키 오류 — 예시 데이터 반환');
          return NextResponse.json({ interpretation: MOCK_INTERPRETATION, analysis });
        }

        // 마지막 모델도 실패
        if (modelId === MODELS[MODELS.length - 1].id) {
          console.error('[사주] 모든 모델 실패 — 예시 데이터 반환');
          return NextResponse.json({ interpretation: MOCK_INTERPRETATION, analysis });
        }

        console.log(`[사주] ${modelId} → 다음 모델로 폴백...`);
      }
    }

    if (!interpretation) {
      return NextResponse.json({ interpretation: MOCK_INTERPRETATION, analysis });
    }

    return NextResponse.json({ interpretation, analysis });

  } catch (error: any) {
    console.error('[사주] 전체 오류:', error.message || error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate interpretation' },
      { status: 500 }
    );
  }
}
