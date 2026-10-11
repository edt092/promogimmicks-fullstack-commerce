import { notFound } from 'next/navigation';
import CategoryPageView, { categoryMetadata, categoryPageCount } from '@/components/CategoryPageView';
import { activeCategorySlugs } from '@/lib/catalog';

// Páginas 2..N de cada categoría. La página 1 vive en /tienda/categoria/{slug}/ y no se
// duplica aquí. Rutas estáticas reales con enlaces <a>: no dependen de JS ni de rel=next.
export async function generateStaticParams() {
  return activeCategorySlugs().flatMap((slug) => {
    const pages = categoryPageCount(slug);
    return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({ slug, page: String(i + 2) }));
  });
}

export const dynamicParams = false;

function parsePage(slug: string, raw: string): number | null {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 2 || String(n) !== raw || n > categoryPageCount(slug)) return null;
  return n;
}

export async function generateMetadata({ params }: { params: { slug: string; page: string } }) {
  const page = parsePage(params.slug, params.page);
  if (!page) return { title: 'Página no encontrada', robots: { index: false } };
  return categoryMetadata(params.slug, page);
}

export default function CategoryPaginatedPage({ params }: { params: { slug: string; page: string } }) {
  const page = parsePage(params.slug, params.page);
  if (!page) notFound();
  return <CategoryPageView slug={params.slug} page={page} />;
}
