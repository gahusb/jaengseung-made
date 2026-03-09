import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    const { interpretation, birthKey } = await request.json();

    if (!interpretation || !birthKey) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 });
    }

    // 기존 레코드 확인 (중복 저장 방지)
    const { data: existing } = await supabase
      .from('saju_records')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_paid', true)
      .contains('saju_data', birthKey)
      .maybeSingle();

    if (existing) {
      // 기존 레코드 업데이트
      await supabase
        .from('saju_records')
        .update({ interpretation })
        .eq('id', existing.id);
    } else {
      // 새 레코드 생성
      await supabase.from('saju_records').insert({
        user_id: user.id,
        saju_data: birthKey,
        interpretation,
        is_paid: true,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save interpretation error:', error);
    return NextResponse.json({ error: '저장 실패' }, { status: 500 });
  }
}
