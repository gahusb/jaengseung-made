-- 2026-06-12 Phase 2: products 범용 제품 시스템 확장
-- (1) products 컬럼 확장
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_long text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS features jsonb;            -- string[] 형태
ALTER TABLE products ADD COLUMN IF NOT EXISTS pay_method text NOT NULL DEFAULT 'bank_transfer';
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_listed boolean NOT NULL DEFAULT false;  -- /products 카탈로그 노출
ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

-- (2) 음악 팩 제품 시드 (다운로드 권한 매핑용 — 카탈로그 비노출 is_listed=false)
INSERT INTO products (id, name, description, price, category, is_active, is_listed)
VALUES
  ('music_starter', 'AI 음악 생성 개발 가이드 (입문)',   '음악 팩 입문 — 레거시', 39000,  'software', true, false),
  ('music_pro',     'AI 음악 생성 개발 가이드 (프로)',   '음악 팩 프로 — 레거시', 99000,  'software', true, false),
  ('music_master',  'AI 음악 생성 개발 가이드 (마스터)', '음악 팩 마스터 — 레거시', 149000, 'software', true, false)
ON CONFLICT (id) DO NOTHING;

-- (3) pack_files → 제품 연결
ALTER TABLE pack_files ADD COLUMN IF NOT EXISTS product_id text REFERENCES products(id);
UPDATE pack_files SET product_id = 'music_' || min_tier WHERE product_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_pack_files_product ON pack_files (product_id) WHERE deleted_at IS NULL;
