import { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site'

// /_next/ ya no se bloquea: Google necesita JS/CSS para renderizar.
// /tienda/? se eliminó: el sitio no genera URLs con query indexables y bloquearlas
// impide que Google vea su canonical (y bloquearía una futura paginación).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
