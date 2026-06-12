'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  /** 카운트업 목표 숫자 */
  to: number;
  /** 숫자 앞에 붙는 고정 텍스트 (예: 없음) */
  prefix?: string;
  /** 숫자 뒤에 붙는 고정 텍스트 (예: '+') */
  suffix?: string;
  /** 애니메이션 길이(ms) — 기본 600 */
  duration?: number;
  className?: string;
}

/**
 * IntersectionObserver 진입 시 0 → to 로 카운트업.
 * prefers-reduced-motion이면 즉시 최종값 표시(연출 생략).
 * transform/opacity가 아닌 textContent 변경이라 레이아웃 안정 위해 tabular-nums 권장.
 */
export default function CountUp({ to, prefix = '', suffix = '', duration = 600, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    let started = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const run = () => {
      // reduced-motion: 즉시 최종값 (연출 생략)
      if (reduced) {
        setValue(to);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        // easeOutCubic — 끝에서 부드럽게 안착
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(eased * to));
        if (t < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started) {
          started = true;
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {value.toLocaleString('ko-KR')}
      {suffix}
    </span>
  );
}
