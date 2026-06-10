import type { Metadata } from "next";
import Script from "next/script";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import DashboardShell from "./components/DashboardShell";
import { GlassFilter } from "./components/LiquidGlass";

export const metadata: Metadata = {
  title: {
    default: "외주 개발 · 완성 소프트웨어 | 쟁승메이드",
    template: "%s | 쟁승메이드",
  },
  description:
    "7년차 대기업 백엔드 개발자가 직접 설계하고 만듭니다. 맞춤 소프트웨어 외주 개발과 검증된 완성 소프트웨어를 제공하는 쟁승메이드.",
  keywords: [
    "외주 개발",
    "소프트웨어 개발",
    "웹사이트 제작",
    "업무 자동화",
    "백엔드 개발자",
    "프리랜서 개발자",
  ],
  authors: [{ name: "박재오", url: "https://jaengseung-made.com" }],
  creator: "박재오",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://jaengseung-made.com",
    siteName: "쟁승메이드",
    title: "외주 개발 · 완성 소프트웨어 | 쟁승메이드",
    description:
      "7년차 대기업 백엔드 개발자가 직접 설계·개발·운영합니다. 맞춤 외주 개발과 검증된 완성 소프트웨어를 제공하는 쟁승메이드.",
    images: [
      {
        url: "https://jaengseung-made.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "쟁승메이드 — 외주 개발 · 완성 소프트웨어",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "외주 개발 · 완성 소프트웨어 | 쟁승메이드",
    description:
      "7년차 대기업 백엔드 개발자가 직접 만듭니다. 맞춤 외주 개발과 검증된 완성 소프트웨어를 제공합니다.",
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
      jobTitle: '백엔드 개발자 · 외주 개발 전문가',
      worksFor: { '@type': 'Organization', name: '대기업 재직 중' },
      email: 'bgg8988@gmail.com',
      telephone: '010-3907-1392',
      knowsAbout: ['Python', 'Java', 'Spring Boot', 'Next.js', '외주 개발', '웹사이트 제작', '업무 자동화', 'API 설계'],
      description: '7년차 대기업 백엔드 개발자. 맞춤 소프트웨어 외주 개발과 검증된 완성 소프트웨어를 직접 설계·개발·운영합니다.',
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://jaengseung-made.com/#business',
      name: '쟁승메이드',
      url: 'https://jaengseung-made.com',
      description: '7년차 대기업 백엔드 개발자가 직접 설계·개발·운영하는 외주 개발 · 완성 소프트웨어 스토어.',
      email: 'bgg8988@gmail.com',
      telephone: '010-3907-1392',
      priceRange: '₩',
      areaServed: '대한민국',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: '쟁승메이드 개발 서비스',
        itemListElement: [
          {
            '@type': 'Offer',
            url: 'https://jaengseung-made.com/work/freelance',
            availability: 'https://schema.org/InStock',
            itemOffered: {
              '@type': 'Service',
              name: '외주 개발',
              url: 'https://jaengseung-made.com/work/freelance',
              description: '7년차 백엔드 개발자의 1:1 맞춤 소프트웨어 개발 외주. 자동화·API·웹/모바일 등 사이트 한정가로 제공.',
              serviceType: 'Custom Software Development',
              provider: { '@id': 'https://jaengseung-made.com/#business' },
              areaServed: '대한민국',
            },
          },
          {
            '@type': 'Offer',
            url: 'https://jaengseung-made.com/work/website',
            availability: 'https://schema.org/InStock',
            itemOffered: {
              '@type': 'Service',
              name: '웹사이트 제작',
              url: 'https://jaengseung-made.com/work/website',
              description: 'Next.js 기반 기업·브랜드 웹사이트 맞춤 제작. 반응형 + SEO + 배포 포함.',
              serviceType: 'Web Development',
              provider: { '@id': 'https://jaengseung-made.com/#business' },
              areaServed: '대한민국',
            },
          },
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
    <html lang="ko" data-scroll-behavior="smooth">
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
        <GlassFilter />
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
