/**
 * Telegram Bot API 유틸리티
 * 환경변수: TELEGRAM_BOT_TOKEN
 */

const BASE = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN이 설정되지 않았습니다.');
  return `https://api.telegram.org/bot${token}`;
};

// ─── 메시지 전송 ──────────────────────────────────────────────────────────────

export async function sendMessage(
  chatId: string | number,
  text: string,
  options: { parse_mode?: 'Markdown' | 'HTML'; disable_web_page_preview?: boolean } = {}
): Promise<{ ok: boolean; description?: string }> {
  const res = await fetch(`${BASE()}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: options.parse_mode ?? 'Markdown',
      disable_web_page_preview: options.disable_web_page_preview ?? true,
    }),
  });
  return res.json();
}

// ─── 로또 번호 알림 메시지 포맷 ──────────────────────────────────────────────

export function formatLottoMessage(
  numbers: number[],
  drawDate: string,
  planName: string,
  round?: number
): string {
  const balls = numbers.map((n) => `*${String(n).padStart(2, '0')}*`).join('  ');
  const roundText = round ? ` (제${round}회 예상)` : '';

  return [
    `🎰 *쟁승메이드 로또 번호 추천*${roundText}`,
    `📅 ${drawDate} | ${planName}`,
    ``,
    `${balls}`,
    ``,
    `📊 합계: ${numbers.reduce((a, b) => a + b, 0)} | 홀수: ${numbers.filter((n) => n % 2 !== 0).length}개`,
    ``,
    `⚠️ 통계 기반 추천이며 당첨을 보장하지 않습니다.`,
    `🔗 [번호 추천 받기](https://jaengseung.com/services/lotto/recommend)`,
  ].join('\n');
}

// ─── 웹훅 등록 ───────────────────────────────────────────────────────────────

export async function setWebhook(
  webhookUrl: string,
  secretToken?: string
): Promise<{ ok: boolean; description?: string }> {
  const body: Record<string, unknown> = {
    url: webhookUrl,
    allowed_updates: ['message'],
  };
  if (secretToken) body.secret_token = secretToken;

  const res = await fetch(`${BASE()}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function getWebhookInfo(): Promise<{ ok: boolean; result?: { url: string; pending_update_count: number } }> {
  const res = await fetch(`${BASE()}/getWebhookInfo`);
  return res.json();
}

// ─── Telegram Update 타입 ─────────────────────────────────────────────────────

export interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from?: {
      id: number;
      username?: string;
      first_name?: string;
    };
    chat: { id: number; type: string };
    text?: string;
    date: number;
  };
}
