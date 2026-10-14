import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { IconFacebook, IconMap } from "@/components/ui/icons";
import type { Locale } from "@/i18n/config";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy text-canvas border-t border-charcoal mt-12">
      <Container className="py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span
              aria-hidden
              className="w-9 h-9 bg-orange text-navy grid place-items-center font-display font-bold text-lg"
              style={{ borderRadius: 2 }}
            >
              বি
            </span>
            <span className="font-display font-semibold uppercase tracking-label text-sm">
              {site.legalName[locale]}
            </span>
          </div>
          <p className="text-xs text-canvas/70 leading-relaxed max-w-xs">
            {t("site.tagline")}
          </p>
        </section>
        <section>
          <h3 className="dim-rule dim-rule--start mb-3">
            <span className="whitespace-nowrap">{t("footer.addressLabel")}</span>
          </h3>
          <p className="text-sm flex items-start gap-2 max-w-xs">
            <IconMap className="w-4 h-4 mt-1 text-orange shrink-0" />
            <span>{site.address[locale]}</span>
          </p>
          {site.googleMapsUrl ? (
            <a
              href={site.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs underline text-canvas/70 hover:text-canvas"
            >
              Open in Google Maps ↗
            </a>
          ) : null}
        </section>
        <section>
          <h3 className="dim-rule dim-rule--start mb-3">
            <span className="whitespace-nowrap">{t("footer.quickLinks")}</span>
          </h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link className="hover:underline" href="/">
                {t("nav.home")}
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/products">
                {t("footer.products")}
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/delivery">
                {t("nav.delivery")}
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/contact">
                {t("footer.contact")}
              </Link>
            </li>
          </ul>
          {site.facebookUrl ? (
            <a
              href={site.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-xs underline text-canvas/70 hover:text-canvas"
            >
              <IconFacebook className="w-4 h-4" />
              Facebook
            </a>
          ) : null}
        </section>
      </Container>
      <div className="border-t border-canvas/10">
        <Container className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <CallButton label={t("actions.callNow")} size="sm" />
            <WhatsAppButton
              label={t("actions.whatsapp")}
              locale={locale}
              size="sm"
              bare
            />
          </div>
          <p className="text-[11px] uppercase tracking-eyebrow text-canvas/60">
            © {year} {site.legalName[locale]} — {t("footer.rights")}
          </p>
        </Container>
      </div>
    </footer>
  );
}
