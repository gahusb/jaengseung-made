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
    const { paymentId } = body;

    // ── 기본 파라미터 검증 ────────────────────────────────────
    if (!paymentId || typeof paymentId !== 'string' || paymentId.length > 200) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 });
    }

    // ── 로그인 사용자 확인 ────────────────────────────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    // ── DB에서 주문 확인 ──────────────────────────────────────
    const { data: order, error: orderFetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (orderFetchError || !order) {
      return NextResponse.json({ error: '주문을 찾을 수 없습니다' }, { status: 404 });
    }
    if (order.user_id !== user.id) {
      return NextResponse.json({ error: '접근 권한이 없습니다' }, { status: 403 });
    }
    if (order.status === 'paid') {
      return NextResponse.json({ error: '이미 처리된 주문입니다' }, { status: 400 });
    }

    // ── 포트원 V2 결제 조회 API ───────────────────────────────
    const apiSecret = process.env.PORTONE_API_SECRET;
    if (!apiSecret) {
      console.error('[Payment] PORTONE_API_SECRET 미설정');
      return NextResponse.json({ error: '결제 서비스 설정 오류' }, { status: 500 });
    }

    const portoneRes = await fetch(
      `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `PortOne ${apiSecret}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!portoneRes.ok) {
      const err = await portoneRes.json().catch(() => ({}));
      console.error(`[Payment] 포트원 조회 실패 paymentId=${paymentId} status=${portoneRes.status}`, err);
      return NextResponse.json(
        { error: '결제 확인에 실패했습니다. 고객센터에 문의해주세요.' },
        { status: 400 }
      );
    }

    const paymentData = await portoneRes.json();

    // ── 결제 상태 & 금액 검증 ─────────────────────────────────
    if (paymentData.status !== 'PAID') {
      console.warn(`[Payment] 미완료 결제 paymentId=${paymentId} status=${paymentData.status}`);
      return NextResponse.json(
        { error: '결제가 완료되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 서버 DB 금액과 포트원 결제 금액 비교 (위조 방어)
    const paidAmount = paymentData.amount?.total;
    if (paidAmount !== order.amount) {
      console.warn(`[Payment] 금액 불일치 paymentId=${paymentId} db=${order.amount} paid=${paidAmount} user=${user.id}`);
      return NextResponse.json({ error: '결제 금액이 올바르지 않습니다' }, { status: 400 });
    }

    // ── orders 상태 업데이트 ──────────────────────────────────
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', paymentId);

    if (updateError) {
      console.error('[Payment] Order update error:', updateError.message);
      return NextResponse.json({ error: '주문 상태 업데이트 실패' }, { status: 500 });
    }

    // ── payments 레코드 생성 ──────────────────────────────────
    const pgPaymentId = paymentData.pgResponse?.pgTxId ?? paymentData.paymentId ?? paymentId;
    const { error: paymentError } = await supabase.from('payments').insert({
      user_id:        order.user_id,
      order_id:       paymentId,
      product_name:   order.metadata?.product_name ?? order.product_id,
      amount:         order.amount,
      status:         'paid',
      pg_provider:    'portone_kcp',
      pg_payment_key: pgPaymentId,
    });

    if (paymentError) {
      console.error('[Payment] Payment insert error:', paymentError.message);
      return NextResponse.json({ error: '결제 내역 저장 실패' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        paymentId,
        orderName: paymentData.orderName,
        amount: paidAmount,
        status: paymentData.status,
      },
    });
  } catch (error: unknown) {
    console.error('[Payment] Unexpected error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 });
  }
}
