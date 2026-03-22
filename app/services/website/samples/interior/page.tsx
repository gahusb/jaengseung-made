'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

/* ── DATA ── */
const portfolio = [
  { title: '한남동 단독주택', cat: '주거 인테리어', area: '245㎡', seed: 'architecture-house', w: 820, h: 1060 },
  { title: '청담 파인다이닝', cat: '상업 공간', area: '190㎡', seed: 'restaurant-interior', w: 820, h: 540 },
  { title: '성수 브랜드 오피스', cat: '업무 공간', area: '380㎡', seed: 'office-design', w: 400, h: 540 },
  { title: '용산 아파트 리모델링', cat: '리모델링', area: '95㎡', seed: 'apartment-modern', w: 400, h: 400 },
  { title: '강남 카페 에스프레소랩', cat: '상업 공간', area: '120㎡', seed: 'cafe-minimal', w: 820, h: 480 },
];

const services = [
  {
    title: '주거 인테리어',
    sub: 'Residential',
    desc: '생활의 리듬에 맞춘 공간을 설계합니다. 단독주택부터 아파트까지, 당신의 일상이 더 아름다워지도록 모든 디테일을 손수 고릅니다.',
    details: ['공간 기획 및 3D 시뮬레이션', '자재 선정 동행 서비스', '시공 전 과정 PM', '준공 후 AS 1년'],
    seed: 'living-room-bright', w: 680, h: 520,
  },
  {
    title: '상업 공간 디자인',
    sub: 'Commercial',
    desc: '브랜드의 철학이 공간 언어로 번역됩니다. 첫 방문객이 문을 열었을 때 느끼는 그 감정까지 설계의 범위입니다.',
    details: ['브랜드 아이덴티티 반영', '동선 및 고객 UX 설계', '조명·음향 플래닝', '설비 협력사 연계'],
    seed: 'commercial-modern', w: 680, h: 520,
  },
  {
    title: '리모델링 & 재생',
    sub: 'Remodeling',
    desc: '기존 공간의 가능성을 새로운 시선으로 바라봅니다. 구조적 변경부터 마감재 교체까지, 완전한 변신을 지원합니다.',
    details: ['현장 실측 및 구조 분석', '철거~완공 원스톱', '예산 내 최적 시공', '친환경 자재 우선 적용'],
    seed: 'renovation-before-after', w: 680, h: 520,
  },
];

const testimonials = [
  {
    name: '하윤서', role: '한남동 단독주택 의뢰인', u: 'hayunseo',
    rating: 5,
    text: '처음엔 예산이 걱정됐는데, 아우라 팀이 범위를 명확히 정해줘서 오히려 계획보다 적게 들었습니다. 무엇보다 완공된 공간에서 매일 아침 커피 한 잔 하는 지금이 너무 행복해요.',
    highlight: '계획보다 적은 예산',
  },
  {
    name: '박도현', role: '카페 에스프레소랩 대표', u: 'parkdohyun',
    rating: 5,
    text: '우리 브랜드 철학을 완벽하게 공간으로 옮겨줬습니다. 오픈 첫날부터 SNS 바이럴이 터졌고, 오픈 3개월 만에 매출이 전년 대비 340% 올랐어요.',
    highlight: '매출 340% 상승',
  },
  {
    name: '이서진', role: '루미너스 COO', u: 'leeseojin',
    rating: 5,
    text: '직원들이 출근하고 싶은 공간을 만드는 게 목표였습니다. 리모델링 후 직원 만족도 설문에서 93점, 퇴직률이 절반으로 줄었습니다.',
    highlight: '직원 만족도 93점',
  },
];

const steps = [
  { num: '01', title: '무료 상담', desc: '공간 사진, 예산, 취향을 공유해 주세요. 72시간 내 맞춤 제안서를 드립니다.' },
  { num: '02', title: '콘셉트 기획', desc: '무드보드와 3D 시뮬레이션으로 완공 이후를 미리 경험합니다.' },
  { num: '03', title: '시공', desc: '전담 PM이 공정마다 현장을 점검하고 일일 리포트를 공유합니다.' },
  { num: '04', title: '준공 & AS', desc: '완공 후 1년간 무상 AS. 공간이 오래 아름답도록 함께합니다.' },
];

/* ── SVG ICONS ── */
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill={filled ? '#8B6914' : 'none'} stroke="#8B6914" strokeWidth="1">
    <path d="M6.5 1l1.5 3 3.5.5-2.5 2.4.6 3.4L6.5 9 3 10.3l.6-3.4L1 4.9 4.5 4.4z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6.5" stroke="#4E5C3E" strokeWidth="1" />
    <path d="M4.5 7l2 2 3-3" stroke="#4E5C3E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight = ({ color = '#8B6914' }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── COMPONENT ── */
export default function InteriorSample() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('au-visible'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.au-reveal').forEach((el) => observer.observe(el));

    return () => { window.removeEventListener('scroll', onScroll); observer.disconnect(); };
  }, []);

  const NAV_H = 72;
  const GOLD = '#8B6914';
  const DARK = '#1C1A17';
  const SAGE = '#4E5C3E';
  const CREAM = '#FAF8F5';
  const SURFACE = '#F0ECE4';

  return (
    <div style={{ background: CREAM, color: DARK, fontFamily: "'Pretendard', 'Apple SD Gothic Neo', system-ui, sans-serif", overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes au-fadeUp {
          from { opacity: 0; transform: translateY(2.5rem); filter: blur(3px); }
          to   { opacity: 1; transform: translateY(0);      filter: blur(0); }
        }
        @keyframes au-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes au-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes au-pulse-gold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(139,105,20,0.3); }
          50%       { box-shadow: 0 0 0 10px rgba(139,105,20,0); }
        }

        .au-reveal { opacity: 0; transform: translateY(2rem); filter: blur(2px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.7s cubic-bezier(0.16,1,0.3,1); }
        .au-reveal.au-visible { opacity: 1; transform: translateY(0); filter: blur(0); }
        .au-reveal:nth-child(2) { transition-delay: 80ms; }
        .au-reveal:nth-child(3) { transition-delay: 160ms; }
        .au-reveal:nth-child(4) { transition-delay: 240ms; }

        .au-nav-link { color: #6B6456; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.3s cubic-bezier(0.16,1,0.3,1); }
        .au-nav-link:hover { color: #1C1A17; }

        .au-btn-primary { display: inline-flex; align-items: center; gap: 10px; background: #1C1A17; color: #FAF8F5; border: none; border-radius: 100px; padding: 14px 28px 14px 20px; font-size: 15px; font-weight: 600; font-family: inherit; cursor: pointer; text-decoration: none; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1); }
        .au-btn-primary:hover { transform: scale(1.02); box-shadow: 0 12px 36px rgba(28,26,23,0.25); }
        .au-btn-primary:active { transform: scale(0.98); }

        .au-btn-ghost { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: #1C1A17; border: 1px solid rgba(28,26,23,0.2); border-radius: 100px; padding: 13px 24px; font-size: 14px; font-weight: 500; font-family: inherit; cursor: pointer; text-decoration: none; transition: border-color 0.3s, background 0.3s; }
        .au-btn-ghost:hover { border-color: rgba(28,26,23,0.5); background: rgba(28,26,23,0.04); }

        .au-portfolio-img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s cubic-bezier(0.16,1,0.3,1); }
        .au-portfolio-cell:hover .au-portfolio-img { transform: scale(1.04); }
        .au-portfolio-cell { overflow: hidden; border-radius: 16px; position: relative; cursor: pointer; }
        .au-portfolio-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(28,26,23,0.7) 0%, transparent 50%); opacity: 0; transition: opacity 0.4s cubic-bezier(0.16,1,0.3,1); display: flex; flex-direction: column; justify-content: flex-end; padding: 20px; }
        .au-portfolio-cell:hover .au-portfolio-overlay { opacity: 1; }

        .au-service-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 32px rgba(28,26,23,0.06); transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1); }
        .au-service-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(28,26,23,0.12); }

        /* Double-Bezel testimonial card */
        .au-testimony { background: rgba(240,236,228,0.5); border-radius: 24px; padding: 6px; border: 1px solid rgba(139,105,20,0.12); transition: border-color 0.3s; }
        .au-testimony:hover { border-color: rgba(139,105,20,0.3); }
        .au-testimony-inner { background: white; border-radius: 18px; padding: 28px 26px; box-shadow: inset 0 1px 1px rgba(255,255,255,0.8); height: 100%; }

        .au-step-num { font-family: 'Playfair Display', Georgia, serif; font-size: 48px; font-weight: 700; color: rgba(139,105,20,0.15); line-height: 1; margin-bottom: 12px; }

        [style*='word-break'] { word-break: keep-all; }
      `}} />

      {/* ── BACK BANNER ── */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/services/website" style={{ color: '#a5b4fc', fontSize: 13, textDecoration: 'none', fontFamily: 'inherit' }}>
          ← 홈페이지 제작 서비스로 돌아가기
        </Link>
        <span style={{ color: '#4c1d95' }}>|</span>
        <span style={{ color: '#fcd34d', fontSize: 12, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 700 }}>
          SAMPLE · 인테리어 업체 홈페이지
        </span>
      </div>

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: scrolled ? 'rgba(250,248,245,0.88)' : 'rgba(250,248,245,0.6)',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(8px)',
        borderBottom: scrolled ? '1px solid rgba(139,105,20,0.12)' : '1px solid transparent',
        transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
        height: NAV_H,
        display: 'flex', alignItems: 'center',
        padding: '0 48px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: DARK, letterSpacing: '-0.01em' }}>
              Aura Interior
            </div>
            <div style={{ fontSize: 10, color: '#A0917C', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: -2 }}>아우라 인테리어</div>
          </div>

          <div style={{ display: 'flex', gap: 32 }}>
            {['포트폴리오', '서비스', '프로세스', '고객 후기', '상담 신청'].map((l) => (
              <a key={l} href={`#${l}`} className="au-nav-link">{l}</a>
            ))}
          </div>

          <Link href="#contact" className="au-btn-primary" style={{ fontSize: 13, padding: '10px 20px 10px 16px' }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(250,248,245,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRight color="#FAF8F5" />
            </span>
            무료 상담 신청
          </Link>
        </div>
      </nav>

      {/* ── HERO ── Split 60/40 */}
      <section style={{ minHeight: 'calc(100dvh - 112px)', display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
        {/* Left — Text */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 64px 80px 80px', position: 'relative' }}>
          {/* Grain texture */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', opacity: 0.025, pointerEvents: 'none' }} />

          <div style={{ animation: 'au-fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both' }}>
            {/* Eyebrow */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `rgba(139,105,20,0.08)`, border: `1px solid rgba(139,105,20,0.2)`, borderRadius: 100, padding: '5px 14px', marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD }} />
              <span style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                서울 기반 인테리어 디자인
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(40px, 4.5vw, 64px)',
              fontWeight: 700, lineHeight: 1.18, color: DARK,
              letterSpacing: '-0.02em', marginBottom: 24,
              wordBreak: 'keep-all',
            }}>
              공간이 당신의<br />
              이야기를<br />
              <em style={{ color: GOLD, fontStyle: 'italic' }}>담습니다.</em>
            </h1>

            <p style={{ fontSize: 16, color: '#6B6456', lineHeight: 1.85, maxWidth: 460, marginBottom: 40, wordBreak: 'keep-all' }}>
              아우라 인테리어는 12년간 247개의 공간을 완성했습니다.<br />
              주거부터 상업 공간까지, 당신의 이야기가 머무는 곳을 만듭니다.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
              <Link href="#contact" className="au-btn-primary">
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(250,248,245,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ArrowRight color="#FAF8F5" />
                </span>
                무료 공간 상담 시작
              </Link>
              <a href="#portfolio" className="au-btn-ghost">
                포트폴리오 보기
              </a>
            </div>

            {/* Mini stats */}
            <div style={{ display: 'flex', gap: 32, paddingTop: 32, borderTop: `1px solid rgba(139,105,20,0.12)` }}>
              {[['247+', '완공 프로젝트'], ['4.96', '고객 만족도'], ['12년', '디자인 경력']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: DARK }}>{n}</div>
                  <div style={{ fontSize: 12, color: '#A0917C', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Image */}
        <div style={{ position: 'relative', background: SURFACE, overflow: 'hidden' }}>
          <img
            src="https://picsum.photos/seed/interior-design-hero/900/1100"
            alt="아우라 인테리어 대표 작업"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="eager"
            decoding="async"
          />
          {/* Floating badge */}
          <div style={{
            position: 'absolute', bottom: 40, left: -24,
            background: 'white', borderRadius: 16, padding: '16px 20px',
            boxShadow: '0 20px 60px rgba(28,26,23,0.18)',
            animation: 'au-float 5s ease-in-out infinite',
            border: '1px solid rgba(139,105,20,0.1)',
          }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
              {[1,2,3,4,5].map(i => <StarIcon key={i} filled />)}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: DARK }}>최근 완공 · 한남동 단독주택</div>
            <div style={{ fontSize: 12, color: '#A0917C', marginTop: 2 }}>고객 만족도 5.0 / 5.0</div>
          </div>
          {/* Category tag */}
          <div style={{ position: 'absolute', top: 32, right: 32, background: 'rgba(28,26,23,0.7)', backdropFilter: 'blur(12px)', borderRadius: 100, padding: '6px 14px', border: '1px solid rgba(250,248,245,0.1)' }}>
            <span style={{ fontSize: 12, color: '#F5EDDF', fontWeight: 600, letterSpacing: '0.05em' }}>Award Winner 2024</span>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO BENTO ── */}
      <section id="포트폴리오" style={{ padding: '100px 80px', background: SURFACE }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="au-reveal" style={{ marginBottom: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>Portfolio</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 700, color: DARK, letterSpacing: '-0.02em', lineHeight: 1.2, wordBreak: 'keep-all' }}>
                공간이 말하는<br />우리의 언어
              </h2>
            </div>
            <a href="#" className="au-btn-ghost" style={{ flexShrink: 0 }}>
              전체 보기 <ArrowRight />
            </a>
          </div>

          {/* Asymmetric bento grid — NOT 3-column equal */}
          <div className="au-reveal" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: 14 }}>
            {/* Large — spans 1 col, 2 rows */}
            <div className="au-portfolio-cell" style={{ gridRow: 'span 2', minHeight: 580 }}>
              <img src={`https://picsum.photos/seed/${portfolio[0].seed}/820/1060`} alt={portfolio[0].title} className="au-portfolio-img" />
              <div className="au-portfolio-overlay">
                <div style={{ fontSize: 11, color: 'rgba(250,248,245,0.6)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>{portfolio[0].cat}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'white', fontFamily: "'Playfair Display', serif" }}>{portfolio[0].title}</div>
                <div style={{ fontSize: 12, color: 'rgba(250,248,245,0.7)', marginTop: 4 }}>{portfolio[0].area}</div>
              </div>
            </div>
            {/* Top right 1 */}
            <div className="au-portfolio-cell" style={{ minHeight: 280 }}>
              <img src={`https://picsum.photos/seed/${portfolio[1].seed}/600/400`} alt={portfolio[1].title} className="au-portfolio-img" />
              <div className="au-portfolio-overlay">
                <div style={{ fontSize: 11, color: 'rgba(250,248,245,0.6)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>{portfolio[1].cat}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'white', fontFamily: "'Playfair Display', serif" }}>{portfolio[1].title}</div>
              </div>
            </div>
            {/* Top right 2 */}
            <div className="au-portfolio-cell" style={{ minHeight: 280 }}>
              <img src={`https://picsum.photos/seed/${portfolio[2].seed}/600/400`} alt={portfolio[2].title} className="au-portfolio-img" />
              <div className="au-portfolio-overlay">
                <div style={{ fontSize: 11, color: 'rgba(250,248,245,0.6)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>{portfolio[2].cat}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'white', fontFamily: "'Playfair Display', serif" }}>{portfolio[2].title}</div>
              </div>
            </div>
            {/* Bottom right — spans 2 cols */}
            <div className="au-portfolio-cell" style={{ gridColumn: 'span 2', minHeight: 280 }}>
              <img src={`https://picsum.photos/seed/${portfolio[4].seed}/1200/480`} alt={portfolio[4].title} className="au-portfolio-img" />
              <div className="au-portfolio-overlay">
                <div style={{ fontSize: 11, color: 'rgba(250,248,245,0.6)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>{portfolio[4].cat}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'white', fontFamily: "'Playfair Display', serif" }}>{portfolio[4].title}</div>
                <div style={{ fontSize: 12, color: 'rgba(250,248,245,0.7)', marginTop: 4 }}>{portfolio[4].area}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ZIG-ZAG ── */}
      <section id="서비스" style={{ padding: '100px 80px', background: CREAM }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="au-reveal" style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>Services</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 700, color: DARK, letterSpacing: '-0.02em', wordBreak: 'keep-all' }}>
              우리가 잘하는 세 가지
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {services.map((svc, i) => (
              <div key={svc.title} className="au-reveal au-service-card" style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 1.2fr' : '1.2fr 1fr', gap: 0 }}>
                {/* Image side */}
                <div style={{ order: i % 2 === 0 ? 2 : 1, position: 'relative', minHeight: 400, overflow: 'hidden', borderRadius: i % 2 === 0 ? '0 20px 20px 0' : '20px 0 0 20px' }}>
                  <img
                    src={`https://picsum.photos/seed/${svc.seed}/680/520`}
                    alt={svc.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)' }}
                    loading="lazy" decoding="async"
                  />
                </div>
                {/* Text side */}
                <div style={{ order: i % 2 === 0 ? 1 : 2, padding: '52px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: 11, color: SAGE, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>{svc.sub}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: DARK, letterSpacing: '-0.02em', marginBottom: 18, lineHeight: 1.2, wordBreak: 'keep-all' }}>
                    {svc.title}
                  </h3>
                  <p style={{ fontSize: 15, color: '#6B6456', lineHeight: 1.85, marginBottom: 28, wordBreak: 'keep-all' }}>{svc.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
                    {svc.details.map((d) => (
                      <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <CheckIcon />
                        <span style={{ fontSize: 14, color: '#5A5148' }}>{d}</span>
                      </div>
                    ))}
                  </div>
                  <a href="#contact" className="au-btn-ghost" style={{ alignSelf: 'flex-start' }}>
                    상담 신청하기 <ArrowRight />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section id="프로세스" style={{ padding: '100px 80px', background: DARK }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="au-reveal" style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>Process</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 700, color: '#F5EDDF', letterSpacing: '-0.02em', wordBreak: 'keep-all' }}>
              상담부터 준공까지
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {steps.map((s, i) => (
              <div key={s.num} className="au-reveal" style={{ padding: '40px 32px', borderLeft: i > 0 ? '1px solid rgba(250,248,245,0.06)' : 'none', position: 'relative' }}>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div style={{ position: 'absolute', top: 56, right: -1, width: 1, height: '60%', background: 'transparent' }} />
                )}
                <div className="au-step-num">{s.num}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: '#F5EDDF', marginBottom: 12, lineHeight: 1.3 }}>{s.title}</div>
                <p style={{ fontSize: 14, color: '#8A7E70', lineHeight: 1.8, wordBreak: 'keep-all' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS MASONRY ── */}
      <section id="고객 후기" style={{ padding: '100px 80px', background: SURFACE }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="au-reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>Reviews</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 700, color: DARK, letterSpacing: '-0.02em', wordBreak: 'keep-all' }}>
              공간이 바꾼 이야기들
            </h2>
          </div>

          {/* Masonry — 2 cols with staggered heights */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, alignItems: 'start' }}>
            {testimonials.map((t, i) => (
              <div key={t.name} className={`au-reveal au-testimony`} style={{ marginTop: i === 1 ? 40 : 0 }}>
                <div className="au-testimony-inner">
                  {/* Highlight badge */}
                  <div style={{ display: 'inline-block', background: `rgba(139,105,20,0.08)`, borderRadius: 100, padding: '4px 12px', marginBottom: 18, border: `1px solid rgba(139,105,20,0.15)` }}>
                    <span style={{ fontSize: 11, color: GOLD, fontWeight: 700 }}>{t.highlight}</span>
                  </div>

                  {/* Quote mark */}
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, color: `rgba(139,105,20,0.15)`, lineHeight: 0.8, marginBottom: 14 }}>"</div>

                  <p style={{ fontSize: 15, color: '#4A4440', lineHeight: 1.85, marginBottom: 24, wordBreak: 'keep-all' }}>{t.text}</p>

                  <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                    {[1,2,3,4,5].map(j => <StarIcon key={j} filled={j <= t.rating} />)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid rgba(139,105,20,0.08)' }}>
                    <img
                      src={`https://i.pravatar.cc/80?u=${t.u}`}
                      alt={t.name}
                      style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: '#A0917C' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Marquee trust strip */}
          <div className="au-reveal" style={{ marginTop: 72, overflow: 'hidden', borderTop: '1px solid rgba(139,105,20,0.1)', paddingTop: 40 }}>
            <div style={{ fontSize: 11, color: '#A0917C', textAlign: 'center', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>
              함께한 브랜드들
            </div>
            <div style={{ display: 'flex', animation: 'au-marquee 20s linear infinite', width: 'fit-content', gap: 64 }}>
              {['에스프레소랩', '루미너스', '플로우캔버스', '스텔라랩스', '넥스트비전', '브릿지웍스', '에스프레소랩', '루미너스', '플로우캔버스', '스텔라랩스', '넥스트비전', '브릿지웍스'].map((b, i) => (
                <span key={i} style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: 'rgba(28,26,23,0.2)', whiteSpace: 'nowrap', fontStyle: 'italic' }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FULL-BLEED ── */}
      <section id="contact" style={{ padding: '120px 80px', background: DARK, position: 'relative', overflow: 'hidden' }}>
        {/* Decorative gold circle */}
        <div style={{ position: 'absolute', right: -100, top: '50%', transform: 'translateY(-50%)', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, rgba(139,105,20,0.12), transparent 70%)`, pointerEvents: 'none' }} />
        {/* Grain */}
        <div style={{ position: 'fixed', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', opacity: 0.02, pointerEvents: 'none', zIndex: 60 }} />

        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="au-reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,105,20,0.12)', border: '1px solid rgba(139,105,20,0.25)', borderRadius: 100, padding: '5px 14px', marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD }} />
            <span style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>72시간 내 제안서 발송</span>
          </div>

          <h2 className="au-reveal" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 700, color: '#F5EDDF', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 20, wordBreak: 'keep-all' }}>
            당신의 공간 이야기를<br />
            <em style={{ color: GOLD }}>지금 시작하세요.</em>
          </h2>

          <p className="au-reveal" style={{ fontSize: 16, color: '#8A7E70', lineHeight: 1.85, marginBottom: 44, wordBreak: 'keep-all' }}>
            사진 한 장과 예산만 알려주세요.<br />
            72시간 내에 맞춤 제안서와 무드보드를 드립니다. 무료입니다.
          </p>

          <div className="au-reveal" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/freelance?service=website" className="au-btn-primary" style={{ background: GOLD, fontSize: 16, padding: '16px 36px 16px 28px', animation: 'au-pulse-gold 3s infinite' }}>
              <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(28,26,23,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRight color="#FAF8F5" />
              </span>
              무료 상담 신청하기
            </Link>
            <a href="tel:02-1234-5678" className="au-btn-ghost" style={{ color: '#F5EDDF', borderColor: 'rgba(245,237,223,0.15)' }}>
              02-1234-5678
            </a>
          </div>

          <div className="au-reveal" style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 40 }}>
            {['완공 보장', '계약서 필수', 'AS 1년'].map((b) => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckIcon />
                <span style={{ fontSize: 13, color: '#8A7E70' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#111009', padding: '40px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: '#F5EDDF', fontStyle: 'italic' }}>Aura Interior</div>
          <div style={{ fontSize: 12, color: '#5A5148', marginTop: 4 }}>© 2024 아우라 인테리어. All rights reserved.</div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['포트폴리오', '서비스 안내', '상담 신청', 'Instagram'].map((l) => (
            <a key={l} href="#" style={{ fontSize: 13, color: '#5A5148', textDecoration: 'none', transition: 'color 0.3s' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
