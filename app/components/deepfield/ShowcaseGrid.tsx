import type { ShowcaseSlot } from '@/lib/showcase';

import ScrollReveal from './ScrollReveal';
import ShowcaseCard from './ShowcaseCard';

interface Props {
  slots: ShowcaseSlot[];
  variant: 'home' | 'full';
}

/**
 * home: 6슬롯 지그재그 — wide(col-span-2) 3장 + standard 3장 = 9셀(3×3 완전 충전)
 *   row1: [0 feature span2][1 std]
 *   row2: [2 std][3 feature span2]
 *   row3: [4 feature span2][5 std]
 *   모바일은 1col 전부 standard.
 * full: 8슬롯 데스크톱 2col 균등(standard), 모바일 1col.
 */
export default function ShowcaseGrid({ slots, variant }: Props) {
  if (variant === 'full') {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {slots.slice(0, 8).map((slot, i) => (
          <ScrollReveal key={slot.slug} delay={i * 80}>
            <ShowcaseCard slot={slot} size="standard" index={i} />
          </ScrollReveal>
        ))}
      </div>
    );
  }

  // home — 6슬롯 (3col 그리드)
  const items = slots.slice(0, 6);

  // 데스크톱 흐름 (3col) — wide(span-2) 3장 + standard 3장 = 9셀, 빈 칸 없음
  //   row1: [0 feature span2 좌][1 std 우]          → 2+1 = 3
  //   row2: [2 std 좌][3 feature span2 우]           → 1+2 = 3
  //   row3: [4 feature span2 좌][5 std 우]           → 2+1 = 3
  // 자동 흐름(auto-placement)이 위 순서를 보장하므로 col-start 불필요.
  const layout: Array<{ span: string; size: 'feature' | 'standard' }> = [
    { span: 'md:col-span-2', size: 'feature' },  // 0 — row1 좌 와이드
    { span: 'md:col-span-1', size: 'standard' }, // 1 — row1 우 1칸
    { span: 'md:col-span-1', size: 'standard' }, // 2 — row2 좌 1칸
    { span: 'md:col-span-2', size: 'feature' },  // 3 — row2 우 와이드
    { span: 'md:col-span-2', size: 'feature' },  // 4 — row3 좌 와이드
    { span: 'md:col-span-1', size: 'standard' }, // 5 — row3 우 1칸
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
      {items.map((slot, i) => {
        const cfg = layout[i] ?? { span: 'md:col-span-1', size: 'standard' as const };
        return (
          <ScrollReveal key={slot.slug} delay={i * 80} className={cfg.span}>
            <ShowcaseCard slot={slot} size={cfg.size} index={i} />
          </ScrollReveal>
        );
      })}
    </div>
  );
}
