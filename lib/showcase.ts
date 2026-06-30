/** Deep Field 쇼케이스 8슬롯 — 단일 소스 (라이트 MockWindow 목업 기반).
 *  href가 있는 슬롯만 클릭 가능 (샘플 데모 완료 시 href 추가). */
import type { MockKey } from '@/app/components/mock/keys';

export interface ShowcaseSlot {
  slug: string;
  label: string; // 모노스페이스 컨셉 라벨 (영문)
  title: string; // 카드 타이틀 (한글)
  desc: string; // 한 줄 설명
  mock: MockKey; // 카드에 렌더할 라이트 목업 화면
  href?: string; // 데모 링크 (있으면 클릭 가능)
}

export const SHOWCASE_SLOTS: ShowcaseSlot[] = [
  { slug: 'corporate',  label: 'corporate',  title: '기업 브랜드 사이트', desc: '신뢰를 첫인상으로 — 브랜드 스토리와 회사 소개', mock: 'site' },
  { slug: 'commerce',   label: 'commerce',   title: '커머스 스토어',      desc: '탐색부터 결제까지 끊김 없는 구매 동선',        mock: 'commerce' },
  { slug: 'dashboard',  label: 'dashboard',  title: '데이터 대시보드',    desc: '실시간 지표를 한눈에 — 의사결정용 화면',        mock: 'dashboard' },
  { slug: 'automation', label: 'automation', title: '봇·자동화 알림',     desc: '체결·알림·리포트를 사람 손 없이 자동 전송',     mock: 'feed' },
  { slug: 'matching',   label: 'matching',   title: '조건 매칭 시스템',   desc: '수집·필터·매칭으로 원하는 것만 골라내는 화면',  mock: 'match' },
  { slug: 'booking',    label: 'local shop', title: '예약·매장 사이트',   desc: '예약·주문이 자연스러운 동네 가게의 얼굴',       mock: 'booking' },
  { slug: 'portfolio',  label: 'portfolio',  title: '포트폴리오',         desc: '작업물이 주인공이 되는 미니멀 갤러리',          mock: 'site' },
  { slug: 'editorial',  label: 'editorial',  title: '에디토리얼·매거진',  desc: '읽는 경험을 설계한 콘텐츠 사이트',              mock: 'site' },
];
