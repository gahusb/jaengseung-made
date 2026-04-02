-- ============================================================
-- 질문지 응답 저장 테이블
-- 목적: 고객이 작성한 요구사항 질문지 응답을 저장
-- ============================================================

CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  questionnaire_type VARCHAR(100) NOT NULL DEFAULT 'ebay-tool',
  client_name VARCHAR(200),
  client_email VARCHAR(300),
  client_phone VARCHAR(50),
  responses JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'submitted',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_questionnaire_type ON questionnaire_responses(questionnaire_type);
CREATE INDEX IF NOT EXISTS idx_questionnaire_status ON questionnaire_responses(status);
CREATE INDEX IF NOT EXISTS idx_questionnaire_created ON questionnaire_responses(created_at DESC);

-- RLS 비활성화 (서버 사이드에서만 접근, service_role 사용)
ALTER TABLE questionnaire_responses DISABLE ROW LEVEL SECURITY;
