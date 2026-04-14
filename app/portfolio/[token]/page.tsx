import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { verifyPortfolioTokenNode } from '@/lib/admin-auth';

export const metadata: Metadata = {
  title: '박재오 — 외주 개발 포트폴리오',
  description: '7년차 대기업 백엔드 개발자 박재오의 외주 포트폴리오.',
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
    <div className="min-h-screen bg-slate-950 text-white">
      <section
        className="relative overflow-hidden px-6 py-20 lg:px-14 lg:py-28"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, #1e293b 0%, #020617 55%)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs text-emerald-300/80 tracking-[0.25em] uppercase">
              Private Portfolio · {payload.memo || 'Confidential'}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] mb-6" style={{ wordBreak: 'keep-all' }}>
            박재오
            <br />
            <span className="bg-gradient-to-r from-sky-300 via-blue-200 to-cyan-300 bg-clip-text text-transparent">
              외주 개발 포트폴리오
            </span>
          </h1>

          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mb-10" style={{ wordBreak: 'keep-all' }}>
            7년차 대기업 백엔드 개발자 · 계약서 우선 · 납기 패널티 보장 · 소스코드 100% 인도.
            본 페이지는 {expires}까지 유효한 개별 공유 링크입니다.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/freelance"
              className="group border border-white/10 hover:border-sky-400/50 rounded-2xl p-6 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
            >
              <p className="font-mono text-xs text-sky-300/70 uppercase tracking-widest mb-2">
                Freelance
              </p>
              <h3 className="text-xl font-extrabold mb-2">외주 개발 · 전체 소개</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                계약 프로세스, 납기 패널티, 포트폴리오 사례, 견적 문의.
              </p>
              <span className="inline-block mt-4 text-sm font-bold text-sky-300 group-hover:underline">
                자세히 보기 →
              </span>
            </Link>
            <Link
              href="/services/website"
              className="group border border-white/10 hover:border-violet-400/50 rounded-2xl p-6 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
            >
              <p className="font-mono text-xs text-violet-300/70 uppercase tracking-widest mb-2">
                Website
              </p>
              <h3 className="text-xl font-extrabold mb-2">홈페이지·쇼핑몰 제작</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Next.js 기반 반응형 웹, SEO 기본, 3개월 유지보수 포함.
              </p>
              <span className="inline-block mt-4 text-sm font-bold text-violet-300 group-hover:underline">
                자세히 보기 →
              </span>
            </Link>
          </div>

          <div className="mt-10 text-xs text-slate-500 font-mono">
            © 쟁승메이드 · 010-3907-1392 · bgg8988@gmail.com
          </div>
        </div>
      </section>
    </div>
  );
}
