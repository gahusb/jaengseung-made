import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminTokenNode } from '@/lib/admin-auth';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token || !verifyAdminTokenNode(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 각 회원의 주문 수 + 결제 금액 집계
  const enriched = await Promise.all(
    (profiles ?? []).map(async (p: { id: string; email: string; full_name: string; created_at: string }) => {
      const [ordersRes, paymentsRes, subsRes] = await Promise.all([
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', p.id).eq('status', 'paid'),
        supabase.from('payments').select('amount').eq('user_id', p.id).eq('status', 'paid'),
        supabase.from('subscriptions').select('product_id, status, expires_at').eq('user_id', p.id).eq('status', 'active').order('created_at', { ascending: false }).limit(1),
      ]);
      const totalPaid = (paymentsRes.data ?? []).reduce((s: number, x: { amount: number }) => s + x.amount, 0);
      const activeSub = subsRes.data?.[0] ?? null;
      return { ...p, orderCount: ordersRes.count ?? 0, totalPaid, activeSub };
    })
  );

  return NextResponse.json({ members: enriched });
}
