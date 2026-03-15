'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

// ─── 클라이언트 Monte Carlo 폴백 ─────────────────────────────────────────────
// NAS 서버가 응답하지 않을 때 브라우저에서 직접 실행하는 간단한 시뮬레이션

function clientMonteCarlo(): { numbers: number[]; metrics: { sum: number; odd: number; even: number; min: number; max: number; range: number } } {
  const SIMS = 5000;
  let best: number[] = [];
  let bestScore = -Infinity;

  for (let i = 0; i < SIMS; i++) {
    const nums = pickRandom6();
    const score = scoreCombo(nums);
    if (score > bestScore) { bestScore = score; best = nums; }
  }

  const sorted = [...best].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  const odd = sorted.filter(n => n % 2 !== 0).length;
  return {
    numbers: sorted,
    metrics: { sum, odd, even: 6 - odd, min: sorted[0], max: sorted[5], range: sorted[5] - sorted[0] },
  };
}

function pickRandom6(): number[] {
  const pool = Array.from({ length: 45 }, (_, i) => i + 1);
  const result: number[] = [];
  while (result.length < 6) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}

function scoreCombo(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  const odd = sorted.filter(n => n % 2 !== 0).length;
  // 합계 100~175 선호 (역대 평균 138)
  const sumScore = -Math.abs(sum - 138) / 35;
  // 홀짝 2~4개 선호
  const oddScore = odd >= 2 && odd <= 4 ? 0.5 : -0.5;
  // 구간 분산 (1-9, 10-19, 20-29, 30-39, 40-45)
  const zones = new Set(sorted.map(n => Math.min(Math.floor((n - 1) / 10), 4)));
  const zoneScore = zones.size * 0.4;
  return sumScore + oddScore + zoneScore + Math.random() * 0.05;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface LottoMetrics {
  sum: number;
  odd: number;
  even: number;
  min: number;
  max: number;
  range: number;
}

interface RecommendResponse {
  ok: boolean;
  plan: string;
  numbers: number[];
  metrics?: LottoMetrics;
  recent_overlap?: { repeated_numbers: number[] };
}

interface BatchResponse {
  ok: boolean;
  plan: string;
  count: number;
  items: Array<{ numbers: number[]; metrics?: LottoMetrics }>;
}

interface NumberStat {
  number: number;
  frequency_pct: number;
  z_score: number;
  gap: number;
}

interface DashboardResponse {
  ok: boolean;
  plan: string;
  latest: {
    drawNo: number;
    date: string;
    numbers: number[];
    bonus: number;
    metrics: LottoMetrics;
  } | null;
  analysis: {
    total_draws: number;
    mean_sum: number;
    number_stats: NumberStat[];
  } | null;
  simulation: {
    runs: Array<{
      id: number;
      run_at: string;
      strategy: string;
      total_generated: number;
      avg_score: number;
    }>;
  } | null;
}

interface Combo {
  id: number;
  numbers: number[];
  metrics?: LottoMetrics;
  overlap?: number[];
  createdAt: Date;
}

type GenMode = 'single' | 'batch';

const PLAN_LABELS: Record<string, string> = {
  lotto_gold: '🥇 골드',
  lotto_platinum: '💎 플래티넘',
  lotto_diamond: '👑 다이아',
};

// 다이아 플랜은 무제한 (사실상 999)
const PLAN_MAX_COMBOS: Record<string, number> = {
  lotto_gold: 1,
  lotto_platinum: 3,
  lotto_diamond: 999,
};

// ─── Lotto Ball ───────────────────────────────────────────────────────────────

function getBallStyle(n: number): { bg: string; shadow: string; text: string } {
  if (n <= 10) return { bg: 'linear-gradient(145deg,#fde68a,#fbbf24,#d97706)', shadow: 'rgba(251,191,36,.6)', text: '#78350f' };
  if (n <= 20) return { bg: 'linear-gradient(145deg,#93c5fd,#3b82f6,#1d4ed8)', shadow: 'rgba(59,130,246,.6)', text: '#fff' };
  if (n <= 30) return { bg: 'linear-gradient(145deg,#fca5a5,#ef4444,#b91c1c)', shadow: 'rgba(239,68,68,.6)', text: '#fff' };
  if (n <= 40) return { bg: 'linear-gradient(145deg,#d1d5db,#9ca3af,#4b5563)', shadow: 'rgba(107,114,128,.6)', text: '#fff' };
  return { bg: 'linear-gradient(145deg,#86efac,#22c55e,#15803d)', shadow: 'rgba(34,197,94,.6)', text: '#fff' };
}

function LottoBall({ n, size = 52, delay = 0, bounce = false, highlight = false }: {
  n: number; size?: number; delay?: number; bounce?: boolean; highlight?: boolean;
}) {
  const [show, setShow] = useState(!bounce);
  const { bg, shadow, text } = getBallStyle(n);
  useEffect(() => {
    if (!bounce) return;
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [bounce, delay]);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg,
      boxShadow: `0 ${size * .08}px ${size * .3}px ${shadow}${highlight ? ',0 0 0 3px rgba(251,191,36,.8)' : ''},inset 0 1px 0 rgba(255,255,255,.45),inset 0 -2px 4px rgba(0,0,0,.18)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * .35, fontWeight: 900, color: text, flexShrink: 0,
      position: 'relative', userSelect: 'none',
      opacity: show ? 1 : 0,
      transform: show ? 'scale(1) translateY(0)' : 'scale(.2) translateY(20px)',
      transition: `opacity .35s ease ${delay}ms,transform .5s cubic-bezier(.34,1.56,.64,1) ${delay}ms`,
    }}>
      <div style={{ position: 'absolute', top: '14%', left: '18%', width: '38%', height: '28%', background: 'rgba(255,255,255,.38)', borderRadius: '50%', filter: 'blur(2px)', transform: 'rotate(-30deg)', pointerEvents: 'none' }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{n}</span>
    </div>
  );
}

function SpinBall({ n, delay = 0 }: { n: number; delay?: number }) {
  const { bg, shadow, text } = getBallStyle(n);
  return (
    <div style={{
      width: 52, height: 52, borderRadius: '50%', background: bg,
      boxShadow: `0 4px 16px ${shadow},inset 0 1px 0 rgba(255,255,255,.4)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 18, fontWeight: 900, color: text, flexShrink: 0,
      animation: 'spinBounce .9s ease-in-out infinite', animationDelay: `${delay}ms`,
    }}>
      {n}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LottoRecommendPage() {
  const supabase = createClient();

  // 구독 상태
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [plan, setPlan] = useState('');
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [pageReady, setPageReady] = useState(false);

  // 무료 맛보기
  const [previewNumbers, setPreviewNumbers] = useState<number[]>([]);
  const [previewMetrics, setPreviewMetrics] = useState<LottoMetrics | null>(null);
  const [previewState, setPreviewState] = useState<'idle' | 'loading' | 'result' | 'error'>('idle');
  const [previewUsed, setPreviewUsed] = useState(false);
  const [previewSource, setPreviewSource] = useState<'nas' | 'client'>('client');

  // 프리미엄 생성
  const [genMode, setGenMode] = useState<GenMode>('single');
  const [combos, setCombos] = useState<Combo[]>([]);
  const [proState, setProState] = useState<'idle' | 'loading' | 'result' | 'error'>('idle');
  const [proError, setProError] = useState('');
  const idRef = useRef(0);
  // 플랜별 최대 조합 수 (plan 상태가 확정된 후 계산)
  const MAX_COMBOS = PLAN_MAX_COMBOS[plan] ?? 5;

  const SPIN_NUMS = [7, 23, 41, 14, 35, 3];

  // ── 초기화: 인증 + 대시보드 ──
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const res = await fetch('/api/lotto/dashboard');
          if (res.ok) {
            const data: DashboardResponse = await res.json();
            setDashboard(data);
            setPlan(data.plan ?? '');
            setIsSubscribed(true);
          }
          // 403 = 미구독 (pageReady는 true)
        } catch { /* ignore */ }
      }
      setPageReady(true);
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 무료 맛보기 생성 ──
  const handlePreview = async () => {
    if (previewState === 'loading') return;
    setPreviewState('loading');
    try {
      // 1) NAS API 시도
      const res = await fetch('/api/lotto/preview');

      if (res.ok) {
        const data = await res.json();
        setPreviewNumbers([...data.numbers].sort((a, b) => a - b));
        setPreviewMetrics(data.metrics ?? null);
        setPreviewSource('nas');
      } else {
        // 2) NAS 불가 → 클라이언트 Monte Carlo 폴백
        const { numbers, metrics } = clientMonteCarlo();
        setPreviewNumbers(numbers);
        setPreviewMetrics(metrics);
        setPreviewSource('client');
      }

      setPreviewState('result');
      setPreviewUsed(true);
    } catch {
      // 네트워크 자체 오류도 클라이언트 폴백
      try {
        const { numbers, metrics } = clientMonteCarlo();
        setPreviewNumbers(numbers);
        setPreviewMetrics(metrics);
        setPreviewSource('client');
        setPreviewState('result');
        setPreviewUsed(true);
      } catch {
        setPreviewState('error');
      }
    }
  };

  // ── 히스토리 저장 (fire-and-forget) ──
  const saveHistory = (numbers: number[], source: 'nas' | 'client') => {
    if (!plan) return;
    fetch('/api/lotto/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numbers, source, plan_id: plan }),
    }).catch(() => {/* 저장 실패는 조용히 무시 */});
  };

  // ── 프리미엄 번호 생성 ──
  const handleGenerate = async () => {
    if (proState === 'loading' || combos.length >= MAX_COMBOS) return;
    setProState('loading');
    setProError('');
    try {
      const url = genMode === 'batch'
        ? '/api/lotto/recommend?mode=batch'
        : '/api/lotto/recommend?mode=single';
      const res = await fetch(url);
      if (res.status === 403) { setIsSubscribed(false); setProState('idle'); return; }

      // NAS 불가 시 클라이언트 Monte Carlo 폴백
      if (res.status === 503) {
        const count = genMode === 'batch' ? Math.min(5, MAX_COMBOS - combos.length) : 1;
        const newCombos: Combo[] = Array.from({ length: count }, () => {
          idRef.current += 1;
          const { numbers, metrics } = clientMonteCarlo();
          saveHistory(numbers, 'client');
          return { id: idRef.current, numbers, metrics, createdAt: new Date() };
        });
        setCombos((prev) => [...prev, ...newCombos].slice(-MAX_COMBOS));
        setProState('result');
        return;
      }

      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? 'API_ERROR'); }

      if (genMode === 'batch') {
        const data: BatchResponse = await res.json();
        const newCombos: Combo[] = (data.items ?? []).map((item) => {
          idRef.current += 1;
          const numbers = [...item.numbers].sort((a,b)=>a-b);
          saveHistory(numbers, 'nas');
          return { id: idRef.current, numbers, metrics: item.metrics, createdAt: new Date() };
        });
        setCombos((prev) => [...prev, ...newCombos].slice(-MAX_COMBOS));
      } else {
        const data: RecommendResponse = await res.json();
        if (!data.numbers?.length) throw new Error('EMPTY_RESULT');
        idRef.current += 1;
        const numbers = [...data.numbers].sort((a,b)=>a-b);
        saveHistory(numbers, 'nas');
        setCombos((prev) => [...prev, {
          id: idRef.current,
          numbers,
          metrics: data.metrics,
          overlap: data.recent_overlap?.repeated_numbers,
          createdAt: new Date(),
        }]);
      }
      setProState('result');
    } catch (err: unknown) {
      const e = err as { message?: string };
      setProError(e?.message === 'NAS_TIMEOUT' ? 'NAS 서버 응답 시간 초과.' : '생성 중 오류가 발생했습니다.');
      setProState('error');
    }
  };

  const clearCombos = () => { setCombos([]); setProState('idle'); setProError(''); };

  // 핫/콜드 계산
  const hotNumbers = dashboard?.analysis?.number_stats
    ?.filter(s => s.z_score > 0.3)
    .sort((a,b) => b.z_score - a.z_score)
    .slice(0, 8)
    .map(s => s.number) ?? [];
  const coldNumbers = dashboard?.analysis?.number_stats
    ?.filter(s => s.z_score < -0.3)
    .sort((a,b) => b.gap - a.gap)
    .slice(0, 8)
    .map(s => s.number) ?? [];

  const latestRun = dashboard?.simulation?.runs?.[0];
  const totalDraws = dashboard?.analysis?.total_draws;
  const isProLoading = proState === 'loading';
  const isMaxed = combos.length >= MAX_COMBOS;
  const latestCombo = combos.length > 0 ? combos[combos.length - 1] : null;

  if (!pageReady) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#0a0500,#1a0a00 40%,#04102b 75%,#020b1a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(251,191,36,.2)', borderTop: '3px solid #fbbf24', animation: 'spin .8s linear infinite' }} />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Noto+Sans+KR:wght@400;600;700;800;900&display=swap');
        @keyframes spinBounce { 0%,100%{transform:translateY(0) rotate(0deg)} 25%{transform:translateY(-14px) rotate(90deg)} 50%{transform:translateY(0) rotate(180deg)} 75%{transform:translateY(-7px) rotate(270deg)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(251,191,36,.15)} 50%{box-shadow:0 0 40px rgba(251,191,36,.4),0 0 80px rgba(251,191,36,.1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes orbFloat1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.08)} 66%{transform:translate(-20px,30px) scale(.92)} }
        @keyframes orbFloat2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,20px) scale(.92)} 66%{transform:translate(20px,-30px) scale(1.08)} }
        @keyframes badgePop { 0%{transform:scale(.7);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        .gen-btn:not(:disabled):hover{transform:translateY(-2px) scale(1.02)!important;box-shadow:0 10px 40px rgba(251,191,36,.55)!important}
        .gen-btn:not(:disabled):active{transform:translateY(0) scale(.97)!important}
        .combo-card{animation:slideUp .45s ease forwards}
        .mode-tab{transition:all .2s ease}
        .preview-btn:not(:disabled):hover{opacity:.9;transform:translateY(-1px)}
      `}</style>

      <div style={{ minHeight: '100%', background: 'linear-gradient(160deg,#0a0500 0%,#1a0a00 25%,#04102b 60%,#020b1a 100%)', fontFamily:"'Noto Sans KR',sans-serif", position: 'relative', overflow: 'hidden' }}>
        {/* ambient orbs */}
        <div style={{ position:'fixed',top:'8%',left:'3%',width:440,height:440,borderRadius:'50%',background:'radial-gradient(circle,rgba(251,191,36,.07),transparent 70%)',animation:'orbFloat1 14s ease-in-out infinite',pointerEvents:'none',zIndex:0 }} />
        <div style={{ position:'fixed',bottom:'10%',right:'3%',width:520,height:520,borderRadius:'50%',background:'radial-gradient(circle,rgba(59,130,246,.05),transparent 70%)',animation:'orbFloat2 17s ease-in-out infinite',pointerEvents:'none',zIndex:0 }} />

        <div style={{ position:'relative',zIndex:1,maxWidth:900,margin:'0 auto',padding:'2rem 1.5rem 4rem' }}>

          {/* ── Header ── */}
          <div style={{ marginBottom:'2rem' }}>
            <Link href="/services/lotto" style={{ display:'inline-flex',alignItems:'center',gap:'.35rem',color:'rgba(251,191,36,.45)',fontSize:'.78rem',textDecoration:'none',marginBottom:'1.5rem' }}>
              ← 로또 서비스로
            </Link>
            <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem' }}>
              <div>
                <div style={{ fontSize:'.68rem',fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(251,191,36,.55)',marginBottom:'.5rem' }}>
                  Monte Carlo Simulation · 로또 번호 추천
                </div>
                <h1 style={{ fontFamily:"'Black Han Sans',sans-serif",fontSize:'clamp(1.8rem,4.5vw,2.6rem)',color:'#fff',margin:0,lineHeight:1.1 }}>
                  이번 주 로또<br />
                  <span style={{ background:'linear-gradient(90deg,#fbbf24,#f97316,#fbbf24)',backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',animation:'shimmer 3s linear infinite' }}>번호 추천</span>
                </h1>
              </div>
              {isSubscribed && plan && (
                <div style={{ display:'inline-flex',alignItems:'center',gap:'.5rem',background:'linear-gradient(135deg,rgba(251,191,36,.12),rgba(249,115,22,.07))',border:'1px solid rgba(251,191,36,.27)',borderRadius:'2rem',padding:'.5rem 1.1rem',animation:'glowPulse 3s ease-in-out infinite' }}>
                  <div style={{ width:7,height:7,borderRadius:'50%',background:'#4ade80',boxShadow:'0 0 6px rgba(74,222,128,.7)' }} />
                  <span style={{ color:'#fbbf24',fontSize:'.8rem',fontWeight:700 }}>{PLAN_LABELS[plan] ?? plan} 구독 중</span>
                </div>
              )}
            </div>
          </div>

          {/* ── 최신 당첨번호 (구독자에게만) ── */}
          {isSubscribed && dashboard?.latest && (
            <div style={{ background:'linear-gradient(145deg,rgba(255,255,255,.03),rgba(255,255,255,.01))',border:'1px solid rgba(255,255,255,.07)',borderRadius:'1.25rem',padding:'1.25rem 1.5rem',marginBottom:'1.25rem',display:'flex',alignItems:'center',gap:'1.25rem',flexWrap:'wrap' }}>
              <div>
                <div style={{ color:'rgba(255,255,255,.28)',fontSize:'.68rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',marginBottom:'.25rem' }}>최신 당첨번호</div>
                <div style={{ color:'rgba(255,255,255,.5)',fontSize:'.78rem' }}>제{dashboard.latest.drawNo}회 · {dashboard.latest.date}</div>
              </div>
              <div style={{ display:'flex',gap:'.4rem',alignItems:'center',flexWrap:'wrap' }}>
                {dashboard.latest.numbers.map((n,i) => <LottoBall key={i} n={n} size={32} />)}
                <span style={{ color:'rgba(255,255,255,.2)',fontSize:'.8rem',margin:'0 .2rem' }}>+</span>
                <div style={{ position:'relative',width:32,height:32,borderRadius:'50%',border:'2px solid rgba(251,191,36,.4)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <LottoBall n={dashboard.latest.bonus} size={28} />
                </div>
              </div>
              <div style={{ marginLeft:'auto',display:'flex',gap:'1.25rem' }}>
                {[{l:'합계',v:dashboard.latest.metrics.sum},{l:'홀수',v:`${dashboard.latest.metrics.odd}개`},{l:'짝수',v:`${dashboard.latest.metrics.even}개`}].map(s=>(
                  <div key={s.l} style={{ textAlign:'center' }}>
                    <div style={{ color:'#fbbf24',fontSize:'.9rem',fontWeight:800 }}>{s.v}</div>
                    <div style={{ color:'rgba(255,255,255,.25)',fontSize:'.62rem' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════
              무료 맛보기 섹션 (모든 사용자)
          ════════════════════════════════════════════════ */}
          <div style={{ marginBottom:'1.5rem' }}>
            {/* 섹션 라벨 */}
            <div style={{ display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'.875rem' }}>
              <div style={{ display:'inline-flex',alignItems:'center',gap:'.4rem',background:'rgba(74,222,128,.1)',border:'1px solid rgba(74,222,128,.25)',borderRadius:'2rem',padding:'.3rem .85rem' }}>
                <div style={{ width:6,height:6,borderRadius:'50%',background:'#4ade80',boxShadow:'0 0 6px rgba(74,222,128,.7)' }} />
                <span style={{ color:'#4ade80',fontSize:'.7rem',fontWeight:700,letterSpacing:'.08em' }}>무료 맛보기</span>
              </div>
              <span style={{ color:'rgba(255,255,255,.25)',fontSize:'.72rem' }}>1회 무료 번호 추천</span>
            </div>

            <div style={{ background:'linear-gradient(145deg,rgba(74,222,128,.05),rgba(34,197,94,.02))',border:'1px solid rgba(74,222,128,.15)',borderRadius:'1.5rem',padding:'2rem',position:'relative',overflow:'hidden' }}>
              <div style={{ position:'absolute',top:-40,right:-40,width:160,height:160,borderRadius:'50%',background:'radial-gradient(circle,rgba(74,222,128,.06),transparent)',pointerEvents:'none' }} />

              <div style={{ position:'relative',textAlign:'center' }}>
                {/* 번호 표시 영역 */}
                <div style={{ minHeight:90,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'1.5rem',gap:'.65rem',flexWrap:'wrap' }}>
                  {previewState === 'loading' ? (
                    SPIN_NUMS.slice(0,6).map((n,i) => <SpinBall key={i} n={n} delay={i*100} />)
                  ) : previewState === 'result' && previewNumbers.length > 0 ? (
                    previewNumbers.map((n,i) => <LottoBall key={i} n={n} size={62} bounce delay={i*110} />)
                  ) : (
                    Array.from({length:6},(_,i)=>(
                      <div key={i} style={{ width:62,height:62,borderRadius:'50%',border:'2px dashed rgba(74,222,128,.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(74,222,128,.18)',fontSize:'1.3rem',fontWeight:900,animation:`float ${2+i*.28}s ease-in-out infinite`,animationDelay:`${i*.18}s` }}>?</div>
                    ))
                  )}
                </div>

                {/* 맛보기 메트릭 */}
                {previewState === 'result' && previewMetrics && (
                  <div style={{ animation:'slideUp .4s ease' }}>
                    <div style={{ display:'flex',gap:'.75rem',justifyContent:'center',marginBottom:'.75rem',flexWrap:'wrap' }}>
                      {[{l:'합계',v:previewMetrics.sum},{l:'홀수',v:`${previewMetrics.odd}개`},{l:'짝수',v:`${previewMetrics.even}개`},{l:'범위',v:previewMetrics.range}].map(s=>(
                        <div key={s.l} style={{ background:'rgba(74,222,128,.07)',border:'1px solid rgba(74,222,128,.15)',borderRadius:'.5rem',padding:'.3rem .7rem',textAlign:'center' }}>
                          <div style={{ color:'#4ade80',fontSize:'.82rem',fontWeight:800 }}>{s.v}</div>
                          <div style={{ color:'rgba(74,222,128,.45)',fontSize:'.6rem' }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                    {/* 출처 표시 */}
                    <div style={{ display:'inline-flex',alignItems:'center',gap:'.35rem',background:'rgba(0,0,0,.25)',borderRadius:'2rem',padding:'.25rem .75rem',marginBottom:'1rem' }}>
                      <div style={{ width:5,height:5,borderRadius:'50%',background: previewSource==='nas' ? '#4ade80' : '#94a3b8' }} />
                      <span style={{ color:'rgba(255,255,255,.25)',fontSize:'.62rem' }}>
                        {previewSource==='nas' ? 'NAS Monte Carlo 시뮬레이션' : '브라우저 간이 시뮬레이션 (5,000회)'}
                      </span>
                    </div>
                  </div>
                )}

                {previewState === 'error' && (
                  <p style={{ color:'#f87171',fontSize:'.8rem',marginBottom:'1rem',background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:'.75rem',padding:'.6rem 1rem' }}>
                    ⚠️ 번호 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
                  </p>
                )}

                {/* 버튼 */}
                {!previewUsed ? (
                  <button
                    className="preview-btn"
                    onClick={handlePreview}
                    disabled={previewState === 'loading'}
                    style={{ background:'linear-gradient(135deg,#4ade80,#22c55e)',color:'#052e16',border:'none',borderRadius:'.875rem',padding:'.9rem 2.25rem',fontSize:'.95rem',fontWeight:800,cursor:previewState==='loading'?'not-allowed':'pointer',transition:'all .2s',boxShadow:'0 4px 20px rgba(34,197,94,.28)',display:'inline-flex',alignItems:'center',gap:'.5rem' }}>
                    {previewState === 'loading' ? (
                      <><div style={{ width:16,height:16,borderRadius:'50%',border:'2px solid rgba(5,46,22,.3)',borderTop:'2px solid rgba(5,46,22,.7)',animation:'spin .7s linear infinite' }} />생성 중...</>
                    ) : (
                      <>🎰 무료 번호 받기</>
                    )}
                  </button>
                ) : (
                  <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'.75rem' }}>
                    <div style={{ display:'inline-flex',alignItems:'center',gap:'.4rem',background:'rgba(74,222,128,.1)',border:'1px solid rgba(74,222,128,.2)',borderRadius:'2rem',padding:'.4rem 1rem',animation:'badgePop .5s cubic-bezier(.34,1.56,.64,1)' }}>
                      <span style={{ color:'#4ade80',fontSize:'.78rem',fontWeight:700 }}>✓ 오늘의 무료 번호 생성 완료</span>
                    </div>
                    {!isSubscribed && (
                      <p style={{ color:'rgba(255,255,255,.3)',fontSize:'.75rem',margin:0 }}>
                        더 많은 번호와 분석이 필요하다면 아래 구독 플랜을 이용해보세요 ↓
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════
              프리미엄 구독 섹션 (블러 게이트)
          ════════════════════════════════════════════════ */}
          <div style={{ position:'relative' }}>
            {/* 섹션 라벨 */}
            <div style={{ display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'.875rem' }}>
              <div style={{ display:'inline-flex',alignItems:'center',gap:'.4rem',background:'rgba(251,191,36,.1)',border:'1px solid rgba(251,191,36,.25)',borderRadius:'2rem',padding:'.3rem .85rem' }}>
                <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth={2.5}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span style={{ color:'#fbbf24',fontSize:'.7rem',fontWeight:700,letterSpacing:'.08em' }}>구독자 전용</span>
              </div>
              <span style={{ color:'rgba(255,255,255,.25)',fontSize:'.72rem' }}>
                {isSubscribed ? '프리미엄 번호 추천' : '구독 시 제공되는 기능 미리보기'}
              </span>
            </div>

            {/* 프리미엄 컨텐츠 (블러 or 실제) */}
            <div style={{ position:'relative', filter: isSubscribed ? 'none' : 'blur(4px)', opacity: isSubscribed ? 1 : 0.45, pointerEvents: isSubscribed ? 'auto' : 'none', transition: 'filter .3s,opacity .3s', userSelect: isSubscribed ? 'auto' : 'none' }}>

              {/* 생성 카드 */}
              <div style={{ background:'linear-gradient(145deg,rgba(255,255,255,.04),rgba(255,255,255,.015))',border:'1px solid rgba(251,191,36,.16)',borderRadius:'1.75rem',padding:'2.5rem',marginBottom:'1.25rem',backdropFilter:'blur(20px)',position:'relative',overflow:'hidden' }}>
                <div style={{ position:'absolute',top:-70,right:-70,width:220,height:220,borderRadius:'50%',background:'radial-gradient(circle,rgba(251,191,36,.07),transparent)',pointerEvents:'none' }} />
                <div style={{ position:'relative',textAlign:'center' }}>
                  {/* 스탯 */}
                  <div style={{ display:'flex',justifyContent:'center',gap:'2.5rem',marginBottom:'1.75rem',flexWrap:'wrap' }}>
                    {[
                      {icon:'⚡',val:latestRun?`${(latestRun.total_generated/10000).toFixed(0)}만 회`:'10만 회',label:'시뮬레이션'},
                      {icon:'📊',val:totalDraws?`${totalDraws.toLocaleString()}회`:'1,130+',label:'분석 회차'},
                      {icon:'🎯',val:`${combos.length} / ${MAX_COMBOS}`,label:'생성 조합'},
                    ].map(s=>(
                      <div key={s.label} style={{ textAlign:'center' }}>
                        <div style={{ fontSize:'1.05rem',marginBottom:'.2rem' }}>{s.icon}</div>
                        <div style={{ color:'#fbbf24',fontSize:'1.05rem',fontWeight:800 }}>{s.val}</div>
                        <div style={{ color:'rgba(253,230,138,.38)',fontSize:'.68rem',marginTop:'.1rem' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* 모드 탭 */}
                  <div style={{ display:'inline-flex',background:'rgba(0,0,0,.3)',borderRadius:'.75rem',padding:'.25rem',marginBottom:'1.75rem',gap:'.25rem' }}>
                    {(['single','batch'] as const).map(mode=>(
                      <button key={mode} className="mode-tab" onClick={()=>setGenMode(mode)} disabled={isProLoading}
                        style={{ background:genMode===mode?'linear-gradient(135deg,#fbbf24,#f59e0b)':'transparent',color:genMode===mode?'#78350f':'rgba(253,230,138,.45)',border:'none',borderRadius:'.5rem',padding:'.45rem 1.1rem',fontSize:'.78rem',fontWeight:genMode===mode?800:600,cursor:'pointer' }}>
                        {mode==='single'?'단일 생성':`${Math.min(5, MAX_COMBOS - combos.length)}개 배치`}
                      </button>
                    ))}
                  </div>

                  {/* 볼 표시 */}
                  <div style={{ minHeight:100,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'1.75rem',flexWrap:'wrap',gap:'.75rem' }}>
                    {isProLoading ? (
                      SPIN_NUMS.map((n,i)=><SpinBall key={i} n={n} delay={i*100} />)
                    ) : latestCombo ? (
                      latestCombo.numbers.map((n,i)=><LottoBall key={i} n={n} size={68} bounce delay={i*110} highlight={latestCombo.overlap?.includes(n)} />)
                    ) : (
                      Array.from({length:6},(_,i)=>(
                        <div key={i} style={{ width:68,height:68,borderRadius:'50%',border:'2px dashed rgba(251,191,36,.18)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(251,191,36,.14)',fontSize:'1.4rem',fontWeight:900,animation:`float ${2+i*.28}s ease-in-out infinite`,animationDelay:`${i*.18}s` }}>?</div>
                      ))
                    )}
                  </div>

                  {/* 메트릭 */}
                  {latestCombo?.metrics && !isProLoading && (
                    <div style={{ display:'flex',gap:'1rem',justifyContent:'center',marginBottom:'1.25rem',flexWrap:'wrap' }}>
                      {[{l:'합계',v:latestCombo.metrics.sum},{l:'홀수',v:`${latestCombo.metrics.odd}개`},{l:'짝수',v:`${latestCombo.metrics.even}개`},{l:'범위',v:latestCombo.metrics.range}].map(s=>(
                        <div key={s.l} style={{ background:'rgba(251,191,36,.07)',border:'1px solid rgba(251,191,36,.12)',borderRadius:'.5rem',padding:'.3rem .75rem',textAlign:'center' }}>
                          <div style={{ color:'#fbbf24',fontSize:'.85rem',fontWeight:800 }}>{s.v}</div>
                          <div style={{ color:'rgba(253,230,138,.4)',fontSize:'.62rem' }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {isProLoading && (
                    <p style={{ color:'rgba(251,191,36,.55)',fontSize:'.82rem',marginBottom:'1.25rem',animation:'slideUp .3s ease' }}>
                      {genMode==='batch'?`${Math.min(5, MAX_COMBOS - combos.length)}개 번호 조합을 배치 생성 중...`:'몬테카를로 시뮬레이션으로 최적 번호를 계산 중...'}
                    </p>
                  )}
                  {proState === 'error' && (
                    <p style={{ color:'#f87171',fontSize:'.82rem',marginBottom:'1rem',background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:'.75rem',padding:'.75rem 1rem' }}>⚠️ {proError}</p>
                  )}

                  {/* 생성 버튼 */}
                  <button className="gen-btn" onClick={handleGenerate} disabled={isProLoading||isMaxed}
                    style={{ background:isProLoading||isMaxed?'rgba(251,191,36,.08)':'linear-gradient(135deg,#fbbf24,#f59e0b,#d97706)',color:isProLoading||isMaxed?'rgba(251,191,36,.28)':'#78350f',border:'none',borderRadius:'1rem',padding:'1.05rem 2.75rem',fontSize:'1rem',fontWeight:900,cursor:isProLoading||isMaxed?'not-allowed':'pointer',transition:'all .2s cubic-bezier(.34,1.56,.64,1)',boxShadow:isProLoading||isMaxed?'none':'0 4px 28px rgba(251,191,36,.32)',letterSpacing:'.02em',display:'inline-flex',alignItems:'center',gap:'.55rem' }}>
                    {isProLoading ? (
                      <><div style={{ width:16,height:16,borderRadius:'50%',border:'2px solid rgba(251,191,36,.3)',borderTop:'2px solid rgba(251,191,36,.6)',animation:'spin .7s linear infinite' }} />계산 중...</>
                    ) : isMaxed ? '✓ 최대 조합 생성 완료' : (
                      <><svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>{genMode==='batch'?`${Math.min(5, MAX_COMBOS - combos.length)}개 배치 생성하기`:'번호 생성하기'}</>
                    )}
                  </button>
                  {isMaxed && (
                    <div style={{ marginTop:'1rem' }}>
                      <button onClick={clearCombos} style={{ background:'transparent',border:'1px solid rgba(251,191,36,.18)',color:'rgba(251,191,36,.45)',borderRadius:'.75rem',padding:'.5rem 1.25rem',fontSize:'.78rem',cursor:'pointer' }}>초기화 후 다시 생성</button>
                    </div>
                  )}
                </div>
              </div>

              {/* 생성된 조합 목록 */}
              {combos.length > 0 && (
                <div style={{ marginBottom:'1.25rem' }}>
                  <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.875rem' }}>
                    <h2 style={{ color:'rgba(255,255,255,.7)',fontSize:'.78rem',fontWeight:700,margin:0,letterSpacing:'.12em',textTransform:'uppercase' }}>생성된 번호 조합</h2>
                    {combos.length>1&&<button onClick={clearCombos} style={{ background:'transparent',border:'none',color:'rgba(251,191,36,.35)',fontSize:'.72rem',cursor:'pointer',padding:'.25rem .5rem' }}>전체 삭제</button>}
                  </div>
                  <div style={{ display:'flex',flexDirection:'column',gap:'.65rem' }}>
                    {combos.map((c,idx)=>{
                      const isLatest=idx===combos.length-1;
                      return (
                        <div key={c.id} className="combo-card" style={{ background:isLatest?'linear-gradient(145deg,rgba(251,191,36,.07),rgba(249,115,22,.04))':'linear-gradient(145deg,rgba(255,255,255,.03),rgba(255,255,255,.01))',border:isLatest?'1px solid rgba(251,191,36,.28)':'1px solid rgba(255,255,255,.055)',borderRadius:'1.25rem',padding:'1.1rem 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'.75rem',animationDelay:`${idx*40}ms` }}>
                          <div style={{ display:'flex',alignItems:'center',gap:'.75rem',flexWrap:'wrap' }}>
                            <div style={{ width:26,height:26,borderRadius:'50%',background:isLatest?'linear-gradient(135deg,#fbbf24,#f59e0b)':'rgba(255,255,255,.05)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.72rem',fontWeight:800,color:isLatest?'#78350f':'rgba(255,255,255,.25)',flexShrink:0 }}>{idx+1}</div>
                            <div style={{ display:'flex',gap:'.45rem',flexWrap:'wrap' }}>
                              {c.numbers.map((n,ni)=><LottoBall key={ni} n={n} size={36} highlight={c.overlap?.includes(n)} />)}
                            </div>
                          </div>
                          <div style={{ display:'flex',alignItems:'center',gap:'.75rem' }}>
                            {c.metrics&&<span style={{ color:'rgba(251,191,36,.4)',fontSize:'.68rem' }}>합 {c.metrics.sum} · 홀 {c.metrics.odd}</span>}
                            <div style={{ color:'rgba(255,255,255,.18)',fontSize:'.68rem' }}>{c.createdAt.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 핫/콜드 */}
              {(hotNumbers.length>0||coldNumbers.length>0) && (
                <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'1rem',marginBottom:'1.25rem' }}>
                  {hotNumbers.length>0&&(
                    <div style={{ background:'linear-gradient(145deg,rgba(239,68,68,.07),rgba(239,68,68,.02))',border:'1px solid rgba(239,68,68,.14)',borderRadius:'1.25rem',padding:'1.5rem' }}>
                      <div style={{ display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'1rem' }}>
                        <div style={{ width:8,height:8,borderRadius:'50%',background:'#ef4444',boxShadow:'0 0 8px rgba(239,68,68,.7)' }} />
                        <span style={{ color:'#fca5a5',fontSize:'.72rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase' }}>Hot Numbers · 통계적 과출현</span>
                      </div>
                      <div style={{ display:'flex',gap:'.45rem',flexWrap:'wrap' }}>
                        {hotNumbers.map(n=><LottoBall key={n} n={n} size={36} />)}
                      </div>
                    </div>
                  )}
                  {coldNumbers.length>0&&(
                    <div style={{ background:'linear-gradient(145deg,rgba(59,130,246,.07),rgba(59,130,246,.02))',border:'1px solid rgba(59,130,246,.14)',borderRadius:'1.25rem',padding:'1.5rem' }}>
                      <div style={{ display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'1rem' }}>
                        <div style={{ width:8,height:8,borderRadius:'50%',background:'#3b82f6',boxShadow:'0 0 8px rgba(59,130,246,.7)' }} />
                        <span style={{ color:'#93c5fd',fontSize:'.72rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase' }}>Cold Numbers · 오래 미출현</span>
                      </div>
                      <div style={{ display:'flex',gap:'.45rem',flexWrap:'wrap' }}>
                        {coldNumbers.map(n=><LottoBall key={n} n={n} size={36} />)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 시뮬레이션 정보 */}
              {latestRun&&(
                <div style={{ background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.05)',borderRadius:'1rem',padding:'1rem 1.5rem',display:'flex',gap:'1.5rem',flexWrap:'wrap',alignItems:'center' }}>
                  <div style={{ display:'flex',alignItems:'center',gap:'.5rem' }}>
                    <div style={{ width:8,height:8,borderRadius:'50%',background:'#4ade80',boxShadow:'0 0 6px rgba(74,222,128,.6)',animation:'glowPulse 2s ease-in-out infinite' }} />
                    <span style={{ color:'rgba(255,255,255,.3)',fontSize:'.7rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase' }}>최신 시뮬레이션 ({latestRun.strategy})</span>
                  </div>
                  {[{l:'생성 조합',v:`${latestRun.total_generated.toLocaleString()}개`},{l:'평균 점수',v:latestRun.avg_score.toFixed(4)},{l:'실행',v:new Date(latestRun.run_at).toLocaleString('ko-KR',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}].map(s=>(
                    <div key={s.l}><span style={{ color:'rgba(255,255,255,.2)',fontSize:'.68rem' }}>{s.l}: </span><span style={{ color:'rgba(255,255,255,.55)',fontSize:'.68rem',fontWeight:700 }}>{s.v}</span></div>
                  ))}
                </div>
              )}
            </div>

            {/* ── 비구독자 잠금 오버레이 ── */}
            {!isSubscribed && (
              <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:10,padding:'1rem' }}>
                <div style={{ textAlign:'center',maxWidth:400,background:'linear-gradient(145deg,rgba(10,5,0,.85),rgba(4,16,43,.8))',backdropFilter:'blur(8px)',border:'1px solid rgba(251,191,36,.25)',borderRadius:'1.5rem',padding:'2.5rem 2rem',boxShadow:'0 24px 60px rgba(0,0,0,.5)' }}>
                  {/* 자물쇠 아이콘 */}
                  <div style={{ width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg,rgba(251,191,36,.2),rgba(249,115,22,.1))',border:'1px solid rgba(251,191,36,.3)',margin:'0 auto 1.25rem',display:'flex',alignItems:'center',justifyContent:'center',animation:'glowPulse 3s ease-in-out infinite' }}>
                    <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth={2.2}>
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <h3 style={{ color:'#fbbf24',fontSize:'1.15rem',fontWeight:900,margin:'0 0 .5rem',letterSpacing:'-.01em' }}>구독하면 더 많이 받을 수 있어요</h3>
                  <p style={{ color:'rgba(253,230,138,.55)',fontSize:'.82rem',lineHeight:1.6,margin:'0 0 1.5rem' }}>
                    <strong style={{ color:'#fbbf24' }}>골드</strong> 주 1회 · <strong style={{ color:'#fbbf24' }}>플래티넘</strong> 주 3회 · <strong style={{ color:'#fbbf24' }}>다이아</strong> 무제한<br />핫/콜드 번호 분석 · 시뮬레이션 통계 · 연간 패턴 리포트
                  </p>
                  <div style={{ display:'flex',gap:'.75rem',justifyContent:'center',flexWrap:'wrap' }}>
                    <Link href="/services/lotto" style={{ display:'inline-flex',alignItems:'center',gap:'.4rem',background:'linear-gradient(135deg,#fbbf24,#f59e0b)',color:'#78350f',padding:'.8rem 1.75rem',borderRadius:'.875rem',fontWeight:800,fontSize:'.88rem',textDecoration:'none',boxShadow:'0 4px 20px rgba(251,191,36,.3)' }}>
                      구독 플랜 보기 →
                    </Link>
                    <Link href="/login" style={{ display:'inline-flex',alignItems:'center',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.5)',padding:'.8rem 1.25rem',borderRadius:'.875rem',fontWeight:600,fontSize:'.88rem',textDecoration:'none' }}>
                      로그인
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Color Legend ── */}
          <div style={{ background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.05)',borderRadius:'1rem',padding:'.875rem 1.5rem',display:'flex',gap:'1.25rem',flexWrap:'wrap',alignItems:'center',marginTop:'1.5rem' }}>
            <span style={{ color:'rgba(255,255,255,.28)',fontSize:'.68rem',fontWeight:600,letterSpacing:'.08em' }}>번호 색상</span>
            {[{r:'1–10',c:'#fbbf24'},{r:'11–20',c:'#3b82f6'},{r:'21–30',c:'#ef4444'},{r:'31–40',c:'#9ca3af'},{r:'41–45',c:'#22c55e'}].map(item=>(
              <div key={item.r} style={{ display:'flex',alignItems:'center',gap:'.35rem' }}>
                <div style={{ width:10,height:10,borderRadius:'50%',background:item.c,boxShadow:`0 0 6px ${item.c}80` }} />
                <span style={{ color:'rgba(255,255,255,.3)',fontSize:'.68rem' }}>{item.r}</span>
              </div>
            ))}
          </div>

          <p style={{ textAlign:'center',color:'rgba(255,255,255,.13)',fontSize:'.68rem',marginTop:'1.75rem',lineHeight:1.7 }}>
            본 서비스는 몬테카를로 시뮬레이션 기반 통계 분석으로, 당첨을 보장하지 않습니다.
          </p>
        </div>
      </div>
    </>
  );
}
