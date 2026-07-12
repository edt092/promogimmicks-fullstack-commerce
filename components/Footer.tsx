'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';
import { Logo } from './Logo';
import categoriesDataRaw from '@/data/categories.json';

interface Category {
  slug: string;
  name: string;
}

const categoriesData = categoriesDataRaw as Category[];

// Categorías con mayor volumen de búsqueda — mostradas como acceso rápido
const FEATURED_CATEGORY_SLUGS = [
  'tecnologia', 'mugs', 'llaveros', 'gorras',
  'articulos-escritura', 'maletines', 'herramientas', 'precio-bomba',
];

const featuredCategories = FEATURED_CATEGORY_SLUGS
  .map((slug) => categoriesData.find((c) => c.slug === slug))
  .filter((c): c is Category => Boolean(c));

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const BanderaEcuador = () => (
  <svg width="28" height="20" viewBox="0 0 32 24" className="rounded shadow-sm flex-shrink-0">
    <rect width="32" height="12" fill="#FFD100" />
    <rect y="12" width="32" height="6" fill="#0033A0" />
    <rect y="18" width="32" height="6" fill="#CE1126" />
  </svg>
);

function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/mzznadzv', {
        method: 'POST',
        body: new FormData(e.currentTarget),
        headers: { Accept: 'application/json' },
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) e.currentTarget.reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-sky-400 text-sm">
        <CheckCircle2 size={18} />
        <span>¡Gracias! Te mantendremos al día.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <input
          type="email"
          name="correo_newsletter"
          required
          placeholder="Tu correo"
          className="w-full bg-white/5 border border-white/15 rounded-lg pl-4 pr-11 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          aria-label="Suscribirse"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-brand hover:bg-brand-600 rounded-md transition-colors disabled:opacity-50"
        >
          <Send size={14} />
        </button>
      </div>
      {status === 'error' && (
        <p className="text-danger-400 text-xs">No pudimos enviarlo, intenta de nuevo.</p>
      )}
    </form>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Marca */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5" aria-label="PromoGimmicks - Inicio">
              <Logo markSize={48} />
            </Link>
            <div className="flex items-center gap-2 mb-4">
              <BanderaEcuador />
              <span className="text-slate-400 text-sm">Ecuador</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Productos promocionales y merchandising personalizado para empresas.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/promogimmickscl/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de PromoGimmicks"
                className="w-10 h-10 bg-white/10 hover:bg-brand rounded-lg flex items-center justify-center transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M22 12a10 10 0 1 0-11.5 9.87v-6.98H7.9V12h2.6V9.8c0-2.57 1.53-4 3.87-4 1.12 0 2.3.2 2.3.2v2.5h-1.3c-1.28 0-1.68.8-1.68 1.62V12h2.86l-.46 2.89h-2.4v6.98A10 10 0 0 0 22 12Z"/></svg>
              </a>
              <a
                href="https://wa.me/593998594123"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 bg-white/10 hover:bg-[#25D366] rounded-lg flex items-center justify-center transition-colors"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* Categorías */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">Categorías</h4>
            <ul className="grid grid-cols-1 gap-2.5">
              {featuredCategories.slice(0, 4).map((c) => (
                <li key={c.slug}>
                  <Link href={`/tienda/categoria/${c.slug}/`} className="link-underline text-slate-400 hover:text-sky-400 transition-colors text-sm">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4 lg:opacity-0 lg:select-none">Categorías</h4>
            <ul className="grid grid-cols-1 gap-2.5">
              {featuredCategories.slice(4, 8).map((c) => (
                <li key={c.slug}>
                  <Link href={`/tienda/categoria/${c.slug}/`} className="link-underline text-slate-400 hover:text-sky-400 transition-colors text-sm">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enlaces + Contacto */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">Explora</h4>
            <ul className="space-y-2.5 mb-6">
              {[
                { href: '/novedades/', label: 'Novedades' },
                { href: '/productos/', label: 'Productos' },
                { href: '/promociones/', label: 'Promociones' },
                { href: '/blog', label: 'Blog' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-underline text-slate-400 hover:text-sky-400 transition-colors text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <address className="not-italic space-y-2.5 text-sm">
              <a href="tel:+593998594123" className="flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors">
                <Phone size={14} className="text-sky-400 flex-shrink-0" /> +593 99 859 4123
              </a>
              <a href="mailto:info@promogimmicks.com" className="flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors">
                <Mail size={14} className="text-sky-400 flex-shrink-0" /> info@promogimmicks.com
              </a>
              <p className="flex items-start gap-2 text-slate-400">
                <MapPin size={14} className="text-sky-400 flex-shrink-0 mt-0.5" /> Av. Las Palmas, 63, Ecuador
              </p>
            </address>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">Newsletter</h4>
            <p className="text-slate-400 text-sm mb-4">
              Recibe nuestras últimas ofertas en tu correo.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Separador y copyright */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              &copy; {currentYear} PromoGimmicks. Todos los derechos reservados.
            </p>
            <p className="text-slate-400 text-sm text-center md:text-right">
              Desarrollado por:{' '}
              <a
                href="https://edwinbayonaitmanager.online"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 transition-colors"
              >
                Bayona Digital Systems
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
