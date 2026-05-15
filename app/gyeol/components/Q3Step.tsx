'use client';

import { useState } from 'react';
import { TOOLS_OPTIONS } from '@/lib/survey/questions';
import type { SurveyResponse } from '@/lib/survey/types';
import QuestionLayout from './QuestionLayout';

interface Props {
  initial: Partial<SurveyResponse>;
  onPrev: () => void;
  onNext: (partial: Partial<SurveyResponse>) => void;
}

export default function Q3Step({ initial, onPrev, onNext }: Props) {
  const [selected, setSelected] = useState<string[]>(initial.tools_used ?? []);
  const [other, setOther] = useState(initial.tools_other ?? '');

  function toggle(option: string) {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((x) => x !== option) : [...prev, option]
    );
  }

  // validation: 최소 1개 체크 또는 기타 입력 있음
  const valid = selected.length > 0 || other.trim().length > 0;

  return (
    <QuestionLayout
      step="q3"
      onPrev={onPrev}
      onNext={() =>
        onNext({
          tools_used: selected,
          tools_other: other.trim() || undefined,
        })
      }
      nextDisabled={!valid}
    >
      <div className="space-y-2">
        {TOOLS_OPTIONS.map((option) => {
          const checked = selected.includes(option);
          return (
            <label
              key={option}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition ${
                checked
                  ? 'border-violet-400 bg-violet-400/10'
                  : 'border-white/15 bg-white/[0.02] hover:border-white/30'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(option)}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  checked ? 'border-violet-400 bg-violet-400' : 'border-white/30'
                }`}
              >
                {checked && (
                  <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className="text-sm text-white">{option}</span>
            </label>
          );
        })}

        <div className="pt-2">
          <label className="block text-xs text-white/60 mb-2 font-mono tracking-widest uppercase">
            기타 (직접 입력)
          </label>
          <input
            type="text"
            value={other}
            onChange={(e) => setOther(e.target.value)}
            placeholder="예: 명상, 운동"
            maxLength={100}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
          />
        </div>
      </div>
    </QuestionLayout>
  );
}
