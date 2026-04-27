# 홈 재구조 P0 (외주 가시성 회복) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 외주 사업부가 사이트에 살아있다는 신호를 헤더·메인·푸터·SEO 4곳에 즉시 복원해서 외주 인입 손실을 막는다. P1의 IA 본 변경 전 자리잡기 작업.

**Architecture:** 기존 Music 톤(영상 hero · Bagel Fat One · 트윗 마퀴)을 깨지 않고 외주/웹사이트/사주/블로그 진입점만 추가한다. URL 변경·결제 인프라 변경·페이지 신설은 P1 이후로 연기. 자체 정가 표기는 가격이 미정이므로 P0에서는 가격 없이 라인 표지만.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind v4, lucide-react는 미설치(SVG 직접 사용)

**Spec:** `docs/superpowers/specs/2026-04-27-home-restructure-brainstorm.md`

---

## P0에서 다루지 않는 항목 (의도적 제외)

| 항목 | 이유 | 다음 단계 |
|---|---|---|
| 결제 = 계좌이체 단일화 | Music 팩(`/services/music`)·Blog 팩(`/services/blog`)은 `PurchaseAgreementModal` 통해 **이미 계좌이체** 단일화 상태 (케이뱅크 100-116-337157). 변경 불필요 | 사주 1,000원 PG는 별도 결정 필요(부록 A) |
| URL 마이그레이션 (`/freelance` → `/work/freelance` 등) | P1 본 작업 | P1 plan 별도 작성 |
| `/work` 우산 페이지 신설 | P1 본 작업 | P1 plan 별도 작성 |
| 자체 정가 가격표 | 가격 미정 | CEO 정가 확정 후 P1 |
| 자동화 라인 페이지 신설 | P2 | P2 plan |

---

## File Structure

P0는 4개 기존 파일 수정만. 새 파일 없음.

| 파일 | 책임 | 변경 |
|---|---|---|
| `app/components/TopNav.tsx` | 상단 네비게이션 | LINKS 배열에 외주 링크 1개 추가 |
| `app/components/PublicShell.tsx` | 푸터 포함 공용 셸 | 푸터 두 번째 컬럼명을 "Company" → "Custom Build", 항목 재정비 |
| `app/page.tsx` | 메인 홈 | Use Cases ↔ Final CTA 사이에 Custom Build 미니 섹션 1개 추가 |
| `app/layout.tsx` | 메타데이터 + JSON-LD | `OfferCatalog.itemListElement` 에 외주(Service) + 웹사이트(Service) 항목 추가 |

검증 인프라: 이 프로젝트는 jest/vitest/playwright 미설치. 각 task의 검증은 `npm run lint` + `npm run build` + 시각 확인으로 한다.

---

## Task 1: TopNav 외주 링크 추가

**Files:**
- Modify: `app/components/TopNav.tsx:7-12`

- [ ] **Step 1: 현재 LINKS 배열 확인**

`app/components/TopNav.tsx` 7-12행:
```ts
const LINKS = [
  { href: '/', label: '홈' },
  { href: '/services/music/samples', label: '샘플' },
  { href: '/services/music', label: '팩 상세' },
  { href: '/studio', label: '스튜디오' },
];
```

- [ ] **Step 2: 외주 링크 추가**

위 배열을 다음으로 변경:
```ts
const LINKS = [
  { href: '/', label: '홈' },
  { href: '/services/music/samples', label: '샘플' },
  { href: '/services/music', label: '팩 상세' },
  { href: '/studio', label: '스튜디오' },
  { href: '/freelance', label: '외주' },
];
```

**주의**: `isActive` 함수(36-40행)는 `/freelance` 같은 단순 경로에 대해 `pathname.startsWith(href)` 분기로 자동 작동함. 추가 변경 불필요.

- [ ] **Step 3: 린트 통과 확인**

```bash
npm run lint
```
Expected: 새 경고/에러 없음.

- [ ] **Step 4: dev 서버에서 시각 확인 (수동)**

```bash
npm run dev
```
브라우저 http://localhost:3000 에서:
- 데스크톱(md+): 헤더에 "홈 / 샘플 / 팩 상세 / 스튜디오 / 외주" 5개 노출
- "외주" 클릭 → `/freelance` 이동
- `/freelance` 페이지에서 "외주" 메뉴에 활성 표시(파란 언더라인) 떠야 함
- 모바일 햄버거: 5개 모두 노출 + "외주" 클릭 → `/freelance` 이동 + 메뉴 자동 닫힘
- 스크롤 시 알약형 글래스 헤더 폭(max-w-3xl)에서 5개 메뉴 깨지지 않음

- [ ] **Step 5: 커밋**

```bash
git add app/components/TopNav.tsx
git commit -m "feat(nav): TopNav에 외주(/freelance) 진입점 추가"
```

---

## Task 2: 푸터에 Custom Build 컬럼 추가

**Files:**
- Modify: `app/components/PublicShell.tsx:86-93`

- [ ] **Step 1: 현재 두 번째 컬럼(Company) 확인**

`app/components/PublicShell.tsx` 86-93행:
```tsx
<div>
  <p className="font-mono text-[11px] tracking-widest uppercase text-white/40 mb-4">Company</p>
  <ul className="space-y-2.5">
    <li><Link href="/saju" className="hover:text-white transition">AI 사주</Link></li>
    <li><Link href="/services/blog" className="hover:text-white transition">블로그 자동화</Link></li>
    <li><a href="mailto:bgg8988@gmail.com" className="hover:text-white transition">문의하기</a></li>
  </ul>
</div>
```

- [ ] **Step 2: Company → Custom Build로 변경 + 항목 재정비**

위 블록을 다음으로 교체:
```tsx
<div>
  <p className="font-mono text-[11px] tracking-widest uppercase text-white/40 mb-4">Custom Build</p>
  <ul className="space-y-2.5">
    <li><Link href="/freelance" className="hover:text-white transition">외주 개발</Link></li>
    <li><Link href="/services/website" className="hover:text-white transition">웹사이트 제작</Link></li>
    <li><Link href="/saju" className="hover:text-white transition">AI 사주</Link></li>
    <li><Link href="/services/blog" className="hover:text-white transition">블로그 자동화</Link></li>
    <li><a href="mailto:bgg8988@gmail.com" className="hover:text-white transition">문의하기</a></li>
  </ul>
</div>
```

**근거**:
- 사주·블로그는 spec(A-1)에 따라 Custom Build 산하로 묶임
- 외주(`/freelance`)·웹사이트(`/services/website`)는 푸터에서 처음 노출됨
- "문의하기" mailto는 Custom Build 라인 끝에 유지 (Company 컬럼 제거 대신)
- 자동화 별도 라인은 P2(`/work/automation`) 페이지 신설 시 추가

- [ ] **Step 3: 린트 통과 확인**

```bash
npm run lint
```
Expected: 경고/에러 없음.

- [ ] **Step 4: dev 서버에서 시각 확인 (수동)**

`/`, `/services/music`, `/freelance` 어디서든 푸터:
- 두 번째 컬럼명이 "CUSTOM BUILD"로 표시 (mono uppercase)
- 외주 개발 / 웹사이트 제작 / AI 사주 / 블로그 자동화 / 문의하기 — 5개 노출
- 모바일 (sm 이하)에서 grid가 2 columns로 떨어져도 깨지지 않음

- [ ] **Step 5: 커밋**

```bash
git add app/components/PublicShell.tsx
git commit -m "feat(footer): Company 컬럼을 Custom Build로 재정비 (외주·웹사이트 추가)"
```

---

## Task 3: 메인 페이지에 Custom Build 미니 섹션 추가

**Files:**
- Modify: `app/page.tsx` (Use Cases 섹션 직후, Final CTA 직전)

- [ ] **Step 1: 삽입 위치 확인**

`app/page.tsx`:
- Use Cases 섹션은 `{/* 4. Use Cases — Tweet Marquee */}` 주석으로 시작 (231행 부근)
- Final CTA 섹션은 `{/* 5. Final CTA — Full-width video */}` 주석으로 시작 (281행 부근)
- 두 섹션 사이에 Custom Build 미니 섹션을 삽입한다 (번호는 4.5)

- [ ] **Step 2: 새 섹션 코드 작성**

`{/* 5. Final CTA — Full-width video */}` 주석 **바로 위**에 다음 블록을 삽입:

```tsx
      {/* 4.5. Custom Build — 외주 사업부 미니 섹션 (P0) */}
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
              7년차 백엔드 개발자가 직접 설계·개발·납품. 외주, 웹사이트, 자동화부터 사주·블로그 솔루션까지.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {[
              { href: '/freelance', label: '외주 개발', desc: '맞춤 솔루션 외주', key: 'freelance' },
              { href: '/services/website', label: '웹사이트', desc: '기업·브랜드 사이트', key: 'website' },
              { href: '/freelance', label: '자동화', desc: 'RPA · API 연동', key: 'automation' },
              { href: '/saju', label: '사주 카탈로그', desc: 'AI 사주 솔루션', key: 'saju' },
              { href: '/services/blog', label: '블로그 자동화', desc: '수익 엔진 팩', key: 'blog' },
            ].map((card) => (
              <Link
                key={card.key}
                href={card.href}
                className="group rounded-2xl border border-white/15 bg-white/[0.02] p-5 hover:border-white/40 hover:bg-white/[0.05] transition flex flex-col"
                style={{ textDecoration: 'none' }}
              >
                <p className="font-bold text-white text-sm mb-1.5">{card.label}</p>
                <p className="text-xs text-white/60 leading-relaxed flex-1">{card.desc}</p>
                <span className="mt-3 text-white/40 text-xs">→</span>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                trackCTAClick('home_v6_custom_build_cta');
                setModalOpen(true);
              }}
              className="kx-btn-primary inline-flex items-center px-7 py-3 rounded-full text-sm"
            >
              견적 문의하기
            </button>
          </div>
        </div>
      </section>
```

**주의**:
- 외주와 자동화 두 카드 모두 `/freelance` 로 가도록 함 (자동화 별도 페이지는 P2). React `key`는 별도 `key` 필드로 충돌 방지.
- `setModalOpen` 와 `trackCTAClick` 는 같은 파일 상단에 이미 import/정의되어 있음 (각각 useState, `lib/gtag` import). 추가 import 없음.
- ContactModal은 같은 파일 50-55행에 이미 렌더링 중. 같은 modal 인스턴스를 그대로 재사용. service prop은 "일반 문의"로 두되, 사용자가 모달 안 select에서 "외주 개발 문의"를 고르도록 유도.
- 기존 파일은 5섹션 구조(Hero / Features / Before-After / Use Cases / Final CTA). 미니 섹션은 5섹션을 6섹션으로 늘리는 것.

- [ ] **Step 3: 린트 통과 확인**

```bash
npm run lint
```
Expected: 경고/에러 없음. 특히 `Link` import는 이미 page.tsx 4행에 있음을 확인.

- [ ] **Step 4: dev 서버에서 시각 확인 (수동)**

http://localhost:3000:
- Use Cases(트윗 마퀴) 직후, Final CTA 직전에 새 검은 배경 섹션이 등장
- "Custom Build" mono 라벨 + "맞춤 개발이 필요하신가요?" H2
- 5개 카드 그리드: md+ 5컬럼, 모바일 2컬럼(자동화는 4번째에서 줄바꿈)
- 각 카드 hover 시 border-white/40 + bg-white/[0.05] 효과
- 카드 클릭:
  - 외주 → `/freelance`
  - 웹사이트 → `/services/website`
  - 자동화 → `/freelance` (외주와 동일 destination, 의도된 동작)
  - 사주 카탈로그 → `/saju`
  - 블로그 자동화 → `/services/blog`
- "견적 문의하기" 버튼 클릭 → ContactModal 열림 + GA 이벤트 `home_v6_custom_build_cta` 발화 (개발자 도구 Network 또는 GA DebugView로 확인)

- [ ] **Step 5: 커밋**

```bash
git add app/page.tsx
git commit -m "feat(home): Final CTA 위에 Custom Build 미니 섹션 추가 (5라인 + 견적 CTA)"
```

---

## Task 4: JSON-LD OfferCatalog에 Custom Build 항목 추가

**Files:**
- Modify: `app/layout.tsx:89-99`

- [ ] **Step 1: 현재 itemListElement 확인**

`app/layout.tsx` 89-99행 부근:
```ts
hasOfferCatalog: {
  '@type': 'OfferCatalog',
  name: '쟁승메이드 AI 도구 · 서비스',
  itemListElement: [
    { '@type': 'Offer', price: '39000', /* music starter */ ... },
    { '@type': 'Offer', price: '99000', /* music pro */ ... },
    { '@type': 'Offer', price: '149000', /* music master */ ... },
    { '@type': 'Offer', price: '29000', /* blog */ ... },
    { '@type': 'Offer', price: '0', /* saju */ ... },
  ],
},
```

- [ ] **Step 2: 외주(Service)·웹사이트(Service) 2개 항목 추가**

`itemListElement` 배열의 마지막(사주 항목) **뒤**에 다음 두 객체를 추가:

```ts
          {
            '@type': 'Offer',
            url: 'https://jaengseung-made.com/freelance',
            availability: 'https://schema.org/InStock',
            itemOffered: {
              '@type': 'Service',
              name: '맞춤 개발 외주',
              url: 'https://jaengseung-made.com/freelance',
              description: '7년차 백엔드 개발자의 1:1 맞춤 소프트웨어 개발 외주. 자동화·API·웹/모바일 등 사이트 한정가로 제공.',
              serviceType: 'Custom Software Development',
              provider: { '@id': 'https://jaengseung-made.com/#person' },
              areaServed: '대한민국',
            },
          },
          {
            '@type': 'Offer',
            url: 'https://jaengseung-made.com/services/website',
            availability: 'https://schema.org/InStock',
            itemOffered: {
              '@type': 'Service',
              name: '웹사이트 제작',
              url: 'https://jaengseung-made.com/services/website',
              description: 'Next.js 기반 기업·브랜드 웹사이트 맞춤 제작. 반응형 + SEO + 배포 포함.',
              serviceType: 'Web Development',
              provider: { '@id': 'https://jaengseung-made.com/#person' },
              areaServed: '대한민국',
            },
          },
```

**주의**:
- `Offer.price` 는 의도적으로 생략 (자체 정가 미정. P1 가격 확정 시 추가)
- `priceCurrency` 도 생략. price 없는 Offer는 Schema.org validator에서 경고는 뜨지만 invalid는 아님
- `provider`는 기존 `@id` (Person 박재오) 재사용

- [ ] **Step 3: JSON 문법 검증 (Node)**

```bash
node -e "const m = require('./app/layout.tsx'); console.log('skip')"
```

→ 위는 .tsx 직접 실행이 안 되므로 **빌드로 통합 검증**:
```bash
npm run build
```
Expected: 빌드 성공. 메타데이터/JSON-LD가 페이지에 inline 삽입됨. JSON 문법 오류면 빌드 단계에서 즉시 실패.

- [ ] **Step 4: 렌더된 JSON-LD 확인 (수동)**

빌드 성공 후 dev 서버 띄워서 (`npm run dev`) http://localhost:3000 의 `<head>` 영역에 들어간 JSON-LD를 브라우저 DevTools "Elements" 탭에서 확인:
- `<script type="application/ld+json">` 의 `itemListElement` 가 7개로 늘어났는지
- 추가된 두 Service 항목의 `name`, `url`, `serviceType` 이 올바른지

선택적: https://search.google.com/test/rich-results 에 페이지 URL(또는 HTML) 붙여넣어 Schema 검증.

- [ ] **Step 5: 커밋**

```bash
git add app/layout.tsx
git commit -m "feat(seo): OfferCatalog에 외주·웹사이트 Service 항목 추가 (가격 미정)"
```

---

## Task 5: 전체 빌드/린트 통과 + 메모리 갱신

**Files:**
- 코드 변경 없음
- Update: `C:\Users\jaeoh\.claude\projects\C--Users-jaeoh-Desktop-workspace-jaengseung-made\memory\MEMORY.md` (선택)

- [ ] **Step 1: 전체 빌드 통과 확인**

```bash
npm run build
```
Expected:
- TypeScript 컴파일 통과
- 모든 라우트 빌드 성공
- 새 경고는 없거나 기존 수준

- [ ] **Step 2: 린트 통과 확인**

```bash
npm run lint
```
Expected: 새 경고 없음.

- [ ] **Step 3: 시각 회귀 점검 (수동)**

`npm run dev` 후 다음 페이지를 모두 한 번씩 브라우저로 열어서 깨진 곳 없는지 확인:
- `/` — 새 Custom Build 섹션이 Final CTA 위에 자연스러움
- `/freelance` — 헤더 "외주" 활성화
- `/services/music` — 음악 톤 그대로
- `/services/website` — 정상 렌더
- `/saju` — 정상 렌더
- 모바일 햄버거 메뉴 — 5개 항목 + 닫힘 작동
- 푸터 — 데스크톱·모바일 모두 Custom Build 컬럼 정상

- [ ] **Step 4: 메모리 갱신 (선택)**

P0 작업 완료 사실을 메모리에 기록할 필요는 낮지만, **결제 인프라 결정 사항**은 메모리에 저장해두면 미래 세션에 도움. 다음 내용을 새 메모리 파일로:

파일: `C:\Users\jaeoh\.claude\projects\C--Users-jaeoh-Desktop-workspace-jaengseung-made\memory\project_payment_decision.md`

```markdown
---
name: 결제 인프라 결정 (2026-04-27)
description: PG 도입 보류, 우선 계좌이체만. Music/Blog는 이미 적용, 사주 1,000원 결제는 미해결
type: project
---

# 결제 인프라 결정 (2026-04-27 CEO 확정)

- **방향**: PG 도입은 P3로 보류. 우선 계좌이체만 운영.
- **현재 상태**:
  - Music 팩(`/services/music`), Blog 팩(`/services/blog`): `PurchaseAgreementModal` 통한 계좌이체 (케이뱅크 100-116-337157 박재오) — 이미 적용됨
  - 사주 1,000원 AI 해석(`/saju/result`): `PaymentButton` 통한 PortOne PG 결제 — 미해결
- **사주 결제 미해결 옵션**:
  1. 1,000원 결제 비활성, 사주 AI 해석 무료 전환
  2. 사주 결제도 계좌이체로 (1,000원에 계좌이체 비현실적)
  3. PortOne 그대로 유지 (토스 해지와 별개로 살아있음)
- **다음 단계**: CEO 결정 필요

**Why:** 토스페이먼츠 해지 후 PG 부담 회피. 매출 검증 후 PG 재도입.
**How to apply:** 새 결제 항목 추가 시 모두 계좌이체 모달로. 사주 결제 결정 전까지 PaymentButton 신규 사용처 추가 금지.
```

그리고 `MEMORY.md` 인덱스에 한 줄 추가:
```markdown
- [결제 인프라 결정 2026-04-27](./project_payment_decision.md) — PG 보류, 계좌이체만. 사주 1,000원 미해결
```

- [ ] **Step 5: P0 완료 푸시 준비 (사용자 확인 후 git push)**

```bash
git log --oneline -10
```

기대 커밋 4개(또는 5개):
```
xxxxxxx feat(seo): OfferCatalog에 외주·웹사이트 Service 항목 추가 (가격 미정)
xxxxxxx feat(home): Final CTA 위에 Custom Build 미니 섹션 추가 (5라인 + 견적 CTA)
xxxxxxx feat(footer): Company 컬럼을 Custom Build로 재정비 (외주·웹사이트 추가)
xxxxxxx feat(nav): TopNav에 외주(/freelance) 진입점 추가
ea3ee0b chore: ignore .worktrees/ directory  ← 기존
```

`git push` 는 사용자 확인 후 수행.

---

## 부록 A. P0 외 의사결정 미해결 — CEO 입력 필요

| 항목 | 옵션 | 영향 |
|---|---|---|
| 사주 1,000원 PG 결제 처리 | (1) 무료 전환 / (2) 계좌이체 / (3) PortOne 유지 | P3 결제 인프라 결정과 연동 |
| 자체 정가 (외주·웹사이트) | 메모리 크몽 가격 - 수수료(20%) vs 별도 정가표 | P1 `/work` 가격표·JSON-LD price 채우기 |
| 회사 소개(`/about`) 신설 시점 | P2에서 만들지, 더 미룰지 | 푸터에 Company 컬럼 다시 살릴지 결정 |

## 부록 B. P1 미리보기 (별도 plan으로 작성 예정)

P0가 끝나면 다음 단계는 P1 — 메인 안 2 본 적용 + URL 마이그레이션:

1. `next.config.ts` `redirects()` 로 9개 경로 영구 리다이렉트
2. `/music` 허브 신설 (현 메인의 음악 콘텐츠 이전)
3. `/work` 허브 신설 (5라인 카드 + 납품 5건 + 견적 폼)
4. 메인 = Brand Hero + 2-up + Music 섹션 + Custom Build 섹션 + Final CTA (안 2)
5. 헤더 = Music | Custom Build | Try now (안 b)
6. 자체 정가 가격표 정돈 (CEO 정가 확정 전제)
7. 메타데이터 `title.template` 분기

## 부록 C. 검증 인프라 메모

이 프로젝트는 jest/vitest/playwright/cypress 미설치. 자동 테스트 작성을 P0에 포함하지 않음. 검증은 다음 3-단계로 한다:

1. `npm run lint` — TypeScript + ESLint
2. `npm run build` — Next.js 빌드 통과(JSON-LD 문법 포함)
3. 시각/수동 — dev 서버에서 라우팅·hover·모바일 확인

P2 또는 P3에서 Playwright 도입 검토 (사이트 규모가 충분히 커진 후).
