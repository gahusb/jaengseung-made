'use client';

import { useEffect, useState } from 'react';
import { decideFieldMode, type FieldMode } from '@/lib/deepfield-mode';

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/** SSR/첫 페인트는 'static'으로 시작 — 클라이언트에서 승격 (hydration 불일치 방지) */
export function useFieldMode(): FieldMode {
  const [mode, setMode] = useState<FieldMode>('static');
  useEffect(() => {
    setMode(
      decideFieldMode({
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        webglSupported: detectWebGL(),
        hardwareConcurrency: navigator.hardwareConcurrency ?? 0,
        viewportWidth: window.innerWidth,
      }),
    );
  }, []);
  return mode;
}
