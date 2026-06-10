import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // self-host(NAS) 배포용 standalone 출력. Vercel은 이 설정을 무시하므로 양쪽 호환.
  output: 'standalone',
  // workspace/ 하위 프로젝트라 Next가 상위를 추적 루트로 오인 → standalone 중첩 방지 위해 고정
  outputFileTracingRoot: process.cwd(),
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Music 사업부 마이그
      { source: '/services/music', destination: '/music/packs', permanent: true },
      { source: '/services/music/samples', destination: '/music/samples', permanent: true },
      { source: '/studio', destination: '/music/studio', permanent: true },
      // 커스텀 외주 마이그 (2026-06-11 리뉴얼: work 라우트 → /outsourcing 통합)
      { source: '/work/freelance', destination: '/outsourcing', permanent: true },
      { source: '/work', destination: '/outsourcing', permanent: true },
      { source: '/work/website', destination: '/outsourcing', permanent: true },
      // 구 URL은 체인 없이 한 번에 /outsourcing 으로
      { source: '/freelance', destination: '/outsourcing', permanent: true },
      { source: '/services/website', destination: '/outsourcing', permanent: true },
      // 샘플 데모는 포트폴리오용으로 잔존 → samples 라우트 유지
      { source: '/services/website/samples/:slug', destination: '/work/website/samples/:slug', permanent: true },
      // 블로그 자동화 폐기(2026-05-29 재정의): 기존 URL은 외주 허브로 안내
      { source: '/services/blog', destination: '/outsourcing', permanent: true },
      { source: '/work/blog', destination: '/outsourcing', permanent: true },
      // 사주 마이그 (단순 URL, 카탈로그 spec은 보류)
      { source: '/saju', destination: '/work/saju', permanent: true },
      { source: '/saju/input', destination: '/work/saju/input', permanent: true },
      { source: '/saju/result', destination: '/work/saju/result', permanent: true },
    ];
  },
};

export default nextConfig;
