import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShapeIcon } from "@/components/ui/icons/ShapeIcon";
import { trustPromises } from "@/content/trust";
import type { Locale } from "@/i18n/config";

/**
 * Four short commitments shown right under the hero. Each card is a
 * blueprint-styled cell with a small icon, a title and a single line of
 * body. The copy is conservative and generic — the owner must approve it
 * before it goes public (see src/content/trust.ts).
 */
export async function TrustStrip({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  return (
    <section className="py-10 md:py-14 bg-canvas border-b border-line">
      <Container>
        <SectionHeading
          eyebrow={t("home.trustEyebrow")}
          title={t("home.trustTitle")}
          subtitle={t("home.trustSubtitle")}
        />
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {trustPromises.map((p, i) => (
            <li
              key={p.id}
              className="border border-line bg-sand p-4 md:p-5 flex flex-col"
              style={{ borderRadius: 2 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  aria-hidden
                  className="w-10 h-10 grid place-items-center bg-canvas border border-charcoal text-charcoal"
                  style={{ borderRadius: 2 }}
                >
                  <ShapeIcon shape={p.shape} className="w-5 h-5" />
                </span>
                <span
                  aria-hidden
                  className="font-display font-bold text-charcoal/30 text-sm"
                >
                  {String(i + 1).padStart(2, "0")} / {trustPromises.length}
                </span>
              </div>
              <h3 className="font-display font-semibold text-base leading-snug">
                {t(p.titleKey)}
              </h3>
              <p className="text-sm text-charcoal/75 mt-1 leading-relaxed">
                {t(p.bodyKey)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}