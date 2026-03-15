import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const LOTTO_PRODUCT_IDS = ['lotto_gold', 'lotto_platinum', 'lotto_diamond'];

/** 구독 유효 여부 확인 */
async function checkSubscription(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data: orders } = await supabase
    .from('orders')
    .select('id, product_id, status, created_at')
    .eq('user_id', userId)
    .eq('status', 'paid')
    .in('product_id', LOTTO_PRODUCT_IDS)
    .order('created_at', { ascending: false })
    .limit(1);

  if (!orders || orders.length === 0) return null;

  const order = orders[0];
  const diffDays =
    (Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60 * 24);
  const maxDays = order.product_id === 'lotto_annual' ? 366 : 31;

  return diffDays <= maxDays ? order : null;
}

/** NAS API 호출 헬퍼 */
async function nasGet(path: string): Promise<Response> {
  const base = process.env.NAS_LOTTO_API_URL;
  if (!base) throw new Error('NAS_URL_NOT_CONFIGURED');

  const headers: Record<string, string> = {};
  if (process.env.NAS_LOTTO_API_KEY) {
    headers['Authorization'] = `Bearer ${process.env.NAS_LOTTO_API_KEY}`;
  }

  return fetch(`${base}${path}`, {
    method: 'GET',
    headers,
    signal: AbortSignal.timeout(15000),
  });
}

/**
 * GET /api/lotto/recommend
 * Query params:
 *   mode = "single" (기본) | "batch" | "best"
 *
 * single → NAS GET /api/lotto/recommend
 * batch  → NAS GET /api/lotto/recommend/batch  (5개 조합)
 * best   → NAS GET /api/lotto/best             (Monte Carlo 상위 20쌍)
 */
export async function GET(req: NextRequest) {
  try {
    // 1. 세션 확인
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    // 2. 구독 확인
    const order = await checkSubscription(supabase, user.id);
    if (!order) {
      return NextResponse.json({ error: 'NOT_SUBSCRIBED' }, { status: 403 });
    }

    const mode = req.nextUrl.searchParams.get('mode') ?? 'single';

    // 3. NAS API 호출
    const nasPath =
      mode === 'batch'
        ? '/api/lotto/recommend/batch'
        : mode === 'best'
        ? '/api/lotto/best'
        : '/api/lotto/recommend';

    let nasRes: Response;
    try {
      nasRes = await nasGet(nasPath);
    } catch (fetchErr: unknown) {
      const e = fetchErr as { name?: string };
      console.warn('NAS unreachable:', fetchErr);
      if (e?.name === 'TimeoutError') {
        return NextResponse.json(
          { error: 'NAS_UNAVAILABLE', plan: order.product_id, mode },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: 'NAS_UNAVAILABLE', plan: order.product_id, mode },
        { status: 503 }
      );
    }

    if (!nasRes.ok) {
      const errText = await nasRes.text();
      console.error('NAS API error:', nasRes.status, errText);
      return NextResponse.json(
        { error: 'NAS_UNAVAILABLE', plan: order.product_id, mode },
        { status: 503 }
      );
    }

    const nasData = await nasRes.json();

    return NextResponse.json({
      ok: true,
      plan: order.product_id,
      mode,
      ...nasData,
    });
  } catch (err: unknown) {
    const e = err as { name?: string; message?: string };
    if (e?.message === 'NAS_URL_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'NAS_URL_NOT_CONFIGURED' }, { status: 500 });
    }
    console.error('Lotto recommend error:', err);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
