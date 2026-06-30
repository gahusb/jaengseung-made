# 쟁승메이드 라이트 고craft 재설계 — 설계 문서

> 작성 2026-06-30 · brainstorming 산출물 (승인 완료)
> 대상: `app/page.tsx`(홈) · `app/outsourcing/page.tsx` · `app/products/page.tsx` + 공통 시스템

---

## 1. 배경 / 문제 정의

최근 "Deep Field" 다크 캔버스 재스킨이 검증 없이 얹히면서 다음 문제가 발생했다.

1. **문서 ↔ 코드 충돌** — `CLAUDE.md` 가드레일(라이트·gradient/blur/보라 금지·`--jsm-*`)을 실제 메인/외주 코드가 정면으로 위반(다크 배경 + WebGL 파티클 + radial gradient + 보라 팔레트).
2. **반복된 사후 패치** — 최근 커밋 2개가 전부 "히어로 텍스트 대비 복구" 류 → 다크 파티클 히어로가 픽셀 단위 튜닝에 실패.
3. **톤 단절** — 홈·외주는 다크, `/products`는 라이트. 첫 클릭에서 톤이 깨진다.
4. **가짜 포트폴리오** — 쇼케이스 8슬롯이 실작업 이미지가 아닌 그래디언트 타일(보라 포함). "AI가 뽑은 가짜" 인상.
5. **사이트 정체성 누락** — CLAUDE.md가 규정한 "외주+완성SW 2축" 소개가 홈에 없고 바로 쇼케이스로 점프.
6. **죽은 CSS** — `kx-*`(blur), `gradient-text`(보라), `kx-orb/glow`, `--jsm-dark-*`, `--kx-*` 잔존.

### 타깃·포지셔닝 (의사결정 근거)
- 고객: 크몽·숨고·위시캣 트래픽 = 다수가 비개발자 소상공인/실무자.
- 무기: "실서비스 15+ 직접 운영"이라는 **운영 실증** (경력 어필 금지 — `feedback_copy_no_career`).
- 결론: 다크 스펙터클이 아니라 **라이트·명료 + 진짜 목업**이 신뢰·전환에 유리.

---

## 2. 확정된 방향 (승인됨)

| 결정 | 값 |
|------|-----|
| 비주얼 방향 | 라이트 기반 고(高)craft + 강조면 1곳 |
| 강조면 위치 | **히어로의 코드 제품 목업** (운영 실증을 이미지로) |
| 소재 확보 | **코드로 디자인한 UI 목업** (실데이터 0, `--jsm-*` 라이트/navy) |
| 범위 | 홈 + 외주 + 제품 3면 통일 + 공통 시스템 정리 |
| 가드레일 | 라이트 복귀 = **CLAUDE.md 컴플라이언스 회복** (개정 불필요, 다크 토큰 언급만 정리) |

---

## 3. 디자인 시스템 기반 (3면 공통)

### 색 (─ `--jsm-*` 만)
```
bg #f8fafc · surface #fff · surface-alt #f1f5f9
ink #0f172a · ink-soft #475569 · ink-faint #94a3b8 · line #e2e8f0
navy #0b1f3a (푸터 + CTA 1곳, 사이트 유일 다크면)
accent #1d4ed8 (유일 포인트) · accent-hover #1e40af · accent-soft #dbeafe
금지: 보라/violet · gradient · blur (navy CTA 밴드도 평면 navy로 — radial 광원 제거)
```

### 타이포 (Pretendard)
| 역할 | 스펙 |
|------|------|
| 디스플레이 h1 | `clamp(2.4rem, 7vw, 4rem)` · w800 · `-0.03em` · `break-keep` · lh 1.08 |
| 섹션 h2 | `clamp(1.7rem, 4vw, 2.4rem)` · w700 · `-0.02em` |
| 모노 라벨(eyebrow) | 11px · UPPER · `0.2em` · accent — 편집 디자인 시그니처 |
| 본문 | 16–18px · ink-soft · `-0.01em` · leading-relaxed |

### 레이아웃·여백·리듬
- 컨테이너 `max-w-6xl`(1152) · 패딩 `px-6 lg:px-8`. **3면 동일** (현재 제품은 max-w-5xl로 어긋남 → 통일).
- **여백 변주**: 현재 전부 `py-24/32` 단조 → 히어로 큰 호흡, 이후 섹션 `py-20 / py-24 / py-28`로 리듬.
- **교차 배경**: `surface`(#fff) ↔ `surface-alt`(#f1f5f9) 교차로 섹션 구분. `border-t` 단독 의존 탈피.
- 카드: `rounded-2xl` · `border line` · `shadow-sm` · hover `translateY(-2px)` + border accent.

### 모션
- `ScrollReveal`(fade+rise) 유지. `prefers-reduced-motion` 가드(기존 `.reveal` CSS 활용). 절제.
- `CountUp` 유지 (운영 실증 스탯).

---

## 4. 핵심 신규 컴포넌트 — `MockWindow` 목업 시스템

파티클(HeroField)을 대체하는 craft의 핵심. **재사용 가능한 라이트 UI 목업.**

```
app/components/mock/
  MockWindow.tsx     브라우저/앱 크롬 프레임 (● ● ● 신호등 + 타이틀바 + 본문 슬롯)
  screens/
    DashboardMock    스탯 카드 3 + 막대/라인 차트 (주식 리포트 톤)
    FeedMock         텔레그램풍 메시지 피드 (봇 알림)
    MatchMock        매물/항목 카드 + 매칭률 배지 (부동산 청약)
    CommerceMock     상품 그리드 + 장바구니/가격
    SiteMock         기업 사이트 히어로 와이어 (corporate/portfolio/editorial)
    BookingMock      예약 캘린더/슬롯 (로컬 매장)
```
- 전부 SVG/CSS, `--jsm-*` 라이트 + navy 헤더, accent 포인트. **실데이터 없음.**
- 결정적 렌더(난수 시드 불필요 — 정적 마크업). SSR-safe(클라이언트 캔버스 의존 제거 → 서버 컴포넌트로 렌더 가능).
- 용도: **히어로 1개**(대표 = DashboardMock/FeedMock) + **쇼케이스 N개**.

---

## 5. 페이지별 설계

### 5.1 홈 `/`
섹션 순서 (배경 교차 표기):
1. **HERO** (surface) — 비대칭 2단: 좌 텍스트(eyebrow·h1·sub·CTA 2) / 우 `MockWindow`(대표 목업). 하단 **신뢰 스트립**(15+ 실서비스 · 24/7 · 원스톱).
2. **2축 소개** (surface-alt) — 신규. `01 OUTSOURCING` / `02 SOFTWARE` 2카드. 사이트 정체성 복원.
3. **SHOWCASE** (surface) — `ShowcaseGrid` 재작성: 그래디언트 타일 → `MockWindow` 그리드. 홈 6장.
4. **운영 실증** (surface-alt) — 3종 카드 + 스탯(CountUp 15+/24·7/원스톱). 라이트 카드 통일.
5. **PROCESS** (surface) — 4단계 + 가로 연결선.
6. **완성 SW** (surface-alt) — featured 3종(DB, `getListedProducts`). 0개면 coming-soon 폴백(라이트).
7. **CTA 밴드** (navy) — 사이트 유일 다크면. 평면 navy(radial gradient 제거). "프로젝트, 이야기부터".

삭제: `HeroField` 사용, 좌측 스크림/비네트, `-mt-16` 다크 풀블리드 트릭(라이트라 불필요).

### 5.2 외주 `/outsourcing` — 다크→라이트 전환 (구조 유지)
```
HERO(라이트, 소형 MockWindow 1개) → 제공 분야 6 → 운영 실사례 6(라이트 카드)
→ SHOWCASE 풀그리드 8(MockWindow) → PROCESS 6단계 → FAQ(아코디언) → 의뢰 폼
```
- 의뢰 폼: 라이트 스킨. `.jsm-dark-form` placeholder 규칙 제거/라이트화. `OutsourcingRequestForm` 입력 가독성 복구.
- 앵커(`#showcase`/`#portfolio`/`#process`/`#contact`) 유지.

### 5.3 제품 `/products` — 이미 라이트, craft 격상
```
HERO → 카탈로그(2열 카드) → 구매방식 3단계 → CTA
```
- `max-w-5xl` → `max-w-6xl`, 타입 스케일·여백을 홈과 동일 언어로 정렬.
- 카드 hover·라운드·그림자를 공통 카드 스펙에 맞춤.

---

## 6. 공통 셸

- **TopNav** — "다크 인지형" 라우트 분기 제거 → 단일 라이트 네비(흰 배경 + 하단 line, 스크롤 시 미세 shadow) + 우측 `프로젝트 문의` CTA. (구현 시 현 코드 확인 후 최소 수정.)
- **Footer** — navy 유지. 사이트 유일 다크면(CTA 밴드와 함께).

---

## 7. 정리·마이그레이션

- `app/globals.css`:
  - 제거: `--jsm-dark-*` 토큰, `--kx-*` 매핑, `.kx-*`(glass/orb/glow/folder/...), `.gradient-text`(보라), `.kx-gradient-text`, `.jsm-dark-form`, `.df-scroll-dot`(파티클 전용).
  - 유지: `--jsm-*` 라이트, `.reveal*`, `.marquee*`(사용처 확인 후), 스크롤바, `.scrollbar-hide`.
- `lib/showcase.ts`: `palette/accent` 그래디언트 스펙 → **목업 타입 스펙**(`mock: 'dashboard'|'commerce'|...`)으로 교체. 보라 4슬롯 제거/치환.
- `app/components/deepfield/`:
  - `ShowcaseCard.tsx` → `MockWindow` 기반으로 재작성(또는 `app/components/mock/`로 이전).
  - `ShowcaseGrid.tsx` 유지(레이아웃 로직) — 카드만 교체.
  - `HeroField.tsx`·`useFieldMode.ts` — 홈/외주에서 import 제거. 파일은 보존만(미사용). three 의존 트리셰이킹 확인.
- `CLAUDE.md`: 디자인 시스템 섹션에서 다크 토큰 언급 정리(가드레일 본문은 이미 라이트 → 변경 불필요).

---

## 8. 비목표 (YAGNI)
- 다크 모드 토글/테마 시스템 (불필요).
- 실제 스크린샷 수집·마스킹 파이프라인 (코드 목업으로 대체).
- admin/mypage/legal 등 비공개·내부 페이지 재설계 (이번 범위 밖 — 이미 라이트).
- 카피 전면 재작성 (기존 카피 유지, 구조·톤만 변경. 단 경력 어필 카피는 금지 유지).

---

## 9. 검증 기준
- [ ] 3면 모두 라이트 `--jsm-*`만 사용, 다크 토큰/보라/blur/임의 색 0건 (grep).
- [ ] 홈→외주→제품 클릭 시 톤 단절 없음.
- [ ] 쇼케이스가 코드 목업(실화면 느낌)으로 렌더, 그래디언트 타일 0건.
- [ ] 홈에 "2축 소개" 섹션 존재.
- [ ] 의뢰 폼 입력 텍스트·placeholder 가독성 정상(라이트).
- [ ] `npm run build` 성공 + `npm test`(lib 단위) 통과.
- [ ] 죽은 CSS(`kx-*`/`gradient-text` 등) 제거 확인.
- [ ] `prefers-reduced-motion` 시 모션 정지.
