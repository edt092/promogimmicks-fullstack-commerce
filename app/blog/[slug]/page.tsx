import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogPostContent from '@/components/blog/BlogPostContent';
import blogPosts from '@/data/blog-posts.json';
import { SITE_URL, absoluteUrl, jsonLd, ORGANIZATION_ID } from '@/lib/site';
import { BlogProductsProvider } from '@/components/blog/BlogProductsContext';
import { buildBlogProductSets } from '@/lib/blog-products';


export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug);

  if (!post) {
    return {
      title: 'Artículo no encontrado',
    };
  }

  return {
    title: post.seo_title,
    description: post.seo_description,
    keywords: post.tags.join(', '),
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}/`,
    },
    openGraph: {
      title: post.seo_title,
      description: post.seo_description,
      type: 'article',
      url: `${SITE_URL}/blog/${post.slug}/`,
      images: [
        {
          url: post.imagen_destacada.startsWith('http') ? post.imagen_destacada : `${SITE_URL}${post.imagen_destacada}`,
          width: 1200,
          height: 630,
          alt: post.titulo,
        },
      ],
      publishedTime: post.fecha_publicacion,
      authors: [post.autor],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo_title,
      description: post.seo_description,
      images: [post.imagen_destacada.startsWith('http') ? post.imagen_destacada : `${SITE_URL}${post.imagen_destacada}`],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const url = absoluteUrl(`/blog/${post.slug}/`);
  const image = post.imagen_destacada.startsWith('http') ? post.imagen_destacada : absoluteUrl(post.imagen_destacada);
  const modified = (post as { fecha_actualizacion?: string }).fecha_actualizacion || post.fecha_publicacion;
  // Autor visible en la página: "PromoGimmicks" (marca) -> Organization. Fechas reales del registro.
  const postSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    "headline": post.titulo,
    "description": post.seo_description || post.extracto,
    "image": image,
    "datePublished": post.fecha_publicacion,
    "dateModified": modified,
    "author": post.autor === 'PromoGimmicks'
      ? { "@id": ORGANIZATION_ID }
      : { "@type": "Person", "name": post.autor },
    "publisher": { "@id": ORGANIZATION_ID },
    "mainEntityOfPage": url,
    "inLanguage": "es-EC",
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": absoluteUrl('/') },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": absoluteUrl('/blog/') },
      { "@type": "ListItem", "position": 3, "name": post.titulo, "item": url },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(postSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      <Navbar />
      <BlogProductsProvider value={buildBlogProductSets()}>
        <BlogPostContent post={post} />
      </BlogProductsProvider>
      <Footer />
    </main>
  );
}
