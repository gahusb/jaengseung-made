'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import type { ShowcaseSlot } from '@/lib/showcase';

interface Props {
  slot: ShowcaseSlot;
  size?: 'feature' | 'standard';
  index: number;
}

// ───────────────────────── 시드 PRNG (결정적) ─────────────────────────

/** slug → 32bit 정수 시드 (cyrb-ish 해시) */
function hashSlug(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — 시드 하나로 결정적 난수열 생성 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** #rrggbb → {r,g,b} */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

// ───────────────────────── 패턴 3종 (정적 텍스처) ─────────────────────────

type RGB = { r: number; g: number; b: number };

/** 1. 등고선 — accent 동심 곡선 흐름 */
function drawContour(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rng: () => number,
  c: RGB,
) {
  const cx = w * (0.3 + rng() * 0.4);
  const cy = h * (0.3 + rng() * 0.4);
  const rings = 9 + Math.floor(rng() * 5);
  const step = Math.max(w, h) / rings;
  const wobble = 0.12 + rng() * 0.1;
  const phase = rng() * Math.PI * 2;
  ctx.lineWidth = 1.25;
  for (let i = 1; i <= rings; i++) {
    const baseR = i * step;
    const alpha = 0.1 + (1 - i / rings) * 0.08; // 0.10~0.18
    ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
    ctx.beginPath();
    const segs = 72;
    for (let s = 0; s <= segs; s++) {
      const a = (s / segs) * Math.PI * 2;
      const r = baseR * (1 + Math.sin(a * 3 + phase + i * 0.6) * wobble);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r * 0.82;
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

/** 2. 격자 왜곡 — 미세하게 휘어진 그리드 라인 */
function drawGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rng: () => number,
  c: RGB,
) {
  const cols = 7 + Math.floor(rng() * 4);
  const rows = 5 + Math.floor(rng() * 4);
  const amp = 6 + rng() * 10;
  const fx = 1.5 + rng() * 2;
  const fy = 1.5 + rng() * 2;
  const phase = rng() * Math.PI * 2;
  ctx.lineWidth = 1;
  ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.14)`;
  // 세로선
  for (let i = 0; i <= cols; i++) {
    const baseX = (i / cols) * w;
    ctx.beginPath();
    for (let j = 0; j <= 40; j++) {
      const ny = j / 40;
      const y = ny * h;
      const x = baseX + Math.sin(ny * Math.PI * fy + phase + i * 0.4) * amp;
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // 가로선
  for (let i = 0; i <= rows; i++) {
    const baseY = (i / rows) * h;
    ctx.beginPath();
    for (let j = 0; j <= 40; j++) {
      const nx = j / 40;
      const x = nx * w;
      const y = baseY + Math.cos(nx * Math.PI * fx + phase + i * 0.4) * amp;
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

/** 3. 도트 필드 — 밀도 그라데이션 도트 */
function drawDots(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rng: () => number,
  c: RGB,
) {
  const gap = 16 + rng() * 8;
  const ox = rng() * Math.PI * 2;
  const oy = rng() * Math.PI * 2;
  // 밀도 중심 (가장 진한 지점)
  const dcx = w * (0.2 + rng() * 0.6);
  const dcy = h * (0.2 + rng() * 0.6);
  const maxD = Math.hypot(w, h);
  for (let y = gap * 0.5; y < h; y += gap) {
    for (let x = gap * 0.5; x < w; x += gap) {
      const jx = Math.sin((y / gap) * 1.3 + ox) * 2.5;
      const jy = Math.cos((x / gap) * 1.3 + oy) * 2.5;
      const px = x + jx;
      const py = y + jy;
      const d = Math.hypot(px - dcx, py - dcy) / maxD; // 0~~1
      const density = 1 - d; // 중심부 1
      const alpha = 0.06 + density * 0.16; // 0.06~0.22
      const radius = 0.9 + density * 1.8;
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

const PATTERNS = [drawContour, drawGrid, drawDots];

// ───────────────────────── 컴포넌트 ─────────────────────────

export default function ShowcaseCard({ slot, size = 'standard', index }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // 슬러그 시드 — 결정적 패턴 선택/파라미터
  const seed = hashSlug(slot.slug);
  const patternType = seed % PATTERNS.length;

  // 캔버스 1회 정적 렌더 (DPR 반영, 애니메이션 루프 없음)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const rng = mulberry32(seed);
      const c = hexToRgb(slot.accent);
      PATTERNS[patternType](ctx, w, h, rng, c);
    };

    draw();

    // 컨테이너 리사이즈 시 재렌더 (정적 — 루프 아님)
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [seed, patternType, slot.accent]);

  // 호버 시차 — 리스너/rAF는 hover 중에만 가동 (상시 rAF 금지)
  useEffect(() => {
    if (!hovered) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let rafId = 0;
    let tx = 0;
    let ty = 0;

    const apply = () => {
      rafId = 0;
      canvas.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
    };

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5~0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      tx = nx * 12; // ±6px
      ty = ny * 12;
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    wrap.addEventListener('mousemove', onMove);
    return () => {
      wrap.removeEventListener('mousemove', onMove);
      if (rafId) cancelAnimationFrame(rafId);
      canvas.style.transform = '';
    };
  }, [hovered]);

  const isFeature = size === 'feature';
  const isLink = Boolean(slot.href);

  // 타일 본체 (링크/div 공통)
  const tile = (
    <div
      ref={wrapRef}
      data-index={index}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        'group/card relative isolate h-full w-full overflow-hidden rounded-2xl',
        'transition-[transform,box-shadow] duration-500',
        '[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
        'motion-safe:hover:scale-[1.03]',
        isLink ? 'cursor-pointer' : 'cursor-default',
        isFeature ? 'aspect-[16/10]' : 'aspect-[4/3]',
      ].join(' ')}
      style={
        {
          '--card-accent': slot.accent,
          backgroundImage: `linear-gradient(135deg, ${slot.palette[0]}, ${slot.palette[1]})`,
          // 기본 보더는 다크 라인, hover 시 accent 점등 + 코너 글로우 (인라인 hover는 className으로)
          boxShadow: hovered
            ? `0 0 0 1px ${slot.accent}, 0 18px 50px -20px ${slot.accent}66, inset 0 0 60px -30px ${slot.accent}80`
            : '0 0 0 1px var(--jsm-dark-line, rgba(148,163,184,0.14))',
        } as React.CSSProperties
      }
    >
      {/* 제너러티브 텍스처 (정적) */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full will-change-transform"
      />

      {/* 하단 스크림 — 텍스트 가독성 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background:
            'linear-gradient(to top, rgba(7,13,26,0.92) 0%, rgba(7,13,26,0.55) 45%, transparent 100%)',
        }}
      />

      {/* 텍스트 레이어 */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5 sm:p-6">
        <span
          className="font-mono text-[11px] uppercase tracking-[0.18em]"
          style={{ color: slot.accent }}
        >
          {slot.label}
        </span>
        <h3
          className={[
            'font-bold leading-snug [word-break:keep-all]',
            isFeature ? 'text-xl sm:text-2xl' : 'text-lg',
          ].join(' ')}
          style={{ color: 'var(--jsm-dark-ink, #f8fafc)' }}
        >
          {slot.title}
        </h3>
        <p
          className="line-clamp-1 text-sm [word-break:keep-all]"
          style={{ color: 'var(--jsm-dark-soft, #94a3b8)' }}
        >
          {slot.desc}
        </p>

        {isLink && (
          <span
            className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-medium transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover/card:translate-x-1"
            style={{ color: slot.accent }}
          >
            데모 보기
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover/card:translate-x-0.5"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link href={slot.href!} aria-label={slot.title} className="block h-full w-full">
        {tile}
      </Link>
    );
  }

  return tile;
}
