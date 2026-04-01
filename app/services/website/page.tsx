'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import ContactModal from '../../components/ContactModal';

const samples = [
  {
    type: 'corporate',
    title: '기업 홈페이지',
    subtitle: '테크솔루션㈜',
    desc: '"홈페이지가 없어서 B2B 영업 때마다 명함만 건넸다"는 고민을 해결한 기업 브랜드 사이트',
    gradient: 'linear-gradient(135deg, #0a192f 0%, #112240 50%, #1a3a6c 100%)',
    accent: '#4fc3f7',
    tags: ['기업', 'B2B', '신뢰'],
    icon: '🏢',
  },
  {
    type: 'bakery',
    title: '베이커리 홈페이지',
    subtitle: '르 쁘띠 포르',
    desc: '"인스타 팔로워는 많은데 실제 방문 예약이 없다"는 F&B 매장의 전환율 문제를 해결한 사이트',
    gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 50%, #d97706 100%)',
    accent: '#fbbf24',
    tags: ['F&B', '로컬', '예약'],
    icon: '🥐',
  },
  {
    type: 'portfolio',
    title: '개인 포트폴리오',
    subtitle: 'Kim Jisu',
    desc: '"링크드인에 PDF 올리면 아무도 안 보더라"는 문제를 해결한 채용·수주 전환형 포트폴리오',
    gradient: 'linear-gradient(135deg, #000000 0%, #0d0d0d 50%, #001a00 100%)',
    accent: '#00ff88',
    tags: ['크리에이터', '디자이너', '수주'],
    icon: '✦',
  },
  {
    type: 'dashboard',
    title: '관리자 대시보드',
    subtitle: 'DataFlow SaaS',
    desc: '"엑셀로 수기 집계하다가 오류가 나서 야근"을 없애는 실시간 데이터 대시보드',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f2a3a 100%)',
    accent: '#38bdf8',
    tags: ['SaaS', '자동화', '관리'],
    icon: '📊',
  },
  {
    type: 'game',
    title: '게임 매칭 시스템',
    subtitle: 'NEXUS ARENA',
    desc: '"디스코드에서 수동으로 팀 짜다가 싸움 났다"는 커뮤니티의 매칭·랭킹 자동화 플랫폼',
    gradient: 'linear-gradient(135deg, #000000 0%, #0a0a1a 50%, #0d0029 100%)',
    accent: '#a855f7',
    tags: ['게임', '커뮤니티', '자동화'],
    icon: '⚡',
  },
  {
    type: 'interior',
    title: '인테리어 업체 소개',
    subtitle: 'AURUM Interior',
    desc: '"포트폴리오 사진을 카톡으로만 보내다가 고급 고객을 놓쳤다"는 문제를 해결한 브랜드 사이트',
    gradient: 'linear-gradient(135deg, #2C1810 0%, #4A3728 50%, #6B4E37 100%)',
    accent: '#D4A853',
    tags: ['인테리어', '포트폴리오', '고급'],
    icon: '◈',
  },
  {
    type: 'reading',
    title: '독서 기록 노트',
    subtitle: '나의 독서 기록',
    desc: '읽은 책과 감상을 아름답게 기록하는 나만의 독서 저널 — 이런 것도 만들 수 있습니다',
    gradient: 'linear-gradient(135deg, #0C0B09 0%, #1A1710 50%, #2A2218 100%)',
    accent: '#D4A853',
    tags: ['라이프', '독서', '기록'],
    icon: '◻',
  },
  {
    type: 'shopping',
    title: '개인 쇼핑몰',
    subtitle: 'MELLOW STUDIO',
    desc: '"카페24 기본 테마가 너무 흔해서 브랜드가 안 살아난다"는 고민을 해결한 커스텀 쇼핑몰',
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
  {
    q: '앱(모바일 앱)이나 쇼핑몰도 개발 가능한가요?',
    a: '네. iOS/Android 앱(React Native), 모바일 웹앱, 결제 연동 쇼핑몰, 회원/관리자 시스템 등 모두 개발 가능합니다. 프리미엄 플랜 이상이거나 규모에 따라 별도 견적으로 진행됩니다. 먼저 어떤 기능이 필요한지 상담해 주세요.',
  },
  {
    q: '계약금은 어떻게 되나요? 중간에 취소하면 어떻게 되나요?',
    a: '계약서 체결 후 착수금 30%를 먼저 입금받고 개발을 시작합니다. 납품 전 취소 시 완성 비율에 따라 정산하며, 착수 전 전액 환불됩니다. 모든 조건은 계약서에 명시됩니다.',
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

function SampleMiniPreview({ type }: { type: string }) {
  const W = 700, H = 350;
  const inner = (content: React.ReactNode, bg: string) => (
    <div style={{ height: 175, overflow: 'hidden', position: 'relative', background: bg, borderRadius: '20px 20px 0 0' }}>
      <div style={{ width: W, height: H, transform: 'scale(0.5)', transformOrigin: 'top left', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        {content}
      </div>
    </div>
  );

  switch (type) {
    case 'corporate':
      return inner(
        <div style={{ background: '#fff', width: '100%', height: '100%', fontFamily: 'system-ui' }}>
          <div style={{ height: 50, background: '#0a192f', display: 'flex', alignItems: 'center', padding: '0 28px', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#4fc3f7', letterSpacing: '0.1em' }}>TECHSOLUTION</div>
            <div style={{ display: 'flex', gap: 22 }}>
              {['서비스','솔루션','고객사','연락처'].map(t => <span key={t} style={{ fontSize: 11, color: '#475569' }}>{t}</span>)}
            </div>
            <div style={{ fontSize: 11, background: '#1d4ed8', color: '#fff', padding: '7px 18px', borderRadius: 4, fontWeight: 700 }}>상담 신청</div>
          </div>
          <div style={{ padding: '36px 32px', backgroundImage: 'linear-gradient(rgba(29,78,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(29,78,216,0.04) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            <div style={{ fontSize: 10, color: '#1d4ed8', letterSpacing: '0.18em', marginBottom: 12, fontWeight: 700 }}>ENTERPRISE IT SOLUTIONS</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#0a192f', lineHeight: 1.1, marginBottom: 14 }}>기업 IT 인프라,<br/>처음부터 끝까지</div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 22, lineHeight: 1.6 }}>15년 경험의 엔터프라이즈 IT 전문 기업.<br/>클라우드·보안·DX 통합 솔루션을 제공합니다.</div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
              <div style={{ background: '#1d4ed8', color: '#fff', fontSize: 12, padding: '10px 22px', borderRadius: 6, fontWeight: 700 }}>무료 상담 신청</div>
              <div style={{ border: '1px solid #cbd5e1', color: '#475569', fontSize: 12, padding: '10px 22px', borderRadius: 6 }}>서비스 소개서</div>
            </div>
            <div style={{ display: 'flex', gap: 36 }}>
              {[['15+','년 업력'],['340+','완료 프로젝트'],['180+','기업 고객'],['99.9%','가동률']].map(([n,l]) => (
                <div key={l}><div style={{ fontSize: 22, fontWeight: 800, color: '#0a192f', letterSpacing: '-0.02em' }}>{n}</div><div style={{ fontSize: 9, color: '#94a3b8', marginTop: 3 }}>{l}</div></div>
              ))}
            </div>
          </div>
        </div>, '#fff'
      );

    case 'bakery':
      return inner(
        <div style={{ background: '#fffbf5', width: '100%', height: '100%', fontFamily: 'Georgia, serif' }}>
          <div style={{ height: 52, background: 'rgba(255,251,245,0.96)', borderBottom: '1px solid #fde8c8', display: 'flex', alignItems: 'center', padding: '0 28px', justifyContent: 'space-between' }}>
            <div><div style={{ fontSize: 18, fontStyle: 'italic', color: '#78350f', fontWeight: 700 }}>Le Petit Fort</div><div style={{ fontSize: 8, color: '#b45309', letterSpacing: '0.2em' }}>ARTISAN BOULANGERIE</div></div>
            <div style={{ display: 'flex', gap: 20 }}>
              {['메뉴','스토리','예약'].map(t => <span key={t} style={{ fontSize: 11, color: '#92400e', fontFamily: 'system-ui' }}>{t}</span>)}
            </div>
            <div style={{ fontSize: 11, background: '#b45309', color: '#fff', padding: '7px 18px', borderRadius: 100, fontFamily: 'system-ui', fontWeight: 700 }}>방문 예약</div>
          </div>
          <div style={{ padding: '28px 32px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, color: '#b45309', letterSpacing: '0.2em', marginBottom: 12, fontFamily: 'system-ui', fontWeight: 600 }}>Since 2018 · Paris Recipe</div>
              <div style={{ fontSize: 38, fontWeight: 700, color: '#1c1008', lineHeight: 1.05, marginBottom: 14 }}>매일 아침<br/><em>구워내는</em><br/>정직한 빵</div>
              <div style={{ fontSize: 11, color: '#92400e', marginBottom: 18, lineHeight: 1.7, fontFamily: 'system-ui' }}>프랑스산 에슈레 버터와 천연 발효종만으로<br/>만드는 정직한 아르티장 베이커리.</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ background: '#b45309', color: '#fff', fontSize: 11, padding: '9px 20px', borderRadius: 100, fontFamily: 'system-ui', fontWeight: 700 }}>오늘의 빵 보기</div>
                <div style={{ border: '1px solid #d97706', color: '#92400e', fontSize: 11, padding: '9px 20px', borderRadius: 100, fontFamily: 'system-ui' }}>매장 안내</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[{n:'버터 크루아상',p:'3,200',c:'#d97706'},{n:'소금빵',p:'2,800',c:'#b45309'},{n:'딸기 케이크',p:'7,500',c:'#be185d'},{n:'캄파뉴',p:'8,900',c:'#065f46'}].map(item => (
                <div key={item.n} style={{ background: '#fff8f0', borderRadius: 10, padding: 10, border: '1px solid #fde8c8' }}>
                  <div style={{ height: 38, background: 'linear-gradient(135deg, #fde68a, #fbbf24)', borderRadius: 6, marginBottom: 6 }} />
                  <div style={{ fontSize: 9, color: '#1c1008', fontFamily: 'system-ui', fontWeight: 600 }}>{item.n}</div>
                  <div style={{ fontSize: 10, color: item.c, fontFamily: 'system-ui', fontWeight: 700 }}>₩{item.p}</div>
                </div>
              ))}
            </div>
          </div>
        </div>, '#fffbf5'
      );

    case 'portfolio':
      return inner(
        <div style={{ background: '#000', width: '100%', height: '100%' }}>
          <div style={{ position: 'absolute', top: -40, left: '25%', width: 320, height: 320, background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ height: 50, background: 'rgba(0,0,0,0.95)', borderBottom: '1px solid rgba(0,255,136,0.1)', display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: '#00ff88' }}>KJ<span style={{ color: 'rgba(0,255,136,0.3)' }}>_</span></div>
            <div style={{ display: 'flex', gap: 24 }}>
              {['About','Work','Skills','Contact'].map(t => <span key={t} style={{ fontFamily: 'system-ui', fontSize: 10, color: '#374151', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t}</span>)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88' }} />
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#00ff88' }}>Available</span>
              <div style={{ marginLeft: 8, border: '1px solid #00ff88', color: '#00ff88', fontSize: 9, padding: '5px 12px', borderRadius: 3, fontFamily: 'monospace', fontWeight: 700 }}>HIRE ME</div>
            </div>
          </div>
          <div style={{ position: 'absolute', inset: 0, top: 50, backgroundImage: 'linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
          <div style={{ padding: '38px 32px', position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#00ff88', letterSpacing: '0.15em', marginBottom: 16, border: '1px solid rgba(0,255,136,0.2)', display: 'inline-block', padding: '3px 10px' }}>FULL-STACK DEVELOPER</div>
              <div style={{ fontSize: 56, fontWeight: 900, color: '#fff', lineHeight: 0.9, letterSpacing: '-0.03em', marginBottom: 18, fontFamily: 'system-ui' }}>Kim<br/><span style={{ color: '#00ff88' }}>Jisu</span></div>
              <div style={{ fontSize: 11, color: '#4b5563', lineHeight: 1.7, marginBottom: 22, fontFamily: 'system-ui' }}>React · Next.js · TypeScript · Node.js<br/>디자인과 코드의 경계를 탐험합니다.</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ background: '#00ff88', color: '#000', fontSize: 11, padding: '9px 22px', borderRadius: 4, fontWeight: 800, fontFamily: 'monospace' }}>VIEW WORK</div>
                <div style={{ border: '1px solid rgba(0,255,136,0.3)', color: '#00ff88', fontSize: 11, padding: '9px 22px', borderRadius: 4, fontFamily: 'monospace' }}>CONTACT</div>
              </div>
            </div>
            <div style={{ width: 130, height: 160, background: 'linear-gradient(135deg, #001a0d, #003322)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid rgba(0,255,136,0.3)', background: 'rgba(0,255,136,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 26, color: '#00ff88', fontFamily: 'monospace', fontWeight: 700 }}>KJ</span>
              </div>
            </div>
          </div>
        </div>, '#000'
      );

    case 'dashboard':
      return inner(
        <div style={{ background: '#0f172a', width: '100%', height: '100%', display: 'flex', fontFamily: 'system-ui' }}>
          <div style={{ width: 140, background: '#020617', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '20px 14px' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#38bdf8', marginBottom: 24, letterSpacing: '-0.02em' }}>DataFlow</div>
            {['대시보드','분석','리포트','사용자','설정'].map((item, i) => (
              <div key={item} style={{ fontSize: 10, color: i === 0 ? '#38bdf8' : '#475569', padding: '8px 10px', borderRadius: 6, marginBottom: 4, background: i === 0 ? 'rgba(56,189,248,0.1)' : 'transparent' }}>{item}</div>
            ))}
          </div>
          <div style={{ flex: 1, padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>실시간 현황</div>
              <div style={{ fontSize: 10, color: '#475569', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', padding: '4px 12px', borderRadius: 6 }}>이번 달</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
              {[{l:'총 매출',v:'₩48.2M',c:'#38bdf8',u:true},{l:'신규 사용자',v:'1,247',c:'#34d399',u:true},{l:'전환율',v:'12.4%',c:'#a78bfa',u:false}].map(s => (
                <div key={s.l} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontSize: 8, color: '#475569', marginBottom: 6 }}>{s.l}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.c, letterSpacing: '-0.02em' }}>{s.v}</div>
                  <div style={{ fontSize: 8, color: s.u ? '#34d399' : '#f87171', marginTop: 4 }}>{s.u ? '↑ +8.3%' : '↓ -1.2%'}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: 14, height: 110 }}>
              <div style={{ fontSize: 9, color: '#475569', marginBottom: 10 }}>월간 매출 추이</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 72 }}>
                {[40,55,35,65,80,60,90,75,85,95,70,100].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 11 ? '#38bdf8' : 'rgba(56,189,248,0.22)', borderRadius: '2px 2px 0 0' }} />
                ))}
              </div>
            </div>
          </div>
        </div>, '#0f172a'
      );

    case 'game':
      return inner(
        <div style={{ background: '#000', width: '100%', height: '100%' }}>
          <div style={{ position: 'absolute', top: -60, left: '30%', width: 340, height: 340, background: 'radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: -20, right: '10%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ height: 50, background: 'rgba(0,0,0,0.9)', borderBottom: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', padding: '0 28px', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 900, color: '#06b6d4', letterSpacing: '0.15em' }}>NEXUS<span style={{ color: '#a855f7' }}>ARENA</span></div>
            <div style={{ display: 'flex', gap: 20 }}>
              {['랭킹','매칭','챔피언','스토어'].map(t => <span key={t} style={{ fontFamily: 'system-ui', fontSize: 10, color: '#374151', letterSpacing: '0.08em' }}>{t}</span>)}
            </div>
            <div style={{ background: 'linear-gradient(90deg, #06b6d4, #a855f7)', color: '#000', fontSize: 10, padding: '7px 18px', borderRadius: 3, fontWeight: 800, fontFamily: 'monospace' }}>PLAY NOW</div>
          </div>
          <div style={{ padding: '32px 32px', position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#06b6d4', letterSpacing: '0.2em', marginBottom: 14 }}>SEASON 7 · COMPETITIVE</div>
              <div style={{ fontSize: 50, fontWeight: 900, color: '#fff', lineHeight: 0.88, letterSpacing: '-0.03em', marginBottom: 18, fontFamily: 'system-ui' }}>NEXUS<br/><span style={{ background: 'linear-gradient(90deg, #06b6d4, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ARENA</span></div>
              <div style={{ fontSize: 10, color: '#4b5563', lineHeight: 1.65, marginBottom: 22, fontFamily: 'system-ui' }}>실시간 매칭 · 랭크 시스템 · 글로벌 토너먼트<br/>지금 바로 전장에 참전하세요.</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ background: 'linear-gradient(90deg, #06b6d4, #a855f7)', color: '#fff', fontSize: 11, padding: '10px 22px', borderRadius: 4, fontWeight: 800, fontFamily: 'monospace' }}>PLAY NOW</div>
                <div style={{ border: '1px solid rgba(6,182,212,0.4)', color: '#06b6d4', fontSize: 11, padding: '10px 22px', borderRadius: 4, fontFamily: 'monospace' }}>랭킹 보기</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[{name:'VIPER',role:'Assassin',c:'#06b6d4'},{name:'NOVA',role:'Mage',c:'#a855f7'},{name:'IRON',role:'Tank',c:'#94a3b8'},{name:'KIRA',role:'Support',c:'#ec4899'}].map(ch => (
                <div key={ch.name} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${ch.c}30`, borderRadius: 8, padding: 10 }}>
                  <div style={{ height: 34, background: `linear-gradient(135deg, ${ch.c}20, ${ch.c}05)`, borderRadius: 4, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${ch.c}30`, border: `1px solid ${ch.c}60` }} />
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: ch.c, fontWeight: 700 }}>{ch.name}</div>
                  <div style={{ fontSize: 8, color: '#374151', fontFamily: 'system-ui' }}>{ch.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>, '#000'
      );

    case 'interior':
      return inner(
        <div style={{ background: '#faf8f4', width: '100%', height: '100%' }}>
          <div style={{ height: 50, background: '#2C1810', display: 'flex', alignItems: 'center', padding: '0 28px', justifyContent: 'space-between' }}>
            <div><div style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#D4A853', fontWeight: 700, letterSpacing: '0.12em' }}>AURUM</div><div style={{ fontSize: 7, color: '#6B4E37', letterSpacing: '0.25em' }}>INTERIOR DESIGN</div></div>
            <div style={{ display: 'flex', gap: 18 }}>
              {['포트폴리오','서비스','견적 문의'].map(t => <span key={t} style={{ fontSize: 9, color: '#9a8070', fontFamily: 'system-ui' }}>{t}</span>)}
            </div>
            <div style={{ border: '1px solid #D4A853', color: '#D4A853', fontSize: 9, padding: '6px 14px', fontFamily: 'system-ui', letterSpacing: '0.08em' }}>CONTACT</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 300 }}>
            <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#2C1810' }}>
              <div style={{ fontSize: 9, color: '#D4A853', letterSpacing: '0.25em', marginBottom: 14, fontFamily: 'system-ui', textTransform: 'uppercase' }}>Premium Interior Design</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 34, color: '#faf8f4', lineHeight: 1.1, marginBottom: 18 }}>공간이<br/><em>이야기가</em><br/>되는 순간</div>
              <div style={{ fontSize: 10, color: '#9a8070', lineHeight: 1.7, fontFamily: 'system-ui', marginBottom: 22 }}>20년 경험의 인테리어 전문가가<br/>당신만의 공간을 완성합니다.</div>
              <div style={{ display: 'inline-flex' }}><div style={{ background: '#D4A853', color: '#2C1810', fontSize: 10, padding: '10px 22px', fontFamily: 'system-ui', fontWeight: 700 }}>포트폴리오 보기</div></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 3 }}>
              {['linear-gradient(135deg, #c9b99a, #a8927a)','linear-gradient(135deg, #8B7355, #6B5A47)','linear-gradient(135deg, #D4C5A9, #B8A88A)','linear-gradient(135deg, #7C6555, #5C4A3A)'].map((bg, i) => (
                <div key={i} style={{ background: bg }}><div style={{ width: '100%', height: '100%', background: 'rgba(44,24,16,0.08)' }} /></div>
              ))}
            </div>
          </div>
        </div>, '#faf8f4'
      );

    case 'reading':
      return inner(
        <div style={{ background: '#0C0B09', width: '100%', height: '100%' }}>
          <div style={{ height: 46, background: '#0C0B09', borderBottom: '1px solid rgba(212,168,83,0.1)', display: 'flex', alignItems: 'center', padding: '0 28px', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontStyle: 'italic', color: '#D4A853', fontWeight: 600 }}>나의 독서 기록</div>
            <div style={{ display: 'flex', gap: 18 }}>
              {['서재','월별 기록','통계'].map(t => <span key={t} style={{ fontSize: 9, color: '#5c5040', fontFamily: 'system-ui' }}>{t}</span>)}
            </div>
          </div>
          <div style={{ padding: '32px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, color: '#D4A853', letterSpacing: '0.2em', marginBottom: 14, fontFamily: 'system-ui', textTransform: 'uppercase' }}>My Reading Journal</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: '#faf8f4', lineHeight: 1.05, marginBottom: 16 }}>읽은 책들이<br/><em style={{ color: '#D4A853' }}>별처럼</em><br/>빛나는 공간</div>
              <div style={{ fontSize: 10, color: '#5c5040', lineHeight: 1.7, fontFamily: 'system-ui', marginBottom: 22 }}>독서 기록을 아름답게.<br/>감상과 인용구를 나만의 서재에 담아보세요.</div>
              <div style={{ display: 'inline-flex', background: '#D4A853', color: '#0C0B09', fontSize: 10, padding: '9px 22px', fontFamily: 'system-ui', fontWeight: 700 }}>기록 시작하기</div>
              <div style={{ display: 'flex', gap: 24, marginTop: 22 }}>
                {[['47','완독'],['1,240','페이지'],['12','이번 달']].map(([n,l]) => (
                  <div key={l}><div style={{ fontSize: 20, fontWeight: 800, color: '#D4A853', fontFamily: 'Georgia, serif' }}>{n}</div><div style={{ fontSize: 8, color: '#5c5040', fontFamily: 'system-ui', marginTop: 2 }}>{l}</div></div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', justifyContent: 'center' }}>
              {[{h:130,bg:'linear-gradient(180deg,#1e3a5f,#0a1628)',sp:'#2563eb'},{h:152,bg:'linear-gradient(180deg,#2C1810,#1a0e0a)',sp:'#D4A853'},{h:118,bg:'linear-gradient(180deg,#1a1a1a,#0d0d0d)',sp:'#6b7280'},{h:142,bg:'linear-gradient(180deg,#1e1b4b,#0f0d2e)',sp:'#7c3aed'},{h:120,bg:'linear-gradient(180deg,#064e3b,#022c22)',sp:'#10b981'}].map((b, i) => (
                <div key={i} style={{ width: 38, height: b.h, background: b.bg, borderRadius: '3px 3px 0 0', borderLeft: `3px solid ${b.sp}40`, boxShadow: '2px 0 8px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 1, height: '80%', background: `${b.sp}30` }} />
                </div>
              ))}
            </div>
          </div>
        </div>, '#0C0B09'
      );

    case 'shopping':
      return inner(
        <div style={{ background: '#F4F2EF', width: '100%', height: '100%' }}>
          <div style={{ height: 52, background: '#F4F2EF', borderBottom: '1px solid #E0DDD8', display: 'flex', alignItems: 'center', padding: '0 28px', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#0C0B09', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'system-ui' }}>MELLOW<span style={{ fontWeight: 300 }}> STUDIO</span></div>
            <div style={{ display: 'flex', gap: 20 }}>
              {['NEW','OUTER','TOP','BOTTOM'].map(t => <span key={t} style={{ fontSize: 9, color: '#7C7870', fontFamily: 'system-ui', letterSpacing: '0.1em' }}>{t}</span>)}
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#0C0B09', fontFamily: 'system-ui' }}><span>🔍</span><span>🛍 2</span></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 298 }}>
            <div style={{ background: 'linear-gradient(135deg, #2A2018, #4A3C2C)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: 120, height: 200, background: 'linear-gradient(180deg, #c8b89a, #9a8a72)', borderRadius: 4, boxShadow: '16px 16px 40px rgba(0,0,0,0.35)' }} />
              <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
                <div style={{ fontSize: 9, color: 'rgba(244,242,239,0.5)', letterSpacing: '0.2em', fontFamily: 'system-ui' }}>NEW ARRIVAL</div>
                <div style={{ fontSize: 17, fontWeight: 900, color: '#F4F2EF', fontFamily: 'system-ui', letterSpacing: '-0.01em' }}>SS 2025</div>
              </div>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 9, color: '#7C7870', letterSpacing: '0.2em', marginBottom: 10, fontFamily: 'system-ui' }}>COLLECTION</div>
                <div style={{ fontSize: 30, fontWeight: 900, color: '#0C0B09', lineHeight: 1.05, fontFamily: 'system-ui', letterSpacing: '-0.02em', marginBottom: 12 }}>Quiet<br/>Luxury</div>
                <div style={{ fontSize: 10, color: '#7C7870', lineHeight: 1.65, fontFamily: 'system-ui', marginBottom: 18 }}>소음 없이 존재하는 옷.<br/>절제된 아름다움을 입으세요.</div>
                <div style={{ display: 'inline-flex', background: '#0C0B09', color: '#F4F2EF', fontSize: 9, padding: '9px 20px', letterSpacing: '0.15em', fontFamily: 'system-ui', fontWeight: 700 }}>SHOP NOW</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[['#c8b89a','₩328K'],['#8a7860','₩498K'],['#d4c5a9','₩218K']].map(([bg, p], i) => (
                  <div key={i} style={{ borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: 52, background: `linear-gradient(160deg, ${bg}, rgba(0,0,0,0.08))` }} />
                    <div style={{ fontSize: 8, color: '#7C7870', fontFamily: 'system-ui', paddingTop: 4 }}>{p}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>, '#F4F2EF'
      );

    default:
      return <div style={{ height: 175, background: '#0a0f1e', borderRadius: '20px 20px 0 0' }} />;
  }
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

        /* 모바일 반응형 */
        @media (max-width: 640px) {
          .ws-portfolio-grid { grid-template-columns: 1fr !important; }
          .ws-process-steps { flex-direction: column !important; align-items: stretch !important; }
          .ws-process-divider { display: none !important; }
          .ws-pricing-grid { grid-template-columns: 1fr !important; }
          .ws-hero-stats { gap: 0 !important; flex-wrap: nowrap !important; }
          .ws-hero-stats > div { padding: 0 16px !important; }
          .ws-cta-box { padding: 36px 24px !important; }
        }
        @media (max-width: 480px) {
          .ws-hero-buttons { flex-direction: column !important; align-items: stretch !important; }
          .ws-hero-buttons a, .ws-hero-buttons button { text-align: center !important; justify-content: center !important; }
        }

        /* scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #030712; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 2px; }
      `}} />

      {/* ── Hero ── */}
      <section style={{ padding: '80px 24px 60px', position: 'relative', overflow: 'hidden' }}>
        {/* Diagonal pattern */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 40px)',
        }} />

        <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative', animation: 'ws-fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both' }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            color: '#6366f1', textTransform: 'uppercase',
            fontFamily: 'monospace',
            marginBottom: 24,
          }}>
            홈페이지 제작 서비스
          </p>
          <h1 style={{
            fontSize: 'clamp(28px, 4.5vw, 54px)', fontWeight: 800,
            lineHeight: 1.2, marginBottom: 20,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            wordBreak: 'keep-all',
          }}>
            홈페이지·웹앱·앱 개발,<br/>연락 끊기는 일 없습니다
          </h1>
          <p style={{
            fontSize: 16, color: '#64748b', lineHeight: 1.85, marginBottom: 36,
            wordBreak: 'keep-all',
          }}>
            소개 사이트부터 SaaS·쇼핑몰·모바일웹까지 — 계약서부터 소스코드 인도까지<br/>
            단계마다 증거를 남깁니다. 납기 지연 시 하루당 10만원 감면.
          </p>
          <div className="ws-hero-buttons" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/freelance?service=website" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px',
              background: '#6366f1',
              borderRadius: 12, color: 'white', fontWeight: 700, fontSize: 15,
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#4f46e5'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#6366f1'; }}>
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
          <div className="ws-hero-stats" style={{ display: 'flex', gap: 0, justifyContent: 'center', marginTop: 56, flexWrap: 'wrap' }}>
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

      {/* ── Feature tags ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '14px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['반응형 디자인', 'SEO 최적화', '웹앱·모바일웹', '계약서 작성', '소스코드 제공', '납기 패널티 보장', '도메인 배포'].map((t) => (
            <span key={t} style={{ padding: '4px 12px', fontSize: '11px', color: '#475569', letterSpacing: '0.06em', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4, fontFamily: 'monospace' }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Trust badges ── */}
      <section style={{ padding: '48px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
          {[
            {
              title: '계약서 필수 작성', desc: '모든 프로젝트 계약서 체결 후 진행',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 20, height: 20 }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>,
            },
            {
              title: '주간 진행 보고', desc: '매주 작업 현황 공유, 연락 두절 없음',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 20, height: 20 }}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
            },
            {
              title: '소스코드 전액 제공', desc: '완성 후 전체 소스코드 인도',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 20, height: 20 }}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
            },
            {
              title: '납기 지연 패널티', desc: '지연 1일당 10만원 자동 감면',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 20, height: 20 }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
            },
          ].map((b) => (
            <div key={b.title} style={{
              padding: '20px 22px',
              background: 'rgba(255,255,255,0.02)',
              display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <span style={{ color: '#6366f1', flexShrink: 0, marginTop: 2 }}>{b.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 4, wordBreak: 'keep-all' }}>{b.title}</div>
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
          <div className="ws-portfolio-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
            {samples.map((s) => (
              <Link key={s.type} href={`/services/website/samples/${s.type}`} style={{ textDecoration: 'none' }}>
                <div className="ws-sample-card">
                  <div style={{ position: 'relative' }}>
                    <SampleMiniPreview type={s.type} />
                    <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 5, zIndex: 10 }}>
                      {s.tags.map((tag) => (
                        <span key={tag} style={{
                          fontSize: 10, fontWeight: 600, color: '#e2e8f0',
                          background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255,255,255,0.13)',
                          padding: '2px 8px', borderRadius: 100,
                        }}>{tag}</span>
                      ))}
                    </div>
                    <div style={{
                      position: 'absolute', bottom: 12, right: 12, zIndex: 10,
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
          <div className="ws-process-steps" style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap', justifyContent: 'center', gap: 0 }}>
            {processSteps.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div className="ws-step-card" style={{
                  textAlign: 'center', padding: '28px 22px', minWidth: 138,
                  background: '#080d1a', borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#6366f1', fontFamily: 'monospace', marginBottom: 12, letterSpacing: '-0.02em' }}>
                    {p.step}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 6, wordBreak: 'keep-all' }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: 11, color: '#334155', lineHeight: 1.55, wordBreak: 'keep-all' }}>
                    {p.desc}
                  </div>
                </div>
                {i < processSteps.length - 1 && (
                  <div className="ws-process-divider" style={{ color: '#1e293b', fontSize: 20, padding: '0 4px', flexShrink: 0 }}>›</div>
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
          <div className="ws-pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 20 }}>
            {plans.map((plan) => (
              <div key={plan.name} className="ws-plan-card" style={{
                padding: 32, borderRadius: 20,
                background: plan.featured ? '#0d1240' : '#080d1a',
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
          <div className="ws-cta-box" style={{
            maxWidth: 640, margin: '0 auto',
            padding: '56px 44px', borderRadius: 24,
            background: '#04102b',
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 40px)',
            border: '1px solid rgba(99,102,241,0.3)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
          }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 14, letterSpacing: '-0.02em', wordBreak: 'keep-all' }}>
              내일도 고민만 하실 건가요?
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.75, marginBottom: 32, wordBreak: 'keep-all' }}>
              상담 신청 후 24시간 이내 답변드립니다.<br/>
              소개 사이트·웹앱·쇼핑몰·모바일앱, 규모 무관하게 검토해드립니다.
            </p>
            <Link href="/freelance?service=website" style={{
              display: 'inline-block', padding: '15px 40px',
              background: '#6366f1',
              borderRadius: 12, color: 'white', fontWeight: 700, fontSize: 15,
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(99,102,241,0.5)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(99,102,241,0.4)'; }}>
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
          position: 'fixed', bottom: '5.5rem', right: '2rem', zIndex: 200,
          width: 48, height: 48, borderRadius: '50%',
          background: '#6366f1',
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
