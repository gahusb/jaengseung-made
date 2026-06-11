'use client';

import { useEffect, useState } from 'react';

interface Order {
  id: string;
  user_id: string | null;
  product_id: string | null;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  metadata: Record<string, unknown> | null;
  created_at: string;
  product_name: string | null;
  customer_email: string | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: '입금 대기', color: 'bg-yellow-900/40 text-yellow-400' },
  paid: { label: '완료', color: 'bg-green-900/40 text-green-400' },
  cancelled: { label: '취소', color: 'bg-slate-700/60 text-slate-500' },
};

const FILTER_TABS = [
  { val: 'all', label: '전체' },
  { val: 'pending', label: '입금 대기' },
  { val: 'paid', label: '완료' },
  { val: 'cancelled', label: '취소' },
] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  async function loadOrders() {
    try {
      const res = await fetch('/api/admin/orders');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = await res.json();
      setOrders(d.orders ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : '불러오기 실패');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(id: string, status: 'paid' | 'cancelled' | 'pending') {
    if (status === 'paid') {
      const ok = confirm('입금을 확인하셨습니까? 고객에게 다운로드 활성화 메일이 발송됩니다.');
      if (!ok) return;
    }
    setUpdating(id);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status } : o))
        );
      } else {
        alert('상태 변경에 실패했습니다.');
      }
    } catch (e) {
      console.error(e);
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setUpdating(null);
    }
  }

  const filtered = orders.filter((o) => filterStatus === 'all' || o.status === filterStatus);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">주문 관리</h1>
          <p className="text-slate-400 text-sm mt-0.5">계좌이체 입금 확인 및 다운로드 활성화</p>
        </div>
        {pendingCount > 0 && (
          <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-sm font-medium">
            입금 대기 {pendingCount}건
          </span>
        )}
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-2 mb-4">
        {FILTER_TABS.map(({ val, label }) => (
          <button
            key={val}
            onClick={() => setFilterStatus(val)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filterStatus === val
                ? 'bg-red-600/30 text-red-300 border border-red-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {label}
            {val !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                {orders.filter((o) => o.status === val).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full" />
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-10 text-center">
          <p className="text-red-400 font-medium">{error}</p>
          <button
            onClick={() => { setLoading(true); setError(null); loadOrders(); }}
            className="mt-3 text-sm text-slate-400 hover:text-white transition"
          >
            다시 시도
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 rounded-2xl p-10 text-center text-slate-500 border border-slate-700/50">
          주문 내역이 없습니다
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((order) => {
            const depositorName =
              typeof order.metadata?.depositor_name === 'string'
                ? order.metadata.depositor_name
                : null;

            return (
              <div
                key={order.id}
                className={`bg-slate-900 rounded-xl p-4 border transition-all ${
                  order.status === 'cancelled'
                    ? 'border-slate-800/50 opacity-50'
                    : 'border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* 상품명 + 이메일 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium text-sm truncate">
                        {order.product_name ?? '(상품 없음)'}
                      </span>
                      <span className="text-blue-400 font-semibold text-sm flex-shrink-0">
                        ₩{order.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="truncate">
                        {order.customer_email ?? order.user_id ?? '이메일 없음'}
                      </span>
                      {depositorName && (
                        <span className="flex-shrink-0 bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                          입금자: {depositorName}
                        </span>
                      )}
                      <span className="flex-shrink-0">
                        {new Date(order.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>

                  {/* 상태 뱃지 + 액션 버튼 */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {order.status === 'paid' ? (
                      <span className="text-green-400 text-xs font-medium">다운로드 활성</span>
                    ) : null}
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[order.status]?.color}`}
                    >
                      {STATUS_LABELS[order.status]?.label}
                    </span>
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(order.id, 'paid')}
                          disabled={updating === order.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30 transition disabled:opacity-50"
                        >
                          {updating === order.id ? '처리중...' : '입금 확인'}
                        </button>
                        <button
                          onClick={() => updateStatus(order.id, 'cancelled')}
                          disabled={updating === order.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white transition disabled:opacity-50"
                        >
                          취소
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
