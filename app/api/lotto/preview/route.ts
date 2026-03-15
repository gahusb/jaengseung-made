import { NextResponse } from 'next/server';

/**
 * GET /api/lotto/preview
 * 인증 없이 NAS /api/lotto/recommend 단일 호출 (맛보기용 무료 추천)
 * NAS 미연결 시 → { error: 'NAS_UNAVAILABLE' } 503 반환
 * 클라이언트에서 이 경우 자체 Monte Carlo 폴백 처리
 */
export async function GET() {
  const base = process.env.NAS_LOTTO_API_URL;

  if (!base) {
    return NextResponse.json({ error: 'NAS_UNAVAILABLE' }, { status: 503 });
  }

  try {
    const headers: Record<string, string> = {};
    if (process.env.NAS_LOTTO_API_KEY) {
      headers['Authorization'] = `Bearer ${process.env.NAS_LOTTO_API_KEY}`;
    }

    const res = await fetch(`${base}/api/lotto/recommend`, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.warn(`[lotto/preview] NAS returned ${res.status}`);
      return NextResponse.json({ error: 'NAS_UNAVAILABLE' }, { status: 503 });
    }

    const data = await res.json();

    return NextResponse.json({
      ok: true,
      source: 'nas',
      numbers: data.numbers ?? [],
      metrics: data.metrics ?? null,
    });
  } catch (err: unknown) {
    // ECONNREFUSED, 타임아웃 등 — 클라이언트 폴백 신호
    const e = err as { name?: string; code?: string; message?: string };
    console.warn('[lotto/preview] NAS unreachable:', e?.code ?? e?.message ?? e?.name);
    return NextResponse.json({ error: 'NAS_UNAVAILABLE' }, { status: 503 });
  }
}
