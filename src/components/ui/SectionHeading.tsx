import type { ReactNode } from "react";

type Props = {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  /** When true, the eyebrow uses the orange stamp instead of the default dimension rule. */
  stamp?: boolean;
  /** Heading level. Default `h2` (sub-section). Use `h1` for the page-level title. */
  as?: "h1" | "h2";
};

/**
 * Section heading with a dimension-line rule + an uppercase eyebrow above the title.
 * Bangla headings get the Bangla display font via globals.css.
 */
export function SectionHeading({ eyebrow, title, subtitle, align = "left", stamp = false, as = "h2" }: Props) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const titleSize = as === "h1" ? "text-3xl md:text-5xl tracking-tight" : "text-2xl md:text-4xl";
  const Tag = as;
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
      <Tag className={`${titleSize} font-semibold leading-tight`}>{title}</Tag>
      {subtitle ? (
        <p className="mt-3 text-sm md:text-base text-charcoal/80 max-w-prose">{subtitle}</p>
      ) : null}
    </div>
  );
}
