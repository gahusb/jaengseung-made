'use client';

import { useMemo } from 'react';

// ── 천간 / 지지 ───────────────────────────────────────────────────────
const STEMS      = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const STEMS_KR   = ['갑','을','병','정','무','기','경','신','임','계'];
const BRANCHES   = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const BRANCHES_KR= ['자','축','인','묘','진','사','오','미','신','유','술','해'];

const STEM_ELEM: Record<string,string>   = { '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水' };
const BRANCH_ELEM: Record<string,string> = { '子':'水','亥':'水','寅':'木','卯':'木','巳':'火','午':'火','申':'金','酉':'金','丑':'土','辰':'土','未':'土','戌':'土' };

// 1900-01-01 = 甲戌 (stem=0, branch=10) — CLAUDE.md 검증 완료
const BASE_MS = Date.UTC(1900, 0, 1);

function getTodayPillar() {
  const now   = new Date();
  const todayMs = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const diff    = Math.round((todayMs - BASE_MS) / 86400000);
  const si      = ((0  + diff) % 10 + 10) % 10;
  const bi      = ((10 + diff) % 12 + 12) % 12;
  return {
    stem: STEMS[si], stemKr: STEMS_KR[si],
    branch: BRANCHES[bi], branchKr: BRANCHES_KR[bi],
    stemElem: STEM_ELEM[STEMS[si]]   ?? '木',
    branchElem: BRANCH_ELEM[BRANCHES[bi]] ?? '水',
    year:  now.getFullYear(), month: now.getMonth() + 1, date: now.getDate(),
  };
}

// ── 오행 상생·상극 ────────────────────────────────────────────────────
const GENERATES: Record<string,string> = { '木':'火','火':'土','土':'金','金':'水','水':'木' };
const OVERCOMES:  Record<string,string> = { '木':'土','火':'金','土':'水','金':'木','水':'火' };

type Rel = 'same'|'generates'|'generated'|'overcomes'|'overcome'|'neutral';
function getRelation(a: string, b: string): Rel {
  if (a === b)               return 'same';
  if (GENERATES[a] === b)    return 'generates';
  if (GENERATES[b] === a)    return 'generated';
  if (OVERCOMES[a]  === b)   return 'overcomes';
  if (OVERCOMES[b]  === a)   return 'overcome';
  return 'neutral';
}

// ── 오늘 종합 점수 (0–100) ────────────────────────────────────────────
function calcOverallScore(stemElem: string, branchElem: string, yongShin: string, heeShin: string) {
  let score = 50;
  const add = (rel: Rel, weight: number) => {
    if (rel === 'same')                           score += 25 * weight;
    else if (rel === 'generates' || rel === 'generated') score += 15 * weight;
    else if (rel === 'overcomes')                 score -= 20 * weight;
    else if (rel === 'overcome')                  score -= 8  * weight;
  };
  add(getRelation(stemElem,   yongShin), 1);
  add(getRelation(branchElem, yongShin), 0.8);
  add(getRelation(stemElem,   heeShin),  0.3);
  add(getRelation(branchElem, heeShin),  0.2);
  return Math.round(Math.max(10, Math.min(100, score)));
}

type Level = 'great'|'good'|'neutral'|'caution';
function toLevel(s: number): Level {
  if (s >= 78) return 'great';
  if (s >= 58) return 'good';
  if (s >= 38) return 'neutral';
  return 'caution';
}

// ── 결정론적 랜덤 ────────────────────────────────────────────────────
function seededRand(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

// ── 운세 항목 빌드 ────────────────────────────────────────────────────
type Area = { icon: string; label: string; score: number; desc: string };

const DESCS: Record<string, Record<Level, string>> = {
  money: {
    great:   '재물 흐름이 활발합니다. 작은 투자나 구매 결정에 긍정적인 시기입니다.',
    good:    '재물 운이 순조롭습니다. 무리하지 않는 범위에서 움직이면 이익이 납니다.',
    neutral: '수입·지출이 균형을 이루는 날. 큰 결정은 잠시 미루세요.',
    caution: '충동 지출에 주의하세요. 중요한 금전 거래는 신중히 검토하세요.',
  },
  love: {
    great:   '감정 교류가 잘 이루어지는 날. 마음을 전하기 좋은 타이밍입니다.',
    good:    '관계에 따뜻한 기운이 감돕니다. 오래 연락 못 했던 사람에게 먼저 다가가 보세요.',
    neutral: '평온한 관계를 유지하는 날입니다. 억지로 변화를 만들 필요 없습니다.',
    caution: '오해가 생기기 쉬운 날입니다. 중요한 대화는 감정이 차분해진 후에 하세요.',
  },
  career: {
    great:   '능력이 잘 발휘되는 날. 중요한 프레젠테이션이나 면담에 최적입니다.',
    good:    '업무 효율이 올라가는 날입니다. 오늘 마무리한 과제는 좋은 결과로 이어집니다.',
    neutral: '꾸준히 하던 일을 이어가는 날. 새 프로젝트보다 마무리에 집중하세요.',
    caution: '실수가 생기기 쉬운 날입니다. 중요한 결재·계약은 하루 늦춰보세요.',
  },
  health: {
    great:   '체력·집중력 모두 좋은 날. 평소보다 활동량을 늘려도 괜찮습니다.',
    good:    '컨디션이 안정적입니다. 가벼운 운동으로 기운을 더 끌어올리세요.',
    neutral: '무리하지 않는 것이 최선. 충분한 수분과 수면을 챙겨주세요.',
    caution: '피로가 쌓이기 쉬운 날입니다. 무리한 약속은 피하고 충분히 쉬세요.',
  },
  social: {
    great:   '대인관계 운이 열린 날. 중요한 만남·협상에 유리한 시기입니다.',
    good:    '사교적 기운이 넘칩니다. 새 인맥을 만들거나 협업을 제안해보세요.',
    neutral: '조용히 자신의 일에 집중하는 날. 복잡한 인간관계는 잠시 내려놓으세요.',
    caution: '갈등이 생기기 쉬운 날입니다. 중요한 협상은 다음 기회로 미루는 것이 현명합니다.',
  },
};

function buildAreas(
  overall: number,
  yongShin: string, heeShin: string,
  yearNum: number, monthNum: number, dayNum: number,
): Area[] {
  const now  = new Date();
  const seed = yearNum * 1_000_000 + monthNum * 10_000 + dayNum * 100 + now.getFullYear() % 100 * 10 + now.getMonth();
  const rand = seededRand(seed);
  const roll = () => Math.round(Math.max(15, Math.min(98, rand() * 40 + overall - 20)));
  const keys = ['money','love','career','health','social'] as const;
  const icons  = ['💰','💕','🎯','🌿','🤝'];
  const labels = ['재물운','애정운','직업운','건강운','사회운'];
  return keys.map((k, i) => {
    const s = roll();
    return { icon: icons[i], label: labels[i], score: s, desc: DESCS[k][toLevel(s)] };
  });
}

// ── 레벨별 색상/라벨 ─────────────────────────────────────────────────
const LEVEL_META: Record<Level, { emoji: string; label: string; bar: string; bg: string; border: string; text: string; badge: string }> = {
  great:   { emoji:'🌟', label:'아주 좋은 날',   bar:'#f59e0b', bg:'bg-amber-50',  border:'border-amber-300', text:'text-amber-800',  badge:'bg-amber-100 text-amber-700 border-amber-300' },
  good:    { emoji:'✨', label:'좋은 날',        bar:'#22c55e', bg:'bg-emerald-50',border:'border-emerald-300',text:'text-emerald-800',badge:'bg-emerald-100 text-emerald-700 border-emerald-300' },
  neutral: { emoji:'🌤️', label:'평온한 날',      bar:'#64748b', bg:'bg-slate-50',  border:'border-slate-200', text:'text-slate-700',  badge:'bg-slate-100 text-slate-600 border-slate-200' },
  caution: { emoji:'⚠️', label:'조심하는 날',    bar:'#f97316', bg:'bg-orange-50', border:'border-orange-300',text:'text-orange-800', badge:'bg-orange-100 text-orange-700 border-orange-300' },
};

const REL_DESC: (yongShin: string, yongShinKr: string) => Record<Rel, string> = (y, yk) => ({
  same:      `오늘 기운이 당신의 용신 ${y}(${yk})과 같은 오행으로 강하게 공명합니다.`,
  generates: `오늘 기운이 용신 ${y}(${yk})을 생(生)해줍니다. 순조롭게 힘이 실리는 날.`,
  generated: `용신 ${y}(${yk})이 오늘 기운을 생(生)해주고 있어 에너지를 베풀기 좋은 날입니다.`,
  overcomes: `오늘 기운이 용신 ${y}(${yk})을 극(克)합니다. 신중하게 움직이는 것이 좋습니다.`,
  overcome:  `용신 ${y}(${yk})이 오늘 기운을 극(克)합니다. 주도적으로 판단하기 좋은 날.`,
  neutral:   `오늘 기운과 용신 ${y}(${yk})은 독립적으로 작용합니다. 차분하게 나아가세요.`,
});

// ── 점수 바 ──────────────────────────────────────────────────────────
function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div style={{ width: `${score}%`, background: color, transition: 'width 0.8s ease' }} className="h-full rounded-full" />
      </div>
      <span className="text-[10px] font-bold w-6 text-right" style={{ color }}>{score}</span>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────
interface Props {
  yongShin: string;
  yongShinKr: string;
  heeShin: string;
  heeShinKr: string;
  yearNum: number;
  monthNum: number;
  dayNum: number;
  hasLottoSubscription: boolean;
}

export default function SajuFortuneSection({
  yongShin, yongShinKr, heeShin, heeShinKr,
  yearNum, monthNum, dayNum,
  hasLottoSubscription,
}: Props) {
  const today   = useMemo(getTodayPillar, []);
  const overall = useMemo(() => calcOverallScore(today.stemElem, today.branchElem, yongShin, heeShin), [today, yongShin, heeShin]);
  const level   = toLevel(overall);
  const meta    = LEVEL_META[level];
  const areas   = useMemo(() => buildAreas(overall, yongShin, heeShin, yearNum, monthNum, dayNum), [overall, yongShin, heeShin, yearNum, monthNum, dayNum]);
  const stemRel = getRelation(today.stemElem, yongShin);
  const relDesc = REL_DESC(yongShin, yongShinKr)[stemRel];

  return (
    <>
      {/* ── 상단 연결 화살표 ── */}
      <div className="flex flex-col items-center gap-0 py-1">
        <div className="w-px h-5 bg-gradient-to-b from-blue-200 to-amber-300" />
        <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-bold text-amber-700">
          <span>✨</span> 사주 분석에서 이어지는 오늘의 운세
        </div>
        <div className="w-px h-5 bg-gradient-to-b from-amber-300 to-amber-100" />
      </div>

      {/* ── 본문 카드 ── */}
      <div id="today-fortune" className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-sm">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-[#1a0a00] via-[#3d1a00] to-[#1a0a00] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md text-xl">
                ☀️
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-white">오늘의 운세</h2>
                <p className="text-amber-300/70 text-[11px] mt-0.5">
                  {today.year}년 {today.month}월 {today.date}일 · 일진 {today.stem}{today.branch} ({today.stemKr}{today.branchKr})
                </p>
              </div>
            </div>
            <span className={`text-[11px] font-extrabold px-3 py-1.5 rounded-full border ${meta.badge} flex-shrink-0`}>
              {meta.emoji} {meta.label}
            </span>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* 일진 × 용신 분석 */}
          <div className={`rounded-xl border p-4 ${meta.bg} ${meta.border}`}>
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${meta.text}`}
                style={{ background: 'rgba(255,255,255,0.65)' }}>
                {today.stem}{today.branch}
              </div>
              <div className="flex-1">
                <div className={`text-xs font-extrabold mb-1 ${meta.text}`}>
                  오늘 일진과 당신의 용신 {yongShin}({yongShinKr}) 분석
                </div>
                <p className={`text-xs leading-relaxed ${meta.text}`} style={{ opacity: 0.88 }}>
                  {relDesc}
                </p>
              </div>
            </div>

            {/* 종합 점수 바 */}
            <div className="mt-3 flex items-center gap-3">
              <span className="text-[11px] font-bold text-slate-500">오늘 종합 운세</span>
              <div className="flex-1 h-2.5 bg-white/70 rounded-full overflow-hidden border border-white/50">
                <div
                  style={{ width: `${overall}%`, background: `linear-gradient(90deg, ${meta.bar}cc, ${meta.bar})` }}
                  className="h-full rounded-full"
                />
              </div>
              <span className="text-sm font-extrabold" style={{ color: meta.bar }}>{overall}점</span>
            </div>
          </div>

          {/* 5대 운세 그리드 */}
          <div>
            <h3 className="text-xs font-extrabold text-[#04102b] mb-3">오늘의 분야별 운세</h3>
            <div className="space-y-3">
              {areas.map((area) => {
                const aLevel = toLevel(area.score);
                const aMeta  = LEVEL_META[aLevel];
                return (
                  <div key={area.label} className="flex gap-3 items-start">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${aMeta.bg} border ${aMeta.border}`}>
                      {area.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-[#04102b]">{area.label}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${aMeta.badge}`}>{aMeta.emoji}</span>
                      </div>
                      <ScoreBar score={area.score} color={aMeta.bar} />
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{area.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 면책 */}
          <p className="text-center text-[11px] text-slate-400 leading-relaxed">
            오늘의 운세는 당신의 사주 용신({yongShinKr}·{yongShin})과 오늘 일진의 오행 상호작용을 기반으로 합니다.<br />
            명리학적 참고 자료이며 결과를 보장하지 않습니다.
          </p>

          {/* 로또 CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-[#04102b] via-[#0d1f5c] to-[#04102b] border border-[#1a3a7a] p-5 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">🎱</span>
                <span className="text-xs font-extrabold text-amber-300">
                  {level === 'great' ? '오늘 운이 아주 좋습니다! 로또도 한 번 도전해보세요.' : '사주 기반 행운 번호도 확인해보세요.'}
                </span>
              </div>
              <p className="text-xs text-blue-200/70 leading-relaxed mb-4">
                용신 <strong className="text-amber-300">{yongShin}({yongShinKr})</strong> 오행이 담긴
                사주 기반 로또 번호가 아래에 준비되어 있습니다.
                {hasLottoSubscription
                  ? ' 구독 중이신 로또 서비스의 매주 최신 추천 번호도 함께 확인하세요.'
                  : ' 로또 구독 시 대운 교차 분석으로 더 정밀한 번호를 매주 받을 수 있어요.'}
              </p>
              <a
                href="#saju-lotto-section"
                onClick={e => {
                  e.preventDefault();
                  document.getElementById('saju-lotto-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="block w-full text-center bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#04102b] text-sm font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-lg cursor-pointer"
              >
                오늘의 로또 번호 추천 보기 ↓
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 연결 */}
      <div className="flex flex-col items-center gap-0 py-1">
        <div className="w-px h-5 bg-gradient-to-b from-amber-200 to-blue-300" />
        <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-[11px] font-bold text-blue-700">
          <span>🎱</span> 오늘의 운세에서 이어지는 사주 로또 추천
        </div>
        <div className="w-px h-5 bg-gradient-to-b from-blue-200 to-transparent" />
      </div>
    </>
  );
}
