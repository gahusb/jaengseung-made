import Link from 'next/link';
import type { Metadata } from 'next';
import OutsourcingRequestForm from '@/app/components/OutsourcingRequestForm';

import HeroField from '@/app/components/deepfield/HeroField';
import ShowcaseGrid from '@/app/components/deepfield/ShowcaseGrid';
import ScrollReveal from '@/app/components/deepfield/ScrollReveal';
import { SHOWCASE_SLOTS } from '@/lib/showcase';

// 외주 개발 의뢰 페이지 (서버 컴포넌트) — Deep Field 다크 캔버스.
// PublicShell이 TopNav(h-16, /outsourcing 다크 인지)·푸터·main 배경(라이트)을 제공한다.
// 이 페이지는 자기 풀-블리드 다크 배경을 소유해 main의 라이트 배경을 덮고,
// 메인(/)과 동일한 비주얼 언어(다크 루트 div + -mt-16 hero + 섹션 border-t 리듬 + 모노 라벨 헤더)를 따른다.

export const metadata: Metadata = {
  title: '외주 개발',
  description:
    '24시간 돌아가는 실서비스를 직접 설계·운영하는 손으로, 맞춤 소프트웨어를 만들어 드립니다. 웹 서비스·업무 자동화·API·백엔드·봇·AI 연동까지 기획부터 납품·하자보수까지 단독으로 책임집니다.',
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
  { n: '03', t: '계약·착수', d: '계약서 체결 후 착수금 30%를 받고 개발을 시작합니다.' },
  { n: '04', t: '개발·중간 공유', d: '주 1회 이상 진행 상황을 공유하며 방향을 맞춰 갑니다.' },
  { n: '05', t: '납품·검수', d: '완성본을 인도하고 함께 검수합니다. 전체 소스와 배포 문서를 전달합니다.' },
  { n: '06', t: '무상 하자보수 30일', d: '납품 후 30일간 결함·수정을 무상으로 대응해 안정화까지 책임집니다.' },
];

// 기존 work/freelance(lib/freelance-portfolio) 실사례를 다크 토큰 기준으로 재구성.
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
    // 풀-블리드 다크 캔버스 — main의 라이트 배경을 덮는다.
    <div style={{ background: 'var(--jsm-dark-bg)', color: 'var(--jsm-dark-ink)' }}>
      {/* ─────────────────── 1. HERO (축약 ~60vh) ─────────────────── */}
      {/* -mt-16 pt-16: 고정 헤더 아래로 끌어올려 상단 라이트 띠 제거 */}
      <section className="relative -mt-16 flex min-h-[60vh] items-center overflow-hidden pt-16">
        <HeroField className="absolute inset-0" />
        {/* 콘텐츠 가독성용 스크림 (radial 광원 위 텍스트 대비) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(7,13,26,0.55) 0%, transparent 30%, transparent 62%, rgba(7,13,26,0.78) 100%)',
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span
              className="mb-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: 'var(--jsm-accent-bright)' }}
            >
              <span
                className="inline-block h-1 w-1 rounded-full"
                style={{ background: 'var(--jsm-accent-bright)' }}
              />
              outsourcing
            </span>
            <h1
              className="font-bold break-keep"
              style={{
                color: 'var(--jsm-dark-ink)',
                fontSize: 'clamp(2.4rem, 7vw, 5rem)',
                lineHeight: 1.06,
                letterSpacing: '-0.04em',
              }}
            >
              맞춤 소프트웨어
              <br />
              외주 개발
              <span style={{ color: 'var(--jsm-accent-bright)' }}>.</span>
            </h1>
            <p
              className="mt-7 max-w-2xl break-keep text-lg leading-relaxed lg:text-xl"
              style={{ color: 'var(--jsm-dark-soft)', ...KOR_BODY }}
            >
              기획 정리가 안 됐어도 괜찮습니다. 상담에서 함께 정리합니다.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 font-semibold text-white transition-transform duration-200 hover:translate-y-[-1px]"
                style={{ background: 'var(--jsm-accent)', ...KOR_BODY }}
              >
                의뢰 내용 보내기
                <ArrowRight />
              </Link>
              <Link
                href="#showcase"
                className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3.5 font-semibold transition-colors duration-200 hover:bg-[var(--jsm-dark-surface)]"
                style={{
                  color: 'var(--jsm-dark-ink)',
                  borderColor: 'var(--jsm-dark-line)',
                  ...KOR_BODY,
                }}
              >
                작업 화면 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── 2. SHOWCASE (풀 그리드) ─────────────────── */}
      <section id="showcase" className="scroll-mt-20 border-t" style={{ borderColor: 'var(--jsm-dark-line)' }}>
        {/* 하위 호환: 기존 /outsourcing#portfolio 링크(메인 footer 등)용 앵커 유지 */}
        <div id="portfolio" className="scroll-mt-20" />
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
          <ScrollReveal>
            <p
              className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: 'var(--jsm-accent-bright)' }}
            >
              showcase
            </p>
            <h2
              className="max-w-2xl break-keep text-3xl font-bold lg:text-[2.75rem] lg:leading-[1.12]"
              style={{ color: 'var(--jsm-dark-ink)', letterSpacing: '-0.03em' }}
            >
              우리가 만드는 화면들
            </h2>
          </ScrollReveal>

          <div className="mt-14">
            <ShowcaseGrid slots={SHOWCASE_SLOTS} variant="full" />
          </div>
        </div>
      </section>

      {/* ─────────────────── 3. 운영 실사례 ─────────────────── */}
      <section className="border-t" style={{ borderColor: 'var(--jsm-dark-line)' }}>
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
          <ScrollReveal>
            <p
              className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: 'var(--jsm-accent-bright)' }}
            >
              in production
            </p>
            <h2
              className="max-w-2xl break-keep text-3xl font-bold lg:text-[2.75rem] lg:leading-[1.12]"
              style={{ color: 'var(--jsm-dark-ink)', letterSpacing: '-0.03em' }}
            >
              직접 개발하고, 실제로 굴러가는 결과물
            </h2>
            <p
              className="mt-4 max-w-xl break-keep leading-relaxed"
              style={{ color: 'var(--jsm-dark-soft)', ...KOR_BODY }}
            >
              운영 중인 서비스와 납품 완료 프로젝트입니다. 의뢰하신 프로젝트도 같은 깊이로 만듭니다.
            </p>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CASES.map((c, i) => (
              <ScrollReveal key={c.t} delay={i * 80}>
                <div
                  className="flex h-full flex-col rounded-2xl border p-7"
                  style={{
                    background: 'var(--jsm-dark-surface)',
                    borderColor: 'var(--jsm-dark-line)',
                  }}
                >
                  <span
                    className="mb-5 inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={
                      c.live
                        ? { color: 'var(--jsm-accent-bright)', background: 'rgba(96,165,250,0.12)' }
                        : { color: 'var(--jsm-dark-soft)', background: 'rgba(148,163,184,0.08)' }
                    }
                  >
                    {c.live && (
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: 'var(--jsm-accent-bright)' }}
                      />
                    )}
                    {c.cat}
                  </span>
                  <h3
                    className="break-keep text-lg font-bold"
                    style={{ color: 'var(--jsm-dark-ink)', ...KOR_TIGHT }}
                  >
                    {c.t}
                  </h3>
                  <p
                    className="mt-2.5 flex-1 break-keep text-sm leading-relaxed"
                    style={{ color: 'var(--jsm-dark-soft)', ...KOR_BODY }}
                  >
                    {c.d}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {c.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded px-2.5 py-1 text-xs"
                        style={{
                          color: 'var(--jsm-dark-soft)',
                          background: 'rgba(148,163,184,0.08)',
                          ...KOR_BODY,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── 4a. 제공 분야 ─────────────────── */}
      <section className="border-t" style={{ borderColor: 'var(--jsm-dark-line)' }}>
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
          <ScrollReveal>
            <p
              className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: 'var(--jsm-accent-bright)' }}
            >
              scope
            </p>
            <h2
              className="max-w-2xl break-keep text-3xl font-bold lg:text-[2.75rem] lg:leading-[1.12]"
              style={{ color: 'var(--jsm-dark-ink)', letterSpacing: '-0.03em' }}
            >
              이런 것들을 만들어 드립니다
            </h2>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FIELDS.map((f, i) => (
              <ScrollReveal key={f.t} delay={i * 80}>
                <div
                  className="h-full rounded-2xl border p-7"
                  style={{
                    background: 'var(--jsm-dark-surface)',
                    borderColor: 'var(--jsm-dark-line)',
                  }}
                >
                  <h3
                    className="break-keep text-lg font-bold"
                    style={{ color: 'var(--jsm-dark-ink)', ...KOR_TIGHT }}
                  >
                    {f.t}
                  </h3>
                  <p
                    className="mt-2.5 break-keep text-sm leading-relaxed"
                    style={{ color: 'var(--jsm-dark-soft)', ...KOR_BODY }}
                  >
                    {f.d}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── 4b. 진행 프로세스 ─────────────────── */}
      <section id="process" className="scroll-mt-20 border-t" style={{ borderColor: 'var(--jsm-dark-line)' }}>
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
          <ScrollReveal>
            <p
              className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: 'var(--jsm-accent-bright)' }}
            >
              process
            </p>
            <h2
              className="max-w-2xl break-keep text-3xl font-bold lg:text-[2.75rem] lg:leading-[1.12]"
              style={{ color: 'var(--jsm-dark-ink)', letterSpacing: '-0.03em' }}
            >
              상담부터 하자보수까지, 흐름이 분명합니다
            </h2>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS.map((s, i) => (
              <ScrollReveal key={s.n} delay={i * 80}>
                <div
                  className="relative h-full rounded-2xl border p-7 lg:p-8"
                  style={{
                    background: 'var(--jsm-dark-surface)',
                    borderColor: 'var(--jsm-dark-line)',
                  }}
                >
                  <span
                    className="relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-full font-mono text-sm font-bold"
                    style={{
                      color: 'var(--jsm-accent-bright)',
                      background: 'var(--jsm-dark-bg)',
                      boxShadow: 'inset 0 0 0 1px var(--jsm-dark-line)',
                    }}
                  >
                    {s.n}
                  </span>
                  <h3
                    className="mt-5 break-keep text-lg font-bold"
                    style={{ color: 'var(--jsm-dark-ink)', ...KOR_TIGHT }}
                  >
                    {s.t}
                  </h3>
                  <p
                    className="mt-2 break-keep text-sm leading-relaxed"
                    style={{ color: 'var(--jsm-dark-soft)', ...KOR_BODY }}
                  >
                    {s.d}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── 5. FAQ ─────────────────── */}
      <section className="border-t" style={{ borderColor: 'var(--jsm-dark-line)' }}>
        <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8 lg:py-32">
          <ScrollReveal>
            <p
              className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: 'var(--jsm-accent-bright)' }}
            >
              faq
            </p>
            <h2
              className="break-keep text-3xl font-bold lg:text-[2.75rem] lg:leading-[1.12]"
              style={{ color: 'var(--jsm-dark-ink)', letterSpacing: '-0.03em' }}
            >
              자주 묻는 질문
            </h2>
          </ScrollReveal>

          <div className="mt-14 space-y-3">
            {FAQ.map((item, i) => (
              <ScrollReveal key={item.q} delay={i * 80}>
                <details
                  className="group overflow-hidden rounded-2xl border"
                  style={{
                    background: 'var(--jsm-dark-surface)',
                    borderColor: 'var(--jsm-dark-line)',
                  }}
                >
                  <summary
                    className="flex cursor-pointer list-none items-center justify-between gap-4 break-keep px-6 py-5 font-semibold"
                    style={{ color: 'var(--jsm-dark-ink)', ...KOR_TIGHT }}
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
                      style={{ color: 'var(--jsm-dark-soft)' }}
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </summary>
                  <p
                    className="break-keep px-6 pb-5 text-sm leading-relaxed"
                    style={{ color: 'var(--jsm-dark-soft)', ...KOR_BODY }}
                  >
                    {item.a}
                  </p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── 6. 의뢰 폼 ─────────────────── */}
      <section id="contact" className="scroll-mt-20 border-t" style={{ borderColor: 'var(--jsm-dark-line)' }}>
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
            {/* 안내 */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <p
                  className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: 'var(--jsm-accent-bright)' }}
                >
                  contact
                </p>
                <h2
                  className="break-keep text-3xl font-bold leading-tight lg:text-[2.5rem]"
                  style={{ color: 'var(--jsm-dark-ink)', ...KOR_TIGHT }}
                >
                  프로젝트 문의
                </h2>
                <p
                  className="mt-5 break-keep text-lg leading-relaxed"
                  style={{ color: 'var(--jsm-dark-soft)', ...KOR_BODY }}
                >
                  영업일 2일 내에 회신드립니다. 아이디어 단계여도 괜찮습니다 — 상담에서 방향을
                  함께 잡아드립니다.
                </p>
                <div
                  className="mt-8 space-y-3 border-t pt-8"
                  style={{ borderColor: 'var(--jsm-dark-line)' }}
                >
                  <a
                    href="mailto:bgg8988@gmail.com"
                    className="flex items-center gap-3 text-sm transition-colors hover:text-[var(--jsm-dark-ink)]"
                    style={{ color: 'var(--jsm-dark-soft)', ...KOR_BODY }}
                  >
                    <span
                      className="w-12 font-mono text-xs uppercase tracking-wider"
                      style={{ color: 'var(--jsm-accent-bright)' }}
                    >
                      Mail
                    </span>
                    bgg8988@gmail.com
                  </a>
                  <a
                    href="tel:010-3907-1392"
                    className="flex items-center gap-3 text-sm transition-colors hover:text-[var(--jsm-dark-ink)]"
                    style={{ color: 'var(--jsm-dark-soft)', ...KOR_BODY }}
                  >
                    <span
                      className="w-12 font-mono text-xs uppercase tracking-wider"
                      style={{ color: 'var(--jsm-accent-bright)' }}
                    >
                      Tel
                    </span>
                    010-3907-1392
                  </a>
                </div>
              </ScrollReveal>
            </div>

            {/* 폼 */}
            <div className="lg:col-span-3">
              <ScrollReveal delay={100}>
                <div
                  className="rounded-2xl border p-6 lg:p-8"
                  style={{
                    background: 'var(--jsm-dark-surface)',
                    borderColor: 'var(--jsm-dark-line)',
                  }}
                >
                  <OutsourcingRequestForm />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
