'use client';

import { useState, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface ReportData {
  target_drw_no: number;
  based_on_draw: number;
  generated_at: string;
  hot_numbers: number[];
  cold_numbers: number[];
  overdue_numbers: number[];
  recent_pattern: {
    last3_numbers: number[];
    triple_appear: number[];
    recent_sum_avg: number;
    recent_odd_avg: number;
  };
  recommended_sets: Array<{
    strategy: string;
    numbers: number[];
    description: string;
  }>;
  confidence_score: number;
  confidence_factors: {
    data_volume: number;
    pattern_consistency: number;
    recent_trend: number;
  };
}

interface HistoryItem { drw_no: number; generated_at: string; }

function getBallStyle(n: number) {
  if (n <= 10) return { bg: 'linear-gradient(145deg,#fde68a,#fbbf24,#d97706)', text: '#78350f' };
  if (n <= 20) return { bg: 'linear-gradient(145deg,#93c5fd,#3b82f6,#1d4ed8)', text: '#fff' };
  if (n <= 30) return { bg: 'linear-gradient(145deg,#fca5a5,#ef4444,#b91c1c)', text: '#fff' };
  if (n <= 40) return { bg: 'linear-gradient(145deg,#d1d5db,#9ca3af,#4b5563)', text: '#fff' };
  return { bg: 'linear-gradient(145deg,#86efac,#22c55e,#15803d)', text: '#fff' };
}

function SmallBall({ n, size = 32 }: { n: number; size?: number }) {
  const { bg, text } = getBallStyle(n);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 900, color: text, flexShrink: 0,
      boxShadow: '0 2px 8px rgba(0,0,0,.3)',
    }}>{n}</div>
  );
}

function ConfidenceBar({ label, value }: { label: string; value: number }) {
  const color = value >= 85 ? '#4ade80' : value >= 70 ? '#fbbf24' : '#f87171';
  return (
    <div style={{ marginBottom: '.6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.25rem' }}>
        <span style={{ color: 'rgba(255,255,255,.4)', fontSize: '.7rem' }}>{label}</span>
        <span style={{ color, fontSize: '.7rem', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{value}</span>
      </div>
      <div style={{ height: 5, background: 'rgba(255,255,255,.07)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 3, transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

export default function ReportTab() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/lotto/report/latest').then(r => r.json()),
      fetch('/api/lotto/report/history?limit=10').then(r => r.json()),
    ]).then(([rep, hist]) => {
      if (rep?.error) {
        setError(rep.error === 'NAS_TIMEOUT'
          ? 'NAS 서버 응답 시간 초과. 잠시 후 다시 시도해주세요.'
          : '리포트를 불러오지 못했습니다. (' + rep.error + ')');
        return;
      }
      setReport(rep);
      setHistory(hist?.reports ?? []);
    }).catch(() => setError('리포트를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  const copyNumbers = (numbers: number[], idx: number) => {
    navigator.clipboard.writeText(numbers.join(', '));
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(251,191,36,.15)', borderTop: '3px solid #fbbf24', animation: 'spin .8s linear infinite', margin: '0 auto 1rem' }} />
      <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '.75rem' }}>리포트 불러오는 중...</div>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '4rem 0', color: '#f87171', fontSize: '.85rem' }}>{error}</div>
  );

  if (!report || !report.confidence_factors || !report.recommended_sets) return null;

  const strategyColors = ['#fbbf24', '#60a5fa', '#a78bfa'];

  return (
    <div style={{ animation: 'slideUp .4s ease forwards' }}>

      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '.75rem' }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: 'rgba(251,191,36,.5)', letterSpacing: '.15em', marginBottom: '.3rem' }}>WEEKLY ATTACK REPORT</div>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 900, margin: 0 }}>
            제{report.target_drw_no}회 공략 리포트
          </h2>
          <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '.72rem', marginTop: '.2rem' }}>
            {report.based_on_draw}회까지 데이터 기반 · {new Date(report.generated_at).toLocaleDateString('ko-KR')} 생성
          </div>
        </div>
        {/* 신뢰도 점수 */}
        <div style={{
          background: 'rgba(251,191,36,.08)', border: '1px solid rgba(251,191,36,.2)',
          borderRadius: '1rem', padding: '.75rem 1.25rem', textAlign: 'center',
        }}>
          <div style={{ color: 'rgba(251,191,36,.5)', fontSize: '.6rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em' }}>CONFIDENCE</div>
          <div style={{ color: '#fbbf24', fontSize: '2rem', fontWeight: 900, lineHeight: 1.1, fontFamily: "'JetBrains Mono',monospace" }}>{report.confidence_score}</div>
          <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '.6rem' }}>/100</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>

        {/* 추천 번호 세트 */}
        <div style={{ gridColumn: '1/-1', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '1rem', padding: '1.25rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: 'rgba(251,191,36,.5)', letterSpacing: '.12em', marginBottom: '1rem' }}>RECOMMENDED SETS</div>
          <div style={{ display: 'grid', gap: '.75rem' }}>
            {report.recommended_sets.map((set, i) => (
              <div key={i} style={{
                background: `rgba(${i === 0 ? '251,191,36' : i === 1 ? '96,165,250' : '167,139,250'},.05)`,
                border: `1px solid rgba(${i === 0 ? '251,191,36' : i === 1 ? '96,165,250' : '167,139,250'},.15)`,
                borderRadius: '.75rem', padding: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.6rem', flexWrap: 'wrap', gap: '.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: strategyColors[i] }} />
                    <span style={{ color: strategyColors[i], fontSize: '.72rem', fontWeight: 700 }}>{set.strategy}</span>
                  </div>
                  <button
                    onClick={() => copyNumbers(set.numbers, i)}
                    style={{
                      background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
                      color: copiedIdx === i ? '#4ade80' : 'rgba(255,255,255,.4)',
                      borderRadius: '.4rem', padding: '.2rem .6rem', fontSize: '.65rem', cursor: 'pointer',
                    }}>
                    {copiedIdx === i ? '✓ 복사됨' : '복사'}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '.5rem' }}>
                  {set.numbers.map(n => <SmallBall key={n} n={n} size={36} />)}
                </div>
                <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '.68rem' }}>{set.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 핫/콜드/미출현 */}
        {[
          { label: '🔥 최근 과출현', numbers: report.hot_numbers, color: '#f87171', desc: '최근 10회 2회 이상 출현' },
          { label: '❄️ 저빈도 번호', numbers: report.cold_numbers, color: '#60a5fa', desc: '역대 출현 빈도 하위' },
          { label: '⏳ 장기 미출현', numbers: report.overdue_numbers, color: '#a78bfa', desc: '가장 오래 미출현 번호' },
        ].map(({ label, numbers, color, desc }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '1rem', padding: '1rem' }}>
            <div style={{ color, fontSize: '.75rem', fontWeight: 700, marginBottom: '.3rem' }}>{label}</div>
            <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '.65rem', marginBottom: '.75rem' }}>{desc}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.35rem' }}>
              {numbers.map(n => <SmallBall key={n} n={n} size={30} />)}
            </div>
          </div>
        ))}

        {/* 최근 패턴 */}
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '1rem', padding: '1rem' }}>
          <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '.72rem', fontWeight: 700, marginBottom: '.75rem' }}>📊 최근 패턴</div>
          {[
            { label: '최근 10회 합계 평균', value: report.recent_pattern.recent_sum_avg.toFixed(1) },
            { label: '최근 10회 홀수 평균', value: report.recent_pattern.recent_odd_avg.toFixed(1) + '개' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '.4rem 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <span style={{ color: 'rgba(255,255,255,.3)', fontSize: '.7rem' }}>{label}</span>
              <span style={{ color: '#fbbf24', fontSize: '.7rem', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{value}</span>
            </div>
          ))}
          {report.recent_pattern.triple_appear.length > 0 && (
            <div style={{ marginTop: '.75rem' }}>
              <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '.65rem', marginBottom: '.4rem' }}>직전 3회 연속 출현</div>
              <div style={{ display: 'flex', gap: '.3rem' }}>
                {report.recent_pattern.triple_appear.map(n => <SmallBall key={n} n={n} size={28} />)}
              </div>
            </div>
          )}
        </div>

        {/* 신뢰도 상세 */}
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '1rem', padding: '1rem' }}>
          <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '.72rem', fontWeight: 700, marginBottom: '.75rem' }}>🎯 신뢰도 분석</div>
          <ConfidenceBar label="데이터 충분도" value={report.confidence_factors.data_volume} />
          <ConfidenceBar label="패턴 안정성" value={report.confidence_factors.pattern_consistency} />
          <ConfidenceBar label="최근 트렌드" value={report.confidence_factors.recent_trend} />
        </div>
      </div>

      {/* 이전 리포트 목록 */}
      {history.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', borderRadius: '1rem', padding: '1rem' }}>
          <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '.7rem', fontWeight: 700, marginBottom: '.75rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.08em' }}>REPORT HISTORY</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
            {history.map(h => (
              <button key={h.drw_no}
                style={{
                  background: h.drw_no === report.target_drw_no ? 'rgba(251,191,36,.15)' : 'rgba(255,255,255,.05)',
                  border: `1px solid ${h.drw_no === report.target_drw_no ? 'rgba(251,191,36,.4)' : 'rgba(255,255,255,.1)'}`,
                  color: h.drw_no === report.target_drw_no ? '#fbbf24' : 'rgba(255,255,255,.4)',
                  borderRadius: '.5rem', padding: '.3rem .65rem', fontSize: '.68rem', cursor: 'pointer',
                }}>
                {h.drw_no}회
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
