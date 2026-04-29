'use client';

import { useId } from 'react';

function LogoMark({ size }: { size: number }) {
  const uid = useId().replace(/:/g, '_');
  const bgId = `pg_bg${uid}`;
  const clipId = `pg_clip${uid}`;

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#254db0" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect width="32" height="32" rx="7" />
        </clipPath>
      </defs>
      <rect width="32" height="32" rx="7" fill={`url(#${bgId})`} />
      <rect width="32" height="14" fill="white" fillOpacity={0.07} clipPath={`url(#${clipId})`} />
      <text
        x="4" y="23"
        fontFamily="'Arial Black', system-ui, sans-serif"
        fontWeight="900"
        fontSize="18"
        fill="white"
      >P</text>
      <text
        x="16" y="23"
        fontFamily="'Arial Black', system-ui, sans-serif"
        fontWeight="900"
        fontSize="18"
        fill="#0ea5e9"
      >G</text>
    </svg>
  );
}

interface LogoProps {
  variant?: 'dark' | 'light';
  markSize?: number;
  className?: string;
}

export function Logo({ variant = 'dark', markSize = 28, className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 group ${className}`}>
      <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-[1.07] will-change-transform">
        <LogoMark size={markSize} />
      </span>
      <span className="font-bold text-lg tracking-tight leading-none">
        <span
          className={`transition-colors duration-300 ${
            variant === 'light' ? 'text-slate-900' : 'text-white'
          }`}
        >
          Promo
        </span>
        <span className={variant === 'light' ? 'text-sky-600' : 'text-sky-400'}>
          Gimmicks
        </span>
      </span>
    </span>
  );
}
