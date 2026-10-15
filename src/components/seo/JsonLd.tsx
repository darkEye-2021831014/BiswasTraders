import { site, SITE_URL } from "@/content/site";
import type { Locale } from "@/i18n/config";

/**
 * LocalBusiness JSON-LD for the depot.
 *
 * We only emit fields the brief marks as "known fact" or that are derived
 * from data the owner controls (e.g. serviceZones, facebookUrl, phone).
 * We do NOT invent price ranges, opening hours, ratings, or geo coords
 * — those are `// TODO(owner)` in `site.ts` and stay null until the
 * owner confirms them.
 */
export function LocalBusinessJsonLd({ locale }: { locale: Locale }) {
  // Skip silently if address is missing — without an address this
  // structured data would mislead Google and we don't want to emit it.
  const address = site.address[locale] || site.address.bn;
  if (!address) return null;
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.legalName[locale] || site.legalName.bn,
    description: "ইট, বালু, খোয়া, সিমেন্ট ও রড সরবরাহকারী। সিঙ্গাইর, মানিকগঞ্জ।",
    url: SITE_URL,
    telephone: `+${site.whatsapp}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: "Singair",
      addressRegion: "Manikganj",
      postalCode: undefined,
      addressCountry: "BD",
    },
    areaServed: site.serviceZones
      .map((z) => z.name?.[locale] || z.name?.bn)
      .filter(Boolean)
      .map((name) => ({ "@type": "AdministrativeArea", name })),
    sameAs: site.facebookUrl ? [site.facebookUrl] : undefined,
  };

  // Drop falsy / undefined fields so the JSON is clean.
  return (
    <script
      type="application/ld+json"
      // Build-time literal, no user input. The eslint comment matches the
      // pattern used by the BreadcrumbList component.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(stripUndefined(ld)),
      }}
    />
  );
}

/** BreadcrumbList JSON-LD. The data comes from a static array, never user input. */
export function BreadcrumbListJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}

/**
 * FAQPage JSON-LD. Drop this on any page that has a full FAQ
 * section. Each item is a Question/Answer pair — both fields are
 * plain strings, no HTML.
 */
export function FAQPageJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  if (!items.length) return null;
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  for (const k of Object.keys(obj)) {
    if (obj[k] === undefined) delete obj[k];
  }
  return obj;
}
