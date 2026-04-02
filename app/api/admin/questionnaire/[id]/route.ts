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

// 질문지 응답 상세 조회
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('questionnaire_responses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[Admin Questionnaire] DB error:', error);
    return NextResponse.json({ error: '조회 실패' }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// 상태/메모 업데이트
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status, admin_notes } = body;

  const updates: Record<string, unknown> = {};
  if (status) updates.status = status;
  if (admin_notes !== undefined) updates.admin_notes = admin_notes;
  if (status === 'reviewed') updates.reviewed_at = new Date().toISOString();

  const admin = createAdminClient();
  const { error } = await admin
    .from('questionnaire_responses')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('[Admin Questionnaire] Update error:', error);
    return NextResponse.json({ error: '업데이트 실패' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
