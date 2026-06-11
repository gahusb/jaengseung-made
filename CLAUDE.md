# 쟁승메이드 (JaengseungMade) — 프리미엄 개발 서비스 사이트

## 프로젝트 개요
7년차 대기업 백엔드 개발자 **박재오**가 운영하는 개발 부업 사이트.
고객 맞춤형 서비스를 외주 개발하거나, 이미 완성된 솔루션을 계좌이체 구매 형태로 제공한다.

## 운영자 정보
- 이름: 박재오
- 경력: 7년차 대기업 백엔드 개발자
- 이메일: bgg8988@gmail.com
- 연락처: 010-3907-1392
- NAS 개인 서버: 로또 랩, 주식 자동매매 프로그램 등 실제 서비스 운영 중

## 핵심 IA (공개 라우트)
| 경로 | 설명 |
|------|------|
| `/` | 메인 — 외주 개발 + 완성 소프트웨어 2축 소개 |
| `/outsourcing` | 외주 개발 — 4단계 의뢰 폼 · 프로세스 · 포트폴리오 · FAQ |
| `/products` | 완성 소프트웨어 목록 — 계좌이체 구매 |
| `/products/[id]` | 제품 상세 — 구매 신청·결제 안내 |
| `/track/[token]` | 비회원 의뢰 진행 추적 |
| `/quote/[token]` | 공개 견적 — 고객 수락/거절 |
| `/login` | 로그인 (`?next=` 리다이렉트 지원) |
| `/mypage` | 4탭: 프로필 / 내 의뢰(타임라인) / 내 제품(다운로드) / 주문 내역 |
| `/legal/*` | 이용약관 · 개인정보처리방침 · 환불정책 |

## 숨김 서비스 (admin_token 세션 전용)
`service_settings` 테이블 토글 + `lib/service-visibility.ts` 가드로 접근 제한.
admin/services 패널에서 ON/OFF 전환 가능.

| 경로 | 서비스 |
|------|--------|
| `/work/saju*` | 사주 분석 |
| `/music/*` | 음악 팩 (단, `/music/packs`는 `/products`로 308 리다이렉트) |
| `/gyeol` | CONTOUR PMF 설문 |
| `/packages` | 레거시 패키지 |

## 기술 스택
- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **DB**: Supabase (클라우드 + NAS self-host 이중 운영)
- **Email**: Resend (`RESEND_API_KEY`) — 문의 접수·주문 확인·견적 발송 메일
- **Analytics**: Google Analytics G-WG77RNHXRK
- **Test**: vitest (`npm test`) — lib 단위 테스트
- **Deployment**: Vercel (NAS self-host 전환 진행 중, 컷오버 전 Vercel 운영)

## 디자인 시스템 (`--jsm-*` 토큰)

### CSS 변수
| 토큰 | 값 | 역할 |
|------|----|------|
| `--jsm-bg` | `#f8fafc` | 페이지 배경 |
| `--jsm-surface` | `#ffffff` | 카드·패널 배경 |
| `--jsm-ink` | `#0f172a` | 본문 텍스트 |
| `--jsm-line` | `#e2e8f0` | 구분선·테두리 |
| `--jsm-navy` | `#0b1f3a` | 헤더·강조 배경 |
| `--jsm-accent` | `#1d4ed8` | 단일 포인트 컬러 (버튼·링크) |

### 레이아웃
- 상단 네비(`TopNav`) + 푸터 포함 `PublicShell` 기업형 레이아웃
- Pretendard 폰트

### 금지 가이드레일
- gradient / blur / 보라(violet/purple) 계열 색상 사용 금지
- 이모지 사용 금지 (UI 내)
- `--jsm-*` 토큰 외 임의 색상 변수 추가 금지

## 파일 구조
```
app/
  layout.tsx                  — 루트 레이아웃 (메타데이터·폰트·GA·PublicShell)
  page.tsx                    — 메인 (2축 랜딩)
  globals.css                 — 전역 스타일 + --jsm-* CSS 변수
  components/                 — 공용 UI (TopNav, PublicShell, ContactForm 등)
  outsourcing/page.tsx        — 외주 의뢰 페이지
  products/
    page.tsx                  — 완성 소프트웨어 목록
    [id]/page.tsx             — 제품 상세 + 구매 신청
  track/[token]/page.tsx      — 비회원 의뢰 추적
  quote/[token]/page.tsx      — 공개 견적 수락/거절
  login/page.tsx              — 로그인 (?next= 지원)
  mypage/page.tsx             — 마이페이지 4탭
  legal/                      — privacy / terms / refund
  admin/                      — 관리자 전용 (dashboard·members·services·orders·products·contacts·quotes·packs·...)
  api/
    contact/route.ts          — POST: 의뢰 접수 (public_token 발급 + 고객 메일)
    orders/route.ts           — POST: 주문 생성(pending)
    quote/[token]/route.ts    — GET/POST: 견적 조회·수락/거절
    admin/quotes/[id]/send/route.ts  — 견적 발송 (메일 + 'quoted' 상태 동기화)
    saju/analyze/route.ts     — 사주 AI 분석 (Gemini)
    payment/                  — PortOne 연동 (보존 전용, 미활성)
  work/saju/                  — 숨김: 사주 서비스
  music/                      — 숨김: 음악 팩 (packs는 /products로 308)
  gyeol/                      — 숨김: CONTOUR PMF 설문

lib/
  service-visibility.ts       — 숨김 서비스 접근 가드
  product-access.ts           — orders→제품 접근 확장 (music tier 하위 호환)
  request-status.ts           — 의뢰 상태 머신 단일 소스
  order-emails.ts             — 주문 관련 Resend 메일
  request-emails.ts           — 의뢰 관련 Resend 메일
  supabase/
    product-files.ts          — 제품·파일 조회
    pack-files.ts             — 레거시 팩 파일
  saju-calculator.ts          — 사주팔자 계산 (검증 완료)
  solar-terms.ts              — 절기 계산
  ai-interpretation.ts        — 사주 AI 해석·용신 추정
```

---

## 외주 플로우 (의뢰 상태 머신)

```
고객 의뢰 (/api/contact)
  → public_token 발급 + 고객 접수 메일
  → admin/contacts 수신
       ↓
  pending → reviewing → quoted ──→ accepted ──→ in_progress → completed
                           ↓            ↓
                        on_hold      on_hold
                           ↓
                        cancelled (어느 단계에서도 가능)
```

| 전환 | 트리거 |
|------|--------|
| `pending → reviewing` | 관리자 확인 |
| `reviewing → quoted` | 관리자 견적 작성 + `/api/admin/quotes/[id]/send` 발송 (메일 + 상태 동기화) |
| `quoted → accepted` | 고객 `/quote/[token]` 수락 (관리자 메일 알림) |
| `quoted → on_hold` | 고객 `/quote/[token]` 거절 |
| `accepted → in_progress` | 관리자 착수 처리 |
| `in_progress → completed` | 관리자 완료 처리 |

---

## 결제 플로우 (계좌이체 단일 소스)

```
고객 구매 신청 (/products/[id])
  → POST /api/orders  → orders 레코드 생성 (status: pending)
  → 입금 안내 메일 발송 (케이뱅크 100-116-337157 박재오)

관리자 입금 확인 (/admin/orders)
  → orders.status: pending → paid
  → 다운로드 링크 메일 발송

고객 다운로드 (/mypage → 내 제품 탭)
  → GET /api/packs/sign-link  → DSM 서명 링크 (4시간 TTL)
```

- PG(PortOne) 코드는 `products.pay_method` 플래그 기반으로 보존만, 현재 미활성
- `lib/product-access.ts`: orders 기반 접근 + music tier 하위 호환

---

## 개발 규칙
- 서비스 페이지 공통 구조: Hero → Features → Pricing → FAQ → CTA
- 구매/신청 CTA는 `/outsourcing#contact` 또는 `/products/[id]` 구매 버튼으로 연결
- 가드레일 준수: gradient·blur·보라·이모지 금지, `--jsm-*` 토큰만 사용
- 숨김 서비스 접근: `lib/service-visibility.ts` 가드 → admin_token 세션 없으면 404 반환
- 새 라우트 추가 시 공개/숨김 여부를 `service_settings`에 명시
- DB 마이그레이션은 클라우드 Supabase + NAS self-host **양쪽** 적용 필수

---

## 쟁승메이드 Co. — AI 에이전트 팀 (`.claude/commands/`)

쟁승메이드는 **회사 단위 AI 팀**으로 운영됩니다.
각 에이전트는 고유 역할과 협업 프로토콜을 보유하며, 워크플로우 커맨드로 팀 단위 파이프라인을 실행합니다.

### 조직도
```
박재오 (대표/CEO)
    ├── /pm          프로젝트 매니저    — 일정·우선순위·리소스 조율
    ├── /hr          영업·CS 전문가     — 고객 문의·견적·계약·클레임
    ├── /developer   풀스택 개발자      — 개발·버그·API 설계
    ├── /designer    UI/UX 디자이너     — 화면·에셋·브랜딩
    ├── /marketing   마케팅 전문가      — 성장·홍보·카피·키워드
    ├── /evaluator   품질 보증 전문가   — 코드리뷰·UX·SEO·보안
    └── /saju        사주·명리학 전문가 — 사주 기능 설계·검증
```

### 워크플로우 파이프라인 (팀 자동 조율)
상황별로 여러 에이전트가 순서대로 실행되는 자동화 파이프라인.

| 커맨드 | 실행 파이프라인 | 사용 시점 |
|--------|----------------|-----------|
| `/intake [문의내용]` | HR → PM → Developer → HR | 신규 고객 문의 접수 시 |
| `/followup [컨택내용]` | HR → PM → Developer → HR | 지원서에 클라이언트가 컨택 시 |
| `/kickoff [프로젝트정보]` | PM → Developer → Designer → HR | 계약 확정 후 프로젝트 시작 시 |
| `/weekly [이번주현황]` | PM → Evaluator → Marketing → PM | 매주 금요일 주간 리뷰 |
| `/campaign [목적/아이디어]` | Marketing → Marketing(카피) → Designer → Marketing(실행) | 마케팅 캠페인 기획·실행 시 |

### 개별 에이전트 호출
```
/marketing 크몽 홈페이지 제작 서비스 소개글 작성해줘
/pm 이번 주 할 일 우선순위 잡아줘
/evaluator 현재 랜딩 페이지 전환율 이슈 점검해줘
/developer automation 페이지에 엑셀 다운로드 기능 추가해줘
/designer hero 섹션 리디자인해줘
/hr 고객이 홈페이지 제작 문의를 남겼어, 견적서 써줘
/saju 대운 계산 기능을 추가하고 싶어, 로직 설계해줘
```

### 에스컬레이션 체계
- 기술 판단 → `/developer`
- 가격/계약 판단 → `/hr`
- 일정/우선순위 → `/pm`
- 품질/보안 → `/evaluator`
- 최종 의사결정 → CEO(박재오) 직접 판단

---

## 사주 시스템 (`/app/work/saju`, `/lib/saju-*.ts`)

> **서비스는 현재 숨김 — `/admin/services` 토글로 복귀 가능**

### AI 연동 (`app/api/saju/analyze/route.ts`)
- **AI**: Google Gemini (`@google/generative-ai`)
- **모델 폴백 순서**: `gemini-2.5-pro` → `gemini-2.5-flash` → `gemini-2.0-flash`
- **핵심 패턴**: `systemInstruction`(프롬프트)과 `userMessage`(트리거) 분리 필수
  - 전체 프롬프트를 user 메시지로 보내면 응답 품질 저하
- **Windows 환경**: `dotenv`로 `.env.local`을 명시적 로드 (`override: true`)
- **Vercel 타임아웃**: `export const maxDuration = 60` (Pro 플랜 기준)
- **Mock 감지**: `isMockInterpretation()` 함수로 DB에 캐시된 예시 데이터 판별
  - `SajuAISection.tsx`에서 mock이면 `validSaved = null`로 처리 → API 재호출
  - 재생성 버튼으로 수동 재생성 가능

### 사주팔자 계산 원칙 (검증 완료)

#### `lib/saju-calculator.ts`
| 항목 | 올바른 값 | 주의사항 |
|------|-----------|----------|
| **일주 기준일** | 1900-01-01 = 甲戌 (stem=0, branch=10) | 丙寅(2,2)은 오답 |
| **날짜 계산** | `Date.UTC()` 사용 필수 | `new Date()`는 DST/타임존 오차로 1일 오류 발생 |
| **월 천간** | 오호둔월법(五虎遁月法) 공식 사용 | `yearStemIndex * 2 + branchIndex`는 子月/丑月 오답 |
| **입춘 기준** | `getSolarTermDate(year, 0)`으로 입춘일 획득 후 비교 | 입춘 이전 출생 → 전년도 년주 사용 |

**오호둔월법 공식** (`getMonthGanzi` 내):
```typescript
const startStem = ((yearStemIndex % 5) * 2 + 2) % 10; // 寅月 시작 천간
const stemIndex = (startStem + (branchIndex - 2 + 12) % 12) % 10;
```

#### `lib/solar-terms.ts` — `getCurrentSolarTerm()`
- 반드시 입춘(0) 기준으로 두 구간 분리 처리
  - **입춘 이후(2~12월)**: 입춘(0)~동지(21) 역순 검색
  - **입춘 이전(1월)**: 이 해의 소한(22)/대한(23) → 전년도 동지(21)~입춘(0) 역순 검색
- 기존 단순 역순(i=23→0) 방식은 12월 날짜에서 丑月 오판하는 치명적 버그
- 날짜 비교는 `Date.UTC()` 사용

#### `lib/ai-interpretation.ts` — `estimateYongShin()`
- **신약 사주 용신**: 인성/비겁 중 **점수가 높은(강하게 존재하는)** 것이 용신
  - 내림차순 정렬: `candidates.sort((a, b) => b.score - a.score)`
  - 낮은 점수를 용신으로 고르면 실질적 도움을 못 줌

### 검증 케이스 (1992-12-23 16:30 남성)
```
년주: 壬申  월주: 壬子  일주: 癸酉  시주: 庚申
```
이 결과가 나오면 계산 로직 정상. 다른 값이면 위 원칙 재확인.

---

## 운영 주의사항
- **`.env` 파일 절대 커밋 금지**
- **DB 마이그레이션**: 클라우드 Supabase + NAS self-host **양쪽** 적용 필수
- **`2026-06-12-products-extend.sql`의 pack_files 백필 UPDATE는 재실행 금지** (중복 데이터 발생)
- **NAS self-host 전환 진행 중**: 컷오버 전까지 Vercel 운영 유지
- **music/packs 고아 경로**: `/music/packs` → `/products` 308 리다이렉트 (next.config.ts 처리)
