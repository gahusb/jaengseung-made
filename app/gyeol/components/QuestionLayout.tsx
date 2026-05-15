'use client';

import type { ReactNode } from 'react';
import ProgressBar from './ProgressBar';
import type { SurveyStep } from '@/lib/survey/types';
import { QUESTION_HEADERS } from '@/lib/survey/questions';

interface Props {
  step: SurveyStep;
  children: ReactNode;       // 본문 (옵션 입력 컴포넌트)
  onPrev?: () => void;       // 이전 (없으면 미렌더)
  onNext: () => void;        // 다음
  nextLabel?: string;        // 기본 '다음'
  nextDisabled?: boolean;
  submitting?: boolean;      // Q7 전송 중 표시
}

export default function QuestionLayout({
  step,
  children,
  onPrev,
  onNext,
  nextLabel = '다음',
  nextDisabled = false,
  submitting = false,
}: Props) {
  const header = QUESTION_HEADERS[step];

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 text-white">
      <ProgressBar step={step} />

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {/* 질문 헤더 */}
        <div className="text-center mb-10 w-full">
          <h2
            className="kx-display text-2xl md:text-3xl font-bold mb-3 leading-snug"
            style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
          >
            {header?.title}
          </h2>
          {header?.subtitle && (
            <p className="text-sm md:text-base text-white/60">{header.subtitle}</p>
          )}
        </div>

        {/* 본문 */}
        <div className="w-full mb-12">{children}</div>

        {/* 네비게이션 */}
        <div className="w-full flex gap-3">
          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              disabled={submitting}
              className="flex-1 py-3 rounded-full text-sm font-medium border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition disabled:opacity-50"
            >
              ← 이전
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled || submitting}
            className="kx-btn-primary flex-[2] py-3 rounded-full text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '전송 중...' : nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
