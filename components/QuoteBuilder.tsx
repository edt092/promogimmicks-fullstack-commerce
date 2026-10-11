'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Trash2, MessageCircle, Mail, Copy, AlertCircle } from 'lucide-react';
import { quoteStore, useQuoteItems, sanitizeQuantity } from '@/lib/quote';
import { loadSearchIndex, type SearchItem } from '@/lib/search';
import { whatsappUrl, absoluteUrl, CONTACT_EMAIL } from '@/lib/site';

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-blue-700 focus:ring-2 focus:ring-blue-200 outline-none';

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return d && m && y ? `${d}/${m}/${y}` : iso;
}

export default function QuoteBuilder() {
  const items = useQuoteItems();
  const [catalog, setCatalog] = useState<Map<string, SearchItem> | null>(null);
  const [catalogError, setCatalogError] = useState(false);
  const [ciudad, setCiudad] = useState('');
  const [fecha, setFecha] = useState('');
  const [sinFecha, setSinFecha] = useState(false);
  const [empresa, setEmpresa] = useState('');
  const [notas, setNotas] = useState('');
  const [asesoria, setAsesoria] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reviewed, setReviewed] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'ok' | 'error'>('idle');
  const summaryRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (items.length === 0 || catalog) return;
    loadSearchIndex()
      .then((rows) => setCatalog(new Map(rows.map((r) => [r.slug, r]))))
      .catch(() => setCatalogError(true));
  }, [items.length, catalog]);

  const resolved = useMemo(
    () => items.map((i) => ({ item: i, product: catalog?.get(i.slug) ?? null })),
    [items, catalog]
  );
  const retired = catalog ? resolved.filter((r) => !r.product) : [];

  const message = useMemo(() => {
    const lines = ['Hola, quiero solicitar una cotización:', ''];
    resolved.forEach(({ item, product }, idx) => {
      const name = product?.nombre ?? item.slug;
      const qty = item.quantity ? `${item.quantity} unidades` : 'cantidad por definir';
      lines.push(`${idx + 1}. ${name} (SKU ${item.sku}) — ${qty}`);
      lines.push(`   ${absoluteUrl(`/tienda/${item.slug}/`)}`);
    });
    lines.push('');
    lines.push(`Ciudad de entrega: ${ciudad.trim() || 'por indicar'}`);
    lines.push(`Fecha requerida: ${sinFecha || !fecha ? 'aún no definida' : formatDate(fecha)}`);
    if (empresa.trim()) lines.push(`Empresa: ${empresa.trim()}`);
    if (notas.trim()) lines.push(`Personalización / notas: ${notas.trim()}`);
    if (asesoria) lines.push('Necesito asesoría sobre la técnica de personalización.');
    return lines.join('\n');
  }, [resolved, ciudad, fecha, sinFecha, empresa, notas, asesoria]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (items.length === 0) e.items = 'Agrega al menos un producto a tu cotización.';
    if (!ciudad.trim()) e.ciudad = 'Indica la ciudad de entrega para revisar cobertura y condiciones.';
    if (!sinFecha && !fecha) e.fecha = 'Indica la fecha requerida o marca “Aún no definida”.';
    if (retired.length) e.items = 'Quita los productos que ya no están en el catálogo antes de continuar.';
    setErrors(e);
    return e;
  };

  const review = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setReviewed(false);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setReviewed(true);
    requestAnimationFrame(() => reviewRef.current?.focus());
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopyState('ok');
    } catch {
      setCopyState('error');
    }
  };

  // Cualquier cambio invalida la revisión: el mensaje enviado siempre es el revisado.
  useEffect(() => { setReviewed(false); setCopyState('idle'); }, [message]);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h2 className="text-xl font-bold text-blue-900 mb-2">Tu lista está vacía</h2>
        <p className="text-slate-600 mb-6">Agrega productos del catálogo para pedir una cotización con todos a la vez.</p>
        <Link href="/tienda/" className="inline-flex min-h-[44px] items-center rounded-full bg-blue-900 px-6 py-3 font-semibold text-white hover:bg-blue-800">
          Ver catálogo
        </Link>
      </div>
    );
  }

  const errorList = Object.values(errors);

  return (
    <div className="space-y-8">
      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 outline-none">
          <p className="font-semibold flex items-center gap-2 mb-1"><AlertCircle size={16} aria-hidden="true" /> Revisa estos puntos:</p>
          <ul className="list-disc pl-6">{errorList.map((m) => <li key={m}>{m}</li>)}</ul>
        </div>
      )}

      <section aria-labelledby="quote-items-title">
        <h2 id="quote-items-title" className="text-xl font-bold text-blue-900 mb-4">1. Productos ({items.length})</h2>
        {catalogError && (
          <p className="mb-3 text-sm text-amber-800">No pudimos cargar los nombres de los productos; se enviarán con su SKU.</p>
        )}
        <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {resolved.map(({ item, product }) => {
            const qtyId = `qty-${item.slug}`;
            return (
              <li key={item.slug} className="flex flex-wrap items-center gap-4 p-4">
                <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-slate-50">
                  {product && <img src={product.imagen_url} alt="" className="h-full w-full object-contain p-1" loading="lazy" />}
                </div>
                <div className="min-w-0 flex-1 basis-[calc(100%-5rem)] sm:basis-auto">
                  {product ? (
                    <Link href={`/tienda/${item.slug}/`} className="font-semibold text-blue-900 hover:underline">{product.nombre}</Link>
                  ) : catalog ? (
                    <p className="font-semibold text-red-700">Este producto ya no está en el catálogo</p>
                  ) : (
                    <p className="text-slate-500">Cargando…</p>
                  )}
                  <p className="text-xs text-slate-500">SKU {item.sku}</p>
                </div>
                <div className="flex-1 sm:flex-none sm:w-36">
                  <label htmlFor={qtyId} className="block text-xs font-medium text-slate-700 mb-1">Cantidad (unidades)</label>
                  <input
                    id={qtyId}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    placeholder="Por definir"
                    value={item.quantity ?? ''}
                    onChange={(e) => quoteStore.update(item.slug, sanitizeQuantity(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => quoteStore.remove(item.slug)}
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-700"
                  aria-label={`Quitar ${product?.nombre ?? item.sku} de la cotización`}
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-2 text-sm text-slate-600">
          El pedido mínimo, el precio y la técnica de personalización se confirman en la cotización de cada modelo.{' '}
          <Link href="/tienda/" className="text-blue-900 underline">Agregar más productos</Link>
        </p>
      </section>

      <section aria-labelledby="quote-req-title" className="grid gap-5 sm:grid-cols-2">
        <h2 id="quote-req-title" className="sm:col-span-2 text-xl font-bold text-blue-900">2. Tu requerimiento</h2>
        <div>
          <label htmlFor="q-ciudad" className="block text-sm font-medium text-slate-800 mb-1">Ciudad de entrega</label>
          <input id="q-ciudad" autoComplete="address-level2" value={ciudad} onChange={(e) => setCiudad(e.target.value)}
            aria-invalid={!!errors.ciudad} aria-describedby={errors.ciudad ? 'q-ciudad-err' : undefined} className={inputClass} />
          {errors.ciudad && <p id="q-ciudad-err" className="mt-1 text-sm text-red-700">{errors.ciudad}</p>}
        </div>
        <div>
          <label htmlFor="q-fecha" className="block text-sm font-medium text-slate-800 mb-1">Fecha en la que lo necesitas</label>
          <input id="q-fecha" type="date" value={fecha} disabled={sinFecha} onChange={(e) => setFecha(e.target.value)}
            aria-invalid={!!errors.fecha} aria-describedby={errors.fecha ? 'q-fecha-err q-fecha-help' : 'q-fecha-help'} className={inputClass} />
          <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700 min-h-[32px]">
            <input type="checkbox" checked={sinFecha} onChange={(e) => setSinFecha(e.target.checked)} className="h-4 w-4" />
            Aún no definida
          </label>
          <p id="q-fecha-help" className="text-xs text-slate-500">Es una preferencia: confirmaremos si el plazo es viable.</p>
          {errors.fecha && <p id="q-fecha-err" className="mt-1 text-sm text-red-700">{errors.fecha}</p>}
        </div>
        <div>
          <label htmlFor="q-empresa" className="block text-sm font-medium text-slate-800 mb-1">Empresa <span className="font-normal text-slate-500">(opcional)</span></label>
          <input id="q-empresa" autoComplete="organization" value={empresa} onChange={(e) => setEmpresa(e.target.value)} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="q-notas" className="block text-sm font-medium text-slate-800 mb-1">Personalización y notas <span className="font-normal text-slate-500">(opcional)</span></label>
          <textarea id="q-notas" rows={3} value={notas} onChange={(e) => setNotas(e.target.value)}
            placeholder="Ej.: logo a 1 color, colores del producto, presupuesto aproximado" className={inputClass} />
          <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700 min-h-[32px]">
            <input type="checkbox" checked={asesoria} onChange={(e) => setAsesoria(e.target.checked)} className="h-4 w-4" />
            Necesito asesoría sobre la técnica de personalización
          </label>
          <p className="text-xs text-slate-500">Puedes enviar tu logo después, por WhatsApp o correo.</p>
        </div>
      </section>

      <section aria-labelledby="quote-review-title" className="space-y-4">
        {!reviewed ? (
          <button type="button" onClick={review}
            className="w-full sm:w-auto min-h-[48px] rounded-xl bg-blue-900 px-8 py-3 font-bold text-white hover:bg-blue-800">
            Revisar solicitud
          </button>
        ) : (
          <>
            <h2 id="quote-review-title" ref={reviewRef} tabIndex={-1} className="text-xl font-bold text-blue-900 outline-none">3. Revisa y envía</h2>
            <label htmlFor="q-preview" className="block text-sm font-medium text-slate-800">Este es el mensaje que se enviará:</label>
            <textarea id="q-preview" readOnly rows={Math.min(16, message.split('\n').length + 1)} value={message}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-sm text-slate-800" />
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer"
                className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700">
                <MessageCircle size={20} aria-hidden="true" /> Abrir WhatsApp con mi solicitud
              </a>
              <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Solicitud de cotización')}&body=${encodeURIComponent(message)}`}
                className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl border-2 border-blue-900 px-6 py-3 font-semibold text-blue-900 hover:bg-blue-50">
                <Mail size={18} aria-hidden="true" /> Enviar por correo
              </a>
              <button type="button" onClick={copy}
                className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50">
                <Copy size={18} aria-hidden="true" /> Copiar mensaje
              </button>
            </div>
            <p role="status" aria-live="polite" className="text-sm text-slate-700">
              {copyState === 'ok' && 'Mensaje copiado.'}
              {copyState === 'error' && 'No pudimos copiar el mensaje: selecciónalo en el cuadro de arriba y cópialo manualmente.'}
            </p>
            <p className="text-sm text-slate-600">
              Se abrirá WhatsApp (o tu correo) con tu solicitud. <strong>Revisa el mensaje y envíalo</strong> para iniciar la conversación;
              tu lista se conserva en este navegador hasta que la vacíes.
            </p>
            <button type="button" onClick={() => quoteStore.clear()} className="text-sm text-slate-500 underline py-2">
              Vaciar lista
            </button>
          </>
        )}
      </section>
    </div>
  );
}
