declare module 'lunar-javascript' {
  class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    static fromJulianDay(julianDay: number): Solar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getHour(): number;
    getMinute(): number;
    getSecond(): number;
  }

  class LunarYear {
    static fromYear(year: number): LunarYear;
    /** Returns 31 Julian Day Numbers for the 24 solar terms of the year */
    getJieQiJulianDays(): number[];
  }

  class Lunar {
    static fromYmd(lunarYear: number, lunarMonth: number, lunarDay: number): Lunar;
    getSolar(): Solar;
  }
}
