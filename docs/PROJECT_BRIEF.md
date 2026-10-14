# Project brief — M/S Biswas Traders website

## Business

- **Name (BN):** মেসার্স বিশ্বাস ট্রেডার্স
- **Name (EN):** M/S Biswas Traders
- **Address (BN):** জয়মন্টপ খেলার মাঠ, সিঙ্গাইর, মানিকগঞ্জ ১২৮২
- **Address (EN):** Joymantop Khelar Math, Singair, Manikganj 1822, Bangladesh
- **Trade:** Bricks (ইট), sand (বালু), khoa / stone chips (খোয়া / পাথর), cement (সিমেন্ট) and rod / rebar (রড).
- **Phone:** 01729997977
- **WhatsApp:** https://wa.me/8801729997977
- **Facebook:** https://facebook.com/biswastraders.trade

## Goal

The site has one job: people see the products, then **call or WhatsApp** to get the price. Prices depend on delivery location and quantity, so the site never shows prices.

## Audience

- Homeowners, masons (রাজমিস্ত্রি) and contractors.
- Mid-range Android phones, mediocre mobile data.
- Around Singair, Manikganj, Savar, Hemayetpur and west Dhaka.
- Bangla first, English second.

## Page map

| Path | Page | Notes |
| --- | --- | --- |
| `/` | Home | Hero, products, process, zones, contact CTA |
| `/products` | Products index | All 5 product cards |
| `/products/bricks` | Bricks | Detail page, hero product |
| `/products/sand` | Sand | Detail page |
| `/products/khoa` | Khoa / stone chips | Detail page |
| `/products/cement` | Cement | Detail page |
| `/products/rod` | Rod / rebar | Detail page |
| `/delivery` | Delivery & Pricing | Pricing factors, zones, vehicles, CTA |
| `/contact` | Contact | Phone, WhatsApp, address, Facebook, hours |
| `/estimator` | Estimator | Naive in-browser quantity helper; no price |
| `/styleguide` | Styleguide | Internal — `noindex` |
| `*` | 404 | Bilingual, brick-course backdrop |

All product pages and the home, products, delivery, contact, estimator, and styleguide pages are statically generated (`generateStaticParams`).

## Non-negotiables

1. **Fully static content.** No database, no backend, no API routes, no auth, no sign-up, no cart, no payments, no data-submitting forms, no email sending, no analytics, no cookies.
2. **Never display prices.** Call/WhatsApp is the only path to a price.
3. **Never invent business facts.** Anything unconfirmed lives in content files as `// TODO(owner)` and the UI hides it when the value is `null` / empty.
4. **Mobile-first at 360px.** Bangla default, every visible string bilingual (`{ bn, en }`).
5. **Minimal client JS.** Use `next/image` for images, `next/font` for fonts. Server components by default; `"use client"` only for the Estimator and the mobile call bar.
6. **Accessibility.** WCAG AA contrast, ≥48px touch targets, semantic HTML, visible focus ring.
7. **Security.** No `dangerouslySetInnerHTML`. All external links `rel="noopener noreferrer"`. No secrets, no `.env`. Contact data is read only from `src/content/site.ts`.
8. **No deployment configuration** — Vercel/Netlify/etc. configs are out of scope.

## Finish protocol (every phase)

1. Run `npm run typecheck`, `npm run lint`, `npm run build`. Fix every error and warning.
2. Open the pages in dev and sanity-check at 360px and 1280px.
3. Write a short summary: what was built, assumptions, TODO(owner) items, how to verify.
4. `git add` and commit with the message `phase N: <title>`.

## Phase log

- **Phase 1 — foundation:** Next.js + TypeScript + Tailwind + next-intl scaffold, design tokens, content layer, UI primitives, layout (header / footer / mobile bar), home / products / detail / delivery / contact / estimator / 404 pages, internal styleguide, project docs.
