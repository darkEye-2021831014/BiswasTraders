import type { L10n } from "@/i18n/l10n";

/**
 * The single source of truth for business identity.
 * Anything not listed as a "Known fact" in the project brief is UNCONFIRMED
 * and is set to null with a // TODO(owner) comment.
 */

/**
 * Canonical site URL used for SEO (canonical, hreflang, sitemap, JSON-LD).
 *
 * Defaults to a placeholder domain. The owner can override this in two
 * ways, in order of preference:
 *   1. Set NEXT_PUBLIC_SITE_URL in the deploy environment (e.g. Vercel).
 *   2. Edit the fallback below.
 *
 * We do NOT require a .env file to build — the fallback is the source of
 * truth in dev and in any environment where the env var is not set.
 *
 * TODO(owner): replace the fallback with the real production domain.
 */
export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://biswastraders.trade";

/** Path prefix for each locale. "" for default (bn), "/en" for English. */
export function localePath(locale: "bn" | "en", path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return locale === "bn" ? p : `/en${p === "/" ? "" : p}`;
}

/** Absolute URL for a given locale + path. */
export function absoluteUrl(locale: "bn" | "en", path: string): string {
  return `${SITE_URL}${localePath(locale, path)}`;
}

export type ZoneGroup = "core" | "extended";

export type ServiceZone = {
  id: string;
  name: L10n;
  // TODO(owner): approximate distance from Singair, in km, in a single direction.
  distanceKm: number | null;
  /**
   * Which group the zone belongs to. The /delivery page renders zones in
   * two named groups ("Core area" / "Extended area") when both groups
   * are present; if all zones share the same group we render a single list.
   */
  group: ZoneGroup;
};

export type Vehicle = {
  id: string;
  name: L10n;
  // TODO(owner): confirmed capacity in tons or CFT.
  capacity: L10n | null;
  /** Short description of what this vehicle is good for. */
  goodFor: L10n | null;
  /** Caveats, e.g. access limits, what the driver may need on site. */
  notes: L10n | null;
};

export type Landmark = L10n;

export type Hours = {
  /** Standard weekday hours (e.g. "7 AM – 9 PM"). */
  general: L10n;
  /** Friday-specific row, if hours differ on Friday. null = same as general. */
  friday: L10n | null;
};

export const site = {
  name: { bn: "মেসার্স বিশ্বাস ট্রেডার্স", en: "M/S Biswas Traders" } as L10n,
  // Legal/short form including the Ms. prefix as on the letterhead.
  legalName: {
    bn: "মেসার্স বিশ্বাস ট্রেডার্স",
    en: "M/S Biswas Traders",
  } as L10n,
  address: {
    bn: "জয়মন্টপ খেলার মাঠ, সিঙ্গাইর, মানিকগঞ্জ ১৮২২",
    en: "Joymantop Khelar Math, Singair, Manikganj 1822, Bangladesh",
  } as L10n,
  phone: "01729997977", // BD number; tel: link uses +880 prefix
  whatsapp: "8801729997977", // E.164 without '+' for wa.me
  facebookUrl: "https://facebook.com/biswastraders.trade",
  // TODO(owner): if a Google Maps share URL exists, paste it here; otherwise leave null.
  googleMapsUrl: null as string | null,
  /**
   * Google Maps *embed* URL (the `https://www.google.com/maps/embed?pb=...`
   * variant, not a share link). The contact page only renders the
   * click-to-load map iframe when this is set, so we never request a
   * third-party embed on page load.
   */
  // TODO(owner): if you want the map iframe, paste the embed URL here.
  googleMapsEmbedUrl: null as string | null,
  // TODO(owner): business hours. Until confirmed, set to null and the UI hides it.
  hours: null as Hours | null,
  // TODO(owner): optional notice banner (e.g. "Office closed Friday afternoon").
  notice: null as L10n | null,
  /**
   * Landmarks near the depot, in order. The contact page falls back to
   * a text-based "How to find us" block (with these landmarks) when
   * `googleMapsUrl` is not set. Add more as you confirm them.
   */
  landmarks: [
    { bn: "জয়মন্টপ খেলার মাঠ", en: "Joymantop Khelar Math" } as Landmark,
    // TODO(owner): add additional nearby landmarks you usually tell people
    // (mosque, school, bazaar, highway junction, etc.).
  ] as Landmark[],
  serviceZones: [
    {
      id: "singair",
      name: { bn: "সিঙ্গাইর", en: "Singair" } as L10n,
      distanceKm: 0,
      group: "core",
    },
    {
      id: "manikganj",
      name: { bn: "মানিকগঞ্জ সদর", en: "Manikganj Sadar" } as L10n,
      // TODO(owner): confirm actual distance in km from Singair.
      distanceKm: null,
      group: "core",
    },
    {
      id: "savar",
      name: { bn: "সাভার", en: "Savar" } as L10n,
      // TODO(owner): confirm.
      distanceKm: null,
      group: "extended",
    },
    {
      id: "hemayetpur",
      name: { bn: "হেমায়েতপুর", en: "Hemayetpur" } as L10n,
      // TODO(owner): confirm.
      distanceKm: null,
      group: "extended",
    },
    {
      id: "west-dhaka",
      name: { bn: "পশ্চিম ঢাকা", en: "West Dhaka" } as L10n,
      // TODO(owner): confirm.
      distanceKm: null,
      group: "extended",
    },
  ] as ServiceZone[],
  vehicles: [
    {
      id: "truck-small",
      name: { bn: "ছোট ট্রাক / ভ্যান", en: "Small truck / van" } as L10n,
      // TODO(owner): confirm load capacity.
      capacity: null,
      // TODO(owner): what does the small truck fit best?
      goodFor: {
        bn: "সরু গলি, পুরনো এলাকা, ছোট সাইট",
        en: "Narrow lanes, old neighbourhoods, small sites",
      } as L10n,
      // TODO(owner): notes — e.g. needs a hand-cart for the last stretch.
      notes: null,
    },
    {
      id: "truck-medium",
      name: { bn: "মাঝারি ট্রাক", en: "Medium truck" } as L10n,
      // TODO(owner): confirm load capacity.
      capacity: null,
      goodFor: {
        bn: "বেশিরভাগ বাড়ির কাজ, সাধারণ সাইট",
        en: "Most house jobs, typical sites",
      } as L10n,
      // TODO(owner): notes.
      notes: null,
    },
    {
      id: "truck-large",
      name: { bn: "বড় ট্রাক", en: "Large truck" } as L10n,
      // TODO(owner): confirm load capacity.
      capacity: null,
      goodFor: {
        bn: "বড় প্রকল্প, খোলা জায়গা, পূর্ণ লোড",
        en: "Big projects, open ground, full loads",
      } as L10n,
      // TODO(owner): notes — e.g. needs firm access road, can take a full day to position.
      notes: null,
    },
  ] as Vehicle[],
};
