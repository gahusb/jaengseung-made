/**
 * orders 기반 제품 접근 확장.
 * 음악 팩 상위 tier는 하위 tier 파일도 포함(하위 호환) — 신규 제품은 1:1.
 */
export const MUSIC_PRODUCT_CHAIN: Record<string, string[]> = {
  music_starter: ['music_starter'],
  music_pro: ['music_pro', 'music_starter'],
  music_master: ['music_master', 'music_pro', 'music_starter'],
};

export function expandProductAccess(paidProductIds: string[]): string[] {
  const out = new Set<string>();
  for (const id of paidProductIds) {
    for (const expanded of MUSIC_PRODUCT_CHAIN[id] ?? [id]) out.add(expanded);
  }
  return Array.from(out);
}
