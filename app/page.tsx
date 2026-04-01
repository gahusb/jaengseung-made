'use client';

import { useState } from 'react';
import Link from 'next/link';
import ContactModal from './components/ContactModal';

/* ═══════════════════════════════════════════════════
   쟁승메이드 홈페이지 — 리뉴얼 v2
   설계 원칙:
   1. AI 템플릿 패턴 전면 제거 (orbs, bento, marquee)
   2. 박재오라는 사람이 직접 쓴 느낌
   3. 증거 우선 — running services, 실제 계약 조건
   4. 에디토리얼 레이아웃 — 타이포 중심
═══════════════════════════════════════════════════ */

const PAIN_POINTS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    problem: '중간에 연락이 끊겼다',
    desc: '착수금 받고 잠수, 완성 직전에 추가비용 요구. 개발자를 다시 찾아야 하는 상황.',
    color: 'text-red-400 bg-red-400/10',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    problem: '납기를 3번 넘겼다',
    desc: '"다음 주까지 드릴게요"가 두 달 됐다. 런칭 일정이 전부 밀렸다.',
    color: 'text-amber-400 bg-amber-400/10',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    problem: '소스코드를 못 받았다',
    desc: '납품 후 수정이 필요한데 코드를 주지 않는다. 다음 개발자도 이어받을 수 없는 상황.',
    color: 'text-violet-400 bg-violet-400/10',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
    problem: '뭘 만들고 있는지 모른다',
    desc: '중간 보고가 없어서 방향이 맞는지 모른다. "다 되면 연락 준다"는 말만 반복.',
    color: 'text-cyan-400 bg-cyan-400/10',
  },
];

const PROMISES = [
  {
    number: '01',
    title: '계약서부터 씁니다',
    detail: '착수 전에 범위·금액·납기·수정 횟수를 문서로 확정합니다. 구두 약속은 없습니다.',
    enforce: '납기 지연 시 하루 총금액 1% 자동 차감 — 계약서 조항',
    color: 'border-blue-500/40',
    accent: 'text-blue-400',
  },
  {
    number: '02',
    title: '주 1회 진행 보고를 드립니다',
    detail: '매주 개발 현황·화면·이슈를 정리해서 공유합니다. 중간에 사라지는 일은 구조적으로 없습니다.',
    enforce: '보고 누락 시 다음 단계 착수 전 보고 완료 후 진행',
    color: 'border-emerald-500/40',
    accent: 'text-emerald-400',
  },
  {
    number: '03',
    title: '소스코드 전체를 이관합니다',
    detail: '완성된 코드 전부를 드립니다. 락인 없음. 이후 다른 개발자에게 인계, 직접 수정도 가능합니다.',
    enforce: '납품 완료 후 30일간 코드 관련 질문 무상 답변',
    color: 'border-violet-500/40',
    accent: 'text-violet-400',
  },
];

const LIVE_SERVICES = [
  {
    name: '쟁승메이드',
    label: '이 사이트',
    url: '/freelance',
    desc: '기획·디자인·개발·배포·관리자까지 혼자 만들고 직접 운영 중. 이 사이트 자체가 포트폴리오.',
    tech: ['Next.js 16', 'Supabase', 'Tailwind', 'Vercel'],
    status: 'live',
    color: '#1a56db',
  },
  {
    name: 'AI 사주 분석',
    label: '유료 서비스',
    url: '/saju',
    desc: '생년월일 입력 → Gemini AI가 사주팔자 12항목 즉시 분석. 실제 결제·구매 발생 중.',
    tech: ['Google Gemini', 'Supabase', 'PG 연동'],
    status: 'live',
    color: '#7c3aed',
  },
  {
    name: 'AI 자동화 키트',
    label: '월 구독',
    url: '/services/ai-kit',
    desc: '업무 일지·이메일·SNS 6종 자동화 도구 구독형 서비스. 매달 새 도구 추가.',
    tech: ['월 19,900원', 'API 연동', '자동화'],
    status: 'live',
    color: '#0891b2',
  },
];

const SERVICE_LIST = [
  {
    href: '/services/website',
    category: 'WEB',
    title: '홈페이지 / 쇼핑몰 제작',
    desc: '랜딩 페이지, 기업 소개 사이트, 쇼핑몰 신규 구축 및 리뉴얼',
    from: '50만원~',
    duration: '7일~',
    hot: true,
  },
  {
    href: '/services/automation',
    category: 'RPA',
    title: '업무 자동화 개발',
    desc: '엑셀 처리, 이메일·보고서 자동화, 데이터 수집 스크립트',
    from: '5만원~',
    duration: '1일~',
    hot: true,
  },
  {
    href: '/services/prompt',
    category: 'AI',
    title: '프롬프트 엔지니어링',
    desc: 'ChatGPT·Claude 업무 최적화 프롬프트 패키지 설계',
    from: '9,900원~',
    duration: '1~3일',
    hot: false,
  },
  {
    href: '/services/ai-kit',
    category: 'KIT',
    title: 'AI 자동화 키트 구독',
    desc: '완성된 자동화 도구를 월 구독으로. 설치 없이 바로 사용.',
    from: '19,900원/월',
    duration: '즉시',
    hot: false,
  },
  {
    href: '/saju',
    category: 'AI',
    title: 'AI 사주 분석',
    desc: '생년월일 입력 → AI가 성격·직업·관계·운세를 즉시 분석',
    from: '무료',
    duration: '즉시',
    hot: false,
  },
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-full">
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service="외주 개발 문의"
        checklist={[
          '개발하고 싶은 서비스를 간략히 설명해주세요',
          '희망 납품 일정과 예산 범위',
          '참고할 만한 사이트나 레퍼런스',
          '현재 운영 중인 시스템이 있다면 함께 알려주세요',
        ]}
        accentColor="text-[#5ba4ff]"
        headerFrom="#04102b"
        headerTo="#0a2060"
      />

      {/* ══════════════════════════════════════
          HERO — 에디토리얼, 단순, 증거 중심
      ══════════════════════════════════════ */}
      <section
        className="relative overflow-hidden px-6 py-20 lg:px-14 lg:py-28"
        style={{ background: '#04102b' }}
      >
        {/* 배경: 미세한 대각선 패턴만, orbs 없음 */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #4f8ef7 0, #4f8ef7 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative max-w-5xl">
          {/* 수동 작성 느낌의 identity tag */}
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs text-[#5ba4ff]/60 tracking-[0.2em] uppercase">
              박재오 · 서울 · 백엔드 개발 7년
            </span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              프로젝트 접수 가능
            </span>
          </div>

          {/* 헤드라인 — 개발 외주 + 구독 서비스 모두 포괄 */}
          <h1
            className="text-[2.6rem] md:text-[3.5rem] lg:text-[4.5rem] font-extrabold leading-[1.12] tracking-tight text-white mb-6"
            style={{ wordBreak: 'keep-all' }}
          >
            아이디어가 있다면,
            <br />
            만드는 것부터
            <br />
            <span className="text-[#5ba4ff]">운영까지 맡기세요.</span>
          </h1>

          {/* 서브텍스트 */}
          <p
            className="text-[#8ba5cc] text-lg md:text-xl leading-relaxed mb-3 max-w-2xl"
            style={{ wordBreak: 'keep-all' }}
          >
            7년차 대기업 개발자가 직접 만드는 홈페이지·자동화·AI 서비스.
            <br />
            지금 이 사이트 자체가 포트폴리오입니다.
          </p>
          <p
            className="text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-2xl"
            style={{ wordBreak: 'keep-all' }}
          >
            연락 두절, 납기 지연, 소스코드 미인도 — 전부 계약서 한 장으로 해결합니다.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 mb-14">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#1a56db] hover:bg-[#1e4fc2] text-white px-8 py-4 rounded-xl font-bold text-sm transition-colors"
            >
              무료 상담 신청
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <Link
              href="/freelance"
              className="inline-flex items-center gap-2 border border-white/15 hover:border-white/30 text-white/60 hover:text-white px-8 py-4 rounded-xl font-semibold text-sm transition-all"
            >
              포트폴리오 보기
            </Link>
          </div>

          {/* Live services — stats 대신 실제 운영 서비스 */}
          <div className="border-t border-white/8 pt-8">
            <p className="font-mono text-[11px] text-[#5ba4ff]/40 tracking-[0.25em] uppercase mb-4">
              지금 운영 중인 서비스
            </p>
            <div className="flex flex-wrap gap-6">
              {LIVE_SERVICES.map((s) => (
                <Link
                  key={s.name}
                  href={s.url}
                  className="group flex items-center gap-2.5 text-sm text-[#8ba5cc] hover:text-white transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <span className="font-semibold">{s.name}</span>
                  <span className="font-mono text-[11px] text-white/25">{s.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — 이런 상황이신가요?
          (고객 고통 공감, 신선한 접근)
      ══════════════════════════════════════ */}
      <section className="bg-white px-6 py-16 lg:px-14 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="font-mono text-xs text-[#1a56db]/60 tracking-widest uppercase mb-2">
                Client Pain Points
              </p>
              <h2
                className="text-2xl md:text-3xl font-extrabold text-[#04102b] leading-tight"
                style={{ wordBreak: 'keep-all' }}
              >
                개발자를 구하면 생기는 일
              </h2>
            </div>
            <p className="text-[#64748b] text-sm max-w-xs" style={{ wordBreak: 'keep-all' }}>
              저도 이 문제들이 싫어서 계약 방식을 아예 다르게 설계했습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PAIN_POINTS.map((p) => (
              <div
                key={p.problem}
                className="border border-[#e2e8f0] rounded-2xl p-6 hover:border-[#cbd5e1] hover:shadow-sm transition-all bg-white"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${p.color}`}>
                    {p.icon}
                  </div>
                  <div>
                    <p className="font-bold text-[#0f172a] text-base mb-1">{p.problem}</p>
                    <p className="text-[#64748b] text-sm leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                      {p.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — 박재오는 누구인가
          (bento 그리드 제거, 에디토리얼 대체)
      ══════════════════════════════════════ */}
      <section className="bg-[#04102b] px-6 py-16 lg:px-14 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-xs text-[#5ba4ff]/40 tracking-widest uppercase mb-3">
            About
          </p>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* 좌측: 스토리 */}
            <div>
              <h2
                className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-6"
                style={{ wordBreak: 'keep-all' }}
              >
                7년간 실제 서비스를 만들었습니다.
                <br />
                <span className="text-[#5ba4ff]">이제 당신의 서비스를 만듭니다.</span>
              </h2>
              <div className="space-y-4 text-[#8ba5cc] text-base leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                <p>
                  대기업 IT팀에서 백엔드 개발 7년 — 실제 운영되는 서비스의 API 설계, DB 구조, 배포 파이프라인을 직접 다뤘습니다.
                </p>
                <p>
                  지금은 그 경험으로 <span className="text-white">홈페이지, 자동화 스크립트, AI 연동 서비스</span>를 개인사업자와 중소기업 대상으로 직접 개발합니다.
                </p>
                <p className="text-white/50 text-sm">
                  사업자등록번호 267-53-00822 · 서울시 동작구 · bgg8988@gmail.com
                </p>
              </div>

              {/* 기술 스택 — 마퀴 아닌 정적 태그 */}
              <div className="mt-8">
                <p className="font-mono text-[11px] text-[#5ba4ff]/40 tracking-widest uppercase mb-3">
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Next.js', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Supabase', 'Docker', 'AWS', 'Spring Boot', 'Redis'].map((t) => (
                    <span
                      key={t}
                      className="font-mono text-xs text-[#5ba4ff]/70 border border-[#5ba4ff]/15 px-2.5 py-1 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 우측: 숫자로 증명 */}
            <div className="space-y-4">
              {[
                {
                  value: '7년',
                  label: '대기업 백엔드 개발 경력',
                  sub: '실제 운영 서비스 다수 개발',
                  color: 'border-blue-500/30',
                },
                {
                  value: '3개',
                  label: '현재 직접 운영 중인 서비스',
                  sub: '이 사이트 포함 — 지금 이 순간도 작동 중',
                  color: 'border-emerald-500/30',
                },
                {
                  value: '100%',
                  label: '소스코드 이관',
                  sub: '납품 완료 후 전체 코드 전달, 락인 없음',
                  color: 'border-violet-500/30',
                },
                {
                  value: '24h',
                  label: '이내 견적 답변',
                  sub: '주말·공휴일 포함, 평균 3.8시간',
                  color: 'border-amber-500/30',
                },
              ].map((item) => (
                <div
                  key={item.value}
                  className={`border-l-2 ${item.color} pl-5 py-2`}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-white tracking-tight">{item.value}</span>
                    <span className="text-[#8ba5cc] text-sm font-medium">{item.label}</span>
                  </div>
                  <p className="text-white/30 text-xs mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 4 — 약속 3가지
          (bento 제거, 에디토리얼 행 구조)
      ══════════════════════════════════════ */}
      <section className="bg-[#f8faff] px-6 py-16 lg:px-14 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="font-mono text-xs text-[#1a56db]/60 tracking-widest uppercase mb-2">
              Guarantee
            </p>
            <h2
              className="text-2xl md:text-3xl font-extrabold text-[#04102b]"
              style={{ wordBreak: 'keep-all' }}
            >
              계약서에 박혀 있는 약속들
            </h2>
          </div>

          <div className="space-y-px">
            {PROMISES.map((p, i) => (
              <div
                key={p.number}
                className={`flex flex-col md:flex-row md:items-start gap-6 py-8 ${
                  i < PROMISES.length - 1 ? 'border-b border-[#e2e8f0]' : ''
                }`}
              >
                {/* 번호 */}
                <div className={`font-mono text-5xl font-extrabold ${p.accent} opacity-20 leading-none flex-shrink-0 w-16`}>
                  {p.number}
                </div>
                {/* 내용 */}
                <div className="flex-1">
                  <h3 className="text-xl font-extrabold text-[#0f172a] mb-2">{p.title}</h3>
                  <p className="text-[#475569] text-base leading-relaxed mb-3" style={{ wordBreak: 'keep-all' }}>
                    {p.detail}
                  </p>
                  <div className={`inline-flex items-center gap-2 text-xs font-semibold ${p.accent} border ${p.color} px-3 py-1.5 rounded-full`}>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {p.enforce}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 5 — 지금 운영 중인 서비스
          (가짜 후기 대신 실제 증거)
      ══════════════════════════════════════ */}
      <section className="bg-[#04102b] px-6 py-16 lg:px-14 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="font-mono text-xs text-[#5ba4ff]/40 tracking-widest uppercase mb-2">
              Live Portfolio
            </p>
            <h2
              className="text-2xl md:text-3xl font-extrabold text-white"
              style={{ wordBreak: 'keep-all' }}
            >
              직접 만들고 운영 중인 서비스들
            </h2>
            <p className="text-[#8ba5cc] text-sm mt-2" style={{ wordBreak: 'keep-all' }}>
              고객 후기보다 확실한 증거입니다. 지금 바로 접속해서 확인하실 수 있습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {LIVE_SERVICES.map((s) => (
              <Link
                key={s.name}
                href={s.url}
                className="group relative flex flex-col border border-white/8 hover:border-white/20 rounded-2xl p-6 transition-all hover:bg-white/3"
              >
                {/* 상단 */}
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    운영 중
                  </span>
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded border"
                    style={{ color: s.color, borderColor: `${s.color}40` }}
                  >
                    {s.label}
                  </span>
                </div>

                <h3 className="text-white font-extrabold text-lg mb-2 group-hover:text-[#5ba4ff] transition-colors">
                  {s.name}
                </h3>
                <p className="text-[#8ba5cc] text-sm leading-relaxed mb-4 flex-1" style={{ wordBreak: 'keep-all' }}>
                  {s.desc}
                </p>

                {/* 기술 태그 */}
                <div className="flex flex-wrap gap-1.5">
                  {s.tech.map((t) => (
                    <span key={t} className="font-mono text-[11px] text-white/30 border border-white/8 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>

                {/* 링크 화살표 */}
                <div className="absolute top-6 right-6 text-white/20 group-hover:text-white/50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 6 — 서비스 목록
          (카드 그리드 → 에디토리얼 테이블)
      ══════════════════════════════════════ */}
      <section className="bg-white px-6 py-16 lg:px-14 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <p className="font-mono text-xs text-[#1a56db]/60 tracking-widest uppercase mb-2">Services</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]" style={{ wordBreak: 'keep-all' }}>
                어떤 일을 맡겨 드릴 수 있나요
              </h2>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="text-sm text-[#1a56db] font-semibold hover:underline underline-offset-4"
            >
              목록에 없는 것도 상담 가능 →
            </button>
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            {SERVICE_LIST.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex items-center gap-4 md:gap-6 py-5 hover:bg-[#f8faff] -mx-4 px-4 rounded-xl transition-colors"
              >
                {/* 카테고리 태그 */}
                <span className="font-mono text-xs font-bold text-[#94a3b8] w-10 flex-shrink-0">
                  {s.category}
                </span>

                {/* 서비스명 + 설명 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-extrabold text-[#0f172a] text-base group-hover:text-[#1a56db] transition-colors">
                      {s.title}
                    </span>
                    {s.hot && (
                      <span className="text-[10px] font-bold text-red-500 border border-red-200 px-1.5 py-0.5 rounded bg-red-50">
                        HOT
                      </span>
                    )}
                  </div>
                  <p className="text-[#64748b] text-sm truncate" style={{ wordBreak: 'keep-all' }}>
                    {s.desc}
                  </p>
                </div>

                {/* 가격 + 기간 */}
                <div className="hidden sm:flex flex-col items-end flex-shrink-0">
                  <span className="text-[#0f172a] font-extrabold text-sm">{s.from}</span>
                  <span className="text-[#94a3b8] text-xs font-mono">{s.duration}</span>
                </div>

                {/* 화살표 */}
                <svg className="w-4 h-4 text-[#cbd5e1] group-hover:text-[#1a56db] flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 7 — 최종 CTA (무료 이벤트 + 상담 통합)
      ══════════════════════════════════════ */}
      <section className="bg-[#04102b] px-6 py-20 lg:px-14">
        <div className="max-w-5xl mx-auto">
          {/* 무료 이벤트 배너 */}
          <div className="border border-white/8 rounded-2xl p-6 md:p-8 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-500/15 border border-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                선착순 3팀 한정
              </div>
              <h3 className="text-white font-extrabold text-xl mb-1" style={{ wordBreak: 'keep-all' }}>
                AI 자동화 세팅을 무료로 받아보세요
              </h3>
              <p className="text-[#8ba5cc] text-sm" style={{ wordBreak: 'keep-all' }}>
                반복 업무 자동화 셋업 + 솔직한 리뷰 한 줄이 조건입니다.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex-shrink-0 bg-white text-[#04102b] font-extrabold text-sm px-7 py-3.5 rounded-xl hover:bg-[#f1f5ff] transition-colors whitespace-nowrap"
            >
              무료 신청하기
            </button>
          </div>

          {/* 메인 CTA */}
          <div className="text-center">
            <p className="font-mono text-xs text-[#5ba4ff]/40 tracking-widest uppercase mb-4">Get Started</p>
            <h2
              className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight"
              style={{ wordBreak: 'keep-all' }}
            >
              어떤 것이든
              <br />
              먼저 말씀해 주세요.
            </h2>
            <p className="text-[#8ba5cc] text-lg mb-10" style={{ wordBreak: 'keep-all' }}>
              상담은 무료입니다. 24시간 이내 답변드립니다.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 bg-[#1a56db] hover:bg-[#1e4fc2] text-white px-10 py-4 rounded-xl font-extrabold text-base transition-colors"
              >
                무료 상담 신청
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <a
                href="https://open.kakao.com/o/s9stoNvb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-extrabold text-base transition-all"
                style={{ background: '#FEE500', color: '#3A1D1D' }}
              >
                카카오로 바로 채팅
              </a>
            </div>
            <p className="text-white/20 text-xs mt-8 font-mono">
              쟁승메이드 · 사업자 267-53-00822 · bgg8988@gmail.com · 010-3907-1392
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
