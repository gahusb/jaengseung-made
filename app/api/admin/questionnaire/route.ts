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

// 질문지 응답 목록 조회
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('questionnaire_responses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Admin Questionnaire] DB error:', error);
    return NextResponse.json({ error: '데이터 조회 실패' }, { status: 500 });
  }

  return NextResponse.json({ data });
}
