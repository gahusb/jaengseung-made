import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { verifyPortfolioTokenNode } from '@/lib/admin-auth';

export const metadata: Metadata = {
  title: '박재오 — 외주 개발 포트폴리오',
  description: '현직 실무 엔지니어 박재오의 외주 포트폴리오.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ token: string }>;
}

export default async function PortfolioGateway({ params }: Props) {
  const { token } = await params;
  const payload = verifyPortfolioTokenNode(token);
  if (!payload) notFound();

  const expires = new Date(payload.exp).toLocaleDateString('ko-KR');

  return (
    <div className="min-h-screen" style={{ background: 'var(--jsm-bg)' }}>
      {/* 헤더 배너 — jsm-navy 사용 (푸터/다크 섹션 전용 토큰) */}
      <div className="px-6 py-4" style={{ background: 'var(--jsm-navy)' }}>
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: 'var(--jsm-accent)' }}>
            쟁
          </div>
          <span className="text-white font-bold text-sm">쟁승메이드</span>
          <span className="ml-auto font-mono text-xs tracking-[0.2em] uppercase px-3 py-1 rounded-full border" style={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)' }}>
            Private · {payload.memo || 'Confidential'}
          </span>
        </div>
      </div>

      <section className="px-6 py-16 lg:px-14 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--jsm-ink-soft)' }}>
              개인 공유 포트폴리오
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: 'var(--jsm-ink)', wordBreak: 'keep-all' }}>
            박재오
            <br />
            <span className="gradient-text">외주 개발 포트폴리오</span>
          </h1>

          <p className="text-lg leading-relaxed max-w-2xl mb-4" style={{ color: 'var(--jsm-ink-soft)', wordBreak: 'keep-all' }}>
            현직 실무 엔지니어 · 계약서 우선 · 납기 패널티 보장 · 소스코드 100% 인도.
          </p>
          <p className="text-sm mb-10 font-mono px-3 py-2 rounded-lg inline-block" style={{ color: 'var(--jsm-ink-faint)', background: 'var(--jsm-surface-alt)', border: '1px solid var(--jsm-line)' }}>
            이 링크는 {expires}까지 유효합니다
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/freelance"
              className="group rounded-2xl p-6 transition-all hover:-translate-y-1"
              style={{ background: 'var(--jsm-surface)', border: '1px solid var(--jsm-line)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--jsm-accent)' }}>
                Freelance
              </p>
              <h3 className="text-xl font-extrabold mb-2" style={{ color: 'var(--jsm-ink)' }}>외주 개발 · 전체 소개</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--jsm-ink-soft)' }}>
                계약 프로세스, 납기 패널티, 포트폴리오 사례, 견적 문의.
              </p>
              <span className="inline-block mt-4 text-sm font-bold group-hover:underline" style={{ color: 'var(--jsm-accent)' }}>
                자세히 보기 →
              </span>
            </Link>
            <Link
              href="/services/website"
              className="group rounded-2xl p-6 transition-all hover:-translate-y-1"
              style={{ background: 'var(--jsm-surface)', border: '1px solid var(--jsm-line)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#7c3aed' }}>
                Website
              </p>
              <h3 className="text-xl font-extrabold mb-2" style={{ color: 'var(--jsm-ink)' }}>홈페이지·쇼핑몰 제작</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--jsm-ink-soft)' }}>
                Next.js 기반 반응형 웹, SEO 기본, 3개월 유지보수 포함.
              </p>
              <span className="inline-block mt-4 text-sm font-bold group-hover:underline" style={{ color: '#7c3aed' }}>
                자세히 보기 →
              </span>
            </Link>
          </div>

          <div className="mt-10 text-xs font-mono" style={{ color: 'var(--jsm-ink-faint)' }}>
            © 쟁승메이드 · 010-3907-1392 · bgg8988@gmail.com
          </div>
        </div>
      </section>
    </div>
  );
}
