import Image from 'next/image';
import Link from 'next/link';

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
  imagen_url: string;
}

interface CategoryShowcaseProps {
  category: Category;
  products: Product[];
  priority?: boolean;
}

export default function CategoryShowcase({ category, products, priority = false }: CategoryShowcaseProps) {
  if (products.length === 0) return null;

  const headingId = `categoria-${category.slug}-title`;

  return (
    <section aria-labelledby={headingId} className="w-full max-w-[120rem] mx-auto px-5 sm:px-8 lg:px-[5rem] py-8 md:py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 md:mb-8">
        <div className="max-w-[55ch]">
          <h2 id={headingId} className="h3-card text-navy-900">
            {category.name}
          </h2>
          <p className="text-navy-900/60 text-sm mt-1.5">{category.description}</p>
        </div>
        <Link
          href={`/tienda/categoria/${category.slug}/`}
          className="shrink-0 inline-flex items-center gap-2 text-navy-900 font-semibold text-sm hover:text-brand transition-colors"
        >
          Ver todo {category.name}
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {products.map((product, i) => (
          <Link
            key={product.id}
            href={`/tienda/${product.slug}/`}
            className="group relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-50 transition-all duration-300"
          >
            <div className="relative aspect-square bg-white">
              <Image
                src={product.imagen_url}
                alt={product.nombre}
                fill
                sizes="(max-width: 640px) 46vw, (max-width: 1024px) 22vw, 15vw"
                loading={priority && i < 2 ? undefined : 'lazy'}
                priority={priority && i < 2}
                className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
            <div className="p-3">
              <h3 className="text-xs sm:text-sm font-semibold text-navy-900 line-clamp-2 min-h-[2.2rem] group-hover:text-brand transition-colors">
                {product.nombre}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
