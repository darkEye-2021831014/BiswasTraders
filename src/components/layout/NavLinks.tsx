"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const NAV = [
  { href: "/products/bricks", key: "nav.bricks" },
  { href: "/products", key: "nav.allMaterials" },
  { href: "/delivery", key: "nav.delivery" },
  { href: "/estimator", key: "nav.estimator" },
  { href: "/contact", key: "nav.contact" },
] as const;

/**
 * Desktop primary nav (md+). The active link is derived from usePathname so
 * it stays in sync with client-side route changes.
 */
export function NavLinks() {
  const t = useTranslations();
  const pathname = usePathname() || "/";
  return (
    <nav className="hidden md:flex items-center gap-1" aria-label={t("nav.menu")}>
      {NAV.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`px-3 h-12 inline-flex items-center font-display text-xs uppercase tracking-label border transition-colors ${
              isActive
                ? "text-canvas bg-white/10 border-white/15"
                : "text-canvas/80 hover:text-canvas hover:bg-white/5 border-transparent hover:border-white/10"
            }`}
            style={{ borderRadius: 2 }}
          >
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );
}