'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function PortfolioSample() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const skills = [
    { name: 'Figma', level: 98 },
    { name: 'React', level: 90 },
    { name: 'TypeScript', level: 85 },
    { name: 'After Effects', level: 88 },
    { name: 'Three.js', level: 75 },
    { name: 'Framer', level: 92 },
  ];

  const projects = [
    { title: 'NEON CITY UI', desc: '사이버펑크 게임 인터페이스', gradient: 'linear-gradient(135deg, #00ff88, #00d4ff)', tag: 'UI/UX' },
    { title: 'FLOW BRAND', desc: '핀테크 스타트업 브랜딩', gradient: 'linear-gradient(135deg, #a855f7, #ec4899)', tag: 'Branding' },
    { title: 'ORBITAL APP', desc: '위성 추적 대시보드', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)', tag: 'Web App' },
    { title: 'TERRA SHOP', desc: '친환경 D2C 쇼핑몰', gradient: 'linear-gradient(135deg, #22c55e, #84cc16)', tag: 'E-commerce' },
    { title: 'PULSE MOTION', desc: '모션 그래픽 패키지', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', tag: 'Motion' },
    { title: 'AXIS SYSTEM', desc: '물류 관리 SaaS', gradient: 'linear-gradient(135deg, #64748b, #475569)', tag: 'Dashboard' },
  ];

  const timeline = [
    { year: '2023', event: 'Google UX Design Certificate 취득', type: 'award' },
    { year: '2022', event: 'Awwwards SOTD 2회 수상', type: 'award' },
    { year: '2021', event: 'LINE Corp. UI 디자이너 입사', type: 'career' },
    { year: '2020', event: 'Hongik University 시각디자인과 졸업', type: 'edu' },
    { year: '2019', event: 'Adobe Design Award Korea 은상', type: 'award' },
  ];

  return (
    <div style={{ background: '#000000', minHeight: '100vh', color: 'white' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes scanline { 0% { top: -10%; } 100% { top: 110%; } }
        @keyframes glow { 0%, 100% { text-shadow: 0 0 20px rgba(0,255,136,0.5); } 50% { text-shadow: 0 0 40px rgba(0,255,136,0.9), 0 0 80px rgba(0,255,136,0.3); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideBar { from { width: 0; } to { width: 100%; } }
        .proj-card:hover { border-color: rgba(0,255,136,0.4) !important; }
        .proj-card { transition: border-color 0.3s; }
      `}</style>

      {/* Back Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Link href="/services/website" style={{
          color: '#a5b4fc', fontSize: 13, textDecoration: 'none',
          fontFamily: 'Space Grotesk, sans-serif',
        }}>
          ← 홈페이지 제작 서비스로 돌아가기
        </Link>
        <span style={{ color: '#4c1d95', fontSize: 13 }}>|</span>
        <span style={{ color: '#00ff88', fontSize: 12, fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>
          SAMPLE · 개인 포트폴리오
        </span>
      </div>

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,255,136,0.15)',
        padding: '0 48px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{
          fontFamily: 'Space Mono, monospace', fontSize: 15, fontWeight: 700,
          color: '#00ff88', letterSpacing: '-0.02em',
          animation: 'glow 3s ease-in-out infinite',
        }}>
          KJ<span style={{ color: 'rgba(0,255,136,0.4)' }}>_</span>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          {['About', 'Work', 'Skills', 'Contact'].map((item) => (
            <span key={item} style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600,
              color: '#4b5563', cursor: 'pointer', letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>{item}</span>
          ))}
        </div>
        <button style={{
          background: 'transparent', border: '1px solid #00ff88',
          color: '#00ff88', padding: '8px 20px', borderRadius: 4,
          fontSize: 12, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'Space Mono, monospace', letterSpacing: '0.08em',
        }}>
          HIRE ME
        </button>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 48px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Scanline effect */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.4), transparent)',
          animation: 'scanline 8s linear infinite',
          pointerEvents: 'none',
        }} />
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div style={{ maxWidth: 900, position: 'relative', animation: 'fadeUp 0.8s ease forwards' }}>
          <div style={{
            fontFamily: 'Space Mono, monospace', fontSize: 12,
            color: 'rgba(0,255,136,0.6)', letterSpacing: '0.2em',
            marginBottom: 20, textTransform: 'uppercase',
          }}>
            {'> Hello, World. I am'}
          </div>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(52px, 7vw, 96px)',
            fontWeight: 700, lineHeight: 1.0, marginBottom: 16,
            letterSpacing: '-0.03em',
          }}>
            Kim<br />
            <span style={{ color: '#00ff88' }}>Jisu</span>
            <span style={{
              display: 'inline-block', width: 6, height: 'clamp(52px, 7vw, 96px)',
              background: '#00ff88', marginLeft: 8, verticalAlign: 'middle',
              animation: 'blink 1.2s step-end infinite',
            }} />
          </h1>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 20,
            color: '#4b5563', fontWeight: 500, marginBottom: 24,
          }}>
            Product Designer & Creative Developer
          </div>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 16,
            color: '#6b7280', lineHeight: 1.8, maxWidth: 520, marginBottom: 36,
          }}>
            픽셀 하나하나에 의미를 담는 디자이너. 아름다움과 기능의 교차점에서 디지털 경험을 설계합니다.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <button style={{
              background: '#00ff88', color: '#000000', border: 'none',
              padding: '14px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Space Mono, monospace', letterSpacing: '0.05em',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
            }}>
              VIEW WORK →
            </button>
            <button style={{
              background: 'transparent', color: '#9ca3af',
              border: '1px solid #1f2937',
              padding: '14px 32px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif', borderRadius: 4,
            }}>
              Download CV
            </button>
            <div style={{ display: 'flex', gap: 8, marginLeft: 8 }}>
              {['6+', '30+', '2x'].map((s, i) => (
                <div key={i} style={{
                  padding: '8px 14px', border: '1px solid #1f2937', borderRadius: 4,
                  fontFamily: 'Space Mono, monospace', fontSize: 12,
                  color: '#4b5563',
                }}>
                  <span style={{ color: '#00ff88', fontWeight: 700 }}>{s}</span>
                  <span style={{ marginLeft: 4 }}>{['YEARS', 'PROJECTS', 'AWWWARDS'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section style={{ padding: '80px 48px', background: '#050505' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 48 }}>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 700,
              letterSpacing: '-0.02em',
            }}>
              Selected Work<span style={{ color: '#00ff88' }}>.</span>
            </h2>
            <span style={{ color: '#374151', fontSize: 12, fontFamily: 'Space Mono, monospace' }}>
              2019 — 2024
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {projects.map((proj, i) => (
              <div
                key={i}
                className="proj-card"
                onMouseEnter={() => setHoveredProject(i)}
                onMouseLeave={() => setHoveredProject(null)}
                style={{
                  border: '1px solid #111827', borderRadius: 12, overflow: 'hidden',
                  cursor: 'pointer', background: '#0a0a0a',
                }}
              >
                <div style={{
                  height: 180, background: proj.gradient, position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'transform 0.3s',
                  transform: hoveredProject === i ? 'scale(1.02)' : 'scale(1)',
                }}>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700,
                    color: 'rgba(0,0,0,0.4)', letterSpacing: '-0.02em',
                  }}>
                    {proj.title}
                  </div>
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 4, padding: '3px 10px',
                    fontSize: 10, fontWeight: 700, color: 'white',
                    fontFamily: 'Space Mono, monospace', letterSpacing: '0.1em',
                  }}>{proj.tag}</div>
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>
                    {proj.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#4b5563', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {proj.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section style={{ padding: '80px 48px', background: '#000000' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 700,
              marginBottom: 36, letterSpacing: '-0.02em',
            }}>
              Skills<span style={{ color: '#00ff88' }}>.</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {skills.map((s) => (
                <div key={s.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: '#9ca3af', letterSpacing: '0.05em' }}>
                      {s.name}
                    </span>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#00ff88' }}>
                      {s.level}%
                    </span>
                  </div>
                  <div style={{ height: 3, background: '#111827', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      background: 'linear-gradient(90deg, #00ff88, #00d4ff)',
                      width: `${s.level}%`,
                      animation: 'slideBar 1.5s ease forwards',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 700,
              marginBottom: 36, letterSpacing: '-0.02em',
            }}>
              Timeline<span style={{ color: '#00ff88' }}>.</span>
            </h2>
            <div style={{ position: 'relative', paddingLeft: 20 }}>
              <div style={{
                position: 'absolute', left: 4, top: 8, bottom: 8,
                width: 1, background: '#1f2937',
              }} />
              {timeline.map((t, i) => (
                <div key={i} style={{ position: 'relative', paddingBottom: 24 }}>
                  <div style={{
                    position: 'absolute', left: -20, top: 4,
                    width: 8, height: 8, borderRadius: '50%',
                    background: t.type === 'award' ? '#00ff88' : t.type === 'career' ? '#3b82f6' : '#a855f7',
                    boxShadow: `0 0 8px ${t.type === 'award' ? 'rgba(0,255,136,0.6)' : t.type === 'career' ? 'rgba(59,130,246,0.6)' : 'rgba(168,85,247,0.6)'}`,
                  }} />
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#374151', marginBottom: 2 }}>
                    {t.year}
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, color: '#d1d5db' }}>
                    {t.event}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{
        padding: '80px 48px', textAlign: 'center',
        background: 'linear-gradient(180deg, #000000, #001a00)',
        borderTop: '1px solid rgba(0,255,136,0.1)',
      }}>
        <div style={{
          fontFamily: 'Space Mono, monospace', fontSize: 12,
          color: 'rgba(0,255,136,0.5)', letterSpacing: '0.2em', marginBottom: 20,
        }}>
          {'> LET\'S COLLABORATE'}
        </div>
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(36px, 5vw, 60px)',
          fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 16,
          animation: 'glow 3s ease-in-out infinite',
        }}>
          Have a project<span style={{ color: '#00ff88' }}>?</span>
        </h2>
        <p style={{
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 16,
          color: '#4b5563', marginBottom: 36,
        }}>
          jisu.kim@design.studio · @jisu_creates
        </p>
        <button style={{
          background: '#00ff88', color: '#000000', border: 'none',
          padding: '16px 44px', fontSize: 14, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'Space Mono, monospace', letterSpacing: '0.08em',
          clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
        }}>
          START A PROJECT →
        </button>
      </section>
    </div>
  );
}
