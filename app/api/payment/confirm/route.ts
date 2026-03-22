import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIp } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    // ── Rate Limit: IP당 1분 10회 (결제 재시도 남용 방지) ─────
    const ip = getClientIp(request);
    const rl = checkRateLimit(`payment:${ip}`, 60_000, 10);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    // ── 기본 파라미터 검증 ────────────────────────────────────
    if (!paymentKey || !orderId || amount === undefined) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 });
    }
    // 타입 강제 검증
    if (
      typeof paymentKey !== 'string' || paymentKey.length > 200 ||
      typeof orderId    !== 'string' || orderId.length    > 200 ||
      typeof amount     !== 'number' || amount <= 0 || !Number.isInteger(amount)
    ) {
      return NextResponse.json({ error: '잘못된 파라미터 형식' }, { status: 400 });
    }

    // ── 로그인 사용자 확인 ────────────────────────────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    // ── DB에서 주문 확인 (금액 서버사이드 검증) ───────────────
    const { data: order, error: orderFetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderFetchError || !order) {
      return NextResponse.json({ error: '주문을 찾을 수 없습니다' }, { status: 404 });
    }
    // 주문 소유자 검증 (다른 사용자 주문 처리 방지)
    if (order.user_id !== user.id) {
      return NextResponse.json({ error: '접근 권한이 없습니다' }, { status: 403 });
    }
    // 서버 DB 금액과 비교 (클라이언트 금액 위조 방어)
    if (order.amount !== amount) {
      console.warn(`[Payment] 금액 불일치 orderId=${orderId} db=${order.amount} req=${amount} user=${user.id}`);
      return NextResponse.json({ error: '결제 금액이 올바르지 않습니다' }, { status: 400 });
    }
    if (order.status === 'paid') {
      return NextResponse.json({ error: '이미 처리된 주문입니다' }, { status: 400 });
    }

    // ── 토스페이먼츠 서버 승인 ────────────────────────────────
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      console.error('[Payment] TOSS_SECRET_KEY 미설정');
      return NextResponse.json({ error: '결제 서비스 설정 오류' }, { status: 500 });
    }
    if (!secretKey.startsWith('test_') && process.env.NODE_ENV === 'development') {
      console.warn('[Payment] WARNING: live Toss key detected in development!');
    }

    const encoded = Buffer.from(`${secretKey}:`).toString('base64');
    const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encoded}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    if (!tossRes.ok) {
      const err = await tossRes.json().catch(() => ({}));
      // 내부 에러 코드는 서버 로그에만 기록
      console.error(`[Payment] Toss 승인 실패 orderId=${orderId} code=${err.code} msg=${err.message}`);
      return NextResponse.json(
        { error: '결제 승인에 실패했습니다. 카드사 또는 고객센터에 문의해주세요.' },
        { status: 400 }
      );
    }

    const tossData = await tossRes.json();

    // ── orders 상태 업데이트 ──────────────────────────────────
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', orderId);

    if (updateError) {
      console.error('[Payment] Order update error:', updateError.message);
      return NextResponse.json({ error: '주문 상태 업데이트 실패' }, { status: 500 });
    }

    // ── payments 레코드 생성 ──────────────────────────────────
    const { error: paymentError } = await supabase.from('payments').insert({
      user_id:        order.user_id,
      order_id:       orderId,
      product_name:   order.metadata?.product_name ?? order.product_id,
      amount:         order.amount,
      status:         'paid',
      pg_provider:    'toss',
      pg_payment_key: paymentKey,
    });

    if (paymentError) {
      console.error('[Payment] Payment insert error:', paymentError.message);
      return NextResponse.json({ error: '결제 내역 저장 실패' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: tossData });
  } catch (error: unknown) {
    console.error('[Payment] Unexpected error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 });
  }
}
