import { NextRequest, NextResponse } from 'next/server';

const SAJU_ENGINE_URL = process.env.SAJU_ENGINE_URL;
const SAJU_ENGINE_SECRET = process.env.SAJU_ENGINE_SECRET;

export async function POST(request: NextRequest) {
  if (!SAJU_ENGINE_URL) {
    return NextResponse.json({ error: '사주 엔진 URL이 설정되지 않았습니다' }, { status: 503 });
  }

  try {
    const body = await request.json();

    const response = await fetch(`${SAJU_ENGINE_URL}/saju/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(SAJU_ENGINE_SECRET ? { 'X-API-Secret': SAJU_ENGINE_SECRET } : {}),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000), // 15초 타임아웃
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || '사주 계산 실패' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json({ error: '사주 엔진 응답 시간 초과' }, { status: 504 });
    }
    console.error('사주 계산 프록시 오류:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
