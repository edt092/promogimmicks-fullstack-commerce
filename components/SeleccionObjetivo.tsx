'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Objective {
  key: string;
  number: string;
  title: string;
  description: string;
  linkText: string;
  href: string;
  image: string;
  caption: string;
}

const OBJECTIVES: Objective[] = [
  {
    key: 'events',
    number: '01',
    title: 'Para eventos y ferias',
    description: 'Aumenta la visibilidad de tu empresa con artículos prácticos que puedan entregarse durante activaciones, exposiciones, congresos y lanzamientos.',
    linkText: 'Explorar promocionales para eventos',
    href: '/tienda/',
    image: '/img/productos/identificador-de-maletas-cork-10357.jpg',
    caption: 'Visibilidad en movimiento',
  },
  {
    key: 'clients',
    number: '02',
    title: 'Para clientes',
    description: 'Refuerza relaciones comerciales con artículos útiles que mantengan tu marca presente después de cada interacción.',
    linkText: 'Explorar regalos para clientes',
    href: '/tienda/',
    image: '/img/productos/mug-metalico-troy-300ml-10341.jpg',
    caption: 'Relaciones que permanecen',
  },
  {
    key: 'sustainable',
    number: '03',
    title: 'Para campañas sostenibles',
    description: 'Descubre productos promocionales con materiales alternativos para iniciativas que buscan comunicar una visión más responsable.',
    linkText: 'Explorar promocionales ecológicos',
    href: '/tienda/categoria/ecologia/',
    image: '/img/productos/espejo-cork-ii-10689.jpg',
    caption: 'Materiales con otra perspectiva',
  },
];

export default function SeleccionObjetivo() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    (async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const panels = panelRefs.current.filter(Boolean) as HTMLElement[];

        const introTimeline = gsap.timeline({
          scrollTrigger: { trigger: section, start: 'top 72%', toggleActions: 'play none none reverse' },
        });

        introTimeline
          .from(eyebrowRef.current, { autoAlpha: 0, y: 16, duration: 0.65, ease: 'power3.out' })
          .from(titleRef.current, { autoAlpha: 0, yPercent: 108, duration: 1.15, ease: 'power4.out' }, 0.08)
          .from(selectorRef.current, { clipPath: 'inset(12% 0% 12% 0%)', autoAlpha: 0, y: 70, duration: 1.2, ease: 'power4.out' }, 0.35)
          .from(panels, { autoAlpha: 0, x: 48, stagger: 0.09, duration: 0.85, ease: 'power3.out' }, 0.62);
      }, section);

      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <section id="seleccion-por-objetivo" ref={sectionRef} aria-labelledby="objective-title" className="relative overflow-clip bg-white text-navy-900 pt-28 md:pt-32 lg:pt-56">
      <div className="w-full max-w-[120rem] mx-auto px-5 sm:px-8 lg:px-[5rem] grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-x-4 lg:gap-x-6 items-start pb-24 lg:pb-40">
        <p ref={eyebrowRef} className="col-span-4 lg:col-start-1 lg:col-span-2 pt-3 text-navy-900/[56%] text-xs font-semibold tracking-[0.13em] uppercase">
          Selecciona tu propósito · 01—03
        </p>
        <div className="col-span-4 md:col-span-7 lg:col-start-3 lg:col-span-8 mt-6 lg:mt-0 overflow-hidden pb-[0.08em]">
          <h2
            id="objective-title"
            ref={titleRef}
            className="h2-section max-w-[11ch] lg:max-w-[10ch]"
            style={{ textWrap: 'balance' }}
          >
            Elige productos promocionales según tu objetivo
          </h2>
        </div>
      </div>

      <div
        ref={selectorRef}
        className="relative w-full text-white lg:grid"
        style={{ background: '#060F1C' }}
      >
        <div className="hidden lg:grid" style={{ gridTemplateColumns: 'minmax(0, 1.38fr) minmax(25rem, 1fr)', height: 'min(82svh, 60rem)', minHeight: '42.5rem' }}>
          {/* Shared visual — desktop only */}
          <div aria-hidden="true" className="relative min-w-0 overflow-hidden" style={{ background: '#060F1C' }}>
            {OBJECTIVES.map((obj, i) => (
              <figure
                key={obj.key}
                className="absolute inset-0 m-0 overflow-hidden transition-[opacity,transform] duration-[900ms] ease-out"
                style={{
                  opacity: activeIndex === i ? 1 : 0,
                  transform: activeIndex === i ? 'scale(1)' : 'scale(1.035)',
                  visibility: activeIndex === i ? 'visible' : 'hidden',
                }}
              >
                <Image src={obj.image} alt="" fill sizes="58vw" loading={i === 0 ? undefined : 'lazy'} priority={i === 0} className="object-cover" style={{ filter: 'saturate(0.78) contrast(1.03)' }} />
                <span
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(90deg, rgba(6,15,28,0.1) 40%, rgba(6,15,28,0.64) 100%), linear-gradient(180deg, rgba(6,15,28,0.08), rgba(6,15,28,0.48))' }}
                />
                <figcaption className="absolute right-8 bottom-8 left-8 text-white/[68%] text-xs font-semibold tracking-[0.12em] uppercase">
                  {obj.caption}
                </figcaption>
              </figure>
            ))}
            <div className="absolute top-8 left-8 z-10 flex gap-2 text-white/60 text-xs tracking-[0.1em]" style={{ fontVariantNumeric: 'tabular-nums' }}>
              <span className="text-white">{OBJECTIVES[activeIndex].number}</span>
              <span aria-hidden="true">/</span>
              <span aria-hidden="true">03</span>
            </div>
          </div>

          {/* Navigation list — desktop */}
          <nav aria-label="Productos promocionales por objetivo" className="flex flex-col min-w-0 h-full" style={{ background: '#152945' }}>
            {OBJECTIVES.map((obj, i) => {
              const active = activeIndex === i;
              return (
                <article
                  key={obj.key}
                  ref={(el) => { panelRefs.current[i] = el; }}
                  onPointerEnter={() => {
                    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setActiveIndex(i);
                  }}
                  onFocus={() => setActiveIndex(i)}
                  className="relative grid gap-x-4 px-8 transition-[flex-grow,background-color] duration-[750ms] ease-out"
                  style={{
                    gridTemplateColumns: '2rem minmax(0, 1fr)',
                    alignContent: 'center',
                    flex: active ? '1.34 1 0%' : '1 1 0%',
                    background: active ? 'rgba(242,236,223,0.055)' : 'transparent',
                    borderTop: i === 0 ? 'none' : '1px solid rgba(242,236,223,0.16)',
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="pt-2 text-xs font-semibold tracking-[0.1em] transition-[color,transform] duration-[650ms]"
                    style={{ color: active ? '#00BFFF' : 'rgba(216,195,163,0.46)', transform: active ? 'translateX(0.25rem)' : 'none', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {obj.number}
                  </span>

                  <div className="min-w-0">
                    <h3
                      className="h3-card max-w-[13ch] transition-colors duration-[650ms]"
                      style={{ color: active ? '#ffffff' : 'rgba(255,255,255,0.7)', textWrap: 'balance' }}
                    >
                      {obj.title}
                    </h3>

                    <div
                      className="overflow-hidden transition-[grid-template-rows,opacity] duration-[750ms] ease-out grid"
                      style={{ gridTemplateRows: active ? '1fr' : '0fr', opacity: active ? 1 : 0 }}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-[48ch] mt-4 text-white/[62%]" style={{ fontSize: 'clamp(0.92rem, 0.95vw, 1.05rem)', lineHeight: 1.58 }}>
                          {obj.description}
                        </p>
                        <Link
                          href={obj.href}
                          className="group relative w-fit min-h-[2.75rem] mt-4 inline-flex items-center gap-3 text-white text-sm font-semibold"
                        >
                          <span>{obj.linkText}</span>
                          <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                          <span aria-hidden="true" className="absolute left-0 right-0 bottom-1 h-px bg-current origin-left scale-x-[0.18] transition-transform duration-500 group-hover:scale-x-100" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </nav>
        </div>

        {/* Mobile / tablet — stacked cards, each with its own image, always expanded */}
        <div className="lg:hidden">
          {OBJECTIVES.map((obj) => (
            <article key={obj.key} className="relative border-t border-white/[16%] first:border-t-0">
              <figure className="relative m-0 h-[46vh] min-h-[20rem] max-h-[28rem] overflow-hidden" style={{ background: '#060F1C' }}>
                <Image src={obj.image} alt="" fill sizes="100vw" loading="lazy" className="object-cover" style={{ filter: 'saturate(0.78) contrast(1.03)' }} />
                <span
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(90deg, rgba(6,15,28,0.1) 40%, rgba(6,15,28,0.64) 100%), linear-gradient(180deg, rgba(6,15,28,0.08), rgba(6,15,28,0.48))' }}
                />
                <figcaption className="absolute right-6 bottom-5 left-6 text-white/[68%] text-xs font-semibold tracking-[0.12em] uppercase">
                  {obj.caption}
                </figcaption>
              </figure>

              <div className="grid gap-x-4 px-5 py-9" style={{ gridTemplateColumns: '1.5rem minmax(0, 1fr)', background: '#152945' }}>
                <span aria-hidden="true" className="pt-1 text-sky-300 text-xs font-semibold tracking-[0.1em]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {obj.number}
                </span>
                <div className="min-w-0">
                  <h3
                    className="h3-card text-white max-w-[12ch]"
                    style={{ textWrap: 'balance' }}
                  >
                    {obj.title}
                  </h3>
                  <p className="mt-5 text-white/70" style={{ fontSize: '0.98rem', lineHeight: 1.58 }}>
                    {obj.description}
                  </p>
                  <Link href={obj.href} className="group relative w-fit min-h-[2.75rem] mt-5 inline-flex items-center gap-3 text-white text-sm font-semibold">
                    <span>{obj.linkText}</span>
                    <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                    <span aria-hidden="true" className="absolute left-0 right-0 bottom-1 h-px bg-current origin-left scale-x-[0.4]" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
