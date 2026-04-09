'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const viralProducts = [
  '/img/imagenes-productos-virales/producto_1.jpg',
  '/img/imagenes-productos-virales/producto_2.png',
  '/img/imagenes-productos-virales/producto_3.jpg',
  '/img/imagenes-productos-virales/producto_4.jpg',
  '/img/imagenes-productos-virales/producto_5.jpg',
  '/img/imagenes-productos-virales/producto_6.jpg',
  '/img/imagenes-productos-virales/producto_7.jpg',
  '/img/imagenes-productos-virales/producto_8.jpg',
  '/img/imagenes-productos-virales/producto_9.jpg',
];

export default function ProductosVirales() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === viralProducts.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToNext = () => setCurrentIndex((prev) => (prev === viralProducts.length - 1 ? 0 : prev + 1));
  const goToPrev = () => setCurrentIndex((prev) => (prev === 0 ? viralProducts.length - 1 : prev - 1));

  return (
    <section id="productos-virales" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-sky-500 mb-4">
              Temporada 2025
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              Productos virales<br/>
              <span className="text-sky-500">que generan impacto</span>
            </h2>
            <p className="text-slate-600 text-lg mb-5 leading-relaxed">
              Desde gadgets tecnológicos hasta artículos eco-friendly — seleccionamos
              los productos más virales del momento para que tu marca destaque.
            </p>
            <p className="text-slate-500 text-base mb-8 leading-relaxed">
              Cada artículo es elegido por su innovación, calidad de personalización
              y potencial de impacto en el mercado corporativo.
            </p>
            <Link
              href="/#contacto"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-7 py-3.5 rounded-full transition-all duration-300 shadow-md shadow-sky-200 hover:shadow-sky-300 group"
            >
              Consultar disponibilidad
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Slider */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[420px] w-full rounded-3xl overflow-hidden bg-slate-50 shadow-2xl">
              {viralProducts.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                  <Image src={image} alt={`Producto viral ${index + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              ))}
            </div>

            {/* Controls */}
            <button onClick={goToPrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 p-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110" aria-label="Anterior">
              <ChevronLeft className="text-slate-700" size={20} />
            </button>
            <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 p-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110" aria-label="Siguiente">
              <ChevronRight className="text-slate-700" size={20} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {viralProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-sky-500 w-6' : 'bg-white/60 w-1.5'}`}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
