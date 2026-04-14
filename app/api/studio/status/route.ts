import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const apiUrl = process.env.SUNO_API_URL;
  const apiKey = process.env.SUNO_API_KEY;

  if (!apiUrl || !apiKey) {
    return NextResponse.json(
      { error: 'Suno API 미설정 (SUNO_API_URL / SUNO_API_KEY 환경변수 필요)' },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids');
  if (!ids) return NextResponse.json({ error: 'ids required' }, { status: 400 });

  try {
    const res = await fetch(
      `${apiUrl.replace(/\/$/, '')}/api/get?ids=${encodeURIComponent(ids)}`,
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
