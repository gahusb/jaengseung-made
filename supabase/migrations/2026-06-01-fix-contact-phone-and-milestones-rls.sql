-- ============================================================
-- 코드 점검 수정 (2026-06-01)
--  ① contact_requests.phone 컬럼 누락 → 문의 DB 저장 조용한 실패 방지
--  ② project_milestones 의 위험한 anon 전체 CRUD 정책 제거 (보안)
-- Supabase Dashboard > SQL Editor 에서 실행하세요
-- ============================================================

-- ── ① contact_requests.phone 보장 ──────────────────────────
-- app/api/contact/route.ts 가 phone 을 INSERT 하지만 schema 에 컬럼이 없으면
-- INSERT 가 PGRST204 로 실패한다. contact route 는 DB 오류를 try/catch 로
-- 삼키므로(이메일은 정상 발송) 그동안 contact_requests 저장이 조용히 실패했을 수 있다.
-- 이미 컬럼이 있으면 IF NOT EXISTS 로 무해.
ALTER TABLE public.contact_requests ADD COLUMN IF NOT EXISTS phone text;

-- ── ② project_milestones anon 정책 제거 ────────────────────
-- 003_fix_quotes_rls.sql 이 추가한 정책:
--     CREATE POLICY "Admin manage milestones" ON project_milestones
--       FOR ALL TO anon USING (true) WITH CHECK (true);
-- → 비로그인(anon)이 PostgREST 로 모든 고객 마일스톤을 읽기/수정/삭제 가능한 보안 구멍.
-- 실제 접근은 전부 service_role(서버 createAdminClient: /api/admin/milestones,
-- /api/projects)로 이뤄지고 service_role 은 RLS 를 우회하므로 이 정책은 불필요하다.
-- 002_project_milestones.sql 의 authenticated 본인 조회 정책은 유지된다.
DROP POLICY IF EXISTS "Admin manage milestones" ON public.project_milestones;

-- (RLS 자체는 002 에서 이미 ENABLE 되어 있음 — 유지)
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

-- ── 확인 ───────────────────────────────────────────────────
-- phone 컬럼 존재 / project_milestones 정책 목록
SELECT column_name FROM information_schema.columns
 WHERE table_schema = 'public' AND table_name = 'contact_requests' AND column_name = 'phone';
SELECT policyname, roles, cmd FROM pg_policies
 WHERE schemaname = 'public' AND tablename = 'project_milestones';
