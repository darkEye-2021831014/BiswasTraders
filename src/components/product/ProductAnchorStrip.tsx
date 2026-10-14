import type { Product } from "@/content/products";
import type { Locale } from "@/i18n/config";
import { getTranslations } from "next-intl/server";
import { pick } from "@/i18n/l10n";

/**
 * In-page anchor strip that sticks just under the site header on scroll.
 * Pure CSS `position: sticky` — no client JS. Each chip is a real
 * `<a href="#slug">` so the browser handles the jump (and the URL gets
 * the hash for share/refresh). The strip is rendered at the top of the
 * /products index so the anchors match product cards in the same DOM.
 *
 * Sticky offset is `top: 56px` (md header h-14) on mobile and
 * `top: 64px` (md:h-16) on desktop — matches the site header height.
 */
export async function ProductAnchorStrip({
  products,
  locale,
}: {
  products: Product[];
  locale: Locale;
}) {
  const t = await getTranslations({ locale });
  return (
    <div
      className="sticky top-14 md:top-16 z-20 bg-canvas/95 backdrop-blur border-b border-line"
      data-component="product-anchor-strip"
    >
      <nav
        aria-label={t("products.anchorLabel")}
        className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8"
      >
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          <span
            className="hidden md:inline text-[10px] uppercase tracking-eyebrow text-charcoal/70 font-display pr-2 border-r border-line shrink-0"
            aria-hidden
          >
            {t("products.anchorStickyTitle")}
          </span>
          <ul className="flex items-center gap-2">
            {products.map((p) => (
              <li key={p.slug} className="shrink-0">
                <a
                  href={`#${p.slug}`}
                  className="inline-flex items-center h-9 px-3 text-[12px] font-display font-semibold uppercase tracking-label border border-charcoal/30 hover:border-charcoal hover:bg-sand whitespace-nowrap"
                  style={{ borderRadius: 2 }}
                >
                  {pick(p.name, locale)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
