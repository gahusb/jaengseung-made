-- 2026-06-12 Phase 3: 외주 고객 포털
-- (1) contact_requests 확장
ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS public_token text;
ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS project_type text;
ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS budget text;
ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS timeline text;
ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 기존 행 토큰 백필 (멱등 — NULL만)
UPDATE contact_requests SET public_token = gen_random_uuid()::text WHERE public_token IS NULL;

ALTER TABLE contact_requests ALTER COLUMN public_token SET DEFAULT gen_random_uuid()::text;
CREATE UNIQUE INDEX IF NOT EXISTS idx_contact_requests_public_token_unique ON contact_requests (public_token);

-- 상태 머신 CHECK (레거시 3종 포함 8종)
ALTER TABLE contact_requests DROP CONSTRAINT IF EXISTS contact_requests_status_check;
ALTER TABLE contact_requests ADD CONSTRAINT contact_requests_status_check
  CHECK (status IN ('pending','reviewing','quoted','accepted','on_hold','in_progress','completed','cancelled'));

-- (2) quotes ↔ contact_requests 연결
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS contact_request_id uuid REFERENCES contact_requests(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_quotes_contact_request ON quotes (contact_request_id);

-- (3) quotes.public_token 컬럼 보장 (live DB에 직접 생성된 경우 대비)
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS public_token text;
ALTER TABLE quotes ALTER COLUMN public_token SET DEFAULT gen_random_uuid()::text;
UPDATE quotes SET public_token = gen_random_uuid()::text WHERE public_token IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_quotes_public_token_unique ON quotes (public_token);
