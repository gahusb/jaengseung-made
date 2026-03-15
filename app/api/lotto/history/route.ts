import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/lotto/history
 * 생성된 로또 번호 조합을 히스토리에 저장
 * Body: { numbers: number[], source: 'nas' | 'client', plan_id: string }
 *
 * GET /api/lotto/history
 * 내 로또 번호 히스토리 조회
 * Query: limit (기본 50)
 */

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  let body: { numbers?: number[]; source?: string; plan_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 });
  }

  const { numbers, source = 'client', plan_id } = body;
  if (!Array.isArray(numbers) || numbers.length !== 6 || !plan_id) {
    return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 });
  }

  const { error } = await supabase.from('lotto_history').insert({
    user_id: user.id,
    numbers,
    source,
    plan_id,
  });

  if (error) {
    console.error('lotto_history insert error:', error);
    return NextResponse.json({ error: 'DB_ERROR' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? '50'), 200);

  const { data, error } = await supabase
    .from('lotto_history')
    .select('id, numbers, source, plan_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: 'DB_ERROR' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, history: data ?? [] });
}
