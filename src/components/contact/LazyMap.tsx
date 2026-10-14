"use client";

import { useState } from "react";

/**
 * Tiny click-to-load map. Until the user taps "Load map", we render
 * nothing — no iframe, no third-party request. After tap, we mount a
 * Google Maps embed iframe. The `embedUrl` is the only prop and is
 * passed in from the server (from site.googleMapsEmbedUrl).
 *
 * The button is 48px+ tall and the iframe is wrapped in a 16:9 box so
 * the layout is stable on both tap and post-tap states.
 */
export function LazyMap({
  embedUrl,
  title,
  loadLabel,
  note,
}: {
  embedUrl: string;
  title: string;
  loadLabel: string;
  note: string;
}) {
  const [loaded, setLoaded] = useState(false);
  if (loaded) {
    return (
      <div className="relative w-full overflow-hidden border border-line bg-sand" style={{ borderRadius: 2, aspectRatio: "16 / 9" }}>
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="inline-flex items-center justify-center gap-2 h-12 px-4 text-xs font-display font-semibold uppercase tracking-label bg-canvas text-charcoal border border-charcoal hover:shadow-stamp-sm"
        style={{ borderRadius: 2 }}
      >
        {loadLabel}
      </button>
      <p className="text-[11px] text-charcoal/60 italic">{note}</p>
    </div>
  );
}
