import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import DashboardShell from "./components/DashboardShell";

export const metadata: Metadata = {
  title: {
    default: "쟁승메이드 | AI 프롬프트 · 업무 자동화 · 사주 분석",
    template: "%s | 쟁승메이드",
  },
  description:
    "AI 프롬프트 패키지, 업무 자동화 개발, AI 사주 분석까지. 7년차 현직 개발자가 직접 만들고 운영하는 AI 도구 스토어. 9,900원부터.",
  keywords: [
    "AI 프롬프트",
    "ChatGPT 프롬프트",
    "업무 자동화",
    "AI 사주",
    "AI 자동화 키트",
    "프롬프트 엔지니어링",
    "엑셀 자동화",
    "외주 개발",
    "홈페이지 제작",
  ],
  authors: [{ name: "박재오", url: "https://jaengseung-made.com" }],
  creator: "박재오",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://jaengseung-made.com",
    siteName: "쟁승메이드",
    title: "쟁승메이드 | AI 프롬프트 · 업무 자동화 · 사주 분석",
    description:
      "AI 프롬프트 패키지, 업무 자동화, AI 사주 분석. 7년차 현직 개발자가 만든 AI 도구 스토어.",
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
    title: "쟁승메이드 | AI 프롬프트 · 업무 자동화 · 사주 분석",
    description: "AI 프롬프트 9,900원~, 업무 자동화, 무료 AI 사주 분석.",
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
      description: '7년차 현직 대기업 백엔드 개발자. AI 프롬프트 패키지, 업무 자동화, AI 사주 분석 등 AI 도구를 직접 개발·운영합니다.',
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://jaengseung-made.com/#business',
      name: '쟁승메이드',
      url: 'https://jaengseung-made.com',
      description: 'AI 프롬프트 패키지, 업무 자동화, AI 사주 분석. 7년차 현직 개발자가 직접 만들고 운영하는 AI 도구 스토어.',
      email: 'bgg8988@gmail.com',
      telephone: '010-3907-1392',
      priceRange: '₩',
      areaServed: '대한민국',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: '쟁승메이드 AI 도구 · 서비스',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'AI 프롬프트 패키지', url: 'https://jaengseung-made.com/services/prompt', description: 'ChatGPT·Claude 업무 최적화 프롬프트. 자소서, 마케팅, 이메일, 보고서 등.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '업무 자동화 개발', url: 'https://jaengseung-made.com/services/automation' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'AI 자동화 키트', url: 'https://jaengseung-made.com/services/ai-kit', description: '업무일지·이메일·SNS 자동화 도구 6종 월 구독.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI 사주 분석', url: 'https://jaengseung-made.com/saju', description: '생년월일 기반 AI 사주팔자 분석. 무료 체험 가능.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '맞춤 외주 개발', url: 'https://jaengseung-made.com/freelance' } },
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
