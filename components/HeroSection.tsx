'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CategoriasSlider from './CategoriasSlider';

const WHATSAPP_QUOTE_URL =
  'https://wa.me/593998594123?text=Hola%2C%20me%20interesa%20crear%20un%20proyecto%20de%20art%C3%ADculos%20promocionales%20personalizados';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const copyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    let cleanupThree: (() => void) | undefined;
    let revertGsap: (() => void) | undefined;
    let removeParallaxListener: (() => void) | undefined;
    let cancelled = false;
    let scene: Awaited<ReturnType<typeof import('@/lib/heroAmbientScene').setupHeroAmbientScene>> | undefined;

    (async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const lines = lineRefs.current.filter(Boolean) as HTMLSpanElement[];

        if (prefersReduced) {
          gsap.set([bgRef.current, bgImageRef.current, brandRef.current, ...lines, copyRef.current, ctaRef.current, scrollIndicatorRef.current], {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            filter: 'none',
          });
          return;
        }

        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

        intro.fromTo(bgRef.current, { scale: 0.92, opacity: 0.7 }, { scale: 1, opacity: 1, duration: 1.4 }, 0);

        // Slow zoom continuo (Ken Burns) — sutil, independiente del scroll y del puntero.
        gsap.to(bgImageRef.current, {
          scale: 1.06,
          duration: 26,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });

        // Parallax ligero: la imagen de fondo sigue el puntero con un desfase mínimo y suave.
        if (isFinePointer) {
          const parallaxX = gsap.quickTo(bgImageRef.current, 'x', { duration: 1.2, ease: 'power3.out' });
          const parallaxY = gsap.quickTo(bgImageRef.current, 'y', { duration: 1.2, ease: 'power3.out' });
          const onPointerMove = (event: PointerEvent) => {
            const nx = event.clientX / window.innerWidth - 0.5;
            const ny = event.clientY / window.innerHeight - 0.5;
            parallaxX(nx * 18);
            parallaxY(ny * 12);
          };
          window.addEventListener('pointermove', onPointerMove, { passive: true });
          removeParallaxListener = () => window.removeEventListener('pointermove', onPointerMove);
        }

        intro.fromTo(
          brandRef.current,
          { opacity: 0, scale: 0.98, filter: 'blur(10px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.9 },
          0.45
        );

        intro.fromTo(eyebrowRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 0.5);

        intro.fromTo(
          lines,
          { yPercent: 115, rotationX: 8, opacity: 0 },
          { yPercent: 0, rotationX: 0, opacity: 1, duration: 1.05, stagger: 0.1, transformOrigin: '50% 100%' },
          0.62
        );

        intro.fromTo(
          [copyRef.current, ctaRef.current],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.75, stagger: 0.09 },
          1.0
        );

        intro.fromTo(scrollIndicatorRef.current, { opacity: 0 }, { opacity: 1, duration: 0.7 }, 1.3);

        if (window.innerWidth >= 1024) {
          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: '+=85%',
            scrub: 0.8,
            onUpdate: (self) => {
              scene?.setScrollProgress(self.progress);
            },
          });

          gsap.to(bgRef.current, {
            y: '5vh',
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top top', end: '+=85%', scrub: 0.8 },
          });

          gsap.fromTo(
            lines,
            { y: 0, scale: 1, opacity: 1 },
            {
              y: '-15vh',
              scale: 0.97,
              opacity: 0.2,
              ease: 'none',
              scrollTrigger: { trigger: section, start: 'top top', end: '+=85%', scrub: 0.8 },
            }
          );

          gsap.to(ctaRef.current, {
            y: '-7vh',
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top top', end: '+=85%', scrub: 0.8 },
          });

          gsap.to(transitionRef.current, {
            y: 0,
            scrollTrigger: { trigger: section, start: 'top top', end: '+=85%', scrub: 0.8 },
          });

          gsap.to(scrollIndicatorRef.current, {
            opacity: 0,
            scrollTrigger: { trigger: section, start: 'top top', end: '20% top', scrub: 0.8 },
          });
        }
      }, section);

      revertGsap = () => ctx.revert();
    })();

    if (!prefersReduced && isFinePointer && canvasRef.current && canvasWrapRef.current) {
      (async () => {
        const { setupHeroAmbientScene } = await import('@/lib/heroAmbientScene');
        if (cancelled || !canvasRef.current || !canvasWrapRef.current) return;
        scene = setupHeroAmbientScene({ canvas: canvasRef.current, container: canvasWrapRef.current });
        cleanupThree = () => scene?.destroy();
      })();
    }

    return () => {
      cancelled = true;
      revertGsap?.();
      cleanupThree?.();
      removeParallaxListener?.();
    };
  }, []);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="hero relative overflow-clip bg-navy-900"
      style={{ minHeight: '100svh' }}
    >
      {/* Z0 — fondo de imagen */}
      <div ref={bgRef} aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div
          ref={bgImageRef}
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(145deg, rgba(6,15,28,0.72) 0%, rgba(21,41,69,0.55) 58%, rgba(10,26,47,0.72) 100%), url(/img/hero/img-header.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>

      {/* Z1 — capa ambiental WebGL (decorativa) */}
      <div ref={canvasWrapRef} aria-hidden="true" className="absolute inset-0 pointer-events-none hidden lg:block">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* grano fino */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Z3 — scrim de legibilidad tras el H1 */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[22vh] bottom-0 md:inset-y-0 md:inset-x-auto md:right-0 md:w-[62%] md:top-0"
        style={{ background: 'linear-gradient(0deg, rgba(6,15,28,0.6), rgba(6,15,28,0.28) 55%, transparent)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-[62%] hidden md:block"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(6,15,28,0.32) 30%, rgba(6,15,28,0.55) 65%)' }}
      />

      {/* Z4 — navegación provista por <Navbar /> a nivel de layout */}

      {/* Z4 — contenido */}
      <div className="relative z-10 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-x-4 lg:gap-x-6 px-5 sm:px-8 lg:px-10 max-w-[1920px] mx-auto pt-24 lg:pt-28 w-full">
        <p
          ref={eyebrowRef}
          className="col-span-4 md:col-span-4 lg:col-start-1 lg:col-span-4 text-white/90 text-[clamp(14px,1.05vw,18px)] leading-[1.35] tracking-[-0.015em] max-w-[280px]"
        >
          Artículos promocionales de marca para empresas que cuidan cada detalle.
        </p>

        <div
          ref={brandRef}
          className="col-span-4 md:col-span-8 lg:col-start-5 lg:col-span-3 flex items-center justify-start lg:justify-center mt-6 lg:mt-0"
        >
          <Image
            src="/img/brand/promogimmicks-logo.png"
            alt="Promogimmicks"
            width={340}
            height={87}
            priority
            className="w-[clamp(220px,24vw,340px)] h-auto opacity-95"
          />
        </div>

        <h1
          id="hero-title"
          className="col-span-4 md:col-span-8 lg:col-start-7 lg:col-span-6 mt-10 lg:mt-4 h1-display text-white w-full"
          style={{ whiteSpace: 'normal', overflowWrap: 'break-word' }}
        >
          <span className="block overflow-hidden w-full">
            <span
              ref={(el) => { lineRefs.current[0] = el; }}
              className="block w-full"
            >
              Artículos promocionales
            </span>
          </span>
          <span className="block overflow-hidden w-full">
            <span
              ref={(el) => { lineRefs.current[1] = el; }}
              className="block w-full text-sky-400"
            >
              diseñados para permanecer.
            </span>
          </span>
        </h1>

        <div
          ref={copyRef}
          className="col-span-4 md:col-span-6 lg:col-start-1 lg:col-span-5 mt-8 lg:mt-10 min-w-0"
        >
          <p className="text-white/80 text-[clamp(16px,1.15vw,20px)] leading-[1.5] max-w-[42ch]">
            Seleccionamos y personalizamos artículos promocionales con intención: piezas útiles, memorables y coherentes con la identidad de tu empresa.
          </p>
        </div>

        <div
          ref={ctaRef}
          className="col-span-4 md:col-span-8 lg:col-start-1 lg:col-span-5 mt-12 lg:mt-14 flex flex-col sm:flex-row gap-3 min-w-0"
        >
          <Link
            href="/tienda/"
            aria-label="Explorar el catálogo de artículos promocionales"
            className="group inline-flex items-center justify-center gap-2 h-[58px] px-8 rounded-full bg-white text-navy-900 text-[15px] font-semibold transition-colors duration-200 hover:bg-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400 focus-visible:outline-offset-4 w-full sm:w-auto"
          >
            Explorar la colección
            <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <a
            href={WHATSAPP_QUOTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Solicitar una cotización de artículos promocionales"
            className="group relative inline-flex items-center justify-center h-[58px] px-8 rounded-full text-white text-[15px] font-semibold border border-sky-400/[45%] overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400 focus-visible:outline-offset-4 w-full sm:w-auto"
          >
            <span className="absolute inset-0 -translate-x-full bg-sky-400 transition-transform duration-300 group-hover:translate-x-0" />
            <span className="relative transition-colors duration-300 group-hover:text-navy-900">Cotiza con Nosotros</span>
          </a>
        </div>

        <p className="col-span-4 lg:col-start-1 lg:col-span-5 mt-5 text-white/60 text-sm tracking-wide">
          Atención personalizada · Opciones para empresas · Entregas en Ecuador
        </p>
      </div>

      {/* indicador de scroll */}
      <div ref={scrollIndicatorRef} className="absolute bottom-8 left-5 sm:left-8 lg:left-10 z-10">
        <a
          href="#categorias"
          className="group inline-flex items-center gap-3 text-white/80 hover:text-white transition-colors"
        >
          <span
            className="flex items-center justify-center w-11 h-11 rounded-full border border-white/30 group-hover:border-sky-400 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="animate-[scrollBounce_1.8s_ease-in-out_infinite]">
              <path d="M7 1v11M2 7l5 5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-xs tracking-[0.14em] uppercase">Descubrir</span>
        </a>
      </div>

      {/* Transición inferior hacia Categorías */}
      <div
        ref={transitionRef}
        aria-hidden="true"
        className="hero-transition absolute bottom-0 left-0 right-0 h-[14vh] bg-gradient-to-b from-transparent to-white"
      />
      <div className="hero-next-intro relative z-10 bg-white pt-8 md:pt-10 lg:pt-12 pb-[16vh] px-5 sm:px-8 lg:px-10 -mt-px">
        <div className="max-w-[1920px] mx-auto grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-x-4 lg:gap-x-6">
          <a
            href="#categorias"
            className="col-span-4 lg:col-start-11 lg:col-span-2 inline-flex items-center gap-2 text-navy-900 font-semibold text-sm hover:text-brand transition-colors self-start"
          >
            Descubrir categorías
            <span aria-hidden="true">→</span>
          </a>

          <div id="categorias" className="col-span-4 md:col-span-8 lg:col-span-12">
            <CategoriasSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
