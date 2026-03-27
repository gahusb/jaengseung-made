'use client';

import { useState } from 'react';
import Link from 'next/link';
import ContactModal from './components/ContactModal';

/* ──────────────────────────────────────────────
   Spring easing: cubic-bezier(0.16, 1, 0.3, 1)
   모든 인터랙티브 요소에 일관 적용
─────────────────────────────────────────────── */

const TRUST_POINTS = [
  {
    id: 'contract',
    size: 'lg', // 2-col span
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
    label: '계약서 먼저, 개발 나중',
    desc: '구두 약속 없습니다. 계약금 30%, 중도금, 잔금으로 단계별 진행. 납기 지연 시 하루 10만 원 자동 감면.',
    accent: 'blue',
    highlight: '납기 지연 → 하루 10만원 패널티',
  },
  {
    id: 'source',
    size: 'sm',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    label: '소스코드 100% 인도',
    desc: '납품 후 모든 소스코드를 전달합니다. 락인 없음.',
    accent: 'violet',
    highlight: null,
  },
  {
    id: 'as',
    size: 'sm',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    label: '1개월 무상 AS',
    desc: '납품 후 1개월간 버그 수정 무료. 평생 유지보수 계약도 가능.',
    accent: 'emerald',
    highlight: null,
  },
  {
    id: 'reply',
    size: 'sm',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: '24시간 이내 견적',
    desc: '문의 후 평균 3.8시간 이내 답변. 주말·공휴일 포함.',
    accent: 'amber',
    highlight: null,
  },
  {
    id: 'report',
    size: 'sm',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    label: '주 1회 진행 보고',
    desc: '매주 개발 현황을 공유합니다. 중간에 사라지는 일 없음.',
    accent: 'cyan',
    highlight: null,
  },
];

const PROOF_SERVICES = [
  {
    name: '쟁승메이드 (이 사이트)',
    badge: '지금 보시는 중',
    desc: '로그인·결제·AI 사주·관리자까지 1인 풀스택 개발.',
    href: '/freelance',
    color: 'from-blue-500/20 to-blue-600/5',
    dot: 'bg-blue-400',
    tag: '직접 제작 · 포트폴리오',
  },
];

const SUBSCRIPTION_SERVICES = [
  {
    id: 'automation',
    href: '/services/automation',
    color: '#0891b2',
    bg: '#cffafe',
    border: '#a5f3fc',
    label: 'AI · RPA AUTOMATION',
    title: '업무 자동화',
    price: '5만원~',
    type: '프로젝트',
    badge: 'HOT',
    badgeColor: 'bg-cyan-600',
  },
  {
    id: 'prompt',
    href: '/services/prompt',
    color: '#7c3aed',
    bg: '#ede9fe',
    border: '#ddd6fe',
    label: 'PROMPT ENGINEERING',
    title: '프롬프트 엔지니어링',
    price: '9,900원~',
    type: '패키지',
    badge: 'SALE',
    badgeColor: 'bg-red-500',
  },
];

const TECH_STACK = [
  'Python', 'Java', 'Spring Boot', 'Next.js', 'React', 'TypeScript',
  'PostgreSQL', 'Redis', 'Docker', 'AWS', 'Telegram API', 'FastAPI',
  'Node.js', 'Supabase', 'Vercel', 'Git',
];

const STATS = [
  { value: '47+', label: '납품 완료' },
  { value: '7년', label: '개발 경력' },
  { value: '24h', label: '평균 견적 응답' },
  { value: '1개월', label: '무상 AS' },
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-full bg-[#f1f5f9]">
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service="외주 개발 문의"
        checklist={[
          '개발하고 싶은 서비스를 간략히 설명해주세요',
          '희망 납품 일정과 예산 범위',
          '참고할 만한 사이트나 레퍼런스',
          '현재 운영 중인 시스템이 있다면 함께 알려주세요',
        ]}
        accentColor="text-[#5ba4ff]"
        headerFrom="#04102b"
        headerTo="#0a2060"
      />

      {/* ════════════════════════════════
          SECTION 1 — HERO (Split layout)
      ════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#04102b] px-6 py-16 lg:px-12 lg:py-20">
        {/* 배경 그리드 */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(#4f8ef7 1px, transparent 1px), linear-gradient(90deg, #4f8ef7 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* 배경 글로우 */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[100px] translate-y-1/2 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-center">

            {/* ── 좌측: 메인 카피 ── */}
            <div>
              {/* 뱃지 라인 */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <div className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  현재 프로젝트 접수 가능
                </div>
                <div className="inline-flex items-center gap-1.5 bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                  AI 자동화 전문
                </div>
              </div>

              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight mb-6"
                style={{ wordBreak: 'keep-all' }}
              >
                연락 두절 없는<br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #5ba4ff 0%, #818cf8 60%, #a78bfa 100%)',
                  }}
                >
                  현직 대기업 개발자
                </span>
                가<br />
                직접 만들어 드립니다
              </h1>

              <p
                className="text-blue-200/60 text-base md:text-lg leading-relaxed mb-4 max-w-lg"
                style={{ wordBreak: 'keep-all' }}
              >
                계약서, 중간 보고, 소스코드 인도, 1개월 무상 AS까지 — 단계마다 증거를 남기는 개발 방식으로 진행합니다.
              </p>
              <div className="flex items-start gap-2.5 bg-cyan-400/8 border border-cyan-400/15 rounded-xl px-4 py-3 mb-8 max-w-lg">
                <svg className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                <p className="text-cyan-200/70 text-sm leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                  <span className="text-cyan-300 font-bold">AI 자동화 전문 —</span> 반복 업무, 엑셀 처리, 이메일·보고서 자동화를 AI로 없애드립니다. 이 사이트 자체가 제 포트폴리오입니다.
                </p>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-3 mb-10">
                <button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2.5 bg-[#1a56db] hover:bg-[#1e4fc2] active:scale-[0.98] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/40"
                  style={{ transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  무료 상담 신청 (24h 이내 답변)
                </button>
                <Link
                  href="/freelance"
                  className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-blue-200 hover:bg-white/10 px-6 py-3.5 rounded-xl font-semibold text-sm"
                  style={{ transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  포트폴리오 보기 →
                </Link>
              </div>

              {/* Stats */}
              <div
                className="grid grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/8"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {STATS.map((s) => (
                  <div key={s.label} className="bg-[#071540]/60 px-4 py-4 text-center">
                    <div className="text-xl md:text-2xl font-extrabold text-white tracking-tight">{s.value}</div>
                    <div className="text-blue-300/50 text-[11px] mt-0.5 font-medium leading-tight" style={{ wordBreak: 'keep-all' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 우측: 신뢰 카드 ── */}
            <div className="hidden lg:block">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">현재 운영 서비스</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <div className="space-y-3">
                  {PROOF_SERVICES.map((s) => (
                    <Link
                      key={s.name}
                      href={s.href}
                      className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl p-3.5 group"
                      style={{ transition: 'all 0.3s ease-out' }}
                    >
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-sm leading-tight">{s.name}</div>
                        <div className="text-white/30 text-[11px] mt-0.5 truncate">{s.tag}</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full flex-shrink-0">{s.badge}</span>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/8 text-center">
                  <p className="text-white/30 text-xs">직접 방문해서 확인하세요</p>
                  <a href="https://jaengseung-made.com" className="text-blue-400 text-xs font-semibold mt-0.5 block hover:text-blue-300 transition">
                    jaengseung-made.com →
                  </a>
                </div>
              </div>

              {/* 연락처 */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a href="mailto:bgg8988@gmail.com"
                  className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2.5 hover:bg-white/10 transition group">
                  <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <span className="text-white/50 text-[11px] truncate">bgg8988@gmail.com</span>
                </a>
                <a href="tel:01039071392"
                  className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2.5 hover:bg-white/10 transition">
                  <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span className="text-white/50 text-[11px]">010-3907-1392</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          SECTION 2 — 신뢰 증거 Bento Grid
      ════════════════════════════════ */}
      <section className="px-6 py-16 lg:px-12 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-[#1a56db] text-xs font-bold uppercase tracking-widest mb-2">WHY US</p>
            <h2
              className="text-2xl md:text-4xl font-extrabold text-[#04102b] tracking-tight leading-tight"
              style={{ wordBreak: 'keep-all', textWrap: 'balance' } as React.CSSProperties}
            >
              계약서 쓰고, 납기 지키고,<br />끝까지 책임집니다
            </h2>
            <p className="text-slate-500 text-sm mt-3 max-w-lg" style={{ wordBreak: 'keep-all' }}>
              개발자에게 맡겼다가 연락 두절된 경험이 있으신가요?<br />
              쟁승메이드는 단계마다 증거를 남깁니다.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* 계약서 — 가장 큰 카드 (lg에서 2열 차지) */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#04102b] to-[#0a1f5c] rounded-2xl p-7 relative overflow-hidden border border-blue-900/40">
              <div className="absolute right-0 top-0 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-blue-400/15 border border-blue-400/20 flex items-center justify-center text-blue-400 mb-5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                </div>
                <h3 className="text-white text-xl font-extrabold mb-2">계약서 먼저, 개발 나중</h3>
                <p className="text-blue-200/50 text-sm leading-relaxed mb-5" style={{ wordBreak: 'keep-all' }}>
                  계약금 30%, 중도금, 잔금으로 단계별 진행합니다. 구두 약속은 없습니다. 모든 합의는 서면으로 남깁니다.
                </p>
                <div className="inline-flex items-center gap-2.5 bg-red-500/15 border border-red-400/25 rounded-xl px-4 py-2.5">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <span className="text-red-300 text-sm font-bold">납기 지연 시 하루 10만 원 자동 감면</span>
                </div>
              </div>
            </div>

            {/* 소스코드 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:shadow-violet-100 hover:-translate-y-0.5"
              style={{ transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              </div>
              <h3 className="font-extrabold text-[#04102b] text-base mb-2">소스코드 100% 인도</h3>
              <p className="text-slate-500 text-sm leading-relaxed" style={{ wordBreak: 'keep-all' }}>납품 후 모든 소스코드를 전달합니다. 특정 플랫폼에 종속되지 않습니다.</p>
              <div className="mt-4 inline-block text-xs font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-1 rounded-lg">락인 없음</div>
            </div>

            {/* 1개월 AS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:shadow-emerald-100 hover:-translate-y-0.5"
              style={{ transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="font-extrabold text-[#04102b] text-base mb-2">1개월 무상 AS</h3>
              <p className="text-slate-500 text-sm leading-relaxed" style={{ wordBreak: 'keep-all' }}>납품 후 1개월 동안 버그 수정 무료. 이후 평생 유지보수 계약 가능.</p>
              <div className="mt-4 inline-block text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">부담 없는 사후 지원</div>
            </div>

            {/* 주 1회 보고 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:shadow-cyan-100 hover:-translate-y-0.5"
              style={{ transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="font-extrabold text-[#04102b] text-base mb-2">주 1회 진행 보고</h3>
              <p className="text-slate-500 text-sm leading-relaxed" style={{ wordBreak: 'keep-all' }}>매주 개발 현황을 공유합니다. 진행 중에 사라지는 일 없음을 보장합니다.</p>
              <div className="mt-4 inline-block text-xs font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-2 py-1 rounded-lg">투명한 진행</div>
            </div>

          </div>

          {/* 외주 CTA */}
          <div className="mt-6">
            <Link
              href="/freelance"
              className="group flex items-center justify-between bg-white border-2 border-[#1a56db]/20 hover:border-[#1a56db]/50 hover:bg-[#f0f5ff] rounded-2xl px-7 py-5"
              style={{ transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              <div>
                <div className="font-extrabold text-[#04102b] text-base">외주 개발 포트폴리오 · 프로세스 전체 보기</div>
                <div className="text-slate-500 text-sm mt-0.5">납품 사례 47건 · 진행 프로세스 6단계 상세 안내</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#1a56db] flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110"
                style={{ transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          SECTION 3 — "직접 만든 서비스가 증거"
      ════════════════════════════════ */}
      <section className="relative bg-[#04102b] px-6 py-16 lg:px-12 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #4f8ef7 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="absolute right-0 top-1/2 w-96 h-96 rounded-full bg-blue-500/8 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-blue-400/70 text-xs font-bold uppercase tracking-widest mb-2">PROOF OF WORK</p>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight" style={{ wordBreak: 'keep-all' }}>
              URL로 직접 확인하세요
            </h2>
            <p className="text-blue-200/40 text-sm mt-3 max-w-lg mx-auto" style={{ wordBreak: 'keep-all' }}>
              말로만 잘 한다는 게 아닙니다. 지금 이 사이트가 제 실력입니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {PROOF_SERVICES.map((s) => (
              <Link
                key={s.name}
                href={s.href}
                className={`relative bg-gradient-to-br ${s.color} border border-white/10 rounded-2xl p-6 hover:border-white/25 group`}
                style={{ transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${s.dot} animate-pulse`} />
                  <span className="text-white/40 text-xs font-bold uppercase tracking-wider">{s.badge}</span>
                </div>
                <h3 className="text-white font-extrabold text-lg mb-2" style={{ wordBreak: 'keep-all' }}>{s.name}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-4" style={{ wordBreak: 'keep-all' }}>{s.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-xs">{s.tag}</span>
                  <span className="text-white/50 group-hover:text-white text-sm font-semibold" style={{ transition: 'color 0.3s ease' }}>보러가기 →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          SECTION 4 — 구독/설치형 서비스 (보조)
      ════════════════════════════════ */}
      <section className="px-6 py-16 lg:px-12 lg:py-20">
        <div className="max-w-5xl mx-auto">
          {/* 레이블 분리 */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">직접 만들어 운영 중인 구독 · 설치형 서비스</p>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            </div>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-center text-slate-500 text-sm mb-8" style={{ wordBreak: 'keep-all' }}>
            외주 개발 의뢰가 아닌, 제가 직접 만들고 운영 중인 서비스들입니다.<br />
            "이런 걸 만들어드릴 수 있습니다"의 증거로 공유합니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SUBSCRIPTION_SERVICES.map((svc) => (
              <Link
                key={svc.id}
                href={svc.href}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:-translate-y-0.5 relative group"
                style={{ transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                {svc.badge && (
                  <span className={`absolute top-3 right-3 ${svc.badgeColor} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md`}>{svc.badge}</span>
                )}
                <div className="text-[10px] font-bold mb-1.5 tracking-wider" style={{ color: svc.color }}>{svc.label}</div>
                <div className="font-extrabold text-[#04102b] text-sm mb-3" style={{ wordBreak: 'keep-all' }}>{svc.title}</div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm" style={{ color: svc.color }}>{svc.price}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-md font-medium" style={{ color: svc.color, backgroundColor: svc.bg, border: `1px solid ${svc.border}` }}>{svc.type}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 text-[#1a56db] text-xs font-semibold group-hover:gap-1.5 flex items-center gap-1" style={{ transition: 'gap 0.3s ease' }}>
                  자세히 보기 <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          SECTION 4.5 — 무료 체험 후기 수집 배너
      ════════════════════════════════ */}
      <section className="px-6 py-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-500/20 rounded-2xl px-7 py-5 overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-full opacity-10 pointer-events-none">
              <div className="w-full h-full bg-gradient-to-l from-cyan-400 to-transparent" />
            </div>
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-400/15 border border-cyan-400/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4.5 h-4.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-extrabold bg-red-500 text-white px-2 py-0.5 rounded-md">한정 3팀</span>
                    <span className="text-cyan-300 text-xs font-bold uppercase tracking-wider">무료 체험 · 후기 수집 중</span>
                  </div>
                  <p className="text-white font-extrabold text-base leading-snug" style={{ wordBreak: 'keep-all' }}>
                    AI 자동화 세팅을 무료로 받고 솔직한 후기를 남겨주세요
                  </p>
                  <p className="text-cyan-200/50 text-xs mt-1" style={{ wordBreak: 'keep-all' }}>
                    ChatGPT 프롬프트 세팅 또는 반복 업무 1건 자동화 — 후기 작성이 조건입니다. 현재 <span className="text-cyan-300 font-bold">2팀 남음</span>
                  </p>
                </div>
              </div>
              <a
                href="https://open.kakao.com/o/s9stoNvb"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-cyan-950 font-extrabold text-sm px-5 py-2.5 rounded-xl"
                style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                카카오로 신청 →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          SECTION 5 — 기술 스택 마퀴
      ════════════════════════════════ */}
      <section className="py-10 overflow-hidden border-y border-slate-200 bg-white">
        <div className="flex gap-6 animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...TECH_STACK, ...TECH_STACK].map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="inline-flex items-center gap-2 text-slate-400 text-sm font-semibold"
            >
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              {tech}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
        `}</style>
      </section>

      {/* ════════════════════════════════
          SECTION 5.5 — 콘텐츠 / 인사이트
      ════════════════════════════════ */}
      <section className="px-6 py-12 lg:px-12 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[#1a56db] text-xs font-bold uppercase tracking-widest mb-1">INSIGHTS</p>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#04102b]">AI 자동화 실전 팁</h2>
            </div>
            <a
              href="https://blog.naver.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-400 hover:text-[#1a56db] transition flex items-center gap-1"
            >
              블로그 전체 보기 →
            </a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { tag: '업무 자동화', title: '업무 자동화 외주 맡기기 전에 반드시 확인할 5가지', desc: '계약서, 소스코드 인도, 납기 명시. 피해의 90%는 이 세 가지 없어서 생깁니다.', color: 'bg-cyan-50 border-cyan-100', tagColor: 'text-cyan-600 bg-cyan-100' },
              { tag: 'ChatGPT 활용', title: 'ChatGPT 프롬프트 잘 쓰는 법 — RCTF 공식', desc: 'Role·Context·Task·Format 네 가지를 넣으면 답변 퀄리티가 3배 올라갑니다.', color: 'bg-violet-50 border-violet-100', tagColor: 'text-violet-600 bg-violet-100' },
              { tag: '개발자 부업', title: '대기업 현직 개발자가 부업 6개월 해본 솔직한 후기', desc: '잘 된 점, 힘든 점, 현실적인 수익까지. 포장 없이 공유합니다.', color: 'bg-blue-50 border-blue-100', tagColor: 'text-blue-600 bg-blue-100' },
            ].map((post) => (
              <div key={post.title} className={`rounded-2xl border p-5 ${post.color} hover:-translate-y-0.5 transition-transform`}>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${post.tagColor}`}>{post.tag}</span>
                <h3 className="font-extrabold text-[#04102b] text-sm mt-3 mb-2 leading-snug" style={{ wordBreak: 'keep-all' }}>{post.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed" style={{ wordBreak: 'keep-all' }}>{post.desc}</p>
                <div className="mt-3 text-xs font-semibold text-[#1a56db] flex items-center gap-1">
                  네이버 블로그에서 읽기 →
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-400 text-xs mt-4">
            블로그 준비 중 — 곧 업로드됩니다
          </p>
        </div>
      </section>

      {/* ════════════════════════════════
          SECTION 6 — 최종 CTA
      ════════════════════════════════ */}
      <section className="px-6 py-16 lg:px-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#04102b] to-[#0a1f5c] rounded-3xl border border-blue-900/40 px-8 py-12 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: 'linear-gradient(#4f8ef7 1px, transparent 1px), linear-gradient(90deg, #4f8ef7 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                현재 접수 가능
              </div>
              <h2
                className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight leading-tight"
                style={{ wordBreak: 'keep-all', textWrap: 'balance' } as React.CSSProperties}
              >
                어떤 업무든 먼저 상담해 보세요
              </h2>
              <p className="text-blue-200/40 text-sm mb-8 leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                자동화할 업무, 만들고 싶은 서비스, 고민 중인 아이디어 — 뭐든 괜찮습니다.<br />
                구체적인 견적은 무료 상담 후 24시간 이내에 드립니다.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2.5 bg-[#1a56db] hover:bg-[#1e4fc2] active:scale-[0.98] text-white px-8 py-4 rounded-xl font-bold text-base shadow-xl shadow-blue-900/40"
                  style={{ transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  무료 상담 신청 (계약서 포함) →
                </button>
                <div className="flex items-center gap-4 text-blue-200/30 text-xs">
                  <span>bgg8988@gmail.com</span>
                  <span>·</span>
                  <span>010-3907-1392</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
