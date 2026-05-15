'use client';

import { useEffect, useState } from 'react';

interface SurveyRow {
  id: string;
  created_at: string;
  age_range: string | null;
  status: string | null;
  awareness_freq: string | null;
  tools_used: string[] | null;
  tools_other: string | null;
  cost_range: string | null;
  best_tool: string | null;
  best_satisfy: number | null;
  free_opinion: string | null;
  email: string | null;
  user_agent: string | null;
  referrer: string | null;
  utm_source: string | null;
  completion_seconds: number | null;
}

interface Stats {
  age_range: Record<string, number>;
  status: Record<string, number>;
  awareness_freq: Record<string, number>;
  cost_range: Record<string, number>;
  best_tool: Record<string, number>;
  satisfy_avg: string;
  email_rate: string;
  completion_seconds_median: number;
}

type Range = 'all' | 'today' | 'week';

export default function AdminSurveyPage() {
  const [range, setRange] = useState<Range>('all');
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [rows, setRows] = useState<SurveyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SurveyRow | null>(null);

  useEffect(() => {
    async function load(r: Range) {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/survey?range=${r}`);
        const data = await res.json();
        setTotal(data.total ?? 0);
        setStats(data.stats ?? null);
        setRows(data.responses ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load(range);
  }, [range]);

  function downloadCsv() {
    window.location.href = `/api/admin/survey?range=${range}&format=csv`;
  }

  function fmtCount(counts: Record<string, number> | undefined): string {
    if (!counts) return '';
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k} ${v}`)
      .join(' · ');
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-white text-2xl font-bold">설문 응답</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            CONTOUR PMF 설문 — 총 {total}건
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'today', 'week'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition ${
                range === r
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {r === 'all' ? '전체' : r === 'today' ? '오늘' : '이번 주'}
            </button>
          ))}
          <button
            onClick={downloadCsv}
            className="px-3 py-1.5 rounded-lg text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition"
          >
            📥 CSV
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-2">Q2 자각 빈도</p>
            <p className="text-sm text-white">{fmtCount(stats.awareness_freq) || '데이터 없음'}</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-2">Q4 비용</p>
            <p className="text-sm text-white">{fmtCount(stats.cost_range) || '데이터 없음'}</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-2">Q5 만족도 평균</p>
            <p className="text-xl text-violet-400 font-bold">{stats.satisfy_avg} / 5</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-2">Q7 이메일률 / 완료 시간 (중간값)</p>
            <p className="text-sm text-white">
              {stats.email_rate}% · {stats.completion_seconds_median}s
            </p>
          </div>
        </div>
      )}

      {/* 응답 리스트 */}
      {loading ? (
        <p className="text-slate-400">불러오는 중...</p>
      ) : rows.length === 0 ? (
        <p className="text-slate-500">응답이 없습니다.</p>
      ) : (
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="text-left px-4 py-3">시각</th>
                <th className="text-left px-4 py-3">나이/상황</th>
                <th className="text-left px-4 py-3">Q4 비용</th>
                <th className="text-left px-4 py-3">Q5 만족</th>
                <th className="text-left px-4 py-3">Q6 자유의견 (미리보기)</th>
                <th className="text-left px-4 py-3">이메일</th>
                <th className="text-left px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-slate-800 hover:bg-slate-800/50 transition">
                  <td className="px-4 py-2 text-slate-300">{new Date(r.created_at).toLocaleString('ko-KR')}</td>
                  <td className="px-4 py-2 text-slate-300">{r.age_range} · {r.status}</td>
                  <td className="px-4 py-2 text-slate-300">{r.cost_range ?? '-'}</td>
                  <td className="px-4 py-2 text-slate-300">{r.best_satisfy ?? '-'}</td>
                  <td className="px-4 py-2 text-slate-400 max-w-xs truncate">
                    {r.free_opinion ?? <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-4 py-2 text-slate-300">{r.email ?? '-'}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setSelected(r)}
                      className="text-violet-400 hover:text-violet-300 text-xs font-bold"
                    >
                      상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 상세 modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white font-bold">응답 상세</h2>
                <p className="text-xs text-slate-400 mt-1">{new Date(selected.created_at).toLocaleString('ko-KR')}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <dl className="space-y-3 text-sm">
              {[
                ['Q1 나이대', selected.age_range],
                ['Q1 상황', selected.status],
                ['Q2 자각 빈도', selected.awareness_freq],
                ['Q3 도구', selected.tools_used?.join(', ')],
                ['Q3 기타', selected.tools_other],
                ['Q4 비용', selected.cost_range],
                ['Q5 최고 도구', selected.best_tool],
                ['Q5 만족도', selected.best_satisfy != null ? `${selected.best_satisfy} / 5` : null],
                ['Q6 자유 의견', selected.free_opinion],
                ['Q7 이메일', selected.email],
                ['user_agent', selected.user_agent],
                ['referrer', selected.referrer],
                ['utm_source', selected.utm_source],
                ['완료 시간', selected.completion_seconds != null ? `${selected.completion_seconds}초` : null],
              ].map(([k, v]) => (
                <div key={k as string} className="flex gap-3 border-b border-slate-800 pb-2">
                  <dt className="w-32 text-slate-400 flex-shrink-0">{k}</dt>
                  <dd className="text-white whitespace-pre-wrap break-words flex-1">{(v as string) || <span className="text-slate-600">—</span>}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
