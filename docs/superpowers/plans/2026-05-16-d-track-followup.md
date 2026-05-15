# D 트랙 — P0/P1/P2 Review Follow-up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** P0/P1/P2 review feedback에서 defer된 5 follow-up cleanup 일괄 처리 — KAKAO URL SSOT, KakaoFloatButton 추출, mypage 잔여 정돈, 모바일 7-tab 가로 스크롤, "Try now" 로그인 시 노출.

**Architecture:** 각 task 독립적 cleanup. 기존 review에서 명세된 fix들이라 design 결정 없음. 5 task × ~5-30 LOC = 총 약 100 LOC 미만. brainstorm 생략.

**Tech Stack:** Next.js 16 App Router + TS + Tailwind v4

**Source Reviews:**
- P1 Task 2 review (TopNav auth): M-3 "Try now" disappears on login
- P1 Task 3 review (PublicShell kakao button): I-1 component extraction, I-2 URL SSOT
- P2 Task 4 review (mypage packs): M-2 disabled button conditional (already addressed in implementation), M-5 mobile tab wrap

---

## File Structure

| 파일 | 종류 | 책임 |
|---|---|---|
| `lib/contact.ts` | Create | `KAKAO_OPENCHAT_URL` 상수 single source of truth |
| `app/components/KakaoFloatButton.tsx` | Create | 카카오 1:1 상담 플로팅 버튼 컴포넌트 (PublicShell 인라인 JSX + style 추출) |
| `app/components/PublicShell.tsx` | Modify | 인라인 카카오 버튼 → `<KakaoFloatButton />` 컴포넌트 사용 |
| `app/mypage/page.tsx` | Modify | (a) kakao URL → 상수 import (b) EmptyState linkHref `/services/music` → `/music/packs` (c) 탭 바 `flex-wrap` → `overflow-x-auto flex-nowrap` |
| `app/components/TopNav.tsx` | Modify | 로그인 상태에서도 "Try now" 노출 (마이페이지/로그아웃 옆) |

---

## Task 순서

각 task는 독립적이라 어느 순서든 가능. 다음 순서로 진행:

1. **D1**: `lib/contact.ts` 신규 + KAKAO_OPENCHAT_URL — 다른 task의 import source
2. **D2**: `KakaoFloatButton.tsx` 신규 + PublicShell 인라인 추출 (D1의 상수 활용)
3. **D3**: mypage 잔여 정돈 (kakao URL 상수 import + linkHref + 탭 가로 스크롤)
4. **D4**: TopNav "Try now" 로그인 시 노출

총 4 task. (당초 5개 중 "mypage 다운로드 버튼 조건부 렌더"는 Phase 2 implementation에서 이미 처리됨 — D3에 정돈 한 줄로 흡수.)

---

## Task D1: lib/contact.ts — KAKAO_OPENCHAT_URL SSOT

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\lib\contact.ts`

- [ ] **Step 1: 파일 작성**

```ts
/**
 * 외부 연락 채널 상수 SSOT.
 * - KAKAO_OPENCHAT_URL: 1:1 카카오 오픈채팅. PublicShell 플로팅 버튼 + mypage 안내 등에서 공유.
 *   URL 변경 시 이 파일만 수정.
 */
export const KAKAO_OPENCHAT_URL = 'https://open.kakao.com/o/s9stoNvb';
```

- [ ] **Step 2: 린트**

```bash
npx eslint lib/contact.ts
```
Expected: exit 0.

- [ ] **Step 3: 커밋**

```bash
git add lib/contact.ts
git commit -m "$(cat <<'EOF'
feat(lib): contact.ts — KAKAO_OPENCHAT_URL SSOT 상수

D 트랙 1/4. 현재 카카오 오픈채팅 URL이 3곳에 하드코딩(PublicShell, mypage,
historical DashboardShell) — single source of truth로 정돈. 향후 URL 변경 시
이 파일만 수정.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: ⚠️ git log -3 직접 확인**

```bash
git log --oneline -3
```

기대: HEAD = 본인 commit, 직전 = `972bfd8` (P1 D1 완료) 또는 그 이후 push 후 영향 없음 (push는 origin/main 동기화만).

---

## Task D2: KakaoFloatButton 컴포넌트 추출

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\components\KakaoFloatButton.tsx`
- Modify: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\components\PublicShell.tsx`

- [ ] **Step 1: KakaoFloatButton.tsx 신규 작성**

기존 PublicShell.tsx 의 인라인 카카오 버튼 JSX + `<style>` 블록을 추출.

`app/components/KakaoFloatButton.tsx`:

```tsx
import { KAKAO_OPENCHAT_URL } from '@/lib/contact';

/**
 * 카카오 1:1 상담 플로팅 버튼.
 * PublicShell footer 다음에 마운트되어 모든 공개 페이지에 노출.
 */
export default function KakaoFloatButton() {
  return (
    <>
      <a
        href={KAKAO_OPENCHAT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="kakao-float-btn"
        aria-label="카카오 오픈채팅 상담"
        title="카카오 오픈채팅으로 1:1 상담"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
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
}
```

추가 사항:
- SVG에 `aria-hidden` 추가 (parent anchor의 aria-label이 announce 대체)
- KAKAO_OPENCHAT_URL import (D1에서 신규)

- [ ] **Step 2: PublicShell.tsx 수정**

현재 (119-169행 부근):
```tsx
{/* 카카오 오픈채팅 플로팅 버튼 */}
<a href="https://open.kakao.com/o/s9stoNvb" ...>
  ...
</a>
<style>{`...`}</style>
```

위 두 element(`<a>` + `<style>`) **전체를** 다음 한 줄로 교체:

```tsx
<KakaoFloatButton />
```

또한 PublicShell.tsx 상단 import 영역에 추가:

```tsx
import KakaoFloatButton from './KakaoFloatButton';
```

- [ ] **Step 3: 린트 + 빌드**

```bash
npx eslint app/components/KakaoFloatButton.tsx app/components/PublicShell.tsx
npm run build 2>&1 | tail -10
```

빌드 통과 필수.

- [ ] **Step 4: 커밋**

```bash
git add app/components/KakaoFloatButton.tsx app/components/PublicShell.tsx
git commit -m "$(cat <<'EOF'
refactor(shell): KakaoFloatButton 컴포넌트 추출 — PublicShell 인라인 → 별도 컴포넌트

D 트랙 2/4. P1 Task 3 review I-1 후속:
- PublicShell의 인라인 카카오 버튼 JSX + style 블록 → KakaoFloatButton.tsx
- KAKAO_OPENCHAT_URL은 lib/contact 에서 import
- SVG에 aria-hidden 추가 (parent aria-label 우선)

향후 admin shell 또는 다른 surface에서 재사용 가능.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: ⚠️ git log -3 직접 확인**

```bash
git log --oneline -3
```

---

## Task D3: mypage 잔여 정돈 (kakao URL + linkHref + 탭 overflow)

**Files:**
- Modify: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\mypage\page.tsx`

3가지 cleanup을 단일 commit에 묶음:
(a) hardcoded kakao URL → import 상수
(b) EmptyState `linkHref="/services/music"` → `/music/packs` (P1 새 URL)
(c) 탭 바 `flex-wrap` → `overflow-x-auto flex-nowrap` (모바일 7-tab 가로 스크롤)

- [ ] **Step 1: import 추가**

`app/mypage/page.tsx` 상단 import 영역에 추가:

```tsx
import { KAKAO_OPENCHAT_URL } from '@/lib/contact';
```

기존 import 그룹과 일관되게 배치 (예: 다른 `@/lib/*` import 옆).

- [ ] **Step 2: hardcoded kakao URL 교체**

mypage page.tsx 안의 다음 패턴을 찾아 교체:

검색: `href="https://open.kakao.com/o/s9stoNvb"`
교체: `href={KAKAO_OPENCHAT_URL}`

grep 으로 확인:
```bash
grep -n "open.kakao.com" app/mypage/page.tsx
```

이전 코드(line 880 부근):
```tsx
<a
  href="https://open.kakao.com/o/s9stoNvb"
  target="_blank"
  rel="noopener noreferrer"
  className="text-violet-600 hover:underline font-semibold"
>
  카톡 오픈채팅 →
</a>
```

변경 후:
```tsx
<a
  href={KAKAO_OPENCHAT_URL}
  target="_blank"
  rel="noopener noreferrer"
  className="text-violet-600 hover:underline font-semibold"
>
  카톡 오픈채팅 →
</a>
```

- [ ] **Step 3: EmptyState linkHref 정돈**

mypage packs 탭의 EmptyState (현재 line 800-807 부근):

이전:
```tsx
<EmptyState
  icon="🎵"
  title="구매한 팩이 없습니다"
  desc="AI 음악 팩을 구매하시면 자료가 여기에 표시됩니다"
  linkHref="/services/music"
  linkLabel="Music 팩 보기"
/>
```

변경 후 (`linkHref` 만):
```tsx
linkHref="/music/packs"
```

(redirect 처리되긴 하지만 직접 새 URL 사용 — 1 hop 절약)

추가로, mypage 안에 다른 `/services/*`, `/freelance`, `/saju`, `/studio` 잔존 URL 있는지 grep:

```bash
grep -nE "/services/(music|blog|website)|href=\"/(freelance|saju|studio)" app/mypage/page.tsx
```

각각 새 URL로 교체:
- `/services/music` → `/music/packs`
- `/services/blog` → `/work/blog`
- `/services/website` → `/work/website`
- `/freelance` → `/work/freelance`
- `/saju` → `/work/saju`
- `/studio` → `/music/studio`

- [ ] **Step 4: 탭 바 `flex-wrap` → 가로 스크롤**

현재 line 361 부근:

```tsx
<div className="flex flex-wrap gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-6">
```

변경 후:

```tsx
<div className="flex flex-nowrap gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-6 overflow-x-auto scrollbar-hide">
```

키 차이:
- `flex-wrap` → `flex-nowrap` (한 줄 강제)
- `overflow-x-auto` 추가 (모바일 좁을 때 가로 스크롤)
- `scrollbar-hide` 추가 (스크롤바 시각 숨김 — Tailwind plugin 없으면 CSS 별도)

⚠️ `scrollbar-hide`가 Tailwind 기본 또는 프로젝트 설정에 없을 수 있음. 확인:

```bash
grep -rn "scrollbar-hide" app/ --include="*.tsx" --include="*.css" 2>/dev/null | head -3
```

매칭 없으면 `scrollbar-hide` 클래스를 빼고 그냥 `overflow-x-auto`만 사용. 또는 globals.css에 다음 추가:

```css
/* app/globals.css 끝에 추가 */
.scrollbar-hide {
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

⚠️ globals.css 변경 권장 — 스크롤바 시각 제거 (가로 스크롤 UX 미려화).

또한 탭 button에 `min-w-[100px]` 이미 있는지 확인. 있으면 가로 스크롤과 자연스럽게 작동. 없으면 추가 검토 — 단, 현재 spec(P1 코드)에 이미 `min-w-[100px]` 있어 OK일 가능성 큼.

```bash
grep -nE "min-w-\[100px\]|min-w-\[" app/mypage/page.tsx | head -5
```

- [ ] **Step 5: globals.css에 scrollbar-hide 추가 (이전 step에서 없으면)**

`app/globals.css` 파일 끝에 추가 (이미 있으면 skip):

```css
/* 가로 스크롤 탭바 등에서 스크롤바 시각 숨김 */
.scrollbar-hide {
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 6: 린트 + 빌드**

```bash
npx eslint app/mypage/page.tsx
npm run build 2>&1 | tail -10
```

- [ ] **Step 7: 커밋**

```bash
git add app/mypage/page.tsx app/globals.css
git commit -m "$(cat <<'EOF'
refactor(mypage): kakao URL 상수 + EmptyState linkHref + 탭 가로 스크롤

D 트랙 3/4. 잔여 정돈:
- kakao 오픈채팅 URL hardcoded → KAKAO_OPENCHAT_URL import (lib/contact)
- EmptyState linkHref "/services/music" → "/music/packs" (P1 새 URL)
- 탭 바: flex-wrap → flex-nowrap + overflow-x-auto + scrollbar-hide
  → 모바일 7-tab을 한 줄 가로 스크롤 (wrap 시 2줄 불규칙 배치 해소)
- globals.css에 scrollbar-hide 유틸리티 추가

P2 Task 4 review M-5 (mobile 7-tab orphan) 해소.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 8: ⚠️ git log -3 직접 확인**

```bash
git log --oneline -3
```

---

## Task D4: TopNav "Try now" 로그인 시에도 노출

**Files:**
- Modify: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\components\TopNav.tsx`

P1 Task 2 review M-3 후속: 로그인 사용자도 "팩 더 사기" 컨버전 경로 유지 — "Try now" 그대로 노출 + "로그아웃" 텍스트 버튼.

현재 (로그인 시 데스크톱 우측 영역):
```
[마이페이지] [로그아웃]
```

변경 후 (3개 노출 — Try now 추가):
```
[마이페이지] [Try now] [로그아웃]
```

기획 의도: 로그인 사용자도 새 팩 구매 동기 유지. "Try now"는 컨버전 액션이라 헤더에서 떼어내면 안 됨.

- [ ] **Step 1: 데스크톱 우측 영역 변경**

`app/components/TopNav.tsx` 의 로그인 분기 (현재 우측 영역, line ~119-147 부근):

이전:
```tsx
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
  ...
)}
```

변경 후 (마이페이지 + Try now + 로그아웃 3개):
```tsx
{user ? (
  <>
    <Link
      href="/mypage"
      className="hidden sm:inline-block text-sm font-medium px-4 py-2 transition-colors"
      style={{ color: 'var(--kx-on-variant)', textDecoration: 'none' }}
    >
      마이페이지
    </Link>
    <Link
      href="/music"
      className="kx-btn-primary hidden sm:inline-flex items-center px-5 py-2 rounded-full text-sm"
      style={{ textDecoration: 'none' }}
    >
      Try now
    </Link>
    <button
      onClick={handleLogout}
      className="hidden sm:inline-flex items-center px-3 py-2 text-sm font-medium transition-colors"
      style={{ color: 'var(--kx-on-variant)', background: 'transparent' }}
    >
      로그아웃
    </button>
  </>
) : (
  ...
)}
```

변경 핵심:
- 마이페이지 (텍스트 link 그대로)
- "Try now" (`kx-btn-primary` 보라 버튼 추가, href `/music`)
- 로그아웃 (border 제거, 텍스트만 — Try now가 시각적 강조라서 로그아웃은 가볍게)

- [ ] **Step 2: 모바일 오버레이 하단 영역 변경**

현재 (line ~209-237 부근):
```tsx
{user ? (
  <>
    <Link href="/mypage" ...>마이페이지</Link>
    <button onClick={handleLogout} ...>로그아웃</button>
  </>
) : (
  ...
)}
```

모바일은 공간 충분 (full-screen overlay). 3개 모두 노출:

```tsx
{user ? (
  <>
    <Link
      href="/mypage"
      className="flex-1 py-3 text-center rounded-full text-sm font-bold"
      style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'var(--kx-on-surface)', textDecoration: 'none' }}
    >
      마이페이지
    </Link>
    <Link
      href="/music"
      className="kx-btn-primary flex-1 py-3 text-center rounded-full text-sm"
      style={{ textDecoration: 'none' }}
    >
      Try now
    </Link>
  </>
) : (
  ...
)}
```

⚠️ **모바일 로그아웃 위치 결정**: 모바일에서 3개 버튼은 한 줄에 안 들어감. 옵션:
- (a) 마이페이지 + Try now만 노출, 로그아웃은 마이페이지 안에 진입해서 처리 (현재 mypage에는 로그아웃 버튼 없음 — Phase 1에서 제거됨)
- (b) 두 줄로: 위에 마이페이지+Try now, 아래에 별도 로그아웃 row

(a)를 하려면 mypage에 로그아웃 다시 추가하거나, 모바일에선 로그아웃 별도 위치.

**결정**: (b) 두 줄. 첫 줄 `flex gap-3` 로 [마이페이지][Try now], 두 번째 줄에 width-full "로그아웃" 텍스트 버튼.

수정:

```tsx
{user ? (
  <>
    <div className="flex gap-3 w-full">
      <Link
        href="/mypage"
        className="flex-1 py-3 text-center rounded-full text-sm font-bold"
        style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'var(--kx-on-surface)', textDecoration: 'none' }}
      >
        마이페이지
      </Link>
      <Link
        href="/music"
        className="kx-btn-primary flex-1 py-3 text-center rounded-full text-sm"
        style={{ textDecoration: 'none' }}
      >
        Try now
      </Link>
    </div>
    <button
      onClick={handleLogout}
      className="w-full py-3 text-center text-sm font-medium mt-2"
      style={{ color: 'var(--kx-on-variant)', background: 'transparent' }}
    >
      로그아웃
    </button>
  </>
) : (
  ...
)}
```

⚠️ 외곽 `<div className="mt-6 flex gap-3">` 의 flex 레이아웃은 기존 — 새 구조는 첫 줄 flex + 두 번째 줄 standalone. 외곽 부모를 `flex-col`로 변경하거나, 위 코드처럼 fragment 안에서 div + button 2개로 처리.

원본 외곽 (line ~205-208 부근):
```tsx
<div className="mt-6 flex gap-3">
  {user ? (...) : (...)}
</div>
```

→ 변경 후 외곽을 `<div className="mt-6 flex flex-col gap-2">` 로 (column 방향):

```tsx
<div className="mt-6 flex flex-col gap-2">
  {user ? (
    <>
      <div className="flex gap-3">
        <Link href="/mypage" className="flex-1 py-3 ...">마이페이지</Link>
        <Link href="/music" className="kx-btn-primary flex-1 py-3 ...">Try now</Link>
      </div>
      <button onClick={handleLogout} className="w-full py-3 text-center text-sm font-medium" style={{ color: 'var(--kx-on-variant)', background: 'transparent' }}>
        로그아웃
      </button>
    </>
  ) : (
    <div className="flex gap-3">
      <Link href="/login" className="flex-1 py-3 ...">로그인</Link>
      <Link href="/music" className="kx-btn-primary flex-1 py-3 ...">Try now</Link>
    </div>
  )}
</div>
```

(비로그인 분기도 동일하게 가운데 div로 감싸서 flex-col 부모와 호환)

- [ ] **Step 3: 린트 + 빌드**

```bash
npx eslint app/components/TopNav.tsx
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: 커밋**

```bash
git add app/components/TopNav.tsx
git commit -m "$(cat <<'EOF'
feat(nav): TopNav 로그인 시에도 "Try now" 노출 (마케팅 컨버전 유지)

D 트랙 4/4. P1 Task 2 review M-3 후속:
- 로그인 사용자: [마이페이지] [Try now] [로그아웃] 3개 모두 노출
  → 신규 팩 구매 동기 유지 (이전: Try now가 사라져 컨버전 손실)
- 로그아웃 button을 텍스트 스타일로 가볍게 (Try now가 시각 강조)
- 모바일: flex-col로 2줄 배치 (1줄: 마이페이지+Try now, 2줄: 로그아웃 텍스트)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: ⚠️ git log -3 직접 확인**

```bash
git log --oneline -3
```

---

## 부록 A. 검증 인프라

각 task 검증:
1. `npx eslint <변경 파일>` — TS + ESLint
2. `npm run build` — Next 빌드 통과
3. 시각 회귀 — 마지막 task 후 사용자 수동 확인

테스트 인프라(jest/vitest/playwright) 없음. P0/P1/P2와 동일 검증 흐름.

## 부록 B. 검증 시나리오 (D 트랙 종료 후)

`npm run dev` 후 사용자 수동 검증:

**카카오 버튼 SSOT**:
- [ ] 메인 `/` 우측 하단 노란 카카오 버튼 정상 클릭 → 오픈채팅 열림
- [ ] mypage "구매한 팩" 탭에서 입금 대기 상태 시 카톡 안내 링크 정상 작동
- [ ] (선택) `lib/contact.ts` 에서 URL 임시 변경 → 두 곳 모두 새 URL 반영 확인

**mypage 잔여 정돈**:
- [ ] "구매한 팩" 탭 EmptyState의 "Music 팩 보기" 클릭 → 한 번에 `/music/packs` (이전엔 `/services/music` → redirect)
- [ ] 모바일 viewport(예: iPhone SE)에서 7개 탭 가로 스크롤 작동 (한 줄, swipe 가능)
- [ ] 데스크톱에서는 그대로 한 줄에 7개 노출

**TopNav Try now**:
- [ ] 로그인 후 데스크톱 헤더: `JSM | Music | Custom Build | 마이페이지 | Try now | 로그아웃`
- [ ] Try now 클릭 → `/music` 진입
- [ ] 로그아웃 클릭 → `/` 이동 + 토글 복귀 (로그인/Try now)
- [ ] 모바일 햄버거 오버레이: 마이페이지+Try now 한 줄 + 로그아웃 텍스트 줄

## 부록 C. P3+ 후속 (이 plan 종료 후)

- 자체 정가 표 (가격 결정 후 `/work` 허브에 추가)
- `/about` 페이지
- 사주 카탈로그 (재정리 후 49만 코어 + 11 모듈)
- sitemap.xml 자동 생성 (`app/sitemap.ts`)
- `lib/contact.ts` 확장 — EMAIL, PHONE 등 추가 상수
