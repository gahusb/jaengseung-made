import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createPortfolioToken, verifyAdminTokenNode } from '@/lib/admin-auth';

export const runtime = 'nodejs';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return !!token && verifyAdminTokenNode(token);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  try {
    const { memo, ttlDays } = await request.json();
    const safeMemo = typeof memo === 'string' ? memo : '';
    const safeTtl = Math.max(1, Math.min(365, Number(ttlDays) || 30));
    const token = createPortfolioToken(safeMemo, safeTtl);
    const expiresAt = new Date(Date.now() + safeTtl * 86400000).toISOString();
    return NextResponse.json({ token, expiresAt, memo: safeMemo });
  } catch {
    return NextResponse.json({ error: '토큰 생성 실패' }, { status: 500 });
  }
}
