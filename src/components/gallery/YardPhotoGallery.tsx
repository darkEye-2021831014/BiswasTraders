"use client";

import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { pick } from "@/i18n/l10n";
import { gallery, type GalleryPhoto } from "@/content/gallery";

/**
 * Yard / depot photo gallery.
 *
 *   - Server-rendered grid for the thumbs (Next/Image, lazy below the
 *     fold).
 *   - Click any thumb → opens a native <dialog> in modal mode (Esc
 *     closes, focus is trapped by the browser).
 *   - Empty list → renders nothing.
 *
 * The lightbox is the only piece that needs JS, but it's a thin
 * wrapper: it just calls dialog.showModal() on open and dialog.close()
 * on Esc / backdrop click.
 */
export function YardPhotoGallery({ locale }: { locale: Locale }) {
  if (gallery.length === 0) return null;

  return <GalleryClient locale={locale} photos={gallery} />;
}

function GalleryClient({
  locale,
  photos,
}: {
  locale: Locale;
  photos: GalleryPhoto[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // Wire the native dialog open/close whenever activeIndex changes.
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (activeIndex !== null && !dlg.open) {
      dlg.showModal();
    } else if (activeIndex === null && dlg.open) {
      dlg.close();
    }
  }, [activeIndex]);

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? 0 : (i + 1) % photos.length)),
    [photos.length],
  );
  const prev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? 0 : (i - 1 + photos.length) % photos.length,
      ),
    [photos.length],
  );

  return (
    <>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {photos.map((photo, idx) => {
          const caption = pick(photo.caption, locale);
          const span =
            photo.orientation === "landscape" ? "md:col-span-2" : "";
          return (
            <li key={photo.src} className={span}>
              <button
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={caption || "ছবি বড় করুন"}
                className="block w-full text-left border border-line bg-sand overflow-hidden hover:border-charcoal focus:outline-none focus-visible:border-charcoal focus-visible:shadow-stamp-sm transition-colors"
                style={{ borderRadius: 2 }}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={photo.src}
                    alt={photo.decorative ? "" : caption}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
                {caption ? (
                  <div className="px-2 py-1.5 text-xs text-charcoal/80 border-t border-line bg-canvas">
                    {caption}
                  </div>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      <Lightbox
        ref={dialogRef}
        photos={photos}
        activeIndex={activeIndex}
        onClose={close}
        onNext={next}
        onPrev={prev}
        locale={locale}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------

const Lightbox = forwardRef<
  HTMLDialogElement,
  {
    photos: GalleryPhoto[];
    activeIndex: number | null;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    locale: Locale;
  }
>(function Lightbox(
  { photos, activeIndex, onClose, onNext, onPrev, locale },
  ref,
) {
  // Close when the user clicks the backdrop (outside the inner content).
  // We compare the click target to the dialog itself.
  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  // Keep keyboard arrows moving through the gallery while the
  // lightbox is open. (Esc is handled natively by <dialog>.)
  const dlgId = useId();
  useEffect(() => {
    if (activeIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, onNext, onPrev]);

  if (activeIndex === null) {
    return (
      <dialog
        ref={ref}
        aria-labelledby={`${dlgId}-title`}
        className="bg-transparent p-0 m-0 max-w-none w-full h-full"
        onClick={handleBackdropClick}
      />
    );
  }

  const photo = photos[activeIndex];
  if (!photo) {
    return (
      <dialog
        ref={ref}
        aria-labelledby={`${dlgId}-title`}
        className="bg-transparent p-0 m-0 max-w-none w-full h-full"
        onClick={handleBackdropClick}
      />
    );
  }
  const caption = pick(photo.caption, locale);
  const closeLabel = "বন্ধ করুন";
  const nextLabel = "পরের ছবি";
  const prevLabel = "আগের ছবি";

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${dlgId}-title`}
      className="bg-charcoal/90 p-0 m-0 max-w-none w-full h-full backdrop:bg-charcoal/80"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full h-full grid place-items-center p-4 md:p-8">
        <div className="relative max-w-[min(1100px,95vw)] max-h-[85vh] bg-canvas border-2 border-charcoal shadow-stamp" style={{ borderRadius: 2 }}>
          <div className="relative w-full h-full">
            <div className="relative w-full h-[min(75vh,calc(95vw*0.75))]">
              <Image
                src={photo.src}
                alt={photo.decorative ? "" : caption}
                fill
                sizes="(max-width: 1100px) 95vw, 1100px"
                className="object-contain bg-canvas"
                priority
              />
            </div>
            {caption ? (
              <div
                id={`${dlgId}-title`}
                className="px-4 py-2 text-sm text-charcoal bg-sand border-t-2 border-charcoal"
              >
                {caption}
              </div>
            ) : (
              <span id={`${dlgId}-title`} className="sr-only">
                {closeLabel}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute top-3 right-3 md:top-4 md:right-4 inline-flex items-center justify-center w-12 h-12 border-2 border-canvas bg-canvas text-charcoal hover:bg-sand"
          style={{ borderRadius: 2 }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
          </svg>
        </button>

        {photos.length > 1 ? (
          <>
            <button
              type="button"
              onClick={onPrev}
              aria-label={prevLabel}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-12 h-12 border-2 border-canvas bg-canvas text-charcoal hover:bg-sand"
              style={{ borderRadius: 2 }}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label={nextLabel}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-12 h-12 border-2 border-canvas bg-canvas text-charcoal hover:bg-sand"
              style={{ borderRadius: 2 }}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </>
        ) : null}
      </div>
    </dialog>
  );
});