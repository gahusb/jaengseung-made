'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { PRODUCTS } from '@/lib/products';

interface PaymentButtonProps {
  productId: string;
  className?: string;
  children: React.ReactNode;
  returnUrl?: string;
}

export default function PaymentButton({ productId, className, children, returnUrl }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const product = PRODUCTS[productId];

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. 로그인 확인
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?next=' + encodeURIComponent(window.location.pathname));
        return;
      }

      // 2. 프로필 없으면 생성 (Google OAuth 등으로 트리거 미실행된 경우 대비)
      await supabase.from('profiles').upsert({ id: user.id, email: user.email }, { onConflict: 'id' });

      // 3. Supabase에 order 생성
      const orderId = crypto.randomUUID();
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          user_id: user.id,
          product_id: productId,
          amount: product.price,
          status: 'pending',
          metadata: { product_name: product.name },
        });

      if (orderError) throw new Error('주문 생성 실패: ' + orderError.message);

      // 4. 토스페이먼츠 결제창 호출
      // dev: NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_* → 테스트 결제 (실제 청구 없음)
      // prod: NEXT_PUBLIC_TOSS_CLIENT_KEY=live_ck_* → 실결제 (Vercel 환경변수에 설정)
      const { loadTossPayments } = await import('@tosspayments/tosspayments-sdk');
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;
      const tossPayments = await loadTossPayments(clientKey);

      const payment = tossPayments.payment({
        customerKey: user.id,
      });

      await payment.requestPayment({
        method: 'CARD',
        amount: {
          currency: 'KRW',
          value: product.price,
        },
        orderId,
        orderName: product.name,
        successUrl: `${window.location.origin}/payment/success${returnUrl ? '?returnUrl=' + encodeURIComponent(returnUrl) : ''}`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: user.email,
      });
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      // 사용자가 결제창 닫은 경우는 무시
      if (error?.code !== 'USER_CANCEL') {
        alert('결제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  const isTestMode = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY?.startsWith('test_');

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <button
        onClick={handlePayment}
        disabled={loading}
        className={className}
      >
        {loading ? '결제 처리 중...' : children}
      </button>
      {/* dev/test 환경에서만 표시되는 배지 — 실수로 실결제 누르는 것 방지 */}
      {isTestMode && (
        <span style={{
          position: 'absolute', top: -8, right: -8,
          background: '#f59e0b', color: '#fff',
          fontSize: 9, fontWeight: 800, letterSpacing: '0.05em',
          padding: '2px 6px', borderRadius: 4,
          pointerEvents: 'none', userSelect: 'none',
        }}>
          TEST
        </span>
      )}
    </div>
  );
}
