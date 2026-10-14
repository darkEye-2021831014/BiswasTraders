import type { L10n } from "@/i18n/l10n";

/**
 * The single source of truth for business identity.
 * Anything not listed as a "Known fact" in the project brief is UNCONFIRMED
 * and is set to null with a // TODO(owner) comment.
 */
export type ServiceZone = {
  id: string;
  name: L10n;
  // TODO(owner): approximate distance from Singair, in km, in a single direction.
  distanceKm: number | null;
};

export type Vehicle = {
  id: string;
  name: L10n;
  // TODO(owner): confirmed capacity in tons or CFT.
  capacity: L10n | null;
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
  // TODO(owner): business hours. Until confirmed, set to null and the UI hides it.
  hours: null as L10n | null,
  // TODO(owner): optional notice banner (e.g. "Office closed Friday afternoon").
  notice: null as L10n | null,
  serviceZones: [
    {
      id: "singair",
      name: { bn: "সিঙ্গাইর", en: "Singair" } as L10n,
      distanceKm: 0,
    },
    {
      id: "manikganj",
      name: { bn: "মানিকগঞ্জ সদর", en: "Manikganj Sadar" } as L10n,
      // TODO(owner): confirm actual distance in km from Singair.
      distanceKm: null,
    },
    {
      id: "savar",
      name: { bn: "সাভার", en: "Savar" } as L10n,
      // TODO(owner): confirm.
      distanceKm: null,
    },
    {
      id: "hemayetpur",
      name: { bn: "হেমায়েতপুর", en: "Hemayetpur" } as L10n,
      // TODO(owner): confirm.
      distanceKm: null,
    },
    {
      id: "west-dhaka",
      name: { bn: "পশ্চিম ঢাকা", en: "West Dhaka" } as L10n,
      // TODO(owner): confirm.
      distanceKm: null,
    },
  ] as ServiceZone[],
  vehicles: [
    {
      id: "truck-small",
      name: { bn: "ছোট ট্রাক", en: "Small truck" } as L10n,
      // TODO(owner): confirm load capacity.
      capacity: null,
    },
    {
      id: "truck-medium",
      name: { bn: "মাঝারি ট্রাক", en: "Medium truck" } as L10n,
      // TODO(owner): confirm load capacity.
      capacity: null,
    },
    {
      id: "truck-large",
      name: { bn: "বড় ট্রাক", en: "Large truck" } as L10n,
      // TODO(owner): confirm load capacity.
      capacity: null,
    },
  ] as Vehicle[],
};
