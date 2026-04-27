# mypage Liquid Glass 리뉴얼 (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** mypage를 메인 surface(Liquid Glass + Jua)와 시각·구조적으로 조화시키고, "구매한 팩" 탭 placeholder + TopNav 로그인 상태 반영을 추가한다. NAS 기반 자료 다운로드는 Phase 2로 분리.

**Architecture:** 기존 Sidebar 레이아웃을 폐기하고 PublicShell + TopNav로 통합. mypage 자체 hero는 축소(가입일·아바타 유지·로그아웃 버튼 제거)하고 본문은 보라/시안 액센트의 light card 톤으로 전환. 신원·로그아웃은 TopNav 한 곳에서 담당. Music 팩 자료는 정적 매핑(`lib/pack-assets.ts`)으로 노출하되 다운로드 버튼은 Phase 2까지 비활성.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind v4, Supabase Auth (`@supabase/ssr`), 자체 디자인 토큰(`globals.css`의 `--kx-*` + slate/violet Tailwind 팔레트)

**Spec:** `docs/superpowers/specs/2026-04-27-mypage-liquidglass-redesign.md`

---

## P1에서 다루지 않는 항목 (의도적 제외)

| 항목 | 이유 | 다음 단계 |
|---|---|---|
| NAS `/media/packs/` 인프라 + HMAC 토큰 + Next API | Phase 2 별도 spec | 운영상 자료 자동 다운로드 수요 발생 시 |
| Studio 트랙 DB 저장 (음악 통합 옵션 A) | 별도 plan | 백로그 |
| `/admin` shell Liquid Glass | 별도 surface, 우선순위 낮음 | 백로그 |
| 사주 1,000원 PG 결제 결정 | P0 brainstorm 부록 A 보류 | CEO 결정 후 |
| URL 마이그레이션 (`/freelance` → `/work/freelance` 등) | P1 home-restructure 별도 plan | 후속 P1 |

---

## File Structure

| 파일 | 종류 | 책임 |
|---|---|---|
| `lib/pack-assets.ts` | Create | Music 팩 3티어 정적 자료 매핑 + `extractPackTier(service)` 함수 |
| `app/components/TopNav.tsx` | Modify | supabase auth 구독 + 로그인 토글 (데스크톱 + 모바일) |
| `app/components/PublicShell.tsx` | Modify | 카카오 플로팅 버튼 마운트 (DashboardShell에서 이동) |
| `app/mypage/page.tsx` | Modify | hero 축소(로그아웃 제거), Tab type 확장, "구매한 팩" 탭 JSX, body 토큰 일괄 마이그레이션 |
| `app/components/DashboardShell.tsx` | Modify | 사이드바 분기 + 카카오 버튼 + Sidebar import 통째 제거 |
| `app/components/Sidebar.tsx` | Delete | 사용처 0 |

검증 인프라: 이 프로젝트는 jest/vitest/playwright 미설치. 각 task 검증 = `npx eslint <변경 파일>` + 마지막 task에서 `npm run build` + 시각 회귀(사용자 수동).

---

## Task 1: `lib/pack-assets.ts` 신규 파일

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\lib\pack-assets.ts`

- [ ] **Step 1: 새 파일 작성**

다음 내용으로 `lib/pack-assets.ts` 신규 작성:

```ts
export interface PackAsset {
  name: string;
  files: string[];
}

export type PackTier = 'starter' | 'pro' | 'master';

export const PACK_ASSETS: Record<PackTier, PackAsset> = {
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
export function extractPackTier(service: string): PackTier | null {
  if (!service.startsWith('구매 신청:')) return null;
  if (service.includes('마스터')) return 'master';
  if (service.includes('프로')) return 'pro';
  if (service.includes('입문')) return 'starter';
  return null;
}
```

**주의 — extractPackTier 분기 순서**: `'마스터'`가 `'프로'`보다 먼저 검사되어야 함. `name` 필드가 `"AI 음악 마스터 팩 (프로)"` 처럼 "마스터"와 "프로"가 동시 등장하지만 `service`는 `"구매 신청: AI 음악 마스터 팩 · 프로"` 형식 → "마스터" + "프로" 둘 다 포함됨 → 분기 순서가 중요. **마스터 → 프로 → 입문** 순서로 검사하면 tier 분리 정확:
- "구매 신청: AI 음악 마스터 팩 · 입문" → master 매칭? "마스터" 단어 포함되어 master로 분류됨 → **틀림**

→ 더 안전한 분기: tier 단어가 `·` 뒤에 와야 함:

```ts
export function extractPackTier(service: string): PackTier | null {
  if (!service.startsWith('구매 신청:')) return null;
  // service 예시: "구매 신청: AI 음악 마스터 팩 · 프로"
  // 마지막 "·" 뒤가 tier 이름
  const dotIdx = service.lastIndexOf('·');
  if (dotIdx === -1) return null;
  const tierName = service.slice(dotIdx + 1).trim();
  if (tierName === '입문') return 'starter';
  if (tierName === '프로') return 'pro';
  if (tierName === '마스터') return 'master';
  return null;
}
```

이 형태로 작성.

- [ ] **Step 2: 린트 통과 확인**

```bash
npx eslint lib/pack-assets.ts
```
Expected: exit 0, 출력 없음.

- [ ] **Step 3: 빠른 동작 검증 (Node REPL or 임시 console)**

다음 명령으로 함수 분기 검증:

```bash
node --input-type=module -e "
const { extractPackTier } = await import('./lib/pack-assets.ts').catch(() => null) ?? {};
"
```

이 프로젝트는 `.ts` 직접 실행이 안 되므로, 대신 임시로 Node에서 함수 로직만 복사해서 검증:

```bash
node -e "
function extractPackTier(service) {
  if (!service.startsWith('구매 신청:')) return null;
  const dotIdx = service.lastIndexOf('·');
  if (dotIdx === -1) return null;
  const tierName = service.slice(dotIdx + 1).trim();
  if (tierName === '입문') return 'starter';
  if (tierName === '프로') return 'pro';
  if (tierName === '마스터') return 'master';
  return null;
}
console.log('starter:', extractPackTier('구매 신청: AI 음악 마스터 팩 · 입문'));
console.log('pro:    ', extractPackTier('구매 신청: AI 음악 마스터 팩 · 프로'));
console.log('master: ', extractPackTier('구매 신청: AI 음악 마스터 팩 · 마스터'));
console.log('null1:  ', extractPackTier('구매 신청: 외주 개발'));
console.log('null2:  ', extractPackTier('일반 문의'));
"
```

Expected output:
```
starter: starter
pro:     pro
master:  master
null1:   null
null2:   null
```

- [ ] **Step 4: 커밋**

```bash
git add lib/pack-assets.ts
git commit -m "$(cat <<'EOF'
feat(packs): Music 팩 3티어 정적 자료 매핑 + tier 추출 함수

- PACK_ASSETS: starter/pro/master 각 자료 리스트 (Phase 1 placeholder, 실제 파일 URL은 Phase 2)
- extractPackTier(): orders.service "구매 신청: AI 음악 마스터 팩 · {tier}" → tier key
  · "·" 뒤의 마지막 단어로 매칭하여 "마스터 팩" + "프로" 같은 충돌 회피

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: TopNav supabase auth 구독 + 로그인 토글

**Files:**
- Modify: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\components\TopNav.tsx`

- [ ] **Step 1: imports 추가**

`app/components/TopNav.tsx` 의 현재 1-5행:
```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
```

다음으로 변경:
```tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
```

- [ ] **Step 2: state + auth 구독 + 로그아웃 핸들러 추가**

현재 `export default function TopNav()` 함수 본문 (15-41행)에서 state 선언 직후에 router/supabase/user state + auth effect + handleLogout 추가.

현재 (15-25행):
```tsx
export default function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
```

변경 후:
```tsx
export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Supabase auth state subscription (Sidebar.tsx:93-103 패턴)
  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUser(data.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    router.push('/');
    router.refresh();
  };
```

- [ ] **Step 3: 데스크톱 우측 영역 — 로그인 상태 토글**

현재 91-105행:
```tsx
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-block text-sm font-medium px-4 py-2 transition-colors"
            style={{ color: 'var(--kx-on-variant)', textDecoration: 'none' }}
          >
            로그인
          </Link>
          <Link
            href="/services/music"
            className="kx-btn-primary hidden sm:inline-flex items-center px-5 py-2 rounded-full text-sm"
            style={{ textDecoration: 'none' }}
          >
            Try now
          </Link>
```

변경 후:
```tsx
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/mypage"
                className="hidden sm:inline-block text-sm font-medium px-4 py-2 transition-colors"
                style={{ color: 'var(--kx-on-variant)', textDecoration: 'none' }}
              >
                마이페이지
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center px-5 py-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  color: 'var(--kx-on-surface)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'transparent',
                }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-block text-sm font-medium px-4 py-2 transition-colors"
                style={{ color: 'var(--kx-on-variant)', textDecoration: 'none' }}
              >
                로그인
              </Link>
              <Link
                href="/services/music"
                className="kx-btn-primary hidden sm:inline-flex items-center px-5 py-2 rounded-full text-sm"
                style={{ textDecoration: 'none' }}
              >
                Try now
              </Link>
            </>
          )}
```

이후 `<button onClick={() => setOpen(true)}` 햄버거 버튼은 변경 없음 (107-116행 그대로).

- [ ] **Step 4: 모바일 오버레이 하단 영역 — 로그인 상태 토글**

현재 153-168행 (모바일 오버레이 안의 로그인/Try now 버튼):
```tsx
            <div className="mt-6 flex gap-3">
              <Link
                href="/login"
                className="flex-1 py-3 text-center rounded-full text-sm font-bold"
                style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'var(--kx-on-surface)', textDecoration: 'none' }}
              >
                로그인
              </Link>
              <Link
                href="/services/music"
                className="kx-btn-primary flex-1 py-3 text-center rounded-full text-sm"
                style={{ textDecoration: 'none' }}
              >
                Try now
              </Link>
            </div>
```

변경 후:
```tsx
            <div className="mt-6 flex gap-3">
              {user ? (
                <>
                  <Link
                    href="/mypage"
                    className="flex-1 py-3 text-center rounded-full text-sm font-bold"
                    style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'var(--kx-on-surface)', textDecoration: 'none' }}
                  >
                    마이페이지
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-3 text-center rounded-full text-sm font-bold"
                    style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'var(--kx-on-surface)', background: 'transparent' }}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex-1 py-3 text-center rounded-full text-sm font-bold"
                    style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'var(--kx-on-surface)', textDecoration: 'none' }}
                  >
                    로그인
                  </Link>
                  <Link
                    href="/services/music"
                    className="kx-btn-primary flex-1 py-3 text-center rounded-full text-sm"
                    style={{ textDecoration: 'none' }}
                  >
                    Try now
                  </Link>
                </>
              )}
            </div>
```

- [ ] **Step 5: 린트 통과 확인**

```bash
npx eslint app/components/TopNav.tsx
```
Expected: 새 경고/에러 없음. 사전 존재하던 `react-hooks/set-state-in-effect` (line 27) 경고는 그대로 (out of scope).

- [ ] **Step 6: 커밋**

```bash
git add app/components/TopNav.tsx
git commit -m "$(cat <<'EOF'
feat(nav): TopNav supabase auth 구독 + 로그인 상태 토글

- 로그아웃 시: "로그인" link + "Try now" 버튼 (기존)
- 로그인 시: "마이페이지" link + "로그아웃" 버튼 (신규)
- 데스크톱 + 모바일 오버레이 둘 다 동일 패턴
- Sidebar.tsx:93-103 의 auth 구독 패턴 차용

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: PublicShell에 카카오 플로팅 버튼 추가

**Files:**
- Modify: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\components\PublicShell.tsx`

- [ ] **Step 1: 카카오 버튼 JSX + style 블록 추가**

현재 `PublicShell.tsx` 마지막은 `</main>` 닫고 `</>` 로 fragment 종료. footer는 `<main>` 안에 있음. 카카오 버튼은 footer 닫히고 main 닫히기 전, 또는 main 닫힌 후 fragment 안에 mount.

**위치**: 현재 `<footer>...</footer>` 닫는 태그(line ~113) 다음, `</main>` 직전.

현재 구조 (단순화):
```tsx
return (
  <>
    <TopNav />
    <main className="...">
      {children}
      <footer className="...">
        ...
      </footer>
    </main>
  </>
);
```

변경 후:
```tsx
return (
  <>
    <TopNav />
    <main className="...">
      {children}
      <footer className="...">
        ...
      </footer>
    </main>

    {/* 카카오 오픈채팅 플로팅 버튼 */}
    <a
      href="https://open.kakao.com/o/s9stoNvb"
      target="_blank"
      rel="noopener noreferrer"
      className="kakao-float-btn"
      aria-label="카카오 오픈채팅 상담"
      title="카카오 오픈채팅으로 1:1 상담"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C6.477 3 2 6.589 2 11c0 2.713 1.574 5.117 4 6.663V21l3.5-2.1A11.5 11.5 0 0 0 12 19c5.523 0 10-3.589 10-8s-4.477-8-10-8z"/>
      </svg>
      <span className="kakao-float-label">1:1 상담</span>
    </a>

    <style>{`
      .kakao-float-btn {
        position: fixed;
        bottom: 28px;
        right: 28px;
        z-index: 50;
        display: flex;
        align-items: center;
        gap: 8px;
        background: #FEE500;
        color: #3A1D1D;
        padding: 12px 18px;
        border-radius: 100px;
        font-weight: 700;
        font-size: 14px;
        text-decoration: none;
        box-shadow: 0 4px 20px rgba(254,229,0,0.4), 0 2px 8px rgba(0,0,0,0.15);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        white-space: nowrap;
      }
      .kakao-float-btn:hover {
        transform: translateY(-3px) scale(1.04);
        box-shadow: 0 8px 28px rgba(254,229,0,0.5), 0 4px 12px rgba(0,0,0,0.15);
      }
      .kakao-float-btn:active {
        transform: translateY(-1px) scale(0.98);
      }
      @media (max-width: 640px) {
        .kakao-float-btn {
          bottom: 20px;
          right: 16px;
          padding: 10px 14px;
          font-size: 13px;
        }
      }
    `}</style>
  </>
);
```

- [ ] **Step 2: 린트 통과 확인**

```bash
npx eslint app/components/PublicShell.tsx
```
Expected: exit 0.

- [ ] **Step 3: 시각적 잠시 확인 (수동, 선택적)**

`npm run dev` 후 메인 페이지(`/`) 우측 하단에 노란 카카오 플로팅 버튼 떠있는지 빠르게 확인. 본격 회귀 검증은 Task 8.

- [ ] **Step 4: 커밋**

```bash
git add app/components/PublicShell.tsx
git commit -m "$(cat <<'EOF'
feat(shell): PublicShell에 카카오 1:1 상담 플로팅 버튼 추가

DashboardShell 사이드바 분기에서 mypage 전용으로만 노출되던 카카오 버튼을
모든 공개 페이지(메인/서비스/외주/사주/결제/legal/mypage 등)에서 노출되도록 이동.
DashboardShell 쪽 원본은 Task 6에서 사이드바 분기 제거와 함께 자연 삭제 예정.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: mypage hero 축소 + Tab type 확장 + "구매한 팩" 탭 신설

**Files:**
- Modify: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\mypage\page.tsx`

본 task는 mypage에 추가/구조변경 성격의 변경만 적용 (색 토큰 일괄 마이그레이션은 Task 5).

- [ ] **Step 1: imports 추가**

`app/mypage/page.tsx` 파일 상단 import 영역에서 `import TelegramGuideModal` 다음에 추가:

```tsx
import { PACK_ASSETS, extractPackTier, type PackTier } from '@/lib/pack-assets';
```

- [ ] **Step 2: Tab type 확장**

현재 18행:
```tsx
type Tab = 'profile' | 'projects' | 'subscription' | 'saju' | 'payments' | 'orders';
```

변경 후:
```tsx
type Tab = 'profile' | 'projects' | 'subscription' | 'saju' | 'payments' | 'orders' | 'packs';
```

- [ ] **Step 3: tabs 배열에 "구매한 팩" 항목 추가 (결제 내역 다음 위치)**

현재 286-293행:
```tsx
  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'projects', label: '프로젝트 현황', count: projects.length || undefined },
    { key: 'orders', label: '의뢰 내역', count: orders.length || undefined },
    { key: 'payments', label: '결제 내역', count: payments.length || undefined },
    { key: 'profile', label: '내 정보' },
    { key: 'subscription', label: '구독 관리', count: activeSubs.length || undefined },
    { key: 'saju', label: '사주 기록', count: sajuRecords.length || undefined },
  ];
```

변경 후 (`결제 내역` 다음에 `구매한 팩` 추가, count는 packOrders로 계산):
```tsx
  const packOrders = orders
    .map((o) => ({ order: o, tier: extractPackTier(o.service) }))
    .filter((x): x is { order: Order; tier: PackTier } => x.tier !== null);

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'projects', label: '프로젝트 현황', count: projects.length || undefined },
    { key: 'orders', label: '의뢰 내역', count: orders.length || undefined },
    { key: 'payments', label: '결제 내역', count: payments.length || undefined },
    { key: 'packs', label: '구매한 팩', count: packOrders.length || undefined },
    { key: 'profile', label: '내 정보' },
    { key: 'subscription', label: '구독 관리', count: activeSubs.length || undefined },
    { key: 'saju', label: '사주 기록', count: sajuRecords.length || undefined },
  ];
```

- [ ] **Step 4: hero JSX 축소 + 로그아웃 버튼 제거 + 토큰 변경**

현재 302-325행 헤더:
```tsx
      {/* 헤더 */}
      <div className="bg-[#04102b] px-6 py-10" style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 40px)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#1a56db] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {user.email?.[0].toUpperCase()}
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-tight">{user.email}</div>
              <div className="text-blue-300/60 text-sm mt-0.5">
                가입일: {new Date(user.created_at).toLocaleDateString('ko-KR')}
              </div>
            </div>
            <div className="ml-auto">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/5 border border-white/10 text-slate-300 text-sm rounded-xl hover:bg-white/10 transition"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
```

변경 후:
```tsx
      {/* 헤더 — kx-surface 다크 톤, 축소판. 로그아웃은 TopNav에서 담당 */}
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

변경 사항 요약:
- `bg-[#04102b]` → CSS var `var(--kx-surface)` (#060e20)
- 패딩 `py-10` → `py-8`
- 하단 보더 추가 `border-b border-white/5`
- 아바타 크기 `w-14 h-14 text-xl` → `w-12 h-12 text-lg`
- 아바타 배경 `bg-[#1a56db]` → `var(--kx-primary)` (#cc97ff 보라)
- 이메일 텍스트에 `kx-display` 클래스 추가 (Jua + letter-spacing)
- 가입일 폰트 `text-sm` → `text-xs`, 색 `text-blue-300/60` → `text-white/50`
- 가입일 `: ` 콜론 → 공백
- **로그아웃 버튼 통째 제거** (`<div className="ml-auto">...</div>` 블록)

- [ ] **Step 5: handleLogout 함수 제거 (사용처 없어짐)**

현재 165-169행:
```tsx
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };
```

이 함수는 hero에서만 호출됐고 hero에서 로그아웃 버튼이 제거되므로 unused. **함수 통째 삭제**.

⚠️ 참고: 만약 다른 위치에서 `handleLogout` 호출이 남아있는지 확인 필요. 검증:

```bash
grep -n "handleLogout" app/mypage/page.tsx
```
Expected: 검색 결과 없음 (또는 함수 정의 한 줄만). 호출처 있으면 함께 제거.

- [ ] **Step 6: "구매한 팩" 탭 JSX 추가**

`{/* 결제 내역 */}` 섹션과 `{/* 프로젝트 진행 현황 */}` 섹션 사이에 새 섹션 삽입.

현재 mypage page.tsx 의 `{tab === 'payments' && (...)}` 블록과 `{tab === 'projects' && (...)}` 블록 사이.

새 섹션 JSX:
```tsx
        {/* 구매한 팩 */}
        {tab === 'packs' && (
          <div className="space-y-4">
            {packOrders.length === 0 ? (
              <EmptyState
                icon="🎵"
                title="구매한 팩이 없습니다"
                desc="AI 음악 팩을 구매하시면 자료가 여기에 표시됩니다"
                linkHref="/services/music"
                linkLabel="Music 팩 보기"
              />
            ) : (
              packOrders.map(({ order, tier }) => {
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
                        <a
                          href="https://open.kakao.com/o/s9stoNvb"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-600 hover:underline font-semibold"
                        >
                          카톡 오픈채팅 →
                        </a>
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
```

- [ ] **Step 7: '내 정보' 탭 빠른 메뉴에 AI 스튜디오 카드 추가**

현재 mypage `{tab === 'profile' && (...)}` 블록 안에 "빠른 메뉴" 섹션이 있음 (현재 line ~512-535). 두 카드: 사주 분석(`/saju/input`) + 외주 의뢰(`/freelance`). 음악 통합 강화를 위해 **AI 스튜디오 카드 1개 추가**.

현재 빠른 메뉴 그리드:
```tsx
<div className="grid grid-cols-2 gap-3">
  <Link href="/saju/input" className="..."> ... </Link>
  <Link href="/freelance" className="..."> ... </Link>
</div>
```

변경 후 — `grid-cols-2` → `grid-cols-3`, AI 스튜디오 카드 추가:
```tsx
<div className="grid grid-cols-3 gap-3">
  <Link href="/saju/input" className="...">
    {/* 기존 사주 카드 그대로 */}
  </Link>
  <Link href="/freelance" className="...">
    {/* 기존 외주 카드 그대로 */}
  </Link>
  <Link
    href="/studio"
    className="flex items-center gap-3 p-4 rounded-xl border border-[#dbe8ff] hover:border-blue-300 hover:bg-blue-50/50 transition group"
  >
    <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center flex-shrink-0">
      <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19a3 3 0 11-6 0 3 3 0 016 0zm12-3a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>
    <div>
      <div className="text-sm font-semibold text-[#04102b]">AI 스튜디오</div>
      <div className="text-xs text-slate-500">새 트랙 만들기</div>
    </div>
  </Link>
</div>
```

**주의 — 토큰 표기**: 위 새 카드의 `border-[#dbe8ff]`, `text-[#04102b]`, `hover:bg-blue-50/50`, `hover:border-blue-300` 같은 brand blue 토큰은 Task 5의 일괄 마이그레이션이 자동으로 처리하므로 **이번 task에서는 그대로 두기**. (Task 5에서 grep-치환 매핑이 새 카드도 함께 마이그레이션함.)

**모바일 grid 고려**: `grid-cols-3` 으로 모바일에서 3 column이 좁아질 수 있음. 보수적으로 `grid-cols-2 sm:grid-cols-3` 적용:
```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
```
(모바일 기본 2 column, sm+ 에서 3 column)

- [ ] **Step 8: 탭 한 줄 → wrap 처리 (모바일 7개 대응)**

현재 329-329행 탭 컨테이너:
```tsx
        <div className="flex gap-1 bg-white border border-[#dbe8ff] rounded-xl p-1 mb-6">
```

변경 후 (`flex-wrap` 추가, 각 탭 최소 폭 확보 위해 `flex-1 min-w-[100px]`):
```tsx
        <div className="flex flex-wrap gap-1 bg-white border border-[#dbe8ff] rounded-xl p-1 mb-6">
```

탭 버튼 className은 Task 5의 토큰 마이그레이션에서 `flex-1` → `flex-1 min-w-[100px]` 추가. 이번 task에서는 컨테이너만 `flex-wrap`.

- [ ] **Step 9: 린트 통과 확인**

```bash
npx eslint app/mypage/page.tsx
```
Expected: exit 0. 새 import 사용 X 경고 등 없어야 함.

- [ ] **Step 10: 빌드 통과 확인 (구조적 변경이라 TS 검증 권장)**

```bash
npm run build
```
Expected: 성공. PackTier 타입, packOrders 타입 추론 정상.

- [ ] **Step 11: 커밋**

```bash
git add app/mypage/page.tsx
git commit -m "$(cat <<'EOF'
feat(mypage): hero 축소 + "구매한 팩" 탭 신설 + 빠른 메뉴 AI 스튜디오 추가

- Hero: bg-[#04102b] → kx-surface, py-10→py-8, 아바타 보라 액센트, 가입일 톤 다운,
  로그아웃 버튼 제거 (TopNav가 담당)
- Tab type에 'packs' 추가, 결제 내역 다음 위치에 "구매한 팩" 탭
- packOrders 계산: orders.service 에서 extractPackTier로 Music 팩만 필터
- 신규 탭 JSX: status별 분기(완료/처리중/대기) + 자료 리스트 + 비활성 다운로드 버튼
  + 카톡 안내. Phase 2에서 다운로드 활성화 예정
- 빠른 메뉴: AI 스튜디오 카드 1개 추가 (사주·외주 옆), grid-cols-2→sm:grid-cols-3
- 탭 컨테이너 flex-wrap 적용 (모바일 7개 wrap)
- handleLogout 함수 제거 (사용처 없어짐)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: mypage 본문 색 토큰 마이그레이션

**Files:**
- Modify: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\mypage\page.tsx`

본 task는 색 토큰만 일괄 치환. 구조 변경 없음. Task 4 직후 같은 파일에 적용.

⚠️ **주의**: 의미 색(emerald/orange/amber/red/rose/pink/cyan/sky 등 status·메타 시그널)은 그대로 유지. 변경은 brand 색(`#1a56db`, `#04102b`, `#f0f5ff`, `#dbe8ff`, `blue-50/200/600` 같은 brand blue)만.

- [ ] **Step 1: 본문 외곽 + 탭 active 토큰 변경**

현재 296행:
```tsx
    <div className="min-h-full bg-[#f0f5ff]">
```
변경 후:
```tsx
    <div className="min-h-screen bg-slate-50">
```

현재 329-339행 (탭 바):
```tsx
        <div className="flex flex-wrap gap-1 bg-white border border-[#dbe8ff] rounded-xl p-1 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.key
                  ? 'bg-[#1a56db] text-white shadow'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
```
변경 후:
```tsx
        <div className="flex flex-wrap gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.key
                  ? 'bg-violet-600 text-white shadow'
                  : 'text-slate-500 hover:text-violet-600'
              }`}
            >
```

(`min-w-[100px]` 추가로 모바일 wrap 시 너무 좁아져서 텍스트 잘리는 것 방지)

- [ ] **Step 2: 토큰 일괄 치환 — 검색-치환 매핑**

mypage/page.tsx 전체에서 다음 패턴을 검색-치환. **하나씩 정확히 적용** (순서 중요 — 더 긴 패턴 먼저).

#### 2a. 다크 강조(헤더 외 위치) — 그대로 두기

`bg-[#04102b]` 가 헤더가 아닌 위치에서 등장하는지 확인:
```bash
grep -n "bg-\[#04102b\]" app/mypage/page.tsx
```

기대 결과: 라인 2 (프로젝트 카드 헤더), 라인 X (그 외). 각 위치 검토:
- 프로젝트 카드 다크 헤더(`<div className="bg-[#04102b] px-6 py-4 ...">`): 시각적으로 hero와 일관되도록 `var(--kx-surface)` 로 변경

**검색**: `className="bg-[#04102b] `
**치환**: 인라인 `style={{ background: 'var(--kx-surface)' }}` 로 변환하고 className에서 `bg-[#04102b]` 만 제거. 또는 더 간단히: `bg-[#060e20]` (hex 직접) 로 치환.

→ **선택**: `bg-[#04102b]` → `bg-[#060e20]` (전체 일괄 치환). 이미 사용자 헤더는 Task 4에서 `var(--kx-surface)` 직접 사용하도록 변경됨. 본문 안의 다른 다크 카드들은 hex로 두는 게 단순.

```bash
sed -i.bak 's/bg-\[#04102b\]/bg-[#060e20]/g' app/mypage/page.tsx
```

(macOS 호환 옵션 `-i.bak`. 실행 후 백업 파일 삭제: `rm app/mypage/page.tsx.bak`. Windows bash는 GNU sed 가능하면 그대로.)

⚠️ **수동 권장**: 만약 sed에 익숙치 않으면 Edit tool로 `replace_all: true` 사용:
- old_string: `bg-[#04102b]`
- new_string: `bg-[#060e20]`

- [ ] **Step 3: 브랜드 블루 액센트 → 보라 액센트 일괄 치환**

다음 매핑을 순서대로 적용 (Edit tool `replace_all: true` 권장):

| 검색 (`old_string`) | 치환 (`new_string`) | 의미 |
|---|---|---|
| `bg-[#1a56db]` | `bg-violet-600` | 주 액센트 배경 |
| `hover:bg-[#1e4fc2]` | `hover:bg-violet-500` | 액센트 hover |
| `text-[#1a56db]` | `text-violet-600` | 액센트 텍스트 |
| `border-[#dbe8ff]` | `border-slate-200` | 카드 보더 |
| `bg-[#f0f5ff]` | `bg-slate-50` | 본문 보조 배경 |
| `border-[#dbe8ff]` | `border-slate-200` | 카드 보더 (재) |
| `text-[#04102b]` | `text-slate-900` | 본문 다크 텍스트 |
| `text-blue-300/60` | `text-white/50` | 다크 위 옅은 텍스트 |
| `text-blue-300/50` | `text-white/40` | 다크 위 더 옅은 |
| `text-blue-300/70` | `text-white/60` | 다크 위 옅은 텍스트 |
| `text-blue-200` | `text-white/70` | 다크 위 본문 텍스트 |
| `bg-blue-50` | `bg-violet-50` | 강조 박스 배경 |
| `border-blue-200` | `border-violet-200` | 강조 박스 보더 |
| `text-blue-700` | `text-violet-700` | 강조 텍스트 |
| `text-blue-600` | `text-violet-600` | 강조 텍스트 |
| `text-blue-500` | `text-violet-500` | 강조 텍스트 |
| `bg-blue-100` | `bg-violet-100` | 옅은 강조 |
| `bg-blue-50/50` | `bg-violet-50/50` | 옅은 강조 hover |
| `border-blue-200` | `border-violet-200` | 강조 박스 보더 (재) |
| `border-blue-300` | `border-violet-300` | 강조 보더 |
| `bg-blue-700` | `bg-violet-700` | 강조 hover (현재 `hover:bg-blue-700` 패턴) |

각 매핑은 Edit tool에서 `replace_all: true`로 한 번씩 실행.

⚠️ **주의 — sky 계열은 손대지 X**: 텔레그램 연결 색이 `bg-sky-50/200/500`. 의미 색이라 보존.
⚠️ **주의 — 텍스트 색 `text-blue-*` 일부는 다크 헤더 안의 옅은 톤**: 위 매핑이 모두 위 표대로 치환되면 다크 헤더 위 텍스트가 자연스러운 white/50, white/60 톤으로 정돈됨.

- [ ] **Step 4: 검증 — 잔존 brand blue 토큰 검색**

```bash
grep -nE "(\[#04102b\]|\[#1a56db\]|\[#1e4fc2\]|\[#dbe8ff\]|\[#f0f5ff\]|bg-blue-(50|100|200|300|500|600|700)|text-blue-(200|300|500|600|700)|border-blue-(200|300))" app/mypage/page.tsx
```

기대 결과: 출력 없음 (빈 결과). 모든 brand blue 토큰이 치환되어야 함.

만약 잔존 항목이 있으면 Step 3 매핑에 누락된 패턴 → 추가 치환 후 재검증.

- [ ] **Step 5: 의미 색 보존 확인 (회귀 방지)**

다음 색은 status/메타 시그널이므로 그대로 살아있어야 함:

```bash
grep -nE "(emerald|orange|amber|red|rose|pink|cyan|sky)-(50|100|200|300|400|500|600|700)" app/mypage/page.tsx | head -20
```

기대: 다수 매치 출력 — 텔레그램(sky), 완료(emerald), 해지(orange), 결제(amber), 에러(red), 사주 메타(rose/pink/cyan) 등 그대로 유지.

- [ ] **Step 6: 린트 + 빌드 통과**

```bash
npx eslint app/mypage/page.tsx
npm run build
```
Expected: 둘 다 성공.

- [ ] **Step 7: 커밋**

```bash
git add app/mypage/page.tsx
git commit -m "$(cat <<'EOF'
style(mypage): 브랜드 블루 → 보라/슬레이트 일괄 토큰 마이그레이션

Liquid Glass 메인 surface와 톤 정렬:
- 본문 배경 #f0f5ff → slate-50
- 액센트 #1a56db → violet-600 (탭 active, 버튼, 링크)
- 카드 보더 #dbe8ff → slate-200
- 다크 카드(프로젝트 헤더) #04102b → #060e20 (kx-surface 일관)
- 강조 박스 blue-50/200 → violet-50/200
- 다크 위 텍스트 blue-300/60 → white/50 등

의미 색(emerald/orange/amber/red/rose/pink/cyan/sky)는 시그널이므로 보존.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: DashboardShell 사이드바 분기 + 카카오 버튼 + Sidebar import 통째 제거

**Files:**
- Modify: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\components\DashboardShell.tsx`

⚠️ **순서 보장**: 이 task는 Task 3(PublicShell에 카카오 버튼 마운트 완료) + Task 4·5(mypage 디자인 마이그레이션 완료) 직후 실행. 그래야 mypage가 PublicShell로 옮겨졌을 때 시각/기능 회귀 없음.

- [ ] **Step 1: DashboardShell.tsx 전체 재작성**

현재 파일은 130행으로, 사이드바 분기 + 모바일 top bar + 카카오 버튼 + style 블록 모두 사이드바 모드 안에 있음. 통째로 단순화.

`app/components/DashboardShell.tsx` 전체를 다음으로 교체:

```tsx
'use client';

import { usePathname } from 'next/navigation';
import PublicShell from './PublicShell';

const STANDALONE_PATHS = ['/login', '/signup', '/admin'];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isStandalone = STANDALONE_PATHS.some((p) => pathname.startsWith(p));

  if (isStandalone) {
    return <>{children}</>;
  }

  return <PublicShell>{children}</PublicShell>;
}
```

변경 사항:
- `Sidebar` import 삭제
- `useState` import 삭제 (사이드바 토글 state 없어짐)
- `SIDEBAR_PATHS` 상수 삭제
- `useSidebar` 분기 + 사이드바 + 모바일 top bar + main + footer + 카카오 버튼 + style 블록 통째 삭제
- 사업자 정보 footer는 PublicShell 푸터에 이미 있음 (메인 페이지 등에서 같은 정보) → DashboardShell에서 제거해도 mypage에서는 PublicShell의 푸터로 노출됨

⚠️ **회귀 점검**: PublicShell의 footer가 사업자 정보를 충분히 표시하는가?

`PublicShell.tsx:105-110` 확인:
```
<span>대표자: 박재오</span>
<span>사업자등록번호: 267-53-00822</span>
<span>서울시 동작구 여의대방로22아길 22, 1동 109호</span>
<span>010-3907-1392</span>
<span>bgg8988@gmail.com</span>
```

→ 사업자 정보 5종 모두 PublicShell footer에 존재. DashboardShell footer 삭제 안전.

- [ ] **Step 2: 린트 통과 확인**

```bash
npx eslint app/components/DashboardShell.tsx
```
Expected: exit 0. 사용 안 하는 import 경고 없어야 함.

- [ ] **Step 3: 빌드 통과 확인 (라우팅 영향)**

```bash
npm run build
```
Expected: 모든 라우트 빌드 성공. `/mypage` 도 빌드되어야 함.

- [ ] **Step 4: 커밋**

```bash
git add app/components/DashboardShell.tsx
git commit -m "$(cat <<'EOF'
refactor(shell): DashboardShell 사이드바 분기 통째 제거 → PublicShell 폴백

mypage가 PublicShell + TopNav를 사용하도록 라우팅 단순화:
- SIDEBAR_PATHS 상수 + Sidebar import + useSidebar 분기 + 모바일 top bar
  + 사이드바 안의 카카오 버튼 + 사업자 정보 footer + style 블록 모두 삭제
- Standalone 분기(/login·/signup·/admin)는 그대로 유지
- 카카오 버튼은 PublicShell로 이미 이동(Task 3)
- 사업자 정보 footer는 PublicShell footer가 동일 정보 보유

Sidebar.tsx 자체는 다음 커밋(Task 7)에서 삭제 — 사용처 0이 됨.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Sidebar.tsx 삭제

**Files:**
- Delete: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\components\Sidebar.tsx`

- [ ] **Step 1: 사용처 0 확인**

```bash
grep -rn "from './Sidebar'" app/ 2>/dev/null
grep -rn 'from "./Sidebar"' app/ 2>/dev/null
grep -rn "from '@/app/components/Sidebar'" app/ 2>/dev/null
grep -rn "import Sidebar" app/ 2>/dev/null
```

Expected: 모든 검색 결과 없음 (Task 6에서 DashboardShell의 import 제거됨).

만약 결과가 있으면 그 import도 제거 후 진행.

- [ ] **Step 2: 파일 삭제**

```bash
rm app/components/Sidebar.tsx
```

(Windows bash 환경: `rm` 작동. PowerShell이면 `Remove-Item app/components/Sidebar.tsx`.)

- [ ] **Step 3: 빌드 통과 재확인**

```bash
npm run build
```
Expected: 성공. 어디에서도 Sidebar를 import하지 않으므로 깨짐 없음.

- [ ] **Step 4: 커밋**

```bash
git add -A app/components/Sidebar.tsx
git commit -m "$(cat <<'EOF'
chore(shell): Sidebar.tsx 삭제 (사용처 0)

DashboardShell에서 사이드바 분기를 제거하면서 Sidebar 컴포넌트는 더 이상
어디에서도 import되지 않음. 파일 삭제로 dead code 정리.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

`git add -A` 사용 이유: 파일 삭제는 `git rm` 또는 `git add -A` 로 stage 가능. 안전하게 `-A` 사용 (이미 워킹 트리는 깨끗할 것).

---

## Task 8: 통합 빌드/린트/시각 회귀 검증

**Files:** 코드 변경 없음.

- [ ] **Step 1: 전체 빌드 통과**

```bash
npm run build
```
Expected: 성공. `/mypage` 가 PublicShell 모드로 prerender (또는 dynamic). 라우트 표에 `/mypage` 가 포함되어야 함.

- [ ] **Step 2: 변경된 핵심 파일 lint 통과**

```bash
npx eslint \
  lib/pack-assets.ts \
  app/components/TopNav.tsx \
  app/components/PublicShell.tsx \
  app/components/DashboardShell.tsx \
  app/mypage/page.tsx
```
Expected: exit 0. 사전 존재하던 TopNav.tsx 의 `react-hooks/set-state-in-effect` 경고는 그대로 (out of scope).

- [ ] **Step 3: 시각 회귀 점검 (사용자 수동)**

`npm run dev` 후 다음 시나리오를 사용자가 직접 검증:

**3a. 비로그인 상태**:
- `/` — TopNav 우측에 "로그인" + "Try now" 표시 (변경 X)
- `/services/music`, `/freelance`, `/saju` — 동일 헤더
- 메인/서비스/외주/사주 모든 페이지 우측 하단에 노란 카카오 플로팅 버튼 떠있는지

**3b. `/login` 페이지**:
- 헤더 없이 standalone 화면 (변경 X)

**3c. 로그인 후**:
- TopNav 우측이 "마이페이지" + "로그아웃"으로 토글됨
- "마이페이지" 클릭 → `/mypage` 이동
- mypage 헤더: 다크 hero (kx-surface) + 보라 아바타 + 이메일·가입일 + **로그아웃 버튼 없음**
- mypage 본문: 흰 카드 + 보라 액센트 + 7개 탭 ("프로젝트현황 / 의뢰내역 / 결제내역 / 구매한 팩 / 내정보 / 구독관리 / 사주기록")
- 모바일 viewport에서 탭이 wrap 되어 2~3줄로 떨어지는지

**3d. "구매한 팩" 탭**:
- 클릭 시 노출되는지 (현재 로그인 사용자의 orders.service에 "구매 신청: AI 음악 마스터 팩 ·" 가 없으면 EmptyState 표시)
- EmptyState: "구매한 팩이 없습니다" + "Music 팩 보기" CTA

**3e. 모바일 햄버거**:
- 햄버거 클릭 → 풀스크린 오버레이 → 하단에 "마이페이지" + "로그아웃" 표시 (로그인 시) / "로그인" + "Try now" (비로그인 시)

**3f. 로그아웃**:
- TopNav "로그아웃" 클릭 → `/` 로 이동 + TopNav가 "로그인" + "Try now"로 다시 토글

**3g. `/admin/*` 비인가 접근**:
- 정상적으로 admin 자체 화면 표시 (변경 X)

**3h. 카카오 플로팅 버튼**:
- 메인 / mypage / 서비스 / 외주 / 사주 / legal 모두에서 우측 하단에 노출
- 클릭 시 `https://open.kakao.com/o/s9stoNvb` 새 탭으로 열림

- [ ] **Step 4: P0 commits + Phase 1 commits 종합 git log 확인**

```bash
git log --oneline f237013..HEAD
```

Expected: 12 P0 commits + 7 Phase 1 commits + 1 spec commit = 20개 커밋 (또는 그 근처).

- [ ] **Step 5: Task 5의 sed 백업 파일 정리 (혹시 남았으면)**

```bash
ls app/mypage/page.tsx.bak 2>/dev/null && rm app/mypage/page.tsx.bak
```
(파일 없으면 무시)

- [ ] **Step 6: Phase 2 spec 작성 시점 메모**

Phase 1 완료 보고 시 사용자에게 다음 안내:
> "Phase 1(디자인 + 구조 통합) 완료. Phase 2(NAS 자료 호스팅 + HMAC 토큰 + 다운로드 활성화)는 별도 spec으로 작성 예정. 운영상 자료 자동 다운로드 수요(예: 구매자 N명 누적 시점)에 시작 권장."

이번 task는 코드 변경 없으므로 별도 커밋 불필요.

---

## 부록 A. 작업 순서 안전성 분석

각 commit이 leaves the app in a working state 인지 검증.

| 시점 | mypage 상태 | 로그아웃 경로 | 카카오 버튼 |
|---|---|---|---|
| Task 1 후 | Sidebar 모드 (변경 X) | Sidebar.tsx의 로그아웃 (정상) | DashboardShell의 카카오 버튼 (정상) |
| Task 2 후 | Sidebar 모드 (변경 X) | Sidebar 로그아웃 (정상) + TopNav 로그아웃 (mypage엔 미노출, 메인엔 노출) | DashboardShell의 카카오 (정상) |
| Task 3 후 | Sidebar 모드 (변경 X) | 동일 | DashboardShell의 카카오(mypage) + PublicShell 카카오(메인) — **두 곳에 둘 다 노출**. 사이드바 모드는 사이드바의 카카오만 보임. |
| Task 4 후 | Sidebar 모드 + mypage hero 축소·새 탭 추가 (구조 변경) | mypage hero 로그아웃 X, **Sidebar 로그아웃 그대로** (Sidebar 모드라서) | 동일 |
| Task 5 후 | Sidebar 모드 + mypage 색 토큰 변경 | 동일 | 동일 |
| Task 6 후 | **PublicShell 모드** + TopNav 헤더 + mypage 본문 | TopNav 로그아웃 (Task 2에서 추가) | PublicShell 카카오만 (DashboardShell 카카오 자연 삭제) |
| Task 7 후 | 동일 | 동일 | 동일 — Sidebar.tsx 삭제만 |

→ 각 단계 모두 사용자가 mypage에서 로그아웃 가능 + 카카오 1:1 상담 진입 가능. 안전.

## 부록 B. 검증 인프라 부재에 대한 메모

이 프로젝트는 jest/vitest/playwright 미설치. 따라서 자동화된 단위/통합 테스트 작성을 P1에 포함하지 않음. 검증은 다음 3-단계로 한다:

1. `npx eslint <file>` — TypeScript + ESLint
2. `npm run build` — Next.js 빌드 통과 (TS 컴파일 + 라우트 prerender)
3. 시각/수동 — `npm run dev` + 사용자 시나리오 점검 (Task 8 Step 3 항목)

`extractPackTier` 같은 순수 함수는 Task 1 Step 3의 임시 Node REPL 검증으로 분기 정확성 확인. 더 본격적인 자동 테스트는 P2 또는 P3에서 Playwright 도입 검토.
