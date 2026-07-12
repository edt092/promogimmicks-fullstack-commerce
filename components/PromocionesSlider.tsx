'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import productsDataRaw from '@/data/products.json';

interface Product {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  categoria_slug: string;
  imagen_url: string;
  sku: string;
}

const productsData = productsDataRaw as Product[];
const OFFERS_CATEGORY_SLUG = 'precio-bomba';
const OFFERS_LIMIT = 16;

const OFFER_PRODUCTS = productsData
  .filter((p) => p.categoria_slug === OFFERS_CATEGORY_SLUG)
  .slice(0, OFFERS_LIMIT);

export default function PromocionesSlider() {
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

  if (OFFER_PRODUCTS.length === 0) return null;

  return (
    <section aria-labelledby="promociones-title" className="relative text-white py-24 md:py-32 lg:py-40 overflow-clip" style={{ background: 'radial-gradient(circle at 20% 30%, rgba(255,45,45,0.14), transparent 40%), #060F1C' }}>
      <div className="w-full max-w-[120rem] mx-auto px-5 sm:px-8 lg:px-[5rem]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 lg:mb-20">
          <div>
            <p className="inline-flex items-center gap-2 text-danger-400 text-xs font-semibold tracking-[0.13em] uppercase mb-4">
              <span className="w-1.5 h-1.5 bg-danger-400 rounded-full animate-pulse" />
              Mejores precios
            </p>
            <h2 id="promociones-title" className="h2-section max-w-[16ch]" style={{ textWrap: 'balance' }}>
              Promociones activas en el catálogo
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/promociones/"
              className="hidden sm:inline-flex items-center gap-2 text-white font-semibold text-sm hover:text-danger-400 transition-colors"
            >
              Ver todas las promociones
              <span aria-hidden="true">→</span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                disabled={!canScrollPrev}
                aria-label="Ver promociones anteriores"
                className="flex items-center justify-center w-11 h-11 rounded-full border border-white/15 text-white transition-colors hover:bg-white hover:text-navy-900 disabled:opacity-30 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                <ChevronLeft size={18} strokeWidth={2.25} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                disabled={!canScrollNext}
                aria-label="Ver más promociones"
                className="flex items-center justify-center w-11 h-11 rounded-full border border-white/15 text-white transition-colors hover:bg-white hover:text-navy-900 disabled:opacity-30 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
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
          {OFFER_PRODUCTS.map((product, i) => (
            <Link
              key={product.id}
              href={`/tienda/${product.slug}/`}
              data-slider-card
              className="group relative flex-shrink-0 w-[68vw] sm:w-[280px] lg:w-[300px] rounded-2xl overflow-hidden bg-[#0e2038] border border-white/10 hover:border-danger-400/50 transition-all duration-300"
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
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-danger-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  <Tag size={10} /> Oferta
                </span>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-semibold text-danger-400 uppercase tracking-wide mb-1">{product.sku}</p>
                <h3 className="text-sm font-semibold text-white line-clamp-2 min-h-[2.5rem] group-hover:text-danger-400 transition-colors">
                  {product.nombre}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
