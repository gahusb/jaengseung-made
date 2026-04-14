'use client';

import { useState } from 'react';
import Link from 'next/link';

const HIDDEN_PAGES = [
  {
    path: '/freelance',
    label: '외주 개발 문의',
    desc: '위시캣·숨고 지원서에 뿌린 기존 링크. 노출 제거 + noindex.',
  },
  {
    path: '/services/website',
    label: '홈페이지 제작 상세',
    desc: '홈페이지 제작 랜딩. 직링크 전용.',
  },
];

interface IssuedToken {
  token: string;
  url: string;
  memo: string;
  expiresAt: string;
}

export default function AdminHiddenPage() {
  const [memo, setMemo] = useState('');
  const [ttlDays, setTtlDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [issued, setIssued] = useState<IssuedToken[]>([]);
  const [error, setError] = useState('');

  async function handleIssue() {
    setError('');
    if (!memo.trim()) {
      setError('메모를 입력해주세요. (예: 위시캣 xx 프로젝트)');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/portfolio-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memo, ttlDays }),
      });
      if (!res.ok) throw new Error((await res.json()).error || '실패');
      const data = await res.json();
      const url = `${window.location.origin}/portfolio/${data.token}`;
      setIssued([{ token: data.token, url, memo: data.memo, expiresAt: data.expiresAt }, ...issued]);
      setMemo('');
    } catch (e) {
      setError(e instanceof Error ? e.message : '토큰 생성 실패');
    } finally {
      setLoading(false);
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert('복사되었습니다');
    } catch {
      alert('복사 실패 — 수동으로 복사해주세요');
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
      <header>
        <h1 className="text-2xl font-extrabold text-slate-900">숨김 페이지 관리</h1>
        <p className="text-sm text-slate-500 mt-1">
          공개 UI에서 숨긴 페이지 바로가기 + 위시캣 제출용 임시 공유 URL 발급.
        </p>
      </header>

      {/* 숨김 페이지 바로가기 */}
      <section>
        <h2 className="text-sm font-bold text-slate-800 mb-3">🔗 숨김 페이지 바로가기</h2>
        <div className="space-y-2">
          {HIDDEN_PAGES.map((p) => (
            <div
              key={p.path}
              className="flex items-center justify-between border border-slate-200 bg-white rounded-xl px-5 py-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={p.path}
                    target="_blank"
                    className="font-bold text-slate-900 hover:text-violet-700"
                  >
                    {p.label}
                  </Link>
                  <code className="text-xs text-slate-500 font-mono">{p.path}</code>
                </div>
                <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
              </div>
              <button
                onClick={() => copy(window.location.origin + p.path)}
                className="text-xs font-bold text-slate-700 border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-lg"
              >
                URL 복사
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 포트폴리오 토큰 발급 */}
      <section>
        <h2 className="text-sm font-bold text-slate-800 mb-3">🎫 포트폴리오 임시 공유 URL 발급</h2>
        <div className="border border-slate-200 bg-white rounded-xl p-6">
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            위시캣 지원서 등 외부 제출용. <code className="font-mono bg-slate-100 px-1 rounded">/portfolio/[token]</code> 형태의
            프리미엄 게이트웨이 페이지가 생성됩니다. 만료되면 404로 처리됩니다.
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">메모 (내부용)</label>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="예: 위시캣 OO 프로젝트 제안서용"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">유효 기간 (일)</label>
              <input
                type="number"
                min={1}
                max={365}
                value={ttlDays}
                onChange={(e) => setTtlDays(Number(e.target.value))}
                className="w-32 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
            {error && <p className="text-xs text-rose-600">{error}</p>}
            <button
              onClick={handleIssue}
              disabled={loading}
              className="bg-violet-600 hover:bg-violet-500 disabled:bg-slate-300 text-white font-bold text-sm px-5 py-2.5 rounded-lg transition"
            >
              {loading ? '생성 중...' : '토큰 발급'}
            </button>
          </div>
        </div>

        {/* 최근 발급 목록 (세션 메모리만 — 새로고침 시 초기화) */}
        {issued.length > 0 && (
          <div className="mt-5 space-y-3">
            <p className="text-xs font-bold text-slate-600">이번 세션에 발급한 URL</p>
            {issued.map((t) => (
              <div key={t.token} className="border border-slate-200 bg-slate-50 rounded-xl p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-600 mb-1">
                      📝 {t.memo} · 만료 {new Date(t.expiresAt).toLocaleDateString('ko-KR')}
                    </p>
                    <code className="block text-xs font-mono text-slate-800 bg-white border border-slate-200 rounded p-2 truncate">
                      {t.url}
                    </code>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copy(t.url)}
                    className="text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg"
                  >
                    URL 복사
                  </button>
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold border border-slate-300 hover:bg-white px-3 py-1.5 rounded-lg text-slate-700"
                  >
                    열기 ↗
                  </a>
                </div>
              </div>
            ))}
            <p className="text-[11px] text-slate-400">
              ※ 발급 목록은 현재 세션에만 표시됩니다. 발급 후 반드시 URL을 복사해두세요.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
