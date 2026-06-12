export type FieldMode = 'full' | 'lite' | 'static';

export interface FieldEnv {
  reducedMotion: boolean;
  webglSupported: boolean;
  hardwareConcurrency: number; // 미보고 시 0
  viewportWidth: number;
}

/** Deep Field 렌더 모드 판정 — 우선순위: 접근성 > 지원 여부 > 성능 */
export function decideFieldMode(env: FieldEnv): FieldMode {
  if (env.reducedMotion) return 'static';
  if (!env.webglSupported) return 'static';
  if (env.viewportWidth < 768) return 'lite';
  if (!env.hardwareConcurrency || env.hardwareConcurrency < 4) return 'lite';
  return 'full';
}
