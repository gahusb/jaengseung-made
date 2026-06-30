import { describe, it, expect } from 'vitest';
import { SHOWCASE_SLOTS } from '@/lib/showcase';
import { MOCK_KEYS } from '@/app/components/mock/keys';

// 가드레일: 쇼케이스 슬롯이 라이트 목업 기반이고 보라/그래디언트 잔재가 없어야 한다.
const VIOLET_HEXES = ['#c4b5fd', '#f0abfc', '#341a4f', '#4a1342', '#7c3aed', '#9c48ea'];

describe('SHOWCASE_SLOTS 가드레일', () => {
  it('8슬롯이고 slug가 고유하다', () => {
    expect(SHOWCASE_SLOTS.length).toBe(8);
    const slugs = SHOWCASE_SLOTS.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('각 슬롯의 mock이 유효한 MockKey이고 핵심 필드가 비어있지 않다', () => {
    for (const s of SHOWCASE_SLOTS) {
      expect(MOCK_KEYS).toContain(s.mock);
      expect(s.slug.length).toBeGreaterThan(0);
      expect(s.label.length).toBeGreaterThan(0);
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.desc.length).toBeGreaterThan(0);
    }
  });

  it('어떤 슬롯에도 보라/그래디언트 hex가 남아있지 않다', () => {
    const serialized = JSON.stringify(SHOWCASE_SLOTS).toLowerCase();
    for (const hex of VIOLET_HEXES) {
      expect(serialized).not.toContain(hex.toLowerCase());
    }
    // 더 이상 palette 필드를 갖지 않는다 (라이트 목업 전환).
    for (const s of SHOWCASE_SLOTS) {
      expect('palette' in s).toBe(false);
    }
  });

  it('목업 종류가 최소 4가지 이상으로 다양하다 (단조 방지)', () => {
    const uniqueMocks = new Set(SHOWCASE_SLOTS.map((s) => s.mock));
    expect(uniqueMocks.size).toBeGreaterThanOrEqual(4);
  });
});
