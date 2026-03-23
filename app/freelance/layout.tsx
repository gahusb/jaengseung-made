import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '외주 개발 의뢰',
  description:
    '계약서 먼저, 납기 지키고, 소스코드 100% 인도. 47건 납품 완료. 현직 대기업 백엔드 개발자에게 외주 개발을 맡겨보세요. 납기 지연 시 하루 10만 원 패널티.',
  keywords: [
    '외주 개발',
    '프리랜서 개발자',
    '웹 개발 외주',
    '앱 개발 외주',
    'RPA 개발',
    '업무 자동화 외주',
    '소프트웨어 개발',
  ],
  openGraph: {
    title: '외주 개발 의뢰 | 쟁승메이드',
    description:
      '47건 납품 완료. 계약서 먼저, 납기 패널티, 소스코드 100% 인도. 연락 두절 없는 개발자.',
    url: 'https://jaengseung-made.com/freelance',
  },
};

export default function FreelanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
