import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '여긴 뭐 만들어요? — 자동화 도구 쇼케이스 | 쟁승메이드',
  description:
    '실제 고객 프로젝트 기반 자동화 도구를 직접 체험해보세요. 이베이 부품 AI 리스팅, 네이버 블로그 자동화 등 완성형 데모를 무료로 제공합니다.',
  openGraph: {
    title: '여긴 뭐 만들어요? — 자동화 도구 쇼케이스',
    description:
      '수작업 30분 → 10초. 실제로 작동하는 자동화 도구를 직접 체험해보세요.',
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
