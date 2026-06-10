import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient as createSSRClient } from '@supabase/ssr';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUserAccessibleProductIds, getFileById } from '@/lib/supabase/product-files';
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

  // 2) orders(paid) 단일 소스로 접근 가능한 product_id 확인
  const admin = createAdminClient();
  const accessible = await getUserAccessibleProductIds(admin, user.id);
  if (accessible.length === 0) {
    return NextResponse.json({ error: '구매 내역이 없거나 입금 확인 전입니다' }, { status: 403 });
  }
  const file = await getFileById(admin, fileId);
  if (!file || file.deleted_at || !file.product_id || !accessible.includes(file.product_id)) {
    return NextResponse.json({ error: '구매한 제품의 파일이 아닙니다' }, { status: 403 });
  }

  // 3) web-backend 호출 → DSM 공유 링크
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
