'use client';

import { useEffect, useRef, useState } from 'react';

interface FaqItem {
  index: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    index: '01',
    question: '¿Qué son los artículos promocionales?',
    answer: 'Son productos que pueden incorporar la identidad de una empresa y utilizarse en campañas, eventos, programas internos, acciones comerciales o regalos corporativos. Su propósito es crear una interacción útil y mantener visible la marca.',
  },
  {
    index: '02',
    question: '¿Qué artículos promocionales se pueden personalizar?',
    answer: 'La personalización depende del material y del modelo. Entre las opciones habituales se encuentran bolígrafos, cuadernos, mugs, bolsos, llaveros, textiles y accesorios tecnológicos. En cada caso se debe confirmar la técnica compatible.',
  },
  {
    index: '03',
    question: '¿Cómo puedo solicitar una cotización?',
    answer: 'Selecciona el producto de interés y envía la cantidad, ciudad, fecha estimada y detalles de personalización. Con esa información podremos revisar las opciones disponibles y preparar una propuesta.',
  },
  {
    index: '04',
    question: '¿Existe una cantidad mínima de pedido?',
    answer: 'La cantidad mínima puede cambiar según el producto y la técnica de personalización. Consulta el modelo que te interesa para recibir información precisa.',
  },
  {
    index: '05',
    question: '¿Qué necesito para personalizar un producto con mi logotipo?',
    answer: 'Es recomendable contar con el logotipo en un archivo vectorial o de buena resolución. Si todavía no tienes el formato adecuado, consulta con el equipo qué alternativas de revisión están disponibles.',
  },
  {
    index: '06',
    question: '¿Realizan entregas de artículos promocionales en Ecuador?',
    answer: 'La cobertura y las condiciones de entrega dependen de la ubicación y de las características del pedido. Indica tu ciudad al solicitar la cotización para confirmar disponibilidad, costo y tiempo estimado.',
  },
  {
    index: '07',
    question: '¿Cuánto tarda un pedido personalizado?',
    answer: 'El plazo depende del artículo, cantidad, técnica, disponibilidad y aprobación del diseño. Para recibir una estimación, comparte la fecha en la que necesitas el pedido desde el inicio de la solicitud.',
  },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cancelled = false;
    let revert: (() => void) | undefined;

    (async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const items = itemRefs.current.filter(Boolean) as HTMLElement[];

        if (prefersReduced) {
          gsap.set([eyebrowRef.current, titleRef.current, ...items], { opacity: 1, autoAlpha: 1, y: 0, scaleX: 1 });
          return;
        }

        const intro = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 74%', toggleActions: 'play none none reverse' } });
        intro
          .from(eyebrowRef.current, { autoAlpha: 0, y: 16, duration: 0.65, ease: 'power3.out' })
          .from(titleRef.current, { autoAlpha: 0, yPercent: 108, duration: 1.1, ease: 'power4.out' }, 0.08);

        gsap.from(items, {
          autoAlpha: 0,
          y: 30,
          duration: 0.75,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: { trigger: listRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      }, section);

      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <section id="preguntas-frecuentes" ref={sectionRef} aria-labelledby="faq-title" className="relative overflow-clip bg-[#f8f3e9] text-navy-900" style={{ paddingBlock: 'clamp(9rem, 16vw, 18rem) clamp(10rem, 18vw, 20rem)' }}>
      <div className="w-full max-w-[120rem] mx-auto px-5 sm:px-8 lg:px-[5rem] grid grid-cols-1 lg:grid-cols-12 gap-x-6 items-start">
        <header className="lg:col-span-4 lg:sticky mb-14 lg:mb-0" style={{ top: 'clamp(6rem, 11vh, 9rem)' }}>
          <p ref={eyebrowRef} className="m-0 text-navy-900/[52%] text-xs font-semibold tracking-[0.13em] uppercase">
            Información esencial · 01—07
          </p>

          <div className="overflow-hidden pb-[0.08em] mt-10">
            <h2
              id="faq-title"
              ref={titleRef}
              className="h2-section max-w-none lg:max-w-[9ch]"
              style={{ textWrap: 'balance' }}
            >
              Preguntas frecuentes sobre artículos promocionales
            </h2>
          </div>

          <div aria-hidden="true" className="mt-10 flex gap-2 text-navy-900/[42%] text-xs tracking-[0.1em]" style={{ fontVariantNumeric: 'tabular-nums' }}>
            <span className="text-[#b79970]">{FAQS[openIndex].index}</span>
            <span>/</span>
            <span>07</span>
          </div>

          <p className="max-w-[27ch] mt-4 text-navy-900/[48%] text-sm" style={{ lineHeight: 1.55 }}>
            Selecciona una pregunta para consultar la respuesta.
          </p>
        </header>

        <div ref={listRef} className="lg:col-start-6 lg:col-span-7 min-w-0">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <article
                key={faq.index}
                ref={(el) => { itemRefs.current[i] = el; }}
                className="relative transition-opacity duration-500"
                style={{ opacity: isOpen ? 1 : 0.58 }}
              >
                <div aria-hidden="true" className="w-full h-px bg-navy-900/[18%]" />

                <h3 className="m-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.index}`}
                    id={`faq-trigger-${faq.index}`}
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    className="w-full py-9 grid gap-3 lg:gap-6 items-start text-left bg-transparent border-0 cursor-pointer"
                    style={{ minHeight: 'clamp(7rem, 11vw, 10rem)', gridTemplateColumns: '2rem minmax(0,1fr) 2rem' }}
                  >
                    <span
                      aria-hidden="true"
                      className="pt-1 text-xs font-semibold tracking-[0.1em] transition-[color,transform] duration-500"
                      style={{ color: isOpen ? '#b79970' : 'rgba(10,26,47,0.4)', transform: isOpen ? 'translateX(0.25rem)' : 'none', fontVariantNumeric: 'tabular-nums' }}
                    >
                      {faq.index}
                    </span>
                    <span
                      className="transition-colors duration-500"
                      style={{ fontSize: 'clamp(1.15rem, 1.65vw, 1.65rem)', fontWeight: isOpen ? 600 : 500, lineHeight: 1.35, letterSpacing: '-0.025em', color: isOpen ? '#0A1A2F' : 'rgba(10,26,47,0.68)' }}
                    >
                      {faq.question}
                    </span>
                    <span aria-hidden="true" className="relative w-5 h-5 mt-1 justify-self-end transition-transform duration-500" style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}>
                      <span className="absolute top-1/2 left-1/2 w-full h-px bg-current" style={{ transform: 'translate(-50%,-50%)' }} />
                      <span className="absolute top-1/2 left-1/2 w-full h-px bg-current" style={{ transform: 'translate(-50%,-50%) rotate(90deg)' }} />
                    </span>
                  </button>
                </h3>

                <div
                  id={`faq-answer-${faq.index}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${faq.index}`}
                  className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-700 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0 }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[58ch] text-navy-900/70" style={{ fontSize: 'clamp(1rem, 1.08vw, 1.14rem)', lineHeight: 1.72, paddingLeft: 'calc(2rem + 0.75rem)', paddingBottom: 'clamp(2.5rem, 5vw, 5rem)' }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
          <div aria-hidden="true" className="w-full h-px bg-navy-900/[18%]" />
        </div>
      </div>
    </section>
  );
}
