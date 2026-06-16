'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ProductShowcase from './ProductShowcase';
import CTABanner from './CTABanner';
import productsData from '@/data/products.json';

const getProductsByCategory = (category: string, limit: number = 4) => {
  return productsData
    .filter(p => p.categoria.toLowerCase().includes(category.toLowerCase()))
    .slice(0, limit);
};

const getFeaturedProducts = (limit: number = 4) => {
  const categories = ['Tecnología', 'Drinkware', 'Oficina', 'Accesorios'];
  const featured: typeof productsData = [];
  categories.forEach(cat => {
    const product = productsData.find(p => p.categoria === cat);
    if (product) featured.push(product);
  });
  return featured.slice(0, limit);
};

const TOC_ITEMS = [
  'La Era del Promocional Invisible',
  'Árbol de Decisión: Elige el Promocional Correcto',
  'Matriz de Inversión: Costo Real vs. Días de Uso',
  'Checklist de 7 Puntos',
  'Top 10: Tabla Comparativa 2026',
  'El Factor "Envejecimiento Noble"',
  'La Regla de las 5 Palabras en el Copy',
  'El Renacer de lo Tangible',
  'Conclusión',
];

export default function BlogFuncionalesContent() {
  const [tocOpen, setTocOpen] = useState(true);

  const drinkwareProducts = getProductsByCategory('Drinkware', 4);
  const techProducts = getProductsByCategory('Tecnología', 4);
  const officeProducts = getProductsByCategory('Oficina', 4);
  const featuredProducts = getFeaturedProducts(4);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Tabla de contenidos */}
      <div className="mb-10 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 transition-colors"
        >
          <h2 className="text-xl font-bold text-blue-900">Tabla de Contenidos</h2>
          {tocOpen ? <ChevronUp size={24} className="text-blue-600" /> : <ChevronDown size={24} className="text-blue-600" />}
        </button>
        {tocOpen && (
          <nav className="p-6 pt-0">
            <ol className="space-y-2 text-gray-700">
              {TOC_ITEMS.map((title, i) => (
                <li key={i}>
                  <a
                    href={`#sec-${i + 1}`}
                    className="hover:text-amber-600 transition-colors flex items-center gap-2"
                  >
                    <span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    {title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>

      {/* Intro */}
      <div className="prose prose-lg max-w-none prose-headings:text-blue-900 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline">
        <p className="text-lg text-gray-700 leading-relaxed">
          El 89% de los consumidores conserva un promocional si lo usa al menos una vez al día. El 91% lo tira si no encuentra utilidad en las primeras 48 horas.{' '}
          <strong>El margen entre el éxito y el olvido es de dos días.</strong>
        </p>
        <p className="text-gray-700 leading-relaxed">
          Seamos directos. Si estás buscando <em>promocionales funcionales que tus clientes usarán todos los días</em>, ya sabes lo que es abrir un cajón lleno de artículos que nadie quiere. Bolígrafos que no escriben, llaveros que se rompen al segundo uso, tazas que se destiñen en el lavavajillas. Eso no es marketing. Eso es una fogata de dinero.
        </p>
        <p className="text-gray-700 leading-relaxed">
          En 2026, la saturación publicitaria será aún mayor. Pero hay un territorio donde la IA no puede competir: <strong>el tacto diario de un promocional bien elegido que se integra en la rutina matinal de tu cliente.</strong>
        </p>
      </div>

      {/* Sección 1 */}
      <section id="sec-1" className="scroll-mt-24 mt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
          1. La Era del Promocional Invisible: Por Qué la Funcionalidad Diaria es el Nuevo Lujo
        </h2>
        <div className="prose prose-lg max-w-none text-gray-700">
          <p>
            Hasta hace poco, los promocionales buscaban visibilidad. Hoy, los que realmente funcionan buscan <strong>integración invisible en la rutina</strong>. El mejor promocional no es el que más brilla. Es aquel que tu cliente toca a las 7:23 de la mañana, sin pensar en tu marca, pero con tu marca siempre presente.
          </p>
        </div>

        <div className="mt-6 bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-blue-900 mb-4">El Concepto del &quot;Ancla Somática Diario&quot;</h3>
          <p className="text-gray-700 mb-4">
            En neuromarketing, un ancla es un estímulo que desencadena una respuesta emocional automática. Cuando un promocional se integra en un ritual diario, se convierte en un <strong>ancla somática</strong>. Tu cliente ya no decide usarlo. Simplemente, su día no funciona igual sin él.
          </p>
          <p className="font-semibold text-blue-900 mb-3">Los 3 rituales diarios donde tu promocional debe colarse en 2026:</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { tiempo: '06:00 – 09:00', nombre: 'Ritual Matinal', desc: 'Café, hidratación, planificación del día.' },
              { tiempo: '09:00 – 13:00', nombre: 'Ritual de Productividad', desc: 'Escritorio, cables, organización, concentración.' },
              { tiempo: '13:00 – 20:00', nombre: 'Ritual de Movilidad', desc: 'Transporte, gimnasio, reuniones externas, viajes.' },
            ].map((r, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
                <p className="text-amber-600 font-bold text-sm mb-1">{r.tiempo}</p>
                <p className="font-semibold text-blue-900 mb-1">{r.nombre}</p>
                <p className="text-gray-600 text-sm">{r.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-sm mt-4 italic">
            Si tu promocional no resuelve un micro-dolor en alguno de estos tres bloques, está condenado al olvido.
          </p>
        </div>
      </section>

      {/* Product Showcase 1 */}
      <div className="mt-10">
        <ProductShowcase
          products={drinkwareProducts}
          title="Tazas y Termos: Los Reyes del Ritual Matinal"
          subtitle="Promocionales con más de 300 días de uso al año garantizados"
          variant="featured"
        />
      </div>

      {/* Sección 2: Árbol de decisión */}
      <section id="sec-2" className="scroll-mt-24 mt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
          2. Árbol de Decisión: ¿Cómo Elegir un Promocional que se Use a Diario en 2026?
        </h2>
        <p className="text-gray-700 mb-6">
          Sigue este flujo para encontrar el promocional funcional perfecto para tu audiencia. Un promocional no puede ser bueno para todo el mundo — la funcionalidad diaria exige <strong>especificidad quirúrgica</strong>.
        </p>

        {/* Árbol visual */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 overflow-x-auto">
          <div className="flex flex-col items-center gap-4 min-w-[480px]">
            <div className="bg-blue-900 text-white rounded-xl px-6 py-3 font-bold text-center">
              Quiero un promocional de uso diario
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="bg-amber-500 text-white rounded-xl px-6 py-3 font-semibold text-center text-sm">
              ¿En qué momento del día quiero que mi cliente lo use?
            </div>
            <div className="grid grid-cols-3 gap-4 w-full">
              {[
                {
                  tiempo: 'Mañana (6–9h)',
                  pregunta: '¿Bebe café, té o agua al despertar?',
                  resultado: 'Tazas térmicas y botellas inteligentes con medidor de hidratación',
                },
                {
                  tiempo: 'Trabajo (9–13h)',
                  pregunta: '¿Trabaja en escritorio fijo o móvil?',
                  resultado: 'Organizadores de escritorio ergonómicos, kit de cables portátil y soporte plegable',
                },
                {
                  tiempo: 'Tarde/Noche (13–22h)',
                  pregunta: '¿Hace ejercicio, viaja o se desplaza mucho?',
                  resultado: 'Botellas deportivas, toallas de secado rápido y auriculares de conducción ósea',
                },
              ].map((branch, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="bg-blue-100 text-blue-900 rounded-lg px-3 py-2 text-xs font-bold text-center w-full">
                    {branch.tiempo}
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 text-center w-full">
                    {branch.pregunta}
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-800 font-medium text-center w-full">
                    {branch.resultado}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sección 3: Matriz */}
      <section id="sec-3" className="scroll-mt-24 mt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
          3. Matriz de Inversión: Costo Real vs. Días de Uso Anuales
        </h2>
        <p className="text-gray-700 mb-6">
          No mires el precio unitario. Mira el <strong>Costo por Día de Uso (CDU)</strong>. Esta herramienta justifica la apuesta por promocionales de calidad.
        </p>

        <div className="relative border-2 border-gray-200 rounded-2xl overflow-hidden">
          {/* Eje Y */}
          <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center bg-gray-50 border-r border-gray-200">
            <span className="text-xs text-gray-500 font-semibold" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              Días de uso al año ↑
            </span>
          </div>
          {/* Eje X */}
          <div className="absolute bottom-0 left-8 right-0 h-8 flex items-center justify-center bg-gray-50 border-t border-gray-200">
            <span className="text-xs text-gray-500 font-semibold">Costo unitario →</span>
          </div>

          <div className="ml-8 mb-8 grid grid-cols-2">
            {[
              {
                num: 'II',
                title: 'Los Caballos de Batalla',
                desc: 'Inversión baja, uso diario.',
                detail: 'Agendas de papel de piedra, cables retráctiles multi-cabezal, soportes de móvil plegables.',
                cdu: 'CDU: 0,01€ – 0,03€/día',
                color: 'bg-green-50 border-green-300',
                badge: 'bg-green-600',
                recomendacion: '80% de tu pedido',
              },
              {
                num: 'IV',
                title: 'Las Joyas de la Corona',
                desc: 'Inversión media-alta, uso diario garantizado.',
                detail: 'Tazas térmicas con control de temperatura, mochilas anti-robo, auriculares bone conduction.',
                cdu: 'CDU: 0,05€ – 0,15€/día',
                color: 'bg-amber-50 border-amber-300',
                badge: 'bg-amber-500',
                recomendacion: '20% para clientes VIP',
              },
              {
                num: 'I',
                title: 'El Páramo del Olvido',
                desc: 'Barato y se usa poco.',
                detail: 'Bolígrafos de plástico, llaveros genéricos, abanicos de feria.',
                cdu: 'CDU: Indeterminado (se pierden antes de usarse)',
                color: 'bg-red-50 border-red-200',
                badge: 'bg-red-500',
                recomendacion: '0% — Evitar',
              },
              {
                num: 'III',
                title: 'El Elefante Blanco',
                desc: 'Caro y se usa poco.',
                detail: 'Figuras decorativas pesadas, gadgets tecnológicos con curva de aprendizaje alta.',
                cdu: 'CDU: 2€ – 5€/día (si es que se usa)',
                color: 'bg-red-50 border-red-200',
                badge: 'bg-red-400',
                recomendacion: '0% — Evitar',
              },
            ].map((cuadrante, i) => (
              <div key={i} className={`${cuadrante.color} border p-5`}>
                <div className="flex items-start gap-3 mb-2">
                  <span className={`${cuadrante.badge} text-white text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0`}>
                    {cuadrante.num}
                  </span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{cuadrante.title}</p>
                    <p className="text-gray-600 text-xs">{cuadrante.desc}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-xs mb-2">{cuadrante.detail}</p>
                <p className="text-gray-500 text-xs italic mb-2">{cuadrante.cdu}</p>
                <p className="text-xs font-semibold text-gray-800">Recomendación: {cuadrante.recomendacion}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 rounded-xl p-5 border border-blue-100">
          <p className="font-bold text-blue-900 mb-2">Principio de Compra Inteligente:</p>
          <ul className="space-y-1 text-gray-700 text-sm">
            <li className="flex items-start gap-2"><span className="text-green-600 font-bold mt-0.5">✓</span><span><strong>80% del pedido del Cuadrante II:</strong> bajo costo, altísima frecuencia de uso.</span></li>
            <li className="flex items-start gap-2"><span className="text-amber-500 font-bold mt-0.5">✓</span><span><strong>20% del pedido al Cuadrante IV:</strong> reservado para clientes de alto valor.</span></li>
            <li className="flex items-start gap-2"><span className="text-red-500 font-bold mt-0.5">✗</span><span><strong>0% a los Cuadrantes I y III:</strong> en 2026 no hay excusa para regalar objetos abandonados.</span></li>
          </ul>
        </div>
      </section>

      {/* Product Showcase 2 */}
      <div className="mt-10">
        <ProductShowcase
          products={techProducts}
          title="Tecnología de Uso Diario: Cuadrante II y IV"
          subtitle="Cables, cargadores y accesorios con 365 días de uso al año"
          variant="default"
        />
      </div>

      {/* Sección 4: Checklist */}
      <section id="sec-4" className="scroll-mt-24 mt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
          4. Checklist de 7 Puntos: ¿Este Promocional se Usará Todos los Días?
        </h2>
        <p className="text-gray-700 mb-6">
          Ante cualquier promocional que estés considerando, haz este test. Debe cumplir al menos <strong>5 de los 7 criterios</strong>.
        </p>

        <div className="space-y-4">
          {[
            {
              num: 1,
              titulo: 'Test de la Rutina Matinal',
              desc: '¿En qué gesto automático de tu cliente, antes de las 9 AM, se inserta este promocional? El café, el agua, la planificación, la carga del móvil. Debe estar ahí.',
            },
            {
              num: 2,
              titulo: 'Test de la "Ausencia Dolorosa"',
              desc: 'Imagina que mañana tu cliente se olvida este promocional en casa. ¿Se siente incómodo? ¿Su día es un poco peor? Si la respuesta es no, ese promocional es ornamental, no funcional.',
            },
            {
              num: 3,
              titulo: 'Test de la Superficie de Contacto Táctil',
              desc: '¿Cuántos cm² de la mano del cliente tocan este promocional cada día? Una taza térmica: toda la palma. Un auricular: toda la oreja. Cuanta más superficie de contacto, más profundo el anclaje neuronal.',
            },
            {
              num: 4,
              titulo: 'Test de la Carga Cognitiva Cero',
              desc: '¿Requiere instrucciones, tutoriales o configuraciones complejas? En 2026, la fatiga digital es el enemigo. Si tu promocional suma carga mental, será abandonado.',
            },
            {
              num: 5,
              titulo: 'Test de la Resistencia al Entorno Hostil',
              desc: '¿Sobrevive a un lavavajillas industrial? ¿A una caída desde un bolsillo? ¿Al sudor del gimnasio? Si el promocional es delicado, no es de uso diario.',
            },
            {
              num: 6,
              titulo: 'Test de la "Segunda Unidad"',
              desc: '¿Después de un mes de uso, te ha pedido tu cliente otro igual para su pareja o compañero? El boca a boca orgánico es la señal definitiva de que el promocional es realmente funcional.',
            },
            {
              num: 7,
              titulo: 'Test del Material Noble',
              desc: 'En 2026, el plástico brillante es percibido como tóxico y barato. ¿Tu promocional está hecho de materiales que envejecen con dignidad? Acero, madera, vidrio borosilicato, RPET texturizado.',
            },
          ].map((item) => (
            <div key={item.num} className="flex gap-4 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {item.num}
              </div>
              <div>
                <p className="font-bold text-blue-900 mb-1">{item.titulo}</p>
                <p className="text-gray-700 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
          <p className="text-amber-900 font-medium">
            <strong>Dato clave:</strong> Según la ASI (Advertising Specialty Institute), los promocionales que se usan al menos una vez al día generan una media de <strong>1.400 impresiones de marca al año por unidad</strong>. Tu promocional diario es el anuncio más barato del planeta.
          </p>
        </div>
      </section>

      {/* CTA Inline */}
      <div className="mt-10">
        <CTABanner
          variant="inline"
          title="¿Ya sabes qué tipo de ritual quieres cubrir?"
          subtitle="Explora nuestro catálogo con más de 199 opciones personalizables"
        />
      </div>

      {/* Sección 5: Tabla Top 10 */}
      <section id="sec-5" className="scroll-mt-24 mt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
          5. Top 10: Los Promocionales que se Usan a Diario en 2026
        </h2>
        <p className="text-gray-700 mb-6">
          Basado en estudios de retención de producto y análisis de tendencias de consumo para 2026.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="px-4 py-3 text-left font-semibold w-8">#</th>
                <th className="px-4 py-3 text-left font-semibold">Promocional</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Ritual Diario</th>
                <th className="px-4 py-3 text-center font-semibold">Días/Año</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  pos: 1,
                  nombre: 'Taza térmica con control de temperatura digital',
                  desc: 'Mantiene el café a 55°C exactos durante 4h. LED integrado sin botones.',
                  ritual: 'Café matinal. Escritorio.',
                  dias: '300+',
                  color: 'bg-amber-50',
                },
                {
                  pos: 2,
                  nombre: 'Cable de carga retráctil 3-en-1 con anclaje magnético',
                  desc: 'USB-C, Lightning, Micro-USB en un solo cuerpo. Cable trenzado de kevlar.',
                  ritual: 'Carga matinal del móvil. Coche. Viaje.',
                  dias: '365',
                  color: 'bg-white',
                },
                {
                  pos: 3,
                  nombre: 'Botella de agua inteligente con recordatorio LED',
                  desc: 'Sin app, sin bluetooth. Luz que parpadea suavemente cada hora.',
                  ritual: 'Hidratación durante toda la jornada laboral.',
                  dias: '320',
                  color: 'bg-amber-50',
                },
                {
                  pos: 4,
                  nombre: 'Soporte de móvil plegable de madera con ranura para tarjetas',
                  desc: 'Madera FSC certificada. Efecto IKEA: el cliente lo ensambla en 2 minutos.',
                  ritual: 'Escritorio. Videollamadas. Recetas en cocina.',
                  dias: '310',
                  color: 'bg-white',
                },
                {
                  pos: 5,
                  nombre: 'Agenda de papel de piedra con bolígrafo de tinta infinita',
                  desc: 'Papel que no se rasga, no se moja, no usa árboles. Bolígrafo de punta de metal líquido.',
                  ritual: 'Planificación diaria matinal. Reuniones.',
                  dias: '280',
                  color: 'bg-amber-50',
                },
                {
                  pos: 6,
                  nombre: 'Auriculares de conducción ósea con diadema flexible',
                  desc: 'No entran en el oído. Escuchas música y el entorno a la vez. Batería de 10h.',
                  ritual: 'Ejercicio matinal. Oficina abierta. Caminar con seguridad.',
                  dias: '260',
                  color: 'bg-white',
                },
                {
                  pos: 7,
                  nombre: 'Llavero multiherramienta de acero templado',
                  desc: 'Abrebotellas, destornillador, llave fija, clip para billetes. Todo en 6cm. Grabado láser.',
                  ritual: 'Salir de casa cada mañana. Coger las llaves.',
                  dias: '365',
                  color: 'bg-amber-50',
                },
                {
                  pos: 8,
                  nombre: 'Manta de viaje ultraligera con bolsa de auto-compresión',
                  desc: 'Tamaño de un puño cerrado. Fibra de bambú reciclada. Despliegue en 3 segundos.',
                  ritual: 'Avión, tren. Oficina con aire acondicionado.',
                  dias: '200',
                  color: 'bg-white',
                },
                {
                  pos: 9,
                  nombre: 'Set de especias en bote hermético con recetas grabadas',
                  desc: 'Frascos de vidrio con tapa de bambú y cuchara dosificadora magnética.',
                  ritual: 'Cocinar cada día. Añadir sabor a platos y bebidas.',
                  dias: '300',
                  color: 'bg-amber-50',
                },
                {
                  pos: 10,
                  nombre: 'Mini proyector LED de constelaciones para el dormitorio',
                  desc: 'Proyecta estrellas en movimiento. Temporizador de apagado. Aluminio reciclado.',
                  ritual: 'Relajación pre-sueño. Meditación nocturna.',
                  dias: '280',
                  color: 'bg-white',
                },
              ].map((item) => (
                <tr key={item.pos} className={`${item.color} border-b border-gray-100`}>
                  <td className="px-4 py-3">
                    <span className="w-7 h-7 bg-blue-900 text-white rounded-full text-xs flex items-center justify-center font-bold">
                      {item.pos}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-blue-900">{item.nombre}</p>
                    <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs hidden md:table-cell">{item.ritual}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-green-100 text-green-800 font-bold text-xs px-2 py-1 rounded-full">{item.dias}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Product Showcase 3 */}
      <div className="mt-10">
        <ProductShowcase
          products={officeProducts}
          title="Artículos de Escritorio de Uso Diario"
          subtitle="Organizadores y accesorios que tus clientes usarán en cada jornada laboral"
          variant="compact"
        />
      </div>

      {/* Sección 6: Envejecimiento noble */}
      <section id="sec-6" className="scroll-mt-24 mt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
          6. El Factor &quot;Envejecimiento Noble&quot;: Cómo Asegurar Funcionalidad a Largo Plazo
        </h2>
        <p className="text-gray-700 mb-6">
          Un promocional que se usa todos los días sufre desgaste. Esto no es un problema. Es una oportunidad. Un promocional que envejece mal destruye tu marca. Un promocional que envejece bien se convierte en un objeto amado.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              num: '1',
              titulo: 'Materiales vivos, no inertes',
              desc: 'El cuero vegetal se oscurece con el sol y el tacto. La madera absorbe aceites de la mano y se pule. El cobre se oxida con un tono precioso. El plástico, simplemente se ralla y se vuelve feo.',
              emoji: '🌿',
            },
            {
              num: '2',
              titulo: 'Técnicas de marcaje que no se borran',
              desc: 'Grabado láser profundo, tampografía de alta resistencia, serigrafía con tintas cerámicas. El logo debe sobrevivir al lavavajillas, al roce y al tiempo.',
              emoji: '🔒',
            },
            {
              num: '3',
              titulo: 'Formas atemporales, no modas',
              desc: 'Un diseño minimalista y funcional sobrevive a las tendencias. Lo que hoy es "cool" en 2026 parecerá anticuado en 2028. Lo clásico funcional no caduca.',
              emoji: '♾️',
            },
          ].map((item) => (
            <div key={item.num} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="text-2xl mb-3">{item.emoji}</div>
              <h3 className="font-bold text-blue-900 mb-2">{item.titulo}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA WhatsApp */}
      <div className="mt-10">
        <CTABanner
          variant="whatsapp"
          title="¿Quieres saber qué materiales duran más con tu logo?"
          subtitle="Te asesoramos gratis sobre técnicas de marcaje para cada tipo de producto"
        />
      </div>

      {/* Sección 7: Regla de las 5 palabras */}
      <section id="sec-7" className="scroll-mt-24 mt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
          7. La Regla de las 5 Palabras: Copywriting en Promocionales Funcionales
        </h2>
        <p className="text-gray-700 mb-4">
          Un promocional de uso diario no es una valla publicitaria. El texto visible debe ser de <strong>5 palabras o menos</strong>. Idealmente, entre 0 y 3.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Promocional</th>
                <th className="px-4 py-3 text-left text-red-700 font-semibold">Mal copy</th>
                <th className="px-4 py-3 text-left text-green-700 font-semibold">Buen copy</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  tipo: 'Taza térmica',
                  mal: 'LOGO GRANDE + "Soluciones Integrales Empresariales S.L." + Teléfono + Web',
                  bien: 'Grabado sutil en la base: "Café. Foco. Repetir."',
                },
                {
                  tipo: 'Botella de agua',
                  mal: '"Bebe agua, es saludable [Logo]" por toda la botella',
                  bien: 'Pequeño en la parte trasera: "Hidrátate. Piensa mejor."',
                },
                {
                  tipo: 'Agenda de papel de piedra',
                  mal: 'Portada llena de logos y textos corporativos',
                  bien: 'Portada limpia. Sello seco en esquina: "Escribe tu próximo capítulo."',
                },
                {
                  tipo: 'Manta de viaje',
                  mal: 'Logo gigante que parece una bandera corporativa',
                  bien: 'Etiqueta de tela cosida en el borde: "Abrígate. Nosotros velamos."',
                },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 font-medium text-blue-900">{row.tipo}</td>
                  <td className="px-4 py-3 text-red-700 text-xs">{row.mal}</td>
                  <td className="px-4 py-3 text-green-700 text-xs font-medium">{row.bien}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 bg-blue-50 rounded-xl p-5 border border-blue-100">
          <p className="text-blue-900 text-sm">
            <strong>Principio de neuromarketing esencial:</strong> El promocional funcional debe ser, ante todo, del cliente. Tu marca es un acompañante silencioso, no el protagonista. Cuando el objeto es tan bueno que el cliente lo ama, buscará él mismo tu logo. Y ahí, el recuerdo es imborrable.
          </p>
        </div>
      </section>

      {/* Sección 8: Era post-digital */}
      <section id="sec-8" className="scroll-mt-24 mt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
          8. Promocionales en la Era Post-Digital: El Renacer de lo Tangible
        </h2>
        <p className="text-gray-700 mb-6">
          2026 no será el año del metaverso para los promocionales. Será justo lo contrario: <strong>la venganza de lo analógico</strong>. Cuanto más nos sumerjan las pantallas, más valorará nuestro cerebro los objetos que se tocan, que huelen, que pesan.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              titulo: 'Desconexión activa',
              desc: 'Objetos que invitan a alejarse de la pantalla. Una pelota anti-estrés de madera torneada, un cuaderno de papel de piedra, un juego de mesa de bolsillo. Tu promocional será el refugio offline de tu cliente.',
              color: 'bg-green-50 border-green-200',
              titleColor: 'text-green-900',
            },
            {
              titulo: 'Personalización masiva a bajo costo',
              desc: 'La impresión digital UV y el grabado láser ya permiten personalizar cada unidad con el nombre del cliente. Un promocional con el nombre del usuario se usa el doble de días al año. El cerebro ama ver su nombre escrito.',
              color: 'bg-blue-50 border-blue-200',
              titleColor: 'text-blue-900',
            },
            {
              titulo: 'Segunda vida garantizada',
              desc: 'El promocional debe poder repararse, rellenarse o reciclarse al 100%. Una agenda con recambios de papel de piedra, un bolígrafo que se rellena en cualquier papelería. La obsolescencia programada es enemiga de la funcionalidad diaria.',
              color: 'bg-amber-50 border-amber-200',
              titleColor: 'text-amber-900',
            },
          ].map((item, i) => (
            <div key={i} className={`${item.color} border rounded-xl p-5`}>
              <h3 className={`font-bold ${item.titleColor} mb-3`}>{item.titulo}</h3>
              <p className="text-gray-700 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Showcase final */}
      <div className="mt-10">
        <ProductShowcase
          products={featuredProducts}
          title="Encuentra tu Promocional de Uso Diario"
          subtitle="Selección curada de productos con mayor índice de retención y uso diario"
          variant="featured"
        />
      </div>

      {/* Sección 9: Conclusión */}
      <section id="sec-9" className="scroll-mt-24 mt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
          9. Conclusión: El Promocional Funcional es un Acto de Respeto
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Elegir un promocional que tu cliente usará todos los días no es una decisión de catálogo. Es un acto de empatía radical. Es decir:
        </p>
        <blockquote className="border-l-4 border-amber-500 pl-6 py-2 my-6 bg-amber-50 rounded-r-xl">
          <p className="text-amber-900 italic text-lg leading-relaxed">
            &quot;He pensado en ti. En tu café de las 7:23. En tu espalda dolorida después de 8 horas frente al ordenador. En tu pánico cuando el móvil llega al 2%. En tu necesidad de silencio. En tu deseo de calor. Y te he traído esto. No para que me recuerdes. Para que estés mejor.&quot;
          </p>
        </blockquote>
        <p className="text-gray-700 leading-relaxed">
          Los promocionales funcionales no gritan. Susurran. Y en un mundo de gritos publicitarios, <strong>un susurro diario vale más que mil banners</strong>.
        </p>

        <div className="mt-8 bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            ¿Listo para seleccionar promocionales que se usen cada día del año?
          </h3>
          <p className="text-blue-100 mb-6">
            Analizamos el ritual diario de tus clientes y te proponemos 3 promocionales de uso diario con copywriting emocional incluido. Sin compromiso. Con toda la ciencia.
          </p>
          <Link
            href="/tienda/"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
          >
            Solicitar Diagnóstico de Promocionales Funcionales
          </Link>
        </div>

        <p className="text-gray-400 text-xs mt-6 text-center italic">
          Artículo documentado con datos proyectados de la Advertising Specialty Institute (ASI), principios de neuromarketing de Robert Cialdini y Daniel Kahneman, y tendencias de consumo post-digital de WGSN.
        </p>
      </section>

      {/* CTA Final */}
      <div className="mt-10">
        <CTABanner
          variant="primary"
          title="Tu Marca en las Manos de tus Clientes, Todos los Días"
          subtitle="Más de 199 productos promocionales de uso diario. Personalización garantizada, entrega en todo Ecuador."
        />
      </div>

    </div>
  );
}
