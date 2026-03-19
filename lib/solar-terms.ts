/**
 * 24절기 계산 — lunar-javascript 라이브러리 기반 (정밀 천문학 계산)
 * 사주 계산에서 월주는 절기를 기준으로 합니다.
 */
import { LunarYear, Solar } from 'lunar-javascript';

// 24절기 (입춘부터 시작)
export const SOLAR_TERMS = [
  '입춘', '우수', '경칩', '춘분', '청명', '곡우',
  '입하', '소만', '망종', '하지', '소서', '대서',
  '입추', '처서', '백로', '추분', '한로', '상강',
  '입동', '소설', '대설', '동지', '소한', '대한'
] as const;

// 월 절기 (홀수 인덱스: 입X, 짝수 인덱스: X분/X지)
export const MONTH_SOLAR_TERMS = [
  '입춘', // 1월 (인월)
  '경칩', // 2월 (묘월)
  '청명', // 3월 (진월)
  '입하', // 4월 (사월)
  '망종', // 5월 (오월)
  '소서', // 6월 (미월)
  '입추', // 7월 (신월)
  '백로', // 8월 (유월)
  '한로', // 9월 (술월)
  '입동', // 10월 (해월)
  '대설', // 11월 (자월)
  '소한', // 12월 (축월)
] as const;

interface SolarTermDate {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

/**
 * 정밀한 절기 날짜 계산 (lunar-javascript 기반)
 *
 * termIndex 매핑 (0~23):
 *   0=입춘, 1=우수, ..., 21=동지, 22=소한, 23=대한
 *
 * LunarYear.fromYear(y).getJieQiJulianDays() 인덱스 구조:
 *   [0]=大雪(y-1), [1]=冬至(y-1), [2]=小寒(y), [3]=大寒(y),
 *   [4]=立春(y) ← termIndex 0
 *   [5]=雨水(y) ← termIndex 1
 *   ...
 *   [25]=冬至(y) ← termIndex 21
 *   [26]=小寒(y+1) ← termIndex 22
 *   [27]=大寒(y+1) ← termIndex 23
 *
 * 반환 규칙:
 *   getSolarTermDate(year, 0~21)  → year 내 절기 날짜
 *   getSolarTermDate(year, 22~23) → year 1월의 소한/대한 날짜
 *     (내부적으로 LunarYear.fromYear(year - 1) 사용)
 */
export function getSolarTermDate(year: number, termIndex: number): SolarTermDate {
  // 소한(22)/대한(23)은 해당 연도 1월에 위치.
  // LunarYear.fromYear(y)[26/27]은 y+1년 1월을 반환하므로
  // year의 1월 소한/대한을 얻으려면 year-1로 조회.
  const lunarYear = termIndex >= 22 ? year - 1 : year;
  const jds = LunarYear.fromYear(lunarYear).getJieQiJulianDays();
  const jd = jds[termIndex + 4];
  const solar = Solar.fromJulianDay(jd);

  return {
    year: solar.getYear(),
    month: solar.getMonth(),
    day: solar.getDay(),
    hour: solar.getHour(),
    minute: solar.getMinute(),
  };
}

/**
 * 주어진 날짜가 어느 절기 이후인지 확인
 * @returns 절기 인덱스 (0~23)
 */
export function getCurrentSolarTerm(year: number, month: number, day: number): number {
  const dateValue = Date.UTC(year, month - 1, day);

  const ipchunData = getSolarTermDate(year, 0);
  const ipchunValue = Date.UTC(ipchunData.year, ipchunData.month - 1, ipchunData.day);

  if (dateValue >= ipchunValue) {
    // 입춘 이후: 동지(21)→입춘(0) 역순 검색
    for (let i = 21; i >= 0; i--) {
      const td = getSolarTermDate(year, i);
      const termValue = Date.UTC(td.year, td.month - 1, td.day);
      if (dateValue >= termValue) return i;
    }
    return 0;
  } else {
    // 입춘 이전 (1월 또는 2월 초): 이 해의 소한(22)/대한(23) 먼저 확인
    for (let i = 23; i >= 22; i--) {
      const td = getSolarTermDate(year, i);
      const termValue = Date.UTC(td.year, td.month - 1, td.day);
      if (dateValue >= termValue) return i;
    }
    // 전년도 동지(21)→입춘(0) 역순 검색
    for (let i = 21; i >= 0; i--) {
      const td = getSolarTermDate(year - 1, i);
      const termValue = Date.UTC(td.year, td.month - 1, td.day);
      if (dateValue >= termValue) return i;
    }
    return 23;
  }
}

/**
 * 절기 기준 월주 지지 인덱스 계산
 * @returns 지지 인덱스 (0: 자, 1: 축, 2: 인, ...)
 */
export function getSolarTermMonthBranch(year: number, month: number, day: number): number {
  const termIndex = getCurrentSolarTerm(year, month, day);

  const monthBranches = [
    2,  // 입춘 → 인월
    2,  // 우수 → 인월
    3,  // 경칩 → 묘월
    3,  // 춘분 → 묘월
    4,  // 청명 → 진월
    4,  // 곡우 → 진월
    5,  // 입하 → 사월
    5,  // 소만 → 사월
    6,  // 망종 → 오월
    6,  // 하지 → 오월
    7,  // 소서 → 미월
    7,  // 대서 → 미월
    8,  // 입추 → 신월
    8,  // 처서 → 신월
    9,  // 백로 → 유월
    9,  // 추분 → 유월
    10, // 한로 → 술월
    10, // 상강 → 술월
    11, // 입동 → 해월
    11, // 소설 → 해월
    0,  // 대설 → 자월
    0,  // 동지 → 자월
    1,  // 소한 → 축월
    1,  // 대한 → 축월
  ];

  return monthBranches[termIndex];
}

/**
 * 절기명 가져오기
 */
export function getSolarTermName(termIndex: number): string {
  return SOLAR_TERMS[termIndex];
}

/**
 * 다음 절기까지 남은 일수 계산
 */
export function getDaysToNextSolarTerm(year: number, month: number, day: number): number {
  const currentDate = new Date(year, month - 1, day);
  const currentTerm = getCurrentSolarTerm(year, month, day);
  const nextTermIndex = (currentTerm + 1) % 24;

  // 대한(23) 다음은 입춘(0) — 다음 연도
  const nextYear = currentTerm === 23 ? year + 1 : year;

  const nextTerm = getSolarTermDate(nextYear, nextTermIndex);
  const nextDate = new Date(nextTerm.year, nextTerm.month - 1, nextTerm.day);

  const diffTime = nextDate.getTime() - currentDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}
