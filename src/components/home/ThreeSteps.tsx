import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/config";

const STEPS = ["1", "2", "3"] as const;

/**
 * Three numbered blueprint-style cards explaining the order flow.
 * Server component, no client JS.
 */
export async function ThreeSteps({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  return (
    <section className="py-12 md:py-16 bg-sand border-y border-line">
      <Container>
        <SectionHeading
          eyebrow={t("home.stepsEyebrow")}
          title={t("home.stepsTitle")}
          subtitle={t("home.stepsSubtitle")}
        />
        <ol className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map((n, i) => {
            const titleKey = `home.step${n}Title` as const;
            const bodyKey = `home.step${n}Body` as const;
            return (
              <li
                key={n}
                className="border border-charcoal bg-canvas p-4 md:p-5 flex flex-col relative"
                style={{ borderRadius: 2 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    aria-hidden
                    className="w-12 h-12 grid place-items-center bg-brick text-white font-display font-bold text-base shadow-stamp-sm"
                    style={{ borderRadius: 2 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="font-display font-bold text-charcoal/70 text-sm"
                  >
                    STEP {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-base leading-snug">
                  {t(titleKey)}
                </h3>
                <p className="text-sm text-charcoal/80 mt-2 leading-relaxed">
                  {t(bodyKey)}
                </p>
                {/* small dimension mark, top-right */}
                <span
                  aria-hidden
                  className="absolute top-2 right-2 text-[10px] uppercase tracking-eyebrow font-display text-charcoal/70"
                >
                  0{i + 1} / 03
                </span>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}