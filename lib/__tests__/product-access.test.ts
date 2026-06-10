import { describe, it, expect } from 'vitest';
import { expandProductAccess, MUSIC_PRODUCT_CHAIN } from '@/lib/product-access';

describe('expandProductAccess', () => {
  it('일반 제품은 자기 자신만 반환', () => {
    expect(expandProductAccess(['lotto_tool'])).toEqual(['lotto_tool']);
  });
  it('music_pro는 starter를 포함', () => {
    expect(expandProductAccess(['music_pro']).sort()).toEqual(['music_pro', 'music_starter'].sort());
  });
  it('music_master는 전 tier 포함', () => {
    expect(expandProductAccess(['music_master']).sort()).toEqual(
      ['music_master', 'music_pro', 'music_starter'].sort(),
    );
  });
  it('중복 입력은 중복 없이 반환', () => {
    expect(expandProductAccess(['music_pro', 'music_starter']).sort()).toEqual(
      ['music_pro', 'music_starter'].sort(),
    );
  });
  it('빈 입력은 빈 배열', () => {
    expect(expandProductAccess([])).toEqual([]);
  });
});
