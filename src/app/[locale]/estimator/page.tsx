import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Estimator } from "@/components/estimator/Estimator";
import type { Locale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return buildMetadata({
    locale: params.locale,
    titleBn: "হিসাবকারী — ইট, কংক্রিট, সিএফটি",
    descriptionBn:
      "আপনার কাজের জন্য কতটুকু ইট, সিমেন্ট, বালু বা খোয়া লাগবে — হিসাব করে দেখুন।",
    path: "/estimator",
  });
}

export default async function EstimatorPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });
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
            labels={{
              tabBricks: t("estimator.tabBricks"),
              tabConcrete: t("estimator.tabConcrete"),
              tabCft: t("estimator.tabCft"),
              lengthFt: t("estimator.lengthFt"),
              heightFt: t("estimator.heightFt"),
              thickness: t("estimator.thickness"),
              thickness5: t("estimator.thickness5"),
              thickness10: t("estimator.thickness10"),
              openingsSqft: t("estimator.openingsSqft"),
              openingsOptional: t("estimator.openingsOptional"),
              wastagePct: t("estimator.wastagePct"),
              wastageDefault: t("estimator.wastageDefault"),
              resultBricksTitle: t("estimator.resultBricksTitle"),
              resultBricksPieces: t("estimator.resultBricksPieces"),
              resultBricksThousands: t("estimator.resultBricksThousands"),
              resultBricksPerSqft: t("estimator.resultBricksPerSqft"),
              resultBricksArea: t("estimator.resultBricksArea"),
              resultBricksWastage: t("estimator.resultBricksWastage"),
              concreteLength: t("estimator.concreteLength"),
              concreteWidth: t("estimator.concreteWidth"),
              concreteThickness: t("estimator.concreteThickness"),
              concreteMix: t("estimator.concreteMix"),
              concreteMixCustom: t("estimator.concreteMixCustom"),
              concreteMixCement: t("estimator.concreteMixCement"),
              concreteMixSand: t("estimator.concreteMixSand"),
              concreteMixAggregate: t("estimator.concreteMixAggregate"),
              resultConcreteTitle: t("estimator.resultConcreteTitle"),
              resultConcreteVolume: t("estimator.resultConcreteVolume"),
              resultConcreteDry: t("estimator.resultConcreteDry"),
              resultConcreteCement: t("estimator.resultConcreteCement"),
              resultConcreteSand: t("estimator.resultConcreteSand"),
              resultConcreteAggregate: t("estimator.resultConcreteAggregate"),
              resultConcreteRatio: t("estimator.resultConcreteRatio"),
              cftLength: t("estimator.cftLength"),
              cftWidth: t("estimator.cftWidth"),
              cftHeight: t("estimator.cftHeight"),
              cftInches: t("estimator.cftInches"),
              cftFeet: t("estimator.cftFeet"),
              resultCftTitle: t("estimator.resultCftTitle"),
              resultCftTotal: t("estimator.resultCftTotal"),
              validateRequired: t("estimator.validateRequired"),
              validateTooBig: t("estimator.validateTooBig"),
              validateNan: t("estimator.validateNan"),
              estimateNote: t("estimator.estimateNote"),
              calc: t("estimator.calc"),
              askForPrice: t("estimator.askForPrice"),
              askForPriceQuantity: t("estimator.askForPriceQuantity"),
              callNow: t("actions.callNow"),
              whatsapp: t("actions.whatsapp"),
              mix1_2_4: "1 : 2 : 4",
              mix1_1_5_3: "1 : 1.5 : 3",
              mix1_3_6: "1 : 3 : 6",
              numberCft: t("estimator.numberCft"),
              numberBags: t("estimator.numberBags"),
              numberPieces: t("estimator.numberPieces"),
              numberSqft: t("estimator.numberSqft"),
              unitCft: t("estimator.unitCft"),
              unitBag: t("estimator.unitBag"),
              unitPcs: t("estimator.unitPcs"),
              unitSqft: t("estimator.unitSqft"),
            }}
          />
        </Card>
      </Container>
    </section>
  );
}
