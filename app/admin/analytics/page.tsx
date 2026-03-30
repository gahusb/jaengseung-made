'use client';

import { useEffect, useState, useCallback } from 'react';

type RangeKey = '7' | '30' | '90';

interface Summary {
  users: number;
  sessions: number;
  pageviews: number;
}

interface AnalyticsData {
  summary: {
    today: Summary;
    yesterday: Summary;
    week: Summary;
    period: Summary;
  };
  daily: Array<{ date: string; users: number; sessions: number; pageviews: number }>;
  topPages: Array<{ page: string; views: number; users: number }>;
  sources: Array<{ channel: string; sessions: number }>;
  devices: Array<{ device: string; sessions: number }>;
}

const RANGE_LABELS: Record<RangeKey, string> = {
  '7': '최근 7일',
  '30': '최근 30일',
  '90': '최근 90일',
};

const CHANNEL_KO: Record<string, string> = {
  'Organic Search': '검색 (유기)',
  'Direct': '직접 방문',
  'Organic Social': '소셜 미디어',
  'Referral': '외부 링크',
  'Paid Search': '검색 광고',
  'Email': '이메일',
  'Unassigned': '미분류',
};

const DEVICE_KO: Record<string, string> = {
  'desktop': 'PC',
  'mobile': '모바일',
  'tablet': '태블릿',
};

const CHANNEL_COLORS: Record<string, string> = {
  'Organic Search': '#22c55e',
  'Direct': '#3b82f6',
  'Organic Social': '#a855f7',
  'Referral': '#f59e0b',
  'Paid Search': '#ef4444',
  'Email': '#06b6d4',
  'Unassigned': '#64748b',
};

function fmt(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

function fmtDate(yyyymmdd: string) {
  const m = yyyymmdd.slice(4, 6);
  const d = yyyymmdd.slice(6, 8);
  return `${parseInt(m)}/${parseInt(d)}`;
}

// 인라인 막대 차트
function BarChart({ data }: { data: AnalyticsData['daily'] }) {
  const max = Math.max(...data.map((d) => d.users), 1);
  const w = 600;
  const h = 160;
  const padL = 36;
  const padR = 12;
  const padT = 12;
  const padB = 32;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;
  const barW = Math.max(2, chartW / data.length - 2);

  // Y축 눈금
  const ticks = [0, Math.ceil(max / 2), max];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 160 }}>
      {/* Y 눈금선 */}
      {ticks.map((t) => {
        const y = padT + chartH - (t / max) * chartH;
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="#1e293b" strokeWidth={1} />
            <text x={padL - 4} y={y + 4} textAnchor="end" fontSize={10} fill="#475569">
              {fmt(t)}
            </text>
          </g>
        );
      })}

      {/* 막대 + X 레이블 */}
      {data.map((d, i) => {
        const x = padL + (i / data.length) * chartW + (chartW / data.length - barW) / 2;
        const barH = Math.max(2, (d.users / max) * chartH);
        const y = padT + chartH - barH;
        const showLabel = data.length <= 14 || i % Math.ceil(data.length / 10) === 0;
        return (
          <g key={d.date}>
            <rect x={x} y={y} width={barW} height={barH} rx={2} fill="#3b82f6" opacity={0.85} />
            {showLabel && (
              <text
                x={x + barW / 2}
                y={h - 4}
                textAnchor="middle"
                fontSize={9}
                fill="#475569"
              >
                {fmtDate(d.date)}
              </text>
            )}
            <title>{`${fmtDate(d.date)}: ${d.users}명`}</title>
          </g>
        );
      })}
    </svg>
  );
}

// 유입 경로 가로 바
function SourceBar({ channel, sessions, total }: { channel: string; sessions: number; total: number }) {
  const pct = total > 0 ? (sessions / total) * 100 : 0;
  const color = CHANNEL_COLORS[channel] ?? '#64748b';
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 text-xs text-slate-400 truncate flex-shrink-0">
        {CHANNEL_KO[channel] ?? channel}
      </div>
      <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="text-xs text-slate-300 w-12 text-right flex-shrink-0">{sessions.toLocaleString()}</div>
      <div className="text-xs text-slate-500 w-10 text-right flex-shrink-0">{pct.toFixed(1)}%</div>
    </div>
  );
}

function StatCard({
  label, value, sub, trend,
}: {
  label: string;
  value: number;
  sub?: string;
  trend?: number; // 양수: 증가, 음수: 감소
}) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
      <p className="text-slate-400 text-xs font-medium mb-1">{label}</p>
      <p className="text-white text-2xl font-bold">{value.toLocaleString()}</p>
      {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
      {trend !== undefined && (
        <p className={`text-xs mt-1 font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(0)}% vs 어제
        </p>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<RangeKey>('30');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (r: RangeKey) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/analytics?range=${r}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? '데이터 로드 실패');
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(range);
  }, [range, load]);

  const todayTrend =
    data && data.summary.yesterday.users > 0
      ? ((data.summary.today.users - data.summary.yesterday.users) / data.summary.yesterday.users) * 100
      : undefined;

  const totalSessions = data?.sources.reduce((s, c) => s + c.sessions, 0) ?? 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-white text-xl font-bold">방문자 분석</h1>
          <p className="text-slate-400 text-sm mt-0.5">Google Analytics 4 데이터</p>
        </div>
        {/* 기간 선택 */}
        <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
          {(Object.keys(RANGE_LABELS) as RangeKey[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                range === r
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {/* 에러 / 설정 안내 */}
      {error && (
        <div className="bg-red-900/30 border border-red-700/40 rounded-xl p-4 text-sm text-red-300 space-y-2">
          <p className="font-semibold">⚠ 데이터를 불러올 수 없습니다</p>
          <p>{error}</p>
          {(error.includes('GOOGLE_SERVICE_ACCOUNT_JSON') || error.includes('GA4_PROPERTY_ID')) && (
            <div className="mt-3 bg-slate-900/50 rounded-lg p-3 text-slate-300 space-y-1 text-xs font-mono">
              <p className="text-slate-400 font-sans font-normal mb-2">환경변수 설정 필요 (.env.local + Vercel):</p>
              <p>GOOGLE_SERVICE_ACCOUNT_JSON=&#123;서비스 계정 JSON 전체&#125;</p>
              <p>GA4_PROPERTY_ID=숫자로된_속성ID</p>
            </div>
          )}
        </div>
      )}

      {loading && !error && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {data && !loading && (
        <>
          {/* 요약 카드 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="오늘 방문자"
              value={data.summary.today.users}
              sub={`세션 ${data.summary.today.sessions.toLocaleString()}`}
              trend={todayTrend}
            />
            <StatCard
              label="이번 주 방문자"
              value={data.summary.week.users}
              sub={`페이지뷰 ${data.summary.week.pageviews.toLocaleString()}`}
            />
            <StatCard
              label={`${RANGE_LABELS[range]} 방문자`}
              value={data.summary.period.users}
              sub={`세션 ${data.summary.period.sessions.toLocaleString()}`}
            />
            <StatCard
              label={`${RANGE_LABELS[range]} 페이지뷰`}
              value={data.summary.period.pageviews}
              sub={`방문당 ${data.summary.period.users > 0 ? (data.summary.period.pageviews / data.summary.period.users).toFixed(1) : 0} 페이지`}
            />
          </div>

          {/* 일별 추이 차트 */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5">
            <h2 className="text-white font-semibold text-sm mb-4">
              일별 방문자 추이 <span className="text-slate-500 font-normal ml-1">(활성 사용자)</span>
            </h2>
            {data.daily.length > 0 ? (
              <BarChart data={data.daily} />
            ) : (
              <p className="text-slate-500 text-sm text-center py-8">데이터 없음</p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 유입 경로 */}
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-white font-semibold text-sm mb-4">유입 경로</h2>
              {data.sources.length > 0 ? (
                <div className="space-y-3">
                  {data.sources.slice(0, 7).map((s) => (
                    <SourceBar
                      key={s.channel}
                      channel={s.channel}
                      sessions={s.sessions}
                      total={totalSessions}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm text-center py-6">데이터 없음</p>
              )}
            </div>

            {/* 기기 + 상위 페이지 */}
            <div className="space-y-4">
              {/* 기기 분포 */}
              <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5">
                <h2 className="text-white font-semibold text-sm mb-3">기기 유형</h2>
                <div className="flex gap-3">
                  {data.devices.map((d) => {
                    const pct = totalSessions > 0 ? ((d.sessions / totalSessions) * 100).toFixed(0) : '0';
                    const icons: Record<string, string> = { desktop: '🖥', mobile: '📱', tablet: '⬜' };
                    return (
                      <div key={d.device} className="flex-1 bg-slate-800/60 rounded-lg p-3 text-center">
                        <p className="text-xl">{icons[d.device] ?? '?'}</p>
                        <p className="text-white font-bold text-lg mt-1">{pct}%</p>
                        <p className="text-slate-400 text-xs">{DEVICE_KO[d.device] ?? d.device}</p>
                        <p className="text-slate-500 text-xs">{d.sessions.toLocaleString()} 세션</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 상위 페이지 */}
              <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5">
                <h2 className="text-white font-semibold text-sm mb-3">상위 페이지</h2>
                <div className="space-y-2">
                  {data.topPages.slice(0, 6).map((p, i) => (
                    <div key={p.page} className="flex items-center gap-2 text-sm">
                      <span className="text-slate-600 w-4 text-right flex-shrink-0">{i + 1}</span>
                      <span className="flex-1 text-slate-300 truncate font-mono text-xs">{p.page}</span>
                      <span className="text-blue-400 text-xs flex-shrink-0">{p.views.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="text-slate-600 text-xs text-right">
            Google Analytics 4 · 데이터 기준 최대 24~48시간 지연 가능
          </p>
        </>
      )}
    </div>
  );
}
