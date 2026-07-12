"""
PromoGimmicks — Migración a Neon Postgres
Asigna SKU único a cada producto, genera título/descripción/keywords SEO
nuevos vía la API de Claude (modelo económico), y carga todo a Neon.
Idempotente: si un producto ya existe con contenido generado por IA, se
salta (permite reanudar tras un corte sin re-gastar la API).

Run:  python scripts/migrate_to_neon.py
Deps: pip install psycopg2-binary anthropic
"""

import json
import os
import re
import time
import psycopg2
import psycopg2.extras
from anthropic import Anthropic

ROOT = os.path.join(os.path.dirname(__file__), '..')
PRODUCTS_FILE = os.path.join(ROOT, 'data', 'products.json')
CATEGORIES_FILE = os.path.join(ROOT, 'data', 'categories.json')
BACKUP_FILE = os.path.join(ROOT, 'data', 'products_pre_neon_backup.json')

MODEL = 'claude-haiku-4-5-20251001'
BATCH_SIZE = 15
MAX_RETRIES = 3


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


def already_ai_migrated(conn, legacy_ids):
    """Devuelve el subconjunto de legacy_ids que YA tienen contenido generado por IA en Neon."""
    if not legacy_ids:
        return set()
    with conn.cursor() as cur:
        cur.execute(
            "SELECT legacy_id FROM products WHERE legacy_id = ANY(%s) AND ai_generated = true",
            (list(legacy_ids),),
        )
        return {row[0] for row in cur.fetchall()}


def build_prompt(batch):
    items = [
        {
            'id': p['id'],
            'nombre': p['nombre'],
            'categoria': p['categoria'],
        }
        for p in batch
    ]
    return f"""Eres un copywriter especializado en SEO y conversión para e-commerce de productos promocionales B2B en Ecuador y Colombia (marca: PromoGimmicks).

Para cada producto de la siguiente lista, genera contenido ORIGINAL (no copies descripciones genéricas, cada una debe ser distinta y específica al producto):

{json.dumps(items, ensure_ascii=False, indent=2)}

Para cada producto devuelve:
- "seo_title": título SEO (máx. 60 caracteres), formato "{{Nombre}} Personalizado con Logo | PromoGimmicks"
- "descripcion_corta": 1-2 frases persuasivas y específicas del producto, mencionando personalización con logo corporativo, orientadas a conversión (sin genérico tipo "cotiza este producto")
- "seo_description": meta descripción SEO (máx. 155 caracteres), incluye llamada a la acción y menciona Ecuador y Colombia
- "seo_keywords": 6 a 10 palabras clave separadas por coma, mezclando intención transaccional ("comprar", "personalizado", "con logo") e informacional, relevantes al producto y categoría

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
    print("PromoGimmicks -> Neon Postgres migration")
    print("=" * 60)

    with open(PRODUCTS_FILE, encoding='utf-8') as f:
        products = json.load(f)
    with open(CATEGORIES_FILE, encoding='utf-8') as f:
        categories = json.load(f)

    if not os.path.exists(BACKUP_FILE):
        with open(BACKUP_FILE, 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        print(f"Backup guardado en {BACKUP_FILE}")

    # SKU determinístico y estable según el orden actual del catálogo
    for idx, p in enumerate(products, 1):
        p['sku'] = f"PG-{idx:06d}"

    conn = get_conn()
    slug_to_id = upsert_categories(conn, categories)
    print(f"Categorías sincronizadas: {len(slug_to_id)}")

    ai_count = 0
    fallback_count = 0
    total = len(products)

    for start in range(0, total, BATCH_SIZE):
        batch = products[start:start + BATCH_SIZE]
        legacy_ids = [p['id'] for p in batch]
        done = already_ai_migrated(conn, legacy_ids)
        pending = [p for p in batch if p['id'] not in done]

        print(f"[{start + 1}-{start + len(batch)}/{total}] "
              f"ya migrados: {len(done)}, pendientes: {len(pending)}")

        ai_results = call_claude(pending) if pending else {}

        with conn.cursor() as cur:
            for p in batch:
                if p['id'] in done:
                    ai_count += 1
                    continue

                ai = (ai_results or {}).get(p['id'])
                if ai:
                    seo_title = ai.get('seo_title', p['seo_title'])
                    descripcion_corta = ai.get('descripcion_corta', p['descripcion_corta'])
                    seo_description = ai.get('seo_description', p['seo_description'])
                    seo_keywords = ai.get('seo_keywords', p['seo_keywords'])
                    is_ai = True
                    ai_count += 1
                else:
                    # Fallback: conserva el contenido basado en plantilla ya existente
                    seo_title = p['seo_title']
                    descripcion_corta = p['descripcion_corta']
                    seo_description = p['seo_description']
                    seo_keywords = p['seo_keywords']
                    is_ai = False
                    fallback_count += 1

                p['seo_title'] = seo_title
                p['descripcion_corta'] = descripcion_corta
                p['seo_description'] = seo_description
                p['seo_keywords'] = seo_keywords

                cur.execute(
                    """
                    INSERT INTO products (
                        sku, legacy_id, slug, nombre, category_id,
                        descripcion_corta, seo_title, seo_description, seo_keywords,
                        imagen_url, imagen_original_url, ai_generated, ai_model
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (legacy_id) DO UPDATE SET
                        sku = EXCLUDED.sku,
                        seo_title = EXCLUDED.seo_title,
                        descripcion_corta = EXCLUDED.descripcion_corta,
                        seo_description = EXCLUDED.seo_description,
                        seo_keywords = EXCLUDED.seo_keywords,
                        ai_generated = EXCLUDED.ai_generated,
                        ai_model = EXCLUDED.ai_model,
                        updated_at = now()
                    """,
                    (
                        p['sku'], p['id'], p['slug'], p['nombre'],
                        slug_to_id[p['categoria_slug']],
                        descripcion_corta, seo_title, seo_description, seo_keywords,
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
    print(f"Total productos:        {total}")
    print(f"Contenido IA generado:  {ai_count}")
    print(f"Fallback (plantilla):   {fallback_count}")
    print(f"data/products.json actualizado con SKU + contenido nuevo")
    print("Listo.")


if __name__ == '__main__':
    main()
