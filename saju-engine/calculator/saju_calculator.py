"""
사주팔자 계산 모듈
천간, 지지, 오행, 십성, 십이운성, 신살, 공망, 지장간, 지지 상호작용
"""

from datetime import date, datetime
from typing import Optional
from calculator.solar_terms import get_solar_term_month_branch

# ============================================================
# 기본 상수
# ============================================================

HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
HEAVENLY_STEMS_KR = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계']

EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
EARTHLY_BRANCHES_KR = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해']

FIVE_ELEMENTS: dict[str, str] = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水',
    '寅': '木', '卯': '木',
    '巳': '火', '午': '火',
    '辰': '土', '戌': '土', '丑': '土', '未': '土',
    '申': '金', '酉': '金',
    '子': '水', '亥': '水',
}

FIVE_ELEMENTS_KR = {'木': '목', '火': '화', '土': '토', '金': '금', '水': '수'}

TWELVE_FORTUNES = ['장생', '목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양']

# 기준년: 1900 = 庚子년
BASE_YEAR = 1900
BASE_YEAR_STEM = 6   # 庚
BASE_YEAR_BRANCH = 0  # 子

# 기준일: 1900-01-01 = 丙寅일
BASE_DAY_STEM = 2    # 丙
BASE_DAY_BRANCH = 2  # 寅

# ============================================================
# 간지 계산
# ============================================================

def get_year_ganzi(year: int) -> dict:
    year_diff = year - BASE_YEAR
    stem_idx = (BASE_YEAR_STEM + year_diff) % 10
    branch_idx = (BASE_YEAR_BRANCH + year_diff) % 12
    return {
        'stem': HEAVENLY_STEMS[stem_idx],
        'branch': EARTHLY_BRANCHES[branch_idx],
        'stemKr': HEAVENLY_STEMS_KR[stem_idx],
        'branchKr': EARTHLY_BRANCHES_KR[branch_idx],
    }


def get_month_ganzi(year: int, month: int, day: int) -> dict:
    branch_idx = get_solar_term_month_branch(year, month, day)
    year_stem = get_year_ganzi(year)['stem']
    year_stem_idx = HEAVENLY_STEMS.index(year_stem)
    stem_idx = (year_stem_idx * 2 + branch_idx) % 10
    return {
        'stem': HEAVENLY_STEMS[stem_idx],
        'branch': EARTHLY_BRANCHES[branch_idx],
        'stemKr': HEAVENLY_STEMS_KR[stem_idx],
        'branchKr': EARTHLY_BRANCHES_KR[branch_idx],
    }


def get_day_ganzi(year: int, month: int, day: int) -> dict:
    base = date(1900, 1, 1)
    target = date(year, month, day)
    days_diff = (target - base).days

    stem_idx = (BASE_DAY_STEM + days_diff) % 10
    branch_idx = (BASE_DAY_BRANCH + days_diff) % 12

    # 음수 처리 (1900년 이전)
    if stem_idx < 0:
        stem_idx += 10
    if branch_idx < 0:
        branch_idx += 12

    return {
        'stem': HEAVENLY_STEMS[stem_idx],
        'branch': EARTHLY_BRANCHES[branch_idx],
        'stemKr': HEAVENLY_STEMS_KR[stem_idx],
        'branchKr': EARTHLY_BRANCHES_KR[branch_idx],
    }


def get_hour_ganzi(day_stem: str, hour: int) -> dict:
    if hour >= 23 or hour < 1:
        branch_idx = 0   # 子
    elif hour < 3:
        branch_idx = 1   # 丑
    elif hour < 5:
        branch_idx = 2   # 寅
    elif hour < 7:
        branch_idx = 3   # 卯
    elif hour < 9:
        branch_idx = 4   # 辰
    elif hour < 11:
        branch_idx = 5   # 巳
    elif hour < 13:
        branch_idx = 6   # 午
    elif hour < 15:
        branch_idx = 7   # 未
    elif hour < 17:
        branch_idx = 8   # 申
    elif hour < 19:
        branch_idx = 9   # 酉
    elif hour < 21:
        branch_idx = 10  # 戌
    else:
        branch_idx = 11  # 亥

    day_stem_idx = HEAVENLY_STEMS.index(day_stem)
    stem_idx = (day_stem_idx * 2 + branch_idx) % 10
    return {
        'stem': HEAVENLY_STEMS[stem_idx],
        'branch': EARTHLY_BRANCHES[branch_idx],
        'stemKr': HEAVENLY_STEMS_KR[stem_idx],
        'branchKr': EARTHLY_BRANCHES_KR[branch_idx],
    }


# ============================================================
# 십성 계산
# ============================================================

_PRODUCE_MAP = {'木': '火', '火': '土', '土': '金', '金': '水', '水': '木'}
_OVERCOME_MAP = {'木': '土', '火': '金', '土': '水', '金': '木', '水': '火'}


def get_ten_god(day_stem: str, target_stem: str, is_yang: bool) -> str:
    day_elem = FIVE_ELEMENTS.get(day_stem, '')
    target_elem = FIVE_ELEMENTS.get(target_stem, '')

    if day_elem == target_elem:
        return '비견' if is_yang else '겁재'
    if _PRODUCE_MAP.get(day_elem) == target_elem:
        return '식신' if is_yang else '상관'
    if _OVERCOME_MAP.get(day_elem) == target_elem:
        return '편재' if is_yang else '정재'
    if _OVERCOME_MAP.get(target_elem) == day_elem:
        return '편관' if is_yang else '정관'
    if _PRODUCE_MAP.get(target_elem) == day_elem:
        return '편인' if is_yang else '정인'
    return '비견'


# ============================================================
# 십이운성 계산
# ============================================================

_FORTUNE_MAP: dict[str, dict[str, int]] = {
    '甲': {'亥': 11, '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5, '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10},
    '乙': {'午': 11, '未': 0, '申': 1, '酉': 2, '戌': 3, '亥': 4, '子': 5, '丑': 6, '寅': 7, '卯': 8, '辰': 9, '巳': 10},
    '丙': {'寅': 11, '卯': 0, '辰': 1, '巳': 2, '午': 3, '未': 4, '申': 5, '酉': 6, '戌': 7, '亥': 8, '子': 9, '丑': 10},
    '丁': {'酉': 11, '戌': 0, '亥': 1, '子': 2, '丑': 3, '寅': 4, '卯': 5, '辰': 6, '巳': 7, '午': 8, '未': 9, '申': 10},
    '戊': {'寅': 11, '卯': 0, '辰': 1, '巳': 2, '午': 3, '未': 4, '申': 5, '酉': 6, '戌': 7, '亥': 8, '子': 9, '丑': 10},
    '己': {'酉': 11, '戌': 0, '亥': 1, '子': 2, '丑': 3, '寅': 4, '卯': 5, '辰': 6, '巳': 7, '午': 8, '未': 9, '申': 10},
    '庚': {'巳': 11, '午': 0, '未': 1, '申': 2, '酉': 3, '戌': 4, '亥': 5, '子': 6, '丑': 7, '寅': 8, '卯': 9, '辰': 10},
    '辛': {'子': 11, '丑': 0, '寅': 1, '卯': 2, '辰': 3, '巳': 4, '午': 5, '未': 6, '申': 7, '酉': 8, '戌': 9, '亥': 10},
    '壬': {'申': 11, '酉': 0, '戌': 1, '亥': 2, '子': 3, '丑': 4, '寅': 5, '卯': 6, '辰': 7, '巳': 8, '午': 9, '未': 10},
    '癸': {'卯': 11, '辰': 0, '巳': 1, '午': 2, '未': 3, '申': 4, '酉': 5, '戌': 6, '亥': 7, '子': 8, '丑': 9, '寅': 10},
}


def get_twelve_fortune(day_stem: str, branch: str) -> str:
    idx = _FORTUNE_MAP.get(day_stem, {}).get(branch, 0)
    return TWELVE_FORTUNES[idx]


# ============================================================
# 지장간 (藏干)
# ============================================================

HIDDEN_STEMS: dict[str, list[str]] = {
    '子': ['癸'],
    '丑': ['己', '癸', '辛'],
    '寅': ['甲', '丙', '戊'],
    '卯': ['乙'],
    '辰': ['戊', '乙', '癸'],
    '巳': ['丙', '庚', '戊'],
    '午': ['丁', '己'],
    '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'],
    '酉': ['辛'],
    '戌': ['戊', '辛', '丁'],
    '亥': ['壬', '甲'],
}

_ROLE_NAMES = ['정기(본기)', '중기', '여기']


def get_hidden_stems(branch: str) -> list[str]:
    return HIDDEN_STEMS.get(branch, [])


def get_all_hidden_stems(saju: dict) -> list[dict]:
    pillars = [
        {'pillar': '년주', 'branch': saju['year']['branch'], 'branchKr': saju['year']['branchKr']},
        {'pillar': '월주', 'branch': saju['month']['branch'], 'branchKr': saju['month']['branchKr']},
        {'pillar': '일주', 'branch': saju['day']['branch'], 'branchKr': saju['day']['branchKr']},
    ]
    if saju.get('hour'):
        pillars.append({'pillar': '시주', 'branch': saju['hour']['branch'], 'branchKr': saju['hour']['branchKr']})

    result = []
    for p in pillars:
        hidden = get_hidden_stems(p['branch'])
        stems_info = []
        for idx, stem in enumerate(hidden):
            stem_idx = HEAVENLY_STEMS.index(stem)
            stems_info.append({
                'stem': stem,
                'stemKr': HEAVENLY_STEMS_KR[stem_idx],
                'element': FIVE_ELEMENTS.get(stem, ''),
                'role': _ROLE_NAMES[idx] if idx < len(_ROLE_NAMES) else '여기',
            })
        result.append({
            'pillar': p['pillar'],
            'branch': p['branch'],
            'branchKr': p['branchKr'],
            'stems': stems_info,
        })
    return result


# ============================================================
# 지지 상호작용
# ============================================================

_YUKAP_PAIRS = [
    ('子', '丑', '土'), ('寅', '亥', '木'), ('卯', '戌', '火'),
    ('辰', '酉', '金'), ('巳', '申', '水'), ('午', '未', '火'),
]

_SAMHAP_GROUPS = [
    ('申', '子', '辰', '水'), ('亥', '卯', '未', '木'),
    ('寅', '午', '戌', '火'), ('巳', '酉', '丑', '金'),
]

_BANGHAP_GROUPS = [
    ('寅', '卯', '辰', '木'), ('巳', '午', '未', '火'),
    ('申', '酉', '戌', '金'), ('亥', '子', '丑', '水'),
]

_CHUNG_PAIRS = [
    ('子', '午'), ('丑', '未'), ('寅', '申'),
    ('卯', '酉'), ('辰', '戌'), ('巳', '亥'),
]

_HYUNG_GROUPS = [
    {'branches': ['寅', '巳', '申'], 'name': '무은지형(無恩之刑)'},
    {'branches': ['丑', '戌', '未'], 'name': '지세지형(恃勢之刑)'},
    {'branches': ['子', '卯'], 'name': '무례지형(無禮之刑)'},
]

_JAHYUNG_BRANCHES = ['辰', '午', '酉', '亥']

_PA_PAIRS = [
    ('子', '酉'), ('丑', '辰'), ('寅', '亥'),
    ('卯', '午'), ('巳', '申'), ('未', '戌'),
]

_HAE_PAIRS = [
    ('子', '未'), ('丑', '午'), ('寅', '巳'),
    ('卯', '辰'), ('申', '亥'), ('酉', '戌'),
]

_ELEM_KR = {'木': '목', '火': '화', '土': '토', '金': '금', '水': '수'}


def analyze_branch_interactions(saju: dict) -> list[dict]:
    pillar_branches = [
        {'branch': saju['year']['branch'], 'branchKr': saju['year']['branchKr'], 'pillar': '년주'},
        {'branch': saju['month']['branch'], 'branchKr': saju['month']['branchKr'], 'pillar': '월주'},
        {'branch': saju['day']['branch'], 'branchKr': saju['day']['branchKr'], 'pillar': '일주'},
    ]
    if saju.get('hour'):
        pillar_branches.append({'branch': saju['hour']['branch'], 'branchKr': saju['hour']['branchKr'], 'pillar': '시주'})

    branches = [p['branch'] for p in pillar_branches]
    interactions = []

    # 육합
    for a, b, elem in _YUKAP_PAIRS:
        if a in branches and b in branches:
            idx_a = branches.index(a)
            idx_b = branches.index(b)
            interactions.append({
                'type': '육합(六合)',
                'branches': [a, b],
                'branchesKr': [pillar_branches[idx_a]['branchKr'], pillar_branches[idx_b]['branchKr']],
                'pillars': [pillar_branches[idx_a]['pillar'], pillar_branches[idx_b]['pillar']],
                'description': f"{pillar_branches[idx_a]['branchKr']}{pillar_branches[idx_b]['branchKr']} 육합 → {_ELEM_KR.get(elem, '')}({elem}) 기운 생성. 조화와 화합의 관계.",
                'resultElement': elem,
            })

    # 삼합
    for a, b, c, elem in _SAMHAP_GROUPS:
        found = [x for x in [a, b, c] if x in branches]
        if len(found) >= 2:
            found_pillars = [pillar_branches[branches.index(x)] for x in found]
            is_complete = len(found) == 3
            interactions.append({
                'type': '삼합(三合)' if is_complete else '반삼합(半三合)',
                'branches': found,
                'branchesKr': [p['branchKr'] for p in found_pillars],
                'pillars': [p['pillar'] for p in found_pillars],
                'description': f"{''.join(p['branchKr'] for p in found_pillars)} {'삼합' if is_complete else '반삼합'} → {_ELEM_KR.get(elem, '')}({elem})국.",
                'resultElement': elem,
            })

    # 방합
    for a, b, c, elem in _BANGHAP_GROUPS:
        found = [x for x in [a, b, c] if x in branches]
        if len(found) == 3:
            found_pillars = [pillar_branches[branches.index(x)] for x in found]
            interactions.append({
                'type': '방합(方合)',
                'branches': found,
                'branchesKr': [p['branchKr'] for p in found_pillars],
                'pillars': [p['pillar'] for p in found_pillars],
                'description': f"{''.join(p['branchKr'] for p in found_pillars)} 방합 → {_ELEM_KR.get(elem, '')}({elem}) 방국. 매우 강한 오행 기운.",
                'resultElement': elem,
            })

    # 충
    for a, b in _CHUNG_PAIRS:
        if a in branches and b in branches:
            idx_a = branches.index(a)
            idx_b = branches.index(b)
            interactions.append({
                'type': '충(沖)',
                'branches': [a, b],
                'branchesKr': [pillar_branches[idx_a]['branchKr'], pillar_branches[idx_b]['branchKr']],
                'pillars': [pillar_branches[idx_a]['pillar'], pillar_branches[idx_b]['pillar']],
                'description': f"{pillar_branches[idx_a]['branchKr']}{pillar_branches[idx_b]['branchKr']} 충 → 변동, 갈등, 변화의 에너지.",
            })

    # 형
    for group in _HYUNG_GROUPS:
        found = [x for x in group['branches'] if x in branches]
        if len(found) >= 2:
            found_pillars = [pillar_branches[branches.index(x)] for x in found]
            interactions.append({
                'type': '형(刑)',
                'branches': found,
                'branchesKr': [p['branchKr'] for p in found_pillars],
                'pillars': [p['pillar'] for p in found_pillars],
                'description': f"{''.join(p['branchKr'] for p in found_pillars)} {group['name']} → 시련과 갈등의 기운.",
            })

    # 자형
    for jb in _JAHYUNG_BRANCHES:
        count = branches.count(jb)
        if count >= 2:
            br_kr = EARTHLY_BRANCHES_KR[EARTHLY_BRANCHES.index(jb)]
            interactions.append({
                'type': '자형(自刑)',
                'branches': [jb, jb],
                'branchesKr': [br_kr, br_kr],
                'pillars': [p['pillar'] for p in pillar_branches if p['branch'] == jb],
                'description': f'{br_kr}{br_kr} 자형 → 자기 자신과의 갈등, 내면의 갈등 기운.',
            })

    # 파
    for a, b in _PA_PAIRS:
        if a in branches and b in branches:
            idx_a = branches.index(a)
            idx_b = branches.index(b)
            interactions.append({
                'type': '파(破)',
                'branches': [a, b],
                'branchesKr': [pillar_branches[idx_a]['branchKr'], pillar_branches[idx_b]['branchKr']],
                'pillars': [pillar_branches[idx_a]['pillar'], pillar_branches[idx_b]['pillar']],
                'description': f"{pillar_branches[idx_a]['branchKr']}{pillar_branches[idx_b]['branchKr']} 파 → 관계의 균열, 계획의 차질 가능성.",
            })

    # 해
    for a, b in _HAE_PAIRS:
        if a in branches and b in branches:
            idx_a = branches.index(a)
            idx_b = branches.index(b)
            interactions.append({
                'type': '해(害)',
                'branches': [a, b],
                'branchesKr': [pillar_branches[idx_a]['branchKr'], pillar_branches[idx_b]['branchKr']],
                'pillars': [pillar_branches[idx_a]['pillar'], pillar_branches[idx_b]['pillar']],
                'description': f"{pillar_branches[idx_a]['branchKr']}{pillar_branches[idx_b]['branchKr']} 해 → 은근한 방해, 원망의 기운.",
            })

    return interactions


# ============================================================
# 신살 (神煞)
# ============================================================

_SAMHAP_GROUP_MAP: dict[str, str] = {
    '申': '申子辰', '子': '申子辰', '辰': '申子辰',
    '寅': '寅午戌', '午': '寅午戌', '戌': '寅午戌',
    '巳': '巳酉丑', '酉': '巳酉丑', '丑': '巳酉丑',
    '亥': '亥卯未', '卯': '亥卯未', '未': '亥卯未',
}

_YEOKMA_MAP = {'申子辰': '寅', '寅午戌': '申', '巳酉丑': '亥', '亥卯未': '巳'}
_DOHWA_MAP  = {'申子辰': '酉', '寅午戌': '卯', '巳酉丑': '午', '亥卯未': '子'}
_HWAGAE_MAP = {'申子辰': '辰', '寅午戌': '戌', '巳酉丑': '丑', '亥卯未': '未'}

_CHEONUL_MAP: dict[str, list[str]] = {
    '甲': ['丑', '未'], '乙': ['子', '申'], '丙': ['亥', '酉'], '丁': ['亥', '酉'],
    '戊': ['丑', '未'], '己': ['子', '申'], '庚': ['丑', '未'], '辛': ['寅', '午'],
    '壬': ['卯', '巳'], '癸': ['卯', '巳'],
}

_MUNCHANG_MAP: dict[str, str] = {
    '甲': '巳', '乙': '午', '丙': '申', '丁': '酉',
    '戊': '申', '己': '酉', '庚': '亥', '辛': '子',
    '壬': '寅', '癸': '卯',
}

_CHEONDUK_MAP: dict[str, str] = {
    '寅': '丁', '卯': '申', '辰': '壬', '巳': '辛',
    '午': '亥', '未': '甲', '申': '癸', '酉': '寅',
    '戌': '丙', '亥': '乙', '子': '巳', '丑': '庚',
}


def calculate_shinsal(saju: dict) -> list[dict]:
    result = []
    day_branch = saju['day']['branch']
    day_stem = saju['dayStem']
    month_branch = saju['month']['branch']

    pillar_branches = [
        {'branch': saju['year']['branch'], 'branchKr': saju['year']['branchKr'], 'pillar': '년주'},
        {'branch': saju['month']['branch'], 'branchKr': saju['month']['branchKr'], 'pillar': '월주'},
        {'branch': saju['day']['branch'], 'branchKr': saju['day']['branchKr'], 'pillar': '일주'},
    ]
    if saju.get('hour'):
        pillar_branches.append({'branch': saju['hour']['branch'], 'branchKr': saju['hour']['branchKr'], 'pillar': '시주'})

    group = _SAMHAP_GROUP_MAP.get(day_branch)
    if group:
        # 역마살
        yeokma = _YEOKMA_MAP[group]
        for pb in pillar_branches:
            if pb['branch'] == yeokma and pb['pillar'] != '일주':
                result.append({
                    'name': '역마살', 'nameHanja': '驛馬殺',
                    'branch': yeokma, 'branchKr': pb['branchKr'], 'pillar': pb['pillar'],
                    'description': '이동, 변동, 해외, 출장이 많은 기운. 활동적이고 한 곳에 머물지 못하는 성향.',
                })

        # 도화살
        dohwa = _DOHWA_MAP[group]
        for pb in pillar_branches:
            if pb['branch'] == dohwa and pb['pillar'] != '일주':
                result.append({
                    'name': '도화살', 'nameHanja': '桃花殺',
                    'branch': dohwa, 'branchKr': pb['branchKr'], 'pillar': pb['pillar'],
                    'description': '매력, 인기, 예술적 감각. 이성에게 끌리는 기운이 강하며 대인관계가 화려함.',
                })

        # 화개살
        hwagae = _HWAGAE_MAP[group]
        for pb in pillar_branches:
            if pb['branch'] == hwagae and pb['pillar'] != '일주':
                result.append({
                    'name': '화개살', 'nameHanja': '華蓋殺',
                    'branch': hwagae, 'branchKr': pb['branchKr'], 'pillar': pb['pillar'],
                    'description': '학문, 종교, 예술에 심취하는 기운. 고독을 즐기며 정신적 세계에 몰두하는 성향.',
                })

    # 천을귀인
    cheonul_branches = _CHEONUL_MAP.get(day_stem, [])
    for pb in pillar_branches:
        if pb['branch'] in cheonul_branches and pb['pillar'] != '일주':
            result.append({
                'name': '천을귀인', 'nameHanja': '天乙貴人',
                'branch': pb['branch'], 'branchKr': pb['branchKr'], 'pillar': pb['pillar'],
                'description': '위기에서 귀인의 도움을 받는 길한 기운. 어려울 때 도움을 주는 사람이 나타남.',
            })

    # 문창귀인
    munchang_branch = _MUNCHANG_MAP.get(day_stem)
    if munchang_branch:
        for pb in pillar_branches:
            if pb['branch'] == munchang_branch and pb['pillar'] != '일주':
                result.append({
                    'name': '문창귀인', 'nameHanja': '文昌貴人',
                    'branch': pb['branch'], 'branchKr': pb['branchKr'], 'pillar': pb['pillar'],
                    'description': '학문, 시험, 문서에 유리한 기운. 공부를 잘하며 시험운이 좋음.',
                })

    # 천덕귀인 (월지 기준, 천간에서 확인)
    cheonduk_stem = _CHEONDUK_MAP.get(month_branch)
    if cheonduk_stem:
        all_stems = [
            {'stem': saju['year']['stem'], 'pillar': '년주'},
            {'stem': saju['day']['stem'], 'pillar': '일주'},
        ]
        if saju.get('hour'):
            all_stems.append({'stem': saju['hour']['stem'], 'pillar': '시주'})
        for ps in all_stems:
            if ps['stem'] == cheonduk_stem:
                result.append({
                    'name': '천덕귀인', 'nameHanja': '天德貴人',
                    'branch': month_branch,
                    'branchKr': EARTHLY_BRANCHES_KR[EARTHLY_BRANCHES.index(month_branch)],
                    'pillar': ps['pillar'],
                    'description': '하늘의 덕을 받는 기운. 재난을 피하고 복을 받는 길신 중의 길신.',
                })

    return result


# ============================================================
# 공망 (空亡)
# ============================================================

def calculate_gongmang(day_stem: str, day_branch: str) -> dict:
    stem_idx = HEAVENLY_STEMS.index(day_stem)
    branch_idx = EARTHLY_BRANCHES.index(day_branch)

    start_branch_idx = (branch_idx - stem_idx + 120) % 12
    gm1 = (start_branch_idx + 10) % 12
    gm2 = (start_branch_idx + 11) % 12

    branch1 = EARTHLY_BRANCHES[gm1]
    branch2 = EARTHLY_BRANCHES[gm2]
    br_kr1 = EARTHLY_BRANCHES_KR[gm1]
    br_kr2 = EARTHLY_BRANCHES_KR[gm2]

    return {
        'branches': [branch1, branch2],
        'branchesKr': [br_kr1, br_kr2],
        'description': f'{br_kr1}({branch1})·{br_kr2}({branch2}) 공망 → 해당 지지의 기운이 비어있어 허무하거나 집착이 없는 영역. 오히려 초월적 능력이 될 수 있음.',
    }


# ============================================================
# 사주팔자 전체 계산
# ============================================================

def calculate_saju(
    year: int,
    month: int,
    day: int,
    hour: Optional[int],
    gender: str,
) -> dict:
    year_ganzi = get_year_ganzi(year)
    month_ganzi = get_month_ganzi(year, month, day)
    day_ganzi = get_day_ganzi(year, month, day)
    hour_ganzi = get_hour_ganzi(day_ganzi['stem'], hour) if hour is not None else None

    day_stem = day_ganzi['stem']
    day_stem_idx = HEAVENLY_STEMS.index(day_stem)
    is_day_yang = day_stem_idx % 2 == 0

    def enrich(ganzi: dict, is_day_pillar: bool = False) -> dict:
        stem = ganzi['stem']
        branch = ganzi['branch']
        stem_idx = HEAVENLY_STEMS.index(stem)
        is_yang = (stem_idx % 2 == 0) == is_day_yang
        return {
            **ganzi,
            'element': FIVE_ELEMENTS.get(stem, ''),
            'tenGod': '일간' if is_day_pillar else get_ten_god(day_stem, stem, is_yang),
            'fortune': get_twelve_fortune(day_stem, branch),
        }

    saju: dict = {
        'year': enrich(year_ganzi),
        'month': enrich(month_ganzi),
        'day': enrich(day_ganzi, is_day_pillar=True),
        'dayStem': day_stem,
        'birthDate': {'year': year, 'month': month, 'day': day, 'hour': hour},
        'gender': gender,
    }

    if hour_ganzi:
        saju['hour'] = enrich(hour_ganzi)

    return saju
