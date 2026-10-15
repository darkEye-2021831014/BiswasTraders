import type { Locale } from "@/i18n/config";

/**
 * Bilingual business-content string. Even though the site is Bangla-only,
 * every piece of owner-curated copy (product names, addresses, landmarks…)
 * still keeps both `bn` and `en` fields so that the data model and the
 * `pick()` helper are stable. Only the `bn` value is ever rendered.
 */
export type L10n = { bn: string; en: string };

/** Pick the string for a given locale, with a safe fallback. */
export function pick(value: L10n, locale: Locale): string {
  return value[locale] || value.bn || value.en || "";
}
