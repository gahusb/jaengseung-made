'use client';

import { useState } from 'react';
import type { SurveyResponse } from '@/lib/survey/types';
import QuestionLayout from './QuestionLayout';

interface Props {
  initial: Partial<SurveyResponse>;
  onPrev: () => void;
  onSubmit: (partial: Partial<SurveyResponse>) => void;
  submitting: boolean;
}

export default function Q7Step({ initial, onPrev, onSubmit, submitting }: Props) {
  const [wantEmail, setWantEmail] = useState<'yes' | 'no' | ''>(
    initial.email ? 'yes' : ''
  );
  const [email, setEmail] = useState(initial.email ?? '');

  // 'no' 선택 시 즉시 전송 가능. 'yes' 선택 시 이메일 유효성 필요.
  const emailValid = /\S+@\S+\.\S+/.test(email);
  const canSubmit =
    wantEmail === 'no' || (wantEmail === 'yes' && emailValid);

  function handleSubmit() {
    onSubmit({
      email: wantEmail === 'yes' && emailValid ? email.trim() : undefined,
    });
  }

  return (
    <QuestionLayout
      step="q7"
      onPrev={onPrev}
      onNext={handleSubmit}
      nextDisabled={!canSubmit}
      nextLabel="전송"
      submitting={submitting}
    >
      <div className="space-y-3">
        <label
          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border cursor-pointer transition ${
            wantEmail === 'yes'
              ? 'border-violet-400 bg-violet-400/10'
              : 'border-white/15 bg-white/[0.02] hover:border-white/30'
          }`}
        >
          <input
            type="radio"
            name="want_email"
            checked={wantEmail === 'yes'}
            onChange={() => setWantEmail('yes')}
            className="sr-only"
          />
          <span
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              wantEmail === 'yes' ? 'border-violet-400' : 'border-white/30'
            }`}
          >
            {wantEmail === 'yes' && <span className="w-2 h-2 rounded-full bg-violet-400" />}
          </span>
          <span className="text-sm text-white">네, 알려주세요</span>
        </label>

        {wantEmail === 'yes' && (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            maxLength={200}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
          />
        )}

        <label
          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border cursor-pointer transition ${
            wantEmail === 'no'
              ? 'border-violet-400 bg-violet-400/10'
              : 'border-white/15 bg-white/[0.02] hover:border-white/30'
          }`}
        >
          <input
            type="radio"
            name="want_email"
            checked={wantEmail === 'no'}
            onChange={() => {
              setWantEmail('no');
              setEmail('');
            }}
            className="sr-only"
          />
          <span
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              wantEmail === 'no' ? 'border-violet-400' : 'border-white/30'
            }`}
          >
            {wantEmail === 'no' && <span className="w-2 h-2 rounded-full bg-violet-400" />}
          </span>
          <span className="text-sm text-white">됐어요</span>
        </label>
      </div>
    </QuestionLayout>
  );
}
