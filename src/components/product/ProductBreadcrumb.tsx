import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/content/products";
import { pick } from "@/i18n/l10n";
import { site } from "@/content/site";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";

/**
 * Product detail breadcrumb (Home / Products / Name) with a parallel
 * BreadcrumbList JSON-LD blob. The visible list uses the i18n Link
 * so the path stays locale-correct; the JSON-LD uses absolute URLs
 * so it is valid for Google regardless of the request locale.
 *
 * The JSON-LD is rendered as a small server-component script tag.
 * It contains no user input; it is fully static, so no
 * `dangerouslySetInnerHTML` is required.
 */
export function ProductBreadcrumb({
  product,
  locale,
  homeLabel,
  productsLabel,
}: {
  product: Product;
  locale: Locale;
  homeLabel: string;
  productsLabel: string;
}) {
  const baseUrl = `https://biswastraders.trade`;
  const homeUrl = locale === "bn" ? baseUrl : `${baseUrl}/en`;
  const productsUrl = locale === "bn" ? `${baseUrl}/products` : `${baseUrl}/en/products`;
  const productUrl = locale === "bn"
    ? `${baseUrl}/products/${product.slug}`
    : `${baseUrl}/en/products/${product.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: site.legalName[locale],
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: productsLabel,
        item: productsUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: pick(product.name, locale),
        item: productUrl,
      },
    ],
  };

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="text-[12px] text-charcoal/70 font-display"
      >
        <ol className="flex items-center gap-1 flex-wrap">
          <li>
            <Link href="/" className="hover:text-charcoal hover:underline">
              {homeLabel}
            </Link>
          </li>
          <li aria-hidden className="text-charcoal/40">/</li>
          <li>
            <Link
              href="/products"
              className="hover:text-charcoal hover:underline"
            >
              {productsLabel}
            </Link>
          </li>
          <li aria-hidden className="text-charcoal/40">/</li>
          <li aria-current="page" className="text-charcoal font-semibold break-words">
            {pick(product.name, locale)}
          </li>
        </ol>
      </nav>
      <Link
        href="/products"
        className="mt-3 inline-flex items-center gap-1 text-xs text-charcoal/70 hover:text-charcoal"
      >
        <ArrowIcon className="w-3 h-3 rotate-180" />
        {productsLabel}
      </Link>
      <script
        type="application/ld+json"
        // Static object literal built at build time; no user input is interpolated.
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
