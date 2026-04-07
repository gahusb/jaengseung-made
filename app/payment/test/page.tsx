'use client';

import PaymentButton from '@/app/components/PaymentButton';
import { PRODUCTS } from '@/lib/products';

// DB products 테이블에 등록된 상품만 테스트 가능
const TEST_PRODUCTS = [
  'saju_detail',     // 4,900원
  'lotto_gold',      // 900원/월
  'lotto_platinum',  // 2,900원/월
  'lotto_diamond',   // 9,900원/월
];

export default function PaymentTestPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#04102b] mb-2">결제 테스트</h1>
        <p className="text-slate-500 text-sm">
          포트원 V2 테스트 모드 — 실제 청구되지 않습니다.
        </p>
        <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-4 py-2.5 rounded-xl">
          이 페이지는 관리자 테스트 전용입니다. 배포 전 삭제하세요.
        </div>
      </div>

      <div className="space-y-4">
        {TEST_PRODUCTS.map((id) => {
          const product = PRODUCTS[id];
          if (!product) return null;
          return (
            <div
              key={id}
              className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4"
            >
              <div>
                <p className="font-semibold text-sm text-slate-800">{product.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {product.price.toLocaleString()}원
                  {product.type === 'monthly' && ' / 월'}
                  <span className="ml-2 text-slate-300">({id})</span>
                </p>
              </div>
              <PaymentButton
                productId={id}
                className="bg-[#1a56db] hover:bg-[#1e4fc2] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-lg shadow-blue-600/20"
              >
                결제 테스트
              </PaymentButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
