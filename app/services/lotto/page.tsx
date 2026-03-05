'use client';

import { useState } from 'react';
import Link from 'next/link';
import ContactModal from '../../components/ContactModal';

const CHECKLIST = [
  '구독 플랜 선택 (기본 / 프리미엄 / 연간)',
  '번호 수신 방법 (이메일 / 텔레그램 중 선택)',
  '로또 구매 후 직접 확인 필요 (자동 구매 아님)',
  '당첨 보장 없음 — 통계 기반 확률 최적화 서비스',
  '구독 취소는 이메일로 언제든 가능',
];

const plans = [
  {
    name: '기본 플랜',
    price: '4,900원',
    period: '/ 월',
    desc: '매주 1회 번호 추천',
    features: [
      '매주 월요일 5개 번호 조합 제공',
      '출현 빈도 통계 분석',
      '이메일 발송',
    ],
    highlight: false,
  },
  {
    name: '프리미엄 플랜',
    price: '9,900원',
    period: '/ 월',
    desc: '매주 3회 + 상세 분석 보고서',
    features: [
      '매주 3회 번호 조합 제공',
      '핫넘버 / 콜드넘버 분석',
      '연속 번호 / 끝수 패턴 분석',
      '당첨 확률 시뮬레이션',
      '이메일 + 텔레그램 알림',
    ],
    highlight: true,
  },
  {
    name: '연간 플랜',
    price: '89,900원',
    period: '/ 년',
    desc: '프리미엄 12개월 (2개월 무료)',
    features: [
      '프리미엄 플랜 전체 기능',
      '연간 당첨 패턴 리포트',
      '우선 고객 지원',
      '2개월 무료 혜택',
    ],
    highlight: false,
  },
];

const faqs = [
  {
    q: '로또 번호 추천이 실제로 효과가 있나요?',
    a: '당첨을 보장하지는 않습니다. 다만 출현 빈도·패턴 통계를 기반으로 확률적으로 유리한 번호 조합을 제공합니다. NAS 서버에서 실제 데이터를 직접 분석하고 운영 중입니다.',
  },
  {
    q: '번호는 어떻게 받을 수 있나요?',
    a: '결제 완료 후 이메일로 매주 정해진 요일에 발송됩니다. 프리미엄 플랜은 텔레그램 알림도 함께 제공됩니다.',
  },
  {
    q: '구독 취소는 어떻게 하나요?',
    a: '이메일(bgg8988@gmail.com)로 취소 요청 시 다음 결제일 전에 해지 처리해드립니다. 위약금은 없습니다.',
  },
];

const analysisFeatures = [
  { label: '출현 빈도 분석', desc: '1회차~최신 회차까지 모든 번호의 출현 횟수와 비율 계산', stat: '1,100+', statLabel: '회차 데이터', accent: 'border-amber-300 bg-amber-50', statColor: 'text-amber-600' },
  { label: '핫/콜드 넘버', desc: '최근 20회차 기준 자주 나온 번호와 오래 안 나온 번호 구분', stat: '45', statLabel: '개 번호 분석', accent: 'border-orange-300 bg-orange-50', statColor: 'text-orange-600' },
  { label: '연속 번호 패턴', desc: '연속된 번호 쌍의 출현 패턴을 분석하여 번호 선택에 활용', stat: '98%', statLabel: '패턴 적용률', accent: 'border-yellow-300 bg-yellow-50', statColor: 'text-yellow-600' },
  { label: '끝수 통계', desc: '끝자리 0~9 번호들의 출현 비율을 분석하여 분산 조합', stat: '10', statLabel: '끝수 구간', accent: 'border-amber-300 bg-amber-50', statColor: 'text-amber-600' },
  { label: '번호 조합 시뮬레이션', desc: '추천 번호로 과거 회차 시뮬레이션을 진행하여 효과 검증', stat: '500+', statLabel: '회 시뮬레이션', accent: 'border-orange-300 bg-orange-50', statColor: 'text-orange-600' },
  { label: '정기 자동 발송', desc: '매주 정해진 요일에 이메일 및 텔레그램으로 번호 자동 발송', stat: '매주', statLabel: '자동 배송', accent: 'border-yellow-300 bg-yellow-50', statColor: 'text-yellow-600' },
];

export default function LottoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState('로또 번호 추천');

  const openModal = (service: string) => {
    setModalService(service);
    setModalOpen(true);
  };

  return (
    <div className="min-h-full bg-[#f0f5ff]">
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service={modalService}
        checklist={CHECKLIST}
        accentColor="text-amber-400"
        headerFrom="#1a0a00"
        headerTo="#3d1a00"
      />

      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a0a00] via-[#3d1a00] to-[#1a0a00] px-6 py-14 lg:px-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { n: '07', x: '8%', y: '15%', size: 'w-12 h-12', opacity: 'opacity-10' },
            { n: '23', x: '88%', y: '10%', size: 'w-16 h-16', opacity: 'opacity-10' },
            { n: '34', x: '92%', y: '60%', size: 'w-10 h-10', opacity: 'opacity-8' },
            { n: '12', x: '5%', y: '70%', size: 'w-14 h-14', opacity: 'opacity-10' },
            { n: '41', x: '78%', y: '85%', size: 'w-12 h-12', opacity: 'opacity-8' },
          ].map((ball) => (
            <div
              key={ball.n}
              className={`absolute ${ball.size} ${ball.opacity} rounded-full border-2 border-amber-400 flex items-center justify-center`}
              style={{ left: ball.x, top: ball.y }}
            >
              <span className="text-amber-300 font-bold text-sm">{ball.n}</span>
            </div>
          ))}
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-500/8 blur-3xl" />

        <div className="relative max-w-3xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-amber-300/60 hover:text-amber-300 text-sm mb-6 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            홈으로
          </Link>
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center mb-5 shadow-lg shadow-amber-900/30">
            <svg className="w-9 h-9 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <p className="text-amber-400/70 text-xs font-bold uppercase tracking-widest mb-2">LOTTO ANALYTICS · 빅데이터 통계 분석</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            로또 번호<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">빅데이터 추천</span>
          </h1>
          <p className="text-amber-100/60 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-6">
            1회차부터 현재까지 전체 당첨 데이터를 분석하여 출현 패턴, 핫/콜드 번호,
            연속 번호 통계를 기반으로 번호 조합을 추천합니다.
          </p>
          <div className="flex items-center justify-center gap-2.5 mb-6">
            {[7, 14, 23, 35, 41, 44].map((n, i) => (
              <div key={n} className="w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-sm shadow-lg border"
                style={{ background: i < 2 ? '#fbbf24' : i < 4 ? '#3b82f6' : '#ef4444', borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                {n}
              </div>
            ))}
          </div>
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-medium px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            NAS 서버에서 실제 운영 중
          </div>
        </div>
      </div>

      {/* ─── 분석 기능 ─── */}
      <div className="px-6 py-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-2">ANALYSIS ENGINE</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">6가지 통계 분석 엔진</h2>
            <p className="text-slate-500 text-sm mt-2">단순 랜덤이 아닌 데이터 기반의 확률 최적화</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisFeatures.map((f) => (
              <div key={f.label} className={`bg-white rounded-2xl border-2 ${f.accent} p-5`}>
                <div className={`text-2xl font-extrabold ${f.statColor} mb-0.5`}>{f.stat}</div>
                <div className={`text-xs ${f.statColor} font-medium mb-3`}>{f.statLabel}</div>
                <h3 className="font-bold text-[#04102b] text-sm mb-1.5">{f.label}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 요금제 ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[#1a56db] text-xs font-bold uppercase tracking-widest mb-2">PRICING</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">요금제</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-2xl border p-6 relative flex flex-col ${
                plan.highlight
                  ? 'bg-gradient-to-br from-[#04102b] to-[#0a2060] border-amber-400/40 shadow-2xl shadow-amber-900/20 scale-105'
                  : 'bg-white border-[#dbe8ff]'
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-[#04102b] text-xs font-extrabold px-4 py-1 rounded-full tracking-wide">추천</div>
                )}
                <div className={`text-xs font-bold mb-2 tracking-wide ${plan.highlight ? 'text-amber-400' : 'text-slate-400'}`}>{plan.name.toUpperCase()}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-3xl font-extrabold ${plan.highlight ? 'text-white' : 'text-[#04102b]'}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-amber-300/60' : 'text-slate-400'}`}>{plan.period}</span>
                </div>
                <p className={`text-xs mb-5 ${plan.highlight ? 'text-amber-300/60' : 'text-slate-400'}`}>{plan.desc}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-xs ${plan.highlight ? 'text-amber-100/80' : 'text-slate-600'}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.highlight ? 'bg-amber-400/20 border border-amber-400/40' : 'bg-[#f0f5ff] border border-[#dbe8ff]'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${plan.highlight ? 'bg-amber-400' : 'bg-[#1a56db]'}`} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openModal(`로또 번호 추천 - ${plan.name}`)}
                  className={`block w-full text-center py-3 rounded-xl text-sm font-bold transition ${
                    plan.highlight ? 'bg-amber-400 text-[#04102b] hover:bg-amber-300' : 'bg-[#04102b] text-white hover:bg-[#0a1f5c]'
                  }`}
                >
                  신청하기
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FAQ ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[#1a56db] text-xs font-bold uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-2xl font-extrabold text-[#04102b]">자주 묻는 질문</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={faq.q} className="bg-white rounded-2xl border border-[#dbe8ff] p-6">
                <div className="flex items-start gap-3">
                  <span className="text-amber-500 font-extrabold text-sm flex-shrink-0 mt-0.5">Q{i + 1}</span>
                  <div>
                    <h3 className="font-bold text-[#04102b] text-sm mb-2">{faq.q}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-[#04102b] to-[#0a2060] rounded-2xl border border-[#1a3a7a] p-8 text-center">
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">GET STARTED</p>
            <h3 className="text-white text-2xl font-extrabold mb-2">지금 바로 시작하세요</h3>
            <p className="text-blue-200/50 text-sm mb-6">구독 첫 달 무료 체험 · 언제든 취소 가능</p>
            <button
              onClick={() => openModal('로또 번호 추천')}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#04102b] px-8 py-3 rounded-xl font-extrabold text-sm transition-all shadow-lg shadow-amber-900/30"
            >
              구독 신청하기 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
