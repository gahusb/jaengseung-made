import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ChatGPT·Claude 프롬프트 엔지니어링 | 업무 AI 자동화',
  description:
    'ChatGPT, Claude, Gemini를 제대로 활용하는 맞춤형 프롬프트 설계. 이메일·보고서·코드리뷰·고객응대 업무를 AI로 3~5배 빠르게. 이미지 생성 프롬프트 패키지 12,900원, 자소서 첨삭 프롬프트 9,900원.',
  keywords: [
    '프롬프트 엔지니어링',
    'ChatGPT 프롬프트 만들기',
    'Claude 프롬프트 최적화',
    'AI 업무 자동화 프롬프트',
    'ChatGPT 활용법',
    '이미지 생성 프롬프트',
    'Midjourney 프롬프트',
    '자소서 AI 첨삭',
    '이력서 AI 교정',
    '프롬프트 패키지',
    'AI 프롬프트 구매',
  ],
  openGraph: {
    title: 'ChatGPT·Claude 프롬프트 엔지니어링 | 쟁승메이드',
    description:
      '업무 특화 AI 프롬프트 설계. 이미지 생성·자소서 첨삭 패키지 즉시 구매 가능. 9,900원~.',
    url: 'https://jaengseung-made.com/services/prompt',
  },
};

export default function PromptLayout({ children }: { children: React.ReactNode }) {
  return children;
}
