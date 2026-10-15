"use client";

import { Link, usePathname } from "@/i18n/navigation";

const NAV = [
  { href: "/products/bricks" },
  { href: "/products" },
  { href: "/delivery" },
  { href: "/estimator" },
  { href: "/contact" },
] as const;

type Labels = Record<(typeof NAV)[number]["href"], string> & {
  /** aria-label for the <nav> element itself. */
  menu: string;
};

/**
 * Desktop primary nav (md+). The active link is derived from `usePathname`
 * so it stays in sync with client-side route changes.
 *
 * Labels are passed in as props from the parent server component. This
 * keeps the `intl-messageformat` runtime out of the client bundle — only
 * `next-intl/navigation`'s tiny `usePathname` is loaded, which we
 * genuinely need to highlight the active route on every navigation.
 */
export function NavLinks({ labels }: { labels: Labels }) {
  const pathname = usePathname() || "/";
  return (
    <nav className="hidden md:flex items-center gap-1" aria-label={labels.menu}>
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
            {labels[item.href]}
          </Link>
        );
      })}
    </nav>
  );
}