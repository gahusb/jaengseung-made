# mypage Phase 2 — NAS 자료 다운로드 자동화

- **작성일**: 2026-05-02
- **상위 컨텍스트**:
  - Phase 1 spec: `docs/superpowers/specs/2026-04-27-mypage-liquidglass-redesign.md`
  - Phase 1 plan: `docs/superpowers/plans/2026-04-27-mypage-liquidglass-redesign-p1.md` (10 commits 완료)
  - 현재 mypage의 "구매한 팩" 탭은 Phase 1에서 placeholder 상태 (비활성 버튼 + 카톡 안내)
- **목표**: Music 팩 자료 다운로드를 자동화. 사용자가 "다운로드" 버튼 클릭 → 인증 → DSM 공유 링크 → 직접 다운로드. admin이 `/admin/packs` 에서 자료 업로드/관리. order.status `completed` 마킹 후 다운로드 활성화.
- **결정 라인 (CEO 확정)**:
  1. 파일 전달 = C — Synology File Station 공유 링크 발급
  2. 업로드 = B — admin UI 자동화
  3. 아키텍처 = B — Vercel → web-backend (NAS) → DSM
  4. 다운로드 UX = A — 파일별 개별 버튼
  5. **공유 링크 만료**: 4시간
  6. **파일 크기 한도**: 5GB
  7. **order.status 완료 흐름**: 기존 `/admin/contacts` PATCH로 처리. 본 spec에 운영 절차로 문서화.

## 1. 시스템 아키텍처

### 1.1 다운로드 흐름

```
사용자가 mypage "구매한 팩" 탭에서 [다운로드] 클릭
   ↓ POST /api/packs/sign-link  body: { fileId }
Vercel API (jaengseung-made)
   ↓ 1) supabase.auth.getUser() → user
   ↓ 2) orders 조회: user_id 일치 + service prefix '구매 신청: ...' + status='completed'
   ↓ 3) extractPackTier(order.service) → tier
   ↓ 4) pack_files 조회: id=fileId AND min_tier <= tier
   ↓ 5) 통과 시: web-backend 호출
   ↓
web-backend (NAS, FastAPI) — /api/packs/sign-link
   ↓ HMAC 검증 (Vercel ↔ backend 공유 시크릿)
   ↓ DSM API SYNO.FileStation.Sharing.create(file_path, expire_time = now+4h)
   ← { url: 'https://gahusb.synology.me:5001/d/s/<id>', expiresAt }
Vercel API
← { url, expiresAt }
사용자 브라우저
   ↓ window.location.href = url
DSM이 직접 stream → 다운로드 시작
```

### 1.2 업로드 흐름 (5GB 대응 — Vercel 우회)

```
admin이 /admin/packs 에서 파일 선택 + tier/label 입력 + [업로드]
   ↓ 1) 작은 prep request: POST /api/admin/packs/upload-url
       body: { tier, label, filename, sizeBytes }
Vercel API (jaengseung-made)
   ↓ verifyAdminTokenNode(cookie) — 기존 admin 인증
   ↓ HMAC 일회성 업로드 토큰 발급 (15분 만료, payload = {tier,label,filename,sizeBytes,jti})
   ← { uploadUrl, token, expiresAt }
admin 브라우저
   ↓ 2) 큰 multipart POST 직접: PUT https://gahusb.synology.me/api/packs/upload
       headers: Authorization: Bearer <token>
       body: file binary (~5GB)
       (Vercel 거치지 않음 → function body limit 우회)
web-backend (NAS, FastAPI) — /api/packs/upload
   ↓ HMAC 토큰 검증 (jti 단발성, 만료 체크)
   ↓ /volume1/docker/webpage/media/packs/{tier}/{filename} 저장
   ↓ 파일 크기 검증 (≤5GB)
   ↓ supabase pack_files INSERT (admin service role key)
   ← { fileId, sizeBytes, uploadedAt }
admin 브라우저
   ↓ 3) UI 갱신 (새 파일 카드 추가)
```

### 1.3 order.status `completed` 마킹 흐름 (기존 코드 활용)

```
입금 도착 → CEO가 가계좌 입금 확인
   ↓
admin /admin/contacts 페이지 진입
   ↓
해당 "구매 신청: AI 음악 마스터 팩 · 프로" 행 status drop-down
   ↓ pending → in_progress (입금 확인 중)
   ↓ in_progress → completed (입금 확정 + 자료 발송 준비 완료)
   PATCH /api/admin/contacts (기존)
   contact_requests.status = 'completed'
   ↓
mypage가 다음 진입 시 order.status='completed' 확인 → 다운로드 버튼 활성화
```

→ Phase 2는 위 흐름의 코드 변경 없음. 운영 매뉴얼만 갱신 (CEO에게 안내).

## 2. 변경 범위 (jaengseung-made repo, Vercel)

| 파일 | 종류 | 책임 |
|---|---|---|
| `lib/pack-assets.ts` | Modify | `PACK_ASSETS.files: string[]` 폐기. `name`, `TIER_LABEL`, `extractPackTier`만 유지. 파일 메타데이터는 DB가 SSOT |
| `lib/supabase/pack-files.ts` | Create | `getPackFilesForTier(tier)` 등 supabase 쿼리 헬퍼 |
| `lib/web-backend.ts` | Create | web-backend 호출 헬퍼 (HMAC 시그니처, base URL, 타임아웃). `signLink()`, `signUploadToken()` 함수 |
| `app/api/packs/sign-link/route.ts` | Create | 사용자 다운로드 권한 검증 + web-backend 프록시 |
| `app/api/admin/packs/upload-url/route.ts` | Create | admin 업로드 prep — HMAC 토큰 발급 |
| `app/api/admin/packs/route.ts` | Create | admin 파일 목록(GET) + 인라인 편집(PATCH: label, sort_order, min_tier) + soft delete(DELETE) |
| `app/admin/packs/page.tsx` | Create | admin 자료 관리 UI (티어별 그룹 + 업로드 폼 + 진행률 + 인라인 편집) |
| `app/admin/components/AdminSidebar.tsx` | Modify | 메뉴에 "팩 자료" 항목 추가 |
| `app/mypage/page.tsx` | Modify | "구매한 팩" 탭 — `disabled` 버튼 → status별 분기 활성/비활성 다운로드 |

## 3. 변경 범위 (web-page-backend repo, NAS)

> ⚠️ 이 repo는 Gitea (`gitea.gahusb.synology.me/gahusb/web-page-backend.git`)이며 push 시 webhook으로 자동 배포됨. workspace CLAUDE.md 참고. plan에서 task별로 어느 repo인지 명시.

| 파일 | 종류 | 책임 |
|---|---|---|
| `web-backend/backend/app/packs/__init__.py` | Create | router 등록 |
| `web-backend/backend/app/packs/routes.py` | Create | 3개 엔드포인트: `POST /api/packs/upload`, `POST /api/packs/sign-link`, `DELETE /api/packs/{id}` |
| `web-backend/backend/app/packs/dsm_client.py` | Create | DSM API wrapper — login/logout 세션 관리, SYNO.FileStation.Sharing.create |
| `web-backend/backend/app/packs/auth.py` | Create | HMAC 토큰 검증 (Vercel ↔ backend 공유 시크릿) |
| `web-backend/backend/app/main.py` | Modify | packs router 마운트 |
| `web-backend/.env` | Modify | DSM_HOST, DSM_USER, DSM_PASS, BACKEND_HMAC_SECRET 추가 |
| nginx 설정 | Modify | `/api/packs/upload` 만 max body size 5GB로 (다른 API는 기존 limit 유지) |

## 4. DB 스키마 (Supabase)

### 4.1 신규 테이블: `pack_files`

```sql
create table pack_files (
  id uuid primary key default gen_random_uuid(),
  min_tier text not null check (min_tier in ('starter', 'pro', 'master')),
  label text not null,
  file_path text not null unique,
  -- 예: /volume1/docker/webpage/media/packs/master/sample-3.zip
  -- web-backend가 DSM API 호출 시 그대로 사용
  filename text not null,
  -- file_path의 basename. UI 표시용 + 다운로드 시 suggested filename
  size_bytes bigint not null,
  sort_order int not null default 0,
  uploaded_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_pack_files_tier on pack_files(min_tier, sort_order)
  where deleted_at is null;
```

### 4.2 권한 매핑 함수 (TypeScript, lib/supabase/pack-files.ts)

```ts
const TIER_HIERARCHY: Record<PackTier, PackTier[]> = {
  starter: ['starter'],
  pro: ['starter', 'pro'],
  master: ['starter', 'pro', 'master'],
};

export function tierIncludes(userTier: PackTier): PackTier[] {
  return TIER_HIERARCHY[userTier];
}

// 사용 예: supabase.from('pack_files').select('*')
//   .in('min_tier', tierIncludes('pro'))
//   .is('deleted_at', null)
//   .order('min_tier').order('sort_order');
```

### 4.3 RLS 정책

```sql
-- 일반 사용자는 직접 SELECT 못함. API 라우트가 service role로 접근.
alter table pack_files enable row level security;

-- admin 작업은 service role key 사용 (createAdminClient) — RLS 우회
-- 일반 사용자는 RLS 정책 없음 → SELECT 차단
```

→ 모든 사용자 다운로드는 `/api/packs/sign-link` 를 거쳐 admin client로 조회. 직접 supabase 쿼리 X.

## 5. 보안 모델

### 5.1 인증 레이어

| 흐름 | 인증 방식 | 검증 위치 |
|---|---|---|
| 사용자 다운로드 (`/api/packs/sign-link`) | supabase 세션 쿠키 | Vercel API (Next.js) |
| admin 업로드 prep (`/api/admin/packs/upload-url`) | `admin_token` HTTP-only 쿠키 (HMAC) | Vercel API (`verifyAdminTokenNode`) |
| admin 파일 직접 업로드 (web-backend `/api/packs/upload`) | 일회성 HMAC Bearer 토큰 | web-backend (`auth.verify_upload_token`) |
| Vercel ↔ web-backend `/api/packs/sign-link` | HMAC 시그니처 (request body + timestamp) | web-backend (`auth.verify_request_hmac`) |

### 5.2 일회성 업로드 토큰 (HMAC)

Vercel이 발급, web-backend가 검증:

```
payload = {
  tier: 'master',
  label: '제작 레시피 영상',
  filename: 'recipe-vol1.mp4',
  sizeBytes: 524288000,
  expiresAt: 1717920000,
  jti: '<uuid>',  // 일회성 ID — web-backend redis 또는 메모리 set으로 1회만 사용
}
token = base64(payload) + '.' + hmac_sha256(payload, BACKEND_HMAC_SECRET)
```

web-backend 검증:
1. payload base64 decode
2. HMAC 재계산 → 일치 확인
3. expiresAt > now (15분 내 사용)
4. jti 중복 체크 (이미 사용됨? 거부)
5. uploaded filename·sizeBytes가 token payload와 일치 확인 (mismatch 거부)

### 5.3 공유 링크 만료

- DSM `SYNO.FileStation.Sharing.create` 의 `expire_time` = **4시간 후**
- 사용자가 4시간 내 클릭 안 하거나, 클릭 후 다른 기기에서 다시 받으려 하면 → 새 링크 클릭 (mypage 버튼 다시 누르면 재발급)
- 링크 자체는 유출돼도 4시간 후 무력화 (Synology가 거부)

### 5.4 DSM credentials 보호

- DSM admin 계정 정보는 **web-backend `.env`만** 보유
- Vercel env에는 DSM 정보 없음 (web-backend HMAC 시크릿만)
- web-backend는 DSM과 같은 NAS 내에서 통신 (localhost 또는 LAN), 인터넷 노출 X
- web-backend 자체의 `/api/packs/*` 는 nginx 통해 외부 접근 가능하나, HMAC 검증으로 차단

## 6. 업로드 한도 + 검증

### 6.1 파일 크기

- **사용자 표시**: 5GB
- **client side 검증**: `file.size <= 5 * 1024 * 1024 * 1024`
- **HMAC token payload sizeBytes**: client가 신고한 크기 (15분 만료)
- **web-backend 검증**: 실제 multipart stream 길이가 token sizeBytes와 일치 + 5GB 이하
- **nginx config**: `/api/packs/upload` 만 `client_max_body_size 5G`. 다른 endpoint는 기존 limit 유지.

### 6.2 허용 파일 타입

확장자 whitelist (web-backend에서 검증):
- 문서: `pdf`
- 압축: `zip`
- 영상: `mp4`, `mov`, `mkv`
- 음성: `wav`, `m4a`, `mp3`
- 이미지: `png`, `jpg`, `jpeg`, `webp`
- Suno project: `prj` (실제로는 zip 변형이므로 검증 시 zip로 처리해도 됨 — 일단 별도 확장자로 허용)

다른 확장자는 거부.

### 6.3 파일 경로 안전

- filename 저장 시 sanitize: 한글 허용, `.`/`/`/`\\`/null byte 등 위험 문자 거부
- `file_path` 는 web-backend가 결정. client는 영향 X.
- 동일 파일명 업로드 시 — 신규 파일은 자동 suffix `(1)`, `(2)` 추가 또는 reject + 에러 (CEO 결정 필요? — 기본은 reject + 에러로 명확히)

→ **결정**: 동일 파일명 업로드는 reject. CEO가 새 이름 또는 기존 파일 soft delete 후 재업로드.

## 7. mypage "구매한 팩" 탭 변경 (Phase 1 → Phase 2)

### Phase 1 현재 (placeholder)
```tsx
[자료 패키지 (5개)]
 · MV 워크플로우 가이드
 · 샘플 프로젝트 1개
 · ...
[자료 준비 중]  // disabled, status 상관없이
※ 카톡 1:1로 자료 전달
[카톡 오픈채팅 →]
```

### Phase 2 (status별 분기)
```tsx
{order.status === 'completed' && (
  // 다운로드 활성
  [자료 패키지 (5개)]
   · MV 워크플로우 가이드      [다운로드]  // 클릭 → /api/packs/sign-link → window.location
   · 샘플 프로젝트 1개          [다운로드]
   · 유튜브 SEO 템플릿          [다운로드]
   · ...
  ※ 다운로드 링크는 4시간 동안 유효합니다
)}

{order.status === 'in_progress' && (
  // 처리 중 — Phase 1 형태 유지
  [자료 패키지 (5개)]
   · ...
  [결제 처리 중]  // disabled
  ※ 입금 확인 후 자료가 활성화됩니다
)}

{order.status === 'pending' && (
  [자료 패키지 (5개)]
   · ...
  [입금 대기]  // disabled
  ※ 카톡 1:1로 입금 안내드립니다
  [카톡 오픈채팅 →]
)}
```

### 데이터 fetch 추가

mypage page.tsx 의 `init()` 함수에 pack_files fetch 추가:

```ts
// pack_files: orders 상의 모든 tier 세트 합집합으로 한 번 fetch
const allTiers = new Set<PackTier>();
for (const o of (ord || [])) {
  const t = extractPackTier(o.service);
  if (t) tierIncludes(t).forEach(x => allTiers.add(x));
}
if (allTiers.size > 0) {
  const { data: files } = await supabase
    .from('pack_files')
    .select('*')
    .in('min_tier', Array.from(allTiers))
    .is('deleted_at', null)
    .order('min_tier').order('sort_order');
  setPackFiles(files || []);
}
```

다운로드 버튼 클릭 핸들러:
```ts
async function handleDownload(fileId: string) {
  setDownloading(fileId);
  try {
    const res = await fetch('/api/packs/sign-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId }),
    });
    const { url } = await res.json();
    if (!url) throw new Error('링크 발급 실패');
    window.location.href = url;  // 다운로드 시작
  } catch (e) {
    alert('다운로드 준비 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  } finally {
    setDownloading(null);
  }
}
```

## 8. Admin `/admin/packs` UI

### 8.1 레이아웃

```
사이드바 → "팩 자료" 메뉴 (신규)
  메인:
  ┌────────────────────────────────────────┐
  │ [새 자료 업로드]                         │
  │  Tier: [starter|pro|master ▼]          │
  │  Label: [Suno 프롬프트 북 PDF (40p)]    │
  │  File: [파일 선택...] (5GB 까지)        │
  │  진행률: [▓▓▓░░░░░░░] 35% (1.2GB / 3.4GB)│
  │  [업로드]                                │
  └────────────────────────────────────────┘
  
  ┌── starter (3) ───────────────────────────┐
  │ ① Suno 프롬프트 북 PDF (40p)  · 12 MB    │
  │   [편집] [↑] [↓] [삭제]                   │
  │ ② 구조 템플릿 PDF · 4 MB                 │
  │ ③ 저작권 가이드 기본판 · 2 MB             │
  └────────────────────────────────────────┘
  
  ┌── pro (4) ──────────────────────────────┐
  │ ...                                      │
  └────────────────────────────────────────┘
  
  ┌── master (4) ───────────────────────────┐
  │ ...                                      │
  └────────────────────────────────────────┘
```

### 8.2 인라인 편집 동작

- **편집 (label, sort_order, min_tier)**: PATCH `/api/admin/packs` body `{ id, label?, sort_order?, min_tier? }`
- **↑/↓ (재정렬)**: 같은 tier 내에서 sort_order 교환. 즉시 PATCH 두 번 (또는 batch endpoint)
- **삭제**: confirm → DELETE `/api/admin/packs?id=...` → soft delete (deleted_at 설정)
- 파일 자체 삭제는 30일 후 backend cron (이번 spec 범위 밖, 별도)

### 8.3 업로드 진행률

- XHR `xhr.upload.onprogress` 이벤트로 진행률 추적
- fetch API는 upload progress 미지원 → XMLHttpRequest 사용
- 4-5GB 업로드는 사용자 회선에 따라 5-30분 소요 → 페이지 닫지 말라는 안내 표시

## 9. 운영 절차 (CEO 매뉴얼)

이 spec 구현 후 admin 운영 흐름:

### 9.1 새 팩 자료 업로드 (1회 또는 자료 추가/교체 시)

1. `/admin/packs` 진입
2. tier 선택 + label 입력 + 파일 선택 + [업로드]
3. 진행률 100% + "업로드 완료" 토스트 → 자동으로 리스트에 추가됨
4. 사용자에게 즉시 노출 (별도 publish 단계 없음)

### 9.2 신규 구매 처리 (기존 흐름 유지)

1. PurchaseAgreementModal로 구매 신청 도착 → contact_requests 에 row 생성 (status='pending')
2. CEO 카톡으로 입금 안내
3. 사용자 입금 → CEO 가계좌 확인
4. `/admin/contacts` 진입 → 해당 row status: pending → in_progress (입금 확인 시작)
5. 가계좌에서 입금 확인 → status: in_progress → **completed**
6. 사용자가 mypage 진입 → order.status='completed' → "구매한 팩" 탭에 다운로드 버튼 활성

→ Phase 2 코드 변경 없음. 매뉴얼만 갱신.

## 10. 마이그레이션 (Phase 1 → Phase 2)

### 10.1 lib/pack-assets.ts 변경

현재:
```ts
export const PACK_ASSETS: Record<PackTier, PackAsset> = {
  starter: { name: '...', files: ['Suno 프롬프트 북 PDF (40p)', ...] },
  ...
};
```

변경 후:
```ts
export const PACK_TIER_NAMES: Record<PackTier, string> = {
  starter: `AI 음악 마스터 팩 (${TIER_LABEL.starter})`,
  pro: `AI 음악 마스터 팩 (${TIER_LABEL.pro})`,
  master: `AI 음악 마스터 팩 (${TIER_LABEL.master})`,
};
// PACK_ASSETS 폐기. files 정보는 pack_files DB 테이블이 SSOT.
```

mypage page.tsx 의 `PACK_ASSETS[tier].name` → `PACK_TIER_NAMES[tier]`. `PACK_ASSETS[tier].files` 사용처는 fetch한 packFiles로 대체.

### 10.2 초기 데이터 입력

Phase 2 배포 후 admin이 수동으로 12-15개 자료 업로드. 이때까지 사용자에게는 "자료 준비 중" 표시 (packFiles=[] → fallback 표시).

→ 배포 → admin 업로드 → 사용자 노출. 무중단.

### 10.3 schema migration

```bash
# supabase/migrations/2026-05-02-create-pack-files.sql
create table pack_files (...);  # 위 §4.1
create index ...;
alter table pack_files enable row level security;
```

## 11. 의도적 제외 (Phase 3 또는 별도)

- ZIP 일괄 다운로드
- 다운로드 횟수 제한
- 워터마크
- 자료 버전 관리 (예: v1, v2, 자동 changelog)
- 사용자별 차별화 자료 (예: 프리미엄 전용 영상 별도 발급)
- 30일 후 soft-deleted 파일 자동 hard delete (cron)
- DSM 세션 풀링 (현재는 매 요청마다 login → action → logout)
- multipart 분할 업로드 (5GB 한도라 X — 큰 파일은 수동 분할 zip 필요)

## 12. 확정 사항 (2026-05-02 CEO 확정)

| 항목 | 결정 | 적용 |
|---|---|---|
| DSM 버전 | **DSM 7.x** | `dsm_client.py` 7.x API 기준 작성 (SYNO.FileStation.Sharing v3) |
| DSM admin 계정 | **신규 전용 계정** `web-packs-admin` | CEO가 NAS DSM에서 신규 사용자 생성. 권한: File Station 읽기/쓰기 + Sharing 발급만. SSH/관리자 권한 X |
| 동일 파일명 업로드 | **reject + 명시적 에러** | "이미 존재하는 파일명입니다. 다른 이름으로 업로드하거나 기존 파일을 먼저 삭제하세요" |
| nginx body limit | **`/api/packs/upload` 만 5G** | nginx server 블록에 location-specific `client_max_body_size 5G` |
| HMAC 시크릿 | **32 byte (256 bit) 무작위** | `openssl rand -hex 32` 로 생성 → web-backend `.env`, Vercel env 동시 등록 |

위 결정 모두 plan task에 반영. 운영 시 추가 의문 발생하면 별도 follow-up.

## 13. 다음 단계

1. 이 spec 검토 (사용자)
2. §12 의문 사항 결정
3. 승인 후 → `superpowers:writing-plans` 로 implementation plan 작성
4. plan은 두 repo 작업 묶음 → task별 어느 repo인지 명시
5. plan 작성 후 → `superpowers:subagent-driven-development` 로 task별 실행
