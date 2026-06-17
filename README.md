# PromoGimmicks — Promotional Products E-commerce Platform

> Full-stack marketing website for a promotional products company in Ecuador. Built with Next.js 14, automated product scraping, and a strong SEO foundation.

**Live site:** [promogimmicks.com](https://promogimmicks.com)

---

## Overview

PromoGimmicks is a production e-commerce platform that showcases 1,000+ customizable promotional products for Ecuadorian businesses. The project combines a modern React frontend with an automated Python scraping pipeline that keeps the product catalog up to date daily without any manual work.

Key business outcomes delivered:
- Daily automated catalog updates via GitHub Actions (zero manual intervention)
- 1,000+ product pages with full SEO markup generated at build time
- Static site with sub-second load times deployed on Netlify's CDN
- Location-specific landing pages targeting major Ecuadorian cities for local SEO

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, Static Export) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Deployment | Netlify (CDN + CI/CD) |
| Automation | Python 3 + BeautifulSoup + GitHub Actions |
| SEO | next/metadata, JSON-LD schema, XML sitemap, robots.txt |

---

## Features

### Frontend
- **Static site generation (SSG)** — all 1,000+ product pages pre-rendered at build time for maximum performance
- **Dynamic category system** — products organized by category with dedicated SEO-optimized pages
- **Blog** — content marketing with structured blog posts
- **Location pages** — city-level landing pages (Quito, Guayaquil, Cuenca, Manta) for local SEO
- **Responsive design** — mobile-first, tested across breakpoints
- **Animations** — scroll-triggered and entry animations with Framer Motion

### SEO & Performance
- Canonical URLs, Open Graph, Twitter Cards on every page
- JSON-LD structured data (Product, Organization, BreadcrumbList schemas)
- XML sitemap auto-generated from product and blog data
- `robots.txt` with crawl directives
- Netlify `_headers` for cache control and security headers
- 301 redirect map managed via `public/_redirects`

### Automation Pipeline
- **Daily scraper** (`scripts/daily-scraper.py`) runs on GitHub Actions every day at 07:00 UTC
- Scrapes product data (name, description, price, images, categories) from upstream supplier
- Commits updated `data/products.json` directly to the repo, triggering a Netlify rebuild
- Batch-based processing with retry logic to handle rate limits

---

## Project Structure

```
├── app/                        # Next.js App Router pages
│   ├── tienda/                 # Store — product listing and detail pages
│   │   ├── [slug]/             # Individual product pages (SSG)
│   │   └── categoria/[slug]/   # Category pages
│   ├── productos-promocionales-ecuador/  # Location SEO pages
│   ├── blog/                   # Blog listing and post pages
│   ├── sitemap.ts              # Auto-generated XML sitemap
│   └── robots.ts               # robots.txt
├── components/                 # Reusable React components
├── data/
│   ├── products.json           # Product catalog (updated daily by scraper)
│   ├── blog-posts.json         # Blog content
│   └── geo-data.ts             # Location data for SEO pages
├── scripts/
│   ├── daily-scraper.py        # Main automation — runs via GitHub Actions
│   ├── generate_redirects.py   # Generates 301 redirect map from slug changes
│   └── download-images.py      # Bulk image downloader for new products
├── public/
│   ├── _redirects              # Netlify redirect rules (1,000+ product redirects)
│   └── _headers                # Netlify cache and security headers
└── .github/workflows/          # GitHub Actions CI/CD
```

---

## Local Development

**Requirements:** Node.js 18+, npm

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build static export
npm run build
```

The site exports to `/out` as a fully static site ready for any CDN.

### Running the scraper locally

```bash
pip install requests beautifulsoup4 lxml
python scripts/daily-scraper.py
```

---

## Automation Architecture

```
GitHub Actions (cron: daily)
        │
        ▼
daily-scraper.py
  └── Scrapes supplier catalog
  └── Merges with existing products.json
  └── Commits changes → triggers Netlify build
        │
        ▼
Netlify Build
  └── next build → static export
  └── 1,000+ product pages pre-rendered
  └── Deployed to global CDN
```

---

## SEO Implementation

- **Product pages:** unique title, meta description, Open Graph image, JSON-LD `Product` schema with `offers`, `aggregateRating`, and `areaServed`
- **Category pages:** keyword-rich descriptions, breadcrumb schema, internal linking
- **Location pages:** geo-targeted content for each major city, `LocalBusiness` schema
- **Sitemap:** dynamically generated from `data/products.json` + blog posts; static dates used to avoid false re-crawl signals
- **Redirects:** 1,000+ 301 redirects maintained for all slug migrations to preserve link equity

---

## License

Private project — all rights reserved. Code samples available for portfolio review purposes.
