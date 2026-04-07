'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const params = useSearchParams();
  const paymentId = params.get('paymentId');

  return (
    <div className="text-center py-20 px-6">
      <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-5">
        <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
        결제 완료
      </div>
      <h2 className="text-2xl font-extrabold text-[#04102b] mb-2">결제가 완료되었습니다!</h2>
      {paymentId && (
        <p className="text-slate-400 text-xs mb-1">주문번호: {paymentId}</p>
      )}
      <p className="text-slate-500 text-sm mb-8">
        마이페이지에서 결제 내역과 서비스 이용 현황을 확인하세요.
      </p>
      <div className="flex justify-center gap-3 flex-wrap">
        <Link
          href="/mypage?tab=payments"
          className="inline-flex items-center gap-2 bg-[#1a56db] hover:bg-[#1e4fc2] text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/20 transition"
        >
          결제 내역 확인 →
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white border border-[#dbe8ff] text-slate-600 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-slate-50 transition"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-full bg-[#f0f5ff] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#dbe8ff] shadow-lg overflow-hidden">
        <div className="bg-[#04102b] px-6 py-4" style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 40px)' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1a56db] flex items-center justify-center text-white font-bold text-xs">
              쟁
            </div>
            <span className="text-white font-bold text-sm">쟁승메이드 결제</span>
          </div>
        </div>
        <Suspense fallback={
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
