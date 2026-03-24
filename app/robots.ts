import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/mypage/', '/payment/'],
      },
    ],
    sitemap: 'https://jaengseung-made.com/sitemap.xml',
    host: 'https://jaengseung-made.com',
  };
}
