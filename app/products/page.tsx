import Link from 'next/link';
import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { getListedProducts, type ProductRow } from '@/lib/supabase/product-files';

// 완성 소프트웨어 동적 카탈로그 (서버 컴포넌트).
// DB 장애·마이그레이션 미적용 시 빈 배열로 폴백해 페이지가 항상 200으로 생존한다.

export const metadata: Metadata = {
  title: '완성 소프트웨어',
  description:
    '쟁승메이드가 직접 운영하며 검증한 완성 소프트웨어 목록. 계좌이체 결제 후 입금 확인 즉시 마이페이지에서 다운로드할 수 있습니다.',
};

// 카탈로그는 항상 최신 상품을 보여주도록 동적 렌더링.
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

function CheckMark() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 mt-0.5"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

async function loadProducts(): Promise<ProductRow[]> {
  try {
    return await getListedProducts(createAdminClient());
  } catch (err) {
    // DB 장애·컬럼 미존재(마이그레이션 미적용) 등 — 페이지는 준비 중 폴백으로 생존
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
      <section className="border-b" style={{ borderColor: 'var(--jsm-line)' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span
              className="inline-block text-xs font-semibold mb-6 px-2.5 py-1 rounded"
              style={{
                color: 'var(--jsm-accent)',
                background: 'var(--jsm-accent-soft)',
                ...KOR_BODY,
              }}
            >
              완성 소프트웨어
            </span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.2] break-keep mb-5"
              style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
            >
              직접 운영하며 검증한 도구를
              <br />
              그대로 가져가세요.
            </h1>
            <p
              className="text-base sm:text-lg leading-relaxed break-keep"
              style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
            >
              입금 확인 후 마이페이지에서 바로 다운로드할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 카탈로그 / 준비 중 ─── */}
      {hasProducts ? (
        <section className="border-b" style={{ borderColor: 'var(--jsm-line)' }}>
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((p) => {
                const features = (p.features ?? []).slice(0, 3);
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="group flex flex-col rounded-2xl p-7 lg:p-8 border transition-colors duration-200 hover:border-[var(--jsm-accent)]"
                    style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
                  >
                    <h2
                      className="text-xl font-bold break-keep"
                      style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                    >
                      {p.name}
                    </h2>
                    {p.description && (
                      <p
                        className="mt-2.5 text-sm leading-relaxed break-keep"
                        style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
                      >
                        {p.description}
                      </p>
                    )}

                    {features.length > 0 && (
                      <ul className="mt-5 space-y-2">
                        {features.map((f) => (
                          <li
                            key={f}
                            className="flex items-start gap-2 text-sm break-keep"
                            style={{ color: 'var(--jsm-ink)', ...KOR_BODY }}
                          >
                            <span style={{ color: 'var(--jsm-accent)' }}>
                              <CheckMark />
                            </span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-6 pt-5 flex items-center justify-between border-t" style={{ borderColor: 'var(--jsm-line)' }}>
                      <span
                        className="text-lg font-bold"
                        style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                      >
                        ₩{p.price.toLocaleString('ko-KR')}
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 group-hover:text-[var(--jsm-accent-hover)]"
                        style={{ color: 'var(--jsm-accent)', ...KOR_BODY }}
                      >
                        자세히 보기
                        <ArrowRight />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <section className="border-b" style={{ borderColor: 'var(--jsm-line)' }}>
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
            <div
              className="rounded-lg border p-8 text-center"
              style={{
                background: 'var(--jsm-surface-alt)',
                borderColor: 'var(--jsm-line)',
              }}
            >
              <p
                className="text-sm font-semibold mb-3"
                style={{ color: 'var(--jsm-accent)', ...KOR_BODY }}
              >
                출시 준비 중
              </p>
              <p
                className="text-xl sm:text-2xl font-bold mb-4 break-keep"
                style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
              >
                현재 상품을 정비하고 있습니다.
              </p>
              <p
                className="text-sm sm:text-base leading-relaxed break-keep max-w-md mx-auto"
                style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
              >
                로또 분석 도구, 주식 자동매매 유틸리티 등 실제로 운영 중인 도구들을
                구매 가능한 형태로 순차 공개할 예정입니다.
                출시 소식을 먼저 받고 싶다면 아래 링크로 문의해 주세요.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ─── 구매 방식 안내 ─── */}
      <section style={{ background: 'var(--jsm-surface-alt)' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <h2
            className="text-xl sm:text-2xl font-bold mb-10 break-keep"
            style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
          >
            구매 방식
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {HOW.map((step) => (
              <div
                key={step.n}
                className="rounded-lg border p-6"
                style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
              >
                <span
                  className="text-xs font-semibold mb-3 block"
                  style={{ color: 'var(--jsm-accent)', ...KOR_BODY }}
                >
                  {step.n}
                </span>
                <p
                  className="font-bold mb-2 break-keep"
                  style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                >
                  {step.t}
                </p>
                <p
                  className="text-sm leading-relaxed break-keep"
                  style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
                >
                  {step.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t" style={{ borderColor: 'var(--jsm-line)' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/outsourcing#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
              style={{
                background: 'var(--jsm-accent)',
                color: '#ffffff',
                ...KOR_BODY,
              }}
            >
              {hasProducts ? '맞춤 개발 문의' : '출시 소식 받기'}
            </Link>
            <Link
              href="/outsourcing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border text-sm font-semibold transition-colors"
              style={{
                borderColor: 'var(--jsm-line)',
                color: 'var(--jsm-ink-soft)',
                background: 'var(--jsm-surface)',
                ...KOR_BODY,
              }}
            >
              외주 개발 알아보기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
