# 🤖 쟁승메이드 - RPA 자동화 & 비즈니스 솔루션

대기업 출신 개발자가 제공하는 전문 비즈니스 솔루션 포트폴리오 웹사이트

## 📌 프로젝트 소개

**쟁승메이드**는 RPA 자동화, 웹 개발, 앱 개발 서비스를 제공하는 비즈니스 솔루션 포트폴리오 사이트입니다.
외주 개발 서비스를 소개하고 프로젝트를 전시하여 고객을 유치하기 위한 전문적인 랜딩 페이지입니다.

### ✨ 주요 기능

- 🎨 현대적이고 프로페셔널한 디자인
- 📱 완벽한 반응형 (모바일/태블릿/데스크톱)
- ⚡ Next.js 14 + TypeScript로 빠른 성능
- 🎯 RPA 자동화 서비스 강조
- 💼 서비스 카탈로그 (금액별 분류)
- 🖼️ 프로젝트 포트폴리오 섹션
- 📬 문의 폼

## 🛠 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (권장)

## 🚀 시작하기

### 1. 개발 서버 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 2. 프로덕션 빌드

```bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📦 프로젝트 구조

```
jaengseung-made/
├── app/
│   ├── page.tsx          # 메인 랜딩 페이지
│   ├── layout.tsx        # 루트 레이아웃
│   └── globals.css       # 글로벌 스타일
├── public/               # 정적 파일
└── package.json
```

## 🌐 배포 가이드

### 옵션 1: Vercel 배포 (추천 - 무료)

1. [Vercel](https://vercel.com) 계정 생성
2. GitHub에 프로젝트 푸시
3. Vercel에서 "Import Project" 클릭
4. 저장소 선택하고 배포
5. 자동으로 HTTPS, CDN 제공

**장점**: 무료, 자동 배포, 글로벌 CDN, HTTPS

### 옵션 2: Netlify 배포 (무료)

1. [Netlify](https://netlify.com) 계정 생성
2. "Add new site" → "Import from Git"
3. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. 배포

### 옵션 3: Synology NAS 배포

1. Docker 설치 (Synology Docker 패키지)
2. Dockerfile 생성:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```
3. 이미지 빌드 및 실행
4. 포트 포워딩 설정 (80 → 3000)

**주의**: NAS는 속도/안정성이 클라우드보다 낮을 수 있음

## 🔧 커스터마이징

### 연락처 정보 수정

`app/page.tsx` 파일에서 다음 정보를 수정하세요:

```tsx
// 이메일
contact@jaengseung.com → 실제 이메일

// 전화번호
010-0000-0000 → 실제 전화번호
```

### 서비스 가격 수정

`app/page.tsx`의 Services Section에서 가격 수정:

```tsx
<div className="text-3xl font-bold mb-2">50만원~</div>
```

### 포트폴리오 추가

`app/page.tsx`의 Portfolio Section에 프로젝트 카드 추가

## 📋 다음 단계

1. **도메인 구매**
   - Cloudflare (연 $10~15)
   - GoDaddy
   - Gabia (한국)

2. **도메인 연결**
   - Vercel: Dashboard에서 "Add Domain"
   - DNS 설정: A 레코드 또는 CNAME

3. **플랫폼 등록**
   - [크몽](https://kmong.com) - 서비스 등록
   - [숨고](https://soomgo.com) - 프로필 생성
   - 포트폴리오 URL 첨부

4. **SEO 최적화**
   - Google Search Console 등록
   - 사이트맵 제출
   - 메타 태그 최적화 (이미 적용됨)

5. **실제 프로젝트 추가**
   - 샘플 RPA 프로젝트 개발
   - GitHub에 Public Repository 생성
   - 포트폴리오 섹션에 링크 추가

## 💡 추가 기능 아이디어

- [ ] 문의 폼 백엔드 연동 (Formspree, Netlify Forms)
- [ ] Google Analytics 추가
- [ ] 블로그 섹션 (기술 글 작성)
- [ ] 고객 후기 섹션
- [ ] 다크 모드
- [ ] 다국어 지원 (영어)
- [ ] 챗봇 위젯 (카카오톡 채널)

## 📞 문의

프로젝트 관련 문의: contact@jaengseung.com

---

**쟁승메이드** - 비즈니스 성장을 위한 전문 개발 솔루션
