"""
PromoGimmicks — Daily Product Scraper
Scrapes catalogospromocionales.com using categories from data/categories.json,
merges new products into data/products.json (dedup by imagen_original_url).

Run:  python scripts/daily-scraper.py
Deps: pip install requests beautifulsoup4 lxml
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
import os
from urllib.parse import urljoin
from collections import Counter

# ── Config ────────────────────────────────────────────────────────────────────
BASE_URL  = "https://www.catalogospromocionales.com"
DELAY     = 1.5   # seconds between requests
MAX_PAGES = 50    # safety cap

ROOT            = os.path.join(os.path.dirname(__file__), '..')
PRODUCTS_FILE   = os.path.join(ROOT, 'data', 'products.json')
CATEGORIES_FILE = os.path.join(ROOT, 'data', 'categories.json')

SESSION = requests.Session()
SESSION.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'es-EC,es;q=0.9',
})


# ── Helpers ───────────────────────────────────────────────────────────────────

def slugify(text):
    text = text.lower().strip()
    for src, dst in [('á','a'),('é','e'),('í','i'),('ó','o'),('ú','u'),('ñ','n'),('ü','u')]:
        text = text.replace(src, dst)
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')


def get_page(url, retries=3):
    for attempt in range(retries):
        try:
            r = SESSION.get(url, timeout=20)
            r.raise_for_status()
            return r.text
        except Exception as e:
            if attempt == retries - 1:
                print(f"  [ERROR] {url}: {e}")
                return None
            time.sleep(3)
    return None


def title_case(text):
    return ' '.join(
        w.capitalize() if len(w) > 2 else w.lower()
        for w in text.split()
    )


def normalise_img(src):
    """Resolve protocol-relative and relative URLs to absolute https://."""
    url = urljoin(BASE_URL, src)
    return ('https:' + url) if url.startswith('//') else url


def clean_product_name(raw):
    """Strip '[Más]', 'PRECIO BOMBA' suffix, and extra whitespace."""
    name = re.sub(r'\[.*?\]', '', raw)
    name = re.sub(r'\s*-?\s*PRECIO BOMBA\s*', '', name, flags=re.I)
    return re.sub(r'\s+', ' ', name).strip()


def extract_prod_id(img_url):
    """Extract the numeric product ID from the image URL."""
    m = re.search(r'/productos[-s]*/(\d+)', img_url)
    return m.group(1) if m else None


# Category-specific attributes used to enrich product descriptions
CATEGORY_ATTRS = {
    'boligrafos':            ('de escritura suave y tinta de larga duración', 'empresas, oficinas y eventos corporativos'),
    'lapices':               ('ecológico y ergonómico', 'colegios, universidades y ferias'),
    'libretas':              ('con pasta dura y hojas de alta gramaje', 'ejecutivos, estudiantes y profesionales'),
    'maletines-y-morrales':  ('resistente al agua con compartimentos organizadores', 'viajes de negocios y uso diario'),
    'botilitos':             ('de materiales libres de BPA, apto para alimentos', 'deportistas, oficinas y eventos'),
    'mugs-termos':           ('de cerámica/acero inoxidable con doble pared', 'oficinas, regalos corporativos y hogares'),
    'tecnologia':            ('compatible con los principales dispositivos', 'startups, agencias y eventos tech'),
    'paraguas':              ('con estructura reforzada y tela repelente al agua', 'temporada de lluvias y ferias al aire libre'),
    'llaveros':              ('fabricado en metal/PVC de alta resistencia', 'congresos, lanzamientos y fidelización de clientes'),
    'gorras':                ('en tela transpirable con ajuste universal', 'eventos deportivos, ferias y activaciones de marca'),
    'bolsas':                ('fabricada en material eco-friendly', 'supermercados, ferias y campañas de sostenibilidad'),
    'neveras-loncheras':     ('con aislamiento térmico de alta eficiencia', 'picnics, eventos deportivos y regalos ejecutivos'),
    'herramientas':          ('de acero inoxidable con estuche protector', 'obras, técnicos y regalos funcionales'),
    'relojes':               ('con mecanismo de precisión y acabado premium', 'obsequios ejecutivos y reconocimientos empresariales'),
    'pastilleros':           ('compacto y fácil de limpiar, fabricado en ABS', 'farmacias, centros médicos y adultos mayores'),
    'espejo':                ('con acabado espejado de alta definición', 'salones de belleza, ferias y regalos personalizados'),
    'speaker-bluetooth':     ('con batería de larga duración y sonido 360°', 'eventos, marketing digital y regalos premium'),
    'audifonos-bluetooth':   ('con cancelación de ruido y autonomía extendida', 'oficinas, viajes y activaciones de marca'),
}

def get_category_context(cat_id):
    """Return (atributo, uso) tuple for a category, with generic fallback."""
    for key, val in CATEGORY_ATTRS.items():
        if key in cat_id:
            return val
    return ('personalizable con logo y texto', 'empresas, eventos y campañas de marketing')


def build_product(raw_name, img_original_url, cat_id, cat_name):
    """Build a product dict in the promogimmicks format."""
    clean_name  = title_case(clean_product_name(raw_name))
    name_slug   = slugify(clean_name)
    prod_id     = extract_prod_id(img_original_url)

    # Slug must be globally unique — append numeric image ID when available
    slug = f"{name_slug}-{prod_id}" if prod_id else name_slug
    uid  = slug

    local_img = f"/img/productos/{slug}.jpg"

    attr, uso = get_category_context(cat_id)
    name_lower = clean_name.lower()
    idx = int(prod_id) % 5 if prod_id and prod_id.isdigit() else 0

    # Five richer template variants using category-specific attributes
    desc_templates = [
        f"{clean_name} personalizado con tu logo: {attr}. Ideal para {uso}. Cotiza con PromoGimmicks en Ecuador y Colombia.",
        f"Imprime tu marca en este {name_lower} ({attr}). Perfecto para {uso}. Envíos a todo Ecuador y Colombia.",
        f"Destaca en ferias y eventos con el {name_lower} personalizado. {attr.capitalize()}, orientado a {uso}.",
        f"El {name_lower} es un artículo promocional {attr} muy buscado por {uso}. Personalízalo con tu logo.",
        f"Regala el {name_lower} con tu logo corporativo. {attr.capitalize()}. Pensado para {uso} en Ecuador y Colombia.",
    ]
    descripcion = desc_templates[idx]

    seo_title = f"{clean_name} Personalizado con Logo | PromoGimmicks Ecuador"
    seo_desc  = f"{descripcion} Mínimo de unidades accesible. Envíos desde Quito y Guayaquil a todo Ecuador y Colombia."
    seo_kw = (
        f"{name_lower}, {name_lower} personalizado, {name_lower} con logo, "
        f"{name_lower} ecuador, {name_lower} bogota, {cat_id} personalizado, "
        f"regalo corporativo ecuador, merchandising quito, productos promocionales guayaquil, "
        f"artículos publicitarios colombia, promogimmicks"
    )

    return {
        'id':                  uid,
        'nombre':              clean_name,
        'slug':                slug,
        'categoria':           cat_name,
        'categoria_slug':      cat_id,
        'descripcion_corta':   descripcion,
        'imagen_url':          local_img,
        'imagen_original_url': img_original_url,
        'codigo':              None,
        'seo_title':           seo_title,
        'seo_description':     seo_desc,
        'seo_keywords':        seo_kw,
    }


# ── Pagination helper ─────────────────────────────────────────────────────────

def find_next_page_url(soup, current_page):
    next_page_num = str(current_page + 1)

    page_links = soup.find_all('a', href=re.compile(r'[Pp]age=\d+'))
    for link in page_links:
        href = link.get('href', '')
        m = re.search(r'[Pp]age=(\d+)', href)
        if m and m.group(1) == next_page_num:
            return urljoin(BASE_URL, href)

    next_link = soup.find('a', string=re.compile(r'siguiente|next|[›»>]', re.I))
    if next_link and next_link.get('href'):
        return urljoin(BASE_URL, next_link['href'])

    return None


# ── Scraping ──────────────────────────────────────────────────────────────────

def scrape_category(cat_id, cat_name, cat_url):
    """Scrape all products from a category URL, following pagination."""
    products  = []
    seen_imgs = set()
    current_url = cat_url
    page = 1

    while page <= MAX_PAGES:
        html = get_page(current_url)
        if not html:
            break

        soup = BeautifulSoup(html, 'lxml')
        found_on_page = 0

        # ── Primary: #backTable → div.itemProducto- ───────────────────────────
        # This is the real product grid on catalogospromocionales.com.
        # The old wrapProdWhite selector hit the sidebar widget which shows the
        # same generic products on every page — causing wrong category assignments.
        back_table = soup.find(id='backTable')
        items = back_table.find_all('div', class_='itemProducto-') if back_table else []

        if items:
            for item in items:
                link = item.find('a', class_='img-producto')
                if not link:
                    continue
                img = link.find('img')
                if not img:
                    continue
                img_src = img.get('src') or img.get('data-src', '')
                if not img_src:
                    continue
                img_url = normalise_img(img_src)
                if img_url in seen_imgs:
                    continue

                # Name: img alt is cleanest; fall back to h3
                name = clean_product_name(img.get('alt', '').strip())
                if not name or len(name) < 3:
                    h3 = item.find('h3')
                    name = clean_product_name(h3.get_text(strip=True)) if h3 else ''
                if not name or len(name) < 3:
                    continue

                seen_imgs.add(img_url)
                products.append(build_product(name, img_url, cat_id, cat_name))
                found_on_page += 1

        else:
            # Fallback: full-size product images only (/productos/, not /productos-s/)
            for img in soup.find_all('img', src=re.compile(r'/images/productos/\d+', re.I)):
                img_url = normalise_img(img['src'])
                if img_url in seen_imgs:
                    continue
                name = clean_product_name(img.get('alt', '').strip())
                if not name or len(name) < 3:
                    parent = img.find_parent(['a', 'div', 'li'])
                    if parent:
                        h3 = parent.find(['h3', 'h4', 'h2', 'strong', 'b'])
                        if h3:
                            name = clean_product_name(h3.get_text(strip=True))
                if name and len(name) >= 3:
                    seen_imgs.add(img_url)
                    products.append(build_product(name, img_url, cat_id, cat_name))
                    found_on_page += 1

        print(f"    page {page}: {found_on_page} products")

        if found_on_page == 0:
            break

        next_url = find_next_page_url(soup, page)
        if not next_url:
            break

        current_url = next_url
        page += 1
        time.sleep(DELAY)

    return products


# ── Merge & Save ─────────────────────────────────────────────────────────────

def merge_products(existing, new_products, force_category=False):
    """
    Merge new_products into existing list, deduplicating by imagen_original_url.

    IMPORTANT: slugs of existing products are NEVER changed. Changing slugs
    breaks URLs that Google has already indexed, causing mass 404s and de-indexing.
    When force_category=True, only categoria_slug and categoria are updated — slug
    is always preserved so existing URLs remain valid.
    """
    # Build lookup: imagen_original_url → index in existing
    img_to_idx = {}
    for idx, p in enumerate(existing):
        url = p.get('imagen_original_url')
        if url:
            img_to_idx[url] = idx

    # Also track slugs to prevent duplicates in new additions
    existing_slugs = {p.get('slug') for p in existing if p.get('slug')}

    added      = 0
    reassigned = 0

    for p in new_products:
        img  = p.get('imagen_original_url')
        slug = p.get('slug')
        if not img:
            continue

        if img in img_to_idx:
            if force_category:
                ep = existing[img_to_idx[img]]
                if ep.get('categoria_slug') != p.get('categoria_slug'):
                    # Only update category metadata — NEVER change slug/id/url
                    ep['categoria_slug'] = p['categoria_slug']
                    ep['categoria']      = p['categoria']
                    reassigned += 1
        else:
            if slug in existing_slugs:
                continue  # slug collision — skip to avoid broken static routes
            existing.append(p)
            img_to_idx[img] = len(existing) - 1
            existing_slugs.add(slug)
            added += 1

    if reassigned:
        print(f"  Reassigned category for {reassigned} existing products")
    return existing, added


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("PromoGimmicks — Daily Scraper")
    print("=" * 60)

    with open(PRODUCTS_FILE, encoding='utf-8') as f:
        existing_products = json.load(f)
    with open(CATEGORIES_FILE, encoding='utf-8') as f:
        categories = json.load(f)

    print(f"Existing products: {len(existing_products)}")
    print(f"Categories to scrape: {len(categories)}")

    all_new = []
    for idx, cat in enumerate(categories, 1):
        cat_id   = cat.get('id') or cat.get('slug', '')
        cat_name = cat.get('name') or cat.get('nombre', cat_id)
        cat_url  = cat.get('providerUrl', '')

        if not cat_url or not cat_id:
            print(f"\n[{idx}/{len(categories)}] SKIP — missing id or providerUrl")
            continue

        print(f"\n[{idx}/{len(categories)}] {cat_name} ({cat_id})")
        print(f"  URL: {cat_url}")

        products = scrape_category(cat_id, cat_name, cat_url)
        all_new.extend(products)
        print(f"  Subtotal scraped: {len(products)}")
        time.sleep(DELAY)

    print(f"\nTotal scraped this run: {len(all_new)}")

    # Merge — first category wins dedup (specialized cats come before catch-alls in categories.json)
    merged, added = merge_products(existing_products, all_new, force_category=False)
    print(f"New products added:  {added}")
    print(f"Total products now:  {len(merged)}")

    with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)

    print("\nSaved data/products.json")

    print("\nCategory breakdown:")
    counts = Counter(p.get('categoria_slug', '?') for p in merged)
    for cid, count in sorted(counts.items(), key=lambda x: -x[1]):
        print(f"  {cid:<35} {count:>5}")

    print("\nDone.")


if __name__ == '__main__':
    main()
