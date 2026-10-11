"""
Audita las URLs reportadas por Google Search Console (6 exportaciones en Tabla.csv)
contra el estado actual del catálogo (products.json/categories.json/blog-posts.json),
public/_redirects y las URLs que produce app/sitemap.ts.

Clasifica cada URL en una de las categorías pedidas en seo-a.md y emite:
  reports/gsc_audit_report.md    (resumen legible + tabla de decisiones)
  reports/gsc_audit_report.json  (detalle por URL, consumido por generate_redirects.py
                                   y validate_build_output.py)

Reproducible: las rutas a los exports de GSC se pueden sobreescribir con la variable
de entorno GSC_DOWNLOADS_DIR (por defecto: carpeta Downloads del usuario actual en Windows).
No inventa reemplazos por coincidencia difusa: todo lo ambiguo se marca como
"requiere_decision_humana".
"""
import csv
import io
import json
import os
import re
from collections import Counter, defaultdict
from urllib.parse import urlsplit, unquote

ROOT = os.path.join(os.path.dirname(__file__), '..')
with open(os.path.join(ROOT, 'site.config.json'), encoding='utf-8') as _f:
    # Host canónico compartido (site.config.json); destino de las recomendaciones.
    SITE_HOST = json.load(_f)['siteUrl'].split('://', 1)[1].rstrip('/')

DOWNLOADS_DIR = os.environ.get(
    'GSC_DOWNLOADS_DIR',
    os.path.join(os.path.expanduser('~'), 'Downloads'),
)

REPORTS = {
    '23726': 'Duplicada: Google ha elegido una versión canónica diferente a la del usuario',
    'DAS': 'Rastreada: actualmente sin indexar',
    'DAFA': 'Bloqueada por robots.txt',
    'DWAD': 'Página alternativa con etiqueta canónica adecuada',
    'WE': 'No se ha encontrado (404)',
    'FERA': 'Página con redirección',
}

EXPECTED_COUNTS = {'23726': 8, 'DAS': 452, 'DAFA': 16, 'DWAD': 42, 'WE': 59, 'FERA': 790}

# Rutas geográficas conocidas (data/geo-data.ts) — estables, no depende de parsear TS.
GEO_CIUDADES = {'quito', 'guayaquil', 'cuenca', 'manta'}

STATIC_CANONICAL_PATHS = {
    '/', '/tienda/', '/blog/', '/novedades/', '/productos/', '/promociones/',
    '/productos-promocionales-ecuador/',
}


# ---------------------------------------------------------------------------
# Carga de datos
# ---------------------------------------------------------------------------

def load_json(path):
    with open(os.path.join(ROOT, path), encoding='utf-8') as f:
        return json.load(f)


def load_source(path):
    with open(os.path.join(ROOT, 'scripts', 'redirect_sources', path), encoding='utf-8') as f:
        return json.load(f)


def read_csv_tolerant(path):
    """Lee un Tabla.csv de GSC. La última línea no tiene newline final;
    csv.reader lo maneja bien siempre que abramos con newline='' — se
    verifica explícitamente el conteo de filas contra lo esperado en main()."""
    with open(path, encoding='utf-8', newline='') as f:
        reader = csv.reader(f)
        header = next(reader)
        rows = [row for row in reader if row]
    return header, rows


def compute_sitemap_urls(products, blog_posts):
    """Replica app/sitemap.ts en Python (misma lógica) sin depender de un build de Next."""
    urls = set(STATIC_CANONICAL_PATHS)
    for ciudad in GEO_CIUDADES:
        urls.add(f'/productos-promocionales-ecuador/{ciudad}/')
    unique_categories = {p['categoria_slug'] for p in products}
    for slug in unique_categories:
        urls.add(f'/tienda/categoria/{slug}/')
    for p in products:
        urls.add(f"/tienda/{p['slug']}/")
    for post in blog_posts:
        urls.add(f"/blog/{post['slug']}/")
    return urls


def parse_redirects_file(path):
    """Parser simple de public/_redirects: reglas 'from to status' de una línea,
    ignora comentarios/blancos. No intenta resolver splats/host-rules (no existen
    aún en el archivo actual); se usa solo para detectar reglas por-path existentes."""
    rules = []  # lista ordenada de (from, to, status) — el orden importa (primera regla gana)
    if not os.path.exists(path):
        return rules
    with open(path, encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            parts = line.split()
            if len(parts) < 2:
                continue
            frm = parts[0]
            if len(parts) >= 4 and '=' in parts[1]:
                # Regla con condición de query string (from, key=value, to, status) — solo
                # aplica cuando la query coincide, nunca a una petición sin esa query exacta.
                # Se excluye del índice plano de encadenamiento (no es un salto incondicional).
                continue
            to = parts[1]
            status = parts[2] if len(parts) > 2 else '301'
            if frm.startswith('http') or '*' in frm or ':' in frm:
                continue  # reglas de host/splat futuras — fuera del alcance de este lookup
            rules.append((frm, to, status))
    return rules


def build_redirect_index(rules):
    by_from = {}
    for frm, to, status in rules:
        by_from.setdefault(frm, (to, status))  # primera regla gana
    return by_from


def resolve_chain(path, redirect_index, max_hops=5):
    """Sigue una cadena de redirects (solo path-exact, coincide con el índice actual).
    Devuelve (hops, final_path_or_none, is_loop)."""
    seen = set()
    current = path
    hops = 0
    while current in redirect_index:
        if current in seen:
            return hops, current, True
        seen.add(current)
        target, _status = redirect_index[current]
        if target.startswith('http'):
            # target absoluto: extraer el path
            target = urlsplit(target).path or '/'
        hops += 1
        current = target
        if hops > max_hops:
            return hops, current, False
    return hops, current, False


# ---------------------------------------------------------------------------
# Normalización de URLs
# ---------------------------------------------------------------------------

def normalize(raw_url):
    parsed = urlsplit(raw_url)
    host = parsed.netloc
    is_www = host.startswith('www.')
    path = parsed.path or '/'
    has_trailing_slash = path.endswith('/')
    path_no_slash = path[:-1] if has_trailing_slash and path != '/' else path
    query = unquote(parsed.query) if parsed.query else ''
    return {
        'scheme': parsed.scheme,
        'host': host,
        'is_www': is_www,
        'path': path,
        'path_no_slash': path_no_slash,
        'has_trailing_slash': has_trailing_slash or path == '/',
        'query_raw': parsed.query,
        'query_decoded': query,
    }


PRODUCT_RE = re.compile(r'^/tienda/([^/]+)/?$')
CATEGORY_RE = re.compile(r'^/tienda/categoria/([^/]+)/?$')
BLOG_POST_RE = re.compile(r'^/blog/([^/]+)/?$')
CIUDAD_RE = re.compile(r'^/productos-promocionales-ecuador/([^/]+)/?$')
COLOMBIA_RE = re.compile(r'^/productos-promocionales-colombia(/.*)?$')


def classify_url(norm, report_key, ctx):
    """Devuelve dict con: patron, entidad_encontrada, clasificacion, accion_recomendada,
    destino_recomendado, requiere_decision_humana (bool), nota."""
    products_by_slug = ctx['products_by_slug']
    category_slugs = ctx['category_slugs']
    blog_slugs = ctx['blog_slugs']
    legacy_slugs = ctx['legacy_slugs']
    legacy_categories = ctx['legacy_categories']
    legacy_category_queries = ctx['legacy_category_queries']
    sitemap_urls = ctx['sitemap_urls']
    redirect_index = ctx['redirect_index']

    host_variant = 'www' if norm['is_www'] else 'canonico'
    slash_variant = 'con_slash' if norm['has_trailing_slash'] else 'sin_slash'
    path = norm['path']
    query = norm['query_decoded']

    result = {
        'host_variant': host_variant,
        'slash_variant': slash_variant,
        'requiere_decision_humana': False,
        'nota': '',
    }

    # --- Query strings: facetas / búsqueda ---
    if query:
        if path.rstrip('/') == '/tienda' and query.startswith('categoria='):
            cat_value = query.split('=', 1)[1]
            target_slug = legacy_category_queries.get(cat_value)
            if target_slug:
                result.update(
                    clasificacion='filtro/faceta',
                    accion_recomendada='redirect_301_query',
                    destino_recomendado=f'/tienda/categoria/{target_slug}/',
                )
            else:
                result.update(
                    clasificacion='filtro/faceta',
                    accion_recomendada='exclusion_esperada_sin_redirect',
                    destino_recomendado=None,
                    nota=f'Sin categoría equivalente para "{cat_value}"; se mantiene bloqueado por robots.txt.',
                )
            return result
        if path.rstrip('/') == '/tienda' and query.startswith('search='):
            result.update(
                clasificacion='filtro/faceta',
                accion_recomendada='exclusion_esperada_sin_redirect',
                destino_recomendado=None,
                nota='Búsqueda interna; exclusión esperada, cubierta por robots.txt (/tienda/?).',
            )
            return result
        result.update(
            clasificacion='filtro/faceta',
            accion_recomendada=None,
            destino_recomendado=None,
            requiere_decision_humana=True,
            nota=f'Query string no reconocida: {query!r}',
        )
        return result

    # --- Colombia (removido) ---
    if COLOMBIA_RE.match(path):
        result.update(
            clasificacion='colombia_removida',
            accion_recomendada='ya_redirigido' if norm['path_no_slash'] + '/' in redirect_index or path in redirect_index else 'requiere_regla',
            destino_recomendado='ver public/_redirects (sección Colombia)',
        )
        return result

    # --- Contacto ---
    if path.rstrip('/') == '/contacto':
        result.update(
            clasificacion='404_legitimo',
            accion_recomendada='410_gone',
            destino_recomendado=None,
            nota='No existe /contacto ni enlaces internos reales (solo #contacto en home).',
        )
        return result

    # --- Producto ---
    m = PRODUCT_RE.match(path)
    if m and path.rstrip('/') != '/tienda':
        slug = m.group(1)
        if slug in products_by_slug:
            canonical_path = f'/tienda/{slug}/'
            active_label = 'canonica_activa' if canonical_path in sitemap_urls else 'canonical_inconsistente'
            if host_variant == 'www' or slash_variant == 'sin_slash':
                result.update(
                    clasificacion='variante_www' if host_variant == 'www' else 'variante_sin_slash',
                    accion_recomendada='redirect_301_host_o_slash',
                    destino_recomendado=f'https://{SITE_HOST}{canonical_path}',
                )
            else:
                if report_key == 'DAS':
                    result.update(
                        clasificacion='activa_rastreada_sin_indexar',
                        accion_recomendada='revisar_calidad_contenido',
                        destino_recomendado=None,
                        nota='Verificar en Fase 4 (validate_build_output.py): canonical autorreferente, no-noindex, presencia en sitemap.',
                    )
                else:
                    result.update(
                        clasificacion=active_label,
                        accion_recomendada='ninguna',
                        destino_recomendado=None,
                    )
            return result
        # No está en el catálogo actual → histórico
        if slug in legacy_slugs:
            new_slug = legacy_slugs[slug]
            if new_slug:
                result.update(
                    clasificacion='slug_historico_con_reemplazo',
                    accion_recomendada='redirect_301',
                    destino_recomendado=f'https://{SITE_HOST}/tienda/{new_slug}/',
                )
            else:
                result.update(
                    clasificacion='slug_historico_sin_reemplazo',
                    accion_recomendada='410_gone',
                    destino_recomendado=None,
                    nota='Sin coincidencia segura por SKU/ID en el catálogo actual.',
                )
        else:
            result.update(
                clasificacion='slug_historico_sin_reemplazo',
                accion_recomendada=None,
                destino_recomendado=None,
                requiere_decision_humana=True,
                nota='Slug no está en el catálogo actual ni en legacy_slugs.json — revisar manualmente.',
            )
        return result

    # --- Categoría ---
    m = CATEGORY_RE.match(path)
    if m:
        slug = m.group(1)
        if slug in category_slugs:
            canonical_path = f'/tienda/categoria/{slug}/'
            if host_variant == 'www' or slash_variant == 'sin_slash':
                result.update(
                    clasificacion='variante_www' if host_variant == 'www' else 'variante_sin_slash',
                    accion_recomendada='redirect_301_host_o_slash',
                    destino_recomendado=f'https://{SITE_HOST}{canonical_path}',
                )
            else:
                result.update(clasificacion='canonica_activa', accion_recomendada='ninguna', destino_recomendado=None)
        elif slug in legacy_categories:
            result.update(
                clasificacion='categoria_antigua',
                accion_recomendada='redirect_301',
                destino_recomendado=f'https://{SITE_HOST}{legacy_categories[slug]}' if not legacy_categories[slug].startswith('http') else legacy_categories[slug],
            )
        else:
            result.update(
                clasificacion='categoria_antigua',
                accion_recomendada=None,
                destino_recomendado=None,
                requiere_decision_humana=True,
                nota='Categoría antigua sin equivalente claro en legacy_categories.json (revisar distribución de productos).',
            )
        return result

    # --- Blog post ---
    m = BLOG_POST_RE.match(path)
    if m:
        slug = m.group(1)
        if slug in blog_slugs:
            canonical_path = f'/blog/{slug}/'
            if host_variant == 'www' or slash_variant == 'sin_slash':
                result.update(
                    clasificacion='variante_www' if host_variant == 'www' else 'variante_sin_slash',
                    accion_recomendada='redirect_301_host_o_slash',
                    destino_recomendado=f'https://{SITE_HOST}{canonical_path}',
                )
            else:
                result.update(clasificacion='canonica_activa', accion_recomendada='ninguna', destino_recomendado=None)
        else:
            result.update(
                clasificacion='posible_soft_404',
                accion_recomendada=None,
                destino_recomendado=None,
                requiere_decision_humana=True,
                nota='Slug de post no existe en data/blog-posts.json.',
            )
        return result

    # --- Geo ciudad ---
    m = CIUDAD_RE.match(path)
    if m:
        ciudad = m.group(1)
        if ciudad in GEO_CIUDADES:
            canonical_path = f'/productos-promocionales-ecuador/{ciudad}/'
            if host_variant == 'www' or slash_variant == 'sin_slash':
                result.update(
                    clasificacion='variante_www' if host_variant == 'www' else 'variante_sin_slash',
                    accion_recomendada='redirect_301_host_o_slash',
                    destino_recomendado=f'https://{SITE_HOST}{canonical_path}',
                )
            else:
                result.update(
                    clasificacion='canonical_inconsistente',
                    accion_recomendada='corregir_canonical_en_codigo',
                    destino_recomendado=None,
                    nota='app/productos-promocionales-ecuador/[ciudad]/page.tsx genera canonical sin slash final (bug conocido).',
                )
        else:
            result.update(clasificacion='404_legitimo', accion_recomendada='404_real', destino_recomendado=None)
        return result

    # --- Páginas estáticas top-level ---
    canonical_static = path if path.endswith('/') else path + '/'
    if canonical_static in STATIC_CANONICAL_PATHS:
        if host_variant == 'www' or slash_variant == 'sin_slash':
            result.update(
                clasificacion='variante_www' if host_variant == 'www' else 'variante_sin_slash',
                accion_recomendada='redirect_301_host_o_slash',
                destino_recomendado=f'https://{SITE_HOST}{canonical_static}',
            )
        elif canonical_static == '/productos-promocionales-ecuador/':
            result.update(
                clasificacion='canonical_inconsistente',
                accion_recomendada='corregir_canonical_en_codigo',
                destino_recomendado=None,
                nota='app/productos-promocionales-ecuador/page.tsx genera canonical sin slash final (bug conocido).',
            )
        else:
            result.update(clasificacion='canonica_activa', accion_recomendada='ninguna', destino_recomendado=None)
        return result

    # --- Categorías legacy con slug de nivel raíz u otros no clasificados ---
    result.update(
        clasificacion='no_clasificable',
        accion_recomendada=None,
        destino_recomendado=None,
        requiere_decision_humana=True,
        nota='Patrón de URL no reconocido por el auditor.',
    )
    return result


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    products = load_json('data/products.json')
    categories = load_json('data/categories.json')
    blog_posts = load_json('data/blog-posts.json')

    products_by_slug = {p['slug']: p for p in products}
    category_slugs = {c['slug'] for c in categories} | {p['categoria_slug'] for p in products}
    blog_slugs = {p['slug'] for p in blog_posts}

    legacy_slugs = load_source('legacy_slugs.json')
    legacy_categories = load_source('legacy_categories.json')
    legacy_category_queries = load_source('legacy_category_queries.json')['categories']

    sitemap_urls = compute_sitemap_urls(products, blog_posts)
    redirect_rules = parse_redirects_file(os.path.join(ROOT, 'public', '_redirects'))
    redirect_index = build_redirect_index(redirect_rules)

    ctx = dict(
        products_by_slug=products_by_slug,
        category_slugs=category_slugs,
        blog_slugs=blog_slugs,
        legacy_slugs=legacy_slugs,
        legacy_categories=legacy_categories,
        legacy_category_queries=legacy_category_queries,
        sitemap_urls=sitemap_urls,
        redirect_index=redirect_index,
    )

    all_records = []
    per_report_counts = {}
    human_review = []

    for key, expected_count in EXPECTED_COUNTS.items():
        folder = os.path.join(DOWNLOADS_DIR, key)
        table_path = os.path.join(folder, 'Tabla.csv')
        if not os.path.exists(table_path):
            print(f'AVISO: no se encontró {table_path} — se omite el reporte {key}.')
            continue
        header, rows = read_csv_tolerant(table_path)
        if len(rows) != expected_count:
            print(f'AVISO: {key} tiene {len(rows)} filas, se esperaban {expected_count}.')

        classification_counts = Counter()
        for row in rows:
            raw_url, last_crawled = row[0], row[1] if len(row) > 1 else ''
            norm = normalize(raw_url)
            cls = classify_url(norm, key, ctx)

            # cadena/loop check sobre la regla actual de _redirects (si existe)
            lookup_path = norm['path']
            hops, final_target, is_loop = resolve_chain(lookup_path, redirect_index)
            if is_loop:
                cls['clasificacion'] = 'redirect_loop'
                cls['requiere_decision_humana'] = True
            elif hops >= 2:
                cls['nota'] = (cls.get('nota') or '') + f' [cadena de {hops} saltos detectada en _redirects actual: {lookup_path} -> ... -> {final_target}]'

            record = {
                'reporte': key,
                'url': raw_url,
                'ultimo_rastreo': last_crawled,
                **cls,
            }
            all_records.append(record)
            classification_counts[cls['clasificacion']] += 1
            if cls['requiere_decision_humana']:
                human_review.append(record)

        per_report_counts[key] = dict(
            incidencia=REPORTS[key],
            total=len(rows),
            clasificaciones=dict(classification_counts),
        )

    os.makedirs(os.path.join(ROOT, 'reports'), exist_ok=True)

    with open(os.path.join(ROOT, 'reports', 'gsc_audit_report.json'), 'w', encoding='utf-8') as f:
        json.dump(
            {'reportes': per_report_counts, 'registros': all_records, 'requiere_decision_humana': human_review},
            f, ensure_ascii=False, indent=2,
        )

    lines = ['# Auditoría GSC — promogimmicks.com', '']
    lines.append(f'Total de URLs auditadas: {len(all_records)}')
    lines.append(f'URLs que requieren decisión humana: {len(human_review)}')
    lines.append('')
    for key, data in per_report_counts.items():
        lines.append(f'## {key} — {data["incidencia"]} ({data["total"]} URLs)')
        lines.append('')
        lines.append('| Clasificación | Cantidad |')
        lines.append('|---|---|')
        for cls, count in sorted(data['clasificaciones'].items(), key=lambda x: -x[1]):
            lines.append(f'| {cls} | {count} |')
        lines.append('')

    if human_review:
        lines.append('## URLs que requieren decisión humana')
        lines.append('')
        lines.append('| Reporte | URL | Clasificación | Nota |')
        lines.append('|---|---|---|---|')
        for r in human_review:
            lines.append(f"| {r['reporte']} | {r['url']} | {r['clasificacion']} | {r['nota']} |")
        lines.append('')

    with open(os.path.join(ROOT, 'reports', 'gsc_audit_report.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')

    print(f'Auditoría completa: {len(all_records)} URLs, {len(human_review)} requieren revisión humana.')
    print('Reportes escritos en reports/gsc_audit_report.{md,json}')


if __name__ == '__main__':
    main()
