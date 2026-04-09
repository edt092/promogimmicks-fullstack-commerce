'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Printer, Megaphone, Plane, CheckCircle2, ClipboardList, Palette, Package, Truck } from 'lucide-react';

const servicios = [
  {
    icon: Printer,
    title: 'Impresión y Personalización',
    description:
      'Serigrafía, tampografía, impresión digital full color, grabado láser, bordado y sublimación. Aplicamos la técnica correcta según el material y el diseño para garantizar la máxima calidad en cada artículo.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Megaphone,
    title: 'Merchandising B2B',
    description:
      'Atendemos a empresas, departamentos de marketing y recursos humanos. Desde kits de bienvenida para empleados hasta campañas masivas de fidelización. Pedidos desde 50 hasta 10.000+ unidades con precios escalonados.',
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
  },
  {
    icon: Plane,
    title: 'Importación Directa',
    description:
      'Importamos desde fabricantes en Asia, Europa y América, eliminando intermediarios. Acceso a productos exclusivos, muestras físicas antes de producción masiva y opciones a medida: colores Pantone, empaque personalizado, MOQ especial.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
];

const tecnicas = [
  { nombre: 'Serigrafía', descripcion: 'Para grandes volúmenes en superficies planas. Alta durabilidad en plástico, metal y tela.' },
  { nombre: 'Tampografía', descripcion: 'Ideal para superficies curvas o irregulares: bolígrafos, llaveros y artículos pequeños.' },
  { nombre: 'Impresión Digital', descripcion: 'Reproduce degradados y fotografías sin límite de colores. Sin mínimos de producción.' },
  { nombre: 'Bordado', descripcion: 'Para prendas y gorras. Acabado premium de larga duración que eleva la percepción de marca.' },
  { nombre: 'Grabado Láser', descripcion: 'Permanente e inoxidable en metal, madera y cuero. Resultado elegante que nunca desaparece.' },
  { nombre: 'Sublimación', descripcion: 'Integra el diseño a nivel molecular en textiles y polímeros. Colores vivos y resistentes al lavado.' },
];

const proceso = [
  { icon: ClipboardList, paso: '01', titulo: 'Cotización en 24 h', descripcion: 'Cuéntanos tu proyecto por WhatsApp o correo. Recibe propuesta detallada con precios, plazos y opciones de personalización.' },
  { icon: Palette, paso: '02', titulo: 'Arte y muestra virtual', descripcion: 'Nuestro equipo de diseño aplica tu logo al producto y te envía prueba digital para aprobación antes de producir.' },
  { icon: Package, paso: '03', titulo: 'Producción con seguimiento', descripcion: 'Iniciamos producción con actualizaciones de estado en cada etapa. Control de calidad riguroso antes del despacho.' },
  { icon: Truck, paso: '04', titulo: 'Entrega en Ecuador y Colombia', descripcion: 'Enviamos con embalaje seguro y documentación completa. Cobertura en todas las ciudades principales de ambos países.' },
];

export default function Servicios() {
  return (
    <section id="servicios" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Soluciones integrales de merchandising y productos promocionales para empresas en Ecuador y Colombia.
            Desde la idea hasta la entrega, gestionamos todo el proceso.
          </p>
        </motion.div>

        {/* Cards de servicio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {servicios.map((servicio, index) => {
            const Icon = servicio.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 border border-gray-100"
              >
                <div
                  className={`${servicio.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`${servicio.color}`} size={32} />
                </div>

                <p className="text-2xl font-bold text-blue-900 mb-4 group-hover:text-sky-500 transition-colors duration-300">
                  {servicio.title}
                </p>

                <p className="text-gray-700 leading-relaxed">
                  {servicio.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Técnicas de personalización */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">
              Técnicas de personalización disponibles
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Aplicamos la técnica correcta según el material, el volumen y el presupuesto de cada pedido.
              Todos los artículos pasan por control de calidad antes del despacho.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tecnicas.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4 bg-slate-50 rounded-xl p-5 border border-slate-100"
              >
                <CheckCircle2 className="text-sky-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-bold text-blue-900 mb-1">{t.nombre}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{t.descripcion}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Proceso B2B */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-3xl p-8 md:p-12"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Proceso simple, resultados profesionales
            </h2>
            <p className="text-blue-200 max-w-2xl mx-auto">
              Trabajamos principalmente con empresas medianas y grandes que buscan artículos promocionales
              para marketing, ventas, recursos humanos y eventos corporativos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {proceso.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 bg-sky-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-sky-400" size={28} />
                  </div>
                  <p className="text-sky-400 text-xs font-bold tracking-widest mb-1">PASO {p.paso}</p>
                  <p className="text-white font-bold text-lg mb-2">{p.titulo}</p>
                  <p className="text-blue-200 text-sm leading-relaxed">{p.descripcion}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="border-t border-white/20 pt-8">
            <p className="text-blue-100 text-center text-sm mb-6 max-w-3xl mx-auto">
              Manejamos pedidos desde <strong className="text-white">50 unidades</strong> hasta producciones de{' '}
              <strong className="text-white">10.000+ artículos</strong>. Los precios mejoran con el volumen.
              Atendemos casos urgentes con servicio express. Solicita cotización hoy mismo — respuesta garantizada en menos de 24 horas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contacto"
                className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Solicitar cotización gratuita
              </Link>
              <Link
                href="/tienda"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl border border-white/30 transition-all duration-300"
              >
                Ver catálogo completo
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
