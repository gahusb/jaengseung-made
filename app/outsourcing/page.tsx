import Link from 'next/link';
import type { Metadata } from 'next';
import ContactForm from '@/app/components/ContactForm';

// 외주 개발 의뢰 페이지 (서버 컴포넌트)
// PublicShell이 TopNav(h-16)·푸터·main 배경을 제공하므로 여기서는 콘텐츠 섹션만 렌더한다.
// 메인(/)의 토큰·타이포 패턴(KOR_TIGHT/KOR_BODY)·섹션 리듬과 일관되게 구성한다.

export const metadata: Metadata = {
  title: '외주 개발',
  description:
    '7년차 대기업 백엔드 개발자가 직접 진행하는 맞춤 소프트웨어 외주 개발. 웹 서비스, 업무 자동화, API·백엔드, 봇, AI 연동까지 기획부터 납품·하자보수까지 단독으로 책임집니다.',
};

const KOR_TIGHT = { letterSpacing: '-0.02em' } as const;
const KOR_BODY = { letterSpacing: '-0.01em' } as const;

const FIELDS = [
  {
    t: '웹 서비스 개발',
    d: '회원·결제·관리자까지, 실제로 굴러가는 서비스를 기획부터 배포까지 만들어 드립니다.',
  },
  {
    t: '웹사이트 제작',
    d: '기업 소개·포트폴리오·랜딩 페이지를 반응형·SEO까지 갖춰 제작합니다.',
  },
  {
    t: '업무 자동화',
    d: 'RPA·엑셀 집계·웹 크롤링으로 반복 업무를 사람 손에서 떼어냅니다.',
  },
  {
    t: 'API·백엔드',
    d: '데이터 모델 설계부터 인증·외부 연동까지 안정적인 서버를 구축합니다.',
  },
  {
    t: '텔레그램·디스코드 봇',
    d: '알림·명령·자동 응답 봇으로 운영과 커뮤니티 관리를 자동화합니다.',
  },
  {
    t: 'AI 연동 개발',
    d: 'LLM·생성형 AI를 업무 흐름에 붙여 초안 작성·분류·요약을 자동화합니다.',
  },
];

const PROCESS = [
  { n: '01', t: '무료 상담', d: '요구사항을 함께 정리하고 실현 가능성을 점검합니다. 기획이 안 잡혔어도 괜찮습니다.' },
  { n: '02', t: '견적·범위 확정', d: '기능 범위와 일정을 정리해 영업일 2일 내 견적으로 회신드립니다.' },
  { n: '03', t: '계약·착수', d: '계약서 체결 후 착수금 50%를 받고 개발을 시작합니다.' },
  { n: '04', t: '개발·중간 공유', d: '주 1회 이상 진행 상황을 공유하며 방향을 맞춰 갑니다.' },
  { n: '05', t: '납품·검수', d: '완성본을 인도하고 함께 검수합니다. 전체 소스와 배포 문서를 전달합니다.' },
  { n: '06', t: '무상 하자보수 30일', d: '납품 후 30일간 결함·수정을 무상으로 대응해 안정화까지 책임집니다.' },
];

// 기존 work/freelance(lib/freelance-portfolio) 실사례를 새 토큰 기준으로 재구성.
const CASES = [
  {
    t: '주식 자동매매 시스템',
    cat: '실시간 트레이딩 · 직접 운영 중',
    live: true,
    d: '텔레그램과 연동해 실시간으로 주문을 집행하고 체결·손익 리포트를 자동 전송합니다.',
    tags: ['Python', 'Telegram Bot', '실시간 주문'],
  },
  {
    t: '부동산 청약 자동 수집·매칭',
    cat: '크롤링 · 직접 운영 중',
    live: true,
    d: '공고를 주기적으로 크롤링해 조건에 맞는 매물만 골라내고, 신규 매칭을 즉시 푸시합니다.',
    tags: ['Python', '크롤링', '조건 매칭'],
  },
  {
    t: 'AI 콘텐츠 자동화 파이프라인',
    cat: 'AI 연동 · 직접 운영 중',
    live: true,
    d: '생성부터 검수, 발행까지 사람이 개입할 지점만 남기고 전 과정을 자동으로 연결합니다.',
    tags: ['AI 연동', '검수 워크플로우', '자동 발행'],
  },
  {
    t: 'Gmail 자동화 RPA',
    cat: 'RPA · 납품 완료',
    live: false,
    d: '거래처 이메일 수신 시 자동 분류, 답장 초안 작성, 담당자 알림을 전송합니다.',
    tags: ['Python', 'Gmail API'],
  },
  {
    t: '쇼핑몰 가격 모니터링 봇',
    cat: '웹 스크래핑 · 납품 완료',
    live: false,
    d: '경쟁사 상품 가격을 매일 모니터링해 변동 시 텔레그램으로 즉시 알립니다.',
    tags: ['Python', 'Selenium', 'Telegram Bot'],
  },
  {
    t: '영업 일보 자동화 시스템',
    cat: '엑셀 자동화 · 납품 완료',
    live: false,
    d: '엑셀 데이터를 자동 집계해 일·주·월별 보고서 PDF를 생성하고 매일 09시 발송합니다.',
    tags: ['Python', 'OpenPyXL', 'ReportLab'],
  },
];

// /work/website/samples/* 중 대표 샘플 — 이 라우트는 숨김이 아니라 포트폴리오용으로 잔존.
const SAMPLES = [
  { slug: 'corporate', t: '기업 홈페이지', sub: '테크솔루션㈜', tag: 'B2B · 신뢰' },
  { slug: 'shopping', t: '개인 쇼핑몰', sub: 'MELLOW STUDIO', tag: '쇼핑몰 · 브랜드' },
  { slug: 'dashboard', t: '관리자 대시보드', sub: 'DataFlow SaaS', tag: 'SaaS · 자동화' },
  { slug: 'portfolio', t: '개인 포트폴리오', sub: 'Kim Jisu', tag: '크리에이터 · 수주' },
];

const FAQ = [
  {
    q: '견적은 어떻게 산정되나요?',
    a: '기능 범위와 구현 난이도를 기준으로 산정합니다. 상담에서 필요한 기능을 함께 정리한 뒤, 영업일 2일 내에 범위·일정·금액을 명시한 견적으로 회신드립니다. 추측으로 부풀리지 않고 실제 작업량 기준으로 잡습니다.',
  },
  {
    q: '수정 요청은 몇 번까지 가능한가요?',
    a: '합의한 범위 안에서는 2회까지 무상으로 수정해 드립니다. 범위를 벗어나는 기능 추가나 방향 전환은 별도로 협의해 진행합니다. 무엇이 범위 안/밖인지는 착수 전 견적에 미리 명시합니다.',
  },
  {
    q: '소스코드도 제공되나요?',
    a: '제공됩니다. 잔금 완납 시 전체 소스코드와 배포·실행 문서를 함께 전달합니다. 직접 운영하시거나 다른 개발자에게 이어 맡기셔도 문제없도록 인도합니다.',
  },
  {
    q: '납품 후 유지보수는요?',
    a: '납품일로부터 30일간 결함·오류를 무상으로 하자보수합니다. 이후 기능 추가나 지속 운영이 필요하면 월 단위 유지보수 계약으로 이어갈 수 있습니다.',
  },
];

function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

export default function OutsourcingPage() {
  return (
    <>
      {/* ─── 1. Hero ─── */}
      <section className="border-b" style={{ borderColor: 'var(--jsm-line)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <span
              className="inline-block text-xs font-semibold mb-6 px-2.5 py-1 rounded"
              style={{ color: 'var(--jsm-accent)', background: 'var(--jsm-accent-soft)', ...KOR_BODY }}
            >
              외주 개발
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.2] break-keep"
              style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
            >
              맞춤 소프트웨어{' '}
              <span style={{ color: 'var(--jsm-accent)' }}>외주 개발</span>
            </h1>
            <p
              className="mt-7 text-lg lg:text-xl leading-relaxed break-keep max-w-2xl"
              style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
            >
              기획 정리가 안 됐어도 괜찮습니다. 상담에서 함께 정리합니다. 7년차 대기업 백엔드
              개발자가 기획부터 배포·하자보수까지 단독으로 책임집니다.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-white transition-colors duration-150 hover:bg-[var(--jsm-accent-hover)]"
                style={{ background: 'var(--jsm-accent)', ...KOR_BODY }}
              >
                의뢰 내용 보내기
                <ArrowRight />
              </Link>
              <Link
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold border transition-colors duration-150 hover:bg-[var(--jsm-surface-alt)]"
                style={{
                  color: 'var(--jsm-ink)',
                  borderColor: 'var(--jsm-line)',
                  background: 'var(--jsm-surface)',
                  ...KOR_BODY,
                }}
              >
                포트폴리오 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. 제공 분야 ─── */}
      <section style={{ background: 'var(--jsm-surface-alt)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--jsm-accent)' }}
            >
              Scope
            </p>
            <h2
              className="text-3xl lg:text-4xl font-bold break-keep"
              style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
            >
              이런 것들을 만들어 드립니다
            </h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FIELDS.map((f) => (
              <div
                key={f.t}
                className="rounded-2xl p-7 border"
                style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
              >
                <h3
                  className="text-lg font-bold break-keep"
                  style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                >
                  {f.t}
                </h3>
                <p
                  className="mt-2.5 text-sm leading-relaxed break-keep"
                  style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
                >
                  {f.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. 진행 프로세스 ─── */}
      <section id="process" className="scroll-mt-20" style={{ background: 'var(--jsm-bg)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--jsm-accent)' }}
            >
              Process
            </p>
            <h2
              className="text-3xl lg:text-4xl font-bold break-keep"
              style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
            >
              상담부터 하자보수까지, 흐름이 분명합니다
            </h2>
          </div>
          <div
            className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden border"
            style={{ borderColor: 'var(--jsm-line)', background: 'var(--jsm-line)' }}
          >
            {PROCESS.map((s) => (
              <div key={s.n} className="p-7 lg:p-8" style={{ background: 'var(--jsm-surface)' }}>
                <span
                  className="text-sm font-bold"
                  style={{ color: 'var(--jsm-accent)', fontFamily: 'monospace' }}
                >
                  {s.n}
                </span>
                <h3
                  className="mt-4 text-lg font-bold break-keep"
                  style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                >
                  {s.t}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed break-keep"
                  style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
                >
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. 포트폴리오 ─── */}
      <section id="portfolio" className="scroll-mt-20" style={{ background: 'var(--jsm-surface-alt)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--jsm-accent)' }}
            >
              Portfolio
            </p>
            <h2
              className="text-3xl lg:text-4xl font-bold break-keep"
              style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
            >
              직접 개발하고, 실제로 굴러가는 결과물
            </h2>
            <p
              className="mt-4 leading-relaxed break-keep"
              style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
            >
              운영 중인 서비스와 납품 완료 프로젝트입니다. 의뢰하신 프로젝트도 같은 깊이로 만듭니다.
            </p>
          </div>

          {/* 실사례 카드 */}
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CASES.map((c) => (
              <div
                key={c.t}
                className="flex flex-col rounded-2xl p-7 border"
                style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
              >
                <span
                  className="self-start inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full mb-5"
                  style={
                    c.live
                      ? { color: 'var(--jsm-accent)', background: 'var(--jsm-accent-soft)' }
                      : { color: 'var(--jsm-ink-soft)', background: 'var(--jsm-surface-alt)' }
                  }
                >
                  {c.live && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: 'var(--jsm-accent)' }}
                    />
                  )}
                  {c.cat}
                </span>
                <h3
                  className="text-lg font-bold break-keep"
                  style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                >
                  {c.t}
                </h3>
                <p
                  className="mt-2.5 text-sm leading-relaxed break-keep flex-1"
                  style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
                >
                  {c.d}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {c.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded"
                      style={{
                        color: 'var(--jsm-ink-soft)',
                        background: 'var(--jsm-surface-alt)',
                        ...KOR_BODY,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 웹사이트 샘플 링크 */}
          <div className="mt-14">
            <h3
              className="text-lg font-bold break-keep"
              style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
            >
              웹사이트 제작 샘플
            </h3>
            <p
              className="mt-2 text-sm leading-relaxed break-keep"
              style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
            >
              직접 둘러볼 수 있는 데모 사이트입니다. 카드를 눌러 화면을 확인하세요.
            </p>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {SAMPLES.map((s) => (
                <Link
                  key={s.slug}
                  href={`/work/website/samples/${s.slug}`}
                  className="group flex flex-col rounded-2xl p-6 border transition-colors duration-200 hover:border-[var(--jsm-accent)]"
                  style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
                >
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--jsm-accent)' }}
                  >
                    {s.tag}
                  </span>
                  <h4
                    className="mt-3 text-base font-bold break-keep"
                    style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                  >
                    {s.t}
                  </h4>
                  <p
                    className="mt-1 text-sm break-keep"
                    style={{ color: 'var(--jsm-ink-faint)', ...KOR_BODY }}
                  >
                    {s.sub}
                  </p>
                  <span
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 group-hover:text-[var(--jsm-accent-hover)]"
                    style={{ color: 'var(--jsm-accent)', ...KOR_BODY }}
                  >
                    데모 보기
                    <ArrowRight />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. FAQ ─── */}
      <section style={{ background: 'var(--jsm-bg)' }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="mb-12">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--jsm-accent)' }}
            >
              FAQ
            </p>
            <h2
              className="text-3xl lg:text-4xl font-bold break-keep"
              style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
            >
              자주 묻는 질문
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border overflow-hidden"
                style={{ background: 'var(--jsm-surface)', borderColor: 'var(--jsm-line)' }}
              >
                <summary
                  className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 font-semibold break-keep"
                  style={{ color: 'var(--jsm-ink)', ...KOR_TIGHT }}
                >
                  {item.q}
                  <svg
                    className="shrink-0 transition-transform duration-200 group-open:rotate-45"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden
                    style={{ color: 'var(--jsm-ink-faint)' }}
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <p
                  className="px-6 pb-5 text-sm leading-relaxed break-keep"
                  style={{ color: 'var(--jsm-ink-soft)', ...KOR_BODY }}
                >
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. 의뢰 폼 ─── */}
      <section id="contact" className="scroll-mt-20" style={{ background: 'var(--jsm-navy)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-12">
            {/* 안내 */}
            <div className="lg:col-span-2">
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: '#7aa7ff' }}
              >
                Contact
              </p>
              <h2
                className="text-3xl lg:text-[2.5rem] font-bold leading-tight text-white break-keep"
                style={KOR_TIGHT}
              >
                프로젝트 문의
              </h2>
              <p
                className="mt-5 text-lg leading-relaxed text-white/70 break-keep"
                style={KOR_BODY}
              >
                영업일 2일 내에 회신드립니다. 아이디어 단계여도 괜찮습니다 — 상담에서 방향을
                함께 잡아드립니다.
              </p>
              <div
                className="mt-8 pt-8 border-t space-y-3"
                style={{ borderColor: 'rgba(255,255,255,0.12)' }}
              >
                <a
                  href="mailto:bgg8988@gmail.com"
                  className="flex items-center gap-3 text-sm text-white/80 hover:text-white transition-colors"
                  style={KOR_BODY}
                >
                  <span className="text-white/40 text-xs uppercase tracking-wider w-12">Mail</span>
                  bgg8988@gmail.com
                </a>
                <a
                  href="tel:010-3907-1392"
                  className="flex items-center gap-3 text-sm text-white/80 hover:text-white transition-colors"
                  style={KOR_BODY}
                >
                  <span className="text-white/40 text-xs uppercase tracking-wider w-12">Tel</span>
                  010-3907-1392
                </a>
              </div>
            </div>

            {/* 폼 */}
            <div className="lg:col-span-3">
              <div
                className="rounded-2xl p-6 lg:p-8"
                style={{ background: 'var(--jsm-surface)' }}
              >
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
