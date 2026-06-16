// Datos geográficos para SEO de páginas locales

export interface Ciudad {
  slug: string;
  nombre: string;
  pais: 'ecuador';
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  caracteristicas: string[];
}

export interface Pais {
  slug: string;
  nombre: string;
  codigo: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  ciudades: Ciudad[];
}

export const ecuador: Pais = {
  slug: 'productos-promocionales-ecuador',
  nombre: 'Ecuador',
  codigo: 'EC',
  seoTitle: 'Productos Promocionales Ecuador | Merchandising Empresarial',
  seoDescription: 'Productos promocionales en Ecuador. Merchandising corporativo, artículos publicitarios y regalos empresariales. Envíos a Quito, Guayaquil, Cuenca y Manta.',
  h1: 'Productos Promocionales en Ecuador',
  intro: 'Somos tu aliado estratégico en productos promocionales y merchandising empresarial en Ecuador. Ofrecemos artículos publicitarios de alta calidad con cobertura nacional y los mejores tiempos de entrega.',
  ciudades: [
    {
      slug: 'quito',
      nombre: 'Quito',
      pais: 'ecuador',
      seoTitle: 'Productos Promocionales Quito | Merchandising y Artículos Publicitarios',
      seoDescription: 'Productos promocionales en Quito. Artículos publicitarios, merchandising corporativo y regalos empresariales. Entrega en toda la capital ecuatoriana.',
      h1: 'Productos Promocionales en Quito',
      intro: 'En Quito, capital del Ecuador, brindamos soluciones integrales en productos promocionales y merchandising. Atendemos empresas en el norte, centro histórico, valles de Cumbayá, Tumbaco, Los Chillos y toda la ciudad.',
      caracteristicas: [
        'Entrega en todo el Distrito Metropolitano',
        'Atención a empresas del sector público y privado',
        'Productos para ferias en Quorum y centros de convenciones',
        'Stock disponible para entregas inmediatas'
      ]
    },
    {
      slug: 'guayaquil',
      nombre: 'Guayaquil',
      pais: 'ecuador',
      seoTitle: 'Productos Promocionales Guayaquil | Merchandising Empresarial Costa',
      seoDescription: 'Productos promocionales en Guayaquil. Artículos publicitarios, merchandising corporativo. Envíos a Samborondón, Durán y toda la provincia del Guayas.',
      h1: 'Productos Promocionales en Guayaquil',
      intro: 'Guayaquil, el motor económico del Ecuador, cuenta con nuestra completa línea de productos promocionales. Servimos a empresas en el centro, norte, sur, Samborondón, Durán y toda la provincia del Guayas.',
      caracteristicas: [
        'Envíos a toda la provincia del Guayas',
        'Productos resistentes al clima costero',
        'Atención al sector comercial e industrial',
        'Merchandising para ferias y eventos empresariales'
      ]
    },
    {
      slug: 'cuenca',
      nombre: 'Cuenca',
      pais: 'ecuador',
      seoTitle: 'Productos Promocionales Cuenca | Merchandising Azuay',
      seoDescription: 'Productos promocionales en Cuenca y Azuay. Artículos publicitarios personalizados, merchandising corporativo. Envíos a toda la región austral.',
      h1: 'Productos Promocionales en Cuenca',
      intro: 'Cuenca, patrimonio cultural de la humanidad, merece productos promocionales de la más alta calidad. Atendemos empresas, instituciones y organizaciones en toda la ciudad y provincia del Azuay.',
      caracteristicas: [
        'Envíos a toda la región austral del Ecuador',
        'Productos artesanales y eco-friendly',
        'Atención al sector turístico y educativo',
        'Merchandising para ferias artesanales y culturales'
      ]
    },
    {
      slug: 'manta',
      nombre: 'Manta',
      pais: 'ecuador',
      seoTitle: 'Productos Promocionales Manta | Merchandising Manabí',
      seoDescription: 'Productos promocionales en Manta y Manabí. Artículos publicitarios para empresas pesqueras, turísticas e industriales. Envíos a toda la provincia.',
      h1: 'Productos Promocionales en Manta',
      intro: 'Manta, puerto principal del Ecuador, cuenta con nuestra línea especializada de productos promocionales. Servimos a empresas del sector pesquero, turístico, industrial y comercial de toda la provincia de Manabí.',
      caracteristicas: [
        'Envíos a toda la provincia de Manabí',
        'Productos para sector pesquero y marítimo',
        'Atención a industrias atuneras y exportadoras',
        'Merchandising resistente al clima costero'
      ]
    }
  ]
};

export const paises = [ecuador];

export function getPaisBySlug(slug: string): Pais | undefined {
  return paises.find(p => p.slug === slug);
}

export function getCiudadBySlug(paisSlug: string, ciudadSlug: string): Ciudad | undefined {
  const pais = getPaisBySlug(paisSlug);
  return pais?.ciudades.find(c => c.slug === ciudadSlug);
}

export function getAllCiudades(): Ciudad[] {
  return paises.flatMap(p => p.ciudades);
}
