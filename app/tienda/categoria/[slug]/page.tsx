import { notFound } from 'next/navigation';
import CategoryPageView, { categoryMetadata, categoryProducts } from '@/components/CategoryPageView';
import { activeCategorySlugs } from '@/lib/catalog';

// Solo categorías con productos: una categoría vacía no se genera (404 real en hosting),
// en lugar de responder 200 con "Categoría no encontrada" (soft-404).
export async function generateStaticParams() {
  return activeCategorySlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  if (categoryProducts(params.slug).length === 0) return { title: 'Categoría no encontrada', robots: { index: false } };
  return categoryMetadata(params.slug, 1);
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  if (categoryProducts(params.slug).length === 0) notFound();
  return <CategoryPageView slug={params.slug} page={1} />;
}
