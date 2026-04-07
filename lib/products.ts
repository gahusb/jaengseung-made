export interface Product {
  id: string;
  name: string;
  price: number;
  type: 'one_time' | 'monthly' | 'annual';
  description: string;
}

export const PRODUCTS: Record<string, Product> = {
  lotto_gold: {
    id: 'lotto_gold',
    name: '로또 골드 플랜',
    price: 900,
    type: 'monthly',
    description: '매주 1회 번호 추천 · 이메일 발송',
  },
  lotto_platinum: {
    id: 'lotto_platinum',
    name: '로또 플래티넘 플랜',
    price: 2900,
    type: 'monthly',
    description: '매주 3회 번호 + 텔레그램 알림 + 상세 분석',
  },
  lotto_diamond: {
    id: 'lotto_diamond',
    name: '로또 다이아 플랜',
    price: 9900,
    type: 'monthly',
    description: '횟수 무제한 + 연간 패턴 리포트 + 전체 기능',
  },
  stock_starter_install: {
    id: 'stock_starter_install',
    name: '주식 스타터 설치',
    price: 99000,
    type: 'one_time',
    description: '1개 종목 자동 매매 설치',
  },
  stock_pro_install: {
    id: 'stock_pro_install',
    name: '주식 프로 설치',
    price: 199000,
    type: 'one_time',
    description: '5개 종목 + 전략 커스터마이징 설치',
  },
  stock_starter_monthly: {
    id: 'stock_starter_monthly',
    name: '주식 스타터 월 유지비',
    price: 29000,
    type: 'monthly',
    description: '스타터 월 유지보수 비용',
  },
  stock_pro_monthly: {
    id: 'stock_pro_monthly',
    name: '주식 프로 월 유지비',
    price: 49000,
    type: 'monthly',
    description: '프로 월 유지보수 비용',
  },
  saju_detail: {
    id: 'saju_detail',
    name: 'AI 사주 상세 리포트',
    price: 1000,
    type: 'one_time',
    description: 'AI 12가지 항목 상세 해석',
  },
  prompt_single: {
    id: 'prompt_single',
    name: '프롬프트 단건 설계',
    price: 30000,
    type: 'one_time',
    description: '업무 특화 프롬프트 1개 맞춤 설계 · 수정 1회 포함',
  },
  prompt_business: {
    id: 'prompt_business',
    name: '프롬프트 비즈니스 패키지',
    price: 99000,
    type: 'one_time',
    description: '업무 유형별 프롬프트 5개 설계 · 수정 3회 · 1:1 교육 포함',
  },
  prompt_team: {
    id: 'prompt_team',
    name: '프롬프트 팀/기업 패키지',
    price: 249000,
    type: 'one_time',
    description: '팀 전체 프롬프트 시스템 구축 · 10개 이상 설계 · 교육 자료 포함',
  },
  automation_basic: {
    id: 'automation_basic',
    name: '단순 업무 자동화',
    price: 50000,
    type: 'one_time',
    description: '단일 반복 업무 자동화 1건 개발 · 1~3일 납품',
  },
  automation_advanced: {
    id: 'automation_advanced',
    name: '업무 자동화 심화',
    price: 150000,
    type: 'one_time',
    description: '복합 업무 자동화 개발 · RPA·API 연동 · 1~2주 납품',
  },
  website_starter: {
    id: 'website_starter',
    name: '홈페이지 스타터 패키지',
    price: 200000,
    type: 'one_time',
    description: '5페이지 이내 반응형 홈페이지 · 기본 SEO · 3~5영업일 납품',
  },
  website_business: {
    id: 'website_business',
    name: '홈페이지 비즈니스 패키지',
    price: 1000000,
    type: 'one_time',
    description: '10페이지 이내 · 관리자 페이지 · SEO 최적화 · 1~2주 납품',
  },
  website_premium: {
    id: 'website_premium',
    name: '홈페이지 프리미엄 패키지',
    price: 2000000,
    type: 'one_time',
    description: '페이지 수 무제한 · 결제/회원 시스템 · DB 연동 · 일정 협의',
  },
  prompt_image_gen: {
    id: 'prompt_image_gen',
    name: 'AI 이미지 생성 마스터 프롬프트 패키지',
    price: 12900,
    type: 'one_time',
    description: '50종 이미지 생성 프롬프트 · 구도/조명/후처리 공식 포함 · 즉시 다운로드',
  },
  prompt_resume: {
    id: 'prompt_resume',
    name: 'AI 자소서·이력서 첨삭 마스터 프롬프트',
    price: 9900,
    type: 'one_time',
    description: '7가지 유형별 자소서 프롬프트 · STAR 기법 · ATS 최적화 · 즉시 다운로드',
  },
  prompt_email: {
    id: 'prompt_email',
    name: '비즈니스 이메일 마스터 프롬프트 패키지',
    price: 10900,
    type: 'one_time',
    description: '20종 비즈니스 이메일 프롬프트 · 상황별 템플릿 · 즉시 다운로드',
  },
  prompt_marketing: {
    id: 'prompt_marketing',
    name: '마케팅 카피·SNS 콘텐츠 프롬프트 패키지',
    price: 12900,
    type: 'one_time',
    description: '플랫폼별 카피 프롬프트 30종 · 광고 문구 · SNS 캡션 · 즉시 다운로드',
  },
  prompt_report: {
    id: 'prompt_report',
    name: '업무 보고서·기획서 작성 프롬프트 패키지',
    price: 10900,
    type: 'one_time',
    description: '보고서/기획서/회의록 유형별 프롬프트 25종 · 즉시 다운로드',
  },
  ai_kit_monthly: {
    id: 'ai_kit_monthly',
    name: 'AI 자동화 월 구독 키트',
    price: 19900,
    type: 'monthly',
    description: '소상공인·직장인을 위한 AI 자동화 도구 월 구독 · 매월 업데이트',
  },
};
