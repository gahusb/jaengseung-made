import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isServiceVisible } from '@/lib/service-visibility';

export const metadata: Metadata = {
  title: 'CONTOUR — 나를 더 선명하게 이해하는 3분',
  description: '7 질문, 3분. 자기 이해·심리 영역 짧은 설문에 참여해주세요.',
  openGraph: {
    title: 'CONTOUR — 나를 더 선명하게 이해하는 3분',
    description: '7 질문, 3분. 짧은 설문에 답해주세요.',
    url: 'https://jaengseung-made.com/gyeol',
    images: [
      {
        url: 'https://jaengseung-made.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CONTOUR',
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function GyeolLayout({ children }: { children: React.ReactNode }) {
  if (!(await isServiceVisible('gyeol'))) notFound();
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'radial-gradient(ellipse at top, rgba(204,151,255,0.15) 0%, transparent 50%), linear-gradient(180deg, #060e20 0%, #000000 100%)',
      }}
    >
      {children}
    </div>
  );
}
