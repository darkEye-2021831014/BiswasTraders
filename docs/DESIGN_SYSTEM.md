# Design system — "Industrial blueprint trade counter"

The visual language is industrial, architectural, tactile. It should feel like a dispatch counter, not a marketing landing page. Heavy borders, hard offset shadows, dense tabular data, real Bangla — no glassmorphism, no gradients, no bounce.

## Color tokens

| Token | Hex | Use |
| --- | --- | --- |
| `canvas` | `#FAF8F5` | App background (warm calcined white) |
| `sand` | `#EDE4D8` | Zebra rows, secondary surfaces |
| `brick` | `#A13828` | Primary CTA, accent |
| `brick-hover` | `#812113` | Hover state for primary CTA |
| `brick-deep` | `#5C1810` | Reserved for pressed / dark CTA |
| `charcoal` | `#1F2421` | Headings, dark cards, mobile call bar |
| `charcoal-soft` | `#2D3135` | Inverse surface |
| `mortar` | `#7E8287` | Hairline borders, meta text |
| `navy` | `#001A2B` | Sampled from the logo. Header, footer, dark bands. |
| `navy-deep` | `#000F1A` | Deeper navy for footers |
| `orange` | `#FD5500` | Sampled from the logo. **Stamps, highlights, status dot only** — never for a big block. |
| `wa` | `#25D366` | WhatsApp icon only |
| `line` | `#D1D5DB` | Card borders |
| `ink` | `#181C20` | Body text (fallback) |
| `error` | `#BA1A1A` | Errors |

## Typography

- **Space Grotesk** (Latin display) — headings, numerals, eyebrows, buttons. `var(--font-space-grotesk)`.
- **Plus Jakarta Sans** (Latin body) — body copy. `var(--font-plus-jakarta)`.
- **Anek Bangla** (Bangla display) — Bangla headings. `var(--font-anek-bangla)`.
- **Hind Siliguri** (Bangla body) — Bangla body. `var(--font-hind-siliguri)`.
- Self-hosted via `next/font/google`, `display: swap`, subsets `latin` + `bengali`.
- Base font size: 16px (Latin), 17px (Bangla). Bangla line-height: +10% (1.71) to keep vowel marks from clipping.
- `font-variant-numeric: tabular-nums` for any number (BDT, kg, CFT, sqft, count, phone).

## Shape & elevation

- Corner radius: **max 4px**. No circular buttons. The only rounded UI allowed is for status dots.
- Borders: 1px solid `#D1D5DB` (canvas cards) or `#EDE4D8` (sand cards).
- Elevation: hard offset shadow only. `3px 3px 0 0 #1F2421` (`.elev-stamp` / Tailwind `shadow-stamp`) and `2px 2px 0 0 #1F2421` (`.elev-stamp-sm` / `shadow-stamp-sm`). Buttons on hover get the brick variant.
- **No** blur, **no** glassmorphism, **no** gradients, **no** bounce animations.

## Signature motif

- **Running-bond brick course.** Pure CSS — navy background with horizontal mortar lines every 24px and a vertical mortar stripe that offsets every 24px. The `.brick-course` class (and `.brick-course--sand` for sand-toned). Used as the hero backdrop and as a section divider (`<BrickDivider />`).
- **Dimension line.** Eyebrow labels with a thin rule and end-ticks. Use `<SectionHeading eyebrow="..." title="..." />` to get it automatically, or `.dim-rule` for raw use.
- **Stamp badges.** Rectangular 2px-radius tags with a 1.5px charcoal border. `Badge tone="default" | "dark" | "orange" | "brick" | "navy"`.

## Components

| Component | File | Notes |
| --- | --- | --- |
| `Button` / `ButtonLink` | `src/components/ui/Button.tsx` | variants: `primary` (brick), `dark`, `outline`, `ghost`; sizes: `sm`/`md`/`lg` |
| `Badge` | `src/components/ui/Badge.tsx` | Stamp-style, multiple tones |
| `Card` | `src/components/ui/Card.tsx` | tones: `canvas`/`sand`/`charcoal`/`navy`, optional `elevated` |
| `SectionHeading` | `src/components/ui/SectionHeading.tsx` | eyebrow + dimension rule + title + subtitle |
| `SpecTable` | `src/components/ui/SpecTable.tsx` | zebra rows, tabular nums |
| `BrickDivider` | `src/components/ui/BrickDivider.tsx` | motif divider |
| `CallButton` | `src/components/ui/CallButton.tsx` | uses `telHref()` |
| `WhatsAppButton` | `src/components/ui/WhatsAppButton.tsx` | uses `waHref({ locale, ... })` |
| `Container` | `src/components/ui/Container.tsx` | max-w-7xl with responsive gutters |
| `ProductImage` | `src/components/product/ProductImage.tsx` | placeholder SVG themed per product |
| `ProductCard` | `src/components/product/ProductCard.tsx` | product index card |
| `ProductGallery` | `src/components/product/ProductGallery.tsx` | product detail layout |
| `SiteHeader` / `SiteFooter` / `MobileCallBar` | `src/components/layout/*` | chrome + sticky call bar |
| `Hero` / `ProcessSteps` / `ZonesSection` / `ContactCTA` | `src/components/section/*` | home sections |
| `Estimator` | `src/components/estimator/Estimator.tsx` | `"use client"` — no price, no form post |

## Touch targets, focus, motion

- All interactive controls have a `min-height: 48px` (`.touch` utility + button size class).
- Focus ring: `outline: 2px solid brick; outline-offset: 2px` (applied globally to focusable elements in `globals.css`).
- `prefers-reduced-motion: reduce` shortens all animations/transitions to ~0ms.

## Naming & content rules

- Bangla first. Use `{ bn, en }` for any business-facing string via the `L10n` type.
- Don't invent: hours, exact distances, vehicle capacity, kiln names, etc. Mark with `// TODO(owner)` and the UI hides nulls.
- Numbers are tabular, not lcd/oldstyle.

## How to extend

- Add a new product: append to `src/content/products.ts`. Set `order`, `slug`, `name` (L10n), `shortDescription`, `soldBy`, `variants[]`, `specs[]`, `uses[]`, `askOnCall[]`, `brands`, `image.src = "/images/products/<slug>.jpg"`. Optionally set `hero: true` (only one). Also add a `variant` mapping in `ProductCard.tsx` / `ProductGallery.tsx` / `ProductImage.tsx` if you want a new placeholder theme.
- Add a new locale: extend `locales` in `src/i18n/config.ts`, add a `messages/<locale>.json` file, and add a `generateStaticParams` entry.
- Add a new section: build it in `src/components/section/`, import into the locale page, keep it a server component unless it needs interactivity.
