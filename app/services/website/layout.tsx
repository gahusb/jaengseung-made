import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '홈페이지·쇼핑몰·랜딩페이지 제작 | 반응형 웹 개발 외주',
  description:
    '소상공인·스타트업·기업 홈페이지, 쇼핑몰, 랜딩페이지 제작. 템플릿 없이 직접 개발. Next.js 기반 반응형 웹, SEO 기본 적용. 스타터 20만원~, 계약서 포함, 3개월 유지보수.',
  keywords: [
    '홈페이지 제작 외주',
    '쇼핑몰 제작 외주',
    '랜딩페이지 제작',
    '소상공인 홈페이지',
    '스타트업 웹사이트',
    '반응형 홈페이지 제작',
    'Next.js 개발 외주',
    '기업 홈페이지 제작',
    '웹사이트 제작 비용',
    'SEO 최적화 홈페이지',
    '홈페이지 개발 프리랜서',
  ],
  openGraph: {
    title: '홈페이지·쇼핑몰 제작 | 쟁승메이드',
    description:
      '소상공인·스타트업 홈페이지 제작. 템플릿 없이 직접 개발, SEO 포함, 20만원~.',
    url: 'https://jaengseung-made.com/services/website',
  },
};

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
