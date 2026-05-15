# 홈 재구조 P1 — IA 마이그레이션 + 메인 안 2 적용

- **작성일**: 2026-05-16
- **상위 컨텍스트**:
  - 4월 27일 brainstorm: `docs/superpowers/specs/2026-04-27-home-restructure-brainstorm.md` (A-1 결정 라인 확정)
  - P0 완료 (외주 가시성 회복 — 헤더/푸터/메인 미니섹션/JSON-LD)
  - Phase 2 완료 (mypage NAS 다운로드 자동화)
- **목표**: 4월 27일 brainstorm의 A-1 결정(Music + Custom Build 두 사업부)을 실제 IA로 구현. URL 마이그레이션 + 메인 안 2(Brand Hero + 2-up Card) + 헤더 안 b.
- **결정 라인 (CEO 확정, 2026-05-16)**:
  1. 메인 = 안 2 (Brand Hero + 2-up Card)
  2. 헤더 = 안 b (Music | Custom Build | Try now)
  3. URL = `/work` 사용, 9개 redirect 매핑
  4. 사주 = 단순 URL 마이그 (`/saju` → `/work/saju`). 사주 카탈로그 spec은 보류 유지
  5. 자동화 = `/work/freelance` 흡수. 별도 페이지 X. Custom Build 5라인 → 4라인
  6. 회사 소개 = `/about` 미신설. Brand Hero가 약식 회사 표지 역할
  7. 가격 = 자체 정가 미정. "견적 문의" CTA만. 가격 결정 후 별도 작업
  8. 외주 진행 5건 비공개, 납품 5건만 사례 노출

## 1. IA 변경

### 1.1 새 라우트 구조

```
/                        ← Brand Hero + 2-up Card 메인 (안 2)
/music                   ← Music 허브 (팩·샘플·스튜디오 카드)
  /music/packs           = 현 /services/music 컨텐츠
  /music/samples         = 현 /services/music/samples
  /music/studio          = 현 /studio
/work                    ← Custom Build 허브 (4 라인 카드)
  /work/freelance        = 현 /freelance + 자동화 #automation 섹션
  /work/website          = 현 /services/website
  /work/website/samples/{corporate, bakery, portfolio, dashboard, game, interior, reading, shopping}
  /work/saju             = 현 /saju
  /work/saju/input       = 현 /saju/input
  /work/saju/result      = 현 /saju/result
  /work/blog             = 현 /services/blog
/admin/*                 ← 그대로 (standalone shell)
/mypage                  ← 그대로 (Phase 2 다운로드 활성)
/login, /payment/*, /legal/*, /portfolio/[token], /quote/[token]  ← 변경 X
```

### 1.2 Custom Build 4 라인 (자동화 제외 → /freelance 흡수)

| 라인 | 새 URL | 카드 desc |
|---|---|---|
| 외주 개발 (자동화 포함) | `/work/freelance` | "맞춤 솔루션 외주 · RPA·API 연동·자동화 포함" |
| 웹사이트 제작 | `/work/website` | "기업·브랜드 사이트 · Next.js + SEO + 배포" |
| AI 사주 | `/work/saju` | "AI 사주팔자 + 12개 항목 해석 (무료)" |
| 블로그 자동화 | `/work/blog` | "수익 엔진 팩 · 자동화 마케팅 콘텐츠" |

### 1.3 Redirects (next.config.ts) — 10 매핑

```ts
// next.config.ts
async redirects() {
  return [
    { source: '/services/music', destination: '/music/packs', permanent: true },
    { source: '/services/music/samples', destination: '/music/samples', permanent: true },
    { source: '/studio', destination: '/music/studio', permanent: true },
    { source: '/freelance', destination: '/work/freelance', permanent: true },
    { source: '/services/website', destination: '/work/website', permanent: true },
    { source: '/services/website/samples/:slug', destination: '/work/website/samples/:slug', permanent: true },
    { source: '/services/blog', destination: '/work/blog', permanent: true },
    { source: '/saju', destination: '/work/saju', permanent: true },
    { source: '/saju/input', destination: '/work/saju/input', permanent: true },
    { source: '/saju/result', destination: '/work/saju/result', permanent: true },
  ];
}
```

총 10개 — `/services/*` 4개 + `/services/website/samples/:slug` 1개 + `/studio` 1개 + `/freelance` 1개 + `/saju*` 3개.

**중요**: `next.config.ts` redirects는 파일 시스템 라우트보다 **먼저** 평가됨 → 원본 파일을 삭제하지 않아도 redirect가 우선 동작. 하지만 spec에서는 원본 파일도 **삭제**해서 SEO duplicate content 회피.

### 1.4 헤더 안 b — TopNav LINKS

비로그인:
```
JSM    Music    Custom Build         로그인    Try now
```

로그인:
```
JSM    Music    Custom Build         마이페이지    로그아웃
```

LINKS 배열 (현 5개 → 2개):
```ts
const LINKS = [
  { href: '/music', label: 'Music' },
  { href: '/work', label: 'Custom Build' },
];
```

`isActive`: `/music`, `/music/*`, `/work`, `/work/*` 매칭 — 기존 `pathname.startsWith(href)` 분기 그대로 작동.

Try now 버튼 destination: `/music` (Music 허브 → 팩 카드 → /music/packs 진입). 기존은 `/services/music`였으나 redirect로 자동 처리됨.

### 1.5 푸터(PublicShell) 재정비

기존 푸터 컬럼 (P0에서 정돈됨):
- Product: 음악 팩 / 샘플 / 가격
- Custom Build: 외주 / 웹사이트 / 사주 / 블로그 / 문의
- Legal: 약관 / 개인정보 / 환불

새 URL로 교체:

| 항목 | 기존 | 새 |
|---|---|---|
| Product → Music | `/services/music` | `/music/packs` |
| Product → 샘플 | `/services/music/samples` | `/music/samples` |
| Product → 가격 | `/services/music#pricing` | `/music/packs#pricing` |
| Custom Build → 외주 | `/freelance` | `/work/freelance` |
| Custom Build → 웹사이트 | `/services/website` | `/work/website` |
| Custom Build → 사주 | `/saju` | `/work/saju` |
| Custom Build → 블로그 | `/services/blog` | `/work/blog` |

컬럼명 "Product" → "Music" 으로 변경 (사업부 명명 일치).

## 2. 메인 페이지 안 2 — Brand Hero + 2-up Card

### 2.1 섹션 구조

```
┌─────────────────────────────────────────────────────┐
│ Section 1: Brand Hero (검정 배경, 짧음)              │
│  "현직 엔지니어가 만드는 두 가지."                    │
│  AI 제품, 그리고 맞춤 개발.                          │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ Section 2: Two-up Cards (좌우 균등)                  │
│  ┌──Music──────────┐  ┌──Custom Build──────┐       │
│  │ hero-bg.mp4 미니 │  │ 코드/타이포 모션     │       │
│  │ "AI 음악 제품"   │  │ "맞춤 개발 사업부"   │       │
│  │ ₩39,000~        │  │ 외주·웹·사주·블로그   │       │
│  │ [Try now]       │  │ [견적 문의]          │       │
│  └─────────────────┘  └────────────────────┘       │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ Section 3: Music 섹션 (현 메인 콘텐츠 압축)           │
│  - Features 3-step (Prompt/Visual/Publish)          │
│  - 트윗 마퀴 (그대로 유지)                            │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ Section 4: Custom Build 섹션 (현 P0 미니섹션 확장)   │
│  - 4 라인 카드 (외주/웹/사주/블로그)                  │
│  - 납품 5건 미리보기                                  │
│  - [견적 문의] CTA → ContactModal                     │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ Section 5: Final CTA — "어느 쪽이든 시작하세요"       │
│  [Music 팩 보기]  [견적 문의]                         │
└─────────────────────────────────────────────────────┘
```

### 2.2 Brand Hero 구체

- 배경: kx-surface (#060e20, 검정) — 현 풀스크린 hero-bg.mp4 대신 짧은 텍스트 hero
- 높이: `min-h-[60vh]` (현 풀스크린에서 축소)
- 카피:
  - H1 (kx-display, 크게): "현직 엔지니어가 만드는 두 가지."
  - subhead (text-white/70): "AI 제품, 그리고 맞춤 개발."
- 배경 영상: 그대로 hero-bg.mp4 사용하되 blur + opacity 35% (Brand 톤으로 톤다운)
- CTA 없음 — 다음 섹션(2-up)이 분기 역할

### 2.3 Two-up Cards 구체

좌측 (Music):
- 배경: hero-bg.mp4 미니 클립 (object-cover, 카드 내부)
- 헤더 라벨: `Music`
- H2: "AI 음악 제품"
- desc: "Suno 프롬프트 + 뮤비 워크플로우 + 유튜브 SEO 한 팩에."
- 가격 라인: "₩39,000~" (음악 팩 starter 가격)
- CTA: `[Try now]` → `/music`

우측 (Custom Build):
- 배경: 정적 그라데이션 — `kx-surface` (#060e20) → `kx-primary` (#cc97ff) 미세 톤. 영상/모션 없음 (대비: Music 카드는 영상, Custom Build는 정적).
- 추가 시각 요소: 미세 grid pattern overlay (`backgroundImage: repeating-linear-gradient(...)` — mypage hero와 동일 톤)
- 헤더 라벨: `Custom Build`
- H2: "맞춤 개발 사업부"
- desc: "외주 · 웹사이트 · AI 사주 · 블로그 자동화"
- 가격 라인: 없음 (P3에서 가격 결정 후 추가). 대신 "5건 납품 사례 보기 →"
- CTA: `[견적 문의]` → ContactModal (service="외주 개발 문의" preselect, P0 modalService 패턴 재사용)

레이아웃:
- 데스크톱: `grid-cols-2 gap-6`
- 모바일: `grid-cols-1 gap-4` (위·아래 stack)

### 2.4 Custom Build 섹션 (Section 4)

P0의 메인 미니섹션을 확장:

```tsx
<section className="py-24 px-6 bg-black text-white border-b border-white/10">
  <div className="max-w-7xl mx-auto">
    {/* header */}
    <div className="text-center mb-14">
      <p className="font-mono text-[11px] tracking-widest uppercase text-white/50 mb-4">
        Custom Build
      </p>
      <h2 className="kx-display text-3xl md:text-5xl font-bold mb-5">
        맞춤 개발이 필요하신가요?
      </h2>
      <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto">
        7년차 백엔드 개발자가 직접 설계·개발·납품. 외주, 웹사이트, 자동화부터 사주·블로그 솔루션까지.
      </p>
    </div>

    {/* 4 cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {/* 외주 개발 (자동화 포함) */}
      <Link href="/work/freelance" onClick={() => trackCTAClick('home_v7_cb_card_freelance')}>...</Link>
      {/* 웹사이트 */}
      <Link href="/work/website" onClick={() => trackCTAClick('home_v7_cb_card_website')}>...</Link>
      {/* AI 사주 */}
      <Link href="/work/saju" onClick={() => trackCTAClick('home_v7_cb_card_saju')}>...</Link>
      {/* 블로그 자동화 */}
      <Link href="/work/blog" onClick={() => trackCTAClick('home_v7_cb_card_blog')}>...</Link>
    </div>

    {/* 납품 5건 미리보기 */}
    <div className="mb-12">
      <p className="font-mono text-[11px] tracking-widest uppercase text-white/40 mb-4 text-center">
        Recent Deliveries
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* 5 카드 — /work/freelance 의 portfolio 데이터에서 5건 ALSI */}
      </div>
    </div>

    {/* 견적 CTA */}
    <div className="text-center">
      <button onClick={() => { trackCTAClick('home_v7_cb_cta'); openContactModal('외주 개발 문의'); }}>
        견적 문의하기
      </button>
    </div>
  </div>
</section>
```

5건 납품 사례 데이터: `app/work/freelance/page.tsx`에서 export하는 portfolio array에서 가져옴. 또는 `lib/freelance-portfolio.ts` 에 분리 (재사용성).

### 2.5 Music 섹션 (Section 3)

현 메인의 Features 3-step + 트윗 마퀴 그대로 유지. 풀버전은 `/music/packs` 에서.

### 2.6 Final CTA (Section 5)

```tsx
<section className="...">
  <h2>어느 쪽이든 시작하세요.</h2>
  <div className="flex gap-3">
    <GlassButton href="/music">Music 팩 보기</GlassButton>
    <button onClick={() => openContactModal('외주 개발 문의')}>견적 문의</button>
  </div>
</section>
```

기존 hero-bg.mp4 풀스크린 final CTA → 더 단순한 텍스트 + 두 분기 CTA로.

## 3. 변경 범위 (파일 단위)

### 3.1 신규 생성

| 파일 | 책임 | 컨텐츠 출처 |
|---|---|---|
| `next.config.ts` (또는 modify) | 9 redirects | spec |
| `app/music/page.tsx` | Music 허브 (3 카드 + 후기 압축) | 신규 |
| `app/music/packs/page.tsx` | 음악 팩 상세 | 현 `app/services/music/page.tsx` 이동 |
| `app/music/samples/page.tsx` | 샘플 갤러리 | 현 `app/services/music/samples/page.tsx` 이동 |
| `app/music/studio/page.tsx` | Suno 스튜디오 | 현 `app/studio/page.tsx` 이동 |
| `app/music/layout.tsx` (선택) | Music 도메인 메타데이터 | metadata.title 분기 |
| `app/work/page.tsx` | Custom Build 허브 (4 카드 + 5건 사례 + 견적) | 신규 |
| `app/work/freelance/page.tsx` | 외주 (자동화 포함, #automation 앵커) | 현 `app/freelance/page.tsx` 이동 + 자동화 섹션 강화 |
| `app/work/freelance/layout.tsx` | 메타데이터 | 현 `app/freelance/layout.tsx` |
| `app/work/website/page.tsx` | 웹사이트 제작 | 현 `app/services/website/page.tsx` 이동 |
| `app/work/website/layout.tsx` | 메타데이터 | 현 `app/services/website/layout.tsx` |
| `app/work/website/samples/{corporate, bakery, ...}/page.tsx` | 7개 샘플 | 현 `app/services/website/samples/*` 이동 |
| `app/work/saju/page.tsx` | 사주 입력 | 현 `app/saju/page.tsx` 이동 |
| `app/work/saju/layout.tsx` | 메타데이터 | 현 `app/saju/layout.tsx` |
| `app/work/saju/input/page.tsx` | 사주 입력 | 현 `app/saju/input/page.tsx` 이동 |
| `app/work/saju/result/page.tsx` + `SajuAISection.tsx` + `SajuFortuneSection.tsx` | 결과 + AI | 현 `app/saju/result/*` 이동 |
| `app/work/blog/page.tsx` | 블로그 자동화 | 현 `app/services/blog/page.tsx` 이동 |
| `app/work/blog/layout.tsx` | 메타데이터 | 현 `app/services/blog/layout.tsx` |
| `lib/freelance-portfolio.ts` | 납품 5건 데이터 분리 | 현 `app/freelance/page.tsx`의 portfolio array 추출 |

### 3.2 수정

| 파일 | 변경 |
|---|---|
| `app/page.tsx` | 안 2 적용 — Brand Hero + 2-up + Music 섹션 + Custom Build 섹션 + Final CTA |
| `app/components/TopNav.tsx` | LINKS 5개 → 2개 (Music / Custom Build) |
| `app/components/PublicShell.tsx` | 푸터 URL 8개 교체 (새 URL) |
| `app/layout.tsx` | JSON-LD OfferCatalog `url` 필드 새 URL로 |
| `app/api/saju/save-interpretation/route.ts` 등 | 사주 페이지 내부에서 사용하는 라우트 — Link href만 새 URL로 (라우트 자체는 그대로) |

### 3.3 삭제

원본 페이지 파일 삭제 (컨텐츠는 모두 새 위치로 이동 완료 후):

```
app/services/music/page.tsx
app/services/music/samples/page.tsx
app/services/music/layout.tsx
app/studio/page.tsx
app/freelance/page.tsx
app/freelance/layout.tsx
app/services/website/page.tsx
app/services/website/layout.tsx
app/services/website/samples/{corporate, bakery, ...}/page.tsx  ← 7개
app/services/blog/page.tsx
app/services/blog/layout.tsx
app/saju/page.tsx
app/saju/layout.tsx
app/saju/input/page.tsx
app/saju/result/page.tsx
app/saju/result/SajuAISection.tsx
app/saju/result/SajuFortuneSection.tsx
```

총 약 21개 파일 삭제. redirect로 외부 링크/SEO 보존.

## 4. SEO

### 4.1 JSON-LD URL 갱신

`app/layout.tsx` 의 `OfferCatalog.itemListElement` 모든 `url` 필드:

| Offer name | 기존 url | 새 url |
|---|---|---|
| 음악 입문/프로/마스터 | `.../services/music` | `.../music/packs` |
| 블로그 자동화 | `.../services/blog` | `.../work/blog` |
| AI 사주 분석 | `.../saju` | `.../work/saju` |
| 맞춤 개발 외주 | `.../freelance` | `.../work/freelance` |
| 웹사이트 제작 | `.../services/website` | `.../work/website` |

### 4.2 sitemap.xml

`app/sitemap.ts` 존재 시 자동 갱신 (Next.js routes 자동 반영). 없으면 신규 생성 권장 — 새 IA가 정착된 후 별도 task.

### 4.3 robots.txt

`/_next`, `/api` disallow 기존 그대로. 새 URL은 자연 허용.

### 4.4 Google Search Console

배포 후 운영자(CEO) 수동 작업:
1. URL Inspection으로 새 URL 5-10개 색인 요청 (`/music`, `/work`, `/work/freelance`, `/work/saju` 등 핵심)
2. 기존 URL의 301 redirect 정상 동작 확인

## 5. 마이그레이션 안전 전략

### 5.1 Phase 분할 (3 phase로 구현 안전성 확보)

**Phase A — 인프라 + 새 페이지 신설 (이번 작업 첫 part)**:
- `next.config.ts` redirects 8개 ⚠ 이 시점에서 원본 페이지도 살아있음 → 빌드 OK
- `app/music/*`, `app/work/*` 신규 페이지 생성 (컨텐츠 이동)
- 원본 페이지는 아직 살림 (Phase B에서 삭제)
- 빌드 통과: 둘 다 존재해도 OK (redirect는 source가 destination과 다르면 OK)

⚠️ 중요: redirect source `/services/music` + 동일 path의 file system route 존재 시 Next.js 동작:
- redirect가 파일 시스템 route보다 먼저 평가됨 → 원본 파일이 있어도 redirect 우선
- 따라서 Phase A 시점에서 원본 파일을 두면 빌드 X 회귀 X, 단지 dead code

**Phase B — 원본 페이지 삭제 + 헤더/메인 변경**:
- 원본 21개 파일 삭제 (SEO duplicate content 회피)
- TopNav LINKS 5→2
- `app/page.tsx` 안 2 적용
- PublicShell 푸터 URL 새 URL로
- JSON-LD URL 새 URL로

**Phase C — 검증 + sitemap**:
- 빌드 + 시각 회귀 + redirect 검증
- 운영자(CEO) Google Search Console 색인 요청

→ 이 spec은 위 3 phase 모두 포함. 다음 plan에서 phase별 task 분해.

### 5.2 모바일 햄버거 메뉴

TopNav LINKS 5→2이라 햄버거 메뉴도 간소화. P0/P1에서 이미 정돈된 패턴 유지.

### 5.3 `/api/*` 영향

API 라우트는 redirect 대상에 포함 안 함. 사주 페이지 내부에서 호출하는 `/api/saju/analyze`, `/api/saju/save-interpretation`, `/api/saju/lotto` 등은 그대로. 단, Link/fetch 시 absolute path는 변경 X.

## 6. 회귀 방지 체크리스트

이번 P1 작업이 깰 위험 있는 기능들:

- ✅ Phase 2 mypage 다운로드 — `/api/packs/*` 라우트 그대로 영향 없음
- ⚠️ 사주 AI 해석 — `/work/saju/result` 의 `SajuAISection.tsx`가 `/api/saju/*` 호출. 라우트 그대로 → 영향 없음
- ⚠️ Music 결제 — `/work/freelance` 또는 `/music/packs`에서 `PurchaseAgreementModal` 작동 확인 (계좌이체 흐름)
- ⚠️ Vercel 배포 후 외부 검색 인덱스 — 301 redirect 동작 확인
- ✅ admin 영역 — standalone shell, 영향 없음
- ⚠️ portfolio/[token], quote/[token] — `/work/freelance`의 sharing 흐름과 연동. URL 변경 확인 필요

## 7. 의도적 제외 (P3+)

- 자체 정가 표 (가격 결정 후)
- /about 페이지
- /work/automation 별도 페이지
- 사주 카탈로그 (49만 코어 + 11 모듈, 재정리 후)
- Custom Build 라인별 후기/리뷰
- Brand Hero 영상/모션 재디자인
- sitemap.xml 자동 생성 (`app/sitemap.ts`)
- Music/Custom Build 페이지별 hreflang (다국어)

## 8. 다음 단계

1. 이 spec 검토 (사용자)
2. 승인 후 → `superpowers:writing-plans` 로 implementation plan 작성
3. plan은 §5.1 Phase A/B/C로 task 분해 (약 15-20 task 예상)
4. plan 작성 후 → `superpowers:subagent-driven-development` 로 task별 실행
5. push 시점은 Phase B 완료 후 (전체 정합성 유지)

## 부록 A. 안 2 + 헤더 안 b 와이어프레임 텍스트

```
═══════════════════════════════════════════════════════
[TopNav]
JSM    Music    Custom Build           로그인  Try now
═══════════════════════════════════════════════════════

[BRAND HERO — kx-surface 검정 60vh]
   "현직 엔지니어가 만드는 두 가지."
    AI 제품, 그리고 맞춤 개발.

═══════════════════════════════════════════════════════

[TWO-UP CARDS]
┌──Music──────────────┐  ┌──Custom Build──────────┐
│  hero-bg.mp4 미니    │  │  타이포 모션             │
│  AI 음악 제품         │  │  맞춤 개발 사업부          │
│  ₩39,000~           │  │  외주·웹·사주·블로그        │
│  [Try now]          │  │  [견적 문의]              │
└─────────────────────┘  └─────────────────────────┘

═══════════════════════════════════════════════════════

[MUSIC 섹션]
- Features 3-step (Prompt / Visual / Publish)
- 트윗 마퀴 (현 메인 데이터 그대로)

═══════════════════════════════════════════════════════

[CUSTOM BUILD 섹션]
- 4 라인 카드 그리드 (외주 / 웹 / 사주 / 블로그)
- 납품 5건 미리보기 (lib/freelance-portfolio 데이터)
- [견적 문의하기] CTA → ContactModal('외주 개발 문의')

═══════════════════════════════════════════════════════

[FINAL CTA]
"어느 쪽이든 시작하세요."
[Music 팩 보기]  [견적 문의]

═══════════════════════════════════════════════════════

[FOOTER]
Music                Custom Build       Legal
  팩 상세             외주 개발            이용약관
  샘플                웹사이트 제작        개인정보
  스튜디오             AI 사주              환불
                      블로그 자동화
                      문의하기
═══════════════════════════════════════════════════════
```

## 부록 B. 확정 라인 요약표

| 결정 | 값 |
|---|---|
| 메인 안 | 안 2 (Brand Hero + 2-up Card) |
| 헤더 안 | 안 b (Music \| Custom Build \| Try now) |
| URL prefix | `/work`, `/music` |
| redirect 매핑 | 10개 (next.config.ts) |
| Custom Build 라인 수 | 4 (자동화는 외주 흡수) |
| 사주 통합 | 단순 URL 마이그, 카탈로그 보류 |
| 가격 표기 | 견적 문의 CTA만 (가격 결정 후 별도) |
| 외주 진행 5건 | 비공개 (납품 5건만) |
| /about 신설 | 미실시 (P3) |
| Brand Hero 영상 | hero-bg.mp4 blur+opacity 35% |
| Music 카드 가격 | ₩39,000~ 노출 |
| Custom Build 카드 가격 | 노출 X (견적 문의로 분기) |
| 마이그레이션 phase | A(인프라+신규) → B(원본 삭제+안 2) → C(검증) |
