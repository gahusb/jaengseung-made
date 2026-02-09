import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, service, message } = body;

    // 입력 검증
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: '필수 항목을 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 이메일 발송
    const data = await resend.emails.send({
      from: 'contact@jaengseung-made.com', // Resend에서 인증된 도메인
      to: ['bgg8988@gmail.com'], // 받는 이메일
      subject: `[쟁승메이드] 새로운 문의: ${service || '문의'}`,
      html: `
        <h2>새로운 프로젝트 문의가 도착했습니다</h2>
        <hr />
        <p><strong>이름:</strong> ${name}</p>
        <p><strong>연락처:</strong> ${phone || '미입력'}</p>
        <p><strong>이메일:</strong> ${email}</p>
        <p><strong>서비스:</strong> ${service || '미선택'}</p>
        <hr />
        <h3>문의 내용:</h3>
        <p style="white-space: pre-wrap;">${message}</p>
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
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: '메일 전송에 실패했습니다. 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
