import "server-only";
import { headers } from "next/headers";
import { SITE_URL } from "@/content/site";

/**
 * Server-only helpers for building absolute URLs that bind to the
 * request's host.
 *
 * Why a separate file: `next/headers` is only callable from a server
 * component. `site.ts` is imported by client components (MobileMenu,
 * SiteFooter, …) so it cannot `import { headers }` without breaking
 * the client bundle. Anything that needs the request origin lives
 * here and is only ever imported by server components, layouts, and
 * route handlers.
 */

/** Path prefix for each locale. "" for default (bn), "/en" for English. */
export function localePath(locale: "bn" | "en", path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return locale === "bn" ? p : `/en${p === "/" ? "" : p}`;
}

/** Join an origin and a path, trimming any trailing slash on the origin. */
function joinUrl(origin: string, path: string): string {
  return `${origin.replace(/\/$/, "")}${path}`;
}

/**
 * Origin the current request was made on, e.g. `http://localhost:3000`
 * or `https://biswastraders.trade`. Reads the x-forwarded-proto / host
 * headers so it works behind a proxy in production AND on localhost.
 *
 * Falls back to `SITE_URL` when called outside a request (e.g. at
 * module load time, or in static export). Safe to call anywhere that
 * the import path "server-only" allows.
 */
export function runtimeOrigin(): string {
  try {
    const h = headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto =
      h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
    if (host) return `${proto}://${host}`;
  } catch {
    // headers() throws if called outside a request scope (e.g. during
    // a static export, or before the request is fully wired). Fall
    // through to the static default.
  }
  return SITE_URL;
}

/**
 * Absolute URL for a given locale + path, using the runtime origin.
 *
 * Use this in server components that render per-request metadata
 * (canonical, hreflang, JSON-LD, breadcrumbs). This is the function
 * that "binds" the page to the host the visitor is actually on, which
 * matters when:
 *   - Crawling on `http://localhost:3000` (Lighthouse, dev, staging)
 *   - The production domain is behind a reverse proxy that rewrites host
 *
 * For absolute URLs that must keep working outside the request
 * (e.g. /og.jpg embedded in a Facebook post) keep using `${SITE_URL}/...`
 * directly.
 */
export function absoluteUrl(locale: "bn" | "en", path: string): string {
  return joinUrl(runtimeOrigin(), localePath(locale, path));
}
