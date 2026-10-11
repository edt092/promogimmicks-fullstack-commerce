// Búsqueda de catálogo para componentes cliente. NO importa products.json:
// el índice mínimo se descarga bajo demanda desde /search-index.json.

/** Entrada del índice: [nombre, slug, sku, categoria, categoria_slug, imagen_url, descripcion (recortada)] */
export type SearchIndexRow = [string, string, string, string, string, string, string];

export interface SearchItem {
  nombre: string;
  slug: string;
  sku: string;
  categoria: string;
  categoria_slug: string;
  imagen_url: string;
  descripcion_corta: string;
  /** texto normalizado precalculado */
  haystack: string;
}

export const SEARCH_INDEX_URL = '/search-index.json';

export function normalizeQuery(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Sinónimos usados en Ecuador ↔ vocabulario del proveedor. Cada grupo es equivalente.
const ALIAS_GROUPS: string[][] = [
  ['esfero', 'esferos', 'boligrafo', 'boligrafos', 'lapicero', 'lapiceros'],
  ['taza', 'tazas', 'mug', 'mugs', 'jarro', 'jarros'],
  ['tomatodo', 'tomatodos', 'botilito', 'botilitos', 'botella', 'botellas', 'termo', 'termos'],
  ['mochila', 'mochilas', 'morral', 'morrales', 'backpack'],
  ['gorra', 'gorras', 'cachucha', 'cachuchas'],
  ['memoria', 'memorias', 'usb', 'pendrive', 'flash'],
  ['sombrilla', 'sombrillas', 'paraguas'],
  ['antiestres', 'antistress', 'antiestress'],
];

const ALIASES = new Map<string, string[]>();
for (const group of ALIAS_GROUPS) for (const w of group) ALIASES.set(w, group);

let cache: SearchItem[] | null = null;
let pending: Promise<SearchItem[]> | null = null;

export function loadSearchIndex(): Promise<SearchItem[]> {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = fetch(SEARCH_INDEX_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`search index ${r.status}`);
        return r.json() as Promise<SearchIndexRow[]>;
      })
      .then((rows) => {
        cache = rows.map(([nombre, slug, sku, categoria, categoria_slug, imagen_url, descripcion_corta]) => ({
          nombre, slug, sku, categoria, categoria_slug, imagen_url, descripcion_corta,
          haystack: normalizeQuery(`${nombre} ${sku} ${categoria} ${slug.replace(/-/g, ' ')}`),
        }));
        return cache;
      })
      .catch((err) => {
        pending = null;
        throw err;
      });
  }
  return pending;
}

/**
 * Coincidencia por términos: todos los términos de la consulta deben aparecer
 * (directamente o vía sinónimo). SKU exacto primero, luego coincidencia en nombre.
 */
export function searchItems(items: SearchItem[], query: string, limit?: number): SearchItem[] {
  const q = normalizeQuery(query);
  if (q.length < 2) return [];
  const terms = q.split(' ').filter(Boolean);
  const results: { item: SearchItem; score: number }[] = [];

  for (const item of items) {
    let score = 0;
    let ok = true;
    for (const term of terms) {
      const variants = ALIASES.get(term) ?? [term];
      if (!variants.some((v) => item.haystack.includes(v))) { ok = false; break; }
    }
    if (!ok) continue;
    const sku = item.sku.toLowerCase();
    if (sku === q) score += 1000;
    else if (sku.includes(q)) score += 200;
    const name = normalizeQuery(item.nombre);
    if (name.startsWith(terms[0])) score += 50;
    if (name.includes(q)) score += 25;
    results.push({ item, score });
  }

  results.sort((a, b) => b.score - a.score);
  const out = results.map((r) => r.item);
  return limit ? out.slice(0, limit) : out;
}
