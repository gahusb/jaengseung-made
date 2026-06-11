import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminTokenNode } from '@/lib/admin-auth';

export const runtime = 'nodejs';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token && verifyAdminTokenNode(token);
}

const ID_RE = /^[a-z0-9_]{2,40}$/;

function sanitizeFeatures(input: unknown): string[] | undefined {
  if (!Array.isArray(input)) return undefined;
  return input.filter((v): v is string => typeof v === 'string');
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order')
    .order('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data ?? [] });
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, name, description, description_long, price, features, is_listed, sort_order } = body;

  if (typeof id !== 'string' || !ID_RE.test(id)) {
    return NextResponse.json({ error: 'id는 영소문자/숫자/언더스코어 2-40자' }, { status: 400 });
  }
  if (typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'name 필요' }, { status: 400 });
  }
  if (typeof price !== 'number' || !Number.isInteger(price) || price < 0) {
    return NextResponse.json({ error: 'price는 0 이상의 정수' }, { status: 400 });
  }

  const insert: Record<string, unknown> = {
    id,
    name: name.trim(),
    price,
    category: 'software',
    pay_method: 'bank_transfer',
    is_active: true,
  };
  if (typeof description === 'string') insert.description = description;
  if (typeof description_long === 'string') insert.description_long = description_long;
  const feats = sanitizeFeatures(features);
  if (feats !== undefined) insert.features = feats;
  if (typeof is_listed === 'boolean') insert.is_listed = is_listed;
  if (typeof sort_order === 'number') insert.sort_order = sort_order;

  const supabase = createAdminClient();
  const { data, error } = await supabase.from('products').insert(insert).select().single();
  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: '이미 존재하는 제품 id' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ product: data });
}

export async function PATCH(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id } = body;
  if (typeof id !== 'string' || !id) {
    return NextResponse.json({ error: 'id 필요' }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (typeof body.name === 'string') updates.name = body.name.trim();
  if (typeof body.description === 'string') updates.description = body.description;
  if (typeof body.description_long === 'string') updates.description_long = body.description_long;
  if (typeof body.price === 'number' && Number.isInteger(body.price) && body.price >= 0) {
    updates.price = body.price;
  }
  const feats = sanitizeFeatures(body.features);
  if (feats !== undefined) updates.features = feats;
  if (typeof body.is_listed === 'boolean') updates.is_listed = body.is_listed;
  if (typeof body.is_active === 'boolean') updates.is_active = body.is_active;
  if (typeof body.sort_order === 'number') updates.sort_order = body.sort_order;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: '변경할 필드 없음' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('products').update(updates).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
