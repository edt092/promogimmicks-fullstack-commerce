'use client';

import { useEffect, useRef } from 'react';

interface Benefit {
  number: string;
  label: string;
  title: string;
  description: string;
  desktopCols: string;
}

const BENEFITS: Benefit[] = [
  {
    number: '01',
    label: 'Selección',
    title: 'Variedad para diferentes campañas',
    description: 'Encuentra alternativas para ferias, lanzamientos, programas internos, celebraciones, fidelización de clientes y regalos empresariales.',
    desktopCols: 'lg:col-start-1 lg:col-span-10',
  },
  {
    number: '02',
    label: 'Identidad',
    title: 'Personalización de marca',
    description: 'Selecciona el producto y consulta las técnicas disponibles para incorporar tu logotipo, mensaje o identidad visual.',
    desktopCols: 'lg:col-start-3 lg:col-span-10',
  },
];

export default function PropuestaValor() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const benefitRefs = useRef<Array<HTMLElement | null>>([]);
  const lineRefs = useRef<Array<HTMLDivElement | null>>([]);

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
        const benefits = benefitRefs.current.filter(Boolean) as HTMLElement[];
        const lines = lineRefs.current.filter(Boolean) as HTMLDivElement[];

        if (prefersReduced) {
          gsap.set([eyebrowRef.current, titleRef.current, introRef.current, ...benefits, ...lines], {
            opacity: 1,
            autoAlpha: 1,
            x: 0,
            y: 0,
            scaleX: 1,
          });
          return;
        }

        const headerTimeline = gsap.timeline({
          scrollTrigger: { trigger: section, start: 'top 72%', toggleActions: 'play none none reverse' },
        });

        headerTimeline
          .from(eyebrowRef.current, { autoAlpha: 0, y: 16, duration: 0.65, ease: 'power3.out' })
          .from(titleRef.current, { autoAlpha: 0, yPercent: 108, duration: 1.15, ease: 'power4.out' }, 0.08)
          .from(introRef.current, { autoAlpha: 0, yPercent: 105, duration: 0.9, ease: 'power3.out' }, 0.45);

        const distances = [76, 112, 64, 96];
        const scrubValues = [0.75, 1.05, 0.65, 0.9];
        const isDesktop = window.innerWidth >= 1024;

        benefits.forEach((benefit, index) => {
          const line = lineRefs.current[index];
          const meta = benefit.querySelector('.value-benefit__meta');
          const benefitTitle = benefit.querySelector('.value-benefit__title');
          const description = benefit.querySelector('.value-benefit__description');

          const revealTimeline = gsap.timeline({
            scrollTrigger: { trigger: benefit, start: 'top 82%', toggleActions: 'play none none reverse' },
          });

          revealTimeline
            .from(line, { scaleX: 0, transformOrigin: 'left', duration: 1, ease: 'power3.out' })
            .from(meta, { autoAlpha: 0, y: 14, duration: 0.65, ease: 'power3.out' }, 0.18)
            .from(benefitTitle, { autoAlpha: 0, y: 48, duration: 0.95, ease: 'power4.out' }, 0.25)
            .from(description, { autoAlpha: 0, y: 28, duration: 0.8, ease: 'power3.out' }, 0.42);

          if (isDesktop) {
            gsap.fromTo(
              benefit,
              { y: distances[index] * 0.25 },
              {
                y: -distances[index] * 0.25,
                ease: 'none',
                scrollTrigger: { trigger: benefit, start: 'top bottom', end: 'bottom top', scrub: scrubValues[index] },
              }
            );
          }
        });

        gsap.to('.value-proposition__glow', {
          yPercent: 18,
          xPercent: -6,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.4 },
        });

        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
          benefits.forEach((benefit) => {
            const move = (event: PointerEvent) => {
              const rect = benefit.getBoundingClientRect();
              const nx = (event.clientX - rect.left) / rect.width - 0.5;
              const ny = (event.clientY - rect.top) / rect.height - 0.5;
              gsap.to(benefit, { x: nx * 5, y: ny * 3, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
            };
            const leave = () => {
              gsap.to(benefit, { x: 0, y: 0, duration: 1, ease: 'power3.out', overwrite: 'auto' });
            };
            benefit.addEventListener('pointermove', move);
            benefit.addEventListener('pointerleave', leave);
          });
        }
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
      id="propuesta-de-valor"
      ref={sectionRef}
      aria-labelledby="value-title"
      className="relative overflow-clip text-white py-32 md:py-40 lg:py-56"
      style={{ background: 'radial-gradient(circle at 74% 38%, rgba(21,101,255,0.22), transparent 34rem), #060F1C' }}
    >
      <div aria-hidden="true" className="value-proposition__ambient absolute inset-0 overflow-hidden pointer-events-none">
        <span
          className="value-proposition__glow absolute rounded-full"
          style={{ top: '22%', right: '-12vw', width: 'clamp(25rem, 50vw, 60rem)', aspectRatio: '1', background: 'rgba(0,191,255,0.10)', filter: 'blur(7rem)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-5 sm:px-8 lg:px-[5rem] grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-x-4 lg:gap-x-6 items-start">
        <div className="lg:col-start-1 lg:col-span-5 lg:sticky lg:top-28 lg:self-start col-span-4 md:col-span-8">
          <header className="max-w-[43rem]">
            <p
              ref={eyebrowRef}
              className="text-white/60 text-xs font-semibold tracking-[0.13em] uppercase"
            >
              Nuestro enfoque · 01—04
            </p>

            <div className="overflow-hidden pb-[0.08em] mt-8">
              <h2
                id="value-title"
                ref={titleRef}
                className="h2-section max-w-[9ch]"
                style={{ textWrap: 'balance' }}
              >
                Promocionales pensados para comunicar el valor de tu empresa
              </h2>
            </div>

            <div className="overflow-hidden mt-10">
              <p
                ref={introRef}
                className="max-w-[40ch] text-white/[72%]"
                style={{ fontSize: 'clamp(1rem, 1.15vw, 1.2rem)', lineHeight: 1.62, letterSpacing: '-0.012em' }}
              >
                Te ayudamos a encontrar el producto adecuado para tu audiencia y tipo de campaña.
              </p>
            </div>
          </header>
        </div>

        <div
          aria-label="Beneficios de trabajar con PromoGimmicks"
          className="lg:col-start-7 lg:col-span-6 col-span-4 md:col-span-8 grid grid-cols-1 lg:grid-cols-12 gap-y-28 lg:gap-y-[16vh] pt-16 lg:pt-[14vh] pb-8 lg:pb-24"
        >
          {BENEFITS.map((b, i) => (
            <article
              key={b.number}
              ref={(el) => { benefitRefs.current[i] = el; }}
              className={`value-benefit group relative min-w-0 pt-8 ${b.desktopCols}`}
            >
              <div
                ref={(el) => { lineRefs.current[i] = el; }}
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-px bg-white/[24%] origin-left transition-[height,background-color] duration-500 group-hover:h-0.5 group-hover:bg-sky-400"
              />

              <div className="value-benefit__meta flex justify-between items-center gap-8 mb-12 lg:mb-20">
                <span
                  aria-hidden="true"
                  className="text-sky-200/70 text-xs font-semibold tracking-[0.12em] transition-transform duration-500 group-hover:translate-x-1.5 group-hover:text-sky-300"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {b.number}
                </span>
                <span className="text-white/[38%] text-[0.7rem] font-semibold tracking-[0.12em] uppercase transition-colors duration-500 group-hover:text-white/[66%]">
                  {b.label}
                </span>
              </div>

              <h3
                className="value-benefit__title h3-card max-w-[13ch]"
                style={{ textWrap: 'balance' }}
              >
                {b.title}
              </h3>

              <p
                className="value-benefit__description max-w-[46ch] mt-6 lg:mt-10 text-white/[68%] transition-colors duration-500 group-hover:text-white/[84%]"
                style={{ fontSize: 'clamp(0.98rem, 1.05vw, 1.12rem)', lineHeight: 1.65 }}
              >
                {b.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
