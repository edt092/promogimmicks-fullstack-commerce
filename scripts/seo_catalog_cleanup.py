"""
Limpieza SEO determinista e idempotente de data/products.json.

Solo corrige datos derivables o afirmaciones no respaldadas; NUNCA inventa
precios, mínimos, stock, materiales ni plazos. NUNCA cambia slug, id ni sku.

Reglas (ver reports/seo-implementation-log.md):
  1. categoria: si es el slug crudo (o no coincide con categories.json) -> nombre
     legible de data/categories.json.
  2. nombre: quita sufijos promocionales del proveedor ("OFERTA", "- OFERTA") y
     normaliza nombres en MAYÚSCULAS a formato título. El nombre original se
     conserva en `nombre_proveedor` (evidencia del proveedor).
  3. Cobertura Colombia: el sitio redirige sus páginas de Colombia a Ecuador
     (2026). Se eliminan compromisos de envío/venta en Colombia de
     seo_description, descripcion_corta, seo_title y seo_keywords.
  4. Afirmaciones sin evidencia por modelo en seo_description: "Mínimo N
     unidades", "Distribuidor oficial", "entrega/envío rápido", "inmediata".
  5. seo_title duplicados: se regeneran como "{nombre} Personalizado con Logo |
     PromoGimmicks"; si el nombre también colisiona, se añade la referencia del
     proveedor (id de imagen o referencia_proveedor).

Uso:
  python scripts/seo_catalog_cleanup.py            # aplica y escribe el log
  python scripts/seo_catalog_cleanup.py --dry-run  # solo muestra el resumen
"""
import json
import os
import re
import sys
from collections import Counter, defaultdict

ROOT = os.path.join(os.path.dirname(__file__), '..')
PRODUCTS = os.path.join(ROOT, 'data', 'products.json')
CATEGORIES = os.path.join(ROOT, 'data', 'categories.json')
LOG = os.path.join(ROOT, 'reports', 'seo-catalog-cleanup-changes.json')

# Nombres corregidos a mano: el nombre del proveedor no describe el producto.
# Fuente: seo_title/descripcion del mismo registro (no se añade información nueva).
NAME_OVERRIDES = {
    'boligrafo-metalico-personalizado-logo-ecuador': 'Bolígrafo Metálico Skil',
    'skil-oferta-8592': 'Bolígrafo Skil',
    'morral-backpack-personalizado-logo-ecuador': 'Morral Backpack Padrax',
}

# Tokens que se mantienen en mayúsculas al pasar a formato título.
KEEP_UPPER = {'USB', 'UV', 'UVC', 'LED', 'RPET', 'PET', 'PETG', 'ABS', 'PVC', 'BPA', 'ML', 'VA',
              'GB', 'XL', 'XXL', 'II', 'III', 'IV', 'RFID', 'TWS', 'BT', 'HD', 'PP', 'PU', 'EVA', 'A4', 'A5'}
LOWER_WORDS = {'de', 'del', 'la', 'el', 'en', 'con', 'y', 'para', 'por', 'a', 'los', 'las', 'sin', 'e', 'o'}

ACCENT_FIXES = {
    'boligrafo': 'bolígrafo', 'boligrafos': 'bolígrafos', 'plastico': 'plástico', 'metalico': 'metálico',
    'lapiz': 'lápiz', 'inalambrico': 'inalámbrico', 'lampara': 'lámpara', 'maletin': 'maletín',
    'termico': 'térmico', 'electrico': 'eléctrico', 'antiestres': 'antiestrés', 'bateria': 'batería',
}

OFERTA_RE = re.compile(r'\s*[-–]?\s*\boferta\b\s*$', re.IGNORECASE)

COLOMBIA_RE = re.compile(r'colombia|bogot[aá]|medell[ií]n|\bcali\b|barranquilla|cartagena', re.IGNORECASE)

# Sustituciones de frases (orden importa). Se aplican a textos descriptivos.
PHRASE_SUBS = [
    (re.compile(r'\b(Quito|Guayaquil)(, (Quito|Guayaquil|Cuenca))*,? (Bogot[aá]|Medell[ií]n)( y (Bogot[aá]|Medell[ií]n|Cali))?', re.I),
     'Quito, Guayaquil y todo Ecuador'),
    (re.compile(r'\bEcuador,? y Colombia\b', re.I), 'Ecuador'),
    (re.compile(r'\bColombia y Ecuador\b', re.I), 'Ecuador'),
    (re.compile(r'\bEcuador/Colombia\b', re.I), 'Ecuador'),
    (re.compile(r'\bDistribuidor oficial\b', re.I), 'Distribuidor'),
    (re.compile(r'\s*M[ií]nimo (de )?\d+ unidades\.?', re.I), ''),
    (re.compile(r'\s*M[ií]nimo de unidades accesible\.?', re.I), ''),
    # Se conserva el sustantivo y se elimina solo el adjetivo no respaldado.
    (re.compile(r'\b(env[ií]os?|entregas?) r[aá]pid[oa]s?\b', re.I), r'\1'),
    (re.compile(r'\b(env[ií]os?|entregas?|disponibilidad|despachos?) inmediat[oa]s?\b', re.I), r'\1'),
]


def smart_title(name):
    words = name.split()
    out = []
    for i, w in enumerate(words):
        bare = re.sub(r'[^\wÁÉÍÓÚÑÜáéíóúñü]', '', w)
        if not bare:
            out.append(w)
            continue
        up = bare.upper()
        if up in KEEP_UPPER or any(ch.isdigit() for ch in bare):
            # códigos de modelo (ML-386, 600ML, 2-1): mantener, normalizando unidades
            w2 = re.sub(r'(\d)ML\b', r'\1ml', w)
            w2 = re.sub(r'(\d)CM\b', r'\1cm', w2)
            out.append(w2)
            continue
        low = w.lower()
        key = re.sub(r'[^\wáéíóúñü]', '', low)
        if key in ACCENT_FIXES:
            low = low.replace(key, ACCENT_FIXES[key])
        if i > 0 and key in LOWER_WORDS:
            out.append(low)
        else:
            out.append(low[:1].upper() + low[1:])
    return ' '.join(out)


def fix_accents(name):
    def rep(m):
        w = m.group(0)
        fixed = ACCENT_FIXES.get(w.lower())
        if not fixed:
            return w
        return fixed[:1].upper() + fixed[1:] if w[:1].isupper() else fixed
    return re.sub(r'[A-Za-zÁÉÍÓÚÑáéíóúñ]+', rep, name)


def clean_name(p):
    original = p.get('nombre_proveedor') or p['nombre']
    if p['slug'] in NAME_OVERRIDES:
        return NAME_OVERRIDES[p['slug']], original
    name = p['nombre'].strip()
    new = OFERTA_RE.sub('', name).strip(' -–')
    letters = [c for c in new if c.isalpha()]
    if letters and all(c.isupper() for c in letters):
        new = smart_title(new)
    return fix_accents(new), original


# 6. Origen de fabricación no verificado: la etiqueta "Producción Nacional" viene del
#    catálogo del proveedor (posiblemente colombiano). No se afirma "hecho en Ecuador".
ORIGIN_SUBS = [
    (re.compile(r'[^.!?]*(colombo-ecuatorian|productor local ecuatoriano|calidad certificada|industria local|'
                r'industria nacional ecuatoriana|productos ecuatorianos)[^.!?]*[.!?]?\s*', re.I), ''),
    (re.compile(r'fabricad[oa]s? localmente', re.I), 'de la línea Producción Nacional'),
    (re.compile(r'de (fabricaci[oó]n|producci[oó]n) local', re.I), 'de la línea Producción Nacional'),
    (re.compile(r'\b(fabricaci[oó]n|producci[oó]n) local( (en|para) Ecuador| Ecuador)?', re.I), 'línea Producción Nacional'),
    (re.compile(r'fabricad[oa]s? localmente con orgullo ecuatoriano', re.I), 'de la línea Producción Nacional'),
    (re.compile(r'(fabricad[oa]s?|hech[oa]s?) en Ecuador', re.I), 'de la línea Producción Nacional'),
    (re.compile(r'de manufactura ecuatoriana', re.I), 'de la línea Producción Nacional'),
    (re.compile(r'de producción (nacional )?ecuatoriana', re.I), 'de la línea Producción Nacional'),
    (re.compile(r'producción (nacional )?ecuatoriana', re.I), 'línea Producción Nacional'),
]


COMMERCE_COLOMBIA_RE = re.compile(r'\b((?:Compra|Cotiza|Env[ií]os?|Entregas?|Distribu\w*)[^.]*?) en Colombia\b', re.I)


def clean_text(text, product_is_colombian=False):
    """product_is_colombian: el nombre del producto contiene "Colombia" (p. ej. Vuvuzela
    Colombia). En ese caso las menciones descriptivas se conservan y solo se retiran
    los compromisos comerciales de venta/envío en Colombia."""
    if not text:
        return text
    new = text
    for rx, rep in PHRASE_SUBS:
        new = rx.sub(rep, new)
    for rx, rep in ORIGIN_SUBS:
        new = rx.sub(rep, new)
    new = re.sub(r'(^|[.!?]\s+)línea Producción', lambda m: m.group(1) + 'Línea Producción', new)
    if product_is_colombian:
        new = COMMERCE_COLOMBIA_RE.sub(r'\1 en Ecuador', new)
    # Frases que aún mencionan Colombia: eliminar la oración completa.
    elif COLOMBIA_RE.search(new):
        sentences = re.split(r'(?<=[.!?])\s+', new)
        sentences = [s for s in sentences if not COLOMBIA_RE.search(s)]
        new = ' '.join(sentences)
    new = re.sub(r'\s{2,}', ' ', new).strip()
    new = re.sub(r'\s+([.,;!?])', r'\1', new)
    new = re.sub(r'\.{2,}', '.', new)
    return new


def clean_keywords(kw):
    if not kw:
        return kw
    items = [k.strip() for k in kw.split(',')]
    items = [k for k in items if k and not COLOMBIA_RE.search(k)]
    seen, out = set(), []
    for k in items:
        if k.lower() not in seen:
            seen.add(k.lower())
            out.append(k)
    return ', '.join(out)


def supplier_ref(p):
    if p.get('referencia_proveedor'):
        return p['referencia_proveedor']
    m = re.search(r'/productos/(\d+)\.', p.get('imagen_original_url') or '')
    return m.group(1) if m else p['sku']


def main():
    dry = '--dry-run' in sys.argv
    with open(PRODUCTS, encoding='utf-8') as f:
        products = json.load(f)
    with open(CATEGORIES, encoding='utf-8') as f:
        cat_names = {c['slug']: c['name'] for c in json.load(f)}

    changes = defaultdict(list)
    counts = Counter()

    def record(p, field, old, new):
        if old != new:
            changes[p['slug']].append({'campo': field, 'antes': old, 'despues': new})
            counts[field] += 1

    for p in products:
        # 1. categoría legible
        proper = cat_names.get(p['categoria_slug'])
        if proper and p['categoria'] != proper:
            record(p, 'categoria', p['categoria'], proper)
            p['categoria'] = proper

        # 2. nombre
        new_name, original = clean_name(p)
        if new_name != p['nombre']:
            record(p, 'nombre', p['nombre'], new_name)
            if 'nombre_proveedor' not in p:
                p['nombre_proveedor'] = original
            p['nombre'] = new_name

        # 3-4. textos
        colombian = bool(COLOMBIA_RE.search(p['nombre']))
        for field in ('seo_description', 'descripcion_corta', 'seo_title'):
            new = clean_text(p.get(field), colombian)
            if new != p.get(field):
                record(p, field, p.get(field), new)
                p[field] = new
        new_kw = p.get('seo_keywords') if colombian else clean_keywords(p.get('seo_keywords'))
        if new_kw != p.get('seo_keywords'):
            record(p, 'seo_keywords', p.get('seo_keywords'), new_kw)
            p['seo_keywords'] = new_kw

    # 5. títulos duplicados
    by_title = defaultdict(list)
    for p in products:
        by_title[p['seo_title'].strip().lower()].append(p)
    name_counts = Counter(p['nombre'].strip().lower() for p in products)
    for group in by_title.values():
        if len(group) < 2:
            continue
        for p in group:
            base = f"{p['nombre']} Personalizado con Logo"
            if name_counts[p['nombre'].strip().lower()] > 1:
                base = f"{p['nombre']} (Ref. {supplier_ref(p)}) Personalizado con Logo"
            new = f'{base} | PromoGimmicks'
            record(p, 'seo_title', p['seo_title'], new)
            p['seo_title'] = new

    remaining_dupes = [t for t, c in Counter(p['seo_title'].lower() for p in products).items() if c > 1]
    remaining_col = sum(1 for p in products for k in ('seo_description', 'descripcion_corta', 'seo_title', 'seo_keywords')
                        if COLOMBIA_RE.search(p.get(k) or '') and not COLOMBIA_RE.search(p['nombre']))

    print(f'Productos: {len(products)} | con cambios: {len(changes)}')
    for field, n in counts.most_common():
        print(f'  {field}: {n}')
    print(f'Títulos duplicados restantes: {len(remaining_dupes)}')
    print(f'Menciones de Colombia restantes: {remaining_col}')

    if dry:
        return
    with open(PRODUCTS, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
        f.write('\n')
    os.makedirs(os.path.dirname(LOG), exist_ok=True)
    # El registro se acumula entre ejecuciones (cada ejecución solo ve sus propios cambios).
    log = {'resumen': {}, 'productos': {}}
    if os.path.exists(LOG):
        with open(LOG, encoding='utf-8') as f:
            log = json.load(f)
    for field, n in counts.items():
        log['resumen'][field] = log['resumen'].get(field, 0) + n
    for slug, items in changes.items():
        log['productos'].setdefault(slug, []).extend(items)
    with open(LOG, 'w', encoding='utf-8') as f:
        json.dump(log, f, ensure_ascii=False, indent=1)
    print(f'Escrito {PRODUCTS} y {LOG}')


if __name__ == '__main__':
    main()
