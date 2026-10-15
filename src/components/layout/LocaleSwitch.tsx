"use client";

import { usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";

const labels: Record<Locale, string> = {
  bn: "EN",
  en: "বাং",
};

/**
 * Language switcher. Renders a plain anchor (NOT a next-intl Link) so
 * the navigation is a full page load. That bypasses any client-side
 * router cache and ensures the new locale is always authoritative.
 *
 * The destination URL is computed deterministically from the current
 * pathname (returned by `usePathname()` with the locale segment
 * already stripped) and the locale the visitor wants to switch to:
 *
 *   current is bn, switch to en:
 *     /        -> /en
 *     /contact -> /en/contact
 *     /products/bricks -> /en/products/bricks
 *
 *   current is en, switch to bn:
 *     /        -> /bn (middleware strips -> /)
 *     /contact -> /bn/contact
 *
 * The middle layer (`usePathname`) does NOT add the locale segment
 * to its return value, so the local `pathname` we read here is
 * always a clean path like "/contact" or "/products/bricks" — never
 * "/en/contact". That keeps the switch logic obvious.
 */
export function LocaleSwitch({
  current,
  otherLocale,
  ariaLabel,
}: {
  current: Locale;
  otherLocale: Locale;
  ariaLabel: string;
}) {
  const pathname = usePathname() || "/";
  const cleanPath = pathname === "/" ? "" : pathname;
  // For English (non-default) we always show the explicit prefix.
  // For Bangla (default) we still emit the prefix here so the cookie
  // is force-cleared by the middleware's branch-1 logic; the
  // middleware then strips it back to a clean unprefixed URL.
  const target =
    otherLocale === "en"
      ? `/en${cleanPath}`
      : `/bn${cleanPath}`;
  return (
    <a
      href={target}
      aria-label={ariaLabel}
      className="hidden md:inline-flex items-center h-10 px-3 text-xs font-display font-semibold uppercase tracking-label border border-canvas/30 text-canvas hover:bg-canvas hover:text-navy transition-colors"
      style={{ borderRadius: 2 }}
    >
      {labels[current]}
    </a>
  );
}
