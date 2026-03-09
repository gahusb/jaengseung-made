"""
대운 (大運) 계산 모듈
양남음녀 순행, 음남양녀 역행, 절기 기준 대운 시작 나이
"""

from calculator.saju_calculator import HEAVENLY_STEMS, EARTHLY_BRANCHES, HEAVENLY_STEMS_KR, EARTHLY_BRANCHES_KR
from calculator.solar_terms import get_days_to_next_solar_term, get_days_from_prev_solar_term


def _calculate_daeun_start_age(
    birth_year: int,
    birth_month: int,
    birth_day: int,
    gender: str,
    is_yang_year: bool,
) -> int:
    """절기 기준 대운 시작 나이 계산"""
    is_forward = (gender == 'male' and is_yang_year) or (gender == 'female' and not is_yang_year)

    if is_forward:
        # 순행: 생일부터 다음 절기까지의 일수
        days = get_days_to_next_solar_term(birth_year, birth_month, birth_day)
    else:
        # 역행: 이전 절기부터 생일까지의 일수
        days = get_days_from_prev_solar_term(birth_year, birth_month, birth_day)

    # 3일 = 1세
    start_age = days // 3
    return max(1, min(10, start_age))


def calculate_daeun(
    birth_year: int,
    birth_month: int,
    birth_day: int,
    gender: str,
    month_stem: str,
    month_branch: str,
) -> list[dict]:
    """대운 계산 (10년 단위, 8개 대운)"""
    if month_stem not in HEAVENLY_STEMS or month_branch not in EARTHLY_BRANCHES:
        return []

    month_stem_idx = HEAVENLY_STEMS.index(month_stem)
    month_branch_idx = EARTHLY_BRANCHES.index(month_branch)

    year_stem_idx = (birth_year - 1900 + 6) % 10
    is_yang_year = year_stem_idx % 2 == 0

    is_forward = (gender == 'male' and is_yang_year) or (gender == 'female' and not is_yang_year)

    start_age = _calculate_daeun_start_age(birth_year, birth_month, birth_day, gender, is_yang_year)

    daeun_list = []
    for i in range(8):
        age = start_age + (i * 10)
        start_year = birth_year + age
        end_year = start_year + 9

        if is_forward:
            stem_idx = (month_stem_idx + i + 1) % 10
            branch_idx = (month_branch_idx + i + 1) % 12
        else:
            stem_idx = (month_stem_idx - i - 1 + 100) % 10
            branch_idx = (month_branch_idx - i - 1 + 120) % 12

        daeun_list.append({
            'age': age,
            'startYear': start_year,
            'endYear': end_year,
            'stem': HEAVENLY_STEMS[stem_idx],
            'branch': EARTHLY_BRANCHES[branch_idx],
            'stemKr': HEAVENLY_STEMS_KR[stem_idx],
            'branchKr': EARTHLY_BRANCHES_KR[branch_idx],
        })

    return daeun_list


def get_current_daeun(daeun_list: list[dict], current_year: int) -> dict | None:
    """현재 대운 찾기"""
    for daeun in daeun_list:
        if daeun['startYear'] <= current_year <= daeun['endYear']:
            return daeun
    return None


def get_daeun_description(daeun: dict, day_stem: str) -> str:
    """대운 기본 해석"""
    age = daeun['age']
    ganzi = f"{daeun['stem']}{daeun['branch']}"
    desc = f"{age}세부터 {age + 9}세까지의 10년은 {daeun['stemKr']}{daeun['branchKr']}({ganzi}) 대운입니다. "

    if age < 20:
        desc += '청소년기로 학업과 기초를 다지는 시기입니다. '
    elif age < 40:
        desc += '성장과 발전의 시기로 사회활동이 왕성한 때입니다. '
    elif age < 60:
        desc += '안정과 성숙의 시기로 경험이 쌓이는 때입니다. '
    else:
        desc += '원숙한 시기로 인생의 지혜를 나누는 때입니다. '

    stem_idx = HEAVENLY_STEMS.index(daeun['stem'])
    if stem_idx % 2 == 0:
        desc += '적극적이고 외향적인 활동이 유리합니다.'
    else:
        desc += '차분하고 내실을 다지는 것이 좋습니다.'

    return desc
