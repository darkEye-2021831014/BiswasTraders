import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/config";

const STEPS = ["1", "2", "3", "4"] as const;

export async function ProcessSteps({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  return (
    <section className="py-12 md:py-16">
      <Container>
        <SectionHeading
          eyebrow={t("home.processEyebrow")}
          title={t("home.processTitle")}
        />
        <ol className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((n, i) => {
            const titleKey = `home.process${n}Title` as const;
            const bodyKey = `home.process${n}Body` as const;
            return (
              <li
                key={n}
                className="border border-line bg-canvas p-4 md:p-5 flex flex-col"
                style={{ borderRadius: 2 }}
              >
                <div
                  aria-hidden
                  className="w-10 h-10 grid place-items-center bg-brick text-white font-display font-bold text-sm mb-3"
                  style={{ borderRadius: 2 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="font-display font-semibold text-base">
                  {t(titleKey)}
                </div>
                <p className="text-sm text-charcoal/80 mt-1">{t(bodyKey)}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
