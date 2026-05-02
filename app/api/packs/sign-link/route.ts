import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient as createSSRClient } from '@supabase/ssr';
import { createAdminClient } from '@/lib/supabase/admin';
import { extractPackTier, type PackTier } from '@/lib/pack-assets';
import { tierIncludes, getPackFileById } from '@/lib/supabase/pack-files';
import { signLink } from '@/lib/web-backend';

export const runtime = 'nodejs';

const EXPIRES_IN_SEC = 4 * 60 * 60;  // 4시간

export async function POST(request: Request) {
  const { fileId } = await request.json();
  if (!fileId || typeof fileId !== 'string') {
    return NextResponse.json({ error: 'fileId 필요' }, { status: 400 });
  }

  // 1) 사용자 인증 (서버 사이드 supabase ssr 클라이언트)
  const cookieStore = await cookies();
  const supabase = createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2) orders 조회 — completed Music 팩 구매 확인
  const admin = createAdminClient();
  const { data: orders } = await admin
    .from('contact_requests')
    .select('service, status')
    .eq('user_id', user.id)
    .eq('status', 'completed');

  const tiers = new Set<PackTier>();
  for (const o of (orders ?? [])) {
    const t = extractPackTier(o.service);
    if (t) tierIncludes(t).forEach((x) => tiers.add(x));
  }
  if (tiers.size === 0) {
    return NextResponse.json({ error: '구매 내역이 없거나 결제 미완료입니다' }, { status: 403 });
  }

  // 3) 파일 조회 + tier 매칭
  const file = await getPackFileById(admin, fileId);
  if (!file) {
    return NextResponse.json({ error: '파일을 찾을 수 없습니다' }, { status: 404 });
  }
  if (!tiers.has(file.min_tier)) {
    return NextResponse.json({ error: '구매 등급에서 접근할 수 없는 파일입니다' }, { status: 403 });
  }

  // 4) web-backend 호출 → DSM 공유 링크
  try {
    const { url, expires_at } = await signLink({
      file_path: file.file_path,
      expires_in_seconds: EXPIRES_IN_SEC,
    });
    return NextResponse.json({ url, expiresAt: expires_at });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return NextResponse.json({ error: '링크 발급 실패', detail: msg }, { status: 502 });
  }
}
