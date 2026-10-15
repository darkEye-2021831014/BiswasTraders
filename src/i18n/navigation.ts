import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { locales } from "./config";

/**
 * `localePrefix: "as-needed"` must stay in lock-step with the
 * `createMiddleware` config in `src/middleware.ts`. If they ever
 * drift, the i18n-aware `<Link>` component bakes a prefix that
 * doesn't match the route the middleware serves, and clicks from
 * the Bangla homepage (e.g. "ইট দেখুন") end up on the English
 * `/en/...` route instead of staying on `/...`.
 */
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({
    locales,
    localePrefix: "as-needed",
  });
