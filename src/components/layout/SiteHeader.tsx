import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { site } from "@/content/site";
import { telHref } from "@/lib/contact";
import { PhoneIcon } from "@/components/ui/icons/PhoneIcon";
import { LocaleSwitch } from "@/components/layout/LocaleSwitch";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { NavLinks } from "@/components/layout/NavLinks";
import type { Locale } from "@/i18n/config";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const otherLocale = locale === "bn" ? "en" : "bn";
  return (
    <header
      className="sticky top-0 z-30 bg-navy text-canvas border-b border-charcoal"
      data-locale={locale}
    >
      <Container className="flex items-center justify-between gap-3 h-14 md:h-16">
        <Link href="/" className="flex items-center gap-3 group min-w-0">
          <span
            aria-hidden
            className="w-9 h-9 md:w-10 md:h-10 relative overflow-hidden shrink-0"
            style={{ borderRadius: 2 }}
          >
            <Image
              src="/brand/logo.png"
              alt=""
              width={40}
              height={40}
              sizes="(max-width: 768px) 36px, 40px"
              priority
              className="object-cover"
            />
          </span>
          <span className="leading-tight min-w-0">
            <span className="block font-display font-semibold uppercase tracking-label text-[13px] md:text-sm truncate">
              {site.legalName[locale]}
            </span>
            <span className="hidden sm:block text-[10px] uppercase tracking-eyebrow text-canvas/70 font-display">
              Singair · Manikganj
            </span>
          </span>
        </Link>

        <NavLinks />

        <div className="flex items-center gap-2">
          <LocaleSwitch current={locale} otherLocale={otherLocale} />
          <a
            href={telHref()}
            className="hidden md:inline-flex items-center justify-center gap-2 h-10 px-3 text-xs font-display font-semibold uppercase tracking-label bg-brick text-white border border-brick hover:bg-brick-hover hover:shadow-stamp-brick-sm touch"
            style={{ borderRadius: 2 }}
            aria-label={t("actions.callNow")}
          >
            <PhoneIcon className="w-4 h-4" aria-hidden />
            {t("actions.callNow")}
          </a>
          <Badge tone="dark" className="hidden lg:inline-flex">
            <span
              aria-hidden
              className="w-1.5 h-1.5 bg-orange rounded-full"
            />
            {t("product.stampedReady")}
          </Badge>
          <MobileMenu locale={locale} otherLocale={otherLocale} />
        </div>
      </Container>
    </header>
  );
}