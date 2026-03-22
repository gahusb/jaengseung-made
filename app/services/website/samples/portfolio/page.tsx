'use client';

import Link from 'next/link';
import { useState } from 'react';

const awards = [
  { name: 'Awwwards SOTD', count: '× 2', color: '#f59e0b' },
  { name: 'CSS Design Awards', count: 'Winner', color: '#06b6d4' },
  { name: 'Adobe Design Award', count: '은상', color: '#ec4899' },
  { name: 'Google UX Cert.', count: '2023', color: '#34d399' },
];

const services = [
  { title: 'UI/UX Design', desc: '사용자 중심의 인터페이스 설계와 프로토타입', icon: 'M', color: '#00ff88' },
  { title: 'Creative Development', desc: 'Three.js · WebGL · 몰입형 웹 경험 구현', icon: 'C', color: '#a855f7' },
  { title: 'Brand Identity', desc: '로고부터 브랜드 시스템 전체 디자인', icon: 'B', color: '#06b6d4' },
  { title: 'Motion Design', desc: 'After Effects · Lottie 모션 에셋 제작', icon: 'M', color: '#f59e0b' },
];

const projects = [
  { title: 'NEON CITY UI', desc: '사이버펑크 게임 인터페이스 디자인. 넥슨 신작 게임의 전체 UI 시스템 구축', gradient: 'linear-gradient(135deg, #00ff88, #00d4ff)', tag: 'UI/UX', year: '2024', featured: true },
  { title: 'FLOW BRAND', desc: '핀테크 스타트업 브랜딩 — 시리즈 B 투자유치 직전 리브랜딩', gradient: 'linear-gradient(135deg, #a855f7, #ec4899)', tag: 'Branding', year: '2024', featured: false },
  { title: 'ORBITAL APP', desc: '위성 추적 실시간 대시보드 — NASA 오픈 API 활용', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)', tag: 'Web App', year: '2023', featured: false },
  { title: 'TERRA SHOP', desc: '친환경 D2C 쇼핑몰 — 전환율 340% 개선 달성', gradient: 'linear-gradient(135deg, #22c55e, #84cc16)', tag: 'E-commerce', year: '2023', featured: false },
  { title: 'PULSE MOTION', desc: '글로벌 광고 에이전시를 위한 모션 그래픽 패키지', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', tag: 'Motion', year: '2023', featured: false },
  { title: 'AXIS SYSTEM', desc: '스타트업 물류 관리 SaaS — 현재 MAU 12만', gradient: 'linear-gradient(135deg, #64748b, #475569)', tag: 'Dashboard', year: '2022', featured: false },
];

const skills = [
  { name: 'Figma', level: 98, category: 'Design' },
  { name: 'Framer', level: 92, category: 'Design' },
  { name: 'After Effects', level: 88, category: 'Motion' },
  { name: 'React', level: 90, category: 'Code' },
  { name: 'TypeScript', level: 85, category: 'Code' },
  { name: 'Three.js', level: 75, category: 'Code' },
];

const timeline = [
  { year: '2023', event: 'Google UX Design Certificate 취득', type: 'award' },
  { year: '2022', event: 'Awwwards SOTD 2회 수상', type: 'award' },
  { year: '2021', event: 'LINE Corp. UI 디자이너 입사', type: 'career' },
  { year: '2020', event: 'Hongik University 시각디자인과 졸업', type: 'edu' },
  { year: '2019', event: 'Adobe Design Award Korea 은상', type: 'award' },
];

const testimonials = [
  { client: 'Joon Park', role: 'CEO, FlowTech', text: 'Jisu가 리디자인한 결과물로 투자 피칭에서 VC들의 반응이 완전히 달라졌습니다. 결과적으로 시리즈 B 클로징에 큰 역할을 했어요.' },
  { client: 'Yuna Kim', role: 'Product Lead, Orbital', text: '기술적인 복잡함을 이렇게 아름다운 인터페이스로 풀어낼 수 있다는 게 놀라웠습니다. 유저 피드백 NPS가 34점 올랐습니다.' },
];

export default function PortfolioSample() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'UI/UX', 'Branding', 'Web App', 'Motion'];
  const filteredProjects = activeCategory === 'All' ? projects : projects.filter(p => p.tag === activeCategory);

  return (
    <div style={{ background: '#000000', minHeight: '100vh', color: 'white' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes scanline { 0% { top: -10%; } 100% { top: 110%; } }
        @keyframes glow { 0%, 100% { text-shadow: 0 0 20px rgba(0,255,136,0.5); } 50% { text-shadow: 0 0 40px rgba(0,255,136,0.9), 0 0 80px rgba(0,255,136,0.3); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideBar { from { width: 0; } to { width: 100%; } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pulse-green { 0%, 100% { box-shadow: 0 0 0 0 rgba(0,255,136,0.4); } 50% { box-shadow: 0 0 0 6px rgba(0,255,136,0); } }
        .proj-card { transition: border-color 0.3s, transform 0.3s; }
        .proj-card:hover { border-color: rgba(0,255,136,0.3) !important; transform: translateY(-4px); }
        .service-card { transition: background 0.3s, border-color 0.3s; }
        .service-card:hover { background: rgba(255,255,255,0.04) !important; }
        .cat-btn { transition: background 0.2s, color 0.2s; cursor: pointer; }
        .cat-btn:hover { color: white !important; }
        .award-badge { transition: transform 0.2s; }
        .award-badge:hover { transform: translateY(-2px); }
      `}</style>

      {/* Back Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/services/website" style={{ color: '#a5b4fc', fontSize: 13, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif' }}>
          ← 홈페이지 제작 서비스로 돌아가기
        </Link>
        <span style={{ color: '#4c1d95' }}>|</span>
        <span style={{ color: '#00ff88', fontSize: 12, fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>
          SAMPLE · 개인 포트폴리오
        </span>
      </div>

      {/* Awards Marquee */}
      <div style={{ background: '#050505', borderBottom: '1px solid rgba(0,255,136,0.12)', padding: '10px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 48, animation: 'marquee 18s linear infinite', width: 'fit-content' }}>
          {[...awards, ...awards].map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1l1.3 2.6L10 4.1 8 6.1l.5 2.9L6 7.6 3.5 9l.5-2.9-2-2 2.7-.5z" fill={a.color} /></svg>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: a.color, fontWeight: 700, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{a.name}</span>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#374151' }}>{a.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,255,136,0.1)',
        padding: '0 48px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 15, fontWeight: 700, color: '#00ff88', letterSpacing: '-0.02em', animation: 'glow 3s ease-in-out infinite' }}>
          KJ<span style={{ color: 'rgba(0,255,136,0.35)' }}>_</span>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          {['About', 'Work', 'Skills', 'Contact'].map((item) => (
            <span key={item} style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{item}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00ff88', animation: 'pulse-green 2s infinite' }} />
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#00ff88' }}>Available for work</span>
          </div>
          <button style={{
            background: 'transparent', border: '1px solid #00ff88', color: '#00ff88',
            padding: '8px 20px', borderRadius: 4, fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Space Mono, monospace', letterSpacing: '0.08em',
          }}>
            HIRE ME
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 48px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.4), transparent)', animation: 'scanline 8s linear infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div style={{ maxWidth: 1000, display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'center', position: 'relative', animation: 'fadeUp 0.8s ease forwards' }}>
          <div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: 'rgba(0,255,136,0.6)', letterSpacing: '0.2em', marginBottom: 20, textTransform: 'uppercase' }}>
              {'> Hello, World. I am'}
            </div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(52px, 7vw, 88px)', fontWeight: 700, lineHeight: 1.0, marginBottom: 16, letterSpacing: '-0.03em' }}>
              Kim<br />
              <span style={{ color: '#00ff88' }}>Jisu</span>
              <span style={{ display: 'inline-block', width: 6, height: 'clamp(52px, 7vw, 88px)', background: '#00ff88', marginLeft: 8, verticalAlign: 'middle', animation: 'blink 1.2s step-end infinite' }} />
            </h1>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, color: '#4b5563', fontWeight: 500, marginBottom: 20 }}>
              Product Designer & Creative Developer
            </div>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, color: '#6b7280', lineHeight: 1.8, maxWidth: 520, marginBottom: 36 }}>
              픽셀 하나하나에 의미를 담는 디자이너. 아름다움과 기능의 교차점에서 디지털 경험을 설계합니다.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <button style={{
                background: '#00ff88', color: '#000000', border: 'none', padding: '14px 32px',
                fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Mono, monospace',
                letterSpacing: '0.05em', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              }}>
                VIEW WORK →
              </button>
              <button style={{
                background: 'transparent', color: '#9ca3af', border: '1px solid #1f2937',
                padding: '14px 32px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif', borderRadius: 4,
              }}>
                Download CV
              </button>
            </div>
          </div>

          {/* Stats panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { val: '6+', label: 'YEARS EXP.', color: '#00ff88' },
              { val: '30+', label: 'PROJECTS', color: '#a855f7' },
              { val: '2×', label: 'AWWWARDS', color: '#f59e0b' },
              { val: '340%', label: 'MAX CVR LIFT', color: '#06b6d4' },
            ].map((s) => (
              <div key={s.label} style={{ padding: '14px 18px', border: '1px solid #111827', borderLeft: `3px solid ${s.color}`, borderRadius: 4, background: '#050505', minWidth: 140 }}>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 24, fontWeight: 700, color: s.color }}>{s.val}</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: '#374151', letterSpacing: '0.15em', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: '72px 48px', background: '#050505', borderTop: '1px solid rgba(0,255,136,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(0,255,136,0.5)', letterSpacing: '0.2em', marginBottom: 10 }}>// WHAT I DO</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em' }}>
              Services<span style={{ color: '#00ff88' }}>.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {services.map((svc) => (
              <div key={svc.title} className="service-card" style={{
                padding: '24px 20px', border: '1px solid #111827', borderRadius: 8,
                background: 'transparent', cursor: 'pointer', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: svc.color, opacity: 0.6 }} />
                <div style={{ width: 36, height: 36, borderRadius: 8, background: svc.color + '15', border: `1px solid ${svc.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, fontWeight: 700, color: svc.color }}>{svc.icon}</span>
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 8 }}>{svc.title}</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#4b5563', lineHeight: 1.6 }}>{svc.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Detail */}
      <section style={{ padding: '60px 48px', background: '#000000', borderTop: '1px solid rgba(0,255,136,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {awards.map((a) => (
              <div key={a.name} className="award-badge" style={{
                padding: '12px 20px', border: `1px solid ${a.color}30`, borderRadius: 8,
                background: a.color + '08', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1l1.5 3 3.5.5-2.5 2.4.6 3.4L7 8.8 3.9 10.3l.6-3.4L2 4.5 5.5 4z" fill={a.color} /></svg>
                <div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 700, color: 'white' }}>{a.name}</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: a.color }}>{a.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section style={{ padding: '80px 48px', background: '#050505', borderTop: '1px solid rgba(0,255,136,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(0,255,136,0.5)', letterSpacing: '0.2em', marginBottom: 8 }}>// SELECTED WORK</div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }}>
                Projects<span style={{ color: '#00ff88' }}>.</span>
              </h2>
            </div>
            <span style={{ color: '#374151', fontSize: 12, fontFamily: 'Space Mono, monospace' }}>2019 — 2024</span>
          </div>
          {/* Category filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            {categories.map((cat) => (
              <button key={cat} className="cat-btn" onClick={() => setActiveCategory(cat)} style={{
                background: activeCategory === cat ? '#00ff88' : 'transparent',
                color: activeCategory === cat ? '#000' : '#374151',
                border: '1px solid ' + (activeCategory === cat ? '#00ff88' : '#1f2937'),
                padding: '6px 16px', borderRadius: 4, fontSize: 11,
                fontWeight: 700, fontFamily: 'Space Mono, monospace', letterSpacing: '0.06em',
              }}>{cat}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {filteredProjects.map((proj, i) => (
              <div
                key={proj.title}
                className="proj-card"
                onMouseEnter={() => setHoveredProject(i)}
                onMouseLeave={() => setHoveredProject(null)}
                style={{ border: '1px solid #111827', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', background: '#0a0a0a', position: 'relative' }}
              >
                <div style={{ height: 200, background: proj.gradient, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, color: 'rgba(0,0,0,0.35)', letterSpacing: '-0.02em' }}>{proj.title}</div>
                  </div>
                  {/* Hover overlay */}
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
                    transition: 'opacity 0.3s', opacity: hoveredProject === i ? 1 : 0,
                  }}>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, color: 'white', fontWeight: 600, textAlign: 'center', padding: '0 20px', lineHeight: 1.5 }}>{proj.desc}</div>
                    <button style={{ background: '#00ff88', color: '#000', border: 'none', padding: '8px 20px', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Mono, monospace', letterSpacing: '0.06em' }}>
                      VIEW PROJECT →
                    </button>
                  </div>
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '3px 10px', fontSize: 10, fontWeight: 700, color: 'white', fontFamily: 'Space Mono, monospace', letterSpacing: '0.1em' }}>
                    {proj.tag}
                  </div>
                  <div style={{ position: 'absolute', top: 12, right: 12, fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
                    {proj.year}
                  </div>
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>{proj.title}</div>
                  <div style={{ fontSize: 13, color: '#4b5563', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.5 }}>{proj.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills + Timeline */}
      <section style={{ padding: '80px 48px', background: '#000000', borderTop: '1px solid rgba(0,255,136,0.08)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(0,255,136,0.5)', letterSpacing: '0.2em', marginBottom: 10 }}>// EXPERTISE</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 700, marginBottom: 36, letterSpacing: '-0.02em' }}>
              Skills<span style={{ color: '#00ff88' }}>.</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {skills.map((s) => (
                <div key={s.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: '#9ca3af', letterSpacing: '0.05em' }}>{s.name}</span>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: '#1f2937', letterSpacing: '0.1em', border: '1px solid #1f2937', padding: '1px 6px', borderRadius: 2 }}>{s.category}</span>
                    </div>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#00ff88' }}>{s.level}%</span>
                  </div>
                  <div style={{ height: 3, background: '#111827', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #00ff88, #00d4ff)', width: `${s.level}%`, animation: 'slideBar 1.5s ease forwards' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(0,255,136,0.5)', letterSpacing: '0.2em', marginBottom: 10 }}>// JOURNEY</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 700, marginBottom: 36, letterSpacing: '-0.02em' }}>
              Timeline<span style={{ color: '#00ff88' }}>.</span>
            </h2>
            <div style={{ position: 'relative', paddingLeft: 20 }}>
              <div style={{ position: 'absolute', left: 4, top: 8, bottom: 8, width: 1, background: '#1f2937' }} />
              {timeline.map((t, i) => (
                <div key={i} style={{ position: 'relative', paddingBottom: 24 }}>
                  <div style={{
                    position: 'absolute', left: -20, top: 4, width: 8, height: 8, borderRadius: '50%',
                    background: t.type === 'award' ? '#00ff88' : t.type === 'career' ? '#3b82f6' : '#a855f7',
                    boxShadow: `0 0 8px ${t.type === 'award' ? 'rgba(0,255,136,0.6)' : t.type === 'career' ? 'rgba(59,130,246,0.6)' : 'rgba(168,85,247,0.6)'}`,
                  }} />
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#374151', marginBottom: 3 }}>{t.year}</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, color: '#d1d5db', lineHeight: 1.5 }}>{t.event}</div>
                  {t.type === 'award' && (
                    <div style={{ marginTop: 4 }}>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: '#00ff88', border: '1px solid rgba(0,255,136,0.3)', padding: '1px 6px', borderRadius: 2 }}>AWARD</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '72px 48px', background: '#050505', borderTop: '1px solid rgba(0,255,136,0.08)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(0,255,136,0.5)', letterSpacing: '0.2em', marginBottom: 10 }}>// CLIENT VOICES</div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 700, marginBottom: 36, letterSpacing: '-0.02em' }}>
            Testimonials<span style={{ color: '#00ff88' }}>.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {testimonials.map((t) => (
              <div key={t.client} style={{ padding: '28px 24px', border: '1px solid #111827', borderRadius: 8, background: '#0a0a0a', position: 'relative' }}>
                <svg width="28" height="20" viewBox="0 0 28 20" fill="none" style={{ marginBottom: 16, opacity: 0.25 }}>
                  <path d="M0 20V12C0 5.3 4 1.5 12 0l1.7 3C9.5 4.3 7.3 6.7 7 10h5.3V20H0zm14.7 0V12C14.7 5.3 18.7 1.5 26.7 0l1.3 3c-4.2 1.3-6.4 3.7-6.7 7H27V20H14.7z" fill="#00ff88" />
                </svg>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, color: '#9ca3af', lineHeight: 1.8, marginBottom: 20 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #00ff88, #00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000', fontFamily: 'Space Mono, monospace' }}>
                    {t.client[0]}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 600, color: 'white' }}>{t.client}</div>
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#374151' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{ padding: '96px 48px', textAlign: 'center', background: 'linear-gradient(180deg, #000000, #001a00)', borderTop: '1px solid rgba(0,255,136,0.1)' }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: 'rgba(0,255,136,0.5)', letterSpacing: '0.2em', marginBottom: 20 }}>
          {'> LET\'S COLLABORATE'}
        </div>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 16, animation: 'glow 3s ease-in-out infinite' }}>
          Have a project<span style={{ color: '#00ff88' }}>?</span>
        </h2>
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, color: '#4b5563', marginBottom: 8 }}>
          jisu.kim@design.studio
        </p>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: '#1f2937', marginBottom: 36 }}>
          @jisu_creates · Response within 24h
        </p>
        <button style={{
          background: '#00ff88', color: '#000000', border: 'none', padding: '16px 48px',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Mono, monospace',
          letterSpacing: '0.08em', clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
        }}>
          START A PROJECT →
        </button>
      </section>
    </div>
  );
}
