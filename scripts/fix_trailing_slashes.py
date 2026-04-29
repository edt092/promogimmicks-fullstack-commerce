"""Fix internal links that are missing trailing slashes."""
import os
import re

files_to_fix = [
    'components/blog/BlogNavidadContent.tsx',
    'components/blog/BlogPostContent.tsx',
    'components/blog/BlogQuitoContent.tsx',
    'components/blog/CTABanner.tsx',
    'components/blog/ProductShowcase.tsx',
    'components/Catalogos.tsx',
    'components/Footer.tsx',
    'components/HeroSection.tsx',
    'components/ProductDetailView.tsx',
    'components/ProductosGallery.tsx',
    'components/Servicios.tsx',
    'components/TiendaPromo.tsx',
    'app/blog/page.tsx',
    'app/productos-promocionales-colombia/page.tsx',
    'app/productos-promocionales-colombia/[ciudad]/page.tsx',
    'app/productos-promocionales-ecuador/page.tsx',
    'app/productos-promocionales-ecuador/[ciudad]/page.tsx',
    'app/tienda/categoria/[slug]/page.tsx',
    'components/ProductCard.tsx',
]

total_changes = 0
for fname in files_to_fix:
    if not os.path.exists(fname):
        print(f'  SKIP (not found): {fname}')
        continue
    with open(fname, encoding='utf-8') as f:
        content = f.read()

    orig = content

    # Fix static href="/tienda" -> href="/tienda/"
    content = content.replace('href="/tienda"', 'href="/tienda/"')

    # Fix template literal product links: href={`/tienda/${x.slug}`} -> href={`/tienda/${x.slug}/`}
    # Pattern: href={`/tienda/${...}`} where the backtick-quoted string doesn't end with /`}
    def fix_product_href(m):
        full = m.group(0)
        if full.endswith('/`}'):
            return full  # already has trailing slash
        # Insert / before the closing backtick
        return full[:-2] + '/`}'

    content = re.sub(
        r'href=\{`/tienda/\$\{[^`]+`\}',
        fix_product_href,
        content
    )

    if content != orig:
        count = orig.count('href="/tienda"') + len(re.findall(r'href=\{`/tienda/\$\{[^`]+[^/]`\}', orig))
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(content)
        total_changes += 1
        print(f'  Fixed: {fname}')
    else:
        print(f'  No changes: {fname}')

print(f'\nTotal files modified: {total_changes}')
