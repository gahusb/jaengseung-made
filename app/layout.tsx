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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WG77RNHXRK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WG77RNHXRK');
          `}
        </Script>
      </head>
      <body className="antialiased">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
