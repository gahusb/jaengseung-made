# 사이트 리뉴얼 Phase 2 — 제품 판매 시스템 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **UI 태스크(7·9·10)는 구현 시 `designer` + `soft-skill` 스킬 로드 필수.** 토큰은 `--jsm-*`만, gradient/blur/보라/이모지 금지.

**Goal:** 완성 소프트웨어 판매를 "orders 테이블 단일 소스"로 재구축 — 동적 카탈로그(/products), 계좌이체 주문, admin 입금 확인, orders 기반 다운로드 검증, 기존 음악 팩 구매자 이관.

**Architecture:** `products` 테이블 확장(is_listed/features/description_long/pay_method/sort_order) + `pack_files.product_id` 연결로 pack 인프라를 범용화. 구매 식별은 `contact_requests.service` 문자열 파싱(`extractPackTier`)을 폐기하고 `orders(status='paid')` 기반 `lib/product-access.ts`로 교체. web-backend(packs-lab)는 무수정 — 업로드는 기존 tier 토큰 방식 유지 후 프론트에서 product_id 배정.

**Tech Stack:** Next.js 16 App Router, Supabase, Resend, vitest(신규)

**Spec:** `docs/superpowers/specs/2026-06-11-site-renewal-outsourcing-products-design.md` §1·3·4·6
**Branch:** `feature/renewal-phase2` (Phase 1 머지된 main 기준)

---

## ⚠️ 배포 순서 제약 (치명적)

Task 6(sign-link 교체) 이후의 코드는 **orders에 이관 데이터가 있어야** 기존 음악 팩 구매자의 다운로드가 유지된다.
**머지·배포 전에 Task 2·3의 SQL을 클라우드 Supabase + NAS self-host 양쪽에 반드시 먼저 적용**할 것. (미적용 상태로 배포하면 기존 구매자 다운로드 끊김)

## 현재 코드 기준점 (탐색 검증됨)

- `products`: id text PK, name, description, price, category, is_active, created_at (`supabase/schema.sql:56-72`). **음악 팩 제품 행 없음** — contact_requests 문자열로만 식별 중
- `orders`: id uuid, user_id, product_id→products, amount, status('pending'|'paid'|'failed'|'cancelled'), metadata jsonb (`schema.sql:75-89`)
- `pack_files`: id uuid, min_tier check('starter'|'pro'|'master'), label, file_path unique, filename, size_bytes, sort_order, uploaded_at, deleted_at
- 구매 문자열 포맷: `"구매 신청: AI 음악 생성 개발 가이드 · 프로"` (U+00B7) — 생성 `PurchaseAgreementModal.tsx:56`, 파싱 `lib/pack-assets.ts:33-39 extractPackTier`
- 다운로드 체인: `/api/packs/list-mine`·`/api/packs/sign-link` → contact_requests(completed) → extractPackTier → tierIncludes → `lib/supabase/pack-files.ts getPackFilesForTiers` → `lib/web-backend.ts signLink`(HMAC)
- 업로드: `/api/admin/packs/upload-url`(tier/label/filename/sizeBytes → mintUploadToken) → 브라우저 XHR로 web-backend 직접 업로드 → **web-backend가 pack_files 행 생성(min_tier 포함)**
- admin: `AdminSidebar.tsx NAV_ITEMS`에 메뉴 등록, `admin_token` 쿠키 + `verifyAdminTokenNode` 인증 패턴 (`app/api/admin/services/route.ts:8-12 checkAuth`)
- 메일: Resend, from `쟁승메이드 <noreply@jaengseung-made.com>`, CEO 수신 `bgg8988@gmail.com` (`app/api/contact/route.ts:74-100`)
- 테스트 인프라 없음 → Task 1에서 vitest 도입

---

### Task 1: vitest 도입 + `lib/product-access.ts` (TDD)

**Files:**
- Modify: `package.json` (vitest + script)
- Create: `vitest.config.ts`
- Create: `lib/product-access.ts`
- Test: `lib/__tests__/product-access.test.ts`

- [ ] **Step 1: vitest 설치 + 설정**

```bash
npm install -D vitest
```

`vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: { include: ['lib/**/*.test.ts'] },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
});
```

`package.json` scripts에 `"test": "vitest run"` 추가.

- [ ] **Step 2: 실패하는 테스트 작성** — `lib/__tests__/product-access.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { expandProductAccess, MUSIC_PRODUCT_CHAIN } from '@/lib/product-access';

describe('expandProductAccess', () => {
  it('일반 제품은 자기 자신만 반환', () => {
    expect(expandProductAccess(['lotto_tool'])).toEqual(['lotto_tool']);
  });
  it('music_pro는 starter를 포함', () => {
    expect(expandProductAccess(['music_pro']).sort()).toEqual(['music_pro', 'music_starter'].sort());
  });
  it('music_master는 전 tier 포함', () => {
    expect(expandProductAccess(['music_master']).sort()).toEqual(
      ['music_master', 'music_pro', 'music_starter'].sort(),
    );
  });
  it('중복 입력은 중복 없이 반환', () => {
    expect(expandProductAccess(['music_pro', 'music_starter']).sort()).toEqual(
      ['music_pro', 'music_starter'].sort(),
    );
  });
  it('빈 입력은 빈 배열', () => {
    expect(expandProductAccess([])).toEqual([]);
  });
});
```

- [ ] **Step 3: 실패 확인** — Run: `npm test` / Expected: FAIL (module not found)

- [ ] **Step 4: 구현** — `lib/product-access.ts`

```typescript
/**
 * orders 기반 제품 접근 확장.
 * 음악 팩 상위 tier는 하위 tier 파일도 포함(하위 호환) — 신규 제품은 1:1.
 */
export const MUSIC_PRODUCT_CHAIN: Record<string, string[]> = {
  music_starter: ['music_starter'],
  music_pro: ['music_pro', 'music_starter'],
  music_master: ['music_master', 'music_pro', 'music_starter'],
};

export function expandProductAccess(paidProductIds: string[]): string[] {
  const out = new Set<string>();
  for (const id of paidProductIds) {
    for (const expanded of MUSIC_PRODUCT_CHAIN[id] ?? [id]) out.add(expanded);
  }
  return Array.from(out);
}
```

- [ ] **Step 5: 통과 확인** — Run: `npm test` / Expected: 5 passed
- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts lib/product-access.ts lib/__tests__/product-access.test.ts
git commit -m "feat(products): vitest 도입 + 제품 접근 확장 로직 (music tier 하위 호환)"
```

---

### Task 2: DB 마이그레이션 ① — products 확장 + 음악 제품 시드 + pack_files.product_id

**Files:**
- Create: `supabase/migrations/2026-06-12-products-extend.sql`

- [ ] **Step 1: SQL 작성** (멱등 — 재실행 안전)

```sql
-- 2026-06-12 Phase 2: products 범용 제품 시스템 확장
-- (1) products 컬럼 확장
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_long text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS features jsonb;            -- string[] 형태
ALTER TABLE products ADD COLUMN IF NOT EXISTS pay_method text NOT NULL DEFAULT 'bank_transfer';
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_listed boolean NOT NULL DEFAULT false;  -- /products 카탈로그 노출
ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

-- (2) 음악 팩 제품 시드 (다운로드 권한 매핑용 — 카탈로그 비노출 is_listed=false)
INSERT INTO products (id, name, description, price, category, is_active, is_listed)
VALUES
  ('music_starter', 'AI 음악 생성 개발 가이드 (입문)',   '음악 팩 입문 — 레거시', 39000,  'software', true, false),
  ('music_pro',     'AI 음악 생성 개발 가이드 (프로)',   '음악 팩 프로 — 레거시', 99000,  'software', true, false),
  ('music_master',  'AI 음악 생성 개발 가이드 (마스터)', '음악 팩 마스터 — 레거시', 149000, 'software', true, false)
ON CONFLICT (id) DO NOTHING;

-- (3) pack_files → 제품 연결
ALTER TABLE pack_files ADD COLUMN IF NOT EXISTS product_id text REFERENCES products(id);
UPDATE pack_files SET product_id = 'music_' || min_tier WHERE product_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_pack_files_product ON pack_files (product_id) WHERE deleted_at IS NULL;
```

- [ ] **Step 2: 로컬 검증** — SQL 문법 눈검토 + `supabase/schema.sql`과 컬럼명 대조 (pack_files는 `2026-05-02-create-pack-files.sql` 기준)
- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/2026-06-12-products-extend.sql
git commit -m "feat(db): products 카탈로그 확장 + 음악 제품 시드 + pack_files.product_id 백필"
```

---

### Task 3: DB 마이그레이션 ② — 기존 구매자 orders 이관

**Files:**
- Create: `supabase/migrations/2026-06-12-migrate-pack-purchases.sql`

- [ ] **Step 1: SQL 작성** (멱등 — `metadata->>'source_contact_id'` 마커로 중복 방지)

```sql
-- 2026-06-12 Phase 2: 음악 팩 구매(contact_requests 문자열) → orders 이관
-- 대상: status='completed' AND user_id 보유 AND '구매 신청:' + '· 입문/프로/마스터' 패턴
-- (user_id 없는 행은 현행 다운로드 시스템도 서빙하지 않으므로 이관 대상 아님)
INSERT INTO orders (user_id, product_id, amount, status, metadata, created_at)
SELECT
  cr.user_id,
  p.id,
  p.price,
  'paid',
  jsonb_build_object(
    'method', 'bank_transfer',
    'source_contact_id', cr.id::text,
    'migrated_at', now()::text,
    'original_service', cr.service
  ),
  cr.created_at
FROM contact_requests cr
JOIN products p ON p.id = CASE
  WHEN cr.service LIKE '%· 입문'   THEN 'music_starter'
  WHEN cr.service LIKE '%· 프로'   THEN 'music_pro'
  WHEN cr.service LIKE '%· 마스터' THEN 'music_master'
END
WHERE cr.status = 'completed'
  AND cr.user_id IS NOT NULL
  AND cr.service LIKE '구매 신청:%'
  AND NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.metadata->>'source_contact_id' = cr.id::text
  );
```

주의: `· 입문` 등의 가운뎃점은 **U+00B7** (`lib/pack-assets.ts`와 동일 문자) — 파일 인코딩 UTF-8 확인.

- [ ] **Step 2: 검증 쿼리를 파일 하단에 주석으로 포함**

```sql
-- 검증: 이관 건수 = 대상 건수 확인
-- SELECT count(*) FROM orders WHERE metadata ? 'source_contact_id';
-- SELECT count(*) FROM contact_requests WHERE status='completed' AND user_id IS NOT NULL AND service LIKE '구매 신청:%' AND (service LIKE '%· 입문' OR service LIKE '%· 프로' OR service LIKE '%· 마스터');
```

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/2026-06-12-migrate-pack-purchases.sql
git commit -m "feat(db): 음악 팩 구매 이력 contact_requests → orders 멱등 이관"
```

- [ ] **Step 4 (운영 — 컨트롤러/CEO):** Task 2·3 SQL을 **클라우드 + self-host 양쪽** SQL Editor에서 순서대로 실행하고 검증 쿼리 결과 일치 확인. **Task 6 배포 전 필수.**

---

### Task 4: `lib/supabase/product-files.ts` — orders 기반 조회 헬퍼 (TDD 일부)

**Files:**
- Create: `lib/supabase/product-files.ts`
- Test: `lib/__tests__/product-files.test.ts` (순수 로직만 — Supabase 호출부는 통합 검증)

- [ ] **Step 1: 구현**

```typescript
import type { SupabaseClient } from '@supabase/supabase-js';
import { expandProductAccess } from '@/lib/product-access';

export interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  description_long: string | null;
  price: number;
  category: string;
  is_active: boolean;
  is_listed: boolean;
  sort_order: number;
  features: string[] | null;
  pay_method: string;
}

export interface ProductFile {
  id: string;
  product_id: string | null;
  label: string;
  file_path: string;
  filename: string;
  size_bytes: number;
  sort_order: number;
  uploaded_at: string;
  deleted_at: string | null;
  min_tier: string; // 레거시 컬럼 — 신규 로직에서는 미사용
}

/** 카탈로그 노출 제품 (is_listed && is_active, sort_order 순) */
export async function getListedProducts(supabase: SupabaseClient): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_listed', true)
    .eq('is_active', true)
    .order('sort_order')
    .order('id');
  if (error) throw error;
  return (data ?? []) as ProductRow[];
}

export async function getProductById(supabase: SupabaseClient, id: string): Promise<ProductRow | null> {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as ProductRow) ?? null;
}

/** 사용자의 결제 완료 product_id 목록 (orders 단일 소스) */
export async function getUserPaidProductIds(supabase: SupabaseClient, userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('product_id')
    .eq('user_id', userId)
    .eq('status', 'paid')
    .not('product_id', 'is', null);
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((r) => r.product_id as string)));
}

/** 접근 확장 포함 — 사용자가 다운로드 가능한 product_id 집합 */
export async function getUserAccessibleProductIds(supabase: SupabaseClient, userId: string): Promise<string[]> {
  return expandProductAccess(await getUserPaidProductIds(supabase, userId));
}

export async function getFilesByProductIds(supabase: SupabaseClient, productIds: string[]): Promise<ProductFile[]> {
  if (productIds.length === 0) return [];
  const { data, error } = await supabase
    .from('pack_files')
    .select('*')
    .in('product_id', productIds)
    .is('deleted_at', null)
    .order('product_id')
    .order('sort_order');
  if (error) throw error;
  return (data ?? []) as ProductFile[];
}

export async function getFileById(supabase: SupabaseClient, id: string): Promise<ProductFile | null> {
  const { data, error } = await supabase.from('pack_files').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as ProductFile) ?? null;
}
```

- [ ] **Step 2: `npm test` + `npm run build` 통과 확인**
- [ ] **Step 3: Commit**

```bash
git add lib/supabase/product-files.ts
git commit -m "feat(products): orders 기반 제품/파일 조회 헬퍼"
```

---

### Task 5: 주문 생성 API + 주문 메일 — `POST /api/orders`

**Files:**
- Create: `lib/order-emails.ts`
- Create: `app/api/orders/route.ts`

- [ ] **Step 1: `lib/order-emails.ts`** (Resend 패턴은 `app/api/contact/route.ts:74-100` 준용)

```typescript
import { Resend } from 'resend';
import type { ProductRow } from '@/lib/supabase/product-files';

const FROM = '쟁승메이드 <noreply@jaengseung-made.com>';
const ADMIN_EMAIL = 'bgg8988@gmail.com';
const BANK_INFO = '케이뱅크 100-116-337157 (예금주: 박재오)';

function resend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const won = (n: number) => `₩${n.toLocaleString('ko-KR')}`;

/** 주문 접수: 고객 안내 + 관리자 알림 (실패해도 주문은 유효 — 호출부에서 try/catch) */
export async function sendOrderReceivedEmails(opts: {
  orderId: string;
  product: ProductRow;
  customerEmail: string;
  depositorName: string;
}) {
  const { orderId, product, customerEmail, depositorName } = opts;
  const r = resend();
  await r.emails.send({
    from: FROM,
    to: [customerEmail],
    subject: `[쟁승메이드] 주문 접수 — ${product.name}`,
    html: `
      <h2>주문이 접수되었습니다</h2>
      <p><strong>${product.name}</strong> · ${won(product.price)}</p>
      <p>아래 계좌로 입금해 주시면, 확인 후 마이페이지에서 바로 다운로드하실 수 있습니다.</p>
      <p style="font-size:16px;"><strong>${BANK_INFO}</strong></p>
      <p>입금자명: <strong>${depositorName}</strong></p>
      <hr />
      <p style="color:#666;font-size:12px;">주문번호 ${orderId} · 입금 확인은 영업시간 기준 최대 24시간 소요됩니다.</p>
    `,
  });
  await r.emails.send({
    from: FROM,
    to: [ADMIN_EMAIL],
    subject: `[쟁승메이드] 신규 주문(입금 대기) — ${product.name}`,
    html: `
      <h2>신규 계좌이체 주문</h2>
      <p>상품: ${product.name} (${won(product.price)})</p>
      <p>주문자 이메일: ${customerEmail} / 입금자명: ${depositorName}</p>
      <p>주문번호: ${orderId}</p>
      <p>입금 확인 후 <a href="https://jaengseung-made.com/admin/orders">관리자 주문 페이지</a>에서 [입금 확인]을 눌러주세요.</p>
    `,
  });
}

/** 입금 확인: 고객에게 다운로드 활성화 안내 */
export async function sendOrderPaidEmail(opts: { product: ProductRow; customerEmail: string }) {
  const { product, customerEmail } = opts;
  await resend().emails.send({
    from: FROM,
    to: [customerEmail],
    subject: `[쟁승메이드] 입금 확인 완료 — ${product.name} 다운로드 안내`,
    html: `
      <h2>입금이 확인되었습니다</h2>
      <p><strong>${product.name}</strong> 다운로드가 활성화되었습니다.</p>
      <p><a href="https://jaengseung-made.com/mypage?tab=products">마이페이지 → 내 제품</a>에서 바로 받으실 수 있습니다.</p>
      <p style="color:#666;font-size:12px;">다운로드 링크는 클릭 시 4시간 동안 유효하며, 만료되면 다시 누르면 됩니다.</p>
    `,
  });
}
```

- [ ] **Step 2: `app/api/orders/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createAdminClient } from '@/lib/supabase/admin';
import { getProductById } from '@/lib/supabase/product-files';
import { sendOrderReceivedEmails } from '@/lib/order-emails';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  // 1) 로그인 확인 (기존 /api/packs/sign-link의 SSR 클라이언트 생성 패턴을 그대로 복사해 사용)
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });

  // 2) 입력 검증
  const body = await request.json().catch(() => null);
  const productId = typeof body?.productId === 'string' ? body.productId.slice(0, 64) : '';
  const depositorName = typeof body?.depositorName === 'string' ? body.depositorName.trim().slice(0, 40) : '';
  if (!productId || !depositorName) {
    return NextResponse.json({ error: 'productId와 depositorName이 필요합니다' }, { status: 400 });
  }

  // 3) 상품 검증 (가격은 서버 DB 기준 — 클라이언트 금액 신뢰 금지)
  const admin = createAdminClient();
  const product = await getProductById(admin, productId);
  if (!product || !product.is_active) {
    return NextResponse.json({ error: '판매 중인 상품이 아닙니다' }, { status: 404 });
  }

  // 4) 중복 pending 주문 방지 (같은 상품 미입금 주문 있으면 재사용)
  const { data: existing } = await admin
    .from('orders')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .eq('status', 'pending')
    .limit(1);
  if (existing && existing.length > 0) {
    return NextResponse.json({ orderId: existing[0].id, reused: true });
  }

  // 5) 주문 생성
  const { data: order, error } = await admin
    .from('orders')
    .insert({
      user_id: user.id,
      product_id: productId,
      amount: product.price,
      status: 'pending',
      metadata: { method: 'bank_transfer', depositor_name: depositorName },
    })
    .select('id')
    .single();
  if (error || !order) {
    return NextResponse.json({ error: '주문 생성에 실패했습니다' }, { status: 500 });
  }

  // 6) 메일 (실패해도 주문 유효)
  try {
    await sendOrderReceivedEmails({
      orderId: order.id,
      product,
      customerEmail: user.email ?? '',
      depositorName,
    });
  } catch (e) {
    console.error('order email failed', e);
  }

  return NextResponse.json({ orderId: order.id });
}
```

- [ ] **Step 3: `npm run build` 통과 + dev에서 curl 검증** — 비로그인 POST → 401 확인:
`curl -s -X POST localhost:3000/api/orders -H "Content-Type: application/json" -d '{"productId":"music_pro","depositorName":"t"}'` → `{"error":"로그인이 필요합니다"}`

- [ ] **Step 4: Commit**

```bash
git add lib/order-emails.ts app/api/orders/route.ts
git commit -m "feat(orders): 계좌이체 주문 생성 API + 접수/입금확인 메일"
```

---

### Task 6: 다운로드 검증 orders 기반 교체 (list-mine·sign-link) + mypage 내 제품 그룹핑

**Files:**
- Modify: `app/api/packs/list-mine/route.ts`
- Modify: `app/api/packs/sign-link/route.ts`
- Modify: `app/mypage/page.tsx` (내 제품 탭 렌더만)

- [ ] **Step 1: list-mine 교체** — contact_requests/extractPackTier 제거, 응답을 제품 그룹으로:

기존 인증·SSR 클라이언트 생성 코드는 유지. 본문 교체:

```typescript
// (기존 user 확인 이후)
const admin = createAdminClient();
const productIds = await getUserAccessibleProductIds(admin, user.id);
if (productIds.length === 0) return NextResponse.json({ products: [] });

const [files, { data: products }] = await Promise.all([
  getFilesByProductIds(admin, productIds),
  admin.from('products').select('id, name').in('id', productIds),
]);

const nameMap = new Map((products ?? []).map((p) => [p.id, p.name as string]));
const grouped = new Map<string, { id: string; name: string; files: typeof files }>();
for (const f of files) {
  if (!f.product_id) continue;
  if (!grouped.has(f.product_id)) {
    grouped.set(f.product_id, { id: f.product_id, name: nameMap.get(f.product_id) ?? f.product_id, files: [] });
  }
  grouped.get(f.product_id)!.files.push(f);
}
return NextResponse.json({ products: Array.from(grouped.values()) });
```

- [ ] **Step 2: sign-link 교체** — tier 검증부만 교체 (HMAC signLink 호출·인증·구조는 무수정):

```typescript
// (기존 user 확인 이후 — contact_requests/extractPackTier 블록 삭제하고)
const admin = createAdminClient();
const accessible = await getUserAccessibleProductIds(admin, user.id);
if (accessible.length === 0) {
  return NextResponse.json({ error: '구매 내역이 없거나 입금 확인 전입니다' }, { status: 403 });
}
const file = await getFileById(admin, fileId);
if (!file || file.deleted_at || !file.product_id || !accessible.includes(file.product_id)) {
  return NextResponse.json({ error: '구매한 제품의 파일이 아닙니다' }, { status: 403 });
}
// (이후 기존 signLink 호출 그대로)
```

- [ ] **Step 3: mypage 내 제품 탭** — `/api/packs/list-mine` 응답 형식 변경(`{files}` → `{products}`)에 맞춰 렌더를 제품별 그룹 카드로 변경. `handleDownload`(sign-link 호출)는 무수정. `extractPackTier`·`packOrders` 기반 분기 제거하고 `products.length === 0`일 때 빈 상태("구매한 제품이 없습니다" + /products CTA). pending 주문이 있으면 "입금 확인 대기 중" 안내(orders는 기존 mypage state 재사용).

- [ ] **Step 4: `npm test` + `npm run build` + dev 검증** — 비로그인 list-mine → `{ products: [] }`, sign-link → 401
- [ ] **Step 5: Commit**

```bash
git add app/api/packs/list-mine/route.ts app/api/packs/sign-link/route.ts app/mypage/page.tsx
git commit -m "feat(downloads): 다운로드 검증을 orders 단일 소스로 교체 + 내 제품 제품별 그룹핑"
```

---

### Task 7: `/products` 동적 카탈로그 + `/products/[id]` 상세 + 구매 모달

> **designer + soft-skill 로드 필수.** 톤은 `app/page.tsx`·`app/outsourcing/page.tsx` 기준.

**Files:**
- Modify: `app/products/page.tsx` (스텁 → 동적)
- Create: `app/products/[id]/page.tsx`
- Create: `app/components/BankTransferModal.tsx` (신규 — 레거시 `PurchaseAgreementModal`은 무수정 보존)

- [ ] **Step 1: `app/products/page.tsx`** — 서버 컴포넌트. `getListedProducts(createAdminClient())`로 조회:
  - 제품 있음: 카드 그리드 (name, description, `₩가격.toLocaleString`, features 상위 3개, [자세히 보기 → /products/[id]])
  - 제품 없음: 기존 스텁의 "출시 준비 중" 섹션 유지 (구매 방식 3단계 안내 포함)
  - 페이지 하단: 구매 안내 3단계(계좌이체 → 입금 확인 → 마이페이지 다운로드) + 외주 CTA

- [ ] **Step 2: `app/products/[id]/page.tsx`** — 서버 컴포넌트 + 클라이언트 구매 버튼:
  - `getProductById`로 조회, `!product || !product.is_listed || !product.is_active`면 `notFound()`
  - 구성: 제품명·가격·description_long(또는 description)·features 리스트·포함 파일 안내("구매 후 마이페이지에서 즉시 다운로드")·환불 정책 링크(/legal/refund)
  - [구매하기] 버튼 → `BankTransferModal` (클라이언트 래퍼 컴포넌트로 분리: `'use client'` + 모달 상태)
  - `generateMetadata`로 제품명 title

- [ ] **Step 3: `app/components/BankTransferModal.tsx`** — props: `{ product: { id, name, price }, isOpen, onClose }`:
  1. 로그인 확인: `createClient().auth.getSession()` — 미로그인이면 "로그인 후 구매할 수 있습니다" + [로그인 → `/login?next=/products/${id}`] (구매 진행 차단)
  2. 입금자명 입력 + 약관 동의 체크(이용약관·환불정책 링크) → [주문하기] → `POST /api/orders { productId, depositorName }`
  3. 성공 화면: 케이뱅크 100-116-337157 (예금주 박재오) + 금액 + "입금 확인 후 마이페이지에서 다운로드" + [마이페이지로]
  4. 에러 시 메시지 표시. `--jsm-*` 토큰, role="dialog", Esc 닫기 (Phase 1 TopNav 드로어 패턴 준용)
  - 참고: `/login`이 `?next=` 파라미터를 지원하는지 `app/login/page.tsx` 확인 — 미지원이면 로그인 성공 리다이렉트에 next 처리 추가(로직 최소 수정 허용)

- [ ] **Step 4: 검증** — `npm run build` + dev: `/products` 200(준비 중 — 아직 is_listed 제품 없음), 존재하지 않는 `/products/foo` 404
- [ ] **Step 5: Commit**

```bash
git add app/products/ app/components/BankTransferModal.tsx app/login/page.tsx
git commit -m "feat(products): 동적 카탈로그·상세 페이지 + 계좌이체 구매 모달"
```

---

### Task 8: `/admin/orders` — 주문 관리 + 입금 확인

**Files:**
- Create: `app/api/admin/orders/route.ts`
- Create: `app/admin/orders/page.tsx`
- Modify: `app/admin/components/AdminSidebar.tsx` (NAV_ITEMS)

- [ ] **Step 1: API** — `app/api/admin/orders/route.ts` (인증은 `app/api/admin/services/route.ts:8-12`의 checkAuth 패턴 복사):

```typescript
// GET: 주문 목록 (최근 200건) — products.name 조인 + 주문자 이메일
export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('orders')
    .select('id, user_id, product_id, amount, status, metadata, created_at, products(name), profiles(email)')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data ?? [] });
}

// PATCH: 상태 변경. 'paid' 전환 시 고객 메일 발송
export async function PATCH(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, status } = await request.json();
  if (!['pending', 'paid', 'cancelled'].includes(status)) {
    return NextResponse.json({ error: 'invalid status' }, { status: 400 });
  }
  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, product_id, user_id')
    .single();
  if (error || !order) return NextResponse.json({ error: error?.message ?? 'not found' }, { status: 500 });

  if (status === 'paid' && order.product_id && order.user_id) {
    try {
      const product = await getProductById(supabase, order.product_id);
      const { data: profile } = await supabase.from('profiles').select('email').eq('id', order.user_id).maybeSingle();
      if (product && profile?.email) await sendOrderPaidEmail({ product, customerEmail: profile.email });
    } catch (e) { console.error('paid email failed', e); }
  }
  return NextResponse.json({ success: true });
}
```

(주의: `products(name)`/`profiles(email)` 중첩 select가 FK 관계로 동작하는지 구현 시 확인 — 안 되면 2쿼리로 분리)

- [ ] **Step 2: 페이지** — `app/admin/orders/page.tsx`: `app/admin/contacts/page.tsx` 구조(필터 탭 + 리스트 + 상세 패널) 준용:
  - 필터: 전체 / 입금 대기(pending) / 완료(paid) / 취소(cancelled)
  - 행: 상품명 · 금액 · 주문자 이메일 · 입금자명(metadata.depositor_name) · 주문일 · 상태 뱃지
  - pending 행에 [입금 확인] 원클릭 버튼 (confirm 다이얼로그 → PATCH paid) + [취소] 버튼
  - paid 행은 "다운로드 활성" 표시

- [ ] **Step 3: AdminSidebar** — NAV_ITEMS의 '문의 내역' 위에 `{ href: '/admin/orders', label: '주문 관리' }` 추가
- [ ] **Step 4: 검증** — build + dev: 비인증 GET `/api/admin/orders` → 401, admin 페이지 컴파일 확인
- [ ] **Step 5: Commit**

```bash
git add app/api/admin/orders/route.ts app/admin/orders/page.tsx app/admin/components/AdminSidebar.tsx
git commit -m "feat(admin): 주문 관리 페이지 — 입금 확인 원클릭 + 다운로드 활성화 메일"
```

---

### Task 9: `/admin/products` — 제품 CRUD + 파일 배정 (packs 통합)

**Files:**
- Create: `app/api/admin/products/route.ts`
- Create: `app/admin/products/page.tsx`
- Modify: `app/api/admin/packs/route.ts` (PATCH에 product_id 허용 1줄)
- Modify: `app/admin/components/AdminSidebar.tsx`

- [ ] **Step 1: 제품 CRUD API** — `app/api/admin/products/route.ts` (checkAuth 패턴):
  - GET: 전체 제품 (sort_order, id 순)
  - POST: `{ id, name, description, description_long, price, features, is_listed, sort_order }` — id는 `^[a-z0-9_]{2,40}$` 검증, category 기본 'software', pay_method 기본 'bank_transfer', upsert 아닌 insert (중복 id → 409)
  - PATCH: `{ id, ...partial }` — name/description/description_long/price/features/is_listed/is_active/sort_order만 화이트리스트 업데이트
  - DELETE 없음 (is_active=false로 비활성 — YAGNI)

- [ ] **Step 2: packs PATCH 확장** — `app/api/admin/packs/route.ts`의 PATCH updates 화이트리스트에 추가:

```typescript
if (typeof product_id === 'string' || product_id === null) updates.product_id = product_id;
```
(request json 구조분해에 product_id 추가. 나머지 무수정)

- [ ] **Step 3: 페이지** — `app/admin/products/page.tsx`:
  - 상단: 제품 목록 테이블 (name, price, is_listed 토글, sort_order, [편집])
  - [새 제품] 폼: id/name/price/description/description_long/features(줄바꿈 구분 textarea→배열)/is_listed
  - 제품 선택 시 하단에 **파일 섹션**: 해당 product_id의 pack_files 목록 + **파일 업로드**(기존 `/admin/packs`의 업로드 플로우 재사용 — upload-url 발급 시 tier는 'starter' 고정 전달) + 업로드 완료 후 목록 새로고침하여 **미배정 파일(product_id null 또는 다른 제품) 드롭다운으로 현재 제품에 배정**(packs PATCH product_id)
  - 기존 `/admin/packs` 페이지·메뉴는 유지 (음악 팩 레거시 관리용) — 안내 문구 한 줄 추가: "신규 제품 파일은 제품 관리에서 배정하세요"

- [ ] **Step 4: AdminSidebar** — '주문 관리' 아래 `{ href: '/admin/products', label: '제품 관리' }` 추가
- [ ] **Step 5: 검증** — build + 비인증 401 + admin 렌더 확인
- [ ] **Step 6: Commit**

```bash
git add app/api/admin/products/route.ts app/admin/products/page.tsx app/api/admin/packs/route.ts app/admin/components/AdminSidebar.tsx
git commit -m "feat(admin): 제품 관리 — CRUD + 파일 업로드·제품 배정"
```

---

### Task 10: 메인 페이지 소프트웨어 진열 동적 교체

**Files:**
- Modify: `app/page.tsx` (섹션 6 — Phase 2 교체 주석 지점)

- [ ] **Step 1:** `getListedProducts(createAdminClient())` 호출(서버 컴포넌트라 직접 가능)로:
  - 제품 1개 이상: 상위 3개 카드(name, description, 가격, → /products/[id]) + [전체 보기 → /products]
  - 0개: 기존 "출시 준비 중" 정적 구성 유지 (조건 분기)
- [ ] **Step 2:** build + dev에서 `/` 200 확인 (DB 조회 실패 시에도 페이지가 죽지 않도록 try/catch로 빈 배열 폴백)
- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(home): 소프트웨어 진열 섹션 products 동적 연동"
```

---

### Task 11: Phase 2 E2E 검증

- [ ] **Step 1: 자동 검증** — `npm test`(vitest) + `npm run build` + prod 서버 curl:
  - `/products` 200, `/products/없는상품` 404
  - POST `/api/orders` 비로그인 401 / GET `/api/admin/orders` 비인증 401 / `/api/admin/products` 비인증 401
  - `/api/packs/list-mine` 비로그인 `{ products: [] }`
  - `/` 200 (동적 섹션 폴백 포함)
- [ ] **Step 2: 수동 E2E (시나리오 B — 운영 DB에 마이그레이션 적용 후)**
  1. admin/products에서 테스트 제품 등록(is_listed) + 작은 파일 업로드·배정
  2. 일반 계정으로 /products → 상세 → 구매 모달 → 주문 → 접수 메일 2통 수신
  3. /admin/orders [입금 확인] → 활성화 메일 수신
  4. mypage 내 제품 → 다운로드 → DSM 링크로 파일 수신
  5. **회귀**: 기존 음악 팩 구매 계정으로 mypage 다운로드 정상 (이관 검증)
- [ ] **Step 3: 최종 Commit + 보고**

---

## 🔖 재개 체크포인트 (2026-06-12 세션 한도 중단)

- **완료**: Task 1~8 (P2-1~P2-8) — 커밋 `cf89e8c`→`dc5e9d4`. vitest·마이그레이션 SQL 2건·product-files 헬퍼·/api/orders·다운로드 orders 교체·/products 카탈로그·/admin/orders 전부 리뷰 승인 완료
- **진행 중**: Task 9 (P2-9 /admin/products) — 구현 서브에이전트가 파일 작성 후 한도로 중단. **working tree에 미커밋 상태**: `app/admin/products/`(신규), `app/api/admin/products/`(신규), `app/admin/components/AdminSidebar.tsx`·`app/admin/packs/page.tsx`·`app/api/admin/packs/route.ts`(수정)
- **재개 절차**: ① 미커밋 파일 정독(미완성 함수/문법 확인) → ② `npm test`+`npm run build` → ③ curl 401/200 검증 → ④ 커밋 → ⑤ 스펙+품질 리뷰 → Task 10(메인 동적화)·Task 11(E2E)로 계속
- **주의**: 운영 DB 마이그레이션(Task 2·3 SQL) 미적용 — 머지·배포 전 양쪽 DB 적용 필수

## Phase 3 예고 (별도 플랜)

외주 고객 포털: 단계형 의뢰 폼, contact_requests 상태 머신 확장 + public_token, quotes FK 연결, /track/[token], 자동 이메일, admin 의뢰·견적 통합 뷰.
