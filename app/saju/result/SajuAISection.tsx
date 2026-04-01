'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// PaymentButton 비활성화 — 토스페이먼츠 결제 일시 중단, 무료 제공 중

interface BirthKey {
  birth_year: number;
  birth_month: number;
  birth_day: number;
  birth_hour?: number;
  gender: string;
}

interface SajuAISectionProps {
  hasPaid: boolean;
  savedInterpretation: string | null;
  sajuData: object;
  daeun: object | null;
  daeunList: object[];
  gender: string;
  birthKey: BirthKey;
  currentUrl: string;
  engineData?: {
    interactions?: any[];
    shinsal?: any[];
    gongmang?: any;
    hiddenStems?: any[];
  };
}

// ── 섹션별 메타 (아이콘·색상) ──────────────────────────────────────────
const SECTION_META: {
  icon: string;
  gradient: string;
  border: string;
  badge: string;
  badgeText: string;
}[] = [
  { icon: '🌟', gradient: 'from-violet-500 to-purple-600',  border: 'border-violet-100', badge: 'bg-violet-50 border-violet-200 text-violet-700',  badgeText: '기질' },
  { icon: '⚖️', gradient: 'from-emerald-500 to-teal-600',   border: 'border-emerald-100', badge: 'bg-emerald-50 border-emerald-200 text-emerald-700', badgeText: '오행' },
  { icon: '🔗', gradient: 'from-blue-500 to-indigo-600',    border: 'border-blue-100',   badge: 'bg-blue-50 border-blue-200 text-blue-700',         badgeText: '지지' },
  { icon: '✨', gradient: 'from-amber-500 to-orange-500',   border: 'border-amber-100',  badge: 'bg-amber-50 border-amber-200 text-amber-700',       badgeText: '신살' },
  { icon: '💰', gradient: 'from-yellow-500 to-amber-600',   border: 'border-yellow-100', badge: 'bg-yellow-50 border-yellow-200 text-yellow-700',    badgeText: '재물' },
  { icon: '🎯', gradient: 'from-rose-500 to-pink-600',      border: 'border-rose-100',   badge: 'bg-rose-50 border-rose-200 text-rose-700',          badgeText: '직업' },
  { icon: '💕', gradient: 'from-pink-500 to-rose-500',      border: 'border-pink-100',   badge: 'bg-pink-50 border-pink-200 text-pink-700',          badgeText: '애정' },
  { icon: '🌿', gradient: 'from-green-500 to-emerald-600',  border: 'border-green-100',  badge: 'bg-green-50 border-green-200 text-green-700',       badgeText: '건강' },
  { icon: '🗺️', gradient: 'from-cyan-500 to-blue-600',      border: 'border-cyan-100',   badge: 'bg-cyan-50 border-cyan-200 text-cyan-700',          badgeText: '대운' },
  { icon: '📅', gradient: 'from-indigo-500 to-violet-600',  border: 'border-indigo-100', badge: 'bg-indigo-50 border-indigo-200 text-indigo-700',    badgeText: '세운' },
  { icon: '🏆', gradient: 'from-amber-400 to-yellow-500',   border: 'border-amber-100',  badge: 'bg-amber-50 border-amber-200 text-amber-700',       badgeText: '황금기' },
  { icon: '💌', gradient: 'from-slate-600 to-slate-800',    border: 'border-slate-100',  badge: 'bg-slate-50 border-slate-200 text-slate-700',       badgeText: '종합' },
];

// ── 마크다운 → 섹션 파싱 ──────────────────────────────────────────────
interface ParsedSection {
  number: number;
  title: string;
  content: string;
}

function parseInterpretation(text: string): ParsedSection[] {
  // "## 숫자. 제목" 패턴으로 분리
  const parts = text.split(/\n(?=##\s+\d+[\.\s])/).filter(Boolean);
  const sections: ParsedSection[] = [];

  for (const part of parts) {
    const lines = part.trim().split('\n');
    const headerLine = lines[0] ?? '';
    const match = headerLine.match(/^##\s+(\d+)[.\s]\s*(.+)$/);
    if (match) {
      sections.push({
        number: parseInt(match[1], 10),
        title: match[2].trim(),
        content: lines.slice(1).join('\n').trim(),
      });
    }
  }

  // 파싱 실패 시 전체를 하나의 섹션으로
  if (sections.length === 0 && text.trim()) {
    sections.push({ number: 0, title: 'AI 해석', content: text.trim() });
  }

  return sections;
}

// ── 섹션 카드 컴포넌트 ────────────────────────────────────────────────
function SectionCard({ section, meta, isOpen, onToggle }: {
  section: ParsedSection;
  meta: typeof SECTION_META[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`rounded-2xl border-2 ${meta.border} bg-white overflow-hidden shadow-sm transition-all`}>
      {/* 헤더 */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
      >
        {/* 번호 아이콘 */}
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0 shadow-sm`}>
          {section.number > 0 ? section.number : meta.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${meta.badge}`}>
              {meta.badgeText}
            </span>
            <h3 className="font-extrabold text-[#04102b] text-sm leading-snug">
              {section.title}
            </h3>
          </div>
        </div>

        {/* 토글 화살표 */}
        <svg
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 내용 (아코디언) */}
      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-100">
          <div className={`text-[11px] font-semibold mb-3 flex items-center gap-1.5 ${meta.badge.includes('violet') ? 'text-violet-400' : 'text-slate-400'}`}>
            <span className="text-base">{meta.icon}</span>
          </div>
          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-base font-extrabold text-[#04102b] mt-4 mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-extrabold text-[#04102b] mt-3 mb-1.5">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-bold text-[#04102b] mt-2 mb-1">{children}</h3>,
                p: ({ children }) => <p className="mb-3 text-sm leading-relaxed text-slate-700">{children}</p>,
                strong: ({ children }) => <strong className="font-bold text-[#04102b]">{children}</strong>,
                em: ({ children }) => <em className="italic text-slate-600">{children}</em>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 mb-3 text-sm text-slate-700 pl-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 mb-3 text-sm text-slate-700 pl-1">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-violet-300 pl-4 py-1 my-3 text-slate-600 bg-violet-50 rounded-r-lg text-sm italic">
                    {children}
                  </blockquote>
                ),
                hr: () => <hr className="border-slate-200 my-4" />,
                code: ({ children }) => (
                  <code className="bg-slate-100 text-violet-700 px-1.5 py-0.5 rounded text-xs font-mono">
                    {children}
                  </code>
                ),
              }}
            >
              {section.content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

// mock 데이터 여부 감지 (저장된 해석이 예시 데이터인 경우 재생성 필요)
function isMockInterpretation(text: string | null): boolean {
  if (!text) return false;
  return (
    text.includes('API 키 문제 또는 할당량 초과') ||
    text.includes('GEMINI_API_KEY 환경변수를 설정') ||
    text.includes('예시 데이터를 보여드립니다') ||
    text.includes('API 설정이 필요합니다')
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────
export default function SajuAISection({
  hasPaid,
  savedInterpretation,
  sajuData,
  daeun,
  daeunList,
  gender,
  birthKey,
  currentUrl,
  engineData,
}: SajuAISectionProps) {
  // 저장된 해석이 mock 데이터면 재생성 필요
  const isMock = isMockInterpretation(savedInterpretation);
  const validSaved = savedInterpretation && !isMock ? savedInterpretation : null;

  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>(
    validSaved ? 'done' : 'idle'
  );
  const [interpretation, setInterpretation] = useState(validSaved ?? '');
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));
  const called = useRef(false);

  const sections = parseInterpretation(interpretation);

  const toggleSection = (idx: number) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const expandAll = () => setOpenSections(new Set(sections.map((_, i) => i)));
  const collapseAll = () => setOpenSections(new Set());

  // 재생성: called ref 초기화 후 다시 API 호출
  const handleRegenerate = () => {
    called.current = false;
    setStatus('idle');
    setInterpretation('');
    // idle → useEffect가 다시 실행되도록 상태 전환 트리거
    setTimeout(() => {
      called.current = false;
      setStatus('loading');
      fetch('/api/saju/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saju: sajuData, daeun, daeunList, gender, engineData }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.interpretation && !isMockInterpretation(data.interpretation)) {
            setInterpretation(data.interpretation);
            setStatus('done');
            setOpenSections(new Set([0]));
            // DB에 실제 해석으로 덮어쓰기
            const { birth_year, birth_month, birth_day } = birthKey;
            if (typeof birth_year === 'number' && typeof birth_month === 'number' && typeof birth_day === 'number') {
              fetch('/api/saju/save-interpretation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interpretation: data.interpretation, birthKey }),
              }).catch(() => {});
            }
          } else {
            setStatus('error');
          }
        })
        .catch(() => setStatus('error'));
    }, 0);
  };

  useEffect(() => {
    if (!hasPaid || validSaved || called.current) return;
    called.current = true;
    setStatus('loading');

    fetch('/api/saju/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ saju: sajuData, daeun, daeunList, gender, engineData }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.interpretation) {
          setInterpretation(data.interpretation);
          setStatus('done');
          // 첫 번째 섹션 자동 열기
          setOpenSections(new Set([0]));

          const { birth_year, birth_month, birth_day } = birthKey;
          if (
            typeof birth_year === 'number' && !isNaN(birth_year) &&
            typeof birth_month === 'number' && !isNaN(birth_month) &&
            typeof birth_day === 'number' && !isNaN(birth_day)
          ) {
            fetch('/api/saju/save-interpretation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ interpretation: data.interpretation, birthKey }),
            }).catch(() => {});
          }
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [hasPaid]);

  // ── 미결제 ──────────────────────────────────────────────────────────
  if (!hasPaid) {
    return (
      <div className="bg-gradient-to-br from-[#04102b] via-[#0a1f5c] to-[#04102b] rounded-2xl border border-[#1a3a7a] p-7 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            AI PREMIUM
          </div>
          <h3 className="text-xl font-extrabold text-white mb-2">AI 상세 해석 (12개 항목)</h3>
          <p className="text-blue-200/60 text-sm mb-6">
            성격, 재물운, 직업 적성, 애정운, 건강운, 대운 분석 등<br />
            Gemini 2.5 Pro가 생성하는 맞춤형 사주 해석을 받아보세요.
          </p>

          {/* 미리보기 섹션 목록 */}
          <div className="grid grid-cols-3 gap-2 mb-6 text-left">
            {SECTION_META.map((meta, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2 py-1.5">
                <span className="text-sm">{meta.icon}</span>
                <span className="text-xs text-blue-200/70 font-medium">{meta.badgeText}</span>
              </div>
            ))}
          </div>

          {/* 결제 일시 중단 — hasPaid=true이므로 이 분기는 표시되지 않음 */}
          <a
            href={process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL ?? '/freelance?service=AI사주분석'}
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#04102b] font-bold px-7 py-3 rounded-xl transition-all"
          >
            AI 해석 무료로 보기
          </a>
        </div>
      </div>
    );
  }

  // ── 로딩 ──────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="bg-white rounded-2xl border border-[#dbe8ff] p-8 text-center">
        <div className="w-10 h-10 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm font-medium">AI가 사주를 분석하는 중입니다...</p>
        <p className="text-slate-400 text-xs mt-1">약 20~30초 소요될 수 있습니다</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {SECTION_META.map((meta, i) => (
            <span key={i} className="flex items-center gap-1 text-xs text-slate-400 animate-pulse">
              <span>{meta.icon}</span>{meta.badgeText}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // ── 오류 ──────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-6 text-center">
        <p className="text-red-500 text-sm font-medium mb-3">AI 해석 생성에 실패했습니다.</p>
        <button
          onClick={() => { called.current = false; setStatus('idle'); }}
          className="text-xs text-blue-600 underline"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  // ── 해석 완료 ─────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-[#dbe8ff] overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-[#04102b] to-[#0a1f5c]">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-400 to-amber-400 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-extrabold text-white">AI 상세 해석</h2>
          <p className="text-blue-300/60 text-[11px]">12개 항목 · 클릭해서 펼쳐보세요</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            title="AI 해석 재생성"
            className="text-[11px] text-blue-300/60 hover:text-blue-200 px-2 py-1 rounded-lg hover:bg-white/10 transition-all flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            재생성
          </button>
          <span className="text-xs bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 font-bold px-2.5 py-1 rounded-full">
            결제 완료
          </span>
        </div>
      </div>

      {/* 섹션 컨트롤 + 목록 */}
      <div className="p-5">
        {/* 전체 펼치기/접기 */}
        {sections.length > 1 && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400 font-medium">
              총 {sections.length}개 항목
            </span>
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="text-xs text-violet-600 hover:text-violet-800 font-semibold px-3 py-1 rounded-lg border border-violet-200 hover:bg-violet-50 transition-colors"
              >
                전체 펼치기
              </button>
              <button
                onClick={collapseAll}
                className="text-xs text-slate-500 hover:text-slate-700 font-semibold px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                전체 접기
              </button>
            </div>
          </div>
        )}

        {/* 섹션 카드 목록 */}
        <div className="space-y-3">
          {sections.map((section, idx) => {
            const metaIdx = section.number > 0 ? Math.min(section.number - 1, SECTION_META.length - 1) : idx % SECTION_META.length;
            const meta = SECTION_META[metaIdx];
            return (
              <SectionCard
                key={idx}
                section={section}
                meta={meta}
                isOpen={openSections.has(idx)}
                onToggle={() => toggleSection(idx)}
              />
            );
          })}
        </div>

        {/* 하단 안내 */}
        {sections.length > 0 && (
          <p className="text-center text-xs text-slate-400 mt-5">
            해석은 사주 데이터를 기반으로 AI가 생성한 내용입니다. 참고용으로 활용해주세요.
          </p>
        )}
      </div>
    </div>
  );
}
