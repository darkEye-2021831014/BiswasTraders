import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/origin";
import { products } from "@/content/products";

/**
 * Sitemap covering every indexable page in both locales. Excludes
 * /styleguide (owner-only design reference, not for Google).
 *
 * Next.js serves this at /sitemap.xml. We declare an explicit
 * lastModified date (build time) so Google doesn't have to guess
 * freshness, and we set `changeFrequency` to "monthly" since prices
 * and stock change but the page content is largely static.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // The five top-level pages, in both locales. The Bangla path is the
  // canonical one because bn is the default locale.
  const top: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/products", priority: 0.9 },
    { path: "/delivery", priority: 0.8 },
    { path: "/estimator", priority: 0.7 },
    { path: "/contact", priority: 0.7 },
  ];

  const entries: MetadataRoute.Sitemap = top.flatMap(({ path, priority }) => [
    {
      url: absoluteUrl("bn", path),
      lastModified: now,
      changeFrequency: "monthly",
      priority,
      alternates: {
        languages: {
          bn: absoluteUrl("bn", path),
          en: absoluteUrl("en", path),
          "x-default": absoluteUrl("bn", path),
        },
      },
    },
    {
      url: absoluteUrl("en", path),
      lastModified: now,
      changeFrequency: "monthly",
      priority,
      alternates: {
        languages: {
          bn: absoluteUrl("bn", path),
          en: absoluteUrl("en", path),
          "x-default": absoluteUrl("bn", path),
        },
      },
    },
  ]);

  // Product detail pages — one entry per (locale, slug).
  for (const p of products) {
    const path = `/products/${p.slug}`;
    for (const locale of ["bn", "en"] as const) {
      entries.push({
        url: absoluteUrl(locale, path),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: {
            bn: absoluteUrl("bn", path),
            en: absoluteUrl("en", path),
            "x-default": absoluteUrl("bn", path),
          },
        },
      });
    }
  }

  return entries;
}
