import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import DashboardShell from "./components/DashboardShell";

export const metadata: Metadata = {
  title: "쟁승메이드 | 쟁토리의 프리미엄 개발 서비스",
  description:
    "로또 번호 추천, 주식 자동 매매, 프롬프트 엔지니어링, 업무 자동화. 쟁토리가 제공하는 신뢰할 수 있는 개발 서비스.",
  keywords: [
    "로또 번호 추천",
    "주식 자동 매매",
    "프롬프트 엔지니어링",
    "업무 자동화",
    "RPA",
    "외주 개발",
    "텔레그램 봇",
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
