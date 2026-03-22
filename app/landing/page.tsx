'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

/* ─────────────────────────── DATA ─────────────────────────── */
const services = [
  {
    id: 'lotto',
    icon: 'lotto',
    title: '로또 번호 추천',
    tag: '구독형',
    tagColor: '#7c3aed',
    price: '월 9,900원~',
    desc: '빅데이터·통계 기반 번호 분석. 실제 운영 중인 서버에서 매주 데이터를 갱신합니다.',
    url: 'lotto.jaengseung-made.com',
    href: '/services/lotto',
    color: '#7c3aed',
  },
  {
    id: 'stock',
    icon: 'stock',
    title: '주식 자동매매',
    tag: '설치형',
    tagColor: '#0ea5e9',
    price: '설치비 49,000원~',
    desc: '텔레그램 연동 자동 매매 프로그램. 조건 설정 후 24시간 무인 운영 가능.',
    url: 'stock.jaengseung-made.com',
    href: '/services/stock',
    color: '#0ea5e9',
  },
  {
    id: 'automation',
    icon: 'automation',
    title: '업무 자동화',
    tag: '외주',
    tagColor: '#10b981',
    price: '5만원~',
    desc: 'RPA·엑셀·이메일 자동화. 반복 업무를 코드로 대체해 드립니다.',
    url: null,
    href: '/services/automation',
    color: '#10b981',
  },
  {
    id: 'prompt',
    icon: 'prompt',
    title: '프롬프트 엔지니어링',
    tag: '컨설팅',
    tagColor: '#f59e0b',
    price: '5만원~',
    desc: '업무 특화 AI 프롬프트 설계. ChatGPT·Claude를 실무에 맞게 최적화.',
    url: null,
    href: '/services/prompt',
    color: '#f59e0b',
  },
  {
    id: 'freelance',
    icon: 'freelance',
    title: '외주 개발',
    tag: '맞춤형',
    tagColor: '#2563eb',
    price: '견적 무료',
    desc: '요구사항 분석부터 납품까지. 계약서 작성 + 소스코드 전체 인도.',
    url: null,
    href: '/freelance',
    color: '#2563eb',
  },
];

const guarantees = [
  {
    icon: 'contract',
    title: '계약서 필수',
    desc: '구두 약속 없이 모든 작업은 서면 계약서로 시작합니다. 범위·가격·납기 모두 명시.',
  },
  {
    icon: 'refund',
    title: '전액 환불 보장',
    desc: '납품 후 7일 내 심각한 하자 발생 시 전액 환불. 조건 계약서에 명기합니다.',
  },
  {
    icon: 'source',
    title: '소스코드 전체 인도',
    desc: '완성된 코드 전체를 GitHub에 이관. 이후 직접 수정·확장 가능합니다.',
  },
  {
    icon: 'penalty',
    title: '납기 지연 패널티',
    desc: '납기 초과 1일당 대금의 1% 자동 차감. 계약서에 명시된 조건입니다.',
  },
];

const faqs = [
  { q: '개발 경험이 없어도 의뢰할 수 있나요?', a: '네. 요구사항을 말씀해 주시면 제가 기술 스펙으로 번역하고, 검토 후 계약서를 작성합니다. 기술 용어를 몰라도 됩니다.' },
  { q: '중간에 요구사항이 바뀌면 어떻게 되나요?', a: '계약서 범위 내 소폭 변경은 무상으로 반영합니다. 범위 초과 시 추가 견적서를 별도 작성합니다.' },
  { q: '납품 후 유지보수는 어떻게 되나요?', a: '1개월 무상 A/S가 기본 포함됩니다. 이후 월 유지보수 계약도 가능합니다.' },
  { q: '구독형 서비스는 언제든 해지 가능한가요?', a: '네. 다음 결제일 전 언제든 해지 가능하며 잔여 기간 환불은 이용약관을 따릅니다.' },
];

/* ─────────────────────────── ICONS ─────────────────────────── */
function ServiceIcon({ type, color }: { type: string; color: string }) {
  const c = color;
  if (type === 'lotto') return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="12" stroke={c} strokeWidth="2" fill={c + '15'} />
      {[7, 14, 21].map((x, i) => <circle key={i} cx={x} cy="14" r="2.5" fill={c} opacity={1 - i * 0.2} />)}
      <circle cx="14" cy="8" r="2" fill={c} opacity="0.6" />
      <circle cx="14" cy="20" r="2" fill={c} opacity="0.6" />
    </svg>
  );
  if (type === 'stock') return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <polyline points="4,20 10,14 14,17 20,8 24,11" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="20,8 24,8 24,12" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="22" x2="24" y2="22" stroke={c} strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
  if (type === 'automation') return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="4" y="8" width="8" height="6" rx="2" stroke={c} strokeWidth="1.8" />
      <rect x="16" y="8" width="8" height="6" rx="2" stroke={c} strokeWidth="1.8" />
      <rect x="10" y="18" width="8" height="6" rx="2" stroke={c} strokeWidth="1.8" />
      <path d="M8 14v3h6M20 14v3h-6" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
  if (type === 'prompt') return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="4" y="6" width="20" height="16" rx="3" stroke={c} strokeWidth="1.8" />
      <line x1="8" y1="11" x2="20" y2="11" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="8" y1="15" x2="16" y2="15" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M17 18l3-3-3-3" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M6 8h16M6 14h10M6 20h13" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <circle cx="22" cy="20" r="4" fill={c + '25'} stroke={c} strokeWidth="1.8" />
      <path d="M20.5 20l1 1 2-2" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GuaranteeIcon({ type }: { type: string }) {
  if (type === 'contract') return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#2563eb" strokeWidth="1.8" fill="#2563eb15" />
      <polyline points="14,2 14,8 20,8" stroke="#2563eb" strokeWidth="1.8" />
      <path d="M8 13l2 2 4-4" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (type === 'refund') return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#10b981" strokeWidth="1.8" fill="#10b98115" />
      <path d="M12 7v5l3 3" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 4l-3 3 3 3" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (type === 'source') return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="#7c3aed15" />
    </svg>
  );
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#f59e0b" strokeWidth="1.8" fill="#f59e0b15" />
      <line x1="12" y1="8" x2="12" y2="12" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1" fill="#f59e0b" />
    </svg>
  );
}

/* ─────────────────────────── COUNTER ─────────────────────────── */
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const step = (now: number) => {
          const pct = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - pct, 3);
          setCount(Math.floor(ease * target));
          if (pct < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function CountUp({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const { count, ref } = useCountUp(target);
  return <div ref={ref} style={{ display: 'inline' }}>{prefix}{count}{suffix}</div>;
}

/* ─────────────────────────── PAGE ─────────────────────────── */
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', color: '#1e293b', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cursor-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes scan-x { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }
        @keyframes glow-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.4); } 50% { box-shadow: 0 0 0 10px rgba(37,99,235,0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .service-card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,0,0,0.10) !important; }
        .service-card { transition: transform 0.35s cubic-bezier(.23,1,.32,1), box-shadow 0.35s, border-color 0.3s; }
        .nav-link { color: #64748b; transition: color 0.2s; cursor: pointer; }
        .nav-link:hover { color: #1e293b; }
        .cta-primary { transition: background 0.2s, transform 0.2s, box-shadow 0.2s; }
        .cta-primary:hover { background: #1d4ed8 !important; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(37,99,235,0.4) !important; }
        .cta-ghost { transition: background 0.2s; }
        .cta-ghost:hover { background: rgba(255,255,255,0.08) !important; }
        .faq-item { transition: border-color 0.2s; }
        .faq-item:hover { border-color: #cbd5e1 !important; }
        .guarantee-card:hover { border-color: #e2e8f0 !important; background: white !important; }
        .guarantee-card { transition: border-color 0.2s, background 0.2s; }
        .proof-url { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(248,250,252,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h4v4H3zM9 4h4v4H9zM3 10h10v2H3z" fill="white" opacity="0.9" />
              </svg>
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', fontFamily: "'Noto Sans KR', sans-serif", letterSpacing: '-0.02em' }}>쟁승메이드</span>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {[
              { label: '서비스', href: '#services' },
              { label: '증거', href: '#proof' },
              { label: '보장', href: '#guarantees' },
              { label: '가격', href: '#pricing' },
              { label: 'FAQ', href: '#faq' },
            ].map(l => (
              <a key={l.label} href={l.href} className="nav-link" style={{ fontSize: 14, fontWeight: 500, textDecoration: 'none', fontFamily: "'Noto Sans KR', sans-serif" }}>
                {l.label}
              </a>
            ))}
          </div>

          <Link href="/freelance" className="cta-primary" style={{
            background: '#2563eb', color: 'white', borderRadius: 24, padding: '9px 22px',
            fontSize: 14, fontWeight: 700, textDecoration: 'none', fontFamily: "'Noto Sans KR', sans-serif",
            boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
          }}>
            무료 견적 받기
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: '#0f172a', padding: '100px 24px 96px', position: 'relative', overflow: 'hidden', minHeight: 600, display: 'flex', alignItems: 'center' }}>
        {/* Grid pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: -100, left: '20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15), transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -80, right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)' }} />
        {/* Scan line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.6) 50%, transparent 100%)', animation: 'scan-x 8s linear infinite' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          {/* Left */}
          <div style={{ animation: 'fadeUp 0.8s ease forwards' }}>
            {/* Status badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 100, padding: '5px 14px', marginBottom: 28 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.8)' }} />
              <span style={{ fontSize: 12, color: '#93c5fd', fontWeight: 600, fontFamily: "'Noto Sans KR', sans-serif" }}>지금 이 순간도 서비스가 돌아가고 있습니다</span>
            </div>

            <h1 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 20, letterSpacing: '-0.03em' }}>
              URL을 드립니다.<br />
              <span style={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>직접 확인</span>하고<br />결정하세요.
            </h1>

            <p style={{ color: '#94a3b8', fontSize: 17, lineHeight: 1.85, fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 36, maxWidth: 500 }}>
              개발자에게 맡겼다가 <span style={{ color: '#fca5a5' }}>연락 두절</span>된 경험 있으신가요?<br />
              7년차 대기업 백엔드 개발자가 계약서부터 소스코드 인도까지<br />직접 책임집니다.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/freelance" className="cta-primary" style={{
                background: '#2563eb', color: 'white', border: 'none', borderRadius: 12,
                padding: '14px 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer',
                fontFamily: "'Noto Sans KR', sans-serif", textDecoration: 'none', display: 'inline-block',
                boxShadow: '0 8px 24px rgba(37,99,235,0.4)', animation: 'glow-pulse 2.5s infinite',
              }}>
                무료 견적 · 24시간 내 회신 →
              </Link>
              <a href="#proof" className="cta-ghost" style={{
                background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif", textDecoration: 'none', display: 'inline-block',
              }}>
                운영 중인 서비스 보기
              </a>
            </div>
          </div>

          {/* Right — URL Proof Card */}
          <div style={{ animation: 'fadeUp 0.9s 0.15s ease both' }}>
            <div style={{ background: '#1e293b', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', animation: 'float 4s ease-in-out infinite' }}>
              {/* Browser chrome */}
              <div style={{ background: '#0f172a', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                {['#ef4444', '#f59e0b', '#10b981'].map((c, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                ))}
                <div style={{ flex: 1, background: '#1e293b', borderRadius: 6, padding: '5px 12px', marginLeft: 8 }}>
                  <span className="proof-url" style={{ fontSize: 11, color: '#64748b' }}>
                    https://lotto.jaengseung-made.com
                    <span style={{ animation: 'cursor-blink 1.2s step-end infinite', color: '#60a5fa' }}>|</span>
                  </span>
                </div>
              </div>
              {/* Content */}
              <div style={{ padding: '20px 20px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ServiceIcon type="lotto" color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'white', fontFamily: "'Noto Sans KR', sans-serif" }}>로또 번호 추천</div>
                    <div style={{ fontSize: 11, color: '#10b981', fontFamily: "'Noto Sans KR', sans-serif" }}>● 운영 중</div>
                  </div>
                </div>
                {/* Mock chart lines */}
                {[['최신 분석', '2024.08.14 완료'], ['이번 주 추천', '3, 7, 14, 28, 35, 42'], ['정확도', '통계 기반 분석']].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 12, color: '#64748b', fontFamily: "'Noto Sans KR', sans-serif" }}>{k}</span>
                    <span style={{ fontSize: 12, color: '#e2e8f0', fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(37,99,235,0.1)', borderRadius: 8, border: '1px solid rgba(37,99,235,0.2)' }}>
                  <span style={{ fontSize: 11, color: '#93c5fd', fontFamily: "'Noto Sans KR', sans-serif" }}>
                    ✓ 이 서비스는 지금 실제로 운영되고 있습니다
                  </span>
                </div>
              </div>
            </div>

            {/* Small badges below card */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
              {['NAS 자체 서버', 'Vercel 배포', 'Supabase DB'].map(b => (
                <div key={b} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '4px 12px' }}>
                  <span style={{ fontSize: 10, color: '#475569', fontFamily: "'Noto Sans KR', sans-serif" }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section style={{ background: '#1e293b', padding: '36px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {[
            { label: '실제 운영 서비스', value: 3, suffix: '개', color: '#60a5fa' },
            { label: '평균 견적 발송', value: 24, suffix: 'h 내', color: '#34d399' },
            { label: '소스코드 인도', value: 100, suffix: '%', color: '#a78bfa' },
            { label: '무상 A/S 기간', value: 1, suffix: '개월', color: '#fbbf24' },
          ].map((s, i) => (
            <div key={s.label} style={{ textAlign: 'center', padding: '0 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: s.color, fontFamily: "'Noto Sans KR', sans-serif", letterSpacing: '-0.02em', lineHeight: 1 }}>
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 13, color: '#64748b', fontFamily: "'Noto Sans KR', sans-serif", marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 12 }}>Services</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#0f172a', fontFamily: "'Noto Sans KR', sans-serif", letterSpacing: '-0.03em', marginBottom: 12 }}>
              제공 서비스 5가지
            </h2>
            <p style={{ color: '#64748b', fontSize: 16, fontFamily: "'Noto Sans KR', sans-serif" }}>
              구독형 솔루션부터 맞춤 외주까지 — 모두 계약서와 함께 시작합니다
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {services.map((svc) => (
              <Link
                key={svc.id}
                href={svc.href}
                className="service-card"
                onMouseEnter={() => setHovered(svc.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: 'white', borderRadius: 16, padding: '28px 24px',
                  border: `1px solid ${hovered === svc.id ? svc.color + '50' : '#e2e8f0'}`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  textDecoration: 'none', display: 'block', position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Color top border */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: svc.color, borderRadius: '16px 16px 0 0', opacity: hovered === svc.id ? 1 : 0, transition: 'opacity 0.3s' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: svc.color + '15', border: `1px solid ${svc.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ServiceIcon type={svc.icon} color={svc.color} />
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: svc.tagColor, background: svc.tagColor + '12', border: `1px solid ${svc.tagColor}25`, borderRadius: 100, padding: '2px 10px', fontFamily: "'Noto Sans KR', sans-serif" }}>
                      {svc.tag}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 8 }}>{svc.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 18 }}>{svc.desc}</p>

                {/* URL 증거 */}
                {svc.url && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '6px 10px', marginBottom: 14 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                    <span className="proof-url" style={{ fontSize: 11, color: '#059669' }}>{svc.url}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: svc.color, fontFamily: "'Noto Sans KR', sans-serif" }}>{svc.price}</span>
                  <span style={{ fontSize: 13, color: svc.color, fontWeight: 600, fontFamily: "'Noto Sans KR', sans-serif" }}>자세히 보기 →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF ── */}
      <section id="proof" style={{ background: '#0f172a', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, color: '#60a5fa', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 12 }}>Proof of Work</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: 'white', fontFamily: "'Noto Sans KR', sans-serif", letterSpacing: '-0.03em', marginBottom: 12 }}>
              말 대신 URL로 증명합니다
            </h2>
            <p style={{ color: '#64748b', fontSize: 16, fontFamily: "'Noto Sans KR', sans-serif" }}>
              실제로 운영 중인 서비스를 직접 확인해 보세요
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { title: '로또 번호 추천', url: 'lotto.jaengseung-made.com', stack: ['Next.js', 'Supabase', 'NAS'], status: 'LIVE', desc: '매주 업데이트되는 빅데이터 기반 번호 분석', color: '#7c3aed' },
              { title: '주식 자동매매', url: 'stock.jaengseung-made.com', stack: ['Python', 'Telegram API', 'NAS'], status: 'LIVE', desc: '24시간 무인 운영 중인 텔레그램 봇 시스템', color: '#0ea5e9' },
              { title: 'AI 사주 분석', url: 'saju.jaengseung-made.com', stack: ['Gemini API', 'Next.js', 'DB'], status: 'LIVE', desc: 'Gemini 2.5 Pro 기반 사주 해석 서비스', color: '#f59e0b' },
            ].map((p) => (
              <div key={p.title} style={{ background: '#1e293b', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                {/* Browser bar */}
                <div style={{ background: '#0f172a', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {['#ef4444', '#f59e0b', '#10b981'].map((c, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
                  <div style={{ flex: 1, background: '#1e293b', borderRadius: 4, padding: '4px 10px', marginLeft: 6 }}>
                    <span className="proof-url" style={{ fontSize: 10, color: '#475569' }}>https://{p.url}</span>
                  </div>
                </div>
                <div style={{ padding: '18px 18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'white', fontFamily: "'Noto Sans KR', sans-serif" }}>{p.title}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 100, padding: '2px 8px' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981' }} />
                      <span style={{ fontSize: 9, color: '#10b981', fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700 }}>{p.status}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#64748b', fontFamily: "'Noto Sans KR', sans-serif", lineHeight: 1.65, marginBottom: 14 }}>{p.desc}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {p.stack.map(s => (
                      <span key={s} style={{ fontSize: 10, color: p.color, background: p.color + '12', border: `1px solid ${p.color}25`, borderRadius: 100, padding: '2px 8px', fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Career Timeline */}
          <div style={{ marginTop: 48, background: '#1e293b', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', padding: '32px 36px' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 24 }}>개발자 이력</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {[
                { year: '2018', title: '대기업 입사', desc: '백엔드 개발 시작', color: '#3b82f6' },
                { year: '2021', title: '시니어 개발자', desc: 'MSA 아키텍처 설계', color: '#7c3aed' },
                { year: '2023', title: '부업 서비스 시작', desc: '첫 SaaS 론칭', color: '#0ea5e9' },
                { year: '2024', title: '3개 서비스 운영', desc: '쟁승메이드 풀가동', color: '#10b981' },
              ].map((t) => (
                <div key={t.year} style={{ position: 'relative', paddingLeft: 16, borderLeft: `2px solid ${t.color}40` }}>
                  <div style={{ position: 'absolute', left: -5, top: 6, width: 8, height: 8, borderRadius: '50%', background: t.color }} />
                  <div style={{ fontSize: 11, color: t.color, fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, marginBottom: 4 }}>{t.year}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'white', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 2 }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b', fontFamily: "'Noto Sans KR', sans-serif" }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GUARANTEES ── */}
      <section id="guarantees" style={{ padding: '96px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 12 }}>Guarantees</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#0f172a', fontFamily: "'Noto Sans KR', sans-serif", letterSpacing: '-0.03em', marginBottom: 12 }}>
              4가지 보장
            </h2>
            <p style={{ color: '#64748b', fontSize: 16, fontFamily: "'Noto Sans KR', sans-serif" }}>
              모두 계약서에 명기됩니다 — 구두 약속이 아닙니다
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {guarantees.map((g) => (
              <div key={g.icon} className="guarantee-card" style={{ background: '#fafafa', borderRadius: 16, padding: '28px 28px', border: '1px solid #e2e8f0', display: 'flex', gap: 18 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <GuaranteeIcon type={g.icon} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 8 }}>{g.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, fontFamily: "'Noto Sans KR', sans-serif" }}>{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '96px 24px', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 12 }}>Pricing</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#0f172a', fontFamily: "'Noto Sans KR', sans-serif", letterSpacing: '-0.03em', marginBottom: 12 }}>
              투명한 가격표
            </h2>
            <p style={{ color: '#64748b', fontSize: 16, fontFamily: "'Noto Sans KR', sans-serif" }}>숨겨진 요금 없이 처음부터 명확하게</p>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 140px', background: '#f8fafc', padding: '12px 24px', borderBottom: '1px solid #e2e8f0' }}>
              {['서비스', '플랜', '가격', ''].map((h, i) => (
                <div key={i} style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', fontFamily: "'Noto Sans KR', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {[
              { svc: '홈페이지 제작', plan: '스타터', price: '20만원~', cta: '상담 신청' },
              { svc: '', plan: '비즈니스', price: '100만원~', cta: '상담 신청' },
              { svc: '업무 자동화', plan: '단순 자동화', price: '5만원~', cta: '견적 받기' },
              { svc: '', plan: '자동화 심화', price: '15만원~', cta: '견적 받기' },
              { svc: '주식 자동매매', plan: '스타터', price: '설치 49,000 + 월 9,900원', cta: '신청하기' },
              { svc: '', plan: '프로', price: '설치 99,000 + 월 29,000원', cta: '신청하기' },
              { svc: '로또 추천', plan: '기본', price: '월 9,900원', cta: '구독하기' },
              { svc: '프롬프트', plan: '단건 설계', price: '5만원~', cta: '문의하기' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 140px', padding: '14px 24px', borderBottom: i < 7 ? '1px solid #f1f5f9' : 'none', alignItems: 'center', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                <div style={{ fontSize: 14, fontWeight: row.svc ? 700 : 400, color: row.svc ? '#0f172a' : 'transparent', fontFamily: "'Noto Sans KR', sans-serif" }}>
                  {row.svc || '-'}
                </div>
                <div style={{ fontSize: 14, color: '#475569', fontFamily: "'Noto Sans KR', sans-serif" }}>{row.plan}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#2563eb', fontFamily: "'Noto Sans KR', sans-serif" }}>{row.price}</div>
                <Link href="/freelance" style={{ fontSize: 12, color: '#2563eb', fontWeight: 700, fontFamily: "'Noto Sans KR', sans-serif", background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '5px 12px', textDecoration: 'none', textAlign: 'center', display: 'inline-block' }}>
                  {row.cta}
                </Link>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#94a3b8', fontFamily: "'Noto Sans KR', sans-serif" }}>
            * 모든 가격은 VAT 별도 · 복잡한 요구사항은 무료 상담 후 정확한 견적 제공
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: '96px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 12 }}>FAQ</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#0f172a', fontFamily: "'Noto Sans KR', sans-serif", letterSpacing: '-0.03em' }}>
              자주 묻는 질문
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item" style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', textAlign: 'left', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', fontFamily: "'Noto Sans KR', sans-serif", lineHeight: 1.5 }}>{faq.q}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', flexShrink: 0 }}>
                    <path d="M4 6l4 4 4-4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 18px', animation: 'fadeIn 0.2s ease' }}>
                    <div style={{ height: 1, background: '#f1f5f9', marginBottom: 14 }} />
                    <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8, fontFamily: "'Noto Sans KR', sans-serif" }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 50%, #0c1445 100%)', padding: '96px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background dots */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.07 }}>
          <pattern id="cta-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="16" cy="16" r="1.5" fill="#60a5fa" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#cta-dots)" />
        </svg>

        <div style={{ maxWidth: 620, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.25)', borderRadius: 100, padding: '5px 14px', marginBottom: 28 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.8)' }} />
            <span style={{ fontSize: 12, color: '#93c5fd', fontWeight: 600, fontFamily: "'Noto Sans KR', sans-serif" }}>지금 문의하면 24시간 내 견적 발송</span>
          </div>

          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: 'white', fontFamily: "'Noto Sans KR', sans-serif", lineHeight: 1.25, marginBottom: 18, letterSpacing: '-0.03em' }}>
            개발사 연락 두절로<br />
            손해 본 경험 있으신가요?
          </h2>
          <p style={{ color: '#93c5fd', fontSize: 16, lineHeight: 1.8, fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 36 }}>
            여기선 계약서부터 시작합니다.<br />무료 상담으로 지금 바로 확인해 보세요.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/freelance" className="cta-primary" style={{
              background: '#2563eb', color: 'white', borderRadius: 12,
              padding: '15px 36px', fontSize: 16, fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 8px 28px rgba(37,99,235,0.45)', animation: 'glow-pulse 2.5s infinite',
              display: 'inline-block', fontFamily: "'Noto Sans KR', sans-serif",
            }}>
              무료 견적 신청하기 →
            </Link>
            <a href="mailto:bgg8988@gmail.com" className="cta-ghost" style={{
              background: 'rgba(255,255,255,0.06)', color: '#93c5fd',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12,
              padding: '15px 28px', fontSize: 15, fontWeight: 600, textDecoration: 'none',
              display: 'inline-block', fontFamily: "'Noto Sans KR', sans-serif",
            }}>
              이메일로 문의
            </a>
          </div>

          <p style={{ marginTop: 24, fontSize: 13, color: '#475569', fontFamily: "'Noto Sans KR', sans-serif" }}>
            bgg8988@gmail.com · 010-3907-1392
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#020617', padding: '36px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'white', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 4 }}>쟁승메이드</div>
            <div style={{ fontSize: 12, color: '#334155', fontFamily: "'Noto Sans KR', sans-serif" }}>© 2024 JaengseungMade. All rights reserved.</div>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { label: '서비스', href: '#services' },
              { label: '로또', href: '/services/lotto' },
              { label: '주식', href: '/services/stock' },
              { label: '자동화', href: '/services/automation' },
              { label: '외주', href: '/freelance' },
            ].map(l => (
              <Link key={l.label} href={l.href} style={{ fontSize: 13, color: '#334155', textDecoration: 'none', fontFamily: "'Noto Sans KR', sans-serif" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
