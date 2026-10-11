# Implementación de la auditoría UX/UI — 2026-10-10

Fuente: `UX-UI-ANALISI-10-10-2026/auditoria_uxui_promogimmicks` (madurez estimada 46/100, hallazgos F01–F10, tareas T01–T12).
Rama: `uxui/auditoria-2026-10`, creada **sobre** `seo/implementacion-prompt-maestro-2026-10` (PR #1), que ya resolvía parte de los hallazgos.
**Nada publicado.** Sin backend nuevo, sin envío de mensajes ni formularios reales durante las pruebas.

Estados: ✅ implementado y verificado en build local · 🟡 parcial · ⏳ requiere dato de negocio, backend o investigación · ↪ resuelto en PR #1.

## 1. Trazabilidad hallazgo → tarea → estado

| ID | Hallazgo | Tarea | Estado | Qué se hizo / evidencia |
|---|---|---|---|---|
| F01 | CTA de categoría con otro número y `{categoryName}` literal | T01 | ↪✅ | `whatsappUrl()` único (`lib/site.ts`, número en `site.config.json`); `<a>` real. Validador: 8.488 enlaces correctos. |
| F02 | Operación territorial ambigua (EC vs. ciudades CO) | T02 | 🟡 ⏳ | Retiradas las promesas de Bogotá/Medellín/Cali y las 1.887 menciones de Colombia (PR #1). **Conflicto de alcance:** esta auditoría plantea preparación B2C para Colombia, mientras el plan SEO asumió Ecuador. La decisión de mercado es del negocio (`reports/seo-business-inputs.md` §3); no se creó selector CO/EC ni COP. |
| F03 | Datos comerciales ausentes por producto | T06 | 🟡 ⏳ | Modelo de atributos opcional (`lib/catalog.ts`); la ficha muestra solo lo confirmado y "Pedido mínimo por confirmar". Faltan los datos verificados (piloto de 20 SKU). |
| F04 | Promesas genéricas presentadas como atributos del SKU | T02/T06 | ↪✅ | Eliminadas las "Características destacadas" por categoría (rango 300–500 ml, certificaciones, UV, USB, tallas); "Satisfacción total" y "Calidad premium" retiradas. |
| F05 | Cotización externa sin captura estructurada | T07 | 🟡 | **Lista multiproducto** (`/cotizacion/`): cantidades, ciudad, fecha ("aún no definida"), empresa, notas y asesoría → un único mensaje revisable por WhatsApp o correo. Sin "solicitud recibida" falsa. ⏳ Persistencia en servidor, referencia y CRM requieren backend (el sitio es export estático). |
| F06 | Búsqueda fragmentada y sensible a tildes | T03 | ✅ | Un solo servicio (`lib/search.ts`) para header y tienda: NFD, sinónimos, SKU exacto primero. Añadido "Ver todos los resultados" y la búsqueda en URL (`/tienda/?q=`), restaurable con Atrás. |
| F07 | Jerarquía móvil posterga información de decisión | T10 | ✅ | Ficha móvil: breadcrumb → categoría → nombre → SKU → descripción → cantidad → CTA → agregar → ficha del modelo → imagen compacta. Escritorio sin cambios (2 columnas). |
| F08 | Accesibilidad semántica incompleta | T04 | ✅ | Tarjeta como `<article>` con enlace y botón hermanos (0 controles anidados). Menú móvil: `aria-expanded`/`aria-controls`, "Abrir/Cerrar menú", foco al abrir, Escape con retorno del foco, scroll bloqueado y `role="dialog"`. Etiquetas en todos los buscadores y en el newsletter. Errores con `aria-describedby` y resumen enfocado. |
| F09 | Recuperación asíncrona incompleta | T05 | ✅ | Ficha: `onError` con respaldo "Imagen no disponible". Compartir: cancelar no copia; copia confirmada solo tras `await` y, si falla, campo con la URL. Newsletter: formulario capturado antes de `await`, sin falso error, correo conservado si falla y estado anunciado. Tarjeta: alt descriptivo cuando falla la imagen. |
| F10 | Conteo de categorías inconsistente (49 vs. 37) | T11 | ↪✅ | Contador derivado de las categorías activas por slug. |

## 2. Microcopy aplicado (§2.5)

| Contexto | Antes | Ahora |
|---|---|---|
| Hero | "Explorar la colección" (con `aria-label` distinto al texto) | "Ver catálogo" (nombre accesible igual al visible) |
| CTA de ficha | "Solicitar Cotización por WhatsApp" | "Cotizar este producto por WhatsApp" + ayuda: "Se abrirá WhatsApp con tu consulta. Revisa el mensaje y envíalo…" |
| Mínimo | Ausente en la ficha | "Pedido mínimo por confirmar según modelo y técnica." |
| Personalización | "Incluye personalización profesional" | Ficha del modelo: "Confirmamos … al cotizar" (PR #1) |
| Garantía | "Satisfacción total" | Retirada (PR #1) |
| Buscador | "Buscar productos, categorías..." / "Buscar por nombre o SKU..." | Etiqueta "Buscar en el catálogo"; ejemplo "Mug, bolígrafo o código…" |
| Vacío | "No hay resultados para…" | "No encontramos coincidencias para «…». Prueba con el tipo de producto o su código." + Limpiar búsqueda / Pedir asesoría |
| Menú móvil | "Toggle menu" | "Abrir menú" / "Cerrar menú" |
| Newsletter (error) | "No pudimos enviarlo, intenta de nuevo." | "No pudimos registrar tu correo. Intenta otra vez; el dato sigue en el campo." |
| Lista vacía | — | "Tu lista está vacía. Agrega productos del catálogo para pedir una cotización…" |
| Envío | — | "Se abrirá WhatsApp (o tu correo) con tu solicitud. Revisa el mensaje y envíalo…" |
| Logo | — | "Puedes enviar tu logo después, por WhatsApp o correo." |

No se publicó ningún plazo de respuesta, MOQ, precio ni cobertura sin datos aprobados.

## 3. Diseño de la lista de cotización (T07 sin backend)

- **Almacenamiento:** `localStorage` versionado (`pg-quote-v1`) que guarda **solo slug, SKU y cantidad**. Nunca guarda nombre, ciudad, empresa ni logo; los campos del requerimiento viven en memoria.
- **Productos retirados:** al mostrar la lista, cada producto se resuelve contra `/search-index.json`. Los que ya no están se marcan ("Este producto ya no está en el catálogo") y hay que quitarlos antes de revisar.
- **Validación:** ciudad obligatoria; fecha obligatoria salvo "Aún no definida"; cantidad entera positiva u opcional. El resumen de errores recibe el foco.
- **Revisión:** "Revisar solicitud" muestra el mensaje exacto. Cualquier edición invalida la revisión, así que lo enviado es siempre lo revisado.
- **Envío:** WhatsApp, correo (`mailto`) o copiar. Abrir el canal **no** se presenta como recepción.
- **Accesos:** icono "Tu cotización" con contador en el header (escritorio y móvil); botón "Agregar a cotización" en tarjetas y fichas, con "Deshacer" y "Ver cotización" anunciados por `role="status"`.
- `/cotizacion/` es `noindex` y no está en el sitemap.

## 4. Movimiento reducido

- `MotionConfig reducedMotion="user"` global para Framer Motion (`components/MotionProvider.tsx`).
- GSAP y Three.js ya comprobaban `prefers-reduced-motion` (Three.js solo carga con puntero fino y sin esa preferencia).

## 5. Pendiente (no implementable sin decisiones, datos o backend)

| Tarea | Por qué queda pendiente | Responsable |
|---|---|---|
| T02 Mercado CO/EC, entidad que factura, moneda | Decisión de negocio; contradice el supuesto Ecuador del plan SEO | Negocio |
| T06 Datos verificados (piloto de 20 SKU) | Requiere datos de proveedor/comercial | Catálogo + comercial |
| T07 Recepción persistida, referencia, idempotencia, CRM, subida de logos | Export estático: requiere servicio serverless/backend y política de privacidad | Fullstack + operaciones |
| T08 Analítica del embudo (`quote_item_added`, `whatsapp_open`, `quote_request_created`…) | Proveedor, consentimiento y CSP | Datos + negocio |
| T09 Facetas por material/color/técnica | Atributos no existen en el dataset | Catálogo + UX |
| T10 Tokens y CTA unificados en todo el sitio; matriz 320–1440 completa | Refactor visual amplio; se priorizó la ficha | UX + frontend |
| T12 Checkout B2C | Condicionado a precios, stock, impuestos y logística | Negocio |
| Políticas (privacidad, entregas, garantía, reclamos) en el footer | Texto legal y operativo no disponible | Negocio + legal |
| Rondas formativas/sumativas con compradores reales, SUS y CSAT | Requiere participantes | UX + negocio |
| Reposicionar el botón flotante de WhatsApp en móvil | No tapa CTA (medido), pero sí parte del texto | UX |

## 6. Validación

Ver `reports/uxui-validation.md` (comandos y resultados reales).
