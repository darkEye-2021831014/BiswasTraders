import { site } from "@/content/site";
import { isLocale, type Locale } from "@/i18n/config";

/** tel: link, BD national converted to international. */
export function telHref(): string {
  return `tel:+${site.phone.replace(/^0/, "880")}`;
}

export type WaParams = {
  locale: Locale;
  product?: string | undefined;
  quantity?: string | undefined;
  location?: string | undefined;
};

type TemplateInput = {
  product: string;
  quantity: string;
  location: string;
};

// The site is Bangla-only — one template, no locale lookup.
const TEMPLATE = ({ product, quantity, location }: TemplateInput): string =>
  [
    "আসসালামু আলাইকুম,",
    "আমি মেসার্স বিশ্বাস ট্রেডার্স থেকে দাম জানতে চাই।",
    `পণ্য: ${product || "উল্লেখ নেই"}।`,
    `পরিমাণ: ${quantity || "উল্লেখ নেই"}।`,
    `ডেলিভারি: ${location || "উল্লেখ নেই"}।`,
    "ধন্যবাদ।",
  ].join("\n");

/**
 * Build a wa.me URL with a prefilled Bangla message.
 *
 * Defensive: if a non-locale string somehow arrives at runtime, fall back
 * to Bangla (the default locale) so we never throw during RSC serialization.
 */
export function waHref(params: WaParams): string {
  // Touch the locale arg to keep the call sites stable — the value is
  // ignored because the message is always Bangla on this single-locale site.
  void isLocale(params.locale);
  const product = params.product ?? "";
  const quantity = params.quantity ?? "";
  const location = params.location ?? "";
  const text = TEMPLATE({ product, quantity, location });
  const qs = new URLSearchParams({ text }).toString();
  return `https://wa.me/${site.whatsapp}?${qs}`;
}

/** Just the wa.me URL with no text — useful for sticky floating buttons. */
export function waMeHref(): string {
  return `https://wa.me/${site.whatsapp}`;
}
