import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '커스텀 외주 — 맞춤 개발',
  description: '7년차 백엔드 개발자가 직접 설계·개발·납품. 외주 · 웹사이트 · AI 사주.',
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
