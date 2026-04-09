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
import sys
from urllib.parse import urljoin
from collections import Counter

# ── Config ────────────────────────────────────────────────────────────────────
BASE_URL  = "https://www.catalogospromocionales.com"
DELAY     = 1.5   # seconds between requests
MAX_PAGES = 50    # safety cap (variedades has 25 pages)

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
    """Capitalize each word, keeping short words lowercase."""
    return ' '.join(
        w.capitalize() if len(w) > 2 else w.lower()
        for w in text.split()
    )


def build_product(raw_name, img_original_url, cat_id, cat_name):
    """Build a product dict in the promogimmicks format."""
    clean_name = title_case(re.sub(r'\s+', ' ', raw_name).strip())
    slug = slugify(clean_name)
    prod_id = slug  # use slug as id (same convention as existing products)

    # Derive local image path from original URL numeric ID
    m = re.search(r'/(\d+)\.(?:jpg|jpeg|png|webp)', img_original_url, re.I)
    numeric_id = m.group(1) if m else slug
    local_img = f"/img/productos/{slug}.jpg"

    desc_templates = [
        f"{clean_name} personalizado con logo. Producto promocional para empresas en Ecuador y Colombia.",
        f"Cotiza {clean_name} con impresión de logo. Artículo promocional versátil para eventos y campañas.",
        f"{clean_name} con tu marca impresa. Regalo corporativo ideal para ferias y lanzamientos.",
    ]
    # Vary description by numeric_id parity for minor diversity
    desc_idx = int(numeric_id) % 3 if numeric_id.isdigit() else 0
    descripcion = desc_templates[desc_idx]

    seo_title = f"{clean_name} Personalizado Ecuador | PromoGimmicks"
    seo_desc  = f"{descripcion} Envíos a Quito, Guayaquil, Bogotá y Medellín."
    name_lower = clean_name.lower()
    seo_kw = (
        f"{name_lower}, {name_lower} personalizado, {name_lower} promocional, "
        f"{name_lower} con logo, {name_lower} ecuador, {name_lower} corporativo, "
        f"{cat_id}, regalo corporativo ecuador, merchandising quito, "
        f"productos promocionales guayaquil, promogimmicks, artículos publicitarios"
    )

    return {
        'id': prod_id,
        'nombre': clean_name,
        'slug': slug,
        'categoria': cat_name,
        'categoria_slug': cat_id,
        'descripcion_corta': descripcion,
        'imagen_url': local_img,
        'imagen_original_url': img_original_url,
        'codigo': None,
        'seo_title': seo_title,
        'seo_description': seo_desc,
        'seo_keywords': seo_kw,
    }


# ── Pagination helper ─────────────────────────────────────────────────────────

def find_next_page_url(soup, current_page):
    """
    Extract the URL for the next page.
    catalogospromocionales.com uses /Catalogo/Default.aspx?id=XX&Page=N
    """
    next_page_num = str(current_page + 1)

    # Find all links with Page= parameter
    page_links = soup.find_all('a', href=re.compile(r'[Pp]age=\d+'))
    for link in page_links:
        href = link.get('href', '')
        m = re.search(r'[Pp]age=(\d+)', href)
        if m and m.group(1) == next_page_num:
            return urljoin(BASE_URL, href)

    # Fallback: text-based next link
    next_link = soup.find('a', string=re.compile(r'siguiente|next|[›»>]', re.I))
    if next_link and next_link.get('href'):
        return urljoin(BASE_URL, next_link['href'])

    return None


# ── Scraping ──────────────────────────────────────────────────────────────────

def scrape_category(cat_id, cat_name, cat_url):
    """Scrape all products from a category URL, following pagination."""
    products = []
    seen_imgs = set()
    current_url = cat_url
    page = 1

    while page <= MAX_PAGES:
        html = get_page(current_url)
        if not html:
            break

        soup = BeautifulSoup(html, 'lxml')
        found_on_page = 0

        # Primary selector: wrapProdWhite (actual class on catalogospromocionales.com)
        containers = soup.find_all('div', class_='wrapProdWhite')

        # Fallback: generic patterns
        if not containers:
            containers = (
                soup.find_all('div', class_=re.compile(r'product[-_]?item|product[-_]?card', re.I))
                or soup.find_all('li', class_=re.compile(r'product|item', re.I))
            )

        if containers:
            for container in containers:
                img = container.find('img')
                if not img:
                    continue
                img_src = img.get('src') or img.get('data-src') or img.get('data-original', '')
                if not img_src:
                    continue
                img_url = urljoin(BASE_URL, img_src)
                if img_url in seen_imgs:
                    continue

                # Extract product name
                name = ''
                for tag in ['h2', 'h3', 'h4', 'strong', 'p', 'span']:
                    el = container.find(tag)
                    if el:
                        candidate = el.get_text(strip=True)
                        if len(candidate) >= 3:
                            name = candidate
                            break
                if not name:
                    name = img.get('alt', '').strip()
                if not name or len(name) < 3:
                    continue

                seen_imgs.add(img_url)
                products.append(build_product(name, img_url, cat_id, cat_name))
                found_on_page += 1
        else:
            # Last-resort: find all product images directly
            for img in soup.find_all('img', src=re.compile(r'/images/productos', re.I)):
                img_url = urljoin(BASE_URL, img['src'])
                if img_url in seen_imgs:
                    continue
                name = img.get('alt', '').strip()
                if not name or len(name) < 3:
                    parent = img.find_parent(['a', 'div', 'li'])
                    if parent:
                        heading = parent.find(['h2', 'h3', 'h4', 'strong', 'span'])
                        if heading:
                            name = heading.get_text(strip=True)
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

def merge_products(existing, new_products):
    """Add products not already present (dedup by imagen_original_url)."""
    existing_imgs = {p.get('imagen_original_url') for p in existing if p.get('imagen_original_url')}

    # Also dedup by slug to avoid duplicate slugs (which break static routing)
    existing_slugs = {p.get('slug') for p in existing if p.get('slug')}

    added = 0
    for p in new_products:
        img = p.get('imagen_original_url')
        slug = p.get('slug')
        if img and img not in existing_imgs and slug not in existing_slugs:
            existing.append(p)
            existing_imgs.add(img)
            existing_slugs.add(slug)
            added += 1

    return existing, added


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("PromoGimmicks — Daily Scraper")
    print("=" * 60)

    # Load existing data
    with open(PRODUCTS_FILE, encoding='utf-8') as f:
        existing_products = json.load(f)
    with open(CATEGORIES_FILE, encoding='utf-8') as f:
        categories = json.load(f)

    print(f"Existing products: {len(existing_products)}")
    print(f"Categories to scrape: {len(categories)}")

    # Scrape each category using its providerUrl
    all_new = []
    for idx, cat in enumerate(categories, 1):
        cat_id   = cat.get('id') or cat.get('slug', '')
        cat_name = cat.get('name') or cat.get('nombre', cat_id)
        cat_url  = cat.get('providerUrl', '')

        if not cat_url or not cat_id:
            print(f"\n[{idx}/{len(categories)}] SKIP — missing id or providerUrl: {cat}")
            continue

        print(f"\n[{idx}/{len(categories)}] {cat_name} ({cat_id})")
        print(f"  URL: {cat_url}")

        products = scrape_category(cat_id, cat_name, cat_url)
        all_new.extend(products)
        print(f"  Subtotal scraped: {len(products)}")
        time.sleep(DELAY)

    print(f"\nTotal scraped this run: {len(all_new)}")

    # Merge
    merged, added = merge_products(existing_products, all_new)
    print(f"New products added:  {added}")
    print(f"Total products now:  {len(merged)}")

    # Save
    with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)

    print("\nSaved data/products.json")

    # Summary by category
    print("\nCategory breakdown:")
    counts = Counter(p.get('categoria_slug', '?') for p in merged)
    for cat_id, count in sorted(counts.items(), key=lambda x: -x[1]):
        print(f"  {cat_id:<35} {count:>5}")

    print("\nDone.")


if __name__ == '__main__':
    main()
