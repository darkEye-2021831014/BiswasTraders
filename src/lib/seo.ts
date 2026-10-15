import type { Metadata } from "next";
import { SITE_URL } from "@/content/site";
import { absoluteUrl } from "@/lib/origin";
import type { Locale } from "@/i18n/config";
import { isLocale } from "@/i18n/config";

/**
 * SEO helpers shared by every page.
 *
 * Goals:
 *   - Bangla (default) URLs and titles first
 *   - x-default + per-locale hreflang for every indexable page
 *   - Open Graph + Twitter card with a single shared /og.jpg
 *   - No `dangerouslySetInnerHTML` for JSON-LD in this file —
 *     structured data lives in dedicated components (see
 *     `LocalBusinessJsonLd`, `BreadcrumbListJsonLd`).
 *
 * Static /public/og.jpg is a 1200x630 PNG/JPG the owner can swap at
 * any time without code changes.
 */

const OG_PATH = "/og.jpg";

/** Build canonical + hreflang + Open Graph + Twitter in one shot. */
export function buildMetadata(opts: {
  locale: string;
  /** Bangla title (the default-locale title). */
  titleBn: string;
  /** English title. */
  titleEn: string;
  /** Bangla description. */
  descriptionBn: string;
  /** English description. */
  descriptionEn: string;
  /**
   * The path the page lives at, e.g. "/products/bricks" or "/contact".
   * We do NOT include the locale prefix here — `localePath` adds it.
   */
  path: string;
  /** Set false to mark noindex (e.g. the styleguide). */
  index?: boolean;
  /** Open Graph type. "website" for the home/landing pages, "article" for product details. */
  ogType?: "website" | "article";
}): Metadata {
  const locale: Locale = isLocale(opts.locale) ? opts.locale : "bn";
  const index = opts.index !== false;
  const title = locale === "bn" ? opts.titleBn : opts.titleEn;
  const description = locale === "bn" ? opts.descriptionBn : opts.descriptionEn;
  // Canonical + hreflang bind to the request's host via runtimeOrigin()
  // so the same build works on localhost, staging, and production. The
  // og:image URL stays on SITE_URL because that asset is fetched by
  // crawlers / social cards long after the original request is gone.
  const canonical = absoluteUrl(locale, opts.path);

  const languages: Record<string, string> = {
    bn: absoluteUrl("bn", opts.path),
    en: absoluteUrl("en", opts.path),
  };
  // x-default points at the Bangla page (our default locale) so search
  // engines that don't have a clear language signal land on the canonical
  // version.
  languages["x-default"] = absoluteUrl("bn", opts.path);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: opts.ogType ?? "website",
      siteName: "M/S Biswas Traders",
      title,
      description,
      url: canonical,
      locale: locale === "bn" ? "bn_BD" : "en_US",
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

/** Title template (so we can re-use Next's `title.template` pattern). */
export const TITLE_TEMPLATE = {
  bn: "%s — মেসার্স বিশ্বাস ট্রেডার্স",
  en: "%s — M/S Biswas Traders",
};
