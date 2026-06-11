import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { getListedProducts, type ProductRow } from '@/lib/supabase/product-files';

// 쟁승메이드 메인 — 외주 개발 + 완성 소프트웨어 2축 랜딩 (서버 컴포넌트)
// PublicShell이 TopNav(h-16)·푸터·main 배경을 제공하므로 여기서는 콘텐츠 섹션만 렌더한다.

// 소프트웨어 진열 섹션이 DB 조회를 포함하므로 항상 최신 목록을 보여준다.
export const dynamic = 'force-dynamic';

const KOR_TIGHT = { letterSpacing: '-0.02em' } as const;
const KOR_BODY = { letterSpacing: '-0.01em' } as const;

const PROCESS = [
  { n: '01', t: '무료 상담', d: '요구사항을 함께 정리하고 실현 가능성을 점검합니다.' },
  { n: '02', t: '견적·범위 확정', d: '영업일 2일 내 범위와 견적을 정리해 회신드립니다.' },
  { n: '03', t: '개발·중간 공유', d: '주 1회 이상 진행 상황을 공유하며 방향을 맞춥니다.' },
  { n: '04', t: '납품·배포 지원', d: '검수 후 30일 무상 하자보수로 안정화까지 책임집니다.' },
];

const STATS = [
  { v: '7년차', l: '대기업 백엔드 개발 경력' },
  { v: '15+', l: '직접 운영 중인 서비스' },
  { v: '기획→배포', l: '원스톱 단독 진행' },
];

const STACK = ['Python', 'Java', 'Spring', 'Next.js', 'AI 연동'];

const PORTFOLIO = [
  {
    t: '주식 자동매매 시스템',
    d: '텔레그램과 연동해 실시간으로 주문을 집행하고 체결·손익 리포트를 자동 전송합니다.',
    tags: ['실시간 주문', '텔레그램 연동', '리포트 자동화'],
  },
  {
    t: '부동산 청약 자동 수집·매칭',
    d: '공고를 주기적으로 크롤링해 조건에 맞는 매물만 골라내고, 신규 매칭을 즉시 알립니다.',
    tags: ['크롤링', '조건 매칭', '푸시 알림'],
  },
  {
    t: 'AI 콘텐츠 자동화 파이프라인',
    d: '생성부터 검수, 발행까지 사람이 개입할 지점만 남기고 전 과정을 자동으로 연결합니다.',
    tags: ['AI 연동', '검수 워크플로우', '자동 발행'],
  },
];

function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

async function loadFeaturedProducts(): Promise<ProductRow[]> {
  try {
    const all = await getListedProducts(createAdminClient());
    return all.slice(0, 3);
  } catch (err) {
    console.error('[Home] getListedProducts failed, falling back to empty:', err);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await loadFeaturedProducts();
  const hasProducts = featuredProducts.length > 0;

  return (
    <>
      {/* ─── 1. Hero ─── */}
      <section className="border-b" style={{ borderColor: 'var(--jsm-line)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <span
              className="inline-block text-xs font-semibold mb-6 px-2.5 py-1 rounded"
              style={{
                color: 'var(--jsm-accent)',
                background: 'var(--jsm-accent-soft)',
                ...KOR_BODY,
              }}
            >
              외주 개발 · 완성 소프트웨어
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.2] break-keep"
              style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
            >
              필요한 소프트웨어,
              <br className="hidden sm:block" /> 만들어 드리거나{' '}
              <span style={{ color: 'var(--jsm-accent)' }}>이미 만들어 두었습니다.</span>
            </h1>
            <p
              className="mt-7 text-lg lg:text-xl leading-relaxed break-keep max-w-2xl"
              style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
            >
              7년차 대기업 백엔드 개발자가 직접 설계·개발·운영합니다. 맞춤 외주 개발과
              검증된 완성 소프트웨어 중 필요한 쪽을 선택하세요.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/outsourcing#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-white transition-colors duration-150"
                style={{ background: 'var(--jsm-accent)', ...KOR_BODY }}
              >
                프로젝트 문의하기
                <ArrowRight />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold border transition-colors duration-150 hover:bg-[var(--jsm-surface-alt)]"
                style={{
                  color: 'var(--jsm-ink)',
                  borderColor: 'var(--jsm-line)',
                  background: 'var(--jsm-surface)',
                  ...KOR_BODY,
                }}
              >
                소프트웨어 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. 2축 서비스 ─── */}
      <section style={{ background: 'var(--jsm-surface-alt)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid md:grid-cols-2 gap-6">
            {/* 외주 개발 */}
            <Link
              href="/outsourcing"
              className="group block rounded-2xl p-9 lg:p-11 border transition-colors duration-200 hover:border-[var(--jsm-accent)]"
              style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
            >
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--jsm-accent)' }}
              >
                Custom
              </span>
              <h2
                className="mt-3 text-2xl font-bold break-keep"
                style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
              >
                외주 개발
              </h2>
              <p
                className="mt-3 leading-relaxed break-keep"
                style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
              >
                기획부터 배포·운영까지 한 사람이 책임집니다. 웹 서비스, API, 업무 자동화,
                봇 개발까지 필요한 형태로 만들어 드립니다.
              </p>
              <span
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 group-hover:text-[var(--jsm-accent-hover)]"
                style={{ color: 'var(--jsm-accent)', ...KOR_BODY }}
              >
                외주 개발 알아보기
                <ArrowRight />
              </span>
            </Link>

            {/* 완성 소프트웨어 */}
            <Link
              href="/products"
              className="group block rounded-2xl p-9 lg:p-11 border transition-colors duration-200 hover:border-[var(--jsm-accent)]"
              style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
            >
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--jsm-accent)' }}
              >
                Ready-made
              </span>
              <h2
                className="mt-3 text-2xl font-bold break-keep"
                style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
              >
                완성 소프트웨어
              </h2>
              <p
                className="mt-3 leading-relaxed break-keep"
                style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
              >
                입금 확인 후 바로 다운로드해 사용합니다. 제가 직접 운영하며 검증한 도구만
                정리해 제공합니다.
              </p>
              <span
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 group-hover:text-[var(--jsm-accent-hover)]"
                style={{ color: 'var(--jsm-accent)', ...KOR_BODY }}
              >
                소프트웨어 둘러보기
                <ArrowRight />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 3. 개발 프로세스 ─── */}
      <section id="process" style={{ background: 'var(--jsm-bg)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--jsm-accent)' }}
            >
              Process
            </p>
            <h2
              className="text-3xl lg:text-4xl font-bold break-keep"
              style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
            >
              상담부터 납품까지, 흐름이 분명합니다
            </h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--jsm-line)', background: 'var(--jsm-line)' }}>
            {PROCESS.map((s) => (
              <div key={s.n} className="p-7 lg:p-8" style={{ background: 'var(--jsm-surface)' }}>
                <span
                  className="text-sm font-bold"
                  style={{ color: 'var(--jsm-accent)', fontFamily: 'monospace' }}
                >
                  {s.n}
                </span>
                <h3
                  className="mt-4 text-lg font-bold break-keep"
                  style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                >
                  {s.t}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed break-keep"
                  style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
                >
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. 신뢰 요소 ─── */}
      <section style={{ background: 'var(--jsm-navy)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid sm:grid-cols-3 gap-10 sm:gap-8">
            {STATS.map((s) => (
              <div key={s.l}>
                <p
                  className="text-3xl lg:text-4xl font-bold text-white"
                  style={KOR_TIGHT}
                >
                  {s.v}
                </p>
                <p
                  className="mt-2 text-sm leading-relaxed break-keep text-white/60"
                  style={KOR_BODY}
                >
                  {s.l}
                </p>
              </div>
            ))}
          </div>
          <div
            className="mt-12 pt-8 border-t flex flex-wrap items-center gap-x-3 gap-y-2"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <span className="text-xs uppercase tracking-wider text-white/40 mr-1">Stack</span>
            {STACK.map((s) => (
              <span
                key={s}
                className="text-sm text-white/80 px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.06)', ...KOR_BODY }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. 포트폴리오 하이라이트 ─── */}
      <section id="portfolio" style={{ background: 'var(--jsm-surface-alt)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--jsm-accent)' }}
            >
              Portfolio
            </p>
            <h2
              className="text-3xl lg:text-4xl font-bold break-keep"
              style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
            >
              실제로 운영 중인 시스템들
            </h2>
            <p
              className="mt-4 leading-relaxed break-keep"
              style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
            >
              데모가 아니라 매일 돌아가는 서비스입니다. 같은 깊이로 의뢰하신 프로젝트를 만듭니다.
            </p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {PORTFOLIO.map((p) => (
              <div
                key={p.t}
                className="flex flex-col rounded-2xl p-7 border"
                style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
              >
                <span
                  className="self-start inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full mb-5"
                  style={{ color: 'var(--jsm-accent)', background: 'var(--jsm-accent-soft)' }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--jsm-accent)' }}
                  />
                  직접 개발·운영 중
                </span>
                <h3
                  className="text-lg font-bold break-keep"
                  style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                >
                  {p.t}
                </h3>
                <p
                  className="mt-2.5 text-sm leading-relaxed break-keep flex-1"
                  style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
                >
                  {p.d}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded"
                      style={{
                        color: 'var(--jsm-ink-soft)',
                        background: 'var(--jsm-surface-alt)',
                        ...KOR_BODY,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/outsourcing#portfolio"
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 hover:text-[var(--jsm-accent-hover)]"
              style={{ color: 'var(--jsm-accent)', ...KOR_BODY }}
            >
              포트폴리오 자세히 보기
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 6. 소프트웨어 진열 ─── */}
      {/* Phase 2: products 테이블 기반 동적 진열. 0개이면 출시 준비 중 폴백. */}
      <section style={{ background: 'var(--jsm-bg)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          {hasProducts ? (
            <>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: 'var(--jsm-accent)' }}
                  >
                    Software
                  </p>
                  <h2
                    className="text-3xl lg:text-4xl font-bold break-keep"
                    style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                  >
                    완성 소프트웨어
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 hover:text-[var(--jsm-accent-hover)] shrink-0"
                  style={{ color: 'var(--jsm-accent)', ...KOR_BODY }}
                >
                  전체 보기
                  <ArrowRight />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="group flex flex-col rounded-2xl p-7 border transition-colors duration-200 hover:border-[var(--jsm-accent)]"
                    style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
                  >
                    <h3
                      className="text-lg font-bold break-keep"
                      style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                    >
                      {p.name}
                    </h3>
                    {p.description && (
                      <p
                        className="mt-2.5 text-sm leading-relaxed break-keep flex-1"
                        style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
                      >
                        {p.description}
                      </p>
                    )}
                    <div
                      className="mt-6 pt-5 flex items-center justify-between border-t"
                      style={{ borderColor: 'var(--jsm-line)' }}
                    >
                      <span
                        className="text-lg font-bold"
                        style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                      >
                        &#8361;{p.price.toLocaleString('ko-KR')}
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 group-hover:text-[var(--jsm-accent-hover)]"
                        style={{ color: 'var(--jsm-accent)', ...KOR_BODY }}
                      >
                        자세히
                        <ArrowRight />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-8 sm:hidden">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold"
                  style={{ color: 'var(--jsm-accent)', ...KOR_BODY }}
                >
                  전체 보기
                  <ArrowRight />
                </Link>
              </div>
            </>
          ) : (
            <div
              className="rounded-2xl border px-8 py-14 lg:px-14 lg:py-16 text-center"
              style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: 'var(--jsm-accent)' }}
              >
                Coming soon
              </p>
              <h2
                className="text-2xl lg:text-3xl font-bold break-keep"
                style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
              >
                검증된 완성 소프트웨어를 준비하고 있습니다
              </h2>
              <p
                className="mt-4 max-w-xl mx-auto leading-relaxed break-keep"
                style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
              >
                직접 운영하며 다듬은 도구를 하나씩 다운로드 상품으로 공개할 예정입니다.
                출시 소식을 가장 먼저 받아보세요.
              </p>
              <Link
                href="/outsourcing#contact"
                className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold border transition-colors duration-150 hover:bg-[var(--jsm-surface-alt)]"
                style={{
                  color: 'var(--jsm-ink)',
                  borderColor: 'var(--jsm-line)',
                  ...KOR_BODY,
                }}
              >
                출시 소식 받기
                <ArrowRight />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── 7. 최종 CTA ─── */}
      <section style={{ background: 'var(--jsm-navy)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24 lg:py-28">
          <div className="max-w-3xl">
            <h2
              className="text-3xl lg:text-[2.5rem] font-bold leading-tight text-white break-keep"
              style={KOR_TIGHT}
            >
              프로젝트, 이야기부터 시작하세요
            </h2>
            <p
              className="mt-5 text-lg leading-relaxed text-white/70 break-keep max-w-2xl"
              style={KOR_BODY}
            >
              아이디어 단계여도 괜찮습니다. 무료 상담에서 방향을 함께 잡아드립니다.
            </p>
            <Link
              href="/outsourcing#contact"
              className="mt-9 inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg font-semibold text-white transition-colors duration-150"
              style={{ background: 'var(--jsm-accent)', ...KOR_BODY }}
            >
              무료 상담 신청
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
