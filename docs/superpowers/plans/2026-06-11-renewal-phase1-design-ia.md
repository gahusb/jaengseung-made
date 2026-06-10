# 사이트 리뉴얼 Phase 1 — 디자인 시스템 + IA 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **UI 페이지 태스크(5~8)는 구현 시 반드시 `designer` + `soft-skill` 스킬을 먼저 로드**하여 generic AI 패턴(과한 그래디언트·글래스모피즘·보라색 남용)을 차단할 것.

**Goal:** 쟁승메이드를 "외주 개발 + 완성 소프트웨어 판매" 2축의 전문 B2B 에이전시 사이트로 풀 리디자인하고, 기존 서비스(사주·음악·로또·설문)를 admin 전용 숨김 처리한다.

**Architecture:** 기존 다크 글래스 `--kx-*` 토큰 체계를 라이트 slate+딥블루 전문 토큰으로 전면 교체. Jua → Pretendard. 숨김은 `service_settings` 토글 + 서버 레이아웃 가드(admin_token 쿠키 예외). 페이지는 기존 라우트 구조 위에서 교체하며 web-backend·결제 로직은 건드리지 않는다.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, Supabase (Auth/DB), Pretendard(npm)

**Spec:** `docs/superpowers/specs/2026-06-11-site-renewal-outsourcing-products-design.md`

**검증 방식 노트:** 이 저장소에 테스트 인프라가 없고 Phase 1은 UI·라우팅 중심이므로 TDD 대신 `npm run build` + dev 서버 수동 E2E 체크리스트(Task 10)로 검증한다. 로직 단위 테스트는 Phase 2(주문/다운로드 검증 로직)에서 vitest 도입과 함께 시작.

---

## 사전 확인 사항 (현재 코드 상태)

- 레이아웃: `app/layout.tsx` (Jua 폰트, 음악 팩 중심 metadata/jsonLd) → 교체 대상
- 셸: `app/components/DashboardShell.tsx` (standalone 분기) → 유지, `app/components/PublicShell.tsx`(TopNav+푸터) → 리뉴얼
- 네비: `app/components/TopNav.tsx` — 링크가 SaaS제품/AI음악/커스텀외주 → 교체
- 토큰: `app/globals.css` `--kx-*` 다크 테마 (#060e20 배경, 보라 #cc97ff 프라이머리) → 교체
- 숨김 토글 인프라: `service_settings` 테이블 + `app/api/admin/services/route.ts`(GET/PATCH, DEFAULT_SERVICES) + `app/admin/services/page.tsx` 존재 → 재사용
- admin 인증: `lib/admin-auth.ts`의 `verifyAdminTokenNode(token)` + `admin_token` 쿠키
- 리다이렉트: `next.config.ts` redirects() 존재 → 추가만

---

### Task 1: 디자인 토큰 + Pretendard 폰트 교체

**Files:**
- Modify: `package.json` (pretendard 추가)
- Modify: `app/globals.css` (토큰 교체)
- Modify: `app/layout.tsx` (Jua 제거, Pretendard 적용)

- [ ] **Step 1: pretendard 설치**

```bash
npm install pretendard
```

- [ ] **Step 2: `app/globals.css` 토큰 교체**

기존 `--kx-*` 변수 블록(40~51행 부근)을 **유지한 채 아래 신규 토큰을 추가**하고, 기존 kx 변수의 값만 새 라이트 테마로 재매핑한다 (kx 변수를 참조하는 기존 페이지가 많아 즉시 삭제하면 깨짐 — Phase 1 완료 후 잔여 참조 제거):

```css
:root {
  /* === JSM Professional tokens (2026-06 renewal) === */
  --jsm-bg: #f8fafc;            /* slate-50 본문 배경 */
  --jsm-surface: #ffffff;       /* 카드 */
  --jsm-surface-alt: #f1f5f9;   /* slate-100 섹션 교차 배경 */
  --jsm-ink: #0f172a;           /* slate-900 본문 텍스트 */
  --jsm-ink-soft: #475569;      /* slate-600 보조 텍스트 */
  --jsm-ink-faint: #94a3b8;     /* slate-400 캡션 */
  --jsm-line: #e2e8f0;          /* slate-200 보더 */
  --jsm-navy: #0b1f3a;          /* 딥네이비 — 푸터/다크 섹션 */
  --jsm-accent: #1d4ed8;        /* blue-700 포인트 (단일 포인트 컬러) */
  --jsm-accent-hover: #1e40af;  /* blue-800 */
  --jsm-accent-soft: #dbeafe;   /* blue-100 뱃지 배경 */

  /* 기존 kx 변수 재매핑 (잔여 참조 호환용) */
  --kx-surface: var(--jsm-bg);
  --kx-surface-low: var(--jsm-surface-alt);
  --kx-surface-mid: var(--jsm-surface);
  --kx-surface-high: var(--jsm-surface);
  --kx-surface-bright: var(--jsm-surface-alt);
  --kx-on-surface: var(--jsm-ink);
  --kx-on-variant: var(--jsm-ink-soft);
  --kx-primary: var(--jsm-accent);
  --kx-primary-dim: var(--jsm-accent-hover);
  --kx-secondary: var(--jsm-accent);
  --kx-secondary-dim: var(--jsm-accent-hover);
  --kx-outline: var(--jsm-line);
}
```

`body` 폰트 스택을 `var(--font-pretendard), Pretendard Variable, Pretendard, -apple-system, sans-serif`로 변경. `.kx-display`, `.kx-gradient-text`, `.kx-btn-primary` 등 기존 유틸 클래스는 새 토큰 기반으로 값만 정제 (gradient-text는 단색 `--jsm-ink`로, btn-primary는 `--jsm-accent` 솔리드로).

- [ ] **Step 3: `app/layout.tsx`에서 Jua 제거 + Pretendard import**

```tsx
// 제거: import { Jua } from "next/font/google"; 및 jua 정의/사용
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
// <html className={jua.variable}> → <html> (또는 className 제거)
```

- [ ] **Step 4: 빌드 확인**

Run: `npm run build`
Expected: 성공 (스타일 회귀는 Task 4~8에서 페이지별 정리)

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json app/globals.css app/layout.tsx
git commit -m "feat(design): JSM 전문 토큰 체계 + Pretendard 도입, kx 토큰 재매핑"
```

---

### Task 2: 서비스 숨김 가드 라이브러리

**Files:**
- Create: `lib/service-visibility.ts`
- Create: `supabase/migrations/2026-06-11-hide-legacy-services.sql`
- Modify: `app/api/admin/services/route.ts` (DEFAULT_SERVICES 갱신)

- [ ] **Step 1: 마이그레이션 SQL 작성** (클라우드 + self-host 양쪽 적용 — 멱등)

```sql
-- 2026-06-11 리뉴얼: 레거시 서비스 숨김 토글 시드
-- service_settings: 신규 id 추가 (이미 있으면 무시)
INSERT INTO service_settings (id, name, description, is_active, order_index)
VALUES
  ('saju',     'AI 사주 분석',        '사주 입력 및 AI 해석 (레거시)',        false, 101),
  ('music',    'AI 음악 팩',          '음악 가이드 패키지·샘플·스튜디오',      false, 102),
  ('gyeol',    'CONTOUR 설문',        '/gyeol PMF 설문',                      false, 103),
  ('packages', 'SaaS 제품 허브(구)',  '구 /packages 페이지',                  false, 104),
  ('lotto',    '로또 추천',           '로또 번호 추천 노출',                   false, 105)
ON CONFLICT (id) DO NOTHING;
```

- [ ] **Step 2: `lib/service-visibility.ts` 작성**

```typescript
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminTokenNode } from '@/lib/admin-auth';

/** 숨김 가능 서비스 id (service_settings.id와 일치) */
export type HideableService = 'saju' | 'music' | 'gyeol' | 'packages' | 'lotto';

/**
 * 서비스 노출 여부. admin_token 세션이면 항상 true.
 * service_settings 조회 실패(테이블 미생성 등) 시 안전하게 숨김(false).
 */
export async function isServiceVisible(id: HideableService): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (token && verifyAdminTokenNode(token)) return true;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('service_settings')
      .select('is_active')
      .eq('id', id)
      .maybeSingle();
    if (error || !data) return false;
    return data.is_active === true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 3: `app/api/admin/services/route.ts`의 `DEFAULT_SERVICES`를 신규 id 체계로 갱신**

```typescript
const DEFAULT_SERVICES = [
  { id: 'saju',     name: 'AI 사주 분석',       description: '사주 입력 및 AI 해석 (레거시)',   is_active: false, order_index: 101 },
  { id: 'music',    name: 'AI 음악 팩',         description: '음악 가이드 패키지·샘플·스튜디오', is_active: false, order_index: 102 },
  { id: 'gyeol',    name: 'CONTOUR 설문',       description: '/gyeol PMF 설문',                 is_active: false, order_index: 103 },
  { id: 'packages', name: 'SaaS 제품 허브(구)', description: '구 /packages 페이지',             is_active: false, order_index: 104 },
  { id: 'lotto',    name: '로또 추천',          description: '로또 번호 추천 노출',              is_active: false, order_index: 105 },
];
```

- [ ] **Step 4: 마이그레이션 적용 (운영 DB 2곳)**

Run (CEO 또는 세션에서): 클라우드 Supabase SQL Editor + NAS self-host(`supa.jaengseung-made.com`) SQL Editor 양쪽에 Step 1 SQL 실행.
Expected: 5 rows inserted (또는 0 — 재실행 시).

- [ ] **Step 5: Commit**

```bash
git add lib/service-visibility.ts supabase/migrations/2026-06-11-hide-legacy-services.sql app/api/admin/services/route.ts
git commit -m "feat(visibility): service_settings 기반 서비스 숨김 가드 + 레거시 서비스 시드"
```

---

### Task 3: 레거시 라우트에 숨김 가드 적용

**Files:**
- Create: `app/work/saju/layout.tsx`
- Create: `app/music/layout.tsx`
- Create: `app/gyeol/layout.tsx` (기존에 있으면 Modify — 가드만 추가)
- Create: `app/packages/layout.tsx`

- [ ] **Step 1: 서버 레이아웃 가드 4개 작성** (모두 동일 패턴, id만 다름)

`app/work/saju/layout.tsx`:

```tsx
import { notFound } from 'next/navigation';
import { isServiceVisible } from '@/lib/service-visibility';

export default async function SajuLayout({ children }: { children: React.ReactNode }) {
  if (!(await isServiceVisible('saju'))) notFound();
  return <>{children}</>;
}
```

`app/music/layout.tsx` → `isServiceVisible('music')`,
`app/gyeol/layout.tsx` → `isServiceVisible('gyeol')` (기존 layout 있으면 함수 본문에 가드 추가),
`app/packages/layout.tsx` → `isServiceVisible('packages')`.

주의: 해당 디렉토리에 기존 `layout.tsx`가 이미 있으면 새로 만들지 말고 기존 파일 상단에 가드 삽입. 클라이언트 레이아웃이면 서버 래퍼 레이아웃을 한 단계 위에 둘 수 없으므로 page 단위로 가드 서버 컴포넌트 래핑.

- [ ] **Step 2: dev 서버에서 동작 확인**

Run: `npm run dev` 후
- 비로그인 브라우저(시크릿): `/work/saju`, `/music/packs`, `/gyeol`, `/packages` → 404
- `/admin/login` 로그인 후 동일 URL → 정상 렌더
Expected: 위와 같음

- [ ] **Step 3: Commit**

```bash
git add app/work/saju/layout.tsx app/music/layout.tsx app/gyeol/layout.tsx app/packages/layout.tsx
git commit -m "feat(visibility): 사주·음악·설문·패키지 라우트 숨김 가드 적용"
```

---

### Task 4: TopNav + 푸터(PublicShell) 리뉴얼

**Files:**
- Modify: `app/components/TopNav.tsx`
- Modify: `app/components/PublicShell.tsx`

- [ ] **Step 1: TopNav 링크·CTA 교체**

```typescript
const LINKS = [
  { href: '/outsourcing', label: '외주 개발' },
  { href: '/products', label: '소프트웨어' },
];
// CTA 버튼: "Try now"(→/music) 제거 → "프로젝트 문의" (→/outsourcing#contact)
```

스타일: 라이트 배경 기준으로 재작성 — 스크롤 시 흰 배경 + `--jsm-line` 하단 보더 + 약한 그림자(현재의 다크 글래스 blur 제거). 로고 "JSM"은 gradient-text 제거, `--jsm-ink` 단색 + "쟁승메이드" 병기. 로그인/마이페이지/로그아웃 분기 로직은 그대로 유지(Supabase auth 구독 코드 무수정).

- [ ] **Step 2: PublicShell 푸터 링크 그룹 교체**

```
서비스:   외주 개발(/outsourcing) · 소프트웨어(/products)
회사:     문의하기(mailto) · 진행 프로세스(/outsourcing#process)
Legal:    이용약관 · 개인정보처리방침 · 환불 정책  (유지)
```

숨김 서비스 링크(SaaS 제품/AI 음악/AI 사주) 전부 제거. 푸터 배경은 `--jsm-navy`, 사업자 정보 라인 유지. `KakaoFloatButton` 유지.

- [ ] **Step 3: dev 서버에서 네비·푸터 렌더 확인** (모바일 드로어 포함)

- [ ] **Step 4: Commit**

```bash
git add app/components/TopNav.tsx app/components/PublicShell.tsx
git commit -m "feat(nav): 외주·소프트웨어 2축 네비게이션 + 푸터 리뉴얼"
```

---

### Task 5: 메인 페이지 리디자인 (`app/page.tsx`) + 메타데이터

**Files:**
- Modify: `app/page.tsx` (전면 교체)
- Modify: `app/layout.tsx` (metadata + jsonLd 교체)

> **구현 전 designer + soft-skill 스킬 로드 필수.**

- [ ] **Step 1: `app/layout.tsx` metadata/jsonLd 교체**

- title default: `"외주 개발 · 완성 소프트웨어 | 쟁승메이드"`
- description: `"7년차 대기업 백엔드 개발자가 직접 설계하고 만듭니다. 맞춤 소프트웨어 외주 개발과 검증된 완성 소프트웨어를 제공하는 쟁승메이드."`
- keywords: 외주 개발, 소프트웨어 개발, 웹사이트 제작, 업무 자동화, 백엔드 개발자, 프리랜서 개발자
- jsonLd: OfferCatalog에서 음악 팩·사주 Offer 제거, 외주 개발·웹사이트 제작 Service만 유지 (소프트웨어 제품 Offer는 Phase 2에서 동적 생성)

- [ ] **Step 2: 메인 페이지 섹션 구성으로 전면 재작성** (서버 컴포넌트, 이미지 없이 타이포·여백·SVG)

| 섹션 | 내용 (실제 카피) |
|------|------|
| Hero | 헤드라인: "필요한 소프트웨어, 만들어 드리거나 — 이미 만들어 두었습니다." 서브: "7년차 대기업 백엔드 개발자가 직접 설계·개발·운영합니다. 맞춤 외주 개발과 검증된 완성 소프트웨어 중 선택하세요." CTA 2개: [프로젝트 문의하기 → /outsourcing#contact] [소프트웨어 보기 → /products] |
| 2축 서비스 | 카드 2장 — ① 외주 개발: "기획부터 배포·운영까지. 웹/API/자동화/봇" → /outsourcing ② 완성 소프트웨어: "결제 후 바로 다운로드. 직접 운영하며 검증한 도구" → /products |
| 개발 프로세스 | 4단계 타임라인: 01 무료 상담·요구 정리 → 02 견적·범위 확정 → 03 개발·중간 공유 → 04 납품·배포 지원 (각 1줄 설명) |
| 신뢰 요소 | 숫자 스탯: "7년차 대기업 백엔드" · "직접 운영 중인 서비스 15+" · "기획→배포 원스톱" + 기술 스택 라벨(Python·Java·Spring·Next.js·AI 연동) |
| 포트폴리오 하이라이트 | 실제 운영 사례 3장: 주식 자동매매 시스템(텔레그램 연동) / 부동산 청약 자동 수집·매칭 / AI 콘텐츠 자동화 파이프라인 — 각 "직접 개발·운영 중" 뱃지, [더 보기 → /outsourcing#portfolio] |
| 소프트웨어 진열 | Phase 1은 정적: "출시 준비 중인 제품" 카드 + [입고 알림 → /outsourcing#contact]. Phase 2에서 products 테이블 동적 진열로 교체 예정 주석 명시 |
| 최종 CTA | 네이비 풀폭 밴드: "프로젝트, 이야기부터 시작하세요" + [무료 상담 신청] |

- [ ] **Step 3: 빌드 + 렌더 확인**

Run: `npm run build && npm run dev` → `/` 데스크톱·모바일 확인

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx app/layout.tsx
git commit -m "feat(home): 외주+소프트웨어 2축 메인 페이지 풀 리디자인"
```

---

### Task 6: `/outsourcing` 페이지 신설 + 리다이렉트

**Files:**
- Create: `app/outsourcing/page.tsx`
- Modify: `next.config.ts` (redirects 추가)
- 참고(복사 소스): `app/work/freelance/page.tsx`, `app/components/ContactForm.tsx`

> **구현 전 designer + soft-skill 스킬 로드 필수.** 단계형 폼은 Phase 3 — 이번엔 기존 `ContactForm` 재사용.

- [ ] **Step 1: `app/outsourcing/page.tsx` 작성** — 섹션 구성:

1. Hero: "맞춤 소프트웨어 외주 개발" + "기획 정리가 안 됐어도 괜찮습니다. 상담에서 함께 정리합니다."
2. 제공 분야 카드 6: 웹 서비스 / 웹사이트 제작 / 업무 자동화(RPA·엑셀·크롤링) / API·백엔드 / 텔레그램·디스코드 봇 / AI 연동 개발
3. `#process` 진행 프로세스: 상담 → 견적(영업일 2일 내) → 계약·착수 → 중간 공유(주 1회 이상) → 납품·검수 → 무상 하자보수 30일
4. `#portfolio` 포트폴리오: 기존 `/work/freelance`의 실사례 + `/work/website/samples/*` 샘플 링크 카드 재사용
5. 자주 묻는 질문 4개: 견적 기준 / 수정 횟수 / 소스코드 제공 / 유지보수
6. `#contact` 의뢰 폼: 기존 `ContactForm` 컴포넌트 그대로 임베드 (새 토큰으로 스타일만 정제)

- [ ] **Step 2: `next.config.ts` redirects 추가**

```typescript
{ source: '/work/freelance', destination: '/outsourcing', permanent: true },
{ source: '/work', destination: '/outsourcing', permanent: true },
{ source: '/work/website', destination: '/outsourcing', permanent: true },
// 주의: /work/saju*, /work/website/samples/* 는 redirect 하지 않음 (admin 접근용 잔존)
```

기존 redirects 중 destination이 `/work`·`/work/freelance`·`/work/website`인 항목은 새 destination(`/outsourcing`)으로 갱신해 redirect 체인 방지.

- [ ] **Step 3: dev 확인** — `/outsourcing` 렌더 + `/work/freelance` → `/outsourcing` 301 + 폼 제출 1회 테스트(접수 메일 수신)

- [ ] **Step 4: Commit**

```bash
git add app/outsourcing/page.tsx next.config.ts
git commit -m "feat(outsourcing): 외주 의뢰 페이지 신설 + work 라우트 리다이렉트"
```

---### Task 7: `/login` 리디자인

**Files:**
- Modify: `app/login/page.tsx`

- [ ] **Step 1: 비주얼 리디자인** — Supabase 로직(signUp/signInWithPassword/signInWithOAuth, 에러 처리, redirect) **무수정**, 마크업·스타일만 교체:
  - 중앙 카드형 (max-w-sm, 흰 카드, `--jsm-line` 보더), 좌측 또는 상단에 "쟁승메이드" 워드마크
  - Google 버튼 → 이메일 폼 순서, 가입/로그인 토글 유지
  - 다크 배경·글래스 효과 제거, `--jsm-bg` 배경

- [ ] **Step 2: dev 확인** — 이메일 로그인 + Google OAuth 각 1회

- [ ] **Step 3: Commit**

```bash
git add app/login/page.tsx
git commit -m "feat(login): 로그인 페이지 전문 톤 리디자인 (로직 무수정)"
```

---

### Task 8: `/mypage` 리디자인 + 탭 재구성

**Files:**
- Modify: `app/mypage/page.tsx` (1,048줄 — 탭 단위로 작업)

- [ ] **Step 1: 탭 구조 변경** — 기존 7탭 → 4탭:

| 새 탭 | 기존 소스 | 처리 |
|------|----------|------|
| 프로필 | 프로필 탭 | 유지·리스타일 |
| 내 의뢰 | 의뢰 탭 | 유지·리스타일 (Phase 3에서 타임라인 고도화) |
| 내 제품 | 팩 탭 | 명칭 변경·리스타일 — **다운로드 로직(sign-link 호출) 무수정** |
| 주문 내역 | 결제+주문 탭 통합 | 병합·리스타일 |

사주·구독 탭: 렌더 분기에서 제외(코드는 주석이 아닌 조건 `false` 처리 또는 제거 — 데이터 로직은 남겨도 무방). 탭 상태/데이터 페칭 구조는 유지.

- [ ] **Step 2: 비주얼 리디자인** — 새 토큰 적용, 카드·테이블 정제. 다운로드 버튼/상태 뱃지 명확화("입금 확인 후 활성화됩니다" 안내 문구 포함).

- [ ] **Step 3: dev 확인** — 로그인 → 4탭 전환 → 기존 구매 계정으로 다운로드 버튼 동작(또는 테스트 데이터) 확인

- [ ] **Step 4: Commit**

```bash
git add app/mypage/page.tsx
git commit -m "feat(mypage): 4탭 재구성 + 전문 톤 리디자인 (다운로드 로직 무수정)"
```

---

### Task 9: 잔여 kx 참조·레거시 노출 정리

**Files:**
- Modify: `app/payment/success/page.tsx`, `app/payment/fail/page.tsx`, `app/quote/[token]/page.tsx`, `app/legal/*/page.tsx` — 새 토큰 기준 톤 정제 (구조 변경 없음)
- Modify: `app/components/KakaoFloatButton.tsx` 등 공용 컴포넌트의 다크 전제 스타일

- [ ] **Step 1: 잔여 다크 전제 스타일 검색·정리**

Run: `grep -rn "kx-gradient-text\|GlassFilter\|LiquidGlass" app/ --include="*.tsx"`
→ 노출 페이지(숨김 라우트 제외)에서 발견된 사용처를 새 토큰으로 정리. `app/layout.tsx`의 `<GlassFilter />` 제거.

- [ ] **Step 2: 빌드 확인** — `npm run build` 성공

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor(design): 잔여 글래스·그래디언트 스타일 정리"
```

---

### Task 10: Phase 1 E2E 검증 (스펙 §8 시나리오 C + 회귀)

- [ ] **Step 1: 숨김 검증 (시나리오 C)**
  - 시크릿 창: `/work/saju`, `/music/packs`, `/music/studio`, `/gyeol`, `/packages` → 전부 404
  - admin 로그인 창: 동일 URL 전부 정상 렌더
  - `/admin/services`에서 'music' 토글 ON → 시크릿 창 `/music/packs` 정상 렌더 → 다시 OFF → 404

- [ ] **Step 2: 핵심 동선 회귀**
  - `/` → 네비·Hero CTA → `/outsourcing` → 폼 제출 → 접수 메일 수신 + `/admin/contacts`에 기록
  - 회원 로그인 → `/mypage` 4탭 정상 + (구매 데이터 있으면) 다운로드 링크 발급
  - `/work/freelance` → `/outsourcing` 301 확인
  - 모바일 뷰(375px): 네비 드로어·메인·외주 페이지 레이아웃 확인

- [ ] **Step 3: 빌드·배포 준비**

Run: `npm run build`
Expected: 에러 0. (배포는 CEO 확인 후 git push → Vercel)

- [ ] **Step 4: 최종 Commit + Phase 1 완료 보고**

```bash
git add -A && git commit -m "chore: Phase 1 디자인+IA 리뉴얼 완료"
```

---

## Phase 2·3 예고 (별도 플랜으로 작성)

- **Phase 2 — 제품 판매 시스템**: DB 마이그레이션(products 확장·pack_files.product_id·orders 정비), `/products` 카탈로그·상세, 계좌이체 구매 모달 일반화, `/admin/orders`·`/admin/products`, sign-link 검증 orders 기반 교체, 기존 구매자 이관. vitest 도입.
- **Phase 3 — 외주 고객 포털**: 단계형 의뢰 폼, contact↔quote FK, 상태 머신, `/track/[token]`, 자동 이메일(Resend), admin 의뢰·견적 통합 뷰.
