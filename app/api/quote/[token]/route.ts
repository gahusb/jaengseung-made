import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendQuoteDecisionEmail } from '@/lib/request-emails';

export const runtime = 'nodejs';

// 고객용 공개 견적서 조회 (토큰 기반)
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('quotes')
    .select('id, title, client_name, valid_until, status, wbs, items, maintenance, notes, created_at')
    .eq('public_token', token)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // 만료 검증: valid_until이 현재 시간보다 과거이면 expired 플래그 추가
  const expired = data.valid_until
    ? new Date(data.valid_until).getTime() < Date.now()
    : false;

  return NextResponse.json({ quote: data, expired });
}

// 고객이 견적 수락/거절
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const body = await request.json(); // { action?, selectedItems, selectedMaintenance, total }
  const action: 'accept' | 'reject' = body.action === 'reject' ? 'reject' : 'accept';
  const supabase = createAdminClient();

  const { data: quote, error: findErr } = await supabase
    .from('quotes')
    .select('id, title, client_name, client_email, status, contact_request_id')
    .eq('public_token', token)
    .single();

  if (findErr || !quote) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // 이미 처리된 견적 중복 처리 방지
  if (quote.status === 'accepted' || quote.status === 'rejected') {
    return NextResponse.json({ error: '이미 처리된 견적입니다' }, { status: 409 });
  }

  const now = new Date().toISOString();

  if (action === 'accept') {
    // 상태를 accepted로 변경 (기존 로직 유지)
    await supabase
      .from('quotes')
      .update({
        status: 'accepted',
        accepted_items: body.selectedItems,
        accepted_maintenance: body.selectedMaintenance,
        accepted_total: body.total,
        updated_at: now,
      })
      .eq('id', quote.id);
  } else {
    // 상태를 rejected로 변경 (accepted_* 미기록)
    await supabase
      .from('quotes')
      .update({
        status: 'rejected',
        updated_at: now,
      })
      .eq('id', quote.id);
  }

  // 연결된 의뢰 상태 동기화 (실패 시 무시)
  if (quote.contact_request_id) {
    try {
      const crStatus = action === 'accept' ? 'accepted' : 'on_hold';
      await supabase
        .from('contact_requests')
        .update({ status: crStatus, updated_at: now })
        .eq('id', quote.contact_request_id);
    } catch (e) {
      console.error('[quote POST] contact_request sync failed:', e);
    }
  }

  // 관리자 알림 메일 (실패 시 무시)
  try {
    const decision = action === 'accept' ? 'accepted' : 'rejected';
    const totalValue = action === 'accept' && typeof body.total === 'number' && Number.isFinite(body.total)
      ? body.total
      : undefined;
    await sendQuoteDecisionEmail({
      decision,
      quoteTitle: quote.title,
      clientName: quote.client_name || '고객',
      total: totalValue,
    });
  } catch (e) {
    console.error('[quote POST] sendQuoteDecisionEmail failed:', e);
  }

  return NextResponse.json({ success: true });
}
