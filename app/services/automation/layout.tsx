import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '업무 자동화 개발',
  description:
    '엑셀 자동화, 웹 스크래핑, 이메일 자동 발송, RPA, 텔레그램 봇 개발. 반복 업무를 자동화하여 시간을 절약하세요. 단순 자동화 5만 원~, 1개월 무상 AS.',
  keywords: [
    '업무 자동화',
    'RPA',
    '엑셀 자동화',
    '웹 스크래핑',
    '텔레그램 봇',
    '이메일 자동화',
    '반복업무 자동화',
    '파이썬 자동화',
  ],
  openGraph: {
    title: '업무 자동화 개발 | 쟁승메이드',
    description:
      'RPA·엑셀·스크래핑·텔레그램 봇. 단순 자동화 5만 원~, 1개월 무상 AS, 계약서 포함.',
    url: 'https://jaengseung-made.com/services/automation',
  },
};

export default function AutomationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
