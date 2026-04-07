'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PaymentButton from '@/app/components/PaymentButton';
import { createClient } from '@/lib/supabase/client';

const faqItems = [
  {
    q: '사주팔자란 무엇인가요?',
    a: '사주팔자(四柱八字)는 태어난 년·월·일·시의 네 기둥(四柱)에 각각 천간과 지지 두 글자씩 총 여덟 글자(八字)로 이루어진 동양의 전통 운명 분석 체계입니다.',
  },
  {
    q: 'AI 해석은 어떻게 동작하나요?',
    a: '전통 명리학 계산 로직(오행, 신강/신약, 용신/희신 등)으로 산출된 데이터를 Gemini AI에 전달하여 12개 항목의 상세 해석을 생성합니다. 현재 기본 원국 분석과 AI 상세 해석 모두 무료로 제공됩니다.',
  },
  {
    q: '태어난 시간을 모르면 어떻게 하나요?',
    a: '시간을 모르더라도 년·월·일 세 기둥(三柱)만으로 사주를 계산할 수 있습니다. 다만 시주가 빠지면 세부 분석 정확도가 다소 낮아집니다.',
  },
  {
    q: '음력으로 입력할 수 있나요?',
    a: '네, 양력과 음력 모두 지원합니다. 음력을 선택하면 내부적으로 양력으로 변환하여 정확한 사주를 계산합니다. 윤달도 별도 선택이 가능합니다.',
  },
];

interface SajuRecord {
  id: number;
  created_at: string;
  saju_data: {
    birth_year: number;
    birth_month: number;
    birth_day: number;
    birth_hour?: number;
    gender: string;
  };
  interpretation: string | null;
  is_paid: boolean;
}

function buildResultUrl(rec: SajuRecord) {
  const { birth_year, birth_month, birth_day, birth_hour, gender } = rec.saju_data;
  if (!birth_year || !birth_month || !birth_day) return '/saju/input';
  let url = `/saju/result?year=${birth_year}&month=${birth_month}&day=${birth_day}&gender=${gender}&calendarType=solar`;
  if (birth_hour != null) url += `&hour=${birth_hour}`;
  return url;
}

export default function SajuPage() {
  const supabase = createClient();
  const [paidRecords, setPaidRecords] = useState<SajuRecord[]>([]);
  const [hasPaid, setHasPaid] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    async function fetchRecords() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setAuthChecked(true); return; }

      const { data: records } = await supabase
        .from('saju_records')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_paid', true)
        .order('created_at', { ascending: false })
        .limit(2);

      if (records && records.length > 0) {
        setPaidRecords(records);
        setHasPaid(true);
      }
      setAuthChecked(true);
    }
    fetchRecords();
  }, []);

  return (
    <div className="min-h-full bg-[#f0f5ff]">
      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden bg-[#04102b] px-6 py-14 lg:px-12" style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 40px)' }}>

        <div className="relative max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-violet-300/70 text-xs font-mono tracking-widest uppercase">전통 명리학 × AI 해석 · 무료</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5 tracking-tight">
            AI가 분석하는<br />
            <span className="text-amber-400">사주팔자</span>
          </h1>
          <p className="text-blue-200/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            수천 년의 동양 명리학과 최신 AI 기술의 만남.<br />
            태어난 순간의 우주적 에너지를 12가지 항목으로 해석해드립니다.
          </p>

          {/* 이전 기록 있으면 분기 버튼, 없으면 단일 CTA */}
          {authChecked && hasPaid ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/saju/input"
                className="inline-flex items-center gap-2 bg-[#1a56db] hover:bg-[#1e4fc2] text-white px-7 py-3.5 rounded-xl font-semibold text-base transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                새로 보기
              </Link>
              <a
                href="#past-records"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-7 py-3.5 rounded-xl font-semibold text-base transition-all hover:bg-white/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                이전 내역 다시 보기
              </a>
            </div>
          ) : (
            <Link
              href="/saju/input"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1a56db] to-[#7c3aed] hover:from-[#1e4fc2] hover:to-[#6d28d9] text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-all shadow-lg shadow-violet-900/40"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              지금 바로 시작하기
            </Link>
          )}
        </div>
      </div>

      <div className="px-6 py-12 lg:px-12">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* ─── 이전 기록 섹션 (구매한 유저만) ─── */}
          {hasPaid && paidRecords.length > 0 && (
            <div id="past-records">
              <div className="text-center mb-6">
                <p className="text-violet-600 text-xs font-bold uppercase tracking-widest mb-2">MY RECORDS</p>
                <h2 className="text-2xl font-extrabold text-[#04102b]">이전 AI 사주 기록</h2>
                <p className="text-slate-500 text-sm mt-1">결제한 사주 기록을 다시 확인하세요</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {paidRecords.map((rec) => (
                  <div key={rec.id} className="bg-white rounded-2xl border border-[#dbe8ff] p-5 hover:border-violet-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">
                          {new Date(rec.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="font-bold text-[#04102b] text-base">
                          {rec.saju_data.birth_year ?? '?'}년{' '}
                          {rec.saju_data.birth_month ?? '?'}월{' '}
                          {rec.saju_data.birth_day ?? '?'}일생
                        </div>
                        <div className="text-sm text-slate-500 mt-0.5">
                          {rec.saju_data.gender === 'male' ? '남성' : '여성'}
                          {rec.saju_data.birth_hour != null ? ` · ${rec.saju_data.birth_hour}시생` : ''}
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex-shrink-0">
                        AI 해석 완료
                      </span>
                    </div>
                    {rec.interpretation && (
                      <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 mb-3 line-clamp-2">
                        {rec.interpretation.replace(/[#*]/g, '').substring(0, 80)}...
                      </p>
                    )}
                    <Link
                      href={buildResultUrl(rec)}
                      className="block w-full text-center py-2 rounded-xl text-sm font-bold bg-[#04102b] hover:bg-[#0a1f5c] text-white border border-[#1a3a7a] transition"
                    >
                      다시 보기 →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── 바로 시작하기 CTA ─── */}
          <div
            className="rounded-2xl border border-[#1a3a7a] p-8 text-center"
            style={{
              background: '#04102b',
              backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 30px)',
            }}
          >
            <h3 className="text-2xl font-extrabold text-white mb-2">지금 무료로 시작하세요</h3>
            <p className="text-blue-200/60 text-sm mb-6">회원가입 없이, 생년월일만 입력하면 바로 확인 가능합니다</p>
            <Link
              href="/saju/input"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#04102b] px-8 py-3.5 rounded-xl font-bold text-base transition-all"
            >
              사주 입력하러 가기 →
            </Link>
          </div>

          {/* ─── 무료 vs 유료 비교표 ─── */}
          <div>
            <div className="text-center mb-8">
              <p className="text-[#1a56db] text-xs font-bold uppercase tracking-widest mb-2">PRICING</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#04102b] tracking-tight">무엇을 분석해드리나요</h2>
              <p className="text-slate-500 text-sm mt-2">기본 원국은 무료, AI 상세 해석은 1,000원</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 무료 */}
              <div className="bg-white rounded-2xl border border-[#dbe8ff] p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#f0f5ff] border border-[#dbe8ff] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#1a56db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">FREE</div>
                    <div className="text-lg font-extrabold text-[#04102b]">무료 기본 분석</div>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    '사주팔자 원국 (년·월·일·시주)',
                    '천간·지지·지장간 표',
                    '십성 및 십이운성',
                    '오행 분포 차트',
                    '지지 상호작용 (합·충·형)',
                    '일간 분석 요약',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1a56db]" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="text-2xl font-extrabold text-[#04102b]">무료</div>
                  <div className="text-xs text-slate-500 mt-1">회원가입 불필요</div>
                  <Link
                    href="/saju/input"
                    className="mt-4 block w-full text-center py-2.5 rounded-xl text-sm font-bold bg-[#f0f5ff] border border-[#dbe8ff] text-[#1a56db] hover:bg-blue-50 transition"
                  >
                    무료로 시작하기
                  </Link>
                </div>
              </div>

              {/* AI 해석 (현재 무료) */}
              <div
                className="rounded-2xl border border-[#1a3a7a] p-6 shadow-lg relative overflow-hidden"
                style={{
                  background: '#04102b',
                  backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 30px)',
                }}
              >
                <div className="absolute top-4 right-4 bg-amber-400 text-[#04102b] text-xs font-bold px-2 py-0.5 rounded-lg">
                  1,000원
                </div>
                <div className="flex items-center gap-3 mb-5 relative">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-violet-300 uppercase tracking-wide">AI PREMIUM</div>
                    <div className="text-lg font-extrabold text-white">AI 상세 해석</div>
                  </div>
                </div>
                <ul className="space-y-3 relative">
                  {[
                    '무료 기본 분석 전체 포함',
                    '신강/신약 정밀 판단',
                    '용신·희신·기신 추정',
                    '대운 (10년 주기) 분석',
                    '올해 세운 흐름',
                    'Gemini 2.5 Pro AI 12가지 상세 해석',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-blue-200">
                      <div className="w-4 h-4 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-5 border-t border-white/10 relative">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-extrabold text-white">1,000원</span>
                    <span className="text-xs text-blue-300/50">/ 1회</span>
                  </div>
                  <div className="text-xs text-blue-300/70 mt-1 mb-4">로그인 후 결제 · 12가지 항목 AI 해석</div>
                  <Link
                    href="/saju/input"
                    className="block w-full text-center py-3 rounded-xl text-sm font-bold transition bg-amber-400 text-[#04102b] hover:bg-amber-300"
                  >
                    사주 분석 시작하기 →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ─── FAQ ─── */}
          <div>
            <div className="text-center mb-8">
              <p className="text-[#1a56db] text-xs font-bold uppercase tracking-widest mb-2">FAQ</p>
              <h2 className="text-2xl font-extrabold text-[#04102b]">자주 묻는 질문</h2>
            </div>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#dbe8ff] p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#f0f5ff] border border-[#dbe8ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#1a56db] text-xs font-bold">Q</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#04102b] text-sm mb-2">{item.q}</p>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
