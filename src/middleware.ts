import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "@/i18n/config";

/**
 * Cookie set by next-intl when the user explicitly toggles the locale
 * via the LocaleSwitch. We use it as a *sticky preference* but only
 * honour it when the visitor is on a non-root path — the home page
 * (`/`) must always resolve to the default locale (Bangla) so that
 * fresh visits and shared links never surprise the user with English
 * just because an old test session left a `NEXT_LOCALE=en` cookie
 * behind.
 */
const LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * next-intl middleware. With `localePrefix: "as-needed"` the default
 * locale (`bn`) is served at the unprefixed URL, and `/en/...` is the
 * explicit English tree.
 */
const intl = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "as-needed",
});

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Force `/` back to the default locale (Bangla) by clearing any
  // stale `NEXT_LOCALE=en` cookie and rewriting to the bn tree. Doing
  // a rewrite (not a redirect) keeps the URL stable for the visitor,
  // and clears the cookie so the next navigation also starts from bn.
  if (pathname === "/" && req.cookies.get(LOCALE_COOKIE)?.value === "en") {
    const url = req.nextUrl.clone();
    url.pathname = `/${defaultLocale}`;
    const res = NextResponse.rewrite(url);
    res.cookies.set(LOCALE_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  }

  return intl(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
