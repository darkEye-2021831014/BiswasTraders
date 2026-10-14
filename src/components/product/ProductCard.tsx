import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/content/products";
import type { Locale } from "@/i18n/config";
import { pick } from "@/i18n/l10n";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProductImage } from "@/components/product/ProductImage";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";

const variantToPalette: Record<string, "brick" | "sand" | "charcoal" | "navy" | "orange"> = {
  bricks: "brick",
  sand: "sand",
  khoa: "charcoal",
  cement: "navy",
  rod: "orange",
};

export async function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const t = await getTranslations({ locale });
  const palette = variantToPalette[product.slug] ?? "brick";
  return (
    <Card as="article" elevated className="flex flex-col">
      <div className="relative">
        <ProductImage
          slug={product.slug}
          alt={product.image.alt}
          variant={palette}
          aspect="4/3"
          priority={Boolean(product.hero)}
        />
        {product.hero ? (
          <span className="absolute top-2 left-2">
            <Badge tone="orange">{t("product.stampedHero")}</Badge>
          </span>
        ) : null}
      </div>
      <div className="p-4 md:p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-lg md:text-xl font-semibold leading-snug">
            {pick(product.name, locale)}
          </h3>
          <p className="text-sm text-charcoal/80 mt-1">
            {pick(product.shortDescription, locale)}
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-3 text-[11px] uppercase tracking-eyebrow text-charcoal/70 font-display">
          <span>{t("products.soldBy")}</span>
          <span className="text-charcoal">{pick(product.soldBy, locale)}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <CallButton label={t("actions.callNow")} size="sm" fullWidth />
          <WhatsAppButton
            label={t("actions.whatsapp")}
            locale={locale}
            product={pick(product.name, locale)}
            size="sm"
            fullWidth
          />
        </div>
        <Link
          href={`/products/${product.slug}` as `/products/${string}`}
          className="inline-flex items-center justify-center gap-1 h-10 text-xs font-display uppercase tracking-label border border-charcoal/30 text-charcoal hover:bg-sand mt-1"
          style={{ borderRadius: 2 }}
        >
          {t("actions.viewProduct")} <ArrowIcon className="w-3 h-3" />
        </Link>
      </div>
    </Card>
  );
}
