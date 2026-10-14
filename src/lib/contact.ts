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

const TEMPLATE: Record<Locale, (p: TemplateInput) => string> = {
  bn: ({ product, quantity, location }) =>
    [
      "আসসালামু আলাইকুম,",
      "আমি মেসার্স বিশ্বাস ট্রেডার্স থেকে দাম জানতে চাই।",
      `পণ্য: ${product || "উল্লেখ নেই"}।`,
      `পরিমাণ: ${quantity || "উল্লেখ নেই"}।`,
      `ডেলিভারি: ${location || "উল্লেখ নেই"}।`,
      "ধন্যবাদ।",
    ].join("\n"),
  en: ({ product, quantity, location }) =>
    [
      "Assalamu Alaikum,",
      "I'd like today's price from M/S Biswas Traders.",
      `Product: ${product || "not specified"}.`,
      `Quantity: ${quantity || "not specified"}.`,
      `Delivery: ${location || "not specified"}.`,
      "Thank you.",
    ].join("\n"),
};

/**
 * Build a wa.me URL with a prefilled, locale-appropriate message.
 *
 * Defensive: if a non-locale string somehow arrives at runtime, fall back
 * to Bangla (the default locale) so we never throw during RSC serialization.
 */
export function waHref(params: WaParams): string {
  const locale: Locale = isLocale(params.locale) ? params.locale : "bn";
  const product = params.product ?? "";
  const quantity = params.quantity ?? "";
  const location = params.location ?? "";
  const text = TEMPLATE[locale]({ product, quantity, location });
  const qs = new URLSearchParams({ text }).toString();
  return `https://wa.me/${site.whatsapp}?${qs}`;
}

/** Just the wa.me URL with no text — useful for sticky floating buttons. */
export function waMeHref(): string {
  return `https://wa.me/${site.whatsapp}`;
}
