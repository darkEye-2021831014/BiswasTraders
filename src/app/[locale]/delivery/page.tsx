import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { site } from "@/content/site";
import { pick } from "@/i18n/l10n";
import type { Locale } from "@/i18n/config";

const FACTORS = ["1", "2", "3"] as const;

export default async function DeliveryPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });
  return (
    <>
      <section className="py-10 md:py-14">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow={t("delivery.pageEyebrow")}
            title={t("delivery.pageTitle")}
          />
          <p className="mt-4 max-w-prose text-charcoal/80">{t("delivery.intro")}</p>
          <ol className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {FACTORS.map((n, i) => {
              const titleKey = `delivery.factor${n}Title` as const;
              const bodyKey = `delivery.factor${n}Body` as const;
              return (
                <li key={n}>
                  <Card elevated className="h-full">
                    <div className="dim-rule dim-rule--start mb-3">
                      <span className="whitespace-nowrap">
                        {String(i + 1).padStart(2, "0")} / {FACTORS.length}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-lg">
                      {t(titleKey)}
                    </h3>
                    <p className="text-sm text-charcoal/80 mt-2">{t(bodyKey)}</p>
                  </Card>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      <section className="py-10 md:py-14 bg-sand border-y border-line">
        <Container>
          <SectionHeading
            eyebrow={t("delivery.zonesTitle")}
            title=""
            subtitle={t("delivery.zonesSubtitle")}
          />
          <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {site.serviceZones.map((z) => (
              <li
                key={z.id}
                className="border border-line bg-canvas p-3"
                style={{ borderRadius: 2 }}
              >
                <Badge tone="dark" className="mb-2">ZONE</Badge>
                <div className="font-display font-semibold text-sm">
                  {pick(z.name, params.locale)}
                </div>
                {z.distanceKm !== null ? (
                  <div className="text-[11px] text-charcoal/60 mt-1 tabular">
                    ~ {z.distanceKm} km
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-10 md:py-14">
        <Container>
          <SectionHeading
            eyebrow={t("delivery.vehiclesTitle")}
            title=""
            subtitle={t("delivery.vehiclesSubtitle")}
          />
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {site.vehicles.map((v) => (
              <li
                key={v.id}
                className="border border-line bg-canvas p-4"
                style={{ borderRadius: 2 }}
              >
                <div
                  aria-hidden
                  className="w-12 h-10 bg-brick mb-3"
                  style={{ borderRadius: 2 }}
                />
                <div className="font-display font-semibold text-sm">
                  {pick(v.name, params.locale)}
                </div>
                {v.capacity ? (
                  <div className="text-xs text-charcoal/70 mt-1">
                    {pick(v.capacity, params.locale)}
                  </div>
                ) : (
                  <div className="text-[11px] text-charcoal/40 italic mt-1">
                    {/* TODO(owner) */}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-10 md:py-14">
        <Container>
          <Card tone="charcoal" className="text-canvas flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold">{t("delivery.askTitle")}</h2>
              <p className="text-canvas/80 mt-2 max-w-prose">
                {t("delivery.askBody")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-2">
              <CallButton label={t("actions.callNow")} size="md" />
              <WhatsAppButton
                label={t("actions.whatsapp")}
                locale={params.locale}
                size="md"
              />
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
