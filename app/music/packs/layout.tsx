import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 음악 생성 개발 가이드 패키지 | Suno · MV · 유튜브 쇼츠',
  description:
    '엔지니어가 설계한 AI 음악 생성 개발 가이드. Suno 프롬프트 조합법 + MV 비디오 생성 워크플로우 + 저작권 가이드 + 템플릿 PDF + 샘플 프로젝트. 1회 결제 · 입문 ₩39k / 프로 ₩99k / 마스터 ₩149k.',
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
    title: 'AI 음악 생성 개발 가이드 패키지 | 쟁승메이드',
    description:
      '네 사연을 노래로. 쇼츠까지 한 번에. AI 음악 생성 개발 가이드 · Suno Pro 검증 · 평생 업데이트.',
    url: 'https://jaengseung-made.com/music/packs',
  },
};

export default function MusicPacksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
