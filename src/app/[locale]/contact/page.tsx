import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { IconMap, IconFacebook } from "@/components/ui/icons";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/config";

export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });
  return (
    <section className="py-10 md:py-14">
      <Container>
        <SectionHeading
          eyebrow={t("contact.pageEyebrow")}
          title={t("contact.pageTitle")}
          subtitle={t("contact.pageSubtitle")}
        />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card elevated className="flex flex-col gap-3">
            <div className="dim-rule dim-rule--start">
              <span className="whitespace-nowrap">{t("contact.phone")}</span>
            </div>
            <div className="font-display text-2xl tabular">{site.phone}</div>
            <CallButton label={t("actions.callNow")} fullWidth size="lg" />
          </Card>
          <Card elevated className="flex flex-col gap-3">
            <div className="dim-rule dim-rule--start">
              <span className="whitespace-nowrap">{t("contact.whatsapp")}</span>
            </div>
            <div className="font-display text-2xl tabular">+{site.whatsapp}</div>
            <WhatsAppButton
              label={t("actions.whatsapp")}
              locale={params.locale}
              fullWidth
              size="lg"
            />
          </Card>
          <Card className="md:col-span-2 flex flex-col gap-2">
            <div className="dim-rule dim-rule--start">
              <span className="whitespace-nowrap">{t("contact.address")}</span>
            </div>
            <div className="flex items-start gap-2 text-base">
              <IconMap className="w-5 h-5 mt-0.5 text-brick" />
              <span>{site.address[params.locale]}</span>
            </div>
            {site.googleMapsUrl ? (
              <a
                href={site.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline text-charcoal/80 hover:text-charcoal self-start"
              >
                Open in Google Maps ↗
              </a>
            ) : null}
          </Card>
          {site.facebookUrl ? (
            <Card className="md:col-span-2 flex items-center gap-3">
              <IconFacebook className="w-6 h-6 text-brick" />
              <a
                href={site.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                facebook.com/biswastraders.trade
              </a>
            </Card>
          ) : null}
          {site.hours ? (
            <Card className="md:col-span-2 flex items-center justify-between gap-3">
              <div>
                <div className="dim-rule dim-rule--start">
                  <span className="whitespace-nowrap">{t("contact.hours")}</span>
                </div>
                <div className="mt-2 font-display text-base">
                  {site.hours[params.locale]}
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
