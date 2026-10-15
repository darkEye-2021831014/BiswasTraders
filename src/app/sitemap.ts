import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/origin";
import { products } from "@/content/products";

/**
 * Sitemap covering every indexable page on the (Bangla-only) site.
 * Excludes /styleguide (owner-only design reference, not for Google).
 *
 * Next.js serves this at /sitemap.xml. We declare an explicit
 * lastModified date (build time) so Google doesn't have to guess
 * freshness, and we set `changeFrequency` to "monthly" since prices
 * and stock change but the page content is largely static.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // The five top-level pages. Bangla is the only locale.
  const top: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/products", priority: 0.9 },
    { path: "/delivery", priority: 0.8 },
    { path: "/estimator", priority: 0.7 },
    { path: "/contact", priority: 0.7 },
  ];

  const entries: MetadataRoute.Sitemap = top.map(({ path, priority }) => ({
    url: absoluteUrl("bn", path),
    lastModified: now,
    changeFrequency: "monthly",
    priority,
    alternates: {
      languages: {
        bn: absoluteUrl("bn", path),
        "x-default": absoluteUrl("bn", path),
      },
    },
  }));

  // Product detail pages — one entry per slug (Bangla only).
  for (const p of products) {
    const path = `/products/${p.slug}`;
    entries.push({
      url: absoluteUrl("bn", path),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          bn: absoluteUrl("bn", path),
          "x-default": absoluteUrl("bn", path),
        },
      },
    });
  }

  return entries;
}