import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminTokenNode } from '@/lib/admin-auth';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token && verifyAdminTokenNode(token);
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('quotes').select('*').eq('id', id).single();
  if (error) return NextResponse.json({ error: '견적서를 찾을 수 없습니다' }, { status: 404 });
  return NextResponse.json({ quote: data });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청 형식' }, { status: 400 });
  }

  // ── 허용 필드 화이트리스트 (시스템 필드 변조 방지) ───────────
  const ALLOWED_FIELDS = [
    'title', 'client_name', 'client_email', 'client_phone',
    'wbs', 'items', 'maintenance', 'notes', 'status',
    'valid_until', 'discount',
  ] as const;

  const sanitizedBody = Object.fromEntries(
    ALLOWED_FIELDS
      .filter((key) => key in body)
      .map((key) => [key, body[key]])
  );

  if (Object.keys(sanitizedBody).length === 0) {
    return NextResponse.json({ error: '수정할 필드가 없습니다' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('quotes')
    .update({ ...sanitizedBody, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[Admin Quotes] PUT error:', error.message);
    return NextResponse.json({ error: '견적서 업데이트 실패' }, { status: 500 });
  }
  return NextResponse.json({ quote: data });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase.from('quotes').delete().eq('id', id);
  if (error) {
    console.error('[Admin Quotes] DELETE error:', error.message);
    return NextResponse.json({ error: '견적서 삭제 실패' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
