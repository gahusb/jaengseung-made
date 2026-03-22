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
    price: 4900,
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
};
