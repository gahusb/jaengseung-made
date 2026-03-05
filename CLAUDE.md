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

## 개발 규칙
- 서비스 페이지 공통 구조: Hero → Features → Pricing → FAQ → CTA
- 구매/신청 CTA는 `/freelance` 페이지 ContactForm으로 연결 (service 파라미터로 pre-fill)
- 사이드바는 `usePathname`으로 활성 경로 감지
- 모바일: 햄버거 메뉴로 사이드바 토글 (overlay 포함)
- 이미지 없이 아이콘·그래디언트·SVG로 시각적 완성도 유지
