import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/section/Hero";
import { ProcessSteps } from "@/components/section/ProcessSteps";
import { ZonesSection } from "@/components/section/ZonesSection";
import { ContactCTA } from "@/components/section/ContactCTA";
import { ProductCard } from "@/components/product/ProductCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "@/i18n/navigation";
import { products } from "@/content/products";
import { pick } from "@/i18n/l10n";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import type { Locale } from "@/i18n/config";

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });
  const sorted = [...products].sort((a, b) => a.order - b.order);

  return (
    <>
      <Hero locale={params.locale} />
      <section className="py-12 md:py-16">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <SectionHeading
              eyebrow={t("home.productsEyebrow")}
              title={t("home.productsTitle")}
              subtitle={t("home.productsSubtitle")}
            />
            <Link
              href="/products"
              className="inline-flex items-center gap-1 self-start md:self-auto text-sm font-display uppercase tracking-label border border-charcoal h-12 px-4 hover:bg-sand"
              style={{ borderRadius: 2 }}
            >
              {t("actions.viewAllProducts")} <ArrowIcon className="w-3 h-3" />
            </Link>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} locale={params.locale} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <ProcessSteps locale={params.locale} />
      <ZonesSection locale={params.locale} />
      <ContactCTA locale={params.locale} />
    </>
  );
}
