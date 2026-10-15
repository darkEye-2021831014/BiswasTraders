import { NextResponse, NextRequest, type NextRequest as NextRequestType } from "next/server";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales, isLocale } from "@/i18n/config";

/**
 * Locale resolution rules (single source of truth).
 *
 * The URL is the only ground truth for which locale a request is for.
 * The `NEXT_LOCALE` cookie is treated as a STICKY PREFERENCE only:
 * it is set on the way out based on which locale the visitor was just
 * on, and used by the very next unprefixed visit when there is no
 * stronger signal. It is NEVER used to override an explicit `/<locale>/`
 * prefix in the URL.
 *
 * Why this is necessary: next-intl's own middleware, with
 * `localePrefix: "as-needed"`, honours the `NEXT_LOCALE` cookie and
 * will redirect `/contact` to `/en/contact` if the cookie is `en`,
 * even when the user just clicked a LocaleSwitch that emits `/en/...`
 * (or `bn/...`) on a page that was previously `/contact`. That made
 * the LocaleSwitch round-trip fail: the click would route to a
 * prefixed URL, the middleware would strip the prefix, then redirect
 * to the cookie's locale, and the user would never see the locale
 * they just chose. The fix is to give next-intl an *empty* cookie
 * header so it can only use the URL.
 */
const LOCALE_COOKIE = "NEXT_LOCALE";

const intl = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "as-needed",
});

/** Strip the leading `/<locale>` segment. "/en/contact" -> "/contact". */
function stripLocale(pathname: string): string {
  const seg = pathname.split("/", 2)[1];
  if (seg && isLocale(seg)) {
    const rest = pathname.slice(seg.length + 1);
    return rest.length > 0 ? rest : "/";
  }
  return pathname;
}

/**
 * Forward a request through next-intl with the locale cookie blanked
 * out, so the URL is the only locale signal next-intl can use.
 *
 * We construct a new NextRequest (rather than mutating the original
 * headers) because the runtime treats the original request headers
 * as immutable in middleware.
 */
function intlWithoutLocaleCookie(req: NextRequestType): NextResponse {
  const headers = new Headers(req.headers);
  // Wipe the cookie header entirely — we want next-intl to act as if
  // the visitor has no cookie, and pick the locale purely from the
  // URL. There are no other cookies in this app to preserve.
  headers.delete("cookie");
  const forwarded = new NextRequest(req.nextUrl, {
    method: req.method,
    headers,
  });
  return intl(forwarded);
}

/**
 * Set a sticky-preference cookie on the response indicating which
 * locale the visitor is *currently* on. We only do this for the
 * non-default locale — visitors who land on the unprefixed tree
 * don't need a cookie because the unprefixed URL is itself the
 * default signal.
 */
function stampLocaleCookie(res: NextResponse, locale: string) {
  if (locale !== "en" && locale !== "bn") return;
  res.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const firstSegment = pathname.split("/", 2)[1] ?? "";
  const hasLocalePrefix = isLocale(firstSegment);
  const urlLocale = hasLocalePrefix ? firstSegment : null;
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  const validCookieLocale =
    cookieLocale && isLocale(cookieLocale) ? cookieLocale : null;

  // 1. URL has an explicit `/<locale>/...` prefix that disagrees with
  //    the cookie. The URL wins. We redirect to a clean URL in the
  //    chosen locale (stripping the prefix for the default `bn`,
  //    keeping it for `en`) and clear the cookie so future unprefixed
  //    visits also stay on the right locale.
  if (urlLocale && validCookieLocale && urlLocale !== validCookieLocale) {
    const cleanPath = stripLocale(pathname);
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname =
      urlLocale === defaultLocale
        ? cleanPath
        : `/${urlLocale}${cleanPath === "/" ? "" : cleanPath}`;
    const res = NextResponse.redirect(redirectUrl);
    res.cookies.set(LOCALE_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  }

  // 2. Hand the request to next-intl with the cookie blanked. This
  //    is the core fix: next-intl now picks a locale purely from the
  //    URL, so a stale `NEXT_LOCALE=en` cookie can't hijack the
  //    unprefixed-URL tree.
  const res = intlWithoutLocaleCookie(req);

  // 3. Stamp a fresh sticky-preference cookie on the response so
  //    the *next* unprefixed visit (if any) still has a hint about
  //    which locale the visitor prefers. We let the URL drive the
  //    current request; the cookie only takes effect on the next
  //    unprefixed visit, where it'll be in the cookie header on the
  //    *incoming* request — and branch 1 above will clear it again
  //    if it disagrees with the URL.
  //
  //    For the unprefixed URL we want the cookie to say `bn`
  //    (the default). For a prefixed URL we want the cookie to say
  //    whatever locale is in the URL.
  if (urlLocale) {
    stampLocaleCookie(res, urlLocale);
  } else if (validCookieLocale !== defaultLocale) {
    // Unprefixed visit. If the existing cookie was something other
    // than the default (e.g. `en`), refresh it to `bn` so a future
    // branch-1 redirect doesn't bounce this visitor off the
    // unprefixed tree.
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
