import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetailView from '@/components/ProductDetailView';
import { products, relatedProducts, categoryName, isPlaceholderImage } from '@/lib/catalog';
import { absoluteUrl, jsonLd, ORGANIZATION_ID } from '@/lib/site';

// Generar parámetros estáticos para todas las páginas de productos (SSG)
export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Generar metadata para SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = products.find(p => p.slug === params.slug);

  if (!product) {
    return {
      title: 'Producto no encontrado',
    };
  }

  const url = absoluteUrl(`/tienda/${product.slug}/`);
  const absoluteImageUrl = absoluteUrl(product.imagen_url);

  // El seo_title almacenado ya incluye la marca; no se añaden sufijos ("| Ecuador")
  // ni frases de envío a la descripción (duplicaban marca/país y alargaban el snippet).
  const title = product.seo_title || `${product.nombre} Personalizado con Logo | PromoGimmicks`;
  const description = product.seo_description || product.descripcion_corta;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      siteName: 'PromoGimmicks',
      locale: 'es_EC',
      // Sin width/height: las dimensiones reales de cada imagen no están registradas.
      images: [{ url: absoluteImageUrl, alt: product.nombre }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find(p => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const url = absoluteUrl(`/tienda/${product.slug}/`);
  const category = categoryName(product.categoria_slug);

  // Product "quote-first": identidad, SKU, imagen, descripción y categoría.
  // Sin Offer: no hay precio ni disponibilidad públicos verificados (un Offer sin
  // price es inválido y "InStock" fijo no está respaldado). Sin brand: los modelos
  // son de proveedores, PromoGimmicks no es el fabricante.
  const productSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    "name": product.nombre,
    "url": url,
    "sku": product.sku,
    "description": product.seo_description || product.descripcion_corta,
    "category": category,
  };
  if (!isPlaceholderImage(product)) {
    productSchema.image = absoluteUrl(product.imagen_url);
  }
  if (product.precio_desde_usd && product.verificado_en) {
    // Solo si en el futuro se registran precios públicos verificados.
    productSchema.offers = {
      "@type": "Offer",
      "url": url,
      "price": product.precio_desde_usd,
      "priceCurrency": "USD",
      "seller": { "@id": ORGANIZATION_ID },
    };
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": absoluteUrl('/') },
      { "@type": "ListItem", "position": 2, "name": "Tienda", "item": absoluteUrl('/tienda/') },
      { "@type": "ListItem", "position": 3, "name": category, "item": absoluteUrl(`/tienda/categoria/${product.categoria_slug}/`) },
      { "@type": "ListItem", "position": 4, "name": product.nombre, "item": url },
    ]
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />

      <Navbar />

      <div className="pt-20">
        <ProductDetailView
          product={product}
          categoryLabel={category}
          related={relatedProducts(product)}
        />
      </div>

      <Footer />
    </main>
  );
}
