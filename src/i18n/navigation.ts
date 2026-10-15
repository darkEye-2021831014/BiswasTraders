import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { locales } from "./config";

/**
 * The site is Bangla-only. `localePrefix: "as-needed"` makes the
 * single valid locale (`bn`) live at the unprefixed URL (e.g. `/`,
 * `/contact`, `/products/bricks`), which matches the routes served
 * by `[locale]/...` and what the middleware (`src/middleware.ts`)
 * expects.
 */
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({
    locales,
    localePrefix: "as-needed",
  });
