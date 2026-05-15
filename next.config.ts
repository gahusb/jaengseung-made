import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      // Custom Build 사업부 마이그
      { source: '/freelance', destination: '/work/freelance', permanent: true },
      { source: '/services/website', destination: '/work/website', permanent: true },
      { source: '/services/website/samples/:slug', destination: '/work/website/samples/:slug', permanent: true },
      { source: '/services/blog', destination: '/work/blog', permanent: true },
      // 사주 마이그 (단순 URL, 카탈로그 spec은 보류)
      { source: '/saju', destination: '/work/saju', permanent: true },
      { source: '/saju/input', destination: '/work/saju/input', permanent: true },
      { source: '/saju/result', destination: '/work/saju/result', permanent: true },
    ];
  },
};

export default nextConfig;
