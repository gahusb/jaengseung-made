
import {
  SajuData, FIVE_ELEMENTS, HEAVENLY_STEMS,
  getHiddenStems, getAllHiddenStems,
  analyzeBranchInteractions, calculateShinsal, calculateGongmang,
  getYearGanzi, FIVE_ELEMENTS_KR, EARTHLY_BRANCHES_KR, EARTHLY_BRANCHES,
  BranchInteraction, Shinsal,
} from './saju-calculator';
import { DaeunPillar } from './daeun-calculator';

// ============================================================
// 오행 밸런스 정밀 분석 (가중치 적용)
// ============================================================

export interface ElementBalance {
  木: number;
  火: number;
  土: number;
  金: number;
  水: number;
}

/**
 * 가중치 적용 오행 점수 계산
 * - 천간: 1.0
 * - 지지 본기(정기): 1.0
 * - 지장간 중기: 0.5
 * - 지장간 여기: 0.3
 */
export function calculateDetailedElementBalance(saju: SajuData): ElementBalance {
  const balance: ElementBalance = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };

  // 천간 오행 (각 1.0)
  const stems = [saju.year.stem, saju.month.stem, saju.day.stem];
  if (saju.hour) stems.push(saju.hour.stem);

  for (const stem of stems) {
    const elem = FIVE_ELEMENTS[stem as keyof typeof FIVE_ELEMENTS] as keyof ElementBalance;
    if (elem) balance[elem] += 1.0;
  }

  // 지지 지장간 (본기 1.0, 중기 0.5, 여기 0.3)
  const branches = [saju.year.branch, saju.month.branch, saju.day.branch];
  if (saju.hour) branches.push(saju.hour.branch);

  const weights = [1.0, 0.5, 0.3];
  for (const branch of branches) {
    const hidden = getHiddenStems(branch);
    for (let i = 0; i < hidden.length; i++) {
      const elem = FIVE_ELEMENTS[hidden[i] as keyof typeof FIVE_ELEMENTS] as keyof ElementBalance;
      if (elem) balance[elem] += weights[i] || 0.3;
    }
  }

  // 소수점 둘째 자리로 반올림
  for (const key of Object.keys(balance) as (keyof ElementBalance)[]) {
    balance[key] = Math.round(balance[key] * 100) / 100;
  }

  return balance;
}

/**
 * 오행 비율(%) 계산
 */
export function calculateElementScore(saju: SajuData): { [key: string]: number } {
  const balance = calculateDetailedElementBalance(saju);
  const total = Object.values(balance).reduce((a, b) => a + b, 0);

  const scores: { [key: string]: number } = {};
  for (const [element, value] of Object.entries(balance)) {
    scores[element] = total > 0 ? Math.round((value / total) * 100) : 0;
  }

  return scores;
}

// ============================================================
// 신강/신약 자동 판단
// ============================================================

export interface DayMasterStrength {
  result: '신강' | '신약' | '중화';
  score: number;
  reasons: string[];
}

const PRODUCE_MAP: { [key: string]: string } = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木',
};

function getProducingElement(elem: string): string {
  for (const [k, v] of Object.entries(PRODUCE_MAP)) {
    if (v === elem) return k;
  }
  return '';
}

/**
 * 신강/신약 판단
 */
export function analyzeDayMasterStrength(saju: SajuData): DayMasterStrength {
  const dayStem = saju.dayStem;
  const dayElement = FIVE_ELEMENTS[dayStem as keyof typeof FIVE_ELEMENTS];
  const producingElement = getProducingElement(dayElement);
  const reasons: string[] = [];
  let score = 0;

  // 1. 월령 득령 확인
  const monthBranch = saju.month.branch;
  const monthHidden = getHiddenStems(monthBranch);
  const monthMainElement = FIVE_ELEMENTS[monthHidden[0] as keyof typeof FIVE_ELEMENTS];

  if (monthMainElement === dayElement) {
    score += 3;
    reasons.push(`월령 득령: 월지 ${saju.month.branchKr}(${monthBranch})의 본기가 일간과 같은 ${FIVE_ELEMENTS_KR[dayElement as keyof typeof FIVE_ELEMENTS_KR]}으로 강한 힘을 받음`);
  } else if (monthMainElement === producingElement) {
    score += 2;
    reasons.push(`월령 득령: 월지 ${saju.month.branchKr}(${monthBranch})의 본기가 일간을 생하는 ${FIVE_ELEMENTS_KR[producingElement as keyof typeof FIVE_ELEMENTS_KR]}으로 힘을 받음`);
  } else {
    score -= 2;
    reasons.push(`월령 실령: 월지 ${saju.month.branchKr}(${monthBranch})의 본기가 일간을 돕지 않음`);
  }

  // 2. 통근 확인
  const allBranches = [saju.year.branch, saju.month.branch, saju.day.branch];
  if (saju.hour) allBranches.push(saju.hour.branch);

  let rootCount = 0;
  for (const branch of allBranches) {
    const hidden = getHiddenStems(branch);
    for (const h of hidden) {
      const hElem = FIVE_ELEMENTS[h as keyof typeof FIVE_ELEMENTS];
      if (hElem === dayElement || hElem === producingElement) {
        rootCount++;
        break;
      }
    }
  }

  if (rootCount >= 3) {
    score += 2;
    reasons.push(`통근 강함: ${rootCount}개 지지에서 일간의 뿌리를 찾음`);
  } else if (rootCount >= 2) {
    score += 1;
    reasons.push(`통근 보통: ${rootCount}개 지지에서 일간의 뿌리를 찾음`);
  } else {
    score -= 1;
    reasons.push(`통근 약함: ${rootCount}개 지지에서만 일간의 뿌리를 찾음`);
  }

  // 3. 투출 확인
  const allStems = [saju.year.stem, saju.month.stem];
  if (saju.hour) allStems.push(saju.hour.stem);

  let helpingStemCount = 0;
  for (const stem of allStems) {
    const stemElem = FIVE_ELEMENTS[stem as keyof typeof FIVE_ELEMENTS];
    if (stemElem === dayElement || stemElem === producingElement) {
      helpingStemCount++;
    }
  }

  if (helpingStemCount >= 2) {
    score += 2;
    reasons.push(`투출 강함: 천간에 비겁/인성이 ${helpingStemCount}개 있어 일간을 도움`);
  } else if (helpingStemCount === 1) {
    score += 1;
    reasons.push(`투출 보통: 천간에 비겁/인성이 1개 있음`);
  } else {
    score -= 1;
    reasons.push(`투출 없음: 천간에 일간을 돕는 비겁/인성이 없음`);
  }

  // 4. 오행 비율 기반 조력 분석
  const balance = calculateDetailedElementBalance(saju);
  const helpingScore = balance[dayElement as keyof ElementBalance] + balance[producingElement as keyof ElementBalance];
  const drainingScore = Object.entries(balance)
    .filter(([k]) => k !== dayElement && k !== producingElement)
    .reduce((sum, [, v]) => sum + v, 0);

  if (helpingScore > drainingScore * 1.3) {
    score += 1;
    reasons.push(`오행 비율: 비겁+인성(${helpingScore.toFixed(1)}) > 식상+재관(${drainingScore.toFixed(1)}) → 일간 세력 우세`);
  } else if (drainingScore > helpingScore * 1.3) {
    score -= 1;
    reasons.push(`오행 비율: 식상+재관(${drainingScore.toFixed(1)}) > 비겁+인성(${helpingScore.toFixed(1)}) → 일간 세력 열세`);
  }

  let result: '신강' | '신약' | '중화';
  if (score >= 3) result = '신강';
  else if (score <= -2) result = '신약';
  else result = '중화';

  return { result, score, reasons };
}

// ============================================================
// 용신 (用神) 추정
// ============================================================

export interface YongShinResult {
  yongShin: string;
  yongShinKr: string;
  heeShin: string;
  heeShinKr: string;
  giShin: string;
  giShinKr: string;
  explanation: string;
}

const OVERCOME_MAP: { [key: string]: string } = {
  '木': '土', '火': '金', '土': '水', '金': '木', '水': '火',
};

function getOvercomingMe(elem: string): string {
  for (const [k, v] of Object.entries(OVERCOME_MAP)) {
    if (v === elem) return k;
  }
  return '';
}

export function estimateYongShin(saju: SajuData, strength: DayMasterStrength): YongShinResult {
  const dayElement = FIVE_ELEMENTS[saju.dayStem as keyof typeof FIVE_ELEMENTS];
  const balance = calculateDetailedElementBalance(saju);

  const producingMe = getProducingElement(dayElement);   // 인성
  const myProduct = PRODUCE_MAP[dayElement];             // 식상
  const myOvercome = OVERCOME_MAP[dayElement];           // 재성
  const overcomeMe = getOvercomingMe(dayElement);        // 관살

  const kr = (e: string) => FIVE_ELEMENTS_KR[e as keyof typeof FIVE_ELEMENTS_KR] || e;

  if (strength.result === '신강') {
    const candidates = [
      { elem: myProduct, score: balance[myProduct as keyof ElementBalance], name: '식상' },
      { elem: myOvercome, score: balance[myOvercome as keyof ElementBalance], name: '재성' },
      { elem: overcomeMe, score: balance[overcomeMe as keyof ElementBalance], name: '관살' },
    ];
    candidates.sort((a, b) => a.score - b.score);
    const yong = candidates[0];
    const hee = candidates[1];

    return {
      yongShin: yong.elem, yongShinKr: kr(yong.elem),
      heeShin: hee.elem, heeShinKr: kr(hee.elem),
      giShin: dayElement, giShinKr: kr(dayElement),
      explanation: `신강한 사주로 일간의 힘이 넘치므로 ${yong.name}(${kr(yong.elem)}) 기운을 용신으로 삼아 기운을 설기(泄氣)하거나 제어해야 합니다. ${hee.name}(${kr(hee.elem)})이 희신으로 보조합니다.`,
    };
  } else if (strength.result === '신약') {
    const candidates = [
      { elem: producingMe, score: balance[producingMe as keyof ElementBalance], name: '인성' },
      { elem: dayElement, score: balance[dayElement as keyof ElementBalance], name: '비겁' },
    ];
    candidates.sort((a, b) => a.score - b.score);
    const yong = candidates[0];
    const hee = candidates[1];

    return {
      yongShin: yong.elem, yongShinKr: kr(yong.elem),
      heeShin: hee.elem, heeShinKr: kr(hee.elem),
      giShin: overcomeMe, giShinKr: kr(overcomeMe),
      explanation: `신약한 사주로 일간의 힘이 부족하므로 ${yong.name}(${kr(yong.elem)}) 기운을 용신으로 삼아 일간을 돕고 힘을 보충해야 합니다. ${hee.name}(${kr(hee.elem)})이 희신으로 보조합니다.`,
    };
  } else {
    const entries = Object.entries(balance) as [string, number][];
    entries.sort((a, b) => a[1] - b[1]);
    const yong = entries[0];
    const hee = entries[1];
    const gi = entries[entries.length - 1];

    return {
      yongShin: yong[0], yongShinKr: kr(yong[0]),
      heeShin: hee[0], heeShinKr: kr(hee[0]),
      giShin: gi[0], giShinKr: kr(gi[0]),
      explanation: `중화에 가까운 사주로 오행이 비교적 균형을 이루고 있습니다. 가장 부족한 ${kr(yong[0])}(${yong[0]}) 기운을 보충하면 더욱 좋아집니다.`,
    };
  }
}

// ============================================================
// 세운 (歲運) 계산
// ============================================================

export interface SeunInfo {
  stem: string;
  branch: string;
  stemKr: string;
  branchKr: string;
  element: string;
  elementKr: string;
  year: number;
  interactions: BranchInteraction[];
}

export function calculateSeun(year: number, saju: SajuData): SeunInfo {
  const ganzi = getYearGanzi(year);
  const element = FIVE_ELEMENTS[ganzi.stem as keyof typeof FIVE_ELEMENTS];

  const seunBranch = ganzi.branch;
  const seunBranchKr = ganzi.branchKr;

  const interactions: BranchInteraction[] = [];
  const pillarBranches = [
    { branch: saju.year.branch, branchKr: saju.year.branchKr, pillar: '년주' },
    { branch: saju.month.branch, branchKr: saju.month.branchKr, pillar: '월주' },
    { branch: saju.day.branch, branchKr: saju.day.branchKr, pillar: '일주' },
  ];
  if (saju.hour) {
    pillarBranches.push({ branch: saju.hour.branch, branchKr: saju.hour.branchKr, pillar: '시주' });
  }

  const CHUNG: [string, string][] = [
    ['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥'],
  ];
  for (const [a, b] of CHUNG) {
    for (const pb of pillarBranches) {
      if ((seunBranch === a && pb.branch === b) || (seunBranch === b && pb.branch === a)) {
        interactions.push({
          type: '충(沖)', branches: [seunBranch, pb.branch],
          branchesKr: [seunBranchKr, pb.branchKr],
          pillars: ['세운', pb.pillar],
          description: `세운 ${seunBranchKr}와 ${pb.pillar} ${pb.branchKr}가 충 → 해당 영역에 변동과 변화가 예상됨.`,
        });
      }
    }
  }

  const YUKAP: [string, string, string][] = [
    ['子', '丑', '土'], ['寅', '亥', '木'], ['卯', '戌', '火'],
    ['辰', '酉', '金'], ['巳', '申', '水'], ['午', '未', '火'],
  ];
  for (const [a, b, elem] of YUKAP) {
    for (const pb of pillarBranches) {
      if ((seunBranch === a && pb.branch === b) || (seunBranch === b && pb.branch === a)) {
        interactions.push({
          type: '합(合)', branches: [seunBranch, pb.branch],
          branchesKr: [seunBranchKr, pb.branchKr],
          pillars: ['세운', pb.pillar],
          description: `세운 ${seunBranchKr}와 ${pb.pillar} ${pb.branchKr}가 합 → 해당 영역에 조화와 좋은 인연이 기대됨.`,
          resultElement: elem,
        });
      }
    }
  }

  return {
    stem: ganzi.stem, branch: ganzi.branch,
    stemKr: ganzi.stemKr, branchKr: ganzi.branchKr,
    element, elementKr: FIVE_ELEMENTS_KR[element as keyof typeof FIVE_ELEMENTS_KR],
    year, interactions,
  };
}

// ============================================================
// 종합 분석 데이터 구조체
// ============================================================

export interface SajuAnalysis {
  elementBalance: ElementBalance;
  elementScores: { [key: string]: number };
  dayMasterStrength: DayMasterStrength;
  yongShin: YongShinResult;
  branchInteractions: BranchInteraction[];
  shinsal: Shinsal[];
  gongmang: { branches: string[]; branchesKr: string[]; description: string };
  seun: SeunInfo;
  hiddenStems: { pillar: string; branch: string; branchKr: string; stems: { stem: string; stemKr: string; element: string; role: string }[] }[];
}

export function performFullAnalysis(saju: SajuData, currentYear: number = new Date().getFullYear()): SajuAnalysis {
  const elementBalance = calculateDetailedElementBalance(saju);
  const elementScores = calculateElementScore(saju);
  const dayMasterStrength = analyzeDayMasterStrength(saju);
  const yongShin = estimateYongShin(saju, dayMasterStrength);
  const branchInteractions = analyzeBranchInteractions(saju);
  const shinsal = calculateShinsal(saju);
  const gongmang = calculateGongmang(saju.dayStem, saju.day.branch);
  const seun = calculateSeun(currentYear, saju);
  const hiddenStems = getAllHiddenStems(saju);

  return {
    elementBalance, elementScores, dayMasterStrength, yongShin,
    branchInteractions, shinsal, gongmang, seun, hiddenStems,
  };
}
