'use client';

import { useState } from 'react';
import Link from 'next/link';
import ContactModal from './components/ContactModal';
import { trackCTAClick } from '../lib/gtag';

/* ═══════════════════════════════════════════════════
   쟁승메이드 홈 — v5 (Kinetic Ether Dashboard)
   상단 라우터 페이지를 워크스페이스형 대시보드로 재구성.
═══════════════════════════════════════════════════ */

interface Tile {
  href: string;
  label: string;
  title: string;
  desc: string;
  tag: string;
  tagColor: string;
  onClick?: () => void;
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  const tiles: Tile[] = [
    {
      href: '/services/music',
      label: 'FLAGSHIP',
      title: 'AI 음악 마스터',
      desc: '네 사연을 노래로. 쇼츠까지 한 번에. Suno·Runway·유튜브 SEO를 묶은 4단계 공정 팩.',
      tag: '₩39k~149k',
      tagColor: 'var(--kx-primary)',
    },
    {
      href: '/services/blog',
      label: 'DIGITAL PACK',
      title: '블로그 자동화 팩',
      desc: '프롬프트 조합법 + 템플릿 PDF + 샘플. 쿠팡파트너스·애드포스트 수익화 루틴.',
      tag: '₩29,000',
      tagColor: 'var(--kx-secondary)',
    },
    {
      href: '/saju',
      label: 'FREE TOOL',
      title: 'AI 사주 분석',
      desc: '사주팔자 자동 산출 + Gemini 기반 해석. 검증된 계산 엔진.',
      tag: 'FREE',
      tagColor: '#40ceed',
    },
  ];

  return (
    <div className="kx-section min-h-full relative overflow-hidden">
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service="일반 문의"
        checklist={['연락처/이메일', '원하는 작업 범위', '희망 일정']}
      />

      {/* 배경 오브 */}
      <div className="kx-orb" style={{ width: 520, height: 520, background: '#9c48ea', top: -180, left: -120 }} />
      <div className="kx-orb" style={{ width: 420, height: 420, background: '#53ddfc', bottom: -150, right: -100, opacity: 0.25 }} />
      <div className="kx-orb" style={{ width: 300, height: 300, background: '#cc97ff', top: '40%', right: '10%', opacity: 0.18 }} />

      {/* 워크스페이스 헤더 */}
      <header className="relative z-10 px-6 lg:px-12 pt-10 pb-6 border-b border-white/5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <span className="kx-label">WORKSPACE / JAENGSEUNG.MAKE</span>
            <h1 className="kx-display text-2xl md:text-3xl font-extrabold mt-1.5">
              Creative Studio <span className="kx-gradient-text">Overview</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--kx-on-variant)' }}>
            <span className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono tracking-wider">SYSTEM ONLINE</span>
            </span>
            <span className="hidden md:inline font-mono">v2026.04</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 px-6 lg:px-12 py-10 space-y-10">
        {/* Hero: Launch Panel */}
        <section className="kx-folder kx-glow" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-0">
            {/* 좌측: 카피 */}
            <div className="p-8 lg:p-12">
              <span className="kx-label">FLAGSHIP RELEASE · 2026</span>
              <h2 className="kx-display text-4xl md:text-5xl lg:text-6xl font-extrabold mt-4 leading-[1.05]">
                네 사연을 노래로.
                <br />
                <span className="kx-gradient-text">쇼츠까지 한 번에.</span>
              </h2>
              <p className="mt-6 text-base md:text-lg max-w-xl leading-relaxed">
                AI로 음악을 뽑는 게 아니라,{' '}
                <span style={{ color: 'var(--kx-on-surface)' }}>고품질 결과물을 빠르게</span> 뽑는 법을 팝니다.
                컨셉 → 음악 → 비주얼 → 퍼블리싱, 4단계 공정을 구조화한 마스터 팩.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  href="/services/music"
                  onClick={() => trackCTAClick('home_hero_music')}
                  className="kx-btn-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm"
                >
                  AI 음악 팩 보기 <span>→</span>
                </Link>
                <a
                  href="#tiles"
                  className="kx-btn-ghost inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold"
                >
                  전체 상품 보기
                </a>
              </div>
            </div>
            {/* 우측: 엔진 상태 모니터 */}
            <div
              className="hidden lg:block relative"
              style={{ background: 'var(--kx-surface-low)', borderLeft: '1px solid rgba(204,151,255,0.08)' }}
            >
              <div className="p-8 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <span className="kx-label">ENGINE STATUS</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--kx-secondary-dim)' }}>REAL-TIME</span>
                </div>
                <div className="space-y-5 flex-1">
                  <EngineRow label="SUNO PRO" value="2,490 credits" pct={83} />
                  <EngineRow label="GEMINI 2.5" value="Online" pct={100} />
                  <EngineRow label="RUNWAY" value="Standby" pct={62} />
                  <EngineRow label="PUBLISHING" value="Ready" pct={94} />
                </div>
                <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="flex items-baseline justify-between">
                    <span className="kx-label">DELIVERED</span>
                    <span className="kx-display text-3xl font-extrabold">47<span style={{ color: 'var(--kx-on-variant)', fontSize: '1rem', fontWeight: 400 }}> projects</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 서비스 타일 */}
        <section id="tiles">
          <div className="flex items-end justify-between mb-5">
            <div>
              <span className="kx-label">PRODUCTS</span>
              <h3 className="kx-display text-2xl md:text-3xl font-extrabold mt-1">Launch Pads</h3>
            </div>
            <span className="text-xs font-mono hidden md:inline" style={{ color: 'var(--kx-on-variant)' }}>
              {tiles.length} modules active
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {tiles.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                onClick={() => trackCTAClick(`home_tile_${t.href}`)}
                className="kx-folder group relative transition-all hover:-translate-y-1"
                style={{ textDecoration: 'none' }}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="kx-label" style={{ color: t.tagColor }}>{t.label}</span>
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                    style={{ background: 'rgba(255,255,255,0.05)', color: t.tagColor }}
                  >
                    {t.tag}
                  </span>
                </div>
                <h4 className="kx-display text-xl font-extrabold mb-2">{t.title}</h4>
                <p className="text-sm leading-relaxed">{t.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-bold" style={{ color: t.tagColor }}>
                  열기
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats Monitor */}
        <section className="kx-folder">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="kx-label">CREDIBILITY MONITOR</span>
              <h3 className="kx-display text-xl font-extrabold mt-1">왜 쟁승메이드인가</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Stat num="47" label="프로젝트 납품" sub="계약 기반" />
            <Stat num="100%" label="소스코드 인도" sub="저작권 100% 이양" />
            <Stat num="24h" label="평균 응답" sub="이메일/카톡 기준" />
            <Stat num="0" label="분쟁 이력" sub="계약서 우선 원칙" />
          </div>
        </section>

        {/* Final CTA */}
        <section className="kx-glass px-8 py-10 text-center" style={{ border: '1px solid rgba(204,151,255,0.12)' }}>
          <span className="kx-label">NEXT STEP</span>
          <h3 className="kx-display text-2xl md:text-3xl font-extrabold mt-2">프로젝트 문의가 있으신가요?</h3>
          <p className="mt-3 text-sm md:text-base max-w-xl mx-auto">
            맞춤 개발·컨설팅·협업 제안 모두 환영합니다. 24시간 이내 회신 드립니다.
          </p>
          <button
            onClick={() => {
              trackCTAClick('home_final_contact');
              setModalOpen(true);
            }}
            className="kx-btn-primary mt-6 px-7 py-3.5 rounded-xl text-sm"
          >
            일반 문의 보내기
          </button>
        </section>
      </div>
    </div>
  );
}

function EngineRow({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="kx-label" style={{ fontSize: '0.625rem' }}>{label}</span>
        <span className="text-xs font-mono" style={{ color: 'var(--kx-on-surface)' }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #cc97ff, #53ddfc)',
          }}
        />
      </div>
    </div>
  );
}

function Stat({ num, label, sub }: { num: string; label: string; sub: string }) {
  return (
    <div>
      <div className="kx-display text-3xl md:text-4xl font-extrabold kx-gradient-text">{num}</div>
      <div className="mt-2 text-sm font-bold" style={{ color: 'var(--kx-on-surface)' }}>{label}</div>
      <div className="text-xs mt-0.5">{sub}</div>
    </div>
  );
}
