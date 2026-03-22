'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
type Category = '전체' | '의류' | '액세서리' | '라이프';

const products = [
  { id: 1, name: 'Linen Over Shirt', sub: '린넨 오버셔츠', price: 89000, tag: '신상', cat: '의류' as Category, seed: 'mel01', badge: 'NEW' },
  { id: 2, name: 'Capsule Tote Bag', sub: '카프슐 토트백', price: 145000, tag: '베스트', cat: '액세서리' as Category, seed: 'mel02' },
  { id: 3, name: 'Wide Crop Pants', sub: '와이드 크롭 팬츠', price: 97000, cat: '의류' as Category, seed: 'mel03' },
  { id: 4, name: 'Knit Cardigan', sub: '니트 카디건', price: 125000, cat: '의류' as Category, seed: 'mel04', badge: 'BEST' },
  { id: 5, name: 'Ceramic Mug Set', sub: '세라믹 머그 세트', price: 58000, cat: '라이프' as Category, seed: 'mel05' },
  { id: 6, name: 'Brass Ring Set', sub: '브라스 링 세트', price: 42000, cat: '액세서리' as Category, seed: 'mel06' },
  { id: 7, name: 'Minimal Slip Dress', sub: '미니멀 슬립 드레스', price: 112000, cat: '의류' as Category, seed: 'mel07', badge: 'NEW' },
  { id: 8, name: 'Linen Cushion Cover', sub: '린넨 쿠션 커버', price: 35000, cat: '라이프' as Category, seed: 'mel08' },
];

const reviews = [
  { name: '김민서', location: '서울', rating: 5, text: '소재부터 다릅니다. 린넨 셔츠 착용감이 정말 좋아요. 세탁 후에도 형태 유지가 잘 돼서 재구매할 것 같아요.', product: 'Linen Over Shirt' },
  { name: '이하은', location: '부산', rating: 5, text: '미니멀한 디자인인데 어디에나 잘 어울립니다. 포장도 너무 예쁘게 해주셔서 선물 받은 기분이었어요.', product: 'Capsule Tote Bag' },
  { name: '박지수', location: '대구', rating: 5, text: '세라믹 머그 세트 배송이 빠르고 파손 없이 왔어요. 질감이 정말 고급스러워서 매일 아침 쓰고 있어요.', product: 'Ceramic Mug Set' },
];

const storyImages = [
  { seed: 'story1', aspect: '3/4' },
  { seed: 'story2', aspect: '1/1' },
  { seed: 'story3', aspect: '3/4' },
];

/* ═══════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════ */
const BANNER_H = 40;
const NAV_H = 64;

const BEIGE = '#FAFAF8';
const DARK  = '#1A1A1A';
const TAUPE = '#8B7355';
const MUTED = '#B5A898';
const SOFT  = '#F3EFE9';
const WARM  = '#C4A882';

/* ═══════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════ */
const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? WARM : 'none'} stroke={filled ? WARM : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const StarFull = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={WARM} stroke={WARM} strokeWidth="0">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);

/* ═══════════════════════════════════════════
   PRODUCT CARD
═══════════════════════════════════════════ */
function ProductCard({ product, large = false }: { product: typeof products[0]; large?: boolean }) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="ms-reveal"
      style={{
        background: SOFT, borderRadius: 16, overflow: 'hidden',
        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 24px 64px rgba(26,26,26,0.12)' : '0 2px 12px rgba(26,26,26,0.04)',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: large ? '3/4' : '1/1' }}>
        <img
          src={`https://picsum.photos/seed/${product.seed}/480/600`}
          alt={product.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            filter: 'brightness(0.95) saturate(0.75)',
            transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />
        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 60%, rgba(26,26,26,0.15))',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s',
        }}/>

        {/* Badge */}
        {product.badge && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: product.badge === 'NEW' ? DARK : WARM,
            color: product.badge === 'NEW' ? BEIGE : DARK,
            fontSize: 9, fontWeight: 800, letterSpacing: '0.1em',
            padding: '3px 8px', borderRadius: 4,
          }}>{product.badge}</div>
        )}

        {/* Like */}
        <button
          onClick={e => { e.stopPropagation(); setLiked(!liked); }}
          style={{
            position: 'absolute', top: 12, right: 12,
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(250,250,248,0.9)', backdropFilter: 'blur(8px)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hovered || liked ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
          aria-label="찜하기"
        >
          <HeartIcon filled={liked}/>
        </button>

        {/* Quick add */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.35s, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <button style={{
            width: '100%', padding: '14px',
            background: 'rgba(26,26,26,0.88)', backdropFilter: 'blur(8px)',
            border: 'none', cursor: 'pointer',
            color: BEIGE, fontSize: 12, fontWeight: 700,
            letterSpacing: '0.08em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <CartIcon/> 장바구니 담기
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px 18px' }}>
        <p style={{ fontSize: 10, color: MUTED, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4, fontFamily: "'Cormorant Garamond', serif" }}>{product.cat}</p>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: DARK, marginBottom: 2, letterSpacing: '-0.01em', wordBreak: 'keep-all' }}>{product.name}</h3>
        <p style={{ fontSize: 11, color: MUTED, marginBottom: 10, wordBreak: 'keep-all' }}>{product.sub}</p>
        <p style={{ fontSize: 14, fontWeight: 700, color: DARK, letterSpacing: '-0.01em' }}>
          {product.price.toLocaleString()}원
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function ShoppingPage() {
  const [activeCategory, setActiveCategory] = useState<Category | '전체'>('전체');
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const scroller: HTMLElement =
      (document.querySelector('.main-content') as HTMLElement | null) ??
      document.documentElement;

    const onScroll = () => {
      setScrolled(scroller.scrollTop > 60);
      setShowTop(scroller.scrollTop > 400);
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });

    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('ms-visible'); }),
      { threshold: 0.08, root: scroller === document.documentElement ? null : scroller }
    );
    document.querySelectorAll('.ms-reveal').forEach(el => obs.observe(el));

    return () => {
      scroller.removeEventListener('scroll', onScroll);
      obs.disconnect();
    };
  }, []);

  const categories: (Category | '전체')[] = ['전체', '의류', '액세서리', '라이프'];
  const filtered = activeCategory === '전체' ? products : products.filter(p => p.cat === activeCategory);

  return (
    <div style={{ background: BEIGE, color: DARK, fontFamily: "'Pretendard', 'Apple SD Gothic Neo', system-ui, sans-serif", overflowX: 'hidden' }}>

      {/* ── 폰트 + CSS ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap');
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes ms-fadeUp {
          from { opacity: 0; transform: translateY(2rem); filter: blur(4px); }
          to   { opacity: 1; transform: none; filter: none; }
        }
        @keyframes ms-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes ms-float {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50%     { transform: translateY(-10px) rotate(-2deg); }
        }

        /* scroll reveal */
        .ms-reveal {
          opacity: 0; transform: translateY(1.5rem); filter: blur(2px);
          transition: opacity .7s cubic-bezier(.16,1,.3,1),
                      transform .7s cubic-bezier(.16,1,.3,1),
                      filter .7s cubic-bezier(.16,1,.3,1);
        }
        .ms-reveal.ms-visible { opacity: 1; transform: none; filter: none; }
        .ms-reveal:nth-child(2) { transition-delay: 80ms; }
        .ms-reveal:nth-child(3) { transition-delay: 160ms; }
        .ms-reveal:nth-child(4) { transition-delay: 240ms; }
        .ms-reveal:nth-child(5) { transition-delay: 320ms; }

        /* nav */
        .ms-nav-link {
          font-size: 13px; font-weight: 500; text-decoration: none;
          color: ${MUTED}; letter-spacing: 0.03em;
          transition: color 0.25s;
        }
        .ms-nav-link:hover { color: ${DARK}; }

        /* category pill */
        .ms-cat-btn {
          border: 1px solid rgba(26,26,26,0.15); border-radius: 100px;
          background: transparent; font-family: inherit; font-size: 12px;
          font-weight: 600; letter-spacing: 0.05em; padding: 7px 18px;
          cursor: pointer; color: ${MUTED}; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .ms-cat-btn:hover { border-color: ${DARK}; color: ${DARK}; }
        .ms-cat-btn.active { background: ${DARK}; color: ${BEIGE}; border-color: ${DARK}; }

        /* marquee */
        .ms-marquee-track { animation: ms-marquee 35s linear infinite; display: flex; }

        /* scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${BEIGE}; }
        ::-webkit-scrollbar-thumb { background: rgba(139,115,85,0.25); border-radius: 2px; }

        @media (max-width: 1024px) {
          .ms-hero-grid { grid-template-columns: 1fr !important; }
          .ms-hero-image-col { display: none !important; }
          .ms-story-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .ms-product-grid { grid-template-columns: 1fr 1fr !important; }
          .ms-review-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .ms-product-grid { grid-template-columns: 1fr !important; }
        }
      `}} />

      {/* ── BACK BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1A1A1A, #2A2018)',
        height: BANNER_H, display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: 12, flexShrink: 0,
      }}>
        <Link href="/services/website" style={{ color: 'rgba(196,168,130,0.7)', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = WARM)}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(196,168,130,0.7)')}>
          ← 홈페이지 제작 서비스로 돌아가기
        </Link>
        <span style={{ color: 'rgba(196,168,130,0.2)' }}>|</span>
        <span style={{ color: 'rgba(196,168,130,0.5)', fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
          SAMPLE · 개인 쇼핑몰
        </span>
      </div>

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50, height: NAV_H,
        display: 'flex', alignItems: 'center', padding: '0 48px',
        background: scrolled ? 'rgba(250,250,248,.94)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(26,26,26,0.08)' : '1px solid transparent',
        transition: 'background .4s cubic-bezier(.16,1,.3,1), border-color .4s, backdrop-filter .4s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: DARK, letterSpacing: '0.05em' }}>
              MELLOW
            </div>
            <div style={{ fontSize: 9, color: MUTED, letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: -2 }}>
              studio
            </div>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 32 }}>
            {['신상품', '의류', '액세서리', '라이프', '세일'].map(l => (
              <a key={l} href="#products" className="ms-nav-link">{l}</a>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, display: 'flex', padding: 4 }} aria-label="검색">
              <SearchIcon/>
            </button>
            <button
              onClick={() => setCartCount(c => c + 1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: DARK, display: 'flex', position: 'relative', padding: 4 }}
              aria-label="장바구니"
            >
              <CartIcon/>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  width: 16, height: 16, borderRadius: '50%',
                  background: DARK, color: BEIGE,
                  fontSize: 9, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: `calc(100dvh - ${BANNER_H}px - ${NAV_H}px)`,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        overflow: 'hidden', background: SOFT,
      }} className="ms-hero-grid">

        {/* Left: Text */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '80px 64px 80px 80px', position: 'relative',
        }}>
          <div style={{ animation: 'ms-fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
              <div style={{ width: 24, height: 1, background: WARM }}/>
              <span style={{ fontSize: 10, color: TAUPE, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                2024 SS Collection
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(3rem, 5vw, 5.5rem)',
              fontWeight: 700, lineHeight: 1.05,
              color: DARK, marginBottom: 28,
              letterSpacing: '-0.02em', wordBreak: 'keep-all',
            }}>
              Wear What<br/>
              <span style={{ fontStyle: 'italic', color: TAUPE }}>Feels Right.</span>
            </h1>

            <p style={{ fontSize: 15, color: TAUPE, lineHeight: 1.85, marginBottom: 40, maxWidth: 380, wordBreak: 'keep-all' }}>
              자연스러운 소재와 절제된 실루엣.<br/>
              일상에 녹아드는 옷을 만듭니다.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="#products" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: DARK, color: BEIGE,
                borderRadius: 100, padding: '14px 28px',
                fontSize: 13, fontWeight: 700, textDecoration: 'none',
                letterSpacing: '0.04em', transition: 'transform .4s cubic-bezier(.16,1,.3,1), box-shadow .4s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 36px rgba(26,26,26,0.2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}>
                컬렉션 보기 →
              </a>
              <a href="#story" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'transparent', color: DARK,
                border: '1px solid rgba(26,26,26,0.2)', borderRadius: 100, padding: '14px 24px',
                fontSize: 13, fontWeight: 500, textDecoration: 'none',
                transition: 'border-color .3s',
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,26,26,0.5)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,26,26,0.2)')}>
                브랜드 스토리
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 40, marginTop: 56, paddingTop: 40, borderTop: '1px solid rgba(26,26,26,0.08)' }}>
              {[
                { num: '1,200+', label: '누적 고객' },
                { num: '4.9', label: '평균 평점' },
                { num: '98%', label: '재구매율' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: DARK, letterSpacing: '-0.02em' }}>{s.num}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2, letterSpacing: '0.05em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Image */}
        <div className="ms-hero-image-col" style={{
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Main image */}
          <img
            src="https://picsum.photos/seed/mellohero/800/1100"
            alt="Hero"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: 'brightness(0.92) saturate(0.7)',
            }}
          />
          {/* Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(243,239,233,0.3) 0%, transparent 40%)' }}/>

          {/* Floating badge */}
          <div style={{
            position: 'absolute', top: '15%', right: '8%',
            background: 'rgba(250,250,248,0.9)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(26,26,26,0.08)',
            borderRadius: 14, padding: '14px 18px',
            animation: 'ms-float 5s ease-in-out infinite',
          }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, color: TAUPE, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
              New Arrival
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: DARK }}>Linen Over Shirt</div>
            <div style={{ fontSize: 13, color: TAUPE, marginTop: 2 }}>89,000원</div>
          </div>

          {/* Rating badge */}
          <div style={{
            position: 'absolute', bottom: '15%', left: '8%',
            background: DARK, borderRadius: 12, padding: '12px 16px',
          }}>
            <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
              {[1,2,3,4,5].map(i => <StarFull key={i}/>)}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(250,250,248,0.6)', letterSpacing: '0.05em' }}>4.9 · 리뷰 1,200+</div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ background: DARK, overflow: 'hidden', padding: '14px 0' }}>
        <div className="ms-marquee-track" style={{ gap: 0 }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap', flexShrink: 0 }}>
              {['Natural Fabric', '무료 배송', 'Handmade Detail', '7일 무료 반품', 'Minimal Design', '친환경 패키지', 'Premium Quality'].map((t, j) => (
                <span key={j} style={{ padding: '0 2rem', fontSize: '0.7rem', color: 'rgba(250,250,248,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  {t} <span style={{ color: 'rgba(196,168,130,0.3)', margin: '0 0.5rem' }}>·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── PRODUCTS ── */}
      <section id="products" style={{ padding: '80px 48px', maxWidth: 1280, margin: '0 auto' }}>
        <div className="ms-reveal" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 44, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <p style={{ fontSize: 10, color: TAUPE, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>Collection</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, color: DARK, letterSpacing: '-0.02em' }}>
              {activeCategory === '전체' ? 'All Items' : activeCategory}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`ms-cat-btn${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="ms-product-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
        }}>
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} large={product.id % 3 === 1}/>
          ))}
        </div>

        <div className="ms-reveal" style={{ textAlign: 'center', marginTop: 52 }}>
          <button style={{
            border: `1px solid rgba(26,26,26,0.2)`, background: 'transparent',
            color: DARK, fontFamily: 'inherit', fontSize: 13,
            fontWeight: 600, letterSpacing: '0.05em',
            padding: '14px 40px', borderRadius: 100, cursor: 'pointer',
            transition: 'background .3s, color .3s, border-color .3s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = DARK; (e.currentTarget as HTMLElement).style.color = BEIGE; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = DARK; }}>
            더 보기 (24)
          </button>
        </div>
      </section>

      {/* ── BRAND STORY ── */}
      <section id="story" style={{ padding: '80px 48px', background: SOFT }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="ms-story-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

            {/* Images */}
            <div style={{ display: 'flex', gap: 16 }}>
              {storyImages.map((img, i) => (
                <div key={img.seed} className="ms-reveal" style={{
                  flex: i === 1 ? '0.85' : '1',
                  aspectRatio: img.aspect,
                  borderRadius: 14, overflow: 'hidden',
                  alignSelf: i === 1 ? 'flex-end' : 'flex-start',
                }}>
                  <img
                    src={`https://picsum.photos/seed/${img.seed}/400/600`}
                    alt={`Story ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9) saturate(0.65)' }}
                  />
                </div>
              ))}
            </div>

            {/* Text */}
            <div className="ms-reveal" style={{ paddingLeft: 16 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
                <div style={{ width: 20, height: 1, background: WARM }}/>
                <span style={{ fontSize: 10, color: TAUPE, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Cormorant Garamond', serif" }}>Our Story</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700, color: DARK, lineHeight: 1.15, marginBottom: 24, wordBreak: 'keep-all', letterSpacing: '-0.02em' }}>
                자연에서 영감 받은<br/>
                <span style={{ fontStyle: 'italic', color: TAUPE }}>일상의 옷</span>
              </h2>
              <p style={{ fontSize: 14, color: TAUPE, lineHeight: 1.9, marginBottom: 16, wordBreak: 'keep-all' }}>
                MELLOW STUDIO는 2019년, 작은 공방에서 시작되었습니다. 우리가 만드는 옷은 트렌드를 쫓지 않습니다.
                오래 입어도 질리지 않는 형태, 몸에 닿는 감촉 하나까지 신중하게 고릅니다.
              </p>
              <p style={{ fontSize: 14, color: TAUPE, lineHeight: 1.9, marginBottom: 36, wordBreak: 'keep-all' }}>
                린넨, 코튼, 울 — 자연 소재만 사용합니다. 매 시즌 국내 장인과 협업해 제작하며,
                소량 생산을 원칙으로 하기 때문에 옷 한 벌 한 벌에 담긴 공정이 있습니다.
              </p>
              <div style={{ display: 'flex', gap: 32 }}>
                {[
                  { num: '5년', label: '브랜드 히스토리' },
                  { num: '100%', label: '천연 소재' },
                  { num: '국내', label: '생산 및 패키지' },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: DARK }}>{s.num}</div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 2, wordBreak: 'keep-all' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div className="ms-reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 10, color: TAUPE, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>Reviews</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, color: DARK, letterSpacing: '-0.02em' }}>
            고객 후기
          </h2>
        </div>
        <div className="ms-review-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {reviews.map((rev, i) => (
            <div key={i} className="ms-reveal" style={{
              background: SOFT, borderRadius: 20, padding: '6px',
              border: '1px solid rgba(26,26,26,0.08)',
            }}>
              <div style={{
                background: BEIGE, borderRadius: 15, padding: '28px 24px',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.8)', height: '100%',
              }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                  {[1,2,3,4,5].map(i => <StarFull key={i}/>)}
                </div>
                <p style={{ fontSize: 13, color: TAUPE, lineHeight: 1.75, marginBottom: 18, wordBreak: 'keep-all', fontStyle: 'italic' }}>
                  "{rev.text}"
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{rev.name}</div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{rev.location}</div>
                  </div>
                  <div style={{
                    fontSize: 10, color: TAUPE, letterSpacing: '0.06em',
                    background: 'rgba(139,115,85,0.08)', borderRadius: 6, padding: '4px 10px',
                    wordBreak: 'keep-all', textAlign: 'right', maxWidth: 120,
                  }}>{rev.product}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '0 48px 80px' }}>
        <div className="ms-reveal" style={{
          maxWidth: 1200, margin: '0 auto',
          background: DARK, borderRadius: 24, overflow: 'hidden',
          display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 320,
        }}>
          <div style={{ padding: '56px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: 10, color: 'rgba(250,250,248,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16, fontFamily: "'Cormorant Garamond', serif" }}>
              Newsletter
            </p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, color: BEIGE, lineHeight: 1.2, marginBottom: 14, wordBreak: 'keep-all', letterSpacing: '-0.02em' }}>
              새 컬렉션 소식을<br/>가장 먼저 받아보세요
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(250,250,248,0.45)', marginBottom: 28, lineHeight: 1.7, wordBreak: 'keep-all' }}>
              구독자에게는 신상품 사전 공개 및 10% 할인 쿠폰을 드립니다.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                style={{
                  flex: 1, padding: '12px 18px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                  color: BEIGE, fontSize: 13, fontFamily: 'inherit',
                  outline: 'none',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(196,168,130,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <button style={{
                background: WARM, color: DARK, border: 'none', borderRadius: 10,
                padding: '12px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'inherit', flexShrink: 0,
                transition: 'transform .3s, box-shadow .3s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}>
                구독하기
              </button>
            </div>
          </div>

          {/* Right image */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <img
              src="https://picsum.photos/seed/melloCTA/600/400"
              alt="Newsletter"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5) saturate(0.5)' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(26,26,26,0.5), transparent)' }}/>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#100F0D', padding: '48px 80px 36px', color: 'rgba(250,250,248,0.4)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: BEIGE, letterSpacing: '0.05em', marginBottom: 4 }}>MELLOW</div>
              <div style={{ fontSize: 9, color: 'rgba(250,250,248,0.3)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 16 }}>studio</div>
              <p style={{ fontSize: 12, lineHeight: 1.8, wordBreak: 'keep-all', maxWidth: 240 }}>
                자연 소재와 절제된 디자인으로 일상을 더 아름답게.
              </p>
            </div>
            {[
              { title: 'Shop', links: ['신상품', '의류', '액세서리', '라이프', '세일'] },
              { title: 'Brand', links: ['브랜드 스토리', '지속가능성', '장인 협업', '룩북'] },
              { title: 'Support', links: ['공지사항', '배송·반품', 'FAQ', '문의하기'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 10, color: 'rgba(250,250,248,0.6)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 18, fontWeight: 700 }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                  {col.links.map(l => (
                    <a key={l} href="#" style={{ fontSize: 13, color: 'rgba(250,250,248,0.35)', textDecoration: 'none', transition: 'color .2s' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(250,250,248,0.75)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(250,250,248,0.35)')}>
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12 }}>© 2024 MELLOW STUDIO. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 20 }}>
              {['개인정보처리방침', '이용약관', 'Instagram', 'Kakao'].map(l => (
                <a key={l} href="#" style={{ fontSize: 12, color: 'rgba(250,250,248,0.3)', textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(250,250,248,0.6)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(250,250,248,0.3)')}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── SCROLL TO TOP ── */}
      <button
        onClick={() => {
          const scroller = (document.querySelector('.main-content') as HTMLElement | null) ?? document.documentElement;
          scroller.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 200,
          width: 48, height: 48, borderRadius: '50%',
          background: DARK, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(26,26,26,0.25)',
          opacity: showTop ? 1 : 0,
          transform: showTop ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)',
          transition: 'opacity 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.35s cubic-bezier(0.16,1,0.3,1)',
          pointerEvents: showTop ? 'auto' : 'none',
        }}
        aria-label="맨 위로"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={BEIGE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
    </div>
  );
}
