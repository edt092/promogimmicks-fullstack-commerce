'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Calendar } from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  titulo: string;
  extracto: string;
  imagen_destacada: string;
  categoria: string;
  fecha_publicacion: string;
  tiempo_lectura: string;
  autor: string;
  tags: string[];
}

export default function BlogCard({ post }: { post: BlogPost }) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) setIsLoaded(true);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 bg-slate-100 overflow-hidden flex-shrink-0">
        {!isLoaded && <div className="absolute inset-0 bg-slate-100 animate-pulse" />}
        <img
          ref={imgRef}
          src={imageError ? "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=450&fit=crop&q=80" : post.imagen_destacada}
          alt={post.titulo}
          onError={() => setImageError(true)}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {post.categoria}
          </span>
        </div>

        {/* Read time */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 bg-white/90 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">
            <Clock size={11} />
            {post.tiempo_lectura}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-3">
          <Calendar size={12} />
          <span>{formatDate(post.fecha_publicacion)}</span>
        </div>

        <h3 className="text-base font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-sky-700 transition-colors leading-snug">
          {post.titulo}
        </h3>

        <p className="text-slate-500 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
          {post.extracto}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">{post.autor}</span>
          <span className="inline-flex items-center gap-1.5 text-sky-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
            Leer
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
