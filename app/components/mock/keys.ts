// 목업 키 — JSX를 끌어오지 않는 순수 모듈 (vitest/showcase가 안전하게 참조).
export type MockKey =
  | 'dashboard'
  | 'feed'
  | 'match'
  | 'commerce'
  | 'site'
  | 'booking';

export const MOCK_KEYS: MockKey[] = [
  'dashboard',
  'feed',
  'match',
  'commerce',
  'site',
  'booking',
];
