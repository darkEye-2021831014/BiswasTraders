import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { IconMap, IconFacebook } from "@/components/ui/icons";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import { site } from "@/content/site";
import { pick } from "@/i18n/l10n";
import type { Locale } from "@/i18n/config";

/**
 * Depot teaser — address, hours (only if set), Google Maps button (only
 * if site.googleMapsUrl is set), and a Facebook link. Renders the same
 * data as the /contact page; the "See full contact" link carries the
 * user to the long-form version.
 */
export async function DepotTeaser({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  return (
    <section className="py-12 md:py-16 bg-canvas">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <SectionHeading
            eyebrow={t("home.depotEyebrow")}
            title={t("home.depotTitle")}
          />
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 self-start md:self-auto text-sm font-display uppercase tracking-label border border-charcoal h-12 px-4 hover:bg-sand"
            style={{ borderRadius: 2 }}
          >
            {t("nav.contact")} <ArrowIcon className="w-3 h-3" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-4">
          <Card className="flex flex-col gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-eyebrow text-charcoal/60 font-display mb-1">
                {t("home.depotVisitUs")}
              </div>
              <p className="text-base flex items-start gap-2">
                <IconMap className="w-5 h-5 mt-0.5 text-brick shrink-0" aria-hidden />
                <span>{site.address[locale]}</span>
              </p>
              {site.googleMapsUrl ? (
                <a
                  href={site.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 h-10 px-3 text-xs font-display font-semibold uppercase tracking-label bg-brick text-white border border-brick hover:bg-brick-hover"
                  style={{ borderRadius: 2 }}
                >
                  {t("footer.openInMaps")}
                </a>
              ) : null}
            </div>
            <div className="border-t border-line pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {site.hours ? (
                <div>
                  <div className="text-[10px] uppercase tracking-eyebrow text-charcoal/60 font-display mb-1">
                    {t("home.depotOpeningHours")}
                  </div>
                  <div className="font-display text-sm">
                    {pick(site.hours.general, locale)}
                  </div>
                </div>
              ) : null}
              {site.facebookUrl ? (
                <div>
                  <div className="text-[10px] uppercase tracking-eyebrow text-charcoal/60 font-display mb-1">
                    {t("home.depotFollowUs")}
                  </div>
                  <a
                    href={site.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm underline hover:no-underline"
                  >
                    <IconFacebook className="w-4 h-4 text-brick" aria-hidden />
                    facebook.com/biswastraders.trade
                  </a>
                </div>
              ) : null}
            </div>
          </Card>
          <Card tone="navy" className="text-canvas relative overflow-hidden">
            <div className="absolute inset-0 brick-course opacity-60" aria-hidden />
            <div className="relative flex flex-col h-full justify-between gap-4 min-h-[180px]">
              <div>
                <div className="text-[10px] uppercase tracking-eyebrow text-canvas/70 font-display">
                  {t("home.depotTitle")}
                </div>
                <div className="font-display text-lg mt-1">
                  {site.legalName[locale]}
                </div>
                <div className="text-sm text-canvas/80 mt-1">
                  {site.address[locale]}
                </div>
              </div>
              <div className="border-t border-canvas/15 pt-3 grid grid-cols-2 gap-2 text-[11px] uppercase tracking-eyebrow font-display">
                <div>
                  <div className="text-canvas/60">{t("footer.phone")}</div>
                  <div className="tabular mt-1 text-canvas">{site.phone}</div>
                </div>
                <div>
                  <div className="text-canvas/60">WhatsApp</div>
                  <div className="tabular mt-1 text-canvas">+{site.whatsapp}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}