"use client";

import { useState } from "react";
import type { L10n } from "@/i18n/l10n";
import { useTranslations } from "next-intl";

type Props = {
  notice: L10n;
  locale: "bn" | "en";
};

/**
 * Top notice banner driven by `site.notice`. When the value is null, this
 * component is not rendered at all (handled in the server wrapper).
 *
 * Dismissal is **local state only** per the brief — no localStorage, no cookie.
 * Refreshing the page brings the notice back, which is the correct behavior
 * for a transient operational message.
 */
export function NoticeBar({ notice, locale }: Props) {
  const [open, setOpen] = useState(true);
  const t = useTranslations();
  if (!open) return null;
  const text = notice[locale] || notice.bn || notice.en;
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-orange text-navy"
      data-locale={locale}
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 h-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            aria-hidden
            className="hidden sm:inline-flex w-1.5 h-1.5 bg-navy rounded-full shrink-0"
          />
          <p className="text-[12px] sm:text-[13px] font-display font-semibold uppercase tracking-label truncate">
            {text}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t("notice.dismiss")}
          className="shrink-0 inline-flex items-center justify-center w-8 h-8 text-navy hover:bg-navy/10 focus-visible:bg-navy/10"
          style={{ borderRadius: 2 }}
        >
          <svg
            aria-hidden
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
