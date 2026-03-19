'use client';

import Link from 'next/link';
import { useState } from 'react';

const samples = [
  {
    type: 'corporate',
    title: '기업 홈페이지',
    subtitle: '테크솔루션㈜',
    desc: '신뢰감 있는 기업 브랜드를 구축하는 전문 비즈니스 사이트',
    gradient: 'linear-gradient(135deg, #0a192f 0%, #112240 50%, #1a3a6c 100%)',
    accent: '#4fc3f7',
    tags: ['기업', 'B2B', '신뢰'],
    icon: '🏢',
  },
  {
    type: 'bakery',
    title: '베이커리 홈페이지',
    subtitle: '르 쁘띠 포르',
    desc: '따뜻하고 감성적인 분위기로 고객의 마음을 사로잡는 매장 사이트',
    gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 50%, #d97706 100%)',
    accent: '#fbbf24',
    tags: ['F&B', '로컬', '감성'],
    icon: '🥐',
  },
  {
    type: 'portfolio',
    title: '개인 포트폴리오',
    subtitle: 'Kim Jisu',
    desc: '크리에이티브한 개성을 드러내는 임팩트 있는 포트폴리오 사이트',
    gradient: 'linear-gradient(135deg, #000000 0%, #0d0d0d 50%, #001a00 100%)',
    accent: '#00ff88',
    tags: ['크리에이터', '디자이너', '개발자'],
    icon: '✦',
  },
  {
    type: 'dashboard',
    title: '관리자 대시보드',
    subtitle: 'DataFlow SaaS',
    desc: '데이터를 한눈에 파악하는 직관적인 SaaS 대시보드 시스템',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f2a3a 100%)',
    accent: '#38bdf8',
    tags: ['SaaS', '분석', '관리'],
    icon: '📊',
  },
  {
    type: 'game',
    title: '게임 매칭 시스템',
    subtitle: 'NEXUS ARENA',
    desc: '플레이어를 흥분시키는 사이버펑크 스타일의 게임 매칭 플랫폼',
    gradient: 'linear-gradient(135deg, #000000 0%, #0a0a1a 50%, #0d0029 100%)',
    accent: '#a855f7',
    tags: ['게임', '멀티플레이', '랭킹'],
    icon: '⚡',
  },
];

const processSteps = [
  { step: '01', title: '무료 상담', desc: '요구사항 파악 및 방향성 논의', icon: '💬' },
  { step: '02', title: '기획', desc: '사이트맵 & 와이어프레임', icon: '📋' },
  { step: '03', title: '디자인', desc: 'UI/UX 시안 제작', icon: '🎨' },
  { step: '04', title: '개발', desc: '반응형 퍼블리싱 & 기능 구현', icon: '⚙️' },
  { step: '05', title: '납품', desc: '검수 완료 후 도메인 배포', icon: '🚀' },
];

const plans = [
  {
    name: '스타터',
    price: '50',
    unit: '만원~',
    color: '#38bdf8',
    features: ['5페이지 이내', '반응형 디자인', '기본 SEO 설정', '1개월 유지보수', '3~5영업일 납품'],
    note: '개인 블로그, 소규모 소개 사이트',
  },
  {
    name: '비즈니스',
    price: '150',
    unit: '만원~',
    color: '#818cf8',
    featured: true,
    features: ['10페이지 이내', '반응형 디자인', '관리자 페이지', 'SEO 최적화', '3개월 유지보수', '1~2주 납품'],
    note: '기업 사이트, 브랜드 페이지',
  },
  {
    name: '프리미엄',
    price: '300',
    unit: '만원~',
    color: '#f472b6',
    features: ['페이지 수 무제한', '맞춤 디자인', '결제/회원 시스템', 'DB 연동', '6개월 유지보수', '일정 협의'],
    note: '쇼핑몰, SaaS, 복합 시스템',
  },
];

const faqs = [
  {
    q: '제작 기간은 얼마나 걸리나요?',
    a: '규모에 따라 다르지만, 스타터는 3~5영업일, 비즈니스는 1~2주, 프리미엄은 협의 후 결정합니다. 빠른 납품이 필요한 경우 별도 상담해 주세요.',
  },
  {
    q: '수정은 몇 번까지 가능한가요?',
    a: '기획 확정 후 디자인 시안 수정은 2회, 개발 완료 후 기능 수정은 유지보수 기간 내 자유롭게 가능합니다. 추가 기능 개발은 별도 견적으로 진행합니다.',
  },
  {
    q: '도메인과 호스팅도 도와주시나요?',
    a: '네, 도메인 구매부터 서버 세팅, 배포까지 전 과정을 도와드립니다. Vercel, AWS, 카페24 등 원하시는 플랫폼에 맞춰 배포해 드립니다.',
  },
];

export default function WebsiteServicePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: '#020817', minHeight: '100vh', color: 'white' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gridScroll { from { background-position: 0 0; } to { background-position: 48px 48px; } }
        .ws-card:hover { transform: translateY(-5px); box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
        .ws-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .ws-plan:hover { transform: translateY(-3px); }
        .ws-plan { transition: transform 0.3s ease; }
      `}</style>

      {/* Hero */}
      <section style={{ padding: '72px 24px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          animation: 'gridScroll 8s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%)',
        }} />
        <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative', animation: 'fadeUp 0.8s ease forwards' }}>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
            color: '#818cf8', textTransform: 'uppercase',
            border: '1px solid rgba(129,140,248,0.35)', padding: '5px 16px', borderRadius: 100,
            marginBottom: 28, fontFamily: "'CookieRun', sans-serif",
          }}>
            Homepage Development Service
          </span>
          <h1 style={{
            fontFamily: "'CookieRun', sans-serif", fontSize: 'clamp(30px, 5vw, 58px)', fontWeight: 800,
            lineHeight: 1.15, marginBottom: 20,
            background: 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 50%, #818cf8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            비즈니스를 빛내는 홈페이지,<br />직접 만들어드립니다
          </h1>
          <p style={{
            fontSize: 16, color: '#94a3b8', lineHeight: 1.8, marginBottom: 36,
            fontFamily: "'CookieRun', sans-serif",
          }}>
            7년차 대기업 개발자가 기획·디자인·개발·배포까지 원스톱으로.<br />
            단순한 외주가 아닌, 비즈니스 성과를 만드는 홈페이지를 제작합니다.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/freelance?service=website" style={{
              display: 'inline-block', padding: '14px 32px',
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              borderRadius: 12, color: 'white', fontWeight: 700, fontSize: 15,
              textDecoration: 'none', fontFamily: "'CookieRun', sans-serif",
              boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
            }}>
              무료 상담 신청 →
            </Link>
            <a href="#samples" style={{
              display: 'inline-block', padding: '14px 32px',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12,
              color: '#cbd5e1', fontWeight: 600, fontSize: 15,
              textDecoration: 'none', fontFamily: "'CookieRun', sans-serif",
            }}>
              샘플 보기
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap' }}>
            {[
              { num: '3~5일', label: '최단 납품' },
              { num: '50만원~', label: '시작 가격' },
              { num: '100%', label: '반응형 지원' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'white', fontFamily: "'CookieRun', sans-serif" }}>{s.num}</div>
                <div style={{ fontSize: 12, color: '#475569', fontFamily: "'CookieRun', sans-serif", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Portfolio */}
      <section id="samples" style={{ padding: '56px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{
            fontFamily: "'CookieRun', sans-serif", fontSize: 28, fontWeight: 800,
            color: 'white', marginBottom: 10,
          }}>
            포트폴리오 샘플
          </h2>
          <p style={{ color: '#64748b', fontFamily: "'CookieRun', sans-serif", fontSize: 15 }}>
            카드를 클릭하면 실제 완성 화면을 미리 확인할 수 있습니다
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {samples.map((s) => (
            <Link key={s.type} href={`/services/website/samples/${s.type}`} style={{ textDecoration: 'none' }}>
              <div className="ws-card" style={{
                borderRadius: 20, overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.07)',
                background: '#0a1020', cursor: 'pointer',
              }}>
                <div style={{
                  height: 170, background: s.gradient, position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 52, filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.6))' }}>{s.icon}</span>
                  <div style={{
                    position: 'absolute', top: 12, left: 12,
                    display: 'flex', gap: 5,
                  }}>
                    {s.tags.map((tag) => (
                      <span key={tag} style={{
                        fontSize: 10, fontWeight: 600, color: '#e2e8f0',
                        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        padding: '2px 8px', borderRadius: 100,
                      }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{
                    position: 'absolute', bottom: 12, right: 12,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                    border: `1px solid ${s.accent}50`,
                    borderRadius: 8, padding: '5px 12px',
                    fontSize: 11, color: s.accent, fontFamily: "'CookieRun', sans-serif", fontWeight: 700,
                  }}>
                    미리보기 →
                  </div>
                </div>
                <div style={{ padding: '18px 22px 22px' }}>
                  <div style={{ fontSize: 11, color: '#475569', fontFamily: "'CookieRun', sans-serif", marginBottom: 5, letterSpacing: '0.05em' }}>
                    {s.subtitle}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: 'white', fontFamily: "'CookieRun', sans-serif", marginBottom: 8 }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, fontFamily: "'CookieRun', sans-serif" }}>
                    {s.desc}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: '56px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'CookieRun', sans-serif", fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 10 }}>
              제작 프로세스
            </h2>
            <p style={{ color: '#64748b', fontFamily: "'CookieRun', sans-serif", fontSize: 15 }}>
              투명하고 체계적인 5단계로 진행됩니다
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap', justifyContent: 'center', gap: 0 }}>
            {processSteps.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  textAlign: 'center', padding: '24px 20px', minWidth: 130,
                  background: '#0f172a', borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ fontSize: 30, marginBottom: 10 }}>{p.icon}</div>
                  <div style={{
                    fontSize: 10, color: '#6366f1', fontFamily: "'CookieRun', sans-serif",
                    fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6,
                  }}>
                    STEP {p.step}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'white', fontFamily: "'CookieRun', sans-serif", marginBottom: 5 }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: 11, color: '#475569', fontFamily: "'CookieRun', sans-serif", lineHeight: 1.5 }}>
                    {p.desc}
                  </div>
                </div>
                {i < processSteps.length - 1 && (
                  <div style={{ color: '#1e293b', fontSize: 22, padding: '0 6px', flexShrink: 0 }}>›</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '56px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'CookieRun', sans-serif", fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 10 }}>
            가격 플랜
          </h2>
          <p style={{ color: '#64748b', fontFamily: "'CookieRun', sans-serif", fontSize: 15 }}>
            프로젝트 규모에 맞는 플랜을 선택하세요
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {plans.map((plan) => (
            <div key={plan.name} className="ws-plan" style={{
              padding: 30, borderRadius: 20,
              background: plan.featured ? 'linear-gradient(135deg, #1e1b4b, #312e81)' : '#0f172a',
              border: `1px solid ${plan.featured ? plan.color + '55' : 'rgba(255,255,255,0.06)'}`,
              position: 'relative', overflow: 'hidden',
              boxShadow: plan.featured ? `0 24px 64px ${plan.color}18` : 'none',
            }}>
              {plan.featured && (
                <div style={{
                  position: 'absolute', top: 18, right: 18,
                  background: plan.color, color: '#1e1b4b',
                  fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 100,
                  fontFamily: "'CookieRun', sans-serif",
                }}>BEST</div>
              )}
              <div style={{ fontSize: 13, color: plan.color, fontFamily: "'CookieRun', sans-serif", fontWeight: 700, marginBottom: 10 }}>
                {plan.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 42, fontWeight: 800, color: 'white', fontFamily: "'CookieRun', sans-serif" }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: 16, color: '#94a3b8', fontFamily: "'CookieRun', sans-serif" }}>
                  {plan.unit}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#475569', fontFamily: "'CookieRun', sans-serif", marginBottom: 22 }}>
                {plan.note}
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20, marginBottom: 24 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 11 }}>
                    <span style={{ color: plan.color, fontSize: 14, flexShrink: 0, fontWeight: 700 }}>✓</span>
                    <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'CookieRun', sans-serif" }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/freelance?service=website" style={{
                display: 'block', textAlign: 'center', padding: '12px',
                background: plan.featured ? plan.color : 'rgba(255,255,255,0.05)',
                borderRadius: 10, color: plan.featured ? '#1e1b4b' : '#cbd5e1',
                fontWeight: 700, fontSize: 14, textDecoration: 'none',
                fontFamily: "'CookieRun', sans-serif",
                border: plan.featured ? 'none' : '1px solid rgba(255,255,255,0.08)',
              }}>
                상담 신청
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 24px 56px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'CookieRun', sans-serif", fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 10 }}>
            자주 묻는 질문
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{
              background: '#0f172a', borderRadius: 14,
              border: `1px solid ${openFaq === i ? 'rgba(99,102,241,0.45)' : 'rgba(255,255,255,0.06)'}`,
              overflow: 'hidden', transition: 'border-color 0.25s',
            }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: '100%', textAlign: 'left', padding: '18px 22px',
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'white', fontFamily: "'CookieRun', sans-serif" }}>
                  {faq.q}
                </span>
                <span style={{
                  color: '#6366f1', fontSize: 22, flexShrink: 0,
                  transition: 'transform 0.2s',
                  transform: openFaq === i ? 'rotate(45deg)' : 'none',
                  display: 'inline-block',
                }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{
                  padding: '0 22px 18px', fontSize: 14, color: '#64748b',
                  lineHeight: 1.75, fontFamily: "'CookieRun', sans-serif",
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 24px 80px', textAlign: 'center' }}>
        <div style={{
          maxWidth: 620, margin: '0 auto',
          padding: '52px 40px', borderRadius: 24,
          background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
          border: '1px solid rgba(129,140,248,0.3)',
          boxShadow: '0 24px 80px rgba(99,102,241,0.2)',
        }}>
          <h2 style={{ fontFamily: "'CookieRun', sans-serif", fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 14 }}>
            지금 바로 시작하세요
          </h2>
          <p style={{
            color: '#a5b4fc', fontSize: 15, lineHeight: 1.7, marginBottom: 30,
            fontFamily: "'CookieRun', sans-serif",
          }}>
            무료 상담은 24시간 이내 답변드립니다.<br />
            어떤 규모의 프로젝트든 환영합니다.
          </p>
          <Link href="/freelance?service=website" style={{
            display: 'inline-block', padding: '15px 40px',
            background: 'linear-gradient(135deg, #818cf8, #6366f1)',
            borderRadius: 12, color: 'white', fontWeight: 700, fontSize: 16,
            textDecoration: 'none', fontFamily: "'CookieRun', sans-serif",
            boxShadow: '0 8px 32px rgba(99,102,241,0.5)',
          }}>
            무료 상담 신청하기 →
          </Link>
        </div>
      </section>
    </div>
  );
}
