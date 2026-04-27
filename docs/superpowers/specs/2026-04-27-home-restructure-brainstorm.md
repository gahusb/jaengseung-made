# 쟁승메이드 홈 재구조 브레인스토밍

- **작성일**: 2026-04-27
- **결정 라인**:
  - A (Music + Custom Build 동등 두 사업부)
  - A-1 (Custom Build 산하: 외주·웹사이트·자동화·사주 카탈로그·블로그 자동화)
  - URL 정책: `/work` 사용 (P1에서 `/freelance`·`/services/*`·`/saju` 마이그레이션)
  - 사주 통합: `/saju` → `/work/saju` (카탈로그 spec과 1:1 매핑)
  - 결제: 우선 계좌이체만. PG는 P3로 보류 (토스 해지 상태 유지)
  - 가격 정책: 자체 사이트 별도 정가. 크몽엔 "완성품"만 올림. 사이트 방문자 한정 판매가
  - 외주 진행 5건: 사이트 비공개 (납품 완료 5건만 사례로 노출)
- **상위 컨텍스트**:
  - 현재 메인 = 100% Music 제품 톤으로 피벗된 상태 (`app/page.tsx`, `app/components/TopNav.tsx`)
  - 외주 페이지(`/freelance`)는 살아있으나 헤더에서 진입 경로가 사라짐
  - 사주 카탈로그 spec(`docs/superpowers/specs/2026-04-27-saju-service-catalog-design.md`) 작성 완료, 구현 plan(`docs/superpowers/plans/2026-04-27-saju-service-catalog-implementation.md`) 7 task 분해 완료
- **이 문서의 목적**:
  1. 현재까지 구현된 것 + 흩어져 있던 아이디어를 한 장에 정리
  2. "Music + Custom Build 두 사업부" 정보구조(IA) 변경 아이디어 3안 비교
  3. 다음 작업 우선순위(TODO) 제안

---

## 1. 현재 구현 정리 (As-Is, 2026-04-27)

### 1.1 사이트 IA 현황

```
/                           ← Music 제품 페이지 톤 (Hero "나의 이야기가 노래가 됩니다")
/services/music             ← 음악 팩 상세 (입문 39k / 프로 99k / 마스터 149k)
/services/music/samples     ← 음악 샘플 갤러리
/services/blog              ← 블로그 자동화 팩
/services/website           ← 웹사이트 제작 + 샘플 7종
  └─ samples/{corporate, bakery, portfolio, dashboard, game, interior, reading, shopping}
/studio                     ← Suno API 연동 음악 생성 스튜디오
/saju                       ← AI 사주 분석 (입력)
/saju/input                 ← 사주 입력 폼
/saju/result                ← 사주 결과 + AI 해석
/freelance                  ← 외주 개발 포트폴리오 (납품 5건 사례)
/portfolio/[token]          ← 공유 가능한 포트폴리오 토큰 URL
/login, /mypage             ← 회원
/payment/{success,fail,test} ← 결제
/legal/{terms, privacy, refund} ← 약관
/admin/*                    ← 관리자 (services, contacts, quotes, members,
                              dashboard, analytics, marketing, hidden,
                              documents, questionnaire)
```

### 1.2 헤더(TopNav) 현재 상태

- `app/components/TopNav.tsx` — 4개 링크 모두 음악 전용
  - 홈 / 샘플(`/services/music/samples`) / 팩 상세(`/services/music`) / 스튜디오(`/studio`)
- 우측 CTA: 로그인 + `Try now` (→ `/services/music`)
- 스크롤 시 알약형 글래스 헤더로 전환 (max-w-3xl 축소)
- 외주(`/freelance`), 사주(`/saju`), 블로그(`/services/blog`), 웹사이트(`/services/website`) **진입 경로 없음**

### 1.3 메인 페이지(`/`) 현재 상태

5섹션, 100% Music 제품 페이지:

1. **Hero** — `/hero-bg.mp4` 풀스크린 영상 + "나의 이야기가 / 노래가 됩니다."
2. **Features** — 3-step 비디오 (Prompt / Visual / Publish)
3. **Before/After** — 수작업 vs AI 4항목 비교
4. **Use Cases** — 16개 트윗 마퀴(좌→우 / 우→좌)
5. **Final CTA** — 동일 영상 블러 + "오늘 밤, 첫 AI 뮤비"

→ 외주·사주·블로그 대상 방문자가 메인에 도달하면 컨버전 경로 없음.

### 1.4 푸터(PublicShell) 현재 상태

- Product 섹션: 음악 팩 / 샘플 / 가격
- Company 섹션: AI 사주 / 블로그 자동화 / 문의
- Legal 섹션: 이용약관 / 개인정보 / 환불
- 외주(`/freelance`), 웹사이트(`/services/website`) 푸터에서도 노출 없음

### 1.5 SEO/메타 현재 상태

`app/layout.tsx`:

- `<title>` = "AI 음악·뮤비 팩 ₩39,000~ | 쟁승메이드"
- `description` = 음악 팩 중심
- `keywords` = AI 음악 위주 + 블로그·사주 보조
- JSON-LD `OfferCatalog` = 음악 3티어(39k/99k/149k) + 블로그(29k) + 사주(무료)
- 외주·웹사이트·자동화 관련 정형 데이터 없음

### 1.6 Music 사업부 (현재 가장 정돈된 라인)

| 항목 | 위치 | 상태 |
|---|---|---|
| 제품 페이지 | `/services/music` | 3티어 + 구성품 + FAQ 완성 |
| 샘플 갤러리 | `/services/music/samples` | 별도 페이지 분리 완료 |
| 스튜디오 | `/studio` | Suno API 프록시 연동 |
| 메타데이터 | layout.tsx | 음악 중심 |
| 푸터 Product | PublicShell | 음악만 노출 |

### 1.7 Custom Build 후보 라인 — 파편화 상태

A-1 결정에 따라 한 사업부로 묶을 5개 라인이 현재는 각자 떨어져 있음:

| 라인 | 현재 위치 | 헤더 진입 | 푸터 진입 | 메인 진입 |
|---|---|---|---|---|
| 외주 개발 | `/freelance` | ❌ | ❌ | ❌ |
| 웹사이트 제작 | `/services/website` (+ 샘플 7종) | ❌ | ❌ | ❌ |
| 자동화 | (미구축, 외주 페이지에 사례만) | — | — | — |
| 사주 카탈로그 | `/saju` (+ spec 문서) | ❌ | ⚠️(사주만) | ❌ |
| 블로그 자동화 | `/services/blog` | ❌ | ⚠️(블로그만) | ❌ |

→ A-1을 외부에서 **하나의 사업부**로 인식시키려면 우산 페이지가 필요함.

### 1.8 사주 시스템 (검증 완료)

- `lib/saju-calculator.ts` — 만세력 정확도 검증 (1992-12-23 男 = 壬申/壬子/癸酉/庚申)
- `lib/solar-terms.ts` — 입춘 기준 절기 분기 처리
- `lib/ai-interpretation.ts` — 신강/신약 용신 추정 (점수 내림차순)
- `app/api/saju/analyze/route.ts` — Gemini 2.5 Pro → 2.5 Flash → 2.0 Flash 폴백
- `app/saju/result/SajuAISection.tsx` — Mock 감지 + 재생성 버튼
- 카탈로그 spec(49만 코어 + 모듈 11종) 미구현 상태

### 1.9 운영/관리 시스템

- `/admin` 9개 화면: dashboard / services / contacts / quotes / quotes/[id] / members / analytics / marketing / hidden / documents / questionnaire
- 견적서 PDF 출력, HMAC 인증, 토큰 공유 URL, 마케팅 에셋 관리
- API: `/api/admin/*`, `/api/contact`, `/api/payment/*`, `/api/saju/*`, `/api/studio/*`, `/api/telegram/*`, `/api/projects/*`, `/api/questionnaire/*`, `/api/cron/*`

### 1.10 외부 인프라

- Vercel 배포 (Next.js 16 App Router, TS, Tailwind v4)
- Resend 이메일 (자체 검증 도메인)
- Google Analytics G-WG77RNHXRK
- Google Gemini (사주 AI)
- Suno API (스튜디오)
- 별도 NAS(`gahusb.synology.me`) 백엔드 — workspace 상위 CLAUDE.md 참조

---

## 2. 캡처된 아이디어 / 전략 컨텍스트

> ⚠️ 메모리 일부는 20~28일 전 시점 기록. 현재 코드/현황과 다를 수 있음. 의사결정 시 CEO가 재확인 필요.

### 2.1 매출 5트랙 (메모리 `project_revenue_strategy.md`)

| Track | 라인 | 사이트 노출 의도 (메모리 시점) |
|---|---|---|
| 1 | 외주 (현금) | 사이트 노출 축소, 포트폴리오만 / 크몽·숨고·위시캣 중심 |
| 2 | 사주 + 로또 (트래픽) | 무료 사주 + SEO 콘텐츠로 트래픽 |
| 3 | 블로그 자동화 (제품) | 30만 → 50만 (리뷰 5개 후 인상) |
| 4 | AI 크레딧 (제품, 미구현) | AI 글·이미지 크레딧 모델 |
| 5 | 대시보드 (보류) | 부업 수익 종합 or 청약 |

→ A-1 결정과 함께 **Track 1(외주)을 사이트에서 다시 살린다**는 방향 전환. 단, "현금 확보 트랙"이라는 본질은 유지 — 외주 페이지는 컨버전·견적 문의가 핵심 KPI.

### 2.2 마케팅 플랫폼 전략 (메모리 `project_marketing_strategy.md`)

크몽 BASIC/STANDARD/PREMIUM 가격대(수수료 20% 포함):

| 서비스 | BASIC | STANDARD | PREMIUM |
|---|---|---|---|
| 홈페이지 | 55만 | 165만 | 330만 |
| 업무 자동화 | 33만 | 88만 | 220만 |
| 프롬프트 | 11만 | 33만 | 88만 |
| 주식 자동매매 | 55만 | 110만 | 220만 |

→ Custom Build 우산 페이지의 가격 기준선으로 활용 가능. 자체 사이트는 크몽 정가-α(수수료 미포함분)로 미세 우위.

### 2.3 진행 중 외부 컨택 5건 (메모리 `project_proposals.md`)

| 플랫폼 | 프로젝트 | 금액 | 기간 |
|---|---|---|---|
| 숨고 | 카페24 자사몰 + 3브랜드몰 | 180만 | 15일 |
| 위시캣 | PHP 사이트 PG 연동 (나이스페이 + 페이팔) | 720만 | 55일 |
| 위시캣 | 옵션 자동매매 MVP | 300만 | 20일 |
| 위시캣 | 기업 공식 홈페이지 | 480만 | 30일 |
| 위시캣 | 중학교 진로탐색 워크북 | 850만 | 35일 |

→ 외주 사업부의 "최근 제안" 섹션으로 노출하면 신뢰도 강화 (단가가 큰 위시캣 건들이 강한 신호).

### 2.4 Music 피벗 의도 (커밋 로그)

- `5cc224a refactor: AI 음악 메인 개편 — 로또/프롬프트/자동화 삭제, 음악/블로그 팩 신규`
- `441bf00 ~ ce2720b` — 음악 hero/Suno API/팩 상세/마케팅 카피·메타·CTA 음악 중심 정렬
- `c7086f3 style: Bagel Fat One 디스플레이 폰트 도입`
- `835c154 copy(hero): 애플식 카피 — 단언·간결·제품 중심`

→ Music은 "제품화된 패키지"로 톤이 잡힌 상태. 이 톤을 부수지 않으면서 외주를 살려야 함.

### 2.5 결제/PG 변수 (메모리 시점)

- 토스페이먼츠 해지 완료 (월 30만 부담) — 대체 PG 미정 상태로 기록
- → 현재 코드에 `app/payment/{success,fail,test}` 경로는 살아있음. **CEO 재확인 필요** (해지가 유효한지, 대체 PG가 들어갔는지).

---

## 3. 재구조 아이디어 — 2-up 동등 사업부 (A-1)

### 3.1 정보구조(IA) 변경 골격 — 공통 베이스 (확정)

```
/                        ← 회사(JSM) 표지 + 두 사업부 진입점
/music                   ← Music 사업부 허브
  /music/packs           = 현 /services/music
  /music/samples         = 현 /services/music/samples
  /music/studio          = 현 /studio
/work                    ← Custom Build 사업부 허브 (신설)
  /work/freelance        = 현 /freelance (포트폴리오 + 일반 외주 문의)
  /work/website          = 현 /services/website (+ samples/* 그대로 이동)
  /work/automation       (신설, 외주 페이지의 자동화 사례 4건 추출)
  /work/saju             = 현 /saju 통합 (사주 카탈로그 spec 1:1 매핑)
  /work/blog             = 현 /services/blog
```

**마이그레이션 원칙**
- 기존 URL → 새 URL은 **301 영구 리다이렉트**로 처리 (Next.js `redirects()` in `next.config.ts`)
- 외부 링크/검색 인덱스 보존: `/services/music`, `/services/blog`, `/services/website`, `/services/website/samples/*`, `/freelance`, `/saju`, `/saju/input`, `/saju/result`, `/studio` 모두 매핑
- JSON-LD `OfferCatalog` 의 URL도 동시 갱신
- 사주 SEO 영향이 가장 큼 — `/saju` 트래픽이 살아있다면 리다이렉트가 깨지면 안 됨

### 3.2 메인 페이지 — 3가지 접근법

#### 안 1. Split Hero (좌우 양분)

```
┌─────────────────────────┬──────────────────────────┐
│  Music                  │  Custom Build            │
│  hero-bg.mp4 영상 BG    │  코드/엔지니어링 BG       │
│  "나의 이야기가          │  "당신의 업무를          │
│   노래가 됩니다"          │   코드가 합니다"          │
│  ₩39,000~ Try now       │  견적 문의              │
└─────────────────────────┴──────────────────────────┘
```

- **장점**: 첫 화면에서 두 사업부 동등성 즉각 인지. SEO에서 두 메시지 모두 H1로 노출.
- **단점**: 모바일에서 위·아래 stack 시 반쪽씩 보임. 두 영상 동시 재생은 모바일 데이터 부담. Music의 "한 줄 임팩트" 톤이 약해짐.

#### 안 2. Brand Hero + 2-up Card *(추천)*

```
┌─────────────────────────────────────────────────────┐
│  [BRAND HERO — 회사 표지]                           │
│  "현직 엔지니어가 만드는 두 가지."                    │
│  AI 제품과 맞춤 개발.                              │
└─────────────────────────────────────────────────────┘
┌──────────────────────────┬──────────────────────────┐
│  [Music 카드]            │  [Custom Build 카드]      │
│  hero-bg.mp4 미니         │  코드/타이포 모션          │
│  "AI 음악 제품"           │  "맞춤 개발 사업부"        │
│  ₩39,000~  Try now       │  견적 받기 →              │
│  주요 라인: 팩·샘플·스튜디오│  주요 라인: 외주·사주·웹·자동화·블로그│
└──────────────────────────┴──────────────────────────┘
[ 신뢰 — 납품 N건 / Music 팩 판매 N개 / 기업 컨택 5건 ]
[ Music 섹션: 현재 메인 콘텐츠 압축 (Features 3-step + 트윗 마퀴) ]
[ Custom Build 섹션: 포트폴리오 5건 미리보기 + 가격대 + 견적 CTA ]
[ Final CTA — 어느 쪽이든 시작하세요 ]
```

- **장점**:
  - 회사 브랜드 톤이 메인에 한 번 박힘 → "쟁승메이드"가 한 명이 운영하는 두 사업부 회사라는 인상
  - 현재 메인의 음악 톤(영상·Bagel Fat One·트윗 마퀴)을 살리면서 Custom Build 동등 노출
  - Hero는 short text + 즉시 2-up — 모바일에서 한 화면에 표지가 들어옴
- **단점**:
  - "Try now" 단일 CTA가 약해짐 — Hero에서는 "회사 소개" 톤이라 컨버전 1차 분기점이 한 단계 늘어남
  - 안 1보다 한 스크롤 더 내려가야 Music 핵심에 도달

#### 안 3. 회사 표지 + 라우트 분기 (메인은 분기점만)

```
┌─────────────────────────────────────────────────────┐
│  "쟁승메이드"                                        │
│  AI 제품 / 맞춤 개발 / 회사 소개                     │
│  [Music 보기] [Custom Build 보기]                   │
└─────────────────────────────────────────────────────┘
```

- 메인은 거의 텍스트 + 두 큰 카드만. 콘텐츠 거의 없음.
- 현재 메인의 음악 콘텐츠는 전부 `/music` 으로 이동.
- **장점**: 가장 깨끗한 IA. 사업부 추가/제거가 자유로움.
- **단점**: 단기 컨버전 손실 — 메인에 도달한 "음악 사고 싶은" 방문자가 한 번 더 클릭해야 함. 현재 hero의 임팩트 손실.

#### 추천: **안 2 (Brand Hero + 2-up Card)**

**이유**
- 현재 음악 페이지의 영상·카피·마퀴를 그대로 활용 — 폐기 비용 0
- 외주 인입을 메인에서 직접 받음 (Custom Build 카드 + 하단 사례 섹션)
- Hero는 짧게, 그 아래는 두 사업부 각각 한 섹션씩 — 한 페이지 안에서 두 톤 분리 가능
- 안 1과 달리 모바일에서 자연스러운 stack
- 안 3과 달리 첫 방문 컨버전 손실 작음

### 3.3 두 사업부 상세 IA (안 2 채택)

#### Music 사업부 (`/music` 허브)

기존 콘텐츠 거의 그대로 + 헤더 도메인만 통일:
- Music 허브: 팩 3티어 + 샘플 + 스튜디오 + 구매 후기
- 메인의 Features/BeforeAfter/UseCases/CTA 섹션은 "Music 섹션"으로 메인에 압축 보존, 풀버전은 `/music` 허브로 흡수

#### Custom Build 사업부 (`/work` 허브)

```
[Hero — "기업·소상공인 맞춤 개발"]
[5라인 카드 — Freelance / Website / Automation / Saju / Blog]
[자체 정가 — 사이트 한정가] ← 크몽 정가는 노출 X
[납품 사례 5건 미리보기 — 현 /freelance portfolio 데이터 재활용 (납품 완료 건만)]
[수주 가능 영역 / 어려운 영역]
[견적 문의 폼 — 기존 ContactModal 또는 ContactForm 재사용]
```

가격 표기 원칙:
- 자체 사이트 한정가만 표시. 크몽/숨고/위시캣 가격은 사이트에 비노출
- 진행 중 외부 컨택 5건은 사이트에 비공개 (사례는 납품 완료 5건만)

각 라인 상세 페이지(`/work/{freelance|website|automation|saju|blog}`)는 기존 페이지를 새 URL로 마이그레이션.

### 3.4 헤더(TopNav) — 3안

#### 헤더 안 a. 두 사업부 + 공통 (추천)

```
JSM    Music ▾   Custom Build ▾   회사     로그인  견적/Try now
       └ 팩 상세           └ 외주
       └ 샘플              └ 웹사이트
       └ 스튜디오           └ 자동화
                          └ 사주
                          └ 블로그 자동화
```

- **장점**: 두 사업부 동등성 헤더에서 명확. 드롭다운으로 라인 정리.
- **단점**: 모바일 메뉴가 2단 구조 필요. 현재 알약형 글래스 헤더에 dropdown 추가 디자인 작업 필요.

#### 헤더 안 b. 두 사업부 + 빠른 진입 1개

```
JSM    Music    Custom Build    Try now
```

- 사업부 클릭 = 허브 페이지로. 각 라인은 허브에서 진입.
- **장점**: 단순. 현재 헤더 디자인 거의 유지.
- **단점**: 자주 가는 라인(예: 팩 상세, 사주)으로 직행 못함. 검색 유입 SEO에는 영향 없음.

#### 헤더 안 c. 평면 5~6개 (현 구조 확장)

```
JSM    홈   Music   외주   사주   블로그   Try now
```

- **장점**: 클릭 1번에 모두 도달. 현 헤더 패턴 그대로.
- **단점**: 라인이 늘면 즉시 깨짐. 사업부 동등성 인식 약함.

#### 추천: **안 b (드롭다운 없는 2개 + Try now)**

이유: 사업부 동등성을 헤더에서 강조 + 디자인 변경 최소. 라인별 직진은 메인 카드/푸터로 보완.

### 3.5 브랜드 메시지 옵션 (Hero 카피)

- **A**: "현직 엔지니어가 만드는 두 가지." / "AI 제품, 그리고 맞춤 개발."
- **B**: "한 사람이 만들고, 운영합니다." / "AI 음악 팩부터 기업 시스템 개발까지."
- **C**: "Build, your way." / "AI 제품으로 시작하세요. 맞춤 개발이 필요하면 의뢰하세요."
- **D**: "쟁승메이드는 두 가지를 합니다." / "Music. Custom Build."

→ 추천: **A** (한국어 정서에 가장 자연스러움 + 운영자 신뢰 시그널)

### 3.6 푸터 재정비

```
Music                Custom Build           Company           Legal
  팩 상세              외주 개발              회사 소개          이용약관
  샘플 갤러리           웹사이트 제작          블로그            개인정보
  스튜디오              자동화                문의              환불정책
  가격                 사주 카탈로그
                      블로그 자동화
                      포트폴리오
```

### 3.7 SEO/메타 변경 골격

- `<title>` 기본값 → "쟁승메이드 — AI 음악 제품 + 맞춤 개발" (사업부 둘 다 표지)
- 페이지별 `<title>` 템플릿 분기:
  - Music 라인: "%s | 쟁승메이드 Music"
  - Custom Build 라인: "%s | 쟁승메이드 Custom Build"
- JSON-LD `OfferCatalog` 확장:
  - 외주 5건 (위시캣·숨고 가격대) → Service 타입
  - 웹사이트 BASIC/STANDARD/PREMIUM → Service 타입
  - 사주 코어 49만 + 모듈 11종 → Product/Service 타입
- `keywords` — 음악 + 외주·자동화·홈페이지 제작·사주를 균형있게

---

## 4. TODO 제안

> 우선순위는 "두 사업부 가시성 회복 → 컨버전 경로 확립 → 라인 상세 정돈" 순.

### P0 — 이번 주 (외주 가시성·결제 흐름 즉시 회복)

> 큰 IA 변경 전에 "외주가 살아있다"는 신호와 결제 가능 상태를 빠르게 복원.

- [ ] **헤더에 외주 진입점 1개 추가** — TopNav `LINKS` 배열에 `/freelance` 링크. 1줄 변경, 즉시 효과.
- [ ] **메인 하단 Custom Build 미니 섹션 1개 추가** — 현 마지막 CTA 위에 "맞춤 개발이 필요하신가요?" 1섹션. 5라인 그리드 + 견적 문의 CTA. 추후 `/work` 우산으로 교체될 자리잡기.
- [ ] **푸터 Custom Build 컬럼 추가** — 외주·웹사이트·사주·자동화·블로그 노출.
- [ ] **JSON-LD `OfferCatalog` 외주 추가** — `app/layout.tsx` 의 `itemListElement` 에 외주(Service) 1~2건 + 웹사이트 1건 추가. **자체 정가만 기재** (크몽 가격 X).
- [ ] **결제 흐름 = 계좌이체 단일화** — Music 팩 구매 모달/결제 화면을 계좌이체 안내 + 입금자명 매칭 + 관리자 확인 → 자료 발송 흐름으로 통일. 토스/PG 관련 코드 비활성 처리(또는 `/payment/test` 격리). 기존 `ContactModal` 의 입금자명 필드 재활용.
- [ ] **메모리 정합성 정돈** — 토스 해지 상태 유지, 결제는 계좌이체로 결정됨을 메모리(`feedback_toss_cancelled.md` 또는 신규 `project_payment_decision.md`)에 반영.

### P1 — 다음 1~2주 (안 2 본격 적용 + URL 마이그레이션)

- [ ] **`/music` 허브 신설 + 마이그레이션** — `next.config.ts` `redirects()` 로 `/services/music` → `/music`, `/services/music/samples` → `/music/samples`, `/studio` → `/music/studio` 영구 리다이렉트.
- [ ] **`/work` 허브 신설 + 마이그레이션** — `/freelance` → `/work/freelance`, `/services/website` → `/work/website`, `/services/website/samples/*` → `/work/website/samples/*`, `/services/blog` → `/work/blog`, `/saju` → `/work/saju`, `/saju/input` → `/work/saju/input`, `/saju/result` → `/work/saju/result` 영구 리다이렉트.
  - **사주는 SEO 영향이 가장 클 수 있으므로 리다이렉트 검증 필수** (Search Console 색인 변화 모니터링).
- [ ] **메인 페이지 안 2 적용** — Brand Hero + 2-up + Music 섹션 + Custom Build 섹션 + Final CTA.
  - Hero 카피 옵션 A: "현직 엔지니어가 만드는 두 가지."
  - 기존 hero-bg.mp4 → Brand Hero 백그라운드 또는 Music 카드 미니 비디오로 재배치
- [ ] **헤더 안 b 적용** — `Music | Custom Build | Try now`. 모바일 햄버거 동일 구조.
- [ ] **푸터 재정비** — 4-column (Music / Custom Build / Company / Legal).
- [ ] **메타데이터 분기** — `layout.tsx` 의 `title.template` 음악 단일 → 회사 표지 + 라인별 사업부 분기. 페이지별 metadata 정돈.
- [ ] **자체 정가 가격표 정돈** — `/work` 허브에 외주/웹/자동화/사주/블로그 자체 한정가 표 1개. 크몽/숨고/위시캣 가격은 비공개. (참고는 메모리 `project_marketing_strategy.md` 기준선이지만 그대로 노출하지 않음.)

### P2 — 사업부별 상세 정돈

- [ ] **사주 카탈로그 구현** — 기존 spec(`docs/superpowers/specs/2026-04-27-saju-service-catalog-design.md`) + plan(`docs/superpowers/plans/2026-04-27-saju-service-catalog-implementation.md`) 7 task 실행 → `/work/saju` 에서 코어 49만 + 모듈 11종 노출.
- [ ] **자동화 라인 페이지(`/work/automation`) 신설** — 현 외주 페이지의 자동화 사례 4건(Gmail RPA·가격 모니터링·영업일보·공시지가) 추출 + 표준 패키지 정의.
- [ ] **회사 소개 페이지(`/about`)** — 박재오 1인 운영, 7년차 백엔드, 두 사업부 운영 의지. 메인 표지 톤과 일관.
- [ ] **SEO 모니터링 베이스라인** — Search Console 키워드 변화, GA 메인 이탈률, 라인별 페이지뷰 비교.
- [ ] **납품 5건 case study 보강** — 현재 `app/freelance/page.tsx` portfolio 5건의 result 문구·태그·이미지 강화. 진행 5건은 비공개 유지.

### P3 — 더 멀리 (안 2 안착 후)

- [ ] **PG 결제 도입** — 매출 일정 수준 도달 후 토스 대체 PG 도입 (스토어팜·나이스페이·KCP·해외 PG 비교). Music 팩 자동 결제, Custom Build 견적-인보이스 분리.
- [ ] **Music 사업부 신제품 라인** — 정기구독 / AI 크레딧 모델.
- [ ] **Custom Build 견적-인보이스-납품 자동화** — 현 `/admin/quotes` 흐름과 `/work` 견적 폼 통합.
- [ ] **회원/구매 후기 누적 후 Music 메인 노출** — 현재 트윗 마퀴(가상 후기)를 실제 구매자 후기로 점진 교체.

---

## 5. 다음 단계 (Process)

1. **이 문서 검토** — 사용자가 빠진 항목·오해된 결정·추가하고 싶은 메시지 확인
2. **메인 재구조 안 2 확정** — Hero 카피·2-up 디자인·Custom Build 카드 톤
3. **확정 후 → 구현 plan 작성** — `superpowers:writing-plans` 스킬로 step-by-step 작업 분해 (P0 즉시 작업과 P1 본 작업을 분리)
4. **P0부터 PR 단위로 실행**

---

## 부록 A. 안 2 메인 페이지 와이어프레임 텍스트

```
═══════════════════════════════════════════════════════
[ TopNav ]
JSM         Music     Custom Build     로그인  Try now
═══════════════════════════════════════════════════════

[ BRAND HERO — 1 viewport ]
   "현직 엔지니어가 만드는 두 가지."
    AI 제품과 맞춤 개발.
   [Music 보기]  [Custom Build 보기]

═══════════════════════════════════════════════════════

[ TWO-UP CARDS ]
┌──────────────────────┐  ┌──────────────────────┐
│  AI 음악 제품         │  │  맞춤 개발            │
│  hero-bg.mp4 미니     │  │  타이포 모션          │
│  팩 ₩39,000~          │  │  외주·웹·자동화·사주·블로그│
│  → Try now            │  │  → 견적 문의          │
└──────────────────────┘  └──────────────────────┘

═══════════════════════════════════════════════════════

[ MUSIC 섹션 ] (현재 메인의 Features 3-step + Tweet 마퀴 압축)

═══════════════════════════════════════════════════════

[ CUSTOM BUILD 섹션 ]
- 5라인 그리드 (외주/웹/자동화/사주/블로그)
- 납품 5건 미리보기 (현 /freelance portfolio 데이터, 납품 완료 건만)
- 자체 한정가 표 (사이트 방문자 전용 가격)
- 견적 문의 CTA

═══════════════════════════════════════════════════════

[ FINAL CTA ]
   "어느 쪽이든 시작하세요."
   [Music 팩 보기]  [견적 문의]

═══════════════════════════════════════════════════════

[ FOOTER ]
Music    Custom Build    Company    Legal
═══════════════════════════════════════════════════════
```

## 부록 B. 확정 사항 (2026-04-27 CEO 결정)

| 항목 | 결정 | 적용 위치 |
|---|---|---|
| URL 정책 | `/work` 사용. P1에서 `/freelance`·`/services/*`·`/saju` 영구 리다이렉트 마이그레이션 | P1 — `next.config.ts` `redirects()` |
| 사주 위치 | `/saju` 통합 → `/work/saju`. 카탈로그 spec 1:1 매핑 | P1 마이그레이션 + P2 카탈로그 구현 |
| 결제 인프라 | 우선 계좌이체만. PG 도입은 P3 보류. 토스 해지 상태 유지 | P0 — 기존 결제 비활성, 계좌이체 단일화 |
| Custom Build 가격 정책 | 자체 사이트 별도 정가. 크몽엔 완성품만 등록. 사이트 한정가는 사이트 방문자에게만 | P0 JSON-LD + P1 `/work` 가격표 |
| 외주 컨택 5건 노출 | 비공개. 진행 5건은 사이트에 미노출. 사례는 납품 완료 5건만 | 메인 Custom Build 섹션 / `/work` 허브 |
