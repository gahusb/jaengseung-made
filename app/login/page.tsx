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
    // dev 환경에서는 NEXT_PUBLIC_SITE_URL을 무시하고 현재 브라우저 origin 사용
    // (NEXT_PUBLIC_SITE_URL이 .env.local에 있어도 localhost로 콜백 돌아옴)
    const base =
      process.env.NODE_ENV === 'development'
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${base}/auth/callback` },
    });
    if (error) setMessage('Google 로그인 오류: ' + error.message);
  };

  const isSuccess =
    message.includes('완료') || message.includes('확인해주세요');

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'var(--jsm-bg)' }}
    >
      <div className="w-full max-w-sm">
        {/* 워드마크 */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block"
            style={{
              fontWeight: 800,
              fontSize: '1.375rem',
              letterSpacing: '-0.03em',
              color: 'var(--jsm-ink)',
              transition: 'color 0.15s',
            }}
          >
            쟁승메이드
          </Link>
          <p
            className="mt-2 text-sm break-keep"
            style={{ color: 'var(--jsm-ink-soft)', letterSpacing: '-0.01em' }}
          >
            {isSignUp
              ? '가입 후 의뢰 현황과 구매 내역을 관리하세요'
              : '로그인하고 의뢰 현황과 구매 내역을 확인하세요'}
          </p>
        </div>

        {/* 카드 */}
        <div
          className="rounded-xl p-8"
          style={{
            background: 'var(--jsm-surface)',
            border: '1px solid var(--jsm-line)',
            boxShadow: '0 1px 4px 0 rgba(15,23,42,0.06), 0 4px 16px 0 rgba(15,23,42,0.04)',
          }}
        >
          {/* 카드 헤더 */}
          <h1
            className="text-xl font-bold mb-6 text-center"
            style={{ color: 'var(--jsm-ink)', letterSpacing: '-0.02em' }}
          >
            {isSignUp ? '회원가입' : '로그인'}
          </h1>

          {/* Google 로그인 */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium mb-5"
            style={{
              background: 'var(--jsm-surface)',
              border: '1px solid var(--jsm-line)',
              color: 'var(--jsm-ink)',
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--jsm-surface-alt)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--jsm-surface)';
            }}
          >
            {/* Google G 로고 */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google로 계속하기
          </button>

          {/* 구분선 */}
          <div className="relative mb-5">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden
            >
              <div className="w-full" style={{ borderTop: '1px solid var(--jsm-line)' }} />
            </div>
            <div className="relative flex justify-center">
              <span
                className="px-3 text-xs"
                style={{ background: 'var(--jsm-surface)', color: 'var(--jsm-ink-faint)' }}
              >
                또는
              </span>
            </div>
          </div>

          {/* 오류/성공 메시지 */}
          {message && (
            <div
              className="mb-4 px-3.5 py-3 rounded-lg text-sm"
              style={{
                background: isSuccess ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${isSuccess ? '#bbf7d0' : '#fecaca'}`,
                color: isSuccess ? '#15803d' : '#dc2626',
              }}
            >
              {message}
            </div>
          )}

          {/* 이메일/비밀번호 폼 */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--jsm-ink)', letterSpacing: '-0.01em' }}
              >
                이메일
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  background: 'var(--jsm-surface)',
                  border: '1px solid var(--jsm-line)',
                  color: 'var(--jsm-ink)',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--jsm-accent)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--jsm-line)';
                }}
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--jsm-ink)', letterSpacing: '-0.01em' }}
              >
                비밀번호
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="6자 이상 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  background: 'var(--jsm-surface)',
                  border: '1px solid var(--jsm-line)',
                  color: 'var(--jsm-ink)',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--jsm-accent)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--jsm-line)';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold mt-1"
              style={{
                background: loading ? 'var(--jsm-line)' : 'var(--jsm-accent)',
                color: loading ? 'var(--jsm-ink-soft)' : '#ffffff',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s, transform 0.15s',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={(e) => {
                if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'var(--jsm-accent-hover)';
              }}
              onMouseLeave={(e) => {
                if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'var(--jsm-accent)';
              }}
            >
              {loading ? '처리 중...' : isSignUp ? '가입하기' : '로그인'}
            </button>
          </form>

          {/* 가입/로그인 전환 */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setMessage(''); }}
              className="text-sm"
              style={{
                color: 'var(--jsm-accent)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '-0.01em',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--jsm-accent-hover)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--jsm-accent)';
              }}
            >
              {isSignUp
                ? '이미 계정이 있으신가요? 로그인'
                : '계정이 없으신가요? 회원가입'}
            </button>
          </div>
        </div>

        {/* 홈으로 */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm"
            style={{ color: 'var(--jsm-ink-faint)', transition: 'color 0.15s', letterSpacing: '-0.01em' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--jsm-ink-soft)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--jsm-ink-faint)';
            }}
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--jsm-bg)' }}
      >
        <div
          className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--jsm-line)', borderTopColor: 'var(--jsm-accent)' }}
        />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
