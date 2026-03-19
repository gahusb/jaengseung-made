'use client';

import Link from 'next/link';
import { useState } from 'react';

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
    title: '중복 데이터 자동 제거',
    desc: '여러 시트에 흩어진 데이터를 하나로 합치고 중복 행을 자동으로 찾아 제거합니다. 작업 시간 90% 단축.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    title: '일별/월별 집계 자동화',
    desc: '날짜 컬럼 기준으로 일별·주별·월별 합계를 자동 계산하고 별도 시트에 보고서를 생성합니다.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: '폴더 내 파일 일괄 처리',
    desc: '지정한 폴더의 엑셀 파일 전체를 자동으로 열고 데이터를 통합합니다. 파일 수가 많아도 OK.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    title: '서식·색상 자동 지정',
    desc: '값 조건에 따라 셀 색상, 굵기, 테두리를 자동으로 지정합니다. 조건부 서식보다 빠릅니다.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    title: '키워드 일괄 검색·치환',
    desc: '전체 시트에서 특정 단어를 찾아 일괄 변경하거나 해당 행만 별도 추출합니다.',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    title: 'PDF / CSV 자동 저장',
    desc: '작업 완료 후 PDF 또는 CSV 형식으로 자동 저장하고 지정한 폴더에 날짜별로 백업합니다.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
];

const howToUse = [
  { step: '01', title: '파일 다운로드', desc: '아래 버튼으로 .xlsm 파일을 받습니다. 매크로 포함 형식입니다.' },
  { step: '02', title: '매크로 실행 허용', desc: '파일을 열면 상단 노란 바에서 "콘텐츠 사용" 버튼을 클릭합니다.' },
  { step: '03', title: '데이터 시트에 붙여넣기', desc: '"Data" 시트에 내 데이터를 붙여넣습니다. A1부터 시작하면 됩니다.' },
  { step: '04', title: '매크로 버튼 클릭', desc: '"Control" 시트에서 원하는 기능 버튼을 클릭하면 자동 실행됩니다.' },
];

const faqs = [
  {
    q: '맥(Mac)에서도 사용할 수 있나요?',
    a: 'Excel for Mac에서도 대부분 동작하나, VBA 일부 기능(파일 다이얼로그 등)은 Windows 전용입니다. Mac 사용자는 상담을 통해 호환 버전으로 수정 가능합니다.',
  },
  {
    q: '파일이 열리지 않거나 오류가 발생하면요?',
    a: 'Excel 2016 이상 버전을 권장합니다. 보안 정책으로 매크로가 차단된 경우 Excel 옵션 → 보안 센터 → 매크로 설정에서 "알림과 함께 VBA 매크로 사용"으로 변경해 주세요.',
  },
  {
    q: '내 업무에 맞게 수정이 가능한가요?',
    a: '파일 내 VBA 코드는 자유롭게 수정할 수 있습니다. 수정이 어려우시면 맞춤 자동화 개발 서비스로 문의해 주세요. 내 업무에 딱 맞는 버전을 만들어 드립니다.',
  },
];

export default function ExcelToolPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-full bg-[#f0f5ff]">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#052e16] px-6 py-12 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/services/automation"
            className="inline-flex items-center gap-1.5 text-emerald-300/60 hover:text-emerald-300 text-sm mb-6 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            업무 자동화 서비스로 돌아가기
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-10 h-10 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125v-1.125c0-.621.504-1.125 1.125-1.125h1.5m0 0v1.25m0-1.25c0-.621.504-1.125 1.125-1.125h1.5m0 0V7.875m0 0c0-.621.504-1.125 1.125-1.125h8.25c.621 0 1.125.504 1.125 1.125v8.25m0 0v1.125m0-1.125c0 .621-.504 1.125-1.125 1.125H6m12-8.25v8.25" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">FREE TOOL</span>
                <span className="bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">v1.2</span>
                <span className="bg-white/10 text-white/50 text-[10px] font-bold px-2 py-0.5 rounded-full">VBA · Excel</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
                엑셀 자동화 도구<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  Excel Macro Toolkit
                </span>
              </h1>
              <p className="text-emerald-100/50 text-sm leading-relaxed">
                매일 반복하는 엑셀 작업을 버튼 하나로 처리하는 VBA 매크로 모음입니다.<br />
                데이터 정리, 중복 제거, 집계, 보고서 생성까지 실무에서 검증된 기능들만 담았습니다.
              </p>
            </div>
          </div>

          {/* 통계 배지 */}
          <div className="mt-8 inline-grid grid-cols-3 gap-px bg-emerald-400/10 border border-emerald-400/20 rounded-2xl overflow-hidden">
            {[
              { v: '6가지', l: '핵심 기능' },
              { v: '무료', l: '완전 무료' },
              { v: 'Excel 2016+', l: '지원 버전' },
            ].map((s) => (
              <div key={s.l} className="bg-[#052e16]/80 px-5 py-3 text-center">
                <div className="text-white font-extrabold text-base">{s.v}</div>
                <div className="text-emerald-400/50 text-xs mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-10 lg:px-12">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* 다운로드 카드 */}
          <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="text-emerald-700 text-xs font-bold uppercase tracking-widest mb-1">DOWNLOAD</div>
              <div className="font-extrabold text-[#04102b] text-lg mb-1">Excel_Macro_Toolkit_v1.2.xlsm</div>
              <div className="text-slate-500 text-xs mb-3">크기: 약 85KB · 매크로 포함 형식 · 상업적 이용 가능</div>
              <div className="flex flex-wrap gap-2">
                {['VBA 매크로', '6가지 기능', 'Control 시트 UI', '가이드 시트 포함'].map((t) => (
                  <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <a
                href="/downloads/Excel_Macro_Toolkit_v1.2.xlsm"
                download
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-extrabold text-sm transition-all shadow-lg shadow-emerald-900/20 w-full sm:w-48"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                무료 다운로드
              </a>
              <p className="text-[10px] text-slate-400 text-center">로그인 없이 즉시 다운로드</p>
            </div>
          </div>

          {/* 기능 소개 */}
          <div>
            <div className="text-center mb-6">
              <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-1">FEATURES</p>
              <h2 className="text-2xl font-extrabold text-[#04102b]">포함된 기능 6가지</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => (
                <div key={f.title} className={`${f.bg} border-2 ${f.border} rounded-2xl p-5`}>
                  <div className={`${f.color} mb-3`}>{f.icon}</div>
                  <div className="font-bold text-[#04102b] text-sm mb-1.5">{f.title}</div>
                  <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 사용 방법 */}
          <div>
            <div className="text-center mb-6">
              <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-1">HOW TO USE</p>
              <h2 className="text-2xl font-extrabold text-[#04102b]">사용 방법</h2>
            </div>
            <div className="relative">
              <div className="hidden sm:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-200" />
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {howToUse.map((h) => (
                  <div key={h.step} className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#052e16] to-[#14532d] border border-emerald-400/20 flex flex-col items-center justify-center mb-3 shadow-lg">
                      <span className="text-emerald-400 text-[10px] font-bold">STEP</span>
                      <span className="text-white font-extrabold text-lg leading-none">{h.step}</span>
                    </div>
                    <div className="font-bold text-[#04102b] text-sm mb-1">{h.title}</div>
                    <div className="text-slate-500 text-xs leading-relaxed">{h.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 미리보기 (목업) */}
          <div>
            <div className="text-center mb-6">
              <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-1">PREVIEW</p>
              <h2 className="text-2xl font-extrabold text-[#04102b]">화면 미리보기</h2>
            </div>
            <div className="bg-white rounded-2xl border border-[#dbe8ff] overflow-hidden shadow-sm">
              {/* Excel 목업 */}
              <div className="bg-[#1e7145] px-4 py-2 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                </div>
                <span className="text-white/80 text-xs font-medium">Excel_Macro_Toolkit_v1.2.xlsm</span>
              </div>
              {/* 탭 */}
              <div className="flex border-b border-slate-200 bg-slate-50 px-2 pt-1 gap-1 overflow-x-auto">
                {['Control', 'Data', 'Report', 'Guide'].map((tab, i) => (
                  <div key={tab}
                    className={`px-4 py-1.5 text-xs font-bold rounded-t-lg border-t border-x ${i === 0 ? 'bg-white border-slate-200 text-[#1e7145]' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                    {tab}
                  </div>
                ))}
              </div>
              {/* Control 시트 목업 */}
              <div className="p-6 bg-white">
                <div className="text-center mb-5">
                  <div className="text-lg font-extrabold text-[#1e7145] mb-0.5">📊 Excel Macro Toolkit v1.2</div>
                  <div className="text-slate-400 text-xs">원하는 기능 버튼을 클릭하세요</div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: '중복 제거', color: '#16a34a' },
                    { label: '일별 집계', color: '#2563eb' },
                    { label: '파일 통합', color: '#7c3aed' },
                    { label: '서식 자동화', color: '#ea580c' },
                    { label: '키워드 검색', color: '#0891b2' },
                    { label: 'PDF 저장', color: '#dc2626' },
                  ].map((btn) => (
                    <div key={btn.label}
                      style={{ borderColor: btn.color, color: btn.color }}
                      className="border-2 rounded-lg py-3 text-center text-sm font-bold cursor-default hover:opacity-80 transition bg-white shadow-sm">
                      {btn.label}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold mb-1">상태 로그</div>
                  <div className="text-xs text-emerald-600 font-medium">✓ 준비 완료. 데이터 시트에 작업할 데이터를 붙여넣은 후 버튼을 클릭하세요.</div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <div className="text-center mb-6">
              <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-1">FAQ</p>
              <h2 className="text-2xl font-extrabold text-[#04102b]">자주 묻는 질문</h2>
            </div>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#dbe8ff] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left">
                    <span className="font-bold text-[#04102b] text-sm">{faq.q}</span>
                    <svg
                      className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 하단 CTA */}
          <div className="bg-gradient-to-r from-[#052e16] to-[#14532d] rounded-2xl border border-emerald-400/20 p-8 text-center">
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">CUSTOM AUTOMATION</p>
            <h3 className="text-white text-xl font-extrabold mb-2">내 업무에 맞게 수정이 필요하신가요?</h3>
            <p className="text-emerald-100/40 text-sm mb-6">
              기본 도구로 부족하다면, 업무 프로세스에 딱 맞는 전용 자동화 도구를 제작해 드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/downloads/Excel_Macro_Toolkit_v1.2.xlsm"
                download
                className="inline-flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-[#052e16] px-6 py-3 rounded-xl font-extrabold text-sm transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                무료 다운로드
              </a>
              <Link href="/freelance?service=업무+자동화"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-extrabold text-sm transition-all">
                맞춤 개발 문의 →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
