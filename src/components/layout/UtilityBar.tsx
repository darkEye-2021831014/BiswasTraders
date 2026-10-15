import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";
import { telHref, waMeHref } from "@/lib/contact";
import { IconMap } from "@/components/ui/icons/IconMap";
import { PhoneIcon } from "@/components/ui/icons/PhoneIcon";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";
import type { Locale } from "@/i18n/config";

/**
 * Thin band above the header (tablet+ only) with the address line, tel: link
 * and WhatsApp link. Hidden on mobile because the header already shows the
 * brand and a primary Call button on small screens.
 */
export async function UtilityBar({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  return (
    <div
      className="hidden md:block bg-charcoal-soft text-canvas/90 border-b border-charcoal text-[12px]"
      data-locale={locale}
    >
      <Container className="flex items-center justify-between gap-4 h-9">
        <div className="flex items-center gap-2 min-w-0">
          <IconMap className="w-3.5 h-3.5 text-orange shrink-0" aria-hidden />
          <span className="truncate">
            <span className="text-canvas/60 mr-1 uppercase tracking-eyebrow text-[10px] font-display">
              {t("utility.addressLabel")}
            </span>
            {site.address[locale]}
          </span>
        </div>
        <ul className="flex items-center gap-4 shrink-0">
          <li>
            <a
              href={telHref()}
              aria-label={t("actions.callNow")}
              className="inline-flex items-center gap-1.5 hover:text-canvas tabular"
            >
              <PhoneIcon className="w-3.5 h-3.5 text-orange" aria-hidden />
              <span aria-hidden>{site.phone}</span>
            </a>
          </li>
          <li>
            <a
              href={waMeHref()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("actions.whatsapp")}
              className="inline-flex items-center gap-1.5 hover:text-canvas"
            >
              <span className="text-wa">
                <WhatsAppIcon className="w-3.5 h-3.5" aria-hidden />
              </span>
              <span aria-hidden>WhatsApp</span>
            </a>
          </li>
        </ul>
      </Container>
    </div>
  );
}