'use client';

import { MotionConfig } from 'framer-motion';

// Framer Motion respeta prefers-reduced-motion en todo el sitio (GSAP y Three.js
// ya lo comprueban en HeroSection / Confianza).
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
