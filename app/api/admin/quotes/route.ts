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

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('quotes')
    .select('id, title, client_name, client_email, status, valid_until, public_token, items, created_at')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ quotes: data ?? [] });
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('quotes')
    .insert({
      title: body.title || '새 견적서',
      client_name: body.client_name || '',
      client_email: body.client_email || '',
      valid_until: body.valid_until || null,
      wbs: body.wbs || [],
      items: body.items || [],
      maintenance: body.maintenance || [],
      notes: body.notes || '',
      status: 'draft',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ quote: data }, { status: 201 });
}
