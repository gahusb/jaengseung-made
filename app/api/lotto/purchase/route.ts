import { NextResponse } from 'next/server';
import { nasGet, nasPost, requireSubscription, handleNasError } from '../_nas';

export async function GET(request: Request) {
  try {
    const auth = await requireSubscription();
    if (auth instanceof NextResponse) return auth;
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();
    if (searchParams.get('draw_no')) params.set('draw_no', searchParams.get('draw_no')!);
    if (searchParams.get('days')) params.set('days', searchParams.get('days')!);
    const qs = params.toString() ? `?${params}` : '';
    const data = await nasGet(`/api/lotto/purchase${qs}`);
    return NextResponse.json(data);
  } catch (err) { return handleNasError(err); }
}

export async function POST(request: Request) {
  try {
    const auth = await requireSubscription();
    if (auth instanceof NextResponse) return auth;
    const body = await request.json();
    const data = await nasPost('/api/lotto/purchase', body);
    return NextResponse.json(data, { status: 201 });
  } catch (err) { return handleNasError(err); }
}
