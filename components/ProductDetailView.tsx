'use client';

import { useState } from 'react';
import { ArrowLeft, Tag, Share2, Check, MessageCircle, Truck, Award, Shield } from 'lucide-react';
import Link from 'next/link';
import productsData from '../data/products.json';

interface Product {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  categoria_slug: string;
  descripcion_corta: string;
  imagen_url: string;
  codigo?: string | null;
}

interface ProductDetailViewProps {
  product: Product;
}

const categoryContent: Record<string, { tagline: string; usos: string[]; atributos: string[] }> = {
  'articulos-escritura': {
    tagline: 'artículo de escritura promocional de alto impacto',
    usos: ['Kits de bienvenida para empleados nuevos', 'Obsequios en ferias y exposiciones comerciales', 'Material institucional con logo corporativo', 'Regalos en eventos y congresos empresariales'],
    atributos: ['Personalización con logo en impresión full color', 'Disponible en múltiples colores corporativos', 'Mínimos de producción accesibles', 'Alta durabilidad para uso diario en oficina'],
  },
  'hogar': {
    tagline: 'artículo para el hogar que mantiene tu marca presente cada día',
    usos: ['Regalos de fin de año para clientes', 'Kits de bienvenida residencial', 'Premios en campañas de fidelización', 'Obsequios en activaciones de marca'],
    atributos: ['Materiales de alta calidad', 'Espacio amplio para impresión de logo', 'Uso práctico diario en el hogar', 'Packaging especial disponible'],
  },
  'oficina': {
    tagline: 'artículo de oficina que eleva la imagen corporativa de tu empresa',
    usos: ['Sets ejecutivos para clientes VIP', 'Dotación corporativa para empleados', 'Kits de onboarding empresarial', 'Regalos en reuniones de negocios'],
    atributos: ['Diseño elegante para ambiente ejecutivo', 'Personalización con logo y nombre corporativo', 'Materiales premium de larga duración', 'Ideal para ambientes corporativos formales'],
  },
  'maletines': {
    tagline: 'bolso o maleta promocional de alta visibilidad en espacios públicos',
    usos: ['Regalos ejecutivos de alto impacto', 'Kits para viajeros frecuentes', 'Dotación para equipos de ventas', 'Obsequios en conferencias y congresos'],
    atributos: ['Amplio espacio para impresión de logo', 'Materiales resistentes al uso diario', 'Diseño funcional con múltiples compartimentos', 'Alta visibilidad de marca en espacios públicos'],
  },
  'precio-bomba': {
    tagline: 'artículo promocional de excelente relación costo-impacto',
    usos: ['Distribución masiva en eventos y ferias', 'Kits de bienvenida de bajo costo', 'Premios en sorteos y dinámicas', 'Obsequios para campañas de activación'],
    atributos: ['Precio competitivo para grandes volúmenes', 'Personalización básica con logo', 'Disponibilidad inmediata en stock', 'Ideal para distribución masiva en Ecuador y Colombia'],
  },
  'ecologia': {
    tagline: 'producto ecológico que comunica los valores sustentables de tu empresa',
    usos: ['Campañas de responsabilidad ambiental', 'Regalos para empresas conscientes del medio ambiente', 'Eventos de sustentabilidad y RSE', 'Kits para programas de reciclaje'],
    atributos: ['Materiales reciclados o biodegradables', 'Fabricación con impacto ambiental reducido', 'Mensaje de sustentabilidad integrado', 'Ideal para empresas con política verde y RSE'],
  },
  'mugs': {
    tagline: 'taza o termo personalizado para uso diario con máxima visibilidad de marca',
    usos: ['Obsequio corporativo de alto valor percibido', 'Kit de oficina para empleados nuevos', 'Regalo para clientes frecuentes', 'Ítem para cafeterías y espacios de trabajo'],
    atributos: ['Personalización con logo en impresión duradera', 'Capacidades variadas de 300ml a 500ml', 'Materiales seguros y certificados', 'Alta retención de temperatura en modelos termo'],
  },
  'tecnologia': {
    tagline: 'accesorio tecnológico que posiciona tu marca como moderna e innovadora',
    usos: ['Regalos para empresas del sector tecnológico', 'Kits de bienvenida digitales', 'Obsequios en lanzamientos de productos', 'Premios en competencias y hackathons'],
    atributos: ['Compatible con dispositivos Android e iOS', 'Personalización con logo en área de alta visibilidad', 'Materiales de calidad premium', 'Diseño moderno y funcional para profesionales'],
  },
  'deportes': {
    tagline: 'artículo deportivo que acompaña a tus clientes en su vida activa',
    usos: ['Patrocinio de eventos deportivos corporativos', 'Kits para equipos deportivos de empresa', 'Regalos para programas de bienestar laboral', 'Obsequios en maratones y torneos'],
    atributos: ['Materiales resistentes a la actividad física', 'Espacio para logo en zona de alta visibilidad', 'Diseño ergonómico y funcional', 'Ideal para actividades outdoor e indoor'],
  },
  'herramientas': {
    tagline: 'set de herramientas que mantiene tu marca en las manos de tus clientes',
    usos: ['Regalos para clientes del sector construcción', 'Kits de mantenimiento para flotas corporativas', 'Obsequios prácticos para el hogar', 'Premios en rifas y sorteos empresariales'],
    atributos: ['Set completo con herramientas esenciales', 'Materiales durables de acero o aleaciones', 'Estuche o case de almacenamiento incluido', 'Personalización con grabado láser disponible'],
  },
  'bar-y-vino': {
    tagline: 'accesorio para bar o vino perfecto para eventos de networking y relaciones públicas',
    usos: ['Regalos de fin de año de alto impacto', 'Sets para eventos de cata y maridaje', 'Obsequios VIP para clientes premium', 'Kits para eventos y cenas de empresa'],
    atributos: ['Presentación elegante en estuche o caja', 'Personalizable con logo grabado o impreso', 'Materiales premium: acero, madera o cuero', 'Alta percepción de valor en el destinatario'],
  },
  'variedades': {
    tagline: 'artículo promocional versátil para diferentes ocasiones y públicos',
    usos: ['Distribución en eventos masivos y ferias', 'Kits de temporada navideña o especial', 'Obsequios para campañas especiales de marca', 'Premios y reconocimientos corporativos'],
    atributos: ['Gran variedad de opciones de personalización', 'Disponible en múltiples colores', 'Precio accesible para volúmenes medios', 'Entrega rápida en Ecuador y Colombia'],
  },
  'infantil': {
    tagline: 'artículo infantil ideal para actividades con familias y niños',
    usos: ['Eventos familiares de marca corporativa', 'Kits para ferias escolares y educativas', 'Obsequios en campañas de salud pública', 'Actividades de responsabilidad social empresarial'],
    atributos: ['Materiales seguros sin BPA ni sustancias tóxicas', 'Diseños atractivos y coloridos para niños', 'Tamaños adaptados a las diferentes edades', 'Fácil personalización con logo corporativo'],
  },
  'llaveros': {
    tagline: 'llavero personalizado con altísima frecuencia de uso y visibilidad diaria',
    usos: ['Distribución masiva en eventos y ferias', 'Souvenirs y recordatorios de marca', 'Kits de bienvenida para empleados', 'Obsequios en puntos de venta'],
    atributos: ['Tamaño compacto y práctico para uso diario', 'Personalización con impresión o grabado', 'Múltiples materiales: metal, PVC, cuero', 'Máximo impacto visual por alta frecuencia de uso'],
  },
  'econature': {
    tagline: 'producto EcoNature fabricado con materiales naturales y sostenibles',
    usos: ['Campañas de conciencia ambiental', 'Ferias y eventos de sustentabilidad', 'Regalos para empresas con política verde', 'Actividades de RSE corporativa'],
    atributos: ['Materiales naturales: bambú, cork o semillas', 'Proceso de fabricación sostenible', 'Comunica valores ecológicos de la empresa', 'Ideal para marcas comprometidas con el medio ambiente'],
  },
  'paraguas': {
    tagline: 'paraguas personalizado que lleva tu logo en cada día de lluvia',
    usos: ['Regalos corporativos para climas lluviosos', 'Distribución en Quito, Bogotá y zonas lluviosas', 'Kits ejecutivos con artículos de calidad', 'Obsequios prácticos de temporada invernal'],
    atributos: ['Cubierta impermeable con impresión full color', 'Estructura resistente al viento', 'Mango ergonómico para uso cómodo', 'Alta visibilidad en calles y espacios públicos'],
  },
  'bicicleta': {
    tagline: 'accesorio para bicicleta que promueve la movilidad sostenible con tu marca',
    usos: ['Patrocinio de ciclovías y eventos urbanos', 'Regalos para programas de movilidad verde', 'Kits para empleados ciclistas', 'Obsequios en ferias de sustentabilidad'],
    atributos: ['Compatible con la mayoría de bicicletas', 'Materiales resistentes a la intemperie', 'Personalización con logo corporativo', 'Promueve imagen de empresa saludable y ecológica'],
  },
  'cuidado-personal': {
    tagline: 'artículo de cuidado personal que refleja la calidad y cuidado de tu marca',
    usos: ['Sets de bienvenida para hoteles y spas', 'Kits de bienestar corporativo para empleados', 'Obsequios en eventos de salud y belleza', 'Regalos de temporada para clientes'],
    atributos: ['Contenidos seguros y de calidad certificada', 'Packaging premium personalizable con logo', 'Fórmulas de calidad importada o nacional', 'Ideal para kits de regalo empresarial'],
  },
  'automovil': {
    tagline: 'accesorio automotriz con alta visibilidad dentro y fuera del vehículo',
    usos: ['Regalos para sectores automotriz y transporte', 'Kits para flotas y vehículos corporativos', 'Obsequios para clientes con vehículo', 'Souvenirs en ferias del sector automotriz'],
    atributos: ['Compatible con la mayoría de vehículos', 'Materiales de alta resistencia y durabilidad', 'Personalización con logo corporativo', 'Alta frecuencia de uso garantiza visibilidad constante'],
  },
  'medicos': {
    tagline: 'artículo médico o de salud personalizado para profesionales y pacientes',
    usos: ['Distribución en clínicas y hospitales', 'Kits de dotación para personal de salud', 'Campañas de salud pública y preventiva', 'Ferias y congresos del sector salud'],
    atributos: ['Materiales seguros y certificados para uso médico', 'Personalización discreta con logo institucional', 'Diseño profesional y de alta confianza', 'Cumple normativas del sector salud en Ecuador'],
  },
  'antiestres': {
    tagline: 'artículo antiestrés que crea experiencias positivas y memorables con tu marca',
    usos: ['Distribución en entornos de alta presión laboral', 'Kits de bienestar para empleados', 'Actividades de relajación en ferias y eventos', 'Obsequios en programas de salud mental'],
    atributos: ['Material suave y agradable al tacto', 'Personalizable con logo en impresión full color', 'Efecto relajante comprobado en el usuario', 'Genera impacto emocional memorable en quien lo recibe'],
  },
  'iluminacion': {
    tagline: 'artículo de iluminación que hace brillar tu marca en cualquier situación',
    usos: ['Kits de seguridad corporativa', 'Obsequios en eventos nocturnos o al aire libre', 'Distribución en zonas con poca iluminación', 'Premios en actividades deportivas de exterior'],
    atributos: ['Alta luminosidad con tecnología LED eficiente', 'Batería de larga duración o pilas incluidas', 'Personalización con logo en superficie visible', 'Funcional en situaciones cotidianas y de emergencia'],
  },
  'juegos': {
    tagline: 'juego y entretenimiento que genera momentos positivos con tu marca',
    usos: ['Actividades de team building corporativo', 'Kits para eventos familiares de empresa', 'Premios en competencias y rifas empresariales', 'Distribución en ferias y activaciones de marca'],
    atributos: ['Materiales seguros para toda la familia', 'Entretenimiento para grupos o individual', 'Fácil transporte y almacenamiento', 'Personalización con logo en tablero o piezas'],
  },
  'produccion-nacional': {
    tagline: 'producto de producción nacional con calidad ecuatoriana garantizada',
    usos: ['Apoyo a iniciativas de marca país', 'Regalos con identidad y orgullo local', 'Kits para eventos con identidad ecuatoriana', 'Obsequios que destacan lo hecho en Ecuador'],
    atributos: ['100% fabricado en Ecuador', 'Apoya la economía y empleo local', 'Diseños con identidad cultural ecuatoriana', 'Tiempos de entrega más rápidos al ser local'],
  },
  'reflectivos': {
    tagline: 'artículo reflectivo que maximiza la seguridad y la visibilidad de tu marca',
    usos: ['Kits de seguridad vial corporativa', 'Distribución en obras y zonas de construcción', 'Programas de prevención de accidentes laborales', 'Ferias del sector seguridad industrial'],
    atributos: ['Material reflectivo con alta visibilidad nocturna', 'Resistente a condiciones climáticas extremas', 'Personalización con logo en área reflectiva', 'Cumple normativas de seguridad industrial'],
  },
  'memorias-usb': {
    tagline: 'memoria USB personalizada que lleva tus datos y tu marca a todas partes',
    usos: ['Entrega de materiales digitales en conferencias', 'Kits de presentación digital para clientes', 'Obsequio ejecutivo de alto valor percibido', 'Distribución de catálogos y portfolios digitales'],
    atributos: ['Capacidades de 8GB a 64GB disponibles', 'Personalización con logo impreso o grabado', 'Compatible con USB 2.0 y 3.0', 'Material disponible en metal, plástico o madera'],
  },
  'antimicrobianos': {
    tagline: 'artículo antimicrobiano que protege a tu equipo y comunica higiene responsable',
    usos: ['Kits de higiene corporativa y bienestar', 'Distribución en entornos de salud', 'Programas de bienestar para empleados', 'Ferias del sector salud y farmacéutico'],
    atributos: ['Propiedades antimicrobianas certificadas', 'Materiales seguros para contacto frecuente', 'Personalización con logo corporativo', 'Comunica imagen de empresa comprometida con la salud'],
  },
  'master-line': {
    tagline: 'artículo de la línea Master, calidad superior para impresionar a tus mejores clientes',
    usos: ['Regalos VIP para clientes estratégicos', 'Sets ejecutivos de alta gama', 'Obsequios en eventos exclusivos de empresa', 'Reconocimientos corporativos de alto nivel'],
    atributos: ['Materiales premium de primera calidad', 'Acabados superiores de fabricación', 'Packaging de lujo incluido en el precio', 'Personalización con grabado láser o impresión premium'],
  },
  'golf': {
    tagline: 'accesorio de golf personalizado para el cliente empresarial de alto perfil',
    usos: ['Torneos corporativos de golf y networking', 'Obsequios para ejecutivos y directivos', 'Patrocinio de eventos de golf empresarial', 'Regalos premium para relaciones públicas'],
    atributos: ['Materiales de alta calidad para el deporte', 'Personalización con logo corporativo visible', 'Presentación en packaging premium incluido', 'Alto valor percibido en el segmento ejecutivo'],
  },
  'calculadoras': {
    tagline: 'calculadora personalizada útil en oficinas, bancos y universidades',
    usos: ['Regalos para instituciones financieras y bancarias', 'Kits escolares y universitarios', 'Obsequios para profesionales contables y auditores', 'Material de oficina con logo corporativo'],
    atributos: ['Funciones básicas o científicas disponibles', 'Pantalla LCD de fácil lectura', 'Personalización con logo impreso en cubierta', 'Batería solar o pilas incluidas'],
  },
  'relojes': {
    tagline: 'reloj personalizado que recuerda a tus clientes el valor del tiempo y de tu marca',
    usos: ['Reconocimientos por años de servicio', 'Regalos ejecutivos de alto impacto visual', 'Sets de escritorio corporativos de lujo', 'Obsequios en eventos de aniversario empresarial'],
    atributos: ['Mecanismo de precisión y calidad garantizada', 'Personalización con logo grabado en carátula', 'Materiales: madera, metal o plástico premium', 'Presentación en caja de regalo incluida'],
  },
  'confeccion': {
    tagline: 'artículo textil personalizado para uniformes y vestuario corporativo',
    usos: ['Uniformes corporativos con logo bordado', 'Regalos de temporada para todo el equipo', 'Kits para ferias, eventos y activaciones', 'Vestuario para equipos de trabajo y ventas'],
    atributos: ['Telas de alta calidad y durabilidad lavado tras lavado', 'Bordado o serigrafía del logo en alta definición', 'Tallas disponibles de S a XXL', 'Colores corporativos a pedido del cliente'],
  },
  'gorras': {
    tagline: 'gorra personalizada con tu logo para máxima visibilidad al aire libre',
    usos: ['Eventos outdoor y actividades al aire libre', 'Uniformes para equipos de campo y ventas', 'Obsequios en torneos deportivos y competencias', 'Distribución masiva en ferias y activaciones'],
    atributos: ['Tela resistente a rayos UV con protección solar', 'Cierre ajustable para todas las tallas', 'Bordado frontal del logo en alta definición', 'Múltiples colores disponibles a pedido'],
  },
  'productos-2023': {
    tagline: 'artículo de edición especial con diseño y tendencias actualizadas',
    usos: ['Lanzamientos de nuevos productos y servicios', 'Ediciones especiales de temporada', 'Colecciones de aniversario de marca', 'Sets conmemorativos corporativos'],
    atributos: ['Diseño actualizado con tendencias del mercado', 'Edición especial de alta percepción de valor', 'Materiales de calidad mejorada', 'Personalización premium disponible'],
  },
};

const defaultContent = {
  tagline: 'artículo promocional personalizado para impulsar tu marca',
  usos: ['Regalos corporativos para clientes y aliados', 'Distribución en ferias y eventos empresariales', 'Kits de bienvenida para empleados nuevos', 'Obsequios en campañas de fidelización'],
  atributos: ['Personalización con logo en alta calidad', 'Disponible en múltiples colores y acabados', 'Envíos a Ecuador y Colombia con entrega rápida', 'Asesoría de diseño e impresión incluida'],
};

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const relatedProducts = productsData
    .filter(p => p.categoria === product.categoria && p.id !== product.id)
    .slice(0, 4);

  const content = categoryContent[product.categoria_slug] ?? defaultContent;

  const handleCotizar = () => {
    const mensaje = `Hola! Me interesa cotizar el producto: ${product.nombre}\n\nCategoría: ${product.categoria}${product.codigo ? `\nCódigo: ${product.codigo}` : ''}\n\n¿Podrían enviarme información sobre precios, cantidades mínimas y opciones de personalización?`;
    const whatsappUrl = `https://wa.me/593998594123?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

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
      <nav className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-blue-900 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/tienda/" className="hover:text-blue-900 transition-colors">Tienda</Link>
          <span>/</span>
          <Link href={`/tienda/categoria/${product.categoria_slug}/`} className="hover:text-blue-900 transition-colors">{product.categoria}</Link>
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
              <img
                src={product.imagen_url}
                alt={product.nombre}
                onLoad={() => setImageLoaded(true)}
                className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
          </div>

          {product.codigo && (
            <div className="text-center text-sm text-gray-500">
              Código de referencia: <span className="font-medium text-gray-700">{product.codigo}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-4">
            <Link
              href={`/tienda/categoria/${product.categoria_slug}/`}
              className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-200 transition-colors"
            >
              <Tag size={14} />
              {product.categoria}
            </Link>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 mb-4 leading-tight">
            {product.nombre}
          </h1>

          <div className="mb-6 md:mb-8">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              {product.descripcion_corta}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 md:p-6 mb-6 md:mb-8 border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Check className="text-green-500" size={20} />
              Incluye personalización profesional
            </h3>
            <ul className="space-y-3">
              {[
                'Impresión de logo en alta calidad',
                'Múltiples técnicas de marcado disponibles',
                'Asesoría de diseño incluida'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <Check className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 mb-8">
            <button
              onClick={handleCotizar}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <MessageCircle size={22} />
              Solicitar Cotización por WhatsApp
            </button>

            <button
              onClick={handleShare}
              className="w-full bg-white hover:bg-gray-50 text-blue-900 px-6 py-3.5 rounded-xl font-semibold border-2 border-blue-200 hover:border-blue-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Share2 size={18} />
              {copied ? '¡Enlace copiado!' : 'Compartir Producto'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
            {[
              { icon: Award, title: 'Calidad Premium', desc: 'Materiales de primera' },
              { icon: Truck, title: 'Envío Nacional', desc: 'Ecuador y Colombia' },
              { icon: Shield, title: 'Garantía', desc: 'Satisfacción total' },
              { icon: MessageCircle, title: 'Soporte', desc: 'Asesoría personalizada' }
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
          En PromoGimmicks entregamos a Quito, Guayaquil, Cuenca, Bogotá, Medellín y Cali con tiempos de producción rápidos
          y asesoría completa para garantizar que tu marca quede perfecta en cada unidad.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-blue-900 mb-4 text-lg">Usos populares del {product.nombre}</h3>
            <ul className="space-y-2">
              {content.usos.map((uso, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <Check className="text-amber-500 flex-shrink-0 mt-1" size={16} />
                  <span>{uso}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-blue-900 mb-4 text-lg">Características destacadas</h3>
            <ul className="space-y-2">
              {content.atributos.map((attr, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <Check className="text-green-500 flex-shrink-0 mt-1" size={16} />
                  <span>{attr}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            ¿Necesitas el <strong>{product.nombre}</strong> en grandes cantidades?
            Cotiza directamente por WhatsApp y recibe atención personalizada de nuestro equipo.
            Trabajamos con empresas de todos los tamaños en <strong>Ecuador y Colombia</strong>.
            Ver más <Link href={`/tienda/categoria/${product.categoria_slug}/`} className="text-blue-900 hover:text-amber-500 font-medium transition-colors">artículos de {product.categoria}</Link>.
          </p>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-12 md:mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-blue-900">
              Productos Relacionados en {product.categoria}
            </h2>
            <Link
              href={`/tienda/categoria/${product.categoria_slug}/`}
              className="text-blue-900 hover:text-amber-500 font-medium text-sm flex items-center gap-1 transition-colors"
            >
              Ver todos
              <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((relProduct) => (
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
          className="inline-flex items-center text-blue-900 hover:text-amber-500 transition-colors font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
