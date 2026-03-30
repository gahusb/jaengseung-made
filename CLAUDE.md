# 쟁승메이드 (JaengseungMade) — 프리미엄 개발 서비스 사이트

## 프로젝트 개요
7년차 대기업 백엔드 개발자 **박재오**가 운영하는 개발 부업 사이트.
고객 맞춤형 서비스를 개발·판매하거나, 이미 완성된 솔루션을 구독 형태로 제공한다.

## 운영자 정보
- 이름: 박재오
- 경력: 7년차 대기업 백엔드 개발자
- 이메일: bgg8988@gmail.com
- 연락처: 010-3907-1392
- NAS 개인 서버: 로또 랩, 주식 자동매매 프로그램 등 실제 서비스 운영 중

## 핵심 서비스
| 서비스 | 경로 | 설명 |
|--------|------|------|
| 로또 번호 추천 | `/services/lotto` | 빅데이터/통계 기반 로또 번호 분석 제공 |
| 주식 자동 매매 | `/services/stock` | 텔레그램 연동 주식 자동 매매 프로그램 |
| 프롬프트 엔지니어링 | `/services/prompt` | 업무 특화 AI 프롬프트 설계 서비스 |
| 업무 자동화 | `/services/automation` | RPA·엑셀·이메일 등 일상 업무 자동화 개발 |
| 외주 개발 | `/freelance` | 맞춤형 소프트웨어 외주 (포트폴리오 + 문의) |

## 기술 스택
- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **Email**: Resend (API key: 환경변수 `RESEND_API_KEY`)
- **Analytics**: Google Analytics G-WG77RNHXRK
- **Deployment**: Vercel

## 디자인 시스템
- **Primary**: Blue (`#1d4ed8` blue-700, `#2563eb` blue-600)
- **Secondary**: Violet/Purple (`#7c3aed` violet-600, `#8b5cf6` violet-500)
- **Layout**: 대시보드형 — 왼쪽 고정 사이드바 + 오른쪽 스크롤 콘텐츠
- **Sidebar bg**: `#0f172a` (slate-900)
- **Main bg**: `#f1f5f9` (slate-100)
- **Cards**: white + 그림자

## 파일 구조
```
app/
  layout.tsx              — 루트 레이아웃 (메타데이터, 폰트, GA, DashboardShell 래핑)
  page.tsx                — 홈 대시보드 (서비스 카드 그리드)
  globals.css             — 전역 스타일 + CSS 변수
  components/
    DashboardShell.tsx    — 클라이언트: 사이드바 + 메인 영역 레이아웃 래퍼
    Sidebar.tsx           — 클라이언트: 왼쪽 사이드바 내비게이션
    ContactForm.tsx       — 클라이언트: 문의 폼 (Resend 연동)
  services/
    lotto/page.tsx        — 로또 번호 추천 서비스 상세
    stock/page.tsx        — 주식 자동 매매 서비스 상세
    prompt/page.tsx       — 프롬프트 엔지니어링 서비스 상세
    automation/page.tsx   — 업무 자동화 서비스 상세
  freelance/
    page.tsx              — 외주 개발 포트폴리오 + 문의 폼
  api/
    contact/route.ts      — POST: 문의 이메일 발송 (Resend)
```

## AI 에이전트 팀 (`.claude/commands/`)

Claude Code 슬래시 커맨드로 호출하는 전문가 에이전트 팀.
각 에이전트는 프로젝트 컨텍스트를 사전 탑재하고 있어 즉시 역할 수행 가능.

| 커맨드 | 역할 | 주요 책임 |
|--------|------|-----------|
| `/marketing` | 마케팅 전문가 | 카피라이팅, 크몽/숨고 전략, 키워드, 응대 템플릿 |
| `/pm` | 프로젝트 매니저 | 우선순위, 로드맵, 기능 기획, KPI 추적 |
| `/evaluator` | 평가 전문가 | 코드 품질, UX/전환율, 보안, SEO 검토 |
| `/developer` | 풀스택 개발자 | Next.js/FastAPI 개발, 버그 수정, API 설계 |
| `/designer` | UI/UX 디자이너 | 컴포넌트 디자인, 반응형, 전환율 최적화 |
| `/hr` | 견적·회원관리 전문가 | 견적서, 계약 조건, 고객 등급, 클레임 처리 |
| `/saju` | 역술·명리학 전문가 | 사주 계산 검증, 해석 품질, 신규 기능 기획 |

### 사용법
```
/marketing 크몽 홈페이지 제작 서비스 소개글 작성해줘
/pm 이번 주 할 일 우선순위 잡아줘
/evaluator 현재 랜딩 페이지 전환율 이슈 점검해줘
/developer automation 페이지에 엑셀 다운로드 기능 추가해줘
/designer hero 섹션 리디자인해줘
/hr 고객이 홈페이지 제작 문의를 남겼어, 견적서 써줘
/saju 대운 계산 기능을 추가하고 싶어, 로직 설계해줘
```

---

## 개발 규칙
- 서비스 페이지 공통 구조: Hero → Features → Pricing → FAQ → CTA
- 구매/신청 CTA는 `/freelance` 페이지 ContactForm으로 연결 (service 파라미터로 pre-fill)
- 사이드바는 `usePathname`으로 활성 경로 감지
- 모바일: 햄버거 메뉴로 사이드바 토글 (overlay 포함)
- 이미지 없이 아이콘·그래디언트·SVG로 시각적 완성도 유지

---

## 사주 시스템 (`/app/saju`, `/lib/saju-*.ts`)

### AI 연동 (`app/api/saju/analyze/route.ts`)
- **AI**: Google Gemini (`@google/generative-ai`)
- **모델 폴백 순서**: `gemini-2.5-pro` → `gemini-2.5-flash` → `gemini-2.0-flash`
- **핵심 패턴**: `systemInstruction`(프롬프트)과 `userMessage`(트리거) 분리 필수
  - 전체 프롬프트를 user 메시지로 보내면 응답 품질 저하
- **Windows 환경**: `dotenv`로 `.env.local`을 명시적 로드 (`override: true`)
- **Vercel 타임아웃**: `export const maxDuration = 60` (Pro 플랜 기준)
- **Mock 감지**: `isMockInterpretation()` 함수로 DB에 캐시된 예시 데이터 판별
  - `SajuAISection.tsx`에서 mock이면 `validSaved = null`로 처리 → API 재호출
  - 재생성 버튼(🔄)으로 수동 재생성 가능

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
