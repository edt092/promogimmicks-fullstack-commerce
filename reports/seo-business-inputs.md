# Datos de negocio pendientes — PromoGimmicks

Fecha: 2026-10-10. Lista de hechos que el código **no puede inventar**. Cada punto indica qué está bloqueado mientras falte y dónde se usaría. El trabajo técnico independiente ya se implementó sin estos datos.

Estado: ☐ pendiente · ☑ recibido (marcar al completar).

## 1. Identidad y confianza (bloquea: schema Organization completo, /nosotros/, footer)

| ☐ | Dato | Uso | Situación actual |
|---|---|---|---|
| ☐ | Razón social y RUC (¿se publicará?) | `/nosotros/`, `Organization.legalName`/`taxID` | No publicado. `/nosotros/` describe solo lo verificable. |
| ☐ | Dirección completa (ciudad, provincia) **y** si se atiende al público o solo por áreas de servicio | Footer, `Organization.address`, decisión SAB vs. local | Footer muestra "Av. Las Palmas, 63, Ecuador" (incompleta). **No se modificó** sin confirmación ni se incluye en schema. |
| ☐ | Año de inicio de actividad | `/nosotros/`, `foundingDate` | No publicado. |
| ☐ | Perfiles oficiales verificados (Facebook, Instagram, LinkedIn, Google Business Profile) | `Organization.sameAs`, footer | El footer enlaza `facebook.com/promogimmickscl/`. El sufijo "cl" puede indicar Chile: **confirmar que el perfil es de esta empresa** antes de añadirlo a `sameAs`. No se eliminó. |
| ☐ | Logo oficial ≥112×112 px para schema | `Organization.logo` | Se usa `/icon.png`. |
| ☐ | Autoría real del blog (persona y credenciales) o confirmación de que firma la marca | `BlogPosting.author`, byline visible | Autor actual "PromoGimmicks" → se marca como Organization. |
| ☐ | Clientes, casos, testimonios y muestras propias **con consentimiento** | Ciudades, homepage, E-E-A-T | No hay; no se crearon. |

## 2. Condiciones comerciales (bloquea: ficha técnica, Offer, textos de categoría y ciudad)

| ☐ | Dato | Uso | Situación actual |
|---|---|---|---|
| ☐ | Cantidad mínima por modelo o por técnica | `cantidad_minima` en `products.json` → ficha "Ficha del modelo" | La ficha dice "Confirmamos … cantidad mínima … al cotizar". Se eliminaron "Mínimo 50 unidades" y "Mínimos de producción accesibles" (sin evidencia). |
| ☐ | Plazo de producción tras aprobar el arte (por técnica/modelo) | `plazo_produccion_dias` | Se eliminaron "entrega rápida", "inmediata", "tiempos de producción rápidos". |
| ☐ | Precios o tramos públicos ("desde $X por N u."), qué incluyen, IVA/envío, vigencia | `precio_desde_usd` + `precio_condiciones` + `verificado_en` → Offer en JSON-LD | **Sin Offer** en schema (antes: Offer sin `price`, inválido). El código ya genera Offer automáticamente si se registran precio y fecha de verificación. |
| ☐ | Stock / disponibilidad y fecha de verificación | `stock_verificado_en` | Se eliminó "Disponibilidad inmediata en stock" e `InStock` fijo. |
| ☐ | Materiales, medidas, capacidad, colores, técnicas compatibles y área de impresión por modelo (con fuente) | Campos opcionales de `ProductAttributes` (`lib/catalog.ts`) | Vacíos → la ficha muestra "se confirma al cotizar". Las afirmaciones por categoría (UV, antimicrobiano certificado, USB 8–64 GB, tallas S–XXL, packaging incluido, BPA…) se retiraron. |
| ☐ | Certificaciones reales (antimicrobianos, médicos, reflectivos) con documento | `certificaciones` | Retiradas las afirmaciones genéricas. |
| ☐ | Técnicas de personalización que realmente se ofrecen (serigrafía, tampografía, láser, sublimación, bordado, UV) | Hubs de técnica (Fase E2), fichas | No se crearon hubs: falta confirmación. |

## 3. Cobertura y origen

| ☐ | Dato | Uso | Situación actual |
|---|---|---|---|
| ☐ | ¿Se atiende Colombia? (sí/no/condiciones) | Copy, redirects `/productos-promocionales-colombia/*` | Asumido **Ecuador** (las páginas de Colombia se retiraron en 2026). Se quitaron 1.890 compromisos de venta/envío a Colombia del catálogo y Bogotá/Medellín/Cali de la plantilla de producto. Los redirects de ciudades colombianas apuntan al hub de Ecuador (antes Bogotá→Quito, Medellín→Guayaquil, no equivalentes). **Si Colombia no se atiende en absoluto → cambiar a 410** en `scripts/redirect_sources/manual_redirects.txt`. |
| ☐ | Condiciones de entrega por ciudad (costos, plazos, punto de despacho/retiro) | Páginas de ciudad | El FAQ dice que dependen de ubicación y pedido; la ficha dice "Entregas en Ecuador — según ciudad y pedido". |
| ☐ | Origen de la línea "Producción Nacional" | Categoría `produccion-nacional`, nombres "- Producción Nacional" | El proveedor principal (`catalogospromocionales.com`) parece colombiano; "Producción Nacional" podría significar **hecho en Colombia**. Se retiró "100% fabricado en Ecuador" y "fabricados localmente". Confirmar antes de afirmar origen. |
| ☐ | Productos temáticos de Colombia (Vuvuzela/Maracas/Paraguas/Bolígrafo Colombia): ¿se ofrecen en Ecuador? | Catálogo | Se conservaron (son productos), solo se cambió "Compra en Colombia" → Ecuador. Valorar retirarlos si no se venden. |
| ☐ | Oferta de "regalos con licor / vino para eventos" (71 + 20 + 13 impresiones) | Categoría bar-y-vino | El catálogo tiene accesorios y sets de vino; **no** se afirma venta de bebidas alcohólicas. |

## 4. Catálogo (calidad de datos)

| ☐ | Dato | Situación actual |
|---|---|---|
| ☐ | Nombre descriptivo para modelos con nombre solo comercial ("Clas", "Portos", "Trevon", "Benella", "Corpy", "Lipsy"…) | Se quitó el sufijo "OFERTA"; falta el tipo de producto. El nombre del proveedor queda en `nombre_proveedor`. |
| ☐ | Posibles duplicados de modelo entre proveedores: "Bolígrafo Metálico Skil" (PG-001941, firebase/SKIL) vs. "Bolígrafo Skil" (PG-000299, catálogo 8592); "Morral Backpack Padrax" (PG-001960) vs. `morral-backpack-padrax-oferta-10170` | **No se fusionaron**: imágenes y fuentes distintas. Confirmar si son el mismo modelo antes de canonicalizar/redirigir. |
| ☐ | Nombres iguales con SKU distinto: "Paraguas Brook Ergo 27" (9187/7512), "Mug Metálico Star 350ml" (8986/13197), "Bolígrafo Ventura Clean Set" (10840/PG-001998) | Títulos diferenciados con "(Ref. …)". Confirmar si son variantes reales. |
| ☐ | Imágenes reales para 11 productos con placeholder | No se aplicó `noindex` automático (regla del encargo); el schema omite `image` en esos casos. Lista en `reports/seo-baseline.md`. |
| ☐ | Fechas reales de alta/cambio por producto | Sin ellas el sitemap omite `lastmod` (antes: fecha fija inventada). El pipeline podría registrar `fecha_actualizacion`. |
| ☐ | Pipeline externo "chore(pipeline): +N productos" (productos con `ai_generated`) | Su origen no está en este repo: **aplicar las mismas reglas** (sin Colombia, sin mínimos/stock/plazos, título `{Nombre} Personalizado con Logo \| PromoGimmicks`) o volver a ejecutar `scripts/seo_catalog_cleanup.py` tras cada importación. |

## 5. Privacidad y formularios

| ☐ | Dato | Situación actual |
|---|---|---|
| ☐ | Política de privacidad revisada por el propietario/asesor legal | **No se publicó** texto legal. Borrador de inventario más abajo. |
| ☐ | Decisión sobre `components/ContactSection.tsx` (formulario → Formspree `mzznadzv`) | Componente existente **no usado** en ninguna ruta. `/contacto/` se publicó sin formulario (solo WhatsApp/teléfono/correo) hasta tener política. |
| ☐ | Analítica / medición de conversiones (proveedor, consentimiento) | La CSP de `public/_headers` bloquearía GTM/GA externos; no se instaló nada. |

### Inventario para la política de privacidad (borrador de datos, no texto legal)

- **Canales que reciben datos personales:** WhatsApp (`wa.me/593998594123`, mensajes prellenados con producto/SKU/categoría/ciudad), teléfono, correo `info@promogimmicks.com`.
- **Formularios:** `ContactSection` (Formspree) existe pero no está publicado.
- **Terceros que cargan en el navegador:** Netlify (hosting e imágenes), Google Fonts vía `next/font` (autohospedado en build), WhatsApp al hacer clic.
- **Cookies/analítica:** no se detectó analítica activa en el HTML exportado.
- **Pendiente:** responsable del tratamiento (razón social/RUC), finalidades, conservación, derechos (Ley Orgánica de Protección de Datos Personales de Ecuador), contacto para solicitudes.

## 6. Search Console (bloquea decisiones destructivas de indexación)

| ☐ | Export | Para qué |
|---|---|---|
| ☐ | Listas de URL por motivo (las 716 "Rastreada: actualmente sin indexar", 64 "Descubierta", 63 "404", 22 "robots", 1.970 "redirección", 92 "canónica alternativa") con fecha | Matriz URL/redirect con motivo actual. Hoy solo hay un export previo (`reports/gsc_audit_report.json`, rastreos hasta jul-2026, 452 DAS). |
| ☐ | Reexport "Páginas" del segmento Ecuador con filtros verificados | La tabla Ecuador suma solo 8 clics frente a 227 del total: no es utilizable para atribuir tráfico. |
| ☐ | Export consulta × página | Para confirmar el mapa `reports/seo-keyword-url-map.csv` (hoy asociaciones propuestas por reglas). |
| ☐ | URL Inspection de una muestra (canonical elegido por Google) tras publicar | Verificar consolidación en `www`. |
