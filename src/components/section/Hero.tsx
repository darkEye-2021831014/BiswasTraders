import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Badge } from "@/components/ui/Badge";
import { BrickDivider } from "@/components/ui/BrickDivider";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/config";

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  return (
    <section className="relative bg-navy text-canvas overflow-hidden">
      <div className="absolute inset-0 brick-course opacity-90" aria-hidden />
      <Container className="relative py-14 md:py-20 lg:py-24">
        <div className="max-w-2xl">
          <Badge tone="orange" className="mb-5">
            {t("home.heroEyebrow")}
          </Badge>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
            {t("home.heroTitle")}
          </h1>
          <p className="mt-4 md:mt-5 text-base md:text-lg text-canvas/80 max-w-xl">
            {t("home.heroSubtitle")}
          </p>
          <div className="mt-6 md:mt-8 flex flex-wrap gap-2">
            <CallButton label={t("actions.callNow")} size="lg" />
            <WhatsAppButton
              label={t("actions.whatsapp")}
              locale={locale}
              size="lg"
            />
          </div>
          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {[t("home.trustLine1"), t("home.trustLine2"), t("home.trustLine3")].map((line) => (
              <li
                key={line}
                className="border border-canvas/20 bg-canvas/5 px-3 py-3 flex items-start gap-2"
                style={{ borderRadius: 2 }}
              >
                <span aria-hidden className="text-orange">▸</span>
                <span className="text-canvas/90">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <BrickDivider tone="navy" />
      <div className="bg-navy-deep text-canvas/70 text-[11px] uppercase tracking-eyebrow py-2 text-center font-display">
        {site.legalName[locale]} · {site.address[locale]}
      </div>
    </section>
  );
}
