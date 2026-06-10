-- 2026-06-11 리뉴얼: 레거시 서비스 숨김 토글 시드
-- service_settings: 이미 있으면 숨김 상태로 갱신 (2026-06 리뉴얼 의도 강제) — 멱등
INSERT INTO service_settings (id, name, description, is_active, order_index)
VALUES
  ('saju',     'AI 사주 분석',        '사주 입력 및 AI 해석 (레거시)',        false, 101),
  ('music',    'AI 음악 팩',          '음악 가이드 패키지·샘플·스튜디오',      false, 102),
  ('gyeol',    'CONTOUR 설문',        '/gyeol PMF 설문',                      false, 103),
  ('packages', 'SaaS 제품 허브(구)',  '구 /packages 페이지',                  false, 104),
  ('lotto',    '로또 추천',           '로또 번호 추천 노출',                   false, 105)
ON CONFLICT (id) DO UPDATE SET
  is_active   = EXCLUDED.is_active,
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  updated_at  = now();
