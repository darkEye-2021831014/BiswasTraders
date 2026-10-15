/**
 * Single-locale config: Bangla only.
 *
 * The site used to ship a second `en` locale; that has been removed.
 * The `[locale]` segment still exists in the App Router so we don't
 * have to move every page, but the only value that's ever valid is
 * "bn". The `bn` segment is also still served at the unprefixed URL
 * (e.g. `/contact`) so existing user-facing URLs don't change.
 */

export const locales = ["bn"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "bn";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
