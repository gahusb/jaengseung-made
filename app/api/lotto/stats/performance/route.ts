import { NextResponse } from 'next/server';
import { nasGet, handleNasError } from '../../_nas';

// 공개 집계 데이터 — 인증 불필요, Vercel CDN에서 10분 캐시
export const maxDuration = 60;
export const revalidate = 600; // 10분

export async function GET() {
  try {
    const data = await nasGet('/api/lotto/stats/performance');
    const res = NextResponse.json(data);
    res.headers.set('Cache-Control', 's-maxage=600, stale-while-revalidate=60');
    return res;
  } catch (err) { return handleNasError(err); }
}
