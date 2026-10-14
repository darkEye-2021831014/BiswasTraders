import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Estimator } from "@/components/estimator/Estimator";
import type { Locale } from "@/i18n/config";
import { products } from "@/content/products";
import { pick } from "@/i18n/l10n";

export default async function EstimatorPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });
  const items = [...products]
    .sort((a, b) => a.order - b.order)
    .map((p) => ({ id: p.slug, name: pick(p.name, params.locale) }));
  return (
    <section className="py-10 md:py-14">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow={t("estimator.pageEyebrow")}
          title={t("estimator.pageTitle")}
          subtitle={t("estimator.pageSubtitle")}
        />
        <Card elevated className="mt-8">
          <Estimator
            locale={params.locale}
            products={items}
            labels={{
              product: t("estimator.product"),
              area: t("estimator.area"),
              areaHint: t("estimator.areaHint"),
              unit: t("estimator.unit"),
              qty: t("estimator.qty"),
              calc: t("estimator.calc"),
              result: t("estimator.result"),
              resultHint: t("estimator.resultHint"),
              footer: t("estimator.footer"),
            }}
          />
        </Card>
      </Container>
    </section>
  );
}
