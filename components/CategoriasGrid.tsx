import Image from 'next/image';
import Link from 'next/link';
import categoriesData from '@/data/categories.json';
import { CATEGORIA_SLIDER_IMAGES } from '@/lib/categoriaSliderImages';

interface Category {
  id: string;
  slug: string;
  name: string;
}

const CATEGORIES = (categoriesData as Category[]).filter((c) => CATEGORIA_SLIDER_IMAGES[c.slug]);

export default function CategoriasGrid() {
  return (
    <section id="categorias" aria-labelledby="categorias-title" className="relative bg-white text-navy-900 pt-20 pb-16 md:pt-28 md:pb-20">
      <div className="w-full max-w-[120rem] mx-auto px-5 sm:px-8 lg:px-[5rem]">
        <div className="max-w-[60ch] mb-10 lg:mb-14">
          <p className="eyebrow text-navy-900/60 mb-3">Catálogo</p>
          <h2 id="categorias-title" className="h2-section" style={{ textWrap: 'balance' }}>
            Categorías de artículos promocionales
          </h2>
          <p className="body-lead mt-4 text-navy-900/70">
            Explora nuestro catálogo por categoría y encuentra el producto ideal para tu marca.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/tienda/categoria/${cat.slug}/`}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-900 focus-visible:outline-offset-4"
            >
              <div className="relative aspect-square">
                <Image
                  src={CATEGORIA_SLIDER_IMAGES[cat.slug]}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 46vw, (max-width: 1024px) 24vw, 16vw"
                  loading={i < 12 ? undefined : 'lazy'}
                  priority={i < 6}
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(0deg, rgba(6,15,28,0.78) 0%, rgba(6,15,28,0.1) 55%, transparent 75%)' }}
                />
              </div>
              <span className="absolute inset-x-0 bottom-0 p-3 text-white font-semibold text-xs sm:text-sm leading-tight" style={{ letterSpacing: '-0.01em' }}>
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
