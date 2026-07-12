'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Sparkles, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import productsDataRaw from '@/data/products.json';

interface Product {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  categoria_slug: string;
  descripcion_corta: string;
  imagen_url: string;
  sku: string;
}

const productsData = productsDataRaw as Product[];
const PER_PAGE = 20;
const POOL_SIZE = 300;

// Los productos más recientes son los últimos que el scraper añadió al catálogo
const novedadesPool = [...productsData].slice(-POOL_SIZE).reverse();

export default function NovedadesGrid() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, { name: string; count: number }>();
    for (const p of novedadesPool) {
      const entry = counts.get(p.categoria_slug);
      if (entry) entry.count += 1;
      else counts.set(p.categoria_slug, { name: p.categoria, count: 1 });
    }
    return Array.from(counts.entries())
      .map(([slug, v]) => ({ slug, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 14);
  }, []);

  const filtered = useMemo(() => {
    if (!activeCategory) return novedadesPool;
    return novedadesPool.filter((p) => p.categoria_slug === activeCategory);
  }, [activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const selectCategory = (slug: string | null) => {
    setActiveCategory(slug);
    setPage(1);
  };

  const pageNumbers = useMemo(() => {
    const nums: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }, [currentPage, totalPages]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 md:gap-10">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Link href="/productos/" className="link-underline text-sm text-brand font-medium mb-5 inline-block">
          ← Volver a categorías
        </Link>
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Filtrar por categoría</h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => selectCategory(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !activeCategory ? 'bg-brand-50 text-brand font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Ver todo <span className="text-slate-400">({novedadesPool.length})</span>
            </button>
          </li>
          {categoryCounts.map((c) => (
            <li key={c.slug}>
              <button
                onClick={() => selectCategory(c.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCategory === c.slug ? 'bg-brand-50 text-brand font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {c.name} <span className="text-slate-400">({c.count})</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            Mostrando <span className="font-semibold text-ink">{pageItems.length}</span> de{' '}
            <span className="font-semibold text-ink">{filtered.length}</span> novedades
          </p>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageNumbers={pageNumbers}
            onChange={setPage}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {pageItems.map((product, i) => (
            <Link
              key={product.id}
              href={`/tienda/${product.slug}/`}
              className="tilt-card reveal-up group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lift transition-shadow duration-300"
              style={{ animationDelay: `${(i % PER_PAGE) * 0.03}s` }}
            >
              <div className="relative h-40 sm:h-44 bg-slate-50 overflow-hidden">
                <span className="badge-ribbon absolute top-0 left-0 bg-danger text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 z-10 flex items-center gap-1">
                  <Sparkles size={10} /> Nuevo
                </span>
                <img
                  src={product.imagen_url}
                  alt={product.nombre}
                  loading="lazy"
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3.5">
                <p className="text-[11px] font-semibold text-brand uppercase tracking-wide mb-1">{product.sku}</p>
                <h3 className="text-sm font-semibold text-ink line-clamp-2 min-h-[2.5rem] group-hover:text-brand transition-colors">
                  {product.nombre}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageNumbers={pageNumbers}
            onChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  pageNumbers,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  pageNumbers: number[];
  onChange: (p: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(1)}
        disabled={currentPage === 1}
        className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        aria-label="Primera página"
      >
        <ChevronsLeft size={16} />
      </button>
      <button
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} />
      </button>
      {pageNumbers.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
            n === currentPage ? 'bg-brand text-white' : 'text-slate-600 hover:bg-brand-50'
          }`}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        aria-label="Página siguiente"
      >
        <ChevronRight size={16} />
      </button>
      <button
        onClick={() => onChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        aria-label="Última página"
      >
        <ChevronsRight size={16} />
      </button>
    </div>
  );
}
