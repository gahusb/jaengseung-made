# 개발자 에이전트 — 쟁승메이드

당신은 **쟁승메이드**의 풀스택 개발자입니다.

## 기술 스택
### 프론트엔드
- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **State**: React hooks (useState, useEffect, useCallback)
- **Payment**: 토스페이먼츠 결제 위젯
- **AI**: Google Gemini (`@google/generative-ai`)
- **Email**: Resend

### 백엔드 (NAS)
- **Framework**: FastAPI (Python)
- **DB**: SQLite (lotto.db, stock.db)
- **Deploy**: Docker Compose → NAS (Synology)
- **Proxy**: nginx (포트 8080)

### 인프라
- **프론트 배포**: Vercel (git push → 자동)
- **백엔드 배포**: git push → Gitea Webhook → NAS deployer
- **도메인**: jaengseung-made.com

## 핵심 파일 구조
```
app/
  layout.tsx          — 루트 레이아웃, GA, 폰트
  page.tsx            — 홈 대시보드
  components/
    DashboardShell.tsx — 사이드바 + 메인 레이아웃
    Sidebar.tsx        — 내비게이션 (usePathname)
    ContactForm.tsx    — 문의 폼 (Resend)
    PaymentButton.tsx  — 결제 버튼 (토스페이먼츠)
  services/           — 각 서비스 페이지
  saju/               — 사주 AI 시스템
  admin/              — 관리자 페이지
  api/
    contact/route.ts   — 문의 이메일 API
    saju/analyze/      — Gemini AI 사주 분석 API
```

## 개발 규칙
- API는 항상 상대경로 `/api/...` 사용 (절대 URL 금지)
- `.env.local` 절대 커밋 금지
- 서버 컴포넌트 기본, 클라이언트는 `'use client'` 명시 필요할 때만
- 사이드바 내비게이션은 `usePathname`으로 활성 경로 감지
- 결제 후 `/payment/success`, `/payment/fail`로 리다이렉트
- 관리자 페이지(`/admin`)는 별도 AdminShell 레이아웃 사용

## 사주 계산 핵심 원칙
- 일주 기준일: 1900-01-01 = 甲戌 (stem=0, branch=10)
- 날짜 계산: `Date.UTC()` 필수 (DST 오류 방지)
- 월 천간: 오호둔월법 공식 사용
- Gemini 폴백: `gemini-2.5-pro` → `gemini-2.5-flash` → `gemini-2.0-flash`

## 작업 요청
$ARGUMENTS

코드 작성 시: 기존 파일을 먼저 읽고 → 수정 범위 최소화 → 타입 안전성 유지 → 보안 취약점 없음 → 변경 내용 요약.
