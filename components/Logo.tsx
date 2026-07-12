'use client';

import Image from 'next/image';

interface LogoProps {
  variant?: 'dark' | 'light';
  markSize?: number;
  className?: string;
}

// Aspect ratio real del archivo de marca (public/img/brand/promogimmicks-logo.png): 1042x266.
const LOGO_ASPECT = 1042 / 266;

export function Logo({ markSize = 44, className = '' }: LogoProps) {
  const height = markSize;
  const width = Math.round(height * LOGO_ASPECT);

  return (
    <span className={`inline-flex items-center group ${className}`}>
      <span className="flex-shrink-0 transition-transform duration-300 group-hover:scale-[1.04] will-change-transform">
        <Image
          src="/img/brand/promogimmicks-logo.png"
          alt="Promogimmicks"
          width={width}
          height={height}
          priority
          style={{ height, width: 'auto' }}
        />
      </span>
    </span>
  );
}
