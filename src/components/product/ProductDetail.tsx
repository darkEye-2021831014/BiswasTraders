import type { Product } from "@/content/products";
import type { Locale } from "@/i18n/config";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SpecTable } from "@/components/ui/SpecTable";
import { ProductImage } from "@/components/product/ProductImage";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ProductBreadcrumb } from "@/components/product/ProductBreadcrumb";
import { ProductRelated } from "@/components/product/ProductRelated";
import { Link } from "@/i18n/navigation";
import { pick } from "@/i18n/l10n";
import { products } from "@/content/products";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";

const variantToPalette: Record<string, "brick" | "sand" | "charcoal" | "navy" | "orange"> = {
  bricks: "brick",
  sand: "sand",
  khoa: "charcoal",
  cement: "navy",
  rod: "orange",
};

/**
 * Full product detail composition. Server-rendered, no client JS.
 *
 * Sections, in order:
 *   1. Breadcrumb (with BreadcrumbList JSON-LD)
 *   2. Header block: H1, shortDescription, ProductImage, soldBy stamp,
 *      primary Call + WhatsApp (prefilled with product name)
 *   3. Variants section (each with its own prefilled variant WhatsApp)
 *   4. SpecTable (zebra, tabular)
 *   5. "Where it's used" list
 *   6. "Tell us on the call" checklist + price note
 *   7. Brands row (only if product.brands has entries)
 *   8. Estimator link card
 *   9. Related products (other 4)
 *  10. Final CTA band (Call + WhatsApp, charcoal)
 *
 * The page-level final CTA band reuses the pattern from the home page.
 */
export async function ProductDetail({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const t = await getTranslations({ locale });
  const palette = variantToPalette[product.slug] ?? "brick";
  const name = pick(product.name, locale);
  const hasBrands = product.brands.length > 0;

  return (
    <div className="space-y-10 md:space-y-14">
      <ProductBreadcrumb
        product={product}
        locale={locale}
        homeLabel={t("product.breadcrumbHome")}
        productsLabel={t("product.breadcrumbProducts")}
      />

      {/* Header block */}
      <section
        className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10"
        aria-labelledby="product-title"
      >
        <div>
          <ProductImage
            slug={product.slug}
            alt={product.image.alt}
            variant={palette}
            aspect="4/3"
            priority
          />
        </div>
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            {product.hero ? (
              <Badge tone="orange">{t("product.stampedHero")}</Badge>
            ) : null}
            <Badge tone="dark">
              <span
                aria-hidden
                className="w-1.5 h-1.5 bg-orange rounded-full"
              />
              {t("product.stampedReady")}
            </Badge>
          </div>
          <h1
            id="product-title"
            className="text-3xl md:text-5xl font-semibold leading-tight break-words"
          >
            {name}
          </h1>
          <p className="text-base text-charcoal/80 max-w-prose">
            {pick(product.shortDescription, locale)}
          </p>

          <Card tone="sand">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
                  {t("products.soldBy")}
                </div>
                <div className="font-display text-base text-charcoal mt-1">
                  {pick(product.soldBy, locale)}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <CallButton label={t("actions.callNow")} size="md" />
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
      </section>

      {/* Variants */}
      <section aria-labelledby="variants-title">
        <div className="flex items-end justify-between gap-3 mb-3">
          <div className="dim-rule dim-rule--start flex-1">
            <span className="whitespace-nowrap">{t("products.variants")}</span>
          </div>
          {product.variants.length > 0 ? (
            <Badge tone="brick">{product.variants.length}</Badge>
          ) : null}
        </div>
        <h2 id="variants-title" className="text-xl md:text-2xl font-semibold">
          {product.variants.length > 0
            ? pick(product.name, locale)
            : t("products.noVariants")}
        </h2>
        {product.variants.length > 0 ? (
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.variants.map((v) => {
              const vName = pick(v.name, locale);
              return (
                <li
                  key={v.id}
                  className="border border-line bg-canvas p-4"
                  style={{ borderRadius: 2 }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="w-1.5 h-10 bg-brick shrink-0 mt-1"
                      style={{ borderRadius: 1 }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold text-base break-words">
                        {vName}
                      </div>
                      {v.note ? (
                        <div className="text-xs text-charcoal/70 mt-1">
                          {pick(v.note, locale)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-3">
                    <WhatsAppButton
                      label={t("product.variantAsk")}
                      locale={locale}
                      product={`${name} — ${vName}`}
                      size="sm"
                      fullWidth
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </section>

      {/* Specs + where-used */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {product.specs.length > 0 ? (
          <div>
            <div className="dim-rule dim-rule--start mb-3">
              <span className="whitespace-nowrap">{t("products.specs")}</span>
            </div>
            <SpecTable rows={product.specs} locale={locale} />
          </div>
        ) : null}

        {product.uses.length > 0 ? (
          <div>
            <div className="dim-rule dim-rule--start mb-3">
              <span className="whitespace-nowrap">
                {t("product.whereUsedTitle")}
              </span>
            </div>
            <ul className="space-y-2 text-sm">
              {product.uses.map((u, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden className="text-orange shrink-0">▸</span>
                  <span>{pick(u, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <div className="dim-rule dim-rule--start mb-3">
              <span className="whitespace-nowrap">
                {t("product.whereUsedTitle")}
              </span>
            </div>
            <p className="text-sm text-charcoal/70 italic">
              {t("product.whereUsedEmpty")}
            </p>
          </div>
        )}
      </section>

      {/* Ask on call (with price note) */}
      {product.askOnCall.length > 0 ? (
        <section aria-labelledby="ask-title">
          <div className="dim-rule dim-rule--start mb-3">
            <span className="whitespace-nowrap">
              {t("product.tellUsOnCallTitle")}
            </span>
          </div>
          <h2 id="ask-title" className="text-xl md:text-2xl font-semibold">
            {t("product.tellUsOnCallTitle")}
          </h2>
          <Card tone="charcoal" className="text-canvas mt-4">
            <ul className="space-y-3 list-none">
              {product.askOnCall.map((a, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed">
                  <span
                    aria-hidden
                    className="mt-0.5 w-6 h-6 shrink-0 grid place-items-center border border-canvas/40 font-display text-[11px] font-bold tabular"
                    style={{ borderRadius: 2 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{pick(a, locale)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-canvas/15 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-[12px] text-canvas/80 italic max-w-prose">
                {t("product.priceNote")}
              </p>
              <div className="flex flex-wrap gap-2">
                <CallButton label={t("actions.callNow")} size="sm" />
                <WhatsAppButton
                  label={t("product.askPriceFor")}
                  locale={locale}
                  product={name}
                  size="sm"
                />
              </div>
            </div>
          </Card>
        </section>
      ) : null}

      {/* Brands row (only if populated) */}
      {hasBrands ? (
        <section aria-labelledby="brands-title">
          <div className="dim-rule dim-rule--start mb-3">
            <span className="whitespace-nowrap">{t("product.brandsTitle")}</span>
          </div>
          <h2 id="brands-title" className="text-xl md:text-2xl font-semibold">
            {t("product.brandsTitle")}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {product.brands.map((b) => (
              <li
                key={b}
                className="inline-flex items-center h-10 px-3 border border-line bg-canvas font-display text-sm"
                style={{ borderRadius: 2 }}
              >
                {b}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Estimator link card */}
      <section>
        <Card tone="sand" className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
              {t("product.needEstimateTitle")}
            </div>
            <p className="text-sm text-charcoal/80 mt-1 max-w-prose">
              {t("product.needEstimateBody")}
            </p>
          </div>
          <Link
            href="/estimator"
            className="inline-flex items-center gap-1 h-12 px-4 text-xs font-display font-semibold uppercase tracking-label border border-charcoal bg-canvas text-charcoal hover:shadow-stamp-sm shrink-0"
            style={{ borderRadius: 2 }}
          >
            {t("product.needEstimateCta")} <ArrowIcon className="w-3 h-3" />
          </Link>
        </Card>
      </section>

      {/* Related + final CTA */}
      <ProductRelated
        currentSlug={product.slug}
        products={products}
        locale={locale}
        title={t("product.relatedTitle")}
      />

      <Card tone="charcoal" className="text-canvas flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-[10px] uppercase tracking-eyebrow text-canvas/60 font-display">
            {t("product.finalCtaEyebrow")}
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold mt-1">
            {t("product.finalCtaTitle")}
          </h2>
          <p className="text-canvas/80 mt-2 max-w-prose">
            {t("product.finalCtaBody")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col gap-2">
          <CallButton label={t("actions.callNow")} size="lg" fullWidth />
          <WhatsAppButton
            label={t("actions.whatsapp")}
            locale={locale}
            product={name}
            size="lg"
            fullWidth
          />
        </div>
      </Card>
    </div>
  );
}
