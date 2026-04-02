# 이베이 자동차 부품 리스팅 AI 자동화 툴 — 기술 아키텍처 설계서

> 작성일: 2026-04-02  
> 작성자: Developer Agent (쟁승메이드)  
> 버전: v1.0 Draft

---

## 목차
1. [시스템 아키텍처 설계](#1-시스템-아키텍처-설계)
2. [기술 스택 선정 및 근거](#2-기술-스택-선정-및-근거)
3. [핵심 모듈별 상세 설계](#3-핵심-모듈별-상세-설계)
4. [DB 스키마 설계](#4-db-스키마-설계)
5. [API 엔드포인트 설계](#5-api-엔드포인트-설계)
6. [계정 안전성 설계](#6-계정-안전성-설계)
7. [리스크 & 트레이드오프](#7-리스크--트레이드오프)

---

## 1. 시스템 아키텍처 설계

### 1.1 전체 시스템 구성도

```
┌──────────────────────────────────────────────────────────────────────┐
│  클라이언트 (PC 브라우저)                                              │
│  Next.js App Router — Tailwind CSS                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ 부품 검색  │ │ 결과 대시 │ │ 리스팅    │ │ 히스토리  │               │
│  │ 입력 폼   │ │ 보드     │ │ 편집기    │ │ /설정    │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
└──────────────────────────┬───────────────────────────────────────────┘
                           │ HTTPS (Vercel Edge)
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│  Next.js API Routes (Vercel Serverless)                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ /api/     │ │ /api/     │ │ /api/     │ │ /api/     │               │
│  │ search    │ │ analyze   │ │ listing   │ │ price     │               │
│  └─────┬────┘ └─────┬────┘ └─────┬────┘ └─────┬────┘               │
└────────┼────────────┼────────────┼────────────┼─────────────────────┘
         │            │            │            │
         ▼            ▼            ▼            ▼
┌──────────────────────────────────────────────────────────────────────┐
│  크롤러 워커 (별도 서버 — Docker/VPS)                                  │
│                                                                      │
│  ┌─────────────────┐   ┌─────────────────┐   ┌──────────────────┐   │
│  │ Playwright 엔진  │   │ 사이트별 어댑터   │   │ 프록시 로테이터   │   │
│  │ (브라우저 풀)     │   │ RockAuto/Amazon │   │ + User-Agent 풀  │   │
│  │                  │   │ PartsGeek/eBay  │   │                  │   │
│  └─────────────────┘   └─────────────────┘   └──────────────────┘   │
│                                                                      │
│  ┌─────────────────┐   ┌─────────────────┐                          │
│  │ BullMQ 큐 관리   │   │ Redis           │                          │
│  │ (작업 스케줄링)   │   │ (캐시/큐 백엔드) │                          │
│  └─────────────────┘   └─────────────────┘                          │
└──────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────┐
│  AI 분석 파이프라인                                                    │
│                                                                      │
│  ┌─────────────────┐   ┌─────────────────┐   ┌──────────────────┐   │
│  │ Claude API       │   │ 구조화 출력 파서 │   │ Fitment 검증기   │   │
│  │ (주 분석 엔진)   │   │ (JSON Schema)   │   │ (Cross-ref)      │   │
│  └─────────────────┘   └─────────────────┘   └──────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────┐
│  데이터 저장                                                          │
│                                                                      │
│  ┌─────────────────┐   ┌─────────────────┐                          │
│  │ Supabase         │   │ Redis Cache     │                          │
│  │ (PostgreSQL)     │   │ (TTL 기반)      │                          │
│  │ - 검색 히스토리   │   │ - 크롤링 결과   │                          │
│  │ - 부품 데이터     │   │ - 환율 캐시     │                          │
│  │ - 리스팅 초안     │   │ - 세션 상태     │                          │
│  │ - 사용자 설정     │   │                 │                          │
│  └─────────────────┘   └─────────────────┘                          │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.2 데이터 흐름도 (메인 파이프라인)

```
[사용자 입력]
  품번: "16610-0H040"
  품명: "Fuel Pump Assembly"
       │
       ▼
[1단계: 초기 검색 — 2~5초]
  ├─ Supabase 캐시 조회 (동일 품번 24시간 이내 검색 존재?)
  │   ├─ HIT → 캐시 결과 즉시 반환 + 백그라운드 갱신 옵션 제공
  │   └─ MISS → 크롤링 작업 생성
  │
       ▼
[2단계: 크롤링 큐 등록 — 즉시]
  ├─ BullMQ에 작업 등록
  ├─ 클라이언트에 jobId 반환 → SSE/Polling으로 진행률 추적
  │
       ▼
[3단계: 병렬 크롤링 — 15~45초]
  ├─ [Worker 1] RockAuto 검색 → 가격, 호환 차종, 이미지
  ├─ [Worker 2] PartsGeek 검색 → 가격, 리뷰 수
  ├─ [Worker 3] Amazon 검색 → 가격, 판매량 추정
  ├─ [Worker 4] eBay 기존 리스팅 검색 → 경쟁 가격, 판매량
  ├─ [Worker 5] OEM DB 검색 (partsouq) → 순정 번호, 호환 번호
  └─ 각 Worker: 성공/실패 개별 보고, 부분 실패 허용
       │
       ▼
[4단계: AI 분석 — 5~15초]
  ├─ 수집 데이터 정규화 + 병합
  ├─ Claude API 호출 (구조화 출력 요청)
  │   ├─ Fitment 매칭 (차종별 연도/모델/엔진)
  │   ├─ 최적 리스팅 제목 생성 (80자 이내)
  │   ├─ Item Specifics 추출
  │   └─ 가격 추천 (시장가 분석 기반)
  ├─ 정확도 검증 (Cross-reference 체크)
  │
       ▼
[5단계: 가격 계산 — 1초]
  ├─ 환율 API (KRW/USD)
  ├─ 원가 + 관세(8%) + 국제배송비 + 이베이 수수료(13%) + 마진
  ├─ 경쟁 가격 대비 포지셔닝
  │
       ▼
[6단계: 리스팅 생성 — 즉시]
  ├─ eBay 리스팅 템플릿 조립
  ├─ Fitment Chart (Year/Make/Model/Engine 테이블)
  ├─ Supabase에 초안 저장
  └─ 사용자에게 최종 결과 반환 (편집 가능)
```

### 1.3 배포 아키텍처

```
┌─────────────────────────────────┐
│       Vercel (프론트 + API)      │
│  Next.js App Router             │
│  - SSR 페이지                    │
│  - API Routes (오케스트레이터)   │
│  - Edge Functions (경량 API)    │
│  maxDuration: 60s (Pro)         │
└──────────────┬──────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────┐
│    VPS (크롤러 전용 서버)        │
│    Docker Compose               │
│                                 │
│  ┌───────────┐ ┌──────────┐    │
│  │ crawler   │ │ Redis    │    │
│  │ (Node.js  │ │ 7.x     │    │
│  │ +Playwright│ │          │    │
│  │ +BullMQ)  │ │          │    │
│  └───────────┘ └──────────┘    │
│                                 │
│  비용: ~$10~20/월 (Contabo/     │
│  Hetzner 2vCPU/4GB)            │
└─────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│       Supabase (DB + Auth)      │
│  PostgreSQL + Row Level Security│
│  Free tier → Pro 필요 시 전환   │
└─────────────────────────────────┘
```

**배포 분리 이유:**
- Vercel Serverless는 최대 60초 타임아웃 (Pro). 크롤링은 45초 이상 소요 가능
- Playwright는 ~400MB 브라우저 바이너리 필요. Vercel 함수 크기 제한(50MB) 초과
- 크롤러 서버를 분리하면 IP 관리, 프록시 설정, 브라우저 풀 관리가 자유로움
- Vercel API Routes는 오케스트레이터 역할만 수행 (크롤러 서버에 작업 위임)

---

## 2. 기술 스택 선정 및 근거

### 2.1 프론트엔드

| 항목 | 선택 | 근거 |
|------|------|------|
| 프레임워크 | **Next.js 16 App Router** | 기존 jaengseung-made 스택 동일. SSR/ISR, API Routes 통합 |
| 스타일링 | **Tailwind CSS v4** | 기존 스택. 빠른 프로토타이핑, 일관된 디자인 시스템 |
| 상태 관리 | **React 19 내장 (useState/useReducer)** | 복잡한 글로벌 상태 불필요. 폼 + 결과 뷰 중심 |
| 실시간 갱신 | **SSE (Server-Sent Events)** | 크롤링 진행률 실시간 표시. WebSocket 대비 구현 단순 |

### 2.2 백엔드 (오케스트레이터)

| 항목 | 선택 | 근거 |
|------|------|------|
| API | **Next.js API Routes** | 별도 FastAPI 불필요. 크롤러만 분리하면 API Routes로 충분 |
| 인증 | **Supabase Auth** | 기존 jaengseung-made 인증 체계 재사용 |
| 비동기 통신 | **HTTP + SSE** | Vercel API → 크롤러 서버 HTTP 호출, 클라이언트에는 SSE로 진행률 전달 |

**FastAPI 별도 서버 검토 결과: 불채택**
- 크롤러 서버가 이미 분리되므로, API 오케스트레이션만 하는 레이어에 FastAPI를 또 세우면 인프라 복잡도만 증가
- Next.js API Routes + Vercel Serverless로 오케스트레이션 충분
- 단, 향후 사용량 급증 시 API 레이어 분리 고려 가능

### 2.3 크롤러 엔진

| 항목 | Playwright | Puppeteer |
|------|-----------|-----------|
| **브라우저 지원** | Chromium, Firefox, WebKit | Chromium only |
| **Anti-bot 우회** | stealth 플러그인 생태계 넓음 | puppeteer-extra-stealth 있음 |
| **안정성** | Microsoft 관리, 업데이트 빠름 | Google Chrome팀, 안정적 |
| **멀티 컨텍스트** | 브라우저 하나에 격리된 컨텍스트 다수 생성 가능 | 유사하나 API 덜 직관적 |
| **Docker 지원** | 공식 Docker 이미지 제공 | 수동 설정 필요 |
| **선택** | **Playwright** | - |

**Playwright 선택 이유:**
1. `browser.newContext()`로 사이트별 격리된 세션 관리 용이 (쿠키/스토리지 분리)
2. `playwright-extra` + `stealth` 플러그인으로 headless 탐지 우회 성숙
3. 자동 대기(`waitForSelector`, `waitForLoadState`) API가 크롤링에 최적화
4. Firefox 컨텍스트를 섞어 쓸 수 있어 fingerprint 다양화 가능

### 2.4 AI 엔진

| 항목 | Claude API (Anthropic) | OpenAI API |
|------|----------------------|------------|
| **구조화 출력** | Tool Use로 JSON Schema 강제 가능 | JSON Mode / Function Calling |
| **긴 컨텍스트** | 200K 토큰 (크롤링 데이터 대량 입력에 유리) | 128K (GPT-4o) |
| **정확도** | 복잡한 추론/분류에 강점 | 범용적으로 우수 |
| **비용 (입/출력)** | Sonnet: $3/$15 per 1M tok | GPT-4o: $2.5/$10 per 1M tok |
| **기존 의존성** | jaengseung-made에 `@anthropic-ai/sdk` 이미 설치 | `openai` 패키지도 설치됨 |
| **선택** | **Claude API (주)** + OpenAI (폴백) | - |

**Claude 선택 이유:**
1. 200K 컨텍스트 윈도우 — 5개 사이트 크롤링 결과를 한 번에 분석 가능
2. Tool Use 기반 구조화 출력 — Fitment 테이블, Item Specifics 등 복잡한 JSON 구조 강제
3. 자동차 부품 도메인의 정밀한 분류/추론에서 강점 (호환 차종 판단은 환각 최소화 중요)
4. 기존 프로젝트에 SDK 설치됨 — 추가 의존성 없음

**비용 추정 (건당):**
- 입력: ~8K 토큰 (5개 사이트 크롤링 결과 요약) = ~$0.024
- 출력: ~2K 토큰 (구조화된 리스팅 정보) = ~$0.030
- **건당 약 $0.05~0.06 (약 70~80원)**

### 2.5 큐/비동기 처리

| 항목 | 선택 | 근거 |
|------|------|------|
| 작업 큐 | **BullMQ** | Node.js 네이티브, Redis 기반, 재시도/우선순위/스케줄링 내장 |
| 큐 백엔드 | **Redis 7** | BullMQ 필수. 크롤링 결과 TTL 캐시 겸용 |
| 대안 검토 | ~~RabbitMQ~~ | 오버스펙. Node.js 단일 언어 환경에서 BullMQ가 최적 |
| 대안 검토 | ~~Vercel Queue~~ | 아직 베타, 커스텀 재시도 로직 제한적 |

**BullMQ 작업 흐름:**
```
Vercel API → HTTP POST → 크롤러 서버 /jobs 엔드포인트
  → BullMQ 큐에 작업 등록
  → Worker가 Playwright로 크롤링 실행
  → 완료 시 Redis에 결과 저장 + Webhook/SSE로 Vercel에 통지
  → Vercel API가 클라이언트 SSE로 결과 전달
```

### 2.6 기술 스택 종합표

| 레이어 | 기술 | 비용 |
|--------|------|------|
| 프론트엔드 | Next.js 16 + Tailwind v4 + React 19 | Vercel Free/Pro |
| API 오케스트레이터 | Next.js API Routes (Vercel Serverless) | Vercel에 포함 |
| 크롤러 서버 | Node.js + Playwright + BullMQ | VPS $10~20/월 |
| 캐시/큐 | Redis 7 (Docker) | VPS에 포함 |
| AI | Claude API (Anthropic) | ~$0.05/건 |
| DB | Supabase (PostgreSQL) | Free → Pro |
| 환율 | ExchangeRate-API 또는 한국은행 API | 무료 |
| 배포 | Vercel (프론트) + Docker Compose (크롤러) | 합계 ~$15~25/월 |

---

## 3. 핵심 모듈별 상세 설계

### 3.1 크롤러 모듈

#### 아키텍처: 어댑터 패턴

각 대상 사이트를 독립된 어댑터로 구현. 공통 인터페이스를 통해 결과를 정규화.

```
CrawlerOrchestrator
  ├── RockAutoAdapter      (가격, 호환차종, 이미지)
  ├── PartsGeekAdapter     (가격, 리뷰)
  ├── AmazonAdapter        (가격, 판매량)
  ├── EbaySearchAdapter    (경쟁 리스팅, 판매량, 가격)
  ├── PartsouqAdapter      (OEM 번호, 호환 번호, 차종)
  └── (확장 가능: AutoZone, 7zap 등)
```

#### 사이트별 크롤링 전략

| 사이트 | 방식 | 난이도 | 핵심 데이터 | 비고 |
|--------|------|--------|------------|------|
| **RockAuto** | Playwright (동적 렌더링) | 중 | 가격, Fitment, 이미지 URL | 카테고리 네비게이션 필요 |
| **PartsGeek** | HTTP + HTML 파싱 | 하 | 가격, 리뷰 수 | 정적 HTML, 단순 파싱 가능 |
| **Amazon** | Playwright (봇 감지 강함) | 상 | 가격, BSR, 리뷰 | CAPTCHA 빈번, 폴백 필요 |
| **eBay** | **eBay Browse API (공식)** | 하 | 경쟁가, 판매량, 카테고리 | API 우선, 크롤링 최소화 |
| **partsouq** | HTTP + JSON API | 중 | OEM 번호, 호환 번호 | 내부 API 엔드포인트 활용 |

#### 공통 어댑터 인터페이스

```
Input:
  - partNumber: string        (품번)
  - partName: string          (품명, 영문)
  - options?: { timeout, proxy, userAgent }

Output (정규화):
  - source: string            (사이트명)
  - status: "success" | "partial" | "failed"
  - products: Array<{
      title: string
      price: { amount: number, currency: "USD" | "KRW" }
      imageUrls: string[]
      brand: string
      oemNumbers: string[]     (호환 품번)
      fitment: Array<{ year: string, make: string, model: string, engine?: string }>
      url: string
      reviews?: { count: number, rating: number }
      salesRank?: number
    }>
  - metadata: { crawledAt: ISO8601, responseTime: number }
  - error?: string
```

#### Rate Limiting

| 사이트 | 요청 간격 | 일일 한도 | 근거 |
|--------|----------|----------|------|
| RockAuto | 3~5초 (랜덤) | 200회 | 공격적 봇 감지 |
| PartsGeek | 1~2초 | 500회 | 상대적 관대 |
| Amazon | 5~10초 (랜덤) | 100회 | CAPTCHA 트리거 방지 |
| eBay | API Rate Limit 준수 | 5000 calls/day | 공식 API 사용 |
| partsouq | 2~3초 | 300회 | 내부 API 부하 방지 |

#### 캐싱 전략

- **Redis TTL 캐시**: 동일 품번 크롤링 결과를 24시간 캐시
- **캐시 키**: `crawl:{site}:{partNumber}` (예: `crawl:rockauto:16610-0H040`)
- **캐시 히트 시**: 즉시 반환 + "갱신" 버튼으로 수동 리크롤 가능
- **Supabase 장기 캐시**: 30일간 부품 마스터 데이터 (OEM 번호, Fitment) 보관

#### 차단 대응 (폴백 계층)

```
1차: Playwright + Stealth 플러그인 (기본)
  ↓ 차단 감지 시
2차: 프록시 로테이션 (주거용 프록시 풀)
  ↓ 차단 지속 시  
3차: 해당 사이트 스킵 + 나머지 사이트 결과로 분석 진행
  ↓ 핵심 사이트(eBay) 차단 시
4차: eBay 공식 API로 폴백 (Browse API / Finding API)
```

#### 에러 처리

- 각 어댑터는 독립 실행. 1개 사이트 실패해도 나머지 정상 진행
- 최소 2개 사이트 성공 시 AI 분석 진행 가능
- 전체 실패 시: 사용자에게 수동 입력 폼 제공 (URL 붙여넣기)

---

### 3.2 AI 분석 모듈

#### 프롬프트 설계 방향

**System Instruction (고정)**:
```
역할: 자동차 부품 이베이 리스팅 전문가
- 입력된 크롤링 데이터를 분석하여 이베이 리스팅 정보를 생성
- Fitment 정보는 반드시 크롤링 데이터에서 확인된 차종만 포함 (추측 금지)
- 이베이 Title은 80자 이내, 핵심 키워드 우선 배치
- Item Specifics는 eBay Motors Parts & Accessories 카테고리 기준
```

**User Message (동적 — 크롤링 결과 포함)**:
```
품번: {partNumber}
품명: {partName}

[크롤링 결과]
--- RockAuto ---
{rockAutoData}

--- eBay 경쟁 리스팅 ---
{ebayData}

--- OEM DB ---
{oemData}

위 데이터를 분석하여 다음을 생성해주세요:
1. 이베이 최적 제목 (3개 후보)
2. Item Specifics
3. Fitment Chart
4. 가격 추천
```

#### 구조화 출력 (Tool Use Schema)

Claude API의 Tool Use를 활용하여 JSON 구조를 강제:

```
Tool Name: generate_ebay_listing

Parameters Schema:
{
  titles: string[3]                    // 제목 후보 3개
  recommendedTitle: string             // 추천 제목 (80자 이내)
  category: {
    id: number                         // eBay 카테고리 ID
    name: string                       // 카테고리명
  }
  itemSpecifics: {
    brand: string
    manufacturerPartNumber: string
    interchangePartNumber: string      // OE/OEM 호환 번호
    placement: string                  // "Front", "Rear" 등
    type: string                       // 부품 유형
    material: string
    color: string
    warranty: string
    country: string                    // 제조국
    [key: string]: string              // 추가 Specifics
  }
  fitment: Array<{
    year: string                       // "2007-2012" 범위 가능
    make: string                       // "Toyota"
    model: string                      // "Camry"
    engine: string                     // "2.4L L4"
    trim?: string                      // "LE, SE, XLE"
    notes?: string                     // 특이사항
  }>
  priceAnalysis: {
    competitorAvg: number              // 경쟁 평균가 (USD)
    competitorRange: [number, number]  // 최저~최고
    recommendedPrice: number           // 추천 판매가
    reasoning: string                  // 가격 근거
  }
  description: string                  // HTML 상품 설명
  confidence: {
    fitment: "high" | "medium" | "low"
    pricing: "high" | "medium" | "low"
    overall: "high" | "medium" | "low"
  }
  warnings: string[]                   // 주의사항 (불확실한 정보 등)
}
```

#### 정확도 검증 (Multi-source Cross-reference)

1. **Fitment 교차 검증**: 2개 이상 소스에서 확인된 차종만 "high confidence"
2. **OEM 번호 검증**: partsouq/7zap 데이터와 크롤링 결과 대조
3. **가격 이상치 감지**: 경쟁 평균 대비 +-50% 이상 차이나면 경고
4. **confidence 레벨**:
   - `high`: 3개 이상 소스 일치
   - `medium`: 2개 소스 일치
   - `low`: 1개 소스만 확인 → 사용자에게 수동 확인 요청

#### AI 폴백 전략

```
1차: Claude Sonnet 4 (비용 효율 + 정확도 밸런스)
  ↓ 실패/타임아웃 시
2차: Claude Haiku (빠른 응답, 약간의 정확도 트레이드오프)
  ↓ Anthropic API 장애 시  
3차: OpenAI GPT-4o (폴백)
```

---

### 3.3 가격 계산 모듈

#### Input/Output

```
Input:
  - sourcePrices: Array<{ source, price, currency }>  // 크롤링된 가격들
  - competitorPrices: Array<{ price, soldCount }>      // eBay 경쟁 가격
  - userSettings: { marginPercent, shippingMethod, customsRate }

Output:
  - costBreakdown: {
      purchasePrice: number (USD)     // 구매가 (최저가 기준)
      exchangeRate: number            // 적용 환율
      purchasePriceKRW: number        // 원화 구매가
      customsDuty: number (KRW)       // 관세 (8% 기본)
      customsTax: number (KRW)        // 부가세 (10%)
      domesticShipping: number (KRW)  // 국내 배송비
      intlShipping: number (USD)      // 국제 배송비
      ebayFee: number (USD)           // eBay 수수료 (13.25%)
      paypalFee: number (USD)         // PayPal 수수료 (3.49% + $0.49)
      totalCost: number (USD)         // 총 원가
    }
  - pricing: {
      breakEvenPrice: number (USD)    // 손익분기점
      recommendedPrice: number (USD)  // 추천가 (마진 반영)
      competitorAvg: number (USD)     // 경쟁 평균
      marginPercent: number           // 예상 마진율
      profitPerUnit: number (USD)     // 건당 예상 수익
    }
  - comparison: Array<{ source, price, diff }>  // 소스별 가격 비교표
```

#### 환율 처리

- **주 API**: ExchangeRate-API (무료 1,500회/월) 또는 한국은행 Open API
- **캐시**: Redis에 1시간 TTL로 환율 캐시
- **폴백**: 캐시 만료 + API 장애 시 최근 캐시값 사용 (24시간 이내)
- **사용자 수동 입력**: 환율 직접 입력 옵션 제공

#### 관세/수수료 테이블

| 항목 | 기본값 | 사용자 조정 가능 | 비고 |
|------|--------|----------------|------|
| 관세율 | 8% | O | 자동차 부품 HS Code 기준 |
| 부가세 | 10% | X | 고정 |
| eBay Final Value Fee | 13.25% | O | 카테고리별 상이 |
| PayPal/Managed Payments | 3.49% + $0.49 | O | 결제 방식별 상이 |
| 국제 배송비 | 무게 기반 계산 | O | EMS/K-Packet/FedEx 선택 |
| 이베이 프로모션 할인 | 0% | O | Promoted Listings 비용 |

---

### 3.4 리스팅 생성 모듈

#### eBay 카테고리 매핑

주요 자동차 부품 카테고리 매핑 테이블 (DB 저장):

| 부품 유형 | eBay Category ID | Category Path |
|-----------|-----------------|---------------|
| Fuel Pump | 33554 | eBay Motors > Parts > Fuel System > Fuel Pumps |
| Brake Pad | 33560 | eBay Motors > Parts > Brakes > Pads & Shoes |
| Air Filter | 33548 | eBay Motors > Parts > Air Intake > Filters |
| ... | ... | 약 200개 주요 카테고리 사전 매핑 |

- AI가 품명 기반으로 1차 카테고리 추천
- 사전 매핑 테이블과 교차 검증
- 사용자가 최종 선택/수정 가능

#### Item Specifics 템플릿

카테고리별 필수/선택 Item Specifics 템플릿:

```
[공통 필수]
- Brand
- Manufacturer Part Number
- Interchange Part Number
- Placement on Vehicle
- Warranty
- Country/Region of Manufacture
- UPC (없으면 "Does Not Apply")

[카테고리별 추가]
- Fuel Pump: Fuel Type, Number of Outlets, Voltage
- Brake Pad: Position (Front/Rear), Pad Material, Thickness
```

#### Fitment 테이블 출력 형식

eBay Parts Compatibility 형식에 맞춘 CSV/테이블:

```
Year | Make | Model | Trim | Engine | Notes
2007 | Toyota | Camry | LE, SE, XLE | 2.4L L4 DOHC | 
2008 | Toyota | Camry | LE, SE, XLE | 2.4L L4 DOHC |
2008 | Toyota | Camry | SE, XLE | 3.5L V6 DOHC |
...
```

- eBay의 ePID (Product ID) 매칭 시도 (정확한 Fitment 보장)
- CSV 다운로드 기능 (eBay Bulk Upload용)
- 수동 행 추가/삭제 편집 기능

#### 최종 출력 형태

사용자에게 보여지는 리스팅 프리뷰:

```
[복사 가능 영역]
  Title: [편집 가능]
  Category: [드롭다운 선택]
  Item Specifics: [테이블 형태, 각 필드 편집 가능]
  Price: [입력 필드, 원가 계산기 연동]
  Fitment Chart: [테이블, 행 추가/삭제 가능]
  Description: [HTML 프리뷰 + 편집]

[액션 버튼]
  - "전체 복사" (클립보드)
  - "CSV 다운로드" (Fitment)
  - "초안 저장" (Supabase)
  - "히스토리에서 불러오기"
```

---

## 4. DB 스키마 설계 (Supabase / PostgreSQL)

### 4.1 테이블 구조

```sql
-- 사용자 설정
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  default_margin_percent DECIMAL(5,2) DEFAULT 30.00,
  default_shipping_method TEXT DEFAULT 'k-packet',
  default_customs_rate DECIMAL(5,2) DEFAULT 8.00,
  ebay_fee_percent DECIMAL(5,2) DEFAULT 13.25,
  preferred_currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- 검색 히스토리
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  part_number TEXT NOT NULL,
  part_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',  -- pending, crawling, analyzing, completed, failed
  crawl_sources JSONB,            -- 어떤 사이트를 크롤링했는지
  result_summary JSONB,           -- 요약 정보 (가격 범위, 호환 차종 수 등)
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX idx_search_history_user ON search_history(user_id, created_at DESC);
CREATE INDEX idx_search_history_part ON search_history(part_number);

-- 부품 캐시 (크롤링 결과 장기 보관)
CREATE TABLE parts_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_number TEXT NOT NULL,
  source TEXT NOT NULL,           -- 'rockauto', 'partsgeek', 'amazon', 'ebay', 'partsouq'
  raw_data JSONB NOT NULL,        -- 크롤링 원본 데이터
  normalized_data JSONB NOT NULL, -- 정규화된 데이터
  crawled_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 days'),
  UNIQUE(part_number, source)
);
CREATE INDEX idx_parts_cache_lookup ON parts_cache(part_number, source, expires_at);

-- OEM 번호 매핑 (장기 캐시, 잘 변하지 않는 데이터)
CREATE TABLE oem_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_number TEXT NOT NULL,
  oem_numbers TEXT[] NOT NULL,      -- 호환 OEM 번호 배열
  brands TEXT[],                    -- 관련 브랜드
  fitment JSONB,                    -- 호환 차종 데이터
  source TEXT NOT NULL,             -- 데이터 출처
  verified BOOLEAN DEFAULT false,   -- 교차 검증 완료 여부
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_oem_part ON oem_mappings(part_number);
CREATE INDEX idx_oem_numbers ON oem_mappings USING GIN(oem_numbers);

-- 리스팅 초안
CREATE TABLE listing_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_id UUID REFERENCES search_history(id) ON DELETE SET NULL,
  part_number TEXT NOT NULL,
  title TEXT NOT NULL,
  category_id INTEGER,
  category_name TEXT,
  item_specifics JSONB NOT NULL,   -- { brand, mpn, ... }
  fitment JSONB,                   -- [{ year, make, model, engine, trim }]
  price_data JSONB,                -- 가격 계산 결과 전체
  description_html TEXT,           -- HTML 상품 설명
  ai_confidence JSONB,             -- { fitment, pricing, overall }
  ai_warnings TEXT[],              -- AI가 제시한 경고사항
  status TEXT DEFAULT 'draft',     -- draft, published, archived
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_drafts_user ON listing_drafts(user_id, created_at DESC);

-- eBay 카테고리 매핑 (사전 정의)
CREATE TABLE ebay_categories (
  id SERIAL PRIMARY KEY,
  category_id INTEGER UNIQUE NOT NULL,
  category_name TEXT NOT NULL,
  category_path TEXT NOT NULL,
  required_specifics TEXT[],       -- 필수 Item Specifics 필드명
  optional_specifics TEXT[],       -- 선택 Item Specifics 필드명
  keywords TEXT[]                  -- 매칭용 키워드
);
CREATE INDEX idx_ebay_cat_keywords ON ebay_categories USING GIN(keywords);

-- 환율 캐시
CREATE TABLE exchange_rates (
  id SERIAL PRIMARY KEY,
  base_currency TEXT NOT NULL DEFAULT 'USD',
  target_currency TEXT NOT NULL DEFAULT 'KRW',
  rate DECIMAL(12,4) NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.2 RLS (Row Level Security) 정책

```sql
-- 사용자별 데이터 격리
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_drafts ENABLE ROW LEVEL SECURITY;

-- 본인 데이터만 접근
CREATE POLICY "users_own_settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_searches" ON search_history
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_drafts" ON listing_drafts
  FOR ALL USING (auth.uid() = user_id);

-- 캐시 데이터는 모든 인증 사용자 읽기 가능
ALTER TABLE parts_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_read_cache" ON parts_cache
  FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE oem_mappings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_read_oem" ON oem_mappings
  FOR SELECT USING (auth.role() = 'authenticated');
```

---

## 5. API 엔드포인트 설계

### 5.1 Vercel API Routes (오케스트레이터)

#### 검색/크롤링

| Method | Path | 설명 | 요청 | 응답 |
|--------|------|------|------|------|
| POST | `/api/parts/search` | 부품 검색 시작 | `{ partNumber, partName, sources?: string[] }` | `{ jobId, status: "queued", estimatedTime }` |
| GET | `/api/parts/search/[jobId]` | 검색 상태 조회 | - | `{ status, progress: { total, completed, failed }, partialResults? }` |
| GET | `/api/parts/search/[jobId]/stream` | SSE 실시간 진행률 | - | SSE: `{ event, data: { source, status, result? } }` |

#### AI 분석

| Method | Path | 설명 | 요청 | 응답 |
|--------|------|------|------|------|
| POST | `/api/parts/analyze` | AI 분석 실행 | `{ jobId }` 또는 `{ crawlResults }` | `{ listing, confidence, warnings }` |
| POST | `/api/parts/analyze/regenerate` | AI 재분석 (특정 섹션) | `{ jobId, sections: ["title", "fitment"] }` | 해당 섹션만 재생성 |

#### 가격 계산

| Method | Path | 설명 | 요청 | 응답 |
|--------|------|------|------|------|
| POST | `/api/parts/price/calculate` | 가격 계산 | `{ purchasePrice, currency, weight?, settings? }` | `{ costBreakdown, pricing, comparison }` |
| GET | `/api/exchange-rate` | 현재 환율 | `?base=USD&target=KRW` | `{ rate, fetchedAt }` |

#### 리스팅 관리

| Method | Path | 설명 | 요청 | 응답 |
|--------|------|------|------|------|
| POST | `/api/listings/drafts` | 초안 저장 | `{ ...listingData }` | `{ id, createdAt }` |
| GET | `/api/listings/drafts` | 초안 목록 | `?page=1&limit=20` | `{ drafts[], total }` |
| GET | `/api/listings/drafts/[id]` | 초안 상세 | - | `{ ...listingData }` |
| PUT | `/api/listings/drafts/[id]` | 초안 수정 | `{ ...updates }` | `{ ...updated }` |
| DELETE | `/api/listings/drafts/[id]` | 초안 삭제 | - | `{ success }` |
| GET | `/api/listings/drafts/[id]/csv` | Fitment CSV 다운로드 | - | CSV 파일 |

#### 히스토리

| Method | Path | 설명 | 요청 | 응답 |
|--------|------|------|------|------|
| GET | `/api/parts/history` | 검색 히스토리 | `?page=1&limit=20` | `{ searches[], total }` |
| DELETE | `/api/parts/history/[id]` | 히스토리 삭제 | - | `{ success }` |

#### 설정

| Method | Path | 설명 | 요청 | 응답 |
|--------|------|------|------|------|
| GET | `/api/settings` | 사용자 설정 조회 | - | `{ ...settings }` |
| PUT | `/api/settings` | 사용자 설정 수정 | `{ marginPercent?, shippingMethod?, ... }` | `{ ...updated }` |

### 5.2 크롤러 서버 내부 API (VPS)

Vercel -> 크롤러 서버 간 내부 통신. API Key 인증.

| Method | Path | 설명 |
|--------|------|------|
| POST | `/jobs` | 크롤링 작업 등록 |
| GET | `/jobs/[id]` | 작업 상태 조회 |
| GET | `/jobs/[id]/result` | 작업 결과 조회 |
| DELETE | `/jobs/[id]` | 작업 취소 |
| GET | `/health` | 헬스체크 |

인증: `Authorization: Bearer {CRAWLER_API_KEY}` (환경변수)

---

## 6. 계정 안전성 설계

### 6.1 기본 원칙

```
"크롤링은 탐지되지 않는 것이 아니라, 사람처럼 보이는 것이 목표"
```

### 6.2 계층별 방어 전략

#### Layer 1: 브라우저 핑거프린트 위장

| 대책 | 구현 |
|------|------|
| Stealth 플러그인 | `playwright-extra` + `stealth` 플러그인 (WebGL, WebRTC, Navigator 위장) |
| User-Agent 로테이션 | 실제 Chrome/Firefox UA 풀 (50개+), 세션 단위 고정 |
| Viewport 다양화 | 1920x1080, 1366x768, 1440x900 등 실제 해상도 랜덤 선택 |
| 언어/타임존 | `en-US`, `America/New_York` 등 일관된 프로필 |
| WebDriver 플래그 | `navigator.webdriver = false` 강제 |

#### Layer 2: 행동 패턴 모방

| 대책 | 구현 |
|------|------|
| 요청 간격 | 가우시안 분포 랜덤 딜레이 (평균 3초, 표준편차 1.5초) |
| 스크롤 시뮬레이션 | 페이지 로드 후 자연스러운 스크롤 (즉시 파싱 방지) |
| 마우스 무브먼트 | 클릭 전 마우스 이동 궤적 시뮬레이션 |
| 세션 관리 | 쿠키 유지, 세션 간 일관된 행동 |
| 접속 패턴 | 업무 시간대(미국 EST 9-17시) 집중, 심야 크롤링 최소화 |

#### Layer 3: IP/네트워크 관리

| 대책 | 구현 |
|------|------|
| 프록시 풀 | 주거용(Residential) 프록시 10개+ (Bright Data 또는 Oxylabs) |
| IP 로테이션 | 사이트별 세션 단위로 IP 고정 (세션 중 변경 금지) |
| 지역 설정 | 미국 IP만 사용 (부품 사이트 타겟 시장) |
| 프록시 비용 | 약 $15~30/월 (트래픽 기반 과금) |

#### Layer 4: eBay 특별 보호

```
[최우선 원칙] eBay는 크롤링 최소화. 공식 API 최대 활용.

- eBay Browse API: 리스팅 검색, 가격 조회 (공식)
- eBay Finding API: 카테고리 검색 (공식)  
- 크롤링은 API로 불가능한 데이터만 (판매 완료 건수 등)
- eBay 크롤링 시 별도 IP + 최소 빈도 (일 50회 이하)
- 이베이 셀러 계정과 크롤링 IP를 절대 동일하게 사용하지 않음
```

#### Layer 5: 차단 감지 및 자동 중단

```
감지 신호:
  - HTTP 403/429 응답
  - CAPTCHA 페이지 감지 (특정 DOM 요소)
  - CloudFlare Challenge 페이지
  - 비정상적으로 빈 응답

대응:
  1. 즉시 해당 사이트 크롤링 중단
  2. 30분 쿨다운 (해당 사이트만)
  3. 다른 프록시로 재시도 (1회)
  4. 실패 시 해당 사이트 24시간 차단 + 관리자 알림
```

---

## 7. 리스크 & 트레이드오프

### 7.1 기술 선택 트레이드오프

| 선택 | 장점 | 단점 | 대안 |
|------|------|------|------|
| **크롤러 별도 VPS** | 타임아웃 제약 없음, IP 관리 자유 | 인프라 비용 + 관리 부담 | Vercel에서 직접 크롤링 (불가, 60초 제한) |
| **BullMQ + Redis** | 재시도/우선순위 내장, 모니터링 UI | Redis 추가 인프라 | DB 폴링 방식 (단순하지만 비효율) |
| **Playwright** | 다양한 브라우저, 스텔스 생태계 | 메모리 사용량 높음 (~400MB/인스턴스) | Puppeteer (더 가벼우나 Chromium only) |
| **Claude AI** | 긴 컨텍스트, 정밀한 추론 | OpenAI 대비 약간 비쌈 | GPT-4o (더 저렴, 컨텍스트 128K) |
| **SSE** | 단방향 실시간, 구현 단순 | 양방향 불가 | WebSocket (오버스펙), Polling (지연) |
| **Supabase** | 기존 스택, RLS, Auth 통합 | 고빈도 쓰기 시 비용 증가 | 자체 PostgreSQL (관리 부담) |

### 7.2 크롤링 차단 시 폴백 전략

```
[시나리오별 대응]

1. 단일 사이트 일시 차단 (가장 빈번)
   → 해당 사이트 스킵, 나머지로 분석 진행
   → AI가 "데이터 불충분" 경고 출력
   
2. 다수 사이트 동시 차단
   → 사용자에게 수동 URL 입력 폼 제공
   → 사용자가 브라우저에서 직접 검색한 URL을 붙여넣으면 파싱
   
3. eBay API 쿼터 소진
   → 일일 5000회 제한 모니터링
   → 90% 도달 시 캐시 우선 정책으로 전환
   → 100% 시 eBay 검색 링크만 제공 (수동 조회)

4. 장기 차단 (IP 블랙리스트)
   → 프록시 풀 교체
   → 최악의 경우 해당 사이트 어댑터 비활성화
   → 비크롤링 대안: 공식 API가 있는 사이트로 점진적 전환
```

### 7.3 AI 비용 추정

| 사용량 | 월 검색 건수 | AI 비용 | 크롤러 VPS | 프록시 | 합계 |
|--------|------------|---------|-----------|--------|------|
| 초기 (테스트) | 50건 | ~$3 | $10 | $0 (무프록시 테스트) | ~$13/월 |
| 소규모 운영 | 300건 | ~$18 | $15 | $15 | ~$48/월 |
| 중규모 운영 | 1,000건 | ~$60 | $20 | $30 | ~$110/월 |
| 대규모 | 3,000건+ | ~$180 | $40 | $50 | ~$270/월 |

### 7.4 개발 우선순위 제안 (MVP → 풀 버전)

#### Phase 1 — MVP (2~3주)
- 품번 입력 → RockAuto + eBay API만 크롤링
- Claude AI 분석 → 리스팅 제목 + Item Specifics 생성
- 가격 계산기 (수동 입력 기반)
- 크롤러: Vercel 자체 실행 (단순 HTTP 파싱 위주, Playwright 불필요)
- DB: Supabase에 검색 히스토리만

#### Phase 2 — 크롤러 분리 (2주)
- VPS에 Playwright + BullMQ 크롤러 서버 구축
- PartsGeek, Amazon, partsouq 어댑터 추가
- Redis 캐싱 도입
- SSE 실시간 진행률

#### Phase 3 — 고도화 (2주)
- Fitment 교차 검증 + confidence 시스템
- 프록시 로테이션 + 스텔스 강화
- 리스팅 초안 저장/편집/히스토리
- CSV 다운로드 (eBay Bulk Upload)

#### Phase 4 — 확장 (지속)
- eBay Listing API 직접 연동 (리스팅 자동 등록)
- 가격 모니터링 (경쟁 가격 변동 알림)
- 대량 처리 (CSV 품번 목록 일괄 검색)
- 사용자 통계 대시보드

### 7.5 핵심 리스크 목록

| 리스크 | 확률 | 영향 | 대응 |
|--------|------|------|------|
| 크롤링 대상 사이트 구조 변경 | 높음 (분기 1회) | 중 | 어댑터 패턴으로 격리, 모니터링 알림 |
| eBay 계정 제재 (잘못된 Fitment) | 중 | 상 | AI confidence 시스템, 수동 확인 권고 |
| AI 환각 (존재하지 않는 차종 생성) | 중 | 상 | Multi-source 교차 검증, low confidence 경고 |
| 크롤링 IP 차단 | 높음 | 중 | 프록시 풀, API 우선 전략 |
| AI API 비용 초과 | 낮음 | 중 | 캐시 적극 활용, Haiku 폴백 |
| Vercel 타임아웃 (60초) | 중 | 중 | 크롤러 서버 분리 (Phase 2) |

---

## 부록: 쟁승메이드 서비스 연계

이 프로젝트는 jaengseung-made.com의 **외주 개발 포트폴리오** 및 **업무 자동화 서비스** 레퍼런스로 활용:

- `/freelance` 포트폴리오에 "이베이 자동화 툴" 케이스 추가
- `/services/automation` 페이지에서 "해외 이커머스 자동화" 사례로 소개
- 동일 기술 스택(Next.js + Supabase + AI)으로 일관된 개발 역량 시연
- 향후 SaaS화 시 쟁승메이드 구독 서비스로 편입 가능

---

> 이 문서는 초안이며, CEO(박재오) 리뷰 후 Phase 1 착수 전에 확정합니다.
