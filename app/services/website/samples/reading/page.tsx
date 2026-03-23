'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

/* ═══════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════ */
const BookOpenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? '#D4A853' : 'none'} stroke="#D4A853" strokeWidth="1.5">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);
const QuoteIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M8 8C4 10.5 2 14 2 18c0 3.3 2 5 4 5s3.5-1.5 3.5-4c0-2.3-1.2-3.5-2.5-3.5C5.5 15.5 5 15 6 13c.8-1.5 2.5-3 4-3.5L8 8zm16 0c-4 2.5-6 6-6 10 0 3.3 2 5 4 5s3.5-1.5 3.5-4c0-2.3-1.2-3.5-2.5-3.5C21.5 15.5 21 15 22 13c.8-1.5 2.5-3 4-3.5L24 8z" fill="#D4A853" opacity="0.6"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ArrowUpRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

/* ═══════════════════════════════════════
   COUNTUP HOOK
═══════════════════════════════════════ */
function useCountUp(target: number, duration = 1600) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(target * ease));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ═══════════════════════════════════════
   STAT ITEM
═══════════════════════════════════════ */
function StatItem({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div style={{ textAlign: 'center', padding: '0 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '2px' }}>
        <span ref={ref} style={{ fontSize: '3rem', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#D4A853', lineHeight: 1 }}>{count}</span>
        {suffix && <span style={{ fontSize: '1.5rem', fontFamily: "'Cormorant Garamond', serif", color: '#D4A853' }}>{suffix}</span>}
      </div>
      <p style={{ fontSize: '0.78rem', color: '#8A8070', marginTop: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Pretendard', sans-serif" }}>{label}</p>
    </div>
  );
}

/* ═══════════════════════════════════════
   BOOK CARD
═══════════════════════════════════════ */
interface Book {
  seed: string; title: string; author: string; rating: number; genre: string; year: number; note?: string;
}

const books: Book[] = [
  { seed: 'book1', title: '파친코', author: '이민진', rating: 5, genre: '소설', year: 2024, note: '역사 속에 묻힌 삶의 무게를 느꼈다' },
  { seed: 'book2', title: '어린 왕자', author: '생텍쥐페리', rating: 5, genre: '고전', year: 2023 },
  { seed: 'book3', title: '원씽', author: '게리 켈러', rating: 4, genre: '자기계발', year: 2024 },
  { seed: 'book4', title: '채식주의자', author: '한강', rating: 5, genre: '소설', year: 2023, note: '불편함 속의 아름다움' },
  { seed: 'book5', title: '지능의 본질', author: '제프 호킨스', rating: 4, genre: '과학', year: 2024 },
  { seed: 'book6', title: '82년생 김지영', author: '조남주', rating: 4, genre: '소설', year: 2022 },
  { seed: 'book7', title: '노인과 바다', author: '헤밍웨이', rating: 5, genre: '고전', year: 2022 },
  { seed: 'book8', title: '생각에 관한 생각', author: '다니엘 카너먼', rating: 4, genre: '심리학', year: 2023 },
];

const genreColors: Record<string, string> = {
  '소설': '#6B5B95', '고전': '#D4A853', '자기계발': '#4A7C59', '과학': '#2E6EA6', '심리학': '#8B4E62'
};

function BookCard({ book, large = false }: { book: Book; large?: boolean }) {
  return (
    <div
      className="rd-reveal"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(212,168,83,0.15)',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        height: large ? '420px' : '340px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px rgba(212,168,83,0.12)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* cover */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <img
          src={`https://picsum.photos/seed/${book.seed}/300/450`}
          alt={book.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75) saturate(0.7)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(12,11,9,0.95))' }}/>
        {/* genre badge */}
        <div style={{
          position: 'absolute', top: '0.75rem', left: '0.75rem',
          background: genreColors[book.genre] || '#6B5B95',
          color: 'white', fontSize: '0.65rem', fontFamily: "'Pretendard', sans-serif",
          padding: '3px 8px', borderRadius: '4px', fontWeight: 600, letterSpacing: '0.05em'
        }}>{book.genre}</div>
        {/* rating */}
        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '2px' }}>
          {[1,2,3,4,5].map(i => <StarIcon key={i} filled={i <= book.rating}/>)}
        </div>
      </div>
      {/* info */}
      <div style={{ padding: '0.875rem', background: 'rgba(12,11,9,0.95)' }}>
        <p style={{ fontSize: '0.65rem', color: '#8A8070', fontFamily: "'Pretendard', sans-serif", marginBottom: '0.25rem' }}>{book.author} · {book.year}</p>
        <h3 style={{ fontSize: large ? '1.1rem' : '0.95rem', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#F0EAD8', margin: 0, wordBreak: 'keep-all', lineHeight: 1.3 }}>{book.title}</h3>
        {book.note && <p style={{ fontSize: '0.72rem', color: '#6A6050', fontFamily: "'Pretendard', sans-serif", marginTop: '0.4rem', wordBreak: 'keep-all', fontStyle: 'italic' }}>"{book.note}"</p>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function ReadingPage() {
  const [activeGenre, setActiveGenre] = useState('전체');
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const scroller: HTMLElement =
      (document.querySelector('.main-content') as HTMLElement | null) ??
      document.documentElement;

    const onScroll = () => setShowTop(scroller.scrollTop > 400);
    scroller.addEventListener('scroll', onScroll, { passive: true });

    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('rd-visible'); }),
      { threshold: 0.1, root: scroller === document.documentElement ? null : scroller }
    );
    document.querySelectorAll('.rd-reveal').forEach(el => obs.observe(el));
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      obs.disconnect();
    };
  }, []);

  const genres = ['전체', '소설', '고전', '자기계발', '과학', '심리학'];
  const filteredBooks = activeGenre === '전체' ? books : books.filter(b => b.genre === activeGenre);

  const quotes = [
    { text: '당신이 무엇을 읽느냐가 당신이 누구인지를 말해준다. 책은 당신이 선택한 삶의 궤적이다.', author: '파친코 — 이민진', genre: '소설' },
    { text: '어른들은 숫자를 좋아한다. 새 친구 이야기를 해줄 때, 중요한 것을 절대 묻지 않는다. 그의 목소리가 어떤지, 어떤 놀이를 좋아하는지.', author: '어린 왕자 — 생텍쥐페리', genre: '고전' },
    { text: '성공한 사람들은 하나에 집중하고 나머지를 내려놓는 법을 배웠다. 한 가지를 잘하면 나머지가 따라온다.', author: '원씽 — 게리 켈러', genre: '자기계발' },
    { text: '빠른 생각은 직관이고 느린 생각은 이성이다. 우리는 대부분 빠른 생각이 옳다고 착각하며 살아간다.', author: '생각에 관한 생각 — 다니엘 카너먼', genre: '심리학' },
  ];

  const currentlyReading = {
    seed: 'current1', title: '도둑맞은 집중력', author: '요한 하리', genre: '자기계발',
    progress: 67, totalPages: 380, currentPage: 255,
    startDate: '2024.03.10', note: '현대 사회가 어떻게 우리의 집중력을 앗아가는지 설득력 있게 풀어냄'
  };

  const tbr = [
    { seed: 'tbr1', title: '총, 균, 쇠', author: '재레드 다이아몬드', genre: '역사', priority: '높음' },
    { seed: 'tbr2', title: '코스모스', author: '칼 세이건', genre: '과학', priority: '높음' },
    { seed: 'tbr3', title: '사피엔스', author: '유발 하라리', genre: '역사', priority: '중간' },
  ];

  const monthlyData = [
    { month: '10월', books: 2 }, { month: '11월', books: 3 }, { month: '12월', books: 1 },
    { month: '1월', books: 4 }, { month: '2월', books: 3 }, { month: '3월', books: 2 },
  ];
  const maxBooks = Math.max(...monthlyData.map(d => d.books));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap');
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css');

        .rd-root { font-family: 'Pretendard', sans-serif; background: #0C0B09; color: #F0EAD8; min-height: 100dvh; }
        .rd-serif { font-family: 'Cormorant Garamond', serif; }

        /* grain overlay */
        .rd-grain::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.07'/%3E%3C/svg%3E");
          opacity: 0.4;
        }

        /* scroll reveal */
        .rd-reveal {
          opacity: 0; transform: translateY(2rem); filter: blur(2px);
          transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.7s cubic-bezier(0.16,1,0.3,1);
        }
        .rd-reveal.rd-visible { opacity: 1; transform: translateY(0); filter: blur(0); }
        .rd-reveal:nth-child(2) { transition-delay: 0.08s; }
        .rd-reveal:nth-child(3) { transition-delay: 0.16s; }
        .rd-reveal:nth-child(4) { transition-delay: 0.24s; }
        .rd-reveal:nth-child(5) { transition-delay: 0.32s; }

        /* nav */
        .rd-nav {
          position: fixed; top: 1rem; left: 50%; transform: translateX(-50%); z-index: 100;
          background: rgba(12,11,9,0.7); backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(212,168,83,0.2); border-radius: 100px;
          padding: 0.75rem 2rem; display: flex; align-items: center; gap: 2.5rem;
          white-space: nowrap;
        }

        /* double-bezel cards */
        .rd-bezel {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(212,168,83,0.2);
          border-radius: 16px; padding: 1px;
          box-shadow: inset 0 1px 0 rgba(212,168,83,0.1), 0 0 0 1px rgba(0,0,0,0.5);
        }
        .rd-bezel-inner {
          background: rgba(20,18,14,0.9);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 15px; padding: 1.75rem;
        }

        /* genre filter */
        .rd-genre-btn {
          background: transparent; border: 1px solid rgba(212,168,83,0.2);
          color: #8A8070; font-family: 'Pretendard', sans-serif; font-size: 0.8rem;
          padding: 0.4rem 1rem; border-radius: 100px; cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .rd-genre-btn:hover { border-color: rgba(212,168,83,0.5); color: #D4A853; }
        .rd-genre-btn.active { background: rgba(212,168,83,0.15); border-color: #D4A853; color: #D4A853; }

        /* progress bar */
        .rd-progress-track { background: rgba(255,255,255,0.06); border-radius: 100px; height: 4px; overflow: hidden; }
        .rd-progress-fill { height: 100%; border-radius: 100px; background: linear-gradient(90deg, #D4A853, #F5C842); transition: width 1s cubic-bezier(0.16,1,0.3,1); }

        /* marquee */
        @keyframes rd-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .rd-marquee-track { animation: rd-marquee 25s linear infinite; display: flex; gap: 0; }

        /* hero pulse */
        @keyframes rd-pulse { 0%,100% { opacity:0.3; transform: scale(1); } 50% { opacity:0.6; transform: scale(1.05); } }
        .rd-orb { animation: rd-pulse 4s ease-in-out infinite; }

        /* CTA glow */
        .rd-cta-btn {
          background: #D4A853; color: #0C0B09; border: none;
          font-family: 'Pretendard', sans-serif; font-weight: 700; font-size: 0.9rem;
          padding: 0.875rem 2.5rem; border-radius: 100px; cursor: pointer;
          letter-spacing: 0.05em;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
          box-shadow: 0 0 40px rgba(212,168,83,0.3);
        }
        .rd-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(212,168,83,0.5); background: #E8BC60; }

        /* scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0C0B09; }
        ::-webkit-scrollbar-thumb { background: rgba(212,168,83,0.3); border-radius: 2px; }

        @media (max-width: 768px) {
          .rd-nav { padding: 0.6rem 1.25rem; gap: 1.5rem; }
          .rd-bento { grid-template-columns: 1fr !important; }
          .rd-hero-title { font-size: clamp(3.5rem, 12vw, 8rem) !important; }
          .rd-stats-grid { grid-template-columns: 1fr 1fr !important; gap: 1.5rem !important; }
          .rd-quote-grid { grid-template-columns: 1fr !important; }
          .rd-currently { grid-template-columns: 1fr !important; }
          .rd-monthly-bar { height: 80px !important; }
        }
      `}} />

      {/* ── BACK BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg,#0C0B09,#1A1710)',
        borderBottom: '1px solid rgba(212,168,83,0.12)',
        height: 40, display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: 12, flexShrink: 0, position: 'relative', zIndex: 300,
      }}>
        <Link href="/services/website" style={{ color: 'rgba(212,168,83,0.7)', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#D4A853')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(212,168,83,0.7)')}>
          ← 홈페이지 제작 서비스로 돌아가기
        </Link>
        <span style={{ color: 'rgba(212,168,83,0.2)' }}>|</span>
        <span style={{ color: 'rgba(212,168,83,0.4)', fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
          SAMPLE · 독서 기록 노트
        </span>
      </div>

      <div className="rd-root rd-grain" style={{ position: 'relative' }}>

        {/* ── NAV ── */}
        <nav className="rd-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpenIcon/>
            <span className="rd-serif" style={{ fontSize: '1rem', fontWeight: 600, color: '#D4A853' }}>나의 독서 기록</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: '#8A8070' }}>
            {['컬렉션', '독서록', '통계'].map(item => (
              <a key={item} href={`#${item}`} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#D4A853')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8A8070')}>
                {item}
              </a>
            ))}
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 clamp(1.5rem, 6vw, 6rem)', position: 'relative', overflow: 'hidden' }}>
          {/* ambient orbs */}
          <div className="rd-orb" style={{ position: 'absolute', top: '20%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(212,168,83,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', bottom: '15%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(107,91,149,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}/>

          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
            {/* eyebrow */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(212,168,83,0.3)', borderRadius: '100px', padding: '0.35rem 0.875rem', marginBottom: '2.5rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D4A853' }}/>
              <span style={{ fontSize: '0.72rem', color: '#D4A853', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Pretendard', sans-serif" }}>Personal Reading Journal</span>
            </div>

            {/* hero title */}
            <h1 className="rd-hero-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(4.5rem, 13vw, 10rem)', fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.02em', color: '#F0EAD8', margin: '0 0 2rem', wordBreak: 'keep-all' }}>
              책이 쌓이면<br/>
              <span style={{ color: '#D4A853', fontStyle: 'italic' }}>삶이 된다.</span>
            </h1>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3rem', flexWrap: 'wrap' }}>
              <p style={{ fontSize: '1.1rem', color: '#8A8070', maxWidth: '360px', lineHeight: 1.8, wordBreak: 'keep-all', margin: 0 }}>
                읽은 책마다 남긴 생각들, 좋아하는 문장들, 그리고 아직 읽지 못한 설렘들을 기록하는 공간.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="rd-cta-btn">기록 시작하기</button>
                <button style={{ background: 'transparent', border: '1px solid rgba(212,168,83,0.3)', color: '#D4A853', fontFamily: "'Pretendard', sans-serif", fontSize: '0.9rem', padding: '0.875rem 2rem', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,168,83,0.08)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                  둘러보기
                </button>
              </div>
            </div>

            {/* scroll indicator */}
            <div style={{ marginTop: '5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4A4035' }}>
              <div style={{ width: '40px', height: '1px', background: 'rgba(212,168,83,0.3)' }}/>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Scroll to explore</span>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section style={{ padding: '3rem clamp(1.5rem, 6vw, 6rem)', borderTop: '1px solid rgba(212,168,83,0.1)', borderBottom: '1px solid rgba(212,168,83,0.1)' }}>
          <div className="rd-stats-grid rd-reveal" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', position: 'relative', zIndex: 1 }}>
            <StatItem value={47} label="완독한 책" />
            <div style={{ width: '1px', background: 'rgba(212,168,83,0.1)', margin: '-0.5rem 0' }}/>
            <StatItem value={2340} suffix="p" label="올해 읽은 페이지" />
            <div style={{ width: '1px', background: 'rgba(212,168,83,0.1)', margin: '-0.5rem 0' }}/>
            <StatItem value={128} label="저장한 문장" />
            <div style={{ width: '1px', background: 'rgba(212,168,83,0.1)', margin: '-0.5rem 0' }}/>
            <StatItem value={12} label="독서 중인 달" />
          </div>
        </section>

        {/* ── CURRENTLY READING ── */}
        <section style={{ padding: '5rem clamp(1.5rem, 6vw, 6rem)' }} id="독서록">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="rd-reveal" style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '3rem' }}>
              <h2 className="rd-serif" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#F0EAD8', margin: 0 }}>지금 읽는 중</h2>
              <span style={{ fontSize: '0.75rem', color: '#8A8070', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Currently reading</span>
            </div>

            <div className="rd-currently rd-reveal" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem', alignItems: 'stretch' }}>
              {/* book cover */}
              <div style={{ position: 'relative' }}>
                <img src={`https://picsum.photos/seed/${currentlyReading.seed}/280/420`} alt={currentlyReading.title}
                  style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: '12px', filter: 'brightness(0.85) saturate(0.8)', display: 'block' }}/>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '12px', boxShadow: 'inset 0 0 0 1px rgba(212,168,83,0.2), -12px 20px 60px rgba(0,0,0,0.6)' }}/>
                {/* reading badge */}
                <div style={{ position: 'absolute', top: '1rem', left: '-0.5rem', background: '#D4A853', color: '#0C0B09', fontSize: '0.65rem', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', letterSpacing: '0.05em' }}>READING</div>
              </div>

              {/* info */}
              <div className="rd-bezel" style={{ flex: 1 }}>
                <div className="rd-bezel-inner" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: 'auto' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.7rem', color: '#D4A853', border: '1px solid rgba(212,168,83,0.3)', padding: '2px 8px', borderRadius: '4px' }}>{currentlyReading.genre}</span>
                      <span style={{ fontSize: '0.7rem', color: '#8A8070', border: '1px solid rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px' }}>시작 {currentlyReading.startDate}</span>
                    </div>
                    <h3 className="rd-serif" style={{ fontSize: '2rem', fontWeight: 700, color: '#F0EAD8', margin: '0 0 0.25rem', wordBreak: 'keep-all' }}>{currentlyReading.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#8A8070', margin: '0 0 1.5rem' }}>{currentlyReading.author}</p>

                    <div style={{ background: 'rgba(212,168,83,0.06)', border: '1px solid rgba(212,168,83,0.15)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
                      <p style={{ fontSize: '0.875rem', color: '#C4A060', fontStyle: 'italic', wordBreak: 'keep-all', margin: 0, lineHeight: 1.7 }}>"{currentlyReading.note}"</p>
                    </div>
                  </div>

                  {/* progress */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#8A8070' }}>읽은 진도</span>
                      <span style={{ fontSize: '0.75rem', color: '#D4A853', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                        {currentlyReading.currentPage} / {currentlyReading.totalPages} p — {currentlyReading.progress}%
                      </span>
                    </div>
                    <div className="rd-progress-track">
                      <div className="rd-progress-fill" style={{ width: `${currentlyReading.progress}%` }}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TBR list */}
            <div style={{ marginTop: '2.5rem' }}>
              <h3 className="rd-serif rd-reveal" style={{ fontSize: '1.5rem', fontWeight: 600, color: '#6A5840', marginBottom: '1.25rem', margin: '0 0 1.25rem' }}>다음으로 읽을 책 <span style={{ fontSize: '1rem', fontStyle: 'italic' }}>(TBR)</span></h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {tbr.map((book, i) => (
                  <div key={i} className="rd-reveal" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', transition: 'background 0.3s cubic-bezier(0.16,1,0.3,1)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(212,168,83,0.04)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}>
                    <img src={`https://picsum.photos/seed/${book.seed}/40/60`} alt={book.title} style={{ width: '36px', height: '54px', objectFit: 'cover', borderRadius: '4px', filter: 'brightness(0.8)' }}/>
                    <div style={{ flex: 1 }}>
                      <p className="rd-serif" style={{ fontSize: '1rem', fontWeight: 600, color: '#F0EAD8', margin: '0 0 0.2rem' }}>{book.title}</p>
                      <p style={{ fontSize: '0.75rem', color: '#6A5840', margin: 0 }}>{book.author}</p>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: book.priority === '높음' ? '#D4A853' : '#8A8070', border: `1px solid ${book.priority === '높음' ? 'rgba(212,168,83,0.4)' : 'rgba(255,255,255,0.1)'}`, padding: '2px 8px', borderRadius: '4px' }}>{book.priority}</span>
                    <ArrowUpRight/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BOOK COLLECTION ── */}
        <section style={{ padding: '2rem clamp(1.5rem, 6vw, 6rem) 5rem' }} id="컬렉션">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="rd-reveal" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 className="rd-serif" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#F0EAD8', margin: 0 }}>완독 컬렉션</h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {genres.map(g => (
                  <button key={g} className={`rd-genre-btn ${activeGenre === g ? 'active' : ''}`} onClick={() => setActiveGenre(g)}>{g}</button>
                ))}
              </div>
            </div>

            {/* bento grid */}
            <div className="rd-bento" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '1rem' }}>
              {filteredBooks.slice(0, 1).map((book, i) => (
                <div key={book.seed} style={{ gridRow: 'span 2' }}>
                  <BookCard book={book} large />
                </div>
              ))}
              {filteredBooks.slice(1, 3).map(book => (
                <BookCard key={book.seed} book={book} />
              ))}
              {filteredBooks.slice(3, 5).map(book => (
                <BookCard key={book.seed} book={book} />
              ))}
              {filteredBooks.slice(5, 7).map((book, i) => (
                <div key={book.seed} style={i === 1 ? { gridColumn: 'span 2' } : {}}>
                  <BookCard book={book} />
                </div>
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#4A4035' }}>
                <p className="rd-serif" style={{ fontSize: '1.5rem' }}>이 장르에 읽은 책이 없습니다.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── QUOTES MASONRY ── */}
        <section style={{ padding: '5rem clamp(1.5rem, 6vw, 6rem)', background: 'rgba(212,168,83,0.03)', borderTop: '1px solid rgba(212,168,83,0.08)', borderBottom: '1px solid rgba(212,168,83,0.08)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="rd-reveal" style={{ marginBottom: '3rem' }}>
              <p style={{ fontSize: '0.72rem', color: '#D4A853', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Highlighted Quotes</p>
              <h2 className="rd-serif" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#F0EAD8', margin: 0 }}>마음에 남은 문장들</h2>
            </div>

            <div className="rd-quote-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
              {quotes.map((quote, i) => (
                <div key={i} className={`rd-bezel rd-reveal ${i === 1 ? 'rd-reveal' : ''}`}
                  style={{ marginTop: i % 2 === 1 ? '2rem' : '0' }}>
                  <div className="rd-bezel-inner">
                    <QuoteIcon/>
                    <p className="rd-serif" style={{ fontSize: '1.2rem', color: '#C4B090', lineHeight: 1.8, margin: '1rem 0 1.25rem', fontStyle: 'italic', wordBreak: 'keep-all' }}>
                      {quote.text}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p style={{ fontSize: '0.75rem', color: '#6A5840', margin: 0 }}>{quote.author}</p>
                      <span style={{ fontSize: '0.65rem', color: '#D4A853', border: '1px solid rgba(212,168,83,0.3)', padding: '2px 8px', borderRadius: '4px' }}>{quote.genre}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MONTHLY STATS ── */}
        <section style={{ padding: '5rem clamp(1.5rem, 6vw, 6rem)' }} id="통계">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="rd-reveal" style={{ marginBottom: '3rem' }}>
              <p style={{ fontSize: '0.72rem', color: '#D4A853', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Reading Rhythm</p>
              <h2 className="rd-serif" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#F0EAD8', margin: 0 }}>월별 독서 페이스</h2>
            </div>

            <div className="rd-bezel rd-reveal">
              <div className="rd-bezel-inner">
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '160px' }}>
                  {monthlyData.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.75rem', color: '#D4A853', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{d.books}</span>
                      <div style={{ width: '100%', background: 'rgba(212,168,83,0.12)', borderRadius: '6px 6px 0 0', height: `${(d.books / maxBooks) * 100}%`, position: 'relative', transition: 'height 0.8s cubic-bezier(0.16,1,0.3,1)', minHeight: '8px' }}>
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '6px 6px 0 0', background: `linear-gradient(to top, rgba(212,168,83,0.6), rgba(212,168,83,0.2))` }}/>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#6A5840' }}>{d.month}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
                  {[
                    { label: '총 완독 권수', value: '15권', sub: '최근 6개월' },
                    { label: '평균', value: '2.5권', sub: '월 평균' },
                    { label: '최다 독서 달', value: '1월', sub: '4권 완독' },
                  ].map((item, i) => (
                    <div key={i}>
                      <p className="rd-serif" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#D4A853', margin: '0 0 0.2rem' }}>{item.value}</p>
                      <p style={{ fontSize: '0.75rem', color: '#8A8070', margin: 0 }}>{item.label} · <span style={{ color: '#6A5840' }}>{item.sub}</span></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BRAND MARQUEE ── */}
        <div style={{ borderTop: '1px solid rgba(212,168,83,0.08)', borderBottom: '1px solid rgba(212,168,83,0.08)', overflow: 'hidden', padding: '1rem 0' }}>
          <div className="rd-marquee-track">
            {[...Array(2)].map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: '0', whiteSpace: 'nowrap' }}>
                {['파친코', '어린 왕자', '원씽', '채식주의자', '노인과 바다', '사피엔스', '총·균·쇠', '코스모스', '82년생 김지영'].map((title, j) => (
                  <span key={j} style={{ padding: '0 2rem', fontSize: '0.8rem', color: '#4A4035', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {title} <span style={{ color: 'rgba(212,168,83,0.3)', margin: '0 1rem' }}>·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <section style={{ padding: '6rem clamp(1.5rem, 6vw, 6rem)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)', pointerEvents: 'none' }}/>

          <div className="rd-reveal" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: '0.72rem', color: '#D4A853', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>당신의 독서 기록</p>
            <h2 className="rd-serif" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700, color: '#F0EAD8', margin: '0 0 1.5rem', lineHeight: 1.1, wordBreak: 'keep-all' }}>
              오늘 읽은 한 페이지가<br/>
              <span style={{ color: '#D4A853', fontStyle: 'italic' }}>내일의 나를 만든다.</span>
            </h2>
            <p style={{ fontSize: '1rem', color: '#6A5840', maxWidth: '400px', margin: '0 auto 2.5rem', lineHeight: 1.8, wordBreak: 'keep-all' }}>
              읽은 책을 기록하고, 좋아하는 문장을 저장하고, 나만의 독서 여정을 쌓아가세요.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="rd-cta-btn">무료로 시작하기</button>
              <button style={{ background: 'transparent', border: '1px solid rgba(212,168,83,0.3)', color: '#D4A853', fontFamily: "'Pretendard', sans-serif", fontSize: '0.9rem', padding: '0.875rem 2rem', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,168,83,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                샘플 둘러보기
              </button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: '1px solid rgba(212,168,83,0.08)', padding: '2rem clamp(1.5rem, 6vw, 6rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpenIcon/>
            <span className="rd-serif" style={{ color: '#D4A853', fontWeight: 600 }}>나의 독서 기록</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#4A4035', margin: 0 }}>책은 시간을 초월한 대화다.</p>
        </footer>
      </div>

      {/* ── SCROLL TO TOP ── */}
      <button
        onClick={() => {
          const scroller = (document.querySelector('.main-content') as HTMLElement | null) ?? document.documentElement;
          scroller.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        style={{
          position: 'fixed', bottom: '5.5rem', right: '2rem', zIndex: 400,
          width: 48, height: 48, borderRadius: '50%',
          background: '#D4A853', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(212,168,83,0.4)',
          opacity: showTop ? 1 : 0,
          transform: showTop ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)',
          transition: 'opacity 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.35s cubic-bezier(0.16,1,0.3,1)',
          pointerEvents: showTop ? 'auto' : 'none',
        }}
        aria-label="맨 위로"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0C0B09" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
    </>
  );
}
