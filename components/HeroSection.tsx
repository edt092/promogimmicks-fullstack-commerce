'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="inicio" className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/img/hero-poster.jpg"
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay — dark + brand blue */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-blue-950/80 to-blue-900/70" />
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content — starts below navbar (pt-16) and centers in remaining space */}
      <div className="absolute inset-0 z-10 flex flex-col pt-16">
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center pb-4 sm:pb-8">

        {/* Label badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3 sm:mb-8"
        >
          <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
          Ecuador &amp; Colombia
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.05] tracking-tight mb-3 sm:mb-6 max-w-5xl"
        >
          Impulsa tu marca
          <span className="block text-sky-400"> con productos</span>
          <span className="block">que impactan.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-5 sm:mb-10 leading-relaxed"
        >
          Merchandising, artículos promocionales e importación directa.
          Personalización garantizada para empresas en Ecuador y Colombia.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link
            href="/tienda/"
            className="group inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-full transition-all duration-300 shadow-lg shadow-sky-500/30 hover:shadow-sky-400/40 hover:shadow-xl"
          >
            Ver catálogo
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/#contacto"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
          >
            Cotizar proyecto
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex justify-center gap-8 sm:gap-16 mt-6 sm:mt-14"
        >
          {[
            { value: '+1,000', label: 'Productos' },
            { value: '+500', label: 'Clientes' },
            { value: '2', label: 'Países' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl sm:text-3xl font-extrabold text-white">{stat.value}</p>
              <p className="text-xs text-white/50 uppercase tracking-widest mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/30"
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
