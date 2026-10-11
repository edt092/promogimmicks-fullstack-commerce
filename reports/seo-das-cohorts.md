# Cohortes de "Rastreada: actualmente sin indexar" (export previo por URL)

Fuente: `reports/gsc_audit_report.json` (export anterior; fechas de rastreo propias). **No** es la lista de las 716 URLs
del informe de octubre: esa lista por URL no está disponible. Correlación no implica causa.

- URLs activas/canónicas en DAS del export previo: **104** (96 productos activos, 8 otras).
- Con imagen placeholder: 0
- Nombre de 1–2 palabras (poco descriptivo): 10
- Descripción corta < 120 caracteres: 2
- Generadas por IA (`ai_generated`): 0
- Host del registro: {'canonico': 104}

| Categoría | URLs DAS (export previo) | Productos en catálogo | % de la categoría |
|---|---:|---:|---:|
| tomatodos-y-botilitos-personalizados | 18 | 106 | 17.0 % |
| articulos-escritura | 13 | 303 | 4.3 % |
| maletines | 11 | 169 | 6.5 % |
| tecnologia | 10 | 101 | 9.9 % |
| oficina | 8 | 180 | 4.4 % |
| ecologia | 8 | 119 | 6.7 % |
| hogar | 6 | 198 | 3.0 % |
| precio-bomba | 6 | 133 | 4.5 % |
| llaveros | 4 | 45 | 8.9 % |
| econature | 3 | 36 | 8.3 % |
| deportes | 3 | 48 | 6.2 % |
| juegos | 2 | 19 | 10.5 % |
| bar-y-vino | 1 | 43 | 2.3 % |
| reflectivos | 1 | 12 | 8.3 % |
| antiestres | 1 | 39 | 2.6 % |
| paraguas | 1 | 37 | 2.7 % |

## Muestra estratificada (1 por categoría, hasta 15)

| URL | Categoría | Placeholder | Nombre corto | Desc. (car.) | Enlaces internos (build actual) | Último rastreo |
|---|---|---|---|---:|---:|---|
| /tienda/portacomidas-spencer-10334/ | hogar | no | sí | 244 | 8 | 2026-07-25 |
| /tienda/botilito-metalico-murphy-750ml-10503/ | tomatodos-y-botilitos-personalizados | no | no | 186 | 7 | 2026-07-02 |
| /tienda/libreta-con-boligrafo-leroy-eco-10106/ | articulos-escritura | no | no | 189 | 13 | 2026-07-01 |
| /tienda/juego-cartas-y-domino-eco-11013/ | juegos | no | no | 184 | 7 | 2026-07-01 |
| /tienda/speaker-bluetooth-cyrus-cork-10475/ | precio-bomba | no | no | 172 | 8 | 2026-06-30 |
| /tienda/libreta-cork-9111/ | oficina | no | sí | 179 | 5 | 2026-06-30 |
| /tienda/llavero-portacelular-nook-13323/ | llaveros | no | no | 193 | 7 | 2026-06-30 |
| /tienda/morral-backpack-prince-urban-travel-10548/ | maletines | no | no | 161 | 4 | 2026-06-30 |
| /tienda/set-de-herramientas-maxton-10053/ | ecologia | no | no | 219 | 2 | 2026-06-30 |
| /tienda/set-portavasos-bamboo-puzzle-10072/ | bar-y-vino | no | no | 210 | 3 | 2026-06-26 |
| /tienda/bolsa-en-cambrel-reflectiva-8199/ | reflectivos | no | no | 172 | 7 | 2026-05-29 |
| /tienda/portatarjetas-con-organizador-de-cables-8109/ | tecnologia | no | no | 221 | 3 | 2026-05-15 |
| /tienda/abanico-con-mango-stick-produccion-nacional-5382/ | econature | no | no | 199 | 5 | 2026-05-06 |
| /tienda/llavero-con-capa-3336/ | deportes | no | no | 177 | 4 | 2026-05-06 |
| /tienda/set-de-pelotas-cork-10434/ | antiestres | no | no | 171 | 3 | 2026-05-06 |

## Lectura

- Las fichas de esta cohorte comparten plantilla con el resto del catálogo; antes de esta implementación incluían
  bloques idénticos por categoría (usos/atributos) y promesas de Colombia, ahora retirados.
- Siguiente paso: exportar las 716 URLs actuales por motivo, cruzarlas con esta tabla y priorizar enriquecimiento
  (atributos verificados, nombre descriptivo, imagen real) por tráfico/intención; **no** aplicar noindex masivo.
