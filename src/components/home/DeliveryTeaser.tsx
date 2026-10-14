import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import { site } from "@/content/site";
import { pick } from "@/i18n/l10n";
import type { Locale } from "@/i18n/config";
import type { ServiceZone } from "@/content/site";

/**
 * Home-page delivery teaser. Same data, same grouping logic, and the
 * same "not listed" line as /delivery, just in compact form.
 *
 *  - Left: zone chips pulled from site.serviceZones, split into
 *    Core / Extended groups (when both groups are present in data).
 *  - Right: a vehicle-fit mini-matrix that maps our three trucks to
 *    where they fit best. Hides entirely when site.vehicles is empty.
 *  - Always links to /delivery for the full story.
 */
export async function DeliveryTeaser({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const showVehicles = site.vehicles.length > 0;

  const coreZones = site.serviceZones.filter(
    (z: ServiceZone) => z.group === "core"
  );
  const extendedZones = site.serviceZones.filter(
    (z: ServiceZone) => z.group === "extended"
  );
  const hasBothGroups = coreZones.length > 0 && extendedZones.length > 0;
  const onlyOneGroup =
    (coreZones.length > 0 && extendedZones.length === 0) ||
    (extendedZones.length > 0 && coreZones.length === 0);

  return (
    <section className="py-12 md:py-16 bg-canvas border-b border-line">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <SectionHeading
            eyebrow={t("home.deliveryEyebrow")}
            title={t("home.deliveryTitle")}
            subtitle={t("home.deliverySubtitle")}
          />
          <Link
            href="/delivery"
            className="inline-flex items-center gap-1 self-start md:self-auto text-sm font-display uppercase tracking-label border border-charcoal h-12 px-4 hover:bg-sand"
            style={{ borderRadius: 2 }}
          >
            {t("home.deliveryViewAll")} <ArrowIcon className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="dim-rule dim-rule--start mb-3">
              <span className="whitespace-nowrap">
                {t("home.deliveryEyebrow")}
              </span>
            </div>

            {hasBothGroups ? (
              <div className="space-y-3">
                <ZoneGroup
                  title={t("home.deliveryZonesCore")}
                  zones={coreZones}
                  locale={locale}
                />
                <ZoneGroup
                  title={t("home.deliveryZonesExtended")}
                  zones={extendedZones}
                  locale={locale}
                />
              </div>
            ) : onlyOneGroup ? (
              <ZoneGroup
                title={
                  coreZones.length > 0
                    ? t("home.deliveryZonesCore")
                    : t("home.deliveryZonesExtended")
                }
                zones={site.serviceZones}
                locale={locale}
              />
            ) : null}

            <p className="mt-3 text-[11px] text-charcoal/60 italic">
              {t("home.deliveryNotListed")}
            </p>
          </Card>

          {showVehicles ? (
            <Card tone="sand">
              <div className="dim-rule dim-rule--start mb-3">
                <span className="whitespace-nowrap">
                  {t("home.deliveryVehiclesTitle")}
                </span>
              </div>
              <p className="text-sm text-charcoal/80 mb-4">
                {t("home.deliveryVehiclesSubtitle")}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    key: "small" as const,
                    titleKey: "home.vehicleSmallName" as const,
                    noteKey: "home.vehicleSmallNote" as const,
                    size: 0.7,
                  },
                  {
                    key: "medium" as const,
                    titleKey: "home.vehicleMediumName" as const,
                    noteKey: "home.vehicleMediumNote" as const,
                    size: 0.95,
                  },
                  {
                    key: "large" as const,
                    titleKey: "home.vehicleLargeName" as const,
                    noteKey: "home.vehicleLargeNote" as const,
                    size: 1.2,
                  },
                ].map((v) => (
                  <li
                    key={v.key}
                    className="border border-line bg-canvas p-3"
                    style={{ borderRadius: 2 }}
                  >
                    <div
                      aria-hidden
                      className="mb-2 h-12 grid place-items-center bg-sand"
                      style={{ borderRadius: 2 }}
                    >
                      <svg
                        viewBox="0 0 100 36"
                        className="h-9 text-charcoal"
                        style={{ width: `${60 * v.size}px` }}
                        aria-hidden
                      >
                        <rect
                          x="2"
                          y="6"
                          width="60"
                          height="20"
                          fill="currentColor"
                          fillOpacity="0.15"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <rect
                          x="62"
                          y="14"
                          width="22"
                          height="12"
                          fill="currentColor"
                          fillOpacity="0.15"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle cx="20" cy="28" r="4" fill="currentColor" />
                        <circle cx="74" cy="28" r="4" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="font-display font-semibold text-sm">
                      {t(v.titleKey)}
                    </div>
                    <div className="text-xs text-charcoal/70 mt-1 leading-snug">
                      {t(v.noteKey)}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

function ZoneGroup({
  title,
  zones,
  locale,
}: {
  title: string;
  zones: ServiceZone[];
  locale: Locale;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-eyebrow text-charcoal/60 font-display mb-1.5">
        {title}
      </div>
      <ul className="flex flex-wrap gap-2">
        {zones.map((z) => (
          <li
            key={z.id}
            className="inline-flex items-center gap-2 border border-charcoal/40 bg-canvas px-3 h-9 text-sm"
            style={{ borderRadius: 2 }}
          >
            <span
              aria-hidden
              className="w-1.5 h-1.5 bg-orange rounded-full"
            />
            <span className="font-display">{pick(z.name, locale)}</span>
            {z.distanceKm !== null ? (
              <span className="text-[11px] text-charcoal/60 tabular">
                ~ {z.distanceKm} km
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
