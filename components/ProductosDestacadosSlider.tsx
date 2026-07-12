'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import productsDataRaw from '@/data/products.json';

interface Product {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  categoria_slug: string;
  imagen_url: string;
}

const productsData = productsDataRaw as Product[];

// Una categoría representativa por tarjeta, para mostrar la variedad real del catálogo.
const FEATURED_CATEGORY_SLUGS = [
  'tecnologia',
  'mugs',
  'articulos-escritura',
  'gorras',
  'llaveros',
  'deportes',
  'oficina',
  'paraguas',
  'maletines',
  'vasos-personalizados',
  'termos-personalizados',
  'bar-y-vino',
];

const FEATURED_PRODUCTS = FEATURED_CATEGORY_SLUGS
  .map((slug) => productsData.find((p) => p.categoria_slug === slug))
  .filter((p): p is Product => Boolean(p));

export default function ProductosDestacadosSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollPrev(track.scrollLeft > 8);
    setCanScrollNext(track.scrollLeft < track.scrollWidth - track.clientWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      track.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows]);

  const scrollByCards = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('[data-slider-card]') as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  return (
    <section aria-labelledby="destacados-title" className="relative bg-white text-navy-900 py-24 md:py-32 lg:py-40 overflow-clip">
      <div className="w-full max-w-[120rem] mx-auto px-5 sm:px-8 lg:px-[5rem]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 lg:mb-20">
          <div>
            <p className="text-navy-900/60 text-xs font-semibold tracking-[0.13em] uppercase mb-4">
              Catálogo · Variedad
            </p>
            <h2 id="destacados-title" className="h2-section max-w-[16ch]" style={{ textWrap: 'balance' }}>
              Productos destacados de nuestro catálogo
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/productos/"
              className="hidden sm:inline-flex items-center gap-2 text-navy-900 font-semibold text-sm hover:text-brand transition-colors"
            >
              Ver todo el catálogo
              <span aria-hidden="true">→</span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                disabled={!canScrollPrev}
                aria-label="Ver productos anteriores"
                className="flex items-center justify-center w-11 h-11 rounded-full border border-navy-900/15 text-navy-900 transition-colors hover:bg-navy-900 hover:text-white disabled:opacity-30 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-900 focus-visible:outline-offset-2"
              >
                <ChevronLeft size={18} strokeWidth={2.25} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                disabled={!canScrollNext}
                aria-label="Ver más productos"
                className="flex items-center justify-center w-11 h-11 rounded-full border border-navy-900/15 text-navy-900 transition-colors hover:bg-navy-900 hover:text-white disabled:opacity-30 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-900 focus-visible:outline-offset-2"
              >
                <ChevronRight size={18} strokeWidth={2.25} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          className="no-scrollbar flex gap-5 overflow-x-auto px-5 sm:px-8 lg:px-[5rem] pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {FEATURED_PRODUCTS.map((product, i) => (
            <Link
              key={product.id}
              href={`/tienda/${product.slug}/`}
              data-slider-card
              className="group relative flex-shrink-0 w-[68vw] sm:w-[280px] lg:w-[300px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-50 transition-all duration-300"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="relative aspect-square bg-white">
                <Image
                  src={product.imagen_url}
                  alt={product.nombre}
                  fill
                  sizes="(max-width: 640px) 68vw, 300px"
                  loading={i < 3 ? undefined : 'lazy'}
                  priority={i < 3}
                  className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-navy-900/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                  {product.categoria}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-navy-900 line-clamp-2 min-h-[2.5rem] group-hover:text-brand transition-colors">
                  {product.nombre}
                </h3>
                <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-navy-900/70 group-hover:text-brand transition-colors">
                  Ver detalles
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
