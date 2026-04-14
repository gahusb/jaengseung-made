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
        href: '/services/music',
        label: 'AI 음악 마스터',
        badge: 'NEW',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19a3 3 0 11-6 0 3 3 0 016 0zm12-3a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        href: '/services/blog',
        label: '블로그 자동화 팩',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
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
