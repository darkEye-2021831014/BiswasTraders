import { NextResponse, NextRequest, type NextRequest as NextRequestType } from "next/server";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales, isLocale } from "@/i18n/config";

/**
 * Cookie set by next-intl when the user explicitly toggles the locale
 * via the LocaleSwitch. We treat it as a *fallback only* — the URL
 * always wins. Without this override, next-intl's own middleware
 * honours the cookie even when the user just clicked a /<locale>/
 * link, which makes the LocaleSwitch round-trip fail (click EN,
 * then বাং, end up back on English).
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

/**
 * Run next-intl middleware with a temporarily-cleared locale cookie
 * so the URL is the *only* signal next-intl uses to pick a locale.
 *
 * We do this by writing a blank `Cookie:` header onto the forwarded
 * request. Any `set-cookie` from next-intl on the response is
 * preserved (it lands on the visitor's next navigation), and we
 * attach a separate `set-cookie` to *delete* the stale value from
 * the visitor's jar so future unprefixed visits also stay on bn.
 */
function intlWithoutCookie(req: NextRequestType): NextResponse {
  const headers = new Headers(req.headers);
  headers.set(
    "cookie",
    // Wipe the locale cookie by overwriting it with an empty value.
    // Anything else in the cookie jar is dropped too, which is
    // acceptable for this site (no other cookies are used).
    "",
  );
  const res = intl(
    new NextRequest(req.nextUrl, {
      method: req.method,
      headers,
      // body is not relevant for a GET, but keep it forward-safe.
    }),
  );
  return res;
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  const hasLocalePrefix = isLocale(pathname.split("/", 2)[1] ?? "");

  // 1. URL has an explicit `/<locale>/...` prefix that disagrees with
  //    the cookie. The URL wins: the user (or a shared link) just
  //    typed/clicked that locale, so the cookie is treated as stale.
  //    For the default locale we strip the prefix; for any other
  //    locale we keep it. Either way we clear the cookie on the
  //    response so the next unprefixed navigation isn't hijacked.
  if (hasLocalePrefix && cookieLocale && isLocale(cookieLocale)) {
    const urlInPrefix = pathname.split("/", 2)[1];
    if (urlInPrefix !== cookieLocale) {
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

  // 2. From here the URL is the source of truth.
  //    - `/<locale>/...` with cookie matching  -> serve that locale
  //    - `/<locale>/...` with no cookie        -> serve that locale
  //    - `/...` (unprefixed) with no cookie    -> default locale (bn)
  //    - `/...` (unprefixed) with cookie=en    -> user is back on a
  //                                              clean URL after
  //                                              switching; we still
  //                                              want them on bn
  //                                              (the URL is the
  //                                              ground truth here),
  //                                              so drop the cookie
  //                                              and serve bn.
  //
  //    In all cases we ask next-intl to *ignore* the cookie, by
  //    stripping the cookie header on the forwarded request. This
  //    prevents next-intl from re-redirecting `/contact` to
  //    `/en/contact` on the basis of a stale `NEXT_LOCALE=en`.
  const res = intlWithoutCookie(req);

  // If the unprefixed URL would have been hijacked by a stale cookie
  // (i.e. cookie was `en` and the URL had no prefix), make sure we
  // also clear that cookie on the response so it doesn't keep
  // poisoning future unprefixed visits.
  if (!hasLocalePrefix && cookieLocale === "en") {
    res.cookies.set(LOCALE_COOKIE, "", { path: "/", maxAge: 0 });
    res.cookies.set(LOCALE_COOKIE, defaultLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

