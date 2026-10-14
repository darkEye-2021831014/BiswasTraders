# M/S Biswas Traders — Website

The public website for **মেসার্স বিশ্বাস ট্রেডার্স / M/S Biswas Traders** — a
building-materials supplier in Singair, Manikganj, Bangladesh.

The site has one job: visitors see products, then **call or WhatsApp** for
the price. We never display prices on the site. Bangla is the default
language, English is the alternate, mobile-first at 360px, WCAG AA.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000  (BN default)
npm run build        # production build
npm run start        # serve the build
```

Other checks:

```bash
npm run typecheck    # TypeScript --noEmit
npm run lint         # next lint
npm run test         # vitest (the estimator library has 44 tests)
npm run content:check   # print every TODO(owner) and every null UI field
npm run og:regen       # rebuild /public/og.jpg from the brand colors
```

The site is fully static and works without any `.env` file. If you want to
override the production URL (used for canonical / sitemap / JSON-LD), set
`NEXT_PUBLIC_SITE_URL` before `npm run build` — otherwise it falls back to
`https://biswastraders.trade`.

---

## Editing the site

Almost everything you, the owner, will ever want to change lives in
**one folder**: [`src/content/`](./src/content/). Touching components
should be rare.

### 1. `src/content/site.ts` — business identity

This is the single source of truth. Fields that are confirmed are filled
in; fields the owner hasn't yet told us about are `null` with a
`// TODO(owner)` comment.

| Field                  | What it is                                                 | Edit when                                |
| ---------------------- | ---------------------------------------------------------- | ---------------------------------------- |
| `name`, `legalName`    | The business name in BN/EN                                 | The legal name ever changes              |
| `address`              | The depot address in BN/EN                                 | You move / the address changes           |
| `phone`                | BD mobile, used for display + the `tel:` link              | You change number                        |
| `whatsapp`             | E.164 without `+` (e.g. `8801729997977`), used for wa.me   | You change number                        |
| `facebookUrl`          | Your Facebook page                                         | You change the page                      |
| `googleMapsUrl`        | A **share** link to the yard (a button on the contact page)| You have a Google Maps share link        |
| `googleMapsEmbedUrl`   | A `google.com/maps/embed?pb=...` link for the iframe       | You want the contact page to embed a map |
| `hours`                | `{ general, friday }` opening hours                        | You confirm business hours               |
| `notice`               | A one-liner banner shown above the header                  | You want to alert customers (e.g. Eid)   |
| `landmarks[]`          | Nearby landmarks shown on the contact page                 | You want to add a "how to find us" hint  |
| `serviceZones[]`       | Where you deliver. Each has `id`, BN/EN name, `distanceKm` | You expand or contract the delivery area |
| `vehicles[]`           | The trucks you have, with `goodFor`, `notes`, `capacity`   | You buy/sell a truck or change the fleet |

> Run `npm run content:check` to see, at a glance, every place the UI
> is currently hiding behind a "TODO" because the data is missing.

### 2. `src/content/products.ts` — the five products

Five products: **bricks (hero), sand, khoa, cement, rod**. For each one:

- `name` (BN/EN)
- `shortDescription` (one line shown on cards)
- `soldBy` (e.g. "per 1,000 pcs / per truck")
- `variants[]` (e.g. auto / picket / jhama brick). Add or remove freely.
- `specs[]` (the "Source / Size / Variants / Supply" table on the detail page)
- `uses[]` (the "common uses" list)
- `askOnCall[]` (what the customer should tell us when they phone)
- `brands[]` (e.g. "Scan, Premier, Seven Rings" for cement). Empty for now.
- `image.alt` (BN/EN) — both must be filled in; screen readers rely on them

To **reorder** products, change their `order` field. Set `hero: true` on
exactly one product (currently `bricks`).

### 3. `src/content/trust.ts` — the four trust promises

The four "why us" lines on the home page. Each has BN/EN text. Edit the
text; don't change the structure (4 promises, in this order, is the
design).

### 4. `src/content/faq.ts` — the FAQ

Eight Q&A entries used on the home page (first 4) and the delivery page
(all 8). Each entry has `questionKey` and `answerKey` that point into
`messages/bn.json` and `messages/en.json`. The English answers live in
`messages/en.json` under the same keys.

Add a new question: append a new entry here, then add the matching BN
and EN strings to the message files.

### 5. `src/content/gallery.ts` — the yard photo gallery

Currently empty. When you have photos of the depot, drop the JPGs into
`public/images/yard/` and add a `{ src, alt }` entry for each one here.

### 6. `messages/bn.json` / `messages/en.json` — all the page copy

Most visible strings on every page live here, split by `namespace`
(`home`, `products`, `contact`, `delivery`, `estimator`, `faq`, `nav`,
`footer`, etc). Edit these files to change the page copy. **Always
edit both languages at the same time** — if you only edit one, the
other falls back to the key name.

The SEO title and description for each page live in the page's
`generateMetadata` function (in `src/app/[locale]/<page>/page.tsx`).
Edit those for SEO-only changes.

### 7. Site URL

The site URL is set in `src/content/site.ts` as `SITE_URL`. It is used
for canonical links, sitemap, and JSON-LD. If you ever change the
production domain, either:

- set `NEXT_PUBLIC_SITE_URL` (e.g. in your hosting dashboard), **or**
- edit the fallback string in `src/content/site.ts`.

Both are picked up at build time.

---

## Adding / changing photos

The site is mobile-first, so photos are sized for that.

**Product photos** — used on product detail pages and as the "hero" image.
- Path: `public/images/products/<slug>.jpg` (e.g. `bricks.jpg`)
- Size: **1200 × 900** (4:3), max **200 KB**
- Format: JPG or WebP. JPG is fine for photos.

**Yard photos** — the home-page gallery.
- Path: `public/images/yard/<name>.jpg`
- Size: **1600 × 1200** (4:3), max **250 KB**

After dropping a photo into `public/images/products/<slug>.jpg`, the
`<ProductImage>` component will use the real photo automatically (it
falls back to a colored SVG placeholder when the JPG is missing).

There is a helper script for the brand logo:
```bash
bash scripts/optimize-logo.sh   # rebuild logo.png from logo.original.png
```

---

## Style guide

`/styleguide` is an internal page that shows every colour, font, and
component. **In production builds it returns 404** so customers never
land on it. To browse it locally:

```bash
npm run dev
# then visit http://localhost:3000/bn/styleguide
```

---

## Tech notes (only if you change code)

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript strict
- **i18n:** `next-intl` with `bn` (default) and `en`, `localePrefix: "as-needed"`
- **Styling:** Tailwind CSS 3.4, custom design tokens in `tailwind.config.ts`
- **Fonts:** next/font/google — Space Grotesk, Plus Jakarta Sans, Anek Bangla, Hind Siliguri
- **SEO:** `src/lib/seo.ts` builds canonical + hreflang + OG + Twitter for every page.
  `src/components/seo/JsonLd.tsx` emits LocalBusiness / BreadcrumbList / FAQPage JSON-LD.
- **Sitemap / robots:** `src/app/sitemap.ts`, `src/app/robots.ts` (Next.js conventions)
- **Security headers:** `next.config.mjs` (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy, X-Content-Type-Options)
- **Estimator:** pure math library in `src/lib/estimator.ts` with 44 vitest tests

If you need to change something beyond the content files, the
`PROJECT_BRIEF.md` and `DESIGN_SYSTEM.md` docs in this repo have the
non-negotiables and the design tokens.
