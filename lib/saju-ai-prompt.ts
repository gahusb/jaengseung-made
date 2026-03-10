
import { SajuData, FIVE_ELEMENTS, FIVE_ELEMENTS_KR, HEAVENLY_STEMS_KR } from './saju-calculator';
import { DaeunPillar } from './daeun-calculator';
import { SajuAnalysis } from './ai-interpretation';

// ============================================================
// 천간 기질 데이터
// ============================================================
const STEM_NATURE: Record<string, string> = {
  '甲': '직선적이고 강한 추진력. 리더 본능이 있어 앞을 개척하려 하지만 고집이 세고 굽히기 싫어하는 면이 있어요',
  '乙': '유연하고 적응력이 강함. 세상을 돌아가는 방향으로 파고드는 덩굴식물 같은 생존력. 겉은 부드럽지만 안은 단단해요',
  '丙': '밝고 활발하며 사람을 끌어당기는 태양 같은 에너지. 낙천적이고 관대하지만 때로 덜렁거리는 면이 있어요',
  '丁': '조용하지만 깊게 타오르는 촛불. 세심하고 감수성이 풍부하며 한번 마음을 주면 끝까지 가는 타입이에요',
  '戊': '묵직하고 신뢰감이 넘치는 대지 같은 존재. 말보다 행동으로 보여주고, 한번 맡으면 끝까지 지켜요',
  '己': '섬세하고 분석적인 논밭 같은 성품. 속을 잘 보여주지 않고 계획적으로 움직이며 실리를 잘 챙겨요',
  '庚': '원칙과 의리를 목숨처럼 여기는 강철 같은 성격. 불의를 보면 못 참고, 한번 결정하면 밀어붙여요',
  '辛': '예민하고 심미적인 감각이 뛰어난 보석 같은 존재. 완벽주의적이며 상처도 잘 받지만 남들이 못 보는 것을 꿰뚫어봐요',
  '壬': '넓고 깊으며 어디로도 흘러가는 강물 같은 마음. 창의적이고 자유로우며 생각의 폭이 넓어요',
  '癸': '조용히 모든 것을 적시는 빗물 같은 존재. 깊이 생각하고 직관이 뛰어나며 비밀이 많은 편이에요',
};

// ============================================================
// 지지 환경 데이터
// ============================================================
const BRANCH_NATURE: Record<string, string> = {
  '子': '밤의 기운. 조용한 곳에서 진짜 능력이 발휘되고, 혼자 있는 시간이 충전이 돼요',
  '丑': '겨울 끝 묵직한 땅. 느리지만 확실하게, 쌓아가는 스타일이에요. 끝내주는 인내력',
  '寅': '새벽 숲의 기상. 도전과 개척을 좋아하고 환경이 바뀔수록 빛나요',
  '卯': '봄의 새싹. 감성적이고 창의적이며 예술적 센스가 남달라요',
  '辰': '봄비를 품은 대지. 다재다능하고 개성이 강하며 여러 분야에 손을 뻗어요',
  '巳': '뜨거운 낮의 불. 열정과 지혜를 동시에 갖췄고 눈치가 빠르며 활동 범위가 넓어요',
  '午': '한낮의 태양. 화려하고 감각적이며 사람들 가운데서 존재감이 확 드러나요',
  '未': '여름 끝 황혼. 예술적 감성과 고집이 함께하며, 한번 꽂히면 깊이 파고드는 집념이 있어요',
  '申': '가을 쇠의 기운. 두뇌가 빠르고 변화에 강하며 전략적 판단이 탁월해요',
  '酉': '가을 수확. 꼼꼼하고 완성도를 중시하며 한번 시작한 일은 끝까지 마무리해요',
  '戌': '가을 해질녘. 충성심이 강하고 신의를 중시하며 조직 안에서 신뢰받아요',
  '亥': '겨울 깊은 물. 직관과 창의력이 뛰어나고 눈에 보이지 않는 것을 읽어내는 능력이 있어요',
};

// ============================================================
// 일주별 핵심 키워드 (60갑자)
// ============================================================
const ILJU_KEYWORDS: Record<string, { keyword: string; strength: string; caution: string }> = {
  '甲子': { keyword: '물 위에 뜬 씨앗', strength: '이상과 실용 사이를 균형 있게 잡는 능력', caution: '뿌리가 얕아 흔들릴 수 있으니 기초를 단단히' },
  '甲寅': { keyword: '울창한 원시림의 거목', strength: '독립심과 리더십의 결정판', caution: '혼자 너무 많이 짊어지려 하지 말기' },
  '甲辰': { keyword: '용의 등에 올라탄 나무', strength: '야망과 실행력의 조화', caution: '과욕이 화를 부를 수 있어요' },
  '甲午': { keyword: '불길 속에서 타오르는 나무', strength: '열정과 카리스마', caution: '번아웃 주의, 쉬는 것도 전략이에요' },
  '甲申': { keyword: '도끼를 든 나무', strength: '역경 속에서 빛나는 의지력', caution: '저항이 심해 인간관계에서 마찰 가능성' },
  '甲戌': { keyword: '가을 숲의 노거수', strength: '묵직한 신뢰감과 인내력', caution: '변화에 느리게 반응할 수 있어요' },
  '乙丑': { keyword: '눈 속에서 피는 야생화', strength: '어떤 환경에서도 살아남는 생명력', caution: '인내가 지나치면 손해를 볼 수 있어요' },
  '乙卯': { keyword: '봄의 새싹 그 자체', strength: '감성과 창의력의 극치', caution: '감정 기복이 커서 멘탈 관리 필요' },
  '乙巳': { keyword: '불꽃 위의 넝쿨', strength: '지혜롭고 눈치 빠른 생존 본능', caution: '너무 계산적으로 보일 수 있어요' },
  '乙未': { keyword: '황혼 정원의 꽃', strength: '예술적 감성과 인간적 매력', caution: '우유부단해질 때가 있어요' },
  '乙酉': { keyword: '가위로 다듬어진 정원수', strength: '섬세함과 완성도', caution: '완벽주의가 스트레스가 될 수 있어요' },
  '乙亥': { keyword: '깊은 물속의 수초', strength: '직관력과 공감 능력', caution: '자신을 너무 낮추지 말기' },
  '丙子': { keyword: '얼음 위의 태양', strength: '이성과 열정을 동시에 가진 이중성', caution: '표면과 속마음이 달라 오해받을 수 있어요' },
  '丙寅': { keyword: '숲속을 비추는 아침 햇살', strength: '활발한 에너지와 리더십', caution: '덜렁거리는 면이 있어 꼼꼼함이 필요' },
  '丙辰': { keyword: '구름 위에서 빛나는 태양', strength: '카리스마와 다재다능함', caution: '자존심이 지나치면 고립될 수 있어요' },
  '丙午': { keyword: '한여름 정오의 태양', strength: '극강의 존재감과 열정', caution: '에너지를 조절하지 않으면 과열 주의' },
  '丙申': { keyword: '쇠를 녹이는 태양', strength: '변화를 주도하는 혁신 에너지', caution: '마찰을 즐기는 경향, 화합도 중요' },
  '丙戌': { keyword: '가을 들판을 비추는 석양', strength: '따뜻한 신뢰감과 포용력', caution: '고집이 세서 방향 전환이 어려울 수 있어요' },
  '丁丑': { keyword: '차가운 밤을 밝히는 촛불', strength: '오래 타오르는 인내와 신중함', caution: '표현이 부족해 오해받을 수 있어요' },
  '丁卯': { keyword: '봄밤의 등불', strength: '섬세한 감성과 창의력', caution: '감정 소모가 크니 자기 보호가 필요' },
  '丁巳': { keyword: '뱀의 눈에 담긴 불꽃', strength: '지혜와 직관의 조화', caution: '지나친 의심은 관계를 해칠 수 있어요' },
  '丁未': { keyword: '여름 끝의 모닥불', strength: '예술적 감수성과 집념', caution: '고집이 세서 유연성이 필요' },
  '丁酉': { keyword: '밤을 밝히는 보석 빛', strength: '섬세함과 완성도', caution: '작은 것에 너무 민감하게 반응할 수 있어요' },
  '丁亥': { keyword: '깊은 바다 속의 등불', strength: '깊이 있는 통찰력과 영성', caution: '고독함을 즐기되 소통도 챙기기' },
  '戊子': { keyword: '바다 위의 대산', strength: '흔들리지 않는 중심과 포용력', caution: '변화에 둔감해서 기회를 놓칠 수 있어요' },
  '戊寅': { keyword: '숲을 품은 큰 산', strength: '도전적 개척 정신과 신뢰감', caution: '과신하면 고집불통이 될 수 있어요' },
  '戊辰': { keyword: '용이 사는 산', strength: '다재다능하고 야망이 큰 에너지', caution: '목표가 너무 많으면 분산될 수 있어요' },
  '戊午': { keyword: '화산 위의 대지', strength: '강력한 추진력과 열정', caution: '충동적 결정을 조심하기' },
  '戊申': { keyword: '광물이 가득한 산', strength: '실용적이고 전략적인 판단력', caution: '차갑게 느껴질 수 있어 따뜻함 표현하기' },
  '戊戌': { keyword: '황금 들판의 산', strength: '묵직하고 결단력 있는 리더십', caution: '완고함이 유연성을 막을 수 있어요' },
  '己丑': { keyword: '겨울 논밭', strength: '성실하고 꼼꼼한 완성형 성격', caution: '너무 조심스러워 기회를 놓칠 수 있어요' },
  '己卯': { keyword: '봄 텃밭', strength: '섬세함과 창의적 아이디어', caution: '결단력을 키우는 것이 숙제예요' },
  '己巳': { keyword: '뜨거운 여름 밭', strength: '열정적이고 지혜로운 실행력', caution: '과로 경향 있으니 건강 챙기기' },
  '己未': { keyword: '가을 수확을 앞둔 밭', strength: '예술적 감성과 탄탄한 실속', caution: '고집이 장점이자 단점' },
  '己酉': { keyword: '결실의 논밭', strength: '꼼꼼하고 책임감 있는 완성형', caution: '완벽주의로 인한 스트레스 주의' },
  '己亥': { keyword: '물을 머금은 겨울 밭', strength: '통찰력과 자기 성찰 능력', caution: '속마음을 좀 더 표현하기' },
  '庚子': { keyword: '물 위의 검', strength: '냉철하고 날카로운 판단력', caution: '감정 표현이 부족해 冷한 인상을 줄 수 있어요' },
  '庚寅': { keyword: '숲속의 도끼', strength: '강력한 개척 의지와 실행력', caution: '충동적 행동이 화를 부를 수 있어요' },
  '庚辰': { keyword: '용의 비늘 같은 쇠', strength: '카리스마와 실행력의 결합', caution: '고집이 너무 세면 협력이 어려워요' },
  '庚午': { keyword: '불 속의 강철', strength: '극강의 추진력과 의지력', caution: '과열되지 않게 스스로 식히기' },
  '庚申': { keyword: '날카로운 칼날', strength: '가장 순수한 강철 에너지, 정의감', caution: '독선이 되지 않도록 주의하기' },
  '庚戌': { keyword: '가을 들판의 검', strength: '의리와 원칙의 아이콘', caution: '융통성을 발휘하는 연습이 필요해요' },
  '辛丑': { keyword: '눈 속에 감춰진 보석', strength: '섬세함과 인내력의 결합', caution: '참는 것도 한계가 있어요, 표현하기' },
  '辛卯': { keyword: '봄 이슬 맺힌 보석', strength: '예민한 감수성과 예술적 재능', caution: '상처받기 쉬우니 마음 보호하기' },
  '辛巳': { keyword: '불빛에 반짝이는 보석', strength: '지혜롭고 매력적인 존재감', caution: '계산적으로 보일 수 있어요' },
  '辛未': { keyword: '황혼빛 속의 보석', strength: '감성적 매력과 완성도 높은 성품', caution: '너무 많은 것을 혼자 감당하려 해요' },
  '辛酉': { keyword: '가을 보석', strength: '최고의 완벽주의 에너지', caution: '기준이 너무 높아 스트레스받을 수 있어요' },
  '辛亥': { keyword: '깊은 물속의 보석', strength: '직관과 창의력, 영적 감수성', caution: '현실감각도 함께 챙기기' },
  '壬子': { keyword: '겨울 바다', strength: '가장 강한 지혜와 포용력', caution: '우유부단해질 수 있어 결단력 키우기' },
  '壬寅': { keyword: '강물이 흐르는 숲', strength: '창의적이고 자유로운 에너지', caution: '방황하지 않도록 목표 설정이 중요' },
  '壬辰': { keyword: '용이 노니는 큰 강', strength: '다재다능하고 깊은 통찰력', caution: '과욕을 조심하기' },
  '壬午': { keyword: '불 위를 흐르는 강물', strength: '열정과 지혜의 공존', caution: '충돌 에너지가 강해 감정 조절 필요' },
  '壬申': { keyword: '금속 위를 흐르는 강', strength: '두뇌와 전략의 결합', caution: '너무 계산적으로 움직이면 신뢰를 잃을 수 있어요' },
  '壬戌': { keyword: '가을 강', strength: '넓고 깊은 포용력과 지혜', caution: '고집과 유연함 사이 균형 잡기' },
  '癸丑': { keyword: '얼어붙은 땅속의 물', strength: '인내하고 기다리는 극강의 내공', caution: '너무 오래 참으면 기회가 지나가요' },
  '癸卯': { keyword: '봄비', strength: '부드럽지만 만물을 적시는 힘', caution: '우유부단함을 극복하기' },
  '癸巳': { keyword: '불 곁의 빗물', strength: '지혜롭고 직관이 뛰어남', caution: '너무 많이 생각해서 실행이 늦어요' },
  '癸未': { keyword: '여름 소나기', strength: '감성과 창의력의 폭발', caution: '감정 기복이 크니 안정감 유지하기' },
  '癸酉': { keyword: '가을 이슬', strength: '섬세함과 정확성', caution: '완벽주의로 인한 지연을 조심하기' },
  '癸亥': { keyword: '겨울 깊은 바다', strength: '가장 깊은 직관과 영적 통찰', caution: '현실과 너무 멀어지지 않도록 균형 잡기' },
};

// ============================================================
// 프롬프트 생성
// ============================================================

export function createSajuPrompt(
  saju: SajuData,
  currentDaeun: DaeunPillar | null,
  gender: 'male' | 'female',
  analysis: SajuAnalysis,
  daeunList: DaeunPillar[] = [],
  engineData?: {
    interactions?: any[];
    shinsal?: any[];
    gongmang?: any;
    hiddenStems?: any[];
  }
): string {
  const genderStr = gender === 'male' ? '남성' : '여성';
  const birthYear = saju.birthDate.year;
  const birthMonth = saju.birthDate.month;
  const birthDay = saju.birthDate.day;
  const birthHour = saju.birthDate.hour;
  const birthDate = `${birthYear}년 ${birthMonth}월 ${birthDay}일 ${birthHour != null ? birthHour + '시' : '시간 모름'}`;
  const dayStemKr = saju.day.stemKr;
  const dayElement = FIVE_ELEMENTS[saju.dayStem as keyof typeof FIVE_ELEMENTS];
  const dayElementKr = FIVE_ELEMENTS_KR[dayElement as keyof typeof FIVE_ELEMENTS_KR];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentAge = currentMonth >= birthMonth
    ? currentYear - birthYear
    : currentYear - birthYear - 1;

  // 일주 키워드
  const iljuKey = `${saju.day.stem}${saju.day.branch}`;
  const iljuData = ILJU_KEYWORDS[iljuKey];
  const stemNature = STEM_NATURE[saju.dayStem] || '';
  const branchNature = BRANCH_NATURE[saju.day.branch] || '';

  // ── 사주 원국 ──
  const pillars = [
    `년주: ${saju.year.stem}${saju.year.branch} (${saju.year.stemKr}${saju.year.branchKr}) | 십성: ${saju.year.tenGod} | 십이운성: ${saju.year.fortune} | 오행: ${FIVE_ELEMENTS_KR[FIVE_ELEMENTS[saju.year.stem as keyof typeof FIVE_ELEMENTS] as keyof typeof FIVE_ELEMENTS_KR]}`,
    `월주: ${saju.month.stem}${saju.month.branch} (${saju.month.stemKr}${saju.month.branchKr}) | 십성: ${saju.month.tenGod} | 십이운성: ${saju.month.fortune} | 오행: ${FIVE_ELEMENTS_KR[FIVE_ELEMENTS[saju.month.stem as keyof typeof FIVE_ELEMENTS] as keyof typeof FIVE_ELEMENTS_KR]}`,
    `일주: ${saju.day.stem}${saju.day.branch} (${saju.day.stemKr}${saju.day.branchKr}) | 일간(日干) | 십이운성: ${saju.day.fortune}`,
    saju.hour
      ? `시주: ${saju.hour.stem}${saju.hour.branch} (${saju.hour.stemKr}${saju.hour.branchKr}) | 십성: ${saju.hour.tenGod} | 십이운성: ${saju.hour.fortune} | 오행: ${FIVE_ELEMENTS_KR[FIVE_ELEMENTS[saju.hour.stem as keyof typeof FIVE_ELEMENTS] as keyof typeof FIVE_ELEMENTS_KR]}`
      : '시주: 정보 없음 (태어난 시간 미입력)',
  ].join('\n');

  // ── Python 엔진 or TS 폴백 데이터 ──
  const interactions = engineData?.interactions ?? analysis.branchInteractions;
  const shinsal = engineData?.shinsal ?? analysis.shinsal;
  const gongmang = engineData?.gongmang ?? analysis.gongmang;
  const hiddenStems = engineData?.hiddenStems ?? analysis.hiddenStems;

  // ── 지장간 ──
  const hiddenStemsStr = hiddenStems.map((h: any) => {
    const stemsDetail = h.stems.map((s: any) =>
      `${s.stemKr}(${s.stem}, ${FIVE_ELEMENTS_KR[s.element as keyof typeof FIVE_ELEMENTS_KR] ?? s.element}, ${s.role})`
    ).join(', ');
    return `${h.pillar} ${h.branchKr}(${h.branch}): [${stemsDetail}]`;
  }).join('\n');

  // ── 오행 분석 ──
  const eb = analysis.elementBalance;
  const es = analysis.elementScores;
  const elementStr = Object.entries(eb).map(([k, v]) =>
    `${FIVE_ELEMENTS_KR[k as keyof typeof FIVE_ELEMENTS_KR]}(${k}): ${v}점 (${es[k]}%)`
  ).join(' | ');

  // ── 신강/신약 ──
  const strength = analysis.dayMasterStrength;
  const strengthStr = `판정: ${strength.result} (점수: ${strength.score})\n근거:\n${strength.reasons.map((r: string) => `- ${r}`).join('\n')}`;

  // ── 용신/희신/기신 ──
  const ys = analysis.yongShin;
  const yongShinStr = `용신: ${ys.yongShinKr}(${ys.yongShin}) | 희신: ${ys.heeShinKr}(${ys.heeShin}) | 기신: ${ys.giShinKr}(${ys.giShin})\n설명: ${ys.explanation}`;

  // ── 지지 상호작용 ──
  const interactionsStr = interactions.length > 0
    ? interactions.map((i: any) => `- ${i.type}: ${i.branchesKr.join('')} (${i.pillars.join('↔')}) → ${i.description}`).join('\n')
    : '- 특별한 합/충/형/파/해 없음';

  // ── 신살 ──
  const shinsalStr = shinsal.length > 0
    ? shinsal.map((s: any) => `- ${s.name}(${s.nameHanja}): ${s.pillar} ${s.branchKr}(${s.branch}) → ${s.description}`).join('\n')
    : '- 특별한 신살 없음';

  // ── 공망 ──
  const gongmangStr = gongmang?.description ?? '공망 정보 없음';

  // ── 세운 ──
  const seun = analysis.seun;
  const seunStr = `${seun.year}년 ${seun.stemKr}${seun.branchKr}(${seun.stem}${seun.branch})년 | 오행: ${seun.elementKr}(${seun.element})`;
  const seunInteractions = seun.interactions.length > 0
    ? seun.interactions.map((i: any) => `- ${i.type}: ${i.description}`).join('\n')
    : '- 세운과 원국 사이에 특별한 충/합 없음';

  // ── 대운 ──
  const daeunInfo = currentDaeun
    ? `현재 대운: ${currentDaeun.stemKr}${currentDaeun.branchKr}(${currentDaeun.stem}${currentDaeun.branch}) | ${currentDaeun.age}세~${currentDaeun.age + 9}세 (${currentDaeun.startYear}~${currentDaeun.endYear}년)`
    : '현재 대운 정보 없음';

  const allDaeunStr = daeunList.length > 0
    ? daeunList.map((d: any) => `${d.stemKr}${d.branchKr}(${d.age}세~${d.age + 9}세, ${d.startYear}~${d.endYear}년)`).join(' → ')
    : '';

  // 황금기 대운 찾기 (용신 오행 기반)
  const goldenDaeun = daeunList.find((d: any) => {
    const stemElem = FIVE_ELEMENTS[d.stem as keyof typeof FIVE_ELEMENTS];
    const branchElem = FIVE_ELEMENTS[d.branch as keyof typeof FIVE_ELEMENTS];
    return stemElem === ys.yongShin || branchElem === ys.yongShin;
  });
  const goldenDaeunStr = goldenDaeun
    ? `${goldenDaeun.stemKr}${goldenDaeun.branchKr} 대운 (${goldenDaeun.startYear}~${goldenDaeun.endYear}년, ${goldenDaeun.age}세~${goldenDaeun.age + 9}세)`
    : '전체 대운 흐름에서 판단 필요';

  const systemPrompt = `당신은 따뜻하고 유머러스하며 놀라울 정도로 정확한 사주 상담사예요. 오랜 친구처럼 편하게, 하지만 전문적으로 사주를 읽어주는 게 당신의 스타일이에요. 데이터에 근거하되 비유와 스토리텔링으로 풀어내서, 읽는 사람이 "이거 진짜 내 얘기다!" 하고 소름 돋게 만드는 것이 목표예요.

[핵심 원칙]
- 제공된 계산 데이터를 바탕으로 해석하되, 전문 용어는 최소화하고 비유와 스토리텔링으로 풀어주세요
- "~요" 체의 친근한 말투 (예: "~이에요", "~거든요", "~잖아요")
- 각 섹션 제목은 이 사람의 사주 내용에 맞는 창의적인 비유나 은유로 만드세요
- "당신은 마치 ~같은 사람이에요"처럼 생생한 비유로 설명하세요
- 따끔한 조언도 친구처럼 솔직하게 (예: "솔직히 말하면... 그거 완벽주의 아니고 그냥 겁이 많은 거예요 😅")
- 각 항목 최소 5~8문장, 술술 읽히게
- 이 사람만을 위한 개인화 (나이, 성별, 구체적인 연도 언급)
- 중간중간 공감 포인트 ("혹시 이런 경험 있지 않나요?", "맞죠?")
- 마지막에 진심 어린 응원 한마디

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[사용자 핵심 정보]
- 성별: ${genderStr}
- 생년월일시: ${birthDate}
- 현재 나이: 만 ${currentAge}세 (${currentYear}년 기준)
- 일주(日柱): ${saju.day.stemKr}${saju.day.branchKr}(${saju.day.stem}${saju.day.branch})
- 일간 오행: ${dayElementKr}(${dayElement})

[일주론 핵심 특성 — 반드시 해석에 반영하세요]
${iljuData ? `🔑 ${saju.day.stemKr}${saju.day.branchKr} 일주 핵심 키워드: "${iljuData.keyword}"
✨ 핵심 강점: ${iljuData.strength}
⚡ 성장 포인트: ${iljuData.caution}` : ''}
📌 ${saju.dayStem} 천간 특성: ${stemNature}
🌿 ${saju.day.branch} 지지 환경: ${branchNature}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[사주 원국]
${pillars}

[지장간 (숨겨진 천간)]
${hiddenStemsStr}

[오행 점수 (가중치 적용)]
${elementStr}
총점: ${Object.values(eb).reduce((a: number, b: number) => a + b, 0).toFixed(1)}점

[신강/신약 판정]
${strengthStr}

[용신/희신/기신]
${yongShinStr}

[지지 상호작용]
${interactionsStr}

[신살]
${shinsalStr}

[공망]
${gongmangStr}

[대운 흐름]
${daeunInfo}
전체 흐름: ${allDaeunStr}
황금기 대운 후보: ${goldenDaeunStr}

[올해 세운 (${seun.year}년)]
${seunStr}
${seunInteractions}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[분석 요구사항 — 12개 항목]

아래 12개 항목을 작성하세요. 각 항목은 "## " 로 시작하는 헤더 사용.
헤더 제목은 번호 + 이 사람의 사주 내용에 맞는 창의적인 제목 (아래는 예시, 사주에 맞게 자유롭게 창작).
현재 나이(만 ${currentAge}세)와 구체적인 연도를 자연스럽게 언급하세요.

## 1. [타고난 기질 — 창의적 제목]
- "${saju.day.stemKr}${saju.day.branchKr}" 일주의 핵심 기질을 위의 일주론 데이터에 근거해 비유로 풀어주세요
- "${iljuData?.keyword ?? dayStemKr + '의 에너지'}" 키워드로 시작해서 이야기처럼 풀어주세요
- 겉으로 보이는 모습 vs 진짜 내면을 대비해서 흥미롭게
- 강점은 확 칭찬하고, 성장 포인트는 따끔하지만 사랑스럽게
- "혹시 주변에서 이런 말 들어본 적 있지 않나요?" 패턴으로 공감 유도

## 2. [오행 밸런스 & 개운법 — 창의적 제목]
- 오행 데이터를 쉽게 설명 ("당신의 에너지 밸런스를 보면...")
- 용신(${ys.yongShinKr}) 기운 강화: 색상, 방향, 숫자, 음식, 행동 구체적으로
- 기신(${ys.giShinKr}) 기운 피하는 법도 생활 팁으로
- "오늘부터 당장 ~해보세요!" 같은 실천 가능한 조언

## 3. [지지 상호작용 — 창의적 제목]
- 합/충/형 데이터를 실생활 영향으로 이야기처럼 풀어주세요
- "쉽게 말하면..." 패턴으로 어려운 용어 풀기
- 이것이 관계, 직업, 건강에 어떤 영향을 주는지 구체적으로

## 4. [신살의 영향 — 창의적 제목]
- 각 신살을 흥미로운 비유로 (역마살 → "여행자의 별", 도화살 → "매력의 별")
- 긍정 신살은 신나게, 주의 신살은 "걱정 마세요, 이렇게 하면 돼요" 톤으로
- 공망(${gongmang?.branchesKr?.join('·') ?? ''})이 삶에 미치는 영향도 포함

## 5. [재물운 — 창의적 제목]
- 편재/정재 위치와 강도를 쉬운 비유로 설명
- 돈 버는 스타일 (한방형 vs 꾸준형 vs 투자형 판단)
- ${currentYear}년~${currentYear + 2}년 재물 흐름을 구체적으로
- "이것만은 반드시!" 재테크 조언

## 6. [직업 적성 — 창의적 제목]
- 적합한 분야를 구체적으로 추천 (직업명까지)
- 조직형 vs 프리랜서/사업형 어느 쪽이 더 맞는지
- ${genderStr}으로서 특히 빛날 수 있는 영역
- 지금 만 ${currentAge}세에 방향 전환이나 성장을 위해 할 수 있는 것

## 7. [애정운 — 창의적 제목]
- ${gender === 'male' ? '재성(편재/정재)' : '관성(편관/정관)'} 기반 배우자 복을 로맨틱하게 분석
- 연애 스타일과 배우자 상을 재미있게 묘사
- 결혼/인연의 적기 시점 (대운과 연계해서)
- "이런 사람과 잘 맞아요" 구체적으로

## 8. [건강운 — 창의적 제목]
- 오행 과부족 → 주의할 건강 포인트를 부드럽게
- 구체적 생활 습관 (음식, 운동, 스트레스 관리)
- 나이 만 ${currentAge}세에 특히 챙겨야 할 부분

## 9. [현재 대운 — 창의적 제목]
- ${daeunInfo}를 바탕으로 이 10년의 의미를 이야기로
- 상반기(${currentYear}년 1~6월)와 하반기(${currentYear}년 7~12월)로 나눠서 흐름 설명
- 지금 집중해야 할 것과 조심할 것을 친구처럼 조언
- "이 시기에 이것을 하면 후회 없어요" 핵심 조언

## 10. [올해 운세 — 창의적 제목] (${seun.year}년)
- 세운 데이터 바탕으로 올해 키워드 3가지 뽑아 설명
- 상반기 vs 하반기 흐름 구체적으로
- 월별 주의 시기와 기회 시기를 부드럽게 언급
- "이것만은 꼭!" 핵심 한 줄 조언

## 11. [인생의 황금기 — 창의적 제목]
- 전체 대운 흐름에서 가장 빛나는 시기: ${goldenDaeunStr}
- 그 시기에 어떤 기회가 오는지 구체적이고 설레게
- "지금 이것을 준비하면 그때 크게 빛날 수 있어요" 조언
- 황금기 이후의 흐름도 간략히 언급

## 12. [종합 조언 — 창의적 제목]
- 이 사주의 핵심 강점을 한 문장으로 압축
- 용신(${ys.yongShinKr}) 기운으로 살아가는 실천 방법
- 만 ${currentAge}세인 지금, 가장 중요한 메시지
- 진심 어린 응원과 철학적 메시지로 마무리
- 마지막 문장: 이 사람만을 위한 감동적인 한 줄 (절대 진부한 문장 금지)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[톤앤매너 — 가장 중요!!]
- "~요" 체 친근한 말투 (절대 "~이다/한다" 체 금지)
- 전문 용어 최소화. 꼭 필요하면 비유로 풀어서
- "마치 ~처럼", "당신은 ~같은 사람이에요" 비유 적극 활용
- 이모지 자연스럽게 (섹션당 1~2개, 과하지 않게)
- 따끔한 조언 + 따뜻한 응원의 밸런스
- "혹시 ~한 적 있지 않나요?" 같은 공감형 질문으로 몰입감 유도
- 구체적인 연도(${currentYear}, ${currentYear + 1}년)와 나이(만 ${currentAge}세)를 자연스럽게 언급
- Markdown: ## 헤더, **볼드**, 리스트 활용
- 각 섹션은 반드시 번호 포함 (## 1. ~ ## 12.)
- 읽는 사람이 "와, 이거 진짜 내 얘기다!" 하고 소름 돋게 만들어주세요`;

  return systemPrompt;
}
