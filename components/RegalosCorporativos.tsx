'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

const WHATSAPP_GIFTS_URL =
  'https://wa.me/593998594123?text=Hola%2C%20me%20interesa%20cotizar%20regalos%20corporativos%20personalizados';

export default function RegalosCorporativos() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const primaryRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

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
        if (prefersReduced) {
          gsap.set([canvas, mediaRef.current, eyebrowRef.current, titleRef.current, primaryRef.current, ctaRef.current], {
            opacity: 1,
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: 'none',
          });
          return;
        }

        gsap
          .timeline({ scrollTrigger: { trigger: canvas, start: 'top 78%', toggleActions: 'play none none reverse' } })
          .from(canvas, { clipPath: 'inset(8% 5% 8% 5%)', autoAlpha: 0, y: 70, duration: 1.25, ease: 'power4.out' })
          .from(mediaRef.current, { scale: 1.12, duration: 1.8, ease: 'power3.out' }, 0)
          .from(eyebrowRef.current, { autoAlpha: 0, y: 16, duration: 0.7, ease: 'power3.out' }, 0.35)
          .from(titleRef.current, { autoAlpha: 0, y: 54, duration: 1.05, ease: 'power4.out' }, 0.42)
          .from(primaryRef.current, { autoAlpha: 0, y: 28, duration: 0.85, ease: 'power3.out' }, 0.68)
          .from(ctaRef.current, { autoAlpha: 0, y: 28, scale: 0.96, duration: 0.8, ease: 'power3.out' }, 0.8);

        gsap.fromTo(
          mediaRef.current,
          { yPercent: -2.5, scale: 1.035 },
          { yPercent: 2.5, scale: 1.075, ease: 'none', scrollTrigger: { trigger: canvas, start: 'top bottom', end: 'bottom top', scrub: 1.4 } }
        );

        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && ctaRef.current) {
          const cta = ctaRef.current;
          const label = cta.querySelector('.cta-label');
          const icon = cta.querySelector('.cta-icon');
          const radius = 110;
          const move = (event: PointerEvent) => {
            const rect = cta.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = event.clientX - cx;
            const dy = event.clientY - cy;
            const dist = Math.hypot(dx, dy);
            if (dist > radius) {
              gsap.to(cta, { x: 0, y: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
              gsap.to([label, icon], { x: 0, y: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
              return;
            }
            const proximity = 1 - dist / radius;
            const x = dx * 0.11 * proximity;
            const y = dy * 0.15 * proximity;
            gsap.to(cta, { x, y, duration: 0.55, ease: 'power3.out', overwrite: 'auto' });
            gsap.to([label, icon], { x: x * 0.28, y: y * 0.28, duration: 0.55, ease: 'power3.out', overwrite: 'auto' });
          };
          const leave = () => {
            gsap.to(cta, { x: 0, y: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
            gsap.to([label, icon], { x: 0, y: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
          };
          canvas.addEventListener('pointermove', move);
          canvas.addEventListener('pointerleave', leave);
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
      id="regalos-corporativos"
      ref={sectionRef}
      aria-labelledby="corporate-gifts-title"
      className="relative overflow-clip"
      style={{ background: '#f9f6ef', padding: 'clamp(5rem, 10vw, 10rem) clamp(1.25rem, 4vw, 5rem)' }}
    >
      <div
        ref={canvasRef}
        className="relative w-full max-w-[120rem] mx-auto overflow-hidden grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 items-end lg:items-center"
        style={{ minHeight: 'min(58svh, 38rem)', background: '#060F1C', isolation: 'isolate' }}
      >
        <div ref={mediaRef} aria-hidden="true" className="absolute inset-0" style={{ zIndex: -3 }}>
          <Image
            src="/img/hero/hero-slide-3.png"
            alt=""
            fill
            sizes="100vw"
            loading="lazy"
            className="object-cover"
            style={{ objectPosition: 'center 58%', filter: 'saturate(0.78) contrast(1.03)', transform: 'scale(1.035)' }}
          />
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: -2,
            background:
              'radial-gradient(circle at 50% 42%, rgba(6,15,28,0.2) 0, rgba(6,15,28,0.42) 52%, rgba(6,15,28,0.68) 100%), linear-gradient(180deg, rgba(6,15,28,0.18), rgba(6,15,28,0.54))',
          }}
        />

        <div aria-hidden="true" className="absolute inset-2 lg:inset-8 pointer-events-none" style={{ zIndex: -1, border: '1px solid rgba(242,236,223,0.18)' }} />

        <div className="col-span-4 md:col-span-8 lg:col-start-3 lg:col-span-8 relative z-10 min-w-0 flex flex-col items-start lg:items-center text-left lg:text-center py-24 px-5 lg:px-0" style={{ paddingBlock: 'clamp(4rem, 7vh, 6rem)' }}>
          <p ref={eyebrowRef} className="m-0 text-white/[66%] text-xs font-semibold tracking-[0.13em] uppercase">
            Relaciones que trascienden el momento
          </p>

          <div className="overflow-hidden w-full pb-[0.08em]">
            <h2
              id="corporate-gifts-title"
              ref={titleRef}
              className="h2-section text-white mx-0 lg:mx-auto max-w-none lg:max-w-[10ch] text-left lg:text-center"
              style={{ marginTop: 'clamp(2rem, 4vw, 4rem)', textWrap: 'balance' }}
            >
              Regalos corporativos que fortalecen relaciones
            </h2>
          </div>

          <div className="flex flex-col items-start lg:items-center mt-9 lg:mt-16">
            <p ref={primaryRef} className="m-0 max-w-[55ch] text-white/[82%] text-left lg:text-center" style={{ fontSize: 'clamp(1.05rem, 1.35vw, 1.35rem)', lineHeight: 1.65 }}>
              Reconoce a tu equipo, agradece a tus clientes y acompaña los momentos importantes de tu empresa con una propuesta alineada a tu marca.
            </p>
          </div>

          <a
            ref={ctaRef}
            href={WHATSAPP_GIFTS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Explorar regalos corporativos personalizados"
            className="group relative w-full lg:w-fit min-w-[19rem] min-h-[4rem] mt-11 lg:mt-16 px-7 overflow-hidden inline-flex justify-between items-center gap-6 rounded-full border border-white/[72%] bg-white text-navy-900 font-semibold transition-[color,border-color,transform] duration-500 hover:border-sky-400 hover:scale-[1.015] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
            style={{ fontSize: 'clamp(0.88rem, 1vw, 1rem)' }}
          >
            <span aria-hidden="true" className="absolute inset-[-1px] rounded-full bg-sky-400 origin-bottom translate-y-[104%] scale-y-[0.92] transition-transform duration-500 group-hover:translate-y-0 group-hover:scale-y-100" />
            <span className="cta-label relative z-10">Explorar regalos corporativos</span>
            <span aria-hidden="true" className="cta-icon relative z-10 text-[1.15em] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
          </a>
        </div>

        <p
          aria-hidden="true"
          className="hidden lg:block absolute z-10 m-0 text-white/[46%] text-[0.68rem] font-semibold tracking-[0.12em] uppercase"
          style={{ right: 'clamp(1.5rem, 3vw, 3rem)', bottom: 'clamp(1.5rem, 3vw, 3rem)', writingMode: 'vertical-rl' }}
        >
          PromoGimmicks · Corporate Gifting
        </p>
      </div>
    </section>
  );
}
