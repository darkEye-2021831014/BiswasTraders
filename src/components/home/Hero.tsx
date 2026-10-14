import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ProductImage } from "@/components/product/ProductImage";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { site } from "@/content/site";
import { getHeroProduct } from "@/content/products";
import { pick } from "@/i18n/l10n";
import type { Locale } from "@/i18n/config";

/**
 * Home hero. The only H1 on the page. Puts bricks first, then names the
 * other four materials in a single sub-headline. Three actions: Call (primary
 * brick), WhatsApp (dark), and a quiet text link to the bricks detail page.
 *
 * The right-hand side (or below on mobile) is a framed ProductImage of
 * bricks with a stamp badge that shows only the confirmed location
 * (Joymantop, Singair) — no other unconfirmed claims.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const bricks = getHeroProduct();
  return (
    <section className="relative bg-navy text-canvas overflow-hidden">
      <div className="absolute inset-0 brick-course opacity-95" aria-hidden />
      <Container className="relative py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-12 items-center">
          <div>
            <Badge tone="orange" className="mb-4">
              {t("home.heroEyebrow")}
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight max-w-2xl">
              {t("home.heroTitle")}
            </h1>
            <p className="mt-4 md:mt-5 text-base md:text-lg text-canvas/80 max-w-xl">
              {t("home.heroSubtitle")}
            </p>
            <div className="mt-6 md:mt-7 flex flex-wrap items-center gap-2">
              <CallButton label={t("actions.callNow")} size="lg" />
              <WhatsAppButton
                label={t("actions.whatsapp")}
                locale={locale}
                size="lg"
              />
            </div>
            <div className="mt-4">
              <Link
                href="/products/bricks"
                className="inline-flex items-center gap-1 text-sm font-display uppercase tracking-label text-canvas/85 hover:text-canvas underline-offset-4 hover:underline"
                style={{ borderRadius: 2 }}
              >
                {t("home.heroSeeBricks")} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          <div>
            <div className="relative border border-canvas/20 bg-canvas/[0.04] p-3 md:p-4 shadow-stamp" style={{ borderRadius: 2 }}>
              <div className="absolute top-3 left-3 z-10">
                <Badge tone="orange">
                  <span
                    aria-hidden
                    className="w-1.5 h-1.5 bg-navy rounded-full"
                  />
                  {t("home.heroStampLocation")}
                </Badge>
              </div>
              <ProductImage
                slug={bricks.slug}
                alt={bricks.image.alt}
                variant="brick"
                aspect="4/3"
                priority
              />
              <div className="mt-3 flex items-center justify-between gap-3 text-[11px] uppercase tracking-eyebrow font-display text-canvas/80">
                <span>{pick(bricks.name, locale)}</span>
                <span className="tabular">{site.phone}</span>
              </div>
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-eyebrow font-display text-canvas/55 text-center">
              {t("actions.callNow")} · {t("actions.whatsapp")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}