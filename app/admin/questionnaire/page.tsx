'use client';

import { useState, useEffect } from 'react';

interface QuestionnaireResponse {
  id: string;
  questionnaire_type: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  responses: Record<string, unknown>;
  status: string;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  submitted: { label: '접수', color: 'bg-blue-900/40 text-blue-400 border-blue-500/30' },
  reviewed: { label: '검토완료', color: 'bg-green-900/40 text-green-400 border-green-500/30' },
  archived: { label: '보관', color: 'bg-slate-700/60 text-slate-400 border-slate-500/30' },
};

const QUESTION_LABELS: Record<string, string> = {
  q1: '주 사용 부품 사이트 URL',
  q2: '주요 취급 부품 카테고리',
  q3: '샘플 품번 목록',
  q4: '현재 eBay 리스팅 URL',
  q5: 'eBay 셀러 계정 등급',
  q6: '주 판매 카테고리',
  q7: '예상 월간 리스팅 건수',
  q8: 'Fitment 정확도 기대치',
  q8_detail: 'Fitment 추가 의견',
  q9_selected: '타겟 마켓',
  q9_detail: '타겟 마켓 기타',
  q10: '리스팅 1건 소요 시간',
  q11: '기존 리스팅 관리 방식',
  q11_detail: '서드파티 툴 이름',
  q12: '관세/통관 계산 방식',
  q13: 'eBay Developer API 키 보유',
  q14: '선호 AI 모델',
  q15: '현재 자동화 도구',
  q16: 'AI API 키 보유 여부',
  q17: '포트폴리오 활용 동의',
  additional: '추가 요청사항',
};

export default function AdminQuestionnairePage() {
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<QuestionnaireResponse | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchResponses();
  }, []);

  async function fetchResponses() {
    try {
      const res = await fetch('/api/admin/questionnaire');
      if (!res.ok) throw new Error();
      const json = await res.json();
      setResponses(json.data || []);
    } catch {
      setResponses([]);
    } finally {
      setLoading(false);
    }
  }

  function openDetail(item: QuestionnaireResponse) {
    setSelected(item);
    setAdminNotes(item.admin_notes || '');
  }

  async function updateStatus(id: string, status: string) {
    setSaving(true);
    try {
      await fetch(`/api/admin/questionnaire/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_notes: adminNotes }),
      });
      await fetchResponses();
      if (selected?.id === id) {
        setSelected(prev => prev ? { ...prev, status, admin_notes: adminNotes } : null);
      }
    } finally {
      setSaving(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-white text-2xl font-bold">질문지 응답</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          고객이 제출한 요구사항 질문지 응답을 관리합니다
        </p>
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm py-12 text-center">불러오는 중...</div>
      ) : responses.length === 0 ? (
        <div className="bg-slate-900 rounded-2xl border border-slate-700/50 p-12 text-center">
          <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-slate-400 text-sm">아직 제출된 질문지가 없습니다</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 목록 */}
          <div className="bg-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left text-slate-400 font-medium px-5 py-3">고객명</th>
                  <th className="text-left text-slate-400 font-medium px-5 py-3">이메일</th>
                  <th className="text-left text-slate-400 font-medium px-5 py-3">유형</th>
                  <th className="text-left text-slate-400 font-medium px-5 py-3">상태</th>
                  <th className="text-left text-slate-400 font-medium px-5 py-3">접수일</th>
                  <th className="text-right text-slate-400 font-medium px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {responses.map((item) => {
                  const st = STATUS_CONFIG[item.status] || STATUS_CONFIG.submitted;
                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer transition ${
                        selected?.id === item.id ? 'bg-slate-800/50' : ''
                      }`}
                      onClick={() => openDetail(item)}
                    >
                      <td className="px-5 py-3 text-white font-medium">{item.client_name}</td>
                      <td className="px-5 py-3 text-slate-300">{item.client_email}</td>
                      <td className="px-5 py-3 text-slate-400">{item.questionnaire_type}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${st.color}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-400">{formatDate(item.created_at)}</td>
                      <td className="px-5 py-3 text-right">
                        <svg className="w-4 h-4 text-slate-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 상세 패널 */}
          {selected && (
            <div className="bg-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
                <div>
                  <h3 className="text-white font-semibold">
                    {selected.client_name} — 응답 상세
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {selected.client_email}
                    {selected.client_phone && ` · ${selected.client_phone}`}
                    {' · '}접수: {formatDate(selected.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                {Object.entries(selected.responses).map(([key, value]) => (
                  <div key={key} className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-xs text-slate-400 font-medium mb-1.5">
                      {QUESTION_LABELS[key] || key}
                    </div>
                    <div className="text-white text-sm whitespace-pre-wrap">
                      {Array.isArray(value) ? (value as string[]).join(', ') : String(value)}
                    </div>
                  </div>
                ))}

                {Object.keys(selected.responses).length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-4">응답 내용이 없습니다</p>
                )}
              </div>

              {/* 관리자 메모 + 상태 변경 */}
              <div className="px-5 py-4 border-t border-slate-700/50 space-y-3">
                <div>
                  <label className="text-slate-400 text-xs font-medium block mb-1.5">관리자 메모</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-red-500/50"
                    rows={2}
                    placeholder="내부 참고용 메모..."
                  />
                </div>
                <div className="flex gap-2">
                  {selected.status !== 'reviewed' && (
                    <button
                      onClick={() => updateStatus(selected.id, 'reviewed')}
                      disabled={saving}
                      className="px-4 py-2 rounded-lg text-xs font-medium bg-green-600/20 text-green-400 hover:bg-green-600/30 transition border border-green-500/20 disabled:opacity-50"
                    >
                      {saving ? '저장 중...' : '검토 완료'}
                    </button>
                  )}
                  {selected.status !== 'archived' && (
                    <button
                      onClick={() => updateStatus(selected.id, 'archived')}
                      disabled={saving}
                      className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition disabled:opacity-50"
                    >
                      보관 처리
                    </button>
                  )}
                  {selected.status !== 'submitted' && (
                    <button
                      onClick={() => updateStatus(selected.id, 'submitted')}
                      disabled={saving}
                      className="px-4 py-2 rounded-lg text-xs font-medium bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition border border-blue-500/20 disabled:opacity-50"
                    >
                      접수로 되돌리기
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
