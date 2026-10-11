# Validación UX/UI — comandos y resultados reales (2026-10-10)

Build local sobre la rama `uxui/auditoria-2026-10`, servido con `python -m http.server --directory out`. No se enviaron mensajes de WhatsApp, correos ni formularios.

## Comandos

| Comando | Resultado |
|---|---|
| `npx tsc --noEmit -p .` | ✅ sin errores |
| `npx next lint` | ✅ 0 errores (avisos `no-img-element` preexistentes) |
| `npx next build` | ✅ exit 0; 2.129 páginas (+ `/cotizacion/`) |
| `python scripts/validate_build_output.py` | ✅ todas las validaciones críticas (2.121 URLs en sitemap, 8.491 enlaces de WhatsApp, 0 rutas rotas, 2.027 productos alcanzables) |
| Pruebas de flujo con Playwright a 390×844 (`uxui_flows.py`) | ✅ ver tabla |

Nota: un build intermedio falló con `EBUSY` porque el servidor local de pruebas bloqueaba `out/`. Se detuvo el servidor y se repitieron build, validador y pruebas sobre el build limpio; los resultados de abajo son de esa ejecución.

First Load JS tras los cambios: homepage 171 KB (+1), ficha 156 KB (+3), tienda 152 KB (+3), `/cotizacion/` 152 KB.

## Flujos (escenarios de la auditoría §3.3-E)

| Escenario / comprobación | Resultado |
|---|---|
| **Happy path 1:** ficha → cantidad 300 → "Agregar a cotización" | ✅ estado "Agregamos … a tu cotización" anunciado; el enlace de WhatsApp de la ficha incluye "Cantidad: 300 unidades" |
| **Happy path 2:** segundo producto de otra categoría (Mug Troy) → `/cotizacion/` | ✅ "1. Productos (2)" en una sola solicitud |
| **Unhappy path:** revisar sin ciudad ni fecha | ✅ resumen de errores con foco; se conservan los 2 productos y la cantidad 300 |
| Corregir → revisar → mensaje | ✅ 2 SKU, "300 unidades", "Ciudad de entrega: Quito"; el texto del enlace de WhatsApp es **idéntico** al mensaje revisado; número 593998594123 |
| Editar tras revisar | ✅ la revisión se invalida (hay que revisar de nuevo) |
| Recargar `/cotizacion/` | ✅ los productos persisten; la ciudad **no** se guarda |
| `localStorage` | ✅ solo `slug`, `sku`, `quantity` (sin datos personales) |
| Ficha móvil | ✅ H1 a 256 px; imagen a 1.354 px (la información de decisión va primero) |
| Menú móvil | ✅ "Abrir menú", `aria-expanded=true`, foco dentro al abrir, scroll de fondo bloqueado, Escape cierra y devuelve el foco al botón |
| Controles interactivos anidados en `/tienda/` | ✅ 0 (antes: botón "Cotizar" dentro del enlace de cada tarjeta) |
| `/tienda/?q=boligrafo` | ✅ el campo se restaura con "boligrafo" y muestra 20 resultados (primer lote) |
| Búsqueda sin resultados (`zzzxq987`) | ✅ URL actualizada a `?q=zzzxq987`; acciones "Limpiar búsqueda" y "Pedir asesoría" |
| Newsletter | ✅ etiqueta visible asociada al campo |
| Errores JS en consola | ✅ 0 |

Detalle de la prueba: el contador `unhappy_alerta` dio 2 elementos `role="alert"` en lugar de 1, porque Next.js añade su propio anunciador de rutas. El foco en el resumen de errores sí se verificó (`unhappy_foco_en_resumen: true`).

La inspección visual detectó en móvil la superposición entre la etiqueta "Cantidad" y el nombre del producto en las filas de `/cotizacion/`. Se corrigió y se verificó en una nueva captura (`ux_cotizacion_m.png`).

## No verificado

- Navegadores distintos de Chromium, lectores de pantalla reales (NVDA/VoiceOver), zoom al 200 % y la matriz completa 320–1440 px.
- Contraste medido por herramienta en todos los estados.
- Envío real a Formspree (newsletter) y apertura real de WhatsApp o correo.
- Pruebas con compradores reales, SUS o CSAT (protocolo en la auditoría, §2.1).
