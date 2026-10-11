import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoriasGrid from '@/components/CategoriasGrid';
import ProductosDestacadosSlider from '@/components/ProductosDestacadosSlider';
import CatalogoPorCategoria from '@/components/CatalogoPorCategoria';
import PromocionesSlider from '@/components/PromocionesSlider';
import PropuestaValor from '@/components/PropuestaValor';
import Proceso from '@/components/Proceso';
import SeleccionObjetivo from '@/components/SeleccionObjetivo';
import Personalizacion from '@/components/Personalizacion';
import RegalosCorporativos from '@/components/RegalosCorporativos';
import Cobertura from '@/components/Cobertura';
import Confianza from '@/components/Confianza';
import FAQ from '@/components/FAQ';
import LlamadaFinal from '@/components/LlamadaFinal';
import Footer from '@/components/Footer';
import { products, activeCategorySlugs, firstProductPerCategory, offerProducts, FEATURED_CATEGORY_SLUGS } from '@/lib/catalog';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/'),
    siteName: 'PromoGimmicks',
    locale: 'es_EC',
    title: 'Artículos Promocionales en Ecuador | PromoGimmicks',
    description: 'Catálogo de artículos promocionales personalizados con tu logo para empresas en Ecuador. Cotiza por WhatsApp.',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CategoriasGrid />
      <ProductosDestacadosSlider products={firstProductPerCategory(FEATURED_CATEGORY_SLUGS)} />
      <CatalogoPorCategoria />
      <PromocionesSlider products={offerProducts(16)} />
      <PropuestaValor />
      <Proceso />
      <SeleccionObjetivo />
      <Personalizacion />
      <RegalosCorporativos />
      <Cobertura />
      <Confianza totalProducts={products.length} totalCategories={activeCategorySlugs().length} />
      <FAQ />
      <LlamadaFinal />
      <Footer />
    </main>
  );
}
