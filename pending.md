# Pending Tasks

## Brand / Assets

- [x] ~~Comprar licencia de la fuente "Tan Variety"~~ → **Resuelto**. El cliente decidió no perseguir Tan Variety/Playfair Display y en su lugar eligió **Figtree** (títulos Light / texto Regular) + **Source Serif 4** (palabras clave, Light Italic), ambas gratuitas vía Google Fonts y cargadas con `next/font/google` en `src/app/fonts.ts`. Ver [docs/BRAND_MANUAL.md §4](docs/BRAND_MANUAL.md#4-typografie).
- [ ] **Logo actual no encaja con la página**: revisar posible solución (ajuste visual, variante alternativa o rediseño ligero para que armonice con el diseño del sitio).

## Diseño / Referencias

- [ ] **Template Framer no descargable**: el template [Éclat Aesthetics](https://apparent-watching-815066.framer.app/) no se pudo descargar; no pudimos trabajar directamente sobre él como referencia o base de diseño.

## Seguridad / Configuración

- [ ] **Cambiar todas las contraseñas/secrets en `.env`** antes de ir a producción (`ADMIN_PASSWORD`, `SESSION_SECRET`, `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`). Los valores actuales son solo para desarrollo local y están en `.env` (gitignored, nunca se sube al repo).
- [x] ~~El CMS escribía en `data/content.json` en el filesystem~~ → Migrado a MySQL vía Prisma. Los datos iniciales ahora viven embebidos en `prisma/seed.ts` (ya no hay `data/content.json`).
- [ ] Definir `DATABASE_URL`, `ADMIN_PASSWORD` y `SESSION_SECRET` como variables de entorno en el hosting real (VPS/servidor) al desplegar — ya no depende de un filesystem local, así que sí es compatible con la mayoría de hosts, pero Vercel serverless requeriría una base de datos MySQL gestionada externa (PlanetScale, RDS, etc.) en vez del contenedor de `docker-compose.yml`.

## Infraestructura (MySQL + Docker) — completado

- [x] Backend migrado de JSON local a **MySQL** vía Prisma ORM (`prisma/schema.prisma`, `src/lib/content.ts`, `src/lib/prisma.ts`).
- [x] `Dockerfile` (multi-stage) + `docker-compose.yml` (app + MySQL + Adminer) — probado end-to-end con `docker compose up -d --build`.
- [x] Migraciones (`prisma/migrations/`) y seed idempotente (`prisma/seed.ts`) corren automáticamente al iniciar el contenedor `app` (`docker-entrypoint.sh`).
- [ ] Si el equipo crece o se despliega en un entorno serverless, evaluar mover el `DATABASE_URL` a un MySQL gestionado (no local en Docker).

## Estructura de la web (según docs/remixed-bb4f3136.html) — completado

- [x] Implementadas las **3 páginas** como rutas de Next.js: `/` (Home), `/leistungen` (Leistungen & Preise), `/ueber-andrea` (Über Andrea), con Nav + Footer compartidos.
- [x] Todo el contenido (hero, badges, stats, marcas, highlight, servicios, proceso, testimonios home/about, FAQ, bio de Andrea, diplomas, valores, intro de precios, tablas de precios por categoría, contacto y overlines de sección) es **editable desde `/admin`** y persiste en MySQL.
- [x] **Páginas legales**: `/impressum` y `/datenschutz` (agosto 2026), adaptadas a la tipografía y los colores de marca a partir del HTML que envió el cliente (guardado como referencia en `docs/impressum-beauty-palast.html` y `docs/datenschutz-beauty-palast.html`). Enlazadas en el footer y en el `sitemap.xml`, con meta-título/descripción propios. Editables en `/admin` → grupo **Rechtliches**: cabecera, índice, secciones (normal / con tarjeta / caja de aviso), tablas de datos y la caja de contacto final. Los textos aceptan un formato ligero (línea en blanco = párrafo, `- ` = viñeta, `> ` = nota pequeña, `**negrita**`, `*cursiva*`, `[texto](enlace)`) — ver `src/components/RichText.tsx`.

## Páginas legales — pendientes

- [ ] **Validación legal del contenido**: los textos son los que envió el cliente. Conviene que Andrea (o su asesor) confirme los datos del Impressum (forma jurídica, exención de IVA, horarios) y el "Stand: 2025" antes de publicar — el año se edita en `/admin` → *Rechtliches*.
- [ ] **Coherencia con el tracking**: la Datenschutzerklärung declara que la web **no usa cookies de tracking ni Google Analytics**. Si el cliente activa GA4 / GTM / Meta Pixel en *SEO & Marketing*, hay que actualizar la sección 07 y valorar un banner de consentimiento.

## SEO & Marketing — completado

- [x] **SEO técnico**: `sitemap.xml` y `robots.txt` dinámicos ([src/app/sitemap.ts](src/app/sitemap.ts), [src/app/robots.ts](src/app/robots.ts)), canonical por página, Open Graph + Twitter Card, y structured data `BeautySalon` (JSON-LD) para SEO local, todo en [src/lib/seo.ts](src/lib/seo.ts) + [layout.tsx](src/app/layout.tsx).
- [x] **Ajustes SEO editables desde `/admin`** (sección "SEO & Marketing", estilo Yoast): URL del sitio, plantilla de título, título/descripción por defecto, imagen OG (subible), y meta-título + meta-descripción por página (Startseite / Leistungen / Über Andrea).
- [x] **Tags de marketing/tracking editables**: Google Analytics (GA4), Google Tag Manager, Meta/Facebook Pixel y código de verificación de Google Search Console. Se inyectan solo si el campo tiene valor ([src/components/TrackingScripts.tsx](src/components/TrackingScripts.tsx)).
- [ ] **Configurar los valores reales**: falta que el cliente pegue su ID de GA4/GTM/Pixel y el código de Search Console. `siteUrl` ya está en `https://beauty-palast.ch` (dominio del manual) — confirmar que sea el definitivo antes de publicar.
- [ ] **Enviar el sitemap** a Google Search Console y Bing Webmaster Tools una vez el sitio esté en producción con dominio real.

## Estructura — pendientes menores

- [x] ~~Subir imágenes desde el CMS~~ → **Hecho**. El hero, el bloque highlight, cada tarjeta de servicio y el retrato de "Über Andrea" tienen un campo de imagen en `/admin`. Las imágenes se guardan en `docker/uploads/` (bind mount, persisten entre reconstrucciones del contenedor), se sirven por `GET /uploads/{id}.{ext}` y se suben por `POST /api/admin/images` (protegido, máx. 5 MB, JPG/PNG/WebP/GIF/AVIF). Las URLs antiguas `/api/images/{id}` redirigen automáticamente. Si no hay imagen, se muestra el degradado de marca como fallback.
- [ ] **Fotos de la galería y videos de la anfahrt**: la galería (`/admin` → *Allgemein · Galerie*) y los dos videos (*Allgemein · Videos (Anfahrt)*) están implementados pero **vacíos**. Mientras no haya contenido, esas secciones simplemente no se renderizan. Falta que el cliente suba las fotos del local y los dos MP4. Límite de video: **90 MB** — por encima de eso Cloudflare corta la subida antes de que llegue a la app.
- [ ] **Contenido de las imágenes**: siguen faltando las fotos reales. Ver [docs/IMAGE_PROMPTS.md](docs/IMAGE_PROMPTS.md) — prompts de IA por imagen y la advertencia de usar foto real (no IA) para el retrato de Andrea y el estudio. Ahora se suben directo desde `/admin` (ya no hace falta tocar `public/` ni el código).
- [ ] **Archivos huérfanos**: al reemplazar o quitar una imagen, el archivo anterior queda en `docker/uploads/` sin referencia. Con los **videos** esto ya no es despreciable (hasta 90 MB por archivo), así que conviene un job de limpieza que borre archivos no referenciados por ningún `*.imageUrl` / `*.videoUrl` / `*.posterUrl`.
- [ ] **Sin reordenar en el CMS**: `ListEditor` (`src/app/admin/page.tsx`) no tiene flechas ↑/↓ ni drag. El orden es el orden de la lista, así que reordenar fotos de la galería obliga a borrar y volver a agregar. Añadir el par de botones en `ListEditor` beneficiaría de golpe a las 17 listas del panel.
- [ ] **Peso de la galería**: las imágenes se sirven sin redimensionar y todos los `<Image>` usan `unoptimized`. Con una docena de fotos de teléfono sin comprimir la página se vuelve pesada. Corto plazo: pedirle al cliente que suba imágenes ya escaladas; medio plazo: redimensionar con `sharp` en `POST /api/admin/images`.
- [ ] **Caja "So finden Sie uns"** (Kontakt): los 3 pasos (Adresse / Mit dem Zug / Mit dem Auto) están como texto estático en `src/components/ContactSection.tsx` (la dirección y el link de Maps sí salen del CMS). Si se quiere editar esos pasos desde `/admin`, hay que añadir un modelo `DirectionStep`.
- [x] ~~Subir el logo desde el CMS~~ → **Hecho**. Campo "Logo" en la sección *Kontakt & Zeiten* del `/admin`. Si hay logo, aparece en el nav (arriba); si no, se muestra el nombre del negocio como texto (fallback). Se guarda en `docker/uploads/` igual que las demás imágenes.
- [x] ~~Logo en el footer (fondo oscuro)~~ → **Hecho**. Segundo campo "Logo (weiss, für dunklen Hintergrund)" en la sección *Kontakt & Zeiten*. Si se sube la variante blanca del logo, aparece en el footer; si no, se muestra el nombre del negocio como texto (fallback). El logo normal (oscuro) va en el nav, el blanco en el footer.
- [x] ~~Fuente del texto-logo~~ → **Resuelto**. Mientras no haya logo subido, el nombre se muestra en Source Serif 4 Light Italic (`.font-accent-italic`), la fuente definitiva elegida por el cliente para acentos/logo-fallback.

