import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, Hind_Siliguri, Anek_Bangla } from "next/font/google";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${anekBangla.variable} ${hindSiliguri.variable}`}
    >
      {children}
    </div>
  );
}
