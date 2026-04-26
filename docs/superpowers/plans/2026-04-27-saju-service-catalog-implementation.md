# 사주 서비스 카탈로그 운영화 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** spec `docs/superpowers/specs/2026-04-27-saju-service-catalog-design.md`에 정의된 카탈로그를 사이트·견적 시스템에 반영해, 1세트의 카탈로그로 LP·견적·결제 안내·영업용 PDF를 일관되게 굴릴 수 있는 운영 환경을 만든다.

**Architecture:** 카탈로그 데이터를 `lib/saju-catalog.ts` 단일 모듈로 정의(SSOT). LP, 견적 에디터, 결제 안내 페이지에서 동일 모듈을 import해 일관성 유지. 견적 에디터에는 "카탈로그에서 추가" 모달 + "프리셋 적용" 드롭다운을 붙여 4종 시나리오를 원클릭으로 채운다. 카탈로그 PDF는 LP에 `@media print` 모드를 추가해 브라우저 인쇄 → PDF 저장으로 처리(별도 PDF 라이브러리 도입 X).

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind v4, Supabase(`/admin/quotes` 기존), 정적 페이지(결제 안내).

**Spec 참조:** `docs/superpowers/specs/2026-04-27-saju-service-catalog-design.md`

**테스트 전략:** 프로젝트에 테스트 프레임워크가 설치되어 있지 않다. 카탈로그 데이터 모듈은 LP·견적 에디터에서 import해 빌드되는 것으로 검증한다(`npm run build` 통과). UI 검증은 dev 서버에서 시각 확인 + 콘솔 에러 부재로 한다. 가격 합산 로직은 순수 함수로 분리하고, 임의의 모듈 조합으로 LP 시나리오 표가 spec 값(예: 풀세트 사주집 일회성 146만)과 일치하는지 시각 검증한다.

---

## File Structure

| 파일 | 용도 | 작업 |
|---|---|---|
| `lib/saju-catalog.ts` | 카탈로그 SSOT (코어·모듈·프리셋·헬퍼) | Create |
| `app/services/saju-business/page.tsx` | LP + print 모드 (영업용 PDF 겸용) | Create |
| `app/admin/quotes/[id]/CatalogPicker.tsx` | 모듈 체크 모달 컴포넌트 | Create |
| `app/admin/quotes/[id]/PresetApply.tsx` | 4종 프리셋 드롭다운 | Create |
| `app/admin/quotes/[id]/page.tsx` | 견적 에디터 — 위 두 컴포넌트 통합 | Modify |
| `app/payment-info/page.tsx` | A안 결제 안내 정적 페이지 | Create |
| `app/components/TopNav.tsx` | 사주 비즈니스 메뉴 노출(옵션) | Modify |

---

## Task 1: 카탈로그 데이터 모듈 (SSOT)

**Files:**
- Create: `lib/saju-catalog.ts`

- [ ] **Step 1.1: 카탈로그 모듈 작성**

`lib/saju-catalog.ts`:
```ts
// 쟁승메이드 사주 서비스 카탈로그 — Single Source of Truth
// spec: docs/superpowers/specs/2026-04-27-saju-service-catalog-design.md

export type Persona = 'salon' | 'influencer' | 'app';

export interface Module {
  code: string;
  name: string;
  description: string;
  price: number;
  recurring: boolean;
  category: '기획' | '디자인' | '개발' | '인프라' | '유지보수' | '기타';
  optional: boolean;
  mainPersonas: Persona[];
}

export const PERSONA_LABEL: Record<Persona, string> = {
  salon: '사주집·역술원',
  influencer: '인스타·틱톡 사주',
  app: '사주 앱·플랫폼',
};

export const CORE: Module = {
  code: 'C1',
  name: 'AI 사주 분석 프로그램',
  description: '영구 사용권 + 원격 설치 1회 + 영상·PDF 가이드 + 1개월 카톡 응대',
  price: 490000,
  recurring: false,
  category: '개발',
  optional: false,
  mainPersonas: ['salon', 'influencer', 'app'],
};

export const MODULES_ONETIME: Module[] = [
  { code: 'M1', name: '브랜딩 커스터마이징', description: '로고·색상·상호 적용', price: 70000, recurring: false, category: '디자인', optional: true, mainPersonas: ['salon', 'influencer'] },
  { code: 'M2', name: 'AI 분석 100건 충전', description: '정가 990,000원의 95% 할인', price: 50000, recurring: false, category: '개발', optional: true, mainPersonas: ['influencer', 'app'] },
  { code: 'M3', name: '인스타 카드뉴스 자동 생성기', description: '사주 결과 → 카드뉴스 PNG 자동 생성', price: 350000, recurring: false, category: '개발', optional: true, mainPersonas: ['influencer'] },
  { code: 'M4', name: '카카오톡 챗봇', description: '24시간 사주 접수·결제 안내 자동', price: 350000, recurring: false, category: '개발', optional: true, mainPersonas: ['salon'] },
  { code: 'M5', name: '사주집 전용 홈페이지 + 결제', description: '자체 도메인 + Next.js LP + 포트원 PG 결제', price: 600000, recurring: false, category: '개발', optional: true, mainPersonas: ['salon'] },
  { code: 'M6', name: 'TTS 음성 풀이', description: '사주 결과를 목소리로 출력', price: 250000, recurring: false, category: '개발', optional: true, mainPersonas: ['influencer'] },
  { code: 'M7', name: 'PDF 풀이지 자동 인쇄 연동', description: '손님께 종이로 출력해드리기', price: 200000, recurring: false, category: '개발', optional: true, mainPersonas: ['salon'] },
];

export const MODULES_RECURRING: Module[] = [
  { code: 'M8', name: '블로그 SEO 자동 발행', description: '사주 키워드 누적 콘텐츠', price: 300000, recurring: true, category: '유지보수', optional: true, mainPersonas: ['salon', 'influencer'] },
  { code: 'M9', name: '운영 대행 풀패키지', description: 'DM·후기·콘텐츠 일괄 대행', price: 500000, recurring: true, category: '유지보수', optional: true, mainPersonas: ['salon'] },
  { code: 'M10', name: '베이직 유지보수', description: '월 업데이트 + 카톡 응대(48h) + 작은 수정 무료', price: 30000, recurring: true, category: '유지보수', optional: true, mainPersonas: ['salon', 'influencer', 'app'] },
  { code: 'M11', name: '프리미엄 유지보수', description: '24h 응대 + AI 분석 30건/월 포함', price: 70000, recurring: true, category: '유지보수', optional: true, mainPersonas: ['salon', 'influencer', 'app'] },
];

export const ALL_MODULES = [...MODULES_ONETIME, ...MODULES_RECURRING];

export interface Preset {
  key: string;
  label: string;
  persona: Persona;
  description: string;
  oneTimeCodes: string[];      // CORE는 항상 포함, 추가 모듈만 명시
  recurringCode?: string;      // 추천 정기 모듈 1개
}

export const PRESETS: Preset[] = [
  {
    key: 'salon-starter',
    label: '컴맹 사주집 입문',
    persona: 'salon',
    description: '코어 + 브랜딩 + AI 100건 + 베이직 유지보수',
    oneTimeCodes: ['M1', 'M2'],
    recurringCode: 'M10',
  },
  {
    key: 'influencer',
    label: '인스타 인플루언서',
    persona: 'influencer',
    description: '코어 + 카드뉴스 자동화 + TTS + 베이직 유지보수',
    oneTimeCodes: ['M3', 'M6'],
    recurringCode: 'M10',
  },
  {
    key: 'salon-full',
    label: '풀세트 사주집',
    persona: 'salon',
    description: '코어 + 브랜딩 + 카드뉴스 + 챗봇 + PDF + 운영 대행',
    oneTimeCodes: ['M1', 'M3', 'M4', 'M7'],
    recurringCode: 'M9',
  },
  {
    key: 'app-builder',
    label: '사주 앱 창업자',
    persona: 'app',
    description: '코어 + 카드뉴스 + 챗봇 + 홈페이지 (커스텀 별도 협의)',
    oneTimeCodes: ['M3', 'M4', 'M5'],
    recurringCode: undefined,
  },
];

// ── 헬퍼 ────────────────────────────────────────────────
export function getModule(code: string): Module | undefined {
  if (code === 'C1') return CORE;
  return ALL_MODULES.find((m) => m.code === code);
}

export function calcOneTime(codes: string[]): number {
  return codes.reduce((sum, c) => sum + (getModule(c)?.price ?? 0), 0);
}

export function calcOneYearLTV(oneTimeCodes: string[], recurringCode?: string): number {
  const oneTime = CORE.price + calcOneTime(oneTimeCodes);
  const monthly = recurringCode ? (getModule(recurringCode)?.price ?? 0) : 0;
  return oneTime + monthly * 12;
}

export function presetSummary(preset: Preset) {
  const oneTime = CORE.price + calcOneTime(preset.oneTimeCodes);
  const monthly = preset.recurringCode ? (getModule(preset.recurringCode)?.price ?? 0) : 0;
  return {
    oneTime,
    monthly,
    yearLTV: oneTime + monthly * 12,
  };
}

// 견적 에디터에서 사용할 quote item 형태로 변환
export interface QuoteItemSeed {
  category: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  optional: boolean;
}

export function moduleToQuoteItem(m: Module): QuoteItemSeed {
  return {
    category: m.category,
    name: m.name,
    description: m.description,
    quantity: 1,
    unitPrice: m.price,
    optional: m.optional && m.code !== 'C1',
  };
}
```

- [ ] **Step 1.2: 타입체크**

Run: `npx tsc --noEmit`
Expected: 에러 없이 종료. 실패 시 표준 fix 후 재실행.

- [ ] **Step 1.3: spec 가격 시나리오 일치 검증 (수동)**

`presetSummary`가 spec 7번과 일치하는지 머릿속/계산기로 확인:
- 컴맹 사주집 입문: 49 + 7 + 5 = **61만 일회성 / 3만 월 / 97만 LTV**
- 풀세트 사주집: 49 + 7 + 35 + 35 + 20 = **146만 일회성 / 50만 월 / 746만 LTV**

수치가 어긋나면 lib 데이터를 spec 기준으로 수정.

- [ ] **Step 1.4: commit**

```bash
git add lib/saju-catalog.ts
git commit -m "feat(saju): 카탈로그 SSOT 모듈 — 코어 + 모듈 11종 + 프리셋 4종"
```

---

## Task 2: 사주 비즈니스 LP 페이지

**Files:**
- Create: `app/services/saju-business/page.tsx`

- [ ] **Step 2.1: LP 페이지 작성**

`app/services/saju-business/page.tsx` (Server Component, 카탈로그 import해서 렌더):

```tsx
import { Metadata } from 'next';
import Link from 'next/link';
import {
  CORE, MODULES_ONETIME, MODULES_RECURRING, PRESETS,
  PERSONA_LABEL, presetSummary,
} from '@/lib/saju-catalog';

export const metadata: Metadata = {
  title: '사주 비즈니스 카탈로그 | 쟁승메이드',
  description: '사주집·역술원·인스타 사주 인플루언서를 위한 AI 사주 솔루션. 49만원에 시작, 운영 락인까지 풀세트.',
};

const fmtKRW = (n: number) => `${n.toLocaleString()}원`;

export default function SajuBusinessPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen pb-20 print:bg-white print:text-black">
      {/* Hero */}
      <section className="px-6 lg:px-12 pt-28 pb-16 max-w-5xl mx-auto print:pt-8">
        <p className="text-sm text-violet-400 font-semibold mb-3 print:text-violet-700">FOR SAJU BUSINESS</p>
        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5">
          사주 운영을 위한 AI 솔루션 —<br />
          <span className="text-violet-400 print:text-violet-700">49만원에 시작, 운영 락인까지 풀세트</span>
        </h1>
        <p className="text-slate-300 text-lg max-w-3xl print:text-slate-700">
          7년차 백엔드 개발자가 직접 만든 검증된 만세력 + AI 분석 엔진.
          컴맹도 5영업일 안에 매출 시작. 모듈식 구조로 필요한 만큼만 추가하세요.
        </p>
        <div className="mt-8 flex gap-3 print:hidden">
          <Link href="/freelance?service=saju-business" className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold">상담 문의</Link>
          <button onClick={() => window.print()} className="px-6 py-3 border border-slate-600 hover:border-slate-400 rounded-xl font-semibold" suppressHydrationWarning>
            PDF로 저장
          </button>
        </div>
      </section>

      {/* 코어 */}
      <section className="px-6 lg:px-12 py-12 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">코어 패키지</h2>
        <div className="bg-slate-900 border border-violet-500/30 rounded-2xl p-8 print:bg-violet-50 print:border-violet-300">
          <div className="flex items-baseline justify-between gap-4 flex-wrap mb-3">
            <h3 className="text-xl font-bold">{CORE.name}</h3>
            <p className="text-3xl font-black text-violet-400 print:text-violet-700">{fmtKRW(CORE.price)}<span className="text-sm font-normal text-slate-400 print:text-slate-600 ml-1">VAT 포함</span></p>
          </div>
          <p className="text-slate-300 print:text-slate-700">{CORE.description}</p>
          <p className="text-slate-500 text-sm mt-4 print:text-slate-600">납기: 착수 후 5영업일</p>
        </div>
      </section>

      {/* 일회성 모듈 */}
      <section className="px-6 lg:px-12 py-12 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">일회성 모듈</h2>
        <div className="grid gap-3">
          {MODULES_ONETIME.map((m) => (
            <div key={m.code} className="flex items-baseline justify-between gap-4 border-b border-slate-800 pb-3 print:border-slate-300">
              <div>
                <p className="font-semibold">
                  <span className="text-violet-400 mr-2 print:text-violet-700">{m.code}</span>
                  {m.name}
                </p>
                <p className="text-slate-400 text-sm print:text-slate-600">{m.description}</p>
                <p className="text-slate-500 text-xs mt-1 print:text-slate-600">
                  추천: {m.mainPersonas.map((p) => PERSONA_LABEL[p]).join(' · ')}
                </p>
              </div>
              <p className="text-lg font-bold whitespace-nowrap">+{fmtKRW(m.price)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 정기형 모듈 */}
      <section className="px-6 lg:px-12 py-12 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">정기형 모듈 (월정액)</h2>
        <div className="grid gap-3">
          {MODULES_RECURRING.map((m) => (
            <div key={m.code} className="flex items-baseline justify-between gap-4 border-b border-slate-800 pb-3 print:border-slate-300">
              <div>
                <p className="font-semibold">
                  <span className="text-violet-400 mr-2 print:text-violet-700">{m.code}</span>
                  {m.name}
                </p>
                <p className="text-slate-400 text-sm print:text-slate-600">{m.description}</p>
              </div>
              <p className="text-lg font-bold whitespace-nowrap">{fmtKRW(m.price)}<span className="text-sm font-normal text-slate-400 print:text-slate-600">/월</span></p>
            </div>
          ))}
        </div>
      </section>

      {/* 시나리오 */}
      <section className="px-6 lg:px-12 py-12 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">대표 시나리오</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700 print:border-slate-400">
                <th className="py-3 pr-4 text-slate-400 print:text-slate-700">구성</th>
                <th className="py-3 pr-4 text-slate-400 print:text-slate-700">일회성</th>
                <th className="py-3 pr-4 text-slate-400 print:text-slate-700">월정액</th>
                <th className="py-3 text-slate-400 print:text-slate-700">1년 LTV</th>
              </tr>
            </thead>
            <tbody>
              {PRESETS.map((p) => {
                const s = presetSummary(p);
                return (
                  <tr key={p.key} className="border-b border-slate-800 print:border-slate-300">
                    <td className="py-3 pr-4">
                      <p className="font-semibold">{p.label}</p>
                      <p className="text-slate-500 text-xs print:text-slate-600">{p.description}</p>
                    </td>
                    <td className="py-3 pr-4 font-mono">{fmtKRW(s.oneTime)}</td>
                    <td className="py-3 pr-4 font-mono">{s.monthly ? fmtKRW(s.monthly) : '협의'}</td>
                    <td className="py-3 font-mono font-bold text-violet-400 print:text-violet-700">{fmtKRW(s.yearLTV)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 결제·약관 */}
      <section className="px-6 lg:px-12 py-12 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">결제·약관 표준</h2>
        <ul className="space-y-2 text-slate-300 print:text-slate-700">
          <li>• 결제 조건: 선금 50% (착수 시) / 잔금 50% (납품 완료 시)</li>
          <li>• 결제 수단: 계좌이체 + 카카오페이 송금 (자세한 안내는 <Link href="/payment-info" className="text-violet-400 underline print:text-violet-700">결제 안내</Link>)</li>
          <li>• 무상 AS: 납품 후 30일</li>
          <li>• 무료 수정: 디자인 2회 / 기능 1회</li>
          <li>• 저작권: 프로그램 저작권 쟁승메이드 보유, 고객은 본인 사업장 1곳에 한해 영구 사용권 (재배포·양도 불가)</li>
          <li>• AI API 사용료(Gemini 월 1~2만)는 고객 부담</li>
          <li>• 1건 100만 이상은 PDF 계약서 필수</li>
        </ul>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-12 py-12 max-w-5xl mx-auto print:hidden">
        <div className="bg-gradient-to-br from-violet-900/40 to-slate-900 border border-violet-500/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">상담 문의 + 견적서 발급</h2>
          <p className="text-slate-300 mb-6">5분 안에 도입 가능 여부 + 정확한 견적을 드립니다.</p>
          <Link href="/freelance?service=saju-business" className="inline-block px-8 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold">상담 신청</Link>
        </div>
      </section>

      {/* print 전용 푸터 */}
      <footer className="hidden print:block px-6 py-8 max-w-5xl mx-auto text-slate-700 text-sm border-t border-slate-300">
        <p>쟁승메이드 (JaengseungMade) — 박재오</p>
        <p>이메일: bgg8988@gmail.com · 전화: 010-3907-1392</p>
        <p>문서 발행일: 2026-04-27</p>
      </footer>
    </div>
  );
}
```

**주의:** 이 페이지는 `<button onClick={() => window.print()}>`을 사용하므로 Server Component면 빌드 에러. 파일 최상단에 `'use client';`를 추가하거나, 인쇄 버튼만 작은 Client Component로 분리해야 한다. 가장 간단한 방향은 파일 최상단에 `'use client';` 추가. 단, `metadata` export는 Client Component에서 불가하므로 page는 그대로 두고 인쇄 버튼만 따로 분리해야 한다. **올바른 구조**:

상단 코드를 다음으로 수정 — `metadata` 유지 + 별도 `PrintButton` 컴포넌트 사용:

```tsx
// page.tsx 상단은 위와 동일 (Server Component)
import PrintButton from './PrintButton';
// ...
// CTA 영역의 button을 다음으로 교체:
<PrintButton className="px-6 py-3 border border-slate-600 hover:border-slate-400 rounded-xl font-semibold" />
```

- [ ] **Step 2.2: PrintButton 클라이언트 컴포넌트 추가**

`app/services/saju-business/PrintButton.tsx`:
```tsx
'use client';
export default function PrintButton({ className }: { className?: string }) {
  return (
    <button onClick={() => window.print()} className={className}>
      PDF로 저장
    </button>
  );
}
```

그리고 page.tsx의 `<button onClick={() => window.print()}>...` 부분을 `<PrintButton className="..." />`로 교체.

- [ ] **Step 2.3: 빌드 확인**

Run: `npm run build`
Expected: 빌드 성공, `/services/saju-business` 라우트가 routes 목록에 표시됨.

- [ ] **Step 2.4: dev 서버 시각 검증**

Run: `npm run dev`
브라우저에서 `http://localhost:3000/services/saju-business` 열어서 확인:
- 코어 49만, 모듈 11종, 시나리오 4종 정상 렌더
- 시나리오 표의 "풀세트 사주집" LTV가 **746만원**으로 나오는지 확인 (spec 일치)
- "PDF로 저장" 버튼 클릭 → 브라우저 인쇄 대화상자 → "PDF로 저장" → 다크 배경 없이 흰 배경에 모든 섹션 잘 출력되는지 (CTA 섹션은 제외되어야 함)

- [ ] **Step 2.5: commit**

```bash
git add app/services/saju-business/
git commit -m "feat(saju): 비즈니스 카탈로그 LP + 인쇄/PDF 모드"
```

---

## Task 3: 견적 에디터 — 카탈로그에서 추가 모달

**Files:**
- Create: `app/admin/quotes/[id]/CatalogPicker.tsx`
- Modify: `app/admin/quotes/[id]/page.tsx`

- [ ] **Step 3.1: CatalogPicker 컴포넌트 작성**

`app/admin/quotes/[id]/CatalogPicker.tsx`:
```tsx
'use client';
import { useState } from 'react';
import {
  CORE, MODULES_ONETIME, MODULES_RECURRING, ALL_MODULES,
  moduleToQuoteItem, type QuoteItemSeed, type Module,
} from '@/lib/saju-catalog';

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (items: QuoteItemSeed[]) => void;
}

export default function CatalogPicker({ open, onClose, onApply }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set([CORE.code]));

  if (!open) return null;

  const toggle = (code: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const apply = () => {
    const codes = Array.from(selected);
    const all: Module[] = [CORE, ...ALL_MODULES];
    const items = codes
      .map((c) => all.find((m) => m.code === c))
      .filter((m): m is Module => Boolean(m))
      .map(moduleToQuoteItem);
    onApply(items);
    onClose();
  };

  const Section = ({ title, list }: { title: string; list: Module[] }) => (
    <div>
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 mt-4">{title}</h3>
      <div className="space-y-1">
        {list.map((m) => (
          <label key={m.code} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors">
            <input type="checkbox" checked={selected.has(m.code)} onChange={() => toggle(m.code)} className="mt-1" />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">
                <span className="text-violet-400 mr-2">{m.code}</span>
                {m.name}
              </p>
              <p className="text-slate-500 text-xs">{m.description}</p>
            </div>
            <p className="text-slate-300 text-sm font-mono whitespace-nowrap">
              {m.recurring ? `${m.price.toLocaleString()}원/월` : `+${m.price.toLocaleString()}원`}
            </p>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white text-lg font-bold">카탈로그에서 항목 추가</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <p className="text-slate-500 text-xs mb-2">선택한 항목을 견적서 항목으로 추가합니다. 정기 모듈은 향후관리 탭이 아닌 견적 항목으로 들어갑니다.</p>
        <Section title="코어" list={[CORE]} />
        <Section title="일회성 모듈" list={MODULES_ONETIME} />
        <Section title="정기형 모듈" list={MODULES_RECURRING} />
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white">취소</button>
          <button onClick={apply} className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-semibold">
            선택 항목 추가 ({selected.size})
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3.2: page.tsx에 CatalogPicker 통합**

`app/admin/quotes/[id]/page.tsx` 수정:
1. 파일 상단 import 추가:
   ```tsx
   import CatalogPicker from './CatalogPicker';
   ```
2. 컴포넌트 함수 안 상태 추가 (다른 useState 옆):
   ```tsx
   const [catalogOpen, setCatalogOpen] = useState(false);
   ```
3. `function addItem()` 정의 바로 아래에 헬퍼 추가:
   ```tsx
   function addItemsFromCatalog(seeds: { category: string; name: string; description: string; quantity: number; unitPrice: number; optional: boolean }[]) {
     setField('items', [
       ...form.items,
       ...seeds.map((s) => ({ id: newId(), ...s })),
     ]);
   }
   ```
4. 견적항목 탭(JSX 안의 `{tab === '견적항목' && (...)}` 블록) 상단에 "+ 항목 추가" 버튼 옆에 카탈로그 버튼 추가. 견적항목 탭 헤더가 다음과 비슷하게 생겼다면:
   ```tsx
   <button onClick={addItem} className={addBtn}>+ 항목 추가</button>
   ```
   다음으로 교체:
   ```tsx
   <div className="flex gap-2">
     <button onClick={() => setCatalogOpen(true)} className="text-xs text-violet-400 hover:text-violet-300 px-3 py-1.5 rounded-lg border border-violet-500/30 hover:border-violet-400/50 transition-all">
       📚 카탈로그에서 추가
     </button>
     <button onClick={addItem} className={addBtn}>+ 빈 항목 추가</button>
   </div>
   ```
5. 컴포넌트 return 의 가장 바깥쪽 `<div>` 안 마지막에 모달 추가:
   ```tsx
   <CatalogPicker
     open={catalogOpen}
     onClose={() => setCatalogOpen(false)}
     onApply={addItemsFromCatalog}
   />
   ```

**주의**: 견적항목 탭의 정확한 JSX 구조는 page.tsx를 직접 열어 확인 후 수정. "+ 항목 추가" 버튼이 위 예시와 다르게 생겼다면 그 자리에 카탈로그 버튼을 함께 배치.

- [ ] **Step 3.3: 시각 검증**

dev 서버 띄운 상태에서:
1. `/admin/login`으로 로그인
2. `/admin/quotes` → 새 견적서 작성
3. 견적항목 탭 진입
4. "📚 카탈로그에서 추가" 클릭 → 모달 열림
5. 코어 + M3 + M6 체크 → "선택 항목 추가 (3)" 클릭
6. items에 3건이 추가되는지 + 합계가 49+35+25 = 109만원으로 표시되는지 확인

- [ ] **Step 3.4: commit**

```bash
git add app/admin/quotes/\[id\]/
git commit -m "feat(quotes): 견적 에디터에 카탈로그 모달 — 모듈 다중 선택 추가"
```

---

## Task 4: 견적 에디터 — 프리셋 적용 드롭다운

**Files:**
- Create: `app/admin/quotes/[id]/PresetApply.tsx`
- Modify: `app/admin/quotes/[id]/page.tsx`

- [ ] **Step 4.1: PresetApply 컴포넌트 작성**

`app/admin/quotes/[id]/PresetApply.tsx`:
```tsx
'use client';
import { useState } from 'react';
import {
  CORE, ALL_MODULES, PRESETS, moduleToQuoteItem,
  type Preset, type QuoteItemSeed,
} from '@/lib/saju-catalog';

interface MaintenanceSeed {
  name: string;
  period: string;
  monthlyFee: number;
  includes: string[];
  recommended: boolean;
}

interface Props {
  onApply: (data: { items: QuoteItemSeed[]; maintenance: MaintenanceSeed[]; title: string }) => void;
}

export default function PresetApply({ onApply }: Props) {
  const [open, setOpen] = useState(false);

  const apply = (preset: Preset) => {
    if (!confirm(`프리셋 "${preset.label}"을(를) 적용합니다.\n현재 견적 항목과 향후관리는 덮어써집니다. 진행할까요?`)) return;

    const items: QuoteItemSeed[] = [
      moduleToQuoteItem(CORE),
      ...preset.oneTimeCodes
        .map((c) => ALL_MODULES.find((m) => m.code === c))
        .filter((m): m is NonNullable<typeof m> => Boolean(m))
        .map(moduleToQuoteItem),
    ];

    const maintenance: MaintenanceSeed[] = preset.recurringCode
      ? (() => {
          const m = ALL_MODULES.find((x) => x.code === preset.recurringCode);
          if (!m) return [];
          return [{
            name: m.name,
            period: '월간',
            monthlyFee: m.price,
            includes: [m.description],
            recommended: true,
          }];
        })()
      : [];

    onApply({
      items,
      maintenance,
      title: `사주 비즈니스 ${preset.label} 패키지`,
    });
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-violet-400 hover:text-violet-300 px-3 py-1.5 rounded-lg border border-violet-500/30 hover:border-violet-400/50 transition-all"
      >
        ⚡ 프리셋 적용
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-20 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-2">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => apply(p)}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <p className="text-white text-sm font-semibold">{p.label}</p>
              <p className="text-slate-500 text-xs mt-0.5">{p.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4.2: page.tsx에 PresetApply 통합**

1. import 추가:
   ```tsx
   import PresetApply from './PresetApply';
   ```
2. 헬퍼 함수 추가 (addItemsFromCatalog 옆):
   ```tsx
   function applyPreset(data: { items: QuoteItemSeed[]; maintenance: MaintenanceSeed[]; title: string }) {
     setForm((f) => ({
       ...f,
       title: data.title,
       items: data.items.map((s) => ({ id: newId(), ...s })),
       maintenance: data.maintenance.map((s) => ({ id: newId(), ...s })),
     }));
   }
   ```
   타입 import도 추가:
   ```tsx
   import type { QuoteItemSeed } from '@/lib/saju-catalog';
   interface MaintenanceSeed { name: string; period: string; monthlyFee: number; includes: string[]; recommended: boolean; }
   ```
3. 상단 바(`<div className="sticky top-0 ...">` 안 오른쪽 버튼 묶음)에 "프리셋 적용" 추가 — `저장` 버튼 왼쪽에:
   ```tsx
   <PresetApply onApply={applyPreset} />
   ```

- [ ] **Step 4.3: 시각 검증**

1. 새 견적서 작성
2. 상단 "⚡ 프리셋 적용" 클릭 → 4개 프리셋 드롭다운
3. "풀세트 사주집" 선택 → 확인 → items 5개(코어 + M1·M3·M4·M7), maintenance 1개(M9 운영 대행) 자동 채워지는지 확인
4. 합계가 146만원으로 표시되는지

- [ ] **Step 4.4: commit**

```bash
git add app/admin/quotes/\[id\]/
git commit -m "feat(quotes): 견적 에디터에 프리셋 4종 원클릭 적용"
```

---

## Task 5: 결제 안내 페이지 (A안)

**Files:**
- Create: `app/payment-info/page.tsx`

- [ ] **Step 5.1: page.tsx 작성**

`app/payment-info/page.tsx`:
```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '결제 안내 | 쟁승메이드',
  description: '계좌이체와 카카오페이 송금으로 결제하실 수 있습니다.',
};

export default function PaymentInfoPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen pb-20">
      <section className="px-6 lg:px-12 pt-28 pb-12 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">결제 안내</h1>
        <p className="text-slate-400">계좌이체 또는 카카오페이 송금으로 결제하실 수 있습니다.</p>
      </section>

      <section className="px-6 lg:px-12 max-w-3xl mx-auto space-y-4">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">1. 계좌이체</h2>
          <dl className="grid grid-cols-[100px_1fr] gap-y-2 text-slate-300">
            <dt className="text-slate-500">은행</dt><dd>(견적서 발급 시 별도 안내)</dd>
            <dt className="text-slate-500">계좌번호</dt><dd>(견적서 발급 시 별도 안내)</dd>
            <dt className="text-slate-500">예금주</dt><dd>박재오</dd>
          </dl>
          <p className="text-slate-500 text-xs mt-4">입금 시 입금자명에 견적서명 또는 회사명 기입 부탁드립니다.</p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">2. 카카오페이 송금</h2>
          <p className="text-slate-300">카카오톡 채팅에서 박재오(010-3907-1392) 검색 후 송금</p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">3. 결제 조건</h2>
          <ul className="space-y-1.5 text-slate-300">
            <li>• 선금 50%: 작업 착수 시</li>
            <li>• 잔금 50%: 납품 완료 시</li>
            <li>• 100만원 이상: PDF 계약서 작성 후 결제</li>
            <li>• 환불: 착수 전 100% / 착수 후 진행률 차감 / 납품 후 환불 불가</li>
          </ul>
        </div>

        <div className="bg-violet-900/20 border border-violet-500/40 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-2">세금계산서 발행</h2>
          <p className="text-slate-300">사업자 등록 고객님께는 입금 확인 후 영업일 기준 3일 안에 발행해드립니다. 사업자등록증 사본을 bgg8988@gmail.com 으로 보내주세요.</p>
        </div>
      </section>
    </div>
  );
}
```

**주의:** 계좌번호는 깃 저장소에 박지 않는다. "견적서 발급 시 별도 안내"로 두고, 실제 계좌번호는 견적서 notes 또는 이메일로만 전달.

- [ ] **Step 5.2: 시각 검증**

`http://localhost:3000/payment-info` 열어 디자인·레이아웃 확인.

- [ ] **Step 5.3: commit**

```bash
git add app/payment-info/
git commit -m "feat(payment): 결제 안내 페이지 — 계좌이체 + 카카오페이"
```

---

## Task 6: 견적서 notes 표준 문구에 결제 안내 링크 삽입

**Files:**
- Modify: `scripts/insert-saju-quote.mjs` (이미 존재하는 등록 스크립트)

- [ ] **Step 6.1: notes 표준 문구에 결제 안내 페이지 링크 추가**

`scripts/insert-saju-quote.mjs`의 `notes` 상수 안 `[결제 방법]` 블록을 다음으로 교체:

```js
[결제 방법]
- 계약금 50% 입금 → 작업 시작
- 잔금 50% → 사용 가이드 모두 전달한 다음 입금
- 결제 수단 안내: https://jaengseung-made.com/payment-info
- 100만원 이상 결제 시 PDF 계약서 작성 후 진행
```

- [ ] **Step 6.2: commit**

```bash
git add scripts/insert-saju-quote.mjs
git commit -m "chore(quotes): notes 표준 문구에 결제 안내 페이지 링크"
```

---

## Task 7: TopNav 메뉴 노출 (CEO 결정 — 옵션)

**주의:** 현재 사이트 메시지가 음악 팩 중심으로 정렬되어 있어, 사주 비즈니스 메뉴를 TopNav에 직접 박으면 메시지가 분산될 수 있다. **1차 영업은 직링크(`/services/saju-business`)를 카톡·DM으로 보내는 방식으로 진행**하고, 본 task는 매출 검증 후(예: 사주 카탈로그로 수주 2건 이상 발생) 실행한다.

매출 검증되었다고 판단될 때만 다음 단계 진행:

**Files:**
- Modify: `app/components/TopNav.tsx`

- [ ] **Step 7.1: TopNav LINKS 배열에 사주 비즈니스 추가**

```tsx
const LINKS = [
  { href: '/', label: '홈' },
  { href: '/services/music/samples', label: '샘플' },
  { href: '/services/music', label: '팩 상세' },
  { href: '/services/saju-business', label: '사주 비즈니스' },
  { href: '/studio', label: '스튜디오' },
];
```

- [ ] **Step 7.2: 모바일 오버레이도 동일 LINKS 사용 중인지 확인**

이미 동일 배열을 매핑하므로 별도 수정 불필요.

- [ ] **Step 7.3: 시각 검증**

데스크톱·모바일 양쪽에서 메뉴가 보이고 활성 표시(border-bottom)가 정상 작동하는지.

- [ ] **Step 7.4: commit**

```bash
git add app/components/TopNav.tsx
git commit -m "feat(nav): 사주 비즈니스 메뉴 노출"
```

---

## Self-Review 체크리스트 (이 plan 작성 후 자체 점검 결과)

1. **Spec 커버리지**:
   - spec §11 LP `/services/saju-business` → Task 2 ✅
   - spec §11 모듈 프리셋 4종 → Task 4 ✅
   - spec §11 모듈 선택 UI → Task 3 ✅
   - spec §11 카탈로그 PDF → Task 2 (인쇄 모드 통합) ✅
   - spec §11 결제 안내 페이지 → Task 5 + Task 6 ✅
   - spec §8 결제 표준(A안 → B안 트리거) → Task 5 (A안 안내 명시), B안 전환은 별도 spec으로 미루는 것이 spec §12 비범위에 명시됨

2. **Placeholder scan**: TBD/TODO 없음. 결제 안내 페이지의 계좌번호는 의도적으로 "견적서 발급 시 별도 안내"로 둠 (보안 사유, plan에 이유 명시).

3. **Type 일관성**:
   - `QuoteItemSeed`는 lib에서 export하고 page.tsx에서 import — 일관 ✅
   - `Module.code`는 string ('C1', 'M1'…) 통일 ✅
   - `getModule('C1')` 호출이 CORE를 반환하도록 헬퍼에서 조건 분기 ✅
   - `MaintenanceSeed`는 page.tsx 내부 인터페이스로 정의, PresetApply에서도 동일 형태 — Step 4.2에 명시 ✅

4. **Scope**: 단일 plan으로 적절. PG B안 도입(포트원 SDK 활용)은 별도 spec/plan으로 분리.

---

## 마무리 — 1차 영업 흐름

이 plan 완료 후 실제 영업은 다음 흐름:

```
DM·카톡으로 /services/saju-business 직링크 발송
   ↓
고객 관심 → /freelance?service=saju-business 문의
   ↓
HR(/hr) 응대 → /admin/quotes 새 견적서 → 프리셋 1클릭
   ↓
고객용 링크 발송 + /payment-info 안내
   ↓
계약금 입금 → 납품
```

3개월 누적 월 매출 100만 도달 시 → 별도 spec으로 PG B안(포트원 통합) 도입 plan 작성.
