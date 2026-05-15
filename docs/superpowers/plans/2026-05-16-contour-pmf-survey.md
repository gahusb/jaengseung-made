# CONTOUR — PMF 인터뷰 설문 사이트 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** PMF 검증용 7-질문 설문 사이트 `/gyeol` 구축 + DB 저장 + Resend 즉시 확인 메일 + admin 대시보드(`/admin/survey`). 불특정 다수 익명 응답, 단일 페이지 + step state.

**Architecture:** Next.js 16 App Router 클라이언트 컴포넌트로 단일 페이지 안에 step 9개(intro/q1-q7/thanks) state 관리. localStorage progress 저장. Supabase RLS — anon INSERT만, SELECT는 service role(admin) 전용. POST /api/survey가 보존 + Resend 확인 메일. Admin은 기존 admin HMAC 패턴.

**Tech Stack:** Next.js 16 App Router + TS + Tailwind v4, Supabase Auth (`@supabase/ssr`), Resend(`resend` 패키지), `lib/security.ts` 의 sanitizeStr/isValidEmail/checkRateLimit/getClientIp 차용.

**Spec:** `docs/superpowers/specs/2026-05-16-contour-pmf-survey-design.md`

**⚠️ Subagent commit 주의**: Phase 2에서 일부 subagent의 commit이 sandboxing으로 git에 반영 안 되는 이슈 있었음. 모든 task 마지막 step에 `git log --oneline -3` 직접 확인 필수. HEAD가 본인 commit 아니면 BLOCKED 보고.

---

## File Structure

### 신규 생성

| 파일 | 책임 |
|---|---|
| `supabase/migrations/2026-05-16-create-survey-responses.sql` | DB 테이블 + RLS + index |
| `lib/survey/types.ts` | TypeScript types: SurveyStep, SurveyResponse |
| `lib/survey/questions.ts` | 7 질문 옵션 정의 (UI 데이터 SSOT) |
| `lib/survey/storage.ts` | localStorage progress save/restore |
| `app/gyeol/page.tsx` | 단일 페이지 (step state, 9 step 전환) |
| `app/gyeol/layout.tsx` | metadata + OG + robots: noindex |
| `app/gyeol/components/IntroStep.tsx` | step 'intro' — CONTOUR 로고 + 시작 버튼 |
| `app/gyeol/components/QuestionLayout.tsx` | 질문 단계 공통 wrapper (progress + 헤더 + 본문 + 이전/다음) |
| `app/gyeol/components/ProgressBar.tsx` | 진행률 (현재/7) |
| `app/gyeol/components/Q1Step.tsx` | Q1 식별 (드롭다운 2개) |
| `app/gyeol/components/Q2Step.tsx` | Q2 자각 빈도 (라디오 5) |
| `app/gyeol/components/Q3Step.tsx` | Q3 도구 사용 (멀티 체크 + 기타) |
| `app/gyeol/components/Q4Step.tsx` | Q4 비용 (라디오 6) |
| `app/gyeol/components/Q5Step.tsx` | Q5 만족도 (라디오 8 + 1-5점) |
| `app/gyeol/components/Q6Step.tsx` | Q6 자유 의견 (textarea) |
| `app/gyeol/components/Q7Step.tsx` | Q7 이메일 (옵션 + 입력) |
| `app/gyeol/components/ThanksStep.tsx` | step 'thanks' — 감사 메시지 |
| `app/api/survey/route.ts` | POST 응답 저장 + Resend 확인 메일 |
| `app/admin/survey/page.tsx` | admin 대시보드 (목록 + 카운트 + CSV) |
| `app/api/admin/survey/route.ts` | GET 목록(JSON) + CSV |

### 수정

| 파일 | 변경 |
|---|---|
| `app/components/DashboardShell.tsx` | `STANDALONE_PATHS = ['/login', '/signup', '/admin']` → `[..., '/gyeol']` 1줄 추가 |
| `app/admin/components/AdminSidebar.tsx` | NAV_ITEMS 배열 끝에 "설문 응답" 추가 |

---

## Task 순서 + 의존성

```
Phase A — 기반 (4 task)
  A1 (migration) → A2 (types) → A3 (questions) → A4 (storage)

Phase B — UI 컴포넌트 (8 task)
  B1 (ProgressBar) → B2 (QuestionLayout)
  → B3 (IntroStep)
  → B4 (Q1+Q2 묶음, 라디오/드롭다운 패턴 정착)
  → B5 (Q3, 멀티 체크 + 기타)
  → B6 (Q4+Q5 묶음, 라디오 패턴 재사용)
  → B7 (Q6+Q7 묶음, textarea + 이메일 옵션)
  → B8 (ThanksStep)

Phase C — 통합 + API (4 task)
  C1 (app/gyeol/page.tsx, layout.tsx — 단일 페이지 통합)
  → C2 (/api/survey POST)
  → C3 (DashboardShell standalone 추가)
  → C4 (/api/admin/survey GET + CSV)

Phase D — Admin UI (2 task)
  D1 (/admin/survey/page.tsx)
  → D2 (AdminSidebar 메뉴 추가)

Phase E — 검증 (1 task)
  E1 (build + lint + 시각 회귀 + CEO 운영 안내)
```

총 19 task. 각 task 작음 (10~80 LOC). UI 컴포넌트 묶음으로 task 압축.

---

## Phase A — 기반

## Task A1: Supabase migration — survey_responses 테이블

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\supabase\migrations\2026-05-16-create-survey-responses.sql`

- [ ] **Step 1: SQL 파일 작성**

```sql
-- CONTOUR PMF 설문 응답 저장.
-- 불특정 다수 익명 응답: anon INSERT 허용, SELECT는 service role(admin)만.

create table public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Q1 식별
  age_range text,
  status text,

  -- Q2 자각 빈도
  awareness_freq text,

  -- Q3 도구 사용 (멀티)
  tools_used text[],
  tools_other text,

  -- Q4 비용
  cost_range text,

  -- Q5 만족도
  best_tool text,
  best_satisfy int,

  -- Q6 자유 의견 (핵심 자발 발화)
  free_opinion text,

  -- Q7 이메일 (옵션)
  email text,
  email_confirmation_sent boolean default false,

  -- 메타
  user_agent text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,

  -- 분석용
  completion_seconds int
);

create index idx_survey_created on public.survey_responses(created_at desc);
create index idx_survey_email on public.survey_responses(email) where email is not null;

-- RLS
alter table public.survey_responses enable row level security;

-- anon insert 허용 (불특정 다수 응답 받기)
create policy "anon insert survey" on public.survey_responses
  for insert to anon
  with check (true);

-- SELECT 정책 없음 → service role(admin)만 조회 가능
```

- [ ] **Step 2: 적용은 운영자 수동 (CEO Supabase 콘솔 SQL Editor)**

이 task는 SQL 파일 commit만. 실제 supabase 적용은 CEO 수동 단계 (E1에서 안내).

- [ ] **Step 3: 커밋**

```bash
git add supabase/migrations/2026-05-16-create-survey-responses.sql
git commit -m "$(cat <<'EOF'
feat(db): survey_responses 테이블 마이그레이션 — CONTOUR PMF 설문

- anon INSERT 허용 (불특정 다수 응답)
- SELECT 정책 없음 → service role(admin)만 조회 가능
- index: created_at desc + email partial
- 메타: user_agent, referrer, utm_*, completion_seconds

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3 직접 확인**

```bash
git log --oneline -3
```

기대: HEAD = 본인 commit, 직전 = `82feb14` (CONTOUR spec).

---

## Task A2: lib/survey/types.ts

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\lib\survey\types.ts`

- [ ] **Step 1: 작성**

```ts
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
```

- [ ] **Step 2: 린트**

```bash
npx eslint lib/survey/types.ts
```
Expected: exit 0.

- [ ] **Step 3: 커밋**

```bash
git add lib/survey/types.ts
git commit -m "$(cat <<'EOF'
feat(survey): lib/survey/types — SurveyStep, SurveyResponse, SavedProgress

7 질문 step 정의 + 응답 객체 타입. survey_responses 테이블과 1:1 대응.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3 직접 확인**

---

## Task A3: lib/survey/questions.ts — 7 질문 옵션 정의

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\lib\survey\questions.ts`

- [ ] **Step 1: 작성**

```ts
/**
 * CONTOUR 설문 7 질문 옵션 SSOT.
 * UI 컴포넌트(Q1Step ~ Q7Step)가 이 데이터를 import.
 * spec markdown의 7 질문과 1:1 대응.
 */

export const AGE_RANGES = ['10대', '20대', '30대', '40대', '50대+'] as const;

export const STATUSES = [
  '직장인',
  '학생',
  '자영업',
  '프리랜서',
  '취업준비',
  '휴식 중',
  '기타',
] as const;

export const AWARENESS_FREQS = [
  '거의 매일 그래요',
  '자주 그래요',
  '가끔 그래요',
  '별로 없어요',
  '한 번도 없어요',
] as const;

export const TOOLS_OPTIONS = [
  '사주 / 타로',
  'MBTI / 성격 검사',
  '심리 상담',
  '자기계발 책 / 강의',
  '친구·가족과 대화',
  '일기 / 글쓰기',
  '검색 / 유튜브',
  '그냥 시간이 풀어줌',
  '아무것도 안 함',
] as const;

export const COST_RANGES = [
  '0원',
  '1만원 이하',
  '1~5만원',
  '5~10만원',
  '10~30만원',
  '30만원 이상',
] as const;

export const BEST_TOOLS = [
  '사주 / 타로',
  'MBTI',
  '심리 상담',
  '책 / 강의',
  '대화',
  '일기 / 글쓰기',
  '시간',
  '도움 된 게 없음',
] as const;

export const SATISFY_SCALE = [1, 2, 3, 4, 5] as const;

// 질문 헤더 카피
export const QUESTION_HEADERS: Record<string, { title: string; subtitle?: string }> = {
  q1: {
    title: '안녕하세요. 짧게 자기 소개부터.',
    subtitle: '나이대와 지금 상황을 알려주세요.',
  },
  q2: {
    title: "최근 1년 안에 '내가 뭘 원하는지 모르겠다'고 느낀 적 있어요?",
  },
  q3: {
    title: '그럴 때 어떻게 풀어가시나요?',
    subtitle: '해본 거 모두 골라주세요. (복수 선택)',
  },
  q4: {
    title: '지난 1년간 자기 이해·심리 영역에 돈 쓴 거 다 합쳐서 얼마쯤?',
  },
  q5: {
    title: '그중 가장 도움 됐던 거 + 만족도',
  },
  q6: {
    title: "혹시 '내가 진짜 알고 싶었던 건 이런 거였는데...' 하는 게 있나요?",
    subtitle: '자유롭게 적어주세요. 안 적으셔도 괜찮아요.',
  },
  q7: {
    title: '이런 도구가 나오면 알려드릴까요?',
    subtitle: '결과를 받고 싶으시면 이메일을 남겨주세요.',
  },
};
```

- [ ] **Step 2: 린트**

```bash
npx eslint lib/survey/questions.ts
```

- [ ] **Step 3: 커밋**

```bash
git add lib/survey/questions.ts
git commit -m "$(cat <<'EOF'
feat(survey): lib/survey/questions — 7 질문 옵션 SSOT

각 질문의 라디오/체크/드롭다운 옵션 배열 + 헤더 카피.
spec markdown의 7 질문 그대로 반영 (단어 '결' 등 한글 컨셉어 제거 — CONTOUR 영문 단독).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3**

---

## Task A4: lib/survey/storage.ts — localStorage helpers

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\lib\survey\storage.ts`

- [ ] **Step 1: 작성**

```ts
import type { SavedProgress } from './types';

const STORAGE_KEY = 'gyeol_survey_progress_v1';

/**
 * Progress 저장. 새로고침 후 복구용.
 * SSR 환경에서는 noop.
 */
export function saveProgress(progress: SavedProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // storage quota exceeded 등 — 무시 (응답 자체에 영향 X)
  }
}

/**
 * Progress 복구. 없거나 파싱 실패 시 null.
 */
export function loadProgress(): SavedProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedProgress;
  } catch {
    return null;
  }
}

/**
 * 제출 성공 시 progress 삭제.
 */
export function clearProgress(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}
```

- [ ] **Step 2: 린트**

```bash
npx eslint lib/survey/storage.ts
```

- [ ] **Step 3: 커밋**

```bash
git add lib/survey/storage.ts
git commit -m "$(cat <<'EOF'
feat(survey): lib/survey/storage — localStorage progress save/load/clear

새로고침 시 step + response 복구. SSR safe (window 체크).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3**

---

# Phase B — UI 컴포넌트 (8 task)

## Task B1: ProgressBar 컴포넌트

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\gyeol\components\ProgressBar.tsx`

- [ ] **Step 1: 작성**

```tsx
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
```

- [ ] **Step 2: 린트**

```bash
npx eslint app/gyeol/components/ProgressBar.tsx
```

- [ ] **Step 3: 커밋**

```bash
git add app/gyeol/components/ProgressBar.tsx
git commit -m "$(cat <<'EOF'
feat(gyeol): ProgressBar — 진행률 (보라/시안 그라데이션 라인)

intro/thanks step에서는 미렌더. q1~q7만 표시.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3**

---

## Task B2: QuestionLayout 공통 wrapper

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\gyeol\components\QuestionLayout.tsx`

- [ ] **Step 1: 작성**

```tsx
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
```

- [ ] **Step 2: 린트**

```bash
npx eslint app/gyeol/components/QuestionLayout.tsx
```

- [ ] **Step 3: 커밋**

```bash
git add app/gyeol/components/QuestionLayout.tsx
git commit -m "$(cat <<'EOF'
feat(gyeol): QuestionLayout — 질문 단계 공통 wrapper

ProgressBar + 헤더 + 본문 slot + 이전/다음 네비게이션.
nextDisabled로 validation 제어. submitting 시 버튼 비활성.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3**

---

## Task B3: IntroStep

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\gyeol\components\IntroStep.tsx`

- [ ] **Step 1: 작성**

```tsx
'use client';

interface Props {
  onStart: () => void;
}

/**
 * 인트로 step — CONTOUR 로고 + 한글 부제 + 시작 버튼.
 * spec design PNG 1번째 화면 참조.
 */
export default function IntroStep({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center text-white">
      {/* 로고 */}
      <div className="mb-10">
        <h1
          className="kx-display text-5xl md:text-7xl font-black tracking-[0.15em] mb-4"
          style={{
            background: 'linear-gradient(135deg, #cc97ff 0%, #53ddfc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          CONTOUR
        </h1>
        <p className="text-base md:text-lg text-white/70 leading-relaxed">
          나를 더 선명하게 이해하는 3분
        </p>
      </div>

      {/* 시작 버튼 */}
      <button
        type="button"
        onClick={onStart}
        className="kx-btn-primary px-10 py-3 rounded-full text-base font-bold"
      >
        시작하기
      </button>

      <p className="mt-6 text-xs text-white/40 font-mono">7 질문 · 약 3분</p>
    </div>
  );
}
```

- [ ] **Step 2: 린트**

```bash
npx eslint app/gyeol/components/IntroStep.tsx
```

- [ ] **Step 3: 커밋**

```bash
git add app/gyeol/components/IntroStep.tsx
git commit -m "$(cat <<'EOF'
feat(gyeol): IntroStep — CONTOUR 로고 그라데이션 + 부제 + 시작 버튼

영문 단독 브랜드, 한글 부제 "나를 더 선명하게 이해하는 3분".
보라/시안 그라데이션 텍스트, 7 질문 안내.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3**

---

## Task B4: Q1Step + Q2Step (드롭다운 + 라디오 패턴 정착)

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\gyeol\components\Q1Step.tsx`
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\gyeol\components\Q2Step.tsx`

- [ ] **Step 1: Q1Step (드롭다운 2개)**

```tsx
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
```

- [ ] **Step 2: Q2Step (라디오 5개)**

```tsx
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
```

- [ ] **Step 3: 린트**

```bash
npx eslint app/gyeol/components/Q1Step.tsx app/gyeol/components/Q2Step.tsx
```

- [ ] **Step 4: 커밋**

```bash
git add app/gyeol/components/Q1Step.tsx app/gyeol/components/Q2Step.tsx
git commit -m "$(cat <<'EOF'
feat(gyeol): Q1Step (드롭다운) + Q2Step (라디오 5)

- Q1: 나이대 + 상황 두 드롭다운, 둘 다 선택 시 활성
- Q2: 자각 빈도 5 라디오, 보라 활성 스타일
- 라디오 패턴이 이후 Q4/Q5에서 재사용됨

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: ⚠️ git log -3**

---

## Task B5: Q3Step (멀티 체크 + 기타 입력)

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\gyeol\components\Q3Step.tsx`

- [ ] **Step 1: 작성**

```tsx
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
```

- [ ] **Step 2: 린트**

```bash
npx eslint app/gyeol/components/Q3Step.tsx
```

- [ ] **Step 3: 커밋**

```bash
git add app/gyeol/components/Q3Step.tsx
git commit -m "$(cat <<'EOF'
feat(gyeol): Q3Step — 멀티 체크 9개 + 기타 자유 입력

validation: 최소 1개 체크 또는 기타 입력 있어야 다음 활성.
체크박스 패턴 + 활성 시 보라 + 흰 체크마크.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3**

---

## Task B6: Q4Step + Q5Step (라디오 패턴 재사용)

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\gyeol\components\Q4Step.tsx`
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\gyeol\components\Q5Step.tsx`

- [ ] **Step 1: Q4Step (비용 라디오 6개)**

```tsx
'use client';

import { useState } from 'react';
import { COST_RANGES } from '@/lib/survey/questions';
import type { SurveyResponse } from '@/lib/survey/types';
import QuestionLayout from './QuestionLayout';

interface Props {
  initial: Partial<SurveyResponse>;
  onPrev: () => void;
  onNext: (partial: Partial<SurveyResponse>) => void;
}

export default function Q4Step({ initial, onPrev, onNext }: Props) {
  const [value, setValue] = useState(initial.cost_range ?? '');

  return (
    <QuestionLayout
      step="q4"
      onPrev={onPrev}
      onNext={() => onNext({ cost_range: value })}
      nextDisabled={!value}
    >
      <div className="space-y-2">
        {COST_RANGES.map((option) => (
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
              name="cost_range"
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
```

- [ ] **Step 2: Q5Step (최고 도구 + 만족도 1-5)**

```tsx
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
```

- [ ] **Step 3: 린트**

```bash
npx eslint app/gyeol/components/Q4Step.tsx app/gyeol/components/Q5Step.tsx
```

- [ ] **Step 4: 커밋**

```bash
git add app/gyeol/components/Q4Step.tsx app/gyeol/components/Q5Step.tsx
git commit -m "$(cat <<'EOF'
feat(gyeol): Q4Step (비용 라디오 6) + Q5Step (도구 라디오 8 + 만족도 1-5)

- Q4: 라디오 패턴 재사용 (Q2와 동일 스타일)
- Q5: 두 입력 한 화면 — 도구 라디오 + 만족도 1-5 버튼 그리드
- 둘 다 선택 시 다음 활성

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: ⚠️ git log -3**

---

## Task B7: Q6Step + Q7Step (textarea + 이메일 옵션)

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\gyeol\components\Q6Step.tsx`
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\gyeol\components\Q7Step.tsx`

- [ ] **Step 1: Q6Step (자유 의견 textarea)**

```tsx
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
```

- [ ] **Step 2: Q7Step (이메일 옵션)**

```tsx
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
```

- [ ] **Step 3: 린트**

```bash
npx eslint app/gyeol/components/Q6Step.tsx app/gyeol/components/Q7Step.tsx
```

- [ ] **Step 4: 커밋**

```bash
git add app/gyeol/components/Q6Step.tsx app/gyeol/components/Q7Step.tsx
git commit -m "$(cat <<'EOF'
feat(gyeol): Q6Step (자유 의견 textarea) + Q7Step (이메일 옵션)

- Q6: 1000자 textarea, 빈 칸 허용 (skippable)
- Q7: yes/no 라디오 + yes 선택 시 이메일 입력 노출 + 형식 validation
- Q7 onSubmit = 최종 제출 트리거 (page.tsx에서 POST /api/survey)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: ⚠️ git log -3**

---

## Task B8: ThanksStep

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\gyeol\components\ThanksStep.tsx`

- [ ] **Step 1: 작성**

```tsx
'use client';

import Link from 'next/link';

interface Props {
  emailEntered: boolean;
}

export default function ThanksStep({ emailEntered }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center text-white">
      <div className="mb-10">
        <h2
          className="kx-display text-3xl md:text-5xl font-bold mb-5"
          style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
        >
          감사합니다.
        </h2>
        <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-md">
          답변이 큰 도움이 됐어요.
          {emailEntered && (
            <>
              <br />
              결과는 추후 입력하신 이메일로 공유드릴게요.
            </>
          )}
        </p>
      </div>

      <Link
        href="/"
        className="text-sm text-white/50 hover:text-white underline underline-offset-4 transition"
      >
        쟁승메이드 홈으로 →
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: 린트**

```bash
npx eslint app/gyeol/components/ThanksStep.tsx
```

- [ ] **Step 3: 커밋**

```bash
git add app/gyeol/components/ThanksStep.tsx
git commit -m "$(cat <<'EOF'
feat(gyeol): ThanksStep — 감사 메시지 + 사이트 돌아가기

이메일 입력 여부에 따라 "결과 추후 공유" 안내 분기.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3**

---

# Phase C — 통합 + API

## Task C1: app/gyeol/page.tsx + layout.tsx — 단일 페이지 통합

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\gyeol\layout.tsx`
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\gyeol\page.tsx`

- [ ] **Step 1: layout.tsx**

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CONTOUR — 나를 더 선명하게 이해하는 3분',
  description: '7 질문, 3분. 자기 이해·심리 영역 짧은 설문에 참여해주세요.',
  openGraph: {
    title: 'CONTOUR — 나를 더 선명하게 이해하는 3분',
    description: '7 질문, 3분. 짧은 설문에 답해주세요.',
    url: 'https://jaengseung-made.com/gyeol',
    images: [
      {
        url: 'https://jaengseung-made.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CONTOUR',
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function GyeolLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'radial-gradient(ellipse at top, rgba(204,151,255,0.15) 0%, transparent 50%), linear-gradient(180deg, #060e20 0%, #000000 100%)',
      }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: page.tsx — 단일 페이지 통합**

```tsx
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
      // 성공: localStorage 정리 + 응답에 partial 반영 (이메일 진입 여부 ThanksStep에 전달)
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
```

- [ ] **Step 3: 린트 + 빌드**

```bash
npx eslint app/gyeol/page.tsx app/gyeol/layout.tsx
npm run build 2>&1 | tail -10
```

빌드 통과 필수. `/gyeol` 정적/dynamic 라우트로 등록됨 (client component이므로 dynamic 가능성).

- [ ] **Step 4: 커밋**

```bash
git add app/gyeol/
git commit -m "$(cat <<'EOF'
feat(gyeol): /gyeol 단일 페이지 통합 — 9 step state, localStorage 복구

- layout: radial 그라데이션 배경 + metadata (robots noindex)
- page: step state + Q1~Q7 컴포넌트 조합
- 진입 시 localStorage 복구 + step 변경 시 저장 + 제출 시 clear
- 최종 제출: completion_seconds, user_agent, referrer, utm_* 자동 수집
- 에러 토스트 표시

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: ⚠️ git log -3**

---

## Task C2: /api/survey POST 라우트

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\api\survey\route.ts`

- [ ] **Step 1: 작성** (`/api/contact` 패턴 차용)

```ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/admin';
import { isValidEmail, sanitizeStr, checkRateLimit, getClientIp, INPUT_LIMITS } from '@/lib/security';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Rate Limit: IP당 1분 5회
    const ip = getClientIp(request);
    const rl = checkRateLimit(`survey:${ip}`, 60_000, 5);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
        {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) },
        }
      );
    }

    const body = await request.json();

    // 기본 validation — Q1, Q2는 필수
    if (!body.age_range || !body.status || !body.awareness_freq) {
      return NextResponse.json(
        { error: '필수 응답이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 입력 정제
    const tools_other = body.tools_other ? sanitizeStr(body.tools_other, 200) : null;
    const free_opinion = body.free_opinion ? sanitizeStr(body.free_opinion, 2000) : null;
    const email = body.email ? sanitizeStr(body.email, INPUT_LIMITS.EMAIL) : null;
    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // DB INSERT (service role — RLS 우회)
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('survey_responses')
      .insert({
        age_range: body.age_range,
        status: body.status,
        awareness_freq: body.awareness_freq,
        tools_used: Array.isArray(body.tools_used) ? body.tools_used : null,
        tools_other,
        cost_range: body.cost_range ?? null,
        best_tool: body.best_tool ?? null,
        best_satisfy: typeof body.best_satisfy === 'number' ? body.best_satisfy : null,
        free_opinion,
        email,
        user_agent: body.user_agent ? sanitizeStr(body.user_agent, 500) : null,
        referrer: body.referrer ? sanitizeStr(body.referrer, 500) : null,
        utm_source: body.utm_source ? sanitizeStr(body.utm_source, 100) : null,
        utm_medium: body.utm_medium ? sanitizeStr(body.utm_medium, 100) : null,
        utm_campaign: body.utm_campaign ? sanitizeStr(body.utm_campaign, 100) : null,
        completion_seconds: typeof body.completion_seconds === 'number' ? body.completion_seconds : null,
      })
      .select()
      .single();

    if (error) {
      console.error('[Survey] DB insert error:', error);
      return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 });
    }

    // Resend 즉시 확인 메일 (이메일 입력 시만)
    if (email) {
      try {
        await resend.emails.send({
          from: '쟁승메이드 <noreply@jaengseung-made.com>',
          to: email,
          subject: 'CONTOUR 설문 참여 감사드립니다',
          html: `<p>안녕하세요,</p>
                 <p>설문에 참여해주셔서 감사합니다. 결과는 추후 공유드리겠습니다.</p>
                 <p>— 쟁승메이드</p>`,
        });
        await supabase
          .from('survey_responses')
          .update({ email_confirmation_sent: true })
          .eq('id', data.id);
      } catch (mailErr) {
        console.error('[Survey] Resend error:', mailErr);
        // 메일 실패는 응답 저장 성공에 영향 X
      }
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (e) {
    console.error('[Survey] Unexpected error:', e);
    return NextResponse.json({ error: '제출 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
```

- [ ] **Step 2: 린트 + 빌드**

```bash
npx eslint app/api/survey/route.ts
npm run build 2>&1 | tail -10
```

- [ ] **Step 3: 커밋**

```bash
git add app/api/survey/route.ts
git commit -m "$(cat <<'EOF'
feat(api): /api/survey POST — DB 저장 + Resend 확인 메일

- Rate limit: IP당 1분 5회 (기존 contact 패턴)
- 필수 validation: age_range, status, awareness_freq
- 입력 정제(sanitizeStr) + 이메일 형식 검증
- supabase INSERT (service role, RLS 우회)
- 이메일 입력 시: Resend 즉시 확인 메일 + email_confirmation_sent 마킹
- 메일 실패는 응답 저장 성공에 영향 X

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3**

---

## Task C3: DashboardShell standalone에 /gyeol 추가

**Files:**
- Modify: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\components\DashboardShell.tsx`

- [ ] **Step 1: STANDALONE_PATHS 변경**

현재 (line 6):
```ts
const STANDALONE_PATHS = ['/login', '/signup', '/admin'];
```

변경 후:
```ts
const STANDALONE_PATHS = ['/login', '/signup', '/admin', '/gyeol'];
```

(1줄 변경)

- [ ] **Step 2: 린트 + 빌드**

```bash
npx eslint app/components/DashboardShell.tsx
npm run build 2>&1 | tail -10
```

- [ ] **Step 3: 커밋**

```bash
git add app/components/DashboardShell.tsx
git commit -m "$(cat <<'EOF'
feat(shell): DashboardShell STANDALONE_PATHS에 /gyeol 추가

CONTOUR 설문 페이지는 자체 시각 정체성 — TopNav/푸터/카카오 모두 숨김.
풀스크린 설문 UI 집중도 보장.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3**

---

## Task C4: /api/admin/survey GET + CSV

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\api\admin\survey\route.ts`

- [ ] **Step 1: 작성**

```ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminTokenNode } from '@/lib/admin-auth';

export const runtime = 'nodejs';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token && verifyAdminTokenNode(token);
}

interface SurveyRow {
  id: string;
  created_at: string;
  age_range: string | null;
  status: string | null;
  awareness_freq: string | null;
  tools_used: string[] | null;
  tools_other: string | null;
  cost_range: string | null;
  best_tool: string | null;
  best_satisfy: number | null;
  free_opinion: string | null;
  email: string | null;
  user_agent: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  completion_seconds: number | null;
}

export async function GET(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const range = url.searchParams.get('range') ?? 'all';
  const format = url.searchParams.get('format') ?? 'json';

  const supabase = createAdminClient();
  let query = supabase
    .from('survey_responses')
    .select('*')
    .order('created_at', { ascending: false });

  if (range === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    query = query.gte('created_at', today.toISOString());
  } else if (range === 'week') {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    query = query.gte('created_at', weekAgo.toISOString());
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows: SurveyRow[] = (data ?? []) as SurveyRow[];

  if (format === 'csv') {
    const csv = toCsv(rows);
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="contour-survey-${range}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({
    total: rows.length,
    stats: computeStats(rows),
    responses: rows,
  });
}

function toCsv(rows: SurveyRow[]): string {
  if (rows.length === 0) return 'id,created_at\n';
  const headers: (keyof SurveyRow)[] = [
    'id',
    'created_at',
    'age_range',
    'status',
    'awareness_freq',
    'tools_used',
    'tools_other',
    'cost_range',
    'best_tool',
    'best_satisfy',
    'free_opinion',
    'email',
    'user_agent',
    'referrer',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'completion_seconds',
  ];
  // BOM for Excel UTF-8 호환
  const bom = '﻿';
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(
      headers
        .map((h) => {
          const v = r[h];
          if (v == null) return '';
          if (Array.isArray(v)) return `"${v.join('|').replace(/"/g, '""')}"`;
          return `"${String(v).replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
        })
        .join(',')
    );
  }
  return bom + lines.join('\n');
}

function counts(rows: SurveyRow[], key: keyof SurveyRow): Record<string, number> {
  return rows.reduce((acc, r) => {
    const v = r[key];
    if (v != null && typeof v === 'string') {
      acc[v] = (acc[v] ?? 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
}

function computeStats(rows: SurveyRow[]) {
  const satisfyValues = rows
    .map((r) => r.best_satisfy)
    .filter((n): n is number => typeof n === 'number');
  const satisfyAvg =
    satisfyValues.length > 0
      ? (satisfyValues.reduce((s, n) => s + n, 0) / satisfyValues.length).toFixed(2)
      : '0';

  const completionValues = rows
    .map((r) => r.completion_seconds)
    .filter((n): n is number => typeof n === 'number');
  const completionMedian = median(completionValues);

  return {
    age_range: counts(rows, 'age_range'),
    status: counts(rows, 'status'),
    awareness_freq: counts(rows, 'awareness_freq'),
    cost_range: counts(rows, 'cost_range'),
    best_tool: counts(rows, 'best_tool'),
    satisfy_avg: satisfyAvg,
    email_rate: rows.length === 0 ? '0' : ((rows.filter((r) => r.email).length / rows.length) * 100).toFixed(1),
    completion_seconds_median: completionMedian,
  };
}

function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}
```

- [ ] **Step 2: 린트 + 빌드**

```bash
npx eslint app/api/admin/survey/route.ts
npm run build 2>&1 | tail -10
```

- [ ] **Step 3: 커밋**

```bash
git add app/api/admin/survey/route.ts
git commit -m "$(cat <<'EOF'
feat(api): /api/admin/survey GET — 목록 + 통계 + CSV export

- ?range=all|today|week 필터
- ?format=csv → BOM 포함 UTF-8 CSV 다운로드 (Excel 호환)
- 통계: 각 질문별 카운트 분포 + 만족도 평균 + 이메일률 + 완료시간 중간값
- admin HMAC cookie 인증 (verifyAdminTokenNode)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3**

---

# Phase D — Admin UI

## Task D1: /admin/survey 페이지

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\admin\survey\page.tsx`

- [ ] **Step 1: 작성**

```tsx
'use client';

import { useEffect, useState } from 'react';

interface SurveyRow {
  id: string;
  created_at: string;
  age_range: string | null;
  status: string | null;
  awareness_freq: string | null;
  tools_used: string[] | null;
  tools_other: string | null;
  cost_range: string | null;
  best_tool: string | null;
  best_satisfy: number | null;
  free_opinion: string | null;
  email: string | null;
  user_agent: string | null;
  referrer: string | null;
  utm_source: string | null;
  completion_seconds: number | null;
}

interface Stats {
  age_range: Record<string, number>;
  status: Record<string, number>;
  awareness_freq: Record<string, number>;
  cost_range: Record<string, number>;
  best_tool: Record<string, number>;
  satisfy_avg: string;
  email_rate: string;
  completion_seconds_median: number;
}

type Range = 'all' | 'today' | 'week';

export default function AdminSurveyPage() {
  const [range, setRange] = useState<Range>('all');
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [rows, setRows] = useState<SurveyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SurveyRow | null>(null);

  async function load(r: Range) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/survey?range=${r}`);
      const data = await res.json();
      setTotal(data.total ?? 0);
      setStats(data.stats ?? null);
      setRows(data.responses ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(range);
  }, [range]);

  function downloadCsv() {
    window.location.href = `/api/admin/survey?range=${range}&format=csv`;
  }

  function fmtCount(counts: Record<string, number> | undefined): string {
    if (!counts) return '';
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k} ${v}`)
      .join(' · ');
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-white text-2xl font-bold">설문 응답</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            CONTOUR PMF 설문 — 총 {total}건
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'today', 'week'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition ${
                range === r
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {r === 'all' ? '전체' : r === 'today' ? '오늘' : '이번 주'}
            </button>
          ))}
          <button
            onClick={downloadCsv}
            className="px-3 py-1.5 rounded-lg text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition"
          >
            📥 CSV
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-2">Q2 자각 빈도</p>
            <p className="text-sm text-white">{fmtCount(stats.awareness_freq) || '데이터 없음'}</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-2">Q4 비용</p>
            <p className="text-sm text-white">{fmtCount(stats.cost_range) || '데이터 없음'}</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-2">Q5 만족도 평균</p>
            <p className="text-xl text-violet-400 font-bold">{stats.satisfy_avg} / 5</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-2">Q7 이메일률 / 완료 시간 (중간값)</p>
            <p className="text-sm text-white">
              {stats.email_rate}% · {stats.completion_seconds_median}s
            </p>
          </div>
        </div>
      )}

      {/* 응답 리스트 */}
      {loading ? (
        <p className="text-slate-400">불러오는 중...</p>
      ) : rows.length === 0 ? (
        <p className="text-slate-500">응답이 없습니다.</p>
      ) : (
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="text-left px-4 py-3">시각</th>
                <th className="text-left px-4 py-3">나이/상황</th>
                <th className="text-left px-4 py-3">Q4 비용</th>
                <th className="text-left px-4 py-3">Q5 만족</th>
                <th className="text-left px-4 py-3">Q6 자유의견 (미리보기)</th>
                <th className="text-left px-4 py-3">이메일</th>
                <th className="text-left px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-slate-800 hover:bg-slate-800/50 transition">
                  <td className="px-4 py-2 text-slate-300">{new Date(r.created_at).toLocaleString('ko-KR')}</td>
                  <td className="px-4 py-2 text-slate-300">{r.age_range} · {r.status}</td>
                  <td className="px-4 py-2 text-slate-300">{r.cost_range ?? '-'}</td>
                  <td className="px-4 py-2 text-slate-300">{r.best_satisfy ?? '-'}</td>
                  <td className="px-4 py-2 text-slate-400 max-w-xs truncate">
                    {r.free_opinion ?? <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-4 py-2 text-slate-300">{r.email ?? '-'}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setSelected(r)}
                      className="text-violet-400 hover:text-violet-300 text-xs font-bold"
                    >
                      상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 상세 modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white font-bold">응답 상세</h2>
                <p className="text-xs text-slate-400 mt-1">{new Date(selected.created_at).toLocaleString('ko-KR')}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <dl className="space-y-3 text-sm">
              {[
                ['Q1 나이대', selected.age_range],
                ['Q1 상황', selected.status],
                ['Q2 자각 빈도', selected.awareness_freq],
                ['Q3 도구', selected.tools_used?.join(', ')],
                ['Q3 기타', selected.tools_other],
                ['Q4 비용', selected.cost_range],
                ['Q5 최고 도구', selected.best_tool],
                ['Q5 만족도', selected.best_satisfy != null ? `${selected.best_satisfy} / 5` : null],
                ['Q6 자유 의견', selected.free_opinion],
                ['Q7 이메일', selected.email],
                ['user_agent', selected.user_agent],
                ['referrer', selected.referrer],
                ['utm_source', selected.utm_source],
                ['완료 시간', selected.completion_seconds != null ? `${selected.completion_seconds}초` : null],
              ].map(([k, v]) => (
                <div key={k as string} className="flex gap-3 border-b border-slate-800 pb-2">
                  <dt className="w-32 text-slate-400 flex-shrink-0">{k}</dt>
                  <dd className="text-white whitespace-pre-wrap break-words flex-1">{(v as string) || <span className="text-slate-600">—</span>}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 린트 + 빌드**

```bash
npx eslint app/admin/survey/page.tsx
npm run build 2>&1 | tail -10
```

- [ ] **Step 3: 커밋**

```bash
git add app/admin/survey/
git commit -m "$(cat <<'EOF'
feat(admin): /admin/survey 대시보드 — 목록 + 통계 + CSV + 상세 modal

- 필터: 전체/오늘/이번 주
- 통계: Q2/Q4/Q5 분포 + 만족도 평균 + 이메일률 + 완료 시간 중간값
- 응답 테이블 (시각/나이상황/Q4/Q5/Q6 미리보기/이메일/상세)
- 상세 modal: 7 질문 + 메타 14 필드 모두 표시
- CSV 다운로드 (BOM UTF-8, Excel 호환)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3**

---

## Task D2: AdminSidebar 메뉴 추가

**Files:**
- Modify: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\admin\components\AdminSidebar.tsx`

- [ ] **Step 1: NAV_ITEMS 배열 끝에 추가**

`app/admin/components/AdminSidebar.tsx` 의 NAV_ITEMS 배열 마지막 (현재 "팩 자료" 항목 다음 또는 배열 끝)에 다음 항목 추가:

```tsx
{
  href: '/admin/survey',
  label: '설문 응답',
  icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
},
```

(체크리스트 모티브 SVG)

- [ ] **Step 2: 린트 + 빌드**

```bash
npx eslint app/admin/components/AdminSidebar.tsx
npm run build 2>&1 | tail -10
```

- [ ] **Step 3: 커밋**

```bash
git add app/admin/components/AdminSidebar.tsx
git commit -m "$(cat <<'EOF'
feat(admin): AdminSidebar에 "설문 응답" 메뉴 추가

NAV_ITEMS 배열 끝에 /admin/survey 항목 (체크리스트 아이콘).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3**

---

# Phase E — 검증

## Task E1: 통합 빌드/린트/CEO 안내

**Files:** 코드 변경 없음.

- [ ] **Step 1: 전체 빌드**

```bash
npm run build 2>&1 | tail -15
```

기대: 모든 라우트 빌드 success. 새 라우트:
- `/gyeol` (client, prerender 또는 dynamic)
- `/admin/survey` (client)
- `/api/survey` (dynamic)
- `/api/admin/survey` (dynamic)

- [ ] **Step 2: 변경 핵심 파일 lint**

```bash
npx eslint \
  app/gyeol/ \
  app/admin/survey/ \
  app/api/survey/route.ts \
  app/api/admin/survey/route.ts \
  app/components/DashboardShell.tsx \
  app/admin/components/AdminSidebar.tsx \
  lib/survey/ \
  supabase/migrations/2026-05-16-create-survey-responses.sql
```

기대: 사전 존재 경고만.

- [ ] **Step 3: CEO 수동 작업 안내 (UI text — 코드 변경 X)**

다음 운영 절차를 사용자에게 안내:

**A. Supabase migration 적용 (필수)**
1. Supabase 대시보드 → SQL Editor
2. `supabase/migrations/2026-05-16-create-survey-responses.sql` 내용 복사·Run
3. 검증: `pack_files` 가 아닌 `survey_responses` 테이블이 생성됨 + RLS enable

**B. Vercel env 확인 (기존 변수, 추가 없음)**
- `RESEND_API_KEY` 이미 설정됨 (`/api/contact`에서 사용 중)
- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` 이미 설정됨

**C. push & 배포**
```bash
git push origin main  # Vercel 자동 배포
```

**D. 시각 회귀**
- `/gyeol` 진입 → CONTOUR 로고 + 시작 버튼 → 7 step 모두 동작 → 제출 → thanks 페이지
- 모바일 viewport 확인 (PNG 디자인 톤)
- localStorage 새로고침 복구 검증
- `/admin/survey` 진입 → 응답 0건 / 일부 응답 후 → 목록 + 통계 + CSV 동작
- 옛 라우트 redirect, 다른 페이지 회귀 미발생

**E. 채널 공유 시작 (spec markdown의 9 채널)**
- 인스타·카톡·유튜브 쇼츠·블로그·LinkedIn (Tier 1)
- UTM 파라미터 부착:
  - `https://jaengseung-made.com/gyeol?utm_source=instagram&utm_medium=story&utm_campaign=v1`
  - `https://jaengseung-made.com/gyeol?utm_source=kakao&utm_medium=direct`
  - 등

- [ ] **Step 4: 메모리 갱신 (선택, 별도 commit X)**

`C:\Users\jaeoh\.claude\projects\C--Users-jaeoh-Desktop-workspace-jaengseung-made\memory\MEMORY.md` 에 추가:
```markdown
- [CONTOUR PMF 설문](./project_contour_pmf.md) — /gyeol 7질문 설문, supabase + Resend 메일
```

`project_contour_pmf.md` 신규:
```markdown
---
name: CONTOUR PMF 설문 (2026-05-16)
description: /gyeol 7질문 PMF 검증 설문, 불특정 다수 익명, supabase + Resend
type: project
---

# CONTOUR PMF 설문

- spec: docs/superpowers/specs/2026-05-16-contour-pmf-survey-design.md
- plan: docs/superpowers/plans/2026-05-16-contour-pmf-survey.md
- URL: /gyeol (영문 브랜드 단독, '결' 한글 제거)
- DB: survey_responses (anon INSERT만, admin SELECT)
- Admin: /admin/survey
- 백로그: 차트 시각화, Q6 자발어 워드클라우드, NAS Synology Mail 전환

**Why:** PMF 검증 — Pull/Push 신호 (Q2 자각, Q4 비용, Q5 만족도, Q6 자발어).
**How to apply:** 채널 공유 시 UTM 파라미터 부착, admin 대시보드에서 모니터링.
```

이 task는 코드 변경 없음. commit X.

---

## 부록 A. 검증 인프라

이 프로젝트는 jest/vitest/playwright 미설치. 각 task 검증:
1. `npx eslint <변경 파일>` — TS + ESLint
2. `npm run build` — Next 빌드 통과
3. 마지막 E1에서 시각/manual 회귀

## 부록 B. Subagent commit sandboxing 우려

Phase 2 에서 일부 subagent의 commit이 git에 반영 안 되는 sandboxing 이슈 있었음. 본 plan의 모든 task에 `git log --oneline -3` 직접 검증 step 포함. HEAD가 본인 commit 아니면 **BLOCKED + sandbox 의심 보고**.

## 부록 C. P3+ 후속

이 plan 종료 후 자연 follow-up:

1. **Recharts 차트 시각화** — admin 대시보드 응답 50건 누적 후
2. **Q6 자발어 키워드 추출 + 워드 클라우드** — GPT API 호출 또는 한글 형태소 분석기
3. **Pull/Push 게이트 자동 판정 UI** — spec markdown의 기준치 자동 판정
4. **Rate limit 강화** — 현재 메모리 기반, Redis/upstash 등 영구화
5. **Cloudflare Turnstile invisible captcha** — spam 발생 시
6. **이메일 batch 발송 UI** — 결과 알림 시점에 admin 메뉴 추가
7. **NAS Synology Mail Server 자체 호스팅** — Resend 의존 제거
8. **/gyeol → /contour rebrand** — 정식 출시 시 영문 단어 URL로 + 301 redirect
