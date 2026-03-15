/**
 * 음력-양력 변환 유틸리티
 * solarlunar 패키지 사용 (https://www.npmjs.com/package/solarlunar)
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const solarlunar = require('solarlunar');

interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
}

interface SolarDate {
  year: number;
  month: number;
  day: number;
}

/**
 * 음력을 양력으로 변환
 */
export function lunarToSolar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  isLeapMonth: boolean = false
): SolarDate {
  try {
    const result = solarlunar.lunar2solar(lunarYear, lunarMonth, lunarDay, isLeapMonth);
    return {
      year: result.cYear,
      month: result.cMonth,
      day: result.cDay,
    };
  } catch (error) {
    console.error('음력 변환 오류:', error);
    return { year: lunarYear, month: lunarMonth, day: lunarDay };
  }
}

/**
 * 양력을 음력으로 변환
 */
export function solarToLunar(
  solarYear: number,
  solarMonth: number,
  solarDay: number
): LunarDate {
  try {
    const result = solarlunar.solar2lunar(solarYear, solarMonth, solarDay);
    return {
      year: result.lYear,
      month: result.lMonth,
      day: result.lDay,
      isLeap: result.isLeap,
    };
  } catch (error) {
    console.error('양력 변환 오류:', error);
    return { year: solarYear, month: solarMonth, day: solarDay, isLeap: false };
  }
}

/**
 * 음력 날짜를 문자열로 변환
 */
export function formatLunarDate(lunar: LunarDate): string {
  const leapText = lunar.isLeap ? '윤' : '';
  return `음력 ${lunar.year}년 ${leapText}${lunar.month}월 ${lunar.day}일`;
}

/**
 * 양력 날짜를 문자열로 변환
 */
export function formatSolarDate(solar: SolarDate): string {
  return `양력 ${solar.year}년 ${solar.month}월 ${solar.day}일`;
}
