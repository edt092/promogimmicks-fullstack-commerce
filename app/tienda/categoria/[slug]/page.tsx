import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';

const SITE_URL = 'https://promogimmicks.com';

// Descripciones SEO únicas para cada categoría
const categoryDescriptions: Record<string, {
  title: string;
  description: string;
  content: string;
  keywords: string;
}> = {
  'accesorios': {
    title: 'Accesorios Promocionales Personalizados',
    description: 'Descubre nuestra colección de accesorios promocionales personalizables con tu logo. Llaveros, paraguas, cosmetiqueras y más. Envíos a Ecuador y Colombia.',
    content: 'Los accesorios promocionales son herramientas de marketing versátiles que generan visibilidad de marca en la vida diaria de tus clientes. Desde llaveros hasta paraguas personalizados, cada artículo es una oportunidad para que tu logo viaje con tus clientes a todas partes. Ideales para eventos corporativos, ferias empresariales y campañas de fidelización en Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'accesorios promocionales, accesorios personalizados, llaveros corporativos, paraguas con logo, regalos empresariales ecuador, merchandising colombia'
  },
  'oficina': {
    title: 'Artículos de Oficina Promocionales',
    description: 'Artículos de oficina promocionales para empresas. Organizadores, porta-lápices, sets de escritorio personalizados. Regalos ejecutivos en Ecuador y Colombia.',
    content: 'Eleva la imagen de tu empresa con artículos de oficina promocionales de alta calidad. Desde elegantes organizadores de escritorio hasta sets ejecutivos completos, cada pieza refleja profesionalismo y atención al detalle. Perfectos para regalos a clientes VIP, kits de bienvenida para empleados y eventos corporativos en Ecuador y Colombia.',
    keywords: 'artículos de oficina promocionales, sets de escritorio personalizados, regalos ejecutivos, organizadores corporativos, merchandising oficina ecuador'
  },
  'drinkware': {
    title: 'Drinkware y Termos Promocionales',
    description: 'Termos, botellas y mugs personalizados con tu marca. Drinkware promocional de alta calidad. Envíos a Ecuador y Colombia.',
    content: 'El drinkware promocional es uno de los artículos publicitarios más efectivos por su uso diario y alta visibilidad. Ofrecemos termos vacuum, botellas deportivas, mugs de viaje y vasos personalizables con tu logo. Cada producto mantiene tus bebidas a la temperatura ideal mientras promociona tu marca en oficinas, gimnasios y espacios públicos de Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'termos personalizados, botellas promocionales, mugs con logo, drinkware corporativo, vasos publicitarios ecuador, termos colombia'
  },
  'hogar': {
    title: 'Artículos para el Hogar Promocionales',
    description: 'Productos promocionales para el hogar. Sets de cocina, herramientas, artículos de baño personalizados. Regalo corporativo útil en Ecuador y Colombia.',
    content: 'Los artículos para el hogar promocionales garantizan presencia de marca en los espacios más íntimos de tus clientes. Desde sets de cocina hasta herramientas de uso diario, estos productos combinan utilidad con visibilidad de marca. Ideales para campañas de fidelización y regalos que generan impacto duradero en hogares de Ecuador y Colombia.',
    keywords: 'artículos hogar promocionales, sets de cocina personalizados, herramientas con logo, regalos útiles corporativos, productos hogar ecuador'
  },
  'tecnologia': {
    title: 'Productos Tecnológicos Promocionales',
    description: 'Accesorios tecnológicos promocionales. Audífonos bluetooth, cables, speakers y gadgets personalizados. Regalos corporativos tech en Ecuador y Colombia.',
    content: 'Los productos tecnológicos promocionales posicionan tu marca como innovadora y moderna. Ofrecemos audífonos bluetooth, cables de carga, speakers, power banks y más, todos personalizables con tu logo. Perfectos para empresas de tecnología, startups y cualquier organización que quiera proyectar una imagen vanguardista en Ecuador y Colombia.',
    keywords: 'accesorios tecnológicos promocionales, audífonos bluetooth personalizados, gadgets corporativos, regalos tech empresariales, tecnología promocional ecuador'
  },
  'articulos-de-escritura': {
    title: 'Artículos de Escritura Promocionales',
    description: 'Bolígrafos, sets de escritura y rollers promocionales personalizados. Artículos de escritura con logo para empresas en Ecuador y Colombia.',
    content: 'Los artículos de escritura son clásicos del marketing promocional que nunca pasan de moda. Desde bolígrafos económicos para eventos masivos hasta elegantes sets de escritura ejecutivos, tenemos opciones para cada presupuesto y ocasión. Alta rotación garantiza que tu logo sea visto miles de veces en oficinas, reuniones y eventos de Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'bolígrafos promocionales, sets de escritura personalizados, rollers corporativos, artículos de escritura con logo, bolígrafos ecuador colombia'
  },
  'eco': {
    title: 'Productos Ecológicos Promocionales',
    description: 'Productos promocionales ecológicos y sustentables. Artículos de bambú, materiales reciclados y opciones eco-friendly. Marketing verde en Ecuador y Colombia.',
    content: 'Demuestra el compromiso de tu empresa con el medio ambiente con nuestra línea de productos ecológicos promocionales. Artículos fabricados con bambú, materiales reciclados y opciones biodegradables que comunican valores de sustentabilidad. Perfectos para empresas con responsabilidad ambiental que buscan merchandising verde en Ecuador y Colombia.',
    keywords: 'productos ecológicos promocionales, merchandising sustentable, artículos de bambú personalizados, regalos eco-friendly, marketing verde ecuador'
  },
  'bolsos-y-mochilas': {
    title: 'Bolsos y Mochilas Promocionales',
    description: 'Mochilas, bolsos y carry-ons personalizados con tu logo. Artículos de viaje promocionales de alta calidad. Envíos a Ecuador y Colombia.',
    content: 'Los bolsos y mochilas promocionales ofrecen la mayor área de impresión para tu logo, garantizando visibilidad en espacios públicos, transporte y oficinas. Desde mochilas deportivas hasta carry-ons ejecutivos, cada producto combina funcionalidad con exposición de marca. Ideales para equipos de ventas, eventos y regalos corporativos de alto impacto en Ecuador y Colombia.',
    keywords: 'mochilas promocionales, bolsos personalizados, carry-on corporativo, maletas con logo, artículos de viaje promocionales ecuador'
  },
  'textil-y-vestuario': {
    title: 'Uniformes y Vestuario Corporativo',
    description: 'Uniformes, camisetas y gorras promocionales personalizadas. Textil corporativo de calidad. Vestimenta con logo para empresas en Ecuador y Colombia.',
    content: 'El vestuario corporativo transforma a tu equipo en embajadores de marca ambulantes. Ofrecemos camisetas, gorras, uniformes y prendas personalizables que proyectan profesionalismo y unidad. Desde textil económico para eventos masivos hasta prendas premium para ejecutivos, tenemos opciones para vestir equipos completos en Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'uniformes corporativos, camisetas personalizadas, gorras promocionales, textil con logo, vestuario empresarial ecuador colombia'
  },
  'deportes-y-recreacion': {
    title: 'Artículos Deportivos Promocionales',
    description: 'Productos deportivos y de recreación promocionales. Balones, bandas elásticas, accesorios fitness personalizados. Merchandising deportivo Ecuador y Colombia.',
    content: 'Los artículos deportivos promocionales asocian tu marca con salud, bienestar y estilo de vida activo. Ofrecemos balones, bandas elásticas, accesorios de fitness y artículos de recreación personalizables. Perfectos para empresas de salud, gimnasios, eventos deportivos y campañas de bienestar corporativo en Ecuador y Colombia.',
    keywords: 'artículos deportivos promocionales, balones personalizados, accesorios fitness corporativos, merchandising deportivo, productos recreación ecuador'
  },
  'salud-y-bienestar': {
    title: 'Productos de Salud y Bienestar Promocionales',
    description: 'Artículos de salud, spa y bienestar promocionales. Sets de baño, kits de primeros auxilios, productos wellness personalizados. Ecuador y Colombia.',
    content: 'Los productos de salud y bienestar promocionales demuestran que tu empresa se preocupa por el cuidado de sus clientes y colaboradores. Desde kits de primeros auxilios hasta sets de spa relajantes, cada artículo comunica cuidado y atención. Ideales para empresas de salud, seguros, recursos humanos y campañas de bienestar en Ecuador y Colombia.',
    keywords: 'productos salud promocionales, sets de spa personalizados, kits bienestar corporativos, artículos wellness con logo, merchandising salud ecuador'
  },
  // Nuevas categorías del proveedor
  'precio-bomba': {
    title: 'Precio Bomba - Ofertas Promocionales',
    description: 'Productos promocionales a precios increíbles. Las mejores ofertas en artículos publicitarios personalizados para empresas en Ecuador y Colombia.',
    content: 'Nuestra sección Precio Bomba ofrece los mejores productos promocionales a precios imbatibles. Artículos publicitarios de calidad con descuentos especiales para maximizar tu presupuesto de marketing. Perfectos para campañas masivas, eventos corporativos y promociones con alto volumen en Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'ofertas promocionales, precio bomba, productos baratos personalizados, descuentos merchandising, artículos publicitarios económicos ecuador'
  },
  'antiestres': {
    title: 'Artículos Antiestrés Promocionales',
    description: 'Pelotas y figuras antiestrés personalizadas con tu logo. Artículos relajantes para oficina y eventos corporativos en Ecuador y Colombia.',
    content: 'Los artículos antiestrés promocionales son regalos ideales que combinan utilidad con visibilidad de marca. Pelotas, figuras y juguetes relajantes personalizables que tus clientes usarán diariamente en sus escritorios. Perfectos para campañas de bienestar laboral, eventos de recursos humanos y marketing corporativo en Ecuador y Colombia.',
    keywords: 'antiestrés promocionales, pelotas antiestrés personalizadas, figuras antiestrés con logo, regalos relajantes corporativos, merchandising bienestar ecuador'
  },
  'antimicrobianos': {
    title: 'Productos Antimicrobianos Promocionales',
    description: 'Artículos promocionales con tecnología antimicrobiana. Productos de higiene y seguridad personalizados para empresas en Ecuador y Colombia.',
    content: 'Los productos antimicrobianos promocionales demuestran el compromiso de tu empresa con la salud y seguridad. Artículos con tecnología antibacteriana personalizables que protegen a tus clientes mientras promocionan tu marca. Ideales para empresas de salud, farmacéuticas y cualquier organización que priorice la higiene en Ecuador y Colombia.',
    keywords: 'productos antimicrobianos, artículos antibacterianos personalizados, promocionales higiene, merchandising salud, productos seguros ecuador'
  },
  'articulos-escritura': {
    title: 'Artículos de Escritura Promocionales',
    description: 'Bolígrafos, lapiceros y sets de escritura personalizados con tu marca. Artículos clásicos de marketing para empresas en Ecuador y Colombia.',
    content: 'Los artículos de escritura son los promocionales más efectivos por su uso constante y alta rotación. Desde bolígrafos económicos para ferias masivas hasta elegantes rollers ejecutivos, ofrecemos opciones para cada presupuesto. Tu logo viajará de mano en mano generando miles de impresiones en Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'bolígrafos promocionales, lapiceros personalizados, sets de escritura corporativos, rollers con logo, artículos escritura ecuador colombia'
  },
  'reflectivos': {
    title: 'Artículos Reflectivos Promocionales',
    description: 'Productos reflectivos de seguridad personalizados. Chalecos, bandas y accesorios con visibilidad nocturna para empresas en Ecuador y Colombia.',
    content: 'Los artículos reflectivos promocionales combinan seguridad con marketing efectivo. Chalecos, bandas, llaveros y accesorios con materiales reflectantes personalizables con tu logo. Perfectos para empresas de transporte, construcción, seguridad vial y eventos nocturnos en Ecuador y Colombia.',
    keywords: 'artículos reflectivos, chalecos seguridad personalizados, productos visibilidad nocturna, promocionales seguridad vial, merchandising reflectante ecuador'
  },
  'automovil': {
    title: 'Accesorios para Automóvil Promocionales',
    description: 'Artículos promocionales para autos y vehículos. Accesorios de auto personalizados con tu logo para empresas en Ecuador y Colombia.',
    content: 'Los accesorios para automóvil promocionales acompañan a tus clientes en cada viaje. Portavasos, organizadores, cargadores, ambientadores y más, todos personalizables con tu marca. Ideales para concesionarios, empresas de transporte, aseguradoras y cualquier negocio automotriz en Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'accesorios auto promocionales, productos vehículos personalizados, artículos carro con logo, merchandising automotriz, promocionales automóvil ecuador'
  },
  'bar-y-vino': {
    title: 'Artículos de Bar y Vino Promocionales',
    description: 'Accesorios de bar, destapadores y sets de vino personalizados. Productos promocionales para bodegas y restaurantes en Ecuador y Colombia.',
    content: 'Los artículos de bar y vino promocionales son perfectos para el sector gastronómico y eventos corporativos elegantes. Destapadores, sacacorchos, sets de vino, copas y accesorios de bar personalizables con tu logo. Ideales para bodegas, restaurantes, hoteles y eventos premium en Ecuador y Colombia.',
    keywords: 'artículos bar promocionales, sets vino personalizados, destapadores con logo, accesorios sommelier, merchandising gastronómico ecuador'
  },
  'bicicleta': {
    title: 'Accesorios para Bicicleta Promocionales',
    description: 'Artículos promocionales para ciclistas. Accesorios de bicicleta personalizados con tu marca para empresas en Ecuador y Colombia.',
    content: 'Los accesorios para bicicleta promocionales conectan tu marca con el estilo de vida saludable y ecológico. Luces, reflectores, bolsos, botellas y herramientas para ciclistas personalizables con tu logo. Perfectos para campañas de movilidad sostenible, eventos deportivos y marketing verde en Ecuador y Colombia.',
    keywords: 'accesorios bicicleta promocionales, productos ciclismo personalizados, artículos ciclistas con logo, merchandising bicicletas, promocionales deportivos ecuador'
  },
  'calculadoras': {
    title: 'Calculadoras Promocionales Personalizadas',
    description: 'Calculadoras promocionales con tu logo. Artículos de oficina útiles para empresas, bancos y contadores en Ecuador y Colombia.',
    content: 'Las calculadoras promocionales son artículos de oficina que tus clientes usarán diariamente. Modelos de escritorio, de bolsillo y solares personalizables con tu marca. Perfectos para bancos, contadores, empresas financieras y cualquier negocio que quiera presencia constante en los escritorios de sus clientes en Ecuador y Colombia.',
    keywords: 'calculadoras promocionales, calculadoras personalizadas, artículos oficina con logo, merchandising financiero, productos contables ecuador'
  },
  'confeccion': {
    title: 'Confección y Textiles Promocionales',
    description: 'Prendas de vestir y textiles personalizados. Uniformes, camisetas y ropa corporativa para empresas en Ecuador y Colombia.',
    content: 'La confección promocional transforma a tu equipo en embajadores de marca. Camisetas, camisas, uniformes, chaquetas y prendas personalizables con bordado o serigrafía. Desde ropa casual hasta uniformes ejecutivos, vestimos equipos completos con calidad y estilo en Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'confección promocional, uniformes personalizados, camisetas corporativas, ropa con logo, textiles empresariales ecuador colombia'
  },
  'deportes': {
    title: 'Artículos Deportivos Promocionales',
    description: 'Productos deportivos y fitness personalizados. Balones, accesorios de gimnasio y artículos recreativos para empresas en Ecuador y Colombia.',
    content: 'Los artículos deportivos promocionales asocian tu marca con salud, energía y bienestar. Balones, bandas elásticas, toallas, botellas deportivas y accesorios de fitness personalizables. Perfectos para gimnasios, eventos deportivos, campañas de bienestar y marketing activo en Ecuador y Colombia.',
    keywords: 'artículos deportivos promocionales, productos fitness personalizados, balones con logo, accesorios gimnasio corporativos, merchandising deportivo ecuador'
  },
  'econature': {
    title: 'EcoNature - Productos Ecológicos Premium',
    description: 'Línea EcoNature de productos promocionales ecológicos. Artículos sustentables premium personalizados para empresas en Ecuador y Colombia.',
    content: 'La línea EcoNature ofrece productos promocionales ecológicos de alta calidad. Artículos fabricados con materiales sustentables, reciclados y biodegradables que comunican compromiso ambiental. Perfectos para empresas con responsabilidad social que buscan merchandising premium eco-friendly en Ecuador y Colombia.',
    keywords: 'econature promocionales, productos ecológicos premium, artículos sustentables personalizados, merchandising verde, promocionales biodegradables ecuador'
  },
  'ecologia': {
    title: 'Productos Ecológicos Promocionales',
    description: 'Artículos promocionales ecológicos y sustentables. Productos de bambú, reciclados y biodegradables para empresas en Ecuador y Colombia.',
    content: 'Los productos ecológicos promocionales demuestran el compromiso ambiental de tu empresa. Bolsas reutilizables, artículos de bambú, cubiertos biodegradables y más, todos personalizables con tu logo. Ideales para campañas de responsabilidad social y marketing verde en Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'productos ecológicos promocionales, artículos bambú personalizados, promocionales reciclados, merchandising sustentable, marketing verde ecuador'
  },
  'golf': {
    title: 'Artículos de Golf Promocionales',
    description: 'Accesorios de golf personalizados con tu logo. Pelotas, tees, bolsas y artículos para golfistas en Ecuador y Colombia.',
    content: 'Los artículos de golf promocionales son perfectos para eventos corporativos exclusivos y clientes VIP. Pelotas, tees, marcadores, toallas, bolsas y accesorios de golf personalizables con tu marca. Ideales para torneos empresariales, regalos ejecutivos y marketing premium en Ecuador y Colombia.',
    keywords: 'artículos golf promocionales, pelotas golf personalizadas, accesorios golfistas con logo, merchandising golf, productos deportivos premium ecuador'
  },
  'gorras': {
    title: 'Gorras Promocionales Personalizadas',
    description: 'Gorras y cachuchas personalizadas con bordado o estampado. Gorras corporativas para empresas en Ecuador y Colombia.',
    content: 'Las gorras promocionales son uno de los artículos publicitarios más visibles y efectivos. Gorras de diferentes estilos, materiales y colores personalizables con bordado o serigrafía. Perfectas para uniformes, eventos al aire libre, ferias y promociones en Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'gorras promocionales, cachuchas personalizadas, gorras bordadas con logo, gorras corporativas, merchandising textil ecuador colombia'
  },
  'herramientas': {
    title: 'Herramientas Promocionales Personalizadas',
    description: 'Herramientas y multiusos promocionales con tu logo. Artículos útiles para el hogar y trabajo en Ecuador y Colombia.',
    content: 'Las herramientas promocionales son artículos de alta utilidad que tus clientes conservarán por años. Destornilladores, cintas métricas, linternas, multiusos y sets de herramientas personalizables con tu marca. Ideales para ferreterías, constructoras y empresas industriales en Ecuador y Colombia.',
    keywords: 'herramientas promocionales, multiusos personalizados, sets herramientas con logo, artículos útiles corporativos, merchandising industrial ecuador'
  },
  'iluminacion': {
    title: 'Artículos de Iluminación Promocionales',
    description: 'Linternas, lámparas y productos de iluminación personalizados. Artículos promocionales luminosos para empresas en Ecuador y Colombia.',
    content: 'Los artículos de iluminación promocionales combinan utilidad con visibilidad de marca. Linternas, lámparas LED, luces de emergencia y accesorios luminosos personalizables con tu logo. Perfectos para empresas de seguridad, camping, automotriz y regalos prácticos en Ecuador y Colombia.',
    keywords: 'linternas promocionales, lámparas personalizadas, artículos iluminación con logo, productos luminosos corporativos, merchandising LED ecuador'
  },
  'infantil': {
    title: 'Artículos Infantiles Promocionales',
    description: 'Productos promocionales para niños. Juguetes, artículos escolares y regalos infantiles personalizados en Ecuador y Colombia.',
    content: 'Los artículos infantiles promocionales conectan tu marca con las familias. Juguetes, loncheras, mochilas escolares, crayones y productos para niños personalizables con tu logo. Perfectos para colegios, eventos familiares, pediatrías y campañas dirigidas a padres en Ecuador y Colombia.',
    keywords: 'artículos infantiles promocionales, juguetes personalizados, productos niños con logo, merchandising escolar, promocionales familia ecuador'
  },
  'juegos': {
    title: 'Juegos Promocionales Personalizados',
    description: 'Juegos de mesa y artículos recreativos promocionales. Entretenimiento corporativo personalizado para empresas en Ecuador y Colombia.',
    content: 'Los juegos promocionales crean experiencias memorables con tu marca. Juegos de mesa, cartas, rompecabezas, dados y artículos recreativos personalizables con tu logo. Ideales para salas de espera, eventos familiares, team building y marketing experiencial en Ecuador y Colombia.',
    keywords: 'juegos promocionales, juegos mesa personalizados, artículos recreativos con logo, entretenimiento corporativo, merchandising lúdico ecuador'
  },
  'llaveros': {
    title: 'Llaveros Promocionales Personalizados',
    description: 'Llaveros de todos los estilos y materiales personalizados. Artículos promocionales clásicos para empresas en Ecuador y Colombia.',
    content: 'Los llaveros promocionales son los artículos publicitarios más tradicionales y efectivos. Metal, cuero, plástico, acrílico y más materiales disponibles para personalizar con tu logo. Acompañan a tus clientes diariamente en sus llaves, generando miles de impresiones en Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'llaveros promocionales, llaveros personalizados, llaveros metal con logo, llaveros corporativos, merchandising clásico ecuador colombia'
  },
  'maletines': {
    title: 'Maletines y Portafolios Promocionales',
    description: 'Maletines ejecutivos, portafolios y bolsos corporativos personalizados. Artículos premium para empresas en Ecuador y Colombia.',
    content: 'Los maletines promocionales proyectan profesionalismo y calidad. Portafolios ejecutivos, maletines de viaje, bolsos para laptop y carry-ons personalizables con tu marca. Perfectos para regalos VIP, equipos de ventas y eventos corporativos de alto nivel en Ecuador y Colombia.',
    keywords: 'maletines promocionales, portafolios personalizados, bolsos ejecutivos con logo, maletines corporativos, merchandising premium ecuador'
  },
  'master-line': {
    title: 'Master Line - Productos Premium',
    description: 'Línea Master Line de productos promocionales premium. Artículos de lujo personalizados para empresas en Ecuador y Colombia.',
    content: 'La línea Master Line ofrece productos promocionales de la más alta calidad. Artículos premium con acabados de lujo, materiales selectos y diseños exclusivos personalizables con tu marca. Perfectos para clientes VIP, reconocimientos ejecutivos y regalos corporativos de alto impacto en Ecuador y Colombia.',
    keywords: 'master line promocionales, productos premium personalizados, artículos lujo corporativos, merchandising ejecutivo, regalos VIP ecuador'
  },
  'medicos': {
    title: 'Artículos Médicos Promocionales',
    description: 'Productos promocionales para el sector salud. Artículos médicos y farmacéuticos personalizados en Ecuador y Colombia.',
    content: 'Los artículos médicos promocionales son ideales para el sector salud. Porta pastilleros, kits de primeros auxilios, artículos de higiene y accesorios médicos personalizables con tu logo. Perfectos para hospitales, clínicas, farmacias y laboratorios en Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'artículos médicos promocionales, productos farmacéuticos personalizados, merchandising salud, promocionales hospitales, artículos clínicos ecuador'
  },
  'memorias-usb': {
    title: 'Memorias USB Promocionales',
    description: 'Pendrives y memorias USB personalizadas con tu logo. Almacenamiento promocional para empresas en Ecuador y Colombia.',
    content: 'Las memorias USB promocionales son artículos tecnológicos de alta utilidad. Pendrives de diferentes capacidades y diseños creativos personalizables con tu marca. Perfectos para entregar presentaciones, catálogos digitales y material corporativo en eventos y reuniones en Ecuador y Colombia.',
    keywords: 'memorias USB promocionales, pendrives personalizados, USB con logo, almacenamiento corporativo, merchandising tecnológico ecuador'
  },
  'mugs': {
    title: 'Mugs y Tazas Promocionales',
    description: 'Mugs y tazas personalizadas con tu logo. Artículos de oficina promocionales para empresas en Ecuador y Colombia.',
    content: 'Los mugs promocionales son artículos de uso diario que generan alta visibilidad de marca. Tazas cerámicas, mugs de viaje, termos y vasos personalizables con tu logo. Presentes en cada pausa de café, son perfectos para oficinas, regalos y eventos corporativos en Ecuador y Colombia.',
    keywords: 'mugs promocionales, tazas personalizadas, mugs con logo, tazas corporativas, merchandising oficina ecuador colombia'
  },
  'productos-2023': {
    title: 'Novedades - Productos Nuevos',
    description: 'Los productos promocionales más nuevos y tendencias del mercado. Novedades personalizadas para empresas en Ecuador y Colombia.',
    content: 'Descubre las últimas tendencias en productos promocionales. Artículos innovadores, diseños modernos y materiales de vanguardia personalizables con tu marca. Mantén tu empresa a la vanguardia del merchandising con nuestras novedades para campañas en Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'productos nuevos promocionales, novedades merchandising, tendencias artículos publicitarios, promocionales innovadores, productos modernos ecuador'
  },
  'paraguas': {
    title: 'Paraguas Promocionales Personalizados',
    description: 'Paraguas y sombrillas personalizadas con tu logo. Artículos promocionales de alta visibilidad para empresas en Ecuador y Colombia.',
    content: 'Los paraguas promocionales ofrecen la mayor área de impresión para tu marca. Paraguas plegables, de golf, automáticos y sombrillas personalizables con tu logo. Cada día de lluvia es una oportunidad de exposición de marca en las calles de Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'paraguas promocionales, sombrillas personalizadas, paraguas con logo, paraguas corporativos, merchandising alta visibilidad ecuador'
  },
  'cuidado-personal': {
    title: 'Productos de Cuidado Personal Promocionales',
    description: 'Artículos de higiene y cuidado personal personalizados. Kits de belleza y productos wellness para empresas en Ecuador y Colombia.',
    content: 'Los productos de cuidado personal promocionales demuestran atención a tus clientes. Kits de higiene, estuches de belleza, artículos de spa y productos wellness personalizables con tu marca. Perfectos para hoteles, spas, gimnasios y campañas de bienestar en Ecuador y Colombia.',
    keywords: 'cuidado personal promocional, kits higiene personalizados, productos belleza con logo, artículos wellness corporativos, merchandising spa ecuador'
  },
  'produccion-nacional': {
    title: 'Producción Nacional - Hecho Localmente',
    description: 'Productos promocionales de fabricación local. Artículos nacionales personalizados para empresas en Ecuador y Colombia.',
    content: 'Nuestra línea de Producción Nacional ofrece productos promocionales fabricados localmente con calidad garantizada. Apoya la industria local mientras personalizas artículos con tu marca. Tiempos de entrega reducidos y posibilidad de personalización especial en Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'producción nacional promocionales, productos locales personalizados, artículos nacionales con logo, merchandising local, industria nacional ecuador'
  },
  'relojes': {
    title: 'Relojes Promocionales Personalizados',
    description: 'Relojes de pared y pulsera personalizados con tu logo. Artículos promocionales de tiempo para empresas en Ecuador y Colombia.',
    content: 'Los relojes promocionales mantienen tu marca presente las 24 horas del día. Relojes de pared para oficinas, de pulsera para regalos ejecutivos y de escritorio personalizables con tu logo. Artículos de larga duración perfectos para regalos corporativos de alto valor en Ecuador y Colombia.',
    keywords: 'relojes promocionales, relojes pared personalizados, relojes pulsera con logo, relojes corporativos, merchandising tiempo ecuador'
  },
  'variedades': {
    title: 'Variedades - Productos Diversos',
    description: 'Artículos promocionales variados para toda ocasión. Productos diversos personalizados para empresas en Ecuador y Colombia.',
    content: 'Nuestra sección de Variedades ofrece una amplia gama de productos promocionales para diferentes necesidades. Artículos únicos y especiales personalizables con tu marca. Encuentra el regalo perfecto para cualquier ocasión, evento o campaña de marketing en Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'variedades promocionales, productos diversos personalizados, artículos varios con logo, merchandising surtido, promocionales especiales ecuador'
  }
};

// Generar rutas estáticas para todas las categorías (products.json + categories.json)
export async function generateStaticParams() {
  const fromProducts = productsData.map(p => p.categoria_slug);
  const fromCategories = categoriesData.map(c => c.slug);
  const all = Array.from(new Set([...fromProducts, ...fromCategories]));
  return all.map(slug => ({ slug }));
}

// Generar metadata SEO para cada categoría
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const categoryInfo = categoryDescriptions[params.slug];
  const categoryProducts = productsData.filter(p => p.categoria_slug === params.slug);

  if (!categoryInfo || categoryProducts.length === 0) {
    return { title: 'Categoría no encontrada' };
  }

  const categoryName = categoryProducts[0].categoria;
  const title = `${categoryInfo.title} en Ecuador y Colombia | PromoGimmicks`;
  const description = categoryInfo.description;

  return {
    title,
    description,
    keywords: categoryInfo.keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}/tienda/categoria/${params.slug}/`,
      siteName: 'PromoGimmicks',
      locale: 'es_EC',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/tienda/categoria/${params.slug}/`,
    },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryProducts = productsData.filter(p => p.categoria_slug === params.slug);

  if (categoryProducts.length === 0) {
    notFound();
  }

  const categoryName = categoryProducts[0].categoria;
  const categoryInfo = categoryDescriptions[params.slug] || {
    title: categoryName,
    description: `Productos promocionales de ${categoryName}`,
    content: `Explora nuestra selección de productos promocionales de ${categoryName} personalizables con tu logo.`,
    keywords: `${categoryName}, productos promocionales`
  };

  // Schema.org JSON-LD para la categoría
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": categoryInfo.title,
    "description": categoryInfo.description,
    "url": `${SITE_URL}/tienda/categoria/${params.slug}/`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": categoryProducts.length,
      "itemListElement": categoryProducts.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.nombre,
          "url": `${SITE_URL}/tienda/${product.slug}/`,
          "image": `${SITE_URL}${product.imagen_url}`
        }
      }))
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": SITE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tienda",
        "item": `${SITE_URL}/tienda/`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": categoryName,
        "item": `${SITE_URL}/tienda/categoria/${params.slug}/`
      }
    ]
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            {/* Breadcrumb */}
            <nav className="inline-flex items-center gap-2 text-blue-200 text-sm">
              <Link href="/" className="hover:text-white transition">Inicio</Link>
              <span>/</span>
              <Link href="/tienda/" className="hover:text-white transition">Tienda</Link>
              <span>/</span>
              <span className="text-white">{categoryName}</span>
            </nav>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              <span className="text-sm md:text-base font-medium">{categoryProducts.length} Productos Disponibles</span>
            </div>

            {/* Título */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {categoryInfo.title}
            </h1>

            {/* Descripción */}
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {categoryInfo.description}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 8.33C120 16.7 240 33.3 360 41.7C480 50 600 50 720 45C840 40 960 30 1080 28.3C1200 26.7 1320 33.3 1380 36.7L1440 40V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="rgb(249, 250, 251)"/>
          </svg>
        </div>
      </section>

      {/* Contenido SEO */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600 text-lg leading-relaxed">
            {categoryInfo.content}
          </p>
        </div>
      </section>

      {/* Grid de Productos */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {categoryProducts.map((product) => (
              <Link
                key={product.id}
                href={`/tienda/${product.slug}/`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-square relative bg-gray-100">
                  <Image
                    src={product.imagen_url}
                    alt={`${product.nombre} - Producto promocional personalizable`}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.nombre}
                  </p>
                  {product.codigo && (
                    <p className="text-xs text-gray-500 mt-1">{product.codigo}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Interlinking: recursos del blog */}
      <section className="py-10 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-blue-900 mb-5">
            Guías y recursos para tu estrategia de merchandising
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/blog/guia-donde-comprar-productos-promocionales-2025/"
              className="flex gap-3 bg-white rounded-xl p-4 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all group"
            >
              <span className="text-2xl flex-shrink-0">📋</span>
              <div>
                <p className="font-semibold text-blue-900 text-sm group-hover:text-amber-600 transition-colors line-clamp-2">
                  Guía: dónde comprar productos promocionales en 2025
                </p>
                <p className="text-xs text-gray-500 mt-1">Leer artículo →</p>
              </div>
            </Link>
            <Link
              href="/blog/productos-promocionales-baratos-quito-2025/"
              className="flex gap-3 bg-white rounded-xl p-4 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all group"
            >
              <span className="text-2xl flex-shrink-0">🏷️</span>
              <div>
                <p className="font-semibold text-blue-900 text-sm group-hover:text-amber-600 transition-colors line-clamp-2">
                  Productos promocionales baratos en Quito 2025
                </p>
                <p className="text-xs text-gray-500 mt-1">Leer artículo →</p>
              </div>
            </Link>
            <Link
              href="/blog/guia-articulos-promocionales-navidenos-2025/"
              className="flex gap-3 bg-white rounded-xl p-4 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all group"
            >
              <span className="text-2xl flex-shrink-0">🎁</span>
              <div>
                <p className="font-semibold text-blue-900 text-sm group-hover:text-amber-600 transition-colors line-clamp-2">
                  Artículos promocionales navideños: guía completa
                </p>
                <p className="text-xs text-gray-500 mt-1">Leer artículo →</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            ¿Necesitas cotización para {categoryName}?
          </h2>
          <p className="text-blue-100 mb-8">
            Contáctanos por WhatsApp para recibir precios y tiempos de entrega personalizados.
          </p>
          <a
            href="https://wa.me/593987654321?text=Hola,%20me%20interesan%20los%20productos%20de%20la%20categor%C3%ADa%20{categoryName}"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Cotizar por WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
