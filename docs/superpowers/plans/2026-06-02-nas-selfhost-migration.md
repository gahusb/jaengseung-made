# 쟁승메이드 NAS 풀 self-host 전환 — 마이그레이션 계획

> **For agentic workers:** 이 문서는 **인프라 마이그레이션 계획**이다(엄격한 코드 TDD 아님 — 대부분 NAS/Docker/DB 작업이라 "검증 명령"이 테스트 역할). Phase 단위로 목표·작업(파일/명령)·검증·완료조건을 정의한다. 체크박스(`- [ ]`)로 추적한다. **상당수 단계는 NAS SSH·Supabase Dashboard·DNS·OAuth 콘솔에서 사람이 실행**해야 하며, 그런 단계는 `[사용자 실행]`으로 표시한다.

**Goal:** Vercel + Supabase(클라우드) + GitHub public 로 운영 중인 쟁승메이드를 **NAS 자체 호스팅 + self-host Supabase 스택 + 개인 Gitea(비공개)** 로 무중단에 가깝게 이전한다.

**Architecture:** NAS에 별도 docker-compose 프로젝트로 self-host Supabase(Postgres+GoTrue+PostgREST+Storage+Kong) + Next.js(standalone) 컨테이너를 올리고, 기존 nginx로 SSL·리버스 프록시. 앱 코드는 supabase endpoint(URL)와 키만 교체해 Auth·RLS·storage를 보존. Vercel/Supabase 병행 운영 후 DNS 전환으로 컷오버, 문제 시 DNS 롤백.

**Tech Stack:** Next.js 16(standalone) · Supabase self-hosting(docker) · PostgreSQL · Kong · nginx + Let's Encrypt · Synology DDNS · Gitea · Resend(SMTP)

**근거 Spec:** `docs/superpowers/specs/2026-06-02-nas-selfhost-migration-design.md`

---

## 변수 (실행자가 본인 환경값으로 채움)

| 변수 | 의미 | 예시 |
|------|------|------|
| `<NAS_HOST>` | NAS SSH 호스트 | `gahusb.synology.me` |
| `<APP_DOMAIN>` | 서비스 도메인 | `jaengseung-made.com` |
| `<SUPA_DOMAIN>` | self-host Supabase 외부 URL | `supa.jaengseung-made.com` 또는 `<APP_DOMAIN>/supabase` 경로 |
| `<NAS_SUPA_DIR>` | NAS 내 Supabase compose 경로 | `/volume1/docker/jsm-supabase` |
| `<NAS_APP_DIR>` | NAS 내 Next 앱 경로 | `/volume1/docker/jsm-web` |
| `<CLOUD_DB_URL>` | 현재 Supabase 클라우드 connection string | Dashboard > Settings > Database |

> ⚠️ 이 변수들은 placeholder가 아니라 **환경 고유 시크릿/주소**다. 각 단계에서 실제 값으로 치환해 실행한다. 키·비밀번호는 `.env`에만 두고 git 커밋 금지.

---

## Phase 0 — 사전 준비 & 리소스 실측 ✅ (2026-06-02 완료)

> **실측 결과 (2026-06-02):**
> - **RAM** total 17.8GB / available 14GB + swap 12GB → ✅ 넉넉. **디스크** /volume1 1.8TB 여유 → ✅.
> - **CPU** Celeron 2코어, load avg 5.19/2.64/2.16 → 🔶 **유일한 실질 리스크**(기존 부하 높음). 차단요소 아님(빌드 로컬, 런타임만 추가). Phase 6-4에서 실측 판단, 부족 시 컨테이너 CPU limit·스케줄 조정.
> - **포트**: 5432 미점유 ✅ / 8000=portainer·3000=gitea 점유 → **해결책: Postgres·Kong·Next 모두 host 비노출, 기존 nginx만 외부**(docker 내부 네트워크 통신). Studio만 필요 시 임시 포트(8100 등).
> - **DNS**: 가비아 관리. `jaengseung-made.com`→Vercel(216.198.79.1), NAS 공인 IP **211.44.164.244(고정)**.
> - **443**: 외부 테스트 결과 **이미 HTTPS 200 응답**(포트포워딩+인증서 동작 중). → **노출 방식 = 기존 nginx(443)에 vhost 추가로 확정.** Cloudflare Tunnel 불필요(보강 옵션).
> - **gitea 기존 운영 중**(`:3000`) → Phase 5는 신규 설치 없이 기존 gitea에 비공개 레포만 생성.

**목표:** 착수 가능 여부를 확정하고 네트워크/도메인 사전작업을 끝낸다.

**작업:**
- [ ] 0-1. `[사용자 실행]` NAS 여유 리소스 실측 — SSH 후:
  - CPU: `top -bn1 | head -5` (현재 부하), 코어 수 `nproc`
  - RAM: `free -m` (총 18,432MB 확인, available 여유)
  - 디스크: `df -h /volume1` (Supabase+Postgres 데이터+이미지 위해 최소 20GB 여유 권장)
- [ ] 0-2. 기존 NAS 포트 점유 확인 — `docker ps --format '{{.Names}} {{.Ports}}'` 로 5432·8000·3000 등 충돌 여부. 충돌 시 self-host 포트 매핑을 비점유 포트로 계획.
- [ ] 0-3. `[사용자 실행]` DDNS/도메인 확인: `<APP_DOMAIN>` DNS 관리 위치 파악, 현재 Vercel을 가리키는 A/CNAME 레코드 확인(컷오버 때 변경 대상). 공인 IP 고정/DDNS 여부 확인.
- [ ] 0-4. `[사용자 실행]` 라우터 포트포워딩 가능 여부 확인(443, 필요시 80 for ACME). ISP가 80/443 차단하는지 확인.
- [ ] 0-5. 현재 Supabase 사용 기능 인벤토리 확정: Auth(이메일+Google OAuth), DB+RLS, Storage(pack-files). `app/login/page.tsx`의 OAuth provider 목록 재확인.

**검증:** RAM available ≥ 4GB, 디스크 여유 ≥ 20GB, 포트 충돌 없음, 443 포워딩 가능.

**완료 조건:** 위 검증 통과. 하나라도 실패 시 해당 항목 해소 전까지 Phase 1 착수 금지(특히 0-4 실패면 전체 재검토).

---

## Phase 1 — NAS에 self-host Supabase 스택 기동

**목표:** 빈 self-host Supabase 스택을 NAS에 띄우고 헬스체크를 통과한다(데이터는 다음 Phase).

**작업:**
- [ ] 1-1. `[사용자 실행]` 공식 self-hosting 자산 가져오기 — 로컬 또는 NAS에서:
  ```bash
  git clone --depth 1 https://github.com/supabase/supabase
  cp -r supabase/docker <NAS_SUPA_DIR>
  cd <NAS_SUPA_DIR> && cp .env.example .env
  ```
- [ ] 1-2. 시크릿 생성 — `.env` 채우기:
  - `POSTGRES_PASSWORD` = 강한 랜덤
  - `JWT_SECRET` = 40자+ 랜덤
  - `ANON_KEY` / `SERVICE_ROLE_KEY` = 위 JWT_SECRET으로 서명한 JWT (Supabase 문서의 생성기 또는 `supabase/docker` 안내대로 생성)
  - `SITE_URL=https://<APP_DOMAIN>`, `API_EXTERNAL_URL=https://<SUPA_DOMAIN>`, `SUPABASE_PUBLIC_URL=https://<SUPA_DOMAIN>`
  - `DASHBOARD_USERNAME`/`DASHBOARD_PASSWORD`(studio 보호)
- [ ] 1-3. GoTrue(Auth) SMTP = Resend 설정 — `.env`:
  ```
  SMTP_HOST=smtp.resend.com
  SMTP_PORT=465
  SMTP_USER=resend
  SMTP_PASS=<RESEND_API_KEY>
  SMTP_ADMIN_EMAIL=bgg8988@gmail.com
  SMTP_SENDER_NAME=쟁승메이드
  GOTRUE_MAILER_AUTOCONFIRM=false
  GOTRUE_EXTERNAL_GOOGLE_ENABLED=true
  GOTRUE_EXTERNAL_GOOGLE_CLIENT_ID=<GOOGLE_CLIENT_ID>
  GOTRUE_EXTERNAL_GOOGLE_SECRET=<GOOGLE_CLIENT_SECRET>
  GOTRUE_EXTERNAL_GOOGLE_REDIRECT_URI=https://<SUPA_DOMAIN>/auth/v1/callback
  ```
- [ ] 1-4. 포트 매핑을 0-2 결과에 맞춰 조정(Kong 8000/8443, Postgres 5432 충돌 시 host측 포트 변경).
- [ ] 1-5. `[사용자 실행]` 기동: `docker compose up -d` → `docker compose ps` 모든 컨테이너 healthy.
- [ ] 1-6. 검증: 내부에서 `curl -s http://localhost:<KONG_PORT>/auth/v1/health` → ok, PostgREST `/rest/v1/` 응답, Studio 접속.

**검증:** 전 컨테이너 healthy + Auth/REST 헬스 응답.

**완료 조건:** 빈 self-host Supabase가 NAS에서 안정 기동. (외부 노출은 Phase 6에서.)

---

## Phase 2 — 데이터 마이그레이션 (클라우드 → NAS)

**목표:** 클라우드 Supabase의 데이터·인증·스토리지를 NAS Postgres로 무손실 이전.

**작업:**
- [ ] 2-1. `[사용자 실행]` 클라우드 전체 덤프 — 로컬에서:
  ```bash
  pg_dump "<CLOUD_DB_URL>" --no-owner --no-privileges -Fc -f jsm-cloud.dump
  ```
  (auth·storage·public 스키마 포함. RLS 정책은 덤프에 포함됨.)
- [ ] 2-2. NAS Postgres로 복원:
  ```bash
  # 덤프를 NAS로 전송 후, NAS에서:
  docker compose exec -T db pg_restore --no-owner --no-privileges -d postgres < jsm-cloud.dump
  ```
  - 충돌(이미 존재하는 supabase 내부 객체)은 무시 가능 — `public`/`auth.users`/`storage` 데이터가 들어왔는지가 핵심.
- [ ] 2-3. Storage 객체(pack-files 실파일) 이전: 클라우드 Storage 버킷 다운로드 → NAS storage 볼륨에 업로드(또는 storage-api import). 버킷명·경로 보존.
- [ ] 2-4. 시퀀스/식별자 정합성 확인.
- [ ] 2-5. 검증(행수 대조) — 주요 테이블 each:
  ```sql
  -- 클라우드와 NAS 양쪽에서 실행해 비교
  select 'profiles' t, count(*) from profiles
  union all select 'quotes', count(*) from quotes
  union all select 'project_milestones', count(*) from project_milestones
  union all select 'subscriptions', count(*) from subscriptions
  union all select 'contact_requests', count(*) from contact_requests
  union all select 'orders', count(*) from orders
  union all select 'payments', count(*) from payments
  union all select 'saju_records', count(*) from saju_records;
  select count(*) from auth.users;  -- 사용자 수 일치 확인
  ```
- [ ] 2-6. RLS 정책 이전 확인:
  ```sql
  select schemaname, tablename, policyname, roles, cmd
  from pg_policies where schemaname='public' order by tablename;
  ```
  → 클라우드와 동일 정책 세트인지(특히 quotes RLS, project_milestones에 anon 정책 없어야 함 — 2026-06-01 수정 반영).

**검증:** 전 테이블 행수 일치 + `auth.users` 수 일치 + RLS 정책 동일.

**완료 조건:** NAS Postgres가 클라우드 데이터·인증·정책의 완전 사본을 보유.

---

## Phase 3 — Next.js self-host 빌드 준비

**목표:** 앱을 NAS에서 `next start`로 구동 가능한 standalone 컨테이너로 만든다(코드 거의 무수정).

**Files:**
- Modify: `next.config.ts` (output standalone, maxDuration 무관화)
- Modify: `app/api/saju/analyze/route.ts:11` (`maxDuration` 제거)
- Create: `Dockerfile`
- Create: `.dockerignore`

**작업:**
- [ ] 3-1. `next.config.ts`에 standalone 출력 추가:
  ```ts
  const nextConfig: NextConfig = {
    output: 'standalone',
    // ...기존 headers/redirects 유지
  };
  ```
- [ ] 3-2. `app/api/saju/analyze/route.ts`에서 `export const maxDuration = 60;` 제거(self-host Node는 자체 타임아웃). `runtime='nodejs'`는 유지.
- [ ] 3-3. `Dockerfile` 생성(멀티스테이지, standalone):
  ```dockerfile
  FROM node:20-alpine AS deps
  WORKDIR /app
  COPY package.json package-lock.json ./
  RUN npm ci
  FROM node:20-alpine AS builder
  WORKDIR /app
  COPY --from=deps /app/node_modules ./node_modules
  COPY . .
  ARG NEXT_PUBLIC_SUPABASE_URL
  ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
  ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
  ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
  RUN npm run build
  FROM node:20-alpine AS runner
  WORKDIR /app
  ENV NODE_ENV=production
  COPY --from=builder /app/.next/standalone ./
  COPY --from=builder /app/.next/static ./.next/static
  COPY --from=builder /app/public ./public
  EXPOSE 3000
  CMD ["node", "server.js"]
  ```
  > `NEXT_PUBLIC_*`는 빌드타임에 인라인되므로 build-arg로 주입.
- [ ] 3-4. `.dockerignore`: `node_modules`, `.next`, `.git`, `.env*`, `docs`.
- [ ] 3-5. `[로컬 빌드]` 로컬에서 standalone 빌드 검증: `npm run build` → `.next/standalone/server.js` 생성 확인.

**검증:** 로컬 `npm run build` 성공 + standalone 산출물 생성.

**완료 조건:** 앱이 컨테이너로 패키징 가능. (env 전환은 Phase 4.)

---

## Phase 4 — 코드 env 전환 + 로컬 통합 테스트

**목표:** 앱이 NAS self-host Supabase를 바라보게 하고, 로컬에서 핵심 흐름을 검증.

**작업:**
- [ ] 4-1. `.env.production`(또는 배포용 env) 작성 — git 커밋 금지:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://<SUPA_DOMAIN>
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<self-host ANON_KEY (Phase 1-2)>
  SUPABASE_SERVICE_ROLE_KEY=<self-host SERVICE_ROLE_KEY>
  RESEND_API_KEY=...  PORTONE_*=...  GEMINI_API_KEY=...   # 기존 외부 키 그대로
  ```
- [ ] 4-2. `lib/supabase/{client,server,admin}.ts`가 위 env만 참조하는지 재확인(하드코딩 URL 없음 — 이미 env 기반).
- [ ] 4-3. `app/auth/callback/route.ts` 및 OAuth redirect가 `<APP_DOMAIN>` 기준인지 확인. Google Cloud Console에서 승인 redirect URI에 `https://<SUPA_DOMAIN>/auth/v1/callback` + `https://<APP_DOMAIN>/auth/callback` 추가 `[사용자 실행]`.
- [ ] 4-4. `[로컬 통합 테스트]` 로컬 앱을 NAS Supabase(임시로 외부 접근 허용 또는 VPN/내부망)로 띄워 검증:
  - 이메일 회원가입 → Resend 메일 수신 → 확인 → 로그인
  - Google OAuth 로그인
  - 마이페이지 진입(`auth.getUser` 동작), 프로젝트/견적 조회(RLS `user_id` 필터)
  - pack-files 서명 URL 다운로드(`/api/packs/sign-link`)
  - 결제 테스트(`/payment/test`) → orders/payments/subscriptions 기록
  - 사주 분석(`/api/saju/analyze`, Gemini) 동작 + 저장
- [ ] 4-5. 발견된 endpoint/쿠키 도메인 문제 수정(필요 시 supabase-js options, 쿠키 domain).

**검증:** 위 6개 흐름 전부 NAS Supabase에서 정상.

**완료 조건:** 앱이 self-host 백엔드로 핵심 기능 end-to-end 동작.

---

## Phase 5 — Gitea 이전 + 별도 배포 파이프라인

**목표:** 코드를 개인 Gitea(비공개)로 옮기고, 기존 `webpage-deployer`와 **분리된 전용 배포 방식**을 구축한다.

**결정 포인트 (5-1에서 택1):**
- **(권장) 로컬 빌드 → 이미지 전송 → NAS compose**: Celeron 빌드 금지 규칙에 부합. 로컬 `docker build` → `docker save | ssh nas docker load`(또는 사설 레지스트리 push/pull) → NAS에서 `docker compose up -d` 재기동. 가장 단순·통제 명확.
- **(대안) Gitea Actions 러너**: 러너를 로컬/별도 머신(NAS 아님)에 두고 push 시 빌드→전송. 자동화↑ 설정↑.

**작업:**
- [ ] 5-1. 배포 방식 확정(위 택1 — 권장: 로컬 빌드→이미지 전송).
- [ ] 5-2. `[사용자 실행]` **기존 NAS gitea(`:3000`)에** 비공개 레포 생성, 현재 레포를 미러 push:
  ```bash
  git remote add gitea https://<GITEA_HOST>/<user>/jaengseung-made.git
  git push gitea --all && git push gitea --tags
  ```
- [ ] 5-3. NAS에 `<NAS_APP_DIR>/docker-compose.yml` 작성 — next-app 서비스(이미지 + env_file + Supabase 스택 네트워크 연결).
- [ ] 5-4. 배포 스크립트 작성(로컬) `scripts/deploy-nas.(sh|ps1)`:
  ```bash
  docker build --build-arg NEXT_PUBLIC_SUPABASE_URL=... --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=... -t jsm-web:latest .
  docker save jsm-web:latest | ssh <NAS_HOST> "docker load"
  ssh <NAS_HOST> "cd <NAS_APP_DIR> && docker compose up -d"
  ```
- [ ] 5-5. 첫 배포 실행 → NAS에서 next-app 컨테이너 healthy, 내부 `curl localhost:3000` 200.
- [ ] 5-6. (선택) GitHub public 레포 처리: 아카이브/비공개 전환 또는 유지(미러). 결정 기록.

**검증:** Gitea push → 배포 스크립트 → NAS 앱 컨테이너 구동 성공.

**완료 조건:** Gitea 단일 소스 + 재현 가능한 배포 파이프라인.

---

## Phase 6 — 도메인·SSL·nginx + 병행→컷오버

**목표:** 외부 트래픽을 SSL로 받고, 검증 후 DNS를 NAS로 전환한다.

> **노출 방식 확정(Phase 0):** 443이 이미 열려 있고 기존 nginx가 HTTPS 운영 중 → **기존 nginx에 vhost 추가**. 신규 포트포워딩 불필요. Cloudflare Tunnel 미사용.

**작업:**
- [ ] 6-1. `[사용자 실행]` **기존 nginx**(443 운영 중)에 vhost 추가:
  - `<APP_DOMAIN>` → next-app:3000 (docker 내부 네트워크, host 비노출)
  - `<SUPA_DOMAIN>`(또는 `/auth /rest /storage` 경로) → kong (docker 내부)
- [ ] 6-2. `[사용자 실행]` 기존 인증서 발급 방식 그대로 `<APP_DOMAIN>`·`<SUPA_DOMAIN>` 인증서 추가(현 nginx가 이미 Let's Encrypt 또는 Synology 인증서 사용 중 — 동일 절차 차용). 443은 이미 열려 있어 신규 포워딩 불필요.
- [ ] 6-3. `[사용자 실행]` 임시 호스트(hosts 파일 or 스테이징 서브도메인)로 NAS 스택을 **운영 DNS 변경 전에** 외부망에서 검증 — Phase 4의 6개 흐름 재실행(이번엔 실제 도메인/SSL/쿠키).
- [ ] 6-4. 병행 운영: Vercel/Supabase는 그대로 둔 채 NAS 안정성 24~48h 관찰(로그·메모리·CPU).
- [ ] 6-5. `[사용자 실행]` **데이터 최종 재동기**(컷오버 직전 클라우드 증분 — 컷오버 윈도 동안 신규 가입/주문 최소화 또는 점검 공지). 2-1~2-5 재실행(델타).
- [ ] 6-6. `[사용자 실행]` **DNS 컷오버**: `<APP_DOMAIN>` A/CNAME → NAS 공인 IP/DDNS. TTL 낮춰두고 전환.
- [ ] 6-7. 컷오버 후 검증: 실제 도메인에서 로그인·결제·사주·pack 다운로드 재확인. GA/로그 정상.

**검증:** 실제 도메인+SSL에서 전 흐름 정상, 인증서 유효, 응답시간 허용 범위.

**완료 조건:** 운영 트래픽이 NAS를 향하고 핵심 기능 정상. 문제 시 6-6 DNS 롤백.

---

## Phase 7 — 백업·운영·클라우드 해지

**목표:** 운영 지속성을 확보하고 클라우드 자원을 정리한다.

**작업:**
- [ ] 7-1. Postgres 일일 백업 cron(`pg_dump` → 별도 볼륨/외부 보관) + 복구 리허설 1회.
- [ ] 7-2. Storage 백업(rsync 등) 주기 설정.
- [ ] 7-3. 헬스체크/모니터링: 컨테이너 healthcheck + 다운 시 알림(기존 agent-office 텔레그램 재활용 가능).
- [ ] 7-4. 인증서 자동 갱신 동작 확인(갱신 리허설 or 만료 알림).
- [ ] 7-5. self-host Supabase 업그레이드/롤백 절차 문서화(`docs/`).
- [ ] 7-6. **안정 운영 1~2주 확인 후** `[사용자 실행]` Vercel 프로젝트·Supabase 클라우드 자원 해지(데이터 최종 백업 보관 후). 해지 전 되돌릴 수 없음 — 백업 2중 확인.

**검증:** 백업에서 복구 리허설 성공 + 모니터링 알림 동작 + 인증서 갱신 확인.

**완료 조건:** 무인 운영 가능 상태(백업·모니터링·갱신) + 클라우드 의존 0.

---

## 롤백 전략

- **컷오버 전(Phase 1~5):** 운영은 계속 Vercel/Supabase. NAS 작업은 격리되어 운영 무영향. 중단해도 손실 없음.
- **컷오버(Phase 6):** DNS 전환이 유일한 전환점. 문제 시 **DNS를 Vercel로 되돌리면 즉시 복구**(클라우드 미해지 상태이므로). TTL을 미리 낮춰 롤백 신속화.
- **해지 후(Phase 7-6 이후):** 되돌리기 어려움 → 안정 1~2주 + 백업 2중 확인 후에만 해지.

## 리스크 & 대응

| 리스크 | 대응 |
|--------|------|
| CPU(2코어) 동시부하 한계 | Phase 6-4 관찰에서 측정, 부족 시 컨테이너 CPU/메모리 limit·기존 서비스 스케줄 조정 |
| 가정 인터넷/전기 다운 | 가용성 다운그레이드 수용(주권 우선). UPS·모니터링 알림으로 완화 |
| OAuth/쿠키 도메인 불일치 | Phase 4-3·6-3에서 실도메인 검증 |
| 데이터 컷오버 윈도 신규 데이터 유실 | 6-5 델타 재동기 + 점검 공지로 윈도 최소화 |
| self-host Supabase 버전 드리프트 | 7-5 업그레이드 절차 문서화, 핀 버전 고정 |

## 실행 순서 요약

Phase 0(실측) → 1(스택 기동) → 2(데이터 이전) → 3(앱 컨테이너화) → 4(env 전환·로컬 통합테스트) → 5(Gitea·배포) → 6(도메인·SSL·컷오버) → 7(백업·운영·해지). 컷오버(6-6) 전까지는 운영 무영향이라 안전하게 단계 진행 가능.
