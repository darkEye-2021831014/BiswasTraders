import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faq } from "@/content/faq";
import type { Locale } from "@/i18n/config";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";

/**
 * Home-page FAQ preview.
 *
 * Shows the first 4 questions with their answers (using the same
 * `<details>/<summary>` pattern from the full accordion). Links
 * through to the delivery page's full FAQ, which has all 8.
 *
 * JSON-LD is suppressed here because the full FAQPage lives on
 * /delivery. We don't want to double-emit duplicate Q/A structured
 * data on Google's side.
 */
export async function HomeFaqTeaser({ locale }: { locale: Locale }) {
  if (faq.length === 0) return null;
  const t = await getTranslations({ locale, namespace: "homeFaq" });
  const tFaq = await getTranslations({ locale, namespace: "faq" });
  const items = faq.slice(0, 4);

  return (
    <section className="py-12 md:py-16 bg-sand border-b border-line">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
          />
          <Link
            href="/delivery"
            className="inline-flex items-center gap-1 self-start md:self-auto text-sm font-display uppercase tracking-label border border-charcoal h-12 px-4 hover:bg-canvas"
            style={{ borderRadius: 2 }}
          >
            {t("viewAll")} <ArrowIcon className="w-3 h-3" />
          </Link>
        </div>

        <div className="border-t-2 border-charcoal bg-canvas">
          {items.map((entry) => {
            const question = tFaq(entry.questionKey);
            const answer = tFaq(entry.answerKey);
            return (
              <details
                key={entry.id}
                className="group border-b-2 border-charcoal"
              >
                <summary className="flex items-start gap-3 py-4 md:py-5 px-1 cursor-pointer list-none [&::-webkit-details-marker]:hidden focus:outline-none focus-visible:bg-sand">
                  <span
                    aria-hidden
                    className="mt-0.5 w-7 h-7 shrink-0 grid place-items-center border-2 border-charcoal text-charcoal font-display text-base group-open:bg-charcoal group-open:text-canvas transition-colors"
                    style={{ borderRadius: 2 }}
                  >
                    <span className="relative w-3 h-3">
                      <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-current" />
                      <span className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-current group-open:hidden" />
                    </span>
                  </span>
                  <span className="font-display font-semibold text-base md:text-lg leading-snug flex-1">
                    {question}
                  </span>
                </summary>
                <div className="pb-5 pl-10 pr-1 text-sm md:text-base text-charcoal/85 leading-relaxed">
                  <p>{answer}</p>
                  {entry.unconfirmed ? (
                    <p className="mt-2 text-xs italic text-charcoal/60">
                      {locale === "bn"
                        ? "সঠিক তথ্যের জন্য ফোনে জেনে নিন।"
                        : "Please confirm the exact details on a call."}
                    </p>
                  ) : null}
                </div>
              </details>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
