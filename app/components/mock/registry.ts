// 목업 스크린 레지스트리 — showcase 슬롯의 mock 키를 컴포넌트로 해석.
import type { ComponentType } from 'react';

import type { MockKey } from './keys';
import {
  DashboardMock,
  FeedMock,
  MatchMock,
  CommerceMock,
  SiteMock,
  BookingMock,
} from './screens';

export type { MockKey } from './keys';
export { MOCK_KEYS } from './keys';

export const MOCK_REGISTRY: Record<MockKey, ComponentType> = {
  dashboard: DashboardMock,
  feed: FeedMock,
  match: MatchMock,
  commerce: CommerceMock,
  site: SiteMock,
  booking: BookingMock,
};
