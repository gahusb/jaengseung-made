import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI 음악·뮤비 샘플 갤러리',
  description: '쟁승메이드 AI 음악 팩으로 제작한 샘플 뮤직비디오 모음. 장르별 결과물을 직접 확인하세요.',
};

type Sample = {
  id: string;
  title: string;
  genre: string;
  duration: string;
  views?: string;
  featured?: boolean;
  embedId?: string;
};

const SAMPLES: Sample[] = [
  { id: 's1', title: 'K-POP 스타일 TOP 샘플', genre: 'K-POP', duration: '0:45', featured: true },
  { id: 's2', title: 'Lo-fi 감성 MV', genre: 'Lo-fi', duration: '1:02' },
  { id: 's3', title: '시티팝 무드 영상', genre: 'City Pop', duration: '0:58' },
  { id: 's4', title: 'EDM 쇼츠 훅', genre: 'EDM', duration: '0:30' },
  { id: 's5', title: '발라드 감성 컷', genre: 'Ballad', duration: '1:10' },
  { id: 's6', title: '트랩 비트 쇼츠', genre: 'Trap', duration: '0:35' },
];

export default function MusicSamplesPage() {
  return (
    <div className="px-6 py-20 lg:px-14" style={{ background: 'var(--kx-surface)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="kx-label">SAMPLE GALLERY</span>
          <h1 className="kx-display text-3xl md:text-5xl font-bold mt-3 mb-4" style={{ color: 'var(--kx-on-surface)' }}>
            AI 음악·뮤비 샘플 모음
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base" style={{ color: 'var(--kx-on-variant)' }}>
            팩 워크플로우로 제작된 결과물입니다. 장르별로 다양한 톤을 확인해보세요.
            <br className="hidden md:block" />
            <span className="text-xs" style={{ color: 'var(--kx-on-variant)' }}>
              일부 샘플은 런칭 직후 순차 공개됩니다.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {SAMPLES.map((s) => (
            <div
              key={s.id}
              className={`group relative aspect-[9/16] rounded-2xl overflow-hidden border ${
                s.featured ? 'border-violet-400/50 shadow-2xl shadow-violet-900/40' : 'border-white/10'
              }`}
              style={{ background: 'linear-gradient(135deg, #1a0840 0%, #061228 100%)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/15 to-cyan-500/10 group-hover:from-violet-500/25 group-hover:to-cyan-500/20 transition-all" />

              {s.featured && (
                <span
                  className="absolute top-3 left-3 z-10 text-[10px] px-2 py-1 rounded-full font-semibold tracking-widest"
                  style={{ background: 'rgba(204,151,255,0.2)', color: 'var(--kx-primary)', border: '1px solid rgba(204,151,255,0.5)' }}
                >
                  TOP
                </span>
              )}

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-5">
                <div className="text-5xl mb-3 opacity-80 group-hover:scale-110 transition-transform">🎬</div>
                <p className="text-[10px] md:text-xs font-mono tracking-widest text-violet-300/80 mb-1">{s.genre.toUpperCase()}</p>
                <p className="text-sm md:text-base font-semibold" style={{ color: 'var(--kx-on-surface)' }}>
                  {s.title}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--kx-on-variant)' }}>{s.duration}</p>
                <p className="text-[10px] mt-3 opacity-60" style={{ color: 'var(--kx-on-variant)' }}>
                  {s.embedId ? '영상 재생' : '영상 준비 중'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-16 text-center p-10 kx-glass"
          style={{ border: '1px solid rgba(204,151,255,0.12)', borderRadius: '0.75rem 0.75rem 0.125rem 0.125rem' }}
        >
          <span className="kx-label">NEXT</span>
          <h2 className="kx-display text-2xl md:text-3xl font-bold mt-2 mb-3" style={{ color: 'var(--kx-on-surface)' }}>
            내 채널에도 이런 쇼츠 올리고 싶다면
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--kx-on-variant)' }}>
            동일 워크플로우 팩 ₩39,000부터.
          </p>
          <Link
            href="/music/packs#pricing"
            className="kx-btn-primary px-8 py-3.5 rounded-full text-sm inline-flex"
          >
            팩 가격 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
