'use client';

import { useEffect, useState } from 'react';

interface Member {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  orderCount: number;
  totalPaid: number;
  activeSub: { product_id: string; status: string; expires_at: string } | null;
}

const PLAN_LABELS: Record<string, string> = {
  lotto_gold: '🥇 골드',
  lotto_platinum: '💎 플래티넘',
  lotto_diamond: '👑 다이아',
};

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/members')
      .then((r) => r.json())
      .then((d) => setMembers(d.members ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = members.filter(
    (m) =>
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">회원 관리</h1>
          <p className="text-slate-400 text-sm mt-0.5">가입 회원 목록 및 결제 현황</p>
        </div>
        <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
          총 {members.length}명
        </span>
      </div>

      {/* 검색 */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이메일 또는 이름으로 검색..."
          className="w-full max-w-sm bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-5 py-3 text-slate-400 font-medium">이메일</th>
                <th className="text-left px-5 py-3 text-slate-400 font-medium">이름</th>
                <th className="text-left px-5 py-3 text-slate-400 font-medium">가입일</th>
                <th className="text-left px-5 py-3 text-slate-400 font-medium">구독</th>
                <th className="text-right px-5 py-3 text-slate-400 font-medium">결제 건수</th>
                <th className="text-right px-5 py-3 text-slate-400 font-medium">총 결제액</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    회원 데이터가 없습니다
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition">
                    <td className="px-5 py-3 text-white">{m.email ?? '-'}</td>
                    <td className="px-5 py-3 text-slate-300">{m.full_name ?? '-'}</td>
                    <td className="px-5 py-3 text-slate-400">
                      {new Date(m.created_at).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-5 py-3">
                      {m.activeSub ? (
                        <div>
                          <span className="text-xs font-semibold text-amber-400">{PLAN_LABELS[m.activeSub.product_id] ?? m.activeSub.product_id}</span>
                          <div className="text-xs text-slate-500">{new Date(m.activeSub.expires_at).toLocaleDateString('ko-KR')} 만료</div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600">-</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${m.orderCount > 0 ? 'bg-green-900/40 text-green-400' : 'bg-slate-700 text-slate-500'}`}>
                        {m.orderCount}건
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-slate-200 font-medium">
                      {m.totalPaid > 0 ? `₩${m.totalPaid.toLocaleString()}` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
