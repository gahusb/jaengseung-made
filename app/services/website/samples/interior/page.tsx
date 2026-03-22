'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const portfolio = [
  { title: '한남동 단독주택', cat: '주거 인테리어', area: '245㎡', img: 'https://i.pinimg.com/1200x/a7/56/f4/a756f4482ad282353fe89b6ddc4ba3e1.jpg' },
  { title: '청담 파인다이닝',  cat: '상업 공간',    area: '190㎡', img: 'https://i.pinimg.com/736x/f2/68/a7/f268a7cb3405e960a3d1bf7c44c9c7e5.jpg' },
  { title: '성수 브랜드 오피스', cat: '업무 공간',  area: '380㎡', img: 'https://i.pinimg.com/736x/f3/15/2a/f3152a792b7310b6475b40cf912ae0c1.jpg' },
  { title: '용산 아파트 리모델링', cat: '리모델링', area: '95㎡',  img: 'https://i.pinimg.com/474x/76/14/4a/76144a948cea14b77dd2fd43f0da8484.jpg' },
  { title: '강남 카페 에스프레소랩', cat: '상업 공간', area: '120㎡', img: 'https://i.pinimg.com/736x/03/72/b0/0372b0f07d36982f4d3889290a7c762f.jpg' },
];

const services = [
  {
    title: '주거 인테리어', sub: 'Residential',
    desc: '생활의 리듬에 맞춘 공간을 설계합니다. 단독주택부터 아파트까지, 당신의 일상이 더 아름다워지도록 모든 디테일을 손수 고릅니다.',
    details: ['공간 기획 및 3D 시뮬레이션', '자재 선정 동행 서비스', '시공 전 과정 PM', '준공 후 AS 1년'],
    img: 'https://i.pinimg.com/736x/1d/af/b2/1dafb2117511994568cc45ceed09a64c.jpg',
  },
  {
    title: '상업 공간 디자인', sub: 'Commercial',
    desc: '브랜드의 철학이 공간 언어로 번역됩니다. 첫 방문객이 문을 열었을 때 느끼는 그 감정까지 설계의 범위입니다.',
    details: ['브랜드 아이덴티티 반영', '동선 및 고객 UX 설계', '조명·음향 플래닝', '설비 협력사 연계'],
    img: 'https://www.lunalightstudios.com/cdn/shop/files/contemporary-aluminum-funnel-suspension-pendant-lamp-fits-study-room-or-cafe-6-5-10-inch-wide-1-light-grey-226.webp?v=1768032185&width=675',
  },
  {
    title: '리모델링 & 재생', sub: 'Remodeling',
    desc: '기존 공간의 가능성을 새로운 시선으로 바라봅니다. 구조적 변경부터 마감재 교체까지, 완전한 변신을 지원합니다.',
    details: ['현장 실측 및 구조 분석', '철거~완공 원스톱', '예산 내 최적 시공', '친환경 자재 우선 적용'],
    img: 'https://i.pinimg.com/474x/76/14/4a/76144a948cea14b77dd2fd43f0da8484.jpg',
  },
];

const testimonials = [
  { name: '하윤서', role: '한남동 단독주택 의뢰인', u: 'hayunseo', rating: 5, highlight: '계획보다 적은 예산', text: '처음엔 예산이 걱정됐는데, 아우라 팀이 범위를 명확히 정해줘서 오히려 계획보다 적게 들었습니다. 무엇보다 완공된 공간에서 매일 아침 커피 한 잔 하는 지금이 너무 행복해요.' },
  { name: '박도현', role: '카페 에스프레소랩 대표', u: 'parkdohyun', rating: 5, highlight: '매출 340% 상승', text: '우리 브랜드 철학을 완벽하게 공간으로 옮겨줬습니다. 오픈 첫날부터 SNS 바이럴이 터졌고, 오픈 3개월 만에 매출이 전년 대비 340% 올랐어요.' },
  { name: '이서진', role: '루미너스 COO', u: 'leeseojin', rating: 5, highlight: '직원 만족도 93점', text: '직원들이 출근하고 싶은 공간을 만드는 게 목표였습니다. 리모델링 후 직원 만족도 설문에서 93점, 퇴직률이 절반으로 줄었습니다.' },
];

const steps = [
  { num: '01', title: '무료 상담', desc: '공간 사진, 예산, 취향을 공유해 주세요. 72시간 내 맞춤 제안서를 드립니다.' },
  { num: '02', title: '콘셉트 기획', desc: '무드보드와 3D 시뮬레이션으로 완공 이후를 미리 경험합니다.' },
  { num: '03', title: '시공', desc: '전담 PM이 공정마다 현장을 점검하고 일일 리포트를 공유합니다.' },
  { num: '04', title: '준공 & AS', desc: '완공 후 1년간 무상 AS. 공간이 오래 아름답도록 함께합니다.' },
];

/* ══════════════════════════════════════════════
   SVG ICONS
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════ */
const FRAME_COUNT = 48;
const BANNER_H = 40;  // px — back-banner explicit height
const NAV_H    = 72;  // px — sticky nav height

/* ══════════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════════ */
export default function InteriorSample() {
  const [scrolled, setScrolled] = useState(false);
  const canvasRef        = useRef<HTMLCanvasElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const textOverlayRef   = useRef<HTMLDivElement>(null);
  const framesRef        = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    /* ─── 스크롤 컨테이너: DashboardShell의 .main-content (overflow-y: auto)
           window가 아닌 이 요소에서 scroll 이벤트가 발생함 ─── */
    const scroller: HTMLElement =
      (document.querySelector('.main-content') as HTMLElement | null) ??
      document.documentElement;

    /* ── nav 투명 → 불투명 전환 ── */
    const onNavScroll = () => setScrolled(scroller.scrollTop > 60);
    scroller.addEventListener('scroll', onNavScroll, { passive: true });

    /* ── Intersection reveal ── */
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('au-visible'); }),
      { threshold: 0.08, root: scroller === document.documentElement ? null : scroller }
    );
    document.querySelectorAll('.au-reveal').forEach((el) => observer.observe(el));

    /* ── WebP 프레임 프리로드 ── */
    const frames: HTMLImageElement[] = new Array(FRAME_COUNT);
    framesRef.current = frames;
    let firstLoaded = false;

    const drawFrame = (index: number) => {
      const canvas = canvasRef.current;
      const img = frames[Math.max(0, Math.min(FRAME_COUNT - 1, index))];
      if (!canvas || !img?.complete || !img.naturalWidth) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const cw = canvas.width, ch = canvas.height;
      // cover-fit: 비율 유지하며 캔버스를 꽉 채움
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dx = (cw - img.naturalWidth  * scale) / 2;
      const dy = (ch - img.naturalHeight * scale) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, img.naturalWidth * scale, img.naturalHeight * scale);
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/interior-frames/frame-${String(i + 1).padStart(3, '0')}.webp`;
      img.onload = () => { if (!firstLoaded) { firstLoaded = true; drawFrame(0); } };
      frames[i] = img;
    }

    /* ── 캔버스 크기를 컨테이너에 맞춤 ── */
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      // sticky 컨테이너의 실제 크기 사용
      const parent = canvas.parentElement;
      canvas.width  = parent?.clientWidth  ?? window.innerWidth;
      canvas.height = parent?.clientHeight ?? window.innerHeight;
      drawFrame(0);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    /* ── 스크롤 스크러빙 (frame-by-frame) ── */
    let rafId = 0;
    const onScrub = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const section = scrollSectionRef.current;
        if (!section) return;

        // getBoundingClientRect()는 viewport 기준 → scroller가 .main-content여도 정상 작동
        const rect      = section.getBoundingClientRect();
        const vh        = scroller === document.documentElement
          ? window.innerHeight
          : scroller.clientHeight;
        const scrollable = section.offsetHeight - vh;
        if (scrollable <= 0) return;

        const progress  = Math.max(0, Math.min(1, -rect.top / scrollable));
        drawFrame(Math.floor(progress * (FRAME_COUNT - 1)));

        /* 텍스트 오버레이: opacity + filter만 변경 (transform 금지) */
        const overlayEl = textOverlayRef.current;
        if (!overlayEl) return;
        overlayEl.querySelectorAll<HTMLElement>('[data-milestone]').forEach((el) => {
          const s  = parseFloat(el.dataset.start ?? '0');
          const e2 = parseFloat(el.dataset.end   ?? '1');
          const vis = progress >= s && progress < e2;
          el.style.opacity = vis ? '1' : '0';
          el.style.filter  = vis ? 'blur(0px)' : 'blur(6px)';
        });

        /* 진행 바 */
        const bar = overlayEl.querySelector<HTMLElement>('[data-progress-bar]');
        if (bar) bar.style.width = `${progress * 100}%`;
      });
    };
    scroller.addEventListener('scroll', onScrub, { passive: true });
    onScrub(); // 초기 상태 즉시 반영

    return () => {
      scroller.removeEventListener('scroll', onNavScroll);
      scroller.removeEventListener('scroll', onScrub);
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* ── 팔레트 상수 ── */
  const GOLD    = '#8B6914';
  const DARK    = '#1C1A17';
  const SAGE    = '#4E5C3E';
  const CREAM   = '#FAF8F5';
  const SURFACE = '#F0ECE4';

  return (
    <div style={{ background: CREAM, color: DARK, fontFamily: "'Pretendard', 'Apple SD Gothic Neo', system-ui, sans-serif", overflowX: 'hidden' }}>

      {/* ══ 폰트 + 전역 CSS ══ */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── 진입 애니메이션 ── */
        @keyframes au-fadeUp {
          from { opacity: 0; transform: translateY(2rem); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        @keyframes au-float {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-10px); }
        }
        @keyframes au-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes au-pulse-gold {
          0%,100% { box-shadow: 0 0 0 0   rgba(139,105,20,0.3); }
          50%     { box-shadow: 0 0 0 10px rgba(139,105,20,0); }
        }
        @keyframes au-hero-drift {
          from { transform: scale(1.07); }
          to   { transform: scale(1.0);  }
        }

        /* ── 스크롤 reveal ── */
        .au-reveal {
          opacity: 0; transform: translateY(1.5rem); filter: blur(2px);
          transition: opacity .7s cubic-bezier(.16,1,.3,1),
                      transform .7s cubic-bezier(.16,1,.3,1),
                      filter .7s cubic-bezier(.16,1,.3,1);
        }
        .au-reveal.au-visible { opacity: 1; transform: none; filter: blur(0); }
        .au-reveal:nth-child(2) { transition-delay: 80ms; }
        .au-reveal:nth-child(3) { transition-delay: 160ms; }
        .au-reveal:nth-child(4) { transition-delay: 240ms; }

        /* ── 네비게이션 ── */
        .au-nav-link {
          color: #6B6456; text-decoration: none; font-size: 14px; font-weight: 500;
          transition: color .3s;
        }
        .au-nav-link:hover { color: #1C1A17; }

        /* ── 버튼 ── */
        .au-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          background: #1C1A17; color: #FAF8F5; border: none; border-radius: 100px;
          padding: 14px 28px 14px 20px; font-size: 15px; font-weight: 600;
          font-family: inherit; cursor: pointer; text-decoration: none;
          transition: transform .4s cubic-bezier(.16,1,.3,1),
                      box-shadow .4s cubic-bezier(.16,1,.3,1);
        }
        .au-btn-primary:hover  { transform: scale(1.02); box-shadow: 0 12px 36px rgba(28,26,23,.25); }
        .au-btn-primary:active { transform: scale(.98); }

        .au-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: #1C1A17;
          border: 1px solid rgba(28,26,23,.2); border-radius: 100px;
          padding: 13px 24px; font-size: 14px; font-weight: 500;
          font-family: inherit; cursor: pointer; text-decoration: none;
          transition: border-color .3s, background .3s;
        }
        .au-btn-ghost:hover { border-color: rgba(28,26,23,.5); background: rgba(28,26,23,.04); }

        /* ── 포트폴리오 그리드 ── */
        .au-portfolio-cell { overflow: hidden; border-radius: 16px; position: relative; cursor: pointer; }
        .au-portfolio-img  { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .7s cubic-bezier(.16,1,.3,1); }
        .au-portfolio-cell:hover .au-portfolio-img { transform: scale(1.04); }
        .au-portfolio-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(28,26,23,.7) 0%, transparent 50%);
          opacity: 0; transition: opacity .4s cubic-bezier(.16,1,.3,1);
          display: flex; flex-direction: column; justify-content: flex-end; padding: 20px;
        }
        .au-portfolio-cell:hover .au-portfolio-overlay { opacity: 1; }

        /* ── 서비스 카드 ── */
        .au-service-card {
          background: white; border-radius: 20px; overflow: hidden;
          box-shadow: 0 4px 32px rgba(28,26,23,.06);
          transition: transform .4s cubic-bezier(.16,1,.3,1),
                      box-shadow .4s cubic-bezier(.16,1,.3,1);
        }
        .au-service-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(28,26,23,.12); }

        /* ── Double-Bezel 후기 카드 ── */
        .au-testimony       { background: rgba(240,236,228,.5); border-radius: 24px; padding: 6px; border: 1px solid rgba(139,105,20,.12); transition: border-color .3s; }
        .au-testimony:hover { border-color: rgba(139,105,20,.3); }
        .au-testimony-inner { background: white; border-radius: 18px; padding: 28px 26px; box-shadow: inset 0 1px 1px rgba(255,255,255,.8); height: 100%; }

        /* ── 프로세스 번호 ── */
        .au-step-num { font-family:'Playfair Display',Georgia,serif; font-size:48px; font-weight:700; color:rgba(139,105,20,.15); line-height:1; margin-bottom:12px; }

        /* ══ 히어로 비디오 ══ */
        .au-hero-video {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          animation: au-hero-drift 10s cubic-bezier(.16,1,.3,1) forwards;
        }

        /* ══ 스크롤 스크러빙 텍스트 ══
           position/transform은 부모 flex가 담당.
           JS는 opacity + filter만 변경한다. ── */
        .au-scrub-text {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; justify-content: center;
          padding: 0 80px;
          opacity: 0;
          filter: blur(6px);
          transition: opacity .65s cubic-bezier(.16,1,.3,1),
                      filter  .65s cubic-bezier(.16,1,.3,1);
          pointer-events: none;
          will-change: opacity, filter;
        }

        /* 진행 바 */
        .au-scrub-bar-track { position:absolute; bottom:40px; left:80px; right:80px; height:1px; background:rgba(250,248,245,.1); }
        .au-scrub-bar-fill  { height:100%; width:0%; background:rgba(139,105,20,.7); transition:width .08s linear; }

        @media (max-width: 900px) {
          .au-scrub-text { padding: 0 32px; }
          .au-scrub-bar-track { left:32px; right:32px; }
        }
      `}} />

      {/* ══ BACK BANNER ══ */}
      <div style={{
        background: 'linear-gradient(135deg,#1e1b4b,#312e81)',
        height: BANNER_H, display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: 12, flexShrink: 0,
      }}>
        <Link href="/services/website" style={{ color: '#a5b4fc', fontSize: 13, textDecoration: 'none' }}>
          ← 홈페이지 제작 서비스로 돌아가기
        </Link>
        <span style={{ color: '#4c1d95' }}>|</span>
        <span style={{ color: '#fcd34d', fontSize: 12, fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontWeight: 700 }}>
          SAMPLE · 인테리어 업체 홈페이지
        </span>
      </div>

      {/* ══ NAV (sticky within .main-content) ══ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50, height: NAV_H,
        display: 'flex', alignItems: 'center', padding: '0 48px',
        background: scrolled ? 'rgba(250,248,245,.92)' : 'rgba(250,248,245,.15)',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(8px)',
        borderBottom: scrolled ? '1px solid rgba(139,105,20,.1)' : '1px solid transparent',
        transition: 'background .5s cubic-bezier(.16,1,.3,1), border-color .5s, backdrop-filter .5s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 20, fontWeight: 700, color: scrolled ? DARK : '#F5EDDF', letterSpacing: '-0.01em', transition: 'color .5s' }}>
              Aura Interior
            </div>
            <div style={{ fontSize: 10, color: scrolled ? '#A0917C' : 'rgba(245,237,223,.6)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: -2, transition: 'color .5s' }}>
              아우라 인테리어
            </div>
          </div>

          <div style={{ display: 'flex', gap: 32 }}>
            {['포트폴리오', '서비스', '프로세스', '고객 후기', '상담 신청'].map((l) => (
              <a key={l} href={`#${l}`} className="au-nav-link" style={{ color: scrolled ? '#6B6456' : 'rgba(245,237,223,.75)' }}>{l}</a>
            ))}
          </div>

          <Link href="#contact" className="au-btn-primary" style={{ background: scrolled ? DARK : 'rgba(139,105,20,.9)', fontSize: 13, padding: '10px 20px 10px 16px' }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(250,248,245,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRight color="#FAF8F5" />
            </span>
            무료 상담 신청
          </Link>
        </div>
      </nav>

      {/* ══ HERO — 풀블리드 비디오 ══
          height = 100dvh - BANNER_H - NAV_H → 화면을 정확히 채움 */}
      <section style={{
        position: 'relative',
        height: `calc(100dvh - ${BANNER_H}px - ${NAV_H}px)`,
        minHeight: 480,
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        {/* 배경 비디오 */}
        <video className="au-hero-video" autoPlay muted loop playsInline src="/interior-hero.mp4" />

        {/* 그라디언트 오버레이 */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg,rgba(10,8,6,.75) 0%,rgba(10,8,6,.35) 55%,rgba(10,8,6,.08) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(10,8,6,.8) 0%,transparent 50%)' }} />

        {/* 어워드 배지 */}
        <div style={{ position: 'absolute', top: 28, right: 40, zIndex: 2, background: 'rgba(10,8,6,.45)', backdropFilter: 'blur(16px)', borderRadius: 100, padding: '6px 16px', border: '1px solid rgba(250,248,245,.12)' }}>
          <span style={{ fontSize: 11, color: '#F5EDDF', fontWeight: 600, letterSpacing: '0.08em', fontFamily: "'Playfair Display',serif", fontStyle: 'italic' }}>Award Winner 2024</span>
        </div>

        {/* 히어로 텍스트 — 좌하단 */}
        <div style={{ position: 'relative', zIndex: 2, padding: '0 80px 64px', animation: 'au-fadeUp 1s cubic-bezier(.16,1,.3,1) both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,105,20,.2)', border: '1px solid rgba(139,105,20,.4)', borderRadius: 100, padding: '5px 14px', marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD }} />
            <span style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>서울 기반 인테리어 디자인</span>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(38px,5.5vw,72px)', fontWeight: 700, lineHeight: 1.12, color: '#F5EDDF', letterSpacing: '-0.02em', marginBottom: 18, wordBreak: 'keep-all', maxWidth: 640 }}>
            공간이 당신의<br />이야기를<br />
            <em style={{ color: GOLD, fontStyle: 'italic' }}>담습니다.</em>
          </h1>

          <p style={{ fontSize: 16, color: 'rgba(245,237,223,.6)', lineHeight: 1.85, maxWidth: 420, marginBottom: 32, wordBreak: 'keep-all' }}>
            아우라 인테리어는 12년간 247개의 공간을 완성했습니다.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 40 }}>
            <Link href="#contact" className="au-btn-primary" style={{ background: GOLD, color: DARK }}>
              <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(28,26,23,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ArrowRight color={DARK} />
              </span>
              무료 공간 상담 시작
            </Link>
            <a href="#포트폴리오" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(245,237,223,.65)', fontSize: 14, textDecoration: 'none', transition: 'color .3s' }}>
              포트폴리오 보기 <ArrowRight color="rgba(245,237,223,.65)" />
            </a>
          </div>

          <div style={{ display: 'flex', gap: 32, paddingTop: 24, borderTop: '1px solid rgba(250,248,245,.1)' }}>
            {[['247+','완공 프로젝트'],['4.96','고객 만족도'],['12년','디자인 경력']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: '#F5EDDF' }}>{n}</div>
                <div style={{ fontSize: 12, color: 'rgba(245,237,223,.45)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 플로팅 리뷰 배지 */}
        <div style={{ position: 'absolute', bottom: 64, right: 64, zIndex: 2, background: 'rgba(255,255,255,.97)', borderRadius: 14, padding: '14px 18px', boxShadow: '0 24px 64px rgba(10,8,6,.35)', animation: 'au-float 5s ease-in-out infinite', border: '1px solid rgba(139,105,20,.1)' }}>
          <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
            {[1,2,3,4,5].map(i => <StarIcon key={i} filled />)}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: DARK }}>최근 완공 · 한남동 단독주택</div>
          <div style={{ fontSize: 11, color: '#A0917C', marginTop: 2 }}>고객 만족도 5.0 / 5.0</div>
        </div>

        {/* 스크롤 유도 */}
        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 9, color: 'rgba(245,237,223,.35)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom,rgba(245,237,223,.3),transparent)', animation: 'au-float 2.5s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ══ SCROLL SCRUBBING SECTION ══ */}
      <section ref={scrollSectionRef} style={{ position: 'relative', height: '400vh', background: DARK }}>
        {/* sticky 컨테이너: .main-content 기준으로 top:0 에 고정 */}
        <div style={{ position: 'sticky', top: 0, height: '100dvh', overflow: 'hidden' }}>

          {/* 캔버스 — frame-by-frame WebP */}
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
          />

          {/* 그라디언트 오버레이 */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,8,6,.65) 0%, rgba(10,8,6,.2) 55%, transparent 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,8,6,.4) 0%, transparent 35%)' }} />

          {/* ── 텍스트 오버레이 컨테이너 ──
              각 au-scrub-text는 position:absolute inset:0 flex 레이아웃으로 수직 중앙 정렬.
              JS는 opacity + filter만 변경 — transform 불변 */}
          <div ref={textOverlayRef} style={{ position: 'absolute', inset: 0, paddingTop: NAV_H }}>

            {/* Milestone 0: 0–33% */}
            <div className="au-scrub-text" data-milestone="0" data-start="0" data-end="0.33">
              <p style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 18 }}>공간 철학</p>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700, lineHeight: 1.12, color: '#F5EDDF', letterSpacing: '-0.02em', wordBreak: 'keep-all', maxWidth: 520 }}>
                공간이 바뀌면<br />
                <em style={{ color: GOLD, fontStyle: 'italic' }}>일상이 바뀝니다.</em>
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(245,237,223,.55)', marginTop: 20, lineHeight: 1.85, maxWidth: 380, wordBreak: 'keep-all' }}>
                우리는 단순한 시공을 넘어, 당신이 매일 경험하는 삶의 배경을 설계합니다.
              </p>
            </div>

            {/* Milestone 1: 33–66% */}
            <div className="au-scrub-text" data-milestone="1" data-start="0.33" data-end="0.66">
              <p style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 18 }}>실적</p>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700, lineHeight: 1.12, color: '#F5EDDF', letterSpacing: '-0.02em', wordBreak: 'keep-all', maxWidth: 520 }}>
                12년간<br />
                <em style={{ color: GOLD, fontStyle: 'italic' }}>247개의 공간.</em>
              </h2>
              <div style={{ display: 'flex', gap: 40, marginTop: 32 }}>
                {[['247+','완공 프로젝트'],['4.96','고객 만족도'],['98%','재의뢰율']].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 700, color: '#F5EDDF', lineHeight: 1 }}>{n}</div>
                    <div style={{ fontSize: 12, color: 'rgba(245,237,223,.45)', marginTop: 6 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone 2: 66–100% */}
            <div className="au-scrub-text" data-milestone="2" data-start="0.66" data-end="1.01" style={{ pointerEvents: 'auto' }}>
              <p style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 18 }}>지금 시작하세요</p>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700, lineHeight: 1.12, color: '#F5EDDF', letterSpacing: '-0.02em', wordBreak: 'keep-all', maxWidth: 520 }}>
                당신의 공간<br />
                <em style={{ color: GOLD, fontStyle: 'italic' }}>이야기를 시작하세요.</em>
              </h2>
              <Link href="#contact" className="au-btn-primary" style={{ background: GOLD, color: DARK, marginTop: 32, alignSelf: 'flex-start' }}>
                <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(28,26,23,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ArrowRight color={DARK} />
                </span>
                무료 상담 신청
              </Link>
            </div>
          </div>

          {/* 진행 바 */}
          <div className="au-scrub-bar-track">
            <div className="au-scrub-bar-fill" data-progress-bar />
          </div>

          {/* 안내 레이블 */}
          <div style={{ position: 'absolute', bottom: 40, right: 80, fontSize: 10, color: 'rgba(245,237,223,.2)', fontFamily: "'Playfair Display',serif", fontStyle: 'italic', letterSpacing: '0.06em' }}>
            스크롤로 영상 탐색
          </div>
        </div>
      </section>

      {/* ══ PORTFOLIO BENTO ══ */}
      <section id="포트폴리오" style={{ padding: '100px 80px', background: SURFACE }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="au-reveal" style={{ marginBottom: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>Portfolio</div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,3.5vw,48px)', fontWeight: 700, color: DARK, letterSpacing: '-0.02em', lineHeight: 1.2, wordBreak: 'keep-all' }}>
                공간이 말하는<br />우리의 언어
              </h2>
            </div>
            <a href="#" className="au-btn-ghost" style={{ flexShrink: 0 }}>전체 보기 <ArrowRight /></a>
          </div>

          <div className="au-reveal" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: 14 }}>
            <div className="au-portfolio-cell" style={{ gridRow: 'span 2', minHeight: 580 }}>
              <img src={portfolio[0].img} alt={portfolio[0].title} className="au-portfolio-img" />
              <div className="au-portfolio-overlay">
                <div style={{ fontSize: 11, color: 'rgba(250,248,245,.6)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>{portfolio[0].cat}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'white', fontFamily: "'Playfair Display',serif" }}>{portfolio[0].title}</div>
                <div style={{ fontSize: 12, color: 'rgba(250,248,245,.7)', marginTop: 4 }}>{portfolio[0].area}</div>
              </div>
            </div>
            {[1, 2].map((idx) => (
              <div key={idx} className="au-portfolio-cell" style={{ minHeight: 280 }}>
                <img src={portfolio[idx].img} alt={portfolio[idx].title} className="au-portfolio-img" />
                <div className="au-portfolio-overlay">
                  <div style={{ fontSize: 11, color: 'rgba(250,248,245,.6)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>{portfolio[idx].cat}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'white', fontFamily: "'Playfair Display',serif" }}>{portfolio[idx].title}</div>
                </div>
              </div>
            ))}
            <div className="au-portfolio-cell" style={{ gridColumn: 'span 2', minHeight: 280 }}>
              <img src={portfolio[4].img} alt={portfolio[4].title} className="au-portfolio-img" />
              <div className="au-portfolio-overlay">
                <div style={{ fontSize: 11, color: 'rgba(250,248,245,.6)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>{portfolio[4].cat}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'white', fontFamily: "'Playfair Display',serif" }}>{portfolio[4].title}</div>
                <div style={{ fontSize: 12, color: 'rgba(250,248,245,.7)', marginTop: 4 }}>{portfolio[4].area}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICES ZIG-ZAG ══ */}
      <section id="서비스" style={{ padding: '100px 80px', background: CREAM }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="au-reveal" style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>Services</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,3.5vw,48px)', fontWeight: 700, color: DARK, letterSpacing: '-0.02em', wordBreak: 'keep-all' }}>
              우리가 잘하는 세 가지
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {services.map((svc, i) => (
              <div key={svc.title} className="au-reveal au-service-card" style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 1.2fr' : '1.2fr 1fr', gap: 0 }}>
                <div style={{ order: i % 2 === 0 ? 2 : 1, position: 'relative', minHeight: 400, overflow: 'hidden', borderRadius: i % 2 === 0 ? '0 20px 20px 0' : '20px 0 0 20px' }}>
                  <img src={svc.img} alt={svc.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .7s cubic-bezier(.16,1,.3,1)' }} loading="lazy" />
                </div>
                <div style={{ order: i % 2 === 0 ? 1 : 2, padding: '52px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: 11, color: SAGE, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>{svc.sub}</div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: DARK, letterSpacing: '-0.02em', marginBottom: 18, lineHeight: 1.2, wordBreak: 'keep-all' }}>{svc.title}</h3>
                  <p style={{ fontSize: 15, color: '#6B6456', lineHeight: 1.85, marginBottom: 28, wordBreak: 'keep-all' }}>{svc.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
                    {svc.details.map((d) => (
                      <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <CheckIcon /><span style={{ fontSize: 14, color: '#5A5148' }}>{d}</span>
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

      {/* ══ PROCESS (dark) ══ */}
      <section id="프로세스" style={{ padding: '100px 80px', background: DARK }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="au-reveal" style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>Process</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,3.5vw,48px)', fontWeight: 700, color: '#F5EDDF', letterSpacing: '-0.02em', wordBreak: 'keep-all' }}>
              상담부터 준공까지
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
            {steps.map((s, i) => (
              <div key={s.num} className="au-reveal" style={{ padding: '40px 32px', borderLeft: i > 0 ? '1px solid rgba(250,248,245,.06)' : 'none' }}>
                <div className="au-step-num">{s.num}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, color: '#F5EDDF', marginBottom: 12, lineHeight: 1.3 }}>{s.title}</div>
                <p style={{ fontSize: 14, color: '#8A7E70', lineHeight: 1.8, wordBreak: 'keep-all' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS MASONRY ══ */}
      <section id="고객 후기" style={{ padding: '100px 80px', background: SURFACE }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="au-reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>Reviews</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,3.5vw,48px)', fontWeight: 700, color: DARK, letterSpacing: '-0.02em', wordBreak: 'keep-all' }}>
              공간이 바꾼 이야기들
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, alignItems: 'start' }}>
            {testimonials.map((t, i) => (
              <div key={t.name} className="au-reveal au-testimony" style={{ marginTop: i === 1 ? 40 : 0 }}>
                <div className="au-testimony-inner">
                  <div style={{ display: 'inline-block', background: 'rgba(139,105,20,.08)', borderRadius: 100, padding: '4px 12px', marginBottom: 18, border: '1px solid rgba(139,105,20,.15)' }}>
                    <span style={{ fontSize: 11, color: GOLD, fontWeight: 700 }}>{t.highlight}</span>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 48, color: 'rgba(139,105,20,.15)', lineHeight: 0.8, marginBottom: 14 }}>"</div>
                  <p style={{ fontSize: 15, color: '#4A4440', lineHeight: 1.85, marginBottom: 24, wordBreak: 'keep-all' }}>{t.text}</p>
                  <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                    {[1,2,3,4,5].map(j => <StarIcon key={j} filled={j <= t.rating} />)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid rgba(139,105,20,.08)' }}>
                    <img src={`https://i.pravatar.cc/80?u=${t.u}`} alt={t.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} loading="lazy" />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: '#A0917C' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="au-reveal" style={{ marginTop: 72, overflow: 'hidden', borderTop: '1px solid rgba(139,105,20,.1)', paddingTop: 40 }}>
            <div style={{ fontSize: 11, color: '#A0917C', textAlign: 'center', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>함께한 브랜드들</div>
            <div style={{ display: 'flex', animation: 'au-marquee 20s linear infinite', width: 'fit-content', gap: 64 }}>
              {['에스프레소랩','루미너스','플로우캔버스','스텔라랩스','넥스트비전','브릿지웍스','에스프레소랩','루미너스','플로우캔버스','스텔라랩스','넥스트비전','브릿지웍스'].map((b, i) => (
                <span key={i} style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: 'rgba(28,26,23,.18)', whiteSpace: 'nowrap', fontStyle: 'italic' }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section id="contact" style={{ padding: '120px 80px', background: DARK, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -100, top: '50%', transform: 'translateY(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,105,20,.1),transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="au-reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,105,20,.12)', border: '1px solid rgba(139,105,20,.25)', borderRadius: 100, padding: '5px 14px', marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD }} />
            <span style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>72시간 내 제안서 발송</span>
          </div>

          <h2 className="au-reveal" style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(36px,5vw,56px)', fontWeight: 700, color: '#F5EDDF', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 20, wordBreak: 'keep-all' }}>
            당신의 공간 이야기를<br />
            <em style={{ color: GOLD }}>지금 시작하세요.</em>
          </h2>

          <p className="au-reveal" style={{ fontSize: 16, color: '#8A7E70', lineHeight: 1.85, marginBottom: 44, wordBreak: 'keep-all' }}>
            사진 한 장과 예산만 알려주세요.<br />
            72시간 내에 맞춤 제안서와 무드보드를 드립니다. 무료입니다.
          </p>

          <div className="au-reveal" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/freelance?service=website" className="au-btn-primary" style={{ background: GOLD, color: DARK, fontSize: 16, padding: '16px 36px 16px 28px', animation: 'au-pulse-gold 3s infinite' }}>
              <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(28,26,23,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRight color={DARK} />
              </span>
              무료 상담 신청하기
            </Link>
            <a href="tel:02-1234-5678" className="au-btn-ghost" style={{ color: '#F5EDDF', borderColor: 'rgba(245,237,223,.15)' }}>
              02-1234-5678
            </a>
          </div>

          <div className="au-reveal" style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 40 }}>
            {['완공 보장','계약서 필수','AS 1년'].map((b) => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckIcon /><span style={{ fontSize: 13, color: '#8A7E70' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: '#100E0B', padding: '40px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: '#F5EDDF', fontStyle: 'italic' }}>Aura Interior</div>
          <div style={{ fontSize: 12, color: '#4A4035', marginTop: 4 }}>© 2024 아우라 인테리어. All rights reserved.</div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['포트폴리오','서비스 안내','상담 신청','Instagram'].map((l) => (
            <a key={l} href="#" style={{ fontSize: 13, color: '#4A4035', textDecoration: 'none', transition: 'color .3s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#A0917C')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4A4035')}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
