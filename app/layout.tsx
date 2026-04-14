import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, Inter, Manrope } from "next/font/google";
import "./globals.css";
import DashboardShell from "./components/DashboardShell";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-kx-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-kx-body", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-kx-label", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "AI 음악·뮤비 팩 ₩39,000~ | 쟁승메이드",
    template: "%s | 쟁승메이드",
  },
  description:
    "Suno 프롬프트 + 뮤직비디오 워크플로우 + 유튜브 SEO 템플릿 팩. AI로 음악과 뮤비를 1시간 만에 완성하는 4단계 크리에이터 툴킷. ₩39,000부터.",
  keywords: [
    "AI 음악",
    "AI 작곡",
    "Suno 프롬프트",
    "AI 뮤직비디오",
    "유튜브 쇼츠 음악",
    "AI 뮤비",
    "음악 프롬프트",
    "블로그 자동화",
    "AI 사주",
  ],
  authors: [{ name: "박재오", url: "https://jaengseung-made.com" }],
  creator: "박재오",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://jaengseung-made.com",
    siteName: "쟁승메이드",
    title: "AI 음악·뮤비 팩 ₩39,000~ | 쟁승메이드",
    description:
      "Suno 프롬프트 + 뮤비 워크플로우 + 유튜브 SEO 템플릿 팩. AI로 음악·뮤비를 1시간에 완성하는 4단계 크리에이터 툴킷.",
    images: [
      {
        url: "https://jaengseung-made.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "쟁승메이드 — AI 프롬프트 · 자동화 스토어",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 음악·뮤비 팩 ₩39,000~ | 쟁승메이드",
    description: "AI로 음악과 뮤비를 1시간 만에. Suno 프롬프트 + 뮤비 워크플로우 + 유튜브 SEO 템플릿.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://jaengseung-made.com/#person',
      name: '박재오',
      url: 'https://jaengseung-made.com',
      jobTitle: '백엔드 개발자 · AI 자동화 전문가',
      worksFor: { '@type': 'Organization', name: '대기업 재직 중' },
      email: 'bgg8988@gmail.com',
      telephone: '010-3907-1392',
      knowsAbout: ['Python', 'Java', 'Spring Boot', 'Next.js', 'AI 프롬프트', 'AI 자동화', '업무 자동화', 'ChatGPT', 'Claude'],
      description: '현직 엔지니어. AI 음악 구조 설계 팩, 블로그 자동화 팩, AI 사주 분석 등 AI 크리에이티브 도구를 직접 개발·운영합니다.',
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://jaengseung-made.com/#business',
      name: '쟁승메이드',
      url: 'https://jaengseung-made.com',
      description: 'AI 음악 작곡·뮤비 구조 설계 팩, 블로그 자동화 팩, AI 사주 분석. 현직 엔지니어가 직접 설계·운영하는 AI 크리에이티브 스토어.',
      email: 'bgg8988@gmail.com',
      telephone: '010-3907-1392',
      priceRange: '₩',
      areaServed: '대한민국',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: '쟁승메이드 AI 도구 · 서비스',
        itemListElement: [
          { '@type': 'Offer', price: '39000', priceCurrency: 'KRW', availability: 'https://schema.org/InStock', url: 'https://jaengseung-made.com/services/music', itemOffered: { '@type': 'Product', name: 'AI 음악 마스터 구조 팩 (입문)', url: 'https://jaengseung-made.com/services/music', description: 'Suno 프롬프트 + MV 워크플로우 + 저작권 가이드 + 템플릿 PDF + 샘플 프로젝트. 4단계 AI 음악 제작 공정.' } },
          { '@type': 'Offer', price: '99000', priceCurrency: 'KRW', availability: 'https://schema.org/InStock', url: 'https://jaengseung-made.com/services/music', itemOffered: { '@type': 'Product', name: 'AI 음악 마스터 구조 팩 (프로)', url: 'https://jaengseung-made.com/services/music', description: '입문 전체 + 샘플 프로젝트 1개(.prj · 영상 포함).' } },
          { '@type': 'Offer', price: '149000', priceCurrency: 'KRW', availability: 'https://schema.org/InStock', url: 'https://jaengseung-made.com/services/music', itemOffered: { '@type': 'Product', name: 'AI 음악 마스터 구조 팩 (마스터)', url: 'https://jaengseung-made.com/services/music', description: '프로 전체 + 샘플 다수 + 우선 업데이트·베타 선공개.' } },
          { '@type': 'Offer', price: '29000', priceCurrency: 'KRW', availability: 'https://schema.org/InStock', url: 'https://jaengseung-made.com/services/blog', itemOffered: { '@type': 'Product', name: '블로그 자동화 솔루션 팩', url: 'https://jaengseung-made.com/services/blog', description: '쿠팡파트너스·애드포스트 수익화 프롬프트 조합법 + 구조 템플릿 PDF + 샘플.' } },
          { '@type': 'Offer', price: '0', priceCurrency: 'KRW', url: 'https://jaengseung-made.com/saju', itemOffered: { '@type': 'Service', name: 'AI 사주 분석', url: 'https://jaengseung-made.com/saju', description: '생년월일 기반 AI 사주팔자 분석. 무료 체험 가능.' } },
        ],
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" data-scroll-behavior="smooth" className={`${spaceGrotesk.variable} ${inter.variable} ${manrope.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WG77RNHXRK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WG77RNHXRK', {
              send_page_view: true,
              custom_map: { dimension1: 'service_type' }
            });
          `}
        </Script>
      </head>
      <body className="antialiased">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
