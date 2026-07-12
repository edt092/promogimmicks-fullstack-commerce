import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NovedadesGrid from '@/components/NovedadesGrid';

const SITE_URL = 'https://promogimmicks.com';

export const metadata = {
  title: 'Novedades - Últimos Productos Promocionales | PromoGimmicks',
  description: 'Descubre los productos promocionales más nuevos de nuestro catálogo. Artículos recién incorporados, personalizables con tu logo, para empresas en Ecuador.',
  alternates: {
    canonical: `${SITE_URL}/novedades/`,
  },
  openGraph: {
    title: 'Novedades - Últimos Productos Promocionales | PromoGimmicks',
    description: 'Los artículos promocionales más recientes de nuestro catálogo, listos para personalizar con tu marca.',
    type: 'website',
    url: `${SITE_URL}/novedades/`,
    siteName: 'PromoGimmicks',
    locale: 'es_EC',
  },
};

export default function NovedadesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="relative pt-28 md:pt-36 pb-14 md:pb-16 bg-brand-gradient overflow-hidden">
        <div className="float-blob absolute -top-20 -right-10 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="eyebrow inline-flex items-center gap-2 bg-white/10 text-sky-300 px-4 py-1.5 rounded-full border border-white/15 mb-5">
            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
            Recién llegados
          </span>
          <h1 className="h1-display text-white mb-4">Novedades</h1>
          <p className="body-lead text-white/70 max-w-2xl mx-auto">
            Los productos promocionales más recientes de nuestro catálogo, listos para llevar tu logo.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NovedadesGrid />
        </div>
      </section>

      <Footer />
    </main>
  );
}
