'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const STOCK_IMAGES_COUNT = 12;

const catalogosRaw = [
  {
    title: 'Precio Bomba',
    slug: 'precio-bomba',
    description: 'Productos promocionales con los mejores precios del mercado.',
    image: '/img/imagenes-de-stock/1.jpg',
    keywords: ['ofertas', 'precios bajos'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/precio-bomba.html',
  },
  {
    title: 'Antiestrés',
    slug: 'antiestres',
    description: 'Artículos antiestrés personalizados para aliviar tensiones en la oficina.',
    image: '/img/imagenes-de-stock/2.jpg',
    keywords: ['antiestrés', 'pelotas antiestrés'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/antiestres.html',
  },
  {
    title: 'Antimicrobianos',
    slug: 'antimicrobianos',
    description: 'Productos con tecnología antimicrobiana para mayor higiene y seguridad.',
    image: '/img/imagenes-de-stock/3.jpg',
    keywords: ['antimicrobiano', 'higiene'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/antimicrobianos.html',
  },
  {
    title: 'Artículos de Escritura',
    slug: 'articulos-escritura',
    description: 'Bolígrafos, lapiceros y sets de escritura personalizados con tu marca.',
    image: '/img/imagenes-de-stock/4.jpg',
    keywords: ['bolígrafos', 'lapiceros'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/articulos-escritura.html',
  },
  {
    title: 'Reflectivos',
    slug: 'reflectivos',
    description: 'Artículos reflectivos para seguridad vial y visibilidad nocturna.',
    image: '/img/imagenes-de-stock/5.jpg',
    keywords: ['reflectivo', 'seguridad'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/reflectivos.html',
  },
  {
    title: 'Automóvil',
    slug: 'automovil',
    description: 'Accesorios promocionales para autos y vehículos.',
    image: '/img/imagenes-de-stock/6.jpg',
    keywords: ['auto', 'vehículos'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/automovil.html',
  },
  {
    title: 'Bar y Vino',
    slug: 'bar-y-vino',
    description: 'Artículos para bar, destapadores, copas y accesorios de vino.',
    image: '/img/imagenes-de-stock/7.jpg',
    keywords: ['bar', 'vino'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/bar-y-vino.html',
  },
  {
    title: 'Bicicleta',
    slug: 'bicicleta',
    description: 'Accesorios para ciclistas y bicicletas personalizados.',
    image: '/img/imagenes-de-stock/8.jpg',
    keywords: ['bicicleta', 'ciclismo'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/bicicleta.html',
  },
  {
    title: 'Calculadoras',
    slug: 'calculadoras',
    description: 'Calculadoras promocionales para oficina y estudiantes.',
    image: '/img/imagenes-de-stock/9.jpg',
    keywords: ['calculadoras', 'oficina'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/calculadoras.html',
  },
  {
    title: 'Confección',
    slug: 'confeccion',
    description: 'Prendas de vestir y textiles personalizados con tu logo.',
    image: '/img/imagenes-de-stock/10.jpg',
    keywords: ['ropa', 'textiles'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/confeccion.html',
  },
  {
    title: 'Deportes',
    slug: 'deportes',
    description: 'Artículos deportivos y accesorios para actividades físicas.',
    image: '/img/imagenes-de-stock/11.jpg',
    keywords: ['deportes', 'fitness'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/deportes.html',
  },
  {
    title: 'EcoNature',
    slug: 'econature',
    description: 'Productos ecológicos premium de la línea EcoNature.',
    image: '/img/imagenes-de-stock/12.jpg',
    keywords: ['eco', 'natural'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/econature.html',
  },
  {
    title: 'Ecología',
    slug: 'ecologia',
    description: 'Artículos ecológicos y sustentables para empresas responsables.',
    image: '/img/imagenes-de-stock/13.jpg',
    keywords: ['ecológico', 'sustentable'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/ecologia.html',
  },
  {
    title: 'Golf',
    slug: 'golf',
    description: 'Accesorios de golf personalizados para eventos corporativos.',
    image: '/img/imagenes-de-stock/14.jpg',
    keywords: ['golf', 'deportes'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/golf.html',
  },
  {
    title: 'Gorras',
    slug: 'gorras',
    description: 'Gorras y cachuchas personalizadas con bordado o estampado.',
    image: '/img/imagenes-de-stock/15.jpg',
    keywords: ['gorras', 'cachuchas'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/gorras.html',
  },
  {
    title: 'Herramientas',
    slug: 'herramientas',
    description: 'Herramientas promocionales útiles para el hogar y trabajo.',
    image: '/img/imagenes-de-stock/16.jpg',
    keywords: ['herramientas', 'útiles'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/herramientas.html',
  },
  {
    title: 'Hogar',
    slug: 'hogar',
    description: 'Artículos para el hogar personalizados con tu marca.',
    image: '/img/imagenes-de-stock/17.jpg',
    keywords: ['hogar', 'casa'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/hogar.html',
  },
  {
    title: 'Iluminación',
    slug: 'iluminacion',
    description: 'Linternas, lámparas y productos de iluminación personalizados.',
    image: '/img/imagenes-de-stock/18.jpg',
    keywords: ['linternas', 'luces'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/iluminacion.html',
  },
  {
    title: 'Infantil',
    slug: 'infantil',
    description: 'Productos promocionales para niños y eventos infantiles.',
    image: '/img/imagenes-de-stock/19.jpg',
    keywords: ['niños', 'infantil'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/infantil.html',
  },
  {
    title: 'Juegos',
    slug: 'juegos',
    description: 'Juegos de mesa y artículos recreativos personalizados.',
    image: '/img/imagenes-de-stock/20.jpg',
    keywords: ['juegos', 'entretenimiento'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/juegos.html',
  },
  {
    title: 'Llaveros',
    slug: 'llaveros',
    description: 'Llaveros promocionales de diversos materiales y estilos.',
    image: '/img/imagenes-de-stock/21.jpg',
    keywords: ['llaveros', 'accesorios'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/llaveros.html',
  },
  {
    title: 'Maletines',
    slug: 'maletines',
    description: 'Maletines, portafolios y bolsos ejecutivos personalizados.',
    image: '/img/imagenes-de-stock/22.jpg',
    keywords: ['maletines', 'portafolios'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/maletines.html',
  },
  {
    title: 'Master Line',
    slug: 'master-line',
    description: 'Productos premium de la línea Master Line.',
    image: '/img/imagenes-de-stock/23.jpg',
    keywords: ['premium', 'ejecutivo'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/master-line.html',
  },
  {
    title: 'Médicos',
    slug: 'medicos',
    description: 'Artículos promocionales para el sector salud y médico.',
    image: '/img/imagenes-de-stock/24.jpg',
    keywords: ['médicos', 'salud'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/medicos.html',
  },
  {
    title: 'Memorias USB',
    slug: 'memorias-usb',
    description: 'Memorias USB y pendrives personalizados con tu logo.',
    image: '/img/imagenes-de-stock/25.jpg',
    keywords: ['USB', 'memorias'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/memorias-usb.html',
  },
  {
    title: 'Mugs',
    slug: 'mugs',
    description: 'Tazas y mugs personalizados para oficina y hogar.',
    image: '/img/imagenes-de-stock/26.jpg',
    keywords: ['tazas', 'mugs'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/mugs.html',
  },
  {
    title: 'Productos 2023',
    slug: 'productos-2023',
    description: 'Los productos más nuevos y tendencias del catálogo.',
    image: '/img/imagenes-de-stock/27.jpg',
    keywords: ['nuevos', 'tendencias'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/productos-2023.html',
  },
  {
    title: 'Oficina',
    slug: 'oficina',
    description: 'Artículos de oficina y escritorio personalizados.',
    image: '/img/imagenes-de-stock/28.jpg',
    keywords: ['oficina', 'escritorio'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/oficina.html',
  },
  {
    title: 'Paraguas',
    slug: 'paraguas',
    description: 'Paraguas y sombrillas promocionales de alta calidad.',
    image: '/img/imagenes-de-stock/29.jpg',
    keywords: ['paraguas', 'sombrillas'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/paraguas.html',
  },
  {
    title: 'Cuidado Personal',
    slug: 'cuidado-personal',
    description: 'Productos de higiene y cuidado personal personalizados.',
    image: '/img/imagenes-de-stock/30.jpg',
    keywords: ['higiene', 'cuidado'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/cuidado-personal.html',
  },
  {
    title: 'Producción Nacional',
    slug: 'produccion-nacional',
    description: 'Productos fabricados localmente con calidad garantizada.',
    image: '/img/imagenes-de-stock/31.jpg',
    keywords: ['nacional', 'local'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/produccion-nacional.html',
  },
  {
    title: 'Relojes',
    slug: 'relojes',
    description: 'Relojes promocionales de pared y pulsera personalizados.',
    image: '/img/imagenes-de-stock/32.jpg',
    keywords: ['relojes', 'tiempo'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/relojes.html',
  },
  {
    title: 'Tecnología',
    slug: 'tecnologia',
    description: 'Gadgets tecnológicos y accesorios electrónicos personalizados.',
    image: '/img/imagenes-de-stock/33.jpg',
    keywords: ['tecnología', 'gadgets'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/tecnologia.html',
  },
  {
    title: 'Variedades',
    slug: 'variedades',
    description: 'Artículos promocionales variados para toda ocasión.',
    image: '/img/imagenes-de-stock/34.jpg',
    keywords: ['variado', 'surtido'],
    providerUrl: 'https://www.catalogospromocionales.com/promocionales/variedades.html',
  },
];

const categorias = catalogosRaw.map((cat, i) => ({
  ...cat,
  image: `/img/imagenes-de-stock/${(i % STOCK_IMAGES_COUNT) + 1}.jpg`,
}));

export default function Catalogos() {
  return (
    <section id="categorias" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Productos Promocionales por Categoría
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Encuentra el artículo publicitario perfecto para tu campaña de marketing.
            Miles de opciones en productos promocionales para empresas en Ecuador y Colombia.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {categorias.map((categoria, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (index % 12) * 0.05 }}
            >
              <Link
                href={`/tienda/categoria/${categoria.slug}/`}
                className="group block relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Imagen de fondo */}
                <div className="relative h-32 sm:h-36 overflow-hidden">
                  <Image
                    src={categoria.image}
                    alt={categoria.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  {/* Overlay gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent"></div>

                  {/* Título sobre la imagen */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm sm:text-base font-bold text-white drop-shadow-lg line-clamp-2">
                      {categoria.title}
                    </p>
                  </div>
                </div>

                {/* Keywords como badges pequeños */}
                <div className="p-2 flex flex-wrap gap-1">
                  {categoria.keywords.slice(0, 2).map((keyword, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                {/* Borde inferior animado */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/tienda/"
            className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Ver todos los productos
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
