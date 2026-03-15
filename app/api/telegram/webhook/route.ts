import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendMessage, type TelegramUpdate } from '@/lib/telegram';

/**
 * POST /api/telegram/webhook
 * Telegram이 호출하는 웹훅 엔드포인트
 * - X-Telegram-Bot-Api-Secret-Token 헤더로 요청 검증
 * - /start <TOKEN> 명령으로 유저 텔레그램 계정 연결
 */
export async function POST(req: NextRequest) {
  // 1. 웹훅 시크릿 토큰 검증
  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secretToken) {
    const incoming = req.headers.get('x-telegram-bot-api-secret-token');
    if (incoming !== secretToken) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }
  }

  let update: TelegramUpdate;
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 });
  }

  const message = update.message;
  if (!message?.text || !message.from) {
    // 지원하지 않는 업데이트 타입 — 200으로 응답해야 재전송 방지
    return NextResponse.json({ ok: true });
  }

  const chatId = message.chat.id;
  const text = message.text.trim();
  const firstName = message.from.first_name ?? '고객';

  // 2. /start 명령 처리
  if (text.startsWith('/start')) {
    const parts = text.split(' ');
    const token = parts[1]; // /start <TOKEN>

    if (!token) {
      await sendMessage(
        chatId,
        `안녕하세요, ${firstName}님! 👋\n\n쟁승메이드 로또 알림 봇입니다.\n\n[마이페이지](https://jaengseung.com/mypage)에서 텔레그램 연결 버튼을 클릭하여 계정을 연결해주세요.`
      );
      return NextResponse.json({ ok: true });
    }

    // 3. 토큰으로 유저 조회
    const supabase = createAdminClient();
    const now = new Date().toISOString();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, telegram_chat_id, telegram_connect_token, telegram_token_expires')
      .eq('telegram_connect_token', token)
      .gt('telegram_token_expires', now)
      .maybeSingle();

    if (error || !profile) {
      await sendMessage(
        chatId,
        `❌ 연결 코드가 유효하지 않거나 만료되었습니다.\n\n마이페이지에서 다시 연결을 시도해주세요.`
      );
      return NextResponse.json({ ok: true });
    }

    if (profile.telegram_chat_id) {
      await sendMessage(
        chatId,
        `✅ 이미 연결된 계정입니다.\n\n📧 ${profile.email}`
      );
      return NextResponse.json({ ok: true });
    }

    // 4. chat_id 저장 + 토큰 초기화
    await supabase
      .from('profiles')
      .update({
        telegram_chat_id: String(chatId),
        telegram_connect_token: null,
        telegram_token_expires: null,
      })
      .eq('id', profile.id);

    await sendMessage(
      chatId,
      `🎉 텔레그램 연결 완료!\n\n📧 ${profile.email} 계정과 연결되었습니다.\n\n이제 매주 로또 번호를 이 채팅으로 받아보실 수 있습니다. 🎰`
    );

    return NextResponse.json({ ok: true });
  }

  // 5. 그 외 명령어
  if (text === '/status') {
    const supabase = createAdminClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('telegram_chat_id', String(chatId))
      .maybeSingle();

    if (profile) {
      await sendMessage(chatId, `✅ 연결 상태: 정상\n📧 ${profile.email}`);
    } else {
      await sendMessage(chatId, `❌ 연결된 계정이 없습니다.\n마이페이지에서 연결해주세요.`);
    }
    return NextResponse.json({ ok: true });
  }

  if (text === '/help') {
    await sendMessage(
      chatId,
      `*쟁승메이드 로또 봇 명령어*\n\n/status — 연결 상태 확인\n/help — 도움말`
    );
    return NextResponse.json({ ok: true });
  }

  // 기본 응답
  await sendMessage(chatId, `/help 를 입력하면 사용 가능한 명령어를 확인할 수 있습니다.`);
  return NextResponse.json({ ok: true });
}
