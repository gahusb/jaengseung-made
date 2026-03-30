import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminTokenNode } from '@/lib/admin-auth';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export const runtime = 'nodejs';

function getClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON 환경변수가 설정되지 않았습니다.');
  const credentials = JSON.parse(raw);
  return new BetaAnalyticsDataClient({ credentials });
}

function getPropertyId() {
  const id = process.env.GA4_PROPERTY_ID;
  if (!id) throw new Error('GA4_PROPERTY_ID 환경변수가 설정되지 않았습니다.');
  return id;
}

export async function GET(request: Request) {
  // 관리자 인증
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token || !verifyAdminTokenNode(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') ?? '30'; // 7, 30, 90
  const days = parseInt(range);

  try {
    const client = getClient();
    const propertyId = getPropertyId();

    const startDate = `${days}daysAgo`;

    // 병렬로 3개 리포트 요청
    const [trendRes, pagesRes, sourcesRes] = await Promise.all([
      // 1. 일별 방문자 추이
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate: 'today' }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }],
        orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
      }),

      // 2. 상위 페이지
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),

      // 3. 유입 경로 + 기기
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate: 'today' }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }, { name: 'deviceCategory' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 20,
      }),
    ]);

    // 오늘 / 어제 / 이번 주 / 기간 합계
    const summaryRes = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        { startDate: 'today', endDate: 'today' },
        { startDate: 'yesterday', endDate: 'yesterday' },
        { startDate: '7daysAgo', endDate: 'today' },
        { startDate: startDate, endDate: 'today' },
      ],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }],
    });

    // --- 파싱 ---
    const summary = {
      today: { users: 0, sessions: 0, pageviews: 0 },
      yesterday: { users: 0, sessions: 0, pageviews: 0 },
      week: { users: 0, sessions: 0, pageviews: 0 },
      period: { users: 0, sessions: 0, pageviews: 0 },
    };
    const keys = ['today', 'yesterday', 'week', 'period'] as const;
    summaryRes[0].rows?.forEach((row, i) => {
      const key = keys[i];
      if (key) {
        summary[key] = {
          users: parseInt(row.metricValues?.[0]?.value ?? '0'),
          sessions: parseInt(row.metricValues?.[1]?.value ?? '0'),
          pageviews: parseInt(row.metricValues?.[2]?.value ?? '0'),
        };
      }
    });

    const daily = (trendRes[0].rows ?? []).map((row) => ({
      date: row.dimensionValues?.[0]?.value ?? '',
      users: parseInt(row.metricValues?.[0]?.value ?? '0'),
      sessions: parseInt(row.metricValues?.[1]?.value ?? '0'),
      pageviews: parseInt(row.metricValues?.[2]?.value ?? '0'),
    }));

    const topPages = (pagesRes[0].rows ?? []).map((row) => ({
      page: row.dimensionValues?.[0]?.value ?? '',
      views: parseInt(row.metricValues?.[0]?.value ?? '0'),
      users: parseInt(row.metricValues?.[1]?.value ?? '0'),
    }));

    // 채널별 집계
    const channelMap: Record<string, number> = {};
    const deviceMap: Record<string, number> = {};
    (sourcesRes[0].rows ?? []).forEach((row) => {
      const channel = row.dimensionValues?.[0]?.value ?? 'Unknown';
      const device = row.dimensionValues?.[1]?.value ?? 'Unknown';
      const sessions = parseInt(row.metricValues?.[0]?.value ?? '0');
      channelMap[channel] = (channelMap[channel] ?? 0) + sessions;
      deviceMap[device] = (deviceMap[device] ?? 0) + sessions;
    });
    const sources = Object.entries(channelMap)
      .map(([channel, sessions]) => ({ channel, sessions }))
      .sort((a, b) => b.sessions - a.sessions);
    const devices = Object.entries(deviceMap)
      .map(([device, sessions]) => ({ device, sessions }))
      .sort((a, b) => b.sessions - a.sessions);

    return NextResponse.json({ summary, daily, topPages, sources, devices });
  } catch (err) {
    const msg = err instanceof Error ? err.message : '알 수 없는 오류';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
