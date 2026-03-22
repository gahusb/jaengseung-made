'use client';

import Link from 'next/link';
import { useState } from 'react';

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: '웹 페이지 데이터 자동 수집',
    desc: '공공데이터, 쇼핑몰 가격, 뉴스 기사 등 원하는 페이지의 데이터를 자동으로 수집합니다.',
    color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    title: '엑셀 자동 저장',
    desc: '수집한 데이터를 열 서식, 헤더 스타일이 적용된 엑셀 파일로 자동 저장합니다.',
    color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
      </svg>
    ),
    title: '페이지네이션 자동 탐색',
    desc: '다음 페이지 링크를 자동으로 찾아 여러 페이지의 데이터를 연속으로 수집합니다.',
    color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: '재시도 로직 내장',
    desc: '네트워크 오류나 일시적 접속 실패 시 자동으로 재시도합니다. 수집 실패 최소화.',
    color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: '요청 간격 자동 조절',
    desc: '서버에 부하를 주지 않도록 요청 간격을 자동으로 조절합니다. 차단 위험 최소화.',
    color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: '로그 파일 자동 저장',
    desc: '수집 과정 전체를 로그로 남겨 나중에 어떤 URL에서 몇 건을 수집했는지 확인 가능합니다.',
    color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200',
  },
];

const howToUse = [
  { step: '01', title: 'Python 설치', desc: 'python.org에서 Python 3.10 이상을 설치하세요. "Add to PATH" 체크 필수.' },
  { step: '02', title: '패키지 설치', desc: '터미널에서 pip install requests beautifulsoup4 openpyxl lxml 실행.' },
  { step: '03', title: 'URL 설정', desc: '파일 상단 TARGET_URL에 크롤링할 주소를 입력하세요.' },
  { step: '04', title: '실행', desc: 'python web_scraper_v1.0.py 실행 → 같은 폴더에 엑셀 파일이 생성됩니다.' },
];

const faqs = [
  {
    q: '크롤링이 법적으로 문제없나요?',
    a: '공개된 정보 수집 자체는 일반적으로 허용되지만, 사이트의 robots.txt와 이용약관을 반드시 확인하세요. 로그인이 필요한 페이지, 개인정보, 저작권 데이터 수집은 법적 문제가 생길 수 있습니다.',
  },
  {
    q: '자바스크립트로 렌더링되는 사이트도 되나요?',
    a: 'requests + BeautifulSoup은 정적 HTML만 수집합니다. JS 렌더링 사이트(React, Vue 등)는 Selenium/Playwright가 필요하며, 맞춤 개발 서비스로 문의 주시면 구현해 드립니다.',
  },
  {
    q: '원하는 항목만 골라서 수집할 수 있나요?',
    a: '파일 내 extract_data 함수를 수정하면 됩니다. HTML 선택자(CSS Selector)로 원하는 요소만 지정할 수 있으며, 코드 내 주석에 예시가 포함되어 있습니다.',
  },
];

export default function ScraperToolPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-full bg-[#f0f5ff]">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#1e3a8a] px-6 py-12 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/services/automation"
            className="inline-flex items-center gap-1.5 text-blue-300/60 hover:text-blue-300 text-sm mb-6 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            업무 자동화 서비스로 돌아가기
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-blue-400/15 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-10 h-10 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">FREE TOOL</span>
                <span className="bg-blue-400/20 border border-blue-400/40 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full">v1.0</span>
                <span className="bg-white/10 text-white/50 text-[10px] font-bold px-2 py-0.5 rounded-full">Python · BeautifulSoup</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
                웹 크롤링 자동화 도구<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                  Web Scraper
                </span>
              </h1>
              <p className="text-blue-100/50 text-sm leading-relaxed">
                공공데이터, 가격 비교, 뉴스 수집까지 — 원하는 웹 페이지의 데이터를 자동으로 수집해<br />
                엑셀 파일로 저장합니다. Python 기초 지식만 있으면 바로 사용 가능합니다.
              </p>
            </div>
          </div>

          <div className="mt-8 inline-grid grid-cols-3 gap-px bg-blue-400/10 border border-blue-400/20 rounded-2xl overflow-hidden">
            {[
              { v: '6가지', l: '핵심 기능' },
              { v: '무료', l: '완전 무료' },
              { v: 'Python 3.10+', l: '지원 버전' },
            ].map((s) => (
              <div key={s.l} className="bg-[#1e3a8a]/60 px-5 py-3 text-center">
                <div className="text-white font-extrabold text-base">{s.v}</div>
                <div className="text-blue-400/50 text-xs mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-10 lg:px-12">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* 다운로드 카드 */}
          <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="text-blue-700 text-xs font-bold uppercase tracking-widest mb-1">DOWNLOAD</div>
              <div className="font-extrabold text-[#04102b] text-lg mb-1">web_scraper_v1.0.py</div>
              <div className="text-slate-500 text-xs mb-3">크기: 약 8KB · Python 스크립트 · 상업적 이용 가능</div>
              <div className="flex flex-wrap gap-2">
                {['Python 3.10+', '페이지네이션', '재시도 로직', '엑셀 자동 저장', '로그 저장'].map((t) => (
                  <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200 text-blue-700 bg-blue-50">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <a
                href="/downloads/web_scraper_v1.0.py"
                download
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-extrabold text-sm transition-all shadow-lg shadow-blue-900/20 w-full sm:w-48"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                무료 다운로드
              </a>
              <p className="text-[10px] text-slate-400 text-center">로그인 없이 즉시 다운로드</p>
            </div>
          </div>

          {/* 기능 목록 */}
          <div>
            <h2 className="text-xl font-extrabold text-[#04102b] mb-5">포함된 기능</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => (
                <div key={f.title} className={`rounded-xl border p-4 ${f.bg} ${f.border}`}>
                  <div className={`${f.color} mb-3`}>{f.icon}</div>
                  <div className={`text-xs font-bold mb-1 ${f.color}`}>{f.title}</div>
                  <p className="text-slate-600 text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 사용 방법 */}
          <div>
            <h2 className="text-xl font-extrabold text-[#04102b] mb-5">사용 방법</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {howToUse.map((h) => (
                <div key={h.step} className="bg-white rounded-xl border border-[#dbe8ff] p-5 flex gap-4">
                  <div className="text-blue-600 text-2xl font-black leading-none flex-shrink-0">{h.step}</div>
                  <div>
                    <div className="font-bold text-[#04102b] text-sm mb-1">{h.title}</div>
                    <p className="text-slate-500 text-xs leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 코드 예시 */}
          <div className="bg-[#0f172a] rounded-2xl p-6 overflow-x-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">CODE PREVIEW</span>
              <span className="text-slate-600 text-xs">extract_data 함수 수정 예시</span>
            </div>
            <pre className="text-sm text-slate-300 leading-relaxed font-mono whitespace-pre">{`def extract_data(soup, page_url):
    items = []
    # 상품 목록 수집 예시
    for item in soup.select(".product-item"):
        name  = item.select_one(".name")
        price = item.select_one(".price")
        items.append({
            "상품명": name.get_text(strip=True),
            "가격":   price.get_text(strip=True),
            "URL":    page_url,
        })
    return items`}</pre>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-extrabold text-[#04102b] mb-5">자주 묻는 질문</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#dbe8ff] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="font-bold text-[#04102b] text-sm">{faq.q}</span>
                    <svg className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-slate-500 text-sm leading-relaxed border-t border-[#dbe8ff] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1d4ed8] rounded-2xl p-8 text-center">
            <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-2">CUSTOM DEVELOPMENT</p>
            <h3 className="text-white text-xl font-extrabold mb-2">더 복잡한 크롤링이 필요하다면?</h3>
            <p className="text-blue-100/50 text-sm mb-6 leading-relaxed">
              JS 렌더링 사이트, 로그인 필요, 대용량 수집, 자동 스케줄링까지<br />
              맞춤 개발로 정확히 원하는 데이터를 가져옵니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/downloads/web_scraper_v1.0.py"
                download
                className="inline-flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-300 text-[#1e3a8a] px-6 py-3 rounded-xl font-extrabold text-sm transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                무료 다운로드
              </a>
              <Link href="/freelance?service=업무+자동화"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-extrabold text-sm transition-all">
                맞춤 크롤러 개발 문의 →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
