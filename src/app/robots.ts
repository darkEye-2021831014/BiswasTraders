import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

/**
 * /robots.txt. Allow everything except /styleguide and the API
 * (we don't expose a public API, but be explicit anyway).
 *
 * Next.js serves this at /robots.txt and substitutes the sitemap URL
 * so Google can find the sitemap.xml in one click.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/styleguide", "/api"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
