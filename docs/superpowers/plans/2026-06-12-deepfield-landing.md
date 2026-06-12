# Deep Field 랜딩 경험 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **비주얼 태스크(4·5·7·8)는 구현 시 `designer` + `soft-skill` 스킬 로드 필수.**

**Goal:** 메인(/)·/outsourcing을 "Deep Field" 다크 캔버스로 재구성 — WebGL 커서 반응 히어로 + 몰입형 쇼케이스(주인공) + 스크롤 연출, 3단계 성능 폴백 내장.

**Architecture:** 다크 토큰 6종을 기존 jsm 체계에 추가(라이트 토큰 무수정). WebGL은 `app/components/deepfield/`에 격리된 클라이언트 경계 — 페이지는 서버 컴포넌트 유지, three.js는 dynamic import. 모드 판정(`full|lite|static`)은 순수 함수(`lib/deepfield-mode.ts`)로 TDD. 쇼케이스 데이터는 `lib/showcase.ts` 단일 소스(8슬롯, href 있는 슬롯만 클릭 가능).

**Tech Stack:** Next.js 16, three.js(코어만, dynamic import), Tailwind v4, vitest

**Spec:** `docs/superpowers/specs/2026-06-12-deep-field-landing-design.md`
**Branch:** `feature/deepfield-landing`

---

## 카피 절대 규칙 (전 태스크 공통)

"7년차", "대기업" 등 경력·소속 표현 **금지** — 신규 카피·metadata·jsonLd 전부. 신뢰 축은 "24시간 돌아가는 실서비스 15+를 직접 설계·운영" ([[feedback-copy-no-career-emphasis]]).

## 무수정 금지선 (전 태스크 공통)

OutsourcingRequestForm 로직·검증·API / products 동적 연동 로직(`loadFeaturedProducts`) / 라우팅·redirect / 거래·계정·admin 페이지 / TopNav auth 로직.

---

### Task 1: 기반 — three 설치 + 다크 토큰 + 쇼케이스 데이터

**Files:**
- Modify: `package.json` (`npm install three @types/three`)
- Modify: `app/globals.css` (다크 토큰 6종 추가 — 기존 토큰 무수정)
- Create: `lib/showcase.ts`

- [ ] **Step 1:** `npm install three` + `npm install -D @types/three`
- [ ] **Step 2:** `app/globals.css`의 `:root`에 추가 (기존 jsm 라이트 토큰 아래):

```css
  /* === Deep Field dark tokens (2026-06 랜딩 경험) — 라이트 토큰과 공존 === */
  --jsm-dark-bg: #070d1a;
  --jsm-dark-surface: rgba(255, 255, 255, 0.03);
  --jsm-dark-line: rgba(148, 163, 184, 0.14);
  --jsm-dark-ink: #f8fafc;
  --jsm-dark-soft: #94a3b8;
  --jsm-accent-bright: #60a5fa;
```

- [ ] **Step 3:** `lib/showcase.ts`:

```typescript
/** Deep Field 쇼케이스 8슬롯 — 단일 소스.
 *  href가 있는 슬롯만 클릭 가능 (샘플 리뉴얼 완료 시 href 추가). */
export interface ShowcaseSlot {
  slug: string;
  label: string;       // 모노스페이스 컨셉 라벨 (영문)
  title: string;       // 카드 타이틀 (한글)
  desc: string;        // 한 줄 설명
  palette: [string, string]; // 카드 고유 그래디언트 월드 [from, to]
  accent: string;      // 카드 포인트 컬러
  href?: string;       // 리뉴얼 완료된 샘플의 데모 링크
}

export const SHOWCASE_SLOTS: ShowcaseSlot[] = [
  { slug: 'corporate', label: 'corporate',  title: '기업 브랜드 사이트',  desc: '신뢰를 첫인상으로 — 브랜드 스토리와 IR까지', palette: ['#13203a', '#0d2c54'], accent: '#60a5fa' },
  { slug: 'shopping',  label: 'commerce',   title: '커머스 스토어',       desc: '탐색부터 결제까지 끊김 없는 구매 동선',        palette: ['#1a1430', '#341a4f'], accent: '#c4b5fd' },
  { slug: 'dashboard', label: 'dashboard',  title: '데이터 대시보드',     desc: '실시간 지표를 한눈에 — 의사결정용 화면',        palette: ['#0f2922', '#14503c'], accent: '#6ee7b7' },
  { slug: 'bakery',    label: 'local shop', title: '로컬 매장 사이트',    desc: '예약·주문이 자연스러운 동네 가게의 얼굴',       palette: ['#2b1a10', '#4f2d14'], accent: '#fdba74' },
  { slug: 'portfolio', label: 'portfolio',  title: '포트폴리오',          desc: '작업물이 주인공이 되는 미니멀 갤러리',          palette: ['#101418', '#23272d'], accent: '#e2e8f0' },
  { slug: 'game',      label: 'game',       title: '게임 프로모션',       desc: '세계관에 빠져들게 하는 런칭 페이지',            palette: ['#250f23', '#4a1342'], accent: '#f0abfc' },
  { slug: 'interior',  label: 'interior',   title: '인테리어 스튜디오',   desc: '공간의 톤을 그대로 옮긴 쇼룸',                  palette: ['#1f2218', '#3a4028'], accent: '#d9f99d' },
  { slug: 'reading',   label: 'editorial',  title: '에디토리얼·매거진',   desc: '읽는 경험을 설계한 콘텐츠 사이트',              palette: ['#101b2b', '#1f3a5f'], accent: '#93c5fd' },
];
```

(컨셉·팔레트는 기존 샘플 8종의 주제를 승계 — 각 샘플 page.tsx를 열어 주제가 맞는지 확인하고 어긋나면 title/desc만 조정)

- [ ] **Step 4:** `npm test`(10) + `npm run build` 통과
- [ ] **Step 5:** Commit — `feat(deepfield): three.js + 다크 토큰 + 쇼케이스 8슬롯 데이터`

---

### Task 2: 모드 판정 (TDD) + WebGL 지원 훅

**Files:**
- Create: `lib/deepfield-mode.ts`
- Test: `lib/__tests__/deepfield-mode.test.ts`
- Create: `app/components/deepfield/useFieldMode.ts`

- [ ] **Step 1: 실패 테스트** — `lib/__tests__/deepfield-mode.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { decideFieldMode } from '@/lib/deepfield-mode';

const base = { reducedMotion: false, webglSupported: true, hardwareConcurrency: 8, viewportWidth: 1440 };

describe('decideFieldMode', () => {
  it('데스크톱 + WebGL = full', () => {
    expect(decideFieldMode(base)).toBe('full');
  });
  it('reduced-motion이면 무조건 static', () => {
    expect(decideFieldMode({ ...base, reducedMotion: true })).toBe('static');
    expect(decideFieldMode({ ...base, reducedMotion: true, viewportWidth: 375 })).toBe('static');
  });
  it('WebGL 미지원이면 static', () => {
    expect(decideFieldMode({ ...base, webglSupported: false })).toBe('static');
  });
  it('모바일 뷰포트(<768)는 lite', () => {
    expect(decideFieldMode({ ...base, viewportWidth: 767 })).toBe('lite');
  });
  it('저성능 코어(<4)는 lite', () => {
    expect(decideFieldMode({ ...base, hardwareConcurrency: 2 })).toBe('lite');
  });
  it('hardwareConcurrency 미보고(0/undefined)는 lite로 보수적 판정', () => {
    expect(decideFieldMode({ ...base, hardwareConcurrency: 0 })).toBe('lite');
  });
});
```

- [ ] **Step 2:** `npm test` → FAIL 확인
- [ ] **Step 3: 구현** — `lib/deepfield-mode.ts`:

```typescript
export type FieldMode = 'full' | 'lite' | 'static';

export interface FieldEnv {
  reducedMotion: boolean;
  webglSupported: boolean;
  hardwareConcurrency: number; // 미보고 시 0
  viewportWidth: number;
}

/** Deep Field 렌더 모드 판정 — 우선순위: 접근성 > 지원 여부 > 성능 */
export function decideFieldMode(env: FieldEnv): FieldMode {
  if (env.reducedMotion) return 'static';
  if (!env.webglSupported) return 'static';
  if (env.viewportWidth < 768) return 'lite';
  if (!env.hardwareConcurrency || env.hardwareConcurrency < 4) return 'lite';
  return 'full';
}
```

- [ ] **Step 4:** `npm test` → 16 passed (기존 10 + 신규 6)
- [ ] **Step 5: 훅** — `app/components/deepfield/useFieldMode.ts` ('use client'):

```typescript
'use client';

import { useEffect, useState } from 'react';
import { decideFieldMode, type FieldMode } from '@/lib/deepfield-mode';

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/** SSR/첫 페인트는 'static'으로 시작 — 클라이언트에서 승격 (hydration 불일치 방지) */
export function useFieldMode(): FieldMode {
  const [mode, setMode] = useState<FieldMode>('static');
  useEffect(() => {
    setMode(
      decideFieldMode({
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        webglSupported: detectWebGL(),
        hardwareConcurrency: navigator.hardwareConcurrency ?? 0,
        viewportWidth: window.innerWidth,
      }),
    );
  }, []);
  return mode;
}
```

- [ ] **Step 6:** `npm run build` 통과 → Commit — `feat(deepfield): 렌더 모드 판정(TDD) + useFieldMode 훅`

---

### Task 3: `ScrollReveal` 공용 연출 컴포넌트

**Files:**
- Create: `app/components/deepfield/ScrollReveal.tsx`

- [ ] **Step 1:** 'use client' 컴포넌트 — IntersectionObserver 기반:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  /** 등장 지연(ms) — 연속 항목 스태거용 */
  delay?: number;
  /** 'fade-up'(기본) | 'fade' | 'draw'(선 그리기용 — width 확장) */
  variant?: 'fade-up' | 'fade' | 'draw';
  className?: string;
}

export default function ScrollReveal({ children, delay = 0, variant = 'fade-up', className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // reduced-motion: 즉시 표시 (연출 생략)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden =
    variant === 'fade' ? 'opacity-0' :
    variant === 'draw' ? 'opacity-0 [transform:scaleX(0)] origin-left' :
    'opacity-0 translate-y-6';

  return (
    <div
      ref={ref}
      className={`${className ?? ''} transition-all duration-700 ease-out ${shown ? 'opacity-100 translate-y-0 [transform:none]' : hidden}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2:** `npm run build` 통과 → Commit — `feat(deepfield): ScrollReveal 스크롤 연출 컴포넌트`

---

### Task 4: `HeroField` — WebGL 커서 반응 파티클 필드

> **designer + soft-skill 로드 필수.** 가장 중요한 비주얼 태스크.

**Files:**
- Create: `app/components/deepfield/HeroField.tsx`

**요구 동작:**
- props: `{ className?: string }` — 히어로 섹션의 절대배치 배경 캔버스
- `useFieldMode()`로 모드 결정:
  - **static**: 캔버스 미기동 — `--jsm-dark-bg` 위 정적 radial 그래디언트(accent 30~40% 불투명 2개 광원) div 렌더. 이것만으로도 완성된 비주얼이어야 함
  - **lite**: 파티클 수 full의 1/4, 커서 반응 비활성(자동 드리프트만), DPR 1 고정
  - **full**: 파티클 포인트 필드(2,000~4,000pt) — 커서 위치를 향해 자기장처럼 휘는 변위(셰이더 uniform으로 마우스 전달), 미세 드리프트, 스크롤 진행도(uniform)에 따라 필드가 흩어짐
- **three.js는 `await import('three')`로 dynamic import** — 모듈 상단 정적 import 금지
- 색: 파티클은 `#60a5fa`~`#1d4ed8` 범위, 배경은 투명(섹션 bg가 비침)
- 정리: 언마운트 시 renderer.dispose()+geometry/material dispose, `document.visibilityState` hidden 시 rAF 정지, IntersectionObserver로 화면 밖이면 정지
- 마우스 추적은 window 리스너(passive), rAF 내에서 lerp로 부드럽게
- 캔버스에 `aria-hidden="true"`, pointer-events 없음

- [ ] **Step 1:** 컴포넌트 구현 (위 3모드)
- [ ] **Step 2:** `npm run build` 통과 + 임시 검증: dev 서버에서 컴포넌트를 임시로 메인에 올리지 말고, Task 6에서 통합 검증 (이 태스크는 build·타입 통과까지)
- [ ] **Step 3:** Commit — `feat(deepfield): HeroField WebGL 파티클 필드 (full/lite/static)`

---

### Task 5: `ShowcaseGrid` + `ShowcaseCard`

> **designer + soft-skill 로드 필수.**

**Files:**
- Create: `app/components/deepfield/ShowcaseCard.tsx`
- Create: `app/components/deepfield/ShowcaseGrid.tsx`

**ShowcaseCard** — props `{ slot: ShowcaseSlot, size?: 'feature' | 'standard', index: number }`:
- 카드 비주얼 = 슬롯 palette 그래디언트 월드 + 절제된 제너러티브 패턴(슬롯별로 달라 보이게 — slug를 시드로 한 캔버스 2D 패턴: 격자/등고선/도트 등 2~3종 변형). WebGL 필수 아님 — **카드 타일은 Canvas2D로 충분** (성능·단순성). hover 시:
  - full 모드: 타일이 미세 굴절(translate+scale 1.03)되고 패턴이 커서 방향으로 시차 이동 (CSS transform + mousemove 기반 — 카드당 WebGL 인스턴스 금지)
  - lite/static: CSS 전환만 (border accent 점등 + 살짝 lift)
- 텍스트: 모노스페이스 label(accent 컬러) + 한글 title(굵게) + desc 1줄
- `slot.href` 있으면 `<Link>` 래핑 + "데모 보기 →" 표시 / 없으면 비클릭(커서 default, hover는 동일하게 동작 — "준비 중" 라벨 금지)
- `aria-label` = title

**ShowcaseGrid** — props `{ slots: ShowcaseSlot[], variant: 'home' | 'full' }`:
- `home`: 상위 6슬롯, 비대칭 그리드 — 1번 feature(2col), 2·3 standard, 4 feature, 5·6 standard (데스크톱 3col 기준 / 모바일 1col 스택). 각 카드는 `ScrollReveal`로 스태거 등장(delay = index*80)
- `full`: 8슬롯 전체, 2col 균등(모바일 1col)
- 서버에서 import 가능하도록 그리드 자체는 서버 컴포넌트, 카드만 'use client'

- [ ] **Step 1:** ShowcaseCard 구현 (Canvas2D 패턴 + hover)
- [ ] **Step 2:** ShowcaseGrid 구현
- [ ] **Step 3:** `npm run build` 통과 → Commit — `feat(deepfield): 쇼케이스 카드·그리드 (제너러티브 타일 + 호버 시차)`

---

### Task 6: TopNav route-aware 다크 모드

**Files:**
- Modify: `app/components/TopNav.tsx`

- [ ] **Step 1:** `usePathname()`으로 다크 페이지 판정:

```typescript
const DARK_ROUTES = ['/', '/outsourcing'];
const isDark = DARK_ROUTES.includes(pathname) || pathname.startsWith('/outsourcing/');
```

- 다크 페이지: 기본 투명 배경 + `--jsm-dark-ink` 텍스트, 스크롤 시 `rgba(7,13,26,0.85)` 배경 + `--jsm-dark-line` 하단 보더. 로고·링크·CTA 색상도 다크 팔레트(accent-bright 활성)
- 라이트 페이지: **기존 동작 그대로** (흰 배경 전환)
- 모바일 드로어: 다크 페이지에서는 다크 패널(`--jsm-dark-bg`), 라이트에서는 기존 흰 패널
- **auth 로직(getSession/onAuthStateChange/handleLogout)·접근성 속성(aria-expanded/Esc/dialog) 무수정**

- [ ] **Step 2:** `npm run build` + dev에서 `/products`(라이트)·`/`(다크 예정 — 아직 페이지는 라이트지만 네비만 다크 톤이 되는 과도기 OK, Task 7과 같은 PR이므로 순서상 문제 없음) 컴파일 확인
- [ ] **Step 3:** Commit — `feat(nav): 다크 라우트 인지형 네비게이션`

---

### Task 7: 메인(/) Deep Field 재조립 + 카피·메타 교체

> **designer + soft-skill 로드 필수.** 스펙 §2의 5섹션 구조.

**Files:**
- Modify: `app/page.tsx` (전면 재구성 — products 동적 로직 `loadFeaturedProducts`는 그대로 이식)
- Modify: `app/layout.tsx` (metadata description·jsonLd에서 경력 표현 제거 — 구조 무수정)
- Modify: `app/components/PublicShell.tsx` (main 배경이 페이지별로 다크/라이트 — main의 고정 `--jsm-bg` 인라인 배경을 제거하고 페이지가 자기 배경을 그리도록, 또는 route-aware. 푸터·KakaoFloatButton 무수정)

**섹션 구성 (승인된 목업 기준):**
1. **HERO** — min-h-[100svh] 풀스크린. `HeroField` 배경 + 거대 타이포: "생각을\n동작하는 소프트웨어로." (디자인 스킬로 다듬기 허용 — 단 경력 표현 금지). 서브 1줄: "24시간 돌아가는 실서비스를 직접 설계하고 운영합니다. 외주 개발도, 완성 소프트웨어도 — 같은 손으로." CTA 2개([프로젝트 문의 → /outsourcing#contact] accent 솔리드 / [소프트웨어 보기 → /products] 다크 고스트). 하단 스크롤 큐(미세 바운스 화살표)
2. **SHOWCASE** — "이런 걸 만들어 드립니다" + `<ShowcaseGrid slots={SHOWCASE_SLOTS} variant="home" />` + [전체 레퍼런스 → /outsourcing#showcase]
3. **PROCESS** — 4단계(기존 카피 유지: 상담→견적 2일→주1회 공유→납품+30일 하자보수), ScrollReveal `draw`로 연결선 + 스태거 점등
4. **PROOF** — 운영 시스템 3종 카드(주식 자동매매/청약 자동 매칭/AI 콘텐츠 파이프라인 — 기존 카피 재사용 가능) + 스탯: "실서비스 15+" "24/7 무중단 운영" "기획→배포 원스톱" (스크롤 진입 시 카운트업은 ScrollReveal + 간단한 useEffect 카운터, reduced-motion 시 즉시 최종값)
5. **SOFTWARE + CTA** — `loadFeaturedProducts` 동적 연동 그대로(라이트 카드가 다크 위에 뜨는 대비), 빈 상태 폴백 유지. 최종 CTA 밴드(accent)

- metadata: title 유지, description → "24시간 돌아가는 실서비스를 직접 설계·운영하는 개발 스튜디오. 맞춤 외주 개발과 검증된 완성 소프트웨어." / jsonLd Person·LocalBusiness description에서 "7년차" 제거, jobTitle "소프트웨어 엔지니어"로
- 전체 페이지 배경 `--jsm-dark-bg`, 텍스트 다크 토큰. 가드레일: gradient는 **Deep Field 광원 표현에 한해 radial 그래디언트 허용**(다크 캔버스의 일부 — 기존 "그래디언트 금지"의 의도는 generic AI 보라 그라데이션 차단이었음), 보라 금지 유지(쇼케이스 palette의 컨셉 컬러는 예외 — 카드 월드 한정), blur 금지, 이모지 금지

- [ ] **Step 1:** 페이지 재조립 + 카피 교체
- [ ] **Step 2:** `npm run build` + dev: `/` 200, "7년차"·"대기업" grep 0건(app/page.tsx·app/layout.tsx), products 폴백 동작
- [ ] **Step 3:** Commit — `feat(home): Deep Field 다크 캔버스 재조립 + 운영 실증 카피`

---

### Task 8: /outsourcing Deep Field 재스킨

> **designer + soft-skill 로드 필수.**

**Files:**
- Modify: `app/outsourcing/page.tsx`
- Modify(스타일만): `app/components/OutsourcingRequestForm.tsx`

- [ ] **Step 1:** 페이지를 다크 토큰으로 재스킨:
  - Hero 축약(타이포+간단 필드 배경 — HeroField 재사용 가능, 높이 60vh)
  - `#showcase` 섹션 신설: `<ShowcaseGrid slots={SHOWCASE_SLOTS} variant="full" />` — 기존 #portfolio 위치에 배치하고 `id="showcase"`와 `id="portfolio"` 모두 도달 가능하게(섹션에 showcase, 내부 앵커 div에 portfolio)
  - 기존 실사례 6건(운영 시스템)은 PROOF 스타일 카드로 유지
  - 제공 분야·프로세스·FAQ를 다크 카드로 재스킨 (카피 무수정)
  - `#contact` 의뢰 폼: OutsourcingRequestForm을 다크 스킨으로 — **INPUT_STYLE 상수·카드 배경 등 스타일 값만 변경, 로직·검증·API·단계 구조 무수정** (goNext 스테일 클로저 경고 주석 보존)
- [ ] **Step 2:** `npm run build` + dev: `/outsourcing` 200, 앵커 3+1종(process/portfolio/showcase/contact) 존재, 폼 1단계 카드 렌더
- [ ] **Step 3:** Commit — `feat(outsourcing): Deep Field 재스킨 + 쇼케이스 풀 그리드`

---

### Task 9: E2E + 성능 검증

- [ ] **Step 1: 자동** — `npm test`(16) + `npm run build` + prod 서버 curl:
  - `/` 200 + 새 히어로 카피 존재 + "7년차|대기업" 0건 / `/outsourcing` 200 + id="showcase" / 폼 마크업 존재
  - 회귀: `/products` 200(라이트 유지), `/work/saju` 404, `/music/packs` 308, POST `/api/contact` 빈 body 400, `/api/orders` 401, `/track/x` 404
  - 번들 확인: `.next` 빌드 출력에서 `/` 페이지 First Load JS — three.js가 별도 청크인지(메인 First Load에 포함 안 됨), 합계가 과도하지 않은지 보고
- [ ] **Step 2: 수동 체크리스트 (CEO + 컨트롤러)**
  - 데스크톱: 히어로 커서 반응·쇼케이스 hover 시차·스크롤 연출·카운터
  - 모바일 375px: lite 모드(드리프트만), 레이아웃
  - DevTools에서 prefers-reduced-motion 에뮬레이션 → 정적 폴백이 그 자체로 완성돼 보이는지
  - 탭 비활성 시 CPU 사용 0 근접 확인
  - 의뢰 폼 4단계 제출 회귀 1회
- [ ] **Step 3:** 최종 보고

---

## 후속 (별도 스펙·플랜)

샘플 8종 Deep Field 컨셉 리뉴얼 — 2개씩 4회차, 완료 슬롯마다 `lib/showcase.ts`에 href 추가로 활성화.
