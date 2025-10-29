import { baseUrl } from '@/app/sitemap';

export default function robots() {
  const config = {
    rules: [
      {
        userAgent: '*',
        disallow: ['/og'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };

  return config;
}
