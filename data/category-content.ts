// Textos editoriales por categoría (título H1, meta description, introducción).
// Extraído de app/tienda/categoria/[slug]/page.tsx para reutilizarlo en la paginación.
export const categoryDescriptions: Record<string, {
  title: string;
  description: string;
  content: string;
  keywords: string;
}> = {
  'oficina': {
    title: 'Artículos de Oficina Promocionales',
    description: 'Artículos de oficina promocionales para empresas. Organizadores, porta-lápices, sets de escritorio personalizados. Regalos ejecutivos en Ecuador.',
    content: 'Eleva la imagen de tu empresa con artículos de oficina promocionales de alta calidad. Desde elegantes organizadores de escritorio hasta sets ejecutivos completos, cada pieza refleja profesionalismo y atención al detalle. Perfectos para regalos a clientes VIP, kits de bienvenida para empleados y eventos corporativos en Ecuador.',
    keywords: 'artículos de oficina promocionales, sets de escritorio personalizados, regalos ejecutivos, organizadores corporativos, merchandising oficina ecuador'
  },
  'hogar': {
    title: 'Artículos para el Hogar Promocionales',
    description: 'Productos promocionales para el hogar. Sets de cocina, herramientas, artículos de baño personalizados. Regalo corporativo útil en Ecuador.',
    content: 'Los artículos para el hogar promocionales garantizan presencia de marca en los espacios más íntimos de tus clientes. Desde sets de cocina hasta herramientas de uso diario, estos productos combinan utilidad con visibilidad de marca. Ideales para campañas de fidelización y regalos que generan impacto duradero en hogares de Ecuador.',
    keywords: 'artículos hogar promocionales, sets de cocina personalizados, herramientas con logo, regalos útiles corporativos, productos hogar ecuador'
  },
  'tecnologia': {
    title: 'Productos Tecnológicos Promocionales',
    description: 'Accesorios tecnológicos promocionales. Audífonos bluetooth, cables, speakers y gadgets personalizados. Regalos corporativos tech en Ecuador.',
    content: 'Los productos tecnológicos promocionales posicionan tu marca como innovadora y moderna. Ofrecemos audífonos bluetooth, cables de carga, speakers, power banks y más, todos personalizables con tu logo. Perfectos para empresas de tecnología, startups y cualquier organización que quiera proyectar una imagen vanguardista en Ecuador.',
    keywords: 'accesorios tecnológicos promocionales, audífonos bluetooth personalizados, gadgets corporativos, regalos tech empresariales, tecnología promocional ecuador'
  },
  // Nuevas categorías del proveedor
  'precio-bomba': {
    title: 'Precio Bomba - Ofertas Promocionales',
    description: 'Productos promocionales a precios increíbles. Las mejores ofertas en artículos publicitarios personalizados para empresas en Ecuador.',
    content: 'Nuestra sección Precio Bomba ofrece los mejores productos promocionales a precios imbatibles. Artículos publicitarios de calidad con descuentos especiales para maximizar tu presupuesto de marketing. Perfectos para campañas masivas, eventos corporativos y promociones con alto volumen en Quito, Guayaquil y todo Ecuador.',
    keywords: 'ofertas promocionales, precio bomba, productos baratos personalizados, descuentos merchandising, artículos publicitarios económicos ecuador'
  },
  'antiestres': {
    title: 'Artículos Antiestrés Promocionales',
    description: 'Pelotas y figuras antiestrés personalizadas con tu logo. Artículos relajantes para oficina y eventos corporativos en Ecuador.',
    content: 'Los artículos antiestrés promocionales son regalos ideales que combinan utilidad con visibilidad de marca. Pelotas, figuras y juguetes relajantes personalizables que tus clientes usarán diariamente en sus escritorios. Perfectos para campañas de bienestar laboral, eventos de recursos humanos y marketing corporativo en Ecuador.',
    keywords: 'antiestrés promocionales, pelotas antiestrés personalizadas, figuras antiestrés con logo, regalos relajantes corporativos, merchandising bienestar ecuador'
  },
  'antimicrobianos': {
    title: 'Productos Antimicrobianos Promocionales',
    description: 'Artículos promocionales con tecnología antimicrobiana. Productos de higiene y seguridad personalizados para empresas en Ecuador.',
    content: 'Los productos antimicrobianos promocionales demuestran el compromiso de tu empresa con la salud y seguridad. Artículos con tecnología antibacteriana personalizables que protegen a tus clientes mientras promocionan tu marca. Ideales para empresas de salud, farmacéuticas y cualquier organización que priorice la higiene en Ecuador.',
    keywords: 'productos antimicrobianos, artículos antibacterianos personalizados, promocionales higiene, merchandising salud, productos seguros ecuador'
  },
  'articulos-escritura': {
    title: 'Artículos de Escritura Promocionales',
    description: 'Bolígrafos, lapiceros y sets de escritura personalizados con tu marca. Artículos clásicos de marketing para empresas en Ecuador.',
    content: 'Los artículos de escritura son los promocionales más efectivos por su uso constante y alta rotación. Desde bolígrafos económicos para ferias masivas hasta elegantes rollers ejecutivos, ofrecemos opciones para cada presupuesto. Tu logo viajará de mano en mano generando miles de impresiones en Quito, Guayaquil y todo Ecuador.',
    keywords: 'bolígrafos promocionales, lapiceros personalizados, sets de escritura corporativos, rollers con logo, artículos escritura ecuador'
  },
  'reflectivos': {
    title: 'Artículos Reflectivos Promocionales',
    description: 'Productos reflectivos de seguridad personalizados. Chalecos, bandas y accesorios con visibilidad nocturna para empresas en Ecuador.',
    content: 'Los artículos reflectivos promocionales combinan seguridad con marketing efectivo. Chalecos, bandas, llaveros y accesorios con materiales reflectantes personalizables con tu logo. Perfectos para empresas de transporte, construcción, seguridad vial y eventos nocturnos en Ecuador.',
    keywords: 'artículos reflectivos, chalecos seguridad personalizados, productos visibilidad nocturna, promocionales seguridad vial, merchandising reflectante ecuador'
  },
  'automovil': {
    title: 'Accesorios para Automóvil Promocionales',
    description: 'Artículos promocionales para autos y vehículos. Accesorios de auto personalizados con tu logo para empresas en Ecuador.',
    content: 'Los accesorios para automóvil promocionales acompañan a tus clientes en cada viaje. Portavasos, organizadores, cargadores, ambientadores y más, todos personalizables con tu marca. Ideales para concesionarios, empresas de transporte, aseguradoras y cualquier negocio automotriz en Quito, Guayaquil y todo Ecuador.',
    keywords: 'accesorios auto promocionales, productos vehículos personalizados, artículos carro con logo, merchandising automotriz, promocionales automóvil ecuador'
  },
  'bar-y-vino': {
    title: 'Artículos de Bar y Vino Promocionales',
    description: 'Accesorios de bar, destapadores y sets de vino personalizados. Productos promocionales para bodegas y restaurantes en Ecuador.',
    content: 'Los artículos de bar y vino promocionales son perfectos para el sector gastronómico y eventos corporativos elegantes. Destapadores, sacacorchos, sets de vino, copas y accesorios de bar personalizables con tu logo. Ideales para bodegas, restaurantes, hoteles y eventos premium en Ecuador.',
    keywords: 'artículos bar promocionales, sets vino personalizados, destapadores con logo, accesorios sommelier, merchandising gastronómico ecuador'
  },
  'bicicleta': {
    title: 'Accesorios para Bicicleta Promocionales',
    description: 'Artículos promocionales para ciclistas. Accesorios de bicicleta personalizados con tu marca para empresas en Ecuador.',
    content: 'Los accesorios para bicicleta promocionales conectan tu marca con el estilo de vida saludable y ecológico. Luces, reflectores, bolsos, botellas y herramientas para ciclistas personalizables con tu logo. Perfectos para campañas de movilidad sostenible, eventos deportivos y marketing verde en Ecuador.',
    keywords: 'accesorios bicicleta promocionales, productos ciclismo personalizados, artículos ciclistas con logo, merchandising bicicletas, promocionales deportivos ecuador'
  },
  'calculadoras': {
    title: 'Calculadoras Promocionales Personalizadas',
    description: 'Calculadoras promocionales con tu logo. Artículos de oficina útiles para empresas, bancos y contadores en Ecuador.',
    content: 'Las calculadoras promocionales son artículos de oficina que tus clientes usarán diariamente. Modelos de escritorio, de bolsillo y solares personalizables con tu marca. Perfectos para bancos, contadores, empresas financieras y cualquier negocio que quiera presencia constante en los escritorios de sus clientes en Ecuador.',
    keywords: 'calculadoras promocionales, calculadoras personalizadas, artículos oficina con logo, merchandising financiero, productos contables ecuador'
  },
  'confeccion': {
    title: 'Confección y Textiles Promocionales',
    description: 'Prendas de vestir y textiles personalizados. Uniformes, camisetas y ropa corporativa para empresas en Ecuador.',
    content: 'La confección promocional transforma a tu equipo en embajadores de marca. Camisetas, camisas, uniformes, chaquetas y prendas personalizables con bordado o serigrafía. Desde ropa casual hasta uniformes ejecutivos, vestimos equipos completos con calidad y estilo en Quito, Guayaquil y todo Ecuador.',
    keywords: 'confección promocional, uniformes personalizados, camisetas corporativas, ropa con logo, textiles empresariales ecuador'
  },
  'deportes': {
    title: 'Artículos Deportivos Promocionales',
    description: 'Productos deportivos y fitness personalizados. Balones, accesorios de gimnasio y artículos recreativos para empresas en Ecuador.',
    content: 'Los artículos deportivos promocionales asocian tu marca con salud, energía y bienestar. Balones, bandas elásticas, toallas, botellas deportivas y accesorios de fitness personalizables. Perfectos para gimnasios, eventos deportivos, campañas de bienestar y marketing activo en Ecuador.',
    keywords: 'artículos deportivos promocionales, productos fitness personalizados, balones con logo, accesorios gimnasio corporativos, merchandising deportivo ecuador'
  },
  'econature': {
    title: 'EcoNature - Productos Ecológicos Premium',
    description: 'Línea EcoNature de productos promocionales ecológicos. Artículos sustentables premium personalizados para empresas en Ecuador.',
    content: 'La línea EcoNature ofrece productos promocionales ecológicos de alta calidad. Artículos fabricados con materiales sustentables, reciclados y biodegradables que comunican compromiso ambiental. Perfectos para empresas con responsabilidad social que buscan merchandising premium eco-friendly en Ecuador.',
    keywords: 'econature promocionales, productos ecológicos premium, artículos sustentables personalizados, merchandising verde, promocionales biodegradables ecuador'
  },
  'ecologia': {
    title: 'Productos Ecológicos Promocionales',
    description: 'Artículos promocionales ecológicos y sustentables. Productos de bambú, reciclados y biodegradables para empresas en Ecuador.',
    content: 'Los productos ecológicos promocionales demuestran el compromiso ambiental de tu empresa. Bolsas reutilizables, artículos de bambú, cubiertos biodegradables y más, todos personalizables con tu logo. Ideales para campañas de responsabilidad social y marketing verde en Quito, Guayaquil y todo Ecuador.',
    keywords: 'productos ecológicos promocionales, artículos bambú personalizados, promocionales reciclados, merchandising sustentable, marketing verde ecuador'
  },
  'golf': {
    title: 'Artículos de Golf Promocionales',
    description: 'Accesorios de golf personalizados con tu logo. Pelotas, tees, bolsas y artículos para golfistas en Ecuador.',
    content: 'Los artículos de golf promocionales son perfectos para eventos corporativos exclusivos y clientes VIP. Pelotas, tees, marcadores, toallas, bolsas y accesorios de golf personalizables con tu marca. Ideales para torneos empresariales, regalos ejecutivos y marketing premium en Ecuador.',
    keywords: 'artículos golf promocionales, pelotas golf personalizadas, accesorios golfistas con logo, merchandising golf, productos deportivos premium ecuador'
  },
  'gorras': {
    title: 'Gorras Promocionales Personalizadas',
    description: 'Gorras y cachuchas personalizadas con bordado o estampado. Gorras corporativas para empresas en Ecuador.',
    content: 'Las gorras promocionales son uno de los artículos publicitarios más visibles y efectivos. Gorras de diferentes estilos, materiales y colores personalizables con bordado o serigrafía. Perfectas para uniformes, eventos al aire libre, ferias y promociones en Quito, Guayaquil y todo Ecuador.',
    keywords: 'gorras promocionales, cachuchas personalizadas, gorras bordadas con logo, gorras corporativas, merchandising textil ecuador'
  },
  'herramientas': {
    title: 'Herramientas Promocionales Personalizadas',
    description: 'Herramientas y multiusos promocionales con tu logo. Artículos útiles para el hogar y trabajo en Ecuador.',
    content: 'Las herramientas promocionales son artículos de alta utilidad que tus clientes conservarán por años. Destornilladores, cintas métricas, linternas, multiusos y sets de herramientas personalizables con tu marca. Ideales para ferreterías, constructoras y empresas industriales en Ecuador.',
    keywords: 'herramientas promocionales, multiusos personalizados, sets herramientas con logo, artículos útiles corporativos, merchandising industrial ecuador'
  },
  'iluminacion': {
    title: 'Artículos de Iluminación Promocionales',
    description: 'Linternas, lámparas y productos de iluminación personalizados. Artículos promocionales luminosos para empresas en Ecuador.',
    content: 'Los artículos de iluminación promocionales combinan utilidad con visibilidad de marca. Linternas, lámparas LED, luces de emergencia y accesorios luminosos personalizables con tu logo. Perfectos para empresas de seguridad, camping, automotriz y regalos prácticos en Ecuador.',
    keywords: 'linternas promocionales, lámparas personalizadas, artículos iluminación con logo, productos luminosos corporativos, merchandising LED ecuador'
  },
  'infantil': {
    title: 'Artículos Infantiles Promocionales',
    description: 'Productos promocionales para niños. Juguetes, artículos escolares y regalos infantiles personalizados en Ecuador.',
    content: 'Los artículos infantiles promocionales conectan tu marca con las familias. Juguetes, loncheras, mochilas escolares, crayones y productos para niños personalizables con tu logo. Perfectos para colegios, eventos familiares, pediatrías y campañas dirigidas a padres en Ecuador.',
    keywords: 'artículos infantiles promocionales, juguetes personalizados, productos niños con logo, merchandising escolar, promocionales familia ecuador'
  },
  'juegos': {
    title: 'Juegos Promocionales Personalizados',
    description: 'Juegos de mesa y artículos recreativos promocionales. Entretenimiento corporativo personalizado para empresas en Ecuador.',
    content: 'Los juegos promocionales crean experiencias memorables con tu marca. Juegos de mesa, cartas, rompecabezas, dados y artículos recreativos personalizables con tu logo. Ideales para salas de espera, eventos familiares, team building y marketing experiencial en Ecuador.',
    keywords: 'juegos promocionales, juegos mesa personalizados, artículos recreativos con logo, entretenimiento corporativo, merchandising lúdico ecuador'
  },
  'llaveros': {
    title: 'Llaveros Promocionales Personalizados',
    description: 'Llaveros de todos los estilos y materiales personalizados. Artículos promocionales clásicos para empresas en Ecuador.',
    content: 'Los llaveros promocionales son los artículos publicitarios más tradicionales y efectivos. Metal, cuero, plástico, acrílico y más materiales disponibles para personalizar con tu logo. Acompañan a tus clientes diariamente en sus llaves, generando miles de impresiones en Quito, Guayaquil y todo Ecuador.',
    keywords: 'llaveros promocionales, llaveros personalizados, llaveros metal con logo, llaveros corporativos, merchandising clásico ecuador'
  },
  'maletines': {
    title: 'Maletines y Portafolios Promocionales',
    description: 'Maletines ejecutivos, portafolios y bolsos corporativos personalizados. Artículos premium para empresas en Ecuador.',
    content: 'Los maletines promocionales proyectan profesionalismo y calidad. Portafolios ejecutivos, maletines de viaje, bolsos para laptop y carry-ons personalizables con tu marca. Perfectos para regalos VIP, equipos de ventas y eventos corporativos de alto nivel en Ecuador.',
    keywords: 'maletines promocionales, portafolios personalizados, bolsos ejecutivos con logo, maletines corporativos, merchandising premium ecuador'
  },
  'master-line': {
    title: 'Master Line - Productos Premium',
    description: 'Línea Master Line de productos promocionales premium. Artículos de lujo personalizados para empresas en Ecuador.',
    content: 'La línea Master Line ofrece productos promocionales de la más alta calidad. Artículos premium con acabados de lujo, materiales selectos y diseños exclusivos personalizables con tu marca. Perfectos para clientes VIP, reconocimientos ejecutivos y regalos corporativos de alto impacto en Ecuador.',
    keywords: 'master line promocionales, productos premium personalizados, artículos lujo corporativos, merchandising ejecutivo, regalos VIP ecuador'
  },
  'medicos': {
    title: 'Artículos Médicos Promocionales',
    description: 'Productos promocionales para el sector salud. Artículos médicos y farmacéuticos personalizados en Ecuador.',
    content: 'Los artículos médicos promocionales son ideales para el sector salud. Porta pastilleros, kits de primeros auxilios, artículos de higiene y accesorios médicos personalizables con tu logo. Perfectos para hospitales, clínicas, farmacias y laboratorios en Quito, Guayaquil y todo Ecuador.',
    keywords: 'artículos médicos promocionales, productos farmacéuticos personalizados, merchandising salud, promocionales hospitales, artículos clínicos ecuador'
  },
  'memorias-usb': {
    title: 'Memorias USB Promocionales',
    description: 'Pendrives y memorias USB personalizadas con tu logo. Almacenamiento promocional para empresas en Ecuador.',
    content: 'Las memorias USB promocionales son artículos tecnológicos de alta utilidad. Pendrives de diferentes capacidades y diseños creativos personalizables con tu marca. Perfectos para entregar presentaciones, catálogos digitales y material corporativo en eventos y reuniones en Ecuador.',
    keywords: 'memorias USB promocionales, pendrives personalizados, USB con logo, almacenamiento corporativo, merchandising tecnológico ecuador'
  },
  'mugs': {
    title: 'Mugs y Tazas Promocionales',
    description: 'Mugs y tazas personalizadas con tu logo. Artículos de oficina promocionales para empresas en Ecuador.',
    content: 'Los mugs promocionales son artículos de uso diario que generan alta visibilidad de marca. Tazas cerámicas, mugs de viaje, termos y vasos personalizables con tu logo. Presentes en cada pausa de café, son perfectos para oficinas, regalos y eventos corporativos en Ecuador.',
    keywords: 'mugs promocionales, tazas personalizadas, mugs con logo, tazas corporativas, merchandising oficina ecuador'
  },
  'productos-2023': {
    title: 'Novedades - Productos Nuevos',
    description: 'Los productos promocionales más nuevos y tendencias del mercado. Novedades personalizadas para empresas en Ecuador.',
    content: 'Descubre las últimas tendencias en productos promocionales. Artículos innovadores, diseños modernos y materiales de vanguardia personalizables con tu marca. Mantén tu empresa a la vanguardia del merchandising con nuestras novedades para campañas en Quito, Guayaquil y todo Ecuador.',
    keywords: 'productos nuevos promocionales, novedades merchandising, tendencias artículos publicitarios, promocionales innovadores, productos modernos ecuador'
  },
  'paraguas': {
    title: 'Paraguas Promocionales Personalizados',
    description: 'Paraguas y sombrillas personalizadas con tu logo. Artículos promocionales de alta visibilidad para empresas en Ecuador.',
    content: 'Los paraguas promocionales ofrecen la mayor área de impresión para tu marca. Paraguas plegables, de golf, automáticos y sombrillas personalizables con tu logo. Cada día de lluvia es una oportunidad de exposición de marca en las calles de Quito, Guayaquil y todo Ecuador.',
    keywords: 'paraguas promocionales, sombrillas personalizadas, paraguas con logo, paraguas corporativos, merchandising alta visibilidad ecuador'
  },
  'cuidado-personal': {
    title: 'Productos de Cuidado Personal Promocionales',
    description: 'Artículos de higiene y cuidado personal personalizados. Kits de belleza y productos wellness para empresas en Ecuador.',
    content: 'Los productos de cuidado personal promocionales demuestran atención a tus clientes. Kits de higiene, estuches de belleza, artículos de spa y productos wellness personalizables con tu marca. Perfectos para hoteles, spas, gimnasios y campañas de bienestar en Ecuador.',
    keywords: 'cuidado personal promocional, kits higiene personalizados, productos belleza con logo, artículos wellness corporativos, merchandising spa ecuador'
  },
  'produccion-nacional': {
    title: 'Producción Nacional',
    description: 'Artículos promocionales de la línea Producción Nacional del catálogo, personalizables con tu logo para empresas en Ecuador.',
    content: 'La línea Producción Nacional agrupa vasos, botilitos y otros artículos identificados así en el catálogo de nuestro proveedor. Personalízalos con tu marca y consulta al cotizar el origen de fabricación, el material y el plazo de producción de cada modelo.',
    keywords: 'producción nacional promocionales, vasos personalizados, botilitos personalizados, artículos con logo ecuador'
  },
  'relojes': {
    title: 'Relojes Promocionales Personalizados',
    description: 'Relojes de pared y pulsera personalizados con tu logo. Artículos promocionales de tiempo para empresas en Ecuador.',
    content: 'Los relojes promocionales mantienen tu marca presente las 24 horas del día. Relojes de pared para oficinas, de pulsera para regalos ejecutivos y de escritorio personalizables con tu logo. Artículos de larga duración perfectos para regalos corporativos de alto valor en Ecuador.',
    keywords: 'relojes promocionales, relojes pared personalizados, relojes pulsera con logo, relojes corporativos, merchandising tiempo ecuador'
  },
  'variedades': {
    title: 'Variedades - Productos Diversos',
    description: 'Artículos promocionales variados para toda ocasión. Productos diversos personalizados para empresas en Ecuador.',
    content: 'Nuestra sección de Variedades ofrece una amplia gama de productos promocionales para diferentes necesidades. Artículos únicos y especiales personalizables con tu marca. Encuentra el regalo perfecto para cualquier ocasión, evento o campaña de marketing en Quito, Guayaquil y todo Ecuador.',
    keywords: 'variedades promocionales, productos diversos personalizados, artículos varios con logo, merchandising surtido, promocionales especiales ecuador'
  },
  'tomatodos-y-botilitos-personalizados': {
    title: 'Tomatodos y Botilitos Personalizados',
    description: 'Tomatodos y botilitos personalizados con tu logo: modelos metálicos, plásticos (PET, PETG, PVC), de vidrio, tritán y silicona. Cotiza para tu empresa en Ecuador.',
    content: 'En esta categoría encontrarás botilitos metálicos, de aluminio, vidrio, tritán, silicona y plásticos como PET, PETG y PVC, con capacidades indicadas en cada modelo (de unos 450 ml a 900 ml). Algunos modelos metálicos están pensados para sublimación. Si buscas conservar la temperatura de la bebida, revisa también la categoría de termos. Al cotizar te confirmamos la técnica de marcaje y el área de impresión de cada modelo.',
    keywords: 'tomatodos personalizados, botilitos personalizados, botellas con logo, tomatodos ecuador'
  },
  'termos-personalizados': {
    title: 'Termos Personalizados',
    description: 'Termos personalizados con tu logo para regalos corporativos en Ecuador. Modelos de 350 ml a 750 ml en metal y bambú. Cotiza por WhatsApp.',
    content: 'Selección de termos personalizables con tu marca, con capacidades entre 350 ml y 750 ml según el modelo, en acabados metálicos y de bambú. A diferencia de un botilito de pared simple, un termo está diseñado para conservar la temperatura; confirma con nosotros el aislamiento y la técnica de marcaje de cada modelo al cotizar.',
    keywords: 'termos personalizados, termos con logo, termos corporativos ecuador'
  },
  'vasos-personalizados': {
    title: 'Vasos Personalizados',
    description: 'Vasos personalizados con tu logo: vasos plásticos, de cristal, doble pared, con pitillo y de silicona. Ideales para eventos y activaciones en Ecuador.',
    content: 'Vasos personalizables para eventos, ferias y activaciones de marca: modelos plásticos de distintas capacidades (en onzas o mililitros, según cada ficha), vasos de cristal, de doble pared, con tapa o pitillo y de silicona. Cotiza la cantidad que necesitas y te confirmamos el método de impresión disponible para cada modelo.',
    keywords: 'vasos personalizados, vasos con logo, vasos para eventos ecuador'
  },
};
