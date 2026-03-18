import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * GET /api/subscription
 * 내 활성/만료 구독 목록 조회
 * - auth 검증은 anon client, DB 조회는 admin client (RLS 우회)
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  // admin client로 RLS 우회 (subscriptions 테이블 SELECT 정책 없을 때도 동작)
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('subscriptions')
    .select('id, product_id, status, auto_renew, started_at, expires_at, cancelled_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: 'DB_ERROR', detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, subscriptions: data ?? [] });
}
