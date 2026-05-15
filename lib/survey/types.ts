/**
 * CONTOUR 설문 타입.
 * survey_responses 테이블 스키마와 1:1 대응.
 */

export type SurveyStep =
  | 'intro'
  | 'q1'
  | 'q2'
  | 'q3'
  | 'q4'
  | 'q5'
  | 'q6'
  | 'q7'
  | 'thanks';

export const QUESTION_STEPS: SurveyStep[] = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'];
export const TOTAL_QUESTIONS = QUESTION_STEPS.length;  // 7

export interface SurveyResponse {
  // Q1
  age_range?: string;
  status?: string;
  // Q2
  awareness_freq?: string;
  // Q3
  tools_used?: string[];
  tools_other?: string;
  // Q4
  cost_range?: string;
  // Q5
  best_tool?: string;
  best_satisfy?: number;
  // Q6
  free_opinion?: string;
  // Q7
  email?: string;
  // 메타 (제출 시 자동 채워짐)
  user_agent?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  completion_seconds?: number;
}

export interface SavedProgress {
  step: SurveyStep;
  response: SurveyResponse;
  startedAt: number;  // ms epoch
}
