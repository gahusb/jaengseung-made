import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireSubscription } from '../../_nas';

const DRAW_AVG_ODD = 3.0;  // 로또 실제 홀수 평균
const DRAW_AVG_SUM = 138;  // 로또 실제 합계 평균

export async function GET() {
  try {
    const auth = await requireSubscription();
    if (auth instanceof NextResponse) return auth;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('lotto_history')
      .select('numbers')
      .eq('user_id', auth.userId)
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) throw error;

    const rows = data ?? [];
    if (rows.length === 0) {
      return NextResponse.json({
        total_analyzed: 0,
        number_frequency: {},
        top_picks: [],
        least_picks: [],
        pattern: { avg_odd_count: 0, avg_sum: 0, avg_range: 0, consecutive_rate: 0, zone_avg: {} },
        vs_draw_avg: { odd_diff: 0, sum_diff: 0, odd_tendency: '보통', sum_tendency: '보통' },
      });
    }

    // 번호 빈도 집계
    const freq: Record<number, number> = {};
    for (let i = 1; i <= 45; i++) freq[i] = 0;

    let totalOdd = 0, totalSum = 0, totalRange = 0, consecutiveCount = 0;
    const zoneCounts: Record<string, number> = { '1-10': 0, '11-20': 0, '21-30': 0, '31-40': 0, '41-45': 0 };

    for (const row of rows) {
      const nums: number[] = Array.isArray(row.numbers) ? row.numbers : [];
      const sorted = [...nums].sort((a, b) => a - b);

      for (const n of sorted) {
        freq[n] = (freq[n] ?? 0) + 1;
        if (n <= 10) zoneCounts['1-10']++;
        else if (n <= 20) zoneCounts['11-20']++;
        else if (n <= 30) zoneCounts['21-30']++;
        else if (n <= 40) zoneCounts['31-40']++;
        else zoneCounts['41-45']++;
      }

      totalOdd += sorted.filter(n => n % 2 !== 0).length;
      totalSum += sorted.reduce((a, b) => a + b, 0);
      totalRange += sorted.length >= 2 ? sorted[sorted.length - 1] - sorted[0] : 0;
      if (sorted.some((n, i) => i > 0 && n === sorted[i - 1] + 1)) consecutiveCount++;
    }

    const n = rows.length;
    const avgOdd = totalOdd / n;
    const avgSum = totalSum / n;

    const freqEntries = Object.entries(freq)
      .map(([num, cnt]) => ({ num: parseInt(num), cnt }))
      .sort((a, b) => b.cnt - a.cnt);

    const zoneAvg: Record<string, number> = {};
    for (const [zone, count] of Object.entries(zoneCounts)) {
      zoneAvg[zone] = Math.round((count / n) * 10) / 10;
    }

    return NextResponse.json({
      total_analyzed: n,
      number_frequency: freq,
      top_picks: freqEntries.slice(0, 10).map(e => e.num),
      least_picks: freqEntries.slice(-10).map(e => e.num).reverse(),
      pattern: {
        avg_odd_count: Math.round(avgOdd * 10) / 10,
        avg_sum: Math.round(avgSum),
        avg_range: Math.round(totalRange / n),
        consecutive_rate: Math.round((consecutiveCount / n) * 100) / 100,
        zone_avg: zoneAvg,
      },
      vs_draw_avg: {
        odd_diff: Math.round((avgOdd - DRAW_AVG_ODD) * 10) / 10,
        sum_diff: Math.round(avgSum - DRAW_AVG_SUM),
        odd_tendency: avgOdd > DRAW_AVG_ODD + 0.3 ? '홀수 선호' : avgOdd < DRAW_AVG_ODD - 0.3 ? '짝수 선호' : '보통',
        sum_tendency: avgSum > DRAW_AVG_SUM + 10 ? '고합계 선호' : avgSum < DRAW_AVG_SUM - 10 ? '저합계 선호' : '보통',
      },
    });
  } catch (err) {
    console.error('[analysis/personal]', err);
    return NextResponse.json({ error: 'DB_ERROR' }, { status: 500 });
  }
}
