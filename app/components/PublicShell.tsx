import TopNav from './TopNav';
import Link from 'next/link';

export default function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <main
        className="min-h-screen pt-20"
        style={{
          background: 'var(--kx-surface)',
          color: 'var(--kx-on-surface)',
        }}
      >
        {children}
        <footer className="bg-black text-white/70 px-6 lg:px-12 py-14 text-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 md:gap-8">
              {/* 좌 — JSM + social */}
              <div>
                <p
                  className="kx-display font-bold text-2xl mb-5 text-white tracking-tight"
                  style={{ letterSpacing: '0.02em' }}
                >
                  JSM
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.youtube.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-9 h-9 rounded-full border border-white/20 hover:border-white hover:bg-white hover:text-black text-white flex items-center justify-center transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
                    </svg>
                  </a>
                  <a
                    href="https://x.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (Twitter)"
                    className="w-9 h-9 rounded-full border border-white/20 hover:border-white hover:bg-white hover:text-black text-white flex items-center justify-center transition"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-9 h-9 rounded-full border border-white/20 hover:border-white hover:bg-white hover:text-black text-white flex items-center justify-center transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                  <a
                    href="mailto:bgg8988@gmail.com"
                    aria-label="Email"
                    className="w-9 h-9 rounded-full border border-white/20 hover:border-white hover:bg-white hover:text-black text-white flex items-center justify-center transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* 우 — Link groups */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
                <div>
                  <p className="font-mono text-[11px] tracking-widest uppercase text-white/40 mb-4">Product</p>
                  <ul className="space-y-2.5">
                    <li><Link href="/services/music" className="hover:text-white transition">AI 음악 팩</Link></li>
                    <li><Link href="/services/music/samples" className="hover:text-white transition">샘플 갤러리</Link></li>
                    <li><Link href="/services/music#pricing" className="hover:text-white transition">가격</Link></li>
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-[11px] tracking-widest uppercase text-white/40 mb-4">Company</p>
                  <ul className="space-y-2.5">
                    <li><Link href="/saju" className="hover:text-white transition">AI 사주</Link></li>
                    <li><Link href="/services/blog" className="hover:text-white transition">블로그 자동화</Link></li>
                    <li><a href="mailto:bgg8988@gmail.com" className="hover:text-white transition">문의하기</a></li>
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-[11px] tracking-widest uppercase text-white/40 mb-4">Legal</p>
                  <ul className="space-y-2.5">
                    <li><Link href="/legal/terms" className="hover:text-white transition">이용약관</Link></li>
                    <li><Link href="/legal/privacy" className="hover:text-white transition">개인정보처리방침</Link></li>
                    <li><Link href="/legal/refund" className="hover:text-white transition">환불 정책</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40 leading-relaxed">
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
    </>
  );
}
