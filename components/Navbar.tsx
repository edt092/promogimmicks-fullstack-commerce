'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, Search, ClipboardList } from 'lucide-react';
import { Logo } from './Logo';
import { loadSearchIndex, searchItems, type SearchItem } from '@/lib/search';
import { whatsappUrl } from '@/lib/site';
import { useQuoteItems } from '@/lib/quote';

// El índice de búsqueda (~2.000 productos) se descarga solo al abrir el buscador;
// antes el catálogo completo se incluía en el JS de todas las páginas.
function useProductSearch(term: string, enabled: boolean) {
  const [items, setItems] = useState<SearchItem[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!enabled || items) return;
    let cancelled = false;
    loadSearchIndex()
      .then((data) => { if (!cancelled) setItems(data); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [enabled, items]);

  const results = useMemo(() => (items ? searchItems(items, term, 6) : []), [items, term]);
  return { results, loading: enabled && !items && !error, error };
}

function SearchResults({ term, onNavigate }: { term: string; onNavigate: () => void }) {
  const { results, loading, error } = useProductSearch(term, true);
  if (term.trim().length < 2) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
      {results.length > 0 ? (
        <>
        <ul className="max-h-96 overflow-y-auto divide-y divide-slate-50">
          {results.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/tienda/${p.slug}/`}
                onClick={onNavigate}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
              >
                <span className="w-11 h-11 rounded-lg bg-slate-50 flex-shrink-0 overflow-hidden">
                  <img src={p.imagen_url} alt="" className="w-full h-full object-contain p-1" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-ink truncate">{p.nombre}</span>
                  <span className="block text-xs text-slate-500">{p.sku} · {p.categoria}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={`/tienda/?q=${encodeURIComponent(term.trim())}`}
          onClick={onNavigate}
          className="block px-4 py-3 text-sm font-semibold text-blue-900 bg-slate-50 hover:bg-slate-100 text-center"
        >
          Ver todos los resultados para &quot;{term.trim()}&quot;
        </Link>
        </>
      ) : (
        <p className="px-4 py-6 text-sm text-slate-500 text-center" role="status" aria-live="polite">
          {loading
            ? 'Cargando catálogo…'
            : error
              ? 'No se pudo cargar el buscador. Intenta de nuevo o visita la tienda.'
              : <>No encontramos coincidencias para «{term}». Prueba con el tipo de producto o su código. <Link href="/tienda/" onClick={onNavigate} className="underline">Ver todo el catálogo</Link></>}
        </p>
      )}
    </div>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const quoteCount = useQuoteItems().length;

  // Menú móvil accesible: foco al primer enlace al abrir, Escape cierra y devuelve
  // el foco al botón, y el fondo no se desplaza mientras el overlay está abierto.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => menuPanelRef.current?.querySelector<HTMLElement>('a')?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/novedades/', label: 'Novedades' },
    { href: '/productos/', label: 'Productos' },
    { href: '/promociones/', label: 'Promociones' },
    { href: '/blog/', label: 'Blog' },
  ];

  const navBg = isMobileMenuOpen
    ? 'bg-navy'
    : isScrolled
    ? 'bg-white shadow-sm border-b border-slate-100'
    : 'bg-navy/80 backdrop-blur-xl';

  const linkColor = isScrolled && !isMobileMenuOpen
    ? 'text-slate-700 hover:text-brand'
    : 'text-white/80 hover:text-white';

  const logoVariant = isScrolled && !isMobileMenuOpen ? 'light' : 'dark';
  const toggleColor = isScrolled && !isMobileMenuOpen ? 'text-ink' : 'text-white';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-4">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0" aria-label="PromoGimmicks - Inicio">
              <Logo variant={logoVariant} />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 lg:gap-7 flex-1 justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium relative group transition-colors duration-200 whitespace-nowrap ${linkColor}`}
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-sky-500 group-hover:w-full transition-all duration-300 rounded-full" />
                </Link>
              ))}
            </div>

            {/* Search + CTA (desktop) */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <div ref={searchBoxRef} className="relative">
                <div
                  className={`flex items-center rounded-full border transition-all duration-300 overflow-hidden ${
                    searchOpen ? 'w-64 pl-3 pr-2' : 'w-9 justify-center'
                  } ${
                    isScrolled && !isMobileMenuOpen
                      ? 'border-slate-200 bg-slate-50'
                      : 'border-white/25 bg-white/10'
                  }`}
                >
                  <button
                    onClick={() => setSearchOpen((v) => !v)}
                    aria-label={searchOpen ? 'Cerrar búsqueda' : 'Buscar productos'}
                    aria-expanded={searchOpen}
                    className={`flex-shrink-0 p-2 rounded-full ${isScrolled ? 'text-slate-500' : 'text-white/80'}`}
                  >
                    <Search size={16} />
                  </button>
                  {searchOpen && (
                    <input
                      autoFocus
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Mug, bolígrafo o código…"
                      aria-label="Buscar en el catálogo"
                      className={`w-full bg-transparent text-sm py-2 outline-none ${
                        isScrolled ? 'text-ink placeholder:text-slate-400' : 'text-white placeholder:text-white/50'
                      }`}
                    />
                  )}
                </div>
                {searchOpen && (
                  <SearchResults term={searchTerm} onNavigate={() => setSearchOpen(false)} />
                )}
              </div>

              <Link
                href="/cotizacion/"
                className={`relative p-2 rounded-full ${isScrolled ? 'text-slate-600 hover:text-blue-900' : 'text-white/85 hover:text-white'}`}
                aria-label={quoteCount ? `Tu cotización: ${quoteCount} producto${quoteCount === 1 ? '' : 's'}` : 'Tu cotización'}
              >
                <ClipboardList size={18} aria-hidden="true" />
                {quoteCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center" aria-hidden="true">
                    {quoteCount}
                  </span>
                )}
              </Link>

              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-magnetic bg-brand hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors duration-200 shadow-sm hover:shadow-brand-glow whitespace-nowrap"
              >
                Cotizar ahora
              </a>
            </div>

            {/* Mobile: search + toggle */}
            <div className="md:hidden flex items-center gap-1">
              <Link
                href="/cotizacion/"
                className={`relative p-2.5 rounded-lg ${toggleColor}`}
                aria-label={quoteCount ? `Tu cotización: ${quoteCount} producto${quoteCount === 1 ? '' : 's'}` : 'Tu cotización'}
              >
                <ClipboardList size={20} aria-hidden="true" />
                {quoteCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center" aria-hidden="true">
                    {quoteCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => { setSearchOpen((v) => !v); setIsMobileMenuOpen(false); }}
                className={`p-2.5 rounded-lg transition-colors duration-200 ${toggleColor}`}
                aria-label={searchOpen ? 'Cerrar búsqueda' : 'Buscar productos'}
                aria-expanded={searchOpen}
              >
                <Search size={20} />
              </button>
              <button
                ref={menuButtonRef}
                onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); setSearchOpen(false); }}
                className={`p-2.5 rounded-lg transition-colors duration-200 relative z-50 ${toggleColor}`}
                aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden absolute left-0 right-0 top-16 bg-white shadow-lg px-4 py-3"
              >
                <div className="relative flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3">
                  <Search size={16} className="text-slate-400 flex-shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Mug, bolígrafo o código…"
                    aria-label="Buscar en el catálogo"
                    className="w-full bg-transparent text-sm py-2.5 outline-none text-ink placeholder:text-slate-400"
                  />
                </div>
                <SearchResults term={searchTerm} onNavigate={() => setSearchOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
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
            id="mobile-menu"
            ref={menuPanelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menú principal"
            className="fixed inset-0 z-40 bg-navy flex flex-col"
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
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-brand hover:bg-brand-600 text-white text-lg font-bold px-10 py-3.5 rounded-full transition-colors block text-center"
                >
                  Cotizar ahora
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
