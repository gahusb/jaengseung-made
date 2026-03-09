"""
24절기 계산 모듈
ephem 라이브러리를 사용한 정밀한 절기 날짜 계산
"""

import ephem
import math
from datetime import datetime, date, timedelta
from typing import Optional

# 24절기 이름 (한글)
SOLAR_TERMS = [
    '입춘', '우수', '경칩', '춘분', '청명', '곡우',
    '입하', '소만', '망종', '하지', '소서', '대서',
    '입추', '처서', '백로', '추분', '한로', '상강',
    '입동', '소설', '대설', '동지', '소한', '대한'
]

# 각 절기에 대응하는 태양황경 (도)
SOLAR_TERM_ANGLES = [
    315, 330, 345,   0,  15,  30,
     45,  60,  75,  90, 105, 120,
    135, 150, 165, 180, 195, 210,
    225, 240, 255, 270, 285, 300
]

# 절기별 대략적인 월
SOLAR_TERM_BASE_MONTHS = [
    2, 2, 3, 3, 4, 4,
    5, 5, 6, 6, 7, 7,
    8, 8, 9, 9, 10, 10,
    11, 11, 12, 12, 1, 1
]

# 절기별 대략적인 일
SOLAR_TERM_BASE_DAYS = [
    4, 19, 5, 20, 4, 20,
    5, 21, 6, 21, 7, 23,
    7, 23, 8, 23, 8, 23,
    7, 22, 7, 22, 5, 20
]

# 절기 → 월지지 인덱스 매핑
# 입춘(0) → 인월(2), 우수(1) → 인월(2), ...
TERM_TO_MONTH_BRANCH = [
    2,  # 입춘 → 인월
    2,  # 우수 → 인월
    3,  # 경칩 → 묘월
    3,  # 춘분 → 묘월
    4,  # 청명 → 진월
    4,  # 곡우 → 진월
    5,  # 입하 → 사월
    5,  # 소만 → 사월
    6,  # 망종 → 오월
    6,  # 하지 → 오월
    7,  # 소서 → 미월
    7,  # 대서 → 미월
    8,  # 입추 → 신월
    8,  # 처서 → 신월
    9,  # 백로 → 유월
    9,  # 추분 → 유월
    10, # 한로 → 술월
    10, # 상강 → 술월
    11, # 입동 → 해월
    11, # 소설 → 해월
    0,  # 대설 → 자월
    0,  # 동지 → 자월
    1,  # 소한 → 축월
    1,  # 대한 → 축월
]


def _get_solar_longitude(dt: datetime) -> float:
    """주어진 날짜시간의 태양황경 계산 (ephem 사용)"""
    sun = ephem.Sun()
    sun.compute(dt.strftime('%Y/%m/%d %H:%M:%S'))
    ecl = ephem.Ecliptic(sun)
    return math.degrees(ecl.lon) % 360


def _get_solar_term_date_ephem(year: int, term_index: int) -> Optional[date]:
    """ephem을 사용해 특정 절기 날짜 계산"""
    target_angle = SOLAR_TERM_ANGLES[term_index]
    base_month = SOLAR_TERM_BASE_MONTHS[term_index]
    base_day = SOLAR_TERM_BASE_DAYS[term_index]

    # 소한(22), 대한(23)은 1월이지만 기준 년도에서 검색
    search_year = year if term_index < 22 else year

    try:
        start_day = max(1, base_day - 5)
        start_dt = datetime(search_year, base_month, start_day)
    except ValueError:
        start_dt = datetime(search_year, base_month, 1)

    # 20일 범위에서 절기 날짜 탐색
    prev_diff = None
    for i in range(20):
        check_dt = start_dt + timedelta(days=i)
        lon = _get_solar_longitude(check_dt)

        # 황경 차이 계산 (0° 교차 처리)
        diff = (lon - target_angle + 360) % 360
        if diff > 180:
            diff -= 360

        if abs(diff) < 2.0:
            return check_dt.date()

        # 부호가 바뀌면 직전 날짜가 절기
        if prev_diff is not None and prev_diff * diff < 0:
            return (check_dt - timedelta(days=1)).date()

        prev_diff = diff

    return None


def get_solar_term_date(year: int, term_index: int) -> date:
    """특정 년도의 특정 절기 날짜 반환"""
    try:
        result = _get_solar_term_date_ephem(year, term_index)
        if result:
            return result
    except Exception:
        pass

    # 폴백: 근사값 사용
    base_month = SOLAR_TERM_BASE_MONTHS[term_index]
    base_day = SOLAR_TERM_BASE_DAYS[term_index]
    try:
        return date(year, base_month, base_day)
    except ValueError:
        return date(year, base_month, min(28, base_day))


def get_current_solar_term(year: int, month: int, day: int) -> int:
    """주어진 날짜가 어느 절기 이후인지 반환 (0~23)"""
    target = date(year, month, day)

    # 역순으로 확인 (가장 최근 절기 찾기)
    for i in range(23, -1, -1):
        term_date = get_solar_term_date(year, i)

        # 소한, 대한의 경우 년도 조정
        if i >= 22:
            if month >= 2:
                term_date = date(year, term_date.month, term_date.day)
            else:
                term_date = date(year - 1, term_date.month, term_date.day)

        if target >= term_date:
            return i

    return 23  # 입춘 이전 → 전년도 대한 이후


def get_solar_term_month_branch(year: int, month: int, day: int) -> int:
    """절기 기준 월주 지지 인덱스 계산 (0=자, 1=축, 2=인, ...)"""
    term_index = get_current_solar_term(year, month, day)
    return TERM_TO_MONTH_BRANCH[term_index]


def get_days_to_next_solar_term(year: int, month: int, day: int) -> int:
    """다음 절기까지 남은 일수 계산"""
    current_term = get_current_solar_term(year, month, day)
    next_term_index = (current_term + 1) % 24

    next_year = year + 1 if current_term == 23 else year
    next_term_date = get_solar_term_date(next_year, next_term_index)

    current_date = date(year, month, day)
    diff = (next_term_date - current_date).days
    return max(1, diff)


def get_days_from_prev_solar_term(year: int, month: int, day: int) -> int:
    """이전 절기부터 주어진 날짜까지의 일수 계산"""
    current_term = get_current_solar_term(year, month, day)
    term_date = get_solar_term_date(year, current_term)

    # 소한, 대한 년도 조정
    if current_term >= 22:
        if month >= 2:
            term_date = date(year, term_date.month, term_date.day)
        else:
            term_date = date(year - 1, term_date.month, term_date.day)

    target = date(year, month, day)
    diff = (target - term_date).days
    return max(1, diff)
