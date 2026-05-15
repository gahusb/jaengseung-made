'use client';

import { useState } from 'react';
import { BEST_TOOLS, SATISFY_SCALE } from '@/lib/survey/questions';
import type { SurveyResponse } from '@/lib/survey/types';
import QuestionLayout from './QuestionLayout';

interface Props {
  initial: Partial<SurveyResponse>;
  onPrev: () => void;
  onNext: (partial: Partial<SurveyResponse>) => void;
}

export default function Q5Step({ initial, onPrev, onNext }: Props) {
  const [tool, setTool] = useState(initial.best_tool ?? '');
  const [satisfy, setSatisfy] = useState<number | null>(initial.best_satisfy ?? null);

  const valid = tool && satisfy !== null;

  return (
    <QuestionLayout
      step="q5"
      onPrev={onPrev}
      onNext={() => onNext({ best_tool: tool, best_satisfy: satisfy ?? undefined })}
      nextDisabled={!valid}
    >
      <div className="space-y-6">
        <div>
          <p className="text-xs text-white/60 mb-2 font-mono tracking-widest uppercase">가장 도움 됐던 거</p>
          <div className="space-y-2">
            {BEST_TOOLS.map((option) => (
              <label
                key={option}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition ${
                  tool === option
                    ? 'border-violet-400 bg-violet-400/10'
                    : 'border-white/15 bg-white/[0.02] hover:border-white/30'
                }`}
              >
                <input
                  type="radio"
                  name="best_tool"
                  value={option}
                  checked={tool === option}
                  onChange={() => setTool(option)}
                  className="sr-only"
                />
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    tool === option ? 'border-violet-400' : 'border-white/30'
                  }`}
                >
                  {tool === option && <span className="w-2 h-2 rounded-full bg-violet-400" />}
                </span>
                <span className="text-sm text-white">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-white/60 mb-2 font-mono tracking-widest uppercase">만족도 (5점 만점)</p>
          <div className="flex gap-2">
            {SATISFY_SCALE.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setSatisfy(n)}
                className={`flex-1 py-3 rounded-xl border text-sm font-bold transition ${
                  satisfy === n
                    ? 'border-violet-400 bg-violet-400/10 text-white'
                    : 'border-white/15 bg-white/[0.02] text-white/60 hover:border-white/30'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </QuestionLayout>
  );
}
