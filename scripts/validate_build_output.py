"""
Validador post-build. Ejecutar después de `npm run build` (con output: 'export',
esto genera la carpeta out/).

Verifica:
  1. Todas las URLs del sitemap generado (out/sitemap.xml) tienen index.html real en out/.
  2. Cada index.html indexable tiene un único <link rel="canonical"> absoluto y autorreferente.
  3. Ninguna URL del sitemap aparece también como origen ("from") en public/_redirects.
  4. Ningún target interno de _redirects apunta a una URL sin archivo out/ correspondiente
     (evita redirigir a un 404 involuntario) — excluye los 410 intencionales.
  5. Ninguna regla de _redirects encadena con otra (cadenas/loops), usando el mismo
     algoritmo que scripts/audit_gsc_indexing.py.
  6. Grep de out/**/*.html en busca de <a href> a hosts secundarios (no canónicos),
     slugs históricos (legacy_slugs.json) o "?categoria=".
  8. Todos los productos activos alcanzables por <a href> SSR desde la homepage; sin enlaces internos rotos.
  9. Todos los enlaces de WhatsApp: número de site.config.json, sin placeholders ni doble codificación.
 10. JSON-LD parseable, sin Offer sin price ni URLs con host secundario.
 11. Sin noindex en URLs del sitemap (bloqueante); títulos/descripciones duplicados (aviso).
 12. Afirmaciones vetadas en fichas (Colombia, stock inmediato, mínimos, "oficial") (aviso).
  7. Las ~100 URLs "activas" de DAS (según reports/gsc_audit_report.json) tienen archivo
     real, canonical autorreferente y sin "noindex".

Sale con código 1 si hay fallos críticos (1-5, 8-10, noindex de 11); los hallazgos de 6-7 se listan como
advertencias no bloqueantes (dependen de contenido histórico / calidad editorial).
"""
import json
import os
import re
import sys
from urllib.parse import urlsplit

ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT_DIR = os.path.join(ROOT, 'out')
with open(os.path.join(ROOT, 'site.config.json'), encoding='utf-8') as _f:
    SITE_CONFIG = json.load(_f)
# Host canónico compartido con Next.js y generate_redirects.py (site.config.json).
SITE_URL = SITE_CONFIG['siteUrl'].rstrip('/')
SECONDARY_HOSTS = [h.rstrip('/') for h in SITE_CONFIG.get('secondaryHosts', [])]
WHATSAPP_NUMBER = SITE_CONFIG['whatsappNumber']


def fail(msg):
    print(f'FALLO: {msg}')


def warn(msg):
    print(f'AVISO: {msg}')


def path_to_html_file(path):
    """Replica cómo Next 'output: export' + trailingSlash:true escribe archivos."""
    if path in ('', '/'):
        return os.path.join(OUT_DIR, 'index.html')
    trimmed = path.strip('/')
    return os.path.join(OUT_DIR, trimmed, 'index.html')


def load_sitemap_urls():
    sitemap_path = os.path.join(OUT_DIR, 'sitemap.xml')
    if not os.path.exists(sitemap_path):
        fail('No existe out/sitemap.xml — ¿corrió npm run build?')
        return []
    with open(sitemap_path, encoding='utf-8') as f:
        content = f.read()
    return re.findall(r'<loc>(.*?)</loc>', content)


def parse_redirects():
    path = os.path.join(ROOT, 'public', '_redirects')
    rules = []
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
                continue  # regla condicionada por query — no participa en el check plano
            to = parts[1]
            status = parts[2] if len(parts) > 2 else '301'
            rules.append((frm, to, status))
    return rules


def main():
    critical_failures = 0

    if not os.path.isdir(OUT_DIR):
        fail('No existe la carpeta out/ — ejecuta "npm run build" primero.')
        sys.exit(1)

    sitemap_urls = load_sitemap_urls()
    print(f'Sitemap: {len(sitemap_urls)} URLs.')

    # --- 1. Todas las URLs del sitemap tienen archivo real ---
    sitemap_paths = set()
    missing_files = []
    for url in sitemap_urls:
        path = urlsplit(url).path
        sitemap_paths.add(path)
        html_file = path_to_html_file(path)
        if not os.path.exists(html_file):
            missing_files.append((url, html_file))
    if missing_files:
        critical_failures += 1
        fail(f'{len(missing_files)} URLs del sitemap no tienen archivo HTML generado:')
        for url, html_file in missing_files[:20]:
            print(f'    {url} -> {html_file}')
    else:
        print('OK: todas las URLs del sitemap tienen archivo HTML.')

    # --- 2. Canonical autorreferente único ---
    canonical_issues = []
    canonical_re = re.compile(r'<link[^>]+rel="canonical"[^>]+href="([^"]+)"')
    for url in sitemap_urls:
        path = urlsplit(url).path
        html_file = path_to_html_file(path)
        if not os.path.exists(html_file):
            continue
        with open(html_file, encoding='utf-8') as f:
            html = f.read()
        matches = canonical_re.findall(html)
        if len(matches) == 0:
            canonical_issues.append((url, 'sin canonical'))
        elif len(matches) > 1:
            canonical_issues.append((url, f'{len(matches)} canonicals'))
        elif matches[0].rstrip('/') != url.rstrip('/'):
            canonical_issues.append((url, f'canonical distinto: {matches[0]}'))
    if canonical_issues:
        critical_failures += 1
        fail(f'{len(canonical_issues)} páginas con canonical ausente/duplicado/inconsistente:')
        for url, issue in canonical_issues[:20]:
            print(f'    {url}: {issue}')
    else:
        print('OK: canonical autorreferente único en todas las páginas del sitemap.')

    # --- 3. Ninguna URL del sitemap es también origen de un redirect ---
    # Comparación EXACTA (sin normalizar slash): Netlify matchea el "from" tal cual, y el
    # bloque de trailing-slash genera a propósito la variante SIN slash como origen — eso
    # no colisiona con la URL del sitemap, que siempre lleva slash.
    redirect_rules = parse_redirects()
    redirect_froms = {frm for frm, _, _ in redirect_rules}
    overlap = [p for p in sitemap_paths if p in redirect_froms]
    if overlap:
        critical_failures += 1
        fail(f'{len(overlap)} URLs del sitemap también son origen de una regla en _redirects (conflicto):')
        for p in overlap[:20]:
            print(f'    {p}')
    else:
        print('OK: ninguna URL del sitemap colisiona con un origen de _redirects.')

    # --- 4 & 5. Targets válidos + cadenas/loops ---
    redirect_index = {}
    for frm, to, status in redirect_rules:
        redirect_index.setdefault(frm, (to, status))

    def resolve_chain(path, max_hops=5):
        seen = set()
        current = path
        hops = 0
        while current in redirect_index:
            if current in seen:
                return hops, current, True
            seen.add(current)
            target, _status = redirect_index[current]
            if target.startswith('http'):
                target = urlsplit(target).path or '/'
            hops += 1
            current = target
            if hops > max_hops:
                return hops, current, False
        return hops, current, False

    chains = []
    loops = []
    dangling = []
    for frm, to, status in redirect_rules:
        hops, final_path, is_loop = resolve_chain(frm)
        if is_loop:
            loops.append(frm)
            continue
        if hops >= 2:
            chains.append((frm, hops, final_path))
        has_placeholder = ':' in frm.split('//')[-1] or '*' in frm or ':' in to.split('//')[-1] or '*' in to
        if status != '410' and to.startswith('http') and not has_placeholder:
            target_path = urlsplit(to).path
            if target_path and target_path != '/' and not os.path.exists(path_to_html_file(target_path)):
                dangling.append((frm, to))

    # Netlify compara reglas ignorando la barra final: una regla con comodín cuyo destino es
    # el mismo patrón + "/" se aplica sobre sí misma en URLs inexistentes -> bucle infinito.
    for frm, to, status in redirect_rules:
        if ':' not in frm and '*' not in frm:
            continue
        to_path = urlsplit(to).path if to.startswith('http') else to
        if status.startswith('3') and to_path.rstrip('/') == frm.rstrip('/'):
            loops.append(f'{frm} (comodín hacia sí mismo con barra final)')

    if loops:
        critical_failures += 1
        fail(f'{len(loops)} redirect loops detectados:')
        for frm in loops[:20]:
            print(f'    {frm}')
    else:
        print('OK: sin redirect loops.')

    if chains:
        critical_failures += 1
        fail(f'{len(chains)} cadenas de 2+ saltos detectadas (debe ser máximo 1 salto):')
        for frm, hops, final_path in chains[:20]:
            print(f'    {frm} -> ({hops} saltos) -> {final_path}')
    else:
        print('OK: todos los redirects resuelven en un solo salto.')

    if dangling:
        critical_failures += 1
        fail(f'{len(dangling)} redirects apuntan a un target sin archivo out/ (posible redirect-a-404):')
        for frm, to in dangling[:20]:
            print(f'    {frm} -> {to}')
    else:
        print('OK: ningún redirect (no-410) apunta a un target sin archivo generado.')

    # --- 6. Enlaces internos rotos (www, slugs históricos, ?categoria=) ---
    with open(os.path.join(ROOT, 'scripts', 'redirect_sources', 'legacy_slugs.json'), encoding='utf-8') as f:
        legacy_slugs = set(json.load(f).keys())

    bad_links = []
    for dirpath, _dirs, files in os.walk(OUT_DIR):
        for fn in files:
            if not fn.endswith('.html'):
                continue
            fpath = os.path.join(dirpath, fn)
            with open(fpath, encoding='utf-8') as f:
                html = f.read()
            for href in re.findall(r'href="(https?://[^"]*promogimmicks\.com[^"]*)"', html):
                if any(href.startswith(h + '/') or href == h for h in SECONDARY_HOSTS):
                    bad_links.append((fpath, href, 'host secundario'))
            for href in re.findall(r'href="(/[^"]*)"', html):
                if href.startswith('//'):
                    continue
                if False:
                    pass
                elif '?categoria=' in href:
                    bad_links.append((fpath, href, 'query categoria'))
                else:
                    m = re.match(r'^/tienda/([^/?]+)/?$', href)
                    if m and m.group(1) in legacy_slugs:
                        bad_links.append((fpath, href, 'slug histórico'))
    if bad_links:
        warn(f'{len(bad_links)} enlaces internos apuntan a host secundario/slug histórico/query de categoría (no bloqueante, revisar):')
        for fpath, href, reason in bad_links[:20]:
            print(f'    {os.path.relpath(fpath, OUT_DIR)}: {href} ({reason})')
    else:
        print('OK: sin enlaces internos a hosts secundarios/slugs históricos/?categoria=.')

    # --- 7. URLs "activas" de DAS ---
    audit_path = os.path.join(ROOT, 'reports', 'gsc_audit_report.json')
    if os.path.exists(audit_path):
        with open(audit_path, encoding='utf-8') as f:
            audit = json.load(f)
        activas = [r for r in audit['registros'] if r['clasificacion'] == 'activa_rastreada_sin_indexar']
        noindex_re = re.compile(r'name="robots"[^>]*content="[^"]*noindex')
        das_issues = []
        for r in activas:
            path = urlsplit(r['url']).path
            html_file = path_to_html_file(path)
            if not os.path.exists(html_file):
                das_issues.append((r['url'], 'sin archivo out/'))
                continue
            with open(html_file, encoding='utf-8') as f:
                html = f.read()
            if noindex_re.search(html):
                das_issues.append((r['url'], 'tiene noindex'))
            if path.rstrip('/') not in {p.rstrip('/') for p in sitemap_paths}:
                das_issues.append((r['url'], 'no está en sitemap'))
        if das_issues:
            warn(f'{len(das_issues)} de las {len(activas)} URLs "activas" de DAS tienen un problema técnico:')
            for url, issue in das_issues[:20]:
                print(f'    {url}: {issue}')
        else:
            print(f'OK: las {len(activas)} URLs "activas" de DAS son técnicamente correctas (archivo, no-noindex, en sitemap).')
    else:
        warn('No existe reports/gsc_audit_report.json — corre scripts/audit_gsc_indexing.py primero para el check #7.')

    # --- 8. Descubrimiento: todos los productos activos alcanzables por <a href> SSR ---
    # Recorrido BFS por el HTML exportado desde la homepage (sin JS). Bloqueante.
    with open(os.path.join(ROOT, 'data', 'products.json'), encoding='utf-8') as f:
        active_products = {f"/tienda/{p['slug']}/" for p in json.load(f)}
    href_re = re.compile(r'<a[^>]+href="(/[^"#?]*)')
    depth = {'/': 0}
    queue = ['/']
    broken_internal = set()
    while queue:
        path = queue.pop(0)
        html_file = path_to_html_file(path)
        if not os.path.exists(html_file):
            broken_internal.add(path)
            continue
        with open(html_file, encoding='utf-8') as f:
            html = f.read()
        for href in href_re.findall(html):
            if not href.endswith('/') or '.' in href.rsplit('/', 2)[-2]:
                continue  # archivos (imágenes, xml, json) o rutas sin barra
            if href not in depth:
                depth[href] = depth[path] + 1
                queue.append(href)
    unreachable = sorted(active_products - set(depth))
    if unreachable:
        critical_failures += 1
        fail(f'{len(unreachable)} productos activos no son alcanzables por enlaces HTML desde la homepage:')
        for p_ in unreachable[:20]:
            print(f'    {p_}')
    else:
        max_depth = max(depth.get(p_, 0) for p_ in active_products)
        print(f'OK: los {len(active_products)} productos activos son alcanzables por enlaces HTML (profundidad máx. {max_depth}).')
    if broken_internal:
        critical_failures += 1
        fail(f'{len(broken_internal)} enlaces internos apuntan a rutas sin HTML exportado:')
        for p_ in sorted(broken_internal)[:20]:
            print(f'    {p_}')
    else:
        print(f'OK: {len(depth)} rutas internas enlazadas, ninguna rota.')

    # --- 9. CTAs de WhatsApp ---
    from urllib.parse import unquote as _unquote
    wa_re = re.compile(r'href="(https://wa\.me/[^"]*)"')
    wa_issues = []
    wa_total = 0
    for dirpath, _dirs, files in os.walk(OUT_DIR):
        for fn in files:
            if not fn.endswith('.html'):
                continue
            fpath = os.path.join(dirpath, fn)
            with open(fpath, encoding='utf-8') as f:
                html = f.read()
            for link in wa_re.findall(html):
                wa_total += 1
                link = link.replace('&amp;', '&')
                number = link.split('wa.me/', 1)[1].split('?', 1)[0]
                text = _unquote(link.split('text=', 1)[1]) if 'text=' in link else ''
                if number != WHATSAPP_NUMBER:
                    wa_issues.append((fpath, link, f'número {number}'))
                elif '{' in text or '}' in text:
                    wa_issues.append((fpath, link, 'placeholder literal'))
                elif '%' in text and re.search(r'%[0-9A-Fa-f]{2}', text):
                    wa_issues.append((fpath, link, 'doble codificación'))
    if wa_issues:
        critical_failures += 1
        fail(f'{len(wa_issues)} enlaces de WhatsApp incorrectos:')
        for fpath, link, why in wa_issues[:20]:
            print(f'    {os.path.relpath(fpath, OUT_DIR)}: {why} -> {link[:120]}')
    else:
        print(f'OK: {wa_total} enlaces de WhatsApp con número {WHATSAPP_NUMBER}, sin placeholders ni doble codificación.')

    # --- 10. JSON-LD parseable; Offer solo con price ---
    ld_re = re.compile(r'<script type="application/ld\+json">(.*?)</script>', re.S)
    ld_issues = []
    ld_blocks = 0

    def walk(node, fpath):
        if isinstance(node, dict):
            if node.get('@type') == 'Offer' and 'price' not in node:
                ld_issues.append((fpath, 'Offer sin price'))
            for v in node.values():
                walk(v, fpath)
        elif isinstance(node, list):
            for v in node:
                walk(v, fpath)

    for url in sitemap_urls:
        html_file = path_to_html_file(urlsplit(url).path)
        if not os.path.exists(html_file):
            continue
        with open(html_file, encoding='utf-8') as f:
            html = f.read()
        for block in ld_re.findall(html):
            ld_blocks += 1
            try:
                data = json.loads(block)
            except ValueError as e:
                ld_issues.append((html_file, f'JSON inválido: {e}'))
                continue
            walk(data, html_file)
            raw = json.dumps(data)
            for h in SECONDARY_HOSTS:
                if h + '/' in raw or raw.endswith(h):
                    ld_issues.append((html_file, f'URL con host secundario {h}'))
                    break
    if ld_issues:
        critical_failures += 1
        fail(f'{len(ld_issues)} problemas de JSON-LD:')
        for fpath, why in ld_issues[:20]:
            print(f'    {os.path.relpath(fpath, OUT_DIR)}: {why}')
    else:
        print(f'OK: {ld_blocks} bloques JSON-LD parseables, sin Offer sin precio ni hosts secundarios.')

    # --- 11. Metadata duplicada y noindex en páginas del sitemap (aviso) ---
    title_re = re.compile(r'<title>(.*?)</title>', re.S)
    desc_re = re.compile(r'<meta name="description" content="([^"]*)"')
    noindex_re2 = re.compile(r'name="robots"[^>]*content="[^"]*noindex')
    titles, descs, noindexed = {}, {}, []
    for url in sitemap_urls:
        html_file = path_to_html_file(urlsplit(url).path)
        if not os.path.exists(html_file):
            continue
        with open(html_file, encoding='utf-8') as f:
            html = f.read()
        t = title_re.search(html)
        d = desc_re.search(html)
        if t:
            titles.setdefault(t.group(1).strip(), []).append(url)
        if d:
            descs.setdefault(d.group(1).strip(), []).append(url)
        if noindex_re2.search(html):
            noindexed.append(url)
    dup_t = {k: v for k, v in titles.items() if len(v) > 1}
    dup_d = {k: v for k, v in descs.items() if len(v) > 1}
    if noindexed:
        critical_failures += 1
        fail(f'{len(noindexed)} URLs del sitemap tienen noindex:')
        for u in noindexed[:20]:
            print(f'    {u}')
    else:
        print('OK: ninguna URL del sitemap tiene noindex.')
    if dup_t or dup_d:
        warn(f'{len(dup_t)} títulos y {len(dup_d)} descripciones duplicados entre URLs del sitemap:')
        for k, v in list(dup_t.items())[:10]:
            print(f'    título "{k[:80]}" x{len(v)}')
        for k, v in list(dup_d.items())[:5]:
            print(f'    descripción "{k[:80]}" x{len(v)}')
    else:
        print('OK: títulos y descripciones únicos en el sitemap.')

    # --- 12. Afirmaciones no respaldadas en fichas de producto (aviso) ---
    claim_re = re.compile(r'Bogot[áa]|Medell[íi]n|Disponibilidad inmediata|Mínimo \d+ unidades|Distribuidor oficial|fabricado en Ecuador', re.I)
    claim_hits = []
    for p_ in sorted(active_products):
        html_file = path_to_html_file(p_)
        if not os.path.exists(html_file):
            continue
        with open(html_file, encoding='utf-8') as f:
            body = f.read()
        body = re.sub(r'<script.*?</script>', '', body, flags=re.S)
        m = claim_re.search(body)
        if m:
            claim_hits.append((p_, m.group(0)))
    if claim_hits:
        warn(f'{len(claim_hits)} fichas contienen afirmaciones a revisar:')
        for p_, hit in claim_hits[:20]:
            print(f'    {p_}: "{hit}"')
    else:
        print('OK: sin afirmaciones vetadas (Colombia, stock inmediato, mínimos, "oficial") en fichas.')


    print()
    if critical_failures:
        print(f'{critical_failures} categoría(s) de fallo crítico. Ver detalle arriba.')
        sys.exit(1)
    print('Todas las validaciones críticas pasaron.')


if __name__ == '__main__':
    main()
