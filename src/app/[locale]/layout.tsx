import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/config";
import { site } from "@/content/site";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { StickyActionBar } from "@/components/layout/StickyActionBar";

// NoticeBar is "use client" (the dismiss button needs state). When
// `site.notice` is null (the default) we don't want its bundle on the
// page at all, so we load it with `ssr: false` and only render the
// element when there's actually a notice to show.
const NoticeBar = dynamic(
  () => import("@/components/layout/NoticeBar").then((m) => m.NoticeBar),
  { ssr: false },
);

export function generateStaticParams() {
  return [{ locale: "bn" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  setRequestLocale(params.locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale: params.locale });
  return (
    <NextIntlClientProvider messages={messages} locale={params.locale}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-brick focus:text-white focus:px-3 focus:py-2"
        style={{ borderRadius: 2 }}
      >
        {t("nav.skipToContent")}
      </a>
      {site.notice ? <NoticeBar notice={site.notice} locale={params.locale} /> : null}
      <UtilityBar locale={params.locale} />
      <SiteHeader locale={params.locale} />
      {/* Bottom padding reserves space for the mobile sticky action bar. */}
      <main id="main" className="flex-1 pb-24 md:pb-0">
        {children}
      </main>
      <SiteFooter locale={params.locale} />
      <StickyActionBar locale={params.locale} />
    </NextIntlClientProvider>
  );
}