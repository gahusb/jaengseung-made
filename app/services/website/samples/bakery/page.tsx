import Link from 'next/link';

const menuItems = [
  { name: '버터 크루아상', price: '3,200', tag: '인기', tagColor: '#dc2626', desc: '프랑스산 에슈레 버터만 사용한 겹겹이 살아있는 크루아상', ingredients: ['에슈레 버터', '천연 발효', 'T65 밀가루'] },
  { name: '소금빵', price: '2,800', tag: '베스트', tagColor: '#d97706', desc: '오키나와 천연 소금과 발효 버터가 만나는 완벽한 짭조름함', ingredients: ['오키나와 소금', '발효 버터', '홋카이도 밀'] },
  { name: '딸기 쇼트케이크', price: '7,500', tag: '신메뉴', tagColor: '#7c3aed', desc: '국내산 딸기와 생크림이 만나는 클래식 케이크', ingredients: ['국내산 딸기', '생크림', '제노아즈'] },
  { name: '캄파뉴', price: '8,900', tag: '장인', tagColor: '#065f46', desc: '72시간 저온 발효로 만든 시큼하고 깊은 맛의 통밀빵', ingredients: ['통밀', '사워도우', '72h 발효'] },
];

const reviews = [
  { name: '김민서', rating: 5, text: '매일 아침 출근 전 들르게 되는 마법 같은 빵집. 크루아상은 그냥 인생 최고입니다.', date: '2024.08', verified: true },
  { name: '이준혁', rating: 5, text: '파리 유학시절 먹던 그 맛과 거의 흡사합니다. 국내에 이런 퀄리티가 있다니 놀랍습니다.', date: '2024.07', verified: true },
  { name: '박지은', rating: 5, text: '웨딩 케이크 주문했는데 하객들이 케이크 맛있다고 난리났어요. 다음에도 꼭 맡기겠습니다!', date: '2024.06', verified: true },
];

const specials = [
  { season: '봄', item: '딸기 타르틀렛', desc: '4월 한정', color: '#fda4af' },
  { season: '여름', item: '레몬 틸레', desc: '7–8월 한정', color: '#fde68a' },
  { season: '가을', item: '밤 크루아상', desc: '10월 한정', color: '#d97706' },
  { season: '겨울', item: '뱅쇼 브리오슈', desc: '12월 한정', color: '#c4b5fd' },
];

const hours = [
  { day: '월~금', time: '07:00 – 20:00' },
  { day: '토요일', time: '07:00 – 21:00' },
  { day: '일·공휴일', time: '09:00 – 18:00' },
];

export default function BakerySample() {
  return (
    <div style={{ background: '#fffbf5', minHeight: '100vh', color: '#1c1008' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(-1deg); } 50% { transform: translateY(-12px) rotate(1deg); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes sway { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
        .menu-card:hover { transform: translateY(-8px); box-shadow: 0 32px 80px rgba(120,53,15,0.15) !important; }
        .menu-card { transition: transform 0.4s cubic-bezier(.23,1,.32,1), box-shadow 0.4s; }
        .review-card:hover { border-color: #fbbf24 !important; }
        .review-card { transition: border-color 0.3s; }
        .bk-btn-primary:hover { background: #92400e !important; transform: translateY(-1px); box-shadow: 0 12px 32px rgba(180,83,9,0.45) !important; }
        .bk-btn-primary { transition: background 0.2s, transform 0.2s, box-shadow 0.2s; }
        .bk-btn-ghost:hover { background: rgba(180,83,9,0.06) !important; }
        .bk-btn-ghost { transition: background 0.2s; }
        .special-card:hover { transform: scale(1.04); }
        .special-card { transition: transform 0.3s; }
        .ingredient-tag { background: rgba(180,83,9,0.07); color: #92400e; border: 1px solid rgba(180,83,9,0.15); border-radius: 100px; padding: 2px 10px; font-size: 11px; font-family: 'Noto Sans KR', sans-serif; white-space: nowrap; }
      `}</style>

      {/* Back Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/services/website" style={{ color: '#a5b4fc', fontSize: 13, textDecoration: 'none', fontFamily: "'Noto Sans KR', sans-serif" }}>
          ← 홈페이지 제작 서비스로 돌아가기
        </Link>
        <span style={{ color: '#4c1d95' }}>|</span>
        <span style={{ color: '#fcd34d', fontSize: 12, fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 700 }}>
          SAMPLE · 베이커리 홈페이지
        </span>
      </div>

      {/* Navbar */}
      <nav style={{
        background: 'rgba(255,251,245,0.96)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #fde8c8',
        padding: '0 48px', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        {/* Logo with wheat SVG */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <ellipse cx="14" cy="8" rx="5" ry="7" fill="#d97706" opacity="0.9" />
            <ellipse cx="8" cy="14" rx="5" ry="4" fill="#b45309" opacity="0.7" transform="rotate(-30 8 14)" />
            <ellipse cx="20" cy="14" rx="5" ry="4" fill="#b45309" opacity="0.7" transform="rotate(30 20 14)" />
            <line x1="14" y1="28" x2="14" y2="8" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div>
            <div style={{ fontSize: 19, fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: '#78350f', fontWeight: 700, lineHeight: 1 }}>
              Le Petit Fort
            </div>
            <div style={{ fontSize: 10, color: '#c9a87c', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: "'Noto Sans KR', sans-serif" }}>
              Artisan Boulangerie
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {['메뉴', '스토리', '시즌 메뉴', '매장안내', '예약'].map((item) => (
            <span key={item} style={{ fontSize: 14, color: '#78350f', cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 500 }}>{item}</span>
          ))}
        </div>
        <button className="bk-btn-primary" style={{
          background: '#b45309', color: 'white', border: 'none',
          padding: '9px 22px', borderRadius: 24, fontSize: 13,
          fontWeight: 600, cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif",
        }}>
          예약하기
        </button>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, #fef3c7 0%, #fde68a 40%, #fbbf24 75%, #d97706 100%)',
        padding: '80px 48px', position: 'relative', overflow: 'hidden', minHeight: 500,
        display: 'flex', alignItems: 'center',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', right: -80, top: -80, width: 480, height: 480, borderRadius: '50%', background: 'rgba(180,83,9,0.07)' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(180,83,9,0.1)' }} />

        {/* SVG Croissant illustration */}
        <div style={{ position: 'absolute', right: '8%', top: '50%', transform: 'translateY(-50%)', animation: 'float 5s ease-in-out infinite' }}>
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none" style={{ filter: 'drop-shadow(0 20px 40px rgba(120,53,15,0.3))' }}>
            {/* Croissant shape */}
            <path d="M90 30 C50 30, 20 60, 20 90 C20 110, 30 130, 50 145 C65 155, 75 158, 90 155 C105 158, 115 155, 130 145 C150 130, 160 110, 160 90 C160 60, 130 30, 90 30Z" fill="#d97706" />
            <path d="M90 40 C55 40, 30 65, 30 90 C30 108, 38 124, 55 136 C68 145, 78 148, 90 145 C102 148, 112 145, 125 136 C142 124, 150 108, 150 90 C150 65, 125 40, 90 40Z" fill="#b45309" />
            {/* Layered flakes */}
            <path d="M60 80 Q90 70 120 80" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <path d="M55 92 Q90 82 125 92" stroke="#fef3c7" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <path d="M60 104 Q90 94 120 104" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            {/* Shine */}
            <ellipse cx="70" cy="65" rx="15" ry="8" fill="white" opacity="0.15" transform="rotate(-20 70 65)" />
            {/* Steam */}
            <path d="M75 28 Q78 20 75 12" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            <path d="M90 24 Q93 14 90 5" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <path d="M105 28 Q108 20 105 12" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          </svg>
        </div>

        {/* Wheat decoration top right */}
        <svg width="80" height="120" viewBox="0 0 80 120" fill="none" style={{ position: 'absolute', right: '28%', top: 20, opacity: 0.15, animation: 'sway 4s ease-in-out infinite' }}>
          <line x1="40" y1="120" x2="40" y2="0" stroke="#78350f" strokeWidth="2" />
          {[15, 35, 55, 75].map((y, i) => (
            <g key={y}>
              <ellipse cx="28" cy={y} rx="10" ry="5" fill="#78350f" transform={`rotate(-40 28 ${y})`} />
              <ellipse cx="52" cy={y} rx="10" ry="5" fill="#78350f" transform={`rotate(40 52 ${y})`} />
            </g>
          ))}
        </svg>

        <div style={{ maxWidth: 560, animation: 'fadeUp 0.8s ease forwards', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', borderRadius: 100, padding: '5px 14px', marginBottom: 20 }}>
            <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="#16a34a" /><circle cx="5" cy="5" r="2" fill="white" /></svg>
            <span style={{ fontSize: 12, color: '#78350f', fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600 }}>오늘도 새벽 4시부터 굽고 있습니다</span>
          </div>

          <div style={{ fontSize: 13, color: '#78350f', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', marginBottom: 14, letterSpacing: '0.05em' }}>
            &ldquo;매일 아침, 정성을 굽습니다&rdquo;
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 700, color: '#451a03', lineHeight: 1.15, marginBottom: 18 }}>
            갓 구운 빵의<br />
            <span style={{ color: '#b45309' }}>따뜻한 향기</span>가<br />
            기다립니다
          </h1>
          <p style={{ color: '#78350f', fontSize: 16, lineHeight: 1.85, marginBottom: 32, fontFamily: "'Noto Sans KR', sans-serif" }}>
            파리 전통 방식으로 매일 새벽 4시부터<br />정성껏 굽는 르 쁘띠 포르의 빵을 만나보세요.
          </p>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ display: 'flex' }}>
              {['#d97706', '#b45309', '#92400e', '#78350f'].map((c, i) => (
                <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: c, border: '2px solid white', marginLeft: i > 0 ? -8 : 0 }} />
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="12" height="12" viewBox="0 0 12 12"><path d="M6 1l1.3 2.6L10 4.1 8 6.1l.5 2.9L6 7.6 3.5 9l.5-2.9-2-2 2.7-.5z" fill="#d97706" /></svg>
                ))}
              </div>
              <span style={{ fontSize: 12, color: '#78350f', fontFamily: "'Noto Sans KR', sans-serif" }}>4.9점 · 1,200+ 리뷰</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="bk-btn-primary" style={{
              background: '#b45309', color: 'white', border: 'none',
              padding: '14px 32px', borderRadius: 28, fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif",
              boxShadow: '0 8px 24px rgba(180,83,9,0.35)',
            }}>
              오늘의 메뉴 보기
            </button>
            <button className="bk-btn-ghost" style={{
              background: 'rgba(255,255,255,0.5)', color: '#78350f',
              border: '1px solid rgba(180,83,9,0.25)',
              padding: '14px 32px', borderRadius: 28, fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif",
              backdropFilter: 'blur(8px)',
            }}>
              매장 찾아오기
            </button>
          </div>
        </div>
      </section>

      {/* Season Special Banner */}
      <div style={{ background: '#451a03', padding: '14px 48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 1l1.8 3.6L14 5.6l-3 2.9.7 4.1L8 10.5 4.3 12.6l.7-4.1L2 5.6l4.2-.6z" fill="#fbbf24" /></svg>
          <span style={{ color: '#fde68a', fontSize: 13, fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 600 }}>Spring Limited</span>
        </div>
        <span style={{ color: '#78350f' }}>|</span>
        <span style={{ color: 'white', fontSize: 14, fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600 }}>
          🌸 딸기 타르틀렛 — 4월 한정 메뉴 출시
        </span>
        <span style={{ color: '#78350f' }}>|</span>
        <span style={{ color: '#fcd34d', fontSize: 13, fontFamily: "'Noto Sans KR', sans-serif", cursor: 'pointer', textDecoration: 'underline' }}>자세히 보기 →</span>
      </div>

      {/* Menu */}
      <section style={{ padding: '80px 48px', background: '#fffbf5' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, color: '#b45309', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'Playfair Display, serif', marginBottom: 12 }}>
              Today&apos;s Menu
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: '#451a03', marginBottom: 12 }}>
              오늘의 추천 메뉴
            </h2>
            <p style={{ color: '#a78060', fontSize: 15, fontFamily: "'Noto Sans KR', sans-serif" }}>
              매일 새벽 구운 신선한 빵을 만나보세요
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 24 }}>
            {menuItems.map((item) => (
              <div key={item.name} className="menu-card" style={{
                background: 'white', borderRadius: 20, border: '1px solid #fde8c8', overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(120,53,15,0.06)',
              }}>
                {/* Card visual — SVG pattern instead of emoji */}
                <div style={{ height: 150, background: 'linear-gradient(135deg, #fef3c7, #fde68a)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  {/* Subtle dotted pattern */}
                  <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                    <pattern id={`dots-${item.name}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="1.5" fill="rgba(180,83,9,0.1)" />
                    </pattern>
                    <rect width="100%" height="100%" fill={`url(#dots-${item.name})`} />
                  </svg>
                  {/* Bread silhouette SVG */}
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 12px rgba(120,53,15,0.25))' }}>
                    <ellipse cx="40" cy="45" rx="30" ry="18" fill="#d97706" />
                    <ellipse cx="40" cy="38" rx="24" ry="16" fill="#b45309" />
                    <path d="M20 42 Q40 30 60 42" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                    <path d="M24 48 Q40 38 56 48" stroke="#fef3c7" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                    <ellipse cx="30" cy="32" rx="8" ry="5" fill="white" opacity="0.1" transform="rotate(-20 30 32)" />
                  </svg>
                  <span style={{
                    position: 'absolute', top: 12, right: 12,
                    background: item.tagColor, color: 'white',
                    fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
                    fontFamily: "'Noto Sans KR', sans-serif",
                  }}>{item.tag}</span>
                </div>
                <div style={{ padding: '18px 20px' }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#451a03', fontFamily: 'Playfair Display, serif', marginBottom: 6 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 13, color: '#a78060', lineHeight: 1.65, fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 12 }}>
                    {item.desc}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                    {item.ingredients.map(ig => (
                      <span key={ig} className="ingredient-tag">{ig}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 19, fontWeight: 700, color: '#b45309', fontFamily: 'Playfair Display, serif' }}>
                      ₩{item.price}
                    </span>
                    <button style={{
                      background: '#b45309', color: 'white', border: 'none',
                      padding: '7px 16px', borderRadius: 12, fontSize: 12,
                      fontWeight: 700, cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif",
                    }}>담기</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Specials */}
      <section style={{ padding: '72px 48px', background: '#fef9f0', borderTop: '1px solid #fde8c8' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ fontSize: 11, color: '#b45309', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'Playfair Display, serif', marginBottom: 10 }}>
              Seasonal Specials
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: '#451a03' }}>
              계절마다 새로운 감동
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {specials.map((s) => (
              <div key={s.season} className="special-card" style={{
                borderRadius: 16, padding: '28px 20px', textAlign: 'center',
                background: 'white', border: '1px solid #fde8c8',
                cursor: 'pointer', overflow: 'hidden', position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: s.color, borderRadius: '16px 16px 0 0' }} />
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', margin: '0 auto 14px',
                  background: s.color + '30', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: s.color }} />
                </div>
                <div style={{ fontSize: 12, color: '#a78060', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 8 }}>{s.season} 한정</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#451a03', fontFamily: 'Playfair Display, serif', marginBottom: 6 }}>{s.item}</div>
                <div style={{ fontSize: 11, color: '#b45309', fontWeight: 600, fontFamily: "'Noto Sans KR', sans-serif", background: s.color + '25', borderRadius: 100, padding: '2px 10px', display: 'inline-block' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: '80px 48px', background: '#fffbf5', borderTop: '1px solid #fde8c8' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: '#b45309', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'Playfair Display, serif', marginBottom: 14 }}>
              Our Story
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: '#451a03', lineHeight: 1.3, marginBottom: 22 }}>
              2009년부터<br />한 자리를 지켜온<br />
              <em>우리 동네 빵집</em>
            </h2>
            <p style={{ color: '#78350f', fontSize: 15, lineHeight: 1.9, fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 16 }}>
              파리에서 5년간 수업한 오너 셰프가 고향 서울로 돌아와 차린 작은 베이커리. 대기업 프랜차이즈가 넘쳐나는 세상에서도 손으로 빚고, 눈으로 확인하는 전통 방식을 고집합니다.
            </p>
            <p style={{ color: '#78350f', fontSize: 15, lineHeight: 1.9, fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 28 }}>
              밀가루, 버터, 소금, 물. 단 네 가지 재료로 만드는 우리의 빵에는 흉내낼 수 없는 진심이 담겨있습니다.
            </p>
            <div style={{ display: 'flex', gap: 32 }}>
              {[{ n: '15+', l: '년 경력' }, { n: '200+', l: '종류의 빵' }, { n: '4시', l: '매일 기상' }].map((s) => (
                <div key={s.l}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#b45309', fontFamily: 'Playfair Display, serif' }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: '#a78060', fontFamily: "'Noto Sans KR', sans-serif" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chef card with SVG illustration */}
          <div style={{ background: 'linear-gradient(135deg, #fde68a, #fbbf24)', borderRadius: 24, padding: '44px 32px', textAlign: 'center', border: '2px solid #fcd34d', position: 'relative', overflow: 'hidden' }}>
            {/* Pattern overlay */}
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.07 }}>
              <pattern id="chef-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="12" cy="12" r="2" fill="#78350f" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#chef-dots)" />
            </svg>
            {/* Chef SVG illustration */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid rgba(255,255,255,0.6)' }}>
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  {/* Chef hat */}
                  <ellipse cx="28" cy="20" rx="16" ry="12" fill="white" />
                  <rect x="12" y="18" width="32" height="8" rx="2" fill="white" />
                  <ellipse cx="28" cy="18" rx="8" ry="5" fill="#f3f4f6" />
                  {/* Face */}
                  <circle cx="28" cy="34" r="12" fill="#fbbf24" />
                  <circle cx="24" cy="32" r="1.5" fill="#78350f" />
                  <circle cx="32" cy="32" r="1.5" fill="#78350f" />
                  <path d="M23 38 Q28 42 33 38" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <div style={{ fontSize: 20, fontFamily: 'Playfair Display, serif', color: '#451a03', fontWeight: 700, marginBottom: 6 }}>
                Chef Kim Dongwoo
              </div>
              <div style={{ fontSize: 13, color: '#78350f', fontFamily: "'Noto Sans KR', sans-serif", lineHeight: 1.7, marginBottom: 16 }}>
                Le Cordon Bleu Paris 졸업<br />
                2009년 르 쁘띠 포르 창업
              </div>
              {/* Awards */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {['미쉐린 추천', '블루리본', '로컬 레전드'].map(award => (
                  <span key={award} style={{
                    background: 'rgba(255,255,255,0.5)', color: '#78350f',
                    fontSize: 10, fontWeight: 700, padding: '3px 10px',
                    borderRadius: 100, border: '1px solid rgba(255,255,255,0.7)',
                    fontFamily: "'Noto Sans KR', sans-serif",
                  }}>{award}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section style={{ padding: '80px 48px', background: '#fef9f0', borderTop: '1px solid #fde8c8' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, color: '#b45309', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'Playfair Display, serif', marginBottom: 10 }}>
              Guest Reviews
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: '#451a03', marginBottom: 12 }}>
              고객들의 이야기
            </h2>
            <div style={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="18" height="18" viewBox="0 0 18 18"><path d="M9 1.5l2 4L16 7l-3.5 3.4.8 4.8L9 13l-4.3 2.3.8-4.8L2 7l5-.5z" fill="#d97706" /></svg>
              ))}
              <span style={{ marginLeft: 8, fontSize: 15, color: '#78350f', fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>4.9</span>
              <span style={{ fontSize: 13, color: '#a78060', fontFamily: "'Noto Sans KR', sans-serif" }}>&nbsp;(1,243개 리뷰)</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {reviews.map((r) => (
              <div key={r.name} className="review-card" style={{
                background: 'white', borderRadius: 20, padding: '28px 24px',
                border: '1px solid #fde8c8', boxShadow: '0 2px 12px rgba(120,53,15,0.04)',
              }}>
                {/* Stars */}
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="13" height="13" viewBox="0 0 13 13"><path d="M6.5 1l1.5 3 3.3.5-2.4 2.3.6 3.3L6.5 9 3 10.1l.6-3.3L1.2 4.5 4.5 4z" fill="#d97706" /></svg>
                  ))}
                  {r.verified && (
                    <span style={{ marginLeft: 6, fontSize: 10, color: '#16a34a', fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600 }}>
                      ✓ 인증 방문
                    </span>
                  )}
                </div>
                {/* Quote SVG */}
                <svg width="24" height="18" viewBox="0 0 24 18" fill="none" style={{ marginBottom: 10, opacity: 0.3 }}>
                  <path d="M0 18V10.5C0 4.7 3.5 1.3 10.5 0l1.5 2.5C8.3 3.7 6.3 5.7 6 9h4.5V18H0zm12 0V10.5C12 4.7 15.5 1.3 22.5 0L24 2.5C20.3 3.7 18.3 5.7 18 9h4.5V18H12z" fill="#b45309" />
                </svg>
                <p style={{ fontSize: 14, color: '#78350f', lineHeight: 1.75, fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 18 }}>
                  {r.text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #fde68a, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#451a03', fontFamily: 'Playfair Display, serif' }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#451a03', fontFamily: "'Noto Sans KR', sans-serif" }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: '#c9a87c', fontFamily: "'Noto Sans KR', sans-serif" }}>{r.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hours & Location */}
      <section style={{ padding: '72px 48px', background: '#451a03' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
          <div>
            <div style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>Hours</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: 'white', marginBottom: 28 }}>운영 시간</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {hours.map((h) => (
                <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12 }}>
                  <span style={{ fontSize: 14, color: '#fde68a', fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600 }}>{h.day}</span>
                  <span style={{ fontSize: 14, color: '#fcd34d', fontFamily: 'Playfair Display, serif' }}>{h.time}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(251,191,36,0.1)', borderRadius: 10, border: '1px solid rgba(251,191,36,0.2)' }}>
              <p style={{ fontSize: 13, color: '#fde68a', fontFamily: "'Noto Sans KR', sans-serif", lineHeight: 1.6 }}>
                ⚡ 품절 시 조기 마감될 수 있습니다.<br />
                인스타그램에서 당일 재고를 확인하세요.
              </p>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>Location</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: 'white', marginBottom: 20 }}>매장 위치</h3>
            <p style={{ color: '#fde68a', fontSize: 15, lineHeight: 1.7, fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 20 }}>
              서울특별시 마포구 연남동 224-14<br />연남로 68 르 쁘띠 포르
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: 'M', text: '2호선 홍대입구역 3번 출구 도보 5분' },
                { icon: 'T', text: '02-334-5678' },
                { icon: '@', text: '@lepetitfort_seoul' },
              ].map((info) => (
                <div key={info.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fbbf24', fontFamily: 'Playfair Display, serif', flexShrink: 0 }}>
                    {info.icon}
                  </div>
                  <span style={{ color: '#fcd34d', fontSize: 13, fontFamily: "'Noto Sans KR', sans-serif" }}>{info.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA — Custom Cake */}
      <section style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', padding: '72px 48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(180,83,9,0.1)', borderRadius: 100, padding: '5px 14px', marginBottom: 20 }}>
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1l1.3 2.6L10 4.1 8 6.1l.5 2.9L6 7.6 3.5 9l.5-2.9-2-2 2.7-.5z" fill="#b45309" /></svg>
          <span style={{ fontSize: 12, color: '#b45309', fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700 }}>Custom Order</span>
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 38, color: '#451a03', marginBottom: 14 }}>
          특별한 날을 위한 케이크
        </h2>
        <p style={{ color: '#78350f', fontSize: 16, lineHeight: 1.75, marginBottom: 12, fontFamily: "'Noto Sans KR', sans-serif" }}>
          생일, 기념일, 웨딩 케이크까지.<br />
          최소 3일 전 예약 시 원하시는 케이크를 제작해드립니다.
        </p>
        <p style={{ color: '#a78060', fontSize: 13, fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 32 }}>
          가격 상담 무료 · 사진 참고 가능 · 직접 수령 또는 배달 가능
        </p>
        <button className="bk-btn-primary" style={{
          background: '#b45309', color: 'white', border: 'none',
          padding: '15px 44px', borderRadius: 28, fontSize: 16, fontWeight: 700,
          cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif",
          boxShadow: '0 8px 28px rgba(180,83,9,0.4)',
        }}>
          케이크 주문 예약하기 →
        </button>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1c1008', padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#78350f', fontSize: 14, fontFamily: 'Playfair Display, serif', fontStyle: 'italic', marginBottom: 4 }}>
            Le Petit Fort — Artisan Boulangerie
          </div>
          <div style={{ color: '#3c1a08', fontSize: 12, fontFamily: "'Noto Sans KR', sans-serif" }}>
            © 2024 르 쁘띠 포르. All rights reserved.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {['Instagram', 'Naver Map', 'Kakao'].map((s) => (
            <span key={s} style={{ fontSize: 12, color: '#78350f', fontFamily: "'Noto Sans KR', sans-serif", cursor: 'pointer' }}>{s}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
