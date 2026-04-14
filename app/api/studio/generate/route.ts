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
  const apiUrl = process.env.SUNO_API_URL;
  const apiKey = process.env.SUNO_API_KEY;

  if (!apiUrl || !apiKey) {
    return NextResponse.json(
      { error: 'Suno API 미설정 (SUNO_API_URL / SUNO_API_KEY 환경변수 필요)' },
      { status: 503 },
    );
  }

  let body: GenerateBody;
  try {
    body = (await request.json()) as GenerateBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const endpoint = body.mode === 'custom' ? '/api/custom_generate' : '/api/generate';

  const payload =
    body.mode === 'custom'
      ? {
          prompt: body.lyrics ?? '',
          tags: body.tags ?? '',
          title: body.title ?? '',
          make_instrumental: !!body.make_instrumental,
          model: body.model ?? 'chirp-v3-5',
          wait_audio: false,
        }
      : {
          prompt: body.prompt ?? '',
          make_instrumental: !!body.make_instrumental,
          model: body.model ?? 'chirp-v3-5',
          wait_audio: false,
        };

  try {
    const res = await fetch(`${apiUrl.replace(/\/$/, '')}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(
        { error: '생성 실패', detail: data ?? (await res.text().catch(() => '')) },
        { status: res.status },
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
