'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ClipboardPlus, Check } from 'lucide-react';
import { quoteStore, useQuoteItems, type QuoteItem } from '@/lib/quote';

interface Props {
  slug: string;
  sku: string;
  nombre: string;
  /** Cantidad elegida en la ficha (null = por definir). */
  quantity?: number | null;
  compact?: boolean;
  className?: string;
}

export default function AddToQuoteButton({ slug, sku, nombre, quantity = null, compact = false, className = '' }: Props) {
  const items = useQuoteItems();
  const inList = items.some((i) => i.slug === slug);
  const [previous, setPrevious] = useState<QuoteItem[] | null>(null);
  const [message, setMessage] = useState('');

  const add = () => {
    setPrevious(items);
    quoteStore.add({ slug, sku, quantity });
    setMessage(inList ? `Actualizamos ${nombre} en tu cotización.` : `Agregamos ${nombre} a tu cotización.`);
  };

  const undo = () => {
    if (previous) quoteStore.restore(previous);
    setPrevious(null);
    setMessage('Cambio deshecho.');
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={add}
        aria-label={compact ? `Agregar ${nombre} a la cotización` : undefined}
        className={
          compact
            ? 'w-full min-h-[40px] bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 px-3 py-2 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors'
            : 'w-full min-h-[48px] bg-white hover:bg-sky-50 text-blue-900 px-6 py-3.5 rounded-xl font-semibold border-2 border-blue-900 transition-colors flex items-center justify-center gap-2'
        }
      >
        {inList ? <Check size={compact ? 13 : 18} aria-hidden="true" /> : <ClipboardPlus size={compact ? 13 : 18} aria-hidden="true" />}
        {inList ? (compact ? 'En tu cotización' : 'En tu cotización · actualizar') : 'Agregar a cotización'}
      </button>
      <p role="status" aria-live="polite" className={`${message ? 'mt-2' : ''} text-xs text-slate-600 flex flex-wrap items-center gap-x-2`}>
        {message && (
          <>
            <span>{message}</span>
            {previous && (
              <button type="button" onClick={undo} className="underline text-blue-900 py-1">Deshacer</button>
            )}
            <Link href="/cotizacion/" className="underline text-blue-900 py-1">Ver cotización</Link>
          </>
        )}
      </p>
    </div>
  );
}
