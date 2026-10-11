// Lista de cotización (borrador local, sin backend).
// Solo guarda slug + cantidad por producto; nunca datos personales ni logos.
// Los datos del producto se resuelven al mostrar la lista (índice de búsqueda)
// para detectar productos retirados. No existe "solicitud recibida": el envío
// se hace por WhatsApp o correo, que el usuario revisa y envía.
'use client';

import { useSyncExternalStore } from 'react';

export interface QuoteItem {
  slug: string;
  sku: string;
  /** null = cantidad aún no definida */
  quantity: number | null;
}

const STORAGE_KEY = 'pg-quote-v1';
const MAX_QUANTITY = 1_000_000;

type Listener = () => void;
const listeners = new Set<Listener>();
let cache: QuoteItem[] | null = null;
const EMPTY: QuoteItem[] = [];

function isValidItem(x: unknown): x is QuoteItem {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return typeof o.slug === 'string' && typeof o.sku === 'string' &&
    (o.quantity === null || (Number.isInteger(o.quantity) && (o.quantity as number) > 0));
}

function read(): QuoteItem[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Borrador con formato desconocido se descarta en lugar de romper la página.
    cache = Array.isArray(parsed) ? parsed.filter(isValidItem) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(items: QuoteItem[]) {
  cache = items;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Almacenamiento no disponible (modo privado / cuota): la lista vive solo en memoria.
  }
  listeners.forEach((l) => l());
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      listeners.forEach((l) => l());
    }
  });
}

export function sanitizeQuantity(value: unknown): number | null {
  const n = typeof value === 'string' ? Number(value.trim()) : Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.min(Math.floor(n), MAX_QUANTITY);
}

export const quoteStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => read(),
  getServerSnapshot: () => EMPTY,
  add(item: QuoteItem) {
    const items = read();
    const existing = items.find((i) => i.slug === item.slug);
    if (existing) {
      write(items.map((i) => (i.slug === item.slug ? { ...i, quantity: item.quantity ?? i.quantity } : i)));
    } else {
      write([...items, item]);
    }
  },
  update(slug: string, quantity: number | null) {
    write(read().map((i) => (i.slug === slug ? { ...i, quantity } : i)));
  },
  remove(slug: string) {
    write(read().filter((i) => i.slug !== slug));
  },
  restore(items: QuoteItem[]) {
    write(items);
  },
  clear() {
    write([]);
  },
};

export function useQuoteItems(): QuoteItem[] {
  return useSyncExternalStore(quoteStore.subscribe, quoteStore.getSnapshot, quoteStore.getServerSnapshot);
}
