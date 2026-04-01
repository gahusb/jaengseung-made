'use client';

import Link from 'next/link';
import PaymentButton from '../../components/PaymentButton';

/* ──────────────────────────────────────────────────────────────
   Before / After 데이터 — 각 도구별 실제 시간 비교
   마케팅 카피의 핵심: 추상적 "빠름"이 아닌 구체적 숫자
────────────────────────────────────────────────────────────── */
const TOOLS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: '업무 일지 자동 작성기',
    desc: '하루 업무 키워드 5개만 입력하면 AI가 전문적인 일지를 즉시 완성.',
    tag: '직장인 필수',
    tagColor: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    before: '15분',
    after: '40초',
    beforeLabel: '직접 쓸 때',
    afterLabel: 'AI 사용 시',
    failCase: '대충 쓰면 상사 피드백 → 재작성 → 결국 30분',
    saving: '월 4.7시간 절약',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: '이메일 자동 답장 생성기',
    desc: '받은 이메일을 붙여넣으면 상황에 맞는 정중한 답장 3가지 버전을 즉시 생성.',
    tag: '소상공인 필수',
    tagColor: 'bg-violet-500/15 text-violet-400 border-violet-500/25',
    before: '23분',
    after: '2분',
    beforeLabel: '직접 쓸 때',
    afterLabel: 'AI 사용 시',
    failCase: '어조가 애매하면 상대방 기분 상함 → 계약 취소 위험',
    saving: '월 6.4시간 절약',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    title: '월간 매출 분석 리포트',
    desc: '숫자만 입력하면 전월 대비 분석·인사이트·개선 방향을 리포트로 정리.',
    tag: '소상공인 필수',
    tagColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    before: '2시간 30분',
    after: '5분',
    beforeLabel: '엑셀 + 직접 분석',
    afterLabel: 'AI 사용 시',
    failCase: '분석 없이 감으로 운영 → 손실 트렌드 한 달 늦게 발견',
    saving: '월 2.4시간 절약',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'SNS 콘텐츠 캘린더',
    desc: '업종과 키워드를 입력하면 한 달치 인스타·블로그 콘텐츠 기획안을 자동 생성.',
    tag: 'SNS 마케팅',
    tagColor: 'bg-pink-500/15 text-pink-400 border-pink-500/25',
    before: '1시간 30분/주',
    after: '10분/월',
    beforeLabel: '매주 기획할 때',
    afterLabel: 'AI로 한 번에',
    failCase: 'SNS 3일 공백 → 인스타 도달 -40% · 팔로워 이탈 시작',
    saving: '월 5.7시간 절약',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: '회의록·미팅 노트 정리',
    desc: '대화 내용이나 메모를 입력하면 결정 사항·액션아이템·다음 단계를 즉시 구조화.',
    tag: '직장인 필수',
    tagColor: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    before: '40분',
    after: '3분',
    beforeLabel: '직접 정리할 때',
    afterLabel: 'AI 사용 시',
    failCase: '액션아이템 누락 → 후속 지연 → "그때 얘기했잖아요" 분쟁',
    saving: '월 3.7시간 절약',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: '상품 설명·리뷰 답변 자동화',
    desc: '상품명과 특징을 입력하면 스마트스토어·쿠팡 최적화 상품 설명 + 리뷰 답변 즉시 생성.',
    tag: '온라인 판매자',
    tagColor: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
    before: '25분/개',
    after: '30초/개',
    beforeLabel: '상품 1개 설명 직접 쓸 때',
    afterLabel: 'AI 사용 시',
    failCase: '밋밋한 설명 → 클릭율 낮음 → 검색 노출 하락 → 매출 감소',
    saving: '상품 10개 기준 월 4시간 절약',
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
  const totalMonthlySaving = 27; // 도구 합산 월 절약 시간(추정)

  return (
    <div className="min-h-full bg-[#f0f4ff]">

      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden bg-[#0a0f2e] px-6 py-14 lg:px-12" style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 40px)' }}>

        <div className="relative max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-indigo-300/60 hover:text-indigo-300 text-sm mb-8 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            홈으로
          </Link>

          <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4 font-mono">AI 자동화 키트 · 월 구독</p>

          {/* 핵심 카피 */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            오늘도 반복 업무에<br />
            <span className="text-red-400">{totalMonthlySaving}시간을 낭비하고 있습니다</span>
          </h1>

          <p className="text-indigo-100/60 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
            일지 작성, 이메일 답장, 보고서, SNS 기획…<br />
            <strong className="text-white">혼자 하면 월 {totalMonthlySaving}시간 이상 소비되는 일들,</strong> AI로 90% 줄일 수 있습니다.
          </p>

          {/* 가격 카드 */}
          <div className="inline-flex flex-col bg-white/5 border border-white/10 rounded-xl px-8 py-5 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded">런칭 특가</span>
              <span className="text-sm line-through text-white/30">월 39,900원</span>
            </div>
            <div className="text-4xl font-extrabold text-white">
              19,900<span className="text-xl font-semibold text-white/50">원</span>
              <span className="text-base font-normal text-white/40 ml-1">/ 월</span>
            </div>
            <p className="text-indigo-300/60 text-xs mt-1">언제든 해지 가능 · 해지 후 월말까지 이용</p>
          </div>

          <div className="flex flex-col gap-3">
            <PaymentButton
              productId="ai_kit_monthly"
              className="bg-blue-600 hover:bg-blue-500 text-white text-base font-bold px-8 py-4 rounded-xl transition-colors w-full max-w-xs"
              returnUrl="/services/ai-kit"
            >
              월 {totalMonthlySaving}시간 되찾기 →
            </PaymentButton>
            <p className="text-white/25 text-xs">로그인 후 즉시 이용 · 토스페이먼츠 카드 결제</p>
          </div>
        </div>
      </div>

      {/* ─── 시간 낭비 가시화 섹션 ─── */}
      <div className="bg-white px-6 py-12 lg:px-12 border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">
              지금 이 순간도 낭비되고 있는 당신의 시간
            </h2>
            <p className="text-slate-500 text-sm">직장인·소상공인 평균 작업 시간 기준 / 월 22 영업일 계산</p>
          </div>

          {/* 총합 카드 */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-red-600 mb-1">6가지 반복 업무를 혼자 할 때</p>
                <p className="text-4xl font-extrabold text-slate-800">
                  월 <span className="text-red-500">{totalMonthlySaving}시간 19분</span> 낭비
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  시급 15,000원 기준 → <span className="font-bold text-slate-700">월 409,000원어치 시간 손실</span>
                </p>
              </div>
              <div className="text-center md:text-right">
                <div className="text-2xl font-extrabold text-indigo-600">AI 도입 후</div>
                <div className="text-4xl font-extrabold text-emerald-500">2시간 6분</div>
                <div className="text-slate-500 text-sm mt-1">전체 작업 시간 <span className="font-bold text-emerald-600">92.3% 감소</span></div>
              </div>
            </div>
          </div>

          {/* 개별 도구 Before/After 바 차트 */}
          <div className="space-y-3">
            {TOOLS.map((tool, i) => {
              const beforeVal = tool.before;
              const afterVal = tool.after;
              return (
                <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-800">{tool.title}</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {tool.saving}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-slate-400 w-20 text-right flex-shrink-0">{tool.beforeLabel}</span>
                      <div className="flex-1 bg-red-100 rounded-full h-2">
                        <div className="bg-red-400 h-2 rounded-full" style={{ width: '100%' }} />
                      </div>
                      <span className="font-extrabold text-red-500 w-20 flex-shrink-0">{beforeVal}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs mt-1.5">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-slate-400 w-20 text-right flex-shrink-0">{tool.afterLabel}</span>
                      <div className="flex-1 bg-emerald-100 rounded-full h-2">
                        <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '8%' }} />
                      </div>
                      <span className="font-extrabold text-emerald-600 w-20 flex-shrink-0">{afterVal}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── "안 쓰면 생기는 실패 비용" 섹션 ─── */}
      <div className="px-6 py-12 lg:px-12 bg-[#0a0f2e]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
              AI를 안 쓸 때 생기는 실패 비용
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              시간만 낭비되는 게 아닙니다
            </h2>
            <p className="text-slate-400 text-sm">반복 업무를 수작업으로 할 때 실제로 발생하는 손실들</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map((tool, i) => (
              <div key={i} className="bg-slate-900/60 border border-red-900/40 rounded-2xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/25 flex items-center justify-center text-red-400 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-slate-300">{tool.title} 수작업 시</p>
                </div>
                <p className="text-sm text-red-300/80 leading-relaxed border-l-2 border-red-500/30 pl-3">
                  {tool.failCase}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-r from-indigo-900/50 to-violet-900/50 border border-indigo-500/30 rounded-2xl p-6 text-center">
            <p className="text-white text-lg font-extrabold mb-1">
              실수 1번이 계약 1건을 날립니다.
            </p>
            <p className="text-indigo-300/70 text-sm">
              월 19,900원으로 시간 손실과 실수 비용을 동시에 없애세요.
            </p>
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
            <p className="text-slate-500 text-sm mt-2">ChatGPT · Claude에 복사·붙여넣기만으로 즉시 사용 가능</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map((tool, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-100 transition-colors">
                    {tool.icon}
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${tool.tagColor}`}>
                    {tool.tag}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 mb-1.5 leading-snug">{tool.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{tool.desc}</p>
                {/* 인라인 Before/After */}
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                  <span className="text-xs text-red-500 font-bold">{tool.before}</span>
                  <svg className="w-3 h-3 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <span className="text-xs text-emerald-600 font-bold">{tool.after}</span>
                  <span className="text-xs text-slate-400 ml-auto">{tool.saving.replace('월 ', '').replace(' 절약', '')}</span>
                </div>
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
              <p className="text-sm font-bold text-indigo-700">매월 1일 — 새 도구 자동 추가</p>
              <p className="text-xs text-indigo-600/70 mt-0.5">구독자 요청과 트렌드를 반영해 매달 새 자동화 도구 1~2종이 추가됩니다. 추가 비용 없음.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 누구에게 필요한가 ─── */}
      <div className="px-6 py-10 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800">이런 분들이 가장 많이 씁니다</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: '🏪',
                title: '소상공인',
                pain: '"매일 SNS, 이메일, 리뷰 답변에 2~3시간씩 쓰고 있어요."',
                gain: '도구 3개만 써도 월 12시간 이상 확보',
              },
              {
                icon: '💼',
                title: '직장인',
                pain: '"보고서 쓰다가 퇴근 시간 넘기는 게 일상이에요."',
                gain: '보고서·일지·회의록 시간 90% 감소',
              },
              {
                icon: '🛍',
                title: '온라인 판매자',
                pain: '"상품 50개 설명 쓰는 데 이틀이 걸렸어요."',
                gain: '50개 상품 설명 → 25분 완성',
              },
              {
                icon: '📣',
                title: '1인 마케터',
                pain: '"콘텐츠 아이디어 고갈로 업로드를 자꾸 건너뛰어요."',
                gain: '한 달치 콘텐츠 기획 → 10분 완성',
              },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="text-sm font-extrabold text-slate-800 mb-2">{item.title}</p>
                <p className="text-xs text-slate-500 italic leading-relaxed mb-3">{item.pain}</p>
                <p className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg px-2 py-1.5">
                  → {item.gain}
                </p>
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
          {/* 마지막 카피: 기회비용 프레이밍 */}
          <p className="text-indigo-300/60 text-sm font-bold uppercase tracking-widest mb-3">구독 안 하면 내일도 동일합니다</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            월 19,900원 vs<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              월 409,000원어치 시간 낭비
            </span>
          </h2>
          <p className="text-indigo-200/50 text-sm mb-8">
            도구를 쓰지 않아도 내일은 옵니다. 단, 오늘과 똑같이.
            <br />언제든 해지 가능하니 한 달만 써보세요.
          </p>
          <div className="flex flex-col items-center gap-3">
            <PaymentButton
              productId="ai_kit_monthly"
              className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-base font-extrabold px-8 py-4 rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-indigo-500/25 w-full max-w-sm"
              returnUrl="/services/ai-kit"
            >
              월 {totalMonthlySaving}시간 되찾기 — 19,900원 →
            </PaymentButton>
            <p className="text-white/25 text-xs">로그인 후 즉시 이용 · 카드 정기결제 · 언제든 해지</p>
          </div>
        </div>
      </div>

    </div>
  );
}
