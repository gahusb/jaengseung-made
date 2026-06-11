import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  REQUEST_STATUS,
  TIMELINE_STEPS,
  timelineIndex,
  isRequestStatus,
  type RequestStatus,
} from '@/lib/request-status';

// 비회원 의뢰 추적 페이지 (서버 컴포넌트).
// 고객이 이메일의 추적 링크로 로그인 없이 의뢰 진행 상태를 확인한다.
// PublicShell(TopNav+푸터) 안에서 렌더되므로 여기서는 콘텐츠 섹션만 그린다.
// API(app/api/track/[token])와 동일한 조회를 페이지에서 직접 수행한다.
// PII(이메일·전화·메시지 본문)는 select에서 제외하며, 모든 DB 예외는 notFound()로 폴백한다.

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '의뢰 진행 상태',
  robots: { index: false, follow: false },
};

const KOR_TIGHT = { letterSpacing: '-0.02em' } as const;
const KOR_BODY = { letterSpacing: '-0.01em' } as const;

interface Props {
  params: Promise<{ token: string }>;
}

interface TrackRequest {
  id: string;
  name: string | null;
  service: string | null;
  status: string;
  project_type: string | null;
  budget: string | null;
  timeline: string | null;
  created_at: string;
  updated_at: string | null;
}

interface TrackQuote {
  public_token: string;
  title: string | null;
  status: string;
  valid_until: string | null;
}

const QUOTE_BADGE: Record<string, { label: string; tone: 'accent' | 'muted' | 'danger' }> = {
  sent: { label: '확인 대기', tone: 'accent' },
  accepted: { label: '수락됨', tone: 'muted' },
  rejected: { label: '거절됨', tone: 'danger' },
};

async function loadTrack(
  token: string,
): Promise<{ request: TrackRequest; quote: TrackQuote | null } | null> {
  if (!token || token.length > 64) return null;
  try {
    const admin = createAdminClient();
    const { data: request, error } = await admin
      .from('contact_requests')
      .select('id, name, service, status, project_type, budget, timeline, created_at, updated_at')
      .eq('public_token', token)
      .maybeSingle();
    if (error || !request) return null;

    const { data: quote } = await admin
      .from('quotes')
      .select('public_token, title, status, valid_until')
      .eq('contact_request_id', request.id)
      .in('status', ['sent', 'accepted', 'rejected'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return { request: request as TrackRequest, quote: (quote as TrackQuote) ?? null };
  } catch (err) {
    // DB 장애·마이그레이션 미적용(42703 등) — 추적 페이지는 404로 폴백
    console.error('[Track] loadTrack failed:', err);
    return null;
  }
}

function fmtDate(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

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

/** 진행 단계 타임라인 — 모바일 세로 / 데스크톱 가로 */
function Timeline({ current }: { current: number }) {
  return (
    <ol className="flex flex-col md:flex-row">
      {TIMELINE_STEPS.map((step, i) => {
        const isDone = i < current;
        const isCurrent = i === current;
        const isLast = i === TIMELINE_STEPS.length - 1;
        const label = REQUEST_STATUS[step].label;

        // 이 단계로 들어오는 연결선이 채워졌는지(이전 단계가 지났는지)
        const lineFilled = i <= current;

        return (
          <li
            key={step}
            className="flex md:flex-col md:flex-1 md:items-center md:text-center"
          >
            {/* 모바일: 세로 마커+연결선 / 데스크톱: 가로 */}
            <div className="flex flex-col items-center md:flex-row md:w-full md:items-center">
              {/* 데스크톱 좌측 연결선 (가로) */}
              {i > 0 && (
                <span
                  className="hidden md:block h-0.5 flex-1"
                  style={{ background: lineFilled ? 'var(--jsm-accent)' : 'var(--jsm-line)' }}
                  aria-hidden
                />
              )}

              {/* 마커 원 */}
              <span
                className="relative z-10 flex items-center justify-center rounded-full shrink-0 transition-colors"
                style={{
                  width: 32,
                  height: 32,
                  background: isDone
                    ? 'var(--jsm-accent)'
                    : isCurrent
                      ? 'var(--jsm-surface)'
                      : 'var(--jsm-surface)',
                  border: isCurrent
                    ? '2px solid var(--jsm-accent)'
                    : isDone
                      ? '2px solid var(--jsm-accent)'
                      : '2px solid var(--jsm-line)',
                  color: isDone ? '#ffffff' : 'transparent',
                  boxShadow: isCurrent ? '0 0 0 4px var(--jsm-accent-soft)' : 'none',
                }}
                aria-hidden
              >
                {isDone ? (
                  <CheckIcon />
                ) : (
                  <span
                    className="rounded-full"
                    style={{
                      width: 8,
                      height: 8,
                      background: isCurrent ? 'var(--jsm-accent)' : 'var(--jsm-line)',
                    }}
                  />
                )}
              </span>

              {/* 데스크톱 우측 연결선 (가로) */}
              {!isLast && (
                <span
                  className="hidden md:block h-0.5 flex-1"
                  style={{ background: i < current ? 'var(--jsm-accent)' : 'var(--jsm-line)' }}
                  aria-hidden
                />
              )}

              {/* 모바일 세로 연결선 */}
              {!isLast && (
                <span
                  className="md:hidden w-0.5 flex-1 my-1"
                  style={{
                    minHeight: 28,
                    background: i < current ? 'var(--jsm-accent)' : 'var(--jsm-line)',
                  }}
                  aria-hidden
                />
              )}
            </div>

            {/* 라벨 */}
            <div className="pl-4 pb-6 md:pl-0 md:pb-0 md:mt-3">
              <span
                className="text-sm break-keep"
                style={{
                  color: isDone || isCurrent ? 'var(--jsm-ink)' : 'var(--jsm-ink-faint)',
                  fontWeight: isCurrent ? 700 : 500,
                  ...KOR_BODY,
                }}
              >
                {label}
              </span>
              {isCurrent && (
                <span
                  className="block text-xs mt-0.5"
                  style={{ color: 'var(--jsm-accent)', ...KOR_BODY }}
                >
                  진행 중
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default async function TrackPage({ params }: Props) {
  const { token } = await params;
  const data = await loadTrack(token);
  if (!data) notFound();

  const { request, quote } = data;
  const status: RequestStatus = isRequestStatus(request.status) ? request.status : 'pending';
  const current = timelineIndex(status);
  const receivedAt = fmtDate(request.created_at);

  const info: { label: string; value: string }[] = [];
  if (request.project_type) info.push({ label: '프로젝트 유형', value: request.project_type });
  if (request.budget) info.push({ label: '예산', value: request.budget });
  if (request.timeline) info.push({ label: '희망 일정', value: request.timeline });

  const quoteBadge = quote ? QUOTE_BADGE[quote.status] ?? null : null;
  const quoteValidUntil = quote ? fmtDate(quote.valid_until) : null;

  return (
    <section style={{ background: 'var(--jsm-bg)' }}>
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        {/* ─── 헤더 ─── */}
        <header className="pb-8 border-b" style={{ borderColor: 'var(--jsm-line)' }}>
          <span
            className="inline-block text-xs font-semibold mb-4 px-2.5 py-1 rounded"
            style={{ color: 'var(--jsm-accent)', background: 'var(--jsm-accent-soft)', ...KOR_BODY }}
          >
            의뢰 진행 상태
          </span>
          <h1
            className="text-2xl sm:text-3xl font-bold break-keep"
            style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
          >
            {request.service ?? '의뢰하신 프로젝트'}
          </h1>
          {receivedAt && (
            <p className="mt-3 text-sm" style={{ color: 'var(--jsm-ink-faint)', ...KOR_BODY }}>
              {receivedAt} 접수
            </p>
          )}
        </header>

        {/* ─── 진행 상태 ─── */}
        <div className="py-10 border-b" style={{ borderColor: 'var(--jsm-line)' }}>
          {status === 'cancelled' ? (
            <div
              className="rounded-2xl border px-6 py-8 text-center"
              style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
            >
              <h2
                className="text-lg font-bold break-keep"
                style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
              >
                취소된 의뢰입니다
              </h2>
              <p
                className="mt-2 text-sm leading-relaxed break-keep"
                style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
              >
                이 의뢰는 취소 처리되었습니다. 다시 진행을 원하시면 회신해 주세요.
              </p>
            </div>
          ) : (
            <>
              {status === 'on_hold' && (
                <div
                  className="mb-8 rounded-xl border px-4 py-3.5"
                  style={{ background: 'var(--jsm-surface-alt)', borderColor: 'var(--jsm-line)' }}
                >
                  <p
                    className="text-sm leading-relaxed break-keep"
                    style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
                  >
                    현재 보류 중입니다 — 조건 조정이 필요하면 회신 주세요.
                  </p>
                </div>
              )}
              <Timeline current={current} />
            </>
          )}
        </div>

        {/* ─── 의뢰 정보 ─── */}
        {info.length > 0 && (
          <div className="py-8 border-b" style={{ borderColor: 'var(--jsm-line)' }}>
            <h2
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ color: 'var(--jsm-accent)' }}
            >
              의뢰 정보
            </h2>
            <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {info.map((item) => (
                <div key={item.label}>
                  <dt
                    className="text-xs mb-1"
                    style={{ color: 'var(--jsm-ink-faint)', ...KOR_BODY }}
                  >
                    {item.label}
                  </dt>
                  <dd
                    className="text-sm font-medium break-keep"
                    style={{ color: 'var(--jsm-ink)', ...KOR_BODY }}
                  >
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* ─── 견적 카드 ─── */}
        {quote && (
          <div className="py-8 border-b" style={{ borderColor: 'var(--jsm-line)' }}>
            <div
              className="rounded-2xl border p-6 lg:p-7"
              style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-accent)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: 'var(--jsm-accent)' }}
                  >
                    견적서가 도착했습니다
                  </p>
                  <h2
                    className="text-lg font-bold break-keep"
                    style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                  >
                    {quote.title ?? '프로젝트 견적서'}
                  </h2>
                </div>
                {quoteBadge && (
                  <span
                    className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={
                      quoteBadge.tone === 'accent'
                        ? { color: 'var(--jsm-accent)', background: 'var(--jsm-accent-soft)' }
                        : quoteBadge.tone === 'danger'
                          ? { color: '#b91c1c', background: '#fee2e2' }
                          : { color: 'var(--jsm-ink-soft)', background: 'var(--jsm-surface-alt)' }
                    }
                  >
                    {quoteBadge.label}
                  </span>
                )}
              </div>

              {quoteValidUntil && (
                <p className="mt-3 text-sm" style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}>
                  유효기간 {quoteValidUntil}까지
                </p>
              )}

              <Link
                href={`/quote/${quote.public_token}`}
                className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-white transition-colors duration-150 hover:bg-[var(--jsm-accent-hover)]"
                style={{ background: 'var(--jsm-accent)', ...KOR_BODY }}
              >
                견적서 보기
                <ArrowRight />
              </Link>
            </div>
          </div>
        )}

        {/* ─── 하단 안내 ─── */}
        <div className="pt-8">
          <p
            className="text-sm leading-relaxed break-keep"
            style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
          >
            문의사항은{' '}
            <a
              href="mailto:bgg8988@gmail.com"
              className="font-medium underline"
              style={{ color: 'var(--jsm-accent)' }}
            >
              bgg8988@gmail.com
            </a>{' '}
            또는 접수하신 메일에 회신해 주세요.
          </p>
        </div>
      </div>
    </section>
  );
}
