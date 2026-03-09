import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 });
    }

    // 1. Supabase에서 order 확인
    const supabase = await createClient();
    const { data: order, error: orderFetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderFetchError || !order) {
      return NextResponse.json({ error: '주문을 찾을 수 없습니다' }, { status: 404 });
    }
    if (order.amount !== amount) {
      return NextResponse.json({ error: '결제 금액 불일치' }, { status: 400 });
    }
    if (order.status === 'paid') {
      return NextResponse.json({ error: '이미 처리된 주문입니다' }, { status: 400 });
    }

    // 2. 토스페이먼츠 서버 승인
    const secretKey = process.env.TOSS_SECRET_KEY!;
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
      const err = await tossRes.json();
      return NextResponse.json({ error: err.message || '토스 승인 실패' }, { status: 400 });
    }

    const tossData = await tossRes.json();

    // 3. orders 상태 paid로 업데이트
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', orderId);

    if (updateError) {
      console.error('Order update error:', updateError);
      return NextResponse.json({ error: '주문 상태 업데이트 실패: ' + updateError.message }, { status: 500 });
    }

    // 4. payments 레코드 생성
    const { error: paymentError } = await supabase.from('payments').insert({
      user_id: order.user_id,
      order_id: orderId,
      product_name: order.metadata?.product_name ?? order.product_id,
      amount: order.amount,
      status: 'paid',
      pg_provider: 'toss',
      pg_payment_key: paymentKey,
    });

    if (paymentError) {
      console.error('Payment insert error:', paymentError);
      return NextResponse.json({ error: '결제 내역 저장 실패: ' + paymentError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: tossData });
  } catch (error: unknown) {
    console.error('Payment confirm error:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
