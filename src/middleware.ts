import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { locales } from "@/i18n/config";

/**
 * Site is Bangla-only. The only valid locale is "bn", and since "bn"
 * is also the default it can be served unprefixed.
 *
 * This middleware does two things:
 *
 *   1. Strip a leading `/en` from any incoming URL and 308-redirect
 *      to the clean unprefixed path. Visitors who bookmark or share
 *      old `/en/...` links still land on the right page.
 *
 *   2. Hand off to next-intl's middleware, which (with
 *      `localePrefix: "as-needed"`) rewrites the unprefixed URL
 *      (e.g. `/contact`) to the locale-prefixed route
 *      (e.g. `/bn/contact`) and sets the locale header.
 *
 *      Without step 2, requests to `/` and `/contact` would never
 *      match the `[locale]` segment and would 404.
 *
 * 308 (Permanent Redirect) is used in step 1 so that the next visit
 * to the same URL doesn't go through the middleware again; the
 * browser follows the redirect on its own.
 */
const intlMiddleware = createIntlMiddleware({
  locales: [...locales],
  defaultLocale: "bn",
  localePrefix: "as-needed",
  localeDetection: false,
});

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const firstSegment = pathname.split("/", 2)[1] ?? "";
  if (firstSegment === "en") {
    const rest = pathname.slice("en".length + 1);
    const cleanPath = rest.length > 0 ? rest : "/";
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = cleanPath;
    return NextResponse.redirect(redirectUrl, 308);
  }
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
