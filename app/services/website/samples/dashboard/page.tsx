'use client';

import Link from 'next/link';
import { useState } from 'react';

const kpis = [
  { label: '월 활성 사용자', value: '124,832', change: '+12.4%', up: true, color: '#3b82f6', sparkline: [40, 55, 45, 70, 60, 85, 100] },
  { label: '월 매출', value: '₩284M', change: '+8.7%', up: true, color: '#10b981', sparkline: [50, 60, 55, 75, 80, 78, 100] },
  { label: '전환율', value: '3.62%', change: '-0.3%', up: false, color: '#f59e0b', sparkline: [90, 80, 85, 75, 70, 72, 68] },
  { label: '고객 만족도', value: '4.8', change: '+0.2', up: true, color: '#8b5cf6', sparkline: [70, 72, 74, 76, 78, 80, 85] },
];

const lineData = [
  { month: 'Jan', revenue: 65, users: 48 },
  { month: 'Feb', revenue: 78, users: 55 },
  { month: 'Mar', revenue: 72, users: 52 },
  { month: 'Apr', revenue: 89, users: 64 },
  { month: 'May', revenue: 95, users: 71 },
  { month: 'Jun', revenue: 82, users: 66 },
  { month: 'Jul', revenue: 110, users: 88 },
  { month: 'Aug', revenue: 128, users: 100 },
];

const activities = [
  { user: 'lee@company.com', action: '프리미엄 플랜 구독', time: '2분 전', status: 'success', avatar: 'L' },
  { user: 'park@startup.io', action: 'API 한도 초과 경고', time: '14분 전', status: 'warning', avatar: 'P' },
  { user: 'kim@corp.kr', action: '팀 멤버 5명 초대', time: '31분 전', status: 'info', avatar: 'K' },
  { user: 'choi@brand.com', action: '결제 실패 (카드 만료)', time: '1시간 전', status: 'error', avatar: 'C' },
  { user: 'jung@agency.co', action: '새 워크스페이스 생성', time: '2시간 전', status: 'success', avatar: 'J' },
];

const menus = [
  { id: 'overview', label: 'Overview', dot: '#3b82f6' },
  { id: 'analytics', label: 'Analytics', dot: '#10b981' },
  { id: 'users', label: 'Users', dot: null },
  { id: 'revenue', label: 'Revenue', dot: null },
  { id: 'reports', label: 'Reports', dot: null },
  { id: 'settings', label: 'Settings', dot: null },
];

const channels = [
  { label: 'Organic Search', val: 78, color: '#3b82f6' },
  { label: 'Direct', val: 55, color: '#10b981' },
  { label: 'Social Media', val: 42, color: '#a855f7' },
  { label: 'Email', val: 34, color: '#f59e0b' },
  { label: 'Referral', val: 20, color: '#ec4899' },
];

const alerts = [
  { type: 'error', msg: 'API 응답 지연 (p99 > 2s)', time: '5분 전' },
  { type: 'warning', msg: '스토리지 사용량 85% 초과', time: '32분 전' },
  { type: 'success', msg: '일일 백업 완료', time: '1시간 전' },
];

const statusColor: Record<string, string> = { success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6' };

function SparkLine({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const h = 28;
  const w = 72;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <polyline points={`${pts} ${w},${h} 0,${h}`} fill={color} fillOpacity="0.08" stroke="none" />
    </svg>
  );
}

function LineChart({ data }: { data: typeof lineData }) {
  const chartH = 130;
  const chartW = 440;
  const padL = 32;
  const padB = 24;
  const innerW = chartW - padL;
  const innerH = chartH - padB;
  const maxRev = Math.max(...data.map(d => d.revenue));

  const revPts = data.map((d, i) => {
    const x = padL + (i / (data.length - 1)) * innerW;
    const y = (1 - d.revenue / maxRev) * innerH;
    return `${x},${y}`;
  }).join(' ');

  const usrPts = data.map((d, i) => {
    const x = padL + (i / (data.length - 1)) * innerW;
    const y = (1 - d.users / maxRev) * innerH;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <g key={i}>
          <line x1={padL} y1={t * innerH} x2={chartW} y2={t * innerH} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <text x={padL - 4} y={t * innerH + 4} textAnchor="end" fontSize="8" fill="#1e3a5f">
            {Math.round(maxRev * (1 - t))}
          </text>
        </g>
      ))}
      {/* Area fills */}
      <defs>
        <linearGradient id="grad-rev" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="grad-usr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`${revPts} ${chartW},${innerH} ${padL},${innerH}`} fill="url(#grad-rev)" stroke="none" />
      <polyline points={`${usrPts} ${chartW},${innerH} ${padL},${innerH}`} fill="url(#grad-usr)" stroke="none" />
      {/* Lines */}
      <polyline points={revPts} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={usrPts} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2" />
      {/* Dots at last point */}
      {[{ pts: revPts, color: '#3b82f6' }, { pts: usrPts, color: '#10b981' }].map(({ pts: p, color }) => {
        const last = p.split(' ').pop()!;
        const [lx, ly] = last.split(',').map(Number);
        return <circle key={color} cx={lx} cy={ly} r="3.5" fill={color} stroke="#0f172a" strokeWidth="2" />;
      })}
      {/* X axis labels */}
      {data.map((d, i) => (
        <text key={i} x={padL + (i / (data.length - 1)) * innerW} y={innerH + 16} textAnchor="middle" fontSize="8" fill="#334155">{d.month}</text>
      ))}
    </svg>
  );
}

export default function DashboardSample() {
  const [activeMenu, setActiveMenu] = useState('overview');
  const [alertsVisible, setAlertsVisible] = useState(true);

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', color: 'white' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .dash-menu-item:hover { background: rgba(255,255,255,0.05) !important; }
        .dash-menu-item { transition: background 0.15s; }
        .dash-kpi:hover { border-color: rgba(255,255,255,0.1) !important; transform: translateY(-2px); }
        .dash-kpi { transition: border-color 0.2s, transform 0.2s; cursor: default; }
        .dash-row:hover { background: rgba(255,255,255,0.03) !important; }
        .dash-row { transition: background 0.15s; }
        .quick-action:hover { background: rgba(59,130,246,0.12) !important; border-color: rgba(59,130,246,0.3) !important; }
        .quick-action { transition: background 0.2s, border-color 0.2s; cursor: pointer; }
      `}</style>

      {/* Back Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 200 }}>
        <Link href="/services/website" style={{ color: '#a5b4fc', fontSize: 13, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>
          ← 홈페이지 제작 서비스로 돌아가기
        </Link>
        <span style={{ color: '#4c1d95' }}>|</span>
        <span style={{ color: '#38bdf8', fontSize: 12, fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>
          SAMPLE · 관리자 대시보드
        </span>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 40px)' }}>
        {/* Sidebar */}
        <aside style={{ width: 220, background: '#060b18', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          {/* Logo */}
          <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* DF logo SVG */}
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
                  <rect x="0" y="0" width="7" height="6" rx="1" fill="white" opacity="0.9" />
                  <rect x="0" y="8" width="7" height="6" rx="1" fill="white" opacity="0.6" />
                  <rect x="9" y="0" width="7" height="14" rx="1" fill="white" opacity="0.4" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'white', fontFamily: 'DM Sans, sans-serif' }}>DataFlow</div>
                <div style={{ fontSize: 10, color: '#334155', fontFamily: 'DM Mono, monospace' }}>v2.4.1 · PRO</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ padding: '12px 10px 8px' }}>
            <div style={{ fontSize: 9, color: '#1e3a5f', fontFamily: 'DM Mono, monospace', letterSpacing: '0.15em', padding: '4px 10px 6px', textTransform: 'uppercase' }}>QUICK ACTIONS</div>
            <div style={{ display: 'flex', gap: 6, padding: '0 2px' }}>
              {[
                { label: 'Export', color: '#3b82f6' },
                { label: 'Invite', color: '#10b981' },
                { label: 'Alert', color: '#f59e0b' },
              ].map(a => (
                <button key={a.label} className="quick-action" style={{ flex: 1, padding: '6px 4px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)', background: 'transparent', color: a.color, fontSize: 10, fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '4px 10px', overflowY: 'auto' }}>
            <div style={{ fontSize: 9, color: '#1e3a5f', fontFamily: 'DM Mono, monospace', letterSpacing: '0.15em', padding: '8px 10px 4px', textTransform: 'uppercase' }}>MAIN</div>
            {menus.map((m) => (
              <button key={m.id} className="dash-menu-item" onClick={() => setActiveMenu(m.id)} style={{
                width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2,
                background: activeMenu === m.id ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: activeMenu === m.id ? '#60a5fa' : '#475569',
              }}>
                {/* Menu icon SVG */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <rect x="1" y="1" width="5" height="5" rx="1.5" fill={activeMenu === m.id ? '#60a5fa' : '#1e3a5f'} />
                  <rect x="8" y="1" width="5" height="5" rx="1.5" fill={activeMenu === m.id ? '#60a5fa' : '#1e3a5f'} opacity="0.6" />
                  <rect x="1" y="8" width="5" height="5" rx="1.5" fill={activeMenu === m.id ? '#60a5fa' : '#1e3a5f'} opacity="0.6" />
                  <rect x="8" y="8" width="5" height="5" rx="1.5" fill={activeMenu === m.id ? '#60a5fa' : '#1e3a5f'} opacity="0.4" />
                </svg>
                <span style={{ fontSize: 13, fontWeight: activeMenu === m.id ? 600 : 400, fontFamily: 'DM Sans, sans-serif', flex: 1 }}>
                  {m.label}
                </span>
                {m.dot && <div style={{ width: 4, height: 4, borderRadius: '50%', background: m.dot, animation: 'pulse-dot 2s infinite' }} />}
              </button>
            ))}
          </nav>

          {/* User */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>A</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin</div>
                <div style={{ fontSize: 10, color: '#334155', fontFamily: 'DM Mono, monospace' }}>Super Admin</div>
              </div>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
            </div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, overflowY: 'auto', animation: 'fadeIn 0.4s ease' }}>
          {/* Top bar */}
          <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#080d1a', position: 'sticky', top: 0, zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
                  <circle cx="7" cy="7" r="5" stroke="#334155" strokeWidth="1.5" />
                  <line x1="11" y1="11" x2="14" y2="14" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input placeholder="검색..." style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', padding: '7px 12px 7px 32px', borderRadius: 8, fontSize: 12, fontFamily: 'DM Sans, sans-serif', outline: 'none', width: 180 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <select style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.07)', color: '#94a3b8', padding: '7px 12px', borderRadius: 8, fontSize: 12, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}>
                <option>최근 30일</option>
              </select>
              {/* Alert bell */}
              <button onClick={() => setAlertsVisible(!alertsVisible)} style={{ position: 'relative', background: '#0f172a', border: '1px solid rgba(255,255,255,0.07)', padding: '7px 10px', borderRadius: 8, cursor: 'pointer', display: 'flex' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5C4.5 1.5 3 3.2 3 5.5v3L1.5 10.5h11L11 8.5v-3C11 3.2 9.5 1.5 7 1.5z" stroke="#94a3b8" strokeWidth="1.2" fill="none" />
                  <path d="M5.5 10.5a1.5 1.5 0 003 0" stroke="#94a3b8" strokeWidth="1.2" />
                </svg>
                <div style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: '50%', background: '#ef4444', border: '1.5px solid #080d1a' }} />
              </button>
              <button style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                리포트 내보내기
              </button>
            </div>
          </div>

          <div style={{ padding: '20px 24px' }}>
            {/* Alerts panel */}
            {alertsVisible && (
              <div style={{ marginBottom: 20, padding: '14px 18px', borderRadius: 12, background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'DM Sans, sans-serif' }}>시스템 알림</div>
                  <button onClick={() => setAlertsVisible(false)} style={{ background: 'none', border: 'none', color: '#334155', fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>닫기</button>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {alerts.map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: statusColor[a.type] + '10', border: `1px solid ${statusColor[a.type]}25`, flex: 1 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor[a.type], flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: '#e2e8f0', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.msg}</div>
                        <div style={{ fontSize: 10, color: '#334155', fontFamily: 'DM Mono, monospace' }}>{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Page header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 2 }}>Overview</h1>
                <div style={{ fontSize: 12, color: '#334155', fontFamily: 'DM Mono, monospace' }}>2024.08.14 · 오전 10:32 업데이트</div>
              </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
              {kpis.map((kpi) => (
                <div key={kpi.label} className="dash-kpi" style={{ padding: '16px 18px', borderRadius: 14, background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: '#475569', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, maxWidth: 80 }}>{kpi.label}</div>
                    <SparkLine data={kpi.sparkline} color={kpi.color} />
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'white', fontFamily: 'DM Sans, sans-serif', marginBottom: 6 }}>{kpi.value}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: kpi.up ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', borderRadius: 6, padding: '2px 7px', fontSize: 11, fontWeight: 700, color: kpi.up ? '#10b981' : '#ef4444', fontFamily: 'DM Mono, monospace' }}>
                    {kpi.up ? '↑' : '↓'} {kpi.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14, marginBottom: 18 }}>
              {/* Line Chart */}
              <div style={{ padding: '20px 22px', borderRadius: 14, background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'white', fontFamily: 'DM Sans, sans-serif' }}>월별 매출 & 사용자 추이</div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 20, height: 2, background: '#3b82f6', borderRadius: 2 }} />
                      <span style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace' }}>매출</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 20, height: 2, background: '#10b981', borderRadius: 2, backgroundImage: 'repeating-linear-gradient(90deg, #10b981 0, #10b981 4px, transparent 4px, transparent 6px)' }} />
                      <span style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace' }}>사용자</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['1M', '3M', '6M', '1Y'].map((p) => (
                        <button key={p} style={{ background: p === '6M' ? '#1e3a5f' : 'transparent', border: 'none', color: p === '6M' ? '#60a5fa' : '#334155', padding: '3px 7px', borderRadius: 5, fontSize: 10, cursor: 'pointer', fontFamily: 'DM Mono, monospace' }}>{p}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <LineChart data={lineData} />
              </div>

              {/* Channel Progress */}
              <div style={{ padding: '20px 22px', borderRadius: 14, background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'white', fontFamily: 'DM Sans, sans-serif', marginBottom: 18 }}>채널별 전환율</div>
                {channels.map((p) => (
                  <div key={p.label} style={{ marginBottom: 13 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'DM Sans, sans-serif' }}>{p.label}</span>
                      <span style={{ fontSize: 11, color: p.color, fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>{p.val}%</span>
                    </div>
                    <div style={{ height: 4, background: '#1e293b', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                      <div style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${p.color}90, ${p.color})`, width: `${p.val}%` }} />
                    </div>
                  </div>
                ))}
                {/* Donut summary */}
                <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <svg width="52" height="52" viewBox="0 0 52 52">
                    {(() => {
                      const total = channels.reduce((s, c) => s + c.val, 0);
                      let offset = 0;
                      const r = 20;
                      const circ = 2 * Math.PI * r;
                      return channels.map((c) => {
                        const dash = (c.val / total) * circ;
                        const el = (
                          <circle key={c.label} cx="26" cy="26" r={r} fill="none" stroke={c.color} strokeWidth="8"
                            strokeDasharray={`${dash} ${circ - dash}`}
                            strokeDashoffset={-offset}
                            transform="rotate(-90 26 26)"
                            style={{ transition: 'stroke-dasharray 0.5s' }} />
                        );
                        offset += dash;
                        return el;
                      });
                    })()}
                    <circle cx="26" cy="26" r="12" fill="#0f172a" />
                    <text x="26" y="29" textAnchor="middle" fontSize="8" fill="#60a5fa" fontWeight="700">ALL</text>
                  </svg>
                  <div style={{ fontSize: 11, color: '#475569', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 }}>
                    Organic 채널이<br />
                    <span style={{ color: '#3b82f6', fontWeight: 700 }}>최고 전환율 78%</span><br />
                    달성 중
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Table */}
            <div style={{ borderRadius: 14, background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'white', fontFamily: 'DM Sans, sans-serif' }}>최근 활동</div>
                <button style={{ background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: '#475569', padding: '5px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>전체 보기</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {['사용자', '활동', '시간', '상태'].map((h) => (
                      <th key={h} style={{ padding: '9px 18px', textAlign: 'left', fontSize: 9, color: '#334155', fontFamily: 'DM Mono, monospace', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activities.map((a, i) => (
                    <tr key={i} className="dash-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.025)' }}>
                      <td style={{ padding: '11px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 26, height: 26, borderRadius: '50%', background: `hsl(${i * 60}, 60%, 40%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{a.avatar}</div>
                          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#60a5fa' }}>{a.user}</span>
                        </div>
                      </td>
                      <td style={{ padding: '11px 18px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#94a3b8' }}>{a.action}</td>
                      <td style={{ padding: '11px 18px', fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#334155' }}>{a.time}</td>
                      <td style={{ padding: '11px 18px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: statusColor[a.status] + '12', borderRadius: 6, padding: '3px 8px' }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor[a.status] }} />
                          <span style={{ fontSize: 10, color: statusColor[a.status], fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>
                            {a.status === 'success' ? 'OK' : a.status === 'warning' ? 'WARN' : a.status === 'error' ? 'ERR' : 'INFO'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
