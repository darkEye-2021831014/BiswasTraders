import type { L10n } from "@/i18n/l10n";

type Palette = "brick" | "sand" | "charcoal" | "navy" | "orange";

type Props = {
  slug: string;
  alt: L10n;
  /** Drives the SVG fallback style when the JPG is missing. */
  variant: Palette;
  /** Display size; aspect is 4/3 by default. */
  aspect?: "1/1" | "4/3" | "16/9";
  className?: string;
  /** Higher priority for above-the-fold placements. */
  priority?: boolean;
};

/**
 * Renders the product photo from /public/images/products/<slug>.jpg. If the
 * photo is missing (which it will be until the owner uploads real photos),
 * we fall back to a brutalist SVG placeholder themed to the product.
 */
export function ProductImage({ slug, alt, variant, aspect = "4/3", className, priority = false }: Props) {
  const palette = palettes[variant];
  const aspectClass = aspectClassMap[aspect];
  return (
    <div
      className={`relative overflow-hidden border border-line bg-sand ${aspectClass} ${className ?? ""}`}
    >
      <PlaceholderImage slug={slug} alt={alt} palette={palette} />
      <div className="absolute inset-0 ring-1 ring-inset ring-charcoal/5 pointer-events-none" aria-hidden />
      {/* sr-only alt text for accessibility on placeholder */}
      <span className="sr-only">{alt.bn} / {alt.en}</span>
      {/* Mark whether this is a placeholder, useful for `priority` if next/image is later added */}
      {priority ? <span className="sr-only">Above the fold</span> : null}
    </div>
  );
}

const aspectClassMap: Record<NonNullable<Props["aspect"]>, string> = {
  "1/1": "aspect-square",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-video",
};

const palettes: Record<Palette, { bg: string; fg: string; accent: string; label: string; motif: Motif }> = {
  brick: {
    bg: "#A13828",
    fg: "#FAF8F5",
    accent: "#FD5500",
    label: "BRICKS",
    motif: "brick",
  },
  sand: {
    bg: "#EDE4D8",
    fg: "#1F2421",
    accent: "#A13828",
    label: "SAND",
    motif: "sand",
  },
  charcoal: {
    bg: "#1F2421",
    fg: "#FAF8F5",
    accent: "#FD5500",
    label: "STONE",
    motif: "khoa",
  },
  navy: {
    bg: "#001A2B",
    fg: "#FAF8F5",
    accent: "#FD5500",
    label: "CEMENT",
    motif: "cement",
  },
  orange: {
    bg: "#FD5500",
    fg: "#001A2B",
    accent: "#A13828",
    label: "ROD",
    motif: "rod",
  },
};

type Motif = "brick" | "sand" | "khoa" | "cement" | "rod";

function PlaceholderImage({
  slug,
  alt,
  palette,
}: {
  slug: string;
  alt: L10n;
  palette: (typeof palettes)[Palette];
}) {
  const { bg, fg, accent, label, motif } = palette;
  return (
    <svg
      viewBox="0 0 400 300"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${alt.bn} | ${alt.en}`}
      data-slug={slug}
    >
      <rect width="400" height="300" fill={bg} />
      <Motif motif={motif} accent={accent} fg={fg} />
      <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontWeight={700} letterSpacing="0.12em">
        <text x="20" y="36" fontSize="14" fill={fg} opacity="0.7">PLACEHOLDER</text>
        <text x="20" y="280" fontSize="22" fill={fg}>{label}</text>
        <text x="20" y="296" fontSize="10" fill={fg} opacity="0.6">{slug}.jpg</text>
      </g>
    </svg>
  );
}

function Motif({ motif, accent, fg }: { motif: Motif; accent: string; fg: string }) {
  if (motif === "brick") {
    return (
      <g>
        {/* running-bond pattern */}
        {Array.from({ length: 8 }).map((_, row) => {
          const offset = row % 2 === 0 ? 0 : 24;
          return (
            <g key={row} transform={`translate(${offset}, ${30 + row * 30})`}>
              {Array.from({ length: 9 }).map((_, col) => (
                <rect
                  key={col}
                  x={col * 50}
                  y={0}
                  width={48}
                  height={28}
                  fill={accent}
                  stroke={fg}
                  strokeOpacity={0.15}
                />
              ))}
            </g>
          );
        })}
      </g>
    );
  }
  if (motif === "sand") {
    return (
      <g>
        {/* stipple dots */}
        {Array.from({ length: 220 }).map((_, i) => {
          const x = (i * 37) % 400;
          const y = (i * 53) % 300;
          return <circle key={i} cx={x} cy={y} r={(i % 4) + 1} fill={accent} fillOpacity={0.3 + (i % 5) * 0.1} />;
        })}
      </g>
    );
  }
  if (motif === "khoa") {
    return (
      <g>
        {/* jagged stone silhouettes */}
        {Array.from({ length: 14 }).map((_, i) => (
          <polygon
            key={i}
            points={polygonPoints(i)}
            fill={accent}
            stroke={fg}
            strokeOpacity={0.15}
          />
        ))}
      </g>
    );
  }
  if (motif === "cement") {
    return (
      <g>
        {/* paper bag stack */}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect
            key={i}
            x={60 + (i % 4) * 70}
            y={80 + Math.floor(i / 4) * 50}
            width={60}
            height={42}
            fill={accent}
            stroke={fg}
            strokeOpacity={0.2}
          />
        ))}
      </g>
    );
  }
  // rod: rebar lattice
  return (
    <g stroke={accent} strokeWidth={6} strokeLinecap="round">
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`h${i}`} x1={20} y1={50 + i * 28} x2={380} y2={50 + i * 28} />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`v${i}`} x1={50 + i * 28} y1={30} x2={50 + i * 28} y2={270} />
      ))}
    </g>
  );
}

/** Pseudo-random but stable polygons for the khoa motif. */
function polygonPoints(i: number): string {
  const baseY = 60 + (i * 73) % 220;
  const baseX = 20 + (i * 91) % 280;
  return [
    `${baseX},${baseY}`,
    `${baseX + 60},${baseY - 6}`,
    `${baseX + 80},${baseY + 22}`,
    `${baseX + 60},${baseY + 44}`,
    `${baseX + 12},${baseY + 36}`,
  ].join(" ");
}
