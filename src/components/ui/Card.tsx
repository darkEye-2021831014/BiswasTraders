import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Adds the 3/3/0 charcoal hard shadow. */
  elevated?: boolean;
  /** Background tone. */
  tone?: "canvas" | "sand" | "charcoal" | "navy";
  className?: string;
  /** Removes the default padding so the consumer can control it. */
  bare?: boolean;
  as?: "div" | "article" | "section" | "li";
};

const tones: Record<NonNullable<Props["tone"]>, string> = {
  canvas: "bg-canvas border-line",
  sand: "bg-sand border-sand",
  charcoal: "bg-charcoal text-canvas border-charcoal",
  navy: "bg-navy text-canvas border-navy",
};

export function Card({
  children,
  elevated = false,
  tone = "canvas",
  className = "",
  bare = false,
  as = "div",
}: Props) {
  const Tag = as;
  return (
    <Tag
      className={[
        "border",
        tones[tone],
        elevated ? "shadow-stamp" : "",
        bare ? "" : "p-4 md:p-5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}
