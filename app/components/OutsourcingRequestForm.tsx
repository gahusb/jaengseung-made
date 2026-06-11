'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/gtag';

// 외주 의뢰용 4단계 폼.
// ① 프로젝트 유형 → ② 예산·일정 → ③ 상세 내용 → ④ 연락처
// 각 단계 검증을 통과해야 다음으로 진행한다. 마지막에 POST /api/contact.
// 마운트 시 로그인 사용자면 이메일을 자동 채운다(수정 가능).
// 기존 ContactForm.tsx는 보존하고, 이 폼이 /outsourcing #contact에서 대체한다.
// 디자인: --jsm-* 토큰만 사용. gradient/blur/보라/이모지 금지.

const KOR_TIGHT = { letterSpacing: '-0.02em' } as const;
const KOR_BODY = { letterSpacing: '-0.01em' } as const;

const INPUT_STYLE = {
  background: 'var(--jsm-surface)',
  border: '1px solid var(--jsm-line)',
  color: 'var(--jsm-ink)',
} as const;

const PROJECT_TYPES = [
  '웹 서비스',
  '웹사이트',
  '업무 자동화',
  'API·백엔드',
  '봇 개발',
  'AI 연동',
  '기타',
] as const;

const BUDGETS = [
  '100만원 미만',
  '100~300만원',
  '300~1,000만원',
  '1,000만원 이상',
  '미정',
] as const;

const TIMELINES = ['1개월 내', '1~3개월', '3개월 이상', '미정'] as const;

const STEPS = [
  { n: 1, label: '프로젝트 유형' },
  { n: 2, label: '예산·일정' },
  { n: 3, label: '상세 내용' },
  { n: 4, label: '연락처' },
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SuccessInfo {
  trackUrl: string | null;
}

export default function OutsourcingRequestForm() {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<SuccessInfo | null>(null);

  const headingRef = useRef<HTMLElement | null>(null);
  const setHeadingRef = useCallback((el: HTMLElement | null) => {
    headingRef.current = el;
  }, []);
  const firstRender = useRef(true);

  // 로그인 사용자 이메일 자동 채움 (BankTransferModal 세션 확인 패턴)
  useEffect(() => {
    let mounted = true;
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => {
        const userEmail = data?.user?.email;
        if (mounted && userEmail) {
          setEmail((prev) => (prev ? prev : userEmail));
        }
      })
      .catch(() => {
        /* 비로그인 — 무시 */
      });
    return () => {
      mounted = false;
    };
  }, []);

  // 단계 전환 시 헤딩으로 포커스 이동 (초기 마운트는 제외)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, success]);

  const trimmedMessage = message.trim();
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  const stepValid = (s: number): boolean => {
    switch (s) {
      case 1:
        return projectType !== '';
      case 2:
        return budget !== '' && timeline !== '';
      case 3:
        return trimmedMessage.length >= 10;
      case 4:
        return trimmedName !== '' && EMAIL_RE.test(trimmedEmail);
      default:
        return false;
    }
  };

  const goNext = useCallback(() => {
    if (!stepValid(step)) return;
    setError('');
    setStep((s) => Math.min(s + 1, STEPS.length));
  }, [step]);

  const goPrev = useCallback(() => {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stepValid(4) || submitting) return;
      setSubmitting(true);
      setError('');
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: trimmedName,
            phone: phone.trim(),
            email: trimmedEmail,
            service: `외주 개발 문의 — ${projectType}`,
            message: trimmedMessage,
            projectType,
            budget,
            timeline,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(
            data?.error || '의뢰 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
          );
          setSubmitting(false);
          return;
        }
        trackEvent('generate_lead', {
          event_category: 'contact',
          event_label: `외주 개발 문의 — ${projectType}`,
        });
        setSuccess({ trackUrl: typeof data?.trackUrl === 'string' ? data.trackUrl : null });
      } catch {
        setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        setSubmitting(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      submitting,
      trimmedName,
      trimmedEmail,
      trimmedMessage,
      phone,
      projectType,
      budget,
      timeline,
    ]
  );

  // ── 완료 화면 ──────────────────────────────────────────────
  if (success) {
    return (
      <div>
        <h3
          ref={setHeadingRef}
          tabIndex={-1}
          className="text-xl font-bold break-keep outline-none"
          style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
        >
          의뢰가 접수되었습니다
        </h3>
        <p
          className="mt-3 text-sm leading-relaxed break-keep"
          style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
        >
          영업일 2일 내 회신드립니다.
        </p>

        {success.trackUrl ? (
          <div className="mt-7">
            <Link
              href={success.trackUrl}
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-semibold text-white transition-colors hover:bg-[var(--jsm-accent-hover)]"
              style={{ background: 'var(--jsm-accent)', ...KOR_BODY }}
            >
              진행 상태 확인하기
              <Arrow />
            </Link>
            <p
              className="mt-3 text-xs leading-relaxed break-keep"
              style={{ color: 'var(--jsm-ink-faint)', ...KOR_BODY }}
            >
              추적 링크를 이메일로도 보내드렸습니다.
            </p>
          </div>
        ) : null}
      </div>
    );
  }

  const isLast = step === STEPS.length;
  const canAdvance = stepValid(step);

  return (
    <div>
      {/* 진행 표시기 */}
      <ol className="flex items-center gap-2 mb-7" aria-label="진행 단계">
        {STEPS.map((s, i) => {
          const state =
            s.n < step ? 'done' : s.n === step ? 'current' : 'upcoming';
          return (
            <li key={s.n} className="flex items-center gap-2 min-w-0">
              <span
                className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 transition-colors"
                style={
                  state === 'upcoming'
                    ? { background: 'var(--jsm-surface-alt)', color: 'var(--jsm-ink-faint)' }
                    : { background: 'var(--jsm-accent)', color: '#ffffff' }
                }
                aria-current={state === 'current' ? 'step' : undefined}
              >
                {s.n}
              </span>
              <span
                className="text-xs font-semibold truncate hidden sm:inline"
                style={{
                  color:
                    state === 'upcoming' ? 'var(--jsm-ink-faint)' : 'var(--jsm-ink)',
                  ...KOR_BODY,
                }}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  className="w-4 sm:w-6 h-px shrink-0"
                  style={{ background: 'var(--jsm-line)' }}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>

      <form onSubmit={handleSubmit}>
        {/* ── 단계 ① 프로젝트 유형 ── */}
        {step === 1 && (
          <fieldset>
            <legend
              ref={setHeadingRef}
              tabIndex={-1}
              className="text-lg font-bold break-keep outline-none mb-1"
              style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
            >
              어떤 프로젝트인가요?
            </legend>
            <p
              className="text-sm leading-relaxed break-keep mb-5"
              style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
            >
              가장 가까운 유형을 하나 선택해주세요.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROJECT_TYPES.map((t) => {
                const selected = projectType === t;
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setProjectType(t)}
                    aria-pressed={selected}
                    className="px-4 py-3.5 rounded-lg text-sm font-semibold text-center break-keep transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--jsm-accent)]"
                    style={{
                      border: selected
                        ? '1px solid var(--jsm-accent)'
                        : '1px solid var(--jsm-line)',
                      background: selected
                        ? 'var(--jsm-accent-soft)'
                        : 'var(--jsm-surface)',
                      color: selected ? 'var(--jsm-accent)' : 'var(--jsm-ink)',
                      ...KOR_BODY,
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* ── 단계 ② 예산·일정 ── */}
        {step === 2 && (
          <div>
            <h3
              ref={setHeadingRef}
              tabIndex={-1}
              className="text-lg font-bold break-keep outline-none mb-1"
              style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
            >
              예산과 일정을 알려주세요
            </h3>
            <p
              className="text-sm leading-relaxed break-keep mb-5"
              style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
            >
              대략적인 범위면 충분합니다. 정해지지 않았다면 미정을 선택하세요.
            </p>

            <fieldset className="mb-6">
              <legend
                className="text-sm font-semibold mb-2.5"
                style={{ color: 'var(--jsm-ink)', ...KOR_BODY }}
              >
                예산
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {BUDGETS.map((b) => (
                  <Chip
                    key={b}
                    label={b}
                    selected={budget === b}
                    onClick={() => setBudget(b)}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend
                className="text-sm font-semibold mb-2.5"
                style={{ color: 'var(--jsm-ink)', ...KOR_BODY }}
              >
                희망 일정
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {TIMELINES.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    selected={timeline === t}
                    onClick={() => setTimeline(t)}
                  />
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {/* ── 단계 ③ 상세 내용 ── */}
        {step === 3 && (
          <div>
            <h3
              ref={setHeadingRef}
              tabIndex={-1}
              className="text-lg font-bold break-keep outline-none mb-1"
              style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
            >
              자세히 들려주세요
            </h3>
            <p
              className="text-sm leading-relaxed break-keep mb-5"
              style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
            >
              구체적일수록 정확한 견적이 가능합니다. 최소 10자 이상 작성해주세요.
            </p>
            <label htmlFor="req-message" className="sr-only">
              상세 내용
            </label>
            <textarea
              id="req-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={7}
              maxLength={5000}
              placeholder="만들고 싶은 것, 참고 서비스, 현재 상황을 자유롭게 적어주세요. 기획이 정리되지 않았어도 괜찮습니다."
              className="w-full px-3.5 py-3 rounded-lg text-sm leading-relaxed resize-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--jsm-accent)]"
              style={{
                ...INPUT_STYLE,
                ...KOR_BODY,
              }}
            />
            <p
              className="mt-1.5 text-xs"
              style={{ color: 'var(--jsm-ink-faint)', ...KOR_BODY }}
            >
              {trimmedMessage.length}/10자 이상
            </p>
          </div>
        )}

        {/* ── 단계 ④ 연락처 ── */}
        {step === 4 && (
          <div>
            <h3
              ref={setHeadingRef}
              tabIndex={-1}
              className="text-lg font-bold break-keep outline-none mb-1"
              style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
            >
              어디로 회신드릴까요?
            </h3>
            <p
              className="text-sm leading-relaxed break-keep mb-5"
              style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
            >
              영업일 2일 내에 회신드립니다.
            </p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="req-name"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--jsm-ink)', ...KOR_BODY }}
                >
                  이름 <span style={{ color: 'var(--jsm-accent)' }}>*</span>
                </label>
                <input
                  id="req-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={40}
                  disabled={submitting}
                  placeholder="홍길동"
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--jsm-accent)]"
                  style={INPUT_STYLE}
                />
              </div>

              <div>
                <label
                  htmlFor="req-email"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--jsm-ink)', ...KOR_BODY }}
                >
                  이메일 <span style={{ color: 'var(--jsm-accent)' }}>*</span>
                </label>
                <input
                  id="req-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={120}
                  disabled={submitting}
                  placeholder="example@email.com"
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--jsm-accent)]"
                  style={INPUT_STYLE}
                />
              </div>

              <div>
                <label
                  htmlFor="req-phone"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--jsm-ink)', ...KOR_BODY }}
                >
                  연락처
                </label>
                <input
                  id="req-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={40}
                  disabled={submitting}
                  placeholder="010-0000-0000 (선택)"
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--jsm-accent)]"
                  style={INPUT_STYLE}
                />
              </div>
            </div>
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div
            className="mt-5 px-3.5 py-3 rounded-lg text-sm break-keep"
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              ...KOR_BODY,
            }}
            role="alert"
          >
            {error}
          </div>
        )}

        {/* 내비게이션 */}
        <div className="mt-8 flex items-center gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={goPrev}
              disabled={submitting}
              className="px-5 py-3 rounded-lg text-sm font-semibold border transition-colors hover:bg-[var(--jsm-surface-alt)] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                ...INPUT_STYLE,
                borderColor: 'var(--jsm-line)',
                ...KOR_BODY,
              }}
            >
              이전
            </button>
          )}

          {isLast ? (
            <button
              type="submit"
              disabled={!canAdvance || submitting}
              className="flex-1 py-3 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{
                background: !canAdvance || submitting
                  ? 'var(--jsm-ink-faint)'
                  : 'var(--jsm-accent)',
                cursor: !canAdvance || submitting ? 'not-allowed' : 'pointer',
                ...KOR_BODY,
              }}
            >
              {submitting ? '보내는 중...' : '의뢰 보내기'}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              disabled={!canAdvance}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{
                background: canAdvance ? 'var(--jsm-accent)' : 'var(--jsm-ink-faint)',
                cursor: canAdvance ? 'pointer' : 'not-allowed',
                ...KOR_BODY,
              }}
            >
              다음
              <Arrow />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// ── 칩 버튼 (예산·일정 단일 선택) ──────────────────────────────
function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="px-4 py-2.5 rounded-lg text-sm font-semibold break-keep transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--jsm-accent)]"
      style={{
        border: selected ? '1px solid var(--jsm-accent)' : '1px solid var(--jsm-line)',
        background: selected ? 'var(--jsm-accent-soft)' : 'var(--jsm-surface)',
        color: selected ? 'var(--jsm-accent)' : 'var(--jsm-ink)',
        ...KOR_BODY,
      }}
    >
      {label}
    </button>
  );
}

function Arrow() {
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
