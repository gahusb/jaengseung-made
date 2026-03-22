'use client';

import Link from 'next/link';

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    title: '표지 · 내용 · 마무리 자동 생성',
    desc: '표지(제목/날짜), 내용 슬라이드(불릿 포인트), 마무리 슬라이드까지 3가지 레이아웃을 자동으로 구성합니다.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125v-1.125c0-.621.504-1.125 1.125-1.125h1.5m0 0v1.25m0-1.25c0-.621.504-1.125 1.125-1.125h1.5m0 0V7.875m0 0c0-.621.504-1.125 1.125-1.125h8.25c.621 0 1.125.504 1.125 1.125v8.25m0 0v1.125m0-1.125c0 .621-.504 1.125-1.125 1.125H6m12-8.25v8.25" />
      </svg>
    ),
    title: '엑셀에서 데이터 일괄 생성',
    desc: 'data.xlsx 파일의 A열(제목), B~열(불릿 내용)을 읽어 슬라이드를 자동 생성합니다. 수십 장도 한 번에 처리.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88" />
      </svg>
    ),
    title: '색상 테마 커스터마이징',
    desc: '상단 설정 영역에서 PRIMARY, SECONDARY, ACCENT 색상을 RGB로 변경하면 전체 슬라이드에 즉시 반영됩니다.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    title: '슬라이드 번호 자동 추가',
    desc: '각 내용 슬라이드 우측 상단에 슬라이드 번호(01, 02...)가 자동으로 표시됩니다. 따로 설정할 필요 없음.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    ),
    title: '16:9 비율 · 맑은 고딕 폰트',
    desc: '발표 표준 비율인 16:9(13.33×7.5인치)로 설정되며, 한글 가독성이 좋은 맑은 고딕 폰트를 기본 적용합니다.',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
    title: '예시 데이터 자동 실행',
    desc: 'data.xlsx 파일이 없어도 내장 예시 데이터로 바로 실행됩니다. 처음 사용할 때 결과를 즉시 확인 가능.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
];

const howToUse = [
  {
    step: '01',
    title: '패키지 설치',
    desc: '터미널에서 필요한 Python 패키지를 설치합니다.',
    code: 'pip install python-pptx openpyxl',
    color: 'bg-orange-500',
  },
  {
    step: '02',
    title: '설정 수정',
    desc: '스크립트 상단 설정 영역에서 제목, 날짜, 색상 테마를 수정합니다.',
    code: 'TITLE_TEXT = "발표 제목"\nCOLOR_PRIMARY = RGBColor(0x1D, 0x4E, 0xD8)',
    color: 'bg-emerald-500',
  },
  {
    step: '03',
    title: '엑셀 데이터 준비',
    desc: 'data.xlsx를 만들어 A열=슬라이드 제목, B~열=불릿 내용을 입력합니다. (없으면 예시 데이터로 실행)',
    code: 'A열: 슬라이드 제목\nB~열: 불릿 포인트 내용',
    color: 'bg-violet-500',
  },
  {
    step: '04',
    title: '실행 후 확인',
    desc: '터미널에서 스크립트를 실행하면 같은 폴더에 PPT 파일이 자동 저장됩니다.',
    code: 'python ppt_automation_v1.0.py',
    color: 'bg-blue-500',
  },
];

const faqs = [
  {
    q: '엑셀 파일이 없어도 실행되나요?',
    a: 'data.xlsx 파일이 없으면 내장 예시 데이터로 자동 실행됩니다. 먼저 결과를 확인한 뒤 자신의 데이터로 교체하면 됩니다.',
  },
  {
    q: '슬라이드 수에 제한이 있나요?',
    a: '제한 없습니다. 엑셀에 입력한 행 수만큼 슬라이드가 생성됩니다. 단, 슬라이드당 불릿 포인트는 최대 8개입니다.',
  },
  {
    q: '챕터 구분 슬라이드도 넣을 수 있나요?',
    a: 'create_divider_slide() 함수가 포함되어 있습니다. main() 함수에서 원하는 위치에 호출하면 챕터 구분 슬라이드를 추가할 수 있습니다.',
  },
  {
    q: '맥(Mac)에서도 사용할 수 있나요?',
    a: '맥에서도 동일하게 사용 가능합니다. 단, 맥에는 맑은 고딕 폰트가 없으므로 FONT_NAME을 "AppleGothic" 또는 "Nanum Gothic"으로 변경하세요.',
  },
];

export default function PptToolPage() {
  return (
    <div className="min-h-full bg-[#f0f5ff]">

      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a0a3d] via-[#2d1560] to-[#1a0a3d] px-6 py-14 lg:px-12">
        <div className="absolute inset-0 opacity-[0.05]">
          <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">
            <rect x="50" y="40" width="200" height="130" rx="6" fill="none" stroke="#c084fc" strokeWidth="1.5"/>
            <line x1="70" y1="70" x2="230" y2="70" stroke="#c084fc" strokeWidth="1"/>
            <line x1="70" y1="90" x2="200" y2="90" stroke="#c084fc" strokeWidth="1"/>
            <line x1="70" y1="110" x2="210" y2="110" stroke="#c084fc" strokeWidth="1"/>
            <rect x="320" y="60" width="200" height="130" rx="6" fill="none" stroke="#c084fc" strokeWidth="1.5"/>
            <rect x="340" y="75" width="160" height="20" rx="3" fill="#c084fc" fillOpacity="0.2"/>
            <line x1="340" y1="110" x2="500" y2="110" stroke="#c084fc" strokeWidth="1"/>
            <line x1="340" y1="130" x2="480" y2="130" stroke="#c084fc" strokeWidth="1"/>
            <rect x="590" y="40" width="160" height="130" rx="6" fill="none" stroke="#c084fc" strokeWidth="1.5"/>
            <line x1="610" y1="100" x2="730" y2="100" stroke="#c084fc" strokeWidth="1.5"/>
            <line x1="660" y1="110" x2="660" y2="160" stroke="#c084fc" strokeWidth="1"/>
            <path d="M610 160 L660 110 L710 145 L730 120" fill="none" stroke="#c084fc" strokeWidth="1.5"/>
          </svg>
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <Link href="/services/automation" className="inline-flex items-center gap-1.5 text-purple-300/60 hover:text-purple-300 text-sm mb-6 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            업무 자동화로
          </Link>

          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-400/15 border border-purple-400/25 flex items-center justify-center mb-5">
            <svg className="w-9 h-9 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
          </div>

          <p className="text-purple-400/70 text-xs font-bold uppercase tracking-widest mb-2">PPT AUTOMATION · 프레젠테이션 자동화</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            PPT 제작을<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">코드로 자동화</span>
          </h1>
          <p className="text-purple-100/50 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-6">
            엑셀 데이터만 준비하면 표지·내용·마무리 슬라이드를 자동 생성.<br />
            python-pptx 기반으로 디자인까지 자동 적용됩니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/downloads/ppt_automation_v1.0.py"
              download
              className="inline-flex items-center gap-2 bg-purple-400 hover:bg-purple-300 text-[#1a0a3d] px-8 py-3.5 rounded-xl font-extrabold text-sm transition-all shadow-lg shadow-purple-900/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              무료 다운로드 (Python .py)
            </a>
            <Link href="/freelance?service=PPT+자동화+맞춤+개발"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-xl font-bold text-sm transition-all">
              맞춤 개발 문의 →
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 다운로드 카드 ─── */}
      <div className="px-6 py-10 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-purple-600 text-xs font-bold">PPT AUTOMATION v1.0</span>
                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">무료</span>
              </div>
              <div className="font-extrabold text-[#04102b] text-lg mb-1">PPT 제작 자동화 도구</div>
              <p className="text-slate-500 text-sm">python-pptx 기반 · 엑셀 연동 · 표지/내용/마무리 자동 생성 · 색상 테마 커스터마이징</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Python 3.8+', 'python-pptx', 'openpyxl', '한글 지원', '엑셀 연동'].map((tag) => (
                  <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200 text-purple-600 bg-purple-50">{tag}</span>
                ))}
              </div>
            </div>
            <a
              href="/downloads/ppt_automation_v1.0.py"
              download
              className="flex-shrink-0 inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              다운로드
            </a>
          </div>
        </div>
      </div>

      {/* ─── 기능 ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-purple-600 text-xs font-bold uppercase tracking-widest mb-2">FEATURES</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">주요 기능</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className={`bg-white rounded-2xl border-2 ${f.border} p-5`}>
                <div className={`w-9 h-9 rounded-xl ${f.bg} flex items-center justify-center mb-3 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-[#04102b] text-sm mb-2">{f.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 사용법 ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-purple-600 text-xs font-bold uppercase tracking-widest mb-2">HOW TO USE</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">사용 방법</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {howToUse.map((h) => (
              <div key={h.step} className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${h.color} flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0`}>
                    {h.step}
                  </div>
                  <h3 className="font-bold text-[#04102b] text-sm">{h.title}</h3>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed mb-3">{h.desc}</p>
                <div className="bg-[#1a0a3d] rounded-xl px-4 py-3 font-mono text-[11px] text-purple-200 whitespace-pre leading-relaxed">
                  {h.code}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 코드 미리보기 ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-purple-600 text-xs font-bold uppercase tracking-widest mb-2">PREVIEW</p>
            <h2 className="text-2xl font-extrabold text-[#04102b]">설정 영역 미리보기</h2>
            <p className="text-slate-500 text-sm mt-1">이 부분만 수정하면 원하는 PPT가 완성됩니다</p>
          </div>
          <div className="bg-[#1a0a3d] rounded-2xl overflow-hidden border border-purple-900/40">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-purple-900/40">
              <div className="w-3 h-3 rounded-full bg-rose-400/70" />
              <div className="w-3 h-3 rounded-full bg-amber-400/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
              <span className="ml-2 text-purple-300/50 text-xs font-mono">ppt_automation_v1.0.py</span>
            </div>
            <pre className="px-5 py-5 text-xs font-mono text-purple-100 leading-6 overflow-x-auto">{`<span class="text-purple-400"># ── 설정 (이 부분을 수정하세요) ──────────────</span>

DATA_FILE   = <span class="text-amber-300">"data.xlsx"</span>       <span class="text-slate-400"># 입력 엑셀 파일</span>
OUTPUT_FILE = f<span class="text-amber-300">"발표자료_{datetime}.pptx"</span>

<span class="text-slate-400"># 표지 정보</span>
TITLE_TEXT    = <span class="text-amber-300">"발표 제목을 입력하세요"</span>
SUBTITLE_TEXT = <span class="text-amber-300">"부제목 또는 발표자 이름"</span>
DATE_TEXT     = <span class="text-amber-300">"2025년 01월 01일"</span>

<span class="text-slate-400"># 색상 테마 (RGB 값으로 변경)</span>
COLOR_PRIMARY   = RGBColor(<span class="text-emerald-400">0x1D, 0x4E, 0xD8</span>)  <span class="text-slate-400"># 파란색</span>
COLOR_SECONDARY = RGBColor(<span class="text-emerald-400">0x0F, 0x17, 0x2A</span>)  <span class="text-slate-400"># 다크 네이비</span>
COLOR_ACCENT    = RGBColor(<span class="text-emerald-400">0x60, 0xA5, 0xFA</span>)  <span class="text-slate-400"># 라이트 블루</span>

FONT_NAME = <span class="text-amber-300">"맑은 고딕"</span>   <span class="text-slate-400"># 한글 폰트</span>`}
            </pre>
          </div>
          <p className="text-center text-slate-400 text-xs mt-3">
            * 코드 미리보기는 실제 파일의 일부입니다. 다운로드 후 설정 영역 전체를 수정해서 사용하세요.
          </p>
        </div>
      </div>

      {/* ─── FAQ ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-purple-600 text-xs font-bold uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">자주 묻는 질문</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-start gap-3">
                  <span className="text-purple-600 font-extrabold text-sm flex-shrink-0 mt-0.5">Q.</span>
                  <div>
                    <div className="font-bold text-[#04102b] text-sm mb-1.5">{faq.q}</div>
                    <div className="text-slate-500 text-xs leading-relaxed">{faq.a}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-[#1a0a3d] to-[#2d1560] rounded-2xl border border-purple-400/20 p-8 text-center">
            <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-2">CUSTOM DEVELOPMENT</p>
            <h3 className="text-white text-2xl font-extrabold mb-2">더 복잡한 PPT 자동화가 필요하신가요?</h3>
            <p className="text-purple-100/40 text-sm mb-6">
              이미지 삽입, 차트 자동 생성, 브랜드 템플릿 적용 등<br />
              맞춤 PPT 자동화를 개발해드립니다.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/downloads/ppt_automation_v1.0.py"
                download
                className="inline-flex items-center gap-2 bg-purple-400 hover:bg-purple-300 text-[#1a0a3d] px-8 py-3 rounded-xl font-extrabold text-sm transition-all shadow-lg shadow-purple-900/30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                무료 버전 다운로드
              </a>
              <Link href="/freelance?service=PPT+자동화+맞춤+개발"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-bold text-sm transition-all">
                맞춤 개발 문의 →
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
