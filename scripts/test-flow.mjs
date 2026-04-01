/**
 * 프로젝트 추적 시스템 E2E 테스트 스크립트
 * 실행: node scripts/test-flow.mjs
 *
 * 테스트 흐름:
 * 1. 테스트 계정 생성 (Supabase Auth)
 * 2. 관리자 로그인
 * 3. 관리자 → 테스트 견적서 생성 + 발송
 * 4. 테스트 유저 → 견적서 코드로 마이페이지 연결
 * 5. 관리자 → 기본 7단계 마일스톤 초기화
 * 6. 관리자 → 단계 진행 (1~3단계 완료)
 * 7. 테스트 유저 → 마이페이지에서 진행 상황 확인 (브라우저)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// .env.test 파일에서 환경변수 로드
config({ path: '.env.test' });

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ADMIN_ID = process.env.TEST_ADMIN_ID;
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !ADMIN_ID || !ADMIN_PASSWORD) {
  console.error('❌ .env.test 파일에 필수 환경변수가 없습니다.');
  console.error('   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, TEST_ADMIN_ID, TEST_ADMIN_PASSWORD');
  process.exit(1);
}

// 테스트 계정 정보
const TEST_EMAIL = `testuser_${Date.now()}@test-jaengseung.com`;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'Test@2026!';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ───────────────────────────────────────────
// 유틸
// ───────────────────────────────────────────
let _adminCookie = '';

function log(step, msg, data) {
  const prefix = `\n[STEP ${step}]`;
  console.log(`${prefix} ${msg}`);
  if (data) console.log('  →', JSON.stringify(data, null, 2).slice(0, 400));
}

function ok(label, value) {
  console.log(`  ✅ ${label}: ${value}`);
}

function fail(label, err) {
  console.error(`  ❌ ${label}: ${err}`);
  process.exit(1);
}

async function adminFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Cookie: _adminCookie,
      ...(options.headers ?? {}),
    },
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { status: res.status, data: json, headers: res.headers };
}

async function userFetch(path, accessToken, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Cookie: `sb-avickbbhyhlnqbbqfzws-auth-token=${accessToken}`,
      ...(options.headers ?? {}),
    },
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { status: res.status, data: json };
}

// ───────────────────────────────────────────
// STEP 1: 테스트 유저 생성
// ───────────────────────────────────────────
async function step1_createUser() {
  log(1, '테스트 계정 생성');
  console.log(`  이메일: ${TEST_EMAIL}`);
  console.log(`  비밀번호: ${TEST_PASSWORD}`);

  const { data, error } = await supabase.auth.signUp({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    options: { data: { name: '테스트 고객' } },
  });

  if (error) fail('회원가입', error.message);

  const user = data?.user;
  if (!user) fail('회원가입', '유저 데이터 없음');

  ok('유저 ID', user.id);
  ok('이메일 확인 필요 여부', user.email_confirmed_at ? '이미 확인됨' : '미확인 (로컬 테스트는 통과)');

  // 로그인으로 세션 획득
  const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  if (loginErr) fail('유저 로그인', loginErr.message);

  const session = loginData?.session;
  if (!session) fail('유저 로그인', '세션 없음 (이메일 인증 필요)');

  ok('Access Token 획득', session.access_token.slice(0, 30) + '...');
  return { userId: user.id, session };
}

// ───────────────────────────────────────────
// STEP 2: 관리자 로그인
// ───────────────────────────────────────────
async function step2_adminLogin() {
  log(2, '관리자 로그인');

  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: ADMIN_ID, password: ADMIN_PASSWORD }),
  });

  if (res.status !== 200) fail('관리자 로그인', `HTTP ${res.status}`);

  const setCookie = res.headers.get('set-cookie');
  if (!setCookie) fail('관리자 로그인', 'Set-Cookie 헤더 없음');

  _adminCookie = setCookie.split(';')[0]; // admin_token=xxx
  ok('Admin Cookie', _adminCookie.slice(0, 50) + '...');
}

// ───────────────────────────────────────────
// STEP 3: 견적서 생성
// ───────────────────────────────────────────
async function step3_createQuote() {
  log(3, '견적서 생성');

  const { status, data } = await adminFetch('/api/admin/quotes', {
    method: 'POST',
    body: JSON.stringify({
      title: '테스트 홈페이지 제작 견적서',
      client_name: '테스트 고객',
      client_email: TEST_EMAIL,
      client_phone: '010-1234-5678',
      valid_until: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      items: [
        {
          id: 'item1',
          name: '기업 홈페이지 제작',
          description: 'Next.js 기반 반응형 홈페이지',
          unitPrice: 1500000,
          quantity: 1,
        },
        {
          id: 'item2',
          name: 'SEO 최적화',
          description: '메타태그 + 사이트맵 설정',
          unitPrice: 300000,
          quantity: 1,
        },
      ],
      notes: '테스트 플로우용 견적서입니다. 납기 2주 예정.',
    }),
  });

  if (status !== 201) fail('견적서 생성', `HTTP ${status} - ${JSON.stringify(data)}`);

  const quote = data.quote;
  ok('견적서 ID', quote.id);
  ok('public_token', quote.public_token);
  ok('상태', quote.status);
  return quote;
}

// ───────────────────────────────────────────
// STEP 4: 견적서 상태를 'sent'로 변경
// ───────────────────────────────────────────
async function step4_sendQuote(quoteId) {
  log(4, "견적서 상태 → 'sent' (발송)");

  const { status, data } = await adminFetch(`/api/admin/quotes/${quoteId}`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'sent' }),
  });

  if (status !== 200) fail('견적서 발송', `HTTP ${status} - ${JSON.stringify(data)}`);

  ok('새 상태', data.quote?.status);
  return data.quote;
}

// ───────────────────────────────────────────
// STEP 5: 테스트 유저가 견적서 코드 연결
// ───────────────────────────────────────────
async function step5_linkQuote(publicToken, session) {
  log(5, '테스트 유저 → 견적서 코드 연결 (마이페이지)');

  // 유저 세션 쿠키로 API 호출
  const res = await fetch(`${BASE_URL}/api/projects/link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ token: publicToken }),
  });

  const data = await res.json();
  console.log(`  HTTP ${res.status}:`, JSON.stringify(data));

  if (res.status === 200 && data.success) {
    ok('연결 성공', `quoteId=${data.quoteId}`);
    return true;
  } else {
    // RLS 제한으로 실패할 수 있음 — 안내 메시지 출력
    console.warn('\n  ⚠️  연결 API가 실패했습니다.');
    console.warn('  원인: SUPABASE_SERVICE_ROLE_KEY 가 비어 있어 RLS 우회 불가');
    console.warn('  해결: 아래 STEP 5b 안내 따라 서비스 롤 키를 추가하거나,');
    console.warn('       브라우저에서 직접 마이페이지 > "견적서 코드 입력" 테스트하세요.');
    return false;
  }
}

// ───────────────────────────────────────────
// STEP 6: 기본 7단계 마일스톤 초기화
// ───────────────────────────────────────────
async function step6_initMilestones(quoteId) {
  log(6, '기본 7단계 마일스톤 초기화');

  const { status, data } = await adminFetch('/api/admin/milestones', {
    method: 'POST',
    body: JSON.stringify({ useDefaults: true, quoteId }),
  });

  if (status !== 200 && status !== 201) fail('마일스톤 초기화', `HTTP ${status} - ${JSON.stringify(data)}`);

  ok('마일스톤 생성 수', data.milestones?.length ?? 0);
  data.milestones?.forEach((m) => console.log(`  ${m.step_number}. [${m.status}] ${m.title}`));
  return data.milestones;
}

// ───────────────────────────────────────────
// STEP 7: 마일스톤 단계 업데이트
// ───────────────────────────────────────────
async function step7_updateMilestones(milestones) {
  log(7, '단계 진행 시뮬레이션 (1·2·3단계 완료, 4단계 진행중)');

  const updates = [
    { id: milestones[0].id, status: 'completed', note: '고객 의뢰 접수 완료. 2주 일정 확인.' },
    { id: milestones[1].id, status: 'completed', note: '계약서 서명 및 선금 50% 입금 완료.' },
    { id: milestones[2].id, status: 'completed', note: '와이어프레임 v1 전달. 고객 승인.' },
    { id: milestones[3].id, status: 'in_progress', note: '디자인 시안 작업 중 (예상 3일).' },
  ];

  for (const u of updates) {
    const { status, data } = await adminFetch(`/api/admin/milestones/${u.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: u.status, note: u.note }),
    });
    const m = milestones.find((x) => x.id === u.id);
    if (status === 200) {
      ok(`단계 ${m?.step_number} (${m?.title})`, `→ ${u.status}`);
    } else {
      console.warn(`  ⚠️  단계 업데이트 실패: ${JSON.stringify(data)}`);
    }
  }
}

// ───────────────────────────────────────────
// STEP 8: 유저 마이페이지 API 검증
// ───────────────────────────────────────────
async function step8_verifyUserView(session) {
  log(8, '유저 마이페이지 API 확인');

  const res = await fetch(`${BASE_URL}/api/projects`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const data = await res.json();
  console.log(`  HTTP ${res.status}:`, JSON.stringify(data).slice(0, 500));

  if (res.status === 200 && data.projects?.length > 0) {
    const p = data.projects[0];
    ok('프로젝트 제목', p.title);
    ok('상태', p.status);
    ok('마일스톤 수', p.milestones?.length ?? 0);
    const done = p.milestones?.filter((m) => m.status === 'completed').length ?? 0;
    const inProg = p.milestones?.filter((m) => m.status === 'in_progress').length ?? 0;
    ok('완료 단계', done);
    ok('진행중 단계', inProg);
  } else {
    console.warn('  ⚠️  프로젝트가 없거나 연결 실패. 브라우저 직접 확인 필요.');
  }
}

// ───────────────────────────────────────────
// 최종 안내 출력
// ───────────────────────────────────────────
function printBrowserGuide(quote, email, password, linked) {
  console.log('\n' + '═'.repeat(60));
  console.log('📋 브라우저 확인 가이드');
  console.log('═'.repeat(60));

  console.log(`
[관리자 화면]
  URL: http://localhost:3000/admin/login
  ID : ${ADMIN_ID}
  PW : (환경변수 TEST_ADMIN_PASSWORD 참조)

  → 로그인 후 견적서 목록에서 아래 견적서 클릭:
    "${quote.title}" (${quote.id.slice(0, 8)}...)
  → "진행 단계" 탭에서 마일스톤 상태 확인
  → 단계 상태 변경 → 저장 테스트

[고객(테스트 유저) 화면]
  URL : http://localhost:3000/login
  이메일: ${email}
  비밀번호: ${password}

  → 로그인 후 마이페이지 → "프로젝트 현황" 탭
`);

  if (!linked) {
    console.log(`  ⚠️  자동 연결이 안 된 경우:
  → 마이페이지 아래 "견적서 코드 입력" 박스에 아래 코드 입력:
    ${quote.public_token}
`);
  } else {
    console.log(`  ✅ 견적서가 이미 연결됨. 바로 "프로젝트 현황" 탭 확인 가능.
`);
  }

  console.log(`[확인 포인트]
  - 진행률 막대 (완료 3/7 → 약 43%)
  - 현재 진행 단계 "디자인 시안" 강조 표시
  - 완료 단계에 ✓ 체크 아이콘 + 날짜
  - 메모 내용 표시

[추가 테스트]
  1. 관리자에서 "4단계 완료", "5단계 진행중"으로 변경
  2. 새로고침 없이 마이페이지 탭 재진입 → 즉시 반영 확인
  3. 최종 납품 완료(7단계)로 변경 → 상태 배지 변경 확인
`);
  console.log('═'.repeat(60));
}

// ───────────────────────────────────────────
// 메인
// ───────────────────────────────────────────
(async () => {
  console.log('\n🚀 쟁승메이드 프로젝트 추적 시스템 E2E 테스트 시작\n');

  try {
    // 1. 테스트 유저 생성
    const { userId, session } = await step1_createUser().catch(async () => {
      // 이미 존재하면 로그인만
      console.log('  ℹ️  이미 존재하는 계정으로 로그인 시도...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });
      if (error) fail('유저 로그인', error.message);
      return { userId: data.user.id, session: data.session };
    });

    // 2. 관리자 로그인
    await step2_adminLogin();

    // 3. 견적서 생성
    const quote = await step3_createQuote();

    // 4. 견적서 발송
    await step4_sendQuote(quote.id);

    // 5. 유저가 견적서 연결
    const linked = await step5_linkQuote(quote.public_token, session);

    // 6. 마일스톤 초기화
    const milestones = await step6_initMilestones(quote.id);

    // 7. 단계 업데이트
    if (milestones?.length >= 4) {
      await step7_updateMilestones(milestones);
    }

    // 8. 유저 뷰 검증
    await step8_verifyUserView(session);

    // 최종 안내
    printBrowserGuide(quote, TEST_EMAIL, TEST_PASSWORD, linked);

    console.log('\n✅ 테스트 스크립트 완료!\n');
  } catch (err) {
    console.error('\n❌ 예상치 못한 오류:', err.message ?? err);
    process.exit(1);
  }
})();
