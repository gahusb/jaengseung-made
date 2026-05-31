import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SaaS 제품 · 월 구독 패키지',
  description:
    '현직 엔지니어가 실제 운영하며 검증한 자동화를 월 구독 SaaS 제품으로 제공합니다. 첫 제품 준비 중 — 출시 알림을 신청하세요.',
  keywords: ['SaaS', '자동화 구독', '월 구독 자동화', 'AI 자동화 제품', '쟁승메이드'],
  openGraph: {
    title: 'SaaS 제품 · 월 구독 패키지 | 쟁승메이드',
    description:
      '검증된 자동화를 SaaS로. 현직 엔지니어가 직접 운영·검증한 자동화 제품 카탈로그.',
    url: 'https://jaengseung-made.com/packages',
  },
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
