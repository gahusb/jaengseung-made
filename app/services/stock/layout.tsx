import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '주식 자동 매매 프로그램',
  description:
    'NAS 서버에서 직접 운영 중인 주식 자동 매매 시스템. RSI·MACD·볼린저밴드 기반 매매 신호를 텔레그램으로 수신하고 자동 매수·매도합니다. 키움·한국투자 연동.',
  keywords: [
    '주식 자동 매매',
    '알고트레이딩',
    '주식 자동화',
    '텔레그램 주식 알림',
    '키움 자동매매',
    '주식 프로그램',
    'RSI 매매',
  ],
  openGraph: {
    title: '주식 자동 매매 프로그램 | 쟁승메이드',
    description:
      '직접 운영 중인 알고트레이딩 시스템. 텔레그램 연동 · 자동 매수매도 · 설치 49,000원~.',
    url: 'https://jaengseung-made.com/services/stock',
  },
};

export default function StockLayout({ children }: { children: React.ReactNode }) {
  return children;
}
