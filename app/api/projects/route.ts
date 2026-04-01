import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();

  const { data: quotes, error: qErr } = await admin
    .from('quotes')
    .select('id, title, status, items, created_at')
    .eq('user_id', user.id)
    .in('status', ['sent', 'accepted', 'in_progress', 'completed', 'delivered'])
    .order('created_at', { ascending: false });

  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });
  if (!quotes?.length) return NextResponse.json({ projects: [] });

  const quoteIds = quotes.map((q) => q.id);

  const { data: milestones } = await admin
    .from('project_milestones')
    .select('*')
    .in('quote_id', quoteIds)
    .order('step_number', { ascending: true });

  const projects = quotes.map((q) => ({
    id: q.id,
    title: q.title,
    status: q.status,
    total: Array.isArray(q.items)
      ? q.items.reduce(
          (s: number, i: { unitPrice?: number; quantity?: number }) =>
            s + ((i.unitPrice ?? 0) * (i.quantity ?? 1)),
          0
        )
      : 0,
    created_at: q.created_at,
    milestones: (milestones ?? [])
      .filter((m) => m.quote_id === q.id)
      .sort((a, b) => a.step_number - b.step_number),
  }));

  return NextResponse.json({ projects });
}
