import categoriesData from '@/data/categories.json';
import productsDataRaw from '@/data/products.json';
import CategoryShowcase from './CategoryShowcase';

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
}

interface Product {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  categoria_slug: string;
  imagen_url: string;
}

const productsData = productsDataRaw as Product[];
const categories = categoriesData as Category[];

// Categorías con mayor volumen de catálogo y relevancia comercial.
const SHOWCASE_CATEGORY_SLUGS = [
  'articulos-escritura',
  'hogar',
  'oficina',
  'maletines',
  'tecnologia',
  'tomatodos-y-botilitos-personalizados',
  'mugs',
  'ecologia',
];

const SHOWCASES = SHOWCASE_CATEGORY_SLUGS
  .map((slug) => {
    const category = categories.find((c) => c.slug === slug);
    if (!category) return null;
    const products = productsData.filter((p) => p.categoria_slug === slug).slice(0, 4);
    return { category, products };
  })
  .filter((entry): entry is { category: Category; products: Product[] } => Boolean(entry));

export default function CatalogoPorCategoria() {
  return (
    <section aria-labelledby="catalogo-title" className="bg-white text-navy-900 pb-8 md:pb-12">
      <div className="w-full max-w-[120rem] mx-auto px-5 sm:px-8 lg:px-[5rem] pt-4 pb-2">
        <h2 id="catalogo-title" className="sr-only">
          Catálogo de artículos promocionales por categoría
        </h2>
      </div>
      {SHOWCASES.map(({ category, products }, i) => (
        <CategoryShowcase key={category.id} category={category} products={products} priority={i === 0} />
      ))}
    </section>
  );
}
