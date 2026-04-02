'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ContactModal from '../../components/ContactModal';
import { trackCTAClick } from '../../../lib/gtag';
const KAKAO_CHANNEL_URL = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL ?? null;

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    el.querySelectorAll('.reveal').forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);
  return ref;
}

const CHECKLIST = [
  '주로 어떤 AI 도구를 사용하는지 (ChatGPT / Claude / Gemini)',
  '자동화하고 싶은 업무 유형 (이메일 / 보고서 / 코드 등)',
  '현재 프롬프트 사용 방식 및 불만족스러운 점',
  '필요한 프롬프트 수량 (단건 / 패키지 / 팀 전체)',
  '납품 후 사용 가이드 및 1:1 교육 포함 여부 확인',
];

// ─── 프리미엄 상품 ───
const premiumProducts = [
  {
    id: 'image_gen',
    badge: 'IMAGE GENERATION',
    badgeColor: '#e879f9',
    bgFrom: '#1a0533',
    bgTo: '#2d1054',
    accentColor: '#d946ef',
    accentBg: 'rgba(217,70,239,0.12)',
    accentBorder: 'rgba(217,70,239,0.3)',
    title: 'AI 이미지 생성 마스터 프롬프트 패키지',
    subtitle: 'Midjourney · DALL-E 3 · Stable Diffusion 전용',
    price: '45,000원',
    salePrice: '12,900원',
    discountRate: '72% OFF',
    saleLabel: '런칭 기념 특가',
    priceNote: '/ 패키지 (즉시 다운로드)',
    desc: '수천 장의 이미지 생성 실험을 통해 검증된, 업종별·스타일별 고품질 프롬프트 50종 세트. 단순 키워드 나열이 아닌 구도·조명·분위기·카메라·후처리까지 세밀하게 설계된 전문가급 프롬프트입니다.',
    features: [
      { label: '50종 프롬프트 라이브러리', desc: '상업용 · 마케팅 · SNS 콘텐츠 · 제품 사진 · 인물 포트레이트 · 배경 · 로고 컨셉 · 인테리어 등 카테고리별 구성' },
      { label: '구도·조명·후처리 공식', desc: '주제(Subject) → 환경(Environment) → 스타일(Style) → 조명(Lighting) → 카메라(Camera) → 후처리(Post) 6단계 구조 적용' },
      { label: '네거티브 프롬프트 포함', desc: '흐림·왜곡·불필요한 텍스트·비현실적 요소를 제거하는 부정 키워드까지 최적화하여 실패 확률 최소화' },
      { label: 'Midjourney 파라미터 완전 가이드', desc: '--ar / --v / --style / --chaos / --no 등 핵심 파라미터 활용법과 상황별 추천값 포함' },
      { label: '한국어 → 영어 변환 치트시트', desc: '자주 쓰는 한국어 표현을 AI가 잘 이해하는 영어 표현으로 매핑한 빠른 참고 시트' },
      { label: '업종별 특화 세트 5개', desc: '카페/음식 · 패션 · 부동산 인테리어 · 교육/강의 · 뷰티/헬스 분야 특화 프롬프트 세트별 제공' },
      { label: '활용 예시 이미지 50장', desc: '각 프롬프트로 실제 생성한 결과물 예시 이미지 포함 (PDF 가이드북 형태 제공)' },
      { label: '무제한 재사용 가능', desc: '구매 후 본인 사업·작업에 무제한 활용 가능. 상업적 이용 허용' },
    ],
    promptPreview: {
      title: '프롬프트 예시 — 프리미엄 카페 음료 사진',
      content: `A professional product photograph of a single iced caramel latte in a tall clear glass,
placed on a rustic wooden cafe table. The drink features layers of espresso, milk,
and golden caramel syrup with ice cubes.

Lighting: soft natural window light from the left, warm golden hour tone,
subtle rim lighting highlighting condensation droplets on the glass.

Camera: Canon EOS R5, 85mm f/1.8 lens, shallow depth of field,
foreground blur with coffee beans and a sprig of dried lavender.

Style: editorial food photography, Pinterest aesthetic, warm muted tones,
slightly desaturated with lifted shadows.

Post-processing: film grain texture, subtle vignette,
color grade with warm highlights and cool shadows.

--ar 4:5 --v 6.1 --style raw --q 2

Negative: text, watermark, multiple cups, cartoon, illustration,
overexposed, blurry, plastic look, artificial lighting`,
    },
    cta: '패키지 구매 문의 →',
    productId: 'prompt_image_gen',
  },
  {
    id: 'resume',
    badge: 'CAREER COACHING',
    badgeColor: '#34d399',
    bgFrom: '#052e16',
    bgTo: '#064e3b',
    accentColor: '#10b981',
    accentBg: 'rgba(16,185,129,0.12)',
    accentBorder: 'rgba(16,185,129,0.3)',
    title: 'AI 자소서·이력서 첨삭 마스터 프롬프트',
    subtitle: 'ChatGPT · Claude 전용 · 대기업 HR 기준 적용',
    price: '35,000원',
    salePrice: '9,900원',
    discountRate: '72% OFF',
    saleLabel: '런칭 기념 특가',
    priceNote: '/ 패키지 (즉시 다운로드)',
    desc: '대기업 현직 개발자의 실전 경험과 수십 명의 신입/경력 지원자 첨삭 경험을 바탕으로 설계한 자소서·이력서 최적화 프롬프트 세트. 합격률을 높이는 구체적인 표현과 구조로 AI가 전문 컨설턴트처럼 첨삭하도록 만들어드립니다.',
    features: [
      { label: '자기소개서 7가지 유형별 프롬프트', desc: '지원동기 · 성장과정 · 강점/약점 · 직무역량 · 팀워크 경험 · 위기극복 · 입사 후 포부 — 각 항목에 최적화된 별도 프롬프트 제공' },
      { label: 'STAR 기법 자동 적용', desc: '상황(Situation) → 과제(Task) → 행동(Action) → 결과(Result) 구조로 경험을 임팩트 있게 재구성하는 프롬프트 포함' },
      { label: '이력서 불릿포인트 최적화', desc: '단순 업무 나열이 아닌 "무엇을 했고, 어떤 방법으로, 어떤 결과를 냈는지" 3단 구조 + 수치화로 강점을 극대화하는 첨삭 프롬프트' },
      { label: 'ATS 키워드 최적화', desc: '채용 공고의 키워드를 분석하여 자소서에 자연스럽게 녹여내는 ATS(지원자 추적 시스템) 통과 최적화 프롬프트' },
      { label: '업종/직무별 맞춤 톤 설정', desc: 'IT · 금융 · 제조 · 마케팅 · 공공기관 등 업종별, 신입/경력별 적합한 문체와 표현 스타일로 자동 조정' },
      { label: '약점을 강점으로 전환하는 프롬프트', desc: '공백기 · 전공 불일치 · 낮은 학점 · 짧은 재직기간 등 불리한 스펙을 긍정적으로 표현하는 전략적 첨삭 프롬프트' },
      { label: '면접 질문 예측 & 답변 준비', desc: '작성된 자소서를 기반으로 예상 면접 질문을 생성하고, 모범 답변 구조를 잡아주는 면접 대비 프롬프트 포함' },
      { label: '실제 첨삭 Before/After 5사례', desc: '실제로 사용하여 개선된 자소서 전후 비교 예시 5가지를 PDF로 제공 (직무별 다양한 케이스)' },
    ],
    promptPreview: {
      title: '프롬프트 예시 — 지원동기 항목 첨삭',
      content: `당신은 15년 경력의 대기업 HR 수석 컨설턴트입니다.
수백 명의 합격 자소서를 분석한 전문가 관점에서 다음 자소서를 첨삭해주세요.

[첨삭 기준]
1. STAR 기법(상황-과제-행동-결과) 구조가 명확한가?
2. 지원 동기가 회사의 사업 방향/가치와 구체적으로 연결되는가?
3. "열정", "성장" 등 추상적 단어 대신 구체적 경험과 수치가 있는가?
4. 첫 문장이 면접관의 시선을 끄는 Hook으로 시작하는가?
5. 지원 직무에서 필요한 역량이 자연스럽게 드러나는가?

[첨삭 방식]
① 현재 자소서의 강점 2가지 (구체적 근거 포함)
② 치명적 약점 3가지와 개선 방향
③ 표현이 약한 문장 3개를 지목하여 강화 버전으로 재작성
④ 전체 구조 리뉴얼 버전 (300자 이내로 압축한 임팩트 버전)
⑤ 이 자소서로 예상되는 면접 질문 2가지

[지원 정보]
- 회사/직무: [입력]
- 채용 공고 키워드: [입력]

[첨삭할 자소서]
[여기에 자소서 붙여넣기]`,
    },
    cta: '패키지 구매 문의 →',
    productId: 'prompt_resume',
  },
  {
    id: 'email',
    badge: 'BUSINESS EMAIL',
    badgeColor: '#60a5fa',
    bgFrom: '#0c1a3a',
    bgTo: '#1e3a6e',
    accentColor: '#3b82f6',
    accentBg: 'rgba(59,130,246,0.12)',
    accentBorder: 'rgba(59,130,246,0.3)',
    title: '비즈니스 이메일 마스터 프롬프트 패키지',
    subtitle: 'ChatGPT · Claude 전용 · 상황별 40종 템플릿',
    price: '32,000원',
    salePrice: '10,900원',
    discountRate: '66% OFF',
    saleLabel: '런칭 기념 특가',
    priceNote: '/ 패키지 (즉시 다운로드)',
    desc: '신규 파트너 제안부터 거절 메일, 클레임 응대, 계약 협상까지 — 실무에서 반복 사용하는 비즈니스 이메일 상황 40가지를 AI가 전문 비서처럼 작성하도록 설계한 완성형 프롬프트 패키지입니다.',
    features: [
      { label: '40가지 상황별 이메일 프롬프트', desc: '제안·문의·거절·사과·팔로업·계약·협상·내부 보고 등 비즈니스 전 상황 커버' },
      { label: '상대방 직급별 톤 자동 조정', desc: '대표·임원·실무자·외부 파트너·고객별로 적합한 경어와 표현 강도를 자동으로 조정하는 프롬프트' },
      { label: '영어 이메일 동시 출력', desc: '한국어 초안 작성 후 비즈니스 영어 버전으로 즉시 변환하는 이중 출력 프롬프트 포함' },
      { label: '클레임·컴플레인 전문 대응 세트', desc: '감정적 고객·거래처 이메일을 분석하고 상황별 최적 응대 메일을 생성하는 CS 전문 프롬프트 7종' },
      { label: '이메일 후속 조치 자동화', desc: '1차 연락 후 답장 없을 때의 팔로업, 회신 독촉, 미팅 확정 등 타임라인별 후속 이메일 시리즈 프롬프트' },
      { label: '제목 라인 A/B 테스트 생성', desc: '오픈율을 높이는 이메일 제목 5가지 변형을 자동 생성하는 헤드라인 최적화 프롬프트' },
      { label: '실전 예시 40쌍 (Before/After)', desc: '평범한 이메일 → 임팩트 있는 전문 이메일로 변환된 실전 예시 40쌍 PDF 가이드북 포함' },
    ],
    promptPreview: {
      title: '프롬프트 예시 — 신규 파트너십 제안 이메일',
      content: `당신은 10년 경력의 B2B 영업 전문가이자 비즈니스 라이터입니다.
아래 정보를 바탕으로 상대방이 반드시 읽고 싶어지는 파트너십 제안 이메일을 작성해주세요.

[작성 원칙]
1. 첫 문장에서 상대방의 이익/관심사를 직접 언급 (내 소개 X)
2. 제안 핵심을 3줄 이내로 압축 (바쁜 담당자가 5초 내 파악)
3. 구체적 수치나 레퍼런스로 신뢰도 구축
4. 명확한 CTA 1개만 포함 (회의 일정 링크 OR 짧은 통화 요청)
5. 전체 300자 이내, 첨부 자료는 1개 이하

[제안 정보]
- 우리 회사/서비스: [입력]
- 제안 대상 회사: [입력]
- 협업으로 상대방이 얻는 이익: [입력]
- 기존 레퍼런스/실적: [입력]
- 원하는 다음 액션: [입력]

[출력 형식]
① 이메일 제목 3가지 옵션 (각각 다른 각도)
② 본문 이메일 (원칙 준수)
③ 수신자가 거절할 가능성이 높은 이유와 예방 팁`,
    },
    cta: '패키지 구매 문의 →',
    productId: 'prompt_email',
  },
  {
    id: 'marketing',
    badge: 'MARKETING COPY',
    badgeColor: '#fb923c',
    bgFrom: '#1c0a00',
    bgTo: '#431407',
    accentColor: '#f97316',
    accentBg: 'rgba(249,115,22,0.12)',
    accentBorder: 'rgba(249,115,22,0.3)',
    title: '마케팅 카피라이팅 마스터 프롬프트',
    subtitle: 'SNS · 광고 · 상세페이지 · 유튜브 전용 35종',
    price: '38,000원',
    salePrice: '12,900원',
    discountRate: '66% OFF',
    saleLabel: '런칭 기념 특가',
    priceNote: '/ 패키지 (즉시 다운로드)',
    desc: '인스타그램·유튜브·쿠팡·스마트스토어·카카오 채널까지 — 각 플랫폼의 알고리즘과 소비자 심리를 반영하여 클릭률·전환율을 극대화하는 마케팅 카피 전문 프롬프트 35종 세트입니다.',
    features: [
      { label: 'SNS 플랫폼별 최적화 카피 세트', desc: '인스타그램 피드/릴스·유튜브 제목·스레드·카카오 비즈메시지 각 채널 알고리즘 특성을 반영한 별도 프롬프트' },
      { label: '감성 카피 ↔ 이성 카피 전환', desc: '같은 상품을 감성 스토리텔링 방식과 스펙·기능 중심 이성 방식으로 각각 작성하여 A/B 테스트용 카피 쌍 생성' },
      { label: '상세페이지 전환율 최적화 구조', desc: '훅(Hook) → 문제 공감 → 해결책 제시 → 사회적 증거 → CTA의 5단계 전환 공식을 자동 적용하는 상세페이지 카피 프롬프트' },
      { label: '제품 소개글 10초 요약 공식', desc: '핵심 USP(독보적 강점)를 10초 안에 전달하는 엘리베이터 피치형 짧은 소개글 자동 생성 프롬프트' },
      { label: '유튜브/숏폼 썸네일 제목 생성기', desc: '조회수를 높이는 클릭베이트형 제목과 커뮤니티 공감형 제목을 구분하여 생성하는 유튜브 최적화 프롬프트' },
      { label: '리뷰·후기 마케팅 카피 변환', desc: '고객 후기·댓글을 분석하여 그 안의 핵심 감동 포인트를 광고 카피로 변환하는 소셜 프루프 카피 프롬프트' },
      { label: '업종별 금지 표현 자동 필터', desc: '식품·의료·금융·부동산 등 규제 업종의 법적 주의 표현을 사전에 체크하고 대안 표현을 제시하는 컴플라이언스 프롬프트' },
    ],
    promptPreview: {
      title: '프롬프트 예시 — 인스타그램 상품 소개 릴스 스크립트',
      content: `당신은 팔로워 50만 명의 인스타그램 쇼핑 인플루언서이자
마케팅 전환율 전문가입니다.
다음 상품 정보를 바탕으로 구매 욕구를 자극하는 릴스 스크립트를 작성해주세요.

[스크립트 구조 — 60초 이내]
00~03초: 즉각 멈추게 하는 훅 문장 (의문형 OR 공감형 OR 충격 통계)
04~10초: "이게 뭔데?" 궁금증 유발 — 상품 첫 노출
11~30초: 핵심 기능 3가지를 BEFORE/AFTER 방식으로 시연
31~45초: 소셜 프루프 (실제 고객 반응 또는 수치)
46~55초: 한정 혜택/가격 공개
56~60초: 명확한 CTA (링크 인 바이오, DM, 댓글 단어)

[상품 정보]
- 상품명/카테고리: [입력]
- 핵심 기능/차별점: [입력]
- 타겟 고객: [입력]
- 가격/혜택: [입력]

[출력]
① 릴스 스크립트 본문
② 자막용 텍스트 (10자 이내 임팩트 문구 5개)
③ 해시태그 20개 (도달 최적화)`,
    },
    cta: '패키지 구매 문의 →',
    productId: 'prompt_marketing',
  },
  {
    id: 'report',
    badge: 'BUSINESS REPORT',
    badgeColor: '#a78bfa',
    bgFrom: '#13082b',
    bgTo: '#1e1148',
    accentColor: '#8b5cf6',
    accentBg: 'rgba(139,92,246,0.12)',
    accentBorder: 'rgba(139,92,246,0.3)',
    title: '업무 보고서·기획서 자동화 프롬프트 패키지',
    subtitle: 'ChatGPT · Claude 전용 · 직장인 필수 30종',
    price: '30,000원',
    salePrice: '10,900원',
    discountRate: '64% OFF',
    saleLabel: '런칭 기념 특가',
    priceNote: '/ 패키지 (즉시 다운로드)',
    desc: '주간 업무 보고부터 임원 발표용 기획서, 투자 제안서, 회의록 요약까지 — 직장인이 매주 반복 작성하는 문서를 AI가 체계적으로 작성하도록 설계한 업무 자동화 프롬프트 30종 세트입니다.',
    features: [
      { label: '주간·월간 업무 보고서 자동화', desc: '팀원별 진행 현황, 완료 사항, 이슈, 다음 주 계획을 표 형식으로 정리하는 구조화된 보고서 생성 프롬프트' },
      { label: '임원 보고용 1페이지 요약 공식', desc: '"Bottom Line Up Front" 원칙으로 핵심 결론 → 근거 → 요청사항 순서의 임원 친화적 요약 프롬프트' },
      { label: '신사업 기획서 뼈대 자동 생성', desc: '시장 분석 → 목표 설정 → 실행 방안 → 예산 계획 → KPI 설정의 5단계 기획서 프레임워크 자동 구성 프롬프트' },
      { label: '회의록 → 액션 아이템 변환', desc: '날것의 회의 내용을 입력하면 결정사항·담당자·기한·후속 과제로 즉시 분류하는 회의록 구조화 프롬프트' },
      { label: '데이터 분석 결과 스토리텔링', desc: '숫자·표·그래프 데이터를 경영진이 이해하기 쉬운 인사이트 내러티브로 변환하는 데이터 보고 프롬프트' },
      { label: 'RFP·제안서 경쟁력 강화', desc: '발주사의 선정 기준에 맞춰 제안서의 차별점·강점을 부각시키고 약점을 보완하는 제안서 최적화 프롬프트' },
      { label: '프레젠테이션 슬라이드 목차 자동 설계', desc: '보고 목적과 청중에 맞는 슬라이드 구성 순서, 각 슬라이드 핵심 메시지를 자동으로 설계해주는 프롬프트' },
    ],
    promptPreview: {
      title: '프롬프트 예시 — 주간 업무 보고서 자동 작성',
      content: `당신은 5년 경력의 기업 커뮤니케이션 전문가이자
비즈니스 라이터입니다.
아래 업무 내용을 바탕으로 팀장에게 보고할 주간 업무 보고서를 작성해주세요.

[보고서 작성 원칙]
1. 첫 줄에 이번 주 가장 중요한 성과 1가지를 먼저 명시
2. 수치로 표현 가능한 모든 항목은 반드시 수치화
3. 이슈는 "문제 상황 → 조치 내용 → 현재 상태" 3단 구조로 기술
4. 다음 주 계획은 담당자·기한과 함께 표 형식으로 정리
5. 전체 A4 1장 이내, 핵심 위주

[업무 내용 입력]
- 이번 주 완료 업무: [입력]
- 진행 중인 업무: [입력]
- 발생한 이슈/리스크: [입력]
- 다음 주 계획: [입력]
- 요청 사항 (상급자에게): [입력]

[출력 형식]
① 이번 주 핵심 성과 (1~2줄 요약)
② 완료 업무 목록 (수치 포함)
③ 진행 중 업무 + 달성률
④ 이슈 및 대응 현황
⑤ 다음 주 계획 (담당·기한 포함 표)
⑥ 협조 요청 사항`,
    },
    cta: '패키지 구매 문의 →',
    productId: 'prompt_report',
  },
];

const useCases = [
  { label: '이메일 작성', desc: '고객사별, 상황별 최적화된 비즈니스 이메일 프롬프트' },
  { label: '보고서·기획서', desc: '회사 내부 보고서, 제안서, 기획서 자동 작성용 프롬프트' },
  { label: '고객 응대', desc: 'CS 상담, FAQ 응답, 컴플레인 처리를 위한 프롬프트' },
  { label: '마케팅 카피', desc: '제품 소개글, 광고 카피, SNS 콘텐츠 생성 프롬프트' },
  { label: '개발 보조', desc: '코드 리뷰, 버그 설명, 문서화를 위한 개발자 전용 프롬프트' },
  { label: '학습·요약', desc: '문서 요약, 핵심 추출, 번역 최적화 프롬프트' },
];

const plans = [
  {
    name: '단건 설계',
    price: '30,000원',
    period: '/ 건',
    desc: '특정 업무 1건 프롬프트 설계',
    features: ['요구사항 분석 및 인터뷰', '목적별 프롬프트 1개 설계', 'ChatGPT / Claude 최적화', '수정 1회 포함', '사용 가이드 문서 제공'],
    highlight: false,
    productId: 'prompt_single',
  },
  {
    name: '비즈니스 패키지',
    price: '99,000원',
    period: '/ 패키지',
    desc: '업무 유형별 5개 프롬프트 세트',
    features: ['업무 분석 심층 인터뷰', '5개 프롬프트 맞춤 설계', '용도별 프롬프트 라이브러리', '수정 3회 포함', '활용 방법 1:1 교육 (30분)', '1개월 내 추가 조정 가능'],
    highlight: true,
    productId: 'prompt_business',
  },
  {
    name: '팀/기업 패키지',
    price: '249,000원~',
    period: '/ 세트',
    desc: '부서·팀 전체 프롬프트 시스템 구축',
    features: ['팀 업무 프로세스 전체 분석', '10개 이상 프롬프트 설계', '팀 공유 프롬프트 라이브러리', '사내 가이드 문서 작성', '전 직원 교육 자료 제공', '3개월 내 업데이트 지원'],
    highlight: false,
    productId: 'prompt_team',
  },
];

const examples = [
  {
    type: '회의록 요약',
    before: '회의 내용을 요약해줘',
    after: '다음 회의록을 분석하여: 1) 핵심 결정사항 3가지, 2) 담당자별 Action Item, 3) 다음 회의 전 완료해야 할 사항을 불릿 형식으로 정리해줘. 회의록: [내용]',
    improvement: '구조화된 출력 · 역할 분리 · 명확한 포맷',
  },
  {
    type: '코드 리뷰',
    before: '이 코드 리뷰해줘',
    after: '시니어 백엔드 개발자 관점에서 다음 코드를 리뷰해줘: 1) 버그 및 잠재적 오류, 2) 성능 개선 포인트, 3) 클린코드 관점에서의 개선사항을 각각 심각도(High/Medium/Low)와 함께 알려줘. 코드: [코드]',
    improvement: '페르소나 설정 · 심각도 기준 · 다각도 분석',
  },
];

export default function PromptPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState('프롬프트 엔지니어링');
  const containerRef = useScrollReveal();

  const openModal = (service: string) => {
    trackCTAClick(service, '/services/prompt');
    setModalService(service);
    setModalOpen(true);
  };

  return (
    <div ref={containerRef} className="min-h-full bg-[#f0f5ff]">
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(1.5rem);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-d1 { transition-delay: 80ms; }
        .reveal-d2 { transition-delay: 160ms; }
        .reveal-d3 { transition-delay: 240ms; }
        .reveal-d4 { transition-delay: 320ms; }
        .reveal-d5 { transition-delay: 400ms; }
        .prompt-card {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .prompt-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.15);
        }
      `}</style>
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service={modalService}
        checklist={CHECKLIST}
        accentColor="text-violet-400"
        headerFrom="#0d0a2e"
        headerTo="#1a0f5c"
      />

      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden bg-[#0d0a2e] px-6 py-14 lg:px-12" style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 40px)' }}>

        <div className="relative max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-violet-300/60 hover:text-violet-300 text-sm mb-8 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            홈으로
          </Link>
          <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-4 font-mono">프롬프트 엔지니어링 · AI 활용 극대화</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            AI를 제대로<br />
            100% 활용하기
          </h1>
          <p className="text-violet-100/50 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-6">
            ChatGPT·Claude를 쓰는데 결과가 항상 애매하신가요?<br />
            업무에 딱 맞는 프롬프트를 전문 설계하여 AI를 제대로 활용하도록 도와드립니다.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <div className="inline-flex items-center gap-2 bg-violet-400/10 border border-violet-400/20 text-violet-300 text-xs font-medium px-4 py-2 rounded-full">
              <span className="text-green-400">↑</span> 업무 효율 평균 3~5배 향상
            </div>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/50 text-xs font-medium px-4 py-2 rounded-full">
              ChatGPT · Claude · Gemini 전용 최적화
            </div>
          </div>
        </div>
      </div>

      {/* ─── 프리미엄 상품 ─── */}
      <div className="px-6 py-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 reveal">
            <div className="inline-flex items-center gap-2 bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              PREMIUM PRODUCTS
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">바로 쓸 수 있는 프리미엄 프롬프트</h2>
            <p className="text-slate-500 text-sm mt-2">전문가가 직접 설계하고 검증한 완성형 프롬프트 패키지 — 구매 즉시 사용 가능</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {premiumProducts.map((product, idx) => (
              <div
                key={product.id}
                className={`rounded-2xl overflow-hidden border prompt-card reveal reveal-d${(idx % 4) + 1}`}
                style={{ borderColor: product.accentBorder, background: `linear-gradient(135deg, ${product.bgFrom}, ${product.bgTo})` }}
              >
                {/* 헤더 */}
                <div className="p-6 border-b" style={{ borderColor: product.accentBorder }}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className="text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-widest"
                      style={{ color: product.accentColor, background: product.accentBg, border: `1px solid ${product.accentBorder}` }}
                    >
                      {product.badge}
                    </span>
                    <div className="text-right">
                      {/* 할인 배지 */}
                      <div className="flex items-center justify-end gap-2 mb-1">
                        <span className="text-xs font-extrabold bg-red-500 text-white px-2 py-0.5 rounded-md animate-pulse">
                          {product.discountRate}
                        </span>
                        <span className="text-xs font-bold" style={{ color: product.accentColor }}>
                          {product.saleLabel}
                        </span>
                      </div>
                      {/* 원가 취소선 */}
                      <div className="text-sm line-through opacity-40 text-right text-white mb-0.5">{product.price}</div>
                      {/* 세일가 */}
                      <div className="text-2xl font-extrabold text-white">{product.salePrice}</div>
                      <div className="text-xs" style={{ color: product.accentColor + '99' }}>{product.priceNote}</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-extrabold text-white mb-1 leading-snug">{product.title}</h3>
                  <p className="text-xs mb-3" style={{ color: product.accentColor + 'aa' }}>{product.subtitle}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{product.desc}</p>
                </div>
                {/* 기능 목록 */}
                <div className="p-6 border-b" style={{ borderColor: product.accentBorder }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: product.accentColor + 'cc' }}>포함 내용</p>
                  <ul className="space-y-2.5">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: product.accentBg, border: `1px solid ${product.accentBorder}` }}>
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: product.accentColor }} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white">{f.label}</span>
                          <span className="text-xs ml-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>— {f.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* 프롬프트 미리보기 */}
                <div className="p-6 border-b" style={{ borderColor: product.accentBorder }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: product.accentColor + 'cc' }}>
                    {product.promptPreview.title}
                  </p>
                  <div
                    className="rounded-xl p-4 font-mono text-xs leading-relaxed overflow-auto"
                    style={{ background: 'rgba(0,0,0,0.35)', color: 'rgba(255,255,255,0.6)', border: `1px solid ${product.accentBorder}`, whiteSpace: 'pre-line', maxHeight: '180px' }}
                  >
                    {product.promptPreview.content}
                  </div>
                </div>
                {/* CTA */}
                <div className="p-6">
                  {KAKAO_CHANNEL_URL ? (
                    <a
                      href={KAKAO_CHANNEL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-extrabold transition-all hover:opacity-90"
                      style={{ background: '#FEE500', color: '#3A1D1D' }}
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.438 1.418 4.6 3.584 5.977l-.916 3.41c-.086.32.283.573.56.38l4.014-2.674A11.29 11.29 0 0012 18c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/></svg>
                      카카오로 구매 문의
                    </a>
                  ) : (
                    <button
                      onClick={() => openModal(`프롬프트 패키지 — ${product.title}`)}
                      className="w-full py-3.5 rounded-xl text-sm font-extrabold transition-all hover:opacity-90"
                      style={{ background: product.accentColor, color: product.bgFrom }}
                    >
                      구매 문의하기 →
                    </button>
                  )}
                  <p className="text-center text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    문의 시 프롬프트 샘플 파일 미리 제공
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Before/After ─── */}
      <div className="px-6 py-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 reveal">
            <p className="text-violet-600 text-xs font-bold uppercase tracking-widest mb-2">BEFORE vs AFTER</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">이런 차이가 납니다</h2>
          </div>
          <div className="space-y-5">
            {examples.map((ex, idx) => (
              <div key={ex.type} className={`bg-white rounded-2xl border border-[#dbe8ff] overflow-hidden reveal reveal-d${idx + 1}`}>
                <div className="bg-[#04102b] px-5 py-3 flex items-center justify-between">
                  <span className="text-white/60 text-xs font-semibold font-mono">{ex.type} 예시</span>
                  <span className="bg-violet-400/20 border border-violet-400/30 text-violet-300 text-xs px-3 py-1 rounded-full">{ex.improvement}</span>
                </div>
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#dbe8ff]">
                  <div className="p-5">
                    <div className="inline-block bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-2 py-0.5 rounded-md mb-3">일반 프롬프트</div>
                    <div className="bg-slate-50 rounded-xl px-4 py-3 font-mono text-sm text-slate-600 border border-slate-200">&ldquo;{ex.before}&rdquo;</div>
                    <div className="mt-3 text-xs text-red-500 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                      모호한 지시 → 불완전한 결과
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="inline-block bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold px-2 py-0.5 rounded-md mb-3">최적화 프롬프트</div>
                    <div className="bg-violet-50 rounded-xl px-4 py-3 font-mono text-sm text-slate-700 border border-violet-100 leading-relaxed">&ldquo;{ex.after}&rdquo;</div>
                    <div className="mt-3 text-xs text-violet-600 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      명확한 구조 → 바로 쓸 수 있는 결과
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 활용 분야 ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 reveal">
            <p className="text-violet-600 text-xs font-bold uppercase tracking-widest mb-2">USE CASES</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">활용 분야</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((uc, i) => (
              <div key={uc.label} className={`bg-white rounded-2xl border border-[#dbe8ff] p-5 hover:border-violet-200 transition-all duration-300 reveal reveal-d${(i % 3) + 1}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-violet-600 font-extrabold text-xs">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#04102b] text-sm mb-1">{uc.label}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{uc.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 요금제 ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 reveal">
            <p className="text-[#1a56db] text-xs font-bold uppercase tracking-widest mb-2">PRICING</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">요금제</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {plans.map((plan, idx) => (
              <div key={plan.name} className={`rounded-2xl border p-6 relative flex flex-col reveal reveal-d${idx + 1} ${
                plan.highlight
                  ? 'bg-gradient-to-br from-[#0d0a2e] to-[#1a0f5c] border-violet-400/30 shadow-2xl shadow-violet-900/20 scale-105'
                  : 'bg-white border-[#dbe8ff]'
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-violet-400 text-[#0d0a2e] text-xs font-extrabold px-4 py-1 rounded-full tracking-wide">추천</div>
                )}
                <div className={`text-xs font-bold mb-2 tracking-wide ${plan.highlight ? 'text-violet-400' : 'text-slate-400'}`}>{plan.name.toUpperCase()}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-3xl font-extrabold ${plan.highlight ? 'text-white' : 'text-[#04102b]'}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-violet-300/50' : 'text-slate-400'}`}>{plan.period}</span>
                </div>
                <p className={`text-xs mb-5 ${plan.highlight ? 'text-violet-300/50' : 'text-slate-400'}`}>{plan.desc}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-xs ${plan.highlight ? 'text-violet-100/80' : 'text-slate-600'}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.highlight ? 'bg-violet-400/20 border border-violet-400/40' : 'bg-[#f0f5ff] border border-[#dbe8ff]'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${plan.highlight ? 'bg-violet-400' : 'bg-[#1a56db]'}`} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openModal(`프롬프트 엔지니어링 - ${plan.name}`)}
                  className={`block w-full text-center py-3 rounded-xl text-sm font-bold transition ${
                    plan.highlight ? 'bg-violet-400 text-[#0d0a2e] hover:bg-violet-300' : 'bg-[#04102b] text-white hover:bg-[#0a1f5c]'
                  }`}
                >
                  무료 상담 신청
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-[#0d0a2e] to-[#1a0f5c] rounded-2xl border border-violet-400/20 p-8 text-center reveal">
            <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-2">GET STARTED</p>
            <h3 className="text-white text-2xl font-extrabold mb-2">AI를 제대로 활용하고 싶다면</h3>
            <p className="text-violet-100/40 text-sm mb-6">업무 분석 인터뷰 → 맞춤 설계 → 가이드 제공</p>
            <button
              onClick={() => openModal('프롬프트 엔지니어링')}
              className="inline-flex items-center gap-2 bg-violet-400 hover:bg-violet-300 text-[#0d0a2e] px-8 py-3 rounded-xl font-extrabold text-sm transition-all shadow-lg shadow-violet-900/30"
            >
              무료 상담 신청 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
