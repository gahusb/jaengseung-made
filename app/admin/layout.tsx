import type { Metadata } from 'next';
import AdminSidebar from './components/AdminSidebar';

export const metadata: Metadata = {
  title: '관리자 패널 — 쟁승메이드',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
