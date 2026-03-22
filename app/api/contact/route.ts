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
    const name    = sanitizeStr(body.name,    INPUT_LIMITS.NAME);
    const phone   = sanitizeStr(body.phone,   INPUT_LIMITS.PHONE);
    const email   = sanitizeStr(body.email,   INPUT_LIMITS.EMAIL);
    const service = sanitizeStr(body.service, INPUT_LIMITS.SERVICE);
    const message = sanitizeStr(body.message, INPUT_LIMITS.MESSAGE);

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

    await resend.emails.send({
      from: 'onboarding@resend.dev',
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

    return NextResponse.json(
      { success: true, message: '문의가 성공적으로 전송되었습니다!' },
      { status: 200 }
    );
  } catch (error) {
    // 클라이언트에 내부 오류 상세 노출 금지
    console.error('[Contact] Email send error:', error);
    return NextResponse.json(
      { error: '메일 전송에 실패했습니다. 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
