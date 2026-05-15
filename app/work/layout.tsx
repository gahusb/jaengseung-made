import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom Build — 맞춤 개발 사업부',
  description: '7년차 백엔드 개발자가 직접 설계·개발·납품. 외주 · 웹사이트 · AI 사주 · 블로그 자동화.',
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
