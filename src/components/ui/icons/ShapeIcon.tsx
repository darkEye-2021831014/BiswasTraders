type Shape = "ruler" | "scale" | "truck" | "check";

type Props = {
  shape: Shape;
  className?: string;
};

/**
 * Tiny visual shape used as a decorative mark in the home trust strip.
 * Inherits `currentColor` so it takes the surrounding text colour.
 */
export function ShapeIcon({ shape, className = "w-7 h-7" }: Props) {
  if (shape === "ruler") {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        aria-hidden
      >
        <rect x="3" y="9" width="18" height="6" />
        <path d="M7 9v3M11 9v4M15 9v3M19 9v4" />
      </svg>
    );
  }
  if (shape === "scale") {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        aria-hidden
      >
        <path d="M12 4v16M5 8l-2 6a4 4 0 0 0 8 0L9 8" />
        <path d="M19 8l-2 6a4 4 0 0 0 8 0l-2-6" />
        <path d="M4 20h16" />
      </svg>
    );
  }
  if (shape === "truck") {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        aria-hidden
      >
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    );
  }
  // check
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
    >
      <path d="M4 12l5 5L20 6" />
    </svg>
  );
}