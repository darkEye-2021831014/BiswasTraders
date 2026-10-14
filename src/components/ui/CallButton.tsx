import { telHref } from "@/lib/contact";
import { PhoneIcon } from "@/components/ui/icons/PhoneIcon";

type Props = {
  label: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

const sizeClass = {
  sm: "h-10 px-3 text-[11px]",
  md: "h-12 px-4 text-xs",
  lg: "h-14 px-5 text-sm",
};

export function CallButton({ label, className = "", size = "md", fullWidth = false }: Props) {
  return (
    <a
      href={telHref()}
      className={`inline-flex items-center justify-center gap-2 font-display font-semibold tracking-label uppercase border touch transition-transform duration-100 active:translate-x-[1px] active:translate-y-[1px] bg-brick text-white border-brick hover:bg-brick-hover hover:border-brick-hover hover:shadow-stamp-brick-sm ${sizeClass[size]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      <PhoneIcon className="w-4 h-4" />
      {label}
    </a>
  );
}
