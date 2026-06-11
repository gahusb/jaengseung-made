import { describe, it, expect } from 'vitest';
import { REQUEST_STATUS, TIMELINE_STEPS, timelineIndex, isRequestStatus } from '@/lib/request-status';

describe('request-status', () => {
  it('8개 상태 라벨 정의', () => {
    expect(Object.keys(REQUEST_STATUS)).toHaveLength(8);
    expect(REQUEST_STATUS.quoted.label).toBe('견적 발송');
  });
  it('타임라인은 정주행 6단계', () => {
    expect(TIMELINE_STEPS).toEqual(['pending','reviewing','quoted','accepted','in_progress','completed']);
  });
  it('timelineIndex — 정주행 상태는 해당 인덱스', () => {
    expect(timelineIndex('pending')).toBe(0);
    expect(timelineIndex('completed')).toBe(5);
  });
  it('timelineIndex — on_hold는 quoted 위치(2), cancelled는 -1', () => {
    expect(timelineIndex('on_hold')).toBe(2);
    expect(timelineIndex('cancelled')).toBe(-1);
  });
  it('isRequestStatus 가드', () => {
    expect(isRequestStatus('quoted')).toBe(true);
    expect(isRequestStatus('nope')).toBe(false);
  });
});
