import Link from 'next/link';

export default function CorporateSample() {
  const services = [
    {
      title: 'IT 인프라 구축',
      desc: '기업 맞춤형 서버 환경 설계부터 클라우드 마이그레이션까지, 안정적인 IT 기반을 구축합니다.',
      detail: '온프레미스 · 하이브리드 클라우드 · AWS · Azure',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 28, height: 28 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12H3a9 9 0 1018 0h-2M12 3v4m0 10v4M4.22 4.22l2.83 2.83m9.9 9.9l2.83 2.83M3 12h.01M20.99 12H21M4.22 19.78l2.83-2.83m9.9-9.9l2.83-2.83" />
        </svg>
      ),
    },
    {
      title: '사이버 보안 솔루션',
      desc: '최신 위협에 대응하는 엔터프라이즈급 보안 시스템. 침해사고 예방부터 대응까지 통합 관리합니다.',
      detail: 'ISMS · 취약점 분석 · 보안 모니터링 · 컴플라이언스',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 28, height: 28 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
    },
    {
      title: '디지털 전환 (DX)',
      desc: '레거시 시스템을 현대화하고 비즈니스 프로세스를 자동화하는 DX 컨설팅을 제공합니다.',
      detail: 'ERP 연동 · 프로세스 자동화 · 데이터 시각화 · AI 도입',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 28, height: 28 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
        </svg>
      ),
    },
  ];

  const stats = [
    { num: '15+', label: '년 업력' },
    { num: '340+', label: '완료 프로젝트' },
    { num: '180+', label: '기업 고객사' },
    { num: '99.9%', label: '서비스 가동률' },
  ];

  const certs = ['AWS Partner', 'ISO 27001', 'ISMS-P 인증', 'Microsoft Partner', 'Google Cloud'];

  const clients = ['삼성전자', 'LG유플러스', '현대모비스', 'SK하이닉스', 'KT', '신한은행', 'NH농협', '롯데정보통신'];

  const testimonials = [
    {
      quote: '마이그레이션 기간 동안 단 한 번의 서비스 중단도 없었습니다. 완벽한 이전이었습니다.',
      name: '이○○ CTO',
      company: '핀테크 스타트업',
    },
    {
      quote: '보안 감사 이후 취약점 제로. 컴플라이언스 대응이 이렇게 빠를 수 있다는 게 놀라웠습니다.',
      name: '박○○ IT팀장',
      company: '중견 제조사',
    },
  ];

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#1e293b', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatDot { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes gridPan { from { background-position: 0 0; } to { background-position: 60px 60px; } }
        .corp-card:hover { transform: translateY(-5px); box-shadow: 0 24px 64px rgba(29,78,216,0.1); }
        .corp-card { transition: transform 0.3s, box-shadow 0.3s; }
        .corp-client:hover { background: #eff6ff !important; border-color: #bfdbfe !important; color: #1d4ed8 !important; }
        .corp-client { transition: all 0.2s; }
        .corp-cert:hover { border-color: #93c5fd !important; }
        .corp-cert { transition: border-color 0.2s; }
        .corp-btn-primary:hover { background: #1d4ed8 !important; box-shadow: 0 8px 24px rgba(29,78,216,0.4) !important; }
        .corp-btn-primary { transition: all 0.2s; }
      `}</style>

      {/* Back Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/services/website" style={{ color: '#a5b4fc', fontSize: 13, textDecoration: 'none', fontFamily: "'Noto Sans KR', sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>
          ← 홈페이지 제작 서비스로 돌아가기
        </Link>
        <span style={{ color: '#4c1d95' }}>|</span>
        <span style={{ color: '#6366f1', fontSize: 12, fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>SAMPLE · 기업 홈페이지</span>
      </div>

      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #1d4ed8, #1e40af)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 800, fontFamily: 'Montserrat, sans-serif' }}>T</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', fontFamily: 'Montserrat, sans-serif', lineHeight: 1 }}>TechSolution</div>
            <div style={{ fontSize: 10, color: '#94a3b8', letterSpacing: '0.1em', fontFamily: 'Montserrat, sans-serif' }}>ENTERPRISE IT</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {['회사소개', '서비스', '포트폴리오', '고객사', '채용', '연락처'].map((item) => (
            <span key={item} style={{ fontSize: 13, color: '#475569', cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 500 }}>{item}</span>
          ))}
          <button className="corp-btn-primary" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '9px 22px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif", boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}>
            문의하기
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(150deg, #0a192f 0%, #0d2757 50%, #0a2060 100%)', padding: '96px 48px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Animated grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)', backgroundSize: '60px 60px', animation: 'gridPan 12s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 75% 50%, rgba(59,130,246,0.12) 0%, transparent 70%)' }} />

        {/* Floating tech nodes */}
        {[
          { x: '68%', y: '20%', delay: '0s', size: 6, color: '#60a5fa' },
          { x: '78%', y: '55%', delay: '1s', size: 4, color: '#a78bfa' },
          { x: '85%', y: '35%', delay: '2s', size: 8, color: '#34d399' },
          { x: '72%', y: '72%', delay: '0.5s', size: 5, color: '#60a5fa' },
        ].map((dot, i) => (
          <div key={i} style={{ position: 'absolute', left: dot.x, top: dot.y, width: dot.size, height: dot.size, borderRadius: '50%', background: dot.color, boxShadow: `0 0 12px ${dot.color}`, animation: `floatDot 3s ease-in-out ${dot.delay} infinite` }} />
        ))}

        {/* SVG Tech Illustration */}
        <svg style={{ position: 'absolute', right: 60, top: '50%', transform: 'translateY(-50%)', width: 320, height: 280, opacity: 0.12 }} viewBox="0 0 320 280">
          <rect x="40" y="40" width="100" height="70" rx="8" stroke="#60a5fa" strokeWidth="1.5" fill="none"/>
          <rect x="180" y="40" width="100" height="70" rx="8" stroke="#a78bfa" strokeWidth="1.5" fill="none"/>
          <rect x="110" y="170" width="100" height="70" rx="8" stroke="#34d399" strokeWidth="1.5" fill="none"/>
          <line x1="140" y1="110" x2="160" y2="170" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 4"/>
          <line x1="180" y1="110" x2="160" y2="170" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4 4"/>
          <circle cx="90" cy="75" r="16" stroke="#60a5fa" strokeWidth="1" fill="rgba(96,165,250,0.1)"/>
          <circle cx="230" cy="75" r="16" stroke="#a78bfa" strokeWidth="1" fill="rgba(167,139,250,0.1)"/>
          <circle cx="160" cy="205" r="20" stroke="#34d399" strokeWidth="1" fill="rgba(52,211,153,0.1)"/>
        </svg>

        <div style={{ maxWidth: 680, position: 'relative', animation: 'fadeInUp 0.8s ease forwards' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', padding: '6px 16px', borderRadius: 4, marginBottom: 28, fontFamily: 'Montserrat, sans-serif' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#60a5fa', textTransform: 'uppercase' }}>Enterprise IT Solutions</span>
          </div>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(34px, 4vw, 54px)', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 20 }}>
            디지털 혁신으로<br />
            <span style={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>비즈니스의 미래</span>를<br />
            설계합니다
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.85, marginBottom: 36, fontFamily: "'Noto Sans KR', sans-serif" }}>
            15년의 경험과 검증된 기술력으로 기업의 IT 인프라를 혁신합니다.<br />
            클라우드, 보안, 디지털 전환까지 원스톱으로 제공합니다.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button className="corp-btn-primary" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif", boxShadow: '0 8px 24px rgba(37,99,235,0.35)' }}>
              서비스 상담 신청 →
            </button>
            <button style={{ background: 'transparent', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.18)', padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif" }}>
              회사 소개서 다운로드
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: '#1d4ed8', padding: '36px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '12px 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.2)' : 'none' }}>
              <div style={{ fontSize: 38, fontWeight: 800, color: 'white', fontFamily: 'Montserrat, sans-serif', lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 13, color: '#bfdbfe', fontFamily: "'Noto Sans KR', sans-serif", marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section style={{ background: '#f8fafc', padding: '28px 48px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Montserrat, sans-serif', flexShrink: 0 }}>인증 · 파트너십</span>
          {certs.map((c) => (
            <div key={c} className="corp-cert" style={{ padding: '8px 18px', border: '1px solid #e2e8f0', borderRadius: 6, background: 'white', fontSize: 12, fontWeight: 700, color: '#475569', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.03em' }}>
              {c}
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: '88px 48px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, color: '#2563eb', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Montserrat, sans-serif', marginBottom: 12 }}>Our Services</div>
            <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>핵심 서비스</h2>
            <p style={{ color: '#64748b', fontSize: 16, fontFamily: "'Noto Sans KR', sans-serif" }}>기업의 성장을 이끄는 검증된 IT 솔루션</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
            {services.map((svc, i) => (
              <div key={svc.title} className="corp-card" style={{ padding: 36, borderRadius: 18, background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: ['linear-gradient(90deg, #2563eb, #60a5fa)', 'linear-gradient(90deg, #7c3aed, #a78bfa)', 'linear-gradient(90deg, #059669, #34d399)'][i] }} />
                <div style={{ width: 56, height: 56, borderRadius: 14, background: ['#eff6ff', '#f5f3ff', '#f0fdf4'][i], border: `1px solid ${['#bfdbfe', '#ddd6fe', '#bbf7d0'][i]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22, color: ['#2563eb', '#7c3aed', '#059669'][i] }}>
                  {svc.icon}
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, color: '#0f172a', fontFamily: 'Montserrat, sans-serif', marginBottom: 12 }}>{svc.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8, fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 16 }}>{svc.desc}</p>
                <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 8, fontSize: 12, color: '#94a3b8', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.02em' }}>{svc.detail}</div>
                <div style={{ marginTop: 20, color: '#2563eb', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                  자세히 보기
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 48px', background: 'linear-gradient(135deg, #f0f7ff, #f8f5ff)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, color: '#2563eb', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Montserrat, sans-serif', marginBottom: 12 }}>Client Reviews</div>
            <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 32, fontWeight: 800, color: '#0f172a' }}>고객 후기</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 16, padding: '32px 28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 32, color: '#bfdbfe', fontFamily: 'Georgia, serif', lineHeight: 1, marginBottom: 16 }}>"</div>
                <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.8, fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 20 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 15, fontWeight: 700 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', fontFamily: "'Noto Sans KR', sans-serif" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', fontFamily: "'Noto Sans KR', sans-serif" }}>{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section style={{ padding: '72px 48px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Montserrat, sans-serif', marginBottom: 36 }}>Trusted By Leading Companies</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            {clients.map((c) => (
              <div key={c} className="corp-client" style={{ padding: '14px 28px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 14, fontWeight: 600, color: '#475569', fontFamily: "'Noto Sans KR', sans-serif", cursor: 'pointer' }}>{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section style={{ background: 'linear-gradient(150deg, #0a192f, #0d2757)', padding: '88px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: '#60a5fa', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Montserrat, sans-serif', marginBottom: 20 }}>Get Started</div>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 38, fontWeight: 800, color: 'white', marginBottom: 16, lineHeight: 1.2 }}>
            프로젝트를 시작하세요
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.8, marginBottom: 36, fontFamily: "'Noto Sans KR', sans-serif" }}>
            IT 솔루션이 필요하시면 언제든지 연락해주세요.<br />
            전담 컨설턴트가 최적의 방안을 제안해드립니다.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="corp-btn-primary" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '15px 40px', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif", boxShadow: '0 8px 24px rgba(37,99,235,0.4)' }}>
              무료 상담 신청
            </button>
            <button style={{ background: 'transparent', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.18)', padding: '15px 40px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif" }}>
              02-1234-5678
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#020817', padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ color: '#334155', fontSize: 13, fontFamily: "'Noto Sans KR', sans-serif" }}>© 2024 ㈜테크솔루션. All rights reserved.</div>
        <div style={{ color: '#1e293b', fontSize: 12, fontFamily: 'Montserrat, sans-serif' }}>서울특별시 강남구 테헤란로 123 테크타워 15F</div>
      </footer>
    </div>
  );
}
