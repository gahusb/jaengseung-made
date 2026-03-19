import { NextResponse } from 'next/server';
import { nasGet, requireSubscription, handleNasError } from '../../_nas';

export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const auth = await requireSubscription();
    if (auth instanceof NextResponse) return auth;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ?? '10';
    const data = await nasGet(`/api/lotto/report/history?limit=${limit}`);
    return NextResponse.json(data);
  } catch (err) { return handleNasError(err); }
}
