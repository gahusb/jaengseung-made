'use client';

import { useState, useEffect } from 'react';

interface PersonalPattern {
  total_analyzed: number;
  number_frequency: Record<string, number>;
  top_picks: number[];
  least_picks: number[];
  pattern: {
    avg_odd_count: number;
    avg_sum: number;
    avg_range: number;
    consecutive_rate: number;
    zone_avg: Record<string, number>;
  };
  vs_draw_avg: {
    odd_diff: number;
    sum_diff: number;
    odd_tendency: string;
    sum_tendency: string;
  };
}

function getBallStyle(n: number) {
  if (n <= 10) return { bg: 'linear-gradient(145deg,#fde68a,#fbbf24,#d97706)', text: '#78350f' };
  if (n <= 20) return { bg: 'linear-gradient(145deg,#93c5fd,#3b82f6,#1d4ed8)', text: '#fff' };
  if (n <= 30) return { bg: 'linear-gradient(145deg,#fca5a5,#ef4444,#b91c1c)', text: '#fff' };
  if (n <= 40) return { bg: 'linear-gradient(145deg,#d1d5db,#9ca3af,#4b5563)', text: '#fff' };
  return { bg: 'linear-gradient(145deg,#86efac,#22c55e,#15803d)', text: '#fff' };
}

function SmallBall({ n, size = 30, freq }: { n: number; size?: number; freq?: number }) {
  const { bg, text } = getBallStyle(n);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%', background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.35, fontWeight: 900, color: text, flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,.3)',
      }}>{n}</div>
      {freq !== undefined && <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '.55rem', fontFamily: "'JetBrains Mono',monospace" }}>{freq}회</div>}
    </div>
  );
}

function ZoneBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
      <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '.65rem', minWidth: 44, fontFamily: "'JetBrains Mono',monospace" }}>{label}</div>
      <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,.06)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#fbbf24,#f97316)', borderRadius: 4, transition: 'width 1s ease' }} />
      </div>
      <div style={{ color: '#fbbf24', fontSize: '.65rem', minWidth: 24, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace" }}>{value.toFixed(1)}</div>
    </div>
  );
}

export default function PatternTab() {
  const [data, setData] = useState<PersonalPattern | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/lotto/analysis/personal').then(r => r.json())
      .then(d => {
        if (d?.error) { setError(d.error === 'NAS_TIMEOUT' ? 'NAS 서버 응답 시간 초과.' : '패턴 분석을 불러오지 못했습니다.'); return; }
        setData(d);
      })
      .catch(() => setError('패턴 분석을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(251,191,36,.15)', borderTop: '3px solid #fbbf24', animation: 'spin .8s linear infinite', margin: '0 auto 1rem' }} />
    </div>
  );

  if (error) return <div style={{ textAlign: 'center', padding: '4rem 0', color: '#f87171', fontSize: '.85rem' }}>{error}</div>;

  if (!data || data.total_analyzed === 0) return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
      <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '.9rem', marginBottom: '.5rem' }}>아직 분석할 데이터가 없습니다</div>
      <div style={{ color: 'rgba(255,255,255,.2)', fontSize: '.75rem' }}>번호 생성 탭에서 번호를 추천받으면 패턴이 쌓입니다</div>
    </div>
  );

  const zoneMax = Math.max(...Object.values(data.pattern.zone_avg));
  const tendencyColor = (tendency: string) =>
    tendency.includes('고') || tendency.includes('홀수') ? '#f87171' : tendency.includes('저') || tendency.includes('짝수') ? '#60a5fa' : '#4ade80';

  return (
    <div style={{ animation: 'slideUp .4s ease forwards' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: 'rgba(251,191,36,.5)', letterSpacing: '.12em', marginBottom: '.3rem' }}>PERSONAL PATTERN ANALYSIS</div>
          <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 900, margin: 0 }}>내 번호 선택 패턴</h2>
        </div>
        <div style={{ background: 'rgba(251,191,36,.08)', border: '1px solid rgba(251,191,36,.2)', borderRadius: '.75rem', padding: '.5rem 1rem', marginLeft: 'auto' }}>
          <span style={{ color: 'rgba(255,255,255,.4)', fontSize: '.65rem' }}>총 분석 </span>
          <span style={{ color: '#fbbf24', fontWeight: 900, fontFamily: "'JetBrains Mono',monospace" }}>{data.total_analyzed}</span>
          <span style={{ color: 'rgba(255,255,255,.4)', fontSize: '.65rem' }}>회</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem' }}>

        {/* 자주 선택한 번호 */}
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '1rem', padding: '1.25rem' }}>
          <div style={{ color: '#fbbf24', fontSize: '.72rem', fontWeight: 700, marginBottom: '.75rem' }}>⭐ 자주 선택한 번호 TOP 10</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
            {data.top_picks.map(n => (
              <SmallBall key={n} n={n} size={34} freq={data.number_frequency[String(n)] ?? 0} />
            ))}
          </div>
        </div>

        {/* 한 번도 안 쓴 번호 */}
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '1rem', padding: '1.25rem' }}>
          <div style={{ color: '#60a5fa', fontSize: '.72rem', fontWeight: 700, marginBottom: '.75rem' }}>💤 거의 안 쓴 번호</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
            {data.least_picks.map(n => <SmallBall key={n} n={n} size={34} />)}
          </div>
          <div style={{ color: 'rgba(255,255,255,.25)', fontSize: '.65rem', marginTop: '.75rem' }}>이 번호들도 가끔 포함해보세요</div>
        </div>

        {/* 패턴 지표 */}
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '1rem', padding: '1.25rem' }}>
          <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '.72rem', fontWeight: 700, marginBottom: '.75rem' }}>📐 선택 패턴 지표</div>
          {[
            { label: '평균 홀수 개수', value: data.pattern.avg_odd_count.toFixed(1) + '개', ref: '역대 평균 3.0개', refColor: 'rgba(255,255,255,.2)' },
            { label: '평균 합계', value: data.pattern.avg_sum.toFixed(0), ref: '역대 평균 138', refColor: 'rgba(255,255,255,.2)' },
            { label: '평균 범위(최대-최소)', value: data.pattern.avg_range.toFixed(1), ref: '', refColor: '' },
            { label: '연속번호 포함률', value: `${(data.pattern.consecutive_rate * 100).toFixed(0)}%`, ref: '', refColor: '' },
          ].map(({ label, value, ref }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '.45rem 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <span style={{ color: 'rgba(255,255,255,.35)', fontSize: '.68rem' }}>{label}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '.8rem', fontFamily: "'JetBrains Mono',monospace" }}>{value}</div>
                {ref && <div style={{ color: 'rgba(255,255,255,.2)', fontSize: '.58rem' }}>{ref}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* 구간별 선택 분포 */}
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '1rem', padding: '1.25rem' }}>
          <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '.72rem', fontWeight: 700, marginBottom: '.75rem' }}>🎯 구간별 선택 분포</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            {Object.entries(data.pattern.zone_avg).map(([zone, val]) => (
              <ZoneBar key={zone} label={zone} value={val} max={zoneMax} />
            ))}
          </div>
        </div>

        {/* 역대 당첨과 비교 */}
        <div style={{ gridColumn: '1/-1', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '1rem', padding: '1.25rem' }}>
          <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '.72rem', fontWeight: 700, marginBottom: '1rem' }}>⚖️ 역대 당첨 평균과 비교</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,.03)', borderRadius: '.75rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '.65rem', marginBottom: '.4rem' }}>홀수 선택 경향</div>
              <div style={{ color: tendencyColor(data.vs_draw_avg.odd_tendency), fontSize: '1.1rem', fontWeight: 900 }}>{data.vs_draw_avg.odd_tendency}</div>
              <div style={{ color: 'rgba(255,255,255,.25)', fontSize: '.65rem', marginTop: '.3rem', fontFamily: "'JetBrains Mono',monospace" }}>
                당첨 평균 대비 {data.vs_draw_avg.odd_diff > 0 ? '+' : ''}{data.vs_draw_avg.odd_diff.toFixed(1)}개
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.03)', borderRadius: '.75rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '.65rem', marginBottom: '.4rem' }}>합계 선택 경향</div>
              <div style={{ color: tendencyColor(data.vs_draw_avg.sum_tendency), fontSize: '1.1rem', fontWeight: 900 }}>{data.vs_draw_avg.sum_tendency}</div>
              <div style={{ color: 'rgba(255,255,255,.25)', fontSize: '.65rem', marginTop: '.3rem', fontFamily: "'JetBrains Mono',monospace" }}>
                당첨 평균 대비 {data.vs_draw_avg.sum_diff > 0 ? '+' : ''}{data.vs_draw_avg.sum_diff.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
