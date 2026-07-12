import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PromocionesGrid from '@/components/PromocionesGrid';

const SITE_URL = 'https://promogimmicks.com';

export const metadata = {
  title: 'Promociones - Ofertas en Productos Promocionales | PromoGimmicks',
  description: 'Aprovecha nuestras promociones en productos publicitarios personalizados con tu logo. Los mejores precios en merchandising para empresas en Ecuador.',
  alternates: {
    canonical: `${SITE_URL}/promociones/`,
  },
  openGraph: {
    title: 'Promociones - Ofertas en Productos Promocionales | PromoGimmicks',
    description: 'Los mejores precios en productos promocionales personalizados con tu logo.',
    type: 'website',
    url: `${SITE_URL}/promociones/`,
    siteName: 'PromoGimmicks',
    locale: 'es_EC',
  },
};

export default function PromocionesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="relative pt-28 md:pt-36 pb-14 md:pb-16 bg-gradient-to-br from-navy via-navy-600 to-danger-600/40 overflow-hidden">
        <div className="float-blob absolute -top-16 -left-16 w-80 h-80 bg-danger/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="eyebrow inline-flex items-center gap-2 bg-danger/20 text-danger-400 px-4 py-1.5 rounded-full border border-danger/30 mb-5">
            <span className="w-1.5 h-1.5 bg-danger rounded-full animate-pulse" />
            Mejores precios
          </span>
          <h1 className="h1-display text-white mb-4">Promociones</h1>
          <p className="body-lead text-white/70 max-w-2xl mx-auto">
            Productos promocionales con los mejores precios del catálogo, personalizables con tu marca.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PromocionesGrid />
        </div>
      </section>

      <Footer />
    </main>
  );
}
