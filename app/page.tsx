'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContactModal from './components/ContactModal';
import { trackCTAClick } from '../lib/gtag';

/* ═══════════════════════════════════════════════════
   쟁승메이드 홈 v6 — AI Music Creator Landing
   참조: Downloads/stitch_ai_mv/ai_music_creator_landing_page
═══════════════════════════════════════════════════ */

const TOOLKIT = [
  { accent: 'var(--kx-primary)', icon: '🎛', title: 'Suno 프롬프트 레시피', desc: '원하는 장르와 감성을 완벽하게 구현하는 검증된 프롬프트 조합 모음.' },
  { accent: 'var(--kx-secondary)', icon: '✍', title: '작사 치트키 템플릿', desc: '주제만 넣으면 감성적인 가사를 뽑아내는 AI 라이팅 가이드.' },
  { accent: '#ff86c3', icon: '🎬', title: '뮤직비디오 워크플로우', desc: '음악 비트에 맞춰 자동으로 영상을 생성·편집하는 원스톱 프로세스.' },
  { accent: '#c284ff', icon: '⚖', title: '저작권 세이프 가이드', desc: 'AI 생성물의 상업적 이용과 저작권 등록을 위한 체크리스트.' },
  { accent: 'var(--kx-secondary-dim)', icon: '📄', title: 'PDF 기획 템플릿', desc: '채널 브랜딩부터 콘텐츠 기획까지 한번에 끝내는 실행 가이드북.' },
  { accent: '#ffffff', icon: '📦', title: '성공 사례 샘플 프로젝트', desc: '조회수 100만 이상을 기록한 프로젝트의 실제 파일 구조 분석.' },
];

const BEFORE = [
  '작곡 공부에만 최소 6개월 소요',
  '영상 편집 프로그램 학습의 높은 장벽',
  '항상 불안한 저작권 위반 위험',
  '곡 하나 완성에 드는 수백만 원의 외주비',
];

const AFTER = [
  '단 1시간 만에 프로급 음원 & 영상 완성',
  '드래그 앤 드롭 수준의 직관적인 워크플로우',
  '가이드대로 따라하면 완벽한 저작권 해결',
  '커피 한 잔 가격으로 무한대 콘텐츠 생산',
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="relative overflow-x-hidden">
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service="일반 문의"
        checklist={['연락처/이메일', '원하는 작업 범위', '희망 일정']}
      />

      {/* 1. Hero */}
      <section className="relative px-6 py-24 lg:py-32 overflow-hidden">
        <Image
          src="/hero_back.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center pointer-events-none select-none"
          style={{ opacity: 0.35 }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(156,72,234,0.28) 0%, transparent 60%), linear-gradient(180deg, rgba(6,14,32,0.35) 0%, rgba(6,14,32,0.85) 75%, var(--kx-surface) 100%)',
          }}
        />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="kx-label inline-block mb-6">프롬프트·템플릿 팩 (PDF + 에셋) · 2026</span>
          <h1 className="kx-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05]" style={{ wordBreak: 'keep-all' }}>
            AI로 음악 + <span className="kx-gradient-text">뮤직비디오까지</span>
            <br />1시간 만에 완성
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--kx-on-variant)' }}>
            조회수 터지는 콘텐츠 제작 시스템. 음악 이론을 몰라도 누구나 프로 수준의 결과물을 만듭니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              href="/services/music#pricing"
              onClick={() => trackCTAClick('home_v6_hero_primary')}
              className="kx-btn-primary px-8 py-4 rounded-full text-base inline-flex items-center justify-center gap-2"
            >
              ₩39,000 팩 자세히 보기
            </Link>
            <Link
              href="/services/music#samples"
              className="px-8 py-4 rounded-full text-base font-bold inline-flex items-center justify-center"
              style={{
                background: 'rgba(25,37,64,0.4)',
                border: '1px solid rgba(64,72,93,0.3)',
                color: 'var(--kx-secondary)',
                backdropFilter: 'blur(8px)',
                textDecoration: 'none',
              }}
            >
              샘플 결과 보기
            </Link>
          </div>

          {/* Price tier mini summary */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-stretch sm:items-center gap-2 sm:gap-3 mb-16 text-sm max-w-md mx-auto sm:max-w-none">
            <span
              className="px-4 py-2 rounded-full"
              style={{ background: 'rgba(25,37,64,0.5)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--kx-on-variant)' }}
            >
              입문 <strong style={{ color: 'var(--kx-on-surface)' }}>₩39,000</strong>
            </span>
            <span
              className="px-4 py-2 rounded-full"
              style={{
                background: 'rgba(156,72,234,0.15)',
                border: '1px solid rgba(204,151,255,0.4)',
                color: 'var(--kx-on-surface)',
                boxShadow: '0 0 20px rgba(156,72,234,0.25)',
              }}
            >
              🔥 프로 <strong>₩99,000</strong> <span style={{ color: 'var(--kx-primary)' }}>가장 많이 팔림</span>
            </span>
            <span
              className="px-4 py-2 rounded-full"
              style={{ background: 'rgba(25,37,64,0.5)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--kx-on-variant)' }}
            >
              마스터 <strong style={{ color: 'var(--kx-on-surface)' }}>₩149,000</strong>
            </span>
          </div>

          {/* Demo Showcase Card */}
          <div
            className="relative max-w-5xl mx-auto overflow-hidden"
            style={{
              borderRadius: '0.75rem 0.75rem 0.125rem 0.125rem',
              border: '1px solid rgba(64,72,93,0.15)',
              background: 'var(--kx-surface-low)',
              boxShadow: '0 20px 80px 0 rgba(156,72,234,0.15)',
            }}
          >
            <div className="aspect-video relative flex items-center justify-center group cursor-pointer">
              {/* 배경 그라디언트 + 그리드 */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, #0b0b2b 0%, #1a0840 50%, #061228 100%)',
                  opacity: 0.9,
                }}
              />
              <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 1200 500">
                <defs>
                  <linearGradient id="wg" x1="0%" x2="100%">
                    <stop offset="0%" stopColor="#cc97ff" />
                    <stop offset="100%" stopColor="#53ddfc" />
                  </linearGradient>
                </defs>
                {[...Array(40)].map((_, i) => (
                  <rect
                    key={i}
                    x={i * 30 + 10}
                    y={Number((250 - Math.abs(Math.sin(i * 0.6) * 120)).toFixed(3))}
                    width="10"
                    height={Number((Math.abs(Math.sin(i * 0.6) * 240) + 20).toFixed(3))}
                    fill="url(#wg)"
                    opacity={Number((0.4 + Math.sin(i * 0.3) * 0.3).toFixed(3))}
                  />
                ))}
              </svg>

              <div
                className="relative z-10 p-8 rounded-full border group-hover:scale-110 transition-transform"
                style={{
                  background: 'rgba(204,151,255,0.15)',
                  borderColor: 'rgba(204,151,255,0.5)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--kx-primary)' }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>

              <div
                className="absolute bottom-0 left-0 right-0 p-6 text-left"
                style={{
                  background: 'linear-gradient(to top, var(--kx-surface), transparent)',
                }}
              >
                <span className="kx-label block mb-2">DEMO SHOWCASE</span>
                <h3 className="kx-display text-xl md:text-2xl font-bold" style={{ color: 'var(--kx-on-surface)' }}>
                  쟁승메이드로 제작된 K-POP 스타일 MV 샘플
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Evidence */}
      <section id="evidence" className="py-24 px-6" style={{ background: 'var(--kx-surface-low)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span
              className="kx-label inline-block px-3 py-1 mb-3 rounded-full"
              style={{
                background: 'rgba(255,200,80,0.12)',
                border: '1px solid rgba(255,200,80,0.35)',
                color: '#ffcd5c',
              }}
            >
              DEMO · 예시 이미지
            </span>
            <h2 className="kx-display text-3xl md:text-4xl font-bold" style={{ color: 'var(--kx-on-surface)' }}>
              이런 결과를 목표로 만듭니다
            </h2>
            <p className="mt-3 text-sm" style={{ color: 'var(--kx-on-variant)' }}>
              아래 수치는 실제 실적이 아닌 기대 결과 예시입니다. 실샘플은 런칭 후 순차 공개.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { hue: 'from-violet-600 to-fuchsia-500', views: '조회수 1.2M', comments: '댓글 4.5K' },
              { hue: 'from-sky-600 to-cyan-500', views: '조회수 850K', comments: '댓글 2.1K' },
              { hue: 'from-pink-600 to-rose-500', views: '조회수 2.4M', comments: '댓글 12K' },
            ].map((c, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl hover:-translate-y-2 transition-transform"
                style={{ background: 'var(--kx-surface-mid)' }}
              >
                <div className={`h-48 bg-gradient-to-br ${c.hue} relative`}>
                  <div className="absolute inset-0 bg-black/30" />
                  <svg className="absolute inset-0 w-full h-full opacity-50" preserveAspectRatio="none" viewBox="0 0 400 200">
                    {[...Array(30)].map((_, j) => (
                      <rect
                        key={j}
                        x={j * 14 + 8}
                        y={Number((100 - Math.abs(Math.sin((j + i * 5) * 0.5) * 60)).toFixed(3))}
                        width="6"
                        height={Number((Math.abs(Math.sin((j + i * 5) * 0.5) * 120) + 10).toFixed(3))}
                        fill="white"
                        opacity={0.4}
                      />
                    ))}
                  </svg>
                </div>
                <div className="p-4 flex items-center gap-4 text-sm" style={{ color: 'var(--kx-on-variant)' }}>
                  <span>👁 {c.views}</span>
                  <span>💬 {c.comments}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Before / After */}
      <section className="py-24 px-6" style={{ background: 'var(--kx-surface)' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="kx-display text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: 'var(--kx-on-surface)' }}>
            압도적인 제작 효율의 차이
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="kx-glass kx-folder relative" style={{ borderTop: '2px solid rgba(255,110,132,0.4)' }}>
              <span className="kx-label absolute top-4 right-4" style={{ color: '#d73357' }}>MANUAL PROCESS</span>
              <h3 className="kx-display text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: '#ff6e84' }}>
                ⚠ Before
              </h3>
              <ul className="space-y-3">
                {BEFORE.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm" style={{ color: 'var(--kx-on-variant)' }}>
                    <span style={{ color: '#d73357' }}>✗</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="kx-glass kx-folder kx-glow relative" style={{ borderTop: '2px solid rgba(83,221,252,0.4)' }}>
              <span className="kx-label absolute top-4 right-4">AI POWERED</span>
              <h3 className="kx-display text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--kx-secondary)' }}>
                ⚡ After
              </h3>
              <ul className="space-y-3">
                {AFTER.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm" style={{ color: 'var(--kx-on-surface)' }}>
                    <span style={{ color: 'var(--kx-secondary)' }}>✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Toolkit */}
      <section className="py-24 px-6" style={{ background: 'var(--kx-surface-low)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="kx-label">TOOLKIT</span>
            <h2 className="kx-display text-3xl md:text-4xl font-bold mt-2 mb-3" style={{ color: 'var(--kx-on-surface)' }}>
              The Toolkit Assets
            </h2>
            <p className="text-base" style={{ color: 'var(--kx-on-variant)' }}>
              성공적인 AI 뮤직 크리에이터를 위한 모든 필수 자산.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOOLKIT.map((t) => (
              <div
                key={t.title}
                className="p-6 transition-all hover:-translate-y-1"
                style={{
                  background: 'var(--kx-surface-high)',
                  borderTop: `2px solid ${t.accent}`,
                  borderRadius: '0.75rem 0.75rem 0.125rem 0.125rem',
                }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl"
                  style={{ background: `${t.accent}1a` }}
                >
                  {t.icon}
                </div>
                <h4 className="kx-display text-lg font-bold mb-2" style={{ color: 'var(--kx-on-surface)' }}>{t.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--kx-on-variant)' }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Process 3-step */}
      <section className="py-24 px-6" style={{ background: 'var(--kx-surface)' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="kx-display text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: 'var(--kx-on-surface)' }}>
            딱 3단계면 충분합니다
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative">
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5 -z-0"
              style={{ background: 'linear-gradient(90deg, rgba(204,151,255,0.3), rgba(83,221,252,0.3), rgba(255,134,195,0.3))' }}
            />
            {[
              { step: '01', title: '프롬프트 입력', desc: '아이디어를 한 줄로 설명하세요', icon: '⌨', color: 'var(--kx-primary)' },
              { step: '02', title: 'AI 음악 생성', desc: '30초 만에 완성되는 고퀄리티 음원', icon: '🎵', color: 'var(--kx-secondary)' },
              { step: '03', title: '뮤직비디오 렌더링', desc: '유튜브 쇼츠, 릴스 즉시 업로드', icon: '🎥', color: '#ff86c3' },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-4 text-center relative z-10">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                  style={{
                    background: 'var(--kx-surface-mid)',
                    border: `3px solid ${s.color}`,
                    boxShadow: `0 0 24px 0 ${s.color}55`,
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <span className="kx-label" style={{ color: s.color }}>Step {s.step}</span>
                  <h4 className="kx-display text-xl font-bold mt-2" style={{ color: 'var(--kx-on-surface)' }}>{s.title}</h4>
                  <p className="text-sm mt-2" style={{ color: 'var(--kx-on-variant)' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Other Products + CTA */}
      <section className="py-24 px-6" style={{ background: 'var(--kx-surface-low)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="kx-label">OTHER PRODUCTS</span>
            <h2 className="kx-display text-3xl md:text-4xl font-bold mt-2" style={{ color: 'var(--kx-on-surface)' }}>
              박재오가 만든 다른 도구
            </h2>
            <p className="mt-3 text-sm max-w-xl mx-auto" style={{ color: 'var(--kx-on-variant)' }}>
              현직 엔지니어가 본인 워크플로우에 쓰는 도구를 직접 패키징합니다. 운영·CS도 혼자 책임집니다.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 mb-16">
            <Link
              href="/services/blog"
              className="p-8 transition-all hover:-translate-y-1"
              style={{
                background: 'var(--kx-surface-high)',
                borderTop: '2px solid var(--kx-secondary)',
                borderRadius: '0.75rem 0.75rem 0.125rem 0.125rem',
                textDecoration: 'none',
              }}
            >
              <span className="kx-label" style={{ color: 'var(--kx-secondary)' }}>DIGITAL PACK · ₩29,000</span>
              <h3 className="kx-display text-2xl font-bold mt-3 mb-2" style={{ color: 'var(--kx-on-surface)' }}>블로그 자동화 팩</h3>
              <p className="text-sm" style={{ color: 'var(--kx-on-variant)' }}>
                프롬프트 조합법 + 템플릿 PDF + 샘플. 쿠팡파트너스·애드포스트 수익화 루틴 구축.
              </p>
            </Link>
            <Link
              href="/saju"
              className="p-8 transition-all hover:-translate-y-1"
              style={{
                background: 'var(--kx-surface-high)',
                borderTop: '2px solid #40ceed',
                borderRadius: '0.75rem 0.75rem 0.125rem 0.125rem',
                textDecoration: 'none',
              }}
            >
              <span className="kx-label" style={{ color: '#40ceed' }}>FREE TOOL</span>
              <h3 className="kx-display text-2xl font-bold mt-3 mb-2" style={{ color: 'var(--kx-on-surface)' }}>AI 사주 분석</h3>
              <p className="text-sm" style={{ color: 'var(--kx-on-variant)' }}>
                사주팔자 자동 산출 + Gemini 기반 해석. 검증된 계산 엔진 기반 무료 서비스.
              </p>
            </Link>
          </div>

          {/* Final CTA — 음악 팩 단일 전환 */}
          <div
            className="text-center p-10 kx-glass"
            style={{ border: '1px solid rgba(204,151,255,0.12)' }}
          >
            <span className="kx-label">START TODAY</span>
            <h3 className="kx-display text-2xl md:text-3xl font-bold mt-2 mb-3" style={{ color: 'var(--kx-on-surface)' }}>
              오늘 밤, 당신 채널에 첫 AI 뮤비가 올라갈 수 있습니다
            </h3>
            <p className="text-sm mb-6 max-w-xl mx-auto" style={{ color: 'var(--kx-on-variant)' }}>
              입문 팩 ₩39,000으로 시작. 1시간 워크플로우 + 템플릿 + 저작권 가이드 포함.
            </p>
            <Link
              href="/services/music#pricing"
              onClick={() => trackCTAClick('home_v6_final_music')}
              className="kx-btn-primary px-8 py-3.5 rounded-full text-sm inline-flex"
            >
              ₩39,000으로 시작하기
            </Link>
            <div className="mt-5 text-xs" style={{ color: 'var(--kx-on-variant)' }}>
              <button
                onClick={() => {
                  trackCTAClick('home_v6_final_contact');
                  setModalOpen(true);
                }}
                className="underline underline-offset-4 hover:text-white transition"
              >
                맞춤 협업·외주 문의는 여기
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
