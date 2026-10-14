import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Space_Grotesk, Plus_Jakarta_Sans, Hind_Siliguri, Anek_Bangla } from "next/font/google";
import { isLocale, defaultLocale } from "@/i18n/config";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700"],
});

const anekBangla = Anek_Bangla({
  subsets: ["bengali"],
  display: "swap",
  variable: "--font-anek-bangla",
  weight: ["400", "500", "600", "700"],
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  display: "swap",
  variable: "--font-hind-siliguri",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "M/S Biswas Traders — Bricks & Building Materials, Singair, Manikganj",
  description:
    "Bricks, sand, khoa, cement and rebar — delivered in our own trucks from Singair, Manikganj. Call or WhatsApp for today's rate.",
  metadataBase: new URL("https://biswastraders.example"),
  robots: { index: true, follow: true },
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
