import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { PageHeading } from "@/components/ui/PageHeading";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { LazyMap } from "@/components/contact/LazyMap";
import { PhoneIcon } from "@/components/ui/icons/PhoneIcon";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";
import { IconFacebook, IconMap } from "@/components/ui/icons";
import { site } from "@/content/site";
import { isLocale } from "@/i18n/config";
import { pick } from "@/i18n/l10n";
import { buildMetadata } from "@/lib/seo";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";

/**
 * Per-locale metadata for the contact page. Same SEO keys as the
 * home page so the brand shows up consistently in search results.
 */
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  return buildMetadata({
    locale: params.locale,
    titleBn: "যোগাযোগ — মেসার্স বিশ্বাস ট্রেডার্স",
    titleEn: "Contact — M/S Biswas Traders",
    descriptionBn:
      "ফোন, WhatsApp, Facebook এবং ইয়ার্ডের ঠিকানা। সিঙ্গাইর, মানিকগঞ্জ।",
    descriptionEn:
      "Phone, WhatsApp, Facebook and the yard address. Singair, Manikganj.",
    path: "/contact",
  });
}

export default async function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) return null;
  setRequestLocale(params.locale);
  const locale = params.locale;
  const t = await getTranslations({ locale });
  return (
    <>
      {/* LocalBusiness JSON-LD on the contact page too — Google
          sometimes prefers to surface the contact URL for local
          businesses. */}
      <LocalBusinessJsonLd locale={locale} />
      <section className="py-10 md:py-14">
        <Container>
          <PageHeading
            eyebrow={t("contact.pageEyebrow")}
            title={t("contact.pageTitle")}
            subtitle={t("contact.pageSubtitle")}
          />

          {/* 3 big contact cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card elevated tone="canvas" className="flex flex-col gap-3">
              <div className="dim-rule dim-rule--start">
                <span className="whitespace-nowrap">{t("contact.phone")}</span>
              </div>
              <div className="font-display text-2xl tabular text-charcoal">
                {site.phone}
              </div>
              <p className="text-sm text-charcoal/80">{t("contact.phoneBody")}</p>
              <div className="mt-auto pt-2">
                <CallButton label={t("actions.callNow")} fullWidth size="lg" />
              </div>
              <span className="sr-only">
                <PhoneIcon className="w-4 h-4" aria-hidden />
              </span>
            </Card>

            <Card elevated tone="canvas" className="flex flex-col gap-3">
              <div className="dim-rule dim-rule--start">
                <span className="whitespace-nowrap">{t("contact.whatsapp")}</span>
              </div>
              <div className="font-display text-2xl tabular text-charcoal">
                +{site.whatsapp}
              </div>
              <p className="text-sm text-charcoal/80">{t("contact.whatsappBody")}</p>
              <div className="mt-auto pt-2">
                <WhatsAppButton
                  label={t("actions.whatsapp")}
                  locale={locale}
                  fullWidth
                  size="lg"
                />
              </div>
              <span className="sr-only">
                <WhatsAppIcon className="w-4 h-4" aria-hidden />
              </span>
            </Card>

            <Card elevated tone="canvas" className="flex flex-col gap-3">
              <div className="dim-rule dim-rule--start">
                <span className="whitespace-nowrap">{t("contact.facebook")}</span>
              </div>
              <div className="font-display text-base text-charcoal break-all">
                facebook.com/biswastraders.trade
              </div>
              <p className="text-sm text-charcoal/80">{t("contact.facebookBody")}</p>
              <div className="mt-auto pt-2">
                <a
                  href={site.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full h-14 px-5 text-sm font-display font-semibold uppercase tracking-label bg-charcoal text-white border border-charcoal hover:shadow-stamp-sm"
                  style={{ borderRadius: 2 }}
                >
                  <IconFacebook className="w-5 h-5" aria-hidden />
                  {t("contact.facebook")}
                </a>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Yard / Depot card */}
      <section className="py-8 md:py-12 bg-sand border-y border-line">
        <Container>
          <SectionHeading
            eyebrow={t("contact.pageEyebrow")}
            title={t("contact.yardTitle")}
            align="left"
          />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4">
            <Card className="flex flex-col gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
                  {t("contact.yardAddress")}
                </div>
                <p className="mt-1 text-base flex items-start gap-2">
                  <IconMap className="w-5 h-5 mt-0.5 text-brick shrink-0" aria-hidden />
                  <span>{site.address[locale]}</span>
                </p>
              </div>
              {site.googleMapsUrl ? (
                <a
                  href={site.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start h-12 px-4 text-xs font-display font-semibold uppercase tracking-label bg-brick text-white border border-brick hover:bg-brick-hover hover:shadow-stamp-brick-sm"
                  style={{ borderRadius: 2 }}
                >
                  {t("contact.yardOpenInMaps")}
                </a>
              ) : null}
            </Card>

            <Card className="flex flex-col gap-3">
              <div className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
                {t("contact.yardHowToFind")}
              </div>
              {site.landmarks.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {site.landmarks.map((l, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden className="text-orange shrink-0">▸</span>
                      <span>{pick(l, locale)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-charcoal/70 italic">
                  {t("contact.yardHowToFind")}
                </p>
              )}
              {site.googleMapsEmbedUrl ? (
                <div className="mt-3">
                  <LazyMap
                    embedUrl={site.googleMapsEmbedUrl}
                    title={site.legalName[locale]}
                    loadLabel={t("contact.yardMapsLoad")}
                    note={t("contact.yardMapsNote")}
                  />
                </div>
              ) : null}
            </Card>
          </div>
        </Container>
      </section>

      {/* Hours card (only if hours is set) */}
      {site.hours ? (
        <section className="py-8 md:py-12">
          <Container>
            <Card tone="charcoal" className="text-canvas">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-eyebrow text-canvas/60 font-display">
                    {t("contact.hours")}
                  </div>
                  <div className="font-display text-lg mt-1">
                    {pick(site.hours.general, locale)}
                  </div>
                </div>
                {site.hours.friday ? (
                  <div className="border-t md:border-t-0 md:border-l border-canvas/15 pt-3 md:pt-0 md:pl-6">
                    <div className="text-[10px] uppercase tracking-eyebrow text-canvas/60 font-display">
                      {t("contact.hoursFriday")}
                    </div>
                    <div className="font-display text-base mt-1">
                      {pick(site.hours.friday, locale)}
                    </div>
                  </div>
                ) : null}
              </div>
            </Card>
          </Container>
        </section>
      ) : null}
    </>
  );
}
