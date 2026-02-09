# 🚀 배포 가이드

## 1️⃣ Resend 설정 (이메일 발송)

### 1단계: Resend 계정 생성
1. [resend.com](https://resend.com) 접속
2. "Sign Up" 클릭 → GitHub 계정으로 가입
3. 무료 티어: 월 3,000건 (충분함!)

### 2단계: API Key 발급
1. Dashboard → "API Keys" 메뉴
2. "Create API Key" 클릭
3. Name: `jaengseung-made-production`
4. Permission: `Sending access`
5. 생성된 키 복사 (한 번만 표시됨!)

### 3단계: 도메인 인증 (선택사항)
**옵션 A: Resend 서브도메인 사용 (간단)**
- `onboarding@resend.dev`에서 발송
- 바로 사용 가능

**옵션 B: 커스텀 도메인 사용 (전문적)**
1. Resend Dashboard → "Domains"
2. "Add Domain" 클릭
3. `jaengseung-made.com` 입력
4. DNS 레코드 복사

**가비아 DNS 설정:**
1. [가비아 My가비아](https://my.gabia.com) 로그인
2. "도메인" → "jaengseung-made.com" 선택
3. "DNS 정보" → "DNS 관리" 클릭
4. Resend에서 제공한 레코드 추가:
   ```
   Type: TXT
   Host: _resend
   Value: [Resend에서 제공한 값]

   Type: MX
   Host: @
   Value: [Resend에서 제공한 값]
   Priority: 10
   ```
5. 저장 후 10~30분 대기
6. Resend에서 "Verify" 클릭

### 4단계: 로컬 환경변수 설정
`.env.local` 파일 수정:
```bash
RESEND_API_KEY=re_your_actual_api_key_here
```

---

## 2️⃣ Vercel 배포

### 1단계: GitHub 연동 (권장)

**GitHub에 푸시:**
```bash
# GitHub에 새 저장소 생성 (jaengseung-made)
git remote add github https://github.com/your-username/jaengseung-made.git
git push github main
```

**Vercel 배포:**
1. [vercel.com](https://vercel.com) 가입 (GitHub 연동)
2. "Add New Project" 클릭
3. GitHub 저장소 선택: `jaengseung-made`
4. Environment Variables 추가:
   - `RESEND_API_KEY`: [발급받은 키 붙여넣기]
5. "Deploy" 클릭
6. 배포 완료! (약 2분)

### 2단계: 도메인 연결 (jaengseung-made.com)

**Vercel 설정:**
1. Vercel Dashboard → 프로젝트 선택
2. "Settings" → "Domains"
3. "Add Domain" 클릭
4. `jaengseung-made.com` 입력
5. DNS 설정 안내 확인

**가비아 DNS 설정:**
1. [가비아 My가비아](https://my.gabia.com) 로그인
2. "도메인" → "jaengseung-made.com" 선택
3. "DNS 정보" → "DNS 관리" 클릭
4. 기존 A 레코드 삭제 (있다면)
5. 새 레코드 추가:

**방법 A: A 레코드 (권장)**
```
Type: A
Host: @
Value: 76.76.19.19
TTL: 600
```

**방법 B: CNAME 레코드**
```
Type: CNAME
Host: @
Value: cname.vercel-dns.com.
TTL: 600
```

**www 서브도메인 추가:**
```
Type: CNAME
Host: www
Value: cname.vercel-dns.com.
TTL: 600
```

6. 저장 후 10~30분 대기
7. Vercel에서 자동으로 SSL 인증서 발급 (HTTPS)

### 3단계: 배포 확인
- https://jaengseung-made.com 접속
- 문의 폼 테스트 (실제 이메일 발송 확인)

---

## 3️⃣ 대안: Gitea + Vercel CLI 직접 배포

Vercel CLI로 직접 배포:
```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 폴더에서 실행
cd C:\Users\박재오\Desktop\workspace\jaengseung-made

# 로그인
vercel login

# 배포
vercel --prod

# 환경변수 추가
vercel env add RESEND_API_KEY
# [발급받은 키 붙여넣기]
# Production, Preview, Development 모두 선택

# 재배포
vercel --prod
```

---

## 4️⃣ Synology NAS 배포 (비추천)

성능/안정성 이유로 비추천하지만, 원하시면:

### Docker로 배포
1. `Dockerfile` 생성 (이미 있음)
2. Docker 이미지 빌드:
```bash
docker build -t jaengseung-made .
```
3. 컨테이너 실행:
```bash
docker run -d -p 3000:3000 \
  -e RESEND_API_KEY=your_key \
  --name jaengseung-made \
  jaengseung-made
```
4. 포트 포워딩: 라우터에서 80 → NAS IP:3000
5. 가비아 DNS: A 레코드를 공인 IP로 설정

**문제점:**
- 느린 속도 (가정용 인터넷)
- 다운타임 (정전, 재부팅)
- HTTPS 수동 설정 필요 (Let's Encrypt)
- 보안 관리 필요

---

## 5️⃣ 최종 체크리스트

### 배포 전
- [ ] Resend 계정 생성 및 API Key 발급
- [ ] `.env.local`에 API Key 설정
- [ ] 로컬에서 문의 폼 테스트 (http://localhost:3000)
- [ ] Git 커밋 및 푸시

### Vercel 배포
- [ ] Vercel 계정 생성 (GitHub 연동)
- [ ] 프로젝트 배포
- [ ] 환경변수 추가 (RESEND_API_KEY)
- [ ] 배포 URL에서 테스트

### 도메인 연결
- [ ] Vercel에 도메인 추가
- [ ] 가비아 DNS 설정 (A 레코드)
- [ ] www 서브도메인 추가 (CNAME)
- [ ] SSL 인증서 자동 발급 확인 (10~30분)
- [ ] https://jaengseung-made.com 접속 확인

### 최종 테스트
- [ ] 문의 폼 실제 발송 테스트
- [ ] bgg8988@gmail.com으로 이메일 수신 확인
- [ ] 모바일에서 접속 테스트
- [ ] 모든 링크 동작 확인

### 마케팅
- [ ] 크몽 서비스 등록 (포트폴리오 URL 첨부)
- [ ] 숨고 프로필 생성
- [ ] Google Search Console 등록
- [ ] 메타 태그 확인 (이미 적용됨)

---

## 🆘 트러블슈팅

### 문의 폼이 작동하지 않아요
1. `.env.local`에 `RESEND_API_KEY` 확인
2. Vercel 환경변수 설정 확인
3. Resend Dashboard에서 "Logs" 확인
4. 브라우저 개발자 도구 → Network 탭 확인

### 도메인이 연결되지 않아요
1. DNS 전파 대기 (최대 24시간, 보통 30분)
2. DNS 전파 확인: https://dnschecker.org
3. 가비아 DNS 설정 재확인
4. Vercel Domain 상태 확인

### 이메일이 오지 않아요
1. Resend Dashboard → "Logs" 확인
2. 스팸 메일함 확인
3. API Key 권한 확인 (Sending access)
4. 도메인 인증 상태 확인 (커스텀 도메인 사용 시)

---

## 📞 지원

배포 관련 문의: bgg8988@gmail.com
