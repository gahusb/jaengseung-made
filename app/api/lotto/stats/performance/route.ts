import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { nasGet, handleNasError } from '../../_nas';

export const maxDuration = 60;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    const data = await nasGet('/api/lotto/stats/performance');
    return NextResponse.json(data);
  } catch (err) { return handleNasError(err); }
}
