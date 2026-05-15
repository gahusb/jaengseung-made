import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/admin';
import { isValidEmail, sanitizeStr, checkRateLimit, getClientIp, INPUT_LIMITS } from '@/lib/security';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Rate Limit: IP당 1분 5회
    const ip = getClientIp(request);
    const rl = checkRateLimit(`survey:${ip}`, 60_000, 5);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
        {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) },
        }
      );
    }

    const body = await request.json();

    // 기본 validation — Q1, Q2는 필수
    if (!body.age_range || !body.status || !body.awareness_freq) {
      return NextResponse.json(
        { error: '필수 응답이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 입력 정제
    const tools_other = body.tools_other ? sanitizeStr(body.tools_other, 200) : null;
    const free_opinion = body.free_opinion ? sanitizeStr(body.free_opinion, 2000) : null;
    const email = body.email ? sanitizeStr(body.email, INPUT_LIMITS.EMAIL) : null;
    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // DB INSERT (service role — RLS 우회)
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('survey_responses')
      .insert({
        age_range: body.age_range,
        status: body.status,
        awareness_freq: body.awareness_freq,
        tools_used: Array.isArray(body.tools_used) ? body.tools_used : null,
        tools_other,
        cost_range: body.cost_range ?? null,
        best_tool: body.best_tool ?? null,
        best_satisfy: typeof body.best_satisfy === 'number' ? body.best_satisfy : null,
        free_opinion,
        email,
        user_agent: body.user_agent ? sanitizeStr(body.user_agent, 500) : null,
        referrer: body.referrer ? sanitizeStr(body.referrer, 500) : null,
        utm_source: body.utm_source ? sanitizeStr(body.utm_source, 100) : null,
        utm_medium: body.utm_medium ? sanitizeStr(body.utm_medium, 100) : null,
        utm_campaign: body.utm_campaign ? sanitizeStr(body.utm_campaign, 100) : null,
        completion_seconds: typeof body.completion_seconds === 'number' ? body.completion_seconds : null,
      })
      .select()
      .single();

    if (error) {
      console.error('[Survey] DB insert error:', error);
      return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 });
    }

    // Resend 즉시 확인 메일 (이메일 입력 시만)
    if (email) {
      try {
        await resend.emails.send({
          from: '쟁승메이드 <noreply@jaengseung-made.com>',
          to: email,
          subject: 'CONTOUR 설문 참여 감사드립니다',
          html: `<p>안녕하세요,</p>
                 <p>설문에 참여해주셔서 감사합니다. 결과는 추후 공유드리겠습니다.</p>
                 <p>— 쟁승메이드</p>`,
        });
        await supabase
          .from('survey_responses')
          .update({ email_confirmation_sent: true })
          .eq('id', data.id);
      } catch (mailErr) {
        console.error('[Survey] Resend error:', mailErr);
        // 메일 실패는 응답 저장 성공에 영향 X
      }
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (e) {
    console.error('[Survey] Unexpected error:', e);
    return NextResponse.json({ error: '제출 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
