import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

// 비회원 의뢰 추적 API — 향후 클라이언트 측 폴링/갱신용.
// PII(이메일·전화·메시지 본문)는 select에서 제외한다.
// DB 예외(마이그레이션 미적용 42703 포함)는 모두 404로 폴백한다.
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!token || token.length > 64) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const admin = createAdminClient();
  const { data: request, error } = await admin
    .from('contact_requests')
    .select('id, name, service, status, project_type, budget, timeline, created_at, updated_at')
    .eq('public_token', token)
    .maybeSingle();
  if (error || !request) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const { data: quote } = await admin
    .from('quotes')
    .select('public_token, title, status, valid_until')
    .eq('contact_request_id', request.id)
    .in('status', ['sent', 'accepted', 'rejected'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({ request, quote: quote ?? null });
}
