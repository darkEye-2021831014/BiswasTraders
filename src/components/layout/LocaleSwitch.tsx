import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";

const labels: Record<Locale, string> = {
  bn: "বাং",
  en: "EN",
};

export function LocaleSwitch({
  current,
  otherLocale,
}: {
  current: Locale;
  otherLocale: Locale;
}) {
  return (
    <Link
      href="/"
      locale={otherLocale}
      className="hidden sm:inline-flex items-center h-10 px-3 text-xs font-display font-semibold uppercase tracking-label border border-canvas/30 text-canvas hover:bg-canvas hover:text-navy transition-colors"
      style={{ borderRadius: 2 }}
      aria-label={`Switch language to ${otherLocale}`}
    >
      {labels[otherLocale]}
    </Link>
  );
}
