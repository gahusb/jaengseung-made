'use client';

interface Props {
  onStart: () => void;
}

/**
 * 인트로 step — CONTOUR 로고 + 한글 부제 + 시작 버튼.
 * spec design PNG 1번째 화면 참조.
 */
export default function IntroStep({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center text-white">
      {/* 로고 */}
      <div className="mb-10">
        <h1
          className="kx-display text-5xl md:text-7xl font-black tracking-[0.15em] mb-4"
          style={{
            background: 'linear-gradient(135deg, #cc97ff 0%, #53ddfc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          CONTOUR
        </h1>
        <p className="text-base md:text-lg text-white/70 leading-relaxed">
          나를 더 선명하게 이해하는 3분
        </p>
      </div>

      {/* 시작 버튼 */}
      <button
        type="button"
        onClick={onStart}
        className="kx-btn-primary px-10 py-3 rounded-full text-base font-bold"
      >
        시작하기
      </button>

      <p className="mt-6 text-xs text-white/40 font-mono">7 질문 · 약 3분</p>
    </div>
  );
}
