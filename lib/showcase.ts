/** Deep Field 쇼케이스 8슬롯 — 단일 소스.
 *  href가 있는 슬롯만 클릭 가능 (샘플 리뉴얼 완료 시 href 추가). */
export interface ShowcaseSlot {
  slug: string;
  label: string;       // 모노스페이스 컨셉 라벨 (영문)
  title: string;       // 카드 타이틀 (한글)
  desc: string;        // 한 줄 설명
  palette: [string, string]; // 카드 고유 그래디언트 월드 [from, to]
  accent: string;      // 카드 포인트 컬러
  href?: string;       // 리뉴얼 완료된 샘플의 데모 링크
}

export const SHOWCASE_SLOTS: ShowcaseSlot[] = [
  { slug: 'corporate', label: 'corporate',  title: '기업 브랜드 사이트',  desc: '신뢰를 첫인상으로 — 브랜드 스토리와 IR까지', palette: ['#13203a', '#0d2c54'], accent: '#60a5fa' },
  { slug: 'shopping',  label: 'commerce',   title: '커머스 스토어',       desc: '탐색부터 결제까지 끊김 없는 구매 동선',        palette: ['#1a1430', '#341a4f'], accent: '#c4b5fd' },
  { slug: 'dashboard', label: 'dashboard',  title: '데이터 대시보드',     desc: '실시간 지표를 한눈에 — 의사결정용 화면',        palette: ['#0f2922', '#14503c'], accent: '#6ee7b7' },
  { slug: 'bakery',    label: 'local shop', title: '로컬 매장 사이트',    desc: '예약·주문이 자연스러운 동네 가게의 얼굴',       palette: ['#2b1a10', '#4f2d14'], accent: '#fdba74' },
  { slug: 'portfolio', label: 'portfolio',  title: '포트폴리오',          desc: '작업물이 주인공이 되는 미니멀 갤러리',          palette: ['#101418', '#23272d'], accent: '#e2e8f0' },
  { slug: 'game',      label: 'game',       title: '게임 프로모션',       desc: '세계관에 빠져들게 하는 런칭 페이지',            palette: ['#250f23', '#4a1342'], accent: '#f0abfc' },
  { slug: 'interior',  label: 'interior',   title: '인테리어 스튜디오',   desc: '공간의 톤을 그대로 옮긴 쇼룸',                  palette: ['#1f2218', '#3a4028'], accent: '#d9f99d' },
  { slug: 'reading',   label: 'editorial',  title: '에디토리얼·매거진',   desc: '읽는 경험을 설계한 콘텐츠 사이트',              palette: ['#101b2b', '#1f3a5f'], accent: '#93c5fd' },
];
