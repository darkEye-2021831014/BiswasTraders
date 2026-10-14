import type { Product } from "@/content/products";
import type { Locale } from "@/i18n/config";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProductImage } from "@/components/product/ProductImage";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import { pick } from "@/i18n/l10n";

/**
 * Featured bricks card for the catalog index. Id-s the section so the
 * in-page anchor strip can jump to it. Two columns on desktop:
 *  - left:  product image + soldBy + primary actions
 *  - right: variant list (each row has its own prefilled WhatsApp chip)
 * Card carries the orange "Our flagship" stamp on the image.
 */
export async function ProductFeaturedCard({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const t = await getTranslations({ locale });
  const name = pick(product.name, locale);
  return (
    <section
      id={product.slug}
      className="scroll-mt-24 md:scroll-mt-28"
      aria-labelledby={`${product.slug}-title`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-4 lg:gap-6">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <ProductImage
              slug={product.slug}
              alt={product.image.alt}
              variant="brick"
              aspect="4/3"
              priority
            />
            <span className="absolute top-2 left-2">
              <Badge tone="orange">{t("products.featuredEyebrow")}</Badge>
            </span>
          </div>
          <Card tone="charcoal" className="text-canvas">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-eyebrow text-canvas/60 font-display">
                  {t("products.soldBy")}
                </div>
                <div className="font-display text-base text-canvas mt-1">
                  {pick(product.soldBy, locale)}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <CallButton label={t("products.featuredGetPrice")} size="md" />
                <WhatsAppButton
                  label={t("actions.whatsapp")}
                  locale={locale}
                  product={name}
                  size="md"
                />
              </div>
            </div>
          </Card>
        </div>

        <Card as="article" className="flex flex-col">
          <div className="dim-rule dim-rule--start mb-3">
            <span className="whitespace-nowrap">{t("products.featuredEyebrow")}</span>
          </div>
          <h2
            id={`${product.slug}-title`}
            className="text-2xl md:text-3xl font-semibold leading-tight"
          >
            {name}
          </h2>
          <p className="mt-2 text-sm text-charcoal/80 max-w-prose">
            {t("products.featuredSubtitle")}
          </p>

          <div className="mt-6 flex items-center justify-between gap-2">
            <h3 className="font-display font-semibold text-base uppercase tracking-label text-charcoal/80">
              {t("products.featuredVariantsHeading")}
            </h3>
            <Badge tone="brick">{product.variants.length}</Badge>
          </div>

          <ul className="mt-3 space-y-2">
            {product.variants.map((v) => (
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
                  label={t("products.featuredVariantAsk")}
                  locale={locale}
                  product={`${name} — ${pick(v.name, locale)}`}
                  size="sm"
                />
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-5 border-t border-line">
            <Link
              href={`/products/${product.slug}` as `/products/${string}`}
              className="inline-flex items-center gap-1 text-sm font-display uppercase tracking-label text-charcoal/80 hover:text-charcoal"
            >
              {t("products.featuredSeeFull")} <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}
