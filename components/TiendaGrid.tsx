'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Search, X, ShoppingCart } from 'lucide-react';
import ProductCard from './ProductCard';
import type { ProductCardData } from '@/lib/catalog';
import { loadSearchIndex, searchItems, type SearchItem } from '@/lib/search';

type GridProduct = ProductCardData & { descripcion_corta?: string };

interface TiendaGridProps {
  /** Primer lote renderizado en el servidor (visible sin JS). */
  initialProducts: GridProduct[];
  /** Total de productos del catálogo. */
  totalCount: number;
}

const PRODUCTS_PER_PAGE = 20;

function toGrid(item: SearchItem): GridProduct {
  return {
    id: item.slug,
    nombre: item.nombre,
    slug: item.slug,
    categoria: item.categoria,
    categoria_slug: item.categoria_slug,
    imagen_url: item.imagen_url,
    sku: item.sku,
    descripcion_corta: item.descripcion_corta,
  };
}

// El catálogo completo ya no viaja en el JS de la página: el resto de productos y la
// búsqueda usan /search-index.json, que se descarga al buscar o al pedir más productos.
// El descubrimiento para buscadores no depende de este componente (enlaces SSR en
// categorías paginadas, directorio de /tienda/ y sitemap).
export default function TiendaGrid({ initialProducts, totalCount }: TiendaGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleProducts, setVisibleProducts] = useState(PRODUCTS_PER_PAGE);
  const [index, setIndex] = useState<SearchItem[] | null>(null);
  const [indexError, setIndexError] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const ensureIndex = useCallback(() => {
    if (index || indexError) return;
    loadSearchIndex().then(setIndex).catch(() => setIndexError(true));
  }, [index, indexError]);

  const searching = searchTerm.trim().length >= 2;

  useEffect(() => {
    if (searching) ensureIndex();
  }, [searching, ensureIndex]);

  const allProducts = useMemo<GridProduct[]>(
    () => (index ? index.map(toGrid) : initialProducts),
    [index, initialProducts]
  );

  const filteredProducts = useMemo<GridProduct[]>(() => {
    if (!searching) return allProducts;
    if (!index) return [];
    return searchItems(index, searchTerm).map(toGrid);
  }, [searching, allProducts, index, searchTerm]);

  const total = searching ? filteredProducts.length : index ? allProducts.length : totalCount;
  const waitingIndex = !index && !indexError && (searching || visibleProducts > initialProducts.length);
  const isLoading = waitingIndex;

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleProducts);
  }, [filteredProducts, visibleProducts]);

  useEffect(() => {
    setVisibleProducts(PRODUCTS_PER_PAGE);
  }, [searchTerm]);

  const loadMore = useCallback(() => {
    if (visibleProducts >= total) return;
    ensureIndex();
    setVisibleProducts(prev => Math.min(prev + PRODUCTS_PER_PAGE, total));
  }, [visibleProducts, total, ensureIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !waitingIndex) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => observer.disconnect();
  }, [loadMore, waitingIndex]);

  return (
    <div className="min-h-screen">
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-4 -mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre, SKU o categoría…"
                aria-label="Buscar productos en el catálogo"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  aria-label="Borrar búsqueda"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <p className="text-sm text-gray-500 text-center sm:text-right whitespace-nowrap">
              <span className="font-semibold text-gray-900">{searching && !index ? '…' : total}</span> productos
              {searchTerm && (
                <span className="ml-2 text-amber-600">
                  para &quot;{searchTerm}&quot;
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
              {displayedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 2} />
              ))}
            </div>

            {(visibleProducts < total || isLoading) && (
              <div ref={loaderRef} className="flex justify-center items-center py-12">
                {isLoading ? (
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="w-6 h-6 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
                    <span>Cargando más productos...</span>
                  </div>
                ) : (
                  <button
                    onClick={loadMore}
                    className="px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
                  >
                    Cargar más productos
                  </button>
                )}
              </div>
            )}

            {!isLoading && visibleProducts >= total && total > PRODUCTS_PER_PAGE && (
              <div className="text-center py-8 text-gray-500">
                Has visto todos los {total} productos
              </div>
            )}
          </>
        ) : isLoading ? (
          <div className="flex justify-center items-center gap-3 py-20 text-gray-500" role="status" aria-live="polite">
            <div className="w-6 h-6 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
            <span>Buscando en el catálogo…</span>
          </div>
        ) : indexError && searching ? (
          <div className="text-center py-20 text-gray-600" role="alert">
            No se pudo cargar el buscador. Revisa tu conexión o navega por categorías.
          </div>
        ) : (
          <div className="text-center py-20 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-md mx-auto">
              <ShoppingCart className="mx-auto text-gray-300 mb-6" size={80} />
              <h3 className="text-2xl font-bold text-gray-700 mb-3">No encontramos productos</h3>
              <p className="text-gray-500 text-base mb-6">
                No hay resultados para &quot;{searchTerm}&quot;
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Ver todos los productos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
