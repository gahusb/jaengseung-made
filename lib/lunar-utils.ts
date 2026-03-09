/**
 * 음력-양력 변환 유틸리티
 */

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
 * @param lunarYear 음력 년
 * @param lunarMonth 음력 월
 * @param lunarDay 음력 일
 * @param isLeapMonth 윤달 여부
 */
export function lunarToSolar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  isLeapMonth: boolean = false
): SolarDate {
  try {
    const lunar = require('lunar-calendar');
    const result = lunar.lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeapMonth);

    return {
      year: result.year,
      month: result.month,
      day: result.day
    };
  } catch (error) {
    console.error('음력 변환 오류:', error);
    // 변환 실패시 입력값 그대로 반환
    return {
      year: lunarYear,
      month: lunarMonth,
      day: lunarDay
    };
  }
}

/**
 * 양력을 음력으로 변환
 * @param solarYear 양력 년
 * @param solarMonth 양력 월
 * @param solarDay 양력 일
 */
export function solarToLunar(
  solarYear: number,
  solarMonth: number,
  solarDay: number
): LunarDate {
  try {
    const lunar = require('lunar-calendar');
    const result = lunar.solarToLunar(solarYear, solarMonth, solarDay);

    return {
      year: result.year,
      month: result.month,
      day: result.day,
      isLeap: result.isLeap || false
    };
  } catch (error) {
    console.error('양력 변환 오류:', error);
    // 변환 실패시 입력값 그대로 반환
    return {
      year: solarYear,
      month: solarMonth,
      day: solarDay,
      isLeap: false
    };
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
