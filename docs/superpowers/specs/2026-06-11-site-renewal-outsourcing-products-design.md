# 쟁승메이드 사이트 리뉴얼 — 외주 의뢰 + 완성 소프트웨어 판매 중심 재구성

- **작성일**: 2026-06-11
- **상태**: CEO 승인 완료
- **목표**: 사이트 정체성을 "외주 개발 의뢰 수주 + 완성 소프트웨어 판매" 2축으로 재정립.
  전문 B2B 에이전시 수준의 UI/UX 풀 리디자인, 외주 의뢰 플로우 고도화(고객 포털 포함),
  NAS 기반 결제 후 다운로드 구조의 오류 제거.

---

## 0. 확정된 핵심 결정 (CEO)

| 항목 | 결정 |
|------|------|
| 결제 | **계좌이체 중심**으로 정리. PG(PortOne)는 코드만 보존, 유료라 추후 연결 |
| 기존 서비스 (사주·음악 팩·로또·설문/gyeol·웹사이트 샘플 등) | **숨김** — 관리자만 토글·접근 가능 |
| 외주 플로우 | **고객 포털까지** — 상태 추적 + 견적 열람/수락/거절 |
| 디자인 | **풀 리디자인** — B2B 개발 에이전시 톤 (Pretendard, slate+딥블루) |
| 제품 판매 | **범용 제품 시스템** — 음악 팩 전용 pack 인프라를 일반 제품으로 확장 |

## 1. 아키텍처 결정 (대안 비교 결과)

### 1-1. 외주 의뢰 데이터 모델 — `contact_requests` 확장 (채택)
- 기존 테이블에 상태 머신 + `public_token` 컬럼 추가, `quotes.contact_request_id` FK로 연결.
- 대안(projects 테이블 신설)은 이중 마이그레이션·전면 재작성 부담으로 기각.
- **이유**: NAS self-host 전환 진행 중(클라우드/셀프호스트 양쪽 마이그레이션 필요) → 변경 폭 최소가 안전.

### 1-2. 제품 파일 시스템 — `products` 확장 + `pack_files.product_id` 연결 (채택)
- `products`에 설명·`pay_method`·`is_hidden`(또는 is_active 재활용)·상세 콘텐츠 컬럼 추가.
- `pack_files`에 `product_id` FK 추가, 기존 음악 팩 파일은 음악 제품에 연결.
- 대안(신규 product_files 테이블)은 web-backend(packs-lab) 수정이 필요해 기각.
- **이유**: DSM 링크 발급·HMAC·admin 업로드 인프라(web-backend) **무수정** 재사용.

### 1-3. 구매 식별 — `orders` 테이블 단일 소스 (채택)
- 현재 `contact_requests.service` 문자열 파싱("구매 신청: AI 음악 마스터 팩 · 프로") 의존 → 제거.
- 모든 구매는 `orders(product_id, status, method)` 기준. 기존 구매자는 이관 스크립트로 orders 생성.

## 2. 정보 구조 (IA)

```
/                    메인 — Hero(외주+소프트웨어 2축), 서비스 소개, 개발 프로세스,
                     포트폴리오 하이라이트, 제품 진열, 신뢰 요소(7년차 경력·실적), CTA
/outsourcing         외주 의뢰 — 포트폴리오, 진행 프로세스 안내, 단계형 의뢰 폼
/products            완성 소프트웨어 카탈로그 (is_active 제품만)
/products/[id]       제품 상세 + 계좌이체 구매
/track/[token]       비회원 의뢰 상태 추적 (이메일 링크로 접근)
/login               리디자인 (Supabase Auth 유지: 이메일+Google OAuth)
/mypage              리디자인 — 탭: 프로필 · 내 의뢰 · 내 제품/다운로드 · 주문 내역
/quote/[token]       공개 견적서 (유지, 수락/거절 동기화 보강)
/legal/*             유지 (톤만 리디자인)
/admin/*             주문 관리(신설) + 제품 관리(packs 일반화) + 의뢰·견적 통합 뷰 + 숨김 서비스 토글
```

### 숨김 처리 대상
`/work/saju*`, `/music/*`, `/gyeol`, `/packages`, 로또 관련 노출 전부.
- `service_settings` 토글 기반: 비활성 시 일반 사용자에게 404(notFound), **admin 세션(admin_token 쿠키)이면 접근 허용**.
- 데이터(saju_records, 구독 등)는 보존 — 토글 재활성 시 복귀.
- 기존 `/work/freelance` → `/outsourcing` redirect 추가 (next.config redirects).

### 외주로 통합
- 웹사이트 제작(`/work/website`)은 외주 개발의 한 유형으로 `/outsourcing`에 통합.
  샘플 포트폴리오(`/work/website/samples/*`)는 포트폴리오 자료로 재사용 (숨김 아님).

## 3. 디자인 시스템 (풀 리디자인)

- **레이아웃**: 사이드바 대시보드형 → **상단 네비 + 풋터의 기업 사이트형**. 모바일은 햄버거 드로어.
- **타이포**: Jua 제거 → **Pretendard** (next/font local 또는 CDN).
- **컬러**: slate 뉴트럴 베이스 + 딥블루 포인트 1색. 카드/섹션/버튼/뱃지 공통 컴포넌트 정비.
- **품질 가드**: 구현 시 designer·soft-skill 스킬 적용 — generic AI 패턴(과한 그래디언트, 이모지 남발, 보라색 남용) 차단. 이미지 없이 타이포·여백·SVG로 완성도.
- admin 영역도 동일 토큰 적용하되 기능 우선의 밀도 높은 레이아웃.

## 4. 제품 구매 → 다운로드 흐름

```
제품 상세(/products/[id]) → [구매하기] → 로그인 확인(미로그인 → /login?next=)
→ 계좌이체 신청 모달 (케이뱅크 100-116-337157 박재오 안내, 약관 동의)
→ orders 생성 (product_id, amount, status='pending', metadata.method='bank_transfer')
→ 고객: 접수 확인 메일(Resend) / 관리자: 신규 주문 알림 메일
→ /admin/orders: 입금 확인 [완료] 원클릭 → status='paid'
→ 고객: "다운로드가 활성화되었습니다" 메일
→ /mypage '내 제품': orders(status='paid') 기준 제품별 파일 목록
→ 다운로드 클릭 → /api/packs/sign-link (검증을 orders 기반으로 교체)
→ web-backend HMAC → DSM 공유 링크 (4시간 만료, 만료 시 재클릭으로 재발급)
```

- `PurchaseAgreementModal`을 범용 제품용으로 일반화.
- `PaymentButton`(PortOne)은 보존하되 `products.pay_method='bank_transfer'`일 때 미노출.
  추후 PG 계약 시 제품별 플래그만 변경하면 카드 결제 활성.
- admin 팩 업로드 UI(/admin/packs)는 제품 관리(/admin/products) 안으로 통합 — 제품 선택 → 파일 업로드.
- tier(starter/pro/master) 개념은 음악 팩 하위 호환용으로 유지하되, 신규 제품은 product_id 직접 매칭.

## 5. 외주 의뢰 플로우 (고객 포털 포함)

### 상태 머신 (contact_requests.status)
`pending(접수) → reviewing(검토중) → quoted(견적발송) → accepted(수주)/on_hold(보류) → in_progress(진행중) → completed(완료)`
(+ `cancelled`)

### 흐름
```
[고객] /outsourcing 단계형 의뢰 폼
  단계: ① 프로젝트 유형 → ② 예산/희망 일정 → ③ 상세 요구사항 → ④ 연락처(로그인 시 자동 채움)
→ contact_requests 생성 (public_token 발급) + 접수 확인 메일(추적 링크 /track/[token] 포함)
  + 관리자 알림 메일 (기존 Resend 흐름 유지)

[관리자] /admin 의뢰 상세 (contacts + quotes 통합 뷰)
→ 상태 변경 드롭다운 (상태 머신 순서 강제)
→ 견적서 작성 시 contact_request_id 자동 연결
→ [견적 발송] 버튼 → quotes.status='sent' + 고객 메일 자동 발송(견적 링크 포함)
  + contact_requests.status='quoted' 동기화

[고객] /track/[token] (비회원) 또는 /mypage '내 의뢰' (회원)
→ 상태 타임라인 표시 + 연결된 견적서 열람
→ 견적 수락/거절 버튼 → quotes.status='accepted'/'rejected'
  + contact_requests.status 동기화('accepted'/'on_hold') + 관리자 알림 메일
```

- rate limit·XSS 방지 등 기존 `/api/contact` 보안 로직 유지.
- 견적서 작성 시 DB 자동 등록 원칙 유지 ([[feedback_quotes_admin]]).

## 6. DB 마이그레이션 (클라우드 + self-host 양쪽 적용)

신규 마이그레이션 SQL 파일 1~2개로 작성 (`supabase/migrations/2026-06-11-*.sql`):

1. `products`: `description_long TEXT`, `pay_method TEXT DEFAULT 'bank_transfer'`, `features JSONB`, `sort_order INT` 추가
2. `pack_files`: `product_id TEXT REFERENCES products(id)` 추가 + 기존 음악 팩 파일 product_id 백필
3. `contact_requests`: `public_token TEXT UNIQUE`, `budget TEXT`, `timeline TEXT`, `project_type TEXT` 추가
   + status CHECK 갱신 (새 상태 머신)
4. `quotes`: `contact_request_id UUID REFERENCES contact_requests(id)` 추가
5. 기존 음악 팩 구매자(contact_requests 'completed' + "구매 신청:" 패턴) → orders 이관 스크립트
6. RLS: `/track/[token]`용 조회는 서버(admin client)에서만 — 테이블 직접 노출 없음

**운영 주의**: 현 운영=Vercel+클라우드 Supabase, NAS self-host로 전환 직전(Phase 6 ③ DNS 전환 대기).
마이그레이션은 **양쪽 DB에 동일 순서로 적용**하고, 이관 스크립트는 멱등하게 작성.

## 7. 구현 단계

| Phase | 내용 | 검증 |
|-------|------|------|
| **1. 디자인 시스템 + IA** | 디자인 토큰·공통 컴포넌트, 상단 네비 레이아웃 전환, 메인·/outsourcing 리디자인, 숨김 서비스 처리, /login·/mypage 리디자인 | 전 페이지 렌더·반응형·숨김 토글 확인 |
| **2. 제품 판매 시스템** | DB 마이그레이션, /products 카탈로그·상세, 계좌이체 구매 플로우, /admin/orders·/admin/products, sign-link 검증 교체, 기존 구매자 이관 | 회원 구매→입금확인→다운로드 E2E |
| **3. 외주 고객 포털** | 단계형 폼, contact↔quote 연결, 상태 머신, /track/[token], 자동 이메일, admin 통합 뷰 | 비회원 의뢰→견적→수락 E2E |

## 8. E2E 검증 시나리오 (각 Phase 종료 시 수동)

- **A. 외주 (비회원)**: 의뢰 폼 제출 → 접수 메일 수신 → /track 접속 → admin 견적 발송 → 메일 링크로 견적 열람 → 수락 → admin 알림 확인
- **B. 제품 구매 (회원)**: 회원가입/로그인 → 제품 구매 신청 → 접수 메일 → admin 입금 확인 → 다운로드 활성 메일 → mypage 다운로드 → DSM 링크 파일 수신
- **C. 숨김 서비스**: 일반 사용자 404 확인 / admin 세션 접근 확인 / 토글 재활성 복귀 확인
- **D. 회귀**: 기존 음악 팩 구매자 mypage 다운로드 정상 동작 (이관 후)

## 9. 의도적 제외 (이번 범위 아님)

- PG(카드) 결제 활성화 — 플래그 구조만 준비
- 관리자 RBAC(권한 분화)
- 구독 정기 결제
- ZIP 일괄 다운로드, 다운로드 횟수 제한
- 사주 SaaS 도메인 분리 (별도 트랙)
- web-backend(packs-lab) 코드 수정
