# 사이트 리뉴얼 Phase 3 — 외주 고객 포털 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **UI 태스크(4·5·8·9)는 구현 시 `designer` + `soft-skill` 스킬 로드 필수.** 노출 페이지 토큰은 `--jsm-*`만, gradient/blur/보라/이모지 금지. admin은 기존 admin 톤 유지.

**Goal:** 외주 의뢰를 접수→검토→견적→수락→진행→완료의 상태 머신으로 관리하고, 고객이 `/track/[token]`(비회원)·mypage(회원)에서 추적·견적 수락/거절할 수 있는 포털 구축. 잔여 정리(레거시 음악 구매 경로 차단, CLAUDE.md 갱신) 포함.

**Architecture:** `contact_requests`에 상태 머신·`public_token`·구조화 필드(project_type/budget/timeline)를 확장하고 `quotes.contact_request_id` FK로 연결 (스펙 §1-1 A안). 견적 발송/수락/거절 시 양 테이블 상태를 서버에서 동기화. 메일은 기존 Resend 패턴(`lib/order-emails.ts`) 준용한 `lib/request-emails.ts`.

**Tech Stack:** Next.js 16 App Router, Supabase, Resend, vitest

**Spec:** `docs/superpowers/specs/2026-06-11-site-renewal-outsourcing-products-design.md` §5·§6
**Branch:** `feature/renewal-phase3`

---

## 현재 코드 기준점 (탐색 검증됨)

- `contact_requests`: id/user_id/email/name/phone/service/message/status(default 'pending', **CHECK 없음**)/created_at. RLS: 본인 SELECT + 누구나 INSERT
- `quotes`: title/client_name/client_email/client_phone/status(draft|sent|accepted|rejected)/public_token/valid_until/wbs/items/maintenance/notes/discount/accepted_* — **contact_request_id 없음**, 견적 발송 메일 기능 없음
- `/api/contact` (`app/api/contact/route.ts`): sanitizeStr+INPUT_LIMITS 검증(34-38행), IP rate limit 5/분(19-29행), 관리자 메일(76-96행), insert(104-112행, user_id 포함)
- `ContactForm.tsx`: 단일 폼, `?service=` 프리필. `/outsourcing` `#contact`에서 props 없이 사용
- `/quote/[token]`: 열람+**수락만** 있음(거절 없음). 수락 POST가 quotes만 갱신, **contact_requests 동기화 없음**
- `admin/contacts`: 3종 status(pending/in_progress/completed) 토글. `admin/quotes`: CRUD + `[id]` 편집 페이지 존재(주장 충돌 있음 — 구현 시 직접 확인), public_token 생성 로직은 명시적으로 없음(DB default 추정 — **구현 시 확인 필수**)
- `mypage` 내 의뢰 탭: contact_requests 카드 목록(StatusBadge 3종)
- 메일 패턴: `lib/order-emails.ts` (Resend, FROM '쟁승메이드 <noreply@jaengseung-made.com>', ADMIN bgg8988@gmail.com, escapeHtml)
- 고아 경로: `/music/packs`(숨김)가 PurchaseAgreementModal로 contact 문자열 구매 신청 생성 — orders에 안 잡힘
- 사이트 URL 상수: `https://jaengseung-made.com`

## 상태 머신 (단일 정의 — Task 2의 lib가 유일한 소스)

```
pending(접수) → reviewing(검토중) → quoted(견적 발송) → accepted(수주 확정) → in_progress(진행중) → completed(완료)
                                            ↘ on_hold(보류)        (어느 단계서든) cancelled(취소)
```
레거시 값(pending/in_progress/completed)은 그대로 유효 — 기존 행 변환 불필요.

---

### Task 1: DB 마이그레이션 — contact_requests 확장 + quotes FK

**Files:**
- Create: `supabase/migrations/2026-06-12-client-portal.sql`

- [ ] **Step 1: SQL 작성** (멱등)

```sql
-- 2026-06-12 Phase 3: 외주 고객 포털
-- (1) contact_requests 확장
ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS public_token text UNIQUE;
ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS project_type text;
ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS budget text;
ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS timeline text;
ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 기존 행 토큰 백필 (멱등 — NULL만)
UPDATE contact_requests SET public_token = gen_random_uuid()::text WHERE public_token IS NULL;

-- 상태 머신 CHECK (레거시 3종 포함 8종)
ALTER TABLE contact_requests DROP CONSTRAINT IF EXISTS contact_requests_status_check;
ALTER TABLE contact_requests ADD CONSTRAINT contact_requests_status_check
  CHECK (status IN ('pending','reviewing','quoted','accepted','on_hold','in_progress','completed','cancelled'));

-- (2) quotes ↔ contact_requests 연결
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS contact_request_id uuid REFERENCES contact_requests(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_quotes_contact_request ON quotes (contact_request_id);

-- (3) quotes.public_token 기본값 보장 (기존 default 없을 때만 의미, 멱등)
ALTER TABLE quotes ALTER COLUMN public_token SET DEFAULT gen_random_uuid()::text;
UPDATE quotes SET public_token = gen_random_uuid()::text WHERE public_token IS NULL;
```

- [ ] **Step 2: schema.sql 대조** — contact_requests/quotes 컬럼명 정합 확인. quotes에 public_token 컬럼이 실제 존재하는지 확인(없으면 ADD COLUMN IF NOT EXISTS 추가)
- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/2026-06-12-client-portal.sql
git commit -m "feat(db): 고객 포털 — contact_requests 상태머신·토큰 + quotes FK"
```

(운영 적용은 배포 전 — 클라우드+NAS 양쪽. Phase 2와 동일 절차)

---

### Task 2: `lib/request-status.ts` (상태 머신, TDD) + `lib/request-emails.ts`

**Files:**
- Create: `lib/request-status.ts`
- Test: `lib/__tests__/request-status.test.ts`
- Create: `lib/request-emails.ts`

- [ ] **Step 1: 실패하는 테스트** — `lib/__tests__/request-status.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { REQUEST_STATUS, TIMELINE_STEPS, timelineIndex, isRequestStatus } from '@/lib/request-status';

describe('request-status', () => {
  it('8개 상태 라벨 정의', () => {
    expect(Object.keys(REQUEST_STATUS)).toHaveLength(8);
    expect(REQUEST_STATUS.quoted.label).toBe('견적 발송');
  });
  it('타임라인은 정주행 6단계', () => {
    expect(TIMELINE_STEPS).toEqual(['pending','reviewing','quoted','accepted','in_progress','completed']);
  });
  it('timelineIndex — 정주행 상태는 해당 인덱스', () => {
    expect(timelineIndex('pending')).toBe(0);
    expect(timelineIndex('completed')).toBe(5);
  });
  it('timelineIndex — on_hold는 quoted 위치(2), cancelled는 -1', () => {
    expect(timelineIndex('on_hold')).toBe(2);
    expect(timelineIndex('cancelled')).toBe(-1);
  });
  it('isRequestStatus 가드', () => {
    expect(isRequestStatus('quoted')).toBe(true);
    expect(isRequestStatus('nope')).toBe(false);
  });
});
```

- [ ] **Step 2: 실패 확인** — `npm test` → FAIL
- [ ] **Step 3: 구현** — `lib/request-status.ts`

```typescript
/** 외주 의뢰 상태 머신 — DB CHECK(2026-06-12-client-portal.sql)와 단일 동기 소스 */
export type RequestStatus =
  | 'pending' | 'reviewing' | 'quoted' | 'accepted'
  | 'on_hold' | 'in_progress' | 'completed' | 'cancelled';

export const REQUEST_STATUS: Record<RequestStatus, { label: string }> = {
  pending:     { label: '접수' },
  reviewing:   { label: '검토중' },
  quoted:      { label: '견적 발송' },
  accepted:    { label: '수주 확정' },
  on_hold:     { label: '보류' },
  in_progress: { label: '진행중' },
  completed:   { label: '완료' },
  cancelled:   { label: '취소' },
};

/** 고객 타임라인 정주행 단계 (on_hold/cancelled는 별도 표기) */
export const TIMELINE_STEPS: RequestStatus[] = [
  'pending', 'reviewing', 'quoted', 'accepted', 'in_progress', 'completed',
];

/** 타임라인에서 현재 위치. on_hold→quoted 위치, cancelled→-1 */
export function timelineIndex(status: RequestStatus): number {
  if (status === 'cancelled') return -1;
  if (status === 'on_hold') return TIMELINE_STEPS.indexOf('quoted');
  return TIMELINE_STEPS.indexOf(status);
}

export function isRequestStatus(v: unknown): v is RequestStatus {
  return typeof v === 'string' && v in REQUEST_STATUS;
}
```

- [ ] **Step 4: 통과 확인** — `npm test` → 기존 5 + 신규 5 = 10 passed
- [ ] **Step 5: `lib/request-emails.ts`** (escapeHtml은 `@/lib/security`에서):

```typescript
import { Resend } from 'resend';
import { escapeHtml } from '@/lib/security';

const FROM = '쟁승메이드 <noreply@jaengseung-made.com>';
const ADMIN_EMAIL = 'bgg8988@gmail.com';
const SITE = 'https://jaengseung-made.com';

function resend() {
  return new Resend(process.env.RESEND_API_KEY);
}

/** 의뢰 접수 확인 — 고객에게 추적 링크 발송 */
export async function sendRequestReceivedEmail(opts: {
  name: string; email: string; service: string; publicToken: string;
}) {
  const { name, email, service, publicToken } = opts;
  await resend().emails.send({
    from: FROM,
    to: [email],
    subject: '[쟁승메이드] 의뢰가 접수되었습니다',
    html: `
      <h2>의뢰가 접수되었습니다</h2>
      <p>${escapeHtml(name)}님, <strong>${escapeHtml(service)}</strong> 의뢰가 정상 접수되었습니다.</p>
      <p>영업일 2일 내에 회신드리며, 아래 링크에서 진행 상태를 언제든 확인하실 수 있습니다.</p>
      <p><a href="${SITE}/track/${publicToken}">의뢰 진행 상태 확인하기</a></p>
      <hr />
      <p style="color:#666;font-size:12px;">이 링크는 본인 확인용입니다. 타인과 공유하지 마세요.</p>
    `,
  });
}

/** 견적 발송 — 고객에게 견적 링크 */
export async function sendQuoteSentEmail(opts: {
  clientName: string; clientEmail: string; quoteTitle: string; quoteToken: string; validUntil: string | null;
}) {
  const { clientName, clientEmail, quoteTitle, quoteToken, validUntil } = opts;
  await resend().emails.send({
    from: FROM,
    to: [clientEmail],
    subject: `[쟁승메이드] 견적서가 도착했습니다 — ${escapeHtml(quoteTitle)}`,
    html: `
      <h2>견적서를 보내드립니다</h2>
      <p>${escapeHtml(clientName)}님, 요청하신 건의 견적서가 준비되었습니다.</p>
      <p><a href="${SITE}/quote/${quoteToken}">견적서 확인하기</a></p>
      ${validUntil ? `<p style="color:#666;font-size:13px;">유효기간: ${escapeHtml(validUntil.slice(0, 10))}</p>` : ''}
      <p>견적서 페이지에서 바로 수락하시거나, 회신으로 문의 주세요.</p>
    `,
  });
}

/** 견적 수락/거절 — 관리자 알림 */
export async function sendQuoteDecisionEmail(opts: {
  decision: 'accepted' | 'rejected'; quoteTitle: string; clientName: string; total?: number;
}) {
  const { decision, quoteTitle, clientName, total } = opts;
  const label = decision === 'accepted' ? '수락' : '거절';
  await resend().emails.send({
    from: FROM,
    to: [ADMIN_EMAIL],
    subject: `[쟁승메이드] 견적 ${label} — ${escapeHtml(quoteTitle)}`,
    html: `
      <h2>고객이 견적을 ${label}했습니다</h2>
      <p>견적: ${escapeHtml(quoteTitle)} / 고객: ${escapeHtml(clientName)}</p>
      ${typeof total === 'number' ? `<p>수락 금액: ₩${total.toLocaleString('ko-KR')}</p>` : ''}
      <p><a href="${SITE}/admin/quotes">견적 관리로 이동</a></p>
    `,
  });
}
```

- [ ] **Step 6: 빌드 확인 + Commit**

```bash
npm test && npm run build
git add lib/request-status.ts lib/__tests__/request-status.test.ts lib/request-emails.ts
git commit -m "feat(portal): 의뢰 상태 머신(TDD) + 의뢰/견적 메일"
```

---

### Task 3: `/api/contact` 확장 — 구조화 필드 + 토큰 + 고객 접수 메일

**Files:**
- Modify: `app/api/contact/route.ts`

- [ ] **Step 1:** 기존 검증·rate limit·관리자 메일 **무수정** 유지하고:
  1. body에서 `projectType`/`budget`/`timeline`도 sanitizeStr(각 100자)로 수신 (없으면 null — 기존 호출자 호환)
  2. `const publicToken = crypto.randomUUID();` (Node crypto — `import crypto from 'crypto'` 또는 Web Crypto `globalThis.crypto.randomUUID()`)
  3. insert에 `public_token: publicToken, project_type, budget, timeline` 추가
  4. **insert 성공 후** 고객 접수 확인 메일: `sendRequestReceivedEmail({ name, email, service: service || '외주 문의', publicToken })` — try/catch로 실패 격리(console.error)
  5. 성공 응답에 `trackUrl: '/track/' + publicToken` 포함 (폼 완료 화면에서 안내용)
- [ ] **Step 2:** `npm run build` + dev에서 curl로 기존 검증(빈 body 400) 회귀 확인
- [ ] **Step 3: Commit**

```bash
git add app/api/contact/route.ts
git commit -m "feat(contact): 구조화 필드 + 추적 토큰 + 고객 접수 확인 메일"
```

---

### Task 4: 단계형 의뢰 폼 — `OutsourcingRequestForm`

> **designer + soft-skill 로드 필수.**

**Files:**
- Create: `app/components/OutsourcingRequestForm.tsx`
- Modify: `app/outsourcing/page.tsx` (#contact 섹션의 ContactForm → 신규 폼 교체)
- 보존: `app/components/ContactForm.tsx` (레거시 페이지 사용 가능성 — 무수정)

- [ ] **Step 1: 4단계 폼 구현** ('use client', 진행 표시기 포함):

| 단계 | 필드 | 비고 |
|------|------|------|
| ① 프로젝트 유형 | 카드 선택 1개: 웹 서비스 / 웹사이트 / 업무 자동화 / API·백엔드 / 봇 개발 / AI 연동 / 기타 | `projectType` |
| ② 예산·일정 | 예산 선택(100만원 미만 / 100~300 / 300~1,000 / 1,000만원 이상 / 미정) + 희망 일정 선택(1개월 내 / 1~3개월 / 3개월+ / 미정) | `budget`, `timeline` |
| ③ 상세 내용 | textarea (필수, "참고 서비스·기능·현재 상황을 자유롭게") | `message` |
| ④ 연락처 | 이름(필수)·이메일(필수)·연락처(선택) — **로그인 상태면 createClient().auth.getUser()로 이메일 자동 채움** | |

- 단계 이동: [다음]/[이전], 각 단계 유효성 검사 후 진행. 제출 시 `POST /api/contact`에 `{ name, phone, email, service: '외주 개발 문의 — ' + projectType, message, projectType, budget, timeline }`
- 완료 화면: "의뢰가 접수되었습니다. 영업일 2일 내 회신드립니다." + 응답의 `trackUrl`로 [진행 상태 확인하기] 버튼 + "메일로도 추적 링크를 보내드렸습니다"
- 디자인: `--jsm-*` 토큰, outsourcing 페이지 톤과 일관. 단계 표시기는 숫자+라벨의 절제된 형태

- [ ] **Step 2:** `app/outsourcing/page.tsx` #contact 섹션에서 `<ContactForm />` → `<OutsourcingRequestForm />` 교체 (섹션 제목·안내 문구 유지)
- [ ] **Step 3:** build + dev: /outsourcing 200 + 폼 마크업 존재. 가능하면 실제 제출 1회(메일 2통: 관리자+고객 확인)
- [ ] **Step 4: Commit**

```bash
git add app/components/OutsourcingRequestForm.tsx app/outsourcing/page.tsx
git commit -m "feat(outsourcing): 4단계 의뢰 폼 + 접수 완료 추적 안내"
```

---

### Task 5: `/track/[token]` 비회원 추적 페이지

> **designer + soft-skill 로드 필수.**

**Files:**
- Create: `app/api/track/[token]/route.ts`
- Create: `app/track/[token]/page.tsx`

- [ ] **Step 1: API** — GET, 서버 admin client로 토큰 조회 (RLS 우회 — 토큰 자체가 비밀):

```typescript
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!token || token.length > 64) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const admin = createAdminClient();
  const { data: request } = await admin
    .from('contact_requests')
    .select('id, name, service, status, project_type, budget, timeline, created_at, updated_at')
    .eq('public_token', token)
    .maybeSingle();
  if (!request) return NextResponse.json({ error: 'not found' }, { status: 404 });

  // 연결된 견적 (sent 이상만 노출 — draft는 비공개)
  const { data: quote } = await admin
    .from('quotes')
    .select('public_token, title, status, valid_until')
    .eq('contact_request_id', request.id)
    .in('status', ['sent', 'accepted', 'rejected'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({ request, quote: quote ?? null });
}
```

(이메일 등 PII는 응답에서 제외 — name·service·상태만)

- [ ] **Step 2: 페이지** — 서버 컴포넌트(자체 fetch 대신 위 로직을 직접 호출해도 됨 — admin client 직접 사용 가능). 구성:
  - 헤더: "의뢰 진행 상태" + 의뢰명(service)·접수일
  - **타임라인**: `TIMELINE_STEPS` × `timelineIndex(status)` — 완료 단계는 accent 채움, 현재 단계 강조, 미래 단계는 회색. `on_hold`면 "보류 중" 배너, `cancelled`면 "취소됨" 배너
  - **견적 카드** (quote 있을 때): 제목·상태·유효기간 + [견적서 보기 → /quote/[quote.public_token]]
  - 하단: "문의: bgg8988@gmail.com" + 회원이면 mypage 안내
  - 토큰 불일치 → `notFound()`
  - metadata: `robots: { index: false }` (비공개 페이지)
- [ ] **Step 3:** build + dev: 존재하지 않는 토큰 404, (마이그레이션 적용 전 로컬은 컬럼 없음 에러 가능 → try/catch notFound 폴백 확인)
- [ ] **Step 4: Commit**

```bash
git add app/api/track/ app/track/
git commit -m "feat(portal): /track/[token] 비회원 의뢰 추적 페이지"
```

---

### Task 6: 견적 연계 — contact 연결·발송 메일·상태 동기화 (admin)

**Files:**
- Modify: `app/api/admin/quotes/route.ts` (POST에 contact_request_id·프리필)
- Create: `app/api/admin/quotes/[id]/send/route.ts` (견적 발송)
- Modify: `app/admin/contacts/page.tsx` (상세 패널에 [견적서 작성] 버튼)

- [ ] **Step 1: quotes POST 확장** — body에 `contact_request_id?`, `client_name?`, `client_email?` 허용. `contact_request_id`가 오면 insert에 포함. (기존 무인자 호출 호환 유지)
- [ ] **Step 2: 발송 API** — `app/api/admin/quotes/[id]/send/route.ts` POST (checkAuth 패턴):
  1. quotes에서 id로 조회 — client_email 없으면 400 "고객 이메일을 먼저 입력하세요"
  2. `public_token` 없으면 `crypto.randomUUID()` 생성·저장
  3. `quotes.status = 'sent'` + updated_at
  4. `contact_request_id` 있으면 `contact_requests.status = 'quoted'` + updated_at 동기화
  5. `sendQuoteSentEmail({ clientName: quote.client_name, clientEmail, quoteTitle: quote.title, quoteToken, validUntil })` — try/catch, 실패 시 응답에 `emailSent: false` 표시 (상태 변경은 유지)
  6. `{ success: true, emailSent }`
- [ ] **Step 3: admin/contacts 상세 패널에 [견적서 작성] 버튼** — 클릭 시 `POST /api/admin/quotes`에 `{ title: contact.service + ' — ' + (contact.name ?? ''), contact_request_id: contact.id, client_name: contact.name, client_email: contact.email }` → 응답 quote.id로 `/admin/quotes/[id]` 이동(기존 편집 페이지). 이미 연결된 견적이 있으면(추가 GET 필요 없이 단순 생성 허용 — 다건 연결 가능, 최신 sent만 고객 노출)
- [ ] **Step 4:** admin/quotes 편집 페이지(`app/admin/quotes/[id]/page.tsx`)에 **[고객에게 발송]** 버튼 추가 — `POST /api/admin/quotes/[id]/send` 호출, 성공 시 "발송됨 + 메일 전송 여부" 토스트/배너. (편집 페이지가 실제로 존재하는지 먼저 확인 — 없으면 BLOCKED 보고 말고 quotes 목록 페이지에 발송 버튼 추가로 대체하고 보고에 명시)
- [ ] **Step 5:** build + 비인증 curl 401 확인 + Commit

```bash
git add app/api/admin/quotes/ app/admin/contacts/page.tsx app/admin/quotes/
git commit -m "feat(admin): 의뢰→견적 연결 생성 + 견적 발송(메일·상태 동기화)"
```

---

### Task 7: 견적 수락/거절 — 고객 측 + 동기화

**Files:**
- Modify: `app/api/quote/[token]/route.ts` (수락 POST에 동기화 + 거절 처리)
- Modify: `app/quote/[token]/page.tsx` (거절 버튼)

- [ ] **Step 1: API 확장** — 기존 POST(수락)에:
  1. body에 `action: 'accept' | 'reject'` 추가 (기존 호출 호환: action 없으면 'accept')
  2. reject면 `quotes.status='rejected'` + updated_at만 (accepted_* 미기록)
  3. 공통: 해당 quote의 `contact_request_id`가 있으면 `contact_requests.status` 동기화 — accept→`'accepted'`, reject→`'on_hold'` (+updated_at)
  4. `sendQuoteDecisionEmail({ decision, quoteTitle: quote.title, clientName: quote.client_name, total: acceptedTotal })` — try/catch 격리
  5. 이미 accepted/rejected 상태면 409 "이미 처리된 견적입니다"
- [ ] **Step 2: 페이지** — 하단 고정 바에 [정중히 거절] 보조 버튼(고스트) 추가 — confirm("견적을 거절하시겠습니까? 다른 조건이 필요하시면 회신 주세요.") → POST {action:'reject'} → "의견 감사합니다. 조정이 필요하시면 언제든 회신 주세요" 화면. 수락 버튼·계산 로직 무수정
- [ ] **Step 3:** build + dev: 존재하지 않는 토큰 404 회귀 + Commit

```bash
git add "app/api/quote/[token]/route.ts" "app/quote/[token]/page.tsx"
git commit -m "feat(quote): 거절 액션 + 의뢰 상태 동기화 + 관리자 알림"
```

---

### Task 8: admin/contacts 상태 머신 고도화

**Files:**
- Modify: `app/admin/contacts/page.tsx`
- Modify: `app/api/admin/contacts/route.ts` (PATCH status 검증)

- [ ] **Step 1: API PATCH** — `isRequestStatus(status)` 검증 추가(불통과 400), update에 `updated_at` 포함
- [ ] **Step 2: 페이지** —
  - STATUS 매핑을 `REQUEST_STATUS`(lib) 기반 8종으로 교체 (필터 탭: 전체/접수/검토중/견적 발송/수주 확정/진행중/완료 — on_hold·cancelled는 '기타' 묶음 또는 개별, 카운트 표시)
  - 상세 패널: 상태 변경을 8종 드롭다운(또는 버튼 그룹)으로, project_type/budget/timeline 표시(있을 때), **/track 링크 복사 버튼**(public_token 있을 때), 연결 견적 존재 시 [견적 보기 → /admin/quotes/[id]] (GET 응답에 견적 join이 없으므로 — `/api/admin/contacts` GET에서 quotes(contact_request_id 매칭 id,title,status)를 2쿼리 머지로 포함)
- [ ] **Step 3:** build + 비인증 401 회귀 + Commit

```bash
git add app/admin/contacts/page.tsx app/api/admin/contacts/route.ts
git commit -m "feat(admin): 의뢰 관리 8종 상태 머신 + 견적 연결·추적 링크 표시"
```

---

### Task 9: mypage '내 의뢰' 타임라인

> **designer + soft-skill 로드 필수.**

**Files:**
- Modify: `app/mypage/page.tsx` (내 의뢰 탭만)

- [ ] **Step 1:** 의뢰 카드 확장 —
  - StatusBadge를 `REQUEST_STATUS` 8종 라벨로 교체 (기존 3종 매핑 대체, 색상: completed 그린/in_progress·accepted accent/quoted accent-soft/cancelled·on_hold 회색 계열)
  - 카드 클릭(또는 펼침) 시 **미니 타임라인** (`TIMELINE_STEPS`+`timelineIndex` — track 페이지와 동일 로직, 컴팩트 렌더)
  - `public_token` 있으면 [상세 추적 → /track/[token]] 링크
  - 연결 견적은 track API처럼 client에서 quotes를 직접 조회하지 않고(RLS) — 간단히 /track 링크로 유도 (YAGNI)
- [ ] **Step 2:** contact_requests select에 신규 컬럼(public_token, project_type, budget, timeline, updated_at) 포함되는지 확인(`select('*')`라 자동). 다른 탭 무수정
- [ ] **Step 3:** build + /mypage 200 + Commit

```bash
git add app/mypage/page.tsx
git commit -m "feat(mypage): 내 의뢰 타임라인 + 추적 링크"
```

---

### Task 10: 레거시 정리 — music 구매 고아 경로 차단 + CLAUDE.md 갱신

**Files:**
- Modify: `next.config.ts`
- Modify: `CLAUDE.md` (jaengseung-made)

- [ ] **Step 1: redirect 추가** — `/music/packs` → `/products` (permanent). `/music/samples`·`/music/studio`는 숨김 가드 유지(admin 열람용). 기존 `/services/music` redirect의 destination도 `/products`로 갱신(체인 방지)
- [ ] **Step 2: CLAUDE.md 갱신** — 다음 섹션을 현행화:
  - 핵심 서비스 표: `/outsourcing`(외주)·`/products`(완성 소프트웨어)·숨김 서비스 목록(admin 토글)
  - 디자인 시스템: `--jsm-*` 토큰 체계(slate+딥블루, Pretendard, 상단 네비 기업형) — 구 사이드바/보라 서술 교체
  - 파일 구조 트리: products/outsourcing/track/admin(orders·products)/lib(product-access·product-files·order-emails·request-status·request-emails) 반영
  - 결제: "계좌이체 orders 단일 소스(PG 보류, pay_method 플래그)" 명시
  - 운영 주의에 추가: "마이그레이션은 클라우드+NAS 양쪽 적용", "2026-06-12-products-extend.sql의 pack_files 백필 UPDATE는 재실행 금지"
  - 사주 시스템 섹션은 유지하되 상단에 "(현재 숨김 — admin 토글로 복귀 가능)" 1줄
- [ ] **Step 3:** build + `/music/packs` redirect 확인 + Commit

```bash
git add next.config.ts CLAUDE.md
git commit -m "chore: music 구매 고아 경로 차단(→/products) + CLAUDE.md 현행화"
```

---

### Task 11: Phase 3 E2E 검증

- [ ] **Step 1: 자동** — `npm test`(10 passed) + `npm run build` + prod 서버 curl:
  - `/outsourcing` 200 + 단계형 폼 / `/track/없는토큰` 404 / `/quote/없는토큰` 404(회귀)
  - POST `/api/contact` 빈 body 400(회귀) / `/api/admin/quotes/x/send` 비인증 401
  - `/music/packs` → 308 `/products`
  - Phase 1·2 회귀: `/` 200, `/products` 200, `/work/saju` 404, `/api/orders` 비로그인 401
- [ ] **Step 2: 수동 (운영 DB 마이그레이션 적용 후)** — 시나리오 A 전 과정:
  의뢰 폼 4단계 제출 → 고객 접수 메일(추적 링크)+관리자 메일 → /track 타임라인 확인 → admin/contacts에서 검토중 전환·[견적서 작성] → 견적 편집·[고객에게 발송] → 고객 메일 링크로 /quote 열람 → 수락 → /track에 '수주 확정' 반영 + 관리자 수락 메일 / (별건) 거절 → on_hold 반영
- [ ] **Step 3: 최종 보고**

---

## 운영 노트

- **배포 전**: `2026-06-12-client-portal.sql`을 클라우드+NAS 양쪽 적용 (Phase 2와 동일 절차 — heredoc 명령 제공 예정)
- 미적용 상태로 코드만 배포되면: 신규 의뢰 insert가 없는 컬럼으로 실패할 수 있음 → **반드시 선적용**
