'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, CheckCircle, Globe } from 'lucide-react';

const paises = [
  {
    nombre: 'Ecuador',
    bandera: '🇪🇨',
    moneda: 'USD',
    ciudades: ['Quito', 'Guayaquil', 'Cuenca', 'Manta'],
    beneficios: ['Cobertura nacional', 'Soporte local', 'Envíos a todo el país', 'Atención personalizada'],
  },
  {
    nombre: 'Colombia',
    bandera: '🇨🇴',
    moneda: 'COP',
    ciudades: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla'],
    beneficios: ['Cobertura nacional', 'Soporte local', 'Envíos a todo el país', 'Atención personalizada'],
  },
];

export default function Cobertura() {
  return (
    <section className="py-12 md:py-20 bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-5">
            <Globe size={14} />
            Cobertura Internacional
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3 md:mb-4 tracking-tight leading-tight">
            Servimos a empresas en<br/>
            <span className="text-sky-400">Ecuador y Colombia</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Tu aliado estratégico en productos promocionales y artículos publicitarios
            personalizados con presencia real en ambos países.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
          {paises.map((pais, index) => (
            <motion.div
              key={pais.nombre}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-white/10 hover:border-sky-500/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">{pais.bandera}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{pais.nombre}</h3>
                  <div className="flex items-start gap-1.5 text-sky-400 text-xs mt-0.5">
                    <MapPin size={13} className="flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{pais.ciudades.join(' · ')}</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-2.5 mb-6">
                {pais.beneficios.map((beneficio, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle className="text-sky-400 flex-shrink-0" size={16} />
                    {beneficio}
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-white/10">
                <span className="text-xs text-slate-500 uppercase tracking-widest">Moneda</span>
                <p className="text-white font-semibold mt-1">{pais.moneda}</p>
              </div>
            </motion.div>
          ))}
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
