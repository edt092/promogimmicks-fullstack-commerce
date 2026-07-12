'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const WHATSAPP_QUOTE_URL =
  'https://wa.me/593998594123?text=Hola%2C%20me%20interesa%20solicitar%20una%20cotizaci%C3%B3n%20de%20art%C3%ADculos%20promocionales';

export default function LlamadaFinal() {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const primaryBtnRef = useRef<HTMLAnchorElement>(null);
  const backToTopRef = useRef<HTMLAnchorElement>(null);

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
        const lines = lineRefs.current.filter(Boolean) as HTMLSpanElement[];
        const actions = actionsRef.current ? Array.from(actionsRef.current.children) : [];

        if (prefersReduced) {
          gsap.set([backgroundRef.current, eyebrowRef.current, titleRef.current, copyRef.current, ...actions, backToTopRef.current, ...lines], {
            opacity: 1,
            autoAlpha: 1,
            y: 0,
            scale: 1,
            scaleX: 1,
            clipPath: 'inset(0% 0 0 0)',
          });
          return;
        }

        const timeline = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 82%', toggleActions: 'play none none reverse' } });

        timeline
          .from(backgroundRef.current, { clipPath: 'inset(100% 0 0 0)', duration: 1.25, ease: 'power4.inOut' })
          .from(lines, { scaleX: 0, transformOrigin: 'left', duration: 1, stagger: 0.1, ease: 'power3.out' }, 0.55)
          .from(eyebrowRef.current, { autoAlpha: 0, y: 18, duration: 0.65, ease: 'power3.out' }, 0.62)
          .from(titleRef.current, { autoAlpha: 0, yPercent: 108, duration: 1.05, ease: 'power4.out' }, 0.7)
          .from(copyRef.current, { autoAlpha: 0, yPercent: 90, duration: 0.8, ease: 'power3.out' }, 0.92)
          .from(actions, { autoAlpha: 0, y: 28, scale: 0.97, duration: 0.75, stagger: 0.12, ease: 'power3.out' }, 1.05)
          .from(backToTopRef.current, { autoAlpha: 0, y: 16, duration: 0.65, ease: 'power3.out' }, 1.2);

        gsap.to(glowRef.current, {
          yPercent: 14,
          scale: 1.08,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.4 },
        });

        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && primaryBtnRef.current) {
          const button = primaryBtnRef.current;
          const label = button.querySelector('.button__label');
          const icon = button.querySelector('.button__icon');
          const radius = 110;
          const move = (event: PointerEvent) => {
            const rect = button.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = event.clientX - cx;
            const dy = event.clientY - cy;
            const dist = Math.hypot(dx, dy);
            if (dist > radius) {
              gsap.to(button, { x: 0, y: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
              gsap.to([label, icon], { x: 0, y: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
              return;
            }
            const proximity = 1 - dist / radius;
            const x = dx * 0.1 * proximity;
            const y = dy * 0.14 * proximity;
            gsap.to(button, { x, y, duration: 0.55, ease: 'power3.out', overwrite: 'auto' });
            gsap.to([label, icon], { x: x * 0.28, y: y * 0.28, duration: 0.55, ease: 'power3.out', overwrite: 'auto' });
          };
          const leave = () => {
            gsap.to([button, label, icon], { x: 0, y: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
          };
          section.addEventListener('pointermove', move);
          section.addEventListener('pointerleave', leave);
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
      id="llamada-final"
      ref={sectionRef}
      aria-labelledby="closer-title"
      className="relative overflow-clip grid items-center text-white"
      style={{ minHeight: '100svh', background: '#060F1C', isolation: 'isolate' }}
    >
      <div ref={backgroundRef} aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        <span
          ref={glowRef}
          className="absolute rounded-full"
          style={{ top: '4%', left: '50%', width: 'min(76vw, 70rem)', aspectRatio: '1', background: 'rgba(21,101,255,0.22)', filter: 'blur(8rem)', transform: 'translateX(-50%)' }}
        />
        <span
          ref={(el) => { lineRefs.current[0] = el; }}
          className="absolute h-px bg-white/[17%]"
          style={{ right: 'clamp(1.25rem, 4.2vw, 5rem)', left: 'clamp(1.25rem, 4.2vw, 5rem)', top: 'clamp(1.5rem, 4vh, 3rem)' }}
        />
        <span
          ref={(el) => { lineRefs.current[1] = el; }}
          className="absolute h-px bg-white/[17%]"
          style={{ right: 'clamp(1.25rem, 4.2vw, 5rem)', left: 'clamp(1.25rem, 4.2vw, 5rem)', bottom: 'clamp(1.5rem, 4vh, 3rem)' }}
        />
      </div>

      <div
        className="relative w-full max-w-[120rem] mx-auto grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-x-4 lg:gap-x-6 items-center"
        style={{ minHeight: '100svh', padding: 'clamp(7rem, 14vh, 11rem) clamp(1.25rem, 4.2vw, 5rem) clamp(4rem, 8vh, 7rem)' }}
      >
        <div className="col-span-4 md:col-span-8 lg:col-start-2 lg:col-span-10 flex flex-col items-start">
          <p ref={eyebrowRef} className="m-0 text-white/[58%] text-xs font-semibold tracking-[0.12em] uppercase">
            Convirtamos tu idea en una propuesta
          </p>

          <div className="overflow-hidden pb-[0.08em] w-full" style={{ marginTop: 'clamp(2rem, 5vw, 4.5rem)' }}>
            <h2
              id="closer-title"
              ref={titleRef}
              className="h2-section max-w-[15ch]"
              style={{ textWrap: 'balance' }}
            >
              Hagamos que tu marca esté presente
            </h2>
          </div>

          <div className="overflow-hidden pb-[0.08em]" style={{ marginTop: 'clamp(2rem, 4vw, 3.5rem)' }}>
            <p ref={copyRef} className="max-w-[65ch] text-white/[76%]" style={{ fontSize: 'clamp(1.06rem, 1.5vw, 1.31rem)', lineHeight: 1.62 }}>
              Cuéntanos qué artículo buscas, cuántas unidades necesitas y en qué ciudad debe entregarse. Te ayudaremos a revisar alternativas para tu próxima campaña, evento o regalo corporativo.
            </p>
          </div>

          <div ref={actionsRef} className="flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto" style={{ marginTop: 'clamp(3rem, 6vw, 5.5rem)' }}>
            <a
              ref={primaryBtnRef}
              href={WHATSAPP_QUOTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Solicitar una cotización de artículos promocionales"
              className="button button--primary group relative min-h-[3.5rem] px-6 overflow-hidden inline-flex justify-between items-center gap-6 rounded-full border border-white bg-white text-navy-900 font-semibold no-underline transition-transform duration-600 hover:scale-[1.015]"
              style={{ fontSize: 'clamp(0.94rem, 1vw, 1.06rem)' }}
            >
              <span aria-hidden="true" className="absolute inset-[-1px] rounded-full bg-sky-400 translate-y-[104%] transition-transform duration-600 group-hover:translate-y-0" />
              <span className="button__label relative z-10">Solicitar cotización</span>
              <span aria-hidden="true" className="button__icon relative z-10 transition-transform duration-600 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
            </a>

            <Link
              href="/tienda/"
              className="group relative min-h-[3.5rem] px-6 inline-flex justify-between items-center gap-6 rounded-full border border-white/[52%] text-white font-semibold no-underline transition-colors duration-600 hover:bg-white hover:text-navy-900 hover:border-white"
              style={{ fontSize: 'clamp(0.94rem, 1vw, 1.06rem)' }}
            >
              <span>Ver catálogo de productos</span>
              <span aria-hidden="true" className="transition-transform duration-600 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        <a
          ref={backToTopRef}
          href="#inicio"
          aria-label="Volver al inicio de la página"
          className="hidden lg:inline-flex lg:col-start-11 lg:col-span-2 self-end justify-self-end min-h-[2.75rem] items-center gap-2.5 text-white/[56%] text-xs font-semibold tracking-[0.1em] uppercase no-underline transition-[color,transform] duration-500 hover:text-white hover:-translate-y-1"
        >
          <span aria-hidden="true">↑</span>
          <span>Volver al inicio</span>
        </a>
      </div>
    </section>
  );
}
