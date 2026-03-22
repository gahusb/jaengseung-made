import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '프롬프트 엔지니어링',
  description:
    'ChatGPT·Claude·Gemini에 최적화된 업무 특화 프롬프트 설계. 반복 업무를 AI로 자동화하는 프롬프트 라이브러리 제공. 건당 30,000원~.',
  keywords: [
    '프롬프트 엔지니어링',
    'ChatGPT 프롬프트',
    'Claude 프롬프트',
    'AI 프롬프트',
    '업무 AI 자동화',
    '프롬프트 최적화',
    '프롬프트 설계',
  ],
  openGraph: {
    title: '프롬프트 엔지니어링 | 쟁승메이드',
    description:
      'ChatGPT·Claude 업무 특화 프롬프트 설계. 건당 30,000원~, 납품 후 사용 교육 포함.',
    url: 'https://jaengseung-made.com/services/prompt',
  },
};

export default function PromptLayout({ children }: { children: React.ReactNode }) {
  return children;
}
