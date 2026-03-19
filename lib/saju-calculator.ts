// 천간 (天干) - 10개
export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const HEAVENLY_STEMS_KR = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;

// 지지 (地支) - 12개
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
export const EARTHLY_BRANCHES_KR = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;

// 오행 (五行)
export const FIVE_ELEMENTS = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
  '寅': '木', '卯': '木',
  '巳': '火', '午': '火',
  '辰': '土', '戌': '土', '丑': '土', '未': '土',
  '申': '金', '酉': '金',
  '子': '水', '亥': '水',
} as const;

export const FIVE_ELEMENTS_KR = {
  '木': '목', '火': '화', '土': '토', '金': '금', '水': '수'
} as const;

// 십성 (十星)
export const TEN_GODS = {
  same: { yang: '비견', yin: '겁재' },      // 같은 오행
  produce: { yang: '식신', yin: '상관' },   // 내가 생하는 오행
  overcome: { yang: '편재', yin: '정재' },  // 내가 극하는 오행
  overcome_me: { yang: '편관', yin: '정관' }, // 나를 극하는 오행
  produce_me: { yang: '편인', yin: '정인' }  // 나를 생하는 오행
} as const;

// 십이운성 (十二運星)
export const TWELVE_FORTUNES = [
  '장생', '목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양'
] as const;

// 간지 계산을 위한 기준일 (1900년 1월 1일 = 경자년 정축월 병인일)
const BASE_YEAR = 1900;
const BASE_YEAR_STEM = 6;  // 庚
const BASE_YEAR_BRANCH = 0; // 子

/**
 * 년도의 간지를 계산
 * month, day를 전달하면 입춘(立春) 기준으로 전년도 년주를 적용합니다.
 */
export function getYearGanzi(year: number, month?: number, day?: number): { stem: string; branch: string; stemKr: string; branchKr: string } {
  let adjustedYear = year;

  // 입춘(立春) 이전 출생이면 전년도 년주 사용
  if (month !== undefined && day !== undefined) {
    try {
      const { getSolarTermDate } = require('./solar-terms');
      const ipchun = getSolarTermDate(year, 0); // termIndex 0 = 입춘
      const birthUTC = Date.UTC(year, month - 1, day);
      const ipchunUTC = Date.UTC(year, ipchun.month - 1, ipchun.day);
      if (birthUTC < ipchunUTC) {
        adjustedYear = year - 1;
      }
    } catch {
      // 절기 계산 실패 시 양력 2월 4일을 입춘 근사값으로 사용
      if (month === 1 || (month === 2 && day < 4)) {
        adjustedYear = year - 1;
      }
    }
  }

  const yearDiff = adjustedYear - BASE_YEAR;
  const stemIndex = ((BASE_YEAR_STEM + yearDiff) % 10 + 10) % 10;
  const branchIndex = ((BASE_YEAR_BRANCH + yearDiff) % 12 + 12) % 12;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    stemKr: HEAVENLY_STEMS_KR[stemIndex],
    branchKr: EARTHLY_BRANCHES_KR[branchIndex]
  };
}

/**
 * 월의 간지를 계산 (절기 기준)
 */
export function getMonthGanzi(year: number, month: number, day: number): { stem: string; branch: string; stemKr: string; branchKr: string } {
  // 절기 기준으로 월 지지 계산
  const { getSolarTermMonthBranch } = require('./solar-terms');
  const branchIndex = getSolarTermMonthBranch(year, month, day);

  // 월 천간 계산 — 입춘 보정된 년간 사용
  const yearStem = getYearGanzi(year, month, day).stem;
  const yearStemIndex = HEAVENLY_STEMS.indexOf(yearStem as any);

  // 오호둔월법 (五虎遁月法): 寅月(branchIndex=2)을 기준으로 년간별 시작 천간 결정
  // 甲/己년: 寅月=丙(2), 乙/庚년: 寅月=戊(4), 丙/辛년: 寅月=庚(6), 丁/壬년: 寅月=壬(8), 戊/癸년: 寅月=甲(0)
  const startStem = ((yearStemIndex % 5) * 2 + 2) % 10;
  const stemIndex = (startStem + (branchIndex - 2 + 12) % 12) % 10;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    stemKr: HEAVENLY_STEMS_KR[stemIndex],
    branchKr: EARTHLY_BRANCHES_KR[branchIndex]
  };
}

/**
 * 일의 간지를 계산 (만세력 기준)
 */
export function getDayGanzi(year: number, month: number, day: number): { stem: string; branch: string; stemKr: string; branchKr: string } {
  // UTC 기준으로 일수 계산 (로컬 타임존/DST 영향 제거)
  const baseUTC = Date.UTC(1900, 0, 1);
  const targetUTC = Date.UTC(year, month - 1, day);
  const daysDiff = Math.floor((targetUTC - baseUTC) / (1000 * 60 * 60 * 24));

  // 1900-01-01 = 甲戌일 (60갑자 기준, JDN+49 공식 검증)
  const baseDayStem = 0;   // 甲
  const baseDayBranch = 10; // 戌

  const stemIndex = (baseDayStem + daysDiff) % 10;
  const branchIndex = (baseDayBranch + daysDiff) % 12;

  return {
    stem: HEAVENLY_STEMS[stemIndex < 0 ? stemIndex + 10 : stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex < 0 ? branchIndex + 12 : branchIndex],
    stemKr: HEAVENLY_STEMS_KR[stemIndex < 0 ? stemIndex + 10 : stemIndex],
    branchKr: EARTHLY_BRANCHES_KR[branchIndex < 0 ? branchIndex + 12 : branchIndex]
  };
}

/**
 * 시의 간지를 계산
 */
export function getHourGanzi(dayGanzi: { stem: string }, hour: number): { stem: string; branch: string; stemKr: string; branchKr: string } {
  // 시 지지: 자시(23-01)=0, 축시(01-03)=1, ...
  let branchIndex: number;

  if (hour >= 23 || hour < 1) branchIndex = 0;  // 子
  else if (hour >= 1 && hour < 3) branchIndex = 1;   // 丑
  else if (hour >= 3 && hour < 5) branchIndex = 2;   // 寅
  else if (hour >= 5 && hour < 7) branchIndex = 3;   // 卯
  else if (hour >= 7 && hour < 9) branchIndex = 4;   // 辰
  else if (hour >= 9 && hour < 11) branchIndex = 5;  // 巳
  else if (hour >= 11 && hour < 13) branchIndex = 6; // 午
  else if (hour >= 13 && hour < 15) branchIndex = 7; // 未
  else if (hour >= 15 && hour < 17) branchIndex = 8; // 申
  else if (hour >= 17 && hour < 19) branchIndex = 9; // 酉
  else if (hour >= 19 && hour < 21) branchIndex = 10; // 戌
  else branchIndex = 11; // 亥

  // 시 천간 계산 (일간에 따라 달라짐)
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayGanzi.stem as any);
  const stemIndex = (dayStemIndex * 2 + branchIndex) % 10;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    stemKr: HEAVENLY_STEMS_KR[stemIndex],
    branchKr: EARTHLY_BRANCHES_KR[branchIndex]
  };
}

/**
 * 십성 계산
 */
export function getTenGod(dayStem: string, targetStem: string, isYang: boolean): string {
  const dayElement = FIVE_ELEMENTS[dayStem as keyof typeof FIVE_ELEMENTS];
  const targetElement = FIVE_ELEMENTS[targetStem as keyof typeof FIVE_ELEMENTS];

  // 같은 오행
  if (dayElement === targetElement) {
    return isYang ? '비견' : '겁재';
  }

  // 오행 상생/상극 관계 확인
  const produceMap: { [key: string]: string } = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  };
  const overcomeMap: { [key: string]: string } = {
    '木': '土', '火': '金', '土': '水', '金': '木', '水': '火'
  };

  // 내가 생하는 오행
  if (produceMap[dayElement] === targetElement) {
    return isYang ? '식신' : '상관';
  }

  // 내가 극하는 오행
  if (overcomeMap[dayElement] === targetElement) {
    return isYang ? '편재' : '정재';
  }

  // 나를 극하는 오행
  if (overcomeMap[targetElement] === dayElement) {
    return isYang ? '편관' : '정관';
  }

  // 나를 생하는 오행
  if (produceMap[targetElement] === dayElement) {
    return isYang ? '편인' : '정인';
  }

  return '비견';
}

/**
 * 십이운성 계산
 */
export function getTwelveFortune(dayStem: string, branch: string): string {
  // 간단한 십이운성 계산 (실제로는 더 복잡함)
  const fortuneMap: { [key: string]: { [key: string]: number } } = {
    '甲': { '亥': 11, '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5, '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10 },
    '乙': { '午': 11, '未': 0, '申': 1, '酉': 2, '戌': 3, '亥': 4, '子': 5, '丑': 6, '寅': 7, '卯': 8, '辰': 9, '巳': 10 },
    '丙': { '寅': 11, '卯': 0, '辰': 1, '巳': 2, '午': 3, '未': 4, '申': 5, '酉': 6, '戌': 7, '亥': 8, '子': 9, '丑': 10 },
    '丁': { '酉': 11, '戌': 0, '亥': 1, '子': 2, '丑': 3, '寅': 4, '卯': 5, '辰': 6, '巳': 7, '午': 8, '未': 9, '申': 10 },
    '戊': { '寅': 11, '卯': 0, '辰': 1, '巳': 2, '午': 3, '未': 4, '申': 5, '酉': 6, '戌': 7, '亥': 8, '子': 9, '丑': 10 },
    '己': { '酉': 11, '戌': 0, '亥': 1, '子': 2, '丑': 3, '寅': 4, '卯': 5, '辰': 6, '巳': 7, '午': 8, '未': 9, '申': 10 },
    '庚': { '巳': 11, '午': 0, '未': 1, '申': 2, '酉': 3, '戌': 4, '亥': 5, '子': 6, '丑': 7, '寅': 8, '卯': 9, '辰': 10 },
    '辛': { '子': 11, '丑': 0, '寅': 1, '卯': 2, '辰': 3, '巳': 4, '午': 5, '未': 6, '申': 7, '酉': 8, '戌': 9, '亥': 10 },
    '壬': { '申': 11, '酉': 0, '戌': 1, '亥': 2, '子': 3, '丑': 4, '寅': 5, '卯': 6, '辰': 7, '巳': 8, '午': 9, '未': 10 },
    '癸': { '卯': 11, '辰': 0, '巳': 1, '午': 2, '未': 3, '申': 4, '酉': 5, '戌': 6, '亥': 7, '子': 8, '丑': 9, '寅': 10 }
  };

  const index = fortuneMap[dayStem as keyof typeof fortuneMap]?.[branch as keyof typeof fortuneMap['甲']] ?? 0;
  return TWELVE_FORTUNES[index];
}

/**
 * 사주팔자 전체 계산
 */
export interface SajuData {
  year: { stem: string; branch: string; stemKr: string; branchKr: string; element: string; tenGod: string; fortune: string };
  month: { stem: string; branch: string; stemKr: string; branchKr: string; element: string; tenGod: string; fortune: string };
  day: { stem: string; branch: string; stemKr: string; branchKr: string; element: string; tenGod: string; fortune: string };
  hour?: { stem: string; branch: string; stemKr: string; branchKr: string; element: string; tenGod: string; fortune: string };
  dayStem: string;
  birthDate: { year: number; month: number; day: number; hour?: number };
  gender: 'male' | 'female';
}

export function calculateSaju(
  year: number,
  month: number,
  day: number,
  hour: number | null,
  gender: 'male' | 'female'
): SajuData {
  const yearGanzi = getYearGanzi(year, month, day);
  const monthGanzi = getMonthGanzi(year, month, day);
  const dayGanzi = getDayGanzi(year, month, day);
  const hourGanzi = hour !== null ? getHourGanzi(dayGanzi, hour) : null;

  const dayStem = dayGanzi.stem;
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayStem as any);
  const isDayYang = dayStemIndex % 2 === 0;

  const result: SajuData = {
    year: {
      ...yearGanzi,
      element: FIVE_ELEMENTS[yearGanzi.stem as keyof typeof FIVE_ELEMENTS],
      tenGod: getTenGod(dayStem, yearGanzi.stem, (HEAVENLY_STEMS.indexOf(yearGanzi.stem as any) % 2 === 0) === isDayYang),
      fortune: getTwelveFortune(dayStem, yearGanzi.branch)
    },
    month: {
      ...monthGanzi,
      element: FIVE_ELEMENTS[monthGanzi.stem as keyof typeof FIVE_ELEMENTS],
      tenGod: getTenGod(dayStem, monthGanzi.stem, (HEAVENLY_STEMS.indexOf(monthGanzi.stem as any) % 2 === 0) === isDayYang),
      fortune: getTwelveFortune(dayStem, monthGanzi.branch)
    },
    day: {
      ...dayGanzi,
      element: FIVE_ELEMENTS[dayGanzi.stem as keyof typeof FIVE_ELEMENTS],
      tenGod: '일간',
      fortune: getTwelveFortune(dayStem, dayGanzi.branch)
    },
    dayStem,
    birthDate: { year, month, day, hour: hour ?? undefined },
    gender
  };

  if (hourGanzi) {
    result.hour = {
      ...hourGanzi,
      element: FIVE_ELEMENTS[hourGanzi.stem as keyof typeof FIVE_ELEMENTS],
      tenGod: getTenGod(dayStem, hourGanzi.stem, (HEAVENLY_STEMS.indexOf(hourGanzi.stem as any) % 2 === 0) === isDayYang),
      fortune: getTwelveFortune(dayStem, hourGanzi.branch)
    };
  }

  return result;
}

// ============================================================
// 지장간 (藏干) - 각 지지에 숨어있는 천간
// ============================================================
export const HIDDEN_STEMS: { [key: string]: string[] } = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲'],
};

/**
 * 지지의 지장간(숨은 천간) 반환
 */
export function getHiddenStems(branch: string): string[] {
  return HIDDEN_STEMS[branch] || [];
}

/**
 * 4주 전체의 지장간 정보 반환
 */
export function getAllHiddenStems(saju: SajuData): { pillar: string; branch: string; branchKr: string; stems: { stem: string; stemKr: string; element: string; role: string }[] }[] {
  const pillars = [
    { pillar: '년주', branch: saju.year.branch, branchKr: saju.year.branchKr },
    { pillar: '월주', branch: saju.month.branch, branchKr: saju.month.branchKr },
    { pillar: '일주', branch: saju.day.branch, branchKr: saju.day.branchKr },
  ];
  if (saju.hour) {
    pillars.push({ pillar: '시주', branch: saju.hour.branch, branchKr: saju.hour.branchKr });
  }

  return pillars.map(p => {
    const hidden = getHiddenStems(p.branch);
    return {
      ...p,
      stems: hidden.map((stem, idx) => {
        const stemIndex = HEAVENLY_STEMS.indexOf(stem as any);
        const role = idx === 0 ? '정기(본기)' : idx === 1 ? '중기' : '여기';
        return {
          stem,
          stemKr: HEAVENLY_STEMS_KR[stemIndex],
          element: FIVE_ELEMENTS[stem as keyof typeof FIVE_ELEMENTS],
          role,
        };
      }),
    };
  });
}

// ============================================================
// 지지 상호작용 (合/沖/刑/破/害)
// ============================================================

export interface BranchInteraction {
  type: string;       // 육합, 삼합, 방합, 충, 형, 파, 해
  branches: string[]; // 관련 지지 (한자)
  branchesKr: string[]; // 관련 지지 (한글)
  pillars: string[];  // 관련 기둥 (년주, 월주 등)
  description: string;
  resultElement?: string; // 합의 결과 오행 (해당 시)
}

const YUKAP_PAIRS: [string, string, string][] = [
  ['子', '丑', '土'], ['寅', '亥', '木'], ['卯', '戌', '火'],
  ['辰', '酉', '金'], ['巳', '申', '水'], ['午', '未', '火'],
];

const SAMHAP_GROUPS: [string, string, string, string][] = [
  ['申', '子', '辰', '水'], ['亥', '卯', '未', '木'],
  ['寅', '午', '戌', '火'], ['巳', '酉', '丑', '金'],
];

const BANGHAP_GROUPS: [string, string, string, string][] = [
  ['寅', '卯', '辰', '木'], ['巳', '午', '未', '火'],
  ['申', '酉', '戌', '金'], ['亥', '子', '丑', '水'],
];

const CHUNG_PAIRS: [string, string][] = [
  ['子', '午'], ['丑', '未'], ['寅', '申'],
  ['卯', '酉'], ['辰', '戌'], ['巳', '亥'],
];

const HYUNG_GROUPS: { branches: string[]; name: string }[] = [
  { branches: ['寅', '巳', '申'], name: '무은지형(無恩之刑)' },
  { branches: ['丑', '戌', '未'], name: '지세지형(恃勢之刑)' },
  { branches: ['子', '卯'], name: '무례지형(無禮之刑)' },
];
const JAHYUNG_BRANCHES = ['辰', '午', '酉', '亥'];

const PA_PAIRS: [string, string][] = [
  ['子', '酉'], ['丑', '辰'], ['寅', '亥'],
  ['卯', '午'], ['巳', '申'], ['未', '戌'],
];

const HAE_PAIRS: [string, string][] = [
  ['子', '未'], ['丑', '午'], ['寅', '巳'],
  ['卯', '辰'], ['申', '亥'], ['酉', '戌'],
];

const ELEMENT_NAMES_KR: { [key: string]: string } = { '木': '목', '火': '화', '土': '토', '金': '금', '水': '수' };

/**
 * 지지 상호작용 분석
 */
export function analyzeBranchInteractions(saju: SajuData): BranchInteraction[] {
  const interactions: BranchInteraction[] = [];

  // 기둥별 지지 수집
  const pillarBranches: { branch: string; pillar: string; branchKr: string }[] = [
    { branch: saju.year.branch, pillar: '년주', branchKr: saju.year.branchKr },
    { branch: saju.month.branch, pillar: '월주', branchKr: saju.month.branchKr },
    { branch: saju.day.branch, pillar: '일주', branchKr: saju.day.branchKr },
  ];
  if (saju.hour) {
    pillarBranches.push({ branch: saju.hour.branch, pillar: '시주', branchKr: saju.hour.branchKr });
  }

  const branches = pillarBranches.map(p => p.branch);

  // 육합 (六合) 검사
  for (const [a, b, elem] of YUKAP_PAIRS) {
    const idxA = branches.indexOf(a);
    const idxB = branches.indexOf(b);
    if (idxA !== -1 && idxB !== -1) {
      interactions.push({
        type: '육합(六合)',
        branches: [a, b],
        branchesKr: [pillarBranches[idxA].branchKr, pillarBranches[idxB].branchKr],
        pillars: [pillarBranches[idxA].pillar, pillarBranches[idxB].pillar],
        description: `${pillarBranches[idxA].branchKr}${pillarBranches[idxB].branchKr} 육합 → ${ELEMENT_NAMES_KR[elem]}(${elem}) 기운 생성. 조화와 화합의 관계.`,
        resultElement: elem,
      });
    }
  }

  // 삼합 (三合) 검사
  for (const [a, b, c, elem] of SAMHAP_GROUPS) {
    const found = [a, b, c].filter(x => branches.includes(x));
    if (found.length >= 2) {
      const foundPillars = found.map(x => {
        const idx = branches.indexOf(x);
        return pillarBranches[idx];
      });
      const isComplete = found.length === 3;
      interactions.push({
        type: isComplete ? '삼합(三合)' : '반삼합(半三合)',
        branches: found,
        branchesKr: foundPillars.map(p => p.branchKr),
        pillars: foundPillars.map(p => p.pillar),
        description: `${foundPillars.map(p => p.branchKr).join('')} ${isComplete ? '삼합' : '반삼합'} → ${ELEMENT_NAMES_KR[elem]}(${elem})국. ${isComplete ? '강력한 합의 기운.' : '삼합의 기운이 부분적으로 작용.'}`,
        resultElement: elem,
      });
    }
  }

  // 방합 (方合) 검사
  for (const [a, b, c, elem] of BANGHAP_GROUPS) {
    const found = [a, b, c].filter(x => branches.includes(x));
    if (found.length === 3) {
      const foundPillars = found.map(x => {
        const idx = branches.indexOf(x);
        return pillarBranches[idx];
      });
      interactions.push({
        type: '방합(方合)',
        branches: found,
        branchesKr: foundPillars.map(p => p.branchKr),
        pillars: foundPillars.map(p => p.pillar),
        description: `${foundPillars.map(p => p.branchKr).join('')} 방합 → ${ELEMENT_NAMES_KR[elem]}(${elem}) 방국. 매우 강한 오행 기운.`,
        resultElement: elem,
      });
    }
  }

  // 충 (沖) 검사
  for (const [a, b] of CHUNG_PAIRS) {
    const idxA = branches.indexOf(a);
    const idxB = branches.indexOf(b);
    if (idxA !== -1 && idxB !== -1) {
      interactions.push({
        type: '충(沖)',
        branches: [a, b],
        branchesKr: [pillarBranches[idxA].branchKr, pillarBranches[idxB].branchKr],
        pillars: [pillarBranches[idxA].pillar, pillarBranches[idxB].pillar],
        description: `${pillarBranches[idxA].branchKr}${pillarBranches[idxB].branchKr} 충 → 변동, 갈등, 변화의 에너지. ${pillarBranches[idxA].pillar}와 ${pillarBranches[idxB].pillar} 사이의 긴장 관계.`,
      });
    }
  }

  // 형 (刑) 검사
  for (const group of HYUNG_GROUPS) {
    const found = group.branches.filter(x => branches.includes(x));
    if (found.length >= 2) {
      const foundPillars = found.map(x => {
        const idx = branches.indexOf(x);
        return pillarBranches[idx];
      });
      interactions.push({
        type: '형(刑)',
        branches: found,
        branchesKr: foundPillars.map(p => p.branchKr),
        pillars: foundPillars.map(p => p.pillar),
        description: `${foundPillars.map(p => p.branchKr).join('')} ${group.name} → 시련과 갈등의 기운. 주의가 필요한 관계.`,
      });
    }
  }

  // 자형 (自刑) 검사
  for (const jb of JAHYUNG_BRANCHES) {
    const count = branches.filter(x => x === jb).length;
    if (count >= 2) {
      const brKr = EARTHLY_BRANCHES_KR[EARTHLY_BRANCHES.indexOf(jb as any)];
      interactions.push({
        type: '자형(自刑)',
        branches: [jb, jb],
        branchesKr: [brKr, brKr],
        pillars: pillarBranches.filter(p => p.branch === jb).map(p => p.pillar),
        description: `${brKr}${brKr} 자형 → 자기 자신과의 갈등, 내면의 갈등 기운.`,
      });
    }
  }

  // 파 (破) 검사
  for (const [a, b] of PA_PAIRS) {
    const idxA = branches.indexOf(a);
    const idxB = branches.indexOf(b);
    if (idxA !== -1 && idxB !== -1) {
      interactions.push({
        type: '파(破)',
        branches: [a, b],
        branchesKr: [pillarBranches[idxA].branchKr, pillarBranches[idxB].branchKr],
        pillars: [pillarBranches[idxA].pillar, pillarBranches[idxB].pillar],
        description: `${pillarBranches[idxA].branchKr}${pillarBranches[idxB].branchKr} 파 → 관계의 균열, 계획의 차질 가능성.`,
      });
    }
  }

  // 해 (害) 검사
  for (const [a, b] of HAE_PAIRS) {
    const idxA = branches.indexOf(a);
    const idxB = branches.indexOf(b);
    if (idxA !== -1 && idxB !== -1) {
      interactions.push({
        type: '해(害)',
        branches: [a, b],
        branchesKr: [pillarBranches[idxA].branchKr, pillarBranches[idxB].branchKr],
        pillars: [pillarBranches[idxA].pillar, pillarBranches[idxB].pillar],
        description: `${pillarBranches[idxA].branchKr}${pillarBranches[idxB].branchKr} 해 → 은근한 방해, 원망의 기운.`,
      });
    }
  }

  return interactions;
}

// ============================================================
// 신살 (神煞) 계산
// ============================================================

export interface Shinsal {
  name: string;
  nameHanja: string;
  branch: string;
  branchKr: string;
  pillar: string;
  description: string;
}

// 일지 삼합국 기준 신살 매핑
const SAMHAP_GROUP_MAP: { [key: string]: string } = {
  '申': '申子辰', '子': '申子辰', '辰': '申子辰',
  '寅': '寅午戌', '午': '寅午戌', '戌': '寅午戌',
  '巳': '巳酉丑', '酉': '巳酉丑', '丑': '巳酉丑',
  '亥': '亥卯未', '卯': '亥卯未', '未': '亥卯未',
};

const YEOKMA_MAP: { [key: string]: string } = {
  '申子辰': '寅', '寅午戌': '申', '巳酉丑': '亥', '亥卯未': '巳',
};
const DOHWA_MAP: { [key: string]: string } = {
  '申子辰': '酉', '寅午戌': '卯', '巳酉丑': '午', '亥卯未': '子',
};
const HWAGAE_MAP: { [key: string]: string } = {
  '申子辰': '辰', '寅午戌': '戌', '巳酉丑': '丑', '亥卯未': '未',
};

// 천을귀인 (天乙貴人) - 일간 기준
const CHEONUL_MAP: { [key: string]: string[] } = {
  '甲': ['丑', '未'], '乙': ['子', '申'], '丙': ['亥', '酉'], '丁': ['亥', '酉'],
  '戊': ['丑', '未'], '己': ['子', '申'], '庚': ['丑', '未'], '辛': ['寅', '午'],
  '壬': ['卯', '巳'], '癸': ['卯', '巳'],
};

// 문창귀인 (文昌貴人) - 일간 기준
const MUNCHANG_MAP: { [key: string]: string } = {
  '甲': '巳', '乙': '午', '丙': '申', '丁': '酉',
  '戊': '申', '己': '酉', '庚': '亥', '辛': '子',
  '壬': '寅', '癸': '卯',
};

// 천덕귀인 (天德貴人) - 월지 기준
const CHEONDUK_MAP: { [key: string]: string } = {
  '寅': '丁', '卯': '申', '辰': '壬', '巳': '辛',
  '午': '亥', '未': '甲', '申': '癸', '酉': '寅',
  '戌': '丙', '亥': '乙', '子': '巳', '丑': '庚',
};

/**
 * 신살 계산
 */
export function calculateShinsal(saju: SajuData): Shinsal[] {
  const result: Shinsal[] = [];
  const dayBranch = saju.day.branch;
  const dayStem = saju.dayStem;
  const monthBranch = saju.month.branch;

  // 4주의 지지 수집
  const pillarBranches: { branch: string; branchKr: string; pillar: string }[] = [
    { branch: saju.year.branch, branchKr: saju.year.branchKr, pillar: '년주' },
    { branch: saju.month.branch, branchKr: saju.month.branchKr, pillar: '월주' },
    { branch: saju.day.branch, branchKr: saju.day.branchKr, pillar: '일주' },
  ];
  if (saju.hour) {
    pillarBranches.push({ branch: saju.hour.branch, branchKr: saju.hour.branchKr, pillar: '시주' });
  }

  const group = SAMHAP_GROUP_MAP[dayBranch];

  // 역마살
  if (group) {
    const yeokma = YEOKMA_MAP[group];
    for (const pb of pillarBranches) {
      if (pb.branch === yeokma && pb.pillar !== '일주') {
        result.push({
          name: '역마살', nameHanja: '驛馬殺', branch: yeokma,
          branchKr: pb.branchKr, pillar: pb.pillar,
          description: '이동, 변동, 해외, 출장이 많은 기운. 활동적이고 한 곳에 머물지 못하는 성향.',
        });
      }
    }

    // 도화살
    const dohwa = DOHWA_MAP[group];
    for (const pb of pillarBranches) {
      if (pb.branch === dohwa && pb.pillar !== '일주') {
        result.push({
          name: '도화살', nameHanja: '桃花殺', branch: dohwa,
          branchKr: pb.branchKr, pillar: pb.pillar,
          description: '매력, 인기, 예술적 감각. 이성에게 끌리는 기운이 강하며 대인관계가 화려함.',
        });
      }
    }

    // 화개살
    const hwagae = HWAGAE_MAP[group];
    for (const pb of pillarBranches) {
      if (pb.branch === hwagae && pb.pillar !== '일주') {
        result.push({
          name: '화개살', nameHanja: '華蓋殺', branch: hwagae,
          branchKr: pb.branchKr, pillar: pb.pillar,
          description: '학문, 종교, 예술에 심취하는 기운. 고독을 즐기며 정신적 세계에 몰두하는 성향.',
        });
      }
    }
  }

  // 천을귀인
  const cheonulBranches = CHEONUL_MAP[dayStem] || [];
  for (const pb of pillarBranches) {
    if (cheonulBranches.includes(pb.branch) && pb.pillar !== '일주') {
      result.push({
        name: '천을귀인', nameHanja: '天乙貴人', branch: pb.branch,
        branchKr: pb.branchKr, pillar: pb.pillar,
        description: '위기에서 귀인의 도움을 받는 길한 기운. 어려울 때 도움을 주는 사람이 나타남.',
      });
    }
  }

  // 문창귀인
  const munchangBranch = MUNCHANG_MAP[dayStem];
  if (munchangBranch) {
    for (const pb of pillarBranches) {
      if (pb.branch === munchangBranch && pb.pillar !== '일주') {
        result.push({
          name: '문창귀인', nameHanja: '文昌貴人', branch: pb.branch,
          branchKr: pb.branchKr, pillar: pb.pillar,
          description: '학문, 시험, 문서에 유리한 기운. 공부를 잘하며 시험운이 좋음.',
        });
      }
    }
  }

  // 천덕귀인 (월지 기준, 천간에서 확인)
  const cheondukStem = CHEONDUK_MAP[monthBranch];
  if (cheondukStem) {
    const allStems = [
      { stem: saju.year.stem, pillar: '년주' },
      { stem: saju.day.stem, pillar: '일주' },
    ];
    if (saju.hour) allStems.push({ stem: saju.hour.stem, pillar: '시주' });
    for (const ps of allStems) {
      if (ps.stem === cheondukStem) {
        result.push({
          name: '천덕귀인', nameHanja: '天德貴人', branch: monthBranch,
          branchKr: EARTHLY_BRANCHES_KR[EARTHLY_BRANCHES.indexOf(monthBranch as any)],
          pillar: ps.pillar,
          description: '하늘의 덕을 받는 기운. 재난을 피하고 복을 받는 길신 중의 길신.',
        });
      }
    }
  }

  return result;
}

// ============================================================
// 공망 (空亡) 계산
// ============================================================

/**
 * 60갑자에서 일주의 순(旬)을 찾아 공망 지지 2개를 반환
 */
export function calculateGongmang(dayStem: string, dayBranch: string): { branches: string[]; branchesKr: string[]; description: string } {
  const stemIdx = HEAVENLY_STEMS.indexOf(dayStem as any);
  const branchIdx = EARTHLY_BRANCHES.indexOf(dayBranch as any);

  // 60갑자에서 해당 순(旬)의 시작점 = 천간이 甲인 지점
  // 순의 시작 지지 인덱스 = (branchIdx - stemIdx + 12) % 12
  const startBranchIdx = (branchIdx - stemIdx + 120) % 12;

  // 공망 = 순에 포함되지 않는 2개의 지지
  // 순은 10개의 간지 → 10개의 지지 사용, 2개가 남음
  const gongmang1Idx = (startBranchIdx + 10) % 12;
  const gongmang2Idx = (startBranchIdx + 11) % 12;

  const branch1 = EARTHLY_BRANCHES[gongmang1Idx];
  const branch2 = EARTHLY_BRANCHES[gongmang2Idx];
  const branchKr1 = EARTHLY_BRANCHES_KR[gongmang1Idx];
  const branchKr2 = EARTHLY_BRANCHES_KR[gongmang2Idx];

  return {
    branches: [branch1, branch2],
    branchesKr: [branchKr1, branchKr2],
    description: `${branchKr1}(${branch1})·${branchKr2}(${branch2}) 공망 → 해당 지지의 기운이 비어있어 허무하거나 집착이 없는 영역. 오히려 초월적 능력이 될 수 있음.`,
  };
}
