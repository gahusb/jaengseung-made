import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireSubscription } from '../../_nas';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireSubscription();
    if (auth instanceof NextResponse) return auth;

    const supabase = await createClient();
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('lotto_purchases')
      .update({ prize: body.prize, note: body.note })
      .eq('id', parseInt(id))
      .eq('user_id', auth.userId) // 본인 데이터만 수정
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error('[purchase PUT]', err);
    return NextResponse.json({ error: 'DB_ERROR' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireSubscription();
    if (auth instanceof NextResponse) return auth;

    const supabase = await createClient();
    const { id } = await params;

    const { error } = await supabase
      .from('lotto_purchases')
      .delete()
      .eq('id', parseInt(id))
      .eq('user_id', auth.userId); // 본인 데이터만 삭제

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[purchase DELETE]', err);
    return NextResponse.json({ error: 'DB_ERROR' }, { status: 500 });
  }
}
