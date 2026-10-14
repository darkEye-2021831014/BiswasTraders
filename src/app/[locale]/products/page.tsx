import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/content/products";
import type { Locale } from "@/i18n/config";

export default async function ProductsPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });
  const sorted = [...products].sort((a, b) => a.order - b.order);
  return (
    <section className="py-10 md:py-14">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow={t("products.pageEyebrow")}
          title={t("products.pageTitle")}
          subtitle={t("products.pageSubtitle")}
        />
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} locale={params.locale} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
