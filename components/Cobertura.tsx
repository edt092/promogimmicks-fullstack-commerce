'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface CityCoverage {
  id: string;
  name: string;
  index: string;
  heading: string;
  summary: string;
  href: string;
  x: number;
  y: number;
  coverage: string;
  categories: string;
}

const CITIES: CityCoverage[] = [
  {
    id: 'quito',
    name: 'Quito',
    index: '01',
    heading: 'Artículos promocionales en Quito',
    summary: 'Encuentra productos personalizados para eventos, instituciones, equipos comerciales y campañas empresariales en Quito.',
    href: '/productos-promocionales-ecuador/quito',
    x: 464,
    y: 258,
    coverage: 'Entrega en todo el Distrito Metropolitano',
    categories: 'Ferias en Quorum y centros de convenciones · Stock para entregas inmediatas',
  },
  {
    id: 'guayaquil',
    name: 'Guayaquil',
    index: '02',
    heading: 'Artículos promocionales en Guayaquil',
    summary: 'Solicita promocionales para activaciones, clientes, colaboradores y eventos empresariales en Guayaquil.',
    href: '/productos-promocionales-ecuador/guayaquil',
    x: 239,
    y: 576,
    coverage: 'Envíos a toda la provincia del Guayas',
    categories: 'Productos resistentes al clima costero · Merchandising para ferias empresariales',
  },
  {
    id: 'cuenca',
    name: 'Cuenca',
    index: '03',
    heading: 'Artículos promocionales en Cuenca',
    summary: 'Explora alternativas personalizables para empresas, instituciones y emprendimientos en Cuenca.',
    href: '/productos-promocionales-ecuador/cuenca',
    x: 379,
    y: 689,
    coverage: 'Envíos a toda la región austral del Ecuador',
    categories: 'Productos artesanales y eco-friendly · Ferias artesanales y culturales',
  },
  {
    id: 'manta',
    name: 'Manta',
    index: '04',
    heading: 'Artículos promocionales en Manta',
    summary: 'Consulta productos promocionales para campañas, eventos y obsequios empresariales en Manta.',
    href: '/productos-promocionales-ecuador/manta',
    x: 109,
    y: 383,
    coverage: 'Envíos a toda la provincia de Manabí',
    categories: 'Sector pesquero, turístico e industrial · Resistentes al clima costero',
  },
];

// Contorno real del territorio continental de Ecuador (trazado desde datos cartográficos públicos, mapsicon/ec).
// El path viene en coordenadas internas de potrace; se renderiza con el group transform de abajo.
const COUNTRY_PATH =
  'M4043 10233 c-10 -3 -9 -12 2 -39 14 -35 14 -35 -25 -71 -52 -46 -54 -78 -6 -98 49 -21 53 -34 8 -28 -29 4 -40 1 -45 -10 -3 -9 -17 -34 -31 -56 -23 -36 -28 -40 -51 -31 -31 12 -40 -3 -49 -80 -4 -36 -15 -66 -30 -85 l-23 -29 -12 52 c-6 29 -17 65 -25 80 -15 28 -64 79 -69 71 -2 -2 -21 -29 -42 -59 -21 -30 -60 -80 -87 -111 l-49 -57 -122 -6 c-222 -12 -292 -16 -315 -22 -13 -2 -42 -22 -65 -43 -84 -76 -107 -84 -212 -79 -66 4 -99 1 -116 -8 -13 -7 -41 -13 -61 -14 -31 0 -40 -5 -58 -35 -31 -50 -161 -135 -208 -135 -10 0 -49 -16 -88 -35 -76 -39 -99 -42 -131 -20 -20 14 -24 12 -66 -41 -41 -52 -45 -62 -51 -130 -4 -41 -4 -89 -1 -108 7 -32 8 -33 41 -26 32 7 36 6 45 -17 5 -13 9 -27 9 -31 0 -3 9 -15 19 -26 20 -22 19 -47 -10 -158 -16 -62 2 -121 43 -146 37 -22 44 -51 22 -93 -16 -32 -17 -33 -25 -11 -5 12 -15 22 -23 22 -21 0 -29 -75 -21 -209 6 -102 4 -123 -14 -175 -12 -33 -21 -67 -21 -76 0 -10 -13 -23 -29 -30 -18 -7 -35 -26 -46 -51 -19 -42 -86 -109 -108 -109 -8 0 -24 -23 -38 -52 -25 -55 -73 -107 -99 -108 -9 0 -26 -7 -39 -16 -18 -13 -28 -14 -47 -5 -33 15 -34 14 -34 -9 0 -10 -13 -34 -29 -52 -37 -44 -51 -71 -51 -103 0 -34 -92 -122 -138 -131 -42 -8 -44 -13 -36 -74 6 -46 9 -50 34 -50 25 0 31 -8 65 -87 20 -49 53 -114 72 -145 l34 -58 80 0 c64 0 79 -3 79 -15 0 -12 -17 -15 -94 -15 -87 0 -96 2 -110 22 -9 12 -16 32 -16 45 0 112 -152 -121 -189 -290 -15 -68 -67 -189 -98 -227 -5 -5 -147 -12 -213 -11 -25 1 -55 -4 -67 -10 -17 -9 -35 -10 -68 -2 -46 10 -46 10 -71 -26 -13 -20 -27 -52 -30 -72 -5 -27 -14 -40 -40 -54 -19 -10 -34 -22 -34 -26 0 -5 10 -44 21 -86 19 -69 30 -89 99 -173 42 -52 92 -119 110 -149 l33 -53 -17 -52 c-9 -29 -16 -67 -16 -83 0 -21 -12 -45 -36 -74 -31 -37 -35 -49 -32 -86 2 -35 0 -43 -13 -43 -11 0 -23 -16 -33 -47 -21 -62 -20 -70 10 -110 14 -19 32 -57 39 -84 8 -28 25 -65 39 -83 14 -19 30 -55 37 -82 7 -27 15 -54 20 -59 4 -6 15 -44 25 -85 16 -74 16 -74 -6 -92 -20 -16 -21 -21 -10 -74 12 -56 12 -57 -32 -143 -34 -68 -47 -85 -62 -83 -12 2 -31 -9 -50 -30 -18 -20 -56 -44 -89 -57 -53 -22 -59 -22 -76 -7 -10 9 -25 16 -35 16 -9 0 -26 5 -38 11 -56 30 -23 -45 43 -97 37 -29 52 -49 60 -79 17 -66 18 -68 43 -61 17 4 29 -1 47 -21 38 -41 120 -73 190 -73 33 0 70 -5 82 -11 39 -21 237 -210 315 -301 63 -75 80 -89 112 -94 45 -7 48 -9 83 -56 15 -21 34 -38 41 -38 6 0 33 -13 59 -30 90 -57 146 -28 105 52 -11 21 -26 38 -34 38 -19 0 -18 44 2 61 12 10 19 10 32 1 10 -7 23 -15 29 -18 13 -6 60 28 116 83 41 40 127 163 127 182 0 9 13 41 29 71 16 30 32 69 35 87 9 37 16 44 76 66 55 20 70 21 70 4 0 -22 -45 -57 -73 -57 -23 0 -28 -6 -37 -42 -6 -24 -15 -56 -20 -72 -22 -66 -7 -92 34 -61 28 21 63 19 76 -6 7 -12 18 -18 26 -15 8 3 14 1 14 -4 0 -19 -21 -21 -49 -4 -28 16 -30 16 -60 -5 -17 -13 -39 -37 -47 -54 -9 -18 -23 -39 -30 -48 -24 -27 -2 -69 35 -69 16 0 31 -5 33 -10 4 -13 131 36 152 59 8 9 28 62 43 116 25 90 28 115 27 248 -1 135 -3 151 -22 177 -17 23 -22 43 -22 93 0 108 6 124 55 143 29 11 45 24 49 39 4 17 16 25 42 30 45 8 52 2 25 -22 -12 -9 -21 -27 -21 -38 0 -15 -11 -24 -42 -35 -40 -14 -43 -18 -51 -63 -6 -41 -4 -54 13 -83 22 -34 26 -104 18 -266 -2 -42 2 -52 30 -81 22 -23 32 -43 32 -64 0 -48 9 -63 39 -63 41 0 71 -55 71 -129 0 -73 -11 -104 -55 -153 -30 -32 -35 -45 -35 -86 0 -41 -5 -53 -28 -74 -17 -15 -34 -45 -42 -74 -8 -27 -22 -62 -32 -79 -10 -16 -18 -44 -18 -61 0 -17 -7 -51 -15 -74 -8 -23 -15 -55 -15 -71 0 -16 -18 -73 -39 -126 -21 -54 -45 -120 -54 -148 -10 -36 -29 -65 -66 -101 -30 -30 -51 -60 -51 -73 0 -11 -6 -21 -13 -21 -9 0 -11 12 -9 39 4 40 -11 81 -29 81 -5 0 -17 -17 -26 -37 -8 -21 -30 -63 -49 -95 -31 -51 -38 -57 -77 -63 -23 -3 -72 -11 -109 -17 -53 -9 -71 -8 -82 2 -22 18 -46 5 -46 -25 0 -38 -18 -30 -22 9 l-3 35 -28 -39 -28 -39 38 -25 c21 -13 55 -27 76 -31 31 -5 37 -9 31 -23 -4 -9 -9 -34 -12 -55 -4 -34 -2 -37 22 -37 29 0 32 -18 17 -99 -8 -38 -6 -44 10 -48 25 -7 36 -66 20 -109 -9 -25 -9 -44 -1 -74 8 -31 8 -49 -2 -76 -12 -34 -11 -37 14 -58 29 -23 48 -63 48 -100 0 -13 9 -35 20 -49 l21 -26 -28 -18 c-15 -9 -43 -30 -61 -45 -18 -15 -41 -28 -51 -28 -11 0 -32 -20 -52 -49 -47 -69 -72 -79 -115 -46 -19 14 -34 30 -34 36 0 16 -76 10 -123 -10 -35 -15 -47 -26 -52 -50 -3 -16 -13 -35 -21 -42 -20 -17 -17 -69 6 -104 12 -18 20 -47 20 -72 0 -56 27 -113 55 -113 11 0 38 9 59 21 23 12 52 19 73 17 l35 -3 -87 -115 c-48 -63 -98 -126 -111 -140 -21 -23 -23 -30 -15 -78 4 -29 10 -54 12 -55 2 -2 29 -13 59 -25 54 -21 57 -22 104 -6 28 10 66 34 87 55 22 22 44 39 50 39 6 0 23 13 37 28 15 16 34 33 43 38 8 5 35 35 58 67 30 38 50 57 65 57 27 0 157 -62 174 -83 8 -9 43 -33 78 -52 60 -34 67 -35 99 -24 34 12 36 12 70 -21 19 -19 45 -49 58 -67 12 -18 37 -39 56 -46 31 -13 41 -12 88 4 29 11 61 19 72 19 11 0 24 6 28 14 4 7 21 16 38 19 25 4 37 -3 85 -45 60 -55 131 -93 161 -85 30 8 34 -29 9 -77 l-23 -42 57 -128 c46 -104 55 -134 50 -161 -6 -32 -4 -36 50 -70 41 -26 58 -44 64 -67 6 -24 19 -37 50 -53 22 -11 41 -23 42 -28 0 -4 11 -25 25 -46 l26 -38 137 -6 c105 -4 150 -10 192 -26 30 -12 58 -21 63 -21 4 0 28 19 52 41 32 30 45 49 45 69 0 15 5 41 11 59 10 27 15 31 43 29 46 -3 95 20 102 47 4 16 -2 30 -20 48 -31 31 -33 68 -7 129 38 89 212 218 295 218 47 0 96 55 96 108 0 38 31 102 50 102 5 0 10 13 10 28 0 21 -7 30 -29 39 -22 8 -32 21 -40 49 -18 64 -13 100 19 151 16 26 30 53 30 60 0 7 12 36 26 63 14 27 28 67 31 89 4 27 12 42 27 49 20 9 25 25 40 133 27 196 29 202 119 299 105 113 134 156 143 215 4 27 13 65 21 84 10 22 15 71 15 139 0 76 5 118 19 159 10 31 19 64 19 73 0 22 20 30 70 30 49 0 64 -19 70 -89 4 -41 9 -57 21 -59 19 -4 125 72 134 96 3 10 -7 29 -28 51 -87 91 -79 117 62 204 60 36 61 38 61 82 0 44 1 44 29 39 26 -5 30 -2 51 41 22 45 42 68 141 162 24 23 54 51 65 63 104 106 28 75 1064 432 l955 330 463 348 463 349 383 458 c211 252 394 463 407 469 22 10 35 54 153 495 70 266 130 486 132 488 2 2 24 -15 50 -39 41 -37 49 -41 77 -35 42 10 63 11 120 2 53 -8 58 0 27 44 -12 15 -24 52 -27 81 -3 29 -12 63 -20 74 -8 12 -13 37 -13 55 1 19 -9 62 -22 96 -21 59 -22 62 -5 81 14 15 15 25 8 45 -10 27 -1 45 34 64 7 5 16 33 20 64 l7 56 -46 47 c-26 25 -52 46 -60 46 -7 0 -19 11 -26 25 -10 20 -21 25 -50 25 -31 0 -41 6 -73 48 -40 53 -67 118 -67 163 0 16 -14 60 -31 98 -29 64 -35 72 -100 110 -50 30 -79 41 -109 41 l-40 0 0 59 0 60 33 -6 c18 -3 50 0 72 6 35 9 41 8 74 -18 20 -16 61 -41 91 -56 l54 -27 14 21 c11 16 25 21 59 21 50 0 101 19 123 45 13 16 12 20 -15 40 -22 18 -47 25 -111 30 -75 7 -89 11 -133 44 -27 20 -69 48 -93 64 -23 15 -77 51 -118 80 l-75 53 -100 -7 c-129 -10 -182 5 -210 57 -19 36 -43 50 -138 81 -27 9 -50 21 -53 27 -34 101 -48 127 -75 143 -16 10 -29 23 -29 30 0 7 -10 32 -22 57 -26 54 -55 70 -99 54 -33 -12 -33 -12 -64 46 -13 25 -68 44 -130 45 -53 2 -84 19 -104 59 -16 31 -63 30 -85 -2 -8 -14 -39 -37 -68 -53 l-53 -28 4 -117 3 -117 -48 -7 c-26 -4 -84 -4 -130 0 -65 5 -92 3 -124 -10 -40 -16 -41 -16 -123 19 -106 46 -154 53 -163 25 -5 -18 -12 -20 -49 -15 -23 4 -58 2 -76 -4 -87 -27 -101 -28 -151 -8 -27 10 -59 19 -71 19 -12 0 -30 7 -41 15 -14 11 -22 11 -36 3 -30 -19 -100 17 -101 51 -1 48 -15 65 -78 91 -52 22 -70 26 -104 19 -112 -22 -245 1 -304 52 -25 21 -31 35 -36 83 -3 31 -15 73 -27 93 -18 31 -19 40 -9 65 18 45 6 125 -23 155 -22 22 -28 23 -48 13 -35 -19 -75 -5 -160 57 -85 61 -109 98 -89 135 9 16 3 26 -35 64 l-45 45 -31 -16 c-17 -9 -47 -15 -65 -14 -22 2 -41 -3 -55 -16 -25 -23 -80 -22 -121 2 -20 12 -30 28 -34 55 -7 40 -14 45 -32 27 -9 -9 -29 -3 -79 20 -60 28 -74 31 -124 25 -57 -6 -58 -6 -130 45 -40 28 -80 51 -88 51 -8 0 -32 20 -53 44 -21 24 -51 48 -66 54 -15 5 -50 18 -77 27 -57 21 -205 151 -242 213 -25 41 -54 53 -141 53 -23 0 -34 6 -38 20 -4 10 -15 19 -26 19 -15 0 -19 7 -19 31 0 30 -1 31 -34 25 -39 -8 -83 9 -91 35 -8 24 -91 99 -111 99 -13 0 -15 6 -11 29 5 25 2 31 -16 37 -12 4 -38 20 -58 35 -37 29 -44 32 -66 22z';

const ECUADOR_VIEWBOX = '30 -20 960 1070';
const ECUADOR_GROUP_TRANSFORM = 'translate(0,1024) scale(0.1,-0.1)';

export default function Cobertura() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const countryPathRef = useRef<SVGPathElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapTiltRef = useRef<HTMLDivElement>(null);
  const citiesWrapRef = useRef<HTMLDivElement>(null);
  const cityRefs = useRef<Array<HTMLElement | null>>([]);
  const markerRefs = useRef<Array<SVGGElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cancelled = false;
    let revert: (() => void) | undefined;
    let removeTiltListeners: (() => void) | undefined;

    (async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const cities = cityRefs.current.filter(Boolean) as HTMLElement[];

        if (prefersReduced) {
          gsap.set([eyebrowRef.current, titleRef.current, introRef.current, mapRef.current, ...cities], {
            opacity: 1,
            autoAlpha: 1,
            y: 0,
            scale: 1,
          });
          if (countryPathRef.current) gsap.set(countryPathRef.current, { strokeDashoffset: 0 });
          return;
        }

        const headerTimeline = gsap.timeline({
          scrollTrigger: { trigger: section, start: 'top 74%', toggleActions: 'play none none reverse' },
        });
        headerTimeline
          .from(eyebrowRef.current, { autoAlpha: 0, y: 16, duration: 0.65, ease: 'power3.out' })
          .from(titleRef.current, { autoAlpha: 0, yPercent: 108, duration: 1.1, ease: 'power4.out' }, 0.08)
          .from(introRef.current, { autoAlpha: 0, yPercent: 105, duration: 0.85, ease: 'power3.out' }, 0.4);

        const countryPath = countryPathRef.current;
        if (countryPath) {
          const length = countryPath.getTotalLength();
          gsap.set(countryPath, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(countryPath, {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: mapRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
          });
        }

        gsap.from(cities, {
          autoAlpha: 0,
          y: 42,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: citiesWrapRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        });

        // Al hacer scroll por la lista de ciudades, el mapa señala la ciudad correspondiente.
        cityRefs.current.forEach((cityEl, i) => {
          if (!cityEl) return;
          ScrollTrigger.create({
            trigger: cityEl,
            start: 'top 55%',
            end: 'bottom 55%',
            onEnter: () => setActiveIndex(i),
            onEnterBack: () => setActiveIndex(i),
          });
        });

        // Tilt 3D sutil del mapa siguiendo el puntero — solo dispositivos con puntero fino.
        if (window.matchMedia('(pointer: fine)').matches && mapTiltRef.current) {
          const tilt = mapTiltRef.current;
          const rotateX = gsap.quickTo(tilt, 'rotationX', { duration: 0.7, ease: 'power3.out' });
          const rotateY = gsap.quickTo(tilt, 'rotationY', { duration: 0.7, ease: 'power3.out' });
          const onPointerMove = (event: PointerEvent) => {
            const rect = mapRef.current?.getBoundingClientRect();
            if (!rect) return;
            const nx = (event.clientX - rect.left) / rect.width - 0.5;
            const ny = (event.clientY - rect.top) / rect.height - 0.5;
            rotateX(ny * -7);
            rotateY(nx * 9);
          };
          const onPointerLeave = () => {
            rotateX(0);
            rotateY(0);
          };
          mapRef.current?.addEventListener('pointermove', onPointerMove);
          mapRef.current?.addEventListener('pointerleave', onPointerLeave);
          removeTiltListeners = () => {
            mapRef.current?.removeEventListener('pointermove', onPointerMove);
            mapRef.current?.removeEventListener('pointerleave', onPointerLeave);
          };
        }
      }, section);

      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
      removeTiltListeners?.();
    };
  }, []);

  // "Caída" del pin activo con rebote — refuerza el efecto 3D al cambiar de ciudad.
  useEffect(() => {
    const marker = markerRefs.current[activeIndex];
    if (!marker) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cancelled = false;
    (async () => {
      const { default: gsap } = await import('gsap');
      if (cancelled) return;
      gsap.fromTo(
        marker,
        { y: -16, scale: 0.7, transformOrigin: 'center bottom' },
        { y: 0, scale: 1, duration: 0.7, ease: 'bounce.out' }
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [activeIndex]);

  const active = CITIES[activeIndex];

  return (
    <section id="cobertura" ref={sectionRef} aria-labelledby="geo-coverage-title" className="relative overflow-clip bg-[#f8f3e9] text-navy-900" style={{ paddingBlock: 'clamp(5rem, 9vw, 9rem) clamp(6rem, 10vw, 10rem)' }}>
      <div className="w-full max-w-[120rem] mx-auto px-5 sm:px-8 lg:px-[5rem]">
        <header className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-x-4 lg:gap-x-6 items-start pb-14 lg:pb-20">
          <p ref={eyebrowRef} className="col-span-4 lg:col-start-1 lg:col-span-2 pt-3 text-navy-900/[55%] text-xs font-semibold tracking-[0.13em] uppercase">
            Cobertura nacional · Ecuador
          </p>
          <div className="col-span-4 md:col-span-7 lg:col-start-3 lg:col-span-8 mt-6 lg:mt-0 overflow-hidden pb-[0.08em]">
            <h2
              id="geo-coverage-title"
              ref={titleRef}
              className="h2-section max-w-[11ch] lg:max-w-[10ch]"
              style={{ textWrap: 'balance' }}
            >
              Artículos promocionales para empresas en Ecuador
            </h2>
          </div>
          <div className="col-span-4 md:col-span-6 lg:col-start-8 lg:col-span-5 mt-8 lg:mt-28 overflow-hidden">
            <p ref={introRef} className="max-w-[42ch] text-navy-900/70" style={{ fontSize: 'clamp(1rem, 1.2vw, 1.22rem)', lineHeight: 1.65 }}>
              Consulta las opciones disponibles y las condiciones aplicables para tu ciudad.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6">
          {/* Map — sticky on desktop */}
          <div className="lg:col-span-6 relative mb-14 lg:mb-0">
            <div className="lg:sticky" style={{ top: 'clamp(5rem, 9vh, 8rem)' }}>
              <div
                ref={mapRef}
                aria-hidden="true"
                className="relative overflow-hidden text-white"
                style={{
                  minHeight: 'min(56svh, 36rem)',
                  background: 'radial-gradient(circle at 54% 42%, rgba(0,191,255,0.12), transparent 42%), #060F1C',
                  perspective: '1600px',
                }}
              >
                <div ref={mapTiltRef} className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
                  <svg
                    viewBox={ECUADOR_VIEWBOX}
                    role="presentation"
                    focusable="false"
                    className="absolute inset-[6%] w-[88%] h-[88%] overflow-visible"
                    style={{ filter: 'drop-shadow(0 30px 45px rgba(0,0,0,0.5))' }}
                  >
                    <defs>
                      <radialGradient id="pinSphere" cx="35%" cy="30%" r="75%">
                        <stop offset="0%" stopColor="#bdeaff" />
                        <stop offset="45%" stopColor="#00BFFF" />
                        <stop offset="100%" stopColor="#0A3DA8" />
                      </radialGradient>
                      <radialGradient id="pinSphereInactive" cx="35%" cy="30%" r="75%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.35)" />
                      </radialGradient>
                      <filter id="pinGlow" x="-120%" y="-120%" width="340%" height="340%">
                        <feGaussianBlur stdDeviation="14" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    <g transform={ECUADOR_GROUP_TRANSFORM}>
                      <path ref={countryPathRef} d={COUNTRY_PATH} fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.42)" strokeWidth={2.6} vectorEffect="non-scaling-stroke" />
                    </g>

                    {CITIES.map((c, i) => {
                      const isActive = activeIndex === i;
                      return (
                        <g key={c.id} transform={`translate(${c.x} ${c.y})`}>
                        <g ref={(el) => { markerRefs.current[i] = el; }}>
                          {/* sombra de contacto en el "suelo" del mapa — refuerza la lectura 3D */}
                          <ellipse
                            cx={0}
                            cy={isActive ? 14 : 10}
                            rx={isActive ? 15 : 9}
                            ry={isActive ? 5 : 3.2}
                            fill="rgba(0,0,0,0.55)"
                            className="transition-all duration-500"
                            style={{ filter: 'blur(2px)' }}
                          />

                          {/* anillo de radar en loop — solo en la ciudad activa */}
                          {isActive && (
                            <circle
                              r={11}
                              fill="none"
                              stroke="#00BFFF"
                              strokeWidth={1.4}
                              className="map-pin-pulse"
                            />
                          )}

                          <circle
                            r={18}
                            fill="none"
                            stroke="rgba(0,191,255,0.55)"
                            strokeWidth={1}
                            className="transition-opacity duration-500"
                            opacity={isActive ? 0.8 : 0}
                          />

                          {/* pin esférico con sombreado radial — efecto 3D */}
                          <g style={{ filter: isActive ? 'url(#pinGlow)' : 'none' }}>
                            <circle
                              r={isActive ? 11 : 6}
                              fill={isActive ? 'url(#pinSphere)' : 'url(#pinSphereInactive)'}
                              stroke={isActive ? 'rgba(255,255,255,0.9)' : 'rgba(10,26,47,0.35)'}
                              strokeWidth={isActive ? 1.5 : 1}
                              className="transition-[r] duration-500 ease-out"
                              style={{ transform: `translateY(${isActive ? -3 : 0}px)`, transition: 'transform 500ms ease-out' }}
                            />
                            <circle
                              r={isActive ? 3.2 : 1.8}
                              cx={isActive ? -3.2 : -1.8}
                              cy={isActive ? -3.6 : -2}
                              fill="rgba(255,255,255,0.75)"
                              style={{ transform: `translateY(${isActive ? -3 : 0}px)`, transition: 'transform 500ms ease-out' }}
                            />
                          </g>
                        </g>
                        </g>
                      );
                    })}
                  </svg>

                  <div
                    className="absolute z-10 flex items-center gap-2 text-white/50 text-xs tracking-[0.1em] uppercase"
                    style={{ top: 'clamp(1.5rem, 3vw, 3rem)', left: 'clamp(1.5rem, 3vw, 3rem)', fontVariantNumeric: 'tabular-nums' }}
                  >
                    <span className="text-sky-300">{active.index}</span>
                    <span aria-hidden="true">/</span>
                    <span aria-hidden="true">04</span>
                    <span className="text-sky-300 ml-4">{active.name}</span>
                  </div>

                  <p className="absolute z-10 m-0 text-white/48 text-sm" style={{ right: 'clamp(1.5rem, 3vw, 3rem)', bottom: 'clamp(1.5rem, 3vw, 3rem)', left: 'clamp(1.5rem, 3vw, 3rem)', lineHeight: 1.5 }}>
                    Selecciona una ciudad para consultar información local.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cities accordion */}
          <div ref={citiesWrapRef} aria-label="Cobertura por ciudades" className="lg:col-start-8 lg:col-span-5 min-w-0">
            {CITIES.map((city, i) => {
              const isActive = activeIndex === i;
              return (
                <article
                  key={city.id}
                  ref={(el) => { cityRefs.current[i] = el; }}
                  className="relative border-t border-navy-900/20 last:border-b"
                  onPointerEnter={() => {
                    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setActiveIndex(i);
                  }}
                >
                  <h3 className="m-0">
                    <button
                      type="button"
                      aria-expanded={isActive}
                      aria-controls={`geo-city-${city.id}-content`}
                      onClick={() => setActiveIndex(i)}
                      onFocus={() => setActiveIndex(i)}
                      className="w-full min-h-[6rem] lg:min-h-[7rem] py-6 lg:py-10 grid gap-3 lg:gap-6 items-start text-left bg-transparent border-0 cursor-pointer"
                      style={{ gridTemplateColumns: '1.5rem minmax(0,1fr) 1.5rem' }}
                    >
                      <span aria-hidden="true" className="pt-2 text-navy-900/[42%] text-xs font-semibold tracking-[0.1em]">
                        {city.index}
                      </span>
                      <span
                        className="h3-card transition-colors duration-500"
                        style={{ color: isActive ? '#0A1A2F' : 'rgba(10,26,47,0.62)' }}
                      >
                        {city.heading}
                      </span>
                      <span
                        aria-hidden="true"
                        className="justify-self-end text-2xl font-light transition-transform duration-500"
                        style={{ transform: isActive ? 'rotate(45deg)' : 'none' }}
                      >
                        +
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`geo-city-${city.id}-content`}
                    className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-700 ease-out"
                    style={{ gridTemplateRows: isActive ? '1fr' : '0fr', opacity: isActive ? 1 : 0 }}
                  >
                    <div className="overflow-hidden" style={{ paddingLeft: 'calc(1.5rem + 1rem)', paddingBottom: isActive ? 'clamp(2.5rem, 5vw, 5rem)' : 0 }}>
                      <p className="max-w-[44ch] text-navy-900/70" style={{ fontSize: 'clamp(0.96rem, 1vw, 1.08rem)', lineHeight: 1.65 }}>
                        {city.summary}
                      </p>

                      <dl className="mt-8">
                        <div className="grid gap-x-6 gap-y-1 py-4 border-t border-navy-900/[13%]" style={{ gridTemplateColumns: 'minmax(8rem, 0.75fr) 1.25fr' }}>
                          <dt className="text-navy-900/[48%] text-[0.68rem] font-semibold tracking-[0.1em] uppercase">Cobertura y entrega</dt>
                          <dd className="m-0 text-navy-900/[72%] text-sm" style={{ lineHeight: 1.55 }}>{city.coverage}</dd>
                        </div>
                        <div className="grid gap-x-6 gap-y-1 py-4 border-t border-navy-900/[13%]" style={{ gridTemplateColumns: 'minmax(8rem, 0.75fr) 1.25fr' }}>
                          <dt className="text-navy-900/[48%] text-[0.68rem] font-semibold tracking-[0.1em] uppercase">Categorías demandadas</dt>
                          <dd className="m-0 text-navy-900/[72%] text-sm" style={{ lineHeight: 1.55 }}>{city.categories}</dd>
                        </div>
                      </dl>

                      <Link href={city.href} className="group relative w-fit min-h-[2.75rem] mt-8 inline-flex items-center gap-3 text-navy-900 text-sm font-semibold">
                        <span>Ver artículos promocionales en {city.name}</span>
                        <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                        <span aria-hidden="true" className="absolute left-0 right-0 bottom-1 h-px bg-current origin-left scale-x-[0.2] transition-transform duration-500 group-hover:scale-x-100" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
