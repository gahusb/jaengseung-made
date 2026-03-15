'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '로그인에 실패했습니다.');
      } else {
        router.push('/admin/dashboard');
      }
    } catch {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            관
          </div>
          <h1 className="text-white text-2xl font-bold">관리자 로그인</h1>
          <p className="text-slate-400 text-sm mt-1">쟁승메이드 관리자 전용</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="bg-slate-900 rounded-2xl p-6 space-y-4 border border-slate-700/50">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">관리자 ID</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              autoComplete="off"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              placeholder="관리자 ID 입력"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              placeholder="비밀번호 입력"
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-2.5 text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold py-2.5 rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="text-center text-slate-600 text-xs mt-4">
          .env.local의 ADMIN_ID / ADMIN_PASSWORD로 로그인
        </p>
      </div>
    </div>
  );
}
