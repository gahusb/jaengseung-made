'use client';

import { useState, useEffect, useRef } from 'react';
import PaymentButton from '@/app/components/PaymentButton';

interface BirthKey {
  birth_year: number;
  birth_month: number;
  birth_day: number;
  birth_hour?: number;
  gender: string;
}

interface SajuAISectionProps {
  hasPaid: boolean;
  savedInterpretation: string | null;
  sajuData: object;
  daeun: object | null;
  daeunList: object[];
  gender: string;
  birthKey: BirthKey;
  currentUrl: string;
}

export default function SajuAISection({
  hasPaid,
  savedInterpretation,
  sajuData,
  daeun,
  daeunList,
  gender,
  birthKey,
  currentUrl,
}: SajuAISectionProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>(
    savedInterpretation ? 'done' : 'idle'
  );
  const [interpretation, setInterpretation] = useState(savedInterpretation ?? '');
  const called = useRef(false);

  useEffect(() => {
    if (!hasPaid || savedInterpretation || called.current) return;
    called.current = true;
    setStatus('loading');

    fetch('/api/saju/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ saju: sajuData, daeun, daeunList, gender }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.interpretation) {
          setInterpretation(data.interpretation);
          setStatus('done');
          // birthKey 유효성 검사 후 저장 (NaN/null 방지)
          const { birth_year, birth_month, birth_day } = birthKey;
          if (
            typeof birth_year === 'number' && !isNaN(birth_year) &&
            typeof birth_month === 'number' && !isNaN(birth_month) &&
            typeof birth_day === 'number' && !isNaN(birth_day)
          ) {
            fetch('/api/saju/save-interpretation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ interpretation: data.interpretation, birthKey }),
            }).catch(() => {});
          }
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [hasPaid]);

  // 미결제 상태
  if (!hasPaid) {
    return (
      <div className="bg-gradient-to-br from-[#04102b] via-[#0a1f5c] to-[#04102b] rounded-2xl border border-[#1a3a7a] p-7 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            AI PREMIUM
          </div>
          <h3 className="text-xl font-extrabold text-white mb-2">AI 상세 해석 (12개 항목)</h3>
          <p className="text-blue-200/60 text-sm mb-5">
            성격, 재물운, 직업 적성, 애정운, 건강운, 대운 분석 등<br />
            GPT-4o가 생성하는 맞춤형 사주 해석을 받아보세요.
          </p>
          <PaymentButton
            productId="saju_detail"
            returnUrl={currentUrl}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#04102b] font-bold px-7 py-3 rounded-xl transition-all shadow-lg"
          >
            AI 해석 구매하기 · ₩4,900
          </PaymentButton>
        </div>
      </div>
    );
  }

  // AI 생성 중
  if (status === 'loading') {
    return (
      <div className="bg-white rounded-2xl border border-[#dbe8ff] p-8 text-center">
        <div className="w-10 h-10 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm font-medium">AI가 사주를 분석하는 중입니다...</p>
        <p className="text-slate-400 text-xs mt-1">약 20~30초 소요될 수 있습니다</p>
      </div>
    );
  }

  // 오류
  if (status === 'error') {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-6 text-center">
        <p className="text-red-500 text-sm font-medium mb-3">AI 해석 생성에 실패했습니다.</p>
        <button
          onClick={() => { called.current = false; setStatus('idle'); }}
          className="text-xs text-blue-600 underline"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  // AI 해석 완료
  return (
    <div className="bg-white rounded-2xl border border-[#dbe8ff] p-6">
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-lg font-extrabold text-[#04102b]">AI 상세 해석</h2>
        <span className="ml-auto text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
          결제 완료
        </span>
      </div>
      <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
        {interpretation}
      </div>
    </div>
  );
}
