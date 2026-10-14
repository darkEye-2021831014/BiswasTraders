import type { ReactNode } from "react";

type Props = {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
};

/**
 * Page-level H1 with the same dimension-line eyebrow as SectionHeading.
 *
 * Use exactly once per page (above the first section). Lower-level sections
 * should use `SectionHeading` (which renders an `<h2>`).
 */
export function PageHeading({ eyebrow, title, subtitle, align = "left" }: Props) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-3xl ${alignClass}`}>
      {eyebrow ? (
        <div
          className={`dim-rule mb-3 ${align === "center" ? "justify-center" : ""}`}
          role="presentation"
        >
          <span className="whitespace-nowrap">{eyebrow}</span>
        </div>
      ) : null}
      <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-3 text-sm md:text-base text-charcoal/80 max-w-prose">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}