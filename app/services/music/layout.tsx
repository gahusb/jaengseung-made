import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 음악 마스터 구조 팩 | Suno · MV · 유튜브 쇼츠',
  description:
    '7년차 개발자가 설계한 4단계 AI 음악 제작 공정. Suno 프롬프트 조합법 + MV 비디오 생성 워크플로우 + 저작권 가이드 + 템플릿 PDF + 샘플 프로젝트. 입문 ₩39k / 프로 ₩99k / 마스터 ₩149k.',
  keywords: [
    'AI 음악 만들기',
    'Suno 프롬프트',
    'AI 뮤직비디오',
    'AI 커버곡',
    '유튜브 쇼츠 음악',
    'AI 작곡',
    '크리에이터 이코노미',
    'Lyria 프롬프트',
    'Runway AI 비디오',
  ],
  openGraph: {
    title: 'AI 음악 마스터 구조 팩 | 쟁승메이드',
    description:
      '네 사연을 노래로. 쇼츠까지 한 번에. 4단계 AI 음악 공정 · Suno Pro 검증 · 평생 업데이트.',
    url: 'https://jaengseung-made.com/services/music',
  },
};

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return children;
}
