import { waHref, waMeHref } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";
import type { Locale } from "@/i18n/config";

type Props = {
  label: string;
  locale: Locale;
  product?: string;
  quantity?: string;
  location?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  /** When true, builds a bare wa.me link (no prefill) — used for the sticky mobile bar. */
  bare?: boolean;
};

const sizeClass = {
  sm: "h-10 px-3 text-[11px]",
  md: "h-12 px-4 text-xs",
  lg: "h-14 px-5 text-sm",
};

export function WhatsAppButton({
  label,
  locale,
  product,
  quantity,
  location,
  className = "",
  size = "md",
  fullWidth = false,
  bare = false,
}: Props) {
  const href = bare
    ? waMeHref()
    : waHref({ locale, product, quantity, location });
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 font-display font-semibold tracking-label uppercase border touch transition-transform duration-100 active:translate-x-[1px] active:translate-y-[1px] bg-charcoal text-white border-charcoal hover:shadow-stamp-sm ${sizeClass[size]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      <span className="text-wa">
        <WhatsAppIcon className="w-4 h-4" />
      </span>
      {label}
    </a>
  );
}
