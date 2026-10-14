import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductImage } from "@/components/product/ProductImage";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import { products } from "@/content/products";
import { pick } from "@/i18n/l10n";
import type { Locale } from "@/i18n/config";
import type { Product } from "@/content/products";

const variantToPalette: Record<string, "brick" | "sand" | "charcoal" | "navy" | "orange"> = {
  bricks: "brick",
  sand: "sand",
  khoa: "charcoal",
  cement: "navy",
  rod: "orange",
};

/**
 * Four-equal-card grid for the non-brick materials. Each card shows an
 * image, the product name, the sold-by unit, two key facts pulled from
 * the spec list (label + value), a primary "Get price" WhatsApp button
 * (prefilled with the product name) and a quiet link to the detail page.
 * The card lifts with a hard offset shadow on hover/focus.
 */
export async function OtherMaterials({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const others = products
    .filter((p) => !p.hero)
    .sort((a, b) => a.order - b.order);
  return (
    <section className="py-12 md:py-16 bg-sand border-y border-line">
      <Container>
        <SectionHeading
          eyebrow={t("home.otherEyebrow")}
          title={t("home.otherTitle")}
          subtitle={t("home.otherSubtitle")}
        />
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {others.map((p) => (
            <li key={p.slug}>
              <OtherMaterialCard
                product={p}
                locale={locale}
                labels={{
                  getPrice: t("home.otherGetPrice"),
                  details: t("home.otherDetails"),
                  fact1Label: t("home.otherFact1Label"),
                  fact2Label: t("home.otherFact2Label"),
                }}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

type Labels = {
  getPrice: string;
  details: string;
  fact1Label: string;
  fact2Label: string;
};

function OtherMaterialCard({
  product,
  locale,
  labels,
}: {
  product: Product;
  locale: Locale;
  labels: Labels;
}) {
  const palette = variantToPalette[product.slug] ?? "brick";
  // Two key facts from the spec list — fall back to the first if there
  // is no second, so the second column is never blank.
  const fact1 = product.specs[0];
  const fact2 = product.specs[1] ?? product.specs[0];
  return (
    <article
      className="group h-full bg-canvas border border-line p-4 md:p-5 flex flex-col transition-shadow duration-100 hover:shadow-stamp focus-within:shadow-stamp"
      style={{ borderRadius: 2 }}
    >
      <ProductImage
        slug={product.slug}
        alt={product.image.alt}
        variant={palette}
        aspect="4/3"
      />
      <h3 className="mt-4 font-display font-semibold text-lg leading-snug">
        {pick(product.name, locale)}
      </h3>
      <p className="text-sm text-charcoal/80 mt-1">
        {pick(product.shortDescription, locale)}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm border-t border-line pt-3">
        <div>
          <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
            {labels.fact1Label}
          </dt>
          <dd className="font-display text-charcoal mt-1 text-[13px] leading-snug">
            {pick(product.soldBy, locale)}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display">
            {labels.fact2Label}
          </dt>
          <dd className="font-display text-charcoal mt-1 text-[13px] leading-snug">
            {fact2 ? pick(fact2.value, locale) : "—"}
          </dd>
        </div>
      </dl>
      <div className="mt-auto pt-4 flex flex-col gap-2">
        <WhatsAppButton
          label={labels.getPrice}
          locale={locale}
          product={pick(product.name, locale)}
          size="sm"
          fullWidth
        />
        <Link
          href={`/products/${product.slug}` as `/products/${string}`}
          className="inline-flex items-center justify-center gap-1 h-10 text-xs font-display uppercase tracking-label border border-charcoal/30 text-charcoal hover:bg-sand"
          style={{ borderRadius: 2 }}
        >
          {labels.details} <ArrowIcon className="w-3 h-3" />
        </Link>
      </div>
    </article>
  );
}