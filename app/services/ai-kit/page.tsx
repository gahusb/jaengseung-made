'use client';

import Link from 'next/link';
import PaymentButton from '../../components/PaymentButton';

const TOOLS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: '업무 일지 자동 작성기',
    desc: '하루 업무 키워드 5개만 입력하면 AI가 전문적인 일지를 자동으로 작성. 매일 10분씩 절약.',
    tag: '직장인 필수',
    tagColor: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: '이메일 자동 답장 생성기',
    desc: '받은 이메일을 붙여넣으면 AI가 상황에 맞는 정중한 답장을 3가지 버전으로 생성.',
    tag: '소상공인 필수',
    tagColor: 'bg-violet-500/15 text-violet-400 border-violet-500/25',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    title: '월간 매출 분석 리포트 자동화',
    desc: '숫자만 입력하면 전월 대비 분석, 인사이트, 개선 방향까지 AI가 리포트로 정리.',
    tag: '소상공인 필수',
    tagColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'SNS 콘텐츠 캘린더 생성기',
    desc: '업종과 주제어를 입력하면 한 달치 인스타그램·블로그 콘텐츠 기획안을 자동 생성.',
    tag: 'SNS 마케팅',
    tagColor: 'bg-pink-500/15 text-pink-400 border-pink-500/25',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: '회의록·미팅 노트 자동 정리',
    desc: '대화 내용이나 메모를 입력하면 AI가 결정 사항·액션 아이템·다음 단계를 구조화.',
    tag: '직장인 필수',
    tagColor: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: '상품 설명·리뷰 응답 자동화',
    desc: '상품명과 특징을 입력하면 스마트스토어·쿠팡 최적화 상품 설명 + 리뷰 답변을 즉시 생성.',
    tag: '온라인 판매자',
    tagColor: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
  },
];

const TESTIMONIALS = [
  {
    name: '김하윤',
    job: '카페 운영 3년차',
    text: '매일 SNS 올릴 내용 고민하다 지쳤는데, 이제 30초면 한 달치 아이디어가 나와요. 매출도 15% 올랐어요.',
    rating: 5,
  },
  {
    name: '박도현',
    job: '중소기업 팀장',
    text: '주간 보고서 작성이 2시간에서 20분으로 줄었습니다. 팀원들한테도 공유했어요.',
    rating: 5,
  },
  {
    name: '이서진',
    job: '프리랜서 디자이너',
    text: '클라이언트 이메일 답장을 AI로 생성하니까 전문적으로 보인다는 피드백을 많이 받아요.',
    rating: 5,
  },
];

const FAQ = [
  {
    q: 'AI를 전혀 써본 적 없어도 가능한가요?',
    a: 'ChatGPT나 Claude에 복사·붙여넣기만 할 수 있으면 됩니다. 모든 도구에 단계별 사용 가이드가 포함되어 있습니다.',
  },
  {
    q: '매달 어떤 것이 업데이트되나요?',
    a: '매월 1일에 새로운 자동화 도구 1~2종이 추가됩니다. 트렌드 변화와 구독자 요청을 반영하여 지속적으로 개선합니다.',
  },
  {
    q: '해지는 언제든지 가능한가요?',
    a: '네, 언제든지 마이페이지에서 구독을 취소할 수 있습니다. 해지 후에도 해당 월 말일까지 사용 가능합니다.',
  },
  {
    q: '스마트스토어·쿠팡 판매자도 쓸 수 있나요?',
    a: '네. 상품 설명 자동화, 리뷰 답변 자동화 등 온라인 판매자를 위한 전용 도구가 포함되어 있습니다.',
  },
];

export default function AiKitPage() {
  return (
    <div className="min-h-full bg-[#f0f4ff]">

      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0f2e] via-[#0f1a5c] to-[#0a0f2e] px-6 py-14 lg:px-12">
        {/* 배경 그리드 패턴 */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        {/* 글로우 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #6366f1, transparent 70%)' }} />

        <div className="relative max-w-3xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-indigo-300/60 hover:text-indigo-300 text-sm mb-6 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            홈으로
          </Link>

          {/* 배지 */}
          <div className="inline-flex items-center gap-2 bg-indigo-400/10 border border-indigo-400/25 text-indigo-300 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI AUTOMATION KIT · 월 구독
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            반복 업무를 AI로<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              한 번에 끝내세요
            </span>
          </h1>

          <p className="text-indigo-100/50 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-8">
            소상공인과 직장인이 매일 반복하는 업무를<br />
            AI 자동화 도구 6종으로 10배 빠르게 처리합니다.
          </p>

          {/* 가격 카드 */}
          <div className="inline-flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl px-8 py-5 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold bg-red-500 text-white px-2 py-0.5 rounded-md">런칭 특가</span>
              <span className="text-sm line-through text-white/30">월 39,900원</span>
            </div>
            <div className="text-4xl font-extrabold text-white">
              19,900<span className="text-xl font-semibold text-white/50">원</span>
              <span className="text-base font-normal text-white/40 ml-1">/ 월</span>
            </div>
            <p className="text-indigo-300/60 text-xs mt-1">언제든 해지 가능 · 해지 후 월말까지 이용</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <PaymentButton
              productId="ai_kit_monthly"
              className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-base font-extrabold px-8 py-4 rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-indigo-500/25 w-full max-w-xs"
              returnUrl="/services/ai-kit"
            >
              지금 구독 시작하기 →
            </PaymentButton>
            <p className="text-white/25 text-xs">로그인 후 즉시 이용 · 토스페이먼츠 카드 결제</p>
          </div>
        </div>
      </div>

      {/* ─── 포함 도구 ─── */}
      <div className="px-6 py-12 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 text-indigo-500 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3">
              6가지 AI 자동화 도구 포함
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">구독하면 바로 쓸 수 있는 도구들</h2>
            <p className="text-slate-500 text-sm mt-2">모든 도구는 ChatGPT · Claude에 복사·붙여넣기만으로 즉시 사용 가능합니다</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map((tool, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all group">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-4 group-hover:bg-indigo-100 transition-colors">
                  {tool.icon}
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border mb-3 inline-block ${tool.tagColor}`}>
                  {tool.tag}
                </span>
                <h3 className="text-sm font-extrabold text-slate-800 mb-2 leading-snug">{tool.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>

          {/* 업데이트 알림 */}
          <div className="mt-6 bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-200 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-indigo-700">매월 업데이트</p>
              <p className="text-xs text-indigo-600/70 mt-0.5">매달 1일, 새 자동화 도구 1~2종이 자동으로 추가됩니다. 추가 비용 없이 계속 늘어나는 도구를 사용할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 누구에게 필요한가 ─── */}
      <div className="px-6 py-10 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800">이런 분들에게 딱입니다</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🏪', title: '소상공인', desc: '매일 SNS, 이메일, 리뷰 답변에 지치신 분' },
              { icon: '💼', title: '직장인', desc: '보고서·회의록·업무 일지를 빠르게 끝내고 싶은 분' },
              { icon: '🛍', title: '온라인 판매자', desc: '스마트스토어·쿠팡 상품 설명을 대량으로 작성해야 하는 분' },
              { icon: '📣', title: '1인 마케터', desc: '콘텐츠 아이디어가 떨어지지 않도록 자동화하고 싶은 분' },
            ].map((item, i) => (
              <div key={i} className="text-center p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="text-sm font-extrabold text-slate-800 mb-1">{item.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 사용 후기 ─── */}
      <div className="px-6 py-10 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800">실제 사용 후기</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-xs font-bold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.job}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FAQ ─── */}
      <div className="px-6 py-10 lg:px-12 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800">자주 묻는 질문</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-5">
                <p className="text-sm font-bold text-slate-800 mb-2">Q. {item.q}</p>
                <p className="text-sm text-slate-500 leading-relaxed">A. {item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 최하단 CTA ─── */}
      <div className="px-6 py-14 lg:px-12 bg-gradient-to-br from-[#0a0f2e] to-[#0f1a5c]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            지금 시작하면 내일부터<br />업무 시간이 달라집니다
          </h2>
          <p className="text-indigo-200/50 text-sm mb-8">
            월 19,900원으로 매일 1~2시간을 되찾으세요.<br />
            언제든 해지 가능하니 부담 없이 시작해보세요.
          </p>
          <div className="flex flex-col items-center gap-3">
            <PaymentButton
              productId="ai_kit_monthly"
              className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-base font-extrabold px-8 py-4 rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-indigo-500/25 w-full max-w-sm"
              returnUrl="/services/ai-kit"
            >
              월 19,900원으로 구독 시작 →
            </PaymentButton>
            <p className="text-white/25 text-xs">로그인 후 즉시 이용 · 카드 정기결제 · 언제든 해지</p>
          </div>
        </div>
      </div>

    </div>
  );
}
