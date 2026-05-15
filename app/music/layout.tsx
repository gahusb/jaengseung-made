import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 음악 제품',
  description: 'Suno 프롬프트 + 뮤직비디오 워크플로우 + 유튜브 SEO 템플릿 한 팩에. 1시간 만에 음악·뮤비 완성.',
};

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
