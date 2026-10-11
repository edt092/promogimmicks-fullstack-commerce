import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { products, activeCategorySlugs, categoryName, FEATURED_CATEGORY_SLUGS } from '@/lib/catalog';
import { absoluteUrl, jsonLd, whatsappUrl, ORGANIZATION_ID, PHONE_DISPLAY, CONTACT_EMAIL } from '@/lib/site';
import { ecuador } from '@/data/geo-data';

// Solo hechos verificables en el propio sitio. Razón social, RUC, dirección completa,
// año de inicio, equipo, clientes y casos quedan pendientes de confirmación del negocio
// (reports/seo-business-inputs.md); no se inventan.
export const metadata: Metadata = {
  title: 'Sobre PromoGimmicks | Artículos promocionales para empresas en Ecuador',
  description: 'PromoGimmicks ofrece un catálogo de artículos promocionales personalizables con el logo de tu empresa y cotización por WhatsApp para pedidos en Ecuador.',
  alternates: { canonical: absoluteUrl('/nosotros/') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/nosotros/'),
    siteName: 'PromoGimmicks',
    locale: 'es_EC',
    title: 'Sobre PromoGimmicks',
    description: 'Catálogo de artículos promocionales personalizables para empresas en Ecuador.',
  },
};

const pasos = [
  { titulo: 'Explora el catálogo', texto: 'Revisa las categorías y elige los artículos que mejor representen el objetivo de tu campaña.' },
  { titulo: 'Comparte tu requerimiento', texto: 'Indica cantidad, ciudad, fecha estimada, producto de interés y detalles de la personalización.' },
  { titulo: 'Recibe tu cotización', texto: 'Te enviamos una propuesta basada en las características confirmadas de tu pedido: modelo, técnica de marcaje, cantidad y plazo.' },
];

export default function NosotrosPage() {
  const totalCategorias = activeCategorySlugs().length;
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${absoluteUrl('/nosotros/')}#webpage`,
    "url": absoluteUrl('/nosotros/'),
    "name": 'Sobre PromoGimmicks',
    "inLanguage": 'es-EC',
    "about": { "@id": ORGANIZATION_ID },
  };

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Navbar />

      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-blue-200 text-sm mb-6" aria-label="Ruta de navegación">
            <Link href="/" className="hover:text-white py-2">Inicio</Link> <span>/</span> <span className="text-white">Nosotros</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sobre PromoGimmicks</h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            PromoGimmicks ayuda a empresas en Ecuador a elegir y personalizar artículos promocionales con su logo:
            regalos corporativos, material para eventos y ferias, kits para colaboradores y campañas de marca.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Qué ofrecemos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nuestro catálogo reúne <strong>{products.length.toLocaleString('es-EC')} modelos</strong> en{' '}
              <strong>{totalCategorias} categorías</strong>, entre ellas{' '}
              {FEATURED_CATEGORY_SLUGS.slice(0, 6).map((slug, i, arr) => (
                <span key={slug}>
                  <Link href={`/tienda/categoria/${slug}/`} className="text-blue-900 underline hover:text-amber-600">{categoryName(slug).toLowerCase()}</Link>
                  {i < arr.length - 2 ? ', ' : i === arr.length - 2 ? ' y ' : ''}
                </span>
              ))}.
              Cada pedido se cotiza según el modelo, la cantidad y la técnica de personalización compatible con su material.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Los precios, cantidades mínimas, disponibilidad y plazos de producción se confirman en cada cotización;
              no publicamos condiciones genéricas que no correspondan al modelo que necesitas.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Cómo trabajamos</h2>
            <ol className="space-y-4">
              {pasos.map((p, i) => (
                <li key={p.titulo} className="flex gap-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">{i + 1}</span>
                  <div>
                    <h3 className="font-semibold text-blue-900">{p.titulo}</h3>
                    <p className="text-gray-700">{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Dónde atendemos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Recibimos solicitudes de empresas de todo Ecuador. La cobertura y las condiciones de entrega dependen de la
              ubicación y del pedido: indica tu ciudad al cotizar. Información por ciudad:
            </p>
            <ul className="flex flex-wrap gap-3">
              <li><Link href="/productos-promocionales-ecuador/" className="inline-block px-4 py-3 rounded-full border border-gray-200 hover:border-amber-500">Ecuador</Link></li>
              {ecuador.ciudades.map((c) => (
                <li key={c.slug}>
                  <Link href={`/productos-promocionales-ecuador/${c.slug}/`} className="inline-block px-4 py-3 rounded-full border border-gray-200 hover:border-amber-500">{c.nombre}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-3">Contacto</h2>
            <p className="text-gray-700 mb-4">
              WhatsApp y teléfono: <a href={whatsappUrl()} className="text-blue-900 underline" target="_blank" rel="noopener noreferrer">{PHONE_DISPLAY}</a>
              {' · '}Correo: <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-900 underline">{CONTACT_EMAIL}</a>
            </p>
            <Link href="/contacto/" className="inline-flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-800">
              Ver todas las formas de contacto
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
