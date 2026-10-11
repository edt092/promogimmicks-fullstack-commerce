import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { absoluteUrl, jsonLd, whatsappUrl, ORGANIZATION_ID, PHONE_DISPLAY, CONTACT_EMAIL, WHATSAPP_NUMBER } from '@/lib/site';

// Sin formulario: el componente ContactSection (Formspree) no se publica hasta que exista
// una política de privacidad revisada por el propietario (reports/seo-business-inputs.md).
export const metadata: Metadata = {
  title: 'Contacto | PromoGimmicks Ecuador',
  description: 'Cotiza artículos promocionales personalizados por WhatsApp, teléfono o correo. Indica producto, cantidad, ciudad y fecha estimada de tu pedido.',
  alternates: { canonical: absoluteUrl('/contacto/') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/contacto/'),
    siteName: 'PromoGimmicks',
    locale: 'es_EC',
    title: 'Contacto | PromoGimmicks',
    description: 'Cotiza artículos promocionales personalizados por WhatsApp, teléfono o correo.',
  },
};

export default function ContactoPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${absoluteUrl('/contacto/')}#webpage`,
    "url": absoluteUrl('/contacto/'),
    "name": 'Contacto PromoGimmicks',
    "inLanguage": 'es-EC',
    "about": { "@id": ORGANIZATION_ID },
  };

  const canales = [
    { icon: MessageCircle, titulo: 'WhatsApp', valor: PHONE_DISPLAY, href: whatsappUrl(), externo: true, nota: 'La forma más rápida de cotizar.' },
    { icon: Phone, titulo: 'Teléfono', valor: PHONE_DISPLAY, href: `tel:+${WHATSAPP_NUMBER}`, externo: false, nota: 'Llamadas y mensajes.' },
    { icon: Mail, titulo: 'Correo', valor: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, externo: false, nota: 'Para enviar tu logo o arte en archivo.' },
  ];

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Navbar />

      <section className="pt-32 pb-14 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-blue-200 text-sm mb-6" aria-label="Ruta de navegación">
            <Link href="/" className="hover:text-white py-2">Inicio</Link> <span>/</span> <span className="text-white">Contacto</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contacto</h1>
          <p className="text-xl text-blue-100">Cotiza artículos promocionales personalizados para tu empresa en Ecuador.</p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="grid sm:grid-cols-3 gap-4 mb-12">
            {canales.map((c) => (
              <li key={c.titulo}>
                <a
                  href={c.href}
                  {...(c.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="block h-full rounded-2xl border border-gray-200 p-6 hover:border-amber-500 hover:shadow-md transition-all"
                >
                  <c.icon className="text-amber-500 mb-3" size={28} aria-hidden="true" />
                  <p className="font-bold text-blue-900">{c.titulo}</p>
                  <p className="text-gray-800 break-all">{c.valor}</p>
                  <p className="text-sm text-gray-500 mt-2">{c.nota}</p>
                </a>
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold text-blue-900 mb-4">Qué incluir en tu solicitud</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-10">
            <li>Producto o categoría de interés (puedes enviar el enlace o el SKU de la ficha).</li>
            <li>Cantidad aproximada.</li>
            <li>Ciudad de entrega y fecha en la que necesitas el pedido.</li>
            <li>Tu logotipo, de preferencia en archivo vectorial o de buena resolución.</li>
          </ul>

          <p className="text-gray-700">
            ¿Aún no eliges producto? Explora el <Link href="/tienda/" className="text-blue-900 underline">catálogo completo</Link> o
            conoce más <Link href="/nosotros/" className="text-blue-900 underline">sobre PromoGimmicks</Link>.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
