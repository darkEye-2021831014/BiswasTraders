import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SpecTable } from "@/components/ui/SpecTable";
import { ProductImage } from "@/components/product/ProductImage";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import { getHeroProduct } from "@/content/products";
import { pick } from "@/i18n/l10n";
import type { Locale } from "@/i18n/config";

/**
 * Big "spotlight" section for bricks. Two columns on desktop:
 *  - left: the image, then a Call + WhatsApp row
 *  - right: title, variants list (each row is a selectable-looking pill
 *    with its own WhatsApp chip prefilled with the variant name),
 *    SpecTable for the brick specs (empty ones are hidden by SpecTable),
 *    and the "common uses" list.
 */
export async function BrickSpotlight({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const bricks = getHeroProduct();
  return (
    <section className="py-12 md:py-16 bg-canvas">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <SectionHeading
            eyebrow={t("home.spotlightEyebrow")}
            title={t("home.spotlightTitle")}
            subtitle={t("home.spotlightSubtitle")}
          />
          <Link
            href="/products/bricks"
            className="inline-flex items-center gap-1 self-start md:self-auto text-sm font-display uppercase tracking-label border border-charcoal h-12 px-4 hover:bg-sand"
            style={{ borderRadius: 2 }}
          >
            {t("home.spotlightSeeFull")} <ArrowIcon className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-6 lg:gap-10">
          <div>
            <ProductImage
              slug={bricks.slug}
              alt={bricks.image.alt}
              variant="brick"
              aspect="4/3"
            />
            <Card tone="charcoal" className="mt-4 text-canvas">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-eyebrow text-canvas/60 font-display">
                    {t("home.spotlightCallForPrice")}
                  </div>
                  <div className="font-display text-lg mt-1">
                    {t("home.heroSubtitle")}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <CallButton label={t("actions.callNow")} size="md" />
                  <WhatsAppButton
                    label={t("actions.whatsapp")}
                    locale={locale}
                    product={pick(bricks.name, locale)}
                    size="md"
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="font-display font-semibold text-base uppercase tracking-label text-charcoal/80">
                  {t("products.variants")}
                </h3>
                <Badge tone="brick">{bricks.variants.length}</Badge>
              </div>
              {bricks.variants.length > 0 ? (
                <ul className="space-y-2">
                  {bricks.variants.map((v) => (
                    <li
                      key={v.id}
                      className="border border-line bg-canvas p-3 flex items-start gap-3"
                      style={{ borderRadius: 2 }}
                    >
                      <span
                        aria-hidden
                        className="w-1.5 h-10 bg-brick shrink-0 mt-1"
                        style={{ borderRadius: 1 }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-semibold text-base">
                          {pick(v.name, locale)}
                        </div>
                        {v.note ? (
                          <div className="text-xs text-charcoal/70 mt-0.5">
                            {pick(v.note, locale)}
                          </div>
                        ) : null}
                      </div>
                      <WhatsAppButton
                        label={t("home.spotlightAskVariant")}
                        locale={locale}
                        product={`${pick(bricks.name, locale)} — ${pick(v.name, locale)}`}
                        size="sm"
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-charcoal/70 italic">
                  {t("products.noVariants")}
                </p>
              )}
            </div>

            {bricks.specs.length > 0 ? (
              <div>
                <h3 className="font-display font-semibold text-base uppercase tracking-label text-charcoal/80 mb-3">
                  {t("products.specs")}
                </h3>
                <SpecTable rows={bricks.specs} locale={locale} />
              </div>
            ) : null}

            {bricks.uses.length > 0 ? (
              <div>
                <h3 className="font-display font-semibold text-base uppercase tracking-label text-charcoal/80 mb-3">
                  {t("home.spotlightUsesTitle")}
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                  {bricks.uses.map((u, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden className="text-orange">▸</span>
                      <span>{pick(u, locale)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}