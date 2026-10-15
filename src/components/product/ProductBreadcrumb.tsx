import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/content/products";
import { pick } from "@/i18n/l10n";
import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/origin";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import { BreadcrumbListJsonLd } from "@/components/seo/JsonLd";

/**
 * Product detail breadcrumb (Home / Products / Name) with a parallel
 * BreadcrumbList JSON-LD blob. The visible list uses the i18n Link
 * so the path stays locale-correct; the JSON-LD uses absolute URLs
 * so it is valid for Google regardless of the request locale.
 *
 * The JSON-LD is rendered by the shared <BreadcrumbListJsonLd>
 * component, which is also used by other page-level breadcrumbs.
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
  const homeUrl = absoluteUrl(locale, "/");
  const productsUrl = absoluteUrl(locale, "/products");
  const productUrl = absoluteUrl(locale, `/products/${product.slug}`);

  const productName = pick(product.name, locale);

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
          <li aria-hidden className="text-charcoal/55">/</li>
          <li>
            <Link
              href="/products"
              className="hover:text-charcoal hover:underline"
            >
              {productsLabel}
            </Link>
          </li>
          <li aria-hidden className="text-charcoal/55">/</li>
          <li aria-current="page" className="text-charcoal font-semibold break-words">
            {productName}
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
      <BreadcrumbListJsonLd
        items={[
          { name: site.legalName[locale] || site.legalName.bn, url: homeUrl },
          { name: productsLabel, url: productsUrl },
          { name: productName, url: productUrl },
        ]}
      />
    </>
  );
}
