'use client';

import { useState } from 'react';
import Link from 'next/link';
import ContactModal from '../../components/ContactModal';
import PaymentButton from '../../components/PaymentButton';

const CHECKLIST = [
  '사용 중인 증권사 확인 (키움증권 / 한국투자증권 권장)',
  '증권사 API 사용 신청이 필요합니다 (무료)',
  'Windows PC 또는 서버 환경 필요',
  '투자 원금 손실 위험 인지 — 여유 자금 운용 권장',
  '전략 커스터마이징은 프로 플랜 이상 가능',
];

const features = [
  { title: '실시간 시장 모니터링', desc: '주식 시장 데이터를 실시간으로 수집·분석하여 매매 신호를 감지합니다.', detail: '장 시작~종료 전 구간 모니터링' },
  { title: '텔레그램 즉시 알림', desc: '매수·매도 신호 발생 시 텔레그램으로 즉시 알림을 전송합니다.', detail: '1초 이내 신호 전달' },
  { title: '자동 매수/매도 실행', desc: '신호에 따라 증권사 API와 연동하여 자동으로 주문을 실행합니다.', detail: '키움증권 / 한국투자증권 API' },
  { title: '기술적 분석 전략', desc: 'RSI, MACD, 볼린저밴드 등 검증된 기술적 지표를 조합하여 신호를 생성합니다.', detail: '다중 지표 복합 전략' },
  { title: '손절/익절 자동화', desc: '사전 설정한 손절·익절 기준에 따라 자동으로 포지션을 청산합니다.', detail: '리스크 자동 관리' },
  { title: '매매 이력 리포트', desc: '일별·주별 매매 내역과 손익 현황을 텔레그램 및 이메일로 보고합니다.', detail: '일별 수익률 추적' },
];

const plans = [
  {
    name: '스타터',
    installPrice: '99,000원',
    monthlyPrice: '29,000원',
    desc: '1개 종목 자동 매매',
    features: ['1개 종목 모니터링', '텔레그램 매매 알림', '기본 기술적 분석 전략', '손절/익절 자동 설정', '월간 손익 리포트'],
    highlight: false,
    installProductId: 'stock_starter_install',
  },
  {
    name: '프로',
    installPrice: '199,000원',
    monthlyPrice: '49,000원',
    desc: '최대 5개 종목 + 전략 커스터마이징',
    features: ['최대 5개 종목 동시 운영', '전략 파라미터 커스터마이징', '다중 기술적 지표 조합', '실시간 포트폴리오 현황', '주간 성과 분석 리포트', '1개월 무상 기술 지원'],
    highlight: true,
    installProductId: 'stock_pro_install',
  },
  {
    name: '엔터프라이즈',
    installPrice: '협의',
    monthlyPrice: '협의',
    desc: '무제한 종목 + 맞춤 전략 개발',
    features: ['종목 제한 없음', '완전 맞춤 전략 개발', '백테스팅 리포트 제공', '전용 서버 구성 가능', '24시간 모니터링', '전담 유지보수 계약'],
    highlight: false,
    installProductId: null,
  },
];

const faqs = [
  { q: '어떤 증권사와 연동되나요?', a: '키움증권 Open API, 한국투자증권 API 등 주요 증권사 API를 지원합니다. 사용하시는 증권사를 미리 알려주시면 호환성을 확인해드립니다.' },
  { q: '원금 손실 위험은 없나요?', a: '주식 투자는 원금 손실 가능성이 있습니다. 자동 매매 프로그램은 매매를 보조하는 도구이며, 투자 결과에 대한 책임은 투자자 본인에게 있습니다. 반드시 여유 자금으로만 운용하세요.' },
  { q: '프로그램은 PC에 설치해야 하나요?', a: '네, 기본적으로 증권사 API 연동을 위해 Windows PC 환경에 설치합니다. 별도 서버가 필요하신 경우 NAS 또는 클라우드 서버 구성도 가능합니다.' },
  { q: '전략 수정이나 추가 요청이 가능한가요?', a: '프로 플랜 이상에서 전략 파라미터 조정이 가능합니다. 완전히 새로운 전략 개발은 별도 비용으로 진행됩니다.' },
];

export default function StockPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState('주식 자동 매매');

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
        accentColor="text-emerald-400"
        headerFrom="#011225"
        headerTo="#01204a"
      />

      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#011225] via-[#01204a] to-[#011a35] px-6 py-14 lg:px-12">
        <svg className="absolute bottom-0 left-0 right-0 w-full opacity-15" height="80" viewBox="0 0 600 80" preserveAspectRatio="none">
          <polyline points="0,70 60,55 120,62 200,25 280,40 340,15 420,30 500,8 600,18" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinejoin="round" />
        </svg>
        <div className="absolute right-10 top-8 opacity-10 hidden lg:flex gap-2 items-end">
          {[60,80,45,90,70,55,85,65,95,72].map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="w-0.5 bg-white/50" style={{ height: `${h * 0.3}px` }} />
              <div className="w-3 rounded-sm" style={{ height: `${h * 0.4}px`, background: i % 2 === 0 ? '#22c55e' : '#ef4444' }} />
              <div className="w-0.5 bg-white/50" style={{ height: `${h * 0.2}px` }} />
            </div>
          ))}
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-emerald-300/60 hover:text-emerald-300 text-sm mb-6 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            홈으로
          </Link>
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-400/15 border border-emerald-400/25 flex items-center justify-center mb-5">
            <svg className="w-9 h-9 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <p className="text-emerald-400/70 text-xs font-bold uppercase tracking-widest mb-2">ALGO TRADING · 텔레그램 연동</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            주식 자동 매매<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">알고트레이딩</span>
          </h1>
          <p className="text-emerald-100/50 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-6">
            직접 개발하고 NAS 서버에서 운영 중인 주식 자동 매매 시스템.<br />
            기술적 분석 신호를 텔레그램으로 받아 자동으로 매수·매도합니다.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <div className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-xs font-medium px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />NAS 서버에서 실제 운영 중
            </div>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 text-xs font-medium px-4 py-2 rounded-full">
              키움증권 · 한국투자증권 API 연동
            </div>
          </div>
        </div>
        <div className="relative max-w-2xl mx-auto mt-2">
          <div className="bg-black/40 border border-emerald-400/15 rounded-xl p-4 font-mono text-xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500/60" /><div className="w-3 h-3 rounded-full bg-yellow-500/60" /><div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="text-white/30 text-xs ml-2">algo_trader.py</span>
            </div>
            <div className="space-y-1.5">
              <div><span className="text-emerald-400">✓</span><span className="text-white/40"> [09:01:23] </span><span className="text-white/70">KOSPI 모니터링 시작</span></div>
              <div><span className="text-emerald-400">✓</span><span className="text-white/40"> [09:15:44] </span><span className="text-emerald-300">RSI(14) = 32.4 → 과매도 신호 감지</span></div>
              <div><span className="text-amber-400">→</span><span className="text-white/40"> [09:15:44] </span><span className="text-amber-300">텔레그램 알림 전송: 삼성전자 매수 신호</span></div>
              <div><span className="text-blue-400">✓</span><span className="text-white/40"> [09:15:45] </span><span className="text-blue-300">매수 주문 실행 완료 (5주 × 72,400원)</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 투자 유의 ─── */}
      <div className="px-6 pt-8 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-amber-800 text-xs leading-relaxed">
              <strong>투자 유의사항:</strong> 주식 자동 매매 프로그램은 투자 보조 도구입니다. 주식 투자는 원금 손실의 위험이 있으며, 투자 결과에 대한 책임은 투자자 본인에게 있습니다. 반드시 여유 자금으로만 운용하세요.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 주요 기능 ─── */}
      <div className="px-6 py-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-2">FEATURES</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">주요 기능</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl border border-[#dbe8ff] p-5 hover:border-emerald-200 transition-colors">
                <div className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-md mb-3">{f.detail}</div>
                <h3 className="font-bold text-[#04102b] text-sm mb-2">{f.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 요금제 ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-2">
            <p className="text-[#1a56db] text-xs font-bold uppercase tracking-widest mb-2">PRICING</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">요금제</h2>
          </div>
          <p className="text-center text-slate-400 text-sm mb-8">설치비(1회) + 월 유지비 구조입니다</p>
          <div className="grid sm:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-2xl border p-6 relative flex flex-col ${
                plan.highlight
                  ? 'bg-gradient-to-br from-[#011225] to-[#01204a] border-emerald-400/30 shadow-2xl shadow-emerald-900/20 scale-105'
                  : 'bg-white border-[#dbe8ff]'
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-400 text-[#011225] text-xs font-extrabold px-4 py-1 rounded-full tracking-wide">인기</div>
                )}
                <div className={`text-xs font-bold mb-3 tracking-wide ${plan.highlight ? 'text-emerald-400' : 'text-slate-400'}`}>{plan.name.toUpperCase()}</div>
                <div className="mb-4">
                  <div className={`text-xs mb-0.5 ${plan.highlight ? 'text-emerald-400/60' : 'text-slate-400'}`}>설치비 (1회)</div>
                  <div className={`text-2xl font-extrabold ${plan.highlight ? 'text-white' : 'text-[#04102b]'}`}>{plan.installPrice}</div>
                </div>
                <div className="mb-1">
                  <div className={`text-xs mb-0.5 ${plan.highlight ? 'text-emerald-400/60' : 'text-slate-400'}`}>월 유지비</div>
                  <div className={`text-xl font-bold ${plan.highlight ? 'text-white' : 'text-[#04102b]'}`}>{plan.monthlyPrice}</div>
                </div>
                <p className={`text-xs mt-2 mb-5 ${plan.highlight ? 'text-emerald-300/50' : 'text-slate-400'}`}>{plan.desc}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-xs ${plan.highlight ? 'text-emerald-100/80' : 'text-slate-600'}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.highlight ? 'bg-emerald-400/20 border border-emerald-400/40' : 'bg-[#f0f5ff] border border-[#dbe8ff]'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${plan.highlight ? 'bg-emerald-400' : 'bg-[#1a56db]'}`} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.installProductId ? (
                  <PaymentButton
                    productId={plan.installProductId}
                    className={`block w-full text-center py-3 rounded-xl text-sm font-bold transition ${
                      plan.highlight ? 'bg-emerald-400 text-[#011225] hover:bg-emerald-300' : 'bg-[#04102b] text-white hover:bg-[#0a1f5c]'
                    }`}
                  >
                    설치 결제하기
                  </PaymentButton>
                ) : (
                  <button
                    onClick={() => openModal(`주식 자동 매매 - ${plan.name}`)}
                    className="block w-full text-center py-3 rounded-xl text-sm font-bold transition bg-[#04102b] text-white hover:bg-[#0a1f5c]"
                  >
                    도입 문의
                  </button>
                )}
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
                  <span className="text-emerald-500 font-extrabold text-sm flex-shrink-0 mt-0.5">Q{i + 1}</span>
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
          <div className="bg-gradient-to-r from-[#011225] to-[#01204a] rounded-2xl border border-emerald-400/20 p-8 text-center">
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">START TRADING</p>
            <h3 className="text-white text-2xl font-extrabold mb-2">지금 도입 상담 받아보세요</h3>
            <p className="text-emerald-100/40 text-sm mb-6">계약서 먼저, 개발 나중 — 구두 약속 없음</p>
            <button
              onClick={() => openModal('주식 자동 매매')}
              className="inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-[#011225] px-8 py-3 rounded-xl font-extrabold text-sm transition-all shadow-lg shadow-emerald-900/30"
            >
              시스템 확인 후 상담 신청 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
