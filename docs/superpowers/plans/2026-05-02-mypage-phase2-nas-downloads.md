# mypage Phase 2 — NAS 자료 다운로드 자동화 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Music 팩 구매자가 mypage에서 자료를 자동 다운로드할 수 있게 한다 — admin이 `/admin/packs`에서 자료 업로드, order.status='completed' 마킹 후 사용자가 [다운로드] 클릭 시 4시간 만료 DSM 공유 링크 발급.

**Architecture:** 두 repo 작업. `web-backend/packs-lab/` (FastAPI, NAS) 신규 lab — DSM API 호출 + 5GB multipart 업로드 수신. `jaengseung-made` (Vercel/Next.js) — supabase 인증/권한 검증 + admin UI + mypage 다운로드. Vercel function body limit(4.5MB) 우회: admin 업로드는 Vercel이 일회성 HMAC 토큰만 발급 → 브라우저가 web-backend로 직접 multipart POST.

**Tech Stack:** Next.js 16 App Router + TS + Tailwind v4 + Supabase / FastAPI + httpx + pytest / Docker Compose + nginx / Synology DSM 7.x SYNO.FileStation.Sharing v3.

**Spec:** `docs/superpowers/specs/2026-05-02-mypage-phase2-nas-downloads-design.md`

**Two repos:**
- `C:\Users\jaeoh\Desktop\workspace\jaengseung-made` (this repo, Vercel)
- `C:\Users\jaeoh\Desktop\workspace\web-backend` (separate repo, Gitea webhook → NAS auto-deploy)

---

## File Structure

### web-backend (NAS) — 신규 `packs-lab` 라이프

```
web-backend/packs-lab/
├── Dockerfile
├── app/
│   ├── __init__.py
│   ├── main.py             # FastAPI app, CORS, healthcheck, router 마운트
│   ├── auth.py             # HMAC 검증 (Vercel ↔ backend, 일회성 upload 토큰)
│   ├── dsm_client.py       # DSM API wrapper — login/logout/Sharing.create
│   ├── routes.py           # 4 endpoint: upload / sign-link / list / delete
│   ├── models.py           # pydantic 요청·응답 스키마
│   └── requirements.txt
└── tests/
    ├── __init__.py
    ├── test_auth.py        # HMAC 검증 단위 테스트
    └── test_routes.py      # 라우트 통합 테스트 (DSM mock)
```

기타:
- `web-backend/docker-compose.yml`: 신규 service `packs-lab` 추가
- `web-backend/nginx/default.conf`: `/api/packs/*` 라우팅 + `/api/packs/upload` 만 `client_max_body_size 5G`
- NAS 운영 `.env`: `DSM_HOST`, `DSM_USER`, `DSM_PASS`, `BACKEND_HMAC_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` 추가

### jaengseung-made (Vercel) — 추가/수정

```
supabase/migrations/
└── 2026-05-02-create-pack-files.sql   # CREATE TABLE pack_files + index + RLS

lib/
├── pack-assets.ts                     # MODIFY: PACK_ASSETS.files 제거, PACK_TIER_NAMES export 추가
├── supabase/pack-files.ts             # CREATE: 쿼리 헬퍼 + tier hierarchy
└── web-backend.ts                     # CREATE: web-backend HMAC 클라이언트 (signLink, mintUploadToken)

app/api/packs/sign-link/route.ts       # CREATE: 사용자 다운로드 권한 검증 + 프록시
app/api/admin/packs/upload-url/route.ts # CREATE: admin 일회성 업로드 토큰 발급
app/api/admin/packs/route.ts           # CREATE: 목록(GET) + 편집(PATCH) + 삭제(DELETE)

app/admin/packs/page.tsx               # CREATE: admin 자료 관리 UI
app/admin/components/AdminSidebar.tsx  # MODIFY: "팩 자료" 메뉴 추가
app/mypage/page.tsx                    # MODIFY: 다운로드 버튼 활성화 + status 분기
```

---

## 검증 인프라

- **web-backend**: pytest 사용 가능 (`web-backend/personal/`에서 패턴 확인됨). 새 lab tests/도 pytest로.
- **jaengseung-made**: jest/vitest 미설치 → `npx eslint` + `npm run build` + 시각/integration 수동.

---

## Task 순서 (의존성)

```
Phase A (Backend foundation, web-backend)
  A1 → A2 → A3 → A4 → A5 → A6
Phase B (DB + Vercel API, jaengseung-made)
  B1 (DB) → B2, B3 (lib) → B4, B5, B6 (API routes)
Phase C (Frontend, jaengseung-made)
  C1 → C2 → C3
Phase D (Integration)
  D1 (smoke test) → D2 (memory 갱신)
```

Phase A를 먼저 끝낸 후 Phase B 시작 (B의 API가 A의 backend 호출). Phase C는 B 완료 후. Phase D는 마지막.

---

# Phase A — Backend Foundation (web-backend)

## Task A1: packs-lab 스캐폴드

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\web-backend\packs-lab\Dockerfile`
- Create: `C:\Users\jaeoh\Desktop\workspace\web-backend\packs-lab\app\__init__.py` (빈 파일)
- Create: `C:\Users\jaeoh\Desktop\workspace\web-backend\packs-lab\app\requirements.txt`
- Create: `C:\Users\jaeoh\Desktop\workspace\web-backend\packs-lab\app\main.py`
- Create: `C:\Users\jaeoh\Desktop\workspace\web-backend\packs-lab\app\models.py`

- [ ] **Step 1: Dockerfile (lotto/Dockerfile 패턴 그대로)**

```dockerfile
FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

COPY app/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY app /app/app

ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- [ ] **Step 2: requirements.txt**

```
fastapi==0.115.6
uvicorn[standard]==0.32.1
httpx==0.28.1
python-multipart==0.0.20
supabase==2.12.0
pydantic==2.10.4
```

- [ ] **Step 3: app/__init__.py — 빈 파일**

```python
# packs-lab package
```

- [ ] **Step 4: app/models.py — pydantic 스키마**

```python
"""Pydantic schemas for packs API."""
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

PackTier = Literal["starter", "pro", "master"]


class SignLinkRequest(BaseModel):
    """Vercel → backend: 사용자 다운로드 링크 발급 요청."""
    file_path: str = Field(..., description="NAS 절대 경로 — pack_files.file_path 그대로")
    expires_in_seconds: int = Field(default=14400, description="공유 링크 만료 (기본 4시간)")


class SignLinkResponse(BaseModel):
    url: str
    expires_at: datetime


class UploadResponse(BaseModel):
    file_id: str  # uuid
    file_path: str
    filename: str
    size_bytes: int
    min_tier: PackTier
    label: str
    uploaded_at: datetime
```

- [ ] **Step 5: app/main.py — FastAPI 앱 + healthcheck**

```python
"""packs-lab FastAPI application.

NAS 자료 다운로드 자동화 — DSM 공유 링크 발급 + 5GB 멀티파트 업로드 수신.
모든 Vercel 호출은 HMAC 인증. 사용자 다운로드는 Vercel이 supabase 인증 후 프록시.
"""
import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(levelname)s %(message)s")
logger = logging.getLogger("packs-lab")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # DSM credentials presence check
    for key in ("DSM_HOST", "DSM_USER", "DSM_PASS", "BACKEND_HMAC_SECRET"):
        if not os.getenv(key):
            logger.warning("환경변수 %s 미설정 — packs-lab 일부 기능 작동 안 함", key)
    logger.info("packs-lab 시작")
    yield


app = FastAPI(lifespan=lifespan, title="packs-lab", version="1.0.0")


@app.get("/health")
def health():
    return {"status": "ok", "service": "packs-lab"}
```

- [ ] **Step 6: 빌드 검증 (Dockerfile syntax)**

이 task는 배포 X. 다음 task에서 통합 빌드.

- [ ] **Step 7: 커밋 (web-backend repo)**

```bash
cd /c/Users/jaeoh/Desktop/workspace/web-backend
git add packs-lab/
git commit -m "feat(packs-lab): 스캐폴드 — Dockerfile + main.py + models.py"
```

---

## Task A2: HMAC 인증 모듈

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\web-backend\packs-lab\app\auth.py`
- Create: `C:\Users\jaeoh\Desktop\workspace\web-backend\packs-lab\tests\__init__.py` (빈 파일)
- Create: `C:\Users\jaeoh\Desktop\workspace\web-backend\packs-lab\tests\test_auth.py`

이 task는 TDD로 — 테스트 먼저, 그 다음 구현.

- [ ] **Step 1: tests/__init__.py 생성**

빈 파일.

- [ ] **Step 2: tests/test_auth.py — 실패 테스트 작성**

```python
"""HMAC 인증 단위 테스트.

- verify_request_hmac: Vercel ↔ backend 요청 시그니처 검증
- verify_upload_token: 일회성 업로드 토큰 검증 (jti 단발성)
"""
import json
import os
import time
import uuid

import pytest
from fastapi import HTTPException

# 환경변수 먼저 세팅 (auth import 전)
os.environ["BACKEND_HMAC_SECRET"] = "test-secret-32-bytes-XXXXXXXXXXXX"

from app import auth  # noqa: E402


def test_verify_request_hmac_valid():
    body = b'{"file_path":"/x"}'
    ts = str(int(time.time()))
    sig = auth._sign(ts.encode() + b"." + body)
    auth.verify_request_hmac(body, ts, sig)  # 예외 X


def test_verify_request_hmac_expired():
    body = b'{}'
    old_ts = str(int(time.time()) - 600)  # 10분 전
    sig = auth._sign(old_ts.encode() + b"." + body)
    with pytest.raises(HTTPException) as exc:
        auth.verify_request_hmac(body, old_ts, sig)
    assert exc.value.status_code == 401


def test_verify_request_hmac_wrong_sig():
    body = b'{}'
    ts = str(int(time.time()))
    with pytest.raises(HTTPException):
        auth.verify_request_hmac(body, ts, "deadbeef")


def test_upload_token_roundtrip():
    payload = {
        "tier": "master",
        "label": "샘플 영상",
        "filename": "sample.mp4",
        "size_bytes": 1024,
        "expires_at": int(time.time()) + 600,
        "jti": uuid.uuid4().hex,
    }
    token = auth.mint_upload_token(payload)
    decoded = auth.verify_upload_token(token)
    assert decoded["filename"] == "sample.mp4"
    assert decoded["jti"] == payload["jti"]


def test_upload_token_replay_rejected():
    payload = {
        "tier": "starter",
        "label": "x",
        "filename": "y.pdf",
        "size_bytes": 1,
        "expires_at": int(time.time()) + 600,
        "jti": uuid.uuid4().hex,
    }
    token = auth.mint_upload_token(payload)
    auth.verify_upload_token(token)  # 첫 사용 OK
    with pytest.raises(HTTPException) as exc:
        auth.verify_upload_token(token)  # 재사용
    assert "이미" in exc.value.detail or "used" in exc.value.detail.lower()


def test_upload_token_expired():
    payload = {
        "tier": "starter",
        "label": "x",
        "filename": "y.pdf",
        "size_bytes": 1,
        "expires_at": int(time.time()) - 100,
        "jti": uuid.uuid4().hex,
    }
    token = auth.mint_upload_token(payload)
    with pytest.raises(HTTPException):
        auth.verify_upload_token(token)
```

- [ ] **Step 3: 테스트 실행 (실패 확인)**

```bash
cd /c/Users/jaeoh/Desktop/workspace/web-backend/packs-lab
python -m pytest tests/test_auth.py -v
```
Expected: ImportError 또는 ModuleNotFoundError (auth.py 없음).

- [ ] **Step 4: app/auth.py — 구현**

```python
"""HMAC 인증.

- verify_request_hmac: Vercel ↔ backend 요청 검증.
  Vercel이 X-Timestamp + X-Signature 헤더로 보냄. signature = HMAC(timestamp.body, secret).
  요청은 5분 이내여야 함 (replay 방어).

- mint_upload_token / verify_upload_token: admin 5GB 업로드 일회성 토큰.
  Vercel이 발급, browser가 web-backend에 직접 multipart POST 시 Authorization: Bearer <token>.
  JTI 단발성으로 재사용 차단.
"""
import base64
import hashlib
import hmac
import json
import os
import time
from threading import Lock

from fastapi import HTTPException

_SECRET = os.getenv("BACKEND_HMAC_SECRET", "")
REQUEST_MAX_AGE_SEC = 300  # 5분

# JTI 단발성 set (in-memory, 단일 컨테이너 가정)
_used_jti: set[str] = set()
_jti_lock = Lock()


def _sign(payload: bytes) -> str:
    if not _SECRET:
        raise HTTPException(status_code=503, detail="BACKEND_HMAC_SECRET 미설정")
    return hmac.new(_SECRET.encode(), payload, hashlib.sha256).hexdigest()


def verify_request_hmac(body: bytes, timestamp: str, signature: str) -> None:
    """Vercel → backend 요청 시그니처 검증."""
    if not timestamp or not signature:
        raise HTTPException(status_code=401, detail="HMAC 헤더 누락")
    try:
        ts = int(timestamp)
    except ValueError:
        raise HTTPException(status_code=401, detail="잘못된 timestamp")
    age = abs(int(time.time()) - ts)
    if age > REQUEST_MAX_AGE_SEC:
        raise HTTPException(status_code=401, detail="요청이 만료됨")
    expected = _sign(timestamp.encode() + b"." + body)
    if not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=401, detail="HMAC 시그니처 불일치")


def mint_upload_token(payload: dict) -> str:
    """일회성 업로드 토큰 발급. payload는 expires_at + jti 포함해야 함."""
    body = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode()
    sig = _sign(body)
    return base64.urlsafe_b64encode(body).decode() + "." + sig


def verify_upload_token(token: str) -> dict:
    """업로드 토큰 검증 + jti 사용 마킹."""
    try:
        b64, sig = token.split(".", 1)
        body = base64.urlsafe_b64decode(b64.encode())
    except Exception:
        raise HTTPException(status_code=401, detail="잘못된 토큰 포맷")

    expected = _sign(body)
    if not hmac.compare_digest(expected, sig):
        raise HTTPException(status_code=401, detail="토큰 시그니처 불일치")

    payload = json.loads(body)
    expires_at = payload.get("expires_at", 0)
    if int(time.time()) > expires_at:
        raise HTTPException(status_code=401, detail="토큰 만료")

    jti = payload.get("jti")
    if not jti:
        raise HTTPException(status_code=401, detail="jti 누락")

    with _jti_lock:
        if jti in _used_jti:
            raise HTTPException(status_code=409, detail="이미 사용된 토큰")
        _used_jti.add(jti)

    return payload
```

- [ ] **Step 5: pytest.ini 또는 pyproject.toml로 import path 셋업**

`packs-lab/pytest.ini` 생성:
```ini
[pytest]
testpaths = tests
pythonpath = .
```

- [ ] **Step 6: 테스트 재실행 (전부 통과)**

```bash
cd /c/Users/jaeoh/Desktop/workspace/web-backend/packs-lab
pip install pytest httpx fastapi pydantic
python -m pytest tests/test_auth.py -v
```
Expected: 6 tests passed.

- [ ] **Step 7: 커밋**

```bash
cd /c/Users/jaeoh/Desktop/workspace/web-backend
git add packs-lab/app/auth.py packs-lab/tests/__init__.py packs-lab/tests/test_auth.py packs-lab/pytest.ini
git commit -m "feat(packs-lab): HMAC 인증 모듈 + 단위 테스트 (request HMAC + upload token)"
```

---

## Task A3: DSM 클라이언트

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\web-backend\packs-lab\app\dsm_client.py`

이 task는 외부 시스템(DSM) 의존이라 mock 기반 단위 테스트는 제한적. 통합 테스트는 D1에서 실 NAS로.

- [ ] **Step 1: dsm_client.py — 구현**

```python
"""Synology DSM 7.x API 클라이언트.

각 호출 = login → 작업 → logout (세션 풀링은 v1.1+에서). 단일 컨테이너 + 동시성 낮음 가정.

- create_share_link(file_path, expires_in_sec) -> share URL
"""
import logging
import os
from datetime import datetime, timedelta, timezone

import httpx

logger = logging.getLogger("packs-lab.dsm")

DSM_HOST = os.getenv("DSM_HOST", "")  # 예: https://gahusb.synology.me:5001
DSM_USER = os.getenv("DSM_USER", "")
DSM_PASS = os.getenv("DSM_PASS", "")

API_AUTH = "/webapi/auth.cgi"
API_SHARE = "/webapi/entry.cgi"


class DSMError(RuntimeError):
    pass


async def _login(client: httpx.AsyncClient) -> str:
    """DSM 세션 sid 반환."""
    if not all([DSM_HOST, DSM_USER, DSM_PASS]):
        raise DSMError("DSM 환경변수 미설정")
    r = await client.get(
        f"{DSM_HOST}{API_AUTH}",
        params={
            "api": "SYNO.API.Auth",
            "version": "7",
            "method": "login",
            "account": DSM_USER,
            "passwd": DSM_PASS,
            "session": "FileStation",
            "format": "sid",
        },
        timeout=15.0,
    )
    r.raise_for_status()
    data = r.json()
    if not data.get("success"):
        raise DSMError(f"DSM login 실패: {data.get('error')}")
    return data["data"]["sid"]


async def _logout(client: httpx.AsyncClient, sid: str) -> None:
    try:
        await client.get(
            f"{DSM_HOST}{API_AUTH}",
            params={
                "api": "SYNO.API.Auth",
                "version": "7",
                "method": "logout",
                "session": "FileStation",
                "_sid": sid,
            },
            timeout=10.0,
        )
    except Exception as e:
        logger.warning("DSM logout 실패: %s", e)


async def create_share_link(file_path: str, expires_in_sec: int = 14400) -> tuple[str, datetime]:
    """파일 공유 링크 생성. 반환: (URL, expires_at).

    file_path: NAS 절대경로 (예: /volume1/docker/webpage/media/packs/master/x.mp4)
    expires_in_sec: 만료 (기본 4시간)
    """
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=expires_in_sec)
    expire_time_ms = int(expires_at.timestamp() * 1000)

    async with httpx.AsyncClient(verify=True) as client:
        sid = await _login(client)
        try:
            r = await client.get(
                f"{DSM_HOST}{API_SHARE}",
                params={
                    "api": "SYNO.FileStation.Sharing",
                    "version": "3",
                    "method": "create",
                    "path": file_path,
                    "date_expired": expire_time_ms,
                    "_sid": sid,
                },
                timeout=15.0,
            )
            r.raise_for_status()
            data = r.json()
            if not data.get("success"):
                raise DSMError(f"DSM Sharing.create 실패: {data.get('error')}")
            links = data["data"]["links"]
            if not links:
                raise DSMError("Sharing 응답에 링크 없음")
            url = links[0]["url"]
            return url, expires_at
        finally:
            await _logout(client, sid)
```

- [ ] **Step 2: import sanity check**

```bash
cd /c/Users/jaeoh/Desktop/workspace/web-backend/packs-lab
python -c "from app import dsm_client; print('OK', dsm_client.create_share_link.__name__)"
```
Expected: `OK create_share_link`

- [ ] **Step 3: 커밋**

```bash
cd /c/Users/jaeoh/Desktop/workspace/web-backend
git add packs-lab/app/dsm_client.py
git commit -m "feat(packs-lab): DSM 7.x API client — Sharing.create wrapper (login/action/logout)"
```

---

## Task A4: Routes — sign-link / upload / list / delete

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\web-backend\packs-lab\app\routes.py`
- Modify: `C:\Users\jaeoh\Desktop\workspace\web-backend\packs-lab\app\main.py` (router 마운트)
- Modify: `C:\Users\jaeoh\Desktop\workspace\web-backend\packs-lab\app\models.py` (UploadResponse는 A1에 이미 있음, ListItem 추가)

- [ ] **Step 1: models.py에 ListItem 추가**

기존 models.py 파일 끝에 추가:

```python
class PackFileItem(BaseModel):
    id: str
    min_tier: PackTier
    label: str
    file_path: str
    filename: str
    size_bytes: int
    sort_order: int
    uploaded_at: datetime
```

- [ ] **Step 2: routes.py — 구현**

```python
"""packs-lab API 엔드포인트.

- POST /api/packs/sign-link — Vercel HMAC 인증 → DSM 공유 링크
- POST /api/packs/upload — 일회성 토큰 인증 → multipart 저장 + supabase INSERT
- GET /api/packs/list — Vercel HMAC 인증 → pack_files 전체 조회
- DELETE /api/packs/{file_id} — Vercel HMAC 인증 → soft delete + DSM 공유 정리
"""
import logging
import os
import re
import uuid
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, Header, Request, UploadFile
from supabase import Client, create_client

from .auth import verify_request_hmac, verify_upload_token
from .dsm_client import DSMError, create_share_link
from .models import (
    PackFileItem,
    SignLinkRequest,
    SignLinkResponse,
    UploadResponse,
)

logger = logging.getLogger("packs-lab.routes")
router = APIRouter(prefix="/api/packs")

PACK_BASE_DIR = Path("/volume1/docker/webpage/media/packs")
ALLOWED_EXT = {"pdf", "zip", "mp4", "mov", "mkv", "wav", "m4a", "mp3", "png", "jpg", "jpeg", "webp", "prj"}
MAX_BYTES = 5 * 1024 * 1024 * 1024  # 5GB
SAFE_FILENAME = re.compile(r"^[\w가-힣\-\.\(\)\s]+$")


def _supabase() -> Client:
    url = os.getenv("SUPABASE_URL", "")
    key = os.getenv("SUPABASE_SERVICE_KEY", "")
    if not url or not key:
        raise HTTPException(status_code=503, detail="Supabase 설정 미완료")
    return create_client(url, key)


def _check_filename(filename: str) -> str:
    if not SAFE_FILENAME.match(filename):
        raise HTTPException(status_code=400, detail="파일명에 허용되지 않은 문자가 포함되어 있습니다")
    if "/" in filename or "\\" in filename or filename.startswith("."):
        raise HTTPException(status_code=400, detail="잘못된 파일명")
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXT:
        raise HTTPException(status_code=400, detail=f"허용되지 않은 확장자: {ext}")
    return filename


@router.post("/sign-link", response_model=SignLinkResponse)
async def sign_link(
    request: Request,
    x_timestamp: str = Header(""),
    x_signature: str = Header(""),
):
    body = await request.body()
    verify_request_hmac(body, x_timestamp, x_signature)
    payload = SignLinkRequest.model_validate_json(body)

    # 경로 안전: PACK_BASE_DIR 하위인지 확인
    abs_path = Path(payload.file_path).resolve()
    if not str(abs_path).startswith(str(PACK_BASE_DIR)):
        raise HTTPException(status_code=400, detail="허용된 경로 외부")

    try:
        url, expires_at = await create_share_link(str(abs_path), payload.expires_in_seconds)
    except DSMError as e:
        logger.error("DSM 오류: %s", e)
        raise HTTPException(status_code=502, detail=f"DSM 오류: {e}")

    return SignLinkResponse(url=url, expires_at=expires_at)


@router.post("/upload", response_model=UploadResponse)
async def upload(
    file: UploadFile = File(...),
    authorization: str = Header(""),
):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization 헤더 누락")
    token = authorization[len("Bearer "):]
    payload = verify_upload_token(token)

    tier = payload["tier"]
    label = payload["label"]
    filename = _check_filename(payload["filename"])
    expected_size = int(payload["size_bytes"])

    tier_dir = PACK_BASE_DIR / tier
    tier_dir.mkdir(parents=True, exist_ok=True)
    target = tier_dir / filename
    if target.exists():
        raise HTTPException(status_code=409, detail="이미 존재하는 파일명입니다. 다른 이름으로 업로드하거나 기존 파일을 먼저 삭제하세요")

    # multipart 스트림 저장 + 크기 검증
    written = 0
    with target.open("wb") as f:
        while True:
            chunk = await file.read(1024 * 1024)
            if not chunk:
                break
            written += len(chunk)
            if written > MAX_BYTES:
                f.close()
                target.unlink(missing_ok=True)
                raise HTTPException(status_code=413, detail="파일 크기 5GB 초과")
            f.write(chunk)

    if written != expected_size:
        target.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail=f"실제 크기({written})와 토큰 크기({expected_size}) 불일치")

    # supabase INSERT
    sb = _supabase()
    file_id = str(uuid.uuid4())
    res = sb.table("pack_files").insert({
        "id": file_id,
        "min_tier": tier,
        "label": label,
        "file_path": str(target),
        "filename": filename,
        "size_bytes": written,
    }).execute()
    if not res.data:
        target.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail="DB INSERT 실패")

    return UploadResponse(
        file_id=file_id,
        file_path=str(target),
        filename=filename,
        size_bytes=written,
        min_tier=tier,
        label=label,
        uploaded_at=res.data[0]["uploaded_at"],
    )


@router.get("/list", response_model=list[PackFileItem])
async def list_files(
    request: Request,
    x_timestamp: str = Header(""),
    x_signature: str = Header(""),
):
    body = await request.body()
    verify_request_hmac(body, x_timestamp, x_signature)
    sb = _supabase()
    res = (
        sb.table("pack_files")
        .select("*")
        .is_("deleted_at", "null")
        .order("min_tier")
        .order("sort_order")
        .execute()
    )
    return [PackFileItem(**r) for r in (res.data or [])]


@router.delete("/{file_id}")
async def delete_file(
    file_id: str,
    request: Request,
    x_timestamp: str = Header(""),
    x_signature: str = Header(""),
):
    body = await request.body()
    verify_request_hmac(body, x_timestamp, x_signature)
    sb = _supabase()
    from datetime import datetime, timezone
    res = sb.table("pack_files").update({
        "deleted_at": datetime.now(timezone.utc).isoformat(),
    }).eq("id", file_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다")
    return {"ok": True}
```

- [ ] **Step 3: main.py에 router 마운트**

`web-backend/packs-lab/app/main.py` 마지막 (`@app.get("/health")` 다음)에 추가:

```python
from . import routes  # noqa: E402

app.include_router(routes.router)
```

- [ ] **Step 4: import sanity check**

```bash
cd /c/Users/jaeoh/Desktop/workspace/web-backend/packs-lab
python -c "from app.main import app; print('routes:', [r.path for r in app.routes])"
```
Expected 출력에 `/api/packs/sign-link`, `/api/packs/upload`, `/api/packs/list`, `/api/packs/{file_id}` 포함.

- [ ] **Step 5: 커밋**

```bash
cd /c/Users/jaeoh/Desktop/workspace/web-backend
git add packs-lab/app/routes.py packs-lab/app/main.py packs-lab/app/models.py
git commit -m "feat(packs-lab): 4 라우트 — sign-link, upload, list, delete (HMAC + supabase)"
```

---

## Task A5: Routes 통합 테스트 (mock DSM)

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\web-backend\packs-lab\tests\test_routes.py`

- [ ] **Step 1: 통합 테스트 작성**

```python
"""routes.py 통합 테스트 (DSM, supabase는 mock)."""
import os
import time
import uuid
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

# 테스트용 환경변수 (auth import 전)
os.environ["BACKEND_HMAC_SECRET"] = "test-secret-32-bytes-XXXXXXXXXXXX"
os.environ["DSM_HOST"] = "https://test.synology.me:5001"
os.environ["DSM_USER"] = "test"
os.environ["DSM_PASS"] = "test"
os.environ["SUPABASE_URL"] = "https://placeholder.supabase.co"
os.environ["SUPABASE_SERVICE_KEY"] = "placeholder-key"

from app import auth  # noqa: E402
from app.main import app  # noqa: E402

client = TestClient(app)


def _signed(body: bytes) -> dict:
    ts = str(int(time.time()))
    sig = auth._sign(ts.encode() + b"." + body)
    return {"X-Timestamp": ts, "X-Signature": sig, "Content-Type": "application/json"}


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["service"] == "packs-lab"


@patch("app.routes.create_share_link", new_callable=AsyncMock)
def test_sign_link_success(mock_share):
    mock_share.return_value = ("https://test.synology.me:5001/d/s/abc", datetime.now(timezone.utc))
    body = b'{"file_path":"/volume1/docker/webpage/media/packs/master/x.mp4","expires_in_seconds":14400}'
    r = client.post("/api/packs/sign-link", content=body, headers=_signed(body))
    assert r.status_code == 200
    assert "url" in r.json()


def test_sign_link_no_hmac():
    r = client.post("/api/packs/sign-link", json={"file_path": "/x"})
    assert r.status_code == 401


def test_sign_link_path_outside_base():
    body = b'{"file_path":"/etc/passwd","expires_in_seconds":14400}'
    r = client.post("/api/packs/sign-link", content=body, headers=_signed(body))
    assert r.status_code == 400


def test_upload_invalid_token():
    r = client.post(
        "/api/packs/upload",
        files={"file": ("x.pdf", b"abc", "application/pdf")},
        headers={"Authorization": "Bearer invalid"},
    )
    assert r.status_code == 401


def test_upload_no_auth():
    r = client.post(
        "/api/packs/upload",
        files={"file": ("x.pdf", b"abc", "application/pdf")},
    )
    assert r.status_code == 401


@patch("app.routes._supabase")
def test_list_success(mock_sb):
    mock_table = MagicMock()
    mock_table.select.return_value = mock_table
    mock_table.is_.return_value = mock_table
    mock_table.order.return_value = mock_table
    mock_table.execute.return_value = MagicMock(data=[
        {
            "id": str(uuid.uuid4()),
            "min_tier": "starter",
            "label": "테스트",
            "file_path": "/volume1/.../x.pdf",
            "filename": "x.pdf",
            "size_bytes": 100,
            "sort_order": 0,
            "uploaded_at": "2026-05-02T12:00:00+00:00",
        }
    ])
    mock_sb.return_value.table.return_value = mock_table

    body = b''
    r = client.get("/api/packs/list", headers=_signed(body))
    assert r.status_code == 200
    assert len(r.json()) == 1
```

- [ ] **Step 2: 테스트 실행**

```bash
cd /c/Users/jaeoh/Desktop/workspace/web-backend/packs-lab
python -m pytest tests/ -v
```
Expected: 11 tests passed (auth 6 + routes 5 신규 — list 1, sign-link 3, upload 2, health 1 = 7).
실제 카운트: test_auth.py 6 + test_routes.py 7 = 13 passed.

- [ ] **Step 3: 커밋**

```bash
cd /c/Users/jaeoh/Desktop/workspace/web-backend
git add packs-lab/tests/test_routes.py
git commit -m "test(packs-lab): routes 통합 테스트 (DSM·supabase mock)"
```

---

## Task A6: docker-compose + nginx + .env 변수

**Files:**
- Modify: `C:\Users\jaeoh\Desktop\workspace\web-backend\docker-compose.yml`
- Modify: `C:\Users\jaeoh\Desktop\workspace\web-backend\nginx\default.conf`

- [ ] **Step 1: docker-compose.yml에 packs-lab 서비스 추가**

기존 `personal:` 블록 다음에 추가 (포트 18910, 그 외 personal과 동일 패턴):

```yaml
  packs-lab:
    build:
      context: ./packs-lab
    container_name: packs-lab
    restart: unless-stopped
    ports:
      - "18910:8000"
    environment:
      DSM_HOST: ${DSM_HOST}
      DSM_USER: ${DSM_USER}
      DSM_PASS: ${DSM_PASS}
      BACKEND_HMAC_SECRET: ${BACKEND_HMAC_SECRET}
      SUPABASE_URL: ${SUPABASE_URL}
      SUPABASE_SERVICE_KEY: ${SUPABASE_SERVICE_KEY}
    volumes:
      - ${RUNTIME_PATH:-.}/media/packs:/volume1/docker/webpage/media/packs
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"]
      interval: 30s
      timeout: 5s
      retries: 3
```

- [ ] **Step 2: nginx/default.conf에 라우팅 추가**

기존 location 블록 옆에 추가 (예: `personal` location 다음):

```nginx
  # packs-lab — 사용자 다운로드 + admin upload
  location /api/packs/upload {
    resolver 127.0.0.11 valid=10s;
    set $packs_backend packs-lab:8000;
    client_max_body_size 5G;
    proxy_request_buffering off;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_pass http://$packs_backend$request_uri;
    proxy_read_timeout 1800s;
    proxy_send_timeout 1800s;
  }

  location /api/packs/ {
    resolver 127.0.0.11 valid=10s;
    set $packs_backend packs-lab:8000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_pass http://$packs_backend$request_uri;
  }
```

- [ ] **Step 3: 운영 .env에 변수 추가 안내 (실제 NAS .env는 git 미관리)**

이 step은 코드 변경 X. 운영자(CEO)가 NAS의 `/volume1/docker/webpage/.env`에 다음 추가:

```
DSM_HOST=https://gahusb.synology.me:5001
DSM_USER=web-packs-admin
DSM_PASS=<생성 후 입력>
BACKEND_HMAC_SECRET=<openssl rand -hex 32 결과>
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_KEY=<supabase service role key>
```

또한 `RUNTIME_PATH` 환경변수가 정의되어 있는지 확인. 미정의면 docker-compose.yml의 `${RUNTIME_PATH:-.}` 가 `.` 폴백 → `/volume1/docker/webpage/media/packs/` 디렉토리 미리 생성 필요.

CEO 절차 (수동):
```bash
ssh gahusb.synology.me
sudo mkdir -p /volume1/docker/webpage/media/packs/{starter,pro,master}
sudo chmod 755 /volume1/docker/webpage/media/packs
# DSM 신규 사용자 web-packs-admin 생성 (DSM Web UI > 제어판 > 사용자) — 권한: File Station 읽기/쓰기 + Sharing
# .env 편집 후
docker-compose up -d packs-lab
docker logs -f packs-lab  # healthcheck OK 확인
```

- [ ] **Step 4: 로컬 빌드 확인 (Docker Desktop)**

CEO 수동 — NAS 환경 그대로는 로컬 빌드 어렵지만 syntax 검증:

```bash
cd /c/Users/jaeoh/Desktop/workspace/web-backend
docker compose config | grep packs-lab  # YAML 파싱 OK 확인
nginx -t -c nginx/default.conf 2>&1 | head -5 || true  # 로컬에 nginx 있으면
```

- [ ] **Step 5: 커밋**

```bash
cd /c/Users/jaeoh/Desktop/workspace/web-backend
git add docker-compose.yml nginx/default.conf
git commit -m "feat(packs-lab): docker-compose 서비스 + nginx 라우팅 (5GB body limit)"
```

배포는 Gitea push 시 webhook으로 자동. push는 Phase A 완료 후 Phase D 통합 시점에서.

---

# Phase B — DB + Vercel API (jaengseung-made)

## Task B1: Supabase migration — pack_files 테이블

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\supabase\migrations\2026-05-02-create-pack-files.sql`

- [ ] **Step 1: SQL 마이그레이션 작성**

```sql
-- Phase 2: pack_files 테이블 — Music 팩 자료 메타데이터 SSOT

create table public.pack_files (
  id uuid primary key default gen_random_uuid(),
  min_tier text not null check (min_tier in ('starter', 'pro', 'master')),
  label text not null,
  file_path text not null unique,
  filename text not null,
  size_bytes bigint not null,
  sort_order int not null default 0,
  uploaded_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_pack_files_tier on public.pack_files(min_tier, sort_order)
  where deleted_at is null;

alter table public.pack_files enable row level security;

-- 일반 사용자 직접 SELECT 차단. /api/packs/* 라우트가 service role로 조회.
-- (RLS enabled + 정책 미정의 → 모든 anon/authenticated SELECT 거부)
```

- [ ] **Step 2: supabase 콘솔에서 적용 (수동)**

CEO 수동 단계 — supabase 대시보드 SQL Editor에 위 SQL 붙여넣기 → Run. 또는 supabase CLI:
```bash
supabase db push
```

이 step은 코드 변경 X — 매뉴얼.

- [ ] **Step 3: 커밋 (jaengseung-made repo)**

```bash
cd /c/Users/jaeoh/Desktop/workspace/jaengseung-made
git add supabase/migrations/2026-05-02-create-pack-files.sql
git commit -m "$(cat <<'EOF'
feat(db): pack_files 테이블 마이그레이션 — Phase 2 자료 다운로드 SSOT

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task B2: lib helpers — pack-files.ts + web-backend.ts

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\lib\supabase\pack-files.ts`
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\lib\web-backend.ts`

- [ ] **Step 1: lib/supabase/pack-files.ts**

```ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { PackTier } from '../pack-assets';

export interface PackFile {
  id: string;
  min_tier: PackTier;
  label: string;
  file_path: string;
  filename: string;
  size_bytes: number;
  sort_order: number;
  uploaded_at: string;
  deleted_at: string | null;
}

const TIER_HIERARCHY: Record<PackTier, PackTier[]> = {
  starter: ['starter'],
  pro: ['starter', 'pro'],
  master: ['starter', 'pro', 'master'],
};

export function tierIncludes(userTier: PackTier): PackTier[] {
  return TIER_HIERARCHY[userTier];
}

export async function getPackFilesForTiers(
  supabase: SupabaseClient,
  tiers: PackTier[],
): Promise<PackFile[]> {
  if (tiers.length === 0) return [];
  const { data, error } = await supabase
    .from('pack_files')
    .select('*')
    .in('min_tier', tiers)
    .is('deleted_at', null)
    .order('min_tier')
    .order('sort_order');
  if (error) throw error;
  return (data ?? []) as PackFile[];
}

export async function getPackFileById(
  supabase: SupabaseClient,
  id: string,
): Promise<PackFile | null> {
  const { data, error } = await supabase
    .from('pack_files')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle();
  if (error) throw error;
  return (data as PackFile) ?? null;
}
```

- [ ] **Step 2: lib/web-backend.ts**

```ts
import crypto from 'crypto';

const BACKEND_BASE = process.env.WEB_BACKEND_BASE ?? 'https://gahusb.synology.me';
const SECRET = process.env.BACKEND_HMAC_SECRET ?? '';

if (!SECRET && process.env.NODE_ENV === 'production') {
  console.warn('BACKEND_HMAC_SECRET 미설정 — web-backend 호출 실패할 것임');
}

function sign(payload: Buffer): string {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
}

interface SignLinkPayload {
  file_path: string;
  expires_in_seconds: number;
}

export async function signLink(payload: SignLinkPayload): Promise<{ url: string; expires_at: string }> {
  const body = Buffer.from(JSON.stringify(payload));
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = sign(Buffer.concat([Buffer.from(`${ts}.`), body]));

  const res = await fetch(`${BACKEND_BASE}/api/packs/sign-link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Timestamp': ts,
      'X-Signature': sig,
    },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`web-backend sign-link 실패 (${res.status}): ${text}`);
  }
  return res.json();
}

interface UploadTokenPayload {
  tier: 'starter' | 'pro' | 'master';
  label: string;
  filename: string;
  size_bytes: number;
}

export function mintUploadToken(input: UploadTokenPayload): { token: string; uploadUrl: string; expiresAt: number } {
  const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60;  // 15분
  const payload: Record<string, unknown> = {
    ...input,
    expires_at: expiresAt,
    jti: crypto.randomUUID(),
  };
  // web-backend 의 verify_upload_token 이 sort_keys=True + separators=(",", ":") 로 검증하므로
  // 키 알파벳 순서로 정렬한 객체를 JSON.stringify (JS 기본도 공백 없는 직렬화 → 호환)
  const orderedPayload = Object.keys(payload).sort().reduce((acc, k) => {
    acc[k] = payload[k];
    return acc;
  }, {} as Record<string, unknown>);
  const body = Buffer.from(JSON.stringify(orderedPayload));
  const sig = sign(body);
  const token = body.toString('base64url') + '.' + sig;
  return {
    token,
    uploadUrl: `${BACKEND_BASE}/api/packs/upload`,
    expiresAt,
  };
}

export async function listPackFilesViaBackend(): Promise<unknown[]> {
  const body = Buffer.alloc(0);
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = sign(Buffer.concat([Buffer.from(`${ts}.`), body]));
  const res = await fetch(`${BACKEND_BASE}/api/packs/list`, {
    method: 'GET',
    headers: { 'X-Timestamp': ts, 'X-Signature': sig },
  });
  if (!res.ok) throw new Error('list 실패');
  return res.json();
}

export async function deletePackFileViaBackend(id: string): Promise<void> {
  const body = Buffer.alloc(0);
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = sign(Buffer.concat([Buffer.from(`${ts}.`), body]));
  const res = await fetch(`${BACKEND_BASE}/api/packs/${id}`, {
    method: 'DELETE',
    headers: { 'X-Timestamp': ts, 'X-Signature': sig },
  });
  if (!res.ok) throw new Error('delete 실패');
}
```

- [ ] **Step 3: 린트 통과**

```bash
npx eslint lib/supabase/pack-files.ts lib/web-backend.ts
```
Expected: exit 0.

- [ ] **Step 4: 커밋**

```bash
git add lib/supabase/pack-files.ts lib/web-backend.ts
git commit -m "$(cat <<'EOF'
feat(packs): lib helpers — pack-files supabase 쿼리 + web-backend HMAC 클라이언트

- pack-files.ts: tier hierarchy + getPackFilesForTiers + getPackFileById
- web-backend.ts: signLink (HMAC sig) + mintUploadToken (일회성 jti, 15분 만료)
  + listPackFilesViaBackend + deletePackFileViaBackend

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task B3: lib/pack-assets.ts — files 폐기 + PACK_TIER_NAMES export

**Files:**
- Modify: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\lib\pack-assets.ts`

- [ ] **Step 1: 현재 파일 백업 위해 git 상태 확인**

```bash
git log --oneline lib/pack-assets.ts | head -3
```

- [ ] **Step 2: 파일 전체 재작성**

`lib/pack-assets.ts` 를 다음으로 교체:

```ts
export type PackTier = 'starter' | 'pro' | 'master';

/**
 * Tier 키 → 한국어 표시명 SSOT.
 * `app/services/music/page.tsx`의 TIERS와 일치 유지 필요 (현재 입문/프로/마스터).
 */
export const TIER_LABEL: Record<PackTier, string> = {
  starter: '입문',
  pro: '프로',
  master: '마스터',
};

const LABEL_TO_TIER: Record<string, PackTier> = Object.fromEntries(
  Object.entries(TIER_LABEL).map(([tier, label]) => [label, tier as PackTier])
);

/**
 * Tier 키 → 팩 이름 (mypage 표시용).
 * 자료 파일 리스트는 pack_files DB 테이블이 SSOT.
 */
export const PACK_TIER_NAMES: Record<PackTier, string> = {
  starter: `AI 음악 마스터 팩 (${TIER_LABEL.starter})`,
  pro: `AI 음악 마스터 팩 (${TIER_LABEL.pro})`,
  master: `AI 음악 마스터 팩 (${TIER_LABEL.master})`,
};

/**
 * orders.service ("구매 신청: AI 음악 마스터 팩 · 프로") → tier key.
 * 매칭 안 되면 null 반환 (Music 팩 외 의뢰).
 *
 * NOTE: service 문자열은 U+00B7 MIDDLE DOT (·) 사용.
 */
export function extractPackTier(service: string): PackTier | null {
  if (!service.startsWith('구매 신청:')) return null;
  const dotIdx = service.lastIndexOf('·');
  if (dotIdx === -1) return null;
  const tierName = service.slice(dotIdx + 1).trim();
  return LABEL_TO_TIER[tierName] ?? null;
}
```

변경 사항:
- `PackAsset` interface 제거 (files 사라짐)
- `PACK_ASSETS` const 제거
- `PACK_TIER_NAMES` 신규 export
- `TIER_LABEL`, `extractPackTier` 그대로
- Phase 2 migration note 코멘트 제거 (이제 마이그레이션 완료)

- [ ] **Step 3: 사용처 grep — mypage가 PACK_ASSETS 참조 중인지**

```bash
grep -n "PACK_ASSETS\|PackAsset" app/ lib/ --include="*.ts" --include="*.tsx" -r
```

mypage page.tsx 가 `PACK_ASSETS[tier]` 사용 중이면 Task C3에서 정리. 일단 Task B3 단독으로는 빌드 안 됨 — Task B3은 commit하되 빌드 통과는 Task C3까지 합쳐야 함.

→ **이 task는 빌드를 깨므로** Task C3 직전 또는 Task C3와 묶어서 처리 필요. 이 plan은 Task B3 단독 commit 후 Task C3 commit으로 빌드 복구한다.

- [ ] **Step 4: 린트만 통과**

```bash
npx eslint lib/pack-assets.ts
```
Expected: exit 0.

- [ ] **Step 5: 커밋**

```bash
git add lib/pack-assets.ts
git commit -m "$(cat <<'EOF'
refactor(packs): PACK_ASSETS.files 폐기 → DB SSOT

Phase 2 시작 — pack_files 테이블이 자료 리스트 source of truth.
PACK_TIER_NAMES export 신규 추가 (mypage가 카드 제목용으로 참조).
TIER_LABEL, extractPackTier 변경 없음.

Note: 이 commit 단독으로는 mypage 빌드 깨짐. Task C3 (mypage page.tsx 수정)
에서 PACK_ASSETS 참조 제거 + 새 데이터 흐름 적용 후 빌드 복구.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task B4: /api/packs/sign-link 라우트

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\api\packs\sign-link\route.ts`

- [ ] **Step 1: route.ts 작성**

```ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { extractPackTier, type PackTier } from '@/lib/pack-assets';
import { tierIncludes, getPackFileById } from '@/lib/supabase/pack-files';
import { signLink } from '@/lib/web-backend';

export const runtime = 'nodejs';

const EXPIRES_IN_SEC = 4 * 60 * 60;  // 4시간

export async function POST(request: Request) {
  const { fileId } = await request.json();
  if (!fileId || typeof fileId !== 'string') {
    return NextResponse.json({ error: 'fileId 필요' }, { status: 400 });
  }

  // 1) 사용자 인증
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2) orders 조회 — completed Music 팩 구매 확인
  const admin = createAdminClient();
  const { data: orders } = await admin
    .from('contact_requests')
    .select('service, status')
    .eq('user_id', user.id)
    .eq('status', 'completed');

  const tiers = new Set<PackTier>();
  for (const o of (orders ?? [])) {
    const t = extractPackTier(o.service);
    if (t) tierIncludes(t).forEach((x) => tiers.add(x));
  }
  if (tiers.size === 0) {
    return NextResponse.json({ error: '구매 내역이 없거나 결제 미완료입니다' }, { status: 403 });
  }

  // 3) 파일 조회 + tier 매칭
  const file = await getPackFileById(admin, fileId);
  if (!file) {
    return NextResponse.json({ error: '파일을 찾을 수 없습니다' }, { status: 404 });
  }
  if (!tiers.has(file.min_tier)) {
    return NextResponse.json({ error: '구매 등급에서 접근할 수 없는 파일입니다' }, { status: 403 });
  }

  // 4) web-backend 호출 → DSM 공유 링크
  try {
    const { url, expires_at } = await signLink({
      file_path: file.file_path,
      expires_in_seconds: EXPIRES_IN_SEC,
    });
    return NextResponse.json({ url, expiresAt: expires_at });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return NextResponse.json({ error: '링크 발급 실패', detail: msg }, { status: 502 });
  }
}
```

- [ ] **Step 2: createServerClient 헬퍼 확인**

```bash
ls lib/supabase/
```
`server.ts` 가 있어야 함. 없으면 cookieStore에서 supabase 만드는 패턴은 다른 어떤 라우트가 사용하는지 확인:
```bash
grep -rn "createServerClient\|cookies" app/api/saju/ | head
```

만약 server.ts 없으면 client.ts와 admin.ts 패턴 보고 추가 필요. 이 plan은 server.ts 존재 가정 — 없으면 Task B4 첫 step에 server.ts 생성 추가.

대안: 이 라우트에서 createServerClient 대신 **admin client + 쿠키에서 직접 user 조회** 방식 사용:

```ts
// 대안 — server.ts 없으면 이 패턴
import { cookies } from 'next/headers';
import { createServerClient as createSSRClient } from '@supabase/ssr';

const cookieStore = await cookies();
const supabase = createSSRClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {},  // route handler에서 set 불필요
    },
  },
);
```

→ 위 패턴을 그대로 라우트에 인라인. (Phase 2의 다른 라우트도 비슷한 패턴 — `lib/supabase/server.ts` 신설은 별도 cleanup task로 미루기.)

라우트 코드의 `createServerClient` import 부분을 위 패턴으로 교체:

```ts
import { createServerClient as createSSRClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// ...

const cookieStore = await cookies();
const supabase = createSSRClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {},
    },
  },
);
const { data: { user } } = await supabase.auth.getUser();
```

- [ ] **Step 3: 빌드 통과 확인**

```bash
npm run build 2>&1 | tail -20
```
Expected: 라우트 빌드 성공. mypage 가 Task B3 변경으로 깨져있을 수 있으나 Task C3까지 의도된 흐름.

- [ ] **Step 4: 커밋**

```bash
git add app/api/packs/sign-link/route.ts
git commit -m "$(cat <<'EOF'
feat(api): /api/packs/sign-link — 사용자 다운로드 권한 검증 + DSM 링크 발급

- supabase auth → user
- contact_requests.status='completed' 인 Music 팩 구매 확인
- extractPackTier로 tier 도출, hierarchy 매핑
- pack_files.min_tier 매칭 검증
- web-backend signLink 호출 → 4시간 만료 URL 반환

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task B5: /api/admin/packs/upload-url 라우트 (HMAC 토큰 발급)

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\api\admin\packs\upload-url\route.ts`

- [ ] **Step 1: route.ts**

```ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminTokenNode } from '@/lib/admin-auth';
import { mintUploadToken } from '@/lib/web-backend';
import type { PackTier } from '@/lib/pack-assets';

export const runtime = 'nodejs';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token && verifyAdminTokenNode(token);
}

const VALID_TIERS = new Set<PackTier>(['starter', 'pro', 'master']);
const MAX_BYTES = 5 * 1024 * 1024 * 1024;
const ALLOWED_EXT = new Set(['pdf', 'zip', 'mp4', 'mov', 'mkv', 'wav', 'm4a', 'mp3', 'png', 'jpg', 'jpeg', 'webp', 'prj']);

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { tier, label, filename, sizeBytes } = await request.json();

  if (!VALID_TIERS.has(tier)) {
    return NextResponse.json({ error: 'tier 유효하지 않음' }, { status: 400 });
  }
  if (!label || typeof label !== 'string' || label.length > 200) {
    return NextResponse.json({ error: 'label 필요 (1-200자)' }, { status: 400 });
  }
  if (!filename || typeof filename !== 'string') {
    return NextResponse.json({ error: 'filename 필요' }, { status: 400 });
  }
  const ext = filename.includes('.') ? filename.split('.').pop()!.toLowerCase() : '';
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json({ error: `허용되지 않은 확장자: ${ext}` }, { status: 400 });
  }
  if (typeof sizeBytes !== 'number' || sizeBytes <= 0 || sizeBytes > MAX_BYTES) {
    return NextResponse.json({ error: '파일 크기 0-5GB' }, { status: 400 });
  }

  const { token, uploadUrl, expiresAt } = mintUploadToken({
    tier,
    label,
    filename,
    size_bytes: sizeBytes,
  });

  return NextResponse.json({ token, uploadUrl, expiresAt });
}
```

- [ ] **Step 2: 빌드 통과**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 3: 커밋**

```bash
git add app/api/admin/packs/upload-url/route.ts
git commit -m "$(cat <<'EOF'
feat(api): /api/admin/packs/upload-url — admin 일회성 HMAC 업로드 토큰 발급

15분 만료 + jti 단발성. 브라우저는 이 토큰을 web-backend /api/packs/upload에
직접 multipart POST 시 Authorization Bearer 헤더로 전달 → Vercel function body
limit 우회 (5GB 업로드).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task B6: /api/admin/packs 라우트 (목록/편집/삭제)

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\api\admin\packs\route.ts`

- [ ] **Step 1: route.ts**

```ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminTokenNode } from '@/lib/admin-auth';
import { deletePackFileViaBackend } from '@/lib/web-backend';
import type { PackTier } from '@/lib/pack-assets';

export const runtime = 'nodejs';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token && verifyAdminTokenNode(token);
}

const VALID_TIERS = new Set<PackTier>(['starter', 'pro', 'master']);

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('pack_files')
    .select('*')
    .is('deleted_at', null)
    .order('min_tier')
    .order('sort_order');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ files: data ?? [] });
}

export async function PATCH(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id, label, sort_order, min_tier } = await request.json();
  if (!id) return NextResponse.json({ error: 'id 필요' }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (typeof label === 'string') updates.label = label;
  if (typeof sort_order === 'number') updates.sort_order = sort_order;
  if (typeof min_tier === 'string' && VALID_TIERS.has(min_tier as PackTier)) {
    updates.min_tier = min_tier;
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: '변경할 필드 없음' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('pack_files').update(updates).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id 필요' }, { status: 400 });

  // web-backend가 soft delete 담당 (DSM 정리도 backend가 향후 추가 예정)
  try {
    await deletePackFileViaBackend(id);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return NextResponse.json({ error: 'backend delete 실패', detail: msg }, { status: 502 });
  }
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 2: 빌드 통과**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 3: 커밋**

```bash
git add app/api/admin/packs/route.ts
git commit -m "$(cat <<'EOF'
feat(api): /api/admin/packs — admin 파일 목록/편집/삭제

- GET: pack_files 목록 (deleted_at IS NULL)
- PATCH: { id, label?, sort_order?, min_tier? } 인라인 편집
- DELETE: web-backend 통한 soft delete

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

# Phase C — Frontend (jaengseung-made)

## Task C1: /admin/packs 페이지

**Files:**
- Create: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\admin\packs\page.tsx`

- [ ] **Step 1: 페이지 작성**

```tsx
'use client';

import { useEffect, useState } from 'react';

type PackTier = 'starter' | 'pro' | 'master';

interface PackFile {
  id: string;
  min_tier: PackTier;
  label: string;
  filename: string;
  size_bytes: number;
  sort_order: number;
  uploaded_at: string;
}

const TIER_LABEL: Record<PackTier, string> = {
  starter: '입문',
  pro: '프로',
  master: '마스터',
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export default function AdminPacksPage() {
  const [files, setFiles] = useState<PackFile[]>([]);
  const [loading, setLoading] = useState(true);

  // 업로드 form state
  const [tier, setTier] = useState<PackTier>('starter');
  const [label, setLabel] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function loadFiles() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/packs');
      const data = await res.json();
      setFiles(data.files ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadFiles(); }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file || !label) return;
    setUploading(true);
    setProgress(0);

    try {
      // 1) Vercel API에서 일회성 토큰 발급
      const tokenRes = await fetch('/api/admin/packs/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          label,
          filename: file.name,
          sizeBytes: file.size,
        }),
      });
      if (!tokenRes.ok) {
        const err = await tokenRes.json();
        throw new Error(err.error ?? '토큰 발급 실패');
      }
      const { token, uploadUrl } = await tokenRes.json();

      // 2) 브라우저가 web-backend에 직접 multipart POST (XHR로 진행률 추적)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadUrl);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            setProgress(Math.round((ev.loaded / ev.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else {
            try {
              const { detail } = JSON.parse(xhr.responseText);
              reject(new Error(detail ?? `HTTP ${xhr.status}`));
            } catch {
              reject(new Error(`HTTP ${xhr.status}`));
            }
          }
        };
        xhr.onerror = () => reject(new Error('네트워크 오류'));
        const fd = new FormData();
        fd.append('file', file);
        xhr.send(fd);
      });

      // 3) 리스트 갱신
      setFile(null);
      setLabel('');
      setProgress(0);
      await loadFiles();
    } catch (e) {
      setError(e instanceof Error ? e.message : '업로드 실패');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string, label: string) {
    if (!confirm(`"${label}" 자료를 삭제하시겠습니까?`)) return;
    try {
      const res = await fetch(`/api/admin/packs?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('삭제 실패');
      await loadFiles();
    } catch (e) {
      alert(e instanceof Error ? e.message : '삭제 실패');
    }
  }

  async function handlePatch(id: string, updates: Partial<PackFile>) {
    try {
      await fetch('/api/admin/packs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      await loadFiles();
    } catch (e) {
      console.error(e);
    }
  }

  const grouped: Record<PackTier, PackFile[]> = {
    starter: files.filter((f) => f.min_tier === 'starter'),
    pro: files.filter((f) => f.min_tier === 'pro'),
    master: files.filter((f) => f.min_tier === 'master'),
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-white text-2xl font-bold">팩 자료 관리</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          NAS 자료 업로드 + 다운로드 활성화. 최대 5GB / 4시간 만료 공유 링크.
        </p>
      </div>

      {/* 업로드 폼 */}
      <form onSubmit={handleUpload} className="bg-slate-900 rounded-xl border border-slate-700 p-5 mb-8">
        <h2 className="text-white font-bold mb-4">새 자료 업로드</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value as PackTier)}
            disabled={uploading}
            className="bg-slate-800 text-white border border-slate-700 rounded px-3 py-2"
          >
            <option value="starter">{TIER_LABEL.starter}</option>
            <option value="pro">{TIER_LABEL.pro}</option>
            <option value="master">{TIER_LABEL.master}</option>
          </select>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            disabled={uploading}
            placeholder="자료 라벨 (예: Suno 프롬프트 북 PDF)"
            className="bg-slate-800 text-white border border-slate-700 rounded px-3 py-2 md:col-span-2"
          />
        </div>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          disabled={uploading}
          className="text-slate-300 mb-3 block"
        />
        {file && (
          <p className="text-slate-400 text-xs mb-3">
            선택됨: {file.name} ({formatSize(file.size)})
          </p>
        )}
        {uploading && (
          <div className="mb-3">
            <div className="bg-slate-800 rounded h-2 overflow-hidden">
              <div className="bg-violet-500 h-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-slate-400 text-xs mt-1">{progress}% 업로드 중... 페이지를 닫지 마세요</p>
          </div>
        )}
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          disabled={uploading || !file || !label}
          className="bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold px-5 py-2 rounded"
        >
          {uploading ? '업로드 중...' : '업로드'}
        </button>
      </form>

      {/* 자료 리스트 */}
      {loading ? (
        <p className="text-slate-400">불러오는 중...</p>
      ) : (
        (['starter', 'pro', 'master'] as PackTier[]).map((t) => (
          <div key={t} className="mb-6">
            <h3 className="text-white font-bold mb-2">
              {TIER_LABEL[t]} ({grouped[t].length})
            </h3>
            {grouped[t].length === 0 ? (
              <p className="text-slate-500 text-sm pl-2">자료 없음</p>
            ) : (
              <div className="space-y-2">
                {grouped[t].map((f) => (
                  <div key={f.id} className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex items-center gap-3">
                    <input
                      type="text"
                      defaultValue={f.label}
                      onBlur={(e) => {
                        if (e.target.value !== f.label) handlePatch(f.id, { label: e.target.value });
                      }}
                      className="flex-1 bg-transparent text-white border-b border-transparent focus:border-slate-500 px-1 py-1"
                    />
                    <span className="text-slate-400 text-xs">{f.filename}</span>
                    <span className="text-slate-500 text-xs">{formatSize(f.size_bytes)}</span>
                    <button
                      onClick={() => handleDelete(f.id, f.label)}
                      className="text-red-400 hover:text-red-300 text-sm px-2"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
```

- [ ] **Step 2: 린트**

```bash
npx eslint app/admin/packs/page.tsx
```

- [ ] **Step 3: 빌드**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: 커밋**

```bash
git add app/admin/packs/page.tsx
git commit -m "$(cat <<'EOF'
feat(admin): /admin/packs — 자료 업로드 + 인라인 편집 + 삭제 UI

- 업로드: tier 선택 + label + 파일 → /api/admin/packs/upload-url 토큰 발급
  → XHR로 web-backend에 직접 multipart POST (진행률 추적)
- 리스트: tier별 그룹 + label inline 편집 (blur 시 PATCH)
- 삭제: confirm 후 DELETE → soft delete

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task C2: AdminSidebar에 "팩 자료" 메뉴

**Files:**
- Modify: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\admin\components\AdminSidebar.tsx`

- [ ] **Step 1: 현재 메뉴 구조 확인**

```bash
grep -n "href" app/admin/components/AdminSidebar.tsx | head -10
```

기존 메뉴 패턴 보고 새 항목 추가 위치 결정.

- [ ] **Step 2: "팩 자료" 항목 추가**

기존 메뉴 array에 (예: documents 다음) 추가:

```tsx
{ href: '/admin/packs', label: '팩 자료', icon: '📦' },
```

(실제 패턴은 AdminSidebar.tsx 의 menu 정의 형식을 따름. icon이 string emoji 또는 SVG component 등 — 기존 항목 형태 그대로.)

- [ ] **Step 3: 빌드 + 시각**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: 커밋**

```bash
git add app/admin/components/AdminSidebar.tsx
git commit -m "$(cat <<'EOF'
feat(admin): AdminSidebar에 "팩 자료" 메뉴 추가

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task C3: mypage — 다운로드 버튼 활성화 + status 분기

**Files:**
- Modify: `C:\Users\jaeoh\Desktop\workspace\jaengseung-made\app\mypage\page.tsx`

⚠️ **이 task가 Task B3에서 깨진 빌드를 복구한다.** PACK_ASSETS 참조를 모두 제거하고 pack_files DB 데이터로 대체.

- [ ] **Step 1: import 변경**

`app/mypage/page.tsx` 상단의 pack-assets import를 다음으로 변경:

```tsx
// 기존:
import { PACK_ASSETS, extractPackTier, type PackTier } from '@/lib/pack-assets';

// 변경 후:
import { PACK_TIER_NAMES, extractPackTier, type PackTier } from '@/lib/pack-assets';
import { tierIncludes, type PackFile } from '@/lib/supabase/pack-files';
```

- [ ] **Step 2: state + fetch 추가**

mypage 컴포넌트 안의 useState 영역에 추가:

```tsx
const [packFiles, setPackFiles] = useState<PackFile[]>([]);
const [downloading, setDownloading] = useState<string | null>(null);
```

`init()` 함수에 packFiles fetch 추가 (orders fetch 다음):

```tsx
// pack_files: 사용자가 구매한 모든 tier의 합집합으로 fetch
const allTiers = new Set<PackTier>();
for (const o of (ord || [])) {
  const t = extractPackTier(o.service);
  if (t && o.status === 'completed') {
    tierIncludes(t).forEach((x) => allTiers.add(x));
  }
}
if (allTiers.size > 0) {
  const { data: pf } = await supabase
    .from('pack_files')
    .select('*')
    .in('min_tier', Array.from(allTiers))
    .is('deleted_at', null)
    .order('min_tier').order('sort_order');
  setPackFiles((pf as PackFile[]) ?? []);
}
```

⚠️ **주의**: 일반 사용자는 RLS로 pack_files SELECT 차단됨 (spec §4.3). 따라서 위 fetch는 작동 안 함. **수정**: pack_files를 mypage에서 직접 fetch 대신, `/api/packs/list-mine` 같은 사용자용 라우트 신설하거나 또는 RLS 정책에 "auth.uid()로 contact_requests를 조회 → completed 인 tier 매칭 → pack_files SELECT 허용" 추가 필요.

→ **선택**: 간단함을 위해 `/api/packs/list-mine` 라우트 신설 (다음 sub-step). RLS는 그대로 차단 유지.

`/api/packs/list-mine` 라우트 신설 (`app/api/packs/list-mine/route.ts`):

```ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient as createSSRClient } from '@supabase/ssr';
import { createAdminClient } from '@/lib/supabase/admin';
import { extractPackTier, type PackTier } from '@/lib/pack-assets';
import { tierIncludes, getPackFilesForTiers } from '@/lib/supabase/pack-files';

export const runtime = 'nodejs';

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ files: [] });

  const admin = createAdminClient();
  const { data: orders } = await admin
    .from('contact_requests')
    .select('service, status')
    .eq('user_id', user.id)
    .eq('status', 'completed');

  const tiers = new Set<PackTier>();
  for (const o of (orders ?? [])) {
    const t = extractPackTier(o.service);
    if (t) tierIncludes(t).forEach((x) => tiers.add(x));
  }

  const files = await getPackFilesForTiers(admin, Array.from(tiers));
  return NextResponse.json({ files });
}
```

mypage init() 의 fetch는:

```tsx
const filesRes = await fetch('/api/packs/list-mine');
if (filesRes.ok) {
  const { files } = await filesRes.json();
  setPackFiles(files ?? []);
}
```

- [ ] **Step 3: 다운로드 핸들러**

mypage 함수 본문에 추가:

```tsx
async function handleDownload(fileId: string) {
  setDownloading(fileId);
  try {
    const res = await fetch('/api/packs/sign-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId }),
    });
    const data = await res.json();
    if (!res.ok || !data.url) {
      throw new Error(data.error ?? '링크 발급 실패');
    }
    window.location.href = data.url;
  } catch (e) {
    alert(e instanceof Error ? e.message : '다운로드 준비 중 오류가 발생했습니다');
  } finally {
    setDownloading(null);
  }
}
```

- [ ] **Step 4: "구매한 팩" 탭 JSX 변경**

기존 `tab === 'packs'` 블록의 카드 렌더링 부분 — 자료 패키지 리스트와 disabled 버튼 부분을 다음으로 교체:

```tsx
{/* 자료 리스트 — DB가 SSOT */}
{(() => {
  const filesForTier = packFiles.filter((pf) => {
    if (tier === 'starter') return pf.min_tier === 'starter';
    if (tier === 'pro') return pf.min_tier === 'starter' || pf.min_tier === 'pro';
    return true;  // master
  });

  return (
    <div className="border-t border-slate-100 pt-4">
      <div className="text-sm font-semibold text-slate-700 mb-3">
        📦 자료 패키지 ({filesForTier.length}개)
      </div>
      {filesForTier.length === 0 ? (
        <p className="text-xs text-slate-500">자료 준비 중. 카톡 1:1로 문의해주세요.</p>
      ) : (
        <ul className="space-y-2 mb-3">
          {filesForTier.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="text-slate-700 flex-1">{f.label}</span>
              {order.status === 'completed' ? (
                <button
                  onClick={() => handleDownload(f.id)}
                  disabled={downloading === f.id}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-violet-600 hover:bg-violet-500 disabled:bg-slate-300 text-white transition"
                >
                  {downloading === f.id ? '준비중...' : '다운로드'}
                </button>
              ) : (
                <span className="text-xs text-slate-400">대기 중</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {order.status === 'completed' && filesForTier.length > 0 && (
        <p className="text-xs text-slate-500 leading-relaxed">
          ※ 다운로드 링크는 4시간 동안 유효합니다.
        </p>
      )}

      {order.status !== 'completed' && (
        <p className="text-xs text-slate-500 mt-2 text-center leading-relaxed">
          {order.status === 'in_progress' ? '결제 처리 중. 자료는 결제 확인 후 활성화됩니다.' : '입금 대기 중. 카톡 1:1로 안내드립니다.'}
          <br />
          <a
            href="https://open.kakao.com/o/s9stoNvb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-600 hover:underline font-semibold"
          >
            카톡 오픈채팅 →
          </a>
        </p>
      )}
    </div>
  );
})()}
```

- [ ] **Step 5: PACK_ASSETS 모든 사용처 제거**

```bash
grep -n "PACK_ASSETS" app/mypage/page.tsx
```

기존 Phase 1 mypage의 packs 카드 안에 다음 패턴이 존재할 것:
```tsx
const asset = PACK_ASSETS[tier];
// ...
<div className="font-bold text-slate-900 text-base">{asset.name}</div>
// ...
{asset.files.map((file, i) => (
  <li key={i}>...</li>
))}
```

각각 다음으로 치환:

| 원본 | 치환 |
|---|---|
| `const asset = PACK_ASSETS[tier];` | (제거) |
| `{asset.name}` | `{PACK_TIER_NAMES[tier]}` |
| `📦 자료 패키지 ({asset.files.length}개)` | `📦 자료 패키지 ({filesForTier.length}개)` (step 4의 IIFE 안에서) |
| `{asset.files.map(...)}` | step 4의 `filesForTier.map(...)` 로 대체됨 |

최종 grep 결과:
```bash
grep -n "PACK_ASSETS\|asset\." app/mypage/page.tsx
```
Expected: 빈 결과.

- [ ] **Step 6: 빌드 + 린트 통과**

```bash
npx eslint app/mypage/page.tsx app/api/packs/list-mine/route.ts
npm run build
```

- [ ] **Step 7: 커밋**

```bash
git add app/mypage/page.tsx app/api/packs/list-mine/route.ts
git commit -m "$(cat <<'EOF'
feat(mypage): 다운로드 버튼 활성화 (Phase 2) + status 분기

- packFiles state + /api/packs/list-mine fetch (RLS 우회 위해 admin client 라우트)
- handleDownload: /api/packs/sign-link 호출 → window.location 이동
- 카드: 자료 리스트 DB SSOT (PACK_ASSETS.files 폐기)
- order.status === 'completed' 만 다운로드 활성, 그 외는 Phase 1 placeholder 유지
- 4시간 만료 안내 추가

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

# Phase D — Integration

## Task D1: 통합 smoke test (수동)

이 task는 코드 변경 없음. 사용자(CEO) 수동 검증.

- [ ] **Step 1: 사전 점검**

- [ ] NAS DSM 7.x — `web-packs-admin` 사용자 생성 (File Station 읽기/쓰기 + Sharing 권한)
- [ ] NAS `/volume1/docker/webpage/.env` — DSM_HOST/USER/PASS, BACKEND_HMAC_SECRET, SUPABASE_URL/SERVICE_KEY 6개 변수 추가
- [ ] NAS `/volume1/docker/webpage/media/packs/{starter,pro,master}/` 디렉토리 생성
- [ ] supabase migration 적용 (대시보드 SQL Editor에서 마이그레이션 SQL 실행)
- [ ] Vercel env — `BACKEND_HMAC_SECRET` (NAS .env와 동일), `WEB_BACKEND_BASE`(=`https://gahusb.synology.me`) 추가

- [ ] **Step 2: web-backend 배포**

```bash
cd /c/Users/jaeoh/Desktop/workspace/web-backend
git push  # Gitea webhook 자동 배포
# NAS에서 확인:
# ssh gahusb.synology.me
# docker logs -f packs-lab
```

healthcheck 통과 + `/health` 응답 OK 확인.

- [ ] **Step 3: jaengseung-made 배포**

```bash
cd /c/Users/jaeoh/Desktop/workspace/jaengseung-made
git push origin main  # Vercel 자동 배포
```

- [ ] **Step 4: admin 업로드 테스트**

1. `/admin` 로그인
2. 사이드바에서 "팩 자료" 진입
3. tier 'starter' 선택, label "테스트 PDF" 입력, 작은 PDF 선택, 업로드
4. 진행률 100% + 리스트에 추가됨 확인
5. NAS File Station에서 `/volume1/docker/webpage/media/packs/starter/` 에 파일 존재 확인
6. supabase 대시보드에서 `pack_files` 테이블에 row 추가 확인

- [ ] **Step 5: 사용자 다운로드 테스트**

1. 테스트용 사용자 계정으로 로그인 (또는 본인 계정)
2. PurchaseAgreementModal로 "AI 음악 마스터 팩 · 입문" 구매 신청 (실제 입금은 안 함)
3. `/admin/contacts` 진입 → 해당 row status: pending → completed 로 변경
4. 일반 사용자 로그인 → mypage → "구매한 팩" 탭
5. 자료 리스트 + [다운로드] 버튼 활성화 확인
6. 다운로드 클릭 → DSM 공유 URL로 redirect → 파일 다운로드 시작 확인
7. 4시간 후 동일 URL 접속 시 만료 확인 (또는 DSM 공유 관리에서 만료 일시 확인)

- [ ] **Step 6: 보안 케이스 검증**

- 다른 tier 파일 ID로 sign-link 호출 시 → 403
- 비로그인 sign-link → 401
- order.status='pending'인 사용자가 sign-link → 403
- 잘못된 admin token으로 upload-url → 401
- 동일 jti 재사용 → 409

curl/Postman으로 확인.

이 task는 코드 변경/커밋 없음.

---

## Task D2: 메모리·운영 매뉴얼 갱신

**Files:**
- Modify: `C:\Users\jaeoh\.claude\projects\C--Users-jaeoh-Desktop-workspace-jaengseung-made\memory\MEMORY.md`
- Create: `C:\Users\jaeoh\.claude\projects\C--Users-jaeoh-Desktop-workspace-jaengseung-made\memory\project_phase2_packs.md`

- [ ] **Step 1: 새 메모리 파일 생성**

Path: `C:\Users\jaeoh\.claude\projects\C--Users-jaeoh-Desktop-workspace-jaengseung-made\memory\project_phase2_packs.md`

```markdown
---
name: Phase 2 NAS 자료 다운로드 (2026-05-02 완료)
description: Music 팩 자료 다운로드 자동화 — admin 업로드 + DSM 공유 링크 4시간 만료
type: project
---

# Phase 2 NAS 자료 다운로드

- **완료일**: 2026-05-02
- **spec**: docs/superpowers/specs/2026-05-02-mypage-phase2-nas-downloads-design.md
- **plan**: docs/superpowers/plans/2026-05-02-mypage-phase2-nas-downloads.md

## 운영 절차 (CEO)

### 새 자료 업로드
1. /admin/packs 진입
2. tier 선택 + label + 파일 (5GB 이내) → 업로드
3. 진행률 완료 → 자동으로 리스트 추가
4. 사용자에게 즉시 노출 (별도 publish 없음)

### 신규 구매 처리
1. PurchaseAgreementModal로 신청 도착 → contact_requests pending
2. 카톡 입금 안내
3. 입금 확인 → /admin/contacts → status pending → in_progress → completed
4. 사용자 mypage → 다운로드 버튼 활성

### 다운로드 동작
- 클릭 → /api/packs/sign-link → 사용자/tier 검증 → DSM Sharing.create (4시간 만료)
- URL은 https://gahusb.synology.me:5001/d/s/<id>
- 4시간 후 만료 → 사용자 재클릭 시 새 URL

## 인프라

- NAS DSM 7.x SYNO.FileStation.Sharing v3
- DSM 전용 계정: web-packs-admin (File Station + Sharing 권한만)
- NAS 자료 경로: /volume1/docker/webpage/media/packs/{starter,pro,master}/
- web-backend packs-lab 컨테이너 (port 18910), nginx /api/packs/* 라우팅
- /api/packs/upload 만 client_max_body_size 5G

## 보안 모델

- Vercel ↔ web-backend: HMAC sha256 (timestamp.body, BACKEND_HMAC_SECRET 32 byte)
- admin 업로드 토큰: 일회성 jti, 15분 만료
- DSM 공유 링크: 4시간 만료
- pack_files RLS: 사용자 직접 SELECT 차단, /api/packs/list-mine 만 통과

**Why:** 자동화로 CEO 운영 부담 ↓, 사용자 즉시 다운로드 → UX ↑.
**How to apply:** 자료 추가/교체는 admin/packs에서. 신규 구매는 admin/contacts status='completed' 설정 후 자동 활성.
```

- [ ] **Step 2: MEMORY.md 인덱스에 한 줄 추가**

```markdown
- [Phase 2 NAS 자료 다운로드](./project_phase2_packs.md) — Music 팩 자동 다운로드 (2026-05-02 완료)
```

- [ ] **Step 3: 메모리는 git에 commit 안 됨 (별도 디렉토리)**

이 step은 단순히 메모리 파일 작성 + 업데이트만. git commit X.

- [ ] **Step 4: Phase 2 완료 확인**

```bash
cd /c/Users/jaeoh/Desktop/workspace/jaengseung-made
git log --oneline 03b3ae8..HEAD | wc -l
```

기대: B + C + D 작업 commits ~10개 (B1 1, B2 1, B3 1, B4 1, B5 1, B6 1, C1 1, C2 1, C3 1 = 9개. D는 코드 commit 없음).

```bash
cd /c/Users/jaeoh/Desktop/workspace/web-backend
git log --oneline | head -7
```

기대: A 작업 commits 6개 (A1, A2, A3, A4, A5, A6).

이 task는 코드 변경 없음. 메모리만 갱신.

---

# 부록 A. 안전성 분석 — 단계별 깨짐 가능성

| 시점 | jaengseung-made 빌드 | web-backend 작동 | 사용자 영향 |
|---|---|---|---|
| Phase A 모두 완료 후 | 영향 X | packs-lab 컨테이너 작동 (DSM 호출 가능) | 영향 X (UI 미연결) |
| B1 후 | OK | OK | 영향 X (마이그레이션만) |
| B2 후 | OK | OK | 영향 X |
| B3 후 | **❌ 빌드 깨짐** (mypage 가 PACK_ASSETS 참조) | OK | 영향 X (배포 안 함) |
| B4-B6 후 | 깨짐 유지 | OK | 영향 X |
| C1 후 | 깨짐 유지 | OK | 영향 X |
| C2 후 | 깨짐 유지 | OK | 영향 X |
| C3 후 | **✅ 빌드 복구** | OK | UI 변경 노출 |

→ B3-C3 까지는 **로컬 commit만**, push 안 함. C3 commit 직후 push로 일괄 배포.

# 부록 B. 다음 plan 후속 (Phase 3+)

이 plan 종료 후 자연스럽게 따라올 항목:

1. ZIP 일괄 다운로드 — 사용자 multi-file UX 개선
2. 다운로드 횟수 제한 — DSM share에 max_count 설정
3. soft-deleted 파일 hard delete cron — 30일 후 NAS에서도 제거
4. DSM 세션 풀링 — packs-lab dsm_client 에 캐시
5. 워터마크 — PDF에 사용자 이메일 임베드
6. multipart 분할 업로드 — 5GB 초과 파일 대응

각각 별도 spec/plan으로.
