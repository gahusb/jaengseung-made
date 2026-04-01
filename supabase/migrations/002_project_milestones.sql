-- ============================================================
-- 프로젝트 진행 단계 관리 시스템
-- Supabase Dashboard > SQL Editor 에서 실행하세요
-- ============================================================

-- 1. quotes 테이블에 user_id 컬럼 추가
ALTER TABLE quotes
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);

-- 2. project_milestones 테이블 생성
CREATE TABLE IF NOT EXISTS project_milestones (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id     uuid        NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  step_number  int         NOT NULL DEFAULT 1,
  title        text        NOT NULL,
  description  text        NOT NULL DEFAULT '',
  status       text        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'in_progress', 'completed')),
  note         text        NOT NULL DEFAULT '',
  completed_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_milestones_quote_id
  ON project_milestones(quote_id);

-- 3. RLS
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;

-- 로그인 사용자는 자신의 quotes에 연결된 milestones 조회 가능
CREATE POLICY "Users view own project milestones"
  ON project_milestones FOR SELECT TO authenticated
  USING (
    quote_id IN (SELECT id FROM quotes WHERE user_id = auth.uid())
  );

-- quotes: 사용자가 자신에게 연결된 견적서 조회 가능
-- (기존 RLS 없는 경우에만 실행)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'quotes' AND policyname = 'Users view own quotes'
  ) THEN
    ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users view own quotes"
      ON quotes FOR SELECT TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;
