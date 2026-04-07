'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { PRODUCTS } from '@/lib/products';
import { getActiveChannels, type PaymentChannel } from '@/lib/payment-channels';
import PortOne from '@portone/browser-sdk/v2';

interface PaymentButtonProps {
  productId: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  returnUrl?: string;
}

export default function PaymentButton({ productId, className, style, children, returnUrl }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showMethodPicker, setShowMethodPicker] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const product = PRODUCTS[productId];
  const channels = getActiveChannels();

  const processPayment = async (channel: PaymentChannel) => {
    setShowMethodPicker(false);
    setLoading(true);
    try {
      // 1. 로그인 확인
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?next=' + encodeURIComponent(window.location.pathname));
        return;
      }

      // 2. 프로필 없으면 생성
      await supabase.from('profiles').upsert({ id: user.id, email: user.email }, { onConflict: 'id' });

      // 3. Supabase에 order 생성
      const paymentId = crypto.randomUUID();
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: paymentId,
          user_id: user.id,
          product_id: productId,
          amount: product.price,
          status: 'pending',
          metadata: { product_name: product.name, pay_channel: channel.id },
        });

      if (orderError) throw new Error('주문 생성 실패: ' + orderError.message);

      // 4. 포트원 V2 결제 요청
      const response = await PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID ?? '',
        channelKey: channel.channelKey,
        paymentId,
        orderName: product.name,
        totalAmount: product.price,
        currency: 'CURRENCY_KRW',
        payMethod: channel.payMethod,
        customer: {
          email: user.email ?? undefined,
        },
      });

      // 5. 결제 결과 처리
      if (!response || response.code != null) {
        if (response?.code === 'FAILURE_TYPE_PG' || response?.message?.includes('cancel')) {
          return;
        }
        throw new Error(response?.message ?? '결제 요청 실패');
      }

      // 6. 서버에서 결제 검증
      const confirmRes = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId }),
      });

      const confirmData = await confirmRes.json();

      if (!confirmRes.ok || !confirmData.success) {
        throw new Error(confirmData.error || '결제 검증에 실패했습니다.');
      }

      // 7. 결제 성공
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        router.push(`/payment/success?paymentId=${paymentId}`);
      }
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error?.code === 'USER_CANCEL' || error?.message?.includes('cancel')) {
        return;
      }
      alert('결제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (channels.length === 0) {
      alert('결제 서비스가 준비 중입니다.');
      return;
    }
    // 채널이 1개면 바로 결제, 여러 개면 선택 UI
    if (channels.length === 1) {
      processPayment(channels[0]);
    } else {
      setShowMethodPicker(true);
    }
  };

  if (!product) return null;

  const isTestMode = !process.env.NEXT_PUBLIC_PORTONE_STORE_ID
    || process.env.NODE_ENV === 'development';

  return (
    <>
      <div style={{ display: style ? 'block' : 'inline-block', position: 'relative' }}>
        <button
          onClick={handleClick}
          disabled={loading}
          className={className}
          style={style}
        >
          {loading ? '결제 처리 중...' : children}
        </button>
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

      {/* 결제수단 선택 모달 */}
      {showMethodPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowMethodPicker(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#04102b] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#1a56db] flex items-center justify-center text-white font-bold text-[10px]">
                  쟁
                </div>
                <span className="text-white font-bold text-sm">결제수단 선택</span>
              </div>
              <button
                onClick={() => setShowMethodPicker(false)}
                className="text-white/60 hover:text-white transition text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <p className="text-slate-500 text-xs mb-3">
                {product.name} · {product.price.toLocaleString()}원
              </p>
              <div className="space-y-2">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => processPayment(channel)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-slate-200 hover:border-[#1a56db] hover:bg-blue-50/50 transition text-left group"
                  >
                    <span className="text-xl">{channel.icon}</span>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-[#1a56db]">
                      {channel.label}
                    </span>
                    <svg className="w-4 h-4 text-slate-300 group-hover:text-[#1a56db] ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
