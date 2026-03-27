'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalMembers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingContacts: number;
  activeSubscribers: number;
  monthlyChart: Array<{ month: string; revenue: number }>;
}

const MONTHLY_GOAL = 1_000_000; // 월 100만원 목표

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700/50">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-sm">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
}

function MonthlyGoalCard({ currentRevenue }: { currentRevenue: number }) {
  const progress = Math.min((currentRevenue / MONTHLY_GOAL) * 100, 100);
  const remaining = Math.max(MONTHLY_GOAL - currentRevenue, 0);
  const isAchieved = currentRevenue >= MONTHLY_GOAL;
  const progressColor = progress >= 100 ? 'from-emerald-400 to-green-500' : progress >= 70 ? 'from-yellow-400 to-orange-400' : 'from-blue-500 to-violet-500';

  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-slate-400 text-sm">이번 달 수익 목표</p>
          <p className="text-white font-extrabold text-lg mt-0.5">₩1,000,000 달성</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAchieved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
          {isAchieved ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          )}
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div className="mb-3">
        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all duration-700`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-white font-bold text-xl">₩{currentRevenue.toLocaleString()}</span>
          <span className="text-slate-500 text-sm ml-1">/ ₩1,000,000</span>
        </div>
        <div className="text-right">
          {isAchieved ? (
            <span className="text-emerald-400 text-sm font-bold">🎉 목표 달성!</span>
          ) : (
            <span className="text-slate-400 text-sm">
              <span className="text-white font-semibold">₩{remaining.toLocaleString()}</span> 남음
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>달성률 <span className={`font-bold ${isAchieved ? 'text-emerald-400' : 'text-white'}`}>{progress.toFixed(1)}%</span></span>
          <span>목표 <span className="text-white font-semibold">₩1,000,000</span></span>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const maxRevenue = stats ? Math.max(...stats.monthlyChart.map((m) => m.revenue), 1) : 1;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-white text-2xl font-bold">대시보드</h1>
        <p className="text-slate-400 text-sm mt-0.5">쟁승메이드 운영 현황</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          {/* 월 목표 추적 */}
          <div className="mb-6">
            <MonthlyGoalCard currentRevenue={stats?.totalRevenue ?? 0} />
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatCard
              label="총 회원 수"
              value={`${stats?.totalMembers ?? 0}명`}
              color="bg-blue-500/20 text-blue-400"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <StatCard
              label="총 결제 건수"
              value={`${stats?.totalOrders ?? 0}건`}
              color="bg-green-500/20 text-green-400"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              label="총 수익"
              value={`₩${(stats?.totalRevenue ?? 0).toLocaleString()}`}
              color="bg-yellow-500/20 text-yellow-400"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              label="활성 구독자"
              value={`${stats?.activeSubscribers ?? 0}명`}
              color="bg-amber-500/20 text-amber-400"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              }
            />
            <StatCard
              label="미처리 문의"
              value={`${stats?.pendingContacts ?? 0}건`}
              color="bg-red-500/20 text-red-400"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>

          {/* 월별 수익 차트 */}
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700/50">
            <h2 className="text-white font-semibold mb-5">월별 수익 현황 (최근 6개월)</h2>
            <div className="flex items-end gap-3 h-48">
              {stats?.monthlyChart.map((item) => {
                const height = maxRevenue > 0 ? Math.max((item.revenue / maxRevenue) * 100, item.revenue > 0 ? 4 : 0) : 0;
                const monthLabel = item.month.slice(5); // MM
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-slate-400 text-xs">
                      {item.revenue > 0 ? `₩${(item.revenue / 1000).toFixed(0)}K` : ''}
                    </span>
                    <div className="w-full flex items-end justify-center h-32">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-red-600 to-orange-400 transition-all duration-500"
                        style={{ height: `${height}%`, minHeight: item.revenue > 0 ? '4px' : '0' }}
                      />
                    </div>
                    <span className="text-slate-400 text-xs">{monthLabel}월</span>
                  </div>
                );
              })}
            </div>
            {(stats?.totalRevenue ?? 0) === 0 && (
              <p className="text-center text-slate-600 text-sm mt-2">결제 데이터가 없습니다</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
