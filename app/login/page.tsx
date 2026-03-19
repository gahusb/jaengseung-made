'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Suspense } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    if (searchParams.get('error')) {
      setMessage('인증 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
    // 이미 로그인된 경우 리다이렉트
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push('/mypage');
    });
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setMessage('회원가입 실패: ' + error.message);
      } else if (data.user?.identities?.length === 0) {
        setMessage('이미 가입된 이메일입니다. 로그인해주세요.');
        setIsSignUp(false);
      } else {
        setMessage('가입 완료! 이메일 인증 링크를 확인해주세요.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage('로그인 실패: 이메일 또는 비밀번호를 확인해주세요.');
      } else {
        router.push('/mypage');
        router.refresh();
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    // NEXT_PUBLIC_SITE_URL 이 설정되어 있으면 우선 사용 (localhost 리다이렉트 방지)
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${base}/auth/callback` },
    });
    if (error) setMessage('Google 로그인 오류: ' + error.message);
  };

  return (
    <div className="min-h-screen bg-[#04102b] flex items-center justify-center p-4">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#4f8ef7 1px, transparent 1px), linear-gradient(90deg, #4f8ef7 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="relative w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/25">
              쟁
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-xl leading-tight">쟁승메이드</div>
              <div className="text-blue-400 text-xs font-medium">Premium Dev Services</div>
            </div>
          </Link>
        </div>

        {/* 카드 */}
        <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-extrabold text-white mb-1">
              {isSignUp ? '회원가입' : '로그인'}
            </h1>
            <p className="text-blue-300/60 text-sm">
              {isSignUp
                ? '가입 후 사주 기록, 결제 내역을 관리하세요'
                : '사주 기록·결제·의뢰 내역을 확인하세요'}
            </p>
          </div>

          {/* 오류/성공 메시지 */}
          {message && (
            <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${
              message.includes('완료') || message.includes('확인해주세요')
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border border-red-500/30 text-red-300'
            }`}>
              {message}
            </div>
          )}

          {/* 이메일/비밀번호 폼 */}
          <form onSubmit={handleAuth} className="space-y-4 mb-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                이메일
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/8 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                비밀번호
              </label>
              <input
                type="password"
                placeholder="6자 이상"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/8 transition text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '처리 중...' : (isSignUp ? '회원가입' : '로그인')}
            </button>
          </form>

          {/* 전환 링크 */}
          <div className="text-center mb-5">
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setMessage(''); }}
              className="text-sm text-blue-400 hover:text-blue-300 transition"
            >
              {isSignUp ? '이미 계정이 있으신가요? 로그인 →' : '아직 계정이 없으신가요? 회원가입 →'}
            </button>
          </div>

          {/* 구분선 */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-transparent text-slate-500 text-xs">또는 소셜 로그인</span>
            </div>
          </div>

          {/* 구글 로그인 */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-white font-medium text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google로 계속하기
          </button>
        </div>

        {/* 홈으로 */}
        <div className="text-center mt-6">
          <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm transition">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#04102b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
