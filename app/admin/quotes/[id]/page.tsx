'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

/* ─── 타입 ─────────────────────────────────────────────── */
interface WBSTask { id: string; name: string; duration: string; description: string; }
interface WBSPhase { id: string; phase: string; tasks: WBSTask[]; }
interface QuoteItem {
  id: string; category: string; name: string; description: string;
  quantity: number; unitPrice: number; optional: boolean;
}
interface MaintenancePlan {
  id: string; name: string; period: string; monthlyFee: number;
  includes: string[]; recommended: boolean;
}
interface QuoteForm {
  title: string; client_name: string; client_email: string;
  valid_until: string; status: string;
  wbs: WBSPhase[]; items: QuoteItem[]; maintenance: MaintenancePlan[]; notes: string;
}

const newId = () => Math.random().toString(36).slice(2, 9);

const STATUS_OPTIONS = [
  { value: 'draft', label: '초안' },
  { value: 'sent', label: '발송됨' },
  { value: 'accepted', label: '수락됨' },
  { value: 'rejected', label: '거절됨' },
];

const ITEM_CATEGORIES = ['기획', '디자인', '개발', '인프라', '유지보수', '기타'];

const TABS = ['기본정보', 'WBS', '견적항목', '향후관리', '특이사항', '진행 단계'] as const;
type Tab = typeof TABS[number];

interface Milestone {
  id: string;
  step_number: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  note: string;
  completed_at: string | null;
}

/* ─── 컴포넌트 ─────────────────────────────────────────── */
export default function QuoteEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [tab, setTab] = useState<Tab>('기본정보');
  const [form, setForm] = useState<QuoteForm>({
    title: '새 견적서', client_name: '', client_email: '',
    valid_until: '', status: 'draft',
    wbs: [], items: [], maintenance: [], notes: '',
  });
  const [publicToken, setPublicToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [mileSaving, setMileSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/quotes/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.quote) {
          const q = d.quote;
          setForm({
            title: q.title, client_name: q.client_name, client_email: q.client_email,
            valid_until: q.valid_until?.slice(0, 10) ?? '', status: q.status,
            wbs: q.wbs ?? [], items: q.items ?? [],
            maintenance: q.maintenance ?? [], notes: q.notes ?? '',
          });
          setPublicToken(q.public_token);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const save = useCallback(async (silent = false) => {
    if (!silent) setSaving(true);
    await fetch(`/api/admin/quotes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!silent) { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  }, [id, form]);

  // ── Milestones ──────────────────────────
  async function fetchMilestones() {
    const res = await fetch(`/api/admin/milestones?quoteId=${id}`);
    const d = await res.json();
    setMilestones(d.milestones ?? []);
  }

  async function initDefaultMilestones() {
    if (!confirm('기존 단계를 삭제하고 기본 7단계로 초기화할까요?')) return;
    const res = await fetch('/api/admin/milestones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ useDefaults: true, quoteId: id }),
    });
    const d = await res.json();
    setMilestones(d.milestones ?? []);
  }

  async function updateMilestone(mid: string, field: string, value: string) {
    setMileSaving(mid);
    const res = await fetch(`/api/admin/milestones/${mid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    const d = await res.json();
    if (d.milestone) {
      setMilestones((prev) => prev.map((m) => m.id === mid ? d.milestone : m));
    }
    setMileSaving(null);
  }

  // ── helpers ────────────────────────────
  const setField = (k: keyof QuoteForm, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const totalPrice = form.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/quote/${publicToken}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  // ── WBS ────────────────────────────────
  function addPhase() {
    setField('wbs', [...form.wbs, { id: newId(), phase: '새 단계', tasks: [] }]);
  }
  function updatePhase(phaseId: string, k: string, v: string) {
    setField('wbs', form.wbs.map((p) => p.id === phaseId ? { ...p, [k]: v } : p));
  }
  function removePhase(phaseId: string) {
    setField('wbs', form.wbs.filter((p) => p.id !== phaseId));
  }
  function addTask(phaseId: string) {
    setField('wbs', form.wbs.map((p) => p.id === phaseId
      ? { ...p, tasks: [...p.tasks, { id: newId(), name: '새 작업', duration: '1일', description: '' }] }
      : p));
  }
  function updateTask(phaseId: string, taskId: string, k: string, v: string) {
    setField('wbs', form.wbs.map((p) => p.id === phaseId
      ? { ...p, tasks: p.tasks.map((t) => t.id === taskId ? { ...t, [k]: v } : t) }
      : p));
  }
  function removeTask(phaseId: string, taskId: string) {
    setField('wbs', form.wbs.map((p) => p.id === phaseId
      ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) }
      : p));
  }

  // ── Items ───────────────────────────────
  function addItem() {
    setField('items', [...form.items, {
      id: newId(), category: '개발', name: '', description: '',
      quantity: 1, unitPrice: 0, optional: false,
    }]);
  }
  function updateItem(itemId: string, k: string, v: unknown) {
    setField('items', form.items.map((i) => i.id === itemId ? { ...i, [k]: v } : i));
  }
  function removeItem(itemId: string) {
    setField('items', form.items.filter((i) => i.id !== itemId));
  }

  // ── Maintenance ─────────────────────────
  function addPlan() {
    setField('maintenance', [...form.maintenance, {
      id: newId(), name: '기본 유지보수', period: '3개월',
      monthlyFee: 0, includes: ['버그 수정', '소소한 변경'], recommended: false,
    }]);
  }
  function updatePlan(planId: string, k: string, v: unknown) {
    setField('maintenance', form.maintenance.map((p) => p.id === planId ? { ...p, [k]: v } : p));
  }
  function removePlan(planId: string) {
    setField('maintenance', form.maintenance.filter((p) => p.id !== planId));
  }
  function updatePlanInclude(planId: string, idx: number, v: string) {
    setField('maintenance', form.maintenance.map((p) => p.id === planId
      ? { ...p, includes: p.includes.map((inc, i) => i === idx ? v : inc) }
      : p));
  }
  function addPlanInclude(planId: string) {
    setField('maintenance', form.maintenance.map((p) => p.id === planId
      ? { ...p, includes: [...p.includes, ''] }
      : p));
  }
  function removePlanInclude(planId: string, idx: number) {
    setField('maintenance', form.maintenance.map((p) => p.id === planId
      ? { ...p, includes: p.includes.filter((_, i) => i !== idx) }
      : p));
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full text-slate-500 p-20">불러오는 중...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* 상단 바 */}
      <div className="sticky top-0 z-10 bg-slate-950 border-b border-slate-800 px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/quotes" className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">{form.title || '견적서 편집'}</h1>
            <p className="text-slate-500 text-xs">{form.client_name || '고객 미지정'} · 합계 {totalPrice.toLocaleString()}원</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 공개 링크 */}
          {publicToken && (
            <button onClick={copyLink} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${copied ? 'border-green-500 text-green-400 bg-green-900/20' : 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copied ? '복사됨!' : '고객 링크 복사'}
            </button>
          )}
          {/* 미리보기 */}
          {publicToken && (
            <a href={`/quote/${publicToken}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              미리보기
            </a>
          )}
          {/* PDF 저장 */}
          {publicToken && (
            <a href={`/quote/${publicToken}?print=1`} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-violet-700 text-violet-400 hover:text-violet-300 hover:border-violet-500 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v6m-3-3l3 3 3-3" />
              </svg>
              PDF 저장
            </a>
          )}
          {/* 저장 */}
          <button onClick={() => save()} disabled={saving}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'} disabled:opacity-60`}>
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
              saved ? '✓ 저장됨' : '저장'}
          </button>
        </div>
      </div>

      {/* 탭 */}
      <div className="border-b border-slate-800 px-8">
        <div className="flex gap-0">
          {TABS.map((t) => (
            <button key={t} onClick={() => { setTab(t); if (t === '진행 단계') fetchMilestones(); }}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-all ${tab === t ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto p-8">

        {/* ── 기본정보 ── */}
        {tab === '기본정보' && (
          <div className="max-w-2xl space-y-6">
            <div className="grid grid-cols-1 gap-5">
              <Field label="견적서명">
                <input className={inp} value={form.title} onChange={(e) => setField('title', e.target.value)} placeholder="예: 쇼핑몰 개발 견적서 v1.0" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="고객명">
                  <input className={inp} value={form.client_name} onChange={(e) => setField('client_name', e.target.value)} placeholder="홍길동" />
                </Field>
                <Field label="고객 이메일">
                  <input className={inp} type="email" value={form.client_email} onChange={(e) => setField('client_email', e.target.value)} placeholder="client@example.com" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="유효기간">
                  <input className={inp} type="date" value={form.valid_until} onChange={(e) => setField('valid_until', e.target.value)} />
                </Field>
                <Field label="상태">
                  <select className={inp} value={form.status} onChange={(e) => setField('status', e.target.value)}>
                    {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            {/* 요약 카드 */}
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-5">
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">견적 요약</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{form.items.length}</div>
                  <div className="text-slate-500 text-xs mt-1">총 항목</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{form.items.filter(i => !i.optional).length}</div>
                  <div className="text-slate-500 text-xs mt-1">필수 항목</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-violet-400">{form.items.filter(i => i.optional).length}</div>
                  <div className="text-slate-500 text-xs mt-1">선택 항목</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 text-sm">총 견적 금액</span>
                <span className="text-xl font-bold text-white">{totalPrice.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        )}

        {/* ── WBS ── */}
        {tab === 'WBS' && (
          <div className="max-w-4xl space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">작업 분류 체계(WBS)를 단계별로 작성합니다</p>
              <button onClick={addPhase} className={addBtn}>+ 단계 추가</button>
            </div>
            {form.wbs.length === 0 && (
              <EmptyState icon="📋" msg="단계를 추가해 WBS를 작성해보세요" />
            )}
            {form.wbs.map((phase, pi) => (
              <div key={phase.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <div className="flex items-center gap-3 p-4 bg-slate-800/40">
                  <span className="text-slate-500 text-sm font-mono w-6 text-center">{pi + 1}</span>
                  <input
                    className="flex-1 bg-transparent text-white font-semibold focus:outline-none"
                    value={phase.phase}
                    onChange={(e) => updatePhase(phase.id, 'phase', e.target.value)}
                    placeholder="단계명 (예: 기획, 디자인, 개발)"
                  />
                  <button onClick={() => addTask(phase.id)} className="text-xs text-blue-400 hover:text-blue-300 px-3 py-1 rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-all">+ 작업 추가</button>
                  <button onClick={() => removePhase(phase.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                {phase.tasks.length > 0 && (
                  <div className="divide-y divide-slate-800/50">
                    {phase.tasks.map((task) => (
                      <div key={task.id} className="grid grid-cols-12 gap-3 px-4 py-3 items-center">
                        <div className="col-span-4">
                          <input className={inpSm} value={task.name} onChange={(e) => updateTask(phase.id, task.id, 'name', e.target.value)} placeholder="작업명" />
                        </div>
                        <div className="col-span-2">
                          <input className={inpSm} value={task.duration} onChange={(e) => updateTask(phase.id, task.id, 'duration', e.target.value)} placeholder="기간 (예: 3일)" />
                        </div>
                        <div className="col-span-5">
                          <input className={inpSm} value={task.description} onChange={(e) => updateTask(phase.id, task.id, 'description', e.target.value)} placeholder="작업 설명" />
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <button onClick={() => removeTask(phase.id, task.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {phase.tasks.length === 0 && (
                  <p className="text-slate-600 text-sm text-center py-4">작업 없음 — 위 버튼으로 추가하세요</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── 견적항목 ── */}
        {tab === '견적항목' && (
          <div className="max-w-6xl space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">선택 항목(optional)은 고객이 직접 선택/해제할 수 있습니다</p>
              <button onClick={addItem} className={addBtn}>+ 항목 추가</button>
            </div>

            {/* 헤더 */}
            {form.items.length > 0 && (
              <div className="flex gap-3 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <div className="w-[100px] flex-shrink-0">카테고리</div>
                <div className="w-[200px] flex-shrink-0">항목명</div>
                <div className="flex-1 min-w-[200px]">설명</div>
                <div className="w-[60px] flex-shrink-0 text-right">수량</div>
                <div className="w-[120px] flex-shrink-0 text-right">단가</div>
                <div className="w-[50px] flex-shrink-0 text-center">선택</div>
                <div className="w-[32px] flex-shrink-0" />
              </div>
            )}

            {form.items.length === 0 && <EmptyState icon="💰" msg="항목을 추가해 견적을 구성해보세요" />}

            {form.items.map((item) => (
              <div key={item.id} className={`flex gap-3 px-4 py-3 rounded-xl border items-center transition-all ${item.optional ? 'bg-violet-900/10 border-violet-800/30' : 'bg-slate-900 border-slate-800'}`}>
                <div className="w-[100px] flex-shrink-0">
                  <select className={inpSm} value={item.category} onChange={(e) => updateItem(item.id, 'category', e.target.value)}>
                    {ITEM_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="w-[200px] flex-shrink-0">
                  <input className={inpSm} value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} placeholder="항목명" />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <input className={inpSm} value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} placeholder="상세 설명" />
                </div>
                <div className="w-[60px] flex-shrink-0">
                  <input className={`${inpSm} text-right`} type="number" min={1} value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} />
                </div>
                <div className="w-[120px] flex-shrink-0">
                  <input className={`${inpSm} text-right`} type="number" min={0} step={10000} value={item.unitPrice} onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))} />
                </div>
                <div className="w-[50px] flex-shrink-0 flex justify-center">
                  <button
                    onClick={() => updateItem(item.id, 'optional', !item.optional)}
                    title={item.optional ? '선택 항목 (클릭시 필수로)' : '필수 항목 (클릭시 선택으로)'}
                    className={`w-10 h-5 rounded-full transition-all relative ${item.optional ? 'bg-violet-500' : 'bg-slate-600'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${item.optional ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>
                <div className="w-[32px] flex-shrink-0 flex justify-end">
                  <button onClick={() => removeItem(item.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            ))}

            {/* 합계 */}
            {form.items.length > 0 && (
              <div className="flex justify-end pt-4">
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 w-72 space-y-2">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>필수 합계</span>
                    <span className="font-mono">{form.items.filter(i => !i.optional).reduce((s, i) => s + i.unitPrice * i.quantity, 0).toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm text-violet-400">
                    <span>선택 합계</span>
                    <span className="font-mono">{form.items.filter(i => i.optional).reduce((s, i) => s + i.unitPrice * i.quantity, 0).toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-white font-bold pt-2 border-t border-slate-700">
                    <span>전체 합계</span>
                    <span className="font-mono">{totalPrice.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 향후관리 ── */}
        {tab === '향후관리' && (
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">납품 후 유지보수 플랜을 구성합니다 (고객이 하나를 선택)</p>
              <button onClick={addPlan} className={addBtn}>+ 플랜 추가</button>
            </div>
            {form.maintenance.length === 0 && <EmptyState icon="🛡️" msg="유지보수 플랜을 추가해보세요" />}
            {form.maintenance.map((plan) => (
              <div key={plan.id} className={`rounded-xl border p-5 space-y-4 ${plan.recommended ? 'border-blue-500/50 bg-blue-900/10' : 'border-slate-800 bg-slate-900'}`}>
                <div className="flex items-center gap-3">
                  <div className="grid grid-cols-3 gap-3 flex-1">
                    <Field label="플랜명">
                      <input className={inpSm} value={plan.name} onChange={(e) => updatePlan(plan.id, 'name', e.target.value)} placeholder="기본 유지보수" />
                    </Field>
                    <Field label="기간">
                      <input className={inpSm} value={plan.period} onChange={(e) => updatePlan(plan.id, 'period', e.target.value)} placeholder="3개월" />
                    </Field>
                    <Field label="월 비용 (원)">
                      <input className={`${inpSm} text-right`} type="number" min={0} step={10000} value={plan.monthlyFee} onChange={(e) => updatePlan(plan.id, 'monthlyFee', Number(e.target.value))} />
                    </Field>
                  </div>
                  <div className="flex flex-col items-center gap-1 pb-1">
                    <span className="text-slate-500 text-xs">추천</span>
                    <button
                      onClick={() => updatePlan(plan.id, 'recommended', !plan.recommended)}
                      className={`w-10 h-5 rounded-full transition-all relative ${plan.recommended ? 'bg-blue-500' : 'bg-slate-600'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${plan.recommended ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  <button onClick={() => removePlan(plan.id)} className="text-slate-600 hover:text-red-400 transition-colors pb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">포함 사항</span>
                    <button onClick={() => addPlanInclude(plan.id)} className="text-xs text-blue-400 hover:text-blue-300">+ 추가</button>
                  </div>
                  <div className="space-y-2">
                    {plan.includes.map((inc, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input className={`${inpSm} flex-1`} value={inc} onChange={(e) => updatePlanInclude(plan.id, idx, e.target.value)} placeholder="포함 사항 입력" />
                        <button onClick={() => removePlanInclude(plan.id, idx)} className="text-slate-600 hover:text-red-400 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── 특이사항 ── */}
        {tab === '특이사항' && (
          <div className="max-w-2xl">
            <Field label="특이사항 및 참고사항">
              <textarea
                className={`${inp} min-h-48 resize-y`}
                value={form.notes}
                onChange={(e) => setField('notes', e.target.value)}
                placeholder="계약 조건, 주의사항, 면책 조항 등을 입력하세요&#10;&#10;예: 본 견적서는 발행일로부터 30일간 유효합니다..."
              />
            </Field>
          </div>
        )}

        {/* ── 진행 단계 ── */}
        {tab === '진행 단계' && (
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold">프로젝트 진행 단계 관리</h3>
                <p className="text-slate-500 text-xs mt-0.5">고객 마이페이지에 실시간으로 표시됩니다</p>
              </div>
              <button
                onClick={initDefaultMilestones}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-600/30 transition-all"
              >
                기본 7단계 초기화
              </button>
            </div>

            {milestones.length === 0 ? (
              <div className="text-center py-12 bg-slate-900 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-sm mb-3">진행 단계가 없습니다</p>
                <p className="text-slate-600 text-xs">위의 &apos;기본 7단계 초기화&apos; 버튼으로 표준 단계를 추가하세요</p>
              </div>
            ) : (
              <div className="space-y-3">
                {milestones.map((m) => (
                  <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        m.status === 'completed'   ? 'bg-emerald-600 text-white' :
                        m.status === 'in_progress' ? 'bg-blue-600 text-white' :
                        'bg-slate-700 text-slate-400'
                      }`}>{m.step_number}</span>
                      <span className="text-white font-semibold text-sm flex-1">{m.title}</span>
                      <select
                        value={m.status}
                        onChange={(e) => updateMilestone(m.id, 'status', e.target.value)}
                        disabled={mileSaving === m.id}
                        className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                      >
                        <option value="pending">대기</option>
                        <option value="in_progress">진행 중</option>
                        <option value="completed">완료</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">고객에게 보여줄 메모 (선택)</label>
                      <input
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                        value={m.note}
                        onChange={(e) => updateMilestone(m.id, 'note', e.target.value)}
                        placeholder="예: 디자인 시안 2종 검토 중, 내일 공유 예정입니다"
                      />
                    </div>
                    {m.completed_at && (
                      <p className="text-xs text-emerald-600">완료: {new Date(m.completed_at).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    )}
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

/* ─── 서브 컴포넌트 ────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function EmptyState({ icon, msg }: { icon: string; msg: string }) {
  return (
    <div className="text-center py-12 bg-slate-900 rounded-xl border border-slate-800">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-slate-500 text-sm">{msg}</p>
    </div>
  );
}

/* ─── 스타일 상수 ──────────────────────────────────────── */
const inp = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors';
const inpSm = 'w-full bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors';
const addBtn = 'px-4 py-1.5 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all';
