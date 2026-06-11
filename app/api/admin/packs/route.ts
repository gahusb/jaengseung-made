import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminTokenNode } from '@/lib/admin-auth';
import { deletePackFileViaBackend } from '@/lib/web-backend';
import type { PackTier } from '@/lib/pack-assets';

export const runtime = 'nodejs';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token && verifyAdminTokenNode(token);
}

const VALID_TIERS = new Set<PackTier>(['starter', 'pro', 'master']);

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('pack_files')
    .select('*')
    .is('deleted_at', null)
    .order('min_tier')
    .order('sort_order');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ files: data ?? [] });
}

export async function PATCH(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id, label, sort_order, min_tier, product_id } = await request.json();
  if (!id) return NextResponse.json({ error: 'id 필요' }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (typeof label === 'string') updates.label = label;
  if (typeof sort_order === 'number') updates.sort_order = sort_order;
  if (typeof min_tier === 'string' && VALID_TIERS.has(min_tier as PackTier)) {
    updates.min_tier = min_tier;
  }
  if (typeof product_id === 'string' || product_id === null) updates.product_id = product_id;
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: '변경할 필드 없음' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('pack_files').update(updates).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id 필요' }, { status: 400 });

  // web-backend가 soft delete 담당 (DSM 정리도 backend가 향후 추가 예정)
  try {
    await deletePackFileViaBackend(id);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return NextResponse.json({ error: 'backend delete 실패', detail: msg }, { status: 502 });
  }
  return NextResponse.json({ success: true });
}
