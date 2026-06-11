import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminTokenNode } from '@/lib/admin-auth';
import { getProductById } from '@/lib/supabase/product-files';
import { sendOrderPaidEmail } from '@/lib/order-emails';

export const runtime = 'nodejs';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token && verifyAdminTokenNode(token);
}

// GET: 주문 목록 (최근 200건) — 상품명 + 주문자 이메일 포함
export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createAdminClient();

  // 2-쿼리 방식: FK 관계 중첩 select 대신 명시적 조인으로 안전하게
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, user_id, product_id, amount, status, metadata, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (!orders || orders.length === 0) {
    return NextResponse.json({ orders: [] });
  }

  // 상품명 조회
  const productIds = [...new Set(orders.map((o) => o.product_id).filter(Boolean))] as string[];
  const userIds = [...new Set(orders.map((o) => o.user_id).filter(Boolean))] as string[];

  const [productsRes, profilesRes] = await Promise.all([
    productIds.length > 0
      ? supabase.from('products').select('id, name').in('id', productIds)
      : Promise.resolve({ data: [] as { id: string; name: string }[] | null, error: null }),
    userIds.length > 0
      ? supabase.from('profiles').select('id, email').in('id', userIds)
      : Promise.resolve({ data: [] as { id: string; email: string }[] | null, error: null }),
  ]);

  const productMap = Object.fromEntries((productsRes.data ?? []).map((p) => [p.id, p.name]));
  const profileMap = Object.fromEntries((profilesRes.data ?? []).map((p) => [p.id, p.email]));

  const enriched = orders.map((o) => ({
    ...o,
    product_name: o.product_id ? (productMap[o.product_id] ?? null) : null,
    customer_email: o.user_id ? (profileMap[o.user_id] ?? null) : null,
  }));

  return NextResponse.json({ orders: enriched });
}

// PATCH: 상태 변경 ('paid' 전환 시 고객에게 다운로드 활성화 메일)
export async function PATCH(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status } = await request.json();
  if (typeof id !== 'string' || !['pending', 'paid', 'cancelled'].includes(status)) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, product_id, user_id')
    .single();

  if (error || !order) return NextResponse.json({ error: error?.message ?? 'not found' }, { status: 500 });

  // paid 전환 시에만 메일 발송 — 실패해도 상태 변경은 이미 완료
  if (status === 'paid' && order.product_id && order.user_id) {
    try {
      const product = await getProductById(supabase, order.product_id);
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', order.user_id)
        .maybeSingle();
      if (product && profile?.email) {
        await sendOrderPaidEmail({ product, customerEmail: profile.email });
      }
    } catch (e) {
      console.error('paid email failed', e);
    }
  }

  return NextResponse.json({ success: true });
}
