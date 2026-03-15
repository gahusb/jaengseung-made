import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/telegram/connect
 * 인증된 유저에게 15분 유효 연결 토큰을 발급하고
 * 텔레그램 봇 딥링크를 반환합니다.
 *
 * Response: { deepLink: string, expiresAt: string }
 */
export async function POST() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const botUsername = process.env.TELEGRAM_BOT_USERNAME;
  if (!botUsername) {
    return NextResponse.json({ error: 'TELEGRAM_BOT_USERNAME이 설정되지 않았습니다.' }, { status: 500 });
  }

  // 15분 유효 토큰 생성
  const token = crypto.randomUUID().replace(/-/g, '');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  // 프로필 upsert (없는 경우 대비)
  await supabase
    .from('profiles')
    .upsert({ id: user.id, email: user.email }, { onConflict: 'id' });

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      telegram_connect_token: token,
      telegram_token_expires: expiresAt,
    })
    .eq('id', user.id);

  if (updateError) {
    console.error('telegram connect token update error:', updateError);
    return NextResponse.json({ error: 'DB_ERROR' }, { status: 500 });
  }

  const deepLink = `https://t.me/${botUsername}?start=${token}`;
  return NextResponse.json({ deepLink, expiresAt });
}

/**
 * DELETE /api/telegram/connect
 * 텔레그램 연결 해제 (chat_id 및 토큰 초기화)
 */
export async function DELETE() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      telegram_chat_id: null,
      telegram_connect_token: null,
      telegram_token_expires: null,
    })
    .eq('id', user.id);

  if (error) {
    return NextResponse.json({ error: 'DB_ERROR' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
