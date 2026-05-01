-- Phase 2: pack_files 테이블 — Music 팩 자료 메타데이터 SSOT

create table public.pack_files (
  id uuid primary key default gen_random_uuid(),
  min_tier text not null check (min_tier in ('starter', 'pro', 'master')),
  label text not null,
  file_path text not null unique,
  filename text not null,
  size_bytes bigint not null,
  sort_order int not null default 0,
  uploaded_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_pack_files_tier on public.pack_files(min_tier, sort_order)
  where deleted_at is null;

alter table public.pack_files enable row level security;

-- 일반 사용자 직접 SELECT 차단. /api/packs/* 라우트가 service role로 조회.
-- (RLS enabled + 정책 미정의 → 모든 anon/authenticated SELECT 거부)
