import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PPT 제작 자동화 도구',
  description:
    '엑셀 데이터로 PPT를 자동 생성하는 Python 스크립트. 표지·내용·마무리 슬라이드 자동 구성, 색상 테마 커스터마이징. python-pptx 기반. 무료 다운로드.',
  keywords: [
    'PPT 자동화',
    '파워포인트 자동 생성',
    'python-pptx',
    'PPT 제작 도구',
    '엑셀 PPT 변환',
    '프레젠테이션 자동화',
    '무료 PPT 도구',
  ],
  openGraph: {
    title: 'PPT 제작 자동화 도구 | 쟁승메이드',
    description: 'Python + python-pptx 기반 PPT 자동 생성 도구 무료 다운로드. 엑셀 연동 지원.',
    url: 'https://jaengseung-made.com/services/automation/tools/ppt',
  },
};

export default function PptLayout({ children }: { children: React.ReactNode }) {
  return children;
}
