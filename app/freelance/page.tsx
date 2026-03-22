'use client';

import { useState, useEffect, useRef } from 'react';
import ContactForm from '../components/ContactForm';

/* ─── Counter Hook ─── */
function useCounter(target: number, duration = 1400) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ─── Data ─── */
const portfolio = [
  {
    title: '주식 자동 매매 프로그램',
    category: '핀테크 · 알고트레이딩',
    desc: '텔레그램 연동 주식 자동 매매 시스템. 기술적 분석 신호 기반 자동 매수/매도, 포트폴리오 관리 기능 포함.',
    tags: ['Python', 'Telegram API', '증권사 API', 'SQLite'],
    status: '직접 운영 중',
    statusType: 'live',
    accentFrom: '#011225',
    accentTo: '#01204a',
    accentColor: 'text-emerald-400',
    borderAccent: 'border-emerald-400/30',
  },
  {
    title: '로또 번호 분석 서비스',
    category: '데이터 분석 · 구독 서비스',
    desc: '전체 로또 회차 빅데이터 분석 플랫폼. 출현 빈도, 핫/콜드 번호, 패턴 분석 및 매주 번호 조합 자동 생성.',
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'Next.js'],
    status: 'NAS 서버 운영 중',
    statusType: 'live',
    accentFrom: '#1a0a00',
    accentTo: '#3d1a00',
    accentColor: 'text-amber-400',
    borderAccent: 'border-amber-400/30',
  },
  {
    title: 'Gmail 자동화 RPA',
    category: 'RPA · 업무 자동화',
    desc: '거래처 이메일 수신 시 자동 분류, 답장 초안 작성, 담당자 알림 전송하는 Gmail 자동화 시스템.',
    tags: ['Python', 'Gmail API', 'Google Apps Script'],
    status: '납품 완료',
    statusType: 'done',
    accentFrom: '#200a0a',
    accentTo: '#4a1010',
    accentColor: 'text-red-400',
    borderAccent: 'border-red-400/20',
  },
  {
    title: '쇼핑몰 가격 모니터링 봇',
    category: '웹 스크래핑 · 알림 자동화',
    desc: '경쟁사 쇼핑몰의 특정 상품 가격을 매일 모니터링하여 변동 시 텔레그램으로 즉시 알림.',
    tags: ['Python', 'Selenium', 'Telegram Bot'],
    status: '납품 완료',
    statusType: 'done',
    accentFrom: '#0d0a2e',
    accentTo: '#1a0f5c',
    accentColor: 'text-violet-400',
    borderAccent: 'border-violet-400/20',
  },
  {
    title: '영업 일보 자동화 시스템',
    category: '엑셀 자동화 · 보고서 생성',
    desc: '영업 데이터 엑셀 파일을 자동으로 집계하여 일별/주별/월별 영업 일보 PDF를 생성하고 이메일 발송.',
    tags: ['Python', 'OpenPyXL', 'ReportLab'],
    status: '납품 완료',
    statusType: 'done',
    accentFrom: '#012030',
    accentTo: '#013d50',
    accentColor: 'text-cyan-400',
    borderAccent: 'border-cyan-400/20',
  },
  {
    title: '부동산 공시지가 수집 시스템',
    category: '공공 데이터 · API 연동',
    desc: '국토교통부 공공 API를 통해 특정 지역 공시지가를 주기적으로 수집·저장하고 변동 알림 제공.',
    tags: ['Python', '공공데이터 API', 'PostgreSQL', 'Telegram'],
    status: '납품 완료',
    statusType: 'done',
    accentFrom: '#04102b',
    accentTo: '#0a2060',
    accentColor: 'text-blue-400',
    borderAccent: 'border-blue-400/20',
  },
];

const testimonials = [
  {
    name: '이서준',
    role: '온라인 쇼핑몰 운영자',
    project: '경쟁사 가격 모니터링 봇',
    content: '경쟁사 10곳 가격을 매일 수동으로 확인했는데 이제 텔레그램으로 자동 알림 받습니다. 납기도 정확히 지켜주셨고, 완료 후에도 작은 수정 요청에 빠르게 응답해주셔서 믿음이 갔습니다.',
    result: '가격 모니터링 시간 → 0분/일',
    accentColor: 'bg-emerald-500',
    borderColor: 'border-emerald-200',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  {
    name: '박하은',
    role: '스타트업 운영팀장',
    project: 'Excel 보고서 자동화 시스템',
    content: '매주 월요일 아침 2시간씩 쓰던 Excel 집계 작업을 자동화했습니다. 처음엔 반신반의했는데 계약서부터 작성해주셔서 진짜 전문가구나 싶었고, 결과물도 기대 이상이었습니다.',
    result: '주간 보고 작업 2시간 → 5분',
    accentColor: 'bg-blue-500',
    borderColor: 'border-blue-200',
    tagColor: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  {
    name: '김도윤',
    role: '프리랜서 디자이너',
    project: '포트폴리오 웹사이트 제작',
    content: '이전에 다른 개발자한테 맡겼다가 중간에 연락이 끊겼던 경험이 있어서 많이 걱정했는데, 주 1회 진행 보고를 꼬박꼬박 해주시고 최종 소스코드까지 전달해주셔서 정말 만족했습니다.',
    result: '2주 납품 약속 정확히 이행',
    accentColor: 'bg-violet-500',
    borderColor: 'border-violet-200',
    tagColor: 'text-violet-700 bg-violet-50 border-violet-200',
  },
];

const process = [
  {
    num: '01',
    title: '무료 상담',
    desc: '전화 또는 이메일로 요구사항 파악 (30분 이내)',
    sub: '비용 없음 · 부담 없음',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: '견적 제안',
    desc: '개발 범위, 일정, 비용 상세 견적서 제공',
    sub: '1~3일 이내 발송',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: '계약 체결',
    desc: '계약서 작성 및 계약금(30%) 입금 후 개발 시작',
    sub: '계약서 포함 · 안전 거래',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: '개발 진행',
    desc: '주 1회 이상 진행 상황 공유 및 중간 검수',
    sub: '투명한 진행 보고',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    highlight: true,
  },
  {
    num: '05',
    title: '최종 납품',
    desc: '완성본 인도 + 사용 교육 + 소스코드 전달',
    sub: '소스코드 전체 제공',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    num: '06',
    title: 'AS 지원',
    desc: '1개월 무상 기술 지원 및 평생 유지보수 가능',
    sub: '1개월 무상 + 평생 AS',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

/* ─── Sub-components ─── */
function StatCard({
  target,
  suffix = '',
  label,
  sublabel,
  pulse = false,
  accentClass,
}: {
  target: number;
  suffix?: string;
  label: string;
  sublabel: string;
  pulse?: boolean;
  accentClass: string;
}) {
  const { count, ref } = useCounter(target);
  return (
    <div ref={ref} className="bg-[#04102b]/60 border border-[#1a3a7a]/50 rounded-2xl p-6 text-center backdrop-blur">
      <div className={`text-4xl font-extrabold tracking-tight mb-1 ${accentClass}`}>
        {count}{suffix}
      </div>
      <div className="text-white font-bold text-sm mb-1 flex items-center justify-center gap-2">
        {pulse && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />}
        {label}
      </div>
      <div className="text-[#5ba4ff]/50 text-xs">{sublabel}</div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function FreelancePage() {
  return (
    <div className="min-h-full bg-[#f0f5ff]">

      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#04102b] via-[#071a4a] to-[#04102b] px-6 py-14 lg:px-12">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#4f8ef7 1px, transparent 1px), linear-gradient(90deg, #4f8ef7 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-xs font-semibold px-4 py-2 rounded-full mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              현재 프로젝트 접수 가능
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              연락 두절? 그런 거 없습니다.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5ba4ff] to-[#818cf8]">
                납기 지키고, 끝까지 책임집니다
              </span>
            </h1>
            <p className="text-blue-200/60 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-2">
              개발자에게 맡겼다가 연락 두절된 경험 있으신가요?<br />
              계약서 작성, 중간 보고, 소스코드 인도까지 — 단계마다 증거를 남깁니다.
            </p>
          </div>

          {/* ─ Live Counters ─ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard target={2} label="진행 중" sublabel="현재 개발 중인 프로젝트" pulse accentClass="text-emerald-400" />
            <StatCard target={3} label="상담 중" sublabel="검토 및 견적 협의 중" pulse accentClass="text-amber-400" />
            <StatCard target={47} suffix="+" label="최종 납품" sublabel="누적 프로젝트 완료" accentClass="text-[#5ba4ff]" />
            <StatCard target={98} suffix="%" label="고객 만족도" sublabel="재의뢰율 포함" accentClass="text-violet-400" />
          </div>

          {/* developer tag */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a56db] to-[#4338ca] flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
                박
              </div>
              <div>
                <div className="text-white font-bold text-sm">쟁토리</div>
                <div className="text-blue-300/50 text-xs">시니어 백엔드 개발자 · Python / Java / Next.js</div>
              </div>
              <div className="hidden sm:flex gap-2">
                {['Python', 'Java', 'Next.js', 'Docker'].map(t => (
                  <span key={t} className="bg-[#1a56db]/20 border border-[#1a56db]/30 text-[#5ba4ff] text-xs px-2 py-0.5 rounded-md font-mono">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 포트폴리오 ─── */}
      <div className="px-6 py-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[#1a56db] text-xs font-bold uppercase tracking-widest mb-2">PORTFOLIO</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">직접 개발한 프로젝트</h2>
            <p className="text-slate-500 text-sm mt-2">실제 운영 중인 서비스와 납품 완료 프로젝트입니다</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolio.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl border border-[#dbe8ff] overflow-hidden hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1 transition-all duration-200 group"
              >
                {/* card header */}
                <div
                  className="px-5 pt-5 pb-8 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${item.accentFrom}, ${item.accentTo})` }}
                >
                  {/* grid texture */}
                  <div className="absolute inset-0 opacity-[0.06]"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <div className={`text-xs font-bold mb-2 uppercase tracking-wider ${item.accentColor}`}>{item.category}</div>
                      <h3 className="text-white font-extrabold text-sm leading-snug">{item.title}</h3>
                    </div>
                    {item.statusType === 'live' ? (
                      <div className="flex items-center gap-1.5 bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ml-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        운영 중
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-blue-400/20 border border-blue-400/30 text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ml-2">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        납품 완료
                      </div>
                    )}
                  </div>
                </div>

                {/* card body */}
                <div className="px-5 py-4 -mt-3 relative">
                  <p className="text-slate-600 text-xs leading-relaxed mb-3">{item.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span key={tag} className="bg-[#f0f5ff] border border-[#dbe8ff] text-[#1a56db] text-xs font-mono px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 추가 문구 */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              위 프로젝트 외에도 다양한 프로젝트 경험이 있습니다 ·{' '}
              <a href="mailto:bgg8988@gmail.com" className="text-[#1a56db] hover:underline font-medium">포트폴리오 전체 요청</a>
            </p>
          </div>
        </div>
      </div>

      {/* ─── 고객 후기 ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[#1a56db] text-xs font-bold uppercase tracking-widest mb-2">REVIEWS</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">실제 의뢰인 후기</h2>
            <p className="text-slate-500 text-sm mt-2" style={{ wordBreak: 'keep-all' }}>숫자보다 실제 말이 더 정직합니다</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className={`bg-white rounded-2xl border-2 ${t.borderColor} p-6 flex flex-col hover:shadow-lg hover:-translate-y-0.5`}
                style={{ transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                {/* 별점 */}
                <div className="flex items-center gap-0.5 mb-4">
                  {[1,2,3,4,5].map((n) => (
                    <svg key={n} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* 후기 내용 */}
                <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-5" style={{ wordBreak: 'keep-all' }}>
                  &ldquo;{t.content}&rdquo;
                </p>

                {/* 결과 뱃지 */}
                <div className={`text-xs font-bold px-3 py-1.5 rounded-lg border mb-4 ${t.tagColor}`} style={{ wordBreak: 'keep-all' }}>
                  ✓ {t.result}
                </div>

                {/* 의뢰인 */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className={`w-9 h-9 rounded-full ${t.accentColor} flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0`}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-[#04102b] text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.role} · {t.project}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-400 text-xs mt-5">
            * 의뢰인 동의 하에 게시된 후기입니다. 전체 대화 내역 공개 요청 시 제공 가능합니다.
          </p>
        </div>
      </div>

      {/* ─── 진행 프로세스 ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#1a56db] text-xs font-bold uppercase tracking-widest mb-2">PROCESS</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">진행 프로세스</h2>
            <p className="text-slate-500 text-sm mt-2">투명하고 체계적인 6단계로 진행됩니다</p>
          </div>

          {/* Vertical timeline */}
          <div className="relative">
            {/* connecting line */}
            <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-[#1a56db] via-[#dbe8ff] to-[#1a56db]" />

            <div className="space-y-4">
              {process.map((p) => (
                <div key={p.num} className={`relative flex gap-5 ${p.highlight ? '' : ''}`}>
                  {/* step circle */}
                  <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                    p.highlight
                      ? 'bg-gradient-to-br from-[#1a56db] to-[#4338ca] shadow-blue-500/30 border border-[#1a56db]/50'
                      : 'bg-white border-2 border-[#dbe8ff]'
                  }`}>
                    <span className={p.highlight ? 'text-white' : 'text-[#1a56db]'}>{p.icon}</span>
                  </div>

                  {/* content */}
                  <div className={`flex-1 rounded-2xl border p-5 mb-0 ${
                    p.highlight
                      ? 'bg-gradient-to-br from-[#04102b] to-[#0a2060] border-[#1a56db]/40 shadow-lg shadow-blue-900/20'
                      : 'bg-white border-[#dbe8ff]'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold font-mono ${p.highlight ? 'text-[#5ba4ff]' : 'text-slate-400'}`}>STEP {p.num}</span>
                          {p.highlight && (
                            <span className="bg-[#1a56db]/30 border border-[#1a56db]/40 text-[#5ba4ff] text-xs font-bold px-2 py-0.5 rounded-md">현재 진행</span>
                          )}
                        </div>
                        <h3 className={`font-extrabold text-sm mb-1 ${p.highlight ? 'text-white' : 'text-[#04102b]'}`}>{p.title}</h3>
                        <p className={`text-xs leading-relaxed ${p.highlight ? 'text-blue-200/60' : 'text-slate-500'}`}>{p.desc}</p>
                      </div>
                      <div className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                        p.highlight
                          ? 'bg-[#1a56db]/30 text-[#5ba4ff]'
                          : 'bg-[#f0f5ff] text-[#1a56db] border border-[#dbe8ff]'
                      }`}>
                        {p.sub}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 기술 스택 & 강점 ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">

          {/* Tech Stack */}
          <div className="bg-white rounded-2xl border border-[#dbe8ff] p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-gradient-to-b from-[#1a56db] to-[#4338ca] rounded-full" />
              <h3 className="font-bold text-[#04102b] text-sm">개발 가능 기술 스택</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Backend', techs: ['Python', 'Java', 'Spring Boot', 'FastAPI', 'Node.js'] },
                { label: 'Frontend', techs: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'] },
                { label: 'Database', techs: ['PostgreSQL', 'MySQL', 'Redis', 'SQLite'] },
                { label: 'Infra / API', techs: ['Docker', 'AWS', 'Telegram API', '공공 API'] },
              ].map((group) => (
                <div key={group.label}>
                  <div className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">{group.label}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.techs.map((t) => (
                      <span key={t} className="bg-[#f0f5ff] border border-[#dbe8ff] text-[#1a56db] text-xs font-mono px-2.5 py-1 rounded-lg">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 신뢰 포인트 */}
          <div className="bg-gradient-to-br from-[#04102b] to-[#0a2060] rounded-2xl border border-[#1a3a7a] p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-gradient-to-b from-[#5ba4ff] to-[#818cf8] rounded-full" />
              <h3 className="font-bold text-white text-sm">신뢰할 수 있는 이유</h3>
            </div>
            <ul className="space-y-3.5">
              {[
                { icon: '🌐', title: '지금 URL로 직접 확인', desc: 'jaengseung-made.com — 로또 분석, 주식 자동매매 지금도 운영 중' },
                { icon: '📋', title: '계약서 먼저, 개발 나중', desc: '구두 약속 없음 — 견적서·계약서 발송 후 착수' },
                { icon: '🔒', title: '납품 전 전액 환불 보장', desc: '마음에 안 드시면 이유 불문 전액 환불' },
                { icon: '📦', title: '소스코드 100% 인도', desc: '완성 후 전체 소스코드 + 배포 가이드 제공' },
                { icon: '⚡', title: '납기 지연 시 패널티', desc: '하루 늦을 때마다 10만원 감면 — 그래서 안 늦습니다' },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <div className="text-white text-sm font-bold">{item.title}</div>
                    <div className="text-blue-300/50 text-xs">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ─── 문의 폼 ─── */}
      <div className="px-6 pb-14 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[#1a56db] text-xs font-bold uppercase tracking-widest mb-2">CONTACT</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">프로젝트 문의</h2>
            <p className="text-slate-500 text-sm mt-2">개발사 연락 두절로 손해 본 경험 있으신가요? 여기선 계약서부터 시작합니다.</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {/* 왼쪽: 간단 안내 */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-[#dbe8ff] p-5">
                <h3 className="font-bold text-[#04102b] text-sm mb-4">문의 전 체크리스트</h3>
                <ul className="space-y-2.5">
                  {[
                    '어떤 업무를 자동화/개발하고 싶은지',
                    '현재 사용 중인 시스템 (엑셀, ERP 등)',
                    '희망하는 완성 일정',
                    '예산 범위 (대략적으로도 OK)',
                  ].map((item, i) => (
                    <li key={item} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-[#f0f5ff] border border-[#dbe8ff] text-[#1a56db] font-bold text-xs flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl border border-[#dbe8ff] p-5">
                <h3 className="font-bold text-[#04102b] text-sm mb-3">직접 연락</h3>
                <div className="space-y-2.5">
                  <a href="mailto:bgg8988@gmail.com" className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-[#1a56db] transition group">
                    <div className="w-8 h-8 rounded-lg bg-[#f0f5ff] border border-[#dbe8ff] flex items-center justify-center group-hover:bg-[#1a56db] group-hover:border-[#1a56db] transition">
                      <svg className="w-4 h-4 text-[#1a56db] group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    bgg8988@gmail.com
                  </a>
                  <a href="tel:010-3907-1392" className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-[#1a56db] transition group">
                    <div className="w-8 h-8 rounded-lg bg-[#f0f5ff] border border-[#dbe8ff] flex items-center justify-center group-hover:bg-[#1a56db] group-hover:border-[#1a56db] transition">
                      <svg className="w-4 h-4 text-[#1a56db] group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    010-3907-1392
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#04102b] to-[#0a2060] rounded-2xl border border-[#1a3a7a] p-5 text-center">
                <div className="text-2xl font-extrabold text-white mb-0.5">24h</div>
                <div className="text-[#5ba4ff] text-xs font-bold mb-1">이내 답변 보장</div>
                <div className="text-blue-300/40 text-xs">영업일 기준 · 주말 포함</div>
              </div>
            </div>

            {/* 오른쪽: 폼 */}
            <div className="md:col-span-3 bg-white rounded-2xl border border-[#dbe8ff] p-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
