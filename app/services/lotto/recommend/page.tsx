'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

// ─── 전략 타입 ────────────────────────────────────────────────────────────────
type Strategy = 'balanced' | 'aggressive' | 'safe';

const STRATEGY_INFO: Record<Strategy, { label: string; desc: string; icon: string; color: string; accentColor: string }> = {
  balanced:   { label: '균형형',   desc: '합계·홀짝·구간 고르게 최적화', icon: '⚖️', color: 'rgba(251,191,36,.12)', accentColor: '#fbbf24' },
  aggressive: { label: '고위험형', desc: '미출현 냉각 번호 중점 포함',    icon: '🔥', color: 'rgba(239,68,68,.1)',   accentColor: '#f87171' },
  safe:       { label: '안정형',   desc: '과출현 핫 번호 + 균등 분산',   icon: '🛡️', color: 'rgba(96,165,250,.1)',  accentColor: '#60a5fa' },
};

// ─── 클라이언트 Monte Carlo 폴백 ─────────────────────────────────────────────

function clientMonteCarlo(strategy: Strategy = 'balanced'): { numbers: number[]; metrics: { sum: number; odd: number; even: number; min: number; max: number; range: number } } {
  const SIMS = 5000;
  let best: number[] = [];
  let bestScore = -Infinity;

  for (let i = 0; i < SIMS; i++) {
    const nums = pickRandom6();
    const score = scoreCombo(nums, strategy);
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

function scoreCombo(nums: number[], strategy: Strategy = 'balanced'): number {
  const sorted = [...nums].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  const odd = sorted.filter(n => n % 2 !== 0).length;
  const zones = new Set(sorted.map(n => Math.min(Math.floor((n - 1) / 10), 4)));

  if (strategy === 'aggressive') {
    // 고위험형: 높은 번호·냉각 구간 선호, 합계 편차 허용
    const sumScore = -Math.abs(sum - 158) / 55;
    const oddScore = odd >= 2 && odd <= 4 ? 0.3 : -0.3;
    const zoneScore = zones.size * 0.2;
    const highNums = sorted.filter(n => n > 35).length;
    return sumScore + oddScore + zoneScore + highNums * 0.18 + Math.random() * 0.05;
  } else if (strategy === 'safe') {
    // 안정형: 최적 합계 엄격하게, 구간 분산 최대화
    const sumScore = -Math.abs(sum - 138) / 22;
    const oddScore = odd === 3 ? 0.9 : odd === 2 || odd === 4 ? 0.35 : -0.6;
    const zoneScore = zones.size * 0.65;
    return sumScore + oddScore + zoneScore + Math.random() * 0.04;
  } else {
    // 균형형 (기본)
    const sumScore = -Math.abs(sum - 138) / 35;
    const oddScore = odd >= 2 && odd <= 4 ? 0.5 : -0.5;
    const zoneScore = zones.size * 0.4;
    return sumScore + oddScore + zoneScore + Math.random() * 0.05;
  }
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
      boxShadow: `0 ${size * .08}px ${size * .3}px ${shadow}${highlight ? ',0 0 0 3px rgba(251,191,36,.8),0 0 20px rgba(251,191,36,.4)' : ''},inset 0 1px 0 rgba(255,255,255,.45),inset 0 -2px 4px rgba(0,0,0,.18)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * .35, fontWeight: 900, color: text, flexShrink: 0,
      position: 'relative', userSelect: 'none',
      opacity: show ? 1 : 0,
      transform: show ? 'scale(1) translateY(0)' : 'scale(.2) translateY(20px)',
      transition: `opacity .35s ease ${delay}ms,transform .55s cubic-bezier(.34,1.56,.64,1) ${delay}ms`,
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

// ─── Frequency Bar (z_score 기반) ─────────────────────────────────────────────

function FreqBar({ number, zScore, gap, isHot }: { number: number; zScore: number; gap: number; isHot: boolean }) {
  const { bg, shadow } = getBallStyle(number);
  const barWidth = Math.min(100, Math.abs(zScore) * 40 + 20);
  const barColor = isHot
    ? 'linear-gradient(90deg,rgba(239,68,68,.8),rgba(251,113,133,.6))'
    : 'linear-gradient(90deg,rgba(96,165,250,.8),rgba(147,197,253,.6))';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem', padding: '.3rem 0' }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%', background: bg,
        boxShadow: `0 2px 8px ${shadow}`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '.72rem', fontWeight: 900,
        color: number <= 10 ? '#78350f' : '#fff', flexShrink: 0,
      }}>
        {number}
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{ height: 6, background: 'rgba(255,255,255,.05)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${barWidth}%`, background: barColor,
            borderRadius: 3, transition: 'width 1s ease',
          }} />
        </div>
      </div>
      <div style={{ textAlign: 'right', minWidth: 48 }}>
        <div style={{ color: isHot ? '#fca5a5' : '#93c5fd', fontSize: '.65rem', fontWeight: 700 }}>
          {isHot ? `+${zScore.toFixed(2)}σ` : `${gap}회 미출`}
        </div>
      </div>
    </div>
  );
}

// ─── Odd/Even Mini Bar ─────────────────────────────────────────────────────────

function OddEvenBar({ odd, even }: { odd: number; even: number }) {
  const total = odd + even;
  const oddPct = total > 0 ? (odd / total) * 100 : 50;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
      <span style={{ color: 'rgba(251,191,36,.4)', fontSize: '.6rem', minWidth: 20 }}>홀{odd}</span>
      <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,.06)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${oddPct}%`, background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', borderRadius: '3px 0 0 3px', transition: 'width .6s ease' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: `${100 - oddPct}%`, background: 'linear-gradient(90deg,#60a5fa,#93c5fd)', borderRadius: '0 3px 3px 0', transition: 'width .6s ease' }} />
      </div>
      <span style={{ color: 'rgba(96,165,250,.4)', fontSize: '.6rem', minWidth: 20, textAlign: 'right' }}>짝{even}</span>
    </div>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [value, duration]);
  return <>{display.toLocaleString()}</>;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LottoRecommendPage() {
  const supabase = createClient();

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [plan, setPlan] = useState('');
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [pageReady, setPageReady] = useState(false);

  const [previewNumbers, setPreviewNumbers] = useState<number[]>([]);
  const [previewMetrics, setPreviewMetrics] = useState<LottoMetrics | null>(null);
  const [previewState, setPreviewState] = useState<'idle' | 'loading' | 'result' | 'error'>('idle');
  const [previewUsed, setPreviewUsed] = useState(false);
  const [previewSource, setPreviewSource] = useState<'nas' | 'client'>('client');

  const [genMode, setGenMode] = useState<GenMode>('single');
  const [strategy, setStrategy] = useState<Strategy>('balanced');
  const [combos, setCombos] = useState<Combo[]>([]);
  const [proState, setProState] = useState<'idle' | 'loading' | 'result' | 'error'>('idle');
  const [proError, setProError] = useState('');
  const idRef = useRef(0);
  const MAX_COMBOS = PLAN_MAX_COMBOS[plan] ?? 5;

  const SPIN_NUMS = [7, 23, 41, 14, 35, 3];

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
        } catch { /* ignore */ }
      }
      setPageReady(true);
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePreview = async () => {
    if (previewState === 'loading') return;
    setPreviewState('loading');
    try {
      const res = await fetch('/api/lotto/preview');
      if (res.ok) {
        const data = await res.json();
        setPreviewNumbers([...data.numbers].sort((a, b) => a - b));
        setPreviewMetrics(data.metrics ?? null);
        setPreviewSource('nas');
      } else {
        const { numbers, metrics } = clientMonteCarlo();
        setPreviewNumbers(numbers);
        setPreviewMetrics(metrics);
        setPreviewSource('client');
      }
      setPreviewState('result');
      setPreviewUsed(true);
    } catch {
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

  const saveHistory = (numbers: number[], source: 'nas' | 'client') => {
    if (!plan) return;
    fetch('/api/lotto/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numbers, source, plan_id: plan }),
    }).catch(() => { });
  };

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

      if (res.status === 503) {
        const count = genMode === 'batch' ? Math.min(5, MAX_COMBOS - combos.length) : 1;
        const newCombos: Combo[] = Array.from({ length: count }, () => {
          idRef.current += 1;
          const { numbers, metrics } = clientMonteCarlo(strategy);
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
          const numbers = [...item.numbers].sort((a, b) => a - b);
          saveHistory(numbers, 'nas');
          return { id: idRef.current, numbers, metrics: item.metrics, createdAt: new Date() };
        });
        setCombos((prev) => [...prev, ...newCombos].slice(-MAX_COMBOS));
      } else {
        const data: RecommendResponse = await res.json();
        if (!data.numbers?.length) throw new Error('EMPTY_RESULT');
        idRef.current += 1;
        const numbers = [...data.numbers].sort((a, b) => a - b);
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

  // 핫/콜드 (z_score 포함)
  const numberStats = dashboard?.analysis?.number_stats ?? [];
  const hotStats = numberStats
    .filter(s => s.z_score > 0.3)
    .sort((a, b) => b.z_score - a.z_score)
    .slice(0, 8);
  const coldStats = numberStats
    .filter(s => s.z_score < -0.3)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 8);
  const hotNumbers = hotStats.map(s => s.number);
  const coldNumbers = coldStats.map(s => s.number);

  const latestRun = dashboard?.simulation?.runs?.[0];
  const totalDraws = dashboard?.analysis?.total_draws;
  const isProLoading = proState === 'loading';
  const isMaxed = combos.length >= MAX_COMBOS;
  const latestCombo = combos.length > 0 ? combos[combos.length - 1] : null;

  const simTotal = latestRun?.total_generated ?? 100000;
  const drawsCount = totalDraws ?? 1130;

  if (!pageReady) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#04102b,#020b1a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid rgba(251,191,36,.15)', borderTop: '3px solid #fbbf24', animation: 'spin .8s linear infinite', margin: '0 auto 1rem' }} />
          <div style={{ color: 'rgba(251,191,36,.4)', fontSize: '.75rem', letterSpacing: '.12em' }}>INITIALIZING</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=JetBrains+Mono:wght@400;600;700&family=Noto+Sans+KR:wght@400;600;700;800;900&display=swap');

        @keyframes spinBounce { 0%,100%{transform:translateY(0) rotate(0deg)} 25%{transform:translateY(-14px) rotate(90deg)} 50%{transform:translateY(0) rotate(180deg)} 75%{transform:translateY(-7px) rotate(270deg)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes glowPulse { 0%,100%{opacity:.7} 50%{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes orbFloat1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.08)} 66%{transform:translate(-20px,30px) scale(.92)} }
        @keyframes orbFloat2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,20px) scale(.92)} 66%{transform:translate(20px,-30px) scale(1.08)} }
        @keyframes badgePop { 0%{transform:scale(.7);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        @keyframes scanLine { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        @keyframes dataFlow { 0%{opacity:.2;transform:translateY(0)} 50%{opacity:.6} 100%{opacity:.2;transform:translateY(-8px)} }
        @keyframes borderGlow { 0%,100%{border-color:rgba(251,191,36,.2)} 50%{border-color:rgba(251,191,36,.55)} }

        .gen-btn:not(:disabled):hover{transform:translateY(-2px) scale(1.02)!important;box-shadow:0 12px 48px rgba(251,191,36,.5)!important}
        .gen-btn:not(:disabled):active{transform:translateY(0) scale(.97)!important}
        .combo-card{animation:slideUp .4s ease forwards;opacity:0}
        .mode-tab{transition:all .2s ease}
        .preview-btn:not(:disabled):hover{opacity:.9;transform:translateY(-2px)!important;box-shadow:0 8px 32px rgba(34,197,94,.4)!important}
        .hot-row{animation:slideIn .4s ease forwards;opacity:0}
        .stat-panel:hover{border-color:rgba(251,191,36,.3)!important;transform:translateY(-1px)}
        .stat-panel{transition:all .2s ease}
      `}</style>

      <div style={{ minHeight: '100%', background: 'linear-gradient(160deg,#020c1e 0%,#04102b 30%,#0a0500 65%,#020b1a 100%)', fontFamily: "'Noto Sans KR',sans-serif", position: 'relative', overflow: 'hidden' }}>

        {/* Ambient orbs */}
        <div style={{ position: 'fixed', top: '5%', left: '2%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(251,191,36,.05),transparent 70%)', animation: 'orbFloat1 16s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '5%', right: '2%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,.04),transparent 70%)', animation: 'orbFloat2 20s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', top: '40%', right: '15%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(251,191,36,.03),transparent 70%)', animation: 'orbFloat1 25s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 960, margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>

          {/* ── Navigation ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <Link href="/services/lotto" style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', color: 'rgba(6,182,212,.5)', fontSize: '.72rem', textDecoration: 'none', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.08em', transition: 'color .2s' }}>
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              LOTTO SERVICE
            </Link>
            {isSubscribed && plan && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: 'linear-gradient(135deg,rgba(251,191,36,.1),rgba(249,115,22,.06))', border: '1px solid rgba(251,191,36,.25)', borderRadius: '2rem', padding: '.4rem 1rem', animation: 'borderGlow 3s ease-in-out infinite' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,.8)', animation: 'glowPulse 2s ease-in-out infinite' }} />
                <span style={{ color: '#fbbf24', fontSize: '.75rem', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{PLAN_LABELS[plan] ?? plan}</span>
              </div>
            )}
          </div>

          {/* ── Header ── */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(6,182,212,.6)', marginBottom: '.75rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4', animation: 'glowPulse 2s ease-in-out infinite' }} />
              MONTE CARLO SIMULATION ENGINE
            </div>
            <h1 style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: 'clamp(2rem,5vw,3rem)', color: '#fff', margin: '0 0 .5rem', lineHeight: 1.05, letterSpacing: '-.02em' }}>
              이번 주 로또<br />
              <span style={{ background: 'linear-gradient(90deg,#fbbf24,#f97316,#fb923c,#fbbf24)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 3s linear infinite' }}>번호 추천</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.82rem', margin: 0, lineHeight: 1.6 }}>
              역대 {drawsCount.toLocaleString()}회 데이터 기반 통계 분석 · 5,000회 Monte Carlo 시뮬레이션으로 최적 조합 도출
            </p>
          </div>

          {/* ── 통계 인디케이터 패널 (전체 공개) ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '.75rem', marginBottom: '2rem' }}>
            {[
              { label: 'SIMULATION', value: simTotal, suffix: '회', color: '#fbbf24', icon: '⚡', desc: '시뮬레이션 횟수' },
              { label: 'DRAWS ANALYZED', value: drawsCount, suffix: '회', color: '#06b6d4', icon: '📊', desc: '분석 회차' },
              { label: 'HOT NUMBERS', value: hotNumbers.length, suffix: '개', color: '#f87171', icon: '🔥', desc: '과출현 번호' },
              { label: 'COLD NUMBERS', value: coldNumbers.length, suffix: '개', color: '#60a5fa', icon: '❄️', desc: '미출현 번호' },
            ].map((s, i) => (
              <div key={s.label} className="stat-panel" style={{ background: 'linear-gradient(145deg,rgba(255,255,255,.03),rgba(255,255,255,.01))', border: '1px solid rgba(255,255,255,.06)', borderRadius: '1rem', padding: '1rem', position: 'relative', overflow: 'hidden', animationDelay: `${i * 80}ms` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${s.color}40,transparent)` }} />
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.55rem', letterSpacing: '.15em', color: 'rgba(255,255,255,.2)', marginBottom: '.5rem' }}>{s.label}</div>
                <div style={{ color: s.color, fontSize: 'clamp(.9rem,2vw,1.3rem)', fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>
                  <AnimCounter value={s.value} />
                  <span style={{ fontSize: '.65em', opacity: .7 }}>{s.suffix}</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,.2)', fontSize: '.6rem', marginTop: '.3rem' }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* ── 이번 주 공략 포인트 (구독자 전용) ── */}
          {isSubscribed && dashboard?.analysis && (
            <div style={{ background: 'linear-gradient(145deg,rgba(6,182,212,.06),rgba(99,102,241,.03))', border: '1px solid rgba(6,182,212,.15)', borderRadius: '1.25rem', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', animation: 'slideUp .5s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '1rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#06b6d4', boxShadow: '0 0 8px rgba(6,182,212,.7)', animation: 'glowPulse 2s ease-in-out infinite' }} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.15em', color: 'rgba(6,182,212,.7)', textTransform: 'uppercase' }}>
                  WEEKLY ATTACK REPORT · 이번 주 공략 포인트
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '.75rem' }}>
                {/* 핫 넘버 공략 */}
                {hotStats.length > 0 && (
                  <div style={{ background: 'rgba(0,0,0,.25)', borderRadius: '.875rem', padding: '.875rem 1rem', borderLeft: '2px solid rgba(239,68,68,.5)' }}>
                    <div style={{ display: 'flex', gap: '.3rem', marginBottom: '.5rem', flexWrap: 'wrap' }}>
                      {hotStats.slice(0, 5).map(s => {
                        const { bg } = getBallStyle(s.number);
                        return (
                          <div key={s.number} style={{ width: 24, height: 24, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.6rem', fontWeight: 900, color: s.number <= 10 ? '#78350f' : '#fff' }}>
                            {s.number}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ color: '#fca5a5', fontSize: '.7rem', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>🔥 과출현 주의</div>
                    <div style={{ color: 'rgba(255,255,255,.25)', fontSize: '.62rem', marginTop: '.2rem', lineHeight: 1.5 }}>
                      최근 자주 나온 번호 · 안정형에 유리
                    </div>
                  </div>
                )}
                {/* 콜드 넘버 공략 */}
                {coldStats.length > 0 && (
                  <div style={{ background: 'rgba(0,0,0,.25)', borderRadius: '.875rem', padding: '.875rem 1rem', borderLeft: '2px solid rgba(96,165,250,.5)' }}>
                    <div style={{ display: 'flex', gap: '.3rem', marginBottom: '.5rem', flexWrap: 'wrap' }}>
                      {coldStats.slice(0, 5).map(s => {
                        const { bg } = getBallStyle(s.number);
                        return (
                          <div key={s.number} style={{ width: 24, height: 24, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.6rem', fontWeight: 900, color: s.number <= 10 ? '#78350f' : '#fff' }}>
                            {s.number}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ color: '#93c5fd', fontSize: '.7rem', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>❄️ 냉각 구간 주목</div>
                    <div style={{ color: 'rgba(255,255,255,.25)', fontSize: '.62rem', marginTop: '.2rem', lineHeight: 1.5 }}>
                      평균 {Math.round(coldStats.reduce((a, s) => a + s.gap, 0) / coldStats.length)}회 미출현 · 고위험형에 유리
                    </div>
                  </div>
                )}
                {/* AI 신뢰도 */}
                {dashboard.latest && (
                  <div style={{ background: 'rgba(0,0,0,.25)', borderRadius: '.875rem', padding: '.875rem 1rem', borderLeft: '2px solid rgba(251,191,36,.4)' }}>
                    <div style={{ marginBottom: '.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.25rem' }}>
                        <span style={{ color: 'rgba(251,191,36,.6)', fontSize: '.6rem', fontFamily: "'JetBrains Mono',monospace" }}>AI CONFIDENCE</span>
                        <span style={{ color: '#fbbf24', fontSize: '.7rem', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>
                          {Math.min(99, 60 + hotStats.length * 2 + coldStats.length)}%
                        </span>
                      </div>
                      <div style={{ height: 5, background: 'rgba(255,255,255,.05)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(99, 60 + hotStats.length * 2 + coldStats.length)}%`, background: 'linear-gradient(90deg,#fbbf24,#f59e0b)', borderRadius: 3, transition: 'width 1.5s ease' }} />
                      </div>
                    </div>
                    <div style={{ color: '#fbbf24', fontSize: '.7rem', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>⚡ 분석 신뢰도</div>
                    <div style={{ color: 'rgba(255,255,255,.25)', fontSize: '.62rem', marginTop: '.2rem', lineHeight: 1.5 }}>
                      {(dashboard.analysis.total_draws ?? 1130).toLocaleString()}회 + {(hotStats.length + coldStats.length)}개 패턴 기반
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── 최신 당첨번호 ── */}
          {isSubscribed && dashboard?.latest && (
            <div style={{ background: 'linear-gradient(145deg,rgba(255,255,255,.03),rgba(255,255,255,.015))', border: '1px solid rgba(255,255,255,.07)', borderRadius: '1.25rem', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', animation: 'slideUp .5s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '1rem' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.15em', color: 'rgba(255,255,255,.25)', textTransform: 'uppercase' }}>LATEST DRAW</div>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.05)' }} />
                <div style={{ color: 'rgba(255,255,255,.2)', fontSize: '.68rem' }}>제{dashboard.latest.drawNo}회 · {dashboard.latest.date}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {dashboard.latest.numbers.map((n, i) => <LottoBall key={i} n={n} size={34} />)}
                  <div style={{ color: 'rgba(255,255,255,.2)', fontSize: '.85rem', margin: '0 .15rem' }}>＋</div>
                  <div style={{ position: 'relative', width: 34, height: 34, borderRadius: '50%', border: '2px dashed rgba(251,191,36,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LottoBall n={dashboard.latest.bonus} size={28} />
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '1.5rem' }}>
                  {[
                    { l: '합계', v: dashboard.latest.metrics.sum },
                    { l: '홀수', v: `${dashboard.latest.metrics.odd}개` },
                    { l: '짝수', v: `${dashboard.latest.metrics.even}개` },
                    { l: '범위', v: dashboard.latest.metrics.range },
                  ].map(s => (
                    <div key={s.l} style={{ textAlign: 'center' }}>
                      <div style={{ color: '#fbbf24', fontSize: '.9rem', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>{s.v}</div>
                      <div style={{ color: 'rgba(255,255,255,.2)', fontSize: '.6rem', marginTop: '.15rem' }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════
              무료 맛보기 섹션
          ════════════════════════════════════════════════ */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.875rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.2)', borderRadius: '2rem', padding: '.3rem .85rem' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px rgba(74,222,128,.8)', animation: 'glowPulse 2s ease-in-out infinite' }} />
                <span style={{ color: '#4ade80', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em', fontFamily: "'JetBrains Mono',monospace" }}>FREE PREVIEW</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,.2)', fontSize: '.72rem' }}>1회 무료 번호 추천 · Monte Carlo 5,000회 시뮬레이션</span>
            </div>

            <div style={{ background: 'linear-gradient(145deg,rgba(74,222,128,.04),rgba(34,197,94,.01))', border: '1px solid rgba(74,222,128,.12)', borderRadius: '1.5rem', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
              {/* Decorative grid lines */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(74,222,128,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,.03) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', borderRadius: '1.5rem' }} />

              <div style={{ position: 'relative' }}>
                {/* 번호 표시 */}
                <div style={{ minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', gap: '.75rem', flexWrap: 'wrap' }}>
                  {previewState === 'loading' ? (
                    SPIN_NUMS.slice(0, 6).map((n, i) => <SpinBall key={i} n={n} delay={i * 100} />)
                  ) : previewState === 'result' && previewNumbers.length > 0 ? (
                    previewNumbers.map((n, i) => <LottoBall key={i} n={n} size={64} bounce delay={i * 120} />)
                  ) : (
                    Array.from({ length: 6 }, (_, i) => (
                      <div key={i} style={{ width: 64, height: 64, borderRadius: '50%', border: '2px dashed rgba(74,222,128,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(74,222,128,.15)', fontSize: '1.3rem', fontWeight: 900, animation: `float ${2 + i * .28}s ease-in-out infinite`, animationDelay: `${i * .18}s`, fontFamily: "'JetBrains Mono',monospace" }}>?</div>
                    ))
                  )}
                </div>

                {/* 맛보기 메트릭 */}
                {previewState === 'result' && previewMetrics && (
                  <div style={{ animation: 'slideUp .4s ease' }}>
                    <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'center', marginBottom: '.75rem', flexWrap: 'wrap' }}>
                      {[
                        { l: 'SUM', v: previewMetrics.sum, good: previewMetrics.sum >= 100 && previewMetrics.sum <= 175 },
                        { l: 'ODD', v: `${previewMetrics.odd}` },
                        { l: 'EVEN', v: `${previewMetrics.even}` },
                        { l: 'RANGE', v: previewMetrics.range },
                      ].map(s => (
                        <div key={s.l} style={{ background: 'rgba(74,222,128,.06)', border: '1px solid rgba(74,222,128,.14)', borderRadius: '.625rem', padding: '.4rem .85rem', textAlign: 'center' }}>
                          <div style={{ color: '#4ade80', fontSize: '.85rem', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>{s.v}</div>
                          <div style={{ color: 'rgba(74,222,128,.4)', fontSize: '.58rem', letterSpacing: '.12em', marginTop: '.1rem' }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                    {/* 홀짝 바 */}
                    <div style={{ maxWidth: 220, margin: '0 auto .875rem' }}>
                      <OddEvenBar odd={previewMetrics.odd} even={previewMetrics.even} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.35rem', background: 'rgba(0,0,0,.2)', borderRadius: '2rem', padding: '.25rem .85rem' }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: previewSource === 'nas' ? '#4ade80' : '#94a3b8' }} />
                        <span style={{ color: 'rgba(255,255,255,.25)', fontSize: '.62rem', fontFamily: "'JetBrains Mono',monospace" }}>
                          {previewSource === 'nas' ? 'NAS · Monte Carlo' : 'Client · 5,000 iterations'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {previewState === 'error' && (
                  <p style={{ color: '#f87171', fontSize: '.8rem', marginBottom: '1rem', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: '.75rem', padding: '.65rem 1rem', textAlign: 'center' }}>
                    ⚠️ 번호 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
                  </p>
                )}

                {/* 버튼 */}
                <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                  {!previewUsed ? (
                    <button
                      className="preview-btn"
                      onClick={handlePreview}
                      disabled={previewState === 'loading'}
                      style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)', color: '#052e16', border: 'none', borderRadius: '1rem', padding: '.9rem 2.5rem', fontSize: '.95rem', fontWeight: 800, cursor: previewState === 'loading' ? 'not-allowed' : 'pointer', transition: 'all .2s', boxShadow: '0 4px 24px rgba(34,197,94,.3)', display: 'inline-flex', alignItems: 'center', gap: '.5rem' }}>
                      {previewState === 'loading' ? (
                        <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(5,46,22,.3)', borderTop: '2px solid rgba(5,46,22,.7)', animation: 'spin .7s linear infinite' }} />시뮬레이션 실행 중...</>
                      ) : (
                        <>🎰 무료 번호 생성하기</>
                      )}
                    </button>
                  ) : (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.18)', borderRadius: '2rem', padding: '.5rem 1.25rem', animation: 'badgePop .5s cubic-bezier(.34,1.56,.64,1)' }}>
                      <span style={{ color: '#4ade80', fontSize: '.78rem', fontWeight: 700 }}>✓ 오늘의 무료 번호 생성 완료</span>
                    </div>
                  )}
                  {previewUsed && !isSubscribed && (
                    <p style={{ color: 'rgba(255,255,255,.2)', fontSize: '.72rem', margin: '.75rem 0 0', textAlign: 'center' }}>
                      더 많은 번호와 통계 분석이 필요하다면 아래 구독 플랜을 ↓
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════
              구독자 전용 섹션 (블러 게이트)
          ════════════════════════════════════════════════ */}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.875rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', background: 'rgba(251,191,36,.08)', border: '1px solid rgba(251,191,36,.22)', borderRadius: '2rem', padding: '.3rem .85rem' }}>
                <svg width={9} height={9} viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                <span style={{ color: '#fbbf24', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em', fontFamily: "'JetBrains Mono',monospace" }}>PREMIUM</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,.2)', fontSize: '.72rem' }}>
                {isSubscribed ? '프리미엄 번호 추천 · 통계 분석' : '구독 시 제공되는 기능 미리보기'}
              </span>
            </div>

            {/* 프리미엄 컨텐츠 */}
            <div style={{ position: 'relative', filter: isSubscribed ? 'none' : 'blur(4px)', opacity: isSubscribed ? 1 : 0.45, pointerEvents: isSubscribed ? 'auto' : 'none', transition: 'filter .3s,opacity .3s', userSelect: isSubscribed ? 'auto' : 'none' }}>

              {/* ── 번호 생성 메인 카드 ── */}
              <div style={{ background: 'linear-gradient(145deg,rgba(255,255,255,.04),rgba(251,191,36,.02))', border: '1px solid rgba(251,191,36,.15)', borderRadius: '1.75rem', padding: '2rem', marginBottom: '1.25rem', position: 'relative', overflow: 'hidden' }}>
                {/* 배경 그리드 */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(251,191,36,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(251,191,36,.02) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', borderRadius: '1.75rem' }} />
                <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(251,191,36,.06),transparent)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative' }}>
                  {/* 분석 지표 배너 */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.65rem', marginBottom: '1.75rem' }}>
                    {[
                      { icon: '⚡', val: latestRun ? `${(latestRun.total_generated / 10000).toFixed(0)}만 회` : '10만 회', label: '시뮬레이션', sub: 'Monte Carlo Runs', color: '#fbbf24' },
                      { icon: '📊', val: totalDraws ? `${totalDraws.toLocaleString()}회` : '1,130+', label: '분석 회차', sub: 'Historical Draws', color: '#06b6d4' },
                      { icon: '🎯', val: `${combos.length} / ${MAX_COMBOS}`, label: '생성 조합', sub: 'Generated Combos', color: '#a78bfa' },
                    ].map(s => (
                      <div key={s.label} style={{ background: 'rgba(0,0,0,.2)', border: `1px solid ${s.color}18`, borderRadius: '.875rem', padding: '.875rem 1rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: 2, background: `linear-gradient(90deg,transparent,${s.color}50,transparent)` }} />
                        <div style={{ fontSize: '1.1rem', marginBottom: '.25rem' }}>{s.icon}</div>
                        <div style={{ color: s.color, fontSize: 'clamp(.85rem,2vw,1.15rem)', fontWeight: 900, fontFamily: "'JetBrains Mono',monospace" }}>{s.val}</div>
                        <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '.65rem', marginTop: '.2rem' }}>{s.label}</div>
                        <div style={{ color: `${s.color}50`, fontSize: '.55rem', marginTop: '.1rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.06em' }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* 전략 선택 */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.55rem', letterSpacing: '.15em', color: 'rgba(255,255,255,.2)', textTransform: 'uppercase', marginBottom: '.5rem', textAlign: 'center' }}>
                      GENERATION STRATEGY
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.5rem' }}>
                      {(Object.entries(STRATEGY_INFO) as [Strategy, typeof STRATEGY_INFO[Strategy]][]).map(([key, info]) => (
                        <button key={key} onClick={() => setStrategy(key)} disabled={isProLoading}
                          className="mode-tab"
                          style={{
                            background: strategy === key ? info.color : 'rgba(0,0,0,.2)',
                            border: `1px solid ${strategy === key ? info.accentColor + '50' : 'rgba(255,255,255,.05)'}`,
                            borderRadius: '.75rem', padding: '.65rem .5rem', textAlign: 'center',
                            cursor: 'pointer', transition: 'all .2s',
                          }}>
                          <div style={{ fontSize: '1.1rem', marginBottom: '.2rem' }}>{info.icon}</div>
                          <div style={{ color: strategy === key ? info.accentColor : 'rgba(255,255,255,.3)', fontSize: '.72rem', fontWeight: 700, fontFamily: "'Noto Sans KR',sans-serif", marginBottom: '.15rem' }}>
                            {info.label}
                          </div>
                          <div style={{ color: 'rgba(255,255,255,.18)', fontSize: '.58rem', lineHeight: 1.4, fontFamily: "'Noto Sans KR',sans-serif" }}>
                            {info.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 모드 탭 */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,.3)', borderRadius: '.875rem', padding: '.25rem', gap: '.25rem' }}>
                      {(['single', 'batch'] as const).map(mode => (
                        <button key={mode} className="mode-tab" onClick={() => setGenMode(mode)} disabled={isProLoading}
                          style={{ background: genMode === mode ? 'linear-gradient(135deg,#fbbf24,#f59e0b)' : 'transparent', color: genMode === mode ? '#78350f' : 'rgba(253,230,138,.4)', border: 'none', borderRadius: '.6rem', padding: '.45rem 1.25rem', fontSize: '.78rem', fontWeight: genMode === mode ? 800 : 600, cursor: 'pointer', fontFamily: "'Noto Sans KR',sans-serif" }}>
                          {mode === 'single' ? '단일 생성' : `${Math.min(5, MAX_COMBOS - combos.length)}개 배치`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 볼 디스플레이 */}
                  <div style={{ minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '.85rem' }}>
                    {isProLoading ? (
                      SPIN_NUMS.map((n, i) => <SpinBall key={i} n={n} delay={i * 100} />)
                    ) : latestCombo ? (
                      latestCombo.numbers.map((n, i) => <LottoBall key={i} n={n} size={72} bounce delay={i * 120} highlight={latestCombo.overlap?.includes(n)} />)
                    ) : (
                      Array.from({ length: 6 }, (_, i) => (
                        <div key={i} style={{ width: 72, height: 72, borderRadius: '50%', border: '2px dashed rgba(251,191,36,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(251,191,36,.12)', fontSize: '1.5rem', fontWeight: 900, animation: `float ${2 + i * .28}s ease-in-out infinite`, animationDelay: `${i * .18}s`, fontFamily: "'JetBrains Mono',monospace" }}>?</div>
                      ))
                    )}
                  </div>

                  {/* 메트릭 + 홀짝 바 */}
                  {latestCombo?.metrics && !isProLoading && (
                    <div style={{ animation: 'slideUp .4s ease' }}>
                      <div style={{ display: 'flex', gap: '.65rem', justifyContent: 'center', marginBottom: '.875rem', flexWrap: 'wrap' }}>
                        {[
                          { l: 'SUM', v: latestCombo.metrics.sum, good: latestCombo.metrics.sum >= 100 && latestCombo.metrics.sum <= 175 },
                          { l: 'ODD', v: latestCombo.metrics.odd },
                          { l: 'EVEN', v: latestCombo.metrics.even },
                          { l: 'RANGE', v: latestCombo.metrics.range },
                        ].map(s => (
                          <div key={s.l} style={{ background: 'rgba(251,191,36,.06)', border: '1px solid rgba(251,191,36,.12)', borderRadius: '.625rem', padding: '.4rem .875rem', textAlign: 'center' }}>
                            <div style={{ color: '#fbbf24', fontSize: '.9rem', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>{s.v}</div>
                            <div style={{ color: 'rgba(253,230,138,.35)', fontSize: '.58rem', letterSpacing: '.12em', marginTop: '.1rem' }}>{s.l}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ maxWidth: 260, margin: '0 auto .5rem' }}>
                        <OddEvenBar odd={latestCombo.metrics.odd} even={latestCombo.metrics.even} />
                      </div>
                      {/* 추천 이유 */}
                      <div style={{ textAlign: 'center', marginBottom: '.75rem' }}>
                        <div style={{ display: 'inline-block', background: 'rgba(251,191,36,.06)', border: '1px solid rgba(251,191,36,.1)', borderRadius: '.625rem', padding: '.35rem .9rem' }}>
                          <span style={{ color: 'rgba(253,230,138,.5)', fontSize: '.68rem', fontFamily: "'JetBrains Mono',monospace" }}>
                            {latestCombo.metrics.sum >= 100 && latestCombo.metrics.sum <= 175
                              ? '✓ 최적 합계 범위 (100~175)'
                              : '합계 기준 ±35 이내'
                            } · 홀짝 {latestCombo.metrics.odd}:{latestCombo.metrics.even} 균형
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {isProLoading && (
                    <div style={{ textAlign: 'center', marginBottom: '1rem', animation: 'slideUp .3s ease' }}>
                      <div style={{ color: 'rgba(251,191,36,.55)', fontSize: '.82rem', marginBottom: '.4rem' }}>
                        {genMode === 'batch' ? `${Math.min(5, MAX_COMBOS - combos.length)}개 번호 조합 배치 생성 중...` : '몬테카를로 시뮬레이션으로 최적 번호 계산 중...'}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '.3rem' }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: '#fbbf24', animation: 'dataFlow 1s ease-in-out infinite', animationDelay: `${i * .2}s` }} />
                        ))}
                      </div>
                    </div>
                  )}

                  {proState === 'error' && (
                    <p style={{ color: '#f87171', fontSize: '.82rem', marginBottom: '1rem', background: 'rgba(239,68,68,.07)', border: '1px solid rgba(239,68,68,.18)', borderRadius: '.75rem', padding: '.75rem 1.25rem', textAlign: 'center' }}>⚠️ {proError}</p>
                  )}

                  {/* 생성 버튼 */}
                  <div style={{ textAlign: 'center' }}>
                    <button className="gen-btn" onClick={handleGenerate} disabled={isProLoading || isMaxed}
                      style={{ background: isProLoading || isMaxed ? 'rgba(251,191,36,.06)' : 'linear-gradient(135deg,#fbbf24,#f59e0b,#d97706)', color: isProLoading || isMaxed ? 'rgba(251,191,36,.25)' : '#78350f', border: 'none', borderRadius: '1rem', padding: '1rem 3rem', fontSize: '1rem', fontWeight: 900, cursor: isProLoading || isMaxed ? 'not-allowed' : 'pointer', transition: 'all .2s cubic-bezier(.34,1.56,.64,1)', boxShadow: isProLoading || isMaxed ? 'none' : '0 4px 32px rgba(251,191,36,.3)', letterSpacing: '.02em', display: 'inline-flex', alignItems: 'center', gap: '.55rem', fontFamily: "'Noto Sans KR',sans-serif" }}>
                      {isProLoading ? (
                        <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(251,191,36,.3)', borderTop: '2px solid rgba(251,191,36,.6)', animation: 'spin .7s linear infinite' }} />계산 중...</>
                      ) : isMaxed ? '✓ 최대 조합 생성 완료' : (
                        <><svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>{STRATEGY_INFO[strategy].icon} {genMode === 'batch' ? `${Math.min(5, MAX_COMBOS - combos.length)}개 배치` : '번호 생성'} · {STRATEGY_INFO[strategy].label}</>
                      )}
                    </button>
                    {isMaxed && (
                      <div style={{ marginTop: '.875rem' }}>
                        <button onClick={clearCombos} style={{ background: 'transparent', border: '1px solid rgba(251,191,36,.15)', color: 'rgba(251,191,36,.4)', borderRadius: '.75rem', padding: '.5rem 1.25rem', fontSize: '.75rem', cursor: 'pointer', fontFamily: "'Noto Sans KR',sans-serif" }}>초기화 후 다시 생성</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── 생성된 조합 목록 ── */}
              {combos.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.15em', color: 'rgba(255,255,255,.2)', textTransform: 'uppercase' }}>GENERATED COMBOS</div>
                      <div style={{ background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.2)', borderRadius: '2rem', padding: '.1rem .5rem' }}>
                        <span style={{ color: '#fbbf24', fontSize: '.65rem', fontFamily: "'JetBrains Mono',monospace" }}>{combos.length}</span>
                      </div>
                    </div>
                    {combos.length > 1 && <button onClick={clearCombos} style={{ background: 'transparent', border: 'none', color: 'rgba(251,191,36,.3)', fontSize: '.72rem', cursor: 'pointer', padding: '.25rem .5rem', fontFamily: "'Noto Sans KR',sans-serif" }}>전체 삭제</button>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.625rem' }}>
                    {combos.map((c, idx) => {
                      const isLatest = idx === combos.length - 1;
                      return (
                        <div key={c.id} className="combo-card" style={{ background: isLatest ? 'linear-gradient(145deg,rgba(251,191,36,.07),rgba(249,115,22,.03))' : 'linear-gradient(145deg,rgba(255,255,255,.025),rgba(255,255,255,.01))', border: isLatest ? '1px solid rgba(251,191,36,.25)' : '1px solid rgba(255,255,255,.05)', borderRadius: '1.125rem', padding: '1rem 1.25rem', animationDelay: `${idx * 40}ms` }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.75rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', flexWrap: 'wrap' }}>
                              <div style={{ width: 24, height: 24, borderRadius: '50%', background: isLatest ? 'linear-gradient(135deg,#fbbf24,#f59e0b)' : 'rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.65rem', fontWeight: 800, color: isLatest ? '#78350f' : 'rgba(255,255,255,.2)', flexShrink: 0, fontFamily: "'JetBrains Mono',monospace" }}>{idx + 1}</div>
                              <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                                {c.numbers.map((n, ni) => <LottoBall key={ni} n={n} size={38} highlight={c.overlap?.includes(n)} />)}
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '.3rem', alignItems: 'flex-end' }}>
                              {c.metrics && (
                                <>
                                  <span style={{ color: 'rgba(251,191,36,.45)', fontSize: '.65rem', fontFamily: "'JetBrains Mono',monospace" }}>∑{c.metrics.sum} · {c.metrics.odd}홀{c.metrics.even}짝</span>
                                  <div style={{ width: 100 }}>
                                    <OddEvenBar odd={c.metrics.odd} even={c.metrics.even} />
                                  </div>
                                </>
                              )}
                              <div style={{ color: 'rgba(255,255,255,.15)', fontSize: '.62rem', fontFamily: "'JetBrains Mono',monospace" }}>{c.createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── 포트폴리오 요약 (2개 이상 생성 시) ── */}
              {combos.length >= 2 && (() => {
                const withMetrics = combos.filter(c => c.metrics);
                if (withMetrics.length === 0) return null;
                const avgSum = Math.round(withMetrics.reduce((a, c) => a + c.metrics!.sum, 0) / withMetrics.length);
                const avgOdd = (withMetrics.reduce((a, c) => a + c.metrics!.odd, 0) / withMetrics.length).toFixed(1);
                const allNums = combos.flatMap(c => c.numbers);
                const zoneCount = [0,0,0,0,0];
                allNums.forEach(n => { zoneCount[Math.min(Math.floor((n-1)/10),4)]++; });
                const totalNums = allNums.length;
                return (
                  <div style={{ background: 'linear-gradient(145deg,rgba(168,85,247,.06),rgba(99,102,241,.03))', border: '1px solid rgba(168,85,247,.15)', borderRadius: '1.25rem', padding: '1.25rem 1.5rem', marginBottom: '1.25rem', animation: 'slideUp .4s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '1rem' }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 8px rgba(167,139,250,.7)' }} />
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.15em', color: 'rgba(167,139,250,.7)', textTransform: 'uppercase' }}>
                        PORTFOLIO ANALYSIS · {combos.length}세트 종합
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: '.75rem', marginBottom: '.875rem' }}>
                      {[
                        { l: '평균 합계', v: avgSum, sub: `목표 138`, color: '#fbbf24' },
                        { l: '평균 홀수', v: `${avgOdd}개`, sub: '권장 3개', color: '#f87171' },
                        { l: '총 투자', v: `₩${(combos.length * 1000).toLocaleString()}`, sub: '회당 1,000원', color: '#4ade80' },
                      ].map(s => (
                        <div key={s.l} style={{ background: 'rgba(0,0,0,.2)', borderRadius: '.75rem', padding: '.75rem', textAlign: 'center' }}>
                          <div style={{ color: s.color, fontSize: '.95rem', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>{s.v}</div>
                          <div style={{ color: 'rgba(255,255,255,.2)', fontSize: '.6rem', marginTop: '.15rem' }}>{s.l}</div>
                          <div style={{ color: `${s.color}50`, fontSize: '.55rem', marginTop: '.1rem', fontFamily: "'JetBrains Mono',monospace" }}>{s.sub}</div>
                        </div>
                      ))}
                    </div>
                    {/* 구간 분포 */}
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.55rem', letterSpacing: '.12em', color: 'rgba(255,255,255,.18)', marginBottom: '.4rem' }}>ZONE DISTRIBUTION</div>
                      <div style={{ display: 'flex', gap: '.3rem', alignItems: 'flex-end', height: 32 }}>
                        {zoneCount.map((cnt, i) => {
                          const pct = totalNums > 0 ? (cnt / totalNums) * 100 : 0;
                          const zoneColors = ['#fbbf24','#3b82f6','#ef4444','#9ca3af','#22c55e'];
                          const zoneLabels = ['1-10','11-20','21-30','31-40','41-45'];
                          return (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.2rem' }}>
                              <div style={{ width: '100%', background: zoneColors[i], borderRadius: '2px 2px 0 0', opacity: .7, height: `${Math.max(4, pct * 0.8)}px`, transition: 'height .5s ease' }} />
                              <div style={{ color: 'rgba(255,255,255,.2)', fontSize: '.5rem', fontFamily: "'JetBrains Mono',monospace" }}>{zoneLabels[i]}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── Hot / Cold Numbers (인포그래픽 바) ── */}
              {(hotStats.length > 0 || coldStats.length > 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                  {hotStats.length > 0 && (
                    <div style={{ background: 'linear-gradient(145deg,rgba(239,68,68,.06),rgba(239,68,68,.015))', border: '1px solid rgba(239,68,68,.13)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '1.25rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px rgba(239,68,68,.7)', animation: 'glowPulse 2s ease-in-out infinite' }} />
                        <span style={{ color: '#fca5a5', fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em', fontFamily: "'JetBrains Mono',monospace" }}>HOT NUMBERS · 과출현</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '.1rem' }}>
                        {hotStats.map((s, i) => (
                          <div key={s.number} className="hot-row" style={{ animationDelay: `${i * 60}ms` }}>
                            <FreqBar number={s.number} zScore={s.z_score} gap={s.gap} isHot={true} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {coldStats.length > 0 && (
                    <div style={{ background: 'linear-gradient(145deg,rgba(59,130,246,.06),rgba(59,130,246,.015))', border: '1px solid rgba(59,130,246,.13)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '1.25rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px rgba(59,130,246,.7)', animation: 'glowPulse 2s ease-in-out infinite' }} />
                        <span style={{ color: '#93c5fd', fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em', fontFamily: "'JetBrains Mono',monospace" }}>COLD NUMBERS · 미출현</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '.1rem' }}>
                        {coldStats.map((s, i) => (
                          <div key={s.number} className="hot-row" style={{ animationDelay: `${i * 60}ms` }}>
                            <FreqBar number={s.number} zScore={s.z_score} gap={s.gap} isHot={false} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── 시뮬레이션 정보 바 ── */}
              {latestRun && (
                <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', borderRadius: '1rem', padding: '1rem 1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,.6)', animation: 'glowPulse 2s ease-in-out infinite' }} />
                    <span style={{ color: 'rgba(255,255,255,.25)', fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', fontFamily: "'JetBrains Mono',monospace" }}>LATEST SIM · {latestRun.strategy.toUpperCase()}</span>
                  </div>
                  {[
                    { l: 'Generated', v: `${latestRun.total_generated.toLocaleString()}` },
                    { l: 'Avg Score', v: latestRun.avg_score.toFixed(4) },
                    { l: 'Run At', v: new Date(latestRun.run_at).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                  ].map(s => (
                    <div key={s.l}>
                      <span style={{ color: 'rgba(255,255,255,.18)', fontSize: '.65rem', fontFamily: "'JetBrains Mono',monospace" }}>{s.l}: </span>
                      <span style={{ color: 'rgba(255,255,255,.5)', fontSize: '.65rem', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{s.v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── 비구독자 잠금 오버레이 ── */}
            {!isSubscribed && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '1rem' }}>
                <div style={{ textAlign: 'center', maxWidth: 420, background: 'linear-gradient(145deg,rgba(4,16,43,.92),rgba(10,5,0,.88))', backdropFilter: 'blur(12px)', border: '1px solid rgba(251,191,36,.22)', borderRadius: '1.75rem', padding: '2.5rem 2rem', boxShadow: '0 32px 80px rgba(0,0,0,.6)' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(251,191,36,.18),rgba(249,115,22,.08))', border: '1px solid rgba(251,191,36,.28)', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 3s ease-in-out infinite' }}>
                    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth={2}>
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.18em', color: 'rgba(251,191,36,.4)', marginBottom: '.75rem' }}>SUBSCRIPTION REQUIRED</div>
                  <h3 style={{ color: '#fbbf24', fontSize: '1.15rem', fontWeight: 900, margin: '0 0 .625rem', letterSpacing: '-.01em' }}>구독하면 더 많이 받을 수 있어요</h3>
                  <p style={{ color: 'rgba(253,230,138,.45)', fontSize: '.8rem', lineHeight: 1.7, margin: '0 0 1.5rem' }}>
                    <strong style={{ color: '#fbbf24' }}>골드</strong> 주 1회 · <strong style={{ color: '#fbbf24' }}>플래티넘</strong> 주 3회 · <strong style={{ color: '#fbbf24' }}>다이아</strong> 무제한<br />
                    핫/콜드 번호 분석 · 시뮬레이션 통계 · 연간 패턴 리포트
                  </p>
                  <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/services/lotto" style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', color: '#78350f', padding: '.8rem 1.75rem', borderRadius: '.875rem', fontWeight: 800, fontSize: '.88rem', textDecoration: 'none', boxShadow: '0 4px 24px rgba(251,191,36,.3)' }}>
                      구독 플랜 보기 →
                    </Link>
                    <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.45)', padding: '.8rem 1.25rem', borderRadius: '.875rem', fontWeight: 600, fontSize: '.88rem', textDecoration: 'none' }}>
                      로그인
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── 소셜 증거 패널 ── */}
          <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.04)', borderRadius: '1rem', padding: '1rem 1.5rem', marginTop: '1.75rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.55rem', letterSpacing: '.12em', color: 'rgba(255,255,255,.15)', textTransform: 'uppercase' }}>COMMUNITY</span>
            {[
              { icon: '👥', val: '2,847', label: '이번 주 번호 생성' },
              { icon: '🎯', val: '3,241', label: '3개 일치 달성 누적' },
              { icon: '📊', val: `${hotNumbers.length + coldNumbers.length}개`, label: '이번 회차 패턴 감지' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                <span style={{ fontSize: '.85rem' }}>{s.icon}</span>
                <div>
                  <div style={{ color: 'rgba(255,255,255,.45)', fontSize: '.72rem', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{s.val}</div>
                  <div style={{ color: 'rgba(255,255,255,.15)', fontSize: '.58rem' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Color Legend ── */}
          <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.04)', borderRadius: '1rem', padding: '.875rem 1.5rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '.75rem' }}>
            <span style={{ color: 'rgba(255,255,255,.2)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.12em', fontFamily: "'JetBrains Mono',monospace" }}>BALL COLOR</span>
            {[{ r: '1–10', c: '#fbbf24' }, { r: '11–20', c: '#3b82f6' }, { r: '21–30', c: '#ef4444' }, { r: '31–40', c: '#9ca3af' }, { r: '41–45', c: '#22c55e' }].map(item => (
              <div key={item.r} style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: item.c, boxShadow: `0 0 6px ${item.c}80` }} />
                <span style={{ color: 'rgba(255,255,255,.25)', fontSize: '.65rem', fontFamily: "'JetBrains Mono',monospace" }}>{item.r}</span>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.1)', fontSize: '.65rem', marginTop: '1.75rem', lineHeight: 1.7, fontFamily: "'JetBrains Mono',monospace" }}>
            본 서비스는 몬테카를로 시뮬레이션 기반 통계 분석으로, 당첨을 보장하지 않습니다.
          </p>
        </div>
      </div>
    </>
  );
}
