import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { getListedProducts, type ProductRow } from '@/lib/supabase/product-files';

import HeroField from './components/deepfield/HeroField';
import ShowcaseGrid from './components/deepfield/ShowcaseGrid';
import ScrollReveal from './components/deepfield/ScrollReveal';
import CountUp from './components/deepfield/CountUp';
import { SHOWCASE_SLOTS } from '@/lib/showcase';

// 쟁승메이드 메인 — Deep Field 다크 캔버스 (서버 컴포넌트)
// PublicShell이 TopNav(h-16, 다크 인지)·푸터(navy)·main 배경(라이트)을 제공한다.
// 이 페이지는 자기 풀-블리드 다크 배경을 소유하여 main의 라이트 배경을 덮는다.
// 히어로를 -mt-16 + pt-16으로 끌어올려 pt-16로 인한 상단 16px 라이트 띠를 제거한다.

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

const PROOF = [
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
    // 풀-블리드 다크 캔버스 — main의 라이트 배경을 덮는다.
    <div style={{ background: 'var(--jsm-dark-bg)', color: 'var(--jsm-dark-ink)' }}>
      {/* ─────────────────── 1. HERO ─────────────────── */}
      {/* -mt-16 pt-16: 고정 헤더 아래로 끌어올려 상단 라이트 띠 제거 + 풀 뷰포트 확보 */}
      <section className="relative -mt-16 flex min-h-[100svh] items-center overflow-hidden">
        <HeroField className="absolute inset-0" />
        {/* 콘텐츠 가독성용 하단 스크림 (radial 광원 위 텍스트 대비) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(7,13,26,0.55) 0%, transparent 28%, transparent 60%, rgba(7,13,26,0.75) 100%)',
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-28 pb-24 lg:px-8 lg:pt-32">
          <div className="max-w-4xl">
            <span
              className="mb-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: 'var(--jsm-accent-bright)' }}
            >
              <span
                className="inline-block h-1 w-1 rounded-full"
                style={{ background: 'var(--jsm-accent-bright)' }}
              />
              외주 개발 · 완성 소프트웨어
            </span>
            <h1
              className="font-bold break-keep"
              style={{
                color: 'var(--jsm-dark-ink)',
                fontSize: 'clamp(2.6rem, 8vw, 5.75rem)',
                lineHeight: 1.04,
                letterSpacing: '-0.04em',
              }}
            >
              생각을
              <br />
              동작하는 소프트웨어로
              <span style={{ color: 'var(--jsm-accent-bright)' }}>.</span>
            </h1>
            <p
              className="mt-8 max-w-2xl break-keep text-lg leading-relaxed lg:text-xl"
              style={{ color: 'var(--jsm-dark-soft)', ...KOR_BODY }}
            >
              24시간 돌아가는 실서비스를 직접 설계하고 운영합니다. 외주 개발도, 완성
              소프트웨어도 — 같은 손으로.
            </p>
            <div className="mt-11 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/outsourcing#contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 font-semibold text-white transition-transform duration-200 hover:translate-y-[-1px]"
                style={{ background: 'var(--jsm-accent)', ...KOR_BODY }}
              >
                프로젝트 문의
                <ArrowRight />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3.5 font-semibold transition-colors duration-200 hover:bg-[var(--jsm-dark-surface)]"
                style={{
                  color: 'var(--jsm-dark-ink)',
                  borderColor: 'var(--jsm-dark-line)',
                  ...KOR_BODY,
                }}
              >
                소프트웨어 보기
              </Link>
            </div>
          </div>
        </div>

        {/* 스크롤 큐 — 가는 세로선 + 점 미세 바운스 (motion-safe 가드는 CSS) */}
        <div
          aria-hidden
          className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span
            className="block h-9 w-px"
            style={{
              background:
                'linear-gradient(to bottom, transparent, var(--jsm-dark-line))',
            }}
          />
          <span
            className="df-scroll-dot block h-1.5 w-1.5 rounded-full"
            style={{ background: 'var(--jsm-accent-bright)' }}
          />
        </div>
      </section>

      {/* ─────────────────── 2. SHOWCASE ─────────────────── */}
      <section className="border-t" style={{ borderColor: 'var(--jsm-dark-line)' }}>
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
          <ScrollReveal>
            <p
              className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: 'var(--jsm-accent-bright)' }}
            >
              showcase
            </p>
            <h2
              className="max-w-2xl break-keep text-3xl font-bold lg:text-[2.75rem] lg:leading-[1.12]"
              style={{ color: 'var(--jsm-dark-ink)', letterSpacing: '-0.03em' }}
            >
              이런 걸 만들어 드립니다
            </h2>
          </ScrollReveal>

          <div className="mt-14">
            <ShowcaseGrid slots={SHOWCASE_SLOTS} variant="home" />
          </div>

          <div className="mt-10 flex justify-end">
            <Link
              href="/outsourcing#showcase"
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 hover:opacity-80"
              style={{ color: 'var(--jsm-accent-bright)', ...KOR_BODY }}
            >
              전체 레퍼런스
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────── 3. PROCESS ─────────────────── */}
      <section className="border-t" style={{ borderColor: 'var(--jsm-dark-line)' }}>
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
          <ScrollReveal>
            <p
              className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: 'var(--jsm-accent-bright)' }}
            >
              process
            </p>
            <h2
              className="max-w-2xl break-keep text-3xl font-bold lg:text-[2.75rem] lg:leading-[1.12]"
              style={{ color: 'var(--jsm-dark-ink)', letterSpacing: '-0.03em' }}
            >
              상담부터 납품까지, 흐름이 분명합니다
            </h2>
          </ScrollReveal>

          <div className="relative mt-14">
            {/* 단계 연결선 — draw 라인 (데스크톱 가로 관통) */}
            <ScrollReveal
              variant="draw"
              className="absolute left-0 right-0 top-7 hidden lg:block"
            >
              <span
                className="block h-px w-full"
                style={{
                  background:
                    'linear-gradient(to right, transparent, var(--jsm-dark-line) 12%, var(--jsm-dark-line) 88%, transparent)',
                }}
              />
            </ScrollReveal>

            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:bg-transparent">
              {PROCESS.map((s, i) => (
                <ScrollReveal key={s.n} delay={i * 100}>
                  <div
                    className="relative h-full rounded-2xl border p-7 lg:p-8"
                    style={{
                      background: 'var(--jsm-dark-surface)',
                      borderColor: 'var(--jsm-dark-line)',
                    }}
                  >
                    <span
                      className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-full font-mono text-sm font-bold"
                      style={{
                        color: 'var(--jsm-accent-bright)',
                        background: 'var(--jsm-dark-bg)',
                        boxShadow: 'inset 0 0 0 1px var(--jsm-dark-line)',
                      }}
                    >
                      {s.n}
                    </span>
                    <h3
                      className="mt-5 break-keep text-lg font-bold"
                      style={{ color: 'var(--jsm-dark-ink)', ...KOR_TIGHT }}
                    >
                      {s.t}
                    </h3>
                    <p
                      className="mt-2 break-keep text-sm leading-relaxed"
                      style={{ color: 'var(--jsm-dark-soft)', ...KOR_BODY }}
                    >
                      {s.d}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── 4. PROOF ─────────────────── */}
      <section className="border-t" style={{ borderColor: 'var(--jsm-dark-line)' }}>
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
          <ScrollReveal>
            <p
              className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: 'var(--jsm-accent-bright)' }}
            >
              in production
            </p>
            <h2
              className="max-w-2xl break-keep text-3xl font-bold lg:text-[2.75rem] lg:leading-[1.12]"
              style={{ color: 'var(--jsm-dark-ink)', letterSpacing: '-0.03em' }}
            >
              데모가 아니라 매일 돌아가는 시스템
            </h2>
            <p
              className="mt-4 max-w-xl break-keep leading-relaxed"
              style={{ color: 'var(--jsm-dark-soft)', ...KOR_BODY }}
            >
              직접 개발하고 운영 중인 실서비스입니다. 같은 깊이로 의뢰하신 프로젝트를 만듭니다.
            </p>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {PROOF.map((p, i) => (
              <ScrollReveal key={p.t} delay={i * 100}>
                <div
                  className="flex h-full flex-col rounded-2xl border p-7"
                  style={{
                    background: 'var(--jsm-dark-surface)',
                    borderColor: 'var(--jsm-dark-line)',
                  }}
                >
                  <span
                    className="mb-5 inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{
                      color: 'var(--jsm-accent-bright)',
                      background: 'rgba(96,165,250,0.12)',
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: 'var(--jsm-accent-bright)' }}
                    />
                    직접 개발·운영 중
                  </span>
                  <h3
                    className="break-keep text-lg font-bold"
                    style={{ color: 'var(--jsm-dark-ink)', ...KOR_TIGHT }}
                  >
                    {p.t}
                  </h3>
                  <p
                    className="mt-2.5 flex-1 break-keep text-sm leading-relaxed"
                    style={{ color: 'var(--jsm-dark-soft)', ...KOR_BODY }}
                  >
                    {p.d}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded px-2.5 py-1 text-xs"
                        style={{
                          color: 'var(--jsm-dark-soft)',
                          background: 'rgba(148,163,184,0.08)',
                          ...KOR_BODY,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* 스탯 3종 — 카운트업 */}
          <ScrollReveal className="mt-14">
            <div
              className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border sm:grid-cols-3"
              style={{ borderColor: 'var(--jsm-dark-line)', background: 'var(--jsm-dark-line)' }}
            >
              <div className="px-8 py-10" style={{ background: 'var(--jsm-dark-bg)' }}>
                <p
                  className="text-4xl font-bold lg:text-5xl"
                  style={{ color: 'var(--jsm-dark-ink)', letterSpacing: '-0.03em' }}
                >
                  <CountUp to={15} suffix="+" />
                </p>
                <p
                  className="mt-2 break-keep text-sm"
                  style={{ color: 'var(--jsm-dark-soft)', ...KOR_BODY }}
                >
                  직접 운영 중인 실서비스
                </p>
              </div>
              <div className="px-8 py-10" style={{ background: 'var(--jsm-dark-bg)' }}>
                <p
                  className="text-4xl font-bold lg:text-5xl"
                  style={{ color: 'var(--jsm-dark-ink)', letterSpacing: '-0.03em' }}
                >
                  24/7
                </p>
                <p
                  className="mt-2 break-keep text-sm"
                  style={{ color: 'var(--jsm-dark-soft)', ...KOR_BODY }}
                >
                  무중단 운영
                </p>
              </div>
              <div className="px-8 py-10" style={{ background: 'var(--jsm-dark-bg)' }}>
                <p
                  className="text-4xl font-bold lg:text-5xl"
                  style={{ color: 'var(--jsm-dark-ink)', letterSpacing: '-0.03em' }}
                >
                  원스톱
                </p>
                <p
                  className="mt-2 break-keep text-sm"
                  style={{ color: 'var(--jsm-dark-soft)', ...KOR_BODY }}
                >
                  기획 → 배포 단독 진행
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────── 5. SOFTWARE + CTA ─────────────────── */}
      {/* Phase 2: products 테이블 기반 동적 진열. 0개이면 출시 준비 중 폴백. */}
      <section className="border-t" style={{ borderColor: 'var(--jsm-dark-line)' }}>
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
          {hasProducts ? (
            <>
              <ScrollReveal>
                <div className="flex items-end justify-between">
                  <div>
                    <p
                      className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em]"
                      style={{ color: 'var(--jsm-accent-bright)' }}
                    >
                      software
                    </p>
                    <h2
                      className="break-keep text-3xl font-bold lg:text-[2.75rem] lg:leading-[1.12]"
                      style={{ color: 'var(--jsm-dark-ink)', letterSpacing: '-0.03em' }}
                    >
                      바로 쓰는 완성 소프트웨어
                    </h2>
                  </div>
                  <Link
                    href="/products"
                    className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold transition-colors duration-150 hover:opacity-80 sm:inline-flex"
                    style={{ color: 'var(--jsm-accent-bright)', ...KOR_BODY }}
                  >
                    전체 보기
                    <ArrowRight />
                  </Link>
                </div>
              </ScrollReveal>

              <div className="mt-14 grid gap-6 md:grid-cols-3">
                {featuredProducts.map((p, i) => (
                  <ScrollReveal key={p.id} delay={i * 100}>
                    {/* 라이트 카드가 다크 위에 떠 있는 대비 */}
                    <Link
                      href={`/products/${p.id}`}
                      className="group flex h-full flex-col rounded-2xl p-7 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:translate-y-[-2px]"
                      style={{ background: 'var(--jsm-surface)' }}
                    >
                      <h3
                        className="break-keep text-lg font-bold"
                        style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                      >
                        {p.name}
                      </h3>
                      {p.description && (
                        <p
                          className="mt-2.5 flex-1 break-keep text-sm leading-relaxed"
                          style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
                        >
                          {p.description}
                        </p>
                      )}
                      <div
                        className="mt-6 flex items-center justify-between border-t pt-5"
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
                  </ScrollReveal>
                ))}
              </div>
              <div className="mt-8 sm:hidden">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold"
                  style={{ color: 'var(--jsm-accent-bright)', ...KOR_BODY }}
                >
                  전체 보기
                  <ArrowRight />
                </Link>
              </div>
            </>
          ) : (
            <ScrollReveal>
              <div
                className="rounded-2xl border px-8 py-14 text-center lg:px-14 lg:py-16"
                style={{
                  background: 'var(--jsm-dark-surface)',
                  borderColor: 'var(--jsm-dark-line)',
                }}
              >
                <p
                  className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: 'var(--jsm-accent-bright)' }}
                >
                  coming soon
                </p>
                <h2
                  className="break-keep text-2xl font-bold lg:text-3xl"
                  style={{ color: 'var(--jsm-dark-ink)', ...KOR_TIGHT }}
                >
                  검증된 완성 소프트웨어를 준비하고 있습니다
                </h2>
                <p
                  className="mx-auto mt-4 max-w-xl break-keep leading-relaxed"
                  style={{ color: 'var(--jsm-dark-soft)', ...KOR_BODY }}
                >
                  직접 운영하며 다듬은 도구를 하나씩 다운로드 상품으로 공개할 예정입니다. 출시
                  소식을 가장 먼저 받아보세요.
                </p>
                <Link
                  href="/outsourcing#contact"
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3.5 font-semibold transition-colors duration-200 hover:bg-[var(--jsm-dark-surface)]"
                  style={{
                    color: 'var(--jsm-dark-ink)',
                    borderColor: 'var(--jsm-dark-line)',
                    ...KOR_BODY,
                  }}
                >
                  출시 소식 받기
                  <ArrowRight />
                </Link>
              </div>
            </ScrollReveal>
          )}

          {/* 최종 CTA 밴드 — accent bg */}
          <ScrollReveal className="mt-24 lg:mt-32">
            <div
              className="relative overflow-hidden rounded-3xl px-8 py-16 lg:px-16 lg:py-20"
              style={{ background: 'var(--jsm-accent)' }}
            >
              {/* 광원 — radial 허용 */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(60% 80% at 85% 0%, rgba(96,165,250,0.45) 0%, transparent 55%)',
                }}
              />
              <div className="relative max-w-3xl">
                <h2
                  className="break-keep text-3xl font-bold leading-tight text-white lg:text-[2.5rem]"
                  style={KOR_TIGHT}
                >
                  프로젝트, 이야기부터 시작하세요
                </h2>
                <p
                  className="mt-5 max-w-2xl break-keep text-lg leading-relaxed text-white/80"
                  style={KOR_BODY}
                >
                  아이디어 단계여도 괜찮습니다. 무료 상담에서 방향을 함께 잡아드립니다.
                </p>
                <Link
                  href="/outsourcing#contact"
                  className="mt-9 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-4 font-semibold transition-transform duration-200 hover:translate-y-[-1px]"
                  style={{ color: 'var(--jsm-accent)', ...KOR_BODY }}
                >
                  무료 상담 신청
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
