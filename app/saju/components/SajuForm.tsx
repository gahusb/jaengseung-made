'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { lunarToSolar } from '@/lib/lunar-utils';

export default function SajuForm() {
  const router = useRouter();
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [isLeapMonth, setIsLeapMonth] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!year || !month || !day) {
      alert('생년월일을 모두 입력해주세요.');
      return;
    }

    let finalYear = year;
    let finalMonth = month;
    let finalDay = day;

    // 음력인 경우 양력으로 변환
    if (calendarType === 'lunar') {
      const solar = lunarToSolar(
        parseInt(year),
        parseInt(month),
        parseInt(day),
        isLeapMonth
      );
      finalYear = solar.year.toString();
      finalMonth = solar.month.toString();
      finalDay = solar.day.toString();
    }

    // URL 파라미터로 전달
    const params = new URLSearchParams({
      year: finalYear,
      month: finalMonth,
      day: finalDay,
      gender,
      calendarType,
      originalYear: year,
      originalMonth: month,
      originalDay: day,
    });

    if (hour) {
      params.append('hour', hour);
    }

    if (calendarType === 'lunar') {
      params.append('isLeapMonth', isLeapMonth.toString());
    }

    router.push(`/saju/result?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 생년월일 */}
      <div>
        <label className="block text-left text-sm font-bold text-[#04102b] mb-3">
          생년월일
        </label>
        <div className="grid grid-cols-3 gap-3">
          <input
            type="number"
            placeholder="년 (예: 1990)"
            className="px-4 py-3 border-2 border-[#dbe8ff] rounded-xl focus:border-[#1a56db] focus:outline-none transition bg-white text-[#04102b]"
            min="1900"
            max="2100"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="월 (1-12)"
            className="px-4 py-3 border-2 border-[#dbe8ff] rounded-xl focus:border-[#1a56db] focus:outline-none transition bg-white text-[#04102b]"
            min="1"
            max="12"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="일 (1-31)"
            className="px-4 py-3 border-2 border-[#dbe8ff] rounded-xl focus:border-[#1a56db] focus:outline-none transition bg-white text-[#04102b]"
            min="1"
            max="31"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            required
          />
        </div>
      </div>

      {/* 태어난 시간 */}
      <div>
        <label className="block text-left text-sm font-bold text-[#04102b] mb-3">
          태어난 시간 (선택)
        </label>
        <select
          className="w-full px-4 py-3 border-2 border-[#dbe8ff] rounded-xl focus:border-[#1a56db] focus:outline-none transition bg-white text-[#04102b]"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
        >
          <option value="">모름 / 시간 선택 안함</option>
          <option value="0">자시 (子時) 23:00 - 01:00</option>
          <option value="1">축시 (丑時) 01:00 - 03:00</option>
          <option value="3">인시 (寅時) 03:00 - 05:00</option>
          <option value="5">묘시 (卯時) 05:00 - 07:00</option>
          <option value="7">진시 (辰時) 07:00 - 09:00</option>
          <option value="9">사시 (巳時) 09:00 - 11:00</option>
          <option value="11">오시 (午時) 11:00 - 13:00</option>
          <option value="13">미시 (未時) 13:00 - 15:00</option>
          <option value="15">신시 (申時) 15:00 - 17:00</option>
          <option value="17">유시 (酉時) 17:00 - 19:00</option>
          <option value="19">술시 (戌時) 19:00 - 21:00</option>
          <option value="21">해시 (亥時) 21:00 - 23:00</option>
        </select>
      </div>

      {/* 양력/음력 선택 */}
      <div>
        <label className="block text-left text-sm font-bold text-[#04102b] mb-3">
          생일 구분
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setCalendarType('solar')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              calendarType === 'solar'
                ? 'bg-[#1a56db] text-white shadow-lg'
                : 'bg-white border-2 border-[#dbe8ff] text-[#04102b] hover:border-[#1a56db]'
            }`}
          >
            양력
          </button>
          <button
            type="button"
            onClick={() => setCalendarType('lunar')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              calendarType === 'lunar'
                ? 'bg-[#1a56db] text-white shadow-lg'
                : 'bg-white border-2 border-[#dbe8ff] text-[#04102b] hover:border-[#1a56db]'
            }`}
          >
            음력
          </button>
        </div>
        {calendarType === 'lunar' && (
          <div className="mt-3">
            <label className="flex items-center justify-center gap-2 text-sm text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                checked={isLeapMonth}
                onChange={(e) => setIsLeapMonth(e.target.checked)}
                className="w-4 h-4 text-[#1a56db] border-gray-300 rounded focus:ring-[#1a56db]"
              />
              <span>윤달</span>
            </label>
          </div>
        )}
      </div>

      {/* 성별 선택 */}
      <div>
        <label className="block text-left text-sm font-bold text-[#04102b] mb-3">
          성별
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setGender('male')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              gender === 'male'
                ? 'bg-[#1a56db] text-white shadow-lg'
                : 'bg-white border-2 border-[#dbe8ff] text-[#04102b] hover:border-[#1a56db]'
            }`}
          >
            남성
          </button>
          <button
            type="button"
            onClick={() => setGender('female')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              gender === 'female'
                ? 'bg-[#1a56db] text-white shadow-lg'
                : 'bg-white border-2 border-[#dbe8ff] text-[#04102b] hover:border-[#1a56db]'
            }`}
          >
            여성
          </button>
        </div>
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#1a56db] to-[#7c3aed] hover:from-[#1e4fc2] hover:to-[#6d28d9] text-white py-4 rounded-xl text-lg font-bold transition shadow-lg hover:shadow-xl hover:scale-[1.02]"
      >
        내 사주 보기 →
      </button>

      <p className="text-sm text-slate-500 text-center">
        * 태어난 시간을 정확히 아시면 더 정확한 사주를 확인할 수 있습니다.
      </p>
    </form>
  );
}
