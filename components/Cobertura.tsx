'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, CheckCircle } from 'lucide-react';

const ecuador = {
  nombre: 'Ecuador',
  bandera: '🇪🇨',
  moneda: 'USD',
  ciudades: ['Quito', 'Guayaquil', 'Cuenca', 'Manta'],
  beneficios: ['Cobertura nacional', 'Soporte local', 'Envíos a todo el país', 'Atención personalizada'],
};

export default function Cobertura() {
  return (
    <section className="py-12 md:py-20 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-5">
            <MapPin size={14} />
            Cobertura Nacional
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3 md:mb-4 tracking-tight leading-tight">
            Servimos a empresas en<br/>
            <span className="text-sky-400">todo Ecuador</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Tu aliado estratégico en productos promocionales y artículos publicitarios
            personalizados con presencia real en todo el país.
          </p>
        </motion.div>

        <div className="flex justify-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-white/10 hover:border-sky-500/30 transition-all duration-300 group max-w-sm w-full"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">{ecuador.bandera}</span>
              <div>
                <h3 className="text-xl font-bold text-white">{ecuador.nombre}</h3>
                <div className="flex items-start gap-1.5 text-sky-400 text-xs mt-0.5">
                  <MapPin size={13} className="flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{ecuador.ciudades.join(' · ')}</span>
                </div>
              </div>
            </div>

            <ul className="space-y-2.5 mb-6">
              {ecuador.beneficios.map((beneficio, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle className="text-sky-400 flex-shrink-0" size={16} />
                  {beneficio}
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-white/10">
              <span className="text-xs text-slate-500 uppercase tracking-widest">Moneda</span>
              <p className="text-white font-semibold mt-1">{ecuador.moneda}</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/#contacto"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/30"
          >
            Solicitar cotización
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
