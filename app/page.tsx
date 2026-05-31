'use client';

import { useState } from 'react';
import Link from 'next/link';
import ContactModal from './components/ContactModal';
import { GlassButton } from './components/LiquidGlass';
import { trackCTAClick } from '@/lib/gtag';
import { PORTFOLIO } from '@/lib/freelance-portfolio';

const BEFORE = [
  '작곡 공부에만 최소 6개월 소요',
  '영상 편집 프로그램 학습의 높은 장벽',
  '항상 불안한 저작권 위반 위험',
  '곡 하나 완성에 드는 수백만 원의 외주비',
];

const AFTER = [
  '단 1시간 만에 프로급 음원 & 영상 완성',
  '드래그 앤 드롭 수준의 직관적인 워크플로우',
  '가이드대로 따라하면 완벽한 저작권 해결',
  '커피 한 잔 가격으로 무한대 콘텐츠 생산',
];

const TWEETS_ROW_A = [
  { name: '김민재', handle: 'minjae_shorts', time: '2h', body: '작곡 하나 못 하던 내가 3일 만에 쇼츠 채널 열었다. 프롬프트북 반칙 수준 ㄹㅇ' },
  { name: '이소영', handle: 'cafe_sohyang', time: '5h', body: '매장 BGM 직접 만들어요. 저작권 고민 없이 매달 플레이리스트 갈아끼우는 게 신기함.' },
  { name: '박도현', handle: 'dohyun_side', time: '1d', body: '퇴근 후 1시간 = 쇼츠 한 편. 애드센스 첫 수익이 3주 만에 꽂혔습니다. 팩값 회수 완료.' },
  { name: '정유진', handle: 'yujin_indie', time: '2d', body: '데모 작업 시간이 1/5로. 레퍼런스 탐색 → MV까지 한 번에. 인디 뮤지션들 다 써야 함.' },
  { name: '최현우', handle: 'hyunwoo_tube', time: '3d', body: '구독자 정체기였는데 AI 뮤비 시리즈로 알고리즘 탑승. 조회수 월 +320%.' },
  { name: '한지원', handle: 'jiwon_studio', time: '4d', body: '팩 안에 든 저작권 체크리스트가 실질적. Suno 약관 읽는 시간 아꼈다.' },
  { name: '오세린', handle: 'serin_mv', time: '5d', body: 'Runway 프리셋 그대로 써도 퀄 나옴. 프롬프트 설계가 반이네요.' },
  { name: '강태윤', handle: 'taeyun_ads', time: '6d', body: '광고 BGM 10개 찍어서 외주 드렸더니 클라이언트 반응이 달라졌습니다.' },
];

const TWEETS_ROW_B = [
  { name: '문가은', handle: 'gaeun_beats', time: '3h', body: '가사 생성 템플릿이 진짜 핵심. 한글 랩 가사 붙일 때 막히던 거 뚫렸어요.' },
  { name: '류현석', handle: 'hyun_creator', time: '7h', body: '쇼츠 업로드 루틴이 1시간 안에 끝남. 주말마다 10편씩 쌓고 있습니다.' },
  { name: '배수진', handle: 'sujin_pop', time: '1d', body: 'K-POP 스타일 프롬프트 조합 충격. 레퍼런스 없이도 그 느낌이 나옴.' },
  { name: '송재훈', handle: 'jaehun_lab', time: '2d', body: '1:1 Q&A 답변 속도 미쳤어요. 당일 회신 + 실무 디테일까지.' },
  { name: '조은비', handle: 'eunbi_vlog', time: '3d', body: '브이로그 BGM 자작하니까 조회수 + 체류시간 둘 다 올라감. 데이터가 말함.' },
  { name: '신도윤', handle: 'doyoon_snd', time: '4d', body: '스템 분리본이 포함된 게 진짜 크다. 믹싱 작업 훨씬 편해짐.' },
  { name: '윤채원', handle: 'chaewon_art', time: '5d', body: 'Midjourney 프롬프트 풀 가치가 팩값 넘음. 그냥 사세요.' },
  { name: '임준혁', handle: 'junhyuk_tune', time: '6d', body: '업데이트 진짜로 오네요. 2주 만에 V4.5 프롬프트 가이드 추가됨.' },
];

const CB_CARDS = [
  { href: '/work/freelance', label: '외주 개발', desc: '맞춤 솔루션 · RPA·API 자동화 포함', key: 'freelance' },
  { href: '/work/website', label: '웹사이트', desc: '기업·브랜드 사이트', key: 'website' },
  { href: '/work/saju', label: 'AI 사주', desc: '12개 항목 무료 해석', key: 'saju' },
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState('일반 문의');

  const openContact = (service: string) => {
    setModalService(service);
    setModalOpen(true);
  };

  return (
    <div className="relative overflow-x-hidden bg-black text-white">
      <ContactModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalService('일반 문의');
        }}
        service={modalService}
        checklist={['연락처/이메일', '원하는 작업 범위', '희망 일정']}
      />

      {/* 1. Brand Hero — kx-surface 검정, 60vh, 텍스트 중심 */}
      <section
        className="relative w-full min-h-[60vh] flex items-center justify-center px-6 border-b border-white/10 overflow-hidden"
        style={{ background: 'var(--kx-surface)' }}
      >
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src="/hero-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
          style={{ filter: 'blur(8px)', opacity: 0.35 }}
        />
        <div className="absolute inset-0 bg-black/40 pointer-events-none" aria-hidden />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1
            className="kx-display text-4xl md:text-6xl lg:text-7xl font-bold mb-5 leading-[1.1]"
            style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
          >
            현직 엔지니어가
            <br />직접 만듭니다.
          </h1>
          <p className="text-base md:text-xl text-white/70 leading-relaxed">
            검증된 자동화는 SaaS로. AI 음악 가이드와 커스텀 외주까지.
          </p>
        </div>
      </section>

      {/* 2. Two-up Cards */}
      <section className="py-20 px-6 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Music 카드 */}
          <Link
            href="/music"
            onClick={() => trackCTAClick('home_v7_card_music')}
            className="group relative rounded-2xl border border-white/15 overflow-hidden min-h-[280px] flex flex-col justify-end p-8 hover:border-white/40 transition"
            style={{ textDecoration: 'none' }}
          >
            <video
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              src="/hero-bg.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-hidden
              style={{ opacity: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <p className="font-mono text-[11px] tracking-widest uppercase text-white/60 mb-3">
                Music
              </p>
              <h2 className="kx-display text-2xl md:text-3xl font-bold text-white mb-2">
                AI 음악 제품
              </h2>
              <p className="text-sm md:text-base text-white/70 mb-4">
                Suno 프롬프트 + 뮤비 워크플로우 + 유튜브 SEO 한 팩에.
              </p>
              <p className="font-mono text-xs text-white mb-5">₩39,000~</p>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
                Try now <span aria-hidden>→</span>
              </span>
            </div>
          </Link>

          {/* 커스텀 외주 카드 */}
          <Link
            href="/work"
            onClick={() => trackCTAClick('home_v7_card_work')}
            className="group relative rounded-2xl border border-white/15 overflow-hidden min-h-[280px] flex flex-col justify-end p-8 hover:border-white/40 transition"
            style={{
              textDecoration: 'none',
              background: 'linear-gradient(135deg, var(--kx-surface) 0%, rgba(204,151,255,0.15) 100%)',
              backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 40px)',
            }}
          >
            <div className="relative z-10">
              <p className="font-mono text-[11px] tracking-widest uppercase text-white/60 mb-3">
                Custom Work
              </p>
              <h2 className="kx-display text-2xl md:text-3xl font-bold text-white mb-2">
                커스텀 외주
              </h2>
              <p className="text-sm md:text-base text-white/70 mb-4">
                외주 · 웹사이트 · AI 사주
              </p>
              <p className="text-xs text-white/50 mb-5">납품 5건 · 견적 24h 내 답변</p>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
                견적 문의 <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Music 섹션 — 기존 Features + Before/After + Tweet 마퀴 보존 */}

      {/* 3-1. Features */}
      <section className="py-24 px-6 bg-white text-black border-b border-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="font-mono text-[11px] tracking-widest uppercase text-black/50 mb-4">
              Features
            </p>
            <h2
              className="kx-display text-3xl md:text-5xl font-bold text-black"
              style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
            >
              한 팩에 담긴 3가지 무기.
            </h2>
          </div>

          <div className="space-y-20 lg:space-y-28">
            {[
              {
                label: '01 · Prompt',
                title: '프롬프트 한 줄이 곡이 됩니다.',
                desc: '장르·무드·보컬 톤을 조합한 20+종 프롬프트 북. 복붙 한 번으로 Suno가 이해하는 구조로 변환됩니다.',
                video: '/feature-prompt.mp4',
              },
              {
                label: '02 · Visual',
                title: '비트에 맞춰 영상이 붙습니다.',
                desc: 'Midjourney·Runway·Luma 워크플로우. 가사와 비트를 싱크하는 9:16 쇼츠·16:9 풀버전을 바로 뽑아낼 수 있습니다.',
                video: '/feature-visual.mp4',
              },
              {
                label: '03 · Publish',
                title: '업로드 직전까지 마무리됩니다.',
                desc: '유튜브 제목·해시태그·설명란 SEO 템플릿. 복사-붙여넣기만으로 첫 쇼츠가 당일 채널에 올라갑니다.',
                video: null,
              },
            ].map((f, i) => {
              const reverse = i % 2 === 1;
              return (
                <div
                  key={f.label}
                  className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}
                >
                  <div>
                    <p className="font-mono text-[11px] tracking-widest uppercase text-black/50 mb-4">
                      {f.label}
                    </p>
                    <h3
                      className="kx-display text-2xl md:text-4xl font-bold mb-5 text-black"
                      style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
                    >
                      {f.title}
                    </h3>
                    <p className="text-base md:text-lg text-black/70 leading-relaxed max-w-lg">
                      {f.desc}
                    </p>
                  </div>
                  <div className="relative aspect-video rounded-2xl border border-black/15 bg-black/5 overflow-hidden">
                    {f.video ? (
                      <video
                        className="absolute inset-0 w-full h-full object-cover"
                        src={f.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        aria-hidden
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-mono text-[11px] tracking-widest uppercase text-black/40">
                          Video Placeholder
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3-2. Before / After */}
      <section className="py-24 px-6 bg-black text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono text-[11px] tracking-widest uppercase text-white/50 mb-4">
              Efficiency
            </p>
            <h2
              className="kx-display text-3xl md:text-5xl font-bold"
              style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
            >
              압도적인 제작 효율의 차이.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl border border-white/15 bg-white/[0.02]">
              <p className="font-mono text-[11px] tracking-widest uppercase text-white/50 mb-3">
                Manual Process
              </p>
              <h3 className="text-2xl font-bold mb-6 text-white/60">Before</h3>
              <ul className="space-y-3">
                {BEFORE.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-white/60">
                    <span className="text-white/40">·</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-2xl border border-white bg-white text-black">
              <p className="font-mono text-[11px] tracking-widest uppercase text-black/60 mb-3">
                AI Powered
              </p>
              <h3 className="text-2xl font-bold mb-6">After</h3>
              <ul className="space-y-3">
                {AFTER.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-black/80">
                    <span className="text-black/50">·</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3-3. Use Cases — Tweet Marquee */}
      <section className="py-24 bg-white text-black border-b border-black/10 overflow-hidden">
        <div className="px-6 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono text-[11px] tracking-widest uppercase text-black/50 mb-4">
              Use Cases
            </p>
            <h2
              className="kx-display text-3xl md:text-5xl font-bold"
              style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
            >
              실제로 쓰고 있는 사람들.
            </h2>
          </div>
        </div>

        <div className="space-y-5 marquee-mask">
          {[TWEETS_ROW_A, TWEETS_ROW_B].map((row, rowIdx) => (
            <div key={rowIdx} className="marquee-viewport overflow-hidden">
              <div className={`marquee-track ${rowIdx === 1 ? 'marquee-track-reverse' : ''}`}>
                {[...row, ...row].map((t, i) => (
                  <article
                    key={`${rowIdx}-${i}`}
                    className="shrink-0 w-[320px] sm:w-[360px] p-5 rounded-2xl border border-black/15 bg-black/[0.02]"
                  >
                    <header className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-black/5 border border-black/15 flex items-center justify-center font-bold text-black">
                        {t.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-black text-sm truncate">{t.name}</p>
                        <p className="font-mono text-[11px] text-black/50 truncate">@{t.handle}</p>
                      </div>
                      <span className="font-mono text-[10px] text-black/40 shrink-0">{t.time}</span>
                    </header>
                    <p
                      className="text-sm leading-relaxed text-black/80"
                      style={{ wordBreak: 'keep-all' }}
                    >
                      {t.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 커스텀 외주 섹션 — 카드 + 5건 사례 + 견적 CTA */}
      <section className="py-24 px-6 bg-black text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono text-[11px] tracking-widest uppercase text-white/50 mb-4">
              Custom Work
            </p>
            <h2
              className="kx-display text-3xl md:text-5xl font-bold mb-5"
              style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
            >
              맞춤 개발이 필요하신가요?
            </h2>
            <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              7년차 백엔드 개발자가 직접 설계·개발·납품. 외주, 웹사이트, AI 사주까지.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {CB_CARDS.map((card) => (
              <Link
                key={card.key}
                href={card.href}
                onClick={() => trackCTAClick(`home_v7_cb_card_${card.key}`)}
                className="group rounded-2xl border border-white/15 bg-white/[0.02] p-5 hover:border-white/40 hover:bg-white/[0.05] transition flex flex-col"
              >
                <p className="font-bold text-white text-sm mb-1.5">{card.label}</p>
                <p className="text-xs text-white/60 leading-relaxed flex-1">{card.desc}</p>
                <span aria-hidden="true" className="mt-3 text-white/40 text-xs">→</span>
              </Link>
            ))}
          </div>

          {/* 납품 5건 사례 미리보기 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-12">
            {PORTFOLIO.map((p) => (
              <div
                key={p.title}
                className={`p-4 rounded-2xl border ${p.borderAccent} ${p.accentBg} flex flex-col`}
              >
                <p className={`font-mono text-[9px] uppercase tracking-widest ${p.accentColor} mb-2`}>
                  {p.category}
                </p>
                <h3 className="font-bold text-white text-xs leading-tight mb-1.5">{p.title}</h3>
                <p className="text-[10px] text-white/50 line-clamp-2 flex-1">{p.result}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                trackCTAClick('home_v7_cb_cta');
                openContact('외주 개발 문의');
              }}
              className="kx-btn-primary inline-flex items-center px-7 py-3 rounded-full text-sm"
            >
              견적 문의하기
            </button>
          </div>
        </div>
      </section>

      {/* 5. Final CTA — 어느 쪽이든 시작하세요 */}
      <section className="relative w-full min-h-[400px] flex items-center justify-center px-6 py-24 bg-black overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src="/hero-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
          style={{ filter: 'blur(8px)', opacity: 0.35 }}
        />
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2
            className="kx-display text-3xl md:text-5xl font-bold mb-8"
            style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
          >
            어느 쪽이든 시작하세요.
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <GlassButton
              href="/music"
              onClick={() => trackCTAClick('home_v7_final_music')}
              tint="rgba(255,255,255,0.18)"
              className="text-base"
            >
              <span className="text-white">Music 팩 보기</span>
            </GlassButton>
            <button
              onClick={() => {
                trackCTAClick('home_v7_final_work');
                openContact('외주 개발 문의');
              }}
              className="kx-btn-primary inline-flex items-center justify-center px-7 py-3 rounded-full text-base"
            >
              견적 문의
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
