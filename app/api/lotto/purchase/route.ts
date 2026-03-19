import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireSubscription } from '../_nas';

export async function GET(request: Request) {
  try {
    const auth = await requireSubscription();
    if (auth instanceof NextResponse) return auth;

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const drawNo = searchParams.get('draw_no');

    let query = supabase
      .from('lotto_purchases')
      .select('id, draw_no, amount, sets, prize, note, created_at')
      .eq('user_id', auth.userId)
      .order('draw_no', { ascending: false });

    if (drawNo) query = query.eq('draw_no', parseInt(drawNo));

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ records: data ?? [] });
  } catch (err) {
    console.error('[purchase GET]', err);
    return NextResponse.json({ error: 'DB_ERROR' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireSubscription();
    if (auth instanceof NextResponse) return auth;

    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('lotto_purchases')
      .insert({
        user_id: auth.userId,
        draw_no: body.draw_no,
        amount: body.amount ?? 5000,
        sets: body.sets ?? 5,
        prize: body.prize ?? 0,
        note: body.note ?? '',
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('[purchase POST]', err);
    return NextResponse.json({ error: 'DB_ERROR' }, { status: 500 });
  }
}
