import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { BrickSpotlight } from "@/components/home/BrickSpotlight";
import { OtherMaterials } from "@/components/home/OtherMaterials";
import { HowPriced } from "@/components/home/HowPriced";
import { ThreeSteps } from "@/components/home/ThreeSteps";
import { DeliveryTeaser } from "@/components/home/DeliveryTeaser";
import { DepotTeaser } from "@/components/home/DepotTeaser";
import { FinalCtaBand } from "@/components/home/FinalCtaBand";
import { BrickDivider } from "@/components/ui/BrickDivider";
import type { Locale } from "@/i18n/config";

/**
 * Home page composition. The order is fixed by the brief and matches the
 * 5-second-clarity goal: who we are, what we promise, the main product,
 * the other four, how price works, how ordering works, where we go, where
 * to find us, and a final action.
 *
 * Every section is a server component. No client JS is added by the page.
 */
export default function HomePage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const locale = params.locale;
  return (
    <>
      <Hero locale={locale} />
      <TrustStrip locale={locale} />
      <BrickDivider tone="sand" />
      <BrickSpotlight locale={locale} />
      <OtherMaterials locale={locale} />
      <HowPriced locale={locale} />
      <ThreeSteps locale={locale} />
      <DeliveryTeaser locale={locale} />
      <DepotTeaser locale={locale} />
      <FinalCtaBand locale={locale} />
    </>
  );
}