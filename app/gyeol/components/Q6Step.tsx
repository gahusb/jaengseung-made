'use client';

import { useState } from 'react';
import type { SurveyResponse } from '@/lib/survey/types';
import QuestionLayout from './QuestionLayout';

interface Props {
  initial: Partial<SurveyResponse>;
  onPrev: () => void;
  onNext: (partial: Partial<SurveyResponse>) => void;
}

export default function Q6Step({ initial, onPrev, onNext }: Props) {
  const [text, setText] = useState(initial.free_opinion ?? '');

  // 빈 칸 허용 (skippable)
  return (
    <QuestionLayout
      step="q6"
      onPrev={onPrev}
      onNext={() => onNext({ free_opinion: text.trim() || undefined })}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="자유롭게 적어주세요. (선택)"
        maxLength={1000}
        rows={6}
        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none resize-none"
      />
      <p className="mt-2 text-xs text-white/40 text-right font-mono">{text.length}/1000</p>
    </QuestionLayout>
  );
}
