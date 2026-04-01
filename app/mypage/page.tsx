'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import TelegramGuideModal from '@/app/components/TelegramGuideModal';

function buildSajuResultUrl(rec: SajuRecord) {
  const { birth_year, birth_month, birth_day, birth_hour, gender } = rec.saju_data;
  if (!birth_year || !birth_month || !birth_day) return '/saju/input';
  let url = `/saju/result?year=${birth_year}&month=${birth_month}&day=${birth_day}&gender=${gender}&calendarType=solar`;
  if (birth_hour != null) url += `&hour=${birth_hour}`;
  return url;
}

type Tab = 'profile' | 'subscription' | 'lotto' | 'saju' | 'payments' | 'orders';
type TelegramLinkState = 'idle' | 'generating' | 'waiting' | 'disconnecting';

interface SajuRecord {
  id: number;
  created_at: string;
  saju_data: {
    birth_year: number;
    birth_month: number;
    birth_day: number;
    birth_hour?: number;
    gender: string;
  };
  interpretation: string | null;
  is_paid: boolean;
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

interface LottoHistoryItem {
  id: number;
  numbers: number[];
  source: string;
  plan_id: string;
  created_at: string;
}

interface ActiveSubscription {
  id: string;
  product_id: string;
  status: string;
  auto_renew: boolean;
  started_at: string;
  expires_at: string;
  cancelled_at: string | null;
}

const PLAN_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  lotto_gold:     { label: '골드', emoji: '🥇', color: 'amber' },
  lotto_platinum: { label: '플래티넘', emoji: '💎', color: 'sky' },
  lotto_diamond:  { label: '다이아', emoji: '👑', color: 'violet' },
};

export default function MyPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('profile');
  const [sajuRecords, setSajuRecords] = useState<SajuRecord[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lottoHistory, setLottoHistory] = useState<LottoHistoryItem[]>([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState<ActiveSubscription[]>([]);

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

      // 사주 기록 조회 (테이블 있을 때 동작)
      const { data: saju } = await supabase
        .from('saju_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      setSajuRecords(saju || []);

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

      // 구독 목록 조회 (subscriptions 테이블)
      const subRes = await fetch('/api/subscription');
      if (subRes.ok) {
        const subData = await subRes.json();
        setActiveSubscriptions(subData.subscriptions ?? []);
      }

      // 로또 히스토리 조회
      const { data: history } = await supabase
        .from('lotto_history')
        .select('id, numbers, source, plan_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      setLottoHistory(history ?? []);

      setLoading(false);
    }
    init();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  // ── 구독 해지 ──
  const handleCancelSubscription = async (subId: string) => {
    if (!confirm('구독을 해지하시겠습니까?\n만료일까지는 서비스를 계속 이용할 수 있습니다.')) return;
    const res = await fetch(`/api/subscription/${subId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel' }),
    });
    if (res.ok) {
      setActiveSubscriptions((prev) =>
        prev.map((s) => s.id === subId ? { ...s, status: 'cancelled', auto_renew: false, cancelled_at: new Date().toISOString() } : s)
      );
    } else {
      alert('해지 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // ── 자동갱신 토글 ──
  const handleToggleAutoRenew = async (subId: string) => {
    const res = await fetch(`/api/subscription/${subId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_autorenew' }),
    });
    if (res.ok) {
      const data = await res.json();
      setActiveSubscriptions((prev) =>
        prev.map((s) => s.id === subId ? { ...s, auto_renew: data.auto_renew } : s)
      );
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-[#f0f5ff]">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const activeSubs = activeSubscriptions.filter((s) => s.status === 'active' || s.status === 'cancelled');

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'profile', label: '내 정보' },
    { key: 'subscription', label: '구독 관리', count: activeSubs.length || undefined },
    { key: 'lotto', label: '로또 기록', count: lottoHistory.length || undefined },
    { key: 'saju', label: '사주 기록', count: sajuRecords.length || undefined },
    { key: 'payments', label: '결제 내역', count: payments.length || undefined },
    { key: 'orders', label: '의뢰 내역', count: orders.length || undefined },
  ];

  return (
    <div className="min-h-full bg-[#f0f5ff]">
      {/* 텔레그램 가이드 모달 */}
      {showTelegramGuide && (
        <TelegramGuideModal onClose={() => setShowTelegramGuide(false)} />
      )}

      {/* 헤더 */}
      <div className="bg-[#04102b] px-6 py-10" style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 40px)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#1a56db] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {user.email?.[0].toUpperCase()}
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-tight">{user.email}</div>
              <div className="text-blue-300/60 text-sm mt-0.5">
                가입일: {new Date(user.created_at).toLocaleDateString('ko-KR')}
              </div>
            </div>
            <div className="ml-auto">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/5 border border-white/10 text-slate-300 text-sm rounded-xl hover:bg-white/10 transition"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-4xl mx-auto">
        {/* 탭 */}
        <div className="flex gap-1 bg-white border border-[#dbe8ff] rounded-xl p-1 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.key
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  tab === t.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}

        {/* 내 정보 */}
        {tab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#dbe8ff] p-6">
              <h2 className="font-bold text-[#04102b] mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-violet-600 rounded-full" />
                계정 정보
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-sm text-slate-500">이메일</span>
                  <span className="text-sm font-semibold text-[#04102b]">{user.email}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-sm text-slate-500">로그인 방법</span>
                  <span className="text-sm font-semibold text-[#04102b] capitalize">
                    {user.app_metadata?.provider === 'google' ? 'Google' : '이메일'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-slate-500">가입일</span>
                  <span className="text-sm font-semibold text-[#04102b]">
                    {new Date(user.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* 구독 중인 서비스 - 요약 (탭으로 유도) */}
            {activeSubs.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{PLAN_LABELS[activeSubs[0].product_id]?.emoji ?? '🎟'}</span>
                  <div>
                    <div className="text-sm font-bold text-[#04102b]">
                      로또 {PLAN_LABELS[activeSubs[0].product_id]?.label} 구독 중
                    </div>
                    <div className="text-xs text-amber-600 mt-0.5">
                      {Math.max(0, Math.ceil((new Date(activeSubs[0].expires_at).getTime() - Date.now()) / 86400000))}일 후 만료
                      {activeSubs[0].status === 'cancelled' && ' · 해지 예정'}
                    </div>
                  </div>
                </div>
                <button onClick={() => setTab('subscription')}
                  className="text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition">
                  구독 관리 →
                </button>
              </div>
            )}

            {/* 텔레그램 연동 카드 */}
            <div className="bg-white rounded-2xl border border-[#dbe8ff] p-6">
              <h2 className="font-bold text-[#04102b] mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-sky-500 to-blue-600 rounded-full" />
                텔레그램 알림 연동
                <button
                  onClick={() => setShowTelegramGuide(true)}
                  className="ml-1 w-5 h-5 rounded-full bg-slate-100 hover:bg-sky-100 text-slate-400 hover:text-sky-500 text-xs font-bold flex items-center justify-center transition"
                  title="연결 방법 보기"
                >
                  ?
                </button>
                <span className="ml-auto text-xs text-slate-400 font-normal">플래티넘 · 다이아 전용</span>
              </h2>

              {telegramChatId ? (
                /* ── 연결됨 ── */
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.667l-2.95-.924c-.64-.203-.654-.64.136-.954l11.566-4.458c.538-.194 1.006.131.972.89z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#04102b] flex items-center gap-1.5">
                        연결됨
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                      </div>
                      <div className="text-xs text-slate-500">Chat ID: {telegramChatId}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleTelegramDisconnect}
                    disabled={telegramLinkState === 'disconnecting'}
                    className="px-4 py-2 text-xs font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition disabled:opacity-50"
                  >
                    {telegramLinkState === 'disconnecting' ? '해제 중...' : '연결 해제'}
                  </button>
                </div>
              ) : telegramLinkState === 'waiting' ? (
                /* ── 연결 대기 중 ── */
                <div className="space-y-4">
                  <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-sky-700 mb-1">📱 아래 순서로 진행하세요</p>
                    <ol className="text-xs text-sky-600 space-y-1 list-decimal list-inside">
                      <li>아래 버튼을 클릭해 텔레그램 봇을 엽니다</li>
                      <li>텔레그램에서 <strong>시작</strong> 버튼을 누릅니다</li>
                      <li>봇이 &quot;연결 완료&quot; 메시지를 보내면 새로고침을 눌러주세요</li>
                    </ol>
                    <p className="text-xs text-sky-500 mt-2">⏱ 유효시간: {telegramLinkExpiry}까지</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <a
                      href={telegramDeepLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold rounded-xl transition shadow-sm shadow-sky-200"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.667l-2.95-.924c-.64-.203-.654-.64.136-.954l11.566-4.458c.538-.194 1.006.131.972.89z"/>
                      </svg>
                      텔레그램 봇 열기
                    </a>
                    <button
                      onClick={handleTelegramRefresh}
                      className="px-4 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                    >
                      연결 확인 새로고침
                    </button>
                    <button
                      onClick={() => setTelegramLinkState('idle')}
                      className="px-4 py-2.5 text-sm text-slate-400 rounded-xl hover:text-slate-600 transition"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                /* ── 미연결 ── */
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.667l-2.95-.924c-.64-.203-.654-.64.136-.954l11.566-4.458c.538-.194 1.006.131.972.89z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#04102b]">연결 안 됨</div>
                      <div className="text-xs text-slate-500">텔레그램으로 번호를 바로 받아보세요</div>
                    </div>
                  </div>
                  <button
                    onClick={handleTelegramConnect}
                    disabled={telegramLinkState === 'generating'}
                    className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-xl shadow-sm shadow-sky-200 transition disabled:opacity-60"
                  >
                    {telegramLinkState === 'generating' ? '생성 중...' : '텔레그램 연결하기'}
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-[#dbe8ff] p-6">
              <h2 className="font-bold text-[#04102b] mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-violet-600 rounded-full" />
                빠른 메뉴
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/saju/input" className="flex items-center gap-3 p-4 rounded-xl border border-[#dbe8ff] hover:border-blue-300 hover:bg-blue-50/50 transition group">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#04102b]">사주 분석</div>
                    <div className="text-xs text-slate-500">새 사주 보기</div>
                  </div>
                </Link>
                <Link href="/services/lotto/recommend" className="flex items-center gap-3 p-4 rounded-xl border border-[#dbe8ff] hover:border-amber-300 hover:bg-amber-50/50 transition group">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#04102b]">로또 번호 추천</div>
                    <div className="text-xs text-slate-500">구독자 전용</div>
                  </div>
                </Link>
                <Link href="/freelance" className="flex items-center gap-3 p-4 rounded-xl border border-[#dbe8ff] hover:border-blue-300 hover:bg-blue-50/50 transition group">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#04102b]">외주 의뢰</div>
                    <div className="text-xs text-slate-500">프로젝트 문의</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 구독 관리 */}
        {tab === 'subscription' && (
          <div className="space-y-4">
            {activeSubscriptions.length === 0 ? (
              <EmptyState
                icon="📦"
                title="활성 구독이 없습니다"
                desc="로또 번호 추천 서비스를 구독하면 여기서 관리할 수 있습니다"
                linkHref="/services/lotto"
                linkLabel="구독 플랜 보기"
              />
            ) : (
              activeSubscriptions.map((sub) => {
                const info = PLAN_LABELS[sub.product_id];
                const expiresDate = new Date(sub.expires_at);
                const daysLeft = Math.max(0, Math.ceil((expiresDate.getTime() - Date.now()) / 86400000));
                const isExpired = sub.status === 'expired';
                const isCancelled = sub.status === 'cancelled';
                const isActive = sub.status === 'active';

                return (
                  <div key={sub.id} className={`bg-white rounded-2xl border p-6 ${isExpired ? 'border-slate-200 opacity-60' : isCancelled ? 'border-orange-200' : 'border-[#dbe8ff]'}`}>
                    {/* 헤더 */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{info?.emoji ?? '🎟'}</span>
                        <div>
                          <div className="font-bold text-[#04102b] text-base">
                            로또 번호 추천 {info?.label ?? sub.product_id}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {new Date(sub.started_at).toLocaleDateString('ko-KR')} 시작
                          </div>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                        isCancelled ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {isActive ? '이용 중' : isCancelled ? '해지 예정' : '만료됨'}
                      </span>
                    </div>

                    {/* 만료 정보 */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-slate-50 rounded-xl p-3">
                        <div className="text-xs text-slate-400 mb-1">만료일</div>
                        <div className="text-sm font-bold text-[#04102b]">
                          {expiresDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                      <div className={`rounded-xl p-3 ${daysLeft <= 5 && !isExpired ? 'bg-red-50' : 'bg-slate-50'}`}>
                        <div className="text-xs text-slate-400 mb-1">남은 기간</div>
                        <div className={`text-sm font-bold ${isExpired ? 'text-slate-400' : daysLeft <= 5 ? 'text-red-500' : 'text-emerald-600'}`}>
                          {isExpired ? '만료됨' : `D-${daysLeft}`}
                        </div>
                      </div>
                    </div>

                    {/* 자동갱신 토글 */}
                    {!isExpired && (
                      <div className="flex items-center justify-between py-3 border-t border-slate-100 mb-4">
                        <div>
                          <div className="text-sm font-semibold text-[#04102b]">자동 갱신</div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {sub.auto_renew ? '만료 시 자동으로 갱신됩니다' : '만료 시 자동 갱신되지 않습니다'}
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleAutoRenew(sub.id)}
                          disabled={isCancelled}
                          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-40 ${sub.auto_renew ? 'bg-emerald-500' : 'bg-slate-200'}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${sub.auto_renew ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    )}

                    {/* 해지 취소 버튼 */}
                    {isCancelled && (
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 text-xs text-orange-700">
                        해지 신청됨 · {expiresDate.toLocaleDateString('ko-KR')}까지 서비스를 이용할 수 있습니다.
                        {sub.cancelled_at && ` (해지일: ${new Date(sub.cancelled_at).toLocaleDateString('ko-KR')})`}
                      </div>
                    )}

                    {/* 액션 버튼 */}
                    <div className="flex gap-2 flex-wrap">
                      <a href="/services/lotto/recommend"
                        className="flex-1 text-center py-2 text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl transition shadow-sm">
                        번호 추천받기
                      </a>
                      {isActive && (
                        <button
                          onClick={() => handleCancelSubscription(sub.id)}
                          className="px-4 py-2 text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition"
                        >
                          구독 해지
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* 구독 플랜 이동 */}
            <div className="text-center py-2">
              <a href="/services/lotto" className="text-sm text-slate-400 hover:text-slate-600 transition">
                다른 플랜 보기 →
              </a>
            </div>
          </div>
        )}

        {/* 로또 번호 기록 */}
        {tab === 'lotto' && (
          <div>
            {lottoHistory.length === 0 ? (
              <EmptyState
                icon="🎰"
                title="생성된 번호 기록이 없습니다"
                desc="로또 번호 추천 페이지에서 번호를 생성하면 여기에 기록됩니다"
                linkHref="/services/lotto/recommend"
                linkLabel="번호 추천받기"
              />
            ) : (
              <div className="space-y-3">
                <div className="text-xs text-slate-400 mb-1">총 {lottoHistory.length}개 조합 생성</div>
                {lottoHistory.map((item) => {
                  const info = PLAN_LABELS[item.plan_id];
                  return (
                    <div key={item.id} className="bg-white rounded-2xl border border-[#dbe8ff] px-5 py-4 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex gap-1.5 flex-wrap">
                          {item.numbers.map((n) => {
                            const color =
                              n <= 10 ? 'bg-yellow-400 text-yellow-900' :
                              n <= 20 ? 'bg-blue-500 text-white' :
                              n <= 30 ? 'bg-red-500 text-white' :
                              n <= 40 ? 'bg-slate-500 text-white' :
                                        'bg-green-500 text-white';
                            return (
                              <span key={n} className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-xs font-black shadow-sm`}>
                                {n}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.source === 'nas' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                          {item.source === 'nas' ? 'NAS 추천' : '로컬 생성'}
                        </span>
                        <span className="text-xs text-amber-600 font-semibold">{info?.emoji} {info?.label}</span>
                        <span className="text-xs text-slate-400">{new Date(item.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 사주 기록 */}
        {tab === 'saju' && (
          <div>
            {sajuRecords.length === 0 ? (
              <EmptyState
                icon="✨"
                title="저장된 사주 기록이 없습니다"
                desc="사주 분석 후 결과를 저장하면 여기서 다시 확인할 수 있습니다"
                linkHref="/saju/input"
                linkLabel="사주 분석 시작"
              />
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {sajuRecords.map((rec) => (
                  <div key={rec.id} className="bg-white rounded-2xl border border-[#dbe8ff] p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">{new Date(rec.created_at).toLocaleDateString('ko-KR')}</div>
                        <div className="font-bold text-[#04102b]">
                          {rec.saju_data?.birth_year ?? '?'}년{' '}
                          {rec.saju_data?.birth_month ?? '?'}월{' '}
                          {rec.saju_data?.birth_day ?? '?'}일생
                        </div>
                        <div className="text-sm text-slate-500 mt-0.5">
                          {rec.saju_data?.gender === 'male' ? '남성' : '여성'}
                          {rec.saju_data?.birth_hour != null ? ` · ${rec.saju_data.birth_hour}시생` : ''}
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${rec.is_paid ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-500'}`}>
                        {rec.is_paid ? '유료' : '무료'}
                      </span>
                    </div>
                    {rec.interpretation && (
                      <p className="text-xs text-slate-500 line-clamp-2 bg-slate-50 rounded-lg px-3 py-2 mb-3">
                        {rec.interpretation.replace(/[#*]/g, '').substring(0, 80)}...
                      </p>
                    )}
                    <Link
                      href={buildSajuResultUrl(rec)}
                      className="block w-full text-center py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#04102b] to-[#0a2060] text-white hover:from-[#0a1f5c] hover:to-[#1a3a7a] transition"
                    >
                      {rec.is_paid && rec.interpretation ? 'AI 해석 다시 보기 →' : '결과 보기 →'}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 결제 내역 */}
        {tab === 'payments' && (
          <div>
            {payments.length === 0 ? (
              <EmptyState
                icon="💳"
                title="결제 내역이 없습니다"
                desc="서비스 구매 후 결제 내역이 여기에 표시됩니다"
                linkHref="/saju"
                linkLabel="서비스 보기"
              />
            ) : (
              <div className="bg-white rounded-2xl border border-[#dbe8ff] overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#f0f5ff] border-b border-[#dbe8ff]">
                    <tr>
                      <th className="px-5 py-3 text-left font-semibold text-slate-600">서비스</th>
                      <th className="px-5 py-3 text-left font-semibold text-slate-600">금액</th>
                      <th className="px-5 py-3 text-left font-semibold text-slate-600">상태</th>
                      <th className="px-5 py-3 text-left font-semibold text-slate-600">일시</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr key={p.id} className={i % 2 === 0 ? '' : 'bg-slate-50/50'}>
                        <td className="px-5 py-3 font-medium text-[#04102b]">{p.product_name}</td>
                        <td className="px-5 py-3 text-[#04102b]">₩{p.amount?.toLocaleString()}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            p.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {p.status === 'paid' ? '결제완료' : p.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-500 text-xs">
                          {new Date(p.created_at).toLocaleDateString('ko-KR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 의뢰 내역 */}
        {tab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <EmptyState
                icon="📋"
                title="의뢰 내역이 없습니다"
                desc="외주 개발, 서비스 문의 내역이 여기에 표시됩니다"
                linkHref="/freelance"
                linkLabel="외주 의뢰하기"
              />
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="bg-white rounded-2xl border border-[#dbe8ff] p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-bold text-[#04102b]">{o.service}</div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        o.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                        o.status === 'in_progress' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {o.status === 'completed' ? '완료' : o.status === 'in_progress' ? '진행중' : '대기중'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{o.message}</p>
                    <div className="text-xs text-slate-400 mt-2">{new Date(o.created_at).toLocaleDateString('ko-KR')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  icon, title, desc, linkHref, linkLabel,
}: {
  icon: string; title: string; desc: string; linkHref: string; linkLabel: string;
}) {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-[#dbe8ff]">
      <div className="text-5xl mb-4">{icon}</div>
      <div className="font-bold text-[#04102b] text-lg mb-2">{title}</div>
      <div className="text-slate-500 text-sm mb-6">{desc}</div>
      <Link
        href={linkHref}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-blue-600/20"
      >
        {linkLabel} →
      </Link>
    </div>
  );
}
