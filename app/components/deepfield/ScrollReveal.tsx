'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  /** 등장 지연(ms) — 연속 항목 스태거용 */
  delay?: number;
  /** 'fade-up'(기본) | 'fade' | 'draw'(선 그리기용 — width 확장) */
  variant?: 'fade-up' | 'fade' | 'draw';
  className?: string;
}

export default function ScrollReveal({ children, delay = 0, variant = 'fade-up', className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // reduced-motion: 즉시 표시 (연출 생략)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden =
    variant === 'fade' ? 'opacity-0' :
    variant === 'draw' ? 'opacity-0 [transform:scaleX(0)] origin-left' :
    'opacity-0 translate-y-6';

  const visible =
    variant === 'draw' ? 'opacity-100 [transform:scaleX(1)]' :
    variant === 'fade' ? 'opacity-100' :
    'opacity-100 translate-y-0';

  return (
    <div
      ref={ref}
      className={`${className ?? ''} transition-all duration-700 ease-out ${shown ? visible : hidden}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
