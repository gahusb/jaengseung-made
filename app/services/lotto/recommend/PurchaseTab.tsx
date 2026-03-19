'use client';

import { useState, useEffect } from 'react';

interface PurchaseRecord {
  id: number;
  draw_no: number;
  amount: number;
  sets: number;
  prize: number;
  note: string;
  created_at: string;
}

interface PurchaseStats {
  total_records: number;
  total_invested: number;
  total_prize: number;
  net: number;
  return_rate: number;
  prize_count: number;
  max_prize: number;
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '.75rem', padding: '1rem', textAlign: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,.35)', fontSize: '.65rem', marginBottom: '.4rem' }}>{label}</div>
      <div style={{ color: color ?? '#fff', fontSize: '1.3rem', fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ color: 'rgba(255,255,255,.25)', fontSize: '.6rem', marginTop: '.2rem' }}>{sub}</div>}
    </div>
  );
}

export default function PurchaseTab() {
  const [records, setRecords] = useState<PurchaseRecord[]>([]);
  const [stats, setStats] = useState<PurchaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrize, setEditPrize] = useState('');
  const [editNote, setEditNote] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ draw_no: '', amount: '5000', sets: '5', prize: '0', note: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [recRes, statRes] = await Promise.all([
        fetch('/api/lotto/purchase').then(r => r.json()),
        fetch('/api/lotto/purchase/stats').then(r => r.json()),
      ]);
      setRecords(recRes.records ?? []);
      setStats(statRes);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!addForm.draw_no) return;
    setSaving(true);
    try {
      await fetch('/api/lotto/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draw_no: parseInt(addForm.draw_no),
          amount: parseInt(addForm.amount),
          sets: parseInt(addForm.sets),
          prize: parseInt(addForm.prize),
          note: addForm.note,
        }),
      });
      setShowAdd(false);
      setAddForm({ draw_no: '', amount: '5000', sets: '5', prize: '0', note: '' });
      await load();
    } finally { setSaving(false); }
  };

  const handleUpdate = async (id: number) => {
    setSaving(true);
    try {
      await fetch(`/api/lotto/purchase/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prize: parseInt(editPrize) || 0, note: editNote }),
      });
      setEditingId(null);
      await load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return;
    await fetch(`/api/lotto/purchase/${id}`, { method: 'DELETE' });
    await load();
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)',
    borderRadius: '.4rem', padding: '.35rem .65rem', color: '#fff', fontSize: '.78rem', width: '100%',
    outline: 'none',
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(251,191,36,.15)', borderTop: '3px solid #fbbf24', animation: 'spin .8s linear infinite', margin: '0 auto 1rem' }} />
    </div>
  );

  return (
    <div style={{ animation: 'slideUp .4s ease forwards' }}>

      {/* 통계 카드 */}
      {stats && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: 'rgba(251,191,36,.5)', letterSpacing: '.12em', marginBottom: '.75rem' }}>INVESTMENT STATS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: '.6rem' }}>
            <StatCard label="총 구매금액" value={`${(stats.total_invested / 10000).toFixed(1)}만원`} sub={`${stats.total_records}회 구매`} />
            <StatCard label="총 당첨금" value={`${(stats.total_prize / 10000).toFixed(1)}만원`} sub={`${stats.prize_count}건 당첨`} color="#4ade80" />
            <StatCard
              label="순손익"
              value={`${stats.net >= 0 ? '+' : ''}${(stats.net / 10000).toFixed(1)}만원`}
              sub={`회수율 ${stats.return_rate.toFixed(1)}%`}
              color={stats.net >= 0 ? '#4ade80' : '#f87171'}
            />
            <StatCard label="최대 당첨금" value={stats.max_prize > 0 ? `${stats.max_prize.toLocaleString()}원` : '-'} color="#fbbf24" />
          </div>
        </div>
      )}

      {/* 구매 기록 테이블 */}
      <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '1rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'rgba(255,255,255,.4)', letterSpacing: '.1em' }}>PURCHASE HISTORY</div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            style={{
              background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.25)',
              color: '#fbbf24', borderRadius: '.5rem', padding: '.3rem .75rem', fontSize: '.72rem', cursor: 'pointer', fontWeight: 700,
            }}>
            + 구매 추가
          </button>
        </div>

        {/* 추가 폼 */}
        {showAdd && (
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,.06)', background: 'rgba(251,191,36,.04)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(100px,1fr))', gap: '.5rem', marginBottom: '.75rem' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '.62rem', marginBottom: '.25rem' }}>회차 *</div>
                <input style={inputStyle} placeholder="1181" value={addForm.draw_no} onChange={e => setAddForm(p => ({ ...p, draw_no: e.target.value }))} />
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '.62rem', marginBottom: '.25rem' }}>구매금액</div>
                <input style={inputStyle} placeholder="5000" value={addForm.amount} onChange={e => setAddForm(p => ({ ...p, amount: e.target.value }))} />
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '.62rem', marginBottom: '.25rem' }}>세트수</div>
                <input style={inputStyle} placeholder="5" value={addForm.sets} onChange={e => setAddForm(p => ({ ...p, sets: e.target.value }))} />
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '.62rem', marginBottom: '.25rem' }}>당첨금</div>
                <input style={inputStyle} placeholder="0" value={addForm.prize} onChange={e => setAddForm(p => ({ ...p, prize: e.target.value }))} />
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '.62rem', marginBottom: '.25rem' }}>메모</div>
                <input style={inputStyle} placeholder="5등 1개" value={addForm.note} onChange={e => setAddForm(p => ({ ...p, note: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <button onClick={handleAdd} disabled={saving || !addForm.draw_no}
                style={{ background: '#fbbf24', color: '#020c1e', border: 'none', borderRadius: '.5rem', padding: '.4rem 1rem', fontSize: '.75rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? '저장 중...' : '저장'}
              </button>
              <button onClick={() => setShowAdd(false)}
                style={{ background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.4)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '.5rem', padding: '.4rem 1rem', fontSize: '.75rem', cursor: 'pointer' }}>
                취소
              </button>
            </div>
          </div>
        )}

        {/* 레코드 목록 */}
        {records.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,.2)', fontSize: '.8rem' }}>
            구매 기록이 없습니다. 구매 후 기록을 추가해보세요.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.75rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                  {['회차', '구매금액', '세트', '당첨금', '손익', '메모', ''].map(h => (
                    <th key={h} style={{ padding: '.6rem 1rem', color: 'rgba(255,255,255,.3)', fontWeight: 600, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map(rec => {
                  const net = rec.prize - rec.amount;
                  const isEditing = editingId === rec.id;
                  return (
                    <tr key={rec.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)', transition: 'background .15s' }}>
                      <td style={{ padding: '.7rem 1rem', color: '#fbbf24', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{rec.draw_no}회</td>
                      <td style={{ padding: '.7rem 1rem', color: 'rgba(255,255,255,.6)' }}>{rec.amount.toLocaleString()}원</td>
                      <td style={{ padding: '.7rem 1rem', color: 'rgba(255,255,255,.4)' }}>{rec.sets}세트</td>
                      <td style={{ padding: '.7rem 1rem' }}>
                        {isEditing ? (
                          <input style={{ ...inputStyle, width: 80 }} value={editPrize} onChange={e => setEditPrize(e.target.value)} />
                        ) : (
                          <span style={{ color: rec.prize > 0 ? '#4ade80' : 'rgba(255,255,255,.3)' }}>
                            {rec.prize > 0 ? `${rec.prize.toLocaleString()}원` : '-'}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '.7rem 1rem', color: net > 0 ? '#4ade80' : net < 0 ? '#f87171' : 'rgba(255,255,255,.3)', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>
                        {net > 0 ? '+' : ''}{net.toLocaleString()}
                      </td>
                      <td style={{ padding: '.7rem 1rem' }}>
                        {isEditing ? (
                          <input style={{ ...inputStyle, width: 100 }} value={editNote} onChange={e => setEditNote(e.target.value)} />
                        ) : (
                          <span style={{ color: 'rgba(255,255,255,.4)' }}>{rec.note || '-'}</span>
                        )}
                      </td>
                      <td style={{ padding: '.7rem 1rem', whiteSpace: 'nowrap' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '.3rem' }}>
                            <button onClick={() => handleUpdate(rec.id)} disabled={saving}
                              style={{ background: '#4ade80', color: '#020c1e', border: 'none', borderRadius: '.35rem', padding: '.25rem .6rem', fontSize: '.65rem', fontWeight: 700, cursor: 'pointer' }}>저장</button>
                            <button onClick={() => setEditingId(null)}
                              style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.4)', border: 'none', borderRadius: '.35rem', padding: '.25rem .6rem', fontSize: '.65rem', cursor: 'pointer' }}>취소</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '.3rem' }}>
                            <button onClick={() => { setEditingId(rec.id); setEditPrize(String(rec.prize)); setEditNote(rec.note); }}
                              style={{ background: 'rgba(251,191,36,.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,.2)', borderRadius: '.35rem', padding: '.25rem .6rem', fontSize: '.65rem', cursor: 'pointer' }}>수정</button>
                            <button onClick={() => handleDelete(rec.id)}
                              style={{ background: 'rgba(239,68,68,.1)', color: '#f87171', border: '1px solid rgba(239,68,68,.2)', borderRadius: '.35rem', padding: '.25rem .6rem', fontSize: '.65rem', cursor: 'pointer' }}>삭제</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
