"use client";

import { useState } from "react";

/**
 * Renders a Google Maps embed iframe for the contact page.
 *
 * Behaviour:
 *  - When `embedUrl` is set (the owner has provided their actual yard's
 *    embed URL), we render the iframe immediately on mount. `loading="lazy"`
 *    defers the network request until the iframe is in the viewport, and
 *    `referrerPolicy="no-referrer-when-downgrade"` matches Google's
 *    recommended policy.
 *  - When the URL is missing or fails to load, we fall back to the
 *    "Load map" button so the page still has a graceful placeholder.
 *
 * The CSP in next.config.mjs restricts frame-src to https://www.google.com
 * which covers the standard embed host. If Google ever redirects the embed
 * to another origin, that needs to be added here too.
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
  const [failed, setFailed] = useState(false);
  if (embedUrl && !failed) {
    return (
      <div
        className="relative w-full overflow-hidden border border-line bg-sand"
        style={{ borderRadius: 2, aspectRatio: "16 / 9" }}
      >
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          onError={() => setFailed(true)}
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={() => setFailed(false)}
        className="inline-flex items-center justify-center gap-2 h-12 px-4 text-xs font-display font-semibold uppercase tracking-label bg-canvas text-charcoal border border-charcoal hover:shadow-stamp-sm"
        style={{ borderRadius: 2 }}
      >
        {loadLabel}
      </button>
      <p className="text-[11px] text-charcoal/70 italic">{note}</p>
    </div>
  );
}