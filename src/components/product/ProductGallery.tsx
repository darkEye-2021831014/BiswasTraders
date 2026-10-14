import type { Product } from "@/content/products";
import type { Locale } from "@/i18n/config";
import { getTranslations } from "next-intl/server";
import { ProductImage } from "@/components/product/ProductImage";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SpecTable } from "@/components/ui/SpecTable";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Link } from "@/i18n/navigation";
import { pick } from "@/i18n/l10n";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";

const variantToPalette: Record<string, "brick" | "sand" | "charcoal" | "navy" | "orange"> = {
  bricks: "brick",
  sand: "sand",
  khoa: "charcoal",
  cement: "navy",
  rod: "orange",
};

export async function ProductGallery({ product, locale }: { product: Product; locale: Locale }) {
  const t = await getTranslations({ locale });
  const palette = variantToPalette[product.slug] ?? "brick";
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10">
      <div>
        <ProductImage
          slug={product.slug}
          alt={product.image.alt}
          variant={palette}
          aspect="4/3"
          priority
        />
        <p className="mt-3 text-xs text-charcoal/70 italic">
          Placeholder — drop a real photo at <code className="font-mono">/public/images/products/{product.slug}.jpg</code>.
        </p>
      </div>
      <div className="space-y-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {product.hero ? <Badge tone="orange">{t("product.stampedHero")}</Badge> : null}
            <Badge tone="dark">
              <span className="w-1.5 h-1.5 bg-orange rounded-full" aria-hidden /> {t("product.stampedReady")}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
            {pick(product.name, locale)}
          </h1>
          <p className="mt-3 text-base text-charcoal/80 max-w-prose">
            {pick(product.shortDescription, locale)}
          </p>
        </div>

        <Card tone="sand" className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
              {t("products.soldBy")}
            </div>
            <div className="font-display text-base text-charcoal mt-1">
              {pick(product.soldBy, locale)}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <CallButton label={t("actions.getQuote")} size="sm" />
            <WhatsAppButton
              label={t("actions.askWhatsapp")}
              locale={locale}
              product={pick(product.name, locale)}
              size="sm"
            />
          </div>
        </Card>

        {product.variants.length > 0 ? (
          <section>
            <SectionHeading eyebrow={t("products.variants")} title="" />
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.variants.map((v) => (
                <li
                  key={v.id}
                  className="border border-line bg-canvas p-3 flex items-start gap-3"
                  style={{ borderRadius: 2 }}
                >
                  <span
                    aria-hidden
                    className="w-1.5 h-6 bg-brick shrink-0"
                    style={{ borderRadius: 1 }}
                  />
                  <div>
                    <div className="font-display font-semibold text-sm">
                      {pick(v.name, locale)}
                    </div>
                    {v.note ? (
                      <div className="text-xs text-charcoal/70 mt-1">
                        {pick(v.note, locale)}
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <p className="text-sm text-charcoal/70 italic">{t("products.noVariants")}</p>
        )}

        {product.uses.length > 0 ? (
          <section>
            <SectionHeading eyebrow={t("products.uses")} title="" />
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
              {product.uses.map((u, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden className="text-orange">▸</span>
                  <span>{pick(u, locale)}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {product.specs.length > 0 ? (
          <section>
            <SectionHeading eyebrow={t("products.specs")} title="" />
            <SpecTable rows={product.specs} locale={locale} />
          </section>
        ) : null}
        {product.askOnCall.length > 0 ? (
          <section>
            <SectionHeading eyebrow={t("products.askOnCall")} title="" />
            <Card tone="charcoal" className="text-canvas">
              <ol className="space-y-2 list-decimal pl-5">
                {product.askOnCall.map((a, i) => (
                  <li key={i} className="text-sm leading-relaxed">
                    {pick(a, locale)}
                  </li>
                ))}
              </ol>
              <div className="mt-4 flex flex-wrap gap-2">
                <CallButton label={t("actions.callNow")} size="sm" />
                <WhatsAppButton
                  label={t("actions.askWhatsapp")}
                  locale={locale}
                  product={pick(product.name, locale)}
                  size="sm"
                />
              </div>
            </Card>
          </section>
        ) : null}
      </div>

      <div className="lg:col-span-2">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm text-charcoal/80 hover:text-charcoal"
        >
          <ArrowIcon className="w-4 h-4 rotate-180" />
          {t("product.backToList")}
        </Link>
      </div>
    </div>
  );
}
