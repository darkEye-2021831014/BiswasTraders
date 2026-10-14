/**
 * Yard / depot photo gallery.
 *
 * The list is empty by default. Adding a photo:
 *   1. Drop the JPG into /public/images/yard/ (e.g. /public/images/yard/yard-front.jpg).
 *   2. Append a new entry below.
 *
 * Captions are L10n — { bn, en } — so the alt text and overlay are
 * always in the active locale. Keep captions short and concrete
 * (what's in the picture), not marketing copy.
 *
 * The component (`YardPhotoGallery`) renders nothing when this array
 * is empty, so it's safe to leave as-is until photos are ready.
 */

import type { L10n } from "@/i18n/l10n";

export type GalleryPhoto = {
  /** File path under /public, e.g. "/images/yard/yard-front.jpg". */
  src: string;
  /** Short caption shown under the thumb and in the lightbox. */
  caption: L10n;
  /**
   * Roughly wider-than-tall? Used to pick the grid column span.
   * "portrait" → 1 col, "square" → 1 col, "landscape" → 2 cols.
   * Optional — defaults to "square".
   */
  orientation?: "portrait" | "square" | "landscape";
  /**
   * If true, this photo is decorative for the page and should be
   * hidden from assistive tech (alt=""). Default false (the photo
   * is meaningful content; it gets descriptive alt text from the
   * caption).
   */
  decorative?: boolean;
};

export const gallery: GalleryPhoto[] = [
  // Example entry (uncomment + drop a file to test):
  // {
  //   src: "/images/yard/yard-front.jpg",
  //   caption: {
  //     bn: "ডিপোর সামনের দৃশ্য",
  //     en: "Front of the depot",
  //   } as L10n,
  //   orientation: "landscape",
  // },
];
