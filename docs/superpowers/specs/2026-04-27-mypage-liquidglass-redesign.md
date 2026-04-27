# mypage Liquid Glass 리뉴얼 (Phase 1)

- **작성일**: 2026-04-27
- **목표**: mypage를 메인 surface(Liquid Glass + Jua)와 시각적으로 조화시키고, Music 사업부 통합의 첫 단계로 "구매한 팩" 탭을 신설한다. 백엔드 자료 호스팅(NAS · HMAC · 토큰)은 Phase 2로 분리.
- **결정 라인 (CEO 확정)**:
  1. **음악 통합** = D — B(구매한 팩 자료) + C(스튜디오 링크). 트랙 DB 저장(A)은 별도 plan
  2. **구조** = B — `/mypage`를 `PublicShell + TopNav`로 통합 (Sidebar 제거)
  3. **톤** = B — Hybrid Dark Hero + Light Cards
  4. **NAS 호스팅** = 가 — Phase 1만 (디자인+구조), Phase 2 별도 spec
  5. **신원 표시** = C — TopNav에 "마이페이지/로그아웃" link + mypage 축소 hero (가입일·아바타 유지, 로그아웃 버튼 제거)

## 1. 컨텍스트

### As-Is (P0 직후 시점, HEAD = `3033572`)
- 메인 공개 surface: TopNav (알약 글래스 헤더) + Liquid Glass 톤 + Jua 폰트 + 검정/흰색 교차 섹션
- mypage(`/mypage`): `DashboardShell.tsx:9` `SIDEBAR_PATHS=['/mypage']` → 좌측 검정 사이드바(`Sidebar.tsx`) + 본문 라이트 블루 (`bg-[#f0f5ff]`, `bg-[#1a56db]` 액센트, `border-[#dbe8ff]`)
- TopNav는 supabase auth 구독 안 함 — 로그인 후에도 항상 "로그인 / Try now"만 표시 (CEO 보고 이슈)
- Sidebar는 supabase auth 구독함 (Sidebar.tsx:93-103) — 로그인 시 마이페이지/로그아웃 토글 정상 작동

### Why now
- 메인 공개 surface는 P0(Liquid Glass) 마이그레이션 완료, 회원 surface(mypage)는 옛 톤 유지 → 사용자가 메인 → mypage 이동 시 시각 단절
- "music 도 mypage에 포함시킬 거" — Music 팩 구매 자료를 mypage에서 다운로드받게 하는 흐름의 첫 단계 (자료 호스팅은 Phase 2)
- TopNav 로그인 상태 미반영은 별도 이슈로 보고됨 → 같은 spec에 묶어 처리

### Phase 분리 근거
- Phase 1 = 프론트엔드만 (디자인 + 구조 + 신규 탭 UI placeholder + TopNav auth) — 1 spec/plan으로 처리 가능한 단위
- Phase 2 = 백엔드/인프라 (NAS `/media/packs/`, HMAC 토큰, Next API, admin 업로드) — Phase 1 끝난 후 별도 spec/plan
- "구매한 팩" 탭은 Phase 1에서 UI만 노출하되 다운로드 버튼은 비활성 + "준비 중 — 카톡으로 안내" 안내

## 2. 변경 범위 (4 파일)

| 파일 | 변경 종류 | 책임 |
|---|---|---|
| `app/components/DashboardShell.tsx` | Modify | `SIDEBAR_PATHS` 상수 + `useSidebar` 분기 + Sidebar import + `if (!useSidebar)` 분기 + 사이드바 분기 안의 카카오 버튼 — 모두 삭제. mypage는 PublicShell 폴백 경로를 탐. STANDALONE_PATHS는 그대로 유지. |
| `app/components/TopNav.tsx` | Modify | supabase auth 구독 추가 + 로그인 상태 토글 (데스크톱 우측 + 모바일 오버레이 하단). |
| `app/components/Sidebar.tsx` | Delete | 사용처 0이 됨 (DashboardShell만 import 했음). |
| `app/mypage/page.tsx` | Modify | 디자인 토큰 마이그레이션 + hero 축소(로그아웃 버튼 제거) + "구매한 팩" 탭 신설 (placeholder). |

기타 영향:
- `app/components/DashboardShell.tsx`의 `STANDALONE_PATHS`(login/signup/admin) 그대로 유지
- `app/admin/*`은 `STANDALONE_PATHS`로 분기되어 자체 admin shell 사용 — 영향 없음
- `app/login/page.tsx` 로그인 후 redirect 대상은 `/mypage` 그대로 (구조 변경 없음)

## 3. TopNav 로그인 상태 (구체 디자인)

### 3.1 패턴 차용
`app/components/Sidebar.tsx:87-110` 의 auth 구독 + 로그아웃 핸들러 그대로 차용:
- 마운트 시 `supabase.auth.getUser()` 1회 + `onAuthStateChange` 구독으로 세션 변경 추적
- cleanup: `subscription.unsubscribe()`
- 로그아웃: `signOut() → router.push('/') → router.refresh()`

### 3.2 데스크톱(`md+`) 우측 영역
```
로그아웃 상태 (현재 그대로):
  [로그인] [Try now]

로그인 상태 (신규):
  [마이페이지] [로그아웃]
```
- "마이페이지" = 텍스트 link (현재 "로그인" 자리 className 그대로 — `hidden sm:inline-block text-sm font-medium px-4 py-2 ...`)
- "로그아웃" = button (현재 "Try now" `kx-btn-primary` 자리에 `text-sm font-medium px-5 py-2 rounded-full` text 버튼 + `border border-white/20` hover effect — `kx-btn-primary` 보라 글로우는 비회원 전환 도구이므로 회원 화면에는 부적합)

### 3.3 모바일 오버레이 (하단 CTA 영역, 현재 152-167행)
```
로그아웃 상태 (현재):
  [로그인]    [Try now]

로그인 상태 (신규):
  [마이페이지] [로그아웃]
```
- 동일 className 패턴 유지 (`flex-1 py-3 text-center rounded-full`)
- 좌측 link, 우측 button

### 3.4 활성 탭 표시 (선택적)
- 현재 TopNav는 `LINKS` 배열 항목에만 active 표시 (`isActive` 함수). "마이페이지"는 LINKS가 아닌 우측 영역 → active 표시 없이 두는 것이 단순. 사용자가 mypage 안에 있으면 "마이페이지" 텍스트가 그대로 노출되어 충분히 구분됨.

## 4. mypage 디자인 (구체)

### 4.1 Layout 구조 변경
- **현재**: `<div className="min-h-full bg-[#f0f5ff]">` 라이트 블루 풀 배경
- **변경**: `<div className="min-h-screen bg-slate-50">` — 옅은 회색 본문 배경. PublicShell의 `pt-20` 헤더 여백을 통과해 mypage 자체 hero가 곧장 시작.

### 4.2 사용자 헤더 (Dark Hero — 축소)

**현재**(mypage page.tsx:302-325):
```tsx
<div className="bg-[#04102b] px-6 py-10" style={{ backgroundImage: '...repeating-linear-gradient...' }}>
  <div className="max-w-4xl mx-auto">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-[#1a56db] ...">{user.email?.[0].toUpperCase()}</div>
      <div>
        <div className="text-white font-bold text-lg leading-tight">{user.email}</div>
        <div className="text-blue-300/60 text-sm mt-0.5">가입일: {...}</div>
      </div>
      <div className="ml-auto">
        <button onClick={handleLogout} className="...">로그아웃</button>
      </div>
    </div>
  </div>
</div>
```

**변경**:
```tsx
<div
  className="px-6 py-8 border-b border-white/5"
  style={{
    background: 'var(--kx-surface)',
    backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 40px)',
  }}
>
  <div className="max-w-4xl mx-auto">
    <div className="flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
        style={{ background: 'var(--kx-primary)' }}
      >
        {user.email?.[0].toUpperCase()}
      </div>
      <div>
        <div className="kx-display text-white font-bold text-lg leading-tight">{user.email}</div>
        <div className="text-white/50 text-xs mt-0.5">
          가입일 {new Date(user.created_at).toLocaleDateString('ko-KR')}
        </div>
      </div>
    </div>
  </div>
</div>
```

차이점:
- `bg-[#04102b]` → CSS var `var(--kx-surface)` (= #060e20, 더 깊음)
- `bg-[#1a56db]` 아바타 → `var(--kx-primary)` (#cc97ff 보라)
- 패딩 `py-10` → `py-8` (덜 압도적)
- 아바타 크기 `w-14 h-14 text-xl` → `w-12 h-12 text-lg` (한 단계 축소)
- 가입일 폰트 `text-sm` → `text-xs` 색 `text-blue-300/60` → `text-white/50` (덜 강조)
- "가입일:" 콜론 → "가입일 " 공백 (kx 톤, 미니멀)
- **로그아웃 버튼 완전 제거** — TopNav로 이동
- 헤더 폰트에 `kx-display` 클래스 추가 (Jua + letter-spacing 정돈)

### 4.3 탭 바 (7개로 확장)

**현재 6개**: 프로젝트현황 / 의뢰내역 / 결제내역 / 내정보 / 구독관리 / 사주기록
**추가 1개**: 구매한 팩
**총 7개**

**탭 디자인 변경**:
- 컨테이너: `bg-white border border-[#dbe8ff] rounded-xl p-1` → `bg-white border border-slate-200 rounded-xl p-1`
- 액티브 탭 배경: `bg-[#1a56db] text-white shadow` → `bg-violet-600 text-white shadow` (보라)
- 비액티브 텍스트: `text-slate-500 hover:text-slate-700` → `text-slate-500 hover:text-violet-600`
- 카운트 배지 액티브: `bg-white/20 text-white` 그대로
- 카운트 배지 비액티브: `bg-slate-100 text-slate-600` 그대로

**탭 7개 표시**:
- 데스크톱: `flex` 한 줄 — 가능 (각 탭 평균 5~7글자)
- 모바일: 현재도 `flex` 한 줄이나 7개에서 글자 잘림 위험. **`flex-wrap` 적용** + 각 탭 `min-width: 110px` 정도 부여 → 자연스럽게 2줄로 떨어짐
- 또는 모바일에서 `grid-cols-3 sm:grid-cols-4 md:flex` 단계적 적용

탭 순서 (구매한 팩 위치 결정):
- "구매한 팩"을 `결제 내역` 다음에 배치 — 결제와 자료가 인접
- 최종: `프로젝트현황 / 의뢰내역 / 결제내역 / 구매한 팩 / 내정보 / 구독관리 / 사주기록`

### 4.4 본문 카드 토큰 마이그레이션

전체 mypage `page.tsx`(~960행)에서 다음 색 토큰을 일괄 치환:

| 현재 토큰 | 새 토큰 | 의미 |
|---|---|---|
| `bg-[#f0f5ff]` | `bg-slate-50` | 본문 배경 (또는 흰색) |
| `bg-[#04102b]` (헤더 외 위치) | `bg-[#060e20]` 또는 `var(--kx-surface)` | 다크 강조 |
| `bg-[#1a56db]`, `bg-blue-600` | `bg-violet-600` | 주 액센트 |
| `hover:bg-[#1e4fc2]`, `hover:bg-blue-700` | `hover:bg-violet-500` | 액센트 hover |
| `bg-[#1a56db]/20`, `text-[#1a56db]` | `text-violet-600`, `bg-violet-100` | 텍스트 액센트 |
| `border-[#dbe8ff]` | `border-slate-200` | 중성 카드 보더 |
| `bg-blue-50 border-blue-200` | `bg-violet-50 border-violet-200` | 강조 박스 |
| `text-[#04102b]` | `text-slate-900` | 본문 다크 텍스트 |
| `text-blue-300/60` (다크 hero 안) | `text-white/50` | 다크 위 옅은 텍스트 |

**유지하는 색 (보조 의미를 가지므로 그대로)**:
- `bg-emerald-*` 완료/이용중 status
- `bg-orange-*` 해지 예정 warning
- `bg-amber-*` 유료 배지
- `bg-red-*` 에러/해지
- `bg-rose-*`, `bg-pink-*` 사주 메타
- `bg-cyan-*` 사주 메타
- `bg-sky-*` 텔레그램 연동

이들은 의미 색이라 톤 통일에서 제외.

### 4.5 "구매한 팩" 탭 (신규 — Placeholder)

#### 데이터 소스 — 정정 (코드 검증 결과)

**확인된 결제 흐름** (`app/services/music/page.tsx:295` + `app/components/PurchaseAgreementModal.tsx:55-63`):
- Music 팩 구매: `PurchaseAgreementModal`이 `/api/contact` POST → **`contact_requests` 테이블**(mypage에서 `orders` 변수로 fetch 중)
- `service` 컬럼 = `"구매 신청: AI 음악 마스터 팩 · {tier.name}"` 형식 (예: `"구매 신청: AI 음악 마스터 팩 · 프로"`)
- `payments` 테이블은 **PortOne PG 결제 전용** (현재 사주 1,000원만) — Music 팩과 무관

→ **데이터 소스는 기존 `orders` (contact_requests)**. 추가 fetch 불필요 (mypage:129-136에서 이미 fetch 중).

#### Tier 매핑 함수

`lib/pack-assets.ts` (신규 파일):

```ts
export interface PackAsset {
  name: string;
  files: string[];
}

export const PACK_ASSETS: Record<'starter' | 'pro' | 'master', PackAsset> = {
  starter: {
    name: 'AI 음악 마스터 팩 (입문)',
    files: [
      'Suno 프롬프트 북 PDF (40p)',
      '구조 템플릿 PDF',
      '저작권 가이드 기본판',
    ],
  },
  pro: {
    name: 'AI 음악 마스터 팩 (프로)',
    files: [
      '입문 자료 전체',
      'MV 워크플로우 가이드 (Runway · Luma · Pika)',
      '샘플 프로젝트 1개 (.prj 파일 + 영상)',
      '유튜브 SEO 템플릿',
      '1:1 Q&A 1회 (이메일 응답)',
    ],
  },
  master: {
    name: 'AI 음악 마스터 팩 (마스터)',
    files: [
      '프로 자료 전체',
      '샘플 프로젝트 장르별 3종',
      '저작권 심화판 + 상업 이용 체크리스트',
      '제작 레시피 영상 (우선 공개)',
    ],
  },
};

/**
 * orders.service ("구매 신청: AI 음악 마스터 팩 · 프로") → tier key.
 * 매칭 안 되면 null 반환 (Music 팩 외 의뢰).
 */
export function extractPackTier(service: string): 'starter' | 'pro' | 'master' | null {
  if (!service.startsWith('구매 신청:')) return null;
  if (service.includes('입문')) return 'starter';
  if (service.includes('프로')) return 'pro';
  if (service.includes('마스터')) return 'master';
  return null;
}
```

(파일 크기, 실제 파일 URL은 Phase 2에서 추가)

#### Status 매핑

`orders.status` 값별 표시:
- `'completed'` — 자료 발송 완료. 자료 리스트 + (Phase 2)다운로드 버튼 노출
- `'in_progress'` — 입금 확인 중. "결제 처리 중" 안내 + 자료 리스트는 보여주되 다운로드 비활성
- `'pending'` 또는 그 외 — "입금 대기 중" + 자료 리스트는 미노출 (또는 흐리게)

#### UI 컴포넌트 (구체)

```tsx
import { PACK_ASSETS, extractPackTier } from '@/lib/pack-assets';

// ...

{tab === 'packs' && (
  <div className="space-y-4">
    {(() => {
      const packOrders = orders
        .map((o) => ({ order: o, tier: extractPackTier(o.service) }))
        .filter((x): x is { order: Order; tier: 'starter' | 'pro' | 'master' } => x.tier !== null);

      if (packOrders.length === 0) {
        return (
          <EmptyState
            icon="🎵"
            title="구매한 팩이 없습니다"
            desc="AI 음악 팩을 구매하시면 자료가 여기에 표시됩니다"
            linkHref="/services/music"
            linkLabel="Music 팩 보기"
          />
        );
      }

      return packOrders.map(({ order, tier }) => {
        const asset = PACK_ASSETS[tier];
        const statusLabel =
          order.status === 'completed' ? '자료 발송 완료' :
          order.status === 'in_progress' ? '결제 처리 중' :
          '입금 대기';
        const statusColor =
          order.status === 'completed' ? 'bg-violet-50 text-violet-600 border-violet-200' :
          order.status === 'in_progress' ? 'bg-amber-50 text-amber-600 border-amber-200' :
          'bg-slate-100 text-slate-500 border-slate-200';

        return (
          <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-bold text-slate-900 text-base">{asset.name}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {new Date(order.created_at).toLocaleDateString('ko-KR')} 신청
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusColor}`}>
                {statusLabel}
              </span>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="text-sm font-semibold text-slate-700 mb-3">
                📦 자료 패키지 ({asset.files.length}개)
              </div>
              <ul className="space-y-2 mb-5">
                {asset.files.map((file, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-slate-400">·</span>
                    <span>{file}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled
                className="w-full py-3 rounded-xl text-sm font-bold bg-slate-100 text-slate-400 cursor-not-allowed"
              >
                자료 준비 중
              </button>
              <p className="text-xs text-slate-500 mt-2 text-center leading-relaxed">
                현재는 카톡 1:1로 자료를 보내드립니다. 자동 다운로드는 곧 활성화됩니다.
                <br />
                <a href="https://open.kakao.com/o/s9stoNvb" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline font-semibold">
                  카톡 오픈채팅 →
                </a>
              </p>
            </div>
          </div>
        );
      });
    })()}
  </div>
)}
```

#### Phase 2에서 변경될 것
- `disabled` 버튼 → `<a href={signedUrl} download>` 활성화
- "자료 준비 중" → "자료 다운로드"
- 카톡 안내 문구 제거
- `PACK_ASSETS` 상수는 그대로 유지 가능 (정적 자료 매핑은 Phase 2에서도 유효), Phase 2는 파일별 URL/HMAC 토큰만 추가
- `order.status === 'completed'` 일 때만 다운로드 활성, 그 외엔 placeholder 유지

### 4.6 Tab type 확장

```ts
type Tab = 'profile' | 'projects' | 'subscription' | 'saju' | 'payments' | 'orders' | 'packs';
```

`packs` 추가. `tabs` 배열에 정의 추가:
```ts
{ key: 'packs', label: '구매한 팩', count: packPayments.length || undefined }
```

순서: `projects → orders → payments → packs → profile → subscription → saju`

### 4.7 사용자 빠른 메뉴 (`tab === 'profile'` 안)

현재 mypage page.tsx:512-535 에 "빠른 메뉴" 섹션이 있음:
- 사주 분석 (`/saju/input`)
- 외주 의뢰 (`/freelance`)

음악 통합 강화를 위해 다음 항목 추가:
- **AI 스튜디오** (`/studio`) — 새 트랙 만들기. 아이콘은 음악 아이콘.
- (선택) **AI 음악 팩** (`/services/music`) — 다른 팩 둘러보기

이 항목들은 디자인 토큰 마이그레이션과 함께 처리. 현재 4.4의 `border-[#dbe8ff]`, `bg-blue-50/50` 등을 `border-slate-200`, `bg-violet-50/50`으로 치환.

## 5. 보존되는 동작 (회귀 방지)

이번 spec은 시각·구조 변경이 본질이고, 비즈니스 로직(데이터 fetch, 텔레그램 연결, 구독 해지, 견적 토큰 연결, 사주 기록 표시 등)은 그대로 유지한다. 회귀 점검 목록:

- supabase auth getUser 후 `/login` redirect — 그대로
- payments / orders / saju_records / projects fetch — 그대로
- 텔레그램 deeplink 발급, 연결/해제 — 그대로
- 구독 자동갱신 토글, 구독 해지 — 그대로
- 견적서 토큰 연결 폼 — 그대로
- 카카오 오픈채팅 플로팅 버튼 (현재 DashboardShell에 있음) — Sidebar 제거 후에도 PublicShell에서 작동해야 함
  - **주의**: DashboardShell.tsx 의 카카오 버튼은 사이드바 분기(useSidebar=true) 안에 있음 (76-127행) — 이 분기 자체가 사라지면 카카오 버튼도 사라짐
  - **수정 필요**: 카카오 플로팅 버튼을 PublicShell.tsx로 이동 (또는 별도 컴포넌트로 분리하여 두 shell 모두에 마운트)
- TelegramGuideModal — 그대로

## 6. Phase 2 미리보기 (별도 spec — 이번 plan 종료 후 작성)

Phase 2가 다룰 것:

1. **NAS `/media/packs/` 디렉토리 셋업** — `/volume1/docker/webpage/media/packs/{starter|pro|master}/`
2. **nginx 설정** — `/media/packs/...` 정적 서빙. 토큰 검증 옵션은 다음 중 결정:
   - (a) Next.js API에서 토큰 검증 후 file 응답 (메모리 부담)
   - (b) nginx auth_request 모듈로 사전 검증
3. **Next.js API** `/api/packs/[productId]` — supabase user auth + payments 확인 후 HMAC 토큰 발급, file URL 반환
4. **DB 스키마** — `pack_files` 테이블 (또는 정적 매핑 유지). 파일 메타데이터(크기, 종류, 업데이트일).
5. **admin 업로드 UI** — `/admin/services` 또는 별도 `/admin/packs` — 새 자료 등록 흐름
6. **mypage** — `disabled` 버튼 → 활성 다운로드 링크로 교체
7. **회귀 테스트** — 구매하지 않은 사용자가 토큰 우회 시도 시 차단

## 7. 의도적 제외 (이번 spec 범위 밖)

| 항목 | 이유 |
|---|---|
| Studio 트랙 DB 저장 | 음악 통합 옵션 A — 별도 plan 필요 |
| `/admin` shell Liquid Glass 마이그레이션 | mypage와 별도 surface, 우선순위 낮음 |
| 사주 1,000원 PG 결제 결정 | P0 brainstorm 부록 A에 보류 항목 |
| URL 마이그레이션 (`/freelance` → `/work/freelance` 등) | P1 home-restructure plan |
| `/work` 우산 페이지 | P1 home-restructure plan |
| Music 팩 자체 페이지(`/services/music`) 디자인 변경 | 이미 P0(Liquid Glass)로 처리됨 |
| 모바일 햄버거 오버레이 디테일 정돈 | 필요 시 P1 home-restructure plan에 흡수 |

## 8. 다음 단계

1. 이 spec 검토 (사용자)
2. 승인 후 → `superpowers:writing-plans` 스킬로 implementation plan 작성
3. plan 작성 후 → `superpowers:subagent-driven-development` 로 task별 실행
4. 모두 종료 후 → 통합 final review + finishing-a-development-branch
5. Phase 2 spec 별도 작성 시점은 CEO 결정 (운영상 자료 자동 다운로드 수요가 생길 때)

## 부록 A. 영향받는 라우트 / 라우트별 사용 shell

| 라우트 | 현재 shell | 변경 후 shell |
|---|---|---|
| `/` | PublicShell | PublicShell (변경 X) |
| `/services/*` | PublicShell | PublicShell (변경 X) |
| `/freelance`, `/saju`, `/studio` | PublicShell | PublicShell (변경 X) |
| `/login`, `/signup` | Standalone | Standalone (변경 X) |
| `/admin/*` | Standalone (자체 admin shell) | Standalone (변경 X) |
| `/mypage` | Sidebar (DashboardShell 분기) | **PublicShell + TopNav** |
| `/payment/*` | PublicShell | PublicShell (변경 X) |
| `/legal/*`, `/portfolio/[token]`, `/quote/[token]` | PublicShell | PublicShell (변경 X) |

## 부록 B. 카카오 플로팅 버튼 처리 결정

**현재**: `DashboardShell.tsx:76-90`의 `useSidebar=true` 분기에만 mount → mypage 전용으로만 노출.

**변경 후**: mypage가 PublicShell로 옮겨지면 카카오 버튼이 사라짐. 하지만 카카오 1:1 상담은 모든 페이지에서 유효한 도구.

**결정**: 카카오 버튼을 `PublicShell.tsx`로 이동 → 모든 공개 페이지에서 노출 (mypage 포함).

**구체 위치**: `PublicShell.tsx`의 `<footer>` 닫는 태그 바로 다음, `<main>` 닫기 직전. JSX는 DashboardShell의 현재 `<a className="kakao-float-btn">…</a>` + `<style>{...}</style>` 블록 그대로 복사. 원본은 DashboardShell에서 삭제 (사이드바 분기 전체가 사라지므로 자연 제거).

- 이동량: ~50 LOC (button JSX + 인라인 `<style>` 블록)
- 영향: 메인 / 서비스 페이지 / freelance / saju / mypage / 결제 결과 / legal 페이지 모두에 카카오 버튼이 떠 있게 됨 — 본래 의도(상담 접근성)와 합치
- 노출 증가하지만 transparent positioning이라 콘텐츠 가림 거의 없음
- 모바일 사이즈는 이미 카카오 버튼 자체 inline `<style>` `@media (max-width: 640px)` 분기에 정의됨
