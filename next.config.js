/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    loader: 'custom',
    loaderFile: './lib/netlifyImageLoader.js',
    // Menos anchos que los valores por defecto (8 deviceSizes hasta 3840 + 8 imageSizes):
    // cada <img>/preload repetía 16 URLs en srcset; el sitio no muestra imágenes > 1920 px.
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [96, 192, 256, 384],
  },
  trailingSlash: true,
}

module.exports = nextConfig
