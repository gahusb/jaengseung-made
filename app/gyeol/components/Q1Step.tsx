'use client';

import { useState } from 'react';
import { AGE_RANGES, STATUSES } from '@/lib/survey/questions';
import type { SurveyResponse } from '@/lib/survey/types';
import QuestionLayout from './QuestionLayout';

interface Props {
  initial: Partial<SurveyResponse>;
  onPrev: () => void;
  onNext: (partial: Partial<SurveyResponse>) => void;
}

export default function Q1Step({ initial, onPrev, onNext }: Props) {
  const [age, setAge] = useState(initial.age_range ?? '');
  const [status, setStatus] = useState(initial.status ?? '');

  const valid = age && status;

  return (
    <QuestionLayout
      step="q1"
      onPrev={onPrev}
      onNext={() => onNext({ age_range: age, status })}
      nextDisabled={!valid}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-white/60 mb-2 font-mono tracking-widest uppercase">
            나이대
          </label>
          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 text-white focus:border-white/40 focus:outline-none"
          >
            <option value="" disabled>선택해주세요</option>
            {AGE_RANGES.map((a) => (
              <option key={a} value={a} className="bg-black">{a}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-white/60 mb-2 font-mono tracking-widest uppercase">
            지금 상황
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 text-white focus:border-white/40 focus:outline-none"
          >
            <option value="" disabled>선택해주세요</option>
            {STATUSES.map((s) => (
              <option key={s} value={s} className="bg-black">{s}</option>
            ))}
          </select>
        </div>
      </div>
    </QuestionLayout>
  );
}
