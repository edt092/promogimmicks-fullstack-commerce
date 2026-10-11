# Línea base SEO — antes de la implementación (2026-10-10)

Tres estados distintos (no se mezclan):

| Estado | Fuente | Fecha |
|---|---|---|
| **Producción (live)** | `curl` a promogimmicks.com / www | 2026-10-10 |
| **Código local inicial** | Árbol de trabajo con cambios previos sin commit (blog, layout, ciudades, sitemap, categorías, redirects) | 2026-10-10, antes de esta implementación |
| **Build local inicial** | `next build` del código local inicial, copia en scratchpad `out-baseline/` | 2026-10-10 |

Fuentes de análisis leídas completas: 18 CSV + 2 informes de `analisi_10-10-2026` (cifras reconciliadas, ver abajo), `seo-plan-claude-2026-10-10/ANALISIS-Y-PLAN-SEO.md` y `PROMPT-MAESTRO-CLAUDE-CODE.md`.

## 1. Host (B1) — comprobado en vivo

| Petición | Respuesta |
|---|---|
| `https://promogimmicks.com/` | 301 → `https://www.promogimmicks.com/` (1 salto) |
| `https://www.promogimmicks.com/` | 200 directo |
| `http://promogimmicks.com/` | 301 → `https://promogimmicks.com/` → 301 → www (2 saltos, comportamiento de Netlify) |
| `http://www.promogimmicks.com/` | 301 → www https |
| `/tienda/`, categoría, producto en raíz | 301 → misma ruta en www |

**Conclusión:** el dominio primario servido es **www**. El código (canonical, sitemap, robots, JSON-LD, destinos de `_redirects`) usaba la raíz. El `_redirects` local sin publicar añadía `https://www.promogimmicks.com/* → raíz 301!` → riesgo de bucle con el dominio primario de Netlify. Sin acceso de lectura a la configuración de Netlify; la decisión se basa en el comportamiento HTTP observado.

## 2. Build local inicial (medido)

| Métrica | Valor |
|---|---|
| First Load JS por ruta | **492–535 KB** (homepage 515 KB, producto 500 KB, categoría 492 KB, blog 535 KB) |
| Causa | `Navbar` (en todas las páginas) y 8 componentes cliente importaban `data/products.json` completo → chunk `45-*.js` de **2.084.093 B raw / 353.664 B gzip** |
| HTML homepage | 453.433 B raw / 42.346 B gzip; **0 JSON-LD** |
| HTML `/tienda/` | 1.041.944 B raw / 114.617 B gzip |
| HTML categoría escritura (303 productos, una sola página) | 946.436 B raw / 53.143 B gzip |
| HTML categoría mugs | 217.673 B raw |
| HTML producto (Alden) | 49.608 B raw |
| HTML ciudad Quito | 100.341 B raw (rejilla interactiva del catálogo completo) |
| Sitemap | 2.080 URLs, **2.080 `lastmod` fijos** (fechas codificadas, no reales), host raíz |
| robots.txt | `Disallow: /_next/` y `/tienda/?`; Sitemap en host raíz |
| Canonical 404 | `https://promogimmicks.com/` (heredado del layout) |
| hreflang | x-default/es → homepage y es-EC → hub Ecuador (no equivalentes) |
| WhatsApp | **37 páginas** con número falso `593987654321`; **41 páginas** con placeholder literal (`{categoryName}`, `{ciudad.nombre}`) |
| Fichas de producto | **2.027/2.027** con Offer sin `price` e `InStock` fijo; **2.027/2.027** mencionan Bogotá/Medellín/Cali; títulos con sufijo duplicado (`… \| PromoGimmicks Ecuador \| Ecuador`) |
| Contador homepage | "49 categorías" (contaba nombres; 89 productos tenían el slug crudo como nombre) — activas: 37 |
| Blog | 0 JSON-LD; bloques de productos vacíos (categorías "Drinkware", "Eco", "Accesorios" inexistentes) |
| Enlaces internos a categorías antiguas | 8 slugs (`drinkware`, `eco`, `accesorios`…) desde hub Ecuador y blog → 301 |

## 3. Catálogo (`data/products.json`)

| Métrica | Valor |
|---|---|
| Productos / categorías activas | 2.027 / 37 |
| Slug, SKU, descripción corta, SEO description duplicados | 0 |
| `seo_title` duplicados | 7 grupos / 27 productos |
| `nombre` duplicados | 3 grupos / 6 productos (fuentes e imágenes distintas) |
| `categoria` = slug crudo | 89 |
| Nombres con "OFERTA" / en MAYÚSCULAS | 140 / 85 |
| Mencionan Colombia/Bogotá/Medellín/Cali | seo_description 1.887 · descripcion_corta 41 · keywords 256 · title 6 |
| Afirman fabricación en Ecuador sin evidencia | ~90 descripciones (línea "Producción Nacional" del proveedor) |
| Imágenes placeholder | 11: `boligrafo-antiestres-personalizado`, `pelota-antiestres-personalizada-logo`, `pelota-antiestres-personalizada-soporte-celular`, `set-ml-383-ii-articulos-promocionales-personalizados`, `boligrafo-big-bang-promocional-personalizado`, `boligrafo-scroll-personalizado`, `boligrafo-ventura-clean-set-personalizado`, `focus-ii-resaltador-cera-personalizado-logo`, `boligrafo-dormin-bamboo-personalizado`, `advant-2-1-resaltador-tinta-personalizado`, `lapiz-infinito-gemini-personalizado-logo` |
| Campos de atributos (material, MOQ, precio, plazo…) | No existen |
| Pipeline | `scripts/daily-scraper.py` (GitHub Action diaria) **solo añade** productos (no reescribe existentes); sus plantillas generaban "Ecuador y Colombia", "Mínimo de unidades accesible" y atributos por categoría. Existe otro pipeline externo (`chore(pipeline)`, productos `ai_generated`). |

## 4. Search Console (CSV originales, 2026-07-07 → 2026-10-06)

| Segmento | Clics | Impresiones | CTR | Pos. aprox. |
|---|---:|---:|---:|---:|
| General (gráfico/países/dispositivos) | 248 | 4.192 | 5,92 % | 18,21 |
| Ecuador | 227 | 3.095 | 7,33 % | 20,39 |

Recalculado en esta sesión: coincide. Tablas no intercambiables: Páginas general 853 filas/253 clics/4.799 impr.; Páginas Ecuador 122/8/1.413; Consultas general 259/9/1.523; Consultas Ecuador 219/8/1.202. Aparición en búsquedas: vacías.

Indexación (última fila 2026-10-03): 1.978 indexadas / 2.928 sin indexar (4.906 conocidas). Motivos: redirección 1.970 · canónica alternativa 92 · rastreada sin indexar 716 · 404 63 · robots 22 · noindex 1 · descubierta 64 · otra canónica 0.

Export previo por URL disponible en el repo: `reports/gsc_audit_report.json` (1.367 URLs, rastreos hasta jul-2026; 452 DAS, 790 FERA…). Se usa como evidencia histórica, no como estado de octubre.

## 5. Contradicciones entre informes resueltas

| Tema | Codex | Claude (auditoría) | Decisión |
|---|---|---|---|
| Host | Mantener www (servido) | Cambiar Netlify a raíz | **www** (comprobado como primario; default del encargo). Código alineado. |
| Offer | Quitar si no hay precio | Quitar → "elegible para snippets" | Quitar; **sin** prometer elegibilidad de rich results. |
| Noindex de fichas débiles/placeholder | No | Sí (top 100–200) | **No** noindex masivo. |
| lastmod | — | Derivar de hash | **Omitir** sin fecha real. |
| "Sin lastmod en sitemap" (agente técnico) | — | Afirmado | **Falso**: había 2.080 lastmod fijos. |
| Productos tras los primeros 20 huérfanos | No (directorio SSR) | Posible | **No huérfanos**: `/tienda/` enlaza los 2.027 en HTML. |
| 400–500 palabras / bloques de 134–167 palabras | — | Recomendado | Guía opcional, no requisito. |
