// Productos que muestran los artículos del blog, calculados en el servidor.
// Antes cada componente cliente del blog importaba products.json completo y
// filtraba por nombres de categoría antiguos ("Drinkware", "Eco", "Accesorios"),
// que ya no existen, por lo que varios bloques quedaban vacíos.
import { products, isPlaceholderImage } from './catalog';

export interface BlogProduct {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  descripcion_corta: string;
  imagen_url: string;
}

/** Nombre usado en los componentes del blog -> categorías actuales equivalentes. */
const LEGACY_TO_SLUGS: Record<string, string[]> = {
  'Tecnología': ['tecnologia'],
  'Oficina': ['oficina'],
  'Hogar': ['hogar'],
  'Eco': ['ecologia', 'econature'],
  'Drinkware': ['tomatodos-y-botilitos-personalizados', 'mugs', 'termos-personalizados'],
  'Accesorios': ['llaveros', 'paraguas'],
  'Textil y Vestuario': ['confeccion', 'gorras'],
};

export type BlogProductSets = Record<string, BlogProduct[]>;

function pick(slugs: string[], limit: number): BlogProduct[] {
  const lists = slugs.map((s) => products.filter((p) => p.categoria_slug === s && !isPlaceholderImage(p)));
  const out: BlogProduct[] = [];
  // Intercala categorías para que un grupo mixto no muestre solo la primera.
  for (let i = 0; out.length < limit && lists.some((l) => i < l.length); i++) {
    for (const l of lists) {
      if (i < l.length && out.length < limit) {
        const p = l[i];
        out.push({ id: p.id, nombre: p.nombre, slug: p.slug, categoria: p.categoria, descripcion_corta: p.descripcion_corta, imagen_url: p.imagen_url });
      }
    }
  }
  return out;
}

// 4 por grupo: es el máximo que muestra cada bloque del blog (se serializa al cliente).
export function buildBlogProductSets(limit = 4): BlogProductSets {
  return Object.fromEntries(Object.entries(LEGACY_TO_SLUGS).map(([name, slugs]) => [name, pick(slugs, limit)]));
}
