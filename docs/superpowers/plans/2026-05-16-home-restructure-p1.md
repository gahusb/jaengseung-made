# 홈 재구조 P1 — IA 마이그레이션 + 메인 안 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 4월 27일 brainstorm의 A-1 결정(Music + Custom Build 두 사업부)을 실제 IA로 구현 — URL 마이그레이션 + 메인 안 2(Brand Hero + 2-up Card) + 헤더 안 b(Music | Custom Build | Try now).

**Architecture:** Phase A/B/C/D 분할로 빌드 무중단. Phase A는 인프라(redirects + portfolio 추출), Phase B는 신규 페이지 생성(원본 유지하며 컨텐츠 이동), Phase C는 메인/헤더/푸터 변경(원본도 새 라우트도 양쪽 존재 상태), Phase D는 원본 삭제 + 검증. 원본 페이지를 Phase D까지 살려두면 phase 중간 빌드가 깨지지 않는다.

**Tech Stack:** Next.js 16 App Router + TS + Tailwind v4 + Supabase. tsconfig path alias `@/*` 활용 (절대 경로 import로 depth 차이 해소).

**Spec:** `docs/superpowers/specs/2026-05-16-home-restructure-p1-design.md`

**⚠️ Subagent commit 주의:** Phase 2에서 일부 subagent commit이 sandboxing으로 git에 반영 안 되는 이슈 있었음. **모든 task의 마지막 step은 `git log --oneline -3` 직접 실행 + HEAD가 본인 commit인지 검증**. 아니면 BLOCKED 보고.

---

## File Structure

### Phase A (인프라 — 2 task)

| 파일 | 종류 | 책임 |
|---|---|---|
| `next.config.ts` | Modify | `redirects()` 함수에 10개 영구 리다이렉트 매핑 추가 |
| `lib/freelance-portfolio.ts` | Create | 현 `app/freelance/page.tsx`의 portfolio array 데이터 추출 (5건 사례). `/work` 허브 + `/work/freelance` 둘 다 import |

### Phase B (신규 페이지 — 9 task)

원본 페이지는 **유지**한 채 신규 위치에 컨텐츠 이동 + `@/` 절대 경로 import로 변환.

| 신규 파일 | 컨텐츠 출처 |
|---|---|
| `app/music/page.tsx` + `layout.tsx` | 신규 (Music 허브 — 3 카드 + 후기 압축) |
| `app/music/packs/page.tsx` + `layout.tsx` | 현 `app/services/music/page.tsx` + `layout.tsx` |
| `app/music/samples/page.tsx` | 현 `app/services/music/samples/page.tsx` |
| `app/music/studio/page.tsx` | 현 `app/studio/page.tsx` |
| `app/work/page.tsx` + `layout.tsx` | 신규 (Custom Build 허브 — 4 카드 + 5건 사례 + 견적 폼) |
| `app/work/freelance/page.tsx` + `layout.tsx` | 현 `app/freelance/{page,layout}.tsx` + `#automation` 섹션 강화 |
| `app/work/website/page.tsx` + `layout.tsx` | 현 `app/services/website/{page,layout}.tsx` |
| `app/work/website/samples/{bakery,corporate,dashboard,game,interior,portfolio,reading,shopping}/page.tsx` | 현 `app/services/website/samples/*/page.tsx` 8개 |
| `app/work/saju/page.tsx` + `layout.tsx` | 현 `app/saju/{page,layout}.tsx` |
| `app/work/saju/input/page.tsx` | 현 `app/saju/input/page.tsx` |
| `app/work/saju/result/page.tsx` + `SajuAISection.tsx` + `SajuFortuneSection.tsx` | 현 `app/saju/result/*` |
| `app/work/saju/components/SajuForm.tsx` | 현 `app/saju/components/SajuForm.tsx` |
| `app/work/blog/page.tsx` + `layout.tsx` | 현 `app/services/blog/{page,layout}.tsx` |

### Phase C (메인/헤더/푸터/SEO — 4 task)

| 파일 | 종류 | 책임 |
|---|---|---|
| `app/page.tsx` | Modify | 안 2 적용 (Brand Hero + 2-up + Music 섹션 + Custom Build 섹션 + Final CTA) |
| `app/components/TopNav.tsx` | Modify | LINKS 5개 → 2개 (Music / Custom Build) |
| `app/components/PublicShell.tsx` | Modify | 푸터 URL 8개 새 URL로 |
| `app/layout.tsx` | Modify | JSON-LD `OfferCatalog.itemListElement` 의 모든 `url` 새 URL로 |

### Phase D (원본 삭제 + 검증 — 2 task)

원본 25 파일 삭제:
```
app/services/music/{page,layout}.tsx
app/services/music/samples/page.tsx
app/studio/page.tsx
app/freelance/{page,layout}.tsx
app/services/website/{page,layout}.tsx
app/services/website/samples/{bakery,corporate,dashboard,game,interior,portfolio,reading,shopping}/page.tsx  ← 8개
app/services/blog/{page,layout}.tsx
app/saju/{page,layout}.tsx
app/saju/input/page.tsx
app/saju/result/{page,SajuAISection,SajuFortuneSection}.tsx
app/saju/components/SajuForm.tsx
```

검증: `npm run build`, `npx eslint`, redirect 시각 회귀, JSON-LD validator.

---

## Task 순서 + 의존성

```
Phase A
  A1 (next.config redirects) → A2 (lib/freelance-portfolio)
Phase B  (independent — A 완료 후 병렬 가능하나 subagent 충돌 회피 위해 순차)
  B1 (/music hub) → B2 (/music/packs) → B3 (/music/samples) → B4 (/music/studio)
  B5 (/work hub) → B6 (/work/freelance + #automation) → B7 (/work/website + 8 samples)
  B8 (/work/saju + input + result) → B9 (/work/blog)
Phase C  (B 완료 후)
  C1 (app/page.tsx 안 2) → C2 (TopNav) → C3 (PublicShell footer) → C4 (layout JSON-LD)
Phase D
  D1 (원본 25 파일 삭제) → D2 (build + lint + 시각 회귀 + Search Console)
```

총 17 task. 각 Phase는 자체 완료 시 빌드 통과. Phase B 모든 task 후에도 빌드 OK (원본 + 신규 양쪽 존재). Phase D 완료 후 SEO 정합성 보장.

---

# Phase A — 인프라

## Task A1: next.config.ts redirects 10개

**Files:**
- Modify: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\next.config.ts`

- [ ] **Step 1: 현재 next.config.ts 확인**

```bash
cat next.config.ts
```

기존 `headers()` 함수만 있음. `redirects()` 함수 신규 추가.

- [ ] **Step 2: redirects() 추가**

`next.config.ts` 의 `headers` 함수 다음에 `redirects` 함수 추가. 변경 후 전체:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // 기존 그대로 — 변경 X
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Music 사업부 마이그
      { source: '/services/music', destination: '/music/packs', permanent: true },
      { source: '/services/music/samples', destination: '/music/samples', permanent: true },
      { source: '/studio', destination: '/music/studio', permanent: true },
      // Custom Build 사업부 마이그
      { source: '/freelance', destination: '/work/freelance', permanent: true },
      { source: '/services/website', destination: '/work/website', permanent: true },
      { source: '/services/website/samples/:slug', destination: '/work/website/samples/:slug', permanent: true },
      { source: '/services/blog', destination: '/work/blog', permanent: true },
      // 사주 마이그 (단순 URL, 카탈로그 spec은 보류)
      { source: '/saju', destination: '/work/saju', permanent: true },
      { source: '/saju/input', destination: '/work/saju/input', permanent: true },
      { source: '/saju/result', destination: '/work/saju/result', permanent: true },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 3: 빌드 통과 확인**

```bash
npm run build 2>&1 | tail -10
```

⚠️ 현재 시점 — `/music/packs`, `/work/freelance` 등 destination 페이지가 아직 없음. Next.js redirect는 **destination 검증 X** → 빌드 OK. 단, 실제 redirect 시 destination이 404 → Phase B에서 페이지 생성 후 해결.

Expected: build success.

- [ ] **Step 4: 린트**

```bash
npx eslint next.config.ts
```

- [ ] **Step 5: 커밋**

```bash
git add next.config.ts
git commit -m "$(cat <<'EOF'
feat(routing): next.config.ts redirects() 10개 추가

P1 IA 마이그레이션 — 기존 URL → 새 URL 영구 리다이렉트 (permanent: true):
- /services/music → /music/packs
- /services/music/samples → /music/samples
- /studio → /music/studio
- /freelance → /work/freelance
- /services/website → /work/website
- /services/website/samples/:slug → /work/website/samples/:slug
- /services/blog → /work/blog
- /saju → /work/saju
- /saju/input → /work/saju/input
- /saju/result → /work/saju/result

이 시점에 destination 페이지 아직 없음 (Phase B에서 생성). 단, redirect 자체는 빌드 OK.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 6: ⚠️ git log 검증**

```bash
git log --oneline -3
```

기대: HEAD = 본인 commit, 직전 = `eaa0c18` (spec).

---

## Task A2: lib/freelance-portfolio.ts 추출

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\lib\freelance-portfolio.ts`

`/work` 허브와 `/work/freelance` 양쪽에서 import. 단일 소스.

- [ ] **Step 1: 현재 portfolio array 확인**

```bash
grep -n "const portfolio" app/freelance/page.tsx
```

`app/freelance/page.tsx` 6-73행 부근의 `const portfolio` 배열 확인. 5건 사례.

- [ ] **Step 2: lib/freelance-portfolio.ts 작성**

```ts
export interface PortfolioItem {
  title: string;
  category: string;
  desc: string;
  result: string;
  tags: string[];
  status: string;
  statusType: string;
  priceRange: string;
  accentColor: string;
  accentBg: string;
  borderAccent: string;
}

export const PORTFOLIO: PortfolioItem[] = [
  {
    title: '기업 브랜드 홈페이지',
    category: '웹사이트 제작 · Next.js',
    desc: '제조업체의 영업용 기업 소개 사이트. 서비스·연혁·팀 소개·문의 폼 포함. 모바일 반응형 및 SEO 최적화까지 포함하여 납품.',
    result: '납품 후 B2B 영업 미팅 시 "홈페이지 보고 연락했다" 비율 증가',
    tags: ['Next.js', 'Tailwind CSS', 'Vercel', 'SEO'],
    status: '납품 완료',
    statusType: 'done',
    priceRange: '50~200만원',
    accentColor: 'text-indigo-400',
    accentBg: 'bg-[#0d0a2e]',
    borderAccent: 'border-indigo-400/20',
  },
  {
    title: 'Gmail 자동화 RPA',
    category: 'RPA · 업무 자동화',
    desc: '거래처 이메일 수신 시 자동 분류, 답장 초안 작성, 담당자 알림 전송하는 Gmail 자동화 시스템.',
    result: '이메일 처리 시간 일 2시간 → 10분 (의뢰인 직접 확인)',
    tags: ['Python', 'Gmail API', 'Google Apps Script'],
    status: '납품 완료',
    statusType: 'done',
    priceRange: '30~150만원',
    accentColor: 'text-red-400',
    accentBg: 'bg-[#200a0a]',
    borderAccent: 'border-red-400/20',
  },
  {
    title: '쇼핑몰 가격 모니터링 봇',
    category: '웹 스크래핑 · 알림 자동화',
    desc: '경쟁사 쇼핑몰의 특정 상품 가격을 매일 모니터링하여 변동 시 텔레그램으로 즉시 알림.',
    result: '경쟁사 10곳 · 상품 50개 매일 자동 추적, 수동 확인 0분',
    tags: ['Python', 'Selenium', 'Telegram Bot'],
    status: '납품 완료',
    statusType: 'done',
    priceRange: '30~150만원',
    accentColor: 'text-violet-400',
    accentBg: 'bg-[#0d0a2e]',
    borderAccent: 'border-violet-400/20',
  },
  {
    title: '영업 일보 자동화 시스템',
    category: '엑셀 자동화 · 보고서 생성',
    desc: '영업 데이터 엑셀 파일을 자동으로 집계하여 일별/주별/월별 영업 일보 PDF를 생성하고 이메일 발송.',
    result: '보고서 작성 3시간 → 5분, 매일 09:00 자동 발송',
    tags: ['Python', 'OpenPyXL', 'ReportLab'],
    status: '납품 완료',
    statusType: 'done',
    priceRange: '30~150만원',
    accentColor: 'text-cyan-400',
    accentBg: 'bg-[#012030]',
    borderAccent: 'border-cyan-400/20',
  },
  {
    title: '부동산 공시지가 수집 시스템',
    category: '공공 데이터 · API 연동',
    desc: '국토교통부 공공 API를 통해 특정 지역 공시지가를 주기적으로 수집·저장하고 변동 알림 제공.',
    result: '전국 3개 지역 공시지가 주 1회 자동 수집·변동 알림',
    tags: ['Python', '공공데이터 API', 'PostgreSQL', 'Telegram'],
    status: '납품 완료',
    statusType: 'done',
    priceRange: '30~150만원',
    accentColor: 'text-blue-400',
    accentBg: 'bg-[#04102b]',
    borderAccent: 'border-blue-400/20',
  },
];
```

- [ ] **Step 3: 린트**

```bash
npx eslint lib/freelance-portfolio.ts
```

- [ ] **Step 4: 커밋**

```bash
git add lib/freelance-portfolio.ts
git commit -m "$(cat <<'EOF'
feat(packs): lib/freelance-portfolio — 외주 납품 5건 데이터 추출

/work 허브 + /work/freelance 양쪽 import. 단일 source of truth.
원본은 app/freelance/page.tsx — Phase B6에서 lib import로 교체.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: ⚠️ git log -3**

기대: HEAD = 본인 commit.

---

# Phase B — 신규 페이지 생성

각 task의 공통 패턴:
1. 원본 파일 Read
2. 신규 경로에 Write (`@/` 절대 경로 import로 변환 + 내부 `<Link href>` 새 URL로 변환)
3. 원본 파일은 그대로 유지 (Phase D에서 삭제)
4. 린트 + 빌드 통과 확인
5. 커밋
6. ⚠️ git log -3 검증

**중요 — 내부 Link 변환 규칙**: 원본 페이지 안에 `<Link href="/services/music/samples">` 같은 내부 링크가 있으면, 새 위치에서는 새 URL(`/music/samples`)로 변경. redirect로 우회되긴 하지만 직접 새 URL 쓰는 게 효율적이고 명확.

---

## Task B1: /music 허브 신설

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\music\page.tsx`
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\music\layout.tsx`

- [ ] **Step 1: layout.tsx**

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 음악 제품',
  description: 'Suno 프롬프트 + 뮤직비디오 워크플로우 + 유튜브 SEO 템플릿 한 팩에. 1시간 만에 음악·뮤비 완성.',
};

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 2: page.tsx — Music 허브**

`app/music/page.tsx`:

```tsx
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Music — AI 음악 제품',
};

const CARDS = [
  {
    href: '/music/packs',
    label: '팩 상세',
    desc: '입문 ₩39,000부터 — Suno 프롬프트북 + 뮤비 워크플로우 + SEO 템플릿',
    key: 'packs',
  },
  {
    href: '/music/samples',
    label: '샘플 갤러리',
    desc: '실제 결과물 — 장르별 데모 + 가사 + 영상 미리보기',
    key: 'samples',
  },
  {
    href: '/music/studio',
    label: 'AI 스튜디오',
    desc: 'Suno API 연동 — 직접 트랙 생성 (베타)',
    key: 'studio',
  },
];

export default function MusicHub() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative w-full min-h-[60vh] flex items-center justify-center px-6 border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#060e20] to-black pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-mono text-[11px] tracking-widest uppercase text-white/50 mb-4">
            Music
          </p>
          <h1
            className="kx-display text-4xl md:text-6xl font-bold mb-5"
            style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
          >
            AI 음악 제품
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Suno 프롬프트 + 뮤직비디오 워크플로우 + 유튜브 SEO 템플릿. 한 팩에 담긴 4단계 워크플로우로 1시간 안에 결과물 완성.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {CARDS.map((c) => (
            <Link
              key={c.key}
              href={c.href}
              className="group rounded-2xl border border-white/15 bg-white/[0.02] p-7 hover:border-white/40 hover:bg-white/[0.05] transition flex flex-col"
              style={{ textDecoration: 'none' }}
            >
              <h2 className="kx-display text-xl md:text-2xl font-bold text-white mb-3">
                {c.label}
              </h2>
              <p className="text-sm md:text-base text-white/60 leading-relaxed flex-1">
                {c.desc}
              </p>
              <span aria-hidden="true" className="mt-4 text-white/40 text-xs">→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: 린트 + 빌드**

```bash
npx eslint app/music/page.tsx app/music/layout.tsx
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: 커밋**

```bash
git add app/music/
git commit -m "$(cat <<'EOF'
feat(music): /music 허브 신설 — 3 카드 (팩 상세 / 샘플 / 스튜디오)

Music 사업부 진입점. /music/{packs,samples,studio} 으로 분기.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: ⚠️ git log -3**

---

## Task B2: /music/packs (현 /services/music 이동)

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\music\packs\page.tsx`
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\music\packs\layout.tsx`

- [ ] **Step 1: 원본 layout 복사**

```bash
cat app/services/music/layout.tsx
```

내용을 `app/music/packs/layout.tsx` 에 복사. 단, 만약 layout에 `'use client'` 또는 metadata 외 hooks가 있으면 그대로. import 경로는 `@/` 절대 경로로 변환.

- [ ] **Step 2: 원본 page.tsx 복사 + 변환**

```bash
cat app/services/music/page.tsx | wc -l
```

원본 read → `app/music/packs/page.tsx` 에 write. 변환 규칙:
- `import` 문에 `../../` 또는 `../components/` 등 상대 경로 → `@/app/components/...` 또는 `@/lib/...` 절대 경로로 교체
- 내부 `<Link href>` 중 P1 redirect 대상:
  - `href="/services/music"` → `href="/music/packs"`
  - `href="/services/music/samples"` → `href="/music/samples"`
  - `href="/studio"` → `href="/music/studio"`
  - `href="/services/blog"` → `href="/work/blog"`
  - `href="/freelance"` → `href="/work/freelance"`
  - `href="/saju"` → `href="/work/saju"`
- API route는 변경 X (`/api/*` 그대로)
- 그 외 모든 컨텐츠 동일

- [ ] **Step 3: 린트 + 빌드**

```bash
npx eslint app/music/packs/page.tsx app/music/packs/layout.tsx
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: 커밋**

```bash
git add app/music/packs/
git commit -m "$(cat <<'EOF'
feat(music): /music/packs — 현 /services/music 컨텐츠 이동

@/ 절대 경로 import + 내부 Link 새 URL로 변환.
원본 app/services/music/* 는 Phase D에서 삭제 (현재는 양쪽 존재 → redirect 우선).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: ⚠️ git log -3**

---

## Task B3: /music/samples (현 /services/music/samples 이동)

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\music\samples\page.tsx`

Task B2와 동일 패턴.

- [ ] **Step 1: 원본 복사 + 변환**

```bash
cat app/services/music/samples/page.tsx
```

→ `app/music/samples/page.tsx` 에 복사. import 절대 경로 + 내부 Link href 새 URL로.

- [ ] **Step 2: 린트 + 빌드**

```bash
npx eslint app/music/samples/page.tsx
npm run build 2>&1 | tail -10
```

- [ ] **Step 3: 커밋**

```bash
git add app/music/samples/
git commit -m "$(cat <<'EOF'
feat(music): /music/samples — 현 /services/music/samples 컨텐츠 이동

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3**

---

## Task B4: /music/studio (현 /studio 이동)

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\music\studio\page.tsx`

⚠️ 이 task는 depth 변경됨 (`app/studio/` 1 level → `app/music/studio/` 2 levels). 상대 경로 import는 반드시 `@/` 절대 경로로 변환.

- [ ] **Step 1: 원본 복사 + 변환**

```bash
cat app/studio/page.tsx | head -50
```

→ `app/music/studio/page.tsx` 에 복사. import 모두 `@/` 변환 + 내부 Link href 새 URL로.

- [ ] **Step 2: 린트 + 빌드**

```bash
npx eslint app/music/studio/page.tsx
npm run build 2>&1 | tail -10
```

- [ ] **Step 3: 커밋**

```bash
git add app/music/studio/
git commit -m "$(cat <<'EOF'
feat(music): /music/studio — 현 /studio 컨텐츠 이동

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3**

---

## Task B5: /work 허브 신설

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\work\page.tsx`
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\work\layout.tsx`

Custom Build 사업부 허브. 4 카드 + 5건 사례 미리보기 + 견적 폼 (ContactModal 트리거).

- [ ] **Step 1: layout.tsx**

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom Build — 맞춤 개발 사업부',
  description: '7년차 백엔드 개발자가 직접 설계·개발·납품. 외주 · 웹사이트 · AI 사주 · 블로그 자동화.',
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 2: page.tsx — Work 허브**

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import ContactModal from '@/app/components/ContactModal';
import { PORTFOLIO } from '@/lib/freelance-portfolio';
import { trackCTAClick } from '@/lib/gtag';

const CARDS = [
  {
    href: '/work/freelance',
    label: '외주 개발',
    desc: '맞춤 솔루션 외주 · RPA·API 연동·자동화 포함',
    key: 'freelance',
  },
  {
    href: '/work/website',
    label: '웹사이트 제작',
    desc: '기업·브랜드 사이트 · Next.js + SEO + 배포',
    key: 'website',
  },
  {
    href: '/work/saju',
    label: 'AI 사주',
    desc: 'AI 사주팔자 + 12개 항목 해석 (무료)',
    key: 'saju',
  },
  {
    href: '/work/blog',
    label: '블로그 자동화',
    desc: '수익 엔진 팩 · 자동화 마케팅 콘텐츠',
    key: 'blog',
  },
];

export default function WorkHub() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState('외주 개발 문의');

  const openContact = (service: string) => {
    setModalService(service);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <ContactModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalService('외주 개발 문의');
        }}
        service={modalService}
        checklist={['연락처/이메일', '원하는 작업 범위', '희망 일정']}
      />

      <section className="relative w-full min-h-[60vh] flex items-center justify-center px-6 border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#060e20] to-black pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-mono text-[11px] tracking-widest uppercase text-white/50 mb-4">
            Custom Build
          </p>
          <h1
            className="kx-display text-4xl md:text-6xl font-bold mb-5"
            style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
          >
            맞춤 개발 사업부
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            7년차 백엔드 개발자가 직접 설계·개발·납품. 외주, 웹사이트, AI 사주, 블로그 자동화까지.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CARDS.map((c) => (
            <Link
              key={c.key}
              href={c.href}
              onClick={() => trackCTAClick(`work_hub_card_${c.key}`)}
              className="group rounded-2xl border border-white/15 bg-white/[0.02] p-5 hover:border-white/40 hover:bg-white/[0.05] transition flex flex-col"
              style={{ textDecoration: 'none' }}
            >
              <p className="font-bold text-white text-sm mb-1.5">{c.label}</p>
              <p className="text-xs text-white/60 leading-relaxed flex-1">{c.desc}</p>
              <span aria-hidden="true" className="mt-3 text-white/40 text-xs">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-white/[0.02] border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-[11px] tracking-widest uppercase text-white/50 mb-4 text-center">
            Recent Deliveries
          </p>
          <h2 className="kx-display text-2xl md:text-3xl font-bold text-center mb-10">
            최근 납품 사례
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PORTFOLIO.map((p) => (
              <div
                key={p.title}
                className={`p-5 rounded-2xl border ${p.borderAccent} ${p.accentBg} flex flex-col`}
              >
                <p className={`font-mono text-[10px] uppercase tracking-widest ${p.accentColor} mb-2`}>
                  {p.category}
                </p>
                <h3 className="font-bold text-white text-sm leading-tight mb-2">{p.title}</h3>
                <p className="text-xs text-white/60 line-clamp-3 flex-1">{p.result}</p>
                <p className="text-xs text-white/40 mt-3">{p.priceRange}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="kx-display text-2xl md:text-4xl font-bold mb-5">
            견적이 필요하신가요?
          </h2>
          <p className="text-base text-white/70 mb-8">
            연락처 + 작업 범위 + 희망 일정만 알려주시면 24시간 내 답변드립니다.
          </p>
          <button
            onClick={() => {
              trackCTAClick('work_hub_cta');
              openContact('외주 개발 문의');
            }}
            className="kx-btn-primary inline-flex items-center px-7 py-3 rounded-full text-sm"
          >
            견적 문의하기
          </button>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: 린트 + 빌드**

```bash
npx eslint app/work/page.tsx app/work/layout.tsx
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: 커밋**

```bash
git add app/work/
git commit -m "$(cat <<'EOF'
feat(work): /work 허브 신설 — Custom Build 4 카드 + 5건 사례 + 견적 폼

- 4 카드: 외주 / 웹사이트 / AI 사주 / 블로그 (자동화는 외주 흡수)
- 납품 사례: lib/freelance-portfolio 5건 import
- 견적 CTA: ContactModal('외주 개발 문의')
- 가격 표 없음 — 가격 미정 (Phase 2/D에서 추가 예정)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: ⚠️ git log -3**

---

## Task B6: /work/freelance (현 /freelance 이동 + #automation 섹션 강화)

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\work\freelance\page.tsx`
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\work\freelance\layout.tsx`

⚠️ depth 변경 (1 level → 2 levels). `@/` 절대 import 필수.

- [ ] **Step 1: 원본 layout 복사**

```bash
cat app/freelance/layout.tsx
```

→ `app/work/freelance/layout.tsx` 에 복사. import 절대 경로.

- [ ] **Step 2: 원본 page.tsx 복사 + portfolio array → lib import**

`app/freelance/page.tsx` 내용을 `app/work/freelance/page.tsx`에 복사하되 다음 변경:

1. 파일 상단의 `const portfolio = [...]` 배열(약 5건) **삭제**
2. import 추가: `import { PORTFOLIO } from '@/lib/freelance-portfolio';`
3. 페이지 내부 `portfolio` 변수 참조를 `PORTFOLIO` 로 교체
4. import 절대 경로 (`@/app/components/...`, `@/lib/...`)
5. 내부 `<Link href>` 새 URL로 (`/freelance` → `/work/freelance` 등)
6. **`#automation` anchor 섹션 ID 추가**: portfolio 안에서 RPA/자동화 사례 3-4건이 있는 영역에 `<section id="automation">` 래핑 (또는 자동화 그룹 div에 id="automation" 부여). `/work/page.tsx`의 외주 카드 desc에 "RPA·API 연동·자동화 포함"이라 명시되므로, `/work/freelance#automation`으로 직접 진입 시 자동화 섹션이 viewport 상단에 오도록.

- [ ] **Step 3: 린트 + 빌드**

```bash
npx eslint app/work/freelance/page.tsx app/work/freelance/layout.tsx
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: 커밋**

```bash
git add app/work/freelance/
git commit -m "$(cat <<'EOF'
feat(work): /work/freelance — 현 /freelance 컨텐츠 이동 + #automation 앵커

- portfolio 데이터는 lib/freelance-portfolio import (양쪽 페이지 공유)
- 자동화 사례 그룹에 id="automation" 부여 → 직접 진입 가능
- import @/ 절대 경로 변환

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: ⚠️ git log -3**

---

## Task B7: /work/website + 8 samples (현 /services/website 이동)

**Files:**
- Create: `app/work/website/page.tsx`, `layout.tsx`
- Create: `app/work/website/samples/{bakery,corporate,dashboard,game,interior,portfolio,reading,shopping}/page.tsx` (8개)

⚠️ 동일 depth (3 levels — `services/website/samples/X` ≡ `work/website/samples/X`). 상대 경로 그대로 동작하지만 일관성 위해 `@/` 절대 경로로 변환 권장.

- [ ] **Step 1: layout + page**

```bash
cp app/services/website/layout.tsx app/work/website/layout.tsx
cp app/services/website/page.tsx app/work/website/page.tsx
```

복사 후 import 절대 경로 변환 + 내부 Link href 새 URL로:
- `/services/website/samples/...` → `/work/website/samples/...`
- 기타 `/services/*`, `/freelance`, `/saju`, `/studio` 등 새 URL로

- [ ] **Step 2: 8개 sample 페이지 복사**

```bash
mkdir -p app/work/website/samples
for s in bakery corporate dashboard game interior portfolio reading shopping; do
  mkdir -p "app/work/website/samples/$s"
  cp "app/services/website/samples/$s/page.tsx" "app/work/website/samples/$s/page.tsx"
done
```

각 sample 페이지에서 import `@/` 변환 + Link href 새 URL로. 8개 모두.

(만약 sample 페이지들이 자기 자신만 참조하고 외부 Link가 거의 없으면 변경 최소.)

- [ ] **Step 3: 린트 + 빌드**

```bash
npx eslint app/work/website/
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: 커밋**

```bash
git add app/work/website/
git commit -m "$(cat <<'EOF'
feat(work): /work/website + 8 samples — 현 /services/website 컨텐츠 이동

- 메인 페이지 + layout + 8 sample 페이지 (bakery, corporate, dashboard,
  game, interior, portfolio, reading, shopping)
- import @/ 절대 경로 변환

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: ⚠️ git log -3**

---

## Task B8: /work/saju + input + result + components (현 /saju 이동)

**Files:**
- Create: `app/work/saju/page.tsx`, `layout.tsx`
- Create: `app/work/saju/input/page.tsx`
- Create: `app/work/saju/result/page.tsx`, `SajuAISection.tsx`, `SajuFortuneSection.tsx`
- Create: `app/work/saju/components/SajuForm.tsx`

⚠️ depth 변경 (saju 1 → work/saju 2). `@/` 변환 필수. SajuForm 등 내부 컴포넌트 import 경로 조정.

- [ ] **Step 1: layout + main page**

```bash
cp app/saju/layout.tsx app/work/saju/layout.tsx
cp app/saju/page.tsx app/work/saju/page.tsx
```

import `@/`, Link href 새 URL로 (`/saju/input` → `/work/saju/input`, `/saju/result` → `/work/saju/result`).

- [ ] **Step 2: input + result**

```bash
mkdir -p app/work/saju/{input,result,components}
cp app/saju/input/page.tsx app/work/saju/input/page.tsx
cp app/saju/result/page.tsx app/work/saju/result/page.tsx
cp app/saju/result/SajuAISection.tsx app/work/saju/result/SajuAISection.tsx
cp app/saju/result/SajuFortuneSection.tsx app/work/saju/result/SajuFortuneSection.tsx
cp app/saju/components/SajuForm.tsx app/work/saju/components/SajuForm.tsx
```

각 파일에서:
- import 절대 경로 `@/`
- 내부 Link href 새 URL로
- 동일 폴더 내 sibling import (예: `./SajuAISection`, `../components/SajuForm`)은 새 위치 기준으로 그대로 유효 (depth 보존되므로)
- API route 호출(`/api/saju/*`)은 변경 X

- [ ] **Step 3: 린트 + 빌드**

```bash
npx eslint app/work/saju/
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: 커밋**

```bash
git add app/work/saju/
git commit -m "$(cat <<'EOF'
feat(work): /work/saju + input + result — 현 /saju 컨텐츠 이동

- saju 페이지 + 입력 폼 + 결과 + AI 해석 + 사주 컴포넌트 모두 이동
- 카탈로그 spec(49만 코어 + 11 모듈)은 보류 — 무료 사주 분석만 마이그
- API route /api/saju/* 변경 없음

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: ⚠️ git log -3**

---

## Task B9: /work/blog (현 /services/blog 이동)

**Files:**
- Create: `app/work/blog/page.tsx`, `layout.tsx`

- [ ] **Step 1: 복사**

```bash
mkdir -p app/work/blog
cp app/services/blog/layout.tsx app/work/blog/layout.tsx
cp app/services/blog/page.tsx app/work/blog/page.tsx
```

import `@/`, Link href 새 URL로.

- [ ] **Step 2: 린트 + 빌드**

```bash
npx eslint app/work/blog/
npm run build 2>&1 | tail -10
```

- [ ] **Step 3: 커밋**

```bash
git add app/work/blog/
git commit -m "$(cat <<'EOF'
feat(work): /work/blog — 현 /services/blog 컨텐츠 이동

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3**

---

# Phase C — 메인 + 헤더/푸터/SEO

## Task C1: app/page.tsx 안 2 적용

**Files:**
- Modify: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\page.tsx`

기존 메인(Hero / Features / Before-After / Use Cases / Custom Build 미니 / Final CTA 6 섹션)을 안 2 (Brand Hero + 2-up + Music 섹션 + Custom Build 섹션 + Final CTA 5 섹션)로 재구조.

기존 메인이 P0+안2 후속 작업을 이미 일부 반영 → 큰 변경은 Hero를 Brand Hero로 축소 + Two-up 카드 신설 + 일부 섹션 통폐합.

- [ ] **Step 1: 현재 app/page.tsx 구조 파악**

```bash
grep -nE "^\s*\{/\* [0-9]" app/page.tsx
```

기존 섹션 번호와 위치 확인.

- [ ] **Step 2: 전체 재작성**

`app/page.tsx` 전체를 다음으로 교체. 기존 BEFORE/AFTER/TWEETS_ROW_A/B 상수 + 마퀴 CSS는 Music 섹션에 그대로 보존:

(원본 page.tsx 의 BEFORE/AFTER/TWEETS_ROW_A/TWEETS_ROW_B 4 상수는 그대로 유지. 라인 9-43 부근)

새 page.tsx 구조 (스켈레톤 — 상세 JSX는 implementer가 기존 컨텐츠 그대로 가져와 배치):

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import ContactModal from './components/ContactModal';
import { GlassButton } from './components/LiquidGlass';
import { trackCTAClick } from '@/lib/gtag';
import { PORTFOLIO } from '@/lib/freelance-portfolio';

const BEFORE = [
  '작곡 공부에만 최소 6개월 소요',
  '영상 편집 프로그램 학습의 높은 장벽',
  '항상 불안한 저작권 위반 위험',
  '곡 하나 완성에 드는 수백만 원의 외주비',
];

const AFTER = [
  '단 1시간 만에 프로급 음원 & 영상 완성',
  '드래그 앤 드롭 수준의 직관적인 워크플로우',
  '가이드대로 따라하면 완벽한 저작권 해결',
  '커피 한 잔 가격으로 무한대 콘텐츠 생산',
];

// TWEETS_ROW_A, TWEETS_ROW_B: 기존 app/page.tsx 18-36행 그대로 보존
const TWEETS_ROW_A = [
  { name: '김민재', handle: 'minjae_shorts', time: '2h', body: '작곡 하나 못 하던 내가 3일 만에 쇼츠 채널 열었다. 프롬프트북 반칙 수준 ㄹㅇ' },
  { name: '이소영', handle: 'cafe_sohyang', time: '5h', body: '매장 BGM 직접 만들어요. 저작권 고민 없이 매달 플레이리스트 갈아끼우는 게 신기함.' },
  { name: '박도현', handle: 'dohyun_side', time: '1d', body: '퇴근 후 1시간 = 쇼츠 한 편. 애드센스 첫 수익이 3주 만에 꽂혔습니다. 팩값 회수 완료.' },
  { name: '정유진', handle: 'yujin_indie', time: '2d', body: '데모 작업 시간이 1/5로. 레퍼런스 탐색 → MV까지 한 번에. 인디 뮤지션들 다 써야 함.' },
  { name: '최현우', handle: 'hyunwoo_tube', time: '3d', body: '구독자 정체기였는데 AI 뮤비 시리즈로 알고리즘 탑승. 조회수 월 +320%.' },
  { name: '한지원', handle: 'jiwon_studio', time: '4d', body: '팩 안에 든 저작권 체크리스트가 실질적. Suno 약관 읽는 시간 아꼈다.' },
  { name: '오세린', handle: 'serin_mv', time: '5d', body: 'Runway 프리셋 그대로 써도 퀄 나옴. 프롬프트 설계가 반이네요.' },
  { name: '강태윤', handle: 'taeyun_ads', time: '6d', body: '광고 BGM 10개 찍어서 외주 드렸더니 클라이언트 반응이 달라졌습니다.' },
];

const TWEETS_ROW_B = [
  { name: '문가은', handle: 'gaeun_beats', time: '3h', body: '가사 생성 템플릿이 진짜 핵심. 한글 랩 가사 붙일 때 막히던 거 뚫렸어요.' },
  { name: '류현석', handle: 'hyun_creator', time: '7h', body: '쇼츠 업로드 루틴이 1시간 안에 끝남. 주말마다 10편씩 쌓고 있습니다.' },
  { name: '배수진', handle: 'sujin_pop', time: '1d', body: 'K-POP 스타일 프롬프트 조합 충격. 레퍼런스 없이도 그 느낌이 나옴.' },
  { name: '송재훈', handle: 'jaehun_lab', time: '2d', body: '1:1 Q&A 답변 속도 미쳤어요. 당일 회신 + 실무 디테일까지.' },
  { name: '조은비', handle: 'eunbi_vlog', time: '3d', body: '브이로그 BGM 자작하니까 조회수 + 체류시간 둘 다 올라감. 데이터가 말함.' },
  { name: '신도윤', handle: 'doyoon_snd', time: '4d', body: '스템 분리본이 포함된 게 진짜 크다. 믹싱 작업 훨씬 편해짐.' },
  { name: '윤채원', handle: 'chaewon_art', time: '5d', body: 'Midjourney 프롬프트 풀 가치가 팩값 넘음. 그냥 사세요.' },
  { name: '임준혁', handle: 'junhyuk_tune', time: '6d', body: '업데이트 진짜로 오네요. 2주 만에 V4.5 프롬프트 가이드 추가됨.' },
];

const CB_CARDS = [
  { href: '/work/freelance', label: '외주 개발', desc: '맞춤 솔루션 · RPA·API 자동화 포함', key: 'freelance' },
  { href: '/work/website', label: '웹사이트', desc: '기업·브랜드 사이트', key: 'website' },
  { href: '/work/saju', label: 'AI 사주', desc: '12개 항목 무료 해석', key: 'saju' },
  { href: '/work/blog', label: '블로그 자동화', desc: '수익 엔진 팩', key: 'blog' },
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState('일반 문의');

  const openContact = (service: string) => {
    setModalService(service);
    setModalOpen(true);
  };

  return (
    <div className="relative overflow-x-hidden bg-black text-white">
      <ContactModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalService('일반 문의');
        }}
        service={modalService}
        checklist={['연락처/이메일', '원하는 작업 범위', '희망 일정']}
      />

      {/* 1. Brand Hero — kx-surface 검정, 60vh, 텍스트 중심 */}
      <section
        className="relative w-full min-h-[60vh] flex items-center justify-center px-6 border-b border-white/10 overflow-hidden"
        style={{ background: 'var(--kx-surface)' }}
      >
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src="/hero-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
          style={{ filter: 'blur(8px)', opacity: 0.35 }}
        />
        <div className="absolute inset-0 bg-black/40 pointer-events-none" aria-hidden />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1
            className="kx-display text-4xl md:text-6xl lg:text-7xl font-bold mb-5 leading-[1.1]"
            style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
          >
            현직 엔지니어가 만드는
            <br />두 가지.
          </h1>
          <p className="text-base md:text-xl text-white/70 leading-relaxed">
            AI 제품, 그리고 맞춤 개발.
          </p>
        </div>
      </section>

      {/* 2. Two-up Cards */}
      <section className="py-20 px-6 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Music 카드 */}
          <Link
            href="/music"
            onClick={() => trackCTAClick('home_v7_card_music')}
            className="group relative rounded-2xl border border-white/15 overflow-hidden min-h-[280px] flex flex-col justify-end p-8 hover:border-white/40 transition"
            style={{ textDecoration: 'none' }}
          >
            <video
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              src="/hero-bg.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-hidden
              style={{ opacity: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <p className="font-mono text-[11px] tracking-widest uppercase text-white/60 mb-3">
                Music
              </p>
              <h2 className="kx-display text-2xl md:text-3xl font-bold text-white mb-2">
                AI 음악 제품
              </h2>
              <p className="text-sm md:text-base text-white/70 mb-4">
                Suno 프롬프트 + 뮤비 워크플로우 + 유튜브 SEO 한 팩에.
              </p>
              <p className="font-mono text-xs text-white mb-5">₩39,000~</p>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
                Try now <span aria-hidden>→</span>
              </span>
            </div>
          </Link>

          {/* Custom Build 카드 */}
          <Link
            href="/work"
            onClick={() => trackCTAClick('home_v7_card_work')}
            className="group relative rounded-2xl border border-white/15 overflow-hidden min-h-[280px] flex flex-col justify-end p-8 hover:border-white/40 transition"
            style={{
              textDecoration: 'none',
              background: 'linear-gradient(135deg, var(--kx-surface) 0%, rgba(204,151,255,0.15) 100%)',
              backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 40px)',
            }}
          >
            <div className="relative z-10">
              <p className="font-mono text-[11px] tracking-widest uppercase text-white/60 mb-3">
                Custom Build
              </p>
              <h2 className="kx-display text-2xl md:text-3xl font-bold text-white mb-2">
                맞춤 개발 사업부
              </h2>
              <p className="text-sm md:text-base text-white/70 mb-4">
                외주 · 웹사이트 · AI 사주 · 블로그 자동화
              </p>
              <p className="text-xs text-white/50 mb-5">납품 5건 · 견적 24h 내 답변</p>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
                견적 문의 <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Music 섹션 — Features 3-step + Before/After + Tweet 마퀴 (기존 메인 그대로) */}
      {/* 기존 app/page.tsx 의 Features 섹션 (101-182행) + Before/After (184-229) + Use Cases (231-278) 그대로 복사 */}

      {/* 4. Custom Build 섹션 — 4 카드 + 견적 CTA (기존 P0 미니섹션을 확장 + 자동화 카드 빠짐) */}
      <section className="py-24 px-6 bg-black text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono text-[11px] tracking-widest uppercase text-white/50 mb-4">
              Custom Build
            </p>
            <h2
              className="kx-display text-3xl md:text-5xl font-bold mb-5"
              style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
            >
              맞춤 개발이 필요하신가요?
            </h2>
            <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              7년차 백엔드 개발자가 직접 설계·개발·납품. 외주, 웹사이트, AI 사주, 블로그 자동화까지.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {CB_CARDS.map((card) => (
              <Link
                key={card.key}
                href={card.href}
                onClick={() => trackCTAClick(`home_v7_cb_card_${card.key}`)}
                className="group rounded-2xl border border-white/15 bg-white/[0.02] p-5 hover:border-white/40 hover:bg-white/[0.05] transition flex flex-col"
              >
                <p className="font-bold text-white text-sm mb-1.5">{card.label}</p>
                <p className="text-xs text-white/60 leading-relaxed flex-1">{card.desc}</p>
                <span aria-hidden="true" className="mt-3 text-white/40 text-xs">→</span>
              </Link>
            ))}
          </div>

          {/* 납품 5건 사례 미리보기 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-12">
            {PORTFOLIO.map((p) => (
              <div
                key={p.title}
                className={`p-4 rounded-2xl border ${p.borderAccent} ${p.accentBg} flex flex-col`}
              >
                <p className={`font-mono text-[9px] uppercase tracking-widest ${p.accentColor} mb-2`}>
                  {p.category}
                </p>
                <h3 className="font-bold text-white text-xs leading-tight mb-1.5">{p.title}</h3>
                <p className="text-[10px] text-white/50 line-clamp-2 flex-1">{p.result}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                trackCTAClick('home_v7_cb_cta');
                openContact('외주 개발 문의');
              }}
              className="kx-btn-primary inline-flex items-center px-7 py-3 rounded-full text-sm"
            >
              견적 문의하기
            </button>
          </div>
        </div>
      </section>

      {/* 5. Final CTA — 어느 쪽이든 시작하세요 */}
      <section className="relative w-full min-h-[400px] flex items-center justify-center px-6 py-24 bg-black overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src="/hero-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
          style={{ filter: 'blur(8px)', opacity: 0.35 }}
        />
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2
            className="kx-display text-3xl md:text-5xl font-bold mb-8"
            style={{ wordBreak: 'keep-all', letterSpacing: '-0.02em' }}
          >
            어느 쪽이든 시작하세요.
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <GlassButton
              href="/music"
              onClick={() => trackCTAClick('home_v7_final_music')}
              tint="rgba(255,255,255,0.18)"
              className="text-base"
            >
              <span className="text-white">Music 팩 보기</span>
            </GlassButton>
            <button
              onClick={() => {
                trackCTAClick('home_v7_final_work');
                openContact('외주 개발 문의');
              }}
              className="kx-btn-primary inline-flex items-center justify-center px-7 py-3 rounded-full text-base"
            >
              견적 문의
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
```

⚠️ Section 3 (Music 섹션 — Features 3-step + Before/After + Tweet 마퀴)는 기존 `app/page.tsx`의 해당 JSX 그대로 보존해야 함. 위 코드의 `{/* 3. Music 섹션 ... */}` 주석 위치에 기존 101-278행 JSX 그대로 삽입.

- [ ] **Step 3: 린트 + 빌드**

```bash
npx eslint app/page.tsx
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: 커밋**

```bash
git add app/page.tsx
git commit -m "$(cat <<'EOF'
feat(home): 메인 안 2 적용 — Brand Hero + 2-up + Music 섹션 + Custom Build + Final CTA

- Brand Hero: 60vh, "현직 엔지니어가 만드는 두 가지" + 영상 blur 35%
- Two-up: Music 카드(영상+₩39,000~) / Custom Build 카드(정적 그라데이션+견적)
- Music 섹션: 기존 Features+Before/After+마퀴 그대로 보존
- Custom Build 섹션: 4 카드 (자동화는 외주 흡수) + 납품 5건 사례 + 견적 CTA
- Final CTA: "어느 쪽이든 시작하세요" + 두 분기 CTA

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: ⚠️ git log -3**

---

## Task C2: TopNav LINKS 2개

**Files:**
- Modify: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\components\TopNav.tsx` (7-13행)

- [ ] **Step 1: LINKS 배열 변경**

현재 (line 7-13):
```ts
const LINKS = [
  { href: '/', label: '홈' },
  { href: '/services/music/samples', label: '샘플' },
  { href: '/services/music', label: '팩 상세' },
  { href: '/studio', label: '스튜디오' },
  { href: '/freelance', label: '외주' },
];
```

변경 후:
```ts
const LINKS = [
  { href: '/music', label: 'Music' },
  { href: '/work', label: 'Custom Build' },
];
```

⚠️ `Try now` 버튼 destination도 확인 — 현재 `/services/music` 으로 되어있으면 `/music` 로 변경 (또는 redirect 의존으로 그대로).

찾기:
```bash
grep -n "/services/music\|/freelance\|/saju\|/studio\|/services/blog\|/services/website" app/components/TopNav.tsx
```

각 사용처를 새 URL로 교체 (redirect로 처리되긴 하지만 직접 변환).

- [ ] **Step 2: 린트 + 빌드**

```bash
npx eslint app/components/TopNav.tsx
npm run build 2>&1 | tail -10
```

- [ ] **Step 3: 커밋**

```bash
git add app/components/TopNav.tsx
git commit -m "$(cat <<'EOF'
feat(nav): TopNav LINKS 5개 → 2개 (Music | Custom Build)

헤더 안 b 적용. /music, /work 각 사업부 허브로 진입.
Try now 버튼 destination 도 /music 으로 변경 (기존 /services/music).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3**

---

## Task C3: PublicShell 푸터 URL 갱신

**Files:**
- Modify: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\components\PublicShell.tsx`

P0에서 정돈된 푸터의 URL 8개를 새 URL로 교체.

- [ ] **Step 1: 푸터 grep**

```bash
grep -nE "(services/(music|blog|website)|freelance|saju|studio)" app/components/PublicShell.tsx
```

- [ ] **Step 2: URL 교체**

각 매칭 위치를 새 URL로:

| 기존 | 새 |
|---|---|
| `/services/music` | `/music/packs` |
| `/services/music/samples` | `/music/samples` |
| `/services/music#pricing` | `/music/packs#pricing` |
| `/freelance` | `/work/freelance` |
| `/services/website` | `/work/website` |
| `/saju` | `/work/saju` |
| `/services/blog` | `/work/blog` |
| `/studio` (있다면) | `/music/studio` |

또한 푸터 컬럼명 `Product` → `Music` 으로 변경 (사업부 명명 일치). 단, 기존 컬럼 구조 유지.

- [ ] **Step 3: 린트 + 빌드**

```bash
npx eslint app/components/PublicShell.tsx
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: 커밋**

```bash
git add app/components/PublicShell.tsx
git commit -m "$(cat <<'EOF'
feat(footer): PublicShell 푸터 URL 갱신 — 새 IA

- /services/music → /music/packs (외 7개 URL 교체)
- Product 컬럼명 → Music (사업부 명명 일치)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: ⚠️ git log -3**

---

## Task C4: layout.tsx JSON-LD URL 갱신

**Files:**
- Modify: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\layout.tsx`

JSON-LD `OfferCatalog.itemListElement` 의 모든 `url` 필드를 새 URL로.

- [ ] **Step 1: 현재 url 필드 grep**

```bash
grep -nE "(services/(music|blog|website)|freelance|saju|studio)" app/layout.tsx
```

- [ ] **Step 2: URL 교체**

각 url을 새 URL로 (Task C3와 동일 매핑).

`OfferCatalog` 안의 5개 Offer 항목 + 신규 외주/웹사이트 Offer 2개 (P0에서 추가) 등 모두 갱신.

- [ ] **Step 3: 빌드 (JSON-LD 문법 검증)**

```bash
npm run build 2>&1 | tail -10
```

JSON-LD가 빌드 단계에서 `JSON.stringify` 처리되므로 syntax 오류 시 즉시 실패.

- [ ] **Step 4: 커밋**

```bash
git add app/layout.tsx
git commit -m "$(cat <<'EOF'
feat(seo): JSON-LD OfferCatalog URL 갱신 — 새 IA

모든 Offer.url + itemOffered.url 필드를 새 URL로:
- /services/music → /music/packs
- /freelance → /work/freelance
- /services/website → /work/website
- /saju → /work/saju
- /services/blog → /work/blog

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: ⚠️ git log -3**

---

# Phase D — 원본 삭제 + 검증

## Task D1: 원본 25 파일 일괄 삭제

**Files (delete):**
- `app/services/music/{page,layout}.tsx`
- `app/services/music/samples/page.tsx`
- `app/studio/page.tsx`
- `app/freelance/{page,layout}.tsx`
- `app/services/website/{page,layout}.tsx`
- `app/services/website/samples/{bakery,corporate,dashboard,game,interior,portfolio,reading,shopping}/page.tsx` (8개)
- `app/services/blog/{page,layout}.tsx`
- `app/saju/{page,layout}.tsx`
- `app/saju/input/page.tsx`
- `app/saju/result/{page,SajuAISection,SajuFortuneSection}.tsx` (3개)
- `app/saju/components/SajuForm.tsx`

총 25 파일. 빈 디렉토리도 삭제.

- [ ] **Step 1: 삭제**

```bash
cd /c/Users/jaeoh/Desktop/workspace/jaengseung-made
git rm app/services/music/page.tsx app/services/music/layout.tsx
git rm app/services/music/samples/page.tsx
git rm app/studio/page.tsx
git rm app/freelance/page.tsx app/freelance/layout.tsx
git rm app/services/website/page.tsx app/services/website/layout.tsx
git rm app/services/website/samples/bakery/page.tsx
git rm app/services/website/samples/corporate/page.tsx
git rm app/services/website/samples/dashboard/page.tsx
git rm app/services/website/samples/game/page.tsx
git rm app/services/website/samples/interior/page.tsx
git rm app/services/website/samples/portfolio/page.tsx
git rm app/services/website/samples/reading/page.tsx
git rm app/services/website/samples/shopping/page.tsx
git rm app/services/blog/page.tsx app/services/blog/layout.tsx
git rm app/saju/page.tsx app/saju/layout.tsx
git rm app/saju/input/page.tsx
git rm app/saju/result/page.tsx
git rm app/saju/result/SajuAISection.tsx
git rm app/saju/result/SajuFortuneSection.tsx
git rm app/saju/components/SajuForm.tsx
```

빈 디렉토리 자동 정리 (git은 비어있는 디렉토리 추적 X).

- [ ] **Step 2: 빌드 통과 (필수)**

```bash
npm run build 2>&1 | tail -15
```

기대: 모든 라우트 빌드 성공. 신규 라우트(`/music/*`, `/work/*`) 모두 prerender + redirect 동작.

만약 깨지면 (예: 신규 페이지에서 삭제된 원본 위치 컴포넌트 import 잔존):
- 에러 메시지 확인
- 신규 페이지의 import path 수정 (`@/` 절대 경로 누락 검색)

- [ ] **Step 3: 린트**

```bash
npx eslint app/
```

- [ ] **Step 4: 커밋**

```bash
git commit -m "$(cat <<'EOF'
refactor(routes): 원본 25 파일 삭제 — Phase B에서 컨텐츠 이동 완료

Phase D 마무리:
- /services/music + /services/music/samples (3 파일)
- /studio (1)
- /freelance (2)
- /services/website + 8 samples (10)
- /services/blog (2)
- /saju + input + result + components (7)

next.config.ts redirects()로 외부 링크 보존 (영구 리다이렉트 301).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: ⚠️ git log -3**

---

## Task D2: 통합 검증 (build + lint + 시각 회귀 + Search Console)

**Files:** 코드 변경 없음. 검증 단계.

- [ ] **Step 1: 전체 빌드**

```bash
npm run build 2>&1 | tail -20
```

기대: 모든 라우트 success. 라우트 카운트는 P0 + Phase 2 + P1 후 약 80+개.

확인:
- `/music`, `/music/packs`, `/music/samples`, `/music/studio` — 4개 모두 빌드
- `/work`, `/work/freelance`, `/work/website`, `/work/website/samples/*` (8개), `/work/saju`, `/work/saju/input`, `/work/saju/result`, `/work/blog` — 12+개 모두 빌드
- `/services/*`, `/saju/*`, `/studio`, `/freelance` — **모두 사라짐** (삭제됨)

- [ ] **Step 2: 변경 핵심 파일 lint**

```bash
npx eslint \
  app/page.tsx \
  app/layout.tsx \
  app/components/TopNav.tsx \
  app/components/PublicShell.tsx \
  next.config.ts \
  lib/freelance-portfolio.ts \
  app/music app/work
```

기대: exit 0 또는 사전 존재 경고만.

- [ ] **Step 3: redirect 시각 회귀 (수동, 사용자 직접 확인)**

`npm run dev` 후 브라우저에서:

기존 URL → 새 URL 리다이렉트 검증:
- `http://localhost:3000/services/music` → 자동으로 `/music/packs` (URL 바뀜 + 페이지 정상)
- `http://localhost:3000/services/music/samples` → `/music/samples`
- `http://localhost:3000/studio` → `/music/studio`
- `http://localhost:3000/freelance` → `/work/freelance`
- `http://localhost:3000/services/website` → `/work/website`
- `http://localhost:3000/services/website/samples/bakery` → `/work/website/samples/bakery`
- `http://localhost:3000/services/blog` → `/work/blog`
- `http://localhost:3000/saju` → `/work/saju`
- `http://localhost:3000/saju/input` → `/work/saju/input`
- `http://localhost:3000/saju/result?year=1992&month=12&day=23&hour=16&gender=male&calendarType=solar` → `/work/saju/result?...` (쿼리 스트링 보존)

직접 URL 접근:
- `/` — 안 2 적용된 메인 (Brand Hero + 2-up + Music 섹션 + Custom Build 섹션 + Final CTA)
- `/music` — Music 허브 (3 카드)
- `/work` — Custom Build 허브 (4 카드 + 5건 사례 + 견적 폼)
- `/work/freelance#automation` — 자동화 섹션이 viewport 상단에 옴

헤더:
- 데스크톱: `JSM | Music | Custom Build | 로그인 (또는 마이페이지) | Try now (또는 로그아웃)`
- 모바일 햄버거: 2개 LINKS 표시

- [ ] **Step 4: JSON-LD 검증**

Google Rich Results Test (https://search.google.com/test/rich-results) 에 사이트 URL 또는 메인 페이지 source 붙여넣고:
- `LocalBusiness` 정상
- `OfferCatalog.itemListElement` 의 모든 `url` 새 URL로 (5+ 항목)
- 에러 0, 경고 최소

- [ ] **Step 5: Google Search Console 색인 요청 (운영자 수동)**

CEO 수동 작업:
1. Google Search Console 진입
2. URL Inspection으로 핵심 새 URL 5-10개 색인 요청:
   - `https://jaengseung-made.com/`
   - `https://jaengseung-made.com/music`
   - `https://jaengseung-made.com/music/packs`
   - `https://jaengseung-made.com/work`
   - `https://jaengseung-made.com/work/freelance`
   - `https://jaengseung-made.com/work/saju`
   - 등
3. 기존 URL의 301 redirect 정상 동작 확인 (예: `/services/music` 색인 상태 확인 → 30일 내 새 URL로 대체)

- [ ] **Step 6: P1 commit 요약 git log 확인**

```bash
git log --oneline eaa0c18..HEAD | wc -l
```

기대: 17 task commits (A1, A2, B1-B9, C1-C4, D1). D2는 코드 변경 없음.

```bash
git log --oneline eaa0c18..HEAD
```

전체 commit 리스트 출력 — 사용자가 review 가능.

이 task는 코드 변경 없음 — commit X.

---

# 부록 A. 안전성 분석 — 단계별 빌드 영향

| 시점 | 빌드 | 외부 사용자 영향 |
|---|---|---|
| Phase A 완료 후 (A1+A2) | OK | redirect 작동, destination 미존재 → 404 (P0 사용자가 새 URL 접근 시) |
| Phase B 진행 중 | OK (원본 + 신규 양쪽 존재) | redirect 작동하나 destination 일부만 존재. 진행 중인 phase 는 push 안 함 |
| Phase B 완료 (B9 후) | OK | 모든 destination 존재. 단, 원본 page도 존재 (dead route, redirect로 우회) |
| Phase C 진행 (C1-C4) | OK | 메인/헤더/푸터 변경 노출 (push 시) |
| Phase D 완료 (D1+D2) | OK | 원본 삭제, redirect만 남음. 사이트 정합성 보장 |

→ **push 시점은 Phase D 완료 후**. Phase A/B/C는 로컬 commit만, 일괄 push.

# 부록 B. 검증 인프라 메모

이 프로젝트는 jest/vitest/playwright 미설치. 각 task 검증은:
1. `npx eslint <변경 파일>` — TypeScript + ESLint
2. `npm run build` — Next.js 빌드 통과
3. (Phase D) 시각/수동 — dev 서버에서 redirect + 페이지 확인

D1 commit 후에는 **사용자가 직접 시각 회귀 수행 후 push 결정**. 자동 검증 한계.

# 부록 C. Subagent commit sandboxing 우려

Phase 2 에서 일부 subagent의 commit이 git에 반영 안 되는 sandboxing 이슈 있었음. 본 plan의 모든 task에 다음 step 포함:

```bash
git log --oneline -3
```

기대: HEAD가 본인 commit인지 직접 검증. 안 보이면 **BLOCKED + sandbox 의심 보고**.

# 부록 D. P3+ 후속 (이 plan 종료 후)

- 자체 정가 표 (가격 결정 후)
- /about 페이지
- /work/automation 별도 페이지 (분리 결정 시)
- 사주 카탈로그 49만 + 11 모듈 (재정리 후)
- Custom Build 라인별 후기/리뷰
- sitemap.xml 자동 생성
- Brand Hero 영상/모션 재디자인
- redirect 정합성 모니터링 (Search Console 30일)
