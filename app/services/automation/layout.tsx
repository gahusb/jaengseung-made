import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 업무 자동화 개발 | 엑셀·이메일·RPA 외주',
  description:
    '매일 반복하는 엑셀 정리, 이메일 발송, 보고서 작성을 AI와 파이썬으로 자동화합니다. ChatGPT 연동 자동화, Make.com 플로우, Python RPA 개발. 5만원~, 계약서 포함, 1개월 무상 AS.',
  keywords: [
    '업무 자동화 외주',
    'AI 업무 자동화',
    '엑셀 자동화 외주',
    '파이썬 자동화 개발',
    'RPA 개발 외주',
    '이메일 자동화',
    '반복업무 자동화',
    'ChatGPT 자동화',
    'Make.com 자동화',
    '텔레그램 봇 개발',
    '업무 자동화 비용',
    '자동화 프리랜서',
  ],
  openGraph: {
    title: 'AI 업무 자동화 개발 | 쟁승메이드',
    description:
      '엑셀·이메일·보고서 반복 업무를 AI로 자동화. 현직 대기업 개발자가 직접 개발. 5만원~, 계약서 포함, 납기 패널티 적용.',
    url: 'https://jaengseung-made.com/services/automation',
  },
};

export default function AutomationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
