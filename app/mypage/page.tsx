'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import TelegramGuideModal from '@/app/components/TelegramGuideModal';
import { PACK_TIER_NAMES, extractPackTier, type PackTier } from '@/lib/pack-assets';
import type { PackFile } from '@/lib/supabase/pack-files';
import { KAKAO_OPENCHAT_URL } from '@/lib/contact';

// 마이페이지 — 4탭 재구성 (프로필 / 내 의뢰 / 내 제품 / 주문 내역).
// PublicShell(TopNav)이 상단 내비·로그아웃을 제공하므로 여기서는 콘텐츠만 렌더한다.
// 디자인은 메인(/)·외주(/outsourcing) 페이지의 --jsm-* 토큰·타이포 패턴과 일관되게 구성한다.

const KOR_TIGHT = { letterSpacing: '-0.02em' } as const;
const KOR_BODY = { letterSpacing: '-0.01em' } as const;

type Tab = 'profile' | 'requests' | 'products' | 'orders';
type TelegramLinkState = 'idle' | 'generating' | 'waiting' | 'disconnecting';

// 구 탭 키 → 새 탭 키 매핑. 사주/구독/프로젝트 등 폐지 탭은 프로필로 폴백.
function resolveTab(raw: string | null): Tab {
  switch (raw) {
    case 'requests':
      return 'requests';
    case 'products':
    case 'packs':
      return 'products';
    case 'orders':
    case 'payments':
      return 'orders';
    case 'profile':
    case 'saju':
    case 'subscription':
    case 'projects':
      return 'profile';
    default:
      return 'requests';
  }
}

interface Payment {
  id: string;
  created_at: string;
  amount: number;
  status: string;
  product_name: string;
}

interface Order {
  id: string;
  created_at: string;
  service: string;
  message: string;
  status: string;
}

function MyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(() => resolveTab(searchParams.get('tab')));
  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [packFiles, setPackFiles] = useState<PackFile[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);

  // 텔레그램 연동 상태
  const [telegramChatId, setTelegramChatId] = useState<string | null>(null);
  const [telegramLinkState, setTelegramLinkState] = useState<TelegramLinkState>('idle');
  const [telegramDeepLink, setTelegramDeepLink] = useState<string>('');
  const [telegramLinkExpiry, setTelegramLinkExpiry] = useState<string>('');
  const [showTelegramGuide, setShowTelegramGuide] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // 결제 내역 조회
      const { data: pay } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      setPayments(pay || []);

      // 의뢰 내역 조회
      const { data: ord } = await supabase
        .from('contact_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      setOrders(ord || []);

      // 텔레그램 chat_id 조회
      const { data: profile } = await supabase
        .from('profiles')
        .select('telegram_chat_id')
        .eq('id', user.id)
        .maybeSingle();
      setTelegramChatId(profile?.telegram_chat_id ?? null);

      // 구매한 팩 자료 파일 조회
      const filesRes = await fetch('/api/packs/list-mine');
      if (filesRes.ok) {
        const { files } = await filesRes.json();
        setPackFiles(files ?? []);
      }

      setLoading(false);
    }
    init();
  }, []);

  // ── 텔레그램 연결 ──
  const handleTelegramConnect = async () => {
    setTelegramLinkState('generating');
    try {
      const res = await fetch('/api/telegram/connect', { method: 'POST' });
      if (!res.ok) throw new Error('API_ERROR');
      const data = await res.json();
      setTelegramDeepLink(data.deepLink);
      setTelegramLinkExpiry(new Date(data.expiresAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
      setTelegramLinkState('waiting');

      // 15분 후 자동으로 idle 복귀
      setTimeout(() => setTelegramLinkState('idle'), 15 * 60 * 1000);
    } catch {
      setTelegramLinkState('idle');
      alert('연결 코드 발급 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 연결 후 상태 새로고침 (버튼 클릭 시)
  const handleTelegramRefresh = async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('telegram_chat_id')
      .eq('id', user!.id)
      .maybeSingle();
    const chatId = profile?.telegram_chat_id ?? null;
    setTelegramChatId(chatId);
    if (chatId) setTelegramLinkState('idle');
  };

  // ── 텔레그램 연결 해제 ──
  const handleTelegramDisconnect = async () => {
    if (!confirm('텔레그램 연결을 해제하시겠습니까?')) return;
    setTelegramLinkState('disconnecting');
    try {
      await fetch('/api/telegram/connect', { method: 'DELETE' });
      setTelegramChatId(null);
      setTelegramDeepLink('');
    } catch {
      alert('연결 해제 중 오류가 발생했습니다.');
    }
    setTelegramLinkState('idle');
  };

  async function handleDownload(fileId: string) {
    setDownloading(fileId);
    try {
      const res = await fetch('/api/packs/sign-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? '링크 발급 실패');
      }
      window.location.href = data.url;
    } catch (e) {
      alert(e instanceof Error ? e.message : '다운로드 준비 중 오류가 발생했습니다');
    } finally {
      setDownloading(null);
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center"
        style={{ background: 'var(--jsm-bg)' }}
      >
        <div
          className="w-7 h-7 rounded-full animate-spin"
          style={{ border: '2px solid var(--jsm-accent)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (!user) return null;

  // contact_requests 중 팩 주문만 추려 '내 제품' 탭에서 다운로드 노출
  const packOrders = orders
    .map((o) => ({ order: o, tier: extractPackTier(o.service) }))
    .filter((x): x is { order: Order; tier: PackTier } => x.tier !== null);

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'profile', label: '프로필' },
    { key: 'requests', label: '내 의뢰', count: orders.length || undefined },
    { key: 'products', label: '내 제품', count: packOrders.length || undefined },
    { key: 'orders', label: '주문 내역', count: (orders.length + payments.length) || undefined },
  ];

  function selectTab(key: Tab) {
    setTab(key);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', key);
    router.replace(`/mypage?${params.toString()}`, { scroll: false });
  }

  return (
    <div style={{ background: 'var(--jsm-bg)' }} className="min-h-[calc(100vh-4rem)]">
      {/* 텔레그램 가이드 모달 */}
      {showTelegramGuide && (
        <TelegramGuideModal onClose={() => setShowTelegramGuide(false)} />
      )}

      {/* ─── 페이지 헤더 ─── */}
      <div className="border-b" style={{ borderColor: 'var(--jsm-line)', background: 'var(--jsm-surface)' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-12 pb-6">
          <span
            className="inline-block text-xs font-semibold mb-4 px-2.5 py-1 rounded"
            style={{ color: 'var(--jsm-accent)', background: 'var(--jsm-accent-soft)', ...KOR_BODY }}
          >
            마이페이지
          </span>
          <div className="flex items-center gap-4">
            <div
              aria-hidden="true"
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
              style={{ background: 'var(--jsm-accent)' }}
            >
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <div
                className="font-bold text-lg leading-tight truncate"
                style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
              >
                {user.email}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--jsm-ink-faint)' }}>
                가입일 {new Date(user.created_at).toLocaleDateString('ko-KR')}
              </div>
            </div>
          </div>
        </div>

        {/* ─── 탭 바 (상단 가로 탭 · 모바일 스크롤) ─── */}
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => selectTab(t.key)}
                  className="flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors duration-150 border-b-2"
                  style={{
                    color: active ? 'var(--jsm-ink)' : 'var(--jsm-ink-soft)',
                    borderColor: active ? 'var(--jsm-accent)' : 'transparent',
                    ...KOR_BODY,
                  }}
                >
                  {t.label}
                  {t.count !== undefined && t.count > 0 && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                      style={
                        active
                          ? { background: 'var(--jsm-accent-soft)', color: 'var(--jsm-accent)' }
                          : { background: 'var(--jsm-surface-alt)', color: 'var(--jsm-ink-soft)' }
                      }
                    >
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── 탭 콘텐츠 ─── */}
      <div className="px-6 lg:px-8 py-8 max-w-5xl mx-auto">
        {/* ===== 프로필 ===== */}
        {tab === 'profile' && (
          <div className="space-y-5">
            <Card>
              <CardTitle>계정 정보</CardTitle>
              <div className="mt-4">
                <Row label="이메일" value={user.email ?? '-'} />
                <Row
                  label="로그인 방법"
                  value={user.app_metadata?.provider === 'google' ? 'Google' : '이메일'}
                />
                <Row
                  label="가입일"
                  value={new Date(user.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  last
                />
              </div>
            </Card>

            {/* 텔레그램 연동 카드 */}
            <Card>
              <div className="flex items-center gap-2">
                <CardTitle inline>텔레그램 알림 연동</CardTitle>
                <button
                  onClick={() => setShowTelegramGuide(true)}
                  className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center transition-colors"
                  style={{ background: 'var(--jsm-surface-alt)', color: 'var(--jsm-ink-faint)' }}
                  title="연결 방법 보기"
                >
                  ?
                </button>
                <span className="ml-auto text-xs font-normal" style={{ color: 'var(--jsm-ink-faint)' }}>
                  플래티넘 · 다이아 전용
                </span>
              </div>

              <div className="mt-4">
                {telegramChatId ? (
                  /* ── 연결됨 ── */
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border"
                        style={{ background: 'var(--jsm-accent-soft)', borderColor: 'var(--jsm-line)' }}
                      >
                        <TelegramIcon className="w-5 h-5" style={{ color: 'var(--jsm-accent)' }} />
                      </div>
                      <div>
                        <div
                          className="text-sm font-semibold flex items-center gap-1.5"
                          style={{ color: 'var(--jsm-ink)' }}
                        >
                          연결됨
                          <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#16a34a' }} />
                        </div>
                        <div className="text-xs" style={{ color: 'var(--jsm-ink-soft)' }}>
                          Chat ID: {telegramChatId}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleTelegramDisconnect}
                      disabled={telegramLinkState === 'disconnecting'}
                      className="px-4 py-2 text-xs font-semibold rounded-lg border transition-colors disabled:opacity-50"
                      style={{ color: '#dc2626', borderColor: '#fecaca' }}
                    >
                      {telegramLinkState === 'disconnecting' ? '해제 중...' : '연결 해제'}
                    </button>
                  </div>
                ) : telegramLinkState === 'waiting' ? (
                  /* ── 연결 대기 중 ── */
                  <div className="space-y-4">
                    <div
                      className="rounded-xl p-4 border"
                      style={{ background: 'var(--jsm-surface-alt)', borderColor: 'var(--jsm-line)' }}
                    >
                      <p className="text-sm font-semibold mb-2" style={{ color: 'var(--jsm-ink)' }}>
                        아래 순서로 진행하세요
                      </p>
                      <ol
                        className="text-xs space-y-1 list-decimal list-inside"
                        style={{ color: 'var(--jsm-ink-soft)' }}
                      >
                        <li>아래 버튼을 클릭해 텔레그램 봇을 엽니다</li>
                        <li>텔레그램에서 <strong>시작</strong> 버튼을 누릅니다</li>
                        <li>봇이 &quot;연결 완료&quot; 메시지를 보내면 새로고침을 눌러주세요</li>
                      </ol>
                      <p className="text-xs mt-2" style={{ color: 'var(--jsm-ink-faint)' }}>
                        유효시간: {telegramLinkExpiry}까지
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <a
                        href={telegramDeepLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg text-white transition-colors hover:bg-[var(--jsm-accent-hover)]"
                        style={{ background: 'var(--jsm-accent)' }}
                      >
                        <TelegramIcon className="w-4 h-4" />
                        텔레그램 봇 열기
                      </a>
                      <button
                        onClick={handleTelegramRefresh}
                        className="px-4 py-2.5 text-sm font-semibold rounded-lg border transition-colors hover:bg-[var(--jsm-surface-alt)]"
                        style={{ color: 'var(--jsm-ink-soft)', borderColor: 'var(--jsm-line)' }}
                      >
                        연결 확인 새로고침
                      </button>
                      <button
                        onClick={() => setTelegramLinkState('idle')}
                        className="px-4 py-2.5 text-sm rounded-lg transition-colors"
                        style={{ color: 'var(--jsm-ink-faint)' }}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── 미연결 ── */
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border"
                        style={{ background: 'var(--jsm-surface-alt)', borderColor: 'var(--jsm-line)' }}
                      >
                        <TelegramIcon className="w-5 h-5" style={{ color: 'var(--jsm-ink-faint)' }} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: 'var(--jsm-ink)' }}>
                          연결 안 됨
                        </div>
                        <div className="text-xs" style={{ color: 'var(--jsm-ink-soft)' }}>
                          텔레그램으로 알림을 바로 받아보세요
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleTelegramConnect}
                      disabled={telegramLinkState === 'generating'}
                      className="px-5 py-2.5 text-sm font-semibold rounded-lg text-white transition-colors hover:bg-[var(--jsm-accent-hover)] disabled:opacity-60"
                      style={{ background: 'var(--jsm-accent)' }}
                    >
                      {telegramLinkState === 'generating' ? '생성 중...' : '텔레그램 연결하기'}
                    </button>
                  </div>
                )}
              </div>
            </Card>

            {/* 빠른 메뉴 */}
            <Card>
              <CardTitle>빠른 메뉴</CardTitle>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <QuickLink href="/outsourcing#contact" title="외주 의뢰" sub="프로젝트 문의" />
                <QuickLink href="/music/packs" title="음악 팩" sub="제품 둘러보기" />
                <QuickLink href="/music/studio" title="AI 스튜디오" sub="새 트랙 만들기" />
              </div>
            </Card>
          </div>
        )}

        {/* ===== 내 의뢰 ===== */}
        {tab === 'requests' && (
          <div>
            {orders.length === 0 ? (
              <EmptyState
                title="의뢰 내역이 없습니다"
                desc="외주 개발·서비스 문의 내역이 여기에 표시됩니다."
                linkHref="/outsourcing#contact"
                linkLabel="외주 문의하기"
              />
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <Card key={o.id} compact>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="font-bold break-keep" style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}>
                        {o.service}
                      </div>
                      <StatusBadge status={o.status} />
                    </div>
                    <p
                      className="text-sm line-clamp-2 break-keep"
                      style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
                    >
                      {o.message}
                    </p>
                    <div className="text-xs mt-2" style={{ color: 'var(--jsm-ink-faint)' }}>
                      {new Date(o.created_at).toLocaleDateString('ko-KR')}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== 내 제품 (구매한 팩) ===== */}
        {tab === 'products' && (
          <div className="space-y-4">
            {packOrders.length === 0 ? (
              <EmptyState
                title="구매한 제품이 없습니다"
                desc="음악 팩을 구매하시면 자료를 여기서 다운로드할 수 있습니다."
                linkHref="/music/packs"
                linkLabel="음악 팩 보기"
              />
            ) : (
              packOrders.map(({ order, tier }) => {
                const completed = order.status === 'completed';
                const filesForTier = packFiles.filter((pf) => {
                  if (tier === 'starter') return pf.min_tier === 'starter';
                  if (tier === 'pro') return pf.min_tier === 'starter' || pf.min_tier === 'pro';
                  return true; // master
                });

                return (
                  <Card key={order.id}>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="font-bold text-base break-keep" style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}>
                          {PACK_TIER_NAMES[tier]}
                        </div>
                        <div className="text-xs mt-1" style={{ color: 'var(--jsm-ink-faint)' }}>
                          {new Date(order.created_at).toLocaleDateString('ko-KR')} 신청
                        </div>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="border-t pt-4" style={{ borderColor: 'var(--jsm-line)' }}>
                      <div className="text-sm font-semibold mb-3" style={{ color: 'var(--jsm-ink)' }}>
                        자료 패키지 ({filesForTier.length}개)
                      </div>

                      {filesForTier.length === 0 ? (
                        <p className="text-xs" style={{ color: 'var(--jsm-ink-soft)' }}>
                          자료 준비 중입니다. 카톡 1:1로 문의해주세요.
                        </p>
                      ) : (
                        <ul className="space-y-2 mb-3">
                          {filesForTier.map((f) => (
                            <li key={f.id} className="flex items-center justify-between gap-2 text-sm">
                              <span className="flex-1 break-keep" style={{ color: 'var(--jsm-ink)' }}>
                                {f.label}
                              </span>
                              {completed ? (
                                <button
                                  onClick={() => handleDownload(f.id)}
                                  disabled={downloading === f.id}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors hover:bg-[var(--jsm-accent-hover)] disabled:opacity-50"
                                  style={{ background: 'var(--jsm-accent)' }}
                                >
                                  {downloading === f.id ? '준비중...' : '다운로드'}
                                </button>
                              ) : (
                                <span className="text-xs" style={{ color: 'var(--jsm-ink-faint)' }}>
                                  대기 중
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}

                      {completed && filesForTier.length > 0 && (
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--jsm-ink-soft)' }}>
                          다운로드 링크는 발급 후 4시간 동안 유효합니다.
                        </p>
                      )}

                      {!completed && (
                        <div
                          className="rounded-lg px-3 py-2.5 text-xs leading-relaxed text-center"
                          style={{ background: 'var(--jsm-surface-alt)', color: 'var(--jsm-ink-soft)' }}
                        >
                          입금 확인 후 다운로드가 활성화됩니다.
                          {order.status === 'in_progress'
                            ? ' 결제 처리 중입니다.'
                            : ' 입금 안내는 카톡 1:1로 드립니다.'}
                          <br />
                          <a
                            href={KAKAO_OPENCHAT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold hover:underline"
                            style={{ color: 'var(--jsm-accent)' }}
                          >
                            카톡 오픈채팅 →
                          </a>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* ===== 주문 내역 (의뢰 + 결제 완료) ===== */}
        {tab === 'orders' && (
          <div className="space-y-8">
            {/* 주문 목록 (contact_requests) */}
            <section>
              <SectionHeading>주문 목록</SectionHeading>
              {orders.length === 0 ? (
                <EmptyState
                  title="주문 내역이 없습니다"
                  desc="서비스 신청·외주 문의 내역이 여기에 표시됩니다."
                  linkHref="/outsourcing#contact"
                  linkLabel="외주 문의하기"
                />
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => (
                    <Card key={o.id} compact>
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="font-bold break-keep" style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}>
                          {o.service}
                        </div>
                        <StatusBadge status={o.status} />
                      </div>
                      <p
                        className="text-sm line-clamp-1 break-keep"
                        style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
                      >
                        {o.message}
                      </p>
                      <div className="text-xs mt-2" style={{ color: 'var(--jsm-ink-faint)' }}>
                        {new Date(o.created_at).toLocaleDateString('ko-KR')}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* 결제 완료 내역 (payments) */}
            <section>
              <SectionHeading>결제 완료 내역</SectionHeading>
              {payments.length === 0 ? (
                <div
                  className="rounded-2xl border px-6 py-8 text-center text-sm"
                  style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)', color: 'var(--jsm-ink-soft)' }}
                >
                  결제 완료된 내역이 아직 없습니다.
                </div>
              ) : (
                <div
                  className="rounded-2xl border overflow-hidden"
                  style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
                >
                  <table className="w-full text-sm">
                    <thead style={{ background: 'var(--jsm-surface-alt)' }}>
                      <tr style={{ borderBottom: '1px solid var(--jsm-line)' }}>
                        <th className="px-5 py-3 text-left font-semibold" style={{ color: 'var(--jsm-ink-soft)' }}>서비스</th>
                        <th className="px-5 py-3 text-left font-semibold" style={{ color: 'var(--jsm-ink-soft)' }}>금액</th>
                        <th className="px-5 py-3 text-left font-semibold" style={{ color: 'var(--jsm-ink-soft)' }}>상태</th>
                        <th className="px-5 py-3 text-left font-semibold" style={{ color: 'var(--jsm-ink-soft)' }}>일시</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p.id} style={{ borderTop: '1px solid var(--jsm-line)' }}>
                          <td className="px-5 py-3 font-medium" style={{ color: 'var(--jsm-ink)' }}>{p.product_name}</td>
                          <td className="px-5 py-3" style={{ color: 'var(--jsm-ink)' }}>₩{p.amount?.toLocaleString()}</td>
                          <td className="px-5 py-3">
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-semibold"
                              style={
                                p.status === 'paid'
                                  ? { background: '#dcfce7', color: '#166534' }
                                  : { background: 'var(--jsm-surface-alt)', color: 'var(--jsm-ink-soft)' }
                              }
                            >
                              {p.status === 'paid' ? '결제완료' : p.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-xs" style={{ color: 'var(--jsm-ink-faint)' }}>
                            {new Date(p.created_at).toLocaleDateString('ko-KR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-[60vh] flex items-center justify-center"
          style={{ background: 'var(--jsm-bg)' }}
        >
          <div
            className="w-7 h-7 rounded-full animate-spin"
            style={{ border: '2px solid var(--jsm-accent)', borderTopColor: 'transparent' }}
          />
        </div>
      }
    >
      <MyPageContent />
    </Suspense>
  );
}

/* ─────────── 공통 프레젠테이션 컴포넌트 ─────────── */

function Card({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border ${compact ? 'p-5' : 'p-6'}`}
      style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
    >
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode; inline?: boolean }) {
  return (
    <h2 className="font-bold" style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}>
      {children}
    </h2>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-xs font-semibold uppercase tracking-wider mb-3"
      style={{ color: 'var(--jsm-accent)' }}
    >
      {children}
    </h3>
  );
}

function Row({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={last ? undefined : { borderBottom: '1px solid var(--jsm-line)' }}
    >
      <span className="text-sm" style={{ color: 'var(--jsm-ink-soft)' }}>{label}</span>
      <span className="text-sm font-semibold" style={{ color: 'var(--jsm-ink)' }}>{value}</span>
    </div>
  );
}

function QuickLink({ href, title, sub }: { href: string; title: string; sub: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1 p-4 rounded-xl border transition-colors hover:bg-[var(--jsm-surface-alt)]"
      style={{ borderColor: 'var(--jsm-line)' }}
    >
      <span className="text-sm font-semibold" style={{ color: 'var(--jsm-ink)' }}>{title}</span>
      <span className="text-xs" style={{ color: 'var(--jsm-ink-faint)' }}>{sub}</span>
    </Link>
  );
}

// 상태 뱃지 — pending=surface-alt / in_progress=accent-soft / completed=성공 그린(예외 허용)
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; style: React.CSSProperties }> = {
    completed: { label: '완료', style: { background: '#dcfce7', color: '#166534' } },
    in_progress: { label: '진행중', style: { background: 'var(--jsm-accent-soft)', color: 'var(--jsm-accent)' } },
    pending: { label: '대기중', style: { background: 'var(--jsm-surface-alt)', color: 'var(--jsm-ink-soft)' } },
  };
  const conf = map[status] ?? {
    label: status,
    style: { background: 'var(--jsm-surface-alt)', color: 'var(--jsm-ink-soft)' },
  };
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0"
      style={conf.style}
    >
      {conf.label}
    </span>
  );
}

function EmptyState({
  title,
  desc,
  linkHref,
  linkLabel,
}: {
  title: string;
  desc: string;
  linkHref: string;
  linkLabel: string;
}) {
  return (
    <div
      className="text-center px-6 py-16 rounded-2xl border"
      style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
    >
      <div className="font-bold text-lg mb-2 break-keep" style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}>
        {title}
      </div>
      <div className="text-sm mb-6 break-keep max-w-sm mx-auto" style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}>
        {desc}
      </div>
      <Link
        href={linkHref}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white transition-colors hover:bg-[var(--jsm-accent-hover)]"
        style={{ background: 'var(--jsm-accent)' }}
      >
        {linkLabel} →
      </Link>
    </div>
  );
}

function TelegramIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.667l-2.95-.924c-.64-.203-.654-.64.136-.954l11.566-4.458c.538-.194 1.006.131.972.89z" />
    </svg>
  );
}
