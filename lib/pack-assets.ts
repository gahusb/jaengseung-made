export interface PackAsset {
  name: string;
  files: string[];
}

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

export const PACK_ASSETS: Record<PackTier, PackAsset> = {
  starter: {
    name: `AI 음악 마스터 팩 (${TIER_LABEL.starter})`,
    files: [
      'Suno 프롬프트 북 PDF (40p)',
      '구조 템플릿 PDF',
      '저작권 가이드 기본판',
    ],
  },
  pro: {
    name: `AI 음악 마스터 팩 (${TIER_LABEL.pro})`,
    files: [
      '입문 자료 전체',
      'MV 워크플로우 가이드 (Runway · Luma · Pika)',
      '샘플 프로젝트 1개 (.prj 파일 + 영상)',
      '유튜브 SEO 템플릿',
      '1:1 Q&A 1회 (이메일 응답)',
    ],
  },
  master: {
    name: `AI 음악 마스터 팩 (${TIER_LABEL.master})`,
    files: [
      '프로 자료 전체',
      '샘플 프로젝트 장르별 3종',
      '저작권 심화판 + 상업 이용 체크리스트',
      '제작 레시피 영상 (우선 공개)',
    ],
  },
};

/**
 * orders.service ("구매 신청: AI 음악 마스터 팩 · 프로") → tier key.
 * 매칭 안 되면 null 반환 (Music 팩 외 의뢰).
 *
 * NOTE: service 문자열은 U+00B7 MIDDLE DOT (·) 사용. 이 함수는 "마지막 ·" 뒤의
 * 단어를 tier 라벨로 인식. 예: "구매 신청: AI 음악 마스터 팩 · 프로" → "프로" → 'pro'.
 * Phase 2에서 marketing 카피가 tier 뒤에 추가 ·를 두면 이 로직 재검토 필요.
 */
export function extractPackTier(service: string): PackTier | null {
  if (!service.startsWith('구매 신청:')) return null;
  const dotIdx = service.lastIndexOf('·');
  if (dotIdx === -1) return null;
  const tierName = service.slice(dotIdx + 1).trim();
  return LABEL_TO_TIER[tierName] ?? null;
}

/**
 * Phase 2 migration note: `files: string[]` 는 placeholder. Phase 2에서 NAS
 * 파일 URL 도입 시 `files: { label: string; url?: string; sizeBytes?: number }[]`
 * 형태로 확장 필요. mypage page.tsx 의 `<span>{file}</span>` → `<span>{file.label}</span>`
 * 동시 변경.
 */
