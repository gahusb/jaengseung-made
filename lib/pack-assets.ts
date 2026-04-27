export interface PackAsset {
  name: string;
  files: string[];
}

export type PackTier = 'starter' | 'pro' | 'master';

export const PACK_ASSETS: Record<PackTier, PackAsset> = {
  starter: {
    name: 'AI 음악 마스터 팩 (입문)',
    files: [
      'Suno 프롬프트 북 PDF (40p)',
      '구조 템플릿 PDF',
      '저작권 가이드 기본판',
    ],
  },
  pro: {
    name: 'AI 음악 마스터 팩 (프로)',
    files: [
      '입문 자료 전체',
      'MV 워크플로우 가이드 (Runway · Luma · Pika)',
      '샘플 프로젝트 1개 (.prj 파일 + 영상)',
      '유튜브 SEO 템플릿',
      '1:1 Q&A 1회 (이메일 응답)',
    ],
  },
  master: {
    name: 'AI 음악 마스터 팩 (마스터)',
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
 */
export function extractPackTier(service: string): PackTier | null {
  if (!service.startsWith('구매 신청:')) return null;
  // service 예시: "구매 신청: AI 음악 마스터 팩 · 프로"
  // 마지막 "·" 뒤가 tier 이름
  const dotIdx = service.lastIndexOf('·');
  if (dotIdx === -1) return null;
  const tierName = service.slice(dotIdx + 1).trim();
  if (tierName === '입문') return 'starter';
  if (tierName === '프로') return 'pro';
  if (tierName === '마스터') return 'master';
  return null;
}
