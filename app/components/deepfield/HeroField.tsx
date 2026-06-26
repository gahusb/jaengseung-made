'use client';

import { useEffect, useRef, useState } from 'react';
// 타입만 정적 import — 번들에 코드가 들어가지 않음 (import type)
import type * as THREE from 'three';

import { useFieldMode } from './useFieldMode';

interface Props {
  className?: string;
}

/**
 * 정적 2광원 radial 그래디언트.
 * static 모드 단독 비주얼이자, full/lite에서 캔버스 아래에 항상 깔리는 베이스.
 * (WebGL 로딩 전/실패 시에도 비주얼 공백 없음)
 */
function StaticField() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        backgroundColor: 'var(--jsm-dark-bg, #070d1a)',
        backgroundImage: [
          // 광원1: 우상단 — accent blue-700 (텍스트 컬럼에서 떨어진 우측에 배치, 밝기 완화)
          'radial-gradient(58% 52% at 78% 22%, rgba(29,78,216,0.30) 0%, transparent 46%)',
          // 광원2: 우하단 — bright blue (sky-400), 좌측 텍스트와 겹치지 않게 우측 이동 + 밝기 완화
          'radial-gradient(52% 48% at 82% 88%, rgba(56,189,248,0.10) 0%, transparent 42%)',
        ].join(','),
      }}
    />
  );
}

// ───────────────────────── 셰이더 ─────────────────────────

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;      // NDC (-1..1), lite/static에선 사실상 미사용
  uniform float uMouseAmp;   // 커서 자기장 세기 (lite=0)
  uniform float uScroll;     // 0..1, 진행될수록 흩어짐
  uniform float uPixelRatio;

  attribute float aScale;    // 파티클별 기본 크기 (1.5~3px)
  attribute float aSeed;     // 드리프트 위상 분산

  varying float vAlpha;
  varying vec3  vColor;

  // 색: #60a5fa(밝은) ↔ #1d4ed8(딥) 보간
  const vec3 C_BRIGHT = vec3(0.376, 0.647, 0.980); // #60a5fa
  const vec3 C_DEEP   = vec3(0.114, 0.306, 0.847); // #1d4ed8

  void main() {
    vec3 pos = position;

    // 미세 유영 — 사인 노이즈 (드리프트)
    float t = uTime * 0.18 + aSeed * 6.2831853;
    pos.x += sin(t) * 0.06;
    pos.y += cos(t * 0.9) * 0.06;
    pos.z += sin(t * 0.7) * 0.04;

    // 스크롤 — 진행될수록 바깥으로 밀려 흩어짐
    pos.xy += normalize(pos.xy + 0.0001) * uScroll * 0.9;

    // 커서 자기장 — 화면 평면 기준 거리로 부드럽게 밀어냄
    if (uMouseAmp > 0.0) {
      vec2 toP = pos.xy - uMouse * 1.6;
      float d = length(toP);
      float radius = 0.7;
      float push = smoothstep(radius, 0.0, d); // 가까울수록 1
      pos.xy += normalize(toP + 0.0001) * push * 0.35 * uMouseAmp;
      pos.z  += push * 0.2 * uMouseAmp;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // 크기: 원근(-mvPosition.z) 반영 + DPR
    gl_PointSize = aScale * uPixelRatio * (300.0 / -mvPosition.z);

    // 색: seed로 두 파랑 사이 보간
    vColor = mix(C_DEEP, C_BRIGHT, aSeed);

    // 불투명도: 스크롤로 소멸, 깊이로 약간 페이드 (전체 톤 다운 — 텍스트 가독성 우선)
    float depthFade = smoothstep(-3.0, 0.5, mvPosition.z);
    vAlpha = (1.0 - uScroll) * (0.28 + depthFade * 0.18);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;
  varying float vAlpha;
  varying vec3  vColor;

  void main() {
    // 원형 소프트 포인트 — 가장자리 부드럽게
    vec2 c = gl_PointCoord - vec2(0.5);
    float dist = length(c);
    if (dist > 0.5) discard;
    float soft = smoothstep(0.5, 0.05, dist);
    gl_FragColor = vec4(vColor, soft * vAlpha);
  }
`;

// ───────────────────────── 컴포넌트 ─────────────────────────

export default function HeroField({ className }: Props) {
  const mode = useFieldMode();
  // WebGL 초기화 실패 시 static으로 강등
  const [failed, setFailed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const effectiveMode = failed ? 'static' : mode;
  const animated = effectiveMode === 'full' || effectiveMode === 'lite';

  useEffect(() => {
    if (!animated) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isFull = effectiveMode === 'full';
    // 밀도 완화 — 가산 혼합 파티클이 겹쳐 텍스트 뒤를 밝게 씻어내는(화이트 블룸) 현상 억제
    const COUNT = isFull ? 1600 : 500;

    let disposed = false;
    let rafId = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let points: THREE.Points | null = null;
    let io: IntersectionObserver | null = null;

    // 가시성/뷰포트 상태 — 둘 다 OK일 때만 rAF 돌림
    let pageVisible = document.visibilityState !== 'hidden';
    let inView = true;

    // 마우스 스무딩 (NDC)
    const mouse = { x: 0, y: 0 };
    const mouseTarget = { x: 0, y: 0 };

    // 핸들러 참조 (cleanup용)
    let onMouseMove: ((e: MouseEvent) => void) | null = null;
    let onResize: (() => void) | null = null;
    let onVisibility: (() => void) | null = null;

    const start = () => {
      if (rafId || disposed) return;
      if (!pageVisible || !inView) return;
      rafId = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    let loop: (now: number) => void = () => {};

    (async () => {
      let THREE_NS: typeof THREE;
      try {
        // three는 dynamic import만 — 메인 번들 분리
        THREE_NS = await import('three');
      } catch {
        if (!disposed) setFailed(true);
        return;
      }
      if (disposed || !canvasRef.current) return;

      try {
        const width = canvas.clientWidth || window.innerWidth;
        const height = canvas.clientHeight || window.innerHeight;

        renderer = new THREE_NS.WebGLRenderer({
          canvas,
          alpha: true, // 섹션 bg가 비치도록 투명
          antialias: false,
          powerPreference: 'low-power',
        });
        // lite는 DPR 1 고정, full은 최대 2로 제한
        const dpr = isFull ? Math.min(window.devicePixelRatio || 1, 2) : 1;
        renderer.setPixelRatio(dpr);
        renderer.setSize(width, height, false);
        renderer.setClearColor(0x000000, 0); // 완전 투명

        scene = new THREE_NS.Scene();
        camera = new THREE_NS.PerspectiveCamera(60, width / height, 0.1, 100);
        camera.position.z = 3;

        // 얕은 3D 슬랩: 화면을 덮는 균일 분포 + 약간의 노이즈, z 약간 분산
        const positions = new Float32Array(COUNT * 3);
        const scales = new Float32Array(COUNT);
        const seeds = new Float32Array(COUNT);
        const SPREAD_X = 5.0;
        const SPREAD_Y = 3.2;
        for (let i = 0; i < COUNT; i++) {
          positions[i * 3 + 0] = (Math.random() - 0.5) * SPREAD_X;
          positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD_Y;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 1.2; // 얕은 z 분산
          scales[i] = 1.5 + Math.random() * 1.5; // 1.5~3px
          seeds[i] = Math.random();
        }

        geometry = new THREE_NS.BufferGeometry();
        geometry.setAttribute('position', new THREE_NS.BufferAttribute(positions, 3));
        geometry.setAttribute('aScale', new THREE_NS.BufferAttribute(scales, 1));
        geometry.setAttribute('aSeed', new THREE_NS.BufferAttribute(seeds, 1));

        material = new THREE_NS.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uMouse: { value: new THREE_NS.Vector2(0, 0) },
            uMouseAmp: { value: isFull ? 1 : 0 }, // lite는 커서 반응 off
            uScroll: { value: 0 },
            uPixelRatio: { value: dpr },
          },
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
          transparent: true,
          depthWrite: false,
          depthTest: false,
          blending: THREE_NS.AdditiveBlending, // 미세한 글로우
        });

        points = new THREE_NS.Points(geometry, material);
        scene.add(points);

        // ── 핸들러 ──
        if (isFull) {
          onMouseMove = (e: MouseEvent) => {
            mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseTarget.y = -((e.clientY / window.innerHeight) * 2 - 1);
          };
          window.addEventListener('mousemove', onMouseMove, { passive: true });
        }

        onResize = () => {
          if (!renderer || !camera || !canvasRef.current) return;
          const w = canvasRef.current.clientWidth || window.innerWidth;
          const h = canvasRef.current.clientHeight || window.innerHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
        };
        window.addEventListener('resize', onResize, { passive: true });

        onVisibility = () => {
          pageVisible = document.visibilityState !== 'hidden';
          if (pageVisible) start();
          else stop();
        };
        document.addEventListener('visibilitychange', onVisibility);

        // 뷰포트 밖이면 rAF 정지
        io = new IntersectionObserver(
          (entries) => {
            inView = entries[0]?.isIntersecting ?? false;
            if (inView) start();
            else stop();
          },
          { threshold: 0 },
        );
        io.observe(canvas);

        // ── 렌더 루프 ──
        const clock = new THREE_NS.Clock();
        loop = () => {
          rafId = 0;
          if (disposed || !renderer || !scene || !camera || !material) return;

          const elapsed = clock.getElapsedTime();
          const u = material.uniforms;
          u.uTime.value = elapsed;

          // 커서 스무딩 (lerp 0.08)
          mouse.x += (mouseTarget.x - mouse.x) * 0.08;
          mouse.y += (mouseTarget.y - mouse.y) * 0.08;
          (u.uMouse.value as THREE.Vector2).set(mouse.x, mouse.y);

          // 스크롤 진행도 0~1 clamp
          const scrollT = Math.min(
            Math.max(window.scrollY / (window.innerHeight || 1), 0),
            1,
          );
          u.uScroll.value = scrollT;

          renderer.render(scene, camera);
          start();
        };

        start();
      } catch {
        if (!disposed) setFailed(true);
      }
    })();

    // ── cleanup: rAF cancel + 리스너 제거 + dispose ──
    return () => {
      disposed = true;
      stop();
      if (onMouseMove) window.removeEventListener('mousemove', onMouseMove);
      if (onResize) window.removeEventListener('resize', onResize);
      if (onVisibility) document.removeEventListener('visibilitychange', onVisibility);
      io?.disconnect();
      geometry?.dispose();
      material?.dispose();
      renderer?.dispose();
      scene = null;
      camera = null;
      points = null;
    };
  }, [animated, effectiveMode]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`}>
      {/* 정적 그래디언트 — 항상 캔버스 아래에 깔림 */}
      <StaticField />
      {animated && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );
}
