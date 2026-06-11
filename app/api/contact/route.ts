import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  escapeHtml,
  isValidEmail,
  sanitizeStr,
  checkRateLimit,
  getClientIp,
  INPUT_LIMITS,
} from '@/lib/security';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { sendRequestReceivedEmail } from '@/lib/request-emails';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // ── Rate Limit: IP당 1분 5회 ──────────────────────────────
    const ip = getClientIp(request);
    const rl = checkRateLimit(`contact:${ip}`, 60_000, 5);
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

    // ── 입력 정제 + 길이 제한 ─────────────────────────────────
    const name        = sanitizeStr(body.name,        INPUT_LIMITS.NAME);
    const phone       = sanitizeStr(body.phone,       INPUT_LIMITS.PHONE);
    const email       = sanitizeStr(body.email,       INPUT_LIMITS.EMAIL);
    const service     = sanitizeStr(body.service,     INPUT_LIMITS.SERVICE);
    const message     = sanitizeStr(body.message,     INPUT_LIMITS.MESSAGE);
    // 구조화 필드 (선택값 — 미전송 시 빈 문자열)
    const projectType = sanitizeStr(body.projectType, 100);
    const budget      = sanitizeStr(body.budget,      100);
    const timeline    = sanitizeStr(body.timeline,    100);

    // ── 필수값 검증 ───────────────────────────────────────────
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: '필수 항목을 모두 입력해주세요.' },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // ── HTML 이스케이프 (XSS 방지) ────────────────────────────
    const safeSubject = escapeHtml(service || '문의');
    const safeName    = escapeHtml(name);
    const safePhone   = escapeHtml(phone || '미입력');
    const safeEmail   = escapeHtml(email);
    const safeService = escapeHtml(service || '미선택');
    // message는 pre-wrap으로 렌더링되므로 반드시 이스케이프
    const safeMessage = escapeHtml(message);

    // ── 로그인 사용자 확인 (optional) ─────────────────────────
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      userId = data?.user?.id ?? null;
    } catch {
      // 비로그인 상태 — 무시
    }

    // ── 이메일 전송 ──────────────────────────────────────────
    let emailSent = true;
    try {
      await resend.emails.send({
        from: '쟁승메이드 <noreply@jaengseung-made.com>',
        to: ['bgg8988@gmail.com'],
        replyTo: email,
        subject: `[쟁승메이드] 새로운 문의: ${safeSubject}`,
        html: `
          <h2>새로운 프로젝트 문의가 도착했습니다</h2>
          <hr />
          <p><strong>이름:</strong> ${safeName}</p>
          <p><strong>연락처:</strong> ${safePhone}</p>
          <p><strong>이메일:</strong> ${safeEmail}</p>
          <p><strong>서비스:</strong> ${safeService}</p>
          <hr />
          <h3>문의 내용:</h3>
          <p style="white-space: pre-wrap;">${safeMessage}</p>
          <hr />
          <p style="color: #666; font-size: 12px;">
            이 메일은 jaengseung-made.com의 문의 폼에서 발송되었습니다.
          </p>
        `,
      });
    } catch (emailError) {
      console.error('[Contact] Email send error:', emailError);
      emailSent = false;
    }

    // ── 추적 토큰 생성 ────────────────────────────────────────
    let publicToken: string;
    try {
      publicToken = globalThis.crypto.randomUUID();
    } catch {
      const { randomUUID } = await import('crypto');
      publicToken = randomUUID();
    }

    // ── DB 저장 (이메일 성공/실패 무관) ──────────────────────
    // 신규 컬럼 포함 insert 시도 → 컬럼 부재(42703) 시 기존 필드만으로 재시도
    let tokenStored = false;
    try {
      const admin = createAdminClient();
      const { error: insertError } = await admin.from('contact_requests').insert({
        name,
        email,
        phone: phone || null,
        service: service || null,
        message,
        user_id: userId,
        public_token: publicToken,
        project_type: projectType || null,
        budget: budget || null,
        timeline: timeline || null,
      });

      if (insertError) {
        // PostgreSQL undefined_column (42703) — 마이그레이션 미적용 환경 폴백
        const pgCode = (insertError as { code?: string }).code;
        if (pgCode === '42703') {
          console.warn('[Contact] 신규 컬럼 없음(42703) — 기존 필드만으로 재시도');
          const { error: fallbackError } = await admin.from('contact_requests').insert({
            name,
            email,
            phone: phone || null,
            service: service || null,
            message,
            user_id: userId,
          });
          if (fallbackError) {
            console.error('[Contact] DB fallback insert error:', fallbackError);
          }
          // tokenStored는 false 유지 (공개 토큰이 DB에 없음)
        } else {
          console.error('[Contact] DB insert error:', insertError);
        }
      } else {
        tokenStored = true;
      }
    } catch (dbError) {
      console.error('[Contact] DB insert error:', dbError);
    }

    // ── 고객 접수 확인 메일 (신규 컬럼 insert 성공 시에만) ──
    if (tokenStored) {
      try {
        await sendRequestReceivedEmail({
          name,
          email,
          service: service || '외주 문의',
          publicToken,
        });
      } catch (confirmEmailError) {
        console.error('[Contact] 고객 확인 메일 발송 오류:', confirmEmailError);
      }
    }

    if (!emailSent) {
      return NextResponse.json(
        { error: '메일 전송에 실패했습니다. 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: '문의가 성공적으로 전송되었습니다!',
        trackUrl: tokenStored ? `/track/${publicToken}` : null,
      },
      { status: 200 }
    );
  } catch (error) {
    // 클라이언트에 내부 오류 상세 노출 금지
    console.error('[Contact] Unexpected error:', error);
    return NextResponse.json(
      { error: '문의 처리 중 오류가 발생했습니다. 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
