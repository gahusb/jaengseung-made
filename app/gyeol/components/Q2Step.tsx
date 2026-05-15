'use client';

import { useState } from 'react';
import { AWARENESS_FREQS } from '@/lib/survey/questions';
import type { SurveyResponse } from '@/lib/survey/types';
import QuestionLayout from './QuestionLayout';

interface Props {
  initial: Partial<SurveyResponse>;
  onPrev: () => void;
  onNext: (partial: Partial<SurveyResponse>) => void;
}

export default function Q2Step({ initial, onPrev, onNext }: Props) {
  const [value, setValue] = useState(initial.awareness_freq ?? '');

  return (
    <QuestionLayout
      step="q2"
      onPrev={onPrev}
      onNext={() => onNext({ awareness_freq: value })}
      nextDisabled={!value}
    >
      <div className="space-y-2">
        {AWARENESS_FREQS.map((option) => (
          <label
            key={option}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border cursor-pointer transition ${
              value === option
                ? 'border-violet-400 bg-violet-400/10'
                : 'border-white/15 bg-white/[0.02] hover:border-white/30'
            }`}
          >
            <input
              type="radio"
              name="awareness_freq"
              value={option}
              checked={value === option}
              onChange={() => setValue(option)}
              className="sr-only"
            />
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                value === option ? 'border-violet-400' : 'border-white/30'
              }`}
            >
              {value === option && <span className="w-2 h-2 rounded-full bg-violet-400" />}
            </span>
            <span className="text-sm text-white">{option}</span>
          </label>
        ))}
      </div>
    </QuestionLayout>
  );
}
