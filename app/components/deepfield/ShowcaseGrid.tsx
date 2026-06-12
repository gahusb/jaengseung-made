import type { ShowcaseSlot } from '@/lib/showcase';

import ScrollReveal from './ScrollReveal';
import ShowcaseCard from './ShowcaseCard';

interface Props {
  slots: ShowcaseSlot[];
  variant: 'home' | 'full';
}

/**
 * home: 6슬롯 비대칭 — 1번 feature(col-span-2 좌측) / 2·3 standard /
 *       4번 feature(col-span-2 우측 배치로 리듬 변화) / 5·6 standard.
 *       모바일은 1col 전부 standard.
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

  // 데스크톱 흐름 (3col):
  //   row1: [0 feature span2][1 std]
  //   row2: [2 std][3 std][?]  — 3번을 col-start-1로 줄바꿈,
  //   row3: [4 std][5 feature span2 우측]  ← 4번 와이드를 우측에 두어 리듬 변화
  // col-start로 흐름을 고정해 비대칭 리듬을 결정적으로 만든다.
  const layout: Array<{ span: string; size: 'feature' | 'standard' }> = [
    { span: 'md:col-span-2 md:col-start-1', size: 'feature' }, // 0 — 좌측 와이드
    { span: 'md:col-span-1', size: 'standard' }, // 1 — 우측 1칸
    { span: 'md:col-span-1 md:col-start-1', size: 'standard' }, // 2 — 다음 줄 시작
    { span: 'md:col-span-1', size: 'standard' }, // 3
    { span: 'md:col-span-1 md:col-start-1', size: 'standard' }, // 4 — 다음 줄 시작
    { span: 'md:col-span-2', size: 'feature' }, // 5 — 우측 와이드 (리듬 변화)
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
