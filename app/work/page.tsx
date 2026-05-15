'use client';

import { useState } from 'react';
import Link from 'next/link';
import ContactModal from '@/app/components/ContactModal';
import { PORTFOLIO } from '@/lib/freelance-portfolio';
import { trackCTAClick } from '@/lib/gtag';

const CARDS = [
  {
    href: '/work/freelance',
    label: '외주 개발',
    desc: '맞춤 솔루션 외주 · RPA·API 연동·자동화 포함',
    key: 'freelance',
  },
  {
    href: '/work/website',
    label: '웹사이트 제작',
    desc: '기업·브랜드 사이트 · Next.js + SEO + 배포',
    key: 'website',
  },
  {
    href: '/work/saju',
    label: 'AI 사주',
    desc: 'AI 사주팔자 + 12개 항목 해석 (무료)',
    key: 'saju',
  },
  {
    href: '/work/blog',
    label: '블로그 자동화',
    desc: '수익 엔진 팩 · 자동화 마케팅 콘텐츠',
    key: 'blog',
  },
];

export default function WorkHub() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState('외주 개발 문의');

  const openContact = (service: string) => {
    setModalService(service);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <ContactModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalService('외주 개발 문의');
        }}
        service={modalService}
        checklist={['연락처/이메일', '원하는 작업 범위', '희망 일정']}
      />

      <section className="relative w-full min-h-[60vh] flex items-center justify-center px-6 border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#060e20] to-black pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-mono text-[11px] tracking-widest uppercase text-white/50 mb-4">
            Custom Build
          </p>
          <h1
            className="kx-display text-4xl md:text-6xl font-bold mb-5"
            style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
          >
            맞춤 개발 사업부
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            7년차 백엔드 개발자가 직접 설계·개발·납품. 외주, 웹사이트, AI 사주, 블로그 자동화까지.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CARDS.map((c) => (
            <Link
              key={c.key}
              href={c.href}
              onClick={() => trackCTAClick(`work_hub_card_${c.key}`)}
              className="group rounded-2xl border border-white/15 bg-white/[0.02] p-5 hover:border-white/40 hover:bg-white/[0.05] transition flex flex-col"
              style={{ textDecoration: 'none' }}
            >
              <p className="font-bold text-white text-sm mb-1.5">{c.label}</p>
              <p className="text-xs text-white/60 leading-relaxed flex-1">{c.desc}</p>
              <span aria-hidden="true" className="mt-3 text-white/40 text-xs">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-white/[0.02] border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-[11px] tracking-widest uppercase text-white/50 mb-4 text-center">
            Recent Deliveries
          </p>
          <h2 className="kx-display text-2xl md:text-3xl font-bold text-center mb-10">
            최근 납품 사례
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PORTFOLIO.map((p) => (
              <div
                key={p.title}
                className={`p-5 rounded-2xl border ${p.borderAccent} ${p.accentBg} flex flex-col`}
              >
                <p className={`font-mono text-[10px] uppercase tracking-widest ${p.accentColor} mb-2`}>
                  {p.category}
                </p>
                <h3 className="font-bold text-white text-sm leading-tight mb-2">{p.title}</h3>
                <p className="text-xs text-white/60 line-clamp-3 flex-1">{p.result}</p>
                <p className="text-xs text-white/40 mt-3">{p.priceRange}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="kx-display text-2xl md:text-4xl font-bold mb-5">
            견적이 필요하신가요?
          </h2>
          <p className="text-base text-white/70 mb-8">
            연락처 + 작업 범위 + 희망 일정만 알려주시면 24시간 내 답변드립니다.
          </p>
          <button
            onClick={() => {
              trackCTAClick('work_hub_cta');
              openContact('외주 개발 문의');
            }}
            className="kx-btn-primary inline-flex items-center px-7 py-3 rounded-full text-sm"
          >
            견적 문의하기
          </button>
        </div>
      </section>
    </div>
  );
}
