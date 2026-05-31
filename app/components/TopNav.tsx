'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const LINKS = [
  { href: '/packages', label: 'SaaS 제품' },
  { href: '/music', label: 'AI 음악' },
  { href: '/work', label: '커스텀 외주' },
];

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Supabase auth state subscription (Sidebar.tsx:93-103 패턴)
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setUser(data.session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    router.replace('/');
    router.refresh();
  };

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      <header
        className={[
          'fixed left-1/2 -translate-x-1/2 z-50 w-full border-b border-transparent',
          'md:rounded-full md:border transition-all duration-300 ease-out',
          scrolled
            ? 'top-4 max-w-3xl md:shadow-[0_10px_40px_rgba(0,0,0,0.35)] md:border-white/10'
            : 'top-0 max-w-none',
        ].join(' ')}
        style={{
          background: scrolled ? 'rgba(10,10,12,0.6)' : 'transparent',
          backdropFilter: scrolled ? 'blur(18px) saturate(160%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(160%)' : 'none',
        }}
      >
      <nav
        className={[
          'flex w-full items-center justify-between transition-all duration-300 ease-out',
          scrolled ? 'h-14 px-4 md:px-3' : 'h-20 px-6 lg:px-12',
        ].join(' ')}
      >
        <Link
          href="/"
          className="kx-display text-2xl font-black tracking-tight kx-gradient-text"
          style={{ textDecoration: 'none', letterSpacing: '0.02em' }}
        >
          JSM
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium transition-colors"
              style={{
                color: isActive(l.href) ? '#fff' : 'var(--kx-on-variant)',
                borderBottom: isActive(l.href) ? '2px solid var(--kx-primary)' : '2px solid transparent',
                paddingBottom: 4,
                textDecoration: 'none',
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/mypage"
                className="hidden sm:inline-block text-sm font-medium px-4 py-2 transition-colors"
                style={{ color: 'var(--kx-on-variant)', textDecoration: 'none' }}
              >
                마이페이지
              </Link>
              <Link
                href="/music"
                className="kx-btn-primary hidden sm:inline-flex items-center px-5 py-2 rounded-full text-sm"
                style={{ textDecoration: 'none' }}
              >
                Try now
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center px-3 py-2 text-sm font-medium transition-colors"
                style={{ color: 'var(--kx-on-variant)', background: 'transparent' }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-block text-sm font-medium px-4 py-2 transition-colors"
                style={{ color: 'var(--kx-on-variant)', textDecoration: 'none' }}
              >
                로그인
              </Link>
              <Link
                href="/music"
                className="kx-btn-primary hidden sm:inline-flex items-center px-5 py-2 rounded-full text-sm"
                style={{ textDecoration: 'none' }}
              >
                Try now
              </Link>
            </>
          )}
          <button
            onClick={() => setOpen(true)}
            aria-label="메뉴 열기"
            className="md:hidden p-2 rounded-lg"
            style={{ color: 'var(--kx-on-surface)' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
      </header>

      {/* 모바일 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 z-[60] md:hidden flex flex-col"
          style={{ background: 'rgba(6,14,32,0.98)', backdropFilter: 'blur(16px)' }}
        >
          <div className="flex items-center justify-between px-6 h-20">
            <span className="kx-display text-2xl font-black kx-gradient-text" style={{ letterSpacing: '0.02em' }}>JSM</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="메뉴 닫기"
              className="p-2"
              style={{ color: 'var(--kx-on-surface)' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex flex-col gap-2 px-6 pt-6">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="kx-display text-2xl font-bold py-3"
                style={{
                  color: isActive(l.href) ? 'var(--kx-primary)' : 'var(--kx-on-surface)',
                  textDecoration: 'none',
                }}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="flex gap-3">
                    <Link
                      href="/mypage"
                      className="flex-1 py-3 text-center rounded-full text-sm font-bold"
                      style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'var(--kx-on-surface)', textDecoration: 'none' }}
                    >
                      마이페이지
                    </Link>
                    <Link
                      href="/music"
                      className="kx-btn-primary flex-1 py-3 text-center rounded-full text-sm"
                      style={{ textDecoration: 'none' }}
                    >
                      Try now
                    </Link>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 text-center text-sm font-medium transition-colors"
                    style={{ color: 'var(--kx-on-variant)', background: 'transparent' }}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    className="flex-1 py-3 text-center rounded-full text-sm font-bold"
                    style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'var(--kx-on-surface)', textDecoration: 'none' }}
                  >
                    로그인
                  </Link>
                  <Link
                    href="/music"
                    className="kx-btn-primary flex-1 py-3 text-center rounded-full text-sm"
                    style={{ textDecoration: 'none' }}
                  >
                    Try now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
