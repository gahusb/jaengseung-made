'use client';

import { useState } from 'react';
import Link from 'next/link';
import PurchaseAgreementModal from '../../components/PurchaseAgreementModal';

type Tier = 'starter' | 'pro' | 'master';

const TIERS: Record<Tier, { name: string; price: string; priceNum: string; desc: string; features: string[]; highlight?: boolean }> = {
  starter: {
    name: '입문',
    price: '₩39,000',
    priceNum: '39,000',
    desc: '첫 AI 음악을 위한 필수 구성',
    features: [
      'Suno 프롬프트 조합법 20종',
      '구조 템플릿 PDF 40p',
      '저작권 가이드 기본판',
      '12개월 무료 업데이트',
    ],
  },
  pro: {
    name: '프로',
    price: '₩99,000',
    priceNum: '99,000',
    desc: '쇼츠 업로드까지 완성하는 풀세트',
    highlight: true,
    features: [
      '입문 전체 포함',
      'MV 워크플로우 (Runway · Luma · Pika)',
      '샘플 프로젝트 1개 (.prj · 영상)',
      '1:1 Q&A 1회 + 유튜브 SEO 템플릿',
    ],
  },
  master: {
    name: '마스터',
    price: '₩149,000',
    priceNum: '149,000',
    desc: '여러 장르·포맷을 커버하는 마스터피스',
    features: [
      '프로 전체 포함',
      '샘플 프로젝트 장르별 3종',
      '저작권 심화판 + 상업 이용 체크리스트',
      '우선 업데이트 · 제작 레시피 영상',
    ],
  },
};

const PROCESS = [
  {
    num: '01',
    title: '크리에이티브 디렉팅',
    subtitle: 'Concept & Lyrics',
    customer: '원하는 키워드 3개 또는 사연 제공',
    value: 'ChatGPT·Claude로 Suno가 이해하는 가사·스타일 태그로 변환',
    result: 'AI 최적화 가사 · 메타데이터 시트',
    color: 'from-violet-500 to-fuchsia-500',
  },
  {
    num: '02',
    title: '오디오 엔지니어링',
    subtitle: 'Music Generation',
    customer: '결과물 확인 · 방향 피드백',
    value: 'Suno Custom Mode로 가사 배치·파트·보컬·악기 세밀 조정. 가장 높은 퀄리티가 나올 때까지 프롬프트 깎기',
    result: '고품질 완곡 (Full Track, 스템 분리본)',
    color: 'from-fuchsia-500 to-pink-500',
  },
  {
    num: '03',
    title: '비주얼 마스터링',
    subtitle: 'AI MV Generation',
    customer: '-',
    value: 'Midjourney · Runway · Luma로 음악 분위기에 맞는 이미지·영상 생성. 비트와 가사에 맞춘 싱크 설계',
    result: '쇼츠(9:16) 또는 유튜브(16:9) 고화질 영상',
    color: 'from-sky-500 to-cyan-500',
  },
  {
    num: '04',
    title: '퍼블리싱 가이드',
    subtitle: 'Viral Optimization',
    customer: '유튜브 업로드',
    value: '제목·해시태그·설명란(SEO) AI 최적화 템플릿 제공',
    result: '즉시 업로드 가능한 유튜브 배포 패키지',
    color: 'from-cyan-500 to-emerald-500',
  },
];

const FAQS = [
  {
    q: 'Suno 유료 플랜 가입이 꼭 필요한가요?',
    a: 'Suno 무료 플랜은 상업적 이용이 제한됩니다. 본인 결과물을 유튜브·SNS에 업로드해 수익화하려면 Suno Pro 이상 권장. 팩 구매 후 가입 전 플랜 선택 가이드가 포함됩니다.',
  },
  {
    q: '제가 만든 결과물의 상업 이용·저작권은?',
    a: '결과물의 상업권은 고객이 가입한 AI 서비스의 이용약관을 따릅니다. 팩에는 Suno·Runway·Luma 각 서비스의 최신 약관 요약과 상업 이용 체크리스트가 포함되어 있습니다. (법률 자문이 아닌 참고용 가이드입니다.)',
  },
  {
    q: '결과물 품질을 보장하나요?',
    a: 'AI 생성물은 모델 버전·프롬프트 입력에 따라 달라지므로 결과물 자체를 보장하지 않습니다. 다만 팩은 동일 프롬프트로 반복 가능한 고품질 구간을 설계하는 방법을 제공합니다. 샘플 쇼츠·프로젝트로 품질 기대치를 사전 확인하세요.',
  },
  {
    q: '환불이 가능한가요?',
    a: '전자상거래법 제17조 제2항 제5호에 따라 디지털 콘텐츠는 제공 시작 후 청약철회가 제한됩니다. 무료 샘플로 사전 확인을 제공하므로 충분히 검토 후 구매해주세요. 파일 손상·전달 불량 등 회사 귀책은 즉시 재전달 또는 환불됩니다.',
  },
  {
    q: '업데이트는 어떻게 받나요?',
    a: '구매자 전용 Notion 페이지에서 변경 이력과 최신 파일을 제공. 12개월간 무료 업데이트가 기본, 마스터는 우선 업데이트·베타 선공개가 포함됩니다.',
  },
];

export default function MusicServicePage() {
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-full bg-slate-950 text-white">
      {/* HERO — 결과 중심 2-column */}
      <section className="px-6 pt-16 pb-14 lg:px-14 bg-slate-950 border-b border-white/5">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* 좌: 카피 + CTA */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="inline-flex h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="font-mono text-[11px] tracking-widest uppercase text-violet-300/80">
                AI MUSIC PACK · v1
              </span>
            </div>
            <h1
              className="kx-display text-[2.25rem] md:text-[3.25rem] font-extrabold leading-[1.1] mb-5"
              style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
            >
              한 줄이면,
              <br />
              <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
                노래가 됩니다.
              </span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              Suno 프롬프트, 뮤직비디오 워크플로우, 저작권 가이드.
              <br className="hidden sm:block" />
              쇼츠 한 편을 완성하는 모든 것을 한 팩에.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-400 text-white px-7 py-4 rounded-xl font-extrabold text-sm transition-colors shadow-[0_12px_40px_-12px_rgba(139,92,246,0.6)]"
              >
                ₩39,000부터 시작 →
              </a>
              <Link
                href="/services/music/samples"
                className="inline-flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 hover:bg-white/5 text-white px-7 py-4 rounded-xl font-semibold text-sm transition-colors"
              >
                실제 샘플 보기
              </Link>
            </div>
          </div>

          {/* 우: 결과 프리뷰 */}
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-violet-500/20 to-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
            <div
              className="relative aspect-[9/16] max-w-[320px] mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-violet-900/40"
              style={{ background: 'linear-gradient(135deg,#1e1b4b 0%,#0f172a 60%,#0b0530 100%)' }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-5xl mb-3">🎬</div>
                <p className="font-mono text-[10px] tracking-widest text-violet-300/80 uppercase mb-1">
                  FEATURED SHORT
                </p>
                <p className="text-sm text-white font-semibold">TOP 샘플 미리보기</p>
                <p className="text-[11px] text-slate-400 mt-1">9:16 · 58초</p>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-white border border-white/10">
                  Suno V4
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-white border border-white/10">
                  제작 1시간
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING — 상세 최상단 */}
      <section id="pricing" className="px-6 py-14 lg:px-14 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
            <div>
              <p className="font-mono text-xs text-violet-300/70 tracking-widest uppercase mb-1">Pricing · 1회 결제</p>
              <h2 className="text-2xl md:text-3xl font-extrabold">3개 티어, 목표에 맞게 선택</h2>
            </div>
            <Link href="/services/music/samples" className="text-sm text-violet-300 hover:text-violet-200 underline underline-offset-4">
              샘플 먼저 보기 →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5 items-stretch">
            {(Object.keys(TIERS) as Tier[]).map((key) => {
              const t = TIERS[key];
              return (
                <div
                  key={key}
                  className={`relative rounded-2xl p-8 flex flex-col border transition-all ${
                    t.highlight
                      ? 'border-violet-400 bg-gradient-to-br from-violet-900/40 to-slate-900 shadow-[0_0_60px_rgba(139,92,246,0.35)] md:scale-[1.03] md:-translate-y-2'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/30'
                  }`}
                >
                  {t.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-violet-500 to-pink-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        🔥 가장 많이 팔림
                      </span>
                    </div>
                  )}
                  <h3 className="font-extrabold text-2xl mb-1">{t.name}</h3>
                  <p className="text-sm text-slate-400 mb-6">{t.desc}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold font-mono">{t.price}</span>
                    <span className="text-xs text-slate-500 ml-2">1회 결제</span>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-200 mb-8 flex-1">
                    {t.features.map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setSelectedTier(key)}
                    className={`w-full py-4 rounded-xl font-extrabold text-sm transition-colors ${
                      t.highlight
                        ? 'bg-violet-500 hover:bg-violet-400 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {t.name} 구매하기 →
                  </button>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 text-center mt-8">
            구매 전 <Link href="/legal/refund" className="underline hover:text-white">환불 정책</Link>을 반드시 확인해주세요.
            디지털 콘텐츠 특성상 제공 시작 후 청약철회가 제한됩니다.
          </p>
        </div>
      </section>

      {/* 팩 구성품 */}
      <section className="px-6 py-16 lg:px-14 bg-slate-950 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs text-violet-300/70 tracking-widest uppercase mb-2">What's Included</p>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8">팩 구성품</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: '📄', title: 'Suno 프롬프트 북', desc: '장르·무드·보컬 톤 조합법 20+종. 복붙해서 바로 사용하는 PDF.' },
              { icon: '🎬', title: 'MV 워크플로우', desc: 'Midjourney·Runway·Luma로 비트 싱크 영상 만드는 단계별 가이드.' },
              { icon: '⚖️', title: '저작권 & 상업 이용', desc: 'Suno·Runway 약관 요약 + 수익화 전 안전 체크리스트.' },
              { icon: '📦', title: '샘플 프로젝트 파일', desc: '완성된 가사·프롬프트·영상 세트. 그대로 수정해 재사용 가능.' },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 p-6 rounded-2xl border border-white/10 bg-white/[0.02]"
              >
                <div className="text-2xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS — 4 STEPS (컴팩트) */}
      <section className="px-6 py-16 lg:px-14 bg-gradient-to-b from-slate-950 to-[#0b0530]">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs text-violet-300/70 tracking-widest uppercase mb-2">
            Process
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-10" style={{ wordBreak: 'keep-all' }}>
            컨셉 → 음악 → 비주얼 → 퍼블리싱
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS.map((step) => (
              <div
                key={step.num}
                className="rounded-2xl p-6 border border-white/10 bg-white/[0.02] hover:border-violet-400/40 transition-colors"
              >
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${step.color} font-extrabold text-sm text-white mb-4`}
                >
                  {step.num}
                </div>
                <p className="font-mono text-[10px] text-violet-300/60 uppercase tracking-widest mb-1">
                  {step.subtitle}
                </p>
                <h3 className="text-lg font-extrabold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                  {step.result}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLES — 컴팩트 링크 */}
      <section id="samples" className="px-6 py-12 lg:px-14 bg-[#0b0530] border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-violet-300/70 tracking-widest uppercase mb-1">Samples</p>
            <h2 className="text-xl md:text-2xl font-extrabold">이 팩으로 만든 실제 쇼츠들</h2>
          </div>
          <Link
            href="/services/music/samples"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-violet-400/40 bg-violet-500/10 hover:bg-violet-500/20 text-sm font-semibold text-violet-200 transition whitespace-nowrap"
          >
            전체 샘플 갤러리 →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 lg:px-14 bg-slate-950">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-10">
            자주 묻는 질문
          </h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-white text-sm">{f.q}</span>
                  <span className={`text-violet-400 text-xl transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-slate-300 leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky 바텀 CTA */}
      <div
        className="fixed bottom-0 inset-x-0 z-40 border-t border-white/10 backdrop-blur-md"
        style={{ background: 'rgba(6,14,32,0.85)' }}
      >
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-mono text-violet-300/70 tracking-widest uppercase">From</p>
            <p className="text-white font-extrabold text-lg leading-tight">
              ₩39,000 <span className="text-xs text-slate-400 font-medium">· 1회 결제</span>
            </p>
          </div>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 text-white px-6 py-3 rounded-xl font-extrabold text-sm transition-colors shadow-[0_8px_30px_-8px_rgba(139,92,246,0.6)] whitespace-nowrap"
          >
            팩 선택하기 →
          </a>
        </div>
      </div>
      <div className="h-20" aria-hidden />

      {selectedTier && (
        <PurchaseAgreementModal
          isOpen={!!selectedTier}
          onClose={() => setSelectedTier(null)}
          productName={`AI 음악 마스터 팩 · ${TIERS[selectedTier].name}`}
          price={TIERS[selectedTier].price}
        />
      )}
    </div>
  );
}
