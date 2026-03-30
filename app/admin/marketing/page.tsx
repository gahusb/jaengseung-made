'use client';

import { useState, useEffect, useCallback } from 'react';

const ASSETS = [
  {
    file: '/marketing/thumb-homepage-A.svg',
    name: '홈페이지 제작 썸네일 A',
    desc: '신뢰형 — 브라우저 목업 + 경력 강조',
    size: '1200 × 675',
    platform: '크몽 메인',
    color: '#2563eb',
    service: '홈페이지 제작',
    price: '스타터 50만원~',
  },
  {
    file: '/marketing/thumb-homepage-B.svg',
    name: '홈페이지 제작 썸네일 B',
    desc: '스펙 강조형 — 3플랜 카드 비교',
    size: '1200 × 675',
    platform: '크몽 서브',
    color: '#7c3aed',
    service: '홈페이지 제작',
    price: '스타터 50만원~',
  },
  {
    file: '/marketing/thumb-automation.svg',
    name: '업무 자동화 썸네일',
    desc: '시간 절약형 — 자동화 플로우 다이어그램',
    size: '1200 × 675',
    platform: '크몽 메인',
    color: '#10b981',
    service: '업무 자동화',
    price: '33만원~',
  },
  {
    file: '/marketing/thumb-prompt.svg',
    name: '프롬프트 엔지니어링 썸네일',
    desc: 'Before/After 비교형 — AI 최적화 결과 시각화',
    size: '1200 × 675',
    platform: '크몽 메인',
    color: '#7c3aed',
    service: '프롬프트 엔지니어링',
    price: '10만원~',
  },
  {
    file: '/marketing/thumb-stock.svg',
    name: '주식 자동매매 썸네일',
    desc: '폰 목업 + 텔레그램 알림 UI',
    size: '1200 × 675',
    platform: '크몽 메인',
    color: '#22c55e',
    service: '주식 자동매매',
    price: '9만9천원~',
  },
  {
    file: '/marketing/thumb-lotto.svg',
    name: '로또 번호 추천 썸네일',
    desc: '빅데이터 분석형 — 번호 통계 시각화',
    size: '1200 × 675',
    platform: '크몽 메인',
    color: '#f59e0b',
    service: '로또 번호 추천',
    price: '900원~/월',
  },
  {
    file: '/marketing/thumb-saju.svg',
    name: 'AI 사주 분석 썸네일',
    desc: '사주팔자 + AI 해석 — 전통+현대 비주얼',
    size: '1200 × 675',
    platform: '크몽 메인',
    color: '#8b5cf6',
    service: 'AI 사주 분석',
    price: '4,900원',
  },
  {
    file: '/marketing/banner-homepage.svg',
    name: '홈페이지 제작 배너',
    desc: '가로형 배너 — 블로그/SNS 활용',
    size: '1200 × 400',
    platform: '블로그/SNS',
    color: '#2563eb',
    service: '홈페이지 제작',
    price: '스타터 50만원~',
  },
];

const CHECKLIST_ITEMS = {
  design: [
    '시각적 위계가 명확하다 (헤드라인 → 서브 → 기능 → 가격)',
    '색상 대비가 가독성 기준을 충족한다 (어두운 배경/밝은 텍스트)',
    '브랜드 색상이 사이트와 일관되게 사용되었다',
    '정보가 과밀하지 않고 여백이 충분하다',
    '폰트 크기가 썸네일 목록에서도 가독성이 있다 (헤드 52px+)',
    '오른쪽 비주얼(목업)이 서비스 내용과 직결된다',
  ],
  pm: [
    '서비스명이 한눈에 들어온다 (1초 이내 파악)',
    '핵심 가치 제안이 1~2줄 이내로 명확히 전달된다',
    '가격 또는 플랜이 뱃지 형태로 명확히 표시된다',
    'URL 또는 브랜드명이 하단에 포함된다',
    '대상 고객의 니즈가 암묵적으로 전달된다',
    '파일 사이즈가 플랫폼 요구사항(1200×675)을 충족한다',
  ],
  quality: [
    '텍스트에 오탈자·맞춤법 오류가 없다',
    '가격 정보가 실제 서비스 가격과 일치한다',
    '깨진 이미지나 렌더링 오류가 없다',
    '동일 색상/레이아웃을 다른 썸네일과 중복 사용하지 않는다',
    '법적 문제(허위광고, 저작권) 소지가 없다',
    'PNG 변환 후에도 품질이 유지된다 (벡터 기반)',
  ],
  marketing: [
    '타겟 고객의 핵심 페인포인트를 헤드라인에서 직접 해소한다',
    '"납기 100% · 연락두절 없음" 등 약속 기반 차별화 요소가 포함된다',
    '경쟁사 대비 명확한 차별점이 드러난다',
    '첫 3초 안에 무슨 서비스인지 파악 가능하다',
    '클릭 충동을 자극하는 강력한 헤드라인이다',
    '크몽 검색 목록에서 눈에 띄는 디자인이다',
  ],
};

type CheckKey = string;

export default function MarketingPage() {
  const [preview, setPreview] = useState<typeof ASSETS[0] | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [checks, setChecks] = useState<Record<CheckKey, boolean>>({});
  const [showGuide, setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'design' | 'pm' | 'quality' | 'marketing'>('design');
  const [convertingPng, setConvertingPng] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('marketing_checks');
    if (saved) setChecks(JSON.parse(saved));
  }, []);

  const toggleCheck = useCallback((key: string) => {
    setChecks(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('marketing_checks', JSON.stringify(next));
      return next;
    });
  }, []);

  const getCheckScore = (assetFile: string, category: keyof typeof CHECKLIST_ITEMS) => {
    const items = CHECKLIST_ITEMS[category];
    const done = items.filter((_, i) => checks[`${assetFile}_${category}_${i}`]).length;
    return { done, total: items.length };
  };

  const getTotalScore = (assetFile: string) => {
    const all = Object.keys(CHECKLIST_ITEMS).flatMap(cat =>
      CHECKLIST_ITEMS[cat as keyof typeof CHECKLIST_ITEMS].map((_, i) => checks[`${assetFile}_${cat}_${i}`])
    );
    return { done: all.filter(Boolean).length, total: all.length };
  };

  function copyPath(file: string) {
    const url = `${window.location.origin}${file}`;
    navigator.clipboard.writeText(url);
    setCopied(file);
    setTimeout(() => setCopied(null), 2000);
  }

  function download(file: string, name: string) {
    const a = document.createElement('a');
    a.href = file;
    a.download = name.replace(/\s/g, '_') + '.svg';
    a.click();
  }

  async function downloadAsPng(file: string, name: string, size: string) {
    const [wStr, hStr] = size.split(' × ');
    const w = parseInt(wStr);
    const h = parseInt(hStr);
    setConvertingPng(file);
    try {
      const resp = await fetch(file);
      const svgText = await resp.text();
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, w, h);
          URL.revokeObjectURL(img.src);
          canvas.toBlob((blob) => {
            if (!blob) { reject(new Error('변환 실패')); return; }
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = name.replace(/\s/g, '_') + '.png';
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            resolve();
          }, 'image/png');
        };
        img.onerror = () => reject(new Error('SVG 로드 실패'));
        const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
        img.src = URL.createObjectURL(blob);
      });
    } catch {
      alert('PNG 변환에 실패했습니다. SVG를 브라우저에서 열어 우클릭 → 이미지로 저장을 시도해 주세요.');
    } finally {
      setConvertingPng(null);
    }
  }

  const TABS = [
    { key: 'design', label: '디자인', icon: '🎨', color: 'blue' },
    { key: 'pm', label: 'PM', icon: '📋', color: 'violet' },
    { key: 'quality', label: '품질', icon: '✅', color: 'emerald' },
    { key: 'marketing', label: '마케팅', icon: '📣', color: 'amber' },
  ] as const;

  const tabColors: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    violet: 'bg-violet-500/20 text-violet-300 border-violet-500/50',
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
  };

  return (
    <div className="p-8 max-w-[1400px]">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">마케팅 에셋</h1>
            <p className="text-slate-400 text-sm">크몽·숨고 등록용 썸네일 및 배너 — 4대 전문가 품질 체크리스트 포함</p>
          </div>
          <button
            onClick={() => setShowGuide(v => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-all"
          >
            <span>📖</span>
            {showGuide ? '가이드 닫기' : '등록 가이드 보기'}
          </button>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: '전체 에셋', value: ASSETS.length, unit: '개', color: 'text-white' },
            { label: '썸네일', value: ASSETS.filter(a => a.size.includes('675')).length, unit: '개', color: 'text-blue-400' },
            { label: '배너', value: ASSETS.filter(a => a.size.includes('400')).length, unit: '개', color: 'text-violet-400' },
            { label: '크몽 등록 가능', value: ASSETS.length, unit: '개', color: 'text-emerald-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-900 rounded-xl border border-slate-800 px-4 py-3">
              <p className="text-slate-500 text-xs mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}<span className="text-sm font-normal text-slate-500 ml-1">{stat.unit}</span></p>
            </div>
          ))}
        </div>
      </div>

      {/* 크몽 등록 가이드 */}
      {showGuide && (
        <div className="mb-8 bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
            <span className="text-yellow-400">⚡</span>
            <h2 className="text-white font-bold text-sm">크몽 썸네일 등록 완전 가이드</h2>
          </div>
          <div className="p-6 grid grid-cols-3 gap-6">
            <div>
              <h3 className="text-blue-400 font-semibold text-sm mb-3 flex items-center gap-2"><span>1️⃣</span> PNG 다운로드 방법</h3>
              <ol className="space-y-2 text-slate-400 text-sm">
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">✓</span><span><span className="text-white font-semibold">PNG 다운로드</span> 버튼 클릭 → 즉시 변환</span></li>
                <li className="flex gap-2"><span className="text-slate-600 shrink-0">①</span>브라우저가 SVG를 직접 렌더링하여 PNG 생성</li>
                <li className="flex gap-2"><span className="text-slate-600 shrink-0">②</span>한글 폰트(맑은 고딕)가 깨지지 않고 그대로 캡처됨</li>
              </ol>
              <div className="mt-3 px-3 py-2 bg-blue-900/20 border border-blue-500/30 rounded-lg text-blue-300 text-xs">
                외부 변환 도구 불필요 — 브라우저에서 직접 PNG로 변환합니다.
              </div>
            </div>
            <div>
              <h3 className="text-violet-400 font-semibold text-sm mb-3 flex items-center gap-2"><span>2️⃣</span> 크몽 서비스 등록 체크</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                {['썸네일: 1200×675px (권장)', '파일 크기: 10MB 이하', '형식: JPG, PNG', '서비스 카테고리 정확히 선택', '가격 설정: 기본/스탠다드/프리미엄', '패키지 설명 500자 이상'].map(item => (
                  <li key={item} className="flex gap-2"><span className="text-emerald-400">✓</span>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-emerald-400 font-semibold text-sm mb-3 flex items-center gap-2"><span>3️⃣</span> 전문가 검토 순서</h3>
              <div className="space-y-2">
                {TABS.map(tab => (
                  <div key={tab.key} className="flex items-center gap-3 text-sm">
                    <span>{tab.icon}</span>
                    <div>
                      <span className="text-white font-medium">{tab.label} 전문가</span>
                      <p className="text-slate-500 text-xs">
                        {tab.key === 'design' && '시각 위계·색상·가독성 검토'}
                        {tab.key === 'pm' && '정보 완전성·CTA·플랫폼 요건'}
                        {tab.key === 'quality' && '오탈자·가격 정확성·파일 품질'}
                        {tab.key === 'marketing' && '전환율·차별화·클릭 유도'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 에셋 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {ASSETS.map((asset) => {
          const score = getTotalScore(asset.file);
          const pct = score.total > 0 ? Math.round((score.done / score.total) * 100) : 0;
          const isReady = pct >= 80;
          return (
            <div key={asset.file} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-600 transition-all group flex flex-col">
              {/* 미리보기 */}
              <button
                onClick={() => setPreview(asset)}
                className="w-full block relative overflow-hidden bg-slate-950 flex-shrink-0"
                style={{ aspectRatio: asset.size.includes('400') ? '3/1' : '16/9' }}
              >
                <img
                  src={asset.file}
                  alt={asset.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white font-semibold text-sm bg-black/70 px-4 py-2 rounded-full transition-all flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    체크리스트 열기
                  </span>
                </div>
                {/* 품질 뱃지 */}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${isReady ? 'bg-emerald-500/90 text-white' : pct > 0 ? 'bg-amber-500/90 text-white' : 'bg-slate-700/90 text-slate-300'}`}>
                  {isReady ? '✓ 등록 준비됨' : pct > 0 ? `${pct}% 완료` : '미검토'}
                </div>
              </button>

              {/* 카드 정보 */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm truncate">{asset.name}</h3>
                    <p className="text-slate-500 text-xs mt-0.5">{asset.desc}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full shrink-0 whitespace-nowrap" style={{ background: asset.color + '20', color: asset.color }}>
                    {asset.platform}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-slate-600 text-xs">{asset.size}px</span>
                  <span className="text-slate-700">·</span>
                  <span className="text-slate-500 text-xs font-medium">{asset.price}</span>
                </div>

                {/* 체크리스트 진행 바 */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-600 text-xs">품질 체크</span>
                    <span className="text-slate-500 text-xs">{score.done}/{score.total}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: isReady ? '#10b981' : pct > 0 ? '#f59e0b' : '#334155' }}
                    />
                  </div>
                </div>

                {/* 4대 전문가 점수 */}
                <div className="grid grid-cols-4 gap-1 mb-3">
                  {TABS.map(tab => {
                    const s = getCheckScore(asset.file, tab.key);
                    const ok = s.done === s.total && s.total > 0;
                    return (
                      <div key={tab.key} className={`text-center py-1 rounded-md text-xs ${ok ? 'bg-emerald-900/30 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        <div>{tab.icon}</div>
                        <div className="mt-0.5">{s.done}/{s.total}</div>
                      </div>
                    );
                  })}
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => downloadAsPng(asset.file, asset.name, asset.size)}
                    disabled={convertingPng === asset.file}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    {convertingPng === asset.file ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                        변환 중...
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        PNG 다운로드
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => download(asset.file, asset.name)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                    title="SVG 원본 다운로드"
                  >
                    SVG
                  </button>
                  <button
                    onClick={() => copyPath(asset.file)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${copied === asset.file ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'}`}
                  >
                    {copied === asset.file ? '✓' : 'URL'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 모달 — 크게 보기 + 체크리스트 */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-start justify-center overflow-y-auto p-6"
          onClick={() => setPreview(null)}
        >
          <div className="max-w-7xl w-full my-4" onClick={(e) => e.stopPropagation()}>
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-white font-bold text-xl">{preview.name}</h2>
                <p className="text-slate-400 text-sm mt-0.5">{preview.size}px · {preview.desc}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => downloadAsPng(preview.file, preview.name, preview.size)}
                  disabled={convertingPng === preview.file}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-all flex items-center gap-2"
                >
                  {convertingPng === preview.file ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                      변환 중...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                      PNG 다운로드
                    </>
                  )}
                </button>
                <button
                  onClick={() => download(preview.file, preview.name)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all"
                  title="SVG 원본 다운로드"
                >
                  SVG
                </button>
                <button onClick={() => setPreview(null)} className="text-slate-400 hover:text-white w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all text-xl">
                  ×
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
              {/* 미리보기 */}
              <div>
                <img
                  src={preview.file}
                  alt={preview.name}
                  className="w-full rounded-xl border border-slate-700"
                />
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {TABS.map(tab => {
                    const s = getCheckScore(preview.file, tab.key);
                    const pct2 = Math.round((s.done / s.total) * 100);
                    return (
                      <div key={tab.key} className="bg-slate-900 rounded-xl p-3 text-center">
                        <div className="text-xl mb-1">{tab.icon}</div>
                        <div className="text-white font-bold text-sm">{tab.label}</div>
                        <div className="text-slate-400 text-xs mt-0.5">{s.done}/{s.total} 항목</div>
                        <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pct2}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 체크리스트 패널 */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
                <div className="flex border-b border-slate-800">
                  {TABS.map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 py-3 text-xs font-semibold transition-all ${
                        activeTab === tab.key
                          ? 'text-white border-b-2 border-blue-500 bg-slate-800/50'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                  <div className="mb-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${tabColors[TABS.find(t => t.key === activeTab)?.color ?? 'blue']}`}>
                      {TABS.find(t => t.key === activeTab)?.icon}
                      {TABS.find(t => t.key === activeTab)?.label} 전문가 관점
                    </span>
                  </div>

                  <ul className="space-y-2.5">
                    {CHECKLIST_ITEMS[activeTab].map((item, i) => {
                      const key = `${preview.file}_${activeTab}_${i}`;
                      const checked = !!checks[key];
                      return (
                        <li key={i}>
                          <label className="flex items-start gap-3 cursor-pointer group/item">
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                              checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700 group-hover/item:border-slate-500'
                            }`}
                              onClick={() => toggleCheck(key)}
                            >
                              {checked && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                                </svg>
                              )}
                            </div>
                            <span
                              className={`text-sm leading-relaxed transition-all ${checked ? 'text-slate-500 line-through' : 'text-slate-300'}`}
                              onClick={() => toggleCheck(key)}
                            >
                              {item}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* 전체 점수 */}
                <div className="p-4 border-t border-slate-800">
                  {(() => {
                    const s = getTotalScore(preview.file);
                    const pct3 = Math.round((s.done / s.total) * 100);
                    return (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400 text-sm">전체 품질 점수</span>
                          <span className={`font-bold text-sm ${pct3 >= 80 ? 'text-emerald-400' : pct3 >= 50 ? 'text-amber-400' : 'text-slate-400'}`}>
                            {pct3}% ({s.done}/{s.total})
                          </span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct3}%`, background: pct3 >= 80 ? '#10b981' : pct3 >= 50 ? '#f59e0b' : '#64748b' }}
                          />
                        </div>
                        {pct3 >= 80 && (
                          <div className="mt-2 text-center text-emerald-400 text-xs font-semibold">🎉 크몽 등록 준비 완료!</div>
                        )}
                        {pct3 < 80 && pct3 > 0 && (
                          <div className="mt-2 text-center text-amber-400 text-xs">추가 검토 후 등록을 권장합니다</div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
