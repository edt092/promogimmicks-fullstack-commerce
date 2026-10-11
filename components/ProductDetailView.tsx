'use client';

import { useState } from 'react';
import { ArrowLeft, Tag, Share2, Check, MessageCircle, Truck, ClipboardList, Palette } from 'lucide-react';
import Link from 'next/link';
import type { Product, ProductCardData } from '@/lib/catalog';
import { whatsappUrl } from '@/lib/site';

interface ProductDetailViewProps {
  product: Product;
  /** Nombre legible de la categoría (no el slug). */
  categoryLabel: string;
  /** Relacionados calculados en el servidor (lib/catalog.ts). */
  related: ProductCardData[];
}

// Sugerencias de uso por categoría (orientativas, no especificaciones). Las antiguas
// "características destacadas" por categoría se eliminaron: afirmaban stock, UV,
// certificaciones, capacidades, tallas o packaging sin evidencia por modelo.
const categoryContent: Record<string, { tagline: string; usos: string[] }> = {
  'articulos-escritura': {
    tagline: 'artículo de escritura promocional de alto impacto',
    usos: ['Kits de bienvenida para empleados nuevos', 'Obsequios en ferias y exposiciones comerciales', 'Material institucional con logo corporativo', 'Regalos en eventos y congresos empresariales'],
  },
  'hogar': {
    tagline: 'artículo para el hogar que mantiene tu marca presente cada día',
    usos: ['Regalos de fin de año para clientes', 'Kits de bienvenida residencial', 'Premios en campañas de fidelización', 'Obsequios en activaciones de marca'],
  },
  'oficina': {
    tagline: 'artículo de oficina que eleva la imagen corporativa de tu empresa',
    usos: ['Sets ejecutivos para clientes VIP', 'Dotación corporativa para empleados', 'Kits de onboarding empresarial', 'Regalos en reuniones de negocios'],
  },
  'maletines': {
    tagline: 'bolso o maleta promocional de alta visibilidad en espacios públicos',
    usos: ['Regalos ejecutivos de alto impacto', 'Kits para viajeros frecuentes', 'Dotación para equipos de ventas', 'Obsequios en conferencias y congresos'],
  },
  'precio-bomba': {
    tagline: 'artículo promocional de excelente relación costo-impacto',
    usos: ['Distribución masiva en eventos y ferias', 'Kits de bienvenida de bajo costo', 'Premios en sorteos y dinámicas', 'Obsequios para campañas de activación'],
  },
  'ecologia': {
    tagline: 'producto ecológico que comunica los valores sustentables de tu empresa',
    usos: ['Campañas de responsabilidad ambiental', 'Regalos para empresas conscientes del medio ambiente', 'Eventos de sustentabilidad y RSE', 'Kits para programas de reciclaje'],
  },
  'mugs': {
    tagline: 'taza o termo personalizado para uso diario con máxima visibilidad de marca',
    usos: ['Obsequio corporativo de alto valor percibido', 'Kit de oficina para empleados nuevos', 'Regalo para clientes frecuentes', 'Ítem para cafeterías y espacios de trabajo'],
  },
  'tecnologia': {
    tagline: 'accesorio tecnológico que posiciona tu marca como moderna e innovadora',
    usos: ['Regalos para empresas del sector tecnológico', 'Kits de bienvenida digitales', 'Obsequios en lanzamientos de productos', 'Premios en competencias y hackathons'],
  },
  'deportes': {
    tagline: 'artículo deportivo que acompaña a tus clientes en su vida activa',
    usos: ['Patrocinio de eventos deportivos corporativos', 'Kits para equipos deportivos de empresa', 'Regalos para programas de bienestar laboral', 'Obsequios en maratones y torneos'],
  },
  'herramientas': {
    tagline: 'set de herramientas que mantiene tu marca en las manos de tus clientes',
    usos: ['Regalos para clientes del sector construcción', 'Kits de mantenimiento para flotas corporativas', 'Obsequios prácticos para el hogar', 'Premios en rifas y sorteos empresariales'],
  },
  'bar-y-vino': {
    tagline: 'accesorio para bar o vino perfecto para eventos de networking y relaciones públicas',
    usos: ['Regalos de fin de año de alto impacto', 'Sets para eventos de cata y maridaje', 'Obsequios VIP para clientes premium', 'Kits para eventos y cenas de empresa'],
  },
  'variedades': {
    tagline: 'artículo promocional versátil para diferentes ocasiones y públicos',
    usos: ['Distribución en eventos masivos y ferias', 'Kits de temporada navideña o especial', 'Obsequios para campañas especiales de marca', 'Premios y reconocimientos corporativos'],
  },
  'infantil': {
    tagline: 'artículo infantil ideal para actividades con familias y niños',
    usos: ['Eventos familiares de marca corporativa', 'Kits para ferias escolares y educativas', 'Obsequios en campañas de salud pública', 'Actividades de responsabilidad social empresarial'],
  },
  'llaveros': {
    tagline: 'llavero personalizado con altísima frecuencia de uso y visibilidad diaria',
    usos: ['Distribución masiva en eventos y ferias', 'Souvenirs y recordatorios de marca', 'Kits de bienvenida para empleados', 'Obsequios en puntos de venta'],
  },
  'econature': {
    tagline: 'producto EcoNature fabricado con materiales naturales y sostenibles',
    usos: ['Campañas de conciencia ambiental', 'Ferias y eventos de sustentabilidad', 'Regalos para empresas con política verde', 'Actividades de RSE corporativa'],
  },
  'paraguas': {
    tagline: 'paraguas personalizado que lleva tu logo en cada día de lluvia',
    usos: ['Regalos corporativos para climas lluviosos', 'Distribución en ciudades y temporadas lluviosas', 'Kits ejecutivos con artículos de calidad', 'Obsequios prácticos de temporada invernal'],
  },
  'bicicleta': {
    tagline: 'accesorio para bicicleta que promueve la movilidad sostenible con tu marca',
    usos: ['Patrocinio de ciclovías y eventos urbanos', 'Regalos para programas de movilidad verde', 'Kits para empleados ciclistas', 'Obsequios en ferias de sustentabilidad'],
  },
  'cuidado-personal': {
    tagline: 'artículo de cuidado personal que refleja la calidad y cuidado de tu marca',
    usos: ['Sets de bienvenida para hoteles y spas', 'Kits de bienestar corporativo para empleados', 'Obsequios en eventos de salud y belleza', 'Regalos de temporada para clientes'],
  },
  'automovil': {
    tagline: 'accesorio automotriz con alta visibilidad dentro y fuera del vehículo',
    usos: ['Regalos para sectores automotriz y transporte', 'Kits para flotas y vehículos corporativos', 'Obsequios para clientes con vehículo', 'Souvenirs en ferias del sector automotriz'],
  },
  'medicos': {
    tagline: 'artículo médico o de salud personalizado para profesionales y pacientes',
    usos: ['Distribución en clínicas y hospitales', 'Kits de dotación para personal de salud', 'Campañas de salud pública y preventiva', 'Ferias y congresos del sector salud'],
  },
  'antiestres': {
    tagline: 'artículo antiestrés que crea experiencias positivas y memorables con tu marca',
    usos: ['Distribución en entornos de alta presión laboral', 'Kits de bienestar para empleados', 'Actividades de relajación en ferias y eventos', 'Obsequios en programas de salud mental'],
  },
  'iluminacion': {
    tagline: 'artículo de iluminación que hace brillar tu marca en cualquier situación',
    usos: ['Kits de seguridad corporativa', 'Obsequios en eventos nocturnos o al aire libre', 'Distribución en zonas con poca iluminación', 'Premios en actividades deportivas de exterior'],
  },
  'juegos': {
    tagline: 'juego y entretenimiento que genera momentos positivos con tu marca',
    usos: ['Actividades de team building corporativo', 'Kits para eventos familiares de empresa', 'Premios en competencias y rifas empresariales', 'Distribución en ferias y activaciones de marca'],
  },
  'produccion-nacional': {
    tagline: 'producto de la línea Producción Nacional del catálogo',
    usos: ['Regalos con identidad local', 'Kits para eventos y ferias', 'Campañas de temporada', 'Obsequios corporativos'],
  },
  'reflectivos': {
    tagline: 'artículo reflectivo que maximiza la seguridad y la visibilidad de tu marca',
    usos: ['Kits de seguridad vial corporativa', 'Distribución en obras y zonas de construcción', 'Programas de prevención de accidentes laborales', 'Ferias del sector seguridad industrial'],
  },
  'memorias-usb': {
    tagline: 'memoria USB personalizada que lleva tus datos y tu marca a todas partes',
    usos: ['Entrega de materiales digitales en conferencias', 'Kits de presentación digital para clientes', 'Obsequio ejecutivo de alto valor percibido', 'Distribución de catálogos y portfolios digitales'],
  },
  'antimicrobianos': {
    tagline: 'artículo de la línea antimicrobianos para campañas de higiene y bienestar',
    usos: ['Kits de higiene corporativa y bienestar', 'Distribución en entornos de salud', 'Programas de bienestar para empleados', 'Ferias del sector salud y farmacéutico'],
  },
  'master-line': {
    tagline: 'artículo de la línea Master Line para regalos ejecutivos',
    usos: ['Regalos VIP para clientes estratégicos', 'Sets ejecutivos de alta gama', 'Obsequios en eventos exclusivos de empresa', 'Reconocimientos corporativos de alto nivel'],
  },
  'golf': {
    tagline: 'accesorio de golf personalizado para el cliente empresarial de alto perfil',
    usos: ['Torneos corporativos de golf y networking', 'Obsequios para ejecutivos y directivos', 'Patrocinio de eventos de golf empresarial', 'Regalos premium para relaciones públicas'],
  },
  'calculadoras': {
    tagline: 'calculadora personalizada útil en oficinas, bancos y universidades',
    usos: ['Regalos para instituciones financieras y bancarias', 'Kits escolares y universitarios', 'Obsequios para profesionales contables y auditores', 'Material de oficina con logo corporativo'],
  },
  'relojes': {
    tagline: 'reloj personalizado que recuerda a tus clientes el valor del tiempo y de tu marca',
    usos: ['Reconocimientos por años de servicio', 'Regalos ejecutivos de alto impacto visual', 'Sets de escritorio corporativos de lujo', 'Obsequios en eventos de aniversario empresarial'],
  },
  'confeccion': {
    tagline: 'artículo textil personalizado para uniformes y vestuario corporativo',
    usos: ['Uniformes corporativos con logo bordado', 'Regalos de temporada para todo el equipo', 'Kits para ferias, eventos y activaciones', 'Vestuario para equipos de trabajo y ventas'],
  },
  'gorras': {
    tagline: 'gorra personalizada con tu logo para máxima visibilidad al aire libre',
    usos: ['Eventos outdoor y actividades al aire libre', 'Uniformes para equipos de campo y ventas', 'Obsequios en torneos deportivos y competencias', 'Distribución masiva en ferias y activaciones'],
  },
  'productos-2023': {
    tagline: 'artículo de edición especial con diseño y tendencias actualizadas',
    usos: ['Lanzamientos de nuevos productos y servicios', 'Ediciones especiales de temporada', 'Colecciones de aniversario de marca', 'Sets conmemorativos corporativos'],
  },
};

const defaultContent = {
  tagline: 'artículo promocional personalizado para impulsar tu marca',
  usos: ['Regalos corporativos para clientes y aliados', 'Distribución en ferias y eventos empresariales', 'Kits de bienvenida para empleados nuevos', 'Obsequios en campañas de fidelización'],
};

/** Filas de la ficha: solo se muestran valores confirmados por modelo. */
function specRows(product: Product): { label: string; value: string | null }[] {
  const list = (v?: string[] | null) => (v && v.length ? v.join(', ') : null);
  return [
    { label: 'Material', value: product.material ?? null },
    { label: 'Medidas', value: product.dimensiones ?? null },
    { label: 'Capacidad', value: product.capacidad ?? null },
    { label: 'Colores', value: list(product.colores) },
    { label: 'Técnicas de marcaje', value: list(product.tecnicas_marcaje) },
    { label: 'Área de impresión', value: product.area_impresion ?? null },
    { label: 'Cantidad mínima', value: product.cantidad_minima ? `${product.cantidad_minima} unidades` : null },
    { label: 'Producción', value: product.plazo_produccion_dias ? `${product.plazo_produccion_dias} días tras aprobar el arte` : null },
  ];
}

export default function ProductDetailView({ product, categoryLabel, related }: ProductDetailViewProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const content = categoryContent[product.categoria_slug] ?? defaultContent;
  const rows = specRows(product);
  const confirmed = rows.filter((r) => r.value);
  const pending = rows.filter((r) => !r.value).map((r) => r.label.toLowerCase());

  const quoteMessage = `Hola! Me interesa cotizar el producto: ${product.nombre}\n\nCategoría: ${categoryLabel}${product.sku ? `\nSKU: ${product.sku}` : ''}\n\n¿Podrían enviarme información sobre precios, cantidades mínimas y opciones de personalización?`;
  const quoteHref = whatsappUrl(quoteMessage);

  const handleShare = async () => {
    const shareData = {
      title: product.nombre,
      text: product.descripcion_corta,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <nav className="mb-6 md:mb-8" aria-label="Ruta de navegación">
        <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-blue-900 transition-colors py-2">Inicio</Link>
          <span>/</span>
          <Link href="/tienda/" className="hover:text-blue-900 transition-colors py-2">Tienda</Link>
          <span>/</span>
          <Link href={`/tienda/categoria/${product.categoria_slug}/`} className="hover:text-blue-900 transition-colors py-2">{categoryLabel}</Link>
          <span>/</span>
          <span className="text-blue-900 font-medium truncate max-w-[200px]">{product.nombre}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 relative overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
            )}
            <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-xl">
              {/* Imagen principal (candidata a LCP): carga inmediata con prioridad alta. */}
              <img
                src={product.imagen_url}
                alt={`${product.nombre} personalizado con logo`}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onLoad={() => setImageLoaded(true)}
                ref={(el) => { if (el?.complete) setImageLoaded(true); }}
                className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
          </div>

          {(product.sku || product.codigo) && (
            <div className="text-center text-sm text-gray-500">
              SKU: <span className="font-medium text-gray-700">{product.sku ?? product.codigo}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-4">
            <Link
              href={`/tienda/categoria/${product.categoria_slug}/`}
              className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-blue-200 transition-colors"
            >
              <Tag size={14} />
              {categoryLabel}
            </Link>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 mb-4 leading-tight">
            {product.nombre}
          </h1>

          <div className="mb-6">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              {product.descripcion_corta}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <a
              href={quoteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <MessageCircle size={22} />
              Solicitar Cotización por WhatsApp
            </a>

            <button
              type="button"
              onClick={handleShare}
              className="w-full bg-white hover:bg-gray-50 text-blue-900 px-6 py-3.5 rounded-xl font-semibold border-2 border-blue-200 hover:border-blue-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Share2 size={18} />
              {copied ? '¡Enlace copiado!' : 'Compartir Producto'}
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 md:p-6 mb-6 border border-blue-100">
            <h2 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-base">
              <ClipboardList className="text-blue-900" size={20} />
              Ficha del modelo
            </h2>
            {confirmed.length > 0 && (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-3 text-sm">
                {confirmed.map((r) => (
                  <div key={r.label} className="flex gap-2">
                    <dt className="font-semibold text-blue-900">{r.label}:</dt>
                    <dd className="text-gray-700">{r.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {pending.length > 0 && (
              <p className="text-sm text-gray-700 leading-relaxed">
                Confirmamos {pending.join(', ')} al cotizar, según el modelo, la cantidad y tu arte.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-gray-200">
            {[
              { icon: MessageCircle, title: 'Cotización', desc: 'Por WhatsApp' },
              { icon: Palette, title: 'Personalización', desc: 'Con el logo de tu empresa' },
              { icon: Truck, title: 'Entregas en Ecuador', desc: 'Según ciudad y pedido' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <item.icon className="text-blue-900 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-blue-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 md:mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-3">
          {product.nombre}: {content.tagline}
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          El <strong>{product.nombre}</strong> es un {content.tagline} que puedes personalizar con el logo e identidad de tu empresa.
          Cotiza desde cualquier ciudad de Ecuador: te confirmamos técnica de marcaje, cantidades y plazo de producción para tu pedido.
        </p>

        <div>
          <h3 className="font-bold text-blue-900 mb-4 text-lg">Ideas de uso</h3>
          <ul className="grid sm:grid-cols-2 gap-2">
            {content.usos.map((uso, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <Check className="text-amber-500 flex-shrink-0 mt-1" size={16} />
                <span>{uso}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            ¿Necesitas el <strong>{product.nombre}</strong> en grandes cantidades?
            Cotiza directamente por WhatsApp y recibe atención personalizada de nuestro equipo.
            Ver más <Link href={`/tienda/categoria/${product.categoria_slug}/`} className="text-blue-900 hover:text-amber-500 font-medium transition-colors">artículos de {categoryLabel}</Link>.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12 md:mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-blue-900">
              Productos relacionados en {categoryLabel}
            </h2>
            <Link
              href={`/tienda/categoria/${product.categoria_slug}/`}
              className="text-blue-900 hover:text-amber-500 font-medium text-sm flex items-center gap-1 transition-colors px-2 py-3"
            >
              Ver todos
              <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((relProduct) => (
              <Link
                key={relProduct.id}
                href={`/tienda/${relProduct.slug}/`}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-200"
              >
                <div className="aspect-square bg-gray-50 p-4">
                  <img
                    src={relProduct.imagen_url}
                    alt={relProduct.nombre}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-blue-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {relProduct.nombre}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/tienda/"
          className="inline-flex items-center text-blue-900 hover:text-amber-500 transition-colors font-medium py-3"
        >
          <ArrowLeft size={18} className="mr-2" />
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
