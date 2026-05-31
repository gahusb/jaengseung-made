'use client';

import { useState } from 'react';
import Link from 'next/link';
import ContactModal from '@/app/components/ContactModal';
import { trackCTAClick } from '@/lib/gtag';
import {
  getAvailablePackages,
  getComingSoonPackages,
  type SaasCatalogItem,
} from '@/lib/saas-catalog';

const WAITLIST_SERVICE = 'SaaS 출시 알림 신청';

function PackageCard({ pkg, dimmed }: { pkg: SaasCatalogItem; dimmed?: boolean }) {
  const inner = (
    <>
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">
          {pkg.category}
        </p>
        {pkg.badge && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/30 text-white/80">
            {pkg.badge}
          </span>
        )}
        {dimmed && !pkg.badge && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/20 text-white/50">
            Coming Soon
          </span>
        )}
      </div>
      <h3 className="kx-display text-xl font-bold text-white mb-1.5">{pkg.name}</h3>
      <p className="text-sm text-white/70 mb-3">{pkg.tagline}</p>
      <p className="text-xs text-white/55 leading-relaxed mb-4 flex-1">{pkg.description}</p>
      <ul className="space-y-2 mb-5">
        {pkg.features.map((f) => (
          <li key={f} className="flex gap-2 text-xs text-white/70">
            <span className="text-white/40">·</span>
            <span className="leading-relaxed">{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between">
        {pkg.priceLabel ? (
          <span className="font-mono text-sm text-white">{pkg.priceLabel}</span>
        ) : (
          <span className="font-mono text-xs text-white/40">가격 준비 중</span>
        )}
        {!dimmed && <span aria-hidden className="text-white/50 text-sm">→</span>}
      </div>
    </>
  );

  const base =
    'group rounded-2xl border p-6 flex flex-col transition';
  if (dimmed) {
    return (
      <div className={`${base} border-white/10 bg-white/[0.01] opacity-60`}>{inner}</div>
    );
  }
  return (
    <Link
      href={pkg.href ?? '#'}
      onClick={() => trackCTAClick(`packages_card_${pkg.slug}`)}
      className={`${base} border-white/15 bg-white/[0.02] hover:border-white/40 hover:bg-white/[0.05]`}
      style={{ textDecoration: 'none' }}
    >
      {inner}
    </Link>
  );
}

export default function PackagesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const available = getAvailablePackages();
  const comingSoon = getComingSoonPackages();
  const isEmpty = available.length === 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service={WAITLIST_SERVICE}
        checklist={['관심 있는 업무·자동화 분야', '연락받을 이메일', '현재 겪는 반복 업무(선택)']}
      />

      {/* Hero */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center px-6 border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0618] to-black pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-mono text-[11px] tracking-widest uppercase text-white/50 mb-4">
            SaaS Products
          </p>
          <h1
            className="kx-display text-4xl md:text-6xl font-bold mb-5"
            style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
          >
            검증된 자동화를
            <br />SaaS로 만듭니다.
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            현직 엔지니어가 실제로 운영하며 검증한 자동화를 월 구독 제품으로.
            {isEmpty ? ' 첫 제품을 준비하고 있습니다.' : ''}
          </p>
          {isEmpty && (
            <button
              onClick={() => {
                trackCTAClick('packages_waitlist_hero');
                setModalOpen(true);
              }}
              className="kx-btn-primary inline-flex items-center px-7 py-3 rounded-full text-sm mt-8"
            >
              출시 알림 받기
            </button>
          )}
        </div>
      </section>

      {/* Available 카탈로그 */}
      {available.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {available.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>
        </section>
      )}

      {/* Coming Soon 예고 */}
      {comingSoon.length > 0 && (
        <section className="py-20 px-6 bg-white/[0.02] border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <p className="font-mono text-[11px] tracking-widest uppercase text-white/50 mb-4 text-center">
              Coming Soon
            </p>
            <h2 className="kx-display text-2xl md:text-3xl font-bold text-center mb-10">
              곧 만나볼 제품
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {comingSoon.map((pkg) => (
                <PackageCard key={pkg.slug} pkg={pkg} dimmed />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 출시 알림 CTA — 항상 노출(빈 상태 아닐 때도 대기자 수집) */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="kx-display text-2xl md:text-4xl font-bold mb-5">
            새 제품이 나오면 가장 먼저 알려드릴까요?
          </h2>
          <p className="text-base text-white/70 mb-8">
            관심 분야를 남겨주시면 출시 시 이메일로 안내드립니다. 원하는 자동화 제안도 환영합니다.
          </p>
          <button
            onClick={() => {
              trackCTAClick('packages_waitlist_cta');
              setModalOpen(true);
            }}
            className="kx-btn-primary inline-flex items-center px-7 py-3 rounded-full text-sm"
          >
            출시 알림 받기
          </button>
        </div>
      </section>
    </div>
  );
}
