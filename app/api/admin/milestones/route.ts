import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminTokenNode } from '@/lib/admin-auth';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

const DEFAULT_MILESTONES = [
  { step_number: 1, title: '의뢰 접수',          description: '고객 의뢰 및 요구사항 파악 완료' },
  { step_number: 2, title: '계약 체결',          description: '계약서 작성 및 계약금 입금' },
  { step_number: 3, title: '기획/와이어프레임',    description: '사이트맵·화면 구성·기능 정의' },
  { step_number: 4, title: '디자인 시안',        description: 'UI/UX 시안 제작 및 고객 확인' },
  { step_number: 5, title: '개발 진행',          description: '프론트·백엔드 구현' },
  { step_number: 6, title: '검수/테스트',        description: '기능 검증 및 수정사항 반영' },
  { step_number: 7, title: '납품 완료',          description: '소스코드 이관 및 도메인 배포' },
];

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token && verifyAdminTokenNode(token);
}

export async function GET(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const quoteId = searchParams.get('quoteId');
  if (!quoteId) return NextResponse.json({ error: 'quoteId 필요' }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('project_milestones')
    .select('*')
    .eq('quote_id', quoteId)
    .order('step_number', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ milestones: data ?? [] });
}

export async function POST(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const admin = createAdminClient();

  // 기본 7단계 초기화
  if (body.useDefaults && body.quoteId) {
    await admin.from('project_milestones').delete().eq('quote_id', body.quoteId);
    const toInsert = DEFAULT_MILESTONES.map((m) => ({ ...m, quote_id: body.quoteId }));
    const { data, error } = await admin.from('project_milestones').insert(toInsert).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ milestones: data }, { status: 201 });
  }

  // 단일 추가
  const { data, error } = await admin
    .from('project_milestones')
    .insert({
      quote_id:    body.quote_id,
      step_number: body.step_number ?? 1,
      title:       body.title ?? '새 단계',
      description: body.description ?? '',
      status:      'pending',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ milestone: data }, { status: 201 });
}
