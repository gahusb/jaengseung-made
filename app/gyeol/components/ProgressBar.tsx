import { QUESTION_STEPS, TOTAL_QUESTIONS, type SurveyStep } from '@/lib/survey/types';

interface Props {
  step: SurveyStep;
}

/**
 * 상단 진행률 바.
 * intro/thanks에서는 렌더링 안 됨 (질문 step 만 표시).
 */
export default function ProgressBar({ step }: Props) {
  const idx = QUESTION_STEPS.indexOf(step as 'q1');
  if (idx < 0) return null;

  const current = idx + 1;
  const percent = (current / TOTAL_QUESTIONS) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between mb-2 text-white/60 text-xs font-mono tracking-widest">
        <span>{current}/{TOTAL_QUESTIONS}</span>
      </div>
      <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${percent}%`,
            background: 'linear-gradient(90deg, #cc97ff 0%, #53ddfc 100%)',
          }}
        />
      </div>
    </div>
  );
}
