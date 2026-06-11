'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

// 계좌이체 구매 모달.
// - 열릴 때 세션 확인 → 미로그인이면 로그인 유도(구매 폼 미노출)
// - 로그인 상태: 입금자명 + 약관 동의 → POST /api/orders
// - 주문 금액은 서버가 DB price로 확정한다. 아래 표시 금액은 안내용일 뿐이다.
// 접근성: role="dialog" aria-modal, Esc/backdrop 닫기, TopNav 드로어 패턴 차용.

const KOR_TIGHT = { letterSpacing: '-0.02em' } as const;
const KOR_BODY = { letterSpacing: '-0.01em' } as const;

const BANK = { name: '케이뱅크', account: '100-116-337157', holder: '박재오' };

interface Props {
  product: { id: string; name: string; price: number };
  isOpen: boolean;
  onClose: () => void;
}

type AuthState = 'checking' | 'guest' | 'user';

interface SuccessInfo {
  orderId: string;
  depositorName: string;
  reused: boolean;
}

export default function BankTransferModal({ product, isOpen, onClose }: Props) {
  const [authState, setAuthState] = useState<AuthState>('checking');
  const [depositorName, setDepositorName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<SuccessInfo | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const priceLabel = `₩${product.price.toLocaleString('ko-KR')}`;
  const loginHref = `/login?next=${encodeURIComponent(`/products/${product.id}`)}`;

  // 열릴 때마다 상태 초기화 + 세션 확인
  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    setAuthState('checking');
    setDepositorName('');
    setAgreed(false);
    setSubmitting(false);
    setError('');
    setSuccess(null);

    const supabase = createClient();
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (mounted) setAuthState(data.session?.user ? 'user' : 'guest');
      })
      .catch(() => {
        if (mounted) setAuthState('guest');
      });

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  // Esc 닫기 + body 스크롤 잠금
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  // 초기 포커스: 모달 열릴 때 닫기 버튼으로 포커스 이동
  useEffect(() => {
    if (isOpen) closeBtnRef.current?.focus();
  }, [isOpen]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const name = depositorName.trim();
      if (!name || !agreed || submitting) return;
      setSubmitting(true);
      setError('');
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, depositorName: name }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 401) {
            setSubmitting(false);
            setAuthState('guest');
            return;
          }
          setError(data?.error || '주문 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          setSubmitting(false);
          return;
        }
        setSuccess({
          orderId: data.orderId as string,
          depositorName: name,
          reused: Boolean(data.reused),
        });
      } catch {
        setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setSubmitting(false);
      }
    },
    [depositorName, agreed, submitting, product.id],
  );

  if (!isOpen) return null;

  const canSubmit = depositorName.trim().length > 0 && agreed && !submitting;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(15,23,42,0.45)' }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={success ? '주문 접수 완료' : `${product.name} 구매`}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-xl"
        style={{ background: 'var(--jsm-surface)' }}
      >
        {/* 헤더 */}
        <div
          className="sticky top-0 flex items-center justify-between px-6 h-16 border-b"
          style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
        >
          <h2
            className="text-base font-bold break-keep"
            style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
          >
            {success ? '주문 접수 완료' : '계좌이체 구매'}
          </h2>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="닫기"
            className="p-2 -mr-2 rounded-lg transition-colors duration-150"
            style={{ color: 'var(--jsm-ink-soft)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          {/* 상품 요약 */}
          {!success && (
            <div
              className="rounded-lg border px-4 py-3.5 mb-6 flex items-center justify-between gap-3"
              style={{ background: 'var(--jsm-surface-alt)', borderColor: 'var(--jsm-line)' }}
            >
              <span
                className="text-sm font-semibold break-keep"
                style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
              >
                {product.name}
              </span>
              <span
                className="text-base font-bold shrink-0"
                style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
              >
                {priceLabel}
              </span>
            </div>
          )}

          {/* ── 세션 확인 중 ── */}
          {authState === 'checking' && !success && (
            <div className="flex items-center justify-center py-8">
              <div
                className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--jsm-line)', borderTopColor: 'var(--jsm-accent)' }}
              />
            </div>
          )}

          {/* ── 미로그인 ── */}
          {authState === 'guest' && !success && (
            <div className="text-center py-2">
              <p
                className="text-sm leading-relaxed break-keep mb-5"
                style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
              >
                로그인 후 구매할 수 있습니다.
              </p>
              <Link
                href={loginHref}
                className="inline-flex items-center justify-center w-full py-3 rounded-lg text-sm font-semibold transition-colors"
                style={{ background: 'var(--jsm-accent)', color: '#ffffff', ...KOR_BODY }}
              >
                로그인하기
              </Link>
            </div>
          )}

          {/* ── 로그인 상태: 구매 폼 ── */}
          {authState === 'user' && !success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="depositor-name"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--jsm-ink)', ...KOR_BODY }}
                >
                  입금자명 <span style={{ color: 'var(--jsm-accent)' }}>*</span>
                </label>
                <input
                  id="depositor-name"
                  type="text"
                  value={depositorName}
                  onChange={(e) => setDepositorName(e.target.value)}
                  placeholder="입금하실 분의 성함"
                  required
                  maxLength={40}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--jsm-accent)]"
                  style={{
                    background: 'var(--jsm-surface)',
                    border: '1px solid var(--jsm-line)',
                    color: 'var(--jsm-ink)',
                  }}
                />
                <p className="mt-1.5 text-xs break-keep" style={{ color: 'var(--jsm-ink-faint)', ...KOR_BODY }}>
                  입금자명이 다르면 확인이 늦어질 수 있습니다.
                </p>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  disabled={submitting}
                  className="mt-0.5 w-4 h-4 shrink-0 accent-[var(--jsm-accent)]"
                />
                <span className="text-sm leading-relaxed break-keep" style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}>
                  <Link
                    href="/legal/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: 'var(--jsm-accent)' }}
                  >
                    이용약관
                  </Link>
                  과{' '}
                  <Link
                    href="/legal/refund"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: 'var(--jsm-accent)' }}
                  >
                    환불정책
                  </Link>
                  에 동의합니다.
                </span>
              </label>

              {error && (
                <div
                  className="px-3.5 py-3 rounded-lg text-sm break-keep"
                  style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', ...KOR_BODY }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full py-3 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  background: canSubmit ? 'var(--jsm-accent)' : 'var(--jsm-ink-faint)',
                  color: '#ffffff',
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  ...KOR_BODY,
                }}
              >
                {submitting ? '처리 중...' : '주문하기'}
              </button>
            </form>
          )}

          {/* ── 성공 화면 ── */}
          {success && (
            <div>
              <p
                className="text-lg font-bold mb-2 break-keep"
                style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
              >
                {success.reused ? '이미 접수된 주문이 있습니다' : '주문이 접수되었습니다'}
              </p>
              <p
                className="text-sm leading-relaxed break-keep mb-5"
                style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
              >
                아래 계좌로 입금해 주세요. 입금이 확인되면 마이페이지에서 다운로드할 수 있습니다.
              </p>

              <dl
                className="rounded-lg border divide-y mb-5"
                style={{ borderColor: 'var(--jsm-line)', background: 'var(--jsm-surface-alt)' }}
              >
                {[
                  { k: '입금 계좌', v: `${BANK.name} ${BANK.account}` },
                  { k: '예금주', v: BANK.holder },
                  { k: '입금 금액', v: priceLabel },
                  { k: '입금자명', v: success.depositorName },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                    style={{ borderColor: 'var(--jsm-line)' }}
                  >
                    <dt className="text-xs shrink-0" style={{ color: 'var(--jsm-ink-faint)', ...KOR_BODY }}>
                      {row.k}
                    </dt>
                    <dd
                      className="text-sm font-semibold text-right break-all"
                      style={{ color: 'var(--jsm-ink)', ...KOR_BODY }}
                    >
                      {row.v}
                    </dd>
                  </div>
                ))}
              </dl>

              <p
                className="text-xs leading-relaxed break-keep mb-5"
                style={{ color: 'var(--jsm-ink-faint)', ...KOR_BODY }}
              >
                입금 확인 후 마이페이지 → 내 제품에서 다운로드할 수 있습니다. 최대 24시간 내 처리됩니다.
              </p>

              <Link
                href="/mypage?tab=products"
                className="inline-flex items-center justify-center w-full py-3 rounded-lg text-sm font-semibold transition-colors"
                style={{ background: 'var(--jsm-accent)', color: '#ffffff', ...KOR_BODY }}
              >
                마이페이지로
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
