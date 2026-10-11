// Vista de categoría (componente de servidor) compartida por la página 1
// (/tienda/categoria/{slug}/) y las páginas 2+ (/tienda/categoria/{slug}/pagina/{n}/).
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  categoryName, categoryProducts, categoryPageCount, categoryPagePath, CATEGORY_PAGE_SIZE,
} from '@/lib/catalog';

export { categoryProducts, categoryPageCount };
import { categoryDescriptions } from '@/data/category-content';
import { absoluteUrl, jsonLd, whatsappUrl, WEBSITE_ID } from '@/lib/site';

export function categoryInfo(slug: string) {
  const name = categoryName(slug);
  return categoryDescriptions[slug] ?? {
    title: name,
    description: `Productos promocionales de ${name} personalizables con tu logo para empresas en Ecuador.`,
    content: `Explora nuestra selección de productos promocionales de ${name} personalizables con tu logo.`,
    keywords: `${name}, productos promocionales`,
  };
}

export function categoryMetadata(slug: string, page: number) {
  const info = categoryInfo(slug);
  const pages = categoryPageCount(slug);
  const suffix = page > 1 ? ` – Página ${page} de ${pages}` : '';
  const title = `${info.title} en Ecuador${suffix} | PromoGimmicks`;
  const description = page > 1 ? `${info.description} Página ${page} de ${pages}.` : info.description;
  const url = absoluteUrl(categoryPagePath(slug, page));
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url, siteName: 'PromoGimmicks', locale: 'es_EC' },
    twitter: { card: 'summary', title, description },
    // Cada página de la serie es canónica de sí misma (lista productos distintos).
    alternates: { canonical: url },
  };
}

function Pagination({ slug, page, pages }: { slug: string; page: number; pages: number }) {
  if (pages <= 1) return null;
  const numbers = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <nav aria-label="Paginación de la categoría" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={categoryPagePath(slug, page - 1)} className="min-w-[44px] min-h-[44px] px-4 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white text-blue-900 hover:border-blue-400">
          ← Anterior
        </Link>
      )}
      {numbers.map((n) =>
        n === page ? (
          <span key={n} aria-current="page" className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg bg-blue-900 text-white font-semibold">
            {n}
          </span>
        ) : (
          <Link key={n} href={categoryPagePath(slug, n)} className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white text-blue-900 hover:border-blue-400">
            {n}
          </Link>
        )
      )}
      {page < pages && (
        <Link href={categoryPagePath(slug, page + 1)} className="min-w-[44px] min-h-[44px] px-4 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white text-blue-900 hover:border-blue-400">
          Siguiente →
        </Link>
      )}
    </nav>
  );
}

export default function CategoryPageView({ slug, page }: { slug: string; page: number }) {
  const all = categoryProducts(slug);
  const pages = categoryPageCount(slug);
  const name = categoryName(slug);
  const info = categoryInfo(slug);
  const start = (page - 1) * CATEGORY_PAGE_SIZE;
  const pageProducts = all.slice(start, start + CATEGORY_PAGE_SIZE);
  const url = absoluteUrl(categoryPagePath(slug, page));

  // ItemList = productos realmente listados en ESTA página (ListItem url/nombre).
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": page > 1 ? `${info.title} – Página ${page}` : info.title,
    "description": info.description,
    "url": url,
    "isPartOf": { "@id": WEBSITE_ID },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": pageProducts.length,
      "itemListElement": pageProducts.map((product, index) => ({
        "@type": "ListItem",
        "position": start + index + 1,
        "url": absoluteUrl(`/tienda/${product.slug}/`),
        "name": product.nombre,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": absoluteUrl('/') },
      { "@type": "ListItem", "position": 2, "name": "Tienda", "item": absoluteUrl('/tienda/') },
      { "@type": "ListItem", "position": 3, "name": name, "item": absoluteUrl(categoryPagePath(slug, 1)) },
      ...(page > 1 ? [{ "@type": "ListItem", "position": 4, "name": `Página ${page}`, "item": url }] : []),
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(categorySchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />

      <Navbar />

      <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <nav className="inline-flex flex-wrap items-center justify-center gap-2 text-blue-200 text-sm" aria-label="Ruta de navegación">
              <Link href="/" className="hover:text-white transition py-2">Inicio</Link>
              <span>/</span>
              <Link href="/tienda/" className="hover:text-white transition py-2">Tienda</Link>
              <span>/</span>
              {page > 1 ? (
                <>
                  <Link href={categoryPagePath(slug, 1)} className="hover:text-white transition py-2">{name}</Link>
                  <span>/</span>
                  <span className="text-white">Página {page}</span>
                </>
              ) : (
                <span className="text-white">{name}</span>
              )}
            </nav>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              <span className="text-sm md:text-base font-medium">
                {all.length} modelos en el catálogo{pages > 1 ? ` · página ${page} de ${pages}` : ''}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {info.title}{page > 1 ? <span className="block text-2xl md:text-3xl mt-2 text-blue-100">Página {page}</span> : null}
            </h1>

            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {info.description}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 8.33C120 16.7 240 33.3 360 41.7C480 50 600 50 720 45C840 40 960 30 1080 28.3C1200 26.7 1320 33.3 1380 36.7L1440 40V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="rgb(249, 250, 251)"/>
          </svg>
        </div>
      </section>

      {page === 1 && (
        <section className="py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gray-600 text-lg leading-relaxed">{info.content}</p>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {pageProducts.map((product) => (
              <Link
                key={product.id}
                href={`/tienda/${product.slug}/`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-square relative bg-gray-100">
                  <Image
                    src={product.imagen_url}
                    alt={`${product.nombre} personalizado con logo`}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.nombre}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{product.sku}</p>
                </div>
              </Link>
            ))}
          </div>

          <Pagination slug={slug} page={page} pages={pages} />
        </div>
      </section>

      <section className="py-10 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-blue-900 mb-5">
            Guías y recursos para tu estrategia de merchandising
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: '/blog/guia-donde-comprar-productos-promocionales-2025/', icon: '📋', label: 'Guía: dónde comprar productos promocionales' },
              { href: '/blog/productos-promocionales-baratos-quito-2025/', icon: '🏷️', label: 'Productos promocionales económicos en Quito' },
              { href: '/productos-promocionales-ecuador/', icon: '🗺️', label: 'Cobertura de productos promocionales en Ecuador' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex gap-3 bg-white rounded-xl p-4 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all group"
              >
                <span className="text-2xl flex-shrink-0">{l.icon}</span>
                <div>
                  <p className="font-semibold text-blue-900 text-sm group-hover:text-amber-600 transition-colors line-clamp-2">{l.label}</p>
                  <p className="text-xs text-gray-500 mt-1">Leer más →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            ¿Necesitas cotización para {name}?
          </h2>
          <p className="text-blue-100 mb-8">
            Contáctanos por WhatsApp para recibir precios y tiempos de entrega personalizados.
          </p>
          <a
            href={whatsappUrl(`Hola, me interesan los productos de la categoría ${name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Cotizar por WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
