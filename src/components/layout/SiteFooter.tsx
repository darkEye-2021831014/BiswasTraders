import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";
import { telHref, waMeHref } from "@/lib/contact";
import { IconFacebook, IconMap } from "@/components/ui/icons";
import { PhoneIcon } from "@/components/ui/icons/PhoneIcon";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";
import type { Locale } from "@/i18n/config";

const PRODUCT_LINKS = [
  { href: "/products/bricks", key: "ইট", en: "Bricks" },
  { href: "/products/sand", key: "বালু", en: "Sand" },
  { href: "/products/khoa", key: "খোয়া", en: "Khoa" },
  { href: "/products/cement", key: "সিমেন্ট", en: "Cement" },
  { href: "/products/rod", key: "রড", en: "Rebar" },
] as const;

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const year = new Date().getFullYear();
  return (
    <footer
      className="bg-navy text-canvas mt-12 md:mt-16"
      data-locale={locale}
    >
      <div className="h-2 brick-course" aria-hidden />
      <Container className="py-10 md:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <section className="sm:col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-3">
            <span
              aria-hidden
              className="w-10 h-10 relative overflow-hidden shrink-0"
              style={{ borderRadius: 2 }}
            >
              <Image
                src="/brand/logo.png"
                alt=""
                width={40}
                height={40}
                sizes="40px"
                className="object-cover"
              />
            </span>
            <span className="font-display font-semibold uppercase tracking-label text-sm">
              {site.legalName[locale]}
            </span>
          </Link>
          <p className="text-xs text-canvas/70 leading-relaxed max-w-xs">
            {t("site.tagline")}
          </p>
        </section>

        <section>
          <h3 className="dim-rule dim-rule--start mb-3">
            <span className="whitespace-nowrap">{t("footer.products")}</span>
          </h3>
          <ul className="space-y-1 text-sm">
            {PRODUCT_LINKS.map((p) => (
              <li key={p.href}>
                <Link
                  className="hover:underline"
                  href={p.href as `/products/${string}`}
                >
                  {locale === "bn" ? p.key : p.en}
                </Link>
              </li>
            ))}
            <li>
              <Link className="hover:underline" href="/products">
                {locale === "bn" ? "সব পণ্য →" : "All products →"}
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="dim-rule dim-rule--start mb-3">
            <span className="whitespace-nowrap">{t("footer.quickLinks")}</span>
          </h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link className="hover:underline" href="/">
                {t("nav.home")}
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/delivery">
                {t("nav.delivery")}
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/estimator">
                {t("nav.estimator")}
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/contact">
                {t("nav.contact")}
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="dim-rule dim-rule--start mb-3">
            <span className="whitespace-nowrap">{t("footer.addressLabel")}</span>
          </h3>
          <p className="text-sm flex items-start gap-2 max-w-xs">
            <IconMap className="w-4 h-4 mt-1 text-orange shrink-0" aria-hidden />
            <span>{site.address[locale]}</span>
          </p>
          {site.googleMapsUrl ? (
            <a
              href={site.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs underline text-canvas/70 hover:text-canvas"
            >
              {t("footer.openInMaps")}
            </a>
          ) : null}

          <ul className="mt-4 space-y-1.5 text-sm">
            <li>
              <a
                href={telHref()}
                className="inline-flex items-center gap-2 hover:underline tabular"
              >
                <PhoneIcon className="w-4 h-4 text-orange" aria-hidden />
                <span>{site.phone}</span>
              </a>
            </li>
            <li>
              <a
                href={waMeHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:underline"
              >
                <span className="text-wa">
                  <WhatsAppIcon className="w-4 h-4" aria-hidden />
                </span>
                <span>WhatsApp · +{site.whatsapp}</span>
              </a>
            </li>
            {site.facebookUrl ? (
              <li>
                <a
                  href={site.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <IconFacebook className="w-4 h-4 text-orange" aria-hidden />
                  <span>Facebook</span>
                </a>
              </li>
            ) : null}
          </ul>

          {site.hours ? (
            <div className="mt-4">
              <div className="text-[10px] uppercase tracking-eyebrow text-canvas/60 font-display">
                {t("footer.openHours")}
              </div>
              <div className="text-sm mt-1">{site.hours[locale]}</div>
            </div>
          ) : null}
        </section>
      </Container>

      <div className="border-t border-canvas/10">
        <Container className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-[11px] uppercase tracking-eyebrow text-canvas/60">
            © {year} {site.legalName[locale]} — {t("footer.rights")}
          </p>
          <ul className="flex items-center gap-3 text-[11px] uppercase tracking-eyebrow text-canvas/60">
            <li>
              <Link className="hover:text-canvas" href="/">
                {t("nav.home")}
              </Link>
            </li>
            <li aria-hidden>·</li>
            <li>
              <Link className="hover:text-canvas" href="/contact">
                {t("nav.contact")}
              </Link>
            </li>
          </ul>
        </Container>
      </div>
      {/* Second brick-course line as a thin industrial footer rule. */}
      <div className="h-1 brick-course brick-course--sand" aria-hidden />
    </footer>
  );
}