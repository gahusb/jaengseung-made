'use client';

import { useState } from 'react';
import Link from 'next/link';
import PurchaseAgreementModal from '../../components/PurchaseAgreementModal';

const PACK_ITEMS = [
  {
    icon: '📝',
    title: '프롬프트 조합법 45종',
    desc: '상품리뷰 / 정보글 / 후기 / 비교 / 하우투 글별 최적 프롬프트 조합',
    meta: 'PDF 80p',
  },
  {
    icon: '📐',
    title: '블로그 글 구조 템플릿 12종',
    desc: '쿠팡파트너스 · 애드포스트 클릭을 유도하는 검증된 글 구조',
    meta: 'Notion 템플릿',
  },
  {
    icon: '💰',
    title: '샘플 글 10편',
    desc: '실제로 수익이 발생한 블로그 글 전문 + 해설 주석',
    meta: '.docx · .md',
  },
  {
    icon: '🔍',
    title: '네이버 SEO 체크리스트',
    desc: 'C-Rank · D.I.A. 알고리즘 대응 14가지 체크 포인트',
    meta: 'PDF 20p',
  },
];

const FAQS = [
  {
    q: '초보자도 쓸 수 있나요?',
    a: 'ChatGPT나 Claude 계정만 있으면 됩니다. 프롬프트를 복붙하는 것부터 시작해서 점차 응용하도록 설계했습니다.',
  },
  {
    q: '어떤 플랫폼에 맞나요?',
    a: '네이버 블로그·티스토리·브런치 모두 대응. 쿠팡파트너스·애드포스트·브랜드커넥트 3가지 수익화 흐름을 모두 다룹니다.',
  },
  {
    q: '업데이트는 얼마나 자주 되나요?',
    a: '월 1~2회 주요 업데이트. 구매자 전용 Notion 페이지에서 변경 이력과 최신 파일을 제공합니다. 구매 후 12개월간 무료.',
  },
  {
    q: '환불이 되나요?',
    a: '전자상거래법상 디지털 콘텐츠는 제공 시작 후 환불이 제한됩니다. 구매 전 샘플 미리보기를 충분히 확인해주세요. 파일 손상·전달 불량은 즉시 재전달 또는 환불됩니다.',
  },
];

export default function BlogServicePage() {
  const [agreeOpen, setAgreeOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-full bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 py-20 lg:px-14 lg:py-28 bg-gradient-to-br from-blue-50 via-white to-sky-50">
        <div className="relative max-w-5xl mx-auto">
          <p className="font-mono text-xs text-blue-700/70 tracking-[0.25em] uppercase mb-6">
            Blog Automation Pack
          </p>
          <h1
            className="text-[2.4rem] md:text-[3.2rem] lg:text-[4rem] font-extrabold leading-[1.08] tracking-tight text-slate-900 mb-6"
            style={{ wordBreak: 'keep-all' }}
          >
            매일 글쓰기 고민,
            <br />
            <span className="text-blue-700">AI에게 맡기세요.</span>
          </h1>
          <p
            className="text-slate-600 text-lg md:text-xl leading-relaxed mb-4 max-w-2xl"
            style={{ wordBreak: 'keep-all' }}
          >
            쿠팡파트너스 · 네이버 애드포스트 · 브랜드커넥트 수익을
            <br />
            <span className="text-slate-900 font-semibold">자동화하는 프롬프트 · 구조 · 샘플 세트</span>.
          </p>
          <div className="inline-flex items-center gap-3 bg-white border border-blue-200 rounded-xl px-5 py-3 mb-8 shadow-sm">
            <span className="text-3xl font-extrabold text-blue-700 font-mono">₩29,000</span>
            <span className="text-xs text-slate-500">한 번 결제 · 12개월 무료 업데이트</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setAgreeOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-500/30"
            >
              구매하기 →
            </button>
            <a
              href="#sample"
              className="inline-flex items-center gap-2 border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-700 px-8 py-4 rounded-xl font-semibold text-sm transition-all"
            >
              샘플 미리보기
            </a>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="px-6 py-16 lg:px-14 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-10 text-center"
            style={{ wordBreak: 'keep-all' }}
          >
            이런 분들을 위한 팩입니다.
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: '🕐', title: '매일 1시간+', desc: '글 소재·구성에 시간 다 쓰고 수익은 제자리' },
              { icon: '📉', title: '수익화 6개월+', desc: '블로그 키워놓고도 수익 구조가 안 잡힘' },
              { icon: '🤖', title: 'AI 글은 어색', desc: 'ChatGPT 그대로 복붙하면 바로 들통' },
            ].map((p) => (
              <div key={p.title} className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50">
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-extrabold text-slate-900 mb-2">{p.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACK CONTENT */}
      <section id="sample" className="px-6 py-20 lg:px-14 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-xs text-blue-700/70 tracking-widest uppercase mb-2">
            Pack Contents
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-10">
            구성품 4종
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {PACK_ITEMS.map((it) => (
              <div
                key={it.title}
                className="flex gap-4 bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-400 transition-colors"
              >
                <div className="text-3xl flex-shrink-0">{it.icon}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-extrabold text-slate-900">{it.title}</h3>
                    <span className="text-[10px] font-mono text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                      {it.meta}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                    {it.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Sample preview */}
          <div className="mt-12 bg-white border-2 border-dashed border-blue-300 rounded-2xl p-8 relative overflow-hidden">
            <span className="absolute top-4 right-4 text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">
              샘플 미리보기
            </span>
            <h4 className="font-extrabold text-slate-900 mb-3">프롬프트 예시 · 상품 리뷰 글 자동 생성</h4>
            <pre className="text-xs font-mono text-slate-700 bg-slate-50 rounded-lg p-4 overflow-x-auto leading-relaxed">{`당신은 [카테고리] 전문 블로거입니다.
아래 상품의 [핵심 장점 3개]와 [주의점 1개]를 기반으로
C-Rank 알고리즘에 최적화된 1,200자 리뷰 글을 작성하세요.

[구조]
1. 후킹 도입 (공감형 질문)
2. 상품 요약 (스펙 표)
3. 실사용 관점 장점·단점
4. 대안 비교 (쿠팡 링크 삽입 지점: {LINK})
5. 결론 + 재질문 유도

[톤앤매너] 친근한 존댓말, 광고 느낌 최소화 ...`}</pre>
            <p className="text-xs text-slate-500 mt-4">
              실제 팩에는 카테고리별 45종의 프롬프트와 최적화 파라미터가 포함됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 lg:px-14 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8 text-center">
            자주 묻는 질문
          </h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-900 text-sm">{f.q}</span>
                  <span className={`text-blue-700 text-xl transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-20 lg:px-14 bg-gradient-to-br from-blue-700 to-blue-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4" style={{ wordBreak: 'keep-all' }}>
            오늘부터 블로그 수익 자동화.
          </h2>
          <p className="text-blue-100 text-lg mb-8">₩29,000 한 번 결제 · 평생 업데이트</p>
          <button
            onClick={() => setAgreeOpen(true)}
            className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-10 py-4 rounded-xl font-extrabold text-base transition-colors shadow-xl"
          >
            지금 구매하기 →
          </button>
          <p className="text-blue-200/80 text-xs mt-6">
            <Link href="/legal/refund" className="underline hover:text-white">환불 정책</Link>
            {' · '}
            <Link href="/legal/terms" className="underline hover:text-white">이용약관</Link>
          </p>
        </div>
      </section>

      <PurchaseAgreementModal
        isOpen={agreeOpen}
        onClose={() => setAgreeOpen(false)}
        productName="블로그 자동화 솔루션 팩"
        price="₩29,000"
      />
    </div>
  );
}
