import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '블로그 자동화 솔루션 팩 | 쟁승메이드',
  description:
    '쿠팡파트너스·네이버 애드포스트·브랜드커넥트 수익을 자동화하는 프롬프트 조합법 45종 + 구조 템플릿 PDF 80p + 샘플 글 10편. ₩29,000 한 번 결제, 평생 무료 업데이트.',
  keywords: [
    '블로그 자동화',
    'AI 블로그 글쓰기',
    '쿠팡파트너스 자동화',
    '애드포스트 수익화',
    '네이버 블로그 SEO',
    'ChatGPT 블로그',
    '블로그 프롬프트',
  ],
  openGraph: {
    title: '블로그 자동화 솔루션 팩 | 쟁승메이드',
    description:
      '쿠팡파트너스·애드포스트 수익을 자동화하는 프롬프트 + 템플릿 + 샘플. ₩29,000.',
    url: 'https://jaengseung-made.com/work/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
