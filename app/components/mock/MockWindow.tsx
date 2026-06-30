// 라이트 UI 목업의 공용 크롬 프레임 (서버 컴포넌트).
// 실데이터 없이 "운영 중인 화면" 인상을 주는 craft 요소. --jsm-* 토큰만 사용.
import type { ReactNode } from 'react';

interface MockWindowProps {
  /** 타이틀바 텍스트 — 파일/서비스명 느낌 (예: 'stock-report', 'realestate-match') */
  title: string;
  children: ReactNode;
  className?: string;
}

export default function MockWindow({ title, children, className }: MockWindowProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)] ${className ?? ''}`}
      style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
    >
      {/* 타이틀바 — 신호등 + 모노 파일명 + 라이브 점 */}
      <div
        className="flex items-center gap-2 border-b px-3.5 py-2.5"
        style={{ background: 'var(--jsm-surface-alt)', borderColor: 'var(--jsm-line)' }}
      >
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#cbd5e1' }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#d8e0ea' }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#e2e8f0' }} />
        </span>
        <span
          className="ml-1 font-mono text-[11px]"
          style={{ color: 'var(--jsm-ink-faint)', letterSpacing: '-0.01em' }}
        >
          {title}
        </span>
        <span className="ml-auto flex items-center gap-1.5" aria-hidden>
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: 'var(--jsm-accent)' }}
          />
          <span
            className="font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: 'var(--jsm-ink-faint)' }}
          >
            live
          </span>
        </span>
      </div>
      {/* 본문 슬롯 */}
      <div className="p-4">{children}</div>
    </div>
  );
}
