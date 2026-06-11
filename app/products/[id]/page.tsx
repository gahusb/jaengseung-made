import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { getProductById, type ProductRow } from '@/lib/supabase/product-files';
import BuySection from './BuySection';

// 완성 소프트웨어 상세 (서버 컴포넌트).
// 비노출/비활성/존재하지 않음/DB 예외 → notFound() 로 일관 처리해 500을 내지 않는다.

export const dynamic = 'force-dynamic';

const KOR_TIGHT = { letterSpacing: '-0.02em' } as const;
const KOR_BODY = { letterSpacing: '-0.01em' } as const;

interface Props {
  params: Promise<{ id: string }>;
}

async function loadProduct(id: string): Promise<ProductRow | null> {
  try {
    return await getProductById(createAdminClient(), id);
  } catch (err) {
    // DB 장애·마이그레이션 미적용 등 — 상세 페이지는 404로 폴백
    console.error('[ProductDetail] getProductById failed:', err);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await loadProduct(id);
  if (!product || !product.is_listed || !product.is_active) {
    return { title: '완성 소프트웨어' };
  }
  return {
    title: product.name,
    description:
      product.description ??
      `${product.name} — 쟁승메이드가 직접 운영하며 검증한 완성 소프트웨어. 입금 확인 후 마이페이지에서 즉시 다운로드.`,
  };
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

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await loadProduct(id);

  if (!product || !product.is_listed || !product.is_active) {
    notFound();
  }

  const features = product.features ?? [];
  const longText = product.description_long ?? product.description ?? '';

  return (
    <section style={{ background: 'var(--jsm-bg)' }}>
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        {/* 브레드크럼 */}
        <nav className="mb-8" aria-label="breadcrumb">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[var(--jsm-accent)]"
            style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m15 18-6-6 6-6" />
            </svg>
            소프트웨어
          </Link>
        </nav>

        {/* 제품명 · 가격 */}
        <header className="pb-8 border-b" style={{ borderColor: 'var(--jsm-line)' }}>
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold break-keep"
            style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
          >
            {product.name}
          </h1>
          <p
            className="mt-4 text-2xl font-bold"
            style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
          >
            ₩{product.price.toLocaleString('ko-KR')}
          </p>
        </header>

        {/* 상세 설명 */}
        {longText && (
          <div className="py-8 border-b" style={{ borderColor: 'var(--jsm-line)' }}>
            <p
              className="text-base leading-relaxed break-keep whitespace-pre-line"
              style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
            >
              {longText}
            </p>
          </div>
        )}

        {/* 기능 리스트 */}
        {features.length > 0 && (
          <div className="py-8 border-b" style={{ borderColor: 'var(--jsm-line)' }}>
            <h2
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ color: 'var(--jsm-accent)' }}
            >
              주요 기능
            </h2>
            <ul className="space-y-3">
              {features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-sm sm:text-base break-keep"
                  style={{ color: 'var(--jsm-ink)', ...KOR_BODY }}
                >
                  <span style={{ color: 'var(--jsm-accent)' }}>
                    <CheckMark />
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 구매 안내 + CTA */}
        <div className="pt-8">
          <div
            className="rounded-lg border px-4 py-3.5 mb-6"
            style={{ background: 'var(--jsm-surface-alt)', borderColor: 'var(--jsm-line)' }}
          >
            <p className="text-sm leading-relaxed break-keep" style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}>
              구매 후 마이페이지에서 즉시 다운로드 (입금 확인 후).
            </p>
          </div>

          <BuySection
            product={{ id: product.id, name: product.name, price: product.price }}
          />

          <p className="mt-5 text-xs break-keep" style={{ color: 'var(--jsm-ink-faint)', ...KOR_BODY }}>
            구매 전{' '}
            <Link href="/legal/refund" className="underline" style={{ color: 'var(--jsm-ink-soft)' }}>
              환불 정책
            </Link>
            을 확인해 주세요.
          </p>
        </div>
      </div>
    </section>
  );
}
