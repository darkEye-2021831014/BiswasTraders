import type { Product } from "@/content/products";
import type { Locale } from "@/i18n/config";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProductImage } from "@/components/product/ProductImage";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import { pick } from "@/i18n/l10n";

const variantToPalette: Record<string, "brick" | "sand" | "charcoal" | "navy" | "orange"> = {
  bricks: "brick",
  sand: "sand",
  khoa: "charcoal",
  cement: "navy",
  rod: "orange",
};

/**
 * Compact product card for the /products index grid (the 4 non-hero
 * materials). Id-s the section so the in-page anchor strip can jump
 * to it. Shows: image, name, soldBy, up to 2 quick specs, a prefilled
 * "Get price" WhatsApp, and a "View details" link.
 */
export async function ProductMiniCard({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const t = await getTranslations({ locale });
  const palette = variantToPalette[product.slug] ?? "brick";
  const name = pick(product.name, locale);
  const fact1 = product.specs[0];
  const fact2 = product.specs[1] ?? product.specs[0];

  return (
    <article
      id={product.slug}
      className="group h-full bg-canvas border border-line p-4 md:p-5 flex flex-col transition-shadow duration-100 hover:shadow-stamp focus-within:shadow-stamp scroll-mt-24 md:scroll-mt-28"
      style={{ borderRadius: 2 }}
    >
      <ProductImage
        slug={product.slug}
        alt={product.image.alt}
        variant={palette}
        aspect="4/3"
      />
      <h3 className="mt-4 font-display font-semibold text-lg leading-snug break-words">
        {name}
      </h3>
      <p className="text-sm text-charcoal/80 mt-1">
        {pick(product.shortDescription, locale)}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm border-t border-line pt-3">
        <div>
          <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal/60 font-display">
            {t("products.cardSoldBy")}
          </dt>
          <dd className="font-display text-charcoal mt-1 text-[13px] leading-snug">
            {pick(product.soldBy, locale)}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal/60 font-display">
            {t("products.cardSpecsHeading")}
          </dt>
          <dd className="font-display text-charcoal mt-1 text-[13px] leading-snug">
            {fact2 ? pick(fact2.value, locale) : "—"}
          </dd>
        </div>
      </dl>
      <div className="mt-auto pt-4 flex flex-col gap-2">
        <WhatsAppButton
          label={t("products.cardGetPrice")}
          locale={locale}
          product={name}
          size="sm"
          fullWidth
        />
        <Link
          href={`/products/${product.slug}` as `/products/${string}`}
          className="inline-flex items-center justify-center gap-1 h-10 text-xs font-display uppercase tracking-label border border-charcoal/30 text-charcoal hover:bg-sand"
          style={{ borderRadius: 2 }}
        >
          {t("products.cardViewDetails")} <ArrowIcon className="w-3 h-3" />
        </Link>
      </div>
    </article>
  );
}
