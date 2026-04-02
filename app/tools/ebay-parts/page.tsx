'use client';

import { useState, useCallback } from 'react';
import type { SearchResult as FullSearchResult, FitmentEntry, PriceSource } from '@/lib/ebay-tools/types';

/* ── Types (페이지 전용) ──────────────────────────────────── */
// SearchResult['data']에 해당하는 타입 (API 응답의 data 필드)
type PageSearchResult = FullSearchResult['data'];

interface HistoryItem {
  partNumber: string;
  partName?: string;
  time: string;
  resultSummary: string;
}

/* ── Tab IDs ────────────────────────────────────────────────── */
const TABS = [
  { id: 'basic', label: '기본 정보' },
  { id: 'listing', label: '이베이 리스팅' },
  { id: 'fitment', label: '호환 차종' },
  { id: 'pricing', label: '가격 비교' },
  { id: 'raw', label: '원본 데이터' },
] as const;

type TabId = (typeof TABS)[number]['id'];

/* ── Icons (inline SVGs) ────────────────────────────────────── */
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/* ── Component ──────────────────────────────────────────────── */
export default function EbayPartsPage() {
  const [partNumber, setPartNumber] = useState('');
  const [partName, setPartName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PageSearchResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [rawExpanded, setRawExpanded] = useState(false);

  /* ── Search ─────────────────────────────────────────────── */
  const handleSearch = useCallback(
    async (pn?: string, pnm?: string) => {
      const searchPartNumber = pn ?? partNumber;
      const searchPartName = pnm ?? partName;

      if (!searchPartNumber.trim()) {
        setError('품번을 입력해주세요.');
        return;
      }

      setLoading(true);
      setError(null);
      setResult(null);
      setActiveTab('basic');

      try {
        const res = await fetch('/api/tools/ebay-parts/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            partNumber: searchPartNumber.trim(),
            partName: searchPartName.trim() || undefined,
          }),
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          setError(json.error || '검색에 실패했습니다.');
          return;
        }

        setResult(json.data);

        // Update history
        setHistory((prev) => {
          const entry: HistoryItem = {
            partNumber: searchPartNumber.trim(),
            partName: searchPartName.trim() || undefined,
            time: new Date().toLocaleTimeString('ko-KR'),
            resultSummary: `${json.data.fitment.length}개 차종, ${json.data.pricing.sources.length}개 소스`,
          };
          return [entry, ...prev.filter((h) => h.partNumber !== entry.partNumber)].slice(0, 5);
        });
      } catch {
        setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    },
    [partNumber, partName]
  );

  const handleHistoryClick = (item: HistoryItem) => {
    setPartNumber(item.partNumber);
    setPartName(item.partName || '');
    handleSearch(item.partNumber, item.partName);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  /* ── Confidence Badge ──────────────────────────────────── */
  const ConfidenceBadge = ({ level }: { level: string }) => {
    const styles: Record<string, string> = {
      high: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      medium: 'bg-amber-50 text-amber-700 border-amber-200',
      low: 'bg-red-50 text-red-700 border-red-200',
    };
    const labels: Record<string, string> = { high: 'High', medium: 'Medium', low: 'Low' };
    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded border ${styles[level] || styles.low}`}>
        {labels[level] || level}
      </span>
    );
  };

  /* ── Tab Content Renderers ─────────────────────────────── */
  const renderBasicInfo = () => {
    if (!result) return null;
    const { basicInfo } = result;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ['부품명', basicInfo.partName],
            ['브랜드', basicInfo.brand],
            ['품번', basicInfo.partNumber],
            ['카테고리', basicInfo.category],
          ].map(([label, value]) => (
            <div key={label} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
              <p className="text-sm text-slate-900 font-semibold">{value}</p>
            </div>
          ))}
        </div>
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
          <p className="text-xs text-slate-500 font-medium mb-2">OEM 번호</p>
          <div className="flex flex-wrap gap-2">
            {basicInfo.oemNumbers.map((num) => (
              <span key={num} className="bg-white text-sm font-mono text-slate-700 px-3 py-1 rounded border border-slate-200">
                {num}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderListing = () => {
    if (!result) return null;
    const { listing } = result;
    return (
      <div className="space-y-4">
        {/* Title */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-500 font-medium">추천 제목</p>
            <button
              onClick={() => handleCopy(listing.title)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              <CopyIcon />
              {copied ? '복사됨' : '복사'}
            </button>
          </div>
          <p className="text-sm text-slate-900 font-semibold">{listing.title}</p>
        </div>

        {/* Category */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
          <p className="text-xs text-slate-500 font-medium mb-1">추천 카테고리</p>
          <p className="text-sm text-slate-900 font-semibold">{listing.category}</p>
        </div>

        {/* Item Specifics */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
          <p className="text-xs text-slate-500 font-medium mb-3">Item Specifics</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 font-semibold text-slate-600">Key</th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-600">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(listing.itemSpecifics).map(([key, value]) => (
                  <tr key={key} className="border-b border-slate-100">
                    <td className="py-2 px-3 text-slate-600">{key}</td>
                    <td className="py-2 px-3 text-slate-900 font-medium">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderFitment = () => {
    if (!result) return null;
    return (
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
        <p className="text-xs text-slate-500 font-medium mb-3">호환 차종 목록</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 font-semibold text-slate-600">Year</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-600">Make</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-600">Model</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-600">Engine</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-600">신뢰도</th>
              </tr>
            </thead>
            <tbody>
              {result.fitment.map((f, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2 px-3 text-slate-900">{f.year}</td>
                  <td className="py-2 px-3 text-slate-900">{f.make}</td>
                  <td className="py-2 px-3 text-slate-900">{f.model}</td>
                  <td className="py-2 px-3 text-slate-700 font-mono text-xs">{f.engine}</td>
                  <td className="py-2 px-3">
                    <ConfidenceBadge level={f.confidence} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPricing = () => {
    if (!result) return null;
    const { pricing } = result;
    return (
      <div className="space-y-4">
        {/* Price table */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
          <p className="text-xs text-slate-500 font-medium mb-3">소스별 가격 비교</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 font-semibold text-slate-600">사이트</th>
                  <th className="text-right py-2 px-3 font-semibold text-slate-600">가격 (USD)</th>
                  <th className="text-right py-2 px-3 font-semibold text-slate-600">원화 환산</th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-600">링크</th>
                </tr>
              </thead>
              <tbody>
                {pricing.sources.map((s) => (
                  <tr key={s.site} className="border-b border-slate-100">
                    <td className="py-2 px-3 text-slate-900 font-medium">{s.site}</td>
                    <td className="py-2 px-3 text-right text-slate-900 font-mono">
                      ${s.price.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-600 font-mono">
                      {Math.round(s.price * pricing.exchangeRate.rate).toLocaleString()}원
                    </td>
                    <td className="py-2 px-3">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs underline"
                      >
                        바로가기
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Exchange + customs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-2">환율 정보</p>
            <p className="text-lg font-bold text-slate-900">
              1 USD = {pricing.exchangeRate.rate.toLocaleString()}원
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {pricing.exchangeRate.source} ({pricing.exchangeRate.date})
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-2">관세/부가세 참고</p>
            {pricing.customs.isExempt && (
              <p className="text-sm text-emerald-700 font-semibold mb-2">
                $150 이하 소액면세 대상
              </p>
            )}
            <p className="text-sm text-slate-900">
              HS Code: <span className="font-mono font-bold">{pricing.customs.hsCode}</span>
            </p>
            <p className="text-sm text-slate-900">
              세율: <span className="font-bold">{pricing.customs.dutyRate}</span>
            </p>
            <p className="text-sm text-slate-900">
              예상 관세: <span className="font-bold text-blue-700">{pricing.customs.estimatedDuty.toLocaleString()}원</span>
            </p>
            <p className="text-sm text-slate-900">
              부가세 (VAT 10%): <span className="font-bold text-blue-700">{pricing.customs.vat.toLocaleString()}원</span>
            </p>
            <p className="text-sm text-slate-900 mt-1">
              총 수입 비용: <span className="font-bold text-blue-800 text-base">{pricing.customs.totalImportCost.toLocaleString()}원</span>
            </p>
            <p className="text-xs text-slate-400 mt-2">{pricing.customs.disclaimer}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderRawData = () => {
    if (!result) return null;
    return (
      <div className="bg-slate-50 rounded-lg border border-slate-100">
        <button
          onClick={() => setRawExpanded(!rawExpanded)}
          className="w-full flex items-center justify-between p-4 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
        >
          <span>원본 JSON 데이터</span>
          <svg
            className={`w-4 h-4 transition-transform ${rawExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {rawExpanded && (
          <div className="px-4 pb-4">
            <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-xs leading-relaxed">
              {JSON.stringify(result.rawData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicInfo();
      case 'listing':
        return renderListing();
      case 'fitment':
        return renderFitment();
      case 'pricing':
        return renderPricing();
      case 'raw':
        return renderRawData();
    }
  };

  /* ── Skeleton ──────────────────────────────────────────── */
  const Skeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <SpinnerIcon />
        <p className="text-sm text-blue-700 font-medium">AI가 사이트를 탐색하고 있습니다...</p>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-100 rounded-lg h-20" />
        ))}
      </div>
    </div>
  );

  /* ── Render ────────────────────────────────────────────── */
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* ── Header ──────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-slate-900">이베이 자동차 부품 AI 리스팅 자동화</h1>
          <span className="text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-700 border border-blue-200">
            MVP 데모
          </span>
        </div>
        <p className="text-slate-500 text-sm">
          품번을 입력하면 AI가 자동으로 리스팅 정보를 수집합니다
        </p>
      </div>

      {/* ── Input Form ──────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">품번 *</label>
            <input
              type="text"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              placeholder="예: 16610-0H040"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition text-slate-900 placeholder:text-slate-400"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              품명 <span className="text-slate-400 font-normal">(선택)</span>
            </label>
            <input
              type="text"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              placeholder="예: Fuel Pump Assembly"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition text-slate-900 placeholder:text-slate-400"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1a56db] text-white text-sm font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {loading ? <SpinnerIcon /> : <SearchIcon />}
              {loading ? '검색 중...' : '검색 시작'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Error ───────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* ── Loading ─────────────────────────────────────── */}
      {loading && <Skeleton />}

      {/* ── Result Tabs ─────────────────────────────────── */}
      {result && !loading && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-5">{renderTabContent()}</div>

          {/* Meta footer */}
          <div className="border-t border-slate-100 px-5 py-3 flex flex-wrap gap-4 text-xs text-slate-400">
            <span>검색 시각: {new Date(result.meta.searchedAt).toLocaleString('ko-KR')}</span>
            <span>소요 시간: {result.meta.processingTime}</span>
            <span>소스: {result.meta.sourcesChecked.join(', ')}</span>
            <span>모델: {result.meta.aiModel}</span>
          </div>
        </div>
      )}

      {/* ── Search History ──────────────────────────────── */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <ClockIcon />
            <h3 className="text-sm font-semibold text-slate-700">최근 검색</h3>
          </div>
          <div className="space-y-2">
            {history.map((item, i) => (
              <button
                key={i}
                onClick={() => handleHistoryClick(item)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-left"
              >
                <div>
                  <span className="text-sm font-mono font-semibold text-slate-800">{item.partNumber}</span>
                  {item.partName && (
                    <span className="text-xs text-slate-500 ml-2">{item.partName}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{item.resultSummary}</span>
                  <span>{item.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
