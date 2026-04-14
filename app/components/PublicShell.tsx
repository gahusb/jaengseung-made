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
        <footer
          className="mt-20 px-6 lg:px-12 py-10 text-xs"
          style={{
            background: 'var(--kx-surface-low)',
            color: 'var(--kx-on-variant)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-5">
              <div>
                <p className="kx-display font-extrabold text-lg mb-2" style={{ color: 'var(--kx-on-surface)' }}>쟁승메이드</p>
                <p className="leading-relaxed max-w-md">
                  AI 음악·블로그 자동화·사주 분석까지. 현직 엔지니어가 직접 설계·운영하는 AI 크리에이티브 스토어.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <Link href="/legal/terms" className="hover:text-white transition">이용약관</Link>
                <Link href="/legal/privacy" className="hover:text-white transition">개인정보처리방침</Link>
                <Link href="/legal/refund" className="hover:text-white transition">환불 정책</Link>
              </div>
            </div>
            <div className="pt-5 border-t flex flex-wrap gap-x-4 gap-y-1 leading-relaxed" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <span>대표자: 박재오</span>
              <span>사업자등록번호: 267-53-00822</span>
              <span>주소: 서울시 동작구 여의대방로22아길 22, 1동 109호</span>
              <span>전화: 010-3907-1392</span>
              <span>이메일: bgg8988@gmail.com</span>
            </div>
            <p className="mt-3">© 2026 쟁승메이드. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
