-- ─── 로또 번호 히스토리 테이블 ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lotto_history (
  id          bigserial     PRIMARY KEY,
  user_id     uuid          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  numbers     integer[]     NOT NULL,
  source      text          NOT NULL DEFAULT 'client', -- 'nas' | 'client'
  plan_id     text          NOT NULL,
  created_at  timestamptz   NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE lotto_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lotto_history_select_own" ON lotto_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "lotto_history_insert_own" ON lotto_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 인덱스
CREATE INDEX IF NOT EXISTS lotto_history_user_created ON lotto_history (user_id, created_at DESC);
