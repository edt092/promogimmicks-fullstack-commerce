'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import productsDataRaw from '@/data/products.json';

interface Product {
  categoria: string;
}

const productsData = productsDataRaw as Product[];
const TOTAL_PRODUCTS = productsData.length;
const TOTAL_CATEGORIES = new Set(productsData.map((p) => p.categoria)).size;
const VERIFIED_LABEL = new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long' });

const USEFUL_LINKS = [
  { label: 'Explorar catálogo completo', href: '/tienda/' },
  { label: 'Novedades', href: '/novedades/' },
  { label: 'Promociones', href: '/promociones/' },
];

export default function Confianza() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const counterRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cancelled = false;
    let revert: (() => void) | undefined;

    (async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const cards = cardRefs.current.filter(Boolean) as HTMLElement[];

        if (prefersReduced) {
          gsap.set(cards, { opacity: 1, autoAlpha: 1, y: 0, scale: 1 });
          return;
        }

        gsap.from(cards, {
          autoAlpha: 0,
          y: 54,
          scale: 0.992,
          duration: 1,
          stagger: { each: 0.09, from: 'start' },
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 76%', toggleActions: 'play none none reverse' },
        });

        counterRefs.current.forEach((el) => {
          if (!el) return;
          const finalValue = Number(el.dataset.counter);
          if (!Number.isFinite(finalValue) || finalValue < 0) return;
          const state = { value: 0 };
          gsap.to(state, {
            value: finalValue,
            duration: 1.8,
            ease: 'power3.out',
            snap: { value: 1 },
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
            onUpdate() {
              el.textContent = Math.round(state.value).toLocaleString('es-EC');
            },
            onComplete() {
              el.textContent = finalValue.toLocaleString('es-EC');
            },
          });
        });
      }, section);

      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <section
      id="confianza"
      ref={sectionRef}
      aria-labelledby="trust-title"
      className="relative overflow-clip text-navy-900"
      style={{ background: '#eee7da', paddingBlock: 'clamp(9rem, 16vw, 18rem) clamp(10rem, 18vw, 20rem)' }}
    >
      <div className="w-full max-w-[120rem] mx-auto px-5 sm:px-8 lg:px-[5rem] grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
        {/* A. Intro */}
        <header
          ref={(el) => { cardRefs.current[0] = el; }}
          className="lg:col-span-8 min-w-0 p-7 lg:p-16 flex flex-col justify-between"
          style={{ background: '#f7f3eb', minHeight: '28rem' }}
        >
          <p className="m-0 text-navy-900/[64%] text-xs font-semibold tracking-[0.13em] uppercase">
            Experiencia, evidencia y transparencia
          </p>
          <h2
            id="trust-title"
            className="h2-section max-w-[10ch]"
            style={{ marginTop: 'clamp(3rem, 8vw, 8rem)', textWrap: 'balance' }}
          >
            Una solución promocional respaldada por atención especializada
          </h2>
          <p className="max-w-[49ch] text-navy-900/[64%]" style={{ fontSize: 'clamp(1rem, 1.25vw, 1.25rem)', lineHeight: 1.65, marginTop: 'clamp(3rem, 6vw, 6rem)' }}>
            En PromoGimmicks ayudamos a empresas a seleccionar artículos promocionales de acuerdo con su campaña, audiencia y forma de uso. Nuestro objetivo es facilitar el proceso desde la elección del producto hasta la definición de su personalización.
          </p>
        </header>

        {/* B. Metrics — real, computed from the live catalog */}
        <section
          ref={(el) => { cardRefs.current[1] = el; }}
          aria-labelledby="trust-metrics-title"
          className="lg:col-span-4 min-w-0 p-7 lg:p-12"
          style={{ background: '#f7f3eb' }}
        >
          <header>
            <h3 className="m-0 h3-card">
              Catálogo verificable
            </h3>
            <p className="mt-3 text-navy-900/[64%] text-xs" style={{ lineHeight: 1.55 }}>Datos revisados en {VERIFIED_LABEL}.</p>
          </header>

          <dl className="mt-14">
            <div className="py-6 border-t border-navy-900/[16%]">
              <dt className="text-navy-900/[64%] text-xs font-semibold tracking-[0.1em] uppercase">Artículos en catálogo</dt>
              <dd className="mt-6">
                <span
                  ref={(el) => { counterRefs.current[0] = el; }}
                  data-counter={TOTAL_PRODUCTS}
                  className="block font-extrabold"
                  style={{ fontSize: 'clamp(4rem, 7vw, 8rem)', lineHeight: 0.8, letterSpacing: '-0.03em' }}
                >
                  {TOTAL_PRODUCTS.toLocaleString('es-EC')}
                </span>
                <span className="block mt-4 text-navy-900/[48%] text-xs">Conteo del catálogo publicado en /tienda/</span>
              </dd>
            </div>
            <div className="py-6 border-t border-navy-900/[16%]">
              <dt className="text-navy-900/[64%] text-xs font-semibold tracking-[0.1em] uppercase">Categorías de productos</dt>
              <dd className="mt-6">
                <span
                  ref={(el) => { counterRefs.current[1] = el; }}
                  data-counter={TOTAL_CATEGORIES}
                  className="block font-extrabold"
                  style={{ fontSize: 'clamp(4rem, 7vw, 8rem)', lineHeight: 0.8, letterSpacing: '-0.03em' }}
                >
                  {TOTAL_CATEGORIES.toLocaleString('es-EC')}
                </span>
                <span className="block mt-4 text-navy-900/[48%] text-xs">Categorías activas del catálogo</span>
              </dd>
            </div>
          </dl>
        </section>

        {/* C. Catalog showcase */}
        <article
          ref={(el) => { cardRefs.current[2] = el; }}
          className="lg:col-span-7 min-w-0 relative overflow-hidden"
          style={{ minHeight: '30rem' }}
        >
          <figure className="relative m-0 h-full" style={{ minHeight: '30rem', display: 'grid' }}>
            <Image
              src="/img/hero/hero-slide-2.png"
              alt=""
              fill
              sizes="(max-width: 1023px) 100vw, 55vw"
              loading="lazy"
              className="object-cover"
              style={{ filter: 'saturate(0.86)' }}
            />
            <figcaption
              className="relative z-10 self-end p-6 lg:p-10 grid gap-1 text-white"
              style={{ background: 'linear-gradient(transparent, rgba(6,15,28,0.74))' }}
            >
              <span className="text-xs font-semibold tracking-[0.1em] uppercase">Selección del catálogo</span>
              <strong className="h3-card block" style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.5rem)' }}>
                Kits y artículos personalizables
              </strong>
            </figcaption>
          </figure>
        </article>

        {/* E. Business identity */}
        <section
          ref={(el) => { cardRefs.current[3] = el; }}
          aria-labelledby="business-data-title"
          className="lg:col-start-8 lg:col-span-5 min-w-0 p-7 lg:p-12"
          style={{ background: '#f7f3eb' }}
        >
          <header>
            <h3 id="business-data-title" className="m-0 h3-card">
              Información de PromoGimmicks
            </h3>
          </header>

          <address className="not-italic mt-10">
            <dl className="m-0">
              <div className="grid gap-x-6 gap-y-1 py-[1.15rem] border-t border-navy-900/[16%]" style={{ gridTemplateColumns: 'minmax(8rem, 0.75fr) 1.25fr' }}>
                <dt className="text-navy-900/[64%] text-[0.68rem] font-semibold tracking-[0.1em] uppercase">Teléfono</dt>
                <dd className="m-0 text-sm"><a href="tel:+593998594123" className="hover:text-brand transition-colors">+593 99 859 4123</a></dd>
              </div>
              <div className="grid gap-x-6 gap-y-1 py-[1.15rem] border-t border-navy-900/[16%]" style={{ gridTemplateColumns: 'minmax(8rem, 0.75fr) 1.25fr' }}>
                <dt className="text-navy-900/[64%] text-[0.68rem] font-semibold tracking-[0.1em] uppercase">Correo electrónico</dt>
                <dd className="m-0 text-sm"><a href="mailto:info@promogimmicks.com" className="hover:text-brand transition-colors">info@promogimmicks.com</a></dd>
              </div>
              <div className="grid gap-x-6 gap-y-1 py-[1.15rem] border-t border-navy-900/[16%]" style={{ gridTemplateColumns: 'minmax(8rem, 0.75fr) 1.25fr' }}>
                <dt className="text-navy-900/[64%] text-[0.68rem] font-semibold tracking-[0.1em] uppercase">Dirección</dt>
                <dd className="m-0 text-sm">Av. Las Palmas, 63, Ecuador</dd>
              </div>
            </dl>
          </address>
        </section>

        {/* Useful links, in place of policy pages that don't exist yet */}
        <nav
          aria-labelledby="useful-links-title"
          className="lg:col-start-8 lg:col-span-5 min-w-0 p-7 lg:p-12"
          style={{ background: '#f7f3eb' }}
        >
          <h3 id="useful-links-title" className="m-0 h3-card">
            Enlaces útiles
          </h3>
          <ul className="mt-10 m-0 p-0 list-none">
            {USEFUL_LINKS.map((link) => (
              <li key={link.href} className="border-t border-navy-900/[16%] last:border-b">
                <Link
                  href={link.href}
                  className="group relative min-h-[4.75rem] py-4 flex justify-between items-center gap-8 text-navy-900 no-underline"
                  style={{ fontSize: 'clamp(0.95rem, 1.15vw, 1.15rem)' }}
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                  <span aria-hidden="true" className="absolute left-0 right-0 -bottom-px h-0.5 bg-navy-900 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
