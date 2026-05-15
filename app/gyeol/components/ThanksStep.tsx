'use client';

import Link from 'next/link';

interface Props {
  emailEntered: boolean;
}

export default function ThanksStep({ emailEntered }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center text-white">
      <div className="mb-10">
        <h2
          className="kx-display text-3xl md:text-5xl font-bold mb-5"
          style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
        >
          감사합니다.
        </h2>
        <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-md">
          답변이 큰 도움이 됐어요.
          {emailEntered && (
            <>
              <br />
              결과는 추후 입력하신 이메일로 공유드릴게요.
            </>
          )}
        </p>
      </div>

      <Link
        href="/"
        className="text-sm text-white/50 hover:text-white underline underline-offset-4 transition"
      >
        쟁승메이드 홈으로 →
      </Link>
    </div>
  );
}
