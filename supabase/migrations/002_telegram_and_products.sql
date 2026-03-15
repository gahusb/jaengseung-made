-- ============================================================
-- Migration 002: 텔레그램 연동 + 신규 로또 상품 추가
-- Supabase SQL Editor에서 실행하세요
-- ============================================================

-- ① profiles에 텔레그램 필드 추가
alter table public.profiles
  add column if not exists telegram_chat_id       text,
  add column if not exists telegram_connect_token text,
  add column if not exists telegram_token_expires timestamptz;

-- ② 신규 로또 상품 추가 (이미 있으면 가격/설명 업데이트)
insert into public.products (id, name, description, price, category) values
  ('lotto_gold',     '로또 골드 플랜',     '매주 1회 번호 추천 · 이메일 발송',                  900, 'lotto'),
  ('lotto_platinum', '로또 플래티넘 플랜', '매주 3회 번호 + 상세 분석 + 텔레그램 알림',         2900, 'lotto'),
  ('lotto_diamond',  '로또 다이아 플랜',   '횟수 무제한 + 전체 기능 + 연간 패턴 리포트',        9900, 'lotto')
on conflict (id) do update set
  name        = excluded.name,
  description = excluded.description,
  price       = excluded.price;

-- 구버전 상품 비활성화 (데이터 보존, 신규 결제만 막음)
update public.products
  set is_active = false
  where id in ('lotto_basic', 'lotto_premium', 'lotto_annual');
