'use client';

import { useState } from 'react';
import Link from 'next/link';
import ContactModal from './components/ContactModal';

const stats = [
  { value: '7년+', label: '개발 경력' },
  { value: '100+', label: '완료 프로젝트' },
  { value: '24h', label: '평균 응답' },
  { value: '98%', label: '고객 만족도' },
];

const techStack = [
  'Python', 'Java', 'Spring Boot', 'Next.js', 'React',
  'PostgreSQL', 'Redis', 'Docker', 'AWS', 'Telegram API',
];

const CHECKLIST_MAP: Record<string, string[]> = {
  '로또 번호 추천': [
    '구독 플랜 선택 (기본 / 프리미엄 / 연간)',
    '번호 수신 방법 (이메일 / 텔레그램)',
    '당첨 보장 없음 — 통계 기반 확률 최적화',
    '구독 취소는 이메일로 언제든 가능',
  ],
  '주식 자동 매매': [
    '사용 중인 증권사 확인 (키움/한국투자 권장)',
    'Windows PC 또는 서버 환경 필요',
    '원금 손실 위험 인지 — 여유 자금 운용 권장',
    '전략 커스터마이징은 프로 플랜 이상 가능',
  ],
  '프롬프트 엔지니어링': [
    '사용 중인 AI 도구 (ChatGPT / Claude / Gemini)',
    '자동화할 업무 유형 구체적으로 설명',
    '필요한 프롬프트 수량 (단건 / 패키지)',
    '납품 후 사용 가이드 및 1:1 교육 포함',
  ],
  '업무 자동화': [
    '자동화하고 싶은 업무를 구체적으로 설명',
    '현재 사용 중인 시스템 (엑셀, ERP 등)',
    '희망 납품 일정과 예산 범위',
    '데이터 민감도 여부 확인',
  ],
};

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState('외주 개발 문의');
  const [modalChecklist, setModalChecklist] = useState<string[]>([]);
  const [modalHeaderFrom, setModalHeaderFrom] = useState('#04102b');
  const [modalHeaderTo, setModalHeaderTo] = useState('#0a2060');
  const [modalAccent, setModalAccent] = useState('text-[#5ba4ff]');

  const openModal = (service: string, headerFrom = '#04102b', headerTo = '#0a2060', accent = 'text-[#5ba4ff]') => {
    const key = Object.keys(CHECKLIST_MAP).find(k => service.includes(k)) || '';
    setModalService(service);
    setModalChecklist(CHECKLIST_MAP[key] || ['문의 내용을 자유롭게 작성해주세요.', '예산 및 일정도 알려주시면 도움이 됩니다.']);
    setModalHeaderFrom(headerFrom);
    setModalHeaderTo(headerTo);
    setModalAccent(accent);
    setModalOpen(true);
  };

  return (
    <div className="min-h-full bg-[#f0f5ff]">
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service={modalService}
        checklist={modalChecklist}
        accentColor={modalAccent}
        headerFrom={modalHeaderFrom}
        headerTo={modalHeaderTo}
      />

      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#04102b] via-[#0a1f5c] to-[#04102b] px-6 py-14 lg:px-12">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#4f8ef7 1px, transparent 1px), linear-gradient(90deg, #4f8ef7 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute left-1/2 bottom-0 w-64 h-64 rounded-full bg-indigo-400/10 blur-3xl translate-y-1/2" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-400/10 border border-blue-400/25 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            7년차 대기업 백엔드 개발자 · 현재 서비스 운영 중
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5 tracking-tight">
            실제로 작동하는<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5ba4ff] to-[#818cf8]">
              개발 서비스
            </span>
            를 제공합니다
          </h1>
          <p className="text-blue-200/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            대기업 개발 경험을 바탕으로, NAS 서버에서 로또 분석·주식 자동매매를
            직접 운영하며 검증된 솔루션만 제공합니다.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => openModal('외주 개발 문의')}
              className="inline-flex items-center gap-2 bg-[#1a56db] hover:bg-[#1e4fc2] text-white px-7 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-900/50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              무료 상담 신청
            </button>
            <a
              href="mailto:bgg8988@gmail.com"
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-blue-200 px-7 py-3 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
            >
              bgg8988@gmail.com
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="relative mt-10 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/8">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#071540]/60 backdrop-blur px-6 py-4 text-center">
              <div className="text-2xl font-extrabold text-white tracking-tight">{s.value}</div>
              <div className="text-blue-300/60 text-xs mt-0.5 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Services Grid ─── */}
      <div className="px-6 py-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#1a56db] text-xs font-bold uppercase tracking-widest mb-2">SERVICES</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b] tracking-tight">제공 서비스</h2>
            <p className="text-slate-500 text-sm mt-2">카드를 클릭하면 상세 정보와 요금을 확인할 수 있습니다</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ─ 로또 ─ */}
            <Link href="/services/lotto" className="service-card group bg-white rounded-2xl border border-[#dbe8ff] overflow-hidden hover:border-[#1a56db]/30 hover:shadow-xl hover:shadow-blue-100">
              <div className="relative bg-gradient-to-br from-[#04102b] to-[#0a2060] px-6 pt-7 pb-16 overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-3 opacity-20">
                  {[1,2,3,4,5,6].map(n => (
                    <div key={n} className="w-9 h-9 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-300 text-xs font-bold">{String(n*7%45+1).padStart(2,'0')}</div>
                  ))}
                </div>
                <div className="absolute top-3 right-4 w-24 h-24 rounded-full bg-amber-400/10 blur-xl" />
                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg tracking-wide">HOT</span>
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className="text-amber-400/70 text-xs font-semibold mb-0.5 tracking-wide">LOTTO ANALYTICS</div>
                  <h3 className="text-white text-xl font-extrabold">로또 번호 추천</h3>
                </div>
              </div>
              <div className="px-6 py-5">
                <p className="text-slate-600 text-sm leading-relaxed mb-4">출현 빈도, 패턴 분석, 핫/콜드 번호 알고리즘으로 매주 최적의 번호 조합을 제공합니다.</p>
                <div className="space-y-2 mb-5">
                  {['출현 빈도 통계 분석', '핫넘버 / 콜드넘버', '매주 5개 조합 제공'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /></div>
                      {f}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-[#04102b] font-extrabold text-lg">월 4,900원~</span>
                    <span className="ml-2 text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-medium">구독형</span>
                  </div>
                  <span className="text-[#1a56db] text-sm font-semibold flex items-center gap-1">자세히 보기 →</span>
                </div>
              </div>
            </Link>

            {/* ─ 주식 ─ */}
            <Link href="/services/stock" className="service-card group bg-white rounded-2xl border border-[#dbe8ff] overflow-hidden hover:border-[#1a56db]/30 hover:shadow-xl hover:shadow-blue-100">
              <div className="relative bg-gradient-to-br from-[#011f3d] to-[#032e5c] px-6 pt-7 pb-6 overflow-hidden">
                <svg className="absolute bottom-0 left-0 right-0 w-full opacity-15" height="60" viewBox="0 0 300 60" fill="none">
                  <polyline points="0,50 40,35 80,42 120,15 160,28 200,10 240,22 300,5" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinejoin="round" />
                </svg>
                <div className="absolute top-3 right-4 w-20 h-20 rounded-full bg-emerald-400/10 blur-xl" />
                <span className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg tracking-wide">NEW</span>
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-emerald-400/15 border border-emerald-400/25 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div className="text-emerald-400/70 text-xs font-semibold mb-0.5 tracking-wide">ALGO TRADING</div>
                  <h3 className="text-white text-xl font-extrabold">주식 자동 매매</h3>
                </div>
              </div>
              <div className="px-6 py-5">
                <p className="text-slate-600 text-sm leading-relaxed mb-4">기술적 분석 기반 매매 신호를 텔레그램으로 실시간 수신하고, 자동으로 매수·매도합니다.</p>
                <div className="space-y-2 mb-5">
                  {['실시간 텔레그램 알림', '자동 매수/매도 실행', '포트폴리오 손익 관리'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /></div>
                      {f}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-[#04102b] font-extrabold text-lg">설치 99,000원~</span>
                    <span className="ml-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full font-medium">설치형</span>
                  </div>
                  <span className="text-[#1a56db] text-sm font-semibold flex items-center gap-1">자세히 보기 →</span>
                </div>
              </div>
            </Link>

            {/* ─ 프롬프트 ─ */}
            <Link href="/services/prompt" className="service-card group bg-white rounded-2xl border border-[#dbe8ff] overflow-hidden hover:border-[#1a56db]/30 hover:shadow-xl hover:shadow-blue-100">
              <div className="relative bg-gradient-to-br from-[#0d0a2e] to-[#1a0f5c] px-6 pt-7 pb-5 overflow-hidden">
                <div className="absolute bottom-2 left-5 right-5 bg-black/30 rounded-lg px-3 py-2 font-mono text-xs opacity-25 overflow-hidden">
                  <span className="text-violet-400">$</span><span className="text-white"> optimize prompt</span><br/>
                  <span className="text-slate-500">→ </span><span className="text-green-400">efficiency: 94%</span>
                </div>
                <div className="absolute top-2 right-2 w-24 h-24 rounded-full bg-violet-500/10 blur-xl" />
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-violet-400/15 border border-violet-400/25 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="text-violet-400/70 text-xs font-semibold mb-0.5 tracking-wide">PROMPT ENGINEERING</div>
                  <h3 className="text-white text-xl font-extrabold">프롬프트 엔지니어링</h3>
                </div>
              </div>
              <div className="px-6 py-5">
                <p className="text-slate-600 text-sm leading-relaxed mb-4">ChatGPT·Claude에 최적화된 업무별 프롬프트를 설계하여 AI 활용 효율을 극대화합니다.</p>
                <div className="space-y-2 mb-5">
                  {['업무별 맞춤 프롬프트', 'ChatGPT / Claude 최적화', '프롬프트 라이브러리 제공'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center flex-shrink-0"><div className="w-1.5 h-1.5 rounded-full bg-violet-500" /></div>
                      {f}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-[#04102b] font-extrabold text-lg">건당 30,000원~</span>
                    <span className="ml-2 text-xs bg-violet-50 border border-violet-200 text-violet-700 px-2 py-0.5 rounded-full font-medium">건별</span>
                  </div>
                  <span className="text-[#1a56db] text-sm font-semibold flex items-center gap-1">자세히 보기 →</span>
                </div>
              </div>
            </Link>

            {/* ─ 업무자동화 ─ */}
            <Link href="/services/automation" className="service-card group bg-white rounded-2xl border border-[#dbe8ff] overflow-hidden hover:border-[#1a56db]/30 hover:shadow-xl hover:shadow-blue-100">
              <div className="relative bg-gradient-to-br from-[#012030] to-[#013d50] px-6 pt-7 pb-5 overflow-hidden">
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 200 120">
                  <line x1="0" y1="60" x2="50" y2="60" stroke="#22d3ee" strokeWidth="1"/>
                  <circle cx="50" cy="60" r="3" fill="#22d3ee"/>
                  <line x1="50" y1="60" x2="50" y2="30" stroke="#22d3ee" strokeWidth="1"/>
                  <circle cx="50" cy="30" r="3" fill="#22d3ee"/>
                  <line x1="50" y1="30" x2="120" y2="30" stroke="#22d3ee" strokeWidth="1"/>
                  <circle cx="120" cy="30" r="3" fill="#22d3ee"/>
                  <line x1="120" y1="30" x2="120" y2="90" stroke="#22d3ee" strokeWidth="1"/>
                  <circle cx="120" cy="90" r="3" fill="#22d3ee"/>
                  <line x1="120" y1="90" x2="200" y2="90" stroke="#22d3ee" strokeWidth="1"/>
                  <line x1="50" y1="60" x2="80" y2="60" stroke="#22d3ee" strokeWidth="1"/>
                  <rect x="80" y="50" width="20" height="20" rx="2" fill="none" stroke="#22d3ee" strokeWidth="1"/>
                  <line x1="100" y1="60" x2="120" y2="60" stroke="#22d3ee" strokeWidth="1"/>
                </svg>
                <div className="absolute top-2 right-2 w-24 h-24 rounded-full bg-cyan-400/10 blur-xl" />
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-cyan-400/15 border border-cyan-400/25 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-cyan-400/70 text-xs font-semibold mb-0.5 tracking-wide">RPA AUTOMATION</div>
                  <h3 className="text-white text-xl font-extrabold">업무 자동화</h3>
                </div>
              </div>
              <div className="px-6 py-5">
                <p className="text-slate-600 text-sm leading-relaxed mb-4">매일 반복되는 엑셀 작업, 이메일 발송, 데이터 수집을 자동화하여 생산성을 높입니다.</p>
                <div className="space-y-2 mb-5">
                  {['엑셀 / 구글 시트 자동화', '이메일 자동 발송', '웹 스크래핑 · 데이터 수집'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center flex-shrink-0"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /></div>
                      {f}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-[#04102b] font-extrabold text-lg">프로젝트 100,000원~</span>
                    <span className="ml-2 text-xs bg-cyan-50 border border-cyan-200 text-cyan-700 px-2 py-0.5 rounded-full font-medium">프로젝트</span>
                  </div>
                  <span className="text-[#1a56db] text-sm font-semibold flex items-center gap-1">자세히 보기 →</span>
                </div>
              </div>
            </Link>


            {/* ─ AI 사주 분석 ─ */}
            <Link href="/saju" className="service-card group bg-white rounded-2xl border border-[#dbe8ff] overflow-hidden hover:border-[#7c3aed]/30 hover:shadow-xl hover:shadow-violet-100 md:col-span-2">
              <div className="relative bg-gradient-to-br from-[#0d0a2e] via-[#1a0f5c] to-[#04102b] px-6 pt-7 pb-6 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06]"
                  style={{ backgroundImage: 'radial-gradient(circle, #c4b5fd 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
                <div className="absolute top-2 right-2 w-28 h-28 rounded-full bg-amber-400/10 blur-2xl" />
                <span className="absolute top-4 right-4 bg-violet-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg tracking-wide">NEW</span>
                <div className="relative flex items-start gap-5">
                  <div className="w-11 h-11 rounded-xl bg-violet-400/15 border border-violet-400/25 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-amber-400/70 text-xs font-semibold mb-0.5 tracking-wide">AI SAJU ANALYTICS</div>
                    <h3 className="text-white text-xl font-extrabold">AI 사주 분석</h3>
                    <p className="text-violet-200/60 text-xs mt-1">전통 명리학과 GPT-4o의 만남 — 12가지 항목 상세 해석</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-5">
                <p className="text-slate-600 text-sm leading-relaxed mb-4">사주팔자 원국 계산부터 신강/신약 분석, 용신·희신, 대운까지 — AI가 따뜻하고 정확하게 해석해드립니다.</p>
                <div className="space-y-2 mb-5">
                  {['전통 사주팔자 계산', 'AI 12가지 항목 해석', '무료 기본 · 유료 상세'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center flex-shrink-0"><div className="w-1.5 h-1.5 rounded-full bg-violet-500" /></div>
                      {f}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-[#04102b] font-extrabold text-lg">무료 체험 / 상세 ₩4,900</span>
                    <span className="ml-2 text-xs bg-violet-50 border border-violet-200 text-violet-700 px-2 py-0.5 rounded-full font-medium">1회</span>
                  </div>
                  <span className="text-[#7c3aed] text-sm font-semibold flex items-center gap-1">자세히 보기 →</span>
                </div>
              </div>
            </Link>
          </div>

          {/* ─ Freelance CTA ─ */}
          <button
            onClick={() => openModal('외주 개발 문의')}
            className="service-card mt-6 w-full flex items-center gap-6 bg-gradient-to-r from-[#04102b] via-[#0a1f5c] to-[#0d2d8a] rounded-2xl border border-[#1a3a7a] p-6 hover:border-[#1a56db]/60 group text-left"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1a56db] to-[#4338ca] flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/50">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[#5ba4ff] text-xs font-bold mb-0.5 uppercase tracking-wider">맞춤형 프로젝트</div>
              <h3 className="text-white text-lg font-extrabold mb-1">외주 개발 문의</h3>
              <p className="text-blue-200/50 text-sm">원하시는 서비스가 없으신가요? 요구사항에 맞게 처음부터 개발해드립니다.</p>
            </div>
            <div className="flex items-center gap-1 text-[#5ba4ff] font-semibold text-sm flex-shrink-0">
              문의하기 →
            </div>
          </button>

          {/* ─ Bottom: Tech + Trust ─ */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-[#dbe8ff] p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-gradient-to-b from-[#1a56db] to-[#4338ca] rounded-full" />
                <h3 className="font-bold text-[#04102b] text-sm">기술 스택</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span key={tech} className="bg-[#f0f5ff] text-[#1a56db] text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#dbe8ff]">{tech}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#dbe8ff] p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-gradient-to-b from-[#1a56db] to-[#4338ca] rounded-full" />
                <h3 className="font-bold text-[#04102b] text-sm">신뢰할 수 있는 이유</h3>
              </div>
              <ul className="space-y-3">
                {[
                  { icon: '🏢', text: '7년차 대기업 백엔드 개발 경력' },
                  { icon: '🖥️', text: 'NAS 서버에서 실제 서비스 직접 운영 중' },
                  { icon: '📱', text: '텔레그램·이메일 실시간 커뮤니케이션' },
                  { icon: '🔒', text: '1개월 무상 유지보수 + 평생 AS 가능' },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
