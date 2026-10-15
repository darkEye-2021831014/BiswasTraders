import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { PageHeading } from "@/components/ui/PageHeading";
import { ProductAnchorStrip } from "@/components/product/ProductAnchorStrip";
import { ProductFeaturedCard } from "@/components/product/ProductFeaturedCard";
import { ProductMiniCard } from "@/components/product/ProductMiniCard";
import { BrickDivider } from "@/components/ui/BrickDivider";
import { getHeroProduct, products } from "@/content/products";
import { isLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";

/**
 * /products index. Same H1-PageHeading pattern as the rest of the site.
 * The flow is fixed by the brief:
 *   1. Page heading (one H1, no client JS)
 *   2. Sticky in-page anchor strip (Bricks | Sand | Khoa | Cement | Rod)
 *   3. Featured bricks card (image + all variants + Get price actions)
 *   4. Brick course divider
 *   5. Grid of the other four products (each card with name, soldBy, two
 *      key facts, Get price WhatsApp, View details link)
 *
 * The anchor strip is `position: sticky` with `top: <header height>` so
 * it parks under the site header on scroll, with no client JS.
 */

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  return buildMetadata({
    locale: params.locale,
    titleBn: "পণ্য — ইট, বালু, খোয়া, সিমেন্ট, রড",
    descriptionBn:
      "মেসার্স বিশ্বাস ট্রেডার্সের পাঁচটি পণ্য এক নজরে। দামের জন্য ফোন বা WhatsApp করুন।",
    path: "/products",
  });
}

export default async function ProductsPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });
  const sorted = [...products].sort((a, b) => a.order - b.order);
  const hero = getHeroProduct();
  const heroSlug = hero.slug;
  const others = sorted.filter((p) => p.slug !== heroSlug);

  return (
    <>
      <section className="pt-8 md:pt-12 pb-4 md:pb-6">
        <Container>
          <PageHeading
            eyebrow={t("products.pageEyebrow")}
            title={t("products.pageTitle")}
            subtitle={t("products.pageSubtitle")}
          />
        </Container>
      </section>

      <ProductAnchorStrip products={sorted} locale={params.locale} />

      <section className="py-8 md:py-12 bg-canvas">
        <Container>
          <ProductFeaturedCard product={hero} locale={params.locale} />
        </Container>
      </section>

      <BrickDivider tone="sand" />

      <section
        id="other-products"
        className="py-10 md:py-14 bg-sand"
        aria-labelledby="other-products-title"
      >
        <Container>
          <div className="max-w-3xl mb-6 md:mb-8">
            <div className="dim-rule mb-3">
              <span className="whitespace-nowrap">{t("products.anchorStickyTitle")}</span>
            </div>
            <h2
              id="other-products-title"
              className="text-2xl md:text-4xl font-semibold leading-tight"
            >
              {t("products.otherGridTitle")}
            </h2>
            <p className="mt-2 text-sm md:text-base text-charcoal/80 max-w-prose">
              {t("products.otherGridSubtitle")}
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {others.map((p) => (
              <li key={p.slug}>
                <ProductMiniCard product={p} locale={params.locale} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
