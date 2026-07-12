'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Technique {
  key: string;
  index: string;
  title: string;
  description: string;
  image?: string;
}

const TECHNIQUES: Technique[] = [
  {
    key: 'screen-printing',
    index: '01',
    title: 'Serigrafía',
    description: 'Una alternativa utilizada para aplicar diseños sobre diferentes superficies, especialmente cuando se requieren colores definidos y buena visibilidad.',
    image: '/img/tecnicas/serigrafia.png',
  },
  {
    key: 'pad-printing',
    index: '02',
    title: 'Tampografía',
    description: 'Adecuada para determinados artículos pequeños o con superficies que requieren una aplicación precisa.',
    image: '/img/tecnicas/tampografia.png',
  },
  {
    key: 'sublimation',
    index: '03',
    title: 'Sublimación',
    description: 'Recomendada para productos compatibles con esta técnica cuando el diseño requiere color y mayor detalle.',
    image: '/img/tecnicas/sublimacion.png',
  },
  {
    key: 'laser',
    index: '04',
    title: 'Grabado láser',
    description: 'Produce un acabado permanente y sobrio en materiales compatibles, especialmente útil para obsequios corporativos.',
    image: '/img/tecnicas/grabado-laser.png',
  },
  {
    key: 'embroidery',
    index: '05',
    title: 'Bordado',
    description: 'Una opción resistente para textiles, gorras, mochilas y otros productos compatibles.',
    image: '/img/tecnicas/bordados.png',
  },
];

function TechniqueVisual({ title, image, priority }: { title: string; image?: string; priority?: boolean }) {
  if (image) {
    return (
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 1023px) 92vw, 44vw"
          priority={priority}
          className="object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(6,15,28,0.55), transparent 45%)' }} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-8" style={{ background: 'linear-gradient(155deg, #0A1A2F 0%, #152945 60%, #0A1A2F 100%)' }}>
      <span aria-hidden="true" className="font-extrabold text-white/[12%]" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
        {title[0]}
      </span>
      <p className="text-white/40 text-xs font-semibold tracking-[0.12em] uppercase max-w-[20ch]">
        {title} · Fotografía de muestra pendiente
      </p>
    </div>
  );
}

export default function Personalizacion() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const techniqueRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

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

      const techniques = techniqueRefs.current.filter(Boolean) as HTMLElement[];

      const ctx = gsap.context(() => {
        if (prefersReduced) {
          gsap.set([eyebrowRef.current, titleRef.current, introRef.current, ...techniques], {
            opacity: 1,
            autoAlpha: 1,
            y: 0,
            scaleX: 1,
          });
        } else {
          const headerTimeline = gsap.timeline({
            scrollTrigger: { trigger: section.querySelector('.craftsmanship__header'), start: 'top 74%', toggleActions: 'play none none reverse' },
          });
          headerTimeline
            .from(eyebrowRef.current, { autoAlpha: 0, y: 16, duration: 0.65, ease: 'power3.out' })
            .from(titleRef.current, { autoAlpha: 0, yPercent: 108, duration: 1.15, ease: 'power4.out' }, 0.08)
            .from(introRef.current, { autoAlpha: 0, yPercent: 105, duration: 0.9, ease: 'power3.out' }, 0.43);

          techniques.forEach((technique) => {
            const line = technique.querySelector('.technique__line');
            const index = technique.querySelector('.technique__index');
            const title = technique.querySelector('.technique__title');
            const description = technique.querySelector('.technique__description');

            gsap
              .timeline({ scrollTrigger: { trigger: technique, start: 'top 78%', toggleActions: 'play none none reverse' } })
              .from(line, { scaleX: 0, transformOrigin: 'left', duration: 0.9, ease: 'power3.out' })
              .from(index, { autoAlpha: 0, y: 14, duration: 0.55, ease: 'power3.out' }, 0.15)
              .from(title, { autoAlpha: 0, y: 58, duration: 0.9, ease: 'power4.out' }, 0.22)
              .from(description, { autoAlpha: 0, y: 30, duration: 0.75, ease: 'power3.out' }, 0.4);
          });
        }

        techniques.forEach((technique, i) => {
          ScrollTrigger.create({
            trigger: technique,
            start: 'top 54%',
            end: 'bottom 46%',
            onEnter: () => setActiveIndex(i),
            onEnterBack: () => setActiveIndex(i),
          });
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
    <section
      id="personalizacion"
      ref={sectionRef}
      aria-labelledby="craftsmanship-title"
      className="relative overflow-clip text-white"
      style={{ background: 'radial-gradient(circle at 18% 42%, rgba(21,101,255,0.14), transparent 35rem), #060F1C' }}
    >
      <div className="craftsmanship__header w-full max-w-[120rem] mx-auto px-5 sm:px-8 lg:px-[5rem] grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-x-4 lg:gap-x-6 items-start py-32 md:py-36 lg:py-56">
        <p ref={eyebrowRef} className="col-span-4 lg:col-start-1 lg:col-span-2 pt-3 text-white/[54%] text-xs font-semibold tracking-[0.13em] uppercase">
          Estudio de acabados · 01—05
        </p>
        <div className="col-span-4 md:col-span-6 lg:col-start-3 lg:col-span-8 mt-6 lg:mt-0 overflow-hidden pb-[0.08em]">
          <h2
            id="craftsmanship-title"
            ref={titleRef}
            className="h2-section max-w-[11ch] lg:max-w-[10ch]"
            style={{ textWrap: 'balance' }}
          >
            Personaliza cada artículo con la identidad de tu marca
          </h2>
        </div>
        <div className="col-span-4 md:col-span-6 lg:col-start-8 lg:col-span-5 mt-8 lg:mt-28 overflow-hidden">
          <p ref={introRef} className="max-w-[42ch] text-white/70" style={{ fontSize: 'clamp(1rem, 1.2vw, 1.22rem)', lineHeight: 1.65 }}>
            La técnica de personalización depende del material, diseño, cantidad y acabado esperado. Nuestro equipo puede ayudarte a revisar cuál es compatible con el artículo seleccionado.
          </p>
        </div>
      </div>

      <div className="w-full max-w-[120rem] mx-auto px-5 sm:px-8 lg:px-[5rem] grid grid-cols-1 lg:grid-cols-12 gap-x-6 pb-40 lg:pb-64">
        {/* Sticky visual column — desktop only */}
        <div className="hidden lg:block lg:col-span-7 relative">
          <div className="sticky top-24">
            <div className="relative w-full overflow-hidden" style={{ height: 'min(76svh, 53rem)', minHeight: '36rem', background: '#0A1A2F', isolation: 'isolate' }}>
              {TECHNIQUES.map((t, i) => (
                <div
                  key={t.key}
                  className="absolute inset-0 transition-[opacity,transform] duration-700 ease-out"
                  style={{ opacity: activeIndex === i ? 1 : 0, transform: activeIndex === i ? 'scale(1)' : 'scale(1.065)', visibility: activeIndex === i ? 'visible' : 'hidden' }}
                  aria-hidden="true"
                >
                  <TechniqueVisual title={t.title} image={t.image} priority={i === 0} />
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center gap-8 pt-5 text-white/[48%] text-xs font-semibold tracking-[0.1em] uppercase">
              <p className="m-0">
                <span className="text-sky-300" style={{ fontVariantNumeric: 'tabular-nums' }}>{TECHNIQUES[activeIndex].index}</span>
                <span aria-hidden="true"> / 05</span>
              </p>
              <p className="m-0">{TECHNIQUES[activeIndex].image ? TECHNIQUES[activeIndex].title : 'Fotografía de acabado en preparación'}</p>
            </div>
          </div>
        </div>

        {/* Narrative column */}
        <div aria-label="Técnicas de personalización" className="lg:col-start-9 lg:col-span-4 min-w-0">
          {TECHNIQUES.map((t, i) => (
            <article
              key={t.key}
              ref={(el) => { techniqueRefs.current[i] = el; }}
              className="relative pt-8 lg:min-h-[88svh] flex flex-col justify-center transition-opacity duration-700"
              style={{ opacity: activeIndex === i ? 1 : 0.42 }}
            >
              <div
                className="technique__line absolute top-0 left-0 right-0 transition-[height,background-color] duration-700"
                style={{ height: activeIndex === i ? '2px' : '1px', background: activeIndex === i ? '#00BFFF' : 'rgba(255,255,255,0.17)' }}
              />

              {/* Mobile-only inline visual per technique */}
              <div className="lg:hidden relative w-full aspect-[4/5] mb-10 overflow-hidden mt-8">
                <TechniqueVisual title={t.title} image={t.image} priority={i === 0} />
              </div>

              <p className="technique__index text-sky-200/[58%] text-xs font-semibold tracking-[0.12em] uppercase mb-10 lg:mb-16" style={{ fontVariantNumeric: 'tabular-nums' }}>
                Técnica {t.index}
              </p>

              <h3
                className="technique__title h2-section transition-colors duration-700"
                style={{ color: activeIndex === i ? '#ffffff' : 'rgba(255,255,255,0.72)' }}
              >
                {t.title}
              </h3>

              <p
                className="technique__description max-w-[40ch] mt-7 transition-colors duration-700"
                style={{ fontSize: 'clamp(1rem, 1.08vw, 1.15rem)', lineHeight: 1.65, color: activeIndex === i ? 'rgba(255,255,255,0.78)' : 'rgba(255,255,255,0.62)' }}
              >
                {t.description}
              </p>
            </article>
          ))}

          <aside className="mt-16 py-8 border-y border-white/[16%]">
            <p className="max-w-[45ch] text-white/[48%] text-sm" style={{ lineHeight: 1.65 }}>
              Las técnicas disponibles dependen del material, la forma del producto, el diseño y la cantidad solicitada. Confirma la compatibilidad antes de aprobar tu pedido.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
