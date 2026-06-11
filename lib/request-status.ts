/** 외주 의뢰 상태 머신 — DB CHECK(2026-06-12-client-portal.sql)와 단일 동기 소스 */
export type RequestStatus =
  | 'pending' | 'reviewing' | 'quoted' | 'accepted'
  | 'on_hold' | 'in_progress' | 'completed' | 'cancelled';

export const REQUEST_STATUS: Record<RequestStatus, { label: string }> = {
  pending:     { label: '접수' },
  reviewing:   { label: '검토중' },
  quoted:      { label: '견적 발송' },
  accepted:    { label: '수주 확정' },
  on_hold:     { label: '보류' },
  in_progress: { label: '진행중' },
  completed:   { label: '완료' },
  cancelled:   { label: '취소' },
};

/** 고객 타임라인 정주행 단계 (on_hold/cancelled는 별도 표기) */
export const TIMELINE_STEPS: RequestStatus[] = [
  'pending', 'reviewing', 'quoted', 'accepted', 'in_progress', 'completed',
];

/** 타임라인에서 현재 위치. on_hold→quoted 위치, cancelled→-1 */
export function timelineIndex(status: RequestStatus): number {
  if (status === 'cancelled') return -1;
  if (status === 'on_hold') return TIMELINE_STEPS.indexOf('quoted');
  return TIMELINE_STEPS.indexOf(status);
}

export function isRequestStatus(v: unknown): v is RequestStatus {
  return typeof v === 'string' && v in REQUEST_STATUS;
}
