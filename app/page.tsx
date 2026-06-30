import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { getListedProducts, type ProductRow } from '@/lib/supabase/product-files';

import ShowcaseGrid from './components/deepfield/ShowcaseGrid';
import ScrollReveal from './components/deepfield/ScrollReveal';
import CountUp from './components/deepfield/CountUp';
import MockWindow from './components/mock/MockWindow';
import { DashboardMock } from './components/mock/screens';
import { SHOWCASE_SLOTS } from '@/lib/showcase';

// 쟁승메이드 메인 — 라이트 고craft (서버 컴포넌트).
// PublicShell이 단일 라이트 TopNav(h-16)·navy 푸터·main(라이트 --jsm-bg, pt-16)을 제공한다.
// 섹션은 surface(#fff) ↔ surface-alt(#f1f5f9) 교차로 구분하고, 히어로의 제품 목업이 유일한 강조면.

export const dynamic = 'force-dynamic';

const KOR_TIGHT = { letterSpacing: '-0.02em' } as const;
const KOR_BODY = { letterSpacing: '-0.01em' } as const;

const TRUST = [
  { v: '15+', t: '직접 운영 중인 실서비스' },
  { v: '24/7', t: '무중단 운영' },
  { v: '원스톱', t: '기획 → 배포 단독 진행' },
];

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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em]"
      style={{ color: 'var(--jsm-accent)' }}
    >
      {children}
    </p>
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
      {/* ─────────────────── 1. HERO ─────────────────── */}
      <section style={{ background: 'var(--jsm-surface)' }}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-20 pb-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pt-28 lg:pb-24">
          {/* 좌 — 텍스트 */}
          <div>
            <span
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: 'var(--jsm-accent)' }}
            >
              <span
                className="inline-block h-1 w-1 rounded-full"
                style={{ background: 'var(--jsm-accent)' }}
              />
              outsourcing · software
            </span>
            <h1
              className="mt-6 font-extrabold break-keep"
              style={{
                color: 'var(--jsm-ink)',
                fontSize: 'clamp(2.4rem, 7vw, 4rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.035em',
              }}
            >
              생각을
              <br />
              동작하는 소프트웨어로
              <span style={{ color: 'var(--jsm-accent)' }}>.</span>
            </h1>
            <p
              className="mt-7 max-w-xl break-keep text-lg leading-relaxed"
              style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
            >
              24시간 돌아가는 실서비스를 직접 설계하고 운영합니다. 외주 개발도, 완성
              소프트웨어도 — 같은 손으로.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/outsourcing#contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 font-semibold text-white transition-colors duration-200 hover:bg-[var(--jsm-accent-hover)]"
                style={{ background: 'var(--jsm-accent)', ...KOR_BODY }}
              >
                프로젝트 문의
                <ArrowRight />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3.5 font-semibold transition-colors duration-200 hover:bg-[var(--jsm-surface-alt)]"
                style={{
                  color: 'var(--jsm-ink)',
                  borderColor: 'var(--jsm-line)',
                  ...KOR_BODY,
                }}
              >
                소프트웨어 보기
              </Link>
            </div>
          </div>

          {/* 우 — 제품 목업 (유일한 강조면) */}
          <div className="lg:pl-4">
            <MockWindow title="stock-report.app">
              <DashboardMock />
            </MockWindow>
          </div>
        </div>

        {/* 신뢰 스트립 */}
        <div className="mx-auto max-w-6xl px-6 pb-16 lg:px-8 lg:pb-20">
          <div
            className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border sm:grid-cols-3"
            style={{ borderColor: 'var(--jsm-line)', background: 'var(--jsm-line)' }}
          >
            {TRUST.map((s) => (
              <div
                key={s.v}
                className="flex items-baseline gap-3 px-6 py-5"
                style={{ background: 'var(--jsm-surface)' }}
              >
                <span
                  className="text-2xl font-bold"
                  style={{ color: 'var(--jsm-accent)', letterSpacing: '-0.03em' }}
                >
                  {s.v}
                </span>
                <span className="break-keep text-sm" style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}>
                  {s.t}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── 2. 2축 소개 ─────────────────── */}
      <section style={{ background: 'var(--jsm-surface-alt)' }}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <ScrollReveal>
            <Eyebrow>what we do</Eyebrow>
            <h2
              className="max-w-2xl break-keep text-3xl font-bold lg:text-[2.6rem] lg:leading-[1.12]"
              style={{ color: 'var(--jsm-ink)', letterSpacing: '-0.03em' }}
            >
              두 가지 방식으로 도와드립니다
            </h2>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                n: '01',
                k: 'outsourcing',
                t: '맞춤 외주 개발',
                d: '웹 서비스·업무 자동화·API·봇·AI 연동까지. 기획부터 납품과 30일 하자보수까지 단독으로 책임집니다.',
                href: '/outsourcing',
                cta: '의뢰 시작',
              },
              {
                n: '02',
                k: 'software',
                t: '완성 소프트웨어 구매',
                d: '직접 운영하며 검증한 도구를 계좌이체로 가져가세요. 입금 확인 즉시 마이페이지에서 다운로드합니다.',
                href: '/products',
                cta: '제품 보기',
              },
            ].map((a, i) => (
              <ScrollReveal key={a.k} delay={i * 100}>
                <Link
                  href={a.href}
                  className="group flex h-full flex-col rounded-2xl border p-8 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--jsm-accent)] hover:shadow-[0_24px_60px_-32px_rgba(15,23,42,0.4)] lg:p-10"
                  style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
                >
                  <span
                    className="font-mono text-[11px] uppercase tracking-[0.18em]"
                    style={{ color: 'var(--jsm-accent)' }}
                  >
                    {a.n} · {a.k}
                  </span>
                  <h3
                    className="mt-4 break-keep text-xl font-bold lg:text-2xl"
                    style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                  >
                    {a.t}
                  </h3>
                  <p
                    className="mt-3 flex-1 break-keep leading-relaxed"
                    style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
                  >
                    {a.d}
                  </p>
                  <span
                    className="mt-6 inline-flex items-center gap-1.5 font-semibold transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: 'var(--jsm-accent)', ...KOR_BODY }}
                  >
                    {a.cta}
                    <ArrowRight />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── 3. SHOWCASE ─────────────────── */}
      <section style={{ background: 'var(--jsm-surface)' }}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <ScrollReveal>
            <Eyebrow>showcase</Eyebrow>
            <h2
              className="max-w-2xl break-keep text-3xl font-bold lg:text-[2.6rem] lg:leading-[1.12]"
              style={{ color: 'var(--jsm-ink)', letterSpacing: '-0.03em' }}
            >
              이런 걸 만들어 드립니다
            </h2>
          </ScrollReveal>

          <div className="mt-12">
            <ShowcaseGrid slots={SHOWCASE_SLOTS} variant="home" />
          </div>

          <div className="mt-10 flex justify-end">
            <Link
              href="/outsourcing#showcase"
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 hover:text-[var(--jsm-accent-hover)]"
              style={{ color: 'var(--jsm-accent)', ...KOR_BODY }}
            >
              전체 레퍼런스
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────── 4. 운영 실증 ─────────────────── */}
      <section style={{ background: 'var(--jsm-surface-alt)' }}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <ScrollReveal>
            <Eyebrow>in production</Eyebrow>
            <h2
              className="max-w-2xl break-keep text-3xl font-bold lg:text-[2.6rem] lg:leading-[1.12]"
              style={{ color: 'var(--jsm-ink)', letterSpacing: '-0.03em' }}
            >
              데모가 아니라 매일 돌아가는 시스템
            </h2>
            <p
              className="mt-4 max-w-xl break-keep leading-relaxed"
              style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
            >
              직접 개발하고 운영 중인 실서비스입니다. 같은 깊이로 의뢰하신 프로젝트를 만듭니다.
            </p>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PROOF.map((p, i) => (
              <ScrollReveal key={p.t} delay={i * 100}>
                <div
                  className="flex h-full flex-col rounded-2xl border p-7"
                  style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
                >
                  <span
                    className="mb-5 inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ color: 'var(--jsm-accent)', background: 'var(--jsm-accent-soft)' }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--jsm-accent)' }} />
                    직접 개발·운영 중
                  </span>
                  <h3
                    className="break-keep text-lg font-bold"
                    style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                  >
                    {p.t}
                  </h3>
                  <p
                    className="mt-2.5 flex-1 break-keep text-sm leading-relaxed"
                    style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
                  >
                    {p.d}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded px-2.5 py-1 text-xs"
                        style={{ color: 'var(--jsm-ink-soft)', background: 'var(--jsm-surface-alt)', ...KOR_BODY }}
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
          <ScrollReveal className="mt-12">
            <div
              className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border sm:grid-cols-3"
              style={{ borderColor: 'var(--jsm-line)', background: 'var(--jsm-line)' }}
            >
              <div className="px-8 py-10" style={{ background: 'var(--jsm-surface)' }}>
                <p className="text-4xl font-bold lg:text-5xl" style={{ color: 'var(--jsm-ink)', letterSpacing: '-0.03em' }}>
                  <CountUp to={15} suffix="+" />
                </p>
                <p className="mt-2 break-keep text-sm" style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}>
                  직접 운영 중인 실서비스
                </p>
              </div>
              <div className="px-8 py-10" style={{ background: 'var(--jsm-surface)' }}>
                <p className="text-4xl font-bold lg:text-5xl" style={{ color: 'var(--jsm-ink)', letterSpacing: '-0.03em' }}>
                  24/7
                </p>
                <p className="mt-2 break-keep text-sm" style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}>
                  무중단 운영
                </p>
              </div>
              <div className="px-8 py-10" style={{ background: 'var(--jsm-surface)' }}>
                <p className="text-4xl font-bold lg:text-5xl" style={{ color: 'var(--jsm-ink)', letterSpacing: '-0.03em' }}>
                  원스톱
                </p>
                <p className="mt-2 break-keep text-sm" style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}>
                  기획 → 배포 단독 진행
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────── 5. PROCESS ─────────────────── */}
      <section style={{ background: 'var(--jsm-surface)' }}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <ScrollReveal>
            <Eyebrow>process</Eyebrow>
            <h2
              className="max-w-2xl break-keep text-3xl font-bold lg:text-[2.6rem] lg:leading-[1.12]"
              style={{ color: 'var(--jsm-ink)', letterSpacing: '-0.03em' }}
            >
              상담부터 납품까지, 흐름이 분명합니다
            </h2>
          </ScrollReveal>

          <div className="relative mt-12">
            {/* 단계 연결선 (데스크톱) */}
            <span
              aria-hidden
              className="absolute left-[12%] right-[12%] top-7 hidden h-px lg:block"
              style={{ background: 'var(--jsm-line)' }}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((s, i) => (
                <ScrollReveal key={s.n} delay={i * 100}>
                  <div
                    className="relative h-full rounded-2xl border p-7 lg:p-8"
                    style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
                  >
                    <span
                      className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-full font-mono text-sm font-bold"
                      style={{
                        color: 'var(--jsm-accent)',
                        background: 'var(--jsm-surface)',
                        boxShadow: 'inset 0 0 0 1px var(--jsm-line)',
                      }}
                    >
                      {s.n}
                    </span>
                    <h3
                      className="mt-5 break-keep text-lg font-bold"
                      style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                    >
                      {s.t}
                    </h3>
                    <p
                      className="mt-2 break-keep text-sm leading-relaxed"
                      style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
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

      {/* ─────────────────── 6. 완성 SW + CTA ─────────────────── */}
      <section style={{ background: 'var(--jsm-surface-alt)' }}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          {hasProducts ? (
            <>
              <ScrollReveal>
                <div className="flex items-end justify-between">
                  <div>
                    <Eyebrow>software</Eyebrow>
                    <h2
                      className="break-keep text-3xl font-bold lg:text-[2.6rem] lg:leading-[1.12]"
                      style={{ color: 'var(--jsm-ink)', letterSpacing: '-0.03em' }}
                    >
                      바로 쓰는 완성 소프트웨어
                    </h2>
                  </div>
                  <Link
                    href="/products"
                    className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold transition-colors duration-150 hover:text-[var(--jsm-accent-hover)] sm:inline-flex"
                    style={{ color: 'var(--jsm-accent)', ...KOR_BODY }}
                  >
                    전체 보기
                    <ArrowRight />
                  </Link>
                </div>
              </ScrollReveal>

              <div className="mt-12 grid gap-6 md:grid-cols-3">
                {featuredProducts.map((p, i) => (
                  <ScrollReveal key={p.id} delay={i * 100}>
                    <Link
                      href={`/products/${p.id}`}
                      className="group flex h-full flex-col rounded-2xl border p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--jsm-accent)] hover:shadow-[0_24px_60px_-32px_rgba(15,23,42,0.4)]"
                      style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
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
                  style={{ color: 'var(--jsm-accent)', ...KOR_BODY }}
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
                style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
              >
                <Eyebrow>coming soon</Eyebrow>
                <h2
                  className="break-keep text-2xl font-bold lg:text-3xl"
                  style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                >
                  검증된 완성 소프트웨어를 준비하고 있습니다
                </h2>
                <p
                  className="mx-auto mt-4 max-w-xl break-keep leading-relaxed"
                  style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
                >
                  직접 운영하며 다듬은 도구를 하나씩 다운로드 상품으로 공개할 예정입니다. 출시
                  소식을 가장 먼저 받아보세요.
                </p>
                <Link
                  href="/outsourcing#contact"
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3.5 font-semibold transition-colors duration-200 hover:bg-[var(--jsm-surface-alt)]"
                  style={{ color: 'var(--jsm-ink)', borderColor: 'var(--jsm-line)', ...KOR_BODY }}
                >
                  출시 소식 받기
                  <ArrowRight />
                </Link>
              </div>
            </ScrollReveal>
          )}

          {/* 최종 CTA 밴드 — 평면 navy (사이트 유일 다크면) */}
          <ScrollReveal className="mt-20 lg:mt-28">
            <div
              className="rounded-3xl px-8 py-16 lg:px-16 lg:py-20"
              style={{ background: 'var(--jsm-navy)' }}
            >
              <div className="max-w-3xl">
                <h2
                  className="break-keep text-3xl font-bold leading-tight text-white lg:text-[2.5rem]"
                  style={KOR_TIGHT}
                >
                  프로젝트, 이야기부터 시작하세요
                </h2>
                <p
                  className="mt-5 max-w-2xl break-keep text-lg leading-relaxed text-white/70"
                  style={KOR_BODY}
                >
                  아이디어 단계여도 괜찮습니다. 무료 상담에서 방향을 함께 잡아드립니다.
                </p>
                <Link
                  href="/outsourcing#contact"
                  className="mt-9 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-4 font-semibold transition-transform duration-200 hover:translate-y-[-1px]"
                  style={{ color: 'var(--jsm-navy)', ...KOR_BODY }}
                >
                  무료 상담 신청
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
