-- ============================================================
-- 이베이 부품 검색 이력 테이블
-- 목적: 검색 결과 캐싱 + 사용자별 검색 이력 관리
-- ============================================================

CREATE TABLE IF NOT EXISTS ebay_search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  part_number VARCHAR(100) NOT NULL,
  part_name VARCHAR(500),
  result JSONB NOT NULL,
  sources_checked TEXT[] DEFAULT '{}',
  processing_time VARCHAR(20),
  ai_model VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_ebay_search_part_number ON ebay_search_history(part_number);
CREATE INDEX IF NOT EXISTS idx_ebay_search_user ON ebay_search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ebay_search_created ON ebay_search_history(created_at DESC);

-- RLS (로그인 사용자는 본인 이력만 조회)
ALTER TABLE ebay_search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own search history"
  ON ebay_search_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own search history"
  ON ebay_search_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 서버 사이드 관리자 작업은 service_role 키를 사용하여 RLS를 우회합니다
-- anon 역할에 전체 권한을 부여하지 않습니다
