'use client';

import { usePathname } from 'next/navigation';
import PublicShell from './PublicShell';

const STANDALONE_PATHS = ['/login', '/signup', '/admin', '/gyeol'];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isStandalone = STANDALONE_PATHS.some((p) => pathname.startsWith(p));

  if (isStandalone) {
    return <>{children}</>;
  }

  return <PublicShell>{children}</PublicShell>;
}
