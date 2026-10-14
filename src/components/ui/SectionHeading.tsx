import type { ReactNode } from "react";

type Props = {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  /** When true, the eyebrow uses the orange stamp instead of the default dimension rule. */
  stamp?: boolean;
};

/**
 * Section heading with a dimension-line rule + an uppercase eyebrow above the title.
 * Bangla headings get the Bangla display font via globals.css.
 */
export function SectionHeading({ eyebrow, title, subtitle, align = "left", stamp = false }: Props) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-3xl ${alignClass}`}>
      {eyebrow ? (
        <div
          className={`dim-rule mb-3 ${align === "center" ? "justify-center" : ""}`}
          role="presentation"
        >
          {stamp ? (
            <span className="stamp stamp--orange whitespace-nowrap">{eyebrow}</span>
          ) : (
            <span className="whitespace-nowrap">{eyebrow}</span>
          )}
        </div>
      ) : null}
      <h2 className="text-2xl md:text-4xl font-semibold leading-tight">{title}</h2>
      {subtitle ? (
        <p className="mt-3 text-sm md:text-base text-charcoal/80 max-w-prose">{subtitle}</p>
      ) : null}
    </div>
  );
}
