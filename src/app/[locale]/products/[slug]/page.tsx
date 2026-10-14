import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { ProductGallery } from "@/components/product/ProductGallery";
import { getProductBySlug, products } from "@/content/products";
import { isLocale } from "@/i18n/config";
import { pick } from "@/i18n/l10n";

export function generateStaticParams() {
  return products.flatMap((p) => [
    { locale: "bn", slug: p.slug },
    { locale: "en", slug: p.slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) return {};
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  const name = pick(product.name, params.locale);
  const desc = pick(product.shortDescription, params.locale);
  return { title: `${name} — M/S Biswas Traders`, description: desc };
}

export default function ProductDetailPage({
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
        <ProductGallery product={product} locale={params.locale} />
      </Container>
    </section>
  );
}
