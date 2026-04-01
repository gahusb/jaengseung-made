import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const token = (body.token as string | undefined)?.trim();
  if (!token) return NextResponse.json({ error: '견적서 코드를 입력해주세요' }, { status: 400 });

  const admin = createAdminClient();

  const { data: quote, error } = await admin
    .from('quotes')
    .select('id, status, user_id, client_email')
    .eq('public_token', token)
    .single();

  if (error || !quote) {
    return NextResponse.json({ error: '견적서를 찾을 수 없습니다. 코드를 다시 확인해주세요.' }, { status: 404 });
  }
  if (quote.status === 'draft') {
    return NextResponse.json({ error: '아직 발송되지 않은 견적서입니다.' }, { status: 400 });
  }
  if (quote.user_id && quote.user_id !== user.id) {
    return NextResponse.json({ error: '이미 다른 계정에 연결된 견적서입니다.' }, { status: 400 });
  }
  if (quote.user_id === user.id) {
    return NextResponse.json({ success: true, quoteId: quote.id, alreadyLinked: true });
  }

  const { error: updateErr } = await admin
    .from('quotes')
    .update({ user_id: user.id, updated_at: new Date().toISOString() })
    .eq('id', quote.id);

  if (updateErr) {
    console.error('[Projects/Link] DB update error:', updateErr.message);
    return NextResponse.json({ error: '견적서 연결에 실패했습니다. 다시 시도해주세요.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, quoteId: quote.id });
}
