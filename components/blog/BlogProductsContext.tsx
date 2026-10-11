'use client';

import { createContext, useContext } from 'react';
import type { BlogProduct, BlogProductSets } from '@/lib/blog-products';

const BlogProductsContext = createContext<BlogProductSets>({});

export function BlogProductsProvider({ value, children }: { value: BlogProductSets; children: React.ReactNode }) {
  return <BlogProductsContext.Provider value={value}>{children}</BlogProductsContext.Provider>;
}

/** Acceso a los productos del blog recibidos del servidor (sin importar el catálogo). */
export function useBlogProducts() {
  const sets = useContext(BlogProductsContext);
  const byCategory = (category: string, limit = 4): BlogProduct[] => (sets[category] ?? []).slice(0, limit);
  const featured = (limit = 4): BlogProduct[] =>
    ['Tecnología', 'Drinkware', 'Oficina', 'Accesorios']
      .map((c) => sets[c]?.[0])
      .filter((p): p is BlogProduct => Boolean(p))
      .slice(0, limit);
  const mixed = (categories: string[], limit = 12): BlogProduct[] =>
    categories.flatMap((c) => sets[c] ?? []).slice(0, limit);
  return { byCategory, featured, mixed };
}
