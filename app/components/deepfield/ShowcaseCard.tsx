import Link from 'next/link';

import type { ShowcaseSlot } from '@/lib/showcase';
import MockWindow from '@/app/components/mock/MockWindow';
import { MOCK_REGISTRY } from '@/app/components/mock/registry';

interface Props {
  slot: ShowcaseSlot;
  size?: 'feature' | 'standard';
  index: number;
}

// 라이트 쇼케이스 카드 — surface-alt 스테이지 위에 흰 MockWindow가 떠 있는 "framed screen".
// 서버 컴포넌트 (캔버스/시드/그래디언트 전량 제거).
export default function ShowcaseCard({ slot, size = 'standard' }: Props) {
  const Mock = MOCK_REGISTRY[slot.mock];
  const isFeature = size === 'feature';
  const isLink = Boolean(slot.href);

  const body = (
    <div
      className={[
        'group/card flex h-full flex-col rounded-2xl border p-5 lg:p-6',
        'transition-[transform,box-shadow,border-color] duration-300',
        '[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
        'motion-safe:hover:-translate-y-1 hover:shadow-[0_24px_60px_-32px_rgba(15,23,42,0.4)]',
        isLink ? 'cursor-pointer' : '',
      ].join(' ')}
      style={{ background: 'var(--jsm-surface-alt)', borderColor: 'var(--jsm-line)' }}
    >
      <MockWindow title={`${slot.slug}.app`} className="group-hover/card:border-[var(--jsm-accent-soft)]">
        <Mock />
      </MockWindow>

      <div className="mt-5">
        <span
          className="font-mono text-[11px] uppercase tracking-[0.18em]"
          style={{ color: 'var(--jsm-accent)' }}
        >
          {slot.label}
        </span>
        <h3
          className={[
            'mt-1.5 font-bold [word-break:keep-all]',
            isFeature ? 'text-xl' : 'text-lg',
          ].join(' ')}
          style={{ color: 'var(--jsm-ink)', letterSpacing: '-0.02em' }}
        >
          {slot.title}
        </h3>
        <p
          className="mt-1.5 text-sm leading-relaxed [word-break:keep-all]"
          style={{ color: 'var(--jsm-ink-soft)', letterSpacing: '-0.01em' }}
        >
          {slot.desc}
        </p>

        {isLink && (
          <span
            className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold transition-transform duration-300 group-hover/card:translate-x-1"
            style={{ color: 'var(--jsm-accent)' }}
          >
            데모 보기
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link href={slot.href!} aria-label={slot.title} className="block h-full">
        {body}
      </Link>
    );
  }

  return body;
}
