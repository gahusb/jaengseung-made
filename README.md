# 쟁승메이드 (JaengseungMade)

> 현직 대기업 백엔드 개발자가 직접 설계·운영하는 개발 서비스 플랫폼
> **검증된 자동화를 SaaS로 + 필요 시 커스텀 외주.**

🔗 https://jaengseung-made.com

---

## 서비스 구성

| 영역 | 경로 | 설명 |
|------|------|------|
| **SaaS 제품** | `/packages` | 검증된 자동화를 월 구독 패키지로 (첫 제품 준비 중) |
| **AI 음악** | `/music/packs` | AI 음악 생성 개발 가이드 패키지 — 1회 결제(₩39k/99k/149k) |
| **커스텀 외주** | `/work` | 외주 개발 · 웹사이트 제작 · AI 사주 |
| **AI 사주** | `/work/saju` | 사주팔자 계산 + AI 12항목 해석 (Gemini) |

---

## 기술 스택

- **Framework**: Next.js 16 (App Router, TypeScript), Tailwind CSS v4
- **Auth/DB**: Supabase (GoTrue Auth · PostgreSQL · RLS · Storage)
- **결제**: Portone (계좌이체/카카오페이/토스페이)
- **메일**: Resend
- **AI**: Google Gemini (사주 해석)
- **Analytics**: Google Analytics (G-WG77RNHXRK)

---

## 배포

현재 **Vercel + Supabase(클라우드)**에서 운영 중이며,
**NAS 자체 호스팅(self-host Supabase + Next standalone + 개인 Gitea)**으로 이전을 진행하고 있다.

- 빌드는 로컬에서 수행(`output: 'standalone'`), 도커 이미지를 NAS로 배포
- self-host Supabase 스택은 docker-compose(PostgreSQL 17 · GoTrue · PostgREST · Storage · Kong)
- 상세 계획: `docs/superpowers/plans/2026-06-02-nas-selfhost-migration.md`

### 로컬 개발
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # standalone 빌드 (.next/standalone)
```

환경변수는 `.env.local`(예시: `.env.local.example`) 참조. `.env*`는 커밋 금지.

---

## 프로젝트 구조

```
app/
  page.tsx                 홈 (SaaS·음악·외주 3축)
  packages/                SaaS 제품 카탈로그 (확장형 lib/saas-catalog.ts)
  music/packs/             AI 음악 생성 개발 가이드 패키지
  work/                    커스텀 외주 (freelance·website·saju)
  api/                     API routes (Supabase service_role 서버 접근)
  admin/                   관리자 (견적·문의·설문·통계)
lib/                       supabase 클라이언트·products·saju 엔진 등
supabase/                  schema.sql · migrations
docs/superpowers/          spec·plan 문서
```

---

## 운영자

**박재오** · 현직 대기업 백엔드 개발자
로또 랩, 주식 자동매매 등 개인 NAS 서버에서 실서비스 운영 중.

- 📧 bgg8988@gmail.com · 📱 010-3907-1392
- 🌐 https://jaengseung-made.com
