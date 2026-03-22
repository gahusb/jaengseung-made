'use client';

import { useState } from 'react';
import Link from 'next/link';
import ContactModal from '../../components/ContactModal';
import PaymentButton from '../../components/PaymentButton';

const CHECKLIST = [
  '주로 어떤 AI 도구를 사용하는지 (ChatGPT / Claude / Gemini)',
  '자동화하고 싶은 업무 유형 (이메일 / 보고서 / 코드 등)',
  '현재 프롬프트 사용 방식 및 불만족스러운 점',
  '필요한 프롬프트 수량 (단건 / 패키지 / 팀 전체)',
  '납품 후 사용 가이드 및 1:1 교육 포함 여부 확인',
];

const useCases = [
  { label: '이메일 작성', desc: '고객사별, 상황별 최적화된 비즈니스 이메일 프롬프트' },
  { label: '보고서·기획서', desc: '회사 내부 보고서, 제안서, 기획서 자동 작성용 프롬프트' },
  { label: '고객 응대', desc: 'CS 상담, FAQ 응답, 컴플레인 처리를 위한 프롬프트' },
  { label: '마케팅 카피', desc: '제품 소개글, 광고 카피, SNS 콘텐츠 생성 프롬프트' },
  { label: '개발 보조', desc: '코드 리뷰, 버그 설명, 문서화를 위한 개발자 전용 프롬프트' },
  { label: '학습·요약', desc: '문서 요약, 핵심 추출, 번역 최적화 프롬프트' },
];

const plans = [
  {
    name: '단건 설계',
    price: '30,000원',
    period: '/ 건',
    desc: '특정 업무 1건 프롬프트 설계',
    features: ['요구사항 분석 및 인터뷰', '목적별 프롬프트 1개 설계', 'ChatGPT / Claude 최적화', '수정 1회 포함', '사용 가이드 문서 제공'],
    highlight: false,
    productId: 'prompt_single',
  },
  {
    name: '비즈니스 패키지',
    price: '99,000원',
    period: '/ 패키지',
    desc: '업무 유형별 5개 프롬프트 세트',
    features: ['업무 분석 심층 인터뷰', '5개 프롬프트 맞춤 설계', '용도별 프롬프트 라이브러리', '수정 3회 포함', '활용 방법 1:1 교육 (30분)', '1개월 내 추가 조정 가능'],
    highlight: true,
    productId: 'prompt_business',
  },
  {
    name: '팀/기업 패키지',
    price: '249,000원~',
    period: '/ 세트',
    desc: '부서·팀 전체 프롬프트 시스템 구축',
    features: ['팀 업무 프로세스 전체 분석', '10개 이상 프롬프트 설계', '팀 공유 프롬프트 라이브러리', '사내 가이드 문서 작성', '전 직원 교육 자료 제공', '3개월 내 업데이트 지원'],
    highlight: false,
    productId: 'prompt_team',
  },
];

const examples = [
  {
    type: '회의록 요약',
    before: '회의 내용을 요약해줘',
    after: '다음 회의록을 분석하여: 1) 핵심 결정사항 3가지, 2) 담당자별 Action Item, 3) 다음 회의 전 완료해야 할 사항을 불릿 형식으로 정리해줘. 회의록: [내용]',
    improvement: '구조화된 출력 · 역할 분리 · 명확한 포맷',
  },
  {
    type: '코드 리뷰',
    before: '이 코드 리뷰해줘',
    after: '시니어 백엔드 개발자 관점에서 다음 코드를 리뷰해줘: 1) 버그 및 잠재적 오류, 2) 성능 개선 포인트, 3) 클린코드 관점에서의 개선사항을 각각 심각도(High/Medium/Low)와 함께 알려줘. 코드: [코드]',
    improvement: '페르소나 설정 · 심각도 기준 · 다각도 분석',
  },
];

export default function PromptPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState('프롬프트 엔지니어링');

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
        accentColor="text-violet-400"
        headerFrom="#0d0a2e"
        headerTo="#1a0f5c"
      />

      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0d0a2e] via-[#1a0f5c] to-[#0d0a2e] px-6 py-14 lg:px-12">
        <div className="absolute top-0 right-0 w-[480px] h-full opacity-10 pointer-events-none hidden lg:block">
          <div className="font-mono text-xs text-violet-300 p-8 leading-7">
            <div><span className="text-pink-400">const</span> <span className="text-blue-300">optimizePrompt</span> <span className="text-white">=</span> <span className="text-yellow-300">(task)</span> <span className="text-white">{'=> {'}</span></div>
            <div className="ml-4"><span className="text-pink-400">return</span> <span className="text-white">{'{'}</span></div>
            <div className="ml-8"><span className="text-green-300">role</span><span className="text-white">:</span> <span className="text-orange-300">&apos;expert analyst&apos;</span><span className="text-white">,</span></div>
            <div className="ml-8"><span className="text-green-300">context</span><span className="text-white">:</span> <span className="text-orange-300">`{'{task.context}'}`</span><span className="text-white">,</span></div>
            <div className="ml-8"><span className="text-green-300">format</span><span className="text-white">:</span> <span className="text-orange-300">&apos;structured&apos;</span><span className="text-white">,</span></div>
            <div className="ml-8"><span className="text-green-300">output</span><span className="text-white">:</span> <span className="text-orange-300">&apos;actionable&apos;</span></div>
            <div className="ml-4"><span className="text-white">{'}'}</span></div>
            <div><span className="text-white">{'};'}</span></div>
            <div className="mt-4"><span className="text-slate-500">// efficiency: 94% ↑</span></div>
          </div>
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-violet-300/60 hover:text-violet-300 text-sm mb-6 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            홈으로
          </Link>
          <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-400/15 border border-violet-400/25 flex items-center justify-center mb-5">
            <svg className="w-9 h-9 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-violet-400/70 text-xs font-bold uppercase tracking-widest mb-2">PROMPT ENGINEERING · AI 활용 극대화</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            AI를 제대로<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">100% 활용하기</span>
          </h1>
          <p className="text-violet-100/50 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-6">
            ChatGPT·Claude를 쓰는데 결과가 항상 애매하신가요?<br />
            업무에 딱 맞는 프롬프트를 전문 설계하여 AI를 제대로 활용하도록 도와드립니다.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <div className="inline-flex items-center gap-2 bg-violet-400/10 border border-violet-400/20 text-violet-300 text-xs font-medium px-4 py-2 rounded-full">
              <span className="text-green-400">↑</span> 업무 효율 평균 3~5배 향상
            </div>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/50 text-xs font-medium px-4 py-2 rounded-full">
              ChatGPT · Claude · Gemini 전용 최적화
            </div>
          </div>
        </div>
      </div>

      {/* ─── Before/After ─── */}
      <div className="px-6 py-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-violet-600 text-xs font-bold uppercase tracking-widest mb-2">BEFORE vs AFTER</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">이런 차이가 납니다</h2>
          </div>
          <div className="space-y-5">
            {examples.map((ex) => (
              <div key={ex.type} className="bg-white rounded-2xl border border-[#dbe8ff] overflow-hidden">
                <div className="bg-[#04102b] px-5 py-3 flex items-center justify-between">
                  <span className="text-white/60 text-xs font-semibold font-mono">{ex.type} 예시</span>
                  <span className="bg-violet-400/20 border border-violet-400/30 text-violet-300 text-xs px-3 py-1 rounded-full">{ex.improvement}</span>
                </div>
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#dbe8ff]">
                  <div className="p-5">
                    <div className="inline-block bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-2 py-0.5 rounded-md mb-3">일반 프롬프트</div>
                    <div className="bg-slate-50 rounded-xl px-4 py-3 font-mono text-sm text-slate-600 border border-slate-200">&ldquo;{ex.before}&rdquo;</div>
                    <div className="mt-3 text-xs text-red-500 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                      모호한 지시 → 불완전한 결과
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="inline-block bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold px-2 py-0.5 rounded-md mb-3">최적화 프롬프트</div>
                    <div className="bg-violet-50 rounded-xl px-4 py-3 font-mono text-sm text-slate-700 border border-violet-100 leading-relaxed">&ldquo;{ex.after}&rdquo;</div>
                    <div className="mt-3 text-xs text-violet-600 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      명확한 구조 → 바로 쓸 수 있는 결과
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 활용 분야 ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-violet-600 text-xs font-bold uppercase tracking-widest mb-2">USE CASES</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b]">활용 분야</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((uc, i) => (
              <div key={uc.label} className="bg-white rounded-2xl border border-[#dbe8ff] p-5 hover:border-violet-200 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-violet-600 font-extrabold text-xs">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#04102b] text-sm mb-1">{uc.label}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{uc.desc}</p>
                  </div>
                </div>
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
                  ? 'bg-gradient-to-br from-[#0d0a2e] to-[#1a0f5c] border-violet-400/30 shadow-2xl shadow-violet-900/20 scale-105'
                  : 'bg-white border-[#dbe8ff]'
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-violet-400 text-[#0d0a2e] text-xs font-extrabold px-4 py-1 rounded-full tracking-wide">추천</div>
                )}
                <div className={`text-xs font-bold mb-2 tracking-wide ${plan.highlight ? 'text-violet-400' : 'text-slate-400'}`}>{plan.name.toUpperCase()}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-3xl font-extrabold ${plan.highlight ? 'text-white' : 'text-[#04102b]'}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-violet-300/50' : 'text-slate-400'}`}>{plan.period}</span>
                </div>
                <p className={`text-xs mb-5 ${plan.highlight ? 'text-violet-300/50' : 'text-slate-400'}`}>{plan.desc}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-xs ${plan.highlight ? 'text-violet-100/80' : 'text-slate-600'}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.highlight ? 'bg-violet-400/20 border border-violet-400/40' : 'bg-[#f0f5ff] border border-[#dbe8ff]'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${plan.highlight ? 'bg-violet-400' : 'bg-[#1a56db]'}`} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.productId ? (
                  <PaymentButton
                    productId={plan.productId}
                    className={`block w-full text-center py-3 rounded-xl text-sm font-bold transition ${
                      plan.highlight ? 'bg-violet-400 text-[#0d0a2e] hover:bg-violet-300' : 'bg-[#04102b] text-white hover:bg-[#0a1f5c]'
                    }`}
                  >
                    바로 결제하기
                  </PaymentButton>
                ) : (
                  <button
                    onClick={() => openModal(`프롬프트 엔지니어링 - ${plan.name}`)}
                    className={`block w-full text-center py-3 rounded-xl text-sm font-bold transition ${
                      plan.highlight ? 'bg-violet-400 text-[#0d0a2e] hover:bg-violet-300' : 'bg-[#04102b] text-white hover:bg-[#0a1f5c]'
                    }`}
                  >
                    견적 문의
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div className="px-6 pb-12 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-[#0d0a2e] to-[#1a0f5c] rounded-2xl border border-violet-400/20 p-8 text-center">
            <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-2">GET STARTED</p>
            <h3 className="text-white text-2xl font-extrabold mb-2">AI를 제대로 활용하고 싶다면</h3>
            <p className="text-violet-100/40 text-sm mb-6">업무 분석 인터뷰 → 맞춤 설계 → 가이드 제공</p>
            <button
              onClick={() => openModal('프롬프트 엔지니어링')}
              className="inline-flex items-center gap-2 bg-violet-400 hover:bg-violet-300 text-[#0d0a2e] px-8 py-3 rounded-xl font-extrabold text-sm transition-all shadow-lg shadow-violet-900/30"
            >
              프롬프트 설계 신청 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
