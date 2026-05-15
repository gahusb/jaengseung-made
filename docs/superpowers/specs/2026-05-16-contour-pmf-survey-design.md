# CONTOUR — PMF 인터뷰 설문 사이트

- **작성일**: 2026-05-16
- **상위 소스**: `C:\Users\jaeoh\Documents\Obsidian Vault\raw\2026-05-15-PMF-사이트설문조사-결-설계.md` (7 질문 spec, DB 모델, 채널·일정)
- **디자인 참고**: `C:\Users\jaeoh\Desktop\workspace\source\pitures\gyeol_survey_flow.png` (CONTOUR 로고 + 다크 보라/시안 그라데이션 + 4-step flow)
- **목표**: 박재오의 PMF 검증을 위한 사이트 기반 불특정다수 설문. 7 질문, 3분 완료, 모바일 우선, DB 자동 수집, admin 대시보드.
- **CEO 결정 (2026-05-16)**:
  1. URL = `/gyeol` + 브랜드 = **CONTOUR (영문 단독)** — 마케팅 반감 회피 위해 spec/UI에서 한글 컨셉어("결") 제거
  2. 페이지 구조 = 단일 페이지 + step state (URL 불변, localStorage progress 저장)
  3. `/gyeol` standalone shell — TopNav/푸터/카카오 모두 숨김 (설문 집중도)
  4. Admin 대시보드 = MVP A 범위 (목록 + 카운트 + CSV). 차트·워드클라우드 별도 plan
  5. Q7 이메일 = Resend 즉시 확인 메일 1통, 카피 "설문에 참여해주셔서 감사합니다. 결과는 추후 공유드리겠습니다."
  6. Admin 메뉴 = `/admin/survey` 신규, AdminSidebar 끝에 배치
  7. 백로그: Resend → NAS Synology Mail Server 자체 호스팅 (P3+, 무료 호스팅 전환)

## 1. 브랜드 + URL

| 항목 | 값 |
|---|---|
| 브랜드 (로고·헤더 노출) | **CONTOUR** (영문 단독) |
| URL | `https://jaengseung-made.com/gyeol` |
| 한글 부제 | "나를 더 선명하게 이해하는 3분" (PNG 디자인 그대로, 한자/특수컨셉어 없음) |
| Admin URL | `/admin/survey` |
| API endpoint | `/api/survey` (POST 응답), `/api/admin/survey` (admin GET/CSV) |

⚠️ **마케팅 카피·UI 어디에도 한글 "결" 단어 사용 금지.** 브랜드 = "CONTOUR" 단독. 단, `/gyeol` URL 자체는 기술적 path라 마케팅 노출 적음 — 유지 (변경 시 향후 redirect 필요).

## 2. 페이지 구조 (단일 페이지 + step state)

```
/gyeol (단일 페이지)
└── step state: 'intro' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'thanks'
    │
    ├── intro: CONTOUR 로고 + 한글 부제 + [시작하기] 버튼
    ├── q1: 나이대 + 상황 (드롭다운 2개) → [다음]
    ├── q2: 자각 빈도 (라디오 5개) → [이전] [다음]
    ├── q3: 도구 사용 (멀티 체크 9개 + 기타 입력) → [이전] [다음]
    ├── q4: 비용 (라디오 6개) → [이전] [다음]
    ├── q5: 최고 도구 (라디오 8개) + 만족도 (라디오 1-5) → [이전] [다음]
    ├── q6: 자유 의견 (textarea, 옵션) → [이전] [다음]
    ├── q7: 이메일 옵션 (선택 + 입력) → [이전] [전송]
    │       (전송 시 POST /api/survey)
    │
    └── thanks: "감사합니다" + "결과 알림" 표시 + 사이트 돌아가기
```

**state 관리**:
- React useState로 step + 응답 객체 보유
- 매 step 변경 시 localStorage에 progress 저장 (`gyeol_survey_progress` key) — 새로고침 복구
- 제출 성공 시 localStorage 삭제

**진행률 표시**:
- 상단 "1/7" + 가는 보라 라인 (`kx-primary` #cc97ff)
- intro/thanks step에서는 진행률 X (질문 단계만)

## 3. DB 스키마 (Supabase migration)

```sql
-- supabase/migrations/2026-05-16-create-survey-responses.sql

create table public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Q1 식별
  age_range text,                -- '10대' | '20대' | '30대' | '40대' | '50대+'
  status text,                   -- '직장인' | '학생' | '자영업' | '프리랜서' | '취업준비' | '휴식 중' | '기타'

  -- Q2 자각 빈도
  awareness_freq text,           -- '거의 매일' | '자주' | '가끔' | '별로 없음' | '한 번도 없음'

  -- Q3 도구 사용 (멀티)
  tools_used text[],             -- ['사주/타로', 'MBTI', '심리 상담', '책/강의', '대화', '일기/글쓰기', '검색/유튜브', '시간', '아무것도 안 함']
  tools_other text,              -- 자유 입력

  -- Q4 비용
  cost_range text,               -- '0원' | '1만원 이하' | '1~5만원' | '5~10만원' | '10~30만원' | '30만원 이상'

  -- Q5 만족도
  best_tool text,                -- '사주/타로' | 'MBTI' | '심리 상담' | '책/강의' | '대화' | '일기/글쓰기' | '시간' | '도움 된 게 없음'
  best_satisfy int,              -- 1-5

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
  completion_seconds int         -- 시작~제출 소요 시간 (intro 첫 클릭 ~ 전송)
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

## 4. 파일 구조

### 4.1 신규 생성

| 파일 | 책임 |
|---|---|
| `supabase/migrations/2026-05-16-create-survey-responses.sql` | DB 스키마 |
| `lib/survey/types.ts` | TypeScript types — SurveyResponse, SurveyStep |
| `lib/survey/questions.ts` | 7 질문 옵션 정의 (UI 데이터 SSOT) |
| `lib/survey/storage.ts` | localStorage progress save/restore helpers |
| `app/gyeol/page.tsx` | 메인 클라이언트 컴포넌트 (단일 페이지 + step state) |
| `app/gyeol/layout.tsx` | metadata + OG (공유 카드용) |
| `app/gyeol/components/IntroStep.tsx` | step 'intro' — CONTOUR 로고 + 시작 버튼 |
| `app/gyeol/components/QuestionLayout.tsx` | 질문 단계 공통 wrapper (헤더 + 진행률 + 본문 + 이전/다음) |
| `app/gyeol/components/ProgressBar.tsx` | 상단 진행률 (현재/7) |
| `app/gyeol/components/Q1Step.tsx` ~ `Q7Step.tsx` | 7개 질문 단계 컴포넌트 |
| `app/gyeol/components/ThanksStep.tsx` | step 'thanks' — 감사 메시지 |
| `app/api/survey/route.ts` | POST 응답 저장 + Resend 확인 메일 |
| `app/admin/survey/page.tsx` | admin 대시보드 (목록 + 카운트 + CSV) |
| `app/api/admin/survey/route.ts` | admin GET 목록 + GET CSV export |

### 4.2 수정

| 파일 | 변경 |
|---|---|
| `app/components/DashboardShell.tsx` | `STANDALONE_PATHS`에 `/gyeol` 추가 (TopNav + 푸터 + 카카오 모두 숨김) |
| `app/admin/components/AdminSidebar.tsx` | 메뉴 끝에 "설문 응답" (`/admin/survey`) 추가 |

## 5. 클라이언트 동작 (`/gyeol`)

### 5.1 step 흐름

```ts
// app/gyeol/page.tsx
'use client';

type Step = 'intro' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'thanks';

const [step, setStep] = useState<Step>('intro');
const [response, setResponse] = useState<Partial<SurveyResponse>>({});
const [startedAt, setStartedAt] = useState<number | null>(null);
const [submitting, setSubmitting] = useState(false);

// 진입 시 localStorage 복구
useEffect(() => {
  const saved = loadProgress();  // lib/survey/storage
  if (saved) {
    setStep(saved.step);
    setResponse(saved.response);
    setStartedAt(saved.startedAt);
  }
}, []);

// step 변경마다 저장
useEffect(() => {
  if (step !== 'intro' && step !== 'thanks') {
    saveProgress({ step, response, startedAt: startedAt ?? Date.now() });
  }
}, [step, response, startedAt]);

// 제출
async function handleSubmit() {
  setSubmitting(true);
  const payload = {
    ...response,
    completion_seconds: startedAt ? Math.floor((Date.now() - startedAt) / 1000) : null,
    user_agent: navigator.userAgent,
    referrer: document.referrer || null,
    utm_source: new URLSearchParams(location.search).get('utm_source'),
    utm_medium: new URLSearchParams(location.search).get('utm_medium'),
    utm_campaign: new URLSearchParams(location.search).get('utm_campaign'),
  };
  const res = await fetch('/api/survey', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.ok) {
    clearProgress();
    setStep('thanks');
  }
  setSubmitting(false);
}
```

### 5.2 질문 페이지 디자인 (공통)

```
┌─────────────────────────────┐
│ [1/7] ━━━━━━━━━━━━━░░░░░    │  ← 상단 진행률
│                              │
│ 질문 텍스트                   │  ← question
│ (보조 설명 옵션)              │  ← subtitle
│                              │
│ [라디오/체크/입력 컴포넌트]    │  ← input
│                              │
│ [← 이전]    [다음 →]         │  ← navigation
└─────────────────────────────┘
```

- 배경: CSS gradient (검정 → kx-primary 살짝 보라 → 검정), PNG wave 모티브 SVG overlay (선택)
- 카드 내부: `bg-white/[0.02]` + `border-white/15` + `backdrop-blur-sm`
- 텍스트: kx-display 폰트 (Jua)
- 라디오/체크: 커스텀 스타일 (보라 활성)
- 버튼: 보라 `kx-btn-primary`

### 5.3 step별 validation

- Q1: 두 드롭다운 모두 선택 → 다음 활성
- Q2: 라디오 선택 → 다음
- Q3: 1개 이상 체크 또는 기타 입력 → 다음 (또는 모두 선택 안 해도 옵션? — 사용자 결정 필요)
- Q4: 라디오 → 다음
- Q5: 두 라디오 모두 → 다음
- Q6: 빈 칸 허용 (skippable)
- Q7: "됐어요" 선택 시 즉시 전송 / "네 알려주세요" 선택 시 이메일 입력 후 전송

→ MVP 결정: **Q3 (도구 사용)은 1개 이상 필수**. "아무것도 안 함" 옵션이 있으므로 빈 응답 없음. Q6 (자유 의견)는 빈 칸 허용.

## 6. POST `/api/survey` (응답 저장 + 메일)

```ts
// app/api/survey/route.ts
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  const body = await request.json();

  // 1) 기본 validation
  if (!body.age_range || !body.status || !body.awareness_freq) {
    return NextResponse.json({ error: '필수 응답 누락' }, { status: 400 });
  }

  // 2) supabase INSERT (service role — RLS 우회)
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('survey_responses')
    .insert({
      age_range: body.age_range,
      status: body.status,
      awareness_freq: body.awareness_freq,
      tools_used: body.tools_used ?? null,
      tools_other: body.tools_other ?? null,
      cost_range: body.cost_range ?? null,
      best_tool: body.best_tool ?? null,
      best_satisfy: body.best_satisfy ?? null,
      free_opinion: body.free_opinion ?? null,
      email: body.email ?? null,
      user_agent: body.user_agent ?? null,
      referrer: body.referrer ?? null,
      utm_source: body.utm_source ?? null,
      utm_medium: body.utm_medium ?? null,
      utm_campaign: body.utm_campaign ?? null,
      completion_seconds: body.completion_seconds ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'DB 저장 실패' }, { status: 500 });
  }

  // 3) Resend 즉시 확인 메일 (이메일 입력 시만)
  if (body.email && /\S+@\S+\.\S+/.test(body.email)) {
    try {
      await resend.emails.send({
        from: '쟁승메이드 <noreply@jaengseung-made.com>',  // 검증 도메인 사용
        to: body.email,
        subject: 'CONTOUR 설문 참여 감사드립니다',
        html: `<p>안녕하세요,</p>
               <p>설문에 참여해주셔서 감사합니다. 결과는 추후 공유드리겠습니다.</p>
               <p>— 쟁승메이드</p>`,
      });
      // 발송 성공 마킹
      await supabase
        .from('survey_responses')
        .update({ email_confirmation_sent: true })
        .eq('id', data.id);
    } catch (mailErr) {
      // 메일 실패는 응답 저장 성공에 영향 X — 단순 로그
      console.error('Resend 메일 발송 실패:', mailErr);
    }
  }

  return NextResponse.json({ ok: true, id: data.id });
}
```

**오류 처리**:
- DB 실패 → 500 → 사용자 UI "잠시 후 다시 시도" 표시 + 응답은 localStorage에 그대로 유지 (재시도 가능)
- Resend 실패 → 응답 저장은 성공, 메일만 fail. 사용자에게 영향 X. admin이 향후 batch로 재발송 가능.

## 7. Admin `/admin/survey` (MVP)

### 7.1 GET `/api/admin/survey?range=all|today|week`

```ts
// app/api/admin/survey/route.ts
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

export async function GET(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const range = url.searchParams.get('range') ?? 'all';
  const format = url.searchParams.get('format') ?? 'json';

  const supabase = createAdminClient();
  let query = supabase.from('survey_responses').select('*').order('created_at', { ascending: false });

  if (range === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    query = query.gte('created_at', today.toISOString());
  } else if (range === 'week') {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    query = query.gte('created_at', weekAgo.toISOString());
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (format === 'csv') {
    const csv = toCsv(data ?? []);
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="contour-survey-${range}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  // 기본 통계
  const total = data?.length ?? 0;
  const stats = computeStats(data ?? []);

  return NextResponse.json({ total, stats, responses: data ?? [] });
}

function toCsv(rows: any[]): string {
  if (rows.length === 0) return '';
  const headers = ['id', 'created_at', 'age_range', 'status', 'awareness_freq', 'tools_used', 'tools_other', 'cost_range', 'best_tool', 'best_satisfy', 'free_opinion', 'email', 'user_agent', 'referrer', 'utm_source', 'completion_seconds'];
  const csvRows = [headers.join(',')];
  for (const r of rows) {
    csvRows.push(headers.map((h) => {
      const v = r[h];
      if (v == null) return '';
      if (Array.isArray(v)) return `"${v.join('|').replace(/"/g, '""')}"`;
      return `"${String(v).replace(/"/g, '""').replace(/\n/g, ' ')}"`;
    }).join(','));
  }
  return csvRows.join('\n');
}

function computeStats(rows: any[]) {
  // 각 질문별 분포 카운트
  const counts = (key: string) => rows.reduce((acc, r) => {
    const v = r[key];
    if (v != null) acc[v] = (acc[v] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const satisfyAvg = rows
    .filter((r) => r.best_satisfy != null)
    .reduce((sum, r) => sum + r.best_satisfy, 0) / Math.max(1, rows.filter((r) => r.best_satisfy != null).length);

  return {
    awareness_freq: counts('awareness_freq'),
    cost_range: counts('cost_range'),
    best_tool: counts('best_tool'),
    age_range: counts('age_range'),
    satisfy_avg: satisfyAvg.toFixed(2),
    email_rate: (rows.filter((r) => r.email).length / Math.max(1, rows.length) * 100).toFixed(1),
    completion_seconds_median: median(rows.map((r) => r.completion_seconds).filter(Boolean)),
  };
}

function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
```

### 7.2 admin/survey/page.tsx 레이아웃

```
┌──────────────────────────────────────────┐
│ 설문 응답                                  │
│ 총 N건 · 오늘 +M건 · 평균 완료 X초          │
├──────────────────────────────────────────┤
│ [전체] [오늘] [이번 주]  [📥 CSV 내보내기]   │
├──────────────────────────────────────────┤
│ 카운트 분포                                │
│  Q2 자각 빈도: 거의 매일 X / 자주 Y / ...   │
│  Q4 비용:     0원 X / 10만원+ Y / ...      │
│  Q5 만족도 평균: 3.2점                      │
│  Q7 이메일률: 28%                          │
├──────────────────────────────────────────┤
│ 응답 리스트                                │
│ ┌────────────────────────────────────┐   │
│ │ 시각 │ 나이 │ Q4 비용 │ Q5 만족 │   │   │
│ │     │ 상황 │         │       │ 자유의견│   │
│ │     │     │         │       │ 이메일 │   │
│ └────────────────────────────────────┘   │
│ ... (행 클릭 시 상세 모달)                  │
└──────────────────────────────────────────┘
```

기능:
- 필터: `range=all|today|week`
- CSV: format=csv (Excel/Google Sheets 직접 import)
- 행 클릭 → modal 또는 expand → 전체 7 답변 + 메타데이터
- 자유의견(Q6) 컬럼은 텍스트 일부 미리보기 + 행 클릭 시 전문

## 8. /gyeol Standalone Shell

`DashboardShell.tsx` 수정:

```tsx
const STANDALONE_PATHS = ['/login', '/signup', '/admin', '/gyeol'];

// 기존:
// const isStandalone = STANDALONE_PATHS.some((p) => pathname.startsWith(p));
// if (isStandalone) return <>{children}</>;
```

결과: `/gyeol` 진입 시 TopNav + PublicShell footer + 카카오 플로팅 모두 노출 안 됨. 풀스크린 설문 UI에 집중.

## 9. AdminSidebar 메뉴 추가

`app/admin/components/AdminSidebar.tsx` 의 NAV_ITEMS 배열 끝에 추가:

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

(체크박스 + 클립보드 아이콘 — 설문 의미)

## 10. SEO + 메타

`app/gyeol/layout.tsx`:

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
        url: 'https://jaengseung-made.com/og-gyeol.png',  // 옵션: 새로 만들거나 기존 og-image 재사용
        width: 1200,
        height: 630,
        alt: 'CONTOUR',
      },
    ],
  },
  robots: {
    index: false,  // PMF 검증 단계 — 색인 안 함 (특정 채널 공유로만 진입)
    follow: false,
  },
};
```

⚠️ **`robots: noindex`** — PMF 검증 단계라 구글 검색 색인 제외 (의도된 채널 외 진입 차단). 향후 정식 마케팅 시점에 `index: true` 로 변경.

## 11. UTM·Referrer 추적

spec markdown의 9 채널 × 효율 측정 기반.

각 채널 공유 URL 예시:
- 인스타: `https://jaengseung-made.com/gyeol?utm_source=instagram&utm_medium=story&utm_campaign=v1`
- 카톡: `https://jaengseung-made.com/gyeol?utm_source=kakao&utm_medium=direct`
- 유튜브 쇼츠: `https://jaengseung-made.com/gyeol?utm_source=youtube&utm_medium=shorts`
- 메타 광고: `https://jaengseung-made.com/gyeol?utm_source=meta&utm_medium=cpc&utm_campaign=test1`

`/api/survey` POST 시 URL의 utm 파라미터 + `document.referrer` 자동 저장 → admin에서 채널별 CPM 분석.

## 12. 보안 + Rate Limit

- POST `/api/survey`: 익명 허용 (불특정 다수). CSRF 토큰 없음 (공개 설문 표준).
- **MVP는 rate limit 없음** — spam 발생 시 추가:
  - Vercel function 자체 IP rate limit (Pro 플랜)
  - 또는 supabase에 1 IP/분당 5건 제한 트리거
  - 또는 단순 Cloudflare Turnstile 등 invisible captcha (Phase 2)
- `/api/admin/survey`: 기존 admin HMAC cookie (`verifyAdminTokenNode`)
- supabase RLS: anon은 INSERT만, SELECT는 service role(admin) 전용

## 13. 회귀 영향 (다른 라우트)

- `/admin/*`: 새 메뉴 추가만, 기존 영향 X
- 기타 모든 라우트: 영향 X
- `DashboardShell.STANDALONE_PATHS`에 `/gyeol` 추가만 — `/login`, `/signup`, `/admin`은 변경 X

## 14. 의도적 제외 (백로그 / 별도 plan)

- **차트 시각화** (Recharts/Chart.js) — 응답 50건 누적 후
- **Q6 자발어 키워드 추출 + 워드 클라우드** — GPT API 또는 한글 형태소 분석기. 별도 plan
- **Pull/Push 게이트 자동 판정 UI** — admin 대시보드 확장
- **마케팅 동의 박스** — 개인정보보호법 검토 후
- **이메일 batch 발송 UI** — 향후 결과 알림 시점에 admin 메뉴 추가 (현재는 Resend dashboard 직접 사용)
- **Rate limit / spam 방어** — spam 발생 시 추가
- **NAS Synology Mail Server 자체 호스팅** — Resend 의존 제거, 무료 호스팅 (P3+)
- **/gyeol 단일 페이지의 URL 변경** — 향후 정식 출시 시 `/contour` 또는 다른 영문 단어로 rebrand 가능 (redirect 필요)

## 15. CEO 수동 작업 (배포 후)

1. **supabase migration 적용** — SQL Editor에서 `2026-05-16-create-survey-responses.sql` 실행 → 테이블 + 인덱스 + RLS
2. **Resend domain 검증** — `jaengseung-made.com` 또는 본인 사용 도메인이 Resend에 검증되어 있어야 메일 발송. (이미 검증 상태이면 skip)
3. **URL 채널 공유** — spec markdown의 9 채널 × UTM 파라미터로 공유 시작
4. **OG 이미지 (선택)** — `/og-gyeol.png` 추가 또는 기존 og-image 재사용 (URL 그대로)

## 16. 다음 단계

1. 이 spec 검토 (사용자)
2. 승인 → `superpowers:writing-plans` 로 implementation plan 작성
3. plan 작성 후 → `superpowers:subagent-driven-development` 로 task별 실행
4. 배포 후 → CEO §15 수동 작업 + 채널 공유 시작
