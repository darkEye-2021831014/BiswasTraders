import type { Metadata } from "next";
import { SITE_URL } from "@/content/site";
import { absoluteUrl } from "@/lib/origin";
import type { Locale } from "@/i18n/config";

/**
 * SEO helpers shared by every page.
 *
 * The site is Bangla-only, so the per-page `buildMetadata` call
 * doesn't need a separate English title or description. It just
 * takes one Bangla title and description and returns a single
 * canonical + Open Graph + Twitter block.
 *
 * No `dangerouslySetInnerHTML` for JSON-LD in this file —
 * structured data lives in dedicated components (see
 * `LocalBusinessJsonLd`, `BreadcrumbListJsonLd`).
 *
 * Static /public/og.jpg is a 1200x630 image the owner can swap at
 * any time without code changes.
 */

const OG_PATH = "/og.jpg";

/** Build canonical + Open Graph + Twitter in one shot. */
export function buildMetadata(opts: {
  locale: string;
  /** Bangla title for the page. */
  titleBn: string;
  /** Bangla description for the page. */
  descriptionBn: string;
  /**
   * The path the page lives at, e.g. "/products/bricks" or "/contact".
   * We do NOT include a locale prefix here — the site is single-locale
   * (Bangla) and is served at the unprefixed URL.
   */
  path: string;
  /** Set false to mark noindex (e.g. the styleguide). */
  index?: boolean;
  /** Open Graph type. "website" for the home/landing pages, "article" for product details. */
  ogType?: "website" | "article";
}): Metadata {
  const locale: Locale = "bn";
  const index = opts.index !== false;
  const title = opts.titleBn;
  const description = opts.descriptionBn;
  // Canonical + hreflang bind to the request's host via runtimeOrigin()
  // so the same build works on localhost, staging, and production. The
  // og:image URL stays on SITE_URL because that asset is fetched by
  // crawlers / social cards long after the original request is gone.
  const canonical = absoluteUrl(locale, opts.path);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: opts.ogType ?? "website",
      siteName: "মেসার্স বিশ্বাস ট্রেডার্স",
      title,
      description,
      url: canonical,
      locale: "bn_BD",
      images: [
        {
          // /og.jpg is a build-time absolute URL — we want Facebook,
          // Twitter etc. to keep fetching it from the production domain
          // even when the page being shared was viewed on a different host.
          url: `${SITE_URL}${OG_PATH}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}${OG_PATH}`],
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}
