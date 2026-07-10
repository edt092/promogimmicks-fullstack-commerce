"""
PromoGimmicks — Crea las categorías Vasos, Termos y Tomatodos/Botilitos
Personalizados (hoy dispersos en Precio Bomba / Hogar / Bar y Vino / EcoNature /
Mugs / Deportes), re-categoriza los productos que correspondan y regenera su
contenido SEO vía Claude para reflejar la nueva categoría.

No modifica migrate_to_neon.py ni corre sobre el resto del catálogo — es un
script acotado, adicional, solo para este subconjunto de productos.

Run:  python scripts/add_vasos_termos_tomatodos.py
Deps: pip install psycopg2-binary anthropic (ya instaladas para migrate_to_neon.py)
"""

import json
import os
import re
import time
from datetime import datetime

import psycopg2
from anthropic import Anthropic

ROOT = os.path.join(os.path.dirname(__file__), '..')
PRODUCTS_FILE = os.path.join(ROOT, 'data', 'products.json')
CATEGORIES_FILE = os.path.join(ROOT, 'data', 'categories.json')

MODEL = 'claude-haiku-4-5-20251001'
BATCH_SIZE = 15
MAX_RETRIES = 3

NEW_CATEGORIES = [
    {
        'id': 'vasos-personalizados',
        'slug': 'vasos-personalizados',
        'name': 'Vasos Personalizados',
        'description': 'Vasos personalizados con tu logo: metálicos, plásticos, de vidrio y ecológicos para regalos corporativos y eventos.',
        'providerUrl': 'https://www.catalogospromocionales.com/promocionales/vasos.html',
        'keywords': ['vasos personalizados', 'vasos publicitarios', 'vasos con logo'],
    },
    {
        'id': 'termos-personalizados',
        'slug': 'termos-personalizados',
        'name': 'Termos Personalizados',
        'description': 'Termos personalizados con tu logo: acero inoxidable y opciones ecológicas para mantener tu marca presente todo el día.',
        'providerUrl': 'https://www.catalogospromocionales.com/promocionales/termos.html',
        'keywords': ['termos personalizados', 'termos publicitarios', 'termos con logo'],
    },
    {
        'id': 'tomatodos-y-botilitos-personalizados',
        'slug': 'tomatodos-y-botilitos-personalizados',
        'name': 'Tomatodos y Botilitos Personalizados',
        'description': 'Tomatodos y botilitos personalizados con tu logo: metálicos, plásticos y ecológicos, ideales para regalos corporativos y deportivos.',
        'providerUrl': 'https://www.catalogospromocionales.com/promocionales/botilitos.html',
        'keywords': ['tomatodos personalizados', 'botilitos personalizados', 'botellas deportivas con logo'],
    },
]

EXCLUDE_PATTERN = re.compile(r'portavasos|posavasos|term[oó]metro', re.IGNORECASE)
BOTILITO_PATTERN = re.compile(r'botilito|tomatodo', re.IGNORECASE)
TERMO_PATTERN = re.compile(r'\btermo\b', re.IGNORECASE)
VASO_PATTERN = re.compile(r'\bvaso\b', re.IGNORECASE)


def load_env():
    env = {}
    with open(os.path.join(ROOT, '.env.local'), encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or '=' not in line:
                continue
            k, v = line.split('=', 1)
            env[k] = v
    return env


ENV = load_env()
DATABASE_URL = ENV['DATABASE_URL']
ANTHROPIC_API_KEY = ENV['ANTHROPIC_API_KEY']
client = Anthropic(api_key=ANTHROPIC_API_KEY)


def get_conn():
    return psycopg2.connect(DATABASE_URL)


def classify(nombre: str):
    if EXCLUDE_PATTERN.search(nombre):
        return None
    if BOTILITO_PATTERN.search(nombre):
        return 'tomatodos-y-botilitos-personalizados'
    if TERMO_PATTERN.search(nombre):
        return 'termos-personalizados'
    if VASO_PATTERN.search(nombre):
        return 'vasos-personalizados'
    return None


def upsert_categories(conn, categories):
    slug_to_id = {}
    with conn.cursor() as cur:
        for c in categories:
            cur.execute(
                """
                INSERT INTO categories (slug, name, description, provider_url, keywords)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (slug) DO UPDATE SET
                    name = EXCLUDED.name,
                    description = EXCLUDED.description,
                    provider_url = EXCLUDED.provider_url,
                    keywords = EXCLUDED.keywords,
                    updated_at = now()
                RETURNING id
                """,
                (c['slug'], c.get('name', c['slug']), c.get('description'),
                 c.get('providerUrl'), c.get('keywords', [])),
            )
            slug_to_id[c['slug']] = cur.fetchone()[0]
    conn.commit()
    return slug_to_id


def build_prompt(batch):
    items = [
        {'id': p['id'], 'nombre': p['nombre'], 'categoria_nueva': p['categoria']}
        for p in batch
    ]
    return f"""Eres un copywriter especializado en SEO y conversión para e-commerce de productos promocionales B2B en Ecuador y Colombia (marca: PromoGimmicks).

Estos productos acaban de ser re-categorizados a una categoría más específica. Genera contenido SEO NUEVO y 100% ORIGINAL para cada uno, que refleje su categoría actualizada (no reutilices frases genéricas de fichas de proveedor ni texto que podría aparecer igual en un sitio hermano del mismo catálogo):

{json.dumps(items, ensure_ascii=False, indent=2)}

Para cada producto devuelve:
- "seo_title": título SEO (máx. 60 caracteres), formato "{{Nombre}} Personalizado con Logo | PromoGimmicks"
- "descripcion_corta": 1-2 frases persuasivas y específicas del producto, mencionando personalización con logo corporativo, orientadas a conversión
- "seo_description": meta descripción SEO (máx. 155 caracteres), incluye llamada a la acción y menciona Ecuador y Colombia
- "seo_keywords": 6 a 10 palabras clave separadas por coma, mezclando intención transaccional ("comprar", "personalizado", "con logo") e informacional, relevantes al producto y a su nueva categoría

Responde ÚNICAMENTE con un array JSON válido (sin texto adicional, sin bloques de código markdown), con esta forma exacta:
[{{"id": "...", "seo_title": "...", "descripcion_corta": "...", "seo_description": "...", "seo_keywords": "..."}}]
"""


def call_claude(batch):
    prompt = build_prompt(batch)
    for attempt in range(MAX_RETRIES):
        try:
            resp = client.messages.create(
                model=MODEL,
                max_tokens=4096,
                messages=[{'role': 'user', 'content': prompt}],
            )
            text = resp.content[0].text.strip()
            text = re.sub(r'^```(json)?|```$', '', text.strip(), flags=re.MULTILINE).strip()
            data = json.loads(text)
            return {item['id']: item for item in data}
        except Exception as e:
            print(f"    [WARN] intento {attempt + 1}/{MAX_RETRIES} falló: {e}")
            time.sleep(2 * (attempt + 1))
    return None


def main():
    print("=" * 60)
    print("PromoGimmicks -> nuevas categorías Vasos/Termos/Tomatodos")
    print("=" * 60)

    with open(PRODUCTS_FILE, encoding='utf-8') as f:
        products = json.load(f)
    with open(CATEGORIES_FILE, encoding='utf-8') as f:
        categories = json.load(f)

    ts = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = os.path.join(ROOT, 'data', f'products_backup_before_new_categories_{ts}.json')
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    print(f"Backup guardado en {backup_path}")

    existing_slugs = {c['slug'] for c in categories}
    added_categories = [c for c in NEW_CATEGORIES if c['slug'] not in existing_slugs]
    categories.extend(added_categories)
    with open(CATEGORIES_FILE, 'w', encoding='utf-8') as f:
        json.dump(categories, f, ensure_ascii=False, indent=2)
    print(f"Categorías nuevas agregadas a categories.json: {[c['slug'] for c in added_categories]}")

    id_to_new_slug = {c['id']: c['slug'] for c in NEW_CATEGORIES}
    id_to_new_name = {c['id']: c['name'] for c in NEW_CATEGORIES}

    to_recat = []
    for p in products:
        new_id = classify(p['nombre'])
        if new_id and p['categoria_slug'] != id_to_new_slug[new_id]:
            p['categoria'] = id_to_new_name[new_id]
            p['categoria_slug'] = id_to_new_slug[new_id]
            to_recat.append(p)

    counts = {}
    for p in to_recat:
        counts[p['categoria_slug']] = counts.get(p['categoria_slug'], 0) + 1
    print(f"Productos re-categorizados: {len(to_recat)} -> {counts}")

    conn = get_conn()
    slug_to_id = upsert_categories(conn, categories)

    ai_count = 0
    fallback_count = 0
    total = len(to_recat)

    for start in range(0, total, BATCH_SIZE):
        batch = to_recat[start:start + BATCH_SIZE]
        print(f"[{start + 1}-{start + len(batch)}/{total}] generando contenido con Claude...")
        ai_results = call_claude(batch) or {}

        with conn.cursor() as cur:
            for p in batch:
                ai = ai_results.get(p['id'])
                if ai:
                    p['seo_title'] = ai.get('seo_title', p['seo_title'])
                    p['descripcion_corta'] = ai.get('descripcion_corta', p['descripcion_corta'])
                    p['seo_description'] = ai.get('seo_description', p['seo_description'])
                    p['seo_keywords'] = ai.get('seo_keywords', p['seo_keywords'])
                    is_ai = True
                    ai_count += 1
                else:
                    is_ai = False
                    fallback_count += 1

                cur.execute(
                    """
                    INSERT INTO products (
                        sku, legacy_id, slug, nombre, category_id,
                        descripcion_corta, seo_title, seo_description, seo_keywords,
                        imagen_url, imagen_original_url, ai_generated, ai_model
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (legacy_id) DO UPDATE SET
                        category_id = EXCLUDED.category_id,
                        seo_title = EXCLUDED.seo_title,
                        descripcion_corta = EXCLUDED.descripcion_corta,
                        seo_description = EXCLUDED.seo_description,
                        seo_keywords = EXCLUDED.seo_keywords,
                        ai_generated = EXCLUDED.ai_generated,
                        ai_model = EXCLUDED.ai_model,
                        updated_at = now()
                    """,
                    (
                        p.get('sku'), p['id'], p['slug'], p['nombre'],
                        slug_to_id[p['categoria_slug']],
                        p['descripcion_corta'], p['seo_title'], p['seo_description'], p['seo_keywords'],
                        p['imagen_url'], p['imagen_original_url'],
                        is_ai, MODEL if is_ai else None,
                    ),
                )
        conn.commit()
        time.sleep(0.4)

    conn.close()

    with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 60)
    print(f"Total re-categorizados: {total}")
    print(f"Contenido IA generado:  {ai_count}")
    print(f"Fallback (sin cambio):  {fallback_count}")
    print("Ejemplos de copy generado:")
    for p in to_recat[:3]:
        print(f"  - [{p['categoria']}] {p['nombre']}")
        print(f"    seo_title: {p['seo_title']}")
        print(f"    descripcion_corta: {p['descripcion_corta']}")
    print("\ndata/products.json y data/categories.json actualizados. Listo.")


if __name__ == '__main__':
    main()
