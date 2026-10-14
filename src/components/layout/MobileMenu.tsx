"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { telHref, waMeHref } from "@/lib/contact";
import { PhoneIcon } from "@/components/ui/icons/PhoneIcon";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";
import type { Locale } from "@/i18n/config";

const NAV = [
  { href: "/", key: "nav.home" },
  { href: "/products/bricks", key: "nav.bricks" },
  { href: "/products", key: "nav.allMaterials" },
  { href: "/delivery", key: "nav.delivery" },
  { href: "/estimator", key: "nav.estimator" },
  { href: "/contact", key: "nav.contact" },
] as const;

type Props = {
  locale: Locale;
  otherLocale: Locale;
};

/**
 * Mobile-only hamburger that opens a full-height drawer.
 *
 * The drawer implements a minimal focus trap:
 *   - On open, focus moves to the close button.
 *   - Tab/Shift+Tab cycles between focusable elements inside the drawer.
 *   - Esc closes the drawer and returns focus to the toggle button.
 *   - Body scroll is locked while open.
 *
 * Active link is derived from the current pathname via usePathname().
 */
export function MobileMenu({ locale, otherLocale }: Props) {
  const t = useTranslations();
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Lock body scroll while open and reset focus on close.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus the close button on open.
    const closeBtn = drawerRef.current?.querySelector<HTMLButtonElement>(
      "[data-drawer-close]"
    );
    closeBtn?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Return focus to the toggle when the drawer closes (Esc or button).
  useEffect(() => {
    if (open) return;
    // Defer to next tick so the toggle button is enabled again.
    const id = window.requestAnimationFrame(() => toggleRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Esc + simple focus trap.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;
      const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("header.closeMenu") : t("header.openMenu")}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="md:hidden inline-flex items-center justify-center w-10 h-10 text-canvas hover:bg-white/5 border border-canvas/20"
        style={{ borderRadius: 2 }}
      >
        {open ? (
          <svg
            aria-hidden
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg
            aria-hidden
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        )}
      </button>

      {open ? (
        <div
          id="mobile-menu"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.menu")}
          className="md:hidden fixed inset-0 z-50 bg-navy text-canvas flex flex-col"
        >
          <div className="flex items-center justify-between h-14 px-4 border-b border-canvas/10">
            <span className="font-display font-semibold uppercase tracking-label text-sm">
              {t("nav.menu")}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              data-drawer-close
              aria-label={t("header.closeMenu")}
              className="inline-flex items-center justify-center w-10 h-10 text-canvas hover:bg-white/5 border border-canvas/20"
              style={{ borderRadius: 2 }}
            >
              <svg
                aria-hidden
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav
            className="flex-1 overflow-y-auto"
            aria-label={t("nav.menu")}
          >
            <ul className="px-3 py-2">
              {NAV.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`min-h-12 px-3 flex items-center justify-between gap-2 font-display uppercase tracking-label text-sm border-l-2 ${
                        isActive
                          ? "border-orange text-canvas bg-white/5"
                          : "border-transparent text-canvas/85 hover:text-canvas hover:bg-white/5"
                      }`}
                      style={{ borderRadius: 2 }}
                    >
                      <span>{t(item.key)}</span>
                      {isActive ? (
                        <span
                          aria-hidden
                          className="w-1.5 h-1.5 bg-orange rounded-full"
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="px-3 py-2 mt-2 border-t border-canvas/10">
              <div className="px-3 py-2 text-[10px] uppercase tracking-eyebrow text-canvas/60 font-display">
                {locale === "bn" ? "ভাষা / Language" : "Language / ভাষা"}
              </div>
              <Link
                href={pathname}
                locale={otherLocale}
                className="min-h-12 px-3 flex items-center justify-between gap-2 font-display uppercase tracking-label text-sm text-canvas/85 hover:text-canvas hover:bg-white/5 border-l-2 border-transparent"
                style={{ borderRadius: 2 }}
                aria-label={
                  otherLocale === "en"
                    ? t("header.switchToEnglish")
                    : t("header.switchToBangla")
                }
              >
                <span>{otherLocale === "en" ? "EN — English" : "বাং — বাংলা"}</span>
                <span aria-hidden className="text-canvas/50">⇌</span>
              </Link>
            </div>
          </nav>
          <div className="p-3 border-t border-canvas/10 grid grid-cols-2 gap-2">
            <a
              href={telHref()}
              className="min-h-12 inline-flex items-center justify-center gap-2 font-display font-semibold uppercase tracking-label text-sm bg-brick text-white border border-brick touch"
              style={{ borderRadius: 2 }}
            >
              <PhoneIcon className="w-5 h-5" aria-hidden />
              {t("sticky.call")}
            </a>
            <a
              href={waMeHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-12 inline-flex items-center justify-center gap-2 font-display font-semibold uppercase tracking-label text-sm bg-charcoal text-white border border-charcoal touch"
              style={{ borderRadius: 2 }}
            >
              <span className="text-wa">
                <WhatsAppIcon className="w-5 h-5" aria-hidden />
              </span>
              {t("sticky.whatsapp")}
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}