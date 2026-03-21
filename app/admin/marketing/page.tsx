'use client';

import { useState } from 'react';
import Link from 'next/link';

const ASSETS = [
  {
    file: '/marketing/thumb-homepage-A.svg',
    name: '홈페이지 제작 썸네일 A',
    desc: '신뢰형 — 브라우저 목업 포함 다크 테마',
    size: '1200 × 675',
    platform: '크몽 메인',
    color: '#2563eb',
  },
  {
    file: '/marketing/thumb-homepage-B.svg',
    name: '홈페이지 제작 썸네일 B',
    desc: '스펙 강조형 — 3플랜 카드 비교',
    size: '1200 × 675',
    platform: '크몽 서브',
    color: '#7c3aed',
  },
  {
    file: '/marketing/thumb-automation.svg',
    name: '업무 자동화 썸네일',
    desc: '시간 절약형 — 자동화 플로우 다이어그램',
    size: '1200 × 675',
    platform: '크몽 메인',
    color: '#10b981',
  },
  {
    file: '/marketing/thumb-prompt.svg',
    name: '프롬프트 엔지니어링 썸네일',
    desc: 'Before/After 말풍선 비교형',
    size: '1200 × 675',
    platform: '크몽 메인',
    color: '#7c3aed',
  },
  {
    file: '/marketing/thumb-stock.svg',
    name: '주식 자동매매 썸네일',
    desc: '폰 목업 + 텔레그램 알림 UI',
    size: '1200 × 675',
    platform: '크몽 메인',
    color: '#22c55e',
  },
  {
    file: '/marketing/banner-homepage.svg',
    name: '홈페이지 제작 배너',
    desc: '가로형 배너 — 블로그/SNS 활용',
    size: '1200 × 400',
    platform: '블로그/SNS',
    color: '#2563eb',
  },
];

export default function MarketingPage() {
  const [preview, setPreview] = useState<(typeof ASSETS)[0] | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">마케팅 에셋</h1>
          <p className="text-slate-400 text-sm mt-1">크몽/숨고 등록용 썸네일 및 배너 — SVG 파일 다운로드 가능</p>
        </div>
        <Link href="/admin/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">
          ← 대시보드
        </Link>
      </div>

      {/* 안내 */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-8 flex items-start gap-3">
        <span className="text-blue-400 text-xl mt-0.5">ℹ️</span>
        <div>
          <p className="text-blue-300 font-semibold text-sm mb-1">SVG → PNG 변환 방법</p>
          <p className="text-slate-400 text-sm">브라우저에서 파일 열기 → 우클릭 → "이미지 다른 이름으로 저장" (PNG), 또는 <strong className="text-slate-300">Figma에 SVG 드래그 후 PNG Export</strong>를 추천합니다. 크몽은 JPG/PNG만 허용합니다.</p>
        </div>
      </div>

      {/* 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {ASSETS.map((asset) => (
          <div key={asset.file} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-600 transition-all group">
            {/* 미리보기 */}
            <button
              onClick={() => setPreview(asset)}
              className="w-full block relative overflow-hidden bg-slate-950"
              style={{ aspectRatio: asset.size.includes('400') ? '3/1' : '16/9' }}
            >
              <img
                src={asset.file}
                alt={asset.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 text-white font-semibold text-sm bg-black/60 px-4 py-2 rounded-full transition-all">
                  크게 보기
                </span>
              </div>
            </button>

            {/* 정보 */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-white font-semibold text-sm">{asset.name}</h3>
                  <p className="text-slate-500 text-xs mt-0.5">{asset.desc}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full shrink-0" style={{ background: asset.color + '20', color: asset.color }}>
                  {asset.platform}
                </span>
              </div>
              <p className="text-slate-600 text-xs mb-3">{asset.size}px</p>

              <div className="flex gap-2">
                <button
                  onClick={() => download(asset.file, asset.name)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-all"
                >
                  SVG 다운로드
                </button>
                <button
                  onClick={() => copyPath(asset.file)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${copied === asset.file ? 'bg-green-900/40 text-green-400 border border-green-500/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'}`}
                >
                  {copied === asset.file ? '✓ 복사됨' : 'URL 복사'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 크게 보기 모달 */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
          onClick={() => setPreview(null)}
        >
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-white font-bold text-lg">{preview.name}</h2>
                <p className="text-slate-400 text-sm">{preview.size}px · {preview.desc}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => download(preview.file, preview.name)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all"
                >
                  SVG 다운로드
                </button>
                <button onClick={() => setPreview(null)} className="text-slate-400 hover:text-white text-2xl leading-none px-2">×</button>
              </div>
            </div>
            <img
              src={preview.file}
              alt={preview.name}
              className="w-full rounded-xl border border-slate-700"
            />
          </div>
        </div>
      )}
    </div>
  );
}
