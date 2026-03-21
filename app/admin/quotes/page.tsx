'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Quote {
  id: string;
  title: string;
  client_name: string;
  client_email: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  valid_until: string | null;
  public_token: string;
  items: { unitPrice: number; quantity: number; optional: boolean }[];
  created_at: string;
}

const STATUS = {
  draft:    { label: '초안', color: 'bg-slate-700 text-slate-300' },
  sent:     { label: '발송됨', color: 'bg-blue-900/50 text-blue-400' },
  accepted: { label: '수락됨', color: 'bg-green-900/50 text-green-400' },
  rejected: { label: '거절됨', color: 'bg-red-900/50 text-red-400' },
};

function calcTotal(items: Quote['items']) {
  return items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
}

export default function AdminQuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/quotes')
      .then((r) => r.json())
      .then((d) => setQuotes(d.quotes ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate() {
    setCreating(true);
    const res = await fetch('/api/admin/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '새 견적서' }),
    });
    const d = await res.json();
    if (d.quote?.id) router.push(`/admin/quotes/${d.quote.id}`);
    else setCreating(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('이 견적서를 삭제할까요?')) return;
    setDeleting(id);
    await fetch(`/api/admin/quotes/${id}`, { method: 'DELETE' });
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    setDeleting(null);
  }

  function copyLink(token: string, id: string) {
    const url = `${window.location.origin}/quote/${token}`;
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">견적서 관리</h1>
          <p className="text-slate-400 text-sm mt-1">고객에게 제시할 견적서를 작성하고 관리합니다</p>
        </div>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold rounded-xl transition-all disabled:opacity-60"
        >
          {creating ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
          새 견적서 작성
        </button>
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">불러오는 중...</div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📄</div>
          <p className="text-slate-400 text-lg font-medium">아직 견적서가 없습니다</p>
          <p className="text-slate-600 text-sm mt-2">위 버튼을 눌러 첫 번째 견적서를 작성해보세요</p>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">견적서명</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">고객</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">합계</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">상태</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">유효기간</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">작성일</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {quotes.map((q) => {
                const st = STATUS[q.status] ?? STATUS.draft;
                const total = calcTotal(q.items ?? []);
                return (
                  <tr key={q.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/quotes/${q.id}`} className="text-white font-medium hover:text-blue-400 transition-colors">
                        {q.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300 text-sm">{q.client_name || '—'}</div>
                      <div className="text-slate-500 text-xs">{q.client_email || ''}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm font-mono">
                      {total > 0 ? `${total.toLocaleString()}원` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${st.color}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {q.valid_until ? q.valid_until.slice(0, 10) : '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(q.created_at).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        {/* 공개 링크 복사 */}
                        <button
                          onClick={() => copyLink(q.public_token, q.id)}
                          title="고객용 링크 복사"
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all"
                        >
                          {copied === q.id ? (
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                        {/* 편집 */}
                        <Link
                          href={`/admin/quotes/${q.id}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        {/* 삭제 */}
                        <button
                          onClick={() => handleDelete(q.id)}
                          disabled={deleting === q.id}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-all disabled:opacity-40"
                        >
                          {deleting === q.id ? (
                            <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin inline-block" />
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
