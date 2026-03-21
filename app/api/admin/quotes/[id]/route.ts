import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminTokenNode } from '@/lib/admin-auth';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token && verifyAdminTokenNode(token);
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('quotes').select('*').eq('id', id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ quote: data });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('quotes')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ quote: data });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase.from('quotes').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
