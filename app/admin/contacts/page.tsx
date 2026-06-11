'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { REQUEST_STATUS, RequestStatus } from '@/lib/request-status';

interface QuoteSummary {
  id: string;
  title: string;
  status: string;
}

interface Contact {
  id: string;
  email: string;
  name: string | null;
  service: string;
  message: string;
  status: string;
  created_at: string;
  public_token?: string;
  project_type?: string;
  budget?: string;
  timeline?: string;
  quotes?: QuoteSummary[];
}

/** 상태별 색상 매핑 — admin 다크 톤 bg-*-900/40 text-*-400 */
const STATUS_COLORS: Record<string, string> = {
  pending:     'bg-yellow-900/40 text-yellow-400',
  reviewing:   'bg-sky-900/40 text-sky-400',
  quoted:      'bg-blue-900/40 text-blue-400',
  accepted:    'bg-green-900/40 text-green-400',
  in_progress: 'bg-blue-900/40 text-blue-400',
  completed:   'bg-green-900/40 text-green-400',
  on_hold:     'bg-slate-700/60 text-slate-400',
  cancelled:   'bg-red-900/40 text-red-400',
};

function getStatusColor(status: string): string {
  return STATUS_COLORS[status] ?? 'bg-slate-700/60 text-slate-400';
}

function getStatusLabel(status: string): string {
  return (REQUEST_STATUS as Record<string, { label: string }>)[status]?.label ?? status;
}

const SERVICE_LABELS: Record<string, string> = {
  lotto: '로또 추천',
  stock: '주식 자동매매',
  automation: '업무 자동화',
  prompt: '프롬프트 엔지니어링',
  freelance: '외주 개발',
  saju: 'AI 사주',
  general: '일반 문의',
};

/** 필터 탭 정의 */
const FILTER_TABS: { val: string; label: string }[] = [
  { val: 'all',         label: '전체' },
  { val: 'pending',     label: '접수' },
  { val: 'reviewing',   label: '검토중' },
  { val: 'quoted',      label: '견적 발송' },
  { val: 'accepted',    label: '수주 확정' },
  { val: 'in_progress', label: '진행중' },
  { val: 'completed',   label: '완료' },
  { val: '__other',     label: '기타' },
];

const OTHER_STATUSES = new Set(['on_hold', 'cancelled']);

function matchFilter(status: string, filterVal: string): boolean {
  if (filterVal === 'all') return true;
  if (filterVal === '__other') return OTHER_STATUSES.has(status);
  return status === filterVal;
}

function filterCount(contacts: Contact[], filterVal: string): number {
  if (filterVal === 'all') return contacts.length;
  return contacts.filter((c) => matchFilter(c.status, filterVal)).length;
}

export default function AdminContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [creatingQuote, setCreatingQuote] = useState(false);
  const [copied, setCopied] = useState(false);

  async function createQuote(contact: Contact) {
    setCreatingQuote(true);
    try {
      const title = `${SERVICE_LABELS[contact.service] ?? contact.service ?? '외주 문의'} — ${contact.name ?? ''}`.trim();
      const res = await fetch('/api/admin/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          contact_request_id: contact.id,
          client_name: contact.name ?? '',
          client_email: contact.email,
        }),
      });
      const d = await res.json();
      if (res.ok && d.quote?.id) {
        router.push('/admin/quotes/' + d.quote.id);
      } else {
        alert(d.error || '견적서 생성에 실패했습니다');
      }
    } catch (e) {
      console.error(e);
      alert('견적서 생성 중 오류가 발생했습니다');
    } finally {
      setCreatingQuote(false);
    }
  }

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
          prev.map((c) => (c.id === id ? { ...c, status } : c))
        );
        if (selected?.id === id) {
          setSelected((prev) => prev ? { ...prev, status } : null);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  }

  function copyTrackingLink(token: string) {
    navigator.clipboard.writeText(location.origin + '/track/' + token).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const filtered = contacts.filter((c) => matchFilter(c.status, filterStatus));
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
      <div className="flex gap-2 mb-4 flex-wrap">
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
                {filterCount(contacts, val)}
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
                  onClick={() => {
                    setSelected(contact);
                    setCopied(false);
                  }}
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
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                        {getStatusLabel(contact.status)}
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

              {/* 프로젝트 정보 */}
              {(selected.project_type || selected.budget || selected.timeline) && (
                <div className="mb-4 p-3 bg-slate-800 rounded-lg text-sm space-y-1.5">
                  <p className="text-slate-400 font-medium mb-2">프로젝트 정보</p>
                  {selected.project_type && (
                    <div className="flex gap-2">
                      <span className="text-slate-500 w-16 flex-shrink-0">유형</span>
                      <span className="text-slate-200">{selected.project_type}</span>
                    </div>
                  )}
                  {selected.budget && (
                    <div className="flex gap-2">
                      <span className="text-slate-500 w-16 flex-shrink-0">예산</span>
                      <span className="text-slate-200">{selected.budget}</span>
                    </div>
                  )}
                  {selected.timeline && (
                    <div className="flex gap-2">
                      <span className="text-slate-500 w-16 flex-shrink-0">일정</span>
                      <span className="text-slate-200">{selected.timeline}</span>
                    </div>
                  )}
                </div>
              )}

              {/* 상태 변경 — 8종 select */}
              <div className="mb-3">
                <p className="text-slate-500 text-xs mb-2">상태 변경</p>
                <select
                  value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                  disabled={updating === selected.id}
                  className="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-slate-500 disabled:opacity-50"
                >
                  {(Object.entries(REQUEST_STATUS) as [RequestStatus, { label: string }][]).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                  {/* 레거시 값 폴백 — REQUEST_STATUS에 없는 경우 표시 */}
                  {!(selected.status in REQUEST_STATUS) && (
                    <option value={selected.status}>{selected.status}</option>
                  )}
                </select>
              </div>

              {/* 추적 링크 복사 */}
              {selected.public_token && (
                <button
                  onClick={() => copyTrackingLink(selected.public_token!)}
                  className="mb-2 w-full flex items-center justify-center gap-2 py-2 bg-slate-700/60 text-slate-300 rounded-lg text-xs hover:bg-slate-700 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {copied ? '복사됨!' : '추적 링크 복사'}
                </button>
              )}

              {/* 연결된 견적 */}
              {selected.quotes && selected.quotes.length > 0 && (
                <div className="mb-2">
                  <p className="text-slate-500 text-xs mb-2">연결된 견적</p>
                  <div className="space-y-1">
                    {selected.quotes.map((q) => (
                      <a
                        key={q.id}
                        href={`/admin/quotes/${q.id}`}
                        className="flex items-center justify-between bg-slate-800 rounded-lg px-3 py-2 text-xs hover:bg-slate-700 transition"
                      >
                        <span className="text-slate-200 truncate flex-1 mr-2">{q.title}</span>
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-400">
                          {q.status}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

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

              {/* 견적서 작성 (연결 견적이 있으면 라벨 변경) */}
              <button
                onClick={() => createQuote(selected)}
                disabled={creatingQuote}
                className="mt-2 w-full flex items-center justify-center gap-2 py-2 bg-violet-600/20 text-violet-300 rounded-lg text-xs hover:bg-violet-600/30 transition disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {creatingQuote
                  ? '생성 중...'
                  : selected.quotes && selected.quotes.length > 0
                    ? '추가 견적서 작성'
                    : '견적서 작성'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
