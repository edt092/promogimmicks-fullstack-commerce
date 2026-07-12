'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import categoriesData from '@/data/categories.json';
import { CATEGORIA_SLIDER_IMAGES } from '@/lib/categoriaSliderImages';

interface Category {
  id: string;
  slug: string;
  name: string;
}

const CATEGORIES = (categoriesData as Category[]).filter((c) => CATEGORIA_SLIDER_IMAGES[c.slug]);

export default function CategoriasSlider() {
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
    const step = card ? card.offsetWidth + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  return (
    <div className="categorias-slider relative mt-16 lg:mt-24">
      <div className="flex items-center justify-between mb-5 px-0">
        <p className="text-navy-900/60 text-xs font-semibold tracking-[0.12em] uppercase">
          Todas las categorías
        </p>
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            disabled={!canScrollPrev}
            aria-label="Ver categorías anteriores"
            className="flex items-center justify-center w-11 h-11 rounded-full border border-navy-900/15 text-navy-900 transition-colors hover:bg-navy-900 hover:text-white disabled:opacity-30 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-900 focus-visible:outline-offset-2"
          >
            <ChevronLeft size={18} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            disabled={!canScrollNext}
            aria-label="Ver más categorías"
            className="flex items-center justify-center w-11 h-11 rounded-full border border-navy-900/15 text-navy-900 transition-colors hover:bg-navy-900 hover:text-white disabled:opacity-30 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-900 focus-visible:outline-offset-2"
          >
            <ChevronRight size={18} strokeWidth={2.25} />
          </button>
        </div>
      </div>

      <div className="relative -mx-5 sm:-mx-8 lg:-mx-10">
        <div
          ref={trackRef}
          className="no-scrollbar flex gap-4 overflow-x-auto px-5 sm:px-8 lg:px-10 pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/tienda/categoria/${cat.slug}/`}
              data-slider-card
              className="group relative flex-shrink-0 w-[42vw] sm:w-[220px] lg:w-[240px] rounded-2xl overflow-hidden bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-900 focus-visible:outline-offset-4"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={CATEGORIA_SLIDER_IMAGES[cat.slug]}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 42vw, 240px"
                  loading={i < 4 ? undefined : 'lazy'}
                  priority={i < 4}
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(0deg, rgba(6,15,28,0.78) 0%, rgba(6,15,28,0.15) 55%, transparent 75%)' }}
                />
              </div>
              <span className="absolute inset-x-0 bottom-0 p-4 text-white font-semibold text-sm leading-tight" style={{ letterSpacing: '-0.01em' }}>
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
