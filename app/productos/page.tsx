import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import categoriesDataRaw from '@/data/categories.json';
import productsDataRaw from '@/data/products.json';

const SITE_URL = 'https://promogimmicks.com';
const STOCK_IMAGES_COUNT = 12;

interface Category {
  slug: string;
  name: string;
  description: string;
}

interface Product {
  categoria_slug: string;
}

const categoriesData = categoriesDataRaw as Category[];
const productsData = productsDataRaw as Product[];

const productCountBySlug = productsData.reduce<Record<string, number>>((acc, p) => {
  acc[p.categoria_slug] = (acc[p.categoria_slug] ?? 0) + 1;
  return acc;
}, {});

export const metadata = {
  title: 'Productos Promocionales por Categoría | PromoGimmicks Ecuador',
  description: `Explora ${categoriesData.length} categorías de productos promocionales: tecnología, drinkware, escritura, textil y más. Personalización con tu logo en Ecuador.`,
  alternates: {
    canonical: `${SITE_URL}/productos/`,
  },
  openGraph: {
    title: 'Productos Promocionales por Categoría | PromoGimmicks Ecuador',
    description: 'Explora todo nuestro catálogo de productos promocionales organizados por categoría.',
    type: 'website',
    url: `${SITE_URL}/productos/`,
    siteName: 'PromoGimmicks',
    locale: 'es_EC',
  },
};

export default function ProductosPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Productos Promocionales por Categoría',
    url: `${SITE_URL}/productos/`,
    hasPart: categoriesData.map((c) => ({
      '@type': 'CollectionPage',
      name: c.name,
      url: `${SITE_URL}/tienda/categoria/${c.slug}/`,
    })),
  };

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Navbar />

      <section className="relative pt-28 md:pt-36 pb-14 md:pb-16 bg-brand-gradient overflow-hidden">
        <div className="float-blob absolute -bottom-24 -left-10 w-80 h-80 bg-danger/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="eyebrow inline-flex items-center gap-2 bg-white/10 text-sky-300 px-4 py-1.5 rounded-full border border-white/15 mb-5">
            {categoriesData.length} categorías · {productsData.length} productos
          </span>
          <h1 className="h1-display text-white mb-4">Productos</h1>
          <p className="body-lead text-white/70 max-w-2xl mx-auto">
            Encuentra el artículo promocional perfecto para tu marca, organizado por categoría.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {categoriesData.map((cat, index) => {
              const image = `/img/imagenes-de-stock/${(index % STOCK_IMAGES_COUNT) + 1}.jpg`;
              const count = productCountBySlug[cat.slug] ?? 0;
              return (
                <Link
                  key={cat.slug}
                  href={`/tienda/categoria/${cat.slug}/`}
                  className="tilt-card group relative block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lift border border-slate-100 transition-shadow duration-300"
                >
                  <div className="relative h-28 sm:h-32 overflow-hidden">
                    <img
                      src={image}
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-sm font-bold text-white drop-shadow line-clamp-2">{cat.name}</p>
                    </div>
                  </div>
                  <div className="p-2.5 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">{count} productos</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="h2-section text-white mb-4">¿No encuentras lo que buscas?</h2>
          <p className="text-white/70 mb-8">
            Escríbenos por WhatsApp y te ayudamos a encontrar el producto ideal para tu campaña.
          </p>
          <a
            href="https://wa.me/593998594123?text=Hola%2C%20busco%20un%20producto%20promocional%20para%20mi%20empresa"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-magnetic inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold px-8 py-4 rounded-full transition-colors"
          >
            Cotizar por WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
