import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { BrickDivider } from "@/components/ui/BrickDivider";
import { Link } from "@/i18n/navigation";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";

export default async function NotFound({ params }: { params?: { locale?: string } }) {
  // When 404 is triggered from a server component, params can be undefined
  // in some edge cases. Fall back to the default locale rather than crashing.
  const requested = params?.locale;
  const locale: Locale = requested && isLocale(requested) ? requested : defaultLocale;
  const t = await getTranslations({ locale });
  return (
    <section className="bg-navy text-canvas">
      <Container className="py-16 md:py-24 relative">
        <div className="absolute inset-0 brick-course opacity-90" aria-hidden />
        <div className="relative">
          <div className="font-display text-[80px] md:text-[120px] font-bold leading-none text-orange">
            404
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold mt-2">{t("404.title")}</h1>
          <p className="mt-3 max-w-prose text-canvas/80">{t("404.body")}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/"
              className="h-12 px-4 inline-flex items-center font-display font-semibold uppercase tracking-label border border-canvas text-canvas hover:bg-canvas hover:text-navy"
              style={{ borderRadius: 2 }}
            >
              {t("404.home")}
            </Link>
            <CallButton label={t("actions.callNow")} />
            <WhatsAppButton label={t("actions.whatsapp")} locale={locale} />
          </div>
        </div>
      </Container>
      <BrickDivider tone="navy" />
    </section>
  );
}
