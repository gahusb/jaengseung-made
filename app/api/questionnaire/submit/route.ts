import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, clientEmail, clientPhone, responses, type } = body;

    if (!responses || typeof responses !== 'object') {
      return NextResponse.json({ error: '응답 데이터가 없습니다.' }, { status: 400 });
    }

    if (!clientName || !clientEmail) {
      return NextResponse.json({ error: '이름과 이메일은 필수입니다.' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from('questionnaire_responses')
      .insert({
        questionnaire_type: type || 'ebay-tool',
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone || null,
        responses,
        status: 'submitted',
      })
      .select('id')
      .single();

    if (error) {
      console.error('[Questionnaire] DB insert error:', error);
      return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error('[Questionnaire] Submit error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
