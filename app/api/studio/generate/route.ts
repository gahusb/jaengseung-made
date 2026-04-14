import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type GenerateBody = {
  mode: 'simple' | 'custom';
  prompt?: string;
  title?: string;
  lyrics?: string;
  tags?: string;
  make_instrumental?: boolean;
  model?: string;
};

export async function POST(request: Request) {
  const apiUrl = process.env.SUNO_API_URL ?? 'https://api.sunoapi.org';
  const apiKey = process.env.SUNO_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Suno API 미설정 (SUNO_API_KEY 환경변수 필요)' },
      { status: 503 },
    );
  }

  let body: GenerateBody;
  try {
    body = (await request.json()) as GenerateBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const callBackUrl = `${origin}/api/studio/callback`;

  const isCustom = body.mode === 'custom';
  const payload = isCustom
    ? {
        prompt: body.lyrics ?? '',
        style: body.tags ?? '',
        title: body.title ?? 'Untitled',
        customMode: true,
        instrumental: !!body.make_instrumental,
        model: body.model ?? 'V4',
        callBackUrl,
      }
    : {
        prompt: body.prompt ?? '',
        customMode: false,
        instrumental: !!body.make_instrumental,
        model: body.model ?? 'V4',
        callBackUrl,
      };

  try {
    const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/v1/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || (data && typeof data === 'object' && 'code' in data && data.code !== 200)) {
      return NextResponse.json(
        { error: '생성 실패', detail: data ?? (await res.text().catch(() => '')) },
        { status: res.ok ? 502 : res.status },
      );
    }
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json(
      { error: 'Suno API 호출 오류', detail: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    );
  }
}
