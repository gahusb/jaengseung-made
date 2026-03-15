-- ─── 구독 관리 테이블 ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id           uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid         NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id   text         NOT NULL REFERENCES public.products(id),
  order_id     uuid         REFERENCES public.orders(id),
  status       text         NOT NULL DEFAULT 'active',   -- 'active' | 'cancelled' | 'expired'
  auto_renew   boolean      NOT NULL DEFAULT false,       -- Toss 빌링키 연동 전까지 false
  started_at   timestamptz  NOT NULL DEFAULT now(),
  expires_at   timestamptz  NOT NULL,
  cancelled_at timestamptz,
  billing_key  text,                                      -- Toss 자동결제 빌링키 (향후)
  created_at   timestamptz  NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_select_own" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "subscriptions_update_own" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- 인덱스
CREATE INDEX IF NOT EXISTS subscriptions_user_status ON public.subscriptions (user_id, status);
CREATE INDEX IF NOT EXISTS subscriptions_expires_at ON public.subscriptions (expires_at) WHERE status = 'active';

-- ─── 기존 paid lotto orders → subscriptions 마이그레이션 ───────────────────────
INSERT INTO public.subscriptions (user_id, product_id, order_id, status, started_at, expires_at)
SELECT
  o.user_id,
  o.product_id,
  o.id,
  CASE
    WHEN (o.created_at + INTERVAL '31 days') < now() THEN 'expired'
    ELSE 'active'
  END,
  o.created_at,
  o.created_at + INTERVAL '31 days'
FROM public.orders o
WHERE o.status = 'paid'
  AND o.product_id IN ('lotto_gold', 'lotto_platinum', 'lotto_diamond')
ON CONFLICT DO NOTHING;
