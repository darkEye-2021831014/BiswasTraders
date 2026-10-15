import { getTranslations } from "next-intl/server";
import { faq } from "@/content/faq";
import type { Locale } from "@/i18n/config";
import { FAQPageJsonLd } from "@/components/seo/JsonLd";

/**
 * Native <details>/<summary> accordion. No client-side JS for
 * open/close — the browser handles it, which is the most accessible
 * option (works without JS, screen-reader friendly, keyboard
 * support built in).
 *
 * When the list is empty the component renders nothing. It also
 * emits FAQPage JSON-LD so the Q&A shows up in search results.
 */
export async function FaqAccordion({
  locale,
  namespace = "faq",
  includeJsonLd = true,
}: {
  locale: Locale;
  /** i18n namespace prefix (e.g. "faq" or "homeFaq"). */
  namespace?: string;
  /** Set false to skip the FAQPage JSON-LD (e.g. on the home preview). */
  includeJsonLd?: boolean;
}) {
  if (faq.length === 0) return null;

  const t = await getTranslations({ locale });
  const items = faq.map((entry) => ({
    id: entry.id,
    question: t(`${namespace}.${entry.questionKey}`),
    answer: t(`${namespace}.${entry.answerKey}`),
    unconfirmed: entry.unconfirmed,
  }));

  return (
    <>
      <div className="border-t-2 border-charcoal">
        {items.map((item) => (
          <details
            key={item.id}
            className="group border-b-2 border-charcoal"
          >
            <summary
              className="flex items-start gap-3 py-4 md:py-5 px-1 cursor-pointer list-none [&::-webkit-details-marker]:hidden focus:outline-none focus-visible:bg-sand"
            >
              <span
                aria-hidden
                className="mt-0.5 w-7 h-7 shrink-0 grid place-items-center border-2 border-charcoal text-charcoal font-display text-base group-open:bg-charcoal group-open:text-canvas transition-colors"
                style={{ borderRadius: 2 }}
              >
                <PlusMinus open={undefined as boolean | undefined} />
              </span>
              <span className="font-display font-semibold text-base md:text-lg leading-snug flex-1">
                {item.question}
              </span>
            </summary>
            <div className="pb-5 pl-10 pr-1 text-sm md:text-base text-charcoal/85 leading-relaxed">
              <p>{item.answer}</p>
              {item.unconfirmed ? (
                <p className="mt-2 text-xs italic text-charcoal/70">
                  সঠিক তথ্যের জন্য ফোনে জেনে নিন।
                </p>
              ) : null}
            </div>
          </details>
        ))}
      </div>

      {includeJsonLd ? (
        <FAQPageJsonLd
          items={items.map((it) => ({ question: it.question, answer: it.answer }))}
        />
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------
// Plus / minus icon for the open/close indicator.
// Drawn via a CSS class hook on the parent <summary> so we don't need
// a client component. The default browser disclosure triangle is hidden
// in CSS (see [&::-webkit-details-marker]:hidden above) and we use the
// `open` attribute on <details> for the visual swap.
// ---------------------------------------------------------------------------
function PlusMinus({ open: _open }: { open?: boolean }) {
  // Server-rendered: we can't read the `open` attribute from React, but
  // we can hint the swap via the `group-open:` Tailwind utility, which
  // targets the parent <details> when it has the `open` attribute.
  return (
    <span className="relative w-3 h-3">
      <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-current" />
      <span className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-current group-open:hidden" />
    </span>
  );
}
