# 쟁승메이드 라이트 고craft 재설계 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 홈·외주·제품 3면을 라이트 `--jsm-*` 단일 시스템으로 통일하고, 히어로·쇼케이스를 코드 UI 목업(MockWindow)으로 재구성한다.

**Architecture:** 파티클(HeroField)·다크 토큰을 폐기하고, 재사용 가능한 라이트 `MockWindow` 목업 시스템을 craft의 핵심 비주얼로 삼는다. 3면이 동일한 컨테이너·타입 스케일·여백 리듬·카드 스펙을 공유한다. TopNav의 다크 라우트 분기를 제거해 전 페이지 단일 라이트 셸로 통일한다.

**Tech Stack:** Next.js 16 (App Router, 서버 컴포넌트 우선), TypeScript, Tailwind v4, Pretendard, vitest.

설계 문서: `docs/superpowers/specs/2026-06-30-jsm-light-redesign-design.md`

## Global Constraints

- 색: `--jsm-*` 라이트 토큰만. **금지** — `--jsm-dark-*`, `--kx-*`, 보라/violet, gradient, blur, 이모지.
- navy(`--jsm-navy`)는 푸터 + 홈 CTA 밴드 **2곳에서만** (평면, radial 없음).
- 컨테이너: `max-w-6xl mx-auto px-6 lg:px-8` (3면 동일).
- 한글: 헤딩·본문 `break-keep`. `KOR_TIGHT = letterSpacing -0.02em`, `KOR_BODY = -0.01em`.
- 타이포: h1 `clamp(2.4rem,7vw,4rem)` w800 -0.03em / h2 `clamp(1.7rem,4vw,2.4rem)` w700 -0.02em / eyebrow 11px UPPER 0.2em accent / 본문 16–18px ink-soft.
- 카피: 경력 어필("대기업 7년차" 류) 금지 → 운영 실증 표현 유지.
- 모션: `ScrollReveal`·`.reveal` CSS 유지, `prefers-reduced-motion` 가드.
- 각 Task 종료 시 `npm run build` 통과 + 커밋. 브랜치 `redesign/jsm-light-craft` (생성됨).
- 빌드 명령(Windows): `npm run build`. 테스트: `npm test`.

> **계획 altitude 주석:** 본 계획은 *재사용 빌딩블록*(MockWindow API·showcase 타입·테스트)은 완전한 코드로, *페이지 재작성*은 섹션 구조 + 정확한 토큰/클래스 규약 + 검증 게이트로 명세한다. 페이지 JSX 전문을 계획에 박지 않는 것은 의도된 결정이다(시각 레이아웃은 토큰·구조 제약으로 충분히 결정되며, 전문 박제는 중복·열화를 유발).

---

### Task 1: MockWindow 목업 시스템

**Files:**
- Create: `app/components/mock/MockWindow.tsx`
- Create: `app/components/mock/screens.tsx` (6 스크린 목업 한 파일 — 함께 변경되므로 동거)
- Create: `app/components/mock/registry.ts` (mock key → 컴포넌트 + 메타)

**Interfaces:**
- Produces:
  - `MockWindow({ title, accent?, children, className? }): JSX` — 브라우저 크롬 프레임(● ● ● 신호등 + 타이틀바 + 본문 슬롯). 서버 컴포넌트. 라이트(surface) + navy 타이틀바 옵션.
  - 스크린 컴포넌트(전부 서버, props 없음, 정적 마크업): `DashboardMock`, `FeedMock`, `MatchMock`, `CommerceMock`, `SiteMock`, `BookingMock`.
  - `MOCK_REGISTRY: Record<MockKey, React.ComponentType>` 및 `type MockKey = 'dashboard'|'feed'|'match'|'commerce'|'site'|'booking'`.

**MockWindow 규약 (완전 코드):**
```tsx
// app/components/mock/MockWindow.tsx
interface MockWindowProps {
  title: string;            // 타이틀바 텍스트 (예: 'stock-report', 'realestate-match')
  children: React.ReactNode;
  className?: string;
}
export default function MockWindow({ title, children, className }: MockWindowProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)] ${className ?? ''}`}
      style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
    >
      {/* 타이틀바 */}
      <div
        className="flex items-center gap-2 px-3.5 py-2.5 border-b"
        style={{ background: 'var(--jsm-surface-alt)', borderColor: 'var(--jsm-line)' }}
      >
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#e2e8f0' }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#e2e8f0' }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#e2e8f0' }} />
        </span>
        <span
          className="ml-1 font-mono text-[11px]"
          style={{ color: 'var(--jsm-ink-faint)', letterSpacing: '-0.01em' }}
        >
          {title}
        </span>
      </div>
      {/* 본문 */}
      <div className="p-4">{children}</div>
    </div>
  );
}
```

**스크린 목업 시각 명세** (`screens.tsx` — 각 컴포넌트가 그릴 요소; 전부 `--jsm-*`, SVG/div, 실데이터 0):
- `DashboardMock` — 상단 스탯 3칸(라벨+숫자, 1칸 accent 강조) + 막대 차트(div 높이 배열) 1개. "주식 리포트" 톤.
- `FeedMock` — 메시지 버블 3~4개(좌측 정렬, 시각·텍스트·체결/알림 배지). "텔레그램 봇" 톤.
- `MatchMock` — 리스트 행 3개(항목명 + 매칭률 배지 `92%` accent-soft) + 상단 필터칩. "부동산 청약" 톤.
- `CommerceMock` — 상품 카드 그리드 4(썸네일 박스 + 가격) + 장바구니 바.
- `SiteMock` — 기업 사이트 와이어(네비 바 + 큰 헤드라인 라인 2 + CTA 버튼 + 카드 3). "corporate/portfolio".
- `BookingMock` — 주간 캘린더 헤더(요일 7) + 슬롯 그리드(일부 accent 채움) + 예약 버튼.

**Steps:**
- [ ] **Step 1:** `MockWindow.tsx` 작성 (위 완전 코드).
- [ ] **Step 2:** `screens.tsx`에 6개 스크린 컴포넌트 작성 (위 시각 명세 따름, 각 `<div className="space-y-3">...` 라이트 마크업).
- [ ] **Step 3:** `registry.ts` 작성 — `MockKey` 타입 + `MOCK_REGISTRY` 매핑 export.
- [ ] **Step 4:** 빌드 검증. Run: `npm run build` — Expected: 성공(타입 에러 0).
- [ ] **Step 5:** 커밋. `git add app/components/mock && git commit -m "feat(redesign): MockWindow 라이트 목업 시스템(프레임+6스크린+레지스트리)"`

---

### Task 2: 쇼케이스 라이트 전환

**Files:**
- Modify: `lib/showcase.ts` (슬롯 타입을 mock 기반으로 교체)
- Modify: `app/components/deepfield/ShowcaseCard.tsx` (그래디언트/캔버스 → MockWindow 라이트 카드 재작성)
- Keep: `app/components/deepfield/ShowcaseGrid.tsx` (레이아웃 로직 유지, 카드만 교체)
- Test: `lib/__tests__/showcase.test.ts` (신규 — 가드레일 데이터 테스트)

**Interfaces:**
- Consumes: Task 1의 `MockKey`, `MOCK_REGISTRY`.
- Produces: `ShowcaseSlot { slug; label; title; desc; mock: MockKey; href? }` (palette/accent 제거). `SHOWCASE_SLOTS: ShowcaseSlot[]` (8슬롯, 보라 0).

**신규 슬롯 매핑** (보라 제거, mock 배정):
```
corporate → site   | commerce → commerce | dashboard → dashboard | bakery → booking
portfolio → site   | game → site         | interior → site       | reading → site
```
> 메모: site 목업이 다수 → 시각 단조 방지 위해 `SiteMock`에 variant prop(헤드라인 색/레이아웃 미세 차이) 추가 가능(선택). 1차는 단일 SiteMock로 진행, Task 7 검증 시 단조하면 variant 보강.

**Steps:**
- [ ] **Step 1 (테스트 먼저):** `lib/__tests__/showcase.test.ts` 작성 — 각 슬롯이 (a) `mock`이 유효한 MockKey, (b) `slug/title/desc` 비어있지 않음, (c) 어떤 필드에도 보라 hex(`#c4b5fd`,`#f0abfc`,`#341a4f`,`#4a1342`) 부재. (palette 필드 자체가 사라지므로 타입+값 검증.)
- [ ] **Step 2:** Run `npm test` — Expected: FAIL (showcase 타입에 mock 없음 / palette 잔존).
- [ ] **Step 3:** `lib/showcase.ts` 인터페이스·데이터를 mock 기반으로 교체.
- [ ] **Step 4:** `ShowcaseCard.tsx` 재작성 — 카드 = `MockWindow`(상단) + 하단 텍스트(eyebrow label·title·desc, href면 "데모 보기"). 캔버스/시드/그래디언트/보라 전량 제거. 라이트 카드. `'use client'` 불필요면 서버 컴포넌트로.
- [ ] **Step 5:** Run `npm test` — Expected: PASS. 이어서 `npm run build` — Expected: 성공.
- [ ] **Step 6:** 커밋. `git commit -am "feat(redesign): 쇼케이스 그래디언트 타일 → 라이트 MockWindow 카드 + 가드레일 테스트"`

---

### Task 3: TopNav 라이트 단일화

**Files:**
- Modify: `app/components/TopNav.tsx`

**Interfaces:**
- Consumes: 없음. Produces: 단일 라이트 네비(전 라우트 동일).

**변경:**
- `DARK_ROUTES`/`isDark` 분기 + 다크 팔레트 헬퍼(`ink/inkSoft/surface/line/accent/accentBg`의 isDark 삼항) 전량 제거 → 라이트 고정값.
- 최상단(미스크롤): 배경 transparent 유지(라이트 히어로 위 dark ink 텍스트로 가독) / 스크롤 시: `--jsm-surface` + `--jsm-line` border + 미세 shadow.
- 모바일 드로어 `surface` = `--jsm-surface` 고정.

**Steps:**
- [ ] **Step 1:** `isDark` 및 다크 분기 제거, 팔레트를 라이트 토큰 고정으로 치환.
- [ ] **Step 2:** Run `npm run build` — Expected: 성공.
- [ ] **Step 3:** 커밋. `git commit -am "feat(redesign): TopNav 다크 라우트 분기 제거 → 단일 라이트 네비"`

---

### Task 4: 홈 라이트 재구성 (`app/page.tsx`)

**Files:**
- Modify: `app/page.tsx` (전면 재작성)

**Interfaces:**
- Consumes: Task 1 `MockWindow`+스크린, Task 2 `ShowcaseGrid`/`SHOWCASE_SLOTS`, 기존 `getListedProducts`·`CountUp`·`ScrollReveal`.

**섹션 구조(배경 교차):**
1. HERO (surface) — 비대칭 2단: 좌(eyebrow `OUTSOURCING · SOFTWARE` / h1 "생각을 / 동작하는 소프트웨어로." / sub / CTA 2개: filled accent `프로젝트 문의`→`/outsourcing#contact`, ghost `소프트웨어 보기`→`/products`) · 우(`MockWindow title="stock-report"` 안에 `DashboardMock`). `-mt-16`/스크림/HeroField 전량 제거. 하단 신뢰 스트립(15+ 실서비스 · 24/7 · 원스톱) border-y row.
2. 2축 소개 (surface-alt) — `01 OUTSOURCING`/`02 SOFTWARE` 2카드(라벨·제목·요약·링크).
3. SHOWCASE (surface) — `ShowcaseGrid slots variant="home"` (6).
4. 운영 실증 (surface-alt) — PROOF 3카드 + 스탯(CountUp 15+/24·7/원스톱). 라이트 카드.
5. PROCESS (surface) — 4단계 + 가로 연결선.
6. 완성 SW (surface-alt) — featured 3(DB) / 0개 coming-soon 폴백, 라이트 카드.
7. CTA 밴드 (navy 평면) — "프로젝트, 이야기부터 시작하세요" + 흰 버튼.

**Steps:**
- [ ] **Step 1:** 다크 래퍼/HeroField/스크림 제거, 위 7섹션을 라이트 토큰으로 재작성. 모든 `--jsm-dark-*`/`accent-bright` → 라이트 대응(`--jsm-ink`/`ink-soft`/`accent`).
- [ ] **Step 2:** Run `npm run build` — Expected: 성공. (DB 0개 폴백 경로도 타입 통과 확인.)
- [ ] **Step 3:** 커밋. `git commit -am "feat(redesign): 홈 라이트 재구성 + 2축 복원 + 히어로 목업"`

---

### Task 5: 외주 라이트 전환 (`app/outsourcing/page.tsx` + 폼)

**Files:**
- Modify: `app/outsourcing/page.tsx`
- Modify: `app/components/OutsourcingRequestForm.tsx`

**Interfaces:**
- Consumes: Task 1·2 컴포넌트, 기존 `ScrollReveal`.

**변경:**
- 페이지: 다크 래퍼/HeroField/스크림 제거. 섹션 구조 유지(HERO·SHOWCASE 8·운영 실사례 6·제공분야 6·PROCESS 6·FAQ·CONTACT)를 라이트 토큰으로. 앵커(`#showcase`/`#portfolio`/`#process`/`#contact`) 유지. HERO 우측에 소형 `MockWindow`(`FeedMock` 등) 1개 추가(선택, 2단 비대칭).
- 폼: `INPUT_STYLE`·각 `--jsm-dark-*`/`accent-bright`/`rgba(96,165,250,..)` → 라이트(`--jsm-surface`/`--jsm-line`/`--jsm-ink`/`--jsm-accent`/`--jsm-accent-soft`). 래퍼 `className="jsm-dark-form"` 제거. 에러 박스(이미 라이트 `#fef2f2`)는 유지.

**Steps:**
- [ ] **Step 1:** `OutsourcingRequestForm.tsx`의 다크 토큰 전량 라이트 치환 + `jsm-dark-form` 제거.
- [ ] **Step 2:** `outsourcing/page.tsx` 라이트 재작성(구조 유지).
- [ ] **Step 3:** Run `npm run build` — Expected: 성공.
- [ ] **Step 4:** 커밋. `git commit -am "feat(redesign): 외주 페이지 + 의뢰폼 라이트 전환"`

---

### Task 6: 제품 craft 정렬 (`app/products/page.tsx`)

**Files:**
- Modify: `app/products/page.tsx`

**변경:** 이미 라이트 → `max-w-5xl`→`max-w-6xl`, 타입 스케일(h1 clamp·eyebrow·h2)·여백 리듬·카드(rounded-2xl·shadow-sm·hover) 를 홈과 동일 언어로 정렬. 교차 배경(surface↔surface-alt) 적용. 구조·카피 유지.

**Steps:**
- [ ] **Step 1:** 컨테이너·타입·카드 스펙을 공통 언어로 정렬.
- [ ] **Step 2:** Run `npm run build` — Expected: 성공.
- [ ] **Step 3:** 커밋. `git commit -am "feat(redesign): 제품 페이지 craft 정렬(공통 언어)"`

---

### Task 7: 죽은 CSS 제거 + 전체 검증 + 문서 정리

**Files:**
- Modify: `app/globals.css`
- Modify: `CLAUDE.md` (다크 토큰 언급 정리 — 가드레일 본문 변경 없음)

**변경 (globals.css 제거 대상):** `--jsm-dark-*` 토큰, `--kx-*` 매핑, `.kx-section/.kx-display/.kx-label/.kx-folder/.kx-glass/.kx-glow/.kx-btn-*/.kx-gradient-text/.kx-orb`, `.gradient-text`(보라), `.jsm-dark-form`, `.df-scroll-dot` + `@keyframes df-scroll-cue`. **유지:** `--jsm-*` 라이트, `@font-face`, `.reveal*`, `.marquee*`(사용처 grep 후 미사용이면 제거), 스크롤바, `.scrollbar-hide`, `.service-card`.

**Steps:**
- [ ] **Step 1:** `HeroField`/`useFieldMode` import 잔존 grep — Run: `grep -rn "HeroField\|useFieldMode\|jsm-dark\|--kx-\|gradient-text" app lib` — Expected: 코드(컴포넌트 파일 제외)에서 0건. 잔존 시 해당 파일 수정.
- [ ] **Step 2:** `globals.css`에서 위 제거 대상 삭제.
- [ ] **Step 3:** 가드레일 grep — Run: `grep -rn "jsm-dark\|--kx-\|#7c3aed\|#c4b5fd\|#f0abfc\|backdrop-filter\|blur(" app lib` — Expected: 0건(`globals.css` `.kx`/dark 제거 후).
- [ ] **Step 4:** Run `npm test` — Expected: PASS. 이어서 `npm run build` — Expected: 성공.
- [ ] **Step 5:** `CLAUDE.md` 디자인 시스템 섹션에서 다크 토큰 잔재 언급 정리(있다면).
- [ ] **Step 6:** 커밋. `git commit -am "chore(redesign): 죽은 다크/kx/보라 CSS 제거 + 가드레일 검증 통과"`

---

## Self-Review

**Spec coverage:**
- §3 시스템 기반 → Global Constraints + 각 Task. ✓
- §4 MockWindow → Task 1. ✓
- §5.1 홈 → Task 4. ✓ / §5.2 외주 → Task 5. ✓ / §5.3 제품 → Task 6. ✓
- §6 셸(TopNav/Footer) → Task 3 (Footer는 이미 navy 유지, 변경 없음 명시). ✓
- §7 정리 → Task 7. ✓
- §9 검증 기준 → Task 2(테스트)·Task 7(grep/build/test). ✓

**Placeholder scan:** 페이지 JSX 전문 미기재는 의도(계획 altitude 주석). 스크린 목업은 시각 명세로 구체화. 빌딩블록(MockWindow)·테스트는 완전 코드. TBD 없음.

**Type consistency:** `MockKey`/`MOCK_REGISTRY`(Task1) → `ShowcaseSlot.mock`(Task2)에서 동일 사용. `ShowcaseGrid`의 `variant`/`size`(home|full / feature|standard) 기존 시그니처 유지. ✓
