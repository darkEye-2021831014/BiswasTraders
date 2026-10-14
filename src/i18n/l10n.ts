import type { Locale } from "@/i18n/config";

/** Bilingual string. Always use { bn, en } for any user-facing business content. */
export type L10n = { bn: string; en: string };

/** Pick the string for a given locale, with a safe fallback. */
export function pick(value: L10n, locale: Locale): string {
  return value[locale] || value.bn || value.en || "";
}
