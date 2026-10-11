import { products } from '@/lib/catalog';

// Índice estático mínimo de búsqueda (se genera en el build; output: 'export').
// Columnas: [nombre, slug, sku, categoria, categoria_slug, imagen_url, descripcion recortada a 110 caracteres].
// Se carga bajo demanda desde el cliente: ningún componente cliente importa products.json.
export const dynamic = 'force-static';

export function GET() {
  const rows = products.map((p) => [
    p.nombre, p.slug, p.sku, p.categoria, p.categoria_slug, p.imagen_url,
    p.descripcion_corta.length > 110 ? `${p.descripcion_corta.slice(0, 107).trimEnd()}…` : p.descripcion_corta,
  ]);
  return new Response(JSON.stringify(rows), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
