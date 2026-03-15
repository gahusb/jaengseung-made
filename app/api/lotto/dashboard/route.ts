import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const LOTTO_PRODUCT_IDS = ['lotto_gold', 'lotto_platinum', 'lotto_diamond'];

async function nasGet(path: string): Promise<unknown> {
  const base = process.env.NAS_LOTTO_API_URL;
  if (!base) throw new Error('NAS_URL_NOT_CONFIGURED');

  const headers: Record<string, string> = {};
  if (process.env.NAS_LOTTO_API_KEY) {
    headers['Authorization'] = `Bearer ${process.env.NAS_LOTTO_API_KEY}`;
  }

  const res = await fetch(`${base}${path}`, {
    method: 'GET',
    headers,
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) throw new Error(`NAS_${res.status}`);
  return res.json();
}

/**
 * GET /api/lotto/dashboard
 * 페이지 초기 로드용: latest + analysis + simulation 이력 병렬 조회
 *
 * Response:
 * {
 *   plan: string,
 *   latest: { drawNo, date, numbers, bonus, metrics },
 *   analysis: { total_draws, mean_sum, std_sum, number_stats[] },
 *   simulation: { runs[] }
 * }
 */
export async function GET() {
  try {
    // 1. 인증
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    // 2. 구독 확인
    const { data: orders } = await supabase
      .from('orders')
      .select('id, product_id, status, created_at')
      .eq('user_id', user.id)
      .eq('status', 'paid')
      .in('product_id', LOTTO_PRODUCT_IDS)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!orders || orders.length === 0) {
      return NextResponse.json({ error: 'NOT_SUBSCRIBED' }, { status: 403 });
    }

    const order = orders[0];
    const diffDays =
      (Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60 * 24);
    const maxDays = order.product_id === 'lotto_annual' ? 366 : 31;

    if (diffDays > maxDays) {
      return NextResponse.json({ error: 'NOT_SUBSCRIBED' }, { status: 403 });
    }

    // 3. NAS 병렬 조회
    const [latest, analysis, simulation] = await Promise.allSettled([
      nasGet('/api/lotto/latest'),
      nasGet('/api/lotto/analysis'),
      nasGet('/api/lotto/simulation'),
    ]);

    return NextResponse.json({
      ok: true,
      plan: order.product_id,
      latest: latest.status === 'fulfilled' ? latest.value : null,
      analysis: analysis.status === 'fulfilled' ? analysis.value : null,
      simulation: simulation.status === 'fulfilled' ? simulation.value : null,
    });
  } catch (err: unknown) {
    const e = err as { name?: string; message?: string };
    if (e?.name === 'TimeoutError') {
      return NextResponse.json({ error: 'NAS_TIMEOUT' }, { status: 504 });
    }
    console.error('Lotto dashboard error:', err);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
