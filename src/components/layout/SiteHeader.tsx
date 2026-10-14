import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { LocaleSwitch } from "@/components/layout/LocaleSwitch";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const otherLocale = locale === "bn" ? "en" : "bn";
  return (
    <header className="bg-navy text-canvas border-b border-charcoal sticky top-0 z-30">
      <Container className="flex items-center justify-between gap-4 h-16">
        <Link href="/" className="flex items-center gap-3 group">
          {/* mark/logo — pure CSS, no asset dependency */}
          <span
            aria-hidden
            className="w-9 h-9 bg-orange text-navy grid place-items-center font-display font-bold text-lg shrink-0"
            style={{ borderRadius: 2 }}
          >
            বি
          </span>
          <span className="leading-tight">
            <span className="block font-display font-semibold uppercase tracking-label text-[13px]">
              {site.legalName[locale]}
            </span>
            <span className="block text-[10px] uppercase tracking-eyebrow text-canvas/70 font-display">
              Singair • Manikganj
            </span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1" aria-label="primary">
          <NavLink href="/products">{t("nav.products")}</NavLink>
          <NavLink href="/delivery">{t("nav.delivery")}</NavLink>
          <NavLink href="/estimator">{t("nav.estimator")}</NavLink>
          <NavLink href="/contact">{t("nav.contact")}</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitch current={locale} otherLocale={otherLocale} />
          <Badge tone="dark" className="hidden sm:inline-flex">
            <span className="w-1.5 h-1.5 bg-orange rounded-full" aria-hidden />
            {t("product.stampedReady")}
          </Badge>
        </div>
      </Container>
    </header>
  );
}

function NavLink({ href, children }: { href: `/${string}` | string; children: React.ReactNode }) {
  return (
    <Link
      href={href as `/products` | `/delivery` | `/estimator` | `/contact`}
      className="px-3 h-12 inline-flex items-center font-display text-xs uppercase tracking-label text-canvas/80 hover:text-canvas hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
      style={{ borderRadius: 2 }}
    >
      {children}
    </Link>
  );
}
