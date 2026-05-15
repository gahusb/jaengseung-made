import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminTokenNode } from '@/lib/admin-auth';

export const runtime = 'nodejs';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token && verifyAdminTokenNode(token);
}

interface SurveyRow {
  id: string;
  created_at: string;
  age_range: string | null;
  status: string | null;
  awareness_freq: string | null;
  tools_used: string[] | null;
  tools_other: string | null;
  cost_range: string | null;
  best_tool: string | null;
  best_satisfy: number | null;
  free_opinion: string | null;
  email: string | null;
  user_agent: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  completion_seconds: number | null;
}

export async function GET(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const range = url.searchParams.get('range') ?? 'all';
  const format = url.searchParams.get('format') ?? 'json';

  const supabase = createAdminClient();
  let query = supabase
    .from('survey_responses')
    .select('*')
    .order('created_at', { ascending: false });

  if (range === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    query = query.gte('created_at', today.toISOString());
  } else if (range === 'week') {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    query = query.gte('created_at', weekAgo.toISOString());
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows: SurveyRow[] = (data ?? []) as SurveyRow[];

  if (format === 'csv') {
    const csv = toCsv(rows);
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="contour-survey-${range}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({
    total: rows.length,
    stats: computeStats(rows),
    responses: rows,
  });
}

function toCsv(rows: SurveyRow[]): string {
  if (rows.length === 0) return 'id,created_at\n';
  const headers: (keyof SurveyRow)[] = [
    'id',
    'created_at',
    'age_range',
    'status',
    'awareness_freq',
    'tools_used',
    'tools_other',
    'cost_range',
    'best_tool',
    'best_satisfy',
    'free_opinion',
    'email',
    'user_agent',
    'referrer',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'completion_seconds',
  ];
  // BOM for Excel UTF-8 호환
  const bom = '﻿';
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(
      headers
        .map((h) => {
          const v = r[h];
          if (v == null) return '';
          if (Array.isArray(v)) return `"${v.join('|').replace(/"/g, '""')}"`;
          return `"${String(v).replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
        })
        .join(',')
    );
  }
  return bom + lines.join('\n');
}

function counts(rows: SurveyRow[], key: keyof SurveyRow): Record<string, number> {
  return rows.reduce((acc, r) => {
    const v = r[key];
    if (v != null && typeof v === 'string') {
      acc[v] = (acc[v] ?? 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
}

function computeStats(rows: SurveyRow[]) {
  const satisfyValues = rows
    .map((r) => r.best_satisfy)
    .filter((n): n is number => typeof n === 'number');
  const satisfyAvg =
    satisfyValues.length > 0
      ? (satisfyValues.reduce((s, n) => s + n, 0) / satisfyValues.length).toFixed(2)
      : '0';

  const completionValues = rows
    .map((r) => r.completion_seconds)
    .filter((n): n is number => typeof n === 'number');
  const completionMedian = median(completionValues);

  return {
    age_range: counts(rows, 'age_range'),
    status: counts(rows, 'status'),
    awareness_freq: counts(rows, 'awareness_freq'),
    cost_range: counts(rows, 'cost_range'),
    best_tool: counts(rows, 'best_tool'),
    satisfy_avg: satisfyAvg,
    email_rate: rows.length === 0 ? '0' : ((rows.filter((r) => r.email).length / rows.length) * 100).toFixed(1),
    completion_seconds_median: completionMedian,
  };
}

function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}
