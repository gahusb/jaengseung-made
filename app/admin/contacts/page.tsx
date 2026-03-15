'use client';

import { useEffect, useState } from 'react';

interface Contact {
  id: string;
  email: string;
  name: string | null;
  service: string;
  message: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: '미처리', color: 'bg-yellow-900/40 text-yellow-400' },
  in_progress: { label: '처리중', color: 'bg-blue-900/40 text-blue-400' },
  completed: { label: '완료', color: 'bg-green-900/40 text-green-400' },
};

const SERVICE_LABELS: Record<string, string> = {
  lotto: '로또 추천',
  stock: '주식 자동매매',
  automation: '업무 자동화',
  prompt: '프롬프트 엔지니어링',
  freelance: '외주 개발',
  saju: 'AI 사주',
  general: '일반 문의',
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetch('/api/admin/contacts')
      .then((r) => r.json())
      .then((d) => setContacts(d.contacts ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      const res = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: status as Contact['status'] } : c))
        );
        if (selected?.id === id) {
          setSelected((prev) => prev ? { ...prev, status: status as Contact['status'] } : null);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  }

  const filtered = contacts.filter((c) => filterStatus === 'all' || c.status === filterStatus);
  const pendingCount = contacts.filter((c) => c.status === 'pending').length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">문의 내역</h1>
          <p className="text-slate-400 text-sm mt-0.5">고객 문의 및 외주 의뢰 관리</p>
        </div>
        {pendingCount > 0 && (
          <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-sm font-medium">
            미처리 {pendingCount}건
          </span>
        )}
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-2 mb-4">
        {[['all', '전체'], ['pending', '미처리'], ['in_progress', '처리중'], ['completed', '완료']].map(([val, label]) => (
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
                {contacts.filter((c) => c.status === val).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="flex gap-4">
          {/* 목록 */}
          <div className="flex-1 space-y-2">
            {filtered.length === 0 ? (
              <div className="bg-slate-900 rounded-2xl p-10 text-center text-slate-500 border border-slate-700/50">
                문의 내역이 없습니다
              </div>
            ) : (
              filtered.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelected(contact)}
                  className={`w-full text-left bg-slate-900 rounded-xl p-4 border transition-all hover:border-slate-600 ${
                    selected?.id === contact.id ? 'border-red-500/50' : 'border-slate-700/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium text-sm truncate">
                          {contact.name ?? contact.email}
                        </span>
                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full flex-shrink-0">
                          {SERVICE_LABELS[contact.service] ?? contact.service}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs truncate">{contact.message}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_LABELS[contact.status]?.color}`}>
                        {STATUS_LABELS[contact.status]?.label}
                      </span>
                      <span className="text-slate-600 text-xs">
                        {new Date(contact.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* 상세 패널 */}
          {selected && (
            <div className="w-80 flex-shrink-0 bg-slate-900 rounded-2xl border border-slate-700/50 p-5 h-fit sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">문의 상세</h3>
                <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <dl className="space-y-3 text-sm mb-4">
                <div>
                  <dt className="text-slate-500 mb-0.5">이름</dt>
                  <dd className="text-white">{selected.name ?? '-'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 mb-0.5">이메일</dt>
                  <dd className="text-blue-400">{selected.email}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 mb-0.5">서비스</dt>
                  <dd className="text-white">{SERVICE_LABELS[selected.service] ?? selected.service}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 mb-0.5">접수일</dt>
                  <dd className="text-slate-300">{new Date(selected.created_at).toLocaleString('ko-KR')}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 mb-1">내용</dt>
                  <dd className="text-slate-200 bg-slate-800 rounded-lg p-3 leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </dd>
                </div>
              </dl>

              {/* 상태 변경 */}
              <div>
                <p className="text-slate-500 text-xs mb-2">상태 변경</p>
                <div className="flex gap-2">
                  {(['pending', 'in_progress', 'completed'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      disabled={selected.status === s || updating === selected.id}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                        selected.status === s
                          ? STATUS_LABELS[s].color + ' opacity-100'
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      } disabled:opacity-50`}
                    >
                      {STATUS_LABELS[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 이메일 바로 보내기 링크 */}
              <a
                href={`mailto:${selected.email}?subject=[쟁승메이드] 문의 답변&body=안녕하세요, 쟁승메이드입니다.%0A%0A`}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-xs hover:bg-blue-600/30 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                이메일 답장하기
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
