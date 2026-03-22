import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '홈페이지·웹사이트 제작',
  description:
    '기업 홈페이지, 쇼핑몰, SaaS, 포트폴리오까지 반응형 웹사이트 제작. 디자인부터 배포까지 원스톱. 스타터 20만 원~, 계약서 포함, 3개월 유지보수.',
  keywords: [
    '홈페이지 제작',
    '웹사이트 제작',
    '쇼핑몰 제작',
    '반응형 웹',
    'Next.js 개발',
    '기업 홈페이지',
    '랜딩페이지 제작',
    'SEO 최적화',
  ],
  openGraph: {
    title: '홈페이지·웹사이트 제작 | 쟁승메이드',
    description:
      '기업·쇼핑몰·포트폴리오 웹사이트 제작. 스타터 20만 원~, 반응형 디자인, 계약서 포함.',
    url: 'https://jaengseung-made.com/services/website',
  },
};

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
