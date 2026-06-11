import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminTokenNode } from '@/lib/admin-auth';
import { sendQuoteSentEmail } from '@/lib/request-emails';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token && verifyAdminTokenNode(token);
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  // 1. 견적서 조회
  const { data: quote, error: fetchError } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !quote) {
    return NextResponse.json({ error: '견적서를 찾을 수 없습니다' }, { status: 404 });
  }

  // 2. 이미 발송/수락/거절된 견적은 재발송 차단
  if (['sent', 'accepted', 'rejected'].includes(quote.status)) {
    return NextResponse.json({ success: true, emailSent: false, alreadySent: true });
  }

  // 3. 고객 이메일 필수
  if (!quote.client_email) {
    return NextResponse.json({ error: '고객 이메일을 먼저 입력하세요' }, { status: 400 });
  }

  // 4. public_token 보장
  const quoteToken: string = quote.public_token || crypto.randomUUID();
  const nowIso = new Date().toISOString();

  // 5. 견적 상태 업데이트
  const updatePayload: Record<string, unknown> = { status: 'sent', updated_at: nowIso };
  if (!quote.public_token) updatePayload.public_token = quoteToken;

  const { error: updateError } = await supabase
    .from('quotes')
    .update(updatePayload)
    .eq('id', id);

  if (updateError) {
    console.error('[Quote Send] update error:', updateError.message);
    return NextResponse.json({ error: '견적 상태 업데이트 실패' }, { status: 500 });
  }

  // 6. 연결된 의뢰 상태 동기화 (실패해도 진행)
  if (quote.contact_request_id) {
    const { error: syncError } = await supabase
      .from('contact_requests')
      .update({ status: 'quoted', updated_at: nowIso })
      .eq('id', quote.contact_request_id);
    if (syncError) {
      console.error('[Quote Send] contact sync error:', syncError.message);
    }
  }

  // 7. 견적 메일 발송 (실패해도 상태 변경은 유지)
  let emailSent = true;
  try {
    await sendQuoteSentEmail({
      clientName: quote.client_name || '고객',
      clientEmail: quote.client_email,
      quoteTitle: quote.title,
      quoteToken,
      validUntil: quote.valid_until ?? null,
    });
  } catch (e) {
    emailSent = false;
    console.error('[Quote Send] email error:', e);
  }

  return NextResponse.json({ success: true, emailSent });
}
