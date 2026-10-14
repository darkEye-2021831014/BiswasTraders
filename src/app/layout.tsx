import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Space_Grotesk, Plus_Jakarta_Sans, Hind_Siliguri, Anek_Bangla } from "next/font/google";
import { isLocale, defaultLocale } from "@/i18n/config";
import { SITE_URL } from "@/content/site";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  // Strip weights the design doesn't actually use; trim ranges drop
  // each font's payload by ~30–40%. Falls back to system font when
  // a requested weight isn't loaded.
  weight: ["600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
  weight: ["400", "600"],
});

const anekBangla = Anek_Bangla({
  subsets: ["bengali"],
  display: "swap",
  variable: "--font-anek-bangla",
  // Anek Bangla 600 is the heaviest file at ~150 KB. Headings use
  // it via `font-display: swap`, so the body Bangla text (which uses
  // Hind Siliguri) is unaffected.
  weight: ["600"],
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  display: "swap",
  variable: "--font-hind-siliguri",
  // Single body weight; the 600 is rarely used outside headings.
  weight: ["400"],
});

export const metadata: Metadata = {
  // The /[locale] layout adds the localized title via the title.template
  // pattern, but Next still needs an absolute default here.
  title: {
    default: "M/S Biswas Traders — Bricks & Building Materials, Singair, Manikganj",
    template: "%s — M/S Biswas Traders",
  },
  description:
    "Bricks, sand, khoa, cement and rebar — delivered in our own trucks from Singair, Manikganj. Call or WhatsApp for today's rate.",
  // metadataBase lets every <link>/<meta> below resolve relative URLs
  // (icons, og:image, etc.) against the real site URL.
  metadataBase: new URL(SITE_URL),
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
};

/**
 * Root layout owns <html> and <body>, as required by Next.js. The
 * active locale is read from the x-next-intl-locale header (set by the
 * next-intl middleware), so <html lang> matches the rendered page.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  // next-intl middleware sets this header to the resolved locale.
  // Header names are case-insensitive; we look it up in both casings to be safe.
  const headerLocale =
    h.get("X-NEXT-INTL-LOCALE") ?? h.get("x-next-intl-locale") ?? h.get("x-locale");
  const lang = headerLocale && isLocale(headerLocale) ? headerLocale : defaultLocale;
  return (
    <html
      lang={lang}
      className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${anekBangla.variable} ${hindSiliguri.variable}`}
    >
      <body className="bg-canvas text-charcoal min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
