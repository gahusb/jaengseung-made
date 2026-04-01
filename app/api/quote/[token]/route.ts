import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

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

// 고객이 견적 수락
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const body = await request.json(); // { selectedItems, selectedMaintenance }
  const supabase = createAdminClient();

  const { data: quote, error: findErr } = await supabase
    .from('quotes')
    .select('id, title, client_name, client_email')
    .eq('public_token', token)
    .single();

  if (findErr || !quote) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // 상태를 accepted로 변경
  await supabase
    .from('quotes')
    .update({
      status: 'accepted',
      accepted_items: body.selectedItems,
      accepted_maintenance: body.selectedMaintenance,
      accepted_total: body.total,
      updated_at: new Date().toISOString(),
    })
    .eq('id', quote.id);

  return NextResponse.json({ success: true });
}
