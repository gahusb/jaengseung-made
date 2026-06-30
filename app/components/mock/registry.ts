// 목업 스크린 레지스트리 — showcase 슬롯의 mock 키를 컴포넌트로 해석.
import type { ComponentType } from 'react';

import {
  DashboardMock,
  FeedMock,
  MatchMock,
  CommerceMock,
  SiteMock,
  BookingMock,
} from './screens';

export type MockKey =
  | 'dashboard'
  | 'feed'
  | 'match'
  | 'commerce'
  | 'site'
  | 'booking';

export const MOCK_REGISTRY: Record<MockKey, ComponentType> = {
  dashboard: DashboardMock,
  feed: FeedMock,
  match: MatchMock,
  commerce: CommerceMock,
  site: SiteMock,
  booking: BookingMock,
};

export const MOCK_KEYS = Object.keys(MOCK_REGISTRY) as MockKey[];
