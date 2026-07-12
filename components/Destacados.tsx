'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
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

// Selección determinística de 3 categorías con presencia visual fuerte
const FEATURED_CATEGORY_SLUGS = ['tecnologia', 'mugs', 'llaveros'];

function pickFeatured(): Product[] {
  const picks: Product[] = [];
  for (const slug of FEATURED_CATEGORY_SLUGS) {
    const found = productsData.find((p) => p.categoria_slug === slug);
    if (found) picks.push(found);
  }
  return picks;
}

const featured = pickFeatured();

function Tile({ product, big = false }: { product: Product; big?: boolean }) {
  return (
    <Link
      href={`/tienda/${product.slug}/`}
      className={`group relative block bg-white overflow-hidden ${big ? 'row-span-2' : ''}`}
    >
      <div className={`relative ${big ? 'h-full min-h-[26rem]' : 'h-[13.5rem] sm:h-[15rem]'} bg-white overflow-hidden`}>
        <img
          src={product.imagen_url}
          alt={product.nombre}
          className={`w-full h-full object-contain ${big ? 'p-10 sm:p-14 pt-24 sm:pt-28' : 'p-6 sm:p-8 pt-16 sm:pt-20'} group-hover:scale-[1.03] transition-transform duration-500 ease-out`}
        />
        <div
          className="absolute inset-x-0 top-0 h-2/5 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.75) 55%, rgba(255,255,255,0) 100%)' }}
        />
        <div className="absolute top-5 left-5 sm:top-7 sm:left-7 max-w-[75%] pointer-events-none">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 mb-1">
            {product.categoria}
          </p>
          <h3 className={`font-black text-ink leading-[1.05] tracking-tight ${big ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'}`}>
            {product.nombre}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1.5">{product.sku}</p>
        </div>
      </div>
    </Link>
  );
}

export default function Destacados() {
  if (featured.length < 3) return null;

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="h2-section text-ink text-center mb-10 md:mb-12"
        >
          Productos Destacados
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Tile product={featured[0]} big />
          </motion.div>
          <div className="grid grid-rows-2 gap-2 sm:gap-3">
            {featured.slice(1, 3).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
              >
                <Tile product={p} />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mt-10 md:mt-12"
        >
          <Link
            href="/productos/"
            className="inline-flex items-center justify-center border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-ink font-semibold text-sm px-8 py-3 rounded-md transition-colors"
          >
            Ver más
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
