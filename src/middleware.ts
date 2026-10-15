import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales, isLocale } from "@/i18n/config";

/**
 * Cookie set by next-intl when the user explicitly toggles the locale
 * via the LocaleSwitch. We use it as a *sticky preference* but only
 * honour it as a *fallback* — the URL prefix always wins.
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

/**
 * Strip the leading `/<locale>` segment from a pathname and return the
 * remaining path (e.g. "/en/contact" -> "/contact", "/bn" -> "/").
 */
function stripLocale(pathname: string): string {
  const seg = pathname.split("/", 2)[1];
  if (seg && isLocale(seg)) {
    const rest = pathname.slice(seg.length + 1);
    return rest.length > 0 ? rest : "/";
  }
  return pathname;
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  const hasLocalePrefix = isLocale(pathname.split("/", 2)[1] ?? "");

  // 1. URL has an explicit `/<locale>/...` prefix.
  //    The locale in the URL always wins over the cookie, because the
  //    user (or a shared link) explicitly typed/clicked that locale.
  //    If the URL and cookie disagree, the URL wins — the cookie is
  //    treated as a stale preference and is dropped. This makes the
  //    LocaleSwitch round-trip work: click EN, then click "বাং", and
  //    the user actually lands on the Bangla page; or click EN from
  //    a Bangla page, and the user actually lands on the English page.
  if (hasLocalePrefix && cookieLocale && isLocale(cookieLocale)) {
    const urlInPrefix = pathname.split("/", 2)[1];
    if (urlInPrefix !== cookieLocale) {
      // Build the destination URL: for the default locale we strip
      // the prefix; for any other locale (e.g. "en") we keep it.
      const cleanPath = stripLocale(pathname);
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname =
        urlInPrefix === defaultLocale
          ? cleanPath
          : `/${urlInPrefix}${cleanPath === "/" ? "" : cleanPath}`;
      const res = NextResponse.redirect(redirectUrl);
      res.cookies.set(LOCALE_COOKIE, "", { path: "/", maxAge: 0 });
      return res;
    }
  }

  // 2. Force `/` back to the default locale (Bangla) by clearing any
  //    stale `NEXT_LOCALE=en` cookie and rewriting to the bn tree.
  //    Keeps the URL stable for the visitor (no redirect), and
  //    clears the cookie so the next navigation also starts from bn.
  if (pathname === "/" && cookieLocale === "en") {
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

