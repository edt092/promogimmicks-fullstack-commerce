import { MetadataRoute } from 'next'
import productsData from '@/data/products.json'
import blogPosts from '@/data/blog-posts.json'
import { ecuador } from '@/data/geo-data'
import { absoluteUrl } from '@/lib/site'
import { categoryPageCount, categoryPagePath } from '@/lib/catalog'

// Política (reports/seo-implementation-log.md):
// - Solo URLs canónicas, indexables y existentes en el export (host de site.config.json).
// - lastModified solo cuando existe una fecha real de cambio. El catálogo no registra
//   fechas por producto/categoría: omitirla es mejor que una fecha de build o inventada.
//   El blog usa fecha_actualizacion (si se registra) o fecha_publicacion.
// - changeFrequency/priority se omiten: Google no los usa.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['/', '/tienda/', '/productos/', '/novedades/', '/promociones/', '/blog/', '/nosotros/', '/contacto/']

  const staticPages: MetadataRoute.Sitemap = staticPaths.map((path) => ({ url: absoluteUrl(path) }))

  const ecuadorPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/productos-promocionales-ecuador/') },
    ...ecuador.ciudades.map((ciudad) => ({
      url: absoluteUrl(`/productos-promocionales-ecuador/${ciudad.slug}/`),
    })),
  ]

  const uniqueCategories = Array.from(new Set(productsData.map((p) => p.categoria_slug)))
  // Página 1 y páginas 2..N de cada categoría (cada una es canónica de sí misma).
  const categoryPages: MetadataRoute.Sitemap = uniqueCategories.flatMap((categorySlug) =>
    Array.from({ length: categoryPageCount(categorySlug) }, (_, i) => ({
      url: absoluteUrl(categoryPagePath(categorySlug, i + 1)),
    }))
  )

  const productPages: MetadataRoute.Sitemap = productsData.map((product) => ({
    url: absoluteUrl(`/tienda/${product.slug}/`),
  }))

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => {
    const updated = (post as { fecha_actualizacion?: string }).fecha_actualizacion || post.fecha_publicacion
    return {
      url: absoluteUrl(`/blog/${post.slug}/`),
      lastModified: new Date(updated),
    }
  })

  return [...staticPages, ...ecuadorPages, ...categoryPages, ...productPages, ...blogPages]
}
