import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireSubscription } from '../../_nas';

export async function GET() {
  try {
    const auth = await requireSubscription();
    if (auth instanceof NextResponse) return auth;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('lotto_purchases')
      .select('amount, prize')
      .eq('user_id', auth.userId);

    if (error) throw error;

    const records = data ?? [];
    const total_invested = records.reduce((s, r) => s + (r.amount ?? 0), 0);
    const total_prize = records.reduce((s, r) => s + (r.prize ?? 0), 0);
    const prize_count = records.filter(r => (r.prize ?? 0) > 0).length;
    const max_prize = records.reduce((m, r) => Math.max(m, r.prize ?? 0), 0);

    return NextResponse.json({
      total_records: records.length,
      total_invested,
      total_prize,
      net: total_prize - total_invested,
      return_rate: total_invested > 0 ? Math.round((total_prize / total_invested) * 1000) / 10 : 0,
      prize_count,
      max_prize,
    });
  } catch (err) {
    console.error('[purchase/stats]', err);
    return NextResponse.json({ error: 'DB_ERROR' }, { status: 500 });
  }
}
