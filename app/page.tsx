'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ContactModal from './components/ContactModal';
import { trackCTAClick } from '../lib/gtag';

/* ═══════════════════════════════════════════════════
   쟁승메이드 홈페이지 — v3 (수익 구조 개편)
   설계 원칙:
   1. AI 상품 → 무료 도구 → 외주 순서로 노출
   2. 매출 전환 동선 최우선
   3. 증거 기반 신뢰 확보
═══════════════════════════════════════════════════ */

/* ── AI 상품 (매출 핵심) ─────────────────────────── */
const AI_PRODUCTS = [
  {
    href: '/services/prompt',
    tag: 'BEST',
    tagColor: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    title: '프롬프트 패키지',
    desc: 'ChatGPT·Claude 업무 최적화 프롬프트. 자소서, 마케팅, 이메일, 보고서 등 즉시 다운로드.',
    price: '9,900원~',
    action: '스토어 보기',
  },
  {
    href: '/services/automation',
    tag: 'HOT',
    tagColor: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    title: '업무 자동화 개발',
    desc: '엑셀 처리, 이메일·보고서 자동화, 데이터 수집 스크립트. 반복 업무를 없앱니다.',
    price: '5만원~',
    action: '자세히 보기',
  },
  {
    href: '/services/ai-kit',
    tag: '구독',
    tagColor: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
    title: 'AI 자동화 키트',
    desc: '업무일지·이메일·SNS 자동화 도구 6종. 설치 없이 월 구독으로 바로 사용.',
    price: '19,900원/월',
    action: '구독 시작',
  },
];

/* ── 무료 도구 (트래픽 엔진) ─────────────────────── */
const FREE_TOOLS = [
  {
    href: '/saju',
    icon: (
      <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    title: 'AI 사주 분석',
    desc: '생년월일 입력하면 AI가 성격·직업·관계·운세를 즉시 분석',
    badge: '무료',
  },
  {
    href: '/services/lotto',
    icon: (
      <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: '로또 번호 추천',
    desc: '빅데이터·통계 기반 AI 번호 분석. 매주 업데이트.',
    badge: '무료',
  },
  {
    href: '/tools',
    icon: (
      <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    title: '도구 쇼케이스',
    desc: '네이버 블로그 자동화, eBay 리스팅 등 AI 도구 데모',
    badge: 'DEMO',
  },
];

/* ── 운영 중 서비스 (신뢰 지표) ──────────────────── */
const LIVE_SERVICES = [
  { name: '쟁승메이드', label: '이 사이트' },
  { name: 'AI 사주 분석', label: '유료 서비스' },
  { name: 'AI 자동화 키트', label: '월 구독' },
  { name: '로또 번호 추천', label: '무료 서비스' },
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
        service="외주 개발 문의"
        checklist={[
          '개발하고 싶은 서비스를 간략히 설명해주세요',
          '희망 납품 일정과 예산 범위',
          '참고할 만한 사이트나 레퍼런스',
        ]}
        accentColor="text-[#5ba4ff]"
        headerFrom="#04102b"
        headerTo="#0a2060"
      />

      {/* ══════════════════════════════════════
          HERO — AI 상품 중심
      ══════════════════════════════════════ */}
      <section
        className="relative overflow-hidden px-6 py-20 lg:px-14 lg:py-28"
        style={{ background: '#04102b' }}
      >
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #4f8ef7 0, #4f8ef7 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs text-[#5ba4ff]/60 tracking-[0.2em] uppercase">
              쟁승메이드 · AI 프롬프트 · 자동화
            </span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              서비스 운영 중
            </span>
          </div>

          <h1
            className="text-[2.6rem] md:text-[3.5rem] lg:text-[4.5rem] font-extrabold leading-[1.12] tracking-tight text-white mb-6"
            style={{ wordBreak: 'keep-all' }}
          >
            AI로 일하는 방식을
            <br />
            <span className="text-[#5ba4ff]">바꿔보세요.</span>
          </h1>

          <p
            className="text-[#8ba5cc] text-lg md:text-xl leading-relaxed mb-3 max-w-2xl"
            style={{ wordBreak: 'keep-all' }}
          >
            프롬프트 패키지부터 업무 자동화, AI 사주 분석까지.
            <br />
            7년차 현직 개발자가 직접 만들고 운영합니다.
          </p>
          <p
            className="text-white/50 text-base leading-relaxed mb-10 max-w-2xl"
            style={{ wordBreak: 'keep-all' }}
          >
            9,900원부터 시작하는 AI 도구 — 지금 바로 구매하고 사용하세요.
          </p>

          <div className="flex flex-wrap gap-3 mb-14">
            <Link
              href="/services/prompt"
              className="inline-flex items-center gap-2 bg-[#1a56db] hover:bg-[#1e4fc2] text-white px-8 py-4 rounded-xl font-bold text-sm transition-colors"
            >
              AI 상품 둘러보기
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/saju"
              className="inline-flex items-center gap-2 border border-white/15 hover:border-white/30 text-white/60 hover:text-white px-8 py-4 rounded-xl font-semibold text-sm transition-all"
            >
              무료 사주 분석 체험
            </Link>
          </div>

          {/* Live services indicator */}
          <div className="border-t border-white/8 pt-8">
            <p className="font-mono text-[11px] text-[#5ba4ff]/40 tracking-[0.25em] uppercase mb-4">
              지금 운영 중인 서비스
            </p>
            <div className="flex flex-wrap gap-6">
              {LIVE_SERVICES.map((s) => (
                <span
                  key={s.name}
                  className="flex items-center gap-2.5 text-sm text-[#8ba5cc]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <span className="font-semibold">{s.name}</span>
                  <span className="font-mono text-[11px] text-white/25">{s.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — AI 상품 (매출 핵심)
      ══════════════════════════════════════ */}
      <section className="bg-white px-6 py-16 lg:px-14 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="reveal mb-10">
            <p className="font-mono text-xs text-[#1a56db]/60 tracking-widest uppercase mb-2">
              AI Products
            </p>
            <h2
              className="text-2xl md:text-3xl font-extrabold text-[#04102b] leading-tight"
              style={{ wordBreak: 'keep-all' }}
            >
              지금 바로 구매할 수 있는 AI 상품
            </h2>
            <p className="text-[#64748b] text-sm mt-2" style={{ wordBreak: 'keep-all' }}>
              결제 즉시 사용 가능. 복잡한 상담 없이 바로 시작하세요.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {AI_PRODUCTS.map((p, i) => (
              <Link
                key={p.href}
                href={p.href}
                className={`reveal reveal-d${i + 1} group relative flex flex-col border border-[#e2e8f0] hover:border-[#1a56db]/30 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-blue-500/5 bg-white`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.tagColor}`}>
                    {p.tag}
                  </span>
                  <span className="text-[#0f172a] font-extrabold text-sm">{p.price}</span>
                </div>
                <h3 className="text-lg font-extrabold text-[#0f172a] mb-2 group-hover:text-[#1a56db] transition-colors">
                  {p.title}
                </h3>
                <p className="text-[#64748b] text-sm leading-relaxed flex-1 mb-5" style={{ wordBreak: 'keep-all' }}>
                  {p.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[#1a56db] text-sm font-bold group-hover:underline underline-offset-4">
                    {p.action} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — 무료 도구 (트래픽 엔진)
      ══════════════════════════════════════ */}
      <section className="bg-[#f8faff] px-6 py-16 lg:px-14 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="reveal mb-10">
            <p className="font-mono text-xs text-[#1a56db]/60 tracking-widest uppercase mb-2">
              Free Tools
            </p>
            <h2
              className="text-2xl md:text-3xl font-extrabold text-[#04102b] leading-tight"
              style={{ wordBreak: 'keep-all' }}
            >
              무료로 체험해보세요
            </h2>
            <p className="text-[#64748b] text-sm mt-2">
              회원가입 없이 바로 사용할 수 있습니다.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {FREE_TOOLS.map((t, i) => (
              <Link
                key={t.href}
                href={t.href}
                className={`reveal reveal-d${i + 1} group flex items-start gap-4 bg-white border border-[#e2e8f0] hover:border-[#1a56db]/30 rounded-2xl p-5 transition-all hover:shadow-md`}
              >
                <span className="flex-shrink-0 mt-0.5">{t.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#0f172a] text-sm group-hover:text-[#1a56db] transition-colors">
                      {t.title}
                    </h3>
                    <span className="text-[10px] font-bold text-sky-500 bg-sky-500/10 px-1.5 py-0.5 rounded">
                      {t.badge}
                    </span>
                  </div>
                  <p className="text-[#64748b] text-xs leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                    {t.desc}
                  </p>
                </div>
                <svg className="w-4 h-4 text-[#cbd5e1] group-hover:text-[#1a56db] flex-shrink-0 mt-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 4 — 누가 만드나요 (About)
      ══════════════════════════════════════ */}
      <section className="bg-[#04102b] px-6 py-16 lg:px-14 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <p className="reveal font-mono text-xs text-[#5ba4ff]/40 tracking-widest uppercase mb-3">
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
                <span className="text-[#5ba4ff]">이제 당신의 업무를 자동화합니다.</span>
              </h2>
              <div className="space-y-4 text-[#8ba5cc] text-base leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                <p>
                  대기업 IT팀에서 백엔드 개발 7년 — 실제 운영되는 서비스의 API 설계, DB 구조, 배포 파이프라인을 직접 다뤘습니다.
                </p>
                <p>
                  지금은 그 경험으로 <span className="text-white">AI 프롬프트 패키지, 업무 자동화, 구독형 AI 도구</span>를 직접 만들어 판매합니다.
                </p>
              </div>

              <div className="mt-8">
                <p className="font-mono text-[11px] text-[#5ba4ff]/40 tracking-widest uppercase mb-3">
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Next.js', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Supabase', 'Docker', 'AWS'].map((t) => (
                    <span
                      key={t}
                      className="font-mono text-xs text-[#5ba4ff]/70 border border-[#5ba4ff]/15 px-2.5 py-1 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { value: '7년', label: '대기업 백엔드 개발 경력', sub: '실제 운영 서비스 다수 개발', color: 'border-blue-500/30' },
                { value: '4개', label: '현재 직접 운영 중인 서비스', sub: '이 사이트 포함 — 지금 이 순간도 작동 중', color: 'border-emerald-500/30' },
                { value: '100%', label: '외주 시 소스코드 이관', sub: '납품 후 전체 코드 전달, 락인 없음', color: 'border-violet-500/30' },
                { value: '24h', label: '이내 견적 답변', sub: '주말·공휴일 포함', color: 'border-amber-500/30' },
              ].map((item) => (
                <div key={item.value} className={`border-l-2 ${item.color} pl-5 py-2`}>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-white tracking-tight">{item.value}</span>
                    <span className="text-[#8ba5cc] text-sm font-medium">{item.label}</span>
                  </div>
                  <p className="text-white/30 text-xs mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 5 — 외주 개발 (축소)
      ══════════════════════════════════════ */}
      <section className="bg-white px-6 py-16 lg:px-14 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="reveal flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <p className="font-mono text-xs text-[#1a56db]/60 tracking-widest uppercase mb-2">
                Custom Development
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]" style={{ wordBreak: 'keep-all' }}>
                맞춤 개발이 필요하신가요?
              </h2>
              <p className="text-[#64748b] text-sm mt-2" style={{ wordBreak: 'keep-all' }}>
                홈페이지 제작, 업무 시스템, API 개발 등 — 계약서 기반으로 안전하게 진행합니다.
              </p>
            </div>
          </div>

          <div className="reveal grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>, title: '계약서 먼저', desc: '범위·금액·납기를 문서로 확정' },
              { icon: <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>, title: '주 1회 보고', desc: '중간에 사라지는 일 없음' },
              { icon: <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>, title: '소스코드 100%', desc: '전체 코드 이관, 락인 없음' },
              { icon: <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>, title: '24시간 답변', desc: '주말·공휴일 포함 견적 회신' },
            ].map((item) => (
              <div key={item.title} className="border border-[#e2e8f0] rounded-xl p-4 text-center">
                <span className="mb-2 block flex justify-center">{item.icon}</span>
                <p className="font-bold text-[#0f172a] text-sm mb-1">{item.title}</p>
                <p className="text-[#94a3b8] text-xs" style={{ wordBreak: 'keep-all' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="reveal flex flex-wrap gap-3">
            <Link
              href="/freelance"
              className="inline-flex items-center gap-2 bg-[#04102b] hover:bg-[#0a1a3f] text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors"
            >
              포트폴리오 · 문의하기
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/services/website"
              className="inline-flex items-center gap-2 border border-[#e2e8f0] hover:border-[#1a56db]/30 text-[#475569] hover:text-[#1a56db] px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            >
              홈페이지 제작 상세 보기
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 6 — 최종 CTA
      ══════════════════════════════════════ */}
      <section className="bg-[#04102b] px-6 py-20 lg:px-14">
        <div className="max-w-5xl mx-auto">
          <div className="reveal text-center">
            <p className="font-mono text-xs text-[#5ba4ff]/40 tracking-widest uppercase mb-4">Get Started</p>
            <h2
              className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight"
              style={{ wordBreak: 'keep-all' }}
            >
              AI 도구로 업무를
              <br />
              더 빠르게 처리하세요.
            </h2>
            <p className="text-[#8ba5cc] text-lg mb-10" style={{ wordBreak: 'keep-all' }}>
              9,900원부터 시작. 맞춤 개발 상담은 무료입니다.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/services/prompt"
                className="inline-flex items-center gap-2 bg-[#1a56db] hover:bg-[#1e4fc2] text-white px-10 py-4 rounded-xl font-extrabold text-base transition-colors"
              >
                AI 상품 보기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <button
                onClick={() => { trackCTAClick('무료 상담 신청', '/'); setModalOpen(true); }}
                className="inline-flex items-center gap-2 border border-white/15 hover:border-white/30 text-white/70 hover:text-white px-10 py-4 rounded-xl font-extrabold text-base transition-all"
              >
                맞춤 개발 상담
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
