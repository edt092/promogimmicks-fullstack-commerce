'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Tag, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
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
const PER_PAGE = 20;
const OFFERS_CATEGORY_SLUG = 'precio-bomba';

type SortKey = 'relevancia' | 'nombre-asc' | 'nombre-desc';

const offersPool = productsData.filter((p) => p.categoria_slug === OFFERS_CATEGORY_SLUG);

export default function PromocionesGrid() {
  const [sort, setSort] = useState<SortKey>('relevancia');
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const list = [...offersPool];
    if (sort === 'nombre-asc') list.sort((a, b) => a.nombre.localeCompare(b.nombre));
    if (sort === 'nombre-desc') list.sort((a, b) => b.nombre.localeCompare(a.nombre));
    return list;
  }, [sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const pageNumbers = useMemo(() => {
    const nums: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }, [currentPage, totalPages]);

  const handleSort = (v: SortKey) => {
    setSort(v);
    setPage(1);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <p className="text-sm text-slate-500">
          Mostrando <span className="font-semibold text-ink">{pageItems.length}</span> de{' '}
          <span className="font-semibold text-ink">{sorted.length}</span> promociones
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-slate-500 whitespace-nowrap">Ordenar por</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => handleSort(e.target.value as SortKey)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:border-brand focus:ring-1 focus:ring-brand outline-none"
          >
            <option value="relevancia">Relevancia</option>
            <option value="nombre-asc">Nombre (A-Z)</option>
            <option value="nombre-desc">Nombre (Z-A)</option>
          </select>
        </div>
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
                <Tag size={10} /> Oferta
              </span>
              <img
                src={product.imagen_url}
                alt={product.nombre}
                loading="lazy"
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-3.5">
              <p className="text-[11px] font-semibold text-danger uppercase tracking-wide mb-1">{product.sku}</p>
              <h3 className="text-sm font-semibold text-ink line-clamp-2 min-h-[2.5rem] group-hover:text-brand transition-colors">
                {product.nombre}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            aria-label="Primera página"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            aria-label="Página anterior"
          >
            <ChevronLeft size={16} />
          </button>
          {pageNumbers.map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                n === currentPage ? 'bg-danger text-white' : 'text-slate-600 hover:bg-danger-50'
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            aria-label="Página siguiente"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            aria-label="Última página"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
