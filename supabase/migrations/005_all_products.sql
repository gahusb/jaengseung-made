-- ============================================================
-- Migration 005: lib/products.ts의 모든 상품을 DB에 등록
-- Supabase SQL Editor에서 실행하세요
-- ============================================================

-- 로또 상품 비공개 처리 (PG 심사 정책)
delete from public.products where category = 'lotto';

insert into public.products (id, name, description, price, category) values
  -- 사주
  ('saju_detail',              'AI 사주 상세 리포트',            'AI 12가지 항목 상세 해석',                           1000, 'saju'),
  -- 주식
  ('stock_starter_install',  '주식 스타터 설치',              '1개 종목 자동 매매 설치',                        99000, 'stock'),
  ('stock_pro_install',      '주식 프로 설치',                '5개 종목 + 전략 커스터마이징 설치',              199000, 'stock'),
  ('stock_starter_monthly',  '주식 스타터 월 유지비',          '스타터 월 유지보수 비용',                        29000, 'stock'),
  ('stock_pro_monthly',      '주식 프로 월 유지비',            '프로 월 유지보수 비용',                          49000, 'stock'),
  -- 프롬프트
  ('prompt_single',          '프롬프트 단건 설계',             '업무 특화 프롬프트 1개 맞춤 설계',               30000, 'prompt'),
  ('prompt_business',        '프롬프트 비즈니스 패키지',       '업무 유형별 프롬프트 5개 설계',                  99000, 'prompt'),
  ('prompt_team',            '프롬프트 팀/기업 패키지',        '팀 전체 프롬프트 시스템 구축',                  249000, 'prompt'),
  ('prompt_image_gen',       'AI 이미지 생성 마스터 프롬프트', '50종 이미지 생성 프롬프트',                      12900, 'prompt'),
  ('prompt_resume',          'AI 자소서·이력서 첨삭 프롬프트', '7가지 유형별 자소서 프롬프트',                    9900, 'prompt'),
  ('prompt_email',           '비즈니스 이메일 마스터 프롬프트', '20종 비즈니스 이메일 프롬프트',                  10900, 'prompt'),
  ('prompt_marketing',       '마케팅 카피·SNS 콘텐츠 프롬프트', '플랫폼별 카피 프롬프트 30종',                   12900, 'prompt'),
  ('prompt_report',          '업무 보고서·기획서 작성 프롬프트', '보고서/기획서/회의록 프롬프트 25종',            10900, 'prompt'),
  -- 업무 자동화
  ('automation_basic',       '단순 업무 자동화',               '단일 반복 업무 자동화 1건 개발',                 50000, 'automation'),
  ('automation_advanced',    '업무 자동화 심화',               '복합 업무 자동화 개발 · RPA·API 연동',          150000, 'automation'),
  -- 홈페이지
  ('website_starter',        '홈페이지 스타터 패키지',         '5페이지 이내 반응형 홈페이지',                  200000, 'website'),
  ('website_business',       '홈페이지 비즈니스 패키지',       '10페이지 이내 · 관리자 페이지 · SEO',         1000000, 'website'),
  ('website_premium',        '홈페이지 프리미엄 패키지',       '페이지 수 무제한 · 결제/회원 시스템',         2000000, 'website'),
  -- AI 키트
  ('ai_kit_monthly',         'AI 자동화 월 구독 키트',         '소상공인·직장인 AI 자동화 도구 월 구독',        19900, 'ai_kit')
on conflict (id) do update set
  name        = excluded.name,
  description = excluded.description,
  price       = excluded.price,
  category    = excluded.category;
