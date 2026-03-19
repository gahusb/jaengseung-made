import { HEAVENLY_STEMS, EARTHLY_BRANCHES, HEAVENLY_STEMS_KR, EARTHLY_BRANCHES_KR } from './saju-calculator';

/**
 * 대운 (大運) 정보
 */
export interface DaeunPillar {
  age: number;          // 시작 나이
  startYear: number;    // 시작 년도
  endYear: number;      // 끝 년도
  stem: string;         // 천간
  branch: string;       // 지지
  stemKr: string;       // 천간 한글
  branchKr: string;     // 지지 한글
}

/**
 * 대운 시작 나이 정밀 계산
 * @param birthYear 생년
 * @param birthMonth 생월
 * @param birthDay 생일
 * @param gender 성별
 * @param isYangYear 양년 여부
 * @returns 대운 시작 나이
 */
function calculateDaeunStartAge(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  gender: 'male' | 'female',
  isYangYear: boolean
): number {
  const { getDaysToNextSolarTerm, getCurrentSolarTerm, getSolarTermDate } = require('./solar-terms');

  // 양남음녀는 순행 (다음 절기까지), 음남양녀는 역행 (이전 절기부터)
  let days: number;

  if ((gender === 'male' && isYangYear) || (gender === 'female' && !isYangYear)) {
    // 순행: 생일부터 다음 절기까지의 일수
    days = getDaysToNextSolarTerm(birthYear, birthMonth, birthDay);
  } else {
    // 역행: 이전 절기부터 생일까지의 일수
    const currentTerm = getCurrentSolarTerm(birthYear, birthMonth, birthDay);
    const termDate = getSolarTermDate(birthYear, currentTerm);

    // getSolarTermDate가 소한(22)/대한(23)에 대해 birthYear 1월 날짜를 올바르게 반환
    const termDateObj = new Date(termDate.year, termDate.month - 1, termDate.day);
    const birthDateObj = new Date(birthYear, birthMonth - 1, birthDay);

    const diffTime = birthDateObj.getTime() - termDateObj.getTime();
    days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // 3일 = 1세 (대운수)
  // 정확히는 3일당 1세이지만, 일수를 3으로 나눈 몫
  const startAge = Math.floor(days / 3);

  // 최소 1세, 최대 10세로 제한
  return Math.max(1, Math.min(10, startAge));
}

/**
 * 대운 계산
 * @param birthYear 생년
 * @param birthMonth 생월
 * @param birthDay 생일
 * @param gender 성별
 * @param monthStem 월주 천간 인덱스
 * @param monthBranch 월주 지지 인덱스
 * @returns 대운 배열 (10년 단위)
 */
export function calculateDaeun(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  gender: 'male' | 'female',
  monthStem: string,
  monthBranch: string
): DaeunPillar[] {
  const monthStemIndex = HEAVENLY_STEMS.indexOf(monthStem as any);
  const monthBranchIndex = EARTHLY_BRANCHES.indexOf(monthBranch as any);

  if (monthStemIndex === -1 || monthBranchIndex === -1) {
    return [];
  }

  // 양남음녀(陽男陰女)는 순행, 음남양녀(陰男陽女)는 역행
  const yearStemIndex = (birthYear - 1900 + 6) % 10;
  const isYangYear = yearStemIndex % 2 === 0; // 양년

  let isForward: boolean;
  if (gender === 'male') {
    isForward = isYangYear; // 양남: 순행, 음남: 역행
  } else {
    isForward = !isYangYear; // 양녀: 역행, 음녀: 순행
  }

  // 대운 시작 나이 정밀 계산 (절기 기준)
  const startAge = calculateDaeunStartAge(birthYear, birthMonth, birthDay, gender, isYangYear);

  const daeunList: DaeunPillar[] = [];

  for (let i = 0; i < 8; i++) {
    const age = startAge + (i * 10);
    const startYear = birthYear + age;
    const endYear = startYear + 9;

    let stemIndex: number;
    let branchIndex: number;

    if (isForward) {
      // 순행: 월주에서 증가
      stemIndex = (monthStemIndex + i + 1) % 10;
      branchIndex = (monthBranchIndex + i + 1) % 12;
    } else {
      // 역행: 월주에서 감소
      stemIndex = (monthStemIndex - i - 1 + 100) % 10;
      branchIndex = (monthBranchIndex - i - 1 + 120) % 12;
    }

    daeunList.push({
      age,
      startYear,
      endYear,
      stem: HEAVENLY_STEMS[stemIndex],
      branch: EARTHLY_BRANCHES[branchIndex],
      stemKr: HEAVENLY_STEMS_KR[stemIndex],
      branchKr: EARTHLY_BRANCHES_KR[branchIndex]
    });
  }

  return daeunList;
}

/**
 * 현재 대운 찾기
 * @param daeunList 대운 목록
 * @param currentYear 현재 년도
 */
export function getCurrentDaeun(daeunList: DaeunPillar[], currentYear: number): DaeunPillar | null {
  for (const daeun of daeunList) {
    if (currentYear >= daeun.startYear && currentYear <= daeun.endYear) {
      return daeun;
    }
  }
  return null;
}

/**
 * 대운 해석
 * @param daeun 대운 정보
 * @param dayStem 일간
 */
export function getDaeunDescription(daeun: DaeunPillar, dayStem: string): string {
  const age = daeun.age;
  const ganzi = `${daeun.stem}${daeun.branch}`;

  let description = `${age}세부터 ${age + 9}세까지의 10년은 ${daeun.stemKr}${daeun.branchKr}(${ganzi}) 대운입니다. `;

  // 대운 천간과 일간의 관계에 따른 기본 해석
  const stemIndex = HEAVENLY_STEMS.indexOf(daeun.stem as any);

  if (age < 20) {
    description += '청소년기로 학업과 기초를 다지는 시기입니다. ';
  } else if (age < 40) {
    description += '성장과 발전의 시기로 사회활동이 왕성한 때입니다. ';
  } else if (age < 60) {
    description += '안정과 성숙의 시기로 경험이 쌓이는 때입니다. ';
  } else {
    description += '원숙한 시기로 인생의 지혜를 나누는 때입니다. ';
  }

  if (stemIndex % 2 === 0) {
    description += '적극적이고 외향적인 활동이 유리합니다.';
  } else {
    description += '차분하고 내실을 다지는 것이 좋습니다.';
  }

  return description;
}
