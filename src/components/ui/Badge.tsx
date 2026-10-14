import type { ReactNode } from "react";

type Tone = "default" | "dark" | "orange" | "brick" | "navy";

const toneClass: Record<Tone, string> = {
  default: "stamp",
  dark: "stamp stamp--dark",
  orange: "stamp stamp--orange",
  brick: "stamp stamp--brick",
  navy: "stamp stamp--navy",
};

export function Badge({
  children,
  tone = "default",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return <span className={`${toneClass[tone]} ${className}`}>{children}</span>;
}
