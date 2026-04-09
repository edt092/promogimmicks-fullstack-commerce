'use client';

import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  descripcion_corta: string;
  imagen_url: string;
  codigo?: string | null;
}

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) { setIsInView(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect(); } },
      { rootMargin: '200px', threshold: 0.01 }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  const handleCotizar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const mensaje = `Hola! Me interesa cotizar el producto: ${product.nombre}`;
    window.open(`https://wa.me/593998594123?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <Link
      href={`/tienda/${product.slug}`}
      className="bg-white rounded-2xl overflow-hidden group block border border-slate-100 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-50 transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Image area */}
      <div ref={imgRef} className="relative h-44 sm:h-48 bg-slate-50 overflow-hidden">
        {!isLoaded && isInView && (
          <div className="absolute inset-0 bg-slate-100 animate-pulse" />
        )}
        {isInView && (
          <img
            src={imageError ? "/img/placeholder-producto.svg" : product.imagen_url}
            alt={product.nombre}
            loading={priority ? "eager" : "lazy"}
            onError={() => setImageError(true)}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        {/* Category badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="bg-blue-900/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            {product.categoria}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-1.5 line-clamp-2 min-h-[2.5rem] group-hover:text-sky-700 transition-colors">
          {product.nombre}
        </h3>
        <p className="text-slate-500 text-xs mb-4 line-clamp-2 min-h-[2rem]">
          {product.descripcion_corta}
        </p>

        <div className="space-y-2">
          <div className="bg-blue-900 group-hover:bg-sky-600 text-white px-3 py-2 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors duration-300">
            <Eye size={13} />
            Ver detalles
          </div>
          <button
            onClick={handleCotizar}
            className="w-full bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-3 py-2 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShoppingCart size={13} />
            Cotizar
          </button>
        </div>
      </div>
    </Link>
  );
}
