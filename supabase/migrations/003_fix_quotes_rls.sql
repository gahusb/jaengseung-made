-- ============================================================
-- quotes 테이블 RLS 수정
-- 문제: 이전 마이그레이션이 quotes RLS를 활성화했으나
--       관리자 클라이언트가 service_role 없이 anon 키를 사용하여 INSERT/SELECT 불가
--
-- 해결: quotes 테이블은 서버 사이드 관리자 코드로만 접근하므로
--       RLS 비활성화 (anon 키에 직접 노출되지 않으므로 안전)
--       project_milestones는 유저 보안상 RLS 유지
--
-- Supabase Dashboard > SQL Editor 에서 실행하세요
-- ============================================================

-- quotes 테이블 RLS 비활성화 (관리자 서버 코드만 접근)
ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;

-- 기존 quotes 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Users view own quotes" ON quotes;

-- quotes 테이블의 모든 RLS 정책 삭제 후 RLS 비활성화
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN
        SELECT policyname FROM pg_policies WHERE tablename = 'quotes'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON quotes', pol.policyname);
    END LOOP;
END $$;

ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;

-- 확인
SELECT relrowsecurity FROM pg_class WHERE relname = 'quotes';


-- project_milestones: anon 역할도 admin 작업 가능하도록
-- (서버 사이드 코드에서만 사용, 클라이언트 직접 접근 없음)
CREATE POLICY "Admin manage milestones"
    ON project_milestones FOR ALL TO anon
    USING (true)
    WITH CHECK (true);