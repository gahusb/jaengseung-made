// SaaS 제품 카탈로그 (/packages)
//
// 확장 규칙: 새 SaaS 제품을 출시하면 SAAS_CATALOG 배열에 객체 하나만 추가하면
// /packages 페이지에 카드가 자동으로 노출된다. 결제는 productId로 lib/products.ts의
// PRODUCTS 정의와 subscriptions 인프라에 연결한다.
//
// 음악(AI 음악 생성 개발 가이드 패키지)은 단품 라인이므로 여기에 넣지 않는다(/music 유지).

export type SaasStatus = 'available' | 'coming_soon';

export interface SaasCatalogItem {
  /** /packages 내 식별자 (향후 /packages/[slug] 상세에 사용) */
  slug: string;
  /** 카드 제목 */
  name: string;
  /** 한 줄 요약 (카드 상단) */
  tagline: string;
  /** 카드 본문 설명 */
  description: string;
  /** 가격 표시용 라벨 (예: "월 ₩29,000"). 미정이면 생략 */
  priceLabel?: string;
  /** 과금 형태 */
  billing: 'monthly' | 'one_time';
  /** 노출 상태 — available: 구매 가능 / coming_soon: 예고 */
  status: SaasStatus;
  /** 핵심 기능 목록 */
  features: string[];
  /** 분류 라벨 (예: '자동화') */
  category: string;
  /** lib/products.ts PRODUCTS 키 참조 (결제 연결, available일 때) */
  productId?: string;
  /** available일 때 상세/결제 경로 */
  href?: string;
  /** 카드 강조 뱃지 (예: 'NEW') */
  badge?: string;
}

/**
 * 등록된 SaaS 제품 목록.
 *
 * 2026-05-31 현재 비어 있다. 메이킹 스페이스에서 검증된 자동화가 1개 확정되면
 * 아래 형태로 항목을 추가한다:
 *
 *   {
 *     slug: 'making-verify',
 *     name: '메이킹 검증 자동화',
 *     tagline: '...',
 *     description: '...',
 *     priceLabel: '월 ₩29,000',
 *     billing: 'monthly',
 *     status: 'available',
 *     features: ['...'],
 *     category: '자동화',
 *     productId: 'making_verify_monthly',  // lib/products.ts에 함께 추가
 *     href: '/packages/making-verify',
 *   }
 */
export const SAAS_CATALOG: SaasCatalogItem[] = [];

export const getAvailablePackages = () =>
  SAAS_CATALOG.filter((p) => p.status === 'available');

export const getComingSoonPackages = () =>
  SAAS_CATALOG.filter((p) => p.status === 'coming_soon');
