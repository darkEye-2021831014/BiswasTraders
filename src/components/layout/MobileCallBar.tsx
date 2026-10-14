"use client";

import { telHref, waMeHref } from "@/lib/contact";
import { useTranslations } from "next-intl";
import { PhoneIcon } from "@/components/ui/icons/PhoneIcon";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";
import type { Locale } from "@/i18n/config";

/** Sticky bar fixed at the bottom on small screens — big touch targets. */
export function MobileCallBar({ locale }: { locale: Locale }) {
  const t = useTranslations();
  return (
    <div
      className="md:hidden fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-2 shadow-stamp"
      data-locale={locale}
    >
      <a
        href={telHref()}
        className="h-14 inline-flex items-center justify-center gap-2 font-display font-semibold tracking-label uppercase text-xs bg-brick text-white border border-brick active:translate-x-[1px] active:translate-y-[1px]"
        style={{ borderRadius: 2 }}
      >
        <PhoneIcon className="w-5 h-5" />
        {t("actions.callNow")}
      </a>
      <a
        href={waMeHref()}
        target="_blank"
        rel="noopener noreferrer"
        className="h-14 inline-flex items-center justify-center gap-2 font-display font-semibold tracking-label uppercase text-xs bg-charcoal text-white border border-charcoal active:translate-x-[1px] active:translate-y-[1px]"
        style={{ borderRadius: 2 }}
      >
        <span className="text-wa">
          <WhatsAppIcon className="w-5 h-5" />
        </span>
        WhatsApp
      </a>
    </div>
  );
}
