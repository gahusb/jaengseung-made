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

  // 병렬 쿼리
  const [profilesRes, ordersRes, paymentsRes, contactsRes, monthlyRes, subsRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'paid'),
    supabase.from('payments').select('amount').eq('status', 'paid'),
    supabase.from('contact_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('payments').select('amount, created_at').eq('status', 'paid').order('created_at', { ascending: true }),
    supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
  ]);

  const totalMembers = profilesRes.count ?? 0;
  const totalOrders = ordersRes.count ?? 0;
  const totalRevenue = (paymentsRes.data ?? []).reduce((sum: number, p: { amount: number }) => sum + p.amount, 0);
  const pendingContacts = contactsRes.count ?? 0;
  const activeSubscribers = subsRes.count ?? 0;

  // 최근 6개월 월별 수익 집계
  const monthly: Record<string, number> = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthly[key] = 0;
  }

  for (const p of (monthlyRes.data ?? []) as Array<{ amount: number; created_at: string }>) {
    const d = new Date(p.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (key in monthly) {
      monthly[key] += p.amount;
    }
  }

  const monthlyChart = Object.entries(monthly).map(([month, revenue]) => ({ month, revenue }));

  return NextResponse.json({ totalMembers, totalOrders, totalRevenue, pendingContacts, activeSubscribers, monthlyChart });
}
