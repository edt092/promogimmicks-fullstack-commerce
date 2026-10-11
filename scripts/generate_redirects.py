"""
Genera public/_redirects de forma reproducible e idempotente.

Fuente de verdad (todo versionado, nada hardcodeado en este script):
  scripts/redirect_sources/legacy_slugs.json           slug histórico -> slug actual | null
  scripts/redirect_sources/legacy_categories.json       slug de categoría histórico -> ruta destino
  scripts/redirect_sources/legacy_category_queries.json nombre de categoría (query ?categoria=) -> slug actual | null
  scripts/redirect_sources/manual_redirects.txt         reglas que no se derivan de datos (Colombia, /contacto, etc.)

Orden del archivo final (primera regla que matchea gana, Netlify procesa de arriba hacia abajo):
  1. manual_redirects.txt                (rutas exactas específicas)
  2. redirects de query string (facetas) (rutas exactas + condición de query)
  3. redirects de categorías históricas   (con y sin slash, destino absoluto)
  4. redirects de productos históricos    (con y sin slash, destino absoluto; 410 si no hay reemplazo)
  5. trailing-slash genérico              (patrones dinámicos + páginas estáticas, destino absoluto)
  6. host/protocolo (www, http)           (absoluto + force, red de seguridad final)

Los bloques 1-4 usan siempre una URL de destino ABSOLUTA (SITE_URL de site.config.json),
de modo que cualquier combinación de entrada (www + slug viejo, sin slash + slug viejo, etc.)
resuelve en un solo salto 301, sin encadenar host-fix -> slug-fix.

Nunca hace matching difuso: solo usa lo que ya está resuelto en legacy_slugs.json
(exact SKU/ID o slug+sufijo numérico, ver scripts/redirect_sources/legacy_slugs.json).
No re-ejecuta el matching difuso aquí para no introducir falsos positivos silenciosos.
"""
import json
import os
import sys
from urllib.parse import quote

ROOT = os.path.join(os.path.dirname(__file__), '..')
def load_site_config():
    with open(os.path.join(ROOT, 'site.config.json'), encoding='utf-8') as f:
        return json.load(f)


SITE_CONFIG = load_site_config()
# Host canónico único compartido con Next.js (site.config.json). No hardcodear aquí.
SITE_URL = SITE_CONFIG['siteUrl'].rstrip('/')
SOURCES = os.path.join(ROOT, 'scripts', 'redirect_sources')


def load_json(name):
    with open(os.path.join(SOURCES, name), encoding='utf-8') as f:
        return json.load(f)


def load_products():
    with open(os.path.join(ROOT, 'data', 'products.json'), encoding='utf-8') as f:
        return json.load(f)


def load_categories():
    with open(os.path.join(ROOT, 'data', 'categories.json'), encoding='utf-8') as f:
        return json.load(f)


def load_blog_posts():
    with open(os.path.join(ROOT, 'data', 'blog-posts.json'), encoding='utf-8') as f:
        return json.load(f)


GEO_CIUDADES = {'quito', 'guayaquil', 'cuenca', 'manta'}

STATIC_TOP_LEVEL = ['/tienda', '/novedades', '/productos', '/promociones', '/productos-promocionales-ecuador']


def main():
    products = load_products()
    categories = load_categories()
    blog_posts = load_blog_posts()

    current_product_slugs = {p['slug'] for p in products}
    current_category_slugs = {c['slug'] for c in categories} | {p['categoria_slug'] for p in products}
    current_blog_slugs = {p['slug'] for p in blog_posts}

    legacy_slugs = load_json('legacy_slugs.json')
    legacy_categories = load_json('legacy_categories.json')
    legacy_category_queries = load_json('legacy_category_queries.json')['categories']

    with open(os.path.join(SOURCES, 'manual_redirects.txt'), encoding='utf-8') as f:
        manual_redirects_text = f.read().replace('{SITE_URL}', SITE_URL)

    errors = []
    seen_from = {}
    unresolved = []

    def register_rule(frm, to, status, block_lines, source):
        if frm in seen_from and seen_from[frm] != (to, status):
            errors.append(f'Regla duplicada/conflictiva para "{frm}": {seen_from[frm]} vs ({to}, {status}) [{source}]')
            return
        seen_from[frm] = (to, status)
        block_lines.append(f'{frm}  {to}  {status}')

    def validate_absolute_target(to, source):
        if not to.startswith(SITE_URL):
            return
        path = to[len(SITE_URL):]
        if path in ('/', ''):
            return
        seg = [s for s in path.split('/') if s]
        if not seg:
            return
        if seg[0] == 'tienda':
            if len(seg) == 1:
                return  # /tienda/
            if seg[1] == 'categoria':
                if len(seg) >= 3 and seg[2] in current_category_slugs:
                    return
                errors.append(f'Target de categoría inexistente: {to} [{source}]')
                return
            if seg[1] in current_product_slugs:
                return
            errors.append(f'Target de producto inexistente: {to} [{source}]')
            return
        if seg[0] == 'blog':
            if len(seg) == 1:
                return
            if seg[1] in current_blog_slugs:
                return
            errors.append(f'Target de post inexistente: {to} [{source}]')
            return
        if seg[0] == 'productos-promocionales-ecuador':
            if len(seg) == 1:
                return
            if seg[1] in GEO_CIUDADES:
                return
            errors.append(f'Target de ciudad inexistente: {to} [{source}]')
            return
        if path.rstrip('/') in ('/novedades', '/productos', '/promociones'):
            return
        # otros paths (manual) no se validan aquí — se asume revisados a mano.

    # --- 2. Query string (facetas) ---
    query_lines = []
    for display_name, target_slug in legacy_category_queries.items():
        if not target_slug:
            continue
        to = f'{SITE_URL}/tienda/categoria/{target_slug}/'
        validate_absolute_target(to, 'legacy_category_queries.json')
        # Netlify matching por query exige una condición por valor; como los valores son
        # texto libre conocido (no un patrón genérico), se emite una regla por nombre exacto.
        # Se codifica todo (espacios y acentos) tal como llegaría en la query string real —
        # el archivo _redirects es whitespace-delimited, un espacio o acento literal rompería el parseo.
        query_value = quote(display_name, safe='')
        query_lines.append(f'/tienda/  categoria={query_value}  {to}  301')

    # --- 3. Categorías históricas ---
    category_lines = []
    for old_slug, target in sorted(legacy_categories.items()):
        to = target if target.startswith('http') else f'{SITE_URL}{target}'
        validate_absolute_target(to, 'legacy_categories.json')
        register_rule(f'/tienda/categoria/{old_slug}', to, '301', category_lines, 'legacy_categories.json')
        register_rule(f'/tienda/categoria/{old_slug}/', to, '301', category_lines, 'legacy_categories.json')

    # --- 4. Productos históricos ---
    product_301_lines = []
    product_410_lines = []
    for old_slug, new_slug in sorted(legacy_slugs.items()):
        if new_slug:
            to = f'{SITE_URL}/tienda/{new_slug}/'
            validate_absolute_target(to, 'legacy_slugs.json')
            register_rule(f'/tienda/{old_slug}', to, '301', product_301_lines, 'legacy_slugs.json')
            register_rule(f'/tienda/{old_slug}/', to, '301', product_301_lines, 'legacy_slugs.json')
        else:
            # Sin reemplazo seguro: 410 explícito (nunca se redirige a /tienda/ genérico).
            # Sirve el contenido de app/not-found.tsx (out/404.html) con status 410.
            register_rule(f'/tienda/{old_slug}', '/404.html', '410', product_410_lines, 'legacy_slugs.json')
            register_rule(f'/tienda/{old_slug}/', '/404.html', '410', product_410_lines, 'legacy_slugs.json')
            unresolved.append(old_slug)

    # --- 5. Trailing-slash genérico (fallback, siempre después de las reglas específicas) ---
    # SOLO rutas exactas de páginas que existen. NO usar comodines (/tienda/:slug -> /tienda/:slug/):
    # Netlify ignora la barra final al comparar reglas, así que para una URL inexistente
    # la regla se aplica sobre sí misma y produce un bucle infinito de 301 (incidente
    # 2026-10-10). Para páginas existentes Netlify ya añade la barra final por sí mismo.
    trailing_slash_lines = []
    for p in STATIC_TOP_LEVEL:
        trailing_slash_lines.append(f'{p}  {SITE_URL}{p}/  301')

    # --- 6. Host / protocolo (red de seguridad final) ---
    # Todo host secundario -> host canónico. NUNCA incluir aquí el host canónico como
    # origen (crearía un bucle con la redirección de dominio primario de Netlify).
    canonical_host = SITE_URL.split('://', 1)[1]
    host_lines = []
    for secondary in SITE_CONFIG.get('secondaryHosts', []):
        if secondary.rstrip('/').split('://', 1)[1] == canonical_host and secondary.startswith('https://'):
            errors.append(f'secondaryHosts incluye el host canónico {secondary}')
            continue
        host_lines.append(f'{secondary.rstrip("/")}/*  {SITE_URL}/:splat  301!')

    if errors:
        for e in errors:
            print(f'ERROR: {e}', file=sys.stderr)
        print(f'\n{len(errors)} error(es) de validación — no se escribió public/_redirects.', file=sys.stderr)
        sys.exit(1)

    parts = [
        '# Archivo generado por scripts/generate_redirects.py — NO editar a mano.',
        '# Para cambios manuales, editar scripts/redirect_sources/manual_redirects.txt',
        '# y volver a ejecutar: python scripts/generate_redirects.py',
        '',
        '# ===== 1. Reglas manuales (Colombia, pre-catálogo, /contacto, etc.) =====',
        manual_redirects_text.rstrip('\n'),
        '',
        '# ===== 2. Facetas de categoría por query string (DAFA/DWAD) =====',
        *query_lines,
        '',
        '# ===== 3. Categorías históricas/renombradas =====',
        *category_lines,
        '',
        '# ===== 4. Slugs de producto históricos =====',
        *product_301_lines,
        *product_410_lines,
        '',
        '# ===== 5. Trailing-slash genérico (fallback) =====',
        *trailing_slash_lines,
        '',
        '# ===== 6. Host / protocolo canónico (red de seguridad final) =====',
        *host_lines,
        '',
    ]

    out_path = os.path.join(ROOT, 'public', '_redirects')
    with open(out_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(parts) + '\n')

    total_rules = len(seen_from) + len(query_lines) + len(trailing_slash_lines) + len(host_lines) + \
        len([l for l in manual_redirects_text.splitlines() if l.strip() and not l.strip().startswith('#')])
    print(f'public/_redirects escrito: ~{total_rules} reglas.')
    print(f'  Categorías históricas: {len(legacy_categories)} (x2 variantes de slash)')
    print(f'  Productos con reemplazo: {sum(1 for v in legacy_slugs.values() if v)} (x2 variantes de slash, 301)')
    print(f'  Productos sin reemplazo: {len(unresolved)} (x2 variantes de slash, 410)')
    print(f'  Facetas de categoría con redirect: {len(query_lines)}')

    os.makedirs(os.path.join(ROOT, 'reports'), exist_ok=True)
    with open(os.path.join(ROOT, 'reports', 'unresolved_redirects.md'), 'w', encoding='utf-8') as f:
        f.write('# Slugs de producto históricos sin reemplazo (410 Gone)\n\n')
        f.write('Estos slugs existían antes pero no tienen un reemplazo seguro por SKU/ID en el catálogo actual.\n')
        f.write('Se dejaron como 410 (retirado permanentemente) en vez de redirigir a /tienda/.\n')
        f.write('Si alguno debería mapear a un producto vigente, añadirlo manualmente a\n')
        f.write('scripts/redirect_sources/legacy_slugs.json y volver a generar.\n\n')
        for slug in sorted(unresolved):
            f.write(f'- {slug}\n')

    print(f'\nreports/unresolved_redirects.md escrito ({len(unresolved)} slugs).')


if __name__ == '__main__':
    main()
