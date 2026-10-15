import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { PageHeading } from "@/components/ui/PageHeading";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { BrickDivider } from "@/components/ui/BrickDivider";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { IconMap } from "@/components/ui/icons";
import { site } from "@/content/site";
import { isLocale } from "@/i18n/config";
import { pick } from "@/i18n/l10n";
import type { Locale } from "@/i18n/config";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { buildMetadata } from "@/lib/seo";

const FACTORS = ["1", "2", "3"] as const;

/**
 * /delivery — long-form "how the price is decided" page, then zones
 * (split into Core / Extended when both groups are populated), then
 * vehicles-or-road-checklist, then unloading & checking tips, then CTA.
 * Server component, no client JS.
 *
 * No promised delivery times, no promised free delivery, no numbers or
 * money in the worked example. The worker's brief is explicit on those
 * three non-negotiables.
 */
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  return buildMetadata({
    locale: params.locale,
    titleBn: "ডেলিভারি ও মূল্য নির্ধারণ",
    titleEn: "Delivery & how the price is decided",
    descriptionBn:
      "ডেলিভারি এলাকা, গাড়ির ধরন এবং মূল্য কীভাবে ঠিক হয় — সবকিছু খোলামেলা বলা।",
    descriptionEn:
      "Delivery zones, vehicle types, and how the rate is decided — all in plain language.",
    path: "/delivery",
  });
}

export default async function DeliveryPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const locale = params.locale;
  const t = await getTranslations({ locale });

  // Group zones by their data-driven group. If all zones are in the
  // same group, we render one list with the matching label.
  const allZones = site.serviceZones;
  const coreZones = allZones.filter((z) => z.group === "core");
  const extendedZones = allZones.filter((z) => z.group === "extended");
  const hasBothGroups = coreZones.length > 0 && extendedZones.length > 0;
  const onlyOneGroup =
    (coreZones.length > 0 && extendedZones.length === 0) ||
    (extendedZones.length > 0 && coreZones.length === 0);

  const askItems = ["1", "2", "3", "4", "5"] as const;
  const showVehicles = site.vehicles.length > 0;

  return (
    <>
      <section className="py-10 md:py-14">
        <Container>
          <PageHeading
            eyebrow={t("delivery.pageEyebrow")}
            title={t("delivery.pageTitle")}
            subtitle={t("delivery.intro")}
          />
        </Container>
      </section>

      {/* How the price is decided */}
      <section className="py-8 md:py-12 bg-canvas">
        <Container>
          <SectionHeading
            eyebrow={t("delivery.pageEyebrow")}
            title={t("delivery.factor1Title")}
          />
          <ol className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {FACTORS.map((n) => {
              const titleKey = `delivery.factor${n}Title` as const;
              const bodyKey = `delivery.factor${n}Body` as const;
              return (
                <li key={n}>
                  <Card elevated className="h-full flex flex-col">
                    <div className="dim-rule dim-rule--start mb-3">
                      <span className="whitespace-nowrap">
                        {n} / {FACTORS.length}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-lg">
                      {t(titleKey)}
                    </h3>
                    <p className="text-sm text-charcoal/80 mt-2">
                      {t(bodyKey)}
                    </p>
                  </Card>
                </li>
              );
            })}
          </ol>

          {/* Worked-description example — no numbers, no money */}
          <Card tone="sand" className="mt-6">
            <div className="dim-rule dim-rule--start mb-3">
              <span className="whitespace-nowrap">
                {t("delivery.exampleTitle")}
              </span>
            </div>
            <p className="text-base text-charcoal/90 leading-relaxed max-w-prose">
              {t("delivery.exampleBody")}
            </p>
          </Card>
        </Container>
      </section>

      <BrickDivider tone="sand" />

      {/* Ask on call checklist */}
      <section className="py-10 md:py-14 bg-sand">
        <Container>
          <SectionHeading
            eyebrow={t("home.finalEyebrow")}
            title={t("delivery.askTitle")}
          />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-4">
            <Card tone="charcoal" className="text-canvas">
              <ol className="space-y-3 list-none">
                {askItems.map((n, i) => {
                  const key = `delivery.askItem${n}` as const;
                  return (
                    <li key={n} className="flex gap-3 text-sm leading-relaxed">
                      <span
                        aria-hidden
                        className="mt-0.5 w-7 h-7 shrink-0 grid place-items-center border border-canvas/40 font-display font-bold text-[12px] tabular"
                        style={{ borderRadius: 2 }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{t(key)}</span>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-4 pt-4 border-t border-canvas/15 text-[12px] text-canvas/80 italic">
                {t("delivery.askNote")}
              </p>
            </Card>
            <Card className="flex flex-col justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
                  {t("home.finalEyebrow")}
                </div>
                <p className="text-sm text-charcoal/80 mt-1 max-w-prose">
                  {t("delivery.ctaBody")}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <CallButton label={t("actions.callNow")} size="md" fullWidth />
                <WhatsAppButton
                  label={t("actions.whatsapp")}
                  locale={locale}
                  size="md"
                  fullWidth
                />
              </div>
            </Card>
          </div>
        </Container>
      </section>

      <BrickDivider tone="navy" />

      {/* Delivery zones */}
      <section className="py-10 md:py-14 bg-canvas">
        <Container>
          <SectionHeading
            eyebrow={t("home.deliveryEyebrow")}
            title={t("delivery.zonesTitle")}
            subtitle={t("delivery.zonesSubtitle")}
          />

          {hasBothGroups ? (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ZoneGroup
                title={t("delivery.zonesCore")}
                zones={coreZones}
                locale={locale}
                accent="brick"
              />
              <ZoneGroup
                title={t("delivery.zonesExtended")}
                zones={extendedZones}
                locale={locale}
                accent="charcoal"
              />
            </div>
          ) : onlyOneGroup ? (
            <div className="mt-6">
              <ZoneGroup
                title={
                  coreZones.length > 0
                    ? t("delivery.zonesCore")
                    : t("delivery.zonesExtended")
                }
                zones={allZones}
                locale={locale}
                accent="brick"
              />
            </div>
          ) : (
            <p className="mt-6 text-sm text-charcoal/70 italic">
              {t("delivery.zonesNotListed")}
            </p>
          )}

          <p className="mt-6 text-sm text-charcoal/80 italic">
            {t("delivery.zonesNotListed")}
          </p>
        </Container>
      </section>

      <BrickDivider tone="sand" />

      {/* Vehicles & site access — matrix OR road checklist */}
      <section className="py-10 md:py-14 bg-sand">
        <Container>
          <SectionHeading
            eyebrow={t("home.deliveryVehiclesTitle")}
            title={t("delivery.vehiclesTitle")}
            subtitle={t("delivery.vehiclesSubtitle")}
          />

          {showVehicles ? (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {site.vehicles.map((v) => (
                <Card key={v.id} className="flex flex-col">
                  <div className="dim-rule dim-rule--start mb-3">
                    <span className="whitespace-nowrap">
                      {pick(v.name, locale)}
                    </span>
                  </div>
                  {v.goodFor ? (
                    <div className="mb-3">
                      <div className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
                        {t("delivery.vehiclesGoodFor")}
                      </div>
                      <p className="text-sm text-charcoal mt-1 leading-snug">
                        {pick(v.goodFor, locale)}
                      </p>
                    </div>
                  ) : null}
                  {v.notes ? (
                    <div className="mb-3">
                      <div className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
                        {t("delivery.vehiclesNotes")}
                      </div>
                      <p className="text-sm text-charcoal mt-1 leading-snug">
                        {pick(v.notes, locale)}
                      </p>
                    </div>
                  ) : null}
                  {v.capacity ? (
                    <div className="text-[11px] text-charcoal/70 mt-auto pt-3 border-t border-line">
                      {pick(v.capacity, locale)}
                    </div>
                  ) : (
                    <div className="text-[11px] text-charcoal/60 italic mt-auto pt-3 border-t border-line">
                      {/* TODO(owner) */}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card tone="canvas" className="mt-6">
              <div className="dim-rule dim-rule--start mb-3">
                <span className="whitespace-nowrap">
                  {t("delivery.roadChecklistTitle")}
                </span>
              </div>
              <p className="text-sm text-charcoal/80 mb-4 max-w-prose">
                {t("delivery.vehiclesEmptyBody")}
              </p>
              <ul className="space-y-2 list-none">
                {(["1", "2", "3", "4"] as const).map((n, i) => {
                  const key = `delivery.roadItem${n}` as const;
                  return (
                    <li key={n} className="flex gap-3 text-sm leading-relaxed">
                      <span
                        aria-hidden
                        className="mt-0.5 w-6 h-6 shrink-0 grid place-items-center border border-charcoal/40 font-display font-bold text-[11px] tabular"
                        style={{ borderRadius: 2 }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{t(key)}</span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}
        </Container>
      </section>

      <BrickDivider tone="charcoal" />

      {/* FAQ */}
      <section className="py-10 md:py-14 bg-canvas">
        <Container>
          <SectionHeading
            eyebrow={t("faq.eyebrow")}
            title={t("faq.title")}
            subtitle={t("faq.subtitle")}
          />
          <div className="mt-6">
            <FaqAccordion locale={locale} />
          </div>
        </Container>
      </section>

      <BrickDivider tone="navy" />

      {/* Unloading & checking tips */}
      <section className="py-10 md:py-14 bg-canvas">
        <Container>
          <SectionHeading
            eyebrow={t("home.trustEyebrow")}
            title={t("delivery.tipsTitle")}
            subtitle={t("delivery.tipsSubtitle")}
          />
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TipCard
              number={1}
              titleKey="delivery.tipsBricksTitle"
              bodyKey="delivery.tipsBricksBody"
              t={t}
            />
            <TipCard
              number={2}
              titleKey="delivery.tipsSandTitle"
              bodyKey="delivery.tipsSandBody"
              t={t}
            />
            <TipCard
              number={3}
              titleKey="delivery.tipsCementTitle"
              bodyKey="delivery.tipsCementBody"
              t={t}
            />
            <TipCard
              number={4}
              titleKey="delivery.tipsRebarTitle"
              bodyKey="delivery.tipsRebarBody"
              t={t}
            />
          </div>
        </Container>
      </section>

      {/* Final CTA band */}
      <section className="py-10 md:py-14 bg-navy text-canvas">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6 items-center">
            <div>
              <div className="dim-rule dim-rule--start mb-3 text-canvas">
                <span className="whitespace-nowrap" style={{ color: "#FD5500" }}>
                  {t("home.finalEyebrow")}
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-semibold leading-tight">
                {t("delivery.ctaTitle")}
              </h2>
              <p className="mt-2 text-canvas/80 max-w-prose">
                {t("delivery.ctaBody")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-2">
              <CallButton label={t("actions.callNow")} size="lg" fullWidth />
              <WhatsAppButton
                label={t("actions.whatsapp")}
                locale={locale}
                size="lg"
                fullWidth
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function ZoneGroup({
  title,
  zones,
  locale,
  accent,
}: {
  title: string;
  zones: { id: string; name: { bn: string; en: string }; distanceKm: number | null }[];
  locale: Locale;
  accent: "brick" | "charcoal";
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span
          aria-hidden
          className={
            accent === "brick"
              ? "w-1.5 h-5 bg-brick"
              : "w-1.5 h-5 bg-charcoal"
          }
          style={{ borderRadius: 1 }}
        />
        <h3 className="font-display font-semibold text-base uppercase tracking-label text-charcoal">
          {title}
        </h3>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {zones.map((z) => (
          <li
            key={z.id}
            className="border border-line bg-canvas p-3 flex items-start gap-2"
            style={{ borderRadius: 2 }}
          >
            <IconMap className="w-4 h-4 mt-0.5 text-brick shrink-0" aria-hidden />
            <div className="min-w-0">
              <div className="font-display font-semibold text-sm break-words">
                {pick(z.name, locale)}
              </div>
              {z.distanceKm !== null ? (
                <div className="text-[11px] text-charcoal/70 mt-1 tabular">
                  ~ {z.distanceKm} km
                </div>
              ) : (
                <div className="text-[11px] text-charcoal/60 italic mt-1">
                  {/* TODO(owner) */}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TipCard({
  number,
  titleKey,
  bodyKey,
  t,
}: {
  number: number;
  titleKey:
    | "delivery.tipsBricksTitle"
    | "delivery.tipsSandTitle"
    | "delivery.tipsCementTitle"
    | "delivery.tipsRebarTitle";
  bodyKey:
    | "delivery.tipsBricksBody"
    | "delivery.tipsSandBody"
    | "delivery.tipsCementBody"
    | "delivery.tipsRebarBody";
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <span
          aria-hidden
          className="w-10 h-10 grid place-items-center bg-brick text-white font-display font-bold text-sm shadow-stamp-sm"
          style={{ borderRadius: 2 }}
        >
          {String(number).padStart(2, "0")}
        </span>
        <h3 className="font-display font-semibold text-base leading-snug">
          {t(titleKey)}
        </h3>
      </div>
      <p className="text-sm text-charcoal/80 leading-relaxed">{t(bodyKey)}</p>
    </Card>
  );
}
