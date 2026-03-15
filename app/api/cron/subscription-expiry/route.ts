import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendMessage } from '@/lib/telegram';

/**
 * GET /api/cron/subscription-expiry
 * Vercel Cron: 매일 01:00 KST (UTC 16:00) 실행
 * - 만료된 구독 → status='expired'
 * - 3일 후 만료 예정 구독 → 텔레그램 알림 발송
 */
export async function GET(req: NextRequest) {
  // Vercel Cron 인증
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const in3days = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

  // 1. 만료된 구독 처리
  const { data: expired, error: expireError } = await supabase
    .from('subscriptions')
    .update({ status: 'expired' })
    .eq('status', 'active')
    .lt('expires_at', now)
    .select('id, user_id, product_id');

  if (expireError) {
    console.error('subscription expiry error:', expireError);
  }

  // 2. 3일 후 만료 예정 → 텔레그램 알림
  const { data: expiringSoon } = await supabase
    .from('subscriptions')
    .select('id, user_id, product_id, expires_at, profiles!inner(telegram_chat_id)')
    .eq('status', 'active')
    .eq('auto_renew', false)
    .lt('expires_at', in3days)
    .gt('expires_at', now);

  const PLAN_NAMES: Record<string, string> = {
    lotto_gold:     '🥇 골드',
    lotto_platinum: '💎 플래티넘',
    lotto_diamond:  '👑 다이아',
  };

  let notified = 0;
  if (expiringSoon) {
    for (const sub of expiringSoon) {
      const profile = sub.profiles as unknown as { telegram_chat_id: string | null };
      const chatId = profile?.telegram_chat_id;
      if (!chatId) continue;

      const expiresAt = new Date(sub.expires_at).toLocaleDateString('ko-KR');
      const planName = PLAN_NAMES[sub.product_id] ?? sub.product_id;

      await sendMessage(
        chatId,
        `⏰ *구독 만료 안내*\n\n` +
        `로또 번호 추천 *${planName}* 플랜이\n` +
        `*${expiresAt}*에 만료됩니다.\n\n` +
        `지속적인 번호 추천을 받으시려면\n` +
        `마이페이지에서 구독을 갱신해 주세요.\n\n` +
        `👉 https://jaengseung-made.com/mypage`
      );
      notified++;
    }
  }

  return NextResponse.json({
    ok: true,
    expired_count: expired?.length ?? 0,
    notified_count: notified,
    processed_at: now,
  });
}
