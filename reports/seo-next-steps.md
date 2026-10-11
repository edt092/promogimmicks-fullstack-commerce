# Publicación, pendientes y medición — PromoGimmicks

Nada de esto se ha ejecutado: requiere aprobación del propietario.

## 1. Plan de publicación

### Antes de publicar (verificación de host en Netlify) — obligatorio
1. Netlify → **Domain management**: confirmar que el **dominio primario es `www.promogimmicks.com`** y que `promogimmicks.com` es alias.
   - Si el primario fuese la raíz: **no publicar**. Cambiar `siteUrl` en `site.config.json` a la raíz, mover `https://www…` a `secondaryHosts`, ejecutar `python scripts/generate_redirects.py`, rebuild y repetir validación.
2. `public/_redirects` termina con reglas host secundario → www (`301!`). No contiene ninguna regla con origen en www (sin bucles con el dominio primario).

### Vista previa (Deploy Preview / rama)
1. Crear rama y PR (o `netlify deploy` sin `--prod`). El build de Netlify ejecuta `next build` (static export → `out/`).
2. En la URL de vista previa comprobar:
   - `/`, `/tienda/`, `/tienda/categoria/articulos-escritura/`, `/tienda/categoria/articulos-escritura/pagina/2/`, una ficha, `/productos-promocionales-ecuador/quito/`, `/nosotros/`, `/contacto/`, `/blog/` → 200, sin errores de consola.
   - Búsqueda del header y de `/tienda/`: "esfero", "boligrafo" (sin tilde), un SKU (`PG-000001`).
   - CTA de WhatsApp en ficha, categoría y ciudad: abrir el enlace (sin enviar mensaje) y revisar número `593998594123` y texto.
   - `/search-index.json` → 200 `application/json`.
   - Una URL inexistente → 404 real; una categoría inexistente (`/tienda/categoria/no-existe/`) → 404.
   - Rutas 410 (p. ej. una de `reports/unresolved_redirects.md`) → 410.
   - Nota: en la vista previa el host es `*.netlify.app`, así que las reglas de host y los canonicals apuntarán a www (es lo esperado).

### Producción
1. Merge/deploy aprobado.
2. **Smoke test inmediato** (copiar y pegar):
   ```bash
   for u in https://promogimmicks.com/ https://www.promogimmicks.com/ http://promogimmicks.com/ \
            https://promogimmicks.com/tienda/boligrafo-alden-10441/ https://www.promogimmicks.com/contacto \
            https://www.promogimmicks.com/productos-promocionales-colombia/bogota/; do
     echo "$u -> $(curl -s -o /dev/null -L -w '%{num_redirects} saltos, %{http_code} %{url_effective}' "$u")"
   done
   curl -s https://www.promogimmicks.com/robots.txt
   curl -s https://www.promogimmicks.com/ | grep -o '<link rel="canonical"[^>]*>'
   ```
   Esperado: raíz → 1 salto a www; www → 0 saltos; http raíz → ≤2 saltos; canonical `https://www.promogimmicks.com/`.
3. Search Console:
   - Propiedad de dominio (o la de `https://www.promogimmicks.com/`): enviar `https://www.promogimmicks.com/sitemap.xml`; retirar el sitemap de la raíz si estaba enviado.
   - URL Inspection de 10 URLs (homepage, 3 categorías, 4 fichas, Quito, Guayaquil): canonical declarado = www; "Solicitar indexación" solo para esas.
   - Validar corrección en "Página con redirección" y "Alternativa con canónica adecuada" (esperando que bajen los casos evitables, no a cero).

### Rollback
- Netlify → Deploys → **Publish deploy** del deploy anterior (instantáneo).
- Disparadores: bucle de redirecciones, 404 en rutas de catálogo, CTA de WhatsApp roto, `/search-index.json` no servido (búsqueda inoperante), caída de leads.
- Si el problema es solo de host: revertir `public/_redirects` al deploy anterior y revisar el dominio primario.

## 2. Tareas restantes (orden sugerido)

| Prioridad | Tarea | Depende de | Responsable | Aceptación |
|---|---|---|---|---|
| P0 | Confirmar dominio primario en Netlify y publicar | — | Despliegue | Smoke test §1 OK |
| P0 | Enviar sitemap www y revisar URL Inspection | Publicación | Negocio/SEO | Canonical elegido = www en la muestra |
| P1 | Export GSC por motivo (716 DAS, 64 descubiertas, 63 404, 22 robots) + backlinks | Acceso GSC | Negocio | Matriz `seo-redirect-matrix.csv` con motivo actual |
| P1 | Decidir 301 producto→categoría ("revisar: candidato 410" en la matriz) | Export GSC/backlinks | SEO + código | Solo 301 con sucesor real; resto 410; regenerar `_redirects` |
| P1 | Confirmar cobertura Colombia → mantener 301 a hub o 410 | Negocio | Negocio + código | Copy, redirects y schema coherentes |
| P1 | Cargar atributos verificados en los 20–50 productos con más exposición (paraguas, antiestrés, bolígrafo jeringa, abanico madera, set licorera…) | Datos de proveedor | Negocio + código | Ficha del modelo con datos confirmados; sin defaults de categoría |
| P1 | Nombre descriptivo para modelos con nombre solo comercial; resolver posibles duplicados entre proveedores | Negocio | Negocio + datos | Sin canonical/redirect por similitud textual |
| P1 | Integrar reglas de `seo_catalog_cleanup.py` en el pipeline externo de productos (`chore(pipeline)`) | Repo del pipeline | Código | Productos nuevos sin Colombia/mínimos/origen no verificado |
| P2 | Medición: evento `quote_click` (ruta, tipo, SKU/categoría/ciudad, sin datos personales) | Proveedor de analítica + consentimiento + CSP | Negocio + código | Eventos registrados sin romper CSP |
| P2 | Páginas de ciudad con información real (proceso de entrega, condiciones, casos con consentimiento) | `seo-business-inputs.md` §1–3 | Negocio + contenido | Diferenciación real, sin sucursales ni clientes ficticios |
| P2 | Piloto de subcategorías (bolígrafos metálicos/plásticos/ecológicos, mugs sublimación, tomatodos por material) | Atributo material verificado | Datos + código | Hijo con inventario validado, canonical y breadcrumb |
| P2 | Hubs comerciales (regalos corporativos, kits de bienvenida, eventos, al por mayor) | Condiciones verificadas | Negocio + código | Inventario curado + condiciones reales |
| P2 | Refrescar artículos "2025" con `dateModified` real y fuentes | Contenido | Contenido | Fecha visible y en schema solo si cambia el contenido |
| P2 | Política de privacidad revisada; decidir si publicar formulario (Formspree) | Asesoría legal | Negocio | Texto aprobado enlazado en footer |
| P2 | Medir CWV reales (PageSpeed con API key / CrUX) tras publicar | Publicación | SEO | Valores LCP/INP/CLS móviles registrados |
| P2 | Reducir HTML de `/tienda/` (directorio SSR completo) con paginación `/tienda/pagina/{n}/` | Medición post-publicación | Código | Todos los productos siguen alcanzables por enlaces |

## 3. Medición 30/60/90 días

- Registrar fecha de publicación y este baseline (`seo-baseline.md`).
- Comparar ventanas de **28 días equivalentes** (antes/después; no julio parcial ni octubre parcial vs. septiembre completo).
- KPIs: % de URLs activas elegibles indexadas; cohortes de "rastreada/descubierta sin indexar"; soft-404 evitables (objetivo 0); conflictos de host (canonical elegido ≠ declarado); impresiones/clics Ecuador por cluster (`seo-keyword-url-map.csv`); CTR con posición; clics a WhatsApp (intención, no lead); leads cualificados y pedidos (registro comercial).
- Metas técnicas: 0 bucles, 0 CTA rotos, 100 % de productos activos enlazados y en sitemap, 0 ofertas inventadas. Metas de tráfico/leads: fijarlas después de un export fiable; no se garantizan posiciones.
