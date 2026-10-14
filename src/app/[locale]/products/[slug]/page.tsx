import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getProductBySlug, products } from "@/content/products";
import { isLocale } from "@/i18n/config";

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
 * Per-product, per-locale metadata. We add canonical + alternate
 * language links so each localized detail page can stand on its own
 * in search results without confusing the bn/en signals.
 */
export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  const baseUrl = "https://biswastraders.trade";
  const path =
    params.locale === "bn"
      ? `/products/${product.slug}`
      : `/en/products/${product.slug}`;
  const altPath =
    params.locale === "bn"
      ? `/en/products/${product.slug}`
      : `/products/${product.slug}`;
  const t = await getTranslations({ locale: params.locale, namespace: "productMeta" });
  const title = t(`${product.slug}Title`);
  const description = t(`${product.slug}Desc`);
  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: {
        bn: `${baseUrl}/products/${product.slug}`,
        en: `${baseUrl}/en/products/${product.slug}`,
        "x-default": `${baseUrl}${altPath}`,
      },
    },
  };
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
