import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "쟁승메이드 | RPA 자동화 & 비즈니스 솔루션 전문",
  description: "RPA 자동화, 웹 개발, 앱 개발까지. 대기업 출신 개발자가 제공하는 전문 비즈니스 솔루션",
  keywords: ["RPA", "자동화", "웹개발", "앱개발", "외주개발", "비즈니스솔루션"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
