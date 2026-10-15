import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
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
import { HomeFaqTeaser } from "@/components/home/HomeFaqTeaser";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { gallery } from "@/content/gallery";

// YardPhotoGallery is "use client" (the lightbox needs JS). When the
// gallery is empty (the default state) we don't want its bundle to
// count against the home-page JS budget at all, so we load it with
// `ssr: false` and only when there's something to render.
const YardPhotoGallery = dynamic(
  () =>
    import("@/components/gallery/YardPhotoGallery").then(
      (m) => m.YardPhotoGallery,
    ),
  { ssr: false },
);

/**
 * Home-page metadata. The site is Bangla-only, so a single Bangla
 * title + description is hoisted here for stable SEO strings.
 */
export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return buildMetadata({
    locale: params.locale,
    titleBn: "মেসার্স বিশ্বাস ট্রেডার্স",
    descriptionBn:
      "ইট, বালু, খোয়া, সিমেন্ট ও রড — সিঙ্গাইর, মানিকগঞ্জ থেকে আমাদের নিজস্ব ট্রাকে সরবরাহ। আজকের রেট জানতে কল বা WhatsApp করুন।",
    path: "/",
  });
}

/**
 * Home page composition. The order is fixed by the brief and matches the
 * 5-second-clarity goal: who we are, what we promise, the main product,
 * the other four, how price works, how ordering works, where we go, where
 * to find us, an FAQ, a yard photo gallery, and a final action.
 *
 * Every section is a server component. The yard gallery wraps itself
 * in "use client" because of its lightbox.
 */
export default async function HomePage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const locale = params.locale;
  const t = await getTranslations({ locale });
  return (
    <>
      {/* LocalBusiness JSON-LD — only confirmed facts from site.ts. */}
      <LocalBusinessJsonLd locale={locale} />
      <Hero locale={locale} />
      <TrustStrip locale={locale} />
      <BrickDivider tone="sand" />
      <BrickSpotlight locale={locale} />
      <OtherMaterials locale={locale} />
      <HowPriced locale={locale} />
      <ThreeSteps locale={locale} />
      <DeliveryTeaser locale={locale} />
      <DepotTeaser locale={locale} />

      <HomeFaqTeaser locale={locale} />

      {gallery.length > 0 ? (
        <section className="py-12 md:py-16 bg-canvas border-b border-line">
          <Container>
            <SectionHeading
              eyebrow={t("homeGallery.eyebrow")}
              title={t("homeGallery.title")}
              subtitle={t("homeGallery.subtitle")}
            />
            <div className="mt-6">
              <YardPhotoGallery locale={locale} />
            </div>
          </Container>
        </section>
      ) : null}

      <FinalCtaBand locale={locale} />
    </>
  );
}