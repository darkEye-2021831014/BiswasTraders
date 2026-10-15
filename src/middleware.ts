import { NextResponse, type NextRequest } from "next/server";

/**
 * Site is Bangla-only. The only valid locale segment is "bn", and
 * since `bn` is also the default it can be served unprefixed.
 *
 * This middleware does the bare minimum needed to keep the site
 * working after we removed the `en` locale:
 *
 *   - Strip a leading `/en` from any incoming URL and 308-redirect
 *     to the clean unprefixed path. Visitors who bookmark or share
 *     old `/en/...` links still land on the right page.
 *   - Pass everything else through. There is no cookie, no locale
 *     detection, no prefix negotiation — just one rule.
 *
 * 308 (Permanent Redirect) is used so that the next visit to the
 * same URL doesn't go through the middleware again; the browser
 * will follow the redirect on its own.
 */
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
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
