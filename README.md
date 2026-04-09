# PromoGimmicks

Landing page y tienda de productos promocionales para PromoGimmicks, empresa especializada en merchandising e importacion para Colombia y Ecuador. Catalogo de 1000+ productos personalizables con logo corporativo.

## Stack Tecnologico

| Tecnologia | Version | Uso |
|------------|---------|-----|
| Next.js | 14.2.x | Framework React con App Router (SSG) |
| React | 18.3.x | Biblioteca UI |
| TypeScript | 5.x | Tipado estatico |
| Tailwind CSS | 3.4.x | Framework CSS utility-first |
| Framer Motion | 11.11.x | Animaciones e interactividad |
| Lucide React | 0.462.x | Iconos |
| Formspree | - | Backend formulario de contacto |

## Deploy

El sitio se genera como **sitio estatico** (`output: 'export'` en `next.config.js`) y se despliega en **Netlify**.

El build produce la carpeta `out/` que contiene todos los archivos HTML/CSS/JS estaticos listos para servir.

## Arquitectura del Proyecto

```
promogimmicks/
├── app/                          # App Router (Next.js 14)
│   ├── layout.tsx                # Layout principal con metadata
│   ├── page.tsx                  # Pagina principal (home)
│   ├── globals.css               # Estilos globales y animaciones
│   ├── robots.ts                 # Generador robots.txt
│   ├── sitemap.ts                # Generador sitemap XML (1000+ URLs)
│   ├── blog/                     # Seccion blog
│   │   ├── page.tsx              # Listado de articulos
│   │   └── [slug]/page.tsx       # Articulo individual
│   ├── tienda/                   # Tienda de productos
│   │   ├── page.tsx              # Catalogo principal
│   │   ├── [slug]/page.tsx       # Detalle de producto (SSG)
│   │   └── categoria/[slug]/     # Productos filtrados por categoria
│   ├── productos-promocionales-colombia/  # SEO Colombia
│   │   ├── page.tsx              # Pagina nacional
│   │   └── [ciudad]/page.tsx     # Bogota, Medellin, Cali, Barranquilla, Cartagena
│   └── productos-promocionales-ecuador/   # SEO Ecuador
│       ├── page.tsx              # Pagina nacional
│       └── [ciudad]/page.tsx     # Quito, Guayaquil, Cuenca, Manta
│
├── components/                   # Componentes reutilizables
│   ├── Navbar.tsx                # Navegacion fija responsive
│   ├── HeroSection.tsx           # Hero con video de fondo
│   ├── Cobertura.tsx             # Cobertura con SVGs animados (USD/COP)
│   ├── ProductosVirales.tsx      # Carrusel productos destacados
│   ├── Catalogos.tsx             # Grid de catalogos con hover
│   ├── Servicios.tsx             # Servicios ofrecidos
│   ├── TiendaPromo.tsx           # Preview tienda en home
│   ├── TiendaGrid.tsx            # Grid paginado con busqueda y filtros
│   ├── ProductCard.tsx           # Tarjeta de producto (lazy loading)
│   ├── ProductDetailView.tsx     # Vista detalle con JSON-LD
│   ├── ProductosGallery.tsx      # Galeria de 12 imagenes stock
│   ├── ContactSection.tsx        # Formulario de contacto (Formspree)
│   ├── Footer.tsx                # Pie de pagina (4 columnas)
│   ├── BlogCard.tsx              # Tarjeta de articulo
│   ├── GoldenShimmerText.tsx     # Texto con efecto shimmer dorado
│   └── blog/                     # Componentes especificos blog
│       ├── BlogPostContent.tsx   # Template generico de blog
│       ├── BlogNavidadContent.tsx # Contenido post navidad
│       ├── BlogQuitoContent.tsx  # Contenido post Quito
│       ├── CTABanner.tsx         # Banner call-to-action
│       └── ProductShowcase.tsx   # Showcase de productos en blog
│
├── data/                         # Datos estaticos
│   ├── products.json             # Catalogo de 1000+ productos
│   ├── categories.json           # 35+ categorias de productos
│   ├── blog-posts.json           # Metadata de articulos del blog
│   └── geo-data.ts               # Datos geograficos SEO (ciudades)
│
├── public/                       # Assets estaticos
│   ├── img/
│   │   ├── productos/            # Imagenes de productos (1000+)
│   │   ├── imagenes-catalogos/   # Imagenes de catalogos
│   │   ├── imagenes-de-stock/    # Galeria stock (12 imagenes)
│   │   ├── imagenes-productos-virales/ # Productos destacados
│   │   ├── adri_asistente/       # Fotos del equipo
│   │   └── blog/                 # Imagenes de blog
│   └── videos/
│       └── hero-video.mp4        # Video de fondo hero
│
├── next.config.js                # Config Next.js (export estatico)
├── tailwind.config.ts            # Config Tailwind CSS
├── tsconfig.json                 # Config TypeScript
├── postcss.config.mjs            # Config PostCSS
└── .eslintrc.json                # Config ESLint
```

## Funcionalidades

### Pagina Principal
- Hero con video de fondo, gradientes y animaciones Framer Motion
- Carrusel de productos virales con autoplay
- Seccion de cobertura interactiva con SVGs animados (USD/COP)
- Grid de catalogos con hover effects
- Seccion de servicios
- Preview de productos de la tienda
- Galeria de imagenes de stock
- Formulario de contacto (Formspree)

### Tienda
- Catalogo de 1000+ productos con busqueda por nombre/categoria/codigo
- Scroll infinito con IntersectionObserver (20 productos por pagina)
- Filtrado por 35+ categorias
- Vista de detalle con Schema.org JSON-LD y breadcrumbs
- Integracion con WhatsApp para cotizaciones (mensaje pre-llenado)

### Blog
- 3 articulos con contenido personalizado por post
- Componentes interactivos (CTAs, product showcases)
- Optimizacion SEO con Open Graph y meta tags

### SEO
- Paginas geograficas: 5 ciudades Colombia + 4 ciudades Ecuador
- Sitemap XML dinamico (1000+ URLs de productos + paginas)
- Robots.txt configurado
- Schema.org JSON-LD en paginas de producto
- Open Graph y Twitter Cards
- URLs canonicas con trailing slash

## Instalacion

```bash
# Clonar repositorio
git clone https://github.com/edt092/promogimmicks.git

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## Scripts Disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo en http://localhost:3000 |
| `npm run build` | Genera sitio estatico en la carpeta `out/` |
| `npm run lint` | Ejecuta ESLint |

## Configuracion de Imagenes

Las imagenes deben ubicarse en `public/`:

- **Video Hero**: `public/videos/hero-video.mp4` (MP4, 1920x1080)
- **Productos Virales**: `public/img/imagenes-productos-virales/`
- **Catalogos**: `public/img/imagenes-catalogos/` (premium.jpg, mp.jpg, cdo.jpg, bs.jpg)
- **Galeria Stock**: `public/img/imagenes-de-stock/` (1.jpg - 12.jpg)
- **Productos**: `public/img/productos/` (1000+ imagenes individuales)

## Paleta de Colores

| Color | Codigo | Uso |
|-------|--------|-----|
| Azul Profundo | `#1e3a8a` | Encabezados, autoridad |
| Ambar/Dorado | `#f59e0b` | CTAs, acentos |
| Blanco | `#ffffff` | Fondos principales |
| Gris Claro | `#f8fafc` | Separadores |

## Estructura de Datos

### products.json (1000+ productos)
```json
{
  "id": "alcancia-piggy-max",
  "nombre": "Alcancia Piggy Max",
  "slug": "alcancia-piggy-max",
  "categoria": "Accesorios",
  "categoria_slug": "accesorios",
  "descripcion_corta": "Descripcion del producto...",
  "imagen_url": "/img/productos/alcancia-piggy-max.jpg",
  "imagen_original_url": "https://...",
  "codigo": null,
  "seo_title": "Titulo SEO del producto",
  "seo_description": "Descripcion SEO",
  "seo_keywords": "keywords, separadas, por, comas"
}
```

### categories.json (35+ categorias)
```json
{
  "id": "precio-bomba",
  "slug": "precio-bomba",
  "name": "Precio Bomba",
  "description": "Descripcion de la categoria",
  "providerUrl": "https://...",
  "keywords": ["ofertas", "precios bajos"]
}
```

### blog-posts.json
```json
{
  "id": "guia-articulos-promocionales-navidenos-2025",
  "slug": "guia-articulos-promocionales-navidenos-2025",
  "titulo": "Titulo del articulo",
  "extracto": "Resumen del articulo...",
  "imagen_destacada": "https://...",
  "categoria": "Navidad",
  "fecha_publicacion": "2025-12-25",
  "tiempo_lectura": "25 min",
  "autor": "PromoGimmicks",
  "tags": ["tag1", "tag2"],
  "seo_title": "Titulo SEO",
  "seo_description": "Descripcion SEO"
}
```

## Contacto

- **Emails**: info@promogimmicks.com | corporativo@promogimmicks.com | jjygonzalez@hotmail.com
- **Ecuador**: +593 99 859 4123
- **Colombia**: +57 315 559 5134
- **Oficina Ecuador**: Av. Las Palmas, 63
- **Oficina Colombia**: Calle 22 #1571 los cedros
- **WhatsApp**: wa.me/593998594123
- **Formulario**: Formspree (ID: mzznadzv)

## Licencia

Proyecto privado - Todos los derechos reservados.

Desarrollado por [Bayona Digital Systems](https://edwinbayonaitmanager.online)
