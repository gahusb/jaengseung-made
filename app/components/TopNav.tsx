'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const LINKS = [
  { href: '/outsourcing', label: '외주 개발' },
  { href: '/products', label: '소프트웨어' },
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
        className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300"
        style={{
          background: scrolled ? 'var(--jsm-surface)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--jsm-line)' : '1px solid transparent',
          boxShadow: scrolled ? '0 1px 8px rgba(15,23,42,0.06)' : 'none',
        }}
      >
        <nav className="max-w-7xl mx-auto flex w-full items-center justify-between h-16 px-6 lg:px-8">
          {/* 로고 */}
          <Link
            href="/"
            className="flex items-baseline gap-2"
            style={{ textDecoration: 'none' }}
          >
            <span
              className="text-xl font-black tracking-tight"
              style={{ color: 'var(--jsm-ink)', letterSpacing: '-0.02em' }}
            >
              JSM
            </span>
            <span
              className="hidden sm:inline text-sm font-medium"
              style={{ color: 'var(--jsm-ink-soft)', letterSpacing: '-0.01em' }}
            >
              쟁승메이드
            </span>
          </Link>

          {/* 데스크탑 링크 */}
          <div className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium px-4 py-2 rounded-md transition-colors duration-150"
                style={{
                  color: isActive(l.href) ? 'var(--jsm-accent)' : 'var(--jsm-ink-soft)',
                  background: isActive(l.href) ? 'var(--jsm-accent-soft)' : 'transparent',
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* 데스크탑 CTA + auth */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/mypage"
                  className="hidden sm:inline-block text-sm font-medium px-3 py-2 rounded-md transition-colors duration-150"
                  style={{ color: 'var(--jsm-ink-soft)', textDecoration: 'none', letterSpacing: '-0.01em' }}
                >
                  마이페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150"
                  style={{ color: 'var(--jsm-ink-soft)', background: 'transparent', letterSpacing: '-0.01em' }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-block text-sm font-medium px-3 py-2 rounded-md transition-colors duration-150"
                style={{ color: 'var(--jsm-ink-soft)', textDecoration: 'none', letterSpacing: '-0.01em' }}
              >
                로그인
              </Link>
            )}
            <Link
              href="/outsourcing#contact"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-150"
              style={{
                background: 'var(--jsm-accent)',
                color: '#ffffff',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--jsm-accent-hover)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--jsm-accent)'; }}
            >
              프로젝트 문의
            </Link>

            {/* 모바일 햄버거 */}
            <button
              onClick={() => setOpen(true)}
              aria-label="메뉴 열기"
              className="md:hidden p-2 rounded-lg transition-colors duration-150"
              style={{ color: 'var(--jsm-ink)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* 모바일 드로어 */}
      {open && (
        <div
          className="fixed inset-0 z-[60] md:hidden"
          style={{ background: 'rgba(15,23,42,0.4)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute top-0 right-0 h-full w-72 flex flex-col shadow-xl"
            style={{ background: 'var(--jsm-surface)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 드로어 헤더 */}
            <div
              className="flex items-center justify-between px-6 h-16 border-b"
              style={{ borderColor: 'var(--jsm-line)' }}
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="text-lg font-black tracking-tight"
                  style={{ color: 'var(--jsm-ink)', letterSpacing: '-0.02em' }}
                >
                  JSM
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: 'var(--jsm-ink-soft)' }}
                >
                  쟁승메이드
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="메뉴 닫기"
                className="p-2 rounded-lg transition-colors duration-150"
                style={{ color: 'var(--jsm-ink-soft)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 드로어 링크 */}
            <div className="flex-1 flex flex-col px-4 pt-4 gap-1">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-base font-semibold px-3 py-3 rounded-lg transition-colors duration-150"
                  style={{
                    color: isActive(l.href) ? 'var(--jsm-accent)' : 'var(--jsm-ink)',
                    background: isActive(l.href) ? 'var(--jsm-accent-soft)' : 'transparent',
                    textDecoration: 'none',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {l.label}
                </Link>
              ))}

              <div
                className="my-4 border-t"
                style={{ borderColor: 'var(--jsm-line)' }}
              />

              {user ? (
                <>
                  <Link
                    href="/mypage"
                    className="text-sm font-medium px-3 py-3 rounded-lg transition-colors duration-150"
                    style={{ color: 'var(--jsm-ink-soft)', textDecoration: 'none', letterSpacing: '-0.01em' }}
                  >
                    마이페이지
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-sm font-medium px-3 py-3 rounded-lg transition-colors duration-150"
                    style={{ color: 'var(--jsm-ink-soft)', background: 'transparent', letterSpacing: '-0.01em' }}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium px-3 py-3 rounded-lg transition-colors duration-150"
                  style={{ color: 'var(--jsm-ink-soft)', textDecoration: 'none', letterSpacing: '-0.01em' }}
                >
                  로그인
                </Link>
              )}
            </div>

            {/* 드로어 하단 CTA */}
            <div className="px-4 pb-6">
              <Link
                href="/outsourcing#contact"
                className="flex items-center justify-center w-full py-3 rounded-lg text-sm font-semibold transition-colors duration-150"
                style={{
                  background: 'var(--jsm-accent)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                }}
              >
                프로젝트 문의
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
