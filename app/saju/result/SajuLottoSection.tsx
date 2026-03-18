'use client';

import { useMemo } from 'react';
import Link from 'next/link';

// 오행 기반 로또 번호 매핑 (하도낙서 원리)
// 水:1,6 / 火:2,7 / 木:3,8 / 金:4,9 / 土:5,10
const ELEMENT_NUMBERS: Record<string, number[]> = {
  '水': [1, 6, 11, 16, 21, 26, 31, 36, 41],
  '火': [2, 7, 12, 17, 22, 27, 32, 37, 42],
  '木': [3, 8, 13, 18, 23, 28, 33, 38, 43],
  '金': [4, 9, 14, 19, 24, 29, 34, 39, 44],
  '土': [5, 10, 15, 20, 25, 30, 35, 40, 45],
};

const ELEMENT_KR: Record<string, string> = {
  '水': '수', '火': '화', '木': '목', '金': '금', '土': '토',
};

const ELEMENT_COLOR: Record<string, { bg: string; text: string; border: string; ball: string }> = {
  '水': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300', ball: '#3b82f6' },
  '火': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300', ball: '#ef4444' },
  '木': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300', ball: '#22c55e' },
  '金': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300', ball: '#f59e0b' },
  '土': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300', ball: '#eab308' },
};

// 오행별 행운 설명
const ELEMENT_LUCK_DESC: Record<string, string> = {
  '水': '흐르는 물처럼 지혜와 직관이 넘치는 수(水) 기운이 당신의 행운을 이끕니다. 1·6 계열의 숫자들이 당신과 공명합니다.',
  '火': '활활 타오르는 불처럼 열정과 표현력이 폭발하는 화(火) 기운이 행운의 열쇠입니다. 2·7 계열의 숫자들에서 기운을 찾으세요.',
  '木': '하늘을 향해 뻗는 나무처럼 성장과 창의성을 상징하는 목(木) 기운이 길을 열어줍니다. 3·8 계열의 숫자들이 공명합니다.',
  '金': '단단하고 순수한 금속처럼 결단력과 정의를 상징하는 금(金) 기운이 행운을 부릅니다. 4·9 계열의 숫자들이 당신과 함께합니다.',
  '土': '만물을 품는 대지처럼 안정과 신뢰를 상징하는 토(土) 기운이 당신을 지켜줍니다. 5·10 계열의 숫자들에 행운이 깃들어 있습니다.',
};

// 사주 기반 시드로 결정론적 숫자 선택 (매번 같은 결과)
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateSajuLottoNumbers(
  yongShin: string,
  heeShin: string,
  dayBranch: string,
  yearNum: number,
  monthNum: number,
  dayNum: number
): { numbers: number[]; yongShinNums: number[]; heeShinNums: number[] } {
  const seed = yearNum * 10000 + monthNum * 100 + dayNum;
  const rand = seededRandom(seed);

  const yongPool = ELEMENT_NUMBERS[yongShin] ?? ELEMENT_NUMBERS['水'];
  const heePool = ELEMENT_NUMBERS[heeShin] ?? ELEMENT_NUMBERS['木'];

  // 용신 기반 3개 선택
  const shuffledYong = [...yongPool].sort(() => rand() - 0.5);
  const yongPick = shuffledYong.slice(0, 3);

  // 희신 기반 2개 선택
  const shuffledHee = [...heePool].sort(() => rand() - 0.5);
  const heePick = shuffledHee.filter(n => !yongPick.includes(n)).slice(0, 2);

  // 지지 오행에서 보조 번호 1개
  const BRANCH_ELEMENT: Record<string, string> = {
    '子': '水', '亥': '水', '寅': '木', '卯': '木', '巳': '火', '午': '火',
    '申': '金', '酉': '金', '丑': '土', '辰': '土', '未': '土', '戌': '土',
  };
  const branchElem = BRANCH_ELEMENT[dayBranch] ?? yongShin;
  const branchPool = ELEMENT_NUMBERS[branchElem] ?? [];
  const bonusPool = branchPool.filter(n => !yongPick.includes(n) && !heePick.includes(n));
  const shuffledBonus = [...bonusPool].sort(() => rand() - 0.5);
  const bonusPick = shuffledBonus.length > 0 ? [shuffledBonus[0]] : [];

  const combined = [...new Set([...yongPick, ...heePick, ...bonusPick])];
  // 6개 채우기 (부족하면 랜덤으로 추가)
  while (combined.length < 6) {
    const n = Math.floor(rand() * 45) + 1;
    if (!combined.includes(n)) combined.push(n);
  }

  const numbers = combined.slice(0, 6).sort((a, b) => a - b);
  return { numbers, yongShinNums: yongPick.sort((a, b) => a - b), heeShinNums: heePick.sort((a, b) => a - b) };
}

// 로또 볼 컴포넌트
function LottoBall({ num, color = '#1d4ed8', size = 44 }: { num: number; color?: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle at 35% 35%, ${color}dd, ${color})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 800,
      fontSize: size < 40 ? 11 : 14,
      boxShadow: `0 3px 10px ${color}60`,
      flexShrink: 0,
    }}>
      {num}
    </div>
  );
}

// 오행별 볼 색상
function getElementColor(num: number): string {
  const mod = num % 10;
  if (mod === 1 || mod === 6) return '#3b82f6'; // 水
  if (mod === 2 || mod === 7) return '#ef4444'; // 火
  if (mod === 3 || mod === 8) return '#22c55e'; // 木
  if (mod === 4 || mod === 9) return '#f59e0b'; // 金
  return '#eab308'; // 土 (0, 5)
}

interface Props {
  yongShin: string;       // 용신 오행 (예: '水')
  yongShinKr: string;     // 용신 한글 (예: '수')
  heeShin: string;        // 희신 오행
  heeShinKr: string;      // 희신 한글
  dayBranch: string;      // 일지 (예: '子')
  dayStemKr: string;      // 일간 한글 (예: '갑')
  currentDaeun: {
    stemKr: string;
    branchKr: string;
    startYear: number;
    endYear: number;
    age: number;
  } | null;
  yearNum: number;
  monthNum: number;
  dayNum: number;
  hasLottoSubscription: boolean; // 로또 구독 여부
}

export default function SajuLottoSection({
  yongShin, yongShinKr, heeShin, heeShinKr,
  dayBranch, dayStemKr,
  currentDaeun,
  yearNum, monthNum, dayNum,
  hasLottoSubscription,
}: Props) {
  const { numbers, yongShinNums, heeShinNums } = useMemo(
    () => generateSajuLottoNumbers(yongShin, heeShin, dayBranch, yearNum, monthNum, dayNum),
    [yongShin, heeShin, dayBranch, yearNum, monthNum, dayNum]
  );

  const elemColor = ELEMENT_COLOR[yongShin] ?? ELEMENT_COLOR['水'];
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white rounded-2xl border border-[#dbe8ff] overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-[#04102b] via-[#0d1f5c] to-[#04102b] px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow">
            <span style={{ fontSize: 18 }}>🎱</span>
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-extrabold text-white">사주 기반 로또 번호 추천</h2>
            <p className="text-blue-300/60 text-[11px] mt-0.5">
              당신의 용신({yongShinKr}·{yongShin}) 오행으로 추출한 행운 번호
            </p>
          </div>
          <span className="text-[11px] bg-amber-400/20 border border-amber-400/30 text-amber-300 font-bold px-2.5 py-1 rounded-full">
            사주 연동
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* 용신 설명 배너 */}
        <div className={`rounded-xl border p-4 ${elemColor.bg} ${elemColor.border}`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${elemColor.text}`}
              style={{ background: 'rgba(255,255,255,0.6)' }}>
              {yongShin}
            </div>
            <div>
              <div className={`text-xs font-bold mb-1 ${elemColor.text}`}>
                용신 오행: {yongShinKr}({yongShin}) · 희신: {heeShinKr}({heeShin})
              </div>
              <p className={`text-xs leading-relaxed ${elemColor.text}`} style={{ opacity: 0.85 }}>
                {ELEMENT_LUCK_DESC[yongShin]}
              </p>
            </div>
          </div>
        </div>

        {/* 추천 번호 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-extrabold text-[#04102b]">이번 주 추천 번호</h3>
            <span className="text-[11px] text-slate-400">{currentYear}년 기준</span>
          </div>

          {/* 메인 볼 */}
          <div className="flex items-center gap-2.5 flex-wrap mb-3">
            {numbers.map((n) => (
              <LottoBall key={n} num={n} color={getElementColor(n)} size={48} />
            ))}
          </div>

          {/* 용신/희신 구분 안내 */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className={`rounded-lg p-3 border ${elemColor.bg} ${elemColor.border}`}>
              <div className={`text-[10px] font-bold mb-1.5 ${elemColor.text}`}>
                용신({yongShinKr}) 핵심 번호
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {yongShinNums.map(n => (
                  <LottoBall key={n} num={n} color={elemColor.ball} size={34} />
                ))}
              </div>
            </div>
            <div className="rounded-lg p-3 border bg-violet-50 border-violet-200">
              <div className="text-[10px] font-bold mb-1.5 text-violet-700">
                희신({heeShinKr}) 보조 번호
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {heeShinNums.map(n => (
                  <LottoBall key={n} num={n} color="#7c3aed" size={34} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 기본 사주 해석 내러티브 */}
        <div className="bg-[#f8faff] rounded-xl border border-[#dbe8ff] p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">✨</span>
            <h4 className="text-xs font-extrabold text-[#04102b]">왜 이 번호인가요?</h4>
          </div>
          <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <p>
              <strong className={elemColor.text}>{dayStemKr}(일간)</strong> 일간인 당신의 사주에서
              용신은 <strong className={elemColor.text}>{yongShin}({yongShinKr})</strong> 오행입니다.
              동양 명리학의 하도낙서(河圖洛書) 원리에 따르면,{' '}
              <strong>{yongShin === '水' ? '1과 6' : yongShin === '火' ? '2와 7' : yongShin === '木' ? '3과 8' : yongShin === '金' ? '4와 9' : '5와 10'}</strong>이
              {yongShinKr}(水)의 수리이며, 이 기운을 담은 번호들이 당신에게 에너지적으로 공명합니다.
            </p>
            <p>
              희신 <strong className="text-violet-700">{heeShin}({heeShinKr})</strong> 오행의 번호를
              보조로 더하여 균형을 잡았고, 일지 <strong>({dayBranch})</strong>의 기운까지 반영한
              6개 번호를 완성했습니다.
            </p>
          </div>
        </div>

        {/* 로또 구독 미가입 → 대운 연동 프리미엄 홍보 */}
        {!hasLottoSubscription ? (
          <div className="bg-gradient-to-br from-[#04102b] via-[#0a1f5c] to-[#04102b] rounded-xl p-5 relative overflow-hidden border border-[#1a3a7a]">
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🔮</span>
                <span className="text-xs font-extrabold text-amber-300">로또 구독 시 더 정확한 추천</span>
              </div>
              {currentDaeun && (
                <p className="text-xs text-blue-200/80 leading-relaxed mb-4">
                  현재 <strong className="text-amber-300">{currentDaeun.stemKr}{currentDaeun.branchKr} 대운</strong>
                  ({currentDaeun.startYear}~{currentDaeun.endYear}년)을 지나고 있습니다.
                  로또 플랜을 구독하면 <strong className="text-white">대운의 오행 흐름</strong>과
                  사주 원국을 교차 분석하여 매주 최적화된 번호를 받을 수 있어요.
                </p>
              )}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { icon: '📊', text: '대운 × 사주 교차 분석' },
                  { icon: '🔄', text: '매주 업데이트 번호' },
                  { icon: '🎯', text: '빅데이터 Monte Carlo 시뮬레이션' },
                  { icon: '📈', text: '핫넘버 / 콜드넘버 통계' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-2">
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-[11px] text-blue-200/70 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/services/lotto"
                className="block w-full text-center bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#04102b] text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg"
              >
                로또 번호 추천 서비스 구독하기 →
              </Link>
            </div>
          </div>
        ) : (
          /* 로또 구독 가입자 → 대운 교차 분석 심화 */
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs font-extrabold text-emerald-800">구독자 전용 · 대운 교차 분석</span>
            </div>

            {currentDaeun ? (
              <div className="space-y-3">
                <div className="bg-white/70 rounded-lg p-3 border border-emerald-200">
                  <div className="text-[11px] text-emerald-600 font-semibold mb-1.5">현재 대운과 사주의 만남</div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-emerald-700">{currentDaeun.stemKr}{currentDaeun.branchKr} 대운</strong>
                    ({currentDaeun.startYear}~{currentDaeun.endYear}년, {currentDaeun.age}~{currentDaeun.age + 9}세)이
                    용신 <strong className="text-[#04102b]">{yongShin}({yongShinKr})</strong> 오행과
                    {currentDaeun.stemKr.includes(yongShinKr) || currentDaeun.branchKr.includes(yongShinKr)
                      ? <strong className="text-emerald-700"> 강하게 공명합니다. 지금이 행운의 절정기!</strong>
                      : ' 상호작용하고 있습니다. 용신 번호를 중심으로 추천합니다.'
                    }
                  </p>
                </div>
                <div className="bg-white/70 rounded-lg p-3 border border-emerald-200">
                  <div className="text-[11px] text-emerald-600 font-semibold mb-1.5">대운 연동 보너스 인사이트</div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentYear}년 세운과 {currentDaeun.stemKr}{currentDaeun.branchKr} 대운이 겹치는
                    이 시기, 사주 원국의 용신 에너지가 가장 활성화됩니다.
                    추천 번호 중 <strong className="text-[#04102b]">용신 번호 3개</strong>는 반드시 포함하고,
                    나머지는 매주 로또 서비스의 최신 분석을 참고하세요.
                  </p>
                </div>
                <Link
                  href="/services/lotto/recommend"
                  className="block w-full text-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow"
                >
                  로또 번호 추천 서비스 바로가기 →
                </Link>
              </div>
            ) : (
              <p className="text-xs text-slate-600">
                대운 정보를 불러오는 중입니다. 정확한 생년월일을 입력하면 더 정밀한 분석이 가능합니다.
              </p>
            )}
          </div>
        )}

        {/* 하단 면책 */}
        <p className="text-center text-[11px] text-slate-400 leading-relaxed">
          본 번호는 사주 명리학의 용신/오행 원리를 기반으로 한 참고용 추천입니다.<br />
          로또 당첨을 보장하지 않으며, 투자 손실에 대한 책임은 본인에게 있습니다.
        </p>
      </div>
    </div>
  );
}
