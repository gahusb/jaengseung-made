// 라이트 UI 목업 스크린 6종 (서버 컴포넌트, props 없음, 정적 마크업).
// MockWindow 본문에 들어가 "운영 중인 화면" 인상을 만든다. 실데이터 0, --jsm-* 만.

const ACCENT = 'var(--jsm-accent)';
const INK = 'var(--jsm-ink)';
const SOFT = 'var(--jsm-ink-soft)';
const FAINT = 'var(--jsm-ink-faint)';
const LINE = 'var(--jsm-line)';
const ALT = 'var(--jsm-surface-alt)';
const SOFTBG = 'var(--jsm-accent-soft)';

/** 1. 대시보드 — 주식 리포트 톤: 스탯 3 + 막대 차트 */
export function DashboardMock() {
  const bars = [38, 54, 30, 62, 46, 72, 58];
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg p-2.5" style={{ background: ALT }}>
          <p className="font-mono text-[10px]" style={{ color: FAINT }}>
            오늘 손익
          </p>
          <p className="mt-1 text-sm font-bold" style={{ color: ACCENT, letterSpacing: '-0.02em' }}>
            +2.4%
          </p>
        </div>
        <div className="rounded-lg p-2.5" style={{ background: ALT }}>
          <p className="font-mono text-[10px]" style={{ color: FAINT }}>
            체결
          </p>
          <p className="mt-1 text-sm font-bold" style={{ color: INK, letterSpacing: '-0.02em' }}>
            12건
          </p>
        </div>
        <div className="rounded-lg p-2.5" style={{ background: ALT }}>
          <p className="font-mono text-[10px]" style={{ color: FAINT }}>
            승률
          </p>
          <p className="mt-1 text-sm font-bold" style={{ color: INK, letterSpacing: '-0.02em' }}>
            68%
          </p>
        </div>
      </div>
      <div
        className="flex h-20 items-end gap-1.5 rounded-lg border p-2.5"
        style={{ borderColor: LINE }}
      >
        {bars.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${h}%`,
              background: i === 5 ? ACCENT : '#dbe3ee',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** 2. 피드 — 텔레그램 봇 톤: 메시지 버블 3 */
export function FeedMock() {
  const rows = [
    { t: '09:01', m: '매수 체결 · 삼성전자 12,400', tag: '체결', on: true },
    { t: '11:24', m: '목표가 도달 — 익절 알림', tag: '알림', on: false },
    { t: '15:30', m: '일일 손익 리포트 전송 완료', tag: '리포트', on: false },
  ];
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div
          key={r.t}
          className="flex items-start gap-2.5 rounded-lg p-2.5"
          style={{ background: ALT }}
        >
          <span className="mt-0.5 font-mono text-[10px]" style={{ color: FAINT }}>
            {r.t}
          </span>
          <p className="flex-1 text-[12px] leading-snug" style={{ color: INK, letterSpacing: '-0.01em' }}>
            {r.m}
          </p>
          <span
            className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold"
            style={
              r.on
                ? { color: ACCENT, background: SOFTBG }
                : { color: SOFT, background: 'var(--jsm-surface)' }
            }
          >
            {r.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

/** 3. 매칭 — 부동산 청약 톤: 필터칩 + 매칭률 리스트 3 */
export function MatchMock() {
  const chips = ['강남구', '85㎡↑', '신축'];
  const rows = [
    { n: '래미안 원베일리', s: '92%' },
    { n: '디에이치 퍼스티어', s: '88%' },
    { n: '아크로 포레스트', s: '81%' },
  ];
  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        {chips.map((c, i) => (
          <span
            key={c}
            className="rounded-full px-2.5 py-1 text-[11px] font-medium"
            style={
              i === 0
                ? { color: ACCENT, background: SOFTBG }
                : { color: SOFT, background: ALT }
            }
          >
            {c}
          </span>
        ))}
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.n}
            className="flex items-center justify-between rounded-lg border px-3 py-2.5"
            style={{ borderColor: LINE }}
          >
            <span className="text-[12px] font-medium" style={{ color: INK, letterSpacing: '-0.01em' }}>
              {r.n}
            </span>
            <span
              className="rounded px-1.5 py-0.5 font-mono text-[11px] font-bold"
              style={{ color: ACCENT, background: SOFTBG }}
            >
              {r.s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 4. 커머스 — 상품 그리드 4 + 장바구니 바 */
export function CommerceMock() {
  const items = [
    { p: '₩28,000' },
    { p: '₩45,000' },
    { p: '₩19,000' },
    { p: '₩36,000' },
  ];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {items.map((it, i) => (
          <div key={i} className="rounded-lg border p-2" style={{ borderColor: LINE }}>
            <div className="h-9 rounded-md" style={{ background: ALT }} />
            <p className="mt-1.5 text-[11px] font-bold" style={{ color: INK, letterSpacing: '-0.02em' }}>
              {it.p}
            </p>
          </div>
        ))}
      </div>
      <div
        className="flex items-center justify-between rounded-lg px-3 py-2.5"
        style={{ background: INK }}
      >
        <span className="text-[11px] font-medium text-white/80">장바구니 3 · ₩128,000</span>
        <span
          className="rounded px-2 py-1 text-[11px] font-semibold"
          style={{ background: ACCENT, color: '#fff' }}
        >
          결제
        </span>
      </div>
    </div>
  );
}

/** 5. 사이트 — 기업/포트폴리오 와이어: 네비 + 헤드라인 + 카드 3 */
export function SiteMock() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: ACCENT }} />
        <div className="flex gap-3">
          <span className="h-1.5 w-6 rounded-full" style={{ background: LINE }} />
          <span className="h-1.5 w-6 rounded-full" style={{ background: LINE }} />
          <span className="h-1.5 w-6 rounded-full" style={{ background: LINE }} />
        </div>
        <span className="h-4 w-10 rounded" style={{ background: ALT }} />
      </div>
      <div className="space-y-1.5 py-1">
        <span className="block h-3 w-3/4 rounded" style={{ background: '#cbd5e1' }} />
        <span className="block h-3 w-1/2 rounded" style={{ background: ACCENT }} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-lg border p-2" style={{ borderColor: LINE }}>
            <div className="h-6 rounded" style={{ background: ALT }} />
            <span className="mt-1.5 block h-1.5 w-full rounded-full" style={{ background: LINE }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** 6. 예약 — 로컬 매장 톤: 주간 캘린더 + 슬롯 그리드 */
export function BookingMock() {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  // 0=빈 1=예약됨(accent) 2=불가(alt)
  const slots = [
    1, 0, 0, 1, 0, 2, 2,
    0, 1, 0, 0, 1, 1, 2,
    0, 0, 1, 0, 0, 1, 0,
  ];
  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => (
          <span key={d} className="text-center font-mono text-[10px]" style={{ color: FAINT }}>
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {slots.map((s, i) => (
          <span
            key={i}
            className="aspect-square rounded"
            style={{
              background: s === 1 ? ACCENT : s === 2 ? ALT : 'var(--jsm-surface)',
              boxShadow: s === 0 ? `inset 0 0 0 1px ${LINE}` : undefined,
            }}
          />
        ))}
      </div>
      <div
        className="rounded-lg py-2 text-center text-[11px] font-semibold"
        style={{ background: SOFTBG, color: ACCENT }}
      >
        예약 확정 · 금 19:00
      </div>
    </div>
  );
}
