import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { BrickDivider } from "@/components/ui/BrickDivider";
import type { Locale } from "@/i18n/config";

/**
 * Final navy CTA band. Brick course divider above, big title, two
 * equal-weight action buttons. Lives at the very bottom of the home page
 * so the page ends on a clear "tap to get the price" moment.
 */
export async function FinalCtaBand({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  return (
    <>
      <BrickDivider tone="navy" />
      <section className="bg-navy text-canvas">
        <Container className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6 items-center">
            <div>
              <div className="dim-rule dim-rule--start mb-3 text-canvas">
                <span className="whitespace-nowrap" style={{ color: "#FD5500" }}>
                  {t("home.finalEyebrow")}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
                {t("home.finalTitle")}
              </h2>
              <p className="mt-2 text-canvas/80 max-w-prose">
                {t("home.finalBody")}
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