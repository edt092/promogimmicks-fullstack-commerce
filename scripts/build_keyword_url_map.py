"""
Genera reports/seo-keyword-url-map.csv a partir de los CSV de Search Console
(solo lectura) y del catálogo actual.

Las asociaciones consulta -> URL son PROPUESTAS por reglas de intención, no
observaciones: los CSV no incluyen el cruce consulta x página.

Uso:
  python scripts/build_keyword_url_map.py "<carpeta analisi_10-10-2026>"
"""
import csv
import json
import os
import sys
import unicodedata

ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT = os.path.join(ROOT, 'reports', 'seo-keyword-url-map.csv')


def norm(text):
    text = unicodedata.normalize('NFD', text.lower())
    return ''.join(c for c in text if unicodedata.category(c) != 'Mn')


with open(os.path.join(ROOT, 'data', 'products.json'), encoding='utf-8') as f:
    PRODUCTS = json.load(f)
CAT_COUNTS = {}
for p in PRODUCTS:
    CAT_COUNTS[p['categoria_slug']] = CAT_COUNTS.get(p['categoria_slug'], 0) + 1

CITY = {'quito': 'quito', 'guayaquil': 'guayaquil', 'cuenca': 'cuenca', 'manta': 'manta'}

# (patrón normalizado, cluster, intención, categoría destino | None, nota/dependencia)
CATEGORY_RULES = [
    ('llaver', 'llaveros', 'comercial-producto', 'llaveros', 'Necesita relevancia/contenido; posiciones lejanas.'),
    ('gorra', 'gorras', 'comercial-producto', 'gorras', 'Solo 3 productos: no crear subcategorías.'),
    ('paragua', 'paraguas', 'comercial-producto', 'paraguas', 'Oportunidad: posición cercana a página 1.'),
    ('sombrilla', 'paraguas', 'comercial-producto', 'paraguas', ''),
    ('mug', 'mugs', 'comercial-producto', 'mugs', ''),
    ('taza', 'mugs', 'comercial-producto', 'mugs', ''),
    ('termo', 'termos', 'comercial-producto', 'termos-personalizados', ''),
    ('botella', 'tomatodos', 'comercial-producto', 'tomatodos-y-botilitos-personalizados', ''),
    ('tomatodo', 'tomatodos', 'comercial-producto', 'tomatodos-y-botilitos-personalizados', ''),
    ('botilito', 'tomatodos', 'comercial-producto', 'tomatodos-y-botilitos-personalizados', ''),
    ('vaso', 'vasos', 'comercial-producto', 'vasos-personalizados', ''),
    ('antiestres', 'antiestres', 'comercial-producto', 'antiestres', ''),
    ('antistress', 'antiestres', 'comercial-producto', 'antiestres', ''),
    ('boligrafo', 'escritura', 'comercial-producto', 'articulos-escritura', ''),
    ('esfero', 'escritura', 'comercial-producto', 'articulos-escritura', ''),
    ('oficina', 'oficina', 'comercial-producto', 'oficina', ''),
    ('automotr', 'automovil', 'comercial-producto', 'automovil', ''),
    ('auto', 'automovil', 'comercial-producto', 'automovil', ''),
    ('nino', 'infantil', 'comercial-producto', 'infantil', ''),
    ('vino', 'bar-y-vino', 'comercial-producto (verificar oferta)', 'bar-y-vino', 'El catálogo tiene accesorios de vino; NO prueba venta de bebidas alcohólicas.'),
    ('licor', 'bar-y-vino', 'comercial-producto (verificar oferta)', 'bar-y-vino', 'Confirmar si se ofrecen bebidas o solo accesorios/sets.'),
    ('sostenible', 'ecologia', 'comercial-producto', 'ecologia', 'Requiere atributos/evidencia ambiental por producto.'),
    ('zero waste', 'ecologia', 'comercial-producto', 'ecologia', 'Requiere atributos/evidencia ambiental por producto.'),
    ('ecologic', 'ecologia', 'comercial-producto', 'ecologia', 'Requiere atributos/evidencia ambiental por producto.'),
    ('tecnolog', 'tecnologia', 'comercial-producto', 'tecnologia', ''),
    ('usb', 'tecnologia', 'comercial-producto', 'memorias-usb', ''),
    ('mochila', 'maletines', 'comercial-producto', 'maletines', ''),
    ('morral', 'maletines', 'comercial-producto', 'maletines', ''),
    ('abanico', 'variedades', 'comercial-producto', None, 'Producto concreto (abanico en madera); sin categoría propia.'),
]
GENERIC = ['articulos promocionales', 'promocionales', 'articulos publicitarios', 'productos personalizados',
           'material publicitario', 'regalos corporativos', 'merchandising', 'productos promocionales',
           'regalos empresariales', 'proveedor de merchandising', 'publicidad']
BRAND = ['gimmick', 'promogimmicks']


def classify(query):
    q = norm(query)
    city = next((c for c in CITY if c in q), None)
    for pat, cluster, intent, cat, note in CATEGORY_RULES:
        if pat in q:
            url = f'/tienda/categoria/{cat}/' if cat else ''
            inv = f'{CAT_COUNTS.get(cat, 0)} productos en {cat}' if cat else 'sin categoría dedicada'
            prop = 'Mejorar categoría existente (intro, criterios de elección, FAQ visible).'
            if city:
                prop += f' Enlazar desde la página de {city.title()}.'
            return cluster, intent + (f' + local ({city})' if city else ''), url, prop, inv, note
    if any(b in q for b in BRAND):
        return 'marca', 'navegacional-marca', '/', 'Mantener homepage como destino de marca.', f'{len(PRODUCTS)} productos', ''
    if any(g in q for g in GENERIC):
        if city:
            return (f'generico-{city}', 'comercial-local', f'/productos-promocionales-ecuador/{city}/',
                    'Página de ciudad: servicio real, proceso de cotización/entrega y categorías pertinentes.',
                    f'{len(PRODUCTS)} productos', 'No inventar sucursal, clientes ni plazos.')
        return ('generico-nacional', 'comercial-nacional', '/',
                'Homepage: H1/título con "artículos promocionales ... Ecuador" (variantes con/sin tilde = una sola página).',
                f'{len(PRODUCTS)} productos', '')
    if city:
        return (f'local-{city}', 'comercial-local', f'/productos-promocionales-ecuador/{city}/', 'Revisar intención manualmente.', '', '')
    return 'sin-clasificar', 'desconocida', '', 'Sin destino claro: revisar o descartar.', '', ''


def priority(impr, pos):
    if impr >= 50 and pos <= 20:
        return 'P1', 'media'
    if impr >= 50:
        return 'P1', 'baja'
    if impr >= 10 and pos <= 15:
        return 'P2', 'media'
    if impr >= 10:
        return 'P2', 'baja'
    return 'P3', 'baja'


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    src = sys.argv[1]
    rows = []
    for seg, folder in (('Ecuador', 'rendimiento-ecuador-3-meses'), ('General', 'rendimiento-general-3meses')):
        with open(os.path.join(src, folder, 'Consultas.csv'), encoding='utf-8-sig') as f:
            for r in csv.DictReader(f):
                q = r['Consultas principales']
                clicks, impr = int(r['Clics']), int(r['Impresiones'])
                pos = float(r['Posición'])
                cluster, intent, url, prop, inv, note = classify(q)
                prio, conf = priority(impr, pos)
                rows.append({
                    'cluster': cluster, 'consulta': q, 'segmento_pais': seg, 'clics': clicks,
                    'impresiones': impr, 'posicion': pos, 'intencion': intent,
                    'url_objetivo_existente': url, 'propuesta': prop, 'evidencia_inventario': inv,
                    'dependencia': note, 'prioridad': prio, 'confianza': conf,
                    'tipo_asociacion': 'propuesta por reglas (sin cruce consulta x página)',
                })
    rows.sort(key=lambda r: (r['segmento_pais'] != 'Ecuador', -r['impresiones']))
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8-sig', newline='') as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    by = {}
    for r in rows:
        if r['segmento_pais'] == 'Ecuador':
            by.setdefault(r['cluster'], [0, 0])
            by[r['cluster']][0] += r['impresiones']
            by[r['cluster']][1] += r['clics']
    print(f'{len(rows)} filas -> {OUT}')
    for k, (i, c) in sorted(by.items(), key=lambda x: -x[1][0])[:15]:
        print(f'  Ecuador {k}: {i} impresiones, {c} clics')


if __name__ == '__main__':
    main()
