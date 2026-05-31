# 쟁승메이드 SaaS 전환 — 단계별 마이그레이션 계획

> **For agentic workers:** 이 문서는 **단계별 마이그레이션 계획**이다(엄격한 TDD task-by-task 아님). Phase 단위로 목표·변경 항목·영향 파일·검증·완료조건을 정의한다. 각 Phase는 독립적으로 배포 가능한 단위가 되도록 설계했다. 체크박스(`- [ ]`)로 진행을 추적한다.

**Goal:** 2026-05-29 정체성 재정의("Music + Custom Build 두 사업부" → **"SaaS 제품 판매 + 커스텀 외주 병행"**)를 실제 코드베이스에 단계적으로 반영한다.

**Architecture:** 기존 IA(상단 `/music` · `/work` 2분할)를 **SaaS 패키지(월 구독) + 커스텀 외주(1회 직판)** 구조로 재편한다. 블로그 자동화는 완전 제거, **AI 음악은 구독으로 가지 않고 "AI 음악 생성 개발 가이드 패키지" 단품으로 디벨롭**, 사주는 별도 도메인으로 분리한다. 구독 인프라(`subscriptions` 테이블 · `subscription-expiry` cron · `products.ts` 의 `monthly` 타입)는 **이미 존재**하므로, 향후 메이킹 검증 자동화가 나올 때 재활용한다(음악 이탈로 첫 구독 패키지는 미정).

**Tech Stack:** Next.js 16 (App Router, TS) · Tailwind v4 · Supabase(Postgres + RLS) · Resend · Vercel · Toss/Portone 결제

**상태:** 초안 (2026-05-31). Phase 1·2는 즉시 실행 가능. Phase 3·4는 "7월 본격" 의존. Phase 5는 대상 도메인 결정 후 착수.

---

## 0. 배경 & 출처

- 의사결정 출처: Obsidian 위키 `wiki/사업-쟁승메이드.md` "정체성 재정의 (2026-05-29)" 섹션 + [[프로젝트-쟁승메이드-Co]].
- 4단계 brainstorming 결과(박재오 명시):
  - 정체성: **SaaS 제품 판매 + 커스텀 외주 병행**
  - 블로그 자동화: **❌ 완전 삭제** (2026-05-17 폐기 결정의 코드 흔적 정리)
  - AI 음악 39k/99k/149k 1회 직판 → ~~SaaS 월 구독 흡수~~ → **2026-05-31 정정: 구독 폐기, "AI 음악 생성 개발 가이드 패키지" 단품으로 디벨롭**
  - 사주 카탈로그: **별도 도메인 마이그레이션** ([[프로젝트-쟁승메이드-Co]]의 갈래 2 도전 줄기)
  - 외주: **❌ 크몽·숨고 절대 안 함** → 인스타 카드뉴스(Hedgy75) 직접 유입
  - 수익 모델: **1(SaaS 구독) 메인 + 5(외주 직판) 보조**

---

## 1. 현재 상태 진단 (코드 기준 갭 분석)

| 영역 | 현재 코드 상태 | 목표 | Phase |
|------|--------------|------|-------|
| 블로그 자동화 | `/work/blog` 라우트 + 9개 파일 참조 + JSON-LD Offer + sitemap 잔존 | 완전 제거 | **P1** |
| IA / 네비게이션 | TopNav `Music`·`Custom Build`, footer 2그룹 | SaaS 제품 / 커스텀 외주 구조 | **P2** |
| 외부 마켓 문구 | `STRATEGY.md` 등에 프리랜서 마켓 전제 | 크몽·숨고 미사용 + 인스타 유입 명시 | **P2** |
| SaaS 패키지 카탈로그 | 없음 (개별 서비스 페이지만) | 월 구독 패키지 카탈로그 (첫 패키지 후보 미정) | **P3 (대기)** |
| 구독 인프라 | `subscriptions` 테이블·cron·`products.ts(monthly)` **존재** | 보존, 향후 검증 자동화에 재활용 | P3 |
| AI 음악 | `/music/packs` 3티어 1회 결제 | **단품 유지 + "개발 가이드 패키지"로 디벨롭** (구독 ❌) | **P4** |
| 사주 | `/work/saju` + API 4종 + lib 3종, 사이트 내장 | 별도 도메인 분리 + 301 | **P5** |

### 죽은 코드 / 즉시 정리 가능
- `lib/blog-tools/generator.ts` — **어디서도 import 안 됨**(grep 확인). 삭제 안전.

### 의사결정 — 2026-05-31 박재오 확정 (5건)
> 2026-05-31 박재오 결정으로 보류 5항목을 아래와 같이 해소·갱신.

1. ✅ **음악 = 구독 안 함** — 월 구독 폐기. **"AI 활용 음악 생성 개발 가이드 패키지"로 디벨롭하여 단품(1회) 판매 유지.** → P4 재정의(구독 전환 → 단품 디벨롭).
2. ✅ **기존 1회 구매자 = 0명** — 실제 구매 이력 없음. grandfathering 불필요. "구매자 없음" 사실만 기록하고 **다시 논점으로 떠오르지 않도록** 처리. → P4.
3. ⏸ **사주 분리 대상 도메인 = 대기** — 도메인 미구매. **구매 완료 전까지 P5 착수 보류.** 도메인 확정이 P5 유일 블로커.
4. 🔍 **사주 DB = 기존 Supabase 기본 + NAS 셀프호스팅 검토** — 일단 현 Supabase 유지. 단, **NAS(Postgres) 자체 호스팅으로 옮기는 안을 별도 검토**(비용·백업·외부 접근·RLS 대체). → P5 내 검토 작업으로 편입.
5. ✅ **사주 결제 이력 = 전부 이전** — `orders`/`subscriptions`의 사주(`saju_detail` 등) 결제·주문 데이터를 **신규 도메인 DB로 전량 마이그레이션**. → P5.

---

## Phase 1 — 블로그 자동화 완전 삭제 ✅ (2026-05-31 완료)

**목표:** `/work/blog` 라우트와 모든 코드/메타/마케팅 흔적을 제거하고, 기존 URL은 안전하게 처리한다.

**영향 파일 (모두 확인됨):**
- 삭제: `app/work/blog/page.tsx`, `app/work/blog/layout.tsx`, `app/work/blog/` 폴더
- 삭제: `lib/blog-tools/generator.ts` (+ 빈 `lib/blog-tools/` 폴더)
- 수정: `app/components/PublicShell.tsx` — footer "Custom Build" 그룹의 `블로그 자동화` 링크 제거
- 수정: `app/work/page.tsx` — line 29~32 `blog` 카드 객체 제거, line 70 카피에서 "블로그 자동화" 제거
- 수정: `app/page.tsx` — line 50 `blog` 카드 제거, line 163·369 카피에서 "블로그 자동화" 제거
- 수정: `app/layout.tsx` — line 30 keywords "블로그 자동화" 제거, line 77·84 description 수정, line 96 JSON-LD `블로그 자동화 솔루션 팩` Offer 객체 제거
- 수정: `app/legal/refund/page.tsx` — line 21 환불 대상 목록에서 "블로그 자동화 솔루션 팩" 제거
- 수정: `app/sitemap.ts` — line 10 `/services/blog` 엔트리 제거 (+ `/work/blog` 엔트리 있으면 제거)
- 수정: `next.config.ts` — `/services/blog → /work/blog` 리다이렉트 처리 (아래 정책 참조)
- 유지(변경 X): `app/work/website/page.tsx:106` "개인 블로그…" = 웹사이트 제작 예시 카피일 뿐 블로그 자동화 상품 아님. `app/admin/marketing/page.tsx:79·81` "블로그/SNS" = 배너 활용처 설명. 둘 다 **건드리지 않음**.

**리다이렉트 정책:**
- `next.config.ts`의 `{ source: '/services/blog', destination: '/work/blog', permanent: true }` → `/work/blog`가 사라지므로 **목적지를 `/work`로 변경** (제품 라인 허브로 안내). 410(Gone)보다 301→`/work`가 SEO·UX상 안전.

**작업 체크리스트:**
- [ ] 1-1. `app/work/blog/` 폴더 전체 삭제
- [ ] 1-2. `lib/blog-tools/` 폴더 전체 삭제
- [ ] 1-3. 위 "수정" 파일 7개에서 블로그 참조 제거 (정확 라인은 작업 시점 재확인 — 리팩터로 이동 가능)
- [ ] 1-4. `next.config.ts` 리다이렉트 목적지 `/services/blog → /work` 로 변경
- [ ] 1-5. 검증: `grep -rn "work/blog\|블로그 자동화\|blog-tools" app lib components` → **0건** (단 1-3 유지 항목 제외)
- [ ] 1-6. 검증: `npm run build` 성공 (타입·링크 깨짐 없음)
- [ ] 1-7. 검증: 로컬에서 `/work/blog` 접속 시 404, `/services/blog` 접속 시 `/work`로 301
- [ ] 1-8. 커밋: `chore(blog): /work/blog 라우트·참조·메타 완전 제거 (2026-05-29 재정의)`

**완료 조건:** 블로그 자동화의 라우트·UI 링크·구조화 데이터·sitemap·환불약관·죽은 lib가 모두 사라지고, 빌드 성공 + 기존 URL 301 처리됨.

---

## Phase 2 — IA 재편: "SaaS 제품 + 커스텀 외주 병행" ✅ (2026-05-31 완료)

> **실제 구현 메모:** TopNav를 2탭이 아니라 **3탭(SaaS 제품 `/packages` · AI 음악 `/music` · 커스텀 외주 `/work`)**으로 구성했다. 음악이 단품으로 분리되면서 "SaaS 제품" 라벨이 음악을 가리키는 모순을 피하고 음악 발견성을 유지하기 위함(박재오 결정). Footer도 동일 3그룹 + Legal로 정렬.

**목표:** 상단/푸터 네비게이션과 홈 카피를 새 정체성에 맞게 재편한다. 코드 라우트 대규모 이동 없이 **라벨·그룹핑·카피 수준**에서 먼저 정렬한다(라우트 실이동은 P3에서).

**핵심 결정:** `/music`·`/work` 라우트 경로는 **유지**(301 리다이렉트 누적 회피). 사용자 노출 라벨만 SaaS/커스텀 프레이밍으로 변경.

| 위치 | 현재 라벨 | 변경안 |
|------|---------|--------|
| TopNav | `Music` / `Custom Build` | `SaaS 제품` / `커스텀 외주` (경로는 `/music`·`/work` 유지) |
| Footer 그룹 | `Music` / `Custom Build` | `SaaS 제품` / `커스텀 외주` |
| 홈 Hero/카피 | "두 사업부" 뉘앙스 | "검증된 자동화를 SaaS로 + 필요 시 커스텀 외주" 한 문장 |

**영향 파일:**
- 수정: `app/components/TopNav.tsx` — line 10~11 `NAV` 배열 라벨 (`Music`→`SaaS 제품`, `Custom Build`→`커스텀 외주`). `href`는 유지.
- 수정: `app/components/PublicShell.tsx` — footer 그룹 헤더 라벨 2곳
- 수정: `app/page.tsx` — Hero·소개 카피 (line 163·369 인근, 새 정체성 1문장)
- 수정: `app/work/page.tsx` — 허브 카피 (line 70 인근)
- 수정(문구): `STRATEGY.md` — "프리랜서 마켓/숨고/크몽" 전제 문장에 **"크몽·숨고 미사용 — 인스타 카드뉴스(Hedgy75) 직접 유입"** 정책 주석 추가 (전체 재작성은 P6/별도)

**작업 체크리스트:**
- [ ] 2-1. TopNav·Footer 라벨 SaaS/커스텀 프레이밍으로 변경 (경로 불변)
- [ ] 2-2. 홈·work 허브 카피를 새 정체성 1문장으로 정렬
- [ ] 2-3. `STRATEGY.md`에 외주 유입 채널 정책(크몽·숨고 ❌ / 인스타 ⭕) 주석 추가
- [ ] 2-4. 검증: `grep -rn "Custom Build\|두 사업부" app components` → 의도된 잔존만 남음
- [ ] 2-5. 검증: `npm run build` 성공 + 헤더/푸터 라벨 육안 확인
- [ ] 2-6. 커밋: `refactor(ia): 네비게이션·카피를 SaaS+커스텀 외주 정체성으로 재편`

**완료 조건:** 방문자가 보는 1차 프레이밍이 "SaaS 제품 + 커스텀 외주"로 통일되고, 외부 마켓 미사용 정책이 문서에 명시됨. 라우트 경로는 불변이라 회귀 위험 최소.

---

## Phase 3 — SaaS 패키지 카탈로그 구조 도입 🟡 (골격 구현됨 — 첫 패키지만 대기)

**목표:** "검증된 자동화 → SaaS 월 구독 패키지" 구조를 담을 **카탈로그 페이지 + 데이터 모델**을 만든다. 결제는 기존 `subscriptions` 인프라에 연결한다.

> 🟡 **상태: 골격 구현 완료(2026-05-31), 첫 제품만 대기.** 박재오 결정으로 P3의 **확장 골격을 먼저 구현**했다(빈 카탈로그도 깨지지 않고, 제품 추가 시 자동 노출). 남은 것은 **첫 SaaS 제품 1개 확정 + 등록**뿐이다. 메이킹 스페이스에서 검증된 자동화가 나오면 `SAAS_CATALOG` 배열에 항목 1개 추가 + `lib/products.ts`에 `monthly` 상품 추가하면 된다. 구독 인프라는 보존됨.
>
> **구현 완료분 (2026-05-31):**
> - 경로명 **`/packages` 확정** (결정 포인트 해소).
> - `lib/saas-catalog.ts` — `SaasCatalogItem` 데이터 모델 + `SAAS_CATALOG` 배열(현재 빈 배열) + `getAvailablePackages()`/`getComingSoonPackages()` 헬퍼.
> - `app/packages/page.tsx` + `layout.tsx` — available 카드 그리드 / coming_soon 흐린 카드 / **available 0개일 때 예고 히어로 + "출시 알림 받기"**(기존 `ContactModal` 재사용, `service='SaaS 출시 알림 신청'`).
> - TopNav·Footer "SaaS 제품" → `/packages` 연결, sitemap 등록.
>
> **남은 것 (첫 제품 확정 후):** `SAAS_CATALOG`에 `status:'available'` 항목 추가, `lib/products.ts` `monthly` 상품 추가, `/api/subscription` product_id 처리 확인, 결제→`subscriptions` row→mypage→cron 만료 end-to-end 검증, `/packages/[slug]` 상세(필요 시).

**전제:** 메이킹 검증 자동화 1개 확정 후 착수. (음악은 더 이상 첫 패키지 아님 — P4 단품 라인으로 분리.)

**영향 파일:**
- 신규: `app/saas/page.tsx` (또는 `/packages`) — SaaS 패키지 카탈로그(월 구독 카드 그리드). 경로명 확정 필요(아래 결정 포인트).
- 신규: `app/saas/layout.tsx` — 메타데이터
- 수정: `lib/products.ts` — SaaS 패키지 상품 정의(`type: 'monthly'`) 추가. 기존 `monthly` 타입 패턴(`stock_starter_monthly` 등) 그대로 따름.
- 수정: `app/api/subscription/route.ts` — 신규 패키지 product_id 처리(기존 흐름 재활용 확인)
- 수정: `app/components/TopNav.tsx` — `SaaS 제품` 항목 목적지를 `/music` → `/saas`로 전환(P4 완료 시점에 맞춰)
- 참조(변경 X): `supabase/migrations/004_subscriptions.sql`, `app/api/cron/subscription-expiry/route.ts` — 그대로 사용

**결정 포인트:**
- 경로명: `/saas` vs `/packages` vs `/products` — 1개 확정. (권장: `/packages` — 한국어 노출 "패키지"와 자연 매칭)
- 첫 패키지 = 음악 1개로 시작할지, 메이킹 검증 자동화 1~2개를 동시 등판할지.

**작업 체크리스트:**
- [ ] 3-1. 경로명·첫 패키지 범위 확정 (박재오)
- [ ] 3-2. `lib/products.ts`에 SaaS 패키지 상품 추가(`monthly`)
- [ ] 3-3. 카탈로그 페이지 + layout 생성 (구독 카드 → `subscription` API 연결)
- [ ] 3-4. 기존 `subscriptions` 테이블·만료 cron으로 신규 패키지 생명주기 동작 확인
- [ ] 3-5. 검증: 테스트 결제 → `subscriptions` row 생성 → mypage 노출 → cron 만료 처리
- [ ] 3-6. 검증: `npm run build` 성공
- [ ] 3-7. 커밋: `feat(saas): SaaS 월 구독 패키지 카탈로그 + 구독 연결`

**완료 조건:** SaaS 패키지를 카탈로그에서 구독 결제 → `subscriptions`에 기록 → mypage에서 확인 → 만료 cron 동작까지 end-to-end 성립.

---

## Phase 4 — AI 음악: "음악 생성 개발 가이드 패키지" 단품으로 디벨롭 ✅ (2026-05-31 완료)

**목표:** `/music/packs`를 **월 구독으로 전환하지 않는다.** 기존 39k/99k/149k **1회 결제 구조를 유지**하되, 상품의 정체성을 **"AI를 활용한 음악 생성 개발 가이드 패키지"**로 디벨롭(포지셔닝·콘텐츠 강화)한다. 구독 인프라는 건드리지 않는다.

> 2026-05-31 결정: 구독 폐기. 음악은 SaaS 라인이 아니라 **디지털 상품(가이드 패키지) 단품 라인**으로 확정.

**기존 구매자 처리 (결정 #2):** 실제 구매자 **0명** 확인. grandfathering·마이그레이션 불필요. → 본 Phase에서 **"기존 1회 구매자 0명 — 별도 처리 없음"을 명시 기록**하고, 향후 계획에서 이 논점이 다시 떠오르지 않도록 종결한다(이 문장이 그 종결 기록).

**영향 파일:**
- 수정: `app/music/packs/page.tsx` — `TIERS`의 가격/주기는 **1회 결제 유지**. `name`·`desc`·`features`를 "개발 가이드 패키지" 정체성으로 재서술(예: "프롬프트 조합·반복 가능한 워크플로우 설계 가이드"). line 295~296 `productName`을 "AI 음악 생성 개발 가이드 · {티어}"로.
- (선택) 수정: `app/music/packs/layout.tsx` — 메타 title/description을 "음악 생성 개발 가이드"로 갱신
- 수정: `app/layout.tsx` — JSON-LD 음악 Offer의 `Product.name`/`description`을 "개발 가이드 패키지"로 갱신(가격·1회 결제 유지)
- 수정: `app/legal/refund/page.tsx` — "AI 음악 마스터 구조 팩" 표기를 신규 패키지명과 일치하게 정리(1회 디지털 콘텐츠 환불 규정은 유지)
- 변경 **불가**(보존): `lib/products.ts`의 `monthly` 패턴, `subscriptions` 테이블, `subscription-expiry` cron — 음악과 무관하게 P3용으로 보존
- 콘텐츠 작업: `CONTENT/` 하위 음악 패키지 카피·가이드 본문 디벨롭(코드 외 산출물)

**작업 체크리스트:**
- [ ] 4-1. 패키지 정체성·티어별 신규 카피/구성 확정 (박재오 — "개발 가이드" 관점 features)
- [ ] 4-2. `/music/packs` `TIERS` 메타(name/desc/features) 재서술 — **가격·1회 결제 유지**
- [ ] 4-3. `layout.tsx` JSON-LD + `music/packs/layout.tsx` 메타를 가이드 패키지로 갱신
- [ ] 4-4. `refund/page.tsx` 상품명 표기 정합화
- [ ] 4-5. "기존 1회 구매자 0명 — 처리 없음" 종결 기록(본 문서로 충족)
- [ ] 4-6. 검증: `grep -rn "월 구독\|구독.*음악\|music.*monthly" app lib` → 음악-구독 결합 흔적 0건
- [ ] 4-7. 검증: `npm run build` 성공 + `/music/packs` 1회 결제 흐름 정상
- [ ] 4-8. 커밋: `feat(music): 음악 팩을 "AI 음악 생성 개발 가이드 패키지" 단품으로 디벨롭 (구독 폐기)`

**완료 조건:** 음악 팩이 "개발 가이드 패키지" 정체성으로 1회 판매되고, 구독 결합 흔적이 코드/메타/약관에 없으며, 기존 구매자 0명 사실이 종결 기록됨.

---

## Phase 5 — 사주 카탈로그 별도 도메인 분리

**목표:** `/work/saju` 및 사주 전용 API·lib를 **별도 도메인 프로젝트**로 이관하고, 현 사이트에서 제거 + 외부 안내/301 처리한다.

> ⏸ **상태: 대기 (블로커 = 도메인 미구매).** 2026-05-31 기준 분리 대상 도메인을 아직 구매하지 않음. **도메인 구매 완료가 P5 착수의 단일 선결 조건.** 그 전까지 사주는 현 사이트에 그대로 둔다.

**DB 방침 (결정 #4):** 기본은 **기존 Supabase 유지**. 단, **NAS(Postgres) 자체 호스팅 이전 안을 별도 검토**한다 — 검토 포인트: 월 비용 절감 vs. 외부 접근성/가용성, 백업·복구, Supabase RLS·Auth 대체(직접 구현 부담), Vercel→NAS 네트워크 레이턴시. 검토 결과로 "Supabase 유지" 또는 "NAS 이전" 택1.

**결제 이력 방침 (결정 #5):** `orders`/`subscriptions`의 사주 관련 결제·주문 데이터를 **신규 도메인 DB로 전량 이전**(누락 없이).

**전제:** 도메인 구매 완료(블로커). DB 호스팅(Supabase vs NAS)은 착수 시점에 검토 결과로 확정.

**이관 대상 (현 코드 기준 전수):**
- 라우트: `app/work/saju/` 전체 (`page.tsx`, `input/`, `result/`, `components/SajuForm.tsx`, `result/SajuAISection.tsx`, `result/SajuFortuneSection.tsx`, `layout.tsx`)
- API: `app/api/saju/analyze/`, `app/api/saju/calculate/`, `app/api/saju/lotto/`, `app/api/saju/save-interpretation/`
- 라이브러리: `lib/ai-interpretation.ts`, `lib/daeun-calculator.ts`, `lib/saju-ai-prompt.ts`, `saju-engine/` (루트)
- 상품: `lib/products.ts` `saju_detail` (이관 또는 신규 도메인 재정의)
- DB: `subscriptions`/`orders`에 묶인 사주 결제 이력 — 결정 #5에 따라 이전/유지

**현 사이트 정리:**
- 제거: 위 라우트/API/lib (단, `lotto`가 사주와 공유되면 의존성 확인 — `app/api/saju/lotto` vs `app/api/saju/analyze`의 lib 공유 점검)
- 수정: `app/components/PublicShell.tsx` footer `AI 사주` 링크 → 외부 도메인 링크로 교체 또는 제거
- 수정: `app/page.tsx`(line 50·163·369), `app/work/page.tsx`(사주 카드), `app/mypage/page.tsx`(사주 참조), `app/sitemap.ts`, `app/layout.tsx`(사주 JSON-LD/keywords) — 사주 참조 제거 또는 외부 링크화
- 수정: `next.config.ts` — `/saju`·`/saju/input`·`/saju/result` 리다이렉트 3종을 **외부 도메인 301**로 변경(현재는 `/work/saju`로 내부 리다이렉트)

**작업 체크리스트:**
- [ ] 5-0. **도메인 구매 완료** (P5 착수 블로커 — 미완료 시 이하 진행 금지)
- [ ] 5-1. DB 호스팅 검토: Supabase 유지 vs NAS(Postgres) 이전 — 비용·가용성·RLS/Auth 대체·백업 평가 후 택1
- [ ] 5-2. 신규 도메인 프로젝트로 사주 라우트/API/lib/엔진 이관 + 동작 검증
- [ ] 5-3. 사주 결제·주문 이력 **전량** 신규 DB로 마이그레이션 + 건수 대조 검증
- [ ] 5-4. 현 사이트에서 사주 라우트/API/lib 제거 + 공유 의존성(예: lotto) 분리 확인
- [ ] 5-5. footer/홈/mypage/sitemap/layout 사주 참조를 외부 링크화 또는 제거
- [ ] 5-6. `next.config.ts` 사주 리다이렉트를 외부 도메인 301로 변경
- [ ] 5-7. 검증: 현 사이트 `npm run build` 성공 + 사주 잔존 참조 0건(외부 링크 제외)
- [ ] 5-8. 검증: 신규 도메인에서 사주 전 기능(입력→계산→AI해석→결제) 동작
- [ ] 5-9. 검증: `/saju*` 기존 URL이 신규 도메인으로 301
- [ ] 5-10. 커밋(현 사이트): `chore(saju): 사주 카탈로그 별도 도메인 분리 + 참조 제거`

**완료 조건:** 사주가 별도 도메인에서 독립 동작하고, 현 사이트에는 사주 코드가 남지 않으며, 기존 사주 URL이 신규 도메인으로 안전하게 연결됨.

---

## 리다이렉트 정책 종합

| 기존 URL | 현재 동작 | 변경 후 (Phase) |
|---------|----------|----------------|
| `/services/blog` | → `/work/blog` (301) | → `/work` (301) **[P1]** |
| `/work/blog` | 페이지 존재 | 404 **[P1]** |
| `/services/music`, `/services/music/samples`, `/studio` | → `/music/*` | 유지 |
| `/freelance`, `/services/website*` | → `/work/*` | 유지 |
| `/saju`, `/saju/input`, `/saju/result` | → `/work/saju*` (내부) | → 외부 사주 도메인 (301) **[P5]** |

---

## 롤백 전략

- 각 Phase = 독립 커밋(+ 가급적 PR). 문제 시 해당 커밋 revert로 단일 Phase만 되돌림.
- P1(블로그): 라우트 삭제는 git에서 복원 가능. 리다이렉트만 우선 배포해 트래픽 영향 관찰 후 코드 삭제하는 2단 배포도 가능.
- P4(음악 단품 디벨롭): 가격·타입 변경 없음(1회 결제 유지). 카피/메타 변경은 커밋 revert로 즉시 원복. 기존 구매자 0명이라 데이터 백업 불필요.
- P5(사주): 신규 도메인 안정화 **확인 후** 현 사이트 코드 삭제(삭제-먼저 금지). 이전 기간 동안 양쪽 병행 운영.

---

## 실행 순서 요약

1. **지금** → P1(블로그 삭제) → P2(IA 라벨/카피 재편) → P4(음악을 "개발 가이드 패키지" 단품으로 디벨롭). 셋 다 위험 낮고 즉시 가능(P4는 구독 전환이 아니라 카피/메타 디벨롭이라 가벼움).
2. **메이킹 검증 자동화 1개 확정 후** → P3(SaaS 카탈로그). 음악 이탈로 첫 패키지 후보가 없어 그때까지 대기. 인프라는 보존.
3. **도메인 구매 후** → P5(사주 분리). 도메인 미구매가 단일 블로커. 가장 무겁고 외부 인프라 의존 → 마지막.

---

## 변경 이력

- 2026-05-31: 초안 생성. 위키 `사업-쟁승메이드.md` 2026-05-29 재정의를 코드 마이그레이션 5-Phase로 분해. 현재 코드베이스 갭 분석 + 의사결정 보류 5항목 명시.
- 2026-05-31: 박재오 결정 5건 반영 — ①음악 구독 폐기→"AI 음악 생성 개발 가이드 패키지" 단품 디벨롭(P4 전면 재작성), ②기존 1회 구매자 0명 종결 기록, ③사주 분리 도메인 미구매로 P5 대기(블로커=도메인), ④사주 DB는 Supabase 유지 기본 + NAS 셀프호스팅 검토 편입, ⑤사주 결제 이력 전량 이전. 음악 이탈로 P3(SaaS 카탈로그) 첫 패키지 후보 공백 → P3 대기로 변경, 구독 인프라는 보존.
- 2026-05-31 (구현): **P1·P2·P4 실행 완료** + **P3 확장 골격 선구현**. 커밋 3건 — `chore(blog)`(블로그 완전 제거), `feat(ia)`(SaaS 카탈로그 `/packages` + 네비 3축 재편), `feat(music)`(음악 가이드 패키지 단품). 박재오 결정으로 P3 골격(`/packages` 경로 확정 + `lib/saas-catalog.ts` 확장 데이터 모델 + 빈 상태 예고/출시 알림 수집)을 먼저 구현 — 첫 SaaS 제품만 확정되면 배열 추가로 등판. 빌드 성공, 음악-구독 결합 흔적 0건. 브랜치 `feat/saas-pivot-migration`. P5(사주 분리)는 도메인 미구매로 미착수.
