import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductosDestacadosSlider from '@/components/ProductosDestacadosSlider';
import PropuestaValor from '@/components/PropuestaValor';
import Proceso from '@/components/Proceso';
import SeleccionObjetivo from '@/components/SeleccionObjetivo';
import Personalizacion from '@/components/Personalizacion';
import RegalosCorporativos from '@/components/RegalosCorporativos';
import Cobertura from '@/components/Cobertura';
import Confianza from '@/components/Confianza';
import PromocionesSlider from '@/components/PromocionesSlider';
import FAQ from '@/components/FAQ';
import LlamadaFinal from '@/components/LlamadaFinal';
import Footer from '@/components/Footer';
export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProductosDestacadosSlider />
      <PropuestaValor />
      <Proceso />
      <SeleccionObjetivo />
      <Personalizacion />
      <RegalosCorporativos />
      <Cobertura />
      <Confianza />
      <PromocionesSlider />
      <FAQ />
      <LlamadaFinal />
      <Footer />
    </main>
  );
}
