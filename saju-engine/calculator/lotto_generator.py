"""
사주 기반 로또 번호 생성 모듈
오행 균형, 천간/지지 고유 숫자, 신살 등을 반영
"""

import hashlib
import random
from typing import Optional

from calculator.saju_calculator import FIVE_ELEMENTS

# 오행별 로또 번호 후보
_ELEMENT_NUMBERS: dict[str, list[int]] = {
    '木': [1, 2, 11, 12, 21, 22, 31, 32, 41, 42],
    '火': [3, 4, 13, 14, 23, 24, 33, 34, 43, 44],
    '土': [5, 6, 15, 16, 25, 26, 35, 36, 45],
    '金': [7, 8, 17, 18, 27, 28, 37, 38],
    '水': [9, 10, 19, 20, 29, 30, 39, 40],
}

# 천간 고유 숫자 (각 천간에 대응하는 행운 숫자)
_STEM_NUMBERS: dict[str, list[int]] = {
    '甲': [1, 11, 21, 31, 41],
    '乙': [2, 12, 22, 32, 42],
    '丙': [3, 13, 23, 33, 43],
    '丁': [4, 14, 24, 34, 44],
    '戊': [5, 15, 25, 35, 45],
    '己': [6, 16, 26, 36],
    '庚': [7, 17, 27, 37],
    '辛': [8, 18, 28, 38],
    '壬': [9, 19, 29, 39],
    '癸': [10, 20, 30, 40],
}

# 지지 고유 숫자
_BRANCH_NUMBERS: dict[str, list[int]] = {
    '子': [9, 19, 29, 39],
    '丑': [6, 15, 25, 36],
    '寅': [1, 11, 31, 41],
    '卯': [2, 12, 22, 42],
    '辰': [5, 16, 26, 35],
    '巳': [3, 14, 24, 43],
    '午': [4, 13, 23, 44],
    '未': [6, 16, 26, 45],
    '申': [7, 18, 27, 37],
    '酉': [8, 17, 28, 38],
    '戌': [5, 15, 25, 35],
    '亥': [10, 20, 30, 40],
}

# 신살별 보너스 숫자
_SHINSAL_BONUS: dict[str, list[int]] = {
    '역마살': [7, 17, 27, 37],
    '도화살': [3, 13, 23, 33, 43],
    '화개살': [11, 22, 33, 44],
    '천을귀인': [1, 7, 14, 21, 28, 35, 42],
    '문창귀인': [4, 16, 25, 36],
    '천덕귀인': [6, 12, 24, 36],
}


def _seed_from_saju(saju: dict) -> str:
    """사주 데이터에서 결정론적 시드 생성"""
    bd = saju.get('birthDate', {})
    key = (
        f"{bd.get('year')}-{bd.get('month')}-{bd.get('day')}-"
        f"{bd.get('hour', 'X')}-{saju.get('gender', 'X')}"
    )
    return hashlib.sha256(key.encode()).hexdigest()


def _get_dominant_elements(saju: dict) -> list[str]:
    """사주에서 강한 오행 추출 (빈도 기준 정렬)"""
    count: dict[str, int] = {'木': 0, '火': 0, '土': 0, '金': 0, '水': 0}
    pillars = ['year', 'month', 'day', 'hour']
    for p in pillars:
        pillar = saju.get(p)
        if not pillar:
            continue
        for key in ['stem', 'branch']:
            char = pillar.get(key, '')
            elem = FIVE_ELEMENTS.get(char)
            if elem:
                count[elem] = count.get(elem, 0) + 1

    return sorted(count, key=lambda e: count[e], reverse=True)


def generate_lotto_numbers(
    saju: dict,
    shinsal: Optional[list[dict]] = None,
    count: int = 6,
) -> dict:
    """
    사주 기반 로또 번호 생성

    Returns:
        {
            'numbers': [int, ...],       # 추천 번호 (오름차순)
            'basis': str,                # 생성 근거 설명
            'elementBalance': dict,      # 오행별 번호 분포
        }
    """
    seed_hex = _seed_from_saju(saju)
    rng = random.Random(int(seed_hex, 16) % (2**32))

    # 1. 후보 풀 구성 (우선순위 점수)
    scores: dict[int, float] = {n: 0.0 for n in range(1, 46)}

    # 오행 비중 (강한 오행 우선)
    dominant_elements = _get_dominant_elements(saju)
    for rank, elem in enumerate(dominant_elements):
        weight = 5.0 - rank  # 1위=5점, 2위=4점, ...
        for n in _ELEMENT_NUMBERS.get(elem, []):
            if n in scores:
                scores[n] += weight

    # 일간 비중
    day_stem = saju.get('dayStem', '')
    for n in _STEM_NUMBERS.get(day_stem, []):
        if n in scores:
            scores[n] += 4.0

    # 일지 비중
    day_branch = saju.get('day', {}).get('branch', '')
    for n in _BRANCH_NUMBERS.get(day_branch, []):
        if n in scores:
            scores[n] += 3.0

    # 월지 비중
    month_branch = saju.get('month', {}).get('branch', '')
    for n in _BRANCH_NUMBERS.get(month_branch, []):
        if n in scores:
            scores[n] += 2.0

    # 신살 보너스
    shinsal_names = []
    if shinsal:
        for s in shinsal:
            name = s.get('name', '')
            shinsal_names.append(name)
            for n in _SHINSAL_BONUS.get(name, []):
                if n in scores:
                    scores[n] += 2.5

    # 2. 점수 기반 확률 가중 샘플링
    numbers_pool = list(scores.keys())
    weights = [scores[n] + 1.0 for n in numbers_pool]  # 최소 1.0 보장

    selected: list[int] = []
    remaining_pool = list(zip(numbers_pool, weights))

    while len(selected) < count and remaining_pool:
        total = sum(w for _, w in remaining_pool)
        pick = rng.uniform(0, total)
        cumulative = 0
        picked_n = None
        for n, w in remaining_pool:
            cumulative += w
            if pick <= cumulative:
                picked_n = n
                break
        if picked_n is None:
            picked_n = remaining_pool[-1][0]

        selected.append(picked_n)
        remaining_pool = [(n, w) for n, w in remaining_pool if n != picked_n]

    selected.sort()

    # 3. 오행 분포 계산
    def _number_to_element(n: int) -> str:
        for elem, nums in _ELEMENT_NUMBERS.items():
            if n in nums:
                return elem
        return '土'

    element_balance = {}
    for n in selected:
        elem = _number_to_element(n)
        element_balance[elem] = element_balance.get(elem, [])
        element_balance[elem].append(n)

    # 4. 근거 설명 생성
    basis_parts = [
        f"일간 {saju.get('dayStem', '')}({day_stem}) 기반",
        f"강한 오행: {', '.join(dominant_elements[:2])}",
    ]
    if shinsal_names:
        basis_parts.append(f"신살 반영: {', '.join(set(shinsal_names))}")

    basis = ' / '.join(basis_parts)

    return {
        'numbers': selected,
        'basis': basis,
        'elementBalance': element_balance,
    }


def generate_multiple_sets(
    saju: dict,
    shinsal: Optional[list[dict]] = None,
    sets: int = 5,
) -> list[dict]:
    """여러 세트의 로또 번호 생성 (시드 변형)"""
    results = []
    seed_hex = _seed_from_saju(saju)
    base_seed = int(seed_hex, 16) % (2**32)

    for i in range(sets):
        # 세트별 시드 변형
        modified_saju = dict(saju)
        modified_saju['_set_index'] = i  # 내부 변형용

        rng = random.Random(base_seed + i * 997)

        dominant_elements = _get_dominant_elements(saju)

        # 각 세트는 조금씩 다른 오행 강조
        scores: dict[int, float] = {n: rng.random() * 2 for n in range(1, 46)}

        elem_to_emphasize = dominant_elements[i % len(dominant_elements)]
        for n in _ELEMENT_NUMBERS.get(elem_to_emphasize, []):
            if n in scores:
                scores[n] += 5.0

        day_stem = saju.get('dayStem', '')
        for n in _STEM_NUMBERS.get(day_stem, []):
            if n in scores:
                scores[n] += 3.0

        if shinsal:
            for s in shinsal:
                for n in _SHINSAL_BONUS.get(s.get('name', ''), []):
                    if n in scores:
                        scores[n] += 2.0

        pool = list(scores.keys())
        weights = [scores[n] for n in pool]

        selected: list[int] = []
        remaining = list(zip(pool, weights))

        while len(selected) < 6 and remaining:
            total = sum(w for _, w in remaining)
            pick = rng.uniform(0, total)
            cumulative = 0.0
            picked_n = None
            for n, w in remaining:
                cumulative += w
                if pick <= cumulative:
                    picked_n = n
                    break
            if picked_n is None:
                picked_n = remaining[-1][0]
            selected.append(picked_n)
            remaining = [(n, w) for n, w in remaining if n != picked_n]

        selected.sort()
        results.append({
            'set': i + 1,
            'numbers': selected,
            'emphasis': elem_to_emphasize,
        })

    return results
