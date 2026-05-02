export type PackTier = 'starter' | 'pro' | 'master';

/**
 * Tier 키 → 한국어 표시명 SSOT.
 * `app/services/music/page.tsx`의 TIERS와 일치 유지 필요 (현재 입문/프로/마스터).
 */
export const TIER_LABEL: Record<PackTier, string> = {
  starter: '입문',
  pro: '프로',
  master: '마스터',
};

const LABEL_TO_TIER: Record<string, PackTier> = Object.fromEntries(
  Object.entries(TIER_LABEL).map(([tier, label]) => [label, tier as PackTier])
);

/**
 * Tier 키 → 팩 이름 (mypage 표시용).
 * 자료 파일 리스트는 pack_files DB 테이블이 SSOT.
 */
export const PACK_TIER_NAMES: Record<PackTier, string> = {
  starter: `AI 음악 마스터 팩 (${TIER_LABEL.starter})`,
  pro: `AI 음악 마스터 팩 (${TIER_LABEL.pro})`,
  master: `AI 음악 마스터 팩 (${TIER_LABEL.master})`,
};

/**
 * orders.service ("구매 신청: AI 음악 마스터 팩 · 프로") → tier key.
 * 매칭 안 되면 null 반환 (Music 팩 외 의뢰).
 *
 * NOTE: service 문자열은 U+00B7 MIDDLE DOT (·) 사용.
 */
export function extractPackTier(service: string): PackTier | null {
  if (!service.startsWith('구매 신청:')) return null;
  const dotIdx = service.lastIndexOf('·');
  if (dotIdx === -1) return null;
  const tierName = service.slice(dotIdx + 1).trim();
  return LABEL_TO_TIER[tierName] ?? null;
}
