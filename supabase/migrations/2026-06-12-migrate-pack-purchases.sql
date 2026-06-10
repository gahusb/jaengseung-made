-- 2026-06-12 Phase 2: 음악 팩 구매(contact_requests 문자열) → orders 이관
-- 대상: status='completed' AND user_id 보유 AND '구매 신청:' + '· 입문/프로/마스터' 패턴
-- (user_id 없는 행은 현행 다운로드 시스템도 서빙하지 않으므로 이관 대상 아님)
INSERT INTO orders (user_id, product_id, amount, status, metadata, created_at)
SELECT
  cr.user_id,
  p.id,
  p.price,
  'paid',
  jsonb_build_object(
    'method', 'bank_transfer',
    'source_contact_id', cr.id::text,
    'migrated_at', now()::text,
    'original_service', cr.service
  ),
  cr.created_at
FROM contact_requests cr
JOIN products p ON p.id = CASE
  WHEN cr.service LIKE '%· 입문'   THEN 'music_starter'
  WHEN cr.service LIKE '%· 프로'   THEN 'music_pro'
  WHEN cr.service LIKE '%· 마스터' THEN 'music_master'
END
WHERE cr.status = 'completed'
  AND cr.user_id IS NOT NULL
  AND cr.service LIKE '구매 신청:%'
  AND NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.metadata->>'source_contact_id' = cr.id::text
  );

-- 검증: 이관 건수 = 대상 건수 확인
-- SELECT count(*) FROM orders WHERE metadata ? 'source_contact_id';
-- SELECT count(*) FROM contact_requests WHERE status='completed' AND user_id IS NOT NULL AND service LIKE '구매 신청:%' AND (service LIKE '%· 입문' OR service LIKE '%· 프로' OR service LIKE '%· 마스터');
