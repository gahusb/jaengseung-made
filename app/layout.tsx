import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import DashboardShell from "./components/DashboardShell";

export const metadata: Metadata = {
  title: {
    default: "쟁승메이드 | 연락 두절 없는 현직 대기업 개발자",
    template: "%s | 쟁승메이드",
  },
  description:
    "계약서 먼저, 납기 지키고, 소스코드 100% 인도. 현직 대기업 백엔드 개발자가 운영하는 외주 개발·업무 자동화·RPA 서비스.",
  keywords: [
    "외주 개발",
    "프리랜서 개발자",
    "업무 자동화",
    "RPA",
    "웹사이트 제작",
    "로또 번호 추천",
    "주식 자동 매매",
    "텔레그램 봇",
    "엑셀 자동화",
    "프롬프트 엔지니어링",
  ],
  authors: [{ name: "박재오", url: "https://jaengseung-made.com" }],
  creator: "박재오",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://jaengseung-made.com",
    siteName: "쟁승메이드",
    title: "쟁승메이드 | 연락 두절 없는 현직 대기업 개발자",
    description:
      "계약서 먼저, 납기 지키고, 소스코드 100% 인도. 외주 개발·업무 자동화·RPA 전문.",
    images: [
      {
        url: "https://jaengseung-made.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "쟁승메이드 — 연락 두절 없는 개발자",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "쟁승메이드 | 연락 두절 없는 현직 대기업 개발자",
    description: "계약서 먼저, 납기 지키고, 소스코드 100% 인도.",
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
      knowsAbout: ['Python', 'Java', 'Spring Boot', 'Next.js', 'RPA', 'AI 자동화', '업무 자동화'],
      description: '현직 대기업 백엔드 개발자. 계약서 먼저, 납기 보장, 소스코드 100% 인도 원칙으로 외주 개발·AI 자동화·프롬프트 엔지니어링 서비스를 제공합니다.',
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://jaengseung-made.com/#business',
      name: '쟁승메이드',
      url: 'https://jaengseung-made.com',
      description: '현직 대기업 개발자가 운영하는 AI 자동화·외주 개발 서비스. 계약서 포함, 납기 패널티, 소스코드 인도.',
      email: 'bgg8988@gmail.com',
      telephone: '010-3907-1392',
      priceRange: '₩₩',
      areaServed: '대한민국',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: '쟁승메이드 서비스 목록',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '업무 자동화 개발', url: 'https://jaengseung-made.com/services/automation' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '외주 개발', url: 'https://jaengseung-made.com/freelance' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '프롬프트 엔지니어링', url: 'https://jaengseung-made.com/services/prompt' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '홈페이지 제작', url: 'https://jaengseung-made.com/services/website' } },
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
    <html lang="ko">
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
