
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createSajuPrompt } from '@/lib/saju-ai-prompt';
import { performFullAnalysis } from '@/lib/ai-interpretation';

export const runtime = 'nodejs';

const MOCK_INTERPRETATION = `
## 1. 일간 분석과 타고난 기질
(API 키 문제 또는 할당량 초과로 인해 예시 데이터를 보여드립니다.)
귀하는 **갑목(甲木)** 일간으로 태어나, 마치 곧게 뻗은 소나무와 같은 기상을 지니고 있다. 리더십이 강하고 추진력이 뛰어나며, 한번 마음먹은 일은 끝까지 해내는 뚝심이 있다.

## 2. 오행 균형과 용신 기반 개운법
사주에서 **화(火)** 기운이 부족하여 표현력이 다소 약할 수 있다. 붉은색 계통의 옷이나 소품을 활용하고, 밝은 곳에서 활동하는 것이 운을 트이게 한다.

## 3. 지지 상호작용 해석
지지 간의 상호작용을 살펴보면, 특별한 합충형이 발견된다.

## 4. 신살이 삶에 미치는 영향
역마살이 사주에 자리하고 있어 이동과 변동이 많은 삶을 살게 된다.

## 5. 재물운과 금전 흐름
재물창고인 **진토(辰土)**를 깔고 있어 기본적으로 재복은 타고났다. 다만, 돈을 버는 것보다 지키는 힘이 약할 수 있으니 저축 습관이 중요하다.

## 6. 직업 적성과 진로
교육, 출판, 건축, 디자인 등 창조적이고 독립적인 분야에서 두각을 나타낼 수 있다.

## 7. 애정운과 결혼
자존심이 강해 상대방에게 굽히지 않으려는 성향이 있다. 배우자와의 관계에서는 조금 더 부드러운 태도가 필요하다.

## 8. 건강운
간, 담낭, 신경계 통증에 유의해야 한다. 스트레스를 받으면 뭉치는 경향이 있으니 스트레칭과 요가를 추천한다.

## 9. 현재 대운의 흐름과 기회/위기
현재 대운은 인생의 전환점이다. 새로운 것을 시작하기보다는 기존의 것을 다지고 내실을 기하는 시기이다.

## 10. 올해의 세운 분석
올해는 귀인의 도움을 받을 수 있는 해이다. 주저하지 말고 주변에 도움을 요청하라.

## 11. 인생의 황금기 예측
40대 중반부터 50대 초반까지 인생의 가장 화려한 시기를 맞이할 것으로 보인다.

## 12. 종합 조언
"서두르지 않아도 봄은 온다." 조급해하지 말고 때를 기다리는 지혜가 필요하다.
`;

// 사용 가능한 모델 우선순위 (gpt-4o → gpt-4o-mini 폴백)
const MODELS = ['gpt-4o', 'gpt-4o-mini'] as const;

export async function POST(request: Request) {
    try {
        const { saju, daeun, daeunList, gender, engineData } = await request.json();

        // 종합 분석 수행
        let analysis;
        try {
            analysis = performFullAnalysis(saju);
        } catch (analysisError: any) {
            console.error('Analysis calculation error:', analysisError.message);
            return NextResponse.json(
                { error: '사주 분석 계산 중 오류가 발생했습니다: ' + analysisError.message },
                { status: 500 }
            );
        }

        if (!process.env.OPENAI_API_KEY) {
            console.warn('OpenAI API Key is missing');
            return NextResponse.json({ interpretation: MOCK_INTERPRETATION, analysis });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const prompt = createSajuPrompt(saju, daeun, gender, analysis, daeunList || [], engineData);

        // 모델 폴백: gpt-4o 실패 시 gpt-4o-mini로 재시도
        let interpretation: string | null = null;
        let usedModel = '';

        for (const model of MODELS) {
            try {
                console.log(`Generating saju analysis with model: ${model}`);
                const completion = await openai.chat.completions.create({
                    messages: [{ role: 'system', content: prompt }],
                    model,
                    max_tokens: model === 'gpt-4o' ? 8192 : 4096,
                    temperature: 0.75,
                });
                interpretation = completion.choices[0].message.content;
                usedModel = model;
                console.log(`Successfully generated with model: ${model}`);
                break;
            } catch (modelError: any) {
                console.warn(`Model ${model} failed:`, modelError.message || modelError.status);
                if (modelError.status === 401) {
                    console.warn('OpenAI API Key is invalid (401). Returning mock data.');
                    return NextResponse.json({ interpretation: MOCK_INTERPRETATION, analysis });
                }
                if (modelError.status === 429 || (modelError.error && modelError.error.code === 'insufficient_quota')) {
                    console.warn('OpenAI Quota Exceeded. Returning mock data.');
                    return NextResponse.json({ interpretation: MOCK_INTERPRETATION, analysis });
                }
                if (model === MODELS[MODELS.length - 1]) {
                    throw modelError;
                }
                console.log(`Falling back to next model...`);
            }
        }

        return NextResponse.json({ interpretation, analysis });
    } catch (error: any) {
        console.error('Error generating saju interpretation:', error.message || error);

        return NextResponse.json(
            { error: error.message || 'Failed to generate interpretation' },
            { status: 500 }
        );
    }
}
