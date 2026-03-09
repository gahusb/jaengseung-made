/**
 * 24절기 계산
 * 사주 계산에서 월주는 절기를 기준으로 합니다.
 */

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
 * 정밀한 절기 계산 (천문학적 계산 기반)
 * solarlunar 라이브러리 사용
 */
export function getSolarTermDate(year: number, termIndex: number): SolarTermDate {
  try {
    const solarLunar = require('solarlunar');

    // solarlunar의 절기 데이터 가져오기
    // 각 년도의 절기 정보를 계산
    const termNames = [
      '立春', '雨水', '驚蟄', '春分', '清明', '穀雨',
      '立夏', '小滿', '芒種', '夏至', '小暑', '大暑',
      '立秋', '處暑', '白露', '秋分', '寒露', '霜降',
      '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
    ];

    // 해당 년도의 절기 찾기
    // solarlunar는 양력 날짜로 절기 확인 가능
    // 각 절기의 대략적인 날짜 범위에서 검색

    const searchRanges = [
      { month: 2, startDay: 3, endDay: 5 },   // 입춘
      { month: 2, startDay: 18, endDay: 20 }, // 우수
      { month: 3, startDay: 5, endDay: 7 },   // 경칩
      { month: 3, startDay: 20, endDay: 22 }, // 춘분
      { month: 4, startDay: 4, endDay: 6 },   // 청명
      { month: 4, startDay: 19, endDay: 21 }, // 곡우
      { month: 5, startDay: 5, endDay: 7 },   // 입하
      { month: 5, startDay: 20, endDay: 22 }, // 소만
      { month: 6, startDay: 5, endDay: 7 },   // 망종
      { month: 6, startDay: 20, endDay: 22 }, // 하지
      { month: 7, startDay: 6, endDay: 8 },   // 소서
      { month: 7, startDay: 22, endDay: 24 }, // 대서
      { month: 8, startDay: 7, endDay: 9 },   // 입추
      { month: 8, startDay: 22, endDay: 24 }, // 처서
      { month: 9, startDay: 7, endDay: 9 },   // 백로
      { month: 9, startDay: 22, endDay: 24 }, // 추분
      { month: 10, startDay: 7, endDay: 9 },  // 한로
      { month: 10, startDay: 23, endDay: 24 },// 상강
      { month: 11, startDay: 7, endDay: 8 },  // 입동
      { month: 11, startDay: 21, endDay: 23 },// 소설
      { month: 12, startDay: 6, endDay: 8 },  // 대설
      { month: 12, startDay: 21, endDay: 23 },// 동지
      { month: 1, startDay: 5, endDay: 7 },   // 소한
      { month: 1, startDay: 19, endDay: 21 }, // 대한
    ];

    const range = searchRanges[termIndex];
    const termName = termNames[termIndex];

    // 해당 범위 내에서 절기 찾기
    for (let day = range.startDay; day <= range.endDay; day++) {
      const lunar = solarLunar.solar2lunar(year, range.month, day);
      if (lunar && lunar.term === termName) {
        return {
          year,
          month: range.month,
          day,
          hour: 0,
          minute: 0
        };
      }
    }

    // 찾지 못한 경우 중간값 사용
    const midDay = Math.floor((range.startDay + range.endDay) / 2);
    return {
      year,
      month: range.month,
      day: midDay,
      hour: 0,
      minute: 0
    };

  } catch (error) {
    console.error('절기 계산 오류:', error);

    // 폴백: 기존 근사값 사용
    const baseMonth = [
      2, 2, 3, 3, 4, 4,
      5, 5, 6, 6, 7, 7,
      8, 8, 9, 9, 10, 10,
      11, 11, 12, 12, 1, 1
    ];

    const baseDay = [
      4, 19, 5, 20, 4, 20,
      5, 21, 6, 21, 7, 23,
      7, 23, 8, 23, 8, 23,
      7, 22, 7, 22, 5, 20
    ];

    return {
      year,
      month: baseMonth[termIndex],
      day: baseDay[termIndex],
      hour: 0,
      minute: 0
    };
  }
}

/**
 * 주어진 날짜가 어느 절기 이후인지 확인
 * @param year 년
 * @param month 월
 * @param day 일
 * @returns 절기 인덱스 (0~23)
 */
export function getCurrentSolarTerm(year: number, month: number, day: number): number {
  const date = new Date(year, month - 1, day);
  const dateValue = date.getTime();

  // 각 절기 날짜 확인
  for (let i = 23; i >= 0; i--) {
    const termDate = getSolarTermDate(year, i);
    let termYear = termDate.year;
    let termMonth = termDate.month;

    // 대한, 소한은 이전 해 처리
    if (i >= 22 && month >= 2) {
      termYear = year;
    } else if (i >= 22) {
      termYear = year - 1;
    }

    const term = new Date(termYear, termMonth - 1, termDate.day);

    if (dateValue >= term.getTime()) {
      return i;
    }
  }

  // 입춘 이전이면 전년도 대한 이후
  return 23;
}

/**
 * 절기 기준 월주 지지 인덱스 계산
 * @param year 년
 * @param month 월
 * @param day 일
 * @returns 지지 인덱스 (0: 자, 1: 축, 2: 인, ...)
 */
export function getSolarTermMonthBranch(year: number, month: number, day: number): number {
  const termIndex = getCurrentSolarTerm(year, month, day);

  // 절기 인덱스를 월로 변환
  // 입춘(0) -> 인월(2)
  // 경칩(2) -> 묘월(3)
  // 청명(4) -> 진월(4)
  // ...

  const monthBranches = [
    2,  // 입춘 -> 인월
    2,  // 우수 -> 인월
    3,  // 경칩 -> 묘월
    3,  // 춘분 -> 묘월
    4,  // 청명 -> 진월
    4,  // 곡우 -> 진월
    5,  // 입하 -> 사월
    5,  // 소만 -> 사월
    6,  // 망종 -> 오월
    6,  // 하지 -> 오월
    7,  // 소서 -> 미월
    7,  // 대서 -> 미월
    8,  // 입추 -> 신월
    8,  // 처서 -> 신월
    9,  // 백로 -> 유월
    9,  // 추분 -> 유월
    10, // 한로 -> 술월
    10, // 상강 -> 술월
    11, // 입동 -> 해월
    11, // 소설 -> 해월
    0,  // 대설 -> 자월
    0,  // 동지 -> 자월
    1,  // 소한 -> 축월
    1,  // 대한 -> 축월
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

  let nextYear = year;
  if (currentTerm === 23) {
    nextYear = year + 1;
  }

  const nextTerm = getSolarTermDate(nextYear, nextTermIndex);
  const nextDate = new Date(nextTerm.year, nextTerm.month - 1, nextTerm.day);

  const diffTime = nextDate.getTime() - currentDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}
