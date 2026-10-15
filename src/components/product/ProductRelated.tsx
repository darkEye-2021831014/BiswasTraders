import type { Product } from "@/content/products";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { pick } from "@/i18n/l10n";

/**
 * Compact "other products" strip for the bottom of a product detail
 * page. Each row: product name (link) + a quiet "View details" hint.
 * Keeps the eye on Call/WhatsApp without making this section itself
 * a card grid.
 */
export function ProductRelated({
  currentSlug,
  products,
  locale,
  title,
}: {
  currentSlug: string;
  products: Product[];
  locale: Locale;
  title: string;
}) {
  const others = products
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => a.order - b.order);
  if (others.length === 0) return null;
  return (
    <section className="mt-12" aria-labelledby="related-title">
      <h2
        id="related-title"
        className="dim-rule dim-rule--start mb-4 text-charcoal font-display uppercase tracking-eyebrow text-xs"
      >
        <span className="whitespace-nowrap">{title}</span>
      </h2>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {others.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/products/${p.slug}` as `/products/${string}`}
              className="block h-full border border-line bg-canvas p-3 hover:shadow-stamp-sm"
              style={{ borderRadius: 2 }}
            >
              <div className="font-display font-semibold text-sm leading-snug break-words">
                {pick(p.name, locale)}
              </div>
              <div className="text-[11px] uppercase tracking-eyebrow text-charcoal/70 font-display mt-2">
                {pick(p.soldBy, locale)}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
