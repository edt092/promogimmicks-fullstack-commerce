import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Página no encontrada | PromoGimmicks',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const categories = [
    { name: 'Bolígrafos', slug: 'boligrafos' },
    { name: 'Maletines y Morrales', slug: 'maletines-y-morrales' },
    { name: 'Mugs y Termos', slug: 'mugs-termos' },
    { name: 'Libretas', slug: 'libretas' },
    { name: 'Tecnología', slug: 'tecnologia' },
    { name: 'Botilitos', slug: 'botilitos' },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Este producto ya no está disponible
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Es posible que el producto haya sido actualizado o descontinuado.
          Explora nuestro catálogo completo para encontrar lo que necesitas.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/tienda/"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Ver todos los productos
          </Link>
          <Link
            href="/"
            className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Ir al inicio
          </Link>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
            Explorar por categoría
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/tienda/categoria/${cat.slug}/`}
                className="bg-white border border-gray-200 hover:border-yellow-400 text-gray-700 text-sm px-4 py-2 rounded-full transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
