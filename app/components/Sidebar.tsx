'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/* ── 3구역 네비게이션 구조 ─────────────────────────────────── */

interface NavItem {
  href: string;
  label: string;
  badge?: string;
  icon: React.ReactNode;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'AI 상품',
    items: [
      {
        href: '/services/prompt',
        label: '프롬프트 스토어',
        badge: 'HOT',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
      },
      {
        href: '/services/automation',
        label: '업무 자동화',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        href: '/services/ai-kit',
        label: 'AI 자동화 키트',
        badge: '구독',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: '무료 도구',
    items: [
      {
        href: '/saju',
        label: 'AI 사주 분석',
        badge: '무료',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        ),
      },
      {
        href: '/tools',
        label: '도구 쇼케이스',
        badge: 'DEMO',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: '외주 의뢰',
    items: [
      {
        href: '/freelance',
        label: '외주 개발 문의',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        href: '/services/website',
        label: '홈페이지 제작',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
    ],
  },
];

/* ── 배지 색상 ─────────────────────────────────────────────── */
function badgeStyle(badge: string) {
  switch (badge) {
    case 'HOT':
      return 'bg-rose-500/15 text-rose-400';
    case '구독':
      return 'bg-violet-500/15 text-violet-400';
    case '무료':
      return 'bg-sky-500/15 text-sky-400';
    case 'DEMO':
      return 'bg-amber-500/15 text-amber-400';
    default:
      return 'bg-emerald-500/15 text-emerald-400';
  }
}

/* ── 컴포넌트 ──────────────────────────────────────────────── */

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-60 z-30 flex flex-col
          bg-[#04102b]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:flex
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand */}
        <div className="px-5 pt-6 pb-5 flex-shrink-0">
          <Link href="/" onClick={onClose} className="block group">
            <div className="text-white font-bold text-lg tracking-tight leading-none">쟁승메이드</div>
            <p className="text-slate-500 text-xs mt-1 tracking-tight">AI 프롬프트 · 자동화 스토어</p>
          </Link>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/5 flex-shrink-0" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto" aria-label="메인 메뉴">
          {/* 홈 */}
          <Link
            href="/"
            onClick={onClose}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative mb-3
              ${pathname === '/'
                ? 'bg-white/8 text-white border-l-2 border-blue-500 pl-[10px]'
                : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border-l-2 border-transparent pl-[10px]'
              }
            `}
          >
            <span className={`flex-shrink-0 transition-colors ${pathname === '/' ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </span>
            <span className={`text-sm font-medium ${pathname === '/' ? 'text-white' : ''}`}>홈</span>
          </Link>

          {/* Grouped items */}
          {navGroups.map((group, gi) => {
            const groupId = `nav-group-${gi}`;
            return (
              <div key={group.title} className={gi > 0 ? 'mt-5' : ''} role="group" aria-labelledby={groupId}>
                <h3 id={groupId} className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  {group.title}
                </h3>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href
                      || (item.href !== '/' && pathname.startsWith(item.href + '/'));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative
                          ${isActive
                            ? 'bg-white/8 text-white border-l-2 border-blue-500 pl-[10px]'
                            : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border-l-2 border-transparent pl-[10px]'
                          }
                        `}
                      >
                        <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
                          {item.icon}
                        </span>
                        <span className={`text-sm font-medium flex-1 truncate ${isActive ? 'text-white' : ''}`}>
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${badgeStyle(item.badge)}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Business info */}
        <div className="mx-5 h-px bg-white/5 flex-shrink-0" />
        <div className="px-5 py-4 flex-shrink-0">
          <dl className="space-y-0.5">
            <dd className="text-slate-600 text-[10px] font-mono">상호 쟁승메이드 · 대표 박재오</dd>
            <dd className="text-slate-600 text-[10px] font-mono">010-3907-1392 · bgg8988@gmail.com</dd>
            <dd className="text-slate-700 text-[10px] font-mono mt-1">© 2025 쟁승메이드</dd>
          </dl>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/5 flex-shrink-0" />

        {/* Login section */}
        <div className="px-4 py-4 flex-shrink-0">
          {userEmail ? (
            <div className="space-y-1">
              <Link
                href="/mypage"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${
                  pathname.startsWith('/mypage')
                    ? 'bg-white/8 text-white border-l-2 border-blue-500 pl-[10px]'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border-l-2 border-transparent pl-[10px]'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {userEmail[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate text-slate-300">{userEmail}</div>
                  <div className="text-slate-600 text-[10px]">마이페이지</div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-1.5 text-slate-600 hover:text-slate-400 text-xs transition-colors font-mono"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <p className="px-3 text-slate-700 text-xs leading-relaxed">
              AI 사주·키트 이용 시<br/>
              <Link href="/login" onClick={onClose} className="text-slate-500 hover:text-slate-300 underline underline-offset-2 transition-colors">로그인이 필요합니다</Link>
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
