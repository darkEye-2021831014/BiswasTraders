import type { ReactNode } from "react";

type Tone = "default" | "dark" | "ink" | "light" | "orange" | "brick" | "navy";

const toneClass: Record<Tone, string> = {
  default: "stamp",
  dark: "stamp stamp--dark",
  ink: "stamp stamp--ink",
  light: "stamp stamp--light",
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
