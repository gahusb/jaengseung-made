import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/mypage';

  // 프로덕션 기준 URL 결정
  // 우선순위: NEXT_PUBLIC_SITE_URL > x-forwarded-host > origin
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const forwardedHost = request.headers.get('x-forwarded-host');
  const baseUrl =
    siteUrl ??
    (process.env.NODE_ENV !== 'development' && forwardedHost
      ? `https://${forwardedHost}`
      : origin);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${baseUrl}${next}`);
    }
  }

  return NextResponse.redirect(`${baseUrl}/login?error=auth-callback-error`);
}
