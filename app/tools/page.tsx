'use client';

import Link from 'next/link';

interface ToolCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  href: string;
  status: 'live' | 'beta' | 'coming';
  icon: React.ReactNode;
  gradient: string;
}

const TOOLS: ToolCard[] = [
  {
    id: 'ebay-parts',
    title: '이베이 부품 AI 리스팅',
    subtitle: 'eBay Auto Parts Listing Tool',
    description:
      '품번 하나 입력하면 AI가 RockAuto·eBay를 크롤링하고, 리스팅 제목·Fitment·관세까지 자동 생성합니다. 수작업 30분 → 10초.',
    tags: ['크롤링', 'Claude AI', '관세 계산', 'eBay Motors'],
    href: '/tools/ebay-parts',
    status: 'live',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11h4m-2-2v4" />
      </svg>
    ),
    gradient: 'from-blue-600 to-cyan-500',
  },
  {
    id: 'naver-blog',
    title: '네이버 블로그 자동화',
    subtitle: 'Naver Blog AI Writer',
    description:
      '주제·톤·분량만 선택하면 AI가 SEO 최적화된 블로그 글을 자동 작성합니다. 소제목 구조, 이미지 배치 가이드까지 한 번에.',
    tags: ['GPT/Claude', 'SEO 최적화', '자동 포스팅', '이미지 가이드'],
    href: '/tools/naver-blog',
    status: 'live',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    gradient: 'from-emerald-600 to-teal-500',
  },
];

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  live: { label: '체험 가능', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  beta: { label: 'BETA', className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  coming: { label: '준비 중', className: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
};

export default function ToolsShowcasePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-6 pt-12 pb-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          실제로 작동하는 완성형 데모
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
          여긴 뭐 만들어요?
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          &ldquo;이런 것도 자동화돼요?&rdquo; — 직접 체험해보세요.<br className="hidden md:block" />
          아래 툴들은 <span className="text-white font-medium">실제 고객 프로젝트를 기반으로 제작</span>된 완성형 레퍼런스입니다.
        </p>
      </section>

      {/* Tool Cards */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOOLS.map((tool) => {
            const badge = STATUS_BADGE[tool.status];
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group block bg-slate-900/80 rounded-2xl border border-slate-700/50 hover:border-slate-600/80 transition-all duration-200 overflow-hidden"
              >
                {/* Gradient header */}
                <div className={`h-2 bg-gradient-to-r ${tool.gradient}`} />

                <div className="p-6">
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white`}>
                      {tool.icon}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-bold text-lg mb-0.5 group-hover:text-blue-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-slate-500 text-xs font-mono mb-3">{tool.subtitle}</p>

                  {/* Description */}
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {tool.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[11px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:gap-3 transition-all">
                    체험하기
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-slate-900/60 rounded-2xl border border-slate-700/40 p-8">
          <h3 className="text-white font-bold text-lg mb-2">우리 업무에도 이런 자동화가 가능할까?</h3>
          <p className="text-slate-400 text-sm mb-5">
            위 데모를 참고해 원하시는 자동화를 구체적으로 의뢰하세요. 무료 상담부터 시작합니다.
          </p>
          <Link
            href="/freelance#contact-form"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            무료 상담 신청하기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
