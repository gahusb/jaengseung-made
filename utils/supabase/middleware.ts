import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieMethodsServer } from '@supabase/ssr';

export async function updateSession(request: NextRequest) {
  // Supabase 환경변수가 없으면 그냥 통과
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
      supabaseResponse = NextResponse.next({ request });
      cookiesToSet.forEach(({ name, value, options }) =>
        supabaseResponse.cookies.set(name, value, options)
      );
    },
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: cookieMethods }
  );

  // 세션 갱신 (IMPORTANT: getUser()는 반드시 호출해야 함)
  await supabase.auth.getUser();

  return supabaseResponse;
}
