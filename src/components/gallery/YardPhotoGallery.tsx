import type { Locale } from "@/i18n/config";
import { pick } from "@/i18n/l10n";
import { gallery, type GalleryPhoto } from "@/content/gallery";
import { YardGalleryClient } from "./YardGalleryClient";

/**
 * Yard / depot photo gallery.
 *
 *   - Server-rendered grid for the thumbs (Next/Image, lazy below the
 *     fold). The thumbs are real <Image> elements that get optimised
 *     and show up in the initial HTML — no waiting for client JS.
 *   - Click any thumb → opens a native <dialog> in modal mode (Esc
 *     closes, focus is trapped by the browser). The modal logic lives
 *     in `YardGalleryClient` (a small "use client" island).
 *   - Empty list → renders nothing.
 *
 * The grid itself is a server component; only the lightbox island
 * is "use client". This is the split that lets the photos render
 * without a single client JS cycle.
 */
export function YardPhotoGallery({ locale }: { locale: Locale }) {
  if (gallery.length === 0) return null;

  // Pick the captions on the server so the initial HTML already has
  // the right text in the right script.
  const photos = gallery.map((p) => ({
    ...p,
    captionText: pick(p.caption, locale),
  }));

  return <YardGalleryClient locale={locale} photos={photos} />;
}

// The prop shape the client island needs. Defined here so the server
// and the client agree on the contract without forcing gallery.ts
// to leak into a "use client" file.
export type YardGalleryPhotoClient = GalleryPhoto & {
  captionText: string;
};
