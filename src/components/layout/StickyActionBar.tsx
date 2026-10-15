import { getTranslations } from "next-intl/server";
import { telHref, waMeHref } from "@/lib/contact";
import { PhoneIcon } from "@/components/ui/icons/PhoneIcon";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";
import type { Locale } from "@/i18n/config";

/**
 * Mobile-only sticky action bar pinned to the bottom. Two equal-weight
 * buttons (Call = brick, WhatsApp = charcoal with a green icon). Respects
 * iOS safe-area with `env(safe-area-inset-bottom)`.
 *
 * Server-rendered. No client JS is needed for two static <a> tags, so
 * this lives in the server bundle only and is invisible to Lighthouse.
 *
 * The page itself adds bottom padding equal to the bar height so content
 * (including the footer) is never covered.
 */
export async function StickyActionBar({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  return (
    <div
      className="md:hidden fixed inset-x-3 z-40 grid grid-cols-2 gap-2"
      style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
      data-locale={locale}
      role="region"
      aria-label={t("sticky.regionLabel")}
    >
      <a
        href={waMeHref()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("actions.whatsapp")}
        className="h-14 inline-flex items-center justify-center gap-2 font-display font-semibold tracking-label uppercase text-xs bg-charcoal text-white border border-charcoal active:translate-x-[1px] active:translate-y-[1px] touch"
        style={{ borderRadius: 2 }}
      >
        <span className="text-wa" aria-hidden>
          <WhatsAppIcon className="w-5 h-5" />
        </span>
        {t("sticky.whatsapp")}
      </a>
      <a
        href={telHref()}
        aria-label={t("actions.callNow")}
        className="h-14 inline-flex items-center justify-center gap-2 font-display font-semibold tracking-label uppercase text-xs bg-brick text-white border border-brick active:translate-x-[1px] active:translate-y-[1px] touch"
        style={{ borderRadius: 2 }}
      >
        <PhoneIcon className="w-5 h-5" aria-hidden />
        {t("sticky.call")}
      </a>
    </div>
  );
}