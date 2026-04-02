'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

/* ═══════════════════════════════════════════════════
   도구 쇼케이스 — 리디자인 v2
   설계 원칙:
   1. 홈 페이지 에디토리얼 톤 계승 — 증거 중심, 텍스트 우선
   2. Supanova: 비대칭 레이아웃, 스크롤 애니메이션, 프리미엄 카드
   3. 사이트 디자인 시스템 완전 통일 (라이트 bg + 다크 카드)
   4. 실제 수치와 체험 유도 — 전환율 중심 구조
═══════════════════════════════════════════════════ */

interface ToolCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  href: string;
  status: 'live' | 'beta' | 'coming';
  gradient: string;
  iconPath: string;
  metric: { value: string; label: string };
  highlight: string;
}

const TOOLS: ToolCard[] = [
  {
    id: 'ebay-parts',
    title: '이베이 부품 AI 리스팅',
    subtitle: 'eBay Auto Parts Listing Tool',
    description:
      '품번 하나 입력하면 AI가 RockAuto·eBay를 크롤링하고, 리스팅 제목·Fitment·관세까지 자동 생성합니다.',
    tags: ['크롤링', 'Claude AI', '관세 계산', 'eBay Motors'],
    href: '/tools/ebay-parts',
    status: 'live',
    gradient: 'from-blue-600 to-cyan-500',
    iconPath: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    metric: { value: '10초', label: '30분 작업 → 10초로 단축' },
    highlight: '수작업 대비 180배 빠름',
  },
  {
    id: 'naver-blog',
    title: '네이버 블로그 자동화',
    subtitle: 'Naver Blog AI Writer',
    description:
      '주제·톤·분량만 선택하면 AI가 SEO 최적화된 블로그 글을 자동 작성합니다. 소제목 구조, 이미지 배치 가이드까지.',
    tags: ['GPT/Claude', 'SEO 최적화', '자동 포스팅', '이미지 가이드'],
    href: '/tools/naver-blog',
    status: 'live',
    gradient: 'from-emerald-600 to-teal-500',
    iconPath: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    metric: { value: '3분', label: '1시간 글쓰기 → 3분 자동 완성' },
    highlight: 'SEO 최적화 자동 포함',
  },
];

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  live: { label: '체험 가능', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  beta: { label: 'BETA', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  coming: { label: '준비 중', className: 'bg-slate-100 text-slate-500 border-slate-200' },
};

const PROCESS_STEPS = [
  { step: '01', title: '문제 정의', desc: '고객의 반복 업무를 분석합니다' },
  { step: '02', title: '자동화 설계', desc: 'AI + 크롤링 + API 조합을 설계합니다' },
  { step: '03', title: '프로토타입', desc: '실제 데이터로 동작하는 MVP를 만듭니다' },
  { step: '04', title: '체험 배포', desc: '이 페이지에 데모를 올려 직접 테스트합니다' },
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
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    const children = el.querySelectorAll('.reveal');
    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, []);

  return ref;
}

export default function ToolsShowcasePage() {
  const containerRef = useScrollReveal();

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* ── Scroll-reveal animation styles ── */}
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(1.5rem);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-delay-1 { transition-delay: 80ms; }
        .reveal-delay-2 { transition-delay: 160ms; }
        .reveal-delay-3 { transition-delay: 240ms; }
        .reveal-delay-4 { transition-delay: 320ms; }

        .tool-card {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tool-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 48px -12px rgba(26, 86, 219, 0.12),
                      0 8px 16px -4px rgba(0, 0, 0, 0.06);
        }

        .metric-pulse {
          animation: pulse-ring 2.5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(26, 86, 219, 0.15); }
          50% { box-shadow: 0 0 0 12px rgba(26, 86, 219, 0); }
        }

        .arrow-shift {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .group:hover .arrow-shift {
          transform: translateX(4px);
        }
      `}</style>

      {/* ═══════════════════════════════════════════
           HERO — 좌측 텍스트 / 우측 수치 비대칭 레이아웃
      ═══════════════════════════════════════════ */}
      <section className="px-6 pt-10 pb-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          {/* 좌측: 텍스트 블록 */}
          <div className="lg:col-span-3 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              실제로 작동하는 완성형 데모
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4" style={{ wordBreak: 'keep-all' as const }}>
              여긴 뭐 만들어요?
            </h1>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-lg" style={{ wordBreak: 'keep-all' as const }}>
              &ldquo;이런 것도 자동화돼요?&rdquo; — 직접 체험해보세요.
              아래 도구들은 <span className="text-slate-800 font-semibold">실제 고객 프로젝트를 기반으로 제작</span>된 완성형 레퍼런스입니다.
            </p>
          </div>

          {/* 우측: 수치 카드 */}
          <div className="lg:col-span-2 reveal reveal-delay-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3">
                  <div className="text-2xl font-bold text-blue-600">{TOOLS.filter(t => t.status === 'live').length}개</div>
                  <div className="text-slate-400 text-xs mt-1">라이브 도구</div>
                </div>
                <div className="text-center p-3">
                  <div className="text-2xl font-bold text-emerald-600">180x</div>
                  <div className="text-slate-400 text-xs mt-1">최대 속도 향상</div>
                </div>
                <div className="text-center p-3">
                  <div className="text-2xl font-bold text-violet-600">무료</div>
                  <div className="text-slate-400 text-xs mt-1">데모 체험</div>
                </div>
                <div className="text-center p-3">
                  <div className="text-2xl font-bold text-cyan-600">즉시</div>
                  <div className="text-slate-400 text-xs mt-1">결과 확인</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           TOOL CARDS — 피처드 카드 (풀와이드) 패턴
      ═══════════════════════════════════════════ */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="flex flex-col gap-6">
          {TOOLS.map((tool, idx) => {
            const badge = STATUS_BADGE[tool.status];
            const isEven = idx % 2 === 1;

            return (
              <Link
                key={tool.id}
                href={tool.href}
                className={`group block tool-card bg-white rounded-2xl border border-slate-200 overflow-hidden active:scale-[0.99] reveal reveal-delay-${idx + 1}`}
              >
                <div className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                  {/* 좌측 (또는 우측): 메트릭 비주얼 */}
                  <div className={`relative flex-shrink-0 md:w-64 lg:w-72 p-4 md:p-8 flex items-center md:flex-col md:justify-center bg-gradient-to-br ${tool.gradient} text-white`}>
                    {/* 배경 패턴 (모바일 숨김) */}
                    <div className="absolute inset-0 opacity-10 hidden md:block">
                      <div className="absolute top-4 right-4 w-32 h-32 border border-white/30 rounded-full" />
                      <div className="absolute bottom-4 left-4 w-20 h-20 border border-white/20 rounded-full" />
                    </div>

                    {/* 모바일: 수평 compact / 데스크톱: 수직 */}
                    <div className="relative z-10 flex items-center gap-4 md:flex-col md:text-center">
                      <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                        <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tool.iconPath} />
                        </svg>
                      </div>

                      <div className="flex items-center gap-3 md:flex-col">
                        <div className="metric-pulse inline-flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-full bg-white/15 border border-white/20">
                          <span className="text-lg md:text-2xl font-bold">{tool.metric.value}</span>
                        </div>
                        <p className="text-white/80 text-xs leading-relaxed">{tool.metric.label}</p>
                      </div>
                    </div>
                  </div>

                  {/* 우측 (또는 좌측): 콘텐츠 */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      {/* 상단: 배지 + 하이라이트 */}
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.className}`}>
                          {badge.label}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-600 border border-blue-100">
                          {tool.highlight}
                        </span>
                      </div>

                      {/* 제목 */}
                      <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors duration-300">
                        {tool.title}
                      </h3>
                      <p className="text-slate-400 text-xs font-mono mb-3 tracking-wide">{tool.subtitle}</p>

                      {/* 설명 */}
                      <p className="text-slate-500 text-sm leading-relaxed mb-5" style={{ wordBreak: 'keep-all' as const }}>
                        {tool.description}
                      </p>

                      {/* 태그 */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {tool.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 text-[11px] font-medium border border-slate-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
                      직접 체험하기
                      <svg className="w-4 h-4 arrow-shift" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           PROCESS — 어떻게 만들어지나? (수직 타임라인)
      ═══════════════════════════════════════════ */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="reveal mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">도구는 이렇게 만들어집니다</h2>
          <p className="text-slate-400 text-sm">고객의 반복 업무가 자동화 도구로 바뀌는 4단계</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-6">
          {PROCESS_STEPS.map((item, idx) => (
            <div key={item.step} className={`reveal reveal-delay-${idx + 1} relative`}>
              {/* 스텝 카드 */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 h-full hover:border-blue-200 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center border border-blue-100">
                    {item.step}
                  </span>
                  {idx < PROCESS_STEPS.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <h4 className="text-slate-900 font-bold text-sm mb-1">{item.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           BOTTOM CTA — 풀블리드 전환 섹션
      ═══════════════════════════════════════════ */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="reveal relative overflow-hidden rounded-2xl bg-slate-900 p-8 md:p-12">
          {/* 배경 데코 */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-bold text-xl md:text-2xl mb-2" style={{ wordBreak: 'keep-all' as const }}>
                우리 업무에도 이런 자동화가 가능할까?
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-lg" style={{ wordBreak: 'keep-all' as const }}>
                위 데모를 참고해 원하시는 자동화를 구체적으로 의뢰하세요. 반복하는 업무가 있다면, 도구로 만들 수 있습니다.
              </p>
            </div>
            <Link
              href="/freelance#contact-form"
              className="group inline-flex items-center gap-3 px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-bold transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 flex-shrink-0"
            >
              무료 상담 신청하기
              <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 arrow-shift" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </div>

          {/* 하단 신뢰 요소 */}
          <div className="relative z-10 mt-8 pt-6 border-t border-slate-700/50 flex flex-wrap gap-x-8 gap-y-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              상담 무료
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              계약서 선행
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              소스코드 전체 이관
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
