import TopNav from './TopNav';
import Link from 'next/link';
import KakaoFloatButton from './KakaoFloatButton';

export default function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <main
        className="min-h-screen pt-16"
        style={{
          background: 'var(--jsm-bg)',
          color: 'var(--jsm-ink)',
        }}
      >
        {children}
        <footer
          className="text-white/70 px-6 lg:px-12 py-14 text-sm"
          style={{ background: 'var(--jsm-navy)' }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 md:gap-8">
              {/* 좌 — JSM + 연락처 */}
              <div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span
                    className="font-black text-2xl text-white"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    JSM
                  </span>
                  <span className="text-sm text-white/50" style={{ letterSpacing: '-0.01em' }}>
                    쟁승메이드
                  </span>
                </div>
                <a
                  href="mailto:bgg8988@gmail.com"
                  className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-150 text-sm"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  bgg8988@gmail.com
                </a>
              </div>

              {/* 우 — Link groups */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
                <div>
                  <p
                    className="text-[11px] tracking-widest uppercase text-white/40 mb-4 font-medium"
                    style={{ fontFamily: 'monospace' }}
                  >
                    서비스
                  </p>
                  <ul className="space-y-2.5">
                    <li>
                      <Link
                        href="/outsourcing"
                        className="hover:text-white transition-colors duration-150"
                        style={{ letterSpacing: '-0.01em' }}
                      >
                        외주 개발
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products"
                        className="hover:text-white transition-colors duration-150"
                        style={{ letterSpacing: '-0.01em' }}
                      >
                        소프트웨어
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <p
                    className="text-[11px] tracking-widest uppercase text-white/40 mb-4 font-medium"
                    style={{ fontFamily: 'monospace' }}
                  >
                    회사
                  </p>
                  <ul className="space-y-2.5">
                    <li>
                      <a
                        href="mailto:bgg8988@gmail.com"
                        className="hover:text-white transition-colors duration-150"
                        style={{ letterSpacing: '-0.01em' }}
                      >
                        문의하기
                      </a>
                    </li>
                    <li>
                      <Link
                        href="/outsourcing#process"
                        className="hover:text-white transition-colors duration-150"
                        style={{ letterSpacing: '-0.01em' }}
                      >
                        진행 프로세스
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <p
                    className="text-[11px] tracking-widest uppercase text-white/40 mb-4 font-medium"
                    style={{ fontFamily: 'monospace' }}
                  >
                    Legal
                  </p>
                  <ul className="space-y-2.5">
                    <li>
                      <Link
                        href="/legal/terms"
                        className="hover:text-white transition-colors duration-150"
                        style={{ letterSpacing: '-0.01em' }}
                      >
                        이용약관
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/legal/privacy"
                        className="hover:text-white transition-colors duration-150"
                        style={{ letterSpacing: '-0.01em' }}
                      >
                        개인정보처리방침
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/legal/refund"
                        className="hover:text-white transition-colors duration-150"
                        style={{ letterSpacing: '-0.01em' }}
                      >
                        환불 정책
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div
              className="mt-12 pt-6 border-t flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40 leading-relaxed"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <span>대표자: 박재오</span>
              <span>사업자등록번호: 267-53-00822</span>
              <span>서울시 동작구 여의대방로22아길 22, 1동 109호</span>
              <span>010-3907-1392</span>
              <span>bgg8988@gmail.com</span>
            </div>
            <p className="mt-3 text-xs text-white/40">© 2026 쟁승메이드. All rights reserved.</p>
          </div>
        </footer>
      </main>

      <KakaoFloatButton />
    </>
  );
}
