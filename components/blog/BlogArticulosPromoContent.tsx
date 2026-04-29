'use client';

import { useState } from 'react';
import Image from 'next/image';
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
  'El Efecto "Gratis": Dopamina y Reciprocidad',
  'Marketing Háptico: Artículos Sensoriales',
  'Las 3 Intenciones de Búsqueda Ocultas',
  'Segmentación Psicográfica: Los 4 Perfiles',
  'Copywriting en el Producto: Regla 80/20',
  'Tendencias 2025-2026',
  'Test de los 3 Segundos',
  'Glosario del Experto en Merchandising',
  'ROI: Medir lo que Parece Inmedible',
  'Preguntas Frecuentes',
  'Conclusión',
];

export default function BlogArticulosPromoContent() {
  const [tocOpen, setTocOpen] = useState(true);

  const techProducts = getProductsByCategory('Tecnología', 4);
  const ecoProducts = getProductsByCategory('Eco', 3);
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

      <div className="prose prose-lg max-w-none prose-headings:text-blue-900 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline">

        {/* Stat de apertura */}
        <div className="bg-blue-900 text-white rounded-2xl p-6 mb-8 border-l-4 border-amber-400">
          <p className="text-lg font-semibold leading-relaxed m-0">
            ¿Sabías que el{' '}
            <span className="text-amber-400 font-black">85% de los consumidores</span>{' '}
            recuerda al anunciante que le regaló un artículo promocional, incluso dos años después de haberlo recibido?
          </p>
        </div>

        <p className="text-gray-700 leading-relaxed">
          Vivimos en la era de la infoxicación. El consumidor moderno ha desarrollado una habilidad casi mágica: la{' '}
          <strong>ceguera selectiva</strong>. Ignora banners, salta anuncios de YouTube y desvía la mirada de las vallas
          publicitarias. Pero hay un estímulo que su cerebro reptiliano no puede ignorar:{' '}
          <strong>el regalo físico.</strong>
        </p>
        <p className="text-gray-700 leading-relaxed">
          Hoy no vamos a darte una lista aburrida de bolígrafos y tazas. Vamos a sumergirnos en la{' '}
          <strong>psicología profunda</strong> de por qué los artículos promocionales son el caballo de Troya
          definitivo en tu estrategia de marketing. Prepárate para un viaje por los sesgos cognitivos, la dopamina y el
          tacto. Porque sí, tus clientes piensan, pero sobre todo, <em>sienten</em>.
        </p>

        {/* Imagen destacada */}
        <div className="my-8 rounded-2xl overflow-hidden shadow-lg not-prose">
          <Image
            src="/img/blog/articulos-promocionales/4.png"
            alt="Set premium de artículos promocionales personalizados: termos, libretas, gorras y accesorios de marca"
            width={800}
            height={500}
            className="w-full h-auto object-cover"
          />
          <p className="text-xs text-gray-400 text-center bg-gray-50 py-2 px-4">
            Artículos promocionales premium: de la marca al objeto cotidiano de tu cliente
          </p>
        </div>

        {/* ── Sección 1 ── */}
        <section id="sec-1" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            1. El Efecto &ldquo;Gratis&rdquo;: Por Qué tu Cerebro se Rinde ante un Obsequio
          </h2>
          <p>
            Imagina que estás en un supermercado. Hay dos mesas: una ofrece un 50% de descuento en chocolates premium;
            la otra, un pequeño chocolate gratis sin condición alguna. La mayoría se acerca a la mesa de lo gratis.
            Esto no es lógico —el descuento es mejor trato—, es <strong>neurología</strong>.
          </p>
          <p>
            Cuando recibes un artículo promocional de forma inesperada, tu cerebro activa el{' '}
            <strong>Estríado Ventral</strong>, el centro de recompensa. Se libera dopamina, el neurotransmisor del
            placer y la anticipación.
          </p>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">
            El Principio de Reciprocidad: El Ancla Invisible
          </h3>
          <p>
            Robert Cialdini, el gurú de la persuasión, lo demostró: si me das algo, siento una deuda contigo. Es un
            atajo mental evolutivo. Cuando una marca te hace un regalo tangible —una mochila elegante, una batería
            externa de calidad, una libreta sensorial—, tu sistema límbico genera una{' '}
            <em>micro-deuda emocional</em>.
          </p>

          <div className="not-prose bg-blue-50 border-l-4 border-blue-500 p-6 my-6 rounded-r-lg">
            <p className="font-semibold text-blue-900">
              <strong>Aplicación estratégica:</strong> No regales basura. Si regalas un bolígrafo que se rompe en dos
              días, generas una asociación de &ldquo;marca barata&rdquo;. Si regalas un artículo de alta calidad, tu
              cliente pensará: <em>&ldquo;Si su regalo es tan bueno, su producto debe ser espectacular.&rdquo;</em>
            </p>
          </div>

          <div className="not-prose bg-amber-50 border-l-4 border-amber-500 p-6 my-6 rounded-r-lg">
            <p className="text-amber-900">
              <strong>Dato que dispara tu dopamina empresarial:</strong> Según un estudio de la{' '}
              <em>Advertising Specialty Institute (ASI)</em>, los artículos promocionales tienen el{' '}
              <strong>Costo Por Impresión (CPI) más bajo</strong> de todos los medios publicitarios, incluso por
              debajo de la TV y la radio.
            </p>
          </div>
        </section>

        <ProductShowcase
          products={featuredProducts}
          title="Los Artículos Más Recordados por tus Clientes"
          subtitle="Productos que generan dopamina y permanecen en el escritorio, mochila o bolsillo"
          variant="featured"
        />

        {/* ── Sección 2 ── */}
        <section id="sec-2" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            2. Más Allá del Logo: La Era de los Artículos Promocionales Sensoriales
          </h2>
          <p>
            Durante años, la industria se basó en estampar un logo gigante sobre un producto genérico. Eso se llama
            &ldquo;contaminación visual&rdquo;. El neurocopywriting nos enseña que el cerebro ama lo sutil y detesta
            que le vendan.
          </p>
          <p>
            Hoy, hablamos de <strong>Marketing Háptico</strong>. La piel es el órgano más grande del cuerpo y el tacto
            genera confianza. Un estudio publicado en el <em>Journal of Consumer Research</em> reveló que los
            consumidores que sostienen un producto durante más de un minuto están dispuestos a pagar hasta un{' '}
            <strong>30% más</strong> por él.
          </p>
          <p>¿Cómo aplicamos esto a los artículos promocionales?</p>
          <ul>
            <li>
              <strong>Texturas:</strong> Cambia el plástico brillante por bambú, corcho, pizarra reciclada o silicona
              suave al tacto.
            </li>
            <li>
              <strong>Peso:</strong> Un bolígrafo metálico pesado transmite solidez y profesionalidad; uno ligero y
              hueco transmite fragilidad.
            </li>
            <li>
              <strong>Olor:</strong> ¿Por qué no una libreta con aroma a café si eres una cafetería? El bulbo olfatorio
              está conectado directamente con la amígdala y el hipocampo, los centros de la emoción y la memoria.
            </li>
          </ul>
        </section>

        <div className="not-prose my-8 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/img/blog/articulos-promocionales/1.png"
            alt="Artículos promocionales clásicos: tazas con logo, termos, bolígrafos y llaveros personalizados"
            width={800}
            height={500}
            className="w-full h-auto object-cover"
          />
          <p className="text-xs text-gray-400 text-center bg-gray-50 py-2 px-4">
            Desde llaveros hasta termos: cada producto tiene un peso, textura y uso diferente en la mente del cliente
          </p>
        </div>

        {/* ── Sección 3 ── */}
        <section id="sec-3" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            3. Resolviendo la Verdadera Intención de Búsqueda: ¿Qué Busca el Cliente?
          </h2>
          <p>
            Cuando un gerente de marketing busca &ldquo;artículos promocionales&rdquo; en Google, su intención no es{' '}
            <em>comprar cosas</em>. Su intención profunda es una de estas tres:
          </p>

          <div className="not-prose space-y-4 my-6">
            {[
              {
                num: '1',
                title: '"Quiero que recuerden mi marca para siempre"',
                sub: 'Motivación real: ansiedad por el olvido',
              },
              {
                num: '2',
                title: '"Necesito que este presupuesto genere ventas, no solo gastos"',
                sub: 'Motivación real: miedo a la inversión ineficiente',
              },
              {
                num: '3',
                title: '"No quiero quedar mal dando un regalo cutre"',
                sub: 'Motivación real: estatus y reputación',
              },
            ].map(item => (
              <div key={item.num} className="flex gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <span className="w-10 h-10 bg-blue-900 text-white rounded-full text-lg font-black flex items-center justify-center flex-shrink-0">
                  {item.num}
                </span>
                <div>
                  <p className="font-bold text-blue-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">
            Intención #1: &ldquo;Haz que me recuerden&rdquo; (Memoria y Permanencia)
          </h3>
          <p>
            La memoria no es un almacén; es un músculo. La curva del olvido de Ebbinghaus dice que olvidamos el 50%
            de la información nueva en una hora. Un flyer se tira. Un correo se borra.{' '}
            <strong>Un artículo útil se queda.</strong>
          </p>
          <p>
            La clave está en la <strong>permanencia en el campo visual directo</strong>. No sirve regalar un{' '}
            <em>pen drive</em> que el cliente guarda en un cajón oscuro. Sirve regalar un <em>pop socket</em> para el
            móvil (lo ve 80 veces al día), una taza térmica (la usa cada mañana) o una alfombrilla para el ratón con
            un diseño minimalista y una frase de empoderamiento.
          </p>

          <div className="not-prose bg-green-50 border-l-4 border-green-500 p-6 my-6 rounded-r-lg">
            <h4 className="font-bold text-green-900 mb-2">Caso de éxito sensorial:</h4>
            <p className="text-green-800">
              Una aseguradora regaló pelotas anti-estrés con forma de cerebro. Pero no eran simples pelotas: estaban{' '}
              <strong>perfumadas con lavanda</strong>. Cada vez que el cliente se estresaba, apretaba el cerebro, olía
              la lavanda y… adivinad a quién llamaba para sentirse protegido.
            </p>
          </div>
        </section>

        <CTABanner
          variant="inline"
          title="¿Cuál es la intención de tu próxima campaña?"
          subtitle="Te ayudamos a elegir el artículo que ancla tu marca en la mente del cliente"
        />

        {/* ── Sección 4 ── */}
        <section id="sec-4" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            4. Segmentación Psicográfica: El Error de Regalar por Talla Única
          </h2>
          <p>
            Aquí está el 90% del dinero malgastado en marketing promocional. No puedes darle lo mismo a un CEO que a
            un universitario. Sus cerebros buscan recompensas distintas.
          </p>

          <div className="not-prose grid sm:grid-cols-2 gap-5 my-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">👔</span>
                <div>
                  <h4 className="font-bold text-blue-900">El Ejecutivo Lógico</h4>
                  <p className="text-xs text-gray-500">Audiencia B2B — Prefrontal Cortex dominante</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Busca:</strong> Eficiencia, orden, estatus silencioso.
              </p>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>✅ Cuadernos inteligentes reutilizables</li>
                <li>✅ Baterías de carga rápida inalámbrica</li>
                <li>✅ Kits de escritura de bambú grabados con láser</li>
                <li>❌ Lapiceros de plástico o peluches</li>
              </ul>
              <p className="text-xs text-blue-700 font-semibold mt-3">
                Palabra clave emocional: <em>Productividad</em>
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🎨</span>
                <div>
                  <h4 className="font-bold text-blue-900">El Creativo Emocional</h4>
                  <p className="text-xs text-gray-500">Audiencia Lifestyle — Amígdala activa</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Busca:</strong> Inspiración, autenticidad, salirse del molde.
              </p>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>✅ Set de acuarelas portátiles con branding en caja metálica</li>
                <li>✅ Plantas con frase: &ldquo;Crecemos contigo&rdquo;</li>
                <li>✅ Libretas con frases inspiradoras aleatorias</li>
                <li>❌ Artículos genéricos sin personalidad</li>
              </ul>
              <p className="text-xs text-purple-700 font-semibold mt-3">
                Palabra clave emocional: <em>Tribu</em>
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🏡</span>
                <div>
                  <h4 className="font-bold text-blue-900">El Amante del Hogar</h4>
                  <p className="text-xs text-gray-500">Audiencia Family — Seguridad</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Busca:</strong> Confort, protección, ahorro.
              </p>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>✅ Mandiles de tela vaquera con bolsillos</li>
                <li>✅ Tarros de cultivo hidropónico</li>
                <li>✅ Velas de masaje de soja</li>
              </ul>
              <p className="text-xs text-green-700 font-semibold mt-3">
                Palabra clave emocional: <em>Cuidado</em>
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-emerald-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🌱</span>
                <div>
                  <h4 className="font-bold text-blue-900">El Eco-Consciente</h4>
                  <p className="text-xs text-gray-500">Audiencia Sostenible — Sistema de Valores</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                <strong>No basta con que &ldquo;no sea plástico&rdquo;.</strong> Debe contar una historia de impacto.
              </p>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>✅ Bolígrafos plantables (siémbralos, crecen)</li>
                <li>✅ Botellas con funda de corcho natural</li>
                <li>✅ Mochilas hechas con lonas recicladas (Upcycling)</li>
              </ul>
              <p className="text-xs text-emerald-700 font-semibold mt-3">
                Palabra clave emocional: <em>Coherencia</em>
              </p>
            </div>
          </div>

          <div className="not-prose bg-amber-50 border-l-4 border-amber-500 p-6 my-6 rounded-r-lg">
            <p className="text-amber-900">
              <strong>Gatillo mental de coherencia (Cialdini):</strong> Si tu cliente se define como ecologista y le
              das plástico, entra en disonancia cognitiva y te rechaza. Si le das semillas, se alinea con su identidad
              y <em>te ama</em>.
            </p>
          </div>
        </section>

        <div className="not-prose my-8 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/img/blog/articulos-promocionales/2.png"
            alt="Gran variedad de artículos promocionales: gorras, paraguas, polos, gafas, tazas y botellas para diferentes audiencias"
            width={800}
            height={500}
            className="w-full h-auto object-cover"
          />
          <p className="text-xs text-gray-400 text-center bg-gray-50 py-2 px-4">
            Un abanico de posibilidades: cada perfil psicográfico tiene su artículo ideal
          </p>
        </div>

        <ProductShowcase
          products={techProducts}
          title="Para el Ejecutivo Lógico: Tecnología con Propósito"
          subtitle="Los artículos tech que generan productividad y estatus silencioso"
          variant="default"
        />

        {/* ── Sección 5 ── */}
        <section id="sec-5" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            5. El Copywriting en el Producto: Tu Regalo Debe Hablar
          </h2>
          <p>
            Un error fatal es poner el logo y el teléfono. Eso es un anuncio andante, no un regalo. El neuromarketing
            dicta que el <em>branding</em> debe ser el contexto, no el contenido.
          </p>

          <div className="not-prose bg-blue-900 text-white rounded-2xl p-6 my-6">
            <h4 className="text-amber-400 font-bold text-lg mb-4">Regla 80/20 en Artículos Promocionales</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="font-bold text-amber-400 mb-1">80% — Valor para el usuario</p>
                <p className="text-sm text-blue-100">Diseño, utilidad, frase que ama.</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="font-bold text-blue-300 mb-1">20% — Marca</p>
                <p className="text-sm text-blue-100">Sutil, elegante, grabado en bajo relieve o en el interior.</p>
              </div>
            </div>
          </div>

          <p>Ejemplos de frases de copy en productos que generan engagement:</p>

          <div className="not-prose overflow-x-auto my-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="p-3 text-left rounded-tl-lg">Producto</th>
                  <th className="p-3 text-left text-red-300">❌ Copy Malo</th>
                  <th className="p-3 text-left text-green-300 rounded-tr-lg">✅ Copy Bueno</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Taza de cerámica', 'LOGO GRANDE + "Líderes en tecnología"', '"Código, café, repetir." (grabado en la base)'],
                  ['Eco-bolsa', '"Supermercados X: Siempre contigo"', '"Llevo mi ensalada y mis asuntos legales aquí."'],
                  ['Auriculares', 'Logo de la financiera en la diadema', '"Modo silencio: negocios importantes en proceso."'],
                  ['Gorra', 'Logo de la inmobiliaria al frente', 'Sin logo delante. Detrás bordado: "Claves en mano."'],
                ].map(([product, bad, good], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-3 font-semibold text-blue-900 border-b border-gray-100">{product}</td>
                    <td className="p-3 text-red-600 border-b border-gray-100">{bad}</td>
                    <td className="p-3 text-green-700 border-b border-gray-100">{good}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ProductShowcase
          products={officeProducts}
          title="Artículos de Oficina con Copywriting Inteligente"
          subtitle="Productos donde el diseño habla más que el logo"
          variant="compact"
        />

        {/* ── Sección 6 ── */}
        <section id="sec-6" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            6. Tendencias 2025-2026: El Metaverso se Toca con las Manos
          </h2>
          <p>
            Paradójicamente, cuanto más digitales nos volvemos, más ansiamos lo físico. A esto lo llamamos{' '}
            <strong>Marketing de los 5 Sentidos</strong>.
          </p>

          <div className="not-prose space-y-5 my-6">
            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
              <h3 className="text-lg font-bold text-blue-900 mb-2">🔌 1. Tecnología Vestible No Digital</h3>
              <p className="text-gray-700">
                Las marcas de software están regalando <strong>parches bordados para chaquetas</strong>. Las startups
                tecnológicas regalan pegatinas holográficas para portátiles. Es la identidad analógica del yo digital.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-amber-500">
              <h3 className="text-lg font-bold text-blue-900 mb-2">📦 2. El &ldquo;Unboxing&rdquo; Emocional</h3>
              <p className="text-gray-700">
                El empaque es casi más importante que el artículo. Si abres una caja y huele a madera de sándalo, tu
                percepción de valor se dispara. Incluye papel de seda negro, una cuerda de yute, una nota escrita a
                mano. Estás activando el <strong>efecto Halo</strong>: si el envoltorio es premium, el producto de tu
                empresa es premium.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-blue-900 mb-2">🍷 3. El Giveaway Experiencial</h3>
              <p className="text-gray-700">
                Aquí no damos objetos, damos momentos. Un termo con una etiqueta:{' '}
                <em>&ldquo;Escanea y te llevamos a una cata de vinos virtual con sommelier.&rdquo;</em> Estás cruzando
                el artículo promocional con la experiencia de marca.
              </p>
            </div>
          </div>
        </section>

        <CTABanner
          variant="whatsapp"
          title="¿Listo para lanzar tu próxima campaña sensorial?"
          subtitle="Cuéntanos tu sector y armamos las 3 propuestas perfectas para tu audiencia"
        />

        {/* ── Sección 7 ── */}
        <section id="sec-7" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            7. El Error del Producto &ldquo;Aspiradora&rdquo; y el Test de los 3 Segundos
          </h2>
          <p>
            En la industria a veces se eligen regalos que funcionan como &ldquo;aspiradoras de polvo&rdquo;: están en
            la mesa, pero nadie los quiere. Acaban en un cajón.
          </p>
          <p>
            <strong>Antes de elegir un artículo promocional, hazte estas 3 preguntas:</strong>
          </p>

          <div className="not-prose grid sm:grid-cols-3 gap-4 my-6">
            {[
              {
                num: '1',
                q: '¿Salva un micro-momento de aburrimiento?',
                ej: 'Spinners de diseño, mini puzzles metálicos',
              },
              {
                num: '2',
                q: '¿Alivia un micro-dolor?',
                ej: 'Bálsamo labial en invierno, repelente natural en verano, soporte lumbar para coworking',
              },
              {
                num: '3',
                q: '¿Le da estatus dentro de su manada?',
                ej: 'Una libreta con frases de liderazgo que solo se regala a "clientes VIP"',
              },
            ].map(item => (
              <div
                key={item.num}
                className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100 shadow-sm"
              >
                <span className="w-8 h-8 bg-blue-900 text-white rounded-full text-sm font-black flex items-center justify-center mb-3">
                  {item.num}
                </span>
                <p className="font-bold text-blue-900 text-sm mb-2">{item.q}</p>
                <p className="text-xs text-gray-500">
                  <em>Ej: {item.ej}</em>
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="not-prose my-8 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/img/blog/articulos-promocionales/3.png"
            alt="Colección amplia de artículos promocionales sobre fondo blanco: bolígrafos, termos, tazas, relojes y llaveros"
            width={800}
            height={500}
            className="w-full h-auto object-cover bg-white"
          />
          <p className="text-xs text-gray-400 text-center bg-gray-50 py-2 px-4">
            Más de 1.000 artículos disponibles: cada uno con un uso diferente en la vida diaria de tu cliente
          </p>
        </div>

        {/* ── Sección 8 ── */}
        <section id="sec-8" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            8. Glosario del Experto en Merchandising
          </h2>
          <p>La jerga técnica traducida al lenguaje de resultados:</p>

          <div className="not-prose space-y-3 my-6">
            {[
              {
                term: 'PLV',
                full: 'Publicidad en el Lugar de Venta',
                desc: 'Tus artículos promocionales colocados en una oficina son PLV portátil. Convierten el escritorio del cliente en tu showroom.',
              },
              {
                term: 'Tampografía',
                full: 'Impresión calcográfica',
                desc: 'Perfecta para superficies curvas irregulares como pelotas de golf. Más precisa que la serigrafía.',
              },
              {
                term: 'Grabado Láser',
                full: 'Sin tinta — eliminación de capa superficial',
                desc: 'Táctil y eterno. Transmite lujo. Ideal para metal, cuero y madera.',
              },
              {
                term: 'Full-Color UV',
                full: 'Impresión digital directa',
                desc: 'Permite imprimir fotos complejas sobre casi cualquier material rígido. Ideal si tu marca tiene ilustraciones potentes.',
              },
              {
                term: 'RPET',
                full: 'PET Reciclado (botellas → tejido)',
                desc: 'Tejido de botellas de plástico recicladas. Si tu briefing pide mochilas sostenibles, pide RPET 600D.',
              },
            ].map(item => (
              <div key={item.term} className="flex gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <span className="bg-blue-900 text-white text-xs font-bold px-3 py-1 rounded-lg h-fit whitespace-nowrap flex-shrink-0">
                  {item.term}
                </span>
                <div>
                  <p className="font-semibold text-blue-900 text-sm">{item.full}</p>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Sección 9 ── */}
        <section id="sec-9" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            9. Midiendo lo Inmedible: ROI en Artículos Promocionales
          </h2>
          <p>
            ¿Cómo sabes si esos 2.000 power banks que repartiste en la feria sirvieron? No es magia, es{' '}
            <strong>trazabilidad</strong>.
          </p>

          <div className="not-prose space-y-4 my-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span>📱</span> Códigos QR Dinámicos Ocultos
              </h4>
              <p className="text-gray-700 text-sm">
                No pongas un QR feo. Grábalo en la etiqueta de la camiseta o en el fondo de la taza. Que lleve a una
                landing exclusiva:{' '}
                <code className="bg-gray-100 px-1 rounded text-xs">tuplan/regalo</code>. Así sabrás el tráfico
                atribuido a ese artículo.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span>#️⃣</span> Hashtag de Tribu
              </h4>
              <p className="text-gray-700 text-sm">
                <em>
                  &ldquo;¿Te gusta la mochila? Comparte tu setup con #MiMarcaNómada y participa por un curso
                  gratis.&rdquo;
                </em>{' '}
                Estás convirtiendo un artículo en UGC (Contenido Generado por el Usuario).
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span>📲</span> Tarjetas NFC: El Nuevo Bolígrafo
              </h4>
              <p className="text-gray-700 text-sm">
                Acercas el móvil y abre la agenda de reservas. Un{' '}
                <strong>40% de las personas que las reciben las guardan en la cartera detrás del móvil</strong>. Tasa
                de interacción imbatible.
              </p>
            </div>
          </div>
        </section>

        <ProductShowcase
          products={ecoProducts.length >= 2 ? ecoProducts : techProducts}
          title="Artículos con ROI Medible"
          subtitle="Productos que combinan impacto de marca con trazabilidad digital"
          variant="compact"
        />

        {/* ── Sección 10 ── */}
        <section id="sec-10" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            10. Preguntas Frecuentes que Debes Hacerte Antes de Comprar
          </h2>

          <div className="not-prose space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-bold text-blue-900 mb-3">¿Calidad asiática barata o europea cara?</h4>
              <p className="text-gray-700 text-sm">
                <strong>Respuesta neurocientífica:</strong> Si tu producto/servicio es de bajo coste, el cliente espera
                un regalo coherente. Si eres un abogado de élite o vendes software de alta facturación, un regalo
                barato genera disonancia y desconfianza.{' '}
                <strong>Nunca regales hacia abajo.</strong>
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-bold text-blue-900 mb-3">¿Uno caro para pocos o muchos baratos?</h4>
              <p className="text-gray-700 text-sm">
                <strong>Regla del anclaje:</strong> Es mejor dar 10 regalos sensacionales a clientes potenciales muy
                calientes que 1.000 regalos mediocres que acaben en la basura. El boca a oreja de esos 10 clientes{' '}
                <em>&ldquo;wow&rdquo;</em> será tu verdadero retorno.
              </p>
            </div>
          </div>
        </section>

        <CTABanner
          variant="primary"
          title="¿Listo para Hackear el Cerebro de tus Clientes?"
          subtitle="Dinos tu sector y te enviamos 3 propuestas concretas que dispararán la dopamina de tu audiencia."
        />

        {/* ── Sección 11 ── */}
        <section id="sec-11" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            11. El Futuro es Táctil: Conclusión
          </h2>
          <p>
            Los artículos promocionales no son un gasto; son un <strong>anclaje somático</strong>. En un mundo de
            inteligencia artificial y realidades virtuales, el tacto humano es el lujo definitivo. Tu marca deja de
            ser un concepto abstracto y se convierte en un objeto que pesa, huele y permanece.
          </p>
          <p>
            No compres regalos. Compra <strong>consolidación de recuerdos emocionales</strong>.
          </p>

          <div className="not-prose bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 my-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Estás listo para hackear el cerebro de tus clientes con tacto?
            </h3>
            <p className="text-blue-100 mb-6">
              Dinos tu sector y te enviamos 3 propuestas concretas que dispararán la dopamina de tu audiencia. Sin
              compromiso, con toda la ciencia.
            </p>
            <Link
              href="/tienda/"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 no-underline"
            >
              Ver Catálogo Completo
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
