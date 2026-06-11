import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminTokenNode } from '@/lib/admin-auth';
import { cookies } from 'next/headers';
import { isRequestStatus } from '@/lib/request-status';

export const runtime = 'nodejs';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token && verifyAdminTokenNode(token);
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: contacts, error } = await supabase
    .from('contact_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!contacts || contacts.length === 0) {
    return NextResponse.json({ contacts: [] });
  }

  // 2-쿼리 머지: 연결 견적 부착 (컬럼 부재 등 오류는 빈 배열 폴백)
  const ids = contacts.map((c) => c.id).filter(Boolean) as string[];
  let quotesMap: Record<string, { id: string; title: string; status: string }[]> = {};
  try {
    const { data: quotesData } = await supabase
      .from('quotes')
      .select('id, title, status, contact_request_id')
      .in('contact_request_id', ids);
    if (quotesData) {
      for (const q of quotesData) {
        if (!q.contact_request_id) continue;
        if (!quotesMap[q.contact_request_id]) quotesMap[q.contact_request_id] = [];
        quotesMap[q.contact_request_id].push({ id: q.id, title: q.title, status: q.status });
      }
    }
  } catch {
    // 컬럼 부재 등 — 빈 배열 폴백
  }

  const enriched = contacts.map((c) => ({
    ...c,
    quotes: quotesMap[c.id] ?? [],
  }));

  return NextResponse.json({ contacts: enriched });
}

export async function PATCH(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, status } = await request.json();

  if (typeof id !== 'string' || !isRequestStatus(status)) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from('contact_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
