'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

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
interface Quote {
  id: string; title: string; client_name: string; valid_until: string | null;
  status: string; wbs: WBSPhase[]; items: QuoteItem[];
  maintenance: MaintenancePlan[]; notes: string; created_at: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  기획: '#60a5fa', 디자인: '#f472b6', 개발: '#34d399', 인프라: '#fb923c',
  유지보수: '#a78bfa', 기타: '#94a3b8',
};

export default function QuotePage() {
  const { token } = useParams<{ token: string }>();
  const searchParams = useSearchParams();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // 선택 상태
  const [checkedOptional, setCheckedOptional] = useState<Record<string, boolean>>({});
  const [selectedMaintenance, setSelectedMaintenance] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'wbs' | 'quote' | 'maintenance'>('overview');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/quote/${token}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((d) => {
        setQuote(d.quote);
        // 기본값: 필수 항목은 항상 체크, 선택 항목은 기본 체크
        const init: Record<string, boolean> = {};
        (d.quote.items as QuoteItem[]).forEach((i) => { init[i.id] = true; });
        setCheckedOptional(init);
        // 추천 유지보수 플랜 기본 선택
        const rec = (d.quote.maintenance as MaintenancePlan[]).find((p) => p.recommended);
        if (rec) setSelectedMaintenance(rec.id);
        else if (d.quote.maintenance.length > 0) setSelectedMaintenance(d.quote.maintenance[0].id);
        // ?print=1 파라미터 시 자동 인쇄 다이얼로그
        if (searchParams.get('print') === '1') {
          setTimeout(() => window.print(), 800);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  const requiredItems = quote?.items.filter((i) => !i.optional) ?? [];
  const optionalItems = quote?.items.filter((i) => i.optional) ?? [];

  const requiredTotal = requiredItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const optionalTotal = optionalItems
    .filter((i) => checkedOptional[i.id])
    .reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const selectedPlan = quote?.maintenance.find((p) => p.id === selectedMaintenance);
  const maintenanceTotal = selectedPlan ? selectedPlan.monthlyFee : 0;
  const grandTotal = requiredTotal + optionalTotal;

  async function handleAccept() {
    if (!quote) return;
    setSubmitting(true);
    const selectedItems = quote.items.filter((i) => !i.optional || checkedOptional[i.id]).map((i) => i.id);
    await fetch(`/api/quote/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedItems, selectedMaintenance, total: grandTotal }),
    });
    setSubmitting(false);
    setSubmitted(true);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#475569', fontFamily: 'sans-serif' }}>견적서를 불러오는 중...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (notFound || !quote) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 64 }}>🔍</div>
        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 700, fontFamily: 'sans-serif' }}>견적서를 찾을 수 없습니다</h1>
        <p style={{ color: '#475569', fontFamily: 'sans-serif' }}>링크가 만료되었거나 잘못된 주소입니다</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, padding: 24 }}>
        <style>{`@keyframes pop { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }`}</style>
        <div style={{ fontSize: 80, animation: 'pop 0.5s ease forwards' }}>🎉</div>
        <h1 style={{ color: 'white', fontSize: 28, fontWeight: 800, fontFamily: 'sans-serif', textAlign: 'center' }}>견적을 수락해 주셨습니다!</h1>
        <p style={{ color: '#94a3b8', fontFamily: 'sans-serif', textAlign: 'center', lineHeight: 1.7 }}>
          담당자가 확인 후 빠른 시일 내에 연락드리겠습니다.<br />
          선택하신 내용을 기반으로 계약을 진행합니다.
        </p>
        <div style={{ background: '#0f172a', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 16, padding: '24px 32px', textAlign: 'center' }}>
          <div style={{ color: '#94a3b8', fontSize: 14, fontFamily: 'sans-serif', marginBottom: 8 }}>최종 견적 금액</div>
          <div style={{ color: 'white', fontSize: 36, fontWeight: 800, fontFamily: 'sans-serif' }}>{grandTotal.toLocaleString()}원</div>
          {maintenanceTotal > 0 && (
            <div style={{ color: '#6366f1', fontSize: 14, fontFamily: 'sans-serif', marginTop: 6 }}>+ 유지보수 {maintenanceTotal.toLocaleString()}원/월</div>
          )}
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: '개요' },
    { key: 'wbs', label: 'WBS', show: quote.wbs.length > 0 },
    { key: 'quote', label: '견적 항목', show: quote.items.length > 0 },
    { key: 'maintenance', label: '향후 관리', show: quote.maintenance.length > 0 },
  ].filter((t) => t.show !== false);

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', color: 'white', fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
        * { box-sizing: border-box; }
        input[type=checkbox] { accent-color: #6366f1; width: 18px; height: 18px; cursor: pointer; }
        input[type=radio] { accent-color: #6366f1; width: 18px; height: 18px; cursor: pointer; }
        @media print {
          body { background: white !important; color: #1e293b !important; }
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          [style*="background: #0a0f1e"], [style*="background: #0f172a"] {
            background: white !important;
            color: #1e293b !important;
          }
        }
      `}</style>

      {/* 헤더 */}
      <div style={{ background: 'linear-gradient(180deg, #0f172a 0%, #0a0f1e 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* 브랜드 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>쟁</div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>쟁승메이드</div>
              <div style={{ color: '#475569', fontSize: 11 }}>jaengseung-made.com</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 100 }}>
                공식 견적서
              </span>
              <button
                className="no-print"
                onClick={() => window.print()}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#cbd5e1', fontSize: 13, fontWeight: 600,
                  padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#cbd5e1'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                PDF 저장
              </button>
            </div>
          </div>

          {/* 제목 */}
          <div style={{ animation: 'fadeUp 0.6s ease forwards', paddingBottom: 28 }}>
            <h1 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800, color: 'white', marginBottom: 12, lineHeight: 1.2 }}>
              {quote.title}
            </h1>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {quote.client_name && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 14 }}>
                  <span>👤</span> {quote.client_name} 고객님
                </div>
              )}
              {quote.valid_until && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 14 }}>
                  <span>📅</span> 유효기간: {quote.valid_until.slice(0, 10)}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 14 }}>
                <span>📄</span> 발행일: {new Date(quote.created_at).toLocaleDateString('ko-KR')}
              </div>
            </div>
          </div>

          {/* 탭 */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key as typeof activeTab)}
                style={{
                  padding: '12px 20px', fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer',
                  background: 'none', color: activeTab === t.key ? '#818cf8' : '#64748b',
                  borderBottom: `2px solid ${activeTab === t.key ? '#6366f1' : 'transparent'}`,
                  transition: 'all 0.2s', marginBottom: -1,
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── 개요 ── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, animation: 'fadeUp 0.4s ease' }}>
            <StatCard label="총 필수 항목" value={requiredItems.length + '개'} sub="반드시 포함" color="#60a5fa" />
            <StatCard label="총 선택 항목" value={optionalItems.length + '개'} sub="고객 선택 가능" color="#a78bfa" />
            <StatCard label="필수 견적 합계" value={requiredTotal.toLocaleString() + '원'} sub="VAT 별도" color="#34d399" />
            <StatCard
              label="선택 포함 합계"
              value={grandTotal.toLocaleString() + '원'}
              sub={optionalItems.filter(i => checkedOptional[i.id]).length + '개 선택됨'}
              color="#f59e0b"
            />
          </div>
        )}

        {/* ── WBS ── */}
        {activeTab === 'wbs' && (
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            {quote.wbs.map((phase, pi) => (
              <div key={phase.id} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                    {pi + 1}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{phase.phase}</h3>
                </div>
                <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <th style={thStyle}>작업명</th>
                        <th style={{ ...thStyle, width: 100 }}>기간</th>
                        <th style={thStyle}>설명</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phase.tasks.map((task) => (
                        <tr key={task.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={tdStyle}>{task.name}</td>
                          <td style={{ ...tdStyle, color: '#818cf8', fontWeight: 600 }}>{task.duration}</td>
                          <td style={{ ...tdStyle, color: '#64748b' }}>{task.description || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── 견적 항목 ── */}
        {activeTab === 'quote' && (
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            {/* 필수 항목 */}
            {requiredItems.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#60a5fa', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#60a5fa', display: 'inline-block' }} />
                  필수 항목
                </h3>
                <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <th style={thStyle}>카테고리</th>
                        <th style={thStyle}>항목명</th>
                        <th style={thStyle}>설명</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>수량</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>단가</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>금액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requiredItems.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={tdStyle}>
                            <span style={{ background: (CATEGORY_COLORS[item.category] || '#94a3b8') + '20', color: CATEGORY_COLORS[item.category] || '#94a3b8', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100 }}>
                              {item.category}
                            </span>
                          </td>
                          <td style={{ ...tdStyle, fontWeight: 600, color: 'white' }}>{item.name}</td>
                          <td style={{ ...tdStyle, color: '#64748b' }}>{item.description || '—'}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', color: '#94a3b8' }}>{item.quantity}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', color: '#94a3b8', fontFamily: 'monospace' }}>{item.unitPrice.toLocaleString()}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: 'white', fontFamily: 'monospace' }}>{(item.unitPrice * item.quantity).toLocaleString()}원</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* 선택 항목 */}
            {optionalItems.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }} />
                  선택 항목
                </h3>
                <p style={{ color: '#475569', fontSize: 13, marginBottom: 12 }}>아래 항목 중 원하시는 것을 선택하세요 — 총 금액에 실시간으로 반영됩니다</p>
                <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid rgba(167,139,250,0.2)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <th style={{ ...thStyle, width: 50 }}>선택</th>
                        <th style={thStyle}>카테고리</th>
                        <th style={thStyle}>항목명</th>
                        <th style={thStyle}>설명</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>수량</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>금액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {optionalItems.map((item) => (
                        <tr key={item.id}
                          onClick={() => setCheckedOptional((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', background: checkedOptional[item.id] ? 'rgba(167,139,250,0.05)' : 'transparent', transition: 'background 0.2s' }}>
                          <td style={{ ...tdStyle, textAlign: 'center' }}>
                            <input type="checkbox" checked={!!checkedOptional[item.id]} onChange={() => {}} />
                          </td>
                          <td style={tdStyle}>
                            <span style={{ background: (CATEGORY_COLORS[item.category] || '#94a3b8') + '20', color: CATEGORY_COLORS[item.category] || '#94a3b8', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100 }}>
                              {item.category}
                            </span>
                          </td>
                          <td style={{ ...tdStyle, fontWeight: 600, color: checkedOptional[item.id] ? 'white' : '#64748b' }}>{item.name}</td>
                          <td style={{ ...tdStyle, color: '#475569' }}>{item.description || '—'}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', color: '#64748b' }}>{item.quantity}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: checkedOptional[item.id] ? '#a78bfa' : '#475569', fontFamily: 'monospace' }}>
                            {(item.unitPrice * item.quantity).toLocaleString()}원
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* 합계 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px 28px', width: 320 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ color: '#64748b', fontSize: 14 }}>필수 항목</span>
                  <span style={{ color: '#94a3b8', fontSize: 14, fontFamily: 'monospace' }}>{requiredTotal.toLocaleString()}원</span>
                </div>
                {optionalTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ color: '#64748b', fontSize: 14 }}>선택 항목</span>
                    <span style={{ color: '#a78bfa', fontSize: 14, fontFamily: 'monospace' }}>+{optionalTotal.toLocaleString()}원</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>합계 (VAT 별도)</span>
                  <span style={{ color: 'white', fontWeight: 800, fontSize: 24, fontFamily: 'monospace' }}>{grandTotal.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 향후 관리 ── */}
        {activeTab === 'maintenance' && (
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>납품 후 유지보수 플랜을 선택해주세요 (선택 사항)</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {quote.maintenance.map((plan) => {
                const isSelected = selectedMaintenance === plan.id;
                return (
                  <div key={plan.id} onClick={() => setSelectedMaintenance(isSelected ? null : plan.id)}
                    style={{
                      background: isSelected ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))' : '#0f172a',
                      border: `1px solid ${isSelected ? '#6366f1' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: 16, padding: 24, cursor: 'pointer', transition: 'all 0.25s', position: 'relative',
                    }}>
                    {plan.recommended && (
                      <div style={{ position: 'absolute', top: 16, right: 16, background: '#6366f1', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100 }}>추천</div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <input type="radio" checked={isSelected} onChange={() => {}} />
                      <div>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{plan.name}</div>
                        <div style={{ color: '#475569', fontSize: 13 }}>{plan.period}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: isSelected ? '#818cf8' : 'white', marginBottom: 16, fontFamily: 'monospace' }}>
                      {plan.monthlyFee === 0 ? '무료' : plan.monthlyFee.toLocaleString() + '원/월'}
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {plan.includes.map((inc, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#94a3b8' }}>
                          <span style={{ color: '#6366f1', flexShrink: 0, marginTop: 1 }}>✓</span>
                          {inc}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 특이사항 */}
        {quote.notes && (
          <div style={{ marginTop: 40, background: '#0f172a', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>특이사항 및 참고사항</h3>
            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{quote.notes}</p>
          </div>
        )}
      </div>

      {/* 하단 고정 바 — 견적 수락 */}
      {quote.status !== 'accepted' && quote.status !== 'rejected' && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#64748b', fontSize: 13 }}>현재 선택된 견적 합계</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ color: 'white', fontSize: 24, fontWeight: 800, fontFamily: 'monospace' }}>{grandTotal.toLocaleString()}원</span>
                {maintenanceTotal > 0 && selectedPlan && (
                  <span style={{ color: '#6366f1', fontSize: 13 }}>+ {maintenanceTotal.toLocaleString()}원/월 ({selectedPlan.name})</span>
                )}
              </div>
            </div>
            <button onClick={handleAccept} disabled={submitting}
              style={{
                padding: '14px 36px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', fontSize: 16, fontWeight: 700, transition: 'all 0.2s',
                boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
                opacity: submitting ? 0.7 : 1,
              }}>
              {submitting ? '처리 중...' : '이 견적으로 진행하겠습니다 →'}
            </button>
          </div>
        </div>
      )}

      {/* 수락된 경우 */}
      {quote.status === 'accepted' && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(16,185,129,0.1)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(16,185,129,0.3)', padding: '16px 24px', textAlign: 'center' }}>
          <p style={{ color: '#34d399', fontWeight: 600, fontSize: 16 }}>✓ 이미 수락된 견적서입니다</p>
        </div>
      )}

      {/* 하단 여백 */}
      <div style={{ height: 80 }} />
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{ background: '#0f172a', border: `1px solid ${color}20`, borderRadius: 16, padding: 24 }}>
      <div style={{ color: '#475569', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{label}</div>
      <div style={{ color, fontSize: 28, fontWeight: 800, fontFamily: 'monospace', marginBottom: 4 }}>{value}</div>
      <div style={{ color: '#374151', fontSize: 12 }}>{sub}</div>
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' };
const tdStyle: React.CSSProperties = { padding: '14px 16px', fontSize: 14, color: '#94a3b8' };
