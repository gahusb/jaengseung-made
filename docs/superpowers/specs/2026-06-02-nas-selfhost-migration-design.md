# 쟁승메이드 NAS 풀 self-host 전환 — 설계 (Spec)

> **상태:** 설계 합의 완료 (2026-06-02). 다음 단계 = 단계별 마이그레이션 계획(writing-plans).
> **목표:** Vercel + Supabase(클라우드) + GitHub public → **NAS 자체 호스팅 + self-host Supabase 스택 + 개인 Gitea(비공개)** 로 전환.

---

## 1. 배경 & 동기

- **결정 동기 (박재오, 2026-06-02):** ① 데이터 주권·통합 운영(사주 등 민감 데이터를 내 NAS에 보관, 기존 NAS 서비스들과 한곳에서 관리), ② 벤더 종속 회피(Vercel/Supabase 정책·가격·계정정지 리스크 탈피). 비용 절감·학습은 부차.
- **접근 확정:** **A. 풀 self-host** — Supabase 스택을 통째로 NAS에 올려 코드 변경을 최소화. (대안 B 슬림 self-host=Auth 전면 재작성 비용 과다, C 하이브리드=구조적으로 어정쩡 → 모두 기각.)
- **핵심 통찰:** Gitea 이전과 NAS self-host는 한 묶음 — Vercel은 Gitea 자동배포를 지원하지 않으므로 Gitea 이전 시 self-host가 자연 귀결.

## 2. 현재 결합도 (이전 비용 분석)

| 의존 | 결합도 | 비고 |
|------|--------|------|
| **Supabase Auth** | 매우 높음 | 이메일+OAuth 로그인, 세션 미들웨어(`utils/supabase/middleware.ts`), **13개 API가 `auth.getUser()`**, RLS가 `auth.uid()` 기반 |
| Supabase DB(Postgres)+RLS | 높음 | 전 기능 의존, Postgres 자체는 이식 가능 |
| Supabase Storage | 중간 | pack-files 서명 URL (`/api/packs/sign-link`, `list-mine`, `lib/supabase/pack-files.ts`) |
| Vercel | 낮음 | 전 route `runtime='nodejs'` → `next start` self-host 가능. `maxDuration=60`은 `app/api/saju/analyze` 1곳(Vercel 전용) |
| Gemini·Portone·Resend | 없음 | 외부 API — 호스팅 위치 무관 |

→ **풀 self-host(A)의 핵심 이점:** supabase-js의 endpoint(URL)와 키만 self-host로 교체하면 Auth·RLS·storage 코드가 거의 그대로 동작.

## 3. 목표 아키텍처 (NAS docker-compose)

```
[인터넷] → DDNS(gahusb.synology.me → jaengseung-made.com)
   → 포트포워딩 443 → nginx (기존, SSL 종단 · Let's Encrypt)
        ├─ / , /api/*           → next-app (next start, output: standalone)
        └─ /auth /rest /storage → supabase-kong (게이트웨이)
             ├─ gotrue        (Auth: 이메일 + Google OAuth)
             ├─ postgrest     (supabase-js REST 대상)
             ├─ storage-api   (pack-files)
             └─ postgres      (전용 인스턴스 — 기존 NAS 서비스 DB와 분리)
```

- **격리:** 기존 NAS 스택(redis·lotto·stock·music-lab 등 15+ 컨테이너)과 **별도 compose 프로젝트**. Postgres는 전용 컨테이너로 기존 서비스 DB와 분리.
- **리소스:** NAS RAM **18,432MB(18GB)** 확보됨 → 메모리 차단요소 해소. CPU(Celeron J4025 2코어)·디스크·동시 부하는 Phase 0에서 실측.

## 4. 컴포넌트 설계

### 4.1 코드 변경 (최소)
- `.env`: `NEXT_PUBLIC_SUPABASE_URL` → NAS 도메인, `ANON_KEY`/`SERVICE_ROLE_KEY` → self-host 발급 JWT 키로 교체.
- `next.config.ts`: `output: 'standalone'` 추가, 빌드에 `sharp`(next/image) 포함.
- `maxDuration=60` 제거(self-host에선 무의미 — Node 프로세스가 직접 처리).
- 그 외 앱 로직(supabase-js 호출, RLS 의존 코드)은 **무수정 목표**.

### 4.2 데이터 마이그레이션
- `pg_dump`(Supabase 클라우드 전체: `auth` 스키마 + `public` 테이블 + RLS 정책 + `storage` 메타) → NAS Postgres restore.
- Storage 객체(pack-files 실파일) 복사.
- 검증: 테이블별 행수 대조, 로그인/세션/RLS 동작, 서명 URL 다운로드, 결제·구독 흐름.

### 4.3 Auth (GoTrue)
- Google OAuth: redirect URL에 NAS 도메인 추가, 세션 쿠키 도메인 정렬.
- GoTrue 메일 발송: 기존 **Resend를 SMTP 자격증명으로** 연결(또는 이메일 확인 비활성 정책 — Phase에서 택1).
- JWT secret 자체 발급 → anon/service_role 키 재생성.

### 4.4 배포 파이프라인 (GitHub public → Gitea)
- 코드 저장소를 개인 **Gitea로 이전(비공개)**.
- **빌드는 로컬 PC**에서 수행(NAS Celeron 빌드 금지 규칙 — workspace CLAUDE.md). standalone 산출물/도커 이미지를 NAS로 전송.
- **기존 `webpage-deployer`(Gitea webhook 수신) 패턴 재사용** → 컨테이너 재시작.

### 4.5 네트워킹·SSL·백업
- DNS: `jaengseung-made.com` → NAS 공인 IP(DDNS). 443 포워딩. Let's Encrypt 자동 갱신.
- 백업: Postgres 일일 `pg_dump` cron + Storage 백업. 기본 모니터링(헬스체크).

### 4.6 컷오버·롤백
- **Vercel+Supabase를 병행 운영**하며 NAS 스택 안정화 → 데이터 최종 동기 → **DNS 전환으로 컷오버**.
- 문제 발생 시 **DNS만 되돌리면 즉시 롤백**. NAS 안정 확인 후 클라우드 자원 해지.

## 5. 선결 차단요소 & 리스크

| 항목 | 상태 | 대응 |
|------|------|------|
| NAS RAM | ✅ 해소 (18GB) | — |
| CPU/디스크/동시부하 | 🔍 Phase 0 실측 | 부족 시 컨테이너 리소스 제한·우선순위 조정 |
| 가용성 다운그레이드 | ⚠️ 수용 | 공개 사이트가 가정 전기·인터넷·동적IP·단일HW·DDoS에 노출. 동기(주권)상 수용하되 백업·DNS 롤백으로 완화 |
| GoTrue 메일/OAuth 전환 | 리스크 | Resend SMTP 연결 + OAuth redirect 검증 |
| self-host Supabase 운영 | 지속 부담 | 버전 업그레이드·백업 루틴 문서화 |

## 6. 결정 사항 (확정)
1. 접근 = **A. 풀 self-host**.
2. GoTrue 메일 = **Resend SMTP 연결**(이메일 확인 유지) 기본, 운영 복잡 시 확인 비활성 대안.
3. 컷오버 = **Vercel/Supabase 병행 후 DNS 전환**, DNS 롤백.
4. Phase 0 = **NAS 리소스 실측을 첫 관문**(RAM은 해소, CPU/디스크/부하 확인).
5. 빌드 = **로컬 빌드 후 NAS 배포**(Celeron 빌드 금지).

## 7. 범위 밖 (Non-goals)
- 외부 API(Gemini/Portone/Resend) 자체 대체 — 하지 않음(호스팅 위치 무관).
- 기존 NAS 다른 서비스(lotto/stock 등) 변경 — 무관.
- 사주 별도 도메인 분리(P5, 도메인 미구매) — 별개 트랙.

## 8. 다음 단계
이 spec 승인 후 `writing-plans`로 단계별 마이그레이션 계획 작성:
- Phase 0 리소스 실측 → Phase 1 NAS Supabase 스택 기동 → Phase 2 데이터 이전·검증 → Phase 3 Next self-host·코드 env 전환 → Phase 4 Gitea 이전·배포 파이프라인 → Phase 5 도메인/SSL/병행→컷오버 → Phase 6 백업·운영·클라우드 해지.
