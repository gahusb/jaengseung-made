'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

/* ── Types ─────────────────────────────────────────────── */
interface BlogSection {
  heading: string;
  body: string;
  imageSlot?: boolean;
}

interface ImageGuide {
  position: string;
  description: string;
  searchKeyword: string;
  altText: string;
}

interface BlogData {
  title: string;
  subtitle: string;
  content: BlogSection[];
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  imageGuides: ImageGuide[];
  meta: {
    charCount: number;
    sectionCount: number;
    estimatedReadTime: string;
    generatedAt: string;
    model: string;
  };
}

/* ── Option configs ────────────────────────────────────── */
const STYLES = [
  { value: 'informational', label: '정보 전달', desc: '사실 기반 정보 정리', icon: '📖' },
  { value: 'review', label: '리뷰/후기', desc: '제품·서비스 체험기', icon: '⭐' },
  { value: 'howto', label: '방법/튜토리얼', desc: '단계별 가이드', icon: '🔧' },
  { value: 'listicle', label: '리스트형', desc: 'OO가지 모음', icon: '📋' },
  { value: 'comparison', label: '비교 분석', desc: 'A vs B 비교', icon: '⚖️' },
  { value: 'story', label: '에세이/스토리', desc: '경험 기반 서사', icon: '✍️' },
];

const TONES = [
  { value: 'professional', label: '전문적', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300' },
  { value: 'friendly', label: '친근한', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
  { value: 'casual', label: '캐주얼', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
  { value: 'formal', label: '격식체', color: 'border-violet-500/40 bg-violet-500/10 text-violet-300' },
];

const LENGTHS = [
  { value: 'short', label: '짧게', desc: '800~1,200자', time: '~2분' },
  { value: 'medium', label: '보통', desc: '1,500~2,500자', time: '~5분' },
  { value: 'long', label: '길게', desc: '3,000~4,500자', time: '~9분' },
];

/* ── Component ─────────────────────────────────────────── */
export default function NaverBlogPage() {
  // Form state
  const [topic, setTopic] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [style, setStyle] = useState('informational');
  const [tone, setTone] = useState('friendly');
  const [length, setLength] = useState('medium');
  const [sections, setSections] = useState(5);
  const [imageGuide, setImageGuide] = useState(true);

  // Result state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BlogData | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'seo' | 'image'>('preview');
  const [copied, setCopied] = useState(false);

  /* ── Keyword management ───────────────────────────────── */
  const addKeyword = () => {
    const kw = keywordInput.trim();
    if (kw && !keywords.includes(kw) && keywords.length < 10) {
      setKeywords([...keywords, kw]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  /* ── Generate ─────────────────────────────────────────── */
  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      setError('주제를 입력해주세요.');
      return;
    }
    if (keywords.length === 0) {
      setError('키워드를 최소 1개 추가해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/tools/naver-blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), keywords, style, tone, length, imageGuide, sections }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || '생성에 실패했습니다.');
      }

      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [topic, keywords, style, tone, length, imageGuide, sections]);

  /* ── Copy full content ────────────────────────────────── */
  const copyContent = () => {
    if (!result) return;
    const text = result.content.map((s) => `## ${s.heading}\n\n${s.body}`).join('\n\n');
    const full = `# ${result.title}\n\n${result.subtitle}\n\n${text}\n\n태그: ${result.tags.map((t) => '#' + t).join(' ')}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 max-w-5xl mx-auto">
        <Link href="/tools" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-4 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          도구 목록
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">네이버 블로그 자동화</h1>
            <p className="text-slate-500 text-xs font-mono">Naver Blog AI Writer</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-16 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Left: Settings Panel ──────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Topic */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-700/50 p-5">
            <label className="text-white text-sm font-semibold block mb-2">주제</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: 2026년 제주도 가족여행 추천 코스"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
              maxLength={100}
            />

            {/* Keywords */}
            <label className="text-white text-sm font-semibold block mt-4 mb-2">핵심 키워드</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                placeholder="키워드 입력 후 Enter"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
              />
              <button
                onClick={addKeyword}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
              >
                추가
              </button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {keywords.map((kw) => (
                  <span key={kw} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 text-xs">
                    {kw}
                    <button onClick={() => removeKeyword(kw)} className="hover:text-white ml-0.5">x</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Style */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-700/50 p-5">
            <label className="text-white text-sm font-semibold block mb-3">글 형식</label>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`text-left px-3 py-2.5 rounded-lg border transition-all text-sm ${
                    style === s.value
                      ? 'border-blue-500/50 bg-blue-500/10 text-white'
                      : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="text-base mr-1.5">{s.icon}</span>
                  <span className="font-medium">{s.label}</span>
                  <div className="text-[11px] text-slate-500 mt-0.5 ml-6">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-700/50 p-5">
            <label className="text-white text-sm font-semibold block mb-3">톤앤매너</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    tone === t.value ? t.color : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Length + Sections + Image */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-700/50 p-5 space-y-4">
            <div>
              <label className="text-white text-sm font-semibold block mb-3">분량</label>
              <div className="grid grid-cols-3 gap-2">
                {LENGTHS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLength(l.value)}
                    className={`px-3 py-2.5 rounded-lg border text-center transition-all ${
                      length === l.value
                        ? 'border-blue-500/50 bg-blue-500/10 text-white'
                        : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-sm font-medium">{l.label}</div>
                    <div className="text-[11px] text-slate-500">{l.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white text-sm font-semibold">소제목 수</label>
                <p className="text-slate-500 text-xs">3~8개</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSections(Math.max(3, sections - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-700"
                >
                  -
                </button>
                <span className="text-white font-bold w-6 text-center">{sections}</span>
                <button
                  onClick={() => setSections(Math.min(8, sections + 1))}
                  className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-700"
                >
                  +
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={imageGuide}
                onChange={(e) => setImageGuide(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-500"
              />
              <div>
                <span className="text-white text-sm font-medium">이미지 배치 가이드</span>
                <p className="text-slate-500 text-xs">각 섹션에 적합한 이미지 추천</p>
              </div>
            </label>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                AI 작성 중...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                블로그 글 생성하기
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* ── Right: Result Panel ───────────────────────────── */}
        <div className="lg:col-span-3">
          {!result && !loading && (
            <div className="bg-slate-900/80 rounded-2xl border border-slate-700/50 p-12 text-center">
              <svg className="w-16 h-16 text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p className="text-slate-500 text-sm">왼쪽에서 옵션을 선택하고<br />블로그 글을 생성해보세요</p>
            </div>
          )}

          {loading && (
            <div className="bg-slate-900/80 rounded-2xl border border-slate-700/50 p-12 text-center">
              <svg className="w-10 h-10 animate-spin text-emerald-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-white font-medium mb-1">AI가 블로그 글을 작성하고 있습니다</p>
              <p className="text-slate-500 text-sm">주제 분석 → 구조 설계 → 본문 작성 → SEO 최적화</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* View mode tabs */}
              <div className="flex gap-1 bg-slate-900/80 rounded-xl border border-slate-700/50 p-1">
                {[
                  { id: 'preview' as const, label: '글 미리보기' },
                  { id: 'seo' as const, label: 'SEO 정보' },
                  { id: 'image' as const, label: '이미지 가이드' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setViewMode(tab.id)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      viewMode === tab.id
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Meta bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-800/60 rounded-lg text-xs text-slate-400">
                <div className="flex gap-4">
                  <span>{result.meta.charCount.toLocaleString()}자</span>
                  <span>{result.meta.sectionCount}개 섹션</span>
                  <span>읽기 {result.meta.estimatedReadTime}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyContent}
                    className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                  >
                    {copied ? '복사됨!' : '전체 복사'}
                  </button>
                </div>
              </div>

              {/* Content based on viewMode */}
              {viewMode === 'preview' && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  {/* Blog preview (light theme to mimic Naver Blog) */}
                  <div className="p-6 md:p-8">
                    <h1 className="text-[#333] text-2xl font-bold mb-2 leading-tight">{result.title}</h1>
                    <p className="text-[#888] text-sm mb-6">{result.subtitle}</p>
                    <div className="w-12 h-0.5 bg-emerald-500 mb-6" />

                    {result.content.map((section, idx) => (
                      <div key={idx} className="mb-6">
                        <h2 className="text-[#222] text-lg font-bold mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-5 bg-emerald-500 rounded-full inline-block" />
                          {section.heading}
                        </h2>
                        {section.imageSlot && (
                          <div className="w-full h-32 bg-slate-100 rounded-lg mb-3 flex items-center justify-center border border-dashed border-slate-300">
                            <span className="text-slate-400 text-sm">
                              이미지 배치 위치
                            </span>
                          </div>
                        )}
                        <div className="text-[#333] text-sm leading-relaxed whitespace-pre-wrap">{section.body}</div>
                      </div>
                    ))}

                    {/* Tags */}
                    <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-1.5">
                      {result.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {viewMode === 'seo' && (
                <div className="bg-slate-900/80 rounded-2xl border border-slate-700/50 p-6 space-y-4">
                  <div>
                    <label className="text-slate-400 text-xs font-medium block mb-1">SEO 제목</label>
                    <p className="text-white text-sm bg-slate-800 rounded-lg px-4 py-3">{result.seoTitle}</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs font-medium block mb-1">메타 설명</label>
                    <p className="text-white text-sm bg-slate-800 rounded-lg px-4 py-3">{result.seoDescription}</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs font-medium block mb-1">추천 태그</label>
                    <div className="flex flex-wrap gap-1.5">
                      {result.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1.5 bg-slate-800 rounded-lg text-emerald-400 text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs font-medium block mb-1">글 구조</label>
                    <div className="bg-slate-800 rounded-lg px-4 py-3 space-y-1.5">
                      {result.content.map((section, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <span className="text-slate-500 font-mono text-xs w-5">H2</span>
                          <span className="text-white">{section.heading}</span>
                          <span className="text-slate-600 text-xs ml-auto">{section.body.length}자</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-slate-500 text-xs pt-2 border-t border-slate-700/50">
                    모델: {result.meta.model} · 생성: {new Date(result.meta.generatedAt).toLocaleString('ko-KR')}
                  </div>
                </div>
              )}

              {viewMode === 'image' && (
                <div className="bg-slate-900/80 rounded-2xl border border-slate-700/50 p-6">
                  {result.imageGuides.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-8">이미지 가이드가 없습니다.</p>
                  ) : (
                    <div className="space-y-3">
                      {result.imageGuides.map((guide, idx) => (
                        <div key={idx} className="bg-slate-800/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            <span className="text-white text-sm font-medium">{guide.position}</span>
                          </div>
                          <p className="text-slate-300 text-sm mb-2">{guide.description}</p>
                          <div className="flex gap-4 text-xs">
                            <span className="text-slate-500">
                              검색어: <span className="text-blue-400">{guide.searchKeyword}</span>
                            </span>
                            <span className="text-slate-500">
                              Alt: <span className="text-slate-400">{guide.altText}</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="bg-slate-900/60 rounded-xl border border-slate-700/40 p-5 text-center">
                <p className="text-slate-400 text-sm mb-3">
                  이런 블로그 자동화를 우리 사업에 맞게 커스텀하고 싶다면?
                </p>
                <Link
                  href="/freelance#contact-form"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
                >
                  맞춤 자동화 상담하기
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
