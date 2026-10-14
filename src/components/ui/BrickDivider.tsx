/**
 * A subtle running-bond brick course divider. Pure CSS / inline SVG.
 * Used between major sections, and as a hero backdrop.
 */
export function BrickDivider({
  className = "",
  tone = "navy",
}: {
  className?: string;
  tone?: "navy" | "sand" | "charcoal";
}) {
  const toneClass = tone === "sand" ? "brick-course brick-course--sand" : tone === "charcoal" ? "brick-course" : "brick-course";
  const overrideBg =
    tone === "charcoal"
      ? "bg-charcoal"
      : tone === "sand"
        ? "bg-sand"
        : "bg-navy";
  return (
    <div
      className={`${toneClass} ${overrideBg} h-12 w-full ${className}`}
      aria-hidden="true"
      role="presentation"
    />
  );
}
