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
