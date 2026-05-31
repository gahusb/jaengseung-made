-- ============================================================
-- RLS 보안 이슈 해결 (Supabase Linter: "RLS Disabled in Public")
-- 대상: public.quotes, public.spatial_ref_sys
-- 작성: 2026-05-31
-- Supabase Dashboard > SQL Editor 에서 실행하세요
-- ============================================================

-- ── 1) public.quotes ───────────────────────────────────────
-- 앱의 모든 quotes 접근은 service_role(서버 lib/supabase/admin.ts → createAdminClient)로
-- 이뤄지며, service_role은 RLS를 우회한다. 따라서 RLS를 켜도 서버 API
-- (/api/admin/quotes, /api/quote/[token], /api/projects 등)는 전부 정상 동작하고,
-- anon/authenticated의 직접(PostgREST) 접근만 차단된다.
--
-- 003_fix_quotes_rls.sql 에서 DISABLE 했던 이유("관리자 클라이언트가 anon 키 사용")는
-- 현재 service_role 키로 전환되어 무효이므로 다시 ENABLE 한다.
-- (idempotent: 이미 켜져 있어도 무해)
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own quotes" ON public.quotes;
CREATE POLICY "Users view own quotes"
  ON public.quotes FOR SELECT TO authenticated
  USING (user_id = auth.uid());


-- ── 2) public.spatial_ref_sys → PostGIS 제거로 해소 ─────────
-- spatial_ref_sys 는 PostGIS extension 소유라 RLS 를 켤 수 없다:
--      ERROR: 42501: must be owner of table spatial_ref_sys
-- 본 앱은 PostGIS / geometry / spatial_ref_sys 를 전혀 사용하지 않으므로
-- (schema.sql·앱 코드 grep 0건) PostGIS extension 자체를 제거한다.
-- → spatial_ref_sys 테이블이 함께 사라져 linter 경고가 근본적으로 해소된다.
-- ※ geometry/geography 컬럼 의존 0건 확인 → CASCADE 안전.
-- ※ SQL 실행이 권한 거부되면 Dashboard > Database > Extensions > "postgis" 토글 OFF.
DROP EXTENSION IF EXISTS postgis CASCADE;

-- 확인 (둘 다 0 row 가 아니라 quotes=1row(true), postgis=0row 면 성공)
SELECT relname AS table_name, relrowsecurity AS rls_enabled
FROM pg_class WHERE relname = 'quotes';
SELECT extname FROM pg_extension WHERE extname = 'postgis';  -- 0 rows = 제거 완료
