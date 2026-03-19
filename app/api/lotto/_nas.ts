import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const LOTTO_PRODUCT_IDS = ['lotto_gold', 'lotto_platinum', 'lotto_diamond', 'lotto_annual'];

function nasHeaders() {
  const h: Record<string, string> = {};
  if (process.env.NAS_LOTTO_API_KEY) h['Authorization'] = `Bearer ${process.env.NAS_LOTTO_API_KEY}`;
  return h;
}

function nasBase() {
  const base = process.env.NAS_LOTTO_API_URL;
  if (!base) throw new Error('NAS_URL_NOT_CONFIGURED');
  return base;
}

export async function nasGet(path: string, timeoutMs = 25000): Promise<unknown> {
  const res = await fetch(`${nasBase()}${path}`, {
    headers: nasHeaders(), signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`NAS_${res.status}`);
  return res.json();
}

export async function nasPost(path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${nasBase()}${path}`, {
    method: 'POST',
    headers: { ...nasHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(`NAS_${res.status}`);
  return res.json();
}

export async function nasPut(path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${nasBase()}${path}`, {
    method: 'PUT',
    headers: { ...nasHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(`NAS_${res.status}`);
  return res.json();
}

export async function nasDelete(path: string): Promise<unknown> {
  const res = await fetch(`${nasBase()}${path}`, {
    method: 'DELETE', headers: nasHeaders(), signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(`NAS_${res.status}`);
  return res.json();
}

export interface AuthResult { userId: string; plan: string; }

export async function requireSubscription(): Promise<AuthResult | NextResponse> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

  const { data: sub } = await supabase
    .from('subscriptions').select('product_id')
    .eq('user_id', user.id).eq('status', 'active')
    .in('product_id', LOTTO_PRODUCT_IDS).maybeSingle();
  if (sub) return { userId: user.id, plan: sub.product_id };

  const ago31 = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
  const { data: order } = await supabase
    .from('orders').select('product_id')
    .eq('user_id', user.id).eq('status', 'paid')
    .in('product_id', LOTTO_PRODUCT_IDS)
    .gte('created_at', ago31)
    .order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (order) return { userId: user.id, plan: order.product_id };

  return NextResponse.json({ error: 'NOT_SUBSCRIBED' }, { status: 403 });
}

export function handleNasError(err: unknown): NextResponse {
  const e = err as { name?: string };
  if (e?.name === 'TimeoutError') return NextResponse.json({ error: 'NAS_TIMEOUT' }, { status: 504 });
  console.error('[NAS]', err);
  return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
}
