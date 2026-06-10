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
  { id: 'saju',     name: 'AI 사주 분석',       description: '사주 입력 및 AI 해석 (레거시)',   is_active: false, order_index: 101 },
  { id: 'music',    name: 'AI 음악 팩',         description: '음악 가이드 패키지·샘플·스튜디오', is_active: false, order_index: 102 },
  { id: 'gyeol',    name: 'CONTOUR 설문',       description: '/gyeol PMF 설문',                 is_active: false, order_index: 103 },
  { id: 'packages', name: 'SaaS 제품 허브(구)', description: '구 /packages 페이지',             is_active: false, order_index: 104 },
  { id: 'lotto',    name: '로또 추천',          description: '로또 번호 추천 노출',              is_active: false, order_index: 105 },
];
