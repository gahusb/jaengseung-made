import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const apiUrl = process.env.SUNO_API_URL ?? 'https://api.sunoapi.org';
  const apiKey = process.env.SUNO_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Suno API 미설정 (SUNO_API_KEY 환경변수 필요)' },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');
  if (!taskId) return NextResponse.json({ error: 'taskId required' }, { status: 400 });

  try {
    const res = await fetch(
      `${apiUrl.replace(/\/$/, '')}/api/v1/generate/record-info?taskId=${encodeURIComponent(taskId)}`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(
        { error: '조회 실패', detail: data },
        { status: res.status },
      );
    }
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json(
      { error: '조회 오류', detail: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    );
  }
}
