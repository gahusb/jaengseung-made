'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  {
    href: '/',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    label: '홈',
    desc: '대시보드 홈',
  },
  {
    href: '/services/website',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: '홈페이지 제작',
    desc: '외주 웹 개발',
    badge: 'NEW',
  },
  {
    href: '/services/automation',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: '업무 자동화',
    desc: 'RPA 개발',
  },
  {
    href: '/services/prompt',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    label: '프롬프트 엔지니어링',
    desc: 'AI 최적화',
  },
  {
    href: '/saju',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    label: 'AI 사주 분석',
    desc: '사주팔자 + AI 해석',
    badge: 'NEW',
  },
];

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
          fixed top-0 left-0 h-full w-64 z-30 flex flex-col
          bg-[#04102b] border-r border-[#1a3a7a]/50
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:flex
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="p-5 border-b border-[#1a3a7a]/50 flex-shrink-0">
          <Link href="/" onClick={onClose} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-blue-500/25 flex-shrink-0">
              쟁
            </div>
            <div>
              <div className="text-white font-bold text-base leading-tight">쟁승메이드</div>
              <div className="text-blue-400 text-xs font-medium">Premium Dev Services</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <div className="px-3 pt-2 pb-1">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">메뉴</span>
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:bg-[#0a1f5c] hover:text-slate-100'
                  }
                `}
              >
                <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {item.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold truncate ${isActive ? 'text-white' : ''}`}>
                    {item.label}
                  </div>
                  <div className={`text-xs truncate ${isActive ? 'text-blue-200' : 'text-slate-600 group-hover:text-slate-500'}`}>
                    {item.desc}
                  </div>
                </div>
                {item.badge && (
                  <span className={`
                    text-xs font-bold px-1.5 py-0.5 rounded-md flex-shrink-0
                    ${item.badge === 'HOT' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}
                  `}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute right-2 w-1 h-5 bg-white/40 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 상호명 / 사업자 정보 — 토스페이먼츠 심사 필수 표기 */}
        <div className="px-4 pt-3 pb-1 border-t border-[#1a3a7a]/30 flex-shrink-0">
          <p className="text-slate-600 text-[10px] leading-relaxed">
            <span className="block font-semibold text-slate-500 mb-0.5">상호명 : 쟁승메이드</span>
            <span className="block">대표 : 박재오</span>
            <span className="block">이메일 : bgg8988@gmail.com</span>
            <span className="block">문의 : 010-3907-1392</span>
            <span className="block mt-1 text-slate-700">© 2025 쟁승메이드</span>
          </p>
        </div>

        {/* Bottom: 로그인 상태 */}
        <div className="p-4 border-t border-[#1a3a7a]/50 flex-shrink-0">
          {userEmail ? (
            /* 로그인 상태 */
            <div className="space-y-2">
              <Link
                href="/mypage"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  pathname.startsWith('/mypage')
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600'
                    : 'hover:bg-[#0a1f5c]'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow">
                  {userEmail[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-semibold truncate">{userEmail}</div>
                  <div className="text-blue-400 text-xs">마이페이지</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[#0a1f5c] text-xs transition-all"
              >
                로그아웃
              </button>
            </div>
          ) : (
            /* 비로그인 상태 */
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-1 mb-2">
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-400 text-sm font-medium">비로그인</div>
                  <div className="text-slate-600 text-xs">로그인하면 더 많은 기능</div>
                </div>
              </div>
              <Link
                href="/login"
                onClick={onClose}
                className="block w-full text-center bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold px-3 py-2 rounded-xl hover:opacity-90 transition-all"
              >
                로그인 / 회원가입
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
