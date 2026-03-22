'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════════════
   DESIGN TOKEN — 인테리어 페이지와 완전히 다른 팔레트
   No gold, no cream, no warm amber.
   Editorial B&W + cool stone.
═══════════════════════════════════════════════════ */
const T = {
  ink:    '#0C0B09',
  paper:  '#F4F2EF',
  sand:   '#E9E5DF',
  stone:  '#7C7870',
  chalk:  '#B8B3AB',
  white:  '#FAFAF8',
} as const;

const BANNER_H = 40;
const NAV_H    = 56;

/* ═══════════════════════════════════════════════════
   UNSPLASH FASHION IMAGES
═══════════════════════════════════════════════════ */
const IMG = {
  hero:  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=85',
  p1:    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
  p2:    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
  p3:    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
  p4:    'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=600&q=80',
  p5:    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80',
  p6:    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80',
  p7:    'https://images.unsplash.com/photo-1503342564405-cf0c5f9d5c79?auto=format&fit=crop&w=600&q=80',
  p8:    'https://images.unsplash.com/photo-1525507119028-ed4ccf09e210?auto=format&fit=crop&w=600&q=80',
  edit1: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
  feat1: 'https://images.unsplash.com/photo-1558171813-0022efd9b40d?auto=format&fit=crop&w=700&q=80',
  feat2: 'https://images.unsplash.com/photo-1542060748-10c28b62716f?auto=format&fit=crop&w=700&q=80',
  lb1:   'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&q=80',
  lb2:   'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=500&q=80',
  lb3:   'https://images.unsplash.com/photo-1503342564405-cf0c5f9d5c79?auto=format&fit=crop&w=500&q=80',
  lb4:   'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=500&q=80',
  lb5:   'https://images.unsplash.com/photo-1525507119028-ed4ccf09e210?auto=format&fit=crop&w=500&q=80',
} as const;

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */
type Cat = '전체' | '아우터' | '상의' | '하의' | '액세서리';

const products = [
  { id: 1,  name: 'Structured Blazer',   kr: '스트럭처드 블레이저', price: 328000, cat: '아우터'   as Cat, img: IMG.p1, isNew: true  },
  { id: 2,  name: 'Cocoon Coat',          kr: '코쿤 코트',           price: 498000, cat: '아우터'   as Cat, img: IMG.p2, isBest: true },
  { id: 3,  name: 'Slip Midi Dress',      kr: '슬립 미디 드레스',    price: 218000, cat: '상의'     as Cat, img: IMG.p3, isNew: true  },
  { id: 4,  name: 'Relaxed Oxford',       kr: '릴랙스드 옥스포드',   price: 145000, cat: '상의'     as Cat, img: IMG.p4              },
  { id: 5,  name: 'Wide Trousers',        kr: '와이드 트라우저',     price: 185000, cat: '하의'     as Cat, img: IMG.p5              },
  { id: 6,  name: 'Barrel Denim',         kr: '배럴 데님',           price: 198000, cat: '하의'     as Cat, img: IMG.p6, isBest: true },
  { id: 7,  name: 'Leather Mini Bag',     kr: '레더 미니백',         price: 278000, cat: '액세서리' as Cat, img: IMG.p7, isNew: true  },
  { id: 8,  name: 'Square Sunglasses',    kr: '스퀘어 선글라스',     price: 128000, cat: '액세서리' as Cat, img: IMG.p8              },
];

const reviews = [
  { quote: '입고 나서 동료가 어디서 샀냐고 계속 물어봐요. 핏이 정말 완벽합니다.', name: '하윤서', city: '서울', item: 'Structured Blazer' },
  { quote: '코쿤 코트, 사진보다 실물이 훨씬 좋아요. 소재감이 기대 이상입니다.', name: '이서진', city: '제주', item: 'Cocoon Coat' },
  { quote: '슬립 드레스를 받았는데 바느질 하나하나에서 정성이 느껴져요.', name: '박도현', city: '부산', item: 'Slip Midi Dress' },
];

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
export default function ShoppingPage() {
  const [activeCat, setActiveCat] = useState<Cat | '전체'>('전체');
  const [scrolled,  setScrolled]  = useState(false);
  const [showTop,   setShowTop]   = useState(false);
  const [cart,      setCart]      = useState(0);

  useEffect(() => {
    const sc: HTMLElement =
      (document.querySelector('.main-content') as HTMLElement | null) ??
      document.documentElement;

    const onScroll = () => {
      setScrolled(sc.scrollTop > 40);
      setShowTop(sc.scrollTop > 500);
    };
    sc.addEventListener('scroll', onScroll, { passive: true });

    /* reveal */
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('ml-in'); }),
      { threshold: 0.07, root: sc === document.documentElement ? null : sc }
    );
    document.querySelectorAll('.ml-reveal').forEach(el => obs.observe(el));

    return () => {
      sc.removeEventListener('scroll', onScroll);
      obs.disconnect();
    };
  }, []);

  const cats: (Cat | '전체')[] = ['전체', '아우터', '상의', '하의', '액세서리'];
  const filtered = activeCat === '전체' ? products : products.filter(p => p.cat === activeCat);

  const scrollTop = () => {
    const sc = (document.querySelector('.main-content') as HTMLElement | null) ?? document.documentElement;
    sc.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: "'Pretendard','Apple SD Gothic Neo',system-ui,sans-serif", background: T.paper, color: T.ink, overflowX: 'hidden' }}>

      {/* ── FONTS + GLOBAL ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap');
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* scroll reveal */
        .ml-reveal {
          opacity: 0; transform: translateY(28px);
          transition: opacity .75s cubic-bezier(.16,1,.3,1), transform .75s cubic-bezier(.16,1,.3,1);
        }
        .ml-reveal.ml-in { opacity: 1; transform: none; }
        .ml-reveal > *:nth-child(2) { transition-delay: 90ms; }
        .ml-reveal > *:nth-child(3) { transition-delay: 180ms; }
        .ml-reveal > *:nth-child(4) { transition-delay: 270ms; }
        .ml-reveal > *:nth-child(5) { transition-delay: 360ms; }
        .ml-reveal > *:nth-child(6) { transition-delay: 450ms; }
        .ml-reveal > *:nth-child(7) { transition-delay: 540ms; }
        .ml-reveal > *:nth-child(8) { transition-delay: 630ms; }

        @keyframes ml-fadeUp {
          from { opacity: 0; transform: translateY(2rem); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes ml-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes ml-float {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-8px); }
        }

        /* product card hover */
        .ml-card-img {
          transition: transform .6s cubic-bezier(.16,1,.3,1), filter .4s;
        }
        .ml-card:hover .ml-card-img { transform: scale(1.04); filter: brightness(0.92); }

        /* lookbook scroll */
        .ml-lb { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; }
        .ml-lb::-webkit-scrollbar { display: none; }

        /* nav underline */
        .ml-nav-a {
          position: relative; font-size: 12px; font-weight: 500;
          letter-spacing: .06em; text-decoration: none; color: inherit;
          transition: opacity .25s;
        }
        .ml-nav-a::after {
          content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
          height: 1px; background: currentColor; transform: scaleX(0);
          transform-origin: left; transition: transform .35s cubic-bezier(.16,1,.3,1);
        }
        .ml-nav-a:hover::after { transform: scaleX(1); }

        /* cat pill */
        .ml-pill {
          border: 1px solid rgba(12,11,9,.18); border-radius: 0;
          background: transparent; font-family: inherit; font-size: 11px;
          font-weight: 600; letter-spacing: .1em; text-transform: uppercase;
          padding: 8px 20px; cursor: pointer; color: ${T.stone};
          transition: all .3s cubic-bezier(.16,1,.3,1);
        }
        .ml-pill:hover { border-color: ${T.ink}; color: ${T.ink}; }
        .ml-pill.on   { background: ${T.ink}; color: ${T.white}; border-color: ${T.ink}; }

        /* ticker */
        .ml-ticker-track { animation: ml-ticker 32s linear infinite; display: flex; white-space: nowrap; }

        /* scrollbar */
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: ${T.paper}; }
        ::-webkit-scrollbar-thumb { background: ${T.chalk}; border-radius: 2px; }

        @media (max-width:1024px) {
          .ml-hero-grid { grid-template-columns: 1fr !important; }
          .ml-hero-img  { display: none !important; }
          .ml-feat-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width:768px) {
          .ml-prod-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width:480px) {
          .ml-prod-grid { grid-template-columns: 1fr !important; }
        }
      `}} />

      {/* ════════════════════════════════════════════
          BACK BANNER
      ════════════════════════════════════════════ */}
      <div style={{
        background: T.ink, height: BANNER_H,
        display: 'flex', alignItems: 'center', padding: '0 32px', gap: 14,
      }}>
        <Link href="/services/website"
          style={{ fontSize: 12, color: T.chalk, textDecoration: 'none', letterSpacing: '.04em', transition: 'color .2s' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = T.white)}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = T.chalk)}>
          ← 홈페이지 제작 서비스로 돌아가기
        </Link>
        <span style={{ color: T.stone, fontSize: 11 }}>|</span>
        <span style={{ fontSize: 11, color: T.stone, fontStyle: 'italic', fontFamily: "'DM Serif Display', serif" }}>
          SAMPLE · 개인 쇼핑몰
        </span>
      </div>

      {/* ════════════════════════════════════════════
          NAV — minimal hairline
      ════════════════════════════════════════════ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50, height: NAV_H,
        display: 'flex', alignItems: 'center', padding: '0 48px',
        background: scrolled ? `rgba(244,242,239,.96)` : T.ink,
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(12,11,9,.1)' : 'rgba(255,255,255,.06)'}`,
        transition: 'background .4s cubic-bezier(.16,1,.3,1), border-color .4s',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* wordmark */}
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, fontWeight: 400, letterSpacing: '.12em', color: scrolled ? T.ink : T.white, transition: 'color .4s' }}>
            MELLOW
          </div>

          {/* links */}
          <div style={{ display: 'flex', gap: 36 }}>
            {['신상품', '아우터', '상의 / 하의', '액세서리', '세일'].map(l => (
              <a key={l} href="#collection" className="ml-nav-a"
                style={{ color: scrolled ? T.stone : 'rgba(244,242,239,.6)' }}>{l}</a>
            ))}
          </div>

          {/* actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* search */}
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4,
              color: scrolled ? T.stone : 'rgba(244,242,239,.6)', transition: 'color .3s' }}
              aria-label="검색">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="15.65" y2="15.65"/>
              </svg>
            </button>
            {/* cart */}
            <button onClick={() => setCart(c => c + 1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, position: 'relative',
                color: scrolled ? T.ink : T.white, transition: 'color .3s' }}
              aria-label="장바구니">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cart > 0 && (
                <span style={{
                  position: 'absolute', top: -5, right: -5,
                  width: 16, height: 16, borderRadius: '50%',
                  background: scrolled ? T.ink : T.white,
                  color: scrolled ? T.white : T.ink,
                  fontSize: 9, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{cart}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════════════
          HERO — editorial dark split
      ════════════════════════════════════════════ */}
      <section style={{
        background: T.ink,
        minHeight: `calc(100dvh - ${BANNER_H}px - ${NAV_H}px)`,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        overflow: 'hidden',
      }} className="ml-hero-grid">

        {/* Left */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '80px 64px 72px 80px',
          animation: 'ml-fadeUp .9s cubic-bezier(.16,1,.3,1) both',
        }}>
          <p style={{ fontSize: 10, color: T.stone, letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: 40 }}>
            2025 — Spring / Summer Collection
          </p>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif", fontStyle: 'italic',
            fontSize: 'clamp(3.5rem, 6vw, 6.5rem)',
            lineHeight: 1.0, color: T.white, marginBottom: 40,
            letterSpacing: '-.02em', wordBreak: 'keep-all',
          }}>
            Clothes<br/>that last<br/>
            <span style={{ color: T.sand, fontStyle: 'normal' }}>longer than</span><br/>
            trends.
          </h1>
          <p style={{ fontSize: 14, color: T.stone, lineHeight: 1.9, marginBottom: 44, maxWidth: 360, wordBreak: 'keep-all' }}>
            자연 소재, 정직한 제작, 긴 수명.<br/>
            유행 대신 오래가는 옷을 만듭니다.
          </p>
          <div style={{ display: 'flex', gap: 14 }}>
            <a href="#collection" style={{
              display: 'inline-block', padding: '14px 32px',
              background: T.white, color: T.ink,
              fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'opacity .25s',
            }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '.82')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}>
              컬렉션 보기
            </a>
            <a href="#story" style={{
              display: 'inline-block', padding: '14px 28px',
              border: '1px solid rgba(244,242,239,.18)', color: 'rgba(244,242,239,.6)',
              fontSize: 12, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase',
              textDecoration: 'none', transition: 'border-color .3s, color .3s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,242,239,.4)'; (e.currentTarget as HTMLElement).style.color = T.white; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,242,239,.18)'; (e.currentTarget as HTMLElement).style.color = 'rgba(244,242,239,.6)'; }}>
              브랜드 스토리
            </a>
          </div>

          {/* inline stats */}
          <div style={{ display: 'flex', gap: 48, marginTop: 64, paddingTop: 40, borderTop: '1px solid rgba(244,242,239,.08)' }}>
            {[['1,247+','누적 고객'],['4.87','평점'],['98%','재구매율']].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: T.white, letterSpacing: '-.01em' }}>{n}</div>
                <div style={{ fontSize: 10, color: T.stone, marginTop: 4, letterSpacing: '.08em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — image */}
        <div className="ml-hero-img" style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={IMG.hero} alt="SS25 Collection"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', filter: 'brightness(.75)' }}
            loading="eager"
          />
          {/* Caption */}
          <div style={{
            position: 'absolute', bottom: 32, left: 32, right: 32,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 11, color: 'rgba(244,242,239,.5)', letterSpacing: '.18em', textTransform: 'uppercase' }}>
              Look 01 / Structured Blazer
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 13, color: T.white }}>
              ₩328,000
            </div>
          </div>
          {/* Floating badge */}
          <div style={{
            position: 'absolute', top: 32, right: 32,
            padding: '10px 14px',
            background: 'rgba(12,11,9,.7)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(244,242,239,.1)',
            animation: 'ml-float 5s ease-in-out infinite',
          }}>
            <div style={{ fontSize: 9, color: T.stone, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 4 }}>신규 입고</div>
            <div style={{ fontSize: 12, color: T.white, fontWeight: 600 }}>2025 S/S</div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          TICKER
      ════════════════════════════════════════════ */}
      <div style={{ background: T.sand, borderTop: '1px solid rgba(12,11,9,.08)', borderBottom: '1px solid rgba(12,11,9,.08)', overflow: 'hidden', padding: '11px 0' }}>
        <div className="ml-ticker-track">
          {[...Array(2)].map((_, i) => (
            <span key={i} style={{ flexShrink: 0 }}>
              {['Free Shipping Over 50,000', '무료 배송', '7일 무료 반품', '국내 장인 제작', '천연 소재만 사용', 'No Trend — Just Quality'].map((t, j) => (
                <span key={j} style={{ padding: '0 2rem', fontSize: 11, color: T.stone, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                  {t}<span style={{ color: T.chalk, margin: '0 .5rem' }}> · </span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════
          COLLECTION GRID
      ════════════════════════════════════════════ */}
      <section id="collection" style={{ padding: '80px 48px', maxWidth: 1360, margin: '0 auto' }}>

        {/* Header row */}
        <div className="ml-reveal" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 400, color: T.ink, letterSpacing: '-.01em' }}>
              {activeCat === '전체' ? 'All Collection' : activeCat}
            </h2>
            <p style={{ fontSize: 12, color: T.stone, marginTop: 4, letterSpacing: '.04em' }}>
              {filtered.length}개 제품
            </p>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {cats.map(c => (
              <button key={c} className={`ml-pill${activeCat === c ? ' on' : ''}`}
                onClick={() => setActiveCat(c)}>{c}</button>
            ))}
          </div>
        </div>

        {/* Grid — asymmetric sizing */}
        <div className="ml-prod-grid ml-reveal" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '4px',
        }}>
          {filtered.map((p, i) => (
            <div key={p.id} className="ml-card" style={{
              cursor: 'pointer',
              gridRow: (i === 0 || i === 5) ? 'span 2' : 'span 1',
            }}>
              {/* Image */}
              <div style={{
                overflow: 'hidden',
                aspectRatio: (i === 0 || i === 5) ? '3/5' : '3/4',
                background: T.sand, position: 'relative',
              }}>
                <img src={p.img} alt={p.kr} className="ml-card-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                {/* Badges */}
                {(p.isNew || p.isBest) && (
                  <div style={{
                    position: 'absolute', top: 14, left: 14,
                    background: p.isBest ? T.ink : 'transparent',
                    border: `1px solid ${p.isBest ? T.ink : 'rgba(12,11,9,.35)'}`,
                    color: p.isBest ? T.white : T.ink,
                    fontSize: 9, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase',
                    padding: '4px 9px',
                  }}>
                    {p.isBest ? 'BEST' : 'NEW'}
                  </div>
                )}
                {/* Quick add */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'rgba(12,11,9,.82)', backdropFilter: 'blur(4px)',
                  padding: '13px 0', textAlign: 'center',
                  opacity: 0, transition: 'opacity .3s',
                }} className="ml-quick">
                  <button
                    onClick={() => setCart(c => c + 1)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: T.white, fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
                      fontFamily: 'inherit',
                    }}>
                    장바구니 추가 +
                  </button>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '14px 2px 24px' }}>
                <p style={{ fontSize: 10, color: T.stone, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 5 }}>{p.cat}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: T.ink, marginBottom: 2, wordBreak: 'keep-all', letterSpacing: '-.01em' }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: T.chalk, wordBreak: 'keep-all' }}>{p.kr}</p>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: T.ink, flexShrink: 0, letterSpacing: '-.01em' }}>
                    {p.price.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 400 }}>원</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="ml-reveal" style={{ textAlign: 'center', marginTop: 56 }}>
          <button style={{
            border: '1px solid rgba(12,11,9,.2)', background: 'transparent',
            color: T.ink, fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
            letterSpacing: '.12em', textTransform: 'uppercase', padding: '14px 48px',
            cursor: 'pointer', transition: 'background .3s, color .3s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.ink; (e.currentTarget as HTMLElement).style.color = T.white; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = T.ink; }}>
            더 보기 (24)
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          EDITORIAL BANNER — full-bleed dark
      ════════════════════════════════════════════ */}
      <section style={{ position: 'relative', height: 560, overflow: 'hidden', margin: '0 0 0 0' }}>
        <img src={IMG.edit1} alt="Editorial"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', filter: 'brightness(.45)' }}
          loading="lazy"
        />
        <div className="ml-reveal" style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          padding: '40px',
        }}>
          <p style={{ fontSize: 10, color: T.chalk, letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: 24 }}>
            Look Book — 2025 S/S
          </p>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif", fontStyle: 'italic',
            fontSize: 'clamp(2.5rem,5vw,5rem)', color: T.white,
            textAlign: 'center', lineHeight: 1.1, wordBreak: 'keep-all', maxWidth: 800,
          }}>
            Dressed for<br/>the life you live.
          </h2>
          <a href="#collection" style={{
            marginTop: 40, display: 'inline-block', padding: '13px 36px',
            border: '1px solid rgba(244,242,239,.4)', color: T.white,
            fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', textDecoration: 'none',
            transition: 'background .3s, border-color .3s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(244,242,239,.12)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
            룩북 보기
          </a>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          BRAND STORY — 2-col asymmetric
      ════════════════════════════════════════════ */}
      <section id="story" style={{ padding: '100px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <div className="ml-feat-grid ml-reveal" style={{ display: 'grid', gridTemplateColumns: '5fr 4fr', gap: '80px', alignItems: 'center' }}>

          {/* Images side-by-side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            <div style={{ overflow: 'hidden', aspectRatio: '3/4', background: T.sand }}>
              <img src={IMG.feat1} alt="Brand story 1"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(.7) brightness(.95)', transition: 'transform .7s cubic-bezier(.16,1,.3,1)' }}
                loading="lazy"
                onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.03)')}
                onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
              />
            </div>
            <div style={{ overflow: 'hidden', aspectRatio: '3/4', background: T.sand, marginTop: 40 }}>
              <img src={IMG.feat2} alt="Brand story 2"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(.7) brightness(.95)', transition: 'transform .7s cubic-bezier(.16,1,.3,1)' }}
                loading="lazy"
                onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.03)')}
                onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
              />
            </div>
          </div>

          {/* Text */}
          <div style={{ paddingLeft: 16 }}>
            <p style={{ fontSize: 10, color: T.stone, letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: 28 }}>
              About MELLOW
            </p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 400, lineHeight: 1.15, color: T.ink, marginBottom: 28, wordBreak: 'keep-all', letterSpacing: '-.01em' }}>
              옷을 만드는<br/>철학이 있습니다.
            </h2>
            <p style={{ fontSize: 14, color: T.stone, lineHeight: 1.95, marginBottom: 18, wordBreak: 'keep-all' }}>
              멜로우는 2019년, 옷 한 벌의 수명을 늘리고 싶다는 생각에서 시작했습니다.
              계절이 바뀌어도 입을 수 있고, 5년 후에도 유행에서 벗어나지 않는 옷을 만드는 것이 목표입니다.
            </p>
            <p style={{ fontSize: 14, color: T.stone, lineHeight: 1.95, marginBottom: 40, wordBreak: 'keep-all' }}>
              모든 제품은 국내 협력 공방에서 소량 생산합니다. 린넨·코튼·울 등 천연 소재만 사용하며,
              염색에도 저자극 공정만 택합니다.
            </p>
            <div style={{ display: 'flex', gap: 40 }}>
              {[['6년', '브랜드 히스토리'],['100%','천연 소재'],['소량','국내 생산']].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: T.ink }}>{n}</div>
                  <div style={{ fontSize: 11, color: T.chalk, marginTop: 4, wordBreak: 'keep-all', letterSpacing: '.04em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          LOOKBOOK — horizontal scroll strip
      ════════════════════════════════════════════ */}
      <section style={{ padding: '0 48px 80px', maxWidth: 1360, margin: '0 auto' }}>
        <div className="ml-reveal" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, fontWeight: 400, color: T.ink }}>Lookbook</h3>
          <a href="#" style={{ fontSize: 11, color: T.stone, letterSpacing: '.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color .2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = T.ink)}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = T.stone)}>
            전체 보기 →
          </a>
        </div>
        <div className="ml-lb">
          {[IMG.lb1, IMG.lb2, IMG.lb3, IMG.lb4, IMG.lb5].map((src, i) => (
            <div key={i} style={{
              flexShrink: 0, width: 240, aspectRatio: '3/4', overflow: 'hidden',
              background: T.sand, cursor: 'pointer',
            }}>
              <img src={src} alt={`Lookbook ${i+1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(.65)', transition: 'transform .6s cubic-bezier(.16,1,.3,1), filter .4s' }}
                loading="lazy"
                onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; (e.currentTarget as HTMLImageElement).style.filter = 'saturate(.85)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLImageElement).style.filter = 'saturate(.65)'; }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          REVIEWS — typographic, no card bg
      ════════════════════════════════════════════ */}
      <section style={{ background: T.ink, padding: '96px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p className="ml-reveal" style={{ fontSize: 10, color: T.stone, letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: 64 }}>
            Customer Notes
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'rgba(244,242,239,.06)' }}>
            {reviews.map((r, i) => (
              <div key={i} className="ml-reveal" style={{ padding: '40px 36px', background: T.ink }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 11, color: T.stone, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 24 }}>
                  {r.item}
                </div>
                <p style={{ fontSize: 16, color: 'rgba(244,242,239,.85)', lineHeight: 1.75, marginBottom: 32, wordBreak: 'keep-all', fontStyle: 'italic', fontFamily: "'DM Serif Display', serif" }}>
                  "{r.quote}"
                </p>
                <div style={{ borderTop: '1px solid rgba(244,242,239,.07)', paddingTop: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.chalk }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: T.stone, marginTop: 2 }}>{r.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CTA — minimal centered on paper
      ════════════════════════════════════════════ */}
      <section style={{ padding: '100px 48px', textAlign: 'center', background: T.paper }}>
        <div className="ml-reveal" style={{ maxWidth: 540, margin: '0 auto' }}>
          <p style={{ fontSize: 10, color: T.stone, letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: 24 }}>
            Newsletter
          </p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, color: T.ink, lineHeight: 1.2, marginBottom: 20, wordBreak: 'keep-all' }}>
            신상품 소식을<br/>가장 먼저 받아보세요
          </h2>
          <p style={{ fontSize: 13, color: T.stone, lineHeight: 1.8, marginBottom: 36, wordBreak: 'keep-all' }}>
            구독자에게는 새 컬렉션 사전 공개와 10% 할인 쿠폰을 드립니다.
          </p>
          <div style={{ display: 'flex', gap: 0, maxWidth: 420, margin: '0 auto' }}>
            <input type="email" placeholder="이메일 주소"
              style={{
                flex: 1, padding: '13px 18px',
                border: '1px solid rgba(12,11,9,.18)', borderRight: 'none',
                background: 'transparent', fontFamily: 'inherit', fontSize: 13,
                color: T.ink, outline: 'none',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = T.ink)}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(12,11,9,.18)')}
            />
            <button style={{
              padding: '13px 22px', background: T.ink, color: T.white,
              border: '1px solid transparent', fontFamily: 'inherit', fontSize: 11,
              fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
              cursor: 'pointer', flexShrink: 0, transition: 'opacity .2s',
            }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '.8')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}>
              구독
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════ */}
      <footer style={{ background: T.ink, padding: '64px 80px 36px', color: T.stone }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
            <div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: T.white, letterSpacing: '.1em', marginBottom: 6 }}>MELLOW</div>
              <div style={{ fontSize: 9, color: T.stone, letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: 18 }}>studio</div>
              <p style={{ fontSize: 12, lineHeight: 1.85, wordBreak: 'keep-all', maxWidth: 220, color: 'rgba(244,242,239,.4)' }}>
                자연 소재와 정직한 제작으로<br/>오래가는 옷을 만듭니다.
              </p>
            </div>
            {[
              { title: 'Shop', links: ['신상품', '아우터', '상의', '하의', '액세서리', '세일'] },
              { title: 'Brand', links: ['브랜드 스토리', '지속가능성', '룩북', '장인 협업'] },
              { title: 'Support', links: ['배송·반품', '사이즈 가이드', 'FAQ', '문의하기'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 9, color: 'rgba(244,242,239,.4)', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 20, fontWeight: 700 }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {col.links.map(l => (
                    <a key={l} href="#" style={{ fontSize: 12, color: T.stone, textDecoration: 'none', transition: 'color .2s' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = T.chalk)}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = T.stone)}>
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(244,242,239,.06)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <p style={{ fontSize: 11, color: 'rgba(244,242,239,.3)', letterSpacing: '.03em' }}>© 2025 MELLOW STUDIO. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 24 }}>
              {['개인정보처리방침', '이용약관', 'Instagram', 'Pinterest'].map(l => (
                <a key={l} href="#" style={{ fontSize: 11, color: T.stone, textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = T.chalk)}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = T.stone)}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ════════════════════════════════════════════
          QUICK-ADD HOVER — global CSS patch
      ════════════════════════════════════════════ */}
      <style dangerouslySetInnerHTML={{ __html: `.ml-card:hover .ml-quick { opacity: 1 !important; }` }} />

      {/* ════════════════════════════════════════════
          SCROLL TO TOP
      ════════════════════════════════════════════ */}
      <button onClick={scrollTop} aria-label="맨 위로"
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 200,
          width: 46, height: 46,
          background: T.ink, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 28px rgba(12,11,9,.25)',
          opacity: showTop ? 1 : 0,
          transform: showTop ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity .35s cubic-bezier(.16,1,.3,1), transform .35s cubic-bezier(.16,1,.3,1)',
          pointerEvents: showTop ? 'auto' : 'none',
        }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
    </div>
  );
}
