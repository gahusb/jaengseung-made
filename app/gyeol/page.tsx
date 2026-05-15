'use client';

import { useEffect, useRef, useState } from 'react';
import IntroStep from './components/IntroStep';
import Q1Step from './components/Q1Step';
import Q2Step from './components/Q2Step';
import Q3Step from './components/Q3Step';
import Q4Step from './components/Q4Step';
import Q5Step from './components/Q5Step';
import Q6Step from './components/Q6Step';
import Q7Step from './components/Q7Step';
import ThanksStep from './components/ThanksStep';
import type { SurveyResponse, SurveyStep } from '@/lib/survey/types';
import { loadProgress, saveProgress, clearProgress } from '@/lib/survey/storage';

export default function GyeolPage() {
  const [step, setStep] = useState<SurveyStep>('intro');
  const [response, setResponse] = useState<Partial<SurveyResponse>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const startedAtRef = useRef<number | null>(null);

  // 진입 시 localStorage 복구
  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      setStep(saved.step);
      setResponse(saved.response);
      startedAtRef.current = saved.startedAt;
    }
  }, []);

  // step 변경 시 진행 상태 저장 (질문 step만)
  useEffect(() => {
    if (step !== 'intro' && step !== 'thanks' && startedAtRef.current) {
      saveProgress({
        step,
        response,
        startedAt: startedAtRef.current,
      });
    }
  }, [step, response]);

  function handleStart() {
    if (!startedAtRef.current) {
      startedAtRef.current = Date.now();
    }
    setStep('q1');
  }

  function applyPartialAndAdvance(partial: Partial<SurveyResponse>, nextStep: SurveyStep) {
    setResponse((prev) => ({ ...prev, ...partial }));
    setStep(nextStep);
  }

  function goBack(prevStep: SurveyStep) {
    setStep(prevStep);
  }

  async function handleFinalSubmit(partial: Partial<SurveyResponse>) {
    const finalResponse: SurveyResponse = {
      ...response,
      ...partial,
      completion_seconds: startedAtRef.current
        ? Math.floor((Date.now() - startedAtRef.current) / 1000)
        : undefined,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      referrer: typeof document !== 'undefined' ? (document.referrer || undefined) : undefined,
      utm_source: typeof window !== 'undefined'
        ? (new URLSearchParams(window.location.search).get('utm_source') ?? undefined)
        : undefined,
      utm_medium: typeof window !== 'undefined'
        ? (new URLSearchParams(window.location.search).get('utm_medium') ?? undefined)
        : undefined,
      utm_campaign: typeof window !== 'undefined'
        ? (new URLSearchParams(window.location.search).get('utm_campaign') ?? undefined)
        : undefined,
    };

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalResponse),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? '제출 실패');
      }
      clearProgress();
      setResponse(finalResponse);
      setStep('thanks');
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : '제출 실패');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {step === 'intro' && <IntroStep onStart={handleStart} />}
      {step === 'q1' && (
        <Q1Step
          initial={response}
          onPrev={() => setStep('intro')}
          onNext={(p) => applyPartialAndAdvance(p, 'q2')}
        />
      )}
      {step === 'q2' && (
        <Q2Step
          initial={response}
          onPrev={() => goBack('q1')}
          onNext={(p) => applyPartialAndAdvance(p, 'q3')}
        />
      )}
      {step === 'q3' && (
        <Q3Step
          initial={response}
          onPrev={() => goBack('q2')}
          onNext={(p) => applyPartialAndAdvance(p, 'q4')}
        />
      )}
      {step === 'q4' && (
        <Q4Step
          initial={response}
          onPrev={() => goBack('q3')}
          onNext={(p) => applyPartialAndAdvance(p, 'q5')}
        />
      )}
      {step === 'q5' && (
        <Q5Step
          initial={response}
          onPrev={() => goBack('q4')}
          onNext={(p) => applyPartialAndAdvance(p, 'q6')}
        />
      )}
      {step === 'q6' && (
        <Q6Step
          initial={response}
          onPrev={() => goBack('q5')}
          onNext={(p) => applyPartialAndAdvance(p, 'q7')}
        />
      )}
      {step === 'q7' && (
        <Q7Step
          initial={response}
          onPrev={() => goBack('q6')}
          onSubmit={handleFinalSubmit}
          submitting={submitting}
        />
      )}
      {step === 'thanks' && <ThanksStep emailEntered={!!response.email} />}

      {submitError && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-sm">
          {submitError}
        </div>
      )}
    </>
  );
}
