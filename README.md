# Beauty Palast — Website + CMS

Next.js website for Beauty Palast (Andrea Teles, Visp) with a built-in CMS
(`/admin`) backed by MySQL via Prisma.

Structure follows `docs/remixed-bb4f3136.html`. Three routes:

- `/` — Home (hero, stats, brands, highlight, services preview, process, testimonials, FAQ, contact)
- `/leistungen` — Leistungen & Preise (full price tables by category)
- `/ueber-andrea` — Über Andrea (bio, diplomas, values, testimonials)

Colors and typography come from [docs/BRAND_MANUAL.md](docs/BRAND_MANUAL.md);
see [pending.md](pending.md) for outstanding tasks.

## Running everything with Docker (recommended)

This spins up MySQL, runs migrations + seed automatically, and starts the app.

```bash
cp .env.example .env   # then edit passwords/secrets
docker compose up -d --build
```

- App: http://localhost:3000
- Admin CMS: http://localhost:3000/admin (password = `ADMIN_PASSWORD` from `.env`)
- Adminer (DB browser): http://localhost:8080 (server: `db`, user/password/db from `.env`)

## Local development (without Docker for the app)

Requires the MySQL container running (`docker compose up -d db`) and a `.env`
with `DATABASE_URL` pointing at `localhost:3306`.

```bash
npm install
DATABASE_URL="mysql://root:<root-pw>@localhost:3306/beautypalast" npx prisma migrate dev   # first time only (root needed for the shadow DB)
npx prisma db seed       # first time only, loads default content
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content model

- `prisma/schema.prisma` — MySQL schema for every editable section across all
  three pages (hero, badges/stats, brands, highlight, services, process,
  testimonials, FAQ, about page, diplomas, values, price groups/items, section
  headings, contact).
- `prisma/seed.ts` — default content (transcribed from the remixed HTML), loaded
  by `prisma db seed`. Idempotent: it only inserts when the DB is empty, so it
  never overwrites CMS edits on container restart.
- `src/lib/content.ts` — typed `getContent()` / `saveContent()` used by the
  pages and the admin API.
- `/admin` — form-based editor (reads/writes the DB), protected by a password
  (`ADMIN_PASSWORD` + `SESSION_SECRET`, see `src/lib/auth.ts` and
  `src/middleware.ts`).

## Fonts

Self-hosted in `public/fonts/` (Montserrat, Playfair Display — both free
Google Fonts). The brand's actual title font, **Tan Variety**, is a paid font
not yet licensed — see [pending.md](pending.md).
