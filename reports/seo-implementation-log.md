# Registro de implementación SEO — 2026-10-10

Ejecución de `PROMPT-MAESTRO-CLAUDE-CODE.md` sobre el repositorio. **Nada se ha publicado**: no hubo deploy, ni cambios en Netlify/DNS, ni acciones en cuentas externas. El trabajo previo sin commit (blog, layout, ciudades, sitemap, categorías, redirects, generador) se preservó y se integró.

Estados: ✅ implementada y validada en build local · 🟡 implementada, falta validación en hosting · ⏳ pendiente de dato de negocio · 🚀 pendiente de publicación · ❌ hipótesis descartada.

## Decisiones reproducibles

| # | Decisión | Evidencia | Dónde |
|---|---|---|---|
| D1 | **Host canónico = `https://www.promogimmicks.com`** | `curl`: raíz → 301 → www; www → 200 directo (ver `seo-baseline.md` §1). Default del encargo: conservar www si es el primario. | `site.config.json` (fuente única para Next.js y Python) |
| D2 | Sin canonical/hreflang globales; cada ruta indexable declara su canonical | El canonical raíz del layout se heredaba (incl. 404); hreflang mezclaba homepage y hub | `app/layout.tsx` |
| D3 | Product sin Offer mientras no haya precio público verificado; sin `brand` PromoGimmicks | Offer sin `price` es inválido; los modelos son de proveedores | `app/tienda/[slug]/page.tsx` (Offer automático solo con `precio_desde_usd` + `verificado_en`) |
| D4 | `lastmod` solo con fecha real (blog); omitido en catálogo | No existen fechas por producto | `app/sitemap.ts` |
| D5 | Paginación estática de categorías: **36 productos/página**, `/tienda/categoria/{slug}/pagina/{n}/` | Escritura: 946 KB HTML en una página. Static export → rutas generadas | `lib/catalog.ts`, `components/CategoryPageView.tsx` |
| D6 | Catálogo fuera del JS cliente: modelos mínimos por props + índice `/search-index.json` bajo demanda | Chunk de 2,08 MB en todas las rutas | `lib/catalog.ts`, `lib/search.ts`, `app/search-index.json/route.ts` |
| D7 | Cobertura comercial = Ecuador | Páginas Colombia retiradas en 2026; redirects a Ecuador | Datos + plantillas (confirmación pendiente ⏳) |
| D8 | No afirmar origen "hecho en Ecuador" | Proveedor principal probablemente colombiano | Datos + textos de categoría |
| D9 | No noindex masivo; no fusionar duplicados por nombre | Regla del encargo; fuentes/imágenes distintas | — |
| D10 | Directorio SSR de `/tienda/` se conserva | Garantiza descubrimiento; la paginación añade otra vía | `app/tienda/page.tsx` |

## Fase A — Inventario ✅

- `reports/seo-baseline.md` (live vs. código vs. build inicial; métricas medidas; contradicciones resueltas).
- Build inicial guardado como referencia (scratchpad `out-baseline/`).

## Fase B — P0

| Cambio | Archivos | Estado |
|---|---|---|
| Config compartida (host, nombre, WhatsApp, teléfono, correo) + helpers `absoluteUrl`, `whatsappUrl`, `jsonLd` (serialización segura) | `site.config.json`, `lib/site.ts` | ✅ |
| Todas las rutas usan `SITE_URL`/`absoluteUrl` (canonical, OG, JSON-LD, breadcrumbs con barra final) | `app/**/page.tsx`, `app/robots.ts`, `app/sitemap.ts` | ✅ |
| Layout sin canonical/hreflang heredados; `metadataBase` www; título/descripción homepage sin "virales/importación" | `app/layout.tsx`, `app/page.tsx`, `app/not-found.tsx` | ✅ |
| Generador de redirects lee el host de `site.config.json`; reglas de host secundario → www (sin regla inversa); `manual_redirects.txt` usa `{SITE_URL}` | `scripts/generate_redirects.py`, `scripts/redirect_sources/manual_redirects.txt`, `public/_redirects` (regenerado) | ✅ archivo · 🟡 comportamiento en Netlify |
| Validador post-build y auditoría GSC leen el host compartido | `scripts/validate_build_output.py`, `scripts/audit_gsc_indexing.py` | ✅ |
| **WhatsApp**: categoría (número falso + `{categoryName}` literal) y hero de ciudad (`{ciudad.nombre}` literal) corregidos; **todos** los enlaces (24 puntos) centralizados en `whatsappUrl()` | `components/CategoryPageView.tsx`, ciudad, hub, 12 componentes | ✅ (8.488 enlaces validados) |
| CTA de producto como `<a href>` real (antes `window.open` en botón) | `components/ProductDetailView.tsx` | ✅ |
| Categorías: solo slugs con productos (`dynamicParams=false`, sin dependencia de `categoryDescriptions`); textos útiles para termos, tomatodos y vasos | `app/tienda/categoria/[slug]/page.tsx`, `data/category-content.ts` | ✅ |
| Canonical de `/blog/` (corrección previa) preservado | `app/blog/page.tsx` | ✅ |

## Fase C — P1

| Cambio | Archivos | Estado |
|---|---|---|
| robots: se elimina `Disallow: /_next/` y `/tienda/?`; Sitemap en www | `app/robots.ts` | ✅ |
| Sitemap: www, sin fechas inventadas, sin changefreq/priority; añade `/nosotros/`, `/contacto/` y páginas 2+ de categorías | `app/sitemap.ts` | ✅ |
| Matriz URL/redirect por regla (procedencia, motivo GSC del export previo, sitemap, enlaces entrantes, sucesor, decisión) + cohortes DAS | `scripts/build_redirect_matrix.py` → `reports/seo-redirect-matrix.csv`, `reports/seo-das-cohorts.md` | ✅ |
| Colombia: Bogotá→Quito y Medellín→Guayaquil pasan a hub Ecuador (no equivalentes) | `manual_redirects.txt` | ✅ · ⏳ (410 si no se atiende Colombia) |
| Producto→categoría/tienda (reglas manuales): documentados como "revisar: candidato 410"; **no se cambiaron** sin export GSC/backlinks | matriz | ⏳ |
| `/contacto` (antes 410) y `/nosotros` → 301 a las nuevas páginas | `manual_redirects.txt` | ✅ |
| Limpieza del catálogo (determinista, idempotente, con registro): categoría legible (89), nombres sin "OFERTA"/mayúsculas y con tildes (298, original en `nombre_proveedor`), 0 compromisos con Colombia, sin "Mínimo N unidades"/"oficial"/"rápido"/"inmediato", sin origen "hecho en Ecuador", 0 títulos duplicados | `scripts/seo_catalog_cleanup.py`, `data/products.json`, `reports/seo-catalog-cleanup-changes.json` | ✅ |
| Plantilla de producto sin "Características destacadas" por categoría (UV, certificaciones, USB, tallas, packaging, stock) ni ciudades de Colombia; nueva "Ficha del modelo" que muestra solo atributos confirmados | `components/ProductDetailView.tsx` | ✅ |
| Modelo de atributos nullable (material, medidas, capacidad, colores, técnicas, área, MOQ, plazo, stock/fecha, packaging, precio/condiciones, certificaciones, fuente/fecha) | `lib/catalog.ts` (`ProductAttributes`) | ✅ código · ⏳ datos |
| Título de producto sin `\| Ecuador` añadido; descripción sin frase de envío añadida; OG sin 800×800 falso | `app/tienda/[slug]/page.tsx` | ✅ |
| Scraper diario: plantillas sin Colombia, sin mínimos, título sin doble marca, atributos neutrales | `scripts/daily-scraper.py` | ✅ |
| Encoding: verificado desde bytes (UTF-8 válido); los caracteres dañados vistos en consola eran de la consola | — | ❌ (no había mojibake) |
| Schema: Organization+WebSite (@id estable, solo datos publicados); Product (sku, @id, url, categoría legible, imagen real); BlogPosting (autor visible, fechas reales); ciudades y hub como `Service` con `provider` = Organization (sin LocalBusiness ficticio); CollectionPage/ItemList = productos de esa página (ListItem url/nombre); AboutPage/ContactPage | layout, producto, blog, ciudad, hub, categoría, nosotros, contacto | ✅ |

## Fase D — Rendimiento

| Cambio | Estado |
|---|---|
| `Navbar`: búsqueda con índice bajo demanda (normalización NFD, sinónimos esfero↔bolígrafo, taza↔mug↔jarro, tomatodo↔botilito, SKU exacto primero, estados de carga/error accesibles) | ✅ |
| `TiendaGrid`: primer lote SSR por props; resto y búsqueda con el índice | ✅ |
| Homepage, promociones, novedades, ficha, blog: datos por props/contexto desde el servidor | ✅ |
| `priority` solo en la imagen LCP del hero; logo sin precarga duplicada; sin priority en rejillas/sliders bajo el pliegue; `TiendaGrid` 10→2 | ✅ |
| Imagen principal de producto `eager` + `fetchPriority="high"` | ✅ |
| Paginación estática de categorías con enlaces `<a>` reales, canonical propio, sin duplicar página 1 | ✅ |
| Ciudades: selección curada SSR (12 productos + categorías) en lugar de la rejilla de 2.027 | ✅ |
| Three.js/GSAP | Sin cambios: ya se importan dinámicamente; no se midió CWV real (ver validación) |

## Fase E — Intención y contenido

| Cambio | Estado |
|---|---|
| H1 homepage "Artículos promocionales con tu logo, en Ecuador." (mismo diseño/animación) | ✅ |
| `/nosotros/` y `/contacto/` con hechos verificables (sin formulario, sin dirección/RUC no confirmados); enlazadas desde el footer | ✅ |
| `reports/seo-keyword-url-map.csv` (478 filas; asociaciones por reglas, marcadas como propuesta) | ✅ |
| Contador de categorías de la homepage = categorías activas por slug (37) | ✅ |
| Enlaces internos a categorías antiguas (hub Ecuador, blog) → categorías actuales | ✅ |
| Enlaces internos sin barra final (blog, navbar, cobertura, ciudad) corregidos | ✅ |
| Blog: productos mostrados ahora existen (mapeo de categorías antiguas) | ✅ |
| Categorías hijas piloto, hubs comerciales, técnicas, refresco del blog, contenido local de ciudades | ⏳ requieren atributos/condiciones verificados (`seo-business-inputs.md`) |
| `llms.txt` | No creado (prioridad baja; requiere hechos de entidad confirmados) |
| Política de privacidad | ⏳ inventario en `seo-business-inputs.md` §5; no se publica texto legal |

## Hipótesis descartadas / correcciones a informes previos

- ❌ "El sitemap no tiene lastmod" — tenía 2.080 fijos.
- ❌ "Productos tras los primeros 20 huérfanos" — el directorio SSR de `/tienda/` los enlazaba todos (ahora también la paginación).
- ❌ "Sufijo `-personalizado-logo-ecuador` uniforme" — solo 5 productos.
- ❌ "Mojibake en products.json" — UTF-8 válido.
