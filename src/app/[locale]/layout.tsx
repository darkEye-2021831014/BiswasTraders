import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/config";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileCallBar } from "@/components/layout/MobileCallBar";

export function generateStaticParams() {
  return [{ locale: "bn" }, { locale: "en" }];
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

  return (
    <html lang={params.locale}>
      <body className="bg-canvas text-charcoal min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages} locale={params.locale}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-brick focus:text-white focus:px-3 focus:py-2 focus:rounded"
          >
            Skip to content
          </a>
          <SiteHeader locale={params.locale} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter locale={params.locale} />
          <MobileCallBar locale={params.locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
