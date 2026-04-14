'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ContactModal from './components/ContactModal';
import { trackCTAClick } from '../lib/gtag';

/* ═══════════════════════════════════════════════════
   쟁승메이드 홈 — v4 (AI Music 중심 개편)
   1. Hero: AI 음악 팩 (메인 매출)
   2. Sub: 사주 · 블로그팩 · 일반 문의
   3. About: 신뢰 지표
═══════════════════════════════════════════════════ */

const LIVE_SERVICES = [
  { name: 'AI Music Pack', label: '메인 상품' },
  { name: 'AI 사주 분석', label: '무료 도구' },
  { name: '블로그 자동화 팩', label: '디지털 상품' },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    el.querySelectorAll('.reveal').forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const containerRef = useScrollReveal();

  return (
    <div className="min-h-full" ref={containerRef}>
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service="일반 문의"
        checklist={[
          '문의하고 싶은 내용을 간략히 설명해주세요',
          '원하는 회신 방식 (이메일/전화)',
          '기타 참고 사항',
        ]}
        accentColor="text-violet-400"
        headerFrom="#1e1b4b"
        headerTo="#020617"
      />

      {/* ══════════════════════════════════════
          HERO — AI Music 중심
      ══════════════════════════════════════ */}
      <section
        className="relative overflow-hidden px-6 py-24 lg:px-14 lg:py-32"
        style={{
          background:
            'radial-gradient(circle at 20% 30%, #1e1b4b 0%, #020617 55%), radial-gradient(circle at 80% 70%, #0c4a6e 0%, transparent 50%)',
        }}
      >
        {/* Noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")",
          }}
        />
        {/* Waveform decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60 L1200,120 L0,120 Z"
              fill="url(#waveGrad)"
            />
            <defs>
              <linearGradient id="waveGrad" x1="0%" x2="100%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs text-violet-300/70 tracking-[0.25em] uppercase">
              쟁승메이드 × AI Music
            </span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              NEW
            </span>
          </div>

          <h1
            className="text-[2.6rem] md:text-[3.5rem] lg:text-[5rem] font-extrabold leading-[1.05] tracking-tight mb-6"
            style={{ wordBreak: 'keep-all' }}
          >
            <span className="text-white">네 사연을 노래로.</span>
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-sky-200 to-cyan-300 bg-clip-text text-transparent">
              쇼츠까지 한 번에.
            </span>
          </h1>

          <p
            className="text-slate-300 text-lg md:text-xl leading-relaxed mb-4 max-w-2xl"
            style={{ wordBreak: 'keep-all' }}
          >
            7년차 개발자가 설계한 <span className="text-white font-semibold">AI 음악 4단계 공정</span>.
            <br />
            컨셉 → 음악(Suno) → 비주얼(Runway) → 유튜브 퍼블리싱까지.
          </p>
          <p className="text-slate-400 text-base mb-10 max-w-2xl">
            ₩39,000부터. 평생 무료 업데이트.
          </p>

          <div className="flex flex-wrap gap-3 mb-14">
            <Link
              href="/services/music"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl font-bold text-sm transition-colors shadow-[0_0_40px_rgba(139,92,246,0.4)]"
            >
              팩 둘러보기
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/saju"
              className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-white/80 hover:text-white px-8 py-4 rounded-xl font-semibold text-sm transition-all"
            >
              무료 사주 분석 체험
            </Link>
          </div>

          <div className="border-t border-white/8 pt-8">
            <p className="font-mono text-[11px] text-violet-300/40 tracking-[0.25em] uppercase mb-4">
              운영 중
            </p>
            <div className="flex flex-wrap gap-6">
              {LIVE_SERVICES.map((s) => (
                <span key={s.name} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <span className="font-semibold">{s.name}</span>
                  <span className="font-mono text-[11px] text-white/30">{s.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — 서브 상품 카드
      ══════════════════════════════════════ */}
      <section className="bg-white px-6 py-20 lg:px-14">
        <div className="max-w-5xl mx-auto">
          <div className="reveal mb-10">
            <p className="font-mono text-xs text-violet-700/70 tracking-widest uppercase mb-2">
              More Products
            </p>
            <h2
              className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight"
              style={{ wordBreak: 'keep-all' }}
            >
              음악뿐이 아닙니다.
            </h2>
            <p className="text-slate-500 text-sm mt-2">무료 도구부터 디지털 상품까지.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 사주 */}
            <Link
              href="/saju"
              className="reveal reveal-d1 group relative flex flex-col border border-slate-200 hover:border-violet-400/50 rounded-2xl p-6 transition-all hover:shadow-lg bg-gradient-to-br from-white to-violet-50/40"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-600 border border-sky-500/20">
                  무료
                </span>
                <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-violet-700 transition-colors">
                AI 사주 분석
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-5" style={{ wordBreak: 'keep-all' }}>
                생년월일 입력하면 AI가 성격·직업·관계·운세를 즉시 분석합니다.
              </p>
              <span className="text-violet-700 text-sm font-bold group-hover:underline">
                무료로 시작 →
              </span>
            </Link>

            {/* 블로그팩 */}
            <Link
              href="/services/blog"
              className="reveal reveal-d2 group relative flex flex-col border border-slate-200 hover:border-blue-400/50 rounded-2xl p-6 transition-all hover:shadow-lg bg-white"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 border border-blue-500/20">
                  ₩29,000
                </span>
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                블로그 자동화 팩
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-5" style={{ wordBreak: 'keep-all' }}>
                쿠팡파트너스·애드포스트 수익을 자동화하는 프롬프트·템플릿·샘플 세트.
              </p>
              <span className="text-blue-700 text-sm font-bold group-hover:underline">
                팩 보기 →
              </span>
            </Link>

            {/* 일반 문의 */}
            <button
              onClick={() => {
                trackCTAClick('일반 문의', '/');
                setModalOpen(true);
              }}
              className="reveal reveal-d3 group relative flex flex-col text-left border border-slate-200 hover:border-slate-400 rounded-2xl p-6 transition-all hover:shadow-lg bg-white"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-600 border border-slate-500/20">
                  협업·외주
                </span>
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                일반 문의
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-5" style={{ wordBreak: 'keep-all' }}>
                협업·외주·제휴 문의. 24시간 이내 답변드립니다.
              </p>
              <span className="text-slate-700 text-sm font-bold group-hover:underline">
                문의하기 →
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — About
      ══════════════════════════════════════ */}
      <section className="bg-slate-950 px-6 py-20 lg:px-14">
        <div className="max-w-5xl mx-auto">
          <p className="reveal font-mono text-xs text-violet-300/50 tracking-widest uppercase mb-3">
            About
          </p>
          <div className="reveal grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <h2
                className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-6"
                style={{ wordBreak: 'keep-all' }}
              >
                7년간 실제 서비스를 만들었습니다.
                <br />
                <span className="text-violet-300">이제 AI로 당신의 콘텐츠를 만듭니다.</span>
              </h2>
              <div className="space-y-4 text-slate-400 text-base leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                <p>
                  대기업 IT팀에서 백엔드 개발 7년 — 실제 운영되는 서비스의 API 설계, DB, 배포 파이프라인을 직접 다뤘습니다.
                </p>
                <p>
                  지금은 그 경험으로 <span className="text-white">AI 음악·블로그 자동화·사주 AI</span>를 직접 만들어 운영·판매합니다.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { value: '7년', label: '대기업 백엔드 경력', sub: '실제 운영 서비스 다수', color: 'border-blue-500/30' },
                { value: '3개', label: '운영 중인 AI 서비스', sub: '사주 AI · 블로그팩 · 음악팩', color: 'border-emerald-500/30' },
                { value: '평생', label: '무료 업데이트', sub: '구매 후 Notion 공지로 전달', color: 'border-violet-500/30' },
                { value: '24h', label: '이내 답변', sub: '주말·공휴일 포함', color: 'border-amber-500/30' },
              ].map((item) => (
                <div key={item.value} className={`border-l-2 ${item.color} pl-5 py-2`}>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-white tracking-tight">{item.value}</span>
                    <span className="text-slate-400 text-sm font-medium">{item.label}</span>
                  </div>
                  <p className="text-white/30 text-xs mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 4 — 최종 CTA
      ══════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-slate-950 to-[#0b0530] px-6 py-20 lg:px-14">
        <div className="max-w-5xl mx-auto">
          <div className="reveal text-center">
            <p className="font-mono text-xs text-violet-300/50 tracking-widest uppercase mb-4">
              Get Started
            </p>
            <h2
              className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight"
              style={{ wordBreak: 'keep-all' }}
            >
              오늘 밤, 첫 쇼츠를
              <br />
              <span className="bg-gradient-to-r from-violet-300 via-sky-200 to-cyan-300 bg-clip-text text-transparent">
                업로드할 수 있어요.
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-10">
              ₩39,000부터 시작 · 평생 업데이트
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/services/music"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-10 py-4 rounded-xl font-extrabold text-base transition-colors shadow-[0_0_40px_rgba(139,92,246,0.4)]"
              >
                AI 음악 팩 보기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <button
                onClick={() => {
                  trackCTAClick('일반 문의', '/');
                  setModalOpen(true);
                }}
                className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-white/80 hover:text-white px-10 py-4 rounded-xl font-extrabold text-base transition-all"
              >
                협업·외주 문의
              </button>
            </div>
            <p className="text-white/20 text-xs mt-8 font-mono">
              쟁승메이드 · 사업자 267-53-00822 · bgg8988@gmail.com · 010-3907-1392
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
