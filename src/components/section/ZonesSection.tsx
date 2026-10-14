import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { pick } from "@/i18n/l10n";

export async function ZonesSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  return (
    <section className="py-12 md:py-16 bg-sand border-y border-line">
      <Container>
        <SectionHeading
          eyebrow={t("home.zonesEyebrow")}
          title={t("home.zonesTitle")}
          subtitle={t("home.zonesSubtitle")}
        />
        <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {site.serviceZones.map((z) => (
            <li
              key={z.id}
              className="border border-line bg-canvas p-3 flex flex-col items-start"
              style={{ borderRadius: 2 }}
            >
              <div
                aria-hidden
                className="w-6 h-6 grid place-items-center bg-charcoal text-canvas text-[10px] font-display font-bold mb-2"
                style={{ borderRadius: 2 }}
              >
                ●
              </div>
              <div className="font-display font-semibold text-sm">
                {pick(z.name, locale)}
              </div>
              {z.distanceKm !== null ? (
                <div className="text-[11px] text-charcoal/60 mt-1 tabular">
                  ~ {z.distanceKm} km
                </div>
              ) : (
                <div className="text-[11px] text-charcoal/40 mt-1 italic">
                  {/* TODO(owner) — show distance once confirmed */}
                </div>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
