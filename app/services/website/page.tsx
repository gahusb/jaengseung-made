'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import ContactModal from '../../components/ContactModal';

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
  {
    type: 'interior',
    title: '인테리어 업체 소개',
    subtitle: 'AURUM Interior',
    desc: '따뜻한 감성과 고급스러운 감각을 담은 인테리어 포트폴리오 사이트',
    gradient: 'linear-gradient(135deg, #2C1810 0%, #4A3728 50%, #6B4E37 100%)',
    accent: '#D4A853',
    tags: ['인테리어', '포트폴리오', '럭셔리'],
    icon: '◈',
  },
  {
    type: 'reading',
    title: '독서 기록 노트',
    subtitle: '나의 독서 기록',
    desc: '읽은 책과 감상을 아름답게 기록하는 나만의 독서 저널 페이지',
    gradient: 'linear-gradient(135deg, #0C0B09 0%, #1A1710 50%, #2A2218 100%)',
    accent: '#D4A853',
    tags: ['라이프', '독서', '기록'],
    icon: '◻',
  },
  {
    type: 'shopping',
    title: '개인 쇼핑몰',
    subtitle: 'MELLOW STUDIO',
    desc: '감각적인 브랜드 스토리텔링과 미니멀 레이아웃으로 완성한 패션·라이프스타일 쇼핑몰',
    gradient: 'linear-gradient(135deg, #2A2018 0%, #4A3C2C 50%, #7A6A52 100%)',
    accent: '#C4A882',
    tags: ['쇼핑몰', '패션', '라이프'],
    icon: '◇',
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
    price: '20',
    unit: '만원~',
    color: '#38bdf8',
    features: ['5페이지 이내', '반응형 디자인', '기본 SEO 설정', '1개월 유지보수', '3~5영업일 납품'],
    note: '개인 블로그, 소규모 소개 사이트',
    productId: 'website_starter',
  },
  {
    name: '비즈니스',
    price: '100',
    unit: '만원~',
    color: '#818cf8',
    featured: true,
    features: ['10페이지 이내', '반응형 디자인', '관리자 페이지', 'SEO 최적화', '3개월 유지보수', '1~2주 납품'],
    note: '기업 사이트, 브랜드 페이지',
    productId: 'website_business',
  },
  {
    name: '프리미엄',
    price: '200',
    unit: '만원~',
    color: '#f472b6',
    features: ['페이지 수 무제한', '맞춤 디자인', '결제/회원 시스템', 'DB 연동', '6개월 유지보수', '일정 협의'],
    note: '쇼핑몰, SaaS, 복합 시스템',
    productId: 'website_premium',
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

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const scroller = (document.querySelector('.main-content') as HTMLElement | null) ?? document.documentElement;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('ws-visible'); obs.disconnect(); } },
      { threshold: 0.1, root: scroller === document.documentElement ? null : scroller }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function WebsiteServicePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showTop, setShowTop] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState('홈페이지 제작');

  const openModal = (service: string) => {
    setModalService(service);
    setModalOpen(true);
  };

  useEffect(() => {
    const scroller = (document.querySelector('.main-content') as HTMLElement | null) ?? document.documentElement;
    const onScroll = () => setShowTop(scroller.scrollTop > 400);
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, []);

  const samplesRef = useReveal();
  const processRef = useReveal();
  const pricingRef = useReveal();
  const faqRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div style={{ background: '#030712', minHeight: '100vh', color: 'white', fontFamily: "'Pretendard', 'Apple SD Gothic Neo', system-ui, sans-serif" }}>
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service={modalService}
        checklist={[
          '원하시는 홈페이지 종류 (소개/쇼핑몰/SaaS 등)',
          '참고하고 싶은 사이트 URL (있으면)',
          '필요한 주요 페이지 및 기능',
          '희망 납품 일정 및 예산 범위',
          '디자인 선호 스타일 (모던/감성/심플 등)',
        ]}
        accentColor="text-indigo-400"
        headerFrom="#0a0a1a"
        headerTo="#1e1b4b"
      />
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css');

        * { box-sizing: border-box; }
        word-break { word-break: keep-all; }

        /* scroll reveal */
        .ws-reveal {
          opacity: 0;
          transform: translateY(32px);
          filter: blur(3px);
          transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1),
                      transform 0.7s cubic-bezier(0.16,1,0.3,1),
                      filter 0.7s cubic-bezier(0.16,1,0.3,1);
        }
        .ws-reveal.ws-visible { opacity: 1; transform: translateY(0); filter: blur(0); }
        .ws-reveal > *:nth-child(1) { transition-delay: 0ms; }
        .ws-reveal > *:nth-child(2) { transition-delay: 80ms; }
        .ws-reveal > *:nth-child(3) { transition-delay: 160ms; }
        .ws-reveal > *:nth-child(4) { transition-delay: 240ms; }
        .ws-reveal > *:nth-child(5) { transition-delay: 320ms; }

        @keyframes ws-fadeUp {
          from { opacity: 0; transform: translateY(28px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes ws-gridScroll {
          from { background-position: 0 0; }
          to { background-position: 48px 48px; }
        }
        @keyframes ws-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes ws-glow {
          0%,100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .ws-sample-card {
          border-radius: 20px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          background: #0a0f1e; cursor: pointer;
          transition: transform 0.45s cubic-bezier(0.16,1,0.3,1),
                      box-shadow 0.45s cubic-bezier(0.16,1,0.3,1),
                      border-color 0.3s;
        }
        .ws-sample-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.5);
          border-color: rgba(255,255,255,0.14);
        }

        .ws-plan-card {
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s;
        }
        .ws-plan-card:hover { transform: translateY(-4px); }

        .ws-faq-item {
          border-radius: 14px; overflow: hidden;
          transition: border-color 0.25s;
        }

        .ws-step-card {
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s;
        }
        .ws-step-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.3);
        }

        .ws-marquee-track { animation: ws-marquee 30s linear infinite; display: flex; }

        /* scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #030712; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 2px; }
      `}} />

      {/* ── Hero ── */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Animated grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          animation: 'ws-gridScroll 10s linear infinite',
        }} />
        {/* Radial glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 75% 55% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)',
        }} />
        {/* Ambient dot */}
        <div style={{
          position: 'absolute', top: '60%', left: '15%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none', animation: 'ws-glow 5s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '30%', right: '10%', width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(244,114,182,0.05) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none', animation: 'ws-glow 7s ease-in-out infinite 2s',
        }} />

        <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative', animation: 'ws-fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both' }}>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
            color: '#818cf8', textTransform: 'uppercase',
            border: '1px solid rgba(129,140,248,0.3)', padding: '5px 16px', borderRadius: 100,
            marginBottom: 32,
          }}>
            Homepage Development Service
          </span>
          <h1 style={{
            fontSize: 'clamp(28px, 4.5vw, 54px)', fontWeight: 800,
            lineHeight: 1.2, marginBottom: 20,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 50%, #818cf8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            wordBreak: 'keep-all',
          }}>
            홈페이지 맡겼다가<br/>연락 끊긴 경험, 여기선 없습니다
          </h1>
          <p style={{
            fontSize: 16, color: '#64748b', lineHeight: 1.85, marginBottom: 36,
            wordBreak: 'keep-all',
          }}>
            계약서 작성 → 중간 보고 → 소스코드 인도까지 단계마다 증거를 남깁니다.<br/>
            납기 지연 시 하루당 10만원 감면 — 그래서 안 늦습니다.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/freelance?service=website" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              borderRadius: 12, color: 'white', fontWeight: 700, fontSize: 15,
              textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(99,102,241,0.5)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(99,102,241,0.4)'; }}>
              무료 상담 신청 →
            </Link>
            <a href="#samples" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
              color: '#94a3b8', fontWeight: 600, fontSize: 15,
              textDecoration: 'none',
              transition: 'border-color 0.3s, color 0.3s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'; (e.currentTarget as HTMLElement).style.color = '#e2e8f0'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}>
              샘플 보기
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 0, justifyContent: 'center', marginTop: 56, flexWrap: 'wrap' }}>
            {[
              { num: '3~5일', label: '최단 납품 (스타터)' },
              { num: '20만원~', label: '시작 가격' },
              { num: '전액환불', label: '납품 전 환불 보장' },
            ].map((s, i) => (
              <div key={s.label} style={{
                textAlign: 'center', padding: '0 40px',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{s.num}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4, letterSpacing: '0.02em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden', padding: '12px 0' }}>
        <div className="ws-marquee-track" style={{ gap: 0 }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap', flexShrink: 0 }}>
              {['반응형 디자인', 'SEO 최적화', '빠른 납품', '계약서 작성', '소스코드 제공', '1년 AS 보장', '도메인 배포'].map((t, j) => (
                <span key={j} style={{ padding: '0 2rem', fontSize: '0.75rem', color: '#1e293b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {t} <span style={{ color: 'rgba(99,102,241,0.3)', margin: '0 0.5rem' }}>·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Trust badges ── */}
      <section style={{ padding: '48px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { icon: '📋', title: '계약서 필수 작성', desc: '모든 프로젝트 계약서 체결 후 진행' },
            { icon: '📊', title: '주간 진행 보고', desc: '매주 작업 현황 공유, 연락 두절 없음' },
            { icon: '💾', title: '소스코드 전액 제공', desc: '완성 후 전체 소스코드 인도' },
            { icon: '🔒', title: '납기 지연 패널티', desc: '지연 1일당 10만원 자동 감면' },
          ].map((b) => (
            <div key={b.title} style={{
              padding: '20px 22px', borderRadius: 14,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{b.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 4, wordBreak: 'keep-all' }}>{b.title}</div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, wordBreak: 'keep-all' }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sample Portfolio ── */}
      <section id="samples" style={{ padding: '56px 24px', maxWidth: 1160, margin: '0 auto' }}>
        <div ref={samplesRef} className="ws-reveal">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p style={{ fontSize: 11, color: '#6366f1', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Portfolio Samples</p>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 10, letterSpacing: '-0.02em' }}>
              포트폴리오 샘플
            </h2>
            <p style={{ color: '#475569', fontSize: 14 }}>
              카드를 클릭하면 실제 완성 화면을 미리 확인할 수 있습니다
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
            {samples.map((s) => (
              <Link key={s.type} href={`/services/website/samples/${s.type}`} style={{ textDecoration: 'none' }}>
                <div className="ws-sample-card">
                  <div style={{
                    height: 175, background: s.gradient, position: 'relative',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 52, filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.6))' }}>{s.icon}</span>
                    <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 5 }}>
                      {s.tags.map((tag) => (
                        <span key={tag} style={{
                          fontSize: 10, fontWeight: 600, color: '#e2e8f0',
                          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          padding: '2px 8px', borderRadius: 100,
                        }}>{tag}</span>
                      ))}
                    </div>
                    <div style={{
                      position: 'absolute', bottom: 12, right: 12,
                      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                      border: `1px solid ${s.accent}45`,
                      borderRadius: 8, padding: '5px 12px',
                      fontSize: 11, color: s.accent, fontWeight: 700,
                    }}>
                      미리보기 →
                    </div>
                  </div>
                  <div style={{ padding: '18px 22px 22px' }}>
                    <div style={{ fontSize: 11, color: '#334155', marginBottom: 5, letterSpacing: '0.05em' }}>
                      {s.subtitle}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 8, letterSpacing: '-0.01em' }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.65, wordBreak: 'keep-all' }}>
                      {s.desc}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section style={{ padding: '56px 24px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div ref={processRef} className="ws-reveal" style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p style={{ fontSize: 11, color: '#6366f1', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Process</p>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 10, letterSpacing: '-0.02em' }}>
              제작 프로세스
            </h2>
            <p style={{ color: '#475569', fontSize: 14 }}>투명하고 체계적인 5단계로 진행됩니다</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap', justifyContent: 'center', gap: 0 }}>
            {processSteps.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div className="ws-step-card" style={{
                  textAlign: 'center', padding: '28px 22px', minWidth: 138,
                  background: '#080d1a', borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{p.icon}</div>
                  <div style={{ fontSize: 10, color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em', marginBottom: 7 }}>
                    STEP {p.step}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 6, wordBreak: 'keep-all' }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: 11, color: '#334155', lineHeight: 1.55, wordBreak: 'keep-all' }}>
                    {p.desc}
                  </div>
                </div>
                {i < processSteps.length - 1 && (
                  <div style={{ color: '#1e293b', fontSize: 20, padding: '0 4px', flexShrink: 0 }}>›</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section style={{ padding: '64px 24px', maxWidth: 1040, margin: '0 auto' }}>
        <div ref={pricingRef} className="ws-reveal">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p style={{ fontSize: 11, color: '#6366f1', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Pricing</p>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 10, letterSpacing: '-0.02em' }}>
              가격 플랜
            </h2>
            <p style={{ color: '#475569', fontSize: 14 }}>프로젝트 규모에 맞는 플랜을 선택하세요</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 20 }}>
            {plans.map((plan) => (
              <div key={plan.name} className="ws-plan-card" style={{
                padding: 32, borderRadius: 20,
                background: plan.featured ? 'linear-gradient(135deg, #1e1b4b, #312e81)' : '#080d1a',
                border: `1px solid ${plan.featured ? plan.color + '40' : 'rgba(255,255,255,0.05)'}`,
                position: 'relative', overflow: 'hidden',
                boxShadow: plan.featured ? `0 24px 64px ${plan.color}12` : 'none',
              }}>
                {plan.featured && (
                  <div style={{
                    position: 'absolute', top: 20, right: 20,
                    background: plan.color, color: '#1e1b4b',
                    fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 100,
                  }}>BEST</div>
                )}
                <div style={{ fontSize: 12, color: plan.color, fontWeight: 700, marginBottom: 12, letterSpacing: '0.05em' }}>
                  {plan.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 40, fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{plan.price}</span>
                  <span style={{ fontSize: 15, color: '#64748b' }}>{plan.unit}</span>
                </div>
                <div style={{ fontSize: 12, color: '#334155', marginBottom: 24, wordBreak: 'keep-all' }}>{plan.note}</div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, marginBottom: 24 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                      <span style={{ color: plan.color, fontSize: 13, flexShrink: 0, fontWeight: 700 }}>✓</span>
                      <span style={{ fontSize: 13, color: '#94a3b8', wordBreak: 'keep-all' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => openModal(`홈페이지 제작 - ${plan.name}`)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'center', padding: '13px',
                    background: plan.featured ? plan.color : 'rgba(255,255,255,0.04)',
                    borderRadius: 10, color: plan.featured ? '#1e1b4b' : '#94a3b8',
                    fontWeight: 700, fontSize: 14, border: plan.featured ? 'none' : '1px solid rgba(255,255,255,0.07)',
                    transition: 'opacity 0.2s', cursor: 'pointer',
                  }}
                >
                  견적 문의
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '0 24px 64px', maxWidth: 720, margin: '0 auto' }}>
        <div ref={faqRef} className="ws-reveal">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <p style={{ fontSize: 11, color: '#6366f1', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>FAQ</p>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
              자주 묻는 질문
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map((faq, i) => (
              <div key={i} className="ws-faq-item" style={{
                background: '#080d1a',
                border: `1px solid ${openFaq === i ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.05)'}`,
              }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: '100%', textAlign: 'left', padding: '18px 22px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'white', wordBreak: 'keep-all' }}>
                    {faq.q}
                  </span>
                  <span style={{
                    color: '#6366f1', fontSize: 22, flexShrink: 0,
                    transition: 'transform 0.25s',
                    transform: openFaq === i ? 'rotate(45deg)' : 'none',
                    display: 'inline-block',
                  }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 22px 18px', fontSize: 14, color: '#475569', lineHeight: 1.8, wordBreak: 'keep-all' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '0 24px 80px', textAlign: 'center' }}>
        <div ref={ctaRef} className="ws-reveal">
          <div style={{
            maxWidth: 640, margin: '0 auto',
            padding: '56px 44px', borderRadius: 24,
            background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
            border: '1px solid rgba(129,140,248,0.25)',
            boxShadow: '0 24px 80px rgba(99,102,241,0.18)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(129,140,248,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 14, letterSpacing: '-0.02em', wordBreak: 'keep-all', position: 'relative' }}>
              지금 바로 시작하세요
            </h2>
            <p style={{ color: '#a5b4fc', fontSize: 15, lineHeight: 1.75, marginBottom: 32, wordBreak: 'keep-all', position: 'relative' }}>
              무료 상담은 24시간 이내 답변드립니다.<br/>
              어떤 규모의 프로젝트든 환영합니다.
            </p>
            <Link href="/freelance?service=website" style={{
              display: 'inline-block', padding: '15px 40px',
              background: 'linear-gradient(135deg, #818cf8, #6366f1)',
              borderRadius: 12, color: 'white', fontWeight: 700, fontSize: 15,
              textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(99,102,241,0.5)',
              position: 'relative',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(99,102,241,0.6)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(99,102,241,0.5)'; }}>
              무료 상담 신청하기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Scroll to Top ── */}
      <button
        onClick={() => {
          const scroller = (document.querySelector('.main-content') as HTMLElement | null) ?? document.documentElement;
          scroller.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 200,
          width: 48, height: 48, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #818cf8)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
          opacity: showTop ? 1 : 0,
          transform: showTop ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)',
          transition: 'opacity 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.35s cubic-bezier(0.16,1,0.3,1)',
          pointerEvents: showTop ? 'auto' : 'none',
        }}
        aria-label="맨 위로"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
    </div>
  );
}
