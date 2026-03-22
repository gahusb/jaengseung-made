'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const rankings = [
  { rank: 1, name: 'ShadowViper_KR', score: 9_842, tier: 'GRANDMASTER', wins: 312, kda: '18.4', change: '+2' },
  { rank: 2, name: 'NightFalcon', score: 9_610, tier: 'GRANDMASTER', wins: 289, kda: '15.2', change: '0' },
  { rank: 3, name: 'Xenon_X', score: 9_241, tier: 'MASTER', wins: 267, kda: '12.9', change: '+1' },
  { rank: 4, name: 'KR_Dominator', score: 8_970, tier: 'MASTER', wins: 251, kda: '11.7', change: '-1' },
  { rank: 5, name: 'Pulse_Wave', score: 8_834, tier: 'DIAMOND', wins: 238, kda: '10.3', change: '+3' },
];

const modes = [
  { id: 'solo', name: 'SOLO', sub: '1 vs 1', desc: '순수한 실력으로 맞붙는 1대1 대결', color: '#06b6d4', players: '12,400', season: 'S7' },
  { id: 'duo', name: 'DUO', sub: '2 vs 2', desc: '파트너와 함께하는 전략적 팀플레이', color: '#a855f7', players: '28,700', season: 'S7' },
  { id: 'squad', name: 'SQUAD', sub: '5 vs 5', desc: '전략과 팀워크로 승리를 쟁취', color: '#f59e0b', players: '7,100', season: 'S7' },
];

const recentMatches = [
  { result: 'WIN', mode: 'DUO', duration: '18:32', kills: 12, deaths: 2, assists: 8, rating: '+32' },
  { result: 'WIN', mode: 'SOLO', duration: '22:11', kills: 8, deaths: 1, assists: 4, rating: '+24' },
  { result: 'LOSS', mode: 'SQUAD', duration: '31:45', kills: 5, deaths: 5, assists: 12, rating: '-18' },
  { result: 'WIN', mode: 'DUO', duration: '15:20', kills: 15, deaths: 3, assists: 6, rating: '+40' },
];

const champions = [
  { name: 'VIPER', role: 'Assassin', color: '#06b6d4', power: 92, winRate: '63%' },
  { name: 'KIRA', role: 'Support', color: '#ec4899', power: 78, winRate: '58%' },
  { name: 'IRON', role: 'Tank', color: '#94a3b8', power: 85, winRate: '55%' },
  { name: 'NOVA', role: 'Mage', color: '#a855f7', power: 88, winRate: '61%' },
];

const tierColor: Record<string, string> = {
  GRANDMASTER: '#fbbf24',
  MASTER: '#a855f7',
  DIAMOND: '#60a5fa',
};

const tierIcon = (tier: string) => (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
    <path d="M7 0L9 4L13 5L10 8.5L11 13L7 11L3 13L4 8.5L1 5L5 4Z" fill={tierColor[tier] || '#6b7280'} opacity="0.9" />
    <path d="M7 2L8.5 5L12 5.8L9.5 8.2L10.2 11.8L7 10L3.8 11.8L4.5 8.2L2 5.8L5.5 5Z" fill="white" opacity="0.2" />
  </svg>
);

export default function GameSample() {
  const [onlinePlayers, setOnlinePlayers] = useState(48_219);
  const [matchingCount, setMatchingCount] = useState(1_342);
  const [matchingActive, setMatchingActive] = useState(false);
  const [matchTimer, setMatchTimer] = useState(0);
  const [selectedChampion, setSelectedChampion] = useState(0);
  const [seasonProgress] = useState(67);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlinePlayers((p) => p + Math.floor(Math.random() * 6 - 2));
      setMatchingCount((c) => c + Math.floor(Math.random() * 4 - 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (matchingActive) {
      timer = setInterval(() => setMatchTimer((t) => t + 1), 1000);
    } else {
      setMatchTimer(0);
    }
    return () => clearInterval(timer);
  }, [matchingActive]);

  return (
    <div style={{ background: '#000000', minHeight: '100vh', color: 'white', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
        @keyframes pulse-ring { 0% { transform: scale(0.97); box-shadow: 0 0 0 0 rgba(6,182,212,0.6); } 70% { transform: scale(1); box-shadow: 0 0 0 14px rgba(6,182,212,0); } 100% { transform: scale(0.97); } }
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        @keyframes glitch { 0%, 90%, 100% { transform: none; clip-path: none; } 92% { transform: translate(-2px, 1px); clip-path: inset(30% 0 50% 0); } 94% { transform: translate(2px, -1px); clip-path: inset(60% 0 10% 0); } 96% { transform: translate(-1px, 0); clip-path: inset(10% 0 70% 0); } }
        @keyframes neonFlicker { 0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; } 20%, 24%, 55% { opacity: 0.4; } }
        @keyframes matchPulse { 0%, 100% { box-shadow: 0 0 20px rgba(6,182,212,0.4); } 50% { box-shadow: 0 0 50px rgba(6,182,212,0.9), 0 0 100px rgba(6,182,212,0.3); } }
        @keyframes float-particle { 0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; } 50% { transform: translateY(-20px) rotate(180deg); opacity: 1; } }
        @keyframes progress-fill { from { width: 0; } to { width: var(--w); } }
        .mode-card:hover { border-color: var(--card-color) !important; transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
        .mode-card { transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s; }
        .rank-row:hover { background: rgba(6,182,212,0.04) !important; }
        .rank-row { transition: background 0.15s; }
        .champ-card:hover { border-color: var(--champ-color) !important; transform: scale(1.04); }
        .champ-card { transition: border-color 0.3s, transform 0.3s; cursor: pointer; }
        .match-row:hover { background: rgba(255,255,255,0.03) !important; }
        .match-row { transition: background 0.15s; }
      `}</style>

      {/* Back Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 200 }}>
        <Link href="/services/website" style={{ color: '#a5b4fc', fontSize: 13, textDecoration: 'none', fontFamily: 'Rajdhani, sans-serif' }}>
          ← 홈페이지 제작 서비스로 돌아가기
        </Link>
        <span style={{ color: '#4c1d95' }}>|</span>
        <span style={{ color: '#06b6d4', fontSize: 12, fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}>
          SAMPLE · 게임 매칭 시스템
        </span>
      </div>

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(6,182,212,0.15)', padding: '0 48px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 18, fontWeight: 900, background: 'linear-gradient(90deg, #06b6d4, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.1em', animation: 'neonFlicker 8s infinite' }}>
          NEXUS ARENA
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {['HOME', 'MATCH', 'RANK', 'SHOP', 'CLAN'].map((item) => (
            <span key={item} style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 11, fontWeight: 700, color: '#1e3a5f', cursor: 'pointer', letterSpacing: '0.1em' }}>{item}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {/* Season pass mini */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 9, color: '#f59e0b', letterSpacing: '0.1em' }}>S7 PASS</span>
            <div style={{ width: 60, height: 4, background: '#1a1a2e', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${seasonProgress}%`, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', borderRadius: 2 }} />
            </div>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 9, color: '#f59e0b' }}>{seasonProgress}%</span>
          </div>
          <div style={{ width: 1, height: 20, background: 'rgba(6,182,212,0.2)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.8)' }} />
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: '#10b981', fontWeight: 600 }}>
              {onlinePlayers.toLocaleString()} ONLINE
            </span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '88vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 48px', background: 'radial-gradient(ellipse 80% 70% at 50% 40%, rgba(6,182,212,0.09) 0%, rgba(168,85,247,0.06) 50%, transparent 100%)' }}>
        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(6,182,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Scan */}
        <div style={{ position: 'absolute', left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)', animation: 'scan 6s linear infinite', pointerEvents: 'none' }} />

        {/* Floating particles */}
        {[
          { left: '10%', top: '20%', size: 4, delay: '0s', color: '#06b6d4' },
          { left: '85%', top: '30%', size: 6, delay: '1s', color: '#a855f7' },
          { left: '20%', top: '70%', size: 3, delay: '2s', color: '#06b6d4' },
          { left: '75%', top: '65%', size: 5, delay: '0.5s', color: '#f59e0b' },
          { left: '50%', top: '15%', size: 3, delay: '1.5s', color: '#a855f7' },
          { left: '60%', top: '80%', size: 4, delay: '2.5s', color: '#10b981' },
        ].map((p, i) => (
          <div key={i} style={{ position: 'absolute', left: p.left, top: p.top, width: p.size, height: p.size, borderRadius: '50%', background: p.color, boxShadow: `0 0 ${p.size * 3}px ${p.color}`, animation: `float-particle 4s ${p.delay} ease-in-out infinite` }} />
        ))}

        {/* Corner brackets */}
        {[
          { top: 40, left: 40, borderTop: '2px solid #06b6d4', borderLeft: '2px solid #06b6d4' },
          { top: 40, right: 40, borderTop: '2px solid #a855f7', borderRight: '2px solid #a855f7' },
          { bottom: 40, left: 40, borderBottom: '2px solid #06b6d4', borderLeft: '2px solid #06b6d4' },
          { bottom: 40, right: 40, borderBottom: '2px solid #a855f7', borderRight: '2px solid #a855f7' },
        ].map((s, i) => (
          <div key={i} style={{ position: 'absolute', width: 40, height: 40, ...s }} />
        ))}

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', color: '#06b6d4', marginBottom: 20, textTransform: 'uppercase' }}>
            Season 7 · RANKED MATCH
          </div>
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 900, lineHeight: 1.0, marginBottom: 16, background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.55) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'glitch 12s infinite' }}>
            NEXUS<br />
            <span style={{ background: 'linear-gradient(90deg, #06b6d4, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ARENA</span>
          </h1>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 18, color: '#475569', letterSpacing: '0.05em', marginBottom: 44 }}>
            ENTER THE ARENA. CLAIM YOUR GLORY.
          </p>

          {/* Live Stats */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 44 }}>
            {[
              { label: 'ONLINE', val: onlinePlayers.toLocaleString(), color: '#06b6d4' },
              { label: 'IN MATCH', val: matchingCount.toLocaleString(), color: '#a855f7' },
              { label: 'SERVERS', val: '24', color: '#10b981' },
              { label: 'AVG WAIT', val: '< 30s', color: '#f59e0b' },
            ].map((s) => (
              <div key={s.label} style={{ padding: '14px 20px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: `1px solid ${s.color}30`, borderTop: `2px solid ${s.color}`, textAlign: 'center', minWidth: 90 }}>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 22, fontWeight: 900, color: s.color }}>{s.val}</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 10, color: '#334155', letterSpacing: '0.2em', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Match button */}
          {!matchingActive ? (
            <button onClick={() => setMatchingActive(true)} style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', border: 'none', color: 'white', padding: '18px 56px', fontSize: 16, fontWeight: 900, cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.1em', clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))', animation: 'pulse-ring 2s infinite' }}>
              FIND MATCH
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ padding: '18px 56px', border: '2px solid #06b6d4', color: '#06b6d4', fontFamily: 'Orbitron, sans-serif', fontSize: 16, fontWeight: 900, letterSpacing: '0.1em', animation: 'matchPulse 1.5s infinite', clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))' }}>
                MATCHING... {String(Math.floor(matchTimer / 60)).padStart(2, '0')}:{String(matchTimer % 60).padStart(2, '0')}
              </div>
              <button onClick={() => setMatchingActive(false)} style={{ background: 'none', border: 'none', color: '#334155', fontFamily: 'Rajdhani, sans-serif', fontSize: 13, cursor: 'pointer', letterSpacing: '0.1em', textDecoration: 'underline' }}>
                CANCEL SEARCH
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Season Pass */}
      <section style={{ padding: '40px 48px', background: 'rgba(0,0,0,0.9)', borderTop: '1px solid rgba(251,191,36,0.15)', borderBottom: '1px solid rgba(251,191,36,0.15)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 11, fontWeight: 700, color: '#f59e0b', letterSpacing: '0.2em', marginBottom: 4 }}>SEASON 7 PASS</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 28, fontWeight: 700, color: 'white' }}>
                Lv. <span style={{ color: '#f59e0b' }}>42</span>
                <span style={{ fontSize: 14, color: '#475569', marginLeft: 8 }}>/ 100</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: '#475569' }}>{seasonProgress}% 완료</span>
                <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, color: '#f59e0b' }}>다음 보상까지 1,840 XP</span>
              </div>
              <div style={{ height: 8, background: '#0d0d1a', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(251,191,36,0.15)' }}>
                <div style={{ height: '100%', width: `${seasonProgress}%`, background: 'linear-gradient(90deg, #d97706, #fbbf24, #f59e0b)', borderRadius: 4, boxShadow: '0 0 12px rgba(251,191,36,0.4)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
              {['스킨 3개', '이모트 5개', '칭호 2개', '골드 5,000'].map((reward) => (
                <div key={reward} style={{ padding: '6px 12px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 4 }}>
                  <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: '#fbbf24', fontWeight: 600 }}>{reward}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Champion Select */}
      <section style={{ padding: '60px 48px', background: '#000000' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 9, color: '#06b6d4', letterSpacing: '0.2em', marginBottom: 8 }}>// ROSTER</div>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 22, fontWeight: 900, letterSpacing: '0.05em', color: 'white' }}>
                CHAMPIONS<span style={{ color: '#06b6d4' }}>.</span>
              </h2>
            </div>
            <button style={{ background: 'none', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4', padding: '7px 16px', borderRadius: 3, fontFamily: 'Orbitron, sans-serif', fontSize: 10, cursor: 'pointer', letterSpacing: '0.1em' }}>
              ALL CHAMPIONS →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {champions.map((c, i) => (
              <div
                key={c.name}
                className="champ-card"
                onClick={() => setSelectedChampion(i)}
                // @ts-expect-error CSS variable
                style={{ '--champ-color': c.color, border: `1px solid ${selectedChampion === i ? c.color : c.color + '25'}`, borderRadius: 6, padding: '22px 18px', background: selectedChampion === i ? c.color + '10' : 'rgba(0,0,0,0.6)', position: 'relative', overflow: 'hidden' }}
              >
                {selectedChampion === i && (
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 8, color: c.color, border: `1px solid ${c.color}60`, padding: '1px 6px', borderRadius: 2, letterSpacing: '0.1em' }}>SELECTED</div>
                  </div>
                )}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${c.color}, transparent)` }} />
                {/* Champion SVG silhouette */}
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: c.color + '20', border: `2px solid ${c.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="8" r="5" fill={c.color} opacity="0.8" />
                    <path d="M5 28C5 21 9 18 14 18C19 18 23 21 23 28" fill={c.color} opacity="0.6" />
                    <rect x="10" y="18" width="8" height="2" rx="1" fill={c.color} opacity="0.4" />
                  </svg>
                </div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 16, fontWeight: 900, color: 'white', marginBottom: 4 }}>{c.name}</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: c.color, letterSpacing: '0.1em', fontWeight: 600, marginBottom: 14 }}>{c.role}</div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 8, color: '#334155', letterSpacing: '0.1em' }}>POWER</span>
                    <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 9, color: c.color }}>{c.power}</span>
                  </div>
                  <div style={{ height: 3, background: '#0d0d1a', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: c.color, width: `${c.power}%`, boxShadow: `0 0 6px ${c.color}` }} />
                  </div>
                </div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: '#475569' }}>
                  Win Rate: <span style={{ color: '#10b981', fontWeight: 700 }}>{c.winRate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Modes */}
      <section style={{ padding: '56px 48px', background: 'rgba(0,0,0,0.85)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 26, fontWeight: 900, color: 'white', letterSpacing: '0.05em', marginBottom: 8 }}>
              GAME MODES
            </h2>
            <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, #06b6d4, #a855f7)', margin: '0 auto' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {modes.map((mode) => (
              <div key={mode.id} className="mode-card"
                // @ts-expect-error CSS variable
                style={{ '--card-color': mode.color, border: `1px solid ${mode.color}25`, borderRadius: 4, padding: '28px 24px', background: 'rgba(0,0,0,0.7)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${mode.color}, transparent)` }} />
                {/* Mode icon */}
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: mode.color + '15', border: `1px solid ${mode.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    {mode.id === 'solo' && <polygon points="10,2 18,18 2,18" fill={mode.color} opacity="0.9" />}
                    {mode.id === 'duo' && <><circle cx="7" cy="10" r="5" fill={mode.color} opacity="0.9" /><circle cx="13" cy="10" r="5" fill={mode.color} opacity="0.5" /></>}
                    {mode.id === 'squad' && <><rect x="2" y="2" width="7" height="7" rx="2" fill={mode.color} opacity="0.9" /><rect x="11" y="2" width="7" height="7" rx="2" fill={mode.color} opacity="0.6" /><rect x="2" y="11" width="7" height="7" rx="2" fill={mode.color} opacity="0.6" /><rect x="11" y="11" width="7" height="7" rx="2" fill={mode.color} opacity="0.4" /></>}
                  </svg>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 22, fontWeight: 900, color: 'white' }}>{mode.name}</div>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: mode.color, fontWeight: 700, letterSpacing: '0.1em' }}>{mode.sub}</div>
                </div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 15, color: '#475569', lineHeight: 1.5, marginBottom: 20 }}>{mode.desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 11, color: mode.color, letterSpacing: '0.08em' }}>{mode.players} IN QUEUE</div>
                    <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 10, color: '#1e3a5f', letterSpacing: '0.1em' }}>AVG WAIT: &lt; 30s</div>
                  </div>
                  <button style={{ background: `${mode.color}20`, border: `1px solid ${mode.color}50`, color: mode.color, padding: '7px 18px', borderRadius: 2, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.08em' }}>
                    PLAY →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rankings + Recent Matches */}
      <section style={{ padding: '56px 48px', background: '#000000' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
          {/* Rankings */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 20, fontWeight: 900, letterSpacing: '0.05em', color: 'white' }}>
                GLOBAL RANKING<span style={{ color: '#06b6d4' }}>.</span>
              </h2>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: '#1e3a5f', letterSpacing: '0.1em' }}>Season 7 · Top 100</div>
            </div>
            <div style={{ border: '1px solid rgba(6,182,212,0.12)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr 88px 60px 60px', padding: '9px 16px', borderBottom: '1px solid rgba(6,182,212,0.1)', background: 'rgba(6,182,212,0.05)' }}>
                {['RANK', 'PLAYER', 'SCORE', 'WINS', 'K/D/A'].map((h) => (
                  <div key={h} style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 8, color: '#06b6d4', letterSpacing: '0.15em' }}>{h}</div>
                ))}
              </div>
              {rankings.map((r, i) => (
                <div key={i} className="rank-row" style={{ display: 'grid', gridTemplateColumns: '52px 1fr 88px 60px 60px', padding: '13px 16px', borderBottom: i < rankings.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', alignItems: 'center' }}>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 18, fontWeight: 900, color: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#cd7c2f' : '#1e3a5f' }}>
                    {r.rank < 10 ? `0${r.rank}` : r.rank}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      {tierIcon(r.tier)}
                      <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, fontWeight: 700, color: 'white' }}>{r.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 7, color: tierColor[r.tier] || '#6b7280', border: `1px solid ${tierColor[r.tier] || '#6b7280'}40`, padding: '1px 5px', letterSpacing: '0.08em' }}>{r.tier}</span>
                      <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 9, color: r.change.startsWith('+') ? '#10b981' : r.change === '0' ? '#334155' : '#ef4444' }}>
                        {r.change === '0' ? '–' : r.change}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 13, fontWeight: 700, color: '#06b6d4' }}>{r.score.toLocaleString()}</div>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: '#475569', fontWeight: 600 }}>{r.wins}</div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 12, color: '#10b981' }}>{r.kda}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Matches */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 20, fontWeight: 900, letterSpacing: '0.05em', color: 'white' }}>
                RECENT MATCHES<span style={{ color: '#a855f7' }}>.</span>
              </h2>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: '#1e3a5f', letterSpacing: '0.1em' }}>Last 10 games</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentMatches.map((m, i) => (
                <div key={i} className="match-row" style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 12, alignItems: 'center', padding: '14px 16px', border: `1px solid ${m.result === 'WIN' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`, borderLeft: `3px solid ${m.result === 'WIN' ? '#10b981' : '#ef4444'}`, borderRadius: 4, background: m.result === 'WIN' ? 'rgba(16,185,129,0.04)' : 'rgba(239,68,68,0.04)', cursor: 'default' }}>
                  <div>
                    <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 13, fontWeight: 900, color: m.result === 'WIN' ? '#10b981' : '#ef4444' }}>{m.result}</div>
                    <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 8, color: '#334155', letterSpacing: '0.1em', marginTop: 2 }}>{m.mode}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 15, color: 'white', fontWeight: 700 }}>
                      {m.kills} / {m.deaths} / {m.assists}
                      <span style={{ fontSize: 11, color: '#475569', marginLeft: 6 }}>K/D/A</span>
                    </div>
                    <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 9, color: '#334155', marginTop: 2 }}>{m.duration}</div>
                  </div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 14, fontWeight: 900, color: m.rating.startsWith('+') ? '#10b981' : '#ef4444', textAlign: 'right' }}>
                    {m.rating}
                    <div style={{ fontSize: 8, color: '#334155', letterSpacing: '0.1em' }}>RATING</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#000000', borderTop: '1px solid rgba(6,182,212,0.08)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 14, fontWeight: 900, color: '#1e3a5f', letterSpacing: '0.1em' }}>NEXUS ARENA</div>
        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: '#1e293b', letterSpacing: '0.1em' }}>
          © 2024 NEXUS ARENA STUDIOS. ALL RIGHTS RESERVED.
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {['Twitter', 'Discord', 'YouTube', 'Twitch'].map((s) => (
            <span key={s} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: '#1e3a5f', cursor: 'pointer', letterSpacing: '0.05em' }}>{s}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
