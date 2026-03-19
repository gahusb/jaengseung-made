import { NextResponse } from 'next/server';
import { nasGet, requireSubscription, handleNasError } from '../../_nas';

export const maxDuration = 60;

export async function GET() {
  try {
    const auth = await requireSubscription();
    if (auth instanceof NextResponse) return auth;
    const data = await nasGet('/api/lotto/report/latest');
    return NextResponse.json(data);
  } catch (err) { return handleNasError(err); }
}
