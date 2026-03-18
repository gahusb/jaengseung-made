import Link from 'next/link';

export default function BakerySample() {
  const menuItems = [
    { name: '버터 크루아상', price: '3,200', emoji: '🥐', tag: '인기', desc: '프랑스산 에슈레 버터만 사용한 겹겹이 살아있는 크루아상' },
    { name: '소금빵', price: '2,800', emoji: '🍞', tag: '베스트', desc: '오키나와 천연 소금과 발효 버터가 만나는 완벽한 짭조름함' },
    { name: '딸기 쇼트케이크', price: '7,500', emoji: '🍰', tag: '신메뉴', desc: '국내산 딸기와 생크림이 만나는 클래식 케이크' },
    { name: '캄파뉴', price: '8,900', emoji: '🫓', tag: '장인', desc: '72시간 저온 발효로 만든 시큼하고 깊은 맛의 통밀빵' },
  ];

  const hours = [
    { day: '월~금', time: '07:00 – 20:00' },
    { day: '토요일', time: '07:00 – 21:00' },
    { day: '일요일', time: '09:00 – 18:00' },
    { day: '공휴일', time: '09:00 – 18:00' },
  ];

  return (
    <div style={{ background: '#fffbf5', minHeight: '100vh', color: '#1c1008' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(-2deg); } 50% { transform: translateY(-10px) rotate(2deg); } }
        .menu-card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(120,53,15,0.12); }
        .menu-card { transition: transform 0.35s, box-shadow 0.35s; }
        .bk-btn:hover { background: #92400e !important; }
        .bk-btn { transition: background 0.2s; }
      `}</style>

      {/* Back Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Link href="/services/website" style={{
          color: '#a5b4fc', fontSize: 13, textDecoration: 'none',
          fontFamily: "'Noto Sans KR', sans-serif",
        }}>
          ← 홈페이지 제작 서비스로 돌아가기
        </Link>
        <span style={{ color: '#4c1d95', fontSize: 13 }}>|</span>
        <span style={{ color: '#6366f1', fontSize: 12, fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>
          SAMPLE · 베이커리 홈페이지
        </span>
      </div>

      {/* Navbar */}
      <nav style={{
        background: 'rgba(255,251,245,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #fde8c8',
        padding: '0 48px', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: '#78350f', fontWeight: 700 }}>
            Le Petit Fort
          </div>
          <div style={{ fontSize: 10, color: '#a78060', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Artisan Boulangerie</div>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {['메뉴', '스토리', '매장안내', '예약'].map((item) => (
            <span key={item} style={{
              fontSize: 14, color: '#78350f', cursor: 'pointer',
              fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 500,
            }}>{item}</span>
          ))}
        </div>
        <button className="bk-btn" style={{
          background: '#b45309', color: 'white', border: 'none',
          padding: '9px 22px', borderRadius: 24, fontSize: 13,
          fontWeight: 700, cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif",
        }}>
          예약하기
        </button>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, #fef3c7 0%, #fde68a 35%, #fbbf24 70%, #d97706 100%)',
        padding: '80px 48px', position: 'relative', overflow: 'hidden', minHeight: 480,
        display: 'flex', alignItems: 'center',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', right: -60, top: -60,
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(180,83,9,0.08)',
        }} />
        <div style={{
          position: 'absolute', right: 80, bottom: -40,
          width: 240, height: 240, borderRadius: '50%',
          background: 'rgba(180,83,9,0.12)',
        }} />
        <div style={{
          position: 'absolute', right: '10%', top: '50%', transform: 'translateY(-50%)',
          fontSize: 120,
          animation: 'float 4s ease-in-out infinite',
          filter: 'drop-shadow(0 12px 24px rgba(120,53,15,0.25))',
        }}>🥐</div>

        <div style={{ maxWidth: 560, animation: 'fadeUp 0.8s ease forwards' }}>
          <div style={{
            fontSize: 13, color: '#78350f', fontFamily: 'Playfair Display, serif',
            fontStyle: 'italic', marginBottom: 16, letterSpacing: '0.05em',
          }}>
            "매일 아침, 정성을 굽습니다"
          </div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif', fontSize: 'clamp(40px, 5vw, 64px)',
            fontWeight: 700, color: '#451a03', lineHeight: 1.15, marginBottom: 18,
          }}>
            갓 구운 빵의<br />
            <span style={{ color: '#b45309' }}>따뜻한 향기</span>가<br />
            기다립니다
          </h1>
          <p style={{
            color: '#78350f', fontSize: 16, lineHeight: 1.8, marginBottom: 32,
            fontFamily: "'Noto Sans KR', sans-serif",
          }}>
            프랑스 전통 방식으로 매일 새벽 4시부터<br />
            정성껏 굽는 르 쁘띠 포르의 빵을 만나보세요.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="bk-btn" style={{
              background: '#b45309', color: 'white', border: 'none',
              padding: '14px 32px', borderRadius: 28, fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif",
              boxShadow: '0 8px 24px rgba(180,83,9,0.35)',
            }}>
              오늘의 메뉴 보기
            </button>
            <button style={{
              background: 'rgba(255,255,255,0.6)', color: '#78350f',
              border: '1px solid rgba(180,83,9,0.3)',
              padding: '14px 32px', borderRadius: 28, fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif",
              backdropFilter: 'blur(8px)',
            }}>
              매장 찾아오기
            </button>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section style={{ padding: '80px 48px', background: '#fffbf5' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{
              fontSize: 12, color: '#b45309', fontWeight: 700, letterSpacing: '0.2em',
              textTransform: 'uppercase', fontFamily: 'Playfair Display, serif', marginBottom: 12,
            }}>Today&apos;s Menu</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: '#451a03', marginBottom: 12 }}>
              오늘의 추천 메뉴
            </h2>
            <p style={{ color: '#a78060', fontSize: 15, fontFamily: "'Noto Sans KR', sans-serif" }}>
              매일 새벽 구운 신선한 빵을 만나보세요
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {menuItems.map((item) => (
              <div key={item.name} className="menu-card" style={{
                background: 'white', borderRadius: 20,
                border: '1px solid #fde8c8', overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(120,53,15,0.05)',
              }}>
                <div style={{
                  height: 140, background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 60, position: 'relative',
                }}>
                  {item.emoji}
                  <span style={{
                    position: 'absolute', top: 12, right: 12,
                    background: '#b45309', color: 'white',
                    fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
                    fontFamily: "'Noto Sans KR', sans-serif",
                  }}>{item.tag}</span>
                </div>
                <div style={{ padding: '18px 20px' }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#451a03', fontFamily: 'Playfair Display, serif', marginBottom: 8 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 13, color: '#a78060', lineHeight: 1.65, fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 14 }}>
                    {item.desc}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#b45309', fontFamily: 'Playfair Display, serif' }}>
                      ₩{item.price}
                    </span>
                    <button style={{
                      background: '#fef3c7', color: '#b45309', border: 'none',
                      padding: '6px 14px', borderRadius: 12, fontSize: 12,
                      fontWeight: 700, cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif",
                    }}>담기</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: '80px 48px', background: '#fef9f0', borderTop: '1px solid #fde8c8' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: '#b45309', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Playfair Display, serif', marginBottom: 12 }}>
              Our Story
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: '#451a03', lineHeight: 1.3, marginBottom: 20 }}>
              2009년부터<br />한 자리를 지켜온<br />
              <em>우리 동네 빵집</em>
            </h2>
            <p style={{ color: '#78350f', fontSize: 15, lineHeight: 1.9, fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 16 }}>
              파리에서 5년간 수업한 오너 셰프가 고향 서울로 돌아와 차린 작은 베이커리. 대기업 프랜차이즈가 넘쳐나는 세상에서도 손으로 빚고, 눈으로 확인하는 전통 방식을 고집합니다.
            </p>
            <p style={{ color: '#78350f', fontSize: 15, lineHeight: 1.9, fontFamily: "'Noto Sans KR', sans-serif" }}>
              밀가루, 버터, 소금, 물. 단 네 가지 재료로 만드는 우리의 빵에는 흉내낼 수 없는 진심이 담겨있습니다.
            </p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #fde68a, #fbbf24)',
            borderRadius: 24, padding: '48px 36px', textAlign: 'center',
            border: '2px solid #fcd34d',
          }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>👨‍🍳</div>
            <div style={{ fontSize: 22, fontFamily: 'Playfair Display, serif', color: '#451a03', fontWeight: 700 }}>
              Chef Kim Dongwoo
            </div>
            <div style={{ fontSize: 13, color: '#78350f', fontFamily: "'Noto Sans KR', sans-serif", marginTop: 8, lineHeight: 1.6 }}>
              Le Cordon Bleu Paris 졸업<br />
              2009년 르 쁘띠 포르 창업
            </div>
            <div style={{
              marginTop: 20, display: 'flex', justifyContent: 'center', gap: 20,
            }}>
              {[{ n: '15+', l: '년 경력' }, { n: '200+', l: '종류의 빵' }, { n: '4시', l: '매일 기상' }].map((s) => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#451a03', fontFamily: 'Playfair Display, serif' }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: '#78350f', fontFamily: "'Noto Sans KR', sans-serif" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hours & Location */}
      <section style={{ padding: '72px 48px', background: '#451a03' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
          <div>
            <div style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>
              Hours
            </div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: 'white', marginBottom: 28 }}>
              운영 시간
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {hours.map((h) => (
                <div key={h.day} style={{
                  display: 'flex', justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12,
                }}>
                  <span style={{ fontSize: 14, color: '#fde68a', fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600 }}>{h.day}</span>
                  <span style={{ fontSize: 14, color: '#fcd34d', fontFamily: 'Playfair Display, serif' }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>
              Location
            </div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: 'white', marginBottom: 20 }}>
              매장 위치
            </h3>
            <p style={{ color: '#fde68a', fontSize: 15, lineHeight: 1.7, fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 16 }}>
              서울특별시 마포구 연남동 224-14<br />
              연남로 68 르 쁘띠 포르
            </p>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
              <div style={{ color: '#fcd34d', fontSize: 13, fontFamily: "'Noto Sans KR', sans-serif" }}>📍 지하철 2호선 홍대입구역 3번 출구 도보 5분</div>
              <div style={{ color: '#fcd34d', fontSize: 13, fontFamily: "'Noto Sans KR', sans-serif" }}>📞 02-334-5678</div>
              <div style={{ color: '#fcd34d', fontSize: 13, fontFamily: "'Noto Sans KR', sans-serif" }}>📱 @lepetitfort_seoul</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
        padding: '64px 48px', textAlign: 'center',
      }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: '#451a03', marginBottom: 14 }}>
          특별한 날을 위한 케이크
        </h2>
        <p style={{ color: '#78350f', fontSize: 16, lineHeight: 1.7, marginBottom: 28, fontFamily: "'Noto Sans KR', sans-serif" }}>
          생일, 기념일, 웨딩 케이크까지.<br />
          최소 3일 전 예약 시 원하시는 케이크를 제작해드립니다.
        </p>
        <button style={{
          background: '#b45309', color: 'white', border: 'none',
          padding: '15px 40px', borderRadius: 28, fontSize: 16, fontWeight: 700,
          cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif",
          boxShadow: '0 8px 24px rgba(180,83,9,0.4)',
        }}>
          케이크 주문 예약하기 →
        </button>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1c1008', padding: '28px 48px', textAlign: 'center' }}>
        <div style={{ color: '#78350f', fontSize: 13, fontFamily: 'Playfair Display, serif', fontStyle: 'italic', marginBottom: 6 }}>
          Le Petit Fort — Artisan Boulangerie
        </div>
        <div style={{ color: '#3c1a08', fontSize: 12, fontFamily: "'Noto Sans KR', sans-serif" }}>
          © 2024 르 쁘띠 포르. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
