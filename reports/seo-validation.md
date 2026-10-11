# Validación — comandos y resultados reales (2026-10-10)

Todo se ejecutó en local sobre el build final (`out/`). **Nada está publicado**: no se validó el comportamiento de Netlify (redirects 301/410 reales, Image CDN, headers).

## 1. Comandos

| Comando | Resultado |
|---|---|
| `npx tsc --noEmit -p .` | ✅ sin errores |
| `npx next lint` | ✅ 0 errores; 22 avisos `@next/next/no-img-element` (preexistentes, no bloqueantes) |
| `npx next build` (Next.js 14.2.35, static export) | ✅ exit 0; 2.128 páginas generadas (antes 2.086) |
| `python scripts/validate_build_output.py` | ✅ exit 0, **todas las validaciones críticas pasaron** (salida abajo) |
| `python scripts/seo_catalog_cleanup.py --dry-run` (tras aplicarlo) | ✅ 0 cambios pendientes (idempotente) |
| `python scripts/generate_redirects.py` | ✅ ~2.140 reglas; diff frente al anterior = solo host, Colombia, `/contacto`, `/nosotros`, paginación |
| `python scripts/build_redirect_matrix.py` | ✅ 2.140 reglas clasificadas |
| `python scripts/build_keyword_url_map.py <analisi_10-10-2026>` | ✅ 478 filas |
| Playwright 390 px / 1440 px + `prefers-reduced-motion` (servidor local sobre `out/`) | ✅ ver §4 |

## 2. Salida del validador (build final)

```
Sitemap: 2121 URLs.
OK: todas las URLs del sitemap tienen archivo HTML.
OK: canonical autorreferente único en todas las páginas del sitemap.
OK: ninguna URL del sitemap colisiona con un origen de _redirects.
OK: sin redirect loops.
OK: todos los redirects resuelven en un solo salto.
OK: ningún redirect (no-410) apunta a un target sin archivo generado.
OK: sin enlaces internos a hosts secundarios/slugs históricos/?categoria=.
OK: las 96 URLs "activas" de DAS son técnicamente correctas (archivo, no-noindex, en sitemap).
OK: los 2027 productos activos son alcanzables por enlaces HTML (profundidad máx. 2).
OK: 2121 rutas internas enlazadas, ninguna rota.
OK: 8488 enlaces de WhatsApp con número 593998594123, sin placeholders ni doble codificación.
OK: 6349 bloques JSON-LD parseables, sin Offer sin precio ni hosts secundarios.
OK: ninguna URL del sitemap tiene noindex.
OK: títulos y descripciones únicos en el sitemap.
OK: sin afirmaciones vetadas (Colombia, stock inmediato, mínimos, "oficial") en fichas.
Todas las validaciones críticas pasaron.
```

En la primera ejecución el validador detectó dos problemas que se corrigieron: 8 enlaces internos a categorías antiguas (hub Ecuador y blog) y 11 fichas con "fabricado en Ecuador". En total se neutralizaron ~95 afirmaciones de origen.

## 3. Antes / después (build local inicial vs. final)

First Load JS según `next build`:

| Ruta | Antes | Después |
|---|---:|---:|
| `/` | 515 KB | 170 KB |
| `/tienda/[slug]` | 500 KB | 153 KB |
| `/tienda/categoria/[slug]` | 492 KB | 147 KB |
| `/blog/[slug]` | 535 KB | 190 KB |
| `/productos-promocionales-ecuador/[ciudad]` | 494 KB | 147 KB |

HTML y JS inicial referenciado por página (bytes; gzip nivel 9 medido localmente):

| Página | HTML raw antes | HTML raw después | HTML gzip antes | HTML gzip después | JS inicial gzip antes | JS inicial gzip después |
|---|---:|---:|---:|---:|---:|---:|
| / | 453.433 | 413.802 | 42.346 | 41.476 | 555.024 | 209.050 |
| /tienda/ | 1.041.944 | 1.049.214 | 114.617 | 114.723 | 533.816 | 188.510 |
| /tienda/categoria/articulos-escritura/ | 946.436 | 156.202 | 53.143 | 17.621 | 531.121 | 185.531 |
| /tienda/categoria/mugs/ | 217.673 | 157.419 | 19.769 | 17.947 | 531.121 | 185.531 |
| /tienda/categoria/termos-personalizados/ | 68.783 | 67.936 | 10.571 | 11.001 | 531.121 | 185.531 |
| /tienda/boligrafo-alden-10441/ | 49.608 | 48.838 | 9.847 | 9.982 | 533.816 | 188.510 |
| /productos-promocionales-ecuador/quito/ | 100.341 | 92.232 | 13.401 | 12.879 | 531.121 | 185.531 |
| /blog/guia-donde-comprar-productos-promocionales-2025/ | 81.046 | 108.299 | 16.694 | 21.925 | 533.756 | 211.484 |
| /404.html | 30.408 | 31.540 | 5.950 | 6.280 | 531.322 | 209.050 |

- El chunk del catálogo (`45-*.js`, 2.084.093 B raw / 353.664 B gzip, cargado en todas las páginas) **desaparece**. `/search-index.json` (563.712 B raw / 128.284 B gzip) solo se descarga al buscar o al pedir más productos en `/tienda/`.
- Homepage: precargas de imagen de **19 a 1** (solo el logo del hero, candidato LCP), `fetchPriority="high"` de **40 a 2**, y bytes de `srcSet` de 113.213 a 80.716.
- El artículo del blog crece porque ahora renderiza productos reales; antes esos bloques salían vacíos por categorías inexistentes.
- `/tienda/` mantiene su directorio SSR completo (garantía de descubrimiento). Su reducción queda como P2.

**No es una medición de Core Web Vitals.** No hay datos de campo ni Lighthouse: son pesos comparables, raw con raw y gzip con gzip.

## 4. Inspección visual (Playwright)

| Comprobación | Resultado |
|---|---|
| Overflow horizontal (390 y 1440 px; home, producto, categoría p1/p2, Quito, contacto, tienda) | ✅ ninguno (scrollWidth = viewport) |
| Errores JS en consola | ✅ 0 |
| H1 homepage | "Artículos promocionales con tu logo, en Ecuador." |
| Botón flotante de WhatsApp tapando el CTA principal | ✅ no en ninguna página |
| Imagen principal de producto | ✅ cargada (antes: zona gris en blanco en móvil) |
| `prefers-reduced-motion: reduce` (home, producto) | ✅ render completo, sin errores |
| Búsqueda en `/tienda/` con "esfero" (sinónimo de bolígrafo, sin tilde) | ✅ 20 resultados (primer lote) |
| Búsqueda por SKU `PG-000001` | ✅ primer resultado "Balmax Stylus" (PG-000001) |
| Paginación de categoría | ✅ `/pagina/2/` con H1 "… Página 2", canonical propio |

Limitaciones de la prueba local:
- `/.netlify/images` no existe en local (404), por eso las imágenes servidas con `next/image` (logo, rejillas) no cargan en las capturas. Las fichas usan `<img>` directo y sí cargan. Hay que verificarlo en la vista previa de Netlify.
- En móvil, el CTA de la ficha queda bajo la imagen (H1 a ~682 px; CTA a ~908 px con viewport de 844). El botón flotante de WhatsApp sí está visible. Reordenar es una mejora P2 de diseño, no implementada.
- Hay elementos táctiles pequeños preexistentes (iconos del header, enlaces del breadcrumb): de 2 a 7 por debajo de 24 px en el primer viewport.

Capturas: `after_*.png` en el scratchpad de la sesión.

## 5. Pendiente de validar en hosting (no inferido del archivo)

- Respuestas reales 301/410 de `_redirects` en Netlify, incluida la regla de host `https://promogimmicks.com/* → www`.
- 404 real para categorías inexistentes (no se generan; Netlify sirve `404.html`).
- Image CDN con los nuevos `deviceSizes`/`imageSizes`.
- Rich Results Test, URL Inspection y canonical elegido por Google.
- CWV reales (PageSpeed con API key / CrUX).

## 6. Incidente tras la publicación (2026-10-10) y corrección

- **Síntoma (smoke test en producción):** URLs inexistentes bajo `/tienda/`, `/tienda/categoria/`, `/blog/` y `/productos-promocionales-ecuador/` entraban en un bucle de 301 hacia sí mismas en lugar de responder 404.
- **Causa:** reglas genéricas con comodín de `public/_redirects` (`/tienda/:slug → /tienda/:slug/`, etc.), generadas por `scripts/generate_redirects.py`. Netlify compara reglas ignorando la barra final; con un archivo inexistente, la regla se aplica sobre sí misma. Las páginas existentes no se veían afectadas: Netlify sirve el archivo antes de aplicar la regla y añade la barra final por sí mismo.
- **Por qué no lo detectó el validador:** resolvía las cadenas por coincidencia exacta de ruta.
- **Corrección:** se eliminan las reglas con comodín del generador, se regenera `_redirects` y el validador marca como bucle crítico cualquier regla con comodín cuyo destino sea el mismo patrón con barra final.
- **Verificación pendiente tras publicar:** `/tienda/categoria/no-existe/`, `/tienda/producto-que-no-existe/` y `/blog/no-existe/` → 404; `/tienda/boligrafo-alden-10441` (sin barra) → 301 a la versión con barra.
