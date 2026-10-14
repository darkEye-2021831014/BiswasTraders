import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import type { Locale } from "@/i18n/config";

export async function ContactCTA({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  return (
    <section className="py-12 md:py-16 bg-canvas">
      <Container>
        <div className="border border-line bg-charcoal text-canvas p-6 md:p-10 grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-6 items-center">
          <div>
            <div className="dim-rule dim-rule--start mb-3 text-canvas">
              <span className="whitespace-nowrap" style={{ color: "#FD5500" }}>
                {t("home.contactEyebrow")}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold leading-tight">
              {t("home.contactTitle")}
            </h2>
            <p className="mt-3 text-canvas/80 max-w-prose">{t("home.contactBody")}</p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3">
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
  );
}
