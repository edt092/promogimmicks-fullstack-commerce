-- PromoGimmicks — Esquema Neon Postgres
-- Fuente de verdad del catálogo: categorías + productos con SKU único y contenido SEO enriquecido por IA.

CREATE TABLE IF NOT EXISTS categories (
  id            SERIAL PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  provider_url  TEXT,
  keywords      TEXT[],
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id                    SERIAL PRIMARY KEY,
  sku                   TEXT UNIQUE NOT NULL,
  legacy_id             TEXT UNIQUE NOT NULL,
  slug                  TEXT UNIQUE NOT NULL,
  nombre                TEXT NOT NULL,
  category_id           INTEGER NOT NULL REFERENCES categories(id),
  descripcion_corta     TEXT,
  seo_title             TEXT,
  seo_description       TEXT,
  seo_keywords          TEXT,
  imagen_url            TEXT,
  imagen_original_url   TEXT,
  ai_generated          BOOLEAN NOT NULL DEFAULT false,
  ai_model              TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category   ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku         ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_nombre_trgm ON products USING gin (to_tsvector('spanish', nombre));
