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
      '기본 가사 최적화 템플릿',
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
      '고급 편집법 (Stems 분리 · 마스터링 프롬프트)',
      'MV 비디오 생성 워크플로우 (Runway/Luma/Pika)',
      '샘플 프로젝트 1개 (.prj · 영상 포함)',
      '이메일/페이지 1:1 Q&A 1회 (30일 이내)',
      '유튜브 SEO 템플릿',
    ],
  },
  master: {
    name: '마스터',
    price: '₩149,000',
    priceNum: '149,000',
    desc: '여러 장르·포맷을 커버하는 마스터피스',
    features: [
      '프로 전체 포함',
      '샘플 프로젝트 다수 (장르별 3종)',
      '우선 업데이트 · 베타 기능 선공개',
      '저작권 가이드 심화판 + 상업 이용 체크리스트',
      '제작 레시피 영상 가이드',
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
      {/* HERO */}
      <section
        className="relative overflow-hidden px-6 py-24 lg:px-14 lg:py-32"
        style={{
          background:
            'radial-gradient(circle at 25% 20%, #2e1065 0%, #020617 55%), radial-gradient(circle at 80% 80%, #164e63 0%, transparent 50%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")",
          }}
        />

        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-flex h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="font-mono text-xs text-violet-300/80 tracking-[0.25em] uppercase">
              AI Music Pack · v1
            </span>
          </div>

          <h1
            className="text-[2.8rem] md:text-[4rem] lg:text-[5.5rem] font-extrabold leading-[1.02] tracking-tight mb-6"
            style={{ wordBreak: 'keep-all' }}
          >
            <span className="text-white">네 사연을 노래로.</span>
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-pink-200 to-cyan-300 bg-clip-text text-transparent">
              쇼츠까지 한 번에.
            </span>
          </h1>

          <p
            className="text-slate-300 text-lg md:text-xl leading-relaxed mb-3 max-w-2xl"
            style={{ wordBreak: 'keep-all' }}
          >
            AI로 음악을 뽑는 게 아니라, <span className="text-white font-semibold">고품질 결과물을 빠르게</span> 뽑는 법을 팝니다.
          </p>
          <p className="text-slate-400 text-base mb-10 max-w-2xl">
            7년차 개발자가 설계한 <span className="text-white">4단계 AI 음악 공정</span> · Suno Pro 검증.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl font-bold text-sm transition-colors shadow-[0_0_40px_rgba(139,92,246,0.45)]"
            >
              팩 둘러보기
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#samples"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-white/90 hover:text-white px-8 py-4 rounded-xl font-semibold text-sm transition-all"
            >
              ▶ 샘플 쇼츠 보기
            </a>
          </div>

          <div className="flex flex-wrap gap-5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">✅ 평생 업데이트</span>
            <span className="flex items-center gap-1.5">✅ 즉시 다운로드</span>
            <span className="flex items-center gap-1.5">✅ Suno Pro 검증 샘플</span>
          </div>
        </div>

        {/* Bottom waveform */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-40 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60 L1200,120 L0,120 Z"
              fill="url(#wg)"
            />
            <defs>
              <linearGradient id="wg" x1="0%" x2="100%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="px-6 py-20 lg:px-14 bg-slate-950 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-xs text-violet-300/70 tracking-widest uppercase mb-2 text-center">
            Before vs After
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
            AI 음악, 왜 다들 어렵다고 할까요?
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="border border-rose-500/20 bg-rose-500/5 rounded-2xl p-8">
              <div className="text-4xl mb-3">😵</div>
              <h3 className="font-extrabold text-rose-300 mb-3 text-lg">Before · 대충 뽑은 결과</h3>
              <ul className="space-y-2 text-sm text-slate-300 leading-relaxed">
                <li>• Suno 10번 돌렸는데 다 별로…</li>
                <li>• 가사가 이상하게 붙음</li>
                <li>• 영상 만들려니 뭐부터 할지 모름</li>
                <li>• 유튜브 올려도 조회수 0</li>
              </ul>
            </div>
            <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-2xl p-8 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-extrabold text-emerald-300 mb-3 text-lg">After · 구조를 쓴 결과</h3>
              <ul className="space-y-2 text-sm text-slate-200 leading-relaxed">
                <li>• 프롬프트 1번으로 원하는 무드 적중</li>
                <li>• 30분 만에 쇼츠까지 완성</li>
                <li>• 저작권·상업 이용 안전 체크</li>
                <li>• SEO 템플릿으로 노출 최적화</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS — 4 STEPS */}
      <section className="px-6 py-24 lg:px-14 bg-gradient-to-b from-slate-950 to-[#0b0530]">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-xs text-violet-300/70 tracking-widest uppercase mb-2">
            Process Architecture
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ wordBreak: 'keep-all' }}>
            컨셉 → 음악 → 비주얼 → 퍼블리싱,
          </h2>
          <p className="text-slate-400 text-lg mb-16">한 번에 이어지는 4단계 공정 설계도.</p>

          <div className="space-y-6">
            {PROCESS.map((step) => (
              <div
                key={step.num}
                className="group relative border border-white/10 hover:border-violet-400/50 rounded-3xl p-8 md:p-10 bg-white/[0.02] backdrop-blur transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div
                      className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} font-extrabold text-2xl text-white shadow-lg`}
                    >
                      {step.num}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-[11px] text-violet-300/60 uppercase tracking-widest mb-1">
                      {step.subtitle}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                      {step.title}
                    </h3>
                    <dl className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <dt className="text-slate-500 text-xs uppercase font-bold mb-1">고객 역할</dt>
                        <dd className="text-slate-300 leading-relaxed">{step.customer}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-500 text-xs uppercase font-bold mb-1">나의 가치</dt>
                        <dd className="text-slate-300 leading-relaxed">{step.value}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-500 text-xs uppercase font-bold mb-1">결과물</dt>
                        <dd className="text-white font-semibold leading-relaxed">{step.result}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLES */}
      <section id="samples" className="px-6 py-20 lg:px-14 bg-[#0b0530]">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-xs text-violet-300/70 tracking-widest uppercase mb-2">
            Sample Showcase
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            이 쇼츠, 이 팩으로 만들었어요.
          </h2>
          <p className="text-slate-400 mb-10">30분 만에 나온 결과물을 직접 들어보세요.</p>

          <div className="grid sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[9/16] rounded-2xl border border-white/10 bg-gradient-to-br from-violet-900/40 to-slate-900 flex items-center justify-center relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 group-hover:from-violet-500/20 group-hover:to-cyan-500/20 transition-all" />
                <div className="relative text-center p-6">
                  <div className="text-5xl mb-3">🎬</div>
                  <p className="text-xs text-slate-400 font-mono">Sample {i}</p>
                  <p className="text-sm text-slate-200 mt-1">준비 중</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-6 text-center">
            유튜브 쇼츠 임베드로 교체 예정. 샘플 오디오는 구매 전 전체 듣기가 가능하도록 제공됩니다.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-6 py-24 lg:px-14 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs text-violet-300/70 tracking-widest uppercase mb-2 text-center">
            Pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
            3개 티어, 내 목표에 맞게.
          </h2>
          <p className="text-center text-slate-400 mb-14">한 번 결제로 평생 업데이트.</p>

          <div className="grid md:grid-cols-3 gap-5 items-stretch">
            {(Object.keys(TIERS) as Tier[]).map((key) => {
              const t = TIERS[key];
              return (
                <div
                  key={key}
                  className={`relative rounded-3xl p-8 flex flex-col border transition-all ${
                    t.highlight
                      ? 'border-violet-400 bg-gradient-to-br from-violet-900/40 to-slate-900 shadow-[0_0_60px_rgba(139,92,246,0.35)] md:scale-[1.03] md:-translate-y-2'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/30'
                  }`}
                >
                  {t.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-violet-500 to-pink-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        🔥 80%가 선택
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

      {/* B2B */}
      <section className="px-6 py-16 lg:px-14 bg-gradient-to-br from-slate-900 to-slate-950 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-6 border border-amber-500/30 bg-amber-500/5 rounded-2xl p-8">
            <div className="flex-1">
              <p className="font-mono text-xs text-amber-300/80 tracking-widest uppercase mb-2">
                For Business
              </p>
              <h3 className="text-2xl font-extrabold text-white mb-2">
                📣 내 가게 전용 BGM, 저작권 걱정 없이.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                카페 · 쇼핑몰 · 인스타 릴스 · 틱톡 셀러용 전용 BGM 제작.
                1분 만에 브랜드에 맞는 음악을 뽑아드립니다.
              </p>
            </div>
            <Link
              href="/contact?service=bgm"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-3 rounded-xl font-extrabold text-sm transition-colors"
            >
              B2B 문의 →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 lg:px-14 bg-slate-950">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
            자주 묻는 질문
          </h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
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

      {/* FINAL CTA */}
      <section className="px-6 py-20 lg:px-14 bg-gradient-to-br from-violet-900 via-slate-950 to-[#0b0530]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight" style={{ wordBreak: 'keep-all' }}>
            오늘 밤,
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-pink-200 to-cyan-300 bg-clip-text text-transparent">
              첫 쇼츠를 업로드하세요.
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            ₩39,000부터 · 평생 업데이트 · 즉시 다운로드
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-12 py-5 rounded-xl font-extrabold text-base transition-colors shadow-[0_0_60px_rgba(139,92,246,0.5)]"
          >
            팩 선택하기 →
          </a>
        </div>
      </section>

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
