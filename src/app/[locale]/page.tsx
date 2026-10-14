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
import { HomeFaqTeaser } from "@/components/home/HomeFaqTeaser";
import { YardPhotoGallery } from "@/components/gallery/YardPhotoGallery";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

/**
 * Home-page metadata. Title + description live in the message files
 * (home.heroTitle / home.heroSubtitle) so BN/EN stay in sync, but we
 * hoist them into dedicated SEO keys here for stable title strings.
 */
export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return buildMetadata({
    locale: params.locale,
    titleBn: "মেসার্স বিশ্বাস ট্রেডার্স — সিঙ্গাইর, মানিকগঞ্জ",
    titleEn: "M/S Biswas Traders — Singair, Manikganj",
    descriptionBn:
      "ইট, বালু, খোয়া, সিমেন্ট ও রড — সিঙ্গাইর, মানিকগঞ্জ থেকে আমাদের নিজস্ব ট্রাকে সরবরাহ। আজকের রেট জানতে কল বা WhatsApp করুন।",
    descriptionEn:
      "Bricks, sand, khoa, cement and rebar — delivered in our own trucks from Singair, Manikganj. Call or WhatsApp for today's rate.",
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

      <FinalCtaBand locale={locale} />
    </>
  );
}