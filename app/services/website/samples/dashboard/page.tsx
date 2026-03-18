'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DashboardSample() {
  const [activeMenu, setActiveMenu] = useState('overview');

  const kpis = [
    { label: '월 활성 사용자', value: '124,832', change: '+12.4%', up: true, icon: '👤', color: '#3b82f6' },
    { label: '월 매출', value: '₩284M', change: '+8.7%', up: true, icon: '💰', color: '#10b981' },
    { label: '전환율', value: '3.62%', change: '-0.3%', up: false, icon: '📈', color: '#f59e0b' },
    { label: '고객 만족도', value: '4.8 / 5', change: '+0.2', up: true, icon: '⭐', color: '#8b5cf6' },
  ];

  const chartData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 78 },
    { month: 'Mar', value: 72 },
    { month: 'Apr', value: 89 },
    { month: 'May', value: 95 },
    { month: 'Jun', value: 82 },
    { month: 'Jul', value: 110 },
    { month: 'Aug', value: 128 },
  ];

  const maxVal = Math.max(...chartData.map((d) => d.value));

  const activities = [
    { user: 'lee@company.com', action: '프리미엄 플랜 구독', time: '2분 전', status: 'success' },
    { user: 'park@startup.io', action: 'API 한도 초과 경고', time: '14분 전', status: 'warning' },
    { user: 'kim@corp.kr', action: '팀 멤버 5명 초대', time: '31분 전', status: 'info' },
    { user: 'choi@brand.com', action: '결제 실패 (카드 만료)', time: '1시간 전', status: 'error' },
    { user: 'jung@agency.co', action: '새 워크스페이스 생성', time: '2시간 전', status: 'success' },
  ];

  const menus = [
    { id: 'overview', icon: '⊞', label: 'Overview' },
    { id: 'analytics', icon: '◈', label: 'Analytics' },
    { id: 'users', icon: '◉', label: 'Users' },
    { id: 'revenue', icon: '◆', label: 'Revenue' },
    { id: 'reports', icon: '▣', label: 'Reports' },
    { id: 'settings', icon: '◎', label: 'Settings' },
  ];

  const statusColor = { success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6' };

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes barGrow { from { height: 0; } to { height: var(--h); } }
        .dash-menu-item:hover { background: rgba(255,255,255,0.05) !important; }
        .dash-menu-item { transition: background 0.15s; }
        .dash-kpi:hover { border-color: rgba(255,255,255,0.12) !important; transform: translateY(-2px); }
        .dash-kpi { transition: border-color 0.2s, transform 0.2s; }
        .dash-row:hover { background: rgba(255,255,255,0.03) !important; }
        .dash-row { transition: background 0.15s; }
      `}</style>

      {/* Back Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12,
        position: 'relative', zIndex: 200,
      }}>
        <Link href="/services/website" style={{
          color: '#a5b4fc', fontSize: 13, textDecoration: 'none',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          ← 홈페이지 제작 서비스로 돌아가기
        </Link>
        <span style={{ color: '#4c1d95', fontSize: 13 }}>|</span>
        <span style={{ color: '#38bdf8', fontSize: 12, fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>
          SAMPLE · 관리자 대시보드
        </span>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 40px)' }}>
        {/* Sidebar */}
        <aside style={{
          width: 220, background: '#060b18',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', flexDirection: 'column', flexShrink: 0,
        }}>
          {/* Logo */}
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, fontFamily: 'DM Mono, monospace',
              }}>DF</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'white', fontFamily: 'DM Sans, sans-serif' }}>DataFlow</div>
                <div style={{ fontSize: 10, color: '#334155', fontFamily: 'DM Mono, monospace' }}>v2.4.1 · PRO</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
            <div style={{ fontSize: 9, color: '#1e3a5f', fontFamily: 'DM Mono, monospace', letterSpacing: '0.15em', padding: '8px 10px 4px', textTransform: 'uppercase' }}>
              MAIN
            </div>
            {menus.map((m) => (
              <button
                key={m.id}
                className="dash-menu-item"
                onClick={() => setActiveMenu(m.id)}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2,
                  background: activeMenu === m.id ? 'rgba(59,130,246,0.15)' : 'transparent',
                  color: activeMenu === m.id ? '#60a5fa' : '#475569',
                }}
              >
                <span style={{ fontSize: 14 }}>{m.icon}</span>
                <span style={{ fontSize: 13, fontWeight: activeMenu === m.id ? 600 : 400, fontFamily: 'DM Sans, sans-serif' }}>
                  {m.label}
                </span>
                {activeMenu === m.id && (
                  <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: '#3b82f6' }} />
                )}
              </button>
            ))}
          </nav>

          {/* User */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
              }}>A</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Admin
                </div>
                <div style={{ fontSize: 10, color: '#334155', fontFamily: 'DM Mono, monospace' }}>Super Admin</div>
              </div>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
            </div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', animation: 'fadeIn 0.4s ease' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 2 }}>
                Overview
              </h1>
              <div style={{ fontSize: 12, color: '#334155', fontFamily: 'DM Mono, monospace' }}>
                2024.08.14 · 오전 10:32 업데이트
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <select style={{
                background: '#0f172a', border: '1px solid rgba(255,255,255,0.07)',
                color: '#94a3b8', padding: '8px 14px', borderRadius: 8, fontSize: 12,
                fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
              }}>
                <option>최근 30일</option>
              </select>
              <button style={{
                background: '#3b82f6', border: 'none', color: 'white',
                padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}>
                리포트 내보내기
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            {kpis.map((kpi) => (
              <div key={kpi.label} className="dash-kpi" style={{
                padding: '18px 20px', borderRadius: 14,
                background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#475569', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>{kpi.label}</div>
                  <span style={{ fontSize: 18 }}>{kpi.icon}</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: 'white', fontFamily: 'DM Sans, sans-serif', marginBottom: 6 }}>
                  {kpi.value}
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: kpi.up ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                  borderRadius: 6, padding: '2px 8px',
                  fontSize: 11, fontWeight: 700,
                  color: kpi.up ? '#10b981' : '#ef4444',
                  fontFamily: 'DM Mono, monospace',
                }}>
                  {kpi.up ? '↑' : '↓'} {kpi.change}
                </div>
              </div>
            ))}
          </div>

          {/* Chart + Progress */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, marginBottom: 24 }}>
            {/* Bar Chart */}
            <div style={{
              padding: '22px 24px', borderRadius: 14,
              background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'white', fontFamily: 'DM Sans, sans-serif' }}>
                  월별 매출 추이
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['1M', '3M', '6M', '1Y'].map((p) => (
                    <button key={p} style={{
                      background: p === '6M' ? '#1e3a5f' : 'transparent',
                      border: 'none', color: p === '6M' ? '#60a5fa' : '#334155',
                      padding: '3px 8px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                      fontFamily: 'DM Mono, monospace',
                    }}>{p}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 140 }}>
                {chartData.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{
                      width: '100%', borderRadius: '4px 4px 0 0',
                      background: i === chartData.length - 1
                        ? 'linear-gradient(180deg, #60a5fa, #3b82f6)'
                        : 'rgba(59,130,246,0.25)',
                      height: `${(d.value / maxVal) * 100}%`,
                      transition: 'height 0.6s ease',
                    }} />
                    <div style={{ fontSize: 9, color: '#334155', fontFamily: 'DM Mono, monospace' }}>{d.month}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div style={{
              padding: '22px 24px', borderRadius: 14,
              background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'white', fontFamily: 'DM Sans, sans-serif', marginBottom: 20 }}>
                채널별 전환율
              </div>
              {[
                { label: 'Organic Search', val: 78, color: '#3b82f6' },
                { label: 'Direct', val: 55, color: '#10b981' },
                { label: 'Social Media', val: 42, color: '#a855f7' },
                { label: 'Email', val: 34, color: '#f59e0b' },
                { label: 'Referral', val: 20, color: '#ec4899' },
              ].map((p) => (
                <div key={p.label} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'DM Sans, sans-serif' }}>{p.label}</span>
                    <span style={{ fontSize: 11, color: p.color, fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>{p.val}%</span>
                  </div>
                  <div style={{ height: 4, background: '#1e293b', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 2, background: p.color,
                      width: `${p.val}%`, opacity: 0.8,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Table */}
          <div style={{
            borderRadius: 14, background: '#0f172a',
            border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'white', fontFamily: 'DM Sans, sans-serif' }}>
                최근 활동
              </div>
              <button style={{
                background: 'none', border: '1px solid rgba(255,255,255,0.08)',
                color: '#475569', padding: '5px 12px', borderRadius: 6,
                fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}>전체 보기</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {['사용자', '활동', '시간', '상태'].map((h) => (
                    <th key={h} style={{
                      padding: '10px 20px', textAlign: 'left',
                      fontSize: 10, color: '#334155', fontFamily: 'DM Mono, monospace',
                      letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activities.map((a, i) => (
                  <tr key={i} className="dash-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '12px 20px', fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#60a5fa' }}>
                      {a.user}
                    </td>
                    <td style={{ padding: '12px 20px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#94a3b8' }}>
                      {a.action}
                    </td>
                    <td style={{ padding: '12px 20px', fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#334155' }}>
                      {a.time}
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{
                        display: 'inline-block',
                        width: 6, height: 6, borderRadius: '50%',
                        background: statusColor[a.status as keyof typeof statusColor],
                        boxShadow: `0 0 6px ${statusColor[a.status as keyof typeof statusColor]}`,
                      }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
