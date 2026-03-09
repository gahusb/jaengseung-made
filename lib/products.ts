export interface Product {
  id: string;
  name: string;
  price: number;
  type: 'one_time' | 'monthly' | 'annual';
  description: string;
}

export const PRODUCTS: Record<string, Product> = {
  lotto_basic: {
    id: 'lotto_basic',
    name: '로또 기본 플랜',
    price: 4900,
    type: 'monthly',
    description: '매주 5개 번호 조합 이메일 제공',
  },
  lotto_premium: {
    id: 'lotto_premium',
    name: '로또 프리미엄 플랜',
    price: 9900,
    type: 'monthly',
    description: '매주 3회 번호 + 텔레그램 알림',
  },
  lotto_annual: {
    id: 'lotto_annual',
    name: '로또 연간 플랜',
    price: 89900,
    type: 'annual',
    description: '프리미엄 12개월 (2개월 무료)',
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
};
