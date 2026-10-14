import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getProductBySlug, products } from "@/content/products";
import { isLocale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";

/**
 * Pre-render the 5 slugs for both locales at build time. Anything not
 * in this list is a 404 (handled in the page body).
 */
export function generateStaticParams() {
  return products.flatMap((p) => [
    { locale: "bn", slug: p.slug },
    { locale: "en", slug: p.slug },
  ]);
}

/**
 * Per-product, per-locale metadata. Title + description come from
 * the `productMeta` namespace (already BN/EN aware) so we just hand
 * them to `buildMetadata` for canonical / hreflang / OG / Twitter.
 */
export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  const t = await getTranslations({ locale: params.locale, namespace: "productMeta" });
  return buildMetadata({
    locale: params.locale,
    titleBn: t(`${product.slug}Title`),
    titleEn: t(`${product.slug}Title`),
    descriptionBn: t(`${product.slug}Desc`),
    descriptionEn: t(`${product.slug}Desc`),
    path: `/products/${product.slug}`,
    ogType: "article",
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  setRequestLocale(params.locale);
  const product = getProductBySlug(params.slug);
  if (!product) notFound();
  return (
    <section className="py-8 md:py-12">
      <Container>
        <ProductDetail product={product} locale={params.locale} />
      </Container>
    </section>
  );
}
