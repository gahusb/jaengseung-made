'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

const AUTH_PATHS = ['/login', '/signup', '/admin'];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#04102b] border-b border-[#1a3a7a]/50 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="메뉴 열기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs">
              쟁
            </div>
            <span className="text-white font-bold text-base">쟁승메이드</span>
          </div>
          <div className="w-9" />
        </header>

        {/* Main scrollable content */}
        <main className="main-content">
          {children}
          {/* 토스페이먼츠 심사용 사업자 정보 푸터 */}
          <footer className="border-t border-slate-200 bg-white px-6 py-6 text-slate-500 text-xs">
            <div className="max-w-5xl">
              <p className="font-semibold text-slate-700 mb-2">쟁승메이드</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 leading-relaxed">
                <span>대표자: 박재오</span>
                <span>사업자등록번호: 267-53-00822</span>
                <span>주소: 서울시 동작구 여의대방로22아길 22, 1동 109호</span>
                <span>전화: 010-3907-1392</span>
                <span>이메일: bgg8988@gmail.com</span>
              </div>
              <p className="mt-2 text-slate-400">© 2025 쟁승메이드. All rights reserved.</p>
            </div>
          </footer>
        </main>
      </div>

      {/* 카카오 오픈채팅 플로팅 버튼 */}
      <a
        href="https://open.kakao.com/o/s9stoNvb"
        target="_blank"
        rel="noopener noreferrer"
        className="kakao-float-btn"
        aria-label="카카오 오픈채팅 상담"
        title="카카오 오픈채팅으로 1:1 상담"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C6.477 3 2 6.589 2 11c0 2.713 1.574 5.117 4 6.663V21l3.5-2.1A11.5 11.5 0 0 0 12 19c5.523 0 10-3.589 10-8s-4.477-8-10-8z"/>
        </svg>
        <span className="kakao-float-label">1:1 상담</span>
      </a>

      <style>{`
        .kakao-float-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FEE500;
          color: #3A1D1D;
          padding: 12px 18px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(254,229,0,0.4), 0 2px 8px rgba(0,0,0,0.15);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
        }
        .kakao-float-btn:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 8px 28px rgba(254,229,0,0.5), 0 4px 12px rgba(0,0,0,0.15);
        }
        .kakao-float-btn:active {
          transform: translateY(-1px) scale(0.98);
        }
        @media (max-width: 640px) {
          .kakao-float-btn {
            bottom: 20px;
            right: 16px;
            padding: 10px 14px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}
