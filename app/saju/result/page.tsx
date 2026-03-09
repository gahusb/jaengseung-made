import { calculateSaju } from '@/lib/saju-calculator';
import Link from 'next/link';
import { calculateDaeun, getCurrentDaeun, getDaeunDescription } from '@/lib/daeun-calculator';
import { getCurrentSolarTerm, getSolarTermName, getSolarTermMonthBranch } from '@/lib/solar-terms';
import { EARTHLY_BRANCHES_KR, FIVE_ELEMENTS_KR, FIVE_ELEMENTS } from '@/lib/saju-calculator';
import { calculateElementScore, performFullAnalysis } from '@/lib/ai-interpretation';
import { createClient } from '@/lib/supabase/server';
import SajuAISection from './SajuAISection';

interface PageProps {
  searchParams: Promise<{
    year: string;
    month: string;
    day: string;
    hour?: string;
    gender: 'male' | 'female';
    calendarType: 'solar' | 'lunar';
    originalYear?: string;
    originalMonth?: string;
    originalDay?: string;
    isLeapMonth?: string;
  }>;
}

export default async function SajuResultPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const {
    year, month, day, hour, gender, calendarType,
    originalYear, originalMonth, originalDay, isLeapMonth
  } = params;

  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  const hourNum = hour ? parseInt(hour, 10) : null;

  // 필수 파라미터 누락 시 안전한 기본값 (NaN 방지)
  if (isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum)) {
    return (
      <div className="min-h-full bg-[#f0f5ff] flex items-center justify-center">
        <div className="text-center py-20">
          <p className="text-slate-500 text-sm mb-4">잘못된 접근입니다. 생년월일을 다시 입력해주세요.</p>
          <a href="/saju/input" className="text-blue-600 underline text-sm">사주 입력하기</a>
        </div>
      </div>
    );
  }

  const inputYear = originalYear ? parseInt(originalYear) : yearNum;
  const inputMonth = originalMonth ? parseInt(originalMonth) : monthNum;
  const inputDay = originalDay ? parseInt(originalDay) : dayNum;
  const isLunar = calendarType === 'lunar';
  const isLeap = isLeapMonth === 'true';

  const sajuData = calculateSaju(yearNum, monthNum, dayNum, hourNum, gender);

  // 결제 여부 + 저장된 AI 해석 확인 (서버사이드)
  let hasPaid = false;
  let savedInterpretation: string | null = null;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', 'saju_detail')
        .eq('status', 'paid')
        .maybeSingle();
      hasPaid = !!order;

      if (hasPaid) {
        const birthKey: Record<string, unknown> = { birth_year: yearNum, birth_month: monthNum, birth_day: dayNum, gender };
        if (hourNum !== null) birthKey.birth_hour = hourNum;
        const { data: record } = await supabase
          .from('saju_records')
          .select('interpretation')
          .eq('user_id', user.id)
          .eq('is_paid', true)
          .contains('saju_data', birthKey)
          .maybeSingle();
        savedInterpretation = record?.interpretation ?? null;
      }
    }
  } catch {
    // 인증 오류 시 무시 (미로그인)
  }

  // 절기 정보
  const solarTermIndex = getCurrentSolarTerm(yearNum, monthNum, dayNum);
  const solarTermName = getSolarTermName(solarTermIndex);
  const monthBranchIndex = getSolarTermMonthBranch(yearNum, monthNum, dayNum);
  const monthBranchName = EARTHLY_BRANCHES_KR[monthBranchIndex];

  // 종합 분석 수행
  const analysis = performFullAnalysis(sajuData);
  const elementScores = analysis.elementScores;

  // 대운 계산
  const daeunList = calculateDaeun(
    yearNum, monthNum, dayNum, gender,
    sajuData.month.stem, sajuData.month.branch
  );
  const currentYear = new Date().getFullYear();
  const currentDaeun = getCurrentDaeun(daeunList, currentYear);

  // 오행 색상 매핑
  const elementColors: { [key: string]: string } = {
    '木': 'text-green-700', '火': 'text-red-600', '土': 'text-yellow-700',
    '金': 'text-amber-600', '水': 'text-blue-700',
  };
  const elementBgColors: { [key: string]: string } = {
    '木': 'bg-green-50 border-green-400', '火': 'bg-red-50 border-red-400',
    '土': 'bg-yellow-50 border-yellow-400', '金': 'bg-amber-50 border-amber-400',
    '水': 'bg-blue-50 border-blue-400',
  };

  // 띠 계산
  const zodiacAnimals = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
  const zodiacIndex = (yearNum - 4) % 12;
  const zodiacAnimal = zodiacAnimals[zodiacIndex >= 0 ? zodiacIndex : zodiacIndex + 12];

  return (
    <div className="min-h-full bg-[#f0f5ff]">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-[#04102b] via-[#0a1f5c] to-[#04102b] px-6 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-400/10 border border-violet-400/25 text-violet-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            사주팔자 감정서
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">사주팔자 분석 결과</h1>
          <p className="text-blue-200/60 text-sm">전통 명리학과 AI 기술의 만남</p>
        </div>
      </div>

      <div className="px-6 py-8 max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">

          {/* 사이드바 - 기본 정보 */}
          <aside className="lg:sticky lg:top-6 h-fit">
            <div className="bg-[#04102b] rounded-2xl p-6 text-white">
              <h2 className="text-base font-bold mb-5 text-center pb-4 border-b border-white/10">
                기본 정보
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-blue-300/60 mb-1">생년월일</div>
                  <div className="font-bold">
                    {isLunar ? (
                      <div>
                        <div>음력 {inputYear}.{inputMonth}.{inputDay}{isLeap ? ' (윤달)' : ''}</div>
                        <div className="text-xs text-blue-300/50 mt-0.5">양력 {yearNum}.{monthNum}.{dayNum}</div>
                      </div>
                    ) : (
                      <div>{yearNum}.{monthNum}.{dayNum}</div>
                    )}
                  </div>
                </div>
                {hourNum !== null && (
                  <div>
                    <div className="text-blue-300/60 mb-1">태어난 시간</div>
                    <div className="font-bold">{hourNum}시</div>
                  </div>
                )}
                <div>
                  <div className="text-blue-300/60 mb-1">성별</div>
                  <div className="font-bold">{gender === 'male' ? '남성' : '여성'}</div>
                </div>
                <div>
                  <div className="text-blue-300/60 mb-1">띠</div>
                  <div className="font-bold">{zodiacAnimal}띠</div>
                </div>
                <div>
                  <div className="text-blue-300/60 mb-1">일간</div>
                  <div className="font-bold text-2xl text-amber-400">
                    {sajuData.day.stem} ({sajuData.day.stemKr})
                  </div>
                  <div className="text-xs text-blue-300/60 mt-1">
                    {FIVE_ELEMENTS_KR[sajuData.day.element as keyof typeof FIVE_ELEMENTS_KR]}({sajuData.day.element})
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-white/10 space-y-2">
                <Link
                  href="/saju/input"
                  className="block w-full text-center bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                >
                  다시 입력하기
                </Link>
                <Link
                  href="/saju"
                  className="block w-full text-center bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 px-4 py-2 rounded-lg transition text-sm font-medium"
                >
                  서비스 소개
                </Link>
              </div>
            </div>
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="space-y-6">

            {/* 사주팔자 표 */}
            <div className="bg-white rounded-2xl border border-[#dbe8ff] p-6">
              <h2 className="text-xl font-extrabold text-[#04102b] mb-5 text-center">사주팔자 (四柱八字)</h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#04102b] text-white">
                      <th className="py-2.5 px-3 text-center font-bold text-xs">구분</th>
                      {sajuData.hour && <th className="py-2.5 px-3 text-center font-bold text-xs">시주</th>}
                      <th className="py-2.5 px-3 text-center font-bold text-xs">일주</th>
                      <th className="py-2.5 px-3 text-center font-bold text-xs">월주</th>
                      <th className="py-2.5 px-3 text-center font-bold text-xs">년주</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 천간 */}
                    <tr className="border-b border-slate-100">
                      <td className="py-2.5 px-3 text-center font-semibold text-[#04102b] bg-[#f0f5ff] text-xs">천간</td>
                      {sajuData.hour && (
                        <td className="py-2.5 px-3 text-center">
                          <div className="text-xl font-bold text-[#04102b]">{sajuData.hour.stem}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{sajuData.hour.stemKr}</div>
                        </td>
                      )}
                      <td className="py-2.5 px-3 text-center bg-amber-50">
                        <div className="text-xl font-bold text-[#04102b]">{sajuData.day.stem}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{sajuData.day.stemKr}</div>
                        <div className="text-xs text-amber-600 font-bold mt-0.5">일간</div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="text-xl font-bold text-[#04102b]">{sajuData.month.stem}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{sajuData.month.stemKr}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="text-xl font-bold text-[#04102b]">{sajuData.year.stem}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{sajuData.year.stemKr}</div>
                      </td>
                    </tr>

                    {/* 지지 */}
                    <tr className="border-b border-slate-100">
                      <td className="py-2.5 px-3 text-center font-semibold text-[#04102b] bg-[#f0f5ff] text-xs">지지</td>
                      {sajuData.hour && (
                        <td className="py-2.5 px-3 text-center">
                          <div className="text-xl font-bold text-[#04102b]">{sajuData.hour.branch}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{sajuData.hour.branchKr}</div>
                        </td>
                      )}
                      <td className="py-2.5 px-3 text-center bg-amber-50">
                        <div className="text-xl font-bold text-[#04102b]">{sajuData.day.branch}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{sajuData.day.branchKr}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="text-xl font-bold text-[#04102b]">{sajuData.month.branch}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{sajuData.month.branchKr}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="text-xl font-bold text-[#04102b]">{sajuData.year.branch}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{sajuData.year.branchKr}</div>
                      </td>
                    </tr>

                    {/* 지장간 */}
                    <tr className="border-b border-slate-100">
                      <td className="py-2.5 px-3 text-center font-semibold text-[#04102b] bg-[#f0f5ff] text-xs">
                        <div>지장간</div>
                        <div className="text-[10px] text-slate-400 font-normal">숨은 천간</div>
                      </td>
                      {(() => {
                        const pillars = sajuData.hour
                          ? [analysis.hiddenStems.find(h => h.pillar === '시주'), analysis.hiddenStems.find(h => h.pillar === '일주'), analysis.hiddenStems.find(h => h.pillar === '월주'), analysis.hiddenStems.find(h => h.pillar === '년주')]
                          : [analysis.hiddenStems.find(h => h.pillar === '일주'), analysis.hiddenStems.find(h => h.pillar === '월주'), analysis.hiddenStems.find(h => h.pillar === '년주')];
                        return pillars.map((h, idx) => (
                          <td key={idx} className={`py-2 px-2 text-center ${h?.pillar === '일주' ? 'bg-amber-50' : ''}`}>
                            {h && (
                              <div className="flex flex-wrap justify-center gap-1">
                                {h.stems.map((s, si) => (
                                  <span
                                    key={si}
                                    className={`inline-block px-1.5 py-0.5 rounded text-xs font-semibold border ${elementBgColors[s.element] || 'bg-gray-100'}`}
                                    title={s.role}
                                  >
                                    {s.stemKr}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                        ));
                      })()}
                    </tr>

                    {/* 십성 */}
                    <tr className="border-b border-slate-100">
                      <td className="py-2.5 px-3 text-center font-semibold text-[#04102b] bg-[#f0f5ff] text-xs">십성</td>
                      {sajuData.hour && (
                        <td className="py-2.5 px-3 text-center">
                          <div className="text-xs font-bold text-[#04102b]">{sajuData.hour.tenGod}</div>
                        </td>
                      )}
                      <td className="py-2.5 px-3 text-center bg-amber-50">
                        <div className="text-xs font-bold text-[#04102b]">{sajuData.day.tenGod}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="text-xs font-bold text-[#04102b]">{sajuData.month.tenGod}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="text-xs font-bold text-[#04102b]">{sajuData.year.tenGod}</div>
                      </td>
                    </tr>

                    {/* 십이운성 */}
                    <tr>
                      <td className="py-2.5 px-3 text-center font-semibold text-[#04102b] bg-[#f0f5ff] text-xs">십이운성</td>
                      {sajuData.hour && (
                        <td className="py-2.5 px-3 text-center">
                          <div className="text-xs font-bold text-[#04102b]">{sajuData.hour.fortune}</div>
                        </td>
                      )}
                      <td className="py-2.5 px-3 text-center bg-amber-50">
                        <div className="text-xs font-bold text-[#04102b]">{sajuData.day.fortune}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="text-xs font-bold text-[#04102b]">{sajuData.month.fortune}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="text-xs font-bold text-[#04102b]">{sajuData.year.fortune}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 지지 상호작용 */}
              {analysis.branchInteractions.length > 0 && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-[#04102b] mb-3 text-center">지지 상호작용</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {analysis.branchInteractions.map((inter, idx) => {
                      const isPositive = inter.type.includes('합');
                      const isNegative = inter.type.includes('충') || inter.type.includes('형');
                      const colorClass = isPositive
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                        : isNegative
                          ? 'bg-red-50 border-red-400 text-red-800'
                          : 'bg-amber-50 border-amber-400 text-amber-800';
                      return (
                        <span key={idx} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
                          {inter.type} {inter.branchesKr.join('')}
                          {inter.resultElement && ` → ${FIVE_ELEMENTS_KR[inter.resultElement as keyof typeof FIVE_ELEMENTS_KR]}`}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 오행 균형 */}
              <div className="mt-5 pt-5 border-t border-slate-100">
                <h3 className="text-sm font-bold text-[#04102b] mb-4 text-center">오행 균형</h3>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(elementScores).map(([element, score]) => (
                    <div key={element} className="text-center">
                      <div className={`text-lg font-bold mb-1 ${elementColors[element] || ''}`}>{element}</div>
                      <div className="text-xs text-slate-500 mb-2">
                        {FIVE_ELEMENTS_KR[element as keyof typeof FIVE_ELEMENTS_KR]}
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                        <div
                          className={`h-1.5 rounded-full transition-all ${element === sajuData.day.element
                            ? 'bg-gradient-to-r from-[#1a56db] to-[#7c3aed]'
                            : 'bg-slate-400'
                          }`}
                          style={{ width: `${Math.max(score, 5)}%` }}
                        />
                      </div>
                      <div className="text-xs font-bold text-[#04102b]">{score}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 분석 카드 그리드 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* 신강/신약 + 용신 */}
              <div className="bg-white rounded-2xl border border-[#dbe8ff] p-6">
                <h3 className="text-base font-extrabold text-[#04102b] mb-4">일간 세력 분석</h3>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-block px-4 py-1.5 rounded-xl text-sm font-bold ${
                    analysis.dayMasterStrength.result === '신강'
                      ? 'bg-red-100 text-red-700 border-2 border-red-400'
                      : analysis.dayMasterStrength.result === '신약'
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                        : 'bg-green-100 text-green-700 border-2 border-green-400'
                  }`}>
                    {analysis.dayMasterStrength.result}
                  </span>
                  <span className="text-slate-500 text-xs">점수: {analysis.dayMasterStrength.score}</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-500 mb-5">
                  {analysis.dayMasterStrength.reasons.map((r, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-amber-500 mr-1.5">-</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-slate-100 pt-4">
                  <h4 className="font-bold text-[#04102b] mb-2.5 text-sm">용신 / 희신 / 기신</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${elementBgColors[analysis.yongShin.yongShin] || 'bg-gray-100'}`}>
                      용신: {analysis.yongShin.yongShinKr}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${elementBgColors[analysis.yongShin.heeShin] || 'bg-gray-100'}`}>
                      희신: {analysis.yongShin.heeShinKr}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 border border-slate-300 text-slate-700">
                      기신: {analysis.yongShin.giShinKr}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{analysis.yongShin.explanation}</p>
                </div>
              </div>

              {/* 신살 + 공망 */}
              <div className="bg-white rounded-2xl border border-[#dbe8ff] p-6">
                <h3 className="text-base font-extrabold text-[#04102b] mb-4">신살 (神煞)</h3>
                {analysis.shinsal.length > 0 ? (
                  <div className="space-y-2 mb-5">
                    {analysis.shinsal.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-[#f0f5ff]">
                        <span className="inline-block px-2 py-0.5 bg-[#04102b] text-white rounded-lg text-xs font-bold whitespace-nowrap">
                          {s.name}
                        </span>
                        <div>
                          <div className="text-xs font-semibold text-[#04102b]">
                            {s.pillar} {s.branchKr}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{s.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs mb-5">특별한 신살이 발견되지 않았습니다.</p>
                )}

                <div className="border-t border-slate-100 pt-4">
                  <h4 className="font-bold text-[#04102b] mb-2 text-sm">공망 (空亡)</h4>
                  <div className="flex gap-2 mb-2">
                    {analysis.gongmang.branchesKr.map((bk, i) => (
                      <span key={i} className="px-2.5 py-1 bg-[#04102b] text-white rounded-lg text-xs font-bold">
                        {bk}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{analysis.gongmang.description}</p>
                </div>

                {/* 세운 정보 */}
                <div className="border-t border-slate-100 pt-4 mt-4">
                  <h4 className="font-bold text-[#04102b] mb-2 text-sm">
                    {analysis.seun.year}년 세운
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${elementBgColors[analysis.seun.element] || 'bg-gray-100'}`}>
                      {analysis.seun.stemKr}{analysis.seun.branchKr}
                    </span>
                    <span className="text-xs text-slate-500">{analysis.seun.elementKr} 기운</span>
                  </div>
                  {analysis.seun.interactions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {analysis.seun.interactions.map((si, i) => (
                        <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          si.type.includes('합') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {si.type} {si.branchesKr.join('')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI 상세 해석 섹션 */}
            {(() => {
              const birthKey = { birth_year: yearNum, birth_month: monthNum, birth_day: dayNum, gender, ...(hourNum !== null ? { birth_hour: hourNum } : {}) };
              const currentUrl = `/saju/result?year=${yearNum}&month=${monthNum}&day=${dayNum}${hourNum !== null ? `&hour=${hourNum}` : ''}&gender=${gender}&calendarType=${calendarType}${originalYear ? `&originalYear=${originalYear}&originalMonth=${originalMonth}&originalDay=${originalDay}` : ''}${isLeap ? '&isLeapMonth=true' : ''}`;
              return (
                <SajuAISection
                  hasPaid={hasPaid}
                  savedInterpretation={savedInterpretation}
                  sajuData={sajuData}
                  daeun={currentDaeun}
                  daeunList={daeunList}
                  gender={gender}
                  birthKey={birthKey}
                  currentUrl={currentUrl}
                />
              );
            })()}

            {/* 대운 */}
            <div className="bg-white rounded-2xl border border-[#dbe8ff] p-6">
              <h2 className="text-lg font-extrabold text-[#04102b] mb-5 text-center">
                대운 (大運) — 10년 주기 운세
              </h2>

              {currentDaeun && (
                <div className="bg-gradient-to-r from-[#04102b] to-[#0a2060] rounded-2xl p-5 mb-5 text-white">
                  <h3 className="text-sm font-bold mb-3 text-center text-blue-300">현재 대운</h3>
                  <div className="text-center mb-3">
                    <div className="text-3xl font-bold mb-1">
                      {currentDaeun.stem}{currentDaeun.branch}
                    </div>
                    <div className="text-base text-blue-200">
                      {currentDaeun.stemKr}{currentDaeun.branchKr}
                    </div>
                    <div className="text-xs text-blue-300/70 mt-1">
                      {currentDaeun.age}세 ~ {currentDaeun.age + 9}세 ({currentDaeun.startYear} ~ {currentDaeun.endYear}년)
                    </div>
                  </div>
                  <p className="text-center leading-relaxed text-xs text-blue-200/80">
                    {getDaeunDescription(currentDaeun, sajuData.day.stem)}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {daeunList.map((daeun, index) => {
                  const isCurrent = currentDaeun &&
                    daeun.startYear === currentDaeun.startYear &&
                    daeun.endYear === currentDaeun.endYear;

                  return (
                    <div
                      key={index}
                      className={`rounded-xl p-3 border-2 transition ${isCurrent
                        ? 'bg-amber-50 border-amber-400'
                        : 'bg-white border-[#dbe8ff]'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-xl font-bold text-[#04102b] mb-0.5">
                          {daeun.stem}{daeun.branch}
                        </div>
                        <div className="text-xs text-slate-500 mb-1.5">
                          {daeun.stemKr}{daeun.branchKr}
                        </div>
                        <div className="text-xs text-slate-400">
                          {daeun.age}세 ~ {daeun.age + 9}세
                        </div>
                        <div className="text-xs text-slate-400">
                          {daeun.startYear} ~ {daeun.endYear}
                        </div>
                        {isCurrent && (
                          <div className="mt-1.5">
                            <span className="inline-block bg-[#04102b] text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
                              현재
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
