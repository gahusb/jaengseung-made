import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * PATCH /api/subscription/[id]
 * action: 'cancel' | 'toggle_autorenew'
 *
 * cancel       — 구독 즉시 해지 (status='cancelled', auto_renew=false)
 * toggle_autorenew — 자동갱신 on/off 전환
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { id } = await params;
  let body: { action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 });
  }

  const { action } = body;

  // 본인 구독인지 확인
  const { data: sub, error: fetchError } = await supabase
    .from('subscriptions')
    .select('id, status, auto_renew, expires_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (fetchError || !sub) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  }

  if (action === 'cancel') {
    if (sub.status === 'cancelled') {
      return NextResponse.json({ error: 'ALREADY_CANCELLED' }, { status: 400 });
    }

    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        auto_renew: false,
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'DB_ERROR' }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: '구독이 해지되었습니다. 만료일까지는 서비스를 계속 이용할 수 있습니다.',
      expires_at: sub.expires_at,
    });
  }

  if (action === 'toggle_autorenew') {
    if (sub.status === 'cancelled' || sub.status === 'expired') {
      return NextResponse.json({ error: 'SUBSCRIPTION_NOT_ACTIVE' }, { status: 400 });
    }

    const newValue = !sub.auto_renew;
    const { error } = await supabase
      .from('subscriptions')
      .update({ auto_renew: newValue })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'DB_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, auto_renew: newValue });
  }

  return NextResponse.json({ error: 'INVALID_ACTION' }, { status: 400 });
}
