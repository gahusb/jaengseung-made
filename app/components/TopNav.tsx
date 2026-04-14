'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const LINKS = [
  { href: '/', label: '홈' },
  { href: '/services/music/samples', label: '샘플' },
  { href: '/services/music', label: '팩 상세' },
  { href: '/studio', label: '스튜디오' },
];

export default function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 h-20 px-6 lg:px-12 flex items-center justify-between transition-all ${
          scrolled ? 'backdrop-blur-md' : ''
        }`}
        style={{
          background: scrolled ? 'rgba(6,14,32,0.85)' : 'rgba(6,14,32,0.55)',
          borderBottom: '1px solid rgba(204,151,255,0.08)',
          boxShadow: scrolled ? '0 8px 40px 0 rgba(156,72,234,0.12)' : 'none',
        }}
      >
        <Link
          href="/"
          className="kx-display text-2xl font-black tracking-tight kx-gradient-text"
          style={{ textDecoration: 'none' }}
        >
          쟁승메이드
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
          <Link
            href="/login"
            className="hidden sm:inline-block text-sm font-medium px-4 py-2 transition-colors"
            style={{ color: 'var(--kx-on-variant)', textDecoration: 'none' }}
          >
            로그인
          </Link>
          <Link
            href="/services/music"
            className="kx-btn-primary hidden sm:inline-flex items-center px-5 py-2 rounded-full text-sm"
            style={{ textDecoration: 'none' }}
          >
            시작하기
          </Link>
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

      {/* 모바일 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 z-[60] md:hidden flex flex-col"
          style={{ background: 'rgba(6,14,32,0.98)', backdropFilter: 'blur(16px)' }}
        >
          <div className="flex items-center justify-between px-6 h-20">
            <span className="kx-display text-2xl font-black kx-gradient-text">쟁승메이드</span>
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
            <div className="mt-6 flex gap-3">
              <Link
                href="/login"
                className="flex-1 py-3 text-center rounded-full text-sm font-bold"
                style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'var(--kx-on-surface)', textDecoration: 'none' }}
              >
                로그인
              </Link>
              <Link
                href="/services/music"
                className="kx-btn-primary flex-1 py-3 text-center rounded-full text-sm"
                style={{ textDecoration: 'none' }}
              >
                시작하기
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
