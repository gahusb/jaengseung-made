import { describe, it, expect } from 'vitest';
import { decideFieldMode } from '@/lib/deepfield-mode';

const base = { reducedMotion: false, webglSupported: true, hardwareConcurrency: 8, viewportWidth: 1440 };

describe('decideFieldMode', () => {
  it('데스크톱 + WebGL = full', () => {
    expect(decideFieldMode(base)).toBe('full');
  });
  it('reduced-motion이면 무조건 static', () => {
    expect(decideFieldMode({ ...base, reducedMotion: true })).toBe('static');
    expect(decideFieldMode({ ...base, reducedMotion: true, viewportWidth: 375 })).toBe('static');
  });
  it('WebGL 미지원이면 static', () => {
    expect(decideFieldMode({ ...base, webglSupported: false })).toBe('static');
  });
  it('모바일 뷰포트(<768)는 lite', () => {
    expect(decideFieldMode({ ...base, viewportWidth: 767 })).toBe('lite');
  });
  it('저성능 코어(<4)는 lite', () => {
    expect(decideFieldMode({ ...base, hardwareConcurrency: 2 })).toBe('lite');
  });
  it('hardwareConcurrency 미보고(0/undefined)는 lite로 보수적 판정', () => {
    expect(decideFieldMode({ ...base, hardwareConcurrency: 0 })).toBe('lite');
  });
});
