import siteConfig from '../site.config.json';

/** Host canónico único (ver site.config.json). Sin barra final. */
export const SITE_URL: string = siteConfig.siteUrl;
export const SITE_NAME: string = siteConfig.siteName;
export const WHATSAPP_NUMBER: string = siteConfig.whatsappNumber;
export const PHONE_DISPLAY: string = siteConfig.phoneDisplay;
export const CONTACT_EMAIL: string = siteConfig.email;
export const SITE_LOCALE: string = siteConfig.locale;
export const SITE_LANGUAGE: string = siteConfig.language;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * URL absoluta canónica para una ruta interna. Las rutas de página terminan en "/"
 * (trailingSlash: true); los archivos con extensión (imágenes, .xml, .json) no.
 */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//.test(path)) return path;
  let p = path.startsWith('/') ? path : `/${path}`;
  const lastSegment = p.split('/').pop() ?? '';
  if (!p.endsWith('/') && !lastSegment.includes('.')) p = `${p}/`;
  return `${SITE_URL}${p}`;
}

export const DEFAULT_QUOTE_MESSAGE = 'Hola, me interesa cotizar productos promocionales';

/** Enlace de WhatsApp con el mensaje codificado una sola vez. */
export function whatsappUrl(message: string = DEFAULT_QUOTE_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Serializa JSON-LD de forma segura para incrustarlo en <script>. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
