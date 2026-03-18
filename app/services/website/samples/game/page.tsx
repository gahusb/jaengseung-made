'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function GameSample() {
  const [onlinePlayers, setOnlinePlayers] = useState(48_219);
  const [matchingCount, setMatchingCount] = useState(1_342);
  const [matchingActive, setMatchingActive] = useState(false);
  const [matchTimer, setMatchTimer] = useState(0);

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
      timer = setInterval(() => {
        setMatchTimer((t) => t + 1);
      }, 1000);
    } else {
      setMatchTimer(0);
    }
    return () => clearInterval(timer);
  }, [matchingActive]);

  const rankings = [
    { rank: 1, name: 'ShadowViper_KR', score: 9_842, tier: 'GRANDMASTER', wins: 312, kda: '18.4' },
    { rank: 2, name: 'NightFalcon', score: 9_610, tier: 'GRANDMASTER', wins: 289, kda: '15.2' },
    { rank: 3, name: 'Xenon_X', score: 9_241, tier: 'MASTER', wins: 267, kda: '12.9' },
    { rank: 4, name: 'KR_Dominator', score: 8_970, tier: 'MASTER', wins: 251, kda: '11.7' },
    { rank: 5, name: 'Pulse_Wave', score: 8_834, tier: 'DIAMOND', wins: 238, kda: '10.3' },
  ];

  const modes = [
    {
      id: 'solo',
      name: 'SOLO',
      sub: '1 vs 1',
      desc: '순수한 실력으로 맞붙는 1대1 대결',
      icon: '⚡',
      color: '#06b6d4',
      players: '12,400',
    },
    {
      id: 'duo',
      name: 'DUO',
      sub: '2 vs 2',
      desc: '파트너와 함께하는 팀플레이',
      icon: '◈',
      color: '#a855f7',
      players: '28,700',
    },
    {
      id: 'squad',
      name: 'SQUAD',
      sub: '5 vs 5',
      desc: '전략과 팀워크로 승리를 쟁취',
      icon: '▲',
      color: '#f59e0b',
      players: '7,100',
    },
  ];

  const tierColor: Record<string, string> = {
    GRANDMASTER: '#fbbf24',
    MASTER: '#a855f7',
    DIAMOND: '#60a5fa',
  };

  return (
    <div style={{ background: '#000000', minHeight: '100vh', color: 'white', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
        @keyframes pulse-ring { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(6,182,212,0.6); } 70% { transform: scale(1); box-shadow: 0 0 0 16px rgba(6,182,212,0); } 100% { transform: scale(0.95); } }
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        @keyframes glitch { 0%, 90%, 100% { transform: none; } 92% { transform: translate(-2px, 1px); } 94% { transform: translate(2px, -1px); } 96% { transform: translate(-1px, 0); } }
        @keyframes neonFlicker { 0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; } 20%, 24%, 55% { opacity: 0.4; } }
        @keyframes matchPulse { 0%, 100% { box-shadow: 0 0 20px rgba(6,182,212,0.4); } 50% { box-shadow: 0 0 40px rgba(6,182,212,0.9), 0 0 80px rgba(6,182,212,0.4); } }
        @keyframes counter { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .mode-card:hover { border-color: var(--card-color) !important; transform: translateY(-4px); }
        .mode-card { transition: border-color 0.3s, transform 0.3s; }
        .rank-row:hover { background: rgba(6,182,212,0.04) !important; }
        .rank-row { transition: background 0.15s; }
      `}</style>

      {/* Back Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12,
        position: 'relative', zIndex: 200,
      }}>
        <Link href="/services/website" style={{
          color: '#a5b4fc', fontSize: 13, textDecoration: 'none',
          fontFamily: 'Rajdhani, sans-serif',
        }}>
          ← 홈페이지 제작 서비스로 돌아가기
        </Link>
        <span style={{ color: '#4c1d95', fontSize: 13 }}>|</span>
        <span style={{ color: '#06b6d4', fontSize: 12, fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}>
          SAMPLE · 게임 매칭 시스템
        </span>
      </div>

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(6,182,212,0.2)',
        padding: '0 48px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{
          fontFamily: 'Orbitron, sans-serif', fontSize: 18, fontWeight: 900,
          background: 'linear-gradient(90deg, #06b6d4, #a855f7)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '0.1em',
          animation: 'neonFlicker 8s infinite',
        }}>
          NEXUS ARENA
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {['HOME', 'MATCH', 'RANK', 'SHOP', 'CLAN'].map((item) => (
            <span key={item} style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: 11, fontWeight: 700,
              color: '#1e3a5f', cursor: 'pointer', letterSpacing: '0.1em',
            }}>{item}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.8)',
          }} />
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: '#10b981', fontWeight: 600 }}>
            {onlinePlayers.toLocaleString()} ONLINE
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '85vh', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 48px',
        background: 'radial-gradient(ellipse 80% 70% at 50% 40%, rgba(6,182,212,0.08) 0%, rgba(168,85,247,0.05) 50%, transparent 100%)',
      }}>
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Scan line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)',
          animation: 'scan 6s linear infinite',
          pointerEvents: 'none',
        }} />

        {/* Corner decorations */}
        {[
          { top: 40, left: 40, borderTop: '2px solid #06b6d4', borderLeft: '2px solid #06b6d4' },
          { top: 40, right: 40, borderTop: '2px solid #a855f7', borderRight: '2px solid #a855f7' },
          { bottom: 40, left: 40, borderBottom: '2px solid #06b6d4', borderLeft: '2px solid #06b6d4' },
          { bottom: 40, right: 40, borderBottom: '2px solid #a855f7', borderRight: '2px solid #a855f7' },
        ].map((s, i) => (
          <div key={i} style={{ position: 'absolute', width: 40, height: 40, ...s }} />
        ))}

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: 'Orbitron, sans-serif', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.3em', color: '#06b6d4', marginBottom: 20,
            textTransform: 'uppercase',
          }}>
            Season 7 · RANKED MATCH
          </div>
          <h1 style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(48px, 8vw, 100px)',
            fontWeight: 900, lineHeight: 1.0, marginBottom: 16,
            background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.6) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            animation: 'glitch 10s infinite',
          }}>
            NEXUS<br />
            <span style={{
              background: 'linear-gradient(90deg, #06b6d4, #a855f7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>ARENA</span>
          </h1>
          <p style={{
            fontFamily: 'Rajdhani, sans-serif', fontSize: 18, color: '#475569',
            letterSpacing: '0.05em', marginBottom: 48,
          }}>
            ENTER THE ARENA. CLAIM YOUR GLORY.
          </p>

          {/* Live Stats */}
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginBottom: 48 }}>
            {[
              { label: 'ONLINE', val: onlinePlayers.toLocaleString(), color: '#06b6d4' },
              { label: 'IN MATCH', val: matchingCount.toLocaleString(), color: '#a855f7' },
              { label: 'SERVERS', val: '24', color: '#10b981' },
            ].map((s) => (
              <div key={s.label} style={{
                padding: '16px 24px',
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                border: `1px solid ${s.color}30`,
                borderTop: `2px solid ${s.color}`,
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: 'Orbitron, sans-serif', fontSize: 28, fontWeight: 900,
                  color: s.color, letterSpacing: '-0.02em',
                }}>{s.val}</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: '#334155', letterSpacing: '0.2em', marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Matching Button */}
          {!matchingActive ? (
            <button
              onClick={() => setMatchingActive(true)}
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                border: 'none', color: 'white',
                padding: '18px 56px', fontSize: 16, fontWeight: 900,
                cursor: 'pointer', fontFamily: 'Orbitron, sans-serif',
                letterSpacing: '0.1em',
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                animation: 'pulse-ring 2s infinite',
              }}
            >
              FIND MATCH
            </button>
          ) : (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                padding: '18px 56px',
                border: '2px solid #06b6d4', color: '#06b6d4',
                fontFamily: 'Orbitron, sans-serif', fontSize: 16, fontWeight: 900,
                letterSpacing: '0.1em', animation: 'matchPulse 1.5s infinite',
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
              }}>
                MATCHING... {String(Math.floor(matchTimer / 60)).padStart(2, '0')}:{String(matchTimer % 60).padStart(2, '0')}
              </div>
              <button onClick={() => setMatchingActive(false)} style={{
                background: 'none', border: 'none', color: '#334155',
                fontFamily: 'Rajdhani, sans-serif', fontSize: 13, cursor: 'pointer',
                letterSpacing: '0.1em', textDecoration: 'underline',
              }}>
                CANCEL
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Game Modes */}
      <section style={{ padding: '60px 48px', background: 'rgba(0,0,0,0.8)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: 28, fontWeight: 900,
              color: 'white', letterSpacing: '0.05em', marginBottom: 8,
            }}>
              GAME MODES
            </h2>
            <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, #06b6d4, #a855f7)', margin: '0 auto' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {modes.map((mode) => (
              <div
                key={mode.id}
                className="mode-card"
                // @ts-expect-error CSS variable
                style={{ '--card-color': mode.color, border: `1px solid ${mode.color}25`, borderRadius: 4, padding: '28px 24px', background: 'rgba(0,0,0,0.6)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, transparent, ${mode.color}, transparent)`,
                }} />
                <div style={{
                  fontSize: 36, marginBottom: 16, color: mode.color,
                  textShadow: `0 0 20px ${mode.color}`,
                }}>{mode.icon}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                  <div style={{
                    fontFamily: 'Orbitron, sans-serif', fontSize: 24, fontWeight: 900, color: 'white',
                  }}>{mode.name}</div>
                  <div style={{
                    fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: mode.color,
                    fontWeight: 700, letterSpacing: '0.1em',
                  }}>{mode.sub}</div>
                </div>
                <div style={{
                  fontFamily: 'Rajdhani, sans-serif', fontSize: 15, color: '#475569',
                  lineHeight: 1.5, marginBottom: 20,
                }}>{mode.desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    fontFamily: 'Orbitron, sans-serif', fontSize: 11,
                    color: mode.color, letterSpacing: '0.1em',
                  }}>
                    {mode.players} IN QUEUE
                  </div>
                  <button style={{
                    background: `${mode.color}20`, border: `1px solid ${mode.color}50`,
                    color: mode.color, padding: '6px 16px', borderRadius: 2,
                    fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.08em',
                  }}>
                    PLAY →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rankings */}
      <section style={{ padding: '60px 48px', background: '#000000' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: 24, fontWeight: 900,
              letterSpacing: '0.05em', color: 'white',
            }}>
              GLOBAL RANKING<span style={{ color: '#06b6d4' }}>.</span>
            </h2>
            <div style={{
              fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: '#1e3a5f',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              Season 7 · Top 100
            </div>
          </div>
          <div style={{
            border: '1px solid rgba(6,182,212,0.15)', borderRadius: 4, overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 100px 80px 80px',
              padding: '10px 20px', borderBottom: '1px solid rgba(6,182,212,0.1)',
              background: 'rgba(6,182,212,0.05)',
            }}>
              {['RANK', 'PLAYER', 'SCORE', 'WINS', 'K/D/A'].map((h) => (
                <div key={h} style={{
                  fontFamily: 'Orbitron, sans-serif', fontSize: 9, color: '#06b6d4',
                  letterSpacing: '0.15em',
                }}>{h}</div>
              ))}
            </div>
            {rankings.map((r, i) => (
              <div
                key={i}
                className="rank-row"
                style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr 100px 80px 80px',
                  padding: '14px 20px',
                  borderBottom: i < rankings.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                  alignItems: 'center',
                }}
              >
                <div style={{
                  fontFamily: 'Orbitron, sans-serif', fontSize: 20, fontWeight: 900,
                  color: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#cd7c2f' : '#1e3a5f',
                }}>
                  {r.rank < 10 ? `0${r.rank}` : r.rank}
                </div>
                <div>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 15, fontWeight: 700, color: 'white' }}>
                    {r.name}
                  </div>
                  <div style={{
                    display: 'inline-block', marginTop: 2,
                    fontFamily: 'Orbitron, sans-serif', fontSize: 8, fontWeight: 700,
                    color: tierColor[r.tier] || '#6b7280',
                    border: `1px solid ${tierColor[r.tier] || '#6b7280'}40`,
                    padding: '1px 6px', letterSpacing: '0.1em',
                  }}>{r.tier}</div>
                </div>
                <div style={{
                  fontFamily: 'Orbitron, sans-serif', fontSize: 14, fontWeight: 700,
                  color: '#06b6d4',
                }}>{r.score.toLocaleString()}</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: '#475569', fontWeight: 600 }}>
                  {r.wins}
                </div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 13, color: '#10b981' }}>
                  {r.kda}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#000000', borderTop: '1px solid rgba(6,182,212,0.1)',
        padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{
          fontFamily: 'Orbitron, sans-serif', fontSize: 14, fontWeight: 900,
          color: '#1e3a5f', letterSpacing: '0.1em',
        }}>NEXUS ARENA</div>
        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: '#1e293b', letterSpacing: '0.1em' }}>
          © 2024 NEXUS ARENA STUDIOS. ALL RIGHTS RESERVED.
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {['Twitter', 'Discord', 'YouTube'].map((s) => (
            <span key={s} style={{
              fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: '#1e3a5f',
              cursor: 'pointer', letterSpacing: '0.05em',
            }}>{s}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
