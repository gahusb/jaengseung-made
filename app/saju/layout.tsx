import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 사주 분석',
  description:
    '생년월일시를 입력하면 Gemini AI가 사주팔자를 분석합니다. 일간·오행·대운·세운 기반 12개 항목 상세 해석. 재물운·애정운·직업·건강 포함.',
  keywords: [
    'AI 사주',
    '사주풀이',
    '사주팔자',
    '사주 분석',
    '오행 분석',
    '대운',
    '세운',
    '사주 운세',
  ],
  openGraph: {
    title: 'AI 사주 분석 | 쟁승메이드',
    description:
      'Gemini AI 기반 사주팔자 분석. 일간·오행·대운·세운·재물운·애정운 12개 항목 해석.',
    url: 'https://jaengseung-made.com/saju',
  },
};

export default function SajuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
