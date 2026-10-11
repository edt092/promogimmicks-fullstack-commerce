import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ecuador, getCiudadBySlug } from '@/data/geo-data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { MapPin, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { SITE_URL, absoluteUrl, jsonLd, whatsappUrl, ORGANIZATION_ID } from '@/lib/site';
import { firstProductPerCategory, categoryName, FEATURED_CATEGORY_SLUGS } from '@/lib/catalog';

interface Props {
  params: { ciudad: string };
}

export async function generateStaticParams() {
  return ecuador.ciudades.map((ciudad) => ({
    ciudad: ciudad.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ciudad = getCiudadBySlug('productos-promocionales-ecuador', params.ciudad);

  if (!ciudad) {
    return {
      title: 'Ciudad no encontrada',
    };
  }

  return {
    title: ciudad.seoTitle,
    description: ciudad.seoDescription,
    keywords: [
      `productos promocionales ${ciudad.nombre.toLowerCase()}`,
      `merchandising ${ciudad.nombre.toLowerCase()}`,
      `artículos publicitarios ${ciudad.nombre.toLowerCase()}`,
      `regalos empresariales ${ciudad.nombre.toLowerCase()}`,
      'productos promocionales ecuador',
    ],
    openGraph: {
      title: ciudad.seoTitle,
      description: ciudad.seoDescription,
      type: 'website',
      locale: 'es_EC',
      url: `${SITE_URL}/productos-promocionales-ecuador/${ciudad.slug}/`,
      siteName: 'PromoGimmicks',
    },
    alternates: {
      canonical: `${SITE_URL}/productos-promocionales-ecuador/${ciudad.slug}/`,
    },
  };
}

export default function CiudadEcuadorPage({ params }: Props) {
  const ciudad = getCiudadBySlug('productos-promocionales-ecuador', params.ciudad);

  if (!ciudad) {
    notFound();
  }

  const destacados = firstProductPerCategory(FEATURED_CATEGORY_SLUGS);

  const otrasCiudades = ecuador.ciudades.filter(c => c.slug !== params.ciudad);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-amber-600">Inicio</Link>
              <span className="text-gray-400">/</span>
              <Link href="/productos-promocionales-ecuador/" className="text-gray-500 hover:text-amber-600">Ecuador</Link>
              <span className="text-gray-400">/</span>
              <span className="text-amber-600 font-medium">{ciudad.nombre}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-white py-16 lg:py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/productos-promocionales-ecuador/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Volver a Ecuador</span>
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <MapPin size={24} />
              </div>
              <span className="text-lg text-white/90">Ecuador</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {ciudad.h1}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-8">
              {ciudad.intro}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href={whatsappUrl(`Hola, me interesa cotizar productos promocionales en ${ciudad.nombre}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 transition-colors"
              >
                Cotizar Ahora
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </section>

        {/* Características locales */}
        <section className="py-12 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ciudad.caracteristicas.map((caracteristica, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-300">{caracteristica}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Productos destacados */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Productos promocionales para empresas en {ciudad.nombre}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Una muestra por categoría de nuestro catálogo. Cotiza desde {ciudad.nombre} y coordinamos contigo la entrega.
              </p>
            </div>

            {/* Selección curada (SSR) en lugar del catálogo completo de 2.000+ productos. */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {destacados.map((p) => (
                <Link
                  key={p.id}
                  href={`/tienda/${p.slug}/`}
                  className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="aspect-square relative bg-gray-50">
                    <Image
                      src={p.imagen_url}
                      alt={`${p.nombre} personalizado con logo`}
                      fill
                      className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-amber-600 font-semibold">{p.categoria}</p>
                    <p className="text-sm font-medium text-slate-900 line-clamp-2">{p.nombre}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {FEATURED_CATEGORY_SLUGS.map((slug) => (
                <Link
                  key={slug}
                  href={`/tienda/categoria/${slug}/`}
                  className="px-4 py-3 rounded-full border border-gray-200 bg-white text-slate-800 text-sm hover:border-amber-500 hover:text-amber-700 transition-colors"
                >
                  {categoryName(slug)}
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/tienda/"
                className="inline-flex items-center gap-2 bg-amber-500 text-white px-8 py-4 rounded-full font-bold hover:bg-amber-600 transition-colors"
              >
                Ver Catálogo Completo
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* Otras ciudades */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Otras Ciudades en Ecuador
              </h2>
              <p className="text-xl text-gray-600">
                También brindamos servicios de productos promocionales en otras ciudades ecuatorianas.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {otrasCiudades.map((otraCiudad) => (
                <Link
                  key={otraCiudad.slug}
                  href={`/productos-promocionales-ecuador/${otraCiudad.slug}/`}
                  className="bg-white border border-gray-200 hover:border-amber-500 rounded-xl p-4 text-center transition-all hover:shadow-lg"
                >
                  <MapPin className="mx-auto text-amber-500 mb-2" size={24} />
                  <span className="font-medium text-slate-900">{otraCiudad.nombre}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA WhatsApp */}
        <section className="py-16 lg:py-24 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Necesitas productos promocionales en {ciudad.nombre}?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Contáctanos ahora y recibe atención personalizada para tu empresa en {ciudad.nombre}.
            </p>
            <a
              href={whatsappUrl(`Hola, me interesa cotizar productos promocionales en ${ciudad.nombre}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 transition-colors"
            >
              Contactar por WhatsApp
              <ArrowRight size={20} />
            </a>
          </div>
        </section>

        {/* Schema.org JSON-LD: página de servicio con área atendida; el proveedor es la
            misma Organization del sitio (no se declara una sucursal local inexistente). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "Service",
              "@id": `${absoluteUrl(`/productos-promocionales-ecuador/${ciudad.slug}/`)}#service`,
              "name": `Productos promocionales personalizados en ${ciudad.nombre}`,
              "serviceType": "Artículos promocionales personalizados con logo",
              "description": ciudad.seoDescription,
              "url": absoluteUrl(`/productos-promocionales-ecuador/${ciudad.slug}/`),
              "provider": { "@id": ORGANIZATION_ID },
              "areaServed": {
                "@type": "City",
                "name": ciudad.nombre,
                "containedInPlace": { "@type": "Country", "name": "Ecuador" }
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Inicio", "item": absoluteUrl('/') },
                { "@type": "ListItem", "position": 2, "name": "Ecuador", "item": absoluteUrl('/productos-promocionales-ecuador/') },
                { "@type": "ListItem", "position": 3, "name": ciudad.nombre, "item": absoluteUrl(`/productos-promocionales-ecuador/${ciudad.slug}/`) }
              ]
            })
          }}
        />
      </main>
      <Footer />
    </>
  );
}
