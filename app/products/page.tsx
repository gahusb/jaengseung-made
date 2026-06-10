import Link from 'next/link';
import type { Metadata } from 'next';

// TODO(Phase 2): products 테이블 연동 후 동적 카탈로그로 교체 예정.
// 현재는 404 방지용 정적 스텁 페이지입니다.

export const metadata: Metadata = {
  title: '완성 소프트웨어',
  description:
    '쟁승메이드가 직접 운영하며 검증한 완성 소프트웨어 목록. 계좌이체 결제 후 입금 확인 즉시 마이페이지에서 다운로드할 수 있습니다.',
};

const KOR_TIGHT = { letterSpacing: '-0.02em' } as const;
const KOR_BODY = { letterSpacing: '-0.01em' } as const;

const HOW = [
  { n: '01', t: '계좌이체 결제', d: '안내된 계좌로 입금합니다. 이체 확인 후 수동으로 승인합니다.' },
  { n: '02', t: '입금 확인', d: '입금이 확인되면 메일로 안내해 드립니다. 보통 당일 처리됩니다.' },
  { n: '03', t: '마이페이지 다운로드', d: '마이페이지에서 구매 내역을 확인하고 파일을 내려받습니다.' },
];

export default function ProductsPage() {
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
              직접 운영하며 검증한
              <br />
              도구들을 준비하고 있습니다.
            </h1>
            <p
              className="text-base sm:text-lg leading-relaxed break-keep"
              style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
            >
              입금 확인 후 바로 다운로드할 수 있는 형태로 제공됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 출시 준비 중 안내 ─── */}
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
              출시 소식 받기
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
