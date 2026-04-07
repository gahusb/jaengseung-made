'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function FailContent() {
  const params = useSearchParams();
  const message = params.get('message') ?? '결제가 취소되었거나 실패했습니다.';
  const code = params.get('code') ?? '';

  return (
    <div className="text-center py-20 px-6">
      <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center mx-auto mb-5">
        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div className="inline-block bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1 rounded-full mb-4">
        {code === 'USER_CANCEL' || code === 'PAY_PROCESS_CANCELED' ? '결제 취소' : '결제 실패'}
      </div>
      <h2 className="text-xl font-bold text-[#04102b] mb-2">
        {code === 'USER_CANCEL' || code === 'PAY_PROCESS_CANCELED' ? '결제를 취소하셨습니다' : '결제에 실패했습니다'}
      </h2>
      <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto leading-relaxed">{message}</p>
      <div className="flex justify-center gap-3 flex-wrap">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 bg-[#1a56db] hover:bg-[#1e4fc2] text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/20 transition"
        >
          다시 시도하기
        </button>
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

export default function PaymentFailPage() {
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
        <Suspense fallback={<div className="py-20 text-center text-slate-400 text-sm">로딩 중...</div>}>
          <FailContent />
        </Suspense>
      </div>
    </div>
  );
}
