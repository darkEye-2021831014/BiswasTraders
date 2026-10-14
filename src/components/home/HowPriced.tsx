import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import type { Locale } from "@/i18n/config";

const FACTORS = ["1", "2", "3"] as const;
const CHECKLIST = ["1", "2", "3", "4", "5"] as const;

/**
 * Explains how the price is decided in three plain factors, then shows
 * a checklist of what to tell on the call. Two call-to-action buttons
 * (Call + WhatsApp) sit below the checklist.
 */
export async function HowPriced({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  return (
    <section className="py-12 md:py-16 bg-canvas border-b border-line">
      <Container>
        <SectionHeading
          eyebrow={t("home.priceEyebrow")}
          title={t("home.priceTitle")}
          subtitle={t("home.priceBody")}
        />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-6">
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {FACTORS.map((n, i) => {
              const titleKey = `home.priceFactor${n}Title` as const;
              const bodyKey = `home.priceFactor${n}Body` as const;
              return (
                <li key={n}>
                  <Card className="h-full">
                    <div className="dim-rule dim-rule--start mb-3">
                      <span className="whitespace-nowrap">
                        {String(i + 1).padStart(2, "0")} / {FACTORS.length}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-base">
                      {t(titleKey)}
                    </h3>
                    <p className="text-sm text-charcoal/80 mt-2 leading-relaxed">
                      {t(bodyKey)}
                    </p>
                  </Card>
                </li>
              );
            })}
          </ol>
          <Card tone="charcoal" className="text-canvas">
            <div className="dim-rule dim-rule--start mb-3 text-canvas">
              <span className="whitespace-nowrap" style={{ color: "#FD5500" }}>
                {t("home.priceChecklistTitle")}
              </span>
            </div>
            <ol className="space-y-2.5 list-decimal pl-5 marker:text-canvas/60">
              {CHECKLIST.map((n) => {
                const key = `home.priceChecklistItem${n}` as const;
                return (
                  <li key={n} className="text-sm leading-relaxed">
                    {t(key)}
                  </li>
                );
              })}
            </ol>
            <div className="mt-5 flex flex-wrap gap-2">
              <CallButton label={t("actions.callNow")} size="md" />
              <WhatsAppButton
                label={t("actions.whatsapp")}
                locale={locale}
                size="md"
              />
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}