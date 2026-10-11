import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuoteBuilder from '@/components/QuoteBuilder';
import { absoluteUrl } from '@/lib/site';

// Página de utilidad (borrador personal en el navegador): no indexable y fuera del sitemap.
export const metadata: Metadata = {
  title: 'Tu cotización | PromoGimmicks',
  description: 'Reúne varios productos y envía una sola solicitud de cotización por WhatsApp o correo.',
  alternates: { canonical: absoluteUrl('/cotizacion/') },
  robots: { index: false, follow: true },
};

export default function CotizacionPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-slate-500 mb-4" aria-label="Ruta de navegación">
            <Link href="/" className="hover:text-blue-900 py-2">Inicio</Link> <span>/</span>{' '}
            <Link href="/tienda/" className="hover:text-blue-900 py-2">Tienda</Link> <span>/</span>{' '}
            <span className="text-blue-900">Cotización</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">Tu cotización</h1>
          <p className="text-slate-700 mb-8">
            Reúne los productos que te interesan, indica cantidades, ciudad y fecha, y envía una sola solicitud.
            Te responderemos con precios, pedido mínimo, técnica de personalización y plazo para tu pedido.
          </p>
          <QuoteBuilder />
        </div>
      </section>
      <Footer />
    </main>
  );
}
