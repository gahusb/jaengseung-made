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
    .from('service_settings')
    .select('*')
    .order('order_index');

  if (error) {
    // 테이블이 없으면 기본값 반환
    return NextResponse.json({ services: DEFAULT_SERVICES });
  }

  return NextResponse.json({ services: data?.length ? data : DEFAULT_SERVICES });
}

export async function PATCH(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, is_active } = await request.json();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('service_settings')
    .upsert({ id, is_active, updated_at: new Date().toISOString() });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

const DEFAULT_SERVICES = [
  { id: 'saju', name: 'AI 사주 분석', description: '사주 입력 및 AI 해석 서비스', is_active: true, order_index: 1 },
  { id: 'lotto', name: '로또 번호 추천', description: '빅데이터 기반 로또 번호 분석', is_active: true, order_index: 2 },
  { id: 'stock', name: '주식 자동매매', description: '텔레그램 연동 자동매매 프로그램', is_active: true, order_index: 3 },
  { id: 'automation', name: '업무 자동화 RPA', description: '반복 업무 자동화 개발', is_active: true, order_index: 4 },
  { id: 'prompt', name: '프롬프트 엔지니어링', description: 'AI 프롬프트 설계 서비스', is_active: true, order_index: 5 },
  { id: 'freelance', name: '외주 개발', description: '맞춤형 소프트웨어 개발', is_active: true, order_index: 6 },
];
