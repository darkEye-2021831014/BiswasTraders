import type { L10n } from "@/i18n/l10n";

/**
 * The single source of truth for business identity.
 * Anything not listed as a "Known fact" in the project brief is UNCONFIRMED
 * and is set to null with a // TODO(owner) comment.
 */

/**
 * Canonical site URL used for absolute URLs that need to keep working
 * outside the request context (e.g. /og.jpg referenced by Facebook, the
 * link in robots.txt, JSON-LD fields like `url` that we want fixed).
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
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://biswastraders.trade";

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
  general: {
    en: "8:00 AM – 8:00 PM";
    bn: "সকাল ৮টা – রাত ৮টা";
  };
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
    bn: "জয়মন্টপ, সিঙ্গাইর, মানিকগঞ্জ",
    en: "Joymontop, Singair, Manikganj, Bangladesh",
  } as L10n,
  phone: "01729997977", // BD number; tel: link uses +880 prefix
  whatsapp: "8801729997977", // E.164 without '+' for wa.me
  facebookUrl: "https://facebook.com/biswastraders.trade",
  /** Google Maps *share* link used by the "Open in Google Maps" button
   *  on the contact page. */
  googleMapsUrl: "https://maps.app.goo.gl/e2r2Ng4yJs52QVAa7",
  /**
   * Google Maps *embed* URL (the `https://www.google.com/maps/embed?pb=...`
   * variant, not a share link). The contact page renders this as a
   * lazy-loaded iframe when set; the iframe is gated by the CSP
   * (frame-src https://www.google.com in next.config.mjs) and by
   * the browser's native iframe lazy-loading.
   */
  googleMapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d922.1350500530433!2d90.1825469857006!3d23.804797384497682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755ed8ce58d3ff7%3A0xfbc426b5d780097d!2sBiswas%20Traders!5e0!3m2!1sen!2sbd!4v1792039636373!5m2!1sen!2sbd",
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
    { bn: "জয়মন্টপ", en: "Joymontop" } as Landmark,
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
      id: "dhaka",
      name: { bn: "ঢাকা", en: "Dhaka" } as L10n,
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
