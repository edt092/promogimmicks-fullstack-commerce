'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/tienda', label: 'Tienda' },
    { href: '/#servicios', label: 'Servicios' },
    { href: '/blog', label: 'Blog' },
  ];

  const navBg = isMobileMenuOpen
    ? 'bg-slate-950'
    : isScrolled
    ? 'bg-white shadow-sm border-b border-slate-100'
    : 'bg-slate-950/80 backdrop-blur-xl';

  const linkColor = isScrolled && !isMobileMenuOpen
    ? 'text-slate-600 hover:text-sky-600'
    : 'text-white/80 hover:text-white';

  const logoColor = isScrolled && !isMobileMenuOpen ? 'text-slate-900' : 'text-white';
  const toggleColor = isScrolled && !isMobileMenuOpen ? 'text-slate-900' : 'text-white';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">

            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${logoColor}`}>
                Promo
              </span>
              <span className="text-xl font-bold text-sky-500 tracking-tight">Gimmicks</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium relative group transition-colors duration-200 ${linkColor}`}
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-sky-500 group-hover:w-full transition-all duration-300 rounded-full" />
                </Link>
              ))}
              <Link
                href="/#contacto"
                className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-sky-500/30 whitespace-nowrap"
              >
                Cotizar ahora
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors duration-200 relative z-50 ${toggleColor}`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-slate-950 flex flex-col"
          >
            <div className="flex flex-col items-center justify-center flex-1 gap-7 px-8 pt-16">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.25 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-bold text-white hover:text-sky-400 transition-colors block text-center"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + navLinks.length * 0.07, duration: 0.25 }}
                className="mt-2"
              >
                <Link
                  href="/#contacto"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-sky-500 hover:bg-sky-600 text-white text-lg font-bold px-10 py-3.5 rounded-full transition-colors block text-center"
                >
                  Cotizar ahora
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
