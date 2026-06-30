import Link from 'next/link';
import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { getListedProducts, type ProductRow } from '@/lib/supabase/product-files';

// 완성 소프트웨어 동적 카탈로그 (서버 컴포넌트). 라이트 고craft — 홈·외주와 동일 언어.
// DB 장애·마이그레이션 미적용 시 빈 배열로 폴백해 페이지가 항상 200으로 생존한다.

export const metadata: Metadata = {
  title: '완성 소프트웨어',
  description:
    '쟁승메이드가 직접 운영하며 검증한 완성 소프트웨어 목록. 계좌이체 결제 후 입금 확인 즉시 마이페이지에서 다운로드할 수 있습니다.',
};

export const dynamic = 'force-dynamic';

const KOR_TIGHT = { letterSpacing: '-0.02em' } as const;
const KOR_BODY = { letterSpacing: '-0.01em' } as const;

const HOW = [
  { n: '01', t: '계좌이체 신청', d: '구매할 도구를 고르고 입금자명과 함께 신청합니다.' },
  { n: '02', t: '입금 확인', d: '입금이 확인되면 승인합니다. 최대 24시간 내 처리됩니다.' },
  { n: '03', t: '마이페이지 다운로드', d: '마이페이지의 내 제품에서 파일을 바로 내려받습니다.' },
];

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

async function loadProducts(): Promise<ProductRow[]> {
  try {
    return await getListedProducts(createAdminClient());
  } catch (err) {
    console.error('[Products] getListedProducts failed, falling back to empty:', err);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await loadProducts();
  const hasProducts = products.length > 0;

  return (
    <>
      {/* ─── Hero ─── */}
      <section style={{ background: 'var(--jsm-surface)' }}>
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 lg:px-8 lg:pt-28 lg:pb-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--jsm-accent)' }}>
              <span className="inline-block h-1 w-1 rounded-full" style={{ background: 'var(--jsm-accent)' }} />
              software
            </span>
            <h1
              className="mt-6 font-extrabold break-keep"
              style={{ color: 'var(--jsm-ink)', fontSize: 'clamp(2.3rem, 6vw, 3.6rem)', lineHeight: 1.1, letterSpacing: '-0.035em' }}
            >
              직접 운영하며 검증한 도구를
              <br />
              그대로 가져가세요
              <span style={{ color: 'var(--jsm-accent)' }}>.</span>
            </h1>
            <p className="mt-7 break-keep text-lg leading-relaxed" style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}>
              입금 확인 후 마이페이지에서 바로 다운로드할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 카탈로그 / 준비 중 ─── */}
      <section style={{ background: 'var(--jsm-surface-alt)' }}>
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
          {hasProducts ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {products.map((p) => {
                const features = (p.features ?? []).slice(0, 3);
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="group flex flex-col rounded-2xl border p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--jsm-accent)] hover:shadow-[0_24px_60px_-32px_rgba(15,23,42,0.4)] lg:p-8"
                    style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
                  >
                    <h2 className="break-keep text-xl font-bold" style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}>
                      {p.name}
                    </h2>
                    {p.description && (
                      <p className="mt-2.5 break-keep text-sm leading-relaxed" style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}>
                        {p.description}
                      </p>
                    )}

                    {features.length > 0 && (
                      <ul className="mt-5 space-y-2">
                        {features.map((f) => (
                          <li key={f} className="flex items-start gap-2 break-keep text-sm" style={{ color: 'var(--jsm-ink)', ...KOR_BODY }}>
                            <span style={{ color: 'var(--jsm-accent)' }}>
                              <CheckMark />
                            </span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-6 flex items-center justify-between border-t pt-5" style={{ borderColor: 'var(--jsm-line)' }}>
                      <span className="text-lg font-bold" style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}>
                        &#8361;{p.price.toLocaleString('ko-KR')}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 group-hover:text-[var(--jsm-accent-hover)]" style={{ color: 'var(--jsm-accent)', ...KOR_BODY }}>
                        자세히 보기
                        <ArrowRight />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border px-8 py-14 text-center lg:py-16" style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--jsm-accent)' }}>
                coming soon
              </p>
              <h2 className="break-keep text-2xl font-bold lg:text-3xl" style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}>
                현재 상품을 정비하고 있습니다
              </h2>
              <p className="mx-auto mt-4 max-w-md break-keep leading-relaxed" style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}>
                로또 분석 도구, 주식 자동매매 유틸리티 등 실제로 운영 중인 도구들을 구매 가능한
                형태로 순차 공개할 예정입니다. 출시 소식을 먼저 받고 싶다면 아래 링크로 문의해
                주세요.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─── 구매 방식 안내 ─── */}
      <section style={{ background: 'var(--jsm-surface)' }}>
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--jsm-accent)' }}>
            how to buy
          </p>
          <h2 className="break-keep text-3xl font-bold lg:text-[2.6rem] lg:leading-[1.12]" style={{ color: 'var(--jsm-ink)', letterSpacing: '-0.03em' }}>
            구매 방식
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {HOW.map((step) => (
              <div key={step.n} className="rounded-2xl border p-7" style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}>
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full font-mono text-sm font-bold"
                  style={{ color: 'var(--jsm-accent)', background: 'var(--jsm-surface)', boxShadow: 'inset 0 0 0 1px var(--jsm-line)' }}
                >
                  {step.n}
                </span>
                <p className="mt-5 break-keep font-bold" style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}>
                  {step.t}
                </p>
                <p className="mt-2 break-keep text-sm leading-relaxed" style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}>
                  {step.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ background: 'var(--jsm-surface-alt)' }}>
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/outsourcing#contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--jsm-accent-hover)]"
              style={{ background: 'var(--jsm-accent)', ...KOR_BODY }}
            >
              {hasProducts ? '맞춤 개발 문의' : '출시 소식 받기'}
              <ArrowRight />
            </Link>
            <Link
              href="/outsourcing"
              className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-[var(--jsm-surface)]"
              style={{ borderColor: 'var(--jsm-line)', color: 'var(--jsm-ink)', background: 'var(--jsm-surface)', ...KOR_BODY }}
            >
              외주 개발 알아보기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
