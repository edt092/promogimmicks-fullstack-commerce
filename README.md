# PromoGimmicks

Landing page y tienda de productos promocionales para PromoGimmicks, empresa especializada en merchandising e importacion para **Colombia** y **Ecuador**. Catalogo de 1000+ productos personalizables con logo corporativo, generado estaticamente con Next.js 14 y desplegado en Netlify.

---

## Indice

1. [Vision General](#1-vision-general)
2. [Stack Tecnologico](#2-stack-tecnologico)
3. [Arquitectura del Proyecto](#3-arquitectura-del-proyecto)
4. [Flujo de Datos](#4-flujo-de-datos)
5. [Paginas y Rutas](#5-paginas-y-rutas)
6. [Componentes](#6-componentes)
7. [Capa de Datos](#7-capa-de-datos)
8. [Scraper y Automatizacion](#8-scraper-y-automatizacion)
9. [SEO y Metadata](#9-seo-y-metadata)
10. [Interactividad Client-Side](#10-interactividad-client-side)
11. [Imagenes y Assets](#11-imagenes-y-assets)
12. [CI/CD y GitHub Actions](#12-cicd-y-github-actions)
13. [Configuracion](#13-configuracion)
14. [Paleta de Colores](#14-paleta-de-colores)
15. [Estructura de Datos](#15-estructura-de-datos)
16. [Instalacion y Scripts](#16-instalacion-y-scripts)
17. [Contacto](#17-contacto)

---

## 1. Vision General

PromoGimmicks es un **sitio estatico de ecommerce B2B** orientado a empresas que buscan productos promocionales personalizados (bolsos, tazas, memorias USB, textil, tecnologia, etc.). El negocio opera en dos paises — Ecuador y Colombia — y la arquitectura web refleja esto con paginas geograficas dedicadas a nueve ciudades.

El modelo de negocio no tiene carrito de compras ni pagos en linea. Las conversiones ocurren por:

- **WhatsApp** (boton en cada producto con mensaje pre-llenado)
- **Formulario de contacto** (procesado por Formspree)

Esto simplifica radicalmente la arquitectura: todo es estatico, sin servidor, sin base de datos, sin autenticacion.

### Caracteristicas principales

| Caracteristica | Detalle |
|----------------|---------|
| Paginas totales | ~1050 (producto + categoria + geo + blog) |
| Productos en catalogo | 1000+ |
| Categorias | 35+ |
| Paises cubiertos | Colombia, Ecuador |
| Ciudades con pagina SEO | 9 (5 CO + 4 EC) |
| Articulos de blog | 3 |
| Runtime en produccion | Ninguno (archivos estaticos) |
| Backend de contacto | Formspree (third-party) |

---

## 2. Stack Tecnologico

| Tecnologia | Version | Rol en el proyecto |
|------------|---------|-------------------|
| **Next.js** | 14.2.33 | Framework principal. App Router con SSG (`output: 'export'`) |
| **React** | 18.3.1 | Libreria de UI. Server Components + Client Components |
| **TypeScript** | 5.x | Tipado estatico en toda la app |
| **Tailwind CSS** | 3.4.1 | Estilos utility-first. Breakpoints mobile-first |
| **Framer Motion** | 11.11.17 | Animaciones de entrada, carruseles, menus |
| **Lucide React** | 0.462.0 | Iconos SVG (80+ utilizados) |
| **Formspree** | - | SaaS para procesar el formulario de contacto sin backend |
| **Python** | 3.11 | Scraper diario de productos |
| **BeautifulSoup4** | 4.x | Parseo de HTML en el scraper |
| **Netlify** | - | Hosting y CDN para el sitio estatico |
| **GitHub Actions** | - | CI/CD: cron diario del scraper |

### Por que Next.js con `output: 'export'`

Next.js se usa exclusivamente para la fase de **build**: genera todos los archivos HTML, CSS y JS de forma estatica. No hay ningun servidor Node.js en produccion. Esto da:

- **Velocidad**: HTML pre-renderizado, sin tiempo de servidor
- **Costo cero de runtime**: Netlify sirve archivos planos desde CDN
- **SEO perfecto**: el crawler recibe HTML completo, sin JavaScript

---

## 3. Arquitectura del Proyecto

### Estructura de directorios

```
promogimmicks/
│
├── app/                              # App Router de Next.js 14
│   ├── layout.tsx                    # Layout raiz: fuente Sora, metadata global
│   ├── page.tsx                      # Home (Hero + secciones + contacto)
│   ├── globals.css                   # Reset global + clases de animacion
│   ├── robots.ts                     # Genera /robots.txt dinamicamente
│   ├── sitemap.ts                    # Genera /sitemap.xml con 1050+ URLs
│   │
│   ├── blog/
│   │   ├── page.tsx                  # Listado de articulos
│   │   └── [slug]/
│   │       └── page.tsx              # Articulo individual (SSG)
│   │
│   ├── tienda/
│   │   ├── page.tsx                  # Catalogo completo (busqueda + scroll infinito)
│   │   ├── [slug]/
│   │   │   └── page.tsx              # Detalle de producto: Schema.org + breadcrumbs
│   │   └── categoria/
│   │       └── [slug]/
│   │           └── page.tsx          # Catalogo filtrado por categoria
│   │
│   ├── productos-promocionales-colombia/
│   │   ├── page.tsx                  # Hub Colombia con LocalBusiness schema
│   │   └── [ciudad]/
│   │       └── page.tsx              # Bogota, Medellin, Cali, Barranquilla, Cartagena
│   │
│   └── productos-promocionales-ecuador/
│       ├── page.tsx                  # Hub Ecuador con LocalBusiness schema
│       └── [ciudad]/
│           └── page.tsx              # Quito, Guayaquil, Cuenca, Manta
│
├── components/                       # 20 componentes React
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── Cobertura.tsx
│   ├── ProductosVirales.tsx
│   ├── Catalogos.tsx
│   ├── Servicios.tsx
│   ├── TiendaPromo.tsx
│   ├── TiendaGrid.tsx                # Busqueda + scroll infinito (client-side)
│   ├── ProductCard.tsx
│   ├── ProductDetailView.tsx
│   ├── ProductosGallery.tsx
│   ├── ContactSection.tsx
│   ├── Footer.tsx
│   ├── BlogCard.tsx
│   ├── GoldenShimmerText.tsx
│   └── blog/
│       ├── BlogPostContent.tsx
│       ├── BlogNavidadContent.tsx
│       ├── BlogQuitoContent.tsx
│       ├── CTABanner.tsx
│       └── ProductShowcase.tsx
│
├── data/                             # Fuente de verdad: JSON/TS estaticos
│   ├── products.json                 # 1000+ productos (27,000 lineas)
│   ├── categories.json               # 35+ categorias con URLs del proveedor
│   ├── blog-posts.json               # Metadata de los 3 articulos
│   └── geo-data.ts                   # Ciudades + copys SEO por ciudad
│
├── public/                           # Assets servidos directamente
│   ├── img/
│   │   ├── productos/                # 1000+ imagenes descargadas por el scraper
│   │   ├── imagenes-catalogos/       # premium.jpg, mp.jpg, cdo.jpg, bs.jpg
│   │   ├── imagenes-de-stock/        # 1.jpg ... 12.jpg (galeria home)
│   │   ├── imagenes-productos-virales/ # Carrusel home
│   │   ├── adri_asistente/           # Fotos del equipo
│   │   └── blog/                     # Imagenes destacadas de blog
│   └── videos/
│       └── hero-video.mp4            # Video fondo hero (1920x1080)
│
├── lib/
│   └── netlifyImageLoader.js         # Custom loader para Next/Image → Netlify CDN
│
├── scripts/
│   ├── daily-scraper.py              # Scraper automatico (Python + BeautifulSoup4)
│   └── download-images.py            # Descargador de imagenes de productos
│
├── .github/
│   └── workflows/
│       └── daily-scraper.yml         # GitHub Action: cron diario 07:00 UTC
│
├── next.config.js                    # output: export + custom image loader
├── tailwind.config.ts                # Colores, fuentes, breakpoints
├── tsconfig.json                     # Strict mode, path alias @/
├── postcss.config.mjs
└── .eslintrc.json
```

### Patron arquitectonico: JAMstack estatico orientado a SEO

```
┌─────────────────────────────────────────────────────────────────────┐
│                          BUILD TIME (Next.js)                       │
│                                                                     │
│  data/*.json  ──►  generateStaticParams()  ──►  HTML estatico       │
│                         (1050 paginas)                              │
│                                                                     │
│  Componentes React  ──►  pre-renderizados  ──►  out/ (archivos)     │
└────────────────────────────┬────────────────────────────────────────┘
                             │ git push / Netlify deploy
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PRODUCCION (Netlify CDN)                         │
│                                                                     │
│  HTML estatico  ◄──  solicitud del browser                         │
│  JS hydration   ──►  interactividad (busqueda, animaciones)        │
│  /.netlify/images  ──►  CDN de imagenes con optimizacion           │
└─────────────────────────────────────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
              Formspree           WhatsApp
           (formulario)          (cotizar)
```

---

## 4. Flujo de Datos

El flujo de datos tiene dos ciclos completamente separados: el ciclo de actualizacion del catalogo (asincronico, diario) y el ciclo de renderizado (build-time).

### 4.1 Ciclo de actualizacion del catalogo

```
GitHub Actions (cron 07:00 UTC)
        │
        ▼
daily-scraper.py
        │
        ├── Lee data/categories.json        (35+ URLs del proveedor)
        │
        ├── Para cada categoria:
        │     ├── GET catalogospromocionales.com/categoria/?page=N
        │     ├── BeautifulSoup parsea el HTML
        │     ├── Extrae: nombre, imagen_url, categoria
        │     └── Construye objeto producto:
        │           { id, nombre, slug, categoria, seo_title,
        │             seo_description, imagen_url, imagen_original_url }
        │
        ├── merge_products():
        │     ├── Carga data/products.json existente
        │     ├── Deduplica por imagen_original_url
        │     └── Agrega solo productos nuevos
        │
        └── Escribe data/products.json actualizado
                │
                ▼
        git commit + git push
        (solo si hay cambios)
                │
                ▼
        Netlify detecta push → rebuild automatico
```

### 4.2 Ciclo de renderizado (build-time)

```
npm run build
        │
        ├── Next.js lee data/products.json
        │     │
        │     ├── generateStaticParams() en tienda/[slug]/
        │     │     └── retorna array de { slug } para cada producto
        │     │         → genera 1000+ archivos HTML
        │     │
        │     ├── generateStaticParams() en tienda/categoria/[slug]/
        │     │     └── retorna { slug } para cada categoria
        │     │         → genera 35+ archivos HTML
        │     │
        │     └── app/sitemap.ts
        │           └── mapea todos los slugs → <url> en sitemap.xml
        │
        ├── Next.js lee data/geo-data.ts
        │     └── generateStaticParams() en [ciudad]/
        │           └── genera 9 paginas geograficas
        │
        ├── Next.js lee data/blog-posts.json
        │     └── generateStaticParams() en blog/[slug]/
        │           └── genera 3 paginas de articulos
        │
        └── Salida: out/
              ├── index.html
              ├── tienda/
              │     ├── index.html
              │     └── [1000+ slugs]/index.html
              ├── blog/[slugs]/index.html
              ├── productos-promocionales-colombia/[ciudades]/index.html
              ├── productos-promocionales-ecuador/[ciudades]/index.html
              ├── sitemap.xml
              └── robots.txt
```

### 4.3 Ciclo de request del usuario (runtime)

```
Browser del usuario
        │
        ├── 1. GET /tienda/alcancia-piggy-max/
        │         └── Netlify CDN sirve HTML pre-renderizado (< 50ms)
        │
        ├── 2. Browser descarga JS bundle (React hydration)
        │         └── Componentes 'use client' se vuelven interactivos
        │
        ├── 3. Usuario busca "taza"
        │         └── TiendaGrid filtra products.json en memoria
        │             (sin request HTTP adicional)
        │
        └── 4. Usuario hace clic en "Cotizar por WhatsApp"
                  └── window.open('https://wa.me/593998594123?text=...')
                      (sin request al servidor)
```

---

## 5. Paginas y Rutas

### Mapa completo de rutas

| Ruta | Tipo | Paginas generadas | Proposito |
|------|------|------------------|-----------|
| `/` | Estatica | 1 | Home: hero, secciones, contacto |
| `/tienda/` | Estatica | 1 | Catalogo con busqueda y scroll infinito |
| `/tienda/[slug]/` | Dinamica SSG | ~1000 | Detalle de producto individual |
| `/tienda/categoria/[slug]/` | Dinamica SSG | 35+ | Catalogo filtrado por categoria |
| `/blog/` | Estatica | 1 | Listado de articulos |
| `/blog/[slug]/` | Dinamica SSG | 3 | Articulo individual |
| `/productos-promocionales-colombia/` | Estatica | 1 | Hub SEO Colombia |
| `/productos-promocionales-colombia/[ciudad]/` | Dinamica SSG | 5 | Bogota, Medellin, Cali, Barranquilla, Cartagena |
| `/productos-promocionales-ecuador/` | Estatica | 1 | Hub SEO Ecuador |
| `/productos-promocionales-ecuador/[ciudad]/` | Dinamica SSG | 4 | Quito, Guayaquil, Cuenca, Manta |
| `/sitemap.xml` | Generada | 1 | Mapa de 1050+ URLs para motores de busqueda |
| `/robots.txt` | Generada | 1 | Directivas para crawlers |

**Total: ~1052 archivos HTML estaticos generados en cada build.**

### Detalle de paginas clave

#### `/` — Home

Compuesta por secciones en cascada: `HeroSection` → `Cobertura` → `ProductosVirales` → `Catalogos` → `Servicios` → `TiendaPromo` → `ProductosGallery` → `ContactSection`. Cada seccion es un componente React independiente. Las secciones de animacion son `'use client'` (Framer Motion requiere browser APIs).

#### `/tienda/` — Catalogo

Pagina completamente client-side. Importa `TiendaGrid` que en su `useEffect` inicial carga todos los productos del JSON y los mantiene en estado React. La busqueda y filtrado son en memoria con `useMemo`. El scroll infinito usa `IntersectionObserver` sobre un div centinela al final del grid.

#### `/tienda/[slug]/` — Producto

Pagina SSG con `generateStaticParams` y `generateMetadata`. En `generateStaticParams` se leen todos los productos del JSON y se retorna su slug. En `generateMetadata` se busca el producto por slug y se construyen las meta-etiquetas. El componente `ProductDetailView` inyecta JSON-LD de tipo `Product` + `BreadcrumbList` directamente en el DOM con `<script type="application/ld+json">`.

#### `/productos-promocionales-[pais]/[ciudad]/` — Geo SEO

Paginas cuyo proposito primario es posicionamiento en busquedas locales como "productos promocionales Bogota". El contenido (titulo, descripcion, introduccion, caracteristicas) viene de `geo-data.ts` parametrizado por ciudad. Incluyen schema `LocalBusiness` con `serviceArea` hacia la ciudad objetivo.

---

## 6. Componentes

### Clasificacion por boundary React

Los componentes se dividen en dos grupos segun su directiva:

**Server Components** (sin directiva): Renderizan solo en build-time. Acceden directamente al sistema de archivos (lectura de JSON) y no tienen acceso a APIs del browser.

**Client Components** (`'use client'`): Se hidratan en el browser. Tienen acceso a `useState`, `useEffect`, eventos DOM, `window`, `IntersectionObserver`, etc.

### Inventario de componentes

#### Layout y navegacion

| Componente | Boundary | Descripcion |
|-----------|---------|-------------|
| `Navbar.tsx` | Client | Header fijo. Cambia estilos al hacer scroll (`scroll` event listener). Menu hamburguesa mobile con Framer Motion (slide-in + stagger de items). Links de navegacion a todas las secciones principales. |
| `Footer.tsx` | Server | Cuatro columnas: info empresa, links de paginas, datos de contacto, redes sociales. Completamente estatico. |

#### Secciones del Home

| Componente | Boundary | Descripcion |
|-----------|---------|-------------|
| `HeroSection.tsx` | Client | Video de fondo (`<video autoPlay muted loop>`), overlay con gradiente, texto animado con Framer Motion (fade-in + slide-up escalonado), dos CTAs (tienda y cotizar). |
| `Cobertura.tsx` | Client | Seccion que muestra la cobertura geografica con SVGs animados de monedas (USD para Ecuador, COP para Colombia). Framer Motion para entrada en viewport. |
| `ProductosVirales.tsx` | Client | Carrusel con autoplay de 5+ productos destacados. Controles de navegacion manual. Ciclo infinito. |
| `Catalogos.tsx` | Client | Grid de 4 imagenes de catalogos con hover effects (escala + opacidad). |
| `Servicios.tsx` | Client | Cards de servicios: personalizacion, tiempos de entrega, control de calidad. Iconos Lucide. |
| `TiendaPromo.tsx` | Client | Preview de la tienda en el home. Muestra muestra de productos y CTA a `/tienda/`. |
| `ProductosGallery.tsx` | Client | Galeria masonry de 12 imagenes stock. Lightbox o hover effect. |
| `ContactSection.tsx` | Client | Formulario con estado React (`useState`). Submit asincrono a Formspree via `fetch`. Feedback visual de exito/error. Campos: nombre, email, telefono, mensaje. |

#### Tienda

| Componente | Boundary | Descripcion |
|-----------|---------|-------------|
| `TiendaGrid.tsx` | Client | Nucleo de la tienda. Recibe el array completo de productos como prop. Estado: `query` (busqueda), `page` (pagina actual, 20 items). `useMemo` filtra productos. `IntersectionObserver` en div centinela incrementa `page`. Renderiza grid de `ProductCard`. |
| `ProductCard.tsx` | Client | Tarjeta individual de producto. Imagen lazy-loaded con `IntersectionObserver` propio (muestra placeholder shimmer hasta entrar en viewport). Badge de categoria. Boton WhatsApp. Link a `/tienda/[slug]/`. |
| `ProductDetailView.tsx` | Client | Vista completa de producto: imagen grande, nombre, categoria, descripcion, botones de accion (WhatsApp, contacto). Renderiza JSON-LD de Schema.org. Seccion de productos relacionados. Breadcrumbs de navegacion. |

#### Blog

| Componente | Boundary | Descripcion |
|-----------|---------|-------------|
| `BlogCard.tsx` | Server | Tarjeta de articulo: imagen destacada, titulo, extracto, tiempo de lectura, autor, tags. Link a `/blog/[slug]/`. |
| `BlogPostContent.tsx` | Client | Template base para articulos. Enruta a contenido especifico segun el slug: si el slug es "navidad" → `BlogNavidadContent`, si es "quito" → `BlogQuitoContent`, sino usa contenido generico. |
| `BlogNavidadContent.tsx` | Client | Contenido completo del articulo de Navidad 2025. Incluye `ProductShowcase` y `CTABanner`. |
| `BlogQuitoContent.tsx` | Client | Contenido del articulo sobre productos en Quito. |
| `CTABanner.tsx` | Client | Banner de llamada a accion reutilizable dentro de los posts del blog. |
| `ProductShowcase.tsx` | Client | Muestra una seleccion de 4 productos con imagen e info dentro de un articulo del blog. |

#### Utilidades

| Componente | Boundary | Descripcion |
|-----------|---------|-------------|
| `GoldenShimmerText.tsx` | Client | Texto con efecto CSS shimmer dorado animado. Usado para el badge "100% Personalizable". |

---

## 7. Capa de Datos

Todo el estado persistente de la aplicacion vive en archivos JSON/TS dentro de `data/`. No hay base de datos, ni ORM, ni llamadas a API externas en runtime.

### `data/products.json`

**Lineas:** ~27,000  
**Registros:** 1000+ productos

Es la fuente de verdad principal. Se actualiza diariamente por el scraper. Cada entrada tiene la siguiente forma:

```json
{
  "id": "alcancia-piggy-max-2045",
  "nombre": "Alcancia Piggy Max",
  "slug": "alcancia-piggy-max-2045",
  "categoria": "Accesorios",
  "categoria_slug": "accesorios",
  "descripcion_corta": "Alcancia en forma de cerdito...",
  "imagen_url": "/img/productos/alcancia-piggy-max-2045.jpg",
  "imagen_original_url": "https://catalogospromocionales.com/img/...",
  "codigo": null,
  "seo_title": "Alcancia Piggy Max | Productos Promocionales PromoGimmicks",
  "seo_description": "Personaliza tu alcancia piggy max con logo...",
  "seo_keywords": "alcancia, productos promocionales, merchandising"
}
```

**Campos:**
- `id` / `slug`: Generados con `slugify(nombre) + "-" + contador`. El slug es el identificador en la URL.
- `imagen_url`: Ruta local en `public/`. La imagen debe existir o el scraper la descarga con `download-images.py`.
- `imagen_original_url`: URL fuente usada para deduplicacion en el merge y para descargar la imagen.
- Campos `seo_*`: Generados por el scraper con plantillas simples.

### `data/categories.json`

**Registros:** 35+ categorias

```json
{
  "id": "precio-bomba",
  "slug": "precio-bomba",
  "name": "Precio Bomba",
  "description": "Productos con los mejores precios del mercado",
  "providerUrl": "https://catalogospromocionales.com/precio-bomba/",
  "keywords": ["ofertas", "precio bajo", "economico"]
}
```

El campo `providerUrl` es el que usa el scraper para navegar a esa categoria en el sitio del proveedor.

### `data/blog-posts.json`

**Registros:** 3 articulos

```json
{
  "id": "guia-articulos-promocionales-navidenos-2025",
  "slug": "guia-articulos-promocionales-navidenos-2025",
  "titulo": "Guia de Articulos Promocionales Navidenos 2025",
  "extracto": "Descubre los mejores productos para tu empresa...",
  "imagen_destacada": "https://images.unsplash.com/...",
  "categoria": "Navidad",
  "fecha_publicacion": "2025-12-25",
  "tiempo_lectura": "25 min",
  "autor": "PromoGimmicks",
  "tags": ["navidad", "regalos empresariales"],
  "seo_title": "Guia Articulos Promocionales Navidenos 2025 | PromoGimmicks",
  "seo_description": "Descubre los mejores articulos..."
}
```

### `data/geo-data.ts`

Archivo TypeScript (no JSON) que exporta una estructura fuertemente tipada con los datos para las 9 paginas geograficas:

```typescript
interface CityData {
  nombre: string;
  slug: string;
  pais: 'colombia' | 'ecuador';
  titulo: string;           // H1 de la pagina
  descripcion: string;      // Meta description
  introduccion: string;     // Parrafo inicial
  caracteristicas: string[];
  beneficios: string[];
}
```

Ciudades Colombia: `bogota`, `medellin`, `cali`, `barranquilla`, `cartagena`  
Ciudades Ecuador: `quito`, `guayaquil`, `cuenca`, `manta`

---

## 8. Scraper y Automatizacion

### `scripts/daily-scraper.py`

El scraper es el unico mecanismo que aumenta el catalogo. Corre en GitHub Actions y actualiza `data/products.json` directamente en el repositorio.

#### Flujo interno del scraper

```python
# Pseudocodigo del flujo principal
categories = load_json('data/categories.json')
existing_products = load_json('data/products.json')
existing_urls = {p['imagen_original_url'] for p in existing_products}

new_products = []
for category in categories:
    page = 1
    while page <= MAX_PAGES:  # hasta 50 paginas por categoria
        html = requests.get(f"{category['providerUrl']}?page={page}")
        soup = BeautifulSoup(html, 'lxml')
        
        product_elements = soup.select('.product-item')  # selector CSS
        if not product_elements:
            break  # sin mas productos en esta categoria
        
        for el in product_elements:
            img_url = el.select_one('img')['src']
            if img_url in existing_urls:
                continue  # deduplicacion
            
            product = build_product(el, category)
            new_products.append(product)
            existing_urls.add(img_url)
        
        page += 1

merged = existing_products + new_products
write_json('data/products.json', merged)
```

#### Funcion `build_product()`

Normaliza cada elemento scrapeado al esquema del JSON:

```python
def build_product(element, category):
    nombre = element.select_one('.product-name').text.strip()
    slug = slugify(nombre) + '-' + str(generate_id())
    return {
        'id': slug,
        'nombre': nombre,
        'slug': slug,
        'categoria': category['name'],
        'categoria_slug': category['slug'],
        'descripcion_corta': f"Producto promocional personalizable con logo corporativo.",
        'imagen_url': f"/img/productos/{slug}.jpg",
        'imagen_original_url': element.select_one('img')['src'],
        'codigo': None,
        'seo_title': f"{nombre} | Productos Promocionales PromoGimmicks",
        'seo_description': f"Personaliza tu {nombre.lower()} con el logo de tu empresa...",
        'seo_keywords': f"{nombre.lower()}, productos promocionales, merchandising"
    }
```

#### Funcion `slugify()`

Convierte nombres con caracteres especiales a slugs URL-seguros:

```python
# "Alcancía Piggy (Produccion Nacional)" → "alcancia-piggy-produccion-nacional"
def slugify(text):
    text = unicodedata.normalize('NFKD', text)
    text = text.encode('ascii', 'ignore').decode('ascii')
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[-\s]+', '-', text)
```

### `scripts/download-images.py`

Script auxiliar para descargar imagenes faltantes. Se ejecuta manualmente cuando hay nuevos productos sin imagen local.

```python
for product in products:
    local_path = f"public{product['imagen_url']}"
    if os.path.exists(local_path):
        continue  # ya descargada
    
    response = requests.get(product['imagen_original_url'])
    with open(local_path, 'wb') as f:
        f.write(response.content)
    
    time.sleep(0.3)  # rate limiting
```

---

## 9. SEO y Metadata

La estrategia SEO es integral y opera en multiples capas.

### 9.1 Metadata estatica (layout.tsx)

El layout raiz define metadata base que heredan todas las paginas:

```typescript
export const metadata: Metadata = {
  title: { template: '%s | PromoGimmicks', default: 'PromoGimmicks' },
  description: 'Productos promocionales personalizables...',
  alternates: {
    canonical: 'https://promogimmicks.com',
    languages: { 'es': '/', 'es-EC': '/', 'es-CO': '/' }
  }
}
```

### 9.2 Metadata dinamica por pagina (generateMetadata)

Las paginas con rutas dinamicas tienen `generateMetadata` asincrono:

```typescript
// tienda/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = products.find(p => p.slug === params.slug);
  return {
    title: product.seo_title,
    description: product.seo_description,
    keywords: product.seo_keywords,
    openGraph: {
      title: product.seo_title,
      description: product.seo_description,
      images: [{ url: `https://promogimmicks.com${product.imagen_url}` }],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.seo_title
    }
  };
}
```

### 9.3 Schema.org JSON-LD

Los datos estructurados se inyectan como script en el DOM para Google y otros motores:

**Paginas de producto** — tipo `Product` + `BreadcrumbList`:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Alcancia Piggy Max",
  "description": "...",
  "image": "https://promogimmicks.com/img/productos/...",
  "brand": { "@type": "Brand", "name": "PromoGimmicks" },
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceCurrency": "USD"
  }
}
```

**Paginas geograficas** — tipo `LocalBusiness`:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "PromoGimmicks",
  "description": "Productos promocionales en Bogota",
  "address": { "@type": "PostalAddress", "addressCountry": "CO" },
  "serviceArea": { "@type": "City", "name": "Bogota" }
}
```

### 9.4 Sitemap XML dinamico (app/sitemap.ts)

El sitemap se genera en build-time con todas las URLs:

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  const productUrls = products.map(p => ({
    url: `https://promogimmicks.com/tienda/${p.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  const categoryUrls = categories.map(c => ({
    url: `https://promogimmicks.com/tienda/categoria/${c.slug}/`,
    changeFrequency: 'daily',
    priority: 0.7
  }));

  // + geo pages + blog + static pages
  return [...staticUrls, ...productUrls, ...categoryUrls, ...geoUrls, ...blogUrls];
}
```

**Total: ~1052 entradas en el sitemap.**

### 9.5 Robots.txt (app/robots.ts)

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] },
    sitemap: 'https://promogimmicks.com/sitemap.xml'
  };
}
```

### 9.6 Estrategia de keywords geograficas

Las paginas en `/productos-promocionales-colombia/` y `/productos-promocionales-ecuador/` capturan busquedas de intento local-comercial como:

- "productos promocionales Bogota empresa"
- "merchandising corporativo Quito precio"
- "regalos empresariales Medellin"

Cada pagina tiene titulo H1, descripcion, lista de beneficios y schema `LocalBusiness` especifico para la ciudad, maximizando la relevancia geografica sin duplicar contenido genericamente.

---

## 10. Interactividad Client-Side

Al ser un sitio estatico, toda la interactividad ocurre en el browser post-hidratacion.

### Busqueda y filtrado en TiendaGrid

```typescript
// Filtrado reactivo con useMemo para evitar re-calculos
const filtered = useMemo(() => {
  if (!query) return products;
  const q = query.toLowerCase();
  return products.filter(p =>
    p.nombre.toLowerCase().includes(q) ||
    p.categoria.toLowerCase().includes(q) ||
    (p.codigo && p.codigo.toLowerCase().includes(q))
  );
}, [products, query]);
```

La busqueda opera sobre el array completo en memoria (1000+ items). El filtrado es instantaneo porque no hay latencia de red.

### Scroll infinito con IntersectionObserver

```typescript
const sentinelRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && page * PAGE_SIZE < filtered.length) {
        setPage(p => p + 1);
      }
    },
    { rootMargin: '100px' }  // empieza a cargar 100px antes del fondo
  );

  if (sentinelRef.current) observer.observe(sentinelRef.current);
  return () => observer.disconnect();
}, [filtered.length, page]);

// Productos visibles: primeros (page * PAGE_SIZE) del array filtrado
const visible = filtered.slice(0, page * PAGE_SIZE);
```

El `PAGE_SIZE` es 20. Cuando el sentinel entra en viewport, se incrementa `page`, lo que actualiza `visible` y renderiza 20 productos mas.

### Lazy loading de imagenes en ProductCard

Cada `ProductCard` tiene su propio `IntersectionObserver` independiente:

```typescript
useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      setIsVisible(true);
      observer.disconnect();
    }
  });
  if (cardRef.current) observer.observe(cardRef.current);
  return () => observer.disconnect();
}, []);

// En el JSX:
{isVisible
  ? <Image src={product.imagen_url} ... />
  : <div className="animate-pulse bg-gray-200 h-48" />  // shimmer
}
```

Esto evita descargar 1000+ imagenes de golpe. Solo se cargan las que el usuario realmente ve.

### Efectos de scroll en Navbar

```typescript
useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 50);
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// En el JSX:
className={`fixed top-0 transition-all ${
  scrolled ? 'bg-navy-900 shadow-lg' : 'bg-transparent'
}`}
```

El `passive: true` evita bloquear el hilo principal durante el scroll.

### Formulario de contacto con Formspree

```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setStatus('sending');

  const res = await fetch('https://formspree.io/f/mzznadzv', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });

  setStatus(res.ok ? 'success' : 'error');
};
```

No hay backend propio. Formspree recibe el formulario, reenvía el email al destinatario configurado en su dashboard, y devuelve 200 OK.

---

## 11. Imagenes y Assets

### Loader personalizado para Netlify Image CDN

```javascript
// lib/netlifyImageLoader.js
export default function netlifyImageLoader({ src, width, quality }) {
  if (process.env.NODE_ENV === 'development') {
    return src;  // desarrollo: URL directa
  }
  // produccion: enruta por /.netlify/images para optimizacion
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
```

Este loader convierte cada `<Image>` de Next.js en una URL optimizada por el CDN de Netlify, que:
- Sirve WebP o AVIF segun lo que soporte el browser
- Redimensiona al `width` solicitado
- Comprime con la `quality` especificada
- Tiene cache en CDN global

### Configuracion en next.config.js

```javascript
module.exports = {
  output: 'export',
  trailingSlash: true,
  images: {
    loader: 'custom',
    loaderFile: './lib/netlifyImageLoader.js'
  }
}
```

### Estructura de assets

| Directorio | Contenido | Cantidad aprox. |
|-----------|----------|----------------|
| `public/img/productos/` | Fotos de cada producto | 1000+ JPG |
| `public/img/imagenes-catalogos/` | premium.jpg, mp.jpg, cdo.jpg, bs.jpg | 4 |
| `public/img/imagenes-de-stock/` | 1.jpg ... 12.jpg (galeria home) | 12 |
| `public/img/imagenes-productos-virales/` | Fotos carrusel home | ~6 |
| `public/img/adri_asistente/` | Fotos del equipo | ~3 |
| `public/img/blog/` | Imagenes destacadas blog | 3 |
| `public/videos/` | hero-video.mp4 (1920x1080) | 1 |

---

## 12. CI/CD y GitHub Actions

### Workflow: `.github/workflows/daily-scraper.yml`

```yaml
name: Daily Product Scraper

on:
  schedule:
    - cron: '0 7 * * *'     # 07:00 UTC = 02:00 Ecuador (America/Guayaquil)
  workflow_dispatch:          # Ejecucion manual desde GitHub UI

permissions:
  contents: write             # Necesario para git push

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python 3.11
        uses: actions/setup-python@v4
        with: { python-version: '3.11' }

      - name: Install dependencies
        run: pip install requests beautifulsoup4 lxml

      - name: Run scraper
        run: python scripts/daily-scraper.py

      - name: Commit if changed
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add data/products.json
          git diff --staged --quiet || \
            git commit -m "chore(data): daily scraper update [skip ci]"

      - name: Push
        run: git push
```

**El mensaje `[skip ci]` evita que el push del bot dispare otro workflow** (loop infinito).

### Pipeline completo de deploy

```
Scraper actualiza products.json
        │
        ▼
git push a rama master
        │
        ▼
Netlify detecta el push (webhook)
        │
        ▼
Netlify ejecuta: npm run build
        │
        ├── generateStaticParams → 1052 paginas
        ├── generateMetadata → meta tags por pagina
        └── sitemap.ts → sitemap.xml
        │
        ▼
Netlify sube out/ al CDN global
        │
        ▼
Sitio actualizado en ~2-3 minutos
```

---

## 13. Configuracion

### `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // Sin servidor: genera archivos estaticos en out/
  trailingSlash: true,        // /tienda/producto/ en lugar de /tienda/producto
  images: {
    loader: 'custom',
    loaderFile: './lib/netlifyImageLoader.js'
  }
};
module.exports = nextConfig;
```

### `tailwind.config.ts`

```typescript
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      },
      fontFamily: {
        sora: ['var(--font-sora)']
      }
    }
  }
};
```

La fuente **Sora** se carga desde Google Fonts a traves de `next/font/google` en `layout.tsx` y se expone como variable CSS `--font-sora`.

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "strict": true,
    "paths": { "@/*": ["./*"] }
  }
}
```

El alias `@/` permite imports absolutos desde la raiz del proyecto en lugar de rutas relativas largas.

---

## 14. Paleta de Colores

| Color | Codigo Hex | Uso principal |
|-------|-----------|---------------|
| Azul Profundo | `#1e3a8a` | Encabezados, navbar, autoridad de marca |
| Azul Cielo | `#0ea5e9` | Acentos, links, highlights |
| Ambar / Dorado | `#f59e0b` | CTAs primarios, badges, shimmer text |
| Blanco | `#ffffff` | Fondos principales, texto sobre oscuro |
| Gris Muy Claro | `#f8fafc` | Fondos de secciones alternadas |
| Gris Medio | `#6b7280` | Texto secundario, metadatos |
| Verde | `#22c55e` | Indicadores de disponibilidad, exito en formulario |

La combinacion azul marino + ambar es el sistema de identidad principal: azul para confianza/corporativo, ambar para urgencia/accion.

---

## 15. Estructura de Datos

### products.json — esquema completo

```json
{
  "id": "string",              // slug unico (PK de facto)
  "nombre": "string",          // Nombre del producto tal como viene del proveedor
  "slug": "string",            // URL-safe, unico, usado en rutas
  "categoria": "string",       // Nombre de la categoria (display)
  "categoria_slug": "string",  // Slug de la categoria (para filtros y rutas)
  "descripcion_corta": "string", // 1-2 oraciones generadas por el scraper
  "imagen_url": "string",      // Ruta local: /img/productos/[slug].jpg
  "imagen_original_url": "string", // URL fuente para deduplicacion
  "codigo": "string | null",   // Codigo del proveedor (a veces null)
  "seo_title": "string",       // <title> de la pagina del producto
  "seo_description": "string", // <meta description>
  "seo_keywords": "string"     // keywords separadas por coma
}
```

### categories.json — esquema completo

```json
{
  "id": "string",          // slug unico
  "slug": "string",        // URL slug para /tienda/categoria/[slug]/
  "name": "string",        // Nombre display
  "description": "string", // Descripcion de la categoria
  "providerUrl": "string", // URL que crawlea el scraper
  "keywords": ["string"]   // Array de keywords SEO
}
```

### blog-posts.json — esquema completo

```json
{
  "id": "string",
  "slug": "string",
  "titulo": "string",
  "extracto": "string",
  "imagen_destacada": "string",   // URL externa (Unsplash)
  "categoria": "string",
  "fecha_publicacion": "YYYY-MM-DD",
  "tiempo_lectura": "string",
  "autor": "string",
  "tags": ["string"],
  "seo_title": "string",
  "seo_description": "string"
}
```

---

## 16. Instalacion y Scripts

```bash
# Clonar repositorio
git clone https://github.com/edt092/promogimmicks.git
cd promogimmicks

# Instalar dependencias Node
npm install

# Desarrollo local
npm run dev       # http://localhost:3000

# Build estatico
npm run build     # genera out/

# Lint
npm run lint
```

### Scripts Python (scraper)

```bash
# Instalar dependencias del scraper
pip install requests beautifulsoup4 lxml

# Ejecutar scraper manualmente
python scripts/daily-scraper.py

# Descargar imagenes faltantes
python scripts/download-images.py
```

### Scripts disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con hot-reload en localhost:3000 |
| `npm run build` | Genera sitio estatico completo en `out/` |
| `npm run lint` | Analisis estatico con ESLint |
| `python scripts/daily-scraper.py` | Scrapa nuevos productos y actualiza products.json |
| `python scripts/download-images.py` | Descarga imagenes de productos sin imagen local |

---

## 17. Contacto

| Canal | Detalle |
|-------|---------|
| Email general | info@promogimmicks.com |
| Email corporativo | corporativo@promogimmicks.com |
| WhatsApp Ecuador | +593 99 859 4123 |
| WhatsApp Colombia | +57 315 559 5134 |
| Oficina Ecuador | Av. Las Palmas, 63 |
| Oficina Colombia | Calle 22 #1571 los cedros |
| Formulario web | Formspree ID: `mzznadzv` |

---

**Desarrollado por [Bayona Digital Systems](https://edwinbayonaitmanager.online)**  
Proyecto privado — Todos los derechos reservados.
