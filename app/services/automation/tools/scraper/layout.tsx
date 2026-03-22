import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '웹 크롤링·스크래핑 도구',
  description:
    '공공데이터·쇼핑몰 가격·뉴스를 자동 수집해 엑셀로 저장하는 Python 웹 스크래퍼. requests + BeautifulSoup4 + openpyxl 기반. 무료 다운로드.',
  keywords: [
    '웹 크롤링',
    '웹 스크래핑',
    '파이썬 크롤러',
    '데이터 수집 자동화',
    'BeautifulSoup',
    '엑셀 자동화',
    '무료 크롤러',
  ],
  openGraph: {
    title: '웹 크롤링 자동화 도구 | 쟁승메이드',
    description: 'Python 기반 웹 크롤러 무료 다운로드. 페이지네이션·재시도·엑셀 저장 지원.',
    url: 'https://jaengseung-made.com/services/automation/tools/scraper',
  },
};

export default function ScraperLayout({ children }: { children: React.ReactNode }) {
  return children;
}
