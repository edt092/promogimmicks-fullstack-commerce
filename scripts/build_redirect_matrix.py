"""
Matriz URL/redirect (reports/seo-redirect-matrix.csv) + cohortes de
"Rastreada: actualmente sin indexar" (reports/seo-das-cohorts.md).

Fuentes (solo lectura):
  public/_redirects                 reglas generadas
  scripts/redirect_sources/*        procedencia de cada regla
  reports/gsc_audit_report.json     export PREVIO de GSC por URL (fechas de rastreo propias);
                                    NO es el export de octubre: el motivo se marca como histórico.
  out/                              HTML exportado (sitemap, enlaces internos entrantes)
  data/products.json                catálogo activo

No asigna motivos GSC por adivinación: si una URL no está en el export previo,
el motivo queda "desconocido (sin export por URL)".

Uso: python scripts/build_redirect_matrix.py   (después de `next build`)
"""
import csv
import json
import os
import re
from collections import Counter, defaultdict
from urllib.parse import urlsplit

ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT_DIR = os.path.join(ROOT, 'out')
REPORTS = os.path.join(ROOT, 'reports')

with open(os.path.join(ROOT, 'site.config.json'), encoding='utf-8') as f:
    SITE_URL = json.load(f)['siteUrl'].rstrip('/')


def load(name, default=None):
    path = os.path.join(ROOT, name)
    if not os.path.exists(path):
        return default
    with open(path, encoding='utf-8') as f:
        return json.load(f)


products = load('data/products.json', [])
active_paths = {f"/tienda/{p['slug']}/" for p in products}
by_slug = {p['slug']: p for p in products}
legacy_slugs = load('scripts/redirect_sources/legacy_slugs.json', {})
gsc = load('reports/gsc_audit_report.json', {'registros': []})
GSC_NAMES = {
    'DAS': 'Rastreada: actualmente sin indexar', 'FERA': 'Página con redirección', 'WE': '404',
    'DWAD': 'Alternativa con canónica adecuada', 'DAFA': 'Bloqueada por robots.txt', '23726': 'Google eligió otra canónica',
}
gsc_by_path = defaultdict(list)
for r in gsc['registros']:
    gsc_by_path[urlsplit(r['url']).path.rstrip('/') + '/'].append(r)

# Sitemap y enlaces internos entrantes (desde out/)
sitemap_paths = set()
sm = os.path.join(OUT_DIR, 'sitemap.xml')
if os.path.exists(sm):
    with open(sm, encoding='utf-8') as f:
        sitemap_paths = {urlsplit(u).path for u in re.findall(r'<loc>(.*?)</loc>', f.read())}
inbound = Counter()
for dirpath, _d, files in os.walk(OUT_DIR):
    for fn in files:
        if fn.endswith('.html'):
            with open(os.path.join(dirpath, fn), encoding='utf-8') as f:
                for href in set(re.findall(r'<a[^>]+href="(/[^"#?]*)"', f.read())):
                    inbound[href.rstrip('/') + '/'] += 1

# Procedencia de reglas manuales por sección de comentarios
manual_section = {}
section = 'manual'
with open(os.path.join(ROOT, 'scripts', 'redirect_sources', 'manual_redirects.txt'), encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if line.startswith('#'):
            section = line.lstrip('# ').split('—')[0].split('(')[0].strip()[:60] or section
        elif line:
            manual_section[line.split()[0]] = section


def decide(frm, to, status, block, target_path):
    """Decisión y evidencia por regla. No cambia nada: documenta."""
    if block == 'host':
        return 'mantener', 'Host secundario -> host canónico (site.config.json).'
    if block == 'slash':
        return 'mantener', 'Normalización de barra final (patrón).'
    if block == 'faceta':
        return 'mantener', 'Faceta histórica ?categoria= -> categoría equivalente.'
    if status == '410':
        return 'mantener (410)', 'Producto retirado sin reemplazo verificado en legacy_slugs.json.'
    old = frm.strip('/').split('/')[-1]
    if block == 'producto':
        new = legacy_slugs.get(old)
        if new and new in by_slug:
            return 'mantener', f'Sucesor por coincidencia exacta registrada (SKU/ID o slug+sufijo): {by_slug[new]["sku"]}.'
        return 'revisar', 'Destino de producto no encontrado en catálogo activo.'
    if block == 'categoria':
        return 'mantener', 'Categoría renombrada -> categoría actual (legacy_categories.json).'
    if '/productos-promocionales-colombia' in frm:
        return 'pendiente de negocio', 'Ciudad colombiana -> hub Ecuador; si Colombia no se atiende, cambiar a 410.'
    if frm.startswith('/tienda/') and target_path.startswith('/tienda/categoria/'):
        return ('revisar: candidato 410',
                'Producto retirado -> categoría (no equivalente). Mantener mientras no haya export GSC/backlinks; '
                'pasar a 410 si no hay sucesor real.')
    if frm.startswith('/tienda/') and target_path == '/tienda/':
        return 'revisar: candidato 410', 'Producto retirado -> tienda genérica (soft-404 probable).'
    return 'mantener', 'Regla manual revisada.'


rows = []
block = 'manual'
with open(os.path.join(ROOT, 'public', '_redirects'), encoding='utf-8') as f:
    for line in f:
        s = line.strip()
        if s.startswith('# ====='):
            low = s.lower()
            block = ('faceta' if 'facetas' in low else 'categoria' if 'categor' in low and 'históric' in low
                     else 'producto' if 'producto' in low else 'slash' if 'slash' in low
                     else 'host' if 'host' in low else 'manual')
            continue
        if not s or s.startswith('#'):
            continue
        parts = s.split()
        if len(parts) >= 4 and '=' in parts[1]:
            frm, cond, to, status = parts[0], parts[1], parts[2], parts[3]
            frm = f'{frm}?{cond}'
            blk = 'faceta'
        else:
            frm, to = parts[0], parts[1]
            status = parts[2] if len(parts) > 2 else '301'
            blk = block
        if blk == 'producto' and '410' in status:
            pass
        target_path = urlsplit(to).path if to.startswith('http') else to
        key = frm.split('?')[0].rstrip('/') + '/'
        gsc_rows = gsc_by_path.get(key, [])
        motivo = '; '.join(sorted({f"{GSC_NAMES.get(r['reporte'], r['reporte'])} (rastreo {r.get('ultimo_rastreo') or '?'})" for r in gsc_rows})) \
            or 'desconocido (sin export por URL)'
        decision, evidencia = decide(frm, to, status, blk, target_path)
        old = frm.strip('/').split('/')[-1]
        rows.append({
            'origen': frm,
            'destino': to,
            'estado_http': status,
            'bloque': blk,
            'procedencia': manual_section.get(frm, {'producto': 'legacy_slugs.json', 'categoria': 'legacy_categories.json',
                                                    'faceta': 'legacy_category_queries.json', 'slash': 'generador',
                                                    'host': 'site.config.json'}.get(blk, 'manual_redirects.txt')),
            'motivo_gsc_export_previo': motivo,
            'en_sitemap_destino': 'sí' if target_path in sitemap_paths else ('n/a' if status == '410' or ':' in target_path else 'no'),
            'enlaces_internos_al_origen': inbound.get(key, 0),
            'sku_sucesor': by_slug[legacy_slugs[old]]['sku'] if blk == 'producto' and legacy_slugs.get(old) in by_slug else '',
            'decision': decision,
            'evidencia': evidencia,
        })

os.makedirs(REPORTS, exist_ok=True)
out_csv = os.path.join(REPORTS, 'seo-redirect-matrix.csv')
with open(out_csv, 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader()
    w.writerows(rows)

# --- Cohortes de DAS activas (export previo) ---
das_active = [r for r in gsc['registros'] if r['reporte'] == 'DAS' and r['clasificacion'] in ('activa_rastreada_sin_indexar', 'canonica_activa')]
title_counts = Counter(p['seo_title'] for p in products)
coh = []
for r in das_active:
    path = urlsplit(r['url']).path.rstrip('/') + '/'
    seg = path.strip('/').split('/')
    if len(seg) == 2 and seg[0] == 'tienda' and seg[1] in by_slug:
        p = by_slug[seg[1]]
        coh.append({
            'url': path, 'tipo': 'producto', 'categoria': p['categoria_slug'],
            'placeholder': '_placeholder' in p['imagen_url'],
            'desc_len': len(p['descripcion_corta']),
            'nombre_corto': len(p['nombre'].split()) <= 2,
            'ai_generated': bool(p.get('ai_generated')),
            'enlaces_internos': inbound.get(path, 0),
            'host': r.get('host_variant'), 'rastreo': r.get('ultimo_rastreo'),
        })
    else:
        coh.append({'url': path, 'tipo': 'otra', 'categoria': '-', 'placeholder': False, 'desc_len': 0,
                    'nombre_corto': False, 'ai_generated': False, 'enlaces_internos': inbound.get(path, 0),
                    'host': r.get('host_variant'), 'rastreo': r.get('ultimo_rastreo')})

prod = [c for c in coh if c['tipo'] == 'producto']
cat_dist = Counter(c['categoria'] for c in prod)
all_cat = Counter(p['categoria_slug'] for p in products)
lines = [
    '# Cohortes de "Rastreada: actualmente sin indexar" (export previo por URL)',
    '',
    'Fuente: `reports/gsc_audit_report.json` (export anterior; fechas de rastreo propias). **No** es la lista de las 716 URLs',
    'del informe de octubre: esa lista por URL no está disponible. Correlación no implica causa.',
    '',
    f'- URLs activas/canónicas en DAS del export previo: **{len(coh)}** ({len(prod)} productos activos, {len(coh) - len(prod)} otras).',
    f'- Con imagen placeholder: {sum(c["placeholder"] for c in prod)}',
    f'- Nombre de 1–2 palabras (poco descriptivo): {sum(c["nombre_corto"] for c in prod)}',
    f'- Descripción corta < 120 caracteres: {sum(c["desc_len"] < 120 for c in prod)}',
    f'- Generadas por IA (`ai_generated`): {sum(c["ai_generated"] for c in prod)}',
    f'- Host del registro: {dict(Counter(c["host"] for c in coh))}',
    '',
    '| Categoría | URLs DAS (export previo) | Productos en catálogo | % de la categoría |',
    '|---|---:|---:|---:|',
]
for cat, n in cat_dist.most_common():
    lines.append(f'| {cat} | {n} | {all_cat.get(cat, 0)} | {100 * n / max(1, all_cat.get(cat, 1)):.1f} % |')
lines += [
    '',
    '## Muestra estratificada (1 por categoría, hasta 15)',
    '',
    '| URL | Categoría | Placeholder | Nombre corto | Desc. (car.) | Enlaces internos (build actual) | Último rastreo |',
    '|---|---|---|---|---:|---:|---|',
]
seen = set()
for c in prod:
    if c['categoria'] in seen:
        continue
    seen.add(c['categoria'])
    lines.append(f"| {c['url']} | {c['categoria']} | {'sí' if c['placeholder'] else 'no'} | {'sí' if c['nombre_corto'] else 'no'} | "
                 f"{c['desc_len']} | {c['enlaces_internos']} | {c['rastreo']} |")
    if len(seen) >= 15:
        break
lines += [
    '',
    '## Lectura',
    '',
    '- Las fichas de esta cohorte comparten plantilla con el resto del catálogo; antes de esta implementación incluían',
    '  bloques idénticos por categoría (usos/atributos) y promesas de Colombia, ahora retirados.',
    '- Siguiente paso: exportar las 716 URLs actuales por motivo, cruzarlas con esta tabla y priorizar enriquecimiento',
    '  (atributos verificados, nombre descriptivo, imagen real) por tráfico/intención; **no** aplicar noindex masivo.',
]
with open(os.path.join(REPORTS, 'seo-das-cohorts.md'), 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')

dec = Counter(r['decision'] for r in rows)
print(f'{len(rows)} reglas -> {out_csv}')
for k, v in dec.most_common():
    print(f'  {k}: {v}')
print(f'Cohortes DAS: {len(coh)} URLs -> reports/seo-das-cohorts.md')
