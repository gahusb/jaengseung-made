import Link from 'next/link';

export default function CorporateSample() {
  const services = [
    {
      icon: '🔧',
      title: 'IT 인프라 구축',
      desc: '기업 맞춤형 서버 환경 설계부터 클라우드 마이그레이션까지, 안정적인 IT 기반을 구축해드립니다.',
    },
    {
      icon: '🔒',
      title: '보안 솔루션',
      desc: '최신 사이버 위협에 대응하는 엔터프라이즈급 보안 시스템을 제공합니다.',
    },
    {
      icon: '📡',
      title: '디지털 전환',
      desc: '레거시 시스템을 현대화하고 비즈니스 프로세스를 효율화하는 DX 컨설팅을 제공합니다.',
    },
  ];

  const stats = [
    { num: '15+', label: '년 업력' },
    { num: '340+', label: '완료 프로젝트' },
    { num: '180+', label: '기업 고객사' },
    { num: '98%', label: '고객 만족도' },
  ];

  const clients = ['삼성전자', 'LG유플러스', '현대모비스', 'SK하이닉스', 'KT', '신한은행', 'NH농협', '롯데정보통신'];

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#1e293b', fontFamily: "'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        .corp-nav-link:hover { color: #1d4ed8 !important; }
        .corp-service-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
        .corp-service-card { transition: transform 0.3s, box-shadow 0.3s; }
        .corp-btn:hover { background: #1d4ed8 !important; }
        .corp-btn { transition: background 0.2s; }
        .corp-client:hover { background: #eff6ff !important; color: #1d4ed8 !important; }
        .corp-client { transition: background 0.2s, color 0.2s; }
      `}</style>

      {/* Back Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        padding: '10px 24px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Link href="/services/website" style={{
          color: '#a5b4fc', fontSize: 13, textDecoration: 'none', fontFamily: "'Noto Sans KR', sans-serif",
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ← 홈페이지 제작 서비스로 돌아가기
        </Link>
        <span style={{ color: '#4c1d95', fontSize: 13 }}>|</span>
        <span style={{ color: '#6366f1', fontSize: 12, fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
          SAMPLE · 기업 홈페이지
        </span>
      </div>

      {/* Navbar */}
      <nav style={{
        background: '#ffffff', borderBottom: '1px solid #e2e8f0',
        padding: '0 48px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 16, fontWeight: 800, fontFamily: 'Montserrat, sans-serif',
          }}>T</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', fontFamily: 'Montserrat, sans-serif', lineHeight: 1 }}>
              TechSolution
            </div>
            <div style={{ fontSize: 10, color: '#64748b', letterSpacing: '0.05em' }}>㈜테크솔루션</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {['회사소개', '서비스', '포트폴리오', '고객사', '채용', '연락처'].map((item) => (
            <span key={item} className="corp-nav-link" style={{
              fontSize: 14, color: '#475569', cursor: 'pointer',
              fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 500,
            }}>{item}</span>
          ))}
          <button style={{
            background: '#1d4ed8', color: 'white', border: 'none',
            padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700,
            cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif",
          }}>
            문의하기
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(150deg, #0a192f 0%, #112240 45%, #0d3b7e 100%)',
        padding: '100px 48px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(59,130,246,0.15) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', right: 80, top: '50%', transform: 'translateY(-50%)',
          width: 360, height: 360,
          background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.08))',
          borderRadius: '50%', border: '1px solid rgba(59,130,246,0.2)',
        }} />
        <div style={{ maxWidth: 700, position: 'relative', animation: 'fadeInUp 0.8s ease forwards' }}>
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
            color: '#60a5fa', textTransform: 'uppercase',
            border: '1px solid rgba(96,165,250,0.3)', padding: '5px 14px', borderRadius: 4,
            marginBottom: 24, fontFamily: 'Montserrat, sans-serif',
          }}>
            Enterprise IT Solutions
          </div>
          <h1 style={{
            fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(36px, 4vw, 54px)',
            fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 20,
          }}>
            디지털 혁신으로<br />
            <span style={{ color: '#60a5fa' }}>비즈니스의 미래</span>를<br />
            설계합니다
          </h1>
          <p style={{
            color: '#94a3b8', fontSize: 17, lineHeight: 1.8, marginBottom: 36,
            fontFamily: "'Noto Sans KR', sans-serif",
          }}>
            15년의 경험과 기술력으로 기업의 IT 인프라를 혁신합니다.<br />
            클라우드, 보안, 디지털 전환까지 원스톱으로 제공합니다.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button className="corp-btn" style={{
              background: '#2563eb', color: 'white', border: 'none',
              padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif",
            }}>
              서비스 상담 신청 →
            </button>
            <button style={{
              background: 'transparent', color: 'white',
              border: '1px solid rgba(255,255,255,0.25)',
              padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif",
            }}>
              회사 소개서 다운로드
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        background: '#1d4ed8', padding: '40px 48px',
        display: 'flex', justifyContent: 'center', gap: 0, flexWrap: 'wrap',
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            textAlign: 'center', padding: '16px 48px',
            borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
          }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: 'white', fontFamily: 'Montserrat, sans-serif' }}>
              {s.num}
            </div>
            <div style={{ fontSize: 13, color: '#bfdbfe', fontFamily: "'Noto Sans KR', sans-serif", marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* Services */}
      <section style={{ padding: '80px 48px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Montserrat, sans-serif', marginBottom: 12 }}>
              Our Services
            </div>
            <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>
              핵심 서비스
            </h2>
            <p style={{ color: '#64748b', fontSize: 16, fontFamily: "'Noto Sans KR', sans-serif" }}>
              기업의 성장을 이끄는 IT 솔루션을 제공합니다
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
            {services.map((svc) => (
              <div key={svc.title} className="corp-service-card" style={{
                padding: 36, borderRadius: 16, background: 'white',
                border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, marginBottom: 20,
                }}>
                  {svc.icon}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', fontFamily: 'Montserrat, sans-serif', marginBottom: 12 }}>
                  {svc.title}
                </h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.75, fontFamily: "'Noto Sans KR', sans-serif" }}>
                  {svc.desc}
                </p>
                <div style={{ marginTop: 20, color: '#2563eb', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                  자세히 보기 →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section style={{ padding: '72px 48px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Montserrat, sans-serif', marginBottom: 12 }}>
            Trusted By
          </div>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 40 }}>
            함께하는 고객사
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            {clients.map((c) => (
              <div key={c} className="corp-client" style={{
                padding: '12px 24px', borderRadius: 10,
                border: '1px solid #e2e8f0', background: '#f8fafc',
                fontSize: 14, fontWeight: 600, color: '#475569',
                fontFamily: "'Noto Sans KR', sans-serif", cursor: 'pointer',
              }}>{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        padding: '80px 48px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 16 }}>
            프로젝트를 시작하세요
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, marginBottom: 32, fontFamily: "'Noto Sans KR', sans-serif" }}>
            IT 솔루션이 필요하시면 언제든지 연락해주세요.<br />
            전담 컨설턴트가 최적의 방안을 제안해드립니다.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              background: '#2563eb', color: 'white', border: 'none',
              padding: '14px 36px', borderRadius: 8, fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif",
            }}>
              무료 상담 신청
            </button>
            <button style={{
              background: 'transparent', color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '14px 36px', borderRadius: 8, fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif",
            }}>
              02-1234-5678
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#020817', padding: '32px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ color: '#475569', fontSize: 13, fontFamily: "'Noto Sans KR', sans-serif" }}>
            © 2024 ㈜테크솔루션. All rights reserved.
          </div>
          <div style={{ color: '#334155', fontSize: 12, fontFamily: 'Montserrat, sans-serif' }}>
            서울특별시 강남구 테헤란로 123 테크타워 15F
          </div>
        </div>
      </footer>
    </div>
  );
}
