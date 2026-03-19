import { NextResponse } from 'next/server';
import { nasPut, nasDelete, requireSubscription, handleNasError } from '../../_nas';

export const maxDuration = 60;

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireSubscription();
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    const body = await request.json();
    const data = await nasPut(`/api/lotto/purchase/${id}`, body);
    return NextResponse.json(data);
  } catch (err) { return handleNasError(err); }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireSubscription();
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    const data = await nasDelete(`/api/lotto/purchase/${id}`);
    return NextResponse.json(data);
  } catch (err) { return handleNasError(err); }
}
