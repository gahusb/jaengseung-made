import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient as createSSRClient } from '@supabase/ssr';
import { createAdminClient } from '@/lib/supabase/admin';
import { getProductById } from '@/lib/supabase/product-files';
import { sanitizeStr, checkRateLimit } from '@/lib/security';
import { sendOrderReceivedEmails } from '@/lib/order-emails';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  // 1) 인증 확인 (SSR 쿠키 클라이언트)
  const cookieStore = await cookies();
  const supabase = createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
  }

  // 1-b) Rate Limit: user 기준 분당 5회
  const rl = checkRateLimit(`orders:${user.id}`, 60_000, 5);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: '요청이 너무 잦습니다. 잠시 후 다시 시도해주세요' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) },
      },
    );
  }

  // 2) body 검증
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
  }

  const rawProductId = (body as Record<string, unknown>).productId;
  const rawDepositorName = (body as Record<string, unknown>).depositorName;

  const productId = sanitizeStr(rawProductId, 64);
  const depositorName = sanitizeStr(rawDepositorName, 40);

  if (!productId || !depositorName) {
    return NextResponse.json({ error: 'productId와 depositorName이 필요합니다' }, { status: 400 });
  }

  // 3) 상품 조회 및 활성 상태 확인
  const admin = createAdminClient();
  let product;
  try {
    product = await getProductById(admin, productId);
  } catch (dbErr) {
    console.error('[Orders] product lookup error:', dbErr);
    return NextResponse.json({ error: '상품 조회에 실패했습니다' }, { status: 500 });
  }

  if (!product || !product.is_active) {
    return NextResponse.json({ error: '판매 중인 상품이 아닙니다' }, { status: 404 });
  }

  // 4) 중복 pending 방지
  const { data: existing } = await admin
    .from('orders')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .eq('status', 'pending')
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ orderId: existing.id, reused: true });
  }

  // 5) 주문 생성 (가격은 DB 소스)
  const { data: order, error: insertError } = await admin
    .from('orders')
    .insert({
      user_id: user.id,
      product_id: productId,
      amount: product.price,
      status: 'pending',
      metadata: {
        method: 'bank_transfer',
        depositor_name: depositorName,
      },
    })
    .select('id')
    .single();

  if (insertError || !order) {
    console.error('[Orders] insert error:', insertError);
    return NextResponse.json({ error: '주문 생성에 실패했습니다' }, { status: 500 });
  }

  const orderId = order.id as string;

  // 6) 메일 발송 (실패해도 주문 유효)
  try {
    await sendOrderReceivedEmails({
      orderId,
      product,
      customerEmail: user.email ?? '',
      depositorName,
    });
  } catch (mailError) {
    console.error('[Orders] email send error:', mailError);
  }

  // 7) 응답
  return NextResponse.json({ orderId });
}
