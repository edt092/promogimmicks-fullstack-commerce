// Acceso al catálogo SOLO desde componentes de servidor / rutas.
// Los componentes cliente reciben modelos mínimos por props o cargan
// /search-index.json bajo demanda (ver app/search-index.json/route.ts).
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';

/**
 * Atributos comerciales verificables por modelo. Todos opcionales: un valor
 * desconocido se deja vacío y se presenta como "se confirma al cotizar".
 * Nunca se rellenan con valores por defecto de la categoría.
 */
export interface ProductAttributes {
  tipo_funcional?: string | null;
  colecciones?: string[] | null;
  material?: string | null;
  dimensiones?: string | null;
  capacidad?: string | null;
  colores?: string[] | null;
  tecnicas_marcaje?: string[] | null;
  area_impresion?: string | null;
  cantidad_minima?: number | null;
  plazo_produccion_dias?: string | null;
  stock_verificado_en?: string | null;
  packaging?: string | null;
  precio_desde_usd?: number | null;
  precio_condiciones?: string | null;
  certificaciones?: string[] | null;
  fuente_atributos?: string | null;
  verificado_en?: string | null;
}

export interface Product extends ProductAttributes {
  id: string;
  nombre: string;
  nombre_proveedor?: string;
  slug: string;
  categoria: string;
  categoria_slug: string;
  descripcion_corta: string;
  imagen_url: string;
  imagen_original_url: string;
  codigo: string | null;
  sku: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  referencia_proveedor?: string;
}

/** Modelo mínimo para tarjetas y búsqueda (lo que se serializa al cliente). */
export interface ProductCardData {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  categoria_slug: string;
  imagen_url: string;
  sku: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export const products = productsData as Product[];
export const categories = categoriesData as Category[];

const categoryNames: Record<string, string> = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

export function categoryName(slug: string): string {
  return categoryNames[slug] ?? products.find((p) => p.categoria_slug === slug)?.categoria ?? slug;
}

/** Categorías con al menos un producto (las únicas que se generan e indexan). */
export function activeCategorySlugs(): string[] {
  return Array.from(new Set(products.map((p) => p.categoria_slug)));
}

export function toCardData(p: Product): ProductCardData {
  return {
    id: p.id,
    nombre: p.nombre,
    slug: p.slug,
    categoria: p.categoria,
    categoria_slug: p.categoria_slug,
    imagen_url: p.imagen_url,
    sku: p.sku,
  };
}

/** Minúsculas sin tildes ni signos (búsqueda y comparación). */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOPWORDS = new Set(['de', 'del', 'la', 'el', 'en', 'con', 'y', 'para', 'por', 'los', 'las', 'set', 'personalizado', 'personalizada']);

function tokens(name: string): Set<string> {
  return new Set(normalizeText(name).split(' ').filter((t) => t.length > 2 && !STOPWORDS.has(t) && !/^\d/.test(t)));
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Relacionados deterministas: misma categoría, priorizando nombres que comparten
 * tipo/material (tokens) y desempatando por hash del par de slugs, de modo que
 * cada ficha enlaza a un subconjunto distinto en lugar de siempre los 4 primeros.
 */
export function relatedProducts(product: Product, limit = 4): ProductCardData[] {
  const base = tokens(product.nombre);
  return products
    .filter((p) => p.categoria_slug === product.categoria_slug && p.id !== product.id)
    .map((p) => {
      let shared = 0;
      tokens(p.nombre).forEach((t) => { if (base.has(t)) shared++; });
      return { p, shared, tie: hash(`${product.slug}|${p.slug}`) };
    })
    .sort((a, b) => b.shared - a.shared || a.tie - b.tie)
    .slice(0, limit)
    .map(({ p }) => toCardData(p));
}

export function isPlaceholderImage(p: { imagen_url: string }): boolean {
  return p.imagen_url.includes('_placeholder');
}

/** Productos por página de listado (documentado en reports/seo-implementation-log.md). */
export const CATEGORY_PAGE_SIZE = 36;

export function categoryProducts(slug: string): Product[] {
  // Orden estable: el del archivo de datos.
  return products.filter((p) => p.categoria_slug === slug);
}

export function categoryPageCount(slug: string): number {
  return Math.max(1, Math.ceil(categoryProducts(slug).length / CATEGORY_PAGE_SIZE));
}

export function categoryPagePath(slug: string, page: number): string {
  return page <= 1 ? `/tienda/categoria/${slug}/` : `/tienda/categoria/${slug}/pagina/${page}/`;
}


/** Primer producto (con imagen real) de cada categoría indicada, en ese orden. */
export function firstProductPerCategory(slugs: string[]): ProductCardData[] {
  return slugs
    .map((slug) => products.find((p) => p.categoria_slug === slug && !isPlaceholderImage(p)))
    .filter((p): p is Product => Boolean(p))
    .map(toCardData);
}

export const OFFERS_CATEGORY_SLUG = 'precio-bomba';

export function offerProducts(limit?: number): ProductCardData[] {
  const list = products.filter((p) => p.categoria_slug === OFFERS_CATEGORY_SLUG).map(toCardData);
  return limit ? list.slice(0, limit) : list;
}

/** Los últimos productos añadidos por el pipeline (orden del archivo), más recientes primero. */
export function newestProducts(count = 300): ProductCardData[] {
  return products.slice(-count).reverse().map(toCardData);
}

// Homepage: una categoría representativa por tarjeta, para mostrar la variedad real del catálogo.
export const FEATURED_CATEGORY_SLUGS = [
  'tecnologia',
  'mugs',
  'articulos-escritura',
  'gorras',
  'llaveros',
  'deportes',
  'oficina',
  'paraguas',
  'maletines',
  'vasos-personalizados',
  'termos-personalizados',
  'bar-y-vino',
];
