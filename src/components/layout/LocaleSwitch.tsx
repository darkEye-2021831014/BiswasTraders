"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";

const labels: Record<Locale, string> = {
  bn: "EN",
  en: "বাং",
};

/**
 * Language switcher. Preserves the current pathname when switching, so users
 * stay on the same page (e.g. /products/bricks becomes /en/products/bricks).
 *
 * The visible label is the *other* locale's short name (Bāṅlā → EN, EN → বাং).
 */
export function LocaleSwitch({
  current,
  otherLocale,
}: {
  current: Locale;
  otherLocale: Locale;
}) {
  const t = useTranslations();
  const pathname = usePathname() || "/";
  const aria =
    otherLocale === "en"
      ? t("header.switchToEnglish")
      : t("header.switchToBangla");
  return (
    <Link
      href={pathname}
      locale={otherLocale}
      aria-label={aria}
      className="hidden md:inline-flex items-center h-10 px-3 text-xs font-display font-semibold uppercase tracking-label border border-canvas/30 text-canvas hover:bg-canvas hover:text-navy transition-colors"
      style={{ borderRadius: 2 }}
    >
      {labels[current]}
    </Link>
  );
}