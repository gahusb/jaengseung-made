// AI 사주 자동화 프로그램 견적서 등록/갱신 스크립트
// 사용:
//   node scripts/insert-saju-quote.mjs              → 신규 등록
//   node scripts/insert-saju-quote.mjs <quote-id>   → 기존 견적서 업데이트
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local'), override: true });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('환경변수 누락: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const newId = () => Math.random().toString(36).slice(2, 9);

const items = [
  {
    id: newId(),
    category: '개발',
    name: '사주 분석 프로그램 (영구 사용권)',
    description: 'AI가 사주를 자동으로 풀이해주는 프로그램. 한 번 구매하시면 평생 사용 가능.',
    quantity: 1,
    unitPrice: 350000,
    optional: false,
  },
  {
    id: newId(),
    category: '인프라',
    name: '원격 설치 도와드리기',
    description: '고객님 컴퓨터에 원격으로 접속해서 프로그램 설치 + 작동 확인까지 다 해드립니다 (약 2시간).',
    quantity: 1,
    unitPrice: 70000,
    optional: false,
  },
  {
    id: newId(),
    category: '기획',
    name: '사용 방법 가이드',
    description: '사용법 영상 5편 + 그림 매뉴얼 PDF 제공. 어려운 부분 없이 쉽게 따라 하실 수 있습니다.',
    quantity: 1,
    unitPrice: 50000,
    optional: false,
  },
  {
    id: newId(),
    category: '유지보수',
    name: '첫 1개월 무료 카카오톡 도움',
    description: '쓰다가 막히는 부분 카카오톡으로 바로 물어보세요. 첫 달은 무료입니다.',
    quantity: 1,
    unitPrice: 0,
    optional: false,
  },
  {
    id: newId(),
    category: '디자인',
    name: '내 가게 스타일로 꾸미기 (옵션)',
    description: '상호·로고·색상을 적용해서 "내 사주집 프로그램"처럼 만들어 드립니다.',
    quantity: 1,
    unitPrice: 70000,
    optional: true,
  },
  {
    id: newId(),
    category: '개발',
    name: 'AI 분석 100건 미리 충전 (옵션)',
    description: 'AI 분석 1건당 정가 9,900원. 100건(99만원)을 5만원에 미리 충전해두는 95% 할인 혜택.',
    quantity: 1,
    unitPrice: 50000,
    optional: true,
  },
];

const wbs = [
  {
    id: newId(),
    phase: '1. 현황 확인',
    tasks: [
      { id: newId(), name: '컴퓨터·인터넷 환경 확인', duration: '1일', description: '어떤 컴퓨터/노트북을 쓰시는지, 인터넷 환경은 어떤지 간단히 확인합니다.' },
    ],
  },
  {
    id: newId(),
    phase: '2. 원격 설치',
    tasks: [
      { id: newId(), name: '원격 접속 설치 + AI 연결', duration: '1일', description: '직접 컴퓨터에 들어가서 프로그램 설치하고, AI 연결까지 모두 해드립니다.' },
    ],
  },
  {
    id: newId(),
    phase: '3. AI 작동 확인',
    tasks: [
      { id: newId(), name: '실제 사주로 테스트', duration: '0.5일', description: '박재오 본인 사주로 테스트해보고 결과가 정상으로 나오는지 함께 확인합니다.' },
    ],
  },
  {
    id: newId(),
    phase: '4. 사용법 알려드리기',
    tasks: [
      { id: newId(), name: '영상·매뉴얼 전달 + 화상 설명', duration: '0.5일', description: '영상 5편과 매뉴얼을 보내드리고, 화상으로 30분 동안 직접 설명해드립니다.' },
    ],
  },
  {
    id: newId(),
    phase: '5. 1개월 도움',
    tasks: [
      { id: newId(), name: '카카오톡 응대', duration: '1개월', description: '쓰시다가 막히는 부분 카카오톡으로 바로 응대해드립니다. 작은 오류는 무료로 고쳐드립니다.' },
    ],
  },
];

const maintenance = [
  {
    id: newId(),
    name: '베이직',
    period: '월간',
    monthlyFee: 30000,
    includes: [
      '매달 프로그램 업데이트',
      '카카오톡 응대 (이틀 안에)',
      '작은 문제 무료 수정',
    ],
    recommended: true,
  },
  {
    id: newId(),
    name: '프리미엄',
    period: '월간',
    monthlyFee: 70000,
    includes: [
      '카카오톡 24시간 안에 응대',
      '매달 AI 분석 30건 무료 제공',
    ],
    recommended: false,
  },
];

const notes = `[금액 안내 — 부가세 포함]
- 필수만: 약 490,000원
- 풀세트(옵션 모두 포함): 약 610,000원
- 위 금액은 부가세가 포함된 최종 가격입니다 (사업자 등록 안 된 경우에도 동일).

[결제 방법]
- 계약금 50% 입금 → 작업 시작
- 잔금 50% → 사용 가이드 모두 전달한 다음 입금

[수익화 예시 — 고객 참고]
- 손님 1명에게 사주 2만원에 봐드린다고 하면
  · 25명 = 50만원 (프로그램 비용 회수)
  · 100명 = 200만원 매출
- AI가 자동으로 풀이해주므로 사주책 없이도 운영 가능

[포함되어 있어요]
- 평생 사용권
- 원격 설치 1회
- 사용법 영상·매뉴얼
- 첫 1개월 카카오톡 도움 무료

[안 되는 부분 (미리 안내)]
- 두 번째 컴퓨터 추가 설치는 따로 15만원
- AI 회사에 내는 사용료(한 달 1~2만원)는 고객님 카드로 결제
- 인터넷 사이트로 만드시려면 호스팅 비용은 따로

[저작권]
- 프로그램 자체는 쟁승메이드 소유
- 고객님은 평생 사용 가능 (다른 사람에게 팔거나 양도는 불가)

[무료 수정]
- 화면 디자인 수정 2회까지 무료

[보너스 — 마케팅 시작 키트 무상 제공]
프로그램 납품 시 아래 자료를 함께 드립니다 (별도 비용 없음).

1. 채널별 카피 묶음 — 인스타·카카오톡 채널·네이버 엑스퍼트·라이브 방송
   ㆍ 인스타 프로필 한 줄 (3안), 카드뉴스 헤드라인 (5종)
   ㆍ 카카오톡 채널 자동 인사말 (가격표 포함)
   ㆍ 네이버 엑스퍼트 서비스 제목·소개글 (검색 노출 최적화)
   ㆍ 라이브 방송 오프닝·미끼·클로징 멘트
2. 검색 노출용 키워드 30개 — 사주·신년운세·궁합·취업운 등 3단계 분류
3. 인스타 해시태그 30종 (피드 1회 발행 분량)
4. 후기 요청·재구매 유도 메시지 템플릿
5. 7일 안에 첫 매출 내는 실행 체크리스트
6. KPI 목표표 (1·3·6개월 단위 매출·팔로워·후기 수)

[추가 도움 가능한 영역 — 추후 협의]
- 사주 풀이 결과를 자동으로 인스타 카드뉴스로 만드는 도구
- 카카오톡 자동 응답 챗봇 (24시간 접수 자동화)
- 사주집 전용 홈페이지 + 결제 시스템
- 블로그 SEO 자동 발행 (사주 키워드 누적용)
처음에는 위 무상 키트만으로도 충분히 시작 가능하시며,
운영하시다가 필요해지시면 그때 편하게 말씀 주세요.

[협상 카드 — 내부용]
- 옵션 빼고 49만원으로 인하 가능
- 첫 1개월 도움 → 3개월로 확장 가능
- 베이직 유지보수 6개월 선결제 시 1개월 무료
- 마지노선: 350,000원 (이 아래는 자체 직판 의미 없음)`;

const validUntil = '2026-05-09';

const payload = {
  title: 'AI 사주 분석 프로그램 도입 (사주집 운영 패키지)',
  client_name: '',
  client_email: '',
  valid_until: validUntil,
  wbs,
  items,
  maintenance,
  notes,
  status: 'draft',
};

const targetId = process.argv[2];

if (targetId) {
  const { data, error } = await sb
    .from('quotes')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', targetId)
    .select()
    .single();
  if (error) {
    console.error('업데이트 실패:', error.message);
    process.exit(1);
  }
  console.log('✅ 견적서 업데이트 완료');
  console.log('  ID:           ', data.id);
  console.log('  제목:         ', data.title);
  console.log('  유효기간:     ', data.valid_until);
  console.log('  공개 토큰:    ', data.public_token);
  console.log('  관리자 편집:  /admin/quotes/' + data.id);
  console.log('  고객용 링크:  /quote/' + data.public_token);
} else {
  const { data, error } = await sb.from('quotes').insert(payload).select().single();
  if (error) {
    console.error('등록 실패:', error.message);
    process.exit(1);
  }
  console.log('✅ 견적서 등록 완료');
  console.log('  ID:           ', data.id);
  console.log('  제목:         ', data.title);
  console.log('  유효기간:     ', data.valid_until);
  console.log('  공개 토큰:    ', data.public_token);
  console.log('  관리자 편집:  /admin/quotes/' + data.id);
  console.log('  고객용 링크:  /quote/' + data.public_token);
}
