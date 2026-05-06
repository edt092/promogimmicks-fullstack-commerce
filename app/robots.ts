import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/tienda/?'],
      },
    ],
    sitemap: 'https://promogimmicks.com/sitemap.xml',
  }
}
