import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

// Edge Runtime에서 Web Crypto API로 관리자 토큰 검증
async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) return false;

    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [encoded, sig] = parts;

    const keyData = new TextEncoder().encode(secret);
    const key = await crypto.subtle.importKey(
      'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );

    const sigBuffer = Uint8Array.from(
      atob(sig.replace(/-/g, '+').replace(/_/g, '/')),
      c => c.charCodeAt(0)
    );
    const dataBuffer = new TextEncoder().encode(encoded);

    const valid = await crypto.subtle.verify('HMAC', key, sigBuffer, dataBuffer);
    if (!valid) return false;

    const paddedEncoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(paddedEncoded + '='.repeat((4 - paddedEncoded.length % 4) % 4)));
    return Date.now() < payload.exp;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin 경로 보호 (/admin/login 제외)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token')?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // API 라우트는 세션 갱신 불필요 — 각 API에서 독립적으로 인증 처리
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Supabase 세션 갱신 — 실패해도 페이지 접근은 허용
  try {
    return await updateSession(request);
  } catch {
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
