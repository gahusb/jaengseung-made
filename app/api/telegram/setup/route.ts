import { NextRequest, NextResponse } from 'next/server';
import { setWebhook, getWebhookInfo } from '@/lib/telegram';

/**
 * GET  /api/telegram/setup  — 현재 웹훅 등록 상태 확인
 * POST /api/telegram/setup  — 텔레그램 웹훅 등록 (최초 1회 or 도메인 변경 시)
 *
 * 보안: TELEGRAM_SETUP_SECRET 헤더로 보호 (환경변수와 일치해야 접근 가능)
 * 사용: curl -X POST https://your-domain/api/telegram/setup \
 *         -H "x-setup-secret: YOUR_SECRET"
 */

function checkSecret(req: NextRequest): boolean {
  const secret = process.env.TELEGRAM_SETUP_SECRET;
  if (!secret) return false; // 시크릿 미설정이면 항상 거부
  return req.headers.get('x-setup-secret') === secret;
}

export async function GET(req: NextRequest) {
  if (!checkSecret(req)) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }
  const info = await getWebhookInfo();
  return NextResponse.json(info);
}

export async function POST(req: NextRequest) {
  if (!checkSecret(req)) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.VERCEL_URL;
  if (!appUrl) {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_APP_URL 또는 VERCEL_URL 환경변수가 필요합니다.' },
      { status: 500 }
    );
  }

  const webhookUrl = `${appUrl.startsWith('http') ? appUrl : `https://${appUrl}`}/api/telegram/webhook`;
  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;

  const result = await setWebhook(webhookUrl, secretToken);
  return NextResponse.json({ webhookUrl, result });
}
