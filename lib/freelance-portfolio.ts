export interface PortfolioItem {
  title: string;
  category: string;
  desc: string;
  result: string;
  tags: string[];
  status: string;
  statusType: string;
  priceRange: string;
  accentColor: string;
  accentBg: string;
  borderAccent: string;
}

export const PORTFOLIO: PortfolioItem[] = [
  {
    title: '기업 브랜드 홈페이지',
    category: '웹사이트 제작 · Next.js',
    desc: '제조업체의 영업용 기업 소개 사이트. 서비스·연혁·팀 소개·문의 폼 포함. 모바일 반응형 및 SEO 최적화까지 포함하여 납품.',
    result: '납품 후 B2B 영업 미팅 시 "홈페이지 보고 연락했다" 비율 증가',
    tags: ['Next.js', 'Tailwind CSS', 'Vercel', 'SEO'],
    status: '납품 완료',
    statusType: 'done',
    priceRange: '50~200만원',
    accentColor: 'text-indigo-400',
    accentBg: 'bg-[#0d0a2e]',
    borderAccent: 'border-indigo-400/20',
  },
  {
    title: 'Gmail 자동화 RPA',
    category: 'RPA · 업무 자동화',
    desc: '거래처 이메일 수신 시 자동 분류, 답장 초안 작성, 담당자 알림 전송하는 Gmail 자동화 시스템.',
    result: '이메일 처리 시간 일 2시간 → 10분 (의뢰인 직접 확인)',
    tags: ['Python', 'Gmail API', 'Google Apps Script'],
    status: '납품 완료',
    statusType: 'done',
    priceRange: '30~150만원',
    accentColor: 'text-red-400',
    accentBg: 'bg-[#200a0a]',
    borderAccent: 'border-red-400/20',
  },
  {
    title: '쇼핑몰 가격 모니터링 봇',
    category: '웹 스크래핑 · 알림 자동화',
    desc: '경쟁사 쇼핑몰의 특정 상품 가격을 매일 모니터링하여 변동 시 텔레그램으로 즉시 알림.',
    result: '경쟁사 10곳 · 상품 50개 매일 자동 추적, 수동 확인 0분',
    tags: ['Python', 'Selenium', 'Telegram Bot'],
    status: '납품 완료',
    statusType: 'done',
    priceRange: '30~150만원',
    accentColor: 'text-violet-400',
    accentBg: 'bg-[#0d0a2e]',
    borderAccent: 'border-violet-400/20',
  },
  {
    title: '영업 일보 자동화 시스템',
    category: '엑셀 자동화 · 보고서 생성',
    desc: '영업 데이터 엑셀 파일을 자동으로 집계하여 일별/주별/월별 영업 일보 PDF를 생성하고 이메일 발송.',
    result: '보고서 작성 3시간 → 5분, 매일 09:00 자동 발송',
    tags: ['Python', 'OpenPyXL', 'ReportLab'],
    status: '납품 완료',
    statusType: 'done',
    priceRange: '30~150만원',
    accentColor: 'text-cyan-400',
    accentBg: 'bg-[#012030]',
    borderAccent: 'border-cyan-400/20',
  },
  {
    title: '부동산 공시지가 수집 시스템',
    category: '공공 데이터 · API 연동',
    desc: '국토교통부 공공 API를 통해 특정 지역 공시지가를 주기적으로 수집·저장하고 변동 알림 제공.',
    result: '전국 3개 지역 공시지가 주 1회 자동 수집·변동 알림',
    tags: ['Python', '공공데이터 API', 'PostgreSQL', 'Telegram'],
    status: '납품 완료',
    statusType: 'done',
    priceRange: '30~150만원',
    accentColor: 'text-blue-400',
    accentBg: 'bg-[#04102b]',
    borderAccent: 'border-blue-400/20',
  },
];
