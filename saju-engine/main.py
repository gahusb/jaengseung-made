"""
사주 계산 엔진 API
FastAPI + ephem 기반 사주팔자 계산 서비스

환경변수:
    API_SECRET: X-API-Secret 헤더 검증용 시크릿
    ALLOWED_ORIGINS: CORS 허용 오리진 (쉼표 구분, 기본값: *)
    LOG_LEVEL: 로그 레벨 (기본값: INFO)
"""

import os
import logging
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from pydantic import BaseModel, Field, field_validator
from dotenv import load_dotenv

from calculator.saju_calculator import (
    calculate_saju,
    analyze_branch_interactions,
    calculate_shinsal,
    calculate_gongmang,
    get_all_hidden_stems,
    HEAVENLY_STEMS,
    EARTHLY_BRANCHES,
)
from calculator.daeun_calculator import calculate_daeun, get_current_daeun
from calculator.lotto_generator import generate_lotto_numbers, generate_multiple_sets

load_dotenv()

# ============================================================
# 설정
# ============================================================

API_SECRET = os.getenv('API_SECRET', '')
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', '*').split(',')
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO').upper()

logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
)
logger = logging.getLogger('saju-engine')

# ============================================================
# Rate Limiter
# ============================================================

limiter = Limiter(key_func=get_remote_address)

# ============================================================
# FastAPI 앱
# ============================================================

app = FastAPI(
    title='사주 계산 엔진',
    description='NAS Docker 기반 사주팔자 계산 API',
    version='1.0.0',
    docs_url='/docs' if os.getenv('ENV', 'development') == 'development' else None,
    redoc_url=None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=['GET', 'POST'],
    allow_headers=['Content-Type', 'X-API-Secret'],
)

# ============================================================
# 인증 의존성
# ============================================================

def verify_secret(request: Request):
    if not API_SECRET:
        return  # 시크릿 미설정 시 스킵 (개발 환경)
    secret = request.headers.get('X-API-Secret', '')
    if secret != API_SECRET:
        logger.warning(f'Unauthorized request from {request.client.host if request.client else "unknown"}')
        raise HTTPException(status_code=401, detail='Unauthorized')


# ============================================================
# 요청/응답 스키마
# ============================================================

class SajuRequest(BaseModel):
    year: int = Field(..., ge=1900, le=2100, description='생년')
    month: int = Field(..., ge=1, le=12, description='생월')
    day: int = Field(..., ge=1, le=31, description='생일')
    hour: Optional[int] = Field(None, ge=0, le=23, description='생시 (없으면 null)')
    gender: str = Field(..., pattern='^(male|female)$', description='성별')
    calendar_type: str = Field('solar', pattern='^(solar|lunar)$', description='양력/음력')

    @field_validator('year')
    @classmethod
    def validate_year(cls, v: int) -> int:
        if v < 1900 or v > 2100:
            raise ValueError('년도는 1900~2100 범위여야 합니다')
        return v


class LottoRequest(BaseModel):
    year: int = Field(..., ge=1900, le=2100)
    month: int = Field(..., ge=1, le=12)
    day: int = Field(..., ge=1, le=31)
    hour: Optional[int] = Field(None, ge=0, le=23)
    gender: str = Field(..., pattern='^(male|female)$')
    sets: int = Field(5, ge=1, le=10, description='생성할 번호 세트 수')


# ============================================================
# 헬스체크
# ============================================================

@app.get('/health')
async def health_check():
    return {'status': 'ok', 'timestamp': datetime.utcnow().isoformat()}


# ============================================================
# 사주 계산 엔드포인트
# ============================================================

@app.post('/saju/calculate', dependencies=[Depends(verify_secret)])
@limiter.limit('30/minute')
async def calculate_saju_api(request: Request, body: SajuRequest):
    """
    사주팔자 전체 계산
    - 사주팔자 (천간/지지/오행/십성/십이운성)
    - 대운 (8개)
    - 현재 대운
    - 지지 상호작용 (합/충/형/파/해)
    - 신살
    - 공망
    - 지장간
    """
    try:
        logger.info(f'사주 계산 요청: {body.year}/{body.month}/{body.day} {body.gender}')

        # 음력 변환 (필요 시)
        year, month, day = body.year, body.month, body.day
        if body.calendar_type == 'lunar':
            try:
                import korean_lunar_calendar
                calendar = korean_lunar_calendar.KoreanLunarCalendar()
                calendar.setLunarDate(year, month, day, False)
                solar = calendar.SolarIsoFormat().split('-')
                year, month, day = int(solar[0]), int(solar[1]), int(solar[2])
            except Exception as e:
                logger.warning(f'음력 변환 실패, 양력으로 처리: {e}')

        # 사주팔자 계산
        saju = calculate_saju(year, month, day, body.hour, body.gender)

        # 대운 계산
        daeun_list = calculate_daeun(
            year, month, day,
            body.gender,
            saju['month']['stem'],
            saju['month']['branch'],
        )

        # 현재 대운
        current_year = datetime.now().year
        current_daeun = get_current_daeun(daeun_list, current_year)

        # 지지 상호작용
        interactions = analyze_branch_interactions(saju)

        # 신살
        shinsal = calculate_shinsal(saju)

        # 공망
        gongmang = calculate_gongmang(saju['dayStem'], saju['day']['branch'])

        # 지장간
        hidden_stems = get_all_hidden_stems(saju)

        return {
            'saju': saju,
            'daeunList': daeun_list,
            'currentDaeun': current_daeun,
            'interactions': interactions,
            'shinsal': shinsal,
            'gongmang': gongmang,
            'hiddenStems': hidden_stems,
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f'사주 계산 오류: {e}', exc_info=True)
        raise HTTPException(status_code=500, detail='사주 계산 중 오류가 발생했습니다')


# ============================================================
# 로또 번호 생성 엔드포인트
# ============================================================

@app.post('/saju/lotto', dependencies=[Depends(verify_secret)])
@limiter.limit('10/minute')
async def generate_lotto_api(request: Request, body: LottoRequest):
    """
    사주 기반 로또 번호 생성
    - 오행 균형 반영
    - 신살 보너스 반영
    - 복수 세트 생성
    """
    try:
        logger.info(f'로또 번호 생성 요청: {body.year}/{body.month}/{body.day} {body.gender}')

        saju = calculate_saju(body.year, body.month, body.day, body.hour, body.gender)
        shinsal = calculate_shinsal(saju)

        # 단일 추천 번호
        main_numbers = generate_lotto_numbers(saju, shinsal)

        # 복수 세트
        multiple_sets = generate_multiple_sets(saju, shinsal, sets=body.sets)

        return {
            'main': main_numbers,
            'sets': multiple_sets,
            'dayStem': saju['dayStem'],
            'dayBranch': saju['day']['branch'],
        }

    except Exception as e:
        logger.error(f'로또 번호 생성 오류: {e}', exc_info=True)
        raise HTTPException(status_code=500, detail='로또 번호 생성 중 오류가 발생했습니다')


# ============================================================
# 절기 정보 엔드포인트
# ============================================================

@app.get('/solar-terms/{year}', dependencies=[Depends(verify_secret)])
@limiter.limit('20/minute')
async def get_solar_terms_api(request: Request, year: int):
    """특정 년도의 24절기 날짜 목록 반환"""
    if year < 1900 or year > 2100:
        raise HTTPException(status_code=400, detail='년도는 1900~2100 범위여야 합니다')

    from calculator.solar_terms import get_solar_term_date, SOLAR_TERMS

    terms = []
    for i, name in enumerate(SOLAR_TERMS):
        d = get_solar_term_date(year, i)
        terms.append({
            'index': i,
            'name': name,
            'date': d.isoformat(),
        })

    return {'year': year, 'terms': terms}


if __name__ == '__main__':
    import uvicorn
    port = int(os.getenv('PORT', '8000'))
    uvicorn.run('main:app', host='0.0.0.0', port=port, reload=False)
