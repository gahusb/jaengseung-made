import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Music — AI 음악 제품',
};

const CARDS = [
  {
    href: '/music/packs',
    label: '팩 상세',
    desc: '입문 ₩39,000부터 — Suno 프롬프트북 + 뮤비 워크플로우 + SEO 템플릿',
    key: 'packs',
  },
  {
    href: '/music/samples',
    label: '샘플 갤러리',
    desc: '실제 결과물 — 장르별 데모 + 가사 + 영상 미리보기',
    key: 'samples',
  },
  {
    href: '/music/studio',
    label: 'AI 스튜디오',
    desc: 'Suno API 연동 — 직접 트랙 생성 (베타)',
    key: 'studio',
  },
];

export default function MusicHub() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative w-full min-h-[60vh] flex items-center justify-center px-6 border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#060e20] to-black pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-mono text-[11px] tracking-widest uppercase text-white/50 mb-4">
            Music
          </p>
          <h1
            className="kx-display text-4xl md:text-6xl font-bold mb-5"
            style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
          >
            AI 음악 제품
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Suno 프롬프트 + 뮤직비디오 워크플로우 + 유튜브 SEO 템플릿. 한 팩에 담긴 4단계 워크플로우로 1시간 안에 결과물 완성.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {CARDS.map((c) => (
            <Link
              key={c.key}
              href={c.href}
              className="group rounded-2xl border border-white/15 bg-white/[0.02] p-7 hover:border-white/40 hover:bg-white/[0.05] transition flex flex-col"
              style={{ textDecoration: 'none' }}
            >
              <h2 className="kx-display text-xl md:text-2xl font-bold text-white mb-3">
                {c.label}
              </h2>
              <p className="text-sm md:text-base text-white/60 leading-relaxed flex-1">
                {c.desc}
              </p>
              <span aria-hidden="true" className="mt-4 text-white/40 text-xs">→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
