'use client';

import { useState } from 'react';
import Link from 'next/link';
import ContactModal from '../../components/ContactModal';

const tools = [
  {
    id: 'excel',
    title: '엑셀 자동화 도구',
    subtitle: 'Excel Macro Toolkit v1.2',
    desc: '반복 업무를 버튼 하나로 처리하는 엑셀 매크로 모음. 데이터 정리·집계·보고서 자동 생성 기능 포함.',
    tags: ['VBA', 'Excel', '매크로', '무료'],
    color: '#16a34a',
    bgColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125v-1.125c0-.621.504-1.125 1.125-1.125h1.5m0 0v1.25m0-1.25c0-.621.504-1.125 1.125-1.125h1.5m0 0V7.875m0 0c0-.621.504-1.125 1.125-1.125h8.25c.621 0 1.125.504 1.125 1.125v8.25m0 0v1.125m0-1.125c0 .621-.504 1.125-1.125 1.125H6m12-8.25v8.25" />
      </svg>
    ),
    href: '/services/automation/tools/excel',
    ready: true,
  },
  {
    id: 'scraper',
    title: '웹 스크래핑 도구',
    subtitle: 'Web Scraper v1.0',
    desc: '공공데이터·쇼핑몰 가격·뉴스를 자동 수집해 엑셀로 저장하는 Python 기반 수집 도구.',
    tags: ['Python', 'BeautifulSoup', 'Excel 출력', '무료'],
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    href: '/services/automation/tools/scraper',
    ready: true,
  },
  {
    id: 'ppt',
    title: 'PPT 제작 자동화 도구',
    subtitle: 'PPT Automation v1.0',
    desc: '엑셀 데이터를 읽어 표지·내용·마무리 슬라이드를 자동 생성하는 Python 기반 PPT 도구.',
    tags: ['Python', 'python-pptx', 'openpyxl', '무료'],
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    href: '/services/automation/tools/ppt',
    ready: true,
  },
];

const premiumTools = [
  {
    id: 'realestate',
    title: '부동산 매물 크롤링 프로그램',
    subtitle: 'Real Estate Crawler v1.0',
    desc: '직방·다방·피터팬·네이버부동산 4개 플랫폼을 동시 수집. 지역·거래유형·매물유형 선택 후 플랫폼별 시트로 Excel 자동 저장.',
    tags: ['Python', '4개 플랫폼', '중복제거', 'Excel 출력'],
    price: '3만원',
    features: ['직방·다방·피터팬·네이버부동산 동시 수집', '지역·거래유형·매물유형 선택', '자동 중복 제거', '플랫폼별 시트 분리 Excel 저장'],
    color: '#b45309',
    bgFrom: '#451a03',
    bgTo: '#78350f',
    accentColor: '#f59e0b',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    downloadPath: '/downloads/real_estate_crawler_v1.0.py',
  },
  {
    id: 'accounting',
    title: '사업장 회계 장부 자동화 프로그램',
    subtitle: 'Accounting Automation v1.0',
    desc: '쇼핑몰·식당·제조업·서비스업 업종별 수입/지출 입력 → 매출총이익·영업이익·순이익 자동 계산 + 회계사 관점 조언 리포트.',
    tags: ['Python', '업종별 맞춤', '손익계산서', '회계 조언'],
    price: '5만원',
    features: ['업종별 맞춤 항목 (쇼핑몰·식당·제조·서비스업)', '매출총이익·영업이익·순이익 자동 계산', '부가세 신고 준비 자료 자동 생성', '회계 전문가 관점 경고·조언 리포트'],
    color: '#0f766e',
    bgFrom: '#042f2e',
    bgTo: '#134e4a',
    accentColor: '#2dd4bf',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    downloadPath: '/downloads/accounting_automation_v1.0.py',
  },
];

const CHECKLIST = [
  '자동화하고 싶은 업무를 구체적으로 설명해주세요',
  '현재 사용 중인 프로그램/시스템 (엑셀, ERP, 쇼핑몰 등)',
  '자동화 빈도 (매일 / 주 1회 / 월 1회 등)',
  '희망 납품 일정과 예산 범위',
  '데이터 민감도 여부 (개인정보 포함 여부)',
];

const automationTypes = [
  { title: '엑셀 / 구글 시트 자동화', desc: '매일 반복되는 데이터 정리, 집계, 보고서 생성을 자동화합니다.', examples: ['일별 매출 집계 자동화', '데이터 형식 변환', '여러 시트 데이터 통합'], accentColor: 'border-emerald-200 bg-emerald-50', dotColor: 'bg-emerald-500', labelColor: 'text-emerald-700 bg-emerald-100 border-emerald-200' },
  { title: '웹 스크래핑 · 데이터 수집', desc: '경쟁사 가격, 뉴스, 공공데이터 등을 자동 수집·정리합니다.', examples: ['쇼핑몰 가격 모니터링', '뉴스 기사 자동 수집', '공공 API 데이터 연동'], accentColor: 'border-blue-200 bg-blue-50', dotColor: 'bg-blue-500', labelColor: 'text-blue-700 bg-blue-100 border-blue-200' },
  { title: '이메일 자동 발송', desc: '조건에 따라 고객/거래처에 이메일을 자동으로 발송합니다.', examples: ['발주 확인 이메일 자동화', '정기 보고서 자동 발송', '이메일 분류 및 자동 응답'], accentColor: 'border-violet-200 bg-violet-50', dotColor: 'bg-violet-500', labelColor: 'text-violet-700 bg-violet-100 border-violet-200' },
  { title: '업무 프로세스 RPA', desc: 'PC에서 반복 실행하는 클릭·입력 작업을 자동화합니다.', examples: ['ERP 시스템 데이터 입력', '파일 이동·변환·백업', '웹사이트 폼 자동 제출'], accentColor: 'border-orange-200 bg-orange-50', dotColor: 'bg-orange-500', labelColor: 'text-orange-700 bg-orange-100 border-orange-200' },
  { title: '텔레그램 봇 개발', desc: '특정 이벤트 발생 시 텔레그램으로 자동 알림을 보냅니다.', examples: ['서버 이상 알림 봇', '매출 현황 정기 보고 봇', '주문 접수 알림 봇'], accentColor: 'border-cyan-200 bg-cyan-50', dotColor: 'bg-cyan-500', labelColor: 'text-cyan-700 bg-cyan-100 border-cyan-200' },
  { title: 'API 연동 · 시스템 통합', desc: '서로 다른 시스템을 API로 연결하여 데이터를 자동 동기화합니다.', examples: ['CRM ↔ ERP 데이터 동기화', '결제 시스템 자동 연동', '재고 관리 자동화'], accentColor: 'border-indigo-200 bg-indigo-50', dotColor: 'bg-indigo-500', labelColor: 'text-indigo-700 bg-indigo-100 border-indigo-200' },
];

const plans = [
  { name: '단순 자동화', price: '5만원~', desc: '단일 작업 · 1~3일 소요', examples: '엑셀 매크로, 단순 스크래핑, 이메일 자동화', highlight: false, productId: 'automation_basic' },
  { name: '자동화 심화', price: '15만원~', desc: '복합 작업 · 1~2주 소요', examples: 'RPA 프로세스, API 연동, 텔레그램 봇', highlight: true, productId: 'automation_advanced' },
  { name: '대형 자동화', price: '협의', desc: '시스템 통합 · 2주 이상 소요', examples: '전사 업무 자동화, 멀티 시스템 통합', highlight: false, productId: null },
];

const process = [
  { step: '01', title: '무료 상담', desc: '반복 업무 파악 및 자동화 가능 여부 확인' },
  { step: '02', title: '요구사항 분석', desc: '상세 프로세스 분석 및 자동화 범위 결정' },
  { step: '03', title: '개발 및 테스트', desc: '실제 데이터로 테스트하며 단계적 개발' },
  { step: '04', title: '납품 및 교육', desc: '사용 방법 교육 + 가이드 문서 제공' },
  { step: '05', title: 'AS 지원', desc: '1개월 무상 기술 지원 및 버그 수정' },
];

export default function AutomationPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState('업무 자동화');

  const openModal = (service: string) => {
    setModalService(service);
    setModalOpen(true);
  };

  return (
    <div className="min-h-full bg-[#f0f5ff]">
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service={modalService}
        checklist={CHECKLIST}
        accentColor="text-cyan-400"
        headerFrom="#012030"
        headerTo="#013d50"
      />

      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden bg-[#012030] px-6 py-14 lg:px-12" style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 40px)' }}>

        <div className="relative max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-cyan-300/60 hover:text-cyan-300 text-sm mb-8 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            홈으로
          </Link>
          <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4 font-mono">RPA · 업무 자동화 개발</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            반복 업무를<br />
            완전 자동화
          </h1>
          <p className="text-cyan-100/50 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-6">
            &ldquo;이 작업 매일 하기 너무 귀찮다&rdquo;는 생각이 드는 순간, 자동화할 수 있습니다.<br />
            엑셀, 이메일, 데이터 수집, RPA까지 직접 개발해드립니다.
          </p>
          <div className="inline-grid grid-cols-3 gap-px bg-cyan-400/10 border border-cyan-400/20 rounded-2xl overflow-hidden">
            {[{ v: '1~3일', l: '단순 작업' }, { v: '1~2주', l: '복합 작업' }, { v: '1개월', l: '무상 AS' }].map((s) => (
              <div key={s.l} className="bg-[#012030]/80 px-5 py-3 text-center">
                <div className="text-white font-extrabold text-base">{s.v}</div>
                <div className="text-cyan-400/50 text-xs mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 자동화 유형 ─── */}
      <div className="px-6 py-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-cyan-600 text-xs font-bold uppercase tracking-widest mb-2">AUTOMATION TYPES</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">자동화 유형</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {automationTypes.map((at) => (
              <div key={at.title} className={`bg-white rounded-2xl border-2 ${at.accentColor} p-5`}>
                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-md border mb-3 ${at.labelColor}`}>{at.title.split(' ')[0]}</span>
                <h3 className="font-bold text-[#04102b] text-sm mb-2">{at.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-3">{at.desc}</p>
                <div className="space-y-1.5">
                  {at.examples.map((ex) => (
                    <div key={ex} className="flex items-center gap-2 text-xs text-slate-600">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${at.dotColor}`} />
                      {ex}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 프로세스 ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-cyan-600 text-xs font-bold uppercase tracking-widest mb-2">PROCESS</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">진행 프로세스</h2>
          </div>
          <div className="relative">
            <div className="hidden sm:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-cyan-200 via-[#dbe8ff] to-cyan-200" />
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {process.map((p) => (
                <div key={p.step} className="relative text-center">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#012030] to-[#013d50] border border-cyan-400/20 flex flex-col items-center justify-center mb-3 shadow-lg shadow-cyan-900/20">
                    <span className="text-cyan-400 text-xs font-bold">STEP</span>
                    <span className="text-white font-extrabold text-lg leading-none">{p.step}</span>
                  </div>
                  <div className="font-bold text-[#04102b] text-sm mb-1">{p.title}</div>
                  <div className="text-slate-500 text-xs leading-relaxed">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 예상 비용 ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[#1a56db] text-xs font-bold uppercase tracking-widest mb-2">PRICING</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">예상 비용</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-2xl border p-6 relative flex flex-col ${
                plan.highlight
                  ? 'bg-gradient-to-br from-[#012030] to-[#013d50] border-cyan-400/30 shadow-2xl shadow-cyan-900/20 scale-105'
                  : 'bg-white border-[#dbe8ff]'
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-cyan-400 text-[#012030] text-xs font-extrabold px-4 py-1 rounded-full tracking-wide">가장 많이 의뢰</div>
                )}
                <div className={`text-xs font-bold mb-2 tracking-wide ${plan.highlight ? 'text-cyan-400' : 'text-slate-400'}`}>{plan.name.toUpperCase()}</div>
                <div className={`text-3xl font-extrabold mb-1 ${plan.highlight ? 'text-white' : 'text-[#04102b]'}`}>{plan.price}</div>
                <div className={`text-xs mb-4 ${plan.highlight ? 'text-cyan-300/50' : 'text-slate-400'}`}>{plan.desc}</div>
                <div className={`text-xs leading-relaxed mb-6 flex-1 p-3 rounded-xl ${plan.highlight ? 'bg-cyan-400/10 text-cyan-100/70' : 'bg-[#f0f5ff] text-slate-600'}`}>
                  예: {plan.examples}
                </div>
                <button
                  onClick={() => openModal(`업무 자동화 - ${plan.name}`)}
                  className={`block w-full text-center py-3 rounded-xl text-sm font-bold transition ${
                    plan.highlight ? 'bg-cyan-400 text-[#012030] hover:bg-cyan-300' : 'bg-[#04102b] text-white hover:bg-[#0a1f5c]'
                  }`}
                >
                  무료 상담 신청
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-400 text-xs mt-4">
            * 실제 비용은 작업 복잡도, 데이터 양, 연동 시스템에 따라 달라집니다. 무료 상담 후 정확한 견적을 드립니다.
          </p>
        </div>
      </div>

      {/* ─── 프리미엄 툴 ─── */}
      <div className="px-6 pb-4 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-400/30 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              PREMIUM TOOLS
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b] mb-2">프리미엄 자동화 프로그램</h2>
            <p className="text-slate-500 text-sm">전문 분야별 고급 자동화 프로그램. 구매 후 소스코드 전달 + 1개월 무상 지원.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {premiumTools.map((tool) => (
              <div key={tool.id}
                className="rounded-2xl overflow-hidden border border-white/10 shadow-xl flex flex-col"
                style={{ background: `linear-gradient(145deg, ${tool.bgFrom}, ${tool.bgTo})` }}>
                {/* 카드 헤더 */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div style={{ color: tool.accentColor }} className="opacity-90">{tool.icon}</div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="bg-white/10 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">PREMIUM</span>
                      <span style={{ color: tool.accentColor }} className="text-xl font-extrabold">{tool.price}</span>
                    </div>
                  </div>
                  <div style={{ color: tool.accentColor }} className="text-xs font-bold mb-1 opacity-80">{tool.subtitle}</div>
                  <h3 className="text-white font-extrabold text-base mb-2 leading-snug" style={{ wordBreak: 'keep-all' }}>{tool.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed" style={{ wordBreak: 'keep-all' }}>{tool.desc}</p>
                </div>
                {/* 기능 목록 */}
                <div className="px-6 pb-4 flex-1">
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    {tool.features.map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: tool.accentColor }} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-white/70 text-xs" style={{ wordBreak: 'keep-all' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 태그 + CTA */}
                <div className="px-6 pb-6">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tool.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20 text-white/60">{tag}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => openModal(`업무 자동화 프리미엄 - ${tool.title}`)}
                    className="w-full py-3 rounded-xl text-sm font-extrabold transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ backgroundColor: tool.accentColor, color: tool.bgFrom }}
                  >
                    구매 문의 · 소스코드 전달 →
                  </button>
                  <p className="text-white/30 text-[10px] text-center mt-2">구매 후 Python 소스코드 + 사용 가이드 전달</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 자동화 툴 무료 다운로드 ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-cyan-600 text-xs font-bold uppercase tracking-widest mb-2">FREE TOOLS</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b] mb-2">자동화 도구 무료 다운로드</h2>
            <p className="text-slate-500 text-sm">직접 만들어 사용 중인 자동화 도구를 무료로 공유합니다.<br />필요에 맞게 수정해서 쓰실 수 있어요.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {tools.map((tool) => (
              <div key={tool.id} style={{ borderColor: tool.borderColor, backgroundColor: tool.bgColor }}
                className="rounded-2xl border-2 p-5 flex flex-col relative">
                {!tool.ready && (
                  <div className="absolute top-3 right-3 bg-slate-200 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">준비중</div>
                )}
                <div style={{ color: tool.color }} className="mb-3">{tool.icon}</div>
                <div style={{ color: tool.color }} className="text-xs font-bold mb-0.5">{tool.subtitle}</div>
                <div className="font-extrabold text-[#04102b] text-sm mb-2">{tool.title}</div>
                <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1">{tool.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tool.tags.map((tag) => (
                    <span key={tag} style={{ color: tool.color, borderColor: tool.borderColor }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-white">{tag}</span>
                  ))}
                </div>
                {tool.ready ? (
                  <Link href={tool.href}
                    style={{ backgroundColor: tool.color }}
                    className="block w-full text-center py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition">
                    상세보기 · 다운로드 →
                  </Link>
                ) : (
                  <button disabled
                    className="block w-full text-center py-2.5 rounded-xl bg-slate-200 text-slate-400 text-sm font-bold cursor-not-allowed">
                    준비 중입니다
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-[#012030] to-[#013d50] rounded-2xl border border-cyan-400/20 p-8 text-center">
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">FREE CONSULTATION</p>
            <h3 className="text-white text-2xl font-extrabold mb-2">어떤 업무든 상담해보세요</h3>
            <p className="text-cyan-100/40 text-sm mb-6">자동화 가능한 업무라면 무엇이든 도와드립니다</p>
            <button
              onClick={() => openModal('업무 자동화')}
              className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-[#012030] px-8 py-3 rounded-xl font-extrabold text-sm transition-all shadow-lg shadow-cyan-900/30"
            >
              자동화 상담 신청 (계약서 포함) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
