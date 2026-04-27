'use client';

import { useState } from 'react';
import Link from 'next/link';
import PurchaseAgreementModal from '../../components/PurchaseAgreementModal';
import { SparklesOverlay } from '@/components/ui/sparkles-text';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card-effect';

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
  { num: '01', subtitle: 'Concept & Lyrics', title: '크리에이티브 디렉팅', result: 'AI 최적화 가사 · 메타데이터 시트' },
  { num: '02', subtitle: 'Music Generation', title: '오디오 엔지니어링', result: '고품질 완곡 (Full Track, 스템 분리본)' },
  { num: '03', subtitle: 'AI MV Generation', title: '비주얼 마스터링', result: '쇼츠(9:16) 또는 유튜브(16:9) 고화질 영상' },
  { num: '04', subtitle: 'Viral Optimization', title: '퍼블리싱 가이드', result: '즉시 업로드 가능한 유튜브 배포 패키지' },
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
    <div className="min-h-full bg-black text-white">
      {/* PRICING */}
      <section id="pricing" className="px-6 py-14 lg:px-14 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
            <div>
              <p className="font-mono text-xs text-white/50 tracking-widest uppercase mb-1">Pricing · 1회 결제</p>
              <h2 className="text-2xl md:text-3xl font-extrabold">3개 티어, 목표에 맞게 선택</h2>
            </div>
            <Link href="/services/music/samples" className="text-sm text-white/80 hover:text-white underline underline-offset-4">
              샘플 먼저 보기
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5 items-stretch">
            {(Object.keys(TIERS) as Tier[]).map((key) => {
              const t = TIERS[key];
              return (
                <CardContainer key={key} containerClassName="w-full py-0" className="w-full h-full">
                  <CardBody
                    className={`relative w-full h-full rounded-2xl p-8 flex flex-col border transition-all ${
                      t.highlight
                        ? 'border-white bg-white text-black md:scale-[1.03] md:-translate-y-2'
                        : 'border-white/15 bg-white/[0.02] hover:border-white/40 text-white'
                    }`}
                  >
                    {t.highlight && (
                      <SparklesOverlay
                        sparklesCount={20}
                        colors={{ first: '#9E7AFF', second: '#FE8BBB' }}
                        className="rounded-2xl"
                      />
                    )}
                    {t.highlight && (
                      <CardItem translateZ={60} className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                        <span className="inline-flex items-center bg-black text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider border border-white">
                          가장 많이 팔림
                        </span>
                      </CardItem>
                    )}
                    <CardItem translateZ={40} as="h3" className="font-extrabold text-2xl mb-1 relative z-10">
                      {t.name}
                    </CardItem>
                    <CardItem translateZ={20} as="p" className={`text-sm mb-6 ${t.highlight ? 'text-black/60' : 'text-white/60'}`}>
                      {t.desc}
                    </CardItem>
                    <CardItem translateZ={50} className="mb-6">
                      <span className="text-4xl font-extrabold font-mono">{t.price}</span>
                      <span className={`text-xs ml-2 ${t.highlight ? 'text-black/50' : 'text-white/50'}`}>1회 결제</span>
                    </CardItem>
                    <CardItem
                      translateZ={20}
                      as="ul"
                      className={`space-y-3 text-sm mb-8 flex-1 ${t.highlight ? 'text-black/80' : 'text-white/80'}`}
                    >
                      {t.features.map((f) => (
                        <li key={f} className="flex gap-2.5">
                          <span className="flex-shrink-0 mt-0.5">·</span>
                          <span className="leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </CardItem>
                    <CardItem
                      translateZ={40}
                      as="button"
                      onClick={() => setSelectedTier(key)}
                      className={`w-full py-4 rounded-xl font-extrabold text-sm transition-colors ${
                        t.highlight
                          ? 'bg-black hover:bg-black/85 text-white'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }`}
                    >
                      {t.name} 구매하기
                    </CardItem>
                  </CardBody>
                </CardContainer>
              );
            })}
          </div>
          <p className="text-xs text-white/50 text-center mt-8">
            구매 전 <Link href="/legal/refund" className="underline hover:text-white">환불 정책</Link>을 반드시 확인해주세요.
            디지털 콘텐츠 특성상 제공 시작 후 청약철회가 제한됩니다.
          </p>
        </div>
      </section>

      {/* 팩 구성품 */}
      <section className="px-6 py-16 lg:px-14 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs text-white/50 tracking-widest uppercase mb-2">What&apos;s Included</p>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8">팩 구성품</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Suno 프롬프트 북', desc: '장르·무드·보컬 톤 조합법 20+종. 복붙해서 바로 사용하는 PDF.' },
              { title: 'MV 워크플로우', desc: 'Midjourney·Runway·Luma로 비트 싱크 영상 만드는 단계별 가이드.' },
              { title: '저작권 & 상업 이용', desc: 'Suno·Runway 약관 요약 + 수익화 전 안전 체크리스트.' },
              { title: '샘플 프로젝트 파일', desc: '완성된 가사·프롬프트·영상 세트. 그대로 수정해 재사용 가능.' },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl border border-white/15 bg-white/[0.02]"
              >
                <h3 className="font-bold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="px-6 py-16 lg:px-14 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs text-white/50 tracking-widest uppercase mb-2">Process</p>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-10" style={{ wordBreak: 'keep-all' }}>
            컨셉 → 음악 → 비주얼 → 퍼블리싱
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS.map((step) => (
              <div
                key={step.num}
                className="rounded-2xl p-6 border border-white/15 bg-white/[0.02] hover:border-white/40 transition-colors"
              >
                <p className="font-mono text-xs text-white/50 mb-3">{step.num}</p>
                <p className="font-mono text-[10px] text-white/50 uppercase tracking-widest mb-1">
                  {step.subtitle}
                </p>
                <h3 className="text-lg font-extrabold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                  {step.result}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLES */}
      <section id="samples" className="px-6 py-12 lg:px-14 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-white/50 tracking-widest uppercase mb-1">Samples</p>
            <h2 className="text-xl md:text-2xl font-extrabold">이 팩으로 만든 실제 쇼츠들</h2>
          </div>
          <Link
            href="/services/music/samples"
            className="inline-flex items-center px-6 py-3 rounded-xl border border-white/30 hover:bg-white hover:text-black text-sm font-semibold text-white transition whitespace-nowrap"
          >
            전체 샘플 갤러리
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 lg:px-14 bg-black border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-10">
            자주 묻는 질문
          </h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="border border-white/15 rounded-2xl overflow-hidden bg-white/[0.02]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-white text-sm">{f.q}</span>
                  <span className={`text-white text-xl transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-white/70 leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky CTA */}
      <div
        className="fixed bottom-0 inset-x-0 z-40 border-t border-white/15 backdrop-blur-md"
        style={{ background: 'rgba(0,0,0,0.85)' }}
      >
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-mono text-white/50 tracking-widest uppercase">From</p>
            <p className="text-white font-extrabold text-lg leading-tight">
              ₩39,000 <span className="text-xs text-white/50 font-medium">· 1회 결제</span>
            </p>
          </div>
          <a
            href="#pricing"
            className="inline-flex items-center bg-white hover:bg-white/90 text-black px-6 py-3 rounded-xl font-extrabold text-sm transition-colors whitespace-nowrap"
          >
            팩 선택하기
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
