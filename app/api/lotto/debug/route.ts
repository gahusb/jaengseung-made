import { NextResponse } from 'next/server';

/**
 * GET /api/lotto/debug
 * NAS 엔드포인트 접근 가능 여부 일괄 진단
 * 배포 후 브라우저에서 직접 호출: https://www.jaengseung-made.com/api/lotto/debug
 */
export async function GET() {
  const base = process.env.NAS_LOTTO_API_URL;
  if (!base) return NextResponse.json({ error: 'NAS_URL_NOT_CONFIGURED' }, { status: 500 });

  const paths = [
    // 현재 코드에서 호출 중인 경로들
    '/api/lotto/recommend',
    '/api/lotto/recommend/batch',
    '/api/lotto/latest',
    '/api/lotto/analysis',
    '/api/lotto/simulation',
    '/api/lotto/stats',
    '/api/lotto/stats/performance',
    '/api/lotto/report/latest',
    '/api/lotto/report/history',
    '/api/lotto/purchase',
    '/api/lotto/purchase/stats',
    '/api/lotto/analysis/personal',
    '/api/history',
    // NAS API 스펙 문서
    '/openapi.json',
    '/docs',
  ];

  const results = await Promise.all(
    paths.map(async (path) => {
      const start = Date.now();
      try {
        const res = await fetch(`${base}${path}`, {
          signal: AbortSignal.timeout(6000),
        });
        const ms = Date.now() - start;
        let body: unknown = null;
        try { body = await res.json(); } catch { /* ignore */ }
        return { path, status: res.status, ok: res.ok, ms, body };
      } catch (err) {
        const e = err as { name?: string; message?: string; code?: string };
        return {
          path,
          status: null,
          ok: false,
          ms: Date.now() - start,
          error: e.code ?? e.name ?? e.message,
        };
      }
    })
  );

  const ok = results.filter(r => r.ok);
  const fail = results.filter(r => !r.ok);

  return NextResponse.json({
    base,
    summary: { total: results.length, ok: ok.length, fail: fail.length },
    ok: ok.map(r => ({ path: r.path, status: r.status, ms: r.ms })),
    fail: fail.map(r => ({ path: r.path, status: r.status, error: (r as { error?: string }).error, ms: r.ms })),
    full: results,
  });
}
