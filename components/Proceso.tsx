'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

const WHATSAPP_QUOTE_URL =
  'https://wa.me/593998594123?text=Hola%2C%20me%20interesa%20cotizar%20art%C3%ADculos%20promocionales';

interface Step {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    eyebrow: 'Descubrir',
    title: 'Explora el catálogo',
    description: 'Revisa las categorías y selecciona los artículos que mejor representen el objetivo de tu campaña.',
    image: '/img/hero/catalogo.png',
  },
  {
    number: '02',
    eyebrow: 'Definir',
    title: 'Comparte tu requerimiento',
    description: 'Indica la cantidad, ciudad, fecha estimada, producto de interés y cualquier detalle relevante sobre la personalización.',
    image: '/img/hero/requerimiento.png',
  },
  {
    number: '03',
    eyebrow: 'Concretar',
    title: 'Recibe tu cotización',
    description: 'Obtén una propuesta basada en las características confirmadas de tu pedido.',
    image: '/img/hero/cotizacion.png',
  },
];

export default function Proceso() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!section || !stage || !track) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktopStage = window.matchMedia('(min-width: 75rem) and (min-height: 46rem)').matches;
    let cancelled = false;
    let revert: (() => void) | undefined;

    (async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      const steps = stepRefs.current.filter(Boolean) as HTMLLIElement[];

      const ctx = gsap.context(() => {
        const headerTimeline = gsap.timeline({
          scrollTrigger: { trigger: section.querySelector('.process__header'), start: 'top 76%', toggleActions: 'play none none reverse' },
        });
        headerTimeline
          .from(eyebrowRef.current, { autoAlpha: 0, y: 16, duration: 0.65, ease: 'power3.out' })
          .from(titleRef.current, { autoAlpha: 0, yPercent: 108, duration: 1.15, ease: 'power4.out' }, 0.08)
          .from(introRef.current, { autoAlpha: 0, yPercent: 105, duration: 0.85, ease: 'power3.out' }, 0.4);

        if (prefersReduced || !isDesktopStage) {
          steps.forEach((step) => {
            const content = step.querySelector('.process-step__content');
            const visual = step.querySelector('.process-step__visual');
            if (prefersReduced) {
              gsap.set([content, visual], { opacity: 1, autoAlpha: 1, y: 0 });
              return;
            }
            gsap.from([content, visual], {
              autoAlpha: 0,
              y: 56,
              duration: 0.95,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: { trigger: step, start: 'top 78%', toggleActions: 'play none none reverse' },
            });
          });
          if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 1, autoAlpha: 1, y: 0, scale: 1 });
          return;
        }

        // Desktop pinned horizontal stage
        track.style.display = 'flex';
        track.style.width = `${steps.length * 100}vw`;
        steps.forEach((step) => { step.style.flex = '0 0 100vw'; });

        const getScrollDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const horizontalTween = gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            id: 'process-horizontal',
            trigger: stage,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate(self) {
              const rawIndex = self.progress * steps.length;
              const activeIndex = Math.min(steps.length - 1, Math.floor(rawIndex));
              const currentStep = activeIndex + 1;
              progressRef.current?.setAttribute('aria-valuenow', String(currentStep));
              if (statusRef.current && statusRef.current.dataset.currentStep !== String(currentStep)) {
                statusRef.current.dataset.currentStep = String(currentStep);
                statusRef.current.textContent = `Paso ${currentStep} de ${steps.length}`;
              }
            },
          },
        });

        gsap.to(progressFillRef.current, {
          scaleX: 1,
          transformOrigin: 'left',
          ease: 'none',
          scrollTrigger: { trigger: stage, start: 'top top', end: () => `+=${getScrollDistance()}`, scrub: true },
        });

        steps.forEach((step) => {
          const eyebrow = step.querySelector('.process-step__eyebrow');
          const title = step.querySelector('.process-step__title');
          const description = step.querySelector('.process-step__description');
          const number = step.querySelector('.process-step__number');
          const visual = step.querySelector('.process-step__visual');
          const image = step.querySelector('.process-step__visual img');

          gsap
            .timeline({
              scrollTrigger: { trigger: step, containerAnimation: horizontalTween, start: 'left 72%', end: 'center center', scrub: 0.7 },
            })
            .from(eyebrow, { autoAlpha: 0, y: 18, duration: 0.35 })
            .from(title, { autoAlpha: 0, y: 72, duration: 0.65, ease: 'power3.out' }, 0.08)
            .from(description, { autoAlpha: 0, y: 38, duration: 0.55, ease: 'power3.out' }, 0.24)
            .from(visual, { autoAlpha: 0, x: 80, scale: 0.96, duration: 0.7, ease: 'power3.out' }, 0.14);

          gsap.fromTo(
            number,
            { xPercent: 10 },
            { xPercent: -8, ease: 'none', scrollTrigger: { trigger: step, containerAnimation: horizontalTween, start: 'left right', end: 'right left', scrub: 1.2 } }
          );

          if (image) {
            gsap.fromTo(
              image,
              { xPercent: -4, scale: 1.08 },
              { xPercent: 4, scale: 1.08, ease: 'none', scrollTrigger: { trigger: step, containerAnimation: horizontalTween, start: 'left right', end: 'right left', scrub: 1 } }
            );
          }
        });

        if (ctaRef.current) {
          gsap.from(ctaRef.current, {
            autoAlpha: 0,
            y: 32,
            scale: 0.96,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: steps[steps.length - 1], containerAnimation: horizontalTween, start: 'left 42%', toggleActions: 'play none none reverse' },
          });

          if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            const cta = ctaRef.current;
            const label = cta.querySelector('.process-step__cta-label');
            const icon = cta.querySelector('.process-step__cta-icon');
            const move = (e: PointerEvent) => {
              const rect = cta.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;
              gsap.to(cta, { x: x * 0.12, y: y * 0.18, duration: 0.65, ease: 'power3.out', overwrite: 'auto' });
              gsap.to([label, icon], { x: x * 0.035, y: y * 0.06, duration: 0.65, ease: 'power3.out', overwrite: 'auto' });
            };
            const leave = () => {
              gsap.to([cta, label, icon], { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' });
            };
            cta.addEventListener('pointermove', move);
            cta.addEventListener('pointerleave', leave);
          }
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
    <section id="proceso" ref={sectionRef} aria-labelledby="process-title" className="relative overflow-clip bg-white text-navy-900">
      <div className="process__header w-full max-w-[120rem] mx-auto px-5 sm:px-8 lg:px-[5rem] grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-x-4 lg:gap-x-6 items-start py-28 md:py-32 lg:py-48">
        <p ref={eyebrowRef} className="col-span-4 lg:col-start-1 lg:col-span-2 pt-3 text-navy-900/[55%] text-xs font-semibold tracking-[0.13em] uppercase">
          Cómo trabajamos · 01—03
        </p>

        <div className="col-span-4 md:col-span-8 lg:col-start-3 lg:col-span-8 mt-6 lg:mt-0 overflow-hidden pb-[0.08em]">
          <h2
            id="process-title"
            ref={titleRef}
            className="h2-section max-w-[9ch]"
            style={{ textWrap: 'balance' }}
          >
            ¿Cómo solicitar tus artículos promocionales?
          </h2>
        </div>

        <div className="col-span-4 md:col-span-6 lg:col-start-8 lg:col-span-5 mt-8 lg:mt-24 overflow-hidden">
          <p ref={introRef} className="max-w-[38ch] text-navy-900/[72%]" style={{ fontSize: 'clamp(1rem, 1.2vw, 1.22rem)', lineHeight: 1.6 }}>
            Cuéntanos qué necesitas y te ayudaremos a convertir tu idea en una propuesta adecuada para tu empresa.
          </p>
        </div>
      </div>

      <div
        ref={stageRef}
        className="process__stage relative overflow-hidden lg:min-h-screen"
        style={{ background: 'radial-gradient(circle at 70% 38%, rgba(0,191,255,0.14), transparent 32rem), #F8F9FA' }}
      >
        <div className="process__stage-header sticky top-0 z-10 lg:absolute lg:top-8 lg:left-[5rem] lg:right-[5rem] px-5 sm:px-8 lg:px-0 py-4 lg:py-0 bg-white/90 lg:bg-transparent backdrop-blur lg:backdrop-blur-0 grid grid-cols-1 lg:grid-cols-[1fr_minmax(18rem,42rem)] gap-3 lg:gap-8 items-start border-b border-navy-900/10 lg:border-none">
          <p ref={statusRef} className="m-0 text-navy-900/[55%] text-xs font-semibold tracking-[0.1em] uppercase">
            Paso 1 de 3
          </p>

          <div
            ref={progressRef}
            role="progressbar"
            aria-label="Progreso del proceso de cotización"
            aria-valuemin={1}
            aria-valuemax={3}
            aria-valuenow={1}
            className="min-w-0"
          >
            <span aria-hidden="true" className="relative block w-full h-px bg-navy-900/[18%] overflow-hidden">
              <span ref={progressFillRef} className="absolute inset-0 block bg-navy-900" style={{ transform: 'scaleX(0)', transformOrigin: 'left' }} />
            </span>
            <span aria-hidden="true" className="flex justify-between mt-3 text-navy-900/[38%] text-[0.68rem] tracking-[0.08em]" style={{ fontVariantNumeric: 'tabular-nums' }}>
              <span>01</span>
              <span>02</span>
              <span>03</span>
            </span>
          </div>
        </div>

        <ol ref={trackRef} className="process__track relative m-0 p-0 list-none grid grid-cols-1">
          {STEPS.map((step, i) => (
            <li
              key={step.number}
              ref={(el) => { stepRefs.current[i] = el; }}
              className="process-step relative min-w-0 border-b lg:border-b-0 border-navy-900/10"
            >
              <article
                aria-labelledby={`process-step-${i + 1}-title`}
                className="process-step__panel relative w-full max-w-[120rem] mx-auto px-5 sm:px-8 lg:px-[5rem] py-24 lg:py-0 lg:min-h-screen grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-x-4 lg:gap-x-6 items-center"
              >
                <div
                  aria-hidden="true"
                  className="process-step__number absolute right-0 bottom-0 pointer-events-none select-none font-extrabold text-navy-900/[0.06]"
                  style={{ fontSize: 'clamp(9rem, 27vw, 34rem)', lineHeight: 0.65, letterSpacing: '-0.08em' }}
                >
                  {step.number}
                </div>

                <div className="process-step__content col-span-4 md:col-span-5 lg:col-start-2 lg:col-span-6 relative z-10">
                  <p aria-hidden="true" className="process-step__eyebrow text-navy-900/[48%] text-xs font-semibold tracking-[0.13em] uppercase mb-8 lg:mb-16">
                    {step.eyebrow}
                  </p>

                  <h3
                    id={`process-step-${i + 1}-title`}
                    className="process-step__title h2-section max-w-[10ch]"
                    style={{ textWrap: 'balance' }}
                  >
                    {step.title}
                  </h3>

                  <p className="process-step__description max-w-[42ch] mt-8 lg:mt-12 text-navy-900/70" style={{ fontSize: 'clamp(1rem, 1.2vw, 1.25rem)', lineHeight: 1.62 }}>
                    {step.description}
                  </p>

                  {i === STEPS.length - 1 && (
                    <a
                      ref={ctaRef}
                      href={WHATSAPP_QUOTE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Cotizar artículos promocionales con PromoGimmicks"
                      className="process-step__cta group relative w-fit min-h-[3.75rem] mt-12 lg:mt-16 px-7 overflow-hidden inline-flex items-center justify-center gap-6 rounded-full border border-navy-900 bg-navy-900 text-white font-semibold transition-[color,border-color,transform] duration-500 hover:scale-[1.015] hover:border-sky-400 hover:text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-900 focus-visible:outline-offset-4"
                      style={{ fontSize: 'clamp(0.88rem, 1vw, 1rem)' }}
                    >
                      <span aria-hidden="true" className="absolute inset-[-1px] rounded-full bg-sky-400 translate-y-[105%] transition-transform duration-500 group-hover:translate-y-0" />
                      <span className="process-step__cta-label relative z-10">Cotizar artículos promocionales</span>
                      <span aria-hidden="true" className="process-step__cta-icon relative z-10 text-[1.15em] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                    </a>
                  )}
                </div>

                <figure aria-hidden="true" className="process-step__visual col-span-4 md:col-span-3 lg:col-start-9 lg:col-span-4 relative overflow-hidden m-0 mt-10 lg:mt-0 aspect-[4/5] bg-slate-200">
                  <Image src={step.image} alt="" fill sizes="(max-width: 767px) 76vw, 30vw" loading={i === 0 ? undefined : 'lazy'} priority={i === 0} className="object-cover scale-105" style={{ filter: 'grayscale(0.35) saturate(0.75) contrast(1.02)' }} />
                  <span aria-hidden="true" className="absolute inset-0 bg-navy-900/[8%]" />
                </figure>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
