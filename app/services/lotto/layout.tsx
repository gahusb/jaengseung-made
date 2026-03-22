import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로또 번호 추천',
  description:
    '1,100+회차 빅데이터 기반 로또 번호 분석. 핫/콜드 번호 통계, 몬테카를로 시뮬레이션으로 매주 최적 번호 조합을 제공합니다. 월 900원부터 구독.',
  keywords: [
    '로또 번호 추천',
    '로또 번호 분석',
    '로또 빅데이터',
    '로또 통계',
    '로또 번호 생성',
    '핫넘버 콜드넘버',
  ],
  openGraph: {
    title: '로또 번호 추천 서비스 | 쟁승메이드',
    description:
      '1,100+회차 데이터 분석 · 월 900원 구독 · 이메일/텔레그램 자동 발송.',
    url: 'https://jaengseung-made.com/services/lotto',
  },
};

export default function LottoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
