"""
PromoGimmicks — Image Downloader
Downloads missing product images from imagen_original_url into public/img/productos/.

Run:  python scripts/download-images.py
Deps: pip install requests
"""

import requests
import json
import os
import time
import sys
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────
ROOT         = Path(__file__).parent.parent
PRODUCTS_FILE = ROOT / 'data' / 'products.json'
PUBLIC_DIR    = ROOT / 'public'
DELAY         = 0.3   # seconds between requests
MAX_RETRIES   = 3

SESSION = requests.Session()
SESSION.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Referer': 'https://www.catalogospromocionales.com/',
})


def download_image(url: str, dest: Path, retries: int = MAX_RETRIES) -> bool:
    for attempt in range(retries):
        try:
            r = SESSION.get(url, timeout=20, stream=True)
            r.raise_for_status()
            dest.parent.mkdir(parents=True, exist_ok=True)
            with open(dest, 'wb') as f:
                for chunk in r.iter_content(8192):
                    f.write(chunk)
            return True
        except Exception as e:
            if attempt == retries - 1:
                print(f"  [ERROR] {url}: {e}", file=sys.stderr)
                return False
            time.sleep(2)
    return False


def main():
    print("=" * 60)
    print("PromoGimmicks — Image Downloader")
    print("=" * 60)

    with open(PRODUCTS_FILE, encoding='utf-8') as f:
        products = json.load(f)

    total     = len(products)
    downloaded = 0
    skipped    = 0
    failed     = 0

    for i, product in enumerate(products, 1):
        imagen_url     = product.get('imagen_url', '')
        original_url   = product.get('imagen_original_url', '')

        if not imagen_url or not original_url:
            skipped += 1
            continue

        # Local destination
        dest = PUBLIC_DIR / imagen_url.lstrip('/')

        if dest.exists():
            skipped += 1
            continue

        print(f"[{i}/{total}] {product['slug'][:50]}")
        success = download_image(original_url, dest)

        if success:
            downloaded += 1
        else:
            failed += 1

        if i % 50 == 0:
            print(f"  >> Progress: {downloaded} downloaded, {skipped} skipped, {failed} failed")

        time.sleep(DELAY)

    print()
    print("=" * 60)
    print(f"Done. Downloaded: {downloaded} | Skipped (exist): {skipped} | Failed: {failed}")
    print("=" * 60)


if __name__ == '__main__':
    main()
